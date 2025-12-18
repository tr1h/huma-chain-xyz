/**
 * 📱 Telegram Mini App Enhanced Features
 * @UI-UX: Оптимизации для Telegram WebApp
 */

(function() {
    'use strict';

    // Проверка что мы в Telegram
    if (!window.Telegram || !window.Telegram.WebApp) {
        console.log('ℹ️ Not running in Telegram WebApp');
        return;
    }

    const tg = window.Telegram.WebApp;
    console.log('📱 Telegram Mini App Enhanced Mode');

    // ==========================================
    // 1. TELEGRAM SETUP
    // ==========================================

    function initTelegram() {
        // Ready
        tg.ready();

        // Expand to full height
        tg.expand();

        // Disable vertical swipes (чтобы не закрывался случайно)
        if (tg.disableVerticalSwipes) {
            tg.disableVerticalSwipes();
        }

        // Enable closing confirmation
        tg.enableClosingConfirmation();

        // Set theme colors
        tg.setHeaderColor('#667eea');
        tg.setBackgroundColor('#667eea');

        console.log('✅ Telegram WebApp initialized');
    }

    // ==========================================
    // 2. HAPTIC FEEDBACK
    // ==========================================

    function initHapticFeedback() {
        const haptic = tg.HapticFeedback;

        // Helper функция
        window.triggerHaptic = function(type = 'medium') {
            if (haptic) {
                switch(type) {
                    case 'light':
                        haptic.impactOccurred('light');
                        break;
                    case 'medium':
                        haptic.impactOccurred('medium');
                        break;
                    case 'heavy':
                        haptic.impactOccurred('heavy');
                        break;
                    case 'success':
                        haptic.notificationOccurred('success');
                        break;
                    case 'error':
                        haptic.notificationOccurred('error');
                        break;
                    case 'warning':
                        haptic.notificationOccurred('warning');
                        break;
                    case 'selection':
                        haptic.selectionChanged();
                        break;
                }
            }
        };

        // Добавить haptic на кнопки
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, .action-btn, .game-card, .skin-card-shop');
            if (target) {
                triggerHaptic('light');
            }
        }, true);

        // Haptic на pet click
        const petSprite = document.getElementById('pet-sprite');
        if (petSprite) {
            petSprite.addEventListener('click', () => {
                triggerHaptic('medium');
            });
        }

        // Haptic на success/error
        window.addEventListener('game-success', () => triggerHaptic('success'));
        window.addEventListener('game-error', () => triggerHaptic('error'));

        console.log('✅ Haptic feedback initialized');
    }

    // ==========================================
    // 3. SAFE AREA INSETS (для iPhone с выемкой)
    // ==========================================

    function applySafeAreaInsets() {
        const style = document.createElement('style');
        style.id = 'telegram-safe-area-styles';
        style.textContent = `
            /* 📱 Safe Area Insets для iPhone */
            body.telegram-webapp {
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
            }

            /* Прячем элементы которые не нужны в Telegram */
            body.telegram-webapp .game-logo {
                display: none !important;
            }

            /* Убрать scrollbar */
            body.telegram-webapp {
                overflow: hidden;
                -webkit-overflow-scrolling: touch;
            }

            /* Fixed elements учитывают safe area */
            body.telegram-webapp .combo-counter {
                top: calc(20px + env(safe-area-inset-top));
            }

            body.telegram-webapp .save-notification {
                bottom: calc(20px + env(safe-area-inset-bottom));
            }
        `;
        document.head.appendChild(style);

        document.body.classList.add('telegram-webapp');

        console.log('✅ Safe area insets applied');
    }

    // ==========================================
    // 4. BACK BUTTON
    // ==========================================

    function initBackButton() {
        // Показывать back button в модалах
        const modals = [
            document.getElementById('minigames-modal'),
            document.getElementById('shop-modal'),
            document.getElementById('nft-modal')
        ];

        modals.forEach(modal => {
            if (!modal) return;

            const observer = new MutationObserver(() => {
                if (modal.style.display !== 'none' && modal.style.display !== '') {
                    // Modal открыт - показать back button
                    tg.BackButton.show();
                    tg.BackButton.onClick(() => {
                        modal.style.display = 'none';
                        tg.BackButton.hide();
                    });
                } else {
                    // Modal закрыт - скрыть back button
                    tg.BackButton.hide();
                }
            });

            observer.observe(modal, {
                attributes: true,
                attributeFilter: ['style']
            });
        });

        console.log('✅ Back button initialized');
    }

    // ==========================================
    // 5. MAIN BUTTON (опционально)
    // ==========================================

    function initMainButton() {
        // Можно использовать MainButton для важных действий
        // Например "Save Game" или "Mint NFT"
        
        // Пример:
        // tg.MainButton.setText('SAVE GAME');
        // tg.MainButton.show();
        // tg.MainButton.onClick(() => {
        //     // Save game action
        //     triggerHaptic('success');
        // });

        console.log('✅ Main button available');
    }

    // ==========================================
    // 6. THEME SYNC
    // ==========================================

    function syncTheme() {
        const themeParams = tg.themeParams;
        
        if (themeParams) {
            // Синхронизировать цвета с Telegram темой
            const style = document.createElement('style');
            style.textContent = `
                :root {
                    --tg-bg-color: ${themeParams.bg_color || '#667eea'};
                    --tg-text-color: ${themeParams.text_color || '#ffffff'};
                    --tg-hint-color: ${themeParams.hint_color || 'rgba(255,255,255,0.7)'};
                    --tg-button-color: ${themeParams.button_color || '#8b5cf6'};
                    --tg-button-text-color: ${themeParams.button_text_color || '#ffffff'};
                }

                /* Применить Telegram тему (опционально) */
                /* body.telegram-webapp {
                    background: var(--tg-bg-color);
                    color: var(--tg-text-color);
                } */
            `;
            document.head.appendChild(style);

            console.log('✅ Theme synced with Telegram');
        }
    }

    // ==========================================
    // 7. VIEWPORT LOCK
    // ==========================================

    function lockViewport() {
        // Запретить zoom на iOS
        document.addEventListener('touchmove', (e) => {
            if (e.scale !== 1) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });

        console.log('✅ Viewport locked');
    }

    // ==========================================
    // 8. CLOUD STORAGE (для синхронизации)
    // ==========================================

    function initCloudStorage() {
        const cloudStorage = tg.CloudStorage;

        if (cloudStorage) {
            // Helper functions
            window.TelegramCloud = {
                save: (key, value) => {
                    return new Promise((resolve, reject) => {
                        cloudStorage.setItem(key, JSON.stringify(value), (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        });
                    });
                },
                load: (key) => {
                    return new Promise((resolve, reject) => {
                        cloudStorage.getItem(key, (error, value) => {
                            if (error) reject(error);
                            else resolve(value ? JSON.parse(value) : null);
                        });
                    });
                },
                remove: (key) => {
                    return new Promise((resolve, reject) => {
                        cloudStorage.removeItem(key, (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        });
                    });
                }
            };

            console.log('✅ Cloud storage available');
        }
    }

    // ==========================================
    // 9. TELEGRAM EVENTS
    // ==========================================

    function initTelegramEvents() {
        // Viewport changed
        tg.onEvent('viewportChanged', () => {
            console.log('📱 Viewport changed:', {
                height: tg.viewportHeight,
                stableHeight: tg.viewportStableHeight,
                isExpanded: tg.isExpanded
            });
        });

        // Theme changed
        tg.onEvent('themeChanged', () => {
            console.log('🎨 Theme changed');
            syncTheme();
        });

        console.log('✅ Telegram events initialized');
    }

    // ==========================================
    // 10. PERFORMANCE OPTIMIZATION
    // ==========================================

    function optimizeForTelegram() {
        // Отключить некоторые тяжелые эффекты в Telegram
        document.body.classList.add('telegram-optimized');

        const style = document.createElement('style');
        style.textContent = `
            /* Оптимизации для Telegram */
            .telegram-optimized .planet-1,
            .telegram-optimized .planet-2,
            .telegram-optimized .planet-3 {
                opacity: 0.15 !important;
            }

            .telegram-optimized .floating-heart {
                display: none !important;
            }

            /* Упростить backdrop-filter */
            .telegram-optimized .game-container {
                backdrop-filter: blur(5px) !important;
            }
        `;
        document.head.appendChild(style);

        console.log('✅ Telegram optimizations applied');
    }

    // ==========================================
    // INIT ALL
    // ==========================================

    function init() {
        try {
            initTelegram();
            initHapticFeedback();
            applySafeAreaInsets();
            initBackButton();
            initMainButton();
            syncTheme();
            lockViewport();
            initCloudStorage();
            initTelegramEvents();
            optimizeForTelegram();

            console.log('✅ Telegram Mini App Enhanced features initialized');

            // Уведомить пользователя
            setTimeout(() => {
                if (window.triggerHaptic) {
                    triggerHaptic('success');
                }
            }, 500);

        } catch (error) {
            console.error('❌ Telegram initialization error:', error);
        }
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export для использования
    window.TelegramEnhanced = {
        haptic: window.triggerHaptic,
        cloud: window.TelegramCloud,
        tg: tg
    };

})();
