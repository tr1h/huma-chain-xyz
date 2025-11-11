<?php
/**
 * Mint Bronze NFT (TAMA Payment) - Supabase REST API Version
 * NO DATABASE PASSWORD NEEDED!
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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
    
    if (!$telegram_id) {
        throw new Exception('Missing telegram_id');
    }
    
    error_log("🟫 Bronze TAMA mint request: user=$telegram_id");
    
    // 1. Check TAMA balance (create player if not exists)
    $player = supabaseQuery('players', 'GET', null, '?telegram_id=eq.' . $telegram_id . '&select=*');
    
    if ($player['code'] !== 200 || empty($player['data'])) {
        // Auto-create player with default values (NO level column - it's in leaderboard table!)
        $newPlayer = supabaseQuery('players', 'POST', [
            'telegram_id' => $telegram_id,
            'tama_balance' => 0
        ]);
        
        if ($newPlayer['code'] < 200 || $newPlayer['code'] >= 300) {
            error_log("❌ Failed to create player: code={$newPlayer['code']}, data=" . json_encode($newPlayer['data']));
            throw new Exception('Failed to create player account');
        }
        
        // Get the newly created player
        $player = supabaseQuery('players', 'GET', null, '?telegram_id=eq.' . $telegram_id . '&select=*');
        if ($player['code'] !== 200 || empty($player['data'])) {
            throw new Exception('Player account created but could not be retrieved');
        }
    }
    
    $playerData = $player['data'][0];
    $tamaBalance = floatval($playerData['tama_balance'] ?? 0);
    
    if ($tamaBalance < 5000) {
        throw new Exception('Insufficient TAMA balance. You need 5,000 TAMA.');
    }
    
    // 2. Deduct 5000 TAMA
    $newBalance = $tamaBalance - 5000;
    $updatePlayer = supabaseQuery(
        'players', 
        'PATCH', 
        ['tama_balance' => $newBalance],
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
    $designs = supabaseQuery('nft_designs', 'GET', null, '?tier_id=eq.1&rarity_id=eq.1&limit=100');
    
    if ($designs['code'] !== 200 || empty($designs['data'])) {
        throw new Exception('No Bronze designs available');
    }
    
    $randomDesign = $designs['data'][array_rand($designs['data'])];
    
    // 5. Create NFT record
    $nftData = [
        'telegram_id' => $telegram_id,
        'tier_id' => 1,
        'tier_name' => 'Bronze',
        'rarity_id' => 1,
        'design_id' => $randomDesign['id'],
        'design_number' => $randomDesign['design_number'],
        'design_theme' => $randomDesign['theme'],
        'design_variant' => $randomDesign['variant'],
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
    
    // 7. Update player boost
    $updateBoost = supabaseQuery(
        'players',
        'PATCH',
        ['nft_boost_multiplier' => 2.0],
        '?telegram_id=eq.' . $telegram_id
    );
    
    error_log("✅ Bronze NFT minted: Design=#{$randomDesign['design_number']}, User=$telegram_id");
    
    echo json_encode([
        'success' => true,
        'design_number' => $randomDesign['design_number'],
        'design_theme' => $randomDesign['theme'],
        'design_variant' => $randomDesign['variant'],
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

