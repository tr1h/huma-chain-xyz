-- Sync NFT Bonding State minted_count with actual user_nfts data
-- This fixes the mismatch between minted_count and actual NFTs in database

-- 1. Update Bronze (TAMA) minted count
-- Count NFTs where tier_name = 'Bronze' (assume most Bronze are TAMA)
UPDATE nft_bonding_state
SET minted_count = (
    SELECT COUNT(*) 
    FROM user_nfts 
    WHERE tier_name = 'Bronze'
)
WHERE tier_name = 'Bronze' AND payment_type = 'TAMA';

-- 2. Update Bronze_SOL minted count
-- Count NFTs where nft_mint_address contains 'bronze' and 'sol' (Bronze paid with SOL)
-- Note: Currently may be 0 as Bronze SOL is a separate tier
UPDATE nft_bonding_state
SET minted_count = (
    SELECT COUNT(*) 
    FROM user_nfts 
    WHERE tier_name = 'Bronze' 
    AND nft_mint_address LIKE '%bronze%sol%'
)
WHERE tier_name = 'Bronze_SOL' AND payment_type = 'SOL';

-- 3. Update Silver minted count
UPDATE nft_bonding_state
SET minted_count = (
    SELECT COUNT(*) 
    FROM user_nfts 
    WHERE tier_name = 'Silver'
)
WHERE tier_name = 'Silver' AND payment_type = 'SOL';

-- 4. Update Gold minted count
UPDATE nft_bonding_state
SET minted_count = (
    SELECT COUNT(*) 
    FROM user_nfts 
    WHERE tier_name = 'Gold'
)
WHERE tier_name = 'Gold' AND payment_type = 'SOL';

-- 5. Update Platinum minted count
UPDATE nft_bonding_state
SET minted_count = (
    SELECT COUNT(*) 
    FROM user_nfts 
    WHERE tier_name = 'Platinum'
)
WHERE tier_name = 'Platinum' AND payment_type = 'SOL';

-- 6. Update Diamond minted count
UPDATE nft_bonding_state
SET minted_count = (
    SELECT COUNT(*) 
    FROM user_nfts 
    WHERE tier_name = 'Diamond'
)
WHERE tier_name = 'Diamond' AND payment_type = 'SOL';

-- Verify sync
SELECT 
    nbs.tier_name,
    nbs.payment_type,
    nbs.minted_count AS bonding_count,
    COUNT(un.id) AS actual_count,
    CASE 
        WHEN nbs.minted_count = COUNT(un.id) THEN '✅ Synced'
        ELSE '❌ Mismatch'
    END AS status
FROM nft_bonding_state nbs
LEFT JOIN user_nfts un ON 
    -- Simple match by tier name
    un.tier_name = nbs.tier_name
    -- For Bronze_SOL, match Bronze NFTs with 'sol' in mint address
    OR (nbs.tier_name = 'Bronze_SOL' AND un.tier_name = 'Bronze' AND un.nft_mint_address LIKE '%sol%')
GROUP BY nbs.tier_name, nbs.payment_type, nbs.minted_count
ORDER BY nbs.tier_name;

