# ⚡ Quick Start - Тестирование за 5 минут

## 🚀 Быстрый запуск

### Шаг 1: Установить Database (2 мин)

```
1. Открой Supabase Dashboard
   https://supabase.com/dashboard

2. Перейди в SQL Editor

3. Скопируй весь код из файла:
   C:\goooog\sql\create_nft_5tier_system.sql

4. Вставь в SQL Editor

5. Нажми RUN

6. Жди "Success" ✅
```

**Проверка:**
```sql
SELECT * FROM nft_bonding_state;
-- Должно показать 5 строк (Bronze, Silver, Gold, Platinum, Diamond)
```

---

### Шаг 2: Создать тестового пользователя (1 мин)

```sql
-- Проверь есть ли уже игрок
SELECT * FROM players WHERE telegram_id = 123456789;

-- Если нет, создай:
INSERT INTO players (telegram_id, username, tama_balance) 
VALUES (123456789, 'test_user', 10000);

-- Если есть, обнови баланс:
UPDATE players SET tama_balance = 10000 WHERE telegram_id = 123456789;
```

---

### Шаг 3: Тестировать Bronze Mint (1 мин)

**Вариант A: Через API (прямой тест)**

```bash
curl -X POST https://your-domain.com/api/mint-nft-bronze.php \
  -H "Content-Type: application/json" \
  -d '{"telegram_id": 123456789}'
```

**Ожидаемый ответ:**
```json
{
  "success": true,
  "tier": "Bronze",
  "design_number": 1234,
  "boost": 2.0,
  "new_tama_balance": 5000
}
```

**Вариант B: Через Frontend**

```
1. Открой: https://your-domain.com/nft-mint-5tiers.html?user_id=123456789
2. Нажми "🔥 MINT BRONZE"
3. Должен появиться success alert
```

**Проверка:**
```sql
-- TAMA списался?
SELECT tama_balance FROM players WHERE telegram_id = 123456789;
-- Должно быть: 5,000 (было 10,000)

-- NFT создался?
SELECT * FROM user_nfts WHERE telegram_id = 123456789;
-- Должна быть 1 строка, tier_name='Bronze'
```

---

### Шаг 4: Проверить Admin Panel (30 сек)

```
1. Открой: https://your-domain.com/super-admin.html

2. Scroll вниз до "💎 NFT 5-Tier System - Live Stats"

3. Проверь что видишь:
   ✅ Bronze: 1 / 4,500 minted
   ✅ Silver: 0 / 350 minted
   ✅ Total Minted: 1
   ✅ Collection Progress: 0.02%
```

---

## ✅ ГОТОВО!

Если всё работает:
- ✅ Bronze минтится
- ✅ TAMA списывается
- ✅ NFT создаётся в базе
- ✅ Admin panel показывает stats

**→ Система работает!** 🎉

---

## 🐛 Проблемы?

### "Failed to connect to database"
```
1. Проверь api/config.php
2. Проверь SUPABASE_DB_HOST, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD
3. Убедись что database доступна
```

### "No NFT designs found"
```
Запусти снова: sql/create_nft_5tier_system.sql
```

### "TAMA not deducted"
```sql
-- Проверь что транзакция успешна
SELECT tama_balance FROM players WHERE telegram_id = 123456789;

-- Если не обновилось, проверь логи PHP
```

### Frontend не загружается
```
1. Проверь что nft-mint-5tiers.html доступен
2. Открой DevTools (F12)
3. Смотри Console на ошибки
4. Проверь что API endpoints доступны
```

---

## 📊 Полное Тестирование

Для детального тестирования смотри:
**`.docs/TESTING_GUIDE_5TIERS.md`**

Включает:
- ✅ SOL bonding curve testing
- ✅ Edge cases
- ✅ Concurrent mints
- ✅ Transaction rollbacks
- ✅ All 5 tiers

---

## 🎯 Что Дальше?

После успешного тестирования:

```
1. ✅ Fix any bugs found
2. 🎨 Generate 5,000 NFT images (AI)
3. 📦 Upload to Arweave
4. ⛓️ Mint real on-chain NFTs
5. 💎 List on Magic Eden
6. 🚀 LAUNCH!
```

---

**Готово к тестированию! 30 секунд чтобы проверить всё работает! ⚡**

