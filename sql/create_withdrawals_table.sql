-- Create withdrawals tracking table for admin-tokenomics dashboard
-- This table stores all withdrawal transactions

CREATE TABLE IF NOT EXISTS tama_economy (
    id BIGSERIAL PRIMARY KEY,
    telegram_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL,     -- 'withdrawal', 'earning', 'nft_mint', etc
    amount BIGINT NOT NULL,             -- Positive or negative
    fee BIGINT DEFAULT 0,
    burn_amount BIGINT DEFAULT 0,
    pool_amount BIGINT DEFAULT 0,
    team_amount BIGINT DEFAULT 0,
    signature TEXT,                     -- Solana transaction signature
    wallet_address TEXT,
    status TEXT DEFAULT 'pending',      -- 'pending', 'completed', 'failed'
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_tama_economy_type 
ON tama_economy(transaction_type);

CREATE INDEX IF NOT EXISTS idx_tama_economy_telegram_id 
ON tama_economy(telegram_id);

CREATE INDEX IF NOT EXISTS idx_tama_economy_created_at 
ON tama_economy(created_at DESC);

-- Alternative: If you prefer a simpler withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
    id BIGSERIAL PRIMARY KEY,
    telegram_id TEXT NOT NULL,
    amount BIGINT NOT NULL,
    wallet_address TEXT NOT NULL,
    tx_signature TEXT UNIQUE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_telegram_id 
ON withdrawals(telegram_id);

CREATE INDEX IF NOT EXISTS idx_withdrawals_status 
ON withdrawals(status);

CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at 
ON withdrawals(created_at DESC);

-- Add total_withdrawn column to leaderboard if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaderboard' AND column_name = 'total_withdrawn'
    ) THEN
        ALTER TABLE leaderboard ADD COLUMN total_withdrawn BIGINT DEFAULT 0;
    END IF;
END $$;

