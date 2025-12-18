# 🏗️ ПОЛНАЯ АРХИТЕКТУРА ПРОЕКТА

## 🎯 ВСЕ КОМПОНЕНТЫ СИСТЕМЫ

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                             │
├──────────────────────────────────────────────────────────────┤
│  1. Telegram Bot UI (@GotchiGameBot)                         │
│  2. Mini App (tamagotchi-game.html)                          │
│  3. Mint Page (mint.html)                                    │
│  4. Admin Dashboard (super-admin.html)                       │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                   BACKEND LAYER (3 части!)                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  Python Bot    │  │   PHP API      │  │  Supabase    │  │
│  │   (bot.py)     │  │   (REST)       │  │   (REST)     │  │
│  ├────────────────┤  ├────────────────┤  ├──────────────┤  │
│  │ • Commands     │  │ • /balance     │  │ • Direct DB  │  │
│  │ • /start       │  │ • /add         │  │   queries    │  │
│  │ • /withdraw    │  │ • /spend       │  │ • RPC calls  │  │
│  │ • /wallet      │  │ • /mint-nft    │  │ • Real-time  │  │
│  │ • /help        │  │ • /stats       │  │              │  │
│  │ • Gamification │  │ • /leaderboard │  │              │  │
│  │ • Referrals    │  │ • /test        │  │              │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│         │                    │                    │          │
└─────────┼────────────────────┼────────────────────┼─────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                            │
├──────────────────────────────────────────────────────────────┤
│  Supabase PostgreSQL                                         │
│  • leaderboard (users, tama, xp, levels)                     │
│  • referrals (2-level referral system)                       │
│  • tama_economy (all transactions)                           │
│  • user_nfts (NFT ownership)                                 │
│  • global_stats (burn, pool, etc)                            │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                   BLOCKCHAIN LAYER                            │
├──────────────────────────────────────────────────────────────┤
│  Solana Blockchain (Devnet)                                  │
│  • TAMA Token (SPL)                                          │
│    Mint: Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY       │
│  • NFT Program (Metaplex)                                    │
│  • User Wallets (Phantom)                                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 КАК ВСЁ ВЗАИМОДЕЙСТВУЕТ?

### ВАРИАНТ 1: Игра использует PHP API

```javascript
// В tamagotchi-game.html
async function earnTAMA(amount) {
  // ВМЕСТО прямого Supabase:
  const response = await fetch('http://localhost:8002/api/tama/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      telegram_id: telegramUserId,
      amount: amount,
      source: 'pet_click'
    })
  });
  
  const data = await response.json();
  if (data.success) {
    updateBalance(data.new_balance);
  }
}
```

**Поток:**
```
Игрок кликает по питомцу
    ↓
JavaScript (tamagotchi-game.html)
    ↓ HTTP POST
PHP API (api/tama_supabase.php)
    ↓ SQL Query
Supabase PostgreSQL
    ↓ Response
PHP API возвращает { success: true, new_balance: 1005 }
    ↓
UI обновляется
```

---

### ВАРИАНТ 2: Игра использует Supabase напрямую

```javascript
// В tamagotchi-game.html (текущая реализация)
async function earnTAMA(amount) {
  const { data, error } = await supabase.rpc('increment_tama', {
    user_id: telegramUserId,
    amount: amount
  });
  
  if (!error) {
    updateBalance(currentBalance + amount);
  }
}
```

**Поток:**
```
Игрок кликает по питомцу
    ↓
JavaScript (tamagotchi-game.html)
    ↓ HTTPS (Supabase REST API)
Supabase PostgreSQL (direct)
    ↓ Response
UI обновляется
```

---

## 🎯 ТРИ СПОСОБА РАБОТЫ С ДАННЫМИ

### 1️⃣ **Supabase JS SDK** (текущий способ в игре)

```javascript
// В игре (tamagotchi-game.html)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Добавить TAMA
await supabase.rpc('increment_tama', {
  user_id: '123456789',
  amount: 100
});

// Получить баланс
const { data } = await supabase
  .from('leaderboard')
  .select('*')
  .eq('telegram_id', '123456789')
  .single();
```

**Плюсы:**
- ✅ Быстро (прямое соединение)
- ✅ Real-time updates (если нужно)
- ✅ Безопасно (Row Level Security)

**Минусы:**
- ❌ SUPABASE_KEY виден в браузере (публичный ключ, это ОК)
- ❌ Нет дополнительной бизнес-логики

---

### 2️⃣ **PHP API** (альтернативный способ)

```javascript
// Вместо Supabase, использовать PHP API
async function earnTAMA(amount) {
  const response = await fetch('http://localhost:8002/api/tama/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      telegram_id: telegramUserId,
      amount: amount,
      source: 'pet_click'
    })
  });
  
  return await response.json();
}
```

**PHP API endpoints:**
```php
// api/tama_supabase.php

GET  /api/tama/balance?telegram_id=123      → Получить баланс
POST /api/tama/add                          → Добавить TAMA
POST /api/tama/spend                        → Потратить TAMA
POST /api/tama/mint-nft                     → Записать NFT mint
GET  /api/tama/stats                        → Глобальная статистика
GET  /api/tama/leaderboard                  → Топ-50 игроков
GET  /api/tama/test                         → Тест подключения
```

**Плюсы:**
- ✅ Дополнительная валидация на backend
- ✅ Скрыть SUPABASE credentials (не в браузере)
- ✅ Добавить кэширование
- ✅ Rate limiting (защита от спама)

**Минусы:**
- ❌ Нужен PHP сервер (localhost:8002)
- ❌ Дополнительный hop (чуть медленнее)

---

### 3️⃣ **Python Bot** (для команд и автоматизации)

```python
# bot.py
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@bot.message_handler(commands=['balance'])
def handle_balance(message):
    telegram_id = str(message.from_user.id)
    
    response = supabase.table('leaderboard')\
        .select('tama')\
        .eq('telegram_id', telegram_id)\
        .single()\
        .execute()
    
    balance = response.data['tama']
    bot.reply_to(message, f"Your balance: {balance:,} TAMA")
```

**Плюсы:**
- ✅ Для Telegram bot commands
- ✅ Автоматизация (daily rewards, etc)
- ✅ Интеграция с Solana (withdrawal)

---

## 🔥 КАКОЙ СПОСОБ ИСПОЛЬЗОВАТЬ?

### Рекомендация:

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (Game) → Supabase НАПРЯМУЮ ✅             │
│  • Быстро                                           │
│  • Просто                                           │
│  • Real-time                                        │
│  • Уже работает!                                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  TELEGRAM BOT → Python (bot.py) ✅                  │
│  • Команды (/start, /withdraw, /wallet)            │
│  • Gamification (daily rewards, quests)             │
│  • Solana integration (real withdrawal)             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  PHP API → Опционально (для будущего) 🟡            │
│  • Если нужна дополнительная логика                 │
│  • Если нужно скрыть Supabase credentials           │
│  • Если нужен кэш или rate limiting                 │
└─────────────────────────────────────────────────────┘
```

---

## 💡 ЗАЧЕМ НУЖЕН PHP API?

### Сценарий 1: **Дополнительная валидация**

```php
// api/tama_supabase.php
function handleAddTama($pdo) {
    $amount = $input['amount'];
    
    // Проверка 1: Максимум 1000 TAMA за раз
    if ($amount > 1000) {
        return ['error' => 'Max 1000 TAMA per click'];
    }
    
    // Проверка 2: Rate limiting (max 100 кликов/минуту)
    $clicks = getRecentClicks($telegram_id);
    if ($clicks > 100) {
        return ['error' => 'Too many clicks, slow down!'];
    }
    
    // Проверка 3: Anti-bot (captcha verification)
    if (isBot($telegram_id)) {
        return ['error' => 'Bot detected, please verify you are human'];
    }
    
    // Всё OK → добавить TAMA
    $stmt = $pdo->prepare("SELECT * FROM add_tama(?, ?, ?)");
    $stmt->execute([$telegram_id, $amount, 'game']);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
```

---

### Сценарий 2: **Скрыть Supabase credentials**

```javascript
// БЕЗ PHP API (текущая реализация):
// SUPABASE_KEY виден в браузере (в JavaScript коде)
const supabase = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',  // ← Получи в Supabase Dashboard
  'YOUR_SUPABASE_ANON_KEY'                 // ← Получи в Supabase Dashboard
);

// С PHP API:
// SUPABASE credentials только на сервере!
const response = await fetch('http://localhost:8002/api/tama/add', {
  method: 'POST',
  body: JSON.stringify({ telegram_id, amount })
});
// ← Пользователь не видит Supabase credentials
```

**НО:** Это не критично, потому что:
- Supabase имеет **Row Level Security (RLS)**
- Публичный ключ (`anon key`) безопасен для браузера
- RLS правила защищают данные

---

### Сценарий 3: **Кэширование**

```php
// api/tama_supabase.php
function handleGetLeaderboard($pdo) {
    // Проверить кэш (Redis)
    $cache_key = 'leaderboard_top50';
    $cached = redis_get($cache_key);
    
    if ($cached) {
        // Вернуть из кэша (быстро!)
        return json_decode($cached);
    }
    
    // Если нет в кэше → запросить из DB
    $stmt = $pdo->query("SELECT * FROM leaderboard ORDER BY tama DESC LIMIT 50");
    $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Сохранить в кэш на 5 минут
    redis_set($cache_key, json_encode($leaderboard), 300);
    
    return $leaderboard;
}
```

---

## 🎯 ТЕКУЩАЯ АРХИТЕКТУРА (что работает сейчас)

```
┌────────────────────────────────────────────────────┐
│  FRONTEND                                          │
├────────────────────────────────────────────────────┤
│  • tamagotchi-game.html                            │
│    └─> Supabase JS SDK (DIRECT) ✅                │
│        • increment_tama()                          │
│        • get balance                               │
│        • update XP/level                           │
│                                                    │
│  • mint.html                                       │
│    └─> Solana web3.js (DIRECT) ✅                 │
│        • Metaplex NFT minting                      │
│        • Phantom wallet integration                │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  BACKEND                                           │
├────────────────────────────────────────────────────┤
│  • bot.py (Python)                                 │
│    └─> Supabase Python SDK ✅                     │
│        • /start, /help, /balance                   │
│        • /withdraw → spl-token CLI                 │
│        • /wallet → save wallet_address             │
│        • Gamification (quests, badges, ranks)      │
│        • Referral system                           │
│                                                    │
│  • api/tama_supabase.php (НЕ ИСПОЛЬЗУЕТСЯ) 🟡     │
│    • Готов к использованию                         │
│    • Endpoints работают                            │
│    • Просто не подключён к игре                    │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  DATABASE                                          │
├────────────────────────────────────────────────────┤
│  • Supabase PostgreSQL ✅                          │
│    • leaderboard                                   │
│    • referrals                                     │
│    • tama_economy                                  │
│    • user_nfts                                     │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  BLOCKCHAIN                                        │
├────────────────────────────────────────────────────┤
│  • Solana Devnet ✅                                │
│    • TAMA Token (SPL)                              │
│    • NFT Program (Metaplex)                        │
│    • spl-token CLI (for withdrawal)                │
└────────────────────────────────────────────────────┘
```

---

## 🔄 КОГДА ИСПОЛЬЗОВАТЬ PHP API?

### ✅ **СЕЙЧАС (Hackathon):**
**НЕ НУЖЕН!** ❌

Текущая архитектура работает отлично:
- Frontend → Supabase (direct) ✅
- Bot → Supabase (Python SDK) ✅
- Withdrawal → spl-token CLI ✅

---

### 🟡 **ПОСЛЕ HACKATHON (Опционально):**

Добавить PHP API если:
1. **Нужна дополнительная защита** (rate limiting)
2. **Нужна сложная бизнес-логика** (не в SQL)
3. **Нужен кэш** (Redis для leaderboard)
4. **Нужна интеграция с другими сервисами** (payment gateways, etc)

---

### ✅ **ДОЛГОСРОЧНО (Production):**

```
┌─────────────────────────────────────────────┐
│  Рекомендуемая архитектура:                  │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend (Game)                            │
│      ↓ (через PHP API)                      │
│  PHP API (Laravel/Symfony)                  │
│      ↓                                      │
│  Supabase/PostgreSQL                        │
│      ↓                                      │
│  Solana Blockchain                          │
│                                             │
│  Telegram Bot (Python)                      │
│      ↓ (через PHP API)                      │
│  PHP API                                    │
│      ↓                                      │
│  Supabase/PostgreSQL                        │
│                                             │
└─────────────────────────────────────────────┘

Преимущества:
✅ Единая точка входа (PHP API)
✅ Централизованная валидация
✅ Кэширование (Redis)
✅ Rate limiting
✅ Monitoring & Logging
✅ Easy to scale
```

---

## 📝 КАК ЗАПУСТИТЬ PHP API (если захочешь использовать)

### Шаг 1: Запустить PHP сервер

```bash
# В отдельном терминале
cd C:\goooog
php -S localhost:8002
```

### Шаг 2: Проверить что работает

```bash
# Тест подключения
curl http://localhost:8002/api/tama/test
```

**Ожидаемый ответ:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "current_time": "2025-10-31 20:00:00",
  "tables": ["leaderboard", "referrals", "tama_economy", "user_nfts"],
  "leaderboard_records": 150
}
```

### Шаг 3: Использовать в игре

```javascript
// В tamagotchi-game.html (заменить Supabase на PHP API)

// БЫЛО (Supabase direct):
await supabase.rpc('increment_tama', {
  user_id: telegramUserId,
  amount: 100
});

// СТАЛО (PHP API):
await fetch('http://localhost:8002/api/tama/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    telegram_id: telegramUserId,
    amount: 100,
    source: 'pet_click'
  })
});
```

---

## ✅ ИТОГО: ЧТО У НАС ЕСТЬ

```
┌──────────────────────────────────────────┐
│  ✅ РАБОТАЕТ СЕЙЧАС:                     │
├──────────────────────────────────────────┤
│  1. Frontend (tamagotchi-game.html)      │
│     → Supabase (direct)                  │
│                                          │
│  2. Telegram Bot (bot.py)                │
│     → Supabase (Python SDK)              │
│     → Solana (spl-token CLI)             │
│                                          │
│  3. Database (Supabase PostgreSQL)       │
│                                          │
│  4. Blockchain (Solana Devnet)           │
│     → TAMA Token                         │
│     → NFT Minting                        │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  🟡 ГОТОВО, НО НЕ ИСПОЛЬЗУЕТСЯ:          │
├──────────────────────────────────────────┤
│  • PHP API (api/tama_supabase.php)       │
│    • 7 endpoints готовы                  │
│    • Подключение к Supabase работает     │
│    • Можно использовать когда захочешь   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  🚀 БУДУЩЕЕ (опционально):               │
├──────────────────────────────────────────┤
│  • Переключить игру на PHP API           │
│  • Добавить rate limiting                │
│  • Добавить кэширование (Redis)          │
│  • Добавить monitoring                   │
└──────────────────────────────────────────┘
```

---

## 🎯 МОЯ РЕКОМЕНДАЦИЯ

### Для хакатона:
**ОСТАВИТЬ КАК ЕСТЬ** ✅
- Frontend → Supabase (direct)
- Bot → Supabase + Solana
- **PHP API не нужен сейчас!**

### После хакатона:
**МОЖЕШЬ ДОБАВИТЬ PHP API** если:
- Нужна дополнительная защита
- Нужен rate limiting
- Нужен кэш

### Долгосрочно:
**ПОСТЕПЕННАЯ МИГРАЦИЯ:**
1. Добавить PHP API
2. Переключить игру на API (постепенно)
3. Добавить кэш (Redis)
4. Добавить monitoring
5. Scale horizontally (multiple PHP servers)

---

**ГЛАВНОЕ:**  
🎯 **PHP API ГОТОВ**, но **НЕ ОБЯЗАТЕЛЕН** для хакатона!  
🚀 **Текущая архитектура РАБОТАЕТ ОТЛИЧНО!**  
💪 **Можешь добавить PHP API позже, когда захочешь!**

---

**Вопросы?** Хочешь:
- A. Оставить как есть (Supabase direct) ✅
- B. Переключить игру на PHP API 🔄
- C. Узнать больше про архитектуру 📚

**Говори!** 💪

