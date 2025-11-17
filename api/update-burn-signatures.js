/**
 * Update Burn Transactions with Blockchain Signatures
 * 
 * This script finds old burn transactions without signatures
 * and retrieves their signatures from Solana blockchain
 */

const { createClient } = require('@supabase/supabase-js');
const { Connection, PublicKey } = require('@solana/web3.js');

// Configuration
const SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';
const SOLANA_RPC = 'https://api.devnet.solana.com';
const P2E_POOL = 'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw';
const TAMA_MINT = 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const connection = new Connection(SOLANA_RPC, 'confirmed');

async function findBurnTransactionSignature(burnAmount, createdAt) {
    try {
        const p2ePoolPubkey = new PublicKey(P2E_POOL);
        const tamaMintPubkey = new PublicKey(TAMA_MINT);
        
        const txDate = new Date(createdAt);
        console.log(`🔍 Searching for ${burnAmount} TAMA burn around ${txDate.toISOString()}`);
        
        // Get recent transactions for P2E Pool (last 500 transactions)
        const signatures = await connection.getSignaturesForAddress(
            p2ePoolPubkey,
            { limit: 500 }
        );
        
        console.log(`   Checking ${signatures.length} recent transactions`);
        
        // Check each transaction for burn instruction
        for (const sigInfo of signatures) {
            try {
                // Check if transaction time is close to our target (±2 hours)
                if (sigInfo.blockTime) {
                    const txTime = sigInfo.blockTime * 1000; // Convert to ms
                    const targetTime = txDate.getTime();
                    const timeDiff = Math.abs(txTime - targetTime);
                    const twoHours = 2 * 60 * 60 * 1000;
                    
                    if (timeDiff > twoHours) continue; // Skip if too far from target time
                }
                
                const tx = await connection.getParsedTransaction(sigInfo.signature, {
                    maxSupportedTransactionVersion: 0
                });
                
                if (!tx || !tx.meta || tx.meta.err) continue;
                
                // Check if this is a burn transaction
                const instructions = tx.transaction.message.instructions;
                for (const ix of instructions) {
                    if (ix.program === 'spl-token' && 
                        ix.parsed?.type === 'burn' &&
                        ix.parsed?.info?.mint === TAMA_MINT) {
                        
                        const burnedAmount = parseInt(ix.parsed.info.amount) / 1e9; // Convert to TAMA
                        
                        // Match amount (with small tolerance for rounding)
                        if (Math.abs(burnedAmount - burnAmount) < 0.01) {
                            console.log(`   ✅ Found matching burn: ${sigInfo.signature}`);
                            return sigInfo.signature;
                        }
                    }
                }
            } catch (err) {
                // Skip failed transactions
                continue;
            }
        }
        
        console.log(`   ❌ No matching burn found`);
        return null;
    } catch (error) {
        console.error(`   ⚠️ Error searching blockchain:`, error.message);
        return null;
    }
}

async function updateBurnSignatures() {
    console.log('🚀 Starting burn signature update...\n');
    
    try {
        // Get all burn transactions without onchain_signature
        const { data: burnTxs, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('type', 'tama_burn')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Error fetching transactions:', error);
            return;
        }
        
        console.log(`📊 Found ${burnTxs.length} burn transactions\n`);
        
        let updated = 0;
        let skipped = 0;
        let failed = 0;
        
        for (const tx of burnTxs) {
            // Check if already has signature
            const metadata = typeof tx.metadata === 'string' 
                ? JSON.parse(tx.metadata) 
                : tx.metadata;
            
            if (metadata?.onchain_signature) {
                console.log(`⏭️  Transaction ${tx.id}: Already has signature`);
                skipped++;
                continue;
            }
            
            console.log(`🔄 Processing transaction ${tx.id} (${tx.created_at})`);
            
            // Find signature in blockchain
            const signature = await findBurnTransactionSignature(tx.amount, tx.created_at);
            
            if (signature) {
                // Update transaction with signature
                const updatedMetadata = {
                    ...metadata,
                    onchain_signature: signature,
                    explorer: `https://solscan.io/tx/${signature}?cluster=devnet`,
                    updated_by_script: true,
                    updated_at: new Date().toISOString()
                };
                
                const { error: updateError } = await supabase
                    .from('transactions')
                    .update({ metadata: updatedMetadata })
                    .eq('id', tx.id);
                
                if (updateError) {
                    console.error(`   ❌ Failed to update: ${updateError.message}`);
                    failed++;
                } else {
                    console.log(`   ✅ Updated with signature: ${signature.substring(0, 20)}...`);
                    updated++;
                }
            } else {
                console.log(`   ⚠️  Could not find signature in blockchain`);
                failed++;
            }
            
            console.log(''); // Empty line for readability
            
            // Rate limiting - wait 1 second between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log('\n📈 Summary:');
        console.log(`   ✅ Updated: ${updated}`);
        console.log(`   ⏭️  Skipped (already had signature): ${skipped}`);
        console.log(`   ❌ Failed: ${failed}`);
        console.log(`   📊 Total: ${burnTxs.length}`);
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
    }
}

// Run the update
updateBurnSignatures()
    .then(() => {
        console.log('\n✨ Done!');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n💥 Script failed:', err);
        process.exit(1);
    });

