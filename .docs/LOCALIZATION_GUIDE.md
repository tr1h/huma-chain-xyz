# 🌍 Руководство по добавлению языков (Локализация)

## 📋 Текущее состояние

На данный момент вся игра полностью на английском языке. Текст захардкожен в HTML файле `tamagotchi-game.html`.

## 🎯 Подход к локализации

### Вариант 1: Простая система (рекомендуется для начала)

Создать объект переводов и функцию для получения текстов.

#### Шаг 1: Создать файл `js/i18n.js`

```javascript
// Система переводов
const translations = {
    en: {
        // Wallet modal
        connectWallet: "🔐 Connect Wallet",
        connectWalletDesc: "Connect your Phantom or Solflare wallet to start playing and save your progress",
        connectWalletBtn: "👛 Connect Wallet",
        downloadPhantom: "Download Phantom",
        
        // Game UI
        feed: "Feed",
        play: "Play",
        heal: "Heal",
        level: "Level",
        health: "Health",
        food: "Food",
        happy: "Happy",
        
        // Quests
        clickMaster: "Click Master",
        clickYourPet: "Click your pet 50 times",
        levelUp: "Level Up!",
        reachLevel: "Reach level 5",
        
        // Games
        slotMachine: "Slot Machine 2.0",
        luckyWheel: "Lucky Wheel",
        tamaJump: "TAMA Jump",
        
        // Shop
        energyDrink: "Energy Drink",
        superPotion: "Super Potion",
        clickBooster: "Click Booster",
        autoFeeder: "Auto-Feeder",
        
        // Common
        buy: "Buy",
        back: "Back",
        save: "Save",
        cancel: "Cancel"
    },
    
    ru: {
        // Wallet modal
        connectWallet: "🔐 Подключить кошелек",
        connectWalletDesc: "Подключите кошелек Phantom или Solflare, чтобы начать играть и сохранить прогресс",
        connectWalletBtn: "👛 Подключить кошелек",
        downloadPhantom: "Скачать Phantom",
        
        // Game UI
        feed: "Кормить",
        play: "Играть",
        heal: "Лечить",
        level: "Уровень",
        health: "Здоровье",
        food: "Еда",
        happy: "Счастье",
        
        // Quests
        clickMaster: "Мастер кликов",
        clickYourPet: "Кликните по питомцу 50 раз",
        levelUp: "Повысить уровень!",
        reachLevel: "Достигните 5 уровня",
        
        // Games
        slotMachine: "Слоты 2.0",
        luckyWheel: "Колесо удачи",
        tamaJump: "TAMA Прыжок",
        
        // Shop
        energyDrink: "Энергетик",
        superPotion: "Супер зелье",
        clickBooster: "Бустер кликов",
        autoFeeder: "Автокормушка",
        
        // Common
        buy: "Купить",
        back: "Назад",
        save: "Сохранить",
        cancel: "Отмена"
    },
    
    zh: {
        // Wallet modal
        connectWallet: "🔐 连接钱包",
        connectWalletDesc: "连接您的 Phantom 或 Solflare 钱包以开始游戏并保存进度",
        connectWalletBtn: "👛 连接钱包",
        downloadPhantom: "下载 Phantom",
        
        // Game UI
        feed: "喂食",
        play: "玩耍",
        heal: "治疗",
        level: "等级",
        health: "健康",
        food: "食物",
        happy: "快乐",
        
        // Quests
        clickMaster: "点击大师",
        clickYourPet: "点击您的宠物 50 次",
        levelUp: "升级！",
        reachLevel: "达到 5 级",
        
        // Games
        slotMachine: "老虎机 2.0",
        luckyWheel: "幸运轮盘",
        tamaJump: "TAMA 跳跃",
        
        // Shop
        energyDrink: "能量饮料",
        superPotion: "超级药水",
        clickBooster: "点击加速器",
        autoFeeder: "自动喂食器",
        
        // Common
        buy: "购买",
        back: "返回",
        save: "保存",
        cancel: "取消"
    }
};

// Текущий язык (определяется автоматически или через параметр URL)
let currentLanguage = 'en';

// Определить язык пользователя
function detectLanguage() {
    // 1. Проверить параметр URL ?lang=ru
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && translations[langParam]) {
        return langParam;
    }
    
    // 2. Проверить localStorage
    const savedLang = localStorage.getItem('game_language');
    if (savedLang && translations[savedLang]) {
        return savedLang;
    }
    
    // 3. Определить по браузеру
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
        return browserLang;
    }
    
    // 4. По умолчанию английский
    return 'en';
}

// Инициализация языка
function initLanguage() {
    currentLanguage = detectLanguage();
    localStorage.setItem('game_language', currentLanguage);
    applyTranslations();
}

// Получить перевод по ключу
function t(key, defaultValue = '') {
    return translations[currentLanguage]?.[key] || translations['en']?.[key] || defaultValue || key;
}

// Применить переводы ко всей странице
function applyTranslations() {
    // Обновить все элементы с data-i18n атрибутом
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        if (element.tagName === 'INPUT' && element.type !== 'submit' && element.type !== 'button') {
            element.placeholder = translation;
        } else if (element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) {
            element.value = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Обновить title атрибуты
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key);
    });
    
    // Обновить placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

// Переключить язык
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('game_language', lang);
        applyTranslations();
        // Перезагрузить страницу для применения изменений
        window.location.reload();
    }
}

// Экспортировать в глобальную область
window.i18n = {
    t: t,
    setLanguage: setLanguage,
    getCurrentLanguage: () => currentLanguage,
    init: initLanguage,
    translations: translations
};

// Автоматическая инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
} else {
    initLanguage();
}
```

#### Шаг 2: Добавить скрипт в `tamagotchi-game.html`

```html
<!-- Добавить перед закрывающим </body> -->
<script src="js/i18n.js"></script>
```

#### Шаг 3: Заменить хардкод текста на вызовы функций

**Было:**
```html
<h2>🔐 Connect Wallet</h2>
<p>Connect your Phantom or Solflare wallet...</p>
<button>👛 Connect Wallet</button>
```

**Стало:**
```html
<h2 data-i18n="connectWallet">🔐 Connect Wallet</h2>
<p data-i18n="connectWalletDesc">Connect your Phantom or Solflare wallet...</p>
<button data-i18n="connectWalletBtn">👛 Connect Wallet</button>
```

**Или в JavaScript:**
```javascript
// Было:
element.textContent = "Connect Wallet";

// Стало:
element.textContent = window.i18n.t('connectWallet');
```

#### Шаг 4: Добавить селектор языка (опционально)

```html
<!-- Добавить в настройки игры -->
<div class="language-selector">
    <select id="language-select" onchange="window.i18n.setLanguage(this.value)">
        <option value="en">English</option>
        <option value="ru">Русский</option>
        <option value="zh">中文</option>
    </select>
</div>

<script>
// Обновить селектор при загрузке
document.getElementById('language-select').value = window.i18n.getCurrentLanguage();
</script>
```

### Вариант 2: Продвинутая система (для будущего)

- Использовать библиотеку i18next
- Загружать переводы из JSON файлов
- Поддержка плюрализации (1 клик, 2 клика, 5 кликов)
- Форматирование чисел и дат по локали

---

## 📝 Примеры использования

### В HTML:
```html
<!-- Простой текст -->
<span data-i18n="level">Level</span>

<!-- С placeholder -->
<input data-i18n-placeholder="enterName" type="text">

<!-- С title -->
<button data-i18n="feed" data-i18n-title="feedDescription">Feed</button>
```

### В JavaScript:
```javascript
// Простой перевод
const text = window.i18n.t('connectWallet');

// С подстановкой значений
const message = `${window.i18n.t('youWon')} ${amount} ${window.i18n.t('tama')}`;

// Динамическое обновление
document.getElementById('level-text').textContent = window.i18n.t('level');
```

---

## 🚀 План внедрения

1. ✅ Создать `js/i18n.js` с базовыми переводами
2. ✅ Добавить скрипт в `tamagotchi-game.html`
3. ✅ Заменить основные тексты в модальном окне кошелька
4. ✅ Добавить переводы для основных элементов UI
5. ✅ Добавить переводы для квестов и игр
6. ✅ Добавить селектор языка
7. ✅ Протестировать переключение языков

---

## 🌐 Поддерживаемые языки

- **en** - English (по умолчанию)
- **ru** - Русский
- **zh** - 中文 (Chinese)

---

## 💡 Примечания

1. **Приоритет определения языка:**
   - Параметр URL `?lang=ru`
   - Сохраненный в localStorage
   - Язык браузера
   - Английский по умолчанию

2. **Хранение:** Язык сохраняется в `localStorage.setItem('game_language', 'ru')`

3. **Добавление нового языка:** Просто добавьте объект в `translations` объект

4. **Переводы из API:** В будущем можно загружать переводы с сервера для динамического обновления

---

**Дата создания:** 2025-11-29  
**Версия:** 1.0


