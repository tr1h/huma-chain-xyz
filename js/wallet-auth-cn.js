/**
 * 🔐 Wallet-Based Authentication for Chinese Users
 * 
 * This module provides wallet-first authentication for users who can't access Telegram.
 * Perfect for Chinese users - no Telegram required!
 * 
 * Features:
 * - Connect Phantom/Solflare wallet
 * - Create account by wallet address
 * - Save/load game data via API
 * - All data stored in Supabase
 */

const WALLET_AUTH_API = 'https://solanatamagotchi.com/api/wallet-auth.php';

// Global wallet state
let walletAuthState = {
    isAuthenticated: false,
    walletAddress: null,
    userId: null,
    userData: null
};

/**
 * Connect Phantom or Solflare wallet
 */
async function connectWallet() {
    try {
        // Check if Phantom is installed
        if (window.solana && window.solana.isPhantom) {
            const resp = await window.solana.connect();
            const walletAddress = resp.publicKey.toString();
            
            console.log('✅ Wallet connected:', walletAddress);
            
            // Try to get or create account
            const accountResult = await getOrCreateAccount(walletAddress);
            
            if (accountResult.success) {
                walletAuthState.isAuthenticated = true;
                walletAuthState.walletAddress = walletAddress;
                walletAuthState.userId = accountResult.user_id;
                walletAuthState.userData = accountResult;
                
                // Set global variables for game
                window.WALLET_ADDRESS = walletAddress;
                window.WALLET_USER_ID = accountResult.user_id;
                
                // Load game state
                await loadGameStateFromWallet();
                
                return { success: true, walletAddress, userData: accountResult };
            } else {
                throw new Error(accountResult.error || 'Failed to create account');
            }
        } else {
            // Try Solflare
            if (window.solflare) {
                await window.solflare.connect();
                const walletAddress = window.solflare.publicKey.toString();
                
                const accountResult = await getOrCreateAccount(walletAddress);
                
                if (accountResult.success) {
                    walletAuthState.isAuthenticated = true;
                    walletAuthState.walletAddress = walletAddress;
                    walletAuthState.userId = accountResult.user_id;
                    walletAuthState.userData = accountResult;
                    
                    window.WALLET_ADDRESS = walletAddress;
                    window.WALLET_USER_ID = accountResult.user_id;
                    
                    await loadGameStateFromWallet();
                    
                    return { success: true, walletAddress, userData: accountResult };
                }
            }
            
            // No wallet found
            alert('❌ Please install Phantom or Solflare wallet!\n\nDownload: https://phantom.app/');
            return { success: false, error: 'No wallet found' };
        }
    } catch (error) {
        console.error('❌ Wallet connection error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get or create account by wallet address
 */
async function getOrCreateAccount(walletAddress) {
    try {
        // First, try to get existing account
        const getResponse = await fetch(WALLET_AUTH_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get',
                wallet_address: walletAddress
            })
        });
        
        // Check if response is OK and is JSON
        if (!getResponse.ok) {
            const errorText = await getResponse.text();
            console.error('❌ API Error:', getResponse.status, errorText);
            throw new Error(`API error: ${getResponse.status} - ${errorText.substring(0, 100)}`);
        }
        
        const getResult = await getResponse.json();
        
        if (getResult.success && getResult.exists) {
            // Account exists
            return getResult;
        }
        
        // Account doesn't exist - create it
        const createResponse = await fetch(WALLET_AUTH_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create',
                wallet_address: walletAddress
            })
        });
        
        // Check if response is OK and is JSON
        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error('❌ API Error:', createResponse.status, errorText);
            throw new Error(`API error: ${createResponse.status} - ${errorText.substring(0, 100)}`);
        }
        
        const createResult = await createResponse.json();
        
        if (createResult.success) {
            return createResult;
        } else {
            throw new Error(createResult.error || 'Failed to create account');
        }
    } catch (error) {
        console.error('❌ Account creation error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Load game state from wallet
 */
async function loadGameStateFromWallet() {
    if (!walletAuthState.walletAddress) return;
    
    try {
        const response = await fetch(WALLET_AUTH_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get',
                wallet_address: walletAuthState.walletAddress
            })
        });
        
        const result = await response.json();
        
        if (result.success && result.exists) {
            // Update game state if function exists
            if (typeof updateGameStateFromWallet === 'function') {
                updateGameStateFromWallet(result);
            }
            
            console.log('✅ Game state loaded from wallet:', result);
            return result;
        }
    } catch (error) {
        console.error('❌ Failed to load game state:', error);
    }
}

/**
 * Save game state to wallet
 */
async function saveGameStateToWallet(gameState) {
    if (!walletAuthState.walletAddress) {
        console.warn('⚠️ No wallet connected - cannot save');
        return false;
    }
    
    try {
        const response = await fetch(WALLET_AUTH_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'save',
                wallet_address: walletAuthState.walletAddress,
                game_state: {
                    tama: gameState.tama || 0,
                    level: gameState.level || 1,
                    xp: gameState.xp || 0,
                    clicks: gameState.totalClicks || 0,
                    pet_name: gameState.petName || null,
                    pet_type: gameState.petType || null
                }
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Game state saved to wallet');
            return true;
        } else {
            console.error('❌ Failed to save game state:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Save error:', error);
        return false;
    }
}

/**
 * Initialize wallet authentication
 */
async function initWalletAuth() {
    console.log('🔐 Initializing wallet authentication...');
    
    // Check if wallet is already connected (from previous session)
    if (window.solana && window.solana.isPhantom) {
        try {
            const resp = await window.solana.connect({ onlyIfTrusted: true });
            if (resp && resp.publicKey) {
                const walletAddress = resp.publicKey.toString();
                const accountResult = await getOrCreateAccount(walletAddress);
                
                if (accountResult.success) {
                    walletAuthState.isAuthenticated = true;
                    walletAuthState.walletAddress = walletAddress;
                    walletAuthState.userId = accountResult.user_id;
                    walletAuthState.userData = accountResult;
                    
                    window.WALLET_ADDRESS = walletAddress;
                    window.WALLET_USER_ID = accountResult.user_id;
                    
                    await loadGameStateFromWallet();
                    
                    console.log('✅ Wallet auto-connected:', walletAddress);
                    return { success: true, walletAddress };
                }
            }
        } catch (error) {
            // User hasn't connected before - that's okay
            console.log('ℹ️ No previous wallet connection');
        }
    }
    
    return { success: false, needsConnection: true };
}

// Export functions
window.WalletAuth = {
    connect: connectWallet,
    init: initWalletAuth,
    save: saveGameStateToWallet,
    load: loadGameStateFromWallet,
    getState: () => walletAuthState,
    isAuthenticated: () => walletAuthState.isAuthenticated
};

