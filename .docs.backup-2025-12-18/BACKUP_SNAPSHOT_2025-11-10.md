# 🔒 BACKUP SNAPSHOT - 2025-11-10

## 📅 Backup Info

```
Date: 2025-11-10 03:24 UTC
Git Tag: backup-before-nft-5tiers-2025-11-10-0324
Git Branch: backup-2025-11-10-nft-5tiers
Commit: bfe5a26
```

---

## 🎯 Система ДО изменений

### Текущее состояние NFT:

```
Supply: 100 NFT (планировалось)
Tiers: 3 (Bronze, Silver, Gold)
Pricing: Неправильный курс SOL ($20 вместо $164.07)
Status: Не реализовано
```

### Текущая экономика игры:

```
Token: TAMA (виртуальный)
Earning System: Click + Combo + Anti-spam
Economy Admin: https://tr1h.github.io/huma-chain-xyz/economy-admin.html
Database: Supabase
Bot: Telegram bot работает
```

### Текущие файлы NFT:

```
Main Files:
- index.html (landing page)
- nft-mint.html (mint page - НЕ обновлена)
- super-admin.html (admin panel)

API:
- api/tama_supabase.php
- api/tama_supabase_api.php

Database Tables:
- user_nfts (создана, но пустая)
- players
- leaderboard
- economy_config
```

---

## 🚀 НОВАЯ СТРАТЕГИЯ (что будем внедрять)

### NFT Supply: 5,000 NFT в 5 тирах

```
┌──────────────┬─────────┬──────────────┬─────────┬──────────────┐
│   Tier       │ Supply  │   Payment    │  Boost  │   Revenue    │
├──────────────┼─────────┼──────────────┼─────────┼──────────────┤
│ Bronze       │ 4,500   │ TAMA 5K only │  ×2.0   │ 0 SOL        │
│ (Common)     │ (90%)   │              │         │              │
├──────────────┼─────────┼──────────────┼─────────┼──────────────┤
│ Silver       │  350    │ SOL bonding  │  ×2.3   │ $114,849     │
│ (Uncommon)   │ (7%)    │ 1-3 SOL      │         │ (700 SOL)    │
├──────────────┼─────────┼──────────────┼─────────┼──────────────┤
│ Gold         │  130    │ SOL bonding  │  ×2.7   │ $138,639     │
│ (Rare)       │ (2.6%)  │ 3-10 SOL     │         │ (845 SOL)    │
├──────────────┼─────────┼──────────────┼─────────┼──────────────┤
│ Platinum     │   18    │ SOL bonding  │  ×3.5   │ $59,065      │
│ (Epic)       │ (0.36%) │ 10-30 SOL    │         │ (360 SOL)    │
├──────────────┼─────────┼──────────────┼─────────┼──────────────┤
│ Diamond      │    2    │ SOL bonding  │  ×5.0   │ $24,611      │
│ (Legendary)  │ (0.04%) │ 50-100 SOL   │         │ (150 SOL)    │
└──────────────┴─────────┴──────────────┴─────────┴──────────────┘

TOTAL: 5,000 NFT
SOL Revenue: $337,164 (2,055 SOL)
Your Cut (70%): $236,015
Raydium Pool (30%): $101,149

Курс: 1 SOL = $164.07
```

### Ключевые отличия:

```
БЫЛО:
✗ 100 NFT
✗ 3 тира
✗ Неправильный курс SOL
✗ Bronze hybrid (TAMA OR SOL)
✗ Revenue $22K-203K (в зависимости от курса)

БУДЕТ:
✓ 5,000 NFT
✓ 5 тиров (как DegenPhone)
✓ Правильный курс ($164.07)
✓ Bronze ТОЛЬКО TAMA (для игроков)
✓ Revenue $337K реальных
✓ Silver-Diamond за SOL (для инвесторов)
```

---

## 📋 План реализации

### Phase 1: Frontend MVP (для хакатона)

```
1. Обновить nft-mint.html:
   ✓ 5 тиров вместо 3
   ✓ Bronze: TAMA only (5,000 fixed)
   ✓ Silver-Diamond: SOL bonding curve
   ✓ Правильные цены ($164.07 за SOL)
   ✓ UI с прогресс барами и FOMO элементами

2. Обновить базу данных:
   ✓ Добавить колонку tier в user_nfts
   ✓ Создать таблицу nft_bonding_state
   ✓ Хранить текущую цену каждого тира

3. Обновить API:
   ✓ Endpoint для минта Bronze (TAMA)
   ✓ Endpoint для минта Silver-Diamond (SOL)
   ✓ Bonding curve логика
   ✓ Проверка балансов

4. Обновить admin панель:
   ✓ Показывать 5 тиров
   ✓ Текущие цены каждого тира
   ✓ Прогресс минта
```

### Phase 2: Real On-Chain NFTs (после хакатона)

```
1. Генерация NFT изображений:
   ✓ 5,000 уникальных изображений
   ✓ AI generation (Leonardo.ai / Midjourney)
   ✓ 5 стилей для 5 тиров

2. Arweave upload:
   ✓ Загрузить metadata + images
   ✓ Создать URI для каждого NFT

3. Metaplex integration:
   ✓ Mint real Solana NFTs
   ✓ Mainnet deployment
   ✓ Transfer to users

4. Magic Eden listing:
   ✓ Список коллекции
   ✓ Вторичный рынок
```

### Phase 3: Bonding Curve Smart Contract (опционально)

```
1. Rust smart contract:
   ✓ On-chain bonding curve
   ✓ Automatic price updates
   ✓ Escrow механизм

2. Testing:
   ✓ Devnet тесты
   ✓ Security audit

3. Mainnet deployment:
   ✓ Deploy contract
   ✓ Integrate frontend
```

---

## 🗂️ Текущая структура проекта

### Главные файлы:

```
Frontend:
- index.html (landing) ✅
- nft-mint.html (mint page) ⚠️ NEEDS UPDATE
- super-admin.html (admin) ✅
- economy-admin.html (economy config) ✅
- telegram-game.html (game) ✅

Backend API:
- api/tama_supabase.php (main API) ✅
- api/tama_supabase_api.php (extended API) ✅

Bot:
- bot/bot.py (Telegram bot) ✅
- bot/economy_config.py (economy sync) ✅

Database:
- Supabase (PostgreSQL)
  - players ✅
  - leaderboard ✅
  - user_nfts ✅ (empty, needs update)
  - economy_config ✅
```

### Документация:

```
Strategy Docs:
- .docs/NFT_SUPPLY_STRATEGY.md ✅
- .docs/NFT_TIERS_DISTRIBUTION.md ✅
- .docs/NFT_PRICING_CORRECT_SOL.md ✅
- .docs/NFT_FINAL_PRICING.md ⚠️ (outdated)

Technical Docs:
- .docs/REAL_ONCHAIN_NFT_ROADMAP.md ✅
- .docs/AI_NFT_GENERATION_GUIDE.md ✅
- .docs/DEGENPHONE_BONDING_CURVE_STRATEGY.md ✅
```

---

## 💾 Database Schema (current)

### `user_nfts` table:

```sql
CREATE TABLE user_nfts (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT NOT NULL,
    nft_mint_address TEXT NOT NULL UNIQUE,
    tier_name TEXT NOT NULL,
    rarity TEXT NOT NULL,
    earning_multiplier DECIMAL(3,1) DEFAULT 2.0,
    is_active BOOLEAN DEFAULT true,
    minted_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Нужно добавить:

```sql
-- Bonding curve state
CREATE TABLE nft_bonding_state (
    id SERIAL PRIMARY KEY,
    tier_name TEXT NOT NULL UNIQUE,
    current_price DECIMAL(10,4) NOT NULL,
    minted_count INT DEFAULT 0,
    max_supply INT NOT NULL,
    start_price DECIMAL(10,4) NOT NULL,
    end_price DECIMAL(10,4) NOT NULL,
    increment_per_mint DECIMAL(10,6) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Initial data
INSERT INTO nft_bonding_state (tier_name, current_price, minted_count, max_supply, start_price, end_price, increment_per_mint) VALUES
('Bronze', 5000, 0, 4500, 5000, 5000, 0),  -- TAMA fixed
('Silver', 1.0, 0, 350, 1.0, 3.0, 0.0057),  -- SOL bonding
('Gold', 3.0, 0, 130, 3.0, 10.0, 0.0538),   -- SOL bonding
('Platinum', 10.0, 0, 18, 10.0, 30.0, 1.111),  -- SOL bonding
('Diamond', 50.0, 0, 2, 50.0, 100.0, 50.0);    -- SOL bonding
```

---

## 🔐 Environment Variables

### Current (Supabase):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### Needed (Solana):

```
SOLANA_RPC_URL=https://api.devnet.solana.com (или mainnet)
TREASURY_WALLET_PUBLIC_KEY=your-wallet-public-key
TREASURY_WALLET_PRIVATE_KEY=your-wallet-private-key (for backend)
```

---

## 📊 Key Metrics (before changes)

### Game Stats:

```
Players: ~X (check Supabase)
Daily Active: ~X
Total TAMA Earned: ~X
Total Clicks: ~X
NFT Holders: 0 (no NFTs minted yet)
```

### Financial:

```
TAMA Token: Virtual (no blockchain yet)
NFT Revenue: $0 (not launched)
Treasury Balance: 0 SOL
```

---

## ⚠️ Risks & Considerations

### Technical Risks:

```
1. Bonding curve complexity:
   - Frontend calculation must match backend
   - Race conditions при одновременных минтах
   - Price updates должны быть atomic

2. Solana integration:
   - Gas fees (0.000005 SOL per transaction)
   - RPC rate limits
   - Wallet connection issues

3. Database:
   - TAMA balance validation
   - Transaction rollbacks если минт fails
   - Concurrency control
```

### Business Risks:

```
1. Pricing:
   - Diamond $8K-$16K может быть слишком дорого
   - SOL price volatility (сейчас $164, может упасть)

2. Supply:
   - 5,000 NFT может не распродаться
   - 4,500 Bronze только за TAMA - хватит ли игроков?

3. Competition:
   - Другие P2E проекты на Solana
   - NFT market насыщен
```

### Mitigation:

```
✓ Start with MVP (frontend bonding curve)
✓ Test pricing на небольшой группе
✓ Waves (не все 5K сразу)
✓ Adjust prices based on demand
✓ Marketing перед launch
```

---

## 📝 Next Steps (Immediate)

### Step 1: Update Database Schema

```sql
-- Run in Supabase SQL Editor
-- See section "Database Schema (current)" above
```

### Step 2: Update nft-mint.html

```
1. Change from 3 tiers to 5 tiers
2. Bronze: TAMA only (remove SOL option)
3. Add bonding curve UI for Silver-Diamond
4. Update prices to correct SOL rate
5. Add real-time price display
6. Add progress bars
7. Add FOMO elements
```

### Step 3: Update API Endpoints

```
1. Create /api/mint-nft-tama.php (Bronze)
2. Create /api/mint-nft-sol.php (Silver-Diamond)
3. Create /api/get-nft-prices.php (current prices)
4. Update bonding curve logic
```

### Step 4: Update Admin Panel

```
1. Show 5 tiers
2. Show current prices
3. Show mint progress
4. Add charts
```

### Step 5: Testing

```
1. Test TAMA mint (Bronze)
2. Test SOL bonding curve
3. Test concurrent mints
4. Test edge cases
```

---

## 🔄 Rollback Plan

### If something goes wrong:

```bash
# Option 1: Restore from tag
git checkout backup-before-nft-5tiers-2025-11-10-0324

# Option 2: Restore from branch
git checkout backup-2025-11-10-nft-5tiers

# Option 3: Reset to specific commit
git reset --hard bfe5a26
```

### Database Rollback:

```sql
-- Drop new tables if needed
DROP TABLE IF EXISTS nft_bonding_state;

-- Or restore from Supabase backup
-- Supabase keeps automatic backups for paid plans
```

---

## 📞 Contact Info

```
GitHub: tr1h/huma-chain-xyz
Branch: main
Backup Branch: backup-2025-11-10-nft-5tiers
Backup Tag: backup-before-nft-5tiers-2025-11-10-0324
```

---

## ✅ BACKUP CHECKLIST

```
✓ All changes committed
✓ Pushed to GitHub
✓ Git tag created
✓ Backup branch created
✓ Snapshot document created
✓ Current state documented
✓ Rollback plan documented
✓ Ready to proceed!
```

---

**🔒 BACKUP COMPLETE! Ready to implement 5-tier NFT system!** 🚀

**Restore command if needed:** 
```bash
git checkout backup-before-nft-5tiers-2025-11-10-0324
```

