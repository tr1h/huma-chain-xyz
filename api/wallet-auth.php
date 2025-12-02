<?php
/**
 * 🔐 Wallet-Based Authentication API for Chinese Users
 * 
 * This API allows users to create accounts and save game data using only their Solana wallet address.
 * No Telegram required - perfect for Chinese users who can't access Telegram.
 * 
 * Endpoints:
 * - POST /api/wallet-auth/create - Create account by wallet address
 * - POST /api/wallet-auth/get - Get user data by wallet address
 * - POST /api/wallet-auth/save - Save game state by wallet address
 */

// ⚠️ CRITICAL: Suppress PHP errors to prevent HTML output (MUST BE FIRST!)
error_reporting(E_ALL);
ini_set('display_errors', '0');  // Don't output errors to response
ini_set('log_errors', '1');      // Log errors to error_log instead

// ⚠️ CRITICAL: Suppress PHP warnings to prevent HTML output
error_reporting(E_ALL);
ini_set('display_errors', '0');  // Don't output errors to response
ini_set('log_errors', '1');      // Log errors to error_log instead

// Set headers FIRST - before any output or errors
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Try to load config, but don't fail if missing
try {
    if (file_exists(__DIR__ . '/config.php')) {
        require_once __DIR__ . '/config.php';
    }
} catch (Exception $e) {
    error_log('Config load error: ' . $e->getMessage());
}

// Supabase config - Priority: config.php constants > environment variables > fallback
$SUPABASE_URL = defined('SUPABASE_URL') && SUPABASE_URL 
    ? SUPABASE_URL 
    : (getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co');

// Anon key for read operations
$SUPABASE_KEY = defined('SUPABASE_KEY') && SUPABASE_KEY 
    ? SUPABASE_KEY 
    : (getenv('SUPABASE_KEY') ?: null);

// Service role key for write operations (bypasses RLS)
$SUPABASE_SERVICE_ROLE_KEY = defined('SUPABASE_SERVICE_ROLE_KEY') && SUPABASE_SERVICE_ROLE_KEY
    ? SUPABASE_SERVICE_ROLE_KEY
    : (getenv('SUPABASE_SERVICE_ROLE_KEY') ?: null);

// Use service_role key for writes, fallback to anon key if not set
$SUPABASE_WRITE_KEY = $SUPABASE_SERVICE_ROLE_KEY ?: $SUPABASE_KEY;

// Log configuration status (without exposing keys)
if (!$SUPABASE_KEY) {
    error_log('❌ CRITICAL: SUPABASE_KEY is not set! Check environment variables or config.php');
    error_log('📍 Config check: defined=' . (defined('SUPABASE_KEY') ? 'yes' : 'no') . ', env=' . (getenv('SUPABASE_KEY') ? 'yes' : 'no'));
} else {
    error_log('✅ Supabase config loaded: URL=' . $SUPABASE_URL);
    error_log('✅ Anon key: ' . substr($SUPABASE_KEY, 0, 20) . '...');
    if ($SUPABASE_SERVICE_ROLE_KEY) {
        error_log('✅ Service role key: ' . substr($SUPABASE_SERVICE_ROLE_KEY, 0, 20) . '...');
    } else {
        error_log('⚠️ Service role key not set - will use anon key for writes (may fail with RLS)');
    }
}

/**
 * Supabase request helper
 */
function supabaseRequest($url, $key, $method, $table, $filters = [], $data = null) {
    $ch = curl_init();
    
    $queryString = '';
    if (!empty($filters)) {
        $queryParts = [];
        foreach ($filters as $key => $value) {
            if ($key === 'select') {
                $queryParts[] = 'select=' . urlencode($value);
            } else {
                $queryParts[] = urlencode($key) . '=' . urlencode($value);
            }
        }
        $queryString = '?' . implode('&', $queryParts);
    }
    
    $fullUrl = $url . '/rest/v1/' . $table . $queryString;
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $fullUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'apikey: ' . $key,
            'Authorization: Bearer ' . $key,
            'Content-Type: application/json',
            'Prefer: return=representation'
        ],
        CURLOPT_CUSTOMREQUEST => $method
    ]);
    
    if ($data && in_array($method, ['POST', 'PATCH', 'PUT'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

/**
 * Generate referral code from wallet address
 */
function generateReferralCodeFromWallet($walletAddress) {
    // Use first 8 chars of wallet address + random suffix
    $prefix = strtoupper(substr($walletAddress, 0, 8));
    $suffix = strtoupper(substr(md5($walletAddress . time()), 0, 8));
    return 'TAMA' . $prefix . $suffix;
}

/**
 * Create account by wallet address
 * POST /api/wallet-auth/create
 */
function handleCreateAccount($url, $key, $input = null) {
    try {
        // Read input if not provided
        if ($input === null) {
            $input = json_decode(file_get_contents('php://input'), true);
        }
        $walletAddress = $input['wallet_address'] ?? null;
        
        if (!$walletAddress) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'wallet_address is required']);
            return;
        }
        
        // Validate Solana wallet address format (basic check)
        if (strlen($walletAddress) < 32 || strlen($walletAddress) > 44) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid wallet address format']);
            return;
        }
        
        // Check if user already exists by wallet address
        $existingUser = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'wallet_address' => 'eq.' . $walletAddress,
            'limit' => '1'
        ]);
        
        if (!empty($existingUser['data'])) {
            // User exists - return existing data
            $user = $existingUser['data'][0];
            echo json_encode([
                'success' => true,
                'user_id' => $user['telegram_id'] ?? 'wallet_' . substr($walletAddress, 0, 8),
                'wallet_address' => $walletAddress,
                'tama' => (int)($user['tama'] ?? 0),
                'level' => (int)($user['level'] ?? 1),
                'xp' => (int)($user['xp'] ?? 0),
                'pet_name' => $user['pet_name'] ?? null,
                'pet_type' => $user['pet_type'] ?? null,
                'referral_code' => $user['referral_code'] ?? generateReferralCodeFromWallet($walletAddress),
                'message' => 'Account already exists'
            ]);
            return;
        }
        
        // Create new account
        $referralCode = generateReferralCodeFromWallet($walletAddress);
        $userId = 'wallet_' . substr($walletAddress, 0, 12); // Use wallet prefix as user ID
        
        $newUser = [
            'telegram_id' => $userId, // Use wallet-based ID
            'wallet_address' => $walletAddress,
            'telegram_username' => 'wallet_user',
            'tama' => 0,
            'level' => 1,
            'xp' => 0,
            'clicks' => 0,
            'referral_code' => $referralCode,
            'pet_name' => null,
            'pet_type' => null,
            'created_at' => date('c')
        ];
        
        $result = supabaseRequest($url, $key, 'POST', 'leaderboard', [], $newUser);
        
        if ($result['code'] >= 200 && $result['code'] < 300) {
            echo json_encode([
                'success' => true,
                'user_id' => $userId,
                'wallet_address' => $walletAddress,
                'tama' => 0,
                'level' => 1,
                'xp' => 0,
                'referral_code' => $referralCode,
                'message' => 'Account created successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to create account',
                'details' => $result['data'] ?? 'Unknown error'
            ]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Get user data by wallet address
 * POST /api/wallet-auth/get
 */
function handleGetUser($url, $key, $input = null) {
    try {
        // Read input if not provided
        if ($input === null) {
            $input = json_decode(file_get_contents('php://input'), true);
        }
        $walletAddress = $input['wallet_address'] ?? null;
        
        if (!$walletAddress) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'wallet_address is required']);
            return;
        }
        
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'wallet_address' => 'eq.' . $walletAddress,
            'limit' => '1'
        ]);
        
        // Check if result has data and it's an array with at least one element
        if (empty($result['data']) || !is_array($result['data']) || count($result['data']) === 0) {
            // User doesn't exist - return default values
            echo json_encode([
                'success' => true,
                'exists' => false,
                'wallet_address' => $walletAddress,
                'tama' => 0,
                'level' => 1,
                'xp' => 0,
                'message' => 'Account not found - please create account first'
            ]);
            return;
        }
        
        $user = $result['data'][0];
        echo json_encode([
            'success' => true,
            'exists' => true,
            'user_id' => $user['telegram_id'] ?? 'wallet_' . substr($walletAddress, 0, 8),
            'wallet_address' => $walletAddress,
            'tama' => (int)($user['tama'] ?? 0),
            'level' => (int)($user['level'] ?? 1),
            'xp' => (int)($user['xp'] ?? 0),
            'clicks' => (int)($user['clicks'] ?? 0),
            'pet_name' => $user['pet_name'] ?? null,
            'pet_type' => $user['pet_type'] ?? null,
            'referral_code' => $user['referral_code'] ?? null
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Save game state by wallet address
 * POST /api/wallet-auth/save
 */
function handleSaveGameState($url, $key, $input = null) {
    try {
        // Read input if not provided
        if ($input === null) {
            $input = json_decode(file_get_contents('php://input'), true);
        }
        $walletAddress = $input['wallet_address'] ?? null;
        $gameState = $input['game_state'] ?? null;
        
        if (!$walletAddress || !$gameState) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'wallet_address and game_state are required']);
            return;
        }
        
        // Prepare update data
        $updateData = [
            'tama' => (int)($gameState['tama'] ?? 0),
            'level' => (int)($gameState['level'] ?? 1),
            'xp' => (int)($gameState['xp'] ?? 0),
            'clicks' => (int)($gameState['clicks'] ?? 0),
            'pet_name' => $gameState['pet_name'] ?? null,
            'pet_type' => $gameState['pet_type'] ?? null,
            'last_activity' => date('c')
        ];
        
        // Remove null values
        $updateData = array_filter($updateData, function($value) {
            return $value !== null;
        });
        
        // Use the key passed to function (should be service_role key for writes)
        // Log which key is being used
        error_log('💾 Saving game state with key: ' . substr($key, 0, 20) . '...');
        
        $result = supabaseRequest($url, $key, 'PATCH', 'leaderboard', [
            'wallet_address' => 'eq.' . $walletAddress
        ], $updateData);
        
        if ($result['code'] >= 200 && $result['code'] < 300) {
            echo json_encode([
                'success' => true,
                'message' => 'Game state saved successfully'
            ]);
        } else {
            // Log detailed error for debugging
            error_log('❌ Save game state failed: HTTP ' . $result['code']);
            error_log('❌ Error details: ' . json_encode($result['data']));
            
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to save game state',
                'details' => $result['data'] ?? 'Unknown error',
                'http_code' => $result['code']
            ]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

// Route requests
$path = $_SERVER['REQUEST_URI'];
$pathParts = explode('/', trim($path, '/'));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read input ONCE - php://input can only be read once!
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    if ($input === null && !empty($rawInput)) {
        // If JSON decode failed, try to parse as query string or log error
        error_log('Failed to parse JSON input: ' . substr($rawInput, 0, 200));
        $input = [];
    }
    // Parse input to get action
    $action = $input['action'] ?? null;
    
    // If action is still not found, try to get from URL path or query
    if (!$action || !in_array($action, ['create', 'get', 'save'])) {
        // Try to extract from URL: /api/wallet-auth.php?action=get or /api/wallet-auth/get
        if (isset($_GET['action'])) {
            $action = $_GET['action'];
        } elseif (in_array('wallet-auth', $pathParts)) {
            $actionIndex = array_search('wallet-auth', $pathParts);
            if ($actionIndex !== false && isset($pathParts[$actionIndex + 1])) {
                $action = $pathParts[$actionIndex + 1];
            }
        } else {
            // Try last path part as action
            $action = end($pathParts);
            if ($action === 'wallet-auth.php' || empty($action)) {
                $action = null;
            }
        }
    }
    
    // Log for debugging
    error_log("Wallet Auth API - Method: POST, Action: " . ($action ?? 'NULL') . ", Path: $path");
    
    if (!$action || !in_array($action, ['create', 'get', 'save'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'error' => 'Invalid action. Use: create, get, or save',
            'received_action' => $action,
            'path' => $path,
            'input_keys' => array_keys($input ?? [])
        ]);
        exit;
    }
    
    // Use service_role key for write operations (create/save), anon key for reads
    // Priority: SUPABASE_SERVICE_ROLE_KEY constant > environment variable > fallback to anon key
    $serviceRoleKey = null;
    if (defined('SUPABASE_SERVICE_ROLE_KEY') && SUPABASE_SERVICE_ROLE_KEY) {
        $serviceRoleKey = SUPABASE_SERVICE_ROLE_KEY;
    } elseif (getenv('SUPABASE_SERVICE_ROLE_KEY')) {
        $serviceRoleKey = getenv('SUPABASE_SERVICE_ROLE_KEY');
    }
    
    $writeKey = $serviceRoleKey ?: $SUPABASE_KEY;
    
    // Log which key is being used (for debugging)
    if ($action === 'save' || $action === 'create') {
        if (!$serviceRoleKey) {
            error_log('⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY not set! Using anon key for write operation. This may fail with RLS enabled.');
        } else {
            error_log('✅ Using service_role key for write operation');
        }
    }
    
    switch ($action) {
        case 'create':
            handleCreateAccount($SUPABASE_URL, $writeKey, $input);
            break;
        case 'get':
            handleGetUser($SUPABASE_URL, $SUPABASE_KEY, $input);
            break;
        case 'save':
            handleSaveGameState($SUPABASE_URL, $writeKey, $input);
            break;
    }
} else {
    // Allow GET for health check / info endpoint
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode([
            'success' => true,
            'service' => 'Wallet Authentication API',
            'version' => '1.0',
            'endpoints' => [
                'POST /api/wallet-auth.php?action=get' => 'Get user by wallet address',
                'POST /api/wallet-auth.php?action=create' => 'Create account by wallet address',
                'POST /api/wallet-auth.php?action=save' => 'Save game state by wallet address'
            ],
            'method_required' => 'POST',
            'note' => 'This API requires POST requests with action parameter in JSON body'
        ]);
        exit;
    }
    
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'error' => 'Method not allowed. Use POST',
        'method' => $_SERVER['REQUEST_METHOD'],
        'info' => 'This API accepts only POST requests with JSON body containing action parameter'
    ]);
}

