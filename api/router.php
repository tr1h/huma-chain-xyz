<?php
// Router for PHP built-in server
// Routes /api/tama/* requests to tama_supabase.php
// Routes /api/mint-nft-onchain to mint-nft-onchain-wrapper.php

// CORS headers MUST be set before any routing
$allowedOrigins = [
    'https://solanatamagotchi.com',
    'https://www.solanatamagotchi.com',
    'http://localhost',
    'http://localhost:3000',
    '*'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
if (in_array($origin, $allowedOrigins) || in_array('*', $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . ($origin === '*' ? '*' : $origin));
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400'); // 24 hours

// Handle OPTIONS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    header('Content-Length: 0');
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route /api/tama/* to tama_supabase.php
if (preg_match('#^/api/tama#', $uri)) {
    // Change to api directory
    chdir(__DIR__);
    // Set REQUEST_URI to the path after /api/tama
    $_SERVER['REQUEST_URI'] = $uri;
    require __DIR__ . '/tama_supabase.php';
    exit;
}
// Route /api/mint-nft-onchain to mint-nft-onchain-wrapper.php
elseif (preg_match('#^/api/mint-nft-onchain#', $uri)) {
    chdir(__DIR__);
    require __DIR__ . '/mint-nft-onchain-wrapper.php';
    exit;
}
// Route /api/analyze-user to analyze-user.php
elseif (preg_match('#^/api/analyze-user#', $uri)) {
    chdir(__DIR__);
    require __DIR__ . '/analyze-user.php';
    exit;
}
// Route /api/check-duplicate-transactions to check-duplicate-transactions.php
elseif (preg_match('#^/api/check-duplicate-transactions#', $uri)) {
    chdir(__DIR__);
    require __DIR__ . '/check-duplicate-transactions.php';
    exit;
}
else {
    // Serve static files or return 404
    if (file_exists(__DIR__ . $uri)) {
        return false; // Let PHP serve the file
    } else {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Not found', 'uri' => $uri]);
    }
}

