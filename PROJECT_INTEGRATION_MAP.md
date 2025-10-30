# 🗺️ Карта интеграции проекта Solana Tamagotchi

## 📊 **Общая архитектура:**

```
┌──────────────────────────────────────────────────────────────┐
│                    TELEGRAM BOT                               │
│              @GotchiGameBot                                   │
│         (bot/bot.py - Python)                                 │
└────────────┬─────────────────────────────────────────────────┘
             │ Opens WebApp
             ▼
┌──────────────────────────────────────────────────────────────┐
│           MAIN GAME (Telegram Mini App)                       │
│     docs/tamagotchi-game.html                                 │
│     - Play, earn TAMA, level up                               │
│     - Button "🖼️ NFT" → Opens NFT Mint page                  │
└────────┬────────────────────────┬──────────────────────────────┘
         │                        │
         │ Click NFT button       │ API calls
         ▼                        ▼
┌────────────────────┐   ┌─────────────────────────────────────┐
│  NFT MINT PAGE     │   │    RAILWAY API SERVER               │
│ docs/nft-mint.html │   │  api/tama_supabase_api.js           │
│ - Connect Phantom  │   │  - Leaderboard upsert               │
│ - Mint NFT (TAMA)  │   │  - Transaction logging              │
│ - View collection  │   │  - Economy config                   │
└─────┬──────────────┘   └──────┬──────────────────────────────┘
      │                         │
      │ Phantom Wallet          │ Supabase REST API
      ▼                         ▼
┌──────────────────┐   ┌─────────────────────────────────────┐
│  SOLANA DEVNET   │   │        SUPABASE DATABASE            │
│                  │   │  - leaderboard (players)            │
│  TAMA Token:     │   │  - user_nfts (minted NFTs)          │
│  Fuqw8Zg...      │   │  - transactions (TAMA logs)         │
│                  │   │  - referrals (invite system)        │
└──────────────────┘   └─────────────────────────────────────┘
```

---

## 🎮 **Основные компоненты:**

### **1. Telegram Bot (`bot/bot.py`)**
- **Язык:** Python
- **Назначение:** Entry point для игры
- **Команды:**
  - `/start` - Запуск бота + реферальная система
  - `/play` - Открыть игру
  - `/stats` - Статистика игрока
  - `/referral` - Реферальная ссылка
- **WebApp URL:** `https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html`

---

### **2. Основная игра (`docs/tamagotchi-game.html`)**
- **Технологии:** HTML5, CSS3, JavaScript (Vanilla)
- **Функционал:**
  - Кликер игра (earn TAMA)
  - Система уровней и XP
  - Кормление питомца (Food, Happy, HP)
  - Квесты и достижения
  - Комбо система
  - Лидерборд
  - Реферальная система
- **Интеграции:**
  - Telegram WebApp SDK (получение user_id)
  - Supabase (загрузка прогресса - SELECT only)
  - Railway API (сохранение через POST)
  - Transaction Logger (логи TAMA транзакций)
- **Кнопка NFT:**
  - При клике открывает `nft-mint.html`
  - Передаёт параметры: `user_id`, `tama` (баланс)

---

### **3. NFT Mint страница (`docs/nft-mint.html`)**
- **Технологии:** HTML5, Solana Web3.js, Metaplex SDK
- **Функционал:**
  - Подключение Phantom Wallet
  - Просмотр NFT коллекции (100 питомцев)
  - Минт NFT за TAMA или SOL
  - 10 типов питомцев, 5 редкостей
  - Связь с игрой (user_id, баланс TAMA)
- **Интеграции:**
  - Solana Devnet
  - Phantom Wallet API
  - Supabase (`user_nfts` таблица)
  - TAMA Token (Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY)

---

### **4. Railway API (`api/tama_supabase_api.js`)**
- **Технологии:** Node.js, Express
- **Назначение:** Secure backend для записи в базу
- **Endpoints:**
  ```
  POST /api/tama/leaderboard/upsert  - Сохранить прогресс игрока
  POST /api/tama/transactions/log    - Логировать транзакции TAMA
  GET  /api/tama/economy/active      - Получить настройки экономики
  POST /api/tama/economy/apply       - Обновить настройки экономики
  POST /api/tama/referral/save       - Сохранить реферала
  GET  /api/tama/test                - Проверка работы API
  ```
- **Безопасность:**
  - Service Role Key (только на сервере)
  - Валидация входных данных
  - CORS настроен на GitHub Pages
- **URL:** `https://huma-chain-xyz-production.up.railway.app/api/tama`

---

### **5. Supabase Database**
- **Таблицы:**

#### **`leaderboard`:**
```sql
- id (bigint, PK)
- telegram_id (text, unique)
- wallet_address (text)
- tama (numeric) -- Баланс TAMA токенов
- level (int)
- xp (int)
- pet_name (text)
- pet_type (text)
- pet_data (jsonb) -- Food, Happy, HP, achievements
- updated_at (timestamp)
```

#### **`user_nfts`:**
```sql
- id (bigint, PK)
- telegram_id (text)
- wallet_address (text)
- mint_address (text) -- Solana NFT mint address
- pet_type (text) -- cat, dog, dragon, etc.
- rarity (text) -- Common, Uncommon, Rare, Epic, Legendary
- cost_tama (numeric)
- cost_sol (numeric)
- transaction_hash (text)
- created_at (timestamp)
```

#### **`transactions`:**
```sql
- id (bigint, PK)
- telegram_id (text)
- amount (numeric)
- type (text) -- earn_click, spend_item, level_up, referral_bonus
- created_at (timestamp)
```

#### **`referrals`:**
```sql
- id (bigint, PK)
- referrer_id (text) -- Кто пригласил
- referred_id (text) -- Кого пригласили
- reward_tama (numeric)
- created_at (timestamp)
```

---

## 🪙 **TAMA Token - Blockchain:**

### **SPL Token на Solana Devnet:**
```json
{
  "mint": "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY",
  "symbol": "TAMA",
  "decimals": 9,
  "supply": "1,000,000,000 TAMA"
}
```

### **Приватные ключи:**
- `tama-mint-keypair.json` - Mint Authority (создание TAMA)
- `payer-keypair.json` - Payer для транзакций

**⚠️ Безопасность:** Ключи НЕ должны быть в публичном Git!

### **Использование в коде:**
```javascript
// Frontend (docs/tamagotchi-game.html):
const TAMA_API_BASE = 'https://huma-chain-xyz-production.up.railway.app/api/tama';

// NFT Mint page (docs/nft-mint.html):
const TAMA_MINT_ADDRESS = 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY';
const TAMA_COST = 1000; // Cost to mint NFT

// Backend (api/tama_supabase_api.js):
// Здесь можно добавить функции для реального минта TAMA
```

---

## 🔗 **Связь игра ↔ веб ↔ блокчейн:**

### **Сценарий 1: Игрок зарабатывает TAMA**
```
1. Игрок кликает питомца в игре (tamagotchi-game.html)
2. JavaScript: gameState.tama += 0.5
3. POST запрос на Railway API: /api/tama/transactions/log
   {
     "telegram_id": "7401131043",
     "amount": 0.5,
     "type": "earn_click"
   }
4. API сохраняет в Supabase → transactions таблица
5. POST запрос на Railway API: /api/tama/leaderboard/upsert
   {
     "user_id": "7401131043",
     "tama": 62874.5,
     ...
   }
6. API обновляет leaderboard → tama баланс
```

### **Сценарий 2: Игрок минтит NFT**
```
1. Игрок в игре нажимает кнопку "🖼️ NFT"
2. Открывается nft-mint.html?user_id=7401131043&tama=62874
3. Игрок подключает Phantom Wallet
4. Нажимает "Mint NFT Pet (1000 TAMA)"
5. JavaScript проверяет баланс TAMA >= 1000
6. POST запрос в Supabase → user_nfts:
   {
     "telegram_id": "7401131043",
     "wallet_address": "8s88...",
     "pet_type": "dragon",
     "rarity": "Rare",
     "cost_tama": 1000
   }
7. В игре gameState.tama -= 1000
8. POST запрос на Railway API → обновить leaderboard
```

### **Сценарий 3: Вывод TAMA на Phantom (будущее)**
```
1. Игрок нажимает "Withdraw TAMA"
2. Вводит сумму (например, 5000 TAMA)
3. POST запрос на Railway API: /api/tama/withdraw
   {
     "telegram_id": "7401131043",
     "wallet_address": "8s88...",
     "amount": 5000
   }
4. Backend API:
   - Проверяет баланс в leaderboard
   - Загружает tama-mint-keypair.json
   - Использует Solana Web3.js + @solana/spl-token
   - Выполняет mintTo() на указанный кошелёк
5. API обновляет leaderboard: tama -= 5000
6. API логирует в transactions: type="withdraw"
7. Игрок получает реальные TAMA токены в Phantom!
```

---

## 📂 **Структура файлов (важные):**

```
huma-chain-xyz/
├── api/
│   ├── tama_supabase_api.js  ← Railway API server
│   ├── package.json
│   └── env.example
├── bot/
│   ├── bot.py                ← Telegram бот (Python)
│   ├── gamification.py
│   └── requirements.txt
├── docs/                     ← GitHub Pages (frontend)
│   ├── tamagotchi-game.html  ← Основная игра
│   ├── nft-mint.html         ← NFT магазин (НОВОЕ!)
│   ├── css/
│   │   ├── main.css
│   │   └── mint.css
│   └── js/
│       ├── transaction-logger.js
│       └── ...
├── solana-tamagotchi/        ← Исходная версия (legacy)
│   ├── index.html            ← Лендинг с Phantom
│   ├── mint.html             ← NFT минт (исходная версия)
│   └── tamagotchi-game.html  ← Старая игра
├── tama-mint-keypair.json    ← ПРИВАТНЫЙ КЛЮЧ (не в Git!)
├── payer-keypair.json        ← ПРИВАТНЫЙ КЛЮЧ (не в Git!)
├── tama-token-info.json      ← Публичная инфа о токене
├── HACKATHON_SUBMISSION.md   ← Описание для хакатона
└── README.md                 ← Главная документация
```

---

## 🚀 **Deployment:**

### **Frontend (GitHub Pages):**
```
Repo: https://github.com/tr1h/huma-chain-xyz
Branch: main
Folder: /docs
URL: https://tr1h.github.io/huma-chain-xyz/
Files:
  - tamagotchi-game.html (игра)
  - nft-mint.html (NFT магазин)
  - index.html (админки)
```

### **Backend (Railway):**
```
Service: Node.js API
File: api/tama_supabase_api.js
Port: 8002
URL: https://huma-chain-xyz-production.up.railway.app/api/tama
Auto-deploy: При git push на main
```

### **Bot (локально/VPS):**
```
Command: cd bot && python bot.py
Требования:
  - Python 3.10+
  - requirements.txt установлен
  - .env с TELEGRAM_BOT_TOKEN
```

---

## ✅ **Что уже работает:**

1. ✅ Telegram бот открывает игру
2. ✅ Игра зарабатывает TAMA (виртуально)
3. ✅ API сохраняет прогресс в Supabase
4. ✅ NFT страница (`nft-mint.html`) доступна
5. ✅ Phantom Wallet подключается
6. ✅ NFT минт сохраняется в `user_nfts`
7. ✅ Лидерборд работает
8. ✅ Реферальная система

---

## 🔄 **Что нужно доделать:**

1. 🔄 **Реальный минт TAMA:** Backend функция для вывода TAMA на Phantom
2. 🔄 **Реальный минт NFT:** Создание настоящего NFT на Solana (не mock)
3. 🔄 **Candy Machine:** Интеграция Metaplex Candy Machine для NFT
4. 🔄 **P2P маркетплейс:** Торговля NFT между игроками
5. 🔄 **Стейкинг:** Пассивный заработок TAMA

---

## 🎯 **Summary:**

Проект **полностью интегрирован**:
- ✅ Telegram Bot → Игра
- ✅ Игра → Railway API → Supabase
- ✅ Игра → NFT Mint → Phantom Wallet
- ✅ TAMA Token создан на Solana Devnet
- ✅ Приватные ключи в файлах (локально)

**Следующий шаг:** Реализовать реальный вывод TAMA и минт NFT на блокчейн!

