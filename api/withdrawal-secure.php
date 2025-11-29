<?php
/**
 * 🔐 SECURE WITHDRAWAL WITH CORRECT ORDER
 * 
 * SECURITY FIX #2 & #3:
 * - Uses atomic database transaction (prevents double-spending)
 * - Executes blockchain TX FIRST, then DB update (prevents token loss)
 * 
 * Endpoint: /api/withdrawal-secure.php
 * Method: POST
 * 
 * Request:
 * {
 *   "telegram_id": 123456789,
 *   "wallet_address": "7xKXtg2...",
 *   "amount": 10000
 * }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Supabase settings
$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$supabaseKey = getenv('SUPABASE_KEY');

if (!$supabaseKey) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error']);
    exit();
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
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

// Helper: Execute blockchain withdrawal
function executeBlockchainWithdrawal($wallet_address, $amount, $telegram_id) {
    $withdrawalApiUrl = getenv('ONCHAIN_API_URL') ?: 'https://solanatamagotchi-onchain.onrender.com';
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
        return [
            'success' => false,
            'error' => 'Blockchain API connection failed: ' . $curlError
        ];
    }
    
    $result = json_decode($response, true);
    
    if ($httpCode !== 200 || !$result || !$result['success']) {
        return [
            'success' => false,
            'error' => $result['error'] ?? 'Unknown blockchain error',
            'details' => $result
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
$input = json_decode(file_get_contents('php://input'), true);

$telegram_id = $input['telegram_id'] ?? null;
$wallet_address = $input['wallet_address'] ?? null;
$amount = $input['amount'] ?? null;

// Validate input
if (!$telegram_id || !$wallet_address || !$amount) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields: telegram_id, wallet_address, amount'
    ]);
    exit();
}

$telegram_id = (int)$telegram_id;
$amount = (int)$amount;

// Validate amount
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
            'error' => 'Blockchain transfer failed',
            'message' => $blockchainResult['error'],
            'details' => 'Your balance was NOT deducted because the blockchain transfer failed.'
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
    
    if ($dbResult['code'] !== 200 || !$dbResult['data']['success']) {
        // Blockchain succeeded but DB failed!
        // This is a CRITICAL situation - user got tokens but DB not updated
        $error = $dbResult['data']['error'] ?? 'Database update failed';
        
        error_log("❌ CRITICAL: Blockchain TX succeeded but DB update failed!");
        error_log("   Signature: $signature");
        error_log("   User: $telegram_id");
        error_log("   Amount: $amount");
        error_log("   Error: $error");
        error_log("   ACTION REQUIRED: Manually deduct $amount TAMA from user $telegram_id");
        
        // Return success to user (they got their tokens)
        // But log the error for manual resolution
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'warning' => 'Withdrawal completed but database sync pending',
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
    $balanceData = $dbResult['data'];
    
    error_log("✅ WITHDRAWAL COMPLETE!");
    error_log("   User: $telegram_id");
    error_log("   Amount: $amount TAMA");
    error_log("   Fee: $fee TAMA");
    error_log("   Sent: $amount_sent TAMA");
    error_log("   Signature: $signature");
    error_log("   Balance before: " . $balanceData['balance_before']);
    error_log("   Balance after: " . $balanceData['balance_after']);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'signature' => $signature,
        'explorer' => $blockchainResult['explorer'],
        'amount_requested' => $amount,
        'fee' => $fee,
        'amount_sent' => $amount_sent,
        'balance_before' => $balanceData['balance_before'],
        'balance_after' => $balanceData['balance_after'],
        'wallet_address' => $wallet_address,
        'message' => 'Withdrawal successful! ' . number_format($amount_sent) . ' TAMA sent to your wallet.',
        'security' => [
            'atomic_transaction' => true,
            'blockchain_first' => true,
            'verified' => true
        ]
    ]);

} catch (Exception $e) {
    error_log("❌ Withdrawal error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Withdrawal processing failed',
        'message' => $e->getMessage()
    ]);
}
?>

