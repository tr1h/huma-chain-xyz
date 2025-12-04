<?php
/**
 * 🔗 Unified Balance API
 * 
 * Возвращает баланс пользователя независимо от метода авторизации
 * Поддерживает:
 * - Telegram ID
 * - Wallet Address
 * - Связанные аккаунты
 * 
 * Usage: /api/unified-balance.php?user_id=202140267
 *        /api/unified-balance.php?user_id=H4p6U5oP5V2tvTyL1URfEjUVk8ni6diujzWniqFiHCZ9
 */

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Supabase configuration
$SUPABASE_URL = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$SUPABASE_KEY = getenv('SUPABASE_ANON_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5Mzc1NTAsImV4cCI6MjA1MTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';

function supabaseRequest($url, $key, $method, $table, $filters = [], $body = null) {
    $endpoint = "$url/rest/v1/$table";
    
    if (!empty($filters)) {
        $query = http_build_query($filters);
        $endpoint .= "?" . $query;
    }
    
    $headers = [
        "apikey: $key",
        "Authorization: Bearer $key",
        "Content-Type: application/json",
        "Prefer: return=representation"
    ];
    
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

// GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'user_id parameter required'
        ]);
        exit;
    }
    
    error_log("📊 Unified Balance API - Request for user_id: " . $userId);
    
    try {
        // Определить тип user_id (telegram_id или wallet_address)
        $isTelegramId = preg_match('/^\d+$/', $userId);
        $isWalletAddress = preg_match('/^[A-Za-z0-9]{32,44}$/', $userId);
        
        $result = null;
        
        if ($isTelegramId) {
            // ========================================
            // TELEGRAM USER
            // ========================================
            error_log("🔍 Detected Telegram ID: $userId");
            
            // Запросить из leaderboard (primary source)
            $leaderboardResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'leaderboard', [
                'telegram_id' => 'eq.' . $userId,
                'select' => '*'
            ]);
            
            if ($leaderboardResult['code'] === 200 && !empty($leaderboardResult['data'])) {
                $user = $leaderboardResult['data'][0];
                
                $result = [
                    'success' => true,
                    'telegram_id' => (int)$user['telegram_id'],
                    'wallet_address' => $user['wallet_address'] ?? null,
                    'username' => $user['telegram_username'] ?? 'Player',
                    'tama' => (int)($user['tama'] ?? 0),
                    'level' => (int)($user['level'] ?? 1),
                    'xp' => (int)($user['xp'] ?? 0),
                    'clicks' => (int)($user['clicks'] ?? 0),
                    'account_type' => !empty($user['wallet_address']) ? 'linked' : 'telegram_only',
                    'source' => 'leaderboard'
                ];
                
                error_log("✅ Found in leaderboard: tama=" . $result['tama'] . ", linked=" . ($result['wallet_address'] ? 'yes' : 'no'));
            } else {
                throw new Exception('Telegram user not found in leaderboard');
            }
            
        } elseif ($isWalletAddress) {
            // ========================================
            // WALLET USER
            // ========================================
            error_log("🔍 Detected Wallet Address: $userId");
            
            // Проверить wallet_users
            $walletResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'wallet_users', [
                'wallet_address' => 'eq.' . $userId,
                'select' => '*'
            ]);
            
            if ($walletResult['code'] === 200 && !empty($walletResult['data'])) {
                $walletUser = $walletResult['data'][0];
                $telegramId = $walletUser['telegram_id'] ?? null;
                
                // Если wallet связан с telegram - загрузить из leaderboard (primary source)
                if ($telegramId) {
                    error_log("🔗 Wallet linked to Telegram ID: $telegramId");
                    
                    $leaderboardResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'leaderboard', [
                        'telegram_id' => 'eq.' . $telegramId,
                        'select' => '*'
                    ]);
                    
                    if ($leaderboardResult['code'] === 200 && !empty($leaderboardResult['data'])) {
                        $user = $leaderboardResult['data'][0];
                        
                        $result = [
                            'success' => true,
                            'telegram_id' => (int)$user['telegram_id'],
                            'wallet_address' => $userId,
                            'username' => $walletUser['username'] ?? $user['telegram_username'] ?? 'Player',
                            'tama' => (int)($user['tama'] ?? 0),  // ИЗ LEADERBOARD!
                            'level' => (int)($user['level'] ?? 1),
                            'xp' => (int)($user['xp'] ?? 0),
                            'clicks' => (int)($walletUser['clicks'] ?? 0),
                            'account_type' => 'linked',
                            'source' => 'leaderboard (via wallet_users)'
                        ];
                        
                        error_log("✅ Found linked account: tama=" . $result['tama'] . " (from leaderboard)");
                    } else {
                        // Fallback: wallet_users data
                        $result = [
                            'success' => true,
                            'telegram_id' => $telegramId,
                            'wallet_address' => $userId,
                            'username' => $walletUser['username'] ?? 'Player',
                            'tama' => (int)($walletUser['tama_balance'] ?? 0),
                            'level' => (int)($walletUser['level'] ?? 1),
                            'xp' => 0,
                            'clicks' => (int)($walletUser['clicks'] ?? 0),
                            'account_type' => 'linked',
                            'source' => 'wallet_users'
                        ];
                        
                        error_log("⚠️ Linked but leaderboard not found, using wallet_users data");
                    }
                } else {
                    // Wallet-only пользователь
                    $result = [
                        'success' => true,
                        'telegram_id' => null,
                        'wallet_address' => $userId,
                        'username' => $walletUser['username'] ?? 'Player',
                        'tama' => (int)($walletUser['tama_balance'] ?? 0),
                        'level' => (int)($walletUser['level'] ?? 1),
                        'xp' => 0,
                        'clicks' => (int)($walletUser['clicks'] ?? 0),
                        'account_type' => 'wallet_only',
                        'source' => 'wallet_users'
                    ];
                    
                    error_log("✅ Found wallet-only user: tama=" . $result['tama']);
                }
            } else {
                // Wallet не найден - создать запись
                error_log("⚠️ Wallet not found in DB, creating new entry");
                
                $createResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'POST', 'wallet_users', [], [
                    'wallet_address' => $userId,
                    'user_id' => 'wallet_' . substr($userId, 0, 12),
                    'username' => 'Player',
                    'tama_balance' => 0,
                    'level' => 1,
                    'clicks' => 0
                ]);
                
                $result = [
                    'success' => true,
                    'telegram_id' => null,
                    'wallet_address' => $userId,
                    'username' => 'Player',
                    'tama' => 0,
                    'level' => 1,
                    'xp' => 0,
                    'clicks' => 0,
                    'account_type' => 'wallet_only',
                    'source' => 'wallet_users (created)'
                ];
                
                error_log("✅ Created new wallet_users entry");
            }
        } else {
            throw new Exception('Invalid user_id format. Expected telegram_id (numeric) or wallet_address (32-44 chars)');
        }
        
        http_response_code(200);
        echo json_encode($result);
        
    } catch (Exception $e) {
        error_log("❌ Unified Balance API Error: " . $e->getMessage());
        
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}

