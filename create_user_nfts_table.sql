-- Создание таблицы user_nfts для хранения NFT пользователей
-- Выполнить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_nfts (
    id BIGSERIAL PRIMARY KEY,
    telegram_id TEXT,
    wallet_address TEXT,
    mint_address TEXT NOT NULL UNIQUE,
    pet_type TEXT NOT NULL,
    rarity TEXT NOT NULL DEFAULT 'common',
    cost_tama INTEGER NOT NULL DEFAULT 0,
    cost_sol DECIMAL(10,6) NOT NULL DEFAULT 0,
    transaction_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_user_nfts_telegram_id ON user_nfts(telegram_id);
CREATE INDEX IF NOT EXISTS idx_user_nfts_wallet_address ON user_nfts(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_nfts_mint_address ON user_nfts(mint_address);
CREATE INDEX IF NOT EXISTS idx_user_nfts_rarity ON user_nfts(rarity);
CREATE INDEX IF NOT EXISTS idx_user_nfts_created_at ON user_nfts(created_at);

-- Включение RLS (Row Level Security)
ALTER TABLE user_nfts ENABLE ROW LEVEL SECURITY;

-- Политики RLS для доступа к NFT
CREATE POLICY "Users can view their own NFTs" ON user_nfts
    FOR SELECT USING (
        telegram_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
        wallet_address = current_setting('request.jwt.claims', true)::json->>'sub'
    );

CREATE POLICY "Users can insert their own NFTs" ON user_nfts
    FOR INSERT WITH CHECK (
        telegram_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
        wallet_address = current_setting('request.jwt.claims', true)::json->>'sub'
    );

-- Для анонимного доступа (если нужно)
CREATE POLICY "Allow anonymous access for API" ON user_nfts
    FOR ALL USING (true);

-- Комментарии к таблице и колонкам
COMMENT ON TABLE user_nfts IS 'NFT коллекция пользователей';
COMMENT ON COLUMN user_nfts.telegram_id IS 'Telegram ID пользователя';
COMMENT ON COLUMN user_nfts.wallet_address IS 'Адрес кошелька пользователя';
COMMENT ON COLUMN user_nfts.mint_address IS 'Адрес минта NFT в Solana';
COMMENT ON COLUMN user_nfts.pet_type IS 'Тип питомца (cat, dog, rabbit, etc.)';
COMMENT ON COLUMN user_nfts.rarity IS 'Редкость NFT (common, rare, epic, legendary)';
COMMENT ON COLUMN user_nfts.cost_tama IS 'Стоимость в TAMA токенах';
COMMENT ON COLUMN user_nfts.cost_sol IS 'Стоимость в SOL';
COMMENT ON COLUMN user_nfts.transaction_hash IS 'Хеш транзакции минта';
COMMENT ON COLUMN user_nfts.created_at IS 'Дата создания NFT';
COMMENT ON COLUMN user_nfts.updated_at IS 'Дата последнего обновления';

-- Проверка создания таблицы
SELECT 'user_nfts table created successfully' as status;


