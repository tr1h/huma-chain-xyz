# 🏗️ АРХИТЕКТУРА СИСТЕМЫ - Solana Tamagotchi

## 📊 ОБЩАЯ СХЕМА:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOLANA TAMAGOTCHI ECOSYSTEM                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   WEB GAME       │      │  TELEGRAM BOT    │      │  NFT MINT        │
│  tamagotchi-     │◄────►│  @GotchiGameBot  │◄────►│  mint.html       │
│  game.html       │      │  bot.py          │      │                  │
│                  │      │                  │      │                  │
│  • 3 Pet Types   │      │  • 25+ Commands  │      │  • 100 NFT       │
│  • 5 Evolutions  │      │  • Gamification  │      │  • Metaplex      │
│  • Click-to-Earn │      │  • Referrals     │      │  • Phantom       │
│  • Mini-Games    │      │  • Withdrawal    │      │  • Rarity        │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                         │                         │
         │                         │                         │
         └─────────────────┬───────┴─────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │        SUPABASE DATABASE           │
         │                                    │
         │  Main Tables:                      │
         │  • leaderboard (балансы TAMA)      │
         │  • referrals (рефералы)           │
         │  • players (игроки)               │
         │  • nft_mints (NFT минты)          │
         │                                    │
         │  Gamification:                     │
         │  • daily_rewards (ежедневно)      │
         │  • game_plays (игры)              │
         │  • user_badges (значки)           │
         │  • user_ranks (ранги)             │
         │  • user_quests (квесты)           │
         └────────────────┬───────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │      SOLANA BLOCKCHAIN             │
         │                                    │
         │  • TAMA Token (SPL)               │
         │  • NFT Collection (Metaplex)      │
         │  • Devnet/Mainnet                 │
         │  • Wallet Integration             │
         └────────────────────────────────────┘
```

---

## 🎮 ИГРОВОЙ FLOW:

```
НОВЫЙ ИГРОК
    │
    ├─► 1. Открывает игру (Web/Telegram)
    │      https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html
    │
    ├─► 2. Выбирает питомца (Kawai/Retro/Cyber)
    │      Pet создаётся в gameState
    │
    ├─► 3. Играет - Click-to-Earn
    │      Каждый клик: +1-10 TAMA
    │      Сохранение в Supabase каждые 10 секунд
    │
    ├─► 4. Зарабатывает TAMA
    │      • Клики: 1-10 TAMA
    │      • Кормление/игра: уменьшает TAMA но повышает stats
    │      • Мини-игры: 25-500 TAMA
    │      • Эволюция: бонус TAMA
    │
    ├─► 5. Открывает дополнительные возможности:
    │      ┌──────────────────────────────────┐
    │      │ 💸 WITHDRAW → @GotchiGameBot     │
    │      │   Вывод TAMA на Solana кошелёк   │
    │      │   Min: 10,000 TAMA | Fee: 5%     │
    │      └──────────────────────────────────┘
    │      ┌──────────────────────────────────┐
    │      │ 🎨 MINT NFT → mint.html          │
    │      │   Mint уникального NFT питомца   │
    │      │   100 NFT | Rarity system        │
    │      └──────────────────────────────────┘
    │      ┌──────────────────────────────────┐
    │      │ 🔗 MY LINK → Referral System     │
    │      │   Приглашай друзей               │
    │      │   1,000 TAMA за реферала         │
    │      └──────────────────────────────────┘
    │
    └─► 6. Telegram Bot (@GotchiGameBot)
           /start, /help, /daily, /games, /withdraw
```

---

## 🤖 BOT FLOW:

```
ПОЛЬЗОВАТЕЛЬ → @GotchiGameBot
    │
    ├─► /start
    │   ├─► Проверка реферала (из deep link)
    │   ├─► Создание записи в БД
    │   ├─► Начисление 1,000 TAMA рефереру
    │   └─► Welcome message + кнопки
    │
    ├─► /help
    │   └─► Список всех команд с описанием
    │
    ├─► /stats
    │   ├─► Запрос в Supabase (leaderboard)
    │   └─► Показ: TAMA, level, referrals, streak
    │
    ├─► /ref
    │   ├─► Генерация уникального кода (TAMAXXXXXX)
    │   ├─► Создание QR кода
    │   └─► Отправка: ссылка + QR
    │
    ├─► /daily
    │   ├─► Проверка последнего claim
    │   ├─► Увеличение streak
    │   ├─► Начисление TAMA (50-2,000)
    │   └─► Сохранение в daily_rewards
    │
    ├─► /games
    │   ├─► Проверка лимита (3/день)
    │   ├─► Меню игр: Guess, Trivia, Spin
    │   ├─► Игра → результат
    │   ├─► Начисление награды (25-500 TAMA)
    │   └─► Сохранение в game_plays
    │
    ├─► /withdraw
    │   ├─► Проверка баланса (min 10,000)
    │   ├─► Ввод суммы
    │   ├─► Расчёт комиссии (5%)
    │   ├─► DEMO: Симуляция транзакции
    │   ├─► Списание TAMA из БД
    │   └─► Показ mock tx signature
    │
    └─► /badges, /rank, /quests
        └─► Gamification система
```

---

## 🔗 REFERRAL FLOW:

```
РЕФЕРЕР (User A)
    │
    ├─► 1. Запрашивает /ref в боте
    │      Bot генерирует код: TAMA3F2A5B
    │
    ├─► 2. Получает:
    │      • Link: https://tr1h.github.io/.../s.html?ref=TAMA3F2A5B
    │      • QR код для распространения
    │
    └─► 3. Делится ссылкой
           │
           ▼
        НОВЫЙ ИГРОК (User B)
           │
           ├─► 4. Кликает по ссылке
           │      s.html?ref=TAMA3F2A5B
           │
           ├─► 5. Redirect в бот с параметром:
           │      https://t.me/GotchiGameBot?start=ref_TAMA3F2A5B
           │
           ├─► 6. Бот обрабатывает /start:
           │      • Декодирует TAMA3F2A5B → User A ID
           │      • Проверяет валидность
           │      • Проверяет self-referral
           │
           ├─► 7. Начисляет награды:
           │      ┌─────────────────────────────────┐
           │      │ User A: +1,000 TAMA (Level 1)  │
           │      │ User B: Welcome bonus           │
           │      └─────────────────────────────────┘
           │
           └─► 8. Сохраняет в БД:
                  • referrals table
                  • pending_referrals (если B без кошелька)
                  • referral_clicks (аналитика)

LEVEL 2 REFERRAL:
User B делится → User C кликает → User A: +500 TAMA (Level 2)
```

---

## 💸 WITHDRAWAL FLOW (DEMO):

```
ИГРОК (с балансом ≥10,000 TAMA)
    │
    ├─► 1. В игре: кликает "💸 Withdraw"
    │      → Открывается @GotchiGameBot
    │
    ├─► 2. В боте: /withdraw
    │      Bot показывает:
    │      • Текущий баланс
    │      • Минимум: 10,000 TAMA
    │      • Комиссия: 5%
    │      • Статус: Demo Mode
    │
    ├─► 3. Кнопка "💸 Start Withdrawal"
    │      Bot запрашивает сумму
    │
    ├─► 4. Игрок вводит сумму (например, 20,000)
    │      Bot проверяет:
    │      ├─► Баланс достаточен?
    │      ├─► Сумма ≥ 10,000?
    │      └─► OK → продолжить
    │
    ├─► 5. Расчёт:
    │      Сумма: 20,000 TAMA
    │      Комиссия (5%): 1,000 TAMA
    │      К получению: 19,000 TAMA
    │
    ├─► 6. DEMO MODE:
    │      ┌────────────────────────────────────┐
    │      │ Симуляция Solana транзакции:      │
    │      │ • Генерация mock signature         │
    │      │ • Списание из БД (-20,000 TAMA)   │
    │      │ • Показ "успешно"                  │
    │      └────────────────────────────────────┘
    │
    └─► 7. Результат:
           ✅ Success!
           Amount: 19,000 TAMA
           Fee: 1,000 TAMA
           Tx: 5rFq8...kL2p (mock)
           Explorer: solscan.io/tx/... (demo)

REAL MODE (после хакатона):
    └─► Реальная транзакция:
        • Transfer SPL Token
        • Из P2E_POOL_WALLET
        • На кошелёк игрока
        • Реальный signature
```

---

## 🎨 NFT MINT FLOW:

```
ИГРОК → mint.html
    │
    ├─► 1. Открывает страницу минта
    │      https://tr1h.github.io/huma-chain-xyz/mint.html
    │
    ├─► 2. Подключает Phantom Wallet
    │      Кнопка "Connect Wallet"
    │      → Phantom popup → Approve
    │
    ├─► 3. Видит коллекцию:
    │      • 100 уникальных NFT
    │      • Preview случайного NFT
    │      • Rarity information
    │      • Mint price (если есть)
    │
    ├─► 4. Кликает "Mint NFT"
    │      ┌────────────────────────────────────┐
    │      │ Metaplex Candy Machine:            │
    │      │ • Выбор случайного NFT             │
    │      │ • Mint on-chain                    │
    │      │ • Upload metadata                  │
    │      └────────────────────────────────────┘
    │
    ├─► 5. Phantom запрашивает подтверждение
    │      Transaction:
    │      • Mint NFT
    │      • Fee: ~0.001 SOL
    │      → Игрок подтверждает
    │
    ├─► 6. Success!
    │      • NFT появляется в кошельке
    │      • Показ tx signature
    │      • Link на explorer
    │
    └─► 7. Сохранение в БД:
           INSERT INTO nft_mints (
               wallet_address,
               nft_id,
               rarity,
               tx_signature,
               minted_at
           )
```

---

## 💰 TOKENOMICS FLOW:

```
TAMA TOKEN LIFECYCLE
    │
    ├─► EARN (Приход)
    │   ├─► Click-to-Earn: 1-10 TAMA/клик
    │   ├─► Daily Reward: 50-2,000 TAMA/день
    │   ├─► Mini-Games: 25-500 TAMA/игра
    │   ├─► Referrals:
    │   │   ├─► Level 1: 1,000 TAMA
    │   │   └─► Level 2: 500 TAMA
    │   └─► Milestones: до 500,000 TAMA
    │
    ├─► SPEND (Расход)
    │   ├─► Feed Pet: 10 TAMA
    │   ├─► Play with Pet: 5 TAMA
    │   ├─► Heal Pet: 20 TAMA
    │   ├─► Game Bets: 50-1,000 TAMA
    │   └─► Withdrawal Fee: 5%
    │
    ├─► BALANCE (Баланс)
    │   ├─► Хранится в Supabase (leaderboard.tama)
    │   ├─► Обновляется real-time
    │   └─► Виден в игре и боте
    │
    └─► WITHDRAW (Вывод)
        ├─► Min: 10,000 TAMA
        ├─► Fee: 5% (500 TAMA на 10k)
        ├─► → Solana SPL Token
        └─► → Кошелёк игрока

CIRCULATION:
┌──────────────────────────────────────┐
│  Игрок зарабатывает → Баланс растёт  │
│  Игрок тратит → Циркуляция           │
│  Игрок выводит → Out of system       │
│  Новый игрок → Приток                │
└──────────────────────────────────────┘

ECONOMY BALANCE:
• 70% зарабатывается играя
• 20% зарабатывается рефералами
• 10% зарабатывается daily/games
• 30% тратится на питомца
• 20% тратится на игры
• 50% сохраняется для вывода
```

---

## 🗄️ DATABASE SCHEMA:

```sql
-- MAIN TABLES
leaderboard
├─ telegram_id (PK)
├─ telegram_username
├─ wallet_address
├─ tama (balance)
├─ level
├─ total_clicks
└─ last_played

referrals
├─ id (PK)
├─ referrer_telegram_id (FK → leaderboard)
├─ referred_telegram_id (FK → leaderboard)
├─ referral_code
├─ reward_amount
├─ level (1 or 2)
└─ created_at

nft_mints
├─ id (PK)
├─ wallet_address
├─ nft_id (0-99)
├─ rarity
├─ tx_signature
└─ minted_at

-- GAMIFICATION TABLES
daily_rewards
├─ telegram_id (PK)
├─ streak_days
├─ last_claim
└─ total_claimed

game_plays
├─ id (PK)
├─ telegram_id
├─ game_type
├─ bet_amount
├─ win_amount
└─ played_at

game_limits
├─ telegram_id (PK)
├─ games_today
└─ last_reset

user_badges
├─ id (PK)
├─ telegram_id
├─ badge_id
└─ earned_at

user_ranks
├─ telegram_id (PK)
├─ rank_name
├─ referral_count
└─ updated_at

user_quests
├─ telegram_id (PK)
├─ quest_id
├─ progress
└─ completed
```

---

## 🔐 SECURITY ARCHITECTURE:

```
LAYER 1: Frontend
├─ Input validation (wallet addresses, TAMA amounts)
├─ Rate limiting (клики, запросы)
└─ HTTPS only

LAYER 2: Bot
├─ Command throttling (anti-spam)
├─ User verification (Telegram ID)
├─ Self-referral check
└─ Balance validation

LAYER 3: Database
├─ Supabase RLS policies
├─ Row Level Security
├─ Read/Write permissions
└─ Audit logs

LAYER 4: Blockchain
├─ Wallet signature verification
├─ Transaction validation
├─ Smart contract checks
└─ Network security (Solana)

SECRETS MANAGEMENT:
├─ .env files (gitignored)
├─ Environment variables
├─ Keypairs (payer, mint) в .gitignore
└─ API keys не в коде
```

---

## 📈 DATA FLOW:

```
USER ACTION → FRONTEND → API → DATABASE → BLOCKCHAIN
                                              │
                                              ▼
                                        CONFIRMATION
                                              │
                                              ▼
                                     DATABASE UPDATE
                                              │
                                              ▼
                                      FRONTEND UPDATE

EXAMPLE (Withdraw):
1. User clicks "Withdraw" → tamagotchi-game.html
2. Opens bot → @GotchiGameBot
3. User: /withdraw → bot.py
4. Bot queries DB → Supabase (get balance)
5. User enters amount → bot.py validates
6. DEMO: Mock transaction → fake signature
7. REAL: Transfer SPL → Solana network
8. Update balance → Supabase (balance -= amount)
9. Show result → Telegram message
10. User sees updated balance → game refreshes
```

---

## 🚀 DEPLOYMENT ARCHITECTURE:

```
┌───────────────────────────────────────┐
│          PRODUCTION STACK             │
└───────────────────────────────────────┘

FRONTEND:
├─ GitHub Pages
│  ├─ URL: https://tr1h.github.io/huma-chain-xyz/
│  ├─ CDN: GitHub CDN (global)
│  ├─ SSL: Automatic (GitHub)
│  └─ Build: Static files (no build step)

BACKEND (BOT):
├─ Local/Server
│  ├─ Runtime: Python 3.12
│  ├─ Process: python bot.py (polling mode)
│  ├─ Alternative: Heroku/Railway/DigitalOcean
│  └─ Monitoring: logs + health checks

DATABASE:
├─ Supabase (PostgreSQL)
│  ├─ Cloud hosted
│  ├─ Auto backups
│  ├─ RLS enabled
│  └─ Edge functions ready

BLOCKCHAIN:
├─ Solana
│  ├─ Current: Devnet (for testing)
│  ├─ Production: Mainnet-beta
│  ├─ RPC: Public endpoints
│  └─ Wallet: Phantom/Solflare
```

---

## 🎯 SUMMARY:

**Полная архитектура включает:**
- ✅ Web Game (HTML/JS)
- ✅ Telegram Bot (Python)
- ✅ NFT Mint Page (HTML/JS)
- ✅ Referral System (tracking + rewards)
- ✅ Database (Supabase)
- ✅ Blockchain (Solana)
- ✅ Token (TAMA SPL)
- ✅ NFT Collection (Metaplex)

**Всё интегрировано и работает вместе! 🚀**

---

*Версия: 1.0*  
*Дата: 30 октября 2025*  
*Проект: Solana Tamagotchi*


