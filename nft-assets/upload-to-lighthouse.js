/**
 * Upload NFT images to IPFS via Lighthouse Storage
 * 
 * Usage:
 * 1. npm install @lighthouse-web3/sdk
 * 2. Get API key from https://www.lighthouse.storage/ (Dashboard -> API Keys)
 * 3. Set environment variable: $env:LIGHTHOUSE_API_KEY="your_api_key" (PowerShell)
 * 4. Run: node upload-to-lighthouse.js
 */

const lighthouse = require('@lighthouse-web3/sdk');
const fs = require('fs');
const path = require('path');

// Get API key from environment
const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY;

if (!LIGHTHOUSE_API_KEY) {
    console.error('❌ LIGHTHOUSE_API_KEY environment variable not set!');
    console.log('');
    console.log('Get your API key from: https://www.lighthouse.storage/');
    console.log('1. Sign up / Login');
    console.log('2. Go to Dashboard -> API Keys');
    console.log('3. Create a new API key');
    console.log('4. Set: $env:LIGHTHOUSE_API_KEY="your_api_key" (PowerShell)');
    console.log('   Or: export LIGHTHOUSE_API_KEY="your_api_key" (Linux/Mac)');
    process.exit(1);
}

// Define tiers and rarities
const TIERS = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
const RARITIES = {
    bronze: ['common', 'uncommon', 'rare', 'epic'],
    silver: ['uncommon', 'rare', 'epic', 'legendary'],
    gold: ['common', 'uncommon', 'rare', 'epic'],
    platinum: ['rare', 'epic', 'legendary', 'mythical'],
    diamond: ['rare', 'epic', 'legendary', 'mythical']
};

// Store results
const uploadedImages = {};

/**
 * Upload a single image to IPFS via Lighthouse
 */
async function uploadImage(filePath, tier, rarity) {
    try {
        console.log(`📤 Uploading ${tier}/${rarity}.png...`);
        
        // Upload file using Lighthouse SDK
        const uploadResponse = await lighthouse.upload(
            filePath,
            LIGHTHOUSE_API_KEY
        );
        
        // Lighthouse API returns: { data: { Hash: '...', Name: '...' } }
        const cid = uploadResponse?.data?.Hash || uploadResponse?.Hash;
        
        if (!cid) {
            console.error('   Response:', JSON.stringify(uploadResponse, null, 2));
            throw new Error('Invalid response from Lighthouse API - no Hash/CID found');
        }
        const ipfsUrl = `https://gateway.lighthouse.storage/ipfs/${cid}`;
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
        if (error.response) {
            console.error('   API Response:', JSON.stringify(error.response.data, null, 2));
        }
        return null;
    }
}

/**
 * Upload all images
 */
async function uploadAllImages() {
    console.log('🚀 Starting NFT image upload to IPFS via Lighthouse...');
    console.log('');
    
    for (const tier of TIERS) {
        uploadedImages[tier] = {};
        
        const rarities = RARITIES[tier];
        
        for (const rarity of rarities) {
            // Look in generated/{tier}/ folder first, then fallback to {tier}/ folder
            const generatedPath = path.join(__dirname, 'generated', tier, `${rarity}.png`);
            const fallbackPath = path.join(__dirname, tier, `${rarity}.png`);
            const filePath = fs.existsSync(generatedPath) ? generatedPath : fallbackPath;
            
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

