-- ============================================
-- ДИАГНОСТИКА И ИСПРАВЛЕНИЕ БАЛАНСА
-- ============================================
-- Выполнить в Supabase SQL Editor

-- ШАГ 1: Проверить, есть ли пользователь в leaderboard
SELECT 
    telegram_id,
    telegram_username,
    tama,
    wallet_address,
    created_at
FROM leaderboard 
WHERE telegram_id = '2139640084' 
   OR telegram_id = 2139640084;

-- Если пользователь НЕ НАЙДЕН:
-- Проверить, есть ли он с другим форматом ID
SELECT 
    telegram_id,
    telegram_username,
    tama
FROM leaderboard 
WHERE CAST(telegram_id AS TEXT) LIKE '%2139640084%'
   OR telegram_username LIKE '%ваш_username%';  -- замените на свой username

-- ============================================
-- РЕШЕНИЕ 1: Создать пользователя с балансом
-- ============================================
-- Если пользователя нет вообще:
INSERT INTO leaderboard (
    telegram_id, 
    telegram_username,
    telegram_first_name,
    tama, 
    wallet_address
)
VALUES (
    '2139640084',      -- ваш telegram_id
    'your_username',   -- ваш username (или NULL)
    'Иван',           -- ваше имя
    10000,            -- начальный баланс 10,000 TAMA
    NULL              -- кошелек пока не подключен
)
ON CONFLICT (telegram_id) 
DO UPDATE SET 
    tama = 10000,
    updated_at = NOW();

-- ============================================
-- РЕШЕНИЕ 2: Если пользователь есть, обновить баланс
-- ============================================
UPDATE leaderboard 
SET tama = 10000  -- или ваш текущий баланс
WHERE telegram_id = '2139640084';

-- ============================================
-- ПРОВЕРКА: Убедиться, что баланс обновился
-- ============================================
SELECT 
    telegram_id,
    telegram_username,
    tama,
    updated_at
FROM leaderboard 
WHERE telegram_id = '2139640084';

-- Должно показать:
-- telegram_id: 2139640084
-- tama: 10000

-- ============================================
-- ДОПОЛНИТЕЛЬНО: Проверить все записи для вашего ID
-- ============================================
-- Посмотреть, нет ли дублей
SELECT 
    COUNT(*) as count,
    telegram_id,
    telegram_username
FROM leaderboard 
WHERE telegram_id IN ('2139640084', 2139640084)
GROUP BY telegram_id, telegram_username;

-- Если дублей больше 1, нужно объединить:
-- 1. Сохранить максимальный баланс
-- 2. Удалить дубли

-- ============================================
-- ДЛЯ БОТА: Проверить, какой ID использует бот
-- ============================================
-- Посмотреть последние транзакции от вашего ID
SELECT 
    telegram_id,
    type,
    amount,
    balance_after,
    created_at
FROM transactions 
WHERE telegram_id IN ('2139640084', 2139640084)
ORDER BY created_at DESC
LIMIT 10;

-- Если транзакции есть, значит бот использует этот ID
-- Баланс должен быть в balance_after последней транзакции

