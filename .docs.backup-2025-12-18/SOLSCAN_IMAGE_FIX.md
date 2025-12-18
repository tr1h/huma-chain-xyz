# 🖼️ Исправление проблемы с изображением NFT на Solscan

## ❌ Проблема:

NFT на Solscan не показывает изображение:
- URL: `https://solscan.io/token/CB7A4WF6dshXfJgZyui961idAbmfRQXtbEBqH7Dyg4f5?cluster=devnet`
- Изображение не отображается

## ✅ Решение:

### 1. **Проверить метаданные NFT:**

Изображение на Solscan берется из поля `image` в метаданных NFT, которые хранятся на Arweave.

**Текущий процесс:**
1. При минтинге NFT создается metadata JSON с полем `image: imageUrl`
2. Metadata загружается на Arweave через Metaplex
3. URI метаданных сохраняется в NFT на блокчейне
4. Solscan читает URI, загружает metadata, и показывает `image` поле

### 2. **Проверить IPFS Gateway:**

Если изображение на IPFS (Lighthouse Storage), нужно убедиться, что:
- ✅ IPFS gateway доступен: `https://gateway.lighthouse.storage/ipfs/...`
- ✅ Изображение действительно загружено на IPFS
- ✅ URL правильный и доступен

### 3. **Обновить метаданные NFT (если нужно):**

Если изображение не показывается, можно обновить метаданные через:
- API: `/api/update-nft-metadata`
- Скрипт: `tools/update-single-nft.ps1`

### 4. **Проверить на Solscan:**

1. Откройте NFT на Solscan
2. Проверьте вкладку "Metadata"
3. Найдите поле `image` - там должен быть IPFS URL
4. Проверьте, открывается ли этот URL в браузере

## 🔍 Диагностика:

### Проверить метаданные NFT:

```bash
# Используя Solana CLI
solana account <MINT_ADDRESS> --output json

# Или через Metaplex SDK
const nft = await metaplex.nfts().findByMint({ mintAddress });
console.log(nft.json.image); // Должен быть IPFS URL
```

### Проверить IPFS URL:

```bash
# Замените <IPFS_HASH> на hash из metadata
curl -I https://gateway.lighthouse.storage/ipfs/<IPFS_HASH>
```

## 💡 Возможные причины:

1. **IPFS Gateway недоступен** - попробовать другой gateway:
   - `https://ipfs.io/ipfs/...`
   - `https://cloudflare-ipfs.com/ipfs/...`
   - `https://gateway.pinata.cloud/ipfs/...`

2. **Метаданные не обновлены** - нужно обновить через API

3. **Неправильный формат URL** - должен быть полный URL, не только hash

4. **Arweave URI недоступен** - если metadata на Arweave, проверить доступность

## ✅ Что должно быть:

В metadata JSON:
```json
{
  "name": "Gotchi Bronze Common #123",
  "image": "https://gateway.lighthouse.storage/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i",
  "description": "...",
  ...
}
```

На Solscan:
- Вкладка "Metadata" → поле `image` → должен быть полный URL
- Изображение должно загружаться автоматически

## 🔧 Если изображение все еще не показывается:

1. **Проверить, что NFT MUTABLE:**
   - Если NFT immutable, метаданные нельзя обновить
   - Нужно проверить при минтинге

2. **Обновить метаданные:**
   ```bash
   # Используя update-nft-metadata API
   curl -X POST https://solanatamagotchi.com/api/update-nft-metadata-wrapper.php \
     -H "Content-Type: application/json" \
     -d '{
       "mintAddress": "CB7A4WF6dshXfJgZyui961idAbmfRQXtbEBqH7Dyg4f5",
       "tier": "Bronze",
       "rarity": "Common",
       "multiplier": 2.0,
       "design_number": 1
     }'
   ```

3. **Проверить через другой explorer:**
   - Solana Explorer: `https://explorer.solana.com/address/...?cluster=devnet`
   - XRAY: `https://xray.helius.xyz/token/...`

## 📝 Примечание:

Параметр `?cluster=devnet` в URL Solscan **НУЖЕН** для Devnet NFT! Без него Solscan будет искать на Mainnet и не найдет NFT.

Для Mainnet (когда перейдете):
- Убрать `?cluster=devnet`
- Или использовать `?cluster=mainnet-beta`


