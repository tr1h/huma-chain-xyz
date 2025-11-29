<?php
/**
 * 🔐 SECURE NFT Mint with Payment Verification
 * 
 * SECURITY FIX #1: Verifies payment on-chain BEFORE minting NFT
 * 
 * Endpoint: /api/mint-nft-sol-verified.php
 * Method: POST
 * 
 * Request Body:
 * {
 *   "telegram_id": 123456789,
 *   "wallet_address": "ABC123...",
 *   "tier": "Silver",
 *   "price_sol": 1.5,
 *   "transaction_signature": "5Kq..." // REQUIRED - will be verified on-chain
 * }
 */

// CORS Configuration
$allowedOrigins = [
    'https://tr1h.github.io',
    'https://solanatamagotchi.com',
    'http://localhost',
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Import verification function
require_once __DIR__ . '/verify-payment.php';

// Supabase settings
$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$supabaseKey = getenv('SUPABASE_KEY');

if (!$supabaseKey) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error']);
    exit();
}

// Helper function
function supabaseQuery($endpoint, $method = 'GET', $data = null, $filters = '') {
    global $supabaseUrl, $supabaseKey;
    
    $url = $supabaseUrl . '/rest/v1/' . $endpoint . $filters;
    $headers = [
        'apikey: ' . $supabaseKey,
        'Authorization: Bearer ' . $supabaseKey,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['code' => $httpCode, 'data' => json_decode($response, true)];
}

// Treasury wallets
define('TREASURY_MAIN', getenv('TREASURY_MAIN') ?: '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM');
define('TREASURY_LIQUIDITY', getenv('TREASURY_LIQUIDITY') ?: 'CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1');
define('TREASURY_TEAM', getenv('TREASURY_TEAM') ?: 'Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8');

// Get input
$input = json_decode(file_get_contents('php://input'), true);
$telegram_id = isset($input['telegram_id']) ? intval($input['telegram_id']) : null;
$wallet_address = isset($input['wallet_address']) ? trim($input['wallet_address']) : null;
$tier = isset($input['tier']) ? trim($input['tier']) : null;
$price_sol = isset($input['price_sol']) ? floatval($input['price_sol']) : null;
$transaction_signature = isset($input['transaction_signature']) ? trim($input['transaction_signature']) : null;

// Validate input
if (!$telegram_id || !$wallet_address || !$tier || !$price_sol) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

// 🔐 SECURITY FIX: Require transaction signature
if (!$transaction_signature) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Transaction signature required for NFT minting',
        'message' => 'You must complete the payment transaction before minting'
    ]);
    exit();
}

// Validate tier
$valid_tiers = ['Silver', 'Gold', 'Platinum', 'Diamond'];
if (!in_array($tier, $valid_tiers)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid tier']);
    exit();
}

$tier_boosts = [
    'Silver' => 2.3,
    'Gold' => 2.7,
    'Platinum' => 3.5,
    'Diamond' => 5.0
];

try {
    // ==========================================
    // 🔐 STEP 1: VERIFY PAYMENT ON-CHAIN
    // ==========================================
    error_log("🔐 Verifying payment for $tier NFT: $transaction_signature");
    
    $verification = verifySolanaTransaction(
        $transaction_signature,
        $wallet_address,        // sender (user)
        TREASURY_MAIN,          // recipient (treasury)
        $price_sol              // expected amount
    );
    
    if (!$verification['verified']) {
        error_log("❌ Payment verification failed: " . ($verification['error'] ?? 'Unknown error'));
        
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Payment verification failed',
            'message' => $verification['error'] ?? 'Transaction not found or invalid',
            'details' => [
                'signature' => $transaction_signature,
                'expected_sender' => $wallet_address,
                'expected_recipient' => TREASURY_MAIN,
                'expected_amount' => $price_sol
            ]
        ]);
        exit();
    }
    
    error_log("✅ Payment verified: " . $verification['amount_received'] . " SOL received");
    
    // ==========================================
    // STEP 2: Check if signature already used (prevent replay attacks)
    // ==========================================
    $existingNFT = supabaseQuery('user_nfts', 'GET', null, '?transaction_signature=eq.' . urlencode($transaction_signature));
    
    if ($existingNFT['code'] === 200 && !empty($existingNFT['data'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Transaction already used',
            'message' => 'This payment has already been used to mint an NFT'
        ]);
        exit();
    }
    
    // ==========================================
    // STEP 3: Get bonding state
    // ==========================================
    $bonding = supabaseQuery('nft_bonding_state', 'GET', null, '?tier_name=eq.' . $tier . '&is_active=eq.true');
    
    if ($bonding['code'] !== 200 || empty($bonding['data'])) {
        throw new Exception('Tier not found or inactive');
    }
    
    $bondingData = $bonding['data'][0];
    $current_price = floatval($bondingData['current_price'] ?? 0);
    $minted_count = intval($bondingData['minted_count'] ?? 0);
    $max_supply = intval($bondingData['max_supply'] ?? 0);
    $increment = floatval($bondingData['increment_per_mint'] ?? 0);
    
    if ($minted_count >= $max_supply) {
        throw new Exception("$tier tier sold out!");
    }
    
    // Verify price matches (allow small tolerance)
    if (abs($price_sol - $current_price) > 0.01) {
        throw new Exception("Price mismatch! Current: $current_price SOL, Paid: $price_sol SOL");
    }
    
    // ==========================================
    // STEP 4: Get random design
    // ==========================================
    $designs = supabaseQuery('nft_designs', 'GET', null, '?tier_name=eq.' . $tier . '&is_minted=eq.false&limit=100');
    
    if ($designs['code'] !== 200 || empty($designs['data'])) {
        throw new Exception("No $tier NFTs left!");
    }
    
    $randomDesign = $designs['data'][array_rand($designs['data'])];
    $design_id = intval($randomDesign['id']);
    $design_number = intval($randomDesign['design_number']);
    
    // ==========================================
    // STEP 5: Mark design as minted
    // ==========================================
    $updateDesign = supabaseQuery(
        'nft_designs',
        'PATCH',
        ['is_minted' => true, 'minted_by' => $telegram_id],
        '?id=eq.' . $design_id
    );
    
    if ($updateDesign['code'] < 200 || $updateDesign['code'] >= 300) {
        throw new Exception('Failed to mark design as minted');
    }
    
    // ==========================================
    // STEP 6: Create NFT record
    // ==========================================
    $boost = $tier_boosts[$tier];
    $nftData = [
        'telegram_id' => $telegram_id,
        'nft_design_id' => $design_id,
        'tier_name' => $tier,
        'earning_multiplier' => $boost,
        'purchase_price_sol' => $price_sol,
        'wallet_address' => $wallet_address,
        'transaction_signature' => $transaction_signature, // Store signature to prevent replay
        'is_active' => true
    ];
    
    $createNFT = supabaseQuery('user_nfts', 'POST', $nftData);
    
    if ($createNFT['code'] < 200 || $createNFT['code'] >= 300) {
        throw new Exception('Failed to create NFT record');
    }
    
    $user_nft_id = $createNFT['data'][0]['id'] ?? null;
    
    // ==========================================
    // STEP 7: Update bonding curve
    // ==========================================
    $new_price = $current_price + $increment;
    $updateBonding = supabaseQuery(
        'nft_bonding_state',
        'PATCH',
        [
            'current_price' => $new_price,
            'minted_count' => $minted_count + 1
        ],
        '?tier_name=eq.' . $tier
    );
    
    // ==========================================
    // SUCCESS!
    // ==========================================
    error_log("✅ NFT minted successfully: $tier #$design_number for user $telegram_id");
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'tier' => $tier,
        'design_id' => $design_id,
        'design_number' => $design_number,
        'boost' => $boost,
        'price_sol' => $price_sol,
        'new_price' => $new_price,
        'user_nft_id' => $user_nft_id,
        'transaction_signature' => $transaction_signature,
        'verification' => [
            'verified' => true,
            'amount_received' => $verification['amount_received'],
            'block_time' => $verification['block_time'] ?? null
        ],
        'message' => "$tier NFT minted successfully!"
    ]);

} catch (Exception $e) {
    error_log("❌ NFT mint error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

