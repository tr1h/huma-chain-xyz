<?php
/**
 * 🔐 TAMA Transfer API (PROXY TO NODE.JS)
 * Executes SPL token transfers via secure Node.js on-chain API
 *
 * SECURITY UPDATES:
 * - Removed shell_exec (prevents RCE)
 * - Removed temporary keypair files (prevents key leakage)
 * - Proxying to secure Node.js environment
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

try {
    // Read and validate request
    $data = getJsonInput(['amount', 'distributions']);

    $amount = intval($data['amount']);
    $distributions = $data['distributions'];

    if (!is_array($distributions) || empty($distributions)) {
        throw new Exception('Invalid distributions array');
    }

    // 🔐 Get Node.js API URL from environment
    $onchainApiUrl = getenv('ONCHAIN_API_URL') ?: 'http://localhost:3001';
    $endpoint = $onchainApiUrl . '/api/tama-transfer';

    error_log("🚀 Proxying TAMA transfer request to: $endpoint");

    // Prepare proxy request
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'amount' => $amount,
        'distributions' => $distributions
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120); // Solana can be slow

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        throw new Exception("Node.js API connection failed: $curlError");
    }

    $result = json_decode($response, true);

    if ($httpCode !== 200 || !$result || empty($result['success'])) {
        $errorMsg = $result['error'] ?? 'Unknown error from on-chain API';
        throw new Exception("On-chain API error: $errorMsg");
    }

    // Return success response from Node.js
    sendSuccessResponse($result);

} catch (Exception $e) {
    logError('TAMA Transfer Proxy failed', $e);

    sendErrorResponse(
        'Transfer failed. ' . $e->getMessage(),
        500
    );
}
?>
