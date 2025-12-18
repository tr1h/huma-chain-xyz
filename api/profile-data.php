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
    // Load error handlers if not already loaded
    if (!function_exists('safeCurl')) {
        require_once __DIR__ . '/helpers/error-handlers.php';
    }
    
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
    
    try {
        $response = safeCurl($fullUrl, [
            'method' => $method,
            'headers' => $headers,
            'body' => $data ? safeJsonEncode($data) : null,
            'timeout' => 10
        ]);
        
        $decoded = safeJsonDecode($response['body']);
        
        return [
            'code' => $response['code'],
            'data' => $decoded
        ];
        
    } catch (Exception $e) {
        error_log("❌ Supabase request error in profile-data.php: " . $e->getMessage());
        return [
            'code' => 500,
            'data' => null,
            'error' => $e->getMessage()
        ];
    }
}

// GET: Fetch profile data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'user_id is required']);
        exit;
    }
    
    error_log("📊 Profile Data API - Request for user_id: " . $userId);
    
    try {
        // Determine if it's Telegram user or Wallet user
        $isTelegramUser = preg_match('/^\d+$/', $userId);
        
        // Handle "wallet_XXX" format from profile widget
        $walletAddress = $userId;
        if (strpos($userId, 'wallet_') === 0) {
            $walletAddress = substr($userId, 7); // Remove "wallet_" prefix
            $isTelegramUser = false;
        }
        
        error_log("🔍 User type: " . ($isTelegramUser ? 'Telegram' : 'Wallet') . " | Address: " . $walletAddress);
        
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
            
            error_log("🔍 Checking wallet_users table for: " . $walletAddress);
            error_log("📡 Response code: " . $userResult['code']);
            
            if ($userResult['code'] === 200 && !empty($userResult['data'])) {
                $user = $userResult['data'][0];
                $gameState = json_decode($user['game_state'] ?? '{}', true);
                error_log("✅ Found user in wallet_users table");
            } else {
                // Try leaderboard table with wallet_address field
                error_log("⚠️ Not found in wallet_users, trying leaderboard table");
                $userResult = supabaseRequest($SUPABASE_URL, $SUPABASE_KEY, 'GET', 'leaderboard', [
                    'wallet_address' => 'eq.' . $walletAddress,
                    'select' => '*'
                ]);
                
                error_log("📡 Leaderboard response code: " . $userResult['code']);
                
                if ($userResult['code'] === 200 && !empty($userResult['data'])) {
                    $user = $userResult['data'][0];
                    $gameState = json_decode($user['game_state'] ?? '{}', true);
                    error_log("✅ Found user in leaderboard table");
                } else {
                    error_log("❌ User not found in both tables");
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
        
        error_log("📊 Extracted stats - Level: $level, TAMA: $tama, Clicks: $totalClicks");
        
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
        
        error_log("✅ Successfully generated stats for user");
        
        // Clean user data for JSON encoding (remove any non-serializable data)
        $userForJson = $user;
        if (isset($userForJson['game_state']) && is_string($userForJson['game_state'])) {
            // Keep as string for JSON
        } elseif (isset($userForJson['game_state']) && is_array($userForJson['game_state'])) {
            // Convert to JSON string
            $userForJson['game_state'] = json_encode($userForJson['game_state']);
        }
        
        try {
            $jsonResponse = json_encode([
                'success' => true,
                'user' => $userForJson,
                'stats' => $stats
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            
            if ($jsonResponse === false) {
                throw new Exception('JSON encoding failed: ' . json_last_error_msg());
            }
            
            echo $jsonResponse;
        } catch (Exception $jsonError) {
            error_log("❌ JSON encoding error: " . $jsonError->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to encode response',
                'details' => $jsonError->getMessage()
            ]);
        }
        
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
    try {
        $transactions = [];
        $tama = isset($user['tama_balance']) ? (int)$user['tama_balance'] : (isset($gameState['tama']) ? (int)$gameState['tama'] : 0);
        $clicks = isset($user['clicks']) ? (int)$user['clicks'] : (isset($gameState['clicks']) ? (int)$gameState['clicks'] : (isset($gameState['totalClicks']) ? (int)$gameState['totalClicks'] : 0));
        $lastLogin = isset($user['last_login']) ? $user['last_login'] : null;
    
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
    } catch (Exception $e) {
        error_log("⚠️ Error in generateSampleTransactions: " . $e->getMessage());
        return [];
    }
}

function generateSampleActivities($user, $gameState) {
    try {
        $activities = [];
        $level = isset($user['level']) ? (int)$user['level'] : (isset($gameState['level']) ? (int)$gameState['level'] : 1);
        $clicks = isset($user['clicks']) ? (int)$user['clicks'] : (isset($gameState['clicks']) ? (int)$gameState['clicks'] : (isset($gameState['totalClicks']) ? (int)$gameState['totalClicks'] : 0));
        $lastLogin = isset($user['last_login']) ? $user['last_login'] : null;
        $createdAt = isset($user['created_at']) ? $user['created_at'] : date('c');
    
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
    } catch (Exception $e) {
        error_log("⚠️ Error in generateSampleActivities: " . $e->getMessage());
        return [];
    }
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
?>

