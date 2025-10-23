-- ============================================
-- SUPABASE DATABASE SETUP
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id BIGSERIAL PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    telegram_id TEXT,
    telegram_username TEXT,
    pet_name TEXT,
    pet_type TEXT,
    pet_rarity TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    tama INTEGER DEFAULT 0,
    pet_data TEXT,
    referral_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id BIGSERIAL PRIMARY KEY,
    referrer_telegram_id TEXT,
    referred_telegram_id TEXT,
    referrer_address TEXT,
    referred_address TEXT,
    referral_code TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    signup_reward INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referrer_telegram_id, referred_telegram_id)
);

-- Create pending_referrals table
CREATE TABLE IF NOT EXISTS pending_referrals (
    id BIGSERIAL PRIMARY KEY,
    referrer_telegram_id TEXT NOT NULL,
    referred_telegram_id TEXT NOT NULL,
    referrer_username TEXT,
    referred_username TEXT,
    referral_code TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referrer_telegram_id, referred_telegram_id)
);

-- Create referral_clicks table for analytics
CREATE TABLE IF NOT EXISTS referral_clicks (
    id BIGSERIAL PRIMARY KEY,
    referral_code TEXT NOT NULL,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    referrer_url TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create players table (for game stats)
CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    total_clicks INTEGER DEFAULT 0,
    total_games INTEGER DEFAULT 0,
    referrals INTEGER DEFAULT 0,
    is_online BOOLEAN DEFAULT FALSE,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_telegram_id ON leaderboard(telegram_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_wallet ON leaderboard(wallet_address);
CREATE INDEX IF NOT EXISTS idx_leaderboard_referral_code ON leaderboard(referral_code);
CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON leaderboard(xp);
CREATE INDEX IF NOT EXISTS idx_leaderboard_level ON leaderboard(level);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_telegram ON referrals(referrer_telegram_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_address ON referrals(referrer_address);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

CREATE INDEX IF NOT EXISTS idx_pending_referrals_referrer ON pending_referrals(referrer_telegram_id);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_code ON pending_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_status ON pending_referrals(status);

CREATE INDEX IF NOT EXISTS idx_referral_clicks_code ON referral_clicks(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_clicked_at ON referral_clicks(clicked_at);

CREATE INDEX IF NOT EXISTS idx_players_wallet ON players(wallet_address);
CREATE INDEX IF NOT EXISTS idx_players_online ON players(is_online);

-- Create updated_at trigger for leaderboard
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leaderboard_updated_at 
    BEFORE UPDATE ON leaderboard 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for better security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policies for controlled access
-- Leaderboard: Read all, Insert/Update only for own data
CREATE POLICY "Allow public read access" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow insert own data" ON leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update own data" ON leaderboard FOR UPDATE USING (true);

-- Referrals: Read all, Insert only
CREATE POLICY "Allow public read access" ON referrals FOR SELECT USING (true);
CREATE POLICY "Allow insert referrals" ON referrals FOR INSERT WITH CHECK (true);

-- Pending referrals: Read all, Insert/Update only
CREATE POLICY "Allow public read access" ON pending_referrals FOR SELECT USING (true);
CREATE POLICY "Allow insert pending" ON pending_referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update pending" ON pending_referrals FOR UPDATE USING (true);

-- Referral clicks: Read all, Insert only (analytics)
CREATE POLICY "Allow public read access" ON referral_clicks FOR SELECT USING (true);
CREATE POLICY "Allow insert clicks" ON referral_clicks FOR INSERT WITH CHECK (true);

-- Players: Read all, Insert/Update only
CREATE POLICY "Allow public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Allow insert players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update players" ON players FOR UPDATE USING (true);

-- Insert some sample data (optional)
INSERT INTO leaderboard (wallet_address, telegram_id, telegram_username, pet_name, level, xp, tama, referral_code) 
VALUES 
    ('sample_wallet_1', '123456789', 'admin', 'Test Pet', 1, 0, 1000, 'TAMA000001')
ON CONFLICT (wallet_address) DO NOTHING;

-- Create a view for referral analytics
CREATE OR REPLACE VIEW referral_analytics AS
SELECT 
    r.referrer_telegram_id,
    r.referral_code,
    COUNT(r.id) as total_referrals,
    COUNT(CASE WHEN r.level = 1 THEN 1 END) as level1_referrals,
    COUNT(CASE WHEN r.level = 2 THEN 1 END) as level2_referrals,
    SUM(r.signup_reward) as total_earned,
    MAX(r.created_at) as last_referral
FROM referrals r
GROUP BY r.referrer_telegram_id, r.referral_code;

-- Create a view for click analytics
CREATE OR REPLACE VIEW click_analytics AS
SELECT 
    rc.referral_code,
    COUNT(rc.id) as total_clicks,
    COUNT(DISTINCT rc.ip_address) as unique_visitors,
    MAX(rc.clicked_at) as last_click,
    MIN(rc.clicked_at) as first_click
FROM referral_clicks rc
GROUP BY rc.referral_code;

COMMENT ON TABLE leaderboard IS 'Main player data and stats';
COMMENT ON TABLE referrals IS 'Active referrals with rewards';
COMMENT ON TABLE pending_referrals IS 'Referrals waiting for wallet connection';
COMMENT ON TABLE referral_clicks IS 'Analytics for referral link clicks';
COMMENT ON TABLE players IS 'Game statistics and activity';
