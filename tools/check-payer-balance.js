/**
 * Check payer wallet balance
 * Usage: node tools/check-payer-balance.js payer-keypair.json
 */

const { Connection, Keypair, clusterApiUrl } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Get keypair file path from command line argument
const keypairPath = process.argv[2] || 'payer-keypair.json';

async function checkBalance() {
    try {
        // Read keypair file
        const fullPath = path.resolve(keypairPath);
        console.log(`📂 Reading keypair from: ${fullPath}`);
        
        const keypairData = fs.readFileSync(fullPath, 'utf8');
        const keypairArray = JSON.parse(keypairData);
        
        // Create keypair
        const secretKey = new Uint8Array(keypairArray);
        const payer = Keypair.fromSecretKey(secretKey);
        
        console.log(`📍 Payer address: ${payer.publicKey.toString()}`);
        console.log(`\n🔍 Checking balance on Devnet...\n`);
        
        // Connect to Devnet
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        
        // Get balance
        const balance = await connection.getBalance(payer.publicKey);
        const balanceSOL = balance / 1e9;
        
        console.log('═'.repeat(80));
        console.log(`💰 Balance: ${balanceSOL} SOL`);
        console.log('═'.repeat(80));
        
        // Check if sufficient
        if (balanceSOL >= 0.1) {
            console.log('\n✅ Sufficient balance for NFT minting!');
            console.log('   You can mint NFTs now.');
        } else if (balanceSOL > 0) {
            console.log('\n⚠️  Low balance!');
            console.log(`   Need at least 0.1 SOL, but have ${balanceSOL} SOL`);
            console.log('   Please fund the wallet.');
        } else {
            console.log('\n❌ Empty wallet!');
            console.log('   Need to fund with at least 0.1 SOL');
        }
        
        console.log('\n💰 To fund this wallet:');
        console.log('   1. Visit: https://faucet.solana.com/');
        console.log(`   2. Paste: ${payer.publicKey.toString()}`);
        console.log('   3. Request 1-2 SOL');
        
        console.log('\n🔍 Explorer:');
        console.log(`   https://explorer.solana.com/address/${payer.publicKey.toString()}?cluster=devnet`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 Usage: node tools/check-payer-balance.js [path-to-keypair.json]');
        console.error('   Example: node tools/check-payer-balance.js payer-keypair.json');
        process.exit(1);
    }
}

checkBalance();

