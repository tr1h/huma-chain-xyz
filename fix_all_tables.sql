-- Fix all tables structure for API compatibility

-- Fix tama_transactions table
DO $$ 
BEGIN
    -- Add missing columns to tama_transactions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tama_transactions' AND column_name = 'transaction_type') THEN
        ALTER TABLE tama_transactions ADD COLUMN transaction_type VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tama_transactions' AND column_name = 'description') THEN
        ALTER TABLE tama_transactions ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tama_transactions' AND column_name = 'metadata') THEN
        ALTER TABLE tama_transactions ADD COLUMN metadata JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tama_transactions' AND column_name = 'user_type') THEN
        ALTER TABLE tama_transactions ADD COLUMN user_type VARCHAR(20) DEFAULT 'telegram';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tama_transactions' AND column_name = 'created_at') THEN
        ALTER TABLE tama_transactions ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tama_transactions' AND column_name = 'updated_at') THEN
        ALTER TABLE tama_transactions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Fix leaderboard table
DO $$ 
BEGIN
    -- Add missing columns to leaderboard
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leaderboard' AND column_name = 'achievements') THEN
        ALTER TABLE leaderboard ADD COLUMN achievements JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leaderboard' AND column_name = 'quests_completed') THEN
        ALTER TABLE leaderboard ADD COLUMN quests_completed INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leaderboard' AND column_name = 'last_active') THEN
        ALTER TABLE leaderboard ADD COLUMN last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leaderboard' AND column_name = 'updated_at') THEN
        ALTER TABLE leaderboard ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create user_nfts table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_nfts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    user_type VARCHAR(20) DEFAULT 'telegram',
    nft_id VARCHAR(100) UNIQUE NOT NULL,
    pet_name VARCHAR(100),
    pet_type VARCHAR(50),
    rarity VARCHAR(20) DEFAULT 'common',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create economy_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS economy_config (
    id SERIAL PRIMARY KEY,
    config_name VARCHAR(100) DEFAULT 'default',
    earn_click DECIMAL(10,2) DEFAULT 0.7,
    earn_combo_multiplier DECIMAL(10,2) DEFAULT 1.5,
    earn_max_combo INTEGER DEFAULT 10,
    level_up_bonus DECIMAL(10,2) DEFAULT 10,
    quest_reward DECIMAL(10,2) DEFAULT 5,
    referral_bonus DECIMAL(10,2) DEFAULT 50,
    mint_nft_cost DECIMAL(10,2) DEFAULT 1000,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tama_transactions_user_id ON tama_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_tama_transactions_user_type ON tama_transactions(user_type);
CREATE INDEX IF NOT EXISTS idx_tama_transactions_transaction_type ON tama_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_tama_transactions_created_at ON tama_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_user_nfts_user_id ON user_nfts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_nfts_user_type ON user_nfts(user_type);
CREATE INDEX IF NOT EXISTS idx_user_nfts_nft_id ON user_nfts(nft_id);

CREATE INDEX IF NOT EXISTS idx_economy_config_active ON economy_config(is_active);

-- Add constraints
DO $$
BEGIN
    -- Add constraint only if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'tama_transactions' 
        AND constraint_name = 'check_transaction_type'
    ) THEN
        ALTER TABLE tama_transactions 
        ADD CONSTRAINT check_transaction_type 
        CHECK (transaction_type IN ('earn_click', 'earn_combo', 'spend_tama', 'level_up', 'quest_reward', 'referral_bonus', 'mint_nft', 'admin_add', 'admin_remove'));
    END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE tama_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE economy_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$
BEGIN
    -- tama_transactions policies
    DROP POLICY IF EXISTS "Users can view their own transactions" ON tama_transactions;
    DROP POLICY IF EXISTS "Users can insert their own transactions" ON tama_transactions;
    DROP POLICY IF EXISTS "Service role can do everything" ON tama_transactions;
    
    CREATE POLICY "Users can view their own transactions" ON tama_transactions
        FOR SELECT USING (auth.uid()::text = user_id OR user_type = 'telegram');
    
    CREATE POLICY "Users can insert their own transactions" ON tama_transactions
        FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_type = 'telegram');
    
    CREATE POLICY "Service role can do everything" ON tama_transactions
        FOR ALL USING (auth.role() = 'service_role');
    
    -- user_nfts policies
    DROP POLICY IF EXISTS "Users can view their own NFTs" ON user_nfts;
    DROP POLICY IF EXISTS "Users can insert their own NFTs" ON user_nfts;
    DROP POLICY IF EXISTS "Service role can do everything" ON user_nfts;
    
    CREATE POLICY "Users can view their own NFTs" ON user_nfts
        FOR SELECT USING (auth.uid()::text = user_id OR user_type = 'telegram');
    
    CREATE POLICY "Users can insert their own NFTs" ON user_nfts
        FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_type = 'telegram');
    
    CREATE POLICY "Service role can do everything" ON user_nfts
        FOR ALL USING (auth.role() = 'service_role');
    
    -- economy_config policies
    DROP POLICY IF EXISTS "Everyone can view economy config" ON economy_config;
    DROP POLICY IF EXISTS "Service role can do everything" ON economy_config;
    
    CREATE POLICY "Everyone can view economy config" ON economy_config
        FOR SELECT USING (true);
    
    CREATE POLICY "Service role can do everything" ON economy_config
        FOR ALL USING (auth.role() = 'service_role');
END $$;

-- Insert default economy config if none exists
INSERT INTO economy_config (config_name, earn_click, earn_combo_multiplier, earn_max_combo, level_up_bonus, quest_reward, referral_bonus, mint_nft_cost, is_active)
SELECT 'default', 0.7, 1.5, 10, 10, 5, 50, 1000, true
WHERE NOT EXISTS (SELECT 1 FROM economy_config WHERE is_active = true);
