-- Add twitter_username column to leaderboard table
-- This allows users to link their Twitter/X account to their profile

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaderboard' AND column_name = 'twitter_username'
    ) THEN
        ALTER TABLE leaderboard ADD COLUMN twitter_username TEXT;
        CREATE INDEX IF NOT EXISTS idx_leaderboard_twitter_username 
        ON leaderboard(twitter_username);
        COMMENT ON COLUMN leaderboard.twitter_username IS 'Twitter/X username (without @) linked to user account';
    END IF;
END $$;

-- Verify column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'leaderboard' 
AND column_name = 'twitter_username';

