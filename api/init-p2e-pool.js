/**
 * Initialize P2E Pool Token Account
 * Creates Associated Token Account for P2E Pool to hold TAMA tokens
 */

const {
    Connection,
    PublicKey,
    Keypair
} = require('@solana/web3.js');

const {
    getOrCreateAssociatedTokenAccount
} = require('@solana/spl-token');

const bs58 = require('bs58');

// Configuration
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const TAMA_MINT = process.env.TAMA_MINT_ADDRESS || 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY';

async function initializeP2EPool() {
    try {
        console.log('🚀 Initializing P2E Pool Token Account...\n');

        // Connect to Solana
        const connection = new Connection(RPC_URL, 'confirmed');
        console.log(`📡 Connected to: ${RPC_URL}`);

        // Load keypairs from environment
        const payerKeypairEnv = process.env.SOLANA_PAYER_KEYPAIR;
        const p2ePoolKeypairEnv = process.env.SOLANA_P2E_POOL_KEYPAIR;

        if (!payerKeypairEnv || !p2ePoolKeypairEnv) {
            console.error('❌ Missing environment variables:');
            console.error('   - SOLANA_PAYER_KEYPAIR');
            console.error('   - SOLANA_P2E_POOL_KEYPAIR');
            process.exit(1);
        }

        // Parse keypairs
        let payerKeypair, p2ePoolKeypair;

        try {
            payerKeypair = Keypair.fromSecretKey(bs58.decode(payerKeypairEnv));
        } catch (e) {
            try {
                payerKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(payerKeypairEnv)));
            } catch (e2) {
                console.error('❌ Failed to parse payer keypair');
                process.exit(1);
            }
        }

        try {
            p2ePoolKeypair = Keypair.fromSecretKey(bs58.decode(p2ePoolKeypairEnv));
        } catch (e) {
            try {
                p2ePoolKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(p2ePoolKeypairEnv)));
            } catch (e2) {
                console.error('❌ Failed to parse P2E Pool keypair');
                process.exit(1);
            }
        }

        console.log('\n✅ Keypairs loaded:');
        console.log(`   Payer: ${payerKeypair.publicKey.toString()}`);
        console.log(`   P2E Pool: ${p2ePoolKeypair.publicKey.toString()}`);

        // Check balances
        const payerBalance = await connection.getBalance(payerKeypair.publicKey);
        const payerSOL = payerBalance / 1e9;
        console.log(`\n💰 Payer SOL balance: ${payerSOL.toFixed(4)} SOL`);

        if (payerSOL < 0.01) {
            console.error('❌ Insufficient SOL balance in payer account');
            console.error('   Need at least 0.01 SOL for fees');
            process.exit(1);
        }

        // Create or get token account
        const mintAddress = new PublicKey(TAMA_MINT);
        console.log(`\n📦 Creating/Getting token account for P2E Pool...`);
        console.log(`   Mint: ${TAMA_MINT}`);

        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payerKeypair, // payer for fees
            mintAddress,
            p2ePoolKeypair.publicKey // owner
        );

        console.log('\n✅ Token account ready:');
        console.log(`   Address: ${tokenAccount.address.toString()}`);

        // Check balance
        const tokenBalance = await connection.getTokenAccountBalance(tokenAccount.address);
        const tamaBalance = parseInt(tokenBalance.value.amount) / 1e9;
        console.log(`   Balance: ${tamaBalance.toFixed(2)} TAMA`);

        console.log('\n🎉 P2E Pool initialization complete!');
        console.log('\n📋 Summary:');
        console.log(`   P2E Pool: ${p2ePoolKeypair.publicKey.toString()}`);
        console.log(`   Token Account: ${tokenAccount.address.toString()}`);
        console.log(`   TAMA Balance: ${tamaBalance.toFixed(2)} TAMA`);
        console.log(`\n   View on Solscan:`);
        console.log(`   https://solscan.io/account/${p2ePoolKeypair.publicKey.toString()}?cluster=devnet`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run
initializeP2EPool();

