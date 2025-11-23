/**
 * 📊 Analytics Module for Telegram Auth
 * 
 * Сбор статистики и аналитики по авторизованным пользователям
 */

// ============================================
// ANALYTICS CONFIG
// ============================================
const ANALYTICS_CONFIG = {
    SUPABASE_URL: 'https://zfrazyupameidxpjihrh.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU',
    TRACK_ENDPOINT: '/api/track', // Optional: your analytics endpoint
    ENABLE_TRACKING: true
};

// Initialize Supabase for analytics
const analyticsSupabase = window.supabase ? 
    window.supabase.createClient(ANALYTICS_CONFIG.SUPABASE_URL, ANALYTICS_CONFIG.SUPABASE_ANON_KEY) : null;

// ============================================
// TRACKING FUNCTIONS
// ============================================

/**
 * Track user action
 */
function trackAction(action, data = {}) {
    if (!ANALYTICS_CONFIG.ENABLE_TRACKING) return;
    
    if (!window.GotchiAuth || !window.GotchiAuth.isAuthenticated()) {
        // Track anonymous actions too
        trackAnonymousAction(action, data);
        return;
    }
    
    const state = window.GotchiAuth.getState();
    const trackingData = {
        telegram_id: state.telegramId,
        telegram_username: state.telegramUsername,
        auth_method: state.authMethod,
        action: action,
        data: data,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer
    };
    
    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('📊 Track:', trackingData);
    }
    
    // Send to analytics endpoint if available
    if (ANALYTICS_CONFIG.TRACK_ENDPOINT) {
        fetch(ANALYTICS_CONFIG.TRACK_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trackingData)
        }).catch(err => console.warn('Analytics tracking failed:', err));
    }
}

/**
 * Track anonymous action
 */
function trackAnonymousAction(action, data = {}) {
    const trackingData = {
        action: action,
        data: data,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        anonymous: true
    };
    
    if (ANALYTICS_CONFIG.TRACK_ENDPOINT) {
        fetch(ANALYTICS_CONFIG.TRACK_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trackingData)
        }).catch(err => console.warn('Analytics tracking failed:', err));
    }
}

/**
 * Update user's last_active timestamp
 */
async function updateLastActive() {
    if (!window.GotchiAuth || !window.GotchiAuth.isAuthenticated()) return;
    
    const telegramId = window.GotchiAuth.getTelegramId();
    if (!telegramId || !analyticsSupabase) return;
    
    try {
        await analyticsSupabase
            .from('leaderboard')
            .update({ last_active: new Date().toISOString() })
            .eq('telegram_id', telegramId);
    } catch (err) {
        console.warn('Failed to update last_active:', err);
    }
}

// ============================================
// STATISTICS FUNCTIONS
// ============================================

/**
 * Get user statistics
 */
async function getUserStats(telegramId) {
    if (!analyticsSupabase || !telegramId) return null;
    
    try {
        // Get user profile
        const { data: profile } = await analyticsSupabase
            .from('leaderboard')
            .select('*')
            .eq('telegram_id', telegramId)
            .single();
        
        if (!profile) return null;
        
        // Get NFT count
        const { count: nftCount } = await analyticsSupabase
            .from('user_nfts')
            .select('*', { count: 'exact', head: true })
            .eq('telegram_id', telegramId)
            .eq('is_active', true);
        
        // Get transaction count
        const { count: txCount } = await analyticsSupabase
            .from('transactions')
            .select('*', { count: 'exact', head: true })
            .eq('telegram_id', telegramId);
        
        return {
            profile: profile,
            nft_count: nftCount || 0,
            transaction_count: txCount || 0,
            has_wallet: !!profile.wallet_address,
            last_active: profile.last_active
        };
    } catch (err) {
        console.error('Failed to get user stats:', err);
        return null;
    }
}

/**
 * Get platform statistics
 */
async function getPlatformStats() {
    if (!analyticsSupabase) return null;
    
    try {
        // Total users
        const { count: totalUsers } = await analyticsSupabase
            .from('leaderboard')
            .select('*', { count: 'exact', head: true });
        
        // Active users (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count: activeUsers } = await analyticsSupabase
            .from('leaderboard')
            .select('*', { count: 'exact', head: true })
            .gte('last_active', sevenDaysAgo);
        
        // Users with wallet
        const { count: walletUsers } = await analyticsSupabase
            .from('leaderboard')
            .select('*', { count: 'exact', head: true })
            .not('wallet_address', 'is', null);
        
        // Total NFTs minted
        const { count: totalNFTs } = await analyticsSupabase
            .from('user_nfts')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);
        
        return {
            total_users: totalUsers || 0,
            active_users: activeUsers || 0,
            wallet_users: walletUsers || 0,
            total_nfts: totalNFTs || 0,
            conversion_rate: totalUsers > 0 ? ((walletUsers / totalUsers) * 100).toFixed(2) : 0
        };
    } catch (err) {
        console.error('Failed to get platform stats:', err);
        return null;
    }
}

/**
 * Get user segments
 */
async function getUserSegments() {
    if (!analyticsSupabase) return null;
    
    try {
        // Get all users with their data
        const { data: users } = await analyticsSupabase
            .from('leaderboard')
            .select('telegram_id, tama, wallet_address, last_active');
        
        if (!users) return null;
        
        const segments = {
            whales: users.filter(u => u.tama > 100000).length,
            regular: users.filter(u => u.tama > 1000 && u.tama <= 100000).length,
            newbies: users.filter(u => u.tama <= 1000).length,
            with_wallet: users.filter(u => u.wallet_address).length,
            active: users.filter(u => {
                if (!u.last_active) return false;
                const lastActive = new Date(u.last_active);
                const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return lastActive > sevenDaysAgo;
            }).length
        };
        
        return segments;
    } catch (err) {
        console.error('Failed to get user segments:', err);
        return null;
    }
}

// ============================================
// AUTO-TRACKING
// ============================================

// Track page view
trackAction('page_view', {
    page: window.location.pathname,
    query: window.location.search
});

// Track auth events
window.addEventListener('gotchiAuthReady', (e) => {
    const result = e.detail;
    trackAction('auth_ready', {
        success: result.success,
        method: result.method
    });
    
    // Update last_active
    if (result.success) {
        updateLastActive();
    }
});

// Track wallet connection
if (window.GotchiAuth) {
    const originalAuthViaWallet = window.GotchiAuth.authViaWallet;
    window.GotchiAuth.authViaWallet = async function() {
        const result = await originalAuthViaWallet.call(this);
        if (result.success) {
            trackAction('wallet_connected', {
                wallet: result.walletAddress
            });
            updateLastActive();
        }
        return result;
    };
}

// Update last_active every 5 minutes if authenticated
setInterval(() => {
    if (window.GotchiAuth && window.GotchiAuth.isAuthenticated()) {
        updateLastActive();
    }
}, 5 * 60 * 1000); // 5 minutes

// ============================================
// PUBLIC API
// ============================================

window.GotchiAnalytics = {
    track: trackAction,
    getUserStats: getUserStats,
    getPlatformStats: getPlatformStats,
    getUserSegments: getUserSegments,
    updateLastActive: updateLastActive
};

