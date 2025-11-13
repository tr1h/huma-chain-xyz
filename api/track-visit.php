<?php
/**
 * Track Website Visit API
 * Records website visits to Supabase
 */

// CORS Configuration
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

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Supabase Configuration
$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$supabaseKey = getenv('SUPABASE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Get visitor data
    $pageUrl = $input['page_url'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    $referrer = $input['referrer'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    $userAgent = $input['user_agent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? '';
    $sessionId = $input['session_id'] ?? '';
    $deviceType = $input['device_type'] ?? 'unknown';
    $browser = $input['browser'] ?? 'unknown';
    $os = $input['os'] ?? 'unknown';
    
    // Get IP (respect privacy)
    $ipAddress = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
    // Hash IP for privacy (optional)
    // $ipAddress = hash('sha256', $ipAddress);
    
    // Prepare visit data
    $visitData = [
        'page_url' => $pageUrl,
        'referrer' => $referrer,
        'user_agent' => $userAgent,
        'ip_address' => $ipAddress,
        'device_type' => $deviceType,
        'browser' => $browser,
        'os' => $os,
        'session_id' => $sessionId,
        'is_unique' => true, // Will be determined by checking session_id
        'visit_date' => date('Y-m-d'),
        'visit_time' => date('c')
    ];
    
    // Insert into Supabase
    $url = $supabaseUrl . '/rest/v1/site_visits';
    $ch = curl_init($url);
    
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($visitData),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'apikey: ' . $supabaseKey,
            'Authorization: Bearer ' . $supabaseKey,
            'Prefer: return=minimal'
        ]
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("CURL Error: " . $error);
    }
    
    if ($httpCode >= 200 && $httpCode < 300) {
        echo json_encode([
            'success' => true,
            'message' => 'Visit tracked successfully'
        ]);
    } else {
        throw new Exception("Supabase Error: HTTP $httpCode - " . $response);
    }
    
} catch (Exception $e) {
    error_log("Error tracking visit: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to track visit',
        'message' => $e->getMessage()
    ]);
}

