-- ============================================
-- ADD PAYMENT_TYPE COLUMN TO MARKETPLACE_LISTINGS
-- ============================================
-- If table exists but payment_type column is missing
-- Run this script to add it
-- ============================================

-- Check if column exists, if not add it
DO $$ 
BEGIN
    -- Check if marketplace_listings table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'marketplace_listings') THEN
        -- Check if payment_type column exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'marketplace_listings' 
            AND column_name = 'payment_type'
        ) THEN
            -- Add payment_type column
            ALTER TABLE marketplace_listings 
            ADD COLUMN payment_type TEXT NOT NULL DEFAULT 'tama';
            
            -- Add constraint
            ALTER TABLE marketplace_listings
            ADD CONSTRAINT payment_type_check 
            CHECK (payment_type IN ('tama', 'sol', 'both'));
            
            RAISE NOTICE '✅ Added payment_type column to marketplace_listings';
        ELSE
            RAISE NOTICE 'ℹ️ payment_type column already exists';
        END IF;
    ELSE
        RAISE NOTICE '⚠️ marketplace_listings table does not exist. Run create_marketplace_tables.sql first.';
    END IF;
END $$;

