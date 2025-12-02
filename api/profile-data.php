<?php
/**
 * Enhanced Profile Data API
 * Returns comprehensive user statistics, achievements, transactions, NFTs, and more
 */

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

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

// Helper function for Supabase requests (matching wallet-auth.php format)
function supabaseRequest($url, $apiKey, $method, $table, $filters = [], $data = null) {
    $ch = curl_init();
    
    $queryString = '';
    if (!empty($filters)) {
        $queryParts = [];
        foreach ($filters as $filterKey => $value) {
            if ($filterKey === 'select') {
                $queryParts[] = 'select=' . urlencode($value);
            } else {
                $queryParts[] = urlencode($filterKey) . '=' . urlencode($value);
            }
        }
        $queryString = '?' . implode('&', $queryParts);
    }
    
    $fullUrl = $url . '/rest/v1/' . $table . $queryString;
    
    $headers = [
        'apikey: ' . $apiKey,
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ];
    
    curl_setopt($ch, CURLOPT_URL, $fullUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($method === 'POST' || $method === 'PATCH' || $method === 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        error_log("❌ CURL Error in profile-data.php: " . $error);
        return [
            'code' => 500,
            'data' => null,
            'error' => $error
        ];
    }
    
    $decoded = json_decode($response, true);
    
    return [
        'code' => $httpCode,
        'data' => $decoded
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
        
        // Fetch NFTs (try user_nfts table, fallback to empty array)
        $nfts = [];
        try {
            $nftsResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'user_nfts', [
                'user_id' => 'eq.' . ($isTelegramUser ? $userId : $walletAddress),
                'select' => '*'
            ]);
            if ($nftsResult['code'] === 200 && is_array($nftsResult['data'])) {
                $nfts = $nftsResult['data'];
            }
        } catch (Exception $e) {
            error_log("⚠️ Failed to fetch NFTs: " . $e->getMessage());
        }
        
        // Fetch referrals count
        $referralCount = 0;
        try {
            $referralField = $isTelegramUser ? 'referred_by' : 'referrer_wallet';
            $referralValue = $isTelegramUser ? $userId : $walletAddress;
            $referralsResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'leaderboard', [
                $referralField => 'eq.' . $referralValue,
                'select' => '*'
            ]);
            if ($referralsResult['code'] === 200 && is_array($referralsResult['data'])) {
                $referralCount = count($referralsResult['data']);
            }
        } catch (Exception $e) {
            error_log("⚠️ Failed to fetch referrals: " . $e->getMessage());
        }
        
        // Get user rank (try unified_leaderboard, fallback to 0)
        $rank = 0;
        try {
            $rankUserId = $isTelegramUser ? $userId : ($user['user_id'] ?? $walletAddress);
            $rankResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'unified_leaderboard', [
                'user_id' => 'eq.' . $rankUserId,
                'select' => 'rank'
            ]);
            if ($rankResult['code'] === 200 && !empty($rankResult['data']) && is_array($rankResult['data'])) {
                $rank = (int)($rankResult['data'][0]['rank'] ?? 0);
            }
        } catch (Exception $e) {
            error_log("⚠️ Failed to fetch rank: " . $e->getMessage());
        }
        
        // Extract data from user object and game_state
        $level = isset($user['level']) ? (int)$user['level'] : (isset($gameState['level']) ? (int)$gameState['level'] : 1);
        $tama = isset($user['tama_balance']) ? (int)$user['tama_balance'] : (isset($gameState['tama']) ? (int)$gameState['tama'] : 0);
        $totalClicks = isset($user['clicks']) ? (int)$user['clicks'] : (isset($gameState['clicks']) ? (int)$gameState['clicks'] : (isset($gameState['totalClicks']) ? (int)$gameState['totalClicks'] : 0));
        $xp = isset($user['experience']) ? (int)$user['experience'] : (isset($gameState['xp']) ? (int)$gameState['xp'] : 0);
        
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

