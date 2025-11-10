// 🧭 Universal Navigation Component for all pages
// Usage: Include this script and call initNavigation() after DOM loaded

function initNavigation(currentPage = '') {
    const nav = document.createElement('nav');
    nav.id = 'main-navigation';
    nav.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-shadow: 0 -5px 20px rgba(0,0,0,0.3);
        z-index: 9999;
        height: 70px;
    `;
    
    const navItems = [
        { id: 'game', label: '🎮 Game', url: 'telegram-game.html' },
        { id: 'nft', label: '🎨 Mint NFT', url: 'nft-mint-5tiers.html' },
        { id: 'my-nfts', label: '🖼️ My NFTs', url: 'my-nfts.html' }
    ];
    
    navItems.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.style.cssText = `
            background: ${currentPage === item.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'};
            border: 2px solid ${currentPage === item.id ? '#fff' : 'rgba(255,255,255,0.3)'};
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.3s;
            flex: 1;
            margin: 0 5px;
            max-width: 150px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        btn.textContent = item.label;
        btn.onclick = () => navigateTo(item.url);
        
        // Hover effect
        btn.onmouseenter = () => {
            if (currentPage !== item.id) {
                btn.style.background = 'rgba(255,255,255,0.2)';
                btn.style.transform = 'translateY(-2px)';
            }
        };
        btn.onmouseleave = () => {
            if (currentPage !== item.id) {
                btn.style.background = 'rgba(255,255,255,0.1)';
                btn.style.transform = 'translateY(0)';
            }
        };
        
        nav.appendChild(btn);
    });
    
    // Add bottom padding to body so content doesn't hide under nav
    document.body.style.paddingBottom = '80px';
    
    // Insert nav at the end of body
    document.body.appendChild(nav);
}

function navigateTo(url) {
    // Get user_id from current URL if exists
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    
    // Add user_id to target URL if exists
    if (userId) {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}user_id=${userId}`;
    }
    
    window.location.href = url;
}

// Auto-initialize if not disabled
if (!window.DISABLE_AUTO_NAV) {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.NAV_CURRENT_PAGE) {
            initNavigation(window.NAV_CURRENT_PAGE);
        } else {
            initNavigation();
        }
    });
}

