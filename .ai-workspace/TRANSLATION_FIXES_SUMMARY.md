# 🔧 Translation Fixes Summary

## ✅ ЧТО СДЕЛАНО:

1. ✅ Добавлены переводы для всех кнопок (EN/RU/ZH/ES) в `submenu_translations.py`
2. ✅ Обновлён `send_welcome` - добавлен ES язык
3. ✅ Обновлён `handle_language_selection_callback` - добавлены ZH и ES
4. ✅ Обновлён callback handler `my_nfts` - полный перевод
5. ✅ Исправлен `back_to_menu` handler

## ⏳ ЧТО НУЖНО СДЕЛАТЬ:

### 1. Заменить все хардкод "Back to Menu" (6 мест):

**Файл:** `bot/bot.py`

**Места:**
- Строка 4334 (get_referral callback)
- Строка 4629 (withdraw_tama callback)  
- Строка 5081 (my_stats callback)
- Строка 5174 (leaderboard callback)
- Строка 5190 (leaderboard callback - error case)
- Строка 5238 (rules callback)

**Заменить:**
```python
types.InlineKeyboardButton("🔙 Back to Menu", callback_data="back_to_menu")
```

**На:**
```python
lang = get_user_language(call.from_user.id) or 'en'
types.InlineKeyboardButton(get_button_text(lang, 'back_to_menu'), callback_data="back_to_menu")
```

---

### 2. Обновить callback handlers с переводами:

#### A. `mint_nft` (строка 4679)
- Добавить получение языка: `lang = get_user_language(call.from_user.id) or 'en'`
- Использовать переведённые тексты для кнопок
- Использовать `get_button_text(lang, 'back_to_menu')`

#### B. `withdraw_tama` (строка 4456)
- Добавить получение языка
- Перевести все тексты (уже частично есть)
- Использовать `get_button_text()` для кнопок

#### C. `view_quests` (строка 5401)
- Использовать `get_quests_text()` из `submenu_translations.py`
- Добавить переведённые кнопки

#### D. `view_badges` (строка 5326)
- Использовать `get_badges_text()` из `submenu_translations.py`
- Добавить переведённые кнопки

#### E. `view_rank` (строка 5356)
- Использовать `get_rank_text()` из `submenu_translations.py`
- Добавить переведённые кнопки

#### F. `leaderboard` (строка 5020)
- Добавить переводы для текстов
- Использовать `get_button_text()` для кнопок

---

### 3. Добавить переводы для текстов в submenu:

**Файл:** `bot/submenu_translations.py`

Нужно добавить функции:
- `get_my_nfts_text(lang, ...)` - для текста "My NFTs"
- `get_withdraw_text(lang, ...)` - для текста "Withdraw TAMA"
- `get_leaderboard_text(lang, ...)` - для текста "Leaderboard"

---

## 🎯 ПРИОРИТЕТ:

1. **КРИТИЧНО:** Заменить все "Back to Menu" на переведённые версии
2. **ВАЖНО:** Обновить `leaderboard`, `view_quests`, `view_badges`, `view_rank`
3. **ЖЕЛАТЕЛЬНО:** Обновить `mint_nft` и `withdraw_tama`

---

## 📝 ШАБЛОН ДЛЯ ОБНОВЛЕНИЯ CALLBACK HANDLER:

```python
elif call.data == "callback_name":
    telegram_id = str(call.from_user.id)
    lang = get_user_language(call.from_user.id) or 'en'  # ← ДОБАВИТЬ
    
    try:
        # ... existing code ...
        
        # Использовать переведённые тексты
        texts = {
            'en': {'key': 'English text'},
            'ru': {'key': 'Русский текст'},
            'zh': {'key': '中文文本'},
            'es': {'key': 'Texto español'}
        }
        t = texts.get(lang, texts['en'])
        
        # ... use t['key'] in text ...
        
        keyboard = types.InlineKeyboardMarkup()
        keyboard.row(
            types.InlineKeyboardButton(get_button_text(lang, 'button_key'), callback_data="callback_data")
        )
        keyboard.row(
            types.InlineKeyboardButton(get_button_text(lang, 'back_to_menu'), callback_data="back_to_menu")
        )
        
        # ... send message ...
    except Exception as e:
        # ... error handling ...
```

---

**Последнее обновление:** 11 декабря 2024

