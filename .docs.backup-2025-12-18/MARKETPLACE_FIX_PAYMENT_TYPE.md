# 🔧 Исправление: Добавление колонки payment_type

## ❌ Проблема:
```
Failed to create listing: Could not find the 'payment_type' column of 'marketplace_listings' in the schema cache
```

Таблица `marketplace_listings` существует, но без колонки `payment_type`.

---

## ✅ Решение:

### **Вариант 1: Добавить колонку (если таблица уже создана)**

Выполните в Supabase SQL Editor:

```sql
-- Добавить колонку payment_type
ALTER TABLE marketplace_listings 
ADD COLUMN IF NOT EXISTS payment_type TEXT NOT NULL DEFAULT 'tama';

-- Добавить constraint
ALTER TABLE marketplace_listings
DROP CONSTRAINT IF EXISTS payment_type_check;

ALTER TABLE marketplace_listings
ADD CONSTRAINT payment_type_check 
CHECK (payment_type IN ('tama', 'sol', 'both'));
```

Или выполните готовый скрипт:
```sql
-- Выполните sql/add_payment_type_to_marketplace.sql
```

---

### **Вариант 2: Пересоздать таблицу (если данных нет)**

Если в таблице `marketplace_listings` нет важных данных:

```sql
-- Удалить таблицу
DROP TABLE IF EXISTS marketplace_listings CASCADE;

-- Создать заново
-- Выполните sql/create_marketplace_tables.sql
```

---

## 📋 Проверка:

После выполнения миграции проверьте:

```sql
-- Проверить структуру таблицы
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'marketplace_listings'
ORDER BY ordinal_position;
```

Должна быть колонка:
- `payment_type` | `text` | `NO` | `'tama'::text`

---

## 🚀 После исправления:

1. Обновите страницу маркетплейса
2. Попробуйте разместить NFT снова
3. Должно работать! ✅

