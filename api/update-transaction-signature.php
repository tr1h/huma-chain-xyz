<?php
/**
 * Update Transaction Signature
 * 
 * Updates transaction metadata with onchain_signature
 * Uses service-side Supabase client with full permissions
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Load environment
require_once __DIR__ . '/config/supabase.php';

// Get request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Validate required fields
$transactionId = $data['transaction_id'] ?? null;
$signature = $data['signature'] ?? null;
$explorer = $data['explorer'] ?? null;

if (!$transactionId || !$signature) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing transaction_id or signature']);
    exit;
}

try {
    // Get current transaction to preserve existing metadata
    $currentTx = supabaseQuery('transactions', 'GET', null, "id=eq.{$transactionId}");
    
    if (!$currentTx || count($currentTx) === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Transaction not found']);
        exit;
    }
    
    $tx = $currentTx[0];
    $existingMetadata = $tx['metadata'] ?? [];
    
    // If metadata is JSON string, parse it
    if (is_string($existingMetadata)) {
        $existingMetadata = json_decode($existingMetadata, true) ?? [];
    }
    
    // Merge with new signature
    $updatedMetadata = array_merge($existingMetadata, [
        'onchain_signature' => $signature,
        'explorer' => $explorer,
        'updated_at' => date('c')
    ]);
    
    // Update transaction
    $result = supabaseQuery('transactions', 'PATCH', [
        'metadata' => $updatedMetadata
    ], "id=eq.{$transactionId}");
    
    if ($result === false) {
        throw new Exception('Failed to update transaction');
    }
    
    error_log("✅ Updated transaction {$transactionId} with signature: {$signature}");
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'transaction_id' => $transactionId,
        'signature' => $signature,
        'metadata' => $updatedMetadata
    ]);
    
} catch (Exception $e) {
    error_log("❌ Error updating transaction signature: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to update transaction',
        'message' => $e->getMessage()
    ]);
}

