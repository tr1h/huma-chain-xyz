# 🚀 Roadmap: Виртуальные NFT → Реальные On-Chain NFT

## 📍 Текущее состояние

```
✅ NFT система работает (буст заработка)
✅ SOL payments реальные (on-chain)
✅ База данных user_nfts настроена
✅ Admin panel отображает NFT holders
❌ NFT mint address виртуальный (не on-chain)
❌ Нельзя увидеть в Solana Explorer
❌ Нельзя листить на Magic Eden
```

---

## 🎯 Цель

**Превратить виртуальные NFT в настоящие on-chain NFT через Metaplex**

---

## 📋 Пошаговый план

### Этап 1: Подготовка изображений (3-7 дней)

#### Задача 1.1: Определить стиль NFT

```
Варианты:

A) Pixel Art (простой):
   Примеры: CryptoPunks, Moonbirds
   Время: 1-3 дня
   Стоимость: $50-150
   Инструменты: Aseprite, Piskel

B) Cartoon 2D (средний):
   Примеры: Bored Ape, Doodles
   Время: 3-7 дней
   Стоимость: $100-300
   Инструменты: Figma, Illustrator

C) 3D Render (сложный):
   Примеры: Clone X, Meebits
   Время: 1-2 недели
   Стоимость: $200-500
   Инструменты: Blender, Cinema 4D

Рекомендация для тебя: Cartoon 2D
- Баланс красота/стоимость/время
- Легко делать вариации
- Хорошо смотрится в малых размерах
```

#### Задача 1.2: Нанять дизайнера

```
Платформы:
1. Fiverr.com
   - Поиск: "NFT collection design"
   - Цена: $50-200 за 10 дизайнов
   - Время: 3-7 дней
   - Оценка: ⭐⭐⭐⭐

2. Upwork.com
   - Поиск: "Solana NFT artist"
   - Цена: $100-500
   - Качество: выше
   - Оценка: ⭐⭐⭐⭐⭐

3. Reddit r/NFTArt
   - Пост: "Looking for NFT artist for Solana project"
   - Цена: договорная
   - Оценка: ⭐⭐⭐

Техзадание для дизайнера:
"""
Need 10 unique Tamagotchi-style pet designs for Solana NFT collection.

Requirements:
- Style: Cute cartoon 2D (like Tamagotchi/Pokemon)
- Format: PNG, 1000x1000px, transparent background
- Quantity: 10 base designs
- Variations: Different colors, expressions, accessories
- Delivery: PNG + source files (AI/PSD)

Budget: $100-200
Timeline: 5-7 days

Reference examples:
- [прикрепи примеры стиля]
"""
```

#### Задача 1.3: Генерация коллекции

```
Инструмент: HashLips Art Engine (бесплатно!)

Установка:
git clone https://github.com/HashLips/hashlips_art_engine
cd hashlips_art_engine
npm install

Подготовка слоёв:
layers/
├── Background/
│   ├── Blue.png
│   ├── Green.png
│   ├── Purple.png
│   └── ... (10 вариантов)
├── Body/
│   ├── Type1.png
│   ├── Type2.png
│   └── ... (10 base designs от дизайнера)
├── Eyes/
│   ├── Happy.png
│   ├── Sad.png
│   ├── Angry.png
│   └── ... (8 вариантов)
├── Mouth/
│   ├── Smile.png
│   ├── Laugh.png
│   └── ... (6 вариантов)
└── Accessories/ (optional)
    ├── Hat.png
    ├── Glasses.png
    └── ... (15 вариантов)

Конфигурация rarity:
{
  "layersOrder": [
    { "name": "Background", "rarity": { "Blue": 50, "Green": 30, "Purple": 20 } },
    { "name": "Body" },
    { "name": "Eyes" },
    { "name": "Mouth" },
    { "name": "Accessories", "rarity": { "Hat": 10, "Glasses": 20, "None": 70 } }
  ]
}

Генерация:
node index.js

Результат:
build/
├── images/
│   ├── 1.png
│   ├── 2.png
│   └── ... (100 уникальных NFT)
└── json/
    ├── 1.json
    ├── 2.json
    └── ... (metadata для каждого)
```

---

### Этап 2: Загрузка на Arweave (1 день)

#### Задача 2.1: Установить Metaplex Sugar CLI

```bash
# Установка
bash <(curl -sSf https://sugar.metaplex.com/install.sh)

# Проверка
sugar --version

# Должно показать: sugar-cli 2.x.x
```

#### Задача 2.2: Подготовить конфиг

```bash
# Создать папку проекта
mkdir solana-gotchi-nft
cd solana-gotchi-nft

# Скопировать изображения
cp -r ../hashlips_art_engine/build/images ./assets/
cp -r ../hashlips_art_engine/build/json ./assets/

# Создать config
sugar create-config

# Редактировать config.json:
{
  "price": 0.05,
  "number": 100,
  "symbol": "GOTCHI",
  "sellerFeeBasisPoints": 500,
  "creators": [
    {
      "address": "YOUR_WALLET_ADDRESS",
      "share": 100
    }
  ],
  "uploadMethod": "bundlr",
  "awsConfig": null,
  "nftStorageAuthToken": null,
  "pinataConfig": null,
  "hiddenSettings": null
}
```

#### Задача 2.3: Загрузить на Arweave

```bash
# Загрузить
sugar upload

# Стоимость: ~$5-10 для 100 NFT

# Проверить
sugar verify

# Должно показать: All files uploaded successfully!
```

---

### Этап 3: Интеграция Metaplex SDK (2-3 дня)

#### Задача 3.1: Установить зависимости

```bash
# В корне проекта
npm install @metaplex-foundation/js @solana/web3.js
```

#### Задача 3.2: Создать NFT mint функцию

```javascript
// В nft-mint.html или отдельный файл metaplex-mint.js

import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

// Подключение к Solana
const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(payerKeypair)) // Keypair из backend
    .use(bundlrStorage());

// Функция минта NFT
async function mintOnChainNFT(tier, rarity, multiplier, userWallet) {
    try {
        // 1. Определить metadata URI (уже загружено на Arweave)
        const metadataIndex = getRandomNFTIndex(tier, rarity);
        const metadataUri = `https://arweave.net/YOUR_UPLOAD_ID/${metadataIndex}.json`;
        
        // 2. Минт NFT
        const { nft } = await metaplex.nfts().create({
            uri: metadataUri,
            name: `Gotchi ${tier} #${metadataIndex}`,
            sellerFeeBasisPoints: 500, // 5% royalty
            collection: collectionNFT, // Optional: Verified Collection
            creators: [
                {
                    address: new PublicKey('YOUR_CREATOR_WALLET'),
                    verified: true,
                    share: 100
                }
            ]
        });
        
        console.log('✅ NFT Minted!', nft.address.toString());
        
        // 3. Перенести NFT пользователю
        await metaplex.nfts().transfer({
            nftOrSft: nft,
            toOwner: new PublicKey(userWallet)
        });
        
        console.log('✅ NFT Transferred to user!');
        
        return nft.address.toString(); // РЕАЛЬНЫЙ mint address!
        
    } catch (error) {
        console.error('❌ Mint failed:', error);
        throw error;
    }
}
```

#### Задача 3.3: Обновить nft-mint.html

```javascript
// Заменить строку 826
// Было:
const nftMintAddress = 'NFT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// Стало:
const nftMintAddress = await mintOnChainNFT(selectedTier, rarity, multiplier, userPublicKey);

// Теперь nftMintAddress = реальный Solana address!
// Пример: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
```

---

### Этап 4: Тестирование на Devnet (1-2 дня)

#### Задача 4.1: Минт тестовый NFT

```javascript
// Протестировать минт
const testMintAddress = await mintOnChainNFT('Bronze', 'Common', 2.0, 'TEST_USER_WALLET');

console.log('Test NFT:', testMintAddress);
```

#### Задача 4.2: Проверить в Solana Explorer

```
1. Скопировать mint address
2. Открыть: https://explorer.solana.com/address/{MINT_ADDRESS}?cluster=devnet
3. Проверить:
   ✅ Token metadata загружена
   ✅ Image отображается
   ✅ Attributes корректные
   ✅ Creator verified
```

#### Задача 4.3: Проверить в Phantom Wallet

```
1. Phantom → Settings → Change Network → Devnet
2. Collectibles tab
3. Должен появиться NFT!
   ✅ Изображение показывается
   ✅ Название корректное
   ✅ Attributes отображаются
```

#### Задача 4.4: Исправить баги

```
Возможные проблемы:

1. Изображение не загружается:
   - Проверь URI в metadata
   - Проверь CORS на Arweave
   - Подожди 1-2 минуты (кеширование)

2. Metadata не загружена:
   - Проверь формат JSON
   - Проверь Arweave URI
   - Проверь Metaplex Standard

3. Высокие комиссии:
   - Используй Devnet (бесплатно)
   - Оптимизируй размер metadata
   - Используй Bundlr для пакетной загрузки
```

---

### Этап 5: Создание Verified Collection (опционально, 1 день)

```javascript
// Создать Collection NFT
const { nft: collectionNft } = await metaplex.nfts().create({
    name: "Solana Tamagotchi",
    uri: "https://arweave.net/YOUR_COLLECTION_METADATA",
    sellerFeeBasisPoints: 500,
    isCollection: true
});

// Привязать NFT к коллекции (при минте)
const { nft } = await metaplex.nfts().create({
    // ... другие параметры
    collection: collectionNft.address
});

// Верифицировать
await metaplex.nfts().verifyCollection({
    mintAddress: nft.address,
    collectionMintAddress: collectionNft.address
});

// Теперь все NFT будут отображаться как единая коллекция!
```

---

### Этап 6: Переход на Mainnet (1 день)

#### Задача 6.1: Обновить RPC endpoints

```javascript
// Было:
const connection = new Connection(clusterApiUrl('devnet'));

// Стало:
const connection = new Connection('https://api.mainnet-beta.solana.com');
// Или используй QuickNode/Alchemy для стабильности
```

#### Задача 6.2: Обновить кошельки

```
Devnet → Mainnet:
- Payer keypair (с реальным SOL)
- Treasury wallets (с реальными адресами)
- TAMA mint address (Mainnet token)
```

#### Задача 6.3: Минт первый NFT на Mainnet

```bash
# Получить SOL на Mainnet кошелёк (купить на бирже)
# Минимум: ~0.1 SOL для комиссий

# Минт тестовый NFT
node test-mainnet-mint.js

# Проверить:
https://explorer.solana.com/address/{MINT_ADDRESS}
```

---

### Этап 7: Листинг на Magic Eden (3-7 дней)

#### Задача 7.1: Подготовить материалы

```
Нужно:
1. Collection Name: "Solana Tamagotchi"
2. Collection Description: "Play-to-Earn Tamagotchi NFT collection..."
3. Twitter: @your_twitter
4. Discord: your_discord
5. Website: https://your-domain.com
6. Logo: 400x400 PNG
7. Banner: 1400x400 PNG
8. 10+ minted NFTs на Mainnet
```

#### Задача 7.2: Подать заявку

```
Форма: https://magiceden.io/creators/apply

Заполнить:
- Collection details
- Social links
- Team information
- Roadmap

Ждать: 1-3 дня (верификация)
```

#### Задача 7.3: Верификация

```
Magic Eden проверит:
✅ Metadata корректна
✅ Images загружаются
✅ Creator verified
✅ Royalties настроены
✅ Нет плагиата

Если всё ОК → одобрят!
```

#### Задача 7.4: Листинг

```
После одобрения:
1. Collection появится на Magic Eden
2. Пользователи смогут листить NFT
3. Floor price установится рынком
4. Royalties будут автоматически начисляться

Пример:
https://magiceden.io/marketplace/solana_tamagotchi
```

---

## 💰 Стоимость реализации

```
Дизайн (10 базовых):       $100-200
Arweave storage:            $5-10
Mainnet mint комиссии:      $0.01-0.05 per NFT
Тестирование Devnet:        $0 (бесплатно)
Время разработки:           10-15 дней

ИТОГО: $100-300 + время
```

---

## 📅 Timeline

```
День 1-7:   Дизайн NFT (нанять дизайнера + ревью)
День 8:     Генерация коллекции (HashLips)
День 9:     Загрузка на Arweave (Sugar CLI)
День 10-12: Интеграция Metaplex SDK
День 13-14: Тестирование на Devnet
День 15:    Запуск на Mainnet
День 16+:   Листинг на Magic Eden (ждём одобрения)

Минимум: 2 недели
Реалистично: 3-4 недели (с буфером)
```

---

## ✅ Checklist перед запуском

### Технический

```
□ NFT минтятся on-chain (Devnet протестировано)
□ Metadata загружена на Arweave
□ Images отображаются в Phantom
□ Solana Explorer показывает NFT корректно
□ Royalties настроены (5%)
□ Creator verified
□ Collection NFT создан (опционально)
□ Backend логирует реальные mint addresses
□ Буст в игре работает с on-chain NFT
□ Mainnet кошельки подготовлены
□ Достаточно SOL для комиссий (~0.1 SOL)
```

### Маркетинг

```
□ Twitter account создан
□ Discord server создан (опционально)
□ Website/Landing page готов
□ Logo & Banner готовы (400x400, 1400x400)
□ Roadmap написан
□ Magic Eden application submitted
□ Community уведомлена о запуске
```

---

## 🎯 Альтернативные варианты

### Вариант 1: Упрощённый (без дизайнера)

```
Используй AI генерацию:
- Midjourney: $10/месяц, 200 изображений
- DALL-E 3: $20 за 100 изображений
- Leonardo.ai: Бесплатно 150/день

Процесс:
1. Создать промпты для AI
   "Cute pixel art tamagotchi pet, transparent background, happy expression, blue color"
   
2. Сгенерировать 100 вариантов
3. Отредактировать в Photoshop (убрать фон, resize)
4. Загрузить на Arweave

Время: 2-3 дня
Стоимость: $10-30
Качество: средн��е, но ОК для старта
```

### Вариант 2: Использовать готовые asset packs

```
Платформы:
- itch.io (pixel art packs $5-20)
- Unity Asset Store ($10-50)
- OpenGameArt.org (бесплатно, CC license)

Купить pack → Модифицировать → Использовать
Время: 1-2 дня
Стоимость: $10-50
Легальность: Проверь лицензию!
```

---

## 🚨 Важные моменты

### 1. Storage решение

```
Варианты:
1. Arweave (рекомендуется):
   ✅ Постоянное хранение (платишь 1 раз)
   ✅ ~$5-10 за 100 NFT
   ✅ Интеграция с Metaplex

2. IPFS (альтернатива):
   ✅ Бесплатно (через Pinata/NFT.Storage)
   ❌ Нужен pin для постоянства
   ✅ Хорошая интеграция

3. AWS S3 (не рекомендуется):
   ❌ Не "настоящий" Web3
   ❌ Ежемесячная оплата
   ✅ Но дешёво и надёжно
```

### 2. Metaplex vs. Собственный минт

```
Metaplex (рекомендуется):
✅ Стандарт индустрии
✅ Автоматическая совместимость с маркетплейсами
✅ SDK и документация
✅ Community support

Собственный минт (не рекомендуется):
❌ Нужно писать свой стандарт
❌ Маркетплейсы не поддержат
❌ Больше работы, меньше пользы
```

### 3. SVG в NFT

```
Вопрос: "SVG можно перевести в анимацию же"

Ответ: ДА, но с ограничениями

Процесс:
1. Создать SVG в Figma/Illustrator
2. Импортировать в After Effects
3. Добавить анимацию
4. Export as GIF или MP4
5. Использовать GIF/MP4 как NFT image

Инструменты:
- SVGator (онлайн SVG анимация → экспорт GIF)
- Bodymovin (AE → Lottie → GIF)
- ffmpeg (конвертация форматов)

Ограничения:
❌ Magic Eden не поддерживает SVG напрямую
❌ Нужна конвертация в растр (PNG/GIF/MP4)
✅ Но исходники в SVG = удобно для вариаций
```

---

## 📚 Полезные ресурсы

```
Документация:
- Metaplex Docs: https://docs.metaplex.com/
- Sugar CLI: https://docs.metaplex.com/tools/sugar/
- Solana Cookbook: https://solanacookbook.com/

Инструменты:
- HashLips Art Engine: https://github.com/HashLips/hashlips_art_engine
- Metaplex JS SDK: https://github.com/metaplex-foundation/js
- Phantom Wallet: https://phantom.app/

Маркетплейсы:
- Magic Eden: https://magiceden.io/
- Tensor: https://www.tensor.trade/
- Solanart: https://solanart.io/

Дизайнеры:
- Fiverr: https://www.fiverr.com/search/gigs?query=nft%20design
- Upwork: https://www.upwork.com/freelance-jobs/nft-design/
- Reddit: https://www.reddit.com/r/NFTArt/
```

---

**P.S.** Не нужно делать всё идеально с первого раза. Начни с простого дизайна, протестируй на Devnet, запусти на Mainnet. Можно всегда обновить коллекцию позже (Season 2, новые дизайны)! 🚀

