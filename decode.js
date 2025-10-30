const fs = require('fs');
const solanaWeb3 = require('@solana/web3.js');

const keypairData = JSON.parse(fs.readFileSync('tama-mint-keypair.json'));
const keypair = solanaWeb3.Keypair.fromSecretKey(Uint8Array.from(keypairData));

console.log('🔑 Public Key:', keypair.publicKey.toString());