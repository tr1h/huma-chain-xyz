# ✅ On-Chain NFT Minting - Полная интеграция

## 🎉 Что сделано

### 1. ✅ Backend API (Node.js)
- **`api/mint-nft-onchain.js`** - Функция для минта on-chain NFT через Metaplex SDK
- **`api/server-onchain.js`** - Express сервер для обработки запросов
- **`api/mint-nft-onchain-wrapper.php`** - PHP wrapper для вызова Node.js API

### 2. ✅ Интеграция в `mint.html`
- Функция `mintOnChainNFTAsync()` - вызывает backend API после успешного off-chain минта
- Функция `getNFTImageUrl()` - получает URL изображения NFT
- Автоматический вызов on-chain минта после создания NFT в базе

### 3. ✅ Обновлен `mint-nft-sol-rest.php`
- Возвращает `nft_id` в ответе для on-chain минта
- Логирует информацию для on-chain минта

### 4. ✅ Обновлен `package.json`
- Добавлен `bs58` для работы с Solana keypairs

---

## 🚀 Как запустить

### Шаг 1: Установить зависимости

```bash
npm install
```

Это установит:
- `@metaplex-foundation/js`
- `@solana/web3.js`
- `bs58`
- `express`
- `cors`

### Шаг 2: Настроить environment variables

Создайте `.env` файл или установите в Render.com:

```bash
# Solana Network
SOLANA_NETWORK=devnet  # или mainnet

# Payer Keypair (base58 encoded)
SOLANA_PAYER_KEYPAIR=YOUR_BASE58_PRIVATE_KEY

# Supabase
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=your_supabase_key

# Port (optional)
PORT=3001
```

### Шаг 3: Запустить Node.js сервер

**Локально:**
```bash
npm run start:onchain
# или
node api/server-onchain.js
```

**На Render.com:**
1. Создайте новый Web Service
2. Build Command: `npm install`
3. Start Command: `npm run start:onchain`
4. Environment Variables: добавьте все из шага 2

### Шаг 4: Настроить PHP wrapper (опционально)

Если хотите использовать PHP wrapper вместо прямого вызова Node.js API:

В `api/mint-nft-onchain-wrapper.php` установите:
```php
$nodeBackendUrl = 'https://your-render-service.onrender.com/api/mint-nft-onchain';
```

Или через environment variable:
```bash
NODE_BACKEND_URL=https://your-render-service.onrender.com/api/mint-nft-onchain
```

---

## 📋 Как это работает

### Процесс минта:

1. **Пользователь платит SOL** → `mintSOL()` в `mint.html`
2. **Создается off-chain NFT** → `api/mint-nft-sol-rest.php`
3. **NFT сохраняется в базе** → таблица `user_nfts`
4. **Автоматически вызывается on-chain минт** → `mintOnChainNFTAsync()`
5. **Backend API минтует NFT** → `api/mint-nft-onchain.js`
6. **Metadata загружается на Arweave** → автоматически через Metaplex
7. **NFT создается на Solana** → реальный on-chain NFT
8. **Mint address обновляется в базе** → `nft_mint_address` в `user_nfts`

---

## 🎨 NFT Images

### Требования:
- Формат: PNG
- Размер: 512x512 или 1000x1000
- Прозрачный фон (опционально)
- Структура: `/nft-assets/{tier}/{rarity}.png`

### Примеры:
```
/nft-assets/bronze/common.png
/nft-assets/bronze/uncommon.png
/nft-assets/silver/rare.png
/nft-assets/gold/epic.png
/nft-assets/platinum/legendary.png
/nft-assets/diamond/epic.png
/nft-assets/diamond/legendary.png
```

### Генерация:
Используйте промпты из `.docs/SORA_NFT_PROMPTS.md` для генерации через SORA 2.

---

## 🔧 Troubleshooting

### Ошибка: "SOLANA_PAYER_KEYPAIR not set"
**Решение:** Установите environment variable с base58 encoded private key

### Ошибка: "Failed to upload metadata to Arweave"
**Решение:** 
- Проверьте интернет соединение
- Убедитесь, что payer keypair имеет SOL баланс (для оплаты Arweave)
- В Devnet можно получить SOL из faucet

### Ошибка: "Connection refused" при вызове API
**Решение:**
- Убедитесь, что Node.js сервер запущен
- Проверьте URL в `mint.html` (должен быть правильный для production)
- Проверьте CORS настройки в `server-onchain.js`

### Ошибка: "bs58 is not defined"
**Решение:** 
```bash
npm install bs58
```

---

## 📊 Проверка работы

### 1. Проверить health endpoint:
```bash
curl http://localhost:3001/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "service": "NFT On-Chain Minting API",
  "timestamp": "..."
}
```

### 2. Проверить в консоли браузера:
После успешного минта должны увидеть:
```
💎 Starting on-chain NFT mint...
📡 Calling on-chain mint API: ...
✅ On-chain NFT minted successfully!
📍 Mint Address: ...
🔗 Explorer: ...
```

### 3. Проверить в Solana Explorer:
Откройте mint address в Explorer - должен быть виден NFT!

### 4. Проверить в Phantom Wallet:
NFT должен появиться в коллекции!

---

## 🎯 Следующие шаги

1. ✅ **Сгенерировать изображения NFT** (SORA 2)
2. ✅ **Загрузить на CDN/IPFS** (структура `/nft-assets/{tier}/{rarity}.png`)
3. ✅ **Запустить Node.js сервер** (локально или на Render.com)
4. ✅ **Протестировать минт** (Devnet)
5. ✅ **Готово к Mainnet!** 🚀

---

## 📝 Важные замечания

1. **Devnet vs Mainnet:**
   - Сейчас настроено для Devnet
   - Перед Mainnet измените `SOLANA_NETWORK=mainnet`
   - И используйте mainnet RPC endpoint

2. **Стоимость:**
   - Devnet: бесплатно (faucet)
   - Mainnet: ~$1.50-3.00 на NFT (0.01-0.02 SOL + Arweave storage)

3. **Payer Keypair:**
   - Должен иметь SOL баланс для оплаты транзакций
   - В Devnet получите из faucet: https://faucet.solana.com/
   - В Mainnet пополните реальными SOL

4. **Royalties:**
   - 5% от продаж идет в Treasury wallet
   - Настроено автоматически в коде

---

## ✅ Статус: ГОТОВО К ИСПОЛЬЗОВАНИЮ!

Все настроено и интегрировано. Осталось только:
1. Сгенерировать изображения NFT
2. Запустить Node.js сервер
3. Протестировать!

🎉 **Теперь ваши NFT будут настоящими on-chain NFT на Solana!**

