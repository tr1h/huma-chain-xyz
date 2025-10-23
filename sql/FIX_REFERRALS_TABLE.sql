-- Fix referrals table - add Telegram ID columns
-- Execute this in Supabase SQL Editor

-- Add Telegram ID columns to referrals table
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS referrer_telegram_id TEXT;
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS referred_telegram_id TEXT;

-- Create indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_tg_id ON referrals(referrer_telegram_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_tg_id ON referrals(referred_telegram_id);

-- Update existing records if any (optional)
-- UPDATE referrals SET referrer_telegram_id = 'placeholder' WHERE referrer_telegram_id IS NULL;
-- UPDATE referrals SET referred_telegram_id = 'placeholder' WHERE referred_telegram_id IS NULL;

