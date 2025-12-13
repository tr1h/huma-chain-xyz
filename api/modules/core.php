<?php
/**
 * Core API Module - Base functions and utilities
 */

/**
 * Supabase REST API request helper
 */
function supabaseRequest($url, $key, $method = 'GET', $table = '', $params = [], $body = null) {
    $apiUrl = rtrim($url, '/') . '/rest/v1/' . $table;

    if (!empty($params)) {
        $queryString = http_build_query($params);
        $apiUrl .= '?' . $queryString;
    }

    $headers = [];
    $ch = curl_init($apiUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'apikey: ' . $key,
            'Authorization: Bearer ' . $key,
            'Content-Type: application/json',
            'Prefer: return=representation,count=exact'
        ],
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HEADERFUNCTION => function($curl, $header) use (&$headers) {
            $len = strlen($header);
            $header = explode(':', $header, 2);
            if (count($header) < 2) return $len;
            $headers[strtolower(trim($header[0]))] = trim($header[1]);
            return $len;
        }
    ]);

    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        throw new Exception('CURL error: ' . $error);
    }

    $result = [
        'code' => $httpCode,
        'data' => json_decode($response, true) ?: []
    ];

    if (isset($headers['content-range']) && preg_match('/\/(\d+)$/', $headers['content-range'], $matches)) {
        $result['count'] = (int)$matches[1];
    }

    return $result;
}

/**
 * Return JSON error response
 */
function returnError($message, $code = 400, $details = null) {
    http_response_code($code);
    $response = ['success' => false, 'error' => $message];
    if ($details) $response['details'] = $details;
    echo json_encode($response);
    exit();
}

/**
 * Return JSON success response
 */
function returnSuccess($data, $message = null) {
    $response = ['success' => true];
    if ($message) $response['message'] = $message;
    if (is_array($data)) {
        $response = array_merge($response, $data);
    } else {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit();
}

/**
 * Get request body as array
 */
function getRequestBody() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?: [];
}

/**
 * Log API action
 */
function logAction($action, $data = []) {
    error_log(sprintf('[TAMA API] %s: %s', $action, json_encode($data)));
}
