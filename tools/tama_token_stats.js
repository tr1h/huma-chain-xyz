/**
 * TAMA Token Statistics Script
 * Получает полную статистику TAMA токенов из базы данных
 */

const fetch = require('node-fetch');

// Configuration
const SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';
const TAMA_MINT_ADDRESS = 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY';
const TOTAL_SUPPLY = 1000000000; // 1 billion TAMA

async function getTamaStats() {
    console.log('🔍 Fetching TAMA Token Statistics...\n');
    
    try {
        // Get all players with TAMA balances
        const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=tama.desc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const players = await response.json();
        
        // Calculate statistics
        const stats = calculateStats(players);
        
        // Display results
        displayStats(stats, players);
        
        return stats;
        
    } catch (error) {
        console.error('❌ Error fetching TAMA stats:', error.message);
        return null;
    }
}

function calculateStats(players) {
    const totalPlayers = players.length;
    const totalTamaInCirculation = players.reduce((sum, player) => sum + (player.tama || 0), 0);
    const avgTamaPerPlayer = totalPlayers > 0 ? Math.round(totalTamaInCirculation / totalPlayers) : 0;
    const topPlayerTama = players.length > 0 ? (players[0].tama || 0) : 0;
    
    // Distribution analysis
    const distribution = {
        zero: players.filter(p => (p.tama || 0) === 0).length,
        low: players.filter(p => (p.tama || 0) > 0 && (p.tama || 0) < 1000).length,
        medium: players.filter(p => (p.tama || 0) >= 1000 && (p.tama || 0) < 10000).length,
        high: players.filter(p => (p.tama || 0) >= 10000 && (p.tama || 0) < 100000).length,
        whale: players.filter(p => (p.tama || 0) >= 100000).length
    };
    
    // User type analysis
    const telegramUsers = players.filter(p => p.telegram_id).length;
    const walletUsers = players.filter(p => p.wallet_address && !p.telegram_id).length;
    
    // Top players
    const topPlayers = players.slice(0, 10).map((player, index) => ({
        rank: index + 1,
        username: player.telegram_username || player.wallet_address?.substring(0, 8) + '...' || 'Unknown',
        type: player.telegram_id ? 'Telegram' : 'Wallet',
        tama: player.tama || 0,
        level: player.level || 1,
        xp: player.xp || 0
    }));
    
    return {
        totalSupply: TOTAL_SUPPLY,
        circulatingSupply: totalTamaInCirculation,
        totalPlayers,
        avgTamaPerPlayer,
        topPlayerTama,
        distribution,
        telegramUsers,
        walletUsers,
        topPlayers,
        mintAddress: TAMA_MINT_ADDRESS
    };
}

function displayStats(stats, players) {
    console.log('💰 TAMA TOKEN STATISTICS');
    console.log('=' .repeat(50));
    
    console.log(`\n📊 SUPPLY INFORMATION:`);
    console.log(`   Total Supply: ${formatTama(stats.totalSupply)} TAMA`);
    console.log(`   Circulating: ${formatTama(stats.circulatingSupply)} TAMA`);
    console.log(`   In Reserve: ${formatTama(stats.totalSupply - stats.circulatingSupply)} TAMA`);
    console.log(`   Circulation %: ${((stats.circulatingSupply / stats.totalSupply) * 100).toFixed(2)}%`);
    
    console.log(`\n👥 PLAYER STATISTICS:`);
    console.log(`   Total Players: ${stats.totalPlayers.toLocaleString()}`);
    console.log(`   Telegram Users: ${stats.telegramUsers.toLocaleString()}`);
    console.log(`   Wallet Users: ${stats.walletUsers.toLocaleString()}`);
    console.log(`   Average TAMA/Player: ${formatTama(stats.avgTamaPerPlayer)}`);
    console.log(`   Top Player TAMA: ${formatTama(stats.topPlayerTama)}`);
    
    console.log(`\n📈 DISTRIBUTION ANALYSIS:`);
    console.log(`   Zero TAMA: ${stats.distribution.zero} players (${((stats.distribution.zero / stats.totalPlayers) * 100).toFixed(1)}%)`);
    console.log(`   Low (1-999): ${stats.distribution.low} players (${((stats.distribution.low / stats.totalPlayers) * 100).toFixed(1)}%)`);
    console.log(`   Medium (1K-9.9K): ${stats.distribution.medium} players (${((stats.distribution.medium / stats.totalPlayers) * 100).toFixed(1)}%)`);
    console.log(`   High (10K-99.9K): ${stats.distribution.high} players (${((stats.distribution.high / stats.totalPlayers) * 100).toFixed(1)}%)`);
    console.log(`   Whales (100K+): ${stats.distribution.whale} players (${((stats.distribution.whale / stats.totalPlayers) * 100).toFixed(1)}%)`);
    
    console.log(`\n🏆 TOP 10 PLAYERS:`);
    stats.topPlayers.forEach(player => {
        console.log(`   #${player.rank.toString().padStart(2)} ${player.username.padEnd(20)} ${formatTama(player.tama).padStart(8)} TAMA (Lv.${player.level})`);
    });
    
    console.log(`\n🔗 TOKEN INFORMATION:`);
    console.log(`   Mint Address: ${stats.mintAddress}`);
    console.log(`   Network: Solana Devnet`);
    console.log(`   Token Type: SPL Token`);
    
    console.log(`\n💡 ECONOMIC INSIGHTS:`);
    if (stats.circulatingSupply < stats.totalSupply * 0.01) {
        console.log(`   🚀 Early Stage: Less than 1% of supply in circulation`);
    } else if (stats.circulatingSupply < stats.totalSupply * 0.1) {
        console.log(`   📈 Growth Stage: ${((stats.circulatingSupply / stats.totalSupply) * 100).toFixed(1)}% of supply in circulation`);
    } else {
        console.log(`   🎯 Mature Stage: ${((stats.circulatingSupply / stats.totalSupply) * 100).toFixed(1)}% of supply in circulation`);
    }
    
    if (stats.distribution.whale > 0) {
        console.log(`   🐋 Whale Alert: ${stats.distribution.whale} players with 100K+ TAMA`);
    }
    
    if (stats.avgTamaPerPlayer > 10000) {
        console.log(`   💰 High Value: Average player has ${formatTama(stats.avgTamaPerPlayer)} TAMA`);
    } else if (stats.avgTamaPerPlayer > 1000) {
        console.log(`   💎 Good Value: Average player has ${formatTama(stats.avgTamaPerPlayer)} TAMA`);
    } else {
        console.log(`   🌱 Growing: Average player has ${formatTama(stats.avgTamaPerPlayer)} TAMA`);
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ TAMA Token Statistics Complete!');
}

function formatTama(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'K';
    } else {
        return amount.toLocaleString();
    }
}

// Run the script
if (require.main === module) {
    getTamaStats().then(stats => {
        if (stats) {
            console.log('\n🎉 Statistics fetched successfully!');
        } else {
            console.log('\n❌ Failed to fetch statistics');
            process.exit(1);
        }
    });
}

module.exports = { getTamaStats, calculateStats, formatTama };
