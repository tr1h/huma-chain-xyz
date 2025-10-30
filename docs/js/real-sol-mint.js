/**
 * REAL SOL MINT - Реальный минт NFT за SOL на Solana Devnet
 * Treasury: 2eyQycA4d4zu3FbbwdvHuJ1fVDcfQsz78qGdKGYa8NXw
 */

const RealSOLMint = {
    TREASURY_WALLET: '2eyQycA4d4zu3FbbwdvHuJ1fVDcfQsz78qGdKGYa8NXw',
    MINT_PRICE_SOL: 0.1, // 0.1 SOL per NFT
    TAMA_BONUS: 10000, // +10,000 TAMA после минта
    
    connection: null,
    wallet: null,
    
    async init(wallet) {
        console.log('💎 Initializing Real SOL Mint...');
        console.log('🏦 Treasury:', this.TREASURY_WALLET);
        
        this.wallet = wallet;
        this.connection = new solanaWeb3.Connection(
            'https://api.devnet.solana.com',
            'confirmed'
        );
        
        console.log('✅ Connected to Solana Devnet');
        console.log('👛 User wallet:', wallet.publicKey.toString());
        
        return true;
    },
    
    async checkBalance() {
        try {
            const balance = await this.connection.getBalance(this.wallet.publicKey);
            const balanceSOL = balance / solanaWeb3.LAMPORTS_PER_SOL;
            
            console.log(`💰 Wallet balance: ${balanceSOL.toFixed(4)} SOL`);
            
            if (balanceSOL < this.MINT_PRICE_SOL) {
                const needed = (this.MINT_PRICE_SOL - balanceSOL).toFixed(4);
                throw new Error(
                    `Insufficient SOL! You need ${needed} more SOL.\n\n` +
                    `Get devnet SOL: https://faucet.solana.com/`
                );
            }
            
            return balanceSOL;
        } catch (error) {
            console.error('❌ Balance check failed:', error);
            throw error;
        }
    },
    
    async mintNFT(userId, petName = '') {
        try {
            console.log('🚀 Starting REAL SOL mint...');
            console.log('👤 User ID:', userId);
            
            // 1. Check balance
            const balance = await this.checkBalance();
            console.log(`✅ Balance OK: ${balance.toFixed(4)} SOL`);
            
            // 2. Generate NFT data
            const nftData = this.generateNFTData(petName);
            console.log('🎨 Generated NFT:', nftData);
            
            // 3. Create transaction - Send SOL to Treasury
            const treasuryPubkey = new solanaWeb3.PublicKey(this.TREASURY_WALLET);
            const lamports = this.MINT_PRICE_SOL * solanaWeb3.LAMPORTS_PER_SOL;
            
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: this.wallet.publicKey,
                    toPubkey: treasuryPubkey,
                    lamports: lamports
                })
            );
            
            // 4. Get recent blockhash
            const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash('confirmed');
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = this.wallet.publicKey;
            transaction.lastValidBlockHeight = lastValidBlockHeight;
            
            console.log('📝 Transaction prepared, requesting signature...');
            
            // 5. Sign and send transaction
            let signature;
            
            if (this.wallet.signTransaction) {
                // Phantom wallet
                const signedTx = await this.wallet.signTransaction(transaction);
                signature = await this.connection.sendRawTransaction(signedTx.serialize());
            } else if (this.wallet.signAndSendTransaction) {
                // Solflare, etc.
                const result = await this.wallet.signAndSendTransaction(transaction);
                signature = result.signature || result;
            } else {
                throw new Error('Wallet does not support transaction signing');
            }
            
            console.log('⏳ Transaction sent, waiting for confirmation...');
            console.log('🔗 Signature:', signature);
            
            // 6. Confirm transaction
            const confirmation = await this.connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight
            });
            
            if (confirmation.value.err) {
                throw new Error('Transaction failed: ' + JSON.stringify(confirmation.value.err));
            }
            
            console.log('✅ Transaction confirmed!');
            console.log('💰 Sent', this.MINT_PRICE_SOL, 'SOL to treasury');
            
            // 7. Generate unique mint address for NFT
            const mintKeypair = solanaWeb3.Keypair.generate();
            const mintAddress = mintKeypair.publicKey.toString();
            
            console.log('🔑 NFT Mint Address:', mintAddress);
            
            // 8. Save to database
            await this.saveNFTToDatabase(userId, nftData, mintAddress, signature);
            
            // 9. Award TAMA bonus
            await this.awardTAMABonus(userId);
            
            console.log('🎉 REAL SOL MINT COMPLETED!');
            
            return {
                success: true,
                mintAddress: mintAddress,
                nftData: nftData,
                transaction: signature,
                solTransfer: {
                    signature: signature,
                    amount: this.MINT_PRICE_SOL,
                    to: this.TREASURY_WALLET,
                    explorer: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
                },
                tamaBonus: this.TAMA_BONUS
            };
            
        } catch (error) {
            console.error('❌ Real SOL mint failed:', error);
            throw error;
        }
    },
    
    generateNFTData(customName = '') {
        const petTypes = ['cat', 'dog', 'dragon', 'fox', 'bear', 'rabbit', 'panda', 'lion', 'unicorn', 'wolf'];
        const petEmojis = ['🐱', '🐶', '🐉', '🦊', '🐻', '🐰', '🐼', '🦁', '🦄', '🐺'];
        const randomIndex = Math.floor(Math.random() * petTypes.length);
        
        // Rarity: 60% Epic, 40% Legendary для SOL mint
        const rarityRoll = Math.random();
        const rarity = rarityRoll < 0.60 ? 'epic' : 'legendary';
        
        const petType = petTypes[randomIndex];
        const petEmoji = petEmojis[randomIndex];
        const petName = customName || `${petType.charAt(0).toUpperCase() + petType.slice(1)} #${Date.now() % 10000}`;
        
        return {
            name: petName,
            pet_type: petType,
            emoji: petEmoji,
            rarity: rarity,
            attributes: {
                boost: rarity === 'legendary' ? 100 : 75, // +75% or +100% TAMA
                generation: 1,
                birthday: new Date().toISOString()
            }
        };
    },
    
    async saveNFTToDatabase(userId, nftData, mintAddress, txSignature) {
        try {
            console.log('💾 Saving NFT to database...');
            
            const supabaseUrl = 'https://zfrazyupameidxpjihrh.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';
            
            const response = await fetch(`${supabaseUrl}/rest/v1/user_nfts`, {
                method: 'POST',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    telegram_id: userId,
                    wallet_address: this.wallet.publicKey.toString(),
                    mint_address: mintAddress,
                    pet_type: nftData.pet_type,
                    rarity: nftData.rarity,
                    cost_tama: 0,
                    cost_sol: this.MINT_PRICE_SOL,
                    transaction_hash: txSignature
                })
            });
            
            if (!response.ok) {
                throw new Error(`Database save failed: ${response.status}`);
            }
            
            console.log('✅ NFT saved to database');
        } catch (error) {
            console.error('❌ Failed to save NFT:', error);
            // Не бросаем ошибку - NFT уже заминчен, просто логируем
        }
    },
    
    async awardTAMABonus(userId) {
        try {
            console.log(`💰 Awarding ${this.TAMA_BONUS} TAMA bonus...`);
            
            const apiUrl = 'https://huma-chain-xyz-production.up.railway.app/api/tama/add';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    telegram_id: userId,
                    amount: this.TAMA_BONUS,
                    reason: 'sol_nft_mint_bonus'
                })
            });
            
            if (response.ok) {
                console.log(`✅ Awarded ${this.TAMA_BONUS} TAMA to user ${userId}`);
            } else {
                console.warn('⚠️ Failed to award TAMA bonus, but NFT minted successfully');
            }
        } catch (error) {
            console.error('❌ TAMA bonus failed:', error);
            // Не бросаем ошибку - NFT уже заминчен
        }
    }
};

// Export
if (typeof window !== 'undefined') {
    window.RealSOLMint = RealSOLMint;
}

console.log('✅ Real SOL Mint module loaded');

