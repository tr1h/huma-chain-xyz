# 🐾 Solana Tamagotchi - GotchiGameBot

<div align="center">

![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana)
![Telegram](https://img.shields.io/badge/Telegram-Bot-26A5E4?style=for-the-badge&logo=telegram)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

**Play-to-Earn Tamagotchi game on Telegram with Solana blockchain integration**

> 🔄 **Latest Update (Nov 2025):** Migrated to Render.com with Keep-Alive • 3-Tier NFT System • On-Chain Revenue Distribution

[🎮 Play Now](https://t.me/GotchiGameBot) • [📖 Documentation](#-documentation) • [🚀 Deploy](#-deployment)

</div>

---

## 🌟 Features

### 🎮 **Core Gameplay**
- **Virtual Pet Care:** Feed, play, and nurture your Gotchi
- **Level System:** Earn XP and level up through gameplay
- **Stats Tracking:** Monitor Food, Happiness, HP, and Age
- **Multiple Themes:** Kawai, Retro, and Premium visual styles
- **10 Pet Types:** Cat, Dog, Dragon, Fox, Bear, and more!

### 💰 **Play-to-Earn Economy**
- **TAMA Token:** Earn SPL tokens on Solana Devnet
- **Combo System:** Bonus rewards for consecutive clicks
- **Daily Quests:** Complete challenges for extra TAMA
- **Achievements:** Unlock badges and milestones

### 🖼️ **NFT System (3-Tier)**
- **Bronze NFT (2,500 TAMA or 0.05 SOL):** 2-3x earning boost
- **Silver NFT (0.1 SOL):** 2.5-3.5x earning boost
- **Gold NFT (0.2 SOL):** 3-4x earning boost
- **5 Rarity Levels:** Common → Uncommon → Rare → Epic → Legendary
- **On-Chain Revenue Distribution:** 40% Burn, 30% Treasury, 30% P2E Pool
- **Phantom Wallet Integration:** SOL payments on Solana blockchain

### 👥 **Social Features**
- **Referral System:** Earn 1000 TAMA per friend invited
- **Global Leaderboard:** Compete with players worldwide
- **Share Progress:** Post achievements on Telegram

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Telegram Bot   │  ← Webhook Mode (Render Web Service)
│  (@GotchiGameBot)│  ← Keep-Alive (ping every 5 min)
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   GitHub Pages  │◄────►│  Render API  │  ← PHP + Apache
│   (Frontend)    │      │  (Backend)   │  ← Keep-Alive enabled
└────────┬────────┘      └──────┬───────┘
         │                      │
         ▼                      ▼
┌─────────────────┐      ┌──────────────┐
│  Solana Devnet  │      │   Supabase   │
│  (TAMA Token)   │      │  (PostgreSQL)│
│  (SPL Transfers)│      │  (Database)  │
└─────────────────┘      └──────────────┘
```

**Key Features:**
- ✅ **Webhook Mode:** Instant bot responses (no polling)
- ✅ **Keep-Alive:** Prevents Render Free tier from sleeping (ping every 5 min)
- ✅ **On-Chain Transactions:** Real SPL token transfers for NFT revenue distribution
- ✅ **CORS Configured:** Seamless frontend-backend communication

---

## 🚀 Quick Start

### **For Players:**

1. Open Telegram
2. Search for **[@GotchiGameBot](https://t.me/GotchiGameBot)**
3. Click `/start`
4. Press **🎮 Play Game** (opens tamagotchi-game.html)
5. Start earning TAMA tokens!

**🌐 Or play directly in browser:**
- https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html

### **For Developers:**

#### **Prerequisites:**
- Node.js 18+
- Python 3.10+
- Git
- Telegram Bot Token
- Supabase Account

#### **Installation:**

```bash
# Clone repository
git clone https://github.com/tr1h/huma-chain-xyz.git
cd huma-chain-xyz

# Install Bot dependencies
cd bot
pip install -r requirements.txt

# Configure environment
# Create .env file in bot/ directory
# See PHP_API_SETUP.md for PHP API configuration
```

#### **Run Locally:**

```bash
# Terminal 1: Start PHP API (requires PHP server)
# Option 1: Using PHP built-in server
cd api
php -S localhost:8000 tama_supabase.php

# Option 2: Using XAMPP/WAMP/MAMP
# Place api/ folder in htdocs/ and access via http://localhost/api/tama_supabase.php

# Terminal 2: Start Bot
cd bot
python bot.py
```

**📖 See [PHP_API_SETUP.md](PHP_API_SETUP.md) for detailed PHP API setup instructions.**

---

## 📚 Documentation

### **Project Structure:**
```
huma-chain-xyz/
├── 🌐 FRONTEND (GitHub Pages - all in root!)
│   ├── tamagotchi-game.html  # ⭐ Main game UI (403KB)
│   ├── telegram-game.html    # Telegram Web App version
│   ├── mint.html             # NFT Mint page
│   ├── admin-tokenomics.html # Tokenomics admin panel
│   ├── super-admin.html      # Super admin panel
│   ├── referral.html         # Referral system
│   ├── s.html                # Short link
│   ├── index.html            # Landing page
│   └── [10+ more HTML pages]
│
├── 🛠️ BACKEND
│   ├── api/
│   │   └── tama_supabase.php # PHP API (REST API, withdrawal, mint, send)
│   │
│   ├── bot/                  # NOT PUBLISHED (server-only)
│   │   ├── bot.py            # Telegram Bot (@GotchiGameBot)
│   │   └── start_bot.ps1     # PowerShell launch script
│   │
│   └── sql/
│       └── update_burn_stats_function.sql
│
├── 🔧 CONFIG
│   ├── package.json
│   ├── tokenomics.json       # Tokenomics parameters
│   └── *.json               # Keypairs (not published!)
│
└── 📚 DOCUMENTATION (.docs/)
    ├── README.md             # This file
    ├── ADDRESSES_AND_ALLOCATIONS.md  # All addresses and allocations
    ├── VESTING_STREAM_ID.md  # Team vesting info
    ├── TOKENOMICS_FINAL.md   # Tokenomics guide
    └── [20+ more docs]
```

### **Key Files:**
- **Game Logic:** `tamagotchi-game.html` (in root!)
- **Telegram Bot:** `bot/bot.py`
- **API Server:** `api/tama_supabase.php`
- **Token Info:** `tama-token-info.json`
- **Admin Panel:** `admin-tokenomics.html`
- **Tokenomics Dashboard:** `admin-tokenomics.html` (real-time stats)

### **📖 Additional Documentation:**
- **[Tokenomics & Distribution](.docs/ADDRESSES_AND_ALLOCATIONS.md)** - Complete token distribution breakdown
- **[Vesting Information](.docs/VESTING_STREAM_ID.md)** - Team tokens vesting details
- **[Tokenomics Guide](.docs/TOKENOMICS_FINAL.md)** - Full tokenomics explanation
- **[Next Steps Plan](.docs/NEXT_STEPS_PLAN.md)** - Roadmap and future plans

---

## 🪙 TAMA Token

### **Token Details:**
```json
{
  "name": "Solana Tamagotchi",
  "symbol": "TAMA",
  "mint": "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY",
  "decimals": 9,
  "supply": "1,000,000,000 TAMA",
  "network": "devnet"
}
```

**[View on Solana Explorer →](https://explorer.solana.com/address/Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY?cluster=devnet)**

---

### **💰 Tokenomics & Distribution**

#### **Total Supply:** 1,000,000,000 TAMA

| Category | Amount | Percentage | Status | Description |
|----------|--------|-------------|--------|-------------|
| **P2E Pool** | 400,000,000 | 40% | ✅ Active | Play-to-Earn rewards pool (5.5 years distribution) |
| **Team** | 200,000,000 | 20% | 🔒 Locked | Team allocation (vesting 4 years, 6-month cliff) |
| **Marketing** | 150,000,000 | 15% | ✅ Active | Marketing & partnerships |
| **Liquidity** | 100,000,000 | 10% | 🔒 Locked | DEX liquidity (Raydium, Jupiter) |
| **Community** | 100,000,000 | 10% | ✅ Active | Community rewards & airdrops |
| **Reserve** | 50,000,000 | 5% | 🔒 Locked | Reserve fund (emergency) |

#### **🔒 Team Tokens Vesting (Transparency)**

**Stream ID:** `3tEskbJxeGyz4svTYAUscMiHghriZ2U7Ug6XLBeK82jm`

- **Amount:** 200,000,000 TAMA (20%)
- **Duration:** 4 years (48 months)
- **Cliff:** 6 months (0% unlocked during cliff)
- **Start Date:** May 6, 2026
- **End Date:** May 4, 2030
- **Recipient:** `AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR`

**[View Vesting Stream on Solscan →](https://solscan.io/account/3tEskbJxeGyz4svTYAUscMiHghriZ2U7Ug6XLBeK82jm?cluster=devnet)**

**Why Vesting?**
- ✅ Protects investors from team dumping
- ✅ Ensures long-term commitment
- ✅ Standard practice in DeFi projects
- ✅ Fully transparent on blockchain

#### **💧 P2E Pool Distribution**

The 400M TAMA pool is distributed over **5.5 years** with halving schedule:

- **Year 1 H1:** 200M TAMA (Daily: 800K/day)
- **Year 1 H2:** 100M TAMA (Daily: 392K/day)
- **Year 2 H1:** 50M TAMA (Daily: 200K/day)
- **Year 2 H2:** 25M TAMA (Daily: 98K/day)
- **Year 3+:** Gradual reduction

**Fee Recycling:**
- 60% of withdrawal fees → Burned
- 30% of withdrawal fees → Back to P2E Pool
- 10% of withdrawal fees → Team

This ensures **infinite mining** after the initial 5.5 years!

#### **🔒 Locked Pools**

- **Liquidity (100M):** Locked for DEX liquidity provision (mainnet: DEX lock)
- **Reserve (50M):** Locked for emergency use (mainnet: Multi-sig wallet)

**Full transparency:** All addresses and allocations are publicly verifiable on-chain.

---

## 🔧 Configuration

### **Environment Variables:**

#### **API (`api/.env`):**
```env
PORT=8002
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
```

#### **Bot (`bot/.env`):**
```env
TELEGRAM_BOT_TOKEN=your_bot_token
BOT_USERNAME=GotchiGameBot
GAME_URL=https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

---

## 🛠️ Deployment

### **Frontend (GitHub Pages):**
1. Push to `main` branch
2. GitHub Actions auto-deploys
3. **Live URLs:**
   - 🎮 **Game:** https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html
   - 🎨 **Mint NFT:** https://tr1h.github.io/huma-chain-xyz/mint.html
   - 📊 **Tokenomics Dashboard:** https://tr1h.github.io/huma-chain-xyz/admin-tokenomics.html
   - 🏆 **Super Admin:** https://tr1h.github.io/huma-chain-xyz/super-admin.html
   - 🔗 **Referral:** https://tr1h.github.io/huma-chain-xyz/referral.html
   - 🏠 **Landing:** https://tr1h.github.io/huma-chain-xyz/

### **Backend (PHP API):**
```bash
# Start PHP API server
cd api
.\start_api.ps1

# API will be available at:
# http://localhost:8002/api/tama
```

**API Endpoints:**
- `GET /api/tama/test` - Health check
- `GET /api/tama/balance?telegram_id=XXX` - Get user balance
- `POST /api/tama/withdrawal/request` - Request withdrawal
- `GET /api/tama/withdrawal/history?telegram_id=XXX` - Withdrawal history
- `POST /api/tama/mint` - Mint new tokens (admin)
- `POST /api/tama/send` - Send tokens (admin)
- `GET /api/tama/holders` - List all token holders
- `GET /api/tama/pools` - Pool distribution stats

### **Backend API (Render):**

**Live API:** https://huma-chain-xyz.onrender.com/api/tama

**Deployment:**
1. Connect GitHub repo to Render
2. Set environment variables (see `render.yaml`)
3. Auto-deploys on push to `main`
4. Apache + PHP 8.2 + Solana CLI

**Environment Variables:**
```env
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=your_service_key
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PAYER_KEYPAIR={"keypair":"json"}
SOLANA_P2E_POOL_KEYPAIR={"keypair":"json"}
```

### **Bot (Render Web Service - Webhook Mode):**

**Live Bot:** https://huma-chain-xyz-bot.onrender.com

**Deployment:**
1. Connect GitHub repo to Render
2. Set service type: **Web Service** (not Worker!)
3. Set environment variables (see `render.yaml`)
4. Auto-deploys on push to `main`

**Environment Variables:**
```env
TELEGRAM_BOT_TOKEN=your_bot_token
BOT_USERNAME=GotchiGameBot
GAME_URL=https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html?v=20251108
RENDER_EXTERNAL_HOSTNAME=huma-chain-xyz-bot.onrender.com
RENDER=true  # Enables Keep-Alive
TAMA_API_BASE=https://huma-chain-xyz.onrender.com/api/tama
SUPABASE_URL=your_url
SUPABASE_KEY=your_anon_key
```

**Keep-Alive Feature:**
- Pings bot health endpoint every 5 minutes
- Pings API health endpoint every 5 minutes
- Prevents Render Free tier from sleeping
- Logs: "✅ Keep-Alive: Bot pinged successfully"

**See [.docs/KEEP_ALIVE_SETUP.md](.docs/KEEP_ALIVE_SETUP.md) for detailed guide.**

---

## 📊 Database Schema

### **Supabase Tables:**

#### **`leaderboard`:**
```sql
- id (bigint, PK)
- telegram_id (text)
- wallet_address (text)
- tama (numeric)
- level (int)
- xp (int)
- pet_name (text)
- pet_type (text)
- pet_data (jsonb)
- updated_at (timestamp)
```

#### **`user_nfts`:**
```sql
- id (bigint, PK)
- telegram_id (text)
- wallet_address (text)
- mint_address (text)
- pet_type (text)
- rarity (text)
- cost_tama (numeric)
- cost_sol (numeric)
- created_at (timestamp)
```

#### **`transactions`:**
```sql
- id (bigint, PK)
- telegram_id (text)
- amount (numeric)
- type (text)
- description (text)
- created_at (timestamp)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Solana Foundation** - For the amazing blockchain platform
- **Telegram** - For the Bot API and Mini Apps framework
- **Supabase** - For the backend infrastructure
- **Render.com** - For API and bot hosting

---

## 📊 Project Status

### **✅ Completed:**
- ✅ Full-stack game (Web + Telegram Bot)
- ✅ TAMA SPL Token on Solana Devnet
- ✅ 3-Tier NFT system (Bronze/Silver/Gold)
- ✅ On-chain revenue distribution (SPL transfers)
- ✅ 2-level referral system
- ✅ Tokenomics dashboard (real-time stats)
- ✅ Team tokens vesting (4 years, 6-month cliff)
- ✅ Token distribution (all pools allocated)
- ✅ Withdrawal system (real Solana transactions)
- ✅ PHP API (REST API, withdrawal, admin functions)
- ✅ Webhook mode for bot (instant responses)
- ✅ Keep-Alive system (prevents sleeping)

### **🚀 Current Status:**
- **Devnet:** ✅ Fully operational
- **Mainnet:** ⏳ Ready for launch (awaiting final testing)

### **📈 Tokenomics:**
- **Total Supply:** 1,000,000,000 TAMA
- **Circulating:** Dynamic (based on withdrawals)
- **P2E Pool:** 400M TAMA (5.5 years distribution)
- **Team Vesting:** 200M TAMA (locked 4 years)
- **Fee Recycling:** 60% burn, 30% pool, 10% team

---

## 📞 Contact

- **Telegram:** [@gotchi_ceo](https://t.me/gotchi_ceo)
- **Bot:** [@GotchiGameBot](https://t.me/GotchiGameBot)
- **GitHub:** [tr1h](https://github.com/tr1h)
- **Twitter:** [@GotchiGame](https://x.com/GotchiGame)

---

## 🆕 Latest Updates (November 2025)

### **Migration to Render.com**
- ✅ API migrated from Railway to Render
- ✅ Bot migrated to Render Web Service (webhook mode)
- ✅ Keep-Alive implemented (5 min ping interval)
- ✅ All CORS issues resolved

### **3-Tier NFT System**
- ✅ Bronze NFT: 2,500 TAMA or 0.05 SOL
- ✅ Silver NFT: 0.1 SOL (SOL only)
- ✅ Gold NFT: 0.2 SOL (SOL only)
- ✅ Random rarity assignment (Common to Legendary)
- ✅ Earning multipliers: 2-4x boost

### **On-Chain Revenue Distribution**
- ✅ Bronze TAMA mints: 40% Burn, 30% Treasury, 30% P2E Pool
- ✅ Real SPL token transfers via `spl-token CLI`
- ✅ All distributions logged in `transactions` table

### **Infrastructure Improvements**
- ✅ Webhook mode for instant bot responses
- ✅ Apache + PHP 8.2 for API stability
- ✅ Solana CLI integrated in Docker
- ✅ Environment-based keypair loading

**📚 See [.docs/](.docs/) for detailed documentation:**
- [KEEP_ALIVE_SETUP.md](.docs/KEEP_ALIVE_SETUP.md) - Keep-Alive configuration
- [TEST_ALL_ENDPOINTS.md](.docs/TEST_ALL_ENDPOINTS.md) - Testing guide
- [BRONZE_NFT_ONCHAIN_READY.md](.docs/BRONZE_NFT_ONCHAIN_READY.md) - On-chain distribution
- [PROJECT_LEVEL_ASSESSMENT.md](.docs/PROJECT_LEVEL_ASSESSMENT.md) - Technical assessment

---

<div align="center">

**Made with ❤️ for the Cypherpunk Hackathon 2025**

⭐ Star us on GitHub — it helps!

[🎮 Start Playing](https://t.me/GotchiGameBot) • [📖 Docs](#-documentation) • [🐛 Report Bug](https://github.com/tr1h/huma-chain-xyz/issues)

</div>
