/**
 * Legal Consent Modal
 * Shows terms acceptance modal for first-time users
 */

class LegalConsent {
    constructor() {
        this.STORAGE_KEY = 'solana_tamagotchi_legal_consent';
        this.init();
    }

    init() {
        // Check if user has already consented
        if (!this.hasConsented()) {
            this.showModal();
        } else {
            // User already consented - hide footer immediately
            setTimeout(() => {
                this.hideLegalSidebar();
            }, 100);
        }
        
        // Also hide on page load if consented (double check)
        if (this.hasConsented()) {
            window.addEventListener('load', () => {
                this.hideLegalSidebar();
            });
        }
    }

    hasConsented() {
        const consent = localStorage.getItem(this.STORAGE_KEY);
        return consent === 'true';
    }

    showModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="legal-consent-modal" class="legal-consent-overlay">
                <div class="legal-consent-modal">
                    <div class="legal-consent-header">
                        <h2>вљ пёЏ Important: Please Read</h2>
                        <p class="legal-consent-subtitle">Before you continue, please review our legal documents</p>
                    </div>
                    
                    <div class="legal-consent-content">
                        <div class="legal-warning-box">
                            <p><strong>рџљЁ THIS IS A GAMEвЂ”NOT AN INVESTMENT OPPORTUNITY.</strong></p>
                            <p>TAMA tokens are for in-game use only. You may lose all value. Only participate with funds you can afford to lose.</p>
                        </div>

                        <div class="legal-documents-list">
                            <p><strong>By continuing, you agree to:</strong></p>
                            <ul>
                                <li>
                                    <a href="/terms" target="_blank">вљ–пёЏ Terms of Service</a>
                                    <span class="legal-doc-desc">Rules and conditions for using the game</span>
                                </li>
                                <li>
                                    <a href="/privacy" target="_blank">рџ”’ Privacy Policy</a>
                                    <span class="legal-doc-desc">How we collect and use your data</span>
                                </li>
                                <li>
                                    <a href="/disclaimer" target="_blank">вљ пёЏ Risk Warning</a>
                                    <span class="legal-doc-desc">Important information about risks</span>
                                </li>
                            </ul>
                        </div>

                        <div class="legal-consent-checkbox">
                            <label>
                                <input type="checkbox" id="legal-consent-checkbox">
                                <span>I have read and agree to the <a href="/terms" target="_blank">Terms of Service</a>, <a href="/privacy" target="_blank">Privacy Policy</a>, and <a href="/disclaimer" target="_blank">Risk Warning</a></span>
                            </label>
                        </div>

                        <div class="legal-consent-buttons">
                            <button id="legal-consent-decline" class="legal-btn legal-btn-decline">
                                Decline
                            </button>
                            <button id="legal-consent-accept" class="legal-btn legal-btn-accept" disabled>
                                I Agree & Continue
                            </button>
                        </div>

                        <p class="legal-consent-footnote">
                            You must be 18+ years old to use this service. By agreeing, you confirm you meet the age requirement.
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Inject modal into page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Inject styles
        this.injectStyles();

        // Add event listeners
        this.attachListeners();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .legal-consent-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(5px);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }

            .legal-consent-modal {
                background: white;
                border-radius: 20px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.4s ease;
            }

            .legal-consent-header {
                background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
                color: white;
                padding: 30px;
                border-radius: 20px 20px 0 0;
                text-align: center;
            }

            .legal-consent-header h2 {
                margin: 0 0 10px 0;
                font-size: 1.8em;
            }

            .legal-consent-subtitle {
                margin: 0;
                opacity: 0.95;
                font-size: 1em;
            }

            .legal-consent-content {
                padding: 30px;
            }

            .legal-warning-box {
                background: #FFF3CD;
                border: 2px solid #FFC107;
                border-left: 5px solid #FFC107;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 25px;
            }

            .legal-warning-box p {
                margin: 0 0 10px 0;
                color: #856404;
                line-height: 1.6;
            }

            .legal-warning-box p:last-child {
                margin-bottom: 0;
            }

            .legal-documents-list {
                margin-bottom: 25px;
            }

            .legal-documents-list p {
                font-weight: bold;
                margin-bottom: 15px;
                color: #1D3557;
            }

            .legal-documents-list ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .legal-documents-list li {
                padding: 15px;
                background: #f8f9fa;
                border-radius: 10px;
                margin-bottom: 10px;
                display: flex;
                flex-direction: column;
            }

            .legal-documents-list li a {
                color: #9945FF;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.05em;
                margin-bottom: 5px;
            }

            .legal-documents-list li a:hover {
                text-decoration: underline;
            }

            .legal-doc-desc {
                font-size: 0.9em;
                color: #666;
            }

            .legal-consent-checkbox {
                background: #f8f9fa;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 25px;
            }

            .legal-consent-checkbox label {
                display: flex;
                align-items: flex-start;
                cursor: pointer;
            }

            .legal-consent-checkbox input[type="checkbox"] {
                margin-right: 12px;
                margin-top: 3px;
                width: 20px;
                height: 20px;
                cursor: pointer;
                flex-shrink: 0;
            }

            .legal-consent-checkbox span {
                line-height: 1.6;
                color: #333;
            }

            .legal-consent-checkbox a {
                color: #9945FF;
                text-decoration: none;
            }

            .legal-consent-checkbox a:hover {
                text-decoration: underline;
            }

            .legal-consent-buttons {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
            }

            .legal-btn {
                flex: 1;
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                font-size: 1.05em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .legal-btn-decline {
                background: #e0e0e0;
                color: #666;
            }

            .legal-btn-decline:hover {
                background: #d0d0d0;
            }

            .legal-btn-accept {
                background: linear-gradient(135deg, #9945FF 0%, #14F195 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(153, 69, 255, 0.3);
            }

            .legal-btn-accept:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(153, 69, 255, 0.4);
            }

            .legal-btn-accept:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background: #ccc;
            }

            .legal-consent-footnote {
                text-align: center;
                font-size: 0.9em;
                color: #999;
                margin: 0;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 768px) {
                .legal-consent-modal {
                    max-width: 100%;
                    margin: 10px;
                }

                .legal-consent-header {
                    padding: 20px;
                }

                .legal-consent-header h2 {
                    font-size: 1.4em;
                }

                .legal-consent-content {
                    padding: 20px;
                }

                .legal-consent-buttons {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    attachListeners() {
        const checkbox = document.getElementById('legal-consent-checkbox');
        const acceptBtn = document.getElementById('legal-consent-accept');
        const declineBtn = document.getElementById('legal-consent-decline');

        // Enable/disable accept button based on checkbox
        checkbox.addEventListener('change', () => {
            acceptBtn.disabled = !checkbox.checked;
        });

        // Accept button
        acceptBtn.addEventListener('click', () => {
            if (checkbox.checked) {
                this.acceptConsent();
            }
        });

        // Decline button
        declineBtn.addEventListener('click', () => {
            this.declineConsent();
        });
    }

    acceptConsent() {
        // Save consent to localStorage
        localStorage.setItem(this.STORAGE_KEY, 'true');
        localStorage.setItem(this.STORAGE_KEY + '_date', new Date().toISOString());

        // Close modal with animation
        const modal = document.getElementById('legal-consent-modal');
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);

        // Hide legal documents sidebar/panel if exists
        this.hideLegalSidebar();

        // Log acceptance (for analytics if needed)
        // [cleaned]
    }

    hideLegalSidebar() {
        // Hide legal footer by ID (most reliable)
        const legalFooter = document.getElementById('legal-footer');
        if (legalFooter) {
            // Add class for CSS rule
            legalFooter.classList.add('hidden-consent');
            
            // Force hide with inline styles
            legalFooter.style.display = 'none';
            legalFooter.style.visibility = 'hidden';
            legalFooter.style.opacity = '0';
            legalFooter.style.height = '0';
            legalFooter.style.overflow = 'hidden';
            legalFooter.style.padding = '0';
            legalFooter.style.margin = '0';
            legalFooter.style.position = 'absolute';
            legalFooter.style.left = '-9999px';
            legalFooter.style.width = '0';
            legalFooter.style.transition = 'opacity 0.3s ease, display 0.3s ease';
            // [cleaned]
        }

        // Try to find and hide legal sidebar/panel on the right side
        const selectors = [
            '.legal-sidebar',
            '.legal-panel',
            '.documents-sidebar',
            '.documents-panel',
            '[class*="legal"][class*="sidebar"]',
            '[class*="legal"][class*="panel"]',
            '[id*="legal"][id*="sidebar"]',
            '[id*="legal"][id*="panel"]',
            'div[style*="position: fixed"][style*="right"]',
            'div[style*="position:fixed"][style*="right"]'
        ];

        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // Check if element contains legal text
                    const text = el.textContent || '';
                    if (text.includes('Privacy Policy') || text.includes('Terms of Service') || text.includes('Risk Warning')) {
                        el.style.display = 'none';
                        el.style.opacity = '0';
                        el.style.transition = 'opacity 0.3s ease';
                        // [cleaned]
                    }
                });
            } catch (e) {
                // Ignore invalid selectors
            }
        });

        // Also check for any fixed right-side elements that might be legal docs
        const allFixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
        allFixedElements.forEach(el => {
            const style = el.getAttribute('style') || '';
            const text = el.textContent || '';
            if (style.includes('right') && (text.includes('Privacy Policy') || text.includes('Terms of Service') || text.includes('Risk Warning'))) {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.3s ease';
                // [cleaned]
            }
        });

        // Also check for any element containing legal text that might be positioned incorrectly
        const allElements = document.querySelectorAll('div, section, aside');
        allElements.forEach(el => {
            const text = el.textContent || '';
            const style = window.getComputedStyle(el);
            if ((text.includes('Privacy Policy') || text.includes('Terms of Service') || text.includes('Risk Warning')) && 
                (style.position === 'fixed' || style.position === 'absolute')) {
                // Check if it's on the right side
                const rect = el.getBoundingClientRect();
                if (rect.right > window.innerWidth || rect.left > window.innerWidth * 0.7) {
                    el.style.display = 'none';
                    el.style.opacity = '0';
                    el.style.transition = 'opacity 0.3s ease';
                    // [cleaned]
                }
            }
        });
    }

    declineConsent() {
        // Redirect to home or show message
        if (confirm('You must accept the terms to use Solana Tamagotchi. Would you like to review the documents?')) {
            // Keep modal open
            return;
        } else {
            // Redirect to main site or close game
            window.location.href = '/';
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LegalConsent();
    });
} else {
    new LegalConsent();
}

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);


