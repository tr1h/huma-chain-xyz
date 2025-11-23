-- ============================================
-- FIX PRICE_TAMA NULLABLE CONSTRAINT
-- ============================================
-- Make price_tama nullable to support SOL-only payments
-- ============================================

-- Check if column exists and is NOT NULL
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'marketplace_listings' 
        AND column_name = 'price_tama'
        AND is_nullable = 'NO'
    ) THEN
        -- Make price_tama nullable
        ALTER TABLE marketplace_listings 
        ALTER COLUMN price_tama DROP NOT NULL;
        
        RAISE NOTICE '✅ Made price_tama nullable';
    ELSE
        RAISE NOTICE 'ℹ️ price_tama is already nullable or column does not exist';
    END IF;
END $$;

-- Also check price_sol
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'marketplace_listings' 
        AND column_name = 'price_sol'
        AND is_nullable = 'NO'
    ) THEN
        -- Make price_sol nullable
        ALTER TABLE marketplace_listings 
        ALTER COLUMN price_sol DROP NOT NULL;
        
        RAISE NOTICE '✅ Made price_sol nullable';
    ELSE
        RAISE NOTICE 'ℹ️ price_sol is already nullable or column does not exist';
    END IF;
END $$;

