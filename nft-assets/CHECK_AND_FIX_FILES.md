# 🔍 Проверка файлов NFT и инструкции

## 📋 Текущая ситуация:

По скриншотам вижу:
- ✅ **Bronze**: 5 файлов (common, epic, legendary, rare, uncommon) - **ГОТОВО!**
- ⚠️ **Silver**: 20 файлов (множественные варианты: common1-3, epic1-3 и т.д.) - **НУЖНО ВЫБРАТЬ**
- ✅ **Gold**: 5 файлов (common, epic, legendary, rare, uncommon) - **ГОТОВО!**
- ⚠️ **Platinum**: 5 файлов (common3, epic3, legendary4, rare2, uncommon3) - **НУЖНО ПЕРЕИМЕНОВАТЬ**
- ⚠️ **Diamond**: 8 файлов (common, epic, legendary1-4, rare, uncommon) - **НУЖНО ВЫБРАТЬ ОДИН LEGENDARY**

---

## 🎯 Что нужно сделать:

### 1️⃣ **Silver Tier** - Выбрать по одному файлу каждой редкости:

**Текущие файлы:**
- `common.png`, `common1.png`, `common2.png`, `common3.png` → **выбери один** (например, `common.png`)
- `uncommon.png`, `uncommon1.png`, `uncommon2.png`, `uncommon3.png` → **выбери один**
- `rare.png`, `rare1.png`, `rare2.png`, `rare3.png` → **выбери один**
- `epic.png`, `epic1.png`, `epic2.png`, `epic3.png` → **выбери один**
- `legendary.png`, `legendary2.png`, `legendary3.png`, `legendary4.png` → **выбери один**

**Действие:** Оставь по одному файлу каждой редкости, остальные можно удалить или переместить в папку `backup/`.

---

### 2️⃣ **Platinum Tier** - Переименовать файлы:

**Текущие файлы:**
- `common3.png` → переименовать в `common.png`
- `uncommon3.png` → переименовать в `uncommon.png`
- `rare2.png` → переименовать в `rare.png`
- `epic3.png` → переименовать в `epic.png`
- `legendary4.png` → переименовать в `legendary.png`

**Действие:** Переименуй все файлы, убрав номера.

---

### 3️⃣ **Diamond Tier** - Выбрать один legendary:

**Текущие файлы:**
- `common.png` ✅
- `uncommon.png` ✅
- `rare.png` ✅
- `epic.png` ✅
- `legendary1.png`, `legendary2.png`, `legendary3.png`, `legendary4.png` → **выбери один** и переименуй в `legendary.png`

**Действие:** Выбери лучший `legendary` файл, переименуй в `legendary.png`, остальные удали.

---

## ✅ Итоговая структура должна быть:

```
nft-assets/nft-assets/generated/
├── bronze/
│   ├── common.png ✅
│   ├── uncommon.png ✅
│   ├── rare.png ✅
│   ├── epic.png ✅
│   └── legendary.png ✅
├── silver/
│   ├── common.png (выбранный)
│   ├── uncommon.png (выбранный)
│   ├── rare.png (выбранный)
│   ├── epic.png (выбранный)
│   └── legendary.png (выбранный)
├── gold/
│   ├── common.png ✅
│   ├── uncommon.png ✅
│   ├── rare.png ✅
│   ├── epic.png ✅
│   └── legendary.png ✅
├── platinum/
│   ├── common.png (переименованный)
│   ├── uncommon.png (переименованный)
│   ├── rare.png (переименованный)
│   ├── epic.png (переименованный)
│   └── legendary.png (переименованный)
└── diamond/
    ├── common.png ✅
    ├── uncommon.png ✅
    ├── rare.png ✅
    ├── epic.png ✅
    └── legendary.png (выбранный и переименованный)
```

**Всего: 25 файлов (5 tiers × 5 rarities)**

---

## 🚀 После исправления файлов:

1. **Проверь структуру** - должно быть ровно 25 файлов
2. **Загрузи на IPFS** - `node upload-to-ipfs.js`
3. **Обнови код** - вставь IPFS URLs в `mint.html`
4. **Протестируй** - проверь отображение
5. **Запушь** - на GitHub

---

## 📝 Быстрая проверка:

После исправления, выполни:
```powershell
Get-ChildItem -Path "nft-assets\nft-assets\generated" -Recurse -Filter "*.png" | Measure-Object | Select-Object Count
```

Должно быть: **25 файлов**

---

**Готово! Исправь файлы и продолжи!** 🚀






