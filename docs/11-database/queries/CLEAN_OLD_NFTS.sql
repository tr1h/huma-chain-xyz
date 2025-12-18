-- Clean Old Test NFTs (optional)
-- Run this in Supabase SQL Editor if you want to remove old test NFTs

-- ========================================
-- OPTION 1: VIEW OLD NFTs (before deleting)
-- ========================================

-- See all old NFTs (before Nov 10, 2025)
SELECT 
    id,
    telegram_id,
    tier_name,
    rarity,
    nft_mint_address,
    minted_at,
    is_active
FROM user_nfts
WHERE minted_at < '2025-11-10'
ORDER BY minted_at DESC;

-- Count old NFTs
SELECT 
    tier_name,
    COUNT(*) as count
FROM user_nfts
WHERE minted_at < '2025-11-10'
GROUP BY tier_name;

-- ========================================
-- OPTION 2: DEACTIVATE OLD NFTs (safe option)
-- ========================================

-- Mark old NFTs as inactive (instead of deleting)
UPDATE user_nfts
SET is_active = false
WHERE minted_at < '2025-11-10';

-- Verify deactivation
SELECT 
    COUNT(*) as inactive_nfts
FROM user_nfts
WHERE is_active = false;

-- ========================================
-- OPTION 3: DELETE OLD NFTs (permanent!)
-- ========================================
-- ⚠️ WARNING: This is permanent! Backup first!

/*
-- Delete old NFTs (before Nov 10, 2025)
DELETE FROM user_nfts
WHERE minted_at < '2025-11-10';

-- Verify deletion
SELECT COUNT(*) as remaining_nfts FROM user_nfts;
*/

-- ========================================
-- OPTION 4: FILTER IN ADMIN UI
-- ========================================
-- Instead of deleting, you can filter in the admin UI:
-- In nft-holders-admin.html, add WHERE clause:
-- WHERE minted_at >= '2025-11-10'

-- ========================================
-- RECOMMENDATION
-- ========================================
-- For now, use OPTION 2 (deactivate) or OPTION 4 (filter in UI)
-- This keeps historical data but hides old test NFTs

