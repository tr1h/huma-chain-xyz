/**
 * Legal Checkbox Component
 * Adds terms acceptance checkbox to mint/withdrawal forms
 */

class LegalCheckbox {
    /**
     * Show legal consent checkbox before sensitive actions
     * @param {string} action - Action type: 'mint', 'withdraw', 'purchase'
     * @returns {Promise<boolean>} - Resolves to true if user accepts, false otherwise
     */
    static async showConsentDialog(action = 'action') {
        return new Promise((resolve) => {
            const actionText = {
                'mint': 'mint NFT',
                'withdraw': 'withdraw tokens',
                'purchase': 'make a purchase',
                'action': 'continue'
            };

            const actionLabel = actionText[action] || actionText['action'];

            // Create modal HTML
            const modalHTML = `
                <div id="legal-checkbox-modal" class="legal-checkbox-overlay">
                    <div class="legal-checkbox-modal">
                        <div class="legal-checkbox-header">
                            <h3>⚠️ Confirm Action</h3>
                            <p>Before you ${actionLabel}, please confirm:</p>
                        </div>
                        
                        <div class="legal-checkbox-content">
                            <div class="legal-warning">
                                <p><strong>Important Reminder:</strong></p>
                                <ul>
                                    <li>TAMA tokens are for in-game use only</li>
                                    <li>This is not an investment opportunity</li>
                                    <li>You may lose all value</li>
                                    <li>Only use funds you can afford to lose</li>
                                </ul>
                            </div>

                            <div class="legal-checkbox-wrapper">
                                <label class="legal-checkbox-label">
                                    <input type="checkbox" id="legal-action-checkbox" class="legal-checkbox-input">
                                    <span>I have read and agree to the <a href="/terms" target="_blank">Terms of Service</a>, <a href="/privacy" target="_blank">Privacy Policy</a>, and <a href="/disclaimer" target="_blank">Risk Warning</a></span>
                                </label>
                            </div>

                            <div class="legal-checkbox-buttons">
                                <button id="legal-checkbox-cancel" class="legal-btn-secondary">
                                    Cancel
                                </button>
                                <button id="legal-checkbox-confirm" class="legal-btn-primary" disabled>
                                    Confirm & Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Inject modal
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Inject styles if not already present
            if (!document.getElementById('legal-checkbox-styles')) {
                LegalCheckbox.injectStyles();
            }

            // Get elements
            const modal = document.getElementById('legal-checkbox-modal');
            const checkbox = document.getElementById('legal-action-checkbox');
            const confirmBtn = document.getElementById('legal-checkbox-confirm');
            const cancelBtn = document.getElementById('legal-checkbox-cancel');

            // Enable/disable confirm button
            checkbox.addEventListener('change', () => {
                confirmBtn.disabled = !checkbox.checked;
            });

            // Confirm action
            confirmBtn.addEventListener('click', () => {
                if (checkbox.checked) {
                    modal.remove();
                    resolve(true);
                }
            });

            // Cancel action
            cancelBtn.addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });

            // Close on overlay click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            });
        });
    }

    static injectStyles() {
        const style = document.createElement('style');
        style.id = 'legal-checkbox-styles';
        style.textContent = `
            .legal-checkbox-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(3px);
                z-index: 999998;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: fadeIn 0.2s ease;
            }

            .legal-checkbox-modal {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 100%;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }

            .legal-checkbox-header {
                background: linear-gradient(135deg, #FFC107 0%, #FF8E53 100%);
                color: white;
                padding: 25px;
                border-radius: 15px 15px 0 0;
            }

            .legal-checkbox-header h3 {
                margin: 0 0 8px 0;
                font-size: 1.4em;
            }

            .legal-checkbox-header p {
                margin: 0;
                opacity: 0.95;
                font-size: 0.95em;
            }

            .legal-checkbox-content {
                padding: 25px;
            }

            .legal-warning {
                background: #FFF3CD;
                border: 1px solid #FFC107;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
            }

            .legal-warning p {
                margin: 0 0 10px 0;
                font-weight: 600;
                color: #856404;
            }

            .legal-warning ul {
                margin: 0;
                padding-left: 20px;
                color: #856404;
            }

            .legal-warning li {
                margin: 5px 0;
                font-size: 0.9em;
            }

            .legal-checkbox-wrapper {
                background: #f8f9fa;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
            }

            .legal-checkbox-label {
                display: flex;
                align-items: flex-start;
                cursor: pointer;
            }

            .legal-checkbox-input {
                margin-right: 10px;
                margin-top: 2px;
                width: 18px;
                height: 18px;
                cursor: pointer;
                flex-shrink: 0;
            }

            .legal-checkbox-label span {
                line-height: 1.5;
                color: #333;
                font-size: 0.95em;
            }

            .legal-checkbox-label a {
                color: #9945FF;
                text-decoration: none;
            }

            .legal-checkbox-label a:hover {
                text-decoration: underline;
            }

            .legal-checkbox-buttons {
                display: flex;
                gap: 12px;
            }

            .legal-btn-secondary,
            .legal-btn-primary {
                flex: 1;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 1em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .legal-btn-secondary {
                background: #e0e0e0;
                color: #666;
            }

            .legal-btn-secondary:hover {
                background: #d0d0d0;
            }

            .legal-btn-primary {
                background: linear-gradient(135deg, #9945FF 0%, #14F195 100%);
                color: white;
            }

            .legal-btn-primary:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(153, 69, 255, 0.3);
            }

            .legal-btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                background: #ccc;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 768px) {
                .legal-checkbox-modal {
                    margin: 10px;
                }

                .legal-checkbox-header {
                    padding: 20px;
                }

                .legal-checkbox-content {
                    padding: 20px;
                }

                .legal-checkbox-buttons {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add inline checkbox to existing form
     * @param {string} formId - ID of the form element
     * @param {string} submitBtnId - ID of the submit button
     */
    static addToForm(formId, submitBtnId) {
        const form = document.getElementById(formId);
        const submitBtn = document.getElementById(submitBtnId);

        if (!form || !submitBtn) {
            console.warn('Form or submit button not found');
            return;
        }

        // Create checkbox HTML
        const checkboxHTML = `
            <div class="legal-form-checkbox" style="margin: 20px 0; padding: 15px; background: #f8f9fa; border: 2px solid #e0e0e0; border-radius: 8px;">
                <label style="display: flex; align-items: flex-start; cursor: pointer;">
                    <input type="checkbox" id="${formId}-legal-checkbox" style="margin-right: 10px; margin-top: 2px; width: 18px; height: 18px; cursor: pointer;">
                    <span style="line-height: 1.5; color: #333; font-size: 0.95em;">
                        I have read and agree to the <a href="/terms" target="_blank" style="color: #9945FF; text-decoration: none;">Terms of Service</a>, <a href="/privacy" target="_blank" style="color: #9945FF; text-decoration: none;">Privacy Policy</a>, and <a href="/disclaimer" target="_blank" style="color: #9945FF; text-decoration: none;">Risk Warning</a>
                    </span>
                </label>
            </div>
        `;

        // Insert before submit button
        submitBtn.insertAdjacentHTML('beforebegin', checkboxHTML);

        // Disable submit button initially
        submitBtn.disabled = true;

        // Enable/disable submit button based on checkbox
        const checkbox = document.getElementById(`${formId}-legal-checkbox`);
        checkbox.addEventListener('change', () => {
            submitBtn.disabled = !checkbox.checked;
        });
    }
}

// Make it globally available
window.LegalCheckbox = LegalCheckbox;

