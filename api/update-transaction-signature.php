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

// Supabase configuration
$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$supabaseServiceKey = getenv('SUPABASE_SERVICE_KEY');

if (!$supabaseServiceKey) {
    error_log("❌ SUPABASE_SERVICE_KEY not set!");
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error']);
    exit;
}

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
    $ch = curl_init("{$supabaseUrl}/rest/v1/transactions?id=eq.{$transactionId}&select=*");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "apikey: {$supabaseServiceKey}",
        "Authorization: Bearer {$supabaseServiceKey}",
        "Content-Type: application/json"
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        throw new Exception("Failed to fetch transaction: HTTP {$httpCode}");
    }
    
    $transactions = json_decode($response, true);
    if (!$transactions || count($transactions) === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Transaction not found']);
        exit;
    }
    
    $tx = $transactions[0];
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
    $ch = curl_init("{$supabaseUrl}/rest/v1/transactions?id=eq.{$transactionId}");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['metadata' => $updatedMetadata]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "apikey: {$supabaseServiceKey}",
        "Authorization: Bearer {$supabaseServiceKey}",
        "Content-Type: application/json",
        "Prefer: return=representation"
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200 && $httpCode !== 204) {
        throw new Exception("Failed to update transaction: HTTP {$httpCode}");
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

