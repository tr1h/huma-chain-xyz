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
    $price_sol = $data['price_sol'] ?? null;
    
    if (!$telegram_id || !$wallet_address || !$tier_name || !$price_sol) {
        throw new Exception('Missing required fields');
    }
    
    error_log("💎 $tier_name SOL mint request: user=$telegram_id, wallet=$wallet_address, price=$price_sol SOL");
    
    // Map tier names to IDs and boosts
    $tierMap = [
        'Silver' => ['id' => 2, 'rarity' => 2, 'boost' => 2.3, 'passive' => 150],
        'Gold' => ['id' => 3, 'rarity' => 3, 'boost' => 2.7, 'passive' => 500],
        'Platinum' => ['id' => 4, 'rarity' => 4, 'boost' => 3.5, 'passive' => 2000],
        'Diamond' => ['id' => 5, 'rarity' => 5, 'boost' => 5.0, 'passive' => 10000]
    ];
    
    if (!isset($tierMap[$tier_name])) {
        throw new Exception('Invalid tier name');
    }
    
    $tierInfo = $tierMap[$tier_name];
    
    // 1. Get bonding state
    $bonding = supabaseQuery('nft_bonding_state', 'GET', null, "?tier_name=eq.$tier_name&payment_type=eq.SOL");
    
    if ($bonding['code'] !== 200 || empty($bonding['data'])) {
        throw new Exception("$tier_name tier not configured");
    }
    
    $bondingData = $bonding['data'][0];
    $mintedCount = intval($bondingData['minted_count'] ?? 0);
    $maxSupply = intval($bondingData['max_supply'] ?? 0);
    $currentPrice = floatval($bondingData['current_price'] ?? 0);
    $increment = floatval($bondingData['increment_per_mint'] ?? 0);
    
    if ($mintedCount >= $maxSupply) {
        throw new Exception("$tier_name NFTs sold out!");
    }
    
    // 2. Verify price (allow 5% tolerance)
    $tolerance = $currentPrice * 0.05;
    if ($price_sol < ($currentPrice - $tolerance)) {
        throw new Exception("Price mismatch. Expected: $currentPrice SOL, Sent: $price_sol SOL");
    }
    
    // 3. Get random design
    $designs = supabaseQuery('nft_designs', 'GET', null, "?tier_id=eq.{$tierInfo['id']}&rarity_id=eq.{$tierInfo['rarity']}&limit=100");
    
    if ($designs['code'] !== 200 || empty($designs['data'])) {
        throw new Exception("No $tier_name designs available");
    }
    
    $randomDesign = $designs['data'][array_rand($designs['data'])];
    
    // 4. Create NFT record
    $nftData = [
        'telegram_id' => $telegram_id,
        'wallet_address' => $wallet_address,
        'tier_id' => $tierInfo['id'],
        'tier_name' => $tier_name,
        'rarity_id' => $tierInfo['rarity'],
        'design_id' => $randomDesign['id'],
        'design_number' => $randomDesign['design_number'],
        'design_theme' => $randomDesign['theme'],
        'design_variant' => $randomDesign['variant'],
        'boost_multiplier' => $tierInfo['boost'],
        'price_paid_sol' => $price_sol,
        'price_paid_usd' => $price_sol * 164.07,
        'payment_type' => 'SOL',
        'is_active' => true
    ];
    
    $createNFT = supabaseQuery('user_nfts', 'POST', $nftData);
    
    if ($createNFT['code'] < 200 || $createNFT['code'] >= 300) {
        throw new Exception('Failed to create NFT record');
    }
    
    // 5. Update bonding state (price increases!)
    $nextPrice = $currentPrice + $increment;
    $updateBonding = supabaseQuery(
        'nft_bonding_state',
        'PATCH',
        [
            'minted_count' => $mintedCount + 1,
            'current_price' => $nextPrice
        ],
        "?tier_name=eq.$tier_name&payment_type=eq.SOL"
    );
    
    // 6. Update player boost
    $updateBoost = supabaseQuery(
        'players',
        'PATCH',
        ['nft_boost_multiplier' => $tierInfo['boost']],
        "?telegram_id=eq.$telegram_id"
    );
    
    error_log("✅ $tier_name NFT minted: Design=#{$randomDesign['design_number']}, User=$telegram_id, NextPrice=$nextPrice SOL");
    
    echo json_encode([
        'success' => true,
        'design_number' => $randomDesign['design_number'],
        'design_theme' => $randomDesign['theme'],
        'design_variant' => $randomDesign['variant'],
        'boost' => $tierInfo['boost'],
        'passive' => $tierInfo['passive'],
        'price_sol' => $price_sol,
        'price_usd' => round($price_sol * 164.07, 2),
        'next_price_sol' => $nextPrice,
        'minted_count' => $mintedCount + 1,
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
