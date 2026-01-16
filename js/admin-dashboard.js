// 🎮 Admin Dashboard Logic (Extracted)

// --- AUTH ---
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function checkAuth() {
  const pass = document.getElementById('admin-pass').value;
  const errorMsg = document.getElementById('auth-error'); // Fixed ID reference

  // Use hash from admin-password.js
  const targetHash =
    window.ADMIN_PASSWORD_HASH ||
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // Fallback to "admin" if missing

  const inputHash = await sha256(pass);

  if (inputHash === targetHash) {
    document.getElementById('auth-screen').classList.add('hidden');
    // Save session
    sessionStorage.setItem('admin_auth', 'true');
    initApp();
  } else {
    if (errorMsg) {
      errorMsg.classList.remove('hidden');
      errorMsg.innerText = '❌ Invalid Password';
    } else {
      alert('❌ Invalid Password');
    }
  }
}

function checkSession() {
  if (sessionStorage.getItem('admin_auth') === 'true') {
    document.getElementById('auth-screen').classList.add('hidden');
    initApp();
  }
}

function logout() {
  sessionStorage.removeItem('admin_auth');
  location.reload();
}

// --- NAVIGATION ---
function showSection(id) {
  document
    .querySelectorAll('main > div[id^="section-"]')
    .forEach((el) => el.classList.add('hidden'));
  document.getElementById(`section-${id}`).classList.remove('hidden');

  document.querySelectorAll('.sidebar-link').forEach((el) => el.classList.remove('active'));
  document.getElementById(`nav-${id}`).classList.add('active');

  if (id === 'players') loadPlayers();
  if (id === 'transactions') loadTransactions();
  if (id === 'slots-config') loadJackpot();
}

// --- APP LOGIC ---
let SUPABASE_URL = '';
let SUPABASE_KEY = '';
let charts = {}; // Store chart instances
let lastTxId = 0; // For live feed tracking

async function initApp() {
  // Load Config
  if (window.CONFIG) {
    SUPABASE_URL = window.CONFIG.SUPABASE_URL;
    SUPABASE_KEY = window.CONFIG.SUPABASE_ANON_KEY || window.CONFIG.SUPABASE_KEY; // Handle unified config keys
  }

  if (typeof Chart !== 'undefined') {
    initCharts();
  }

  refreshData();
  // Start Live Feed Poll
  setInterval(fetchLiveFeed, 5000); // Check every 5s
  fetchLiveFeed();
  // Auto-refresh stats every 30s
  setInterval(refreshData, 30000);
}

async function supabaseCall(endpoint, method = 'GET', body = null) {
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, options);
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function refreshData() {
  // Dashboard Stats
  // Fetches all users to sum clicks - might be heavy in prod but fine for admin dashboard now
  const users = await supabaseCall('wallet_users?select=id,total_clicks,tama_balance');
  const count = users ? users.length : 0;

  let totalClicks = 0;
  let totalSupply = 0;
  if (users) {
    users.forEach((u) => {
      totalClicks += u.total_clicks || 0;
      totalSupply += u.tama_balance || 0;
    });
  }

  // Transactions count (24h)
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  //   const txs24h = await supabaseCall(
  //     `transactions?created_at=gt.${yesterday}&select=count`,
  //     'HEAD'
  //   );
  const txsRecent = await supabaseCall(`transactions?created_at=gt.${yesterday}&select=id`);
  const txCount = txsRecent ? txsRecent.length : 0;

  document.getElementById('stat-users').innerText = count.toLocaleString();
  document.getElementById('stat-supply').innerText = totalSupply.toLocaleString();
  document.getElementById('stat-txs').innerText = txCount.toLocaleString();
  document.getElementById('stat-clicks').innerText = totalClicks.toLocaleString();

  // Update Charts Data
  updateChartsData(users, txsRecent);

  // Jackpot
  // loadJackpot(); // Use safely if exists
}

// --- CHARTS ---
function initCharts() {
  // Activity Chart
  const ctxActivity = document.getElementById('activityChart');
  if (!ctxActivity) return;

  charts.activity = new Chart(ctxActivity.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [
        {
          label: 'Transactions',
          data: [0, 0, 0, 0, 0, 0], // Placeholder
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'New Users',
          data: [0, 0, 0, 0, 0, 0], // Placeholder
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
        x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      },
    },
  });

  // Tokenomics Chart
  const ctxTokenomics = document.getElementById('tokenomicsChart');
  if (!ctxTokenomics) return;

  charts.tokenomics = new Chart(ctxTokenomics.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['User Holdings', 'Treasury', 'Jackpot Pool', 'Burned'],
      datasets: [
        {
          data: [70, 10, 5, 15], // Initial Mock
          backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#64748b'],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } },
    },
  });
}

function updateChartsData(users, recentTxs) {
  if (!charts.activity || !charts.tokenomics) return;

  // Activity Chart Updates (Random deviation for liveliness effect if data static)
  const newData = charts.activity.data.datasets[0].data.map((v) =>
    Math.max(0, v + (Math.random() * 10 - 5))
  );
  charts.activity.update();

  // Tokenomics updates
  let userBals = 0;
  if (users) users.forEach((u) => (userBals += u.tama_balance || 0));

  // Assume jackpot is loaded
  //   let jackpot =
  //     parseInt(
  //       document.getElementById('stat-jackpot')?.innerText.replace(/,/g, '').replace(' TAMA', '')
  //     ) || 0;
  let jackpot = 0; // Placeholder until jackpot logic is unified

  charts.tokenomics.data.datasets[0].data = [userBals, 5000000, jackpot, 1000000]; // Mock treasury/burn
  charts.tokenomics.update();
}

// --- LIVE FEED ---
async function fetchLiveFeed() {
  // Get latest 10 transactions
  const txs = await supabaseCall('transactions?order=created_at.desc&limit=10');
  if (!txs) return;

  const feedContainer = document.getElementById('live-feed');
  if (!feedContainer) return;

  // If first load, clear placeholder
  if (feedContainer.querySelector('.text-center')) feedContainer.innerHTML = '';

  let html = '';
  txs.forEach((tx) => {
    const time = new Date(tx.created_at).toLocaleTimeString();
    const isWin = tx.amount > 0;
    const colorClass = isWin ? 'text-green-400' : 'text-red-400';
    const icon = isWin ? '📥' : '📤';

    // Detect click "transactions" (if we add them)
    let typeIcon = '💸';
    if (tx.type === 'spin_cost') typeIcon = '🎰';
    if (tx.type === 'spin_reward') typeIcon = '🎉';
    if (tx.type === 'daily_reward') typeIcon = '📅';
    if (tx.type === 'click_session' || tx.type.includes('click')) typeIcon = '🖱️';
    if (tx.type === 'earn_click') typeIcon = '🖱️';
    if (tx.type === 'level_up') typeIcon = '🆙';
    if (tx.type === 'spend_feed') typeIcon = '🍔';

    let displayAmount = `${isWin ? '+' : ''}${tx.amount}`;
    let displayClass = colorClass;

    // Handle click session metadata
    if (tx.type === 'click_session' && tx.metadata) {
      let clicks = 0;
      try {
        const meta = typeof tx.metadata === 'string' ? JSON.parse(tx.metadata) : tx.metadata;
        clicks = meta.clicks || 0;
      } catch (e) {}

      if (clicks > 0) {
        displayAmount = `+${clicks} Clicks`;
        displayClass = 'text-pink-400';
      }
    }

    // Handle earn_click metadata (individual clicks)
    if (tx.type === 'earn_click' && tx.metadata) {
      if (tx.metadata.is_combo) {
        displayAmount += ' 🔥';
        displayClass = 'text-orange-400 font-bold';
      }
    }

    html += `
          <div class="p-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors flex justify-between items-center text-sm">
              <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-500 font-mono">${time}</span>
                  <div>
                      <div class="text-slate-300 font-medium flex items-center gap-2">
                          <span>${typeIcon}</span>
                          <span>${tx.type}</span>
                      </div>
                      <div class="text-xs text-slate-600 font-mono">${
                        tx.wallet_address
                          ? tx.wallet_address.substring(0, 8) + '...'
                          : tx.username || 'User'
                      }</div>
                  </div>
              </div>
              <div class="text-right">
                  <div class="${displayClass} font-bold font-mono">${displayAmount}</div>
              </div>
          </div>
        `;
  });

  if (feedContainer.innerHTML !== html) {
    feedContainer.innerHTML = html;
  }
}

// --- PLAYERS ---
async function loadPlayers() {
  const tbody = document.getElementById('players-table-body');
  if (!tbody) return;

  tbody.innerHTML =
    '<tr><td colspan="5" class="p-6 text-center"><div class="loading-spinner mx-auto"></div></td></tr>';

  // Fetch both wallet and telegram users (simplified to 20 recent for now)
  const wallets = (await supabaseCall('wallet_users?order=tama_balance.desc&limit=20')) || [];

  let html = '';

  wallets.forEach((u) => {
    html += `
              <tr class="hover:bg-slate-800/50 transition-colors">
                  <td class="px-6 py-4 font-medium text-white">
                      ${u.username || 'Wallet User'}<br>
                      <span class="text-xs text-slate-500 font-mono">${u.wallet_address.substring(
                        0,
                        8
                      )}...</span>
                  </td>
                  <td class="px-6 py-4 font-mono text-emerald-400 font-bold">${u.tama_balance.toLocaleString()} TAMA</td>
                  <td class="px-6 py-4">Lvl ${u.level}</td>
                  <td class="px-6 py-4"><span class="px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs text-center border border-green-500/20">Active</span></td>
                  <td class="px-6 py-4 text-right">
                      <button onclick="editUser('${u.wallet_address}', 'wallet', ${
      u.tama_balance
    })" class="text-blue-400 hover:text-blue-300 text-sm font-bold">Edit</button>
                  </td>
              </tr>
          `;
  });

  tbody.innerHTML = html;
}

// --- EDIT USER ---
function editUser(id, type, currentBal) {
  const modal = document.getElementById('user-modal');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
          <div>
             <label class="block text-sm text-slate-400 mb-1">Set Balance</label>
             <input type="number" id="edit-balance" value="${currentBal}" class="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white">
          </div>
          <div class="flex gap-3 mt-6">
              <button onclick="saveUserBalance('${id}', '${type}')" class="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded">Save</button>
              <button onclick="closeModal()" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded">Cancel</button>
          </div>
      `;

  document.getElementById('modal-title').innerText = `Edit User ${id.substring(0, 6)}...`;
  modal.classList.remove('hidden');
}

async function saveUserBalance(id, type) {
  const newBal = parseInt(document.getElementById('edit-balance').value);

  // Save to DB
  if (type === 'wallet') {
    await supabaseCall(`wallet_users?wallet_address=eq.${id}`, 'PATCH', {
      tama_balance: newBal,
    });

    // ADD TRANSACTION
    await supabaseCall('transactions', 'POST', {
      user_id: `admin_edit_${id.substring(0, 8)}`,
      wallet_address: id,
      amount: 0, // Should calculate diff
      type: 'admin_adjustment',
      balance_after: newBal,
      metadata: { admin_action: 'manual_balance_set' },
    });
  }

  closeModal();
  loadPlayers();
}

function closeModal() {
  document.getElementById('user-modal').classList.add('hidden');
}

// --- TRANSACTIONS ---
async function loadTransactions(page = 1) {
  const tbody = document.getElementById('tx-table-body');
  if (!tbody) return;

  if (page === 1) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="p-6 text-center"><div class="loading-spinner mx-auto"></div></td></tr>';
  }

  const txs = (await supabaseCall('transactions?order=created_at.desc&limit=50')) || [];

  let html = '';
  txs.forEach((tx) => {
    const date = new Date(tx.created_at).toLocaleString();
    const isPos = tx.amount >= 0;

    // Determine username/wallet
    const user = tx.wallet_address
      ? tx.wallet_address.substring(0, 8) + '...'
      : tx.username || (tx.telegram_id ? `TG:${tx.telegram_id}` : 'User');

    html += `
              <tr class="hover:bg-slate-800/50">
                  <td class="px-6 py-4 text-xs text-slate-500">${date}</td>
                  <td class="px-6 py-4 text-xs font-mono text-slate-400">${user}</td>
                  <td class="px-6 py-4"><span class="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs">${
                    tx.type
                  }</span></td>
                  <td class="px-6 py-4 text-right font-bold ${
                    isPos ? 'text-green-400' : 'text-red-400'
                  }">${isPos ? '+' : ''}${tx.amount}</td>
                  <td class="px-6 py-4 text-right font-mono text-slate-500">${
                    tx.balance_after !== null ? tx.balance_after : '-'
                  }</td>
              </tr>
          `;
  });

  if (page === 1) {
    tbody.innerHTML = html;
  } else {
    tbody.insertAdjacentHTML('beforeend', html);
  }
}

// Check session on load
window.onload = checkSession;
