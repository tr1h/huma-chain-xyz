# 🚀 PHP API SETUP - Инструкция по запуску

## ✅ СТАТУС: API ГОТОВ К ЗАПУСКУ!

---

## 📁 ЧТО ЕСТЬ:

### Файл: `api/tama_supabase.php`
- ✅ **359 строк кода**
- ✅ **PostgreSQL/Supabase интеграция**
- ✅ **CORS headers** для frontend
- ✅ **6 endpoints** готовых к использованию

---

## 🔧 ENDPOINTS

### 1️⃣ `/test` - Проверка подключения
```bash
GET /api/tama/test

Response:
{
  "success": true,
  "message": "Database connection successful",
  "current_time": "2025-11-01 12:00:00",
  "tables": ["leaderboard", "referrals", "user_nfts"],
  "leaderboard_records": 42
}
```

### 2️⃣ `/balance` - Баланс пользователя
```bash
GET /api/tama/balance?telegram_id=123456789

Response:
{
  "success": true,
  "telegram_id": "123456789",
  "database_tama": 52046,
  "blockchain_tama": 0,
  "total_tama": 52046,
  "pet_name": "MyPet",
  "pet_type": "dragon",
  "level": 5,
  "xp": 1200
}
```

### 3️⃣ `/add` - Добавить TAMA
```bash
POST /api/tama/add
Content-Type: application/json

{
  "telegram_id": "123456789",
  "amount": 1000,
  "source": "game" // или "referral", "bonus"
}

Response:
{
  "success": true,
  "message": "TAMA added successfully",
  "new_balance": 53046
}
```

### 4️⃣ `/spend` - Потратить TAMA
```bash
POST /api/tama/spend
Content-Type: application/json

{
  "telegram_id": "123456789",
  "amount": 500,
  "purpose": "food" // или "toy", "nft_mint"
}

Response:
{
  "success": true,
  "message": "TAMA spent successfully",
  "new_balance": 52546
}
```

### 5️⃣ `/mint-nft` - Минт NFT
```bash
POST /api/tama/mint-nft
Content-Type: application/json

{
  "telegram_id": "123456789",
  "mint_address": "ABC...XYZ",
  "pet_type": "dragon",
  "rarity": "legendary",
  "cost_tama": 10000,
  "cost_sol": 0.05,
  "transaction_hash": "3feb...6uAF"
}

Response:
{
  "success": true,
  "message": "NFT minted successfully",
  "mint_address": "ABC...XYZ",
  "pet_type": "dragon",
  "rarity": "legendary",
  "cost_tama": 10000,
  "new_balance": 42546
}
```

### 6️⃣ `/stats` - Статистика
```bash
GET /api/tama/stats

Response:
{
  "success": true,
  "stats": {
    "total_users": 156,
    "total_database_tama": 5234567,
    "total_blockchain_tama": 1234567,
    "total_nfts": 42,
    "active_users_today": 78
  }
}
```

### 7️⃣ `/leaderboard` - Топ 50 игроков
```bash
GET /api/tama/leaderboard

Response:
{
  "success": true,
  "leaderboard": [
    {
      "telegram_id": "123456789",
      "telegram_username": "user1",
      "pet_name": "Dragon",
      "pet_type": "dragon",
      "pet_rarity": "legendary",
      "level": 10,
      "xp": 5000,
      "total_tama": 100000,
      "created_at": "2025-10-01T00:00:00Z"
    },
    ...
  ]
}
```

---

## 🚀 КАК ЗАПУСТИТЬ (3 ВАРИАНТА)

### **ВАРИАНТ 1: Локальный PHP Server (Тестирование)**

```powershell
# Установи PHP (если нет)
# Скачай с https://windows.php.net/download/

# Запусти встроенный PHP сервер
cd C:\goooog
php -S localhost:8000

# Тест API
curl http://localhost:8000/api/tama/test
```

### **ВАРИАНТ 2: XAMPP (Windows)**

1. Скачай XAMPP: https://www.apachefriends.org/download.html
2. Установи и запусти Apache
3. Скопируй `api/` в `C:\xampp\htdocs\`
4. Открой: http://localhost/api/tama/test

### **ВАРИАНТ 3: Vercel Deploy (Production)**

```bash
# 1. Создай vercel.json
cat > vercel.json << EOF
{
  "functions": {
    "api/**/*.php": {
      "runtime": "vercel-php@0.6.0"
    }
  },
  "routes": [
    { "src": "/api/tama/(.*)", "dest": "/api/tama_supabase.php" }
  ]
}
EOF

# 2. Деплой на Vercel
npm i -g vercel
vercel login
vercel --prod

# 3. Тест
curl https://your-project.vercel.app/api/tama/test
```

---

## 🔐 ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

### Локально (.env):
```bash
SUPABASE_DB_HOST=db.zfrazyupameidxpjihrh.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your_password_here
```

### Vercel (Environment Variables):
```
Settings → Environment Variables → Add:
- SUPABASE_DB_HOST
- SUPABASE_DB_PORT
- SUPABASE_DB_NAME
- SUPABASE_DB_USER
- SUPABASE_DB_PASSWORD
```

---

## ✅ ТЕСТ API (PowerShell)

```powershell
# 1. Запусти PHP сервер
cd C:\goooog
php -S localhost:8000

# 2. Тест подключения
Invoke-RestMethod -Uri "http://localhost:8000/api/tama/test" -Method GET

# 3. Тест баланса
Invoke-RestMethod -Uri "http://localhost:8000/api/tama/balance?telegram_id=123456789" -Method GET

# 4. Тест добавления TAMA
$body = @{
    telegram_id = "123456789"
    amount = 1000
    source = "test"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/tama/add" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

# 5. Тест статистики
Invoke-RestMethod -Uri "http://localhost:8000/api/tama/stats" -Method GET

# 6. Тест лидерборда
Invoke-RestMethod -Uri "http://localhost:8000/api/tama/leaderboard" -Method GET
```

---

## 🔗 ИНТЕГРАЦИЯ С FRONTEND

### JavaScript (tamagotchi-game.html):

```javascript
const API_BASE = 'http://localhost:8000/api/tama'; // или Vercel URL

// Получить баланс
async function getBalance(telegramId) {
  const response = await fetch(`${API_BASE}/balance?telegram_id=${telegramId}`);
  const data = await response.json();
  return data;
}

// Добавить TAMA
async function addTama(telegramId, amount, source = 'game') {
  const response = await fetch(`${API_BASE}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegram_id: telegramId, amount, source })
  });
  const data = await response.json();
  return data;
}

// Потратить TAMA
async function spendTama(telegramId, amount, purpose = 'spend') {
  const response = await fetch(`${API_BASE}/spend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegram_id: telegramId, amount, purpose })
  });
  const data = await response.json();
  return data;
}

// Получить статистику
async function getStats() {
  const response = await fetch(`${API_BASE}/stats`);
  const data = await response.json();
  return data;
}

// Получить лидерборд
async function getLeaderboard() {
  const response = await fetch(`${API_BASE}/leaderboard`);
  const data = await response.json();
  return data;
}
```

---

## 📊 БАЗА ДАННЫХ (Supabase Functions)

API использует следующие функции в Supabase:

1. ✅ `get_tama_balance(telegram_id)` - получить баланс
2. ✅ `add_tama(telegram_id, amount, source)` - добавить TAMA
3. ✅ `spend_tama(telegram_id, amount, purpose)` - потратить TAMA
4. ✅ `get_tama_stats()` - статистика

Эти функции уже созданы в Supabase! (см. `solana-tamagotchi/sql/`)

---

## 🚨 ПРОБЛЕМЫ И РЕШЕНИЯ

### Проблема: "Database connection failed"
**Решение:** Проверь переменные окружения SUPABASE_DB_*

### Проблема: "CORS error"
**Решение:** API уже настроен с CORS headers! Если не работает, проверь браузер Console.

### Проблема: "Function get_tama_balance does not exist"
**Решение:** Выполни SQL скрипты из `solana-tamagotchi/sql/` в Supabase!

---

## ✅ ИТОГ

### ЧТО ЕСТЬ:
- ✅ PHP API готов к запуску
- ✅ 7 endpoints (test, balance, add, spend, mint-nft, stats, leaderboard)
- ✅ CORS настроен
- ✅ PostgreSQL/Supabase интеграция

### ЧТО НУЖНО:
1. ⬜ Запустить PHP сервер (localhost или Vercel)
2. ⬜ Настроить переменные окружения
3. ⬜ Протестировать endpoints
4. ⬜ Интегрировать с frontend

**ГОТОВО К ЗАПУСКУ!** 🚀

---

**Рекомендация:**
- Для DEVNET тестирования: используй **локальный PHP server** (`php -S localhost:8000`)
- Для PRODUCTION: задеплой на **Vercel** или **Heroku**

---

**Ссылки:**
- PHP Download: https://windows.php.net/download/
- XAMPP: https://www.apachefriends.org/
- Vercel: https://vercel.com/

