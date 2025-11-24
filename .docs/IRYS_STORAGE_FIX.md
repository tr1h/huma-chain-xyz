# 🔧 Исправление: Irys Storage (бывший Bundlr)

## ✅ Что исправлено:

1. **Добавлена поддержка `irysStorage`** - новый API (Bundlr был переименован в Irys)
2. **Сохранена поддержка `bundlrStorage`** - для обратной совместимости
3. **Автоматический выбор** - код использует доступный API

## 📋 Изменения:

### **api/update-nft-metadata.js:**
- Импорт: `irysStorage, bundlrStorage`
- Логика: сначала пробует `irysStorage`, потом `bundlrStorage`
- Адреса:
  - Irys: `https://devnet.irys.xyz` (devnet) / `https://node1.irys.xyz` (mainnet)
  - Bundlr: `https://devnet.bundlr.network` (devnet) / `https://node1.bundlr.network` (mainnet)

### **api/mint-nft-onchain.js:**
- Те же изменения для консистентности

## ⏳ Статус деплоя:

**Текущая ошибка:** Render.com еще не задеплоил новую версию
- Ошибка указывает на строку 81 старой версии
- Нужно подождать завершения деплоя (2-5 минут)

## 🔍 После деплоя:

В логах должны появиться:
```
🔧 Checking Irys (Bundlr) storage availability...
   irysStorage type: function
   bundlrStorage type: function
✅ Using Irys storage (newer API)
✅ Metaplex initialized with Irys storage (Arweave)
```

Или:
```
✅ Using Bundlr storage (legacy API)
✅ Metaplex initialized with Bundlr storage (Arweave)
```

## 🚨 Если все еще не работает:

1. **Проверить версию @metaplex-foundation/js:**
   ```bash
   npm list @metaplex-foundation/js
   ```

2. **Обновить пакет:**
   ```bash
   npm install @metaplex-foundation/js@latest
   ```

3. **Проверить баланс payer:**
   - Минимум 0.01 SOL для Arweave fees
   - В логах: `💰 Payer balance: 4.18 SOL ✅`

## 📝 Примечание:

Bundlr был переименован в Irys в 2024 году. Новые версии Metaplex используют `irysStorage` вместо `bundlrStorage`.

