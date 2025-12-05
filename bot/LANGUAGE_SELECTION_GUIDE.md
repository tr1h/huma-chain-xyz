# 🌍 Выбор языка - Как это работает

## 3 способа определения языка (по приоритету):

### 🥇 1. Выбор пользователя (ЛУЧШИЙ)
**Как:**
- Пользователь нажимает `/language`
- Выбирает 🇬🇧 English или 🇷🇺 Русский
- Сохраняется в БД в поле `preferred_language`

**Приоритет:** ВЫСШИЙ (если есть - используется всегда)

---

### 🥈 2. Telegram язык
**Как:**
- Берём из `message.from_user.language_code`
- Telegram передаёт язык из настроек телефона
- Например: `en`, `ru`, `uk`, `es`

**Приоритет:** Средний (если нет выбора пользователя)

---

### 🥉 3. Автоопределение по тексту
**Как:**
- Ищем кириллицу в сообщении
- Если есть `[а-яА-ЯёЁ]` → русский
- Иначе → английский

**Приоритет:** Низкий (фолбэк если ничего нет)

---

## 🗄️ Структура БД (добавить в Supabase)

### Таблица `telegram_users` - добавить колонку:

```sql
-- Добавить колонку для языка
ALTER TABLE telegram_users 
ADD COLUMN preferred_language VARCHAR(2) DEFAULT NULL;

-- Возможные значения: 'en', 'ru', NULL
-- NULL = язык не выбран, использовать автоопределение

-- Добавить индекс для быстрого поиска
CREATE INDEX idx_telegram_users_language 
ON telegram_users(preferred_language);
```

---

## 📝 Как использовать в коде:

### 1. При получении сообщения:

```python
from localization import detect_language, t
from language_selector import create_language_keyboard, get_language_selection_message

@bot.message_handler(commands=['start'])
def start(message):
    user_id = message.from_user.id
    
    # Получаем язык пользователя
    user_data = get_user_from_db(user_id)  # Твоя функция
    saved_lang = user_data.get('preferred_language')  # Из БД
    telegram_lang = message.from_user.language_code  # Из Telegram
    
    # Определяем язык по приоритету
    if saved_lang:
        lang = saved_lang  # 1. Выбор пользователя
    elif telegram_lang and telegram_lang.startswith('ru'):
        lang = 'ru'  # 2. Telegram язык
    else:
        lang = detect_language(message.text)  # 3. Автоопределение
    
    # Отправляем сообщение на нужном языке
    welcome_text = t('start', lang)
    bot.send_message(user_id, welcome_text, parse_mode='Markdown')
```

---

### 2. Команда смены языка:

```python
from language_selector import (
    create_language_keyboard, 
    get_language_selection_message,
    handle_language_callback,
    get_language_changed_message
)

@bot.message_handler(commands=['language'])
def choose_language(message):
    """Allow user to choose their preferred language"""
    user_id = message.from_user.id
    
    # Получаем текущий язык
    user_data = get_user_from_db(user_id)
    current_lang = user_data.get('preferred_language', 'en')
    
    # Показываем меню выбора
    text = get_language_selection_message(current_lang)
    keyboard = create_language_keyboard()
    
    bot.send_message(
        user_id, 
        text, 
        reply_markup=keyboard,
        parse_mode='Markdown'
    )


@bot.callback_query_handler(func=lambda call: call.data.startswith('lang_'))
def handle_language_selection(call):
    """Handle language selection from inline keyboard"""
    user_id = call.from_user.id
    
    # Получаем выбранный язык
    new_lang = handle_language_callback(call.data)  # 'en' or 'ru'
    
    # Сохраняем в БД
    save_user_language(user_id, new_lang)  # Твоя функция
    
    # Подтверждение
    confirmation = get_language_changed_message(new_lang)
    bot.answer_callback_query(call.id, "✅")
    bot.edit_message_text(
        confirmation,
        call.message.chat.id,
        call.message.message_id,
        parse_mode='Markdown'
    )
    
    # Показываем обновлённый /start
    start_text = t('start', new_lang)
    bot.send_message(user_id, start_text, parse_mode='Markdown')
```

---

### 3. Функции для работы с БД:

```python
def get_user_language(user_id: int) -> str:
    """
    Get user's preferred language from database
    
    Args:
        user_id: Telegram user ID
    
    Returns:
        Language code ('en', 'ru') or None if not set
    """
    try:
        response = supabase.table('telegram_users') \
            .select('preferred_language') \
            .eq('telegram_id', user_id) \
            .execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0].get('preferred_language')
    except Exception as e:
        print(f"Error getting user language: {e}")
    
    return None


def save_user_language(user_id: int, lang: str) -> bool:
    """
    Save user's language preference to database
    
    Args:
        user_id: Telegram user ID
        lang: Language code ('en' or 'ru')
    
    Returns:
        True if saved successfully, False otherwise
    """
    try:
        # Update or insert
        response = supabase.table('telegram_users') \
            .upsert({
                'telegram_id': user_id,
                'preferred_language': lang,
                'updated_at': 'now()'
            }) \
            .execute()
        
        return True
    except Exception as e:
        print(f"Error saving user language: {e}")
        return False
```

---

## 🎨 Как это выглядит для пользователя:

### При первом запуске:

```
User: /start

Bot: 🎮 Welcome to Solana Tamagotchi!
     Remember your childhood? Now with earnings! 🐾
     
     [Игра показывается на английском по умолчанию]
     
     💡 You can change language anytime using /language command
```

---

### При смене языка:

```
User: /language

Bot: 🌍 Choose Your Language / Выбери язык
     Select your preferred language for bot messages:
     
     [🇬🇧 English] [🇷🇺 Русский]

User: *нажимает 🇷🇺 Русский*

Bot: ✅ Язык изменён на русский!
     
     🎮 Добро пожаловать в Solana Tamagotchi!
     Помнишь детство? Теперь с заработком! 🐾
     ...
```

---

### После выбора языка:

```
User: /help

Bot: 📚 Команды Solana Tamagotchi
     
     Игровые команды:
     /start - Начать играть
     /stats - Твоя статистика
     ...
     
     [ВСЁ НА РУССКОМ!]
```

---

## ✅ Преимущества этого подхода:

1. **Гибкость** - 3 уровня определения языка
2. **UX** - пользователь выбирает язык 1 раз
3. **Простота** - понятный интерфейс с флагами
4. **Масштабируемость** - легко добавить 🇪🇸 🇨🇳 🇩🇪
5. **Fallback** - если язык не выбран, работает автоопределение

---

## 🚀 Порядок внедрения:

### Шаг 1: Обновить БД (5 мин)
```sql
ALTER TABLE telegram_users 
ADD COLUMN preferred_language VARCHAR(2) DEFAULT NULL;
```

### Шаг 2: Добавить функции работы с БД (10 мин)
- `get_user_language(user_id)`
- `save_user_language(user_id, lang)`

### Шаг 3: Интегрировать в команды (15 мин)
- Обновить `/start`, `/help`, `/stats` с определением языка
- Добавить команду `/language`
- Добавить обработчик кнопок `lang_en` / `lang_ru`

### Шаг 4: Добавить подсказку о языке (5 мин)
В конец сообщения `/start` добавить:
```
💡 You can change language anytime using /language command
💡 Ты можешь изменить язык командой /language
```

---

## 📊 Метрики для отслеживания:

После внедрения смотри:
- Сколько % пользователей выбирают русский
- Retention пользователей с выбранным языком vs автоопределением
- Время в игре RU vs EN пользователей

**Гипотеза:** 
- 60-70% выберут русский
- Retention RU пользователей будет на 20-30% выше

---

## 🎯 Итого:

**Время внедрения:** 30-40 минут  
**Риск:** 🟢 Минимальный  
**Эффект:** 🚀 Огромный (твой брат сразу поймёт!)  

**Готов начать?** 💪

