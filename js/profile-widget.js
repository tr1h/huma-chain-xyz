/**
 * 👤 Profile Widget Component
 * 
 * Displays user profile after authentication
 * Shows: Telegram info, TAMA balance, wallet, quick actions
 */

// ============================================
// PROFILE WIDGET
// ============================================

function createProfileWidget() {
    const widget = document.createElement('div');
    widget.id = 'profile-widget';
    widget.style.cssText = `
        position: fixed;
        top: 15px;
        right: 15px;
        z-index: 10000;
        background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9));
        border-radius: 15px;
        padding: 15px;
        box-shadow: 0 6px 0 #8AC926, 0 12px 30px rgba(0,0,0,0.3);
        border: 4px solid #1D3557;
        font-family: 'Press Start 2P', cursive;
        min-width: 200px;
        max-width: 300px;
        display: none;
        transition: all 0.3s ease;
    `;
    
    widget.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-size: 0.7rem; color: #1D3557; font-weight: bold;">👤 PROFILE</div>
            <button id="profile-widget-close" style="
                background: #f44336;
                color: white;
                border: 2px solid #1D3557;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                font-size: 14px;
                cursor: pointer;
                line-height: 1;
                padding: 0;
            ">×</button>
        </div>
        <div id="profile-widget-content">
            <div style="font-size: 0.5rem; color: #666; margin-bottom: 8px;" id="profile-username">Loading...</div>
            <div style="font-size: 0.6rem; color: #1D3557; margin-bottom: 8px;">
                💰 TAMA: <span id="profile-tama" style="color: #8AC926;">0</span>
            </div>
            <div style="font-size: 0.5rem; color: #666; margin-bottom: 10px;" id="profile-wallet">No wallet</div>
            <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                <a href="profile.html" style="
                    flex: 1;
                    padding: 8px;
                    background: linear-gradient(135deg, #FFCA3A, #FFA500);
                    color: #1D3557;
                    border: 2px solid #1D3557;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 0.5rem;
                    text-align: center;
                    box-shadow: 0 3px 0 #8AC926;
                ">SETTINGS</a>
                <a href="my-nfts.html" style="
                    flex: 1;
                    padding: 8px;
                    background: linear-gradient(135deg, #1982C4, #1D3557);
                    color: white;
                    border: 2px solid #1D3557;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 0.5rem;
                    text-align: center;
                    box-shadow: 0 3px 0 #0F5A8A;
                ">MY NFTS</a>
            </div>
        </div>
    `;
    
    // Close button
    widget.querySelector('#profile-widget-close').addEventListener('click', () => {
        widget.style.display = 'none';
        localStorage.setItem('profile_widget_hidden', 'true');
    });
    
    // Check if hidden
    if (localStorage.getItem('profile_widget_hidden') === 'true') {
        widget.style.display = 'none';
    }
    
    document.body.appendChild(widget);
    return widget;
}

/**
 * Update profile widget with auth state
 */
function updateProfileWidget() {
    if (!window.GotchiAuth) return;
    
    const authState = window.GotchiAuth.getState();
    const widget = document.getElementById('profile-widget');
    
    if (!widget) {
        createProfileWidget();
        return;
    }
    
    if (!authState.isAuthenticated) {
        widget.style.display = 'none';
        return;
    }
    
    // Show widget
    if (localStorage.getItem('profile_widget_hidden') !== 'true') {
        widget.style.display = 'block';
    }
    
    // Update content
    const usernameEl = document.getElementById('profile-username');
    const tamaEl = document.getElementById('profile-tama');
    const walletEl = document.getElementById('profile-wallet');
    
    if (usernameEl) {
        if (authState.telegramUsername) {
            usernameEl.textContent = `@${authState.telegramUsername}`;
        } else if (authState.telegramFirstName) {
            usernameEl.textContent = authState.telegramFirstName;
        } else if (authState.telegramId) {
            usernameEl.textContent = `ID: ${authState.telegramId.substring(0, 8)}...`;
        } else {
            usernameEl.textContent = 'Guest';
        }
    }
    
    if (tamaEl && authState.userProfile) {
        tamaEl.textContent = (authState.userProfile.tama || 0).toLocaleString();
    }
    
    if (walletEl) {
        if (authState.walletAddress) {
            walletEl.textContent = `${authState.walletAddress.substring(0, 6)}...${authState.walletAddress.substring(authState.walletAddress.length - 4)}`;
            walletEl.style.color = '#8AC926';
        } else {
            walletEl.textContent = 'No wallet';
            walletEl.style.color = '#999';
        }
    }
    
    // Update links with user_id
    const links = widget.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && authState.telegramId && !href.includes('user_id=')) {
            const separator = href.includes('?') ? '&' : '?';
            link.setAttribute('href', `${href}${separator}user_id=${authState.telegramId}`);
        }
    });
}

/**
 * Initialize profile widget
 */
function initProfileWidget() {
    // Wait for auth to be ready
    if (window.GotchiAuth && window.GotchiAuth.isAuthenticated()) {
        createProfileWidget();
        updateProfileWidget();
    } else {
        window.addEventListener('gotchiAuthReady', () => {
            createProfileWidget();
            updateProfileWidget();
        });
    }
    
    // Update periodically
    setInterval(() => {
        if (window.GotchiAuth && window.GotchiAuth.isAuthenticated()) {
            window.GotchiAuth.syncProfile().then(() => {
                updateProfileWidget();
            });
        }
    }, 30000); // Every 30 seconds
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileWidget);
} else {
    initProfileWidget();
}

// Export
window.GotchiProfileWidget = {
    update: updateProfileWidget,
    init: initProfileWidget
};

