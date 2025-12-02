-- ============================================
-- 🏆 Unified Leaderboard System
-- ============================================
-- This creates a single leaderboard that shows ALL players
-- from both Telegram (leaderboard table) and Website (wallet_users table)
-- Removes duplicates for linked accounts

-- ============================================
-- Step 1: Create Unified Leaderboard Function
-- ============================================

CREATE OR REPLACE FUNCTION get_unified_leaderboard(
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    rank BIGINT,
    user_id TEXT,
    username TEXT,
    tama_balance NUMERIC,
    level INTEGER,
    clicks INTEGER,
    account_type TEXT,
    wallet_address TEXT,
    telegram_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    WITH combined_users AS (
        -- Get Telegram users (who are NOT linked to wallet)
        SELECT 
            'tg_' || l.telegram_id::TEXT as user_id,
            'Player' as username, -- leaderboard doesn't have username
            l.tama as tama_balance,
            l.level,
            0 as clicks, -- leaderboard doesn't have clicks
            CASE 
                WHEN l.linked_wallet IS NOT NULL THEN 'linked'
                ELSE 'telegram'
            END as account_type,
            l.linked_wallet as wallet_address,
            l.telegram_id::TEXT as telegram_id,
            l.created_at
        FROM leaderboard l
        WHERE l.linked_wallet IS NULL -- Only non-linked Telegram users
        
        UNION ALL
        
        -- Get Wallet users (including linked ones - they are primary source)
        SELECT 
            w.user_id,
            COALESCE(w.username, 'Player') as username,
            w.tama_balance,
            w.level,
            COALESCE(w.clicks, 0) as clicks,
            CASE 
                WHEN w.telegram_id IS NOT NULL THEN 'linked'
                ELSE 'wallet'
            END as account_type,
            w.wallet_address,
            w.telegram_id::TEXT as telegram_id,
            w.created_at
        FROM wallet_users w
        
        UNION ALL
        
        -- Get Telegram users who ARE linked (use their wallet data as primary)
        -- This ensures linked accounts appear with wallet data
        SELECT 
            'tg_' || l.telegram_id::TEXT as user_id,
            'Player' as username,
            l.tama as tama_balance,
            l.level,
            0 as clicks,
            'linked' as account_type,
            l.linked_wallet as wallet_address,
            l.telegram_id::TEXT as telegram_id,
            l.created_at
        FROM leaderboard l
        WHERE l.linked_wallet IS NOT NULL
        AND NOT EXISTS (
            -- Don't include if wallet_users already has this data
            SELECT 1 FROM wallet_users w 
            WHERE w.wallet_address = l.linked_wallet
        )
    ),
    ranked_users AS (
        SELECT 
            ROW_NUMBER() OVER (ORDER BY tama_balance DESC, created_at ASC) as rank,
            user_id,
            username,
            tama_balance,
            level,
            clicks,
            account_type,
            wallet_address,
            telegram_id,
            created_at
        FROM combined_users
    )
    SELECT * FROM ranked_users
    ORDER BY rank
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_unified_leaderboard TO service_role, authenticated, anon;

-- ============================================
-- Step 2: Get User Rank in Unified Leaderboard
-- ============================================

CREATE OR REPLACE FUNCTION get_user_rank_unified(
    p_telegram_id BIGINT DEFAULT NULL,
    p_wallet_address TEXT DEFAULT NULL,
    p_user_id TEXT DEFAULT NULL
)
RETURNS TABLE (
    rank BIGINT,
    user_id TEXT,
    username TEXT,
    tama_balance NUMERIC,
    level INTEGER,
    total_players BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH combined_users AS (
        -- Get Telegram users (who are NOT linked to wallet)
        SELECT 
            'tg_' || l.telegram_id::TEXT as user_id,
            'Player' as username,
            l.tama as tama_balance,
            l.level,
            l.telegram_id as tg_id,
            l.linked_wallet as wallet_addr,
            l.created_at
        FROM leaderboard l
        WHERE l.linked_wallet IS NULL
        
        UNION ALL
        
        -- Get Wallet users (including linked ones)
        SELECT 
            w.user_id,
            COALESCE(w.username, 'Player') as username,
            w.tama_balance,
            w.level,
            w.telegram_id as tg_id,
            w.wallet_address as wallet_addr,
            w.created_at
        FROM wallet_users w
        
        UNION ALL
        
        -- Get Telegram users who ARE linked (if not in wallet_users)
        SELECT 
            'tg_' || l.telegram_id::TEXT as user_id,
            'Player' as username,
            l.tama as tama_balance,
            l.level,
            l.telegram_id as tg_id,
            l.linked_wallet as wallet_addr,
            l.created_at
        FROM leaderboard l
        WHERE l.linked_wallet IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM wallet_users w 
            WHERE w.wallet_address = l.linked_wallet
        )
    ),
    ranked_users AS (
        SELECT 
            ROW_NUMBER() OVER (ORDER BY tama_balance DESC, created_at ASC) as rank,
            user_id,
            username,
            tama_balance,
            level,
            tg_id,
            wallet_addr
        FROM combined_users
    ),
    total_count AS (
        SELECT COUNT(*) as total FROM combined_users
    )
    SELECT 
        r.rank,
        r.user_id,
        r.username,
        r.tama_balance,
        r.level,
        t.total as total_players
    FROM ranked_users r
    CROSS JOIN total_count t
    WHERE 
        (p_telegram_id IS NOT NULL AND r.tg_id = p_telegram_id)
        OR (p_wallet_address IS NOT NULL AND r.wallet_addr = p_wallet_address)
        OR (p_user_id IS NOT NULL AND r.user_id = p_user_id)
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_rank_unified TO service_role, authenticated, anon;

-- ============================================
-- Step 3: Get Total Players Count
-- ============================================

CREATE OR REPLACE FUNCTION get_total_players_unified()
RETURNS BIGINT AS $$
DECLARE
    total_count BIGINT;
BEGIN
    WITH combined_users AS (
        -- Telegram users (non-linked)
        SELECT telegram_id FROM leaderboard WHERE linked_wallet IS NULL
        
        UNION
        
        -- Wallet users
        SELECT NULL::BIGINT FROM wallet_users
        
        UNION
        
        -- Telegram users (linked, but not in wallet_users)
        SELECT l.telegram_id 
        FROM leaderboard l
        WHERE l.linked_wallet IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM wallet_users w 
            WHERE w.wallet_address = l.linked_wallet
        )
    )
    SELECT COUNT(*) INTO total_count FROM combined_users;
    
    RETURN total_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_total_players_unified TO service_role, authenticated, anon;

-- ============================================
-- Step 4: Comments for documentation
-- ============================================

COMMENT ON FUNCTION get_unified_leaderboard IS 'Returns unified leaderboard combining Telegram and Wallet users, removing duplicates for linked accounts';
COMMENT ON FUNCTION get_user_rank_unified IS 'Gets user rank in unified leaderboard by telegram_id, wallet_address, or user_id';
COMMENT ON FUNCTION get_total_players_unified IS 'Returns total count of unique players across both Telegram and Wallet';

-- ============================================
-- Example usage
-- ============================================

-- Get top 100 players
-- SELECT * FROM get_unified_leaderboard(100, 0);

-- Get top 50 players
-- SELECT * FROM get_unified_leaderboard(50, 0);

-- Get user rank by Telegram ID
-- SELECT * FROM get_user_rank_unified(p_telegram_id := 123456789);

-- Get user rank by wallet address
-- SELECT * FROM get_user_rank_unified(p_wallet_address := 'D8iLr9CS2sJcRcKU1smUv2yGYnTKpbEgonCAdwoJaUFy');

-- Get user rank by user_id
-- SELECT * FROM get_user_rank_unified(p_user_id := 'wallet_D8iLr9CS2sJc');

-- Get total players
-- SELECT get_total_players_unified();

-- ============================================
-- Done! 🎉
-- ============================================

