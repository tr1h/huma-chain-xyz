-- ============================================
-- 🔒 FIX LEADERBOARD RLS SECURITY
-- Запретить прямые обновления баланса через anon key
-- ============================================

-- ВАЖНО: Этот скрипт нужно запустить в Supabase SQL Editor!

-- Шаг 1: Включить RLS на таблице leaderboard (если еще не включен)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Шаг 2: Удалить старые политики (если есть)
DROP POLICY IF EXISTS "Allow anon updates" ON leaderboard;
DROP POLICY IF EXISTS "Allow authenticated updates" ON leaderboard;
DROP POLICY IF EXISTS "Allow service role updates" ON leaderboard;
DROP POLICY IF EXISTS "Allow all updates" ON leaderboard;

-- Шаг 3: Разрешить SELECT для всех (нужно для чтения данных)
DROP POLICY IF EXISTS "Allow anon reads" ON leaderboard;
CREATE POLICY "Allow anon reads" ON leaderboard
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Шаг 4: ЗАПРЕТИТЬ UPDATE/PATCH для anon роли (критично!)
-- Только service_role (API) может обновлять баланс
CREATE POLICY "Allow service role updates only" ON leaderboard
    FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Шаг 5: Разрешить INSERT для authenticated (создание новых пользователей)
DROP POLICY IF EXISTS "Allow authenticated inserts" ON leaderboard;
CREATE POLICY "Allow authenticated inserts" ON leaderboard
    FOR INSERT
    TO authenticated, service_role
    WITH CHECK (true);

-- Шаг 6: Разрешить UPDATE только для service_role (через API)
-- anon НЕ может обновлять баланс напрямую!

-- ============================================
-- ✅ РЕЗУЛЬТАТ:
-- - anon может ЧИТАТЬ (SELECT) данные
-- - anon НЕ может ОБНОВЛЯТЬ (UPDATE/PATCH) баланс
-- - Только service_role (API) может обновлять баланс
-- - Это предотвращает читерство через прямой доступ к Supabase
-- ============================================

-- Проверка: Попробовать обновить через anon key должно вернуть ошибку
-- SELECT * FROM leaderboard WHERE telegram_id = '123456789'; -- ✅ Работает
-- UPDATE leaderboard SET tama = 999999 WHERE telegram_id = '123456789'; -- ❌ Должно вернуть ошибку для anon



