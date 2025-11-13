# 🚀 Quick Start: On-Chain NFT Minting

## ✅ Что уже сделано

1. ✅ Backend API создан (`api/mint-nft-onchain.js`)
2. ✅ Express сервер настроен (`api/server-onchain.js`)
3. ✅ PHP wrapper создан (`api/mint-nft-onchain-wrapper.php`)
4. ✅ Frontend интегрирован (`mint.html`)
5. ✅ Router обновлен (`api/router.php`)

---

## 🎯 Быстрый запуск

### Шаг 1: Установить зависимости

```bash
npm install
```

Это установит:
- `@metaplex-foundation/js`
- `@solana/web3.js`
- `bs58` ✅ (добавлен)
- `express`
- `cors`
- `node-fetch`

### Шаг 2: Настроить Environment Variables

**Для локального запуска:**
Создайте `.env` файл в корне проекта:

```bash
# Solana Network
SOLANA_NETWORK=devnet

# Payer Keypair (base58 encoded private key)
# Получите из: payer-keypair.json или создайте новый
SOLANA_PAYER_KEYPAIR=YOUR_BASE58_PRIVATE_KEY_HERE

# Supabase (опционально, есть defaults)
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=your_key_here

# Port (опционально)
PORT=3001
```

**Для Render.com:**
Добавьте в Environment Variables:
- `SOLANA_NETWORK=devnet`
- `SOLANA_PAYER_KEYPAIR=your_base58_key`
- `SUPABASE_URL=...`
- `SUPABASE_KEY=...`
- `PORT=10000` (или оставьте пустым)

### Шаг 3: Получить Payer Keypair

**Вариант 1: Использовать существующий**
```bash
# Если у вас есть payer-keypair.json
node -e "const fs=require('fs'); const keypair=JSON.parse(fs.readFileSync('payer-keypair.json')); console.log(require('bs58').encode(keypair.secretKey))"
```

**Вариант 2: Создать новый (Devnet)**
```javascript
// В Node.js консоли
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const keypair = Keypair.generate();
console.log('Public Key:', keypair.publicKey.toString());
console.log('Private Key (base58):', bs58.encode(keypair.secretKey));
// Получите SOL из faucet: https://faucet.solana.com/
```

### Шаг 4: Запустить сервер

**Локально:**
```bash
npm run start:onchain
# или
node api/server-onchain.js
```

Должно появиться:
```
🚀 NFT On-Chain Minting API running on port 3001
📡 Endpoint: http://localhost:3001/api/mint-nft-onchain
```

**На Render.com:**
1. Создайте новый **Web Service**
2. **Build Command:** `npm install`
3. **Start Command:** `npm run start:onchain`
4. Добавьте Environment Variables
5. Deploy!

---

## 🧪 Тестирование

### 1. Проверить health endpoint:

```bash
curl http://localhost:3001/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "service": "NFT On-Chain Minting API",
  "timestamp": "..."
}
```

### 2. Протестировать минт:

Откройте `https://solanatamagotchi.com/mint.html` и попробуйте заминтить NFT.

После успешного off-chain минта автоматически вызовется on-chain минт.

### 3. Проверить в консоли браузера:

Должны увидеть:
```
💎 Starting on-chain NFT mint...
📡 Calling on-chain mint API: ...
✅ On-chain NFT minted successfully!
📍 Mint Address: ...
🔗 Explorer: ...
```

---

## 📝 Важные замечания

### 1. NFT Images

**Требуется:** Загрузить изображения NFT на CDN/IPFS

**Структура:**
```
https://solanatamagotchi.com/nft-assets/
  ├── bronze/
  │   ├── common.png
  │   ├── uncommon.png
  │   ├── rare.png
  │   ├── epic.png
  │   └── legendary.png
  ├── silver/
  │   └── ...
  ├── gold/
  │   └── ...
  ├── platinum/
  │   └── ...
  └── diamond/
      ├── epic.png
      └── legendary.png
```

**Пока изображений нет:** Используйте placeholder:
```javascript
// В mint.html функция getNFTImageUrl()
return 'https://via.placeholder.com/512'; // Временно
```

### 2. SOL Balance

**Payer keypair должен иметь SOL:**
- Devnet: Получите из https://faucet.solana.com/
- Mainnet: Пополните реальными SOL

**Стоимость минта:**
- ~0.01-0.02 SOL на NFT
- + Arweave storage (~$0.01-0.05)

### 3. Production URL

В `mint.html` уже настроено:
```javascript
const onchainApiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api/mint-nft-onchain'
    : 'https://api.solanatamagotchi.com/api/mint-nft-onchain';
```

**Для Render.com:**
Если используете отдельный сервис, обновите URL:
```javascript
: 'https://your-service.onrender.com/api/mint-nft-onchain';
```

---

## 🔧 Troubleshooting

### Ошибка: "SOLANA_PAYER_KEYPAIR not set"
**Решение:** Установите environment variable с base58 private key

### Ошибка: "Failed to upload metadata"
**Решение:** 
- Проверьте SOL баланс payer keypair
- Проверьте интернет соединение
- В Devnet получите SOL из faucet

### Ошибка: "Connection refused"
**Решение:**
- Убедитесь, что сервер запущен
- Проверьте порт (3001 по умолчанию)
- Проверьте URL в `mint.html`

### Ошибка: "bs58 is not defined"
**Решение:**
```bash
npm install bs58
```

---

## ✅ Готово!

После запуска сервера:
1. ✅ Off-chain NFT создается в базе
2. ✅ Автоматически вызывается on-chain минт
3. ✅ NFT появляется на Solana blockchain
4. ✅ Mint address обновляется в базе
5. ✅ NFT виден в Phantom Wallet!

🎉 **Ваши NFT теперь настоящие on-chain NFT на Solana!**

