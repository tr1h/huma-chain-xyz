# 🎮 Solana Tamagotchi - Public Landing Pages

**GitHub**: https://github.com/tr1h/solana-tamagotchi  
**Live**: https://tr1h.github.io/solana-tamagotchi/

Public landing pages and referral system for Solana Tamagotchi - Ultimate Play-to-Earn NFT Pet Game.

## 🎯 Purpose

This repository contains the public-facing components of Solana Tamagotchi:

* 📱 **s.html** - Short referral page with automatic redirect
* 🎨 **referral.html** - Full landing page with beautiful preview
* 🏠 **index.html** - Main landing page
* ⚙️ **super-admin.html** - Admin dashboard
* 🖼️ **assets/** - Images and generators for social media (Open Graph)
* 📝 **group_welcome_message.md** - Telegram group welcome message
* 📌 **group_pinned_message.md** - Telegram group pinned message

## 🚀 Features

### Referral System

* 🔗 **Short Links** - `s.html?ref=TAMA123` for easy sharing
* ⚡ **Auto Redirect** - 2-second redirect to Telegram bot
* 🎨 **Beautiful Previews** - Open Graph images for social media
* 📱 **Mobile Optimized** - Responsive design for all devices

### Admin Dashboard

* 📊 **Real-time Analytics** - Track referrals and clicks
* 👥 **User Management** - Monitor player activity
* 💰 **Economy Control** - Manage TAMA distribution
* 🔧 **System Monitoring** - Health checks and performance

### Social Media Integration

* 📸 **Open Graph Images** - 1200x630px preview images
* 🐦 **Twitter Cards** - Optimized for Twitter sharing
* 📘 **Facebook Sharing** - Rich previews on Facebook
* 💬 **Telegram Integration** - Seamless bot connection

## 📁 Structure

```
solana-tamagotchi/
├── s.html                 # Short referral link
├── referral.html          # Full landing page
├── index.html             # Main page
├── super-admin.html       # Admin dashboard
├── tamagotchi-game.html   # Game interface
├── assets/
│   ├── referral-preview.png  # Social media image (1200x630)
│   ├── referral-preview.svg  # Source file
│   ├── create-preview.html   # Image generator
│   └── convert-to-png.html   # PNG converter
├── css/                   # Styles
│   ├── landing.css
│   ├── main.css
│   ├── mobile.css
│   └── animations.css
├── docs/                  # Documentation
├── group_welcome_message.md    # Telegram group welcome
├── group_pinned_message.md     # Telegram group pinned
└── README.md             # This file
```

## 🔗 How Referral System Works

### 1. User gets link from bot:

```
/ref → https://tr1h.github.io/solana-tamagotchi/s.html?ref=TAMA3F2A1C
```

### 2. s.html processes the link:

```javascript
// Gets code from URL
const refCode = urlParams.get('ref'); // TAMA3F2A1C

// Creates bot link
const botLink = `https://t.me/gotchigamebot?start=ref${refCode}`;

// Automatically redirects after 2 seconds
setTimeout(() => window.location.href = botLink, 2000);
```

### 3. User lands in bot:

```
Bot receives: /start refTAMA3F2A1C
Finds referrer by code
Awards 1,000 TAMA instantly!
```

## 🎨 Open Graph Preview

When link is shared on social media, shows:

* 📸 **Image**: 1200x630px (referral-preview.png)
* 📝 **Title**: "🎮 Join Solana Tamagotchi - Get 1,000 TAMA Bonus!"
* 💬 **Description**: "Play-to-Earn NFT pet game on Solana! Grow unique pets, earn TAMA tokens..."

### Meta tags:

```html
<meta property="og:title" content="🎮 Join Solana Tamagotchi - Get 1,000 TAMA Bonus!">
<meta property="og:description" content="...">
<meta property="og:image" content="...referral-preview.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

## 🚀 Deployment

### GitHub Pages (Automatic):

```bash
git add .
git commit -m "Update landing pages"
git push origin main
```

### Manual Deploy:

1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: main → / (root) → Save

### Test:

```
https://tr1h.github.io/solana-tamagotchi/s.html?ref=TEST123
```

## 🔧 Customization

### Change Social Media Image:

1. Create new image 1200x630px
2. Save as `assets/referral-preview.png`
3. Push to GitHub

### Change Text:

Edit meta tags in `s.html`:

```html
<meta property="og:title" content="Your title">
<meta property="og:description" content="Your description">
```

### Change Redirect Time:

In `s.html` find:

```javascript
setTimeout(() => window.location.href = link.href, 2000); // 2 seconds
```

## 📊 Analytics

Page sends click data to main project:

```javascript
fetch('https://your-analytics-api.herokuapp.com/track_click', {
    method: 'POST',
    body: JSON.stringify({
        referral_code: refCode,
        clicked_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer
    })
});
```

## 🎯 Best Practices

### SEO Optimization:

* ✅ Open Graph tags
* ✅ Twitter Card tags
* ✅ Meta description
* ✅ Semantic HTML

### Performance:

* ✅ Minified CSS
* ✅ Inline styles for critical CSS
* ✅ Optimized images
* ✅ Fast redirect (2 sec)

### Mobile-First:

* ✅ Responsive design
* ✅ Touch-friendly buttons
* ✅ Viewport meta tag

## 📱 Testing

### Check Open Graph:

* [Facebook Debugger](https://developers.facebook.com/tools/debug/)
* [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Check Mobile Version:

* Chrome DevTools → Device Toolbar
* [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

## 🔗 Connection with Main Project

This repository works together with:

* **Main Project**: https://github.com/tr1h/huma-chain-xyz
* **Telegram Bot**: @gotchigamebot
* **Contact Email**: gotchigame@proton.me

## 📈 Current Metrics

* **Landing Page Views**: 10,000+ monthly
* **Referral Clicks**: 5,000+ monthly
* **Conversion Rate**: 15%+ (click to bot)
* **Social Shares**: 1,000+ monthly

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Referral landing pages
- ✅ Social media integration
- ✅ Admin dashboard
- ✅ Mobile optimization

### Phase 2 (Next 3 months)
- 🔄 A/B testing for conversion
- 🔄 Advanced analytics
- 🔄 Multi-language support
- 🔄 Custom referral codes

### Phase 3 (Future)
- 📋 White-label solution
- 📋 API for partners
- 📋 Advanced tracking
- 📋 Cross-platform integration

## 📝 License

MIT License

## 🤝 Contact

* **Telegram**: @gotchigamebot
* **GitHub**: https://github.com/tr1h/solana-tamagotchi
* **Email**: gotchigame@proton.me

---

**Simple, fast, beautiful! 🎨**

## About

🐣 Play-to-Earn NFT Tamagotchi game on Solana blockchain
