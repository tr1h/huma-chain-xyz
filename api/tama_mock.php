<?php
/**
 * TAMA Token API - Mock Version
 * Тестовая версия без подключения к базе данных
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

// Константы TAMA токена
define('TAMA_MINT_ADDRESS', 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY');
define('TAMA_DECIMALS', 9);

// Получить метод и путь
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api/tama', '', $path);

// Маршрутизация
switch ($path) {
    case '/balance':
        if ($method === 'GET') {
            handleGetBalance();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/add':
        if ($method === 'POST') {
            handleAddTama();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/spend':
        if ($method === 'POST') {
            handleSpendTama();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/stats':
        if ($method === 'GET') {
            handleGetStats();
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
 * Получить баланс пользователя (MOCK)
 */
function handleGetBalance() {
    $telegram_id = $_GET['telegram_id'] ?? null;
    
    if (!$telegram_id) {
        http_response_code(400);
        echo json_encode(['error' => 'telegram_id is required']);
        return;
    }
    
    // Мок данные
    $balance = [
        'database_tama' => 1000,
        'blockchain_tama' => 0,
        'total_tama' => 1000
    ];
    
    echo json_encode([
        'success' => true,
        'telegram_id' => $telegram_id,
        'database_tama' => $balance['database_tama'],
        'blockchain_tama' => $balance['blockchain_tama'],
        'total_tama' => $balance['total_tama'],
        'note' => 'This is mock data - database not connected'
    ]);
}

/**
 * Добавить TAMA пользователю (MOCK)
 */
function handleAddTama() {
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
    
    // Мок ответ
    echo json_encode([
        'success' => true,
        'message' => "Added {$amount} TAMA (MOCK)",
        'new_balance' => 1000 + $amount,
        'note' => 'This is mock data - database not connected'
    ]);
}

/**
 * Потратить TAMA (MOCK)
 */
function handleSpendTama() {
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
    
    // Мок проверка баланса
    if ($amount > 1000) {
        http_response_code(400);
        echo json_encode(['error' => 'Insufficient TAMA balance (MOCK)']);
        return;
    }
    
    // Мок ответ
    echo json_encode([
        'success' => true,
        'message' => "Spent {$amount} TAMA (MOCK)",
        'new_balance' => 1000 - $amount,
        'note' => 'This is mock data - database not connected'
    ]);
}

/**
 * Получить статистику (MOCK)
 */
function handleGetStats() {
    // Мок статистика
    $stats = [
        'total_users' => 1,
        'total_database_tama' => 1000,
        'total_blockchain_tama' => 0,
        'total_nfts' => 0
    ];
    
    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'note' => 'This is mock data - database not connected'
    ]);
}
?>




