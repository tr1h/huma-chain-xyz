<?php
/**
 * Mint SOL-based NFTs (Silver, Gold, Platinum, Diamond) - Supabase REST API Version
 * NO DATABASE PASSWORD NEEDED!
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');

// Additional CORS headers for safety
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

require_once __DIR__ . '/config.php'; // For SUPABASE_URL and SUPABASE_KEY

// Helper function for Supabase REST API calls
function supabaseQuery($table, $method, $data = null, $params = '') {
    $url = SUPABASE_URL . '/rest/v1/' . $table . $params;
    $headers = [
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Content-Type: application/json',
        'Prefer: return=representation' // Ensures data is returned on insert/update
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    if ($data && ($method === 'POST' || $method === 'PATCH')) {
        // Ensure integers are sent as numbers, not strings in JSON
        $jsonData = json_encode($data);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['code' => $httpCode, 'data' => json_decode($response, true)];
}

// Function to assign random rarity based on tier
function assignRandomRarity($tier_name) {
    $rand = mt_rand(1, 100);
    
    switch ($tier_name) {
        case 'Silver':
            // Common (40%), Uncommon (30%), Rare (20%), Epic (8%), Legendary (2%)
            if ($rand <= 40) return ['rarity' => 'Common', 'multiplier' => 2.5];
            if ($rand <= 70) return ['rarity' => 'Uncommon', 'multiplier' => 2.7];
            if ($rand <= 90) return ['rarity' => 'Rare', 'multiplier' => 3.0];
            if ($rand <= 98) return ['rarity' => 'Epic', 'multiplier' => 3.3];
            return ['rarity' => 'Legendary', 'multiplier' => 3.5];
            
        case 'Gold':
            // Common (30%), Uncommon (30%), Rare (20%), Epic (15%), Legendary (5%)
            if ($rand <= 30) return ['rarity' => 'Common', 'multiplier' => 3.0];
            if ($rand <= 60) return ['rarity' => 'Uncommon', 'multiplier' => 3.2];
            if ($rand <= 80) return ['rarity' => 'Rare', 'multiplier' => 3.5];
            if ($rand <= 95) return ['rarity' => 'Epic', 'multiplier' => 3.8];
            return ['rarity' => 'Legendary', 'multiplier' => 4.0];
            
        case 'Platinum':
            // Common (20%), Uncommon (25%), Rare (25%), Epic (20%), Legendary (10%)
            if ($rand <= 20) return ['rarity' => 'Common', 'multiplier' => 4.0];
            if ($rand <= 45) return ['rarity' => 'Uncommon', 'multiplier' => 4.2];
            if ($rand <= 70) return ['rarity' => 'Rare', 'multiplier' => 4.5];
            if ($rand <= 90) return ['rarity' => 'Epic', 'multiplier' => 4.8];
            return ['rarity' => 'Legendary', 'multiplier' => 5.0];
            
        case 'Diamond':
            // Only Epic (50%) and Legendary (50%)
            if ($rand <= 50) return ['rarity' => 'Epic', 'multiplier' => 5.0];
            return ['rarity' => 'Legendary', 'multiplier' => 6.0];
            
        default:
            return ['rarity' => 'Common', 'multiplier' => 2.0];
    }
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
    
    // Validate tier
    $validTiers = ['Silver', 'Gold', 'Platinum', 'Diamond'];
    if (!in_array($tier_name, $validTiers)) {
        throw new Exception("Invalid tier. Must be one of: " . implode(', ', $validTiers));
    }
    
    // If no telegram_id, create temporary player using wallet_address hash as ID
    if (!$telegram_id) {
        // Generate temporary telegram_id from wallet_address (first 8 chars as number)
        $temp_id = abs(crc32(substr($wallet_address, 0, 8))) % 1000000000; // Max 9 digits
        $telegram_id = $temp_id;
        error_log("⚠️ No telegram_id provided, using temporary ID from wallet: $telegram_id");
    }
    
    error_log("💎 $tier_name SOL mint request: user=$telegram_id, wallet=$wallet_address, price=$price_sol SOL");
    
    // 1. Check if player exists (optional for SOL minting - only needed for boost update at the end)
    error_log("🔍 Step 1: Checking for player by wallet_address: $wallet_address");
    $playerByWallet = supabaseQuery('leaderboard', 'GET', null, '?wallet_address=eq.' . urlencode($wallet_address) . '&select=*');
    error_log("🔍 Player by wallet query result: code={$playerByWallet['code']}, data_count=" . (is_array($playerByWallet['data']) ? count($playerByWallet['data']) : 0));
    
    $playerExists = false;
    $playerData = null;
    
    // If player found by wallet, use their telegram_id
    if ($playerByWallet['code'] === 200 && !empty($playerByWallet['data'])) {
        $existingPlayer = $playerByWallet['data'][0];
        $telegram_id = $existingPlayer['telegram_id'];
        error_log("✅ Found existing player by wallet_address: telegram_id=$telegram_id");
        $playerExists = true;
        $playerData = $existingPlayer;
    } else {
        // Check player exists by telegram_id in leaderboard table
        error_log("🔍 Step 2: Checking for player by telegram_id: $telegram_id");
        $player = supabaseQuery('leaderboard', 'GET', null, '?telegram_id=eq.' . intval($telegram_id) . '&select=*');
        error_log("🔍 Player by telegram_id query result: code={$player['code']}, data_count=" . (is_array($player['data']) ? count($player['data']) : 0));
        
        if ($player['code'] === 200 && !empty($player['data'])) {
            error_log("✅ Player found by telegram_id");
            $playerExists = true;
            $playerData = $player['data'][0];
            
            // Update wallet_address if it's different or missing
            if (empty($playerData['wallet_address']) || $playerData['wallet_address'] !== $wallet_address) {
                error_log("🔍 Updating wallet_address for existing player");
                $updateWallet = supabaseQuery('leaderboard', 'PATCH', [
                    'wallet_address' => $wallet_address
                ], '?telegram_id=eq.' . intval($telegram_id));
                if ($updateWallet['code'] >= 200 && $updateWallet['code'] < 300) {
                    error_log("✅ Wallet address updated successfully");
                } else {
                    error_log("⚠️ Failed to update wallet_address: code={$updateWallet['code']}");
                }
            }
        } else {
            error_log("⚠️ Player not found in leaderboard, will be created by bot later. Continuing with NFT creation...");
            // Don't create player here - let the bot handle it
            // This avoids issues with missing required fields
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
    if ($price_sol < ($currentPrice - $tolerance) || $price_sol > ($currentPrice + $tolerance)) {
        throw new Exception("Price changed. Expected: $currentPrice SOL, Sent: $price_sol SOL");
    }
    
    // 4. Get random design (use tier_name like Bronze minting for consistency)
    $designs = supabaseQuery('nft_designs', 'GET', null, '?tier_name=eq.' . $tier_name . '&is_minted=eq.false&select=*&limit=100');
    
    if ($designs['code'] !== 200 || empty($designs['data'])) {
        error_log("❌ No $tier_name designs found in nft_designs table!");
        error_log("   Query used: tier_name=eq.$tier_name&is_minted=eq.false");
        throw new Exception("No $tier_name designs available. Please contact support to add NFT designs to the database.");
    }
    
    error_log("✅ Found " . count($designs['data']) . " $tier_name design(s)");
    
    // Filter out designs already owned by the user (use nft_design_id, not design_id)
    $userNfts = supabaseQuery('user_nfts', 'GET', null, '?telegram_id=eq.' . intval($telegram_id) . '&is_active=eq.true&select=nft_design_id');
    $ownedDesignIds = array_column($userNfts['data'] ?? [], 'nft_design_id');
    
    $availableDesigns = array_filter($designs['data'], function($design) use ($ownedDesignIds) {
        return !in_array($design['id'], $ownedDesignIds);
    });

    if (empty($availableDesigns)) {
        throw new Exception("No unique $tier_name designs available for this player.");
    }

    $randomDesign = $availableDesigns[array_rand($availableDesigns)];
    $designNumber = $randomDesign['design_number'] ?? 'N/A';
    error_log("🎨 Selected design: id={$randomDesign['id']}, design_number={$designNumber}");
    
    // 5. Assign random rarity and multiplier
    $rarityData = assignRandomRarity($tier_name);
    $rarity = $rarityData['rarity'];
    $earning_multiplier = $rarityData['multiplier'];
    error_log("🎲 Assigned rarity: $rarity (multiplier: {$earning_multiplier}x)");
    
    // 6. Create NFT record using RPC function (same as Bronze minting for consistency)
    $nftMintAddress = strtolower($tier_name) . '_sol_' . $telegram_id . '_' . time() . '_' . $randomDesign['id'];
    
    // Use RPC function to create NFT (bypasses PostgREST type issues)
    $rpcUrl = SUPABASE_URL . '/rest/v1/rpc/insert_user_nft';
    $rpcData = [
        'p_telegram_id' => (string)$telegram_id, // ✅ RPC function accepts TEXT and casts to BIGINT
        'p_nft_design_id' => (int)$randomDesign['id'],
        'p_nft_mint_address' => $nftMintAddress,
        'p_tier_name' => $tier_name,
        'p_rarity' => $rarity,
        'p_earning_multiplier' => $earning_multiplier,
        'p_purchase_price_tama' => 0, // SOL payment, no TAMA
        'p_is_active' => true
    ];
    
    $rpcHeaders = [
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ];
    
    $ch = curl_init($rpcUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $rpcHeaders);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($rpcData));
    
    $rpcResponse = curl_exec($ch);
    $rpcHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($rpcHttpCode < 200 || $rpcHttpCode >= 300) {
        $errorData = json_decode($rpcResponse, true);
        error_log("❌ RPC function failed: code={$rpcHttpCode}, data=" . json_encode($errorData));
        throw new Exception('Failed to create NFT record: ' . ($errorData['message'] ?? 'Unknown error'));
    }
    
    $rpcResult = json_decode($rpcResponse, true);
    $nftData = is_array($rpcResult) && isset($rpcResult[0]) ? $rpcResult[0] : $rpcResult;
    $nft_id = $nftData['id'] ?? null;
    
    if (!$nft_id) {
        throw new Exception('NFT created but ID not returned');
    }
    
    // 7. Update NFT with SOL payment details (if these fields exist in schema)
    $SOL_USD_RATE = 164.07;
    $price_usd = $price_sol * $SOL_USD_RATE;
    
    $updateNft = supabaseQuery('user_nfts', 'PATCH', [
        'wallet_address' => $wallet_address,
        'price_paid_sol' => $price_sol,
        'price_paid_usd' => round($price_usd, 2),
        'payment_type' => 'SOL'
    ], '?id=eq.' . $nft_id);
    
    if ($updateNft['code'] >= 200 && $updateNft['code'] < 300) {
        error_log("✅ NFT updated with SOL payment details: nft_id=$nft_id");
    } else {
        error_log("⚠️ Failed to update NFT with SOL details: code={$updateNft['code']}");
        // Don't throw - NFT is already created, this is just metadata
    }
    
    // 8. Mark design as minted (same as Bronze minting)
    $markMinted = supabaseQuery('nft_designs', 'PATCH', [
        'is_minted' => true,
        'minted_by' => intval($telegram_id),
        'minted_at' => date('Y-m-d\TH:i:s.u\Z')
    ], '?id=eq.' . $randomDesign['id']);
    
    if ($markMinted['code'] >= 200 && $markMinted['code'] < 300) {
        error_log("✅ Design marked as minted: design_id={$randomDesign['id']}");
    } else {
        error_log("⚠️ Failed to mark design as minted: code={$markMinted['code']}");
        // Don't throw - NFT is already created
    }
    
    // 9. Update bonding state
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
    
    if ($updateBonding['code'] >= 200 && $updateBonding['code'] < 300) {
        error_log("✅ Bonding state updated: minted_count=$newMinted, new_price=$newPrice");
    } else {
        error_log("⚠️ Failed to update bonding state: code={$updateBonding['code']}");
        // Don't throw - NFT is already created
    }
    
    // 10. Apply boost to user and ensure wallet_address is saved in leaderboard (if player exists)
    if ($playerExists) {
        $updateData = [
            'nft_boost_multiplier' => $earning_multiplier,
            'wallet_address' => $wallet_address // ✅ Always save wallet_address after mint
        ];
        
        $updatePlayerBoost = supabaseQuery(
            'leaderboard',
            'PATCH',
            $updateData,
            '?telegram_id=eq.' . intval($telegram_id) // ✅ Convert to integer
        );
        
        if ($updatePlayerBoost['code'] >= 200 && $updatePlayerBoost['code'] < 300) {
            error_log("✅ Player updated with wallet_address and boost: user=$telegram_id, wallet=$wallet_address, boost={$earning_multiplier}x");
        } else {
            error_log("⚠️ Failed to update player with wallet: code={$updatePlayerBoost['code']}");
        }
    } else {
        error_log("⚠️ Player doesn't exist in leaderboard, skipping boost update. Bot will handle player creation.");
    }
    
    error_log("✅ $tier_name NFT minted: Design=#$designNumber ($rarity), User=$telegram_id, Price=$price_sol SOL, Multiplier={$earning_multiplier}x");
    
    echo json_encode([
        'success' => true,
        'design_number' => $designNumber,
        'rarity' => $rarity,
        'earning_multiplier' => $earning_multiplier,
        'price_sol' => $price_sol,
        'price_usd' => round($price_usd, 2),
        'next_price_sol' => round($newPrice, 2),
        'minted_count' => $newMinted,
        'max_supply' => $maxSupply,
        'message' => "$tier_name NFT ($rarity) minted successfully!"
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
