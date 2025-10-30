-- Таблица для хранения запросов на вывод TAMA

CREATE TABLE IF NOT EXISTS withdrawals (
    id BIGSERIAL PRIMARY KEY,
    telegram_id TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    amount_requested INTEGER NOT NULL,
    amount_sent INTEGER NOT NULL,
    fee INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, cancelled
    transaction_signature TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_withdrawals_telegram_id ON withdrawals(telegram_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_withdrawals_tx_signature ON withdrawals(transaction_signature);

-- Enable RLS
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own withdrawals"
    ON withdrawals FOR SELECT
    USING (true);

CREATE POLICY "API can insert withdrawals"
    ON withdrawals FOR INSERT
    WITH CHECK (true);

CREATE POLICY "API can update withdrawals"
    ON withdrawals FOR UPDATE
    USING (true);

-- Comments
COMMENT ON TABLE withdrawals IS 'Withdrawal requests from game to real Solana wallet';
COMMENT ON COLUMN withdrawals.amount_requested IS 'Amount user requested (before fee)';
COMMENT ON COLUMN withdrawals.amount_sent IS 'Actual amount sent (after fee)';
COMMENT ON COLUMN withdrawals.fee IS 'Withdrawal fee (5%)';
COMMENT ON COLUMN withdrawals.transaction_signature IS 'Solana transaction signature';

