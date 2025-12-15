# 🤖 Droid Guidelines - Solana Tamagotchi Project

## 📋 Project Overview

**Repository:** tr1h/huma-chain-xyz  
**Project:** Solana Tamagotchi - Play-to-Earn Game  
**Tech Stack:** HTML/JS (Frontend) + PHP (API) + Python (Bot) + Supabase (DB) + Solana (Blockchain)  
**Languages:** 13 (EN, RU, ZH, ES, PT, JA, FR, HI, KO, TR, DE, AR, VI)  
**Status:** Production (Devnet) → Mainnet launch Q1 2026

---

## 🎯 Mission Statement

Build the best Play-to-Earn Tamagotchi game on Solana with:
- ✅ Fair economy (real crypto rewards)
- ✅ Global accessibility (13 languages)
- ✅ Security-first approach
- ✅ Community-driven development

---

## 🏗️ Architecture Quick Reference

```
C:\goooog\
├── 📄 *.html              # Frontend pages (index, tamagotchi-game, slots, wheel, mint, etc.)
├── 📁 api/                # PHP REST API + Node.js NFT minting
├── 📁 bot/                # Python Telegram bot (multi-language, gamification)
├── 📁 js/                 # Frontend JavaScript modules
│   ├── auth.js           # Unified authentication (Telegram + Wallet)
│   ├── config.js         # Centralized configuration
│   ├── i18n.js           # Internationalization
│   └── ...
├── 📁 css/               # Stylesheets (animations, mobile, game-specific)
├── 📁 docs/              # 📚 Comprehensive documentation (ALWAYS CHECK HERE FIRST!)
│   ├── guides/          # Setup & integration guides
│   ├── features/        # Feature explanations
│   ├── reports/         # Analytics & audit reports
│   └── admin/           # Admin panel documentation
├── 📁 sql/               # Database migrations (Supabase PostgreSQL)
├── 📁 supabase/          # Database functions & procedures
├── 📁 tools/             # Developer utilities
├── 📁 ru/, zh/, ja/, ko/, es/  # SEO-optimized landing pages per language
├── .env.example          # Environment variables template
└── README.md             # Project overview
```

---

## 🔑 Core Principles

### 1. **Security First** 🔐
- ❌ **NEVER** commit secrets to git
- ✅ Use `.env` for all sensitive data
- ✅ Check `SECURITY.md` before handling credentials
- ✅ Validate all user inputs
- ✅ Use rate limiting on APIs
- ✅ Rotate keys regularly

### 2. **Multi-Language Always** 🌍
- ❌ **NEVER** add text without translations
- ✅ Update ALL 13 languages when changing text
- ✅ Files to update:
  - `bot/translations.py` (Telegram bot)
  - `bot/bot_translations.py` (bot UI)
  - `js/i18n.js` (frontend)
  - Language-specific landing pages (`/ru`, `/zh`, etc.)
- ✅ Test language switching before committing

### 3. **Documentation Driven** 📚
- ✅ **ALWAYS** check `/docs` before implementing
- ✅ Update documentation for major features
- ✅ Keep README.md current
- ✅ Document API changes in code comments

### 4. **Database Migrations** 🗄️
- ❌ **NEVER** modify Supabase directly in production
- ✅ Create SQL migration in `/sql` for schema changes
- ✅ Test migrations on dev database first
- ✅ Document migration purpose in filename

### 5. **Code Quality** ✨
- ✅ Run ESLint + Prettier before committing
- ✅ Follow existing code style
- ✅ Add comments for complex logic
- ✅ Keep functions small and focused
- ✅ Test on mobile + desktop

---

## 📝 Standard Workflows

### Adding a New Feature

```
1. Check `/docs/guides` for existing patterns
2. Create feature branch: `git checkout -b feature/your-feature`
3. Implement changes:
   - Frontend: HTML + JS + CSS
   - Backend: API endpoint in `/api`
   - Bot: Handler in `bot/bot.py` if needed
   - Database: SQL migration in `/sql` if needed
4. Add translations for ALL 13 languages
5. Update documentation in `/docs`
6. Test thoroughly (Telegram + Web + Mobile)
7. Run linter: `npm run lint` or `eslint js/*.js`
8. Commit with descriptive message
9. Push and create PR
```

### Fixing a Bug

```
1. Reproduce the bug
2. Find root cause (check logs, inspect code)
3. Create bugfix branch: `git checkout -b fix/bug-description`
4. Fix with minimal changes
5. Test fix thoroughly
6. Check for side effects in related code
7. Commit with "Fix: description" message
8. Push and create PR
```

### Adding Translations

```
1. Identify all text strings to translate
2. Update `bot/translations.py` (Telegram bot):
   - Add to TRANSLATIONS dict for all 13 languages
3. Update `js/i18n.js` (Frontend):
   - Add to translations object for all languages
4. Update SEO pages if needed:
   - /ru/index.html
   - /zh/index.html
   - /ja/index.html
   - /ko/index.html
   - /es/index.html
5. Test language switching:
   - In Telegram bot: /language command
   - On website: Language selector modal
6. Verify correct encoding (UTF-8)
```

### Updating Database Schema

```
1. Design schema change
2. Create SQL file in `/sql`:
   - Naming: `YYYY-MM-DD-description.sql` or `descriptive-name.sql`
3. Test on dev Supabase instance
4. Document purpose in SQL comments
5. Apply to production Supabase
6. Update related API code if needed
7. Document in git commit message
```

---

## 🛠️ Development Commands

### Frontend Development
```bash
# Open with Live Server (VS Code extension)
# Right-click index.html → "Open with Live Server"

# Lint JavaScript
npm run lint
# or manually:
eslint js/*.js --fix

# Format code
npx prettier --write "**/*.{js,html,css}"
```

### API Development
```bash
# Start PHP development server
cd api
php -S localhost:8000

# Start Node.js NFT minting server
npm start  # or node api/server-onchain.js
```

### Bot Development
```bash
cd bot

# Install dependencies
pip install -r requirements.txt

# Run bot locally
python bot.py

# Run with webhook (production)
gunicorn bot:app
```

### Database
```bash
# Connect to Supabase (use Database Client in VS Code)
# Or visit: https://supabase.com/dashboard/project/zfrazyupameidxpjihrh

# Apply SQL migration
# Copy SQL from /sql/*.sql and run in Supabase SQL Editor
```

---

## 🎨 Code Style Guidelines

### JavaScript (ESLint + Prettier)
```javascript
// Single quotes, semicolons, 2-space indent
const myFunction = () => {
  console.log('Hello World');
};

// Use async/await over promises
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### PHP (PSR-12)
```php
<?php
// Use strict types
declare(strict_types=1);

// Proper error handling
try {
    $result = performAction();
} catch (Exception $e) {
    error_log('Error: ' . $e->getMessage());
    returnError('Action failed', 500);
}
```

### Python (Black formatter, 100 chars)
```python
# Use type hints
def handle_command(message: Message, user_lang: str = "en") -> None:
    """Handle user command with localization."""
    text = t("welcome", user_lang)
    bot.reply_to(message, text)

# Use f-strings
print(f"User {user_id} earned {amount} TAMA")
```

---

## 🚨 Common Pitfalls to Avoid

### ❌ Don't:
1. Commit `.env` or secrets
2. Hardcode API keys or passwords
3. Skip translations (all 13 languages required!)
4. Modify production database directly
5. Push directly to `main` branch
6. Ignore ESLint warnings
7. Add large files (>5MB) without LFS
8. Break backward compatibility without notice
9. Deploy without testing on mobile
10. Forget to update documentation

### ✅ Do:
1. Use environment variables for secrets
2. Test in Telegram WebApp before deploying
3. Check mobile responsiveness
4. Update all language files
5. Run linter before committing
6. Write descriptive commit messages
7. Create feature branches
8. Ask for clarification if unsure
9. Document complex logic
10. Follow existing patterns

---

## 📚 Essential Documentation Files

**Must-read before starting:**
- 📘 `README.md` - Project overview
- 📗 `SECURITY.md` - Security guidelines
- 📙 `docs/guides/QUICK_START_DEV.md` - Development setup
- 📕 `docs/guides/DEV_MODE_SETUP.md` - Local environment

**Feature-specific:**
- `docs/features/JACKPOT_MECHANICS_EXPLAINED.md` - Slots jackpot system
- `docs/guides/GAME_INTEGRATION_GUIDE.md` - Adding new games
- `docs/guides/STORAGE_EXPLAINED.md` - Frontend storage patterns

**Admin:**
- `docs/admin/ADMIN_FINAL_SUMMARY.md` - Admin panel usage
- `docs/admin/ADMIN_PASSWORD_INFO.md` - Admin authentication

---

## 🔍 Debugging Tips

### Frontend Issues
```javascript
// Check auth state
console.log('Auth State:', authState);

// Check Telegram WebApp
console.log('Telegram User:', window.Telegram?.WebApp?.initDataUnsafe);

// Check language
console.log('Current Language:', getCurrentLanguage());
```

### API Issues
```bash
# Check API logs (Render dashboard)
# Or local PHP errors:
tail -f /var/log/php_errors.log

# Test endpoint manually:
curl -X GET "https://api.solanatamagotchi.com/api/tama/balance?telegram_id=123"
```

### Bot Issues
```python
# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

# Test translation
print(t("welcome", "ru"))  # Should print Russian text
```

---

## 🎯 Project Goals & Priorities

### Q4 2025 (Current) 🔥
- [x] 13-language localization
- [x] SEO expansion (RU, ZH, JA, KO, ES)
- [ ] Economy balancing
- [ ] Security audit
- [ ] Performance optimization

### Q1 2026 (Next) 🚀
- [ ] Mainnet launch
- [ ] DEX listing (Raydium/Jupiter)
- [ ] Marketing campaign
- [ ] Community events

### Q2 2026 (Future) 💡
- [ ] Mobile apps (iOS/Android)
- [ ] PvP battles
- [ ] NFT breeding system

---

## 🤝 Communication

### When to Ask for Clarification:
- Unclear requirements
- Security implications
- Breaking changes needed
- Large refactoring required
- Translation accuracy concerns

### How to Report Issues:
1. Describe what you observed
2. Show relevant code/logs
3. Explain expected behavior
4. Suggest potential fix if possible

---

## 📞 Key Contacts

- **Repository:** https://github.com/tr1h/huma-chain-xyz
- **Website:** https://solanatamagotchi.com
- **Telegram Bot:** @gotchigamebot
- **Community:** @gotchigamechat

---

## ✨ Final Notes

This is a **live production project** with **real users** and **real crypto**. Every change matters:

- ⚠️ Test thoroughly before deploying
- ⚠️ Never rush security-related code
- ⚠️ Respect the community's trust
- ⚠️ Maintain backward compatibility

**Remember:** When in doubt, check `/docs` or ask for clarification! 🙏

---

**Version:** 1.0  
**Last Updated:** 2025-12-15  
**Maintained by:** Solana Tamagotchi Team
