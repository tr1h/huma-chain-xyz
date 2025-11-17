<?php
/**
 * Load Keypairs from Environment Variables
 * 
 * Railway doesn't support file uploads easily, so we store keypairs
 * as environment variables and write them to files on startup.
 */

// Suppress errors to prevent HTML output
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

function loadKeypairsFromEnv() {
    // Use /tmp/ for writable directory in Render.com containers
    $keyPairs = [
        'SOLANA_PAYER_KEYPAIR' => '/tmp/payer-keypair.json',
        'SOLANA_P2E_POOL_KEYPAIR' => '/tmp/p2e-pool-keypair.json'
    ];
    
    foreach ($keyPairs as $envVar => $filePath) {
        // Try multiple ways to read env vars (Railway compatibility)
        $keyPairJson = getenv($envVar) 
            ?: ($_ENV[$envVar] ?? null)
            ?: ($_SERVER[$envVar] ?? null);
        
        // Debug: log what we found (use error_log which goes to stderr, not stdout)
        // This won't interfere with headers
        // Note: Removed emojis to prevent encoding issues
        if ($keyPairJson) {
            error_log("[KEYPAIR] Found {$envVar} (length: " . strlen($keyPairJson) . ")");
        } else {
            error_log("[KEYPAIR] Environment variable not set: {$envVar}");
            error_log("[KEYPAIR] Tried: getenv(), \$_ENV, \$_SERVER");
        }
        
        if ($keyPairJson && !file_exists($filePath)) {
            // Ensure directory exists
            $dir = dirname($filePath);
            if (!is_dir($dir)) {
                @mkdir($dir, 0755, true); // Suppress warnings
            }
            
            // Write keypair to file
            $result = @file_put_contents($filePath, $keyPairJson); // Suppress warnings
            
            if ($result === false) {
                error_log("[KEYPAIR] Failed to write keypair: {$filePath}");
                error_log("[KEYPAIR] Directory exists: " . (is_dir($dir) ? 'YES' : 'NO'));
                error_log("[KEYPAIR] Directory writable: " . (is_writable($dir) ? 'YES' : 'NO'));
            } else {
                error_log("[KEYPAIR] Keypair loaded: {$filePath} ({$result} bytes)");
                // Set file permissions (read-only for security)
                @chmod($filePath, 0400); // Suppress warnings
            }
        } elseif (file_exists($filePath)) {
            error_log("[KEYPAIR] Keypair already exists: {$filePath}");
        }
    }
}

// Auto-load keypairs when this file is included
loadKeypairsFromEnv();