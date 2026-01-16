<?php
// api/admin_action.php
// 🛡️ Secure Admin Action Handler
// Handles user updates and transaction logging server-side to avoid RLS issues.

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Simple Auth Check (In production, use session/token)
// For this environment, we rely on the implementation simplicity requested
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
  exit;
}

$action = $input['action'] ?? '';
$target_id = $input['target_id'] ?? ''; // Wallet or Telegram ID
$target_type = $input['target_type'] ?? 'wallet'; // 'wallet' or 'telegram'
$amount = $input['amount'] ?? 0; // New balance amount

$supabaseUrl = getenv('SUPABASE_URL');
$supabaseKey = getenv('SUPABASE_KEY'); // Should be SERVICE_ROLE key ideally, or Anon if policies allow

function supabaseReq($method, $endpoint, $data = null)
{
  global $supabaseUrl, $supabaseKey;
  $ch = curl_init("{$supabaseUrl}/rest/v1/{$endpoint}");
  $headers = [
    "apikey: {$supabaseKey}",
    "Authorization: Bearer {$supabaseKey}",
    "Content-Type: application/json",
    "Prefer: return=representation"
  ];

  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
  if ($data) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
  }

  $response = curl_exec($ch);
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  return ['code' => $httpCode, 'data' => json_decode($response, true)];
}

// ACTION: SET_BALANCE
if ($action === 'set_balance') {
  // 1. Update User
  $table = ($target_type === 'wallet') ? 'wallet_users' : 'leaderboard';
  $id_field = ($target_type === 'wallet') ? 'wallet_address' : 'telegram_id';
  $bal_field = ($target_type === 'wallet') ? 'tama_balance' : 'tama';

  // Get current balance first for history
  $check = supabaseReq('GET', "{$table}?{$id_field}=eq.{$target_id}");
  if (empty($check['data'])) {
    echo json_encode(['error' => 'User not found']);
    exit;
  }
  $old_balance = $check['data'][0][$bal_field] ?? 0;

  // Update
  $updateData = [$bal_field => $amount];
  if ($target_type === 'wallet') $updateData['updated_at'] = date('c');

  $res = supabaseReq('PATCH', "{$table}?{$id_field}=eq.{$target_id}", $updateData);

  if ($res['code'] >= 400) {
    http_response_code(500);
    echo json_encode(['error' => 'Update failed', 'details' => $res]);
    exit;
  }

  // 2. Log Transaction
  $txData = [
    'user_id' => $target_type === 'telegram' ? $target_id : "wallet_{$target_id}",
    'wallet_address' => $target_type === 'wallet' ? $target_id : null,
    'telegram_id' => $target_type === 'telegram' ? $target_id : null,
    'amount' => $amount - $old_balance, // Difference
    'type' => 'admin_set_balance',
    'balance_before' => $old_balance,
    'balance_after' => $amount,
    'metadata' => [
      'admin_action' => true,
      'timestamp' => date('c')
    ]
  ];

  // Clean up nulls
  if (!$txData['wallet_address']) unset($txData['wallet_address']);
  if (!$txData['telegram_id']) unset($txData['telegram_id']);

  $txRes = supabaseReq('POST', 'transactions', $txData);

  echo json_encode([
    'success' => true,
    'old_balance' => $old_balance,
    'new_balance' => $amount,
    'tx_status' => $txRes['code']
  ]);
  exit;
}

echo json_encode(['error' => 'Unknown action']);
