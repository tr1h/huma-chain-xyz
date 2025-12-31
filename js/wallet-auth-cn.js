/**
 * 🔒 Wallet-Based Authentication for Chinese Users
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

const WALLET_AUTH_API = 'https://api.solanatamagotchi.com/api/wallet-auth.php';

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
            
            // [cleaned]
            
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
                
                // рџ“Љ Track wallet connection in Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'wallet_connected', {
                        'wallet_type': 'phantom',
                        'wallet_address': walletAddress.substring(0, 8) + '...',
                        'is_new_user': accountResult.message === 'Account created successfully',
                        'user_id': accountResult.user_id,
                        'language': new URLSearchParams(window.location.search).get('lang') || 'en'
                    });
                    
                    // Track account creation if new user
                    if (accountResult.message === 'Account created successfully') {
                        gtag('event', 'account_created', {
                            'auth_method': 'wallet',
                            'wallet_type': 'phantom',
                            'language': new URLSearchParams(window.location.search).get('lang') || 'en'
                        });
                    }
                }
                
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
                    
                    // рџ“Љ Track wallet connection in Google Analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'wallet_connected', {
                            'wallet_type': 'solflare',
                            'wallet_address': walletAddress.substring(0, 8) + '...',
                            'is_new_user': accountResult.message === 'Account created successfully',
                            'user_id': accountResult.user_id,
                            'language': new URLSearchParams(window.location.search).get('lang') || 'en'
                        });
                        
                        // Track account creation if new user
                        if (accountResult.message === 'Account created successfully') {
                            gtag('event', 'account_created', {
                                'auth_method': 'wallet',
                                'wallet_type': 'solflare',
                                'language': new URLSearchParams(window.location.search).get('lang') || 'en'
                            });
                        }
                    }
                    
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
        
        // Show user-friendly error message
        let errorMessage = error.message;
        if (errorMessage.includes('405') || errorMessage.includes('Not Allowed')) {
            errorMessage = 'Server error: Cannot connect to authentication service. Please try again later or contact support.';
        }
        
        // Show alert only if it's not a user cancellation
        if (!error.message.includes('User rejected') && !error.message.includes('User cancelled')) {
            alert(`❌ Failed to connect wallet\n\n${errorMessage}`);
        }
        
        return { success: false, error: errorMessage };
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
        
        // Clone response to avoid "body already read" error
        const getResponseClone = getResponse.clone();
        
        // Check if response is OK
        if (!getResponse.ok) {
            const errorText = await getResponse.text();
            console.error('❌ API Error:', getResponse.status, errorText);
            
            // If server returns HTML (405 page), it means routing issue
            if (getResponse.status === 405 || errorText.includes('<html>')) {
                throw new Error('Server configuration error: API endpoint not accessible. Please contact support.');
            }
            
            throw new Error(`API error: ${getResponse.status} - ${errorText.substring(0, 100)}`);
        }
        
        // Try to parse as JSON
        let getResult;
        try {
            // First get text to check for HTML warnings
            const responseText = await getResponse.text();
            
            // Remove any HTML warnings at the beginning
            const jsonStart = responseText.indexOf('{');
            const cleanText = jsonStart > 0 ? responseText.substring(jsonStart) : responseText;
            
            getResult = JSON.parse(cleanText);
        } catch (jsonError) {
            // If JSON parse fails, try to read error text from clone
            try {
                const errorText = await getResponseClone.text();
                console.error('❌ Failed to parse JSON response:', errorText.substring(0, 200));
                
                // Try to extract JSON from HTML+JSON mix
                const jsonMatch = errorText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    getResult = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Invalid server response. Please try again later.');
                }
            } catch (e) {
                console.error('❌ JSON parse error:', e);
                throw new Error('Invalid server response. Please try again later.');
            }
        }
        
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
        
        // Clone response to avoid "body already read" error
        const createResponseClone = createResponse.clone();
        
        // Check if response is OK
        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error('❌ API Error:', createResponse.status, errorText);
            
            // If server returns HTML (405 page), it means routing issue
            if (createResponse.status === 405 || errorText.includes('<html>')) {
                throw new Error('Server configuration error: API endpoint not accessible. Please contact support.');
            }
            
            throw new Error(`API error: ${createResponse.status} - ${errorText.substring(0, 100)}`);
        }
        
        // Try to parse as JSON
        let createResult;
        try {
            createResult = await createResponse.json();
        } catch (jsonError) {
            // If JSON parse fails, try to read error text from clone
            try {
                const errorText = await createResponseClone.text();
                console.error('❌ Failed to parse JSON response:', errorText);
                throw new Error('Invalid server response. Please try again later.');
            } catch (e) {
                throw new Error('Invalid server response. Please try again later.');
            }
        }
        
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
            
            // [cleaned]
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
            // [cleaned]
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
    // [cleaned]
    
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
                    
                    // [cleaned]
                    return { success: true, walletAddress };
                }
            }
        } catch (error) {
            // User hasn't connected before - that's okay
            // [cleaned]
        }
    }
    
    return { success: false, needsConnection: true };
}

/**
 * Disconnect wallet
 */
async function disconnectWallet() {
    try {
        // Disconnect from Phantom/Solflare
        if (window.solana && window.solana.isPhantom && window.solana.isConnected) {
            await window.solana.disconnect();
        } else if (window.solflare && window.solflare.isConnected) {
            await window.solflare.disconnect();
        }
        
        // Clear wallet state
        walletAuthState = {
            isAuthenticated: false,
            walletAddress: null,
            userId: null,
            userData: null
        };
        
        // Clear global variables
        window.WALLET_ADDRESS = null;
        window.WALLET_USER_ID = null;
        
        // [cleaned]
        return { success: true };
    } catch (error) {
        console.error('❌ Wallet disconnection error:', error);
        return { success: false, error: error.message };
    }
}

// Export functions
window.WalletAuth = {
    connect: connectWallet,
    disconnect: disconnectWallet,
    init: initWalletAuth,
    save: saveGameStateToWallet,
    load: loadGameStateFromWallet,
    getState: () => walletAuthState,
    isAuthenticated: () => walletAuthState.isAuthenticated
};


