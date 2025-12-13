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

// Load security and keypairs
require_once __DIR__ . '/security.php';
require_once __DIR__ . '/load_keypairs.php';
setSecurityHeaders();

// Config - same as tama_supabase.php
$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$supabaseKey = getenv('SUPABASE_KEY') ?: getenv('SUPABASE_ANON_KEY');

// Fallback for testing (same key as in old API)
if (!$supabaseKey) {
    $supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';
}

// Rate limiting
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
