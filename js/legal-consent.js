/**
 * Legal Consent Modal (Optimized)
 * Shows terms acceptance modal for first-time users
 */

class LegalConsent {
  constructor() {
    this.STORAGE_KEY = 'solana_tamagotchi_legal_consent';
    this.init();
  }

  init() {
    try {
      // Check if user has already consented
      if (!this.hasConsented()) {
        // Small delay to ensure styles are loaded
        setTimeout(() => this.showModal(), 50);
      } else {
        // User already consented - hide footer immediately
        this.hideLegalSidebar();
      }

      // Double check on load
      if (document.readyState !== 'loading') {
        if (this.hasConsented()) this.hideLegalSidebar();
      } else {
        window.addEventListener('load', () => {
          if (this.hasConsented()) this.hideLegalSidebar();
        });
      }
    } catch (e) {
      console.warn('LegalConsent init failed (likely privacy mode):', e);
    }
  }

  hasConsented() {
    try {
      const consent = localStorage.getItem(this.STORAGE_KEY);
      return consent === 'true';
    } catch (e) {
      return false; // Default to showing if storage inaccessible
    }
  }

  showModal() {
    // Prevent duplicate modals
    if (document.getElementById('legal-consent-modal')) return;

    // Create modal HTML
    const modalHTML = `
            <div id="legal-consent-modal" class="legal-consent-overlay">
                <div class="legal-consent-modal">
                    <div class="legal-consent-header">
                        <h2>${window.i18n?.t('legal_title') || '⚠️ Important: Please Read'}</h2>
                        <p class="legal-consent-subtitle">${
                          window.i18n?.t('legal_subtitle') ||
                          'Before you continue, please review our legal documents'
                        }</p>
                    </div>

                    <div class="legal-consent-content">
                        <div class="legal-warning-box">
                            <p><strong>${
                              window.i18n?.t('legal_warning_title') ||
                              '🚨 THIS IS A GAME - NOT AN INVESTMENT OPPORTUNITY.'
                            }</strong></p>
                            <p>${
                              window.i18n?.t('legal_warning_text') ||
                              'TAMA tokens are for in-game use only. You may lose all value. Only participate with funds you can afford to lose.'
                            }</p>
                        </div>

                        <div class="legal-documents-list">
                            <p><strong>${
                              window.i18n?.t('legal_agree_to') || 'By continuing, you agree to:'
                            }</strong></p>
                            <ul>
                                <li>
                                    <a href="/terms" target="_blank">${
                                      window.i18n?.t('legal_terms') || '⚖️ Terms of Service'
                                    }</a>
                                    <span class="legal-doc-desc">Rules and conditions for using the game</span>
                                </li>
                                <li>
                                    <a href="/privacy" target="_blank">${
                                      window.i18n?.t('legal_privacy') || '🔒 Privacy Policy'
                                    }</a>
                                    <span class="legal-doc-desc">How we collect and use your data</span>
                                </li>
                                <li>
                                    <a href="/disclaimer" target="_blank">${
                                      window.i18n?.t('legal_risk') || '⚠️ Risk Warning'
                                    }</a>
                                    <span class="legal-doc-desc">Important information about risks</span>
                                </li>
                            </ul>
                        </div>

                        <div class="legal-consent-checkbox" onclick="document.getElementById('legal-consent-checkbox').click()">
                            <label onclick="event.stopPropagation()">
                                <input type="checkbox" id="legal-consent-checkbox">
                                <span>${
                                  window.i18n?.t('legal_checkbox_text') ||
                                  'I have read and agree to all terms'
                                }</span>
                            </label>
                        </div>

                        <div class="legal-consent-buttons">
                            <button id="legal-consent-decline" class="legal-btn legal-btn-decline">
                                ${window.i18n?.t('legal_decline') || 'Decline'}
                            </button>
                            <button id="legal-consent-accept" class="legal-btn legal-btn-accept" disabled>
                                ${window.i18n?.t('legal_agree_continue') || 'I Agree & Continue'}
                            </button>
                        </div>

                        <p class="legal-consent-footnote">
                            ${
                              window.i18n?.t('legal_age_confirm') ||
                              'You must be 18+ years old to use this service.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        `;

    // Inject modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Attach listeners
    this.attachListeners();
  }

  // Styles are now in css/game-consent.css - Removed injectStyles()

  attachListeners() {
    const checkbox = document.getElementById('legal-consent-checkbox');
    const acceptBtn = document.getElementById('legal-consent-accept');
    const declineBtn = document.getElementById('legal-consent-decline');
    const checkboxContainer = document.querySelector('.legal-consent-checkbox');

    if (!checkbox || !acceptBtn || !declineBtn) return;

    // Toggle button state
    checkbox.addEventListener('change', () => {
      acceptBtn.disabled = !checkbox.checked;

      // Haptic feedback (Light)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }

      if (checkbox.checked) {
        checkboxContainer.classList.add('checked');
      } else {
        checkboxContainer.classList.remove('checked');
      }
    });

    // Accept action
    acceptBtn.addEventListener('click', (e) => {
      if (checkbox.checked) {
        // Haptic feedback (Success/Heavy)
        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }

        // Visual Juice: Confetti Burst!
        if (window.UIJuice && window.UIJuice.createEmojiBurst) {
          const rect = acceptBtn.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          window.UIJuice.createEmojiBurst(x, y, ['🎉', '✅', '✨', '👍']);
        }

        // Small delay to see the effect
        setTimeout(() => this.acceptConsent(), 300);
      } else {
        // Haptic feedback (Error)
        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }

        // Shake animation if clicked without check (UX)
        checkboxContainer.style.background = '#ffebee';
        setTimeout(() => (checkboxContainer.style.background = ''), 300);
      }
    });

    // Decline action
    declineBtn.addEventListener('click', () => {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
      this.declineConsent();
    });
  }

  acceptConsent() {
    try {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      localStorage.setItem(this.STORAGE_KEY + '_date', new Date().toISOString());
    } catch (e) {
      console.warn('Could not save consent to storage:', e);
    }

    // Animation handled by CSS class removal/addition or direct style
    const modal = document.getElementById('legal-consent-modal');
    if (modal) {
      modal.style.transition = 'opacity 0.3s ease';
      modal.style.opacity = '0';
      setTimeout(() => modal.remove(), 300);
    }

    this.hideLegalSidebar();
  }

  hideLegalSidebar() {
    // More robust hiding of legal elements
    const selectors = ['#legal-footer', '.legal-sidebar', '.legal-panel', '.documents-sidebar'];

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.display = 'none';
        el.classList.add('hidden-consent');
      });
    });
  }

  declineConsent() {
    // Improved UX instead of native confirm
    const btn = document.getElementById('legal-consent-decline');
    const originalText = btn.innerText;

    btn.innerText = 'Redirecting...';
    btn.style.opacity = '0.7';

    // Soft redirect
    setTimeout(() => {
      window.location.href = 'https://google.com';
    }, 500);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LegalConsent());
} else {
  new LegalConsent();
}
