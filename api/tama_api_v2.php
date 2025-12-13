<?php
/**
 * TAMA API v2.0 - Modular Architecture
 * 
 * This is the new modular version of the API.
 * Old version: tama_supabase.php (188KB monolith)
 * New version: Uses modules/ for cleaner code
 */

// Suppress errors in output
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ob_start();

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

// Load security
require_once __DIR__ . '/security.php';
setSecurityHeaders();

// Config
$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$supabaseKey = getenv('SUPABASE_KEY');

if (!$supabaseKey) {
    http_response_code(500);
    echo json_encode(['error' => 'SUPABASE_KEY not configured']);
    exit();
}

// Rate limiting
require_once __DIR__ . '/load_keypairs.php';
$clientIP = getClientIP();
if (!checkRateLimit($clientIP, 100, 60)) {
    http_response_code(429);
    echo json_encode(['error' => 'Rate limit exceeded']);
    exit();
}

// Load router
require_once __DIR__ . '/modules/router.php';

// Get endpoint
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$endpoint = parse_url($requestUri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Route request
routeRequest($endpoint, $method, $supabaseUrl, $supabaseKey);
