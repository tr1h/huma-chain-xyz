// Enhanced Profile JavaScript
// Handles all advanced profile features: stats, achievements, charts, NFTs, referrals, etc.

const API_BASE = 'https://api.solanatamagotchi.com';

// Achievement Definitions
const ACHIEVEMENTS = [
    { id: 'first_click', name: 'First Click', icon: '🖱️', condition: (data) => data.totalClicks >= 1 },
    { id: 'click_100', name: '100 Clicks', icon: '💯', condition: (data) => data.totalClicks >= 100 },
    { id: 'click_1000', name: '1K Clicks', icon: '🔥', condition: (data) => data.totalClicks >= 1000 },
    { id: 'click_10000', name: '10K Clicks', icon: '⚡', condition: (data) => data.totalClicks >= 10000 },
    { id: 'level_5', name: 'Level 5', icon: '🎯', condition: (data) => data.level >= 5 },
    { id: 'level_10', name: 'Level 10', icon: '🏅', condition: (data) => data.level >= 10 },
    { id: 'tama_1k', name: '1K TAMA', icon: '💰', condition: (data) => data.tama >= 1000 },
    { id: 'tama_10k', name: '10K TAMA', icon: '💎', condition: (data) => data.tama >= 10000 },
    { id: 'tama_100k', name: '100K TAMA', icon: '👑', condition: (data) => data.tama >= 100000 },
    { id: 'first_nft', name: 'First NFT', icon: '🖼️', condition: (data) => data.nfts >= 1 },
    { id: 'nft_collector', name: 'NFT Collector', icon: '🎨', condition: (data) => data.nfts >= 3 },
    { id: 'nft_whale', name: 'NFT Whale', icon: '🐋', condition: (data) => data.nfts >= 5 },
    { id: 'first_referral', name: 'First Friend', icon: '👥', condition: (data) => data.referrals >= 1 },
    { id: 'referral_5', name: '5 Friends', icon: '🎉', condition: (data) => data.referrals >= 5 },
    { id: 'referral_10', name: '10 Friends', icon: '🌟', condition: (data) => data.referrals >= 10 },
    { id: 'top_10', name: 'Top 10 Player', icon: '🏆', condition: (data) => data.rank <= 10 && data.rank > 0 },
    { id: 'top_3', name: 'Top 3 Player', icon: '🥇', condition: (data) => data.rank <= 3 && data.rank > 0 },
    { id: 'wallet_linked', name: 'Wallet Linked', icon: '👛', condition: (data) => data.walletLinked },
    { id: 'twitter_linked', name: 'Twitter Linked', icon: '🐦', condition: (data) => data.twitterLinked },
    { id: 'daily_login', name: 'Daily Player', icon: '📅', condition: (data) => data.daysPlayed >= 7 }
];

// Avatar Options
const AVATARS = ['🐱', '🐶', '🐼', '🐨', '🐸', '🦊', '🐰', '🐻', '🐯', '🦁', '🐮', '🐷'];

// Global State
let userData = null;
let userStats = null;
let tamaChart = null;

// Initialize - wait for auth to be ready
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for auth initialization if it's a wallet user
    const urlParams = new URLSearchParams(window.location.search);
    const userIdParam = urlParams.get('user_id');
    
    if (userIdParam && userIdParam.startsWith('wallet_')) {
        // Wait for auth to set window.WALLET_ADDRESS
        console.log('⏳ Waiting for wallet auth to initialize...');
        
        // Wait for authReady event or timeout after 5 seconds
        const authReady = new Promise((resolve) => {
            if (window.WALLET_ADDRESS) {
                resolve();
            } else {
                const handler = () => {
                    console.log('✅ Auth ready event received');
                    window.removeEventListener('authReady', handler);
                    resolve();
                };
                window.addEventListener('authReady', handler);
                
                // Timeout after 5 seconds
                setTimeout(() => {
                    console.warn('⚠️ Auth timeout, proceeding anyway');
                    window.removeEventListener('authReady', handler);
                    resolve();
                }, 5000);
            }
        });
        
        await authReady;
    }
    
    await loadProfile();
});

// Load Profile Data
async function loadProfile() {
    try {
        // 🔐 SECURITY CHECK: Verify real authentication
        const urlParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = urlParams.get('user_id');
        
        // Get authenticated user ID from auth state
        const authenticatedUserId = window.authState?.telegramId || 
                                    window.authState?.walletAddress || 
                                    window.TELEGRAM_USER_ID || 
                                    window.WALLET_ADDRESS;
        
        if (!authenticatedUserId) {
            showError('❌ Please login first! Connect your wallet or use Telegram bot.', true);
            // Redirect to game page after 3 seconds
            setTimeout(() => {
                window.location.href = 'tamagotchi-game.html';
            }, 3000);
            return;
        }
        
        // 🔐 SECURITY: If user_id in URL doesn't match authenticated user, BLOCK ACCESS
        if (userIdFromUrl && userIdFromUrl !== authenticatedUserId) {
            // Check if it's a Telegram user trying to access wallet profile or vice versa
            const isTelegramAuth = /^\d+$/.test(authenticatedUserId);
            const isWalletAuth = /^[A-Za-z0-9]{32,44}$/.test(authenticatedUserId);
            
            // If URL has different user_id than authenticated - BLOCK
            console.warn('🚨 SECURITY: Attempt to access another user profile!');
            console.warn('  Authenticated:', authenticatedUserId);
            console.warn('  URL user_id:', userIdFromUrl);
            
            showError('🚨 ACCESS DENIED! You can only view your own profile.', true);
            
            // Redirect to own profile after 3 seconds
            setTimeout(() => {
                window.location.href = `profile.html?user_id=${authenticatedUserId}`;
            }, 3000);
            return;
        }
        
        // Use authenticated user ID (not from URL!)
        let userId = authenticatedUserId;
        
        // If it's a wallet user, ensure full wallet address
        if (userId && userId.startsWith('wallet_') && window.WALLET_ADDRESS) {
            userId = window.WALLET_ADDRESS; // Use full wallet address
            console.log('🔍 Using full wallet address for profile:', userId);
        }
        
        console.log('✅ Security check passed. Loading profile for:', userId);
        
        // Try simple API first, fallback to full API
        let response;
        let data;
        
        try {
            // Try simplified API first
            response = await fetch(`${API_BASE}/api/profile-data-simple.php?user_id=${userId}`);
            
            if (!response.ok) {
                throw new Error(`Simple API failed: ${response.status}`);
            }
            
            data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to load profile from simple API');
            }
            
            console.log('✅ Loaded from simple API');
        } catch (simpleError) {
            console.warn('⚠️ Simple API failed, trying full API:', simpleError);
            
            // Fallback to full API
            response = await fetch(`${API_BASE}/api/profile-data.php?user_id=${userId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to load profile');
            }
            
            console.log('✅ Loaded from full API');
        }
        
        userData = data.user;
        userStats = data.stats;
        
        // Render all sections
        renderWalletInfo();        // NEW: Wallet info section
        renderStatistics();
        renderAchievements();
        renderChart();
        renderTransactions();
        renderActivity();
        renderNFTs();
        renderReferrals();
        renderAvatarPicker();
        
        // Hide loading, show content
        document.getElementById('loading').style.display = 'none';
        document.getElementById('profile-content').style.display = 'block';
        
    } catch (error) {
        console.error('Failed to load profile:', error);
        showError('Failed to load profile. Please try again.');
    }
}

// Render Wallet Info (NEW!)
async function renderWalletInfo() {
    try {
        // Detect auth method
        const authMethod = window.authState?.authMethod || 'unknown';
        const telegramId = window.authState?.telegramId || window.TELEGRAM_USER_ID;
        const walletAddress = window.authState?.walletAddress || window.WALLET_ADDRESS || userData?.wallet_address;
        
        // Display auth method
        if (authMethod === 'telegram_webapp' || authMethod === 'telegram' || telegramId) {
            document.getElementById('auth-method').textContent = '📱 TELEGRAM';
            document.getElementById('auth-details').textContent = `User ID: ${telegramId || 'N/A'}`;
        } else if (authMethod === 'wallet' || walletAddress) {
            document.getElementById('auth-method').textContent = '👛 WALLET';
            document.getElementById('auth-details').textContent = walletAddress ? `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : 'N/A';
        } else {
            document.getElementById('auth-method').textContent = '❓ UNKNOWN';
            document.getElementById('auth-details').textContent = 'Auth method not detected';
        }
        
        // Display wallet address
        if (walletAddress) {
            document.getElementById('wallet-address').textContent = walletAddress;
            document.getElementById('wallet-address').title = walletAddress;
            
            // Load SOL balance from Solana RPC
            try {
                const connection = new solanaWeb3.Connection('https://api.devnet.solana.com', 'confirmed');
                const publicKey = new solanaWeb3.PublicKey(walletAddress);
                const balance = await connection.getBalance(publicKey);
                const solBalance = (balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4);
                
                document.getElementById('sol-balance').textContent = `${solBalance} SOL`;
                
                // Fetch SOL price from CoinGecko (optional)
                try {
                    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
                    const priceData = await priceResponse.json();
                    const solPrice = priceData.solana.usd;
                    const usdValue = (parseFloat(solBalance) * solPrice).toFixed(2);
                    document.getElementById('sol-usd').textContent = usdValue;
                } catch (priceError) {
                    console.warn('Failed to fetch SOL price:', priceError);
                    document.getElementById('sol-usd').textContent = '--';
                }
            } catch (balanceError) {
                console.error('Failed to fetch SOL balance:', balanceError);
                document.getElementById('sol-balance').textContent = 'Error loading';
            }
        } else {
            document.getElementById('wallet-address').textContent = 'No wallet connected';
            document.getElementById('copy-wallet-btn').disabled = true;
            document.getElementById('copy-wallet-btn').style.opacity = '0.5';
            document.getElementById('copy-wallet-btn').style.cursor = 'not-allowed';
        }
    } catch (error) {
        console.error('Error rendering wallet info:', error);
    }
}

// Copy wallet address to clipboard
window.copyWalletAddress = function() {
    const walletAddress = document.getElementById('wallet-address').textContent;
    if (walletAddress && walletAddress !== 'Not connected' && walletAddress !== 'No wallet connected') {
        navigator.clipboard.writeText(walletAddress).then(() => {
            const btn = document.getElementById('copy-wallet-btn');
            const originalText = btn.textContent;
            btn.textContent = '✅ COPIED!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy address');
        });
    }
};

// Render Statistics Dashboard
function renderStatistics() {
    document.getElementById('stat-level').textContent = userStats.level || 1;
    document.getElementById('stat-tama').textContent = (userStats.tama || 0).toLocaleString();
    document.getElementById('stat-clicks').textContent = (userStats.totalClicks || 0).toLocaleString();
    document.getElementById('stat-playtime').textContent = formatPlaytime(userStats.playtime || 0);
    document.getElementById('stat-rank').textContent = userStats.rank ? `#${userStats.rank}` : '#---';
    document.getElementById('stat-nfts').textContent = userStats.nfts || 0;
    document.getElementById('stat-referrals').textContent = userStats.referrals || 0;
    
    // Calculate unlocked achievements
    const unlocked = ACHIEVEMENTS.filter(ach => ach.condition(userStats)).length;
    document.getElementById('stat-achievements').textContent = `${unlocked}/${ACHIEVEMENTS.length}`;
}

// Render Achievements
function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';
    
    ACHIEVEMENTS.forEach(achievement => {
        const isUnlocked = achievement.condition(userStats);
        const div = document.createElement('div');
        div.className = `achievement-badge ${isUnlocked ? 'unlocked' : ''}`;
        div.title = achievement.name;
        div.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
        `;
        grid.appendChild(div);
    });
}

// Render TAMA Balance Chart (IMPROVED with real data)
async function renderChart() {
    const ctx = document.getElementById('tama-chart').getContext('2d');
    
    // Get balance history from database (via transactions)
    const balanceHistory = userStats.balanceHistory || [];
    
    let labels = [];
    let dataPoints = [];
    
    if (balanceHistory.length > 0) {
        // Use real balance history data
        balanceHistory.slice(-7).forEach(entry => {
            const date = new Date(entry.timestamp || entry.created_at);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            dataPoints.push(entry.balance || 0);
        });
    } else {
        // Fallback: Generate data based on current balance and realistic growth pattern
        const currentBalance = userStats.tama || 0;
        const days = 7;
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Calculate realistic growth based on level and activity
            const dayProgress = (days - i) / days;
            const baseGrowth = currentBalance * dayProgress;
            const randomVariation = Math.random() * 0.1 - 0.05; // ±5% variation
            const dailyBalance = Math.max(0, Math.floor(baseGrowth * (1 + randomVariation)));
            
            dataPoints.push(dailyBalance);
        }
        
        // Ensure last point is current balance
        if (dataPoints.length > 0) {
            dataPoints[dataPoints.length - 1] = currentBalance;
        }
    }
    
    tamaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'TAMA Balance',
                data: dataPoints,
                borderColor: '#8AC926',
                backgroundColor: 'rgba(138, 201, 38, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#FFCA3A',
                pointBorderColor: '#1D3557',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: '#FF6B6B',
                pointHoverBorderColor: '#1D3557',
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1D3557',
                    titleColor: '#FFCA3A',
                    bodyColor: '#fff',
                    borderColor: '#8AC926',
                    borderWidth: 2,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Balance: ${context.parsed.y.toLocaleString()} TAMA`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: 8
                        },
                        callback: function(value) {
                            return value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value;
                        }
                    },
                    grid: {
                        color: 'rgba(29, 53, 87, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: 8
                        }
                    },
                    grid: {
                        color: 'rgba(29, 53, 87, 0.1)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Render Transaction History
function renderTransactions() {
    const list = document.getElementById('transaction-list');
    const transactions = userStats.transactions || [];
    
    if (transactions.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>No transactions yet</p></div>';
        return;
    }
    
    list.innerHTML = transactions.slice(0, 20).map(tx => `
        <div class="transaction-item">
            <span class="transaction-icon">${getTransactionIcon(tx.type)}</span>
            <div class="transaction-info">
                <div class="transaction-title">${tx.description}</div>
                <div class="transaction-time">${formatTime(tx.timestamp)}</div>
            </div>
            <div class="transaction-amount ${tx.amount < 0 ? 'negative' : ''}">${tx.amount > 0 ? '+' : ''}${tx.amount.toLocaleString()}</div>
        </div>
    `).join('');
}

// Render Activity Timeline
function renderActivity() {
    const timeline = document.getElementById('activity-timeline');
    const activities = userStats.activities || [];
    
    if (activities.length === 0) {
        timeline.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>No recent activity</p></div>';
        return;
    }
    
    timeline.innerHTML = activities.slice(0, 15).map(activity => `
        <div class="activity-item">
            <span class="activity-icon">${getActivityIcon(activity.type)}</span>
            <div class="activity-text">${activity.description}</div>
            <div class="activity-time">${formatTime(activity.timestamp)}</div>
        </div>
    `).join('');
}

// Render NFT Collection
function renderNFTs() {
    const grid = document.getElementById('nft-grid');
    const nfts = userStats.nftCollection || [];
    
    if (nfts.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-icon">🖼️</div><p>No NFTs yet. Start minting!</p></div>';
        return;
    }
    
    grid.innerHTML = nfts.map(nft => `
        <div class="nft-card">
            <div class="nft-tier ${nft.tier.toLowerCase()}">${nft.tier}</div>
            <div class="nft-icon">💎</div>
            <div class="nft-boost">${nft.boost}x Boost</div>
        </div>
    `).join('');
}

// Render Referral System
function renderReferrals() {
    const refCount = userStats.referrals || 0;
    const refEarned = userStats.referralEarnings || 0;
    
    document.getElementById('ref-count').textContent = refCount;
    document.getElementById('ref-earned').textContent = refEarned.toLocaleString();
    
    // Generate referral link
    const userId = userData.telegram_id || userData.wallet_address;
    const referralLink = `https://solanatamagotchi.com/?ref=${userId}`;
    document.getElementById('referral-link').value = referralLink;
    
    // Generate QR code
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = ''; // Clear existing
    new QRCode(qrContainer, {
        text: referralLink,
        width: 200,
        height: 200,
        colorDark: '#1D3557',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Render Avatar Picker
function renderAvatarPicker() {
    const picker = document.getElementById('avatar-picker');
    const currentAvatar = userData.avatar || AVATARS[0];
    
    picker.innerHTML = AVATARS.map(avatar => `
        <div class="avatar-option ${avatar === currentAvatar ? 'selected' : ''}" onclick="selectAvatar('${avatar}')">
            ${avatar}
        </div>
    `).join('');
}

// Select Avatar
async function selectAvatar(avatar) {
    try {
        // Update in database
        const response = await fetch(`${API_BASE}/api/profile-data.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update_avatar',
                user_id: userData.telegram_id || userData.wallet_address,
                avatar: avatar
            })
        });
        
        const data = await response.json();
        if (data.success) {
            userData.avatar = avatar;
            renderAvatarPicker();
            showSuccess('Avatar updated!');
        }
    } catch (error) {
        console.error('Failed to update avatar:', error);
        showError('Failed to update avatar');
    }
}

// Copy Referral Link
function copyReferralLink() {
    const input = document.getElementById('referral-link');
    input.select();
    document.execCommand('copy');
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✅ COPIED!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

// Helper Functions
function formatPlaytime(minutes) {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

function getTransactionIcon(type) {
    const icons = {
        'click': '🖱️',
        'minigame': '🎮',
        'nft_mint': '🖼️',
        'referral': '👥',
        'bonus': '🎁',
        'withdraw': '💸',
        'quest': '📋'
    };
    return icons[type] || '💰';
}

function getActivityIcon(type) {
    const icons = {
        'login': '🔐',
        'level_up': '⬆️',
        'achievement': '🏆',
        'nft_mint': '🖼️',
        'referral': '👥',
        'minigame': '🎮',
        'quest_complete': '✅'
    };
    return icons[type] || '📌';
}

function showSuccess(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#8AC926;color:white;padding:15px 25px;border-radius:10px;font-family:Press Start 2P;font-size:0.8rem;z-index:10000;animation:slideIn 0.3s;';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showError(message, isCritical = false) {
    if (isCritical) {
        // Show big error message for security/critical errors
        const loading = document.getElementById('loading');
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        
        if (loading) loading.style.display = 'none';
        if (errorDiv) {
            errorDiv.style.display = 'block';
            if (errorText) errorText.textContent = message;
        }
    } else {
        // Show toast notification for minor errors
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#f44336;color:white;padding:15px 25px;border-radius:10px;font-family:Press Start 2P;font-size:0.8rem;z-index:10000;animation:slideIn 0.3s;';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Disconnect Wallet Button
document.addEventListener('DOMContentLoaded', () => {
    const disconnectBtn = document.getElementById('disconnect-btn');
    
    // Show disconnect button only for wallet users
    if (window.WALLET_ADDRESS) {
        disconnectBtn.style.display = 'block';
    }
    
    // Also check after auth is ready
    window.addEventListener('authReady', () => {
        if (window.WALLET_ADDRESS) {
            disconnectBtn.style.display = 'block';
        }
    });
    
    // Disconnect handler
    disconnectBtn.addEventListener('click', async () => {
        if (!confirm('🔌 Disconnect wallet and return to main page?')) {
            return;
        }
        
        try {
            // Clear all auth data
            if (typeof window.GotchiAuth !== 'undefined' && window.GotchiAuth.logout) {
                await window.GotchiAuth.logout();
            }
            
            // Clear localStorage
            localStorage.removeItem('walletAddress');
            localStorage.removeItem('authTimestamp');
            localStorage.removeItem('gameState');
            
            // Clear session storage
            sessionStorage.clear();
            
            showMessage('👋 Wallet disconnected!');
            
            // Redirect to main page after 1 second
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('❌ Disconnect error:', error);
            showError('Failed to disconnect wallet');
        }
    });
    
    // Share Profile Button
    const shareBtn = document.getElementById('share-profile-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const profileUrl = window.location.href;
            const shareData = {
                title: '🎮 My Solana Tamagotchi Profile',
                text: `Check out my Solana Tamagotchi profile! Level ${userData?.level || '?'}, ${userData?.tama || 0} TAMA earned!`,
                url: profileUrl
            };
            
            // Try Web Share API first (mobile)
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                    showMessage('📤 Profile shared!');
                    
                    // Track share event
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'share', {
                            method: 'Web Share API',
                            content_type: 'profile',
                            item_id: userData?.userId || 'unknown'
                        });
                    }
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error('Share failed:', error);
                    }
                }
            } else {
                // Fallback: Copy to clipboard
                try {
                    await navigator.clipboard.writeText(profileUrl);
                    showMessage('📋 Profile link copied to clipboard!');
                    
                    // Track copy event
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'share', {
                            method: 'Clipboard',
                            content_type: 'profile',
                            item_id: userData?.userId || 'unknown'
                        });
                    }
                } catch (error) {
                    console.error('Copy failed:', error);
                    showError('Failed to copy link');
                }
            }
        });
    }
});

