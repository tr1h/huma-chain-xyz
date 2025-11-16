# ✅ ON-CHAIN NFT MINTING - ЧЕКЛИСТ

**Дата:** 14 ноября 2025  
**Статус:** 🔄 В процессе исправления

---

## ✅ ЧТО ИСПРАВЛЕНО:

### 1. **Синтаксическая ошибка** ✅
- **Проблема:** `SyntaxError: await is only valid in async functions`
- **Решение:** 
  - Сделал `initMetaplex()` async функцией
  - Добавил `await` при вызове `initMetaplex()`
- **Коммит:** `98dab77 - Fix async/await syntax in on-chain NFT minting`
- **Деплой:** Автоматически через GitHub → Render

---

## 🔍 ЧТО НУЖНО ПРОВЕРИТЬ:

### 1. **Переменные окружения на Render** 🔴
Проверь в [Render Dashboard](https://dashboard.render.com/web/srv-d4b6hinpm1nc73bjgva0):
- ✅ `SOLANA_PAYER_KEYPAIR` - Private key в base58 формате
- ✅ `SUPABASE_URL` - https://zfrazyupameidxpjihrh.supabase.co
- ✅ `SUPABASE_KEY` - Service role key
- ✅ `SOLANA_NETWORK` - devnet

**Как добавить SOLANA_PAYER_KEYPAIR:**
1. Открой файл `payer-keypair.json` (локально, НЕ пушить в git!)
2. Преобразуй в base58:
   ```bash
   # Используй онлайн конвертер или Node.js:
   const bs58 = require('bs58');
   const keypair = require('./payer-keypair.json');
   const base58Key = bs58.encode(Buffer.from(keypair));
   console.log(base58Key);
   ```
3. Добавь в Render Environment Variables

---

### 2. **SOL на payer wallet** 🔴
Payer wallet должен иметь минимум **0.1 SOL** на Devnet для:
- Arweave storage fees (~0.005 SOL за upload)
- NFT mint fees (~0.002 SOL)
- Transaction fees (~0.000005 SOL)

**Как пополнить:**
1. Узнай адрес payer wallet:
   ```bash
   # Из логов Render после деплоя:
   # "✅ Payer loaded: АДРЕС_КОШЕЛЬКА"
   ```
2. Получи Devnet SOL:
   - Через Solana CLI: `solana airdrop 1 АДРЕС --url devnet`
   - Или онлайн: https://faucet.solana.com/

---

### 3. **Логи деплоя на Render** 🟡
После push проверь логи:
1. Открой https://dashboard.render.com/web/srv-d4b6hinpm1nc73bjgva0
2. Вкладка "Logs"
3. Должно быть:
   ```
   ✅ Payer loaded: [адрес]
   💰 Payer balance: [баланс] SOL
   ✅ Metaplex initialized with Bundlr storage
   🚀 NFT On-Chain Minting API running on port 3001
   ```

**Если ошибка "Insufficient SOL balance":**
- Пополни payer wallet через Solana faucet

---

### 4. **Тест API эндпоинта** 🟢
После успешного деплоя протестируй:

```bash
# Health check
curl https://api.solanatamagotchi.com/api/mint-nft-onchain

# Должен вернуть:
# {"status":"ok","message":"NFT On-Chain Minting API is running"}
```

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ:

### Шаг 1: Дождись деплоя (2-3 минуты)
- Render автоматически задеплоит после push
- Следи за логами в реальном времени

### Шаг 2: Проверь логи
- Должно быть: "🚀 NFT On-Chain Minting API running"
- Если ошибка - смотри что не хватает (env vars / SOL)

### Шаг 3: Добавь недостающие env vars
- Особенно `SOLANA_PAYER_KEYPAIR` если его нет

### Шаг 4: Пополни payer wallet
- Минимум 0.1 SOL на Devnet

### Шаг 5: Тестируй минт!
- Открой https://solanatamagotchi.com/mint.html
- Подключи Phantom wallet
- Заминть NFT за SOL
- Проверь в Solana Explorer что NFT реальный

---

## 📋 ТЕКУЩИЙ СТАТУС:

- ✅ Код исправлен (async/await)
- ✅ Запушен на GitHub
- 🔄 Render деплоит...
- ⏳ Ожидаем результатов деплоя
- ❓ Проверка env vars (нужно сделать)
- ❓ Проверка SOL balance (нужно сделать)

---

## 🔗 ПОЛЕЗНЫЕ ССЫЛКИ:

- **Render Dashboard:** https://dashboard.render.com/web/srv-d4b6hinpm1nc73bjgva0
- **GitHub Repo:** https://github.com/tr1h/huma-chain-xyz
- **Solana Faucet:** https://faucet.solana.com/
- **Solana Explorer:** https://explorer.solana.com/?cluster=devnet
- **API Endpoint:** https://api.solanatamagotchi.com/api/mint-nft-onchain

---

## 💡 ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ:

### Ошибка: "SOLANA_PAYER_KEYPAIR environment variable not set"
→ Добавь переменную в Render Environment Variables

### Ошибка: "Insufficient SOL balance"
→ Пополни payer wallet через Solana faucet

### Ошибка: "Failed to upload metadata"
→ Проверь что payer wallet имеет достаточно SOL

### Ошибка: "Connection timeout"
→ Проверь что Solana RPC endpoint работает (devnet может быть медленным)

---

**Следующее действие:** Дождись деплоя и проверь логи! 🚀



