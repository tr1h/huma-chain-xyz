# 🗺️ User Flow Diagram - Solana Tamagotchi

## 🎯 **3 точки входа:**

```
┌────────────────────────────────────────────────────────────────┐
│                    ENTRY POINTS                                 │
├────────────────────────────────────────────────────────────────┤
│  1️⃣ Landing Page (tr1h.github.io/huma-chain-xyz/landing.html)│
│  2️⃣ Telegram Bot (@GotchiGameBot)                              │
│  3️⃣ Direct Game Link (shared by friend)                        │
└────────────────────────────────────────────────────────────────┘
```

---

## 🚀 **FLOW 1: Через Landing Page**

```
🌐 Landing (landing.html)
   - Красивый лендинг с инфо о проекте
   - "Play Game" кнопка
       ↓
🤖 Telegram Bot (@GotchiGameBot)
   - Deeplink: t.me/GotchiGameBot?start=web
   - /start → Welcome message
       ↓
🎮 Game (tamagotchi-game.html)
   - Играй, зарабатывай TAMA
   - Кормишь питомца, кликаешь
   - Уровни, квесты, достижения
       ↓
💰 Накопил 1000+ TAMA
       ↓
🖼️ NFT Button → (nft-mint.html)
   - Connect Phantom Wallet
   - Минт NFT за 1000 TAMA или 0.1 SOL
       ↓
✅ Mint Successful!
   - 3 кнопки:
     [🎮 Play in Telegram] → Telegram Bot
     [🌐 Play in Browser] → tamagotchi-game.html
     [🔍 View on Explorer] → Solana Explorer
```

---

## 🤖 **FLOW 2: Прямо через Telegram**

```
🤖 Telegram Bot (@GotchiGameBot)
   - Пользователь ищет в Telegram
   - /start
       ↓
🎮 Game (tamagotchi-game.html)
   - WebApp открывается внутри Telegram
   - Играет, зарабатывает TAMA
       ↓
🖼️ NFT Button → (nft-mint.html)
   - Opens external browser
   - Connect Phantom Wallet
   - Минт NFT
       ↓
✅ После минта:
   [🎮 Play in Telegram] → Назад в бота
```

---

## 👥 **FLOW 3: Через реферальную ссылку**

```
👤 Друг отправляет ссылку:
   t.me/GotchiGameBot?start=ref_7401131043
       ↓
🤖 Telegram Bot
   - "You were invited by @gotchi_ceo!"
   - Bonus: +100 TAMA
   - Реферер получает: +1000 TAMA
       ↓
🎮 Game
   - Играет с бонусом
       ↓
🖼️ NFT Mint
   - Минтит NFT
       ↓
✅ Обратно в игру
```

---

## 📊 **STRUCTURE:**

```
docs/
├── landing.html         ← Marketing landing (вход с веба)
├── index.html           ← Admin panels hub
├── tamagotchi-game.html ← Main game (Telegram WebApp)
├── nft-mint.html        ← NFT marketplace
├── transactions-admin.html
├── economy-admin.html
└── simple-dashboard.html
```

---

## 🔗 **LINKS MAPPING:**

### **Landing → Bot:**
```html
<a href="https://t.me/GotchiGameBot?start=landing">
  🎮 PLAY NOW
</a>
```

### **Game → NFT:**
```javascript
// In tamagotchi-game.html
nftBtn.onclick = () => {
  window.open('nft-mint.html?user_id=...&tama=...', '_blank');
}
```

### **NFT → Game:**
```html
<!-- After successful mint -->
<button onclick="window.open('https://t.me/GotchiGameBot?start=nft_minted')">
  🎮 Play in Telegram
</button>
<button onclick="window.location.href='tamagotchi-game.html'">
  🌐 Play in Browser
</button>
```

---

## 🎯 **KEY USER PATHS:**

### **Path 1: Casual Player (Free2Play)**
```
Landing → Bot → Game → Earn TAMA → Keep Playing
```

### **Path 2: NFT Collector**
```
Landing → Bot → Game → Earn 1000 TAMA → Mint NFT → Collect More
```

### **Path 3: Investor**
```
Landing → Connect Wallet → Mint NFT (0.1 SOL) → Play Game
```

### **Path 4: Viral Growth (Referrals)**
```
Friend Link → Bot → Game → Invite Friends → Earn 1000 TAMA per friend
```

---

## 💡 **CONVERSION FUNNEL:**

```
1000 visitors to Landing
    ↓ 40% CTR
  400 click "Play Game"
    ↓ 80% open Telegram
  320 start bot
    ↓ 70% play game
  224 active players
    ↓ 30% earn 1000 TAMA
   67 eligible for NFT
    ↓ 20% mint NFT
   13 NFT holders
```

---

## 🚀 **OPTIMIZATION IDEAS:**

1. **Landing Page:**
   - Add video demo
   - Show live stats (players online, NFTs minted)
   - "Try Demo" button (play without Telegram)

2. **Game:**
   - Tutorial for new players
   - Daily login bonus
   - Push notifications (Telegram)

3. **NFT Mint:**
   - Show collection gallery
   - Preview your NFT before mint
   - Share minted NFT on social media

4. **Retention:**
   - Daily quests
   - Seasonal events
   - Leaderboard rewards

---

## 📱 **MOBILE vs DESKTOP:**

### **Mobile (Primary):**
```
Telegram App → Bot → Game (WebApp) → NFT (opens browser)
```

### **Desktop:**
```
Landing → Telegram Web → Game → NFT (same tab)
```

---

## 🎨 **BRANDING CONSISTENCY:**

All pages should have:
- ✅ Same color scheme (Solana purple/green)
- ✅ 🐾 Logo everywhere
- ✅ "Built on Solana" badge
- ✅ Links to socials (Twitter, Telegram, Discord)

---

## ✅ **CURRENT STATUS:**

| Component | Status | URL |
|-----------|--------|-----|
| Landing | ✅ Ready | `landing.html` |
| Telegram Bot | ✅ Live | `@GotchiGameBot` |
| Game | ✅ Live | `tamagotchi-game.html` |
| NFT Mint | ✅ Live | `nft-mint.html` |
| Admin Panels | ✅ Live | `economy-admin.html`, etc. |

---

## 🔄 **NEXT STEPS:**

1. ✅ Update landing links → point to Telegram bot
2. ✅ Update NFT mint success → 2 buttons (Telegram + Browser)
3. 🔄 Add analytics tracking
4. 🔄 Add social share buttons
5. 🔄 Implement referral tracking

---

**Все пути ведут в игру! 🎮**

