# 🚀 Что делать ПОСЛЕ загрузки изображений

## ✅ Предположим: Ты уже сгенерировал и сохранил изображения

---

## 📋 ШАГ 1: Проверь структуру файлов (5 минут)

### **Убедись что файлы на месте:**

```
nft-assets/generated/
├── bronze/
│   ├── common.png
│   ├── uncommon.png
│   ├── rare.png
│   ├── epic.png
│   └── legendary.png
├── silver/
│   ├── common.png
│   ├── uncommon.png
│   ├── rare.png
│   ├── epic.png
│   └── legendary.png
├── gold/
│   └── ... (5 файлов)
├── platinum/
│   └── ... (5 файлов)
└── diamond/
    └── ... (5 файлов)
```

**Проверь:**
- ✅ Все 25 файлов на месте (5 tiers × 5 rarities)
- ✅ Названия: `{rarity}.png` (например: `common.png`, `rare.png`)
- ✅ Размер: 1000x1000px (или больше)
- ✅ Формат: PNG

---

## 📤 ШАГ 2: Загрузка на IPFS (30 минут)

### **Вариант A: NFT.Storage (РЕКОМЕНДУЕТСЯ) ✅**

#### **2.1. Получи API Key:**
1. Зарегистрируйся: https://nft.storage/
2. Зайди: https://nft.storage/manage/
3. Создай новый API Key
4. Скопируй ключ

#### **2.2. Установи зависимости:**
```bash
cd nft-assets
npm install nft.storage
```

#### **2.3. Обнови скрипт загрузки:**

Нужно обновить `upload-to-ipfs.js` чтобы он работал с новой структурой `generated/{tier}/{rarity}.png`:

```javascript
// В upload-to-ipfs.js измени путь:
const filePath = path.join(__dirname, 'generated', tier, `${rarity}.png`);
```

#### **2.4. Запусти загрузку:**

**Windows PowerShell:**
```powershell
$env:NFT_STORAGE_KEY="твой_api_key_здесь"
node upload-to-ipfs.js
```

**Или через .env файл:**
```bash
# Создай .env файл в nft-assets/
NFT_STORAGE_KEY=твой_api_key_здесь
```

#### **2.5. Результат:**
Скрипт выведет:
- ✅ IPFS CID для каждого файла
- ✅ IPFS URL для каждого файла
- ✅ Готовый код для `mint.html`
- ✅ Сохранит в `ipfs-urls.json`

---

### **Вариант B: Ручная загрузка (если скрипт не работает)**

1. Зайди на: https://nft.storage/files/
2. Нажми "Upload Files"
3. Выбери все 25 PNG файлов
4. Загрузи
5. Скопируй IPFS CID
6. URLs будут: `https://ipfs.io/ipfs/{CID}/filename.png`

**Проблема:** При загрузке всех файлов сразу, нужно будет вручную создать структуру URLs.

---

## 🔧 ШАГ 3: Обновление кода (30 минут)

### **3.1. Обнови `mint.html`:**

Найди функцию `getNFTImageUrl` или создай её:

```javascript
// Добавь в mint.html (после загрузки на IPFS)
const NFT_IMAGES = {
    bronze: {
        common: 'https://ipfs.io/ipfs/Qm.../bronze-common.png',
        uncommon: 'https://ipfs.io/ipfs/Qm.../bronze-uncommon.png',
        rare: 'https://ipfs.io/ipfs/Qm.../bronze-rare.png',
        epic: 'https://ipfs.io/ipfs/Qm.../bronze-epic.png',
        legendary: 'https://ipfs.io/ipfs/Qm.../bronze-legendary.png'
    },
    silver: {
        common: 'https://ipfs.io/ipfs/Qm.../silver-common.png',
        uncommon: 'https://ipfs.io/ipfs/Qm.../silver-uncommon.png',
        rare: 'https://ipfs.io/ipfs/Qm.../silver-rare.png',
        epic: 'https://ipfs.io/ipfs/Qm.../silver-epic.png',
        legendary: 'https://ipfs.io/ipfs/Qm.../silver-legendary.png'
    },
    gold: {
        common: 'https://ipfs.io/ipfs/Qm.../gold-common.png',
        uncommon: 'https://ipfs.io/ipfs/Qm.../gold-uncommon.png',
        rare: 'https://ipfs.io/ipfs/Qm.../gold-rare.png',
        epic: 'https://ipfs.io/ipfs/Qm.../gold-epic.png',
        legendary: 'https://ipfs.io/ipfs/Qm.../gold-legendary.png'
    },
    platinum: {
        common: 'https://ipfs.io/ipfs/Qm.../platinum-common.png',
        uncommon: 'https://ipfs.io/ipfs/Qm.../platinum-uncommon.png',
        rare: 'https://ipfs.io/ipfs/Qm.../platinum-rare.png',
        epic: 'https://ipfs.io/ipfs/Qm.../platinum-epic.png',
        legendary: 'https://ipfs.io/ipfs/Qm.../platinum-legendary.png'
    },
    diamond: {
        common: 'https://ipfs.io/ipfs/Qm.../diamond-common.png',
        uncommon: 'https://ipfs.io/ipfs/Qm.../diamond-uncommon.png',
        rare: 'https://ipfs.io/ipfs/Qm.../diamond-rare.png',
        epic: 'https://ipfs.io/ipfs/Qm.../diamond-epic.png',
        legendary: 'https://ipfs.io/ipfs/Qm.../diamond-legendary.png'
    }
};

function getNFTImageUrl(tier, rarity) {
    const tierLower = tier.toLowerCase();
    const rarityLower = rarity.toLowerCase();
    return NFT_IMAGES[tierLower]?.[rarityLower] || 
           'https://via.placeholder.com/1000x1000.png?text=NFT';
}
```

**Где вставить:**
- Найди место где используется `getNFTImageUrl` в `mint.html`
- Или добавь перед функцией `mintOnChainNFTAsync`

---

### **3.2. Обнови `marketplace.html`:**

В `marketplace.html` найди где отображаются NFT и используй:

```javascript
// В функции displayNFTs()
const imageUrl = getNFTImageUrl(nft.tier_name, nft.rarity);
// Используй imageUrl вместо эмодзи
```

---

### **3.3. Обнови `my-nfts.html`:**

В `my-nfts.html` найди где показываются NFT и используй:

```javascript
// В функции displayNFTs()
const imageUrl = getNFTImageUrl(nft.tier_name, nft.rarity);
// Покажи <img src="${imageUrl}"> вместо эмодзи
```

---

## 🧪 ШАГ 4: Тестирование (15 минут)

### **4.1. Проверь mint.html:**
1. Открой: https://solanatamagotchi.com/mint.html
2. Попробуй заминтить NFT
3. Проверь что изображение отображается
4. Открой консоль (F12) - проверь нет ли ошибок загрузки изображений

### **4.2. Проверь marketplace.html:**
1. Открой: https://solanatamagotchi.com/marketplace.html
2. Проверь что NFT отображаются с реальными изображениями
3. Проверь что изображения загружаются

### **4.3. Проверь my-nfts.html:**
1. Открой: https://solanatamagotchi.com/my-nfts.html
2. Проверь свою коллекцию
3. Убедись что изображения показываются

---

## 🔄 ШАГ 5: Обновление скрипта загрузки (если нужно)

Если `upload-to-ipfs.js` не работает с новой структурой, обнови его:

```javascript
// В upload-to-ipfs.js измени:
const TIERS = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

// И путь к файлам:
const filePath = path.join(__dirname, 'generated', tier, `${rarity}.png`);
```

---

## 📝 ШАГ 6: Сохранение IPFS URLs

После загрузки скрипт создаст файл:
```
nft-assets/ipfs/ipfs-urls.json
```

**Сохрани этот файл!** Он содержит все IPFS URLs для использования в коде.

---

## ✅ Чеклист:

- [ ] Все 25 изображений сохранены в `nft-assets/generated/{tier}/{rarity}.png`
- [ ] Получен API key от NFT.Storage
- [ ] Установлен `nft.storage` (`npm install nft.storage`)
- [ ] Обновлен `upload-to-ipfs.js` (если нужно)
- [ ] Загружены все изображения на IPFS
- [ ] Получены IPFS URLs
- [ ] Обновлен `mint.html` с IPFS URLs
- [ ] Обновлен `marketplace.html` (если нужно)
- [ ] Обновлен `my-nfts.html` (если нужно)
- [ ] Протестировано отображение NFT
- [ ] Запушил изменения на GitHub

---

## 🆘 Если что-то не работает:

### **Проблема: Изображения не загружаются**
- Проверь IPFS URLs в консоли браузера (F12)
- Убедись что URLs правильные
- Проверь что файлы доступны: открой URL в браузере

### **Проблема: Скрипт не находит файлы**
- Проверь структуру папок
- Убедись что файлы названы правильно: `common.png`, `rare.png`, etc.
- Проверь путь в скрипте

### **Проблема: IPFS URLs не работают**
- Попробуй другой gateway: `https://gateway.pinata.cloud/ipfs/{CID}`
- Или: `https://cloudflare-ipfs.com/ipfs/{CID}`
- Проверь что файлы действительно загружены на IPFS

---

## 🎯 ИТОГО:

1. **Сохрани файлы** → `nft-assets/generated/{tier}/{rarity}.png`
2. **Загрузи на IPFS** → через `upload-to-ipfs.js` или вручную
3. **Обнови код** → добавь IPFS URLs в `mint.html`
4. **Протестируй** → проверь что всё работает
5. **Запушь** → на GitHub

**Готово!** 🎉






