-- Создание таблицы user_nfts для хранения NFT пользователей
-- Упрощенная версия без RLS

-- Удалить таблицу если существует (для пересоздания)
DROP TABLE IF EXISTS user_nfts CASCADE;

-- Создать таблицу
CREATE TABLE user_nfts (
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

-- Создать индексы для быстрого поиска
CREATE INDEX idx_user_nfts_telegram_id ON user_nfts(telegram_id);
CREATE INDEX idx_user_nfts_wallet_address ON user_nfts(wallet_address);
CREATE INDEX idx_user_nfts_mint_address ON user_nfts(mint_address);
CREATE INDEX idx_user_nfts_rarity ON user_nfts(rarity);
CREATE INDEX idx_user_nfts_created_at ON user_nfts(created_at);

-- Отключить RLS для упрощения (можно включить позже)
ALTER TABLE user_nfts DISABLE ROW LEVEL SECURITY;

-- Проверка создания таблицы
SELECT 'user_nfts table created successfully' as status;




