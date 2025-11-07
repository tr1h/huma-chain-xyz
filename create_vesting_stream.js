// Create Vesting Stream using Streamflow SDK
// Standardniy variant: 4 goda, cliff 6 mesyatsev

const { StreamflowSolana, getBN } = require('@streamflow/stream');
const { Keypair, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Parametry vesting
const CLUSTER = 'devnet'; // Izmeni na 'mainnet' dlya production
const RPC_URL = CLUSTER === 'devnet' 
    ? 'https://api.devnet.solana.com'
    : 'https://api.mainnet-beta.solana.com';
const TOKEN_MINT = 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY'; // TAMA mint (devnet)
const TOKEN_DECIMALS = 9; // TAMA decimals
const TOTAL_AMOUNT = 200000000; // 200M TAMA
const RECIPIENT = 'AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR'; // Team wallet
const KEYPAIR_PATH = path.join(__dirname, 'team-wallet-keypair.json');

// Vychislenie vremeni
const now = Math.floor(Date.now() / 1000);
const FOUR_YEARS = 126144000; // 4 goda v sekundah
const SIX_MONTHS = 15552000; // 6 mesyatsev v sekundah
const DAY = 60 * 60 * 24; // 1 den v sekundah

// Dlya vesting s cliff: start = cliff (kogda nachinaetsya razblokirovka)
// No nam nuzhno chtoby razblokirovka nachalas cherez 6 mesyatsev
// Poetomu start = cliff = now + 6 mesyatsev
const startTime = now + SIX_MONTHS; // Nachalo razblokirovki (cherez 6 mesyatsev)
const cliffTime = startTime; // Cliff sovpadaet so start dlya vesting
const endTime = now + FOUR_YEARS; // Konec vesting (4 goda ot seychas)

// Vychislenie amountov
const totalAmount = getBN(TOTAL_AMOUNT, TOKEN_DECIMALS);
const cliffAmount = getBN(0, TOKEN_DECIMALS); // 0 na cliff (polnaya blokirovka)
const remainingAmount = totalAmount.sub(cliffAmount);
const vestingDuration = endTime - startTime; // Dlitelnost vesting posle cliff

// Proverka chto vestingDuration > 0
if (vestingDuration <= 0) {
    throw new Error(`Invalid vesting duration: ${vestingDuration}. End time must be after start time.`);
}

// Kolichestvo za sekundu (dlya linear unlock)
// Ispolzuem div s BN dlya bolshih chisel
const { BN } = require('bn.js');
const vestingDurationBN = new BN(vestingDuration);
const amountPerPeriod = vestingDuration > 0 
    ? remainingAmount.div(vestingDurationBN) 
    : getBN(0, TOKEN_DECIMALS);

async function createVestingStream() {
    try {
        console.log('🔒 VESTING SETUP - Standardniy variant');
        console.log('Srok: 4 goda, Cliff: 6 mesyatsev\n');

        // Proverka keypair
        if (!fs.existsSync(KEYPAIR_PATH)) {
            console.error(`❌ Keypair fayl ne nayden: ${KEYPAIR_PATH}`);
            console.error('Sozday keypair ili ukazhi pravilnyy put!');
            process.exit(1);
        }

        // Zagruzka keypair
        const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf8'));
        const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));

        // Inicializaciya Streamflow
        const streamflowClient = new StreamflowSolana.SolanaStreamClient(RPC_URL);

        console.log('📊 Parametry vesting:');
        console.log(`  Cluster: ${CLUSTER}`);
        console.log(`  RPC URL: ${RPC_URL}`);
        console.log(`  Token: ${TOKEN_MINT}`);
        console.log(`  Amount: ${TOTAL_AMOUNT} TAMA (200M)`);
        console.log(`  Recipient: ${RECIPIENT}`);
        console.log(`  Start time: ${new Date(startTime * 1000).toISOString()} (cherez 6 mesyatsev)`);
        console.log(`  End time: ${new Date(endTime * 1000).toISOString()} (+4 goda ot seychas)`);
        console.log(`  Cliff time: ${new Date(cliffTime * 1000).toISOString()} (sovpadaet so start)`);
        console.log(`  Cliff amount: 0 TAMA (polnaya blokirovka)`);
        console.log(`  Period: 1 sekunda (linear unlock)`);
        console.log(`  Cancelable: false\n`);

        // Sozdanie stream
        console.log('🚀 Sozdanie vesting stream...\n');

        const createStreamParams = {
            recipient: RECIPIENT,
            tokenId: TOKEN_MINT,
            start: startTime,
            amount: totalAmount,
            period: 1, // 1 sekunda dlya linear unlock
            cliff: startTime, // Cliff timestamp (dolzhen sovpadat s start dlya vesting)
            cliffAmount: cliffAmount, // 0 na cliff
            amountPerPeriod: amountPerPeriod, // Kolichestvo za sekundu
            name: 'Team Tokens Vesting - 4 years, 6 months cliff',
            canTopup: false,
            cancelableBySender: false,
            cancelableByRecipient: false,
            transferableBySender: false,
            transferableByRecipient: false,
            automaticWithdrawal: false,
        };

        // Proverka balansa sender
        const senderBalance = await streamflowClient.connection.getBalance(senderKeypair.publicKey);
        const senderBalanceSOL = senderBalance / 1e9;
        console.log(`💰 Sender balance: ${senderBalanceSOL.toFixed(6)} SOL`);
        
        // Streamflow trebuet:
        // - Streamflow fee: 0.0005 SOL (500000 lamports)
        // - Rent exemption для escrow: ~0.002 SOL
        // - Transaction fee: ~0.000005 SOL
        // - Minimum: ~0.003 SOL (рекомендуется 0.5-1 SOL)
        const minRequiredSOL = 0.003;
        
        if (senderBalanceSOL < minRequiredSOL) {
            console.error(`\n❌ Недостаточно SOL на sender wallet!`);
            console.error(`   Текущий баланс: ${senderBalanceSOL.toFixed(6)} SOL`);
            console.error(`   Минимум требуется: ${minRequiredSOL} SOL`);
            console.error(`   Рекомендуется: 0.5-1 SOL`);
            console.error(`\n📋 Решение:`);
            console.error(`   1. Пополни через faucet: https://faucet.solana.com/`);
            console.error(`   2. Адрес: ${senderKeypair.publicKey.toString()}`);
            console.error(`   3. Или переведи SOL с другого кошелька\n`);
            process.exit(1);
        }
        
        console.log(`✅ Баланс достаточен для создания vesting stream\n`);

        const solanaCreateParams = {
            sender: senderKeypair,
            isNative: false,
        };

        const { ixs, tx, metadata } = await streamflowClient.create(createStreamParams, solanaCreateParams);

        console.log('✅ Vesting stream sozdan uspeshno!');
        console.log(`\n📋 Stream ID: ${tx}`);
        console.log(`\n📊 Sleduyushchie shagi:`);
        console.log(`  1. Sohrani Stream ID: ${tx}`);
        console.log(`  2. Prover na Explorer: https://explorer.solana.com/address/${tx}?cluster=${CLUSTER}`);
        console.log(`  3. Opublikuy stream address dlya prozrachnosti`);
        console.log(`\n✅ Gotovo!`);

    } catch (error) {
        console.error('\n❌ Oshibka sozdaniya vesting stream:');
        console.error(error.message);
        
        // Dopolnitelnye detali dlya AccountNotFound
        if (error.message && error.message.includes('AccountNotFound')) {
            console.error('\n⚠️ Vozmozhnye prichiny:');
            console.error('  1. Team wallet ne imeet token account dlya TAMA');
            console.error('  2. Team wallet ne imeet dostatochno SOL dlya transaktsii');
            console.error('  3. Team wallet ne imeet TAMA tokenov');
            console.error('\n📋 Reshenie:');
            console.error('  1. Sozday token account: spl-token create-account ' + TOKEN_MINT);
            console.error('  2. Popolni team wallet SOL (minimum 0.1 SOL)');
            console.error('  3. Perevedi TAMA tokeny na team wallet');
        }
        
        if (error.stack) {
            console.error('\nStack trace:');
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Zapusk
createVestingStream();

