<?php
// Router for PHP built-in server
// Routes /api/tama/* requests to tama_supabase.php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route /api/tama/* to tama_supabase.php
if (preg_match('#^/api/tama#', $uri)) {
    // Change to api directory
    chdir(__DIR__);
    // Set REQUEST_URI to the path after /api/tama
    $_SERVER['REQUEST_URI'] = $uri;
    require __DIR__ . '/tama_supabase.php';
    exit;
} else {
    // Serve static files or return 404
    if (file_exists(__DIR__ . $uri)) {
        return false; // Let PHP serve the file
    } else {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Not found', 'uri' => $uri]);
    }
}

