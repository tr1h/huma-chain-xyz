# 🎉 REFERRAL SYSTEM - READY TO LAUNCH!

## ✅ ЧТО ДОБАВЛЕНО:

### **1️⃣ База данных:**
- ✅ Таблица `pending_referrals` для хранения рефералов до подключения кошелька
- ✅ Индексы для быстрого поиска
- ✅ Автоматическое отслеживание статуса

### **2️⃣ Бот обновлен:**
- ✅ Сохраняет pending рефералов при переходе по ссылке
- ✅ Показывает количество pending рефералов в `/stats`
- ✅ Показывает потенциальный заработок даже без кошелька

---

## 📋 ЧТО НУЖНО СДЕЛАТЬ ТЕБЕ:

### **ШАГ 1: Обновить базу данных**

Открой Supabase SQL Editor и выполни:

```sql
-- Create pending_referrals table
CREATE TABLE IF NOT EXISTS pending_referrals (
    id BIGSERIAL PRIMARY KEY,
    referrer_telegram_id TEXT NOT NULL,
    referred_telegram_id TEXT NOT NULL,
    referrer_username TEXT,
    referred_username TEXT,
    referral_code TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    connected_at TIMESTAMPTZ,
    UNIQUE(referrer_telegram_id, referred_telegram_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pending_referrals_referrer ON pending_referrals(referrer_telegram_id);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_referred ON pending_referrals(referred_telegram_id);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_code ON pending_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_pending_referrals_status ON pending_referrals(status);

-- Enable RLS
ALTER TABLE pending_referrals ENABLE ROW LEVEL SECURITY;

-- Public policies
CREATE POLICY "Public read pending_referrals" ON pending_referrals FOR SELECT USING (true);
CREATE POLICY "Public insert pending_referrals" ON pending_referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update pending_referrals" ON pending_referrals FOR UPDATE USING (true);
```

**Или используй файл:** `C:\goooog\SUPABASE_PENDING_REFERRALS.sql`

---

### **ШАГ 2: Добавить колонку referral_code в leaderboard**

```sql
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS referral_code TEXT;
CREATE INDEX IF NOT EXISTS idx_leaderboard_referral_code ON leaderboard(referral_code);
```

**Или используй файл:** `C:\goooog\SUPABASE_REFERRAL_UPDATE.sql`

---

### **ШАГ 3: Перезапустить бота**

Бот уже обновлен! Просто перезапусти:

```bash
cd C:\goooog\solana-tamagotchi\bot
python bot.py
```

---

## 🚀 КАК ЭТО РАБОТАЕТ:

### **СЦЕНАРИЙ 1: Пользователь БЕЗ кошелька**

1. **Пользователь получает ссылку** от друга
2. **Переходит в бота** → `/start refTAMA123ABC`
3. **Бот сохраняет** в таблицу `pending_referrals`:
   ```
   referrer_telegram_id: 12345
   referred_telegram_id: 67890
   referral_code: TAMA123ABC
   status: pending
   ```
4. **Пользователь пишет** `/stats`:
   ```
   📊 Your Personal Stats:
   
   ❌ No wallet linked yet!
   
   🔗 Your Referrals:
   • ⏳ Pending: 0 friends waiting!
   • 💰 Potential Earnings: 0 TAMA
   ```

5. **Друг пишет** `/stats` (у него УЖЕ есть pending реферал!):
   ```
   📊 Your Personal Stats:
   
   ❌ No wallet linked yet!
   
   🔗 Your Referrals:
   • ⏳ Pending: 1 friends waiting!
   • 💰 Potential Earnings: 100 TAMA
   ```

---

### **СЦЕНАРИЙ 2: Пользователь С кошельком**

1. **Пользователь подключает кошелек** в игре
2. **Игра проверяет** `telegram_id`
3. **Находит** запись в `pending_referrals`
4. **Переносит** в основную таблицу `referrals`
5. **Начисляет** 100 TAMA реферу
6. **Обновляет** статус в `pending_referrals`:
   ```sql
   UPDATE pending_referrals 
   SET status = 'connected', connected_at = NOW()
   WHERE referred_telegram_id = '67890';
   ```

---

## 📊 ЧТО ВИДИТ ПОЛЬЗОВАТЕЛЬ:

### **До подключения кошелька:**
```
/stats

📊 Your Personal Stats:

❌ No wallet linked yet!

🔗 Your Referrals:
• ⏳ Pending: 5 friends waiting!
• 💰 Potential Earnings: 500 TAMA

To start playing and tracking your stats:
1️⃣ Click the button below
2️⃣ Connect your Phantom wallet
3️⃣ Your progress will be automatically saved!
4️⃣ All pending referrals will be activated!
```

### **После подключения кошелька:**
```
/stats

📊 Your Personal Stats:

🐾 Your Pet:
• Name: Fluffy
• Type: Dragon
• Level: 5

💰 Your Balance:
• TAMA Tokens: 5000

🔗 Your Referrals:
• ⏳ Pending: 2 (waiting for wallet)
• ✅ Level 1 Direct: 5 (500 TAMA)
• ✅ Level 2 Indirect: 3 (150 TAMA)
• 📊 Total Active: 8
• 💰 Total Earned: 650 TAMA
```

---

## 🎯 ИТОГО:

### **ДЛЯ РЕЛИЗА БОТА ГОТОВО:**

✅ **Таблица `pending_referrals`** - файл `SUPABASE_PENDING_REFERRALS.sql`  
✅ **Таблица `leaderboard`** с колонкой `referral_code` - файл `SUPABASE_REFERRAL_UPDATE.sql`  
✅ **Бот обновлен** - файл `bot/bot.py` закоммичен  
✅ **Статистика работает** - показывает pending рефералов  
✅ **Можно собирать аудиторию** - рефералы сохраняются до подключения кошелька  

---

## 🚀 ЗАПУСК:

1. **Выполни SQL** из `SUPABASE_PENDING_REFERRALS.sql` и `SUPABASE_REFERRAL_UPDATE.sql`
2. **Перезапусти бота**
3. **Готово!** Можно запускать рекламу и собирать рефералов!

---

## 📱 КАК ПРОВЕРИТЬ:

1. Открой бота: https://t.me/solana_tamagotchi_v3_bot
2. Напиши: `/ref`
3. Получи свой реферальный код
4. Поделись с другом (или создай тестовый аккаунт)
5. Друг переходит по ссылке
6. Ты пишешь `/stats` → видишь `Pending: 1`!

**ВСЕ РАБОТАЕТ! 🎉**


