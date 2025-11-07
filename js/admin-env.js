/**
 * Admin Panel Environment Configuration
 * This file contains API endpoints and configuration for admin panels
 */

window.AdminEnv = {
    // Supabase Configuration
    SUPABASE_URL: 'https://zfrazyupameidxpjihrh.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU',
    
    // TAMA API Base URL
    TAMA_API_BASE: 'https://huma-chain-xyz-production.up.railway.app/api/tama'
};

console.log('✅ Admin Environment loaded:', {
    supabase: window.AdminEnv.SUPABASE_URL,
    api: window.AdminEnv.TAMA_API_BASE
});

