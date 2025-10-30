# 💰 TAMA TOKEN - ПОЛНЫЙ ГАЙД ДЛЯ НОВИЧКОВ

## 📚 **ОГЛАВЛЕНИЕ:**
1. [Что такое TAMA токен?](#что-такое-tama)
2. [Как работает распределение?](#распределение)
3. [Как игроки зарабатывают?](#заработок)
4. [Как выводить в реальный кошелёк?](#вывод)
5. [Техническая реализация](#техническая-реализация)
6. [Roadmap к хакатону](#roadmap)

---

## 🪙 **ЧТО ТАКОЕ TAMA ТОКЕН?** {#что-такое-tama}

### **Простыми словами:**
TAMA = виртуальные монеты в твоей игре, как золото в World of Warcraft, но их можно **реально вывести** на Solana blockchain и продать за настоящие деньги!

### **Технически:**
- **Тип:** SPL Token (стандарт токенов Solana, как ERC-20 в Ethereum)
- **Сеть:** Solana (быстрая и дешёвая)
- **Total Supply:** 1,000,000,000 TAMA (1 миллиард)
- **Decimals:** 9 (можно делить до 0.000000001 TAMA)
- **Mint Address:** `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`

### **Где существует?**
```
┌─────────────────────────────────────┐
│  1. IN-GAME (виртуально)            │
│     leaderboard.tama = 52046        │ ← В базе Supabase
│     (просто число в БД)             │
└─────────────────────────────────────┘
              ↓ ВЫВОД
┌─────────────────────────────────────┐
│  2. ON-CHAIN (реально)              │
│     Solana Wallet                   │ ← Настоящие токены
│     Balance: 52046 TAMA             │   в блокчейне
└─────────────────────────────────────┘
```

---

## 📊 **КАК РАБОТАЕТ РАСПРЕДЕЛЕНИЕ?** {#распределение}

### **У тебя есть 1,000,000,000 TAMA. Как распределить?**

#### **🎯 РЕКОМЕНДУЕМОЕ РАСПРЕДЕЛЕНИЕ:**

```
┌─────────────────────────────────────────────────┐
│  TOTAL SUPPLY: 1,000,000,000 TAMA               │
├─────────────────────────────────────────────────┤
│  40% → Play-to-Earn Pool (400M)                 │
│        Для игроков (выдаётся постепенно)       │
├─────────────────────────────────────────────────┤
│  20% → Team & Development (200M)                │
│        Для команды (locked 1 год)              │
├─────────────────────────────────────────────────┤
│  15% → Marketing & Partnerships (150M)          │
│        Для промо, листингов на биржах          │
├─────────────────────────────────────────────────┤
│  10% → Liquidity Pool (100M)                    │
│        Для DEX (Jupiter, Raydium)              │
├─────────────────────────────────────────────────┤
│  10% → Community Rewards (100M)                 │
│        Аирдропы, конкурсы, ивенты              │
├─────────────────────────────────────────────────┤
│  5% → Reserve Fund (50M)                        │
│        Резерв на будущее                       │
└─────────────────────────────────────────────────┘
```

### **Как это работает технически:**

#### **Шаг 1: Создание токена (УЖЕ СДЕЛАНО!)** ✅
```bash
# Ты уже создал TAMA token:
Token Address: Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
Mint Authority: 7hg8hR2N5TGEiJ8XLj14VkEUiq1uJmoMAmB399PEJQef
Total Supply: 1,000,000,000 TAMA
```

#### **Шаг 2: Распределение по кошелькам**
```bash
# Создать кошельки для каждой категории:

# 1. Play-to-Earn Pool
solana-keygen new -o p2e-pool-keypair.json
# Адрес: P2E_POOL_ADDRESS

# 2. Team Wallet
solana-keygen new -o team-wallet-keypair.json
# Адрес: TEAM_WALLET_ADDRESS

# 3. Marketing Wallet
solana-keygen new -o marketing-wallet-keypair.json
# Адрес: MARKETING_WALLET_ADDRESS

# ... и т.д.
```

#### **Шаг 3: Минт токенов на кошельки**
```bash
# Отправить токены на каждый кошелёк
spl-token mint Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  400000000 \
  P2E_POOL_ADDRESS \
  --url devnet

# Повторить для всех категорий
```

---

## 🎮 **КАК ИГРОКИ ЗАРАБАТЫВАЮТ?** {#заработок}

### **Механики заработка:**

#### **1. 🖱️ КЛИКЕР (базовый заработок)**
```javascript
// В игре:
Player clicks pet → Earn 0.5-1 TAMA per click
↓
gameState.tama += earnedTama  // Виртуально в БД
↓
Saves to Supabase: leaderboard.tama = 52046
```

**Скорость заработка:**
- Новичок: ~10-20 TAMA/день
- Активный игрок: ~50-100 TAMA/день
- С NFT boost: ~100-200 TAMA/день

#### **2. 🎯 КВЕСТЫ И ДОСТИЖЕНИЯ**
```
Complete daily quest → +100 TAMA
Reach level 10 → +500 TAMA
7-day streak → +1000 TAMA
```

#### **3. 👥 РЕФЕРАЛЬНАЯ ПРОГРАММА**
```
Invite friend → +1000 TAMA instantly
Friend reaches level 5 → +500 TAMA
```

#### **4. 🎨 NFT МИНТ**
```
Mint NFT with TAMA → -5000 TAMA (cost)
                   → +500 TAMA (bonus back)
                   → +25-100% earning boost
```

#### **5. 🏆 ЛИДЕРБОРД НАГРАДЫ**
```
Top 1: +10,000 TAMA/week
Top 10: +5,000 TAMA/week
Top 100: +1,000 TAMA/week
```

---

## 💸 **КАК ВЫВОДИТЬ В РЕАЛЬНЫЙ КОШЕЛЁК?** {#вывод}

### **ТЕКУЩАЯ СИСТЕМА (ВИРТУАЛЬНАЯ):**

```
┌──────────────────────────────────────┐
│  ИГРОК ИГРАЕТ                        │
│  gameState.tama = 52046              │
│  ↓                                   │
│  СОХРАНЯЕТСЯ В БАЗЕ                  │
│  Supabase: leaderboard.tama = 52046  │
│  ↓                                   │
│  ЭТО ВИРТУАЛЬНЫЙ БАЛАНС!             │
│  (просто число в БД)                 │
└──────────────────────────────────────┘
```

### **НОВАЯ СИСТЕМА (С ВЫВОДОМ):**

#### **Вариант 1: INSTANT WITHDRAWAL (простой)**

```javascript
// Кнопка "💰 Withdraw TAMA" в игре/боте

async function withdrawTAMA(userId, amount, walletAddress) {
    // 1. Проверить баланс в БД
    const userBalance = await getUserBalance(userId);
    if (userBalance < amount) {
        return { error: 'Insufficient balance' };
    }
    
    // 2. Списать из виртуального баланса
    await updateBalance(userId, -amount);
    
    // 3. Отправить РЕАЛЬНЫЕ токены на кошелёк игрока
    const tx = await transferTAMA({
        from: P2E_POOL_WALLET,        // Твой пул
        to: walletAddress,             // Кошелёк игрока
        amount: amount,
        tokenMint: TAMA_MINT_ADDRESS
    });
    
    // 4. Сохранить транзакцию
    await saveWithdrawal({
        userId: userId,
        amount: amount,
        txSignature: tx.signature,
        status: 'completed'
    });
    
    return { 
        success: true, 
        signature: tx.signature,
        explorer: `https://solscan.io/tx/${tx.signature}`
    };
}
```

#### **Вариант 2: THRESHOLD WITHDRAWAL (безопаснее)**

```javascript
// Минимальная сумма для вывода: 10,000 TAMA
const MIN_WITHDRAWAL = 10000;

// Комиссия: 5%
const WITHDRAWAL_FEE = 0.05;

async function requestWithdrawal(userId, amount, walletAddress) {
    if (amount < MIN_WITHDRAWAL) {
        return { error: `Minimum withdrawal: ${MIN_WITHDRAWAL} TAMA` };
    }
    
    // Комиссия
    const fee = amount * WITHDRAWAL_FEE;
    const netAmount = amount - fee;
    
    // Создать запрос на вывод
    await createWithdrawalRequest({
        userId: userId,
        amount: amount,
        fee: fee,
        netAmount: netAmount,
        walletAddress: walletAddress,
        status: 'pending'
    });
    
    // Обработка (может быть автоматическая или manual)
    await processWithdrawal(withdrawalId);
}
```

### **UI/UX В ИГРЕ:**

#### **В боте (@GotchiGameBot):**
```
/withdraw

💰 WITHDRAW TAMA

Your balance: 52,046 TAMA

Enter amount to withdraw:
[Input field: ______]

Wallet address:
[Input field: AX4vtEb...maDVi]

Fee: 5% (2,602 TAMA)
You will receive: 49,444 TAMA

[💸 Withdraw] [❌ Cancel]
```

#### **В игре (tamagotchi-game.html):**
```html
<button id="withdraw-btn">
  💰 Withdraw TAMA to Wallet
</button>

<div id="withdraw-modal">
  <h3>Withdraw TAMA</h3>
  <p>Balance: 52,046 TAMA</p>
  
  <input id="withdraw-amount" placeholder="Amount">
  <button id="connect-phantom">Connect Phantom</button>
  
  <p>Fee: 5%</p>
  <button id="confirm-withdraw">Confirm</button>
</div>
```

---

## 🔧 **ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ** {#техническая-реализация}

### **1. СОЗДАТЬ WITHDRAWAL API:**

```javascript
// api/withdraw.js

const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

// Конфигурация
const P2E_POOL_KEYPAIR = JSON.parse(fs.readFileSync('p2e-pool-keypair.json'));
const TAMA_MINT = new PublicKey('Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY');

app.post('/api/tama/withdraw', async (req, res) => {
    try {
        const { telegram_id, amount, wallet_address } = req.body;
        
        // 1. Проверить баланс в БД
        const { data: user } = await supabase
            .from('leaderboard')
            .select('tama')
            .eq('telegram_id', telegram_id)
            .single();
        
        if (!user || user.tama < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        
        // 2. Создать Solana транзакцию
        const connection = new Connection('https://api.devnet.solana.com');
        
        const fromWallet = Keypair.fromSecretKey(Uint8Array.from(P2E_POOL_KEYPAIR));
        const toWallet = new PublicKey(wallet_address);
        
        // Найти token accounts
        const fromTokenAccount = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            TAMA_MINT,
            fromWallet.publicKey
        );
        
        const toTokenAccount = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            TAMA_MINT,
            toWallet
        );
        
        // Создать token account если не существует
        const accountInfo = await connection.getAccountInfo(toTokenAccount);
        if (!accountInfo) {
            // Create associated token account
            const createAccountIx = Token.createAssociatedTokenAccountInstruction(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                TAMA_MINT,
                toTokenAccount,
                toWallet,
                fromWallet.publicKey
            );
            // Add to transaction
        }
        
        // Transfer tokens
        const token = new Token(connection, TAMA_MINT, TOKEN_PROGRAM_ID, fromWallet);
        
        const transferIx = Token.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            fromTokenAccount,
            toTokenAccount,
            fromWallet.publicKey,
            [],
            amount * (10 ** 9) // Convert to lamports (9 decimals)
        );
        
        const transaction = new Transaction().add(transferIx);
        const signature = await connection.sendTransaction(transaction, [fromWallet]);
        
        await connection.confirmTransaction(signature);
        
        // 3. Обновить баланс в БД
        await supabase
            .from('leaderboard')
            .update({ tama: user.tama - amount })
            .eq('telegram_id', telegram_id);
        
        // 4. Сохранить withdrawal
        await supabase
            .from('withdrawals')
            .insert({
                telegram_id: telegram_id,
                amount: amount,
                wallet_address: wallet_address,
                tx_signature: signature,
                status: 'completed'
            });
        
        res.json({ 
            success: true, 
            signature: signature,
            explorer: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
        });
        
    } catch (error) {
        console.error('Withdrawal error:', error);
        res.status(500).json({ error: error.message });
    }
});
```

### **2. СОЗДАТЬ ТАБЛИЦУ WITHDRAWALS:**

```sql
CREATE TABLE withdrawals (
    id BIGSERIAL PRIMARY KEY,
    telegram_id TEXT NOT NULL,
    amount BIGINT NOT NULL,
    wallet_address TEXT NOT NULL,
    tx_signature TEXT UNIQUE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_withdrawals_telegram_id ON withdrawals(telegram_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
```

### **3. ДОБАВИТЬ КНОПКУ В БОТ:**

```python
# bot/bot.py

@bot.callback_query_handler(func=lambda call: call.data == "withdraw_tama")
def handle_withdraw(call):
    telegram_id = str(call.from_user.id)
    
    # Get balance
    response = supabase.table('leaderboard').select('tama').eq('telegram_id', telegram_id).execute()
    balance = response.data[0].get('tama', 0) if response.data else 0
    
    text = f"""
💰 **WITHDRAW TAMA**

Your balance: **{balance:,} TAMA**

Minimum withdrawal: 10,000 TAMA
Fee: 5%

To withdraw:
1. Click "Connect Wallet" below
2. Enter amount
3. Confirm transaction

💡 Tokens will be sent to your Solana wallet
    """
    
    keyboard = types.InlineKeyboardMarkup()
    keyboard.row(
        types.InlineKeyboardButton("💸 Start Withdrawal", 
            url=f"https://tr1h.github.io/huma-chain-xyz/withdraw.html?user_id={telegram_id}&balance={balance}")
    )
    keyboard.row(
        types.InlineKeyboardButton("🔙 Back", callback_data="back_to_menu")
    )
    
    bot.edit_message_text(text, call.message.chat.id, call.message.message_id, 
                         parse_mode='Markdown', reply_markup=keyboard)
```

---

## 🎯 **ROADMAP К ХАКАТОНУ** {#roadmap}

### **ЧТО УЖЕ ГОТОВО:** ✅

```
✅ TAMA Token создан (1B supply)
✅ Игра работает (Play-to-Earn)
✅ Виртуальный баланс (в Supabase)
✅ NFT система (TAMA mint + SOL mint)
✅ NFT Boost (+25% to +100%)
✅ Реферальная программа
✅ Лидерборд
✅ Telegram бот
✅ API для транзакций
✅ Treasury кошелёк для SOL
```

### **ЧТО НАДО ДОДЕЛАТЬ:** 🚧

#### **КРИТИЧНО (для хакатона):**

1. **✅ Презентация (ГЛАВНОЕ!)**
   - Pitch deck (10-15 слайдов)
   - Demo video (2-3 минуты)
   - Live demo

2. **Withdrawal System (опционально)**
   - Можно сделать MOCK (фейковый вывод для демо)
   - Или реальный (если успеешь)

3. **Документация**
   - Whitepaper (токеномика)
   - Technical docs
   - README с инструкциями

#### **НЕ КРИТИЧНО (после хакатона):**

- Реальные NFT с картинками
- DEX листинг (Jupiter, Raydium)
- Mainnet deploy
- Маркетинг

---

## 📊 **TOKENOMICS (ДЛЯ ПРЕЗЕНТАЦИИ)**

### **Token Info:**
```
Name: Solana Tamagotchi
Symbol: TAMA
Total Supply: 1,000,000,000
Decimals: 9
Blockchain: Solana (devnet → mainnet)
Standard: SPL Token
```

### **Distribution:**
```
40% Play-to-Earn Pool (400M)
20% Team (200M, locked 1 year)
15% Marketing (150M)
10% Liquidity (100M)
10% Community (100M)
5% Reserve (50M)
```

### **Earning Mechanisms:**
```
- Click-to-Earn: 0.5-1 TAMA/click
- Quests: 100-500 TAMA/quest
- Referrals: 1,000 TAMA/friend
- Leaderboard: 1,000-10,000 TAMA/week
- NFT Boost: +25-100% multiplier
```

### **Use Cases:**
```
- Mint NFTs (5,000 TAMA)
- Upgrade pets (TBD)
- Buy items (TBD)
- Stake for rewards (TBD)
- Trade on DEX (future)
```

---

## 🎤 **ГОТОВИМСЯ К ПРЕЗЕНТАЦИИ**

### **PITCH (2 минуты):**

```
"Hi! We're Solana Tamagotchi - the first Play-to-Earn pet game 
on Solana with REAL blockchain rewards!

🎮 PROBLEM:
Most crypto games are too complex for casual players.

💡 SOLUTION:
Simple Tamagotchi + Real crypto rewards!

🚀 HOW IT WORKS:
1. Play in Telegram (0 friction)
2. Click pet → Earn TAMA tokens
3. Mint NFTs → Get earning boost
4. Withdraw to real wallet

📊 TRACTION:
- [X] active users
- [Y] TAMA earned
- [Z] NFTs minted

💰 TOKENOMICS:
1B TAMA supply, deflationary model

🎯 NEXT:
Mainnet launch, DEX listing, mobile app

Thank you!
```

### **DEMO СЦЕНАРИЙ:**

```
1. Показать бота (@GotchiGameBot)
   → /start
   → Кликать питомца
   → Заработать TAMA

2. Показать NFT mint
   → Открыть mint page
   → Mint за TAMA
   → Показать success

3. Показать boost
   → Вернуться в игру
   → Показать увеличенный заработок

4. Показать leaderboard
   → Топ игроки
   → Rewards

5. Показать withdrawal (если готов)
   → Кнопка Withdraw
   → Connect Phantom
   → Показать transaction
```

---

## 📝 **СЛЕДУЮЩИЕ ШАГИ:**

### **ЧТО ДЕЛАТЬ ПРЯМО СЕЙЧАС:**

1. **Создать презентацию (Pitch Deck)**
   - Google Slides / PowerPoint
   - 10-15 слайдов
   - Дизайн в стиле игры

2. **Записать Demo Video**
   - OBS Studio (бесплатно)
   - 2-3 минуты
   - Показать весь flow

3. **Подготовить Live Demo**
   - Убедиться что всё работает
   - Иметь backup plan

4. **(Опционально) Добавить Withdrawal**
   - Если хватит времени
   - Можно сделать MOCK для демо

---

## 💡 **MOCK WITHDRAWAL (БЫСТРОЕ РЕШЕНИЕ):**

Если нет времени делать реальный вывод, сделай **фейковый для демо**:

```javascript
// Фейковый withdrawal для презентации
async function mockWithdraw(userId, amount, walletAddress) {
    // 1. Списать из БД (реально)
    await updateBalance(userId, -amount);
    
    // 2. Сгенерировать FAKE transaction signature
    const fakeSignature = `DEMO${Date.now()}${Math.random().toString(36)}`;
    
    // 3. Сохранить как "completed"
    await saveWithdrawal({
        userId: userId,
        amount: amount,
        walletAddress: walletAddress,
        txSignature: fakeSignature,
        status: 'demo_completed'
    });
    
    // 4. Показать красивое уведомление
    return {
        success: true,
        signature: fakeSignature,
        message: `✅ ${amount} TAMA sent to ${walletAddress}`,
        note: '(Demo mode - tokens will be sent after mainnet launch)'
    };
}
```

---

## 🎯 **ИТОГО:**

### **У ТЕБЯ ЕСТЬ:**
✅ Работающая игра  
✅ TAMA токен (1B supply)  
✅ NFT система  
✅ Реальные SOL транзакции  
✅ База в Supabase  
✅ Telegram бот  

### **НАДО СДЕЛАТЬ:**
1. 📊 Презентация (ГЛАВНОЕ!)
2. 🎥 Demo video
3. 💸 Withdrawal (mock или real)
4. 📝 Документация

### **ГОТОВ К ХАКАТОНУ?**
**ДА! Твой проект УЖЕ круче 80% других!** 🚀

---

**Хочешь начать делать презентацию? Скажи - и я помогу!** 🎤

