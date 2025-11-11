<?php
// ============================================
// MINT BRONZE NFT (SOL PAYMENT - 0.15 SOL FIXED) - REST API VERSION
// ============================================

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
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        error_log("Supabase cURL Error ($method $url): " . $error);
        return ['code' => 500, 'error' => $error];
    }

    $responseData = json_decode($response, true);
    return ['code' => $httpCode, 'data' => $responseData];
}

try {
    // Get POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    $telegram_id = $data['telegram_id'] ?? null;
    $wallet_address = $data['wallet_address'] ?? null;
    $price_sol = floatval($data['price_sol'] ?? 0);
    $transaction_signature = $data['transaction_signature'] ?? null;
    
    if (!$wallet_address) {
        throw new Exception('Missing wallet_address');
    }
    
    // If no telegram_id, create temporary player using wallet_address hash as ID
    if (!$telegram_id) {
        // Generate temporary telegram_id from wallet_address (first 8 chars as number)
        $temp_id = abs(crc32(substr($wallet_address, 0, 8))) % 1000000000; // Max 9 digits
        $telegram_id = $temp_id;
        error_log("⚠️ No telegram_id provided, using temporary ID from wallet: $telegram_id");
    }
    
    // Fixed price for Bronze SOL: 0.15 SOL
    $expected_price = 0.15;
    $tolerance = $expected_price * 0.05; // 5% tolerance
    
    if ($price_sol < ($expected_price - $tolerance) || $price_sol > ($expected_price + $tolerance)) {
        throw new Exception("Invalid price. Expected: $expected_price SOL, Received: $price_sol SOL");
    }
    
    error_log("🟫⚡ Bronze SOL mint request: user=$telegram_id, wallet=$wallet_address, price=$price_sol SOL");
    
    // 1. Check if player exists by wallet_address first (for direct link users)
    $playerByWallet = supabaseQuery('players', 'GET', null, '?wallet_address=eq.' . $wallet_address . '&select=*');
    
    // If player found by wallet, use their telegram_id
    if ($playerByWallet['code'] === 200 && !empty($playerByWallet['data'])) {
        $existingPlayer = $playerByWallet['data'][0];
        $telegram_id = $existingPlayer['telegram_id'];
        error_log("✅ Found existing player by wallet_address: telegram_id=$telegram_id");
        $player = $playerByWallet;
    } else {
        // Check player exists by telegram_id
        $player = supabaseQuery('players', 'GET', null, '?telegram_id=eq.' . $telegram_id . '&select=*');
    }
    
    if ($player['code'] !== 200 || empty($player['data'])) {
        // Auto-create player with default values (without level/xp if not in schema)
        $username = $telegram_id < 1000000000 ? 'wallet_' . substr($wallet_address, 0, 8) : 'user_' . $telegram_id;
        $newPlayer = supabaseQuery('players', 'POST', [
            'telegram_id' => (int)$telegram_id, // ✅ Cast to integer
            'tama_balance' => 0,
            'username' => $username,
            'wallet_address' => $wallet_address
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
    
    // 2. Get random Bronze design
    $designs = supabaseQuery('nft_designs', 'GET', null, '?tier_id=eq.1&rarity_id=eq.1&select=*');

    if ($designs['code'] !== 200 || empty($designs['data'])) {
        throw new Exception('No Bronze designs available');
    }
    
    // Filter out designs already owned by the user
    $userNfts = supabaseQuery('user_nfts', 'GET', null, '?telegram_id=eq.' . $telegram_id . '&is_active=eq.TRUE&select=design_id');
    $ownedDesignIds = array_column($userNfts['data'] ?? [], 'design_id');
    
    $availableDesigns = array_filter($designs['data'], function($design) use ($ownedDesignIds) {
        return !in_array($design['id'], $ownedDesignIds);
    });

    if (empty($availableDesigns)) {
        throw new Exception('No unique Bronze designs available for this player.');
    }

    $randomIndex = array_rand($availableDesigns);
    $design = $availableDesigns[$randomIndex];

    // 3. Insert into user_nfts
    $SOL_USD_RATE = 164.07; // Hardcoded for now
    $price_usd = $price_sol * $SOL_USD_RATE;

    $insertNft = supabaseQuery('user_nfts', 'POST', [
        'telegram_id' => (int)$telegram_id, // ✅ Cast to integer
        'wallet_address' => $wallet_address,
        'tier_id' => 1,
        'tier_name' => 'Bronze',
        'rarity_id' => 1,
        'design_id' => $design['id'],
        'design_number' => $design['design_number'],
        'design_theme' => $design['theme'],
        'design_variant' => $design['variant'],
        'boost_multiplier' => 2.0,
        'price_paid_sol' => $price_sol,
        'price_paid_usd' => round($price_usd, 2),
        'payment_type' => 'SOL',
        'is_active' => true
    ]);

    if ($insertNft['code'] !== 201 || empty($insertNft['data'])) {
        error_log("❌ Failed to insert NFT: code={$insertNft['code']}, data=" . json_encode($insertNft['data']));
        throw new Exception('Failed to mint NFT.');
    }
    $nft_id = $insertNft['data'][0]['id'];

    // 4. Update minted count for Bronze_SOL tier
    $bonding = supabaseQuery('nft_bonding_state', 'GET', null, '?tier_name=eq.Bronze_SOL&payment_type=eq.SOL&select=*');
    if ($bonding['code'] !== 200 || empty($bonding['data'])) {
        // Create Bronze_SOL tier if not exists
        $createBonding = supabaseQuery('nft_bonding_state', 'POST', [
            'tier_name' => 'Bronze_SOL',
            'payment_type' => 'SOL',
            'current_price' => 0.15,
            'minted_count' => 1,
            'max_supply' => 4500,
            'increment_per_mint' => 0
        ]);
        $newMintedCount = 1;
    } else {
        $bondingData = $bonding['data'][0];
        $newMintedCount = $bondingData['minted_count'] + 1;

        $updateBonding = supabaseQuery(
            'nft_bonding_state', 
            'PATCH', 
            ['minted_count' => $newMintedCount], 
            '?tier_name=eq.Bronze_SOL&payment_type=eq.SOL'
        );

        if ($updateBonding['code'] !== 200) {
            error_log("❌ Failed to update bonding state: code={$updateBonding['code']}, data=" . json_encode($updateBonding['data']));
        }
    }

    // 5. Log SOL distribution to transactions table (if transaction signature provided)
    $distribution_logged = false;
    if ($transaction_signature) {
        // Log 50% to Main Treasury
        $logMain = supabaseQuery('transactions', 'POST', [
            'telegram_id' => $telegram_id,
            'transaction_type' => 'nft_mint_distribution_main',
            'amount' => $price_sol * 0.50,
            'currency' => 'SOL',
            'from_wallet' => $wallet_address,
            'to_wallet' => TREASURY_MAIN,
            'status' => 'completed',
            'solana_signature' => $transaction_signature,
            'metadata' => json_encode([
                'nft_id' => $nft_id,
                'tier' => 'Bronze',
                'distribution_percentage' => 50,
                'total_price' => $price_sol
            ])
        ]);

        // Log 30% to Liquidity Treasury
        $logLiquidity = supabaseQuery('transactions', 'POST', [
            'telegram_id' => $telegram_id,
            'transaction_type' => 'nft_mint_distribution_liquidity',
            'amount' => $price_sol * 0.30,
            'currency' => 'SOL',
            'from_wallet' => $wallet_address,
            'to_wallet' => TREASURY_LIQUIDITY,
            'status' => 'completed',
            'solana_signature' => $transaction_signature,
            'metadata' => json_encode([
                'nft_id' => $nft_id,
                'tier' => 'Bronze',
                'distribution_percentage' => 30,
                'total_price' => $price_sol
            ])
        ]);

        // Log 20% to Team Treasury
        $logTeam = supabaseQuery('transactions', 'POST', [
            'telegram_id' => $telegram_id,
            'transaction_type' => 'nft_mint_distribution_team',
            'amount' => $price_sol * 0.20,
            'currency' => 'SOL',
            'from_wallet' => $wallet_address,
            'to_wallet' => TREASURY_TEAM,
            'status' => 'completed',
            'solana_signature' => $transaction_signature,
            'metadata' => json_encode([
                'nft_id' => $nft_id,
                'tier' => 'Bronze',
                'distribution_percentage' => 20,
                'total_price' => $price_sol
            ])
        ]);

        $distribution_logged = ($logMain['code'] === 201 && $logLiquidity['code'] === 201 && $logTeam['code'] === 201);
        
        if ($distribution_logged) {
            error_log("✅ SOL distribution logged for Bronze NFT mint: Main 50%, Liquidity 30%, Team 20%");
        } else {
            error_log("⚠️ Failed to log SOL distribution: Main={$logMain['code']}, Liquidity={$logLiquidity['code']}, Team={$logTeam['code']}");
        }
    }

    // 6. Apply boost to user and ensure wallet_address is saved
    $updateData = [
        'nft_boost_multiplier' => 2.0,
        'wallet_address' => $wallet_address // ✅ Always save wallet_address after mint
    ];
    
    $updatePlayerBoost = supabaseQuery(
        'players',
        'PATCH',
        $updateData,
        '?telegram_id=eq.' . $telegram_id
    );
    
    if ($updatePlayerBoost['code'] >= 200 && $updatePlayerBoost['code'] < 300) {
        error_log("✅ Player updated with wallet_address and boost: user=$telegram_id, wallet=$wallet_address");
    } else {
        error_log("⚠️ Failed to update player with wallet: code={$updatePlayerBoost['code']}");
    }

    error_log("✅ Bronze SOL NFT minted: ID=$nft_id, Design=#{$design['design_number']}, Price=$price_sol SOL");

    echo json_encode([
        'success' => true,
        'nft_id' => $nft_id,
        'design_number' => $design['design_number'],
        'design_theme' => $design['theme'],
        'design_variant' => $design['variant'],
        'boost_multiplier' => 2.0,
        'price_sol' => $price_sol,
        'price_usd' => round($price_usd, 2),
        'minted_count' => $newMintedCount,
        'max_supply' => 4500,
        'distribution_logged' => $distribution_logged,
        'message' => 'Bronze NFT (Express) minted successfully!'
    ]);

} catch (Exception $e) {
    error_log("❌ Bronze SOL mint error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

