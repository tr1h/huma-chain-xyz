# 🎯 Bronze NFT On-Chain Distribution READY

## ✅ Реализовано

Backend endpoint для **реальных on-chain SPL Token transfers** при Bronze NFT mint.

---

## 📋 Что Работает

### **Endpoint:** `POST /api/tama/nft/mint-bronze-onchain`

**Request:**
```json
{
  "telegram_id": "202140267",
  "tier": "Bronze",
  "rarity": "Common",
  "multiplier": 2.0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bronze NFT on-chain distribution completed",
  "tier": "Bronze",
  "rarity": "Common",
  "multiplier": 2.0,
  "distribution": {
    "burn": 1000,
    "treasury": 750,
    "p2e_pool": 750
  },
  "transactions": {
    "burn": {
      "amount": 1000,
      "signature": "5k8s9...",
      "explorer_url": "https://explorer.solana.com/tx/5k8s9...?cluster=devnet"
    },
    "treasury": {
      "amount": 750,
      "signature": "3x7f2...",
      "explorer_url": "https://explorer.solana.com/tx/3x7f2...?cluster=devnet"
    },
    "p2e_pool": {
      "amount": 750,
      "signature": "9y4k1...",
      "explorer_url": "https://explorer.solana.com/tx/9y4k1...?cluster=devnet"
    }
  }
}
```

---

## 🔄 Реальные Транзакции

### **Transaction 1: BURN (1,000 TAMA)**
```
FROM: P2E Pool (HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw)
TO: Burn Address (1nc1nerator11111111111111111111111111111111)
AMOUNT: 1,000 TAMA
FEE PAYER: Backend (payer-keypair.json)
```

### **Transaction 2: TREASURY (750 TAMA)**
```
FROM: P2E Pool (HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw)
TO: Treasury Main (6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM)
AMOUNT: 750 TAMA
FEE PAYER: Backend (payer-keypair.json)
```

### **Transaction 3: P2E POOL REFUND (750 TAMA)**
```
FROM: P2E Pool (HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw)
TO: P2E Pool (HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw)
AMOUNT: 750 TAMA
FEE PAYER: Backend (payer-keypair.json)
```

---

## 📊 Database Logging

Все транзакции логируются в `transactions` таблицу:

### **1. Burn Transaction**
```sql
user_id: 'BURN_ADDRESS'
username: '🔥 Token Burn'
type: 'burn_from_bronze_nft_onchain'
amount: 1000
metadata: {
  "source": "bronze_nft_mint_onchain",
  "tier": "Bronze",
  "rarity": "Common",
  "user": "202140267",
  "transaction_signature": "5k8s9..."
}
```

### **2. Treasury Transaction**
```sql
user_id: '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM'
username: '💰 Treasury Main V2'
type: 'treasury_income_from_nft_onchain'
amount: 750
metadata: {
  "source": "bronze_nft_mint_onchain",
  "tier": "Bronze",
  "rarity": "Common",
  "user": "202140267",
  "transaction_signature": "3x7f2..."
}
```

### **3. P2E Pool Transaction**
```sql
user_id: 'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw'
username: '🎮 P2E Pool Refund'
type: 'p2e_pool_refund_from_nft_onchain'
amount: 750
metadata: {
  "source": "bronze_nft_mint_onchain",
  "tier": "Bronze",
  "rarity": "Common",
  "user": "202140267",
  "transaction_signature": "9y4k1..."
}
```

---

## ⚙️ Требования

### **Backend:**
1. Solana CLI установлен (`spl-token`)
2. `payer-keypair.json` (для fees)
3. `p2e-pool-keypair.json` (source wallet)
4. P2E Pool имеет TAMA токены
5. Payer wallet имеет SOL для fees

### **Environment Variables:**
```bash
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PAYER_KEYPAIR_PATH=/path/to/payer-keypair.json
SOLANA_P2E_POOL_KEYPAIR_PATH=/path/to/p2e-pool-keypair.json
```

---

## 🚀 Deployment на Railway

### **Step 1: Add Environment Variables**
Railway Dashboard → Variables:
```
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PAYER_KEYPAIR_PATH=/app/payer-keypair.json
SOLANA_P2E_POOL_KEYPAIR_PATH=/app/p2e-pool-keypair.json
```

### **Step 2: Add Keypairs as Secrets**
Railway Dashboard → Variables → Add keypair files:
```
PAYER_KEYPAIR_JSON=[1,2,3...] # array format
P2E_POOL_KEYPAIR_JSON=[1,2,3...] # array format
```

### **Step 3: Create Keypair Files in Start Script**
`start.sh`:
```bash
#!/bin/bash

# Create keypair files from environment variables
echo $PAYER_KEYPAIR_JSON > /app/payer-keypair.json
echo $P2E_POOL_KEYPAIR_JSON > /app/p2e-pool-keypair.json

# Start PHP server
php -S 0.0.0.0:${PORT} -t . api/tama_supabase.php
```

### **Step 4: Install Solana CLI**
`Dockerfile`:
```dockerfile
FROM php:8.2-apache

# Install Solana CLI
RUN apt-get update && apt-get install -y wget
RUN sh -c "$(wget -O - https://release.solana.com/stable/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Copy project files
COPY . /var/www/html/
```

---

## 🧪 Тестирование

### **Локально:**
```bash
# 1. Start API server
cd api
php -S localhost:8000 tama_supabase.php

# 2. Test endpoint
curl -X POST http://localhost:8000/nft/mint-bronze-onchain \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": "202140267",
    "tier": "Bronze",
    "rarity": "Common",
    "multiplier": 2.0
  }'
```

### **Railway:**
```bash
curl -X POST https://huma-chain-xyz-production.up.railway.app/api/tama/nft/mint-bronze-onchain \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": "202140267",
    "tier": "Bronze",
    "rarity": "Common",
    "multiplier": 2.0
  }'
```

---

## 📝 Next Steps

1. **Для Frontend:** обновить `nft-mint.html` для использования on-chain endpoint
2. **Для Silver/Gold:** реализовать on-chain SOL distribution (уже есть в frontend)
3. **Проверить P2E Pool balance:** убедиться что P2E Pool имеет достаточно TAMA
4. **Настроить Railway:** добавить keypairs и Solana CLI

---

## ✅ Готово

Backend endpoint готов! Теперь при Bronze NFT mint выполняются:
- ✅ Реальные on-chain SPL Token transfers
- ✅ Burn 40% (1,000 TAMA)
- ✅ Treasury 30% (750 TAMA)
- ✅ P2E Pool refund 30% (750 TAMA)
- ✅ Логирование всех транзакций
- ✅ Solana Explorer links

**Следующий шаг:** протестировать endpoint и обновить frontend.

