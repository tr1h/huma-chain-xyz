/**
 * Local dev auth helper (localhost only).
 * Enable with: ?dev=1
 */
(function () {
  'use strict';

  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const params = new URLSearchParams(window.location.search);
  const enabled = isLocalhost && params.get('dev') === '1';
  if (!enabled) return;

  const KEY = 'tama_dev_auth_v1';

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  function loadState() {
    const raw = localStorage.getItem(KEY);
    return safeParse(raw) || {};
  }

  function saveState(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function applyState(state) {
    const tg = state.telegramUserId ? String(state.telegramUserId).trim() : '';
    const walletAddr = state.walletAddress ? String(state.walletAddress).trim() : '';
    const walletUserId = state.walletUserId ? String(state.walletUserId).trim() : '';

    if (tg) {
      window.TELEGRAM_USER_ID = tg;
    }

    if (walletAddr) {
      window.WALLET_ADDRESS = walletAddr;
      window.WALLET_USER_ID = walletUserId || `dev_${walletAddr.slice(0, 8)}`;
    } else if (walletUserId) {
      window.WALLET_USER_ID = walletUserId;
    }

    window.__DEV_AUTH__ = {
      enabled: true,
      telegramUserId: tg || null,
      walletAddress: walletAddr || null,
      walletUserId: (walletAddr ? (walletUserId || `dev_${walletAddr.slice(0, 8)}`) : (walletUserId || null))
    };
  }

  // Auto-apply state
  const initialState = loadState();
  applyState(initialState);

  // UI
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Dev Auth';
  btn.style.cssText = [
    'position:fixed',
    'right:12px',
    'bottom:12px',
    'z-index:99999',
    'padding:10px 12px',
    'border-radius:12px',
    'border:2px solid rgba(255,255,255,0.18)',
    'background:rgba(0,0,0,0.55)',
    'color:#fff',
    'font-family:inherit',
    'cursor:pointer'
  ].join(';');

  const panel = document.createElement('div');
  panel.style.cssText = [
    'position:fixed',
    'right:12px',
    'bottom:58px',
    'z-index:99999',
    'width:min(360px, calc(100vw - 24px))',
    'background:rgba(0,0,0,0.75)',
    'border:2px solid rgba(236,72,153,0.35)',
    'border-radius:14px',
    'padding:12px',
    'color:#fff',
    'backdrop-filter:blur(10px)',
    'display:none'
  ].join(';');

  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px;">
      <div style="font-weight:700;">Local Dev Auth</div>
      <button id="dev-auth-close" type="button" style="background:rgba(255,255,255,0.08); color:#fff; border:1px solid rgba(255,255,255,0.2); border-radius:10px; padding:6px 10px; cursor:pointer;">✕</button>
    </div>
    <div style="font-size:12px; opacity:0.9; margin-bottom:10px;">Enabled because <code>?dev=1</code> on localhost.</div>
    <label style="display:block; font-size:12px; opacity:0.9; margin-top:8px;">Telegram User ID</label>
    <input id="dev-auth-tg" placeholder="e.g. 7401131043" style="width:100%; padding:8px 10px; border-radius:10px; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:#fff;" />
    <label style="display:block; font-size:12px; opacity:0.9; margin-top:8px;">Wallet Address (optional)</label>
    <input id="dev-auth-wallet" placeholder="Phantom address..." style="width:100%; padding:8px 10px; border-radius:10px; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:#fff;" />
    <label style="display:block; font-size:12px; opacity:0.9; margin-top:8px;">Wallet User ID (optional)</label>
    <input id="dev-auth-wallet-id" placeholder="will auto-generate" style="width:100%; padding:8px 10px; border-radius:10px; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:#fff;" />
    <div style="display:flex; gap:8px; margin-top:10px;">
      <button id="dev-auth-save" type="button" style="flex:1; padding:10px; border-radius:12px; border:none; background:linear-gradient(135deg,#10b981,#059669); color:#fff; font-weight:700; cursor:pointer;">Save</button>
      <button id="dev-auth-clear" type="button" style="flex:1; padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.08); color:#fff; font-weight:700; cursor:pointer;">Clear</button>
    </div>
    <div style="font-size:11px; opacity:0.85; margin-top:10px; line-height:1.35;">
      After save: refresh the page.
    </div>
  `;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const tgEl = panel.querySelector('#dev-auth-tg');
    const walletEl = panel.querySelector('#dev-auth-wallet');
    const walletIdEl = panel.querySelector('#dev-auth-wallet-id');
    const closeEl = panel.querySelector('#dev-auth-close');
    const saveEl = panel.querySelector('#dev-auth-save');
    const clearEl = panel.querySelector('#dev-auth-clear');

    const state = loadState();
    if (tgEl) tgEl.value = state.telegramUserId || '';
    if (walletEl) walletEl.value = state.walletAddress || '';
    if (walletIdEl) walletIdEl.value = state.walletUserId || '';

    function show(showing) {
      panel.style.display = showing ? 'block' : 'none';
    }

    btn.addEventListener('click', () => {
      show(panel.style.display === 'none');
    });

    if (closeEl) closeEl.addEventListener('click', () => show(false));

    if (saveEl) {
      saveEl.addEventListener('click', () => {
        const next = {
          telegramUserId: tgEl ? tgEl.value.trim() : '',
          walletAddress: walletEl ? walletEl.value.trim() : '',
          walletUserId: walletIdEl ? walletIdEl.value.trim() : ''
        };
        saveState(next);
        applyState(next);
        show(false);
        alert('Saved dev auth. Refresh the page to re-init game with this ID.');
      });
    }

    if (clearEl) {
      clearEl.addEventListener('click', () => {
        localStorage.removeItem(KEY);
        applyState({});
        if (tgEl) tgEl.value = '';
        if (walletEl) walletEl.value = '';
        if (walletIdEl) walletIdEl.value = '';
        show(false);
        alert('Cleared dev auth. Refresh the page.');
      });
    }
  });
})();
