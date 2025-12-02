<?php
/**
 * Unified Leaderboard API
 * Combines Telegram (leaderboard) and Wallet (wallet_users) players
 * Returns single leaderboard with all players
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Disable error display, log instead
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Load config
require_once __DIR__ . '/config.php';

// Supabase configuration
$SUPABASE_URL = defined('SUPABASE_URL') && SUPABASE_URL 
    ? SUPABASE_URL 
    : (getenv('SUPABASE_URL') ?: null);

$SUPABASE_KEY = defined('SUPABASE_KEY') && SUPABASE_KEY 
    ? SUPABASE_KEY 
    : (getenv('SUPABASE_KEY') ?: null);

if (!$SUPABASE_URL || !$SUPABASE_KEY) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Supabase configuration missing']);
    exit;
}

error_log('✅ Unified Leaderboard API - Supabase config loaded');

/**
 * Call Supabase RPC function
 */
function callSupabaseRPC($url, $key, $functionName, $params = []) {
    $ch = curl_init();
    
    $rpcUrl = $url . '/rest/v1/rpc/' . $functionName;
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $rpcUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($params),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'apikey: ' . $key,
            'Authorization: Bearer ' . $key
        ],
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_TIMEOUT => 30
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        $error = curl_error($ch);
        curl_close($ch);
        error_log('❌ cURL Error: ' . $error);
        return ['code' => 500, 'data' => ['error' => $error]];
    }
    
    curl_close($ch);
    
    $data = json_decode($response, true);
    
    error_log('📊 RPC ' . $functionName . ' returned HTTP ' . $httpCode);
    
    return [
        'code' => $httpCode,
        'data' => $data
    ];
}

// Handle different actions
$action = $_GET['action'] ?? 'leaderboard';

switch ($action) {
    case 'leaderboard':
        handleGetLeaderboard($SUPABASE_URL, $SUPABASE_KEY);
        break;
    
    case 'rank':
        handleGetUserRank($SUPABASE_URL, $SUPABASE_KEY);
        break;
    
    case 'total':
        handleGetTotalPlayers($SUPABASE_URL, $SUPABASE_KEY);
        break;
    
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
        break;
}

/**
 * Get unified leaderboard
 * GET /api/unified-leaderboard.php?action=leaderboard&limit=100&offset=0
 */
function handleGetLeaderboard($url, $key) {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Ensure limits are reasonable
    $limit = max(1, min($limit, 500)); // Between 1 and 500
    $offset = max(0, $offset);
    
    error_log('📊 Getting unified leaderboard: limit=' . $limit . ', offset=' . $offset);
    
    $result = callSupabaseRPC($url, $key, 'get_unified_leaderboard', [
        'p_limit' => $limit,
        'p_offset' => $offset
    ]);
    
    if ($result['code'] === 200) {
        echo json_encode([
            'success' => true,
            'data' => $result['data'],
            'count' => count($result['data']),
            'limit' => $limit,
            'offset' => $offset
        ]);
    } else {
        http_response_code($result['code']);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to fetch leaderboard',
            'details' => $result['data']
        ]);
    }
}

/**
 * Get user rank in unified leaderboard
 * GET /api/unified-leaderboard.php?action=rank&telegram_id=123
 * GET /api/unified-leaderboard.php?action=rank&wallet_address=xxx
 * GET /api/unified-leaderboard.php?action=rank&user_id=wallet_xxx
 */
function handleGetUserRank($url, $key) {
    $telegram_id = isset($_GET['telegram_id']) ? (int)$_GET['telegram_id'] : null;
    $wallet_address = $_GET['wallet_address'] ?? null;
    $user_id = $_GET['user_id'] ?? null;
    
    if (!$telegram_id && !$wallet_address && !$user_id) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Either telegram_id, wallet_address, or user_id is required'
        ]);
        return;
    }
    
    error_log('🔍 Getting user rank: telegram_id=' . $telegram_id . ', wallet=' . $wallet_address . ', user_id=' . $user_id);
    
    $result = callSupabaseRPC($url, $key, 'get_user_rank_unified', [
        'p_telegram_id' => $telegram_id,
        'p_wallet_address' => $wallet_address,
        'p_user_id' => $user_id
    ]);
    
    if ($result['code'] === 200) {
        if (empty($result['data']) || count($result['data']) === 0) {
            echo json_encode([
                'success' => true,
                'found' => false,
                'message' => 'User not found in leaderboard'
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'found' => true,
                'data' => $result['data'][0]
            ]);
        }
    } else {
        http_response_code($result['code']);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to fetch user rank',
            'details' => $result['data']
        ]);
    }
}

/**
 * Get total players count
 * GET /api/unified-leaderboard.php?action=total
 */
function handleGetTotalPlayers($url, $key) {
    error_log('📊 Getting total players count');
    
    $result = callSupabaseRPC($url, $key, 'get_total_players_unified', []);
    
    if ($result['code'] === 200) {
        $total = $result['data'];
        
        echo json_encode([
            'success' => true,
            'total_players' => $total
        ]);
    } else {
        http_response_code($result['code']);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to fetch total players',
            'details' => $result['data']
        ]);
    }
}

