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

try {
    // Get POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    $telegram_id = $data['telegram_id'] ?? null;
    $wallet_address = $data['wallet_address'] ?? null; // Optional: wallet address from frontend
    
    if (!$telegram_id) {
        throw new Exception('Missing telegram_id');
    }
    
    error_log("🟫 Bronze TAMA mint request: user=$telegram_id");
    
    // 1. Check TAMA balance from leaderboard table (balance is stored there, not in players)
    $leaderboard = supabaseQuery('leaderboard', 'GET', null, '?telegram_id=eq.' . $telegram_id . '&select=*');
    
    if ($leaderboard['code'] !== 200 || empty($leaderboard['data'])) {
        // Create player in leaderboard table with default values
        $newPlayer = supabaseQuery('leaderboard', 'POST', [
            'telegram_id' => $telegram_id,
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
        $leaderboard = supabaseQuery('leaderboard', 'GET', null, '?telegram_id=eq.' . $telegram_id . '&select=*');
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
        '?telegram_id=eq.' . $telegram_id
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
            'players', 
            'PATCH', 
            ['tama_balance' => $tamaBalance],
            '?telegram_id=eq.' . $telegram_id
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
    // Use design fields from nft_designs table (tier_name, design_number, design_theme, design_variant)
    $nftData = [
        'telegram_id' => $telegram_id,
        'tier_name' => 'Bronze',
        'design_id' => $randomDesign['id'],
        'design_number' => $randomDesign['design_number'],
        'design_theme' => $randomDesign['design_theme'] ?? 'Unknown',
        'design_variant' => $randomDesign['design_variant'] ?? 'Unknown',
        'boost_multiplier' => 2.0,
        'price_paid_tama' => 5000,
        'payment_type' => 'TAMA',
        'is_active' => true
    ];
    
    $createNFT = supabaseQuery('user_nfts', 'POST', $nftData);
    
    if ($createNFT['code'] < 200 || $createNFT['code'] >= 300) {
        throw new Exception('Failed to create NFT record');
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
        '?telegram_id=eq.' . $telegram_id
    );
    
    error_log("✅ Bronze NFT minted: Design=#{$randomDesign['design_number']}, User=$telegram_id");
    
    echo json_encode([
        'success' => true,
        'design_number' => $randomDesign['design_number'],
        'design_theme' => $randomDesign['design_theme'] ?? $randomDesign['theme'] ?? 'Unknown',
        'design_variant' => $randomDesign['design_variant'] ?? $randomDesign['variant'] ?? 'Unknown',
        'boost' => 2.0,
        'price_tama' => 5000,
        'new_balance' => $newBalance,
        'message' => 'Bronze NFT minted successfully!'
    ]);
    
} catch (Exception $e) {
    error_log("❌ Bronze TAMA mint error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

