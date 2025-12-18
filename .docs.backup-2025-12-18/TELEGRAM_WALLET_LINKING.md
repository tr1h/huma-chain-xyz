# 🔗 Система связывания Telegram + Кошелёк

## Проблема

Пользователь начал играть в Telegram, затем хочет зайти через сайт и подключить кошелёк. Как система поймёт что это тот же пользователь?

---

## ✅ Решение: Account Linking (Связывание аккаунтов)

### Как это работает:

```
1. Пользователь играет в Telegram
   └─ Данные в таблице leaderboard (telegram_id = 123456789)

2. Пользователь открывает сайт
   └─ Подключает кошелёк (Eb4dBmBYR52M...)

3. Система предлагает: "Связать с Telegram аккаунтом?"
   └─ Пользователь подтверждает

4. ✅ Аккаунты связаны!
   ├─ leaderboard.linked_wallet = "Eb4dBmBYR52M..."
   └─ wallet_users.telegram_id = 123456789

5. Теперь пользователь может:
   ├─ Играть из Telegram → данные синхронизируются
   └─ Играть с сайта → данные синхронизируются
```

---

## 🗄️ Структура базы данных

### Таблица `leaderboard` (Telegram users)
```sql
ALTER TABLE leaderboard 
ADD COLUMN linked_wallet TEXT;
```

### Таблица `wallet_users` (Wallet users)
```sql
ALTER TABLE wallet_users 
ADD COLUMN telegram_id BIGINT;
```

### View `unified_users` (Объединённые данные)
```sql
SELECT * FROM unified_users;
```

Возвращает:
- `telegram_id` - ID в Telegram (если есть)
- `wallet_address` - адрес кошелька (если есть)
- `account_type` - тип аккаунта:
  - `telegram_only` - только Telegram
  - `wallet_only` - только кошелёк
  - `linked` - **связанный аккаунт** ✅

---

## 🔗 Процесс связывания

### Сценарий 1: Telegram → Кошелёк

```javascript
// 1. Пользователь в Telegram, открывает сайт
const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;

// 2. Подключает кошелёк на сайте
const walletAddress = await window.solana.connect();

// 3. Система проверяет: есть ли уже Telegram аккаунт?
const response = await fetch('https://api.solanatamagotchi.com/api/wallet-auth.php', {
    method: 'POST',
    body: JSON.stringify({
        action: 'link_accounts',
        telegram_id: telegramId,
        wallet_address: walletAddress.publicKey.toString()
    })
});

// 4. ✅ Аккаунты связаны, данные объединены!
```

### Сценарий 2: Кошелёк → Telegram

```javascript
// 1. Пользователь начал с сайта (подключил кошелёк)
const walletAddress = 'Eb4dBmBYR52M...';

// 2. Открыл Telegram Mini App
const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;

// 3. Система автоматически предлагает связать
if (hasExistingWalletAccount(walletAddress)) {
    showLinkPrompt(); // "Link with your web account?"
}

// 4. ✅ Аккаунты связаны!
```

---

## 🔄 Автоматическая синхронизация

После связывания, данные **автоматически синхронизируются**:

### Пример:

```sql
-- Пользователь играет в Telegram, заработал 1000 TAMA
UPDATE leaderboard SET balance = balance + 1000 WHERE telegram_id = 123456789;

-- ✅ Автоматически обновляется wallet_users (через trigger)
-- wallet_users.tama_balance также увеличится на 1000

-- Пользователь заходит с сайта - видит актуальный баланс!
```

---

## 📊 SQL функции

### 1. `link_telegram_with_wallet()` - Связать аккаунты

```sql
SELECT link_telegram_with_wallet(
    123456789, -- telegram_id
    'Eb4dBmBYR52MiJqKsQ2ayML2R4y23pUfRyxabtR2fdap' -- wallet_address
);
```

**Что делает:**
1. ✅ Проверяет что оба аккаунта существуют
2. ✅ Проверяет что не связаны с другими
3. ✅ Объединяет данные (берёт максимальные значения):
   - `tama_balance` = максимум из двух
   - `level` = максимум из двух
   - `clicks` = сумма
4. ✅ Сохраняет связь в обеих таблицах

### 2. `get_unified_user()` - Получить данные пользователя

```sql
-- По Telegram ID
SELECT get_unified_user(p_telegram_id := 123456789);

-- По wallet address
SELECT get_unified_user(p_wallet_address := 'Eb4dBmBYR52M...');
```

**Возвращает:**
```json
{
  "success": true,
  "user": {
    "telegram_id": "123456789",
    "wallet_address": "Eb4dBmBYR52M...",
    "user_id": "wallet_Eb4dBmBYR52M",
    "username": "Player",
    "tama_balance": 15000,
    "level": 10,
    "clicks": 5000,
    "account_type": "linked"
  }
}
```

---

## 🎮 UI Flow (как показать пользователю)

### Вариант 1: Автоматическое обнаружение

```javascript
// При подключении кошелька на сайте
async function onWalletConnected(walletAddress) {
    // Проверить: открыто ли из Telegram?
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    
    if (telegramId) {
        // Показать модалку
        showModal({
            title: '🔗 Link Accounts',
            text: 'Link your Telegram and Wallet accounts to play from both?',
            buttons: [
                { text: 'Link', onClick: () => linkAccounts(telegramId, walletAddress) },
                { text: 'Skip', onClick: () => closeModal() }
            ]
        });
    }
}
```

### Вариант 2: Ручная кнопка в настройках

```html
<!-- В профиле пользователя -->
<div class="account-settings">
    <h3>🔗 Account Linking</h3>
    
    <!-- Если только Telegram -->
    <div id="telegram-only">
        <p>✅ Telegram connected: @username</p>
        <p>❌ Wallet not connected</p>
        <button onclick="connectWallet()">Connect Wallet</button>
    </div>
    
    <!-- Если только кошелёк -->
    <div id="wallet-only">
        <p>❌ Telegram not connected</p>
        <p>✅ Wallet: Eb4dB...fdap</p>
        <button onclick="openTelegram()">Open in Telegram</button>
    </div>
    
    <!-- Если связано -->
    <div id="linked">
        <p>✅ Telegram: @username</p>
        <p>✅ Wallet: Eb4dB...fdap</p>
        <p>🎉 Accounts linked!</p>
    </div>
</div>
```

---

## ⚠️ Важные моменты

### 1. Безопасность

- ✅ Связывание возможно только **один раз**
- ✅ Нельзя связать с уже связанным аккаунтом
- ✅ Требуется подтверждение от обеих сторон

### 2. Объединение данных

При связывании используется логика:
- `tama_balance` = **максимум** из двух аккаунтов
- `level` = **максимум** из двух аккаунтов
- `clicks` = **сумма** из двух аккаунтов
- `game_state` = **объединение** (merge JSON)

### 3. Синхронизация

После связывания:
- ✅ Изменения в Telegram → автоматически в Wallet
- ✅ Изменения в Wallet → автоматически в Telegram
- ✅ Работает в реальном времени (через triggers)

---

## 🧪 Тестирование

### Создать тестовые аккаунты:

```sql
-- 1. Telegram user
INSERT INTO leaderboard (telegram_id, username, balance, level, clicks)
VALUES (123456789, 'Telegram Player', 5000, 5, 1000);

-- 2. Wallet user
INSERT INTO wallet_users (wallet_address, user_id, username, tama_balance, level, clicks)
VALUES ('Eb4dBmBYR52MiJqKsQ2ayML2R4y23pUfRyxabtR2fdap', 'wallet_Eb4dBmBYR52M', 'Wallet Player', 3000, 3, 500);

-- 3. Связать
SELECT link_telegram_with_wallet(123456789, 'Eb4dBmBYR52MiJqKsQ2ayML2R4y23pUfRyxabtR2fdap');

-- 4. Проверить результат
SELECT * FROM unified_users WHERE telegram_id = '123456789';
-- Должно показать:
-- tama_balance = 5000 (максимум)
-- level = 5 (максимум)
-- clicks = 1500 (сумма)
-- account_type = 'linked'
```

---

## 🎯 Итого

### До связывания:
```
Telegram User (123456789)     Wallet User (Eb4dB...)
├─ balance: 5000              ├─ tama_balance: 3000
├─ level: 5                   ├─ level: 3
└─ clicks: 1000               └─ clicks: 500
```

### После связывания:
```
Unified User
├─ telegram_id: 123456789
├─ wallet_address: Eb4dB...
├─ tama_balance: 5000 (max)
├─ level: 5 (max)
├─ clicks: 1500 (sum)
└─ account_type: linked ✅
```

### Результат:
- ✅ Один пользователь, два способа входа
- ✅ Единый прогресс
- ✅ Автоматическая синхронизация
- ✅ Можно играть откуда угодно

---

## 🚀 Установка

1. Выполни `sql/create-wallet-users-table.sql`
2. Выполни `sql/add-telegram-wallet-linking.sql`
3. Добавь обработку в API
4. Добавь UI для связывания
5. Готово! 🎉

