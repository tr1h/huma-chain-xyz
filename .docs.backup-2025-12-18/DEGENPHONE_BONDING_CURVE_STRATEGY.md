# 📱 DegenPhone Bonding Curve Strategy - Адаптация для Solana Tamagotchi

## 🔥 Анализ DegenPhone (TON)

### Что они сделали:

```
Supply: 10,000 NFT
Platform: TON Blockchain
Pricing: Bonding Curve (hardcoded in smart contract)

Tiers:
- Common:    Starting 86 TON  → +0.035 TON per sale
- Silver:    Starting price   → +0.5 TON per sale
- Gold:      Starting price   → +2 TON per sale
- Diamond:   Starting price   → +20 TON per sale
- Legendary: Starting price   → +100 TON per sale

Результаты Day 1:
✅ 84 NFT resold (вторичка)
✅ 292 NFT listed
✅ Highest sale: 360 TON (~$2,520)
✅ Floor price: 88 TON (~$616)
✅ #5 in GetGems top collections

Механика:
1. Каждая покупка резервирует NFT
2. Цена увеличивается автоматически
3. Vesting 7 дней → claim NFT
4. Свободная торговля после claim
```

### Почему это работает:

```
✅ FOMO: Каждая продажа = цена растёт
✅ Прозрачность: Hardcoded в smart contract
✅ Справедливость: Все видят цену заранее
✅ Ликвидность: Не нужен маркетмейкер
✅ Органический рост: Спрос = рост цены
✅ Нет манипуляций: Нельзя накрутить/обвалить
```

---

## 🎯 Адаптация для Solana Tamagotchi NFT

### Наш контекст:

```
Supply: 100 NFT (меньше чем у DegenPhone)
Platform: Solana (не TON)
Boost: ×2.0, ×2.5, ×3.0 earning
Тиры: Bronze, Silver, Gold
```

### Предложенная стратегия:

#### Вариант 1: Pure Bonding Curve (как DegenPhone)

```
Bronze Tier (60 NFT):
- Starting Price: 0.1 SOL
- Increment: +0.005 SOL per sale
- Final Price: 0.1 + (0.005 × 59) = 0.395 SOL

Пример покупок:
NFT #1:  0.100 SOL
NFT #10: 0.145 SOL
NFT #20: 0.195 SOL
NFT #30: 0.245 SOL
NFT #60: 0.395 SOL

Silver Tier (30 NFT):
- Starting Price: 0.2 SOL
- Increment: +0.01 SOL per sale
- Final Price: 0.2 + (0.01 × 29) = 0.49 SOL

Gold Tier (10 NFT):
- Starting Price: 0.4 SOL
- Increment: +0.05 SOL per sale
- Final Price: 0.4 + (0.05 × 9) = 0.85 SOL

Total Revenue: ~32 SOL (~$640)

Преимущества:
✅ Максимум FOMO
✅ Прозрачность (on-chain)
✅ Органический рост
✅ Как у DegenPhone

Недостатки:
❌ Сложная реализация (smart contract)
❌ Больше времени на разработку
```

#### Вариант 2: Simplified Bonding Curve (для MVP)

```
Вместо +0.005 SOL каждый раз:
Увеличение каждые 10 продаж

Bronze (60 NFT):
NFT 1-10:   0.10 SOL each
NFT 11-20:  0.15 SOL each
NFT 21-30:  0.20 SOL each
NFT 31-40:  0.25 SOL each
NFT 41-50:  0.30 SOL each
NFT 51-60:  0.35 SOL each

Silver (30 NFT):
NFT 1-10:   0.25 SOL each
NFT 11-20:  0.35 SOL each
NFT 21-30:  0.45 SOL each

Gold (10 NFT):
NFT 1-5:    0.5 SOL each
NFT 6-10:   0.75 SOL each

Total Revenue: ~24 SOL (~$480)

Преимущества:
✅ Легче реализовать
✅ FOMO эффект есть
✅ Понятная механика

Недостатки:
❌ Меньше "чистоты" bonding curve
```

---

## 💡 Моя рекомендация: Гибридная стратегия

### Комбинация DegenPhone + реальность

```
Концепция:
- Используем Tier Batches (легче реализовать)
- Добавляем On-Chain Price Oracle (прозрачность)
- Показываем "Next Price" в UI (FOMO)
- Hardcoded в smart contract (как DegenPhone)

Pricing Table:

┌──────────────┬─────────┬────────────┬──────────────┬─────────────┐
│   Batch      │  Tier   │   Count    │  Price/NFT   │   Revenue   │
├──────────────┼─────────┼────────────┼──────────────┼─────────────┤
│ Batch 1      │ Bronze  │   1-15     │   0.12 SOL   │   1.8 SOL   │
│ Batch 2      │ Bronze  │  16-30     │   0.18 SOL   │   2.7 SOL   │
│ Batch 3      │ Bronze  │  31-45     │   0.24 SOL   │   3.6 SOL   │
│ Batch 4      │ Bronze  │  46-60     │   0.30 SOL   │   4.5 SOL   │
├──────────────┼─────────┼────────────┼──────────────┼─────────────┤
│ Batch 5      │ Silver  │  61-70     │   0.40 SOL   │   4.0 SOL   │
│ Batch 6      │ Silver  │  71-80     │   0.50 SOL   │   5.0 SOL   │
│ Batch 7      │ Silver  │  81-90     │   0.60 SOL   │   6.0 SOL   │
├──────────────┼─────────┼────────────┼──────────────┼─────────────┤
│ Batch 8      │ Gold    │  91-95     │   0.80 SOL   │   4.0 SOL   │
│ Batch 9      │ Gold    │  96-100    │   1.20 SOL   │   6.0 SOL   │
├──────────────┴─────────┴────────────┴──────────────┼─────────────┤
│ TOTAL:  100 NFT                       Avg 0.38 SOL │  37.6 SOL   │
└──────────────────────────────────────────────────────┴─────────────┘

В долларах (1 SOL = $20):
- Batch 1: $2.40 each
- Batch 2: $3.60 each
- Batch 3: $4.80 each
- Batch 4: $6.00 each
- Batch 5: $8.00 each
- Batch 6: $10.00 each
- Batch 7: $12.00 each
- Batch 8: $16.00 each
- Batch 9: $24.00 each

Total Revenue: $752 🔥

FOMO Factor: ×10 (первый батч vs. последний)
```

---

## 🔧 Реализация: Как у DegenPhone

### Smart Contract Approach (Advanced)

```rust
// Pseudo-code для Solana Program

pub struct BondingCurveConfig {
    pub tier: Tier,
    pub base_price: u64,        // в lamports
    pub increment_per_sale: u64, // в lamports
    pub total_minted: u64,
}

pub fn calculate_current_price(config: &BondingCurveConfig) -> u64 {
    config.base_price + (config.increment_per_sale * config.total_minted)
}

pub fn mint_nft(
    ctx: Context<MintNFT>,
    tier: Tier,
) -> Result<()> {
    let config = &mut ctx.accounts.bonding_curve_config;
    
    // Рассчитать текущую цену
    let current_price = calculate_current_price(config);
    
    // Проверить оплату
    require!(
        ctx.accounts.buyer.lamports() >= current_price,
        ErrorCode::InsufficientFunds
    );
    
    // Перевести SOL
    transfer_sol(
        &ctx.accounts.buyer.to_account_info(),
        &ctx.accounts.treasury.to_account_info(),
        current_price,
    )?;
    
    // Минт NFT
    mint_nft_to_buyer(ctx, tier)?;
    
    // Увеличить счётчик (цена автоматически растёт!)
    config.total_minted += 1;
    
    Ok(())
}
```

### Frontend Approach (Simplified, для MVP)

```javascript
// В nft-mint.html

// Конфигурация батчей с ценами
const BONDING_CURVE_CONFIG = {
    batches: [
        { tier: 'Bronze', from: 1, to: 15, price: 0.12 },
        { tier: 'Bronze', from: 16, to: 30, price: 0.18 },
        { tier: 'Bronze', from: 31, to: 45, price: 0.24 },
        { tier: 'Bronze', from: 46, to: 60, price: 0.30 },
        { tier: 'Silver', from: 61, to: 70, price: 0.40 },
        { tier: 'Silver', from: 71, to: 80, price: 0.50 },
        { tier: 'Silver', from: 81, to: 90, price: 0.60 },
        { tier: 'Gold', from: 91, to: 95, price: 0.80 },
        { tier: 'Gold', from: 96, to: 100, price: 1.20 }
    ]
};

// Получить текущую цену на основе количества проданных
async function getCurrentNFTPrice() {
    // Получить количество проданных NFT из Supabase
    const { data, error } = await supabase
        .from('user_nfts')
        .select('id', { count: 'exact' });
    
    const totalMinted = data ? data.length : 0;
    const nextMintNumber = totalMinted + 1;
    
    // Найти соответствующий батч
    const batch = BONDING_CURVE_CONFIG.batches.find(
        b => nextMintNumber >= b.from && nextMintNumber <= b.to
    );
    
    if (!batch) {
        throw new Error('All NFTs sold out!');
    }
    
    return {
        currentPrice: batch.price,
        tier: batch.tier,
        mintNumber: nextMintNumber,
        batchFrom: batch.from,
        batchTo: batch.to,
        remaining: batch.to - totalMinted,
        nextBatch: BONDING_CURVE_CONFIG.batches.find(b => b.from === batch.to + 1)
    };
}

// UI обновление (как в DegenPhone)
async function updateBondingCurveUI() {
    const priceInfo = await getCurrentNFTPrice();
    
    // Обновить текущую цену
    document.getElementById('current-price').textContent = 
        `${priceInfo.currentPrice} SOL`;
    
    // Показать следующую цену
    if (priceInfo.nextBatch) {
        document.getElementById('next-price-warning').innerHTML = 
            `⚠️ Next batch: ${priceInfo.nextBatch.price} SOL ` +
            `(+${((priceInfo.nextBatch.price / priceInfo.currentPrice - 1) * 100).toFixed(0)}%)`;
    } else {
        document.getElementById('next-price-warning').innerHTML = 
            `🔥 FINAL BATCH - Last NFTs!`;
    }
    
    // Прогресс бар
    const progress = (priceInfo.mintNumber / 100) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = 
        `${priceInfo.mintNumber}/100 minted`;
    
    // Остаток в текущем батче
    document.getElementById('batch-remaining').textContent = 
        `${priceInfo.remaining} left in this price tier`;
    
    // Цена росла
    const firstBatchPrice = BONDING_CURVE_CONFIG.batches[0].price;
    const priceIncrease = ((priceInfo.currentPrice / firstBatchPrice - 1) * 100).toFixed(0);
    document.getElementById('price-increase').textContent = 
        `+${priceIncrease}% from start`;
}

// Real-time updates (websocket или polling)
setInterval(updateBondingCurveUI, 5000); // Обновлять каждые 5 секунд
```

---

## 🎨 UI Design (как DegenPhone)

### Landing Page:

```html
<!-- Bonding Curve Section -->
<div class="bonding-curve-container">
    <h2>🔥 Live Bonding Curve Pricing</h2>
    
    <div class="current-price-card">
        <div class="price-label">Current Mint Price</div>
        <div class="price-value" id="current-price">0.12 SOL</div>
        <div class="price-usd">~$2.40</div>
    </div>
    
    <div class="progress-section">
        <div class="progress-bar-container">
            <div class="progress-bar-fill" id="progress-bar" style="width: 15%"></div>
        </div>
        <div class="progress-info">
            <span id="progress-text">15/100 minted</span>
            <span class="price-increase" id="price-increase">+0% from start</span>
        </div>
    </div>
    
    <div class="batch-info">
        <div class="batch-remaining" id="batch-remaining">
            10 NFTs left at this price!
        </div>
        <div class="next-price-warning" id="next-price-warning">
            ⚠️ Next batch: 0.18 SOL (+50%)
        </div>
    </div>
    
    <div class="bonding-curve-stats">
        <div class="stat">
            <div class="stat-label">Starting Price</div>
            <div class="stat-value">0.12 SOL</div>
        </div>
        <div class="stat">
            <div class="stat-label">Current Price</div>
            <div class="stat-value" id="current-price-stat">0.12 SOL</div>
        </div>
        <div class="stat">
            <div class="stat-label">Final Price</div>
            <div class="stat-value">1.20 SOL</div>
        </div>
    </div>
    
    <div class="fomo-message">
        ⚡ Price increases with every sale!<br>
        🎯 Buy now before next price tier!<br>
        💎 100 Total Supply - No more after sellout!
    </div>
    
    <button class="mint-btn-large" onclick="scrollToMint()">
        Mint Now 🚀
    </button>
</div>

<style>
.bonding-curve-container {
    background: linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(255, 20, 147, 0.1));
    border: 2px solid rgba(138, 43, 226, 0.3);
    border-radius: 20px;
    padding: 40px;
    margin: 40px 0;
    text-align: center;
}

.current-price-card {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 15px;
    padding: 30px;
    margin: 20px auto;
    max-width: 300px;
}

.price-label {
    font-size: 14px;
    color: #aaa;
    margin-bottom: 10px;
}

.price-value {
    font-size: 48px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 20px rgba(138, 43, 226, 0.8);
}

.price-usd {
    font-size: 18px;
    color: #888;
    margin-top: 10px;
}

.progress-section {
    margin: 30px 0;
}

.progress-bar-container {
    height: 40px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 20px;
    overflow: hidden;
    position: relative;
}

.progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #8A2BE2, #FF1493);
    transition: width 0.5s ease;
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.6);
}

.progress-info {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 14px;
}

.price-increase {
    color: #4CAF50;
    font-weight: bold;
}

.batch-info {
    margin: 20px 0;
}

.batch-remaining {
    font-size: 20px;
    font-weight: bold;
    color: #FF1493;
    margin-bottom: 10px;
}

.next-price-warning {
    font-size: 16px;
    color: #FFB74D;
    padding: 10px;
    background: rgba(255, 152, 0, 0.2);
    border-radius: 10px;
    font-weight: bold;
}

.bonding-curve-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 30px 0;
}

.stat {
    padding: 15px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.stat-label {
    font-size: 12px;
    color: #aaa;
    margin-bottom: 5px;
}

.stat-value {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
}

.fomo-message {
    font-size: 16px;
    line-height: 1.8;
    color: #fff;
    margin: 20px 0;
    padding: 20px;
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    border-radius: 10px;
}

.mint-btn-large {
    background: linear-gradient(135deg, #8A2BE2, #FF1493);
    color: white;
    border: none;
    padding: 20px 60px;
    font-size: 24px;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 10px 30px rgba(138, 43, 226, 0.4);
}

.mint-btn-large:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(138, 43, 226, 0.6);
}
</style>
```

---

## 📊 Сравнение: DegenPhone vs. Наша стратегия

```
┌────────────────────────┬──────────────────┬──────────────────────┐
│      Параметр          │   DegenPhone     │  Solana Tamagotchi   │
├────────────────────────┼──────────────────┼──────────────────────┤
│ Блокчейн               │ TON              │ Solana               │
│ Supply                 │ 10,000 NFT       │ 100 NFT              │
│ Pricing Model          │ Pure Bonding     │ Tier Batches         │
│ Starting Price         │ 86 TON (~$602)   │ 0.12 SOL (~$2.4)     │
│ Final Price            │ ~400+ TON        │ 1.20 SOL (~$24)      │
│ Price Increase         │ +0.035-100 TON   │ +50-100% per batch   │
│ Smart Contract         │ ✅ Yes           │ ⏳ Later (MVP=frontend)│
│ Vesting                │ 7 days           │ ❌ Instant claim     │
│ FOMO Factor            │ ⭐⭐⭐⭐⭐          │ ⭐⭐⭐⭐              │
│ Implementation         │ Complex          │ Simple (MVP)         │
│ Total Revenue          │ ~$1M+            │ ~$750                │
│ Day 1 Trading Volume   │ 84 resold        │ TBD                  │
│ Floor Price Growth     │ 86→88 TON (+2%)  │ TBD                  │
└────────────────────────┴──────────────────┴──────────────────────┘
```

---

## 🚀 Маркетинг (как DegenPhone)

### Pre-Mint Announcement:

```
🔥 SOLANA TAMAGOTCHI NFT - BONDING CURVE MINT

100 Supply ONLY. Price increases with EVERY sale.

💎 Pricing:
• Starting: 0.12 SOL (~$2.40)
• Final: 1.20 SOL (~$24.00)
• Growth: ×10 from first to last!

⚡ Mechanics (hardcoded):
Each purchase reserves NFT & increases next price
→ Bronze: +0.06 SOL per batch
→ Silver: +0.10 SOL per batch
→ Gold: +0.40 SOL per batch

🎯 Features:
• Earning Boost: ×2.0 to ×3.0
• P2E Rewards: Daily TAMA
• Free Trading: No lockup, sell anytime

🚨 Once 100 sold = SOLD OUT FOREVER

Mint opens: [DATE] at [TIME]
Link: https://tr1h.github.io/huma-chain-xyz/nft-mint.html
```

### During Mint (Twitter Updates):

```
Tweet 1 (15 minted):
"🔥 15/100 MINTED!
Current Price: 0.12 SOL
Next Price: 0.18 SOL (+50%)
10 NFTs left at current price! ⏰
Mint: [LINK]"

Tweet 2 (30 minted):
"⚡ 30/100 SOLD!
Price increased to 0.18 SOL
→ +50% from start!
Early minters already in profit 💰
Mint: [LINK]"

Tweet 3 (60 minted):
"🚨 60% SOLD OUT!
Current: 0.30 SOL
First batch: 0.12 SOL
→ Early buyers: +150% unrealized gain!
Silver tier unlocked! 🥈
Mint: [LINK]"

Tweet 4 (90 minted):
"🔥 FINAL 10 NFTs!
Gold Tier: 0.80-1.20 SOL
First NFT: 0.12 SOL
→ ×10 price increase!
Last chance before SOLD OUT! 🚀
Mint: [LINK]"
```

### Post-Mint:

```
📊 MINT COMPLETE - STATS

100/100 NFTs minted in [X] hours! 🔥

📈 Price Journey:
• First NFT: 0.12 SOL
• Last NFT: 1.20 SOL
• Growth: ×10 📈

💰 Revenue:
• Total: 37.6 SOL (~$752)
• Treasury: 70% = 26.3 SOL
• Liquidity: 30% = 11.3 SOL

🏆 Early Minters Win:
• Batch 1 buyers: +900% unrealized gain
• Floor Price: [TBD after trading starts]

🎯 What's Next:
• Magic Eden Listing (application submitted)
• TAMA/SOL Pool on Raydium (11.3 SOL ready)
• P2E Rewards Active
• Season 2 Planning

No paperhands allowed 💎🙌
```

---

## ✅ Implementation Checklist

### MVP (Frontend Only, 1-2 дня):

```
□ Добавить BONDING_CURVE_CONFIG
□ Реализовать getCurrentNFTPrice()
□ Обновить UI с bonding curve section
□ Добавить real-time updates (polling)
□ Обновить processNFTMint() с динамической ценой
□ Добавить прогресс бар и статистику
□ Протестировать на Devnet
```

### Advanced (Smart Contract, 1-2 недели):

```
□ Написать Solana Program (Rust)
□ Реализовать bonding curve logic on-chain
□ Деплоить на Devnet
□ Интегрировать с frontend
□ Протестировать механику
□ Аудит контракта (опционально)
□ Деплоить на Mainnet
```

---

## 🎯 Моя финальная рекомендация:

### Для ХАКАТОНА (сейчас):

```
✅ Используй Frontend подход (MVP)
✅ Tier Batches вместо Pure Bonding Curve
✅ Покажи концепцию с UI
✅ Объясни, что финальная версия будет on-chain
```

### После хакатона:

```
1. Реализуй Frontend MVP (1-2 дня)
   - BONDING_CURVE_CONFIG
   - Dynamic pricing UI
   - Real-time updates

2. Протестируй на Devnet

3. Запусти на Mainnet (быстрый старт)

4. Позже обнови на Smart Contract (v2)
   - Pure bonding curve on-chain
   - Как у DegenPhone
```

---

**P.S.** DegenPhone собрал $1M+ с 10,000 NFT через bonding curve. Ты можешь сделать то же самое в масштабе $750 с 100 NFT! Главное — показать, что цена растёт с каждой продажей. Это создаёт безумный FOMO! 🔥🚀

**Твоя стратегия: Tier Batches (MVP) → Smart Contract Bonding Curve (v2)**
