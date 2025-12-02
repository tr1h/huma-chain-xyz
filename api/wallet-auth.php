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

// Anon key for read operations - use fallback if not set in env
$SUPABASE_KEY = defined('SUPABASE_KEY') && SUPABASE_KEY 
    ? SUPABASE_KEY 
    : (getenv('SUPABASE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU');

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
function supabaseRequest($url, $apiKey, $method, $table, $filters = [], $data = null) {
    $ch = curl_init();
    
    $queryString = '';
    if (!empty($filters)) {
        $queryParts = [];
        foreach ($filters as $filterKey => $value) {
            if ($filterKey === 'select') {
                $queryParts[] = 'select=' . urlencode($value);
            } else {
                $queryParts[] = urlencode($filterKey) . '=' . urlencode($value);
            }
        }
        $queryString = '?' . implode('&', $queryParts);
    }
    
    $fullUrl = $url . '/rest/v1/' . $table . $queryString;
    
    // Log request details (without exposing full key)
    error_log("🔍 Supabase Request: $method $table | Key: " . substr($apiKey, 0, 20) . "... | URL: " . $fullUrl);
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $fullUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'apikey: ' . $apiKey,
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            'Prefer: return=representation'
        ],
        CURLOPT_CUSTOMREQUEST => $method
    ]);
    
    if ($data && in_array($method, ['POST', 'PATCH', 'PUT'])) {
        $jsonData = json_encode($data);
        error_log("📤 Request body: " . substr($jsonData, 0, 200));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($curlError) {
        error_log("❌ CURL Error: $curlError");
    }
    
    $responseData = json_decode($response, true);
    
    // Log response for debugging
    if ($httpCode >= 400) {
        error_log("❌ Supabase Error Response ($httpCode): " . substr($response, 0, 500));
    } else {
        error_log("✅ Supabase Success ($httpCode)");
    }
    
    return [
        'code' => $httpCode,
        'data' => $responseData
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
        $existingUser = supabaseRequest($url, $key, 'GET', 'wallet_users', [
            'wallet_address' => 'eq.' . $walletAddress,
            'limit' => '1'
        ]);
        
        if (!empty($existingUser['data'])) {
            // User exists - return existing data
            $user = $existingUser['data'][0];
            $existingGameState = is_string($user['game_state'] ?? null) ? json_decode($user['game_state'], true) : ($user['game_state'] ?? []);
            echo json_encode([
                'success' => true,
                'user_id' => $user['user_id'] ?? 'wallet_' . substr($walletAddress, 0, 12),
                'wallet_address' => $walletAddress,
                'tama' => (int)($user['tama_balance'] ?? 0),
                'level' => (int)($user['level'] ?? 1),
                'xp' => (int)($user['experience'] ?? 0),
                'clicks' => (int)($user['clicks'] ?? 0),
                'pet_name' => $existingGameState['pet_name'] ?? null,
                'pet_type' => $existingGameState['pet_type'] ?? null,
                'questClicksCompleted' => (bool)($existingGameState['questClicksCompleted'] ?? false),
                'questLevelCompleted' => (bool)($existingGameState['questLevelCompleted'] ?? false),
                'message' => 'Account already exists'
            ]);
            return;
        }
        
        // Create new account
        $userId = 'wallet_' . substr($walletAddress, 0, 12); // Use wallet prefix as user ID
        
        $newUser = [
            'wallet_address' => $walletAddress,
            'user_id' => $userId,
            'username' => $input['username'] ?? 'Player',
            'tama_balance' => 0,
            'level' => 1,
            'experience' => 0,
            'clicks' => 0,
            'health' => 100,
            'food' => 100,
            'happiness' => 100,
            'game_state' => json_encode(['pet_name' => null, 'pet_type' => null])
        ];
        
        $result = supabaseRequest($url, $key, 'POST', 'wallet_users', [], $newUser);
        
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
        
        $result = supabaseRequest($url, $key, 'GET', 'wallet_users', [
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
        $gameState = is_string($user['game_state'] ?? null) ? json_decode($user['game_state'], true) : ($user['game_state'] ?? []);
        
        echo json_encode([
            'success' => true,
            'exists' => true,
            'user_id' => $user['user_id'] ?? 'wallet_' . substr($walletAddress, 0, 12),
            'wallet_address' => $walletAddress,
            'tama' => (int)($user['tama_balance'] ?? 0),
            'level' => (int)($user['level'] ?? 1),
            'xp' => (int)($user['experience'] ?? 0),
            'clicks' => (int)($user['clicks'] ?? 0),
            'pet_name' => $gameState['pet_name'] ?? null,
            'pet_type' => $gameState['pet_type'] ?? null,
            'questClicksCompleted' => (bool)($gameState['questClicksCompleted'] ?? false),
            'questLevelCompleted' => (bool)($gameState['questLevelCompleted'] ?? false)
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
        
        // Prepare update data for wallet_users table
        $updateData = [
            'tama_balance' => (int)($gameState['tama'] ?? 0),
            'level' => (int)($gameState['level'] ?? 1),
            'experience' => (int)($gameState['xp'] ?? 0),
            'clicks' => (int)($gameState['clicks'] ?? 0),
            'health' => (int)($gameState['health'] ?? 100),
            'food' => (int)($gameState['food'] ?? 100),
            'happiness' => (int)($gameState['happiness'] ?? 100),
            'game_state' => json_encode([
                'pet_name' => $gameState['pet_name'] ?? null,
                'pet_type' => $gameState['pet_type'] ?? null,
            'tama' => (int)($gameState['tama'] ?? 0),
            'level' => (int)($gameState['level'] ?? 1),
            'xp' => (int)($gameState['xp'] ?? 0),
                'clicks' => (int)($gameState['clicks'] ?? 0)
            ]),
            'last_login' => date('c')
        ];
        
        // Use the key passed to function (should be service_role key for writes)
        // Log which key is being used
        error_log('💾 Saving game state with key: ' . substr($key, 0, 20) . '...');
        
        $result = supabaseRequest($url, $key, 'PATCH', 'wallet_users', [
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

/**
 * Link Telegram account with Wallet
 */
function handleLinkAccounts($url, $key, $input) {
    $telegram_id = $input['telegram_id'] ?? null;
    $wallet_address = $input['wallet_address'] ?? null;
    
    if (!$telegram_id || !$wallet_address) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'telegram_id and wallet_address are required'
        ]);
        return;
    }
    
    try {
        // Call Supabase function to link accounts
        $ch = curl_init();
        
        curl_setopt_array($ch, [
            CURLOPT_URL => $url . '/rest/v1/rpc/link_telegram_with_wallet',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'apikey: ' . $key,
                'Authorization: Bearer ' . $key,
                'Content-Type: application/json'
            ],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'p_telegram_id' => (int)$telegram_id,
                'p_wallet_address' => $wallet_address
            ])
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $result = json_decode($response, true);
            echo json_encode([
                'success' => true,
                'message' => 'Accounts linked successfully',
                'data' => $result
            ]);
        } else {
            http_response_code($httpCode);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to link accounts',
                'details' => json_decode($response, true),
                'http_code' => $httpCode
            ]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Process referral bonus
 */
function handleProcessReferral($url, $key, $input) {
    $referrer_wallet = $input['referrer_wallet'] ?? null;
    $new_user_wallet = $input['new_user_wallet'] ?? null;
    $bonus_amount = $input['bonus_amount'] ?? 1000;
    
    if (!$referrer_wallet || !$new_user_wallet) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'referrer_wallet and new_user_wallet are required'
        ]);
        return;
    }
    
    try {
        // Call Supabase function to process referral
        $ch = curl_init();
        
        curl_setopt_array($ch, [
            CURLOPT_URL => $url . '/rest/v1/rpc/process_referral_bonus',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'apikey: ' . $key,
                'Authorization: Bearer ' . $key,
                'Content-Type: application/json'
            ],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode([
                'p_referrer_wallet' => $referrer_wallet,
                'p_new_user_wallet' => $new_user_wallet,
                'p_bonus_amount' => (float)$bonus_amount
            ])
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $result = json_decode($response, true);
            
            // Check if result indicates success
            if (isset($result['success']) && $result['success'] === true) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Referral bonus processed successfully',
                    'data' => $result
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => $result['error'] ?? 'Failed to process referral',
                    'details' => $result
                ]);
            }
        } else {
            http_response_code($httpCode);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to process referral bonus',
                'details' => json_decode($response, true),
                'http_code' => $httpCode
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
    if (!$action || !in_array($action, ['create', 'get', 'save', 'link_accounts', 'process_referral'])) {
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
    
    if (!$action || !in_array($action, ['create', 'get', 'save', 'link_accounts', 'process_referral'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'error' => 'Invalid action. Use: create, get, save, link_accounts, or process_referral',
            'received_action' => $action,
            'path' => $path,
            'input_keys' => array_keys($input ?? [])
        ]);
        exit;
    }
    
    // Use the same key for all operations (as it was before)
    // Try service_role first if available, otherwise use anon key
    $writeKey = defined('SUPABASE_SERVICE_ROLE_KEY') && SUPABASE_SERVICE_ROLE_KEY 
        ? SUPABASE_SERVICE_ROLE_KEY 
        : (getenv('SUPABASE_SERVICE_ROLE_KEY') ?: $SUPABASE_KEY);
    
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
        case 'link_accounts':
            handleLinkAccounts($SUPABASE_URL, $writeKey, $input);
            break;
        case 'process_referral':
            handleProcessReferral($SUPABASE_URL, $writeKey, $input);
            break;
    }
} else {
    // Allow GET for health check / info endpoint (also used for keep-alive ping)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $isPing = isset($_GET['ping']) || isset($_GET['keepalive']) || isset($_GET['health']);
        
        // Log keep-alive pings (but don't spam logs)
        if ($isPing) {
            error_log('🔄 Keep-Alive ping received');
        }
        
        echo json_encode([
            'success' => true,
            'service' => 'Wallet Authentication API',
            'version' => '1.0',
            'status' => 'online',
            'timestamp' => date('c'),
            'endpoints' => [
                'POST /api/wallet-auth.php?action=get' => 'Get user by wallet address',
                'POST /api/wallet-auth.php?action=create' => 'Create account by wallet address',
                'POST /api/wallet-auth.php?action=save' => 'Save game state by wallet address'
            ],
            'method_required' => 'POST',
            'note' => 'This API requires POST requests with action parameter in JSON body',
            'keep_alive' => $isPing ? 'ping received' : null
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

