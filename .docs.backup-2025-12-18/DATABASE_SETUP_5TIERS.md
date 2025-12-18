# 🗄️ Database Setup - 5-Tier NFT System

## 📋 Overview

This document explains how to set up the database for the new 5-tier NFT system.

---

## ⚠️ BEFORE YOU START

```
✅ Backup created: C:\goooog-backup-2025-11-10-032708.zip
✅ Git backup: backup-before-nft-5tiers-2025-11-10-0324
✅ Database backup: Recommended via Supabase dashboard

IMPORTANT: This script is NON-DESTRUCTIVE
- It creates NEW tables
- It UPDATES existing user_nfts table (adds columns)
- It does NOT drop or delete anything
```

---

## 📊 Tables Created

### 1. `nft_designs` (NEW)
```
Purpose: Library of all 5,000 unique NFT designs
Rows: 5,000 (4,500 Bronze + 350 Silver + 130 Gold + 18 Platinum + 2 Diamond)
Key Columns:
- id: Primary key
- tier_name: Bronze, Silver, Gold, Platinum, Diamond
- design_number: 1-4500 for Bronze, 1-350 for Silver, etc.
- is_minted: false until someone mints it
- minted_by: telegram_id of minter
```

### 2. `nft_bonding_state` (NEW)
```
Purpose: Track current bonding curve prices
Rows: 5 (one per tier)
Key Columns:
- tier_name: Bronze, Silver, Gold, Platinum, Diamond
- current_price: Current mint price (increases with each mint)
- minted_count: How many minted so far
- increment_per_mint: How much price increases per mint
```

### 3. `user_nfts` (UPDATED)
```
Purpose: Track which users own which NFTs
Changes:
- ADD COLUMN nft_design_id (reference to nft_designs)
- ADD COLUMN purchase_price_sol (price paid in SOL)
- ADD COLUMN purchase_price_tama (price paid in TAMA)
```

---

## 🚀 Installation Steps

### Step 1: Access Supabase SQL Editor

1. Go to https://supabase.com
2. Login to your project
3. Click "SQL Editor" in left sidebar
4. Click "New query"

### Step 2: Run the SQL Script

1. Open `sql/create_nft_5tier_system.sql`
2. Copy ALL contents
3. Paste into Supabase SQL Editor
4. Click "Run" button
5. Wait for "Success" message

### Step 3: Verify Installation

Run these verification queries:

```sql
-- Check bonding state (should show 5 tiers)
SELECT * FROM nft_bonding_state ORDER BY tier_name;

-- Check design counts (should be 5,000 total)
SELECT tier_name, COUNT(*) as design_count 
FROM nft_designs 
GROUP BY tier_name 
ORDER BY tier_name;

-- Expected output:
-- Bronze:   4,500
-- Diamond:      2
-- Gold:       130
-- Platinum:    18
-- Silver:     350
-- TOTAL:    5,000

-- Check available NFTs (all should be unminted)
SELECT tier_name, COUNT(*) as available 
FROM nft_designs 
WHERE is_minted = false 
GROUP BY tier_name;

-- Check tier stats view
SELECT * FROM nft_tier_stats;
```

Expected output for `nft_tier_stats`:

```
tier_name | payment_type | current_price | minted_count | max_supply | available | minted_percentage | start_price | end_price | earning_multiplier
----------+--------------+---------------+--------------+------------+-----------+-------------------+-------------+-----------+-------------------
Bronze    | TAMA         | 5000.00       | 0            | 4500       | 4500      | 0.00              | 5000.00     | 5000.00   | 2.0
Silver    | SOL          | 1.0           | 0            | 350        | 350       | 0.00              | 1.0         | 3.0       | 2.3
Gold      | SOL          | 3.0           | 0            | 130        | 130       | 0.00              | 3.0         | 10.0      | 2.7
Platinum  | SOL          | 10.0          | 0            | 18         | 18        | 0.00              | 10.0        | 30.0      | 3.5
Diamond   | SOL          | 50.0          | 0            | 2          | 2         | 0.00              | 50.0        | 100.0     | 5.0
```

---

## 🔧 Helper Functions Available

### Get current price:
```sql
SELECT get_nft_price('Bronze');  -- Returns 5000.00
SELECT get_nft_price('Diamond'); -- Returns 50.0
```

### Get next price (after one more mint):
```sql
SELECT get_next_nft_price('Silver');  -- Returns current + increment
```

### Get available count:
```sql
SELECT get_available_nft_count('Gold');  -- Returns unminted count
```

---

## 📊 Bonding Curve Parameters

```
┌───────────┬──────────┬─────────────┬───────────┬────────────┬───────────────────┐
│   Tier    │ Payment  │ Start Price │ End Price │ Max Supply │ Increment per Mint│
├───────────┼──────────┼─────────────┼───────────┼────────────┼───────────────────┤
│ Bronze    │ TAMA     │ 5,000       │ 5,000     │ 4,500      │ 0 (fixed)         │
│ Silver    │ SOL      │ 1.0         │ 3.0       │ 350        │ 0.005714          │
│ Gold      │ SOL      │ 3.0         │ 10.0      │ 130        │ 0.053846          │
│ Platinum  │ SOL      │ 10.0        │ 30.0      │ 18         │ 1.111111          │
│ Diamond   │ SOL      │ 50.0        │ 100.0     │ 2          │ 50.0              │
└───────────┴──────────┴─────────────┴───────────┴────────────┴───────────────────┘

Examples:
- Silver: 1.0 + (0.005714 × 350) = 3.0 SOL at the end
- Diamond: 50.0 + (50.0 × 2) = 150.0 SOL at the end (only 2 mints!)
```

---

## 🎨 Design Placeholders

Currently, all 5,000 designs are placeholders with themes and variants:

```
Bronze (4,500):
├─ Baby Creatures (900): Green, Blue, Red, Yellow, Purple
├─ Happy Eggs (900): Green, Blue, Red, Yellow, Purple
├─ Pixel Pets (900): Green, Blue, Red, Yellow, Purple
├─ Cute Blobs (900): Green, Blue, Red, Yellow, Purple
└─ Mini Dragons (900): Green, Blue, Red, Yellow, Purple

Silver (350):
└─ Evolved Creatures: Variant A, B, C, D, E

Gold (130):
└─ Elite Forms: Style Alpha, Beta, Gamma, Delta, Omega

Platinum (18):
└─ Legendary Beasts: Unique Design 1-18

Diamond (2):
└─ Mythic: Alpha, Omega
```

**Next step**: Generate real images with AI and update `image_url` and `metadata_url` columns.

---

## 🔄 How Minting Works

### Bronze Mint (TAMA):

```sql
-- 1. Check user has 5,000 TAMA
-- 2. Get random unminted Bronze design
SELECT id, design_number 
FROM nft_designs 
WHERE tier_name = 'Bronze' AND is_minted = false 
ORDER BY RANDOM() 
LIMIT 1;

-- 3. Mark as minted
UPDATE nft_designs 
SET is_minted = true, minted_by = <telegram_id>, minted_at = NOW() 
WHERE id = <design_id>;

-- 4. Create user NFT
INSERT INTO user_nfts 
(telegram_id, nft_design_id, tier_name, earning_multiplier, purchase_price_tama) 
VALUES 
(<telegram_id>, <design_id>, 'Bronze', 2.0, 5000);

-- 5. Burn TAMA (done separately in game logic)

-- 6. Update bonding state (Bronze is fixed, so minted_count only)
UPDATE nft_bonding_state 
SET minted_count = minted_count + 1 
WHERE tier_name = 'Bronze';
```

### Silver-Diamond Mint (SOL):

```sql
-- 1. Get current price
SELECT current_price FROM nft_bonding_state WHERE tier_name = 'Silver';

-- 2. Check user has enough SOL
-- 3. Get random unminted design (same as Bronze)
-- 4. Mark as minted (same as Bronze)
-- 5. Create user NFT with SOL price
INSERT INTO user_nfts 
(telegram_id, nft_design_id, tier_name, earning_multiplier, purchase_price_sol) 
VALUES 
(<telegram_id>, <design_id>, 'Silver', 2.3, <paid_sol_amount>);

-- 6. Update bonding curve price
SELECT update_bonding_price('Silver');
-- This increases current_price by increment_per_mint
```

---

## 🛡️ Safety Features

### Transaction Safety:
```sql
-- All mints should be wrapped in transactions
BEGIN;
    -- Get design
    -- Mark minted
    -- Create user NFT
    -- Update bonding state
    -- Burn TAMA / Transfer SOL
COMMIT;
-- If ANY step fails, entire transaction rolls back
```

### Unique Constraints:
```
- nft_designs: (tier_name, design_number) UNIQUE
- nft_bonding_state: tier_name UNIQUE
- Each design can only be minted once
```

### Check Constraints:
```
- tier_name must be: Bronze, Silver, Gold, Platinum, Diamond
- payment_type must be: TAMA, SOL
```

---

## 🔍 Monitoring Queries

### Check mint progress:
```sql
SELECT * FROM nft_tier_stats;
```

### See recent mints:
```sql
SELECT 
    u.telegram_id,
    u.tier_name,
    d.design_number,
    d.design_theme,
    d.design_variant,
    u.earning_multiplier,
    u.purchase_price_tama,
    u.purchase_price_sol,
    u.minted_at
FROM user_nfts u
JOIN nft_designs d ON u.nft_design_id = d.id
ORDER BY u.minted_at DESC
LIMIT 10;
```

### Check user holdings:
```sql
SELECT * FROM user_nft_holdings WHERE telegram_id = <your_telegram_id>;
```

### Find unminted designs:
```sql
SELECT tier_name, design_number, design_theme, design_variant
FROM nft_designs
WHERE is_minted = false
ORDER BY tier_name, design_number
LIMIT 10;
```

---

## 🐛 Troubleshooting

### Issue: Script fails with "relation already exists"
```
Solution: This is OK! The script uses "IF NOT EXISTS" and "ON CONFLICT DO NOTHING"
It won't overwrite existing data.
```

### Issue: Design count is wrong
```sql
-- Check actual counts
SELECT tier_name, COUNT(*) FROM nft_designs GROUP BY tier_name;

-- If needed, re-run just the INSERT sections
```

### Issue: Bonding prices are wrong
```sql
-- Reset to initial state
UPDATE nft_bonding_state
SET current_price = start_price, minted_count = 0
WHERE tier_name = 'Silver';  -- or any tier
```

---

## ✅ Success Checklist

After running the script, verify:

```
✅ nft_designs table exists with 5,000 rows
✅ nft_bonding_state table exists with 5 rows
✅ user_nfts table updated with new columns
✅ All views created successfully
✅ All functions created successfully
✅ Verification queries return expected results
✅ No errors in Supabase logs
```

---

## 🎯 Next Steps

After database setup:

1. ✅ Database setup complete
2. ⏭️ Update frontend (nft-mint.html)
3. ⏭️ Create API endpoints
4. ⏭️ Test minting flow
5. ⏭️ Generate AI images
6. ⏭️ Upload to Arweave
7. ⏭️ Launch! 🚀

---

**Database setup complete! Ready for frontend implementation!** 🎉

