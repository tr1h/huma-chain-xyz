-- Временное снижение цен NFT для тестирования в Devnet
-- Run this in Supabase SQL Editor

-- ========================================
-- STEP 1: SET TEST PRICES (for testing)
-- ========================================

-- Silver: 1 SOL → 0.1 SOL
UPDATE nft_bonding_state
SET 
    current_price = 0.1,
    start_price = 0.1,
    end_price = 0.3,
    increment_per_mint = 0.000571  -- (0.3 - 0.1) / 350
WHERE tier_name = 'Silver';

-- Gold: 3 SOL → 0.2 SOL
UPDATE nft_bonding_state
SET 
    current_price = 0.2,
    start_price = 0.2,
    end_price = 1.0,
    increment_per_mint = 0.006154  -- (1.0 - 0.2) / 130
WHERE tier_name = 'Gold';

-- Platinum: 10 SOL → 0.3 SOL
UPDATE nft_bonding_state
SET 
    current_price = 0.3,
    start_price = 0.3,
    end_price = 3.0,
    increment_per_mint = 0.15  -- (3.0 - 0.3) / 18
WHERE tier_name = 'Platinum';

-- Diamond: 50 SOL → 0.5 SOL
UPDATE nft_bonding_state
SET 
    current_price = 0.5,
    start_price = 0.5,
    end_price = 10.0,
    increment_per_mint = 4.75  -- (10.0 - 0.5) / 2
WHERE tier_name = 'Diamond';

-- Bronze_SOL: 0.15 SOL → 0.05 SOL (optional)
UPDATE nft_bonding_state
SET 
    current_price = 0.05,
    start_price = 0.05,
    end_price = 0.05
WHERE tier_name = 'Bronze_SOL';

-- ========================================
-- CHECK UPDATED PRICES
-- ========================================

SELECT 
    tier_name,
    payment_type,
    current_price || ' ' || payment_type as price,
    minted_count || ' / ' || max_supply as supply,
    increment_per_mint
FROM nft_bonding_state
ORDER BY 
    CASE tier_name
        WHEN 'Bronze' THEN 1
        WHEN 'Bronze_SOL' THEN 2
        WHEN 'Silver' THEN 3
        WHEN 'Gold' THEN 4
        WHEN 'Platinum' THEN 5
        WHEN 'Diamond' THEN 6
    END;

-- ========================================
-- STEP 2: RESTORE ORIGINAL PRICES (after testing)
-- ========================================
-- Uncomment and run this after testing:

/*
-- Silver: restore to 1 SOL
UPDATE nft_bonding_state
SET 
    current_price = 1.0,
    start_price = 1.0,
    end_price = 3.0,
    increment_per_mint = 0.005714  -- (3.0 - 1.0) / 350
WHERE tier_name = 'Silver';

-- Gold: restore to 3 SOL
UPDATE nft_bonding_state
SET 
    current_price = 3.0,
    start_price = 3.0,
    end_price = 10.0,
    increment_per_mint = 0.053846  -- (10.0 - 3.0) / 130
WHERE tier_name = 'Gold';

-- Platinum: restore to 10 SOL
UPDATE nft_bonding_state
SET 
    current_price = 10.0,
    start_price = 10.0,
    end_price = 30.0,
    increment_per_mint = 1.111111  -- (30.0 - 10.0) / 18
WHERE tier_name = 'Platinum';

-- Diamond: restore to 50 SOL
UPDATE nft_bonding_state
SET 
    current_price = 50.0,
    start_price = 50.0,
    end_price = 100.0,
    increment_per_mint = 25.0  -- (100.0 - 50.0) / 2
WHERE tier_name = 'Diamond';

-- Bronze_SOL: restore to 0.15 SOL
UPDATE nft_bonding_state
SET 
    current_price = 0.15,
    start_price = 0.15,
    end_price = 0.15
WHERE tier_name = 'Bronze_SOL';

-- Verify restoration
SELECT 
    tier_name,
    payment_type,
    current_price || ' ' || payment_type as price,
    minted_count || ' / ' || max_supply as supply
FROM nft_bonding_state
ORDER BY 
    CASE tier_name
        WHEN 'Bronze' THEN 1
        WHEN 'Bronze_SOL' THEN 2
        WHEN 'Silver' THEN 3
        WHEN 'Gold' THEN 4
        WHEN 'Platinum' THEN 5
        WHEN 'Diamond' THEN 6
    END;
*/

-- ========================================
-- NOTES
-- ========================================
-- Test prices total: 0.1 + 0.2 + 0.3 + 0.5 = 1.1 SOL
-- You need ~2 SOL in Devnet to test all tiers
-- After testing, run the RESTORE section to return to production prices

