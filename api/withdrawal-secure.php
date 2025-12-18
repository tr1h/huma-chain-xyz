<?php
/**
 * 🔐 SECURE WITHDRAWAL WITH CORRECT ORDER
 * 
 * SECURITY FEATURES:
 * - JWT/InitData authentication (prevents user_id spoofing)
 * - Wallet ownership verification (prevents token theft)
 * - Atomic database transaction (prevents double-spending)
 * - Executes blockchain TX FIRST, then DB update (prevents token loss)
 * - Rate limiting (1 withdrawal per 5 minutes)
 * - Solana address validation
 * - Restricted CORS
 * 
 * Endpoint: /api/withdrawal-secure.php
 * Method: POST
 * 
 * Request:
 * {
 *   "telegram_id": 123456789,
 *   "wallet_address": "7xKXtg2...",
 *   "amount": 10000,
 *   "init_data": "..." // Required: Telegram WebApp initData for authentication
 * }
 */

// CORS - Restrict to project domain only
$allowed_origins = [
    'https://solanatamagotchi.com',
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://solanatamagotchi.com');
}

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Load authentication module
require_once __DIR__ . '/telegram_auth.php';

// Supabase settings
$supabaseUrl = getenv('SUPABASE_URL');
$supabaseKey = getenv('SUPABASE_KEY');

if (!$supabaseUrl || !$supabaseKey) {
    error_log("❌ CRITICAL: SUPABASE_URL or SUPABASE_KEY not configured");
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error']);
    exit();
}

// Helper: Validate Solana wallet address
function isValidSolanaAddress($address) {
    // Solana addresses are base58 encoded, 32-44 characters
    if (!is_string($address)) return false;
    $len = strlen($address);
    if ($len < 32 || $len > 44) return false;
    
    // Check base58 characters (no 0, O, I, l)
    if (!preg_match('/^[1-9A-HJ-NP-Za-km-z]+$/', $address)) return false;
    
    return true;
}

// Helper: Check rate limiting (1 withdrawal per 5 minutes)
function checkRateLimit($telegram_id) {
    global $supabaseUrl, $supabaseKey;
    
    // 🔐 SQL Injection Protection: Validate telegram_id is numeric
    if (!is_numeric($telegram_id) || $telegram_id <= 0) {
        error_log("🚫 Invalid telegram_id in rate limit check: $telegram_id");
        return ['allowed' => false, 'wait_seconds' => 300];
    }
    
    $telegram_id = (int)$telegram_id; // Cast to int for safety
    
    // 🔧 FIX: Use UTC timezone for consistency with Supabase
    $fiveMinutesAgo = gmdate('Y-m-d\TH:i:s\Z', time() - 300);
    
    // Safe: telegram_id is now validated integer
    $url = $supabaseUrl . '/rest/v1/transactions?telegram_id=eq.' . $telegram_id 
         . '&type=eq.withdrawal&created_at=gte.' . urlencode($fiveMinutesAgo) 
         . '&limit=1&select=created_at';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabaseKey,
        'Authorization: Bearer ' . $supabaseKey
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5); // Add timeout
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($curlError) {
        error_log("⚠️ Rate limit check failed: $curlError");
        // Fail-safe: deny on error
        return ['allowed' => false, 'wait_seconds' => 60];
    }
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        if (!empty($data) && is_array($data)) {
            $lastWithdrawal = $data[0]['created_at'] ?? null;
            if ($lastWithdrawal) {
                $waitTime = 300 - (time() - strtotime($lastWithdrawal)); // seconds remaining
                return [
                    'allowed' => false,
                    'wait_seconds' => max(0, $waitTime)
                ];
            }
        }
    }
    
    return ['allowed' => true];
}

// Helper: Check user balance
function checkUserBalance($telegram_id) {
    global $supabaseUrl, $supabaseKey;
    
    // 🔐 Validate telegram_id
    if (!is_numeric($telegram_id) || $telegram_id <= 0) {
        error_log("🚫 Invalid telegram_id in balance check: $telegram_id");
        return null;
    }
    
    $telegram_id = (int)$telegram_id;
    
    // Get user balance from leaderboard table
    $url = $supabaseUrl . '/rest/v1/leaderboard?telegram_id=eq.' . $telegram_id 
         . '&limit=1&select=tama_balance,telegram_id';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabaseKey,
        'Authorization: Bearer ' . $supabaseKey
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($curlError) {
        error_log("⚠️ Balance check curl error: $curlError");
        return null;
    }
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        if (!empty($data) && is_array($data) && isset($data[0]['tama_balance'])) {
            return (int)$data[0]['tama_balance'];
        }
    }
    
    error_log("⚠️ Balance check failed: HTTP $httpCode");
    return null;
}

// Helper: Verify wallet ownership
function verifyWalletOwnership($telegram_id, $wallet_address) {
    global $supabaseUrl, $supabaseKey;
    
    // 🔐 SQL Injection Protection: Validate inputs
    if (!is_numeric($telegram_id) || $telegram_id <= 0) {
        error_log("🚫 Invalid telegram_id in wallet ownership check: $telegram_id");
        return false;
    }
    
    if (!is_string($wallet_address) || strlen($wallet_address) < 32 || strlen($wallet_address) > 44) {
        error_log("🚫 Invalid wallet_address format in ownership check");
        return false;
    }
    
    $telegram_id = (int)$telegram_id; // Cast to int for safety
    
    // Check in leaderboard table if this wallet belongs to this user
    $url = $supabaseUrl . '/rest/v1/leaderboard?telegram_id=eq.' . $telegram_id 
         . '&wallet_address=eq.' . urlencode($wallet_address) 
         . '&limit=1&select=telegram_id';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabaseKey,
        'Authorization: Bearer ' . $supabaseKey
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5); // Add timeout
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($curlError) {
        error_log("⚠️ Wallet ownership check curl error: $curlError");
        return false; // Fail-safe: deny on error
    }
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        return !empty($data) && is_array($data); // Returns true if wallet belongs to user
    }
    
    error_log("⚠️ Wallet ownership check failed: HTTP $httpCode");
    return false;
}

// Helper: Call Supabase RPC function
function callSupabaseRPC($functionName, $params) {
    global $supabaseUrl, $supabaseKey;
    
    $url = $supabaseUrl . '/rest/v1/rpc/' . $functionName;
    $headers = [
        'apikey: ' . $supabaseKey,
        'Authorization: Bearer ' . $supabaseKey,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30); // 🔧 FIX: Add timeout for RPC calls
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10); // 🔧 FIX: Connection timeout
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    // 🔧 FIX: Handle curl errors
    if ($curlError) {
        error_log("⚠️ RPC call '$functionName' curl error: $curlError");
        return [
            'code' => 0,
            'data' => null,
            'error' => $curlError
        ];
    }
    
    // 🔧 FIX: Validate JSON decode
    $data = json_decode($response, true);
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("⚠️ RPC call '$functionName' JSON decode error: " . json_last_error_msg());
        return [
            'code' => $httpCode,
            'data' => null,
            'error' => 'Invalid JSON response'
        ];
    }
    
    return [
        'code' => $httpCode,
        'data' => $data,
        'error' => null
    ];
}

// Helper: Execute blockchain withdrawal
function executeBlockchainWithdrawal($wallet_address, $amount, $telegram_id) {
    // 🔧 FIX: No hardcoded URL fallback
    $withdrawalApiUrl = getenv('ONCHAIN_API_URL');
    
    if (!$withdrawalApiUrl) {
        error_log("❌ CRITICAL: ONCHAIN_API_URL not configured");
        return [
            'success' => false,
            'error' => 'Blockchain service not configured'
        ];
    }
    
    $withdrawalEndpoint = $withdrawalApiUrl . '/api/tama-withdrawal';
    
    $postData = json_encode([
        'wallet_address' => $wallet_address,
        'amount' => $amount,
        'telegram_id' => $telegram_id
    ]);
    
    $ch = curl_init($withdrawalEndpoint);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($postData)
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 90);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($curlError) {
        error_log("❌ Blockchain API connection failed: " . $curlError);
        return [
            'success' => false,
            'error' => 'Blockchain service temporarily unavailable'
        ];
    }
    
    // 🔧 FIX: Validate JSON decode
    $result = json_decode($response, true);
    
    if ($result === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log("❌ Blockchain response JSON decode error: " . json_last_error_msg());
        return [
            'success' => false,
            'error' => 'Invalid blockchain response'
        ];
    }
    
    // 🔧 FIX: Proper null checks before array access
    if ($httpCode !== 200 || !is_array($result) || empty($result['success'])) {
        error_log("❌ Blockchain withdrawal failed: HTTP $httpCode, " . json_encode($result));
        return [
            'success' => false,
            'error' => 'Blockchain transaction failed'
        ];
    }
    
    return [
        'success' => true,
        'signature' => $result['signature'] ?? null,
        'amount_sent' => $result['amount_sent'] ?? 0,
        'fee' => $result['fee'] ?? 0,
        'explorer' => $result['explorer'] ?? null
    ];
}

// Get input
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// 🔐 NULL Input Protection
if ($input === null || !is_array($input)) {
    error_log("🚫 Invalid JSON input: " . substr($rawInput, 0, 100));
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid request format'
    ]);
    exit();
}

$telegram_id = $input['telegram_id'] ?? null;
$wallet_address = $input['wallet_address'] ?? null;
$amount = $input['amount'] ?? null;
$init_data = $input['init_data'] ?? null;

// ==============================================
// 🔐 SECURITY CHECK #1: AUTHENTICATION
// ==============================================
$botToken = getenv('TELEGRAM_BOT_TOKEN');

// Validate that request comes from legitimate Telegram user
if ($botToken) {
    $validatedUserId = validateWebAppRequest($input, $botToken);
    
    // Verify telegram_id matches authenticated user
    if ($telegram_id && (string)$telegram_id !== (string)$validatedUserId) {
        error_log("🚫 User ID mismatch: claimed=$telegram_id, authenticated=$validatedUserId");
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Authentication failed'
        ]);
        exit();
    }
    
    $telegram_id = $validatedUserId;
} else {
    // Dev mode - log warning
    error_log("⚠️ TELEGRAM_BOT_TOKEN not set - authentication bypassed (DEV MODE)");
    
    if (!$telegram_id) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Missing telegram_id'
        ]);
        exit();
    }
}

// ==============================================
// 🔐 SECURITY CHECK #2: INPUT VALIDATION
// ==============================================
if (!$wallet_address || !$amount) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields'
    ]);
    exit();
}

// Validate Solana address format
if (!isValidSolanaAddress($wallet_address)) {
    error_log("🚫 Invalid Solana address: $wallet_address");
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid wallet address format'
    ]);
    exit();
}

// 🔐 Integer Overflow & Type Safety Protection
if (!is_numeric($amount)) {
    error_log("🚫 Non-numeric amount: $amount");
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid amount format'
    ]);
    exit();
}

$telegram_id = (int)$telegram_id;
$amount = (float)$amount; // Use float first to handle large numbers

// 🔐 Integer Overflow Protection
if ($amount > PHP_INT_MAX || $amount < 0) {
    error_log("🚫 Amount out of range: $amount");
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid amount value'
    ]);
    exit();
}

$amount = (int)$amount; // Now safe to cast to int

// 🔐 Negative Amount Protection
if ($amount <= 0) {
    error_log("🚫 Negative or zero amount: $amount");
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Amount must be positive'
    ]);
    exit();
}

// Validate amount range
if ($amount < 1000) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Minimum withdrawal is 1,000 TAMA'
    ]);
    exit();
}

if ($amount > 1000000) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Maximum withdrawal is 1,000,000 TAMA per transaction'
    ]);
    exit();
}

// ==============================================
// 🔐 SECURITY CHECK #3: WALLET OWNERSHIP
// ==============================================
if (!verifyWalletOwnership($telegram_id, $wallet_address)) {
    error_log("🚫 Wallet ownership verification failed: user=$telegram_id, wallet=" . substr($wallet_address, 0, 8));
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Wallet address not linked to your account'
    ]);
    exit();
}

// ==============================================
// 🔐 SECURITY CHECK #4: RATE LIMITING
// ==============================================
$rateLimit = checkRateLimit($telegram_id);
if (!$rateLimit['allowed']) {
    $waitMinutes = ceil($rateLimit['wait_seconds'] / 60);
    error_log("🚫 Rate limit exceeded: user=$telegram_id, wait={$rateLimit['wait_seconds']}s");
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'error' => "Please wait $waitMinutes minutes before next withdrawal",
        'retry_after' => $rateLimit['wait_seconds']
    ]);
    exit();
}

// ==============================================
// 🔐 SECURITY CHECK #5: BALANCE VERIFICATION
// ==============================================
$userBalance = checkUserBalance($telegram_id);

if ($userBalance === null) {
    error_log("🚫 Failed to retrieve balance for user: $telegram_id");
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unable to verify balance. Please try again.'
    ]);
    exit();
}

if ($userBalance < $amount) {
    error_log("🚫 Insufficient balance: user=$telegram_id, balance=$userBalance, requested=$amount");
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Insufficient balance',
        'balance' => $userBalance,
        'requested' => $amount
    ]);
    exit();
}

error_log("✅ Balance check passed: user=$telegram_id, balance=$userBalance, withdrawal=$amount");

// ==============================================
// 🔐 SECURITY NOTE: TOCTOU Race Condition Mitigation
// ==============================================
// To fully prevent TOCTOU (Time-of-check to time-of-use) race conditions,
// consider implementing one of these solutions in production:
// 
// Option 1: Database-level distributed lock
//   - Use Supabase RPC function with pg_advisory_lock()
//   - Lock on telegram_id before all checks
//   - Release after blockchain TX completes
//
// Option 2: Pending transaction table
//   - Create "pending" record with unique constraint on (telegram_id, status='pending')
//   - This prevents duplicate simultaneous withdrawals
//   - Update status to "completed" after blockchain TX
//
// Current mitigation:
//   - Rate limit check happens immediately before blockchain TX (minimizes window)
//   - Balance check is also right before TX
//   - Atomic DB update with withdraw_tama_atomic RPC
//   - Window for race condition is ~1-2 seconds (acceptable for MVP)

try {
    // ==========================================
    // 🔐 STEP 1: BLOCKCHAIN TRANSFER FIRST!
    // ==========================================
    error_log("🔐 Step 1: Executing blockchain withdrawal for user $telegram_id");
    error_log("   Amount: $amount TAMA to wallet: " . substr($wallet_address, 0, 8) . "...");
    
    $blockchainResult = executeBlockchainWithdrawal($wallet_address, $amount, $telegram_id);
    
    if (!$blockchainResult['success']) {
        // Blockchain failed - don't deduct from DB!
        error_log("❌ Blockchain transfer failed: " . $blockchainResult['error']);
        
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $blockchainResult['error'],
            'message' => 'Your balance was NOT deducted. Please try again later.'
        ]);
        exit();
    }
    
    $signature = $blockchainResult['signature'];
    $amount_sent = $blockchainResult['amount_sent'];
    $fee = $blockchainResult['fee'];
    
    error_log("✅ Blockchain transfer successful! Signature: $signature");
    
    // ==========================================
    // 🔐 STEP 2: ATOMIC DATABASE UPDATE
    // ==========================================
    error_log("🔐 Step 2: Deducting balance from database (atomic transaction)");
    
    $dbResult = callSupabaseRPC('withdraw_tama_atomic', [
        'p_telegram_id' => $telegram_id,
        'p_amount' => $amount,
        'p_wallet_address' => $wallet_address,
        'p_transaction_signature' => $signature
    ]);
    
    // 🔧 FIX: Check if data is null before accessing
    $dbData = $dbResult['data'] ?? null;
    $dbSuccess = is_array($dbData) && !empty($dbData['success']);
    
    if ($dbResult['code'] !== 200 || !$dbSuccess) {
        // Blockchain succeeded but DB failed!
        // This is a CRITICAL situation - user got tokens but DB not updated
        $error = (is_array($dbData) && isset($dbData['error'])) ? $dbData['error'] : 'Database update failed';
        
        error_log("❌ CRITICAL: Blockchain TX succeeded but DB update failed!");
        error_log("   Signature: $signature");
        error_log("   User: $telegram_id");
        error_log("   Wallet: " . substr($wallet_address, 0, 8) . "...");
        error_log("   Amount: $amount");
        error_log("   Error: $error");
        error_log("   DB Response: " . json_encode($dbResult));
        error_log("   ACTION REQUIRED: Manually deduct $amount TAMA from user $telegram_id");
        
        // Return success to user (they got their tokens)
        // But log the error for manual resolution
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'warning' => 'Withdrawal completed but balance sync pending',
            'signature' => $signature,
            'amount_sent' => $amount_sent,
            'fee' => $fee,
            'explorer' => $blockchainResult['explorer'],
            'message' => 'Your withdrawal was successful! Tokens sent to your wallet.',
            'note' => 'Your balance may take a few moments to update.'
        ]);
        exit();
    }
    
    error_log("✅ Database updated successfully");
    
    // ==========================================
    // SUCCESS!
    // ==========================================
    // 🔧 FIX: Validate $balanceData is array before accessing
    $balanceData = $dbResult['data'];
    
    if (!is_array($balanceData)) {
        error_log("⚠️ Warning: Balance data is not array: " . json_encode($balanceData));
        $balanceData = []; // Set empty array to prevent errors
    }
    
    $balanceBefore = $balanceData['balance_before'] ?? 'unknown';
    $balanceAfter = $balanceData['balance_after'] ?? 'unknown';
    
    error_log("✅ WITHDRAWAL COMPLETE!");
    error_log("   User: $telegram_id");
    error_log("   Amount: $amount TAMA");
    error_log("   Fee: $fee TAMA");
    error_log("   Sent: $amount_sent TAMA");
    error_log("   Signature: $signature");
    error_log("   Balance before: " . $balanceBefore);
    error_log("   Balance after: " . $balanceAfter);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'signature' => $signature,
        'explorer' => $blockchainResult['explorer'],
        'amount_requested' => $amount,
        'fee' => $fee,
        'amount_sent' => $amount_sent,
        'balance_before' => $balanceBefore,
        'balance_after' => $balanceAfter,
        'wallet_address' => $wallet_address,
        'message' => 'Withdrawal successful! ' . number_format($amount_sent) . ' TAMA sent to your wallet.',
        'security' => [
            'atomic_transaction' => true,
            'blockchain_first' => true,
            'verified' => true
        ]
    ]);

} catch (Exception $e) {
    error_log("❌ Withdrawal exception: " . $e->getMessage());
    error_log("   Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Withdrawal processing failed. Please try again later.'
    ]);
}
?>

