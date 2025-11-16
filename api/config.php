<?php
/**
 * Supabase Database Configuration
 * Uses environment variables with fallback defaults
 */

// ============================================
// 🔒 SECURITY: ALL CREDENTIALS FROM ENVIRONMENT VARIABLES
// ============================================
// NEVER commit API keys, passwords, or secrets to Git!
// Set these in Render/Railway environment variables

// Supabase Database Connection Settings
define('SUPABASE_DB_HOST', getenv('SUPABASE_DB_HOST'));
define('SUPABASE_DB_PORT', getenv('SUPABASE_DB_PORT') ?: '5432');
define('SUPABASE_DB_NAME', getenv('SUPABASE_DB_NAME') ?: 'postgres');
define('SUPABASE_DB_USER', getenv('SUPABASE_DB_USER') ?: 'postgres');
define('SUPABASE_DB_PASSWORD', getenv('SUPABASE_DB_PASSWORD'));

// Supabase REST API Settings (for REST API calls)
define('SUPABASE_URL', getenv('SUPABASE_URL'));
define('SUPABASE_KEY', getenv('SUPABASE_KEY'));

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_KEY) {
    error_log('❌ CRITICAL: SUPABASE_URL and SUPABASE_KEY must be set in environment variables!');
    if (php_sapi_name() !== 'cli') {
        http_response_code(500);
        die(json_encode([
            'error' => 'Server configuration error',
            'message' => 'Required environment variables not set. Please contact administrator.'
        ]));
    }
}

// TAMA Token Settings
define('TAMA_MINT_ADDRESS', getenv('TAMA_MINT_ADDRESS'));
define('TAMA_DECIMALS', 9);

// Validate TAMA mint address
if (!TAMA_MINT_ADDRESS) {
    error_log('❌ CRITICAL: TAMA_MINT_ADDRESS must be set in environment variables!');
}

// Solana RPC Settings
define('SOLANA_RPC_URL', getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com');

// Treasury Wallet Addresses (loaded from environment)
define('TREASURY_MAIN', getenv('TREASURY_MAIN'));
define('TREASURY_LIQUIDITY', getenv('TREASURY_LIQUIDITY'));
define('TREASURY_TEAM', getenv('TREASURY_TEAM'));

// ============================================
// PDO DATABASE CONNECTION (OPTIONAL - only if needed)
// ============================================
// Note: REST API files don't need direct DB connection
// Only initialize PDO if explicitly needed (lazy initialization)
function getPDOConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = sprintf(
                'pgsql:host=%s;port=%s;dbname=%s;sslmode=require',
                SUPABASE_DB_HOST,
                SUPABASE_DB_PORT,
                SUPABASE_DB_NAME
            );
            
            $pdo = new PDO($dsn, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
            
            error_log("✅ Database connected successfully");
            
        } catch (PDOException $e) {
            error_log("❌ Database connection failed: " . $e->getMessage());
            throw $e;
        }
    }
    
    return $pdo;
}

// For backward compatibility, create $pdo only if SUPABASE_DB_PASSWORD is set
// REST API files don't need it, so we skip initialization
if (!empty(SUPABASE_DB_PASSWORD)) {
    try {
        $pdo = getPDOConnection();
    } catch (PDOException $e) {
        // Don't fail if DB connection is not available (REST API files work without it)
        error_log("⚠️ PDO connection not available (REST API files don't need it): " . $e->getMessage());
        $pdo = null;
    }
} else {
    $pdo = null;
    error_log("ℹ️ PDO connection skipped (no password set - using REST API only)");
}

