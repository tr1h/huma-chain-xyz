<?php
/**
 * PHP wrapper for on-chain NFT minting
 * Calls Node.js backend endpoint
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

try {
    // Get POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // Node.js backend URL (can be same Render.com service or different)
    // For production, use Render.com service URL
    // For local dev, use localhost
    $nodeBackendUrl = getenv('NODE_BACKEND_URL') ?: 
        (getenv('RENDER') ? 'https://solanatamagotchi-onchain.onrender.com/api/mint-nft-onchain' : 'http://localhost:3001/api/mint-nft-onchain');
    
    error_log("🔗 Calling Node.js backend: $nodeBackendUrl");
    
    // Forward request to Node.js backend
    $ch = curl_init($nodeBackendUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $json,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($json)
        ],
        CURLOPT_TIMEOUT => 60 // 60 seconds timeout for Arweave upload
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Failed to call Node.js backend: " . $error);
    }
    
    // Return response
    http_response_code($httpCode);
    echo $response;
    
} catch (Exception $e) {
    error_log("❌ On-chain mint wrapper error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

