<?php
/**
 * 🔐 TAMA Transfer API
 * Executes SPL token transfers with proper error handling
 * 
 * Fixed by @Developer following @QA-Tester audit
 * Date: 2025-12-17
 */

// Error handling configuration
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load error handlers
require_once __DIR__ . '/helpers/error-handlers.php';

try {
        // Load environment variables
    $envFile = __DIR__ . '/../.env';
    if (file_exists($envFile)) {
        $envContent = safeFileRead($envFile);
        $lines = explode("\n", $envContent);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') === false) continue;
            
            list($name, $value) = explode('=', $line, 2);
            $_ENV[trim($name)] = trim($value);
        }
    }

    // Get environment variables
    $TAMA_MINT_ADDRESS = getenv('TAMA_MINT_ADDRESS') ?: ($_ENV['TAMA_MINT_ADDRESS'] ?? 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY');
    $SOLANA_NETWORK = getenv('SOLANA_NETWORK') ?: ($_ENV['SOLANA_NETWORK'] ?? 'devnet');
    $P2E_POOL_ADDRESS = 'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw';

    // Read and validate request
    $data = getJsonInput(['amount', 'distributions']);

    $amount = intval($data['amount']);
    $distributions = $data['distributions']; // Array: [{ to: 'address', amount: 1500, label: 'Treasury' }, ...]

    // Validate distributions
    if (!is_array($distributions) || empty($distributions)) {
        throw new Exception('Invalid distributions array');
    }

// Load P2E Pool keypair
$keypairPaths = [
    '/tmp/p2e-pool-keypair.json',  // Writable path (Render/Docker)
    __DIR__ . '/../p2e-pool-keypair.json',
    __DIR__ . '/p2e-pool-keypair.json'
];

$keypairPath = null;
foreach ($keypairPaths as $path) {
    if (file_exists($path)) {
        $keypairPath = $path;
        break;
    }
}

    // Fallback: Try to load from environment variable
    if (!$keypairPath) {
        $keypairJson = getenv('SOLANA_P2E_POOL_KEYPAIR') ?: ($_ENV['SOLANA_P2E_POOL_KEYPAIR'] ?? null);
        if ($keypairJson) {
            // Write keypair to temporary file
            $keypairPath = '/tmp/p2e-pool-keypair-' . uniqid() . '.json';
            safeFileWrite($keypairPath, $keypairJson);
        }
    }

    if (!$keypairPath) {
        throw new Exception('P2E Pool keypair not found. Set SOLANA_P2E_POOL_KEYPAIR environment variable.');
    }

    // Execute transfers
    $signatures = [];
    $errors = [];

    foreach ($distributions as $dist) {
    $to = $dist['to'] ?? null;
    $transferAmount = intval($dist['amount'] ?? 0);
    $label = $dist['label'] ?? 'Unknown';
    
    if (!$to || $transferAmount <= 0) {
        $errors[] = "Invalid distribution: {$label}";
        continue;
    }
    
    // Handle BURN: send to Solana Incinerator address
    if ($to === 'BURN') {
        $to = '1nc1nerator11111111111111111111111111111111'; // Official Solana burn address
        error_log("🔥 Burn: {$transferAmount} TAMA → Incinerator address");
    }
    
    // Execute SPL token transfer
    $cmd = sprintf(
        'spl-token transfer %s %d %s --url %s --fee-payer %s --owner %s --allow-unfunded-recipient 2>&1',
        escapeshellarg($TAMA_MINT_ADDRESS),
        $transferAmount,
        escapeshellarg($to),
        escapeshellarg("https://api.{$SOLANA_NETWORK}.solana.com"),
        escapeshellarg($keypairPath),
        escapeshellarg($keypairPath)
    );
    
    error_log("🚀 Executing SPL transfer: {$label} → {$to} ({$transferAmount} TAMA)");
    error_log("Command: {$cmd}");
    
    $output = shell_exec($cmd);
    error_log("Output: {$output}");
    
    // Parse signature from output
    if (preg_match('/Signature: ([A-Za-z0-9]+)/', $output, $matches)) {
        $signature = $matches[1];
        $signatures[] = [
            'label' => $label,
            'to' => $to,
            'amount' => $transferAmount,
            'signature' => $signature,
            'explorer' => "https://explorer.solana.com/tx/{$signature}?cluster={$SOLANA_NETWORK}"
        ];
        error_log("✅ Transfer successful: {$signature}");
    } else {
        $errors[] = "Transfer failed: {$label} - {$output}";
        error_log("❌ Transfer failed: {$label} - {$output}");
    }
}

// Return results
    if (!empty($signatures)) {
        sendSuccessResponse([
            'transfers' => $signatures,
            'errors' => $errors,
            'total_transferred' => array_sum(array_column($signatures, 'amount'))
        ]);
    } else {
        throw new Exception('No transfers executed: ' . implode('; ', $errors));
    }

} catch (Exception $e) {
    logError('TAMA Transfer failed', $e, [
        'amount' => $amount ?? null,
        'distributions' => $distributions ?? null
    ]);
    
    sendErrorResponse(
        'Transfer failed. Please try again.',
        500,
        ['details' => $e->getMessage()]
    );
}
?>
