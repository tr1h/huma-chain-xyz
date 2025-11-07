# 🧪 Test Mint Flow - Debug Guide

## Проверка Работы Bronze NFT Mint

### 1. Открой DevTools (F12) на mint странице
```
https://tr1h.github.io/huma-chain-xyz/nft-mint.html?user_id=202140267
```

### 2. Открой Console Tab

### 3. Перед минтом проверь текущий баланс:
В Console введи:
```javascript
const userId = new URLSearchParams(window.location.search).get('user_id');
const { data, error } = await supabase.from('leaderboard').select('tama').eq('telegram_id', userId).single();
console.log('Current balance:', data);
```

### 4. Заминт NFT (нажми кнопку)

### 5. Проверь Console на ошибки:
Должны быть логи:
- "Minting..." ✅
- "SUCCESS!" ✅
- Или "Error: ..." ❌

### 6. После минта снова проверь баланс:
```javascript
const { data: after } = await supabase.from('leaderboard').select('tama').eq('telegram_id', userId).single();
console.log('Balance after:', after);
```

### 7. Проверь treasury и P2E pool балансы:
```javascript
// Treasury
const { data: treasury } = await supabase.from('leaderboard').select('*').eq('telegram_id', '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM').single();
console.log('Treasury:', treasury);

// P2E Pool
const { data: p2e } = await supabase.from('leaderboard').select('*').eq('telegram_id', 'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw').single();
console.log('P2E Pool:', p2e);
```

### 8. Проверь транзакции:
```javascript
const { data: txs } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(5);
console.log('Recent transactions:', txs);
```

---

## Возможные Проблемы:

### ❌ Баланс не уменьшился
**Причина:** Ошибка при обновлении в Supabase
**Решение:** Проверь Console на ошибку `updateError`

### ❌ Treasury/P2E не пополнились
**Причина:** Ошибка при upsert
**Решение:** Проверь Console на ошибку в distribution

### ❌ Транзакции не создались
**Причина:** Ошибка при insert в transactions
**Решение:** Проверь права доступа в Supabase (RLS policies)

---

## Быстрая Проверка через Supabase:

1. Открой **Supabase Dashboard:**
   ```
   https://zfrazyupameidxpjihrh.supabase.co
   ```

2. **Table Editor → leaderboard**
   - Найди свой telegram_id (202140267)
   - Проверь поле `tama` - должно уменьшиться на 2500

3. **Table Editor → user_nfts**
   - Должен появиться новый NFT с твоим telegram_id

4. **Table Editor → transactions**
   - Должно быть 4 транзакции:
     1. nft_mint (твой user_id, -2500)
     2. burn_from_nft_mint (BURN_ADDRESS, 1000)
     3. treasury_income_from_nft (Treasury ID, +750)
     4. p2e_pool_refund_from_nft (P2E Pool ID, +750)

---

## Admin Panel Not Loading?

Если admin panel показывает "Loading..." бесконечно:

1. **Проверь Console (F12):**
   ```
   Should see: "✅ Admin Environment loaded"
   ```

2. **Жесткое обновление:**
   ```
   Ctrl+Shift+R (Windows)
   Cmd+Shift+R (Mac)
   ```

3. **Проверь API:**
   ```javascript
   fetch('https://huma-chain-xyz-production.up.railway.app/api/tama/transactions/list?limit=10')
     .then(r => r.json())
     .then(d => console.log(d))
   ```

