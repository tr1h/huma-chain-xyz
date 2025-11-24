/**
 * Get NFT Metadata from Blockchain
 * Fetches NFT metadata using Metaplex and returns image URI
 */

const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
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

let metaplex = null;

/**
 * Initialize Metaplex (lightweight, no storage needed for reading)
 */
function initMetaplex() {
    if (metaplex) {
        return metaplex;
    }
    
    try {
        // For reading metadata, we don't need a payer keypair
        // But Metaplex requires an identity, so we'll use a dummy one
        const payerSecretKey = process.env.SOLANA_PAYER_KEYPAIR;
        
        if (payerSecretKey) {
            const secretKey = bs58.decode(payerSecretKey);
            const payer = Keypair.fromSecretKey(secretKey);
            metaplex = Metaplex.make(connection).use(keypairIdentity(payer));
        } else {
            // Create a dummy keypair for read-only operations
            const dummyKeypair = Keypair.generate();
            metaplex = Metaplex.make(connection).use(keypairIdentity(dummyKeypair));
        }
        
        console.log('✅ Metaplex initialized for metadata reading');
        return metaplex;
    } catch (error) {
        console.error('❌ Failed to initialize Metaplex:', error);
        throw error;
    }
}

/**
 * Get NFT metadata from blockchain
 */
async function getNFTMetadata(mintAddress) {
    try {
        if (!mintAddress) {
            throw new Error('Mint address is required');
        }
        
        // Initialize Metaplex if needed
        if (!metaplex) {
            initMetaplex();
        }
        
        console.log('🔍 Fetching NFT metadata for:', mintAddress);
        
        // Convert mint address to PublicKey
        let mintPublicKey;
        try {
            mintPublicKey = new PublicKey(mintAddress);
        } catch (error) {
            throw new Error(`Invalid mint address: ${mintAddress}`);
        }
        
        // Fetch NFT using Metaplex
        const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });
        
        if (!nft) {
            throw new Error('NFT not found on blockchain');
        }
        
        console.log('✅ NFT found:', nft.name);
        console.log('   URI:', nft.uri);
        
        // Fetch metadata JSON from URI
        let metadataJson = null;
        let imageUrl = null;
        
        if (nft.uri) {
            try {
                console.log('📥 Fetching metadata from URI:', nft.uri);
                const metadataResponse = await fetch(nft.uri);
                
                if (metadataResponse.ok) {
                    metadataJson = await metadataResponse.json();
                    imageUrl = metadataJson.image || metadataJson.imageUrl || null;
                    console.log('✅ Metadata fetched, image URL:', imageUrl);
                } else {
                    console.warn('⚠️ Failed to fetch metadata from URI:', metadataResponse.status);
                }
            } catch (fetchError) {
                console.warn('⚠️ Error fetching metadata JSON:', fetchError.message);
            }
        }
        
        // Return metadata
        return {
            success: true,
            mintAddress: mintAddress,
            name: nft.name,
            symbol: nft.symbol || 'GOTCHI',
            uri: nft.uri,
            image: imageUrl,
            metadata: metadataJson,
            updateAuthority: nft.updateAuthorityAddress.toString(),
            sellerFeeBasisPoints: nft.sellerFeeBasisPoints || 0,
            creators: nft.creators || []
        };
        
    } catch (error) {
        console.error('❌ Failed to get NFT metadata:', error);
        throw error;
    }
}

/**
 * Express handler for GET /api/get-nft-metadata
 */
async function handleGetNFTMetadata(req, res) {
    try {
        const { mint } = req.query;
        
        if (!mint) {
            return res.status(400).json({
                success: false,
                error: 'Mint address is required. Use ?mint=<mint_address>'
            });
        }
        
        console.log('📡 GET /api/get-nft-metadata - Mint:', mint);
        
        const metadata = await getNFTMetadata(mint);
        
        res.json(metadata);
        
    } catch (error) {
        console.error('❌ Error in handleGetNFTMetadata:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch NFT metadata'
        });
    }
}

module.exports = {
    getNFTMetadata,
    handleGetNFTMetadata
};

