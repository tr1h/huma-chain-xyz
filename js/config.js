/**
 * 🔒 Centralized Configuration for Solana Tamagotchi
 * 
 * Single source of truth for all configuration.
 * Supports devnet (current) and mainnet (future).
 * 
 * Usage:
 *   <script src="js/config.js"></script>
 *   const supabase = window.getSupabase();
 *   // or: window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
 */

(function() {
  'use strict';

  // ============================================
  // 🌐 NETWORK CONFIGURATION
  // ============================================
  // Change this to 'mainnet' when ready for production
  const SOLANA_NETWORK = 'devnet'; // 'devnet' | 'mainnet'

  // Network-specific settings
  const NETWORK_CONFIG = {
    devnet: {
      RPC_URL: 'https://api.devnet.solana.com',
      EXPLORER_URL: 'https://explorer.solana.com/?cluster=devnet',
      TAMA_MINT: '', // Set when deployed to devnet
    },
    mainnet: {
      RPC_URL: 'https://api.mainnet-beta.solana.com',
      // Alternative RPCs for mainnet (uncomment preferred):
      // RPC_URL: 'https://solana-mainnet.g.alchemy.com/v2/YOUR_KEY',
      // RPC_URL: 'https://rpc.helius.xyz/?api-key=YOUR_KEY',
      EXPLORER_URL: 'https://explorer.solana.com',
      TAMA_MINT: '', // Set when deployed to mainnet
    }
  };

  // ============================================
  // 🔍 ENVIRONMENT DETECTION  
  // ============================================
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isGithubPages = hostname.includes('github.io');
  const isProduction = hostname === 'solanatamagotchi.com' || hostname === 'www.solanatamagotchi.com';
  const isDev = isLocalhost || isGithubPages;

  // ============================================
  // 📦 MAIN CONFIGURATION
  // ============================================
  const CONFIG = {
    // Environment info
    ENV: isDev ? 'development' : 'production',
    IS_DEV: isDev,
    IS_PRODUCTION: isProduction,
    VERSION: '1.0.0',

    // ==========================================
    // 🗄️ SUPABASE
    // ==========================================
    SUPABASE_URL: 'https://zfrazyupameidxpjihrh.supabase.co',
    
    // Anon Key - public, restricted by RLS policies
    SUPABASE_KEY: (function() {
      if (window.ENV?.SUPABASE_KEY) return window.ENV.SUPABASE_KEY;
      if (window.AdminEnv?.SUPABASE_KEY) return window.AdminEnv.SUPABASE_KEY;
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';
    })(),

    // ==========================================
    // 🌐 API ENDPOINTS
    // ==========================================
    API_BASE: 'https://api.solanatamagotchi.com/api/tama',
    
    // ==========================================
    // ⛓️ SOLANA CONFIGURATION
    // ==========================================
    SOLANA: {
      NETWORK: SOLANA_NETWORK,
      IS_MAINNET: SOLANA_NETWORK === 'mainnet',
      IS_DEVNET: SOLANA_NETWORK === 'devnet',
      RPC_URL: NETWORK_CONFIG[SOLANA_NETWORK].RPC_URL,
      EXPLORER_URL: NETWORK_CONFIG[SOLANA_NETWORK].EXPLORER_URL,
      TAMA_MINT: NETWORK_CONFIG[SOLANA_NETWORK].TAMA_MINT,
      TAMA_DECIMALS: 9,
    },

    // ==========================================
    // 🎮 GAME URLS
    // ==========================================
    URLS: {
      GAME: 'https://solanatamagotchi.com/tamagotchi-game.html',
      MINT: 'https://solanatamagotchi.com/mint.html',
      SLOTS: 'https://solanatamagotchi.com/slots.html',
      WHEEL: 'https://solanatamagotchi.com/wheel.html',
      PROFILE: 'https://solanatamagotchi.com/profile.html',
      MARKETPLACE: 'https://solanatamagotchi.com/marketplace.html',
    },

    // ==========================================
    // 🤖 TELEGRAM
    // ==========================================
    TELEGRAM: {
      BOT_USERNAME: 'GotchiGameBot',
      CHANNEL: '@GotchiGame',
      CHAT: '@gotchigamechat',
    },

    // ==========================================
    // ⚙️ GAME SETTINGS
    // ==========================================
    GAME: {
      MAX_SPINS_PER_DAY: 30,
      JACKPOT_CONTRIBUTION: 0.05, // 5% of bet goes to jackpot
      REFERRAL_BONUS: 0.10, // 10% referral bonus
      MIN_BET: 100,
      MAX_BET_PERCENT: 0.5, // 50% of balance max
    },

    // ==========================================
    // 🔒 SECURITY
    // ==========================================
    SECURITY: {
      RATE_LIMIT_PER_MINUTE: 100,
      SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days
      MAX_FAILED_LOGINS: 5,
    },

    // ==========================================
    // 🚀 FEATURE FLAGS
    // ==========================================
    FEATURES: {
      SOUND_ENABLED: true,
      ANALYTICS_ENABLED: isProduction,
      DEBUG_MODE: isDev,
      MAINNET_READY: false, // Set to true when ready for mainnet
      NFT_MINTING: true,
      MARKETPLACE: true,
      REFERRALS: true,
    }
  };

  // Freeze to prevent modification
  Object.freeze(CONFIG);
  Object.freeze(CONFIG.SOLANA);
  Object.freeze(CONFIG.URLS);
  Object.freeze(CONFIG.TELEGRAM);
  Object.freeze(CONFIG.GAME);
  Object.freeze(CONFIG.SECURITY);
  Object.freeze(CONFIG.FEATURES);

  // ============================================
  // 🔧 HELPER FUNCTIONS
  // ============================================
  
  // Lazy Supabase client
  let _supabaseClient = null;
  window.getSupabase = function() {
    if (!_supabaseClient && window.supabase) {
      _supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    }
    return _supabaseClient;
  };

  // Get explorer URL for transaction/address
  window.getExplorerUrl = function(hashOrAddress, type = 'tx') {
    const base = CONFIG.SOLANA.EXPLORER_URL;
    const cluster = CONFIG.SOLANA.IS_DEVNET ? '?cluster=devnet' : '';
    return `${base}/${type}/${hashOrAddress}${cluster}`;
  };

  // Check if mainnet ready
  window.isMainnetReady = function() {
    return CONFIG.FEATURES.MAINNET_READY && CONFIG.SOLANA.IS_MAINNET;
  };

  // Export config
  window.CONFIG = CONFIG;

  // Log in dev mode
  if (CONFIG.IS_DEV) {
    console.log('🔧 Config loaded:', {
      ENV: CONFIG.ENV,
      NETWORK: CONFIG.SOLANA.NETWORK,
      API: CONFIG.API_BASE,
      VERSION: CONFIG.VERSION
    });
  }

})();
