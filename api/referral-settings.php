<?php
// ============================================
// REFERRAL SETTINGS API
// ============================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $json = file_get_contents('php://input');
    $data = json_decode($json, true) ?? [];
    
    // GET - Получить настройки
    if ($method === 'GET') {
        // Проверяем есть ли таблица referral_settings
        $checkTable = $pdo->query("
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'referral_settings'
            );
        ")->fetch(PDO::FETCH_ASSOC);
        
        if ($checkTable['exists'] === false) {
            // Создаем таблицу если её нет
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS referral_settings (
                    id SERIAL PRIMARY KEY,
                    setting_key VARCHAR(100) UNIQUE NOT NULL,
                    setting_value TEXT NOT NULL,
                    description TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_by VARCHAR(100)
                );
            ");
            
            // Вставляем дефолтные значения
            $defaults = [
                ['referral_reward', '1000', 'TAMA reward for each referral'],
                ['milestone_5', '1000', 'TAMA bonus for 5 referrals'],
                ['milestone_10', '3000', 'TAMA bonus for 10 referrals'],
                ['milestone_25', '10000', 'TAMA bonus for 25 referrals'],
                ['milestone_50', '30000', 'TAMA bonus for 50 referrals'],
                ['milestone_100', '100000', 'TAMA bonus for 100 referrals']
            ];
            
            $stmt = $pdo->prepare("
                INSERT INTO referral_settings (setting_key, setting_value, description) 
                VALUES (?, ?, ?)
                ON CONFLICT (setting_key) DO NOTHING
            ");
            
            foreach ($defaults as $default) {
                $stmt->execute($default);
            }
        }
        
        // Получаем все настройки
        $stmt = $pdo->query("SELECT * FROM referral_settings ORDER BY setting_key");
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $result = [];
        foreach ($settings as $setting) {
            $result[$setting['setting_key']] = [
                'value' => $setting['setting_value'],
                'description' => $setting['description'],
                'updated_at' => $setting['updated_at']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'settings' => $result
        ]);
        exit;
    }
    
    // POST/PUT - Обновить настройки
    if ($method === 'POST' || $method === 'PUT') {
        $settings = $data['settings'] ?? [];
        $updated_by = $data['updated_by'] ?? 'admin';
        
        if (empty($settings)) {
            throw new Exception('No settings provided');
        }
        
        // Проверяем/создаем таблицу
        $checkTable = $pdo->query("
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'referral_settings'
            );
        ")->fetch(PDO::FETCH_ASSOC);
        
        if ($checkTable['exists'] === false) {
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS referral_settings (
                    id SERIAL PRIMARY KEY,
                    setting_key VARCHAR(100) UNIQUE NOT NULL,
                    setting_value TEXT NOT NULL,
                    description TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_by VARCHAR(100)
                );
            ");
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO referral_settings (setting_key, setting_value, description, updated_by, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT (setting_key) 
            DO UPDATE SET 
                setting_value = EXCLUDED.setting_value,
                updated_by = EXCLUDED.updated_by,
                updated_at = CURRENT_TIMESTAMP
        ");
        
        $updated = [];
        foreach ($settings as $key => $value) {
            if (is_array($value)) {
                $settingValue = $value['value'] ?? $value;
                $description = $value['description'] ?? '';
            } else {
                $settingValue = $value;
                $description = '';
            }
            
            // Валидация: только положительные числа
            if (!is_numeric($settingValue) || $settingValue < 0) {
                throw new Exception("Invalid value for $key: must be a positive number");
            }
            
            $stmt->execute([$key, $settingValue, $description, $updated_by]);
            $updated[] = $key;
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Settings updated successfully',
            'updated' => $updated
        ]);
        exit;
    }
    
    throw new Exception('Method not allowed');
    
} catch (Exception $e) {
    error_log("❌ Referral settings API error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

