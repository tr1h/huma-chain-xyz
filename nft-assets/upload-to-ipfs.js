/**
 * Upload NFT images to IPFS via NFT.Storage
 * 
 * Usage:
 * 1. npm install nft.storage
 * 2. Get API key from https://nft.storage/manage/
 * 3. Set environment variable: export NFT_STORAGE_KEY="your_api_key"
 * 4. Run: node upload-to-ipfs.js
 */

const { NFTStorage, File, Blob } = require('nft.storage');
const fs = require('fs');
const path = require('path');

// Get API key from environment
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

if (!NFT_STORAGE_KEY) {
    console.error('❌ NFT_STORAGE_KEY environment variable not set!');
    console.log('');
    console.log('Get your API key from: https://nft.storage/manage/');
    console.log('Then run: export NFT_STORAGE_KEY="your_api_key"');
    console.log('Or: set NFT_STORAGE_KEY=your_api_key (Windows)');
    process.exit(1);
}

const client = new NFTStorage({ token: NFT_STORAGE_KEY });

// Define tiers and rarities
const TIERS = ['bronze', 'silver', 'gold', 'diamond'];
const RARITIES = {
    bronze: ['common', 'uncommon', 'rare', 'epic'],
    silver: ['uncommon', 'rare', 'epic', 'legendary'],
    gold: ['common', 'uncommon', 'rare', 'epic'],
    diamond: ['rare', 'epic', 'legendary', 'mythical']
};

// Store results
const uploadedImages = {};

/**
 * Upload a single image to IPFS
 */
async function uploadImage(filePath, tier, rarity) {
    try {
        console.log(`📤 Uploading ${tier}/${rarity}.png...`);
        
        // Read file
        const imageData = fs.readFileSync(filePath);
        
        // Create blob
        const imageBlob = new Blob([imageData]);
        
        // Upload to IPFS
        const cid = await client.storeBlob(imageBlob);
        
        const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;
        const ipfsProtocol = `ipfs://${cid}`;
        
        console.log(`✅ Uploaded ${tier}/${rarity}.png`);
        console.log(`   CID: ${cid}`);
        console.log(`   URL: ${ipfsUrl}`);
        console.log('');
        
        return {
            cid,
            ipfsUrl,
            ipfsProtocol
        };
    } catch (error) {
        console.error(`❌ Failed to upload ${tier}/${rarity}.png:`, error.message);
        return null;
    }
}

/**
 * Upload all images
 */
async function uploadAllImages() {
    console.log('🚀 Starting NFT image upload to IPFS...');
    console.log('');
    
    for (const tier of TIERS) {
        uploadedImages[tier] = {};
        
        const rarities = RARITIES[tier];
        
        for (const rarity of rarities) {
            const filePath = path.join(__dirname, tier, `${rarity}.png`);
            
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                console.warn(`⚠️  File not found: ${filePath}`);
                console.log('   Skipping...');
                console.log('');
                continue;
            }
            
            // Upload
            const result = await uploadImage(filePath, tier, rarity);
            
            if (result) {
                uploadedImages[tier][rarity] = result;
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    console.log('');
    console.log('✅ Upload complete!');
    console.log('');
}

/**
 * Generate JavaScript code for mint.html
 */
function generateCodeSnippet() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 Copy this code snippet to mint.html:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('const NFT_IMAGES = {');
    
    for (const tier of TIERS) {
        console.log(`    ${tier}: {`);
        
        const rarities = Object.keys(uploadedImages[tier] || {});
        
        for (let i = 0; i < rarities.length; i++) {
            const rarity = rarities[i];
            const data = uploadedImages[tier][rarity];
            const comma = i < rarities.length - 1 ? ',' : '';
            
            console.log(`        ${rarity}: '${data.ipfsUrl}'${comma}`);
        }
        
        const isLastTier = tier === TIERS[TIERS.length - 1];
        console.log(`    }${isLastTier ? '' : ','}`);
    }
    
    console.log('};');
    console.log('');
    console.log('function getNFTImageUrl(tier, rarity) {');
    console.log('    return NFT_IMAGES[tier.toLowerCase()]?.[rarity.toLowerCase()] ||');
    console.log('        \'https://via.placeholder.com/1000x1000.png?text=NFT\';');
    console.log('}');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
}

/**
 * Save results to JSON
 */
function saveResults() {
    const outputPath = path.join(__dirname, 'ipfs-urls.json');
    fs.writeFileSync(outputPath, JSON.stringify(uploadedImages, null, 2));
    console.log('');
    console.log(`💾 Results saved to: ${outputPath}`);
}

/**
 * Main function
 */
async function main() {
    try {
        await uploadAllImages();
        generateCodeSnippet();
        saveResults();
    } catch (error) {
        console.error('❌ Upload failed:', error);
        process.exit(1);
    }
}

// Run
main();

