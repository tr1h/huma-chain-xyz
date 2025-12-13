/**
 * Admin Panel Environment Configuration
 * This file contains API endpoints and configuration for admin panels
 * Uses centralized config if available
 */

window.AdminEnv = {
    // Supabase Configuration - use centralized config
    SUPABASE_URL: window.CONFIG?.SUPABASE_URL || 'https://zfrazyupameidxpjihrh.supabase.co',
    SUPABASE_KEY: window.CONFIG?.SUPABASE_KEY || '',
    
    // TAMA API Base URL (Custom Domain)
    TAMA_API_BASE: window.CONFIG?.API_BASE || 'https://api.solanatamagotchi.com/api/tama'
};

console.log('✅ Admin Environment loaded:', {
    supabase: window.AdminEnv.SUPABASE_URL,
    api: window.AdminEnv.TAMA_API_BASE
});

