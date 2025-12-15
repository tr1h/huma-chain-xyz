/**
 * рџ”„ Keep-Alive Ping for Render.com Free Instance
 * 
 * Prevents Render.com free instance from spinning down by sending periodic health check requests.
 * Free instances spin down after 15 minutes of inactivity, causing 50+ second delays.
 * 
 * Usage: Include this script on pages that use the API
 */

(function() {
    'use strict';
    
    const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutes (Render spins down after 15 min)
    const API_ENDPOINTS = [
        'https://api.solanatamagotchi.com/api/wallet-auth.php',
        'https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=total'
    ];
    
    let keepAliveInterval = null;
    let isActive = false;
    
    /**
     * Send keep-alive ping to API
     */
    async function pingAPI(endpoint) {
        try {
            const url = endpoint.includes('?') ? endpoint : endpoint + '?ping=1';
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                cache: 'no-store'
            });
            
            // Don't wait for response - fire and forget
            if (response.ok) {
                // [cleaned]
            }
        } catch (error) {
            // Silently fail - don't spam console
            // This is expected if instance is spinning up
        }
    }
    
    /**
     * Send keep-alive pings to all endpoints
     */
    function sendKeepAlivePings() {
        if (!isActive) return;
        
        API_ENDPOINTS.forEach(endpoint => {
            pingAPI(endpoint);
        });
    }
    
    /**
     * Start keep-alive mechanism
     */
    function startKeepAlive() {
        if (keepAliveInterval) {
            // [cleaned]
            return;
        }
        
        isActive = true;
        
        // Send initial ping after 1 minute (give page time to load)
        setTimeout(() => {
            sendKeepAlivePings();
        }, 60 * 1000);
        
        // Then ping every 5 minutes
        keepAliveInterval = setInterval(() => {
            sendKeepAlivePings();
        }, KEEP_ALIVE_INTERVAL);
        
        // [cleaned]
        
        // Also ping when page becomes visible (user returns to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && isActive) {
                // [cleaned]
                sendKeepAlivePings();
            }
        });
    }
    
    /**
     * Stop keep-alive mechanism
     */
    function stopKeepAlive() {
        if (keepAliveInterval) {
            clearInterval(keepAliveInterval);
            keepAliveInterval = null;
            isActive = false;
            // [cleaned]
        }
    }
    
    // Auto-start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startKeepAlive);
    } else {
        startKeepAlive();
    }
    
    // Stop when page unloads (cleanup)
    window.addEventListener('beforeunload', stopKeepAlive);
    
    // Export for manual control
    window.KeepAlive = {
        start: startKeepAlive,
        stop: stopKeepAlive,
        ping: sendKeepAlivePings
    };
    
})();


