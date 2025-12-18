<?php
/**
 * 🛡️ Error Handling Helper Functions
 * 
 * Reusable error handling utilities for API endpoints
 * Created by @Developer following @QA-Tester audit recommendations
 * 
 * Date: 2025-12-17
 */

/**
 * Safe curl request with automatic error handling
 * 
 * @param string $url URL to request
 * @param array $options Options: method, headers, body, timeout
 * @return array ['code' => int, 'body' => string, 'headers' => array]
 * @throws Exception on curl errors
 */
function safeCurl($url, $options = []) {
    $method = $options['method'] ?? 'GET';
    $headers = $options['headers'] ?? [];
    $body = $options['body'] ?? null;
    $timeout = $options['timeout'] ?? 30;
    $connectTimeout = $options['connect_timeout'] ?? 10;
    
    $ch = curl_init($url);
    
    if ($ch === false) {
        throw new Exception('Failed to initialize curl');
    }
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $connectTimeout);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }
    
    // Execute request
    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);
    
    // Check for curl errors
    if ($curlError) {
        error_log("🔴 cURL Error: $curlError (URL: $url)");
        throw new Exception('HTTP request failed: ' . $curlError);
    }
    
    // Check for HTTP errors
    if ($response === false) {
        throw new Exception('HTTP request returned false');
    }
    
    return [
        'code' => $httpCode,
        'body' => $response,
        'content_type' => $contentType
    ];
}

/**
 * Safe JSON decode with validation
 * 
 * @param string $json JSON string to decode
 * @param bool $assoc Return associative array instead of object
 * @return mixed Decoded data
 * @throws Exception on JSON errors
 */
function safeJsonDecode($json, $assoc = true) {
    if ($json === null || $json === '') {
        throw new Exception('JSON string is empty or null');
    }
    
    $data = json_decode($json, $assoc);
    
    // Check for JSON errors
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        $errorMsg = json_last_error_msg();
        error_log("🔴 JSON Decode Error: $errorMsg");
        throw new Exception('JSON decode failed: ' . $errorMsg);
    }
    
    return $data;
}

/**
 * Safe JSON encode with validation
 * 
 * @param mixed $data Data to encode
 * @param int $options JSON encode options
 * @return string JSON string
 * @throws Exception on JSON errors
 */
function safeJsonEncode($data, $options = 0) {
    $json = json_encode($data, $options);
    
    if ($json === false) {
        $errorMsg = json_last_error_msg();
        error_log("🔴 JSON Encode Error: $errorMsg");
        throw new Exception('JSON encode failed: ' . $errorMsg);
    }
    
    return $json;
}

/**
 * Safe file read with validation
 * 
 * @param string $path File path to read
 * @return string File contents
 * @throws Exception on file errors
 */
function safeFileRead($path) {
    if (!is_string($path) || $path === '') {
        throw new Exception('Invalid file path');
    }
    
    if (!file_exists($path)) {
        throw new Exception("File not found: $path");
    }
    
    if (!is_readable($path)) {
        throw new Exception("File not readable: $path");
    }
    
    $content = file_get_contents($path);
    
    if ($content === false) {
        throw new Exception("Failed to read file: $path");
    }
    
    return $content;
}

/**
 * Safe file write with validation
 * 
 * @param string $path File path to write
 * @param string $content Content to write
 * @param int $flags file_put_contents flags
 * @return int Number of bytes written
 * @throws Exception on file errors
 */
function safeFileWrite($path, $content, $flags = 0) {
    if (!is_string($path) || $path === '') {
        throw new Exception('Invalid file path');
    }
    
    $dir = dirname($path);
    if (!is_dir($dir)) {
        throw new Exception("Directory does not exist: $dir");
    }
    
    if (!is_writable($dir)) {
        throw new Exception("Directory not writable: $dir");
    }
    
    $bytes = file_put_contents($path, $content, $flags);
    
    if ($bytes === false) {
        throw new Exception("Failed to write file: $path");
    }
    
    return $bytes;
}

/**
 * Validate required fields in array
 * 
 * @param array $data Data array to validate
 * @param array $requiredFields Array of required field names
 * @throws Exception if required fields are missing
 */
function validateRequiredFields($data, $requiredFields) {
    if (!is_array($data)) {
        throw new Exception('Data must be an array');
    }
    
    $missing = [];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || $data[$field] === null || $data[$field] === '') {
            $missing[] = $field;
        }
    }
    
    if (!empty($missing)) {
        throw new Exception('Missing required fields: ' . implode(', ', $missing));
    }
}

/**
 * Safe array access with default value
 * 
 * @param array $array Array to access
 * @param string|int $key Key to access
 * @param mixed $default Default value if key not found
 * @return mixed Value or default
 */
function safeArrayGet($array, $key, $default = null) {
    return $array[$key] ?? $default;
}

/**
 * Safe nested array access
 * 
 * @param array $array Array to access
 * @param array $keys Array of nested keys ['data', 'user', 'name']
 * @param mixed $default Default value if path not found
 * @return mixed Value or default
 */
function safeArrayGetNested($array, $keys, $default = null) {
    $current = $array;
    
    foreach ($keys as $key) {
        if (!is_array($current) || !isset($current[$key])) {
            return $default;
        }
        $current = $current[$key];
    }
    
    return $current;
}

/**
 * Read and validate JSON input from php://input
 * 
 * @param array $requiredFields Optional array of required fields
 * @return array Decoded JSON data
 * @throws Exception on input errors
 */
function getJsonInput($requiredFields = []) {
    $input = file_get_contents('php://input');
    
    if ($input === false) {
        throw new Exception('Failed to read request body');
    }
    
    if ($input === '') {
        throw new Exception('Request body is empty');
    }
    
    $data = safeJsonDecode($input);
    
    if (!empty($requiredFields)) {
        validateRequiredFields($data, $requiredFields);
    }
    
    return $data;
}

/**
 * Send JSON error response and exit
 * 
 * @param string $error Error message for client
 * @param int $httpCode HTTP response code (default 500)
 * @param array $additionalData Additional data to include in response
 */
function sendErrorResponse($error, $httpCode = 500, $additionalData = []) {
    http_response_code($httpCode);
    
    $response = array_merge([
        'success' => false,
        'error' => $error
    ], $additionalData);
    
    echo safeJsonEncode($response);
    exit;
}

/**
 * Send JSON success response and exit
 * 
 * @param mixed $data Data to send
 * @param int $httpCode HTTP response code (default 200)
 */
function sendSuccessResponse($data, $httpCode = 200) {
    http_response_code($httpCode);
    
    if (!is_array($data)) {
        $data = ['data' => $data];
    }
    
    $response = array_merge(['success' => true], $data);
    
    echo safeJsonEncode($response);
    exit;
}

/**
 * Log error with context
 * 
 * @param string $message Error message
 * @param Exception|null $exception Optional exception object
 * @param array $context Optional context data
 */
function logError($message, $exception = null, $context = []) {
    $logMessage = "❌ ERROR: $message";
    
    if ($exception) {
        $logMessage .= "\n   Exception: " . $exception->getMessage();
        $logMessage .= "\n   File: " . $exception->getFile() . ":" . $exception->getLine();
        $logMessage .= "\n   Trace: " . $exception->getTraceAsString();
    }
    
    if (!empty($context)) {
        $logMessage .= "\n   Context: " . json_encode($context);
    }
    
    error_log($logMessage);
}

/**
 * Execute shell command safely
 * 
 * @param string $command Command to execute
 * @param int $timeout Timeout in seconds (default 30)
 * @return array ['output' => string, 'exit_code' => int]
 * @throws Exception on command failures
 */
function safeExec($command, $timeout = 30) {
    if (!is_string($command) || $command === '') {
        throw new Exception('Invalid command');
    }
    
    // Add timeout using timeout command if available
    if (PHP_OS_FAMILY !== 'Windows') {
        $command = "timeout $timeout $command 2>&1";
    }
    
    $output = [];
    $exitCode = 0;
    
    exec($command, $output, $exitCode);
    
    if ($exitCode !== 0) {
        throw new Exception("Command failed with exit code $exitCode: " . implode("\n", $output));
    }
    
    return [
        'output' => implode("\n", $output),
        'exit_code' => $exitCode
    ];
}

/**
 * Validate Solana wallet address format
 * 
 * @param string $address Wallet address to validate
 * @return bool True if valid
 */
function isValidSolanaAddress($address) {
    if (!is_string($address)) return false;
    $len = strlen($address);
    if ($len < 32 || $len > 44) return false;
    if (!preg_match('/^[1-9A-HJ-NP-Za-km-z]+$/', $address)) return false;
    return true;
}

/**
 * Validate telegram ID format
 * 
 * @param mixed $telegramId Telegram ID to validate
 * @return bool True if valid
 */
function isValidTelegramId($telegramId) {
    return is_numeric($telegramId) && $telegramId > 0;
}
?>
