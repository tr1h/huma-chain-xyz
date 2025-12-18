# 🇨🇳 Wallet Authentication Integration for Chinese Users

## ✅ Что уже готово:

1. **API Endpoint:** `api/wallet-auth.php` ✅
   - `POST /api/wallet-auth.php?action=create` - создать аккаунт по wallet
   - `POST /api/wallet-auth.php?action=get` - получить данные пользователя
   - `POST /api/wallet-auth.php?action=save` - сохранить состояние игры

2. **JS Модули:** ✅
   - `js/wallet-auth-cn.js` - авторизация через кошелек
   - `js/wallet-save-cn.js` - сохранение/загрузка через кошелек

## 📝 Как создать китайскую версию игры:

### Вариант 1: Минимальные изменения в существующем файле

**✅ ВЫПОЛНЕНО:** Wallet-логика интегрирована в основной `tamagotchi-game.html`

**Старый подход (НЕ ИСПОЛЬЗУЕТСЯ):**
Создать `tamagotchi-game-cn.html` на основе `tamagotchi-game.html` с изменениями:

1. **В `<head>` заменить:**
```html
<!-- Было: -->
<script src="js/auth.js"></script>

<!-- Стало: -->
<script src="js/wallet-auth-cn.js"></script>
<script src="js/wallet-save-cn.js"></script>
```

2. **Добавить модальное окно для подключения кошелька (после `<body>`):**
```html
<!-- Wallet Connection Modal for Chinese Users -->
<div id="wallet-connect-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; justify-content: center; align-items: center;">
    <div style="background: #2d3748; padding: 30px; border-radius: 20px; max-width: 400px; text-align: center;">
        <h2 style="color: #fff; margin-bottom: 20px;">🔐 连接钱包 / Connect Wallet</h2>
        <p style="color: #ccc; margin-bottom: 30px;">请连接您的Phantom或Solflare钱包以开始游戏<br>Connect your Phantom or Solflare wallet to start playing</p>
        <button id="connect-wallet-btn-modal" style="padding: 15px 30px; background: #9945FF; color: white; border: none; border-radius: 10px; font-size: 18px; cursor: pointer; margin-bottom: 10px;">
            👛 连接钱包 / Connect Wallet
        </button>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">没有钱包？<a href="https://phantom.app/" target="_blank" style="color: #9945FF;">下载Phantom</a></p>
    </div>
</div>
```

3. **Модифицировать `triggerAutoSave()` функцию:**
```javascript
function triggerAutoSave() {
    const now = Date.now();
    
    if (now - lastSaveTime < SAVE_COOLDOWN) {
        return;
    }
    
    if (!hasStateChanged()) {
        console.log('⏭️ Skipping save: no changes detected');
        return;
    }
    
    // ✅ ПРИОРИТЕТ 1: Wallet (для китайских пользователей)
    if (window.WALLET_ADDRESS && window.WalletSave) {
        window.WalletSave.save(gameState).then(success => {
            if (success) {
                console.log('💾 Auto-save successful (Wallet API)');
                lastSavedState = {
                    tama: gameState.tama,
                    level: gameState.level,
                    xp: gameState.xp,
                    hp: gameState.hp,
                    food: gameState.food,
                    happy: gameState.happy,
                    totalClicks: gameState.totalClicks,
                    maxCombo: gameState.maxCombo,
                    achievements: JSON.stringify(gameState.achievements.sort())
                };
                saveToLocalStorage(); // Backup
            } else {
                console.warn('⚠️ Wallet save failed, using localStorage');
                saveToLocalStorage();
            }
        });
    }
    // ✅ ПРИОРИТЕТ 2: Telegram (для остальных пользователей)
    else if (window.TELEGRAM_USER_ID) {
        saveDirectToSupabase(window.TELEGRAM_USER_ID).then(success => {
            if (success) {
                console.log('💾 Auto-save successful (Supabase)');
                lastSavedState = {
                    tama: gameState.tama,
                    level: gameState.level,
                    xp: gameState.xp,
                    hp: gameState.hp,
                    food: gameState.food,
                    happy: gameState.happy,
                    totalClicks: gameState.totalClicks,
                    maxCombo: gameState.maxCombo,
                    achievements: JSON.stringify(gameState.achievements.sort())
                };
                saveToLocalStorage();
            } else {
                console.warn('⚠️ Auto-save to Supabase failed, saving to localStorage');
                saveToLocalStorage();
            }
        });
    }
    // ✅ ПРИОРИТЕТ 3: LocalStorage (fallback)
    else {
        console.warn('⚠️ No user ID or wallet, saving only to localStorage');
        saveToLocalStorage();
    }
    
    lastSaveTime = now;
}
```

4. **Добавить инициализацию при загрузке страницы:**
```javascript
// Initialize wallet auth on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Try to auto-connect wallet
    const walletInit = await window.WalletAuth?.init();
    
    if (!walletInit.success && walletInit.needsConnection) {
        // Show wallet connection modal
        const modal = document.getElementById('wallet-connect-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    // Connect wallet button handler
    const connectBtn = document.getElementById('connect-wallet-btn-modal');
    if (connectBtn) {
        connectBtn.addEventListener('click', async () => {
            const result = await window.WalletAuth?.connect();
            if (result.success) {
                const modal = document.getElementById('wallet-connect-modal');
                if (modal) {
                    modal.style.display = 'none';
                }
                // Load game state
                await window.WalletSave?.load();
            } else {
                alert('❌ ' + (result.error || 'Failed to connect wallet'));
            }
        });
    }
});
```

5. **Модифицировать все проверки `window.TELEGRAM_USER_ID`:**
```javascript
// Было:
if (window.TELEGRAM_USER_ID) {
    // код
}

// Стало:
if (window.TELEGRAM_USER_ID || window.WALLET_ADDRESS) {
    // код
    const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
    // использовать userId
}
```

## 🎯 Готовое решение:

**Создать файл `tamagotchi-game-cn.html`** с этими изменениями. Это будет отдельная версия для китайских пользователей, которая:
- ✅ Работает без Telegram
- ✅ Использует wallet для авторизации
- ✅ Сохраняет данные через API
- ✅ Не ломает существующую версию

## 📋 Чеклист:

- [x] ✅ Wallet-логика добавлена в `tamagotchi-game.html` (единый файл для всех)
- [ ] Заменить `js/auth.js` на `js/wallet-auth-cn.js` и `js/wallet-save-cn.js`
- [ ] Добавить модальное окно для подключения кошелька
- [ ] Модифицировать `triggerAutoSave()` для работы с wallet
- [ ] Обновить все проверки `window.TELEGRAM_USER_ID` на `window.TELEGRAM_USER_ID || window.WALLET_ADDRESS`
- [ ] Добавить инициализацию wallet при загрузке страницы
- [ ] Протестировать создание аккаунта по wallet
- [ ] Протестировать сохранение/загрузку данных

## 🚀 Использование:

Китайские пользователи заходят на:
```
https://solanatamagotchi.com/tamagotchi-game.html?auth=wallet
(или просто tamagotchi-game.html - автоматически определит)
```

Им показывается модальное окно для подключения кошелька. После подключения:
- ✅ Создается аккаунт в базе
- ✅ Данные сохраняются через API
- ✅ Все работает без Telegram!

