# 🗄️ Supabase Database Setup

## Как создать таблицу wallet_users

### 1️⃣ Открой Supabase SQL Editor

1. Перейди на https://supabase.com/dashboard/project/zfrazyupameidxpjihrh
2. В левом меню выбери **SQL Editor**
3. Нажми **New Query**

### 2️⃣ Выполни SQL скрипт

Скопируй весь код из файла `sql/create-wallet-users-table.sql` и вставь в редактор.

Нажми **Run** (или Ctrl+Enter).

### 3️⃣ Проверь результат

После выполнения скрипта:

1. Перейди в **Table Editor**
2. Найди таблицу `wallet_users`
3. Должны быть видны все колонки

---

## 📊 Структура таблицы wallet_users

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | BIGSERIAL | Первичный ключ |
| `wallet_address` | TEXT | Адрес Solana кошелька (уникальный) |
| `user_id` | TEXT | ID пользователя (wallet_XXX) |
| `username` | TEXT | Имя игрока |
| `tama_balance` | NUMERIC | Баланс TAMA токенов |
| `level` | INTEGER | Уровень игрока |
| `experience` | INTEGER | Опыт |
| `clicks` | INTEGER | Количество кликов |
| `health` | INTEGER | Здоровье питомца (0-100) |
| `food` | INTEGER | Еда (0-100) |
| `happiness` | INTEGER | Счастье (0-100) |
| `game_state` | JSONB | Полное состояние игры |
| `quests_completed` | JSONB | Завершённые квесты |
| `achievements` | JSONB | Достижения |
| `items_owned` | JSONB | Предметы |
| `referrer_wallet` | TEXT | Адрес реферера |
| `referral_count` | INTEGER | Количество приглашённых |
| `referral_earnings` | NUMERIC | Заработано с рефералов |
| `created_at` | TIMESTAMP | Дата создания |
| `updated_at` | TIMESTAMP | Дата обновления |
| `last_login` | TIMESTAMP | Последний вход |

---

## 🔒 Row Level Security (RLS)

**RLS включён!** Настроены политики:

### ✅ Для backend (service_role):
- **Полный доступ** - может создавать, читать, обновлять, удалять

### ✅ Для frontend (anon):
- **Только чтение** - может читать все записи (для лидерборда)

---

## 🎁 Реферальная система

### Функция `process_referral_bonus()`

Автоматически начисляет бонусы:

```sql
SELECT process_referral_bonus(
    'Eb4dBmBYR52MiJqKsQ2ayML2R4y23pUfRyxabtR2fdap', -- referrer
    '5pWae6RK6w8WLvP9V9NWfFmZRH8dYzKpNvM2vZJh9n7o', -- new_user
    1000 -- bonus amount
);
```

**Что делает:**
1. ✅ Проверяет, что оба пользователя существуют
2. ✅ Проверяет, что бонус не был начислен ранее
3. ✅ Добавляет +1,000 TAMA рефереру
4. ✅ Добавляет +1,000 TAMA новому пользователю
5. ✅ Увеличивает `referral_count` у реферера
6. ✅ Сохраняет `referrer_wallet` у нового пользователя

---

## 📈 Views (представления)

### `wallet_users_leaderboard`

Топ-100 игроков по балансу TAMA:

```sql
SELECT * FROM wallet_users_leaderboard;
```

Возвращает:
- `user_id`
- `username`
- `wallet_address`
- `tama_balance`
- `level`
- `clicks`
- `referral_count`
- `rank` (позиция в рейтинге)

---

## 🔧 Триггеры

### `trigger_update_wallet_users_updated_at`

Автоматически обновляет `updated_at` при любом изменении записи.

---

## 🧪 Тестирование

### Создать тестового пользователя:

```sql
INSERT INTO wallet_users (wallet_address, user_id, username, tama_balance, level)
VALUES ('Eb4dBmBYR52MiJqKsQ2ayML2R4y23pUfRyxabtR2fdap', 'wallet_Eb4dBmBYR52M', 'Test Player', 10000, 5);
```

### Проверить реферальную систему:

```sql
-- 1. Создать реферера
INSERT INTO wallet_users (wallet_address, user_id, username)
VALUES ('REFERRER_WALLET_XXX', 'wallet_REFERRER', 'Referrer');

-- 2. Создать нового пользователя
INSERT INTO wallet_users (wallet_address, user_id, username)
VALUES ('NEW_USER_WALLET_YYY', 'wallet_NEW_USER', 'New User');

-- 3. Обработать реферальный бонус
SELECT process_referral_bonus('REFERRER_WALLET_XXX', 'NEW_USER_WALLET_YYY', 1000);

-- 4. Проверить результат
SELECT username, tama_balance, referral_count, referrer_wallet FROM wallet_users;
```

---

## ⚠️ Важные замечания

### 🔐 Безопасность:

1. **Service Role Key** используется только в backend API
2. **Anon Key** используется только для чтения (leaderboard, профили)
3. RLS защищает от прямых изменений через frontend

### 📊 Производительность:

1. Созданы индексы на:
   - `wallet_address` (быстрый поиск по кошельку)
   - `user_id` (быстрый поиск по ID)
   - `tama_balance` (быстрая сортировка для лидерборда)
   - `referrer_wallet` (быстрые реферальные запросы)

2. `game_state` хранится как JSONB (эффективный поиск и индексация)

### 🔄 Миграция данных:

Если есть существующие пользователи в другой таблице (например, `leaderboard`), можно перенести:

```sql
-- Пример миграции из leaderboard
INSERT INTO wallet_users (
    wallet_address,
    user_id,
    username,
    tama_balance,
    level,
    clicks,
    created_at
)
SELECT 
    wallet_address,
    telegram_id, -- или создать новый user_id
    username,
    balance,
    level,
    clicks,
    created_at
FROM leaderboard
WHERE wallet_address IS NOT NULL
ON CONFLICT (wallet_address) DO NOTHING;
```

---

## ✅ Проверка что всё работает

После создания таблицы, проверь через API:

```bash
# Test create account
curl -X POST https://api.solanatamagotchi.com/api/wallet-auth.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "wallet_address": "Eb4dBmBYR52MiJqKsQ2ayML2R4y23pUfRyxabtR2fdap",
    "username": "Test Player"
  }'

# Test get account
curl -X POST https://api.solanatamagotchi.com/api/wallet-auth.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get",
    "wallet_address": "Eb4dBmBYR52MiJqKsQ2ayML2R4y23pUfRyxabtR2fdap"
  }'
```

Должно вернуть:
```json
{
  "success": true,
  "user": {
    "wallet_address": "Eb4dBmBYR52M...",
    "user_id": "wallet_Eb4dBmBYR52M",
    "username": "Test Player",
    "tama_balance": 0,
    "level": 1
  }
}
```

---

## 🎉 Готово!

Теперь система готова для работы с пользователями без Telegram! 🚀

