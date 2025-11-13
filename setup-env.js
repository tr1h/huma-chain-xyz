/**
 * Setup .env file for on-chain NFT minting
 * Run: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const bs58 = require('bs58');

console.log('🔧 Setting up .env file for on-chain NFT minting...\n');

// Check if .env already exists
if (fs.existsSync('.env')) {
    console.log('⚠️  .env file already exists!');
    console.log('   If you want to recreate it, delete .env first.\n');
    process.exit(0);
}

// Try to get payer keypair
let payerKeypair = null;
if (fs.existsSync('payer-keypair.json')) {
    try {
        const keypairData = JSON.parse(fs.readFileSync('payer-keypair.json', 'utf8'));
        const secretKey = Uint8Array.from(keypairData);
        payerKeypair = bs58.encode(secretKey);
        console.log('✅ Found payer-keypair.json');
        console.log('   Private Key (base58):', payerKeypair.substring(0, 20) + '...' + payerKeypair.substring(payerKeypair.length - 10));
    } catch (error) {
        console.warn('⚠️  Failed to read payer-keypair.json:', error.message);
    }
} else {
    console.log('ℹ️  payer-keypair.json not found');
    console.log('   You can create a new keypair or use existing one\n');
}

// Get Supabase config from config.php or use defaults
let supabaseUrl = 'https://zfrazyupameidxpjihrh.supabase.co';
let supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';

// Create .env content
const envContent = `# Solana Network (devnet or mainnet)
SOLANA_NETWORK=devnet

# Payer Keypair (base58 encoded private key)
# ${payerKeypair ? '✅ Loaded from payer-keypair.json' : '⚠️  SET THIS MANUALLY!'}
SOLANA_PAYER_KEYPAIR=${payerKeypair || 'YOUR_BASE58_PRIVATE_KEY_HERE'}

# Supabase Configuration
SUPABASE_URL=${supabaseUrl}
SUPABASE_KEY=${supabaseKey}

# Port for Node.js server (optional, defaults to 3001)
PORT=3001

# Node.js Backend URL (for PHP wrapper, optional)
# For local dev: http://localhost:3001/api/mint-nft-onchain
# For production: https://your-service.onrender.com/api/mint-nft-onchain
NODE_BACKEND_URL=http://localhost:3001/api/mint-nft-onchain

# NFT Image Base URL
NFT_IMAGE_BASE_URL=https://solanatamagotchi.com/nft-assets
`;

// Write .env file
fs.writeFileSync('.env', envContent);

console.log('✅ .env file created successfully!\n');
console.log('📝 Next steps:');
console.log('   1. Review .env file and update if needed');
if (!payerKeypair) {
    console.log('   2. Set SOLANA_PAYER_KEYPAIR (get from payer-keypair.json or create new)');
    console.log('      Run: node -e "const fs=require(\'fs\'); const kp=JSON.parse(fs.readFileSync(\'payer-keypair.json\')); const bs58=require(\'bs58\'); console.log(bs58.encode(Uint8Array.from(kp)));"');
}
console.log('   3. Get SOL for payer keypair (Devnet faucet: https://faucet.solana.com/)');
console.log('   4. Start server: npm run start:onchain');
console.log('   5. Test: curl http://localhost:3001/health\n');

