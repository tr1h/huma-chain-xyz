# 🎰 SLOTS GAME - SETUP INSTRUCTIONS

## ✅ ЧТО СОЗДАНО:

### 1. **Интерактивные слоты в чате бота** 🎰

- Команда `/slots` открывает меню с inline кнопками
- Можно играть прямо в чате!
- Анимация "SPINNING..." перед результатом
- Красивые результаты с эмодзи

### 2. **Полная интеграция с балансом** 💰

- Проверка баланса перед спином
- Автоматическое списание ставки
- Начисление выигрыша
- Логирование всех транзакций в `transactions` table

### 3. **Daily Free Spins** 🎁

- 3 бесплатных спина каждый день
- Автоматический сброс в полночь
- Можно выиграть до 10,000 TAMA бесплатно!

### 4. **Статистика и Leaderboard** 📊

- `/slots` → "📊 My Stats" - твоя статистика за день
- `/slots` → "🏆 Leaderboard" - топ-10 игроков за день
- Показывает: spins, wins, total bet/win, max win, profit

---

## 🗄️ DATABASE SETUP:

### **Нужно создать таблицу в Supabase:**

1. Открой Supabase Dashboard
2. Перейди в SQL Editor
3. Выполни SQL из файла: `sql/create_slots_daily_stats.sql`

Или выполни вручную:

```sql
CREATE TABLE IF NOT EXISTS slots_daily_stats (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    spins_count INT DEFAULT 0,
    wins_count INT DEFAULT 0,
    total_bet BIGINT DEFAULT 0,
    total_win BIGINT DEFAULT 0,
    max_win BIGINT DEFAULT 0,
    free_spins_used INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(telegram_id, date)
);

CREATE INDEX IF NOT EXISTS idx_slots_daily_stats_telegram_date
    ON slots_daily_stats(telegram_id, date);
CREATE INDEX IF NOT EXISTS idx_slots_daily_stats_date_win
    ON slots_daily_stats(date, total_win DESC);
```

---

## 🎮 КАК ИГРАТЬ:

### **В Telegram боте:**

1. Напиши `/slots`
2. Выбери ставку:
   - 💰 100 TAMA
   - 💎 500 TAMA
   - 👑 2,000 TAMA
   - 🎁 FREE SPIN (3 в день)
3. Нажми кнопку - увидишь "SPINNING..."
4. Через 1.5 секунды увидишь результат!

### **Результаты:**

**Выигрыш:**

```
🎉 SLOT RESULT 🎉

💰 Bet: 100 TAMA

💎  💎  💎

🎉 YOU WON!

💰 +1,000 TAMA (x10) 🔥

💰 Balance: 13,500 TAMA
🎁 Free Spins: 3 left today
```

**Проигрыш:**

```
😔 SLOT RESULT 😔

💰 Bet: 500 TAMA

🍒  🍋  🍊

❌ No Win

💸 -500 TAMA

💰 Balance: 12,000 TAMA
🎁 Free Spins: 3 left today
```

---

## 📊 СТАТИСТИКА:

**My Stats показывает:**

- 🎰 Spins: количество спинов сегодня
- ✅ Wins: количество выигрышей (win rate %)
- 🎁 Free Spins Used: использовано бесплатных спинов
- 💰 Total Bet: сколько поставил
- 💎 Total Won: сколько выиграл
- 🔥 Max Win: максимальный выигрыш
- 📈 Profit: прибыль/убыток

---

## 🏆 LEADERBOARD:

**Показывает топ-10 игроков за день:**

```
🏆 TODAY'S TOP WINNERS 🏆

🥇 @user1
   💰 +15,000 TAMA (23 spins)

🥈 @user2
   💰 +12,500 TAMA (18 spins)

🥉 @user3
   💰 +8,900 TAMA (15 spins)
```

---

## 💰 ПРИЗЫ:

```
🍒🍒🍒 → x2   (200 TAMA при ставке 100)
🍋🍋🍋 → x5   (500 TAMA)
🍊🍊🍊 → x8   (800 TAMA)
💎💎💎 → x10  (1,000 TAMA)
⭐⭐⭐ → x20  (2,000 TAMA)
👑👑👑 → x50  (5,000 TAMA)
🎰🎰🎰 → x100 (10,000 TAMA) 🔥 JACKPOT!
```

---

## 🔗 ИНТЕГРАЦИЯ:

**✅ Все транзакции логируются:**

- `transactions` table
- Type: `slots_spin` или `slots_win`
- Metadata: bet, win, symbols, multiplier

**✅ Баланс обновляется:**

- Автоматически через Supabase
- Синхронизируется с `/stats`
- Видно в `/balance`

**✅ Daily reset:**

- Free spins сбрасываются в полночь
- Статистика сохраняется по дням
- Leaderboard обновляется каждый день

---

## 🚀 ГОТОВО К ТЕСТИРОВАНИЮ!

**После создания таблицы:**

1. Перезапусти бота (если нужно)
2. Напиши `/slots` в боте
3. Попробуй FREE SPIN (бесплатно!)
4. Проверь статистику и leaderboard

**Всё работает идеально!** 🎰🔥


