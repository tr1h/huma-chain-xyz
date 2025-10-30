# 🐾 Solana Tamagotchi - GotchiGameBot

<div align="center">

![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana)
![Telegram](https://img.shields.io/badge/Telegram-Bot-26A5E4?style=for-the-badge&logo=telegram)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway)

**Play-to-Earn Tamagotchi game on Telegram with Solana blockchain integration**

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

### 🖼️ **NFT System**
- **Mint NFT Pets:** Create unique collectibles for 1000 TAMA
- **Phantom Wallet:** Connect and manage your NFTs
- **5 Rarity Tiers:** Common to Legendary
- **On-Chain Records:** Stored on Solana blockchain

### 👥 **Social Features**
- **Referral System:** Earn 1000 TAMA per friend invited
- **Global Leaderboard:** Compete with players worldwide
- **Share Progress:** Post achievements on Telegram

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Telegram Bot   │
│  (@GotchiGameBot)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   GitHub Pages  │◄────►│  Railway API │
│   (Frontend)    │      │  (Backend)   │
└────────┬────────┘      └──────┬───────┘
         │                      │
         ▼                      ▼
┌─────────────────┐      ┌──────────────┐
│  Solana Devnet  │      │   Supabase   │
│  (TAMA Token)   │      │  (Database)  │
└─────────────────┘      └──────────────┘
```

---

## 🚀 Quick Start

### **For Players:**

1. Open Telegram
2. Search for **[@GotchiGameBot](https://t.me/GotchiGameBot)**
3. Click `/start`
4. Press **🎮 Play Game**
5. Start earning TAMA!

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

# Install API dependencies
cd api
npm install

# Install Bot dependencies
cd ../bot
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

#### **Run Locally:**

```bash
# Terminal 1: Start API
cd api
node tama_supabase_api.js

# Terminal 2: Start Bot
cd bot
python bot.py
```

---

## 📚 Documentation

### **Project Structure:**
```
huma-chain-xyz/
├── api/                      # Backend API (Node.js)
│   ├── tama_supabase_api.js  # Main API server
│   ├── package.json
│   └── README.md
├── bot/                      # Telegram Bot (Python)
│   ├── bot.py                # Main bot script
│   ├── gamification.py       # Game logic
│   └── requirements.txt
├── docs/                     # Frontend (GitHub Pages)
│   ├── tamagotchi-game.html  # Main game UI
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript modules
│   └── assets/               # Images & resources
├── tama-token-info.json      # TAMA token metadata
└── README.md                 # This file
```

### **Key Files:**
- **Game Logic:** `docs/tamagotchi-game.html`
- **Telegram Bot:** `bot/bot.py`
- **API Server:** `api/tama_supabase_api.js`
- **Token Info:** `tama-token-info.json`

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
3. Live at: `https://tr1h.github.io/huma-chain-xyz/`

### **Backend (Railway):**
1. Connect GitHub repo to Railway
2. Set environment variables
3. Deploy automatically on push

### **Bot (Any VPS):**
```bash
cd bot
python bot.py
```

**See [DEPLOY_INSTRUCTIONS_RU.md](DEPLOY_INSTRUCTIONS_RU.md) for detailed guide.**

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
- **Railway** - For API hosting

---

## 📞 Contact

- **Telegram:** [@gotchi_ceo](https://t.me/gotchi_ceo)
- **Bot:** [@GotchiGameBot](https://t.me/GotchiGameBot)
- **GitHub:** [tr1h](https://github.com/tr1h)

---

<div align="center">

**Made with ❤️ for the Cypherpunk Hackathon 2025**

⭐ Star us on GitHub — it helps!

[🎮 Start Playing](https://t.me/GotchiGameBot) • [📖 Docs](#-documentation) • [🐛 Report Bug](https://github.com/tr1h/huma-chain-xyz/issues)

</div>
