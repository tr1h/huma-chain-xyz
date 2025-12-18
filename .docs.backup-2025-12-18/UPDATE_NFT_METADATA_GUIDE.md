# 🔄 Как обновить метаданные NFT

## ⚠️ Проблема:
Сервер на `localhost:3001` не запущен. Нужно либо запустить локально, либо использовать Render.com API.

---

## ✅ Вариант 1: Запустить Node.js сервер локально

### Шаг 1: Установить зависимости
```bash
npm install
```

### Шаг 2: Настроить environment variables
Создай `.env` файл:
```env
SOLANA_NETWORK=devnet
SOLANA_PAYER_KEYPAIR=YOUR_BASE58_PRIVATE_KEY
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=your_supabase_key
PORT=3001
```

### Шаг 3: Запустить сервер
```bash
node api/server-onchain.js
```

### Шаг 4: Выполнить запрос
```powershell
$body = @{
    mintAddress = "9o2mrMbLmdMSwNmKrB1XfyDRGX1QaUbRuHsNjHrsLSeQ"
    tier = "Bronze"
    rarity = "Common"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/update-nft-metadata" -Method Post -Body $body -ContentType "application/json"
```

---

## ✅ Вариант 2: Использовать Render.com API

### Обновить PHP wrapper чтобы использовать Render.com URL:

В `api/update-nft-metadata-wrapper.php` измени:
```php
// Было:
$apiUrl = 'http://localhost:3001/api/update-nft-metadata';

// Стало:
$apiUrl = getenv('ONCHAIN_API_URL') ?: 'https://your-render-service.onrender.com/api/update-nft-metadata';
```

### Затем выполни:
```powershell
$body = @{
    mintAddress = "9o2mrMbLmdMSwNmKrB1XfyDRGX1QaUbRuHsNjHrsLSeQ"
    tier = "Bronze"
    rarity = "Common"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.solanatamagotchi.com/api/update-nft-metadata-wrapper.php" -Method Post -Body $body -ContentType "application/json"
```

---

## ✅ Вариант 3: Добавить endpoint в существующий Render.com сервис

Если у тебя уже есть Node.js сервис на Render.com для `mint-nft-onchain`, просто добавь туда endpoint для `update-nft-metadata`.

---

## 📝 Что нужно сделать:

1. **Запустить Node.js сервер** (локально или на Render.com)
2. **Убедиться что endpoint доступен:** `/api/update-nft-metadata`
3. **Выполнить запрос** с правильными параметрами

---

## 🔍 Проверка:

После обновления:
1. Подожди 1-2 минуты
2. Обнови страницу NFT на Solscan
3. Изображение должно появиться!

---

**Какой вариант выбираешь?** Могу помочь настроить любой из них.

