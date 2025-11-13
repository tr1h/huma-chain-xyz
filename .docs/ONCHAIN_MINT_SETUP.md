# 🚀 On-Chain Mint Setup - Complete Guide

## 📋 Overview

Backend API для создания настоящих on-chain NFT через Metaplex SDK.

---

## ✅ Шаг 1: Установить зависимости

```bash
cd C:\goooog
npm install @metaplex-foundation/js@^0.20.1 @solana/web3.js@^1.95.0
```

**Важно:** Используем `@solana/web3.js@^1.95.0` (не 2.0.0), так как Metaplex SDK 0.20.x совместим с 1.x.

---

## ✅ Шаг 2: Настроить environment variables на Render.com

### 2.1 Перейти в Render.com

https://dashboard.render.com/

### 2.2 Выбрать API service

Найдите ваш API service (например, `huma-chain-xyz-api`)

### 2.3 Добавить environment variables

В разделе **Environment** добавьте:

```bash
# Solana Payer Keypair (для минта NFT)
SOLANA_PAYER_KEYPAIR=[YOUR_PAYER_KEYPAIR_ARRAY]

# Treasury Wallet (для royalties)
TREASURY_WALLET=6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM

# Solana RPC URL
SOLANA_RPC_URL=https://api.devnet.solana.com

# Supabase (уже должны быть)
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.4 Получить SOLANA_PAYER_KEYPAIR

#### Вариант А: Использовать существующий keypair

```bash
# Читаем payer-keypair.json
cat payer-keypair.json

# Копируем весь массив и вставляем в Render
# Например: [123,45,67,89,...]
```

#### Вариант Б: Создать новый keypair

```bash
# Установить Solana CLI
npm install -g @solana/cli

# Создать новый keypair
solana-keygen new --outfile new-payer-keypair.json

# Скопировать pubkey
solana-keygen pubkey new-payer-keypair.json

# Получить SOL из faucet (devnet)
solana airdrop 2 YOUR_PUBKEY --url devnet

# Прочитать keypair
cat new-payer-keypair.json
```

---

## ✅ Шаг 3: Обновить Render.com deploy

### 3.1 Создать/обновить `render.yaml`

```yaml
services:
  # Существующий PHP API service
  - type: web
    name: huma-chain-xyz-api
    runtime: php
    # ... existing config ...

  # Новый Node.js service для on-chain mint
  - type: web
    name: nft-onchain-api
    runtime: node
    buildCommand: npm install
    startCommand: npm run start:onchain
    envVars:
      - key: SOLANA_PAYER_KEYPAIR
        sync: false
      - key: TREASURY_WALLET
        value: 6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM
      - key: SOLANA_RPC_URL
        value: https://api.devnet.solana.com
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_KEY
        sync: false
```

### 3.2 Deploy

```bash
git add .
git commit -m "Add on-chain NFT minting API"
git push origin main
```

Render.com автоматически задеплоит новый service.

---

## ✅ Шаг 4: Интегрировать в `mint.html`

### 4.1 Добавить функцию вызова on-chain mint

В `mint.html` в функции `mintSOL()` после успешного API вызова:

```javascript
if (result.success) {
    // Existing code...
    
    // ✅ NEW: Call on-chain mint API
    try {
        console.log('💎 Calling on-chain mint API...');
        
        const onchainResponse = await fetch('https://nft-onchain-api.onrender.com/api/mint-nft-onchain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nft_id: result.nft_id || null,  // ID from user_nfts
                tier: tierName,
                rarity: result.rarity,
                multiplier: result.earning_multiplier,
                telegram_id: TELEGRAM_USER_ID,
                wallet_address: walletAddress
            })
        });
        
        if (onchainResponse.ok) {
            const onchainResult = await onchainResponse.json();
            if (onchainResult.success) {
                console.log('✅ On-chain NFT minted:', onchainResult.mintAddress);
                message += `\n\n🎨 On-chain NFT: ${onchainResult.mintAddress.substring(0, 8)}...`;
                explorerLink = onchainResult.explorerUrl;
            }
        } else {
            console.warn('⚠️  On-chain mint failed (non-critical):', await onchainResponse.text());
        }
    } catch (onchainError) {
        console.warn('⚠️  On-chain mint error (non-critical):', onchainError);
        // Don't fail if on-chain mint fails
    }
    
    showNotification('success', `🎉 ${tierName} NFT Minted!`, message, explorerLink);
    // ...
}
```

---

## ✅ Шаг 5: Тестирование

### 5.1 Проверить endpoint

```bash
curl https://nft-onchain-api.onrender.com/health
# Должно вернуть: {"status":"ok","service":"NFT On-Chain Minting API","timestamp":"..."}
```

### 5.2 Тестовый минт

```bash
curl -X POST https://nft-onchain-api.onrender.com/api/mint-nft-onchain \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "Bronze",
    "rarity": "Common",
    "multiplier": 2.0,
    "wallet_address": "AX4vtEbDEjRxibdPX7fcCB8Nq8VxF82PLWzHHusXJFk3"
  }'
```

### 5.3 Проверить в Solana Explorer

Откройте полученный `mintAddress` в Explorer:
```
https://explorer.solana.com/address/MINT_ADDRESS?cluster=devnet
```

---

## 📊 Стоимость

**Devnet:**
- Mint NFT: ~0.01 SOL (бесплатно через faucet)
- Metadata storage (Arweave): Бесплатно через Bundlr devnet

**Mainnet:**
- Mint NFT: ~0.01-0.02 SOL (~$1.50-3.00)
- Metadata storage: ~$0.01-0.05

---

## 🔍 Troubleshooting

### Ошибка: "SOLANA_PAYER_KEYPAIR not set"

Проверьте, что environment variable добавлена в Render.com.

### Ошибка: "Insufficient funds"

Пополните payer wallet SOL из faucet:
```bash
solana airdrop 2 YOUR_PAYER_PUBKEY --url devnet
```

### Ошибка: "Metadata upload failed"

Bundlr может быть недоступен. Попробуйте позже или используйте другой storage provider.

---

## 🚀 Готово!

После выполнения всех шагов:
- ✅ NFT будут минтится on-chain через Metaplex
- ✅ `nft_mint_address` будет обновляться в базе
- ✅ NFT будут видны в Phantom Wallet
- ✅ Можно будет продавать на Magic Eden

---

## 📚 Полезные ссылки

- [Metaplex JS SDK Docs](https://docs.metaplex.com/js/)
- [Render.com Docs](https://render.com/docs)
- [Solana CLI Docs](https://docs.solana.com/cli)

