/**
 * 🔐 Unified Authentication System for Solana Tamagotchi
 * 
 * Handles authentication across all pages:
 * 1. Telegram WebApp (from bot)
 * 2. Telegram Login Widget (direct access)
 * 3. Wallet connection (Phantom)
 * 4. Session management
 * 5. Data synchronization
 */

// ============================================
// CONFIG
// ============================================
const AUTH_CONFIG = {
    SUPABASE_URL: 'https://zfrazyupameidxpjihrh.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU',
    TELEGRAM_BOT_USERNAME: 'GotchiGameBot',
    SESSION_KEY: 'gotchi_auth_session',
    SESSION_EXPIRY: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Initialize Supabase
const supabase = window.supabase ? window.supabase.createClient(AUTH_CONFIG.SUPABASE_URL, AUTH_CONFIG.SUPABASE_ANON_KEY) : null;

// ============================================
// AUTH STATE
// ============================================
let authState = {
    isAuthenticated: false,
    telegramId: null,
    telegramUsername: null,
    telegramFirstName: null,
    walletAddress: null,
    userProfile: null,
    authMethod: null, // 'telegram_webapp', 'telegram_widget', 'wallet'
    sessionExpiry: null
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get Telegram User ID from various sources
 */
function getTelegramUserId() {
    // 1. Try Telegram WebApp API (from bot)
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user && user.id) {
            return user.id.toString();
        }
    }
    
    // 2. Try URL parameter (from bot navigation)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id') || urlParams.get('tg_id');
    if (userId) {
        return userId.toString();
    }
    
    // 3. Try saved session
    const session = getSession();
    if (session && session.telegramId) {
        return session.telegramId.toString();
    }
    
    return null;
}

/**
 * Get Telegram User Info from WebApp
 */
function getTelegramUserInfo() {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            return {
                id: user.id.toString(),
                username: user.username || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                photo_url: user.photo_url || ''
            };
        }
    }
    return null;
}

/**
 * Check if running in Telegram WebApp
 */
function isTelegramWebApp() {
    return !!(window.Telegram && window.Telegram.WebApp);
}

/**
 * Save session to localStorage
 */
function saveSession() {
    const session = {
        telegramId: authState.telegramId,
        telegramUsername: authState.telegramUsername,
        telegramFirstName: authState.telegramFirstName,
        walletAddress: authState.walletAddress,
        authMethod: authState.authMethod,
        expiry: Date.now() + AUTH_CONFIG.SESSION_EXPIRY
    };
    
    try {
        localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
        authState.sessionExpiry = session.expiry;
    } catch (e) {
        console.warn('Failed to save session:', e);
    }
}

/**
 * Get session from localStorage
 */
function getSession() {
    try {
        const sessionStr = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
        if (!sessionStr) return null;
        
        const session = JSON.parse(sessionStr);
        
        // Check expiry
        if (session.expiry && Date.now() > session.expiry) {
            clearSession();
            return null;
        }
        
        return session;
    } catch (e) {
        console.warn('Failed to get session:', e);
        return null;
    }
}

/**
 * Clear session
 */
function clearSession() {
    try {
        localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
        authState = {
            isAuthenticated: false,
            telegramId: null,
            telegramUsername: null,
            telegramFirstName: null,
            walletAddress: null,
            userProfile: null,
            authMethod: null,
            sessionExpiry: null
        };
    } catch (e) {
        console.warn('Failed to clear session:', e);
    }
}

// ============================================
// AUTHENTICATION METHODS
// ============================================

/**
 * Authenticate via Telegram WebApp (from bot)
 */
async function authViaTelegramWebApp() {
    const userInfo = getTelegramUserInfo();
    if (!userInfo) {
        return { success: false, error: 'No Telegram WebApp data' };
    }
    
    try {
        authState.telegramId = userInfo.id;
        authState.telegramUsername = userInfo.username;
        authState.telegramFirstName = userInfo.first_name;
        authState.authMethod = 'telegram_webapp';
        
        // Load user profile from database
        const profile = await loadUserProfile(authState.telegramId);
        if (profile) {
            authState.userProfile = profile;
            authState.walletAddress = profile.wallet_address || null;
        }
        
        authState.isAuthenticated = true;
        saveSession();
        
        return { success: true, user: userInfo, profile: authState.userProfile };
    } catch (error) {
        console.error('Telegram WebApp auth error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Authenticate via Telegram Login Widget
 */
async function authViaTelegramWidget(user) {
    if (!user || !user.id) {
        return { success: false, error: 'Invalid Telegram user data' };
    }
    
    try {
        authState.telegramId = user.id.toString();
        authState.telegramUsername = user.username || '';
        authState.telegramFirstName = user.first_name || '';
        authState.authMethod = 'telegram_widget';
        
        // Load user profile from database
        const profile = await loadUserProfile(authState.telegramId);
        if (profile) {
            authState.userProfile = profile;
            authState.walletAddress = profile.wallet_address || null;
        }
        
        authState.isAuthenticated = true;
        saveSession();
        
        return { success: true, user: user, profile: authState.userProfile };
    } catch (error) {
        console.error('Telegram Widget auth error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Authenticate via Wallet (Phantom)
 */
async function authViaWallet() {
    if (!window.solana || !window.solana.isPhantom) {
        return { success: false, error: 'Phantom wallet not found' };
    }
    
    try {
        const resp = await window.solana.connect();
        const walletAddress = resp.publicKey.toString();
        authState.walletAddress = walletAddress;
        
        // Try to find linked Telegram account
        if (supabase) {
            const { data: linkedUser } = await supabase
                .from('leaderboard')
                .select('telegram_id, telegram_username, telegram_first_name')
                .eq('wallet_address', walletAddress)
                .single();
            
            if (linkedUser && linkedUser.telegram_id) {
                authState.telegramId = linkedUser.telegram_id.toString();
                authState.telegramUsername = linkedUser.telegram_username || '';
                authState.telegramFirstName = linkedUser.telegram_first_name || '';
                authState.authMethod = 'wallet_linked';
                
                const profile = await loadUserProfile(authState.telegramId);
                if (profile) {
                    authState.userProfile = profile;
                }
            } else {
                authState.authMethod = 'wallet_only';
            }
        }
        
        authState.isAuthenticated = true;
        saveSession();
        
        return { success: true, walletAddress: walletAddress };
    } catch (error) {
        console.error('Wallet auth error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Load user profile from database
 */
async function loadUserProfile(telegramId) {
    if (!supabase || !telegramId) return null;
    
    try {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('telegram_id', telegramId)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.warn('Profile load error:', error);
            return null;
        }
        
        return data || null;
    } catch (error) {
        console.error('Failed to load profile:', error);
        return null;
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize authentication system
 * Tries all available methods in priority order
 */
async function initAuth() {
    console.log('🔐 Initializing authentication...');
    
    // Priority 1: Telegram WebApp (from bot)
    if (isTelegramWebApp()) {
        const webAppUser = getTelegramUserInfo();
        if (webAppUser) {
            console.log('✅ Telegram WebApp detected');
            const result = await authViaTelegramWebApp();
            if (result.success) {
                console.log('✅ Authenticated via Telegram WebApp');
                return { success: true, method: 'telegram_webapp', state: authState };
            }
        }
    }
    
    // Priority 2: Saved session
    const session = getSession();
    if (session && session.telegramId) {
        console.log('✅ Restoring session');
        authState.telegramId = session.telegramId;
        authState.telegramUsername = session.telegramUsername;
        authState.telegramFirstName = session.telegramFirstName;
        authState.walletAddress = session.walletAddress;
        authState.authMethod = session.authMethod;
        authState.isAuthenticated = true;
        
        // Reload profile
        const profile = await loadUserProfile(authState.telegramId);
        if (profile) {
            authState.userProfile = profile;
        }
        
        return { success: true, method: 'session', state: authState };
    }
    
    // Priority 3: URL parameter (from bot navigation)
    const telegramId = getTelegramUserId();
    if (telegramId) {
        console.log('✅ Telegram ID from URL');
        authState.telegramId = telegramId;
        authState.authMethod = 'url_param';
        authState.isAuthenticated = true;
        
        const profile = await loadUserProfile(telegramId);
        if (profile) {
            authState.userProfile = profile;
            authState.telegramUsername = profile.telegram_username || '';
            authState.walletAddress = profile.wallet_address || null;
        }
        
        saveSession();
        return { success: true, method: 'url_param', state: authState };
    }
    
    // Priority 4: Auto-connect Phantom (if already authorized)
    if (window.solana && window.solana.isPhantom) {
        try {
            const resp = await window.solana.connect({ onlyIfTrusted: true });
            if (resp && resp.publicKey) {
                console.log('✅ Phantom auto-connected');
                const result = await authViaWallet();
                if (result.success) {
                    return { success: true, method: 'wallet_auto', state: authState };
                }
            }
        } catch (e) {
            // User hasn't authorized yet
        }
    }
    
    // Not authenticated
    console.log('ℹ️ Not authenticated');
    return { success: false, method: null, state: authState };
}

// ============================================
// PUBLIC API
// ============================================

window.GotchiAuth = {
    // State
    getState: () => ({ ...authState }),
    
    // Check auth
    isAuthenticated: () => authState.isAuthenticated,
    getTelegramId: () => authState.telegramId,
    getWalletAddress: () => authState.walletAddress,
    getUserProfile: () => authState.userProfile ? { ...authState.userProfile } : null,
    
    // Auth methods
    init: initAuth,
    authViaTelegramWebApp: authViaTelegramWebApp,
    authViaTelegramWidget: authViaTelegramWidget,
    authViaWallet: authViaWallet,
    
    // Session
    saveSession: saveSession,
    clearSession: clearSession,
    getSession: getSession,
    
    // Utilities
    getTelegramUserId: getTelegramUserId,
    getTelegramUserInfo: getTelegramUserInfo,
    isTelegramWebApp: isTelegramWebApp,
    loadUserProfile: loadUserProfile,
    
    // Sync
    syncProfile: async () => {
        if (!authState.telegramId) return null;
        const profile = await loadUserProfile(authState.telegramId);
        if (profile) {
            authState.userProfile = profile;
            authState.walletAddress = profile.wallet_address || null;
            saveSession();
        }
        return profile;
    }
};

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAuth().then(result => {
            console.log('🔐 Auth initialized:', result);
            // Dispatch event for other scripts
            window.dispatchEvent(new CustomEvent('gotchiAuthReady', { detail: result }));
        });
    });
} else {
    initAuth().then(result => {
        console.log('🔐 Auth initialized:', result);
        window.dispatchEvent(new CustomEvent('gotchiAuthReady', { detail: result }));
    });
}

