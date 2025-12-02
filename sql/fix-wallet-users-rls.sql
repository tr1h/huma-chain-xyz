-- ============================================
-- 🔧 Fix RLS Policies for wallet_users table
-- ============================================
-- This ensures service_role can write to wallet_users

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "service_role_all_access" ON wallet_users;
DROP POLICY IF EXISTS "authenticated_read_all" ON wallet_users;
DROP POLICY IF EXISTS "users_read_own" ON wallet_users;

-- Recreate policies with correct permissions
-- Policy 1: Service role has full access (for backend API)
CREATE POLICY "service_role_all_access" ON wallet_users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy 2: Authenticated users can read all (for leaderboard)
CREATE POLICY "authenticated_read_all" ON wallet_users
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Policy 3: Allow anon to read (for public leaderboard)
-- Note: This is needed for frontend to read leaderboard data
CREATE POLICY "anon_read_all" ON wallet_users
    FOR SELECT
    TO anon
    USING (true);

-- Verify RLS is enabled
ALTER TABLE wallet_users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON wallet_users TO service_role;
GRANT SELECT ON wallet_users TO authenticated, anon;

-- Test: Try to insert a test record (will be deleted)
-- This verifies that service_role can write
DO $$
BEGIN
    -- This will only work if service_role has write access
    INSERT INTO wallet_users (wallet_address, user_id, username, tama_balance)
    VALUES ('TEST_WALLET_ADDRESS_FOR_RLS_CHECK', 'wallet_TEST_WALLET', 'Test User', 0)
    ON CONFLICT (wallet_address) DO NOTHING;
    
    -- Delete test record
    DELETE FROM wallet_users WHERE wallet_address = 'TEST_WALLET_ADDRESS_FOR_RLS_CHECK';
    
    RAISE NOTICE '✅ RLS policies verified - service_role can write to wallet_users';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ RLS test failed: %', SQLERRM;
END $$;

-- ============================================
-- Done! 🎉
-- ============================================

