<?php
// ============================================
// SOL PAYMENT DISTRIBUTION SYSTEM
// ============================================
// Распределяет SOL от минта NFT по кошелькам:
// - 50% Treasury Main (операционные расходы)
// - 30% Treasury Liquidity (для DEX пула)
// - 20% Treasury Team (для команды)
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

// ============================================
// WALLET ADDRESSES (DEVNET)
// ============================================
// TODO: ЗАМЕНИ НА СВОИ РЕАЛЬНЫЕ КОШЕЛЬКИ!
// ============================================

$TREASURY_MAIN = getenv('TREASURY_MAIN') ?: '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM';
$TREASURY_LIQUIDITY = getenv('TREASURY_LIQUIDITY') ?: '5kHACukYuErqSzURPTtexS7CXdqv9eJ9eNvydDz3o36z';
$TREASURY_TEAM = getenv('TREASURY_TEAM') ?: 'AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR';

// ============================================
// DISTRIBUTION PERCENTAGES (40/30/30 Standard)
// ============================================
$DISTRIBUTION = [
    'main' => 0.40,      // 40% Treasury Main
    'liquidity' => 0.30, // 30% Liquidity Pool
    'team' => 0.30       // 30% Team & Development
];

try {
    // Get POST data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $transaction_signature = $data['transaction_signature'] ?? null;
    $from_wallet = $data['from_wallet'] ?? null;
    $amount_sol = $data['amount_sol'] ?? null;
    $nft_tier = $data['nft_tier'] ?? 'Unknown';
    $telegram_id = $data['telegram_id'] ?? null;

    // Validate input
    if (!$transaction_signature || !$from_wallet || !$amount_sol) {
        throw new Exception('Missing required fields');
    }

    // 🔐 SECURITY CHECK: Prevent Replay Attacks
    $check_stmt = $pdo->prepare("SELECT id FROM sol_distributions WHERE transaction_signature = :sig LIMIT 1");
    $check_stmt->execute([':sig' => $transaction_signature]);
    if ($check_stmt->fetch()) {
        throw new Exception('Transaction signature already processed');
    }

    error_log("💰 SOL Distribution request: tx=$transaction_signature, amount=$amount_sol SOL");

    // Calculate distribution
    $amounts = [
        'main' => $amount_sol * $DISTRIBUTION['main'],
        'liquidity' => $amount_sol * $DISTRIBUTION['liquidity'],
        'team' => $amount_sol * $DISTRIBUTION['team']
    ];

    error_log("📊 Distribution breakdown (40/30/30):");
    error_log("  🏦 Treasury Main: {$amounts['main']} SOL (40%)");
    error_log("  💧 Treasury Liquidity: {$amounts['liquidity']} SOL (30%)");
    error_log("  👥 Treasury Team: {$amounts['team']} SOL (30%)");

    // ============================================
    // TODO: IMPLEMENT REAL SOLANA TRANSFERS
    // ============================================
    // For MVP/hackathon, we log the distribution
    // In production, you need to:
    // 1. Verify original transaction on-chain
    // 2. Execute 3 separate SOL transfers
    // 3. Confirm all transfers
    // ============================================

    // Save distribution record in database
    $pdo->beginTransaction();

    // Log main treasury
    $stmt = $pdo->prepare("
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
        ) VALUES (
            :tx_sig,
            :from_wallet,
            :to_wallet,
            :amount,
            :percentage,
            'main',
            :tier,
            :telegram_id,
            'pending',
            NOW()
        )
    ");

        $stmt->execute([
            ':tx_sig' => $transaction_signature,
            ':from_wallet' => $from_wallet,
            ':to_wallet' => $TREASURY_MAIN,
            ':amount' => $amounts['main'],
            ':percentage' => 40,
            ':tier' => $nft_tier,
            ':telegram_id' => $telegram_id
        ]);

        // Log liquidity treasury
        $stmt = $pdo->prepare("
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
            ) VALUES (
                :tx_sig,
                :from_wallet,
                :to_wallet,
                :amount,
                :percentage,
                'liquidity',
                :tier,
                :telegram_id,
                'pending',
                NOW()
            )
        ");

        $stmt->execute([
            ':tx_sig' => $transaction_signature,
            ':from_wallet' => $from_wallet,
            ':to_wallet' => $TREASURY_LIQUIDITY,
            ':amount' => $amounts['liquidity'],
            ':percentage' => 30,
            ':tier' => $nft_tier,
            ':telegram_id' => $telegram_id
        ]);

        // Log team treasury
        $stmt = $pdo->prepare("
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
            ) VALUES (
                :tx_sig,
                :from_wallet,
                :to_wallet,
                :amount,
                :percentage,
                'team',
                :tier,
                :telegram_id,
                'pending',
                NOW()
            )
        ");

        $stmt->execute([
            ':tx_sig' => $transaction_signature,
            ':from_wallet' => $from_wallet,
            ':to_wallet' => $TREASURY_TEAM,
            ':amount' => $amounts['team'],
            ':percentage' => 30,
            ':tier' => $nft_tier,
            ':telegram_id' => $telegram_id
        ]);

        $pdo->commit();

        error_log("✅ SOL distribution logged successfully");

        echo json_encode([
            'success' => true,
            'transaction_signature' => $transaction_signature,
            'total_sol' => $amount_sol,
            'distribution' => [
                'main' => [
                    'wallet' => $TREASURY_MAIN,
                    'amount' => round($amounts['main'], 6),
                    'percentage' => '40%',
                    'status' => 'pending'
                ],
                'liquidity' => [
                    'wallet' => $TREASURY_LIQUIDITY,
                    'amount' => round($amounts['liquidity'], 6),
                    'percentage' => '30%',
                    'status' => 'pending'
                ],
                'team' => [
                    'wallet' => $TREASURY_TEAM,
                    'amount' => round($amounts['team'], 6),
                    'percentage' => '30%',
                    'status' => 'pending'
                ]
            ],
        'message' => 'SOL distribution logged. Manual transfer required.',
        'note' => 'For MVP: distributions are logged but not executed automatically. In production, implement real Solana transfers.'
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("❌ SOL distribution error: " . $e->getMessage());

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

