# 🖼️ Как обновить изображение NFT на Solscan

**Проблема:** NFT показывает placeholder вместо реального изображения.

**Решение:** Обновить метаданные NFT через Metaplex (если NFT MUTABLE).

---

## ✅ Быстрое решение:

### 1. **Проверь что NFT MUTABLE:**
- Открой NFT на Solscan
- Проверь что есть badge "Mutable"
- Если "Immutable" - нельзя обновить, нужно заминтить новый NFT

### 2. **Используй API для обновления:**

**Endpoint:** `POST /api/update-nft-metadata`

**Request:**
```json
{
  "mintAddress": "9o2mrMbLmdMSwNmKrB1XfyDRGX1QaUbRuHsNjHrsLSeQ",
  "tier": "Bronze",
  "rarity": "Common",
  "multiplier": 2.0,
  "design_number": 5
}
```

**Response:**
```json
{
  "success": true,
  "mintAddress": "9o2mrMbLmdMSwNmKrB1XfyDRGX1QaUbRuHsNjHrsLSeQ",
  "metadataUri": "https://arweave.net/...",
  "imageUrl": "https://gateway.lighthouse.storage/ipfs/...",
  "transactionSignature": "...",
  "explorerUrl": "https://explorer.solana.com/tx/...",
  "solscanUrl": "https://solscan.io/token/...",
  "message": "NFT metadata updated successfully! Image should now be visible on Solscan."
}
```

---

## 🔧 Как это работает:

1. **Получает существующий NFT** по mint address
2. **Создает новые метаданные** с правильным IPFS URL изображения
3. **Загружает метаданные на Arweave**
4. **Обновляет NFT** через Metaplex SDK
5. **Возвращает transaction signature**

---

## 📝 Использование:

### Вариант 1: Через API (PHP wrapper)
```bash
curl -X POST https://api.solanatamagotchi.com/api/update-nft-metadata-wrapper.php \
  -H "Content-Type: application/json" \
  -d '{
    "mintAddress": "9o2mrMbLmdMSwNmKrB1XfyDRGX1QaUbRuHsNjHrsLSeQ",
    "tier": "Bronze",
    "rarity": "Common",
    "multiplier": 2.0,
    "design_number": 5
  }'
```

### Вариант 2: Через Node.js напрямую
```bash
# Если Express server запущен на localhost:3001
curl -X POST http://localhost:3001/api/update-nft-metadata \
  -H "Content-Type: application/json" \
  -d '{
    "mintAddress": "9o2mrMbLmdMSwNmKrB1XfyDRGX1QaUbRuHsNjHrsLSeQ",
    "tier": "Bronze",
    "rarity": "Common"
  }'
```

---

## ⚠️ Важно:

1. **NFT должен быть MUTABLE** - проверь на Solscan
2. **Update Authority** должен быть правильным (обычно `8s88JVHG8Cb6HGK125rjnMA19MuW723M6pJRDW3maDVi`)
3. **Нужен SOL** для оплаты транзакции (обычно ~0.001 SOL)
4. **IPFS изображение должно быть доступно** - проверь URL в браузере

---

## 🔍 Проверка:

После обновления:
1. Подожди 1-2 минуты (Solscan кеширует метаданные)
2. Обнови страницу NFT на Solscan
3. Изображение должно появиться!

---

## 🚀 Для твоего NFT:

**Mint Address:** `9o2mrMbLmdMSwNmKrB1XfyDRGX1QaUbRuHsNjHrsLSeQ`
**Tier:** Bronze
**Rarity:** Common
**Status:** ✅ MUTABLE (можно обновить!)

**Команда:**
```bash
curl -X POST https://api.solanatamagotchi.com/api/update-nft-metadata-wrapper.php \
  -H "Content-Type: application/json" \
  -d '{
    "mintAddress": "9o2mrMbLmdMSwNmKrB1XfyDRGX1QaUbRuHsNjHrsLSeQ",
    "tier": "Bronze",
    "rarity": "Common",
    "multiplier": 2.0,
    "design_number": 5
  }'
```

---

**После обновления изображение появится на Solscan!** 🎉

