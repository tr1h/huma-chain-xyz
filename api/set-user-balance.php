<?php
/**
 * Admin script to set user balance
 * Usage: POST /api/set-user-balance.php
 * Body: { "username": "John Tronolone", "tama": 150000 }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? null;
$tama = $input['tama'] ?? null;

if (!$username || $tama === null) {
    http_response_code(400);
    echo json_encode(['error' => 'username and tama are required']);
    exit;
}

try {
    $supabaseUrl = getenv('SUPABASE_URL') ?: SUPABASE_URL;
    $supabaseKey = getenv('SUPABASE_KEY') ?: SUPABASE_KEY;
    
    // Find user by username
    $userResponse = file_get_contents(
        $supabaseUrl . '/rest/v1/leaderboard?telegram_username=eq.' . urlencode($username) . '&select=telegram_id,telegram_username,tama&limit=1',
        false,
        stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => [
                    'apikey: ' . $supabaseKey,
                    'Authorization: Bearer ' . $supabaseKey
                ]
            ]
        ])
    );
    
    $userData = json_decode($userResponse, true);
    
    if (empty($userData) || !is_array($userData)) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found: ' . $username]);
        exit;
    }
    
    $user = $userData[0];
    $telegram_id = $user['telegram_id'];
    $oldBalance = $user['tama'] ?? 0;
    
    // Update balance
    $updateData = json_encode(['tama' => (int)$tama]);
    
    $updateContext = stream_context_create([
        'http' => [
            'method' => 'PATCH',
            'header' => [
                'apikey: ' . $supabaseKey,
                'Authorization: Bearer ' . $supabaseKey,
                'Content-Type: application/json',
                'Prefer: return=representation'
            ],
            'content' => $updateData
        ]
    ]);
    
    $updateResponse = file_get_contents(
        $supabaseUrl . '/rest/v1/leaderboard?telegram_id=eq.' . $telegram_id,
        false,
        $updateContext
    );
    
    $updateResult = json_decode($updateResponse, true);
    
    // Log transaction
    $transactionData = json_encode([
        'user_id' => (string)$telegram_id,
        'username' => $username,
        'type' => 'admin_balance_set',
        'amount' => (int)$tama - (int)$oldBalance,
        'balance_before' => (int)$oldBalance,
        'balance_after' => (int)$tama,
        'metadata' => json_encode([
            'source' => 'admin_set_balance',
            'admin_action' => true
        ])
    ]);
    
    $txContext = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => [
                'apikey: ' . $supabaseKey,
                'Authorization: Bearer ' . $supabaseKey,
                'Content-Type: application/json',
                'Prefer: return=representation'
            ],
            'content' => $transactionData
        ]
    ]);
    
    file_get_contents(
        $supabaseUrl . '/rest/v1/transactions',
        false,
        $txContext
    );
    
    echo json_encode([
        'success' => true,
        'message' => 'Balance updated successfully',
        'user' => [
            'telegram_id' => $telegram_id,
            'username' => $username,
            'old_balance' => (int)$oldBalance,
            'new_balance' => (int)$tama
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}










