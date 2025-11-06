-- Add missing columns to leaderboard table for bot functionality

-- Add last_daily_claim column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaderboard' AND column_name = 'last_daily_claim'
    ) THEN
        ALTER TABLE leaderboard ADD COLUMN last_daily_claim TIMESTAMP;
        CREATE INDEX IF NOT EXISTS idx_leaderboard_last_daily_claim 
        ON leaderboard(last_daily_claim);
    END IF;
END $$;

-- Add daily_streak column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaderboard' AND column_name = 'daily_streak'
    ) THEN
        ALTER TABLE leaderboard ADD COLUMN daily_streak INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add total_withdrawn column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaderboard' AND column_name = 'total_withdrawn'
    ) THEN
        ALTER TABLE leaderboard ADD COLUMN total_withdrawn BIGINT DEFAULT 0;
    END IF;
END $$;

-- Add total_earned column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaderboard' AND column_name = 'total_earned'
    ) THEN
        ALTER TABLE leaderboard ADD COLUMN total_earned BIGINT DEFAULT 0;
    END IF;
END $$;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leaderboard' 
AND column_name IN ('last_daily_claim', 'daily_streak', 'total_withdrawn', 'total_earned')
ORDER BY column_name;

