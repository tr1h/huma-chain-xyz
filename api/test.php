<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
echo json_encode(['success' => true, 'message' => 'PHP is working', 'server' => 'Apache']);
?>

