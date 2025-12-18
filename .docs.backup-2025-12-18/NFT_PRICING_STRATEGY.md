# 💰 NFT Pricing Strategy - Сравнение и оптимизация

## 📊 Анализ конкурентов

### Текущие цены (наши):
```
Bronze: 2,500 TAMA или 0.05 SOL (~$1-2)
Silver: 5,000 TAMA или 0.1 SOL (~$2-4)
Gold: 10,000 TAMA или 0.2 SOL (~$4-8)

Supply: 100 NFT (ограниченное количество)
Boost: ×2.0, ×2.5, ×3.0
```

### Конкуренты:

#### 1. Aurory (Solana P2E Питомцы)
```
Mint Price: 10 SOL (~$200)
Current Floor: 3-5 SOL (~$60-100)
Supply: 10,000 NFT
Boost: Battle stats
Peak Price: 90 SOL (~$18,000)

Анализ:
- Высокий barrier to entry
- Большой supply
- Только для хардкорных игроков
```

#### 2. Genopets (Move-to-Earn)
```
Mint Price: 5 SOL (~$100)
Current Floor: 1-3 SOL (~$20-60)
Supply: 8,888 NFT
Boost: Эволюция питомцев
Peak Price: 50 SOL (~$10,000)

Анализ:
- Средний barrier to entry
- Большой supply
- Требует физическую активность
```

#### 3. Star Atlas (Space MMO)
```
Mint Price: 10-100 SOL (~$200-2000)
Current Floor: 5-50 SOL (~$100-1000)
Supply: 20,000+ NFT
Boost: Корабли с разными характеристиками
Peak Price: 500+ SOL (~$100,000)

Анализ:
- ОЧЕНЬ высокий barrier to entry
- Огромный supply
- Игра ещё даже не вышла!
```

#### 4. Degenerate Ape Academy (FOMO пример!)
```
Mint Price: Прогрессивная (0.5 → 8 SOL)
   - First 100: 0.5 SOL
   - Next 400: 1 SOL
   - Next 500: 2 SOL
   - ... до 8 SOL

Current Floor: 10-20 SOL
Supply: 10,000 NFT
Peak Price: 200+ SOL (~$40,000)

Анализ:
✅ FOMO механика работает идеально!
✅ Ранние покупатели в огромном плюсе
✅ Создаёт ажиотаж
```

---

## 💡 Стратегия ценообразования

### Проблема с текущими ценами:

```
Твои цены: 0.05 - 0.2 SOL
Конкуренты: 1 - 100 SOL

Разница: В 5-500 раз ДЕШЕВЛЕ!

Плюсы:
✅ Очень доступно
✅ Низкий barrier to entry
✅ Много покупателей

Минусы:
❌ Воспринимается как "дешёвое"
❌ Низкая ценность в глазах инвесторов
❌ Мало дохода от продаж
❌ Нет FOMO эффекта
```

### Рекомендуемая стратегия: PROGRESSIVE PRICING (как Degen Apes)

#### Вариант A: Bonding Curve (прогрессивный рост)

```
Supply: 100 NFT
Pricing: Цена растёт с каждым минтом

Formula:
Base Price = 0.1 SOL
Price = Base Price × (1 + 0.05 × NFT_Number)

Примеры:
NFT #1:   0.1 SOL (~$2)
NFT #10:  0.15 SOL (~$3)
NFT #20:  0.2 SOL (~$4)
NFT #30:  0.25 SOL (~$5)
NFT #50:  0.35 SOL (~$7)
NFT #75:  0.475 SOL (~$9.5)
NFT #100: 0.6 SOL (~$12)

Итого доход: ~30 SOL (~$600)
Средняя цена: 0.3 SOL (~$6)

Психология:
✅ "Надо купить СЕЙЧАС, пока дешёвое!"
✅ Ранние покупатели в плюсе (купили по 0.1, floor = 0.6)
✅ FOMO эффект работает
```

#### Вариант B: Tier Batches (пакетное повышение)

```
Supply: 100 NFT в 5 батчах

Batch 1 (NFT 1-20):   0.1 SOL each
Batch 2 (NFT 21-40):  0.2 SOL each
Batch 3 (NFT 41-60):  0.3 SOL each
Batch 4 (NFT 61-80):  0.5 SOL each
Batch 5 (NFT 81-100): 1.0 SOL each

Итого доход: ~42 SOL (~$840)
Средняя цена: 0.42 SOL (~$8.4)

Психология:
✅ "Надо успеть в этот батч!"
✅ Чёткие этапы
✅ Легко понять и объяснить
```

#### Вариант C: Rarity-Based (по редкости)

```
Supply: 100 NFT с разными редкостями

Common (50 NFT):     0.2 SOL (~$4)
Uncommon (30 NFT):   0.3 SOL (~$6)
Rare (15 NFT):       0.5 SOL (~$10)
Epic (4 NFT):        1.0 SOL (~$20)
Legendary (1 NFT):   5.0 SOL (~$100)

Итого доход: ~26.5 SOL (~$530)
Средняя цена: 0.265 SOL (~$5.3)

Психология:
✅ "Может мне выпадет Legendary!"
✅ Азарт и лотерея
✅ Редкие NFT стоят дороже
```

---

## 🎯 Моя рекомендация: Гибридная модель

### BEST STRATEGY: Tier Batches + Rarity Multiplier

```
Базовая цена растёт по батчам:
Batch 1 (1-20):    Base 0.15 SOL
Batch 2 (21-40):   Base 0.25 SOL
Batch 3 (41-60):   Base 0.35 SOL
Batch 4 (61-80):   Base 0.50 SOL
Batch 5 (81-100):  Base 0.75 SOL

+ Rarity Multiplier:
Common:    1.0x (Base Price)
Uncommon:  1.2x (Base × 1.2)
Rare:      1.5x (Base × 1.5)
Epic:      2.0x (Base × 2.0)
Legendary: 3.0x (Base × 3.0)

Примеры:
NFT #5 (Batch 1) Common:     0.15 SOL
NFT #15 (Batch 1) Rare:      0.225 SOL (0.15 × 1.5)
NFT #25 (Batch 2) Uncommon:  0.30 SOL (0.25 × 1.2)
NFT #45 (Batch 3) Epic:      0.70 SOL (0.35 × 2.0)
NFT #95 (Batch 5) Legendary: 2.25 SOL (0.75 × 3.0)

Средняя цена: ~0.4 SOL (~$8)
Итого доход: ~40 SOL (~$800)

Преимущества:
✅ FOMO: Батчи создают ажиотаж
✅ Азарт: Редкость добавляет случайность
✅ Справедливость: Ранние покупатели в плюсе
✅ Доход: $800 vs. $200 (текущая стратегия)
✅ Восприятие: "Нормальная" цена ($8 vs. $2)
```

---

## 📈 Сравнение стратегий

| Стратегия | Средняя цена | Доход | FOMO | Сложность |
|-----------|--------------|-------|------|-----------|
| Текущая (фикс) | 0.12 SOL ($2.4) | $240 | ❌ Нет | ⭐ Простая |
| Bonding Curve | 0.3 SOL ($6) | $600 | ✅✅ Сильный | ⭐⭐⭐ Средняя |
| Tier Batches | 0.42 SOL ($8.4) | $840 | ✅✅✅ Очень сильный | ⭐⭐ Простая |
| Rarity-Based | 0.265 SOL ($5.3) | $530 | ✅ Средний | ⭐ Простая |
| Гибрид | 0.4 SOL ($8) | $800 | ✅✅✅ Максимум | ⭐⭐⭐ Сложная |

**Рекомендация: Tier Batches** (баланс FOMO/доход/простота)

---

## 🔧 Реализация FOMO механики

### Код для Tier Batches:

```javascript
// В nft-mint.html

// Конфигурация батчей
const BATCH_CONFIG = [
    { from: 1, to: 20, basePrice: 0.15 },   // Batch 1
    { from: 21, to: 40, basePrice: 0.25 },  // Batch 2
    { from: 41, to: 60, basePrice: 0.35 },  // Batch 3
    { from: 61, to: 80, basePrice: 0.50 },  // Batch 4
    { from: 81, to: 100, basePrice: 0.75 }  // Batch 5
];

// Rarity multipliers
const RARITY_MULTIPLIERS = {
    'Common': 1.0,
    'Uncommon': 1.2,
    'Rare': 1.5,
    'Epic': 2.0,
    'Legendary': 3.0
};

// Получить текущий батч
function getCurrentBatch(mintedCount) {
    for (const batch of BATCH_CONFIG) {
        if (mintedCount >= batch.from && mintedCount <= batch.to) {
            return batch;
        }
    }
    return BATCH_CONFIG[BATCH_CONFIG.length - 1]; // Last batch
}

// Получить цену для следующего минта
async function getNextMintPrice() {
    // Получить количество уже заминченных NFT из Supabase
    const { data, error } = await supabase
        .from('user_nfts')
        .select('id', { count: 'exact' });
    
    const mintedCount = data ? data.length : 0;
    const nextMintNumber = mintedCount + 1;
    
    // Найти текущий батч
    const batch = getCurrentBatch(nextMintNumber);
    
    // Базовая цена батча
    const basePrice = batch.basePrice;
    
    return {
        basePrice: basePrice,
        batchNumber: BATCH_CONFIG.indexOf(batch) + 1,
        mintNumber: nextMintNumber,
        remainingInBatch: batch.to - mintedCount,
        nextBatchPrice: BATCH_CONFIG[BATCH_CONFIG.indexOf(batch) + 1]?.basePrice || null
    };
}

// Рассчитать финальную цену с rarity
function calculateFinalPrice(basePrice, rarity) {
    const multiplier = RARITY_MULTIPLIERS[rarity] || 1.0;
    return basePrice * multiplier;
}

// UI для отображения FOMO
async function updateMintUI() {
    const priceInfo = await getNextMintPrice();
    
    document.getElementById('current-batch').textContent = `Batch ${priceInfo.batchNumber}/5`;
    document.getElementById('base-price').textContent = `${priceInfo.basePrice} SOL`;
    document.getElementById('remaining-in-batch').textContent = `${priceInfo.remainingInBatch} left`;
    
    if (priceInfo.nextBatchPrice) {
        document.getElementById('next-batch-warning').innerHTML = 
            `⚠️ Next batch: ${priceInfo.nextBatchPrice} SOL (+${((priceInfo.nextBatchPrice / priceInfo.basePrice - 1) * 100).toFixed(0)}%)`;
    }
    
    // Прогресс бар
    const progress = (priceInfo.mintNumber / 100) * 100;
    document.getElementById('mint-progress').style.width = `${progress}%`;
    document.getElementById('mint-progress-text').textContent = `${priceInfo.mintNumber}/100 minted`;
}

// При минте
async function mintNFT() {
    const priceInfo = await getNextMintPrice();
    const rarity = assignRandomRarity(); // Существующая функция
    const finalPrice = calculateFinalPrice(priceInfo.basePrice, rarity);
    
    // Показать пользователю
    const confirmed = confirm(
        `Mint NFT #${priceInfo.mintNumber}?\n\n` +
        `Batch ${priceInfo.batchNumber}/5\n` +
        `Base Price: ${priceInfo.basePrice} SOL\n` +
        `Rarity: ${rarity} (×${RARITY_MULTIPLIERS[rarity]})\n` +
        `Final Price: ${finalPrice.toFixed(3)} SOL\n\n` +
        `${priceInfo.remainingInBatch} NFTs left in this batch!\n` +
        (priceInfo.nextBatchPrice ? `Next batch: ${priceInfo.nextBatchPrice} SOL 📈` : '')
    );
    
    if (!confirmed) return;
    
    // Минт с динамической ценой
    await processNFTMint(finalPrice, rarity);
}
```

### UI элементы для FOMO:

```html
<!-- В nft-mint.html -->

<div class="fomo-section">
    <div class="batch-info">
        <h3>🔥 Current Batch</h3>
        <div class="batch-number" id="current-batch">Batch 1/5</div>
        <div class="batch-price">Base Price: <span id="base-price">0.15 SOL</span></div>
        <div class="batch-remaining" id="remaining-in-batch">20 left</div>
        <div class="next-batch-warning" id="next-batch-warning"></div>
    </div>
    
    <div class="mint-progress-bar">
        <div class="progress-fill" id="mint-progress" style="width: 0%"></div>
        <div class="progress-text" id="mint-progress-text">0/100 minted</div>
    </div>
    
    <div class="fomo-message">
        ⚡ Price increases every 20 NFTs!<br>
        🎯 Mint now before next batch!
    </div>
</div>

<style>
.fomo-section {
    background: linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(255, 165, 0, 0.1));
    border: 2px solid rgba(255, 0, 0, 0.3);
    border-radius: 15px;
    padding: 20px;
    margin: 20px 0;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.3); }
    50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.6); }
}

.batch-info {
    text-align: center;
    margin-bottom: 20px;
}

.batch-number {
    font-size: 32px;
    font-weight: bold;
    color: #ff4444;
    margin: 10px 0;
}

.batch-remaining {
    font-size: 18px;
    color: #ff6600;
    font-weight: bold;
}

.next-batch-warning {
    margin-top: 10px;
    padding: 10px;
    background: rgba(255, 0, 0, 0.2);
    border-radius: 8px;
    font-weight: bold;
}

.mint-progress-bar {
    position: relative;
    height: 30px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    overflow: hidden;
    margin: 15px 0;
}

.progress-fill {
    position: absolute;
    height: 100%;
    background: linear-gradient(90deg, #ff4444, #ff6600);
    transition: width 0.5s ease;
}

.progress-text {
    position: absolute;
    width: 100%;
    text-align: center;
    line-height: 30px;
    font-weight: bold;
    color: white;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.fomo-message {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #ff4444;
    margin-top: 15px;
}
</style>
```

---

## 💰 Финальная таблица цен

### Рекомендуемая: Tier Batches

```
┌──────────────┬────────────┬──────────────┬─────────────┐
│   Batch      │   Range    │  Base Price  │   Revenue   │
├──────────────┼────────────┼──────────────┼─────────────┤
│ Batch 1 🟢   │  1-20      │  0.15 SOL    │  3.0 SOL    │
│ Batch 2 🟡   │  21-40     │  0.25 SOL    │  5.0 SOL    │
│ Batch 3 🟠   │  41-60     │  0.35 SOL    │  7.0 SOL    │
│ Batch 4 🔴   │  61-80     │  0.50 SOL    │  10.0 SOL   │
│ Batch 5 🔥   │  81-100    │  0.75 SOL    │  15.0 SOL   │
├──────────────┼────────────┼──────────────┼─────────────┤
│ TOTAL        │  100 NFT   │  Avg 0.4 SOL │  40 SOL     │
└──────────────┴────────────┴──────────────┴─────────────┘

В долларах (1 SOL = $20):
- Batch 1: $3 each
- Batch 2: $5 each
- Batch 3: $7 each
- Batch 4: $10 each
- Batch 5: $15 each

Total Revenue: $800 🎉

vs. Current Fixed Price:
- Bronze: $1 each × 100 = $100
- Разница: $800 vs. $100 = 8x больше! 🚀
```

---

## 🎯 Маркетинговая стратегия для FOMO

### Анонс до запуска:

```
🔥 Solana Tamagotchi NFT Mint - 100 Supply ONLY!

Tier Batch Pricing:
✅ Batch 1 (1-20):   0.15 SOL - CHEAPEST!
✅ Batch 2 (21-40):  0.25 SOL
✅ Batch 3 (41-60):  0.35 SOL
✅ Batch 4 (61-80):  0.50 SOL
✅ Batch 5 (81-100): 0.75 SOL - LAST CHANCE!

🎲 Random Rarity: Common to Legendary
💎 Earning Boost: ×2.0 to ×3.0
⚡ Price increases every 20 mints!

Mint now: [LINK]
```

### Во время минта (Twitter updates):

```
Tweet 1 (After Batch 1 sold out):
"🔥 BATCH 1 SOLD OUT in 2 hours!
20/100 minted ✅
Batch 2 now LIVE: 0.25 SOL
Next 20 NFTs only! ⏰"

Tweet 2 (Batch 3 active):
"⚠️ Price Alert!
40/100 minted
Current: 0.35 SOL
Next batch: 0.50 SOL (+43%)
Mint now: [LINK]"

Tweet 3 (Batch 5):
"🚨 FINAL BATCH!
80/100 minted
Last 20 NFTs: 0.75 SOL each
After this = SOLD OUT FOREVER! 🔥"
```

---

## ✅ Что делать СЕЙЧАС:

### 1. Решить по ценам:

```
Вариант A: Оставить как есть (0.05-0.2 SOL)
Плюсы: Просто, доступно
Минусы: Мало дохода, нет FOMO

Вариант B: Tier Batches (0.15-0.75 SOL) ⭐ РЕКОМЕНДУЮ
Плюсы: FOMO, хороший доход, простая реализация
Минусы: Нужно обновить код

Вариант C: Bonding Curve (0.1-0.6 SOL)
Плюсы: Максимум FOMO
Минусы: Сложная реализация
```

### 2. Обновить код:

```
Если выбираешь Tier Batches:
- Добавить BATCH_CONFIG
- Обновить getNextMintPrice()
- Добавить FOMO UI
- Обновить processNFTMint()

Время: 2-3 часа кода
```

### 3. Протестировать:

```
- Минт NFT #1 (Batch 1, 0.15 SOL)
- Минт NFT #21 (Batch 2, 0.25 SOL)
- Проверить UI обновления
- Проверить прогресс бар
```

---

**Моя рекомендация: Tier Batches с базовой ценой 0.15-0.75 SOL. Это золотая середина между доступностью и доходом, плюс создаёт мощный FOMO эффект!** 🔥

**P.S.** Degenerate Ape Academy продали 10,000 NFT по прогрессивной цене и собрали $8M+. Ты можешь сделать то же самое в своём масштабе! 🚀

