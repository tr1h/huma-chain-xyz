# 🤖 Droids Team - Solana Tamagotchi

> **Specialized AI assistants working together on the project**

---

## 🎯 Overview

This directory contains configuration for **7 specialized Droids** that collaborate to build and maintain the Solana Tamagotchi project. Each Droid has its own expertise area and works with others to deliver high-quality code.

---

## 👥 Team Structure

```
                    ┌─────────────────┐
                    │  Product Droid  │ (You - Project Manager)
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
    ┌───────▼──────┐  ┌─────▼─────┐  ┌──────▼───────┐
    │   Frontend   │  │  Backend  │  │   Bot Droid  │
    │    Droid     │  │   Droid   │  │              │
    └───────┬──────┘  └─────┬─────┘  └──────┬───────┘
            │                │                │
            └────────┬───────┴────────┬───────┘
                     │                │
            ┌────────▼──────┐  ┌─────▼─────┐
            │   Database    │  │   i18n    │
            │     Droid     │  │   Droid   │
            └────────┬──────┘  └─────┬─────┘
                     │                │
            ┌────────▼────────────────▼───────┐
            │                                  │
    ┌───────▼──────┐              ┌───────────▼────┐
    │   Security   │              │    DevOps      │
    │    Droid     │              │     Droid      │
    └──────────────┘              └────────────────┘
```

---

## 🤖 Droids List

### 1. 🎨 Frontend Droid
**File:** `01-frontend-droid.md`  
**Expertise:** HTML, JavaScript, CSS, UI/UX  
**Responsibilities:**
- Game interfaces
- Responsive design
- Telegram WebApp integration
- Wallet UI
- Animations

**Key Skills:**
- Vanilla JavaScript (ES6+)
- CSS3 animations
- Mobile-first design
- Solana Wallet Adapter
- Telegram SDK

---

### 2. 🔧 Backend Droid
**File:** `02-backend-droid.md`  
**Expertise:** PHP, Node.js, Solana Web3  
**Responsibilities:**
- REST API development
- NFT minting (Metaplex)
- Blockchain transactions
- API security
- Performance optimization

**Key Skills:**
- PHP REST API
- Node.js + Express
- Solana Web3.js
- Metaplex SDK
- API design

---

### 3. 🤖 Bot Droid
**File:** `03-bot-droid.md`  
**Expertise:** Python, Telegram Bot API  
**Responsibilities:**
- Telegram bot development
- Gamification systems
- User commands
- Daily rewards
- Auto-posting

**Key Skills:**
- Python 3.9+
- pyTelegramBotAPI
- Flask webhooks
- Bot UI design
- Command handlers

---

### 4. 🗄️ Database Droid
**File:** `04-database-droid.md`  
**Expertise:** PostgreSQL, Supabase  
**Responsibilities:**
- Schema design
- SQL migrations
- RLS policies
- Query optimization
- Data integrity

**Key Skills:**
- PostgreSQL
- Supabase
- SQL migrations
- Triggers & functions
- Performance tuning

---

### 5. 🌍 i18n Droid
**File:** `05-i18n-droid.md`  
**Expertise:** Localization, 13 languages  
**Responsibilities:**
- All translations (13 languages)
- SEO landing pages
- Cultural adaptation
- Consistency checks
- Translation testing

**Key Skills:**
- Multi-language support
- SEO optimization
- Cultural awareness
- Translation management
- UTF-8 encoding

**Languages:** EN, RU, ZH, ES, PT, JA, FR, HI, KO, TR, DE, AR, VI

---

### 6. 🔐 Security Droid
**File:** `06-security-droid.md`  
**Expertise:** Security, Auditing  
**Responsibilities:**
- Code security audits
- Secrets management
- Input validation
- Vulnerability scanning
- Security best practices

**Key Skills:**
- Security auditing
- Secrets detection
- OWASP guidelines
- Penetration testing
- Compliance

---

### 7. 🚀 DevOps Droid
**File:** `07-devops-droid.md`  
**Expertise:** Deployment, CI/CD  
**Responsibilities:**
- Render deployments
- GitHub Actions
- Monitoring & logging
- Performance tracking
- Infrastructure

**Key Skills:**
- Render platform
- GitHub Pages
- CI/CD pipelines
- Logging systems
- Performance monitoring

---

## 🔄 How Droids Collaborate

### Communication Flow

1. **You (Product Droid)** assigns tasks to specific Droids
2. **Droids** check with relevant teammates before making changes
3. **Cross-cutting concerns** involve multiple Droids:
   - New feature = Frontend + Backend + i18n + Database
   - Bug fix = identify owner + Security review
   - Deployment = DevOps + Security check

### Collaboration Rules

See `collaboration-rules.md` for detailed interaction patterns.

### Shared Resources

See `shared-resources.md` for common knowledge and tools.

---

## 📋 How to Use

### Assigning Tasks

**Example 1: Add new game**
```
@Frontend-Droid: Create UI for new puzzle game
@Backend-Droid: Add API endpoint for game scores
@i18n-Droid: Translate game text to 13 languages
@Database-Droid: Create table for game statistics
```

**Example 2: Fix bug**
```
@Security-Droid: Audit the withdrawal function
@Backend-Droid: Fix balance calculation bug
@Database-Droid: Check transaction integrity
```

**Example 3: Deploy update**
```
@Security-Droid: Scan for secrets in commits
@DevOps-Droid: Deploy to Render
@Reliability-Droid: Monitor for errors
```

---

## 🎯 Best Practices

### 1. **Always specify which Droid**
❌ Bad: "Fix the frontend"  
✅ Good: "@Frontend-Droid: Fix mobile menu alignment"

### 2. **Cross-check with relevant Droids**
If Frontend changes require API updates:
- Frontend Droid checks with Backend Droid
- If DB schema changes, Database Droid involved

### 3. **Security first**
Before deploying:
- Security Droid reviews changes
- DevOps Droid checks configurations

### 4. **i18n is mandatory**
Any text change:
- i18n Droid must update ALL 13 languages
- No exceptions!

### 5. **Documentation**
Every Droid documents their changes:
- Code comments
- Update relevant docs
- Commit messages

---

## 🚀 Quick Start

1. **Read this README** ✅
2. **Review each Droid's config** (01-07 files)
3. **Check collaboration rules** (`collaboration-rules.md`)
4. **Review shared resources** (`shared-resources.md`)
5. **Start assigning tasks!**

---

## 📞 Emergency Contacts

**Critical issues:**
- Security breach → @Security-Droid (immediate)
- Site down → @DevOps-Droid (immediate)
- Data corruption → @Database-Droid (urgent)

**Non-critical:**
- Feature requests → Plan with @Product-Droid
- Bug reports → Assign to relevant Droid
- Questions → Ask appropriate specialist

---

## 📊 Droid Status Dashboard

Track what each Droid is working on:

| Droid | Current Task | Status | ETA |
|-------|-------------|--------|-----|
| Frontend | - | Idle | - |
| Backend | - | Idle | - |
| Bot | - | Idle | - |
| Database | - | Idle | - |
| i18n | - | Idle | - |
| Security | - | Idle | - |
| DevOps | - | Idle | - |

*(Update this manually as you assign tasks)*

---

## 🎓 Training Materials

Each Droid has been trained on:
- ✅ Project architecture (`.droid-context.md`)
- ✅ Developer guidelines (`.github/DROID_GUIDELINES.md`)
- ✅ Security rules (`SECURITY.md`)
- ✅ Contributing guide (`CONTRIBUTING.md`)
- ✅ Project README (`README.md`)
- ✅ Documentation (`/docs`)

---

## ⚙️ Customization

To add new Droids:
1. Create `0X-droid-name.md` in `.droids/`
2. Follow the template from existing Droids
3. Update this README
4. Update `collaboration-rules.md`

---

## 📝 Version History

- **v1.0** (2025-12-15): Initial Droids team setup
  - 7 specialized Droids
  - Collaboration rules
  - Shared resources

---

**Remember:** Droids are tools to help you work faster. You're still the Product Manager making final decisions! 🎯

---

**Made with 🤖 by the Factory Platform**
