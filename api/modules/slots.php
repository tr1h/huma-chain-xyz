<?php
/**
 * Slots Module - Slot machine game logic
 */

require_once __DIR__ . '/core.php';

/**
 * Handle Slots Spin
 */
function handleSlotsSpin($url, $key) {
    try {
        require_once __DIR__ . '/../telegram_auth.php';

        $data = getRequestBody();
        logAction('slots_spin', ['telegram_id' => $data['telegram_id'] ?? 'unknown', 'bet' => $data['bet'] ?? 0]);

        // Validate Telegram auth
        $botToken = getenv('BOT_TOKEN');
        if ($botToken) {
            $telegramId = validateWebAppRequest($data, $botToken);
        } else {
            $telegramId = $data['telegram_id'] ?? null;
        }

        $amount = (int)($data['amount'] ?? 0);
        $bet = (int)($data['bet'] ?? 0);
        $win = (int)($data['win'] ?? 0);
        $symbols = $data['symbols'] ?? [];
        $walletAddress = $data['wallet_address'] ?? null;

        if (!$telegramId) {
            returnError('Missing telegram_id', 400);
        }

        // Check for jackpot
        $isJackpot = count($symbols) === 3 && $symbols[0] === '🎰' && $symbols[1] === '🎰' && $symbols[2] === '🎰';
        $isWalletUser = strpos($telegramId, 'wallet_') === 0;

        // Get current balance
        if ($isWalletUser && $walletAddress) {
            $balanceResult = supabaseRequest($url, $key, 'GET', 'wallet_users', [
                'wallet_address' => 'eq.' . $walletAddress
            ]);
            $balanceField = 'tama_balance';
            $table = 'wallet_users';
            $whereField = 'wallet_address';
            $whereValue = $walletAddress;
        } else {
            $balanceResult = supabaseRequest($url, $key, 'GET', 'leaderboard', [
                'telegram_id' => 'eq.' . $telegramId
            ]);
            $balanceField = 'tama';
            $table = 'leaderboard';
            $whereField = 'telegram_id';
            $whereValue = $telegramId;
        }

        if (empty($balanceResult['data'])) {
            returnError('User not found', 404);
        }

        $currentBalance = (int)($balanceResult['data'][0][$balanceField] ?? 0);

        // Handle jackpot pool
        $jackpotData = handleJackpotPool($url, $key, $bet, $isJackpot);

        // Calculate new balance
        $totalWin = $amount + $jackpotData['jackpotWin'];
        $newBalance = $currentBalance + $totalWin;

        // Update balance
        supabaseRequest($url, $key, 'PATCH', $table, 
            [$whereField => 'eq.' . $whereValue], 
            [$balanceField => $newBalance]
        );

        // Log transaction
        supabaseRequest($url, $key, 'POST', 'transactions', [], [
            'telegram_id' => $telegramId,
            'type' => 'slots',
            'amount' => $totalWin,
            'reason' => 'slots_spin',
            'metadata' => json_encode([
                'bet' => $bet,
                'win' => $win,
                'symbols' => $symbols,
                'jackpot_win' => $jackpotData['jackpotWin']
            ])
        ]);

        // Send alerts for big wins
        if ($isJackpot && $jackpotData['jackpotWin'] > 0) {
            sendJackpotAlert($telegramId, $jackpotData['jackpotWin'], $totalWin, $bet);
        }

        returnSuccess([
            'telegram_id' => $telegramId,
            'previous_balance' => $currentBalance,
            'new_balance' => $newBalance,
            'spin_result' => $totalWin,
            'is_jackpot' => $isJackpot,
            'jackpot_win' => $jackpotData['jackpotWin'],
            'jackpot_pool' => $jackpotData['poolAfter']
        ]);

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * Handle jackpot pool logic
 */
function handleJackpotPool($url, $key, $bet, $isJackpot) {
    $poolResult = supabaseRequest($url, $key, 'GET', 'slots_jackpot_pool', ['id' => 'eq.1']);
    
    $poolBefore = 0;
    $totalContributed = 0;
    
    if (!empty($poolResult['data'])) {
        $poolBefore = (int)$poolResult['data'][0]['current_pool'];
        $totalContributed = (int)($poolResult['data'][0]['total_contributed'] ?? 0);
    } else {
        supabaseRequest($url, $key, 'POST', 'slots_jackpot_pool', [], [
            'id' => 1, 'current_pool' => 0
        ]);
    }

    // 5% contribution
    $contribution = $bet > 0 ? (int)floor($bet * 0.05) : 0;
    $poolAfter = $poolBefore + $contribution;
    $jackpotWin = 0;

    if ($isJackpot && $poolAfter > 0) {
        $jackpotWin = $poolAfter;
        $poolAfter = 0;
    }

    // Update pool
    supabaseRequest($url, $key, 'PATCH', 'slots_jackpot_pool', ['id' => 'eq.1'], [
        'current_pool' => $poolAfter,
        'total_contributed' => $totalContributed + $contribution,
        'updated_at' => date('c')
    ]);

    return [
        'poolBefore' => $poolBefore,
        'poolAfter' => $poolAfter,
        'contribution' => $contribution,
        'jackpotWin' => $jackpotWin
    ];
}

/**
 * Get jackpot pool
 */
function handleGetJackpotPool($url, $key) {
    try {
        $result = supabaseRequest($url, $key, 'GET', 'slots_jackpot_pool', ['id' => 'eq.1']);
        
        if (empty($result['data'])) {
            returnSuccess(['current_pool' => 0, 'total_contributed' => 0, 'total_won' => 0]);
        }

        $pool = $result['data'][0];
        returnSuccess([
            'current_pool' => (int)$pool['current_pool'],
            'total_contributed' => (int)($pool['total_contributed'] ?? 0),
            'total_won' => (int)($pool['total_won'] ?? 0),
            'last_winner' => $pool['last_winner'] ?? null,
            'last_win_amount' => (int)($pool['last_win_amount'] ?? 0)
        ]);

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * Send jackpot alert to bot
 */
function sendJackpotAlert($telegramId, $jackpotWin, $totalWin, $bet) {
    $botToken = getenv('TELEGRAM_BOT_TOKEN');
    if (!$botToken) return;

    $message = "🎰🎰🎰 JACKPOT! 🎰🎰🎰\n\n"
        . "Player: {$telegramId}\n"
        . "Bet: {$bet} TAMA\n"
        . "Jackpot: {$jackpotWin} TAMA\n"
        . "Total Win: {$totalWin} TAMA";

    $adminId = getenv('ADMIN_IDS') ?: '7401131043';
    
    @file_get_contents("https://api.telegram.org/bot{$botToken}/sendMessage?" . http_build_query([
        'chat_id' => $adminId,
        'text' => $message
    ]));
}
