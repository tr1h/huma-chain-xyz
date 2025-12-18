# 💰 TOKENOMICS IMPLEMENTATION STATUS

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ

### ✅ ЧТО РАБОТАЕТ СЕЙЧАС:

#### 1. **Виртуальная Экономика (Database)**
- ✅ Пользователи зарабатывают TAMA в игре
- ✅ Баланс сохраняется в Supabase (`leaderboard` таблица)
- ✅ Реферальные награды начисляются
- ✅ Вывод (withdrawal) работает в DEMO режиме
- ✅ Транзакции записываются в `tama_economy` таблицу

**Это НЕ настоящие блокчейн токены!** Это просто цифры в базе данных.

#### 2. **Блокчейн Токен (Solana Devnet)**
- ✅ TAMA токен создан на Solana Devnet
- ✅ Mint authority настроена
- ✅ Supply управляется через `tama-mint-keypair.json`
- ✅ Token info: `tama-token-info.json`

**НО:** Токены НЕ распределены пользователям!

---

## ❌ ЧТО НЕ РАБОТАЕТ:

### 1. **Привязка Кошелька**
**Проблема:** Пользователи НЕ могут подключить Phantom кошелёк к игре.

**Где должно быть:**
- В игре (`tamagotchi-game.html`) - кнопка "Connect Wallet"
- В боте - команда `/wallet` для привязки адреса

**Что нужно:**
```javascript
// В игре добавить Phantom wallet integration
const connectWallet = async () => {
  if (window.solana && window.solana.isPhantom) {
    const response = await window.solana.connect();
    const walletAddress = response.publicKey.toString();
    
    // Отправить адрес в бот/API
    await saveWalletAddress(telegramUserId, walletAddress);
  }
}
```

**Текущее состояние таблицы `leaderboard`:**
```sql
-- Столбец wallet_address существует, но заполнен placeholder'ами:
wallet_address: "telegram_7401131043"  -- НЕ реальный SOL адрес!
```

---

### 2. **Распределение Токенов**
**Проблема:** TAMA токены НЕ отправлены на кошельки пользователей.

**Текущая ситуация:**
- Игровой баланс: 52,046 TAMA (в базе данных)
- Блокчейн баланс: 0 TAMA (на кошельке пользователя)

**Что нужно для реального распределения:**

#### A. Airdrop System (Auto):
```javascript
// Когда пользователь достигает 10,000 TAMA в игре
async function airdropTAMA(userWalletAddress, amount) {
  const connection = new Connection(SOLANA_RPC_URL);
  const mintKeypair = loadKeypair('tama-mint-keypair.json');
  const payerKeypair = loadKeypair('payer-keypair.json');
  
  // 1. Создать Associated Token Account если нет
  const userATA = await getOrCreateAssociatedTokenAccount(
    connection,
    payerKeypair,
    TAMA_MINT_ADDRESS,
    new PublicKey(userWalletAddress)
  );
  
  // 2. Mint TAMA токены на ATA пользователя
  await mintTo(
    connection,
    payerKeypair,
    TAMA_MINT_ADDRESS,
    userATA.address,
    mintKeypair,
    amount * 1_000_000_000 // Decimals = 9
  );
  
  // 3. Обновить статус в базе
  await supabase.table('leaderboard').update({
    blockchain_balance: amount,
    last_airdrop_date: new Date()
  }).eq('telegram_id', telegramUserId);
}
```

#### B. Manual Claim System:
```javascript
// Пользователь вручную запрашивает перевод из игры на кошелёк
// Команда /claim в боте
async function claimTAMA(telegramUserId) {
  // 1. Проверить игровой баланс
  const gameBalance = await getGameBalance(telegramUserId);
  
  // 2. Проверить wallet_address
  const walletAddress = await getWalletAddress(telegramUserId);
  
  if (!walletAddress || walletAddress.startsWith('telegram_')) {
    return "❌ Please connect your Phantom wallet first! Use /wallet";
  }
  
  if (gameBalance < 10000) {
    return "❌ Minimum claim: 10,000 TAMA";
  }
  
  // 3. Отправить TAMA на блокчейн
  await airdropTAMA(walletAddress, gameBalance);
  
  // 4. Обнулить игровой баланс (или оставить небольшой остаток)
  await resetGameBalance(telegramUserId);
  
  return `✅ Claimed ${gameBalance} TAMA to your wallet!`;
}
```

---

### 3. **Withdrawal (Вывод)**
**Текущее состояние:** MOCK/DEMO

**Как работает СЕЙЧАС:**
1. Пользователь нажимает `/withdraw`
2. Вводит сумму (например, 15000 TAMA)
3. Бот вычитает 5% fee
4. **УМЕНЬШАЕТ баланс в базе данных**
5. Генерирует fake transaction signature: `DEMO1730403827740113`
6. **НЕ отправляет реальные токены!**

**Как должно работать в ПРОДАКШЕНЕ:**
```python
# В bot.py - функция process_withdrawal_amount
async def process_withdrawal_real(telegram_id, amount, wallet_address):
    # 1. Проверки
    if not wallet_address or wallet_address.startswith('telegram_'):
        return "❌ Connect Phantom wallet first!"
    
    # 2. Вычислить fee
    fee = int(amount * 0.05)
    net_amount = amount - fee
    
    # 3. РЕАЛЬНАЯ ОТПРАВКА через Solana
    import subprocess
    import json
    
    result = subprocess.run([
        'spl-token', 'transfer',
        TAMA_MINT_ADDRESS,
        str(net_amount),
        wallet_address,
        '--fund-recipient',
        '--fee-payer', 'payer-keypair.json',
        '--owner', 'tama-mint-keypair.json',
        '--output', 'json'
    ], capture_output=True, text=True)
    
    tx_data = json.loads(result.stdout)
    real_signature = tx_data['signature']
    
    # 4. Обновить базу
    supabase.table('leaderboard').update({
        'tama': new_balance,
        'total_withdrawn': total_withdrawn + net_amount
    }).eq('telegram_id', telegram_id).execute()
    
    supabase.table('tama_economy').insert({
        'telegram_id': telegram_id,
        'transaction_type': 'withdrawal',
        'amount': -net_amount,
        'fee': fee,
        'signature': real_signature,
        'status': 'completed'
    }).execute()
    
    return f"✅ Withdrawn {net_amount:,} TAMA\n🔗 Signature: {real_signature}"
```

---

## 🔄 FLOW CHART - КАК ДОЛЖНО РАБОТАТЬ:

```
┌─────────────────────────────────────────────────────────────┐
│  1. ПОЛЬЗОВАТЕЛЬ РЕГИСТРИРУЕТСЯ                              │
│     └─> Бот создаёт запись в leaderboard                     │
│         wallet_address: "telegram_7401131043" (placeholder)  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  2. ПОЛЬЗОВАТЕЛЬ ИГРАЕТ                                      │
│     └─> Кликает по питомцу                                   │
│         └─> Баланс растёт в БАЗЕ ДАННЫХ (виртуальный)       │
│             Example: 1000 → 5000 → 10000 TAMA                │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  3. ПОЛЬЗОВАТЕЛЬ ПОДКЛЮЧАЕТ КОШЕЛЁК (НЕ РАБОТАЕТ СЕЙЧАС!)   │
│     └─> Открывает игру в браузере                            │
│         └─> Нажимает "Connect Phantom Wallet"                │
│             └─> Phantom popup → Approve                      │
│                 └─> Адрес: 8kX...abc (реальный SOL адрес)   │
│                     └─> Отправляется в API/Supabase          │
│                         └─> wallet_address: "8kX...abc"      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  4A. AUTO AIRDROP (Опция 1)                                  │
│      └─> Когда баланс достигает 10,000 TAMA                 │
│          └─> Backend автоматически mint'ит токены            │
│              └─> Отправляет на wallet_address пользователя   │
│                  └─> Обновляет blockchain_balance в базе     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  4B. MANUAL CLAIM (Опция 2 - лучше для контроля)            │
│      └─> Пользователь вводит /claim в боте                  │
│          └─> Бот проверяет:                                  │
│              • Есть ли wallet_address?                       │
│              • Достаточно ли баланса? (min 10,000)           │
│          └─> Mint TAMA на wallet_address                     │
│              └─> Обнулить/уменьшить игровой баланс           │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  5. WITHDRAWAL (НЕ РАБОТАЕТ РЕАЛЬНО СЕЙЧАС!)                 │
│     └─> Пользователь вводит /withdraw 15000                 │
│         └─> Бот:                                             │
│             • Проверяет баланс                               │
│             • Вычитает 5% fee (750 TAMA)                     │
│             • Отправляет 14,250 TAMA через spl-token CLI     │
│             • Возвращает transaction signature               │
│         └─> Пользователь получает токены на кошелёк          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 ЧТО НУЖНО РЕАЛИЗОВАТЬ:

### ПРИОРИТЕТ 1: Подключение Кошелька
**Файл:** `solana-tamagotchi/tamagotchi-game.html`

Добавить:
```html
<!-- В HTML -->
<button id="connect-wallet-btn" class="nav-btn">
  🔗 Connect Wallet
</button>
<div id="wallet-status" style="display:none;">
  Connected: <span id="wallet-address"></span>
</div>
```

```javascript
// В JS секции
async function connectWallet() {
  if (!window.solana || !window.solana.isPhantom) {
    alert('Please install Phantom Wallet!');
    window.open('https://phantom.app/', '_blank');
    return;
  }
  
  try {
    const response = await window.solana.connect();
    const walletAddress = response.publicKey.toString();
    
    // Показать адрес
    document.getElementById('wallet-address').textContent = 
      walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4);
    document.getElementById('wallet-status').style.display = 'block';
    document.getElementById('connect-wallet-btn').style.display = 'none';
    
    // Сохранить в Supabase
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (telegramUser) {
      await supabase
        .from('leaderboard')
        .update({ wallet_address: walletAddress })
        .eq('telegram_id', telegramUser.id.toString());
      
      alert('✅ Wallet connected successfully!');
    }
  } catch (err) {
    console.error('Error connecting wallet:', err);
    alert('❌ Failed to connect wallet');
  }
}

// Добавить обработчик
document.getElementById('connect-wallet-btn')
  .addEventListener('click', connectWallet);
```

---

### ПРИОРИТЕТ 2: Backend для Claim/Airdrop
**Файл:** Новый `solana-tamagotchi/api/airdrop_tama.php` или Node.js script

```javascript
// airdrop_tama.js
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { 
  getOrCreateAssociatedTokenAccount, 
  mintTo 
} = require('@solana/spl-token');
const fs = require('fs');

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;
const TAMA_MINT = new PublicKey('YOUR_TAMA_MINT_ADDRESS');

async function airdropTAMA(userWalletAddress, amount) {
  const connection = new Connection(SOLANA_RPC_URL);
  
  // Load keypairs
  const payerKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync('payer-keypair.json')))
  );
  const mintKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync('tama-mint-keypair.json')))
  );
  
  // Get or create user's token account
  const userATA = await getOrCreateAssociatedTokenAccount(
    connection,
    payerKeypair,
    TAMA_MINT,
    new PublicKey(userWalletAddress)
  );
  
  // Mint tokens
  const signature = await mintTo(
    connection,
    payerKeypair,
    TAMA_MINT,
    userATA.address,
    mintKeypair,
    amount * 1_000_000_000 // 9 decimals
  );
  
  return signature;
}

module.exports = { airdropTAMA };
```

---

### ПРИОРИТЕТ 3: Команда /claim в Боте
**Файл:** `solana-tamagotchi/bot/bot.py`

```python
@bot.message_handler(commands=['claim'])
def handle_claim_command(message):
    """Claim TAMA tokens to blockchain wallet"""
    telegram_id = str(message.from_user.id)
    
    try:
        # Get user data
        response = supabase.table('leaderboard').select('*').eq('telegram_id', telegram_id).execute()
        
        if not response.data:
            bot.reply_to(message, "❌ No account found. Play the game first!")
            return
        
        user = response.data[0]
        balance = user.get('tama', 0)
        wallet = user.get('wallet_address', None)
        
        # Check wallet
        if not wallet or wallet.startswith('telegram_'):
            bot.reply_to(message, 
                "❌ Connect your Phantom wallet first!\n\n"
                "Open the game and click 'Connect Wallet' button."
            )
            return
        
        # Check minimum
        if balance < 10000:
            bot.reply_to(message, 
                f"❌ Minimum claim: 10,000 TAMA\n"
                f"Your balance: {balance:,} TAMA\n\n"
                f"Keep playing to earn more!"
            )
            return
        
        # Call airdrop script
        import subprocess
        result = subprocess.run([
            'node', 'api/airdrop_tama.js',
            wallet,
            str(balance)
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            signature = result.stdout.strip()
            
            # Update database
            supabase.table('leaderboard').update({
                'tama': 0,  # Reset game balance
                'total_claimed': balance,
                'last_claim_date': 'now()'
            }).eq('telegram_id', telegram_id).execute()
            
            bot.reply_to(message,
                f"✅ *CLAIMED {balance:,} TAMA!*\n\n"
                f"Tokens sent to your wallet:\n"
                f"`{wallet[:8]}...{wallet[-8:]}`\n\n"
                f"🔗 Transaction:\n"
                f"[View on Solscan](https://solscan.io/tx/{signature}?cluster=devnet)",
                parse_mode='Markdown'
            )
        else:
            bot.reply_to(message, f"❌ Claim failed: {result.stderr}")
            
    except Exception as e:
        print(f"Error in claim: {e}")
        bot.reply_to(message, "❌ Error processing claim. Try again later.")
```

---

## 📝 SUMMARY:

| Feature | Status | Priority |
|---------|--------|----------|
| Виртуальный баланс (игра) | ✅ Работает | - |
| TAMA токен на блокчейне | ✅ Создан | - |
| Подключение кошелька | ❌ Не работает | 🔥 HIGH |
| Airdrop/Claim система | ❌ Не работает | 🔥 HIGH |
| Реальный withdrawal | ❌ Mock только | 🟡 MEDIUM |
| NFT minting | ✅ Работает | - |

---

## 🚀 ROADMAP:

### Phase 1 (Сейчас - Hackathon Demo):
- ✅ Mock withdrawal system
- ✅ Virtual economy в базе данных
- ✅ NFT minting готов

### Phase 2 (Post-Hackathon):
- ⏳ Connect Wallet функция
- ⏳ /claim команда для перевода в блокчейн
- ⏳ Airdrop backend

### Phase 3 (Mainnet Launch):
- ⏳ Реальный withdrawal через SPL Token
- ⏳ Миграция на Solana Mainnet
- ⏳ Liquidity pools для TAMA

---

**Последнее обновление:** 31 октября 2025  
**Версия:** 1.9.1

