<?php
/**
 * 🔍 АНАЛИЗ ТРАНЗАКЦИЙ ПОЛЬЗОВАТЕЛЯ
 * Проверка честности начислений TAMA
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$username = $_GET['username'] ?? null;
$user_id = $_GET['user_id'] ?? null;

// URL decode username to handle special characters like apostrophes
if ($username) {
    $username = urldecode($username);
}

if (!$username && !$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'username or user_id required']);
    exit;
}

try {
    // Получить пользователя из leaderboard
    $supabaseUrl = getenv('SUPABASE_URL') ?: 'https://zfrazyupameidxpjihrh.supabase.co';
    $supabaseKey = getenv('SUPABASE_KEY');
    
    if (!$supabaseKey) {
        // Попробовать из config.php если есть
        if (file_exists(__DIR__ . '/config.php')) {
            require_once __DIR__ . '/config.php';
            if (defined('SUPABASE_KEY')) {
                $supabaseKey = SUPABASE_KEY;
            }
        }
    }
    
    if (!$supabaseKey) {
        throw new Exception('SUPABASE_KEY not configured');
    }
    
    // Функция для запросов к Supabase
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
    
    // Найти пользователя
    $userQuery = $user_id ? ['telegram_id' => 'eq.' . $user_id] : ['telegram_username' => 'eq.' . $username];
    $userResult = supabaseRequest($supabaseUrl, $supabaseKey, 'GET', 'leaderboard', array_merge([
        'select' => 'telegram_id,telegram_username,tama,level,xp,created_at',
        'limit' => '1'
    ], $userQuery));
    
    if (empty($userResult['data'])) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }
    
    $user = $userResult['data'][0];
    $foundUserId = $user['telegram_id'];
    
    // Получить ВСЕ транзакции пользователя
    $allTransactions = [];
    $offset = 0;
    $limit = 1000;
    
    while (true) {
        $txResult = supabaseRequest($supabaseUrl, $supabaseKey, 'GET', 'transactions', [
            'select' => 'id,user_id,username,type,amount,balance_before,balance_after,metadata,created_at',
            'user_id' => 'eq.' . $foundUserId,
            'order' => 'created_at.asc',
            'limit' => $limit,
            'offset' => $offset
        ]);
        
        if (empty($txResult['data'])) {
            break;
        }
        
        $allTransactions = array_merge($allTransactions, $txResult['data']);
        
        if (count($txResult['data']) < $limit) {
            break;
        }
        
        $offset += $limit;
        
        // Защита от бесконечного цикла
        if ($offset > 10000) {
            break;
        }
    }
    
    // Анализ транзакций
    $analysis = [
        'user' => [
            'telegram_id' => $user['telegram_id'],
            'username' => $user['telegram_username'] ?? 'N/A',
            'current_balance' => (int)($user['tama'] ?? 0),
            'level' => (int)($user['level'] ?? 1),
            'total_transactions' => count($allTransactions)
        ],
        'earnings' => [
            'total_earned' => 0,
            'total_spent' => 0,
            'net_balance' => 0,
            'by_type' => []
        ],
        'suspicious_patterns' => [],
        'daily_breakdown' => [],
        'largest_transactions' => []
    ];
    
    // Анализ по типам
    foreach ($allTransactions as $tx) {
        $amount = abs((int)($tx['amount'] ?? 0));
        $type = $tx['type'] ?? 'unknown';
        
        if (!isset($analysis['earnings']['by_type'][$type])) {
            $analysis['earnings']['by_type'][$type] = [
                'count' => 0,
                'total' => 0
            ];
        }
        
        $analysis['earnings']['by_type'][$type]['count']++;
        $analysis['earnings']['by_type'][$type]['total'] += $amount;
        
        // Подсчет заработанного/потраченного
        if (strpos($type, 'earn') === 0 || $type === 'level_up' || $type === 'quest' || $type === 'referral') {
            $analysis['earnings']['total_earned'] += $amount;
        } else {
            $analysis['earnings']['total_spent'] += $amount;
        }
        
        // Сохранить крупные транзакции
        if ($amount > 1000) {
            $analysis['largest_transactions'][] = [
                'date' => $tx['created_at'],
                'type' => $type,
                'amount' => $amount,
                'balance_after' => (int)($tx['balance_after'] ?? 0)
            ];
        }
    }
    
    $analysis['earnings']['net_balance'] = $analysis['earnings']['total_earned'] - $analysis['earnings']['total_spent'];
    
    // Анализ по дням
    $dailyEarnings = [];
    foreach ($allTransactions as $tx) {
        if (strpos($tx['type'] ?? '', 'earn') === 0) {
            $date = substr($tx['created_at'], 0, 10); // YYYY-MM-DD
            if (!isset($dailyEarnings[$date])) {
                $dailyEarnings[$date] = 0;
            }
            $dailyEarnings[$date] += abs((int)($tx['amount'] ?? 0));
        }
    }
    
    // Сортировка по дате
    ksort($dailyEarnings);
    $analysis['daily_breakdown'] = $dailyEarnings;
    
    // Поиск подозрительных паттернов
    // 1. Слишком большие единичные начисления (>10,000 TAMA)
    foreach ($allTransactions as $tx) {
        $amount = abs((int)($tx['amount'] ?? 0));
        if ($amount > 10000 && strpos($tx['type'] ?? '', 'earn') === 0) {
            $analysis['suspicious_patterns'][] = [
                'type' => 'large_single_earning',
                'severity' => 'high',
                'date' => $tx['created_at'],
                'amount' => $amount,
                'description' => "Single earning of {$amount} TAMA (exceeds 10,000 limit)"
            ];
        }
    }
    
    // 2. Слишком много начислений за день (>10,000 TAMA)
    foreach ($dailyEarnings as $date => $dailyTotal) {
        if ($dailyTotal > 10000) {
            $analysis['suspicious_patterns'][] = [
                'type' => 'excessive_daily_earning',
                'severity' => 'high',
                'date' => $date,
                'amount' => $dailyTotal,
                'description' => "Daily earning of {$dailyTotal} TAMA exceeds 10,000 limit"
            ];
        }
    }
    
    // 3. Быстрые последовательные начисления (подозрение на бот)
    $recentTx = [];
    foreach ($allTransactions as $tx) {
        if (strpos($tx['type'] ?? '', 'earn') === 0) {
            $recentTx[] = $tx;
        }
    }
    
    // Проверка интервалов между транзакциями
    for ($i = 1; $i < count($recentTx); $i++) {
        $prevTime = strtotime($recentTx[$i-1]['created_at']);
        $currTime = strtotime($recentTx[$i]['created_at']);
        $interval = $currTime - $prevTime;
        
        // Если интервал меньше 0.8 секунды (cooldown), это подозрительно
        if ($interval < 0.8 && $interval > 0) {
            $analysis['suspicious_patterns'][] = [
                'type' => 'rapid_fire_clicks',
                'severity' => 'medium',
                'date' => $recentTx[$i]['created_at'],
                'interval' => $interval,
                'description' => "Transaction interval of {$interval}s (below 0.8s cooldown)"
            ];
        }
    }
    
    // 4. Проверка баланса
    $calculatedBalance = $analysis['earnings']['net_balance'];
    $actualBalance = $analysis['user']['current_balance'];
    $balanceDiff = abs($calculatedBalance - $actualBalance);
    
    if ($balanceDiff > 100) {
        $analysis['suspicious_patterns'][] = [
            'type' => 'balance_mismatch',
            'severity' => 'high',
            'calculated' => $calculatedBalance,
            'actual' => $actualBalance,
            'difference' => $balanceDiff,
            'description' => "Balance mismatch: calculated {$calculatedBalance}, actual {$actualBalance} (diff: {$balanceDiff})"
        ];
    }
    
    // 5. Проверка резких скачков баланса (пропущенные транзакции)
    if (count($allTransactions) > 1) {
        // Сортировка по дате
        usort($allTransactions, function($a, $b) {
            return strtotime($a['created_at']) - strtotime($b['created_at']);
        });
        
        for ($i = 1; $i < count($allTransactions); $i++) {
            $prevTx = $allTransactions[$i-1];
            $currTx = $allTransactions[$i];
            
            $prevBalance = (int)($prevTx['balance_after'] ?? 0);
            $currBalanceBefore = (int)($currTx['balance_before'] ?? 0);
            $currAmount = abs((int)($currTx['amount'] ?? 0));
            
            // Если баланс до текущей транзакции не совпадает с балансом после предыдущей
            // И разница большая - это подозрительно
            $balanceJump = abs($currBalanceBefore - $prevBalance);
            
            if ($balanceJump > 1000 && $balanceJump > $currAmount * 10) {
                $timeDiff = strtotime($currTx['created_at']) - strtotime($prevTx['created_at']);
                $analysis['suspicious_patterns'][] = [
                    'type' => 'balance_jump',
                    'severity' => 'high',
                    'date' => $currTx['created_at'],
                    'previous_balance' => $prevBalance,
                    'current_balance_before' => $currBalanceBefore,
                    'jump_amount' => $balanceJump,
                    'time_between' => $timeDiff . ' seconds',
                    'description' => "Suspicious balance jump: {$prevBalance} → {$currBalanceBefore} (+{$balanceJump} TAMA) in {$timeDiff}s. Missing transactions?"
                ];
            }
        }
    }
    
    // Сортировка подозрительных паттернов по серьезности
    usort($analysis['suspicious_patterns'], function($a, $b) {
        $severity = ['high' => 3, 'medium' => 2, 'low' => 1];
        return ($severity[$b['severity']] ?? 0) - ($severity[$a['severity']] ?? 0);
    });
    
    // Сортировка крупных транзакций
    usort($analysis['largest_transactions'], function($a, $b) {
        return $b['amount'] - $a['amount'];
    });
    $analysis['largest_transactions'] = array_slice($analysis['largest_transactions'], 0, 20);
    
    echo json_encode($analysis, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

