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
require_once 'config.php';

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
    // STEP 6: Process SOL payment (IMPORTANT!)
    // ==========================================
    // NOTE: In a real implementation, you would:
    // 1. Verify the SOL transaction on Solana blockchain
    // 2. Check that payment was sent to treasury wallet
    // 3. Only mint NFT after payment confirmed
    //
    // For MVP/hackathon, we're trusting frontend for now
    // TODO: Add Solana payment verification!
    //
    // Example (pseudocode):
    // if (!verifySolanaPayment($wallet_address, $price_sol, $treasury_wallet)) {
    //     throw new Exception('Payment verification failed');
    // }

    // ==========================================
    // STEP 7: Log transaction
    // ==========================================
    // Optional: Log to transactions table for analytics
    // INSERT INTO transactions (telegram_id, type, amount_sol, tier, ...) VALUES (...)

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
        'message' => "$tier NFT minted successfully!"
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

