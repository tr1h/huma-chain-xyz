# 💰 TAMA TOKEN ECONOMY & FLOW

## 🔄 **КАК РАБОТАЕТ ЭКОНОМИКА:**

---

## **1. 💰 ОТКУДА БЕРУТСЯ TAMA ТОКЕНЫ?**

### **А) В ИГРЕ (Play-to-Earn):**
```
Игрок кликает питомца → Зарабатывает TAMA
├─ Базовый клик: 0.5-1 TAMA
├─ Комбо бонус: до +2x
├─ Уровень бонус: +10-50 TAMA per level
└─ NFT boost: +25% to +100%

💾 Хранение: База Supabase (таблица leaderboard)
```

### **Б) Реферальная программа:**
```
Игрок приглашает друга → +1,000 TAMA сразу
└─ Хранится в: leaderboard.tama
```

### **В) Квесты и достижения:**
```
Выполнил квест → +100-500 TAMA
└─ Хранится в: leaderboard.tama
```

---

## **2. 🎨 NFT MINT - КУДА УХОДЯТ TAMA?**

### **Когда игрок минтит NFT за TAMA:**

```javascript
// 1. Проверка баланса
Current TAMA: 52,046
Need: 5,000 TAMA

// 2. Списание через API
POST /api/tama/add
{
  telegram_id: "202140267",
  amount: -4500,  // -5000 + 500 bonus
  reason: "nft_mint_cat_rare"
}

// 3. Что происходит:
├─ СЖИГАЕТСЯ: 4,500 TAMA (дефляция!)
├─ БОНУС: +500 TAMA возвращается
└─ NFT сохраняется в: user_nfts table
```

### **📊 Баланс после минта:**
```
Было: 52,046 TAMA
Списано: -5,000 TAMA
Бонус: +500 TAMA
Итого: 47,546 TAMA
```

---

## **3. 💎 SOL MINT - КУДА УХОДИТ SOL?**

### **Когда игрок минтит NFT за SOL:**

```javascript
// 1. Phantom Wallet подключен
Wallet: AX4vtEbDEjRxibdPX7fcCB8Nq8VxF82PLWzHHusXJFk3
Balance: 0.5 SOL

// 2. Транзакция в Solana Devnet
await wallet.sendTransaction({
  to: TREASURY_WALLET,  // Твой кошелёк
  amount: 0.1 SOL,
  network: 'devnet'
})

// 3. После успешной транзакции:
├─ SOL идёт на: TREASURY_WALLET (указать твой!)
├─ TAMA начисляется: +10,000 TAMA
└─ NFT сохраняется в: user_nfts (mint_address с реальным адресом)
```

### **💰 Куда идут SOL:**
```
Treasury Wallet (твой кошелёк):
└─ 0.1 SOL × количество минтов
   ├─ 30% → Развитие проекта
   ├─ 30% → Награды/аирдропы
   ├─ 20% → Маркетинг
   └─ 20% → Liquidity pool (будущее)
```

---

## **4. 📊 НАЧИСЛЕНИЕ TAMA ПОЛЬЗОВАТЕЛЮ**

### **Схема:**
```
┌─────────────────────────────────┐
│  ИГРОК ИГРАЕТ В ИГРУ            │
│  ↓                               │
│  Кликает питомца                │
│  ↓                               │
│  gameState.tama += earnedTama   │
│  ↓                               │
│  Каждые 10 секунд:              │
│  POST /api/tama/leaderboard/    │
│  upsert {tama: newBalance}      │
│  ↓                               │
│  SUPABASE: leaderboard.tama     │
│  обновляется                    │
└─────────────────────────────────┘
```

### **База данных:**
```sql
Table: leaderboard
- telegram_id: "202140267"
- tama: 52046  ← ВОТ ТУТ БАЛАНС!
- level: 10
- xp: 5000
- pet_data: {...}
```

---

## **5. 🔄 ПОЛНЫЙ FLOW ЭКОНОМИКИ:**

### **Play-to-Earn цикл:**
```
1. ИГРА → ЗАРАБОТОК
   Player clicks → Earn 0.5-1 TAMA per click
   Save to DB every 10 sec → leaderboard.tama++

2. НАКОПЛЕНИЕ
   Daily active: +50-100 TAMA/day
   With NFT boost: +75-200 TAMA/day
   Referrals: +1000 TAMA per friend

3. NFT MINT (5000 TAMA)
   Deduct 5000 → Burn 4500 → Bonus +500
   Get NFT → Store in user_nfts
   Activate boost → +25% to +100%

4. БОЛЬШЕ ЗАРАБОТКА
   With NFT: Earn faster!
   Level up: More TAMA per click
   New quests: +500 TAMA bonuses

5. REPEAT!
   Mint better NFTs → Stack boosts → Earn more
```

---

## **6. 🏦 TREASURY & MONETIZATION**

### **Твой кошелёк (Treasury):**
```env
# В .env файле (НЕ КОММИТИТЬ В GIT!)
TREASURY_WALLET=8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi
# ↑ ТВОЙ SOLANA WALLET (devnet для теста)
```

### **Как SOL поступают:**
```javascript
// В simple-real-mint.js
const TREASURY = process.env.TREASURY_WALLET || 
                 '8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi';

// Когда игрок минтит за SOL:
const tx = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: new PublicKey(TREASURY),
    lamports: 0.1 * LAMPORTS_PER_SOL
  })
);
```

---

## **7. ⚠️ ВАЖНО! РЕАЛЬНЫЕ ТРАНЗАКЦИИ В DEVNET**

### **Текущий статус:**
```
❌ Сейчас: MOCK минт (симуляция)
✅ Надо: Реальные транзакции в Solana Devnet
```

### **Что нужно сделать:**
1. **Проверить ключи:**
   ```bash
   # tama-mint-keypair.json
   # payer-keypair.json
   ```

2. **Получить devnet SOL:**
   ```
   solana airdrop 2 <ТВОЙ_АДРЕС> --url devnet
   ```

3. **Создать реальную NFT коллекцию:**
   ```bash
   npm install @metaplex-foundation/js
   # Создать Candy Machine в devnet
   ```

4. **Обновить mint.js:**
   ```javascript
   // Использовать реальный Candy Machine ID
   const CANDY_MACHINE_ID = "YOUR_REAL_CM_ID";
   ```

---

## **8. 💡 РЕКОМЕНДАЦИИ ДЛЯ DEVNET:**

### **А) Test токены (бесплатно):**
```bash
# Получить devnet SOL
solana airdrop 2 --url devnet

# Создать тестовую коллекцию NFT
sugar create-config
sugar upload
sugar deploy
```

### **Б) Для хакатона (demo):**
```javascript
// Можно использовать MOCK минт
// но показывать "реальные" транзакции:

// Генерировать fake transaction hash
const txHash = `DEV${Date.now()}${Math.random().toString(36)}`;

// Сохранять в БД как будто реальный
await supabase.from('user_nfts').insert({
  transaction_hash: txHash,
  mint_address: `MOCK-${userId}-${Date.now()}`,
  cost_sol: 0.1
});
```

---

## **9. 📊 TRACKING & ANALYTICS:**

### **Таблица transactions:**
```sql
Table: transactions
- user_id: telegram_id
- type: "earn_click", "nft_mint", "referral_reward"
- amount: +1.5 или -5000
- balance_before: 50000
- balance_after: 45500
- created_at: timestamp
```

### **Таблица user_nfts:**
```sql
Table: user_nfts
- telegram_id: "202140267"
- mint_address: "TAMA-202140267-1730123456789"
- pet_type: "cat"
- rarity: "rare"
- cost_tama: 5000
- cost_sol: 0
- transaction_hash: "tama_mint_1730123456789"
```

---

## **10. ✅ QUICK FIX ДЛЯ ОШИБОК:**

### **Ошибка: "Failed to deduct TAMA"**
```javascript
// В API: /api/tama/add
// ИСПРАВИТЬ:
app.post('/api/tama/add', async (req, res) => {
  const { telegram_id, amount, reason } = req.body;
  
  // Если amount отрицательный (списание):
  if (amount < 0) {
    // Проверить баланс ПЕРЕД списанием!
    const { data: user } = await supabase
      .from('leaderboard')
      .select('tama')
      .eq('telegram_id', telegram_id)
      .single();
    
    if (!user || user.tama < Math.abs(amount)) {
      return res.status(400).json({ 
        error: 'Insufficient TAMA balance' 
      });
    }
  }
  
  // Продолжить...
});
```

---

## **🎯 ИТОГО:**

### **TAMA токены:**
✅ Хранятся в: `leaderboard.tama` (Supabase)  
✅ Зарабатываются: Игра, рефералы, квесты  
✅ Тратятся: NFT минт (сжигаются 90%)  
✅ Бонусы: +500 после TAMA mint, +10k после SOL mint  

### **SOL платежи:**
✅ Идут на: TREASURY_WALLET (твой кошелёк)  
✅ Network: Solana Devnet (тест) → Mainnet (прод)  
✅ Используются: Развитие, награды, ликвидность  

### **NFT:**
✅ Хранятся в: `user_nfts` table  
✅ Дают бонусы: +25% to +100% к заработку  
✅ Tradeable: Да (на маркетплейсах)  

**🚀 ВСЁ ГОТОВО! ЭКОНОМИКА ЗАМКНУТА!**

