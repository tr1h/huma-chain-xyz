<?php
/**
 * TAMA Token API - Supabase REST API Integration
 * Использует Supabase REST API вместо прямого подключения к PostgreSQL
 */

// ⚠️ CRITICAL: Suppress all PHP errors to prevent HTML output (MUST BE FIRST!)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// ⚠️ CRITICAL: Start output buffering IMMEDIATELY to catch any accidental output
ob_start();

// CORS Configuration - MUST BE FIRST (before any output!)
$allowedOrigins = [
    'https://solanatamagotchi.com',
    'https://www.solanatamagotchi.com',
    'https://tr1h.github.io',
    'http://localhost',
    'http://localhost:3000',
    'http://127.0.0.1',
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

// Обработка preflight запросов (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    header('Content-Length: 0');
    exit();
}

// Load keypairs from environment variables (Railway) - AFTER CORS headers
require_once __DIR__ . '/load_keypairs.php';

// Clear any accidental output from load_keypairs.php before setting Content-Type
if (ob_get_level() > 0) {
    $obContent = ob_get_contents();
    if (!empty($obContent)) {
        error_log("⚠️ Warning: Output buffer contains data after load_keypairs.php: " . substr($obContent, 0, 200));
        ob_clean();
    }
}

header('Content-Type: application/json');

// ============================================
// 🔒 SECURITY: Load from environment variables
// ============================================
require_once __DIR__ . '/security.php';

// Set security headers
setSecurityHeaders();

// Настройки Supabase REST API (NO HARDCODED VALUES!)
$supabaseUrl = getenv('SUPABASE_URL');
$supabaseKey = getenv('SUPABASE_KEY');

// Validate required variables
if (!$supabaseUrl || !$supabaseKey) {
    error_log('❌ CRITICAL: SUPABASE_URL and SUPABASE_KEY must be set in environment!');
    returnError('Server configuration error', 500);
}

// Константы TAMA токена (from environment)
$tamaMintAddress = getenv('TAMA_MINT_ADDRESS');
if (!$tamaMintAddress) {
    error_log('❌ CRITICAL: TAMA_MINT_ADDRESS must be set in environment!');
    returnError('Server configuration error', 500);
}
define('TAMA_MINT_ADDRESS', $tamaMintAddress);

// ============================================
// 🛡️ RATE LIMITING
// ============================================
$clientIP = getClientIP();
$rateLimitPerMinute = (int)(getenv('RATE_LIMIT_PER_MINUTE') ?: 100);

// Check rate limit (except for OPTIONS preflight requests)
if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    if (!checkRateLimit($clientIP, $rateLimitPerMinute, 60)) {
        logSecurityEvent('rate_limit', 'Rate limit exceeded', [
            'ip' => $clientIP,
            'limit' => $rateLimitPerMinute
        ]);
        returnError('Rate limit exceeded. Please try again later.', 429);
    }
}
define('TAMA_DECIMALS', 9);

// Получить метод и путь
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Debug: Log the original path
error_log("🔍 API Request - Method: $method, Original Path: $path");

// Убрать /api/tama из пути, если есть
$path = preg_replace('#^/api/tama#', '', $path);

// Если путь пустой, использовать /
if (empty($path) || $path === '') {
    $path = '/';
}

// Debug: Log the processed path
error_log("🔍 API Request - Processed Path: $path");

// Маршрутизация
switch ($path) {
    case '/balance':
        if ($method === 'GET') {
            handleGetBalance($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/update-wallet':
        if ($method === 'POST') {
            handleUpdateWallet($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/add':
        if ($method === 'POST') {
            handleAddTama($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/spend':
        if ($method === 'POST') {
            handleSpendTama($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/mint-nft':
        if ($method === 'POST') {
            handleMintNFT($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/stats':
        if ($method === 'GET') {
            handleGetStats($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/leaderboard':
        if ($method === 'GET') {
            handleGetLeaderboard($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/leaderboard/upsert':
        if ($method === 'POST') {
            handleLeaderboardUpsert($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/leaderboard/list':
        if ($method === 'GET') {
            handleLeaderboardList($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/transactions/list':
        if ($method === 'GET') {
            handleTransactionsList($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/test':
        if ($method === 'GET') {
            handleTest($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/env-check':
        if ($method === 'GET') {
            handleEnvCheck();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/holders':
        if ($method === 'GET') {
            handleGetHolders($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/pools':
        if ($method === 'GET') {
            handleGetPools($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/withdrawal/request':
        if ($method === 'POST') {
            handleWithdrawalRequest($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/withdrawal/history':
        if ($method === 'GET') {
            handleWithdrawalHistory($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/distribute':
        if ($method === 'POST') {
            handleDistribute($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
    
    case '/nft/mint-bronze-onchain':
        if ($method === 'POST') {
            handleBronzeNFTOnChain($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/mint':
        if ($method === 'POST') {
            handleMint($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/send':
        if ($method === 'POST') {
            handleSend($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/send-sol':
        error_log("✅ /send-sol endpoint called, method=$method");
        if ($method === 'POST') {
            handleSendSol($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed', 'method' => $method, 'expected' => 'POST']);
        }
        break;
        
    case '/economy/apply':
        if ($method === 'POST') {
            handleEconomyApply($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/economy/active':
        if ($method === 'GET') {
            handleEconomyActive($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    default:
        // Ensure JSON response for unknown routes
        ob_clean();
        header('Content-Type: application/json');
        http_response_code(404);
        error_log("❌ Endpoint not found: path=$path, method=$method, REQUEST_URI=" . ($_SERVER['REQUEST_URI'] ?? 'N/A'));
        echo json_encode([
            'success' => false,
            'error' => 'Endpoint not found',
            'path' => $path,
            'method' => $method,
            'available_endpoints' => ['/balance', '/add', '/spend', '/mint-nft', '/stats', '/leaderboard', '/update-wallet', '/test', '/send', '/send-sol', '/distribute', '/mint']
        ]);
        exit();
}

/**
 * Вспомогательная функция для запросов к Supabase REST API
 */
function supabaseRequest($url, $key, $method = 'GET', $table = '', $params = [], $body = null) {
    $apiUrl = rtrim($url, '/') . '/rest/v1/' . $table;
    
    if (!empty($params)) {
        $queryString = http_build_query($params);
        $apiUrl .= '?' . $queryString;
    }
    
    $headers = [];
    $ch = curl_init($apiUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'apikey: ' . $key,
            'Authorization: Bearer ' . $key,
            'Content-Type: application/json',
            'Prefer: return=representation,count=exact'
        ],
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HEADERFUNCTION => function($curl, $header) use (&$headers) {
            $len = strlen($header);
            $header = explode(':', $header, 2);
            if (count($header) < 2) return $len;
            
            $name = strtolower(trim($header[0]));
            $value = trim($header[1]);
            $headers[$name] = $value;
            
            return $len;
        }
    ]);
    
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception('CURL error: ' . $error);
    }
    
    $result = [
        'code' => $httpCode,
        'data' => json_decode($response, true) ?: []
    ];
    
    // Parse Content-Range header for count
    if (isset($headers['content-range'])) {
        // Format: "0-99/123" or "*/123"
        $range = $headers['content-range'];
        if (preg_match('/\/(\d+)$/', $range, $matches)) {
            $result['count'] = (int)$matches[1];
        }
    }
    
    return $result;
}

/**
 * Тест подключения к Supabase
 */
function handleTest($url, $key) {
    try {
        // Проверить подключение через запрос к leaderboard
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', ['select' => 'count', 'limit' => '1']);
        
        // Получить список таблиц (через запрос к leaderboard с count)
        $countResult = supabaseRequest($url, $key, 'GET', 'leaderboard', ['select' => '*', 'limit' => '0'], null);
        
        echo json_encode([
            'success' => true,
            'message' => 'Supabase REST API connection successful',
            'current_time' => date('Y-m-d H:i:s'),
            'tables' => ['leaderboard', 'referrals', 'user_nfts'],
            'leaderboard_records' => count($countResult['data'])
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

/**
 * Получить баланс пользователя
 */
function handleGetBalance($url, $key) {
    $telegram_id = $_GET['telegram_id'] ?? null;
    
    // Clean telegram_id (remove any URL parts if accidentally included)
    if ($telegram_id) {
        // Extract only the ID part (numbers before any URL)
        if (preg_match('/^(\d+)/', $telegram_id, $matches)) {
            $telegram_id = $matches[1];
        }
    }
    
    if (!$telegram_id) {
        http_response_code(400);
        echo json_encode(['error' => 'telegram_id is required']);
        return;
    }
    
    try {
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => '*',
            'telegram_id' => 'eq.' . $telegram_id,
            'limit' => '1'
        ]);
        
        if (empty($result['data'])) {
            echo json_encode([
                'success' => true,
                'telegram_id' => $telegram_id,
                'database_tama' => 0,
                'blockchain_tama' => 0,
                'total_tama' => 0,
                'pet_name' => null,
                'pet_type' => null,
                'level' => 1,
                'xp' => 0
            ]);
            return;
        }
        
        $player = $result['data'][0];
        $database_tama = (int)($player['tama'] ?? 0);
        $blockchain_tama = 0; // TODO: Get from blockchain if needed
        $total_tama = $database_tama + $blockchain_tama;
        
        echo json_encode([
            'success' => true,
            'telegram_id' => $telegram_id,
            'database_tama' => $database_tama,
            'blockchain_tama' => $blockchain_tama,
            'total_tama' => $total_tama,
            'pet_name' => $player['pet_name'] ?? null,
            'pet_type' => $player['pet_type'] ?? null,
            'level' => (int)($player['level'] ?? 1),
            'xp' => (int)($player['xp'] ?? 0)
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Handle wallet address update
 * POST /api/tama/update-wallet
 */
function handleUpdateWallet($url, $key) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $telegram_id = $input['telegram_id'] ?? null;
        $wallet_address = $input['wallet_address'] ?? null;
        
        if (!$telegram_id || !$wallet_address) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'telegram_id and wallet_address are required']);
            return;
        }
        
        error_log("💾 Updating wallet address: user=$telegram_id, wallet=$wallet_address");
        
        // Check if player exists in 'players' table
        $playerCheck = supabaseRequest($url, $key, 'GET', 'players', ['telegram_id' => "eq.$telegram_id"], null);
        
        if ($playerCheck['code'] === 200 && !empty($playerCheck['data'])) {
            // Player exists - update wallet_address
            $updateResult = supabaseRequest($url, $key, 'PATCH', 'players', ['telegram_id' => "eq.$telegram_id"], [
                'wallet_address' => $wallet_address
            ]);
            
            if ($updateResult['code'] >= 200 && $updateResult['code'] < 300) {
                error_log("✅ Wallet address updated in players table: user=$telegram_id");
            } else {
                error_log("⚠️ Failed to update wallet in players table: code={$updateResult['code']}");
            }
        } else {
            // Player doesn't exist - create with wallet_address
            $createResult = supabaseRequest($url, $key, 'POST', 'players', [], [
                'telegram_id' => $telegram_id,
                'wallet_address' => $wallet_address,
                'tama_balance' => 0,
                'level' => 1,
                'xp' => 0,
                'username' => 'user_' . $telegram_id
            ]);
            
            if ($createResult['code'] >= 200 && $createResult['code'] < 300) {
                error_log("✅ Player created with wallet address: user=$telegram_id");
            } else {
                error_log("⚠️ Failed to create player with wallet: code={$createResult['code']}");
            }
        }
        
        // Also update leaderboard table if exists
        $leaderboardCheck = supabaseRequest($url, $key, 'GET', 'leaderboard', ['telegram_id' => "eq.$telegram_id"], null);
        
        if ($leaderboardCheck['code'] === 200 && !empty($leaderboardCheck['data'])) {
            $updateLeaderboard = supabaseRequest($url, $key, 'PATCH', 'leaderboard', ['telegram_id' => "eq.$telegram_id"], [
                'wallet_address' => $wallet_address
            ]);
            
            if ($updateLeaderboard['code'] >= 200 && $updateLeaderboard['code'] < 300) {
                error_log("✅ Wallet address updated in leaderboard table: user=$telegram_id");
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Wallet address saved to database',
            'telegram_id' => $telegram_id,
            'wallet_address' => $wallet_address
        ]);
        
    } catch (Exception $e) {
        error_log("❌ Error updating wallet: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Добавить TAMA пользователю
 */
function handleAddTama($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $telegram_id = $input['telegram_id'] ?? null;
    $amount = $input['amount'] ?? null;
    $source = $input['source'] ?? 'game';
    
    if (!$telegram_id || !$amount) {
        http_response_code(400);
        echo json_encode(['error' => 'telegram_id and amount are required']);
        return;
    }
    
    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'amount must be positive']);
        return;
    }
    
    try {
        // Получить текущий баланс
        $getResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => 'tama',
            'telegram_id' => 'eq.' . $telegram_id,
            'limit' => '1'
        ]);
        
        $currentBalance = 0;
        if (!empty($getResult['data'])) {
            $currentBalance = (int)($getResult['data'][0]['tama'] ?? 0);
        }
        
        $newBalance = $currentBalance + $amount;
        
        // Обновить баланс
        $updateResult = supabaseRequest($url, $key, 'PATCH', 'leaderboard', [
            'telegram_id' => 'eq.' . $telegram_id
        ], [
            'tama' => $newBalance
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'TAMA added successfully',
            'new_balance' => $newBalance
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Потратить TAMA
 */
function handleSpendTama($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $telegram_id = $input['telegram_id'] ?? null;
    $amount = $input['amount'] ?? null;
    $purpose = $input['purpose'] ?? 'spend';
    
    if (!$telegram_id || !$amount) {
        http_response_code(400);
        echo json_encode(['error' => 'telegram_id and amount are required']);
        return;
    }
    
    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'amount must be positive']);
        return;
    }
    
    try {
        // Получить текущий баланс
        $getResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => 'tama',
            'telegram_id' => 'eq.' . $telegram_id,
            'limit' => '1'
        ]);
        
        if (empty($getResult['data'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $currentBalance = (int)($getResult['data'][0]['tama'] ?? 0);
        
        if ($currentBalance < $amount) {
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient TAMA balance']);
            return;
        }
        
        $newBalance = $currentBalance - $amount;
        
        // Обновить баланс
        supabaseRequest($url, $key, 'PATCH', 'leaderboard', [
            'telegram_id' => 'eq.' . $telegram_id
        ], [
            'tama' => $newBalance
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'TAMA spent successfully',
            'new_balance' => $newBalance
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Минт NFT
 */
function handleMintNFT($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $telegram_id = $input['telegram_id'] ?? null;
    $mint_address = $input['mint_address'] ?? null;
    $pet_type = $input['pet_type'] ?? null;
    $rarity = $input['rarity'] ?? null;
    $cost_tama = $input['cost_tama'] ?? null;
    $cost_sol = $input['cost_sol'] ?? null;
    $transaction_hash = $input['transaction_hash'] ?? null;
    
    if (!$telegram_id || !$mint_address || !$pet_type || !$rarity || !$cost_tama) {
        http_response_code(400);
        echo json_encode(['error' => 'telegram_id, mint_address, pet_type, rarity, and cost_tama are required']);
        return;
    }
    
    if ($cost_tama <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'cost_tama must be positive']);
        return;
    }
    
    try {
        // Проверить баланс
        $getResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => 'tama',
            'telegram_id' => 'eq.' . $telegram_id,
            'limit' => '1'
        ]);
        
        if (empty($getResult['data'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $currentBalance = (int)($getResult['data'][0]['tama'] ?? 0);
        
        if ($currentBalance < $cost_tama) {
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient TAMA balance for NFT mint']);
            return;
        }
        
        // Создать NFT запись
        supabaseRequest($url, $key, 'POST', 'user_nfts', [], [
            'telegram_id' => $telegram_id,
            'mint_address' => $mint_address,
            'pet_type' => $pet_type,
            'rarity' => $rarity,
            'cost_tama' => $cost_tama,
            'cost_sol' => $cost_sol,
            'transaction_hash' => $transaction_hash
        ]);
        
        // Списать TAMA
        $newBalance = $currentBalance - $cost_tama;
        supabaseRequest($url, $key, 'PATCH', 'leaderboard', [
            'telegram_id' => 'eq.' . $telegram_id
        ], [
            'tama' => $newBalance
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'NFT minted successfully',
            'mint_address' => $mint_address,
            'pet_type' => $pet_type,
            'rarity' => $rarity,
            'cost_tama' => $cost_tama,
            'new_balance' => $newBalance
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Получить статистику
 */
function handleGetStats($url, $key) {
    try {
        // Получить всех пользователей
        $usersResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => 'tama',
            'limit' => '1000'
        ]);
        
        $totalUsers = count($usersResult['data']);
        $totalDatabaseTama = 0;
        foreach ($usersResult['data'] as $user) {
            $totalDatabaseTama += (int)($user['tama'] ?? 0);
        }
        
        // Получить NFT
        $nftsResult = supabaseRequest($url, $key, 'GET', 'user_nfts', [
            'select' => 'id',
            'limit' => '1000'
        ]);
        $totalNfts = count($nftsResult['data']);
        
        echo json_encode([
            'success' => true,
            'stats' => [
                'total_users' => $totalUsers,
                'total_database_tama' => $totalDatabaseTama,
                'total_blockchain_tama' => 0,
                'total_nfts' => $totalNfts,
                'active_users_today' => $totalUsers // Simplified
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Получить лидерборд
 */
function handleGetLeaderboard($url, $key) {
    try {
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => 'telegram_id,telegram_username,pet_name,pet_type,pet_rarity,level,xp,tama,created_at',
            'order' => 'tama.desc,level.desc',
            'limit' => '50'
        ]);
        
        $leaderboard = [];
        foreach ($result['data'] as $player) {
            $leaderboard[] = [
                'telegram_id' => $player['telegram_id'] ?? null,
                'telegram_username' => $player['telegram_username'] ?? null,
                'pet_name' => $player['pet_name'] ?? null,
                'pet_type' => $player['pet_type'] ?? null,
                'pet_rarity' => $player['pet_rarity'] ?? null,
                'level' => (int)($player['level'] ?? 1),
                'xp' => (int)($player['xp'] ?? 0),
                'total_tama' => (int)($player['tama'] ?? 0),
                'created_at' => $player['created_at'] ?? null
            ];
        }
        
        echo json_encode([
            'success' => true,
            'leaderboard' => $leaderboard
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Сохранить/обновить данные игры (UPSERT)
 */
function handleLeaderboardUpsert($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // ⚠️ CRITICAL: Always convert user_id to string for consistency
    $user_id = $input['user_id'] ?? null;
    if ($user_id !== null) {
        $user_id = (string)$user_id; // Ensure it's always a string
    }
    
    $user_type = $input['user_type'] ?? 'telegram';
    $telegram_username = $input['telegram_username'] ?? null; // ✅ Accept username from game
    $tama = $input['tama'] ?? null;
    $level = $input['level'] ?? 1;
    $xp = $input['xp'] ?? 0;
    $pet_data = $input['pet_data'] ?? null;
    $pet_name = $input['pet_name'] ?? 'Gotchi';
    $pet_type = $input['pet_type'] ?? 'kawai';
    $skip_transaction_log = $input['skip_transaction_log'] ?? false; // Skip auto-logging if true
    
    // Log incoming request for debugging
    error_log("💾 Leaderboard upsert request: user_id={$user_id}, level={$level}, tama={$tama}, username={$telegram_username}");
    
    if (!$user_id) {
        http_response_code(400);
        echo json_encode(['error' => 'user_id is required']);
        return;
    }
    
    if ($tama === null) {
        http_response_code(400);
        echo json_encode(['error' => 'tama balance is required']);
        return;
    }
    
    try {
        // ⚠️ CRITICAL: Use string for telegram_id query
        // Check if user exists and get old balance
        $getResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => 'telegram_id,tama,telegram_username,level',
            'telegram_id' => 'eq.' . $user_id,
            'limit' => '1'
        ]);
        
        // Log what we found
        if (!empty($getResult['data'])) {
            $existingData = $getResult['data'][0];
            error_log("✅ Found existing user: telegram_id={$existingData['telegram_id']}, level={$existingData['level']}, tama={$existingData['tama']}");
        } else {
            error_log("⚠️ User not found, will create new record: telegram_id={$user_id}");
        }
        
        $updateData = [
            'tama' => (int)$tama,
            'level' => (int)$level,
            'pet_data' => $pet_data,
            'pet_name' => $pet_name,
            'pet_type' => $pet_type,
            'last_activity' => date('Y-m-d\TH:i:s.u\Z')
        ];
        
        // ✅ Update username if provided
        if ($telegram_username !== null) {
            $updateData['telegram_username'] = $telegram_username;
        }
        
        // If xp is provided, update it
        if ($xp !== null) {
            $updateData['xp'] = (int)$xp;
        }
        
        if (!empty($getResult['data'])) {
            // User exists - UPDATE
            $oldTama = (int)($getResult['data'][0]['tama'] ?? 0);
            $username = $getResult['data'][0]['telegram_username'] ?? $user_id;
            $tamaDiff = (int)$tama - $oldTama;
            
            // 🛡️ SECURITY: Prevent rollback of TAMA balance from stale data
            // If incoming TAMA is less than current (negative diff), don't update TAMA
            // UNLESS it's an admin operation (skip_transaction_log = true)
            if ($tamaDiff < 0 && !$skip_transaction_log) {
                error_log("⚠️ BALANCE PROTECTION: Rejected stale TAMA update for user {$user_id}: {$oldTama} → {$tama} (diff: {$tamaDiff}). Keeping current balance.");
                // Remove TAMA from update data to prevent rollback
                unset($updateData['tama']);
            }
            
            // 🛡️ SECURITY: Validate TAMA balance changes to prevent cheating
            // Maximum increase per request: 10,000 TAMA (reasonable limit for legitimate gameplay)
            // BUT: Allow admin fixes (skip_transaction_log = true) to bypass this limit
            $MAX_INCREASE_PER_REQUEST = 10000;
            
            if ($tamaDiff > $MAX_INCREASE_PER_REQUEST && !$skip_transaction_log) {
                // Suspicious: too large increase! (but allow admin fixes)
                error_log("🚨 SECURITY ALERT: User {$user_id} ({$username}) attempted suspicious TAMA increase: {$oldTama} → {$tama} (diff: {$tamaDiff} TAMA)");
                
                // Reject the update and return error
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid balance update: increase too large',
                    'details' => "Maximum increase per request: {$MAX_INCREASE_PER_REQUEST} TAMA"
                ]);
                return;
            }
            
            // Log admin fixes (large changes with skip_transaction_log)
            if (abs($tamaDiff) > 1000 && $skip_transaction_log) {
                error_log("🔧 ADMIN FIX: User {$user_id} ({$username}) balance adjusted: {$oldTama} → {$tama} (diff: {$tamaDiff} TAMA)");
            }
            
            // Check for suspicious negative balance (should not happen in normal gameplay)
            if ((int)$tama < 0) {
                error_log("🚨 SECURITY ALERT: User {$user_id} ({$username}) attempted negative balance: {$tama}");
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid balance: cannot be negative'
                ]);
                return;
            }
            
            // Log suspicious patterns (large increases even if under limit)
            if ($tamaDiff > 1000) {
                error_log("⚠️ WARNING: Large TAMA increase detected for user {$user_id} ({$username}): +{$tamaDiff} TAMA (from {$oldTama} to {$tama})");
            }
            
            // 🛡️ SECURITY: Check daily earning limit on server (CRITICAL!)
            // Client-side checks can be bypassed, so we MUST check on server
            if ($tamaDiff > 0 && !$skip_transaction_log) {
                try {
                    // Get today's date in UTC
                    $today = date('Y-m-d');
                    $todayStart = $today . 'T00:00:00Z';
                    $tomorrowStart = date('Y-m-d', strtotime('+1 day')) . 'T00:00:00Z';
                    
                    // Query today's earning transactions for this user
                    // Note: Supabase PostgREST requires special syntax for date ranges
                    $todayTxResult = supabaseRequest($url, $key, 'GET', 'transactions', [
                        'select' => 'amount',
                        'user_id' => 'eq.' . $user_id,
                        'type' => 'eq.earn_click',
                        'created_at' => 'gte.' . $todayStart
                    ]);
                    
                    // Calculate total earned today from transactions
                    $totalEarnedToday = 0;
                    if (!empty($todayTxResult['data'])) {
                        foreach ($todayTxResult['data'] as $tx) {
                            $txDate = substr($tx['created_at'] ?? '', 0, 10);
                            if ($txDate === $today) {
                                $totalEarnedToday += abs((int)($tx['amount'] ?? 0));
                            }
                        }
                    }
                    
                    // Add current request amount
                    $totalEarnedToday += $tamaDiff;
                    
                    // Daily limit: 10,000 TAMA per day
                    $DAILY_LIMIT = 10000;
                    
                    if ($totalEarnedToday > $DAILY_LIMIT) {
                        error_log("🚨 SECURITY ALERT: User {$user_id} ({$username}) exceeded daily limit: {$totalEarnedToday} / {$DAILY_LIMIT} TAMA");
                        
                        // Cap the increase to stay within daily limit
                        $allowedIncrease = max(0, $DAILY_LIMIT - ($totalEarnedToday - $tamaDiff));
                        
                        if ($allowedIncrease < $tamaDiff) {
                            // Reject the excess
                            http_response_code(400);
                            echo json_encode([
                                'success' => false,
                                'error' => 'Daily earning limit exceeded',
                                'details' => "You've earned {$totalEarnedToday} TAMA today. Daily limit: {$DAILY_LIMIT} TAMA. Allowed increase: {$allowedIncrease} TAMA"
                            ]);
                            return;
                        } else {
                            // Adjust to allowed amount
                            $tama = $oldTama + $allowedIncrease;
                            $tamaDiff = $allowedIncrease;
                            error_log("⚠️ Capped TAMA increase to daily limit: {$allowedIncrease} TAMA (requested: {$tamaDiff})");
                        }
                    }
                } catch (Exception $e) {
                    // If transaction table query fails, log but continue (don't block legitimate users)
                    error_log("⚠️ Could not check daily limit: " . $e->getMessage());
                    // Still enforce per-request limit as fallback
                }
            }
            
            // 🛡️ SECURITY: Additional validation for large increases
            // Note: Daily limit check is handled above, but we also enforce per-request limits here
            // Maximum increase per request is already enforced above (10,000 TAMA)
            // This prevents users from manipulating client-side code to send huge balance updates
            
            // ⚠️ IMPORTANT: Update tama in updateData if it was adjusted by daily limit check
            $updateData['tama'] = (int)$tama;
            
            // ⚠️ DEBUG: Log what we're about to UPDATE
            error_log("🔄 UPDATE data: " . json_encode($updateData));
            
            $updateResult = supabaseRequest($url, $key, 'PATCH', 'leaderboard', [
                'telegram_id' => 'eq.' . $user_id
            ], $updateData);
            
            // ⚠️ DEBUG: Log UPDATE result
            error_log("✅ UPDATE result code: " . $updateResult['code']);
            
            // Log transaction if TAMA changed (unless skip_transaction_log is true)
            if ($tamaDiff != 0 && !$skip_transaction_log) {
                try {
                    $transactionType = $tamaDiff > 0 ? 'earn_click' : 'spend_game';
                    supabaseRequest($url, $key, 'POST', 'transactions', [], [
                        'user_id' => $user_id,
                        'username' => $username,
                        'type' => $transactionType,
                        'amount' => abs($tamaDiff),
                        'balance_before' => $oldTama,
                        'balance_after' => (int)$tama,
                        'metadata' => json_encode([
                            'level' => (int)$level,
                            'xp' => (int)$xp,
                            'pet_type' => $pet_type
                        ])
                    ]);
                } catch (Exception $e) {
                    // Log error but don't fail the request
                    error_log('Failed to log transaction: ' . $e->getMessage());
                }
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Game data updated successfully',
                'data' => [
                    'user_id' => $user_id,
                    'tama' => (int)$tama,
                    'level' => (int)$level
                ]
            ]);
        } else {
            // User doesn't exist - INSERT (should not happen, but handle it)
            $insertData = array_merge($updateData, [
                'telegram_id' => $user_id,
                'telegram_username' => $telegram_username ?? $user_id, // Use provided username or default to user_id
                'wallet_address' => 'telegram_' . $user_id  // Generate wallet address for Telegram users
                // Note: user_type is NOT a column in leaderboard table, removed
            ]);
            
            error_log("📝 INSERT data: " . json_encode($insertData));
            
            $insertResult = supabaseRequest($url, $key, 'POST', 'leaderboard', [], $insertData);
            
            error_log("✅ INSERT result code: " . $insertResult['code']);
            error_log("✅ INSERT result data: " . json_encode($insertResult['data']));
            
            // Check if INSERT was successful
            if ($insertResult['code'] >= 200 && $insertResult['code'] < 300) {
                error_log("✅ User created successfully: telegram_id={$user_id}");
            } else {
                error_log("❌ INSERT failed! HTTP {$insertResult['code']}: " . json_encode($insertResult['data']));
                // Still return success to client, but log the error
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Game data saved successfully (new user)',
                'data' => [
                    'user_id' => $user_id,
                    'tama' => (int)$tama,
                    'level' => (int)$level
                ]
            ]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Получить список пользователей (для админ-панели)
 */
function handleLeaderboardList($url, $key) {
    try {
        // Get limit and offset from query parameters
        $limit = $_GET['limit'] ?? '100';
        $offset = $_GET['offset'] ?? '0';
        $order = $_GET['order'] ?? 'tama.desc';
        
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => '*',
            'order' => $order,
            'limit' => $limit,
            'offset' => $offset
        ]);
        
        echo json_encode([
            'success' => true,
            'data' => $result['data'] ?? []
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Получить список транзакций (для админ-панели)
 */
function handleTransactionsList($url, $key) {
    try {
        // Get parameters from query string
        $limit = $_GET['limit'] ?? '100';
        $offset = $_GET['offset'] ?? '0';
        $order = $_GET['order'] ?? 'created_at.desc';
        
        // Try to fetch from transactions table
        $result = supabaseRequest($url, $key, 'GET', 'transactions', [
            'select' => 'id,user_id,username,type,amount,balance_before,balance_after,metadata,created_at',
            'order' => $order,
            'limit' => $limit,
            'offset' => $offset
            // Note: count is set via 'Prefer: count=exact' header in supabaseRequest()
        ]);
        
        // Get total count from response
        $totalCount = 0;
        if (isset($result['count'])) {
            $totalCount = (int)$result['count'];
        } elseif (isset($result['data'])) {
            // Estimate: if we got full page, there might be more
            if (count($result['data']) == $limit) {
                $totalCount = (int)$offset + (int)$limit + 1; // At least this many
            } else {
                $totalCount = (int)$offset + count($result['data']); // Exact count
            }
        }
        
        // Set Content-Range header for proper pagination
        if ($totalCount > 0) {
            $rangeEnd = min((int)$offset + count($result['data'] ?? []), $totalCount - 1);
            header('Content-Range: ' . $offset . '-' . $rangeEnd . '/' . $totalCount);
        }
        
        echo json_encode([
            'success' => true,
            'data' => $result['data'] ?? [],
            'count' => $totalCount,
            'limit' => (int)$limit,
            'offset' => (int)$offset
        ]);
        
    } catch (Exception $e) {
        // If transactions table doesn't exist, return empty array
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [],
            'count' => 0,
            'message' => 'Transactions table not found or empty'
        ]);
    }
}

/**
 * Обработка запроса на вывод (withdrawal request)
 * 🔒 SECURITY: Enhanced with validation, rate limiting, and cooldown
 */
function handleWithdrawalRequest($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $telegram_id = $input['telegram_id'] ?? null;
    $wallet_address = $input['wallet_address'] ?? null;
    $amount = $input['amount'] ?? null;
    $captcha_token = $input['captcha_token'] ?? null; // Optional CAPTCHA
    
    // ============================================
    // 🛡️ STEP 1: INPUT VALIDATION
    // ============================================
    
    if (!$telegram_id || !$wallet_address || !$amount) {
        logSecurityEvent('invalid_input', 'Withdrawal missing required fields', [
            'has_telegram_id' => !empty($telegram_id),
            'has_wallet' => !empty($wallet_address),
            'has_amount' => !empty($amount)
        ]);
        returnError('telegram_id, wallet_address, and amount are required', 400);
    }
    
    // Validate Telegram ID
    $telegram_id = validateTelegramId($telegram_id);
    if ($telegram_id === false) {
        logSecurityEvent('invalid_input', 'Invalid Telegram ID', [
            'provided_id' => $input['telegram_id'] ?? 'null'
        ]);
        returnError('Invalid telegram_id format', 400);
    }
    
    // Validate Solana wallet address
    if (!validateSolanaAddress($wallet_address)) {
        logSecurityEvent('invalid_input', 'Invalid Solana address', [
            'provided_address' => $wallet_address,
            'telegram_id' => $telegram_id
        ]);
        returnError('Invalid Solana wallet address format', 400);
    }
    
    // Validate amount
    $amount = validateTamaAmount($amount);
    if ($amount === false) {
        logSecurityEvent('invalid_input', 'Invalid withdrawal amount', [
            'provided_amount' => $input['amount'] ?? 'null',
            'telegram_id' => $telegram_id
        ]);
        returnError('Invalid amount format', 400);
    }
    
    if ($amount < 1000) {
        returnError('Minimum withdrawal is 1,000 TAMA', 400);
    }
    
    // ============================================
    // 🛡️ STEP 2: COOLDOWN CHECK (1 withdrawal per hour)
    // ============================================
    
    $cooldownSeconds = (int)(getenv('WITHDRAWAL_COOLDOWN') ?: 3600); // 1 hour default
    
    if (!checkWithdrawalCooldown($telegram_id, $cooldownSeconds)) {
        logSecurityEvent('cooldown', 'Withdrawal cooldown active', [
            'telegram_id' => $telegram_id,
            'wallet' => $wallet_address
        ]);
        returnError('Please wait before making another withdrawal. Cooldown: 1 hour.', 429, [
            'cooldown_seconds' => $cooldownSeconds,
            'retry_after' => $cooldownSeconds
        ]);
    }
    
    // ============================================
    // 🛡️ STEP 3: CAPTCHA VERIFICATION (Optional)
    // ============================================
    
    $captchaEnabled = getenv('WITHDRAWAL_CAPTCHA_ENABLED') === 'true';
    
    if ($captchaEnabled && !$captcha_token) {
        returnError('CAPTCHA verification required', 400, [
            'captcha_required' => true
        ]);
    }
    
    if ($captchaEnabled && $captcha_token) {
        // Verify reCAPTCHA token
        $recaptchaSecret = getenv('RECAPTCHA_SECRET_KEY');
        if ($recaptchaSecret) {
            $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
            $verifyData = [
                'secret' => $recaptchaSecret,
                'response' => $captcha_token,
                'remoteip' => getClientIP()
            ];
            
            $options = [
                'http' => [
                    'method' => 'POST',
                    'header' => 'Content-Type: application/x-www-form-urlencoded',
                    'content' => http_build_query($verifyData)
                ]
            ];
            
            $context = stream_context_create($options);
            $verifyResponse = @file_get_contents($verifyUrl, false, $context);
            
            if ($verifyResponse) {
                $verifyResult = json_decode($verifyResponse, true);
                if (!$verifyResult['success']) {
                    logSecurityEvent('captcha_failed', 'CAPTCHA verification failed', [
                        'telegram_id' => $telegram_id,
                        'error_codes' => $verifyResult['error-codes'] ?? []
                    ]);
                    returnError('CAPTCHA verification failed', 400);
                }
            }
        }
    }
    
    try {
        // Получить текущий баланс
        $getResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => 'tama',
            'telegram_id' => 'eq.' . $telegram_id,
            'limit' => '1'
        ]);
        
        if (empty($getResult['data'])) {
            http_response_code(400);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $currentBalance = (int)($getResult['data'][0]['tama'] ?? 0);
        
        if ($currentBalance < $amount) {
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient TAMA balance']);
            return;
        }
        
        // Calculate fee (5%)
        $fee = (int)($amount * 0.05);
        $amountSent = $amount - $fee;
        $newBalance = $currentBalance - $amount;
        
        // РЕАЛЬНАЯ ТРАНЗАКЦИЯ В SOLANA через spl-token CLI
        // ИЗМЕНЕНО: Теперь используем P2E Pool вместо mint authority
        $tamaMint = getenv('TAMA_MINT_ADDRESS');
        $rpcUrl = getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com';
        
        // Try multiple paths for payer keypair (with fallbacks)
        $payerKeypair = null;
        $possiblePayerPaths = [
            getenv('SOLANA_PAYER_KEYPAIR_PATH'),  // From environment variable
            __DIR__ . '/../payer-keypair.json',    // Relative to api/ directory
            __DIR__ . '/payer-keypair.json',       // In api/ directory
            '/app/payer-keypair.json',              // Absolute path (Render/Docker)
            '/app/api/payer-keypair.json',         // Alternative absolute path
            dirname(__DIR__) . '/payer-keypair.json', // Parent directory
        ];
        
        foreach ($possiblePayerPaths as $path) {
            if ($path && file_exists($path)) {
                $payerKeypair = $path;
                break;
            }
        }
        
        // Try multiple paths for P2E Pool keypair (with fallbacks)
        $p2ePoolKeypair = null;
        $possibleP2EPaths = [
            getenv('SOLANA_P2E_POOL_KEYPAIR_PATH'),  // From environment variable
            __DIR__ . '/../p2e-pool-keypair.json',    // Relative to api/ directory
            __DIR__ . '/p2e-pool-keypair.json',      // In api/ directory
            '/app/p2e-pool-keypair.json',             // Absolute path (Render/Docker)
            '/app/api/p2e-pool-keypair.json',         // Alternative absolute path
            dirname(__DIR__) . '/p2e-pool-keypair.json', // Parent directory
        ];
        
        foreach ($possibleP2EPaths as $path) {
            if ($path && file_exists($path)) {
                $p2ePoolKeypair = $path;
                break;
            }
        }
        
        // P2E Pool Address: HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw
        $p2ePoolAddress = 'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw';
        
        if (!$tamaMint) {
            http_response_code(500);
            echo json_encode(['error' => 'TAMA_MINT_ADDRESS not configured']);
            return;
        }
        
        if (!$payerKeypair) {
            http_response_code(500);
            $triedPaths = array_filter($possiblePayerPaths);
            error_log('❌ Payer keypair not found. Tried paths: ' . implode(', ', $triedPaths));
            echo json_encode([
                'error' => 'Payer keypair not found',
                'details' => 'Tried paths: ' . implode(', ', array_filter($possiblePayerPaths)),
                'hint' => 'Please set SOLANA_PAYER_KEYPAIR_PATH environment variable or place payer-keypair.json in project root'
            ]);
            return;
        }
        
        if (!$p2ePoolKeypair) {
            http_response_code(500);
            $triedPaths = array_filter($possibleP2EPaths);
            error_log('❌ P2E Pool keypair not found. Tried paths: ' . implode(', ', $triedPaths));
            echo json_encode([
                'error' => 'P2E Pool keypair not found',
                'details' => 'Tried paths: ' . implode(', ', array_filter($possibleP2EPaths)),
                'hint' => 'Please set SOLANA_P2E_POOL_KEYPAIR_PATH environment variable or place p2e-pool-keypair.json in project root'
            ]);
            return;
        }
        
        error_log("✅ Using keypairs for withdrawal:");
        error_log("  Payer: {$payerKeypair}");
        error_log("  P2E Pool: {$p2ePoolKeypair}");
        
        // ВАЖНО: Теперь используем P2E Pool как источник токенов
        // Токены переводятся из P2E Pool, а не минтится новые
        // Это правильная реализация согласно токеномике
        
        // Выполнить spl-token transfer из P2E Pool
        // Используем p2e-pool-keypair как owner (у него должны быть токены)
        // Используем payer keypair как fee-payer (для оплаты комиссии)
        $cmd = [
            'spl-token',
            'transfer',
            $tamaMint,
            (string)$amountSent,  // Amount after fee - spl-token сам конвертирует с учетом decimals (9)
            $wallet_address,
            '--fund-recipient',  // Create ATA if needed
            '--allow-unfunded-recipient',  // Allow sending to unfunded addresses
            '--fee-payer', $payerKeypair,  // Кто платит за транзакцию (SOL)
            '--owner', $p2ePoolKeypair,  // Owner - P2E Pool (отсюда берутся токены)
            '--url', $rpcUrl,
            '--output', 'json'
        ];
        
        // Проверить, установлен ли spl-token
        $solanaCheck = shell_exec('solana --version 2>&1');
        if (strpos($solanaCheck, 'solana-cli') === false) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Solana CLI not found',
                'details' => 'Please install Solana CLI tools: https://docs.solana.com/cli/install-solana-cli-tools',
                'check_output' => $splTokenCheck
            ]);
            return;
        }
        
        $descriptorspec = [
            0 => ['pipe', 'r'],  // stdin
            1 => ['pipe', 'w'],  // stdout
            2 => ['pipe', 'w']   // stderr
        ];
        
        // 🔒 SECURITY: Properly escape ALL command arguments
        // ALWAYS use escapeshellarg() for user-provided data to prevent command injection
        $cmdString = '';
        foreach ($cmd as $arg) {
            // Escape all arguments EXCEPT base command 'spl-token' and subcommands
            if ($arg === 'spl-token' || $arg === 'transfer') {
                $cmdString .= $arg . ' ';
            } else {
                // Escape EVERYTHING else (addresses, paths, URLs, amounts)
                $cmdString .= escapeshellarg($arg) . ' ';
            }
        }
        $cmdString = trim($cmdString);
        
        // Log command execution for audit (without sensitive keypair paths)
        error_log('🔐 Executing withdrawal: ' . json_encode([
            'telegram_id' => $telegram_id,
            'wallet' => substr($wallet_address, 0, 8) . '...' . substr($wallet_address, -8),
            'amount' => $amountSent,
            'fee' => $fee
        ]));
        
        // Увеличиваем время выполнения для spl-token (может быть долго)
        set_time_limit(120); // 2 минуты максимум
        
        $process = proc_open($cmdString, $descriptorspec, $pipes);
        
        if (!is_resource($process)) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Failed to start spl-token process',
                'command' => $cmdString
            ]);
            return;
        }
        
        fclose($pipes[0]);
        
        // Читаем вывод с таймаутом (spl-token может выполняться долго)
        $stdout = '';
        $stderr = '';
        $startTime = time();
        $timeout = 90; // 90 секунд максимум
        
        while (true) {
            $status = proc_get_status($process);
            
            // Проверяем, завершился ли процесс
            if (!$status['running']) {
                break;
            }
            
            // Проверяем таймаут
            if (time() - $startTime > $timeout) {
                proc_terminate($process);
                http_response_code(500);
                echo json_encode([
                    'error' => 'Solana transaction timeout',
                    'details' => 'spl-token command took too long (>90 seconds)',
                    'command' => $cmdString
                ]);
                return;
            }
            
            // Читаем доступные данные
            $read = [$pipes[1], $pipes[2]];
            $write = null;
            $except = null;
            
            if (stream_select($read, $write, $except, 1) > 0) {
                foreach ($read as $pipe) {
                    // Читаем только доступные данные (неблокирующий режим)
                    stream_set_blocking($pipe, false);
                    $data = fread($pipe, 8192); // Читаем до 8KB за раз
                    if ($data !== false && $data !== '') {
                        if ($pipe === $pipes[1]) {
                            $stdout .= $data;
                        } elseif ($pipe === $pipes[2]) {
                            $stderr .= $data;
                        }
                    }
                    stream_set_blocking($pipe, true);
                }
            }
            
            usleep(100000); // 0.1 секунды
        }
        
        // Читаем оставшиеся данные
        $stdout .= stream_get_contents($pipes[1]);
        $stderr .= stream_get_contents($pipes[2]);
        fclose($pipes[1]);
        fclose($pipes[2]);
        
        $returnCode = proc_close($process);
        
        // Логируем для отладки
        error_log("spl-token command: " . $cmdString);
        error_log("spl-token stdout: " . $stdout);
        error_log("spl-token stderr: " . $stderr);
        error_log("spl-token return code: " . $returnCode);
        
        if ($returnCode !== 0) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Solana transaction failed',
                'details' => trim($stderr) ?: 'Unknown error',
                'stdout' => trim($stdout),
                'command' => $cmdString,
                'return_code' => $returnCode
            ]);
            return;
        }
        
        // Парсим JSON ответ от spl-token
        $txData = json_decode($stdout, true);
        
        if (!$txData || !isset($txData['signature'])) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Failed to parse transaction signature',
                'output' => $stdout,
                'stderr' => $stderr
            ]);
            return;
        }
        
        $txSignature = $txData['signature'];
        $cluster = strpos($rpcUrl, 'devnet') !== false ? 'devnet' : 'mainnet-beta';
        $explorerUrl = 'https://explorer.solana.com/tx/' . $txSignature . '?cluster=' . $cluster;
        
        // Обновить баланс в Supabase
        $currentTotalWithdrawn = (int)($getResult['data'][0]['total_withdrawn'] ?? 0);
        supabaseRequest($url, $key, 'PATCH', 'leaderboard', [
            'telegram_id' => 'eq.' . $telegram_id
        ], [
            'tama' => $newBalance,
            'total_withdrawn' => $currentTotalWithdrawn + $amountSent // Используем amount_sent (после fee)
        ]);
        
        // Сохранить withdrawal в таблицу (если есть tama_economy или withdrawals)
        try {
            supabaseRequest($url, $key, 'POST', 'tama_economy', [], [
                'telegram_id' => $telegram_id,
                'transaction_type' => 'withdrawal',
                'amount' => -$amount, // Negative for withdrawal
                'amount_sent' => $amountSent, // Net amount after fee
                'fee' => $fee,
                'signature' => $txSignature,
                'wallet_address' => $wallet_address,
                'source' => 'p2e_pool', // Указываем что токены из P2E Pool
                'source_address' => $p2ePoolAddress, // Адрес P2E Pool
                'status' => 'completed'
            ]);
        } catch (Exception $e) {
            // Table might not exist, continue anyway
        }
        
        echo json_encode([
            'success' => true,
            'withdrawal' => [
                'amount_sent' => $amountSent,
                'fee' => $fee,
                'transaction_signature' => $txSignature,
                'explorer_url' => $explorerUrl,
                'new_balance' => $newBalance
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Получить историю выводов (withdrawal history)
 */
function handleWithdrawalHistory($url, $key) {
    $telegram_id = $_GET['telegram_id'] ?? null;
    
    if (!$telegram_id) {
        http_response_code(400);
        echo json_encode(['error' => 'telegram_id is required']);
        return;
    }
    
    try {
        // Попробовать получить из tama_economy
        $result = supabaseRequest($url, $key, 'GET', 'tama_economy', [
            'select' => '*',
            'telegram_id' => 'eq.' . $telegram_id,
            'transaction_type' => 'eq.withdrawal',
            'order' => 'created_at.desc',
            'limit' => '50'
        ]);
        
        $withdrawals = [];
        if (!empty($result['data'])) {
            foreach ($result['data'] as $tx) {
                $withdrawals[] = [
                    'amount_sent' => abs((int)($tx['amount'] ?? 0)) - (int)($tx['fee'] ?? 0),
                    'amount' => abs((int)($tx['amount'] ?? 0)),
                    'fee' => (int)($tx['fee'] ?? 0),
                    'signature' => $tx['signature'] ?? null,
                    'wallet_address' => $tx['wallet_address'] ?? null,
                    'status' => $tx['status'] ?? 'completed',
                    'created_at' => $tx['created_at'] ?? null
                ];
            }
        }
        
        echo json_encode([
            'success' => true,
            'withdrawals' => $withdrawals
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Распределение токенов между кошельками проекта
 * POST /api/tama/distribute
 * Body: { from_wallet: 'address', to_wallet: 'address', amount: 1000000 }
 */
function handleDistribute($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $fromWallet = $input['from_wallet'] ?? null;
    $toWallet = $input['to_wallet'] ?? null;
    $amount = $input['amount'] ?? null;
    
    if (!$fromWallet || !$toWallet || !$amount) {
        http_response_code(400);
        echo json_encode(['error' => 'from_wallet, to_wallet, and amount are required']);
        return;
    }
    
    if ($amount < 1) {
        http_response_code(400);
        echo json_encode(['error' => 'Amount must be at least 1 TAMA']);
        return;
    }
    
    try {
        // РЕАЛЬНАЯ ТРАНЗАКЦИЯ В SOLANA через spl-token CLI
        $tamaMint = getenv('TAMA_MINT_ADDRESS') ?: TAMA_MINT_ADDRESS;
        $rpcUrl = getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com';
        $payerKeypair = getenv('SOLANA_PAYER_KEYPAIR_PATH') ?: __DIR__ . '/../payer-keypair.json';
        
        if (!$tamaMint) {
            http_response_code(500);
            echo json_encode(['error' => 'TAMA_MINT_ADDRESS not configured']);
            return;
        }
        
        if (!file_exists($payerKeypair)) {
            http_response_code(500);
            echo json_encode(['error' => 'Payer keypair not found: ' . $payerKeypair]);
            return;
        }
        
        // Проверить, установлен ли spl-token
        $solanaCheck = shell_exec('solana --version 2>&1');
        if (strpos($solanaCheck, 'solana-cli') === false) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Solana CLI not found',
                'details' => 'Please install Solana CLI tools: https://docs.solana.com/cli/install-solana-cli-tools'
            ]);
            return;
        }
        
        // Выполнить spl-token transfer от from_wallet к to_wallet
        // Используем payer keypair как fee-payer и owner (у него есть token account с балансом)
        $cmd = [
            'spl-token',
            'transfer',
            $tamaMint,
            (string)$amount,  // Amount - spl-token сам конвертирует с учетом decimals (9)
            $toWallet,
            '--fund-recipient',  // Create ATA if needed
            '--allow-unfunded-recipient',  // Allow sending to unfunded addresses (no SOL needed)
            '--fee-payer', $payerKeypair,
            '--owner', $payerKeypair,  // Owner должен иметь token account с балансом
            '--url', $rpcUrl,
            '--output', 'json'
        ];
        
        $descriptorspec = [
            0 => ['pipe', 'r'],  // stdin
            1 => ['pipe', 'w'],  // stdout
            2 => ['pipe', 'w']   // stderr
        ];
        
        // Форматируем команду для Windows
        $cmdString = '';
        foreach ($cmd as $arg) {
            if (strpos($arg, ' ') !== false || strpos($arg, '--') === 0 || strpos($arg, '.json') !== false) {
                $cmdString .= escapeshellarg($arg) . ' ';
            } else {
                $cmdString .= $arg . ' ';
            }
        }
        $cmdString = trim($cmdString);
        
        // Увеличиваем время выполнения
        set_time_limit(120);
        
        $process = proc_open($cmdString, $descriptorspec, $pipes);
        
        if (!is_resource($process)) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Failed to start spl-token process',
                'command' => $cmdString
            ]);
            return;
        }
        
        fclose($pipes[0]);
        
        // Читаем вывод с таймаутом
        $stdout = '';
        $stderr = '';
        $startTime = time();
        $timeout = 90;
        
        while (true) {
            $status = proc_get_status($process);
            
            if ($status === false) {
                break;
            }
            
            if ($status['running'] === false) {
                // Процесс завершился, читаем оставшиеся данные
                $stdout .= stream_get_contents($pipes[1]);
                $stderr .= stream_get_contents($pipes[2]);
                break;
            }
            
            // Проверяем таймаут
            if (time() - $startTime > $timeout) {
                proc_terminate($process);
                proc_close($process);
                http_response_code(500);
                echo json_encode([
                    'error' => 'Transaction timeout',
                    'timeout' => $timeout
                ]);
                return;
            }
            
            // Неблокирующее чтение
            $read = [$pipes[1], $pipes[2]];
            $write = null;
            $except = null;
            
            if (stream_select($read, $write, $except, 0, 200000) > 0) {
                if (in_array($pipes[1], $read)) {
                    $chunk = fread($pipes[1], 8192);
                    if ($chunk !== false) {
                        $stdout .= $chunk;
                    }
                }
                if (in_array($pipes[2], $read)) {
                    $chunk = fread($pipes[2], 8192);
                    if ($chunk !== false) {
                        $stderr .= $chunk;
                    }
                }
            }
            
            usleep(100000); // 100ms
        }
        
        fclose($pipes[1]);
        fclose($pipes[2]);
        $returnCode = proc_close($process);
        
        if ($returnCode !== 0) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Solana transaction failed',
                'return_code' => $returnCode,
                'stderr' => $stderr,
                'stdout' => $stdout,
                'command' => $cmdString
            ]);
            return;
        }
        
        // Парсим результат
        $result = json_decode($stdout, true);
        $signature = $result['signature'] ?? null;
        
        if (!$signature) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Transaction signature not found',
                'stdout' => $stdout,
                'stderr' => $stderr
            ]);
            return;
        }
        
        // Успешно!
        echo json_encode([
            'success' => true,
            'message' => 'Tokens distributed successfully',
            'from_wallet' => $fromWallet,
            'to_wallet' => $toWallet,
            'amount' => $amount,
            'signature' => $signature,
            'explorer_url' => 'https://explorer.solana.com/tx/' . $signature . '?cluster=devnet'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * On-Chain Bronze NFT Mint Distribution
 * POST /api/tama/nft/mint-bronze-onchain
 * Body: { telegram_id: '...', tier: 'Bronze', rarity: 'Common', multiplier: 2.0 }
 * 
 * Выполняет реальные SPL Token transfers:
 * - 40% (1,000 TAMA) → Burn
 * - 30% (750 TAMA) → Treasury Main
 * - 30% (750 TAMA) → P2E Pool (обратно)
 */
function handleBronzeNFTOnChain($url, $key) {
    // Suppress warnings to prevent HTML output
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
    
    // Start output buffering to catch any accidental output
    ob_start();
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON input: ' . json_last_error_msg());
        }
        
        $telegram_id = $input['telegram_id'] ?? null;
        $tier = $input['tier'] ?? 'Bronze';
        $rarity = $input['rarity'] ?? 'Common';
        $multiplier = $input['multiplier'] ?? 2.0;
        $tama_price = $input['tama_price'] ?? null; // Динамическая цена
        
        if (!$telegram_id) {
            http_response_code(400);
            echo json_encode(['error' => 'telegram_id is required']);
            return;
        }
        // Addresses
        $P2E_POOL = 'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw';
        $TREASURY_MAIN = '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM';
        $BURN_ADDRESS = '1nc1nerator11111111111111111111111111111111'; // Solana burn address
        
        // Get price from nft_tiers table if not provided
        if ($tama_price === null) {
            try {
                $tierResult = supabaseRequest($url, $key, 'GET', 'nft_tiers', [
                    'select' => 'tama_price',
                    'tier_name' => 'eq.' . $tier
                ]);
                
                if (!empty($tierResult['data'])) {
                    $tama_price = (int)$tierResult['data'][0]['tama_price'];
                    error_log("✅ Loaded TAMA price from database: {$tama_price} for tier {$tier}");
                } else {
                    // Fallback to default prices
                    $tama_price = $tier === 'Bronze' ? 2500 : ($tier === 'Silver' ? 5000 : 10000);
                    error_log("⚠️ Using fallback price: {$tama_price} for tier {$tier}");
                }
            } catch (Exception $e) {
                error_log("⚠️ Failed to load tier price: " . $e->getMessage());
                $tama_price = 2500; // Default fallback
            }
        }
        
        // Distribution in percentages (dynamic based on actual price)
        $distribution = [
            'burn' => (int)($tama_price * 0.40),      // 40%
            'treasury' => (int)($tama_price * 0.30),  // 30%
            'p2e_pool' => (int)($tama_price * 0.30)   // 30%
        ];
        
        error_log("📊 Distribution for {$tier} NFT (price: {$tama_price} TAMA):");
        error_log("  🔥 Burn: {$distribution['burn']} TAMA (40%)");
        error_log("  💰 Treasury: {$distribution['treasury']} TAMA (30%)");
        error_log("  🎮 P2E Pool: {$distribution['p2e_pool']} TAMA (30%)");
        
        // Config
        $tamaMint = getenv('TAMA_MINT_ADDRESS') ?: TAMA_MINT_ADDRESS;
        $rpcUrl = getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com';
        
        // Keypair paths - check both /app/ and fallback
        $payerKeypair = getenv('SOLANA_PAYER_KEYPAIR_PATH') ?: '/app/payer-keypair.json';
        $p2ePoolKeypair = getenv('SOLANA_P2E_POOL_KEYPAIR_PATH') ?: '/app/p2e-pool-keypair.json';
        
        // Try /app/ first, then fallback to relative path
        if (!file_exists($payerKeypair)) {
            $payerKeypair = __DIR__ . '/../payer-keypair.json';
        }
        if (!file_exists($p2ePoolKeypair)) {
            $p2ePoolKeypair = __DIR__ . '/../p2e-pool-keypair.json';
        }
        
        if (!file_exists($payerKeypair)) {
            throw new Exception('Payer keypair not found. Tried: ' . getenv('SOLANA_PAYER_KEYPAIR_PATH') . ' and ' . __DIR__ . '/../payer-keypair.json');
        }
        
        if (!file_exists($p2ePoolKeypair)) {
            throw new Exception('P2E Pool keypair not found. Tried: ' . getenv('SOLANA_P2E_POOL_KEYPAIR_PATH') . ' and ' . __DIR__ . '/../p2e-pool-keypair.json');
        }
        
        error_log("✅ Using keypairs:");
        error_log("  Payer: {$payerKeypair}");
        error_log("  P2E Pool: {$p2ePoolKeypair}");
        
        // Check Solana CLI (includes spl-token commands)
        $solanaCheck = shell_exec('solana --version 2>&1');
        if (strpos($solanaCheck, 'solana-cli') === false) {
            throw new Exception('Solana CLI not found');
        }
        
        // Verify spl-token is available (comes with Solana CLI release)
        $splTokenCheck = shell_exec('spl-token --version 2>&1');
        if (strpos($splTokenCheck, 'spl-token') === false) {
            error_log('⚠️ Warning: spl-token check failed, but continuing...');
        }
        
        $transactions = [];
        
        // Transaction 1: BURN (1,000 TAMA)
        error_log("🔥 BURN: Transferring {$distribution['burn']} TAMA to burn address");
        $burnResult = executeSPLTransfer(
            $p2ePoolKeypair,
            $payerKeypair,
            $BURN_ADDRESS,
            $distribution['burn'],
            $tamaMint,
            $rpcUrl
        );
        
        if (!$burnResult['success']) {
            throw new Exception('Burn transaction failed: ' . $burnResult['error']);
        }
        
        $transactions['burn'] = $burnResult['signature'];
        error_log("✅ BURN successful: " . $burnResult['signature']);
        
        // Transaction 2: TREASURY (750 TAMA)
        error_log("💰 TREASURY: Transferring {$distribution['treasury']} TAMA to Treasury Main");
        $treasuryResult = executeSPLTransfer(
            $p2ePoolKeypair,
            $payerKeypair,
            $TREASURY_MAIN,
            $distribution['treasury'],
            $tamaMint,
            $rpcUrl
        );
        
        if (!$treasuryResult['success']) {
            throw new Exception('Treasury transaction failed: ' . $treasuryResult['error']);
        }
        
        $transactions['treasury'] = $treasuryResult['signature'];
        error_log("✅ TREASURY successful: " . $treasuryResult['signature']);
        
        // Transaction 3: P2E POOL REFUND (750 TAMA) - обратно в P2E Pool
        error_log("🎮 P2E POOL: Refunding {$distribution['p2e_pool']} TAMA to P2E Pool");
        $p2eResult = executeSPLTransfer(
            $p2ePoolKeypair,
            $payerKeypair,
            $P2E_POOL,
            $distribution['p2e_pool'],
            $tamaMint,
            $rpcUrl
        );
        
        if (!$p2eResult['success']) {
            throw new Exception('P2E Pool transaction failed: ' . $p2eResult['error']);
        }
        
        $transactions['p2e_pool'] = $p2eResult['signature'];
        error_log("✅ P2E POOL successful: " . $p2eResult['signature']);
        
        // Log all transactions in database
        try {
            // 1. Burn transaction log
            supabaseRequest($url, $key, 'POST', 'transactions', [], [
                'user_id' => 'BURN_ADDRESS',
                'username' => '🔥 Token Burn',
                'type' => 'burn_from_bronze_nft_onchain',
                'amount' => $distribution['burn'],
                'balance_before' => 0,
                'balance_after' => 0,
                'metadata' => json_encode([
                    'source' => 'bronze_nft_mint_onchain',
                    'tier' => $tier,
                    'rarity' => $rarity,
                    'user' => $telegram_id,
                    'transaction_signature' => $transactions['burn']
                ])
            ]);
            
            // 2. Treasury transaction log
            supabaseRequest($url, $key, 'POST', 'transactions', [], [
                'user_id' => $TREASURY_MAIN,
                'username' => '💰 Treasury Main V2',
                'type' => 'treasury_income_from_nft_onchain',
                'amount' => $distribution['treasury'],
                'balance_before' => 0,
                'balance_after' => 0,
                'metadata' => json_encode([
                    'source' => 'bronze_nft_mint_onchain',
                    'tier' => $tier,
                    'rarity' => $rarity,
                    'user' => $telegram_id,
                    'transaction_signature' => $transactions['treasury']
                ])
            ]);
            
            // 3. P2E Pool transaction log
            supabaseRequest($url, $key, 'POST', 'transactions', [], [
                'user_id' => $P2E_POOL,
                'username' => '🎮 P2E Pool Refund',
                'type' => 'p2e_pool_refund_from_nft_onchain',
                'amount' => $distribution['p2e_pool'],
                'balance_before' => 0,
                'balance_after' => 0,
                'metadata' => json_encode([
                    'source' => 'bronze_nft_mint_onchain',
                    'tier' => $tier,
                    'rarity' => $rarity,
                    'user' => $telegram_id,
                    'transaction_signature' => $transactions['p2e_pool']
                ])
            ]);
            
            error_log("✅ All transactions logged in database");
            
        } catch (Exception $e) {
            error_log('Failed to log transactions: ' . $e->getMessage());
        }
        
        // Success response - ensure JSON only
        // Clear any accidental output
        $obContent = ob_get_contents();
        if (!empty($obContent)) {
            error_log("⚠️ Warning: Output buffer contains data before JSON response: " . substr($obContent, 0, 200));
        }
        ob_end_clean(); // End and clean output buffer
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Bronze NFT on-chain distribution completed',
            'tier' => $tier,
            'rarity' => $rarity,
            'multiplier' => $multiplier,
            'tama_price' => $tama_price,
            'distribution' => $distribution,
            'distribution_percentages' => [
                'burn' => '40%',
                'treasury' => '30%',
                'p2e_pool' => '30%'
            ],
            'transactions' => [
                'burn' => [
                    'amount' => $distribution['burn'],
                    'signature' => $transactions['burn'],
                    'explorer_url' => 'https://explorer.solana.com/tx/' . $transactions['burn'] . '?cluster=devnet'
                ],
                'treasury' => [
                    'amount' => $distribution['treasury'],
                    'signature' => $transactions['treasury'],
                    'explorer_url' => 'https://explorer.solana.com/tx/' . $transactions['treasury'] . '?cluster=devnet'
                ],
                'p2e_pool' => [
                    'amount' => $distribution['p2e_pool'],
                    'signature' => $transactions['p2e_pool'],
                    'explorer_url' => 'https://explorer.solana.com/tx/' . $transactions['p2e_pool'] . '?cluster=devnet'
                ]
            ]
        ]);
        return;
        
    } catch (Exception $e) {
        // Ensure JSON error response
        // Clear any accidental output
        $obContent = ob_get_contents();
        if (!empty($obContent)) {
            error_log("⚠️ Warning: Output buffer contains data before error JSON response: " . substr($obContent, 0, 200));
        }
        ob_end_clean(); // End and clean output buffer
        header('Content-Type: application/json');
        http_response_code(500);
        error_log('❌ On-chain distribution error: ' . $e->getMessage());
        error_log('❌ Stack trace: ' . $e->getTraceAsString());
        echo json_encode([
            'error' => $e->getMessage(),
            'details' => 'On-chain distribution failed. NFT is registered but distribution incomplete.',
            'file' => basename($e->getFile()),
            'line' => $e->getLine()
        ]);
        return;
    } catch (Throwable $e) {
        // Catch any other errors (fatal errors, etc)
        // Clear any accidental output
        $obContent = ob_get_contents();
        if (!empty($obContent)) {
            error_log("⚠️ Warning: Output buffer contains data before fatal error JSON response: " . substr($obContent, 0, 200));
        }
        if (ob_get_level() > 0) {
            ob_end_clean(); // End and clean output buffer
        }
        header('Content-Type: application/json');
        http_response_code(500);
        error_log('❌ Fatal error in on-chain distribution: ' . $e->getMessage());
        echo json_encode([
            'error' => 'Internal server error',
            'details' => 'On-chain distribution failed. NFT is registered but distribution incomplete.',
            'message' => $e->getMessage()
        ]);
        return;
    }
}

/**
 * Execute SPL Token Transfer
 * Helper function for spl-token CLI execution
 */
function executeSPLTransfer($ownerKeypair, $feePayerKeypair, $toAddress, $amount, $tamaMint, $rpcUrl) {
    $cmd = [
        'spl-token',
        'transfer',
        $tamaMint,
        (string)$amount,
        $toAddress,
        '--fund-recipient',
        '--allow-unfunded-recipient',
        '--fee-payer', $feePayerKeypair,
        '--owner', $ownerKeypair,
        '--url', $rpcUrl,
        '--output', 'json'
    ];
    
    // Format command
    $cmdString = '';
    foreach ($cmd as $arg) {
        if (strpos($arg, ' ') !== false || strpos($arg, '--') === 0 || strpos($arg, '.json') !== false) {
            $cmdString .= escapeshellarg($arg) . ' ';
        } else {
            $cmdString .= $arg . ' ';
        }
    }
    $cmdString = trim($cmdString);
    
    error_log("Executing: " . $cmdString);
    
    // Execute
    $descriptorspec = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w']
    ];
    
    $process = proc_open($cmdString, $descriptorspec, $pipes);
    
    if (!is_resource($process)) {
        return ['success' => false, 'error' => 'Failed to start process'];
    }
    
    fclose($pipes[0]);
    
    // Read output with timeout
    $stdout = '';
    $stderr = '';
    $startTime = time();
    $timeout = 90;
    
    while (true) {
        $status = proc_get_status($process);
        
        if ($status === false || !$status['running']) {
            $stdout .= stream_get_contents($pipes[1]);
            $stderr .= stream_get_contents($pipes[2]);
            break;
        }
        
        if (time() - $startTime > $timeout) {
            proc_terminate($process);
            proc_close($process);
            return ['success' => false, 'error' => 'Transaction timeout'];
        }
        
        usleep(100000);
    }
    
    fclose($pipes[1]);
    fclose($pipes[2]);
    $returnCode = proc_close($process);
    
    // Parse result first (spl-token may return non-zero code even on success)
    $result = json_decode($stdout, true);
    $signature = $result['signature'] ?? null;
    
    // If we have a signature, transaction was successful
    if ($signature) {
        error_log("✅ SPL Transfer successful: " . $signature);
        return [
            'success' => true,
            'signature' => $signature,
            'amount' => $amount,
            'to_address' => $toAddress
        ];
    }
    
    // No signature - this is a real error
    if ($returnCode !== 0) {
        error_log("❌ SPL Transfer failed: " . $stderr);
        return [
            'success' => false,
            'error' => trim($stderr) ?: trim($stdout),
            'return_code' => $returnCode
        ];
    }
    
    // Edge case: returnCode 0 but no signature
    return [
        'success' => false,
        'error' => 'Signature not found in output',
        'stdout' => $stdout,
        'stderr' => $stderr
    ];
}

/**
 * Минтинг новых токенов (создание токенов)
 * POST /api/tama/mint
 * Body: { to_wallet: 'address', amount: 1000000 }
 */
function handleMint($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $toWallet = $input['to_wallet'] ?? null;
    $amount = $input['amount'] ?? null;
    
    if (!$toWallet || !$amount) {
        http_response_code(400);
        echo json_encode(['error' => 'to_wallet and amount are required']);
        return;
    }
    
    if ($amount < 1) {
        http_response_code(400);
        echo json_encode(['error' => 'Amount must be at least 1 TAMA']);
        return;
    }
    
    try {
        // РЕАЛЬНАЯ ТРАНЗАКЦИЯ В SOLANA через spl-token CLI
        $tamaMint = getenv('TAMA_MINT_ADDRESS') ?: TAMA_MINT_ADDRESS;
        $rpcUrl = getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com';
        $payerKeypair = getenv('SOLANA_PAYER_KEYPAIR_PATH') ?: __DIR__ . '/../payer-keypair.json';
        $mintKeypair = getenv('SOLANA_MINT_KEYPAIR_PATH') ?: __DIR__ . '/../tama-mint-keypair.json';
        
        if (!$tamaMint) {
            http_response_code(500);
            echo json_encode(['error' => 'TAMA_MINT_ADDRESS not configured']);
            return;
        }
        
        if (!file_exists($payerKeypair)) {
            http_response_code(500);
            echo json_encode(['error' => 'Payer keypair not found: ' . $payerKeypair]);
            return;
        }
        
        // Проверить, установлен ли spl-token
        $solanaCheck = shell_exec('solana --version 2>&1');
        if (strpos($solanaCheck, 'solana-cli') === false) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Solana CLI not found',
                'details' => 'Please install Solana CLI tools: https://docs.solana.com/cli/install-solana-cli-tools'
            ]);
            return;
        }
        
        // Выполнить spl-token mint (создание новых токенов)
        // Используем mint keypair как owner (mint authority)
        // Используем payer keypair как fee-payer
        $cmd = [
            'spl-token',
            'mint',
            $tamaMint,
            (string)$amount,  // Amount - spl-token сам конвертирует с учетом decimals (9)
            $toWallet,
            '--owner', $mintKeypair,  // Mint authority (может создавать токены)
            '--fee-payer', $payerKeypair,  // Кто платит за транзакцию
            '--url', $rpcUrl,
            '--output', 'json'
        ];
        
        $descriptorspec = [
            0 => ['pipe', 'r'],  // stdin
            1 => ['pipe', 'w'],  // stdout
            2 => ['pipe', 'w']   // stderr
        ];
        
        // Форматируем команду для Windows
        $cmdString = '';
        foreach ($cmd as $arg) {
            if (strpos($arg, ' ') !== false || strpos($arg, '--') === 0 || strpos($arg, '.json') !== false) {
                $cmdString .= escapeshellarg($arg) . ' ';
            } else {
                $cmdString .= $arg . ' ';
            }
        }
        $cmdString = trim($cmdString);
        
        // Увеличиваем время выполнения
        set_time_limit(120);
        
        $process = proc_open($cmdString, $descriptorspec, $pipes);
        
        if (!is_resource($process)) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Failed to start spl-token process',
                'command' => $cmdString
            ]);
            return;
        }
        
        fclose($pipes[0]);
        
        // Читаем вывод с таймаутом
        $stdout = '';
        $stderr = '';
        $startTime = time();
        $timeout = 90;
        
        while (true) {
            $status = proc_get_status($process);
            
            if ($status === false) {
                break;
            }
            
            if ($status['running'] === false) {
                // Процесс завершился, читаем оставшиеся данные
                $stdout .= stream_get_contents($pipes[1]);
                $stderr .= stream_get_contents($pipes[2]);
                break;
            }
            
            // Проверяем таймаут
            if (time() - $startTime > $timeout) {
                proc_terminate($process);
                proc_close($process);
                http_response_code(500);
                echo json_encode([
                    'error' => 'Transaction timeout',
                    'timeout' => $timeout
                ]);
                return;
            }
            
            // Неблокирующее чтение
            $read = [$pipes[1], $pipes[2]];
            $write = null;
            $except = null;
            
            if (stream_select($read, $write, $except, 0, 200000) > 0) {
                if (in_array($pipes[1], $read)) {
                    $chunk = fread($pipes[1], 8192);
                    if ($chunk !== false) {
                        $stdout .= $chunk;
                    }
                }
                if (in_array($pipes[2], $read)) {
                    $chunk = fread($pipes[2], 8192);
                    if ($chunk !== false) {
                        $stderr .= $chunk;
                    }
                }
            }
            
            usleep(100000); // 100ms
        }
        
        fclose($pipes[1]);
        fclose($pipes[2]);
        $returnCode = proc_close($process);
        
        if ($returnCode !== 0) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Mint transaction failed',
                'return_code' => $returnCode,
                'stderr' => $stderr,
                'stdout' => $stdout,
                'command' => $cmdString
            ]);
            return;
        }
        
        // Парсим результат
        $result = json_decode($stdout, true);
        $signature = $result['signature'] ?? null;
        
        if (!$signature) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Transaction signature not found',
                'stdout' => $stdout,
                'stderr' => $stderr
            ]);
            return;
        }
        
        // Успешно!
        echo json_encode([
            'success' => true,
            'message' => 'Tokens minted successfully',
            'to_wallet' => $toWallet,
            'amount' => $amount,
            'signature' => $signature,
            'explorer_url' => 'https://explorer.solana.com/tx/' . $signature . '?cluster=devnet'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Отправка токенов с конкретного кошелька
 * POST /api/tama/send
 * Body: { from_wallet: 'address', from_keypair_file: 'p2e-pool-keypair.json', to_wallet: 'address', amount: 1000000 }
 */
function handleSend($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $fromWallet = $input['from_wallet'] ?? null;
    $fromKeypairFile = $input['from_keypair_file'] ?? null;
    $toWallet = $input['to_wallet'] ?? null;
    $amount = $input['amount'] ?? null;
    
    if (!$fromWallet || !$fromKeypairFile || !$toWallet || !$amount) {
        http_response_code(400);
        echo json_encode(['error' => 'from_wallet, from_keypair_file, to_wallet, and amount are required']);
        return;
    }
    
    if ($amount < 1) {
        http_response_code(400);
        echo json_encode(['error' => 'Amount must be at least 1 TAMA']);
        return;
    }
    
    try {
        // РЕАЛЬНАЯ ТРАНЗАКЦИЯ В SOLANA через spl-token CLI
        $tamaMint = getenv('TAMA_MINT_ADDRESS') ?: TAMA_MINT_ADDRESS;
        $rpcUrl = getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com';
        $payerKeypair = getenv('SOLANA_PAYER_KEYPAIR_PATH') ?: __DIR__ . '/../payer-keypair.json';
        
        // Путь к keypair файлу отправителя
        $fromKeypairPath = __DIR__ . '/../' . $fromKeypairFile;
        
        if (!$tamaMint) {
            http_response_code(500);
            echo json_encode(['error' => 'TAMA_MINT_ADDRESS not configured']);
            return;
        }
        
        if (!file_exists($fromKeypairPath)) {
            http_response_code(500);
            echo json_encode([
                'error' => 'From keypair not found',
                'path' => $fromKeypairPath,
                'file' => $fromKeypairFile
            ]);
            return;
        }
        
        if (!file_exists($payerKeypair)) {
            http_response_code(500);
            echo json_encode(['error' => 'Payer keypair not found: ' . $payerKeypair]);
            return;
        }
        
        // Проверить, установлен ли spl-token
        $solanaCheck = shell_exec('solana --version 2>&1');
        if (strpos($solanaCheck, 'solana-cli') === false) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Solana CLI not found',
                'details' => 'Please install Solana CLI tools: https://docs.solana.com/cli/install-solana-cli-tools'
            ]);
            return;
        }
        
        // Выполнить spl-token transfer от from_wallet к to_wallet
        // Используем from_keypair как owner (у него должны быть токены)
        // Используем payer keypair как fee-payer (для оплаты комиссии)
        $cmd = [
            'spl-token',
            'transfer',
            $tamaMint,
            (string)$amount,  // Amount - spl-token сам конвертирует с учетом decimals (9)
            $toWallet,
            '--fund-recipient',  // Create ATA if needed
            '--allow-unfunded-recipient',  // Allow sending to unfunded addresses (no SOL needed)
            '--fee-payer', $payerKeypair,  // Кто платит за транзакцию
            '--owner', $fromKeypairPath,  // Owner - кошелек отправителя (у него должны быть токены)
            '--url', $rpcUrl,
            '--output', 'json'
        ];
        
        $descriptorspec = [
            0 => ['pipe', 'r'],  // stdin
            1 => ['pipe', 'w'],  // stdout
            2 => ['pipe', 'w']   // stderr
        ];
        
        // Форматируем команду для Windows
        $cmdString = '';
        foreach ($cmd as $arg) {
            if (strpos($arg, ' ') !== false || strpos($arg, '--') === 0 || strpos($arg, '.json') !== false) {
                $cmdString .= escapeshellarg($arg) . ' ';
            } else {
                $cmdString .= $arg . ' ';
            }
        }
        $cmdString = trim($cmdString);
        
        // Увеличиваем время выполнения
        set_time_limit(120);
        
        $process = proc_open($cmdString, $descriptorspec, $pipes);
        
        if (!is_resource($process)) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Failed to start spl-token process',
                'command' => $cmdString
            ]);
            return;
        }
        
        fclose($pipes[0]);
        
        // Читаем вывод с таймаутом
        $stdout = '';
        $stderr = '';
        $startTime = time();
        $timeout = 90;
        
        while (true) {
            $status = proc_get_status($process);
            
            if ($status === false) {
                break;
            }
            
            if ($status['running'] === false) {
                // Процесс завершился, читаем оставшиеся данные
                $stdout .= stream_get_contents($pipes[1]);
                $stderr .= stream_get_contents($pipes[2]);
                break;
            }
            
            // Проверяем таймаут
            if (time() - $startTime > $timeout) {
                proc_terminate($process);
                proc_close($process);
                http_response_code(500);
                echo json_encode([
                    'error' => 'Transaction timeout',
                    'timeout' => $timeout
                ]);
                return;
            }
            
            // Неблокирующее чтение
            $read = [$pipes[1], $pipes[2]];
            $write = null;
            $except = null;
            
            if (stream_select($read, $write, $except, 0, 200000) > 0) {
                if (in_array($pipes[1], $read)) {
                    $chunk = fread($pipes[1], 8192);
                    if ($chunk !== false) {
                        $stdout .= $chunk;
                    }
                }
                if (in_array($pipes[2], $read)) {
                    $chunk = fread($pipes[2], 8192);
                    if ($chunk !== false) {
                        $stderr .= $chunk;
                    }
                }
            }
            
            usleep(100000); // 100ms
        }
        
        fclose($pipes[1]);
        fclose($pipes[2]);
        $returnCode = proc_close($process);
        
        if ($returnCode !== 0) {
            http_response_code(500);
            
            // Парсим более детальную информацию об ошибке
            $errorMessage = 'Send transaction failed';
            if (strpos($stderr, 'InsufficientFunds') !== false) {
                $errorMessage = 'Insufficient funds in source wallet';
            } elseif (strpos($stderr, 'AccountNotFound') !== false) {
                $errorMessage = 'Token account not found. The source wallet may not have TAMA tokens.';
            } elseif (strpos($stderr, 'Insufficient') !== false) {
                $errorMessage = 'Insufficient balance in source wallet';
            }
            
            echo json_encode([
                'error' => $errorMessage,
                'return_code' => $returnCode,
                'stderr' => trim($stderr),
                'stdout' => trim($stdout),
                'command' => $cmdString,
                'from_wallet' => $fromWallet,
                'from_keypair_file' => $fromKeypairFile,
                'from_keypair_path' => $fromKeypairPath
            ]);
            return;
        }
        
        // Парсим результат
        $result = json_decode($stdout, true);
        $signature = $result['signature'] ?? null;
        
        if (!$signature) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Transaction signature not found',
                'stdout' => $stdout,
                'stderr' => $stderr
            ]);
            return;
        }
        
        // Успешно!
        echo json_encode([
            'success' => true,
            'message' => 'Tokens sent successfully',
            'from_wallet' => $fromWallet,
            'to_wallet' => $toWallet,
            'amount' => $amount,
            'signature' => $signature,
            'explorer_url' => 'https://explorer.solana.com/tx/' . $signature . '?cluster=devnet'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Отправить SOL с кошелька на другой адрес
 * Использует solana transfer CLI
 */
function handleSendSol($url, $key) {
    error_log("🚀 handleSendSol() called");
    $input = json_decode(file_get_contents('php://input'), true);
    error_log("📦 handleSendSol() input: " . json_encode($input));
    
    $fromWallet = $input['from_wallet'] ?? null;
    $fromKeypairFile = $input['from_keypair_file'] ?? null;
    $toWallet = $input['to_wallet'] ?? null;
    $amount = $input['amount'] ?? null; // Amount in SOL (not lamports)
    
    if (!$fromWallet || !$fromKeypairFile || !$toWallet || !$amount) {
        http_response_code(400);
        echo json_encode(['error' => 'from_wallet, from_keypair_file, to_wallet, and amount are required']);
        return;
    }
    
    if ($amount < 0.0001) {
        http_response_code(400);
        echo json_encode(['error' => 'Amount must be at least 0.0001 SOL']);
        return;
    }
    
    try {
        $rpcUrl = getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com';
        
        // На Render.com keypairs хранятся в environment variables, не в файлах
        // load_keypairs.php уже создал файлы из env vars, проверим их сначала
        
        // Маппинг keypair файлов к environment variables и путям
        $keypairPaths = [
            'payer-keypair.json' => [
                'env' => 'SOLANA_PAYER_KEYPAIR',
                'load_keypairs_path' => '/app/payer-keypair.json',
                'local_path' => __DIR__ . '/../payer-keypair.json'
            ],
            'p2e-pool-keypair.json' => [
                'env' => 'SOLANA_P2E_POOL_KEYPAIR',
                'load_keypairs_path' => '/app/p2e-pool-keypair.json',
                'local_path' => __DIR__ . '/../p2e-pool-keypair.json'
            ],
            'team-wallet-keypair.json' => [
                'env' => 'SOLANA_TEAM_KEYPAIR',
                'load_keypairs_path' => '/app/team-wallet-keypair.json',
                'local_path' => __DIR__ . '/../team-wallet-keypair.json'
            ],
            'marketing-wallet-keypair.json' => [
                'env' => 'SOLANA_MARKETING_KEYPAIR',
                'load_keypairs_path' => '/app/marketing-wallet-keypair.json',
                'local_path' => __DIR__ . '/../marketing-wallet-keypair.json'
            ],
            'liquidity-pool-keypair.json' => [
                'env' => 'SOLANA_LIQUIDITY_KEYPAIR',
                'load_keypairs_path' => '/app/liquidity-pool-keypair.json',
                'local_path' => __DIR__ . '/../liquidity-pool-keypair.json'
            ],
            'treasury-main-v2-keypair.json' => [
                'env' => 'SOLANA_TREASURY_MAIN_KEYPAIR',
                'load_keypairs_path' => '/app/treasury-main-v2-keypair.json',
                'local_path' => __DIR__ . '/../treasury-main-v2-keypair.json'
            ],
            'treasury-liquidity-v2-keypair.json' => [
                'env' => 'SOLANA_TREASURY_LIQUIDITY_KEYPAIR',
                'load_keypairs_path' => '/app/treasury-liquidity-v2-keypair.json',
                'local_path' => __DIR__ . '/../treasury-liquidity-v2-keypair.json'
            ],
            'treasury-team-v2-keypair.json' => [
                'env' => 'SOLANA_TREASURY_TEAM_KEYPAIR',
                'load_keypairs_path' => '/app/treasury-team-v2-keypair.json',
                'local_path' => __DIR__ . '/../treasury-team-v2-keypair.json'
            ]
        ];
        
        $keypairInfo = $keypairPaths[$fromKeypairFile] ?? null;
        $fromKeypairPath = null;
        
        if ($keypairInfo) {
            // 1. Проверить файл, созданный load_keypairs.php (для Railway/Render)
            if (file_exists($keypairInfo['load_keypairs_path'])) {
                $fromKeypairPath = $keypairInfo['load_keypairs_path'];
                error_log("✅ Found keypair file from load_keypairs.php: " . $fromKeypairPath);
            }
            // 2. Проверить локальный файл
            elseif (file_exists($keypairInfo['local_path'])) {
                $fromKeypairPath = $keypairInfo['local_path'];
                error_log("✅ Found local keypair file: " . $fromKeypairPath);
            }
            // 3. Попробовать создать из env var (если load_keypairs.php еще не отработал)
            else {
                $envVar = $keypairInfo['env'];
                $keypairJson = getenv($envVar) ?: ($_ENV[$envVar] ?? null);
                if ($keypairJson) {
                    error_log("✅ Found keypair in environment variable: $envVar");
                    // Проверить формат - должен быть JSON массив для solana CLI
                    if (strpos($keypairJson, '[') === 0 && json_decode($keypairJson) !== null) {
                        // Это JSON массив - создать временный файл
                        $tempDir = sys_get_temp_dir();
                        $fromKeypairPath = $tempDir . '/' . $fromKeypairFile;
                        file_put_contents($fromKeypairPath, $keypairJson);
                        chmod($fromKeypairPath, 0400); // Read-only for security
                        error_log("✅ Created temporary keypair file from env var: " . $fromKeypairPath);
                    } else {
                        // Это base58 или другой формат - solana CLI требует JSON массив
                        error_log("⚠️ Keypair in env var is not JSON array format (base58?), cannot use for solana CLI");
                        http_response_code(500);
                        echo json_encode([
                            'error' => 'Keypair format not supported for SOL transfer',
                            'details' => 'SOL transfer requires JSON array format. The keypair in ' . $envVar . ' appears to be base58 format. Please convert to JSON array format or use a keypair file.',
                            'env_var' => $envVar,
                            'file' => $fromKeypairFile,
                            'hint' => 'For Node.js (base58): Use SOLANA_PAYER_KEYPAIR with base58. For PHP/solana CLI (JSON array): Use keypair file or JSON array in env var.'
                        ]);
                        return;
                    }
                }
            }
        }
        
        // 4. Fallback: проверить стандартный путь
        if (!$fromKeypairPath || !file_exists($fromKeypairPath)) {
            $fromKeypairPath = __DIR__ . '/../' . $fromKeypairFile;
        }
        
        if (!file_exists($fromKeypairPath)) {
            http_response_code(500);
            $envVar = $keypairInfo['env'] ?? 'N/A';
            error_log("❌ Keypair not found: file=$fromKeypairFile, tried paths: " . json_encode([
                'load_keypairs' => $keypairInfo['load_keypairs_path'] ?? 'N/A',
                'local' => $keypairInfo['local_path'] ?? 'N/A',
                'fallback' => $fromKeypairPath,
                'env_var' => $envVar
            ]));
            echo json_encode([
                'error' => 'From keypair not found',
                'file' => $fromKeypairFile,
                'env_var' => $envVar,
                'hint' => 'On Render.com, keypairs are stored in environment variables. Please set ' . $envVar . ' environment variable with JSON array format (not base58).'
            ]);
            return;
        }
        
        // Проверить, установлен ли solana CLI
        $solanaCheck = shell_exec('solana --version 2>&1');
        if (strpos($solanaCheck, 'solana-cli') === false) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Solana CLI not found',
                'details' => 'Please install Solana CLI tools: https://docs.solana.com/cli/install-solana-cli-tools'
            ]);
            return;
        }
        
        // Выполнить solana transfer
        // solana transfer принимает amount в SOL (автоматически конвертирует в lamports)
        $cmd = [
            'solana',
            'transfer',
            $toWallet,
            (string)$amount,  // Amount in SOL
            '--from', $fromKeypairPath,
            '--url', $rpcUrl,
            '--output', 'json',
            '--fee-payer', $fromKeypairPath  // Fee payer is the same as sender
        ];
        
        $descriptorspec = [
            0 => ['pipe', 'r'],  // stdin
            1 => ['pipe', 'w'],  // stdout
            2 => ['pipe', 'w']   // stderr
        ];
        
        // Форматируем команду для Windows
        $cmdString = '';
        foreach ($cmd as $arg) {
            if (strpos($arg, ' ') !== false || strpos($arg, '--') === 0 || strpos($arg, '.json') !== false) {
                $cmdString .= escapeshellarg($arg) . ' ';
            } else {
                $cmdString .= $arg . ' ';
            }
        }
        $cmdString = trim($cmdString);
        
        // Увеличиваем время выполнения
        set_time_limit(120);
        
        $process = proc_open($cmdString, $descriptorspec, $pipes);
        
        if (!is_resource($process)) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Failed to start solana transfer process',
                'command' => $cmdString
            ]);
            return;
        }
        
        fclose($pipes[0]);
        
        // Читаем вывод с таймаутом
        $stdout = '';
        $stderr = '';
        $startTime = time();
        $timeout = 90;
        
        while (true) {
            $status = proc_get_status($process);
            
            if ($status === false) {
                break;
            }
            
            if ($status['running'] === false) {
                // Процесс завершился, читаем оставшиеся данные
                $stdout .= stream_get_contents($pipes[1]);
                $stderr .= stream_get_contents($pipes[2]);
                break;
            }
            
            // Проверяем таймаут
            if (time() - $startTime > $timeout) {
                proc_terminate($process);
                proc_close($process);
                http_response_code(500);
                echo json_encode([
                    'error' => 'Transaction timeout',
                    'timeout' => $timeout
                ]);
                return;
            }
            
            // Неблокирующее чтение
            $read = [$pipes[1], $pipes[2]];
            $write = null;
            $except = null;
            $changed = stream_select($read, $write, $except, 1);
            
            if ($changed > 0) {
                foreach ($read as $stream) {
                    if ($stream === $pipes[1]) {
                        $stdout .= stream_get_contents($stream);
                    } elseif ($stream === $pipes[2]) {
                        $stderr .= stream_get_contents($stream);
                    }
                }
            }
            
            usleep(100000); // 100ms
        }
        
        fclose($pipes[1]);
        fclose($pipes[2]);
        $returnCode = proc_close($process);
        
        if ($returnCode !== 0) {
            http_response_code(500);
            
            // Парсим более детальную информацию об ошибке
            $errorMessage = 'SOL transfer failed';
            if (strpos($stderr, 'InsufficientFunds') !== false || strpos($stderr, 'insufficient') !== false) {
                $errorMessage = 'Insufficient SOL balance in source wallet';
            } elseif (strpos($stderr, 'AccountNotFound') !== false) {
                $errorMessage = 'Source wallet account not found';
            } elseif (strpos($stderr, 'Invalid') !== false) {
                $errorMessage = 'Invalid wallet address';
            }
            
            echo json_encode([
                'error' => $errorMessage,
                'return_code' => $returnCode,
                'stderr' => trim($stderr),
                'stdout' => trim($stdout),
                'command' => $cmdString,
                'from_wallet' => $fromWallet,
                'from_keypair_file' => $fromKeypairFile,
                'from_keypair_path' => $fromKeypairPath
            ]);
            return;
        }
        
        // Парсим результат
        $result = json_decode($stdout, true);
        $signature = $result['signature'] ?? null;
        
        if (!$signature) {
            // Попробуем извлечь signature из текстового вывода
            if (preg_match('/Signature:\s*([A-Za-z0-9]{64,128})/', $stdout, $matches)) {
                $signature = $matches[1];
            } else {
                http_response_code(500);
                echo json_encode([
                    'error' => 'Transaction signature not found',
                    'stdout' => $stdout,
                    'stderr' => $stderr
                ]);
                return;
            }
        }
        
        // Успешно!
        echo json_encode([
            'success' => true,
            'message' => 'SOL sent successfully',
            'from_wallet' => $fromWallet,
            'to_wallet' => $toWallet,
            'amount' => $amount,
            'amount_lamports' => $amount * 1e9,
            'signature' => $signature,
            'explorer_url' => 'https://explorer.solana.com/tx/' . $signature . '?cluster=devnet'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Получить список всех держателей TAMA токенов
 * Использует Solana RPC getProgramAccounts для получения всех token accounts
 */
function handleGetHolders($url, $key) {
    $tamaMint = getenv('TAMA_MINT_ADDRESS') ?: TAMA_MINT_ADDRESS;
    $rpcUrl = getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com';
    
    try {
        // Используем getTokenLargestAccounts для получения топ держателей
        // Этот метод работает на публичных RPC и не требует getProgramAccounts
        $rpcRequest = [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'getTokenLargestAccounts',
            'params' => [
                $tamaMint
            ]
        ];
        
        // Отправляем запрос к Solana RPC
        $ch = curl_init($rpcUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($rpcRequest));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        
        if ($curlError) {
            throw new Exception('RPC request failed: ' . $curlError);
        }
        
        if ($httpCode !== 200) {
            throw new Exception('RPC returned HTTP ' . $httpCode);
        }
        
        $rpcData = json_decode($response, true);
        
        if (isset($rpcData['error'])) {
            throw new Exception('RPC error: ' . $rpcData['error']['message']);
        }
        
        if (!isset($rpcData['result']['value']) || !is_array($rpcData['result']['value'])) {
            throw new Exception('Invalid RPC response');
        }
        
        // Парсим результаты
        $holders = [];
        foreach ($rpcData['result']['value'] as $account) {
            $tokenAccountPubkey = $account['address'];
            $amountRaw = $account['amount'];
            
            // Конвертируем из lamports (9 decimals)
            $amountTama = $amountRaw / pow(10, TAMA_DECIMALS);
            
            // Пропускаем нулевые балансы
            if ($amountTama > 0) {
                // Получаем owner address через RPC getAccountInfo
                $ownerAddress = getTokenAccountOwner($tokenAccountPubkey, $rpcUrl);
                
                // Если не удалось получить через RPC, используем token account как fallback
                if ($ownerAddress === 'Unknown') {
                    $ownerAddress = $tokenAccountPubkey; // Временное решение
                }
                
                $holders[] = [
                    'address' => $ownerAddress,
                    'token_account' => $tokenAccountPubkey,
                    'balance' => $amountTama,
                    'balance_raw' => $amountRaw
                ];
            }
        }
        
        // Сортируем по балансу (от большего к меньшему)
        usort($holders, function($a, $b) {
            return $b['balance'] <=> $a['balance'];
        });
        
        // Подсчитываем статистику
        $totalHolders = count($holders);
        $totalBalance = array_sum(array_column($holders, 'balance'));
        
        echo json_encode([
            'success' => true,
            'holders' => $holders,
            'total_holders' => $totalHolders,
            'total_balance' => $totalBalance,
            'mint_address' => $tamaMint
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => $e->getMessage(),
            'details' => 'Failed to fetch token holders from Solana RPC'
        ]);
    }
}

/**
 * Получить mint address token account через RPC
 */
function getTokenAccountMint($tokenAccount, $rpcUrl) {
    try {
        $rpcRequest = [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'getAccountInfo',
            'params' => [
                $tokenAccount,
                ['encoding' => 'jsonParsed']
            ]
        ];
        
        $ch = curl_init($rpcUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($rpcRequest));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $rpcData = json_decode($response, true);
        
        if (isset($rpcData['result']['value']['data']['parsed']['info']['mint'])) {
            return $rpcData['result']['value']['data']['parsed']['info']['mint'];
        }
        
        return null;
    } catch (Exception $e) {
        return null;
    }
}

/**
 * Получить owner address token account через RPC
 */
function getTokenAccountOwner($tokenAccount, $rpcUrl) {
    try {
        // Используем jsonParsed encoding для более простого парсинга
        $rpcRequest = [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'getAccountInfo',
            'params' => [
                $tokenAccount,
                ['encoding' => 'jsonParsed']
            ]
        ];
        
        $ch = curl_init($rpcUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($rpcRequest));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $rpcData = json_decode($response, true);
        
        // Парсим owner address из jsonParsed ответа
        if (isset($rpcData['result']['value']['data']['parsed']['info']['owner'])) {
            return $rpcData['result']['value']['data']['parsed']['info']['owner'];
        }
        
        // Fallback: используем base64 encoding
        $rpcRequest2 = [
            'jsonrpc' => '2.0',
            'id' => 2,
            'method' => 'getAccountInfo',
            'params' => [
                $tokenAccount,
                ['encoding' => 'base64']
            ]
        ];
        
        $ch2 = curl_init($rpcUrl);
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch2, CURLOPT_POST, true);
        curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode($rpcRequest2));
        curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch2, CURLOPT_TIMEOUT, 5);
        
        $response2 = curl_exec($ch2);
        curl_close($ch2);
        
        $rpcData2 = json_decode($response2, true);
        
        if (isset($rpcData2['result']['value']['data'][0])) {
            $decodedData = base64_decode($rpcData2['result']['value']['data'][0]);
            
            // Owner находится по offset 32 (32 bytes)
            if (strlen($decodedData) >= 64) {
                $ownerBytes = substr($decodedData, 32, 32);
                // Конвертируем в base58
                return bytesToBase58($ownerBytes);
            }
        }
        
        return 'Unknown';
    } catch (Exception $e) {
        return 'Unknown';
    }
}

/**
 * Получить mint address bytes через RPC getAccountInfo
 * Используем RPC для получения account info и извлечения pubkey bytes
 */
function getMintAddressBytes($mintAddress, $rpcUrl) {
    try {
        // Получаем account info для mint address
        $rpcRequest = [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'getAccountInfo',
            'params' => [
                $mintAddress,
                ['encoding' => 'jsonParsed']
            ]
        ];
        
        $ch = curl_init($rpcUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($rpcRequest));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $rpcData = json_decode($response, true);
        
        // Если account существует, используем его pubkey
        // Но нам нужны raw bytes для сравнения
        // Используем другой подход - получаем через base64 encoding
        
        // Альтернативный подход: используем getAccountInfo с base64 encoding
        $rpcRequest2 = [
            'jsonrpc' => '2.0',
            'id' => 2,
            'method' => 'getAccountInfo',
            'params' => [
                $mintAddress,
                ['encoding' => 'base64']
            ]
        ];
        
        $ch2 = curl_init($rpcUrl);
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch2, CURLOPT_POST, true);
        curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode($rpcRequest2));
        curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch2, CURLOPT_TIMEOUT, 10);
        
        $response2 = curl_exec($ch2);
        curl_close($ch2);
        
        // На самом деле, нам не нужны bytes mint address для сравнения
        // Мы можем сравнивать напрямую через base58 строку или использовать другой метод
        // Для простоты, вернем null и будем сравнивать через другой способ
        
        // Используем упрощенный подход: сравниваем через owner address или используем другой метод фильтрации
        return null; // Вернем null, фильтрация будет через другой способ
    } catch (Exception $e) {
        return null;
    }
}

/**
 * Конвертировать bytes в base58 адрес
 * Упрощенная версия base58 encoding
 */
function bytesToBase58($data) {
    $alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    $base = strlen($alphabet);
    
    // Конвертируем bytes в big integer
    $num = '0';
    for ($i = 0; $i < strlen($data); $i++) {
        $num = bcmul($num, '256');
        $num = bcadd($num, (string)ord($data[$i]));
    }
    
    // Конвертируем в base58
    $result = '';
    while (bccomp($num, '0') > 0) {
        $remainder = bcmod($num, (string)$base);
        $num = bcdiv($num, (string)$base, 0);
        $result = $alphabet[(int)$remainder] . $result;
    }
    
    // Добавляем ведущие нули
    for ($i = 0; $i < strlen($data) && $data[$i] === "\0"; $i++) {
        $result = $alphabet[0] . $result;
    }
    
    return $result;
}

/**
 * Получить фактическое распределение токенов по пулам проекта
 */
function handleGetPools($url, $key) {
    $tamaMint = getenv('TAMA_MINT_ADDRESS') ?: TAMA_MINT_ADDRESS;
    $rpcUrl = getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com';
    
    // Конфигурация пулов проекта
    $pools = [
        [
            'name' => 'P2E Pool',
            'address' => 'HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw',
            'planned' => 400000000,
            'percentage' => 40,
            'status' => 'active',
            'description' => 'Play-to-Earn rewards pool'
        ],
        [
            'name' => 'Team',
            'address' => 'AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR',
            'planned' => 200000000,
            'percentage' => 20,
            'status' => 'locked',
            'description' => 'Team allocation (vesting 4 years)'
        ],
        [
            'name' => 'Marketing',
            'address' => '2eryce7DH7mqDCPegTb696FjXReA5qmx9xfCKH5UneeF',
            'planned' => 150000000,
            'percentage' => 15,
            'status' => 'active',
            'description' => 'Marketing & partnerships'
        ],
        [
            'name' => 'Liquidity',
            'address' => '5kHACukYuErqSzURPTtexS7CXdqv9eJ9eNvydDz3o36z',
            'planned' => 100000000,
            'percentage' => 10,
            'status' => 'locked',
            'description' => 'DEX liquidity (Raydium, Jupiter)'
        ],
        [
            'name' => 'Community',
            'address' => '9X1DYKzHiYP4V2UuVNGbU42DQkd8ST1nPwbJDuFQY3T',
            'planned' => 100000000,
            'percentage' => 10,
            'status' => 'active',
            'description' => 'Community rewards & airdrops'
        ],
        [
            'name' => 'Reserve',
            'address' => '8cDHbeHcuspjGKXofYzApCCBrAVenSHPy2UAPU1iCEj6',
            'planned' => 50000000,
            'percentage' => 5,
            'status' => 'locked',
            'description' => 'Reserve fund (emergency)'
        ],
        [
            'name' => 'Payer',
            'address' => '8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi',
            'planned' => 0,
            'percentage' => 0,
            'status' => 'active',
            'description' => 'Mint Authority & Transaction Payer'
        ]
    ];
    
    try {
        // Получаем балансы для всех пулов
        $poolsData = [];
        $totalActual = 0;
        
        foreach ($pools as $pool) {
            $balance = getTokenBalance($pool['address'], $tamaMint, $rpcUrl);
            $balanceTama = $balance / pow(10, TAMA_DECIMALS);
            $totalActual += $balanceTama;
            
            $poolsData[] = [
                'name' => $pool['name'],
                'address' => $pool['address'],
                'planned' => $pool['planned'],
                'actual' => $balanceTama,
                'difference' => $balanceTama - $pool['planned'],
                'percentage_planned' => $pool['percentage'],
                'percentage_actual' => 0, // Будет рассчитано после
                'status' => $pool['status'],
                'description' => $pool['description']
            ];
        }
        
        // Рассчитываем процент от общего фактического баланса
        $totalSupply = 1000000000; // 1B TAMA
        foreach ($poolsData as &$pool) {
            $pool['percentage_actual'] = $totalSupply > 0 ? ($pool['actual'] / $totalSupply) * 100 : 0;
        }
        
        // Сортируем по фактическому балансу (от большего к меньшему)
        usort($poolsData, function($a, $b) {
            return $b['actual'] <=> $a['actual'];
        });
        
        echo json_encode([
            'success' => true,
            'pools' => $poolsData,
            'total_planned' => 1000000000,
            'total_actual' => $totalActual,
            'total_supply' => $totalSupply,
            'mint_address' => $tamaMint
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => $e->getMessage(),
            'details' => 'Failed to fetch pool balances'
        ]);
    }
}

/**
 * Получить баланс TAMA токенов для адреса
 */
function getTokenBalance($walletAddress, $mintAddress, $rpcUrl) {
    try {
        // Используем getTokenAccountsByOwner для получения token accounts
        $rpcRequest = [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'getTokenAccountsByOwner',
            'params' => [
                $walletAddress,
                [
                    'mint' => $mintAddress
                ],
                [
                    'encoding' => 'jsonParsed'
                ]
            ]
        ];
        
        $ch = curl_init($rpcUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($rpcRequest));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $rpcData = json_decode($response, true);
        
        if (isset($rpcData['result']['value']) && is_array($rpcData['result']['value']) && count($rpcData['result']['value']) > 0) {
            // Получаем баланс из первого token account
            $tokenAccount = $rpcData['result']['value'][0];
            if (isset($tokenAccount['account']['data']['parsed']['info']['tokenAmount']['amount'])) {
                return (int)$tokenAccount['account']['data']['parsed']['info']['tokenAmount']['amount'];
            }
        }
        
        return 0;
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * Check Environment Variables
 * Debug endpoint to see what env vars are available
 */
function handleEnvCheck() {
    $envVars = [
        'SOLANA_PAYER_KEYPAIR',
        'SOLANA_P2E_POOL_KEYPAIR',
        'TAMA_MINT_ADDRESS',
        'SOLANA_RPC_URL',
        'SUPABASE_URL',
        'SUPABASE_KEY'
    ];
    
    $results = [];
    
    foreach ($envVars as $var) {
        $value = getenv($var) ?: ($_ENV[$var] ?? null) ?: ($_SERVER[$var] ?? null);
        
        $results[$var] = [
            'found' => $value !== null,
            'method' => getenv($var) ? 'getenv' : ($_ENV[$var] ?? null ? '$_ENV' : ($_SERVER[$var] ?? null ? '$_SERVER' : 'none')),
            'length' => $value ? strlen($value) : 0,
            'preview' => $value ? (substr($value, 0, 50) . '...') : null,
            'is_keypair' => $var === 'SOLANA_PAYER_KEYPAIR' || $var === 'SOLANA_P2E_POOL_KEYPAIR' ? ($value && strpos($value, '[') === 0) : null
        ];
    }
    
    // Also check all env vars that start with SOLANA_
    $allSolanaVars = [];
    foreach ($_SERVER as $key => $value) {
        if (strpos($key, 'SOLANA_') === 0) {
            $allSolanaVars[$key] = [
                'length' => strlen($value),
                'preview' => substr($value, 0, 50) . '...'
            ];
        }
    }
    
    echo json_encode([
        'env_vars' => $results,
        'all_solana_vars' => $allSolanaVars,
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown'
    ], JSON_PRETTY_PRINT);
}

/**
 * Apply Economy Config
 * POST /api/tama/economy/apply
 * Body: { "config_name": "custom", "settings": { ... } }
 */
function handleEconomyApply($url, $key) {
    try {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data || !isset($data['config_name']) || !isset($data['settings'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid request body. Expected: { "config_name": "...", "settings": { ... } }']);
            return;
        }
        
        $configName = $data['config_name'];
        $settings = $data['settings'];
        
        // Validate settings
        $requiredFields = [
            'BASE_CLICK_REWARD', 'MIN_REWARD', 'MAX_COMBO_BONUS',
            'COMBO_WINDOW', 'COMBO_COOLDOWN', 'COMBO_BONUS_DIVIDER', 'SPAM_PENALTY'
        ];
        
        foreach ($requiredFields as $field) {
            if (!isset($settings[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                return;
            }
        }
        
        // First, deactivate all configs (set is_active=false for all)
        // Supabase PATCH with filter: use is_active=eq.true to find active ones
        try {
            $deactivateParams = ['is_active' => 'eq.true', 'select' => 'id'];
            $activeConfigs = supabaseRequest($url, $key, 'GET', 'economy_config', $deactivateParams);
            
            // Deactivate each active config individually
            if (!empty($activeConfigs['data']) && is_array($activeConfigs['data'])) {
                foreach ($activeConfigs['data'] as $activeConfig) {
                    $id = $activeConfig['id'];
                    $updateParams = ['id' => 'eq.' . $id];
                    supabaseRequest($url, $key, 'PATCH', 'economy_config', $updateParams, ['is_active' => false]);
                }
            }
        } catch (Exception $e) {
            // Log but continue - deactivation is not critical
            error_log('Warning: Failed to deactivate existing configs: ' . $e->getMessage());
        }
        
        // Prepare config data for database
        $configData = [
            'config_name' => $configName,
            'base_click_reward' => floatval($settings['BASE_CLICK_REWARD']),
            'min_reward' => floatval($settings['MIN_REWARD']),
            'max_combo_bonus' => intval($settings['MAX_COMBO_BONUS']),
            'combo_window' => intval($settings['COMBO_WINDOW']),
            'combo_cooldown' => intval($settings['COMBO_COOLDOWN']),
            'combo_bonus_divider' => intval($settings['COMBO_BONUS_DIVIDER']),
            'spam_penalty' => floatval($settings['SPAM_PENALTY']),
            'hp_per_click' => floatval($settings['HP_PER_CLICK'] ?? 0.1),
            'food_per_click' => floatval($settings['FOOD_PER_CLICK'] ?? 0.05),
            'happy_per_click' => floatval($settings['HAPPY_PER_CLICK'] ?? 0.05),
            'is_active' => true,
            'updated_at' => date('Y-m-d\TH:i:s.u\Z')
        ];
        
        // Check if config exists
        $checkParams = [
            'config_name' => 'eq.' . $configName,
            'select' => 'id'
        ];
        
        $checkResult = supabaseRequest($url, $key, 'GET', 'economy_config', $checkParams);
        $exists = !empty($checkResult['data']);
        
        if ($exists) {
            // Update existing config
            $updateParams = ['config_name' => 'eq.' . $configName];
            $result = supabaseRequest($url, $key, 'PATCH', 'economy_config', $updateParams, $configData);
        } else {
            // Insert new config
            $result = supabaseRequest($url, $key, 'POST', 'economy_config', [], $configData);
        }
        
        if ($result['code'] >= 200 && $result['code'] < 300) {
            echo json_encode([
                'success' => true,
                'message' => 'Economy config applied successfully',
                'config_name' => $configName,
                'action' => $exists ? 'updated' : 'created'
            ]);
        } else {
            http_response_code($result['code']);
            echo json_encode([
                'error' => 'Failed to apply economy config',
                'details' => $result['data']
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
    }
}

/**
 * Get Active Economy Config
 * GET /api/tama/economy/active
 */
function handleEconomyActive($url, $key) {
    try {
        $params = [
            'is_active' => 'eq.true',
            'select' => '*'
        ];
        
        $result = supabaseRequest($url, $key, 'GET', 'economy_config', $params);
        
        if ($result['code'] === 200) {
            echo json_encode([
                'success' => true,
                'data' => $result['data']
            ]);
        } else {
            http_response_code($result['code']);
            echo json_encode([
                'error' => 'Failed to fetch active economy config',
                'details' => $result['data']
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
    }
}
?>
