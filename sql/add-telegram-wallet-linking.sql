-- ============================================
-- 🔗 Telegram + Wallet Account Linking System
-- ============================================
-- This allows users to link their Telegram account with Solana wallet
-- So they can play from both Telegram and web browser with the same account

-- ============================================
-- Step 1: Add telegram_id to wallet_users
-- ============================================

-- Add telegram_id column to wallet_users (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='wallet_users' AND column_name='telegram_id') THEN
        ALTER TABLE wallet_users ADD COLUMN telegram_id BIGINT;
        CREATE INDEX idx_wallet_users_telegram_id ON wallet_users(telegram_id) WHERE telegram_id IS NOT NULL;
    END IF;
END $$;

-- ============================================
-- Step 2: Add wallet_address to leaderboard
-- ============================================

-- Add wallet_address column to leaderboard (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='leaderboard' AND column_name='linked_wallet') THEN
        ALTER TABLE leaderboard ADD COLUMN linked_wallet TEXT;
        CREATE INDEX idx_leaderboard_linked_wallet ON leaderboard(linked_wallet) WHERE linked_wallet IS NOT NULL;
    END IF;
END $$;

-- ============================================
-- Step 3: Unified Users View
-- ============================================

-- Create a view that combines both telegram and wallet users
CREATE OR REPLACE VIEW unified_users AS
SELECT 
    COALESCE(l.telegram_id::TEXT, w.telegram_id::TEXT) as telegram_id,
    COALESCE(l.linked_wallet, w.wallet_address) as wallet_address,
    COALESCE(w.user_id, 'tg_' || l.telegram_id::TEXT) as user_id,
    w.username as username, -- Only use wallet_users username (leaderboard doesn't have username column)
    COALESCE(w.tama_balance, l.tama) as tama_balance,
    COALESCE(w.level, l.level) as level,
    w.clicks as clicks, -- Only wallet_users has clicks column
    CASE 
        WHEN w.wallet_address IS NOT NULL AND l.telegram_id IS NOT NULL THEN 'linked'
        WHEN w.wallet_address IS NOT NULL THEN 'wallet_only'
        WHEN l.telegram_id IS NOT NULL THEN 'telegram_only'
    END as account_type,
    COALESCE(w.created_at, l.created_at) as created_at
FROM wallet_users w
FULL OUTER JOIN leaderboard l ON (
    l.telegram_id::BIGINT = w.telegram_id 
    OR l.linked_wallet = w.wallet_address
);

-- Grant select permission
GRANT SELECT ON unified_users TO authenticated, anon;

-- ============================================
-- Step 4: Link Telegram and Wallet Function
-- ============================================

CREATE OR REPLACE FUNCTION link_telegram_with_wallet(
    p_telegram_id BIGINT,
    p_wallet_address TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_telegram_exists BOOLEAN;
    v_wallet_exists BOOLEAN;
    v_already_linked BOOLEAN;
    v_telegram_balance NUMERIC;
    v_telegram_level INTEGER;
    v_telegram_clicks INTEGER;
    v_telegram_username TEXT;
    v_telegram_game_state JSONB;
BEGIN
    -- Check if telegram user exists
    SELECT EXISTS(SELECT 1 FROM leaderboard WHERE telegram_id = p_telegram_id) INTO v_telegram_exists;
    
    -- Check if wallet user exists
    SELECT EXISTS(SELECT 1 FROM wallet_users WHERE wallet_address = p_wallet_address) INTO v_wallet_exists;
    
    -- Check if already linked
    SELECT EXISTS(
        SELECT 1 FROM leaderboard 
        WHERE telegram_id = p_telegram_id 
        AND linked_wallet IS NOT NULL
    ) INTO v_already_linked;
    
    IF NOT v_telegram_exists THEN
        RETURN jsonb_build_object('success', false, 'error', 'Telegram user not found');
    END IF;
    
    IF v_already_linked THEN
        RETURN jsonb_build_object('success', false, 'error', 'Telegram account already linked to another wallet');
    END IF;
    
    -- Get telegram user data (leaderboard doesn't have username/clicks, use defaults)
    SELECT tama, level, 0, 'Player', NULL::jsonb
    INTO v_telegram_balance, v_telegram_level, v_telegram_clicks, v_telegram_username, v_telegram_game_state
    FROM leaderboard
    WHERE telegram_id = p_telegram_id;
    
    -- If wallet user doesn't exist, create it with telegram data
    IF NOT v_wallet_exists THEN
        INSERT INTO wallet_users (
            wallet_address,
            user_id,
            telegram_id,
            username,
            tama_balance,
            level,
            clicks,
            game_state
        ) VALUES (
            p_wallet_address,
            'wallet_' || substring(p_wallet_address, 1, 12),
            p_telegram_id,
            v_telegram_username,
            v_telegram_balance,
            v_telegram_level,
            v_telegram_clicks,
            COALESCE(v_telegram_game_state, '{}'::jsonb)
        );
    ELSE
        -- Wallet user exists, merge data (use higher values)
        UPDATE wallet_users
        SET 
            telegram_id = p_telegram_id,
            tama_balance = GREATEST(tama_balance, v_telegram_balance),
            level = GREATEST(level, v_telegram_level),
            clicks = clicks + v_telegram_clicks,
            game_state = COALESCE(game_state, '{}'::jsonb) || COALESCE(v_telegram_game_state, '{}'::jsonb)
        WHERE wallet_address = p_wallet_address;
    END IF;
    
    -- Update leaderboard with linked wallet
    UPDATE leaderboard
    SET linked_wallet = p_wallet_address
    WHERE telegram_id = p_telegram_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'telegram_id', p_telegram_id,
        'wallet_address', p_wallet_address,
        'merged_balance', GREATEST(v_telegram_balance, COALESCE((SELECT tama_balance FROM wallet_users WHERE wallet_address = p_wallet_address), 0))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION link_telegram_with_wallet TO service_role, anon;

-- ============================================
-- Step 5: Get Unified User Data Function
-- ============================================

CREATE OR REPLACE FUNCTION get_unified_user(
    p_telegram_id BIGINT DEFAULT NULL,
    p_wallet_address TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF p_telegram_id IS NULL AND p_wallet_address IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Either telegram_id or wallet_address required');
    END IF;
    
    SELECT jsonb_build_object(
        'success', true,
        'user', jsonb_build_object(
            'telegram_id', telegram_id,
            'wallet_address', wallet_address,
            'user_id', user_id,
            'username', username,
            'tama_balance', tama_balance,
            'level', level,
            'clicks', clicks,
            'account_type', account_type,
            'created_at', created_at
        )
    )
    INTO v_result
    FROM unified_users
    WHERE (p_telegram_id IS NOT NULL AND telegram_id = p_telegram_id::TEXT)
       OR (p_wallet_address IS NOT NULL AND wallet_address = p_wallet_address)
    LIMIT 1;
    
    IF v_result IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'User not found');
    END IF;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_unified_user TO service_role, anon;

-- ============================================
-- Step 6: Auto-sync function (keeps both tables in sync)
-- ============================================

CREATE OR REPLACE FUNCTION sync_linked_accounts()
RETURNS TRIGGER AS $$
BEGIN
    -- If wallet_users updated and has telegram_id, update leaderboard
    IF TG_TABLE_NAME = 'wallet_users' AND NEW.telegram_id IS NOT NULL THEN
        UPDATE leaderboard
        SET 
            tama = NEW.tama_balance,
            level = NEW.level,
            -- clicks not synced (leaderboard doesn't have clicks column)
            linked_wallet = NEW.wallet_address
        WHERE telegram_id = NEW.telegram_id;
    END IF;
    
    -- If leaderboard updated and has linked_wallet, update wallet_users
    IF TG_TABLE_NAME = 'leaderboard' AND NEW.linked_wallet IS NOT NULL THEN
        UPDATE wallet_users
        SET 
            tama_balance = NEW.tama,
            level = NEW.level,
            -- clicks not synced (leaderboard doesn't have clicks column)
            -- username not updated (leaderboard doesn't have username column)
            telegram_id = NEW.telegram_id
        WHERE wallet_address = NEW.linked_wallet;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-sync
DROP TRIGGER IF EXISTS trigger_sync_wallet_users ON wallet_users;
CREATE TRIGGER trigger_sync_wallet_users
    AFTER UPDATE ON wallet_users
    FOR EACH ROW
    WHEN (OLD.tama_balance IS DISTINCT FROM NEW.tama_balance 
       OR OLD.level IS DISTINCT FROM NEW.level)
    EXECUTE FUNCTION sync_linked_accounts();

DROP TRIGGER IF EXISTS trigger_sync_leaderboard ON leaderboard;
CREATE TRIGGER trigger_sync_leaderboard
    AFTER UPDATE ON leaderboard
    FOR EACH ROW
    WHEN (OLD.tama IS DISTINCT FROM NEW.tama 
       OR OLD.level IS DISTINCT FROM NEW.level)
    EXECUTE FUNCTION sync_linked_accounts();

-- ============================================
-- Comments for documentation
-- ============================================

COMMENT ON COLUMN wallet_users.telegram_id IS 'Telegram ID if account is linked to Telegram';
COMMENT ON COLUMN leaderboard.linked_wallet IS 'Wallet address if account is linked to Solana wallet';
COMMENT ON VIEW unified_users IS 'Combined view of Telegram and Wallet users';
COMMENT ON FUNCTION link_telegram_with_wallet IS 'Links Telegram account with Solana wallet, merges data';
COMMENT ON FUNCTION get_unified_user IS 'Get user data from either Telegram ID or wallet address';
COMMENT ON FUNCTION sync_linked_accounts IS 'Auto-syncs data between wallet_users and leaderboard when linked';

-- ============================================
-- Example usage
-- ============================================

-- Link Telegram user (123456789) with wallet (Eb4dB...)
-- SELECT link_telegram_with_wallet(123456789, 'Eb4dBmBYR52MiJqKsQ2ayML2R4y23pUfRyxabtR2fdap');

-- Get user by Telegram ID
-- SELECT get_unified_user(p_telegram_id := 123456789);

-- Get user by wallet address
-- SELECT get_unified_user(p_wallet_address := 'Eb4dBmBYR52MiJqKsQ2ayML2R4y23pUfRyxabtR2fdap');

-- View all unified users
-- SELECT * FROM unified_users;

-- ============================================
-- Done! 🎉
-- ============================================

