// Winter Theme - Simple Snow Animation
class WinterTheme {
    constructor() {
        this.snowflakesCount = 50;
        this.snowflakeChars = ['*', '*', '*', '*', '*', '*'];
        this.isActive = false;
        this.snowContainer = null;
    }

    init() {
        this.activate();
    }

    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        document.body.classList.add('winter-theme');
        
        this.snowContainer = document.createElement('div');
        this.snowContainer.className = 'snowflakes';
        document.body.appendChild(this.snowContainer);
        
        this.startSnowfall();
        
        console.log('Winter theme: Snow activated');
    }

    startSnowfall() {
        for (let i = 0; i < this.snowflakesCount; i++) {
            setTimeout(() => {
                this.createSnowflake();
            }, i * 100);
        }
        
        this.snowfallInterval = setInterval(() => {
            if (this.isActive && this.snowContainer) {
                this.createSnowflake();
            }
        }, 1000);
    }

    createSnowflake() {
        if (!this.snowContainer) return;
        
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        const char = this.snowflakeChars[Math.floor(Math.random() * this.snowflakeChars.length)];
        snowflake.innerHTML = char;
        
        const sizes = ['small', 'medium', 'large'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        snowflake.classList.add(size);
        
        snowflake.style.left = Math.random() * 100 + '%';
        
        const duration = Math.random() * 5 + 5;
        snowflake.style.animationDuration = duration + 's';
        
        snowflake.style.animationDelay = Math.random() * 2 + 's';
        
        const swayDuration = Math.random() * 3 + 2;
        const swayAnimation = 'sway ' + swayDuration + 's ease-in-out infinite';
        snowflake.style.animation = 'fall ' + duration + 's linear infinite, ' + swayAnimation;
        
        this.snowContainer.appendChild(snowflake);
        
        setTimeout(() => {
            if (snowflake && snowflake.parentNode) {
                snowflake.remove();
            }
        }, duration * 1000 + 2000);
    }
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.winterTheme = new WinterTheme();
            window.winterTheme.init();
        });
    } else {
        window.winterTheme = new WinterTheme();
        window.winterTheme.init();
    }
}