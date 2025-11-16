/**
 * TAMA Token Distribution API
 * Handles SPL token transfers for NFT minting with TAMA
 */

const { 
    Connection, 
    PublicKey, 
    Keypair,
    Transaction
} = require('@solana/web3.js');
const {
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction,
    createBurnInstruction,
    TOKEN_PROGRAM_ID
} = require('@solana/spl-token');

// Environment variables
const TAMA_MINT_ADDRESS = process.env.TAMA_MINT_ADDRESS || 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY';
const SOLANA_NETWORK = process.env.SOLANA_NETWORK || 'devnet';
const RPC_URL = `https://api.${SOLANA_NETWORK}.solana.com`;

// Incinerator address (official Solana burn address)
const INCINERATOR_ADDRESS = '1nc1nerator11111111111111111111111111111111';

/**
 * Execute TAMA token distribution
 */
async function executeTAMATransfer(req, res) {
    try {
        const { amount, distributions } = req.body;

        // Validate request
        if (!amount || !distributions || !Array.isArray(distributions)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid request: amount and distributions required'
            });
        }

        console.log('💰 TAMA Distribution Request:', { amount, distributions });

        // Load P2E Pool keypair from environment
        const p2eKeypairJson = process.env.SOLANA_P2E_POOL_KEYPAIR;
        if (!p2eKeypairJson) {
            console.error('❌ SOLANA_P2E_POOL_KEYPAIR not found in environment');
            return res.status(500).json({
                success: false,
                error: 'P2E Pool keypair not configured. Set SOLANA_P2E_POOL_KEYPAIR environment variable.'
            });
        }

        // Parse keypair
        let p2eKeypair;
        try {
            const keypairArray = JSON.parse(p2eKeypairJson);
            p2eKeypair = Keypair.fromSecretKey(new Uint8Array(keypairArray));
            console.log('✅ P2E Pool keypair loaded:', p2eKeypair.publicKey.toString());
        } catch (err) {
            console.error('❌ Failed to parse P2E Pool keypair:', err);
            return res.status(500).json({
                success: false,
                error: 'Invalid P2E Pool keypair format'
            });
        }

        // Connect to Solana
        const connection = new Connection(RPC_URL, 'confirmed');
        const mintAddress = new PublicKey(TAMA_MINT_ADDRESS);

        // Get P2E Pool token account
        const p2eTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            p2eKeypair,
            mintAddress,
            p2eKeypair.publicKey
        );

        console.log('💎 P2E Pool Token Account:', p2eTokenAccount.address.toString());

        // Get token decimals
        const mintInfo = await connection.getParsedAccountInfo(mintAddress);
        const decimals = mintInfo?.value?.data?.parsed?.info?.decimals ?? 9;
        console.log(`💎 TAMA Token decimals: ${decimals}`);

        // Execute transfers
        const results = [];
        const errors = [];

        for (const dist of distributions) {
            let { to, amount: transferAmount, label } = dist;

            // Handle BURN: use burn instruction instead of transfer
            const isBurn = (to === 'BURN');
            
            if (!to || transferAmount <= 0) {
                errors.push(`Invalid distribution: ${label}`);
                continue;
            }

            // Convert amount to raw units (multiply by 10^decimals)
            const rawAmount = transferAmount * Math.pow(10, decimals);
            console.log(`💰 Converting ${transferAmount} TAMA → ${rawAmount} raw units (decimals: ${decimals})`);
            transferAmount = rawAmount;

            try {
                let transaction;
                let signature;

                if (isBurn) {
                    // 🔥 BURN: Destroy tokens permanently
                    console.log(`🔥 Burning ${transferAmount} TAMA (destroying forever)`);
                    
                    transaction = new Transaction().add(
                        createBurnInstruction(
                            p2eTokenAccount.address,  // Token account to burn from
                            mintAddress,              // Mint address
                            p2eKeypair.publicKey,     // Owner of token account
                            transferAmount,           // Amount to burn
                            [],                       // Additional signers
                            TOKEN_PROGRAM_ID
                        )
                    );
                } else {
                    // 💎 TRANSFER: Send to destination
                    console.log(`💎 Transferring ${transferAmount} TAMA → ${to}`);
                    
                    // Get or create destination token account
                    const destinationPubkey = new PublicKey(to);
                    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
                        connection,
                        p2eKeypair,
                        mintAddress,
                        destinationPubkey
                    );

                    transaction = new Transaction().add(
                        createTransferInstruction(
                            p2eTokenAccount.address,
                            destinationTokenAccount.address,
                            p2eKeypair.publicKey,
                            transferAmount,
                            [],
                            TOKEN_PROGRAM_ID
                        )
                    );
                }

                // Send transaction
                signature = await connection.sendTransaction(
                    transaction,
                    [p2eKeypair],
                    { skipPreflight: false, preflightCommitment: 'confirmed' }
                );

                // Wait for confirmation
                await connection.confirmTransaction(signature, 'confirmed');

                const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=${SOLANA_NETWORK}`;
                
                results.push({
                    label,
                    to: isBurn ? 'BURNED (destroyed)' : to,
                    amount: transferAmount,
                    signature,
                    explorer: explorerUrl
                });

                console.log(`✅ ${label}: ${transferAmount} TAMA ${isBurn ? '(BURNED)' : '→ ' + to}`);
                console.log(`   Signature: ${signature}`);

            } catch (err) {
                console.error(`❌ Transfer failed: ${label}`, err);
                errors.push(`${label}: ${err.message}`);
            }
        }

        // Return results
        if (results.length > 0) {
            res.json({
                success: true,
                transfers: results,
                errors: errors.length > 0 ? errors : undefined,
                total_transferred: results.reduce((sum, r) => sum + r.amount, 0)
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'No transfers executed',
                errors
            });
        }

    } catch (error) {
        console.error('❌ TAMA transfer error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { executeTAMATransfer };

