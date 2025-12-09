<?php
/**
 * 🔐 TELEGRAM WEBAPP AUTHENTICATION
 * Validates Telegram WebApp initData to prevent user_id spoofing
 * 
 * Security Fix: Prevent anyone from changing user_id in URL
 */

/**
 * Validate Telegram WebApp initData
 * 
 * @param string $initData Raw initData from Telegram.WebApp.initData
 * @param string $botToken Your bot token
 * @return array ['valid' => bool, 'user_id' => string|null, 'error' => string|null]
 */
function validateTelegramWebAppData($initData, $botToken) {
    try {
        if (empty($initData)) {
            return ['valid' => false, 'user_id' => null, 'error' => 'initData is empty'];
        }

        // Parse initData (it's a query string)
        parse_str($initData, $params);
        
        if (!isset($params['hash'])) {
            return ['valid' => false, 'user_id' => null, 'error' => 'hash not found in initData'];
        }

        $hash = $params['hash'];
        unset($params['hash']); // Remove hash from params for validation

        // Sort params by key
        ksort($params);

        // Build data_check_string
        $dataCheckArray = [];
        foreach ($params as $key => $value) {
            $dataCheckArray[] = $key . '=' . $value;
        }
        $dataCheckString = implode("\n", $dataCheckArray);

        // Calculate secret key: HMAC-SHA256("WebAppData", bot_token)
        $secretKey = hash_hmac('sha256', $botToken, "WebAppData", true);

        // Calculate hash: HMAC-SHA256(data_check_string, secret_key)
        $calculatedHash = hash_hmac('sha256', $dataCheckString, $secretKey);

        // Compare hashes
        if (!hash_equals($calculatedHash, $hash)) {
            return ['valid' => false, 'user_id' => null, 'error' => 'Invalid hash - data may be tampered'];
        }

        // Check auth_date (should be recent, not older than 24 hours)
        $authDate = isset($params['auth_date']) ? (int)$params['auth_date'] : 0;
        $currentTime = time();
        $maxAge = 86400; // 24 hours

        if ($authDate && ($currentTime - $authDate) > $maxAge) {
            return ['valid' => false, 'user_id' => null, 'error' => 'initData is too old (>24h)'];
        }

        // Extract user_id from user data
        $userId = null;
        if (isset($params['user'])) {
            $userData = json_decode($params['user'], true);
            $userId = isset($userData['id']) ? (string)$userData['id'] : null;
        }

        if (!$userId) {
            return ['valid' => false, 'user_id' => null, 'error' => 'user_id not found in initData'];
        }

        // ✅ SUCCESS! InitData is valid
        return [
            'valid' => true,
            'user_id' => $userId,
            'error' => null,
            'auth_date' => $authDate,
            'user_data' => isset($params['user']) ? json_decode($params['user'], true) : null
        ];

    } catch (Exception $e) {
        error_log("❌ Telegram auth validation error: " . $e->getMessage());
        return ['valid' => false, 'user_id' => null, 'error' => 'Validation error: ' . $e->getMessage()];
    }
}

/**
 * Validate request from Telegram WebApp
 * Returns validated user_id or sends 403 and exits
 * 
 * @param array $requestData Request data with 'init_data' and 'telegram_id' fields
 * @param string $botToken Bot token (if empty, skip validation - DEV MODE)
 * @return string Validated user_id
 */
function validateWebAppRequest($requestData, $botToken) {
    $initData = $requestData['init_data'] ?? null;
    $telegramId = $requestData['telegram_id'] ?? null;
    
    // DEV MODE: If BOT_TOKEN not set, skip validation
    if (empty($botToken)) {
        error_log("⚠️ BOT_TOKEN not set - skipping auth validation (DEV MODE)");
        if ($telegramId) {
            return $telegramId;
        }
        http_response_code(400);
        echo json_encode([
            'error' => 'Bad Request',
            'message' => 'Missing telegram_id'
        ]);
        exit();
    }
    
    // PRODUCTION MODE: Validate init_data
    if (!$initData) {
        error_log("🚫 Missing init_data in request");
        http_response_code(403);
        echo json_encode([
            'error' => 'Unauthorized',
            'message' => 'Missing init_data. Please open game through Telegram bot.',
            'dev_hint' => 'Set BOT_TOKEN env variable to enable authentication'
        ]);
        exit();
    }

    $validation = validateTelegramWebAppData($initData, $botToken);

    if (!$validation['valid']) {
        error_log("🚫 Telegram auth failed: " . $validation['error']);
        http_response_code(403);
        echo json_encode([
            'error' => 'Unauthorized',
            'message' => 'Invalid authentication. Please reopen game through Telegram bot.',
            'details' => $validation['error']
        ]);
        exit();
    }

    // ✅ Valid! Return user_id
    return $validation['user_id'];
}

?>

