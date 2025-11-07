-- NFT Tiers Configuration Table
CREATE TABLE IF NOT EXISTS nft_tiers (
    tier_name TEXT PRIMARY KEY,
    tama_price INTEGER NOT NULL DEFAULT 2500,
    sol_price NUMERIC(10, 3) NOT NULL DEFAULT 0.05,
    base_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 2.0,
    rarity_chances JSONB NOT NULL DEFAULT '{"Common": 50, "Uncommon": 30, "Rare": 15, "Epic": 4, "Legendary": 1}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO nft_tiers (tier_name, tama_price, sol_price, base_multiplier, rarity_chances) VALUES
    ('Bronze', 2500, 0.05, 2.0, '{"Common": 50, "Uncommon": 30, "Rare": 15, "Epic": 4, "Legendary": 1}'),
    ('Silver', 5000, 0.1, 2.5, '{"Common": 40, "Uncommon": 30, "Rare": 20, "Epic": 8, "Legendary": 2}'),
    ('Gold', 10000, 0.2, 3.0, '{"Common": 30, "Uncommon": 30, "Rare": 25, "Epic": 12, "Legendary": 3}')
ON CONFLICT (tier_name) DO NOTHING;

-- User NFTs Table (track user's NFT ownership and bonuses)
CREATE TABLE IF NOT EXISTS user_nfts (
    id SERIAL PRIMARY KEY,
    telegram_id TEXT NOT NULL,
    nft_mint_address TEXT UNIQUE NOT NULL,
    tier_name TEXT NOT NULL REFERENCES nft_tiers(tier_name),
    rarity TEXT NOT NULL CHECK (rarity IN ('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary')),
    earning_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 2.0,
    minted_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_nfts_telegram ON user_nfts(telegram_id);
CREATE INDEX IF NOT EXISTS idx_user_nfts_mint ON user_nfts(nft_mint_address);

-- Function to get user's best NFT multiplier
CREATE OR REPLACE FUNCTION get_user_nft_multiplier(user_telegram_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
    max_multiplier NUMERIC;
BEGIN
    SELECT COALESCE(MAX(earning_multiplier), 1.0) INTO max_multiplier
    FROM user_nfts
    WHERE telegram_id = user_telegram_id AND is_active = TRUE;
    
    RETURN max_multiplier;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE nft_tiers IS 'Configuration for NFT tier pricing and rarity chances';
COMMENT ON TABLE user_nfts IS 'Track user NFT ownership and earning bonuses';
COMMENT ON FUNCTION get_user_nft_multiplier IS 'Get user best NFT earning multiplier (returns 1.0 if no NFT)';

