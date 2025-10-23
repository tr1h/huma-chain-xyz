-- 🔗 PENDING REFERRALS TABLE
-- This table stores referrals BEFORE users connect their wallets
-- When user connects wallet, data moves to main 'referrals' table
-- Run this in Supabase SQL Editor

-- 1. Create pending_referrals table
CREATE TABLE IF NOT EXISTS pending_referrals (
    id BIGSERIAL PRIMARY KEY,
    referrer_telegram_id TEXT NOT NULL,
    referred_telegram_id TEXT NOT NULL,
    referrer_username TEXT,
    referred_username TEXT,
    referral_code TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, connected, expired
    created_at TIMESTAMPTZ DEFAULT NOW(),
    connected_at TIMESTAMPTZ,
    UNIQUE(referrer_telegram_id, referred_telegram_id)
);

-- 2. Create indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_pending_referrals_referrer ON pending_referrals(referrer_telegram_id);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_referred ON pending_referrals(referred_telegram_id);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_code ON pending_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_status ON pending_referrals(status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE pending_referrals ENABLE ROW LEVEL SECURITY;

-- 4. Public read/write access
CREATE POLICY "Public read pending_referrals" ON pending_referrals FOR SELECT USING (true);
CREATE POLICY "Public insert pending_referrals" ON pending_referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update pending_referrals" ON pending_referrals FOR UPDATE USING (true);

-- ✅ Done! Now bot can track referrals before wallet connection


