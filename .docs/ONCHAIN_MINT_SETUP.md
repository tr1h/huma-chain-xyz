# 🚀 On-Chain NFT Minting Setup

## Создано

### 1. Backend API (Node.js)
- `api/mint-nft-onchain.js` - Основная логика минта через Metaplex SDK
- `api/nft-onchain-server.js` - Express server (standalone)
- `api/mint-nft-onchain-wrapper.php` - PHP wrapper для вызова Node.js

### 2. Обновлен `package.json`
- Добавлен `@metaplex-foundation/js`
- Обновлен `@solana/web3.js` до совместимой версии
- Добавлен `bs58` для декодирования ключей

---

## Установка зависимостей

```bash
cd C:\goooog
npm install
```

Это установит:
- `@metaplex-foundation/js@^0.20.1`
- `@solana/web3.js@^1.95.3`
- `bs58@^5.0.0`

---

## Настройка Render.com

### Вариант 1: Добавить в существующий PHP API

1. Откройте Render.com Dashboard
2. Перейдите в ваш API service
3. Добавьте environment variables:

```
SOLANA_PAYER_KEYPAIR=<base58_private_key>
SOLANA_NETWORK=devnet
NODE_BACKEND_URL=http://localhost:3001/api/mint-nft-onchain
```

4. Обновите `render.yaml`:

```yaml
services:
  - type: web
    name: solanatamagotchi-api
    env: node
    buildCommand: npm install
    startCommand: node api/nft-onchain-server.js
    envVars:
      - key: SOLANA_PAYER_KEYPAIR
        sync: false
      - key: SOLANA_NETWORK
        value: devnet
      - key: SUPABASE_URL
        value: https://zfrazyupameidxpjihrh.supabase.co
      - key: SUPABASE_KEY
        sync: false
```

### Вариант 2: Отдельный Node.js service

Создать новый service на Render.com:
- Name: `solanatamagotchi-nft-mint`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `node api/nft-onchain-server.js`
- Port: `3001`

---

## Получение SOLANA_PAYER_KEYPAIR

### Способ 1: Из существующего keypair

```bash
# Если у вас есть payer-keypair.json
node -e "const fs = require('fs'); const bs58 = require('bs58'); const keypair = JSON.parse(fs.readFileSync('payer-keypair.json')); console.log(bs58.encode(Buffer.from(keypair)));"
```

### Способ 2: Создать новый keypair

```bash
# Создать новый
npm install -g @solana/web3.js
node -e "const {Keypair} = require('@solana/web3.js'); const bs58 = require('bs58'); const kp = Keypair.generate(); console.log('Public Key:', kp.publicKey.toString()); console.log('Private Key (base58):', bs58.encode(kp.secretKey));"
```

### Способ 3: Использовать Treasury Main

```bash
# Если treasury-main-keypair.json существует
node -e "const fs = require('fs'); const bs58 = require('bs58'); const keypair = JSON.parse(fs.readFileSync('treasury-main-keypair.json')); console.log(bs58.encode(Buffer.from(keypair)));"
```

---

## Интеграция в mint.html

Добавьте после успешного off-chain минта:

```javascript
// In mintSOL() function, after result.success
if (result.success && result.nft_id) {
    try {
        console.log('💎 Calling on-chain mint API...');
        
        // Get NFT image URL (replace with actual implementation)
        const imageUrl = `https://solanatamagotchi.com/nft-assets/${tierName.toLowerCase()}/${result.rarity.toLowerCase()}.png`;
        
        // Call on-chain mint API
        const onchainResponse = await fetch('https://api.solanatamagotchi.com/api/mint-nft-onchain-wrapper.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nft_id: result.nft_id,
                tier: tierName,
                rarity: result.rarity,
                multiplier: result.earning_multiplier,
                imageUrl: imageUrl,
                telegramId: TELEGRAM_USER_ID,
                walletAddress: walletAddress,
                design_number: result.design_number
            })
        });
        
        const onchainResult = await onchainResponse.json();
        
        if (onchainResult.success) {
            console.log('✅ On-chain NFT minted:', onchainResult.mintAddress);
            message += `\n\n🎨 On-chain mint: ${onchainResult.mintAddress.substring(0, 8)}...`;
            explorerLink = onchainResult.explorerUrl;
        } else {
            console.warn('⚠️ On-chain mint failed, but off-chain NFT created');
        }
    } catch (onchainError) {
        console.error('❌ On-chain mint error (non-critical):', onchainError);
        // Don't throw - off-chain NFT is already created
    }
}
```

---

## Тестирование

### 1. Локальное тестирование

```bash
# Terminal 1: Start Node.js server
cd C:\goooog
node api/nft-onchain-server.js

# Terminal 2: Test endpoint
curl -X POST http://localhost:3001/api/mint-nft-onchain \
  -H "Content-Type: application/json" \
  -d '{
    "nft_id": 1,
    "tier": "Bronze",
    "rarity": "Common",
    "multiplier": 2.0,
    "imageUrl": "https://via.placeholder.com/512",
    "telegramId": "123456789",
    "walletAddress": "...",
    "design_number": "BRZ001"
  }'
```

### 2. Health check

```bash
curl http://localhost:3001/api/mint-nft-onchain/health
```

---

## Стоимость

**Devnet:**
- Mint NFT: ~0.01 SOL (бесплатно через faucet)
- Metadata storage (Arweave devnet): Бесплатно

**Mainnet:**
- Mint NFT: ~0.01-0.02 SOL (~$1.50-3.00)
- Metadata storage (Arweave): ~$0.01-0.05

---

## Troubleshooting

### Ошибка: "SOLANA_PAYER_KEYPAIR not set"
- Добавьте environment variable в Render.com

### Ошибка: "Failed to upload metadata"
- Проверьте интернет соединение
- Проверьте, что imageUrl доступен
- Увеличьте timeout (60 секунд)

### Ошибка: "Insufficient funds"
- Devnet: Получите SOL из faucet
- Mainnet: Пополните payer wallet

---

## Следующие шаги

1. ✅ Установить зависимости: `npm install`
2. ✅ Получить `SOLANA_PAYER_KEYPAIR` (base58)
3. ✅ Добавить environment variable в Render.com
4. ✅ Деплой на Render.com
5. ✅ Протестировать endpoint
6. ✅ Интегрировать в `mint.html`
7. ✅ Загрузить изображения NFT
8. ✅ Протестировать полный flow

---

## Готово к использованию!

После установки зависимостей и настройки Render.com, on-chain минт будет работать автоматически.
