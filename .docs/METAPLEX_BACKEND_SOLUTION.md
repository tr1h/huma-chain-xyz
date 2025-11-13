# 🔧 Metaplex Backend Solution

## Проблема

Metaplex JS SDK не работает через CDN, требует bundling.

## Решение: Backend API для On-Chain Mint

### Создать Node.js endpoint

```javascript
// api/mint-nft-onchain.js
const { Metaplex } = require('@metaplex-foundation/js');
const { Connection, Keypair } = require('@solana/web3.js');

async function mintOnChainNFT(req, res) {
    try {
        const { tier, rarity, multiplier, imageUrl, telegramId, walletAddress } = req.body;
        
        // Connect to Solana
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        
        // Load payer keypair (from environment)
        const payer = Keypair.fromSecretKey(
            Buffer.from(process.env.SOLANA_PAYER_KEYPAIR, 'base64')
        );
        
        // Initialize Metaplex
        const metaplex = Metaplex.make(connection)
            .use(keypairIdentity(payer));
        
        // Create metadata
        const metadata = {
            name: `Gotchi ${tier} ${rarity}`,
            symbol: 'GOTCHI',
            description: `Solana Tamagotchi ${tier} NFT with ${rarity} rarity. Earn ${multiplier}x TAMA boost!`,
            image: imageUrl,
            attributes: [
                { trait_type: 'Tier', value: tier },
                { trait_type: 'Rarity', value: rarity },
                { trait_type: 'Earning Boost', value: `${multiplier}x` }
            ]
        };
        
        // Upload metadata
        const { uri } = await metaplex.nfts().uploadMetadata(metadata);
        
        // Mint NFT
        const { nft } = await metaplex.nfts().create({
            uri: uri,
            name: metadata.name,
            sellerFeeBasisPoints: 500, // 5% royalty
            creators: [{
                address: payer.publicKey,
                share: 100
            }]
        });
        
        // Return mint address
        res.json({
            success: true,
            mintAddress: nft.address.toString(),
            explorerUrl: `https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
```

### Использовать в `mint.html`

```javascript
// После успешного API вызова (mint-nft-sol-rest.php)
if (result.success) {
    // Call on-chain mint API
    const onchainResponse = await fetch('https://api.solanatamagotchi.com/api/mint-nft-onchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tier: tierName,
            rarity: result.rarity,
            multiplier: result.earning_multiplier,
            imageUrl: getNFTImageUrl(tierName, result.rarity),
            telegramId: TELEGRAM_USER_ID,
            walletAddress: walletAddress
        })
    });
    
    const onchainResult = await onchainResponse.json();
    
    if (onchainResult.success) {
        // Update nft_mint_address in database
        await supabase
            .from('user_nfts')
            .update({ nft_mint_address: onchainResult.mintAddress })
            .eq('id', result.nft_id);
        
        console.log('✅ On-chain NFT minted:', onchainResult.mintAddress);
    }
}
```

---

## Альтернатива: Использовать готовый сервис

Можно использовать готовые сервисы для минта NFT:
- Helius API
- QuickNode NFT API
- Alchemy NFT API

Но это требует дополнительных затрат.

---

## Рекомендация

**Сейчас:**
- ✅ Оставить off-chain NFT (работает отлично)
- ✅ Фокус на геймплей и тестирование

**Перед Mainnet:**
- ✅ Создать backend API для on-chain минта
- ✅ Использовать Metaplex SDK на сервере (Node.js)
- ✅ Интегрировать в `mint.html`

