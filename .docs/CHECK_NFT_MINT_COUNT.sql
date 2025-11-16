-- Check NFT mint count and bonding state
-- Run this in Supabase SQL Editor to verify minting is working

-- ========================================
-- STEP 1: Check bonding state (minted_count)
-- ========================================

SELECT 
    tier_name,
    payment_type,
    current_price,
    minted_count,
    max_supply,
    (minted_count::float / max_supply * 100) as percentage_minted,
    increment_per_mint,
    updated_at
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
-- STEP 2: Count actual NFTs in user_nfts table
-- ========================================

SELECT 
    tier_name,
    COUNT(*) as total_nfts,
    COUNT(*) FILTER (WHERE is_active = true) as active_nfts,
    COUNT(*) FILTER (WHERE is_active = false) as inactive_nfts,
    MIN(minted_at) as first_mint,
    MAX(minted_at) as last_mint
FROM user_nfts
GROUP BY tier_name
ORDER BY 
    CASE tier_name
        WHEN 'Bronze' THEN 1
        WHEN 'Silver' THEN 2
        WHEN 'Gold' THEN 3
        WHEN 'Platinum' THEN 4
        WHEN 'Diamond' THEN 5
    END;

-- ========================================
-- STEP 3: Compare bonding_state vs actual NFTs
-- ========================================

SELECT 
    bs.tier_name,
    bs.payment_type,
    bs.minted_count as bonding_state_count,
    COUNT(UN.*) as actual_nft_count,
    (bs.minted_count - COUNT(UN.*)) as difference
FROM nft_bonding_state bs
LEFT JOIN user_nfts UN ON UN.tier_name = bs.tier_name AND UN.is_active = true
GROUP BY bs.tier_name, bs.payment_type, bs.minted_count
ORDER BY bs.tier_name;

-- ========================================
-- STEP 4: Check recent mints
-- ========================================

SELECT 
    id,
    telegram_id,
    tier_name,
    rarity,
    earning_multiplier,
    nft_mint_address,
    minted_at,
    is_active
FROM user_nfts
WHERE minted_at >= NOW() - INTERVAL '24 hours'
ORDER BY minted_at DESC
LIMIT 20;

-- ========================================
-- STEP 5: Check if nft_mint_address is real or placeholder
-- ========================================

SELECT 
    tier_name,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE nft_mint_address LIKE 'pending_%') as pending_placeholders,
    COUNT(*) FILTER (WHERE nft_mint_address LIKE '%_sol_%') as sol_placeholders,
    COUNT(*) FILTER (WHERE nft_mint_address LIKE 'NFT_%') as old_placeholders,
    COUNT(*) FILTER (WHERE nft_mint_address ~ '^[A-Za-z0-9]{32,44}$') as possible_real_addresses
FROM user_nfts
WHERE is_active = true
GROUP BY tier_name;






