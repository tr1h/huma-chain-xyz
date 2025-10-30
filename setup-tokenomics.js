/**
 * SETUP TOKENOMICS - Создание кошельков и распределение TAMA
 */

const fs = require('fs');
const solanaWeb3 = require('@solana/web3.js');

console.log('🚀 Starting Tokenomics Setup...\n');

// 1. Создать кошельки
console.log('📁 Creating wallets...\n');

// P2E Pool (400M TAMA)
const p2ePool = solanaWeb3.Keypair.generate();
fs.writeFileSync('p2e-pool-keypair.json', JSON.stringify(Array.from(p2ePool.secretKey)));
console.log('✅ P2E Pool Wallet:', p2ePool.publicKey.toString());

// Team Wallet (200M TAMA, locked 1 year)
const teamWallet = solanaWeb3.Keypair.generate();
fs.writeFileSync('team-wallet-keypair.json', JSON.stringify(Array.from(teamWallet.secretKey)));
console.log('✅ Team Wallet:', teamWallet.publicKey.toString());

// Marketing Wallet (150M TAMA)
const marketingWallet = solanaWeb3.Keypair.generate();
fs.writeFileSync('marketing-wallet-keypair.json', JSON.stringify(Array.from(marketingWallet.secretKey)));
console.log('✅ Marketing Wallet:', marketingWallet.publicKey.toString());

// Liquidity Pool (100M TAMA)
const liquidityPool = solanaWeb3.Keypair.generate();
fs.writeFileSync('liquidity-pool-keypair.json', JSON.stringify(Array.from(liquidityPool.secretKey)));
console.log('✅ Liquidity Pool Wallet:', liquidityPool.publicKey.toString());

// Community Wallet (100M TAMA)
const communityWallet = solanaWeb3.Keypair.generate();
fs.writeFileSync('community-wallet-keypair.json', JSON.stringify(Array.from(communityWallet.secretKey)));
console.log('✅ Community Wallet:', communityWallet.publicKey.toString());

// Reserve Wallet (50M TAMA)
const reserveWallet = solanaWeb3.Keypair.generate();
fs.writeFileSync('reserve-wallet-keypair.json', JSON.stringify(Array.from(reserveWallet.secretKey)));
console.log('✅ Reserve Wallet:', reserveWallet.publicKey.toString());

console.log('\n📊 Tokenomics Summary:');
console.log('─────────────────────────────────────────────────');
console.log('Total Supply: 1,000,000,000 TAMA');
console.log('');
console.log('Distribution:');
console.log('  40% (400M) → P2E Pool');
console.log('  20% (200M) → Team (locked 1 year)');
console.log('  15% (150M) → Marketing');
console.log('  10% (100M) → Liquidity Pool');
console.log('  10% (100M) → Community Rewards');
console.log('   5% (50M)  → Reserve Fund');
console.log('─────────────────────────────────────────────────');

// Создать summary файл
const summary = {
    token: {
        name: 'Solana Tamagotchi',
        symbol: 'TAMA',
        mint: 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY',
        totalSupply: 1000000000,
        decimals: 9,
        network: 'devnet'
    },
    wallets: {
        p2ePool: {
            address: p2ePool.publicKey.toString(),
            allocation: 400000000,
            percentage: 40,
            description: 'Play-to-Earn rewards pool'
        },
        team: {
            address: teamWallet.publicKey.toString(),
            allocation: 200000000,
            percentage: 20,
            description: 'Team allocation (locked 1 year)',
            vesting: {
                cliff: '1 year',
                duration: '2 years',
                unlockSchedule: 'Linear after cliff'
            }
        },
        marketing: {
            address: marketingWallet.publicKey.toString(),
            allocation: 150000000,
            percentage: 15,
            description: 'Marketing & partnerships'
        },
        liquidity: {
            address: liquidityPool.publicKey.toString(),
            allocation: 100000000,
            percentage: 10,
            description: 'DEX liquidity (Jupiter, Raydium)'
        },
        community: {
            address: communityWallet.publicKey.toString(),
            allocation: 100000000,
            percentage: 10,
            description: 'Community rewards & airdrops'
        },
        reserve: {
            address: reserveWallet.publicKey.toString(),
            allocation: 50000000,
            percentage: 5,
            description: 'Reserve fund for future use'
        }
    },
    treasury: {
        address: '2eyQycA4d4zu3FbbwdvHuJ1fVDcfQsz78qGdKGYa8NXw',
        description: 'NFT mint revenue (SOL)'
    }
};

fs.writeFileSync('tokenomics.json', JSON.stringify(summary, null, 2));
console.log('\n✅ Tokenomics saved to tokenomics.json');

console.log('\n🔑 Next Steps:');
console.log('1. Add devnet SOL to P2E Pool wallet (for gas fees)');
console.log('   solana airdrop 2 ' + p2ePool.publicKey.toString() + ' --url devnet');
console.log('');
console.log('2. Mint TAMA tokens to each wallet (requires Mint Authority):');
console.log('   See: distribute-tokens.sh');
console.log('');
console.log('3. Setup Team Wallet vesting (lock for 1 year)');
console.log('   See: setup-vesting.js');
console.log('');
console.log('⚠️  IMPORTANT: Keep all *-keypair.json files PRIVATE!');
console.log('   Add them to .gitignore immediately!');

