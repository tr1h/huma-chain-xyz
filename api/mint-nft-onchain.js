/**
 * On-Chain NFT Minting via Metaplex SDK
 * Node.js backend endpoint for creating real Solana NFTs
 */

const { Metaplex, keypairIdentity, bundlrStorage } = require('@metaplex-foundation/js');
const { Connection, Keypair, clusterApiUrl, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zfrazyupameidxpjihrh.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';

// Solana connection
const SOLANA_NETWORK = process.env.SOLANA_NETWORK || 'devnet';
const connection = new Connection(
    SOLANA_NETWORK === 'mainnet' 
        ? clusterApiUrl('mainnet-beta') 
        : clusterApiUrl('devnet'),
    'confirmed'
);

/**
 * Initialize Metaplex with payer keypair
 */
function initMetaplex() {
    try {
        // Get payer keypair from environment
        const payerSecretKey = process.env.SOLANA_PAYER_KEYPAIR;
        
        if (!payerSecretKey) {
            throw new Error('SOLANA_PAYER_KEYPAIR environment variable not set');
        }

        // Decode base58 private key
        const secretKey = bs58.decode(payerSecretKey);
        const payer = Keypair.fromSecretKey(secretKey);

        console.log('✅ Payer loaded:', payer.publicKey.toString());

        // Check payer balance (need SOL for Arweave fees)
        const balance = await connection.getBalance(payer.publicKey);
        const balanceSOL = balance / 1e9;
        console.log(`💰 Payer balance: ${balanceSOL} SOL`);
        
        if (balanceSOL < 0.01) {
            throw new Error(`Insufficient SOL balance for Arweave upload. Payer needs at least 0.01 SOL, but has ${balanceSOL} SOL. Please fund the payer keypair.`);
        }

        // Initialize Metaplex with Bundlr storage for Arweave uploads
        let metaplex = Metaplex.make(connection).use(keypairIdentity(payer));
        
        // Try to use bundlrStorage if available
        try {
            if (typeof bundlrStorage === 'function') {
                metaplex = metaplex.use(bundlrStorage({
                    address: SOLANA_NETWORK === 'mainnet' 
                        ? 'https://node1.bundlr.network' 
                        : 'https://devnet.bundlr.network',
                    providerUrl: SOLANA_NETWORK === 'mainnet'
                        ? clusterApiUrl('mainnet-beta')
                        : clusterApiUrl('devnet'),
                    timeout: 60000,
                }));
                console.log('✅ Metaplex initialized with Bundlr storage');
            } else {
                console.warn('⚠️ bundlrStorage not available, using default storage');
                console.warn('⚠️ This may cause issues with Arweave uploads');
            }
        } catch (storageError) {
            console.warn('⚠️ Failed to initialize bundlrStorage:', storageError.message);
            console.warn('⚠️ Using default storage (may not work for Arweave)');
            // Continue with default storage
        }

        return metaplex;
    } catch (error) {
        console.error('❌ Failed to initialize Metaplex:', error);
        throw error;
    }
}

/**
 * Mint on-chain NFT
 */
async function mintOnChainNFT(req, res) {
    try {
        const { 
            nft_id,
            tier, 
            rarity, 
            multiplier, 
            imageUrl, 
            telegramId, 
            walletAddress,
            design_number 
        } = req.body;

        console.log('💎 Minting on-chain NFT:', {
            nft_id,
            tier,
            rarity,
            multiplier,
            telegramId,
            walletAddress
        });

        // Validate required fields
        if (!nft_id || !tier || !rarity || !imageUrl) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: nft_id, tier, rarity, imageUrl'
            });
        }

        // Initialize Metaplex
        const metaplex = initMetaplex();

        // Create metadata
        const metadata = {
            name: `Gotchi ${tier} ${rarity} #${design_number || Date.now()}`,
            symbol: 'GOTCHI',
            description: `Solana Tamagotchi ${tier} NFT with ${rarity} rarity. Earn ${multiplier}x TAMA boost! Play at solanatamagotchi.com`,
            image: imageUrl,
            external_url: 'https://solanatamagotchi.com',
            attributes: [
                { trait_type: 'Tier', value: tier },
                { trait_type: 'Rarity', value: rarity },
                { trait_type: 'Earning Boost', value: `${multiplier}x` },
                { trait_type: 'Design Number', value: design_number ? `#${design_number}` : 'N/A' },
                { trait_type: 'Telegram ID', value: telegramId ? telegramId.toString() : 'N/A' },
                { trait_type: 'Collection', value: 'Solana Tamagotchi' },
                { trait_type: 'Network', value: SOLANA_NETWORK }
            ],
            properties: {
                files: [{
                    uri: imageUrl,
                    type: 'image/png'
                }],
                category: 'image',
                creators: [{
                    address: '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM', // Treasury Main
                    share: 100
                }]
            }
        };

        console.log('📤 Uploading metadata to Arweave...');
        console.log('⏳ This may take 30-60 seconds...');

        // Upload metadata to Arweave
        let uri;
        try {
            const uploadResult = await metaplex.nfts().uploadMetadata(metadata);
            uri = uploadResult.uri;
            console.log('✅ Metadata uploaded:', uri);
        } catch (uploadError) {
            console.error('❌ Metadata upload failed:', uploadError);
            // If upload fails, try to continue with image URL as fallback
            if (uploadError.message && uploadError.message.includes('funding')) {
                throw new Error('Failed to upload metadata: Insufficient SOL for Arweave storage fees. Please fund the payer keypair with at least 0.01 SOL.');
            }
            throw new Error(`Failed to upload metadata: ${uploadError.message}`);
        }

        console.log('🎨 Creating NFT on-chain...');

        // Get creator wallet (Treasury Main)
        const creatorWallet = new PublicKey('6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM');
        
        // Mint NFT
        const { nft } = await metaplex.nfts().create({
            uri: uri,
            name: metadata.name,
            symbol: metadata.symbol,
            sellerFeeBasisPoints: 500, // 5% royalty
            creators: [{
                address: creatorWallet, // Treasury Main for royalties
                share: 100
            }],
            updateAuthority: metaplex.identity().publicKey,
            mintAuthority: metaplex.identity().publicKey
        });

        const mintAddress = nft.address.toString();
        const explorerUrl = `https://explorer.solana.com/address/${mintAddress}?cluster=${SOLANA_NETWORK}`;

        console.log('✅ NFT minted successfully!');
        console.log('📍 Mint Address:', mintAddress);
        console.log('🔗 Explorer:', explorerUrl);

        // Update nft_mint_address in Supabase
        console.log('💾 Updating NFT mint address in database...');
        
        const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts?id=eq.${nft_id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                nft_mint_address: mintAddress,
                metadata_uri: uri
            })
        });

        if (!updateResponse.ok) {
            console.warn('⚠️ Failed to update NFT mint address in database');
        } else {
            console.log('✅ NFT mint address updated in database');
        }

        // Return success
        res.json({
            success: true,
            mintAddress: mintAddress,
            metadataUri: uri,
            explorerUrl: explorerUrl,
            nftUrl: `https://explorer.solana.com/address/${mintAddress}?cluster=${SOLANA_NETWORK}`,
            message: `${tier} ${rarity} NFT minted successfully on-chain!`
        });

    } catch (error) {
        console.error('❌ On-chain mint failed:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to mint on-chain NFT',
            details: error.stack
        });
    }
}

/**
 * Health check endpoint
 */
function healthCheck(req, res) {
    res.json({
        success: true,
        message: 'On-chain NFT minting API is running',
        network: SOLANA_NETWORK,
        endpoint: connection.rpcEndpoint
    });
}

module.exports = {
    mintOnChainNFT,
    healthCheck,
    initMetaplex
};
