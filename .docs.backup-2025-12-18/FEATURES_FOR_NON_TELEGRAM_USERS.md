# 🌐 Фичи для пользователей БЕЗ Telegram

## Что нужно добавить для обычных пользователей (Китай, etc.)

---

## ✅ Обязательные фичи (MUST HAVE)

### 1️⃣ Система входа через кошелёк ✅ УЖЕ ЕСТЬ
- [x] Подключение Phantom/Solflare
- [x] Сохранение прогресса в базу данных
- [x] Автоматическое создание аккаунта

### 2️⃣ Реферальная система через веб-ссылки
**Статус:** ❌ НУЖНО ДОБАВИТЬ

**Что делать:**
```javascript
// Вместо Telegram бота - обычная веб-ссылка
const referralLink = `https://solanatamagotchi.com/tamagotchi-game.html?ref=${walletAddress}`;

// При открытии ссылки - проверяем параметр ref
const urlParams = new URLSearchParams(window.location.search);
const referrer = urlParams.get('ref');
if (referrer) {
    // Сохранить referrer и начислить бонус
}
```

**Где показывать:**
- В модалке "🔗 My Referral Link"
- Кнопка "📋 Copy Link" (вместо "Share to Telegram")
- Кнопка "📤 Share" (через Web Share API для мобильных)

---

### 3️⃣ Кнопка "Share" (Web Share API)
**Статус:** ❌ НУЖНО ДОБАВИТЬ

```javascript
async function shareReferralLink() {
    const referralLink = `https://solanatamagotchi.com/tamagotchi-game.html?ref=${walletAddress}`;
    
    if (navigator.share && PlatformDetector.isBrowser()) {
        try {
            await navigator.share({
                title: 'Solana Tamagotchi',
                text: 'Play and earn TAMA tokens! 🐾',
                url: referralLink
            });
        } catch (err) {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(referralLink);
            alert('Link copied to clipboard!');
        }
    } else {
        // Desktop - copy to clipboard
        navigator.clipboard.writeText(referralLink);
        alert('Link copied to clipboard!');
    }
}
```

---

### 4️⃣ Email уведомления (опционально)
**Статус:** 🟡 ОПЦИОНАЛЬНО

**Зачем:**
- Напоминания о питомце
- Уведомления о новых фичах
- Реферальные бонусы

**Как:**
```javascript
// Сохранить email в профиле
async function saveEmail(walletAddress, email) {
    await fetch('https://api.solanatamagotchi.com/api/wallet-auth.php', {
        method: 'POST',
        body: JSON.stringify({
            action: 'update_email',
            wallet_address: walletAddress,
            email: email
        })
    });
}
```

---

### 5️⃣ Social Login (Discord, Google, Twitter)
**Статус:** 🟡 ОПЦИОНАЛЬНО

**Зачем:**
- Альтернатива кошельку
- Привязка нескольких методов входа

**Как:**
```html
<button id="discord-login">🟣 Login with Discord</button>
<button id="google-login">🔴 Login with Google</button>
<button id="twitter-login">🐦 Login with Twitter</button>
```

---

### 6️⃣ PWA (Progressive Web App)
**Статус:** ❌ НУЖНО ДОБАВИТЬ

**Зачем:**
- Установка на телефон как приложение
- Работает офлайн
- Push-уведомления

**Как:**
1. Создать `manifest.json`
2. Создать Service Worker
3. Добавить иконки разных размеров

```json
// manifest.json
{
  "name": "Solana Tamagotchi",
  "short_name": "Tamagotchi",
  "start_url": "/tamagotchi-game.html",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### 7️⃣ Мультиязычность (i18n)
**Статус:** 📄 ЕСТЬ ГАЙД

**Языки:**
- 🇺🇸 English (по умолчанию)
- 🇷🇺 Русский
- 🇨🇳 中文 (Китайский) - для китайского рынка
- 🇯🇵 日本語 (Японский)
- 🇰🇷 한국어 (Корейский)

**Гайд:** `.docs/LOCALIZATION_GUIDE.md`

---

### 8️⃣ Подключение других кошельков
**Статус:** ⚠️ ЧАСТИЧНО ЕСТЬ

**Текущие:**
- ✅ Phantom
- ✅ Solflare

**Добавить:**
- [ ] Backpack
- [ ] Glow
- [ ] Slope
- [ ] Coin98
- [ ] Trust Wallet

```javascript
// Универсальная функция подключения
async function connectWallet(walletName) {
    let provider;
    
    switch(walletName) {
        case 'phantom':
            provider = window.solana;
            break;
        case 'backpack':
            provider = window.backpack;
            break;
        case 'glow':
            provider = window.glow;
            break;
        // ... etc
    }
    
    if (provider) {
        await provider.connect();
    }
}
```

---

### 9️⃣ Кнопка "Add to Home Screen"
**Статус:** ❌ НУЖНО ДОБАВИТЬ

**Для iOS/Android:**
```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Показать кнопку "Add to Home Screen"
    const installBtn = document.getElementById('install-btn');
    installBtn.style.display = 'block';
    
    installBtn.addEventListener('click', async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ App installed');
        }
        deferredPrompt = null;
    });
});
```

---

### 🔟 Onboarding (Туториал для новых пользователей)
**Статус:** ❌ НУЖНО ДОБАВИТЬ

**Что показывать:**
1. "Welcome! Connect your wallet to start"
2. "This is your pet - click to earn TAMA!"
3. "Feed your pet when hungry"
4. "Invite friends and earn bonuses!"

```javascript
function showOnboarding() {
    if (!localStorage.getItem('onboarding_completed')) {
        // Показать туториал
        showTutorialStep1();
    }
}
```

---

## 🎨 UI Улучшения для сайта

### 1. Модалка "Connect Wallet" с выбором кошельков
```html
<div id="wallet-selection-modal">
    <h2>🔐 Connect Wallet</h2>
    <button class="wallet-btn">
        <img src="phantom-icon.png"> Phantom
    </button>
    <button class="wallet-btn">
        <img src="solflare-icon.png"> Solflare
    </button>
    <button class="wallet-btn">
        <img src="backpack-icon.png"> Backpack
    </button>
    
    <p>Don't have a wallet? <a href="https://phantom.app">Download Phantom</a></p>
</div>
```

### 2. Профиль пользователя
```html
<div id="user-profile">
    <div class="wallet-info">
        <span class="wallet-address">Eb4d...fdap</span>
        <button id="copy-wallet">📋</button>
        <button id="disconnect-wallet">🔌</button>
    </div>
    
    <!-- Статистика -->
    <div class="user-stats">
        <div>🎮 Games: 150</div>
        <div>💰 TAMA: 5,000</div>
        <div>🏆 Rank: #42</div>
    </div>
</div>
```

### 3. Кнопка "🔔 Enable Notifications"
```javascript
async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            // Подписаться на push-уведомления
            subscribeToPushNotifications();
        }
    }
}
```

---

## 🌍 Специфика для Китая

### 1. WeChat Login
**Зачем:** В Китае все используют WeChat

```javascript
// WeChat OAuth
function loginWithWeChat() {
    const appId = 'YOUR_WECHAT_APP_ID';
    const redirectUri = encodeURIComponent('https://solanatamagotchi.com/wechat-callback');
    
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo`;
}
```

### 2. Alipay/WeChat Pay (опционально)
**Для покупки TAMA за юани:**
```javascript
// Интеграция платёжных систем Китая
async function buyTamaWithAlipay(amount) {
    // Создать заказ
    const order = await createAlipayOrder(amount);
    
    // Перенаправить на Alipay
    window.location.href = order.payment_url;
}
```

### 3. Китайские соцсети
- Weibo (微博)
- QQ
- Douyin (抖音)

**Кнопка "Share":**
```html
<button onclick="shareToWeibo()">📤 Share to Weibo</button>
<button onclick="shareToQQ()">📤 Share to QQ</button>
```

---

## 📊 Аналитика и метрики

### 1. Google Analytics (или альтернатива для Китая)
```javascript
// Отслеживание событий
gtag('event', 'wallet_connected', {
    'wallet_type': 'phantom',
    'user_id': walletAddress
});
```

### 2. Для Китая - Baidu Analytics
```html
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?YOUR_BAIDU_ID";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>
```

---

## 🎯 Приоритеты внедрения

### 🔴 КРИТИЧНО (сделать сейчас):
1. ✅ Реферальная система через веб-ссылки
2. ✅ Кнопка "Share" (Web Share API)
3. ✅ Onboarding туториал

### 🟡 ВАЖНО (сделать на следующей неделе):
4. 🟡 PWA (Progressive Web App)
5. 🟡 Мультиязычность (хотя бы английский + китайский)
6. 🟡 Больше кошельков (Backpack, Glow)

### 🟢 ЖЕЛАТЕЛЬНО (когда будет время):
7. 🟢 Email уведомления
8. 🟢 Social Login (Discord, Google)
9. 🟢 WeChat Login (для Китая)
10. 🟢 Alipay/WeChat Pay

---

## 💡 Итого

**Минимум для запуска без Telegram:**
- ✅ Wallet connection (есть)
- ✅ Реферальная система через ссылки (нужно добавить)
- ✅ Кнопка Share (нужно добавить)
- ✅ Простой туториал (нужно добавить)

**Остальное - постепенно добавляем по мере роста аудитории!**

Начнём с этих 3 фич?

