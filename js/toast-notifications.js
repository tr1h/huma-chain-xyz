/**
 * 🍞 Toast Notifications System
 * @UI-UX: Красивые уведомления для ошибок и успехов
 */

(function() {
    'use strict';

    console.log('🍞 Toast Notifications System Initialized');

    // ==========================================
    // TOAST STYLES
    // ==========================================

    const style = document.createElement('style');
    style.id = 'toast-notification-styles';
    style.textContent = `
        /* 🍞 Toast Container */
        #toast-container {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
            max-width: 90%;
            width: 400px;
        }

        /* Toast Item */
        .toast {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
            font-size: 15px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideUp 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: all;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .toast.hide {
            animation: slideDown 0.3s ease-out forwards;
        }

        /* Toast Types */
        .toast.success {
            background: linear-gradient(135deg, #10b981, #059669);
            box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
        }

        .toast.error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4);
            animation: slideUp 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), shake 0.4s ease-in-out;
        }

        .toast.warning {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            box-shadow: 0 8px 30px rgba(245, 158, 11, 0.4);
        }

        .toast.info {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
        }

        /* Toast Icon */
        .toast-icon {
            font-size: 24px;
            line-height: 1;
            flex-shrink: 0;
        }

        /* Toast Content */
        .toast-content {
            flex: 1;
        }

        .toast-title {
            font-weight: 700;
            margin-bottom: 4px;
            font-size: 16px;
        }

        .toast-message {
            font-size: 14px;
            opacity: 0.95;
            line-height: 1.4;
        }

        /* Toast Close Button */
        .toast-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .toast-close:hover {
            opacity: 1;
        }

        /* Progress Bar */
        .toast-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(255,255,255,0.3);
            width: 100%;
            transform-origin: left;
        }

        .toast-progress.animate {
            animation: progressShrink var(--duration) linear forwards;
        }

        /* Animations */
        @keyframes slideUp {
            from {
                transform: translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes slideDown {
            to {
                transform: translateY(100px);
                opacity: 0;
            }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes progressShrink {
            from {
                transform: scaleX(1);
            }
            to {
                transform: scaleX(0);
            }
        }

        /* Mobile Adaptations */
        @media (max-width: 480px) {
            #toast-container {
                width: calc(100% - 20px);
                bottom: 10px;
            }

            .toast {
                padding: 14px 16px;
                font-size: 14px;
            }

            .toast-icon {
                font-size: 20px;
            }

            .toast-title {
                font-size: 15px;
            }

            .toast-message {
                font-size: 13px;
            }
        }

        /* Safe area для iPhone */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
            #toast-container {
                bottom: calc(20px + env(safe-area-inset-bottom));
            }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // TOAST CONTAINER
    // ==========================================

    let toastContainer;
    const MAX_TOASTS = 3; // Максимум 3 уведомления одновременно
    const toastCache = new Map(); // Кеш для предотвращения дубликатов

    function getToastContainer() {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        return toastContainer;
    }

    // ==========================================
    // CREATE TOAST
    // ==========================================

    function createToast(options) {
        const {
            type = 'info',
            title,
            message,
            duration = 2500, // Сокращено с 4000 до 2500мс
            icon,
            closable = true
        } = options;

        const container = getToastContainer();

        // 🚫 Проверка дубликатов: если такое сообщение уже показывается, игнорируем
        const cacheKey = `${type}-${title}-${message}`;
        const now = Date.now();
        if (toastCache.has(cacheKey)) {
            const lastShown = toastCache.get(cacheKey);
            if (now - lastShown < 3000) { // Не показываем дубликаты в течение 3 секунд
                console.log('🚫 Duplicate toast prevented:', message);
                return null;
            }
        }
        toastCache.set(cacheKey, now);

        // 🔢 Ограничение количества: удаляем старые уведомления
        const existingToasts = container.querySelectorAll('.toast:not(.hide)');
        if (existingToasts.length >= MAX_TOASTS) {
            // Удаляем самое старое уведомление
            removeToast(existingToasts[0]);
        }

        // Toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Icon
        const defaultIcons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const toastIcon = document.createElement('div');
        toastIcon.className = 'toast-icon';
        toastIcon.textContent = icon || defaultIcons[type] || '📢';

        // Content
        const content = document.createElement('div');
        content.className = 'toast-content';

        if (title) {
            const toastTitle = document.createElement('div');
            toastTitle.className = 'toast-title';
            toastTitle.textContent = title;
            content.appendChild(toastTitle);
        }

        if (message) {
            const toastMessage = document.createElement('div');
            toastMessage.className = 'toast-message';
            toastMessage.textContent = message;
            content.appendChild(toastMessage);
        }

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '✕';
        closeBtn.setAttribute('aria-label', 'Close notification');

        // Progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'toast-progress';
        progressBar.style.setProperty('--duration', `${duration}ms`);

        // Assemble
        toast.appendChild(toastIcon);
        toast.appendChild(content);
        if (closable) {
            toast.appendChild(closeBtn);
        }
        toast.appendChild(progressBar);

        // Add to container
        container.appendChild(toast);

        // Start progress animation
        setTimeout(() => {
            progressBar.classList.add('animate');
        }, 10);

        // Auto-remove
        const autoRemoveTimeout = setTimeout(() => {
            removeToast(toast);
        }, duration);

        // Close button handler
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(autoRemoveTimeout);
            removeToast(toast);
        });

        // Click to dismiss
        toast.addEventListener('click', () => {
            clearTimeout(autoRemoveTimeout);
            removeToast(toast);
        });

        // Haptic feedback
        if (window.triggerHaptic) {
            if (type === 'success') {
                triggerHaptic('success');
            } else if (type === 'error') {
                triggerHaptic('error');
            } else if (type === 'warning') {
                triggerHaptic('warning');
            }
        }

        // Custom event
        const event = new CustomEvent('toast-shown', { detail: { type, title, message } });
        window.dispatchEvent(event);

        return toast;
    }

    // ==========================================
    // REMOVE TOAST
    // ==========================================

    function removeToast(toast) {
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================

    window.toast = {
        // Generic
        show: (options) => createToast(options),

        // Shortcuts (укороченные длительности)
        success: (message, title = 'Success!') => createToast({
            type: 'success',
            title,
            message,
            duration: 2000 // Было 3000
        }),

        error: (message, title = 'Error!') => createToast({
            type: 'error',
            title,
            message,
            duration: 3000 // Было 5000
        }),

        warning: (message, title = 'Warning!') => createToast({
            type: 'warning',
            title,
            message,
            duration: 2500 // Было 4000
        }),

        info: (message, title) => createToast({
            type: 'info',
            title,
            message,
            duration: 2000 // Было 3000
        }),

        // Clear all toasts
        clearAll: () => {
            const container = getToastContainer();
            Array.from(container.children).forEach(removeToast);
        }
    };

    // ==========================================
    // REPLACE OLD showMessage FUNCTION
    // ==========================================

    // Сохранить старую функцию
    if (window.showMessage) {
        window._oldShowMessage = window.showMessage;
    }

    // Заменить на toast
    window.showMessage = function(message) {
        // Определить тип по содержимому
        if (message.includes('❌') || message.includes('Error') || message.includes('Not enough')) {
            toast.error(message.replace('❌', '').trim());
        } else if (message.includes('✅') || message.includes('Success')) {
            toast.success(message.replace('✅', '').trim());
        } else if (message.includes('⚠️') || message.includes('Warning')) {
            toast.warning(message.replace('⚠️', '').trim());
        } else {
            toast.info(message);
        }
    };

    console.log('✅ Toast system ready. Use: toast.success(), toast.error(), toast.warning(), toast.info()');

})();
