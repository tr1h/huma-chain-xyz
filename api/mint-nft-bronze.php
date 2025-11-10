<?php
/**
 * Mint Bronze NFT (TAMA Payment)
 * 
 * Endpoint: /api/mint-nft-bronze.php
 * Method: POST
 * 
 * Request Body:
 * {
 *   "telegram_id": 123456789
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "design_number": 1234,
 *   "design_theme": "Baby Creatures",
 *   "design_variant": "Green",
 *   "boost": 2.0,
 *   "image_url": "https://arweave.net/...",
 *   "message": "Bronze NFT minted successfully!"
 * }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
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

if (!$telegram_id) {
    http_response_code(400);
    echo json_encode(['error' => 'telegram_id is required']);
    exit();
}

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
    // STEP 1: Check TAMA balance
    // ==========================================
    $query = "SELECT tama_balance FROM players WHERE telegram_id = $1";
    $result = pg_query_params($conn, $query, array($telegram_id));

    if (!$result) {
        throw new Exception('Failed to check TAMA balance');
    }

    $player = pg_fetch_assoc($result);

    if (!$player) {
        throw new Exception('Player not found');
    }

    $tama_balance = floatval($player['tama_balance']);

    if ($tama_balance < 5000) {
        throw new Exception('Insufficient TAMA balance. You need 5,000 TAMA.');
    }

    // ==========================================
    // STEP 2: Get random unminted Bronze design
    // ==========================================
    $query = "
        SELECT id, design_number, design_theme, design_variant, image_url, metadata_url
        FROM nft_designs
        WHERE tier_name = 'Bronze' AND is_minted = false
        ORDER BY RANDOM()
        LIMIT 1
    ";
    $result = pg_query($conn, $query);

    if (!$result) {
        throw new Exception('Failed to get Bronze design');
    }

    $design = pg_fetch_assoc($result);

    if (!$design) {
        throw new Exception('No Bronze NFTs left! All 4,500 have been minted.');
    }

    $design_id = intval($design['id']);
    $design_number = intval($design['design_number']);
    $design_theme = $design['design_theme'];
    $design_variant = $design['design_variant'];
    $image_url = $design['image_url'] ?: 'https://placeholder.com/bronze.png';
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
    $query = "
        INSERT INTO user_nfts 
        (telegram_id, nft_design_id, tier_name, earning_multiplier, purchase_price_tama, is_active, minted_at)
        VALUES ($1, $2, $3, $4, $5, true, NOW())
        RETURNING id
    ";
    $result = pg_query_params($conn, $query, array(
        $telegram_id,
        $design_id,
        'Bronze',
        2.0,
        5000
    ));

    if (!$result) {
        throw new Exception('Failed to create user NFT record');
    }

    $user_nft = pg_fetch_assoc($result);
    $user_nft_id = $user_nft['id'];

    // ==========================================
    // STEP 5: Burn TAMA
    // ==========================================
    $new_balance = $tama_balance - 5000;
    $query = "UPDATE players SET tama_balance = $1 WHERE telegram_id = $2";
    $result = pg_query_params($conn, $query, array($new_balance, $telegram_id));

    if (!$result) {
        throw new Exception('Failed to burn TAMA');
    }

    // ==========================================
    // STEP 6: Update bonding state
    // ==========================================
    $query = "
        UPDATE nft_bonding_state
        SET minted_count = minted_count + 1, updated_at = NOW()
        WHERE tier_name = 'Bronze'
    ";
    $result = pg_query($conn, $query);

    if (!$result) {
        throw new Exception('Failed to update bonding state');
    }

    // ==========================================
    // STEP 7: Log transaction (optional)
    // ==========================================
    // You can add transaction logging here if needed

    // Commit transaction
    pg_query($conn, "COMMIT");
    pg_close($conn);

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'tier' => 'Bronze',
        'design_id' => $design_id,
        'design_number' => $design_number,
        'design_theme' => $design_theme,
        'design_variant' => $design_variant,
        'boost' => 2.0,
        'price_tama' => 5000,
        'image_url' => $image_url,
        'metadata_url' => $metadata_url,
        'user_nft_id' => $user_nft_id,
        'new_tama_balance' => $new_balance,
        'message' => 'Bronze NFT minted successfully!'
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

