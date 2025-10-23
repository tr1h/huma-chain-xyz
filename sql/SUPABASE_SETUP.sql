-- SOLANA TAMAGOTCHI - SUPABASE SCHEMA
-- Run this in Supabase SQL Editor

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id BIGSERIAL PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    nft_mint_address TEXT, -- ✅ Адрес NFT mint
    pet_name TEXT,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    total_xp INT DEFAULT 0,
    tama INT DEFAULT 0,
    pet_type TEXT,
    pet_rarity TEXT,
    pet_data JSONB,
    telegram_id TEXT,
    telegram_username TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id BIGSERIAL PRIMARY KEY,
    referrer_address TEXT NOT NULL,
    referred_address TEXT NOT NULL,
    referral_code TEXT NOT NULL,
    level INT DEFAULT 1,
    signup_reward INT DEFAULT 25,
    total_earned INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(referrer_address, referred_address)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON leaderboard(xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_telegram ON leaderboard(telegram_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_address);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_address);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Public read referrals" ON referrals FOR SELECT USING (true);

-- Public write access (for now - можно ограничить потом)
CREATE POLICY "Public insert leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update leaderboard" ON leaderboard FOR UPDATE USING (true);
CREATE POLICY "Public insert referrals" ON referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update referrals" ON referrals FOR UPDATE USING (true);




