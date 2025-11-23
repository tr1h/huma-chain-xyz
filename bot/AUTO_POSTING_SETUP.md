# 📱 Автоматический постинг в Telegram

## Что это?

Автоматическая публикация контента в Telegram канал по расписанию из `CONTENT_PLAN.md`.

---

## Как работает?

1. **Бот запускается** → Загружает расписание из `auto_posting.py`
2. **Каждую минуту** → Проверяет, есть ли посты для публикации
3. **В нужное время** → Автоматически публикует пост в канал

---

## Расписание публикаций

### **Понедельник - Motivation Monday**
- 09:00 UTC - GM пост (мотивация)
- 14:00 UTC - Еженедельная статистика
- 20:00 UTC - Sneak peek (анонсы)

### **Вторник - Tech Tuesday**
- 09:00 UTC - Объяснение токеномики
- 14:00 UTC - On-chain доказательства
- 20:00 UTC - Призыв к действию

### **Среда - Community Wednesday**
- 09:00 UTC - Community highlight
- 14:00 UTC - NFT showcase
- 20:00 UTC - Transparency reminder

### **Четверг - Throwback Thursday**
- 09:00 UTC - История и прогресс
- 14:00 UTC - Призыв к действию
- 20:00 UTC - Tutorial (как играть)

### **Пятница - Feature Friday**
- 09:00 UTC - Новые фичи
- 14:00 UTC - Burn report
- 20:00 UTC - Призыв к действию

### **Суббота - Showcase Saturday**
- 10:00 UTC - NFT showcase
- 18:00 UTC - Transparency reminder

### **Воскресенье - Sunday Stats**
- 10:00 UTC - Недельный отчёт
- 18:00 UTC - Призыв к действию

---

## Настройка

### 1. **Убедись, что бот администратор канала**

Бот должен иметь права на постинг в канале:
- Открой канал `@GotchiGame` (или твой канал)
- Добавь бота как администратора
- Дай ему право "Post messages"

### 2. **Проверь переменную окружения**

В `.env` или в Render.com:

```bash
CHANNEL_USERNAME=@GotchiGame
```

Или:

```bash
CHANNEL_USERNAME=@YourChannelName
```

### 3. **Запусти бота**

```bash
cd bot
python bot.py
```

Ты увидишь:

```
📅 Setting up auto-posting schedule...
✅ Auto-posting configured! Posts will be published automatically.
```

---

## Тестирование

### Ручная публикация (для теста)

Добавь в `bot.py`:

```python
# Test auto-posting manually
from auto_posting import AutoPoster

poster = AutoPoster(bot, CHANNEL_USERNAME)
poster.post_monday_gm()  # Опубликует тестовый пост
```

### Или через команду в боте

Можно добавить команду для админа:

```python
@bot.message_handler(commands=['testpost'])
def test_post(message):
    if message.from_user.id not in ADMIN_IDS:
        return
    
    from auto_posting import AutoPoster
    poster = AutoPoster(bot, CHANNEL_USERNAME)
    poster.post_monday_gm()
    bot.reply_to(message, "✅ Test post sent!")
```

---

## Редактирование контента

### Где редактировать тексты постов?

Файл: `bot/auto_posting.py`

Каждый пост — это отдельный метод:

```python
def post_monday_gm(self):
    """Утренний мотивационный пост"""
    posts = [
        "Текст поста 1",
        "Текст поста 2",
        "Текст поста 3"
    ]
    self.post_to_channel(random.choice(posts))
```

### Как добавить новый пост?

1. Создай метод в `AutoPoster`:

```python
def post_my_custom_post(self):
    text = "Мой кастомный пост! 🚀"
    self.post_to_channel(text)
```

2. Добавь в расписание в `setup_auto_posting()`:

```python
schedule.every().monday.at("15:00").do(poster.post_my_custom_post)
```

3. Перезапусти бота.

---

## Добавление картинок

### Способ 1: URL картинки

```python
def post_with_image(self):
    text = "Текст поста"
    photo_url = "https://solanatamagotchi.com/images/my-image.jpg"
    self.post_to_channel(text, photo_url=photo_url)
```

### Способ 2: Локальный файл

```python
def post_with_local_image(self):
    with open('image.jpg', 'rb') as photo:
        self.bot.send_photo(
            self.channel,
            photo=photo,
            caption="Текст поста",
            parse_mode='Markdown'
        )
```

---

## Статистика (динамическая)

### Интеграция с Supabase

Можно добавить реальную статистику:

```python
def post_monday_stats(self):
    # Получить данные из Supabase
    response = requests.get('https://api.solanatamagotchi.com/api/tama/stats')
    stats = response.json()
    
    text = f"📊 WEEKLY STATS 📈\n\n"
    text += f"🎨 NFTs Minted: {stats['nfts_minted']}\n"
    text += f"🔥 TAMA Burned: {stats['tama_burned']:,}\n"
    text += f"👥 New Players: {stats['new_players']}\n\n"
    text += "View live: https://solanatamagotchi.com/treasury-monitor.html\n\n"
    text += "#Stats #Solana #P2E"
    
    self.post_to_channel(text)
```

---

## Логи

### Где смотреть логи?

Бот будет писать:

```
✅ Posted to @GotchiGame
```

Или:

```
❌ Failed to post to @GotchiGame: [error message]
```

### Если пост не публикуется:

1. **Проверь права бота в канале** (должен быть админом)
2. **Проверь CHANNEL_USERNAME** (должно быть `@ChannelName`, не `-1001234567890`)
3. **Проверь логи бота** (ошибки будут показаны)

---

## Остановка автопостинга

### Временно отключить:

Закомментируй в `bot.py`:

```python
# setup_auto_posting(bot, CHANNEL_USERNAME)
```

### Отключить конкретный пост:

Закомментируй в `auto_posting.py` → `setup_auto_posting()`:

```python
# schedule.every().monday.at("09:00").do(poster.post_monday_gm)
```

---

## FAQ

### **Q: Бот публикует посты не вовремя?**
A: Проверь часовой пояс сервера. Расписание в UTC. Если сервер в другом часовом поясе, скорректируй время в `schedule.every()`.

### **Q: Как изменить время публикации?**
A: Отредактируй в `setup_auto_posting()`:
```python
schedule.every().monday.at("10:00").do(...)  # Было 09:00
```

### **Q: Можно ли публиковать в несколько каналов?**
A: Да! Вызови `setup_auto_posting()` для каждого канала:
```python
setup_auto_posting(bot, '@Channel1')
setup_auto_posting(bot, '@Channel2')
```

### **Q: Как добавить случайность во время?**
A: Используй random delay:
```python
import random
time.sleep(random.randint(0, 300))  # 0-5 минут задержки
poster.post_monday_gm()
```

---

## Пример расширения

### Добавить посты с Markdown форматированием:

```python
def post_fancy_markdown(self):
    text = """
*BOLD TEXT*
_Italic text_
`Code text`
[Link](https://example.com)

• Bullet 1
• Bullet 2
    """
    self.post_to_channel(text, parse_mode='Markdown')
```

### Добавить inline кнопки:

```python
def post_with_buttons(self):
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton("🎮 Play Now", url="https://t.me/GotchiGameBot"))
    markup.add(types.InlineKeyboardButton("📊 View Stats", url="https://solanatamagotchi.com/treasury-monitor.html"))
    
    self.bot.send_message(
        self.channel,
        "Check out our game! 🚀",
        reply_markup=markup
    )
```

---

**Готово! Бот автоматически публикует контент по расписанию 🎉**












