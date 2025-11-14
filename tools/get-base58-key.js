/**
 * Convert keypair.json to base58 format for Render environment variables
 * Usage: node tools/get-base58-key.js payer-keypair.json
 */

const bs58 = require('bs58');
const fs = require('fs');
const path = require('path');

// Get keypair file path from command line argument
const keypairPath = process.argv[2] || 'payer-keypair.json';

try {
    // Read keypair file
    const fullPath = path.resolve(keypairPath);
    console.log(`📂 Reading keypair from: ${fullPath}`);
    
    const keypairData = fs.readFileSync(fullPath, 'utf8');
    const keypairArray = JSON.parse(keypairData);
    
    // Convert to Uint8Array
    const secretKey = new Uint8Array(keypairArray);
    
    // Encode to base58
    const base58Key = bs58.encode(secretKey);
    
    console.log('\n✅ Success! Copy this value to Render Environment Variables:\n');
    console.log('═'.repeat(80));
    console.log(base58Key);
    console.log('═'.repeat(80));
    
    console.log('\n📋 Variable name: SOLANA_PAYER_KEYPAIR');
    console.log('📋 Variable value: (the string above)');
    
    console.log('\n🔗 Add it here:');
    console.log('   https://dashboard.render.com/web/srv-d4b6hinpm1nc73bjgva0/env');
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Usage: node tools/get-base58-key.js [path-to-keypair.json]');
    console.error('   Example: node tools/get-base58-key.js payer-keypair.json');
    process.exit(1);
}

