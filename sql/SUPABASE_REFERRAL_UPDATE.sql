-- 🔗 REFERRAL SYSTEM UPDATE
-- Add referral_code to leaderboard table for fast lookup
-- Run this in Supabase SQL Editor

-- 1. Add referral_code column to leaderboard
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- 2. Create index for fast referral code lookup
CREATE INDEX IF NOT EXISTS idx_leaderboard_referral_code ON leaderboard(referral_code);

-- 3. Add index for referral code in referrals table
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

-- 4. Update existing users with referral codes (if any)
-- This will be done automatically by the bot when users use /ref command

-- ✅ Done! Now referral codes can be stored and looked up efficiently


