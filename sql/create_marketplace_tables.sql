-- ============================================
-- MARKETPLACE TABLES
-- ============================================
-- Created: 2025-11-23
-- Description: Tables for NFT marketplace (buy/sell)
-- 
-- Tables:
-- 1. marketplace_listings - Active NFT listings for sale
-- 2. marketplace_sales - Completed sales history
-- ============================================

-- ============================================
-- 1. MARKETPLACE LISTINGS
-- ============================================
-- Active NFT listings on the marketplace

-- Drop table if exists (for development - remove in production!)
-- DROP TABLE IF EXISTS marketplace_listings CASCADE;

CREATE TABLE IF NOT EXISTS marketplace_listings (
    id SERIAL PRIMARY KEY,
    
    -- NFT reference
    nft_id INT NOT NULL REFERENCES user_nfts(id) ON DELETE CASCADE,
    nft_mint_address TEXT,  -- On-chain NFT mint address
    
    -- Seller info
    seller_telegram_id BIGINT NOT NULL,
    seller_wallet_address TEXT,  -- Optional wallet address
    
    -- Listing details
    price_tama BIGINT,  -- Price in TAMA (optional if price_sol is set)
    price_sol DECIMAL(12, 9),  -- Price in SOL (optional if price_tama is set)
    payment_type TEXT NOT NULL DEFAULT 'tama',  -- Payment method: 'tama', 'sol', 'both'
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active',
    
    -- Timestamps
    listed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,  -- Optional expiration
    sold_at TIMESTAMP WITH TIME ZONE,
    
    -- Sale details (filled when sold)
    buyer_telegram_id BIGINT,
    buyer_wallet_address TEXT,
    sale_transaction_signature TEXT,  -- Solana transaction signature
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT payment_type_check CHECK (payment_type IN ('tama', 'sol', 'both')),
    CONSTRAINT status_check CHECK (status IN ('active', 'sold', 'cancelled', 'expired')),
    CONSTRAINT price_check CHECK (
        (price_tama IS NOT NULL AND price_tama >= 1000) OR 
        (price_sol IS NOT NULL AND price_sol > 0) OR
        (price_tama IS NOT NULL AND price_sol IS NOT NULL)
    )  -- At least one price must be set, TAMA min 1000, SOL min 0.001
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_seller ON marketplace_listings(seller_telegram_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_nft ON marketplace_listings(nft_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_mint ON marketplace_listings(nft_mint_address) WHERE nft_mint_address IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_active ON marketplace_listings(status, listed_at DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_price ON marketplace_listings(price_tama) WHERE status = 'active';

COMMENT ON TABLE marketplace_listings IS 'Active NFT listings on the marketplace';
COMMENT ON COLUMN marketplace_listings.price_tama IS 'Price in TAMA tokens (minimum 1000)';
COMMENT ON COLUMN marketplace_listings.status IS 'active, sold, cancelled, or expired';

-- ============================================
-- 2. MARKETPLACE SALES (History)
-- ============================================
-- Completed sales for analytics and history

CREATE TABLE IF NOT EXISTS marketplace_sales (
    id SERIAL PRIMARY KEY,
    
    -- Original listing
    listing_id INT NOT NULL REFERENCES marketplace_listings(id),
    
    -- NFT details
    nft_id INT NOT NULL REFERENCES user_nfts(id),
    nft_mint_address TEXT,
    tier_name TEXT NOT NULL,
    rarity TEXT,
    
    -- Sale details
    seller_telegram_id BIGINT NOT NULL,
    seller_wallet_address TEXT,
    buyer_telegram_id BIGINT NOT NULL,
    buyer_wallet_address TEXT,
    
    -- Price details
    sale_price_tama BIGINT,  -- Price in TAMA (if paid with TAMA)
    sale_price_sol DECIMAL(12, 9),  -- Price in SOL (if paid with SOL)
    platform_fee_tama BIGINT,  -- 5% of sale price in TAMA
    platform_fee_sol DECIMAL(12, 9),  -- 5% of sale price in SOL
    seller_received_tama BIGINT,  -- 95% of sale price in TAMA
    seller_received_sol DECIMAL(12, 9),  -- 95% of sale price in SOL
    
    -- Transaction
    transaction_signature TEXT,  -- Solana transaction signature
    transaction_type TEXT DEFAULT 'tama',
    
    -- Timestamps
    sold_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT transaction_signature_unique UNIQUE (transaction_signature),
    CONSTRAINT transaction_type_check CHECK (transaction_type IN ('tama', 'sol', 'mixed')),
    CONSTRAINT payment_method_check CHECK (
        (sale_price_tama IS NOT NULL AND platform_fee_tama IS NOT NULL AND seller_received_tama IS NOT NULL) OR
        (sale_price_sol IS NOT NULL AND platform_fee_sol IS NOT NULL AND seller_received_sol IS NOT NULL)
    )  -- At least one payment method must be set
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_seller ON marketplace_sales(seller_telegram_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_buyer ON marketplace_sales(buyer_telegram_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_date ON marketplace_sales(sold_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_tier ON marketplace_sales(tier_name);
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_tx ON marketplace_sales(transaction_signature) WHERE transaction_signature IS NOT NULL;

COMMENT ON TABLE marketplace_sales IS 'Completed NFT sales history';
COMMENT ON COLUMN marketplace_sales.platform_fee_tama IS '5% platform fee in TAMA';
COMMENT ON COLUMN marketplace_sales.seller_received_tama IS '95% of sale price (after fee)';

-- ============================================
-- 3. UPDATE USER_NFTS TABLE
-- ============================================
-- Add is_listed flag if it doesn't exist

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_nfts') THEN
        -- Add is_listed column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'user_nfts' AND column_name = 'is_listed') THEN
            ALTER TABLE user_nfts ADD COLUMN is_listed BOOLEAN DEFAULT false;
            CREATE INDEX IF NOT EXISTS idx_user_nfts_listed ON user_nfts(is_listed) WHERE is_listed = true;
        END IF;
    END IF;
END $$;

-- ============================================
-- 4. TRIGGERS
-- ============================================
-- Auto-update updated_at timestamp

CREATE OR REPLACE FUNCTION update_marketplace_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_marketplace_listings_updated_at ON marketplace_listings;
CREATE TRIGGER trigger_marketplace_listings_updated_at
    BEFORE UPDATE ON marketplace_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_marketplace_listings_updated_at();

-- ============================================
-- 5. VIEWS (Optional - for easier queries)
-- ============================================

-- View: Active listings with NFT details
CREATE OR REPLACE VIEW marketplace_listings_view AS
SELECT 
    l.id AS listing_id,
    l.nft_id,
    l.nft_mint_address,
    l.seller_telegram_id,
    l.price_tama,
    l.price_sol,
    l.listed_at,
    l.expires_at,
    n.tier_name,
    n.rarity,
    n.earning_multiplier,
    n.is_active AS nft_is_active
FROM marketplace_listings l
JOIN user_nfts n ON l.nft_id = n.id
WHERE l.status = 'active' AND n.is_active = true;

COMMENT ON VIEW marketplace_listings_view IS 'Active marketplace listings with NFT details';

