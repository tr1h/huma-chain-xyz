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

require_once __DIR__ . '/config.php';

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
    
    // Start transaction
    $pdo->beginTransaction();
    
    // 1. Get current bonding state for Bronze_SOL
    $stmt = $pdo->prepare("
        SELECT * FROM nft_bonding_state 
        WHERE tier_name = 'Bronze_SOL' AND payment_type = 'SOL'
        FOR UPDATE
    ");
    $stmt->execute();
    $bonding = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$bonding) {
        throw new Exception('Bronze SOL tier not configured');
    }
    
    // 2. Check if sold out
    if ($bonding['minted_count'] >= $bonding['max_supply']) {
        throw new Exception('Bronze SOL NFTs sold out!');
    }
    
    // 3. Verify price (allow 5% tolerance for network delays)
    $expected_price = floatval($bonding['current_price']);
    $sent_price = floatval($price_sol);
    $tolerance = $expected_price * 0.05;
    
    if ($sent_price < ($expected_price - $tolerance)) {
        throw new Exception("Price mismatch. Expected: $expected_price SOL, Sent: $sent_price SOL");
    }
    
    // 4. Get random Bronze design
    $stmt = $pdo->prepare("
        SELECT * FROM nft_designs 
        WHERE tier_id = 1 
          AND rarity_id = 1
          AND id NOT IN (SELECT design_id FROM user_nfts WHERE is_active = TRUE)
        ORDER BY RANDOM()
        LIMIT 1
    ");
    $stmt->execute();
    $design = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$design) {
        throw new Exception('No Bronze designs available');
    }
    
    // 5. Insert into user_nfts
    $stmt = $pdo->prepare("
        INSERT INTO user_nfts (
            telegram_id,
            wallet_address,
            tier_id,
            tier_name,
            rarity_id,
            design_id,
            design_number,
            design_theme,
            design_variant,
            boost_multiplier,
            price_paid_sol,
            price_paid_usd,
            payment_type,
            is_active,
            minted_at
        ) VALUES (
            :telegram_id,
            :wallet_address,
            1,
            'Bronze',
            1,
            :design_id,
            :design_number,
            :design_theme,
            :design_variant,
            2.0,
            :price_sol,
            :price_usd,
            'SOL',
            TRUE,
            NOW()
        )
        RETURNING id
    ");
    
    $price_usd = $sent_price * 164.07; // SOL to USD
    
    $stmt->execute([
        ':telegram_id' => $telegram_id,
        ':wallet_address' => $wallet_address,
        ':design_id' => $design['id'],
        ':design_number' => $design['design_number'],
        ':design_theme' => $design['theme'],
        ':design_variant' => $design['variant'],
        ':price_sol' => $sent_price,
        ':price_usd' => $price_usd
    ]);
    
    $nft_id = $pdo->lastInsertId();
    
    // 6. Update minted count (price stays fixed at 0.15 SOL)
    $new_minted = $bonding['minted_count'] + 1;
    
    $stmt = $pdo->prepare("
        UPDATE nft_bonding_state
        SET 
            minted_count = :new_minted,
            updated_at = NOW()
        WHERE tier_name = 'Bronze_SOL'
    ");
    
    $stmt->execute([
        ':new_minted' => $new_minted
    ]);
    
    // 7. Apply boost to user
    $stmt = $pdo->prepare("
        UPDATE players
        SET 
            nft_boost_multiplier = GREATEST(nft_boost_multiplier, 2.0),
            updated_at = NOW()
        WHERE telegram_id = :telegram_id
    ");
    $stmt->execute([':telegram_id' => $telegram_id]);
    
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
            
            // Check if sol_distributions table exists
            $check_table = $pdo->query("
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'sol_distributions'
                )
            ");
            $table_exists = $check_table->fetchColumn();
            
            if ($table_exists) {
                // Log main treasury
                $dist_stmt = $pdo->prepare("
                    INSERT INTO sol_distributions (
                        transaction_signature,
                        from_wallet,
                        to_wallet,
                        amount_sol,
                        percentage,
                        distribution_type,
                        nft_tier,
                        telegram_id,
                        status,
                        created_at
                    ) VALUES (:tx_sig, :from_wallet, :to_wallet, :amount, :percentage, 'main', :tier, :telegram_id, 'pending', NOW())
                ");
                
                $dist_stmt->execute([
                    ':tx_sig' => $transaction_signature,
                    ':from_wallet' => $wallet_address,
                    ':to_wallet' => $treasury_main,
                    ':amount' => $amounts['main'],
                    ':percentage' => 50,
                    ':tier' => 'Bronze',
                    ':telegram_id' => $telegram_id
                ]);
                
                // Log liquidity treasury
                $dist_stmt->execute([
                    ':tx_sig' => $transaction_signature,
                    ':from_wallet' => $wallet_address,
                    ':to_wallet' => $treasury_liquidity,
                    ':amount' => $amounts['liquidity'],
                    ':percentage' => 30,
                    ':tier' => 'Bronze',
                    ':telegram_id' => $telegram_id
                ]);
                
                // Log team treasury
                $dist_stmt->execute([
                    ':tx_sig' => $transaction_signature,
                    ':from_wallet' => $wallet_address,
                    ':to_wallet' => $treasury_team,
                    ':amount' => $amounts['team'],
                    ':percentage' => 20,
                    ':tier' => 'Bronze',
                    ':telegram_id' => $telegram_id
                ]);
                
                $distribution_logged = true;
                error_log("✅ SOL distribution logged successfully");
            } else {
                error_log("⚠️ sol_distributions table not found, skipping distribution log");
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
        $stmt = $pdo->prepare("SELECT telegram_username, tama FROM leaderboard WHERE telegram_id = :telegram_id LIMIT 1");
        $stmt->execute([':telegram_id' => $telegram_id]);
        $user_row = $stmt->fetch(PDO::FETCH_ASSOC);
        $username = $user_row['telegram_username'] ?? 'user_' . $telegram_id;
        $current_balance = floatval($user_row['tama'] ?? 0);
        
        // Convert SOL price to TAMA equivalent
        $tama_equivalent = $sent_price * 32800; // 1 SOL ≈ 32,800 TAMA
        
        // Log NFT mint transaction
        $log_stmt = $pdo->prepare("
            INSERT INTO transactions (
                user_id,
                username,
                type,
                amount,
                balance_before,
                balance_after,
                metadata,
                created_at
            ) VALUES (:user_id, :username, 'nft_mint_sol', :amount, :balance_before, :balance_after, :metadata, NOW())
        ");
        
        $metadata = json_encode([
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
        ]);
        
        $log_stmt->execute([
            ':user_id' => (string)$telegram_id,
            ':username' => $username,
            ':amount' => -$tama_equivalent,
            ':balance_before' => $current_balance,
            ':balance_after' => $current_balance,
            ':metadata' => $metadata
        ]);
        
        error_log("✅ Transaction logged: Bronze NFT mint (SOL Express) for user $telegram_id");
        
        // Log SOL distribution transactions if signature provided
        if ($transaction_signature) {
            $treasury_main = getenv('TREASURY_MAIN') ?: '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM';
            $treasury_liquidity = getenv('TREASURY_LIQUIDITY') ?: 'CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1';
            $treasury_team = getenv('TREASURY_TEAM') ?: 'Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8';
            
            // Treasury Main (50%)
            $log_stmt->execute([
                ':user_id' => $treasury_main,
                ':username' => '💰 Treasury Main',
                ':amount' => $sent_price * 0.50 * 32800,
                ':balance_before' => 0,
                ':balance_after' => 0,
                ':metadata' => json_encode([
                    'source' => 'bronze_nft_mint_sol',
                    'user' => $telegram_id,
                    'percentage' => 50,
                    'amount_sol' => $sent_price * 0.50,
                    'transaction_signature' => $transaction_signature
                ])
            ]);
            
            // Treasury Liquidity (30%)
            $log_stmt->execute([
                ':user_id' => $treasury_liquidity,
                ':username' => '💧 Treasury Liquidity',
                ':amount' => $sent_price * 0.30 * 32800,
                ':balance_before' => 0,
                ':balance_after' => 0,
                ':metadata' => json_encode([
                    'source' => 'bronze_nft_mint_sol',
                    'user' => $telegram_id,
                    'percentage' => 30,
                    'amount_sol' => $sent_price * 0.30,
                    'transaction_signature' => $transaction_signature
                ])
            ]);
            
            // Treasury Team (20%)
            $log_stmt->execute([
                ':user_id' => $treasury_team,
                ':username' => '👥 Treasury Team',
                ':amount' => $sent_price * 0.20 * 32800,
                ':balance_before' => 0,
                ':balance_after' => 0,
                ':metadata' => json_encode([
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
    
    // Commit transaction
    $pdo->commit();
    
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
        'max_supply' => $bonding['max_supply'],
        'message' => 'Bronze NFT minted successfully! Fixed price: 0.15 SOL',
        'distribution_logged' => $distribution_logged,
        'transaction_signature' => $transaction_signature
    ]);
    
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    error_log("❌ Bronze SOL mint error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

