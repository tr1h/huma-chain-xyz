<?php
/**
 * API Router - Routes requests to appropriate modules
 */

// Load all modules
require_once __DIR__ . '/core.php';
require_once __DIR__ . '/balance.php';
require_once __DIR__ . '/leaderboard.php';
require_once __DIR__ . '/slots.php';
require_once __DIR__ . '/marketplace.php';

/**
 * Route API request
 */
function routeRequest($endpoint, $method, $url, $key) {
    // Remove leading slash and 'api/tama' prefix
    $endpoint = trim($endpoint, '/');
    $endpoint = preg_replace('#^api/tama/?#', '', $endpoint);
    
    // Route map
    $routes = [
        // Balance
        'GET:balance' => 'handleGetBalance',
        'GET:get-balance' => 'handleGetBalance',
        'POST:add-tama' => 'handleAddTama',
        'POST:spend-tama' => 'handleSpendTama',
        'POST:update-wallet' => 'handleUpdateWallet',
        
        // Leaderboard
        'GET:leaderboard' => 'handleGetLeaderboard',
        'GET:stats' => 'handleGetStats',
        'POST:leaderboard/upsert' => 'handleLeaderboardUpsert',
        
        // Slots
        'POST:slots/spin' => 'handleSlotsSpin',
        'GET:slots/jackpot' => 'handleGetJackpotPool',
        
        // Marketplace
        'GET:marketplace/listings' => 'handleMarketplaceListings',
        'GET:marketplace/stats' => 'handleMarketplaceStats',
        'POST:marketplace/list' => 'handleMarketplaceList',
        'POST:marketplace/buy' => 'handleMarketplaceBuy',
        'POST:marketplace/cancel' => 'handleMarketplaceCancel',
        
        // Test
        'GET:test' => 'handleTest',
    ];

    $routeKey = $method . ':' . $endpoint;
    
    if (isset($routes[$routeKey])) {
        $handler = $routes[$routeKey];
        if (function_exists($handler)) {
            return $handler($url, $key);
        }
    }

    // Not found
    returnError('Endpoint not found: ' . $endpoint, 404);
}

/**
 * Test endpoint
 */
function handleTest($url, $key) {
    try {
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', ['select' => 'count', 'limit' => '1']);
        
        returnSuccess([
            'api' => 'TAMA API v2.0 (Modular)',
            'status' => 'online',
            'supabase' => 'connected',
            'modules' => ['core', 'balance', 'leaderboard', 'slots', 'marketplace'],
            'timestamp' => date('c')
        ]);
    } catch (Exception $e) {
        returnError('Database connection failed: ' . $e->getMessage(), 500);
    }
}
