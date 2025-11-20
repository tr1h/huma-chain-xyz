<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load Supabase config
require_once __DIR__ . '/config.php';

$supabaseUrl = getenv('SUPABASE_URL') ?: ($_ENV['SUPABASE_URL'] ?? '');
$supabaseKey = getenv('SUPABASE_KEY') ?: ($_ENV['SUPABASE_KEY'] ?? '');

if (!$supabaseUrl || !$supabaseKey) {
    http_response_code(500);
    echo json_encode(['error' => 'Supabase configuration missing']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$articleSlug = $_GET['slug'] ?? $input['slug'] ?? '';

if (!$articleSlug) {
    http_response_code(400);
    echo json_encode(['error' => 'Article slug required']);
    exit();
}

// Normalize slug
$articleSlug = strtolower(trim($articleSlug));

try {
    if ($method === 'GET') {
        // Get stats for article
        $stats = getArticleStats($supabaseUrl, $supabaseKey, $articleSlug);
        echo json_encode($stats);
        
    } elseif ($method === 'POST') {
        $action = $input['action'] ?? '';
        
        if ($action === 'view') {
            // Track view
            $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
            $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
            trackView($supabaseUrl, $supabaseKey, $articleSlug, $ip, $userAgent);
            $stats = getArticleStats($supabaseUrl, $supabaseKey, $articleSlug);
            echo json_encode(['success' => true, 'stats' => $stats]);
            
        } elseif ($action === 'like') {
            // Toggle like
            $userId = $input['user_id'] ?? $ip ?? 'anonymous';
            $liked = toggleLike($supabaseUrl, $supabaseKey, $articleSlug, $userId);
            $stats = getArticleStats($supabaseUrl, $supabaseKey, $articleSlug);
            echo json_encode(['success' => true, 'liked' => $liked, 'stats' => $stats]);
            
        } elseif ($action === 'comment') {
            // Add comment
            $author = $input['author'] ?? 'Anonymous';
            $comment = $input['comment'] ?? '';
            $userId = $input['user_id'] ?? 'anonymous';
            
            if (empty($comment)) {
                http_response_code(400);
                echo json_encode(['error' => 'Comment text required']);
                exit();
            }
            
            addComment($supabaseUrl, $supabaseKey, $articleSlug, $author, $comment, $userId);
            $comments = getComments($supabaseUrl, $supabaseKey, $articleSlug);
            echo json_encode(['success' => true, 'comments' => $comments]);
            
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
        }
    }
} catch (Exception $e) {
    error_log('Blog stats error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}

function getArticleStats($url, $key, $slug) {
    // Get views count
    $viewsResponse = supabaseRequest($url, $key, 'GET', 'blog_views', [
        'article_slug' => 'eq.' . $slug,
        'select' => 'count'
    ]);
    $views = $viewsResponse['count'] ?? 0;
    
    // Get likes count
    $likesResponse = supabaseRequest($url, $key, 'GET', 'blog_likes', [
        'article_slug' => 'eq.' . $slug,
        'select' => 'count'
    ]);
    $likes = $likesResponse['count'] ?? 0;
    
    // Get comments count
    $commentsResponse = supabaseRequest($url, $key, 'GET', 'blog_comments', [
        'article_slug' => 'eq.' . $slug,
        'select' => 'count'
    ]);
    $comments = $commentsResponse['count'] ?? 0;
    
    return [
        'views' => (int)$views,
        'likes' => (int)$likes,
        'comments' => (int)$comments
    ];
}

function trackView($url, $key, $slug, $ip, $userAgent) {
    // Check if already viewed today (prevent spam)
    $today = date('Y-m-d');
    $checkResponse = supabaseRequest($url, $key, 'GET', 'blog_views', [
        'article_slug' => 'eq.' . $slug,
        'ip_address' => 'eq.' . $ip,
        'viewed_at' => 'gte.' . $today . 'T00:00:00Z',
        'select' => 'id'
    ]);
    
    // Only count once per IP per day
    if (empty($checkResponse['data'])) {
        supabaseRequest($url, $key, 'POST', 'blog_views', null, [
            'article_slug' => $slug,
            'ip_address' => $ip,
            'user_agent' => substr($userAgent, 0, 200),
            'viewed_at' => date('Y-m-d\TH:i:s\Z')
        ]);
    }
}

function toggleLike($url, $key, $slug, $userId) {
    // Check if already liked
    $checkResponse = supabaseRequest($url, $key, 'GET', 'blog_likes', [
        'article_slug' => 'eq.' . $slug,
        'user_id' => 'eq.' . $userId,
        'select' => 'id'
    ]);
    
    if (!empty($checkResponse['data'])) {
        // Unlike
        supabaseRequest($url, $key, 'DELETE', 'blog_likes', [
            'article_slug' => 'eq.' . $slug,
            'user_id' => 'eq.' . $userId
        ]);
        return false;
    } else {
        // Like
        supabaseRequest($url, $key, 'POST', 'blog_likes', null, [
            'article_slug' => $slug,
            'user_id' => $userId,
            'liked_at' => date('Y-m-d\TH:i:s\Z')
        ]);
        return true;
    }
}

function addComment($url, $key, $slug, $author, $comment, $userId) {
    supabaseRequest($url, $key, 'POST', 'blog_comments', null, [
        'article_slug' => $slug,
        'author' => substr($author, 0, 100),
        'comment' => substr($comment, 0, 2000),
        'user_id' => $userId,
        'created_at' => date('Y-m-d\TH:i:s\Z')
    ]);
}

function getComments($url, $key, $slug) {
    $response = supabaseRequest($url, $key, 'GET', 'blog_comments', [
        'article_slug' => 'eq.' . $slug,
        'select' => 'id,author,comment,created_at',
        'order' => 'created_at.desc',
        'limit' => '50'
    ]);
    
    return $response['data'] ?? [];
}

function supabaseRequest($url, $key, $method, $table, $query = null, $body = null) {
    $ch = curl_init();
    
    $requestUrl = rtrim($url, '/') . '/rest/v1/' . $table;
    if ($query) {
        $queryString = http_build_query($query);
        $requestUrl .= '?' . $queryString;
    }
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $requestUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'apikey: ' . $key,
            'Authorization: Bearer ' . $key,
            'Content-Type: application/json',
            'Prefer: return=representation'
        ],
        CURLOPT_CUSTOMREQUEST => $method
    ]);
    
    if ($body && in_array($method, ['POST', 'PATCH', 'PUT'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 400) {
        error_log("Supabase error ($httpCode): $response");
        return ['data' => [], 'count' => 0];
    }
    
    $decoded = json_decode($response, true);
    
    // Handle count response
    if (isset($query['select']) && $query['select'] === 'count') {
        return ['count' => is_array($decoded) ? count($decoded) : 0];
    }
    
    return $decoded ?: ['data' => []];
}

