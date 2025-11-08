# 🧪 Bronze NFT Mint - Comprehensive Test Plan

## 🎯 Что Тестируем

**Full Flow:**
```
User → Frontend → Backend → Solana Blockchain
  ↓
Telegram Bot отображает новый NFT
  ↓
Admin Panel показывает транзакции
```

---

## 📋 Pre-Test Checklist

### **1. Backend готов?**
```bash
# Check Railway deployment
curl https://huma-chain-xyz-production.up.railway.app/api/tama/nft/mint-bronze-onchain \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"telegram_id":"test","tier":"Bronze","rarity":"Common","multiplier":2.0,"tama_price":2500}'
```

**Expected:** JSON response с `success: true` или error message

---

### **2. Frontend обновлен?**
- ✅ `nft-mint.html` pushed to GitHub
- ✅ GitHub Pages deployed (может занять 1-2 минуты)
- ✅ Check: https://tr1h.github.io/huma-chain-xyz/nft-mint.html

---

### **3. Keypairs на месте?**

**Railway environment variables должны быть:**
```
SOLANA_P2E_POOL_KEYPAIR_PATH=/app/p2e-pool-keypair.json
SOLANA_PAYER_KEYPAIR_PATH=/app/payer-keypair.json
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com
```

**Check files exist on Railway:**
```bash
# В Railway shell (если есть доступ)
ls -la /app/*.json
```

---

### **4. Balances перед тестом:**

**P2E Pool:**
```bash
spl-token accounts Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --url https://api.devnet.solana.com
```

**Treasury Main:**
```bash
spl-token accounts Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner 6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM \
  --url https://api.devnet.solana.com
```

**Записать начальные балансы!**

---

## 🧪 Test Cases

### **Test 1: Basic Bronze NFT Mint (TAMA Payment)**

**Prerequisites:**
- User has 2,500+ TAMA в базе данных

**Steps:**
1. Open: `https://tr1h.github.io/huma-chain-xyz/nft-mint.html?user_id=YOUR_TELEGRAM_ID`
2. Check TAMA balance loads correctly
3. Select Bronze tier (🥉)
4. Select "Pay with TAMA" button
5. Click "MINT BRONZE"
6. Wait for confirmation

**Expected Results:**
- ✅ Loading message: "⏳ Minting Bronze NFT..."
- ✅ Success message with NFT details (tier, rarity, multiplier)
- ✅ TAMA balance decreased by 2,500
- ✅ Console log: "✅ On-chain distribution successful"

**Verify in Database:**
```sql
-- Check user balance
SELECT tama FROM leaderboard WHERE telegram_id = 'YOUR_TELEGRAM_ID';

-- Check new NFT
SELECT * FROM user_nfts WHERE telegram_id = 'YOUR_TELEGRAM_ID' ORDER BY minted_at DESC LIMIT 1;

-- Check transactions
SELECT * FROM transactions WHERE user_id = 'YOUR_TELEGRAM_ID' ORDER BY created_at DESC LIMIT 5;
```

**Verify On-Chain:**
```
Check Solscan Devnet:
1. P2E Pool transactions: https://solscan.io/account/HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw?cluster=devnet
2. Treasury transactions: https://solscan.io/account/6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM?cluster=devnet
3. Burn address: https://solscan.io/account/1nc1nerator11111111111111111111111111111111?cluster=devnet

Expected:
  • 3 новых транзакции TAMA
  • Burn: 1,000 TAMA
  • Treasury: 750 TAMA
  • P2E Pool: 750 TAMA (refund)
```

---

### **Test 2: Check Distribution Amounts**

**Calculate expected:**
```
Price: 2,500 TAMA
  ├─ Burn: 2,500 × 0.40 = 1,000 TAMA
  ├─ Treasury: 2,500 × 0.30 = 750 TAMA
  └─ P2E Pool: 2,500 × 0.30 = 750 TAMA
```

**Check P2E Pool balance:**
```bash
# Before mint
P2E_BEFORE=400000000  # записать из pre-test

# After mint
spl-token accounts Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --url https://api.devnet.solana.com

# Expected change
P2E_AFTER = P2E_BEFORE - 2500 + 750 = P2E_BEFORE - 1750
```

**Check Treasury balance:**
```bash
# Before mint
TREASURY_BEFORE=0  # записать из pre-test

# After mint
spl-token accounts Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner 6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM \
  --url https://api.devnet.solana.com

# Expected change
TREASURY_AFTER = TREASURY_BEFORE + 750
```

---

### **Test 3: Check Telegram Bot Display**

**Steps:**
1. Open Telegram bot
2. Send `/start`
3. Click "🖼️ My NFTs" button

**Expected Results:**
- ✅ Shows newly minted NFT
- ✅ Displays correct tier (Bronze)
- ✅ Displays correct rarity
- ✅ Displays correct multiplier (2.0-3.0x)
- ✅ Shows updated TAMA balance

---

### **Test 4: Check Web NFT Collection Page**

**Steps:**
1. Open: `https://tr1h.github.io/huma-chain-xyz/my-nfts.html?user_id=YOUR_TELEGRAM_ID`

**Expected Results:**
- ✅ NFT card displayed
- ✅ Shows Bronze tier with 🥉 emoji
- ✅ Shows rarity with correct color
- ✅ Shows earning boost (2.0-3.0x)
- ✅ Shows mint date
- ✅ Shows NFT ID

---

### **Test 5: Check Admin Panel**

**Steps:**
1. Open: `https://tr1h.github.io/huma-chain-xyz/transactions-admin.html`
2. Wait for transactions to load

**Expected Results:**
- ✅ Shows `nft_mint_onchain` transaction (user lost TAMA)
- ✅ Shows on-chain transaction signatures in metadata
- ✅ Filter by type shows all related transactions
- ✅ Total TAMA balance correct

---

### **Test 6: Dynamic Price Test (Admin Change)**

**Steps:**
1. Open: `https://tr1h.github.io/huma-chain-xyz/admin-nft-tiers.html`
2. Change Bronze price from 2,500 to 3,000 TAMA
3. Save changes
4. Mint another Bronze NFT

**Expected Results:**
- ✅ User charged 3,000 TAMA (not 2,500)
- ✅ Distribution:
  - Burn: 1,200 TAMA (40%)
  - Treasury: 900 TAMA (30%)
  - P2E Pool: 900 TAMA (30%)
- ✅ On-chain transactions reflect new amounts

**Verify:**
```sql
-- Check transaction metadata
SELECT metadata FROM transactions WHERE type = 'nft_mint_onchain' ORDER BY created_at DESC LIMIT 1;
```

Should show: `"tama_price": 3000`

---

### **Test 7: Error Handling - Insufficient Balance**

**Steps:**
1. User with < 2,500 TAMA
2. Try to mint Bronze NFT

**Expected Results:**
- ❌ Error message: "Insufficient balance"
- ❌ Mint button disabled or shows error
- ❌ No database changes
- ❌ No on-chain transactions

---

### **Test 8: Error Handling - Backend Failure**

**Simulate backend error:**
```
# Temporarily break backend (wrong keypair path, etc)
```

**Expected Results:**
- ⚠️ Alert: "On-chain distribution failed, but NFT is registered"
- ✅ NFT still created in database (off-chain)
- ✅ User balance updated
- ❌ No on-chain transactions
- ✅ Frontend doesn't crash

---

### **Test 9: Concurrent Mints**

**Steps:**
1. Open 2 browser tabs with different user IDs
2. Both mint Bronze NFT at same time

**Expected Results:**
- ✅ Both mints succeed
- ✅ Both users get unique NFTs
- ✅ Both on-chain distributions complete
- ✅ P2E Pool balance correct (reduced by 1,750 × 2)
- ✅ No race conditions

---

### **Test 10: Check NFT Boost Works**

**Steps:**
1. Mint Bronze NFT (get 2.0-3.0x multiplier)
2. Play game, earn TAMA
3. Check transaction log

**Expected Results:**
- ✅ Earned TAMA shows boosted amount
- ✅ Console log: "🎁 NFT Boost applied: X TAMA × 2.5x = Y TAMA"
- ✅ Boosted amount saved to database

---

## 🔍 Debug Checklist (If Something Fails)

### **Frontend Errors:**

1. **"Failed to fetch" or CORS error:**
   - Check Railway API is running
   - Check CORS headers in `api/tama_supabase.php`
   - Verify API URL: `https://huma-chain-xyz-production.up.railway.app/api/tama`

2. **"Insufficient balance" when you have enough:**
   - Check TAMA balance loading correctly
   - Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Check `leaderboard` table has correct balance

3. **NFT created but no on-chain distribution:**
   - Check Railway logs for errors
   - Verify keypair files exist on Railway
   - Check `spl-token` CLI installed on Railway

---

### **Backend Errors:**

1. **"spl-token CLI not found":**
   ```bash
   # Install on Railway (add to Dockerfile or nixpacks)
   cargo install spl-token-cli
   ```

2. **"Keypair not found":**
   - Check environment variables on Railway
   - Verify file paths: `/app/p2e-pool-keypair.json`
   - Upload keypairs to Railway (Settings → Volumes or env vars)

3. **"Insufficient funds" error:**
   - Check P2E Pool has enough TAMA
   - Check payer keypair has SOL for fees (Devnet)
   - Fund payer: `solana airdrop 2 PAYER_ADDRESS --url devnet`

---

### **Database Errors:**

1. **"Failed to insert NFT":**
   - Check `user_nfts` table exists
   - Check `nft_mint_address` is unique
   - Verify foreign key constraint on `tier_name`

2. **"Balance not updating":**
   - Check `/leaderboard/upsert` API endpoint
   - Verify transaction logging is working
   - Check for race conditions (concurrent updates)

---

## 📊 Success Metrics

**After successful test, you should see:**

```
✅ User TAMA balance decreased by 2,500
✅ NFT created in user_nfts table
✅ 1 transaction in transactions table (nft_mint_onchain)
✅ 3 on-chain Solana transactions (burn, treasury, p2e)
✅ P2E Pool balance decreased by 1,750 (net)
✅ Treasury balance increased by 750
✅ Burn address received 1,000 (destroyed)
✅ NFT visible in bot and web
✅ NFT boost working in game
```

---

## 🎯 Quick Test Commands

### **1. Check Backend Health:**
```bash
curl https://huma-chain-xyz-production.up.railway.app/api/tama/stats
```

### **2. Check P2E Pool Balance:**
```bash
spl-token balance Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY \
  --owner HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --url devnet
```

### **3. Check Recent Transactions:**
```bash
solana transaction-history HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw \
  --url devnet --limit 10
```

### **4. Check Database:**
```sql
-- Latest mints
SELECT 
  un.telegram_id, 
  un.tier_name, 
  un.rarity, 
  un.earning_multiplier,
  un.minted_at,
  l.tama as current_balance
FROM user_nfts un
JOIN leaderboard l ON un.telegram_id = l.telegram_id
ORDER BY un.minted_at DESC
LIMIT 5;
```

---

## 🚨 Critical Paths to Test

**Priority 1 (Must Work):**
- ✅ User can mint Bronze NFT with TAMA
- ✅ TAMA balance decreases correctly
- ✅ NFT appears in bot and web
- ✅ On-chain distribution completes

**Priority 2 (Important):**
- ✅ Dynamic pricing works
- ✅ Error handling graceful
- ✅ NFT boost applies in game
- ✅ Admin panel shows transactions

**Priority 3 (Nice to Have):**
- ⚠️ Concurrent mints work
- ⚠️ Backend failure doesn't break frontend
- ⚠️ All edge cases handled

---

## 📝 Test Report Template

```markdown
# Bronze NFT Mint Test Report

**Date:** 2025-XX-XX
**Tester:** YOUR_NAME
**Environment:** Devnet

## Test Results

### ✅ Test 1: Basic Mint
- Status: PASS / FAIL
- Notes: ...

### ✅ Test 2: Distribution
- Status: PASS / FAIL
- P2E Pool: Before X, After Y (Expected: Y = X - 1750)
- Treasury: Before X, After Y (Expected: Y = X + 750)
- Burn: 1,000 TAMA confirmed on Solscan
- Notes: ...

### ✅ Test 3: Bot Display
- Status: PASS / FAIL
- Notes: ...

[Continue for all tests...]

## Issues Found
1. [Issue description]
2. [Issue description]

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Overall: PASS / FAIL
```

---

## 🎉 Ready to Test!

**Start with:**
1. Check Pre-Test Checklist
2. Run Test 1 (Basic Mint)
3. Verify on-chain on Solscan
4. Continue with other tests

**Let me know when you're ready and I'll guide you through!** 🚀

