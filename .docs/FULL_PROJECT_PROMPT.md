# 🎮 SOLANA TAMAGOTCHI - ПОЛНЫЙ ПРОМПТ ПРОЕКТА

> **Для AI-ассистентов и новых разработчиков:** Полное описание проекта, архитектуры, текущего состояния и задач

---

## 📋 ЧТО ЭТО ЗА ПРОЕКТ?

**Solana Tamagotchi** — это Play-to-Earn игра в Telegram с интеграцией блокчейна Solana. Игроки ухаживают за виртуальными питомцами (Gotchi), зарабатывают токены TAMA и могут выводить их в реальные кошельки Solana.

### Ключевые особенности:
- 🎮 **Игра в Telegram** — через бота `@GotchiGameBot` или веб-интерфейс
- 💰 **TAMA Token** — SPL токен на Solana Devnet (1 миллиард токенов)
- 🖼️ **NFT система** — 5-тирная система (Bronze → Diamond) с bonding curve
- 🎯 **Play-to-Earn** — клики, квесты, рефералы, достижения
- 🔥 **On-Chain** — реальные транзакции Solana для вывода и NFT минта
- ⚙️ **Economy Admin** — централизованное управление экономикой игры

---

## 🏗️ АРХИТЕКТУРА ПРОЕКТА

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (GitHub Pages)                   │
│  https://tr1h.github.io/huma-chain-xyz/                      │
│                                                              │
│  • tamagotchi-game.html    - Основная игра                  │
│  • nft-mint-5tiers.html    - Минт NFT (5 тиров)            │
│  • economy-admin.html      - Панель управления экономикой   │
│  • wallet-admin.html       - Локальная админка кошельков     │
│  • super-admin.html        - Суперадмин панель               │
│  • daily-rewards.html      - Пассивный доход от NFT          │
│  • referral.html           - Реферальная система             │
└────────────────────┬────────────────────────────────────────┘
                      │
                      │ API Calls
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (Render.com)                       │
│  https://huma-chain-xyz.onrender.com/api/tama/              │
│                                                              │
│  • tama_supabase.php       - PHP REST API                   │
│  • mint-nft-bronze.php     - Минт Bronze NFT (TAMA)        │
│  • mint-nft-bronze-sol.php - Минт Bronze NFT (SOL)         │
│  • mint-nft-sol.php         - Минт Silver-Diamond (SOL)    │
│  • get-nft-prices.php       - Цены bonding curve           │
│  • distribute-sol-payment.php - Распределение SOL          │
│  • claim-daily-rewards.php  - Пассивный доход               │
└────────────────────┬────────────────────────────────────────┘
                      │
                      │ Database Queries
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (Supabase PostgreSQL)                 │
│                                                              │
│  • leaderboard      - Игроки, балансы, уровни              │
│  • user_nfts        - NFT игроков                          │
│  • nft_designs      - Библиотека 5,000 NFT дизайнов        │
│  • nft_bonding_state - Текущие цены bonding curve          │
│  • economy_config   - Настройки экономики игры             │
│  • transactions     - История транзакций                    │
│  • sol_distributions - Логирование распределения SOL       │
└────────────────────┬────────────────────────────────────────┘
                      │
                      │ Blockchain Calls
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              BLOCKCHAIN (Solana Devnet)                     │
│                                                              │
│  • TAMA Token (SPL)                                        │
│    Mint: Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY      │
│  • SPL Token Transfers                                     │
│  • NFT Minting (Metaplex)                                  │
│  • Real Wallet Integration (Phantom)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              TELEGRAM BOT (Render.com Web Service)         │
│  https://huma-chain-xyz-bot.onrender.com                    │
│                                                              │
│  • bot/bot.py              - Python Telegram Bot           │
│  • Webhook Mode            - Мгновенные ответы             │
│  • Keep-Alive              - Пинг каждые 5 минут            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🪙 TAMA TOKEN - ОСНОВНАЯ ИНФОРМАЦИЯ

### Токен:
```json
{
  "name": "Solana Tamagotchi",
  "symbol": "TAMA",
  "mint": "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY",
  "decimals": 9,
  "total_supply": "1,000,000,000 TAMA",
  "network": "devnet"
}
```

### Распределение токенов:
- **40% (400M)** — P2E Pool (награды игрокам, 5.5 лет распределения)
- **20% (200M)** — Team (vesting 4 года, 6-месячный cliff)
- **15% (150M)** — Marketing (маркетинг и партнерства)
- **10% (100M)** — Liquidity (DEX ликвидность, заблокировано)
- **10% (100M)** — Community (награды и аирдропы)
- **5% (50M)** — Reserve (резервный фонд, заблокировано)

### Кошельки проекта:
- **P2E Pool:** `HPQf1MG8...` (400M TAMA)
- **Team:** `AQr5BM4F...` (200M TAMA, vesting)
- **Marketing:** `...` (150M TAMA)
- **Liquidity:** `...` (100M TAMA, locked)
- **Community:** `...` (100M TAMA)
- **Reserve:** `...` (50M TAMA, locked)
- **Payer:** `...` (для комиссий транзакций)

**⚠️ ВАЖНО:** Все keypair файлы (`*-keypair.json`) находятся в `.gitignore` и НЕ должны коммититься в репозиторий!

---

## 🖼️ NFT СИСТЕМА - 5 ТИРОВ

### Структура:
1. **Bronze** (4,500 NFT)
   - Цена: **5,000 TAMA** (фиксированная) или **0.15 SOL** (фиксированная)
   - Множитель: 2.0x - 3.0x
   - Редкость: Common → Legendary (случайная)

2. **Silver** (350 NFT)
   - Цена: **1.0 → 3.0 SOL** (bonding curve)
   - Множитель: 2.5x - 3.5x
   - Редкость: Common → Legendary (случайная)

3. **Gold** (130 NFT)
   - Цена: **3.0 → 10.0 SOL** (bonding curve)
   - Множитель: 3.0x - 4.0x
   - Редкость: Common → Legendary (случайная)

4. **Platinum** (18 NFT)
   - Цена: **10.0 → 30.0 SOL** (bonding curve)
   - Множитель: 4.0x - 5.0x
   - Редкость: Common → Legendary (случайная)

5. **Diamond** (2 NFT)
   - Цена: **50.0 → 100.0 SOL** (bonding curve)
   - Множитель: 5.0x - 6.0x
   - Редкость: Epic → Legendary (только высокая)

### Bonding Curve:
- Цена растет с каждым минтом
- Формула: `current_price = start_price + (minted_count * increment_per_mint)`
- Максимальная цена ограничена `end_price`
- Все цены хранятся в таблице `nft_bonding_state`

### Пассивный доход:
- Все NFT держатели получают **ежедневный пассивный доход** в TAMA
- Доход зависит от тира NFT
- Можно забрать на странице `daily-rewards.html`

---

## ⚙️ ECONOMY ADMIN PANEL

### Что это?
Централизованная панель управления экономикой игры. **ВСЕ настройки экономики** (награды за клики, комбо, спам-штрафы) настраиваются ТОЛЬКО через эту панель, а не хардкодятся в коде.

### URL:
`https://tr1h.github.io/huma-chain-xyz/economy-admin.html`

### Настройки:
- `BASE_CLICK_REWARD` — базовая награда за клик (по умолчанию 1.0 TAMA)
- `MIN_REWARD` — минимальная награда (штраф за спам)
- `MAX_COMBO_BONUS` — максимальный бонус комбо
- `COMBO_WINDOW` — окно времени для комбо (мс)
- `COMBO_COOLDOWN` — минимальное время между кликами (мс)
- `SPAM_PENALTY` — множитель награды при спаме
- `HP_PER_CLICK`, `FOOD_PER_CLICK`, `HAPPY_PER_CLICK` — расход ресурсов

### Как работает:
1. Админ меняет настройки в панели
2. Настройки сохраняются в таблицу `economy_config` в Supabase
3. Игра загружает активную конфигурацию при старте
4. Изменения применяются ко всем игрокам в реальном времени

**⚠️ КРИТИЧНО:** НЕ менять настройки экономики напрямую в коде игры! Только через Economy Admin Panel!

---

## 📁 СТРУКТУРА ПРОЕКТА

```
huma-chain-xyz/
│
├── 🌐 FRONTEND (GitHub Pages - все в корне!)
│   ├── tamagotchi-game.html      # ⭐ Основная игра
│   ├── nft-mint-5tiers.html      # Минт NFT (5 тиров)
│   ├── economy-admin.html        # Панель управления экономикой
│   ├── wallet-admin.html         # Локальная админка (НЕ в Git!)
│   ├── super-admin.html          # Суперадмин панель
│   ├── daily-rewards.html        # Пассивный доход от NFT
│   ├── referral.html             # Реферальная система
│   ├── index.html                # Лендинг
│   └── css/, js/, assets/        # Стили и скрипты
│
├── 🛠️ BACKEND API
│   ├── api/
│   │   ├── tama_supabase.php           # Основной PHP API
│   │   ├── mint-nft-bronze.php         # Минт Bronze (TAMA)
│   │   ├── mint-nft-bronze-sol.php     # Минт Bronze (SOL)
│   │   ├── mint-nft-sol.php            # Минт Silver-Diamond (SOL)
│   │   ├── get-nft-prices.php          # Цены bonding curve
│   │   ├── distribute-sol-payment.php  # Распределение SOL
│   │   ├── claim-daily-rewards.php     # Пассивный доход
│   │   └── router.php                  # Роутер API
│   │
│   └── bot/
│       ├── bot.py                      # Telegram Bot
│       ├── gamification.py             # Игровая логика
│       ├── nft_system.py               # NFT система
│       └── requirements.txt            # Python зависимости
│
├── 🗄️ DATABASE
│   └── sql/
│       ├── create_nft_5tier_system.sql      # NFT 5-тирная система
│       ├── create_sol_distributions_table.sql # Логирование SOL
│       ├── add_bronze_sol_and_passive_income.sql # Bronze SOL + доход
│       └── update_burn_stats_function.sql   # Статистика сжигания
│
├── 🔧 CONFIG
│   ├── package.json              # Node.js зависимости
│   ├── render.yaml               # Конфигурация Render.com
│   ├── tama-token-info.json      # Информация о токене
│   └── *.json                    # Keypairs (в .gitignore!)
│
└── 📚 DOCUMENTATION (.docs/)
    ├── FULL_PROJECT_PROMPT.md    # Этот файл
    ├── TOKENOMICS_FINAL.md       # Токеномика
    ├── NFT_SYSTEM_IMPLEMENTATION.md # NFT система
    ├── ECONOMY_CONFIG_SETUP.md   # Economy Admin
    └── [20+ других документов]
```

---

## 🔑 КЛЮЧЕВЫЕ ФАЙЛЫ И ИХ НАЗНАЧЕНИЕ

### Frontend:
- **`tamagotchi-game.html`** — основная игра, логика кликов, комбо, награды
- **`nft-mint-5tiers.html`** — страница минта NFT, интеграция с Phantom Wallet
- **`economy-admin.html`** — панель управления экономикой (КРИТИЧНО!)
- **`wallet-admin.html`** — локальная админка для управления кошельками (только локально, НЕ в Git!)

### Backend:
- **`api/tama_supabase.php`** — основной PHP API, все REST endpoints
- **`api/mint-nft-*.php`** — эндпоинты для минта NFT разных тиров
- **`api/distribute-sol-payment.php`** — распределение SOL по Treasury кошелькам
- **`bot/bot.py`** — Telegram бот, обработка команд, интеграция с игрой

### Database:
- **`sql/create_nft_5tier_system.sql`** — схема NFT системы (5 тиров, bonding curve)
- **`sql/create_sol_distributions_table.sql`** — логирование распределения SOL

---

## 🚀 ТЕКУЩЕЕ СОСТОЯНИЕ ПРОЕКТА

### ✅ Реализовано:
1. **Игровая механика:**
   - Клики, комбо, спам-штрафы
   - Система уровней и XP
   - Статистика питомца (HP, Food, Happy, Age)
   - 10 типов питомцев

2. **TAMA Token:**
   - SPL токен на Solana Devnet
   - Вывод в реальные кошельки
   - Распределение по пулам (P2E, Team, Marketing, etc.)

3. **NFT система:**
   - 5-тирная система (Bronze → Diamond)
   - Bonding curve для Silver-Diamond
   - Фиксированные цены для Bronze
   - Пассивный доход для держателей NFT
   - Случайная редкость внутри каждого тира

4. **Economy Admin:**
   - Централизованное управление экономикой
   - Реальное время обновления настроек
   - Пресеты (Balanced, Generous, Strict)

5. **Инфраструктура:**
   - Frontend на GitHub Pages
   - Backend API на Render.com
   - Telegram Bot на Render.com (Webhook mode)
   - Database на Supabase
   - Keep-Alive система (предотвращает "засыпание" на Render Free tier)

### 🚧 В разработке / Требует внимания:
1. **Character Encoding:**
   - Исправлены крякозябры в `wallet-admin.html`
   - Нужно проверить другие файлы на кодировку UTF-8

2. **API Endpoints:**
   - Проверка корректности путей API (localhost vs Render.com)
   - Обработка ошибок в `nft-mint-5tiers.html`

3. **Database:**
   - Миграция на 5-тирную NFT систему
   - Проверка корректности bonding curve цен

4. **Testing:**
   - Тестирование минта NFT всех тиров
   - Тестирование пассивного дохода
   - Тестирование Economy Admin изменений

---

## 🔧 ТЕХНОЛОГИИ

### Frontend:
- **HTML5, CSS3, JavaScript (Vanilla)**
- **Supabase JS Client** — для работы с базой данных
- **Solana Web3.js** — для работы с блокчейном
- **Phantom Wallet** — для подключения кошельков

### Backend:
- **PHP 8.2** — основной API
- **Python 3.10+** — Telegram Bot
- **Apache** — веб-сервер (Render.com)

### Database:
- **PostgreSQL (Supabase)** — основная база данных
- **Row Level Security (RLS)** — безопасность данных

### Blockchain:
- **Solana Devnet** — тестовая сеть
- **SPL Token** — стандарт токенов
- **Metaplex** — стандарт NFT

### Hosting:
- **GitHub Pages** — фронтенд
- **Render.com** — бэкенд API и бот
- **Supabase** — база данных

---

## 🎯 ЧТО ДЕЛАЕМ / ИСПРАВЛЯЕМ

### Последние исправления:
1. ✅ **Крякозябры в `wallet-admin.html`** — исправлена кодировка UTF-8
2. ✅ **API пути в `nft-mint-5tiers.html`** — добавлена поддержка localhost и Render.com
3. ✅ **TAMA баланс загрузка** — исправлена обработка отсутствующих записей в БД
4. ✅ **SQL синтаксис** — исправлена ошибка в `create_sol_distributions_table.sql`

### Текущие задачи:
1. **Проверка работы NFT минта:**
   - Bronze (TAMA и SOL)
   - Silver-Diamond (SOL, bonding curve)
   - Проверка распределения SOL по Treasury кошелькам

2. **Проверка Economy Admin:**
   - Применение настроек в реальном времени
   - Синхронизация между панелью и игрой

3. **Тестирование пассивного дохода:**
   - Расчет дохода для разных тиров NFT
   - Claim механизм

4. **Оптимизация:**
   - Улучшение обработки ошибок
   - Логирование для отладки
   - Производительность API

---

## ⚠️ ВАЖНЫЕ МОМЕНТЫ

### Безопасность:
1. **Keypair файлы** — НИКОГДА не коммитить в Git! Все в `.gitignore`
2. **`wallet-admin.html`** — локальный файл, НЕ должен быть в публичном репозитории
3. **Supabase Service Key** — использовать только на сервере, не в клиентском коде
4. **RLS Policies** — настроены для безопасности данных

### Экономика:
1. **Economy Admin** — ЕДИНСТВЕННЫЙ способ изменения экономики игры
2. **Bonding Curve** — цены растут автоматически с каждым минтом
3. **Treasury Distribution** — SOL распределяется автоматически при минте NFT

### Развертывание:
1. **GitHub Pages** — автоматический деплой при push в `main`
2. **Render.com** — автоматический деплой при push в `main`
3. **Keep-Alive** — бот пингует себя каждые 5 минут (предотвращает "засыпание")

### База данных:
1. **Миграции** — запускать SQL скрипты вручную в Supabase SQL Editor
2. **Backup** — делать бэкапы перед миграциями
3. **RLS** — проверять политики безопасности после изменений схемы

---

## 📞 КОНТАКТЫ И РЕСУРСЫ

### URLs:
- **Игра:** https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html
- **NFT Минт:** https://tr1h.github.io/huma-chain-xyz/nft-mint-5tiers.html
- **Economy Admin:** https://tr1h.github.io/huma-chain-xyz/economy-admin.html
- **API:** https://huma-chain-xyz.onrender.com/api/tama
- **Bot:** https://t.me/GotchiGameBot

### Репозиторий:
- **GitHub:** https://github.com/tr1h/huma-chain-xyz

### Документация:
- Все документы в папке `.docs/`
- README.md в корне проекта

---

## 🎓 ДЛЯ НОВЫХ РАЗРАБОТЧИКОВ

### С чего начать:
1. Прочитай этот файл полностью
2. Изучи `README.md` в корне проекта
3. Посмотри структуру базы данных в `sql/`
4. Запусти локально:
   - Frontend: просто открой HTML файлы
   - Backend: нужен PHP сервер или Render.com
   - Bot: нужен Python и Telegram Bot Token

### Частые вопросы:
- **Где настройки экономики?** → `economy-admin.html` (НЕ в коде!)
- **Где адреса кошельков?** → `wallet-admin.html` (локально) или `.docs/ADDRESSES_AND_ALLOCATIONS.md`
- **Как изменить цены NFT?** → Через `nft_bonding_state` таблицу или админ панель
- **Как работает bonding curve?** → Цена = `start_price + (minted_count * increment_per_mint)`

---

## 📝 ОБНОВЛЕНИЯ

**Последнее обновление:** 2025-11-10

**Версия:** 2.0 (5-Tier NFT System + Economy Admin)

**Статус:** ✅ Production Ready (Devnet)

---

**Создано для:** AI-ассистентов, новых разработчиков, и для понимания полной картины проекта

**Автор:** Solana Tamagotchi Team

