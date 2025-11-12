<?php
/**
 * Mint Bronze NFT (TAMA Payment) - Supabase REST API Version
 * NO DATABASE PASSWORD NEEDED!
 */

// Suppress all PHP errors to prevent HTML output
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Start output buffering to catch any accidental output
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_clean();
    http_response_code(200);
    exit();
}

// Supabase REST API Settings
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
        'Prefer: return=representation,resolution=merge-duplicates',
        'Accept: application/vnd.pgjson.object+json', // Explicit JSON format
        'Accept-Profile: public' // Force public schema (may help with schema cache)
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if ($data) {
        // CRITICAL FIX: PostgREST requires BIGINT columns to receive INTEGER values in JSON
        // JSON numbers (not strings) are required for BIGINT columns
        // Use JSON_NUMERIC_CHECK to ensure numbers stay as numbers in JSON
        if (isset($data['telegram_id'])) {
            // Force to integer type - JSON will encode as number (not quoted string)
            $data['telegram_id'] = (int)$data['telegram_id'];
            // Double-check it's actually an integer
            if (!is_int($data['telegram_id'])) {
                $data['telegram_id'] = intval($data['telegram_id']);
            }
        }
        // nft_design_id can be integer or null
        if (isset($data['nft_design_id']) && $data['nft_design_id'] !== null) {
            $data['nft_design_id'] = (int)$data['nft_design_id'];
        }
        
        // Use JSON_NUMERIC_CHECK to ensure numbers stay as numbers (not strings)
        $jsonData = json_encode($data, JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
        
        // Debug: Log the exact JSON being sent
        error_log("🔍 JSON being sent to Supabase: " . substr($jsonData, 0, 500));
        
        // Verify telegram_id is a NUMBER in JSON (not quoted) - required for BIGINT column
        if (preg_match('/"telegram_id"\s*:\s*"?(\d+)"?/', $jsonData, $matches)) {
            if (strpos($jsonData, '"telegram_id":"') !== false) {
                error_log("⚠️ WARNING: telegram_id is quoted in JSON! This is wrong for BIGINT!");
            } else {
                error_log("✅ telegram_id is a NUMBER in JSON (correct for BIGINT): " . $matches[1]);
            }
        }
        
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $responseData = json_decode($response, true);
    
    // Debug: Log response if error
    if ($httpCode >= 400) {
        error_log("🔍 Supabase error response: " . $response);
    }
    
    return ['code' => $httpCode, 'data' => $responseData];
}

try {
    // Get POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
            $telegram_id = $data['telegram_id'] ?? null;
            $wallet_address = $data['wallet_address'] ?? null; // Optional: wallet address from frontend
            
            if (!$telegram_id) {
                throw new Exception('Missing telegram_id');
            }
            
            // SECURITY: Convert telegram_id to integer (bigint in database)
            // Use (int) cast instead of intval() to ensure proper type
            $telegram_id = (int)$telegram_id;
            
            // Verify it's actually an integer
            if (!is_int($telegram_id)) {
                error_log("⚠️ WARNING: telegram_id conversion failed! Original: " . var_export($data['telegram_id'], true));
                $telegram_id = (int)$telegram_id; // Force conversion
            }
            
            error_log("🟫 Bronze TAMA mint request: user=$telegram_id (type: " . gettype($telegram_id) . ")");
    
    // 1. Check TAMA balance from leaderboard table (balance is stored there, not in players)
    $leaderboard = supabaseQuery('leaderboard', 'GET', null, '?telegram_id=eq.' . intval($telegram_id) . '&select=*');
    
    if ($leaderboard['code'] !== 200 || empty($leaderboard['data'])) {
        // Create player in leaderboard table with default values
        $newPlayer = supabaseQuery('leaderboard', 'POST', [
            'telegram_id' => (int)$telegram_id, // ✅ Cast to integer - PHP will encode as JSON number
            'tama' => 0
        ]);
        
        if ($newPlayer['code'] < 200 || $newPlayer['code'] >= 300) {
            $errorDetails = json_encode($newPlayer['data'] ?? ['no_data' => true]);
            error_log("❌ Failed to create player in leaderboard: code={$newPlayer['code']}, data={$errorDetails}");
            
            // Try to get more details from Supabase error
            $errorMsg = 'Failed to create player account';
            if (isset($newPlayer['data']['message'])) {
                $errorMsg .= ': ' . $newPlayer['data']['message'];
            } elseif (isset($newPlayer['data']['hint'])) {
                $errorMsg .= ': ' . $newPlayer['data']['hint'];
            } elseif (isset($newPlayer['data'][0]['message'])) {
                $errorMsg .= ': ' . $newPlayer['data'][0]['message'];
            }
            
            throw new Exception($errorMsg);
        }
        
                // Get the newly created player
                $leaderboard = supabaseQuery('leaderboard', 'GET', null, '?telegram_id=eq.' . intval($telegram_id) . '&select=*');
        if ($leaderboard['code'] !== 200 || empty($leaderboard['data'])) {
            throw new Exception('Player account created but could not be retrieved');
        }
    }
    
    $playerData = $leaderboard['data'][0];
    // TAMA balance is stored in 'tama' column in leaderboard table
    $tamaBalance = floatval($playerData['tama'] ?? 0);
    
    if ($tamaBalance < 5000) {
        throw new Exception('Insufficient TAMA balance. You need 5,000 TAMA.');
    }
    
    // 2. Deduct 5000 TAMA from leaderboard table
    $newBalance = $tamaBalance - 5000;
    $updatePlayer = supabaseQuery(
        'leaderboard', 
        'PATCH', 
        ['tama' => $newBalance],
        '?telegram_id=eq.' . intval($telegram_id) // ✅ Convert to integer
    );
    
    if ($updatePlayer['code'] < 200 || $updatePlayer['code'] >= 300) {
        throw new Exception('Failed to deduct TAMA');
    }
    
    // 3. Get Bronze bonding state
    $bonding = supabaseQuery('nft_bonding_state', 'GET', null, '?tier_name=eq.Bronze&payment_type=eq.TAMA');
    
    if ($bonding['code'] !== 200 || empty($bonding['data'])) {
        throw new Exception('Bronze tier not configured');
    }
    
    $bondingData = $bonding['data'][0];
    $mintedCount = intval($bondingData['minted_count'] ?? 0);
    $maxSupply = intval($bondingData['max_supply'] ?? 4500);
    
    if ($mintedCount >= $maxSupply) {
        // Refund TAMA
        supabaseQuery(
            'leaderboard', 
            'PATCH', 
            ['tama' => $tamaBalance],
            '?telegram_id=eq.' . intval($telegram_id) // ✅ Convert to integer
        );
        throw new Exception('Bronze NFTs sold out!');
    }
    
    // 4. Get random Bronze design
    // Table uses tier_name (text) not tier_id (number) - use tier_name=Bronze
    $designs = supabaseQuery('nft_designs', 'GET', null, '?tier_name=eq.Bronze&limit=100');
    
    if ($designs['code'] !== 200 || empty($designs['data'])) {
        error_log("❌ No Bronze designs found in nft_designs table!");
        error_log("   Query used: tier_name=eq.Bronze");
        throw new Exception('No Bronze designs available. Please contact support to add NFT designs to the database.');
    }
    
    error_log("✅ Found " . count($designs['data']) . " Bronze design(s)");
    
    $randomDesign = $designs['data'][array_rand($designs['data'])];
    
    // 5. Create NFT record
    // Use correct field names from user_nfts table schema:
    // - nft_design_id (not design_id)
    // - earning_multiplier (not boost_multiplier)
    // - purchase_price_tama (not price_paid_tama)
    // - nft_mint_address (required, use placeholder until on-chain mint)
    // - rarity (required, Bronze = Common)
    // - telegram_id: MUST be INTEGER (number in JSON) for BIGINT column
    // PostgREST does NOT auto-cast strings to bigint - must send as JSON number
    $design_id_int = (int)$randomDesign['id']; // ✅ Design ID is integer
    
    // Debug: Log the types to ensure correct format
    error_log("🔍 Debug: telegram_id type=" . gettype($telegram_id) . ", value=" . $telegram_id);
    error_log("🔍 Debug: design_id type=" . gettype($design_id_int) . ", value=" . $design_id_int);
    
    $nftData = [
        'telegram_id' => $telegram_id, // ✅ Send as INTEGER (will be JSON number for BIGINT column)
        'nft_design_id' => $design_id_int, // ✅ Send as integer
        'nft_mint_address' => 'pending_' . $telegram_id . '_' . time() . '_' . $randomDesign['id'], // ✅ Placeholder until on-chain mint
        'tier_name' => 'Bronze',
        'rarity' => 'Common', // ✅ Required field: Bronze = Common
        'earning_multiplier' => 2.0, // ✅ Correct field name
        'purchase_price_tama' => 5000, // ✅ Correct field name
        'is_active' => true
    ];
    
    // Debug: Log the JSON that will be sent (with JSON_NUMERIC_CHECK in supabaseQuery)
    $jsonDebug = json_encode($nftData, JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
    error_log("🔍 Debug: JSON to send: " . $jsonDebug);
    
    // Verify telegram_id appears as NUMBER in JSON (not quoted) - required for BIGINT
    if (strpos($jsonDebug, '"telegram_id":') !== false && strpos($jsonDebug, '"telegram_id":"') === false) {
        error_log("✅ telegram_id is encoded as NUMBER in JSON (correct for BIGINT column)");
    } else {
        error_log("⚠️ WARNING: telegram_id is quoted in JSON! Should be number for BIGINT!");
    }
    
    $createNFT = supabaseQuery('user_nfts', 'POST', $nftData);
    
    if ($createNFT['code'] < 200 || $createNFT['code'] >= 300) {
        $errorDetails = json_encode($createNFT['data'] ?? ['no_data' => true]);
        error_log("❌ Failed to create NFT record: code={$createNFT['code']}, data={$errorDetails}");
        error_log("   NFT data sent: " . json_encode($nftData));
        
        // Try to get more details from Supabase error
        $errorMsg = 'Failed to create NFT record';
        if (isset($createNFT['data']['message'])) {
            $errorMsg .= ': ' . $createNFT['data']['message'];
        } elseif (isset($createNFT['data']['hint'])) {
            $errorMsg .= ': ' . $createNFT['data']['hint'];
        } elseif (isset($createNFT['data'][0]['message'])) {
            $errorMsg .= ': ' . $createNFT['data'][0]['message'];
        } elseif (isset($createNFT['data']['details'])) {
            $errorMsg .= ': ' . $createNFT['data']['details'];
        }
        
        throw new Exception($errorMsg);
    }
    
    // 6. Update bonding state
    $updateBonding = supabaseQuery(
        'nft_bonding_state',
        'PATCH',
        ['minted_count' => $mintedCount + 1],
        '?tier_name=eq.Bronze&payment_type=eq.TAMA'
    );
    
    // 7. Update player boost and wallet_address (if provided)
    $updateData = ['nft_boost_multiplier' => 2.0];
    
    // If wallet_address is provided in request, save it to player
    $wallet_address = $data['wallet_address'] ?? null;
    if ($wallet_address) {
        $updateData['wallet_address'] = $wallet_address;
        error_log("💾 Saving wallet_address to player: $wallet_address");
    }
    
            $updateBoost = supabaseQuery(
                'players',
                'PATCH',
                $updateData,
                '?telegram_id=eq.' . intval($telegram_id) // ✅ Convert to integer
            );
    
    error_log("✅ Bronze NFT minted: Design=#{$randomDesign['design_number']}, User=$telegram_id");
    
    // Clean output buffer before sending JSON
    ob_clean();
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'design_number' => $randomDesign['design_number'],
        'design_theme' => $randomDesign['design_theme'] ?? 'Unknown',
        'design_variant' => $randomDesign['design_variant'] ?? 'Unknown',
        'boost' => 2.0,
        'price_tama' => 5000,
        'new_balance' => $newBalance,
        'message' => 'Bronze NFT minted successfully!'
    ]);
    exit();
    
} catch (Exception $e) {
    error_log("❌ Bronze TAMA mint error: " . $e->getMessage());
    
    // Clean any output buffer before sending JSON
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    exit();
} catch (Error $e) {
    error_log("❌ Bronze TAMA mint fatal error: " . $e->getMessage());
    
    // Clean any output buffer before sending JSON
    ob_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error: ' . $e->getMessage()
    ]);
    exit();
}
?>

