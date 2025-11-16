/**
 * Get public address from keypair for funding
 * Usage: node tools/get-payer-address.js payer-keypair.json
 */

const { Keypair } = require('@solana/web3.js');
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
    
    // Create keypair
    const secretKey = new Uint8Array(keypairArray);
    const payer = Keypair.fromSecretKey(secretKey);
    
    console.log('\n✅ Payer Wallet Info:\n');
    console.log('═'.repeat(80));
    console.log(`Public Key: ${payer.publicKey.toString()}`);
    console.log('═'.repeat(80));
    
    console.log('\n💰 To fund this wallet with Devnet SOL:');
    console.log('   1. Copy the public key above');
    console.log('   2. Visit: https://faucet.solana.com/');
    console.log('   3. Paste address and request 1-2 SOL');
    console.log('\n   OR use Solana CLI:');
    console.log(`   solana airdrop 1 ${payer.publicKey.toString()} --url devnet`);
    
    console.log('\n🔍 Check balance:');
    console.log(`   https://explorer.solana.com/address/${payer.publicKey.toString()}?cluster=devnet`);
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Usage: node tools/get-payer-address.js [path-to-keypair.json]');
    console.error('   Example: node tools/get-payer-address.js payer-keypair.json');
    process.exit(1);
}



