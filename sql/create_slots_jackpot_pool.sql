-- ============================================
-- SLOTS JACKPOT POOL TABLE
-- ============================================
-- Created: 2025-01-XX
-- Description: Shared jackpot pool for slots game
--
-- Mechanics:
-- - 5% of each bet goes to the pool
-- - When player gets 🎰🎰🎰, they win the entire pool
-- - Pool resets after win
-- ============================================

-- Main jackpot pool table (single row)
CREATE TABLE IF NOT EXISTS slots_jackpot_pool (
    id INT PRIMARY KEY DEFAULT 1,

    -- Current pool amount
    current_pool BIGINT DEFAULT 0,

    -- Statistics
    total_contributed BIGINT DEFAULT 0,  -- Total ever contributed
    total_won BIGINT DEFAULT 0,            -- Total ever won
    wins_count INT DEFAULT 0,            -- Number of times jackpot was won

    -- Last winner info
    last_winner_telegram_id BIGINT,
    last_winner_username TEXT,
    last_win_amount BIGINT,
    last_win_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraint: only one row
    CONSTRAINT single_pool CHECK (id = 1)
);

-- Jackpot win history table
CREATE TABLE IF NOT EXISTS slots_jackpot_history (
    id SERIAL PRIMARY KEY,

    -- Winner info
    telegram_id BIGINT NOT NULL,
    username TEXT,
    first_name TEXT,

    -- Win details
    win_amount BIGINT NOT NULL,
    bet_amount BIGINT NOT NULL,  -- Bet that triggered the win
    pool_before BIGINT NOT NULL, -- Pool size before win
    pool_after BIGINT DEFAULT 0, -- Pool size after win (0 after reset)

    -- Timestamp
    won_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jackpot_history_telegram ON slots_jackpot_history(telegram_id);
CREATE INDEX IF NOT EXISTS idx_jackpot_history_date ON slots_jackpot_history(won_at DESC);
CREATE INDEX IF NOT EXISTS idx_jackpot_history_amount ON slots_jackpot_history(win_amount DESC);

-- Initialize pool if not exists
INSERT INTO slots_jackpot_pool (id, current_pool)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Comments
COMMENT ON TABLE slots_jackpot_pool IS 'Shared jackpot pool for slots game - single row table';
COMMENT ON COLUMN slots_jackpot_pool.current_pool IS 'Current jackpot pool amount in TAMA';
COMMENT ON COLUMN slots_jackpot_pool.total_contributed IS 'Total amount ever contributed to pool';
COMMENT ON COLUMN slots_jackpot_pool.total_won IS 'Total amount ever won from pool';
COMMENT ON COLUMN slots_jackpot_pool.wins_count IS 'Number of times jackpot was won';
COMMENT ON TABLE slots_jackpot_history IS 'History of all jackpot wins';
COMMENT ON COLUMN slots_jackpot_history.win_amount IS 'Amount won from jackpot pool';
COMMENT ON COLUMN slots_jackpot_history.pool_before IS 'Pool size before this win';

