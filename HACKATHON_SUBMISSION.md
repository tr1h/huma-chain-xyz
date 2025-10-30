# 🐾 Solana Tamagotchi - GotchiGameBot
## Cypherpunk Hackathon Submission

### 📱 **Project Links:**
- **Live Game:** https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html
- **Telegram Bot:** [@GotchiGameBot](https://t.me/GotchiGameBot)
- **GitHub:** https://github.com/tr1h/huma-chain-xyz
- **API Server:** https://huma-chain-xyz-production.up.railway.app/api/tama

---

## 🎯 **Project Description:**

**GotchiGameBot** is a Play-to-Earn (P2E) Tamagotchi game integrated into Telegram, combining:
- 🎮 **Classic Tamagotchi gameplay** with modern Web3 features
- 💰 **TAMA Token** - SPL token on Solana Devnet for in-game rewards
- 🖼️ **NFT Pets** - Collectible pets mintable with TAMA tokens
- 👥 **Referral System** - Earn TAMA by inviting friends
- 🏆 **Leaderboard** - Compete with other players globally

---

## 🏗️ **Technical Architecture:**

### **Frontend:**
- **Technology:** Vanilla JavaScript, HTML5, CSS3
- **Deployment:** GitHub Pages
- **Integration:** Telegram Mini App (WebApp)
- **Responsive:** Mobile-first design optimized for Telegram

### **Backend:**
- **API:** Node.js + Express (deployed on Railway)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Telegram WebApp initData validation

### **Blockchain:**
- **Network:** Solana Devnet
- **Token:** TAMA (SPL Token)
  - Mint Address: `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`
  - Explorer: [View on Solana Explorer](https://explorer.solana.com/address/Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY?cluster=devnet)
- **Wallet:** Phantom Wallet integration for NFT minting

---

## 🎮 **Game Features:**

### **Core Gameplay:**
1. **Pet Care System:**
   - Feed, play, and care for your virtual pet
   - Track Food, Happiness, HP, and Age stats
   - Level up by earning XP through clicks

2. **TAMA Token Economy:**
   - Earn TAMA tokens by clicking your pet
   - Combo system for bonus rewards
   - Daily quests and achievements
   - Spend TAMA on items and NFTs

3. **NFT Minting:**
   - Connect Phantom Wallet
   - Mint unique NFT pets for 1000 TAMA
   - 10 pet types: Cat, Dog, Dragon, Fox, Bear, Rabbit, Panda, Lion, Unicorn, Wolf
   - 5 rarity tiers: Common, Uncommon, Rare, Epic, Legendary
   - View your NFT collection in-game

4. **Social Features:**
   - Referral system: Earn 1000 TAMA per friend
   - Leaderboard: Top players by TAMA and Level
   - Share progress on Telegram

5. **Customization:**
   - 3 visual themes: Kawai, Retro, Premium
   - Multiple pet skins
   - Persistent game state (cloud saves)

---

## 💻 **Technical Implementation:**

### **Smart Contracts & Blockchain:**
```javascript
// TAMA Token (SPL Token)
{
  "mint": "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY",
  "decimals": 9,
  "supply": "1,000,000,000 TAMA",
  "network": "devnet"
}
```

### **API Endpoints:**
```
POST /api/tama/leaderboard/upsert  - Save player progress
POST /api/tama/transactions/log    - Log TAMA transactions
GET  /api/tama/economy/active      - Get economy config
POST /api/tama/referral/save       - Save referral data
```

### **Database Schema:**
- `leaderboard` - Player rankings and stats
- `transactions` - TAMA transaction history
- `user_nfts` - Minted NFT records
- `referrals` - Referral tracking
- `economy_config` - Game economy settings

---

## 🔐 **Security Architecture:**

1. **Frontend:** 
   - Anon Supabase key (SELECT only)
   - All writes through secure API

2. **Backend:**
   - Service role key (server-side only)
   - Input validation & sanitization
   - Rate limiting

3. **Blockchain:**
   - Private keys stored securely (not in repo)
   - Wallet connection via Phantom

---

## 📊 **Current Metrics:**

- **Active Players:** 24+
- **Total TAMA Distributed:** 436,000+
- **Highest Level:** 9
- **Average Session:** 5-10 minutes
- **Platform:** Telegram (Android + iOS + Desktop)

---

## 🚀 **How to Play:**

1. Open Telegram
2. Search for `@GotchiGameBot`
3. Click `/start`
4. Press `🎮 Play Game` button
5. Click your pet to earn TAMA!
6. Level up, complete quests, and mint NFTs!

---

## 🎯 **Roadmap & Future Plans:**

### **Phase 1 (Current):**
- ✅ Core Tamagotchi gameplay
- ✅ TAMA token integration
- ✅ NFT minting system
- ✅ Referral & Leaderboard

### **Phase 2 (Next 2 weeks):**
- 🔄 Real on-chain TAMA transfers
- 🔄 Withdraw TAMA to Phantom wallet
- 🔄 P2P NFT trading marketplace
- 🔄 Staking for passive rewards

### **Phase 3 (1 month):**
- 📅 Mainnet deployment
- 📅 Mobile app (React Native)
- 📅 Tournament mode
- 📅 DAO governance

---

## 👥 **Team:**

- **Developer:** @gotchi_ceo
- **Role:** Full-stack development, Smart contracts, Game design

---

## 🏆 **Why We Should Win:**

1. **Innovation:** First Tamagotchi game fully integrated with Telegram + Solana
2. **User Experience:** Seamless Web2 → Web3 onboarding (no wallet required to start)
3. **Technical Excellence:** Clean architecture, secure API, real blockchain integration
4. **Market Fit:** Telegram has 900M+ users, gaming is proven use case
5. **Traction:** 24+ active players in beta, positive feedback

---

## 📝 **License:**

MIT License

---

## 🔗 **Additional Resources:**

- **Demo Video:** [Coming soon]
- **Pitch Deck:** [Coming soon]
- **API Documentation:** See `/api/README.md`
- **Deployment Guide:** See `/DEPLOY_INSTRUCTIONS_RU.md`

---

**Built with ❤️ for Cypherpunk Hackathon 2025**

*Bringing Web3 gaming to the masses, one pet at a time!* 🐾

