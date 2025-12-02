<?php
/**
 * 📊 DappRadar Metrics API
 * 
 * Returns metrics for DappRadar listing:
 * - UAW (Unique Active Wallets) - last 24h
 * - Transactions - last 24h
 * - Volume - last 24h
 * 
 * This endpoint can be called by DappRadar to get real-time metrics
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Cache-Control, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Try to load config
try {
    if (file_exists(__DIR__ . '/config.php')) {
        require_once __DIR__ . '/config.php';
    }
} catch (Exception $e) {
    error_log('Config load error: ' . $e->getMessage());
}

// Supabase config
$SUPABASE_URL = defined('SUPABASE_URL') && SUPABASE_URL 
    ? SUPABASE_URL 
    : (getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co');

$SUPABASE_KEY = defined('SUPABASE_KEY') && SUPABASE_KEY 
    ? SUPABASE_KEY 
    : (getenv('SUPABASE_KEY') ?: '');

if (!$SUPABASE_URL || !$SUPABASE_KEY) {
    http_response_code(500);
    echo json_encode(['error' => 'Supabase configuration missing']);
    exit;
}

/**
 * Make request to Supabase
 */
function supabaseRequest($url, $key, $method, $table, $filters = [], $data = null) {
    $queryParams = [];
    foreach ($filters as $filterKey => $filterValue) {
        $queryParams[] = $filterKey . '=' . urlencode($filterValue);
    }
    $queryString = !empty($queryParams) ? '?' . implode('&', $queryParams) : '';
    
    $fullUrl = $url . '/rest/v1/' . $table . $queryString;
    
    $ch = curl_init($fullUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $key,
        'Authorization: Bearer ' . $key,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ]);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    } elseif ($method === 'PATCH') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

try {
    // Calculate 24h ago timestamp
    $twentyFourHoursAgo = date('c', strtotime('-24 hours'));
    
    // 1. Get UAW (Unique Active Wallets) - wallets that logged in last 24h
    // From wallet_users table
    $walletUsersResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'wallet_users', [
        'last_login' => 'gte.' . $twentyFourHoursAgo,
        'select' => 'wallet_address'
    ]);
    
    $walletUsers = $walletUsersResult['data'] ?? [];
    $uniqueWallets = [];
    foreach ($walletUsers as $user) {
        if (!empty($user['wallet_address'])) {
            $uniqueWallets[$user['wallet_address']] = true;
        }
    }
    
    // Also check leaderboard for Telegram users with linked wallets
    $leaderboardResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'leaderboard', [
        'last_active' => 'gte.' . $twentyFourHoursAgo,
        'select' => 'linked_wallet'
    ]);
    
    $leaderboardUsers = $leaderboardResult['data'] ?? [];
    foreach ($leaderboardUsers as $user) {
        if (!empty($user['linked_wallet'])) {
            $uniqueWallets[$user['linked_wallet']] = true;
        }
    }
    
    $uaw = count($uniqueWallets);
    
    // 2. Get transactions count (from transactions table if exists, or estimate from clicks)
    // For now, estimate: each active user = at least 1 transaction
    $transactions = max($uaw, 0); // At least 1 transaction per active wallet
    
    // 3. Get volume (from NFT mints and withdrawals)
    // Check user_nfts table for mints in last 24h
    $nftsResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'user_nfts', [
        'minted_at' => 'gte.' . $twentyFourHoursAgo,
        'select' => 'tier,price_sol'
    ]);
    
    $nfts = $nftsResult['data'] ?? [];
    $volumeSOL = 0;
    foreach ($nfts as $nft) {
        $volumeSOL += floatval($nft['price_sol'] ?? 0);
    }
    
    // Return metrics
    echo json_encode([
        'success' => true,
        'metrics' => [
            'uaw_24h' => $uaw, // Unique Active Wallets (last 24h)
            'transactions_24h' => $transactions, // Transactions (last 24h)
            'volume_24h_sol' => round($volumeSOL, 2), // Volume in SOL (last 24h)
            'volume_24h_usd' => round($volumeSOL * 150, 2), // Estimate: 1 SOL = $150
            'timestamp' => date('c')
        ],
        'source' => 'Solana Tamagotchi API',
        'chain' => 'Solana'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

