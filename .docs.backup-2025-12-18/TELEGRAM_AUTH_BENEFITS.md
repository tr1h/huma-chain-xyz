# 🔐 Преимущества авторизации через Telegram

## ✅ Что дает авторизация через Telegram:

### **1. Для пользователей:**

#### **🎮 Единый аккаунт везде:**
- Авторизуешься один раз — работаешь везде
- Игра в Telegram боте = сайт = минтинг NFT
- Не нужно создавать отдельный аккаунт на сайте
- Сессия сохраняется на 7 дней

#### **💰 Синхронизация баланса:**
- TAMA баланс синхронизируется между ботом и сайтом
- Заработал в игре → видно на сайте
- Минтил NFT на сайте → видно в боте
- Все данные в одном месте

#### **🖼️ Управление NFT:**
- Видишь все свои NFT в одном месте
- Можешь минтить NFT за TAMA (если играл в боте)
- История всех транзакций
- Статистика по коллекции

#### **🔗 Связь кошелька:**
- ✅ **РЕАЛИЗОВАНО!** Привязываешь Phantom кошелек к Telegram аккаунту
- Кошелек сохраняется в таблице `leaderboard` (колонка `wallet_address`)
- Все NFT из кошелька видны в профиле
- Можно минтить NFT за SOL прямо на сайте
- Автоматическая синхронизация между ботом и сайтом
- **Как работает:** В `profile.html` функция `connectWallet()` обновляет `wallet_address` в базе данных для текущего Telegram ID

---

### **2. Для разработчика (статистика и управление):**

#### **📊 Сбор статистики:**

**1. Активные пользователи:**
```javascript
// Получить всех авторизованных пользователей
const { data: users } = await supabase
    .from('leaderboard')
    .select('telegram_id, telegram_username, last_active')
    .not('last_active', 'is', null)
    .order('last_active', { ascending: false });
```

**2. Конверсия (игра → сайт):**
```javascript
// Пользователи, которые играли в боте И заходили на сайт
const { data: activeUsers } = await supabase
    .from('leaderboard')
    .select('telegram_id, telegram_username, wallet_address')
    .not('wallet_address', 'is', null); // Привязали кошелек
```

**3. NFT активность:**
```javascript
// Кто минтит NFT (из бота или с сайта)
const { data: nftMinters } = await supabase
    .from('user_nfts')
    .select('telegram_id, tier_name, minted_at')
    .eq('is_active', true)
    .order('minted_at', { ascending: false });
```

**4. Трафик и источники:**
```javascript
// Откуда приходят пользователи
// Telegram WebApp (из бота) vs Telegram Widget (прямой заход)
const authMethod = window.GotchiAuth.getState().authMethod;
// 'telegram_webapp' = из бота
// 'telegram_widget' = прямой заход
// 'wallet_only' = только кошелек
```

**5. Retention (удержание):**
```javascript
// Пользователи, которые возвращаются
const { data: returningUsers } = await supabase
    .from('leaderboard')
    .select('telegram_id, telegram_username, last_active')
    .gte('last_active', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
```

---

#### **🎯 Управление пользователями:**

**1. Проверка авторизации:**
```javascript
// Проверить, авторизован ли пользователь
if (window.GotchiAuth && window.GotchiAuth.isAuthenticated()) {
    const telegramId = window.GotchiAuth.getTelegramId();
    const profile = window.GotchiAuth.getUserProfile();
    
    console.log('User:', telegramId);
    console.log('Balance:', profile.tama);
    console.log('Wallet:', profile.wallet_address);
}
```

**2. Получение данных пользователя:**
```javascript
// Получить все данные пользователя
const authState = window.GotchiAuth.getState();
console.log({
    telegramId: authState.telegramId,
    username: authState.telegramUsername,
    wallet: authState.walletAddress,
    profile: authState.userProfile
});
```

**3. Синхронизация данных:**
```javascript
// Обновить данные пользователя из базы
await window.GotchiAuth.syncProfile();
const updatedProfile = window.GotchiAuth.getUserProfile();
```

**4. Отслеживание активности:**
```javascript
// Обновить last_active при каждом действии
if (window.GotchiAuth && window.GotchiAuth.isAuthenticated()) {
    const telegramId = window.GotchiAuth.getTelegramId();
    await supabase
        .from('leaderboard')
        .update({ last_active: new Date().toISOString() })
        .eq('telegram_id', telegramId);
}
```

---

#### **📈 Аналитика:**

**1. Метрики авторизации:**
```javascript
// Сколько пользователей авторизовались через WebApp vs Widget
const webAppUsers = users.filter(u => u.auth_method === 'telegram_webapp').length;
const widgetUsers = users.filter(u => u.auth_method === 'telegram_widget').length;
const walletUsers = users.filter(u => u.auth_method === 'wallet_only').length;
```

**2. Конверсия воронка:**
```
Всего пользователей бота
    ↓
Играли в боте (есть last_active)
    ↓
Зашли на сайт (есть auth session)
    ↓
Привязали кошелек (есть wallet_address)
    ↓
Минтили NFT (есть user_nfts)
```

**3. Сегментация пользователей:**
```javascript
// По активности
const activeUsers = users.filter(u => 
    new Date(u.last_active) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
);

// По балансу TAMA
const whales = users.filter(u => u.tama > 100000);
const regular = users.filter(u => u.tama > 1000 && u.tama <= 100000);
const newbies = users.filter(u => u.tama <= 1000);

// По NFT
const nftOwners = users.filter(u => u.nft_count > 0);
const collectors = users.filter(u => u.nft_count > 5);
```

---

#### **🛠️ Управление модулем:**

**1. Инициализация:**
```javascript
// Автоматически при загрузке страницы
// Или вручную:
await window.GotchiAuth.init();
```

**2. Проверка состояния:**
```javascript
// Получить текущее состояние
const state = window.GotchiAuth.getState();
console.log('Is authenticated:', state.isAuthenticated);
console.log('Method:', state.authMethod);
console.log('Telegram ID:', state.telegramId);
```

**3. Слушатели событий:**
```javascript
// Слушать событие готовности авторизации
window.addEventListener('gotchiAuthReady', (e) => {
    const result = e.detail;
    if (result.success) {
        console.log('User authenticated via:', result.method);
        // Загрузить данные пользователя
        loadUserData();
    }
});
```

**4. Принудительная синхронизация:**
```javascript
// Обновить профиль из базы данных
const updatedProfile = await window.GotchiAuth.syncProfile();
```

**5. Очистка сессии:**
```javascript
// Выйти из аккаунта
window.GotchiAuth.clearSession();
// Перезагрузить страницу или перенаправить
window.location.reload();
```

---

## 📊 Примеры использования:

### **Пример 1: Персонализация контента**
```javascript
window.addEventListener('gotchiAuthReady', async (e) => {
    if (e.detail.success) {
        const profile = window.GotchiAuth.getUserProfile();
        
        // Показать приветствие
        document.getElementById('welcome').textContent = 
            `Welcome back, ${profile.telegram_username || 'Player'}!`;
        
        // Показать баланс
        document.getElementById('balance').textContent = 
            `${profile.tama.toLocaleString()} TAMA`;
        
        // Показать NFT
        if (profile.nft_count > 0) {
            document.getElementById('nft-badge').textContent = 
                `You own ${profile.nft_count} NFTs!`;
        }
    }
});
```

### **Пример 2: Отслеживание действий**
```javascript
function trackUserAction(action, data) {
    if (!window.GotchiAuth || !window.GotchiAuth.isAuthenticated()) {
        return; // Не авторизован
    }
    
    const telegramId = window.GotchiAuth.getTelegramId();
    
    // Отправить в аналитику
    fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            telegram_id: telegramId,
            action: action,
            data: data,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        })
    });
}

// Использование
trackUserAction('mint_nft', { tier: 'Bronze', price: 5000 });
trackUserAction('view_profile', {});
trackUserAction('connect_wallet', { wallet: '...' });
```

### **Пример 3: A/B тестирование**
```javascript
window.addEventListener('gotchiAuthReady', (e) => {
    if (e.detail.success) {
        const telegramId = window.GotchiAuth.getTelegramId();
        
        // Определить группу на основе Telegram ID
        const group = parseInt(telegramId) % 2 === 0 ? 'A' : 'B';
        
        if (group === 'A') {
            // Показать вариант A
            document.body.classList.add('variant-a');
        } else {
            // Показать вариант B
            document.body.classList.add('variant-b');
        }
        
        // Отследить в какой группе пользователь
        trackUserAction('ab_test', { group: group });
    }
});
```

### **Пример 4: Рекомендации**
```javascript
async function getRecommendations() {
    if (!window.GotchiAuth || !window.GotchiAuth.isAuthenticated()) {
        return [];
    }
    
    const profile = window.GotchiAuth.getUserProfile();
    
    // Рекомендовать NFT на основе баланса
    if (profile.tama >= 5000 && profile.nft_count === 0) {
        return ['Bronze NFT - Perfect for you!'];
    }
    
    // Рекомендовать на основе имеющихся NFT
    if (profile.has_bronze && !profile.has_silver) {
        return ['Upgrade to Silver NFT for 2.3x boost!'];
    }
    
    return [];
}
```

---

## 🎯 Практические применения:

### **1. Дашборд администратора:**
- Список всех авторизованных пользователей
- Статистика по источникам трафика
- Конверсия из бота на сайт
- Активность пользователей

### **2. Персонализация:**
- Показывать релевантный контент
- Рекомендации на основе истории
- Приветственные сообщения
- Персональные предложения

### **3. Аналитика:**
- Откуда приходят пользователи
- Какие действия они выполняют
- Где теряются в воронке
- Что мотивирует к действию

### **4. Улучшение UX:**
- Сохранение состояния между сессиями
- Быстрый доступ к данным
- Синхронизация между устройствами
- Единый аккаунт везде

---

## 📝 API модуля авторизации:

```javascript
// Проверка авторизации
window.GotchiAuth.isAuthenticated() // boolean

// Получить Telegram ID
window.GotchiAuth.getTelegramId() // string | null

// Получить адрес кошелька
window.GotchiAuth.getWalletAddress() // string | null

// Получить профиль пользователя
window.GotchiAuth.getUserProfile() // object | null

// Получить полное состояние
window.GotchiAuth.getState() // object

// Синхронизировать профиль
await window.GotchiAuth.syncProfile() // object | null

// Очистить сессию
window.GotchiAuth.clearSession() // void

// Авторизация через кошелек
await window.GotchiAuth.authViaWallet() // { success: boolean, ... }

// Проверить WebApp
window.GotchiAuth.isTelegramWebApp() // boolean
```

---

## ✅ Итого:

**Для пользователей:**
- ✅ Единый аккаунт везде
- ✅ Синхронизация данных
- ✅ Удобство использования
- ✅ Безопасность

**Для разработчика:**
- ✅ Сбор статистики
- ✅ Аналитика поведения
- ✅ Персонализация
- ✅ Управление пользователями
- ✅ Отслеживание конверсии

**Возможности:**
- 📊 Полная статистика
- 🎯 Сегментация пользователей
- 📈 Аналитика воронки
- 🛠️ Управление модулем
- 🔍 Отслеживание действий

