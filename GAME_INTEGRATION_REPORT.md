# 🎮 ОТЧЁТ: ИНТЕГРАЦИЯ ИГРЫ И МИНИ-ИГР

**Дата:** 20 декабря 2025  
**Проверено:** tamagotchi-game.html + mini-games

---

## ✅ ЧТО РАБОТАЕТ:

### 1. Структура файлов:
```
tamagotchi-game.html   - Основная игра
├── slots.html         - Lucky Slots (открывается в новой вкладке)
├── wheel.html         - Lucky Wheel (открывается в новой вкладке)
├── super-tama-bros.html - Platformer (открывается в новой вкладке)
├── tama-shooter.html  - Shooter (открывается в новой вкладке)
└── tama-color-match.html - Memory game (открывается в новой вкладке)
```

### 2. Навигация:
- ✅ Кнопка "Games" открывает модалку с мини-играми
- ✅ Клик на мини-игру открывает её в **новой вкладке** (`window.open`)
- ✅ Функция `backToGames()` существует (строки 9509, 14776)

### 3. Баланс TAMA:
- ✅ Основная игра хранит баланс в `gameState.tama`
- ✅ При загрузке вызывается `loadFromSupabase()` (строка 8819)
- ✅ Используется Supabase таблица `players`

---

## ❌ ПРОБЛЕМЫ:

### Проблема 1: Нет синхронизации баланса между играми

**Симптомы:**
- Если играешь в slots.html и выигрываешь TAMA
- Затем возвращаешься в tamagotchi-game.html
- Баланс НЕ обновляется автоматически

**Причина:**
- `slots.html` открывается в новой вкладке (`window.open`)
- Нет связи через `window.opener` или `postMessage`
- tamagotchi-game.html НЕ перезагружает баланс при возврате фокуса

**Решение:**
Добавить `focus` listener чтобы перезагружать баланс:

```javascript
// В tamagotchi-game.html, после loadFromSupabase
window.addEventListener('focus', async () => {
    console.log('🔄 Tab focused - reloading balance...');
    const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
    if (userId) {
        const saved = await loadFromSupabase(String(userId));
        if (saved) {
            console.log('✅ Balance reloaded after tab switch');
            updateUI();
        }
    }
});
```

---

### Проблема 2: slots.html не имеет функции сохранения

**Проверил файл:** `slots.html` (первые 100 строк)
- ❌ Нет `saveToSupabase()` функции
- ❌ Нет `supabase.update()` вызовов

**Нужно проверить:**
Как slots.html сохраняет выигрыш?

---

## 🔧 РЕКОМЕНДУЕМЫЕ ИСПРАВЛЕНИЯ:

### Исправление 1: Добавить автоперезагрузку баланса

**Файл:** `tamagotchi-game.html`  
**Место:** После строки 8819 (функция loadFromSupabase)

**Добавить:**
```javascript
// 🔄 Auto-reload balance when user returns to tab
window.addEventListener('focus', async () => {
    const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID || window.WALLET_ADDRESS;
    if (userId && !document.hidden) {
        console.log('🔄 Tab focused - reloading balance from Supabase...');
        try {
            const response = await window.getSupabase()
                .from('players')
                .select('tama_balance, wallet_address')
                .eq('telegram_id', String(userId))
                .single();

            if (response.data) {
                const newBalance = parseFloat(response.data.tama_balance) || 0;
                const oldBalance = gameState.tama;
                
                if (newBalance !== oldBalance) {
                    gameState.tama = newBalance;
                    updateUI();
                    showMessage(`🔄 Balance synced: ${formatNumber(newBalance)} TAMA`);
                    console.log(`✅ Balance updated: ${oldBalance} → ${newBalance}`);
                }
            }
        } catch (error) {
            console.error('❌ Failed to reload balance:', error);
        }
    }
});

// Also handle visibility change (more reliable on mobile)
document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
        // Same logic as focus event
        window.dispatchEvent(new Event('focus'));
    }
});
```

---

### Исправление 2: Проверить сохранение в slots.html

Нужно найти где slots.html обновляет баланс после выигрыша и убедиться что:

1. **Сохраняет в Supabase:**
```javascript
// Должно быть что-то такое в slots.html:
await supabase
    .from('players')
    .update({ tama_balance: newBalance })
    .eq('telegram_id', userId);
```

2. **ИЛИ использует API:**
```javascript
// Или через API:
await fetch('/api/tama/update-balance', {
    method: 'POST',
    body: JSON.stringify({ 
        telegram_id: userId, 
        balance: newBalance 
    })
});
```

---

### Исправление 3: Добавить кнопку "Refresh Balance"

**В UI (около баланса TAMA):**

```html
<button onclick="refreshBalance()" style="...">
    🔄 Sync
</button>
```

```javascript
async function refreshBalance() {
    const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
    if (!userId) {
        showMessage('❌ No user ID found');
        return;
    }

    showMessage('🔄 Syncing balance...');
    await loadFromSupabase(String(userId));
    updateUI();
    showMessage('✅ Balance synced!');
}
```

---

## 📊 ЧТО ПРОВЕРИТЬ В SLOTS.HTML:

Нужно найти в `slots.html`:

1. **Где обновляется баланс после спина:**
```javascript
// Искать что-то похожее на:
balance += winAmount;
// или
playerBalance = playerBalance + winnings;
```

2. **Есть ли сохранение в Supabase:**
```javascript
// Искать:
supabase.from('players').update(...)
// или
fetch('/api/tama/...')
```

3. **Где баланс загружается при открытии:**
```javascript
// При инициализации должно быть:
const { data } = await supabase
    .from('players')
    .select('tama_balance')
    .eq('telegram_id', userId);
```

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ:

1. ✅ **Сначала исправь SQL (убери unified_users из запроса)**
2. ⏳ **Проверь slots.html:** найди функцию сохранения баланса
3. ⏳ **Добавь focus listener** в tamagotchi-game.html
4. ⏳ **Протестируй flow:**
   - Открой игру, запомни баланс
   - Открой slots.html, сыграй, заработай TAMA
   - Вернись в игру
   - Баланс должен обновиться автоматически

---

**Хочешь я сейчас добавлю focus listener и проверю slots.html?** 🔧
