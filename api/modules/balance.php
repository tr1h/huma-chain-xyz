<?php
/**
 * Balance Module - User balance operations
 */

require_once __DIR__ . '/core.php';

/**
 * Get user balance
 */
function handleGetBalance($url, $key) {
    $telegram_id = $_GET['telegram_id'] ?? null;

    if ($telegram_id && preg_match('/^(\d+)/', $telegram_id, $matches)) {
        $telegram_id = $matches[1];
    }

    if (!$telegram_id) {
        returnError('telegram_id is required', 400);
    }

    try {
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => '*',
            'telegram_id' => 'eq.' . $telegram_id,
            'limit' => '1'
        ]);

        if (empty($result['data'])) {
            returnSuccess([
                'telegram_id' => $telegram_id,
                'database_tama' => 0,
                'blockchain_tama' => 0,
                'total_tama' => 0,
                'pet_name' => null,
                'pet_type' => null,
                'level' => 1,
                'xp' => 0
            ]);
        }

        $player = $result['data'][0];
        $database_tama = (int)($player['tama'] ?? 0);

        returnSuccess([
            'telegram_id' => $telegram_id,
            'database_tama' => $database_tama,
            'blockchain_tama' => 0,
            'total_tama' => $database_tama,
            'pet_name' => $player['pet_name'] ?? null,
            'pet_type' => $player['pet_type'] ?? null,
            'level' => (int)($player['level'] ?? 1),
            'xp' => (int)($player['xp'] ?? 0)
        ]);

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * Add TAMA to user
 */
function handleAddTama($url, $key) {
    $input = getRequestBody();
    $telegram_id = $input['telegram_id'] ?? null;
    $amount = $input['amount'] ?? null;
    $reason = $input['reason'] ?? 'api_add';
    $source = $input['source'] ?? 'api';

    if (!$telegram_id || !$amount) {
        returnError('telegram_id and amount are required', 400);
    }

    $amount = (int)$amount;
    if ($amount <= 0) {
        returnError('Amount must be positive', 400);
    }

    try {
        // Get current balance
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => '*',
            'telegram_id' => 'eq.' . $telegram_id,
            'limit' => '1'
        ]);

        if (empty($result['data'])) {
            // Create new user
            $newBalance = $amount;
            supabaseRequest($url, $key, 'POST', 'leaderboard', [], [
                'telegram_id' => $telegram_id,
                'tama' => $newBalance,
                'level' => 1,
                'xp' => 0
            ]);
        } else {
            $player = $result['data'][0];
            $newBalance = (int)($player['tama'] ?? 0) + $amount;
            
            supabaseRequest($url, $key, 'PATCH', 'leaderboard', 
                ['telegram_id' => 'eq.' . $telegram_id], 
                ['tama' => $newBalance]
            );
        }

        // Log transaction
        supabaseRequest($url, $key, 'POST', 'transactions', [], [
            'telegram_id' => $telegram_id,
            'type' => 'add',
            'amount' => $amount,
            'reason' => $reason,
            'source' => $source,
            'balance_after' => $newBalance
        ]);

        logAction('add_tama', ['telegram_id' => $telegram_id, 'amount' => $amount]);

        returnSuccess([
            'telegram_id' => $telegram_id,
            'amount_added' => $amount,
            'new_balance' => $newBalance
        ], 'TAMA added successfully');

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * Spend TAMA from user
 */
function handleSpendTama($url, $key) {
    $input = getRequestBody();
    $telegram_id = $input['telegram_id'] ?? null;
    $amount = $input['amount'] ?? null;
    $reason = $input['reason'] ?? 'api_spend';

    if (!$telegram_id || !$amount) {
        returnError('telegram_id and amount are required', 400);
    }

    $amount = (int)$amount;
    if ($amount <= 0) {
        returnError('Amount must be positive', 400);
    }

    try {
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => '*',
            'telegram_id' => 'eq.' . $telegram_id,
            'limit' => '1'
        ]);

        if (empty($result['data'])) {
            returnError('User not found', 404);
        }

        $player = $result['data'][0];
        $currentBalance = (int)($player['tama'] ?? 0);

        if ($currentBalance < $amount) {
            returnError('Insufficient balance', 400, [
                'current_balance' => $currentBalance,
                'required' => $amount
            ]);
        }

        $newBalance = $currentBalance - $amount;
        
        supabaseRequest($url, $key, 'PATCH', 'leaderboard', 
            ['telegram_id' => 'eq.' . $telegram_id], 
            ['tama' => $newBalance]
        );

        // Log transaction
        supabaseRequest($url, $key, 'POST', 'transactions', [], [
            'telegram_id' => $telegram_id,
            'type' => 'spend',
            'amount' => -$amount,
            'reason' => $reason,
            'balance_after' => $newBalance
        ]);

        logAction('spend_tama', ['telegram_id' => $telegram_id, 'amount' => $amount]);

        returnSuccess([
            'telegram_id' => $telegram_id,
            'amount_spent' => $amount,
            'new_balance' => $newBalance
        ], 'TAMA spent successfully');

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}

/**
 * Update wallet address
 */
function handleUpdateWallet($url, $key) {
    $input = getRequestBody();
    $telegram_id = $input['telegram_id'] ?? null;
    $wallet_address = $input['wallet_address'] ?? null;

    if (!$telegram_id || !$wallet_address) {
        returnError('telegram_id and wallet_address are required', 400);
    }

    try {
        // Update in leaderboard
        $check = supabaseRequest($url, $key, 'GET', 'leaderboard', ['telegram_id' => "eq.$telegram_id"]);
        
        if (!empty($check['data'])) {
            supabaseRequest($url, $key, 'PATCH', 'leaderboard', 
                ['telegram_id' => "eq.$telegram_id"], 
                ['wallet_address' => $wallet_address]
            );
        }

        logAction('update_wallet', ['telegram_id' => $telegram_id, 'wallet' => substr($wallet_address, 0, 8) . '...']);

        returnSuccess([
            'telegram_id' => $telegram_id,
            'wallet_address' => $wallet_address
        ], 'Wallet address updated');

    } catch (Exception $e) {
        returnError($e->getMessage(), 500);
    }
}
