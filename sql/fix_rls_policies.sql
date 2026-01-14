-- FIX RLS POLICIES FOR GAME ACCESS
-- Run this in Supabase SQL Editor

-- 1. LEADERBOARD (Allow public read)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON leaderboard;
CREATE POLICY "Allow public read"
ON leaderboard FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON leaderboard;
CREATE POLICY "Allow authenticated update"
ON leaderboard FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 2. USERS (Allow public profiling)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles" ON users;
CREATE POLICY "Public profiles"
ON users FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Self update" ON users;
CREATE POLICY "Self update"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 3. PETS (Allow seeing other pets)
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public pets" ON pets;
CREATE POLICY "Public pets"
ON pets FOR SELECT
TO anon
USING (true);

-- 4. WITHDRAWALS (Secure)
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User see own withdrawals" ON withdrawals;
CREATE POLICY "User see own withdrawals"
ON withdrawals FOR SELECT
TO authenticated
USING (auth.uid()::text = telegram_id);

-- 5. SOL DISTRIBUTIONS (Public transparency)
ALTER TABLE sol_distributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public distributions" ON sol_distributions;
CREATE POLICY "Public distributions"
ON sol_distributions FOR SELECT
TO anon
USING (true);
