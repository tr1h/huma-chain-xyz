<?php
/**
 * Mint SOL-based NFTs (Silver, Gold, Platinum, Diamond) - Supabase REST API Version
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
    $wallet_address = $data['wallet_address'] ?? null;
    $tier_name = $data['tier_name'] ?? null;
    $price_sol = floatval($data['price_sol'] ?? 0);
    
    if (!$wallet_address || !$tier_name || !$price_sol) {
        throw new Exception('Missing required fields: wallet_address, tier_name, price_sol');
    }
    
    // If no telegram_id, create temporary player using wallet_address hash as ID
    if (!$telegram_id) {
        // Generate temporary telegram_id from wallet_address (first 8 chars as number)
        $temp_id = abs(crc32(substr($wallet_address, 0, 8))) % 1000000000; // Max 9 digits
        $telegram_id = $temp_id;
        error_log("⚠️ No telegram_id provided, using temporary ID from wallet: $telegram_id");
    }
    
    error_log("💎 $tier_name SOL mint request: user=$telegram_id, wallet=$wallet_address, price=$price_sol SOL");
    
    // 1. Check if player exists by wallet_address first (for direct link users)
    $playerByWallet = supabaseQuery('players', 'GET', null, '?wallet_address=eq.' . $wallet_address);
    
    // If player found by wallet, use their telegram_id
    if ($playerByWallet['code'] === 200 && !empty($playerByWallet['data'])) {
        $existingPlayer = $playerByWallet['data'][0];
        $telegram_id = $existingPlayer['telegram_id'];
        error_log("✅ Found existing player by wallet_address: telegram_id=$telegram_id");
        $player = $playerByWallet;
    } else {
        // Check player exists by telegram_id
        $player = supabaseQuery('players', 'GET', null, '?telegram_id=eq.' . $telegram_id);
    }
    
    if ($player['code'] !== 200 || empty($player['data'])) {
        // Auto-create player with default values and wallet_address (without level/xp if not in schema)
        $username = $telegram_id < 1000000000 ? 'wallet_' . substr($wallet_address, 0, 8) : 'user_' . $telegram_id;
        $newPlayer = supabaseQuery('players', 'POST', [
            'telegram_id' => $telegram_id,
            'tama_balance' => 0,
            'username' => $username,
            'wallet_address' => $wallet_address // ✅ Save wallet_address when creating player
        ]);
        
        if ($newPlayer['code'] < 200 || $newPlayer['code'] >= 300) {
            throw new Exception('Failed to create player account');
        }
        
        // Get the newly created player
        $player = supabaseQuery('players', 'GET', null, '?telegram_id=eq.' . $telegram_id);
        if ($player['code'] !== 200 || empty($player['data'])) {
            throw new Exception('Player account created but could not be retrieved');
        }
    }
    
    // 2. Get bonding state
    $bonding = supabaseQuery('nft_bonding_state', 'GET', null, '?tier_name=eq.' . $tier_name . '&payment_type=eq.SOL');
    
    if ($bonding['code'] !== 200 || empty($bonding['data'])) {
        throw new Exception($tier_name . ' tier not configured');
    }
    
    $bondingData = $bonding['data'][0];
    $mintedCount = intval($bondingData['minted_count'] ?? 0);
    $maxSupply = intval($bondingData['max_supply'] ?? 0);
    $currentPrice = floatval($bondingData['current_price'] ?? 0);
    
    if ($mintedCount >= $maxSupply) {
        throw new Exception($tier_name . ' NFTs sold out!');
    }
    
    // 3. Verify price (5% tolerance)
    $tolerance = $currentPrice * 0.05;
    if ($price_sol < ($currentPrice - $tolerance)) {
        throw new Exception("Price changed. Expected: $currentPrice SOL, Sent: $price_sol SOL");
    }
    
    // 4. Get tier ID
    $tierIds = ['Silver' => 2, 'Gold' => 3, 'Platinum' => 4, 'Diamond' => 5];
    $rarityIds = ['Silver' => 2, 'Gold' => 3, 'Platinum' => 4, 'Diamond' => 5];
    $boosts = ['Silver' => 2.3, 'Gold' => 2.7, 'Platinum' => 3.5, 'Diamond' => 5.0];
    
    $tierId = $tierIds[$tier_name] ?? 2;
    $rarityId = $rarityIds[$tier_name] ?? 2;
    $boost = $boosts[$tier_name] ?? 2.0;
    
    // 5. Get random design
    $designs = supabaseQuery('nft_designs', 'GET', null, "?tier_id=eq.$tierId&rarity_id=eq.$rarityId&limit=100");
    
    if ($designs['code'] !== 200 || empty($designs['data'])) {
        throw new Exception("No $tier_name designs available");
    }
    
    $randomDesign = $designs['data'][array_rand($designs['data'])];
    
    // 6. Create NFT record
    $nftData = [
        'telegram_id' => $telegram_id,
        'wallet_address' => $wallet_address,
        'tier_id' => $tierId,
        'tier_name' => $tier_name,
        'rarity_id' => $rarityId,
        'design_id' => $randomDesign['id'],
        'design_number' => $randomDesign['design_number'],
        'design_theme' => $randomDesign['theme'],
        'design_variant' => $randomDesign['variant'],
        'boost_multiplier' => $boost,
        'price_paid_sol' => $price_sol,
        'price_paid_usd' => $price_sol * 164.07,
        'payment_type' => 'SOL',
        'is_active' => true
    ];
    
    $createNFT = supabaseQuery('user_nfts', 'POST', $nftData);
    
    if ($createNFT['code'] < 200 || $createNFT['code'] >= 300) {
        throw new Exception('Failed to create NFT record');
    }
    
    // 7. Update bonding state
    $newMinted = $mintedCount + 1;
    $increment = floatval($bondingData['increment_per_mint'] ?? 0);
    $newPrice = $currentPrice + $increment;
    
    $updateBonding = supabaseQuery(
        'nft_bonding_state',
        'PATCH',
        [
            'minted_count' => $newMinted,
            'current_price' => $newPrice
        ],
        '?tier_name=eq.' . $tier_name . '&payment_type=eq.SOL'
    );
    
    // 8. Update player boost and ensure wallet_address is saved
    $updateData = [
        'nft_boost_multiplier' => $boost,
        'wallet_address' => $wallet_address // ✅ Always save wallet_address after mint
    ];
    
    $updateBoost = supabaseQuery(
        'players',
        'PATCH',
        $updateData,
        '?telegram_id=eq.' . $telegram_id
    );
    
    if ($updateBoost['code'] >= 200 && $updateBoost['code'] < 300) {
        error_log("✅ Player updated with wallet_address and boost: user=$telegram_id, wallet=$wallet_address, boost=$boost");
    } else {
        error_log("⚠️ Failed to update player with wallet: code={$updateBoost['code']}");
    }
    
    error_log("✅ $tier_name NFT minted: Design=#{$randomDesign['design_number']}, User=$telegram_id, Price=$price_sol SOL");
    
    echo json_encode([
        'success' => true,
        'design_number' => $randomDesign['design_number'],
        'design_theme' => $randomDesign['theme'],
        'design_variant' => $randomDesign['variant'],
        'boost' => $boost,
        'price_sol' => $price_sol,
        'price_usd' => round($price_sol * 164.07, 2),
        'next_price_sol' => round($newPrice, 2),
        'minted_count' => $newMinted,
        'max_supply' => $maxSupply,
        'message' => "$tier_name NFT minted successfully!"
    ]);
    
} catch (Exception $e) {
    error_log("❌ SOL mint error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
