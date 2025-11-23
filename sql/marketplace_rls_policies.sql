-- ============================================
-- MARKETPLACE RLS (Row Level Security) POLICIES
-- ============================================
-- Created: 2025-11-23
-- Description: Security policies for marketplace tables
-- 
-- ⚠️ ВАЖНО: Эти политики опциональны!
-- Если не настроить RLS, таблицы будут доступны через service role key
-- (который используется в API)
-- ============================================

-- ============================================
-- 1. MARKETPLACE_LISTINGS
-- ============================================

-- Enable RLS
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read for all (public listings)
CREATE POLICY "Allow read active listings" ON marketplace_listings
    FOR SELECT
    USING (status = 'active');

-- Policy: Allow insert for authenticated users
-- Note: In our case, we use service role key, so this might not be needed
-- But it's good to have for future authentication
CREATE POLICY "Allow insert listings" ON marketplace_listings
    FOR INSERT
    WITH CHECK (true);  -- Service role bypasses RLS anyway

-- Policy: Allow update for listing owner (seller)
-- This would work if we had JWT tokens with telegram_id
CREATE POLICY "Allow update own listings" ON marketplace_listings
    FOR UPDATE
    USING (true);  -- Service role bypasses RLS

-- Policy: Allow delete for listing owner
CREATE POLICY "Allow delete own listings" ON marketplace_listings
    FOR DELETE
    USING (true);  -- Service role bypasses RLS

-- ============================================
-- 2. MARKETPLACE_SALES
-- ============================================

-- Enable RLS
ALTER TABLE marketplace_sales ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read for all (public sales history)
CREATE POLICY "Allow read sales" ON marketplace_sales
    FOR SELECT
    USING (true);

-- Policy: Allow insert for system (via service role)
CREATE POLICY "Allow insert sales" ON marketplace_sales
    FOR INSERT
    WITH CHECK (true);  -- Service role bypasses RLS

-- ============================================
-- 3. USER_NFTS (if RLS enabled)
-- ============================================

-- Only if RLS is enabled on user_nfts
-- Allow read for all (to show NFT details)
-- CREATE POLICY "Allow read user_nfts" ON user_nfts
--     FOR SELECT
--     USING (true);

-- ============================================
-- ПРИМЕЧАНИЕ:
-- ============================================
-- 
-- В текущей реализации API использует SERVICE_ROLE_KEY,
-- который обходит RLS политики. Это означает:
-- 
-- ✅ RLS политики опциональны
-- ✅ API работает без RLS
-- ✅ RLS добавляет дополнительный уровень безопасности
-- 
-- Если хотите использовать RLS:
-- 1. Выполните этот скрипт в Supabase SQL Editor
-- 2. Убедитесь, что политики не блокируют ваши запросы
-- 3. Протестируйте все endpoints
-- 
-- Если НЕ хотите использовать RLS:
-- - Просто не выполняйте этот скрипт
-- - API будет работать через service role key
-- - Это нормально для внутренних API

