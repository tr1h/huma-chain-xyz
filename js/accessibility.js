/**
 * ♿ Accessibility Features
 * @UI-UX: Улучшает доступность для людей с ограниченными возможностями
 */

(function() {
    'use strict';

    console.log('♿ Initializing Accessibility Features...');

    // ==========================================
    // 1. KEYBOARD NAVIGATION
    // ==========================================

    function initKeyboardNavigation() {
        // Добавить tabindex для всех интерактивных элементов
        document.querySelectorAll('.action-btn, .game-card, .skin-card-shop, .nav-button').forEach((el, index) => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });

        // Enter/Space для активации
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const focused = document.activeElement;
                
                // Клик на focused элементе
                if (focused && (
                    focused.classList.contains('action-btn') ||
                    focused.classList.contains('game-card') ||
                    focused.classList.contains('skin-card-shop') ||
                    focused.classList.contains('nav-button')
                )) {
                    e.preventDefault();
                    focused.click();
                }
            }

            // Escape для закрытия модалов
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.minigames-modal, .shop-modal, .nft-modal');
                modals.forEach(modal => {
                    if (modal.style.display !== 'none') {
                        modal.style.display = 'none';
                    }
                });
            }
        });

        console.log('✅ Keyboard navigation initialized');
    }

    // ==========================================
    // 2. ARIA LABELS
    // ==========================================

    function addAriaLabels() {
        // Action buttons
        const feedBtn = document.getElementById('feed-btn');
        if (feedBtn) {
            feedBtn.setAttribute('aria-label', 'Feed your pet to restore hunger. Cost: 5 TAMA');
            feedBtn.setAttribute('aria-describedby', 'hunger-stat');
        }

        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.setAttribute('aria-label', 'Play with your pet to restore happiness. Cost: 5 TAMA');
            playBtn.setAttribute('aria-describedby', 'happy-stat');
        }

        const healBtn = document.getElementById('heal-btn');
        if (healBtn) {
            healBtn.setAttribute('aria-label', 'Heal your pet to restore HP. Cost: 10 TAMA');
            healBtn.setAttribute('aria-describedby', 'hp-stat');
        }

        // Stats
        const hpStat = document.getElementById('hp-stat');
        if (hpStat) {
            hpStat.setAttribute('role', 'progressbar');
            hpStat.setAttribute('aria-label', 'Pet Health Points');
        }

        const hungerStat = document.getElementById('hunger-stat');
        if (hungerStat) {
            hungerStat.setAttribute('role', 'progressbar');
            hungerStat.setAttribute('aria-label', 'Pet Hunger Level');
        }

        const happyStat = document.getElementById('happy-stat');
        if (happyStat) {
            happyStat.setAttribute('role', 'progressbar');
            happyStat.setAttribute('aria-label', 'Pet Happiness Level');
        }

        // Message container
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            messageContainer.setAttribute('role', 'status');
            messageContainer.setAttribute('aria-live', 'polite');
            messageContainer.setAttribute('aria-atomic', 'true');
        }

        // Pet sprite
        const petSprite = document.getElementById('pet-sprite');
        if (petSprite) {
            petSprite.setAttribute('role', 'button');
            petSprite.setAttribute('aria-label', 'Click your pet to earn TAMA and XP');
            petSprite.setAttribute('tabindex', '0');
        }

        // Game cards
        document.querySelectorAll('.game-card').forEach(card => {
            const gameName = card.querySelector('.game-card-name')?.textContent || 'Mini Game';
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Play ${gameName}`);
        });

        console.log('✅ ARIA labels added');
    }

    // ==========================================
    // 3. FOCUS INDICATORS
    // ==========================================

    function addFocusStyles() {
        const style = document.createElement('style');
        style.id = 'accessibility-focus-styles';
        style.textContent = `
            /* ♿ Focus Indicators */
            *:focus {
                outline: 3px solid #fbbf24 !important;
                outline-offset: 2px !important;
            }

            /* Улучшенный focus для кнопок */
            .action-btn:focus,
            .game-card:focus,
            .skin-card-shop:focus,
            .nav-button:focus {
                outline: 3px solid #fbbf24 !important;
                outline-offset: 4px !important;
                box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.2);
            }

            /* Focus для pet */
            #pet-sprite:focus {
                outline: 3px solid #fbbf24 !important;
                outline-offset: 8px !important;
                filter: brightness(1.1);
            }

            /* Убрать outline для mouse users */
            *:focus:not(:focus-visible) {
                outline: none !important;
            }

            *:focus-visible {
                outline: 3px solid #fbbf24 !important;
                outline-offset: 2px !important;
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .action-btn,
                .game-card {
                    border: 2px solid white !important;
                }

                .stat-text {
                    color: #fff !important;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.9) !important;
                }
            }

            /* Screen reader only class */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Focus styles added');
    }

    // ==========================================
    // 4. LIVE REGIONS
    // ==========================================

    function updateAriaLiveRegions() {
        // Обновлять aria-valuenow для progressbar'ов
        const observer = new MutationObserver(() => {
            const hpStat = document.getElementById('hp-stat');
            const hungerStat = document.getElementById('hunger-stat');
            const happyStat = document.getElementById('happy-stat');

            if (hpStat) {
                const hpValue = parseInt(hpStat.querySelector('.stat-value')?.textContent) || 0;
                hpStat.setAttribute('aria-valuenow', hpValue);
                hpStat.setAttribute('aria-valuemin', '0');
                hpStat.setAttribute('aria-valuemax', '100');
            }

            if (hungerStat) {
                const hungerValue = parseInt(hungerStat.querySelector('.stat-value')?.textContent) || 0;
                hungerStat.setAttribute('aria-valuenow', hungerValue);
                hungerStat.setAttribute('aria-valuemin', '0');
                hungerStat.setAttribute('aria-valuemax', '100');
            }

            if (happyStat) {
                const happyValue = parseInt(happyStat.querySelector('.stat-value')?.textContent) || 0;
                happyStat.setAttribute('aria-valuenow', happyValue);
                happyStat.setAttribute('aria-valuemin', '0');
                happyStat.setAttribute('aria-valuemax', '100');
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true
        });

        console.log('✅ Live regions observer started');
    }

    // ==========================================
    // 5. SCREEN READER ANNOUNCEMENTS
    // ==========================================

    function createAnnouncementRegion() {
        const announcer = document.createElement('div');
        announcer.id = 'accessibility-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);

        // Global функция для announcements
        window.announceToScreenReader = function(message) {
            const announcer = document.getElementById('accessibility-announcer');
            if (announcer) {
                announcer.textContent = message;
                // Очистить через 1 секунду
                setTimeout(() => {
                    announcer.textContent = '';
                }, 1000);
            }
        };

        console.log('✅ Screen reader announcer created');
    }

    // ==========================================
    // 6. SKIP TO CONTENT LINK
    // ==========================================

    function addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#game-container';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to game';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: #fbbf24;
            color: #000;
            padding: 8px;
            text-decoration: none;
            z-index: 100000;
            font-weight: bold;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        const gameContainer = document.querySelector('.game-container');
        if (gameContainer && !gameContainer.id) {
            gameContainer.id = 'game-container';
        }

        console.log('✅ Skip link added');
    }

    // ==========================================
    // 7. REDUCED MOTION
    // ==========================================

    function applyReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `;
            document.head.appendChild(style);
            console.log('✅ Reduced motion applied');
        }
    }

    // ==========================================
    // INIT
    // ==========================================

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initAccessibility, 500);
            });
        } else {
            setTimeout(initAccessibility, 500);
        }
    }

    function initAccessibility() {
        try {
            initKeyboardNavigation();
            addAriaLabels();
            addFocusStyles();
            updateAriaLiveRegions();
            createAnnouncementRegion();
            addSkipLink();
            applyReducedMotion();

            console.log('✅ Accessibility features initialized successfully');

            // Notify user
            setTimeout(() => {
                if (window.announceToScreenReader) {
                    announceToScreenReader('Game loaded. Use Tab to navigate and Enter to activate.');
                }
            }, 1000);

        } catch (error) {
            console.error('❌ Accessibility initialization error:', error);
        }
    }

    init();

})();
