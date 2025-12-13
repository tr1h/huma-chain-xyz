<?php
/**
 * Marketplace Module - NFT trading
 */

require_once __DIR__ . '/core.php';

/**
 * Get marketplace listings
 */
function handleMarketplaceListings($url, $key) {
    $tier = $_GET['tier'] ?? null;
    $limit = (int)($_GET['limit'] ?? 50);
    $offset = (int)($_GET['offset'] ?? 0);

    try {
        $params = [
            'select' => '*,seller:leaderboard!telegram_id(username,first_name)',
            'status' => 'eq.active',
            'order' => 'created_at.desc',
            'limit' => $limit,
            'offset' => $offset
        ];

        if ($tier) {
            $params['tier_name'] = 'eq.' . $tier;
        }

        $result = supabaseRequest($url, $key, 'GET', 'marketplace_listings', $params);

        returnSuccess([
            'listings' => $result['data'],
            'total' => $result['count'] ?? count($result['data'])
        ]);

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * Get marketplace stats
 */
function handleMarketplaceStats($url, $key) {
    try {
        // Active listings
        $activeResult = supabaseRequest($url, $key, 'GET', 'marketplace_listings', [
            'select' => 'count', 'status' => 'eq.active', 'limit' => '0'
        ]);

        // Total sales
        $salesResult = supabaseRequest($url, $key, 'GET', 'marketplace_listings', [
            'select' => 'price_tama', 'status' => 'eq.sold'
        ]);

        $totalVolume = 0;
        foreach ($salesResult['data'] as $sale) {
            $totalVolume += (int)($sale['price_tama'] ?? 0);
        }

        returnSuccess([
            'active_listings' => $activeResult['count'] ?? 0,
            'total_sales' => count($salesResult['data']),
            'total_volume' => $totalVolume
        ]);

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * List NFT for sale
 */
function handleMarketplaceList($url, $key) {
    $data = getRequestBody();
    $telegram_id = $data['telegram_id'] ?? null;
    $nft_id = $data['nft_id'] ?? null;
    $price_tama = (int)($data['price_tama'] ?? 0);

    if (!$telegram_id || !$nft_id || $price_tama <= 0) {
        returnError('telegram_id, nft_id and price_tama are required', 400);
    }

    try {
        // Verify ownership
        $nftResult = supabaseRequest($url, $key, 'GET', 'user_nfts', [
            'id' => 'eq.' . $nft_id,
            'telegram_id' => 'eq.' . $telegram_id,
            'is_active' => 'eq.true'
        ]);

        if (empty($nftResult['data'])) {
            returnError('NFT not found or not owned', 404);
        }

        $nft = $nftResult['data'][0];

        // Check not already listed
        $existingListing = supabaseRequest($url, $key, 'GET', 'marketplace_listings', [
            'nft_id' => 'eq.' . $nft_id,
            'status' => 'eq.active'
        ]);

        if (!empty($existingListing['data'])) {
            returnError('NFT already listed', 400);
        }

        // Create listing
        $listing = supabaseRequest($url, $key, 'POST', 'marketplace_listings', [], [
            'nft_id' => $nft_id,
            'telegram_id' => $telegram_id,
            'tier_name' => $nft['tier_name'],
            'rarity' => $nft['rarity'],
            'earning_multiplier' => $nft['earning_multiplier'],
            'price_tama' => $price_tama,
            'status' => 'active'
        ]);

        logAction('marketplace_list', ['nft_id' => $nft_id, 'price' => $price_tama]);

        returnSuccess([
            'listing_id' => $listing['data'][0]['id'] ?? null,
            'nft_id' => $nft_id,
            'price_tama' => $price_tama
        ], 'NFT listed successfully');

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * Buy NFT from marketplace
 */
function handleMarketplaceBuy($url, $key) {
    $data = getRequestBody();
    $buyer_id = $data['telegram_id'] ?? null;
    $listing_id = $data['listing_id'] ?? null;

    if (!$buyer_id || !$listing_id) {
        returnError('telegram_id and listing_id are required', 400);
    }

    try {
        // Get listing
        $listingResult = supabaseRequest($url, $key, 'GET', 'marketplace_listings', [
            'id' => 'eq.' . $listing_id,
            'status' => 'eq.active'
        ]);

        if (empty($listingResult['data'])) {
            returnError('Listing not found or not active', 404);
        }

        $listing = $listingResult['data'][0];
        $seller_id = $listing['telegram_id'];
        $price = (int)$listing['price_tama'];
        $nft_id = $listing['nft_id'];

        // Can't buy own NFT
        if ($buyer_id === $seller_id) {
            returnError('Cannot buy your own NFT', 400);
        }

        // Check buyer balance
        $buyerResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'telegram_id' => 'eq.' . $buyer_id
        ]);

        if (empty($buyerResult['data'])) {
            returnError('Buyer not found', 404);
        }

        $buyerBalance = (int)($buyerResult['data'][0]['tama'] ?? 0);
        if ($buyerBalance < $price) {
            returnError('Insufficient balance', 400, [
                'required' => $price,
                'available' => $buyerBalance
            ]);
        }

        // Transfer TAMA: buyer -> seller
        supabaseRequest($url, $key, 'PATCH', 'leaderboard', 
            ['telegram_id' => 'eq.' . $buyer_id], 
            ['tama' => $buyerBalance - $price]
        );

        $sellerResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'telegram_id' => 'eq.' . $seller_id
        ]);
        $sellerBalance = (int)($sellerResult['data'][0]['tama'] ?? 0);

        supabaseRequest($url, $key, 'PATCH', 'leaderboard', 
            ['telegram_id' => 'eq.' . $seller_id], 
            ['tama' => $sellerBalance + $price]
        );

        // Transfer NFT
        supabaseRequest($url, $key, 'PATCH', 'user_nfts', 
            ['id' => 'eq.' . $nft_id], 
            ['telegram_id' => $buyer_id]
        );

        // Update listing
        supabaseRequest($url, $key, 'PATCH', 'marketplace_listings', 
            ['id' => 'eq.' . $listing_id], 
            ['status' => 'sold', 'buyer_id' => $buyer_id, 'sold_at' => date('c')]
        );

        logAction('marketplace_buy', ['listing_id' => $listing_id, 'buyer' => $buyer_id, 'price' => $price]);

        returnSuccess([
            'nft_id' => $nft_id,
            'price_paid' => $price,
            'new_balance' => $buyerBalance - $price
        ], 'NFT purchased successfully');

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * Cancel listing
 */
function handleMarketplaceCancel($url, $key) {
    $data = getRequestBody();
    $telegram_id = $data['telegram_id'] ?? null;
    $listing_id = $data['listing_id'] ?? null;

    if (!$telegram_id || !$listing_id) {
        returnError('telegram_id and listing_id are required', 400);
    }

    try {
        $listingResult = supabaseRequest($url, $key, 'GET', 'marketplace_listings', [
            'id' => 'eq.' . $listing_id,
            'telegram_id' => 'eq.' . $telegram_id,
            'status' => 'eq.active'
        ]);

        if (empty($listingResult['data'])) {
            returnError('Listing not found or not yours', 404);
        }

        supabaseRequest($url, $key, 'PATCH', 'marketplace_listings', 
            ['id' => 'eq.' . $listing_id], 
            ['status' => 'cancelled']
        );

        returnSuccess(['listing_id' => $listing_id], 'Listing cancelled');

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}
