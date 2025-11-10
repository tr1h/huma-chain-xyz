<?php
// ============================================
// CLAIM DAILY NFT REWARDS
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
    
    if (!$telegram_id) {
        throw new Exception('Missing telegram_id');
    }
    
    error_log("💰 Daily rewards claim request: user=$telegram_id");
    
    // Call claim function
    $stmt = $pdo->prepare("SELECT * FROM claim_daily_nft_rewards(:telegram_id)");
    $stmt->execute([':telegram_id' => $telegram_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $total_claimed = $result['total_claimed'] ?? 0;
    $nfts_claimed = $result['nfts_claimed'] ?? 0;
    $message = $result['message'] ?? 'Unknown error';
    
    if ($total_claimed > 0) {
        error_log("✅ Daily rewards claimed: user=$telegram_id, amount=$total_claimed TAMA, nfts=$nfts_claimed");
        
        echo json_encode([
            'success' => true,
            'total_claimed' => $total_claimed,
            'nfts_claimed' => $nfts_claimed,
            'message' => $message
        ]);
    } else {
        error_log("⏰ No rewards available: user=$telegram_id");
        
        echo json_encode([
            'success' => false,
            'total_claimed' => 0,
            'nfts_claimed' => 0,
            'message' => $message
        ]);
    }
    
} catch (Exception $e) {
    error_log("❌ Claim daily rewards error: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

