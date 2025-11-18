/**
 * TAMA Withdrawal Handler
 * Transfers TAMA from P2E Pool to user wallet
 */

const { 
    Connection, 
    PublicKey, 
    Keypair,
    Transaction,
    sendAndConfirmTransaction
} = require('@solana/web3.js');

const {
    getOrCreateAssociatedTokenAccount,
    transfer,
    TOKEN_PROGRAM_ID
} = require('@solana/spl-token');

const bs58 = require('bs58');

// Конфигурация
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const TAMA_MINT = process.env.TAMA_MINT_ADDRESS || 'CbWmbAKNEaVx2dKfBfz9VqyC7YWBd2iWvqWaZMsaC6jr';
const P2E_POOL = 'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw';

async function executeWithdrawal(req, res) {
    try {
        const { wallet_address, amount, telegram_id } = req.body;

        // Validation
        if (!wallet_address || !amount || !telegram_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: wallet_address, amount, telegram_id'
            });
        }

        if (amount < 1000) {
            return res.status(400).json({
                success: false,
                error: 'Minimum withdrawal is 1,000 TAMA'
            });
        }

        console.log(`💸 Processing withdrawal: ${amount} TAMA to ${wallet_address}`);

        // Initialize connection
        const connection = new Connection(RPC_URL, 'confirmed');

        // Get keypairs from environment
        const payerKeypairEnv = process.env.SOLANA_PAYER_KEYPAIR;
        const p2ePoolKeypairEnv = process.env.SOLANA_P2E_POOL_KEYPAIR;

        if (!payerKeypairEnv || !p2ePoolKeypairEnv) {
            console.error('❌ Missing keypairs in environment');
            return res.status(500).json({
                success: false,
                error: 'Server configuration error: Missing keypairs'
            });
        }

        // Parse keypairs (expecting base58 or JSON array format)
        let payerKeypair, p2ePoolKeypair;
        
        try {
            // Try parsing as base58
            payerKeypair = Keypair.fromSecretKey(bs58.decode(payerKeypairEnv));
        } catch (e) {
            try {
                // Try parsing as JSON array
                payerKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(payerKeypairEnv)));
            } catch (e2) {
                console.error('❌ Failed to parse payer keypair');
                return res.status(500).json({
                    success: false,
                    error: 'Invalid payer keypair format'
                });
            }
        }

        try {
            // Try parsing as base58
            p2ePoolKeypair = Keypair.fromSecretKey(bs58.decode(p2ePoolKeypairEnv));
        } catch (e) {
            try {
                // Try parsing as JSON array
                p2ePoolKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(p2ePoolKeypairEnv)));
            } catch (e2) {
                console.error('❌ Failed to parse P2E Pool keypair');
                return res.status(500).json({
                    success: false,
                    error: 'Invalid P2E Pool keypair format'
                });
            }
        }

        console.log('✅ Keypairs loaded');
        console.log(`  Payer: ${payerKeypair.publicKey.toString()}`);
        console.log(`  P2E Pool: ${p2ePoolKeypair.publicKey.toString()}`);

        // Get token decimals
        const mintAddress = new PublicKey(TAMA_MINT);
        const mintInfo = await connection.getParsedAccountInfo(mintAddress);
        const decimals = mintInfo?.value?.data?.parsed?.info?.decimals ?? 9;
        console.log(`💎 TAMA Token decimals: ${decimals}`);

        // Calculate fee (5%)
        const fee = Math.floor(amount * 0.05);
        const amountSent = amount - fee;
        const rawAmount = amountSent * Math.pow(10, decimals);

        console.log(`💰 Withdrawal breakdown:`);
        console.log(`  Requested: ${amount} TAMA`);
        console.log(`  Fee (5%): ${fee} TAMA`);
        console.log(`  Amount sent: ${amountSent} TAMA`);
        console.log(`  Raw amount: ${rawAmount} units`);

        // Get or create token accounts
        const recipientPubkey = new PublicKey(wallet_address);

        console.log('📦 Getting token accounts...');
        
        // P2E Pool source account
        const sourceAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payerKeypair, // payer for fees
            mintAddress,
            p2ePoolKeypair.publicKey // owner
        );

        console.log(`  Source (P2E Pool): ${sourceAccount.address.toString()}`);

        // Recipient account
        const destinationAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payerKeypair, // payer for fees
            mintAddress,
            recipientPubkey
        );

        console.log(`  Destination: ${destinationAccount.address.toString()}`);

        // Check P2E Pool balance
        const sourceBalance = await connection.getTokenAccountBalance(sourceAccount.address);
        const availableBalance = parseInt(sourceBalance.value.amount) / Math.pow(10, decimals);
        
        console.log(`💰 P2E Pool balance: ${availableBalance.toFixed(2)} TAMA`);

        if (availableBalance < amountSent) {
            console.error(`❌ Insufficient balance in P2E Pool`);
            return res.status(400).json({
                success: false,
                error: 'Insufficient TAMA in P2E Pool. Please contact support.',
                details: {
                    available: availableBalance,
                    required: amountSent
                }
            });
        }

        // Execute transfer
        console.log('🚀 Executing transfer...');
        
        const signature = await transfer(
            connection,
            payerKeypair, // payer for fees
            sourceAccount.address, // from (P2E Pool)
            destinationAccount.address, // to (user)
            p2ePoolKeypair, // owner of source account
            rawAmount // amount in raw units
        );

        console.log(`✅ Transfer completed!`);
        console.log(`  Signature: ${signature}`);
        console.log(`  Explorer: https://solscan.io/tx/${signature}?cluster=devnet`);

        // Return success
        return res.json({
            success: true,
            signature: signature,
            explorer: `https://solscan.io/tx/${signature}?cluster=devnet`,
            amount_sent: amountSent,
            fee: fee,
            total_deducted: amount
        });

    } catch (error) {
        console.error('❌ Withdrawal error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Withdrawal failed',
            details: error.toString()
        });
    }
}

module.exports = { executeWithdrawal };

