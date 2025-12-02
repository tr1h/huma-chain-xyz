<?php
/**
 * Enhanced Profile Data API
 * Returns comprehensive user statistics, achievements, transactions, NFTs, and more
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Cache-Control, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

// Supabase config
$SUPABASE_URL = defined('SUPABASE_URL') && SUPABASE_URL
    ? SUPABASE_URL
    : (getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co');
$SUPABASE_KEY = defined('SUPABASE_KEY') && SUPABASE_KEY
    ? SUPABASE_KEY
    : (getenv('SUPABASE_KEY') ?: null);

if (!$SUPABASE_URL || !$SUPABASE_KEY) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Supabase configuration missing.']);
    exit;
}

// Helper function for Supabase requests
function supabaseRequest($url, $key, $method, $table, $params = [], $body = null) {
    $endpoint = $url . '/rest/v1/' . $table;
    
    if (!empty($params)) {
        $endpoint .= '?' . http_build_query($params);
    }
    
    $headers = [
        'apikey: ' . $key,
        'Authorization: Bearer ' . $key,
        'Content-Type: application/json'
    ];
    
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($method === 'POST' || $method === 'PATCH') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        if ($body) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

// GET: Fetch profile data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'user_id is required']);
        exit;
    }
    
    try {
        // Determine if it's Telegram user or Wallet user
        $isTelegramUser = preg_match('/^\d+$/', $userId);
        
        // Handle "wallet_XXX" format from profile widget
        $walletAddress = $userId;
        if (strpos($userId, 'wallet_') === 0) {
            $walletAddress = substr($userId, 7); // Remove "wallet_" prefix
            $isTelegramUser = false;
        }
        
        // Fetch user data
        if ($isTelegramUser) {
            // Telegram user from leaderboard table
            $userResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'leaderboard', [
                'telegram_id' => 'eq.' . $userId,
                'select' => '*'
            ]);
            
            if ($userResult['code'] === 200 && !empty($userResult['data'])) {
                $user = $userResult['data'][0];
                $gameState = json_decode($user['game_state'] ?? '{}', true);
            } else {
                throw new Exception('Telegram user not found');
            }
        } else {
            // Wallet user from wallet_users table
            $userResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'wallet_users', [
                'wallet_address' => 'eq.' . $walletAddress,
                'select' => '*'
            ]);
            
            if ($userResult['code'] === 200 && !empty($userResult['data'])) {
                $user = $userResult['data'][0];
                $gameState = json_decode($user['game_state'] ?? '{}', true);
            } else {
                // Try leaderboard table with wallet_address field
                $userResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'leaderboard', [
                    'wallet_address' => 'eq.' . $walletAddress,
                    'select' => '*'
                ]);
                
                if ($userResult['code'] === 200 && !empty($userResult['data'])) {
                    $user = $userResult['data'][0];
                    $gameState = json_decode($user['game_state'] ?? '{}', true);
                } else {
                    throw new Exception('Wallet user not found: ' . $walletAddress);
                }
            }
        }
        
        // Fetch NFTs
        $nftsResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'user_nfts', [
            'user_id' => 'eq.' . $userId,
            'select' => '*'
        ]);
        $nfts = $nftsResult['code'] === 200 ? $nftsResult['data'] : [];
        
        // Fetch referrals
        $referralsResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'leaderboard', [
            'referred_by' => 'eq.' . $userId,
            'select' => 'count'
        ]);
        $referralCount = 0;
        if ($referralsResult['code'] === 200 && isset($referralsResult['data'][0]['count'])) {
            $referralCount = (int)$referralsResult['data'][0]['count'];
        }
        
        // Get user rank from unified leaderboard
        $rankResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'unified_leaderboard', [
            'user_id' => 'eq.' . $userId,
            'select' => 'rank'
        ]);
        $rank = ($rankResult['code'] === 200 && !empty($rankResult['data'])) 
            ? ($rankResult['data'][0]['rank'] ?? 0) 
            : 0;
        
        // Extract data from user object and game_state
        $level = $user['level'] ?? $gameState['level'] ?? 1;
        $tama = $user['tama_balance'] ?? $gameState['tama'] ?? 0;
        $totalClicks = $user['clicks'] ?? $gameState['clicks'] ?? $gameState['totalClicks'] ?? 0;
        $xp = $user['experience'] ?? $gameState['xp'] ?? 0;
        
        // Calculate statistics
        $stats = [
            'level' => $level,
            'tama' => $tama,
            'totalClicks' => $totalClicks,
            'playtime' => $gameState['playtime'] ?? 0,
            'rank' => $rank,
            'nfts' => count($nfts),
            'referrals' => $user['referral_count'] ?? $referralCount,
            'referralEarnings' => $user['referral_earnings'] ?? ($referralCount * 100),
            'walletLinked' => isset($user['wallet_address']) && !empty($user['wallet_address']),
            'twitterLinked' => isset($user['twitter_username']) && !empty($user['twitter_username']),
            'daysPlayed' => calculateDaysPlayed($user['created_at'] ?? date('c')),
            
            // NFT Collection
            'nftCollection' => array_map(function($nft) {
                return [
                    'tier' => $nft['tier'] ?? 'Bronze',
                    'boost' => getBoostMultiplier($nft['tier'] ?? 'Bronze'),
                    'mintedAt' => $nft['minted_at'] ?? date('c')
                ];
            }, $nfts),
            
            // Sample transaction history (last 20)
            'transactions' => generateSampleTransactions($gameState, $user),
            
            // Sample activity timeline (last 15)
            'activities' => generateSampleActivities($user, $gameState)
        ];
        
        echo json_encode([
            'success' => true,
            'user' => $user,
            'stats' => $stats
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// POST: Update profile data (avatar, etc.)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? null;
    $userId = $input['user_id'] ?? null;
    
    if (!$action || !$userId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'action and user_id are required']);
        exit;
    }
    
    try {
        switch ($action) {
            case 'update_avatar':
                $avatar = $input['avatar'] ?? '🐱';
                $isTelegramUser = preg_match('/^\d+$/', $userId);
                $table = $isTelegramUser ? 'leaderboard' : 'wallet_users';
                $idField = $isTelegramUser ? 'telegram_id' : 'wallet_address';
                
                $result = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'PATCH', $table, [
                    $idField => 'eq.' . $userId
                ], [
                    'avatar' => $avatar
                ]);
                
                if ($result['code'] >= 200 && $result['code'] < 300) {
                    echo json_encode(['success' => true, 'message' => 'Avatar updated']);
                } else {
                    throw new Exception('Failed to update avatar');
                }
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid action']);
                break;
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Helper Functions
function calculateDaysPlayed($createdAt) {
    $created = new DateTime($createdAt);
    $now = new DateTime();
    $diff = $now->diff($created);
    return $diff->days;
}

function getBoostMultiplier($tier) {
    $boosts = [
        'Bronze' => 2,
        'Silver' => 2.5,
        'Gold' => 3,
        'Platinum' => 4,
        'Diamond' => 5
    ];
    return $boosts[$tier] ?? 2;
}

function generateSampleTransactions($gameState, $user = null) {
    $transactions = [];
    $tama = $user['tama_balance'] ?? $gameState['tama'] ?? 0;
    $clicks = $user['clicks'] ?? $gameState['clicks'] ?? $gameState['totalClicks'] ?? 0;
    $lastLogin = $user['last_login'] ?? null;
    
    // Generate based on actual game state
    if ($clicks > 0) {
        $transactions[] = [
            'type' => 'click',
            'description' => 'Clicked pet (' . $clicks . ' total)',
            'amount' => $clicks,
            'timestamp' => $lastLogin ? date('c', strtotime($lastLogin . ' -5 minutes')) : date('c', strtotime('-5 minutes'))
        ];
    }
    
    if ($tama >= 1000) {
        $transactions[] = [
            'type' => 'bonus',
            'description' => 'Daily bonus',
            'amount' => 500,
            'timestamp' => $lastLogin ? date('c', strtotime($lastLogin . ' -1 hour')) : date('c', strtotime('-1 hour'))
        ];
    }
    
    if ($clicks >= 100) {
        $transactions[] = [
            'type' => 'quest',
            'description' => 'Quest completed (100 clicks)',
            'amount' => 1000,
            'timestamp' => $lastLogin ? date('c', strtotime($lastLogin . ' -2 hours')) : date('c', strtotime('-2 hours'))
        ];
    }
    
    return $transactions;
}

function generateSampleActivities($user, $gameState) {
    $activities = [];
    $level = $user['level'] ?? $gameState['level'] ?? 1;
    $clicks = $user['clicks'] ?? $gameState['clicks'] ?? $gameState['totalClicks'] ?? 0;
    $lastLogin = $user['last_login'] ?? null;
    $createdAt = $user['created_at'] ?? date('c');
    
    // Last login
    if ($lastLogin) {
        $activities[] = [
            'type' => 'login',
            'description' => 'Logged into game',
            'timestamp' => $lastLogin
        ];
    }
    
    // Level up
    if ($level >= 2) {
        $activities[] = [
            'type' => 'level_up',
            'description' => 'Reached level ' . $level,
            'timestamp' => date('c', strtotime($createdAt . ' +' . ($level * 2) . ' hours'))
        ];
    }
    
    // Achievements based on clicks
    if ($clicks >= 100) {
        $activities[] = [
            'type' => 'achievement',
            'description' => 'Unlocked "100 Clicks" achievement',
            'timestamp' => date('c', strtotime($createdAt . ' +' . ($clicks / 10) . ' hours'))
        ];
    }
    
    if ($clicks >= 1) {
        $activities[] = [
            'type' => 'achievement',
            'description' => 'Unlocked "First Click" achievement',
            'timestamp' => $createdAt
        ];
    }
    
    // Sort by timestamp (newest first)
    usort($activities, function($a, $b) {
        return strtotime($b['timestamp']) - strtotime($a['timestamp']);
    });
    
    return array_slice($activities, 0, 15); // Return last 15
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
?>

