# 🚀 Render.com On-Chain NFT Minting Setup

## ✅ Что сделано

1. ✅ **Добавлен новый сервис в `render.yaml`**
   - Имя: `solanatamagotchi-onchain`
   - Тип: Node.js Web Service
   - Команда запуска: `npm run start:onchain`

2. ✅ **Обновлен PHP wrapper** (`api/mint-nft-onchain-wrapper.php`)
   - Автоматически определяет URL Node.js сервера на Render.com
   - Production URL: `https://solanatamagotchi-onchain.onrender.com/api/mint-nft-onchain`

---

## 📋 Шаги для деплоя на Render.com

### Шаг 1: Push изменений в GitHub

```bash
git add render.yaml api/mint-nft-onchain-wrapper.php
git commit -m "Add Node.js on-chain minting service to Render.com"
git push origin main
```

### Шаг 2: Render.com автоматически создаст новый сервис

После push в GitHub, Render.com:
1. Обнаружит новый сервис в `render.yaml`
2. Создаст новый Web Service с именем `solanatamagotchi-onchain`
3. Начнет build и deploy

### Шаг 3: Настроить Environment Variables

В Render.com Dashboard → `solanatamagotchi-onchain` → Environment:

**Обязательные переменные:**

1. **SOLANA_PAYER_KEYPAIR**
   - Значение: Base58-encoded private key (из `.env` или `payer-keypair.json`)
   - Как получить:
     ```bash
     node -e "const {Keypair}=require('@solana/web3.js'); const bs58=require('bs58'); const fs=require('fs'); const kp=JSON.parse(fs.readFileSync('payer-keypair.json')); const secretKey=Uint8Array.from(kp); const payer=Keypair.fromSecretKey(secretKey); console.log('Base58:', bs58.encode(payer.secretKey));"
     ```
   - ⚠️ **Важно:** Отметьте как "Secret" (sync: false в render.yaml)

2. **SUPABASE_KEY**
   - Значение: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU`
   - ⚠️ **Важно:** Отметьте как "Secret"

**Опциональные переменные (уже в render.yaml):**
- `PORT=3001` (уже установлено)
- `SOLANA_NETWORK=devnet` (уже установлено)
- `SUPABASE_URL` (уже установлено)
- `NFT_IMAGE_BASE_URL` (уже установлено)

---

## 🔍 Проверка работы

### 1. Health Check

После деплоя проверьте:
```
https://solanatamagotchi-onchain.onrender.com/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "service": "NFT On-Chain Minting API",
  "timestamp": "2025-11-13T..."
}
```

### 2. Проверка логов

В Render.com Dashboard → `solanatamagotchi-onchain` → Logs:
- Должно быть: `🚀 NFT On-Chain Minting API running on port 3001`
- Не должно быть ошибок подключения к Solana

### 3. Тест on-chain минта

1. Откройте: `https://solanatamagotchi.com/mint.html`
2. Заминтите NFT (например, Silver)
3. Проверьте консоль браузера (F12):
   - Должно быть: `💎 Starting on-chain NFT mint...`
   - Должно быть: `📡 Calling on-chain mint API: https://api.solanatamagotchi.com/api/mint-nft-onchain`
   - Должно быть: `✅ On-chain NFT minted successfully!`

---

## ⚠️ Важно: SOL для Payer Keypair

**Перед тестированием убедитесь, что payer keypair имеет SOL!**

1. Получите Public Key:
   ```bash
   node -e "const {Keypair}=require('@solana/web3.js'); const bs58=require('bs58'); const fs=require('fs'); const kp=JSON.parse(fs.readFileSync('payer-keypair.json')); const secretKey=Uint8Array.from(kp); const payer=Keypair.fromSecretKey(secretKey); console.log('Public Key:', payer.publicKey.toString());"
   ```

2. Получите SOL из faucet:
   - https://faucet.solana.com/
   - Вставьте Public Key
   - Нужно минимум **0.1 SOL** для тестирования

---

## 🔧 Troubleshooting

### Проблема: "Failed to call Node.js backend"

**Решение:**
1. Проверьте, что сервис `solanatamagotchi-onchain` запущен в Render.com
2. Проверьте health check: `https://solanatamagotchi-onchain.onrender.com/health`
3. Проверьте логи в Render.com Dashboard

### Проблема: "CORS error"

**Решение:**
- CORS уже настроен в `api/mint-nft-onchain-wrapper.php`
- Если проблема сохраняется, проверьте логи PHP API

### Проблема: "Insufficient funds"

**Решение:**
- Payer keypair не имеет достаточно SOL
- Получите SOL из faucet (см. выше)

---

## 📝 Следующие шаги

После успешного деплоя:

1. ✅ Проверьте health check
2. ✅ Получите SOL для payer keypair
3. ✅ Протестируйте on-chain минт
4. ✅ Проверьте NFT в Solana Explorer
5. ✅ Проверьте NFT в Phantom Wallet

---

**Последнее обновление:** 13 ноября 2025

