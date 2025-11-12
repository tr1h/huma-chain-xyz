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
    error_log("🔍 Step 1: Checking for player by wallet_address: $wallet_address");
    $playerByWallet = supabaseQuery('leaderboard', 'GET', null, '?wallet_address=eq.' . urlencode($wallet_address) . '&select=*');
    error_log("🔍 Player by wallet query result: code={$playerByWallet['code']}, data_count=" . (is_array($playerByWallet['data']) ? count($playerByWallet['data']) : 0));
    
    // If player found by wallet, use their telegram_id
    if ($playerByWallet['code'] === 200 && !empty($playerByWallet['data'])) {
        $existingPlayer = $playerByWallet['data'][0];
        $telegram_id = $existingPlayer['telegram_id'];
        error_log("✅ Found existing player by wallet_address: telegram_id=$telegram_id");
        $player = $playerByWallet;
    } else {
        // Check player exists by telegram_id in leaderboard table
        error_log("🔍 Step 2: Checking for player by telegram_id: $telegram_id");
        $player = supabaseQuery('leaderboard', 'GET', null, '?telegram_id=eq.' . intval($telegram_id) . '&select=*');
        error_log("🔍 Player by telegram_id query result: code={$player['code']}, data_count=" . (is_array($player['data']) ? count($player['data']) : 0));
    }
    
    if ($player['code'] !== 200 || empty($player['data'])) {
        // Auto-create player in leaderboard table with default values (same as TAMA minting)
        error_log("🔍 Step 3: Player not found, creating new player: telegram_id=$telegram_id, wallet=$wallet_address");
        // Create player with minimal fields first (same as TAMA minting)
        $playerData = [
            'telegram_id' => (int)$telegram_id, // ✅ Cast to integer - PHP will encode as JSON number
            'tama' => 0  // leaderboard uses 'tama', not 'tama_balance'
        ];
        error_log("🔍 Player data to create: " . json_encode($playerData));
        $newPlayer = supabaseQuery('leaderboard', 'POST', $playerData);
        error_log("🔍 Create player response: code={$newPlayer['code']}, data=" . json_encode($newPlayer['data'] ?? []));
        
        if ($newPlayer['code'] < 200 || $newPlayer['code'] >= 300) {
            // Check if player already exists (duplicate key error)
            if ($newPlayer['code'] === 409 || ($newPlayer['code'] === 400 && 
                (strpos(json_encode($newPlayer['data']), 'duplicate') !== false || 
                 strpos(json_encode($newPlayer['data']), 'already exists') !== false))) {
                error_log("⚠️ Player already exists (duplicate), retrieving existing player");
                $player = supabaseQuery('leaderboard', 'GET', null, '?telegram_id=eq.' . intval($telegram_id) . '&select=*');
                if ($player['code'] === 200 && !empty($player['data'])) {
                    error_log("✅ Retrieved existing player after duplicate error");
                } else {
                    $errorDetails = json_encode($newPlayer['data'] ?? ['no_data' => true]);
                    error_log("❌ Failed to create player in leaderboard: code={$newPlayer['code']}, data={$errorDetails}");
                    throw new Exception('Failed to create player account: ' . ($newPlayer['data']['message'] ?? $newPlayer['data']['hint'] ?? 'Unknown error'));
                }
            } else {
                $errorDetails = json_encode($newPlayer['data'] ?? ['no_data' => true]);
                error_log("❌ Failed to create player in leaderboard: code={$newPlayer['code']}, data={$errorDetails}");
                throw new Exception('Failed to create player account: ' . ($newPlayer['data']['message'] ?? $newPlayer['data']['hint'] ?? 'Unknown error'));
            }
        } else {
            // Get the newly created player
            error_log("🔍 Step 4: Retrieving newly created player");
            $player = supabaseQuery('leaderboard', 'GET', null, '?telegram_id=eq.' . intval($telegram_id) . '&select=*');
            if ($player['code'] !== 200 || empty($player['data'])) {
                error_log("❌ Player created but retrieval failed: code={$player['code']}");
                throw new Exception('Player account created but could not be retrieved');
            }
            error_log("✅ Player successfully created and retrieved");
            
            // Update wallet_address after creation (separate update to avoid issues)
            error_log("🔍 Step 5: Updating wallet_address for newly created player");
            $updateWallet = supabaseQuery('leaderboard', 'PATCH', [
                'wallet_address' => $wallet_address
            ], '?telegram_id=eq.' . intval($telegram_id));
            if ($updateWallet['code'] >= 200 && $updateWallet['code'] < 300) {
                error_log("✅ Wallet address updated successfully");
            } else {
                error_log("⚠️ Failed to update wallet_address: code={$updateWallet['code']}, but continuing...");
            }
        }
    } else {
        error_log("✅ Player already exists, skipping creation");
        // Update wallet_address if it's different or missing
        $existingPlayerData = $player['data'][0];
        if (empty($existingPlayerData['wallet_address']) || $existingPlayerData['wallet_address'] !== $wallet_address) {
            error_log("🔍 Updating wallet_address for existing player: old=" . ($existingPlayerData['wallet_address'] ?? 'null') . ", new=$wallet_address");
            $updateWallet = supabaseQuery('leaderboard', 'PATCH', [
                'wallet_address' => $wallet_address
            ], '?telegram_id=eq.' . intval($telegram_id));
            if ($updateWallet['code'] >= 200 && $updateWallet['code'] < 300) {
                error_log("✅ Wallet address updated successfully");
            } else {
                error_log("⚠️ Failed to update wallet_address: code={$updateWallet['code']}");
            }
        }
    }
    
    // 2. Get random Bronze design (use tier_name like TAMA minting for consistency)
    $designs = supabaseQuery('nft_designs', 'GET', null, '?tier_name=eq.Bronze&is_minted=eq.false&select=*&limit=100');

    if ($designs['code'] !== 200 || empty($designs['data'])) {
        error_log("❌ No Bronze designs found in nft_designs table!");
        error_log("   Query used: tier_name=eq.Bronze&is_minted=eq.false");
        throw new Exception('No Bronze designs available. Please contact support to add NFT designs to the database.');
    }
    
    error_log("✅ Found " . count($designs['data']) . " Bronze design(s)");
    
    // Filter out designs already owned by the user (use nft_design_id, not design_id)
    $userNfts = supabaseQuery('user_nfts', 'GET', null, '?telegram_id=eq.' . intval($telegram_id) . '&is_active=eq.true&select=nft_design_id');
    $ownedDesignIds = array_column($userNfts['data'] ?? [], 'nft_design_id');
    
    $availableDesigns = array_filter($designs['data'], function($design) use ($ownedDesignIds) {
        return !in_array($design['id'], $ownedDesignIds);
    });

    if (empty($availableDesigns)) {
        throw new Exception('No unique Bronze designs available for this player.');
    }

    $randomDesign = $availableDesigns[array_rand($availableDesigns)];
    $designNumber = $randomDesign['design_number'] ?? 'N/A';
    error_log("🎨 Selected design: id={$randomDesign['id']}, design_number={$designNumber}");

    // 3. Create NFT record using RPC function (same as TAMA minting for consistency)
    $nftMintAddress = 'bronze_sol_' . $telegram_id . '_' . time() . '_' . $randomDesign['id'];
    
    // Use RPC function to create NFT (bypasses PostgREST type issues)
    $rpcUrl = SUPABASE_URL . '/rest/v1/rpc/insert_user_nft';
    $rpcData = [
        'p_telegram_id' => (string)$telegram_id, // ✅ RPC function accepts TEXT and casts to BIGINT
        'p_nft_design_id' => (int)$randomDesign['id'],
        'p_nft_mint_address' => $nftMintAddress,
        'p_tier_name' => 'Bronze',
        'p_rarity' => 'Common',
        'p_earning_multiplier' => 2.0,
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
    
    // 4. Update NFT with SOL payment details (if these fields exist in schema)
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
    
    // Mark design as minted (same as TAMA minting)
    $markMinted = supabaseQuery('nft_designs', 'PATCH', [
        'is_minted' => true,
        'minted_by' => intval($telegram_id),
        'minted_at' => date('Y-m-d\TH:i:s.u\Z')
    ], '?id=eq.' . $randomDesign['id']);
    
    if ($markMinted['code'] >= 200 && $markMinted['code'] < 300) {
        error_log("✅ Design marked as minted: design_id={$randomDesign['id']}");
    } else {
        error_log("⚠️ Failed to mark design as minted: code={$markMinted['code']}");
        // Don't throw - NFT is already created, this is just metadata
    }

    // 5. Update minted count for Bronze_SOL tier
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

    // 6. Apply boost to user and ensure wallet_address is saved in leaderboard
    $updateData = [
        'nft_boost_multiplier' => 2.0,
        'wallet_address' => $wallet_address // ✅ Always save wallet_address after mint
    ];
    
    $updatePlayerBoost = supabaseQuery(
        'leaderboard',
        'PATCH',
        $updateData,
        '?telegram_id=eq.' . intval($telegram_id) // ✅ Convert to integer
    );
    
    if ($updatePlayerBoost['code'] >= 200 && $updatePlayerBoost['code'] < 300) {
        error_log("✅ Player updated with wallet_address and boost: user=$telegram_id, wallet=$wallet_address");
    } else {
        error_log("⚠️ Failed to update player with wallet: code={$updatePlayerBoost['code']}");
    }

    $finalDesignNumber = $randomDesign['design_number'] ?? 'N/A';
    error_log("✅ Bronze SOL NFT minted: ID=$nft_id, Design=#$finalDesignNumber, Price=$price_sol SOL");

    echo json_encode([
        'success' => true,
        'nft_id' => $nft_id,
        'design_number' => $randomDesign['design_number'] ?? null,
        'design_theme' => $randomDesign['design_theme'] ?? null,
        'design_variant' => $randomDesign['design_variant'] ?? null,
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

