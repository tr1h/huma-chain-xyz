<?php
// ============================================
// MINT BRONZE NFT (SOL PAYMENT)
// ============================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Supabase REST API Settings (NO DATABASE PASSWORD NEEDED!)
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
    $price_sol = $data['price_sol'] ?? null;
    
    // Validate input
    if (!$telegram_id || !$wallet_address || !$price_sol) {
        throw new Exception('Missing required fields');
    }
    
    error_log("🟫 Bronze SOL mint request: user=$telegram_id, wallet=$wallet_address, price=$price_sol SOL");
    
    $sent_price = floatval($price_sol);
    $price_usd = $sent_price * 164.07; // SOL to USD
    
    // 1. Get current bonding state for Bronze_SOL
    $bonding = supabaseQuery('nft_bonding_state', 'GET', null, '?tier_name=eq.Bronze_SOL&payment_type=eq.SOL');
    
    if ($bonding['code'] !== 200 || empty($bonding['data'])) {
        throw new Exception('Bronze SOL tier not configured');
    }
    
    $bondingData = $bonding['data'][0];
    
    // 2. Check if sold out
    if (intval($bondingData['minted_count'] ?? 0) >= intval($bondingData['max_supply'] ?? 0)) {
        throw new Exception('Bronze SOL NFTs sold out!');
    }
    
    // 3. Verify price (allow 5% tolerance for network delays)
    $expected_price = floatval($bondingData['current_price'] ?? 0.15);
    $tolerance = $expected_price * 0.05;
    
    if ($sent_price < ($expected_price - $tolerance)) {
        throw new Exception("Price mismatch. Expected: $expected_price SOL, Sent: $sent_price SOL");
    }
    
    // 4. Get random Bronze design
    $designs = supabaseQuery('nft_designs', 'GET', null, '?tier_id=eq.1&rarity_id=eq.1&limit=100');
    
    if ($designs['code'] !== 200 || empty($designs['data'])) {
        throw new Exception('No Bronze designs available');
    }
    
    $randomDesign = $designs['data'][array_rand($designs['data'])];
    $design = [
        'id' => $randomDesign['id'],
        'design_number' => $randomDesign['design_number'],
        'theme' => $randomDesign['theme'],
        'variant' => $randomDesign['variant']
    ];
    
    // 5. Insert into user_nfts
    $nftData = [
        'telegram_id' => $telegram_id,
        'wallet_address' => $wallet_address,
        'tier_id' => 1,
        'tier_name' => 'Bronze',
        'rarity_id' => 1,
        'design_id' => $design['id'],
        'design_number' => $design['design_number'],
        'design_theme' => $design['theme'],
        'design_variant' => $design['variant'],
        'boost_multiplier' => 2.0,
        'price_paid_sol' => $sent_price,
        'price_paid_usd' => $price_usd,
        'payment_type' => 'SOL',
        'is_active' => true
    ];
    
    $createNFT = supabaseQuery('user_nfts', 'POST', $nftData);
    
    if ($createNFT['code'] < 200 || $createNFT['code'] >= 300) {
        throw new Exception('Failed to create NFT record');
    }
    
    $nft_id = $createNFT['data'][0]['id'] ?? null;
    
    // 6. Update minted count (price stays fixed at 0.15 SOL)
    $new_minted = intval($bondingData['minted_count'] ?? 0) + 1;
    
    $updateBonding = supabaseQuery(
        'nft_bonding_state',
        'PATCH',
        ['minted_count' => $new_minted],
        '?tier_name=eq.Bronze_SOL&payment_type=eq.SOL'
    );
    
    // 7. Apply boost to user (create player if not exists)
    $player = supabaseQuery('players', 'GET', null, '?telegram_id=eq.' . $telegram_id);
    
    if ($player['code'] !== 200 || empty($player['data'])) {
        // Create player
        supabaseQuery('players', 'POST', [
            'telegram_id' => $telegram_id,
            'tama_balance' => 0,
            'nft_boost_multiplier' => 2.0
        ]);
    } else {
        // Update boost
        $currentBoost = floatval($player['data'][0]['nft_boost_multiplier'] ?? 0);
        $newBoost = max($currentBoost, 2.0);
        supabaseQuery(
            'players',
            'PATCH',
            ['nft_boost_multiplier' => $newBoost],
            '?telegram_id=eq.' . $telegram_id
        );
    }
    
    // 8. Log SOL distribution (if transaction signature provided)
    $transaction_signature = $data['transaction_signature'] ?? null;
    $distribution_logged = false;
    
    if ($transaction_signature) {
        try {
            // Distribution percentages
            $distribution = [
                'main' => 0.50,      // 50%
                'liquidity' => 0.30, // 30%
                'team' => 0.20       // 20%
            ];
            
            // Calculate amounts
            $amounts = [
                'main' => $sent_price * $distribution['main'],
                'liquidity' => $sent_price * $distribution['liquidity'],
                'team' => $sent_price * $distribution['team']
            ];
            
            // Treasury wallet addresses
            $treasury_main = getenv('TREASURY_MAIN') ?: '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM';
            $treasury_liquidity = getenv('TREASURY_LIQUIDITY') ?: 'CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1';
            $treasury_team = getenv('TREASURY_TEAM') ?: 'Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8';
            
            error_log("💰 SOL Distribution for Bronze NFT:");
            error_log("  🏦 Treasury Main: {$amounts['main']} SOL (50%)");
            error_log("  💧 Treasury Liquidity: {$amounts['liquidity']} SOL (30%)");
            error_log("  👥 Treasury Team: {$amounts['team']} SOL (20%)");
            
            // Try to log to sol_distributions table (may not exist)
            try {
                // Log main treasury
                supabaseQuery('sol_distributions', 'POST', [
                    'transaction_signature' => $transaction_signature,
                    'from_wallet' => $wallet_address,
                    'to_wallet' => $treasury_main,
                    'amount_sol' => $amounts['main'],
                    'percentage' => 50,
                    'distribution_type' => 'main',
                    'nft_tier' => 'Bronze',
                    'telegram_id' => $telegram_id,
                    'status' => 'pending'
                ]);
                
                // Log liquidity treasury
                supabaseQuery('sol_distributions', 'POST', [
                    'transaction_signature' => $transaction_signature,
                    'from_wallet' => $wallet_address,
                    'to_wallet' => $treasury_liquidity,
                    'amount_sol' => $amounts['liquidity'],
                    'percentage' => 30,
                    'distribution_type' => 'liquidity',
                    'nft_tier' => 'Bronze',
                    'telegram_id' => $telegram_id,
                    'status' => 'pending'
                ]);
                
                // Log team treasury
                supabaseQuery('sol_distributions', 'POST', [
                    'transaction_signature' => $transaction_signature,
                    'from_wallet' => $wallet_address,
                    'to_wallet' => $treasury_team,
                    'amount_sol' => $amounts['team'],
                    'percentage' => 20,
                    'distribution_type' => 'team',
                    'nft_tier' => 'Bronze',
                    'telegram_id' => $telegram_id,
                    'status' => 'pending'
                ]);
                
                $distribution_logged = true;
                error_log("✅ SOL distribution logged successfully");
            } catch (Exception $table_error) {
                error_log("⚠️ sol_distributions table not found or error: " . $table_error->getMessage());
            }
            
        } catch (Exception $dist_error) {
            // Don't fail mint if distribution logging fails
            error_log("⚠️ Failed to log SOL distribution: " . $dist_error->getMessage());
        }
    } else {
        error_log("ℹ️ No transaction signature provided, skipping distribution log");
    }
    
    // 9. Log transaction to transactions table
    try {
        // Get username from leaderboard
        $leaderboard = supabaseQuery('leaderboard', 'GET', null, '?telegram_id=eq.' . $telegram_id . '&select=telegram_username,tama&limit=1');
        $username = 'user_' . $telegram_id;
        $current_balance = 0;
        
        if ($leaderboard['code'] === 200 && !empty($leaderboard['data'])) {
            $username = $leaderboard['data'][0]['telegram_username'] ?? $username;
            $current_balance = floatval($leaderboard['data'][0]['tama'] ?? 0);
        }
        
        // Convert SOL price to TAMA equivalent
        $tama_equivalent = $sent_price * 32800; // 1 SOL ≈ 32,800 TAMA
        
        // Log NFT mint transaction
        $transactionData = [
            'user_id' => (string)$telegram_id,
            'username' => $username,
            'type' => 'nft_mint_sol',
            'amount' => -$tama_equivalent,
            'balance_before' => $current_balance,
            'balance_after' => $current_balance,
            'metadata' => json_encode([
                'tier' => 'Bronze',
                'design_id' => $design['id'],
                'design_number' => $design['design_number'],
                'design_theme' => $design['theme'],
                'design_variant' => $design['variant'],
                'payment_method' => 'SOL',
                'price_sol' => $sent_price,
                'price_usd' => round($sent_price * 164.07, 2),
                'tama_equivalent' => round($tama_equivalent),
                'transaction_signature' => $transaction_signature,
                'wallet_address' => $wallet_address,
                'is_express' => true
            ])
        ];
        
        $logTransaction = supabaseQuery('transactions', 'POST', $transactionData);
        
        if ($logTransaction['code'] >= 200 && $logTransaction['code'] < 300) {
            error_log("✅ Transaction logged: Bronze NFT mint (SOL Express) for user $telegram_id");
        }
        
        // Log SOL distribution transactions if signature provided
        if ($transaction_signature) {
            $treasury_main = getenv('TREASURY_MAIN') ?: '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM';
            $treasury_liquidity = getenv('TREASURY_LIQUIDITY') ?: 'CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1';
            $treasury_team = getenv('TREASURY_TEAM') ?: 'Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8';
            
            // Treasury Main (50%)
            supabaseQuery('transactions', 'POST', [
                'user_id' => $treasury_main,
                'username' => '💰 Treasury Main',
                'type' => 'treasury_income_from_nft_sol',
                'amount' => $sent_price * 0.50 * 32800,
                'balance_before' => 0,
                'balance_after' => 0,
                'metadata' => json_encode([
                    'source' => 'bronze_nft_mint_sol',
                    'user' => $telegram_id,
                    'percentage' => 50,
                    'amount_sol' => $sent_price * 0.50,
                    'transaction_signature' => $transaction_signature
                ])
            ]);
            
            // Treasury Liquidity (30%)
            supabaseQuery('transactions', 'POST', [
                'user_id' => $treasury_liquidity,
                'username' => '💧 Treasury Liquidity',
                'type' => 'treasury_liquidity_income_from_nft_sol',
                'amount' => $sent_price * 0.30 * 32800,
                'balance_before' => 0,
                'balance_after' => 0,
                'metadata' => json_encode([
                    'source' => 'bronze_nft_mint_sol',
                    'user' => $telegram_id,
                    'percentage' => 30,
                    'amount_sol' => $sent_price * 0.30,
                    'transaction_signature' => $transaction_signature
                ])
            ]);
            
            // Treasury Team (20%)
            supabaseQuery('transactions', 'POST', [
                'user_id' => $treasury_team,
                'username' => '👥 Treasury Team',
                'type' => 'treasury_team_income_from_nft_sol',
                'amount' => $sent_price * 0.20 * 32800,
                'balance_before' => 0,
                'balance_after' => 0,
                'metadata' => json_encode([
                    'source' => 'bronze_nft_mint_sol',
                    'user' => $telegram_id,
                    'percentage' => 20,
                    'amount_sol' => $sent_price * 0.20,
                    'transaction_signature' => $transaction_signature
                ])
            ]);
            
            error_log("✅ Distribution transactions logged for Bronze NFT");
        }
        
    } catch (Exception $log_error) {
        error_log("⚠️ Failed to log transaction: " . $log_error->getMessage());
    }
    
    error_log("✅ Bronze SOL NFT minted: ID=$nft_id, Design=#{$design['design_number']}, Price=$sent_price SOL (Fixed)");
    
    echo json_encode([
        'success' => true,
        'nft_id' => $nft_id,
        'design_number' => $design['design_number'],
        'design_theme' => $design['theme'],
        'design_variant' => $design['variant'],
        'boost_multiplier' => 2.0,
        'price_sol' => $sent_price,
        'price_usd' => round($price_usd, 2),
        'next_price_sol' => 0.15, // Fixed price, doesn't change!
        'minted_count' => $new_minted,
        'max_supply' => $bondingData['max_supply'],
        'message' => 'Bronze NFT minted successfully! Fixed price: 0.15 SOL',
        'distribution_logged' => $distribution_logged,
        'transaction_signature' => $transaction_signature
    ]);
    
} catch (Exception $e) {
    error_log("❌ Bronze SOL mint error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

