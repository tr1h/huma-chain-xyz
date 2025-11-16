# 🔐 БЕЗОПАСНОСТЬ АДМИНКИ И ВАЛИДАЦИЯ API

## 1️⃣ КАК ПРЯЧУТ АДМИНСКОЕ МЕНЮ ДРУГИЕ ПРОЕКТЫ?

### ❌ ПЛОХИЕ ПРАКТИКИ (которые НЕ работают):

```html
<!-- ❌ ПЛОХО: Просто скрыть через CSS -->
<style>
  .admin-panel { display: none; }
</style>
<!-- Любой может открыть DevTools и убрать display:none! -->
```

```html
<!-- ❌ ПЛОХО: Пароль в JavaScript коде -->
<script>
  const ADMIN_PASSWORD = 'secret123'; // Видно в исходниках!
</script>
```

### ✅ ХОРОШИЕ ПРАКТИКИ (как делают профессиональные проекты):

#### **МЕТОД 1: Серверная авторизация (самый безопасный)**

```php
// api/admin-auth.php
<?php
session_start();

// Проверка авторизации
function requireAdminAuth() {
    if (!isset($_SESSION['admin_authenticated']) || $_SESSION['admin_authenticated'] !== true) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
}

// Проверка IP адреса (опционально)
function checkAdminIP() {
    $allowedIPs = ['123.45.67.89', '98.76.54.32']; // Твои IP адреса
    $clientIP = $_SERVER['REMOTE_ADDR'];
    
    if (!in_array($clientIP, $allowedIPs)) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: IP not allowed']);
        exit();
    }
}
```

```html
<!-- super-admin.html -->
<script>
// Проверка авторизации через API
async function checkAdminAuth() {
    const response = await fetch('/api/admin/check-auth', {
        credentials: 'include' // Отправляет cookies
    });
    
    if (!response.ok) {
        // Не авторизован - редирект на страницу входа
        window.location.href = '/admin-login.html';
        return false;
    }
    
    return true;
}

// При загрузке страницы
window.onload = async () => {
    if (!await checkAdminAuth()) {
        document.body.innerHTML = '<h1>Access Denied</h1>';
        return;
    }
    
    // Показываем админку только после проверки
    document.getElementById('adminContent').style.display = 'block';
};
</script>
```

#### **МЕТОД 2: JWT токены (для API)**

```php
// api/admin-login.php
<?php
function adminLogin($username, $password) {
    // Проверка пароля (из базы данных или env переменных)
    $adminPassword = getenv('ADMIN_PASSWORD_HASH');
    
    if (password_verify($password, $adminPassword)) {
        // Генерируем JWT токен
        $token = generateJWT([
            'admin' => true,
            'exp' => time() + 3600 // 1 час
        ]);
        
        return ['success' => true, 'token' => $token];
    }
    
    return ['success' => false, 'error' => 'Invalid credentials'];
}
```

```javascript
// В админке - сохраняем токен
localStorage.setItem('admin_token', token);

// При каждом запросе к API
fetch('/api/admin/stats', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
    }
});
```

#### **МЕТОД 3: Двухфакторная аутентификация (2FA)**

```javascript
// 1. Пароль
// 2. Код из Google Authenticator или SMS
async function adminLogin(password, twoFactorCode) {
    const response = await fetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password, twoFactorCode })
    });
    
    if (response.ok) {
        // Успешный вход
    }
}
```

#### **МЕТОД 4: Скрытие URL (не основной метод защиты!)**

```nginx
# .htaccess или nginx config
# Переименовать файл в случайное имя
# Было: super-admin.html
# Стало: a7f3k9m2x5p8q1w4.html

# Или использовать поддомен
# admin.solanatamagotchi.com (требует настройки DNS)
```

---

## 2️⃣ ЧТО ЗНАЧИТ "API ТРЕБУЕТ ВАЛИДАЦИЮ"?

### 📝 ПРОСТОЕ ОБЪЯСНЕНИЕ:

**Валидация** = проверка данных перед их использованием.

### ❌ БЕЗ ВАЛИДАЦИИ (опасно):

```php
// ❌ ПЛОХО: Принимаем любые данные без проверки
function handleAddTama() {
    $amount = $_POST['amount']; // Может быть "-999999999" или "DROP TABLE users;"
    $telegram_id = $_POST['telegram_id']; // Может быть "'; DELETE FROM leaderboard; --"
    
    // Прямо в базу данных - ОПАСНО!
    $db->query("UPDATE leaderboard SET tama = tama + $amount WHERE telegram_id = $telegram_id");
}
```

**Что может случиться:**
- 💰 Хакер может добавить себе миллионы TAMA
- 🗑️ Хакер может удалить данные из базы
- 💥 Хакер может сломать приложение

### ✅ С ВАЛИДАЦИЕЙ (безопасно):

```php
// ✅ ХОРОШО: Проверяем все данные
function handleAddTama() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // 1. Проверка наличия обязательных полей
    if (!isset($input['amount']) || !isset($input['telegram_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    // 2. Проверка типа данных
    $amount = $input['amount'];
    if (!is_numeric($amount)) {
        http_response_code(400);
        echo json_encode(['error' => 'Amount must be a number']);
        return;
    }
    
    // 3. Проверка диапазона значений
    $amount = (int)$amount;
    if ($amount < 1 || $amount > 1000000) {
        http_response_code(400);
        echo json_encode(['error' => 'Amount must be between 1 and 1,000,000']);
        return;
    }
    
    // 4. Проверка формата telegram_id
    $telegram_id = $input['telegram_id'];
    if (!is_numeric($telegram_id) || $telegram_id < 1) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid telegram_id']);
        return;
    }
    $telegram_id = (int)$telegram_id;
    
    // 5. Проверка существования пользователя
    $user = checkUserExists($telegram_id);
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        return;
    }
    
    // 6. Только после всех проверок - выполняем операцию
    updateBalance($telegram_id, $amount);
}
```

---

## 🔍 ВАЛИДАЦИЯ В ВАШЕМ ПРОЕКТЕ

### Примеры из вашего кода:

#### **1. Валидация в `mint-nft-sol-rest.php`:**

```php
// ✅ Проверка обязательных полей
if (!$wallet_address || !$tier_name || !$price_sol) {
    throw new Exception('Missing required fields');
}

// ✅ Проверка допустимых значений
$validTiers = ['Silver', 'Gold', 'Platinum', 'Diamond'];
if (!in_array($tier_name, $validTiers)) {
    throw new Exception("Invalid tier");
}

// ✅ Проверка диапазона цены
$expected_price = 0.15;
$tolerance = $expected_price * 0.05; // 5% tolerance
if ($price_sol < ($expected_price - $tolerance) || $price_sol > ($expected_price + $tolerance)) {
    throw new Exception("Invalid price");
}
```

#### **2. Валидация в `tama_supabase.php`:**

```php
// ✅ Проверка минимальной суммы
if ($amount < 1) {
    http_response_code(400);
    echo json_encode(['error' => 'Amount must be at least 1 TAMA']);
    return;
}

// ✅ Проверка существования файлов
if (!file_exists($fromKeypairPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'From keypair not found']);
    return;
}
```

---

## 🛡️ ЧТО ЕЩЁ МОЖНО ДОБАВИТЬ?

### **1. Rate Limiting (ограничение запросов)**

```php
// Защита от спама/атак
function checkRateLimit($ip, $endpoint) {
    $key = "rate_limit:$ip:$endpoint";
    $count = redis_get($key);
    
    if ($count > 100) { // Максимум 100 запросов в минуту
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests']);
        exit();
    }
    
    redis_incr($key);
    redis_expire($key, 60); // 1 минута
}
```

### **2. CSRF защита**

```php
// Защита от подделки запросов
function checkCSRFToken() {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    $sessionToken = $_SESSION['csrf_token'] ?? null;
    
    if ($token !== $sessionToken) {
        http_response_code(403);
        echo json_encode(['error' => 'Invalid CSRF token']);
        exit();
    }
}
```

### **3. Sanitization (очистка данных)**

```php
// Удаление опасных символов
function sanitizeInput($input) {
    // Удаляем HTML теги
    $input = strip_tags($input);
    
    // Экранируем специальные символы
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    
    // Удаляем лишние пробелы
    $input = trim($input);
    
    return $input;
}
```

---

## 📊 СРАВНЕНИЕ УРОВНЕЙ БЕЗОПАСНОСТИ

| Уровень | Методы | Безопасность | Сложность |
|---------|--------|--------------|-----------|
| **Базовый** | Пароль в JS, проверка на клиенте | ⚠️ Низкая | ⭐ Легко |
| **Средний** | Серверная авторизация, валидация | ✅ Средняя | ⭐⭐ Средне |
| **Высокий** | JWT токены, 2FA, Rate Limiting | ✅✅ Высокая | ⭐⭐⭐ Сложно |
| **Максимальный** | Все выше + IP whitelist + мониторинг | ✅✅✅ Очень высокая | ⭐⭐⭐⭐ Очень сложно |

---

## 🎯 РЕКОМЕНДАЦИИ ДЛЯ ВАШЕГО ПРОЕКТА

### **Текущее состояние:**
- ✅ Валидация данных в API (хорошо!)
- ✅ Базовая авторизация в wallet-admin.html
- ⚠️ Нет авторизации в super-admin.html
- ⚠️ Нет серверной проверки для админки

### **Что добавить:**

1. **Для super-admin.html:**
   - Добавить экран входа (как в wallet-admin.html)
   - Или серверную авторизацию через API

2. **Для API:**
   - Добавить Rate Limiting
   - Добавить логирование подозрительных запросов

3. **Общее:**
   - Использовать сильные пароли
   - Хранить пароли в env переменных (не в коде!)
   - Регулярно менять пароли

---

## 💡 ПРИМЕР УЛУЧШЕННОЙ ЗАЩИТЫ

```php
// api/admin-protected.php
<?php
session_start();

// 1. Проверка авторизации
if (!isset($_SESSION['admin_authenticated'])) {
    http_response_code(401);
    die(json_encode(['error' => 'Unauthorized']));
}

// 2. Проверка IP (опционально)
$allowedIPs = explode(',', getenv('ADMIN_ALLOWED_IPS') ?: '');
if (!empty($allowedIPs) && !in_array($_SERVER['REMOTE_ADDR'], $allowedIPs)) {
    http_response_code(403);
    die(json_encode(['error' => 'IP not allowed']));
}

// 3. Rate Limiting
$ip = $_SERVER['REMOTE_ADDR'];
$key = "admin_rate_limit:$ip";
$count = apcu_fetch($key) ?: 0;
if ($count > 50) {
    http_response_code(429);
    die(json_encode(['error' => 'Too many requests']));
}
apcu_store($key, $count + 1, 60);

// 4. Логирование
error_log("Admin access: " . $_SERVER['REMOTE_ADDR'] . " - " . $_SERVER['REQUEST_URI']);

// 5. Только теперь выполняем запрос
// ...
```

---

## ✅ ИТОГ

**Валидация API** = проверка всех данных перед использованием:
- ✅ Проверка наличия полей
- ✅ Проверка типов данных
- ✅ Проверка диапазонов значений
- ✅ Проверка форматов
- ✅ Проверка прав доступа

**Защита админки** = многослойная система:
- ✅ Серверная авторизация (не только клиентская!)
- ✅ Проверка IP адресов
- ✅ Rate Limiting
- ✅ Логирование доступа
- ✅ Регулярная смена паролей

Ваш проект уже имеет хорошую валидацию в API! 🎉



