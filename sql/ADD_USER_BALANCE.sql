-- Добавить начальный баланс пользователю 2139640084
-- Выполнить в Supabase SQL Editor

-- Проверить, есть ли пользователь
SELECT * FROM leaderboard WHERE telegram_id = '2139640084';

-- Если пользователь есть, обновить баланс:
UPDATE leaderboard 
SET tama = 10000
WHERE telegram_id = '2139640084';

-- Если пользователя нет, создать:
INSERT INTO leaderboard (telegram_id, tama, wallet_address)
VALUES ('2139640084', 10000, NULL)
ON CONFLICT (telegram_id) 
DO UPDATE SET tama = 10000;

-- Проверить результат:
SELECT telegram_id, tama FROM leaderboard WHERE telegram_id = '2139640084';

