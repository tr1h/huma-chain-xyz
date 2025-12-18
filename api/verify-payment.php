<?php
/**
 * 🔐 SOLANA PAYMENT VERIFICATION
 * Verifies on-chain transactions before minting NFTs
 *
 * SECURITY FIX #1: NFT Payment Verification
 * Fixed by @Developer following @QA-Tester audit
 * Date: 2025-12-17
 */

// Error handling configuration
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load error handlers
require_once __DIR__ . '/helpers/error-handlers.php';

/**
 * Verify a Solana transaction on-chain
 *
 * @param string $signature Transaction signature
 * @param string $expectedSender Expected sender wallet address
 * @param string $expectedRecipient Expected recipient wallet address
 * @param float $expectedAmount Expected amount in SOL
 * @return array Verification result
 * @throws Exception on validation errors
 */
function verifySolanaTransaction($signature, $expectedSender, $expectedRecipient, $expectedAmount) {
    // Validate inputs
    if (empty($signature) || empty($expectedSender) || empty($expectedRecipient)) {
        throw new Exception('Missing required parameters');
    }

    if (!isValidSolanaAddress($expectedSender)) {
        throw new Exception('Invalid sender address format');
    }

    if (!isValidSolanaAddress($expectedRecipient)) {
        throw new Exception('Invalid recipient address format');
    }

    if ($expectedAmount <= 0) {
        throw new Exception('Invalid amount');
    }

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

    try {
        $rpcResponse = safeCurl($rpcUrl, [
            'method' => 'POST',
            'body' => safeJsonEncode($requestData),
            'headers' => ['Content-Type: application/json'],
            'timeout' => 30
        ]);

        if ($rpcResponse['code'] !== 200) {
            throw new Exception('RPC request failed with HTTP ' . $rpcResponse['code']);
        }

        $result = safeJsonDecode($rpcResponse['body']);

        // Check if transaction exists
        if (!isset($result['result']) || $result['result'] === null) {
            return [
                'verified' => false,
                'error' => 'Transaction not found on blockchain',
                'signature' => $signature
            ];
        }

        $txData = $result['result'];

        // Validate transaction structure
        if (!is_array($txData) || !isset($txData['meta']) || !isset($txData['transaction'])) {
            throw new Exception('Invalid transaction data structure');
        }

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
        $accountKeys = safeArrayGet($txData, 'transaction', [])['message']['accountKeys'] ?? [];
        $preBalances = safeArrayGet($txData, 'meta', [])['preBalances'] ?? [];
        $postBalances = safeArrayGet($txData, 'meta', [])['postBalances'] ?? [];

        if (!is_array($accountKeys) || !is_array($preBalances) || !is_array($postBalances)) {
            throw new Exception('Invalid transaction balance data');
        }

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

    } catch (Exception $e) {
        error_log("❌ Payment verification error: " . $e->getMessage());
        return [
            'verified' => false,
            'error' => 'Verification failed: ' . $e->getMessage()
        ];
    }
}

// Main API endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Read and validate input
        $input = getJsonInput(['signature', 'sender', 'recipient', 'amount']);

        $signature = $input['signature'];
        $sender = $input['sender'];
        $recipient = $input['recipient'];
        $amount = (float)$input['amount'];

        // 🔐 SECURITY CHECK: Prevent Replay Attacks (Duplicate Signatures)
        // Check if this signature has already been used in transactions table
        $supabaseUrl = getenv('SUPABASE_URL');
        $supabaseKey = getenv('SUPABASE_KEY');

        if ($supabaseUrl && $supabaseKey) {
            // Check in metadata ->> onchain_signature
            $checkUrl = "{$supabaseUrl}/rest/v1/transactions?metadata->>onchain_signature=eq.{$signature}&select=id";
            $ch = curl_init($checkUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "apikey: {$supabaseKey}",
                "Authorization: Bearer {$supabaseKey}"
            ]);
            $checkResponse = curl_exec($ch);
            $checkCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($checkCode === 200) {
                $existingTx = json_decode($checkResponse, true);
                if (!empty($existingTx)) {
                    sendErrorResponse('Transaction signature already processed', 400, [
                        'signature' => $signature,
                        'reason' => 'replay_attack_detected'
                    ]);
                }
            }
        }

        // Verify transaction
        $verification = verifySolanaTransaction($signature, $sender, $recipient, $amount);

        if ($verification['verified']) {
            sendSuccessResponse([
                'verified' => true,
                'data' => $verification
            ]);
        } else {
            sendErrorResponse(
                $verification['error'] ?? 'Verification failed',
                400,
                ['details' => $verification]
            );
        }

    } catch (Exception $e) {
        logError('Payment verification request failed', $e, [
            'signature' => $signature ?? null,
            'sender' => $sender ?? null
        ]);

        sendErrorResponse(
            'Payment verification failed. Please try again.',
            500,
            ['details' => $e->getMessage()]
        );
    }
} else {
    sendErrorResponse('Method not allowed. Use POST.', 405);
}
?>

