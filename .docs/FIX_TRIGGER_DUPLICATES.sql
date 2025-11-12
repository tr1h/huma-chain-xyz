-- Fix setup_nft_daily_rewards trigger to handle duplicate entries
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION setup_nft_daily_rewards()
RETURNS TRIGGER AS $$
DECLARE
    daily_reward INTEGER;
BEGIN
    -- Calculate daily reward based on tier
    CASE NEW.tier_name
        WHEN 'Bronze' THEN daily_reward := 100;
        WHEN 'Silver' THEN daily_reward := 250;
        WHEN 'Gold' THEN daily_reward := 500;
        WHEN 'Platinum' THEN daily_reward := 1000;
        WHEN 'Diamond' THEN daily_reward := 2000;
        ELSE daily_reward := 50;
    END CASE;
    
    -- Insert into nft_daily_rewards with ON CONFLICT DO NOTHING
    -- This prevents duplicate key errors
    INSERT INTO nft_daily_rewards (
        user_nft_id,
        telegram_id,
        tier_name,
        daily_tama_reward,
        last_claim_date
    ) VALUES (
        NEW.id,
        NEW.telegram_id::BIGINT,
        NEW.tier_name,
        daily_reward,
        CURRENT_DATE - INTERVAL '1 day'
    )
    ON CONFLICT (user_nft_id, last_claim_date) DO NOTHING;  -- Ignore duplicates
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

