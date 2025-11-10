<?php
// ============================================
// GET AVAILABLE DAILY REWARDS
// ============================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

try {
    $telegram_id = $_GET['telegram_id'] ?? null;
    
    if (!$telegram_id) {
        throw new Exception('Missing telegram_id');
    }
    
    // Get available rewards
    $stmt = $pdo->prepare("SELECT * FROM get_available_daily_rewards(:telegram_id)");
    $stmt->execute([':telegram_id' => $telegram_id]);
    $rewards = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get passive income stats
    $stmt = $pdo->prepare("SELECT * FROM nft_passive_income_stats WHERE telegram_id = :telegram_id");
    $stmt->execute([':telegram_id' => $telegram_id]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Calculate totals
    $total_pending = 0;
    $can_claim = false;
    
    foreach ($rewards as $reward) {
        $total_pending += $reward['total_pending'];
        if ($reward['can_claim']) {
            $can_claim = true;
        }
    }
    
    echo json_encode([
        'success' => true,
        'rewards' => $rewards,
        'stats' => $stats ?: [
            'nft_count' => 0,
            'daily_total_income' => 0,
            'lifetime_claimed' => 0,
            'pending_rewards' => 0
        ],
        'total_pending' => $total_pending,
        'can_claim' => $can_claim,
        'message' => $can_claim ? 'Rewards available!' : 'Come back tomorrow!'
    ]);
    
} catch (Exception $e) {
    error_log("❌ Get daily rewards error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

