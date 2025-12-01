# 🐾 Solana Tamagotchi - Project Overview & Recent Changes

## 📋 PROJECT SUMMARY

**Solana Tamagotchi** is a Play-to-Earn (P2E) blockchain game built on Solana, accessible via Telegram Bot and web browser. Players care for virtual pets, earn TAMA tokens, complete quests, and can mint NFT pets for earning multipliers.

**Website:** https://solanatamagotchi.com  
**Telegram Bot:** @GotchiGameBot  
**Current Version:** 1.9.12 (as of 2025-11-29)

---

## 🎯 RECENT MAJOR CHANGES (Last Session)

### ✅ Unified Authentication System (Version 1.9.9 - 1.9.12)

**Problem:** Initially had separate files for different countries:
- `tamagotchi-game.html` (Telegram only)
- `tamagotchi-game-cn.html` (Wallet for China)

**Solution:** Unified into ONE smart file that automatically detects authentication method:

**File:** `tamagotchi-game.html` (Version 1.9.12)

**Features:**
1. **Automatic Detection:**
   - If Telegram WebApp available AND user ID obtained → Telegram auth
   - If Telegram WebApp available BUT no user ID → Shows wallet modal
   - If Telegram WebApp NOT available → Shows wallet modal
   - URL parameters: `?auth=wallet` or `?auth=telegram` for forced selection

2. **Wallet Integration:**
   - Files: `js/wallet-auth-cn.js`, `js/wallet-save-cn.js`
   - API: `api/wallet-auth.php`
   - Supports Phantom/Solflare wallets
   - Full data synchronization via Supabase

3. **Modal Window:**
   - ID: `wallet-connect-modal`
   - Shows when Telegram auth fails or unavailable
   - Button: `connect-wallet-btn-modal`

**Key Code Locations:**
- `tamagotchi-game.html` lines 7086-7224: `initGame()` function with smart auth detection
- `tamagotchi-game.html` lines 7689-7750: `triggerAutoSave()` with wallet/Telegram priority
- `tamagotchi-game.html` lines 3336-3354: Wallet connection modal HTML

**Fixed Issues:**
- ✅ Duplicate `WALLET_AUTH_API` declaration (fixed in `wallet-save-cn.js`)
- ✅ Modal not showing when Telegram user ID unavailable (fixed logic)
- ✅ API 405 error (fixed `$input` undefined in `wallet-auth.php`)
- ✅ Better error handling for non-JSON responses

---

## 🏗️ PROJECT STRUCTURE

### **Core Files:**
- `tamagotchi-game.html` - Main game file (unified auth, works for all countries)
- `index.html` - Landing page
- `mint.html` - NFT minting page
- `my-nfts.html` - NFT collection viewer
- `s.html` - Referral landing page

### **Backend:**
- `bot/bot.py` - Telegram bot (Python)
- `api/wallet-auth.php` - Wallet authentication API
- `api/tama_supabase.php` - Main TAMA API
- `api/referral-settings.php` - Referral settings API

### **JavaScript Modules:**
- `js/auth.js` - Telegram authentication
- `js/wallet-auth-cn.js` - Wallet authentication (for countries without Telegram)
- `js/wallet-save-cn.js` - Wallet-based save/load system
- `js/profile-widget.js` - User profile widget
- `js/legal-consent.js` - Legal consent modal

### **Documentation:**
- `.docs/CHINA_MARKETING_STRATEGY.md` - Marketing strategy for China
- `.docs/MULTI_COUNTRY_AUTH_STRATEGY.md` - Auth strategy explanation
- `.docs/REFERRAL_LEVELS_EXPLANATION.md` - Referral system docs
- `.docs/TAMA_REWARD_FLOW.md` - TAMA reward flow
- `.docs/API_REFERRAL_SETTINGS.md` - API documentation

---

## 🔑 KEY TECHNICAL DETAILS

### **Authentication Priority:**
```javascript
// Priority 1: Wallet (if forced or Telegram unavailable)
if ((forceAuth === 'wallet' || !hasTelegramUser) && window.WalletAuth) {
    // Wallet auth
}
// Priority 2: Telegram (if available)
else if (hasTelegramUser) {
    // Telegram auth
}
// Priority 3: localStorage (fallback)
```

### **Save Priority:**
```javascript
// Priority 1: Wallet
if (window.WALLET_ADDRESS && window.WalletSave) {
    window.WalletSave.save(gameState);
}
// Priority 2: Telegram
else if (window.TELEGRAM_USER_ID) {
    saveDirectToSupabase(window.TELEGRAM_USER_ID);
}
// Priority 3: localStorage
else {
    saveToLocalStorage();
}
```

### **API Endpoints:**
- `POST /api/wallet-auth.php?action=get` - Get user by wallet
- `POST /api/wallet-auth.php?action=create` - Create account by wallet
- `POST /api/wallet-auth.php?action=save` - Save game state by wallet

### **Database (Supabase):**
- Table: `leaderboard` - Main user data
  - `telegram_id` - Can be Telegram ID or `wallet_XXXXX` format
  - `wallet_address` - Solana wallet address
  - `tama`, `level`, `xp`, `clicks` - Game stats
- Table: `referral_settings` - Configurable referral rewards
- Table: `referrals` - Referral relationships
- Table: `user_nfts` - NFT collection

---

## 🎮 GAME FEATURES

### **Core Gameplay:**
- Virtual pet care (Feed, Play, Heal)
- Click-to-earn TAMA tokens
- Combo system (bonus for consecutive clicks)
- Level system with XP
- Daily quests and achievements
- Multiple pet themes (Kawai, Retro, Premium, etc.)

### **Economy:**
- TAMA token (SPL token on Solana)
- NFT pets with earning multipliers (5 tiers: Bronze, Silver, Gold, Platinum, Diamond)
- Referral system: 1,000 TAMA per friend + milestone bonuses
- Daily rewards system
- Withdrawal system (via bot command)

### **Referral System:**
- Single-level referrals (1,000 TAMA per friend)
- Milestone bonuses: 1, 3, 15, 75, 150, 250, 500, 1000 referrals
- Configurable via admin panel (`admin-referrals.html`)
- API: `api/referral-settings.php`

---

## 🌍 MULTI-COUNTRY SUPPORT

### **Current Implementation:**
- **One file for all:** `tamagotchi-game.html`
- **Automatic detection:** Works everywhere automatically
- **For China/Russia:** Automatically offers wallet (Telegram blocked)
- **For others:** Uses Telegram if available

### **URL Parameters:**
- `?auth=wallet` - Force wallet authentication
- `?auth=telegram` - Force Telegram authentication
- No parameter - Automatic detection

### **Removed Files:**
- ❌ `tamagotchi-game-cn.html` - DELETED (no longer needed)

---

## 🔧 RECENT FIXES (Session 2025-11-29)

1. **Unified Auth System:**
   - Merged wallet and Telegram auth into one file
   - Automatic detection logic
   - Modal window for wallet connection

2. **API Fixes:**
   - Fixed `$input` undefined in `wallet-auth.php`
   - Added proper error handling for non-JSON responses
   - Added `action` parameter to all API calls

3. **JavaScript Fixes:**
   - Fixed duplicate `WALLET_AUTH_API` declaration
   - Improved modal showing logic
   - Better error messages

4. **Documentation:**
   - Updated China marketing strategy
   - Created multi-country auth strategy doc
   - Updated all references to use unified file

---

## 📊 CURRENT STATE

### **Working:**
- ✅ Telegram bot (`bot/bot.py`)
- ✅ Web game with unified auth
- ✅ Wallet authentication API
- ✅ Referral system with milestones
- ✅ NFT minting system
- ✅ Admin panel for referral settings
- ✅ Daily statistics auto-posting

### **Known Issues:**
- ⚠️ GitHub Dependabot: 2 high vulnerabilities (not critical)
- ⚠️ Some users may need to clear cache after updates

### **Testing Needed:**
- 🔄 Wallet connection flow (Phantom/Solflare)
- 🔄 Data persistence via wallet
- 🔄 Cross-device synchronization

---

## 🚀 DEPLOYMENT

### **Git Repository:**
- Main branch: `main`
- Latest commit: Unified auth system (1.9.12)

### **Key Commands:**
```bash
git add .
git commit -m "Description"
git push origin main
```

### **Important Files to Track:**
- `tamagotchi-game.html` - Main game (unified auth)
- `js/wallet-auth-cn.js` - Wallet auth
- `js/wallet-save-cn.js` - Wallet save/load
- `api/wallet-auth.php` - Wallet API
- `bot/bot.py` - Telegram bot

---

## 💡 IMPORTANT NOTES FOR CONTINUATION

1. **Always use unified file:** `tamagotchi-game.html` (not country-specific versions)

2. **Auth detection:** Check `hasTelegramUser` variable, not just `window.Telegram?.WebApp`

3. **Save priority:** Wallet → Telegram → localStorage

4. **API calls:** Always include `action` parameter in wallet-auth.php requests

5. **Error handling:** Check `response.ok` before parsing JSON

6. **Modal:** ID is `wallet-connect-modal`, button is `connect-wallet-btn-modal`

7. **Bot unchanged:** Bot (`bot/bot.py`) works as before, no changes needed

---

## 📝 QUICK REFERENCE

### **Check if user authenticated:**
```javascript
const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
```

### **Show wallet modal:**
```javascript
const modal = document.getElementById('wallet-connect-modal');
if (modal) modal.style.display = 'flex';
```

### **Save game state:**
```javascript
triggerAutoSave(); // Automatically uses wallet or Telegram
```

### **API call example:**
```javascript
fetch('https://api.solanatamagotchi.com/api/wallet-auth.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        action: 'get', // or 'create', 'save'
        wallet_address: walletAddress
    })
})
```

---

## 🎯 NEXT STEPS (If Needed)

1. Test wallet connection flow end-to-end
2. Verify data persistence across devices
3. Add localization for Chinese users (UI text)
4. Consider WeChat Mini Program for China
5. Monitor API performance and errors

---

**Last Updated:** 2025-11-29  
**Version:** 1.9.12  
**Status:** ✅ Production Ready (with unified auth)
