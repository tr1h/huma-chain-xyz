# ⚡ Quick Setup: Unified Leaderboard

## Что это?

Единый рейтинг для **всех** игроков (Telegram + Сайт) в одном списке.

---

## Шаги установки

### 1️⃣ Выполни SQL в Supabase

1. Открой [Supabase Dashboard](https://app.supabase.com)
2. Выбери проект: `zfrazyupameidxpjihrh`
3. Перейди в **SQL Editor**
4. Скопируй содержимое файла: `sql/create-unified-leaderboard.sql`
5. Вставь в SQL Editor
6. Нажми **Run**

**Результат:**
```
✅ Function get_unified_leaderboard created
✅ Function get_user_rank_unified created
✅ Function get_total_players_unified created
```

---

### 2️⃣ Проверь API

Через 2-3 минуты (после деплоя на Render.com):

```bash
# Проверь топ-10
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=leaderboard&limit=10"

# Проверь свой ранг (замени на свой wallet)
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=rank&wallet_address=D8iLr9CS..."

# Проверь количество игроков
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=total"
```

---

### 3️⃣ Проверь игру

1. Открой https://solanatamagotchi.com/tamagotchi-game.html
2. Подключи кошелек
3. Открой **Leaderboard** (кнопка 🏆)
4. Должны показаться **все** игроки (Telegram + Wallet)
5. Рядом с именем будут badges:
   - 📱 = Telegram
   - 💻 = Wallet
   - 🔗 = Linked

---

## Что изменилось?

### До:
```
Telegram игроки: leaderboard (только Telegram)
Wallet игроки:   wallet_users (не видны в рейтинге)
```

### После:
```
ВСЕ игроки: unified leaderboard (Telegram + Wallet)
```

---

## Если что-то не работает

### SQL ошибка "function already exists"
```sql
-- Сначала удали старые функции
DROP FUNCTION IF EXISTS get_unified_leaderboard;
DROP FUNCTION IF EXISTS get_user_rank_unified;
DROP FUNCTION IF EXISTS get_total_players_unified;

-- Потом запусти скрипт заново
```

### API возвращает 500
- Подожди 2-3 минуты (деплой на Render.com)
- Проверь логи: https://dashboard.render.com/web/srv-d47jen24d50c7387ijog/logs

### Рейтинг пустой
- Проверь, что SQL выполнился успешно
- Проверь консоль браузера (F12 → Console)
- Должно быть: `📊 Loading UNIFIED leaderboard`

---

## Документация

Полная документация: `.docs/UNIFIED_LEADERBOARD.md`

---

**Статус:** ✅ Готово к использованию!

