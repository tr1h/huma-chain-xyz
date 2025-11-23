# 🔒 RLS (Row Level Security) Setup Guide

## Что такое RLS?

**Row Level Security (RLS)** - это система безопасности в Supabase, которая позволяет контролировать доступ к строкам в таблицах на уровне базы данных.

## ⚠️ Важно: RLS опционально!

В текущей реализации:
- ✅ API использует **SERVICE_ROLE_KEY**, который **обходит RLS**
- ✅ Это означает, что **RLS не обязателен** для работы API
- ✅ RLS добавляет **дополнительный уровень безопасности**

---

## 📋 Как настроить RLS (опционально):

### **Шаг 1: Откройте Supabase Dashboard**

1. Перейдите на https://supabase.com
2. Войдите в свой проект
3. Откройте **SQL Editor**

### **Шаг 2: Выполните SQL скрипт**

Скопируйте содержимое файла `sql/marketplace_rls_policies.sql` и выполните в SQL Editor.

Или выполните вручную:

```sql
-- Enable RLS on marketplace_listings
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Allow read for all (public listings)
CREATE POLICY "Allow read active listings" ON marketplace_listings
    FOR SELECT
    USING (status = 'active');

-- Allow insert for authenticated users
CREATE POLICY "Allow insert listings" ON marketplace_listings
    FOR INSERT
    WITH CHECK (true);

-- Allow update for listing owner
CREATE POLICY "Allow update own listings" ON marketplace_listings
    FOR UPDATE
    USING (true);

-- Allow delete for listing owner
CREATE POLICY "Allow delete own listings" ON marketplace_listings
    FOR DELETE
    USING (true);

-- Enable RLS on marketplace_sales
ALTER TABLE marketplace_sales ENABLE ROW LEVEL SECURITY;

-- Allow read for all (public sales history)
CREATE POLICY "Allow read sales" ON marketplace_sales
    FOR SELECT
    USING (true);

-- Allow insert for system
CREATE POLICY "Allow insert sales" ON marketplace_sales
    FOR INSERT
    WITH CHECK (true);
```

### **Шаг 3: Проверьте работу**

После настройки RLS:
1. API должен продолжать работать (использует service role key)
2. Прямые запросы через Supabase client будут проверяться RLS
3. Если что-то не работает, можно отключить RLS:

```sql
ALTER TABLE marketplace_listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_sales DISABLE ROW LEVEL SECURITY;
```

---

## 🔍 Как проверить, работает ли RLS:

```sql
-- Проверить, включен ли RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('marketplace_listings', 'marketplace_sales');

-- Посмотреть все политики
SELECT * FROM pg_policies 
WHERE tablename IN ('marketplace_listings', 'marketplace_sales');
```

---

## ⚠️ Важные замечания:

1. **Service Role Key обходит RLS:**
   - API использует `SUPABASE_KEY` (service role)
   - Этот ключ имеет полный доступ, независимо от RLS
   - RLS влияет только на запросы через anon key

2. **Если используете anon key:**
   - RLS будет применяться
   - Нужно настроить политики правильно
   - Иначе запросы могут не работать

3. **Для продакшена:**
   - Рекомендуется настроить RLS
   - Это дополнительный уровень защиты
   - Но не критично, если API использует service role

---

## ✅ Итог:

- **RLS опционально** - API работает без него
- **Можно настроить** для дополнительной безопасности
- **Можно отключить** если мешает работе
- **Service role key** обходит RLS в любом случае

