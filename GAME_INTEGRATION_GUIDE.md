# 🎮 GAME INTEGRATION GUIDE - Добавление новых игр

## 🎯 АРХИТЕКТУРА СИСТЕМЫ

### ✅ Что у нас есть:

```
┌─────────────────────────────────────────┐
│         UNIFIED GAME SYSTEM            │
├─────────────────────────────────────────┤
│                                         │
│  🎰 slots.html  →  API  →  Supabase    │
│  🎡 wheel.html  →  API  →  Supabase    │
│  🍄 platformer  →  API  →  Supabase    │
│  🏗️ tower      →  API  →  Supabase    │
│                                         │
│  Все игры используют:                  │
│  ✅ Единый API (tama_supabase.php)     │
│  ✅ Единую базу (Supabase)              │
│  ✅ Единый баланс (leaderboard.tama)   │
│  ✅ Единые транзакции (transactions)   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🚀 КАК ДОБАВИТЬ НОВУЮ ИГРУ

### Шаг 1: Создай HTML файл игры

```html
<!DOCTYPE html>
<html>
<head>
    <title>🎮 My New Game</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <!-- Твоя игра -->
    
    <script>
        // 1. Инициализация Telegram WebApp
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
        }

        // 2. Supabase клиент
        const SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        // 3. Получение user ID
        function getUserId() {
            if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
                return String(window.Telegram.WebApp.initDataUnsafe.user.id);
            }
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('user_id') || localStorage.getItem('telegram_user_id') || '123456789';
        }

        let userId = getUserId();
        const API_BASE = 'https://api.solanatamagotchi.com/api/tama';

        // 4. Загрузка баланса
        async function loadBalance() {
            const response = await fetch(`${API_BASE}/balance?telegram_id=${userId}`);
            if (response.ok) {
                const data = await response.json();
                return data.total_tama || data.database_tama || data.balance || 0;
            }
            return 0;
        }

        // 5. Обновление баланса через API
        async function updateBalance(amount, metadata = {}) {
            const response = await fetch(`${API_BASE}/balance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    telegram_id: userId,
                    amount: amount,
                    type: amount > 0 ? 'game_win' : 'game_bet',
                    metadata: JSON.stringify(metadata)
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.total_tama || data.database_tama || data.balance || 0;
            }
            return null;
        }

        // 6. Твоя игровая логика
        async function playGame() {
            const bet = 100;
            const balance = await loadBalance();
            
            if (balance < bet) {
                alert('Not enough TAMA!');
                return;
            }

            // Списываем ставку
            await updateBalance(-bet, { game: 'mygame', action: 'bet' });

            // Игровая логика
            const win = Math.random() > 0.5 ? bet * 2 : 0;

            // Начисляем выигрыш
            if (win > 0) {
                await updateBalance(win, { game: 'mygame', action: 'win', multiplier: 2 });
            }
        }
    </script>
</body>
</html>
```

---

## 📋 ЧЕКЛИСТ ДЛЯ НОВОЙ ИГРЫ

### Обязательно:

- [ ] ✅ Telegram WebApp инициализация
- [ ] ✅ Получение user_id (Telegram/URL/localStorage)
- [ ] ✅ Загрузка баланса через API
- [ ] ✅ Обновление баланса через API
- [ ] ✅ Логирование транзакций
- [ ] ✅ Обработка ошибок
- [ ] ✅ Сохранение истории (localStorage)
- [ ] ✅ Звуки (опционально)
- [ ] ✅ Provably Fair (опционально)

### Опционально:

- [ ] 🔊 Звуковые эффекты
- [ ] ✅ Provably Fair система
- [ ] 📊 Статистика игрока
- [ ] 📜 История игр
- [ ] 🎨 Красивый UI
- [ ] 📱 Адаптивный дизайн

---

## 🔌 API ENDPOINTS

### 1. Получить баланс:
```javascript
GET /api/tama/balance?telegram_id=123456789

Response:
{
  "success": true,
  "total_tama": 50000,
  "database_tama": 50000,
  "blockchain_tama": 0
}
```

### 2. Обновить баланс:
```javascript
POST /api/tama/balance

Body:
{
  "telegram_id": "123456789",
  "amount": 100,  // положительное = выигрыш, отрицательное = ставка
  "type": "game_win"  // или "game_bet"
}

Response:
{
  "success": true,
  "total_tama": 50100,
  "balance": 50100
}
```

### 3. Специальные endpoints (для слотов):
```javascript
POST /api/tama/slots/spin
GET /api/tama/slots/jackpot
```

---

## 🎨 ДОБАВЛЕНИЕ В МЕНЮ

### В tamagotchi-game.html:

```html
<!-- 1. Добавь карточку игры -->
<div class="game-card" data-game="mygame" style="background: linear-gradient(135deg, #FFD700, #FFA500); cursor: pointer;">
    <div class="game-card-icon">🎮</div>
    <div class="game-card-name">My New Game</div>
    <div class="game-card-cost">Bet: 100 TAMA | Win: up to 500 TAMA!</div>
</div>
```

```javascript
// 2. Добавь обработчик клика
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
        const gameName = card.dataset.game;
        
        if (gameName === 'mygame') {
            const userId = window.TELEGRAM_USER_ID || '';
            window.open(`/mygame.html?user_id=${userId}`, '_blank');
            return;
        }
        // ... другие игры
    });
});
```

---

## 📊 БАЗА ДАННЫХ

### Таблицы которые используются:

#### 1. `leaderboard` - баланс игроков
```sql
telegram_id BIGINT PRIMARY KEY
tama BIGINT  -- баланс TAMA
```

#### 2. `transactions` - все транзакции
```sql
telegram_id TEXT
amount BIGINT  -- положительное = выигрыш, отрицательное = ставка
type TEXT  -- 'game_win', 'game_bet', 'slots_spin', etc.
metadata JSONB  -- дополнительная информация
created_at TIMESTAMP
```

#### 3. Специальные таблицы (для слотов):
```sql
slots_daily_stats
slots_jackpot_pool
slots_jackpot_history
```

---

## 🎯 ПРИМЕРЫ ИГР

### ✅ Реализованные игры:

1. **🎰 Lucky Slots** (`slots.html`)
   - Ставки: 100-2000 TAMA
   - Выигрыш: до x100 + джекпот
   - API: `/api/tama/slots/spin`
   - Особенности: джекпот пул, бесплатные спины

2. **🎡 Lucky Wheel** (`wheel.html`)
   - Ставки: 500-1000 TAMA
   - Выигрыш: до x10
   - API: `/api/tama/balance`
   - Особенности: 8 сегментов, честная игра

3. **🍄 TAMA Jump** (встроенная)
   - Ставка: 100 TAMA
   - Выигрыш: до 500 TAMA
   - API: `/api/tama/balance`

4. **🏗️ TAMA TOWER** (встроенная)
   - Ставки: 50-500 TAMA
   - Выигрыш: до x20
   - API: `/api/tama/balance`

---

## 🔧 ШАБЛОН НОВОЙ ИГРЫ

Создай файл `game-template.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎮 My Game - Solana Tamagotchi</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        /* Твои стили */
    </style>
</head>
<body>
    <div class="container">
        <h1>🎮 MY GAME</h1>
        
        <div class="balance">
            Balance: <span id="balance">Loading...</span> TAMA
        </div>
        
        <button onclick="playGame()">Play</button>
        
        <div id="result"></div>
    </div>

    <script>
        // === ОБЯЗАТЕЛЬНЫЙ КОД ===
        
        // 1. Telegram WebApp
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
        }

        // 2. Supabase
        const SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        // 3. User ID
        function getUserId() {
            if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
                return String(window.Telegram.WebApp.initDataUnsafe.user.id);
            }
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('user_id') || localStorage.getItem('telegram_user_id') || '123456789';
        }

        let userId = getUserId();
        const API_BASE = 'https://api.solanatamagotchi.com/api/tama';
        let balance = 0;

        // 4. Load balance
        async function loadBalance() {
            try {
                const response = await fetch(`${API_BASE}/balance?telegram_id=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    balance = data.total_tama || data.database_tama || data.balance || 0;
                    document.getElementById('balance').textContent = balance.toLocaleString();
                }
            } catch (error) {
                console.error('Failed to load balance:', error);
            }
        }

        // 5. Update balance
        async function updateBalance(amount, metadata = {}) {
            try {
                const response = await fetch(`${API_BASE}/balance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        telegram_id: userId,
                        amount: amount,
                        type: amount > 0 ? 'mygame_win' : 'mygame_bet',
                        metadata: JSON.stringify(metadata)
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    balance = data.total_tama || data.database_tama || data.balance || balance;
                    document.getElementById('balance').textContent = balance.toLocaleString();
                    return balance;
                }
            } catch (error) {
                console.error('Failed to update balance:', error);
            }
            return balance;
        }

        // === ТВОЯ ИГРОВАЯ ЛОГИКА ===
        
        async function playGame() {
            const bet = 100;
            
            if (balance < bet) {
                document.getElementById('result').textContent = '❌ Not enough TAMA!';
                return;
            }

            // Deduct bet
            await updateBalance(-bet, { game: 'mygame', action: 'bet' });

            // Game logic
            const win = Math.random() > 0.5 ? bet * 2 : 0;

            if (win > 0) {
                await updateBalance(win, { game: 'mygame', action: 'win', multiplier: 2 });
                document.getElementById('result').textContent = `🎉 You won ${win} TAMA!`;
            } else {
                document.getElementById('result').textContent = '😢 No win this time!';
            }
        }

        // Initialize
        loadBalance();
    </script>
</body>
</html>
```

---

## 🎨 UI КОМПОНЕНТЫ

### Используй готовые стили из slots.html/wheel.html:

```css
/* Градиентный фон */
background: linear-gradient(135deg, #1a0033 0%, #330066 50%, #1a0033 100%);

/* Кнопки */
background: linear-gradient(135deg, #FFD700, #FFA500);
border-radius: 15px;
padding: 15px 30px;

/* Карточки */
background: rgba(255,255,255,0.1);
border-radius: 15px;
padding: 20px;
```

---

## 📝 ЛОГИРОВАНИЕ ТРАНЗАКЦИЙ

### Автоматически через API:

```javascript
// API автоматически логирует в transactions:
{
  telegram_id: "123456789",
  amount: -100,  // отрицательное = ставка
  type: "mygame_bet",
  metadata: {
    game: "mygame",
    action: "bet",
    bet_amount: 100
  }
}
```

---

## 🚀 БЫСТРЫЙ СТАРТ

### 1. Скопируй шаблон:
```bash
cp game-template.html mygame.html
```

### 2. Измени игровую логику:
```javascript
// В функции playGame() добавь свою логику
```

### 3. Добавь в меню:
```html
<!-- В tamagotchi-game.html -->
<div class="game-card" data-game="mygame">...</div>
```

### 4. Готово! 🎉

---

## 💡 СОВЕТЫ

1. **Всегда проверяй баланс** перед списанием
2. **Используй API** для всех операций с балансом
3. **Логируй важные события** в metadata
4. **Сохраняй историю** в localStorage
5. **Добавляй звуки** для лучшего UX
6. **Делай Provably Fair** для честности

---

## 🎯 ПРЕИМУЩЕСТВА СИСТЕМЫ

```
✅ Модульность - каждая игра отдельный файл
✅ Единый API - все игры используют один endpoint
✅ Единый баланс - все игры работают с одним балансом
✅ Автоматическое логирование - все транзакции сохраняются
✅ Легко добавлять - просто создай HTML файл
✅ Масштабируемость - можно добавить сколько угодно игр
✅ Безопасность - все операции через API
✅ Прозрачность - все транзакции видны в БД
```

---

## 📚 ДОКУМЕНТАЦИЯ

- `slots.html` - пример сложной игры с джекпотом
- `wheel.html` - пример простой игры с колесом
- `api/tama_supabase.php` - API endpoint
- `tamagotchi-game.html` - главное меню игр

---

**СОЗДАВАЙ ИГРЫ И ДОБАВЛЯЙ В СИСТЕМУ!** 🎮🚀

