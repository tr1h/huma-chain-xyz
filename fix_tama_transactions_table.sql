-- Fix tama_transactions table structure
-- Add missing columns for transaction logging

-- Check if table exists and add missing columns
DO $$ 
BEGIN
    -- Add transaction_type column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tama_transactions' 
        AND column_name = 'transaction_type'
    ) THEN
        ALTER TABLE tama_transactions 
        ADD COLUMN transaction_type VARCHAR(50);
    END IF;

    -- Add description column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tama_transactions' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE tama_transactions 
        ADD COLUMN description TEXT;
    END IF;

    -- Add metadata column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tama_transactions' 
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE tama_transactions 
        ADD COLUMN metadata JSONB;
    END IF;

    -- Add user_type column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tama_transactions' 
        AND column_name = 'user_type'
    ) THEN
        ALTER TABLE tama_transactions 
        ADD COLUMN user_type VARCHAR(20) DEFAULT 'telegram';
    END IF;

    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tama_transactions' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE tama_transactions 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tama_transactions' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE tama_transactions 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tama_transactions_user_id ON tama_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_tama_transactions_user_type ON tama_transactions(user_type);
CREATE INDEX IF NOT EXISTS idx_tama_transactions_transaction_type ON tama_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_tama_transactions_created_at ON tama_transactions(created_at);

-- Add constraints
ALTER TABLE tama_transactions 
ADD CONSTRAINT IF NOT EXISTS check_transaction_type 
CHECK (transaction_type IN ('earn_click', 'earn_combo', 'spend_tama', 'level_up', 'quest_reward', 'referral_bonus', 'mint_nft', 'admin_add', 'admin_remove'));

-- Update RLS policies if needed
DO $$
BEGIN
    -- Enable RLS
    ALTER TABLE tama_transactions ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own transactions" ON tama_transactions;
    DROP POLICY IF EXISTS "Users can insert their own transactions" ON tama_transactions;
    DROP POLICY IF EXISTS "Service role can do everything" ON tama_transactions;
    
    -- Create new policies
    CREATE POLICY "Users can view their own transactions" ON tama_transactions
        FOR SELECT USING (auth.uid()::text = user_id OR user_type = 'telegram');
    
    CREATE POLICY "Users can insert their own transactions" ON tama_transactions
        FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_type = 'telegram');
    
    CREATE POLICY "Service role can do everything" ON tama_transactions
        FOR ALL USING (auth.role() = 'service_role');
END $$;
