/**
 * Mint On-Chain NFT using Metaplex SDK
 * Node.js endpoint for creating real Solana NFTs
 */

const { Metaplex, keypairIdentity, bundlrStorage } = require('@metaplex-foundation/js');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const fetch = require('node-fetch');

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zfrazyupameidxpjihrh.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const TREASURY_WALLET = process.env.TREASURY_WALLET || '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM';

/**
 * Initialize Metaplex instance
 */
function initMetaplex() {
    try {
        // Load payer keypair from environment
        const payerKeypairString = process.env.SOLANA_PAYER_KEYPAIR;
        if (!payerKeypairString) {
            throw new Error('SOLANA_PAYER_KEYPAIR environment variable not set');
        }

        // Parse keypair (expects array of numbers)
        const payerKeypairArray = JSON.parse(payerKeypairString);
        const payer = Keypair.fromSecretKey(Uint8Array.from(payerKeypairArray));

        console.log('🔑 Payer wallet:', payer.publicKey.toString());

        // Create connection
        const connection = new Connection(RPC_URL, 'confirmed');

        // Initialize Metaplex
        const metaplex = Metaplex.make(connection)
            .use(keypairIdentity(payer))
            .use(bundlrStorage());

        console.log('✅ Metaplex initialized');

        return { metaplex, payer, connection };
    } catch (error) {
        console.error('❌ Metaplex initialization failed:', error);
        throw error;
    }
}

/**
 * Get NFT image URL based on tier and rarity
 */
function getNFTImageUrl(tier, rarity) {
    // TODO: Replace with real image URLs after uploading to IPFS/Arweave
    const baseUrl = 'https://solanatamagotchi.com/nft-assets';
    return `${baseUrl}/${tier.toLowerCase()}/${rarity.toLowerCase()}.png`;
}

/**
 * Mint on-chain NFT
 */
async function mintOnChainNFT(req, res) {
    try {
        console.log('💎 Starting on-chain NFT mint...');
        
        const {
            nft_id,           // ID from user_nfts table (to update later)
            tier,             // Bronze, Silver, Gold, Platinum, Diamond
            rarity,           // Common, Uncommon, Rare, Epic, Legendary
            multiplier,       // 2.0, 2.3, 2.7, 3.5, 5.0
            telegram_id,      // User's Telegram ID
            wallet_address    // User's Solana wallet
        } = req.body;

        // Validate input
        if (!tier || !rarity || !multiplier || !wallet_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: tier, rarity, multiplier, wallet_address'
            });
        }

        console.log(`📋 Request: Tier=${tier}, Rarity=${rarity}, Multiplier=${multiplier}x, Wallet=${wallet_address.substring(0, 8)}...`);

        // Initialize Metaplex
        const { metaplex, payer } = initMetaplex();

        // Get image URL
        const imageUrl = getNFTImageUrl(tier, rarity);
        console.log('🖼️  Image URL:', imageUrl);

        // Create metadata
        const metadata = {
            name: `Gotchi ${tier} ${rarity}`,
            symbol: 'GOTCHI',
            description: `Solana Tamagotchi ${tier} NFT with ${rarity} rarity. Earn ${multiplier}x TAMA boost! Play at solanatamagotchi.com`,
            image: imageUrl,
            external_url: 'https://solanatamagotchi.com',
            attributes: [
                { trait_type: 'Tier', value: tier },
                { trait_type: 'Rarity', value: rarity },
                { trait_type: 'Earning Boost', value: `${multiplier}x` },
                { trait_type: 'Collection', value: 'Solana Tamagotchi' },
                { trait_type: 'Telegram ID', value: telegram_id ? telegram_id.toString() : 'N/A' }
            ],
            properties: {
                files: [
                    {
                        uri: imageUrl,
                        type: 'image/png'
                    }
                ],
                category: 'image',
                creators: [
                    {
                        address: TREASURY_WALLET,
                        share: 100
                    }
                ]
            }
        };

        console.log('📤 Uploading metadata to Arweave...');

        // Upload metadata to Arweave via Metaplex
        const { uri: metadataUri } = await metaplex.nfts().uploadMetadata(metadata);
        console.log('✅ Metadata uploaded:', metadataUri);

        // Mint NFT
        console.log('🎨 Minting NFT on-chain...');
        const { nft, response } = await metaplex.nfts().create({
            uri: metadataUri,
            name: metadata.name,
            sellerFeeBasisPoints: 500, // 5% royalty
            creators: [
                {
                    address: new PublicKey(TREASURY_WALLET),
                    share: 100
                }
            ],
            updateAuthority: payer, // Can update metadata later
            mintAuthority: payer,   // Payer mints the NFT
            tokenOwner: new PublicKey(wallet_address) // NFT goes to user's wallet
        });

        const mintAddress = nft.address.toString();
        const signature = response.signature;

        console.log('✅ NFT minted successfully!');
        console.log('📍 Mint Address:', mintAddress);
        console.log('🔗 Transaction:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);

        // Update nft_mint_address in Supabase (if nft_id provided)
        if (nft_id) {
            console.log('💾 Updating nft_mint_address in database...');
            try {
                const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts?id=eq.${nft_id}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        nft_mint_address: mintAddress
                    })
                });

                if (supabaseResponse.ok) {
                    console.log('✅ Database updated with real mint address');
                } else {
                    console.warn('⚠️  Failed to update database:', await supabaseResponse.text());
                }
            } catch (dbError) {
                console.error('❌ Database update error:', dbError);
                // Don't fail the mint if DB update fails
            }
        }

        // Return success
        res.json({
            success: true,
            mintAddress: mintAddress,
            metadataUri: metadataUri,
            signature: signature,
            explorerUrl: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
            transactionUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
        });

    } catch (error) {
        console.error('❌ On-chain mint failed:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to mint on-chain NFT'
        });
    }
}

module.exports = { mintOnChainNFT };

