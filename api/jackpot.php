<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/supabase_config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Get current jackpot
        $response = supabaseRequest('wheel_jackpot', 'GET');
        
        if (isset($response[0])) {
            echo json_encode([
                'success' => true,
                'jackpot' => floatval($response[0]['amount']),
                'last_updated' => $response[0]['updated_at']
            ]);
        } else {
            // Initialize jackpot if doesn't exist
            $initData = [
                'id' => 1,
                'amount' => 5000,
                'updated_at' => date('Y-m-d H:i:s')
            ];
            
            supabaseRequest('wheel_jackpot', 'POST', $initData);
            
            echo json_encode([
                'success' => true,
                'jackpot' => 5000,
                'last_updated' => $initData['updated_at']
            ]);
        }
    } 
    elseif ($method === 'POST') {
        // Update jackpot
        $input = json_decode(file_get_contents('php://input'), true);
        
        $action = $input['action'] ?? 'add'; // 'add' or 'reset' or 'set'
        $amount = floatval($input['amount'] ?? 0);
        
        // Get current jackpot
        $response = supabaseRequest('wheel_jackpot?id=eq.1', 'GET');
        $currentJackpot = isset($response[0]) ? floatval($response[0]['amount']) : 5000;
        
        if ($action === 'add') {
            // Add to jackpot (5% of bet)
            $newJackpot = $currentJackpot + $amount;
        } elseif ($action === 'reset') {
            // Reset after win
            $newJackpot = 5000; // Reset to base amount
        } elseif ($action === 'set') {
            // Admin set specific amount
            $newJackpot = $amount;
        } else {
            throw new Exception('Invalid action');
        }
        
        // Update jackpot
        $updateData = [
            'amount' => $newJackpot,
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $updateResponse = supabaseRequest('wheel_jackpot?id=eq.1', 'PATCH', $updateData);
        
        echo json_encode([
            'success' => true,
            'jackpot' => $newJackpot,
            'previous' => $currentJackpot,
            'change' => $newJackpot - $currentJackpot
        ]);
    }
    else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

