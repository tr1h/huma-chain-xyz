-- ============================================
-- DELETE OFF-CHAIN NFT - SAFE EXECUTION
-- ============================================
-- Created: 2025-11-16
-- Purpose: Remove off-chain only NFT, keep real on-chain NFT
--
-- ⚠️ BEFORE RUNNING: Make BACKUP in Supabase!
-- ============================================

-- ============================================
-- STEP 1: CHECK WHAT WILL BE DELETED
-- ============================================

SELECT 
    COUNT(*) as total_off_chain_nfts,
    COUNT(DISTINCT telegram_id) as affected_users
FROM user_nfts
WHERE is_active = true
  AND (
    nft_mint_address IS NULL 
    OR LENGTH(nft_mint_address) < 30
    OR nft_mint_address LIKE '%\_%'
  );

-- Expected result: ~17 off-chain NFT

-- ============================================
-- STEP 2: LIST OF AFFECTED USERS
-- ============================================

SELECT 
    u.telegram_id,
    l.telegram_username,
    COUNT(*) as off_chain_nfts,
    STRING_AGG(u.tier_name || ' ' || u.rarity, ', ') as nfts_list
FROM user_nfts u
LEFT JOIN leaderboard l ON u.telegram_id = l.telegram_id
WHERE u.is_active = true
  AND (
    u.nft_mint_address IS NULL 
    OR LENGTH(u.nft_mint_address) < 30
    OR u.nft_mint_address LIKE '%\_%'
  )
GROUP BY u.telegram_id, l.telegram_username
ORDER BY off_chain_nfts DESC;

-- ============================================
-- STEP 3: SOFT DELETE (SAFE, CAN ROLLBACK!)
-- ============================================

-- SIMPLE VERSION (no deactivation_reason column)
UPDATE user_nfts
SET is_active = false
WHERE is_active = true
  AND (
    nft_mint_address IS NULL 
    OR LENGTH(nft_mint_address) < 30
    OR nft_mint_address LIKE '%\_%'
  );

-- This should update ~17 rows

-- ============================================
-- STEP 4: VERIFY RESULTS
-- ============================================

SELECT 
    CASE
        WHEN is_active THEN 'Active (On-Chain)'
        ELSE 'Deactivated (Was Off-Chain)'
    END as status,
    COUNT(*) as count
FROM user_nfts
GROUP BY is_active;

-- Expected:
-- Active (On-Chain): 2
-- Deactivated (Was Off-Chain): 17

-- ============================================
-- STEP 5: UPDATE BONDING CURVE COUNTS
-- ============================================
-- Recalculate minted_count to reflect only real on-chain NFT

UPDATE nft_bonding_state nbs
SET minted_count = (
    SELECT COUNT(*)
    FROM user_nfts u
    WHERE u.tier_name = nbs.tier_name
      AND u.is_active = true
      AND u.nft_mint_address IS NOT NULL
      AND LENGTH(u.nft_mint_address) > 30
      AND u.nft_mint_address NOT LIKE '%\_%'
);

-- ============================================
-- STEP 6: FINAL CHECK
-- ============================================

-- Check active NFT (should be only on-chain)
SELECT 
    id,
    telegram_id,
    tier_name,
    rarity,
    nft_mint_address,
    CASE
        WHEN nft_mint_address IS NULL THEN 'No Address'
        WHEN LENGTH(nft_mint_address) < 30 THEN 'Off-Chain'
        WHEN nft_mint_address LIKE '%\_%' THEN 'Off-Chain'
        ELSE 'On-Chain'
    END as nft_type
FROM user_nfts
WHERE is_active = true
ORDER BY minted_at DESC;

-- All should be "On-Chain"

-- Check bonding curve counts
SELECT 
    tier_name,
    payment_type,
    minted_count,
    max_supply,
    current_price
FROM nft_bonding_state
ORDER BY 
    CASE tier_name
        WHEN 'Bronze' THEN 1
        WHEN 'Silver' THEN 2
        WHEN 'Gold' THEN 3
        WHEN 'Platinum' THEN 4
        WHEN 'Diamond' THEN 5
    END;

-- ============================================
-- ROLLBACK (IF NEEDED)
-- ============================================
-- If something went wrong, you can restore off-chain NFT:
-- NOTE: This will restore ALL deactivated NFT, be careful!

-- To see deactivated NFT:
-- SELECT id, telegram_id, tier_name, rarity, nft_mint_address, is_active, minted_at
-- FROM user_nfts
-- WHERE is_active = false
-- ORDER BY minted_at DESC;

-- To restore specific NFT by ID:
-- UPDATE user_nfts
-- SET is_active = true
-- WHERE id IN (103, 104, 105, ...);  -- Replace with actual IDs

-- To restore ALL off-chain NFT (use with caution!):
-- UPDATE user_nfts
-- SET is_active = true
-- WHERE is_active = false
--   AND (
--     nft_mint_address IS NULL 
--     OR LENGTH(nft_mint_address) < 30
--     OR nft_mint_address LIKE '%\_%'
--   );

-- ============================================
-- COMPLETED! ✅
-- ============================================
-- All off-chain NFT are now deactivated
-- Only real on-chain NFT remain active
-- Bonding curve counts updated
-- ============================================

