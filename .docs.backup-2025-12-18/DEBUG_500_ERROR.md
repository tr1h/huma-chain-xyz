# 🔴 500 Error on Bronze NFT Mint - Debug Guide

## Error Details

```
POST /api/tama/nft/mint-bronze-onchain
Status: 500 Internal Server Error
```

## Possible Causes

### 1. **spl-token CLI не установлен на Railway**

**Check:**
```bash
# В Railway shell
which spl-token
spl-token --version
```

**Fix:**
Railway нужно установить Solana CLI tools. Добавь в `Dockerfile`:

```dockerfile
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (required for spl-token)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install spl-token CLI
RUN cargo install spl-token-cli

# Copy project files
COPY . /var/www/html/

# Configure Apache
RUN a2enmod rewrite
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Set working directory
WORKDIR /var/www/html

# Expose port
EXPOSE 8080

# Start Apache
CMD ["apache2-foreground"]
```

---

### 2. **Keypair files не загружены на Railway**

**Check:**
```bash
# В Railway shell
ls -la /app/*.json
# Should show:
# /app/payer-keypair.json
# /app/p2e-pool-keypair.json
```

**Fix:**
Upload keypairs to Railway:
1. Go to Railway project
2. Settings → Variables
3. Add file secrets:
   - `SOLANA_PAYER_KEYPAIR` = содержимое payer-keypair.json
   - `SOLANA_P2E_POOL_KEYPAIR` = содержимое p2e-pool-keypair.json

Update `api/tama_supabase.php`:
```php
// Write keypairs from env to files if they don't exist
if (!file_exists($payerKeypair) && getenv('SOLANA_PAYER_KEYPAIR')) {
    file_put_contents($payerKeypair, getenv('SOLANA_PAYER_KEYPAIR'));
}
if (!file_exists($p2ePoolKeypair) && getenv('SOLANA_P2E_POOL_KEYPAIR')) {
    file_put_contents($p2ePoolKeypair, getenv('SOLANA_P2E_POOL_KEYPAIR'));
}
```

---

### 3. **Payer keypair нет SOL для fees (Devnet)**

**Check:**
```bash
solana balance PAYER_ADDRESS --url devnet
```

**Fix:**
```bash
# Fund payer wallet with Devnet SOL
solana airdrop 2 PAYER_ADDRESS --url devnet
```

**Or check Railway logs for:**
```
Error: insufficient funds for transaction
```

---

### 4. **P2E Pool нет TAMA tokens**

**Check:**
```bash
spl-token balance Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --url devnet
```

**Expected:** 400M+ TAMA

**If low:** Mint more to P2E Pool:
```bash
spl-token mint Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  100000000 \
  HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --url devnet
```

---

### 5. **PHP proc_open disabled**

**Check Railway logs for:**
```
Error: proc_open() has been disabled for security reasons
```

**Fix:**
Update Railway PHP config or use alternative method (e.g., curl to local CLI wrapper).

---

### 6. **Environment variables not set**

**Check:**
```php
$tamaMint = getenv('TAMA_MINT_ADDRESS');
$rpcUrl = getenv('SOLANA_RPC_URL');
```

**Fix in Railway:**
```
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PAYER_KEYPAIR_PATH=/app/payer-keypair.json
SOLANA_P2E_POOL_KEYPAIR_PATH=/app/p2e-pool-keypair.json
```

---

## How to Debug

### 1. Check Railway Logs

Go to Railway → Your project → Logs

Look for:
```
POST /api/tama/nft/mint-bronze-onchain
[ERROR] ...
```

### 2. Add More Logging

Update `api/tama_supabase.php`:
```php
function handleBronzeNFTOnChain($url, $key) {
    error_log('🔵 handleBronzeNFTOnChain called');
    error_log('🔵 Input: ' . json_encode($input));
    
    try {
        error_log('🔵 Checking spl-token CLI...');
        $splTokenCheck = shell_exec('spl-token --version 2>&1');
        error_log('🔵 spl-token version: ' . $splTokenCheck);
        
        error_log('🔵 Checking keypairs...');
        error_log('🔵 Payer exists: ' . (file_exists($payerKeypair) ? 'YES' : 'NO'));
        error_log('🔵 P2E Pool exists: ' . (file_exists($p2ePoolKeypair) ? 'YES' : 'NO'));
        
        // ... rest of code
    } catch (Exception $e) {
        error_log('❌ Error: ' . $e->getMessage());
        error_log('❌ Trace: ' . $e->getTraceAsString());
        throw $e;
    }
}
```

### 3. Test Backend Directly

```bash
curl -X POST https://huma-chain-xyz-production.up.railway.app/api/tama/nft/mint-bronze-onchain \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": "test123",
    "tier": "Bronze",
    "rarity": "Common",
    "multiplier": 2.0,
    "tama_price": 2500
  }'
```

Check response for detailed error.

---

## Quick Fix Options

### Option 1: Skip On-Chain for Now (Testing)

Временно отключи on-chain distribution в `nft-mint.html`:

```javascript
// 4. ON-CHAIN Distribution via Backend API
console.log('🔗 Calling on-chain distribution API...');

try {
    // TEMPORARILY DISABLED FOR TESTING
    console.log('⚠️ On-chain distribution temporarily disabled');
    
    // Log off-chain mint
    await supabase.from('transactions').insert({
        user_id: userId,
        username: userId,
        type: 'nft_mint',  // Not nft_mint_onchain
        amount: tamaPrice,
        balance_before: currentUser.tama,
        balance_after: newBalance,
        metadata: JSON.stringify({
            tier: selectedTier,
            rarity: rarity,
            multiplier: multiplier,
            nft_id: nftMintAddress,
            note: 'on-chain distribution disabled for testing'
        })
    });
    
} catch (onchainError) {
    // ...
}
```

**Pros:** NFT mint работает, тестируем функционал
**Cons:** Нет реальных on-chain транзакций (пока)

---

### Option 2: Fix Railway Setup (Recommended)

1. Add `Dockerfile` with Solana CLI
2. Upload keypairs as env variables
3. Fund payer with Devnet SOL
4. Redeploy Railway

---

## Next Steps

1. **Check Railway logs** - найди точную ошибку
2. **Share error message** - скажи, что написано в logs
3. **Verify setup:**
   - spl-token CLI installed?
   - Keypairs uploaded?
   - Payer has SOL?
   - P2E Pool has TAMA?

---

## Test Checklist

- [ ] Railway logs показывают ошибку
- [ ] spl-token CLI установлен
- [ ] Keypair files существуют
- [ ] Payer wallet имеет SOL
- [ ] P2E Pool имеет TAMA
- [ ] Environment variables установлены
- [ ] proc_open() работает

**Let me know what the Railway logs say!** 🔍

