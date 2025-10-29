<?php
/**
 * TAMA Token API
 * Обработка TAMA токенов и синхронизация с блокчейном
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

// Подключение к базе данных
require_once 'config.php';

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
        
    case '/transfer-to-blockchain':
        if ($method === 'POST') {
            handleTransferToBlockchain();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/transfer-from-blockchain':
        if ($method === 'POST') {
            handleTransferFromBlockchain();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/mint-nft':
        if ($method === 'POST') {
            handleMintNFT();
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
 * Получить баланс пользователя
 */
function handleGetBalance() {
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
                'total_tama' => 0
            ];
        }
        
        echo json_encode([
            'success' => true,
            'telegram_id' => $telegram_id,
            'database_tama' => (int)$balance['database_tama'],
            'blockchain_tama' => (int)$balance['blockchain_tama'],
            'total_tama' => (int)$balance['total_tama']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Добавить TAMA пользователю
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
    
    try {
        $pdo->beginTransaction();
        
        // Добавить TAMA
        $stmt = $pdo->prepare("SELECT add_tama(?, ?, ?)");
        $stmt->execute([$telegram_id, $amount, $source]);
        
        // Получить обновленный баланс
        $stmt = $pdo->prepare("SELECT * FROM get_tama_balance(?)");
        $stmt->execute([$telegram_id]);
        $balance = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => "Added {$amount} TAMA",
            'new_balance' => (int)$balance['total_tama']
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Потратить TAMA
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
    
    try {
        $pdo->beginTransaction();
        
        // Потратить TAMA
        $stmt = $pdo->prepare("SELECT spend_tama(?, ?, ?)");
        $stmt->execute([$telegram_id, $amount, $purpose]);
        $success = $stmt->fetchColumn();
        
        if (!$success) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient TAMA balance']);
            return;
        }
        
        // Получить обновленный баланс
        $stmt = $pdo->prepare("SELECT * FROM get_tama_balance(?)");
        $stmt->execute([$telegram_id]);
        $balance = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => "Spent {$amount} TAMA",
            'new_balance' => (int)$balance['total_tama']
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Перевести TAMA в блокчейн
 */
function handleTransferToBlockchain() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $telegram_id = $input['telegram_id'] ?? null;
    $amount = $input['amount'] ?? null;
    $wallet_address = $input['wallet_address'] ?? null;
    
    if (!$telegram_id || !$amount || !$wallet_address) {
        http_response_code(400);
        echo json_encode(['error' => 'telegram_id, amount, and wallet_address are required']);
        return;
    }
    
    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'amount must be positive']);
        return;
    }
    
    try {
        $pdo->beginTransaction();
        
        // Проверить баланс
        $stmt = $pdo->prepare("SELECT * FROM get_tama_balance(?)");
        $stmt->execute([$telegram_id]);
        $balance = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($balance['database_tama'] < $amount) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient database TAMA balance']);
            return;
        }
        
        // TODO: Реализовать перевод в блокчейн
        // Пока что просто перемещаем между балансами
        
        // Обновить балансы
        $stmt = $pdo->prepare("
            UPDATE user_tama_balances 
            SET 
                database_tama = database_tama - ?,
                blockchain_tama = blockchain_tama + ?,
                wallet_address = ?,
                last_sync = NOW(),
                updated_at = NOW()
            WHERE telegram_id = ?
        ");
        $stmt->execute([$amount, $amount, $wallet_address, $telegram_id]);
        
        // Записать транзакцию
        $stmt = $pdo->prepare("
            INSERT INTO tama_transactions (telegram_id, transaction_type, amount, source, destination)
            VALUES (?, 'transfer_to_blockchain', ?, 'database', 'blockchain')
        ");
        $stmt->execute([$telegram_id, $amount]);
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => "Transferred {$amount} TAMA to blockchain",
            'wallet_address' => $wallet_address
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Перевести TAMA из блокчейна
 */
function handleTransferFromBlockchain() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $telegram_id = $input['telegram_id'] ?? null;
    $amount = $input['amount'] ?? null;
    
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
        $pdo->beginTransaction();
        
        // Проверить баланс
        $stmt = $pdo->prepare("SELECT * FROM get_tama_balance(?)");
        $stmt->execute([$telegram_id]);
        $balance = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($balance['blockchain_tama'] < $amount) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient blockchain TAMA balance']);
            return;
        }
        
        // TODO: Реализовать перевод из блокчейна
        // Пока что просто перемещаем между балансами
        
        // Обновить балансы
        $stmt = $pdo->prepare("
            UPDATE user_tama_balances 
            SET 
                blockchain_tama = blockchain_tama - ?,
                database_tama = database_tama + ?,
                last_sync = NOW(),
                updated_at = NOW()
            WHERE telegram_id = ?
        ");
        $stmt->execute([$amount, $amount, $telegram_id]);
        
        // Записать транзакцию
        $stmt = $pdo->prepare("
            INSERT INTO tama_transactions (telegram_id, transaction_type, amount, source, destination)
            VALUES (?, 'transfer_from_blockchain', ?, 'blockchain', 'database')
        ");
        $stmt->execute([$telegram_id, $amount]);
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => "Transferred {$amount} TAMA from blockchain"
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

/**
 * Минт NFT
 */
function handleMintNFT() {
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
        
        // Минт NFT
        $stmt = $pdo->prepare("SELECT mint_nft(?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$telegram_id, $mint_address, $pet_type, $rarity, $cost_tama, $cost_sol, $transaction_hash]);
        $success = $stmt->fetchColumn();
        
        if (!$success) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient TAMA balance or NFT already exists']);
            return;
        }
        
        // Получить обновленный баланс
        $stmt = $pdo->prepare("SELECT * FROM get_tama_balance(?)");
        $stmt->execute([$telegram_id]);
        $balance = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => "NFT minted successfully",
            'mint_address' => $mint_address,
            'pet_type' => $pet_type,
            'rarity' => $rarity,
            'cost_tama' => $cost_tama,
            'new_balance' => (int)$balance['total_tama']
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
function handleGetStats() {
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
                'total_nfts' => (int)$stats['total_nfts']
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
