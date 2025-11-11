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

// Load config
require_once __DIR__ . '/config.php';

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
    // Connect to Supabase (PostgreSQL)
    $dsn = "host=" . SUPABASE_DB_HOST . " port=" . SUPABASE_DB_PORT . " dbname=" . SUPABASE_DB_NAME . " user=" . SUPABASE_DB_USER . " password=" . SUPABASE_DB_PASSWORD . " sslmode=require";
    $conn = pg_connect($dsn);

    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    // Start transaction
    pg_query($conn, "BEGIN");

    // ==========================================
    // STEP 1: Get current bonding state
    // ==========================================
    $query = "
        SELECT current_price, minted_count, max_supply, increment_per_mint
        FROM nft_bonding_state
        WHERE tier_name = $1 AND is_active = true
    ";
    $result = pg_query_params($conn, $query, array($tier));

    if (!$result) {
        throw new Exception('Failed to get bonding state');
    }

    $bonding = pg_fetch_assoc($result);

    if (!$bonding) {
        throw new Exception('Tier not found or inactive');
    }

    $current_price = floatval($bonding['current_price']);
    $minted_count = intval($bonding['minted_count']);
    $max_supply = intval($bonding['max_supply']);
    $increment = floatval($bonding['increment_per_mint']);

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
    $query = "
        SELECT id, design_number, design_theme, design_variant, image_url, metadata_url
        FROM nft_designs
        WHERE tier_name = $1 AND is_minted = false
        ORDER BY RANDOM()
        LIMIT 1
    ";
    $result = pg_query_params($conn, $query, array($tier));

    if (!$result) {
        throw new Exception('Failed to get design');
    }

    $design = pg_fetch_assoc($result);

    if (!$design) {
        throw new Exception("No $tier NFTs left! All have been minted.");
    }

    $design_id = intval($design['id']);
    $design_number = intval($design['design_number']);
    $design_theme = $design['design_theme'];
    $design_variant = $design['design_variant'];
    $image_url = $design['image_url'] ?: "https://placeholder.com/$tier.png";
    $metadata_url = $design['metadata_url'] ?: '';

    // ==========================================
    // STEP 3: Mark design as minted
    // ==========================================
    $query = "
        UPDATE nft_designs
        SET is_minted = true, minted_by = $1, minted_at = NOW()
        WHERE id = $2
    ";
    $result = pg_query_params($conn, $query, array($telegram_id, $design_id));

    if (!$result) {
        throw new Exception('Failed to mark design as minted');
    }

    // ==========================================
    // STEP 4: Create user NFT record
    // ==========================================
    $boost = $tier_boosts[$tier];
    $query = "
        INSERT INTO user_nfts 
        (telegram_id, nft_design_id, tier_name, earning_multiplier, purchase_price_sol, is_active, minted_at)
        VALUES ($1, $2, $3, $4, $5, true, NOW())
        RETURNING id
    ";
    $result = pg_query_params($conn, $query, array(
        $telegram_id,
        $design_id,
        $tier,
        $boost,
        $price_sol
    ));

    if (!$result) {
        throw new Exception('Failed to create user NFT record');
    }

    $user_nft = pg_fetch_assoc($result);
    $user_nft_id = $user_nft['id'];

    // ==========================================
    // STEP 5: Update bonding curve price
    // ==========================================
    $new_price = $current_price + $increment;
    $query = "
        UPDATE nft_bonding_state
        SET 
            current_price = $1,
            minted_count = minted_count + 1,
            updated_at = NOW()
        WHERE tier_name = $2
    ";
    $result = pg_query_params($conn, $query, array($new_price, $tier));

    if (!$result) {
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
            
            // Log distribution to sol_distributions table (if exists)
            // Check if table exists first
            $check_table = pg_query($conn, "
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'sol_distributions'
                )
            ");
            $table_exists = pg_fetch_result($check_table, 0, 0) === 't';
            
            if ($table_exists) {
                // Log main treasury
                $dist_query = "
                    INSERT INTO sol_distributions (
                        transaction_signature,
                        from_wallet,
                        to_wallet,
                        amount_sol,
                        percentage,
                        distribution_type,
                        nft_tier,
                        telegram_id,
                        status,
                        created_at
                    ) VALUES ($1, $2, $3, $4, $5, 'main', $6, $7, 'pending', NOW())
                ";
                pg_query_params($conn, $dist_query, array(
                    $transaction_signature,
                    $wallet_address,
                    $treasury_main,
                    $amounts['main'],
                    50,
                    $tier,
                    $telegram_id
                ));
                
                // Log liquidity treasury
                pg_query_params($conn, $dist_query, array(
                    $transaction_signature,
                    $wallet_address,
                    $treasury_liquidity,
                    $amounts['liquidity'],
                    30,
                    $tier,
                    $telegram_id
                ));
                
                // Log team treasury
                pg_query_params($conn, $dist_query, array(
                    $transaction_signature,
                    $wallet_address,
                    $treasury_team,
                    $amounts['team'],
                    20,
                    $tier,
                    $telegram_id
                ));
                
                error_log("✅ SOL distribution logged successfully");
            } else {
                error_log("⚠️ sol_distributions table not found, skipping distribution log");
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
        $username_query = "SELECT telegram_username, tama FROM leaderboard WHERE telegram_id = $1 LIMIT 1";
        $username_result = pg_query_params($conn, $username_query, array($telegram_id));
        $username_row = pg_fetch_assoc($username_result);
        $username = $username_row['telegram_username'] ?? 'user_' . $telegram_id;
        $current_balance = floatval($username_row['tama'] ?? 0);
        
        // Convert SOL price to TAMA equivalent (for transaction amount)
        // 1 SOL ≈ 164 USD, 1 TAMA = $0.005, so 1 SOL ≈ 32,800 TAMA
        $tama_equivalent = $price_sol * 32800; // Approximate conversion
        
        // Log NFT mint transaction (SOL payment)
        $log_query = "
            INSERT INTO transactions (
                user_id,
                username,
                type,
                amount,
                balance_before,
                balance_after,
                metadata,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ";
        
        $metadata = json_encode([
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
        ]);
        
        pg_query_params($conn, $log_query, array(
            (string)$telegram_id,
            $username,
            'nft_mint_sol',
            -$tama_equivalent, // Negative amount (spend)
            $current_balance,
            $current_balance, // Balance doesn't change for SOL payments
            $metadata
        ));
        
        error_log("✅ Transaction logged: NFT mint ($tier) SOL for user $telegram_id");
        
        // Log SOL distribution transactions if signature provided
        if ($transaction_signature) {
            // Log Treasury Main (50%)
            $treasury_main_amount = $price_sol * 0.50 * 32800; // Convert to TAMA equivalent
            pg_query_params($conn, $log_query, array(
                TREASURY_MAIN,
                '💰 Treasury Main',
                'treasury_income_from_nft_sol',
                $treasury_main_amount,
                0,
                0,
                json_encode([
                    'source' => 'nft_mint_sol',
                    'tier' => $tier,
                    'user' => $telegram_id,
                    'percentage' => 50,
                    'amount_sol' => $price_sol * 0.50,
                    'transaction_signature' => $transaction_signature
                ])
            ));
            
            // Log Treasury Liquidity (30%)
            $treasury_liquidity_amount = $price_sol * 0.30 * 32800;
            pg_query_params($conn, $log_query, array(
                TREASURY_LIQUIDITY,
                '💧 Treasury Liquidity',
                'treasury_liquidity_income_from_nft_sol',
                $treasury_liquidity_amount,
                0,
                0,
                json_encode([
                    'source' => 'nft_mint_sol',
                    'tier' => $tier,
                    'user' => $telegram_id,
                    'percentage' => 30,
                    'amount_sol' => $price_sol * 0.30,
                    'transaction_signature' => $transaction_signature
                ])
            ));
            
            // Log Treasury Team (20%)
            $treasury_team_amount = $price_sol * 0.20 * 32800;
            pg_query_params($conn, $log_query, array(
                TREASURY_TEAM,
                '👥 Treasury Team',
                'treasury_team_income_from_nft_sol',
                $treasury_team_amount,
                0,
                0,
                json_encode([
                    'source' => 'nft_mint_sol',
                    'tier' => $tier,
                    'user' => $telegram_id,
                    'percentage' => 20,
                    'amount_sol' => $price_sol * 0.20,
                    'transaction_signature' => $transaction_signature
                ])
            ));
            
            error_log("✅ Distribution transactions logged for $tier NFT");
        }
        
    } catch (Exception $log_error) {
        // Don't fail mint if transaction logging fails
        error_log("⚠️ Failed to log transaction: " . $log_error->getMessage());
    }

    // Commit transaction
    pg_query($conn, "COMMIT");
    pg_close($conn);

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
    // Rollback transaction
    if (isset($conn) && $conn) {
        pg_query($conn, "ROLLBACK");
        pg_close($conn);
    }

    // Error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

