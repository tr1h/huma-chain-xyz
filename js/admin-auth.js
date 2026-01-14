/**
 * 🔐 ADMIN AUTHENTICATION MODULE
 *
 * Unified authentication system for all admin pages
 *
 * USAGE:
 * 1. Include in HTML: <script src="js/admin-auth.js"></script>
 * 2. Include password config: <script src="admin-password.js"></script>
 * 3. Add HTML markup for login screen (see below)
 *
 * HTML Markup for Login Screen:
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
 *   <!-- Your admin content here -->
 * </div>
 */

(function() {
    'use strict';

    // Configuration
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const MAX_FAILED_ATTEMPTS = 5;
    const LOCKOUT_TIME = 30 * 1000; // 30 seconds lockout

    // SHA-256 Function (Web Crypto API)
    async function sha256(str) {
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
        // Fallback
        console.warn('⚠️ Web Crypto API not available, hash comparison may not work');
        return Promise.resolve(null);
    }

    // Session Check
    function checkSession() {
        const auth = sessionStorage.getItem('admin_authenticated');
        const timestamp = sessionStorage.getItem('auth_timestamp');

        if (auth === 'true' && timestamp) {
            const elapsed = Date.now() - parseInt(timestamp);
            if (elapsed < SESSION_TIMEOUT) {
                // Session valid
                showContent();
                logAccess('session_resumed', { elapsed: Math.round(elapsed / 1000) + 's' });
                return true;
            } else {
                // Session expired
                sessionStorage.removeItem('admin_authenticated');
                sessionStorage.removeItem('auth_timestamp');
                logAccess('session_expired', {});
            }
        }
        return false;
    }

    // Show content, hide login
    function showContent() {
        const loginScreen = document.getElementById('adminLoginScreen');
        const content = document.getElementById('adminContent');

        if (loginScreen) loginScreen.style.display = 'none';
        if (content) content.style.display = 'block';
    }

    // Show login, hide content
    function showLogin() {
        const loginScreen = document.getElementById('adminLoginScreen');
        const content = document.getElementById('adminContent');

        if (loginScreen) loginScreen.style.display = 'block';
        if (content) content.style.display = 'none';
    }

    // Access Logging
    function logAccess(action, details) {
        const log = {
            timestamp: new Date().toISOString(),
            action: action,
            details: details,
            page: window.location.pathname,
            userAgent: navigator.userAgent.substring(0, 100)
        };

        // Save to localStorage
        const logs = JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
        logs.push(log);
        if (logs.length > 100) logs.shift(); // Keep last 100
        localStorage.setItem('admin_access_logs', JSON.stringify(logs));
    }

    // Password Check
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

        // ⚠️ SECURITY: Use ONLY password hash, NEVER plaintext!
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

        // Use secure verification if available
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
            // Success
            sessionStorage.setItem('admin_authenticated', 'true');
            sessionStorage.setItem('auth_timestamp', Date.now().toString());
            sessionStorage.removeItem('failed_attempts');

            showContent();
            input.value = '';
            if (errorDiv) errorDiv.textContent = '';

            logAccess('login_success', { page: window.location.pathname });
        } else {
            // Failed
            if (errorDiv) errorDiv.textContent = '❌ Invalid password!';
            input.value = '';
            input.focus();

            // Increment failed attempts
            const failedAttempts = parseInt(sessionStorage.getItem('failed_attempts') || '0') + 1;
            sessionStorage.setItem('failed_attempts', failedAttempts.toString());

            logAccess('login_failed', { attempts: failedAttempts });

            // Lockout
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

    // Initialization
    function init() {
        // Check session
        if (!checkSession()) {
            showLogin();

            const input = document.getElementById('adminPasswordInput');
            if (input) {
                input.focus();

                // Enter to login
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        checkPassword();
                    }
                });
            }
        }

        // Auto check every 5 mins
        setInterval(() => {
            if (!checkSession()) {
                showLogin();
            }
        }, 5 * 60 * 1000);
    }

    // Export API
    window.adminAuth = {
        checkPassword: checkPassword,
        checkSession: checkSession,
        logAccess: logAccess,
        showContent: showContent,
        showLogin: showLogin
    };

    // DOM Ready Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
