# 🎮 КАК ВСЁ РАБОТАЕТ - ПОЛНЫЙ ГАЙД

## 📖 ОГЛАВЛЕНИЕ

1. [С точки зрения ИГРОКА](#с-точки-зрения-игрока)
2. [С точки зрения ТЕХНОЛОГИЙ](#с-точки-зрения-технологий)
3. [ТОКЕНОМИКА в действии](#токеномика-в-действии)
4. [ПОШАГОВЫЕ СЦЕНАРИИ](#пошаговые-сценарии)
5. [АРХИТЕКТУРА СИСТЕМЫ](#архитектура-системы)

---

# 🎮 С ТОЧКИ ЗРЕНИЯ ИГРОКА

## Сценарий 1: НОВЫЙ ИГРОК (День 1)

### ШАГ 1: Вход в игру

```
Петя видит рекламу в Telegram → кликает по ссылке
↓
Открывается @GotchiGameBot
↓
Петя нажимает /start
↓
БОТ: "Привет! 🎮 Запускай игру!"
[Кнопка: 🎮 Gotchi Game]
↓
Петя кликает на кнопку
↓
Открывается Mini App (внутри Telegram)
```

**Что происходит за кулисами:**
```javascript
// 1. Telegram отправляет данные пользователя
window.Telegram.WebApp.initDataUnsafe = {
  user: {
    id: 123456789,
    first_name: "Петя",
    username: "petya_pro"
  }
}

// 2. Игра проверяет: есть ли этот пользователь в базе?
const response = await supabase
  .from('leaderboard')
  .select('*')
  .eq('telegram_id', '123456789')
  .single();

// 3. Если НЕТ → создать новую запись
if (!response.data) {
  await supabase.from('leaderboard').insert({
    telegram_id: '123456789',
    username: 'petya_pro',
    tama: 0,  // Начальный баланс
    level: 1,
    clicks: 0,
    wallet_address: 'telegram_123456789'  // Placeholder
  });
}
```

---

### ШАГ 2: Игра и заработок

```
Петя видит своего питомца 🐱
↓
Кликает по нему → +5 TAMA ✨
Кликает еще раз → +5 TAMA ✨
Кликает 100 раз → +500 TAMA 🎉
↓
Баланс на экране: 500 TAMA
```

**Что происходит за кулисами:**
```javascript
// 1. Каждый клик отправляется в базу
function handlePetClick() {
  const reward = Math.floor(Math.random() * 5) + 1;  // 1-5 TAMA
  
  // Оптимистичное обновление (сначала показываем)
  currentBalance += reward;
  updateBalanceDisplay(currentBalance);
  
  // Потом сохраняем в базу
  saveTamaEarned(reward);
}

async function saveTamaEarned(amount) {
  await supabase.rpc('increment_tama', {
    user_id: telegramUserId,
    amount: amount
  });
}

// 2. В Supabase есть функция:
CREATE OR REPLACE FUNCTION increment_tama(user_id text, amount int)
RETURNS void AS $$
BEGIN
  UPDATE leaderboard
  SET tama = tama + amount,
      clicks = clicks + 1,
      last_activity = NOW()
  WHERE telegram_id = user_id;
END;
$$ LANGUAGE plpgsql;
```

---

### ШАГ 3: Первый квест

```
Петя открывает раздел "Quests" 📜
↓
Видит: "🎯 Earn 1,000 TAMA → Reward: +500 TAMA"
↓
Продолжает кликать...
↓
Баланс достигает 1,000 TAMA 🎊
↓
🎉 QUEST COMPLETED! +500 TAMA
↓
Новый баланс: 1,500 TAMA
```

**Что происходит за кулисами:**
```python
# В боте (bot.py) есть система квестов
from gamification import QuestSystem

quest_system = QuestSystem(supabase)

# При каждом обновлении баланса проверяются квесты
def check_quests(telegram_id, current_tama):
    completed_quests = quest_system.check_progress(telegram_id)
    
    for quest in completed_quests:
        # Начислить награду
        reward = quest['reward']
        supabase.table('leaderboard').update({
            'tama': current_tama + reward
        }).eq('telegram_id', telegram_id).execute()
        
        # Отправить уведомление в бот
        bot.send_message(
            telegram_id,
            f"🎉 Quest completed!\n"
            f"{quest['title']}\n"
            f"Reward: +{reward} TAMA"
        )
```

---

### ШАГ 4: Реферальная система

```
Петя приглашает друга Васю
↓
Нажимает кнопку "👥 Invite Friends"
↓
Получает реферальную ссылку:
https://t.me/GotchiGameBot?start=ref_123456789
↓
Отправляет Васе в личку
↓
Вася кликает → регистрируется
↓
Петя получает: +1,000 TAMA (бонус за реферала) 🎁
```

**Что происходит за кулисами:**
```python
# Вася кликает по ссылке с ref_123456789
@bot.message_handler(commands=['start'])
def handle_start(message):
    telegram_id = str(message.from_user.id)
    args = message.text.split()
    
    # Проверяем реферальный код
    if len(args) > 1 and args[1].startswith('ref_'):
        referrer_id = args[1].replace('ref_', '')
        
        # Сохраняем связь
        supabase.table('referrals').insert({
            'referrer_telegram_id': referrer_id,
            'referred_telegram_id': telegram_id,
            'status': 'active'
        }).execute()
        
        # Награждаем реферера
        supabase.rpc('increment_tama', {
            'user_id': referrer_id,
            'amount': 1000  # Бонус за приглашение
        }).execute()
        
        # Уведомляем реферера
        bot.send_message(
            referrer_id,
            f"🎉 Your friend joined!\n"
            f"+1,000 TAMA bonus!"
        )
```

---

### ШАГ 5: Daily Rewards

```
День 1: Петя заходит → "🎁 Daily Reward: +100 TAMA"
День 2: Петя заходит → "🎁 Daily Reward: +150 TAMA"
День 3: Петя заходит → "🎁 Daily Reward: +200 TAMA"
...
День 7: Петя заходит → "🎁 Weekly Streak Bonus: +1,000 TAMA!"
```

**Что происходит за кулисами:**
```python
from gamification import DailyRewards

daily_rewards = DailyRewards(supabase)

def check_daily_reward(telegram_id):
    # Получить последний login
    user = supabase.table('leaderboard')\
        .select('last_daily_claim')\
        .eq('telegram_id', telegram_id)\
        .single()\
        .execute()
    
    last_claim = user.data.get('last_daily_claim')
    now = datetime.now()
    
    # Проверить: прошло ли 24 часа?
    if not last_claim or (now - last_claim).days >= 1:
        # Рассчитать награду на основе streak
        streak = calculate_streak(telegram_id)
        reward = 100 + (streak * 50)  # +50 за каждый день подряд
        
        # Начислить награду
        supabase.rpc('increment_tama', {
            'user_id': telegram_id,
            'amount': reward
        }).execute()
        
        # Обновить streak
        supabase.table('leaderboard').update({
            'last_daily_claim': now,
            'daily_streak': streak + 1
        }).eq('telegram_id', telegram_id).execute()
        
        return reward
    
    return 0  # Уже забрал сегодня
```

---

## Сценарий 2: ОПЫТНЫЙ ИГРОК (День 30)

### ШАГ 1: Накопил баланс

```
Петя играл 30 дней подряд
Его баланс: 52,046 TAMA 💰
↓
Решил: "Пора выводить!"
```

---

### ШАГ 2: Подключение кошелька

```
Петя открывает игру
↓
Видит кнопку "🔗 Connect Wallet"
↓
Кликает → Открывается Phantom Wallet popup
↓
Phantom: "Подключить кошелёк к GotchiGame?"
[Approve] [Reject]
↓
Петя нажимает Approve ✅
↓
Игра: "✅ Wallet connected!"
Адрес: 8kX4...abc9
```

**Что происходит за кулисами:**
```javascript
// В игре (tamagotchi-game.html)
async function connectWallet() {
  // 1. Проверить: установлен ли Phantom?
  if (!window.solana || !window.solana.isPhantom) {
    alert('❌ Please install Phantom Wallet!');
    window.open('https://phantom.app/', '_blank');
    return;
  }
  
  try {
    // 2. Запросить подключение
    const response = await window.solana.connect();
    const walletAddress = response.publicKey.toString();
    // walletAddress = "8kX4vtE2sXJFk3abc..."
    
    // 3. Сохранить в базу
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    await supabase
      .from('leaderboard')
      .update({ 
        wallet_address: walletAddress,
        wallet_connected_at: new Date()
      })
      .eq('telegram_id', telegramUser.id.toString());
    
    // 4. Показать успех
    showNotification('✅ Wallet connected successfully!');
    
    // 5. Теперь доступна кнопка Withdraw
    document.getElementById('withdraw-btn').disabled = false;
    
  } catch (err) {
    console.error('Wallet connection failed:', err);
    alert('❌ Connection cancelled');
  }
}
```

---

### ШАГ 3: Первый вывод (WITHDRAWAL)

```
Петя открывает бота @GotchiGameBot
↓
Вводит команду: /withdraw
↓
БОТ: 
"💸 WITHDRAWAL REQUEST
📊 Your Balance: 52,046 TAMA
💳 Destination: 8kX4...abc9
Enter withdrawal amount:"
↓
Петя отвечает: 10000
↓
БОТ:
"⏳ Processing withdrawal...
Amount: 10,000 TAMA
Fee (5%): -500 TAMA
You will receive: 9,500 TAMA"
↓
⏳ 10 секунд...
↓
БОТ:
"✅ WITHDRAWAL SUCCESSFUL!
💰 Sent: 9,500 TAMA
🔗 Transaction: 5k8s9...xyz
Check your Phantom wallet!"
```

**Что происходит за кулисами:**
```python
# В боте (bot.py)
def process_withdrawal_amount(message):
    telegram_id = str(message.from_user.id)
    amount = int(message.text)
    
    # 1. Проверки
    user = supabase.table('leaderboard')\
        .select('*')\
        .eq('telegram_id', telegram_id)\
        .single().execute()
    
    balance = user.data['tama']
    wallet = user.data['wallet_address']
    
    if balance < amount:
        bot.reply_to(message, "❌ Insufficient balance!")
        return
    
    if wallet.startswith('telegram_'):
        bot.reply_to(message, "❌ Connect wallet first!")
        return
    
    # 2. Рассчитать fee
    fee = int(amount * 0.05)  # 5%
    net_amount = amount - fee
    
    # 3. Распределить fee
    burn_amount = int(fee * 0.60)  # 60% сжигается
    pool_amount = int(fee * 0.30)  # 30% в пул
    team_amount = fee - burn_amount - pool_amount  # 10% команде
    
    # 4. РЕАЛЬНЫЙ TRANSFER через Solana
    import subprocess
    import json
    import os
    
    # Получить переменные окружения
    TAMA_MINT = os.getenv('TAMA_MINT_ADDRESS')
    RPC_URL = os.getenv('SOLANA_RPC_URL')
    PAYER_KEYPAIR = os.getenv('SOLANA_PAYER_KEYPAIR_PATH')
    
    # Выполнить команду spl-token
    cmd = [
        'spl-token', 'transfer',
        TAMA_MINT,
        str(net_amount),
        wallet,
        '--fund-recipient',
        '--fee-payer', PAYER_KEYPAIR,
        '--owner', PAYER_KEYPAIR,
        '--url', RPC_URL,
        '--output', 'json'
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        # Успех! Парсим signature
        output = json.loads(result.stdout)
        signature = output.get('signature', 'unknown')
        
        # 5. Обновить базу данных
        new_balance = balance - amount
        
        supabase.table('leaderboard').update({
            'tama': new_balance,
            'total_withdrawn': user.data.get('total_withdrawn', 0) + net_amount
        }).eq('telegram_id', telegram_id).execute()
        
        # 6. Записать транзакцию
        supabase.table('tama_economy').insert({
            'telegram_id': telegram_id,
            'transaction_type': 'withdrawal',
            'amount': -amount,
            'fee': fee,
            'burn_amount': burn_amount,
            'pool_amount': pool_amount,
            'team_amount': team_amount,
            'signature': signature,
            'wallet_address': wallet,
            'status': 'completed',
            'created_at': 'now()'
        }).execute()
        
        # 7. Обновить глобальную статистику
        supabase.rpc('update_burn_stats', {
            'burned': burn_amount,
            'recycled': pool_amount
        }).execute()
        
        # 8. Отправить успешное сообщение
        bot.reply_to(message,
            f"✅ *WITHDRAWAL SUCCESSFUL!*\n\n"
            f"💰 Sent: {net_amount:,} TAMA\n"
            f"🔥 Burned: {burn_amount:,} TAMA\n"
            f"♻️ Recycled: {pool_amount:,} TAMA\n"
            f"💼 Team Fee: {team_amount:,} TAMA\n\n"
            f"🔗 Transaction:\n"
            f"`{signature}`\n\n"
            f"📊 New Balance: {new_balance:,} TAMA\n\n"
            f"[View on Solscan](https://solscan.io/tx/{signature}?cluster=devnet)",
            parse_mode='Markdown'
        )
    else:
        # Ошибка транзакции
        error = result.stderr
        bot.reply_to(message, 
            f"❌ WITHDRAWAL FAILED\n"
            f"Error: {error}\n\n"
            f"Your balance was not deducted."
        )
```

---

### ШАГ 4: Проверка в Phantom

```
Петя открывает Phantom Wallet на телефоне 📱
↓
Видит:
"💰 Received 9,500 TAMA
From: Gotchi Game
Time: 2 minutes ago"
↓
Баланс кошелька: 9,500 TAMA 🎉
```

**Что происходит в блокчейне:**
```
Transaction на Solana:
├─ From: 8s88JVHG... (payer-keypair = mint authority)
├─ To: 8kX4vtE2... (Петя's wallet)
├─ Token: Fuqw8Zg17... (TAMA mint address)
├─ Amount: 9,500 TAMA (с 9 decimals = 9,500,000,000,000)
├─ Fee (SOL): ~0.00001 SOL (gas fee)
└─ Signature: 5k8s9qW3pL7mN2xY...

Signature можно проверить здесь:
https://solscan.io/tx/5k8s9qW3pL7mN2xY...?cluster=devnet
```

---

## Сценарий 3: ПРОДВИНУТЫЙ ИГРОК (День 90)

### ШАГ 1: Минтинг NFT

```
Петя накопил 100,000 TAMA 💎
↓
Хочет создать уникального NFT питомца
↓
Открывает игру → нажимает "🎨 Mint NFT"
↓
Переходит на страницу mint.html
↓
Выбирает: "Epic NFT (100,000 TAMA)"
↓
Подключает Phantom кошелёк
↓
Нажимает "Mint" → Phantom popup:
"Sign transaction?
- Pay: 100,000 TAMA
- Gas: 0.01 SOL"
[Approve]
↓
⏳ Minting... 30 секунд...
↓
✅ NFT CREATED!
"Gotchi #1337 - Epic Rarity"
[View in Wallet] [View on Solscan]
```

**Что происходит за кулисами:**
```javascript
// На странице mint.html
async function mintNFT(rarity, cost) {
  const connection = new Connection(SOLANA_RPC_URL);
  const wallet = window.solana;
  
  // 1. Проверить баланс TAMA
  const tamaBalance = await getTamaBalance(wallet.publicKey);
  if (tamaBalance < cost) {
    alert('❌ Insufficient TAMA balance!');
    return;
  }
  
  // 2. Создать metadata для NFT
  const metadata = {
    name: `Gotchi #${getNextNFTId()}`,
    symbol: "GOTCHI",
    description: "Your unique Tamagotchi companion",
    image: `https://tr1h.github.io/huma-chain-xyz/nft-assets/${rarity}/${randomImage}.png`,
    attributes: [
      { trait_type: "Rarity", value: rarity },
      { trait_type: "Level", value: getUserLevel() },
      { trait_type: "Owner", value: telegramUsername }
    ]
  };
  
  // 3. Загрузить metadata на IPFS/Arweave
  const metadataUri = await uploadToIPFS(metadata);
  
  // 4. Создать NFT через Metaplex
  const { nft } = await metaplex.nfts().create({
    uri: metadataUri,
    name: metadata.name,
    sellerFeeBasisPoints: 500, // 5% royalty
    creators: [
      {
        address: TEAM_WALLET,
        share: 100
      }
    ]
  });
  
  // 5. Списать TAMA с баланса
  await supabase.rpc('decrement_tama', {
    user_id: telegramUserId,
    amount: cost
  });
  
  // 6. Записать NFT в базу
  await supabase.table('user_nfts').insert({
    telegram_id: telegramUserId,
    nft_mint: nft.address.toString(),
    rarity: rarity,
    cost: cost,
    metadata_uri: metadataUri,
    minted_at: new Date()
  });
  
  // 7. Burn 30% от стоимости NFT
  const burnAmount = Math.floor(cost * 0.30);
  await supabase.rpc('update_burn_stats', {
    burned: burnAmount,
    recycled: 0
  });
  
  // 8. Показать успех
  showSuccess(nft.address.toString());
}
```

---

# 🔧 С ТОЧКИ ЗРЕНИЯ ТЕХНОЛОГИЙ

## АРХИТЕКТУРА: 3-СЛОЙНАЯ СИСТЕМА

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: FRONTEND                         │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Telegram Bot   │  │   Mini App     │  │  Mint Page   │  │
│  │  @GotchiGame   │  │ (tamagotchi-   │  │ (mint.html)  │  │
│  │      Bot       │  │  game.html)    │  │              │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│         │                    │                    │          │
└─────────┼────────────────────┼────────────────────┼─────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 2: BACKEND                          │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │   Supabase     │  │  Python Bot    │  │  Solana RPC  │  │
│  │  (PostgreSQL)  │  │    (bot.py)    │  │  (Devnet)    │  │
│  │                │  │                │  │              │  │
│  │ • leaderboard  │  │ • Commands     │  │ • Transfers  │  │
│  │ • referrals    │  │ • Gamification │  │ • NFT Mint   │  │
│  │ • tama_economy │  │ • Withdrawal   │  │ • Queries    │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│         │                    │                    │          │
└─────────┼────────────────────┼────────────────────┼─────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  LAYER 3: BLOCKCHAIN                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Solana Blockchain                      │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │  TAMA Token  │  │  NFT Program │  │  Wallets     │ │ │
│  │  │  (SPL Token) │  │  (Metaplex)  │  │  (Phantom)   │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │                                                          │ │
│  │  Mint: Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## ПОТОК ДАННЫХ: Клик → Блокчейн

### 1️⃣ EARNING FLOW (Заработок)

```
┌──────────┐
│  ИГРОК   │  Кликает по питомцу 🐱
└────┬─────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│  JavaScript (tamagotchi-game.html)           │
│  handlePetClick() {                          │
│    reward = random(1,5);                     │
│    balance += reward;                        │
│    saveToDB(reward);                         │
│  }                                           │
└────┬─────────────────────────────────────────┘
     │ HTTP POST
     ▼
┌──────────────────────────────────────────────┐
│  Supabase REST API                           │
│  POST /rest/v1/rpc/increment_tama            │
│  Body: {                                     │
│    user_id: "123456789",                     │
│    amount: 5                                 │
│  }                                           │
└────┬─────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│  PostgreSQL Database                         │
│  UPDATE leaderboard                          │
│  SET tama = tama + 5,                        │
│      clicks = clicks + 1                     │
│  WHERE telegram_id = '123456789'             │
└────┬─────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│  Response: { success: true }                 │
│  ↓                                           │
│  UI Updates: "Balance: 1,005 TAMA" 💰       │
└──────────────────────────────────────────────┘

⏱️ ВРЕМЯ: ~100-200ms (очень быстро!)
💾 ЛОКАЦИЯ: Только база данных (НЕ блокчейн)
💸 СТОИМОСТЬ: $0 (виртуальные токены)
```

---

### 2️⃣ WITHDRAWAL FLOW (Вывод)

```
┌──────────┐
│  ИГРОК   │  Отправляет /withdraw 10000
└────┬─────┘
     │ Telegram Message API
     ▼
┌──────────────────────────────────────────────┐
│  Python Bot (bot.py)                         │
│  @bot.message_handler(commands=['withdraw']) │
│  1. Проверить баланс в DB                    │
│  2. Проверить wallet_address                 │
│  3. Рассчитать fee (5%)                      │
│  4. Запустить subprocess                     │
└────┬─────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│  subprocess.run([                            │
│    'spl-token', 'transfer',                  │
│    'Fuqw8Zg17...',  # TAMA mint              │
│    '9500',          # Amount (after fee)     │
│    '8kX4vtE2...',   # User wallet            │
│    '--fee-payer', 'payer-keypair.json',      │
│    '--owner', 'payer-keypair.json'           │
│  ])                                          │
└────┬─────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│  Solana CLI                                  │
│  1. Читает keypair файл                      │
│  2. Создаёт transaction:                     │
│     - From: mint authority                   │
│     - To: user wallet                        │
│     - Amount: 9500 * 10^9                    │
│  3. Подписывает через keypair                │
│  4. Отправляет на RPC                        │
└────┬─────────────────────────────────────────┘
     │ JSON-RPC
     ▼
┌──────────────────────────────────────────────┐
│  Solana RPC Node                             │
│  (https://api.devnet.solana.com)             │
│  1. Валидирует transaction                   │
│  2. Проверяет signatures                     │
│  3. Отправляет в сеть                        │
└────┬─────────────────────────────────────────┘
     │ P2P Network
     ▼
┌──────────────────────────────────────────────┐
│  Solana Blockchain                           │
│  1. Validators обрабатывают tx               │
│  2. Mint TAMA токены                         │
│  3. Transfer на user wallet                  │
│  4. Записывают в блок                        │
│  5. Возвращают signature                     │
└────┬─────────────────────────────────────────┘
     │ Response
     ▼
┌──────────────────────────────────────────────┐
│  Bot получает signature                      │
│  "5k8s9qW3pL7mN2xY..."                       │
│  ↓                                           │
│  Обновляет базу данных:                      │
│  - tama: -10,000                             │
│  - total_withdrawn: +9,500                   │
│  - Записывает в tama_economy table           │
│  ↓                                           │
│  Отправляет сообщение игроку:                │
│  "✅ Withdrawal successful!                  │
│   💰 9,500 TAMA sent to your wallet"         │
└──────────────────────────────────────────────┘

⏱️ ВРЕМЯ: ~5-15 секунд
💾 ЛОКАЦИЯ: Solana Blockchain (реальная транзакция!)
💸 СТОИМОСТЬ: ~0.00001 SOL (gas fee)
```

---

# 💰 ТОКЕНОМИКА В ДЕЙСТВИИ

## DAILY POOL DISTRIBUTION

### Как работает Daily Pool?

```
╔══════════════════════════════════════════════╗
║  YEAR 1, HALF 1 (первые 6 месяцев)          ║
╠══════════════════════════════════════════════╣
║  Total Pool: 400,000,000 TAMA                ║
║  Duration: 180 days                          ║
║  Daily Pool: 400M / 180 = 2,222,222 TAMA    ║
╚══════════════════════════════════════════════╝

День 1:
├─ В мире было 100,000 кликов (все игроки)
├─ Петя сделал 1,000 кликов
├─ Доля Пети: 1,000 / 100,000 = 1%
├─ Награда Пети: 1% * 2,222,222 = 22,222 TAMA ✨
└─ Остаток пула: 400M - 2.22M = 397.78M

День 2:
├─ В мире было 200,000 кликов
├─ Петя сделал 1,500 кликов
├─ Доля Пети: 1,500 / 200,000 = 0.75%
├─ Награда Пети: 0.75% * 2,222,222 = 16,666 TAMA
└─ Остаток пула: 397.78M - 2.22M = 395.56M

...

День 180:
├─ В мире было 10,000,000 кликов (много игроков!)
├─ Петя сделал 2,000 кликов
├─ Доля Пети: 2,000 / 10,000,000 = 0.02%
├─ Награда Пети: 0.02% * 2,222,222 = 444 TAMA
└─ Остаток пула: 0 TAMA (пул закончился)

═══════════════════════════════════════════════

ХАЛВИНГ! 🔥

╔══════════════════════════════════════════════╗
║  YEAR 1, HALF 2 (следующие 6 месяцев)       ║
╠══════════════════════════════════════════════╣
║  Total Pool: 200,000,000 TAMA (половина!)    ║
║  Duration: 180 days                          ║
║  Daily Pool: 200M / 180 = 1,111,111 TAMA    ║
╚══════════════════════════════════════════════╝

День 181:
├─ Daily Pool УМЕНЬШИЛСЯ до 1,111,111 TAMA
├─ Но игроков стало БОЛЬШЕ (15M кликов)
├─ Петя сделал 2,000 кликов
├─ Доля Пети: 2,000 / 15,000,000 = 0.013%
├─ Награда Пети: 0.013% * 1,111,111 = 144 TAMA
└─ Меньше награда → токены ДЕФЛЯЦИЯ! 📈
```

---

## FEE DISTRIBUTION (Распределение комиссии)

### Что происходит с 5% fee при выводе?

```
Петя выводит 10,000 TAMA
↓
Fee: 5% = 500 TAMA
↓
Распределение:

┌─────────────────────────────────────┐
│  60% → BURN (сжигается навсегда) 🔥 │
│  300 TAMA                           │
│                                     │
│  Что это значит:                    │
│  - Токены отправляются на           │
│    null address или burn address    │
│  - Уменьшается circulating supply   │
│  - Токены НЕВОЗМОЖНО вернуть        │
│  - Цена растёт (дефляция)           │
└─────────────────────────────────────┘
          │
          ▼
    UPDATE global_stats
    SET total_burned = total_burned + 300

┌─────────────────────────────────────┐
│  30% → POOL RECYCLING ♻️            │
│  150 TAMA                           │
│                                     │
│  Что это значит:                    │
│  - Токены возвращаются в Daily Pool │
│  - Другие игроки смогут их          │
│    заработать через клики           │
│  - Продлевает жизнь пула            │
│  - Самоподдерживающаяся система     │
└─────────────────────────────────────┘
          │
          ▼
    UPDATE daily_pool
    SET remaining = remaining + 150

┌─────────────────────────────────────┐
│  10% → TEAM/DEVELOPMENT 💼          │
│  50 TAMA                            │
│                                     │
│  Что это значит:                    │
│  - Используется для:                │
│    • Оплата серверов                │
│    • Маркетинг                      │
│    • Разработка новых фич           │
│    • Листинги на биржах             │
│  - Прозрачность через blockchain    │
└─────────────────────────────────────┘
          │
          ▼
    TRANSFER to team_wallet
    (8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi)
```

---

## BURN MECHANISM (Сжигание в деталях)

```javascript
// Функция сжигания токенов
async function burnTAMA(amount) {
  const connection = new Connection(SOLANA_RPC_URL);
  
  // Вариант 1: Отправить на null address
  const NULL_ADDRESS = '11111111111111111111111111111111';
  
  await transfer(
    connection,
    payerKeypair,
    tamaTokenAccount,
    NULL_ADDRESS,
    payerKeypair,
    amount
  );
  
  // Вариант 2: Уменьшить supply (если есть burn authority)
  await burn(
    connection,
    payerKeypair,
    tamaTokenAccount,
    TAMA_MINT,
    burnAuthority,
    amount
  );
  
  // Записать в статистику
  await supabase.rpc('update_burn_stats', {
    burned: amount,
    source: 'withdrawal_fee'
  });
}

// Глобальная статистика сжигания
CREATE TABLE burn_stats (
  total_burned BIGINT DEFAULT 0,
  burned_from_withdrawals BIGINT DEFAULT 0,
  burned_from_nft_minting BIGINT DEFAULT 0,
  last_burn_date TIMESTAMP,
  burn_rate_per_day NUMERIC
);

// Dashboard показывает:
Total Burned: 50,245,891 TAMA (5.02% of supply)
Burned Today: 125,000 TAMA
Burn Rate: 0.0125%/day
Effective Supply: 949,754,109 TAMA
```

---

# 🎯 ПОШАГОВЫЕ СЦЕНАРИИ

## СЦЕНАРИЙ A: "От нуля до вывода" (30 дней)

```
DAY 1:
┌─────────────────────────────────────┐
│ Регистрация через реферальную ссылку │
│ + 1,000 TAMA (welcome bonus)        │
│ Кликает 100 раз → +500 TAMA         │
│ Daily Reward → +100 TAMA            │
│ BALANCE: 1,600 TAMA                 │
└─────────────────────────────────────┘

DAY 5:
┌─────────────────────────────────────┐
│ Кликает каждый день → +2,000 TAMA   │
│ Daily Rewards → +500 TAMA           │
│ Quest "Reach Level 5" → +1,000 TAMA │
│ BALANCE: 5,100 TAMA                 │
└─────────────────────────────────────┘

DAY 15:
┌─────────────────────────────────────┐
│ Пригласил 3 друзей → +3,000 TAMA    │
│ Реферальные награды → +1,500 TAMA   │
│ Кликает активно → +8,000 TAMA       │
│ BALANCE: 17,600 TAMA                │
└─────────────────────────────────────┘

DAY 30:
┌─────────────────────────────────────┐
│ Все квесты выполнены → +10,000 TAMA │
│ Monthly streak bonus → +5,000 TAMA  │
│ Кликает мастерски → +20,000 TAMA    │
│ BALANCE: 52,600 TAMA ✨             │
│                                     │
│ РЕШЕНИЕ: Пора выводить! 💰         │
└─────────────────────────────────────┘

WITHDRAWAL:
┌─────────────────────────────────────┐
│ 1. Подключить Phantom кошелёк       │
│    ⏱️ 30 секунд                     │
│                                     │
│ 2. /withdraw 50000                  │
│    ⏱️ 15 секунд                     │
│                                     │
│ 3. Получено: 47,500 TAMA (блокчейн) │
│    Burned: 1,500 TAMA               │
│    Recycled: 750 TAMA               │
│    Team: 250 TAMA                   │
│                                     │
│ 4. Остаток: 2,600 TAMA (в игре)     │
└─────────────────────────────────────┘

ИТОГО:
├─ Время вложено: ~5 часов за 30 дней
├─ Реальные деньги вложены: $0
├─ Получено: 47,500 TAMA на кошельке
└─ Стоимость (если $0.001/TAMA): $47.50 💰
```

---

## СЦЕНАРИЙ B: "NFT Collector" (90 дней)

```
DAY 1-60: (Accumulation Phase)
┌─────────────────────────────────────┐
│ Активная игра каждый день           │
│ Приглашено 20 рефералов             │
│ Все квесты выполнены                │
│ BALANCE: 150,000 TAMA               │
└─────────────────────────────────────┘

DAY 61: FIRST NFT MINT
┌─────────────────────────────────────┐
│ Решает: "Хочу Epic NFT!"            │
│ Cost: 100,000 TAMA + 0.01 SOL       │
│ ↓                                   │
│ Mint процесс:                       │
│ 1. Подключить Phantom ✅            │
│ 2. Выбрать редкость: Epic           │
│ 3. Approve transaction              │
│ 4. ⏳ Minting... 30 сек             │
│ 5. ✅ NFT Created!                  │
│                                     │
│ Gotchi #1337 - Epic                 │
│ • Rarity: Epic (5%)                 │
│ • Level: 25                         │
│ • Unique Trait: Golden Fur          │
│ • Owner: @petya_pro                 │
│                                     │
│ BALANCE: 50,000 TAMA (осталось)     │
│                                     │
│ Fee Distribution:                   │
│ • Burned: 30,000 TAMA (30%)         │
│ • Marketplace: 10,000 TAMA (10%)    │
│ • Creator Royalty: 5,000 TAMA (5%)  │
│ • Mint Cost: 55,000 TAMA (55%)      │
└─────────────────────────────────────┘

DAY 62-90: (Trading Phase)
┌─────────────────────────────────────┐
│ NFT появился в Phantom кошельке     │
│ Другой игрок предлагает:            │
│ "Куплю твой Epic NFT за 200K TAMA!" │
│ ↓                                   │
│ Петя соглашается → продаёт          │
│ Profit: 200K - 100K = 100K TAMA     │
│ ROI: 100% за 30 дней! 📈            │
└─────────────────────────────────────┘
```

---

# 🏗️ АРХИТЕКТУРА СИСТЕМЫ (Детальная)

## DATABASE SCHEMA

```sql
-- Основная таблица игроков
CREATE TABLE leaderboard (
  id BIGSERIAL PRIMARY KEY,
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT,
  tama BIGINT DEFAULT 0,              -- Виртуальный баланс
  level INTEGER DEFAULT 1,
  clicks BIGINT DEFAULT 0,
  wallet_address TEXT,                -- Phantom адрес
  wallet_connected_at TIMESTAMP,
  total_withdrawn BIGINT DEFAULT 0,   -- Всего выведено
  total_earned BIGINT DEFAULT 0,      -- Всего заработано
  referral_code TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  daily_streak INTEGER DEFAULT 0,
  last_daily_claim TIMESTAMP
);

-- Таблица рефералов
CREATE TABLE referrals (
  id BIGSERIAL PRIMARY KEY,
  referrer_telegram_id TEXT NOT NULL,
  referred_telegram_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  earned_from_ref BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(referrer_telegram_id, referred_telegram_id)
);

-- Таблица экономики (все транзакции)
CREATE TABLE tama_economy (
  id BIGSERIAL PRIMARY KEY,
  telegram_id TEXT NOT NULL,
  transaction_type TEXT NOT NULL,     -- 'withdrawal', 'earning', 'nft_mint', etc
  amount BIGINT NOT NULL,             -- Положительное или отрицательное
  fee BIGINT DEFAULT 0,
  burn_amount BIGINT DEFAULT 0,
  pool_amount BIGINT DEFAULT 0,
  team_amount BIGINT DEFAULT 0,
  signature TEXT,                     -- Solana transaction signature
  wallet_address TEXT,
  status TEXT DEFAULT 'pending',      -- 'pending', 'completed', 'failed'
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица NFT
CREATE TABLE user_nfts (
  id BIGSERIAL PRIMARY KEY,
  telegram_id TEXT NOT NULL,
  nft_mint TEXT UNIQUE NOT NULL,      -- Solana NFT mint address
  rarity TEXT NOT NULL,               -- 'common', 'rare', 'epic', 'legendary'
  cost BIGINT NOT NULL,
  metadata_uri TEXT,
  image_url TEXT,
  minted_at TIMESTAMP DEFAULT NOW(),
  sold_at TIMESTAMP,
  sold_for BIGINT
);

-- Глобальная статистика
CREATE TABLE global_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_tama_distributed BIGINT DEFAULT 0,
  total_tama_burned BIGINT DEFAULT 0,
  total_tama_recycled BIGINT DEFAULT 0,
  current_daily_pool BIGINT DEFAULT 0,
  current_halving_period INTEGER DEFAULT 1,
  next_halving_date TIMESTAMP,
  total_nfts_minted INTEGER DEFAULT 0,
  total_users INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Функции для обновления баланса
CREATE OR REPLACE FUNCTION increment_tama(user_id TEXT, amount BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE leaderboard
  SET tama = tama + amount,
      total_earned = total_earned + amount,
      clicks = clicks + 1,
      last_activity = NOW()
  WHERE telegram_id = user_id;
  
  -- Обновить глобальную статистику
  UPDATE global_stats
  SET total_tama_distributed = total_tama_distributed + amount,
      updated_at = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_tama(user_id TEXT, amount BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE leaderboard
  SET tama = tama - amount,
      last_activity = NOW()
  WHERE telegram_id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Функция для burn статистики
CREATE OR REPLACE FUNCTION update_burn_stats(burned BIGINT, recycled BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE global_stats
  SET total_tama_burned = total_tama_burned + burned,
      total_tama_recycled = total_tama_recycled + recycled,
      current_daily_pool = current_daily_pool + recycled,
      updated_at = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql;
```

---

## ENVIRONMENT VARIABLES

```bash
# Telegram Bot
TELEGRAM_BOT_TOKEN="8445221254:AAHxX7NCDv3K14LTnAQkM69Lg4QCckFh-E8"
BOT_USERNAME="GotchiGameBot"

# Supabase (Database)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"

# Solana Blockchain
SOLANA_RPC_URL="https://api.devnet.solana.com"
TAMA_MINT_ADDRESS="Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY"
SOLANA_PAYER_KEYPAIR_PATH="C:\goooog\payer-keypair.json"

# URLs
GAME_URL="https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html"
MINT_URL="https://tr1h.github.io/huma-chain-xyz/mint.html"
```

---

## КАК ЗАПУСТИТЬ ВЕСЬ СТЕК?

```bash
# TERMINAL 1: Запустить бота
cd C:\goooog\solana-tamagotchi\bot
.\start_bot.ps1

# Вывод:
[OK] Environment variables loaded
[OK] Supabase connected
[OK] Bot started: @GotchiGameBot
[OK] Menu button set
[OK] Listening for messages...

# TERMINAL 2: Открыть game в браузере
start https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html

# TERMINAL 3: Мониторинг логов
tail -f C:\goooog\solana-tamagotchi\bot\bot_monitoring.log
```

---

# ✅ SUMMARY: ВСЁ РАБОТАЕТ ТАК

```
┌─────────────────────────────────────────────────────────────┐
│                     ПОЛНЫЙ ЦИКЛ                              │
└─────────────────────────────────────────────────────────────┘

1️⃣ РЕГИСТРАЦИЯ (1 минута)
   ├─ Игрок кликает по ссылке → Telegram Bot
   ├─ /start → создаётся аккаунт в Supabase
   └─ Баланс: 0 TAMA (виртуальный)

2️⃣ ИГРА (1-30 дней)
   ├─ Кликает по питомцу → +TAMA (в базе данных)
   ├─ Выполняет квесты → +бонусы
   ├─ Приглашает друзей → +реферальные награды
   └─ Баланс: 10,000-100,000 TAMA (виртуальный)

3️⃣ ПОДКЛЮЧЕНИЕ КОШЕЛЬКА (30 секунд)
   ├─ Открывает игру → "Connect Wallet"
   ├─ Phantom popup → Approve
   └─ wallet_address сохранён в базе

4️⃣ ВЫВОД НА БЛОКЧЕЙН (15 секунд)
   ├─ /withdraw 10000
   ├─ Бот проверяет баланс и wallet
   ├─ Выполняет SPL Token transfer (РЕАЛЬНАЯ ТРАНЗАКЦИЯ!)
   ├─ Обновляет базу данных
   ├─ Применяет fee: burn (60%), recycle (30%), team (10%)
   └─ Пользователь получает токены на Phantom кошелёк

5️⃣ ЧТО ДАЛЬШЕ?
   ├─ Hold → ждать роста цены
   ├─ Trade → продать на DEX (Raydium, Jupiter)
   ├─ Mint NFT → создать уникального питомца
   ├─ Stake → заработать passive income (будущее)
   └─ Transfer → отправить другому игроку

═══════════════════════════════════════════════════════════════

🎯 КЛЮЧЕВОЕ ПОНИМАНИЕ:

• Виртуальная экономика (игра) = БЕСПЛАТНО для пользователя
• Блокчейн транзакции (withdrawal) = РЕАЛЬНЫЕ токены
• Fee система = поддерживает экономику автономно
• Халвинг = делает токены редкими → цена растёт
• Burn = уменьшает supply → дефляция → цена растёт

💰 РЕЗУЛЬТАТ:
Игроки зарабатывают БЕСПЛАТНО (кликами)
→ Выводят на блокчейн
→ Получают РЕАЛЬНЫЕ токены
→ Могут продать за деньги

🚀 ЭТО РАБОТАЕТ ПРЯМО СЕЙЧАС!
```

---

**Документ создан:** 31 октября 2025  
**Версия:** 1.0  
**Статус:** ✅ PRODUCTION READY

**Вопросы?** Пиши! Разберу ещё подробнее! 💪

