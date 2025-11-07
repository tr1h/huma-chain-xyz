# 🔧 Исправление ошибки "column nft_mint_address does not exist"

## ❌ Проблема

При выполнении SQL получил ошибку:
```
ERROR: 42703: column "nft_mint_address" does not exist
```

## ✅ Решение

### Вариант 1: Использовать исправленный файл (РЕКОМЕНДУЕТСЯ)

1. Открой **`create_nft_tiers_table_FIXED.sql`**
2. Скопируй весь SQL код
3. Вставь в **Supabase SQL Editor**
4. Нажми **Run**

Этот файл:
- ✅ Удаляет старую таблицу `user_nfts` (если есть)
- ✅ Создает таблицы в правильном порядке
- ✅ Добавляет все нужные колонки
- ✅ Создает индексы и функции

### Вариант 2: Использовать fix_nft_tables.sql

1. Открой **`fix_nft_tables.sql`**
2. Скопируй весь SQL код
3. Вставь в **Supabase SQL Editor**
4. Нажми **Run**

### Вариант 3: Исправить вручную

Если таблица `user_nfts` уже существует, но без нужной колонки:

```sql
-- 1. Удалить старую таблицу
DROP TABLE IF EXISTS user_nfts CASCADE;

-- 2. Создать заново с правильной структурой
CREATE TABLE user_nfts (
    id SERIAL PRIMARY KEY,
    telegram_id TEXT NOT NULL,
    nft_mint_address TEXT UNIQUE NOT NULL,  -- ЭТА КОЛОНКА ОБЯЗАТЕЛЬНА!
    tier_name TEXT NOT NULL,
    rarity TEXT NOT NULL CHECK (rarity IN ('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary')),
    earning_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 2.0,
    minted_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Добавить внешний ключ
ALTER TABLE user_nfts 
ADD CONSTRAINT fk_user_nfts_tier 
FOREIGN KEY (tier_name) REFERENCES nft_tiers(tier_name);

-- 4. Создать индексы
CREATE INDEX IF NOT EXISTS idx_user_nfts_telegram ON user_nfts(telegram_id);
CREATE INDEX IF NOT EXISTS idx_user_nfts_mint ON user_nfts(nft_mint_address);
```

---

## ✅ Проверка после исправления

Выполни в Supabase SQL Editor:

```sql
-- Проверить структуру таблицы
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_nfts';

-- Должно показать колонку nft_mint_address
```

**Ожидаемый результат:**
```
column_name          | data_type
---------------------|----------
id                   | integer
telegram_id          | text
nft_mint_address     | text      <-- ДОЛЖНА БЫТЬ!
tier_name            | text
rarity               | text
earning_multiplier   | numeric
minted_at            | timestamp with time zone
last_verified        | timestamp with time zone
is_active            | boolean
```

---

## 🚀 После исправления

1. Запусти тест: `python test_nft_system.py`
2. Должно быть: `[OK] Таблица 'user_nfts' существует`
3. Проверь админку: `admin-nft-tiers.html`
4. Проверь бота: NFT множитель должен работать!

---

**Готово!** 🎉

