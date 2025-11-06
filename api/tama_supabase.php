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
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found', 'path' => $path]);
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

/**
 * Обработка запроса на вывод (withdrawal request)
 */
function handleWithdrawalRequest($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $telegram_id = $input['telegram_id'] ?? null;
    $wallet_address = $input['wallet_address'] ?? null;
    $amount = $input['amount'] ?? null;
    
    if (!$telegram_id || !$wallet_address || !$amount) {
        http_response_code(400);
        echo json_encode(['error' => 'telegram_id, wallet_address, and amount are required']);
        return;
    }
    
    if ($amount < 1000) {
        http_response_code(400);
        echo json_encode(['error' => 'Minimum withdrawal is 1,000 TAMA']);
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
        
        // Calculate fee (5%)
        $fee = (int)($amount * 0.05);
        $amountSent = $amount - $fee;
        $newBalance = $currentBalance - $amount;
        
        // РЕАЛЬНАЯ ТРАНЗАКЦИЯ В SOLANA через spl-token CLI
        $tamaMint = getenv('TAMA_MINT_ADDRESS');
        $rpcUrl = getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com';
        $payerKeypair = getenv('SOLANA_PAYER_KEYPAIR_PATH') ?: __DIR__ . '/../payer-keypair.json';
        $mintKeypair = getenv('SOLANA_MINT_KEYPAIR_PATH') ?: __DIR__ . '/../tama-mint-keypair.json';
        
        // Fallback: если mint keypair не найден, используем payer keypair
        if (!file_exists($mintKeypair)) {
            $mintKeypair = $payerKeypair;
        }
        
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
        
        // Выполнить spl-token transfer
        // Используем mint keypair как owner (для mint authority)
        // Используем payer keypair для оплаты комиссии
        $cmd = [
            'spl-token',
            'transfer',
            $tamaMint,
            (string)$amountSent,  // Amount after fee (в наименьших единицах, spl-token сам конвертирует)
            $wallet_address,
            '--fund-recipient',  // Create ATA if needed
            '--fee-payer', $payerKeypair,
            '--owner', $mintKeypair,  // Owner должен быть mint authority
            '--url', $rpcUrl,
            '--output', 'json'
        ];
        
        // Проверить, установлен ли spl-token
        $splTokenCheck = shell_exec('spl-token --version 2>&1');
        if (strpos($splTokenCheck, 'spl-token') === false && strpos($splTokenCheck, 'error') !== false) {
            http_response_code(500);
            echo json_encode([
                'error' => 'spl-token CLI not found',
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
        
        // Используем правильный формат команды для Windows
        $cmdString = '';
        foreach ($cmd as $arg) {
            if (strpos($arg, ' ') !== false || strpos($arg, '--') === 0) {
                $cmdString .= escapeshellarg($arg) . ' ';
            } else {
                $cmdString .= $arg . ' ';
            }
        }
        $cmdString = trim($cmdString);
        
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
        $stdout = stream_get_contents($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);
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
        supabaseRequest($url, $key, 'PATCH', 'leaderboard', [
            'telegram_id' => 'eq.' . $telegram_id
        ], [
            'tama' => $newBalance,
            'total_withdrawn' => ($getResult['data'][0]['total_withdrawn'] ?? 0) + $amount
        ]);
        
        // Сохранить withdrawal в таблицу (если есть tama_economy или withdrawals)
        try {
            supabaseRequest($url, $key, 'POST', 'tama_economy', [], [
                'telegram_id' => $telegram_id,
                'transaction_type' => 'withdrawal',
                'amount' => -$amount, // Negative for withdrawal
                'fee' => $fee,
                'signature' => $txSignature,
                'wallet_address' => $wallet_address,
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
?>
