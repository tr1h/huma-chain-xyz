<?php
/**
 * 🔍 ПРОВЕРКА ДУБЛИКАТОВ ТРАНЗАКЦИЙ
 * Находит дубликаты и подозрительные паттерны
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
$supabaseKey = getenv('SUPABASE_KEY');

if (!$supabaseKey && file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
    if (defined('SUPABASE_KEY')) {
        $supabaseKey = SUPABASE_KEY;
    }
}

if (!$supabaseKey) {
    http_response_code(500);
    echo json_encode(['error' => 'SUPABASE_KEY not configured']);
    exit;
}

function supabaseRequest($url, $key, $method = 'GET', $table = '', $params = [], $body = null) {
    $apiUrl = rtrim($url, '/') . '/rest/v1/' . $table;
    
    if (!empty($params)) {
        $queryString = http_build_query($params);
        $apiUrl .= '?' . $queryString;
    }
    
    $ch = curl_init($apiUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'apikey: ' . $key,
            'Authorization: Bearer ' . $key,
            'Content-Type: application/json',
            'Prefer: return=representation,count=exact'
        ],
        CURLOPT_CUSTOMREQUEST => $method
    ]);
    
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true) ?: []
    ];
}

try {
    // Получить статистику транзакций
    $stats = [
        'total_transactions' => 0,
        'by_type' => [],
        'duplicates' => [],
        'suspicious_patterns' => []
    ];
    
    // Получить общее количество
    $countResult = supabaseRequest($supabaseUrl, $supabaseKey, 'GET', 'transactions', [
        'select' => 'id',
        'limit' => '1'
    ]);
    
    // Получить последние 1000 транзакций для анализа
    $recentResult = supabaseRequest($supabaseUrl, $supabaseKey, 'GET', 'transactions', [
        'select' => 'id,user_id,username,type,amount,balance_before,balance_after,created_at',
        'order' => 'created_at.desc',
        'limit' => '1000'
    ]);
    
    if (!empty($recentResult['data'])) {
        $transactions = $recentResult['data'];
        $stats['total_transactions'] = count($transactions);
        
        // Анализ по типам
        foreach ($transactions as $tx) {
            $type = $tx['type'] ?? 'unknown';
            if (!isset($stats['by_type'][$type])) {
                $stats['by_type'][$type] = 0;
            }
            $stats['by_type'][$type]++;
        }
        
        // Поиск дубликатов (одинаковые user_id, type, amount, created_at в пределах 1 секунды)
        $seen = [];
        foreach ($transactions as $tx) {
            $key = sprintf(
                '%s_%s_%s_%s',
                $tx['user_id'] ?? '',
                $tx['type'] ?? '',
                $tx['amount'] ?? '',
                substr($tx['created_at'] ?? '', 0, 19) // YYYY-MM-DD HH:MM:SS
            );
            
            if (isset($seen[$key])) {
                $stats['duplicates'][] = [
                    'user_id' => $tx['user_id'],
                    'username' => $tx['username'],
                    'type' => $tx['type'],
                    'amount' => $tx['amount'],
                    'created_at' => $tx['created_at'],
                    'duplicate_of' => $seen[$key]
                ];
            } else {
                $seen[$key] = $tx['id'];
            }
        }
        
        // Поиск подозрительных паттернов (слишком много транзакций от одного пользователя за короткое время)
        $userActivity = [];
        foreach ($transactions as $tx) {
            $userId = $tx['user_id'] ?? 'unknown';
            $date = substr($tx['created_at'] ?? '', 0, 10); // YYYY-MM-DD
            
            if (!isset($userActivity[$userId])) {
                $userActivity[$userId] = [];
            }
            if (!isset($userActivity[$userId][$date])) {
                $userActivity[$userId][$date] = 0;
            }
            $userActivity[$userId][$date]++;
        }
        
        foreach ($userActivity as $userId => $dates) {
            foreach ($dates as $date => $count) {
                if ($count > 1000) { // Более 1000 транзакций за день - подозрительно
                    $stats['suspicious_patterns'][] = [
                        'type' => 'excessive_daily_transactions',
                        'user_id' => $userId,
                        'date' => $date,
                        'count' => $count,
                        'description' => "User {$userId} has {$count} transactions on {$date}"
                    ];
                }
            }
        }
    }
    
    echo json_encode($stats, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}



