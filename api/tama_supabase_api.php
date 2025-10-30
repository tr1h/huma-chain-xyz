<?php
/**
 * TAMA Token API - Supabase API Version
 * Использует Supabase API вместо прямого подключения к PostgreSQL
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Настройки Supabase API
$supabase_url = 'https://zfrazyupameidxpjihrh.supabase.co';
$supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU'; // Замени на свой anon key

// Константы TAMA токена
define('TAMA_MINT_ADDRESS', 'Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY');

// Получить метод и путь
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Support both /api/tama/... and /api/tama_supabase_api.php/...
$path = preg_replace('#^/api/(tama|tama_supabase_api\.php)#', '', $path);

// Маршрутизация
switch ($path) {
    case '/balance':
        if ($method === 'GET') {
            handleGetBalance($supabase_url, $supabase_key);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/add':
        if ($method === 'POST') {
            handleAddTama($supabase_url, $supabase_key);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/spend':
        if ($method === 'POST') {
            handleSpendTama($supabase_url, $supabase_key);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
        
    case '/test':
        if ($method === 'GET') {
            handleTest($supabase_url, $supabase_key);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
    
    case '/save':
        if ($method === 'POST') {
            handleSaveProgress($supabase_url, $supabase_key);
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
 * Выполнить запрос к Supabase API
 */
function makeSupabaseRequest($url, $key, $endpoint, $method = 'GET', $data = null) {
    $ch = curl_init();
    
    $headers = [
        'apikey: ' . $key,
        'Authorization: Bearer ' . $key,
        'Content-Type: application/json',
        'Prefer: return=minimal'
    ];
    
    curl_setopt($ch, CURLOPT_URL, $url . '/rest/v1/' . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'data' => json_decode($response, true),
        'status' => $httpCode
    ];
}

/**
 * Тест подключения к Supabase
 */
function handleTest($url, $key) {
    $result = makeSupabaseRequest($url, $key, 'leaderboard?select=count');
    
    if ($result['status'] === 200) {
        echo json_encode([
            'success' => true,
            'message' => 'Supabase API connection successful',
            'status' => $result['status']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Supabase API connection failed',
            'status' => $result['status']
        ]);
    }
}

/**
 * Получить баланс пользователя
 */
function handleGetBalance($url, $key) {
    $user_id = $_GET['user_id'] ?? null;
    $user_type = $_GET['user_type'] ?? 'wallet';
    
    if (!$user_id) {
        http_response_code(400);
        echo json_encode(['error' => 'user_id is required']);
        return;
    }
    
    $where_field = $user_type === 'telegram' ? 'telegram_id' : 'wallet_address';
    $endpoint = "leaderboard?$where_field=eq.$user_id&select=tama,pet_name,pet_type,level,xp";
    
    $result = makeSupabaseRequest($url, $key, $endpoint);
    
    if ($result['status'] === 200 && !empty($result['data'])) {
        $balance = $result['data'][0];
        echo json_encode([
            'success' => true,
            'user_id' => $user_id,
            'user_type' => $user_type,
            'database_tama' => (int)($balance['tama'] ?? 0),
            'total_tama' => (int)($balance['tama'] ?? 0),
            'pet_name' => $balance['pet_name'],
            'pet_type' => $balance['pet_type'],
            'level' => (int)($balance['level'] ?? 1),
            'xp' => (int)($balance['xp'] ?? 0)
        ]);
    } else {
        // Пользователь не найден, возвращаем нули
        echo json_encode([
            'success' => true,
            'user_id' => $user_id,
            'user_type' => $user_type,
            'database_tama' => 0,
            'total_tama' => 0,
            'pet_name' => null,
            'pet_type' => null,
            'level' => 1,
            'xp' => 0
        ]);
    }
}

/**
 * Добавить TAMA пользователю
 */
function handleAddTama($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $user_id = $input['user_id'] ?? null;
    $user_type = $input['user_type'] ?? 'wallet';
    $amount = $input['amount'] ?? null;
    $source = $input['source'] ?? 'game';
    
    if (!$user_id || !$amount) {
        http_response_code(400);
        echo json_encode(['error' => 'user_id and amount are required']);
        return;
    }
    
    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'amount must be positive']);
        return;
    }
    
    $where_field = $user_type === 'telegram' ? 'telegram_id' : 'wallet_address';
    
    // Проверить существование пользователя
    $check_endpoint = "leaderboard?$where_field=eq.$user_id&select=id,tama";
    $check_result = makeSupabaseRequest($url, $key, $check_endpoint);
    
    if ($check_result['status'] === 200 && !empty($check_result['data'])) {
        // Пользователь существует, обновить баланс
        $user = $check_result['data'][0];
        $new_balance = ($user['tama'] ?? 0) + $amount;
        
        $update_data = [
            'tama' => $new_balance,
            'updated_at' => date('c')
        ];
        
        $update_endpoint = "leaderboard?id=eq." . $user['id'];
        $update_result = makeSupabaseRequest($url, $key, $update_endpoint, 'PATCH', $update_data);
        
        if ($update_result['status'] === 200 || $update_result['status'] === 204) {
            echo json_encode([
                'success' => true,
                'message' => 'TAMA added successfully',
                'new_balance' => $new_balance
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update balance']);
        }
    } else {
        // Пользователь не существует, создать нового
        $new_user_data = [
            $where_field => $user_id,
            'tama' => $amount,
            'level' => 1,
            'xp' => 0,
            'created_at' => date('c'),
            'updated_at' => date('c')
        ];
        
        $create_result = makeSupabaseRequest($url, $key, 'leaderboard', 'POST', $new_user_data);
        
        if ($create_result['status'] === 201) {
            echo json_encode([
                'success' => true,
                'message' => 'TAMA added successfully',
                'new_balance' => $amount
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create user']);
        }
    }
}

/**
 * Потратить TAMA
 */
function handleSpendTama($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $user_id = $input['user_id'] ?? null;
    $user_type = $input['user_type'] ?? 'wallet';
    $amount = $input['amount'] ?? null;
    $purpose = $input['purpose'] ?? 'spend';
    
    if (!$user_id || !$amount) {
        http_response_code(400);
        echo json_encode(['error' => 'user_id and amount are required']);
        return;
    }
    
    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'amount must be positive']);
        return;
    }
    
    $where_field = $user_type === 'telegram' ? 'telegram_id' : 'wallet_address';
    
    // Получить текущий баланс
    $check_endpoint = "leaderboard?$where_field=eq.$user_id&select=id,tama";
    $check_result = makeSupabaseRequest($url, $key, $check_endpoint);
    
    if ($check_result['status'] === 200 && !empty($check_result['data'])) {
        $user = $check_result['data'][0];
        $current_balance = $user['tama'] ?? 0;
        
        if ($current_balance < $amount) {
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient TAMA balance']);
            return;
        }
        
        $new_balance = $current_balance - $amount;
        $update_data = [
            'tama' => $new_balance,
            'updated_at' => date('c')
        ];
        
        $update_endpoint = "leaderboard?id=eq." . $user['id'];
        $update_result = makeSupabaseRequest($url, $key, $update_endpoint, 'PATCH', $update_data);
        
        if ($update_result['status'] === 200 || $update_result['status'] === 204) {
            echo json_encode([
                'success' => true,
                'message' => 'TAMA spent successfully',
                'new_balance' => $new_balance
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update balance']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
    }
}

/**
 * Сохранить прогресс игрока (UPSERT по telegram_id)
 */
function handleSaveProgress($url, $key) {
    $input = json_decode(file_get_contents('php://input'), true);
    $telegram_id = $input['telegram_id'] ?? null;
    if (!$telegram_id) {
        http_response_code(400);
        echo json_encode(['error' => 'telegram_id is required']);
        return;
    }
    $data = [
        'telegram_id'   => (string)$telegram_id,
        'tama'          => $input['tama'] ?? 0,
        'level'         => $input['level'] ?? 1,
        'xp'            => $input['xp'] ?? 0,
        'pet_data'      => isset($input['pet_data']) ? json_encode($input['pet_data']) : null,
        'last_activity' => date('c'),
        'updated_at'    => date('c')
    ];

    // Проверить существование
    $check = makeSupabaseRequest($url, $key, "leaderboard?telegram_id=eq." . urlencode((string)$telegram_id) . "&select=id");
    if ($check['status'] === 200 && !empty($check['data'])) {
        // PATCH по id
        $id = $check['data'][0]['id'];
        $result = makeSupabaseRequest($url, $key, "leaderboard?id=eq.$id", 'PATCH', $data);
        if ($result['status'] === 200 || $result['status'] === 204) {
            echo json_encode(['success' => true, 'mode' => 'update']);
            return;
        }
        http_response_code(500);
        echo json_encode(['error' => 'update failed', 'status' => $result['status']]);
        return;
    }

    // Создать нового
    $data['created_at'] = date('c');
    $create = makeSupabaseRequest($url, $key, 'leaderboard', 'POST', $data);
    if ($create['status'] === 201) {
        echo json_encode(['success' => true, 'mode' => 'insert']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'insert failed', 'status' => $create['status']]);
    }
}
?>

