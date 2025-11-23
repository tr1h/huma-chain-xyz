/**
 * Update all NFT metadata script
 * Updates image URIs for all existing MUTABLE NFTs in the database
 */

const fetch = require('node-fetch');

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zfrazyupameidxpjihrh.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';

// API endpoint
const UPDATE_API_URL = process.env.UPDATE_API_URL || 'https://api.solanatamagotchi.com/api/update-nft-metadata-wrapper.php';

// Delay between requests (ms) - to avoid rate limiting
const DELAY_MS = 2000; // 2 seconds between requests

/**
 * Get all NFTs from database
 */
async function getAllNFTs() {
    try {
        console.log('📊 Fetching all NFTs from database...');
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts?select=*&is_active=eq.true&nft_mint_address=not.is.null&order=minted_at.desc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch NFTs: ${response.status} ${response.statusText}`);
        }

        const nfts = await response.json();
        console.log(`✅ Found ${nfts.length} active NFTs with mint addresses`);
        
        // Filter only real on-chain NFTs (not pending_* placeholders)
        const realNFTs = nfts.filter(nft => 
            nft.nft_mint_address && 
            nft.nft_mint_address.length > 30 && 
            !nft.nft_mint_address.includes('pending_') &&
            !nft.nft_mint_address.includes('_')
        );
        
        console.log(`✅ Found ${realNFTs.length} real on-chain NFTs to update`);
        return realNFTs;
    } catch (error) {
        console.error('❌ Error fetching NFTs:', error);
        throw error;
    }
}

/**
 * Update single NFT metadata
 */
async function updateNFTMetadata(nft) {
    try {
        const { nft_mint_address, tier_name, rarity, earning_multiplier, design_number } = nft;
        
        console.log(`\n🔄 Updating NFT: ${nft_mint_address.substring(0, 8)}...`);
        console.log(`   Tier: ${tier_name}, Rarity: ${rarity || 'Common'}`);
        
        const body = {
            mintAddress: nft_mint_address,
            tier: tier_name || 'Bronze',
            rarity: rarity || 'Common',
            multiplier: earning_multiplier || 2.0,
            design_number: design_number || null
        };
        
        const response = await fetch(UPDATE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`   ✅ Updated! Transaction: ${result.transactionSignature?.substring(0, 16)}...`);
            return { success: true, nft, result };
        } else {
            console.log(`   ❌ Failed: ${result.error}`);
            return { success: false, nft, error: result.error };
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return { success: false, nft, error: error.message };
    }
}

/**
 * Update all NFTs with delay between requests
 */
async function updateAllNFTs() {
    try {
        const nfts = await getAllNFTs();
        
        if (nfts.length === 0) {
            console.log('ℹ️ No NFTs to update');
            return;
        }
        
        console.log(`\n🚀 Starting to update ${nfts.length} NFTs...`);
        console.log(`⏳ Delay between requests: ${DELAY_MS}ms\n`);
        
        const results = {
            success: [],
            failed: []
        };
        
        for (let i = 0; i < nfts.length; i++) {
            const nft = nfts[i];
            console.log(`\n[${i + 1}/${nfts.length}]`);
            
            const result = await updateNFTMetadata(nft);
            
            if (result.success) {
                results.success.push(result);
            } else {
                results.failed.push(result);
            }
            
            // Delay before next request (except for last one)
            if (i < nfts.length - 1) {
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
            }
        }
        
        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 UPDATE SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Successfully updated: ${results.success.length}`);
        console.log(`❌ Failed: ${results.failed.length}`);
        console.log(`📦 Total processed: ${nfts.length}`);
        
        if (results.failed.length > 0) {
            console.log('\n❌ Failed NFTs:');
            results.failed.forEach(({ nft, error }) => {
                console.log(`   - ${nft.nft_mint_address?.substring(0, 16)}... (${nft.tier_name} ${nft.rarity}): ${error}`);
            });
        }
        
        if (results.success.length > 0) {
            console.log('\n✅ Successfully updated NFTs:');
            results.success.forEach(({ nft, result }) => {
                console.log(`   - ${nft.nft_mint_address?.substring(0, 16)}... (${nft.tier_name} ${nft.rarity})`);
                console.log(`     Transaction: ${result.transactionSignature?.substring(0, 16)}...`);
            });
        }
        
        console.log('\n✅ All updates completed!');
        console.log('⏳ Wait 1-2 minutes for Solscan to refresh metadata cache');
        
    } catch (error) {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    updateAllNFTs().catch(error => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
}

module.exports = { updateAllNFTs, getAllNFTs, updateNFTMetadata };

