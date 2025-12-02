<?php
/**
 * Simplified Profile Data API for debugging
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Cache-Control, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'user_id is required']);
    exit;
}

error_log("📊 Simple Profile API - Request for user_id: " . $userId);

try {
    require_once __DIR__ . '/config.php';
    
    // Supabase config
    $SUPABASE_URL = defined('SUPABASE_URL') && SUPABASE_URL
        ? SUPABASE_URL
        : (getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co');
    $SUPABASE_KEY = defined('SUPABASE_KEY') && SUPABASE_KEY
        ? SUPABASE_KEY
        : (getenv('SUPABASE_KEY') ?: null);
    
    if (!$SUPABASE_URL || !$SUPABASE_KEY) {
        throw new Exception('Supabase configuration missing');
    }
    
    // Parse user ID
    $walletAddress = $userId;
    if (strpos($userId, 'wallet_') === 0) {
        $walletAddress = substr($userId, 7);
    }
    
    error_log("🔍 Looking for wallet: " . $walletAddress);
    
    // Simple fetch from wallet_users
    $url = $SUPABASE_URL . '/rest/v1/wallet_users?wallet_address=eq.' . urlencode($walletAddress) . '&select=*';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $SUPABASE_KEY,
        'Authorization: Bearer ' . $SUPABASE_KEY,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    error_log("📡 Supabase response code: " . $httpCode);
    
    if ($httpCode !== 200) {
        throw new Exception('Failed to fetch user from Supabase: HTTP ' . $httpCode);
    }
    
    $data = json_decode($response, true);
    
    if (empty($data)) {
        throw new Exception('User not found: ' . $walletAddress);
    }
    
    $user = $data[0];
    error_log("✅ Found user: " . $user['user_id']);
    
    // Extract game state
    $gameState = [];
    if (isset($user['game_state'])) {
        if (is_string($user['game_state'])) {
            $gameState = json_decode($user['game_state'], true) ?: [];
        } elseif (is_array($user['game_state'])) {
            $gameState = $user['game_state'];
        }
    }
    
    // Build simple stats
    $stats = [
        'level' => (int)($user['level'] ?? 1),
        'tama' => (int)($user['tama_balance'] ?? 0),
        'totalClicks' => (int)($user['clicks'] ?? 0),
        'playtime' => 0,
        'rank' => 0,
        'nfts' => 0,
        'referrals' => (int)($user['referral_count'] ?? 0),
        'referralEarnings' => (int)($user['referral_earnings'] ?? 0),
        'walletLinked' => true,
        'twitterLinked' => !empty($user['twitter_username']),
        'daysPlayed' => 1,
        'nftCollection' => [],
        'transactions' => [
            [
                'type' => 'click',
                'description' => 'Clicked pet',
                'amount' => (int)($user['clicks'] ?? 0),
                'timestamp' => date('c', strtotime('-1 hour'))
            ]
        ],
        'activities' => [
            [
                'type' => 'login',
                'description' => 'Logged into game',
                'timestamp' => $user['last_login'] ?? date('c')
            ]
        ]
    ];
    
    error_log("✅ Successfully generated simple stats");
    
    echo json_encode([
        'success' => true,
        'user' => $user,
        'stats' => $stats
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    error_log("❌ Simple Profile API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

