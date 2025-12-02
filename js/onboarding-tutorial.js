/**
 * Onboarding Tutorial for New Users
 * Shows step-by-step guide for first-time players
 */

const OnboardingTutorial = {
    currentStep: 0,
    totalSteps: 4,
    overlay: null,
    tooltip: null,

    /**
     * Check if user needs onboarding
     */
    shouldShowOnboarding() {
        // Check if already completed
        const completed = localStorage.getItem('onboarding_completed');
        if (completed === 'true') {
            return false;
        }
        
        // Check if user is authenticated (has wallet or telegram)
        const hasAuth = window.WALLET_ADDRESS || window.Telegram?.WebApp?.initDataUnsafe?.user;
        
        return !completed && hasAuth;
    },

    /**
     * Start onboarding tutorial
     */
    start() {
        if (!this.shouldShowOnboarding()) {
            console.log('ℹ️ Onboarding not needed');
            return;
        }
        
        console.log('🎓 Starting onboarding tutorial');
        
        this.currentStep = 0;
        this.createOverlay();
        this.showStep(0);
    },

    /**
     * Create dark overlay
     */
    createOverlay() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'onboarding-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 99998;
            backdrop-filter: blur(3px);
        `;
        
        document.body.appendChild(this.overlay);
        
        // Create tooltip container
        this.tooltip = document.createElement('div');
        this.tooltip.id = 'onboarding-tooltip';
        this.tooltip.style.cssText = `
            position: fixed;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            z-index: 99999;
            max-width: 400px;
            font-family: 'Comic Sans MS', cursive;
        `;
        
        document.body.appendChild(this.tooltip);
    },

    /**
     * Show specific step
     */
    showStep(stepIndex) {
        this.currentStep = stepIndex;
        
        const steps = [
            {
                title: '🎮 Welcome to Solana Tamagotchi!',
                text: 'Click on your pet to earn TAMA tokens! Each click earns you rewards.',
                target: '#pet-container',
                position: 'bottom'
            },
            {
                title: '❤️ Watch Your Pet\'s Health',
                text: 'Keep an eye on Health, Food, and Happiness bars. Feed and play with your pet to keep them happy!',
                target: '.stats-container',
                position: 'top'
            },
            {
                title: '🎯 Complete Daily Quests',
                text: 'Click 50 times and reach level 5 to earn bonus TAMA!',
                target: '.quests-section',
                position: 'left'
            },
            {
                title: '🔗 Invite Friends & Earn More!',
                text: 'Share your referral link to earn bonuses when friends join!',
                target: '#referral-btn',
                position: 'bottom'
            }
        ];
        
        if (stepIndex >= steps.length) {
            this.complete();
            return;
        }
        
        const step = steps[stepIndex];
        
        // Highlight target element
        this.highlightElement(step.target);
        
        // Update tooltip content
        this.tooltip.innerHTML = `
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">${step.title}</h2>
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">${step.text}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 14px; opacity: 0.8;">Step ${stepIndex + 1} of ${steps.length}</div>
                <div>
                    ${stepIndex > 0 ? '<button id="onboarding-prev" style="padding: 10px 20px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; margin-right: 10px; cursor: pointer;">← Back</button>' : ''}
                    <button id="onboarding-next" style="padding: 10px 20px; background: white; border: none; border-radius: 8px; color: #667eea; font-weight: bold; cursor: pointer;">${stepIndex === steps.length - 1 ? 'Got it!' : 'Next →'}</button>
                </div>
            </div>
        `;
        
        // Position tooltip near target
        this.positionTooltip(step.target, step.position);
        
        // Add event listeners
        const nextBtn = document.getElementById('onboarding-next');
        if (nextBtn) {
            nextBtn.onclick = () => this.showStep(stepIndex + 1);
        }
        
        const prevBtn = document.getElementById('onboarding-prev');
        if (prevBtn) {
            prevBtn.onclick = () => this.showStep(stepIndex - 1);
        }
    },

    /**
     * Highlight target element
     */
    highlightElement(selector) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        // Remove previous highlights
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });
        
        // Add highlight
        element.classList.add('onboarding-highlight');
        element.style.position = 'relative';
        element.style.zIndex = '99999';
        element.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.8), 0 0 30px rgba(102, 126, 234, 0.8)';
        element.style.borderRadius = '12px';
    },

    /**
     * Position tooltip relative to target
     */
    positionTooltip(selector, position) {
        const element = document.querySelector(selector);
        if (!element) {
            // Center if element not found
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        switch (position) {
            case 'top':
                this.tooltip.style.top = (rect.top - tooltipRect.height - 20) + 'px';
                this.tooltip.style.left = (rect.left + rect.width / 2 - tooltipRect.width / 2) + 'px';
                this.tooltip.style.transform = 'none';
                break;
            case 'bottom':
                this.tooltip.style.top = (rect.bottom + 20) + 'px';
                this.tooltip.style.left = (rect.left + rect.width / 2 - tooltipRect.width / 2) + 'px';
                this.tooltip.style.transform = 'none';
                break;
            case 'left':
                this.tooltip.style.top = (rect.top + rect.height / 2 - tooltipRect.height / 2) + 'px';
                this.tooltip.style.left = (rect.left - tooltipRect.width - 20) + 'px';
                this.tooltip.style.transform = 'none';
                break;
            case 'right':
                this.tooltip.style.top = (rect.top + rect.height / 2 - tooltipRect.height / 2) + 'px';
                this.tooltip.style.left = (rect.right + 20) + 'px';
                this.tooltip.style.transform = 'none';
                break;
            default:
                this.tooltip.style.top = '50%';
                this.tooltip.style.left = '50%';
                this.tooltip.style.transform = 'translate(-50%, -50%)';
        }
    },

    /**
     * Complete onboarding
     */
    complete() {
        console.log('✅ Onboarding completed!');
        
        // Mark as completed
        localStorage.setItem('onboarding_completed', 'true');
        
        // Remove highlight
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
            el.style.boxShadow = '';
            el.style.zIndex = '';
        });
        
        // Show completion message
        this.tooltip.innerHTML = `
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">🎉 You're Ready!</h2>
            <p style="margin: 0 0 20px 0; font-size: 16px;">Have fun playing and earning TAMA!</p>
            <button id="onboarding-close" style="padding: 12px 30px; background: white; border: none; border-radius: 8px; color: #667eea; font-weight: bold; cursor: pointer; width: 100%;">Start Playing! 🚀</button>
        `;
        
        this.tooltip.style.top = '50%';
        this.tooltip.style.left = '50%';
        this.tooltip.style.transform = 'translate(-50%, -50%)';
        
        const closeBtn = document.getElementById('onboarding-close');
        if (closeBtn) {
            closeBtn.onclick = () => this.close();
        }
    },

    /**
     * Close onboarding
     */
    close() {
        if (this.overlay) {
            document.body.removeChild(this.overlay);
        }
        if (this.tooltip) {
            document.body.removeChild(this.tooltip);
        }
        
        // Remove highlights
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
            el.style.boxShadow = '';
            el.style.zIndex = '';
        });
        
        console.log('✅ Onboarding closed');
    },

    /**
     * Skip onboarding
     */
    skip() {
        localStorage.setItem('onboarding_completed', 'true');
        this.close();
    }
};

// Export for global use
window.OnboardingTutorial = OnboardingTutorial;

console.log('✅ Onboarding Tutorial loaded');

