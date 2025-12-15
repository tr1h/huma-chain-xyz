/**
 * Web-based Referral System for Non-Telegram Users
 * Handles referral links and bonuses without Telegram bot
 */

const ReferralSystem = {
    /**
     * Check if user came from referral link
     */
    async checkReferralCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const referrerAddress = urlParams.get('ref');
        
        if (!referrerAddress) {
            // [cleaned]
            return null;
        }
        
        // [cleaned]
        
        // Save referrer for later (when user connects wallet)
        localStorage.setItem('pending_referrer', referrerAddress);
        
        return referrerAddress;
    },

    /**
     * Process referral bonus when new user connects wallet
     */
    async processReferralBonus(newUserWalletAddress) {
        const referrerAddress = localStorage.getItem('pending_referrer');
        
        if (!referrerAddress) {
            // [cleaned]
            return;
        }
        
        // Check if already processed
        const processedKey = `referral_processed_${newUserWalletAddress}`;
        if (localStorage.getItem(processedKey)) {
            // [cleaned]
            return;
        }
        
        // [cleaned]
        
        try {
            // Call API to process referral bonus
            const response = await fetch('https://api.solanatamagotchi.com/api/wallet-auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'process_referral',
                    referrer_wallet: referrerAddress,
                    new_user_wallet: newUserWalletAddress
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                // [cleaned]
                
                // Mark as processed
                localStorage.setItem(processedKey, 'true');
                localStorage.removeItem('pending_referrer');
                
                // Show notification
                this.showReferralSuccess();
            } else {
                console.error('вќЊ Failed to process referral bonus');
            }
        } catch (error) {
            console.error('вќЊ Referral bonus error:', error);
        }
    },

    /**
     * Get user's referral link
     */
    getReferralLink(walletAddress) {
        if (!walletAddress) {
            return null;
        }
        
        // Use short version of wallet address (first 8 chars)
        const shortAddress = walletAddress.substring(0, 8);
        return `https://solanatamagotchi.com/tamagotchi-game.html?ref=${walletAddress}`;
    },

    /**
     * Copy referral link to clipboard
     */
    async copyReferralLink(walletAddress) {
        const link = this.getReferralLink(walletAddress);
        
        if (!link) {
            alert('вќЊ Connect wallet first!');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(link);
            
            // Show success message
            this.showCopySuccess();
            
            // [cleaned]
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopyTextToClipboard(link);
        }
    },

    /**
     * Share referral link using Web Share API (mobile)
     */
    async shareReferralLink(walletAddress) {
        const link = this.getReferralLink(walletAddress);
        
        if (!link) {
            alert('вќЊ Connect wallet first!');
            return;
        }
        
        // Check if Web Share API is available
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Solana Tamagotchi',
                    text: 'рџђѕ Play Solana Tamagotchi and earn TAMA tokens! Join me and get bonus rewards!',
                    url: link
                });
                
                // [cleaned]
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('вќЊ Share failed:', error);
                    // Fallback to copy
                    this.copyReferralLink(walletAddress);
                }
            }
        } else {
            // Fallback to copy for desktop
            this.copyReferralLink(walletAddress);
        }
    },

    /**
     * Fallback copy method for older browsers
     */
    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (error) {
            alert('Failed to copy. Please copy manually: ' + text);
        }
        
        document.body.removeChild(textArea);
    },

    /**
     * Show copy success notification
     */
    showCopySuccess() {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.innerHTML = 'вњ… Link copied to clipboard!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 99999;
            animation: slideDown 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },

    /**
     * Show referral bonus success notification
     */
    showReferralSuccess() {
        const notification = document.createElement('div');
        notification.innerHTML = 'рџЋЃ Welcome bonus received! You and your friend got +1,000 TAMA!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 99999;
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    },

    /**
     * Update referral UI with user's link
     */
    updateReferralUI(walletAddress) {
        if (!walletAddress) return;
        
        const link = this.getReferralLink(walletAddress);
        
        // Update referral code display
        const codeDisplay = document.querySelector('.referral-code-display');
        if (codeDisplay) {
            codeDisplay.textContent = walletAddress.substring(0, 12) + '...';
        }
        
        // Update referral link display
        const linkDisplay = document.getElementById('referral-link-display');
        if (linkDisplay) {
            linkDisplay.value = link;
        }
        
        // [cleaned]
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for global use
window.ReferralSystem = ReferralSystem;

// Auto-check for referral code on page load
document.addEventListener('DOMContentLoaded', () => {
    ReferralSystem.checkReferralCode();
});

// [cleaned]


