-- Check if nft_bonding_state table exists and has data
-- Run this in Supabase SQL Editor

-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'nft_bonding_state'
) as table_exists;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'nft_bonding_state';

-- Check if table has data
SELECT COUNT(*) as row_count FROM nft_bonding_state;

-- View all data
SELECT * FROM nft_bonding_state ORDER BY tier_name;

