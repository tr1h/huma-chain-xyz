# 🛒 NFT Marketplace - Полное руководство

## 📋 Что такое Marketplace?

**Marketplace** — это место, где игроки могут покупать и продавать NFT питомцев друг другу за TAMA токены.

---

## 🎯 Как это работает?

### **1. Продажа NFT (Sell):**

```
Шаг 1: Выбираете NFT из своей коллекции
Шаг 2: Устанавливаете цену (минимум 1,000 TAMA)
Шаг 3: NFT становится доступным для покупки
Шаг 4: Когда кто-то покупает → вы получаете 95% от цены (5% комиссия)
```

### **2. Покупка NFT (Buy):**

```
Шаг 1: Просматриваете доступные NFT
Шаг 2: Выбираете понравившийся
Шаг 3: Платите цену + 5% комиссия
Шаг 4: NFT переходит в вашу коллекцию
```

---

## 💰 Экономика Marketplace:

### **Комиссии:**
- **Platform Fee:** 5% от каждой продажи
- **Распределение комиссии:**
  - 40% → Burn (дефляция)
  - 30% → Treasury
  - 30% → P2E Pool

### **Пример:**
```
NFT продается за 10,000 TAMA:
├─ Продавец получает: 9,500 TAMA (95%)
└─ Комиссия (5% = 500 TAMA):
   ├─ 200 TAMA → Burn 🔥
   ├─ 150 TAMA → Treasury 💰
   └─ 150 TAMA → P2E Pool 🎮
```

---

## 🗄️ Database Schema:

### **1. Таблица `marketplace_listings`:**

```sql
CREATE TABLE marketplace_listings (
    id BIGSERIAL PRIMARY KEY,
    nft_id BIGINT NOT NULL REFERENCES user_nfts(id),
    seller_telegram_id TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'sold', 'cancelled'
    created_at TIMESTAMP DEFAULT NOW(),
    sold_at TIMESTAMP,
    buyer_telegram_id TEXT,
    transaction_hash TEXT
);

CREATE INDEX idx_listings_status ON marketplace_listings(status);
CREATE INDEX idx_listings_seller ON marketplace_listings(seller_telegram_id);
CREATE INDEX idx_listings_price ON marketplace_listings(price);
```

### **2. Таблица `marketplace_sales` (история):**

```sql
CREATE TABLE marketplace_sales (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT REFERENCES marketplace_listings(id),
    nft_id BIGINT NOT NULL,
    seller_telegram_id TEXT NOT NULL,
    buyer_telegram_id TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    fee NUMERIC(12,2) NOT NULL,
    seller_received NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sales_seller ON marketplace_sales(seller_telegram_id);
CREATE INDEX idx_sales_buyer ON marketplace_sales(buyer_telegram_id);
```

### **3. Обновление `user_nfts`:**

```sql
ALTER TABLE user_nfts ADD COLUMN is_listed BOOLEAN DEFAULT false;
ALTER TABLE user_nfts ADD COLUMN listing_id BIGINT REFERENCES marketplace_listings(id);
```

---

## 🔧 API Endpoints:

### **1. List NFT for Sale:**

```http
POST /api/tama/marketplace/list
Content-Type: application/json

{
    "telegram_id": "123456",
    "nft_id": 42,
    "price": 10000
}
```

**Response:**
```json
{
    "success": true,
    "listing_id": 1,
    "message": "NFT listed successfully"
}
```

**PHP Implementation:**
```php
function handleMarketplaceList($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $telegram_id = $input['telegram_id'] ?? null;
    $nft_id = $input['nft_id'] ?? null;
    $price = $input['price'] ?? null;
    
    // Validation
    if (!$telegram_id || !$nft_id || !$price || $price < 1000) {
        returnError('Invalid input', 400);
    }
    
    // Check NFT ownership
    $nft = supabaseRequest($url, $key, 'GET', 'user_nfts', [
        'id' => 'eq.' . $nft_id,
        'telegram_id' => 'eq.' . $telegram_id,
        'is_active' => 'eq.true'
    ]);
    
    if (empty($nft['data'])) {
        returnError('NFT not found or not owned', 404);
    }
    
    if ($nft['data'][0]['is_listed']) {
        returnError('NFT already listed', 400);
    }
    
    // Create listing
    $listing = supabaseRequest($url, $key, 'POST', 'marketplace_listings', [
        'nft_id' => $nft_id,
        'seller_telegram_id' => $telegram_id,
        'price' => $price,
        'status' => 'active'
    ]);
    
    // Update NFT
    supabaseRequest($url, $key, 'PATCH', 'user_nfts', [
        'id' => 'eq.' . $nft_id
    ], [
        'is_listed' => true,
        'listing_id' => $listing['data'][0]['id']
    ]);
    
    echo json_encode([
        'success' => true,
        'listing_id' => $listing['data'][0]['id']
    ]);
}
```

### **2. Get Listings:**

```http
GET /api/tama/marketplace/listings?tier=Gold&rarity=Legendary&sort=price-asc
```

**Response:**
```json
{
    "listings": [
        {
            "listing_id": 1,
            "nft_id": 42,
            "tier_name": "Gold",
            "rarity": "Legendary",
            "earning_multiplier": 4.0,
            "pet_type": "Dragon",
            "price": 50000,
            "seller_telegram_id": "123456",
            "created_at": "2025-11-20T10:00:00Z"
        }
    ]
}
```

### **3. Buy NFT:**

```http
POST /api/tama/marketplace/buy
Content-Type: application/json

{
    "telegram_id": "789012",
    "listing_id": 1
}
```

**Response:**
```json
{
    "success": true,
    "transaction_id": "abc123",
    "message": "NFT purchased successfully"
}
```

**PHP Implementation:**
```php
function handleMarketplaceBuy($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $telegram_id = $input['telegram_id'] ?? null;
    $listing_id = $input['listing_id'] ?? null;
    
    // Get listing
    $listing = supabaseRequest($url, $key, 'GET', 'marketplace_listings', [
        'id' => 'eq.' . $listing_id,
        'status' => 'eq.active'
    ]);
    
    if (empty($listing['data'])) {
        returnError('Listing not found or already sold', 404);
    }
    
    $listing_data = $listing['data'][0];
    
    // Check buyer balance
    $buyer = supabaseRequest($url, $key, 'GET', 'leaderboard', [
        'telegram_id' => 'eq.' . $telegram_id
    ]);
    
    $total_cost = $listing_data['price'] + ($listing_data['price'] * 0.05);
    
    if ($buyer['data'][0]['tama'] < $total_cost) {
        returnError('Insufficient balance', 400);
    }
    
    // Transfer NFT ownership
    supabaseRequest($url, $key, 'PATCH', 'user_nfts', [
        'id' => 'eq.' . $listing_data['nft_id']
    ], [
        'telegram_id' => $telegram_id,
        'is_listed' => false,
        'listing_id' => null
    ]);
    
    // Update balances
    $seller_received = $listing_data['price'] * 0.95;
    $fee = $listing_data['price'] * 0.05;
    
    // Deduct from buyer
    supabaseRequest($url, $key, 'PATCH', 'leaderboard', [
        'telegram_id' => 'eq.' . $telegram_id
    ], [
        'tama' => $buyer['data'][0]['tama'] - $total_cost
    ]);
    
    // Add to seller
    $seller = supabaseRequest($url, $key, 'GET', 'leaderboard', [
        'telegram_id' => 'eq.' . $listing_data['seller_telegram_id']
    ]);
    
    supabaseRequest($url, $key, 'PATCH', 'leaderboard', [
        'telegram_id' => 'eq.' . $listing_data['seller_telegram_id']
    ], [
        'tama' => ($seller['data'][0]['tama'] ?? 0) + $seller_received
    ]);
    
    // Update listing
    supabaseRequest($url, $key, 'PATCH', 'marketplace_listings', [
        'id' => 'eq.' . $listing_id
    ], [
        'status' => 'sold',
        'buyer_telegram_id' => $telegram_id,
        'sold_at' => date('c')
    ]);
    
    // Record sale
    supabaseRequest($url, $key, 'POST', 'marketplace_sales', [
        'listing_id' => $listing_id,
        'nft_id' => $listing_data['nft_id'],
        'seller_telegram_id' => $listing_data['seller_telegram_id'],
        'buyer_telegram_id' => $telegram_id,
        'price' => $listing_data['price'],
        'fee' => $fee,
        'seller_received' => $seller_received
    ]);
    
    // Distribute fee
    distributeMarketplaceFee($fee, $url, $key);
    
    echo json_encode([
        'success' => true,
        'transaction_id' => uniqid()
    ]);
}

function distributeMarketplaceFee($fee, $url, $key) {
    $burn = $fee * 0.4;
    $treasury = $fee * 0.3;
    $p2e = $fee * 0.3;
    
    // Burn (deduct from total supply)
    // Treasury (add to treasury wallet)
    // P2E Pool (add to P2E pool)
    // Implementation depends on your tokenomics system
}
```

### **4. Cancel Listing:**

```http
POST /api/tama/marketplace/cancel
Content-Type: application/json

{
    "telegram_id": "123456",
    "listing_id": 1
}
```

### **5. Get Marketplace Stats:**

```http
GET /api/tama/marketplace/stats
```

**Response:**
```json
{
    "total_listed": 42,
    "total_sales": 150,
    "floor_price": 5000,
    "volume": 1500000,
    "average_price": 10000
}
```

---

## 🎨 UI/UX Features:

### **1. Browse Tab:**
- Все доступные NFT для покупки
- Фильтры: Tier, Rarity, Price
- Сортировка: Price, Rarity, Newest

### **2. My Listings Tab:**
- Ваши NFT на продаже
- Возможность отменить листинг
- Статистика просмотров (future)

### **3. My Sales Tab:**
- История покупок
- История продаж
- Общая статистика

### **4. Stats Dashboard:**
- Total Listed NFTs
- Total Sales
- Floor Price
- Volume (TAMA)

---

## 🔒 Безопасность:

### **1. Ownership Verification:**
- Проверка владения NFT перед листингом
- Проверка баланса перед покупкой

### **2. Price Validation:**
- Минимальная цена: 1,000 TAMA
- Максимальная цена: 10,000,000 TAMA (защита от ошибок)

### **3. Transaction Safety:**
- Атомарные операции (все или ничего)
- Проверка статуса листинга перед покупкой
- Защита от двойной покупки

---

## 📊 Примеры использования:

### **Сценарий 1: Продажа NFT**

```
Игрок A имеет:
- Gold Dragon (Legendary, 4.0x boost)
- Хочет продать за 50,000 TAMA

Действия:
1. Открывает marketplace
2. Нажимает "List NFT for Sale"
3. Выбирает Gold Dragon
4. Устанавливает цену: 50,000 TAMA
5. Подтверждает

Результат:
- NFT появляется в marketplace
- Игрок A получает 47,500 TAMA при продаже (95%)
- Комиссия 2,500 TAMA распределяется (40% burn, 30% treasury, 30% P2E)
```

### **Сценарий 2: Покупка NFT**

```
Игрок B хочет купить:
- Gold Dragon за 50,000 TAMA
- У него есть 60,000 TAMA

Действия:
1. Просматривает marketplace
2. Находит Gold Dragon
3. Нажимает "Buy Now"
4. Подтверждает покупку

Результат:
- Игрок B платит 52,500 TAMA (50,000 + 5% fee)
- NFT переходит в коллекцию Игрок B
- Игрок A получает 47,500 TAMA
```

---

## 🚀 Roadmap для реализации:

### **Phase 1: Базовая функциональность (2-3 недели)**
- [ ] Database schema
- [ ] API endpoints (list, buy, cancel)
- [ ] Базовая UI (browse, sell modal)
- [ ] Базовая безопасность

### **Phase 2: Продвинутые фичи (2-3 недели)**
- [ ] Фильтры и сортировка
- [ ] Статистика marketplace
- [ ] История покупок/продаж
- [ ] Уведомления о продаже

### **Phase 3: Оптимизация (1-2 недели)**
- [ ] Кэширование для производительности
- [ ] Пагинация для больших списков
- [ ] Поиск по названию/типу
- [ ] Favorites/Watchlist

### **Phase 4: Дополнительные фичи (future)**
- [ ] Аукционы (bidding)
- [ ] Offers (предложения)
- [ ] Bundle sales (продажа наборов)
- [ ] Trading history charts

---

## 💡 Преимущества Marketplace:

### **1. Для игроков:**
- Возможность продать ненужные NFT
- Возможность купить редкие NFT
- Заработок на торговле

### **2. Для проекта:**
- Дополнительный источник дохода (комиссии)
- Дефляция через burn
- Увеличение вовлеченности
- Создание вторичного рынка

### **3. Для экономики:**
- Циркуляция TAMA токенов
- Установление рыночных цен
- Создание ликвидности

---

## ⚠️ Важные моменты:

### **1. Ценообразование:**
- Рыночные цены устанавливаются игроками
- Редкие NFT (Legendary) будут дороже
- Цены могут колебаться

### **2. Ликвидность:**
- Зависит от количества игроков
- Зависит от количества NFT на продаже
- Может быть низкой в начале

### **3. Мошенничество:**
- Защита от поддельных NFT
- Проверка владения
- Прозрачная история транзакций

---

## 📚 Ресурсы:

- [OpenSea API](https://docs.opensea.io/) - примеры marketplace API
- [Magic Eden](https://magiceden.io/) - Solana NFT marketplace
- [NFT Marketplace Best Practices](https://nftgators.com/nft-marketplace-best-practices/)

---

**Вывод:** Marketplace — это мощная фича, которая создает вторичный рынок для NFT, увеличивает вовлеченность игроков и создает дополнительный источник дохода для проекта. Реализация средней сложности, но очень ценная для экосистемы игры.






