# 🛒 NFT Marketplace Integration Guide

## 📋 Overview

Как продавать NFT на маркетплейсах (Magic Eden, Tensor, etc.)

---

## ⚠️ ТЕКУЩАЯ СИТУАЦИЯ

**Сейчас:**
- ✅ NFT в базе данных (off-chain)
- ✅ Работает earning boost
- ❌ НЕ реальные on-chain NFT
- ❌ НЕ можно продать на маркетплейсе

**Для продажи нужно:**
- ✅ Создать реальные on-chain NFT (Metaplex)
- ✅ Сохранить mint address в базе
- ✅ Интегрировать с маркетплейсами

---

## 🎯 ПЛАН ИНТЕГРАЦИИ

### **Phase 1: On-Chain NFT Creation** (Сейчас)

1. **Обновить NFT mint процесс:**
   - При минте создавать реальный NFT через Metaplex
   - Сохранять `mint_address` в базе (уже есть поле!)
   - Загружать metadata на Arweave/IPFS

2. **Структура metadata:**
   ```json
   {
     "name": "Gotchi #1234",
     "symbol": "GOTCHI",
     "description": "Bronze Common NFT - 2.0x earning boost",
     "image": "https://tr1h.github.io/huma-chain-xyz/nft-assets/bronze/common/1234.gif",
     "attributes": [
       { "trait_type": "Tier", "value": "Bronze" },
       { "trait_type": "Rarity", "value": "Common" },
       { "trait_type": "Earning Boost", "value": "2.0x" },
       { "trait_type": "Telegram ID", "value": "202140267" }
     ],
     "properties": {
       "files": [
         {
           "uri": "https://tr1h.github.io/huma-chain-xyz/nft-assets/bronze/common/1234.gif",
           "type": "image/gif"
         }
       ],
       "category": "image"
     }
   }
   ```

3. **Royalty (Creator Fee):**
   - 5% royalty на все продажи
   - Идет в Treasury wallet

---

### **Phase 2: Marketplace Integration**

#### **Option 1: Magic Eden** (Рекомендуется)

**Преимущества:**
- ✅ Самый популярный Solana маркетплейс
- ✅ Простая интеграция
- ✅ Автоматическое обнаружение NFT

**Как работает:**
1. NFT автоматически появляется на Magic Eden после минта
2. Пользователь заходит на Magic Eden
3. Находит свой NFT по mint address
4. Нажимает "List for Sale"
5. Устанавливает цену в SOL
6. Подтверждает транзакцию

**Ссылка:**
```
https://magiceden.io/item-details/{MINT_ADDRESS}
```

#### **Option 2: Tensor**

**Преимущества:**
- ✅ Низкие fees
- ✅ Хорошая ликвидность
- ✅ Профессиональный интерфейс

**Ссылка:**
```
https://www.tensor.trade/item/{MINT_ADDRESS}
```

#### **Option 3: Solanart**

**Преимущества:**
- ✅ Старый проверенный маркетплейс
- ✅ Простая интеграция

**Ссылка:**
```
https://solanart.io/search/?token={MINT_ADDRESS}
```

---

## 🛠️ РЕАЛИЗАЦИЯ

### **Step 1: Обновить NFT Mint (On-Chain)**

**Файл:** `nft-mint.html` или `api/tama_supabase.php`

**Что нужно:**
1. Использовать Metaplex для создания NFT
2. Загрузить metadata на Arweave/IPFS
3. Сохранить `mint_address` в базу

**Пример кода:**
```javascript
// В nft-mint.html после успешного TAMA/SOL payment
async function createOnChainNFT(tier, rarity, multiplier, userId) {
    const { Connection, PublicKey } = solanaWeb3;
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // 1. Создать metadata
    const metadata = {
        name: `Gotchi ${tier} ${rarity}`,
        symbol: "GOTCHI",
        description: `${tier} ${rarity} NFT - ${multiplier}x earning boost`,
        image: `https://tr1h.github.io/huma-chain-xyz/nft-assets/${tier.toLowerCase()}/${rarity.toLowerCase()}/${Date.now()}.gif`,
        attributes: [
            { trait_type: "Tier", value: tier },
            { trait_type: "Rarity", value: rarity },
            { trait_type: "Earning Boost", value: `${multiplier}x` },
            { trait_type: "Telegram ID", value: userId }
        ]
    };
    
    // 2. Загрузить на Arweave/IPFS (используй Bundlr или NFT.Storage)
    const metadataUri = await uploadToArweave(metadata);
    
    // 3. Создать NFT через Metaplex
    const { Metaplex } = require('@metaplex-foundation/js');
    const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet));
    
    const { nft } = await metaplex.nfts().create({
        uri: metadataUri,
        name: metadata.name,
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [
            {
                address: new PublicKey('6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM'), // Treasury
                share: 100
            }
        ]
    });
    
    // 4. Сохранить mint_address в базу
    await supabase
        .from('user_nfts')
        .update({ nft_mint_address: nft.address.toString() })
        .eq('telegram_id', userId)
        .eq('is_active', true)
        .order('minted_at', { ascending: false })
        .limit(1);
    
    return nft.address.toString();
}
```

---

### **Step 2: Добавить кнопку "Sell on Marketplace"**

**Файл:** `my-nfts.html`

**Что добавить:**
```html
<!-- В каждой NFT карточке -->
<button class="sell-btn" onclick="openMarketplace('${nft.nft_mint_address}')">
    💰 Sell on Marketplace
</button>
```

**JavaScript:**
```javascript
function openMarketplace(mintAddress) {
    // Magic Eden
    const magicEdenUrl = `https://magiceden.io/item-details/${mintAddress}`;
    
    // Tensor
    const tensorUrl = `https://www.tensor.trade/item/${mintAddress}`;
    
    // Показать выбор маркетплейса
    const choice = confirm('Choose marketplace:\nOK = Magic Eden\nCancel = Tensor');
    const url = choice ? magicEdenUrl : tensorUrl;
    
    window.open(url, '_blank');
}
```

---

### **Step 3: Backend API для On-Chain Mint**

**Файл:** `api/tama_supabase.php`

**Новый endpoint:** `/nft/create-on-chain`

```php
case '/nft/create-on-chain':
    handleCreateOnChainNFT($supabaseUrl, $supabaseKey);
    break;

function handleCreateOnChainNFT($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $telegram_id = $input['telegram_id'] ?? null;
    $tier = $input['tier'] ?? null;
    $rarity = $input['rarity'] ?? null;
    $multiplier = $input['multiplier'] ?? 2.0;
    
    // 1. Создать metadata JSON
    $metadata = [
        'name' => "Gotchi {$tier} {$rarity}",
        'symbol' => 'GOTCHI',
        'description' => "{$tier} {$rarity} NFT - {$multiplier}x earning boost",
        'image' => "https://tr1h.github.io/huma-chain-xyz/nft-assets/" . strtolower($tier) . "/" . strtolower($rarity) . "/" . time() . ".gif",
        'attributes' => [
            ['trait_type' => 'Tier', 'value' => $tier],
            ['trait_type' => 'Rarity', 'value' => $rarity],
            ['trait_type' => 'Earning Boost', 'value' => "{$multiplier}x"],
            ['trait_type' => 'Telegram ID', 'value' => $telegram_id]
        ]
    ];
    
    // 2. Загрузить на Arweave/IPFS (через API)
    $metadataUri = uploadToArweave($metadata);
    
    // 3. Создать NFT через CLI (spl-token + Metaplex CLI)
    $mintAddress = createNFTViaCLI($metadataUri, $tier, $rarity);
    
    // 4. Обновить базу
    supabaseRequest($url, $key, 'PATCH', 'user_nfts', [
        'telegram_id' => 'eq.' . $telegram_id,
        'is_active' => 'eq.true'
    ], [
        'nft_mint_address' => $mintAddress,
        'metadata_uri' => $metadataUri
    ], 'order=minted_at.desc&limit=1');
    
    echo json_encode([
        'success' => true,
        'mint_address' => $mintAddress,
        'metadata_uri' => $metadataUri,
        'magic_eden_url' => "https://magiceden.io/item-details/{$mintAddress}",
        'tensor_url' => "https://www.tensor.trade/item/{$mintAddress}"
    ]);
}
```

---

## 📊 СТРУКТУРА БАЗЫ ДАННЫХ

**Обновить таблицу `user_nfts`:**

```sql
ALTER TABLE user_nfts 
ADD COLUMN IF NOT EXISTS metadata_uri TEXT,
ADD COLUMN IF NOT EXISTS on_chain_mint_address TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS royalty_percentage NUMERIC(5, 2) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS creator_address TEXT DEFAULT '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM';
```

---

## 🎨 METADATA UPLOAD

### **Option 1: Arweave (Рекомендуется)**

**Преимущества:**
- ✅ Permanent storage (навсегда)
- ✅ Децентрализованный
- ✅ Бесплатно для NFT проектов

**Как использовать:**
```javascript
// Используй Bundlr Network
import { Bundlr } from '@bundlr-network/client';

const bundlr = new Bundlr('https://devnet.bundlr.network', 'solana', wallet);
const metadataTx = await bundlr.upload(JSON.stringify(metadata));
const metadataUri = `https://arweave.net/${metadataTx.id}`;
```

### **Option 2: IPFS (Pinata)**

**Преимущества:**
- ✅ Быстро
- ✅ Дешево
- ⚠️ Нужен pinning service

**Как использовать:**
```javascript
// Используй Pinata API
const formData = new FormData();
formData.append('file', new Blob([JSON.stringify(metadata)]));

const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
    },
    body: formData
});

const { IpfsHash } = await response.json();
const metadataUri = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
```

---

## 🚀 QUICK START

### **Для быстрого старта:**

1. **Используй готовый сервис:**
   - **NFT.Storage** (бесплатно, IPFS)
   - **Bundlr** (Arweave, нужен SOL для fees)

2. **Минимальная интеграция:**
   - Создай NFT через Metaplex
   - Сохрани mint address
   - Добавь ссылки на маркетплейсы

3. **Пользователь сам продает:**
   - Открывает Magic Eden
   - Находит свой NFT
   - Выставляет на продажу

---

## 📝 CHECKLIST

- [ ] Обновить NFT mint для создания on-chain NFT
- [ ] Добавить metadata upload (Arweave/IPFS)
- [ ] Сохранить mint_address в базу
- [ ] Добавить кнопку "Sell on Marketplace" в my-nfts.html
- [ ] Добавить ссылки на Magic Eden/Tensor
- [ ] Настроить royalty (5%)
- [ ] Протестировать на Devnet
- [ ] Мигрировать на Mainnet

---

## 💡 РЕКОМЕНДАЦИИ

1. **Начни с Devnet:**
   - Тестируй все на Devnet
   - Используй бесплатные SOL
   - Проверь интеграцию

2. **Используй готовые инструменты:**
   - Metaplex SDK для создания NFT
   - Bundlr для Arweave upload
   - Magic Eden автоматически обнаружит NFT

3. **Royalty:**
   - 5% - стандартная ставка
   - Идет в Treasury для развития проекта

4. **Metadata:**
   - Используй Arweave для permanent storage
   - Добавь все attributes для маркетплейсов
   - Включи изображения/GIF

---

## 🔗 ПОЛЕЗНЫЕ ССЫЛКИ

- **Magic Eden:** https://magiceden.io
- **Tensor:** https://www.tensor.trade
- **Metaplex Docs:** https://docs.metaplex.com
- **Bundlr:** https://bundlr.network
- **NFT.Storage:** https://nft.storage

---

## ❓ FAQ

**Q: Нужно ли создавать NFT сразу при минте?**
A: Да, лучше сразу создавать on-chain NFT. Иначе пользователь не сможет продать.

**Q: Можно ли продавать NFT без on-chain mint?**
A: Нет, маркетплейсы работают только с реальными on-chain NFT.

**Q: Сколько стоит создать NFT?**
A: ~0.01-0.02 SOL на Devnet (бесплатно), ~0.01-0.02 SOL на Mainnet.

**Q: Как проверить что NFT создан?**
A: Проверь на Solscan: `https://solscan.io/token/{MINT_ADDRESS}`

---

**Готово к реализации!** 🚀

