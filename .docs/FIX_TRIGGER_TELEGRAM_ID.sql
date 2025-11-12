-- Fix setup_nft_daily_rewards trigger to properly handle telegram_id type
-- Run this in Supabase SQL Editor

-- Drop and recreate the trigger function with explicit BIGINT cast
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
    
    -- Insert into nft_daily_rewards with explicit BIGINT cast
    INSERT INTO nft_daily_rewards (
        user_nft_id,
        telegram_id,
        tier_name,
        daily_tama_reward,
        last_claim_date
    ) VALUES (
        NEW.id,
        NEW.telegram_id::BIGINT,  -- Explicit cast to BIGINT
        NEW.tier_name,
        daily_reward,
        CURRENT_DATE - INTERVAL '1 day'  -- Can claim immediately
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_setup_nft_daily_rewards ON user_nfts;
CREATE TRIGGER trigger_setup_nft_daily_rewards
    AFTER INSERT ON user_nfts
    FOR EACH ROW
    EXECUTE FUNCTION setup_nft_daily_rewards();

