<?php
/**
 * Supabase Database Configuration
 * Uses environment variables with fallback defaults
 */

// Supabase Database Connection Settings
// Get from environment variables or use defaults
define('SUPABASE_DB_HOST', getenv('SUPABASE_DB_HOST') ?: 'db.zfrazyupameidxpjihrh.supabase.co');
define('SUPABASE_DB_PORT', getenv('SUPABASE_DB_PORT') ?: '5432');
define('SUPABASE_DB_NAME', getenv('SUPABASE_DB_NAME') ?: 'postgres');
define('SUPABASE_DB_USER', getenv('SUPABASE_DB_USER') ?: 'postgres');
define('SUPABASE_DB_PASSWORD', getenv('SUPABASE_DB_PASSWORD') ?: '');

// Supabase REST API Settings (for REST API calls)
define('SUPABASE_URL', getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co');
define('SUPABASE_KEY', getenv('SUPABASE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU');

// TAMA Token Settings
define('TAMA_MINT_ADDRESS', getenv('TAMA_MINT_ADDRESS') ?: 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY');
define('TAMA_DECIMALS', 9);

// Solana RPC Settings
define('SOLANA_RPC_URL', getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com');

// Treasury Wallet Addresses (Devnet)
define('TREASURY_MAIN', getenv('TREASURY_MAIN') ?: '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM');
define('TREASURY_LIQUIDITY', getenv('TREASURY_LIQUIDITY') ?: 'CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1');
define('TREASURY_TEAM', getenv('TREASURY_TEAM') ?: 'Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8');

