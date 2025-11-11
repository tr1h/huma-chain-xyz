<?php
/**
 * Mint SOL NFT (Silver, Gold, Platinum, Diamond)
 * 
 * Endpoint: /api/mint-nft-sol.php
 * Method: POST
 * 
 * Request Body:
 * {
 *   "telegram_id": 123456789,
 *   "wallet_address": "ABC123...",
 *   "tier": "Silver",
 *   "price_sol": 1.5
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "tier": "Silver",
 *   "design_number": 42,
 *   "boost": 2.3,
 *   "price_sol": 1.5,
 *   "new_price": 1.506,
 *   "message": "Silver NFT minted successfully!"
 * }
 */

// CORS Configuration - MUST BE FIRST
$allowedOrigins = [
    'https://tr1h.github.io',
    'http://localhost',
    'http://localhost:3000',
    'http://127.0.0.1'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';

// Extract origin from referer if needed
if (!$origin && isset($_SERVER['HTTP_REFERER'])) {
    $parsed = parse_url($_SERVER['HTTP_REFERER']);
    $origin = $parsed['scheme'] . '://' . $parsed['host'];
}

// If origin is in allowed list, send it back; otherwise send *
if ($origin && in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    header('Content-Length: 0');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Supabase REST API Settings (NO DATABASE PASSWORD NEEDED!)
$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$supabaseKey = getenv('SUPABASE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU';

// Helper function for Supabase REST API
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

// Import treasury constants
if (!defined('TREASURY_MAIN')) {
    define('TREASURY_MAIN', getenv('TREASURY_MAIN') ?: '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM');
}
if (!defined('TREASURY_LIQUIDITY')) {
    define('TREASURY_LIQUIDITY', getenv('TREASURY_LIQUIDITY') ?: 'CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1');
}
if (!defined('TREASURY_TEAM')) {
    define('TREASURY_TEAM', getenv('TREASURY_TEAM') ?: 'Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8');
}

// Get request body
$input = json_decode(file_get_contents('php://input'), true);
$telegram_id = isset($input['telegram_id']) ? intval($input['telegram_id']) : null;
$wallet_address = isset($input['wallet_address']) ? trim($input['wallet_address']) : null;
$tier = isset($input['tier']) ? trim($input['tier']) : null;
$price_sol = isset($input['price_sol']) ? floatval($input['price_sol']) : null;

// Validate input
if (!$telegram_id || !$wallet_address || !$tier || !$price_sol) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: telegram_id, wallet_address, tier, price_sol']);
    exit();
}

// Validate tier
$valid_tiers = ['Silver', 'Gold', 'Platinum', 'Diamond'];
if (!in_array($tier, $valid_tiers)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid tier. Must be: Silver, Gold, Platinum, Diamond']);
    exit();
}

// Tier boost mapping
$tier_boosts = [
    'Silver' => 2.3,
    'Gold' => 2.7,
    'Platinum' => 3.5,
    'Diamond' => 5.0
];

try {
    // ==========================================
    // STEP 1: Get current bonding state
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
    
    // Check if supply exhausted
    if ($minted_count >= $max_supply) {
        throw new Exception("$tier tier sold out! All $max_supply have been minted.");
    }
    
    // Verify price (allow small tolerance for floating point)
    if (abs($price_sol - $current_price) > 0.01) {
        throw new Exception("Price mismatch! Current price: $current_price SOL, your price: $price_sol SOL. Please refresh and try again.");
    }
    
    // ==========================================
    // STEP 2: Get random unminted design
    // ==========================================
    $designs = supabaseQuery('nft_designs', 'GET', null, '?tier_name=eq.' . $tier . '&is_minted=eq.false&limit=100');
    
    if ($designs['code'] !== 200 || empty($designs['data'])) {
        throw new Exception("No $tier NFTs left! All have been minted.");
    }
    
    $randomDesign = $designs['data'][array_rand($designs['data'])];
    $design_id = intval($randomDesign['id']);
    $design_number = intval($randomDesign['design_number']);
    $design_theme = $randomDesign['design_theme'];
    $design_variant = $randomDesign['design_variant'];
    $image_url = $randomDesign['image_url'] ?: "https://placeholder.com/$tier.png";
    $metadata_url = $randomDesign['metadata_url'] ?: '';
    
    // ==========================================
    // STEP 3: Mark design as minted
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
    // STEP 4: Create user NFT record
    // ==========================================
    $boost = $tier_boosts[$tier];
    $nftData = [
        'telegram_id' => $telegram_id,
        'nft_design_id' => $design_id,
        'tier_name' => $tier,
        'earning_multiplier' => $boost,
        'purchase_price_sol' => $price_sol,
        'is_active' => true
    ];
    
    $createNFT = supabaseQuery('user_nfts', 'POST', $nftData);
    
    if ($createNFT['code'] < 200 || $createNFT['code'] >= 300) {
        throw new Exception('Failed to create user NFT record');
    }
    
    $user_nft_id = $createNFT['data'][0]['id'] ?? null;
    
    // ==========================================
    // STEP 5: Update bonding curve price
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
    
    if ($updateBonding['code'] < 200 || $updateBonding['code'] >= 300) {
        throw new Exception('Failed to update bonding curve');
    }

    // ==========================================
    // STEP 6: Process SOL payment distribution
    // ==========================================
    // Get transaction signature if provided (from frontend wallet payment)
    $transaction_signature = isset($input['transaction_signature']) ? trim($input['transaction_signature']) : null;
    
    // If transaction signature provided, log distribution
    if ($transaction_signature) {
        try {
            // Distribution percentages
            $distribution = [
                'main' => 0.50,      // 50%
                'liquidity' => 0.30, // 30%
                'team' => 0.20       // 20%
            ];
            
            // Calculate amounts
            $amounts = [
                'main' => $price_sol * $distribution['main'],
                'liquidity' => $price_sol * $distribution['liquidity'],
                'team' => $price_sol * $distribution['team']
            ];
            
            // Treasury wallet addresses
            $treasury_main = TREASURY_MAIN;
            $treasury_liquidity = TREASURY_LIQUIDITY;
            $treasury_team = TREASURY_TEAM;
            
            error_log("💰 SOL Distribution for $tier NFT:");
            error_log("  🏦 Treasury Main: {$amounts['main']} SOL (50%)");
            error_log("  💧 Treasury Liquidity: {$amounts['liquidity']} SOL (30%)");
            error_log("  👥 Treasury Team: {$amounts['team']} SOL (20%)");
            
            // Try to log to sol_distributions table (may not exist)
            try {
                // Log main treasury
                supabaseQuery('sol_distributions', 'POST', [
                    'transaction_signature' => $transaction_signature,
                    'from_wallet' => $wallet_address,
                    'to_wallet' => $treasury_main,
                    'amount_sol' => $amounts['main'],
                    'percentage' => 50,
                    'distribution_type' => 'main',
                    'nft_tier' => $tier,
                    'telegram_id' => $telegram_id,
                    'status' => 'pending'
                ]);
                
                // Log liquidity treasury
                supabaseQuery('sol_distributions', 'POST', [
                    'transaction_signature' => $transaction_signature,
                    'from_wallet' => $wallet_address,
                    'to_wallet' => $treasury_liquidity,
                    'amount_sol' => $amounts['liquidity'],
                    'percentage' => 30,
                    'distribution_type' => 'liquidity',
                    'nft_tier' => $tier,
                    'telegram_id' => $telegram_id,
                    'status' => 'pending'
                ]);
                
                // Log team treasury
                supabaseQuery('sol_distributions', 'POST', [
                    'transaction_signature' => $transaction_signature,
                    'from_wallet' => $wallet_address,
                    'to_wallet' => $treasury_team,
                    'amount_sol' => $amounts['team'],
                    'percentage' => 20,
                    'distribution_type' => 'team',
                    'nft_tier' => $tier,
                    'telegram_id' => $telegram_id,
                    'status' => 'pending'
                ]);
                
                $distribution_logged = true;
                error_log("✅ SOL distribution logged successfully");
            } catch (Exception $table_error) {
                error_log("⚠️ sol_distributions table not found or error: " . $table_error->getMessage());
            }
            
        } catch (Exception $dist_error) {
            // Don't fail mint if distribution logging fails
            error_log("⚠️ Failed to log SOL distribution: " . $dist_error->getMessage());
        }
    } else {
        error_log("ℹ️ No transaction signature provided, skipping distribution log");
    }

    // ==========================================
    // STEP 7: Log transaction to transactions table
    // ==========================================
    try {
        // Get username and current balance from leaderboard
        $leaderboard = supabaseQuery('leaderboard', 'GET', null, '?telegram_id=eq.' . $telegram_id . '&select=telegram_username,tama&limit=1');
        $username = 'user_' . $telegram_id;
        $current_balance = 0;
        
        if ($leaderboard['code'] === 200 && !empty($leaderboard['data'])) {
            $username = $leaderboard['data'][0]['telegram_username'] ?? $username;
            $current_balance = floatval($leaderboard['data'][0]['tama'] ?? 0);
        }
        
        // Convert SOL price to TAMA equivalent (for transaction amount)
        // 1 SOL ≈ 164 USD, 1 TAMA = $0.005, so 1 SOL ≈ 32,800 TAMA
        $tama_equivalent = $price_sol * 32800; // Approximate conversion
        
        // Log NFT mint transaction (SOL payment)
        $transactionData = [
            'user_id' => (string)$telegram_id,
            'username' => $username,
            'type' => 'nft_mint_sol',
            'amount' => -$tama_equivalent, // Negative amount (spend)
            'balance_before' => $current_balance,
            'balance_after' => $current_balance, // Balance doesn't change for SOL payments
            'metadata' => json_encode([
                'tier' => $tier,
                'design_id' => $design_id,
                'design_number' => $design_number,
                'design_theme' => $design_theme,
                'design_variant' => $design_variant,
                'payment_method' => 'SOL',
                'price_sol' => $price_sol,
                'price_usd' => round($price_sol * 164.07, 2),
                'tama_equivalent' => round($tama_equivalent),
                'transaction_signature' => $transaction_signature,
                'wallet_address' => $wallet_address
            ])
        ];
        
        $logTransaction = supabaseQuery('transactions', 'POST', $transactionData);
        
        if ($logTransaction['code'] >= 200 && $logTransaction['code'] < 300) {
            error_log("✅ Transaction logged: NFT mint ($tier) SOL for user $telegram_id");
        }
        
        // Log SOL distribution transactions if signature provided
        if ($transaction_signature) {
            // Log Treasury Main (50%)
            $treasury_main_amount = $price_sol * 0.50 * 32800; // Convert to TAMA equivalent
            supabaseQuery('transactions', 'POST', [
                'user_id' => TREASURY_MAIN,
                'username' => '💰 Treasury Main',
                'type' => 'treasury_income_from_nft_sol',
                'amount' => $treasury_main_amount,
                'balance_before' => 0,
                'balance_after' => 0,
                'metadata' => json_encode([
                    'source' => 'nft_mint_sol',
                    'tier' => $tier,
                    'user' => $telegram_id,
                    'percentage' => 50,
                    'amount_sol' => $price_sol * 0.50,
                    'transaction_signature' => $transaction_signature
                ])
            ]);
            
            // Log Treasury Liquidity (30%)
            $treasury_liquidity_amount = $price_sol * 0.30 * 32800;
            supabaseQuery('transactions', 'POST', [
                'user_id' => TREASURY_LIQUIDITY,
                'username' => '💧 Treasury Liquidity',
                'type' => 'treasury_liquidity_income_from_nft_sol',
                'amount' => $treasury_liquidity_amount,
                'balance_before' => 0,
                'balance_after' => 0,
                'metadata' => json_encode([
                    'source' => 'nft_mint_sol',
                    'tier' => $tier,
                    'user' => $telegram_id,
                    'percentage' => 30,
                    'amount_sol' => $price_sol * 0.30,
                    'transaction_signature' => $transaction_signature
                ])
            ]);
            
            // Log Treasury Team (20%)
            $treasury_team_amount = $price_sol * 0.20 * 32800;
            supabaseQuery('transactions', 'POST', [
                'user_id' => TREASURY_TEAM,
                'username' => '👥 Treasury Team',
                'type' => 'treasury_team_income_from_nft_sol',
                'amount' => $treasury_team_amount,
                'balance_before' => 0,
                'balance_after' => 0,
                'metadata' => json_encode([
                    'source' => 'nft_mint_sol',
                    'tier' => $tier,
                    'user' => $telegram_id,
                    'percentage' => 20,
                    'amount_sol' => $price_sol * 0.20,
                    'transaction_signature' => $transaction_signature
                ])
            ]);
            
            error_log("✅ Distribution transactions logged for $tier NFT");
        }
        
    } catch (Exception $log_error) {
        // Don't fail mint if transaction logging fails
        error_log("⚠️ Failed to log transaction: " . $log_error->getMessage());
    }

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'tier' => $tier,
        'design_id' => $design_id,
        'design_number' => $design_number,
        'design_theme' => $design_theme,
        'design_variant' => $design_variant,
        'boost' => $boost,
        'price_sol' => $price_sol,
        'new_price' => $new_price,
        'minted_count' => $minted_count + 1,
        'max_supply' => $max_supply,
        'image_url' => $image_url,
        'metadata_url' => $metadata_url,
        'user_nft_id' => $user_nft_id,
        'message' => "$tier NFT minted successfully!",
        'distribution_logged' => $transaction_signature ? true : false,
        'transaction_signature' => $transaction_signature
    ]);

} catch (Exception $e) {
    // Error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

