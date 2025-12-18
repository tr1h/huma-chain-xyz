# 🔑 Railway Keypairs Setup - Step by Step

## 📋 Что Нужно Сделать

Добавить 2 environment variables в Railway с содержимым keypair файлов.

---

## 🚀 Пошаговая Инструкция

### **Step 1: Открой Railway Dashboard**

1. Перейди на: https://railway.app/
2. Login (если не залогинен)
3. Выбери проект: **huma-chain-xyz-production**
4. Click на service: **huma-chain-xyz**

---

### **Step 2: Открой Variables Tab**

1. В верхнем меню найди **"Variables"** tab
2. Или: Settings → Variables

---

### **Step 3: Добавь Первую Variable**

**Name:**
```
SOLANA_PAYER_KEYPAIR
```

**Value:**
```
[132,174,181,187,188,192,53,70,122,249,71,160,37,20,151,37,170,82,176,155,105,125,90,188,242,41,14,51,174,216,202,38,116,216,231,253,22,229,159,76,176,93,181,187,1,186,6,106,214,28,246,88,142,42,28,91,206,159,15,23,217,18,54,153]
```

**Важно:**
- ✅ Скопируй ВЕСЬ массив (включая `[` и `]`)
- ✅ Без пробелов между числами
- ✅ Точная копия из файла

---

### **Step 4: Добавь Вторую Variable**

**Name:**
```
SOLANA_P2E_POOL_KEYPAIR
```

**Value:**
```
[16,135,213,85,20,231,222,32,242,23,190,180,74,176,176,227,66,0,94,193,134,117,52,36,6,61,242,205,186,206,2,169,243,120,132,6,182,95,27,116,99,203,20,74,144,222,28,177,205,164,0,229,244,25,228,106,83,62,49,48,155,60,115,72]
```

**Важно:**
- ✅ Скопируй ВЕСЬ массив (включая `[` и `]`)
- ✅ Без пробелов между числами
- ✅ Точная копия из файла

---

### **Step 5: Проверь Другие Variables**

Убедись, что также установлены:

```
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PAYER_KEYPAIR_PATH=/app/payer-keypair.json
SOLANA_P2E_POOL_KEYPAIR_PATH=/app/p2e-pool-keypair.json
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=твой_supabase_anon_key
```

---

### **Step 6: Сохрани и Подожди**

1. Click **"Save"** или **"Add Variable"** для каждой
2. Railway автоматически перезапустит сервис
3. Подожди ~30 секунд для перезапуска

---

## ✅ Проверка

### **Check 1: Railway Logs**

После перезапуска, проверь logs:

```
✅ Keypair loaded: /app/payer-keypair.json
✅ Keypair loaded: /app/p2e-pool-keypair.json
```

Если видишь эти сообщения → **SUCCESS!** ✅

---

### **Check 2: Test API Endpoint**

Попробуй вызвать API (для проверки):

```bash
curl https://huma-chain-xyz-production.up.railway.app/api/tama/stats
```

Должен вернуть JSON (не ошибку).

---

### **Check 3: Test NFT Mint**

1. Открой: `https://tr1h.github.io/huma-chain-xyz/nft-mint.html?user_id=YOUR_TELEGRAM_ID`
2. Попробуй mint Bronze NFT
3. Проверь console logs

**Ожидаемый результат:**
```
✅ On-chain distribution successful
```

**Если ошибка:**
- Проверь Railway logs
- Убедись что keypairs добавлены правильно
- Проверь что payer wallet имеет SOL (Devnet)

---

## 🔍 Troubleshooting

### **"Keypair not found" Error**

**Проблема:** `load_keypairs.php` не создал файлы

**Решение:**
1. Проверь что env vars добавлены правильно
2. Проверь Railway logs на ошибки
3. Убедись что переменные называются точно:
   - `SOLANA_PAYER_KEYPAIR` (не `SOLANA_PAYER_KEYPAIR_PATH`)
   - `SOLANA_P2E_POOL_KEYPAIR` (не `SOLANA_P2E_POOL_KEYPAIR_PATH`)

---

### **"Insufficient funds" Error**

**Проблема:** Payer wallet не имеет SOL для fees

**Решение:**
```bash
# Get payer address
solana-keygen pubkey payer-keypair.json

# Fund with Devnet SOL
solana airdrop 5 PAYER_ADDRESS --url devnet
```

---

### **"P2E Pool has no TAMA" Error**

**Проблема:** P2E Pool wallet не имеет TAMA tokens

**Решение:**
```bash
# Check balance
spl-token balance Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --url devnet

# If low, mint more
spl-token mint Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  100000000 \
  HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --url devnet
```

---

## 📝 Summary

**Что мы делаем:**
1. ✅ Добавляем keypairs как env vars в Railway
2. ✅ `load_keypairs.php` автоматически создает файлы при старте
3. ✅ Backend может выполнять on-chain транзакции

**Результат:**
- ✅ Real SPL Token transfers работают
- ✅ Bronze NFT mint с on-chain распределением
- ✅ Прозрачность на Solscan

---

## 🎯 Next Steps After Setup

1. **Fund Payer Wallet** (если еще не сделано)
2. **Test NFT Mint** (попробуй mint Bronze NFT)
3. **Check Solscan** (убедись что транзакции видны)
4. **Monitor Logs** (следи за ошибками)

**Готово!** 🚀

