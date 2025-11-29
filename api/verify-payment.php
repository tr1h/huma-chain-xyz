<?php
/**
 * 🔐 SOLANA PAYMENT VERIFICATION
 * Verifies on-chain transactions before minting NFTs
 * 
 * SECURITY FIX #1: NFT Payment Verification
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Verify a Solana transaction on-chain
 * 
 * @param string $signature Transaction signature
 * @param string $expectedSender Expected sender wallet address
 * @param string $expectedRecipient Expected recipient wallet address
 * @param float $expectedAmount Expected amount in SOL
 * @return array Verification result
 */
function verifySolanaTransaction($signature, $expectedSender, $expectedRecipient, $expectedAmount) {
    $rpcUrl = getenv('SOLANA_RPC_URL') ?: 'https://api.devnet.solana.com';
    
    // RPC request to get transaction details
    $requestData = [
        'jsonrpc' => '2.0',
        'id' => 1,
        'method' => 'getTransaction',
        'params' => [
            $signature,
            [
                'encoding' => 'json',
                'maxSupportedTransactionVersion' => 0
            ]
        ]
    ];
    
    $ch = curl_init($rpcUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($curlError) {
        return [
            'verified' => false,
            'error' => 'RPC connection failed: ' . $curlError
        ];
    }
    
    if ($httpCode !== 200) {
        return [
            'verified' => false,
            'error' => 'RPC request failed with HTTP ' . $httpCode
        ];
    }
    
    $result = json_decode($response, true);
    
    // Check if transaction exists
    if (!isset($result['result']) || $result['result'] === null) {
        return [
            'verified' => false,
            'error' => 'Transaction not found on blockchain',
            'signature' => $signature
        ];
    }
    
    $txData = $result['result'];
    
    // Check if transaction was successful
    if (isset($txData['meta']['err']) && $txData['meta']['err'] !== null) {
        return [
            'verified' => false,
            'error' => 'Transaction failed on blockchain',
            'signature' => $signature,
            'blockchain_error' => $txData['meta']['err']
        ];
    }
    
    // Extract account keys and transaction details
    $accountKeys = $txData['transaction']['message']['accountKeys'] ?? [];
    $preBalances = $txData['meta']['preBalances'] ?? [];
    $postBalances = $txData['meta']['postBalances'] ?? [];
    
    // Find sender and recipient indices
    $senderIndex = -1;
    $recipientIndex = -1;
    
    foreach ($accountKeys as $index => $account) {
        if ($account === $expectedSender) {
            $senderIndex = $index;
        }
        if ($account === $expectedRecipient) {
            $recipientIndex = $index;
        }
    }
    
    if ($senderIndex === -1) {
        return [
            'verified' => false,
            'error' => 'Expected sender not found in transaction',
            'expected_sender' => $expectedSender,
            'actual_accounts' => $accountKeys
        ];
    }
    
    if ($recipientIndex === -1) {
        return [
            'verified' => false,
            'error' => 'Expected recipient not found in transaction',
            'expected_recipient' => $expectedRecipient,
            'actual_accounts' => $accountKeys
        ];
    }
    
    // Calculate transferred amount (in lamports, 1 SOL = 1,000,000,000 lamports)
    $senderBalanceBefore = $preBalances[$senderIndex] ?? 0;
    $senderBalanceAfter = $postBalances[$senderIndex] ?? 0;
    $recipientBalanceBefore = $preBalances[$recipientIndex] ?? 0;
    $recipientBalanceAfter = $postBalances[$recipientIndex] ?? 0;
    
    $senderDecrease = $senderBalanceBefore - $senderBalanceAfter;
    $recipientIncrease = $recipientBalanceAfter - $recipientBalanceBefore;
    
    // Convert to SOL
    $actualAmountSent = $senderDecrease / 1000000000;
    $actualAmountReceived = $recipientIncrease / 1000000000;
    
    // Verify amount (allow small tolerance for transaction fees)
    $tolerance = 0.01; // 0.01 SOL tolerance
    
    if ($actualAmountReceived < ($expectedAmount - $tolerance)) {
        return [
            'verified' => false,
            'error' => 'Payment amount mismatch',
            'expected_amount' => $expectedAmount,
            'actual_amount_received' => $actualAmountReceived,
            'actual_amount_sent' => $actualAmountSent
        ];
    }
    
    // Get block time for timestamp
    $blockTime = $txData['blockTime'] ?? null;
    $slot = $txData['slot'] ?? null;
    
    // SUCCESS! Transaction verified
    return [
        'verified' => true,
        'signature' => $signature,
        'sender' => $expectedSender,
        'recipient' => $expectedRecipient,
        'amount_sent' => $actualAmountSent,
        'amount_received' => $actualAmountReceived,
        'expected_amount' => $expectedAmount,
        'block_time' => $blockTime,
        'slot' => $slot,
        'timestamp' => date('Y-m-d H:i:s', $blockTime ?? time())
    ];
}

// Main API endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $signature = $input['signature'] ?? null;
    $sender = $input['sender'] ?? null;
    $recipient = $input['recipient'] ?? null;
    $amount = $input['amount'] ?? null;
    
    // Validate input
    if (!$signature || !$sender || !$recipient || !$amount) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Missing required fields: signature, sender, recipient, amount'
        ]);
        exit();
    }
    
    // Verify transaction
    $verification = verifySolanaTransaction($signature, $sender, $recipient, (float)$amount);
    
    if ($verification['verified']) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'verified' => true,
            'data' => $verification
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'verified' => false,
            'error' => $verification['error'] ?? 'Verification failed',
            'details' => $verification
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed. Use POST.'
    ]);
}
?>

