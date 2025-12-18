/**
 * 🍹 UI Juice - Enhanced Animations and Feedback
 * v1.0.0 | @UI-UX Droid
 */

const UIJuice = {
    init: function() {
        console.log('✨ UI Juice initialized');
        this.setupActionHooks();
        this.setupStatObservers();
    },

    /**
     * Creates a burst of emojis at a specific location
     */
    createEmojiBurst: function(x, y, emojis = ['🍎', '🍕', '🦴', '🥩']) {
        const count = 8;
        const container = document.body;

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 'emoji-particle';
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            
            // Random direction and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance - 50; // Bias upwards
            const dr = Math.random() * 360; // Random rotation

            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.setProperty('--dx', `${dx}px`);
            el.style.setProperty('--dy', `${dy}px`);
            el.style.setProperty('--dr', `${dr}deg`);

            container.appendChild(el);

            // Remove after animation
            setTimeout(() => el.remove(), 1000);
        }
    },

    /**
     * Hook into button clicks to add juice
     */
    setupActionHooks: function() {
        const buttons = {
            'feed-btn': ['🍎', '🍕', '🦴', '🥩', '🍰'],
            'play-btn': ['⚽', '🎾', '🎮', '🎈', '🎉'],
            'heal-btn': ['💊', '🩹', '❤️', '💉', '✨'],
            'pet-area': ['❤️', '✨', '⭐', '💖', '🐾']
        };

        Object.entries(buttons).forEach(([id, emojis]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    // Get coordinates for the burst
                    let x, y;
                    if (id === 'pet-area') {
                        x = e.clientX;
                        y = e.clientY;
                    } else {
                        const rect = btn.getBoundingClientRect();
                        x = rect.left + rect.width / 2;
                        y = rect.top + rect.height / 2;
                    }
                    this.createEmojiBurst(x, y, emojis);
                });
            }
        });
    },

    /**
     * Monitor stats to add danger pulses
     */
    setupStatObservers: function() {
        const bars = ['hp-bar', 'food-bar', 'happy-bar'];
        
        const checkStats = () => {
            bars.forEach(id => {
                const bar = document.getElementById(id);
                if (bar) {
                    const width = parseFloat(bar.style.width);
                    if (width < 25) {
                        bar.classList.add('stat-danger');
                    } else {
                        bar.classList.remove('stat-danger');
                    }
                }
            });
        };

        // Check every second
        setInterval(checkStats, 1000);
    }
};

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIJuice.init());
} else {
    UIJuice.init();
}

