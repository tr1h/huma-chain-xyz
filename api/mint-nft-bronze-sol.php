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
    
    // 6. Update bonding curve
    $new_price = $expected_price + floatval($bonding['increment_per_mint']);
    $new_minted = $bonding['minted_count'] + 1;
    
    $stmt = $pdo->prepare("
        UPDATE nft_bonding_state
        SET 
            current_price = :new_price,
            minted_count = :new_minted,
            updated_at = NOW()
        WHERE tier_name = 'Bronze_SOL'
    ");
    
    $stmt->execute([
        ':new_price' => $new_price,
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
    
    // Commit transaction
    $pdo->commit();
    
    error_log("✅ Bronze SOL NFT minted: ID=$nft_id, Design=#{$design['design_number']}, Price=$sent_price SOL");
    
    echo json_encode([
        'success' => true,
        'nft_id' => $nft_id,
        'design_number' => $design['design_number'],
        'design_theme' => $design['theme'],
        'design_variant' => $design['variant'],
        'boost_multiplier' => 2.0,
        'price_sol' => $sent_price,
        'price_usd' => round($price_usd, 2),
        'next_price_sol' => round($new_price, 4),
        'minted_count' => $new_minted,
        'max_supply' => $bonding['max_supply'],
        'message' => 'Bronze NFT minted successfully (SOL)!'
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

