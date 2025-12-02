/**
 * 📊 DappRadar Metrics Tracker
 * 
 * Tracks key metrics for DappRadar:
 * - UAW (Unique Active Wallets) - unique wallets that interacted in last 24h
 * - Transactions - total transactions count
 * - Volume - trading volume (NFT mints, withdrawals)
 * 
 * This data can be sent to DappRadar API or displayed in admin panel
 */

const DAPPRADAR_TRACKER = {
    // Track wallet activity
    trackWalletActivity: function(walletAddress) {
        if (!walletAddress) return;
        
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const key = `dappradar_uaw_${today}`;
        
        // Get existing set from localStorage
        let uawSet = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Add wallet if not exists
        if (!uawSet.includes(walletAddress)) {
            uawSet.push(walletAddress);
            localStorage.setItem(key, JSON.stringify(uawSet));
            
            // Also track in sessionStorage for current session
            const sessionKey = 'dappradar_uaw_session';
            let sessionSet = JSON.parse(sessionStorage.getItem(sessionKey) || '[]');
            if (!sessionSet.includes(walletAddress)) {
                sessionSet.push(walletAddress);
                sessionStorage.setItem(sessionKey, JSON.stringify(sessionSet));
            }
        }
    },
    
    // Track transaction
    trackTransaction: function(type, amount, walletAddress) {
        const today = new Date().toISOString().split('T')[0];
        const key = `dappradar_txs_${today}`;
        
        let txs = JSON.parse(localStorage.getItem(key) || '[]');
        txs.push({
            type: type, // 'mint', 'withdraw', 'claim', 'transfer'
            amount: amount,
            wallet: walletAddress,
            timestamp: Date.now()
        });
        
        localStorage.setItem(key, JSON.stringify(txs));
    },
    
    // Get UAW for today
    getTodayUAW: function() {
        const today = new Date().toISOString().split('T')[0];
        const key = `dappradar_uaw_${today}`;
        const uawSet = JSON.parse(localStorage.getItem(key) || '[]');
        return uawSet.length;
    },
    
    // Get transactions count for today
    getTodayTransactions: function() {
        const today = new Date().toISOString().split('T')[0];
        const key = `dappradar_txs_${today}`;
        const txs = JSON.parse(localStorage.getItem(key) || '[]');
        return txs.length;
    },
    
    // Get volume for today (in TAMA or SOL)
    getTodayVolume: function(currency = 'TAMA') {
        const today = new Date().toISOString().split('T')[0];
        const key = `dappradar_txs_${today}`;
        const txs = JSON.parse(localStorage.getItem(key) || '[]');
        
        return txs.reduce((sum, tx) => {
            if (tx.type === 'mint' || tx.type === 'withdraw') {
                return sum + (parseFloat(tx.amount) || 0);
            }
            return sum;
        }, 0);
    },
    
    // Get all metrics for API
    getMetrics: function() {
        return {
            uaw_24h: this.getTodayUAW(),
            transactions_24h: this.getTodayTransactions(),
            volume_24h_tama: this.getTodayVolume('TAMA'),
            volume_24h_sol: this.getTodayVolume('SOL'),
            timestamp: Date.now()
        };
    }
};

// Auto-track wallet connection
if (window.WALLET_ADDRESS) {
    DAPPRADAR_TRACKER.trackWalletActivity(window.WALLET_ADDRESS);
}

// Track when wallet connects
window.addEventListener('walletConnected', (e) => {
    if (e.detail && e.detail.walletAddress) {
        DAPPRADAR_TRACKER.trackWalletActivity(e.detail.walletAddress);
    }
});

// Export
window.DappRadarTracker = DAPPRADAR_TRACKER;

