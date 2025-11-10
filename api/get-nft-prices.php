<?php
/**
 * Get NFT Prices and Stats
 * 
 * Endpoint: /api/get-nft-prices.php
 * Method: GET
 * 
 * Response:
 * {
 *   "success": true,
 *   "tiers": [
 *     {
 *       "tier_name": "Bronze",
 *       "payment_type": "TAMA",
 *       "current_price": 5000,
 *       "minted_count": 234,
 *       "max_supply": 4500,
 *       "available": 4266,
 *       "minted_percentage": 5.2,
 *       "earning_multiplier": 2.0
 *     },
 *     ...
 *   ]
 * }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Load config
require_once 'config.php';

try {
    // Connect to Supabase (PostgreSQL)
    $dsn = "host=" . SUPABASE_DB_HOST . " port=" . SUPABASE_DB_PORT . " dbname=" . SUPABASE_DB_NAME . " user=" . SUPABASE_DB_USER . " password=" . SUPABASE_DB_PASSWORD . " sslmode=require";
    $conn = pg_connect($dsn);

    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    // Get bonding state for all tiers
    $query = "
        SELECT 
            tier_name,
            payment_type,
            current_price,
            minted_count,
            max_supply,
            (max_supply - minted_count) as available,
            ROUND((minted_count::decimal / max_supply * 100), 2) as minted_percentage,
            start_price,
            end_price,
            increment_per_mint,
            CASE 
                WHEN tier_name = 'Bronze' THEN 2.0
                WHEN tier_name = 'Silver' THEN 2.3
                WHEN tier_name = 'Gold' THEN 2.7
                WHEN tier_name = 'Platinum' THEN 3.5
                WHEN tier_name = 'Diamond' THEN 5.0
            END as earning_multiplier,
            is_active,
            updated_at
        FROM nft_bonding_state
        ORDER BY 
            CASE tier_name
                WHEN 'Bronze' THEN 1
                WHEN 'Silver' THEN 2
                WHEN 'Gold' THEN 3
                WHEN 'Platinum' THEN 4
                WHEN 'Diamond' THEN 5
            END
    ";
    
    $result = pg_query($conn, $query);

    if (!$result) {
        throw new Exception('Failed to get prices');
    }

    $tiers = [];
    while ($row = pg_fetch_assoc($result)) {
        // Calculate next price
        $next_price = floatval($row['current_price']) + floatval($row['increment_per_mint']);
        
        // Format data
        $tier_data = [
            'tier_name' => $row['tier_name'],
            'payment_type' => $row['payment_type'],
            'current_price' => floatval($row['current_price']),
            'next_price' => $next_price,
            'minted_count' => intval($row['minted_count']),
            'max_supply' => intval($row['max_supply']),
            'available' => intval($row['available']),
            'minted_percentage' => floatval($row['minted_percentage']),
            'start_price' => floatval($row['start_price']),
            'end_price' => floatval($row['end_price']),
            'increment_per_mint' => floatval($row['increment_per_mint']),
            'earning_multiplier' => floatval($row['earning_multiplier']),
            'is_active' => $row['is_active'] === 't',
            'updated_at' => $row['updated_at']
        ];
        
        $tiers[] = $tier_data;
    }

    pg_close($conn);

    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'tiers' => $tiers,
        'timestamp' => time()
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

