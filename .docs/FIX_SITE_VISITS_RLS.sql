-- Fix RLS policy for site_visits to allow anon SELECT (for admin dashboard)
-- Run this in Supabase SQL Editor

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Allow authenticated reads" ON site_visits;

-- Create new policy that allows both authenticated AND anon to read
CREATE POLICY "Allow reads for all" ON site_visits
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Alternative: If you want separate policies
-- CREATE POLICY "Allow anon reads" ON site_visits
--     FOR SELECT
--     TO anon
--     USING (true);
-- 
-- CREATE POLICY "Allow authenticated reads" ON site_visits
--     FOR SELECT
--     TO authenticated
--     USING (true);

