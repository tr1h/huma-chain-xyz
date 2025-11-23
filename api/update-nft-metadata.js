/**
 * Update NFT Metadata (for MUTABLE NFTs)
 * Updates image URI and other metadata for existing NFTs
 */

const { Metaplex, keypairIdentity, bundlrStorage, mockStorage } = require('@metaplex-foundation/js');
const { Connection, Keypair, clusterApiUrl, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58');

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
async function initMetaplex() {
    try {
        const payerSecretKey = process.env.SOLANA_PAYER_KEYPAIR;
        
        if (!payerSecretKey) {
            throw new Error('SOLANA_PAYER_KEYPAIR environment variable not set');
        }

        const secretKey = bs58.decode(payerSecretKey);
        const payer = Keypair.fromSecretKey(secretKey);

        console.log('✅ Payer loaded:', payer.publicKey.toString());

        const balance = await connection.getBalance(payer.publicKey);
        const balanceSOL = balance / 1e9;
        console.log(`💰 Payer balance: ${balanceSOL} SOL`);
        
        if (balanceSOL < 0.01) {
            throw new Error(`Insufficient SOL balance. Need at least 0.01 SOL, but has ${balanceSOL} SOL.`);
        }

        let metaplex = Metaplex.make(connection).use(keypairIdentity(payer));
        
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
                metaplex = metaplex.use(mockStorage());
                console.log('✅ Metaplex initialized with Mock storage');
            }
        } catch (storageError) {
            console.warn('⚠️ Failed to initialize bundlrStorage, using mock storage');
            metaplex = metaplex.use(mockStorage());
        }

        return metaplex;
    } catch (error) {
        console.error('❌ Failed to initialize Metaplex:', error);
        throw error;
    }
}

/**
 * Get NFT image URL based on tier and rarity
 */
function getNFTImageUrl(tier, rarity) {
    const NFT_IMAGES = {
        bronze: {
            common: 'https://gateway.lighthouse.storage/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i',
            uncommon: 'https://gateway.lighthouse.storage/ipfs/bafkreibnoiown4k6dyhxvv642ep6av6xwkgtqvusrhhn7l4janrgfjixbq',
            rare: 'https://gateway.lighthouse.storage/ipfs/bafkreia7mldvzaw52wvz42od4xdj7asw2fqc7gba7zhdbpfg3d6z3byl5y',
            epic: 'https://gateway.lighthouse.storage/ipfs/bafkreiefw2xgoo5w37jkpd6etgr6eurgu7z64tsb7e6bhbbqa5z3qidbbq',
            legendary: 'https://gateway.lighthouse.storage/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i' // TODO: Upload real Legendary image
        },
        silver: {
            common: 'https://gateway.lighthouse.storage/ipfs/bafkreibp7zxf6fqilehacookucnyhzbqkvaqqbuk3jel7irsa2dzzvnw2a', // Use Uncommon as fallback
            uncommon: 'https://gateway.lighthouse.storage/ipfs/bafkreibp7zxf6fqilehacookucnyhzbqkvaqqbuk3jel7irsa2dzzvnw2a',
            rare: 'https://gateway.lighthouse.storage/ipfs/bafkreidnwtfwftmcsexgmf6p5qn5jorgwmtl4w2jegyyo7gnynvq2qe334',
            epic: 'https://gateway.lighthouse.storage/ipfs/bafkreifkxigyyudtynmn4ffmt2gx7getqs3jfzy2nqdjrzaplpelf3tozq',
            legendary: 'https://gateway.lighthouse.storage/ipfs/bafkreigywjdjw3vxopv4blicqioyx5fyqpwcvs22s2ea377rofvh2sslnm'
        },
        gold: {
            common: 'https://gateway.lighthouse.storage/ipfs/bafkreicywzvyse3immuhakmd4dvv22gxsikmzhn4q7cjkmzjpp7253ftse',
            uncommon: 'https://gateway.lighthouse.storage/ipfs/bafkreibp7zxf6fqilehacookucnyhzbqkvaqqbuk3jel7irsa2dzzvnw2a',
            rare: 'https://gateway.lighthouse.storage/ipfs/bafkreidnwtfwftmcsexgmf6p5qn5jorgwmtl4w2jegyyo7gnynvq2qe334',
            epic: 'https://gateway.lighthouse.storage/ipfs/bafkreifkxigyyudtynmn4ffmt2gx7getqs3jfzy2nqdjrzaplpelf3tozq'
        },
        platinum: {
            common: 'https://gateway.lighthouse.storage/ipfs/bafkreib72mfqqs5qa3g7asjy4jtoiorxpok3bniknisqznf572haifakcq', // Use Rare as fallback
            rare: 'https://gateway.lighthouse.storage/ipfs/bafkreib72mfqqs5qa3g7asjy4jtoiorxpok3bniknisqznf572haifakcq',
            epic: 'https://gateway.lighthouse.storage/ipfs/bafkreiell36dnbe5oomfigv6yxk65rkbj2eo62t6ihrprbyqbomjraobo4',
            legendary: 'https://gateway.lighthouse.storage/ipfs/bafkreihrwin3ld34uner7rpwggke2pfnn5beb3eyrw7vrjmw6n5hen5hie'
        },
        diamond: {
            rare: 'https://gateway.lighthouse.storage/ipfs/bafkreigflr4x4xczfyl7gavdmaos7uupi73xm2yainwl2tlfn3nabqpsly',
            epic: 'https://gateway.lighthouse.storage/ipfs/bafkreib3la6mkyzjtethphozhsuccp6b4x63dilrz6rsb4tsjvqdxdl5pq', // Use this for Epic
            legendary: 'https://gateway.lighthouse.storage/ipfs/bafkreidtqr62aeflchsghhdoo4m7tv33j7za5w3ttzqziwkl4u4cmgz7tq'
        }
    };
    
    const tierLower = tier.toLowerCase();
    const rarityLower = rarity.toLowerCase();
    
    // Try exact match first
    let imageUrl = NFT_IMAGES[tierLower]?.[rarityLower];
    
    // If not found, use fallback based on tier
    if (!imageUrl) {
        if (tierLower === 'silver' && rarityLower === 'common') {
            // Silver Common -> use Uncommon
            imageUrl = NFT_IMAGES.silver.uncommon;
        } else if (tierLower === 'platinum' && rarityLower === 'common') {
            // Platinum Common -> use Rare
            imageUrl = NFT_IMAGES.platinum.rare;
        } else if (tierLower === 'diamond' && rarityLower === 'epic') {
            // Diamond Epic -> use Epic image
            imageUrl = NFT_IMAGES.diamond.epic;
        } else {
            // Last resort: use first available image for tier
            const tierImages = NFT_IMAGES[tierLower];
            if (tierImages) {
                imageUrl = Object.values(tierImages)[0];
            }
        }
    }
    
    return imageUrl || null;
}

/**
 * Update NFT metadata
 */
async function updateNFTMetadata(req, res) {
    try {
        const { 
            mintAddress,
            tier,
            rarity,
            multiplier,
            design_number
        } = req.body;

        console.log('🔄 Updating NFT metadata:', {
            mintAddress,
            tier,
            rarity
        });

        if (!mintAddress) {
            return res.status(400).json({
                success: false,
                error: 'mintAddress is required'
            });
        }

        // Get image URL
        const imageUrl = getNFTImageUrl(tier || 'Bronze', rarity || 'Common');
        
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                error: `No image URL found for tier: ${tier}, rarity: ${rarity}`
            });
        }

        // Initialize Metaplex
        const metaplex = await initMetaplex();

        // Get existing NFT
        const mintPublicKey = new PublicKey(mintAddress);
        const existingNFT = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

        console.log('📋 Current NFT:', {
            name: existingNFT.name,
            uri: existingNFT.uri,
            updateAuthority: existingNFT.updateAuthorityAddress.toString()
        });

        // Create new metadata
        const metadata = {
            name: `Gotchi ${tier || 'Bronze'} ${rarity || 'Common'} #${design_number || existingNFT.name.match(/#(\d+)/)?.[1] || 'N/A'}`,
            symbol: 'GOTCHI',
            description: `Solana Tamagotchi ${tier || 'Bronze'} NFT with ${rarity || 'Common'} rarity. Earn ${multiplier || 2.0}x TAMA boost! Play at solanatamagotchi.com`,
            image: imageUrl,
            external_url: 'https://solanatamagotchi.com',
            attributes: [
                { trait_type: 'Tier', value: tier || 'Bronze' },
                { trait_type: 'Rarity', value: rarity || 'Common' },
                { trait_type: 'Earning Boost', value: `${multiplier || 2.0}x` },
                { trait_type: 'Design Number', value: design_number ? `#${design_number}` : 'N/A' },
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

        console.log('📤 Uploading new metadata to Arweave...');
        console.log('⏳ This may take 30-60 seconds...');

        // Upload new metadata
        let newUri;
        try {
            const uploadResult = await metaplex.nfts().uploadMetadata(metadata);
            newUri = uploadResult.uri;
            console.log('✅ New metadata uploaded:', newUri);
        } catch (uploadError) {
            console.error('❌ Metadata upload failed:', uploadError);
            throw new Error(`Failed to upload metadata: ${uploadError.message}`);
        }

        console.log('🔄 Updating NFT metadata on-chain...');

        // Update NFT metadata
        const { response } = await metaplex.nfts().update({
            nftOrSft: existingNFT,
            uri: newUri,
            name: metadata.name
        });

        const explorerUrl = `https://explorer.solana.com/tx/${response.signature}?cluster=${SOLANA_NETWORK}`;
        const solscanUrl = `https://solscan.io/token/${mintAddress}?cluster=${SOLANA_NETWORK}`;

        console.log('✅ NFT metadata updated successfully!');
        console.log('📍 Mint Address:', mintAddress);
        console.log('🔗 Transaction:', explorerUrl);
        console.log('🖼️ New Image URL:', imageUrl);

        res.json({
            success: true,
            mintAddress: mintAddress,
            metadataUri: newUri,
            imageUrl: imageUrl,
            transactionSignature: response.signature,
            explorerUrl: explorerUrl,
            solscanUrl: solscanUrl,
            message: `NFT metadata updated successfully! Image should now be visible on Solscan.`
        });

    } catch (error) {
        console.error('❌ Update metadata failed:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update NFT metadata',
            details: error.stack
        });
    }
}

module.exports = {
    updateNFTMetadata,
    initMetaplex
};

