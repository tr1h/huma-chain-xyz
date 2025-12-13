<?php
/**
 * Leaderboard Module
 */

require_once __DIR__ . '/core.php';

/**
 * Get leaderboard
 */
function handleGetLeaderboard($url, $key) {
    $limit = (int)($_GET['limit'] ?? 100);
    $offset = (int)($_GET['offset'] ?? 0);

    try {
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => 'telegram_id,username,tama,level,xp,pet_name,pet_type,nft_tier,earning_multiplier',
            'order' => 'tama.desc',
            'limit' => $limit,
            'offset' => $offset
        ]);

        returnSuccess([
            'leaderboard' => $result['data'],
            'total' => $result['count'] ?? count($result['data']),
            'limit' => $limit,
            'offset' => $offset
        ]);

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * Get stats
 */
function handleGetStats($url, $key) {
    try {
        // Total players
        $playersResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => 'count', 'limit' => '0'
        ]);

        // Total TAMA
        $tamaResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => 'tama'
        ]);

        $totalTama = 0;
        foreach ($tamaResult['data'] as $player) {
            $totalTama += (int)($player['tama'] ?? 0);
        }

        // NFT count
        $nftResult = supabaseRequest($url, $key, 'GET', 'user_nfts', [
            'select' => 'count', 'is_active' => 'eq.true', 'limit' => '0'
        ]);

        returnSuccess([
            'total_players' => $playersResult['count'] ?? 0,
            'total_tama' => $totalTama,
            'total_nfts' => $nftResult['count'] ?? 0
        ]);

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * Upsert leaderboard entry
 */
function handleLeaderboardUpsert($url, $key) {
    $data = getRequestBody();
    $telegram_id = $data['telegram_id'] ?? null;

    if (!$telegram_id) {
        returnError('telegram_id is required', 400);
    }

    try {
        // Check if exists
        $existing = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'telegram_id' => 'eq.' . $telegram_id
        ]);

        $updateData = array_filter([
            'telegram_id' => $telegram_id,
            'username' => $data['username'] ?? null,
            'first_name' => $data['first_name'] ?? null,
            'pet_name' => $data['pet_name'] ?? null,
            'pet_type' => $data['pet_type'] ?? null,
            'level' => isset($data['level']) ? (int)$data['level'] : null,
            'xp' => isset($data['xp']) ? (int)$data['xp'] : null,
            'tama' => isset($data['tama']) ? (int)$data['tama'] : null
        ], fn($v) => $v !== null);

        if (empty($existing['data'])) {
            // Insert
            $updateData['tama'] = $updateData['tama'] ?? 0;
            $updateData['level'] = $updateData['level'] ?? 1;
            $updateData['xp'] = $updateData['xp'] ?? 0;
            supabaseRequest($url, $key, 'POST', 'leaderboard', [], $updateData);
        } else {
            // Update
            supabaseRequest($url, $key, 'PATCH', 'leaderboard', 
                ['telegram_id' => 'eq.' . $telegram_id], 
                $updateData
            );
        }

        returnSuccess(['telegram_id' => $telegram_id], 'Leaderboard updated');

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}
