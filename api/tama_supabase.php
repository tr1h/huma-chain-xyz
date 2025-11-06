<?php
/**
 * TAMA Token API - Supabase Integration
 * Работает с твоей Supabase базой данных
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

// Настройки подключения к Supabase (через переменные окружения)
$host = getenv('SUPABASE_DB_HOST') ?: 'db.zfrazyupameidxpjihrh.supabase.co';
$port = getenv('SUPABASE_DB_PORT') ?: '5432';
$dbname = getenv('SUPABASE_DB_NAME') ?: 'postgres';
$user = getenv('SUPABASE_DB_USER') ?: 'postgres';
$password = getenv('SUPABASE_DB_PASSWORD') ?: '';

// Попытка подключения с обработкой ошибок
try {
    // Используем IPv4 если возможно, иначе хост
    $connectionString = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($connectionString, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5,
        PDO::ATTR_PERSISTENT => false
    ]);
} catch (PDOException $e) {
    // Если не удалось подключиться, пробуем через IPv4
    if (strpos($e->getMessage(), 'could not translate host name') !== false) {
        // Пробуем получить IPv4 адрес
        $ipv4 = gethostbyname($host);
        if ($ipv4 !== $host && filter_var($ipv4, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            try {
                $connectionString = "pgsql:host=$ipv4;port=$port;dbname=$dbname";
                $pdo = new PDO($connectionString, $user, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_TIMEOUT => 5
                ]);
            } catch (PDOException $e2) {
                http_response_code(500);
                echo json_encode(['error' => 'Database connection failed: ' . $e2->getMessage()]);
                exit();
            }
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
            exit();
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
        exit();
    }
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
            handleGetBalance($pdo);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/add':
        if ($method === 'POST') {
            handleAddTama($pdo);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/spend':
        if ($method === 'POST') {
            handleSpendTama($pdo);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/mint-nft':
        if ($method === 'POST') {
            handleMintNFT($pdo);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/stats':
        if ($method === 'GET') {
            handleGetStats($pdo);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/leaderboard':
        if ($method === 'GET') {
            handleGetLeaderboard($pdo);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/test':
        if ($method === 'GET') {
            handleTest($pdo);
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
 * Тест подключения к базе данных
 */
function handleTest($pdo) {
    try {
        // Проверить подключение
        $stmt = $pdo->query("SELECT NOW() as current_time");
        $time = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Проверить таблицы
        $stmt = $pdo->query("
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        ");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        // Проверить данные в leaderboard
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM leaderboard");
        $leaderboard_count = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Database connection successful',
            'current_time' => $time['current_time'],
            'tables' => $tables,
            'leaderboard_records' => (int)$leaderboard_count['count']
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
function handleGetBalance($pdo) {
    $telegram_id = $_GET['telegram_id'] ?? null;
    
    if (!$telegram_id) {
        http_response_code(400);
        echo json_encode(['error' => 'telegram_id is required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM get_tama_balance(?)");
        $stmt->execute([$telegram_id]);
        $balance = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$balance) {
            $balance = [
                'database_tama' => 0,
                'blockchain_tama' => 0,
                'total_tama' => 0,
                'pet_name' => null,
                'pet_type' => null,
                'level' => 1,
                'xp' => 0
            ];
        }
        
        echo json_encode([
            'success' => true,
            'telegram_id' => $telegram_id,
            'database_tama' => (int)$balance['database_tama'],
            'blockchain_tama' => (int)$balance['blockchain_tama'],
            'total_tama' => (int)$balance['total_tama'],
            'pet_name' => $balance['pet_name'],
            'pet_type' => $balance['pet_type'],
            'level' => (int)$balance['level'],
            'xp' => (int)$balance['xp']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Добавить TAMA пользователю
 */
function handleAddTama($pdo) {
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
        $stmt = $pdo->prepare("SELECT * FROM add_tama(?, ?, ?)");
        $stmt->execute([$telegram_id, $amount, $source]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => $result['success'],
            'message' => $result['message'],
            'new_balance' => (int)$result['new_balance']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Потратить TAMA
 */
function handleSpendTama($pdo) {
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
        $stmt = $pdo->prepare("SELECT * FROM spend_tama(?, ?, ?)");
        $stmt->execute([$telegram_id, $amount, $purpose]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => $result['success'],
            'message' => $result['message'],
            'new_balance' => (int)$result['new_balance']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Минт NFT
 */
function handleMintNFT($pdo) {
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
        $pdo->beginTransaction();
        
        // Проверить баланс
        $stmt = $pdo->prepare("SELECT * FROM get_tama_balance(?)");
        $stmt->execute([$telegram_id]);
        $balance = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($balance['database_tama'] < $cost_tama) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient TAMA balance for NFT mint']);
            return;
        }
        
        // Создать NFT запись
        $stmt = $pdo->prepare("
            INSERT INTO user_nfts (telegram_id, mint_address, pet_type, rarity, cost_tama, cost_sol, transaction_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$telegram_id, $mint_address, $pet_type, $rarity, $cost_tama, $cost_sol, $transaction_hash]);
        
        // Списать TAMA
        $stmt = $pdo->prepare("SELECT * FROM spend_tama(?, ?, 'nft_mint')");
        $stmt->execute([$telegram_id, $cost_tama]);
        $spend_result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$spend_result['success']) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['error' => 'Failed to spend TAMA: ' . $spend_result['message']]);
            return;
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'NFT minted successfully',
            'mint_address' => $mint_address,
            'pet_type' => $pet_type,
            'rarity' => $rarity,
            'cost_tama' => $cost_tama,
            'new_balance' => (int)$spend_result['new_balance']
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Получить статистику
 */
function handleGetStats($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM get_tama_stats()");
        $stmt->execute();
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'stats' => [
                'total_users' => (int)$stats['total_users'],
                'total_database_tama' => (int)$stats['total_database_tama'],
                'total_blockchain_tama' => (int)$stats['total_blockchain_tama'],
                'total_nfts' => (int)$stats['total_nfts'],
                'active_users_today' => (int)$stats['active_users_today']
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
function handleGetLeaderboard($pdo) {
    try {
        $stmt = $pdo->prepare("
            SELECT 
                telegram_id,
                telegram_username,
                pet_name,
                pet_type,
                pet_rarity,
                level,
                xp,
                COALESCE(database_tama, 0) + COALESCE(blockchain_tama, 0) as total_tama,
                created_at
            FROM leaderboard
            WHERE telegram_id IS NOT NULL
            ORDER BY total_tama DESC, xp DESC
            LIMIT 50
        ");
        $stmt->execute();
        $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
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






