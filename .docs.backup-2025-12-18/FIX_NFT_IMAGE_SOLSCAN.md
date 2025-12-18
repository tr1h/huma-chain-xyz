# 🖼️ Как исправить изображение NFT на Solscan

## ❌ Проблема:

NFT на Solscan не показывает изображение (placeholder icon):
- NFT существует: "Gotchi Bronze Common #160"
- Collection: "Unknown Collection"
- Изображение не отображается

## ✅ Решение:

### **Вариант 1: Обновить метаданные через API (Рекомендуется)**

#### **Шаг 1: Найти Mint Address NFT**

На Solscan скопируйте mint address NFT (например: `A9Mitqhotv...fjU3z43amc`)

#### **Шаг 2: Обновить метаданные**

Используйте PowerShell скрипт:

```powershell
# Windows PowerShell
cd C:\goooog
.\tools\update-single-nft.ps1 -MintAddress "A9Mitqhotv...fjU3z43amc" -Tier "Bronze" -Rarity "Common" -Multiplier 2.0 -DesignNumber 160
```

**Или через API напрямую:**

```bash
curl -X POST https://api.solanatamagotchi.com/api/update-nft-metadata-wrapper.php \
  -H "Content-Type: application/json" \
  -d '{
    "mintAddress": "A9Mitqhotv...fjU3z43amc",
    "tier": "Bronze",
    "rarity": "Common",
    "multiplier": 2.0,
    "design_number": 160
  }'
```

#### **Шаг 3: Подождать 1-2 минуты**

После обновления подождите 1-2 минуты и обновите страницу Solscan.

---

### **Вариант 2: Массовое обновление всех NFT**

Если нужно обновить все NFT сразу:

```bash
# Node.js скрипт
cd C:\goooog
npm run update-all-nfts
```

Это обновит метаданные для всех NFT в базе данных.

---

## 🔍 Проверка:

### **1. Проверить метаданные на Solscan:**

1. Откройте NFT на Solscan
2. Перейдите на вкладку **"METADATA"**
3. Найдите поле `image` - там должен быть IPFS URL
4. Скопируйте URL и откройте в браузере - изображение должно загрузиться

### **2. Проверить IPFS Gateway:**

Если изображение не загружается, попробуйте другой gateway:

**Оригинальный URL:**
```
https://gateway.lighthouse.storage/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i
```

**Альтернативные gateways:**
```
https://ipfs.io/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i
https://cloudflare-ipfs.com/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i
https://gateway.pinata.cloud/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i
```

---

## 🛠️ Технические детали:

### **Как работает обновление:**

1. **API получает запрос** с mint address и параметрами NFT
2. **Находит правильный IPFS URL** для tier + rarity
3. **Создает новый metadata JSON** с правильным `image` полем
4. **Загружает metadata на Arweave** через Metaplex
5. **Обновляет NFT на блокчейне** через `metaplex.nfts().update()`
6. **Solscan автоматически обновляется** через 1-2 минуты

### **Требования:**

- ✅ NFT должен быть **MUTABLE** (можно обновить)
- ✅ Payer keypair должен иметь **SOL** для транзакций (минимум 0.01 SOL)
- ✅ NFT должен существовать на блокчейне

---

## 📋 Список IPFS URL для каждого tier+rarity:

### **Bronze:**
- Common: `https://gateway.lighthouse.storage/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i`
- Uncommon: `https://gateway.lighthouse.storage/ipfs/bafkreibnoiown4k6dyhxvv642ep6av6xwkgtqvusrhhn7l4janrgfjixbq`
- Rare: `https://gateway.lighthouse.storage/ipfs/bafkreia7mldvzaw52wvz42od4xdj7asw2fqc7gba7zhdbpfg3d6z3byl5y`
- Epic: `https://gateway.lighthouse.storage/ipfs/bafkreiefw2xgoo5w37jkpd6etgr6eurgu7z64tsb7e6bhbbqa5z3qidbbq`
- Legendary: `https://gateway.lighthouse.storage/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i`

### **Silver:**
- Common/Uncommon: `https://gateway.lighthouse.storage/ipfs/bafkreibp7zxf6fqilehacookucnyhzbqkvaqqbuk3jel7irsa2dzzvnw2a`
- Rare: `https://gateway.lighthouse.storage/ipfs/bafkreidnwtfwftmcsexgmf6p5qn5jorgwmtl4w2jegyyo7gnynvq2qe334`
- Epic: `https://gateway.lighthouse.storage/ipfs/bafkreifkxigyyudtynmn4ffmt2gx7getqs3jfzy2nqdjrzaplpelf3tozq`
- Legendary: `https://gateway.lighthouse.storage/ipfs/bafkreigywjdjw3vxopv4blicqioyx5fyqpwcvs22s2ea377rofvh2sslnm`

### **Gold:**
- Common: `https://gateway.lighthouse.storage/ipfs/bafkreicywzvyse3immuhakmd4dvv22gxsikmzhn4q7cjkmzjpp7253ftse`
- Uncommon: `https://gateway.lighthouse.storage/ipfs/bafkreibp7zxf6fqilehacookucnyhzbqkvaqqbuk3jel7irsa2dzzvnw2a`
- Rare: `https://gateway.lighthouse.storage/ipfs/bafkreidnwtfwftmcsexgmf6p5qn5jorgwmtl4w2jegyyo7gnynvq2qe334`
- Epic: `https://gateway.lighthouse.storage/ipfs/bafkreifkxigyyudtynmn4ffmt2gx7getqs3jfzy2nqdjrzaplpelf3tozq`

---

## ⚠️ Важные замечания:

1. **NFT должен быть MUTABLE:**
   - Если NFT immutable, метаданные нельзя обновить
   - Нужно проверить при минтинге

2. **IPFS Gateway может быть медленным:**
   - Lighthouse Storage может быть недоступен иногда
   - Solscan может кэшировать старые метаданные
   - Подождите 1-2 минуты после обновления

3. **Проверка на разных explorer'ах:**
   - Solscan: `https://solscan.io/token/<MINT>?cluster=devnet`
   - Explorer: `https://explorer.solana.com/address/<MINT>?cluster=devnet`
   - XRAY: `https://xray.helius.xyz/token/<MINT>?cluster=devnet`

---

## 🚀 Быстрое решение:

Для NFT "Gotchi Bronze Common #160":

```powershell
# Замените <MINT_ADDRESS> на реальный адрес из Solscan
.\tools\update-single-nft.ps1 -MintAddress "<MINT_ADDRESS>" -Tier "Bronze" -Rarity "Common" -Multiplier 2.0 -DesignNumber 160
```

После выполнения:
1. Подождите 1-2 минуты
2. Обновите страницу Solscan (F5)
3. Изображение должно появиться!

---

## 📝 Если изображение все еще не показывается:

1. **Проверьте, что IPFS URL доступен:**
   - Откройте URL в браузере
   - Изображение должно загрузиться

2. **Проверьте метаданные:**
   - На Solscan → вкладка "METADATA"
   - Поле `image` должно содержать правильный URL

3. **Попробуйте другой gateway:**
   - Замените `gateway.lighthouse.storage` на `ipfs.io` или `cloudflare-ipfs.com`

4. **Проверьте, что NFT mutable:**
   - Если immutable, нужно переминтить NFT

