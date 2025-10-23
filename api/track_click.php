<?php
// ============================================
// TRACK REFERRAL CLICKS
// ============================================

require_once 'config.php';

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $referral_code = sanitize($data['referral_code'] ?? '');
    $clicked_at = sanitize($data['clicked_at'] ?? date('Y-m-d H:i:s'));
    $user_agent = sanitize($data['user_agent'] ?? '');
    $referrer = sanitize($data['referrer'] ?? '');
    
    if (empty($referral_code)) {
        sendResponse(false, null, 'Missing referral code');
    }
    
    try {
        $conn = getDBConnection();
        
        // Create clicks table if not exists
        $sql = "CREATE TABLE IF NOT EXISTS referral_clicks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            referral_code VARCHAR(50) NOT NULL,
            clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_agent TEXT,
            referrer_url TEXT,
            ip_address VARCHAR(45),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_referral_code (referral_code),
            INDEX idx_clicked_at (clicked_at)
        )";
        $conn->query($sql);
        
        // Insert click
        $stmt = $conn->prepare("INSERT INTO referral_clicks (referral_code, clicked_at, user_agent, referrer_url, ip_address) VALUES (?, ?, ?, ?, ?)");
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $stmt->bind_param("sssss", $referral_code, $clicked_at, $user_agent, $referrer, $ip);
        
        if ($stmt->execute()) {
            sendResponse(true, ['message' => 'Click tracked successfully']);
        } else {
            sendResponse(false, null, 'Failed to track click');
        }
        
        $stmt->close();
        $conn->close();
        
    } catch (Exception $e) {
        sendResponse(false, null, 'Database error: ' . $e->getMessage());
    }
}

if ($method === 'GET') {
    $referral_code = sanitize($_GET['code'] ?? '');
    
    if (empty($referral_code)) {
        sendResponse(false, null, 'Missing referral code');
    }
    
    try {
        $conn = getDBConnection();
        
        // Get click stats
        $stmt = $conn->prepare("SELECT COUNT(*) as total_clicks, MAX(clicked_at) as last_click FROM referral_clicks WHERE referral_code = ?");
        $stmt->bind_param("s", $referral_code);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        sendResponse(true, [
            'total_clicks' => $row['total_clicks'],
            'last_click' => $row['last_click']
        ]);
        
        $stmt->close();
        $conn->close();
        
    } catch (Exception $e) {
        sendResponse(false, null, 'Database error: ' . $e->getMessage());
    }
}

sendResponse(false, null, 'Invalid method');
?>
