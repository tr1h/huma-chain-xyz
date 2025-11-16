/**
 * 🔐 ADMIN AUTHENTICATION MODULE
 * 
 * Единая система авторизации для всех админских страниц
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * 1. Подключи в HTML: <script src="js/admin-auth.js"></script>
 * 2. Подключи файл с паролем: <script src="admin-password.js"></script>
 * 3. Добавь HTML разметку для экрана входа (см. ниже)
 * 
 * HTML разметка для экрана входа:
 * 
 * <div id="adminLoginScreen" style="...">
 *   <div class="login-container">
 *     <h2>🔐 Admin Access</h2>
 *     <input type="password" id="adminPasswordInput" placeholder="Enter password">
 *     <button onclick="adminAuth.checkPassword()">Login</button>
 *     <div id="adminLoginError" style="color: red; margin-top: 10px;"></div>
 *   </div>
 * </div>
 * 
 * <div id="adminContent" style="display: none;">
 *   <!-- Твой контент админки здесь -->
 * </div>
 */

(function() {
    'use strict';

    // Конфигурация
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 минут
    const MAX_FAILED_ATTEMPTS = 5;
    const LOCKOUT_TIME = 30 * 1000; // 30 секунд блокировки

    // SHA-256 функция (если используется хеш пароля)
    async function sha256(str) {
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            // Используем Web Crypto API
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
        // Fallback: если Web Crypto API недоступен
        console.warn('⚠️ Web Crypto API not available, hash comparison may not work');
        return Promise.resolve(null);
    }

    // Проверка сессии
    function checkSession() {
        const auth = sessionStorage.getItem('admin_authenticated');
        const timestamp = sessionStorage.getItem('auth_timestamp');
        
        if (auth === 'true' && timestamp) {
            const elapsed = Date.now() - parseInt(timestamp);
            if (elapsed < SESSION_TIMEOUT) {
                // Сессия валидна
                showContent();
                logAccess('session_resumed', { elapsed: Math.round(elapsed / 1000) + 's' });
                return true;
            } else {
                // Сессия истекла
                sessionStorage.removeItem('admin_authenticated');
                sessionStorage.removeItem('auth_timestamp');
                logAccess('session_expired', {});
            }
        }
        return false;
    }

    // Показать контент, скрыть экран входа
    function showContent() {
        const loginScreen = document.getElementById('adminLoginScreen');
        const content = document.getElementById('adminContent');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (content) content.style.display = 'block';
    }

    // Показать экран входа, скрыть контент
    function showLogin() {
        const loginScreen = document.getElementById('adminLoginScreen');
        const content = document.getElementById('adminContent');
        
        if (loginScreen) loginScreen.style.display = 'block';
        if (content) content.style.display = 'none';
    }

    // Логирование доступа
    function logAccess(action, details) {
        const log = {
            timestamp: new Date().toISOString(),
            action: action,
            details: details,
            page: window.location.pathname,
            userAgent: navigator.userAgent.substring(0, 100)
        };
        
        // Сохранить в localStorage для просмотра
        const logs = JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
        logs.push(log);
        if (logs.length > 100) logs.shift(); // Хранить только последние 100 записей
        localStorage.setItem('admin_access_logs', JSON.stringify(logs));
        
        console.log('🔐 Admin Auth:', action, details);
    }

    // Проверка пароля
    async function checkPassword() {
        const input = document.getElementById('adminPasswordInput');
        const errorDiv = document.getElementById('adminLoginError');
        
        if (!input) {
            console.error('❌ adminPasswordInput not found!');
            return;
        }
        
        const password = input.value;
        
        if (!password) {
            if (errorDiv) errorDiv.textContent = 'Please enter password';
            return;
        }
        
        // ⚠️ БЕЗОПАСНОСТЬ: Используем только хеш пароля, НЕ открытый пароль!
        // Получить хеш пароля из конфигурации (множественные источники)
        const adminPasswordHash = (typeof ADMIN_PASSWORD_HASH !== 'undefined' ? ADMIN_PASSWORD_HASH : null) || 
                                  (typeof window.ADMIN_PASSWORD_HASH !== 'undefined' ? window.ADMIN_PASSWORD_HASH : null) ||
                                  (document.querySelector('meta[name="admin-password-hash"]')?.content) ||
                                  null;
        
        // Для локальной разработки: можно использовать открытый пароль из admin-password.js
        // НО НЕ ИЗ META-ТЕГА! (meta-тег виден всем в исходниках HTML)
        const adminPassword = (typeof ADMIN_PASSWORD !== 'undefined' ? ADMIN_PASSWORD : null) || 
                             (typeof window.ADMIN_PASSWORD !== 'undefined' ? window.ADMIN_PASSWORD : null) ||
                             null; // ⚠️ НЕ читаем из meta-тега!
        
        if (!adminPassword && !adminPasswordHash) {
            if (errorDiv) {
                errorDiv.textContent = 'Error: Password not configured!';
                errorDiv.innerHTML += '<br><small style="color: #666;">For local dev: Create admin-password.js<br>For production: Add &lt;meta name="admin-password-hash" content="SHA256_HASH"&gt; in &lt;head&gt;</small>';
            }
            return;
        }
        
        let isValid = false;
        
        // Проверка пароля
        if (adminPasswordHash && adminPasswordHash !== '') {
            // Использовать хеш (безопаснее)
            try {
                const hash = await sha256(password);
                isValid = hash === adminPasswordHash;
            } catch (e) {
                console.error('Hash comparison error:', e);
                isValid = false;
            }
        } else if (adminPassword) {
            // Прямое сравнение (только для локальной разработки из admin-password.js)
            isValid = password === adminPassword;
        }
        
        if (isValid) {
            // Успешный вход
            sessionStorage.setItem('admin_authenticated', 'true');
            sessionStorage.setItem('auth_timestamp', Date.now().toString());
            sessionStorage.removeItem('failed_attempts'); // Сброс счетчика
            
            showContent();
            input.value = '';
            if (errorDiv) errorDiv.textContent = '';
            
            logAccess('login_success', { page: window.location.pathname });
        } else {
            // Неудачная попытка
            if (errorDiv) errorDiv.textContent = '❌ Invalid password!';
            input.value = '';
            input.focus();
            
            // Увеличить счетчик неудачных попыток
            const failedAttempts = parseInt(sessionStorage.getItem('failed_attempts') || '0') + 1;
            sessionStorage.setItem('failed_attempts', failedAttempts.toString());
            
            logAccess('login_failed', { attempts: failedAttempts });
            
            // Блокировка после MAX_FAILED_ATTEMPTS попыток
            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                if (errorDiv) {
                    errorDiv.textContent = `❌ Too many failed attempts! Page will reload in ${LOCKOUT_TIME / 1000} seconds.`;
                }
                input.disabled = true;
                
                setTimeout(() => {
                    sessionStorage.removeItem('failed_attempts');
                    window.location.reload();
                }, LOCKOUT_TIME);
            }
        }
    }

    // Инициализация при загрузке страницы
    function init() {
        // Проверить существующую сессию
        if (!checkSession()) {
            showLogin();
            
            // Фокус на поле ввода
            const input = document.getElementById('adminPasswordInput');
            if (input) {
                input.focus();
                
                // Enter для входа
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        checkPassword();
                    }
                });
            }
        }
        
        // Автоматическая проверка сессии каждые 5 минут
        setInterval(() => {
            if (!checkSession()) {
                showLogin();
            }
        }, 5 * 60 * 1000);
    }

    // Экспорт API
    window.adminAuth = {
        checkPassword: checkPassword,
        checkSession: checkSession,
        logAccess: logAccess,
        showContent: showContent,
        showLogin: showLogin
    };

    // Инициализация при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

