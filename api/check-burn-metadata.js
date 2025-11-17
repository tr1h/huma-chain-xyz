/**
 * Check what metadata looks like for burn transactions
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkBurnMetadata() {
    console.log('🔍 Checking burn transaction metadata...\n');
    
    const { data: burnTxs, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'tama_burn')
        .order('created_at', { ascending: false })
        .limit(5);
    
    if (error) {
        console.error('❌ Error:', error);
        return;
    }
    
    console.log(`📊 Found ${burnTxs.length} recent burn transactions:\n`);
    
    for (const tx of burnTxs) {
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`🔥 Transaction ID: ${tx.id}`);
        console.log(`📅 Created: ${tx.created_at}`);
        console.log(`💰 Amount: ${tx.amount} TAMA`);
        console.log(`\n📦 Metadata type: ${typeof tx.metadata}`);
        console.log(`📦 Metadata value:`);
        console.log(JSON.stringify(tx.metadata, null, 2));
        
        // Try to parse if it's a string
        if (typeof tx.metadata === 'string') {
            try {
                const parsed = JSON.parse(tx.metadata);
                console.log(`\n✅ Parsed metadata:`);
                console.log(JSON.stringify(parsed, null, 2));
                
                if (parsed.onchain_signature) {
                    console.log(`\n🔗 Has signature: ${parsed.onchain_signature.substring(0, 30)}...`);
                } else {
                    console.log(`\n❌ No onchain_signature found`);
                }
            } catch (e) {
                console.log(`\n❌ Failed to parse: ${e.message}`);
            }
        } else if (tx.metadata && typeof tx.metadata === 'object') {
            if (tx.metadata.onchain_signature) {
                console.log(`\n🔗 Has signature: ${tx.metadata.onchain_signature.substring(0, 30)}...`);
            } else {
                console.log(`\n❌ No onchain_signature found`);
            }
        }
        console.log();
    }
}

checkBurnMetadata()
    .then(() => {
        console.log('✨ Done!');
        process.exit(0);
    })
    .catch(err => {
        console.error('💥 Error:', err);
        process.exit(1);
    });

