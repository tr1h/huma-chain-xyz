# 🔗 Как связывается Telegram + Кошелек - ПОЛНОЕ ОБЪЯСНЕНИЕ

## 📊 ТЕКУЩАЯ СИТУАЦИЯ (из твоих логов):

```
URL: mint.html?user_id=202140267&level=8&xp=629
     ↑ Telegram ID из URL

Auth: Telegram ID: 2139640084
      ↑ Telegram ID из authState (другой!)

Wallet: J2XcRxsXruvSUpee2YynQ1cb2UrbdfeUBETXNTJ3Ded5
        ↑ Автоподключен из localStorage

Сохранение: ✅ Wallet address saved to database (auto-connect)
```

**⚠️ ПРОБЛЕМА:** В URL один Telegram ID (202140267), а в authState другой (2139640084)!

---

## 🗄️ ГДЕ ХРАНЯТСЯ ДАННЫЕ:

### 1. **Таблица `leaderboard`** (Telegram users)

```sql
CREATE TABLE leaderboard (
    telegram_id BIGINT PRIMARY KEY,  -- 202140267 или 2139640084
    telegram_username TEXT,
    tama NUMERIC,                    -- Основной баланс
    level INTEGER,
    xp INTEGER,
    wallet_address TEXT,             -- 🔗 СВЯЗАННЫЙ КОШЕЛЕК (если есть)
    clicks INTEGER,
    game_state JSONB,
    created_at TIMESTAMP
);
```

**Пример записи:**
```
telegram_id: 202140267
telegram_username: "Trimooo"
tama: 42705
level: 8
xp: 629
wallet_address: "H4p6U5oP5V2tvTyL1URfEjUVk8ni6diujzWniqFiHCZ9"  ← СВЯЗАН!
```

---

### 2. **Таблица `wallet_users`** (Wallet users)

```sql
CREATE TABLE wallet_users (
    wallet_address TEXT PRIMARY KEY,  -- J2XcRxsXruvSUpee2YynQ1cb2UrbdfeUBETXNTJ3Ded5
    user_id TEXT,
    telegram_id BIGINT,              -- 🔗 СВЯЗАННЫЙ TELEGRAM (если есть)
    username TEXT,
    tama_balance NUMERIC,            -- Синхронизируется с leaderboard
    level INTEGER,
    clicks INTEGER,
    game_state JSONB,
    created_at TIMESTAMP
);
```

**Пример записи:**
```
wallet_address: "J2XcRxsXruvSUpee2YynQ1cb2UrbdfeUBETXNTJ3Ded5"
telegram_id: 2139640084  ← СВЯЗАН!
tama_balance: 140532
level: 8
```

---

## 🔄 КАК ПРОИСХОДИТ СВЯЗЫВАНИЕ:

### **Сценарий 1: Telegram user подключает кошелек**

```
1. Пользователь играет в Telegram боте
   └─ Данные в leaderboard (telegram_id = 202140267)

2. Пользователь открывает mint.html
   └─ URL: ?user_id=202140267 (из бота)

3. Пользователь подключает Phantom кошелек
   └─ Wallet: J2XcRxsXruvSUpee2YynQ1cb2UrbdfeUBETXNTJ3Ded5

4. mint.html автоматически сохраняет связь:
   └─ POST /api/tama/update-wallet
      {
        telegram_id: 202140267,
        wallet_address: "J2XcRxsXruvSUpee2YynQ1cb2UrbdfeUBETXNTJ3Ded5"
      }

5. API обновляет БД:
   ├─ leaderboard.wallet_address = "J2XcRxsXruvSUpee2YynQ1cb2UrbdfeUBETXNTJ3Ded5"
   └─ wallet_users.telegram_id = 202140267 (если запись существует)

6. ✅ СВЯЗАНО!
```

---

### **Сценарий 2: Wallet user подтверждает Telegram**

```
1. Пользователь заходит на сайт с кошельком
   └─ Wallet: J2XcRxsXruvSUpee2YynQ1cb2UrbdfeUBETXNTJ3Ded5
   └─ Данные в wallet_users (если есть)

2. Пользователь открывает бота
   └─ Telegram ID: 2139640084

3. Бот предлагает: "Связать с кошельком?"
   └─ Пользователь подтверждает

4. Бот сохраняет связь:
   └─ UPDATE leaderboard SET wallet_address = "J2XcRxsXruvSUpee2YynQ1cb2UrbdfeUBETXNTJ3Ded5"
      WHERE telegram_id = 2139640084

5. ✅ СВЯЗАНО!
```

---

## 🔍 КОД СВЯЗЫВАНИЯ:

### **1. mint.html - Автосохранение при подключении кошелька:**

```javascript
// Строка 4394-4410 в mint.html
// Когда кошелек автоподключается:

fetch(`${TAMA_API_BASE}/update-wallet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        telegram_id: TELEGRAM_USER_ID,  // 2139640084 (из authState)
        wallet_address: walletAddress    // J2XcRxsXruvSUpee2YynQ1cb2UrbdfeUBETXNTJ3Ded5
    })
})
```

**Проблема:** Использует `TELEGRAM_USER_ID` из authState, а не из URL!

---

### **2. API endpoint: `/api/tama/update-wallet`**

```php
// api/tama_supabase.php, строка 580-624

// Обновляет leaderboard:
supabaseRequest($url, $key, 'PATCH', 'leaderboard', [
    'telegram_id' => "eq.$telegram_id"
], [
    'wallet_address' => $wallet_address  // Сохраняет кошелек
]);

// Также обновляет wallet_users (если существует):
// Ищет запись по wallet_address
// Обновляет telegram_id
```

---

## ⚠️ ПРОБЛЕМЫ В ТЕКУЩЕЙ СИСТЕМЕ:

### **Проблема #1: Разные Telegram ID**

```
URL: user_id=202140267        ← Из бота
Auth: Telegram ID: 2139640084 ← Из authState (другой!)

Результат: Кошелек может связаться с НЕПРАВИЛЬНЫМ Telegram аккаунтом!
```

**Решение:** Использовать Telegram ID из URL, если он есть!

---

### **Проблема #2: Нет проверки существующей связи**

```
Если wallet уже связан с другим Telegram ID:
- Старая связь не удаляется
- Может быть конфликт
```

**Решение:** Проверять перед связыванием!

---

### **Проблема #3: Нет синхронизации балансов**

```
leaderboard.tama = 42705
wallet_users.tama_balance = 140532

Если они не синхронизированы → путаница!
```

**Решение:** Unified Balance API уже решает это! ✅

---

## ✅ УЛУЧШЕННАЯ СИСТЕМА СВЯЗЫВАНИЯ:

### **Правильный Flow:**

```javascript
// 1. Определить правильный Telegram ID
let telegramId = null;

// Priority 1: Из URL (если пришел из бота)
const urlParams = new URLSearchParams(window.location.search);
const urlTelegramId = urlParams.get('user_id');
if (urlTelegramId && /^\d+$/.test(urlTelegramId)) {
    telegramId = parseInt(urlTelegramId);
    console.log('✅ Using Telegram ID from URL:', telegramId);
}

// Priority 2: Из authState (если нет в URL)
if (!telegramId && window.authState?.telegramId) {
    telegramId = window.authState.telegramId;
    console.log('✅ Using Telegram ID from authState:', telegramId);
}

// 2. Проверить существующую связь
const existingLink = await checkWalletLink(walletAddress);
if (existingLink && existingLink.telegram_id !== telegramId) {
    // Кошелек уже связан с другим Telegram!
    showWarning('This wallet is already linked to another Telegram account');
    return;
}

// 3. Сохранить связь
await linkWalletToTelegram(walletAddress, telegramId);
```

---

## 📊 ВИЗУАЛЬНАЯ СХЕМА:

```
┌─────────────────────────────────────────────────────────┐
│              TELEGRAM USER (202140267)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ leaderboard                                       │   │
│  │ ├─ telegram_id: 202140267                       │   │
│  │ ├─ tama: 42705                                   │   │
│  │ └─ wallet_address: NULL (пока не связан)        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                    │
                    │ Подключает кошелек
                    ↓
┌─────────────────────────────────────────────────────────┐
│         WALLET (J2XcRxsXruvSUpee2YynQ1cb2UrbdfeUBETXNTJ3Ded5) │
│  ┌──────────────────────────────────────────────────┐   │
│  │ wallet_users                                     │   │
│  │ ├─ wallet_address: J2Xc...Ded5                   │   │
│  │ ├─ tama_balance: 0 (или существующий)           │   │
│  │ └─ telegram_id: NULL (пока не связан)            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                    │
                    │ СВЯЗЫВАНИЕ
                    ↓
┌─────────────────────────────────────────────────────────┐
│              🔗 LINKED ACCOUNT                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ leaderboard                                       │   │
│  │ ├─ telegram_id: 202140267                         │   │
│  │ ├─ tama: 42705                                    │   │
│  │ └─ wallet_address: J2Xc...Ded5  ✅                │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ wallet_users                                     │   │
│  │ ├─ wallet_address: J2Xc...Ded5                   │   │
│  │ ├─ tama_balance: 42705 (синхронизировано)        │   │
│  │ └─ telegram_id: 202140267  ✅                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 РЕКОМЕНДАЦИИ:

### **1. Исправить приоритет Telegram ID:**

```javascript
// В mint.html, функция loadTAMABalance() и connectWallet()

// Priority 1: URL (если пришел из бота)
const urlParams = new URLSearchParams(window.location.search);
const urlTelegramId = urlParams.get('user_id');
if (urlTelegramId && /^\d+$/.test(urlTelegramId)) {
    TELEGRAM_USER_ID = parseInt(urlTelegramId);
    console.log('✅ Using Telegram ID from URL:', TELEGRAM_USER_ID);
}
// Priority 2: authState
else if (window.authState?.telegramId) {
    TELEGRAM_USER_ID = window.authState.telegramId;
}
```

### **2. Добавить проверку существующей связи:**

```javascript
async function checkWalletLink(walletAddress) {
    const { data } = await supabase
        .from('leaderboard')
        .select('telegram_id, wallet_address')
        .eq('wallet_address', walletAddress)
        .single();
    
    return data;
}
```

### **3. Показывать статус связи:**

```javascript
// Показывать пользователю:
if (linked) {
    showNotification('info', 'Account Linked', 
        `Your wallet is linked to Telegram account ${telegramId}`);
}
```

---

## 📝 ИТОГО:

**Текущая система:**
- ✅ Автоматически сохраняет wallet_address в leaderboard
- ✅ Создает/обновляет wallet_users
- ⚠️ Может использовать неправильный Telegram ID
- ⚠️ Нет проверки существующих связей

**Что нужно улучшить:**
1. Использовать Telegram ID из URL (приоритет #1)
2. Проверять существующие связи перед сохранением
3. Показывать пользователю статус связи
4. Синхронизировать балансы автоматически

---

## 🔍 ПРОВЕРКА СВЯЗИ:

### **SQL запрос для проверки:**

```sql
-- Найти все связанные аккаунты
SELECT 
    l.telegram_id,
    l.telegram_username,
    l.wallet_address,
    l.tama,
    w.tama_balance,
    CASE 
        WHEN l.wallet_address IS NOT NULL AND w.telegram_id IS NOT NULL 
        THEN '✅ Linked'
        WHEN l.wallet_address IS NOT NULL 
        THEN '⚠️ Only in leaderboard'
        WHEN w.telegram_id IS NOT NULL 
        THEN '⚠️ Only in wallet_users'
        ELSE '❌ Not linked'
    END as link_status
FROM leaderboard l
FULL OUTER JOIN wallet_users w 
    ON l.wallet_address = w.wallet_address 
    OR l.telegram_id = w.telegram_id
WHERE l.wallet_address IS NOT NULL 
   OR w.telegram_id IS NOT NULL
ORDER BY l.telegram_id;
```

---

**Теперь понятно как работает связывание?** 🤔

