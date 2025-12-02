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

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadProfile();
});

// Load Profile Data
async function loadProfile() {
    try {
        // Get user ID from URL or auth
        const urlParams = new URLSearchParams(window.location.search);
        let userId = urlParams.get('user_id') || window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
        
        // If it's a wallet user, use full wallet address instead of user_id
        if (userId && userId.startsWith('wallet_') && window.WALLET_ADDRESS) {
            userId = window.WALLET_ADDRESS; // Use full wallet address
            console.log('🔍 Using full wallet address for profile:', userId);
        }
        
        if (!userId) {
            showError('No user ID found. Please login.');
            return;
        }
        
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

// Render TAMA Balance Chart
function renderChart() {
    const ctx = document.getElementById('tama-chart').getContext('2d');
    
    // Generate sample data (last 7 days)
    const labels = [];
    const dataPoints = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Simulate growth (in real app, fetch from database)
        const growth = Math.floor((userStats.tama || 0) * (0.5 + (6 - i) * 0.1));
        dataPoints.push(growth);
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
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: 8
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: 8
                        }
                    }
                }
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

function showError(message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#f44336;color:white;padding:15px 25px;border-radius:10px;font-family:Press Start 2P;font-size:0.8rem;z-index:10000;animation:slideIn 0.3s;';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

