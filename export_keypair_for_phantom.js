// Export keypair for Phantom wallet import
// Converts keypair JSON to format suitable for Phantom

const fs = require('fs');
const path = require('path');
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

const KEYPAIR_PATH = path.join(__dirname, 'team-wallet-keypair.json');

try {
    // Load keypair
    const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf8'));
    const keypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
    
    console.log('🔑 KEYPAIR EXPORT FOR PHANTOM\n');
    console.log('📋 Информация:');
    console.log(`   Public Key: ${keypair.publicKey.toString()}`);
    console.log(`   Address: ${keypair.publicKey.toString()}\n`);
    
    // Convert to base58 (Phantom format)
    const secretKeyBase58 = bs58.encode(keypair.secretKey);
    
    console.log('🔐 Приватный ключ (Base58):');
    console.log(`   ${secretKeyBase58}\n`);
    
    console.log('📋 Инструкция для импорта в Phantom:');
    console.log('   1. Открой Phantom кошелек');
    console.log('   2. Settings → Add/Connect Wallet');
    console.log('   3. Import Private Key');
    console.log('   4. Вставь приватный ключ выше\n');
    
    console.log('⚠️ ВАЖНО:');
    console.log('   - НЕ делись этим ключом ни с кем!');
    console.log('   - Храни в безопасности!');
    console.log('   - Это дает полный доступ к кошельку!\n');
    
    // Save to file (optional, but secure)
    const exportPath = path.join(__dirname, 'team-wallet-private-key.txt');
    fs.writeFileSync(exportPath, secretKeyBase58, 'utf8');
    console.log(`✅ Приватный ключ сохранен в: ${exportPath}`);
    console.log('   (Удали этот файл после импорта в Phantom!)\n');
    
} catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
}

