/**
 * TAMA Mint Module
 * Handles minting NFTs using TAMA tokens
 */

const TAMAMint = {
    TAMA_COST: 5000,
    TAMA_BONUS: 500,
    SOL_COST: 0.1,
    SOL_BONUS: 10000,
    
    supabase: null,
    userId: null,
    userTAMA: 0,
    selectedMintType: null, // 'tama' or 'sol'
    
    async init() {
        console.log('💰 Initializing TAMA Mint...');
        
        // Get Supabase client
        if (window.supabase && window.SUPABASE_URL && window.SUPABASE_KEY) {
            this.supabase = window.supabase.createClient(
                window.SUPABASE_URL || 'https://zfrazyupameidxpjihrh.supabase.co',
                window.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'
            );
        }
        
        // Get user ID from URL params
        const urlParams = new URLSearchParams(window.location.search);
        this.userId = urlParams.get('user_id');
        this.userTAMA = parseInt(urlParams.get('tama')) || 0;
        
        console.log('💰 TAMA Mint initialized:', { userId: this.userId, tama: this.userTAMA });
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update button states
        this.updateButtonStates();
    },
    
    setupEventListeners() {
        const tamaMintBtn = document.getElementById('tama-mint-btn');
        const solMintBtn = document.getElementById('sol-mint-btn');
        
        if (tamaMintBtn) {
            tamaMintBtn.addEventListener('click', () => this.selectMintType('tama'));
        }
        
        if (solMintBtn) {
            solMintBtn.addEventListener('click', () => this.selectMintType('sol'));
        }
    },
    
    updateButtonStates() {
        const tamaMintBtn = document.getElementById('tama-mint-btn');
        
        // Check if user has enough TAMA
        if (tamaMintBtn) {
            if (this.userTAMA < this.TAMA_COST) {
                tamaMintBtn.style.opacity = '0.5';
                tamaMintBtn.style.cursor = 'not-allowed';
                tamaMintBtn.title = `Need ${this.TAMA_COST - this.userTAMA} more TAMA`;
            } else {
                tamaMintBtn.style.opacity = '1';
                tamaMintBtn.style.cursor = 'pointer';
                tamaMintBtn.title = 'Click to mint with TAMA';
            }
        }
    },
    
    selectMintType(type) {
        console.log('🎯 Mint type selected:', type);
        
        if (type === 'tama' && this.userTAMA < this.TAMA_COST) {
            alert(`❌ Not enough TAMA!\n\nYou have: ${this.userTAMA} TAMA\nNeed: ${this.TAMA_COST} TAMA\nMissing: ${this.TAMA_COST - this.userTAMA} TAMA\n\n💡 Play the game to earn more TAMA!`);
            return;
        }
        
        this.selectedMintType = type;
        
        // Update button styles
        const tamaMintBtn = document.getElementById('tama-mint-btn');
        const solMintBtn = document.getElementById('sol-mint-btn');
        
        if (type === 'tama') {
            tamaMintBtn.style.border = '3px solid #FFB703';
            solMintBtn.style.border = 'none';
            this.confirmTAMAMint();
        } else {
            solMintBtn.style.border = '3px solid #8AC926';
            tamaMintBtn.style.border = 'none';
            // Use Real SOL Mint
            this.handleSOLMint();
        }
    },
    
    async handleSOLMint() {
        try {
            console.log('💎 Starting Real SOL Mint flow...');
            
            // Check if Phantom wallet is installed
            if (!window.solana || !window.solana.isPhantom) {
                alert('❌ Phantom wallet not found!\n\nPlease install Phantom wallet:\nhttps://phantom.app/');
                return;
            }
            
            // Connect wallet
            const resp = await window.solana.connect();
            const wallet = window.solana;
            
            console.log('✅ Wallet connected:', resp.publicKey.toString());
            
            // Initialize Real SOL Mint
            if (!window.RealSOLMint) {
                alert('❌ Real SOL Mint module not loaded!');
                return;
            }
            
            await window.RealSOLMint.init(wallet);
            
            // Confirm mint
            const confirmed = confirm(
                `💎 PREMIUM SOL MINT\n\n` +
                `Cost: 0.1 SOL (~$15-20)\n` +
                `Wallet: ${resp.publicKey.toString().slice(0,4)}...${resp.publicKey.toString().slice(-4)}\n\n` +
                `You will receive:\n` +
                `• Random NFT Pet (Epic 60% / Legendary 40%)\n` +
                `• +10,000 TAMA bonus\n` +
                `• +75% to +100% earning boost\n\n` +
                `⚠️ This will send 0.1 SOL to treasury.\n\n` +
                `Proceed with SOL mint?`
            );
            
            if (!confirmed) {
                console.log('❌ User cancelled SOL mint');
                return;
            }
            
            // Execute mint
            console.log('🚀 Executing real SOL mint...');
            const result = await window.RealSOLMint.mintNFT(this.userId, '');
            
            if (result.success) {
                console.log('🎉 SOL mint successful!', result);
                
                // Show success modal
                this.showSuccessModal(
                    result.nftData.emoji,
                    result.nftData.pet_type,
                    result.nftData.rarity.toUpperCase(),
                    result.nftData.rarity === 'legendary' ? '🧡' : '💜'
                );
                
                // Show explorer link
                alert(
                    `🎉 NFT MINTED!\n\n` +
                    `${result.nftData.emoji} ${result.nftData.name}\n` +
                    `Rarity: ${result.nftData.rarity.toUpperCase()}\n` +
                    `Boost: +${result.nftData.attributes.boost}% TAMA\n\n` +
                    `✅ Transaction confirmed!\n` +
                    `View on Explorer:\n` +
                    `${result.solTransfer.explorer}\n\n` +
                    `💰 Received: +${result.tamaBonus} TAMA bonus!`
                );
            } else {
                throw new Error('Mint failed');
            }
            
        } catch (error) {
            console.error('❌ SOL mint failed:', error);
            alert(`❌ Mint failed!\n\n${error.message}\n\nPlease try again or contact support.`);
        }
    },
    
    async confirmTAMAMint() {
        const confirmed = confirm(
            `💰 TAMA MINT\n\n` +
            `Cost: ${this.TAMA_COST} TAMA\n` +
            `Your balance: ${this.userTAMA} TAMA\n` +
            `After mint: ${this.userTAMA - this.TAMA_COST} TAMA\n\n` +
            `You will receive:\n` +
            `• Random NFT Pet (Common 70% / Rare 30%)\n` +
            `• +${this.TAMA_BONUS} TAMA bonus\n` +
            `• Earn bonuses from NFT ownership\n\n` +
            `Proceed with TAMA mint?`
        );
        
        if (confirmed) {
            await this.executeTAMAMint();
        }
    },
    
    async executeTAMAMint() {
        console.log('💰 Executing TAMA mint...');
        
        try {
            // Show loading
            const tamaMintBtn = document.getElementById('tama-mint-btn');
            if (!tamaMintBtn) {
                alert('❌ Button not found!');
                return;
            }
            const originalHTML = tamaMintBtn.innerHTML;
            tamaMintBtn.innerHTML = '<div style="font-size: 16px;">⏳ Minting...</div>';
            tamaMintBtn.disabled = true;
            
            // 1. Generate random pet and rarity
            const petTypes = ['cat', 'dog', 'dragon', 'fox', 'bear', 'rabbit', 'panda', 'lion', 'unicorn', 'wolf'];
            const petEmojis = ['🐱', '🐶', '🐉', '🦊', '🐻', '🐰', '🐼', '🦁', '🦄', '🐺'];
            const randomIndex = Math.floor(Math.random() * petTypes.length);
            const petType = petTypes[randomIndex];
            const petEmoji = petEmojis[randomIndex];
            
            // Rarity: 70% Common, 30% Rare
            const rarityRoll = Math.random();
            const rarity = rarityRoll < 0.70 ? 'common' : 'rare';
            const rarityEmoji = rarity === 'common' ? '💚' : '💙';
            const rarityText = rarity === 'common' ? 'COMMON' : 'RARE';
            
            console.log('🎲 Generated:', { petType, rarity });
            
            // 2. Deduct TAMA from user balance (via API)
            const deductResponse = await fetch(`${window.TAMA_API_BASE || 'https://huma-chain-xyz-production.up.railway.app/api/tama'}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    telegram_id: this.userId,
                    amount: -(this.TAMA_COST - this.TAMA_BONUS), // Deduct cost but add bonus
                    reason: `nft_mint_${petType}_${rarity}`
                })
            });
            
            if (!deductResponse.ok) {
                throw new Error('Failed to deduct TAMA');
            }
            
            // 3. Save NFT to database
            const mintAddress = `TAMA-${this.userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('user_nfts')
                    .insert([{
                        telegram_id: this.userId,
                        wallet_address: `telegram_${this.userId}`,
                        mint_address: mintAddress,
                        pet_type: petType,
                        rarity: rarity,
                        cost_tama: this.TAMA_COST,
                        cost_sol: 0,
                        transaction_hash: `tama_mint_${Date.now()}`
                    }]);
                
                if (error) {
                    console.error('❌ Error saving NFT:', error);
                    throw new Error('Failed to save NFT');
                }
                
                console.log('✅ NFT saved to database:', data);
            }
            
            // 4. Show success modal
            this.showSuccessModal(petEmoji, petType, rarityText, rarityEmoji);
            
            // Reset button
            tamaMintBtn.innerHTML = originalHTML;
            tamaMintBtn.disabled = false;
            
        } catch (error) {
            console.error('❌ TAMA mint failed:', error);
            alert('❌ Mint failed! Please try again.');
            
            // Reset button
            const tamaMintBtn = document.getElementById('tama-mint-btn');
            if (tamaMintBtn) {
                tamaMintBtn.innerHTML = originalHTML;
                tamaMintBtn.disabled = false;
            }
        }
    },
    
    showSuccessModal(petEmoji, petType, rarityText, rarityEmoji) {
        const modal = document.getElementById('success-modal');
        const mintedPet = document.getElementById('minted-pet');
        const mintedRarity = document.getElementById('minted-rarity');
        
        if (modal && mintedPet && mintedRarity) {
            mintedPet.textContent = petEmoji;
            mintedRarity.textContent = `${rarityEmoji} ${rarityText}`;
            mintedRarity.style.color = rarityText === 'COMMON' ? '#8AC926' : '#4A90E2';
            
            modal.classList.remove('hidden');
            
            console.log('🎉 Success modal shown:', { petEmoji, petType, rarityText });
        }
    }
};

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TAMAMint.init());
} else {
    TAMAMint.init();
}

// Export for global access
window.TAMAMint = TAMAMint;

console.log('✅ TAMA Mint module loaded');

