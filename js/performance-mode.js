/**
 * 🚀 Performance Mode для слабых устройств
 * @UI-UX: Автоматически отключает тяжёлые анимации на слабых телефонах
 */

(function() {
    'use strict';

    // Детекция типа устройства
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                          (navigator.deviceMemory && navigator.deviceMemory < 4);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Определяем нужен ли performance mode
    const needsPerformanceMode = isLowEndDevice || prefersReducedMotion;

    console.log('🎮 Performance Detection:', {
        isMobile,
        cores: navigator.hardwareConcurrency,
        memory: navigator.deviceMemory,
        prefersReducedMotion,
        performanceMode: needsPerformanceMode
    });

    // Активировать performance mode
    if (needsPerformanceMode) {
        document.body.classList.add('performance-mode');
        console.log('⚡ Performance Mode ENABLED');

        // Показать уведомление пользователю
        setTimeout(() => {
            showPerformanceNotification();
        }, 2000);
    }

    // Добавить CSS для performance mode
    const style = document.createElement('style');
    style.id = 'performance-mode-styles';
    style.textContent = `
        /* ⚡ Performance Mode Styles */
        .performance-mode .planet-1,
        .performance-mode .planet-2,
        .performance-mode .planet-3,
        .performance-mode .floating-heart {
            display: none !important;
        }

        .performance-mode .star {
            opacity: 0.2 !important;
            animation: none !important;
        }

        .performance-mode .particle-1,
        .performance-mode .particle-2,
        .performance-mode .particle-3,
        .performance-mode .particle-4,
        .performance-mode .particle-5,
        .performance-mode .particle-6,
        .performance-mode .particle-7 {
            display: none !important;
        }

        /* Сохранить только важные анимации */
        .performance-mode .pet-sprite {
            animation: none !important;
            transition: transform 0.1s ease;
        }

        .performance-mode .pet-sprite:hover {
            transform: scale(1.03); /* Лёгкий hover */
        }

        .performance-mode .pet-sprite:active {
            transform: scale(0.97);
        }

        /* Упростить UI анимации */
        .performance-mode .action-btn,
        .performance-mode .game-card {
            transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .performance-mode .stat-fill {
            transition: width 0.3s ease !important;
        }

        /* Отключить backdrop-filter (тяжёлый) */
        .performance-mode .game-container,
        .performance-mode .minigames-modal,
        .performance-mode .shop-modal {
            backdrop-filter: none !important;
            background: rgba(30, 27, 75, 0.95) !important;
        }

        /* Performance notification */
        .performance-notification {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            font-size: 14px;
            z-index: 10000;
            animation: slideUp 0.3s ease-out;
            max-width: 90%;
            text-align: center;
        }

        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }

        .performance-notification.hide {
            animation: slideDown 0.3s ease-out forwards;
        }

        @keyframes slideDown {
            to {
                transform: translateX(-50%) translateY(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Показать уведомление о performance mode
    function showPerformanceNotification() {
        const notification = document.createElement('div');
        notification.className = 'performance-notification';
        notification.innerHTML = `
            ⚡ Performance Mode Active
            <div style="font-size: 12px; margin-top: 4px; opacity: 0.9;">
                Animations optimized for your device
            </div>
        `;
        document.body.appendChild(notification);

        // Удалить через 4 секунды
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Добавить toggle для пользователя (опционально)
    function createPerformanceToggle() {
        // Только для debugging
        if (window.location.search.includes('debug=1')) {
            const toggle = document.createElement('button');
            toggle.textContent = '⚡ Performance';
            toggle.style.cssText = `
                position: fixed;
                top: 70px;
                left: 15px;
                z-index: 10001;
                padding: 8px 12px;
                background: rgba(59, 130, 246, 0.9);
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                color: white;
                font-size: 12px;
                cursor: pointer;
            `;
            toggle.addEventListener('click', () => {
                document.body.classList.toggle('performance-mode');
                const isActive = document.body.classList.contains('performance-mode');
                toggle.textContent = isActive ? '⚡ Performance ON' : '⚡ Performance OFF';
            });
            document.body.appendChild(toggle);
        }
    }

    // Мониторинг FPS (опционально)
    function monitorFPS() {
        if (!window.location.search.includes('debug=1')) return;

        let lastTime = performance.now();
        let frames = 0;
        let fps = 60;

        function checkFPS() {
            const currentTime = performance.now();
            frames++;

            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;

                // Если FPS падает ниже 30 - включить performance mode
                if (fps < 30 && !document.body.classList.contains('performance-mode')) {
                    console.warn(`⚠️ Low FPS detected: ${fps}. Enabling Performance Mode.`);
                    document.body.classList.add('performance-mode');
                    showPerformanceNotification();
                }

                // Debug info
                if (window.location.search.includes('debug=1')) {
                    console.log(`FPS: ${fps}`);
                }
            }

            requestAnimationFrame(checkFPS);
        }

        requestAnimationFrame(checkFPS);
    }

    // Init
    document.addEventListener('DOMContentLoaded', () => {
        createPerformanceToggle();
        monitorFPS();
    });

    // Export для использования в других скриптах
    window.PerformanceMode = {
        isActive: () => document.body.classList.contains('performance-mode'),
        enable: () => document.body.classList.add('performance-mode'),
        disable: () => document.body.classList.remove('performance-mode'),
        toggle: () => document.body.classList.toggle('performance-mode')
    };

})();
