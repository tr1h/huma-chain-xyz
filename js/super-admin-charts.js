/**
 * рџ“Љ SUPER ADMIN ADVANCED CHARTS
 * Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ РіСЂР°С„РёРєРё РґР»СЏ super-admin.html:
 * - DAU (Daily Active Users)
 * - Revenue (SOL + TAMA)
 * - Referral Tree
 * - Site Visits & Unique Visitors
 */

// Global Chart instances
let dauChart, revenueChart, referralTreeChart, siteVisitsChart;

/**
 * рџ“€ DAU Chart (Daily Active Users)
 */
async function createDAUChart(players) {
    const canvas = document.getElementById('dau-chart');
    if (!canvas) {
        console.warn('DAU chart canvas not found');
        return;
    }

    // Calculate DAU for last 30 days
    const today = new Date();
    const labels = [];
    const dauData = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

        // Count players active on this day
        const activeCount = players.filter(p => {
            if (!p.last_activity) return false;
            const lastActive = new Date(p.last_activity).toISOString().split('T')[0];
            return lastActive === dateStr;
        }).length;

        dauData.push(activeCount);
    }

    if (dauChart) dauChart.destroy();

    dauChart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Active Users',
                data: dauData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Update stats
    const todayDAU = dauData[dauData.length - 1];
    const yesterdayDAU = dauData[dauData.length - 2];
    const dauChange = todayDAU - yesterdayDAU;

    document.getElementById('dau-today').textContent = todayDAU;
    document.getElementById('dau-change').textContent = `${dauChange >= 0 ? '+' : ''}${dauChange} vs yesterday`;
    document.getElementById('dau-change').className = dauChange >= 0 ? 'stat-change positive' : 'stat-change negative';
}

/**
 * рџ’° Revenue Chart (SOL + TAMA)
 */
async function createRevenueChart() {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas) {
        console.warn('Revenue chart canvas not found');
        return;
    }

    // Fetch NFT sales data
    const nftsResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts?select=*&order=created_at.desc`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });

    if (!nftsResponse.ok) {
        console.error('Failed to fetch NFTs');
        return;
    }

    const nfts = await nftsResponse.json();

    // Group by day
    const revenueByDay = {};

    nfts.forEach(nft => {
        const date = new Date(nft.created_at).toISOString().split('T')[0];

        if (!revenueByDay[date]) {
            revenueByDay[date] = { sol: 0, tama: 0 };
        }

        if (nft.cost_sol) {
            revenueByDay[date].sol += parseFloat(nft.cost_sol);
        }
        if (nft.cost_tama) {
            revenueByDay[date].tama += parseFloat(nft.cost_tama);
        }
    });

    // Prepare data for last 30 days
    const today = new Date();
    const labels = [];
    const solData = [];
    const tamaData = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

        const dayRevenue = revenueByDay[dateStr] || { sol: 0, tama: 0 };
        solData.push(dayRevenue.sol);
        tamaData.push(dayRevenue.tama / 1000); // Convert to thousands for better visualization
    }

    if (revenueChart) revenueChart.destroy();

    revenueChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'SOL Revenue',
                    data: solData,
                    backgroundColor: 'rgba(138, 201, 38, 0.7)',
                    borderColor: '#8AC926',
                    borderWidth: 1
                },
                {
                    label: 'TAMA Revenue (K)',
                    data: tamaData,
                    backgroundColor: 'rgba(255, 183, 3, 0.7)',
                    borderColor: '#FFB703',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.datasetIndex === 0) {
                                label += context.parsed.y.toFixed(2) + ' SOL';
                            } else {
                                label += (context.parsed.y * 1000).toFixed(0) + ' TAMA';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Update revenue stats
    const totalSOL = solData.reduce((a, b) => a + b, 0);
    const totalTAMA = tamaData.reduce((a, b) => a + b, 0) * 1000;

    document.getElementById('total-sol-revenue').textContent = totalSOL.toFixed(2) + ' SOL';
    document.getElementById('total-tama-revenue').textContent = Math.round(totalTAMA).toLocaleString() + ' TAMA';
}

/**
 * рџЊі Referral Tree Visualization
 */
async function createReferralTree() {
    const container = document.getElementById('referral-tree');
    if (!container) {
        console.warn('Referral tree container not found');
        return;
    }

    // Fetch referral data
    const referralsResponse = await fetch(`${SUPABASE_URL}/rest/v1/referrals?select=*`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });

    if (!referralsResponse.ok) {
        container.innerHTML = '<p style="text-align: center; padding: 40px;">Failed to load referral data</p>';
        return;
    }

    const referrals = await referralsResponse.json();

    // Build tree structure
    const referralMap = {};
    referrals.forEach(ref => {
        if (!referralMap[ref.referrer_telegram_id]) {
            referralMap[ref.referrer_telegram_id] = [];
        }
        referralMap[ref.referrer_telegram_id].push(ref);
    });

    // Find top referrers
    const topReferrers = Object.entries(referralMap)
        .map(([telegram_id, refs]) => ({
            telegram_id,
            count: refs.length,
            referrals: refs
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    if (topReferrers.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px;">No referrals yet</p>';
        return;
    }

    // Render tree
    let html = '<div style="max-height: 500px; overflow-y: auto; padding: 20px;">';

    topReferrers.forEach((referrer, index) => {
        html += `
            <div style="background: rgba(102, 126, 234, 0.1); border-left: 4px solid #667eea; padding: 15px; margin: 10px 0; border-radius: 8px;">
                <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 10px;">
                    ${index + 1}. User ${referrer.telegram_id} <span style="color: #667eea;">(${referrer.count} referrals)</span>
                </div>
                <div style="padding-left: 20px; display: grid; gap: 5px;">
        `;

        referrer.referrals.forEach((ref, refIndex) => {
            const status = ref.status === 'active' ? 'вњ…' : 'вЏі';
            html += `
                <div style="font-size: 0.9em; opacity: 0.8;">
                    ${status} в†’ User ${ref.referred_telegram_id} (${new Date(ref.created_at).toLocaleDateString()})
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

/**
 * рџ“Љ Site Visits & Unique Visitors Chart
 */
async function createSiteVisitsChart() {
    const canvas = document.getElementById('site-visits-chart');
    if (!canvas) {
        console.warn('Site visits chart canvas not found');
        return;
    }

    // Fetch site visits data
    const visitsResponse = await fetch(`${SUPABASE_URL}/rest/v1/site_visits?select=*&order=visit_date.desc`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });

    if (!visitsResponse.ok) {
        console.error('Failed to fetch site visits');
        return;
    }

    const visits = await visitsResponse.json();

    // Group by day
    const visitsByDay = {};
    const uniqueVisitorsByDay = {};

    visits.forEach(visit => {
        const date = visit.visit_date;

        if (!visitsByDay[date]) {
            visitsByDay[date] = 0;
            uniqueVisitorsByDay[date] = new Set();
        }

        visitsByDay[date]++;
        if (visit.session_id) {
            uniqueVisitorsByDay[date].add(visit.session_id);
        }
    });

    // Prepare data for last 30 days
    const today = new Date();
    const labels = [];
    const visitsData = [];
    const uniqueData = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

        visitsData.push(visitsByDay[dateStr] || 0);
        uniqueData.push(uniqueVisitorsByDay[dateStr] ? uniqueVisitorsByDay[dateStr].size : 0);
    }

    if (siteVisitsChart) siteVisitsChart.destroy();

    siteVisitsChart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Site Visits',
                    data: visitsData,
                    borderColor: '#14F195',
                    backgroundColor: 'rgba(20, 241, 149, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Unique Visitors',
                    data: uniqueData,
                    borderColor: '#9945FF',
                    backgroundColor: 'rgba(153, 69, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * рџ”„ Initialize all advanced charts
 */
async function initAdvancedCharts() {
    try {
        // [cleaned]

        // Fetch data
        const playersResponse = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=tama.desc`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!playersResponse.ok) {
            throw new Error('Failed to fetch players');
        }

        const players = await playersResponse.json();

        // Create charts
        await createDAUChart(players);
        await createRevenueChart();
        await createReferralTree();
        await createSiteVisitsChart();

        // [cleaned]
    } catch (error) {
        console.error('вќЊ Error initializing advanced charts:', error);
    }
}

// Export functions
window.initAdvancedCharts = initAdvancedCharts;
window.createDAUChart = createDAUChart;
window.createRevenueChart = createRevenueChart;
window.createReferralTree = createReferralTree;
window.createSiteVisitsChart = createSiteVisitsChart;

// [cleaned]


