# 🎯 Platform Detection Guide

## Как работать с одной страницей для Telegram и сайта

### 📋 Концепция

Одна страница (`tamagotchi-game.html`), но разные элементы показываются в зависимости от платформы.

---

## 🔍 Определение платформы

### JavaScript API

Используй `PlatformDetector`:

```javascript
// Проверить платформу
if (PlatformDetector.isTelegram()) {
    console.log('👋 Пользователь в Telegram Mini App');
} else {
    console.log('🌐 Пользователь на обычном сайте');
}

// Получить название платформы
const platform = PlatformDetector.getPlatform(); // 'telegram' или 'browser'
```

### HTML атрибуты

После инициализации к `<body>` добавляется класс:
- `platform-telegram` - если Telegram
- `platform-browser` - если обычный сайт

---

## 🎨 CSS стили для разных платформ

### Скрыть элемент только в Telegram

```css
/* Кнопка кошелька видна только на сайте */
.platform-telegram #wallet-connect-btn {
    display: none !important;
}
```

### Скрыть элемент только на сайте

```css
/* Telegram-специфичные элементы */
.platform-browser .telegram-only {
    display: none !important;
}
```

### Разные стили для разных платформ

```css
/* В Telegram - другой цвет */
.platform-telegram .pet-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* На сайте - другой цвет */
.platform-browser .pet-container {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

---

## 📱 Что скрывать/показывать

### В Telegram НЕ показываем:

```javascript
// ❌ Кнопки кошелька
PlatformDetector.hideIf('wallet-connect-btn', PlatformDetector.isTelegram());
PlatformDetector.hideIf('disconnect-wallet-btn-modal', PlatformDetector.isTelegram());

// ❌ Модалку подключения кошелька
PlatformDetector.hideIf('wallet-connection-modal', PlatformDetector.isTelegram());
```

### На сайте НЕ показываем:

```javascript
// ❌ Telegram-специфичные элементы
PlatformDetector.hideIf('telegram-share-btn', PlatformDetector.isBrowser());
PlatformDetector.hideIf('telegram-avatar', PlatformDetector.isBrowser());
```

---

## 🔧 Примеры использования

### Пример 1: Условный рендеринг кнопки

```javascript
// Показать кнопку подключения кошелька только на сайте
function initWalletButton() {
    const walletBtn = document.getElementById('wallet-connect-btn');
    
    if (PlatformDetector.isBrowser() && walletBtn) {
        walletBtn.style.display = 'block';
        walletBtn.addEventListener('click', connectWallet);
    } else if (walletBtn) {
        walletBtn.style.display = 'none';
    }
}
```

### Пример 2: Разная логика сохранения

```javascript
async function saveGameState(gameState) {
    if (PlatformDetector.isTelegram()) {
        // В Telegram - сохраняем через Telegram ID
        const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        await saveTelegramGameState(userId, gameState);
    } else {
        // На сайте - сохраняем через кошелёк
        const walletAddress = window.WALLET_ADDRESS;
        await saveWalletGameState(walletAddress, gameState);
    }
}
```

### Пример 3: Разные реферальные ссылки

```javascript
function getShareLink() {
    if (PlatformDetector.isTelegram()) {
        // Telegram Mini App ссылка
        return `https://t.me/YourBot?start=${referralCode}`;
    } else {
        // Обычная веб-ссылка
        return `https://solanatamagotchi.com/tamagotchi-game.html?ref=${referralCode}`;
    }
}
```

---

## 🎯 HTML разметка

### Добавь класс для управления через CSS

```html
<!-- Только для Telegram -->
<div class="telegram-only">
    <button id="telegram-share-btn">📤 Share to Telegram</button>
</div>

<!-- Только для сайта -->
<div class="browser-only">
    <button id="wallet-connect-btn">👛 Connect Wallet</button>
</div>

<!-- Универсальные элементы (показываются везде) -->
<div class="universal">
    <button id="play-btn">🎮 Play</button>
</div>
```

### CSS для классов

```css
/* Скрыть telegram-only на сайте */
.platform-browser .telegram-only {
    display: none !important;
}

/* Скрыть browser-only в Telegram */
.platform-telegram .browser-only {
    display: none !important;
}
```

---

## 📊 Таблица элементов UI

| Элемент | Telegram | Сайт | Класс |
|---------|----------|------|-------|
| Connect Wallet | ❌ | ✅ | `.browser-only` |
| Disconnect Wallet | ❌ | ✅ | `.browser-only` |
| Telegram Avatar | ✅ | ❌ | `.telegram-only` |
| Share to Telegram | ✅ | ❌ | `.telegram-only` |
| Pet Game | ✅ | ✅ | `.universal` |
| Mini Games | ✅ | ✅ | `.universal` |
| Leaderboard | ✅ | ✅ | `.universal` |
| Shop | ✅ | ✅ | `.universal` |

---

## ✅ Преимущества этого подхода

1. **Один файл** - легче поддерживать
2. **Автоматическое определение** - не нужно создавать 2 версии
3. **Единая база данных** - все пользователи в одной таблице
4. **Простое обновление** - изменил один раз, работает везде
5. **SEO-friendly** - поисковики индексируют сайт
6. **Гибкость** - легко добавить поддержку новых платформ (Discord, WeChat, etc.)

---

## 🚀 Как подключить

### Шаг 1: Добавить скрипт в HTML

```html
<head>
    <!-- Platform detection -->
    <script src="js/platform-detector.js"></script>
</head>
```

### Шаг 2: Использовать в коде

```javascript
// После загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    // Автоматически скроет/покажет нужные элементы
    console.log(`Platform: ${PlatformDetector.getPlatform()}`);
});
```

### Шаг 3: Готово! 🎉

Всё работает автоматически! Страница сама определит платформу и настроит UI.

---

## 💡 Дополнительные возможности

### Обнаружение мобильного устройства

```javascript
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (PlatformDetector.isBrowser() && isMobile) {
    console.log('📱 Мобильный браузер');
}
```

### Обнаружение Phantom кошелька

```javascript
if (PlatformDetector.isBrowser()) {
    const hasPhantom = window.solana?.isPhantom;
    if (!hasPhantom) {
        alert('Install Phantom wallet to play!');
    }
}
```

---

## 🎯 Итого

✅ Одна страница для всех платформ
✅ Автоматическое скрытие/показ элементов
✅ Простая поддержка и обновления
✅ Работает в Telegram и на обычном сайте
✅ Готово для Китая и других стран без VPN

