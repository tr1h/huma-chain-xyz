# 🚀 Railway Solana CLI Setup - Complete Guide

## ✅ Changes Made

### 1. Updated `Dockerfile`

**Added:**
- ✅ Rust/Cargo installation
- ✅ Solana CLI v1.18.18
- ✅ spl-token CLI v3.4.0
- ✅ Build tools (gcc, pkg-config, libssl-dev)
- ✅ Verification steps for each tool

**Build time:** ~5-10 minutes (first time, then cached)

---

### 2. Created `api/load_keypairs.php`

**Purpose:** Load keypairs from Railway environment variables

**How it works:**
```php
SOLANA_PAYER_KEYPAIR (env) → /app/payer-keypair.json (file)
SOLANA_P2E_POOL_KEYPAIR (env) → /app/p2e-pool-keypair.json (file)
```

**Auto-loaded** in `api/tama_supabase.php`

---

## 📋 Railway Setup Steps

### Step 1: Push Dockerfile to GitHub

```bash
git add Dockerfile api/load_keypairs.php api/tama_supabase.php .docs/RAILWAY_SOLANA_SETUP.md
git commit -m "Add Solana CLI to Railway Dockerfile"
git push origin main
```

✅ **Already done!**

---

### Step 2: Set Railway Environment Variables

Go to: Railway → Your Project → Variables

Add these variables:

#### **Required Variables:**

```env
# Supabase
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Solana
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com

# Keypair Paths
SOLANA_PAYER_KEYPAIR_PATH=/app/payer-keypair.json
SOLANA_P2E_POOL_KEYPAIR_PATH=/app/p2e-pool-keypair.json
```

#### **Keypair Contents (IMPORTANT!):**

You need to add the **actual keypair JSON** as environment variables:

**Get your keypairs:**
```bash
# On your local machine
cat payer-keypair.json
cat p2e-pool-keypair.json
```

**Add to Railway as:**
```
SOLANA_PAYER_KEYPAIR=[1,2,3,4,5,...]
SOLANA_P2E_POOL_KEYPAIR=[1,2,3,4,5,...]
```

⚠️ **Copy the ENTIRE JSON array!** Example:
```
[174,47,154,16,202,193,206,113,199,190,53,133,169,175,31,56,78,252,218,64,143,91,219,128,127,157,212,127,203,65,105,194,123,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34]
```

---

### Step 3: Fund Payer Wallet (Devnet SOL)

**After deployment, check payer address:**

```bash
# On your local machine (to get payer address)
solana-keygen pubkey payer-keypair.json
```

**Example output:** `9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin`

**Fund with Devnet SOL:**
```bash
solana airdrop 5 9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin --url devnet

# Check balance
solana balance 9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin --url devnet
```

**Should show:** `5 SOL`

---

### Step 4: Verify P2E Pool Has TAMA

```bash
spl-token balance Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --url devnet
```

**Expected:** `400000000` (or similar)

**If low, mint more:**
```bash
spl-token mint Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  100000000 \
  HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --url devnet
```

---

### Step 5: Trigger Railway Rebuild

Railway should **auto-rebuild** after pushing Dockerfile.

**Or manually:**
1. Go to Railway → Deployments
2. Click "Redeploy" on latest deployment

**Build will take ~5-10 minutes** (first time due to Rust/Solana install)

---

### Step 6: Check Build Logs

Watch Railway logs for:

```
✅ RUN rustc --version && cargo --version
   rustc 1.75.0
   cargo 1.75.0

✅ RUN solana --version
   solana-cli 1.18.18

✅ RUN spl-token --version
   spl-token-cli 3.4.0
```

If all show versions → **SUCCESS!** ✅

---

### Step 7: Test On-Chain Mint

Try minting Bronze NFT:

```
https://tr1h.github.io/huma-chain-xyz/nft-mint.html?user_id=YOUR_TELEGRAM_ID
```

**Expected:**
- ✅ NFT minted successfully
- ✅ Console log: "✅ On-chain distribution successful"
- ✅ Solscan shows 3 new transactions

**Check Solscan:**
```
P2E Pool: https://solscan.io/account/HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw?cluster=devnet
Treasury: https://solscan.io/account/6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM?cluster=devnet
```

---

## 🐛 Troubleshooting

### Build Fails: "Rust installation timeout"

**Fix:** Rust compilation can be slow. Railway may timeout.

**Solution:** Split into stages or use pre-built Docker image:

```dockerfile
# Alternative: Use pre-built Rust image
FROM rust:1.75 as builder
RUN cargo install spl-token-cli

FROM php:8.2-apache
COPY --from=builder /usr/local/cargo/bin/spl-token /usr/local/bin/
COPY --from=builder /usr/local/cargo/bin/solana /usr/local/bin/
# ... rest of setup
```

---

### Keypairs Not Loading

**Check Railway logs:**
```
✅ Keypair loaded: /app/payer-keypair.json
✅ Keypair loaded: /app/p2e-pool-keypair.json
```

**If not shown:**
- Verify env vars `SOLANA_PAYER_KEYPAIR` and `SOLANA_P2E_POOL_KEYPAIR` are set
- Check they contain valid JSON array (not file path!)

---

### "Insufficient funds for transaction"

**Payer wallet needs SOL for fees!**

```bash
solana airdrop 5 PAYER_ADDRESS --url devnet
```

---

### "spl-token: command not found" (still!)

**Check Railway shell:**
```bash
# SSH into Railway container (if possible)
which spl-token
spl-token --version
```

**If not found:** Dockerfile build didn't complete properly. Rebuild.

---

## 📊 Expected Results

### After Successful Setup:

**Bronze NFT Mint:**
```
User clicks "Mint" →
  Frontend: TAMA balance decreases
  Backend: 3 SPL Token transfers
  Blockchain: 3 transactions on Solscan
  
Transactions visible:
  1. Burn: 1,000 TAMA → 1nc1nerator...
  2. Treasury: 750 TAMA → 6rY5in...
  3. P2E Pool: 750 TAMA → HPQf1M...
```

**Admin Panel:**
```
https://tr1h.github.io/huma-chain-xyz/transactions-admin.html

Shows:
  • nft_mint_onchain (user spent 2,500 TAMA)
  • burn_from_bronze_nft_onchain (1,000 TAMA)
  • treasury_income_from_nft_onchain (750 TAMA)
  • p2e_pool_refund_from_nft_onchain (750 TAMA)
```

---

## ✅ Checklist

Setup Complete:
- [ ] Dockerfile updated with Solana CLI
- [ ] `load_keypairs.php` created
- [ ] Railway env vars set (SUPABASE, TAMA_MINT, etc)
- [ ] Keypair JSONs added to Railway env
- [ ] Payer wallet funded with Devnet SOL
- [ ] P2E Pool has TAMA tokens
- [ ] Railway rebuild triggered
- [ ] Build logs show Solana installed
- [ ] Test mint successful
- [ ] Solscan shows transactions

---

## 🎯 Summary

**What Changed:**
1. ✅ Dockerfile now installs Rust + Solana + spl-token
2. ✅ Keypairs loaded from env vars automatically
3. ✅ Backend can execute real on-chain transfers
4. ✅ Bronze NFT mint triggers real blockchain transactions

**Time:** ~15-20 minutes total (mostly waiting for build)

**Result:** REAL on-chain Bronze NFT distribution! 🚀

