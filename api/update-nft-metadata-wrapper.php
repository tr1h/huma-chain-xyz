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

// Call Node.js script via Express server or direct node
// Option 1: If you have Express server running
$apiUrl = 'http://localhost:3001/api/update-nft-metadata';

// Try Express server first
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

