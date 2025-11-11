# 🔐 МУЛЬТИ-СИГ (MULTI-SIGNATURE) - КАК РАБОТАЕТ НА ПРАКТИКЕ

## 🎯 ЧТО ЭТО ТАКОЕ?

**Мульти-сиг** = Требуется **несколько подписей** для выполнения транзакции.

### Пример:
```
Обычная транзакция:
✅ 1 подпись → транзакция выполняется

Мульти-сиг (2 из 3):
✅ 2 подписи из 3 → транзакция выполняется
❌ 1 подпись → транзакция НЕ выполняется
```

---

## 📊 КАК ЭТО РАБОТАЕТ В SOLANA

### 1. Создание Multi-Sig аккаунта:

```bash
# Создать 3 ключа
solana-keygen new --outfile key1.json
solana-keygen new --outfile key2.json
solana-keygen new --outfile key3.json

# Создать multi-sig аккаунт (2 из 3)
spl-token create-multisig \
  $(solana-keygen pubkey key1.json) \
  $(solana-keygen pubkey key2.json) \
  $(solana-keygen pubkey key3.json) \
  --threshold 2

# Output:
# Creating multisig account: ABC123...xyz
# Multi-sig address: ABC123...xyz
```

### 2. Структура Multi-Sig:

```
┌─────────────────────────────────────────┐
│  MULTI-SIG ACCOUNT (ABC123...xyz)        │
│                                          │
│  Правило: 2 из 3 подписей                │
│                                          │
│  Ключи:                                  │
│  ├─ Key 1: Team Lead (холодный)         │
│  ├─ Key 2: Backend Server (горячий)     │
│  └─ Key 3: Security Officer (холодный)  │
│                                          │
│  Баланс: 1,000,000 TAMA                  │
└─────────────────────────────────────────┘
```

---

## 🔄 ПРОЦЕСС ОТПРАВКИ ТРАНЗАКЦИИ

### ШАГ 1: Создание транзакции

```javascript
// Backend Server (Key 2) создаёт транзакцию
const transaction = new Transaction().add(
  createTransferInstruction(
    fromAccount,
    toAccount,
    multisigAddress,  // ← Multi-sig как owner
    amount
  )
);

// Transaction создана, но НЕ подписана
// Сохраняем в базу данных (pending)
await savePendingTransaction({
  transaction: transaction.serialize(),
  amount: 1000000,
  to: recipientAddress,
  status: 'pending',
  required_signatures: 2,
  current_signatures: 0
});
```

### ШАГ 2: Первая подпись (Backend Server)

```javascript
// Backend Server (Key 2) подписывает
const keypair2 = loadKeypair('key2.json');
transaction.partialSign(keypair2);

// Сохраняем частично подписанную транзакцию
await updatePendingTransaction({
  transaction_id: txId,
  current_signatures: 1,
  signature1: signature1
});

// Статус: "Ожидает вторую подпись"
```

### ШАГ 3: Уведомление других подписантов

```javascript
// Отправляем уведомление Team Lead (Key 1) и Security Officer (Key 3)
await sendNotification({
  to: ['team-lead@example.com', 'security@example.com'],
  message: `Требуется подпись для транзакции:
    Сумма: 1,000,000 TAMA
    Получатель: ABC123...
    Статус: 1/2 подписей
    Ссылка: https://wallet-admin.html?tx=${txId}`
});
```

### ШАГ 4: Вторая подпись (Team Lead)

```javascript
// Team Lead открывает wallet-admin.html
// Видит pending транзакцию
// Проверяет детали
// Подписывает (Key 1)

const keypair1 = loadKeypair('key1.json');
transaction.partialSign(keypair1);

// Теперь 2 подписи! ✅
await updatePendingTransaction({
  transaction_id: txId,
  current_signatures: 2,
  signature2: signature2,
  status: 'ready_to_send'
});
```

### ШАГ 5: Отправка транзакции

```javascript
// Backend автоматически отправляет когда есть 2 подписи
if (current_signatures >= required_signatures) {
  const signature = await connection.sendRawTransaction(
    transaction.serialize()
  );
  
  await updatePendingTransaction({
    transaction_id: txId,
    status: 'completed',
    blockchain_signature: signature
  });
}
```

---

## 💼 ПРАКТИЧЕСКИЙ ПРИМЕР ДЛЯ ТВОЕГО ПРОЕКТА

### Сценарий: Отправка 100,000 TAMA из Treasury

```
┌─────────────────────────────────────────────────┐
│  TREASURY WALLET (Multi-Sig: 2 из 3)            │
│  Баланс: 10,000,000 TAMA                         │
│                                                  │
│  Ключи:                                          │
│  ├─ Key 1: Ты (холодный кошелёк)                │
│  ├─ Key 2: API Server (горячий кошелёк)         │
│  └─ Key 3: Твой партнёр (холодный кошелёк)     │
└─────────────────────────────────────────────────┘
```

### Процесс:

#### 1. Ты создаёшь транзакцию в wallet-admin.html:

```javascript
// wallet-admin.html
async function createMultisigTransaction(amount, to) {
  // Создаём транзакцию
  const transaction = new Transaction().add(
    createTransferInstruction(
      treasuryAccount,
      recipientAccount,
      multisigAddress,
      amount
    )
  );
  
  // Подписываем своей подписью (Key 1)
  const keypair1 = await loadKeypairFromFile('key1.json');
  transaction.partialSign(keypair1);
  
  // Отправляем на сервер (pending)
  await fetch('/api/multisig/create', {
    method: 'POST',
    body: JSON.stringify({
      transaction: transaction.serialize().toString('base64'),
      amount: amount,
      to: to,
      signature1: transaction.signatures[0].signature
    })
  });
  
  alert('✅ Транзакция создана! Ожидает вторую подпись...');
}
```

#### 2. API Server получает и сохраняет:

```php
// api/multisig/create.php
$transaction = base64_decode($_POST['transaction']);
$amount = $_POST['amount'];
$to = $_POST['to'];
$signature1 = $_POST['signature1'];

// Сохраняем в базу данных
$stmt = $pdo->prepare("
  INSERT INTO pending_multisig_transactions 
  (transaction_data, amount, recipient, signature1, status, created_at)
  VALUES (?, ?, ?, ?, 'pending', NOW())
");

$stmt->execute([
  $transaction,
  $amount,
  $to,
  $signature1
]);

// Отправляем уведомление партнёру
sendEmail('partner@example.com', 'Требуется подпись', ...);
```

#### 3. Партнёр открывает wallet-admin.html:

```javascript
// wallet-admin.html показывает pending транзакции
async function loadPendingTransactions() {
  const response = await fetch('/api/multisig/pending');
  const transactions = await response.json();
  
  // Показываем список
  transactions.forEach(tx => {
    displayPendingTransaction({
      id: tx.id,
      amount: tx.amount,
      to: tx.recipient,
      status: `${tx.current_signatures}/${tx.required_signatures} подписей`,
      canSign: tx.current_signatures < tx.required_signatures
    });
  });
}

// Партнёр нажимает "Подписать"
async function signPendingTransaction(txId) {
  // Загружаем транзакцию
  const tx = await fetch(`/api/multisig/get/${txId}`);
  const transaction = Transaction.from(base64_decode(tx.transaction_data));
  
  // Подписываем (Key 3)
  const keypair3 = await loadKeypairFromFile('key3.json');
  transaction.partialSign(keypair3);
  
  // Отправляем подпись на сервер
  await fetch('/api/multisig/sign', {
    method: 'POST',
    body: JSON.stringify({
      transaction_id: txId,
      signature2: transaction.signatures[1].signature,
      transaction: transaction.serialize().toString('base64')
    })
  });
}
```

#### 4. API Server автоматически отправляет:

```php
// api/multisig/sign.php
$txId = $_POST['transaction_id'];
$signature2 = $_POST['signature2'];
$transaction = base64_decode($_POST['transaction']);

// Обновляем транзакцию
$stmt = $pdo->prepare("
  UPDATE pending_multisig_transactions 
  SET signature2 = ?, 
      current_signatures = 2,
      status = 'ready_to_send'
  WHERE id = ?
");
$stmt->execute([$signature2, $txId]);

// Проверяем: есть ли 2 подписи?
$tx = $pdo->query("SELECT * FROM pending_multisig_transactions WHERE id = $txId")->fetch();

if ($tx['current_signatures'] >= $tx['required_signatures']) {
  // ✅ Отправляем в блокчейн!
  $connection = new Connection('https://api.devnet.solana.com');
  $signature = $connection->sendRawTransaction($transaction);
  
  // Обновляем статус
  $pdo->prepare("
    UPDATE pending_multisig_transactions 
    SET status = 'completed', 
        blockchain_signature = ?
    WHERE id = ?
  ")->execute([$signature, $txId]);
  
  echo json_encode(['success' => true, 'signature' => $signature]);
}
```

---

## 🎯 ПРАКТИЧЕСКИЕ ПРИМЕНЕНИЯ

### 1. Большие транзакции (> 100,000 TAMA):

```
✅ Требуется 2 подписи
✅ Защита от ошибок
✅ Защита от взлома
```

### 2. Treasury операции:

```
✅ Все операции из Treasury = Multi-Sig
✅ Нужны 2 из 3 подписей
✅ Максимальная безопасность
```

### 3. Mint Authority:

```
✅ Минт токенов = Multi-Sig
✅ Нужны 2 из 3 подписей
✅ Защита от неконтролируемого минта
```

---

## 📋 БАЗА ДАННЫХ ДЛЯ PENDING ТРАНЗАКЦИЙ

```sql
CREATE TABLE pending_multisig_transactions (
  id SERIAL PRIMARY KEY,
  transaction_data TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  recipient VARCHAR(44) NOT NULL,
  required_signatures INT DEFAULT 2,
  current_signatures INT DEFAULT 0,
  signature1 TEXT,
  signature2 TEXT,
  signature3 TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  blockchain_signature VARCHAR(88),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

---

## 🔒 БЕЗОПАСНОСТЬ

### Преимущества:

```
✅ Компрометация 1 ключа ≠ потеря средств
✅ Нужны 2 подписи для транзакции
✅ Защита от ошибок (двойная проверка)
✅ Прозрачность (все видят pending транзакции)
```

### Ограничения:

```
⚠️ Сложнее настроить
⚠️ Нужны несколько доверенных лиц
⚠️ Медленнее (нужно ждать подписей)
```

---

## 🚀 КАК ДОБАВИТЬ В WALLET-ADMIN.HTML

### 1. Добавить секцию "Pending Transactions":

```html
<div class="pending-transactions">
  <h2>⏳ Pending Multi-Sig Transactions</h2>
  <div id="pendingList">
    <!-- Список pending транзакций -->
  </div>
</div>
```

### 2. Функция загрузки pending:

```javascript
async function loadPendingTransactions() {
  const response = await fetch('/api/multisig/pending');
  const transactions = await response.json();
  
  transactions.forEach(tx => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p>Amount: ${tx.amount} TAMA</p>
      <p>To: ${tx.recipient}</p>
      <p>Signatures: ${tx.current_signatures}/${tx.required_signatures}</p>
      <button onclick="signTransaction(${tx.id})">
        ✍️ Sign Transaction
      </button>
    `;
    document.getElementById('pendingList').appendChild(div);
  });
}
```

### 3. Функция подписи:

```javascript
async function signTransaction(txId) {
  // Загружаем транзакцию
  const tx = await fetch(`/api/multisig/get/${txId}`);
  const data = await tx.json();
  
  // Десериализуем транзакцию
  const transaction = Transaction.from(
    Buffer.from(data.transaction_data, 'base64')
  );
  
  // Загружаем keypair
  const keypair = await loadKeypairFromFile('key1.json');
  
  // Подписываем
  transaction.partialSign(keypair);
  
  // Отправляем подпись
  await fetch('/api/multisig/sign', {
    method: 'POST',
    body: JSON.stringify({
      transaction_id: txId,
      signature: transaction.signatures[0].signature,
      transaction: transaction.serialize().toString('base64')
    })
  });
  
  alert('✅ Подпись добавлена! Ожидает вторую подпись...');
}
```

---

## ✅ ИТОГ

**Мульти-сиг на практике:**

```
1. Создаёшь транзакцию → подписываешь (1/2)
2. Сохраняется в базу данных (pending)
3. Партнёр видит в wallet-admin.html
4. Партнёр подписывает (2/2)
5. API автоматически отправляет в блокчейн
6. ✅ Транзакция выполнена!
```

**Безопасность:**
- ✅ Нужны 2 подписи
- ✅ Компрометация 1 ключа не опасна
- ✅ Защита от ошибок
- ✅ Прозрачность

**Это стандартная практика для:**
- ✅ Treasury кошельков
- ✅ Больших транзакций
- ✅ Mint Authority
- ✅ Критических операций


