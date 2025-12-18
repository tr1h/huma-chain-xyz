# 🧪 Testing Guide - 5-Tier NFT System

## 📋 Pre-Test Checklist

```
✅ Database schema installed (sql/create_nft_5tier_system.sql)
✅ API endpoints created (mint-nft-bronze.php, mint-nft-sol.php, get-nft-prices.php)
✅ Frontend deployed (nft-mint-5tiers.html)
✅ Admin panel updated (super-admin.html)
✅ Backup created
```

---

## 🎯 Testing Plan

### Test 1: Database Setup ✅
### Test 2: Bronze Mint (TAMA) ⏳
### Test 3: SOL Bonding Curve ⏳
### Test 4: Admin Panel Stats ⏳
### Test 5: Edge Cases ⏳

---

## TEST 1: Database Setup

### Step 1.1: Run SQL Schema

```bash
1. Go to Supabase Dashboard
2. Open SQL Editor
3. Copy contents from sql/create_nft_5tier_system.sql
4. Run script
5. Wait for "Success" message
```

### Step 1.2: Verify Tables Created

```sql
-- Check nft_designs table
SELECT COUNT(*) FROM nft_designs;
-- Expected: 5,000 rows

-- Check nft_bonding_state table
SELECT * FROM nft_bonding_state ORDER BY tier_name;
-- Expected: 5 rows (Bronze, Silver, Gold, Platinum, Diamond)

-- Check user_nfts table updated
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_nfts';
-- Expected: nft_design_id, purchase_price_sol, purchase_price_tama columns exist
```

### Step 1.3: Verify Initial Data

```sql
-- Check tier stats
SELECT * FROM nft_tier_stats;

-- Expected output:
-- Bronze:   5,000 TAMA, 0/4500 minted, ×2.0 boost
-- Silver:   1.0 SOL,   0/350 minted,  ×2.3 boost
-- Gold:     3.0 SOL,   0/130 minted,  ×2.7 boost
-- Platinum: 10.0 SOL,  0/18 minted,   ×3.5 boost
-- Diamond:  50.0 SOL,  0/2 minted,    ×5.0 boost
```

**Result:** ✅ PASS / ❌ FAIL

---

## TEST 2: Bronze Mint (TAMA)

### Prerequisites:

```
- User exists in players table
- User has ≥ 5,000 TAMA balance
```

### Step 2.1: Setup Test User

```sql
-- Check if test user exists
SELECT telegram_id, tama_balance FROM players WHERE telegram_id = 123456789;

-- If not exists, create:
INSERT INTO players (telegram_id, username, tama_balance) 
VALUES (123456789, 'test_user', 10000);

-- If exists but low balance, update:
UPDATE players SET tama_balance = 10000 WHERE telegram_id = 123456789;
```

### Step 2.2: Test API Directly

```bash
# Test mint-nft-bronze.php
curl -X POST https://your-domain.com/api/mint-nft-bronze.php \
  -H "Content-Type: application/json" \
  -d '{"telegram_id": 123456789}'

# Expected response:
{
  "success": true,
  "tier": "Bronze",
  "design_number": 1234,
  "design_theme": "Baby Creatures",
  "design_variant": "Green",
  "boost": 2.0,
  "price_tama": 5000,
  "new_tama_balance": 5000
}
```

### Step 2.3: Verify Database Changes

```sql
-- Check TAMA deducted
SELECT tama_balance FROM players WHERE telegram_id = 123456789;
-- Expected: 5,000 (10,000 - 5,000)

-- Check NFT created
SELECT * FROM user_nfts WHERE telegram_id = 123456789;
-- Expected: 1 row, tier_name='Bronze', earning_multiplier=2.0

-- Check design marked minted
SELECT is_minted, minted_by FROM nft_designs WHERE id = <design_id>;
-- Expected: is_minted=true, minted_by=123456789

-- Check bonding state updated
SELECT minted_count FROM nft_bonding_state WHERE tier_name = 'Bronze';
-- Expected: 1
```

### Step 2.4: Test Frontend

```
1. Open: https://your-domain.com/nft-mint-5tiers.html?user_id=123456789
2. Check TAMA balance displayed
3. Click "🔥 MINT BRONZE" button
4. Verify success message
5. Check Bronze progress bar updated
```

### Step 2.5: Test Edge Cases

```sql
-- Test insufficient TAMA
-- Set balance to 4,000
UPDATE players SET tama_balance = 4000 WHERE telegram_id = 123456789;

-- Try to mint (should fail)
-- Expected error: "Insufficient TAMA balance. You need 5,000 TAMA."
```

**Result:** ✅ PASS / ❌ FAIL

---

## TEST 3: SOL Bonding Curve

### Prerequisites:

```
- Phantom wallet connected
- Devnet SOL balance ≥ 2 SOL
```

### Step 3.1: Get Devnet SOL

```
1. Go to: https://faucet.solana.com
2. Enter your wallet address
3. Request 2 SOL (Devnet)
4. Wait for confirmation
```

### Step 3.2: Test Silver Mint

```bash
# Get current Silver price
curl https://your-domain.com/api/get-nft-prices.php

# Expected:
{
  "tiers": [
    {
      "tier_name": "Silver",
      "current_price": 1.0,
      "next_price": 1.005714
    }
  ]
}

# Mint Silver
curl -X POST https://your-domain.com/api/mint-nft-sol.php \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "wallet_address": "YourWalletAddress",
    "tier": "Silver",
    "price_sol": 1.0
  }'

# Expected response:
{
  "success": true,
  "tier": "Silver",
  "design_number": 42,
  "boost": 2.3,
  "price_sol": 1.0,
  "new_price": 1.005714
}
```

### Step 3.3: Verify Bonding Curve Updated

```sql
-- Check price increased
SELECT current_price, minted_count FROM nft_bonding_state WHERE tier_name = 'Silver';
-- Expected: current_price = 1.005714, minted_count = 1

-- Check NFT created
SELECT * FROM user_nfts WHERE telegram_id = 123456789 AND tier_name = 'Silver';
-- Expected: 1 row, earning_multiplier=2.3, purchase_price_sol=1.0
```

### Step 3.4: Test Second Mint (Price Should Increase)

```bash
# Mint Silver again
curl -X POST https://your-domain.com/api/mint-nft-sol.php \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "wallet_address": "YourWalletAddress",
    "tier": "Silver",
    "price_sol": 1.005714
  }'

# Check price again
SELECT current_price FROM nft_bonding_state WHERE tier_name = 'Silver';
-- Expected: 1.011428 (increased by 0.005714)
```

### Step 3.5: Test Price Mismatch Protection

```bash
# Try to mint with old price (should fail)
curl -X POST https://your-domain.com/api/mint-nft-sol.php \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "wallet_address": "YourWalletAddress",
    "tier": "Silver",
    "price_sol": 1.0
  }'

# Expected error:
{
  "success": false,
  "error": "Price mismatch! Current price: 1.011428 SOL, your price: 1.0 SOL. Please refresh and try again."
}
```

**Result:** ✅ PASS / ❌ FAIL

---

## TEST 4: Admin Panel Stats

### Step 4.1: Open Admin Panel

```
https://your-domain.com/super-admin.html
```

### Step 4.2: Verify 5-Tier Stats Display

```
Expected to see:

💎 NFT 5-Tier System - Live Stats
┌────────────────────────────────────┐
│ 🟫 BRONZE                          │
│ 5,000 TAMA (Fixed Price)           │
│ [████░░░░░░] 1% minted              │
│ Minted: 1 / 4,500                  │
│ ×2.0 Boost                         │
│ Available: 4,499                   │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 🥈 SILVER                          │
│ 1.011 SOL                          │
│ Next: 1.017 SOL                    │
│ [██░░░░░░░░] 0.6% minted           │
│ Minted: 2 / 350                    │
│ ×2.3 Boost                         │
│ Available: 348                     │
└────────────────────────────────────┘

... (Gold, Platinum, Diamond)

📊 Total Collection Stats
- Total Minted: 3
- Available: 4,997
- SOL Revenue: $329 (example)
- Collection Progress: 0.1%
```

### Step 4.3: Test Refresh Button

```
1. Click "🔄 Refresh" button
2. Verify stats update
3. Check console for logs
```

### Step 4.4: Verify NFT Holders Table

```
Expected to see:
- Bronze holder: telegram_id, Bronze tier, ×2.0 multiplier
- Silver holders (2x): telegram_id, Silver tier, ×2.3 multiplier
```

**Result:** ✅ PASS / ❌ FAIL

---

## TEST 5: Edge Cases

### Test 5.1: Supply Exhausted

```sql
-- Simulate Bronze sold out
UPDATE nft_bonding_state SET minted_count = 4500 WHERE tier_name = 'Bronze';
UPDATE nft_designs SET is_minted = true WHERE tier_name = 'Bronze';

-- Try to mint Bronze (should fail)
-- Expected error: "No Bronze NFTs left! All 4,500 have been minted."

-- Reset
UPDATE nft_bonding_state SET minted_count = 0 WHERE tier_name = 'Bronze';
UPDATE nft_designs SET is_minted = false WHERE tier_name = 'Bronze';
```

### Test 5.2: Invalid Tier

```bash
# Try to mint invalid tier
curl -X POST https://your-domain.com/api/mint-nft-sol.php \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "wallet_address": "YourWalletAddress",
    "tier": "InvalidTier",
    "price_sol": 1.0
  }'

# Expected error: "Invalid tier. Must be: Silver, Gold, Platinum, Diamond"
```

### Test 5.3: Missing Parameters

```bash
# Try to mint without telegram_id
curl -X POST https://your-domain.com/api/mint-nft-bronze.php \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected error: "telegram_id is required"
```

### Test 5.4: Transaction Rollback

```sql
-- Manually break a constraint to test rollback
-- This should NOT create a user NFT or deduct TAMA

-- Expected: Transaction rolls back, no changes made
```

### Test 5.5: Concurrent Mints

```bash
# Start 2 mints at the same time
curl -X POST ... & curl -X POST ... &

# Verify:
-- Both succeed
-- Bonding curve price updates correctly
-- No race conditions
```

**Result:** ✅ PASS / ❌ FAIL

---

## 📊 Test Results Summary

```
┌───────────────────────────────────┬────────┐
│ Test                              │ Status │
├───────────────────────────────────┼────────┤
│ 1. Database Setup                 │ ⏳     │
│ 2. Bronze Mint (TAMA)             │ ⏳     │
│ 3. SOL Bonding Curve              │ ⏳     │
│ 4. Admin Panel Stats              │ ⏳     │
│ 5. Edge Cases                     │ ⏳     │
├───────────────────────────────────┼────────┤
│ OVERALL                           │ ⏳     │
└───────────────────────────────────┴────────┘

Legend:
✅ PASS - Test passed successfully
❌ FAIL - Test failed, needs fixing
⏳ PENDING - Test not run yet
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to connect to database"
```
Solution:
- Check Supabase credentials in config.php
- Verify database is running
- Check firewall settings
```

### Issue 2: "No NFT designs found"
```
Solution:
- Run sql/create_nft_5tier_system.sql
- Verify nft_designs table has 5,000 rows
```

### Issue 3: "Price mismatch error"
```
Solution:
- Refresh page to get latest price
- Check bonding state is updating correctly
```

### Issue 4: "TAMA not deducted"
```
Solution:
- Check transaction committed
- Verify players table updated
- Check for errors in PHP logs
```

### Issue 5: "Admin panel shows 0/0"
```
Solution:
- Check API endpoint accessible
- Verify get-nft-prices.php returns data
- Check browser console for errors
```

---

## ✅ Final Checklist

Before deploying to production:

```
□ All tests passed
□ No errors in console
□ Bonding curve working correctly
□ TAMA deduction working
□ Admin panel displays correctly
□ NFT holders table accurate
□ Progress bars animate smoothly
□ Prices update in real-time
□ Edge cases handled gracefully
□ Database transactions safe
□ API endpoints secure
□ Frontend responsive on mobile
```

---

## 🚀 Next Steps After Testing

```
1. ✅ Fix any issues found
2. ✅ Re-run failed tests
3. ✅ Deploy to production
4. 🎨 Generate 5,000 NFT images (AI)
5. 📦 Upload to Arweave
6. ⛓️ Mint real on-chain NFTs
7. 🚀 Launch!
```

---

**Ready to test! Let's make sure everything works perfectly! 🧪**

