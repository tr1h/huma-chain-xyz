// AdminEnv: lightweight ENV loader for static admin pages
// Sources priority: URL params > localStorage > defaults
(function () {
  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || undefined;
  }

  // You can hardcode your public anon settings here to avoid manual input
  const defaults = {
    SUPABASE_URL: 'https://zfrazyupameidxpjihrh.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU',
    TAMA_API_BASE: 'https://huma-chain-xyz-production.up.railway.app/api/tama',
    REF_API_BASE: ''
  };

  const cfg = {
    SUPABASE_URL: getParam('supabase_url') || localStorage.getItem('SUPABASE_URL') || defaults.SUPABASE_URL,
    SUPABASE_KEY: getParam('supabase_key') || localStorage.getItem('SUPABASE_KEY') || defaults.SUPABASE_KEY,
    TAMA_API_BASE: getParam('tama_api') || localStorage.getItem('TAMA_API_BASE') || defaults.TAMA_API_BASE,
    REF_API_BASE: getParam('ref_api') || localStorage.getItem('REF_API_BASE') || defaults.REF_API_BASE
  };

  // Persist params to localStorage for future loads
  Object.entries(cfg).forEach(([k, v]) => {
    if (v) localStorage.setItem(k, v);
  });

  window.AdminEnv = cfg;
})();


