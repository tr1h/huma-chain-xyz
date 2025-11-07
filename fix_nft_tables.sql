-- Fix NFT Tables - Исправление структуры таблиц

-- 1. Проверка и создание таблицы nft_tiers
CREATE TABLE IF NOT EXISTS nft_tiers (
    tier_name TEXT PRIMARY KEY,
    tama_price INTEGER NOT NULL DEFAULT 2500,
    sol_price NUMERIC(10, 3) NOT NULL DEFAULT 0.05,
    base_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 2.0,
    rarity_chances JSONB NOT NULL DEFAULT '{"Common": 50, "Uncommon": 30, "Rare": 15, "Epic": 4, "Legendary": 1}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Исправление таблицы user_nfts (если она существует без нужных колонок)
-- Сначала удаляем таблицу, если она существует неправильно
DROP TABLE IF EXISTS user_nfts CASCADE;

-- Создаем таблицу заново с правильной структурой
CREATE TABLE user_nfts (
    id SERIAL PRIMARY KEY,
    telegram_id TEXT NOT NULL,
    nft_mint_address TEXT UNIQUE NOT NULL,
    tier_name TEXT NOT NULL,
    rarity TEXT NOT NULL CHECK (rarity IN ('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary')),
    earning_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 2.0,
    minted_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Добавляем внешний ключ (если таблица nft_tiers существует)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nft_tiers') THEN
        ALTER TABLE user_nfts 
        ADD CONSTRAINT fk_user_nfts_tier 
        FOREIGN KEY (tier_name) REFERENCES nft_tiers(tier_name);
    END IF;
END $$;

-- 3. Создаем индексы
CREATE INDEX IF NOT EXISTS idx_user_nfts_telegram ON user_nfts(telegram_id);
CREATE INDEX IF NOT EXISTS idx_user_nfts_mint ON user_nfts(nft_mint_address);

-- 4. Вставляем дефолтные тиры
INSERT INTO nft_tiers (tier_name, tama_price, sol_price, base_multiplier, rarity_chances) VALUES
    ('Bronze', 2500, 0.05, 2.0, '{"Common": 50, "Uncommon": 30, "Rare": 15, "Epic": 4, "Legendary": 1}'),
    ('Silver', 5000, 0.1, 2.5, '{"Common": 40, "Uncommon": 30, "Rare": 20, "Epic": 8, "Legendary": 2}'),
    ('Gold', 10000, 0.2, 3.0, '{"Common": 30, "Uncommon": 30, "Rare": 25, "Epic": 12, "Legendary": 3}')
ON CONFLICT (tier_name) DO UPDATE
SET 
    tama_price = EXCLUDED.tama_price,
    sol_price = EXCLUDED.sol_price,
    base_multiplier = EXCLUDED.base_multiplier,
    rarity_chances = EXCLUDED.rarity_chances,
    updated_at = NOW();

-- 5. Создаем/обновляем функцию
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

-- 6. Комментарии
COMMENT ON TABLE nft_tiers IS 'Configuration for NFT tier pricing and rarity chances';
COMMENT ON TABLE user_nfts IS 'Track user NFT ownership and earning bonuses';
COMMENT ON FUNCTION get_user_nft_multiplier IS 'Get user best NFT earning multiplier (returns 1.0 if no NFT)';

-- 7. Проверка структуры
DO $$
BEGIN
    -- Проверяем наличие колонки nft_mint_address
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_nfts' AND column_name = 'nft_mint_address'
    ) THEN
        RAISE EXCEPTION 'Column nft_mint_address does not exist in user_nfts table';
    END IF;
    
    RAISE NOTICE 'All tables and columns are correct!';
END $$;

