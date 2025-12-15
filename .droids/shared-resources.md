# 📚 Shared Resources - Droids Team

> **Common knowledge, tools, and references for all Droids**

---

## 🎯 Project URLs

### Production
- **Website:** https://solanatamagotchi.com
- **Telegram Bot:** https://t.me/gotchigamebot
- **Community:** https://t.me/gotchigamechat
- **GitHub:** https://github.com/tr1h/huma-chain-xyz

### Services
- **API:** https://api.solanatamagotchi.com
- **NFT Server:** https://solanatamagotchi-onchain.onrender.com
- **Bot Webhook:** https://huma-chain-xyz-bot.onrender.com

### Admin Dashboards
- **Supabase:** https://supabase.com/dashboard/org/jgcyzejvyjpsfsqvgsdn
- **Render:** https://dashboard.render.com/
- **GitHub:** https://github.com/tr1h/huma-chain-xyz

---

## 📁 Key Project Files (All Droids Should Know)

### Documentation (READ FIRST!)
```
/.droid-context.md              # Quick project overview
/.github/DROID_GUIDELINES.md    # Full developer guide
/README.md                      # Project README
/CONTRIBUTING.md                # Contribution guide
/SECURITY.md                    # Security rules
/docs/                          # Comprehensive docs
```

### Configuration
```
/.env                           # Secrets (NEVER commit!)
/.env.example                   # Template
/.eslintrc.json                 # JavaScript linting
/.prettierrc                    # Code formatting
/package.json                   # Node dependencies
/bot/requirements.txt           # Python dependencies
```

### Core Logic
```
/js/auth.js                     # Authentication system
/js/config.js                   # Frontend configuration
/js/i18n.js                     # Frontend translations
/api/tama_supabase.php          # Main API
/bot/bot.py                     # Telegram bot
/bot/translations.py            # Bot translations
```

---

## 🛠️ Development Tools

### Code Quality
```bash
# Lint JavaScript
npx eslint js/*.js

# Fix JavaScript issues
npx eslint js/*.js --fix

# Format code
npx prettier --write "**/*.{js,html,css,md}"

# Check formatting
npx prettier --check "**/*.{js,html,css}"
```

### Local Development
```bash
# Start API (PHP)
cd api
php -S localhost:8000

# Start Bot (Python)
cd bot
python bot.py

# Start NFT Server (Node.js)
npm start

# Open frontend with Live Server (VS Code)
# Right-click index.html → Open with Live Server
```

### Testing
```bash
# Test API endpoint
curl http://localhost:8000/api/tama/test

# Test bot locally
cd bot
python -c "from bot import *; print('Bot OK')"

# Check for secrets
git diff | grep -i "password|secret|key|token"
```

---

## 🌍 Supported Languages

**All 13 languages** (MUST be updated for ANY text change!):

| Code | Language | Native Name | Notes |
|------|----------|-------------|-------|
| en | English | English | Default |
| ru | Russian | Русский | Large user base |
| zh | Chinese | 中文 | Simplified |
| es | Spanish | Español | Global |
| pt | Portuguese | Português | Brazil focus |
| ja | Japanese | 日本語 | SEO page |
| fr | French | Français | European |
| hi | Hindi | हिंदी | India |
| ko | Korean | 한국어 | SEO page |
| tr | Turkish | Türkçe | Growing |
| de | German | Deutsch | European |
| ar | Arabic | العربية | RTL support |
| vi | Vietnamese | Tiếng Việt | SEA |

### Translation Files
- Frontend: `/js/i18n.js`
- Bot: `/bot/translations.py`, `/bot/bot_translations.py`
- SEO Pages: `/ru/`, `/zh/`, `/ja/`, `/ko/`, `/es/`

---

## 🎮 Game Features Overview

### Games
1. **Lucky Slots** - Slot machine with shared jackpot
2. **Lucky Wheel** - Spin for multipliers
3. **Tamagotchi** - Virtual pet care, earn TAMA
4. **Super Tama Bros** - Platformer game
5. **Tama Shooter** - Space shooter
6. **Tama Color Match** - Puzzle game

### NFT System
- **5 Tiers:** Bronze (2x), Silver (2.5x), Gold (3x), Platinum (4x), Diamond (5x)
- **Mint with:** TAMA or SOL
- **Marketplace:** Buy/sell NFTs
- **Collection ID:** Metaplex collection

### Economy
- **TAMA Token:** In-game currency (Devnet)
- **Earn:** Play games, care for pet, complete quests
- **Spend:** Mint NFTs, play slots/wheel
- **Withdraw:** To Solana wallet (Devnet)
- **Referral:** 10% of referrals' earnings

---

## 📊 Tech Stack Summary

### Frontend
- **Languages:** HTML5, CSS3, JavaScript ES6+
- **No framework:** Vanilla JS for simplicity
- **Libraries:** Solana Web3.js, Wallet Adapter, Telegram SDK

### Backend
- **PHP 7.4+:** REST API (`/api/tama_supabase.php`)
- **Node.js:** NFT minting server (Metaplex)
- **Supabase:** Database client

### Database
- **PostgreSQL** (Supabase managed)
- **Tables:** 20+ (users, transactions, nfts, etc.)
- **RLS:** Row Level Security enabled
- **Migrations:** 30+ SQL files in `/sql/`

### Bot
- **Python 3.9+:** pyTelegramBotAPI
- **Flask:** Webhook server (production)
- **Features:** Gamification, i18n, auto-posting

### Blockchain
- **Solana:** Devnet (mainnet Q1 2026)
- **Metaplex:** NFT standard
- **Token:** SPL Token (TAMA)

### Hosting
- **Frontend:** GitHub Pages + Custom domain
- **API:** Render (api.solanatamagotchi.com)
- **Bot:** Render (webhook)
- **NFT Server:** Render
- **Database:** Supabase cloud

---

## 🔐 Security Guidelines (ALL DROIDS)

### What to NEVER commit
```
❌ .env
❌ API keys, passwords
❌ Private keys (Solana)
❌ Telegram bot token
❌ Database service_role key
❌ Admin password hash
❌ Keypair JSON files
```

### What's safe to commit
```
✅ .env.example (template)
✅ Public API URLs
✅ Supabase anon key (public)
✅ Service IDs (Render)
✅ Code, docs, configs
```

### Before EVERY commit
```bash
# 1. Check for secrets
git diff | grep -i "password|secret|key|token"

# 2. Verify .env not staged
git status | grep ".env"  # Should show nothing

# 3. Review changes
git diff --cached
```

---

## 📞 Emergency Contacts

### Critical Issues
- **Security breach:** Contact immediately, don't commit
- **Site down:** Check Render status, logs
- **Data loss:** Check Supabase backups
- **API errors:** Check Render logs

### Debugging Resources
- **Frontend errors:** Browser console
- **API errors:** Render logs (dashboard)
- **Bot errors:** Render logs (bot service)
- **Database errors:** Supabase logs

---

## 📚 Learning Resources

### Documentation
- **Solana:** https://docs.solana.com/
- **Metaplex:** https://docs.metaplex.com/
- **Supabase:** https://supabase.com/docs
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Telegram WebApp:** https://core.telegram.org/bots/webapps

### Code Examples in Project
- Authentication: `/js/auth.js`
- API calls: `/api/tama_supabase.php`
- NFT minting: `/api/server-onchain.js`
- Bot handlers: `/bot/bot.py`
- Translations: `/bot/translations.py`, `/js/i18n.js`

---

## 🎯 Common Patterns

### API Call (Frontend)
```javascript
async function callAPI(endpoint, data = null) {
  try {
    const options = {
      method: data ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (data) options.body = JSON.stringify(data);
    
    const response = await fetch(`https://api.solanatamagotchi.com/api/tama/${endpoint}`, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}
```

### Translation (Frontend)
```javascript
import { t } from './i18n.js';

const welcomeText = t('welcome_message');
document.getElementById('welcome').textContent = welcomeText;
```

### Translation (Bot)
```python
from translations import t

user_lang = get_user_language(user_id)
text = t("welcome_message", user_lang)
bot.send_message(user_id, text)
```

### Database Query (Backend)
```php
$response = querySupabase('users', [
    'telegram_id' => $telegramId
]);
```

### SQL Migration
```sql
-- Description of change
-- Date: 2025-12-15

CREATE TABLE IF NOT EXISTS new_table (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON new_table
    FOR ALL USING (user_id = auth.uid());
```

---

## ✅ Quality Standards

### Code Quality
- ESLint passes (JavaScript)
- Prettier formatted (all files)
- No console errors
- No warnings ignored
- Comments for complex logic

### Functionality
- Works on mobile (360px+)
- Works on desktop (1920px)
- Works in Telegram WebApp
- All edge cases handled
- Error states graceful

### Internationalization
- All text translated (13 languages)
- Language selector works
- RTL tested (Arabic)
- No hardcoded text

### Security
- Input validated
- XSS prevented
- Secrets in .env
- RLS enabled (database)
- Rate limiting active

### Performance
- Images optimized (<200KB)
- API responses fast (<500ms)
- No layout shifts
- Lazy loading used

---

## 🚀 Deployment Process

### Standard Deployment
```
1. Security Droid: Scan for secrets
2. DevOps Droid: Check environment variables
3. Database Droid: Apply migrations if needed
4. Git push to main
5. Render auto-deploys
6. All Droids: Monitor logs for 10 minutes
```

### Hotfix Deployment
```
1. Fix bug on feature branch
2. Security Droid: Quick review
3. Merge to main
4. Deploy immediately
5. Monitor closely
```

---

## 📊 Project Stats

- **Users:** 1,000+ active
- **Transactions:** 60,000+
- **NFTs:** 104 minted
- **Languages:** 13
- **Code Files:** ~300 (excluding node_modules)
- **Git Commits:** 500+
- **API Endpoints:** 30+
- **Database Tables:** 20+

---

## 🎯 Success Metrics

Project is successful when:
- ✅ Users can play smoothly
- ✅ No critical bugs
- ✅ Performance is fast
- ✅ All 13 languages work
- ✅ Security is tight
- ✅ Deployments are safe
- ✅ Community is happy

---

**Remember:** We're building something real with real users and real money. Quality matters! 🚀

---

**Version:** 1.0  
**Last Updated:** 2025-12-15  
**Maintained by:** Factory Platform
