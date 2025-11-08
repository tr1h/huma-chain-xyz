<?php
/**
 * Load Keypairs from Environment Variables
 * 
 * Railway doesn't support file uploads easily, so we store keypairs
 * as environment variables and write them to files on startup.
 */

function loadKeypairsFromEnv() {
    $keyPairs = [
        'SOLANA_PAYER_KEYPAIR' => '/app/payer-keypair.json',
        'SOLANA_P2E_POOL_KEYPAIR' => '/app/p2e-pool-keypair.json'
    ];
    
    foreach ($keyPairs as $envVar => $filePath) {
        // Try multiple ways to read env vars (Railway compatibility)
        $keyPairJson = getenv($envVar) 
            ?: ($_ENV[$envVar] ?? null)
            ?: ($_SERVER[$envVar] ?? null);
        
        // Debug: log what we found
        if ($keyPairJson) {
            error_log("🔵 Found {$envVar} (length: " . strlen($keyPairJson) . ")");
        } else {
            error_log("⚠️ Environment variable not set: {$envVar}");
            error_log("   Tried: getenv(), \$_ENV, \$_SERVER");
        }
        
        if ($keyPairJson && !file_exists($filePath)) {
            // Ensure directory exists
            $dir = dirname($filePath);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            
            // Write keypair to file
            $result = file_put_contents($filePath, $keyPairJson);
            
            if ($result === false) {
                error_log("❌ Failed to write keypair: {$filePath}");
                error_log("   Directory exists: " . (is_dir($dir) ? 'YES' : 'NO'));
                error_log("   Directory writable: " . (is_writable($dir) ? 'YES' : 'NO'));
            } else {
                error_log("✅ Keypair loaded: {$filePath} ({$result} bytes)");
                // Set file permissions (read-only for security)
                chmod($filePath, 0400);
            }
        } elseif (file_exists($filePath)) {
            error_log("✅ Keypair already exists: {$filePath}");
        }
    }
}

// Auto-load keypairs when this file is included
loadKeypairsFromEnv();
?>

