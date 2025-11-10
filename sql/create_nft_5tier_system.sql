-- ============================================
-- NFT 5-Tier System Database Schema
-- ============================================
-- Created: 2025-11-10
-- Description: Tables for 5-tier NFT system with bonding curve
-- 
-- IMPORTANT: Run this AFTER backing up your database!
--
-- Tables:
-- 1. nft_designs - Library of all 5,000 NFT designs
-- 2. nft_bonding_state - Current bonding curve prices for each tier
-- 3. user_nfts - User-owned NFTs (UPDATE existing table)
-- ============================================

-- ============================================
-- 1. NFT DESIGNS LIBRARY
-- ============================================
-- This table stores all 5,000 NFT designs
-- Each design is unique and can only be minted once

CREATE TABLE IF NOT EXISTS nft_designs (
    id SERIAL PRIMARY KEY,
    tier_name TEXT NOT NULL CHECK (tier_name IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond')),
    design_number INT NOT NULL,
    design_theme TEXT,  -- e.g., "Baby Creatures", "Happy Eggs", etc.
    design_variant TEXT,  -- e.g., "Green", "Blue", "Style A", etc.
    image_url TEXT,  -- Arweave URL (will be populated later)
    metadata_url TEXT,  -- Arweave metadata URL (will be populated later)
    is_minted BOOLEAN DEFAULT false,
    minted_by BIGINT,  -- telegram_id of minter
    minted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tier_name, design_number)
);

-- Create index for fast queries
CREATE INDEX IF NOT EXISTS idx_nft_designs_tier ON nft_designs(tier_name);
CREATE INDEX IF NOT EXISTS idx_nft_designs_minted ON nft_designs(is_minted);
CREATE INDEX IF NOT EXISTS idx_nft_designs_tier_unminted ON nft_designs(tier_name, is_minted) WHERE is_minted = false;

COMMENT ON TABLE nft_designs IS 'Library of all 5,000 unique NFT designs';
COMMENT ON COLUMN nft_designs.tier_name IS 'Tier: Bronze, Silver, Gold, Platinum, Diamond';
COMMENT ON COLUMN nft_designs.design_number IS 'Sequential number within tier (Bronze: 1-4500, Silver: 1-350, etc.)';
COMMENT ON COLUMN nft_designs.is_minted IS 'Whether this design has been minted yet';

-- ============================================
-- 2. NFT BONDING STATE
-- ============================================
-- This table tracks the current price for each tier
-- Prices increase with each mint (bonding curve)

CREATE TABLE IF NOT EXISTS nft_bonding_state (
    id SERIAL PRIMARY KEY,
    tier_name TEXT NOT NULL UNIQUE CHECK (tier_name IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond')),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('TAMA', 'SOL')),
    current_price DECIMAL(12,6) NOT NULL,  -- Current price (TAMA or SOL)
    minted_count INT DEFAULT 0,
    max_supply INT NOT NULL,
    start_price DECIMAL(12,6) NOT NULL,
    end_price DECIMAL(12,6) NOT NULL,
    increment_per_mint DECIMAL(12,6) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bonding_state_tier ON nft_bonding_state(tier_name);
CREATE INDEX IF NOT EXISTS idx_bonding_state_active ON nft_bonding_state(is_active);

COMMENT ON TABLE nft_bonding_state IS 'Current bonding curve state for each tier';
COMMENT ON COLUMN nft_bonding_state.current_price IS 'Current mint price (increases with each mint)';
COMMENT ON COLUMN nft_bonding_state.increment_per_mint IS 'How much price increases per mint';

-- ============================================
-- 3. UPDATE USER_NFTS TABLE (if exists)
-- ============================================
-- Add new column for nft_design_id reference
-- Keep existing columns for backward compatibility

DO $$ 
BEGIN
    -- Check if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_nfts') THEN
        -- Add nft_design_id column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'user_nfts' AND column_name = 'nft_design_id') THEN
            ALTER TABLE user_nfts ADD COLUMN nft_design_id INT REFERENCES nft_designs(id);
        END IF;
        
        -- Add purchase_price_sol column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'user_nfts' AND column_name = 'purchase_price_sol') THEN
            ALTER TABLE user_nfts ADD COLUMN purchase_price_sol DECIMAL(12,6);
        END IF;
        
        -- Add purchase_price_tama column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'user_nfts' AND column_name = 'purchase_price_tama') THEN
            ALTER TABLE user_nfts ADD COLUMN purchase_price_tama DECIMAL(12,2);
        END IF;
    ELSE
        -- Create user_nfts table if it doesn't exist
        CREATE TABLE user_nfts (
            id SERIAL PRIMARY KEY,
            telegram_id BIGINT NOT NULL,
            nft_design_id INT REFERENCES nft_designs(id),
            nft_mint_address TEXT,  -- For real on-chain NFTs (later)
            tier_name TEXT NOT NULL,
            rarity TEXT,  -- Kept for backward compatibility
            earning_multiplier DECIMAL(3,1) NOT NULL,
            purchase_price_sol DECIMAL(12,6),
            purchase_price_tama DECIMAL(12,2),
            is_active BOOLEAN DEFAULT true,
            minted_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX idx_user_nfts_telegram ON user_nfts(telegram_id);
        CREATE INDEX idx_user_nfts_tier ON user_nfts(tier_name);
    END IF;
END $$;

COMMENT ON COLUMN user_nfts.nft_design_id IS 'Reference to nft_designs table';
COMMENT ON COLUMN user_nfts.purchase_price_sol IS 'Price paid in SOL (for Silver-Diamond)';
COMMENT ON COLUMN user_nfts.purchase_price_tama IS 'Price paid in TAMA (for Bronze)';

-- ============================================
-- 4. INITIAL DATA - NFT BONDING STATE
-- ============================================
-- Insert initial bonding curve parameters for each tier

INSERT INTO nft_bonding_state (tier_name, payment_type, current_price, minted_count, max_supply, start_price, end_price, increment_per_mint)
VALUES 
    -- Bronze: TAMA only, fixed price
    ('Bronze', 'TAMA', 5000.00, 0, 4500, 5000.00, 5000.00, 0.00),
    
    -- Silver: SOL bonding curve, 1 → 3 SOL
    ('Silver', 'SOL', 1.0, 0, 350, 1.0, 3.0, 0.005714),
    
    -- Gold: SOL bonding curve, 3 → 10 SOL
    ('Gold', 'SOL', 3.0, 0, 130, 3.0, 10.0, 0.053846),
    
    -- Platinum: SOL bonding curve, 10 → 30 SOL
    ('Platinum', 'SOL', 10.0, 0, 18, 10.0, 30.0, 1.111111),
    
    -- Diamond: SOL bonding curve, 50 → 100 SOL
    ('Diamond', 'SOL', 50.0, 0, 2, 50.0, 100.0, 50.0)
ON CONFLICT (tier_name) DO UPDATE SET
    current_price = EXCLUDED.current_price,
    minted_count = EXCLUDED.minted_count,
    updated_at = NOW();

-- ============================================
-- 5. INITIAL DATA - NFT DESIGNS (PLACEHOLDERS)
-- ============================================
-- Generate placeholder designs for all 5,000 NFTs
-- Real images will be added later via AI generation

-- Bronze: 4,500 designs
INSERT INTO nft_designs (tier_name, design_number, design_theme, design_variant)
SELECT 
    'Bronze' as tier_name,
    n as design_number,
    CASE 
        WHEN n <= 900 THEN 'Baby Creatures'
        WHEN n <= 1800 THEN 'Happy Eggs'
        WHEN n <= 2700 THEN 'Pixel Pets'
        WHEN n <= 3600 THEN 'Cute Blobs'
        ELSE 'Mini Dragons'
    END as design_theme,
    CASE (n-1) % 5
        WHEN 0 THEN 'Green'
        WHEN 1 THEN 'Blue'
        WHEN 2 THEN 'Red'
        WHEN 3 THEN 'Yellow'
        ELSE 'Purple'
    END as design_variant
FROM generate_series(1, 4500) as n
ON CONFLICT (tier_name, design_number) DO NOTHING;

-- Silver: 350 designs
INSERT INTO nft_designs (tier_name, design_number, design_theme, design_variant)
SELECT 
    'Silver' as tier_name,
    n as design_number,
    'Evolved Creatures' as design_theme,
    CASE (n-1) % 5
        WHEN 0 THEN 'Variant A'
        WHEN 1 THEN 'Variant B'
        WHEN 2 THEN 'Variant C'
        WHEN 3 THEN 'Variant D'
        ELSE 'Variant E'
    END as design_variant
FROM generate_series(1, 350) as n
ON CONFLICT (tier_name, design_number) DO NOTHING;

-- Gold: 130 designs
INSERT INTO nft_designs (tier_name, design_number, design_theme, design_variant)
SELECT 
    'Gold' as tier_name,
    n as design_number,
    'Elite Forms' as design_theme,
    CASE (n-1) % 5
        WHEN 0 THEN 'Style Alpha'
        WHEN 1 THEN 'Style Beta'
        WHEN 2 THEN 'Style Gamma'
        WHEN 3 THEN 'Style Delta'
        ELSE 'Style Omega'
    END as design_variant
FROM generate_series(1, 130) as n
ON CONFLICT (tier_name, design_number) DO NOTHING;

-- Platinum: 18 designs
INSERT INTO nft_designs (tier_name, design_number, design_theme, design_variant)
SELECT 
    'Platinum' as tier_name,
    n as design_number,
    'Legendary Beasts' as design_theme,
    'Unique Design ' || n as design_variant
FROM generate_series(1, 18) as n
ON CONFLICT (tier_name, design_number) DO NOTHING;

-- Diamond: 2 designs
INSERT INTO nft_designs (tier_name, design_number, design_theme, design_variant)
VALUES 
    ('Diamond', 1, 'Mythic', 'Alpha'),
    ('Diamond', 2, 'Mythic', 'Omega')
ON CONFLICT (tier_name, design_number) DO NOTHING;

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function to get current price for a tier
CREATE OR REPLACE FUNCTION get_nft_price(p_tier_name TEXT)
RETURNS DECIMAL(12,6) AS $$
DECLARE
    v_price DECIMAL(12,6);
BEGIN
    SELECT current_price INTO v_price
    FROM nft_bonding_state
    WHERE tier_name = p_tier_name AND is_active = true;
    
    RETURN v_price;
END;
$$ LANGUAGE plpgsql;

-- Function to get next price after mint
CREATE OR REPLACE FUNCTION get_next_nft_price(p_tier_name TEXT)
RETURNS DECIMAL(12,6) AS $$
DECLARE
    v_current_price DECIMAL(12,6);
    v_increment DECIMAL(12,6);
BEGIN
    SELECT current_price, increment_per_mint 
    INTO v_current_price, v_increment
    FROM nft_bonding_state
    WHERE tier_name = p_tier_name AND is_active = true;
    
    RETURN v_current_price + v_increment;
END;
$$ LANGUAGE plpgsql;

-- Function to get available NFT count for a tier
CREATE OR REPLACE FUNCTION get_available_nft_count(p_tier_name TEXT)
RETURNS INT AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM nft_designs
    WHERE tier_name = p_tier_name AND is_minted = false;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update bonding curve price after mint
CREATE OR REPLACE FUNCTION update_bonding_price(p_tier_name TEXT)
RETURNS void AS $$
BEGIN
    UPDATE nft_bonding_state
    SET 
        current_price = current_price + increment_per_mint,
        minted_count = minted_count + 1,
        updated_at = NOW()
    WHERE tier_name = p_tier_name;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. VIEWS FOR EASY QUERYING
-- ============================================

-- View: NFT stats per tier
CREATE OR REPLACE VIEW nft_tier_stats AS
SELECT 
    b.tier_name,
    b.payment_type,
    b.current_price,
    b.minted_count,
    b.max_supply,
    (b.max_supply - b.minted_count) as available,
    ROUND((b.minted_count::decimal / b.max_supply * 100), 2) as minted_percentage,
    b.start_price,
    b.end_price,
    CASE 
        WHEN b.tier_name = 'Bronze' THEN 2.0
        WHEN b.tier_name = 'Silver' THEN 2.3
        WHEN b.tier_name = 'Gold' THEN 2.7
        WHEN b.tier_name = 'Platinum' THEN 3.5
        WHEN b.tier_name = 'Diamond' THEN 5.0
    END as earning_multiplier
FROM nft_bonding_state b
ORDER BY 
    CASE b.tier_name
        WHEN 'Bronze' THEN 1
        WHEN 'Silver' THEN 2
        WHEN 'Gold' THEN 3
        WHEN 'Platinum' THEN 4
        WHEN 'Diamond' THEN 5
    END;

COMMENT ON VIEW nft_tier_stats IS 'Quick stats for each NFT tier';

-- View: User NFT holdings
CREATE OR REPLACE VIEW user_nft_holdings AS
SELECT 
    u.telegram_id,
    COUNT(*) as total_nfts,
    MAX(u.earning_multiplier) as best_multiplier,
    SUM(CASE WHEN u.tier_name = 'Bronze' THEN 1 ELSE 0 END) as bronze_count,
    SUM(CASE WHEN u.tier_name = 'Silver' THEN 1 ELSE 0 END) as silver_count,
    SUM(CASE WHEN u.tier_name = 'Gold' THEN 1 ELSE 0 END) as gold_count,
    SUM(CASE WHEN u.tier_name = 'Platinum' THEN 1 ELSE 0 END) as platinum_count,
    SUM(CASE WHEN u.tier_name = 'Diamond' THEN 1 ELSE 0 END) as diamond_count
FROM user_nfts u
WHERE u.is_active = true
GROUP BY u.telegram_id;

COMMENT ON VIEW user_nft_holdings IS 'Summary of each users NFT holdings';

-- ============================================
-- 8. VERIFICATION QUERIES
-- ============================================
-- Run these to verify setup:

-- Check bonding state
-- SELECT * FROM nft_bonding_state ORDER BY tier_name;

-- Check design counts
-- SELECT tier_name, COUNT(*) as design_count 
-- FROM nft_designs 
-- GROUP BY tier_name 
-- ORDER BY tier_name;

-- Check available NFTs
-- SELECT tier_name, COUNT(*) as available 
-- FROM nft_designs 
-- WHERE is_minted = false 
-- GROUP BY tier_name 
-- ORDER BY tier_name;

-- Check tier stats
-- SELECT * FROM nft_tier_stats;

-- ============================================
-- SETUP COMPLETE! ✅
-- ============================================
-- Next steps:
-- 1. Update frontend (nft-mint.html)
-- 2. Create API endpoints (mint-nft-bronze.php, mint-nft-sol.php)
-- 3. Test minting process
-- 4. Generate real NFT images with AI
-- 5. Upload to Arweave
-- ============================================

