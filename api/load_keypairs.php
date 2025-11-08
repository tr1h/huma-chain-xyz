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
        $keyPairJson = getenv($envVar);
        
        if ($keyPairJson && !file_exists($filePath)) {
            // Write keypair to file
            $result = file_put_contents($filePath, $keyPairJson);
            
            if ($result === false) {
                error_log("❌ Failed to write keypair: {$filePath}");
            } else {
                error_log("✅ Keypair loaded: {$filePath}");
                // Set file permissions (read-only for security)
                chmod($filePath, 0400);
            }
        } elseif (!$keyPairJson) {
            error_log("⚠️ Environment variable not set: {$envVar}");
        } elseif (file_exists($filePath)) {
            error_log("✅ Keypair already exists: {$filePath}");
        }
    }
}

// Auto-load keypairs when this file is included
loadKeypairsFromEnv();
?>

