# 🚀 Next Steps: On-Chain NFT Minting

## ✅ Что уже сделано

1. ✅ **Зависимости установлены** (`npm install`)
2. ✅ **.env файл создан** (с payer keypair из `payer-keypair.json`)
3. ✅ **Backend API готов** (`api/mint-nft-onchain.js`)
4. ✅ **Frontend интегрирован** (`mint.html`)
5. ✅ **Все файлы на месте**

---

## 🎯 Следующие шаги

### Шаг 1: Получить SOL для Payer Keypair

**Важно:** Payer keypair нужен для оплаты транзакций (Arweave storage, Solana fees).

1. **Получить Public Key:**
   ```bash
   node -e "const {Keypair}=require('@solana/web3.js'); const bs58=require('bs58'); const fs=require('fs'); const kp=JSON.parse(fs.readFileSync('payer-keypair.json')); const secretKey=Uint8Array.from(kp); const payer=Keypair.fromSecretKey(secretKey); console.log('Public Key:', payer.publicKey.toString());"
   ```

2. **Получить SOL из faucet:**
   - Перейдите: https://faucet.solana.com/
   - Вставьте Public Key
   - Получите SOL (бесплатно для Devnet)
   - Нужно минимум **0.1 SOL** для тестирования

---

### Шаг 2: Запустить Node.js сервер

**Локально:**
```bash
npm run start:onchain
```

Должно появиться:
```
🚀 NFT On-Chain Minting API running on port 3001
📡 Endpoint: http://localhost:3001/api/mint-nft-onchain
```

**На Render.com:**
1. Создайте новый **Web Service**
2. **Build Command:** `npm install`
3. **Start Command:** `npm run start:onchain`
4. Добавьте Environment Variables из `.env` файла
5. Deploy!

---

### Шаг 3: Проверить работу

**Health check:**
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

---

### Шаг 4: Протестировать минт

1. Откройте: `https://solanatamagotchi.com/mint.html`
2. Подключите Phantom кошелек (Devnet)
3. Попробуйте заминтить NFT (например, Platinum)
4. После успешного off-chain минта автоматически вызовется on-chain минт
5. Проверьте консоль браузера (F12) - должны увидеть:
   ```
   💎 Starting on-chain NFT mint...
   📡 Calling on-chain mint API: ...
   ✅ On-chain NFT minted successfully!
   ```

---

## 🎨 NFT Images (опционально)

**Пока изображений нет:**
- Используется placeholder: `https://via.placeholder.com/512`
- NFT все равно будет заминчен на-chain!

**Когда изображения готовы:**
1. Загрузите на CDN/IPFS
2. Структура: `/nft-assets/{tier}/{rarity}.png`
3. Обновите `NFT_IMAGE_BASE_URL` в `.env` (если нужно)

---

## 🔧 Troubleshooting

### Ошибка: "SOLANA_PAYER_KEYPAIR not set"
**Решение:** Проверьте `.env` файл, убедитесь что `SOLANA_PAYER_KEYPAIR` установлен

### Ошибка: "Insufficient funds"
**Решение:** Получите SOL из faucet: https://faucet.solana.com/

### Ошибка: "Connection refused"
**Решение:** 
- Убедитесь, что сервер запущен (`npm run start:onchain`)
- Проверьте порт (3001 по умолчанию)

### Ошибка: "Failed to upload metadata"
**Решение:**
- Проверьте SOL баланс payer keypair
- Проверьте интернет соединение
- В Devnet получите SOL из faucet

---

## 📊 Проверка Public Key

Чтобы узнать Public Key вашего payer keypair:

```bash
node -e "const {Keypair}=require('@solana/web3.js'); const bs58=require('bs58'); const fs=require('fs'); const kp=JSON.parse(fs.readFileSync('payer-keypair.json')); const secretKey=Uint8Array.from(kp); const payer=Keypair.fromSecretKey(secretKey); console.log('Public Key:', payer.publicKey.toString());"
```

Используйте этот Public Key для получения SOL из faucet.

---

## ✅ Готово к запуску!

Все настроено. Осталось только:
1. ✅ Получить SOL для payer keypair (faucet)
2. ✅ Запустить сервер (`npm run start:onchain`)
3. ✅ Протестировать минт на `mint.html`

🎉 **После этого ваши NFT будут настоящими on-chain NFT на Solana!**

