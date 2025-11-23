<?php
/**
 * Update NFT Metadata Wrapper (PHP)
 * Calls Node.js script to update NFT metadata
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

$mintAddress = $input['mintAddress'] ?? null;
$tier = $input['tier'] ?? 'Bronze';
$rarity = $input['rarity'] ?? 'Common';
$multiplier = $input['multiplier'] ?? 2.0;
$design_number = $input['design_number'] ?? null;

if (!$mintAddress) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'mintAddress is required']);
    exit();
}

// Path to Node.js script
$nodeScript = __DIR__ . '/update-nft-metadata.js';

// Check if script exists
if (!file_exists($nodeScript)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Update script not found']);
    exit();
}

// Prepare data for Node.js script
$data = [
    'mintAddress' => $mintAddress,
    'tier' => $tier,
    'rarity' => $rarity,
    'multiplier' => $multiplier,
    'design_number' => $design_number
];

// Create temporary file with data
$tempFile = tempnam(sys_get_temp_dir(), 'nft_update_');
file_put_contents($tempFile, json_encode($data));

// Call Node.js script via Express server
// For production API (api.solanatamagotchi.com), always use Render.com service
// For local development, use localhost
$hostname = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? '';

// Check if we're on production domain (not localhost)
$isProduction = strpos($hostname, 'localhost') === false && 
                strpos($hostname, '127.0.0.1') === false;

// Get URL from environment variable or use default
$nodeBackendUrl = getenv('ONCHAIN_API_URL');

if (!$nodeBackendUrl) {
    if ($isProduction) {
        // Production: Use Render.com Node.js service (from render.yaml)
        $nodeBackendUrl = 'https://solanatamagotchi-onchain.onrender.com/api/update-nft-metadata';
    } else {
        // Local development
        $nodeBackendUrl = 'http://localhost:3001/api/update-nft-metadata';
    }
}

error_log("🔍 Hostname: $hostname, isProduction: " . ($isProduction ? 'true' : 'false'));
error_log("🔗 Using Node.js backend URL: $nodeBackendUrl");

$apiUrl = $nodeBackendUrl;

error_log("🔗 Calling Node.js backend: $apiUrl");
error_log("📦 POST data: " . json_encode($data));

// Try Express server
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 120); // 2 minutes timeout

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Clean up temp file
unlink($tempFile);

if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to call update service: ' . $curlError
    ]);
    exit();
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo $response;
    exit();
}

// Return response from Node.js
echo $response;

