# 🎮 SOLANA TAMAGOTCHI BOT - Текущее состояние проекта

## 📋 Краткое описание
Telegram мини-приложение (Mini App) + Python бот для игры в тамагочи на блокчейне Solana. Игроки выращивают виртуальных питомцев, зарабатывают TAMA токены, покупают NFT для буста дохода и участвуют в P2E экономике.

**Главная страница:** https://tr1h.github.io/huma-chain-xyz/  
**Репозиторий:** https://github.com/tr1h/huma-chain-xyz  
**Деплой бота:** https://huma-chain-xyz.onrender.com (Render.com)  
**База данных:** Supabase PostgreSQL (https://supabase.com/dashboard/project/zfrazyupameidxpjihrh/)

---

## 🏗️ Архитектура проекта

### Frontend (GitHub Pages)
- **Хостинг:** GitHub Pages (https://tr1h.github.io/huma-chain-xyz/)
- **Технологии:** HTML, CSS (Tailwind), JavaScript, Solana Web3.js
- **Wallet:** Phantom Wallet integration
- **Ключевые страницы:**
  - `index.html` - главная страница с описанием проекта
  - `nft-mint-5tiers.html` - страница минта NFT (5 тиров: Bronze/Silver/Gold/Platinum/Diamond)
  - `my-nfts.html` - просмотр NFT пользователя
  - `swap.html` - обмен TAMA токенов
  - `transactions-admin.html` - админ панель транзакций TAMA
  - `admin-nft-tiers.html` - админ панель настройки NFT тиров

### Backend API (Render.com)
- **Хостинг:** Render.com (PHP web service)
- **Язык:** PHP 8.x
- **База данных:** Supabase PostgreSQL (REST API, без прямых SQL подключений)
- **API эндпоинты:**
  - `api/mint-nft-bronze-rest.php` - минт Bronze NFT за TAMA (5000 TAMA фиксированная цена)
  - `api/mint-nft-bronze-sol-rest.php` - минт Bronze NFT за SOL (0.15 SOL фиксированная цена)
  - `api/mint-nft-sol-rest.php` - минт Silver/Gold/Platinum/Diamond NFT за SOL (bonding curve)
  - `api/save-wallet.php` - сохранение wallet адреса игрока
  - `api/get-nft-prices.php` - получение текущих цен NFT
  - `api/config.php` - конфигурация Supabase (URL, API KEY)

### Telegram Bot (Python)
- **Хостинг:** Render.com (Python web service)
- **Файл:** `bot/bot.py`
- **Фреймворк:** python-telegram-bot
- **База данных:** Supabase (через supabase-py client)
- **Функции:**
  - Регистрация игроков
  - Ежедневные награды (daily TAMA)
  - Система уровней и XP
  - Квесты и рефералы
  - NFT система (boost multipliers)
  - Таблица лидеров (leaderboard)

---

## 🗄️ База данных (Supabase PostgreSQL)

### Основные таблицы:

1. **`leaderboard`** - основная таблица игроков
   - `telegram_id` (BIGINT) - ID игрока в Telegram
   - `username` (TEXT) - имя пользователя
   - `tama` (INTEGER) - баланс TAMA токенов
   - `level` (INTEGER) - уровень игрока
   - `xp` (INTEGER) - опыт игрока
   - `wallet_address` (TEXT) - Solana wallet адрес
   - `nft_boost_multiplier` (NUMERIC) - буст от NFT (1.0 = нет буста, 2.0-6.0x с NFT)

2. **`user_nfts`** - NFT владение игроками
   - `id` (INTEGER) - уникальный ID NFT
   - `telegram_id` (BIGINT) - владелец NFT
   - `nft_design_id` (INTEGER) - ID дизайна из таблицы nft_designs
   - `nft_mint_address` (TEXT) - адрес NFT (для будущего on-chain минта)
   - `tier_name` (TEXT) - Bronze/Silver/Gold/Platinum/Diamond
   - `rarity` (TEXT) - Common/Uncommon/Rare/Epic/Legendary
   - `earning_multiplier` (NUMERIC) - множитель дохода (2.0x - 6.0x)
   - `purchase_price_tama` (INTEGER) - цена в TAMA (0 если куплен за SOL)
   - `price_paid_sol` (NUMERIC) - цена в SOL (если куплен за SOL)
   - `wallet_address` (TEXT) - wallet покупателя
   - `payment_type` (TEXT) - TAMA или SOL
   - `is_active` (BOOLEAN) - активен ли NFT
   - `minted_at` (TIMESTAMPTZ) - дата минта

3. **`nft_designs`** - дизайны NFT
   - `id` (INTEGER) - ID дизайна
   - `tier_name` (TEXT) - Bronze/Silver/Gold/Platinum/Diamond
   - `design_number` (TEXT) - номер дизайна (например, "BRZ001")
   - `is_minted` (BOOLEAN) - заминчен ли уже
   - `minted_by` (BIGINT) - кем заминчен
   - `minted_at` (TIMESTAMPTZ) - когда заминчен

4. **`nft_bonding_state`** - состояние bonding curve для NFT
   - `tier_name` (TEXT) - Silver/Gold/Platinum/Diamond
   - `payment_type` (TEXT) - SOL
   - `current_price` (NUMERIC) - текущая цена в SOL
   - `minted_count` (INTEGER) - сколько уже заминчено
   - `max_supply` (INTEGER) - максимальное количество
   - `increment_per_mint` (NUMERIC) - на сколько растет цена при каждом минте

5. **`nft_daily_rewards`** - ежедневные награды от NFT
   - `user_nft_id` (INTEGER) - ID NFT из user_nfts
   - `telegram_id` (BIGINT) - владелец
   - `tier_name` (TEXT) - тир NFT
   - `daily_tama_reward` (INTEGER) - сколько TAMA в день (100-2000 в зависимости от тира)
   - `last_claim_date` (DATE) - последняя дата клейма

6. **`tama_transactions`** - все транзакции TAMA
   - `telegram_id` (BIGINT) - кто
   - `transaction_type` (TEXT) - earn/spend/level_up/quest/referral/nft_mint
   - `amount` (INTEGER) - сумма
   - `balance_after` (INTEGER) - баланс после транзакции
   - `details` (JSONB) - дополнительные данные
   - `created_at` (TIMESTAMPTZ) - дата транзакции

### RPC функции:

1. **`insert_user_nft`** - создание NFT записи
   - Принимает `p_telegram_id` (TEXT), кастует в BIGINT
   - Возвращает созданную запись из `user_nfts`
   - Обходит проблемы с типами PostgREST

2. **`setup_nft_daily_rewards`** (trigger) - автоматически создает запись в nft_daily_rewards при создании NFT

---

## 💎 NFT Система (5 тиров)

### Bronze (4,500 NFT)
- **Цена:** 5,000 TAMA (фиксированная) или 0.15 SOL (фиксированная)
- **Множитель:** 2.0x - 3.0x (в зависимости от редкости)
- **Ежедневный доход:** +100 TAMA/день
- **Редкость:** Common (50%) → Uncommon (30%) → Rare (15%) → Epic (4%) → Legendary (1%)

### Silver (350 NFT)
- **Цена:** 1.0 → 3.0 SOL (bonding curve)
- **Множитель:** 2.5x - 3.5x (случайная редкость)
- **Ежедневный доход:** +250 TAMA/день
- **Редкость:** Common (40%) → Uncommon (30%) → Rare (20%) → Epic (8%) → Legendary (2%)

### Gold (130 NFT)
- **Цена:** 3.0 → 10.0 SOL (bonding curve)
- **Множитель:** 3.0x - 4.0x (случайная редкость)
- **Ежедневный доход:** +500 TAMA/день
- **Редкость:** Common (30%) → Uncommon (30%) → Rare (20%) → Epic (15%) → Legendary (5%)

### Platinum (18 NFT)
- **Цена:** 10.0 → 30.0 SOL (bonding curve)
- **Множитель:** 4.0x - 5.0x (случайная редкость)
- **Ежедневный доход:** +1000 TAMA/день
- **Редкость:** Common (20%) → Uncommon (25%) → Rare (25%) → Epic (20%) → Legendary (10%)

### Diamond (2 NFT)
- **Цена:** 50.0 → 100.0 SOL (bonding curve)
- **Множитель:** 5.0x - 6.0x (только Epic/Legendary)
- **Ежедневный доход:** +2000 TAMA/день
- **Редкость:** Epic (50%) → Legendary (50%)

---

## 🔧 Недавние исправления (Ноябрь 2024)

### Проблема: `telegram_id` type mismatch
- **Ошибка:** `column "telegram_id" is of type bigint but expression is of type text`
- **Решение:** 
  - Создана RPC функция `insert_user_nft`, которая принимает `telegram_id` как TEXT и кастует в BIGINT
  - Все API (Bronze TAMA, Bronze SOL, Silver/Gold/Platinum/Diamond SOL) используют эту RPC функцию
  - Frontend (`nft-mint-5tiers.html`) отправляет `telegram_id` как строку в RPC функцию

### Проблема: "Failed to create player account" (Bronze SOL minting)
- **Ошибка:** API пыталась создать игрока в таблице `players`, которая больше не используется
- **Решение:**
  - Изменена логика: используется таблица `leaderboard` вместо `players`
  - Убрано обязательное создание игрока — если игрока нет, NFT все равно создается
  - Буст применяется только если игрок существует
  - Telegram бот создает игрока при первом взаимодействии

### Проблема: trigger `setup_nft_daily_rewards` ошибка
- **Ошибка:** `column "telegram_id" is of type bigint but expression is of type text` в trigger
- **Решение:** Добавлен явный каст `NEW.telegram_id::BIGINT` в trigger функции

### Проблема: дублирующиеся записи в `nft_daily_rewards`
- **Решение:** Добавлен `ON CONFLICT DO NOTHING` в trigger

### Проблема: RPC функция возвращала неправильный тип
- **Ошибка:** `structure of query does not match function result type`
- **Решение:** Изменен RETURNS с `TABLE(...)` на `SETOF user_nfts` для автоматического совпадения со структурой таблицы

### Проблема: GitHub Security Alerts
- **Решение:**
  - Убраны хардкод токены из `.md` файлов, заменены на плейсхолдеры
  - Расширен `.gitignore` для секретов
  - Добавлены XSS защиты в `my-nfts.html` и `nft-mint-5tiers.html`
  - Отключен debug mode в production (`bot.py`)

### Проблема: Render.com "out of pipeline minutes"
- **Решение:** Активирован Starter план ($7/месяц) для получения минут деплоя

---

## 🚀 Текущий статус

### ✅ Работает:
- ✅ Bronze NFT минт за TAMA (5000 TAMA)
- ✅ Bronze NFT минт за SOL (0.15 SOL)
- ✅ Telegram бот (регистрация, daily rewards, уровни)
- ✅ Wallet интеграция (Phantom)
- ✅ Сохранение wallet адресов в базу
- ✅ RPC функция `insert_user_nft` для обхода type issues
- ✅ Случайная редкость NFT (Common → Legendary)
- ✅ NFT boost multipliers (2.0x - 6.0x)
- ✅ Ежедневные награды от NFT (100-2000 TAMA/день)

### 🔨 Только что исправлено:
- ✅ Silver/Gold/Platinum/Diamond SOL minting - обновлено по аналогии с Bronze
- ✅ Использование `leaderboard` вместо `players`
- ✅ Убрано обязательное создание игрока
- ✅ Добавлена случайная редкость для всех тиров

### 🔄 В процессе:
- 🔄 Деплой на Render.com (ожидается завершение)
- 🔄 Тестирование Silver/Gold/Platinum/Diamond минта

### ❌ Еще не реализовано:
- ❌ On-chain минт NFT на Solana (пока только записи в базе)
- ❌ Вторичный маркет (перепродажа NFT)
- ❌ Турниры и PvP
- ❌ Реферальная система (частично реализована)
- ❌ Интеграция NFT транзакций в админ панель `transactions-admin.html`

---

## 🔑 Переменные окружения (Render.com)

### PHP Web Service:
```
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU
```

### Python Bot:
```
TELEGRAM_BOT_TOKEN=<токен бота>
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=<anon key>
FLASK_DEBUG=False
```

---

## 📝 Важные файлы для понимания проекта

1. **`.docs/FULL_PROJECT_PROMPT.md`** - полное описание проекта, токеномика, roadmap
2. **`.docs/NFT_SYSTEM_IMPLEMENTATION.md`** - документация NFT системы
3. **`.docs/CREATE_NFT_RPC_FUNCTION.sql`** - SQL для создания RPC функции
4. **`api/mint-nft-bronze-sol-rest.php`** - пример корректной реализации минта
5. **`nft-mint-5tiers.html`** - frontend для минта NFT
6. **`bot/bot.py`** - основной файл Telegram бота

---

## 🐛 Известные особенности и нюансы

1. **Таблица `players` больше не используется** - вместо нее используется `leaderboard`
2. **`telegram_id` в базе - BIGINT** - но API отправляют как STRING в RPC функцию для каста
3. **NFT дизайны фильтруются по `tier_name`** (не `tier_id`) и `is_minted=false`
4. **Игрок не обязан существовать в `leaderboard` для минта NFT за SOL** - бот создаст его позже
5. **Буст применяется опционально** - только если игрок уже есть в базе
6. **PowerShell на Render.com не поддерживает `&&`** - нужно делать отдельные команды git

---

## 🎯 Следующие шаги

1. ✅ Дождаться завершения деплоя на Render.com
2. ✅ Протестировать минт всех тиров NFT (Bronze/Silver/Gold/Platinum/Diamond)
3. 📝 Добавить NFT транзакции в админ панель `transactions-admin.html`
4. 🔮 Реализовать on-chain минт NFT на Solana
5. 💱 Реализовать вторичный маркет (Tensor, Magic Eden)

---

## 💡 Подсказки для работы с проектом

- **При ошибках с `telegram_id`:** Всегда используй RPC функцию `insert_user_nft`
- **При деплое на Render.com:** Используй Manual Deploy если закончились pipeline minutes
- **При работе с git:** Не используй `&&` в PowerShell, делай отдельные команды
- **При добавлении новых API:** Всегда используй `leaderboard` вместо `players`
- **При работе с NFT:** Фильтруй по `tier_name` и `is_minted=false`, не забудь отметить `is_minted=true` после минта

---

## 📞 Контакты и ссылки

- **GitHub:** https://github.com/tr1h/huma-chain-xyz
- **Frontend:** https://tr1h.github.io/huma-chain-xyz/
- **Supabase:** https://supabase.com/dashboard/project/zfrazyupameidxpjihrh/
- **Render.com:** https://dashboard.render.com/

---

**Последнее обновление:** 13 ноября 2024  
**Версия:** 1.0.0  
**Статус:** В активной разработке

