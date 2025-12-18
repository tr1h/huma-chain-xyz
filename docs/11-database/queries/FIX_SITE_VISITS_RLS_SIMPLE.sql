-- Simple fix: Just add anon to existing policy
-- Run this in Supabase SQL Editor

-- Drop the old policy
DROP POLICY "Allow authenticated reads" ON site_visits;

-- Create new one with both anon and authenticated
CREATE POLICY "Allow reads for all" ON site_visits
    FOR SELECT
    TO anon, authenticated
    USING (true);

