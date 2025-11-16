# 🎨 NFT ASSETS - Изображения для Solana Tamagotchi NFT

## 📁 Структура папок

```
nft-assets/
├── bronze/
│   ├── common.png      (70% шанс)
│   ├── uncommon.png    (20% шанс)
│   ├── rare.png        (7% шанс)
│   └── epic.png        (3% шанс)
├── silver/
│   ├── uncommon.png    (50% шанс)
│   ├── rare.png        (30% шанс)
│   ├── epic.png        (15% шанс)
│   └── legendary.png   (5% шанс)
├── gold/
│   ├── common.png      (50% шанс)
│   ├── uncommon.png    (30% шанс)
│   ├── rare.png        (15% шанс)
│   └── epic.png        (5% шанс)
└── diamond/
    ├── rare.png        (50% шанс)
    ├── epic.png        (30% шанс)
    ├── legendary.png   (15% шанс)
    └── mythical.png    (5% шанс)
```

---

## 🎨 Требования к изображениям

- **Размер:** 1000x1000 px (минимум 512x512, рекомендуется 1000x1000)
- **Формат:** PNG с прозрачностью (или JPG)
- **Вес:** До 10 MB (оптимально до 1 MB)
- **Стиль:** Pixel art / Cute / Web3 aesthetics

---

## 🌟 Дизайн рекомендации

### **Bronze (Бронза) - Стартовый тир**
- Цвета: Коричневый, оранжевый
- Emoji: 🥉
- Стиль: Простой, базовый дизайн
- Настроение: Начинающий питомец

### **Silver (Серебро) - Средний тир**
- Цвета: Серебристый, голубой
- Emoji: 🥈
- Стиль: Улучшенный, с деталями
- Настроение: Активный питомец

### **Gold (Золото) - Премиум тир**
- Цвета: Золотой, желтый
- Emoji: 🥇
- Стиль: Блестящий, роскошный
- Настроение: Элитный питомец

### **Diamond (Алмаз) - Топ тир**
- Цвета: Алмазный (голубой, белый), радужные
- Emoji: 💎
- Стиль: Сияющий, магический
- Настроение: Легендарный питомец

---

## 📤 Где хранить изображения?

### **ВАРИАНТ 1: NFT.Storage (РЕКОМЕНДУЕТСЯ) ✅**

**Бесплатно, постоянное хранение на IPFS + Filecoin**

1. Зарегистрируйся: https://nft.storage/
2. Получи API Key: https://nft.storage/manage/
3. Загрузи картинки (через UI или API):

```bash
# Через UI:
# 1. Зайди на https://nft.storage/files/
# 2. Нажми "Upload Files"
# 3. Выбери все PNG файлы
# 4. Скопируй IPFS CID (например: bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi)
```

```javascript
// Через API (Node.js):
const { NFTStorage, File } = require('nft.storage');
const fs = require('fs');

const client = new NFTStorage({ token: 'твой_API_KEY' });

async function uploadImage(filePath) {
    const imageFile = fs.readFileSync(filePath);
    const cid = await client.storeBlob(new Blob([imageFile]));
    console.log('IPFS CID:', cid);
    return `https://ipfs.io/ipfs/${cid}`;
}

// Загрузка всех изображений
uploadImage('./nft-assets/bronze/common.png');
uploadImage('./nft-assets/bronze/uncommon.png');
// ... и т.д.
```

4. **Обнови URLs в коде:**

```javascript
// В mint.html замени:
const baseUrl = 'https://solanatamagotchi.com/nft-assets';

// На IPFS URLs:
const NFT_IMAGES = {
    bronze: {
        common: 'https://ipfs.io/ipfs/bafybei...', 
        uncommon: 'https://ipfs.io/ipfs/bafybei...',
        rare: 'https://ipfs.io/ipfs/bafybei...',
        epic: 'https://ipfs.io/ipfs/bafybei...'
    },
    silver: {
        uncommon: 'https://ipfs.io/ipfs/bafybei...',
        rare: 'https://ipfs.io/ipfs/bafybei...',
        epic: 'https://ipfs.io/ipfs/bafybei...',
        legendary: 'https://ipfs.io/ipfs/bafybei...'
    },
    gold: {
        common: 'https://ipfs.io/ipfs/bafybei...',
        uncommon: 'https://ipfs.io/ipfs/bafybei...',
        rare: 'https://ipfs.io/ipfs/bafybei...',
        epic: 'https://ipfs.io/ipfs/bafybei...'
    },
    diamond: {
        rare: 'https://ipfs.io/ipfs/bafybei...',
        epic: 'https://ipfs.io/ipfs/bafybei...',
        legendary: 'https://ipfs.io/ipfs/bafybei...',
        mythical: 'https://ipfs.io/ipfs/bafybei...'
    }
};

function getNFTImageUrl(tier, rarity) {
    return NFT_IMAGES[tier.toLowerCase()][rarity.toLowerCase()] 
        || 'https://via.placeholder.com/1000x1000.png?text=NFT'; // fallback
}
```

---

### **ВАРИАНТ 2: Pinata (IPFS, платно/бесплатно)**

1. Зарегистрируйся: https://pinata.cloud/
2. Free план: 1 GB (достаточно для ~500 NFT изображений)
3. Загрузи через UI: https://app.pinata.cloud/pinmanager
4. Получи IPFS CID и используй: `https://gateway.pinata.cloud/ipfs/{CID}`

---

### **ВАРИАНТ 3: Arweave (постоянное хранение, платно)**

1. Оплата: ~$7 за 1 GB (one-time payment)
2. Используется Metaplex по умолчанию при минте
3. Загрузка через Bundlr: https://bundlr.network/

**Плюс:** Метаданные уже загружаются на Arweave при минте (см. `mint-nft-onchain.js`)

---

## 🛠️ Как создать изображения?

### **ВАРИАНТ 1: Заказать дизайнеру**
- Fiverr: $20-$50 за 4-5 картинок
- Upwork: $50-$150 за полный набор (16 изображений)
- Reddit r/HungryArtists

### **ВАРИАНТ 2: AI генерация**
```bash
# Prompts для DALL-E / Midjourney:
"Cute pixel art tamagotchi pet, bronze tier, common rarity, 
transparent background, kawaii style, 1000x1000"

"Diamond tier legendary tamagotchi pet, sparkling, magical aura, 
glowing eyes, pixel art style, transparent background, 1000x1000"
```

**Сервисы:**
- DALL-E: https://openai.com/dall-e-3
- Midjourney: https://midjourney.com
- Leonardo.ai: https://leonardo.ai (бесплатно!)
- Stable Diffusion: https://stablediffusionweb.com

### **ВАРИАНТ 3: Готовые ассеты**
- OpenGameArt: https://opengameart.org/
- Itch.io: https://itch.io/game-assets/free
- Kenny.nl: https://kenney.nl/assets (бесплатные pixel art ассеты)

---

## 📋 Checklist для запуска

- [ ] 1. Создать/получить 16 изображений (4 тира × 4 редкости)
- [ ] 2. Оптимизировать размер (до 1 MB каждое)
- [ ] 3. Загрузить на NFT.Storage или Pinata
- [ ] 4. Получить IPFS URLs
- [ ] 5. Обновить `getNFTImageUrl()` в `mint.html`
- [ ] 6. Протестировать минт (проверить, что картинка загружается)
- [ ] 7. Обновить my-nfts.html для отображения реальных картинок

---

## 🔥 Quick Start (5 минут)

```bash
# 1. Зарегистрируйся на NFT.Storage
# https://nft.storage/

# 2. Создай временные placeholder изображения (до готовых)
# Используй: https://via.placeholder.com/1000x1000.png?text=Bronze+Common

# 3. Обнови mint.html:
const NFT_IMAGES = {
    bronze: {
        common: 'https://via.placeholder.com/1000/CD7F32/FFFFFF?text=Bronze+Common',
        uncommon: 'https://via.placeholder.com/1000/CD7F32/FFFFFF?text=Bronze+Uncommon',
        // ...
    },
    // ...
};

# 4. Позже замени placeholder'ы на реальные IPFS URLs
```

---

## ❓ FAQ

**Q: Сколько стоит хранение на IPFS?**
A: NFT.Storage - бесплатно (до 31 GB). Pinata - $0 (1 GB бесплатно).

**Q: Можно ли использовать обычный хостинг (solanatamagotchi.com)?**
A: Можно, но НЕ рекомендуется для NFT. Если сервер упадет → картинки исчезнут. IPFS/Arweave - постоянное хранение.

**Q: Какой размер изображений оптимален?**
A: 1000x1000 px (1 MB). Или 512x512 px (300 KB) для экономии места.

**Q: Можно ли менять изображения после минта?**
A: Нет! После минта metadata URI immutable. Картинка должна быть готова до минта.

---

## 📞 Поддержка

Если нужна помощь - пиши!
- Могу помочь с загрузкой на IPFS
- Могу создать скрипт для массовой загрузки
- Могу порекомендовать дизайнеров

