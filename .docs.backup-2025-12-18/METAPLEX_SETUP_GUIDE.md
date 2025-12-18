# 🔧 Metaplex SDK Setup Guide

## 📋 Overview

Пошаговая инструкция по настройке Metaplex SDK для создания настоящих on-chain NFT на Solana.

---

## ✅ Шаг 1: Подключить Metaplex SDK (Frontend)

### В `mint.html` добавить:

```html
<!-- После Solana Web3.js -->
<script src="https://cdn.jsdelivr.net/npm/@solana/web3.js@latest/lib/index.iife.min.js"></script>

<!-- Metaplex SDK -->
<script src="https://unpkg.com/@metaplex-foundation/js@latest/dist/index.umd.js"></script>

<!-- Metaplex Minter Module -->
<script src="js/metaplex-mint.js"></script>
```

---

## ✅ Шаг 2: Инициализация в коде

### В `mint.html` в секции `<script>`:

```javascript
// После подключения кошелька
let metaplexMinter = null;

async function initMetaplex() {
    try {
        if (!window.solana || !window.solana.isPhantom) {
            console.warn('⚠️ Phantom wallet not found');
            return;
        }

        const { Connection } = solanaWeb3;
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        
        // Get wallet adapter
        const wallet = {
            publicKey: new solanaWeb3.PublicKey(walletAddress),
            signTransaction: async (tx) => {
                return await window.solana.signTransaction(tx);
            },
            signAllTransactions: async (txs) => {
                return await window.solana.signAllTransactions(txs);
            }
        };

        metaplexMinter = new MetaplexMinter(connection, wallet);
        await metaplexMinter.init();
        
        console.log('✅ Metaplex initialized');
    } catch (error) {
        console.error('❌ Metaplex init failed:', error);
    }
}

// Вызвать после подключения кошелька
// await initMetaplex();
```

---

## ✅ Шаг 3: Обновить функцию минта

### В функции `mintSOL()` в `mint.html`:

```javascript
async function mintSOL(tier) {
    try {
        // ... существующий код для SOL payment ...
        
        // После успешной оплаты SOL
        // 1. Получить данные NFT из API ответа
        const apiResponse = await fetch('https://api.solanatamagotchi.com/api/mint-nft-sol-rest.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegram_id: TELEGRAM_USER_ID,
                wallet_address: walletAddress,
                tier_name: tier,
                price_sol: price
            })
        });

        const apiData = await apiResponse.json();
        
        if (!apiData.success) {
            throw new Error(apiData.error);
        }

        // 2. Получить URL изображения NFT
        const imageUrl = getNFTImageUrl(tier, apiData.rarity); // Функция для получения URL
        
        // 3. Минтнуть on-chain NFT через Metaplex
        if (metaplexMinter && metaplexMinter.initialized) {
            console.log('💎 Minting on-chain NFT...');
            
            const mintResult = await metaplexMinter.mintNFT({
                tier: tier,
                rarity: apiData.rarity,
                multiplier: apiData.earning_multiplier,
                imageUrl: imageUrl,
                telegramId: TELEGRAM_USER_ID,
                creatorWallet: '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM' // Treasury Main
            });

            // 4. Обновить nft_mint_address в базе данных
            await updateNFTMintAddress(apiData.nft_id, mintResult.mintAddress);

            console.log('✅ On-chain NFT minted:', mintResult.mintAddress);
            showNotification('success', 'NFT Minted!', `View on Explorer: ${mintResult.explorerUrl}`);
        } else {
            console.warn('⚠️ Metaplex not initialized, skipping on-chain mint');
            // Продолжить с off-chain NFT
        }

    } catch (error) {
        console.error('❌ Mint failed:', error);
        throw error;
    }
}

// Helper function to get NFT image URL
function getNFTImageUrl(tier, rarity) {
    // Замените на реальные URL после загрузки изображений
    const baseUrl = 'https://solanatamagotchi.com/nft-assets';
    return `${baseUrl}/${tier.toLowerCase()}/${rarity.toLowerCase()}.png`;
}

// Helper function to update NFT mint address in database
async function updateNFTMintAddress(nftId, mintAddress) {
    try {
        const { data, error } = await supabase
            .from('user_nfts')
            .update({ nft_mint_address: mintAddress })
            .eq('id', nftId);

        if (error) throw error;
        console.log('✅ NFT mint address updated in database');
    } catch (error) {
        console.error('❌ Failed to update mint address:', error);
    }
}
```

---

## ✅ Шаг 4: Backend API (опционально)

### Создать `api/mint-nft-onchain.php`:

```php
<?php
/**
 * Mint on-chain NFT via Metaplex (Backend)
 * This is optional - can be done on frontend
 */

require_once __DIR__ . '/config.php';

// This would require Node.js backend or PHP Solana SDK
// For now, minting is done on frontend via Metaplex JS SDK

header('Content-Type: application/json');
echo json_encode([
    'success' => false,
    'error' => 'On-chain minting is done on frontend via Metaplex JS SDK'
]);
?>
```

---

## ✅ Шаг 5: Загрузка изображений

### Вариант 1: IPFS (NFT.Storage - бесплатно)

```javascript
async function uploadToIPFS(imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch('https://api.nft.storage/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer YOUR_NFT_STORAGE_API_KEY`
        },
        body: formData
    });

    const data = await response.json();
    return `https://${data.value.cid}.ipfs.nftstorage.link`;
}
```

### Вариант 2: Arweave (через Metaplex)

```javascript
// Metaplex автоматически загружает на Arweave при вызове uploadMetadata()
// Ничего дополнительного не нужно!
```

### Вариант 3: CDN (простой вариант)

```javascript
// Просто используйте URL на вашем CDN
const imageUrl = 'https://solanatamagotchi.com/nft-assets/bronze/common.png';
```

---

## ✅ Шаг 6: Проверка NFT

### После минта проверить:

```javascript
// В консоли браузера или в коде
const verification = await metaplexMinter.verifyNFT(mintAddress);
console.log('NFT Verification:', verification);

// Открыть в Explorer
window.open(`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`);
```

---

## 🔧 Troubleshooting

### Ошибка: "Metaplex SDK not loaded"
- Проверьте, что скрипт Metaplex подключен в HTML
- Проверьте консоль браузера на ошибки загрузки

### Ошибка: "Wallet not connected"
- Убедитесь, что Phantom кошелек подключен
- Проверьте, что `walletAddress` установлен

### Ошибка: "Insufficient funds"
- Нужно ~0.01-0.02 SOL для минта NFT
- В Devnet можно получить из faucet

### Ошибка: "Metadata upload failed"
- Проверьте интернет соединение
- Убедитесь, что imageUrl доступен
- Попробуйте использовать Arweave через Metaplex

---

## 📊 Стоимость

**Devnet:**
- Mint NFT: ~0.01 SOL (бесплатно через faucet)
- Metadata storage: Бесплатно (Arweave devnet)

**Mainnet:**
- Mint NFT: ~0.01-0.02 SOL (~$1.50-3.00)
- Metadata storage: ~$0.01-0.05 (Arweave)

---

## 🚀 Следующие шаги

1. ✅ Подключить Metaplex SDK в `mint.html`
2. ✅ Инициализировать Metaplex после подключения кошелька
3. ✅ Обновить функцию `mintSOL()` для on-chain минта
4. ✅ Загрузить изображения NFT на IPFS/Arweave/CDN
5. ✅ Протестировать на Devnet
6. ✅ Готово к Mainnet!

---

## 📚 Полезные ссылки

- [Metaplex JS SDK Docs](https://docs.metaplex.com/js/)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [NFT.Storage](https://nft.storage/)
- [Arweave](https://www.arweave.org/)





