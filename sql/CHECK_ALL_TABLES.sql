-- 🔍 CHECK ALL TABLES - Execute this in Supabase SQL Editor
-- This will ensure all tables and columns exist

-- =====================================================
-- 1. LEADERBOARD TABLE - Add referral_code column
-- =====================================================
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS referral_code TEXT;
CREATE INDEX IF NOT EXISTS idx_leaderboard_referral_code ON leaderboard(referral_code);

-- =====================================================
-- 2. REFERRALS TABLE - Add Telegram ID columns
-- =====================================================
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS referrer_telegram_id TEXT;
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS referred_telegram_id TEXT;

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_tg_id ON referrals(referrer_telegram_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_tg_id ON referrals(referred_telegram_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

-- =====================================================
-- 3. PENDING_REFERRALS TABLE - Create if not exists
-- =====================================================
CREATE TABLE IF NOT EXISTS pending_referrals (
    id BIGSERIAL PRIMARY KEY,
    referrer_telegram_id TEXT NOT NULL,
    referred_telegram_id TEXT NOT NULL,
    referrer_username TEXT,
    referred_username TEXT,
    referral_code TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    connected_at TIMESTAMPTZ,
    UNIQUE(referrer_telegram_id, referred_telegram_id)
);

CREATE INDEX IF NOT EXISTS idx_pending_referrals_referrer ON pending_referrals(referrer_telegram_id);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_referred ON pending_referrals(referred_telegram_id);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_code ON pending_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_status ON pending_referrals(status);

-- Enable Row Level Security (RLS)
ALTER TABLE pending_referrals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors)
DROP POLICY IF EXISTS "Public read pending_referrals" ON pending_referrals;
DROP POLICY IF EXISTS "Public insert pending_referrals" ON pending_referrals;
DROP POLICY IF EXISTS "Public update pending_referrals" ON pending_referrals;

-- Create policies
CREATE POLICY "Public read pending_referrals" ON pending_referrals FOR SELECT USING (true);
CREATE POLICY "Public insert pending_referrals" ON pending_referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update pending_referrals" ON pending_referrals FOR UPDATE USING (true);

-- =====================================================
-- ✅ ALL TABLES CHECKED AND UPDATED!
-- =====================================================

-- Optional: View current structure
SELECT 'leaderboard columns:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'leaderboard';

SELECT 'referrals columns:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'referrals';

SELECT 'pending_referrals columns:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pending_referrals';


