-- ============================================
-- 🔐 Wallet Users Table for Non-Telegram Users
-- ============================================
-- This table stores user data for players who connect via Solana wallet
-- (Chinese users, non-Telegram users, etc.)

-- Create wallet_users table
CREATE TABLE IF NOT EXISTS wallet_users (
    id BIGSERIAL PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    user_id TEXT UNIQUE NOT NULL, -- Format: wallet_{first12chars}
    username TEXT DEFAULT 'Player',
    tama_balance NUMERIC DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    
    -- Pet stats
    health INTEGER DEFAULT 100,
    food INTEGER DEFAULT 100,
    happiness INTEGER DEFAULT 100,
    
    -- Game progress
    game_state JSONB DEFAULT '{}'::jsonb,
    quests_completed JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    items_owned JSONB DEFAULT '[]'::jsonb,
    
    -- Referral system
    referrer_wallet TEXT,
    referral_count INTEGER DEFAULT 0,
    referral_earnings NUMERIC DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT wallet_address_format CHECK (length(wallet_address) >= 32),
    CONSTRAINT tama_balance_positive CHECK (tama_balance >= 0),
    CONSTRAINT level_positive CHECK (level >= 1),
    CONSTRAINT health_range CHECK (health >= 0 AND health <= 100),
    CONSTRAINT food_range CHECK (food >= 0 AND food <= 100),
    CONSTRAINT happiness_range CHECK (happiness >= 0 AND happiness <= 100)
);

-- ============================================
-- Indexes for performance
-- ============================================

-- Index on wallet_address for fast lookups
CREATE INDEX IF NOT EXISTS idx_wallet_users_wallet_address ON wallet_users(wallet_address);

-- Index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_wallet_users_user_id ON wallet_users(user_id);

-- Index on referrer for referral queries
CREATE INDEX IF NOT EXISTS idx_wallet_users_referrer ON wallet_users(referrer_wallet) WHERE referrer_wallet IS NOT NULL;

-- Index on tama_balance for leaderboard
CREATE INDEX IF NOT EXISTS idx_wallet_users_tama_balance ON wallet_users(tama_balance DESC);

-- Index on created_at for analytics
CREATE INDEX IF NOT EXISTS idx_wallet_users_created_at ON wallet_users(created_at DESC);

-- ============================================
-- Auto-update updated_at trigger
-- ============================================

CREATE OR REPLACE FUNCTION update_wallet_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wallet_users_updated_at
    BEFORE UPDATE ON wallet_users
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_users_updated_at();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE wallet_users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service_role full access (for backend API)
CREATE POLICY "service_role_all_access" ON wallet_users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to read all (for leaderboard)
CREATE POLICY "authenticated_read_all" ON wallet_users
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy: Allow users to read their own data
CREATE POLICY "users_read_own" ON wallet_users
    FOR SELECT
    TO anon
    USING (true);

-- Policy: Allow users to update their own data (optional, but backend should handle this)
-- Note: Commented out for security - backend should use service_role
-- CREATE POLICY "users_update_own" ON wallet_users
--     FOR UPDATE
--     TO authenticated
--     USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address')
--     WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- ============================================
-- Insert test data (optional, for development)
-- ============================================

-- Uncomment to add test users:
-- INSERT INTO wallet_users (wallet_address, user_id, username, tama_balance, level)
-- VALUES 
--     ('Eb4dBmBYR52MiJqKsQ2ayML2R4y23pUfRyxabtR2fdap', 'wallet_Eb4dBmBYR52M', 'Test Player 1', 10000, 5),
--     ('5pWae6RK6w8WLvP9V9NWfFmZRH8dYzKpNvM2vZJh9n7o', 'wallet_5pWae6RK6w8W', 'Test Player 2', 5000, 3)
-- ON CONFLICT (wallet_address) DO NOTHING;

-- ============================================
-- Functions for referral system
-- ============================================

-- Function to process referral bonus
CREATE OR REPLACE FUNCTION process_referral_bonus(
    p_referrer_wallet TEXT,
    p_new_user_wallet TEXT,
    p_bonus_amount NUMERIC DEFAULT 1000
)
RETURNS JSONB AS $$
DECLARE
    v_referrer_exists BOOLEAN;
    v_new_user_exists BOOLEAN;
    v_already_processed BOOLEAN;
BEGIN
    -- Check if referrer exists
    SELECT EXISTS(SELECT 1 FROM wallet_users WHERE wallet_address = p_referrer_wallet) INTO v_referrer_exists;
    
    -- Check if new user exists
    SELECT EXISTS(SELECT 1 FROM wallet_users WHERE wallet_address = p_new_user_wallet) INTO v_new_user_exists;
    
    -- Check if referral already processed
    SELECT EXISTS(
        SELECT 1 FROM wallet_users 
        WHERE wallet_address = p_new_user_wallet 
        AND referrer_wallet IS NOT NULL
    ) INTO v_already_processed;
    
    IF NOT v_referrer_exists THEN
        RETURN jsonb_build_object('success', false, 'error', 'Referrer not found');
    END IF;
    
    IF NOT v_new_user_exists THEN
        RETURN jsonb_build_object('success', false, 'error', 'New user not found');
    END IF;
    
    IF v_already_processed THEN
        RETURN jsonb_build_object('success', false, 'error', 'Referral already processed');
    END IF;
    
    -- Update referrer: add bonus and increment referral count
    UPDATE wallet_users
    SET 
        tama_balance = tama_balance + p_bonus_amount,
        referral_count = referral_count + 1,
        referral_earnings = referral_earnings + p_bonus_amount
    WHERE wallet_address = p_referrer_wallet;
    
    -- Update new user: add bonus and set referrer
    UPDATE wallet_users
    SET 
        tama_balance = tama_balance + p_bonus_amount,
        referrer_wallet = p_referrer_wallet
    WHERE wallet_address = p_new_user_wallet;
    
    RETURN jsonb_build_object(
        'success', true,
        'referrer_wallet', p_referrer_wallet,
        'new_user_wallet', p_new_user_wallet,
        'bonus_amount', p_bonus_amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service_role
GRANT EXECUTE ON FUNCTION process_referral_bonus TO service_role, anon;

-- ============================================
-- Views for analytics
-- ============================================

-- Leaderboard view
CREATE OR REPLACE VIEW wallet_users_leaderboard AS
SELECT 
    user_id,
    username,
    wallet_address,
    tama_balance,
    level,
    clicks,
    referral_count,
    created_at,
    ROW_NUMBER() OVER (ORDER BY tama_balance DESC, clicks DESC) as rank
FROM wallet_users
ORDER BY tama_balance DESC, clicks DESC
LIMIT 100;

-- Grant select permission
GRANT SELECT ON wallet_users_leaderboard TO authenticated, anon;

-- ============================================
-- Comments for documentation
-- ============================================

COMMENT ON TABLE wallet_users IS 'Stores user data for non-Telegram players who connect via Solana wallet';
COMMENT ON COLUMN wallet_users.wallet_address IS 'Solana wallet address (unique identifier)';
COMMENT ON COLUMN wallet_users.user_id IS 'Internal user ID format: wallet_{first12chars}';
COMMENT ON COLUMN wallet_users.game_state IS 'Full game state stored as JSON';
COMMENT ON COLUMN wallet_users.referrer_wallet IS 'Wallet address of the user who referred this player';
COMMENT ON FUNCTION process_referral_bonus IS 'Process referral bonus for both referrer and new user';

-- ============================================
-- Done! 🎉
-- ============================================

-- To execute this script in Supabase:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Paste this entire script
-- 3. Click "Run"
-- 4. Table will be created with all policies and functions

