<?php
/**
 * TAMA Token API - Supabase REST API Integration
 * Использует Supabase REST API вместо прямого подключения к PostgreSQL
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Настройки Supabase REST API
$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$supabaseKey = getenv('SUPABASE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';

// Константы TAMA токена
define('TAMA_MINT_ADDRESS', 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY');
define('TAMA_DECIMALS', 9);

// Получить метод и путь
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Убрать /api/tama из пути, если есть
$path = preg_replace('#^/api/tama#', '', $path);

// Если путь пустой, использовать /
if (empty($path) || $path === '') {
    $path = '/';
}

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
        
    case '/test':
        if ($method === 'GET') {
            handleTest($supabaseUrl, $supabaseKey);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
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
    
    $ch = curl_init($apiUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'apikey: ' . $key,
            'Authorization: Bearer ' . $key,
            'Content-Type: application/json',
            'Prefer: return=representation'
        ],
        CURLOPT_CUSTOMREQUEST => $method,
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
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true) ?: []
    ];
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
?>
