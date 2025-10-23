-- ============================================
-- TRANSACTIONS TABLE - История всех транзакций
-- ============================================

-- Создаем таблицу транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    
    -- Пользователь
    telegram_id TEXT NOT NULL,
    telegram_username TEXT,
    
    -- Тип транзакции
    type TEXT NOT NULL, -- 'earn', 'spend', 'referral', 'daily_reward', 'mini_game', 'level_up', 'admin_action'
    action TEXT NOT NULL, -- 'click', 'feed', 'play', 'heal', 'referral_bonus', 'daily_claim', etc.
    
    -- Суммы
    amount INTEGER NOT NULL, -- сколько TAMA (положительное или отрицательное)
    balance_before INTEGER, -- баланс до транзакции
    balance_after INTEGER, -- баланс после транзакции
    
    -- Детали
    description TEXT, -- описание транзакции
    metadata JSONB, -- дополнительные данные (level, combo, game_type, etc.)
    
    -- Связи
    related_user_id TEXT, -- для referral - ID реферала
    
    -- Метки времени
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Индексы для быстрого поиска
    CONSTRAINT transactions_telegram_id_fkey FOREIGN KEY (telegram_id) 
        REFERENCES leaderboard(telegram_id) ON DELETE CASCADE
);

-- Создаем индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_transactions_telegram_id ON transactions(telegram_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_amount ON transactions(amount);

-- Создаем индекс для поиска по пользователю и времени
CREATE INDEX IF NOT EXISTS idx_transactions_user_time ON transactions(telegram_id, created_at DESC);

-- Комментарии к таблице
COMMENT ON TABLE transactions IS 'История всех TAMA транзакций в игре';
COMMENT ON COLUMN transactions.type IS 'Тип транзакции: earn, spend, referral, daily_reward, mini_game, level_up, admin_action';
COMMENT ON COLUMN transactions.action IS 'Конкретное действие: click, feed, play, heal, referral_bonus, daily_claim, etc.';
COMMENT ON COLUMN transactions.amount IS 'Сумма TAMA (положительная для заработка, отрицательная для траты)';
COMMENT ON COLUMN transactions.metadata IS 'Дополнительные данные в JSON формате';

-- ============================================
-- ПРИМЕРЫ ЗАПРОСОВ
-- ============================================

-- 1. Все транзакции пользователя
-- SELECT * FROM transactions WHERE telegram_id = '123456789' ORDER BY created_at DESC;

-- 2. Общий баланс заработка/трат пользователя
-- SELECT 
--     SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_earned,
--     SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_spent
-- FROM transactions WHERE telegram_id = '123456789';

-- 3. Топ пользователей по заработку
-- SELECT telegram_id, telegram_username, SUM(amount) as total_earned
-- FROM transactions WHERE amount > 0
-- GROUP BY telegram_id, telegram_username
-- ORDER BY total_earned DESC
-- LIMIT 10;

-- 4. Статистика по типам транзакций
-- SELECT type, COUNT(*) as count, SUM(amount) as total_amount
-- FROM transactions
-- GROUP BY type
-- ORDER BY total_amount DESC;

-- 5. Последние 100 транзакций (глобальный лог)
-- SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100;

-- 6. Транзакции за последний час
-- SELECT * FROM transactions 
-- WHERE created_at > NOW() - INTERVAL '1 hour'
-- ORDER BY created_at DESC;

-- 7. Топ действий по количеству
-- SELECT action, COUNT(*) as count, SUM(amount) as total_tama
-- FROM transactions
-- GROUP BY action
-- ORDER BY count DESC
-- LIMIT 20;

