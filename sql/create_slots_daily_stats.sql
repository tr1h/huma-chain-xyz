-- ============================================
-- SLOTS DAILY STATS TABLE
-- ============================================
-- Created: 2025-01-XX
-- Description: Daily statistics for slots game
-- 
-- Tracks:
-- - Daily spins count
-- - Wins count
-- - Total bet/win amounts
-- - Free spins used
-- - Max win for the day
-- ============================================

CREATE TABLE IF NOT EXISTS slots_daily_stats (
    id SERIAL PRIMARY KEY,
    
    -- User reference
    telegram_id BIGINT NOT NULL,
    
    -- Date (for daily reset)
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Statistics
    spins_count INT DEFAULT 0,
    wins_count INT DEFAULT 0,
    total_bet BIGINT DEFAULT 0,
    total_win BIGINT DEFAULT 0,
    max_win BIGINT DEFAULT 0,
    free_spins_used INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one record per user per day
    UNIQUE(telegram_id, date)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_slots_daily_stats_telegram_date ON slots_daily_stats(telegram_id, date);
CREATE INDEX IF NOT EXISTS idx_slots_daily_stats_date_win ON slots_daily_stats(date, total_win DESC);

-- RLS Policies (if using Row Level Security)
-- ALTER TABLE slots_daily_stats ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Users can view their own stats"
--     ON slots_daily_stats FOR SELECT
--     USING (telegram_id = current_setting('app.telegram_id')::BIGINT);
-- 
-- CREATE POLICY "Users can insert their own stats"
--     ON slots_daily_stats FOR INSERT
--     WITH CHECK (telegram_id = current_setting('app.telegram_id')::BIGINT);
-- 
-- CREATE POLICY "Users can update their own stats"
--     ON slots_daily_stats FOR UPDATE
--     USING (telegram_id = current_setting('app.telegram_id')::BIGINT);

-- Comments
COMMENT ON TABLE slots_daily_stats IS 'Daily statistics for slots game per user';
COMMENT ON COLUMN slots_daily_stats.telegram_id IS 'Telegram user ID';
COMMENT ON COLUMN slots_daily_stats.date IS 'Date of the stats (resets daily)';
COMMENT ON COLUMN slots_daily_stats.spins_count IS 'Total number of spins today';
COMMENT ON COLUMN slots_daily_stats.wins_count IS 'Number of winning spins';
COMMENT ON COLUMN slots_daily_stats.total_bet IS 'Total TAMA bet today';
COMMENT ON COLUMN slots_daily_stats.total_win IS 'Total TAMA won today';
COMMENT ON COLUMN slots_daily_stats.max_win IS 'Maximum single win today';
COMMENT ON COLUMN slots_daily_stats.free_spins_used IS 'Number of free spins used today (max 3)';

