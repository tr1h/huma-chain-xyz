/**
 * Metaplex NFT Minting Module
 * Creates real on-chain Solana NFTs using Metaplex SDK
 */

// Metaplex SDK (via CDN)
// Add to HTML: <script src="https://unpkg.com/@metaplex-foundation/js@latest/dist/index.umd.js"></script>

class MetaplexMinter {
    constructor(connection, wallet) {
        this.connection = connection;
        this.wallet = wallet;
        this.metaplex = null;
        this.initialized = false;
    }

    /**
     * Initialize Metaplex SDK
     */
    async init() {
        try {
            if (!window.Metaplex) {
                throw new Error('Metaplex SDK not loaded. Add script tag: <script src="https://unpkg.com/@metaplex-foundation/js@latest/dist/index.umd.js"></script>');
            }

            // Create Metaplex instance
            this.metaplex = window.Metaplex.make(this.connection)
                .use(window.Metaplex.walletAdapterIdentity(this.wallet));

            this.initialized = true;
            console.log('✅ Metaplex initialized');
            return true;
        } catch (error) {
            console.error('❌ Metaplex initialization failed:', error);
            throw error;
        }
    }

    /**
     * Upload metadata to Arweave/IPFS
     * @param {Object} metadata - NFT metadata object
     * @returns {Promise<string>} - Metadata URI
     */
    async uploadMetadata(metadata) {
        try {
            if (!this.initialized) {
                await this.init();
            }

            console.log('📤 Uploading metadata to Arweave...', metadata);

            // Upload metadata using Metaplex
            const { uri } = await this.metaplex.nfts().uploadMetadata({
                name: metadata.name,
                description: metadata.description,
                image: metadata.image,
                attributes: metadata.attributes || [],
                properties: metadata.properties || {}
            });

            console.log('✅ Metadata uploaded:', uri);
            return uri;
        } catch (error) {
            console.error('❌ Metadata upload failed:', error);
            throw new Error('Failed to upload metadata: ' + error.message);
        }
    }

    /**
     * Mint on-chain NFT
     * @param {Object} params - Minting parameters
     * @param {string} params.tier - Tier name (Bronze, Silver, Gold, Platinum, Diamond)
     * @param {string} params.rarity - Rarity (Common, Uncommon, Rare, Epic, Legendary)
     * @param {number} params.multiplier - Earning multiplier (2.0, 2.3, etc.)
     * @param {string} params.imageUrl - Image URL (IPFS/Arweave/CDN)
     * @param {string} params.telegramId - Telegram user ID
     * @param {string} params.creatorWallet - Creator wallet address (for royalties)
     * @returns {Promise<Object>} - NFT mint address and transaction signature
     */
    async mintNFT({
        tier,
        rarity,
        multiplier,
        imageUrl,
        telegramId,
        creatorWallet = null // Treasury wallet for royalties
    }) {
        try {
            if (!this.initialized) {
                await this.init();
            }

            if (!this.wallet || !this.wallet.publicKey) {
                throw new Error('Wallet not connected');
            }

            console.log(`💎 Minting ${tier} ${rarity} NFT...`);

            // 1. Create metadata
            const metadata = {
                name: `Gotchi ${tier} ${rarity}`,
                symbol: 'GOTCHI',
                description: `Solana Tamagotchi ${tier} NFT with ${rarity} rarity. Earn ${multiplier}x TAMA boost!`,
                image: imageUrl,
                attributes: [
                    { trait_type: 'Tier', value: tier },
                    { trait_type: 'Rarity', value: rarity },
                    { trait_type: 'Earning Boost', value: `${multiplier}x` },
                    { trait_type: 'Telegram ID', value: telegramId.toString() },
                    { trait_type: 'Collection', value: 'Solana Tamagotchi' }
                ],
                properties: {
                    files: [
                        {
                            uri: imageUrl,
                            type: 'image/png'
                        }
                    ],
                    category: 'image'
                }
            };

            // 2. Upload metadata
            const metadataUri = await this.uploadMetadata(metadata);

            // 3. Determine creator wallet (use provided or default to Treasury)
            const creatorAddress = creatorWallet 
                ? new window.solanaWeb3.PublicKey(creatorWallet)
                : new window.solanaWeb3.PublicKey('6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM'); // Treasury Main

            // 4. Mint NFT
            console.log('🎨 Creating NFT on-chain...');
            const { nft, response } = await this.metaplex.nfts().create({
                uri: metadataUri,
                name: metadata.name,
                sellerFeeBasisPoints: 500, // 5% royalty
                creators: [
                    {
                        address: creatorAddress,
                        share: 100
                    }
                ],
                updateAuthority: this.wallet.publicKey,
                mintAuthority: this.wallet.publicKey
            });

            const mintAddress = nft.address.toString();
            const signature = response.signature;

            console.log('✅ NFT minted successfully!');
            console.log('📍 Mint Address:', mintAddress);
            console.log('🔗 Transaction:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);

            return {
                success: true,
                mintAddress: mintAddress,
                signature: signature,
                explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
                nftUrl: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`
            };
        } catch (error) {
            console.error('❌ NFT minting failed:', error);
            throw new Error('Failed to mint NFT: ' + error.message);
        }
    }

    /**
     * Verify NFT exists on-chain
     * @param {string} mintAddress - NFT mint address
     * @returns {Promise<Object>} - NFT data
     */
    async verifyNFT(mintAddress) {
        try {
            if (!this.initialized) {
                await this.init();
            }

            const mintPublicKey = new window.solanaWeb3.PublicKey(mintAddress);
            const nft = await this.metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

            return {
                exists: true,
                name: nft.name,
                uri: nft.uri,
                address: nft.address.toString(),
                updateAuthority: nft.updateAuthorityAddress.toString()
            };
        } catch (error) {
            console.error('❌ NFT verification failed:', error);
            return { exists: false, error: error.message };
        }
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.MetaplexMinter = MetaplexMinter;
}

