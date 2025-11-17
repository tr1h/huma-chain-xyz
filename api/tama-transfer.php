<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load environment variables
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

// Get environment variables
$TAMA_MINT_ADDRESS = getenv('TAMA_MINT_ADDRESS') ?: ($_ENV['TAMA_MINT_ADDRESS'] ?? 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY');
$SOLANA_NETWORK = getenv('SOLANA_NETWORK') ?: ($_ENV['SOLANA_NETWORK'] ?? 'devnet');
$P2E_POOL_ADDRESS = 'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw';

// Read request
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit();
}

// Validate required fields
$required = ['amount', 'distributions'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

$amount = intval($data['amount']);
$distributions = $data['distributions']; // Array: [{ to: 'address', amount: 1500, label: 'Treasury' }, ...]

// Validate distributions
if (!is_array($distributions) || empty($distributions)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid distributions array']);
    exit();
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
        file_put_contents($keypairPath, $keypairJson);
    }
}

if (!$keypairPath) {
    error_log('❌ ERROR: P2E Pool keypair not found!');
    http_response_code(500);
    echo json_encode([
        'error' => 'P2E Pool keypair not found',
        'hint' => 'Set SOLANA_P2E_POOL_KEYPAIR environment variable'
    ]);
    exit();
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
    echo json_encode([
        'success' => true,
        'transfers' => $signatures,
        'errors' => $errors,
        'total_transferred' => array_sum(array_column($signatures, 'amount'))
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'No transfers executed',
        'errors' => $errors
    ]);
}

