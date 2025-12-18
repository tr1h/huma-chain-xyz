-- Fix RLS policy for nft_bonding_state to allow anon SELECT (for admin dashboard)
-- Run this in Supabase SQL Editor

-- Check if table exists first
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'nft_bonding_state'
    ) THEN
        RAISE NOTICE 'Table nft_bonding_state does not exist. Please create it first using sql/create_nft_5tier_system.sql';
        RETURN;
    END IF;
END $$;

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Allow authenticated reads" ON nft_bonding_state;
DROP POLICY IF EXISTS "Allow reads for all" ON nft_bonding_state;
DROP POLICY IF EXISTS "Allow anon reads" ON nft_bonding_state;

-- Create new policy that allows both authenticated AND anon to read
CREATE POLICY "Allow reads for all" ON nft_bonding_state
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Verify policy was created
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'nft_bonding_state';

