/**
 * Fix NFT file names - remove numbers and keep only one file per rarity
 * 
 * Usage: node fix-file-names.js
 */

const fs = require('fs');
const path = require('path');

const GENERATED_DIR = path.join(__dirname, 'nft-assets', 'generated');
const BACKUP_DIR = path.join(__dirname, 'nft-assets', 'generated', 'backup');

const TIERS = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

// Create backup directory
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('📁 Created backup directory');
}

/**
 * Fix files in a tier
 */
function fixTier(tier) {
    const tierDir = path.join(GENERATED_DIR, tier);
    
    if (!fs.existsSync(tierDir)) {
        console.log(`⚠️  Tier directory not found: ${tier}`);
        return;
    }
    
    console.log(`\n🔧 Fixing ${tier} tier...`);
    
    for (const rarity of RARITIES) {
        const files = fs.readdirSync(tierDir)
            .filter(f => f.startsWith(`${rarity}`) && f.endsWith('.png'))
            .sort();
        
        if (files.length === 0) {
            console.log(`   ⚠️  No files found for ${rarity}`);
            continue;
        }
        
        const targetFile = `${rarity}.png`;
        const targetPath = path.join(tierDir, targetFile);
        
        // If target file already exists and is the only one, skip
        if (files.length === 1 && files[0] === targetFile) {
            console.log(`   ✅ ${rarity}.png already correct`);
            continue;
        }
        
        // Find the best file to keep (prefer file without number, or first one)
        let fileToKeep = files.find(f => f === targetFile);
        if (!fileToKeep) {
            // Prefer files with numbers (they might be better quality)
            // Or just use the first one
            fileToKeep = files[0];
        }
        
        const fileToKeepPath = path.join(tierDir, fileToKeep);
        
        // If target file exists but is different, backup it first
        if (fs.existsSync(targetPath) && fileToKeep !== targetFile) {
            const backupPath = path.join(BACKUP_DIR, `${tier}_${targetFile}`);
            fs.copyFileSync(targetPath, backupPath);
            console.log(`   💾 Backed up existing ${targetFile}`);
        }
        
        // Copy/rename file to keep to target name
        if (fileToKeep !== targetFile) {
            fs.copyFileSync(fileToKeepPath, targetPath);
            console.log(`   ✅ Renamed ${fileToKeep} → ${targetFile}`);
        } else {
            console.log(`   ✅ ${targetFile} already correct`);
        }
        
        // Backup and remove other files
        for (const file of files) {
            if (file !== targetFile) {
                const filePath = path.join(tierDir, file);
                const backupPath = path.join(BACKUP_DIR, `${tier}_${file}`);
                fs.copyFileSync(filePath, backupPath);
                fs.unlinkSync(filePath);
                console.log(`   🗑️  Removed ${file} (backed up)`);
            }
        }
    }
}

/**
 * Main function
 */
function main() {
    console.log('🚀 Starting file name fix...');
    console.log(`📂 Generated directory: ${GENERATED_DIR}`);
    console.log(`💾 Backup directory: ${BACKUP_DIR}`);
    
    if (!fs.existsSync(GENERATED_DIR)) {
        console.error(`❌ Generated directory not found: ${GENERATED_DIR}`);
        process.exit(1);
    }
    
    for (const tier of TIERS) {
        fixTier(tier);
    }
    
    console.log('\n✅ File name fix complete!');
    console.log(`💾 Backups saved to: ${BACKUP_DIR}`);
    console.log('\n📋 Next steps:');
    console.log('1. Check the files in generated/{tier}/ folders');
    console.log('2. Run: node upload-to-ipfs.js');
    console.log('3. Update mint.html with IPFS URLs');
}

// Run
main();






