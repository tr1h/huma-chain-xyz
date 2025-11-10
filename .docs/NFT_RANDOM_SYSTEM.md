# 🎲 NFT Random System - Как работает со новой структурой

## ❓ ВОПРОС: Рандом или нет?

### Старая система (было):

```
Минт NFT → случайный tier → случайная редкость
Player купил → 🎲 рандом → получил Bronze/Silver/Gold

Проблема:
- Платишь одну цену
- Получаешь случайный результат
- Может быть и Bronze, может быть Gold
- Как лотерея
```

### Новая система (5 тиров с разными ценами):

```
❌ РАНДОМ НЕ ПОДХОДИТ!

Почему:
1. Bronze (TAMA 5,000): Если рандом → можешь получить Diamond?
   → НЕТ! Несправедливо для других кто платит 100 SOL!

2. Diamond (100 SOL = $16,400): Если рандом → можешь получить Bronze?
   → НЕТ! Это скам! Заплатил $16K, получил Bronze!

3. Bonding curve: Цены растут для КАЖДОГО тира
   → Цена = tier гарантирован
```

---

## ✅ РЕШЕНИЕ: ДВА ПОДХОДА

### Подход A: Фиксированные тиры (как DegenPhone) ⭐ РЕКОМЕНДУЮ

```
Платишь за Bronze → Получаешь Bronze (100%)
Платишь за Silver → Получаешь Silver (100%)
Платишь за Gold → Получаешь Gold (100%)
Платишь за Platinum → Получаешь Platinum (100%)
Платишь за Diamond → Получаешь Diamond (100%)

НЕТ рандома tier!
Цена = гарантия!
```

#### Но ВНУТРИ тира - разнообразие!

```
Bronze (4,500 NFT):
├─ Visual Style 1: 900 NFT (20%)
├─ Visual Style 2: 900 NFT (20%)
├─ Visual Style 3: 900 NFT (20%)
├─ Visual Style 4: 900 NFT (20%)
└─ Visual Style 5: 900 NFT (20%)

Каждый Bronze уникален визуально,
но все имеют ×2.0 boost!

Silver (350 NFT):
├─ Visual Variant A: 70 NFT
├─ Visual Variant B: 70 NFT
├─ Visual Variant C: 70 NFT
├─ Visual Variant D: 70 NFT
└─ Visual Variant E: 70 NFT

Каждый Silver уникален,
но все имеют ×2.3 boost!

И так далее...
```

#### Механика:

```javascript
// Минт Bronze
Player clicks "Mint Bronze for 5,000 TAMA"
↓
Check: Player has 5,000 TAMA? ✅
↓
Burn TAMA
↓
Randomly select ONE of 4,500 Bronze designs
↓
Mint that specific NFT
↓
Player gets Bronze with ×2.0 boost ✅

Tier = фиксированный (Bronze)
Design = случайный (1 из 4,500)
Boost = фиксированный (×2.0)
```

```javascript
// Минт Diamond
Player clicks "Mint Diamond for 100 SOL"
↓
Check: Player has 100 SOL? ✅
↓
Take 100 SOL
↓
Only 2 Diamond designs exist
↓
Randomly select ONE (1 or 2)
↓
Player gets Diamond with ×5.0 boost ✅

Tier = фиксированный (Diamond)
Design = случайный (1 or 2)
Boost = фиксированный (×5.0)
```

---

### Подход B: Рандом tier внутри ценовых групп (сложнее)

```
Группа 1 (TAMA):
└─ Платишь 5,000 TAMA → Получаешь Bronze (100%)

Группа 2 (Low SOL):
└─ Платишь 1-5 SOL → 🎲 Рандом:
   - 70% Bronze
   - 20% Silver
   - 10% Gold

Группа 3 (Mid SOL):
└─ Платишь 5-15 SOL → 🎲 Рандом:
   - 60% Silver
   - 30% Gold
   - 10% Platinum

Группа 4 (High SOL):
└─ Платишь 15+ SOL → 🎲 Рандом:
   - 50% Gold
   - 40% Platinum
   - 10% Diamond

Проблема:
❌ Сложно для bonding curve
❌ Непредсказуемо для покупателя
❌ Может быть несправедливо
```

---

## 🎯 РЕКОМЕНДАЦИЯ: Подход A (Фиксированные тиры)

### Почему это лучше:

```
✅ Честно:
   Платишь за X → получаешь X
   Никакого обмана

✅ Просто:
   Покупатель знает что получит
   Нет сюрпризов

✅ Как у топов:
   DegenPhone: выбираешь tier → получаешь tier
   Bored Apes: одна коллекция, один уровень
   CryptoPunks: все равны (no tiers)

✅ Bonding curve работает:
   Каждый tier = своя цена
   Цена растёт = demand растёт

✅ Разнообразие сохраняется:
   Внутри тира = разные визуальные стили
   Каждый NFT уникален
```

### Как это выглядит в UI:

```
┌────────────────────────────────────────────────┐
│ Choose Your Tier                               │
├────────────────────────────────────────────────┤
│                                                │
│ 🟫 Bronze - Common (4,500 available)           │
│    Price: 5,000 TAMA (Fixed)                   │
│    Boost: ×2.0 Earning                         │
│    [Mint Bronze] ←────────────────────────────┐│
│                                                ││
│ 🥈 Silver - Uncommon (350 available)           ││
│    Current Price: 1.54 SOL ($252.67)           ││
│    Next Price: 1.55 SOL (+0.6%)                ││
│    Boost: ×2.3 Earning                         ││
│    [Mint Silver] ←─────────────────────────────┤│
│                                                ││
│ 🥇 Gold - Rare (130 available)                 ││
│    Current Price: 5.83 SOL ($956.53)           ││
│    Next Price: 5.88 SOL (+0.9%)                ││
│    Boost: ×2.7 Earning                         ││
│    [Mint Gold] ←───────────────────────────────┤│
│                                                ││
│ 💎 Platinum - Epic (18 available)              ││
│    Current Price: 18.4 SOL ($3,018.89)         ││
│    Next Price: 19.5 SOL (+6.0%)                ││
│    Boost: ×3.5 Earning                         ││
│    [Mint Platinum] ←───────────────────────────┤│
│                                                ││
│ 🔷 Diamond - Legendary (2 available)           ││
│    Current Price: 75.0 SOL ($12,305.25)        ││
│    Next Price: 100.0 SOL (+33.3%)              ││
│    Boost: ×5.0 Earning (MAXIMUM!)              ││
│    [Mint Diamond] ←────────────────────────────┘│
│                                                │
│ ℹ️ You get the tier you pay for!               │
│   Each NFT has unique artwork within its tier. │
└────────────────────────────────────────────────┘
```

---

## 🎨 Визуальное разнообразие (без рандома tier)

### 5,000 уникальных изображений:

```
Bronze (4,500 designs):
├─ Theme 1: "Baby Creatures" (900 images)
│  ├─ Color A: Green (180)
│  ├─ Color B: Blue (180)
│  ├─ Color C: Red (180)
│  ├─ Color D: Yellow (180)
│  └─ Color E: Purple (180)
│
├─ Theme 2: "Happy Eggs" (900 images)
│  └─ 5 colors × 180 each
│
├─ Theme 3: "Pixel Pets" (900 images)
├─ Theme 4: "Cute Blobs" (900 images)
└─ Theme 5: "Mini Dragons" (900 images)

Silver (350 designs):
├─ Theme: "Evolved Creatures"
└─ 5 styles × 70 each

Gold (130 designs):
├─ Theme: "Elite Forms"
└─ 5 styles × 26 each

Platinum (18 designs):
├─ Theme: "Legendary Beasts"
└─ 18 unique designs

Diamond (2 designs):
├─ #1: "Mythic Alpha"
└─ #2: "Mythic Omega"
```

### Генерация:

```
AI Prompt для Bronze:
"Cute pixel art tamagotchi baby creature, 
simple design, common tier, 
[GREEN/BLUE/RED/YELLOW/PURPLE] color scheme,
transparent background, 512x512"

→ 4,500 вариаций

AI Prompt для Diamond:
"Epic legendary mythical tamagotchi creature,
ultra detailed pixel art, glowing effects,
divine aura, extremely rare,
transparent background, 1024x1024"

→ 2 УНИКАЛЬНЫХ шедевра
```

---

## 💻 Техническая реализация

### Database Schema:

```sql
-- NFT Designs library
CREATE TABLE nft_designs (
    id SERIAL PRIMARY KEY,
    tier_name TEXT NOT NULL,  -- Bronze, Silver, Gold, Platinum, Diamond
    design_number INT NOT NULL,  -- 1-4500 for Bronze, 1-350 for Silver, etc.
    image_url TEXT NOT NULL,  -- Arweave URL
    metadata_url TEXT NOT NULL,  -- Arweave metadata
    is_minted BOOLEAN DEFAULT false,
    minted_by BIGINT,  -- telegram_id
    minted_at TIMESTAMP,
    UNIQUE(tier_name, design_number)
);

-- Insert all designs (initially unminted)
INSERT INTO nft_designs (tier_name, design_number, image_url, metadata_url)
VALUES 
    -- Bronze 1-4500
    ('Bronze', 1, 'https://arweave.net/...', 'https://arweave.net/...'),
    ('Bronze', 2, 'https://arweave.net/...', 'https://arweave.net/...'),
    ...
    ('Bronze', 4500, 'https://arweave.net/...', 'https://arweave.net/...'),
    
    -- Silver 1-350
    ('Silver', 1, 'https://arweave.net/...', 'https://arweave.net/...'),
    ...
    
    -- Diamond 1-2
    ('Diamond', 1, 'https://arweave.net/...', 'https://arweave.net/...'),
    ('Diamond', 2, 'https://arweave.net/...', 'https://arweave.net/...');

-- User NFTs (после минта)
CREATE TABLE user_nfts (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT NOT NULL,
    nft_design_id INT NOT NULL REFERENCES nft_designs(id),
    tier_name TEXT NOT NULL,
    earning_multiplier DECIMAL(3,1) NOT NULL,
    minted_at TIMESTAMP DEFAULT NOW()
);
```

### Mint Logic:

```javascript
// Frontend - Player clicks "Mint Bronze"
async function mintBronze() {
    // Check TAMA balance
    const balance = await getTAMABalance(telegramId);
    if (balance < 5000) {
        alert('Not enough TAMA! You need 5,000 TAMA.');
        return;
    }
    
    // Call backend
    const result = await fetch('/api/mint-nft-bronze.php', {
        method: 'POST',
        body: JSON.stringify({
            telegram_id: telegramId,
            tier: 'Bronze'
        })
    });
    
    const data = await result.json();
    
    if (data.success) {
        alert(`Success! You minted Bronze NFT #${data.design_number}!`);
        // Show NFT image
        showNFT(data.image_url);
    }
}
```

```php
// Backend - /api/mint-nft-bronze.php
<?php
// Check TAMA balance
$balance = getTAMABalance($telegram_id);
if ($balance < 5000) {
    die(json_encode(['error' => 'Insufficient TAMA']));
}

// Get random unminted Bronze design
$query = "
    SELECT id, design_number, image_url, metadata_url 
    FROM nft_designs 
    WHERE tier_name = 'Bronze' 
    AND is_minted = false 
    ORDER BY RANDOM() 
    LIMIT 1
";
$design = pg_query($query)->fetch_assoc();

if (!$design) {
    die(json_encode(['error' => 'No Bronze NFTs left!']));
}

// Start transaction
pg_begin();

try {
    // Burn TAMA
    burnTAMA($telegram_id, 5000);
    
    // Mark design as minted
    pg_query("
        UPDATE nft_designs 
        SET is_minted = true, 
            minted_by = $telegram_id, 
            minted_at = NOW() 
        WHERE id = {$design['id']}
    ");
    
    // Create user NFT
    pg_query("
        INSERT INTO user_nfts 
        (telegram_id, nft_design_id, tier_name, earning_multiplier) 
        VALUES 
        ($telegram_id, {$design['id']}, 'Bronze', 2.0)
    ");
    
    pg_commit();
    
    echo json_encode([
        'success' => true,
        'tier' => 'Bronze',
        'design_number' => $design['design_number'],
        'image_url' => $design['image_url'],
        'boost' => 2.0
    ]);
    
} catch (Exception $e) {
    pg_rollback();
    die(json_encode(['error' => $e->getMessage()]));
}
?>
```

---

## 🎲 Элемент случайности (что остаётся)

### ✅ Случайное ВНУТРИ тира:

```
1. Минтишь Bronze:
   → Получаешь 1 из 4,500 Bronze дизайнов
   → Не знаешь какой именно
   → Сюрприз! 🎁

2. Минтишь Diamond:
   → Получаешь 1 из 2 Diamond дизайнов
   → #1 "Mythic Alpha" или #2 "Mythic Omega"
   → ОГРОМНЫЙ сюрприз! 💎

Excitement сохраняется!
Но честность гарантирована!
```

### ❌ НЕТ случайности tier:

```
Платишь за Bronze → Bronze 100%
Платишь за Diamond → Diamond 100%

Честно и прозрачно! ✅
```

---

## 📊 Сравнение подходов

```
┌───────────────────┬──────────────────┬──────────────────┐
│   Параметр        │  Фикс Tier (A)   │  Рандом Tier (B) │
├───────────────────┼──────────────────┼──────────────────┤
│ Честность         │ ✅ 100%          │ ⚠️ Зависит      │
│ Простота          │ ✅ Очень просто  │ ❌ Сложно       │
│ Bonding curve     │ ✅ Работает      │ ❌ Проблемы     │
│ User experience   │ ✅ Предсказуемо  │ ⚠️ Азартно      │
│ Как у топов       │ ✅ Да (DegenPh.) │ ❌ Нет          │
│ Excitement        │ ✅ (дизайн рандом)│ ✅ (tier рандом)│
│ Fair pricing      │ ✅ Идеально      │ ❌ Спорно       │
└───────────────────┴──────────────────┴──────────────────┘

Рекомендация: Подход A (Фикс Tier) ⭐
```

---

## ✅ ИТОГОВОЕ РЕШЕНИЕ:

```
🎯 ФИКСИРОВАННЫЕ ТИРЫ (Подход A)

Механика:
1. Покупаешь Bronze за 5,000 TAMA
   → Получаешь случайный Bronze design (1 из 4,500)
   → Tier = Bronze (гарантировано)
   → Boost = ×2.0 (гарантировано)

2. Покупаешь Diamond за 100 SOL
   → Получаешь случайный Diamond design (1 из 2)
   → Tier = Diamond (гарантировано)
   → Boost = ×5.0 (гарантировано)

Преимущества:
✅ Честно (платишь X → получаешь X)
✅ Просто (нет сложной логики)
✅ Как у лучших (DegenPhone, etc.)
✅ Excitement есть (случайный дизайн)
✅ Bonding curve работает идеально
✅ Fair pricing
✅ Предсказуемо для покупателя

Разнообразие:
🎨 5,000 уникальных дизайнов
🎨 Каждый NFT визуально уникален
🎨 Но tier и boost = фиксированы
```

---

**НЕТ РАНДОМА TIER! Платишь за Bronze → получаешь Bronze! Но ДИЗАЙН случайный из 4,500 вариантов!** 🎨✅

**Честно + Разнообразие + Как у топовых проектов!** 🔥💎

