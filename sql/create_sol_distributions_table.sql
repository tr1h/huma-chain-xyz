-- ============================================
-- SOL DISTRIBUTIONS TABLE
-- ============================================
-- Tracks SOL payment distribution from NFT mints
-- 50% Main | 30% Liquidity | 20% Team
-- ============================================

CREATE TABLE IF NOT EXISTS sol_distributions (
    id SERIAL PRIMARY KEY,
    
    -- Original transaction
    transaction_signature VARCHAR(255) NOT NULL,
    from_wallet VARCHAR(255) NOT NULL,
    to_wallet VARCHAR(255) NOT NULL,
    
    -- Amount details
    amount_sol DECIMAL(20, 9) NOT NULL,
    percentage INTEGER NOT NULL CHECK (percentage IN (50, 30, 20)),
    
    -- Distribution type
    distribution_type VARCHAR(50) NOT NULL CHECK (distribution_type IN ('main', 'liquidity', 'team')),
    
    -- NFT details
    nft_tier VARCHAR(50),
    telegram_id BIGINT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    
    -- Execution details (when actually transferred)
    execution_signature VARCHAR(255),
    executed_at TIMESTAMP WITH TIME ZONE,
    
    -- Error tracking
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_sol_dist_tx_sig ON sol_distributions(transaction_signature);
CREATE INDEX IF NOT EXISTS idx_sol_dist_status ON sol_distributions(status);
CREATE INDEX IF NOT EXISTS idx_sol_dist_type ON sol_distributions(distribution_type);
CREATE INDEX IF NOT EXISTS idx_sol_dist_created ON sol_distributions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sol_distributions_telegram ON sol_distributions(telegram_id);
CREATE INDEX IF NOT EXISTS idx_sol_distributions_nft_tier ON sol_distributions(nft_tier);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE sol_distributions IS 'Tracks SOL payment distribution from NFT mints (50% Main, 30% Liquidity, 20% Team)';
COMMENT ON COLUMN sol_distributions.distribution_type IS 'main = Treasury Main (operations), liquidity = DEX pool, team = Team wallet';
COMMENT ON COLUMN sol_distributions.status IS 'pending = logged but not sent, processing = transfer in progress, completed = confirmed on-chain, failed = transfer failed';
COMMENT ON COLUMN sol_distributions.percentage IS 'Distribution percentage: 50 (main), 30 (liquidity), 20 (team)';

-- ============================================
-- SUMMARY VIEW
-- ============================================

CREATE OR REPLACE VIEW sol_distribution_summary AS
SELECT 
    distribution_type,
    COUNT(*) as transaction_count,
    SUM(amount_sol) as total_sol,
    SUM(amount_sol) * 164.07 as total_usd,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
FROM sol_distributions
GROUP BY distribution_type;

-- ============================================
-- TREASURY WALLETS (для справки)
-- ============================================

/*
DEVNET WALLETS (ПРИМЕРЫ - ЗАМЕНИ НА СВОИ!):

Treasury Main (50%): 
6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM

Treasury Liquidity (30%):
LiquidityPoolWallet111111111111111111111111
(создай отдельный кошелёк для DEX пула)

Treasury Team (20%):
TeamWallet11111111111111111111111111111111
(создай отдельный кошелёк для команды)

MAINNET:
ПРИ ЗАПУСКЕ В MAINNET:
1. Создай 3 отдельных кошелька (main, liquidity, team)
2. Добавь их в .env файл
3. ХРАНИ PRIVATE KEYS В БЕЗОПАСНОСТИ!
4. Используй multisig для Treasury Main
*/

-- ============================================
-- УСПЕШНО! 
-- ============================================
-- Теперь можно логировать распределение SOL
-- И в будущем автоматизировать переводы!
-- ============================================

