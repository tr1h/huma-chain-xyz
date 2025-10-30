# 🎨 BOT WELCOME IMAGE GUIDE

## 📱 КРАСИВАЯ ВИЗИТКА БОТА

### **ЧТО НУЖНО:**
Создать красивую картинку для приветствия бота (как у DegenPhone)

### **РАЗМЕР:**
- **1200x628 px** (стандартный размер для Telegram)
- **Формат:** PNG с прозрачностью

---

## 🎨 ДИЗАЙН ЭЛЕМЕНТЫ:

### **1. ФОН:**
- Градиент: синий → фиолетовый → розовый
- Или: темно-синий → голубой
- Современный, яркий, привлекательный

### **2. ГЛАВНЫЙ ЭЛЕМЕНТ:**
- **Телефон** с экраном игры
- Или **3D питомец** (Kawai/Retro/Cyber)
- Или **Комбинация** телефона + питомца

### **3. ТЕКСТ:**
```
🎮 Solana Tamagotchi
Play • Earn • Grow

Your Pet is Waiting! 🐾
```

### **4. ЭФФЕКТЫ:**
- Свечение вокруг телефона/питомца
- Блики и отражения
- TAMA токены летают вокруг
- Звездочки и частицы

---

## 🛠️ КАК СОЗДАТЬ:

### **ВАРИАНТ 1 - CANVA (САМЫЙ ПРОСТОЙ):**

1. Зайти на [canva.com](https://canva.com)
2. Создать дизайн **1200x628 px**
3. Выбрать шаблон "App Banner" или "Game Banner"
4. Добавить:
   - Градиентный фон
   - Изображение телефона (из библиотеки Canva)
   - Текст с эмодзи
   - Эффекты свечения
5. Скачать как PNG

**Готовые шаблоны в Canva:**
- "Mobile App Banner"
- "Gaming App Promo"
- "Crypto App Banner"

---

### **ВАРИАНТ 2 - FIGMA (ПРОФЕССИОНАЛЬНЫЙ):**

1. Создать артборд **1200x628 px**
2. Добавить градиент фон:
   ```
   Linear Gradient:
   - Start: #1e3a8a (dark blue)
   - End: #9333ea (purple)
   ```
3. Добавить изображение телефона
4. Добавить питомца из игры
5. Добавить текст:
   - Заголовок: **Solana Tamagotchi** (48px, Bold)
   - Подзаголовок: **Play • Earn • Grow** (24px, Regular)
   - CTA: **Your Pet is Waiting! 🐾** (32px, Bold)
6. Добавить эффекты:
   - Drop Shadow: 0px 10px 30px rgba(0,0,0,0.3)
   - Glow: 0px 0px 20px rgba(147,51,234,0.5)
7. Экспортировать как PNG

---

### **ВАРИАНТ 3 - AI ГЕНЕРАТОР (БЫСТРЫЙ):**

**Промпт для Midjourney:**
```
Create a vibrant Telegram bot welcome banner featuring a smartphone 
displaying a cute Tamagotchi pet game. Include Solana blockchain 
elements, TAMA tokens floating around, gradient background 
(blue to purple), modern UI design, gaming aesthetic, 
professional quality, 1200x628px --ar 1200:628 --v 6
```

**Промпт для DALL-E 3:**
```
Create a professional Telegram bot banner (1200x628px) for 
Solana Tamagotchi game. Show a modern smartphone with cute 
pixel art Tamagotchi pet on screen. Vibrant gradient background 
(blue to purple). Add floating TAMA tokens, sparkles, and glow 
effects. Text: "Solana Tamagotchi - Play • Earn • Grow". 
Gaming aesthetic, modern design, high quality.
```

**Промпт для Stable Diffusion:**
```
telegram bot banner, mobile game app, cute tamagotchi pet, 
smartphone mockup, gradient background blue purple, 
crypto tokens floating, modern ui design, professional quality, 
1200x628 resolution, gaming aesthetic, vibrant colors, 
glow effects, sparkles, text "Solana Tamagotchi"
```

---

## 📁 КУДА СОХРАНИТЬ:

После создания картинки:
1. Сохранить как `bot_welcome.png`
2. Положить в папку `solana-tamagotchi/bot/assets/`
3. Если папки нет - создать:
   ```bash
   mkdir solana-tamagotchi/bot/assets
   ```

---

## 🔧 КАК ИСПОЛЬЗОВАТЬ В БОТЕ:

Картинка уже настроена в коде бота!

**Чтобы отправлять картинку при старте:**

```python
# В функции handle_start добавить:
try:
    photo = open('assets/bot_welcome.png', 'rb')
    bot.send_photo(
        message.chat.id,
        photo,
        caption=welcome_text,
        parse_mode='Markdown',
        reply_markup=keyboard
    )
except Exception as e:
    # Если картинки нет - отправить просто текст
    bot.reply_to(message, welcome_text, parse_mode='Markdown', reply_markup=keyboard)
```

---

## 🎯 ПРИМЕРЫ ДИЗАЙНА:

### **Стиль 1 - Минималистичный:**
- Простой градиент фон
- Один питомец в центре
- Минимум текста
- Чистый дизайн

### **Стиль 2 - Динамичный:**
- Яркий градиент
- Телефон + питомец
- Много эффектов
- Энергичный вид

### **Стиль 3 - Профессиональный:**
- Темный фон
- 3D элементы
- Реалистичные эффекты
- Корпоративный стиль

---

## ✅ ЧЕКЛИСТ:

- [ ] Создать картинку 1200x628 px
- [ ] Добавить градиентный фон
- [ ] Добавить главный элемент (телефон/питомец)
- [ ] Добавить текст с эмодзи
- [ ] Добавить эффекты (свечение, блики)
- [ ] Сохранить как PNG
- [ ] Положить в `bot/assets/bot_welcome.png`
- [ ] Протестировать в боте

---

## 🚀 ГОТОВО!

После создания картинки бот будет выглядеть профессионально и привлекательно!

**Нужна помощь?** Пиши в чат!




