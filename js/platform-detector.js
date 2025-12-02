/**
 * Platform Detection Helper
 * Detects if user is in Telegram Mini App or regular browser
 */

const PlatformDetector = {
    /**
     * Check if user is in Telegram Mini App
     */
    isTelegram() {
        return !!(window.Telegram?.WebApp?.initDataUnsafe?.user);
    },

    /**
     * Check if user is in regular browser (not Telegram)
     */
    isBrowser() {
        return !this.isTelegram();
    },

    /**
     * Get platform name
     */
    getPlatform() {
        return this.isTelegram() ? 'telegram' : 'browser';
    },

    /**
     * Hide element if condition is true
     */
    hideIf(elementId, condition) {
        const el = document.getElementById(elementId);
        if (el && condition) {
            el.style.display = 'none';
        }
    },

    /**
     * Show element if condition is true
     */
    showIf(elementId, condition) {
        const el = document.getElementById(elementId);
        if (el && condition) {
            el.style.display = '';
        }
    },

    /**
     * Initialize platform-specific UI
     * Call this after DOM is loaded
     */
    initPlatformUI() {
        const isTg = this.isTelegram();
        
        console.log(`🔍 Platform detected: ${this.getPlatform()}`);

        // Hide wallet buttons in Telegram
        this.hideIf('wallet-connect-btn', isTg);
        this.hideIf('disconnect-wallet-btn-modal', isTg);
        
        // Show wallet buttons in browser
        this.showIf('wallet-connect-btn', !isTg);
        
        // Add CSS class to body for platform-specific styles
        document.body.classList.add(isTg ? 'platform-telegram' : 'platform-browser');
        
        console.log(`✅ Platform UI initialized for ${this.getPlatform()}`);
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        PlatformDetector.initPlatformUI();
    });
} else {
    PlatformDetector.initPlatformUI();
}

// Export for use in other scripts
window.PlatformDetector = PlatformDetector;

