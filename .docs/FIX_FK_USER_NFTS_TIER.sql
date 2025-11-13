-- Fix foreign key constraint fk_user_nfts_tier
-- This constraint requires tier_name to exist in a reference table
-- Run this in Supabase SQL Editor

-- ========================================
-- STEP 1: Check if nft_tiers table exists
-- ========================================

-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'nft_tiers'
) as table_exists;

-- ========================================
-- STEP 2: Create nft_tiers table if it doesn't exist
-- ========================================

CREATE TABLE IF NOT EXISTS nft_tiers (
    tier_name TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    min_multiplier DECIMAL(3,1) NOT NULL,
    max_multiplier DECIMAL(3,1) NOT NULL,
    max_supply INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- STEP 3: Insert all valid tiers
-- ========================================

-- Insert tiers (ON CONFLICT DO NOTHING to avoid duplicates)
INSERT INTO nft_tiers (tier_name, display_name, min_multiplier, max_multiplier, max_supply)
VALUES 
    ('Bronze', 'Bronze', 2.0, 2.0, 4500),
    ('Silver', 'Silver', 2.3, 3.5, 350),
    ('Gold', 'Gold', 2.7, 4.0, 130),
    ('Platinum', 'Platinum', 3.5, 5.0, 18),
    ('Diamond', 'Diamond', 5.0, 6.0, 2)
ON CONFLICT (tier_name) DO NOTHING;

-- ========================================
-- STEP 4: Check current foreign key constraint
-- ========================================

-- Check if foreign key exists
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'user_nfts'
    AND tc.constraint_name = 'fk_user_nfts_tier';

-- ========================================
-- STEP 5: Drop and recreate foreign key (if needed)
-- ========================================

-- Drop existing foreign key if it exists
ALTER TABLE user_nfts 
DROP CONSTRAINT IF EXISTS fk_user_nfts_tier;

-- Recreate foreign key pointing to nft_tiers
ALTER TABLE user_nfts 
ADD CONSTRAINT fk_user_nfts_tier 
FOREIGN KEY (tier_name) REFERENCES nft_tiers(tier_name);

-- ========================================
-- STEP 6: Verify all tiers exist
-- ========================================

SELECT * FROM nft_tiers ORDER BY 
    CASE tier_name
        WHEN 'Bronze' THEN 1
        WHEN 'Silver' THEN 2
        WHEN 'Gold' THEN 3
        WHEN 'Platinum' THEN 4
        WHEN 'Diamond' THEN 5
    END;

-- ========================================
-- ALTERNATIVE: If you don't want foreign key constraint
-- ========================================
-- Uncomment this if you prefer to remove the constraint entirely:

/*
ALTER TABLE user_nfts 
DROP CONSTRAINT IF EXISTS fk_user_nfts_tier;

-- Then add a CHECK constraint instead (less strict, but still validates)
ALTER TABLE user_nfts 
ADD CONSTRAINT check_tier_name 
CHECK (tier_name IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'));
*/

