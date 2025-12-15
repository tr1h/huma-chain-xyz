/**
 * рџ”ђ ADMIN AUTHENTICATION MODULE
 * 
 * Р•РґРёРЅР°СЏ СЃРёСЃС‚РµРјР° Р°РІС‚РѕСЂРёР·Р°С†РёРё РґР»СЏ РІСЃРµС… Р°РґРјРёРЅСЃРєРёС… СЃС‚СЂР°РЅРёС†
 * 
 * РРЎРџРћР›Р¬Р—РћР’РђРќРР•:
 * 1. РџРѕРґРєР»СЋС‡Рё РІ HTML: <script src="js/admin-auth.js"></script>
 * 2. РџРѕРґРєР»СЋС‡Рё С„Р°Р№Р» СЃ РїР°СЂРѕР»РµРј: <script src="admin-password.js"></script>
 * 3. Р”РѕР±Р°РІСЊ HTML СЂР°Р·РјРµС‚РєСѓ РґР»СЏ СЌРєСЂР°РЅР° РІС…РѕРґР° (СЃРј. РЅРёР¶Рµ)
 * 
 * HTML СЂР°Р·РјРµС‚РєР° РґР»СЏ СЌРєСЂР°РЅР° РІС…РѕРґР°:
 * 
 * <div id="adminLoginScreen" style="...">
 *   <div class="login-container">
 *     <h2>рџ”ђ Admin Access</h2>
 *     <input type="password" id="adminPasswordInput" placeholder="Enter password">
 *     <button onclick="adminAuth.checkPassword()">Login</button>
 *     <div id="adminLoginError" style="color: red; margin-top: 10px;"></div>
 *   </div>
 * </div>
 * 
 * <div id="adminContent" style="display: none;">
 *   <!-- РўРІРѕР№ РєРѕРЅС‚РµРЅС‚ Р°РґРјРёРЅРєРё Р·РґРµСЃСЊ -->
 * </div>
 */

(function() {
    'use strict';

    // РљРѕРЅС„РёРіСѓСЂР°С†РёСЏ
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 РјРёРЅСѓС‚
    const MAX_FAILED_ATTEMPTS = 5;
    const LOCKOUT_TIME = 30 * 1000; // 30 СЃРµРєСѓРЅРґ Р±Р»РѕРєРёСЂРѕРІРєРё

    // SHA-256 С„СѓРЅРєС†РёСЏ (РµСЃР»Рё РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ С…РµС€ РїР°СЂРѕР»СЏ)
    async function sha256(str) {
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            // РСЃРїРѕР»СЊР·СѓРµРј Web Crypto API
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
        // Fallback: РµСЃР»Рё Web Crypto API РЅРµРґРѕСЃС‚СѓРїРµРЅ
        console.warn('вљ пёЏ Web Crypto API not available, hash comparison may not work');
        return Promise.resolve(null);
    }

    // РџСЂРѕРІРµСЂРєР° СЃРµСЃСЃРёРё
    function checkSession() {
        const auth = sessionStorage.getItem('admin_authenticated');
        const timestamp = sessionStorage.getItem('auth_timestamp');
        
        if (auth === 'true' && timestamp) {
            const elapsed = Date.now() - parseInt(timestamp);
            if (elapsed < SESSION_TIMEOUT) {
                // РЎРµСЃСЃРёСЏ РІР°Р»РёРґРЅР°
                showContent();
                logAccess('session_resumed', { elapsed: Math.round(elapsed / 1000) + 's' });
                return true;
            } else {
                // РЎРµСЃСЃРёСЏ РёСЃС‚РµРєР»Р°
                sessionStorage.removeItem('admin_authenticated');
                sessionStorage.removeItem('auth_timestamp');
                logAccess('session_expired', {});
            }
        }
        return false;
    }

    // РџРѕРєР°Р·Р°С‚СЊ РєРѕРЅС‚РµРЅС‚, СЃРєСЂС‹С‚СЊ СЌРєСЂР°РЅ РІС…РѕРґР°
    function showContent() {
        const loginScreen = document.getElementById('adminLoginScreen');
        const content = document.getElementById('adminContent');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (content) content.style.display = 'block';
    }

    // РџРѕРєР°Р·Р°С‚СЊ СЌРєСЂР°РЅ РІС…РѕРґР°, СЃРєСЂС‹С‚СЊ РєРѕРЅС‚РµРЅС‚
    function showLogin() {
        const loginScreen = document.getElementById('adminLoginScreen');
        const content = document.getElementById('adminContent');
        
        if (loginScreen) loginScreen.style.display = 'block';
        if (content) content.style.display = 'none';
    }

    // Р›РѕРіРёСЂРѕРІР°РЅРёРµ РґРѕСЃС‚СѓРїР°
    function logAccess(action, details) {
        const log = {
            timestamp: new Date().toISOString(),
            action: action,
            details: details,
            page: window.location.pathname,
            userAgent: navigator.userAgent.substring(0, 100)
        };
        
        // РЎРѕС…СЂР°РЅРёС‚СЊ РІ localStorage РґР»СЏ РїСЂРѕСЃРјРѕС‚СЂР°
        const logs = JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
        logs.push(log);
        if (logs.length > 100) logs.shift(); // РҐСЂР°РЅРёС‚СЊ С‚РѕР»СЊРєРѕ РїРѕСЃР»РµРґРЅРёРµ 100 Р·Р°РїРёСЃРµР№
        localStorage.setItem('admin_access_logs', JSON.stringify(logs));
        
        // [cleaned]
    }

    // РџСЂРѕРІРµСЂРєР° РїР°СЂРѕР»СЏ
    async function checkPassword() {
        const input = document.getElementById('adminPasswordInput');
        const errorDiv = document.getElementById('adminLoginError');
        
        if (!input) {
            console.error('вќЊ adminPasswordInput not found!');
            return;
        }
        
        const password = input.value;
        
        if (!password) {
            if (errorDiv) errorDiv.textContent = 'Please enter password';
            return;
        }
        
        // вљ пёЏ SECURITY: Use ONLY password hash, NEVER plaintext!
        // Get password hash from configuration (multiple sources)
        const adminPasswordHash = window.ADMIN_PASSWORD_HASH || 
                                  (document.querySelector('meta[name="admin-password-hash"]')?.content) ||
                                  null;
        
        if (!adminPasswordHash) {
            if (errorDiv) {
                errorDiv.textContent = 'Error: Password not configured!';
                errorDiv.innerHTML += '<br><small style="color: #666;">Add admin-password.js or set meta tag with hash</small>';
            }
            logAccess('config_error', { error: 'No password hash configured' });
            return;
        }
        
        let isValid = false;
        
        // Use secure verification function if available
        if (typeof window.verifyAdminPassword === 'function') {
            try {
                isValid = await window.verifyAdminPassword(password);
            } catch (e) {
                console.error('Password verification error');
                isValid = false;
            }
        } else {
            // Fallback: manual hash comparison
            try {
                const hash = await sha256(password);
                isValid = hash === adminPasswordHash;
            } catch (e) {
                console.error('Hash comparison error');
                isValid = false;
            }
        }
        
        if (isValid) {
            // РЈСЃРїРµС€РЅС‹Р№ РІС…РѕРґ
            sessionStorage.setItem('admin_authenticated', 'true');
            sessionStorage.setItem('auth_timestamp', Date.now().toString());
            sessionStorage.removeItem('failed_attempts'); // РЎР±СЂРѕСЃ СЃС‡РµС‚С‡РёРєР°
            
            showContent();
            input.value = '';
            if (errorDiv) errorDiv.textContent = '';
            
            logAccess('login_success', { page: window.location.pathname });
        } else {
            // РќРµСѓРґР°С‡РЅР°СЏ РїРѕРїС‹С‚РєР°
            if (errorDiv) errorDiv.textContent = 'вќЊ Invalid password!';
            input.value = '';
            input.focus();
            
            // РЈРІРµР»РёС‡РёС‚СЊ СЃС‡РµС‚С‡РёРє РЅРµСѓРґР°С‡РЅС‹С… РїРѕРїС‹С‚РѕРє
            const failedAttempts = parseInt(sessionStorage.getItem('failed_attempts') || '0') + 1;
            sessionStorage.setItem('failed_attempts', failedAttempts.toString());
            
            logAccess('login_failed', { attempts: failedAttempts });
            
            // Р‘Р»РѕРєРёСЂРѕРІРєР° РїРѕСЃР»Рµ MAX_FAILED_ATTEMPTS РїРѕРїС‹С‚РѕРє
            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                if (errorDiv) {
                    errorDiv.textContent = `вќЊ Too many failed attempts! Page will reload in ${LOCKOUT_TIME / 1000} seconds.`;
                }
                input.disabled = true;
                
                setTimeout(() => {
                    sessionStorage.removeItem('failed_attempts');
                    window.location.reload();
                }, LOCKOUT_TIME);
            }
        }
    }

    // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїСЂРё Р·Р°РіСЂСѓР·РєРµ СЃС‚СЂР°РЅРёС†С‹
    function init() {
        // РџСЂРѕРІРµСЂРёС‚СЊ СЃСѓС‰РµСЃС‚РІСѓСЋС‰СѓСЋ СЃРµСЃСЃРёСЋ
        if (!checkSession()) {
            showLogin();
            
            // Р¤РѕРєСѓСЃ РЅР° РїРѕР»Рµ РІРІРѕРґР°
            const input = document.getElementById('adminPasswordInput');
            if (input) {
                input.focus();
                
                // Enter РґР»СЏ РІС…РѕРґР°
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        checkPassword();
                    }
                });
            }
        }
        
        // РђРІС‚РѕРјР°С‚РёС‡РµСЃРєР°СЏ РїСЂРѕРІРµСЂРєР° СЃРµСЃСЃРёРё РєР°Р¶РґС‹Рµ 5 РјРёРЅСѓС‚
        setInterval(() => {
            if (!checkSession()) {
                showLogin();
            }
        }, 5 * 60 * 1000);
    }

    // Р­РєСЃРїРѕСЂС‚ API
    window.adminAuth = {
        checkPassword: checkPassword,
        checkSession: checkSession,
        logAccess: logAccess,
        showContent: showContent,
        showLogin: showLogin
    };

    // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїСЂРё Р·Р°РіСЂСѓР·РєРµ DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


