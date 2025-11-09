# 💫 Circulating Supply vs Total Supply

## Ключевое отличие

### Total Supply (Максимальный выпуск)
```
1,000,000,000 TAMA = КОНСТАНТА, НЕ МЕНЯЕТСЯ НИКОГДА!
```
Это максимальное количество токенов, которое может существовать.

### Circulating Supply (В обращении)
```
Circulating Supply = Total Supply - Burned Tokens
```
Это количество токенов, **реально доступных** для использования.

---

## 🔥 Как работает сжигание (Burn)

### Burn Address
```
1nc1nerator11111111111111111111111111111111
```
Это специальный адрес на Solana, откуда **никто не может забрать токены**.

### Механика
1. Токены отправляются на Burn Address
2. С этого адреса их **невозможно** вернуть (нет приватного ключа)
3. Токены навсегда **выведены из обращения**
4. Total Supply остается 1,000,000,000 TAMA
5. **Но Circulating Supply уменьшается!**

---

## 📊 Пример

### Начальное состояние
```
Total Supply:         1,000,000,000 TAMA
Burned:                           0 TAMA
Circulating Supply:   1,000,000,000 TAMA (100%)
```

### После 10 минтов Bronze NFT (40% burn каждый)
```
10 NFTs × 2,500 TAMA = 25,000 TAMA от пользователей
40% сжигается = 10,000 TAMA burned

Total Supply:         1,000,000,000 TAMA (не изменился!)
Burned:                      10,000 TAMA
Circulating Supply:     999,990,000 TAMA (99.999%)
```

### После 1,000 минтов Bronze NFT
```
1,000 NFTs × 2,500 TAMA = 2,500,000 TAMA от пользователей
40% сжигается = 1,000,000 TAMA burned

Total Supply:         1,000,000,000 TAMA (не изменился!)
Burned:                   1,000,000 TAMA
Circulating Supply:     999,000,000 TAMA (99.9%)
```

### После 10,000 минтов Bronze NFT
```
10,000 NFTs × 2,500 TAMA = 25,000,000 TAMA от пользователей
40% сжигается = 10,000,000 TAMA burned

Total Supply:         1,000,000,000 TAMA (не изменился!)
Burned:                  10,000,000 TAMA (1% burned!)
Circulating Supply:     990,000,000 TAMA (99%)
```

---

## 🎯 Где мы сжигаем TAMA

### Bronze NFT Mint (2,500 TAMA)
```
Пользователь платит: 2,500 TAMA
    ↓
Распределение:
├─ 🔥 1,000 TAMA (40%) → Burn Address ✅ СЖИГАЕТСЯ!
├─ 💰   750 TAMA (30%) → Treasury Main
└─ 🎮   750 TAMA (30%) → P2E Pool
```

**Каждый минт Bronze NFT сжигает 1,000 TAMA навсегда!**

### Виды burn транзакций в системе
```javascript
// В Supabase transactions table:
type: 'burn_from_bronze_nft_onchain'
amount: 1000 // TAMA burned
user_id: 'BURN_ADDRESS'
username: '🔥 Token Burn'
```

---

## 💻 Как это отображается

### Wallet Admin Panel (`wallet-admin.html`)
```
📊 Total Distribution

Total Supply (Real)    | 🔥 Burned (Total)     | 💫 Circulating Supply
1,000M TAMA           | 10.0K TAMA            | 999.99M TAMA
                      |                       | (Total - Burned)
```

### Расчет
```javascript
// Get from blockchain
const totalSupply = 1000000000; // From Solana RPC

// Get from Supabase
const burned = await fetchBurnedTokens(); // Sum of all burn transactions

// Calculate
const circulatingSupply = totalSupply - burned;
```

---

## 🚀 Почему это важно

### Для экономики проекта
1. **Дефляция**: Меньше токенов в обороте = выше ценность
2. **Прозрачность**: Точное знание реального supply
3. **Доверие**: Пользователи видят, что burn реальный

### Для инвесторов
- **Total Supply**: Теоретический максимум
- **Circulating Supply**: Реальное количество в обороте
- **Burned %**: Показатель дефляции токена

### Формулы
```
Burn Rate = (Burned / Total Supply) × 100%
Circulating % = (Circulating / Total Supply) × 100%
Circulating % = 100% - Burn Rate
```

---

## 📈 Прогнозы

### При 100 NFT минтах в день
```
100 NFTs/день × 1,000 TAMA burned = 100,000 TAMA/день
30 дней = 3,000,000 TAMA burned/месяц
12 месяцев = 36,000,000 TAMA burned/год (3.6% за год)
```

### При 1,000 NFT минтах в день
```
1,000 NFTs/день × 1,000 TAMA burned = 1,000,000 TAMA/день
30 дней = 30,000,000 TAMA burned/месяц
12 месяцев = 360,000,000 TAMA burned/год (36% за год!)
```

**Чем популярнее проект → Больше NFT минтов → Больше burn → Меньше Circulating Supply → Выше ценность токена! 🚀**

---

## 🔍 Как проверить

### 1. Wallet Admin Panel
URL: `file:///C:/goooog/wallet-admin.html`

Смотрим:
- **Total Supply (Real)**: Из блокчейна Solana
- **🔥 Burned (Total)**: Сумма всех burn транзакций
- **💫 Circulating Supply**: Total - Burned

### 2. Supabase (Transactions)
Query:
```sql
SELECT SUM(amount) as total_burned
FROM transactions
WHERE type = 'burn_from_bronze_nft_onchain';
```

### 3. Solscan Explorer
1. Go to: https://explorer.solana.com/address/1nc1nerator11111111111111111111111111111111?cluster=devnet
2. Check TAMA token balance
3. This is the burned amount!

### 4. Console Commands (wallet-admin.html)
```javascript
// Check burn amount
fetchBurnedTokens().then(burned => {
    console.log(`Burned: ${burned} TAMA`);
    console.log(`Circulating: ${1000000000 - burned} TAMA`);
    console.log(`Burn Rate: ${(burned / 1000000000 * 100).toFixed(4)}%`);
});
```

---

## ⚠️ Важные замечания

### Total Supply ≠ Circulating Supply
```
❌ НЕПРАВИЛЬНО: "У нас 1 миллиард TAMA"
✅ ПРАВИЛЬНО: "Total Supply 1B, но Circulating Supply 999M (1M сожжено)"
```

### Burn необратим
```
Burned = Gone Forever! 🔥
Нельзя "разжечь" токены обратно!
```

### Только Bronze NFT сжигает TAMA
```
Bronze (TAMA): 40% burn ✅
Silver (SOL): No burn ❌
Gold (SOL): No burn ❌
```

---

## 🆚 Сравнение с другими проектами

| Проект | Total Supply | Burn Mechanism | Circulating Supply |
|--------|--------------|----------------|-------------------|
| Bitcoin | 21M | Mining rewards decrease | ~19.6M (93%) |
| Ethereum | No max | EIP-1559 fee burn | ~120M |
| Binance Coin (BNB) | 200M | Quarterly burns | ~150M (75%) |
| **TAMA** | 1,000M | NFT mint burns (40%) | 1,000M - Burned |

---

## 📁 Код и реализация

### Frontend (wallet-admin.html)
```javascript
// Fetch burned amount from Supabase
async function fetchBurnedTokens() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=amount&type=eq.burn_from_bronze_nft_onchain`);
    const burnTransactions = await response.json();
    return burnTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
}

// Calculate and display circulating supply
async function updateStats() {
    const totalSupply = await fetchRealTokenSupply(); // From blockchain
    const burned = await fetchBurnedTokens();        // From database
    const circulatingSupply = totalSupply - burned;  // Calculate
    
    document.getElementById('circulatingSupply').textContent = formatNumber(circulatingSupply);
}
```

### Backend (api/tama_supabase.php)
```php
// When Bronze NFT is minted, log burn transaction
supabaseRequest($url, $key, 'POST', 'transactions', [], [
    'user_id' => 'BURN_ADDRESS',
    'username' => '🔥 Token Burn',
    'type' => 'burn_from_bronze_nft_onchain',
    'amount' => 1000, // 40% of 2,500 TAMA
    'metadata' => json_encode([
        'source' => 'bronze_nft_mint_onchain',
        'transaction_signature' => $burnSignature
    ])
]);
```

---

## 🎓 Выводы

1. **Total Supply = Константа** (1,000,000,000 TAMA)
2. **Burned = Растет** с каждым Bronze NFT минтом
3. **Circulating Supply = Уменьшается** (Total - Burned)
4. **Сжигание необратимо** (токены на специальном адресе)
5. **Дефляционная модель** = Рост ценности токена! 📈

---

## 🔗 Полезные ссылки

- Burn Address: https://explorer.solana.com/address/1nc1nerator11111111111111111111111111111111?cluster=devnet
- Wallet Admin: `file:///C:/goooog/wallet-admin.html`
- TAMA Token: https://explorer.solana.com/address/Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY?cluster=devnet

---

**Теперь у тебя есть точная сумма TAMA в обращении: Total Supply - Burned = Circulating Supply! 💫**

