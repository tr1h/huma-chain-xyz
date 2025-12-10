# 🎮 Solana Tamagotchi - Play-to-Earn Game

[![Live Demo](https://img.shields.io/badge/Live-solanatamagotchi.com-blue)](https://solanatamagotchi.com)
[![Telegram Bot](https://img.shields.io/badge/Telegram-@gotchigamebot-blue)](https://t.me/gotchigamebot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A blockchain-based Tamagotchi game on Solana with Play-to-Earn mechanics, NFT pets, and mini-games.

## 🚀 Features

### 🎰 Games
- **Lucky Slots** - Slot machine with shared jackpot pool
- **Lucky Wheel** - Spin the wheel for multipliers
- **Tamagotchi** - Care for your virtual pet, earn TAMA

### 💎 NFT System
- **5 Tiers**: Bronze, Silver, Gold, Platinum, Diamond
- **Earning Multipliers**: 2x - 5x boost
- **Mint with TAMA or SOL**

### 💰 Economy
- **TAMA Token** - In-game currency
- **Referral System** - Earn 10% of referrals' earnings
- **Daily Rewards** - Login bonuses
- **Leaderboard** - Compete for top spots

### 🔐 Security
- Telegram WebApp authentication
- Wallet connection (Phantom, Solflare)
- Admin panels with password protection
- Transaction logging & monitoring

## 📁 Project Structure

```
C:\goooog\
├── 📄 Frontend (Root)
│   ├── index.html              # Landing page
│   ├── tamagotchi-game.html    # Main game
│   ├── slots.html              # Lucky Slots
│   ├── wheel.html              # Lucky Wheel
│   ├── mint.html               # NFT Minting
│   ├── marketplace.html        # NFT Marketplace
│   ├── profile.html            # User Profile
│   └── ...
│
├── 📁 api/                     # Backend API (PHP)
│   ├── tama_supabase.php       # Main API
│   ├── telegram_auth.php       # Auth
│   └── mint-nft-*.php          # NFT minting
│
├── 📁 bot/                     # Telegram Bot (Python)
│   ├── bot.py                  # Main bot
│   ├── translations.py         # i18n
│   └── auto_posting.py         # Auto-posts
│
├── 📁 admin/                   # Admin Panels
│   ├── super-admin.html        # Main dashboard
│   ├── transactions-admin.html # Transactions
│   ├── treasury-monitor.html   # Treasury
│   └── ...
│
├── 📁 docs/                    # 📚 Documentation
│   ├── guides/                 # Setup guides
│   ├── reports/                # Analytics
│   ├── features/               # Feature docs
│   ├── colosseum/              # Hackathon
│   ├── video/                  # Video scripts
│   └── sora2/                  # AI prompts
│
├── 📁 assets/                  # Images & media
├── 📁 css/                     # Stylesheets
├── 📁 js/                      # JavaScript
├── 📁 nft-assets/              # NFT images
├── 📁 sql/                     # Database scripts
└── 📁 supabase/                # Database config
```

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP (REST API)
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: Solana (Devnet)
- **Bot**: Python (pyTelegramBotAPI)
- **Hosting**: 
  - Frontend: GitHub Pages
  - API: Render
  - Bot: Render

## 📖 Documentation

### Quick Start
- [Quick Start Guide](docs/guides/QUICK_START_DEV.md)
- [Dev Mode Setup](docs/guides/DEV_MODE_SETUP.md)
- [Security Setup](docs/guides/SECURITY_SETUP.md)

### Features
- [Jackpot Mechanics](docs/features/JACKPOT_MECHANICS_EXPLAINED.md)
- [Game Integration](docs/guides/GAME_INTEGRATION_GUIDE.md)
- [Storage System](docs/guides/STORAGE_EXPLAINED.md)

### Reports
- [Analytics Report](docs/reports/ANALYTICS_REPORT.md)
- [Transaction Audit](docs/reports/TRANSACTION_AUDIT_REPORT.md)
- [Balance Sync](docs/reports/BALANCE_SYNC.md)

### Admin
- [Admin Guide](docs/admin/ADMIN_FINAL_SUMMARY.md)
- [Password Info](docs/admin/ADMIN_PASSWORD_INFO.md)

## 🚀 Getting Started

### Prerequisites
- Node.js (for package management)
- Python 3.9+ (for bot)
- Supabase account
- Telegram Bot Token

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tr1h/huma-chain-xyz.git
cd huma-chain-xyz
```

2. **Install dependencies**
```bash
npm install
cd bot
pip install -r requirements.txt
```

3. **Configure environment**
```bash
# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

4. **Run locally**
```bash
# Frontend: Open index.html in browser
# API: Deploy to Render or local PHP server
# Bot: python bot/bot.py
```

## 🎮 How to Play

1. **Start**: Open [@gotchigamebot](https://t.me/gotchigamebot) in Telegram
2. **Play**: Click "Play Game" to start
3. **Earn**: Play mini-games, care for your pet, complete quests
4. **Mint**: Buy NFT pets to boost earnings (2x-5x)
5. **Withdraw**: Connect wallet to withdraw TAMA

## 📊 Game Stats

- **Total Transactions**: 60,000+
- **Active Users**: 14+
- **NFTs Minted**: 104
- **Total TAMA Earned**: 2,455 TAMA
- **Total TAMA Spent**: 315,000 TAMA

## 🔗 Links

- **Website**: [solanatamagotchi.com](https://solanatamagotchi.com)
- **Telegram Bot**: [@gotchigamebot](https://t.me/gotchigamebot)
- **Twitter**: [@GotchiGame](https://twitter.com/GotchiGame)
- **Community**: [Telegram Chat](https://t.me/gotchigamechat)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 🙏 Acknowledgments

- Built for Colosseum Hackathon
- Powered by Solana blockchain
- Inspired by classic Tamagotchi games

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/tr1h/huma-chain-xyz/issues)
- **Email**: support@solanatamagotchi.com
- **Telegram**: [@gotchigamechat](https://t.me/gotchigamechat)

---

Made with ❤️ by the Solana Tamagotchi Team
