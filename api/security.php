<?php
/**
 * Security Functions
 * Validation, Rate Limiting, and Input Sanitization
 */

// ============================================
// INPUT VALIDATION
// ============================================

/**
 * Validate Solana wallet address
 * @param string $address Solana address to validate
 * @return bool True if valid, false otherwise
 */
function validateSolanaAddress($address) {
    if (!is_string($address)) {
        return false;
    }
    
    // Solana addresses are base58 encoded, 32-44 characters
    // Valid characters: 1-9, A-H, J-N, P-Z, a-k, m-z (no 0, O, I, l)
    return preg_match('/^[1-9A-HJ-NP-Za-km-z]{32,44}$/', $address) === 1;
}

/**
 * Validate Telegram ID
 * @param mixed $telegram_id Telegram ID to validate
 * @return int|false Valid telegram ID or false
 */
function validateTelegramId($telegram_id) {
    $id = filter_var($telegram_id, FILTER_VALIDATE_INT);
    
    if ($id === false || $id <= 0) {
        return false;
    }
    
    // Telegram IDs are typically 7-12 digits
    if ($id < 1000000 || $id > 9999999999999) {
        return false;
    }
    
    return $id;
}

/**
 * Validate TAMA amount
 * @param mixed $amount Amount to validate
 * @return float|false Valid amount or false
 */
function validateTamaAmount($amount) {
    $amount = filter_var($amount, FILTER_VALIDATE_FLOAT);
    
    if ($amount === false || $amount < 0) {
        return false;
    }
    
    // Max reasonable amount: 1 billion TAMA
    if ($amount > 1000000000) {
        return false;
    }
    
    return $amount;
}

/**
 * Sanitize string for shell command
 * @param string $input Input string
 * @return string Escaped string safe for shell
 */
function sanitizeForShell($input) {
    return escapeshellarg($input);
}

// ============================================
// RATE LIMITING
// ============================================

/**
 * Simple rate limiter using file-based storage
 * For production, use Redis or Memcached
 * 
 * @param string $key Identifier (e.g., IP address or user ID)
 * @param int $limit Maximum requests allowed
 * @param int $window Time window in seconds
 * @return bool True if request allowed, false if rate limited
 */
function checkRateLimit($key, $limit = 100, $window = 60) {
    $cacheDir = sys_get_temp_dir() . '/tama_rate_limit';
    
    // Create cache directory if doesn't exist
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0777, true);
    }
    
    $cacheFile = $cacheDir . '/' . md5($key) . '.json';
    $now = time();
    
    // Read current data
    $data = [];
    if (file_exists($cacheFile)) {
        $content = @file_get_contents($cacheFile);
        if ($content) {
            $data = json_decode($content, true) ?: [];
        }
    }
    
    // Clean old requests (outside window)
    $data['requests'] = array_filter($data['requests'] ?? [], function($timestamp) use ($now, $window) {
        return ($now - $timestamp) < $window;
    });
    
    // Check if limit exceeded
    if (count($data['requests']) >= $limit) {
        error_log("🚨 RATE LIMIT: Key '{$key}' exceeded {$limit} requests in {$window}s");
        return false;
    }
    
    // Add current request
    $data['requests'][] = $now;
    
    // Save updated data
    @file_put_contents($cacheFile, json_encode($data));
    
    return true;
}

/**
 * Get client IP address (even behind proxy)
 * @return string Client IP address
 */
function getClientIP() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    
    // Check for proxy headers
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        // Cloudflare
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        // Standard proxy header
        $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    } elseif (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        // Nginx proxy
        $ip = $_SERVER['HTTP_X_REAL_IP'];
    }
    
    return trim($ip);
}

/**
 * Check withdrawal cooldown (1 per hour per user)
 * @param int $telegram_id User's Telegram ID
 * @param int $cooldown Cooldown in seconds (default: 1 hour)
 * @return bool True if allowed, false if in cooldown
 */
function checkWithdrawalCooldown($telegram_id, $cooldown = 3600) {
    $cacheDir = sys_get_temp_dir() . '/tama_withdrawal_cooldown';
    
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0777, true);
    }
    
    $cacheFile = $cacheDir . '/user_' . $telegram_id . '.txt';
    $now = time();
    
    // Check last withdrawal time
    if (file_exists($cacheFile)) {
        $lastWithdrawal = (int)@file_get_contents($cacheFile);
        $timeSince = $now - $lastWithdrawal;
        
        if ($timeSince < $cooldown) {
            $remaining = $cooldown - $timeSince;
            error_log("⏰ COOLDOWN: User {$telegram_id} must wait {$remaining}s before next withdrawal");
            return false;
        }
    }
    
    // Update last withdrawal time
    @file_put_contents($cacheFile, $now);
    
    return true;
}

// ============================================
// SECURITY HEADERS
// ============================================

/**
 * Set security headers for API responses
 */
function setSecurityHeaders() {
    // Prevent clickjacking
    header('X-Frame-Options: DENY');
    
    // Prevent MIME type sniffing
    header('X-Content-Type-Options: nosniff');
    
    // Enable XSS protection
    header('X-XSS-Protection: 1; mode=block');
    
    // Content Security Policy
    header("Content-Security-Policy: default-src 'self'");
    
    // CORS (adjust as needed)
    $allowedOrigins = [
        'https://solanatamagotchi.com',
        'https://api.solanatamagotchi.com'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: {$origin}");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Return standardized error response
 * @param string $message Error message
 * @param int $code HTTP status code
 * @param array $details Additional details
 */
function returnError($message, $code = 400, $details = []) {
    http_response_code($code);
    
    $response = [
        'success' => false,
        'error' => $message
    ];
    
    if (!empty($details)) {
        $response['details'] = $details;
    }
    
    echo json_encode($response);
    exit;
}

/**
 * Return standardized success response
 * @param array $data Response data
 * @param string $message Optional success message
 */
function returnSuccess($data, $message = null) {
    http_response_code(200);
    
    $response = [
        'success' => true,
        'data' => $data
    ];
    
    if ($message) {
        $response['message'] = $message;
    }
    
    echo json_encode($response);
    exit;
}

// ============================================
// LOGGING
// ============================================

/**
 * Log security event
 * @param string $type Event type (e.g., 'rate_limit', 'invalid_input')
 * @param string $message Event message
 * @param array $context Additional context
 */
function logSecurityEvent($type, $message, $context = []) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'type' => $type,
        'message' => $message,
        'ip' => getClientIP(),
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'context' => $context
    ];
    
    error_log("🔒 SECURITY [{$type}]: " . json_encode($logEntry));
}

