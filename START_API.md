# 🚀 Запуск TAMA API и NFT Системы

## 📋 Быстрый старт:

### 1️⃣ Запустить TAMA API сервер:
```bash
cd C:\goooog
node api/tama_supabase_api.js
```

### 2️⃣ Проверить что API работает:
Открой в браузере: `http://localhost:8002/api/tama/test`

### 3️⃣ Тестировать NFT API:
Открой: `test_nft_api.html` в браузере

## 🎨 NFT Endpoints:

- **`GET /api/tama/nft-costs`** - Получить стоимость NFT
- **`POST /api/tama/mint-nft`** - Минт NFT за TAMA
- **`GET /api/tama/nfts`** - Получить NFT пользователя

## 💰 Стоимость NFT:

- **⚪ Common:** 1,000 TAMA
- **🔵 Rare:** 5,000 TAMA
- **🟣 Epic:** 10,000 TAMA  
- **🟡 Legendary:** 50,000 TAMA

## ⚠️ Важно:

1. Сначала создай таблицу `user_nfts` в Supabase:
   - Выполни SQL из `create_user_nfts_table.sql`
   - В Supabase SQL Editor

2. Затем запускай API сервер

3. Тестируй через `test_nft_api.html`

## 🎯 Готово! NFT система работает!




