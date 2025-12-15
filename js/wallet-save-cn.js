/**
 * рџ’ѕ Wallet-Based Save System for Chinese Users
 * 
 * This module provides save/load functionality using wallet address instead of Telegram ID.
 * Integrates with wallet-auth-cn.js
 */

// Use WALLET_AUTH_API from wallet-auth-cn.js (loaded first), or use default
// Note: wallet-auth-cn.js is loaded before this file, so WALLET_AUTH_API should already exist
const WALLET_AUTH_API_SAVE = typeof WALLET_AUTH_API !== 'undefined' 
    ? WALLET_AUTH_API 
    : 'https://api.solanatamagotchi.com/api/wallet-auth.php';

/**
 * Save game state using wallet address
 */
async function saveGameStateToWallet(gameState) {
    if (!window.WALLET_ADDRESS) {
        console.warn('вљ пёЏ No wallet connected - cannot save');
        return false;
    }
    
    try {
        const response = await fetch(WALLET_AUTH_API_SAVE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'save',
                wallet_address: window.WALLET_ADDRESS,
                game_state: {
                    tama: gameState.tama || 0,
                    level: gameState.level || 1,
                    xp: gameState.xp || 0,
                    clicks: gameState.totalClicks || 0,
                    pet_name: gameState.petName || null,
                    pet_type: gameState.petType || null,
                    questClicksCompleted: gameState.questClicksCompleted || false,
                    questLevelCompleted: gameState.questLevelCompleted || false
                }
            })
        });
        
        // Check if response is OK and is JSON
        if (!response.ok) {
            const errorText = await response.text();
            console.error('вќЊ Save API Error:', response.status, errorText);
            throw new Error(`API error: ${response.status} - ${errorText.substring(0, 100)}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // [cleaned]
            return true;
        } else {
            console.error('вќЊ Failed to save game state:', result.error);
            return false;
        }
    } catch (error) {
        console.error('вќЊ Save error:', error);
        return false;
    }
}

/**
 * Load game state using wallet address
 */
async function loadGameStateFromWallet() {
    if (!window.WALLET_ADDRESS) {
        console.warn('вљ пёЏ No wallet connected - cannot load');
        return null;
    }
    
    try {
        const response = await fetch(WALLET_AUTH_API_SAVE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get',
                wallet_address: window.WALLET_ADDRESS
            })
        });
        
        // Check if response is OK and is JSON
        if (!response.ok) {
            const errorText = await response.text();
            console.error('вќЊ Load API Error:', response.status, errorText);
            throw new Error(`API error: ${response.status} - ${errorText.substring(0, 100)}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.exists) {
            // [cleaned]
            return result;
        } else {
            // [cleaned]
            return null;
        }
    } catch (error) {
        console.error('вќЊ Failed to load game state:', error);
        return null;
    }
}

/**
 * Update game state from wallet data
 */
function updateGameStateFromWallet(walletData) {
    if (!walletData || !walletData.exists) return;
    
    if (typeof gameState !== 'undefined') {
        gameState.tama = walletData.tama || 0;
        gameState.level = walletData.level || 1;
        gameState.xp = walletData.xp || 0;
        gameState.totalClicks = walletData.clicks || 0;
        
        if (walletData.pet_name) gameState.petName = walletData.pet_name;
        if (walletData.pet_type) gameState.petType = walletData.pet_type;
        
        // Update UI if function exists
        if (typeof updateUI === 'function') {
            updateUI();
        }
        
        // [cleaned]
    }
}

// Export functions
window.WalletSave = {
    save: saveGameStateToWallet,
    load: loadGameStateFromWallet,
    update: updateGameStateFromWallet
};


