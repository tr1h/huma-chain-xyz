# 🚀 БЫСТРЫЙ СТАРТ - Solana Tamagotchi Bot

## ⚡ За 5 минут до релиза!

### 1️⃣ Создай бота в Telegram:
1. Напиши @BotFather
2. `/newbot`
3. Имя: `Solana Tamagotchi`
4. Username: `solana_tamagotchi_v3_bot`
5. **СКОПИРУЙ ТОКЕН!**

### 2️⃣ Настрой .env:
Отредактируй файл `.env` - замени `your_bot_token_here` на токен от BotFather

### 3️⃣ Создай таблицы в Supabase:
1. Зайди: https://supabase.com/dashboard/project/zfrazyupameidxpjihrh
2. **SQL Editor** → **New Query**
3. Скопируй и выполни код из `supabase_setup.sql`

### 4️⃣ Запусти бота:
```bash
cd bot
pip install -r requirements.txt
python bot.py
```

### 5️⃣ Тестируй:
1. Найди бота: `@solana_tamagotchi_v3_bot`
2. `/start` → `/ref` → Получи ссылку + QR код
3. **ГОТОВО!** 🎉

## 🔥 Что работает:
- ✅ Реферальные ссылки
- ✅ QR коды
- ✅ Мгновенные TAMA награды
- ✅ 2-уровневая система
- ✅ Milestone бонусы
- ✅ Аналитика кликов
- ✅ Anti-spam защита

## 📊 Команды бота:
- `/start` - Приветствие
- `/ref` - Реферальная ссылка + QR
- `/stats` - Твоя статистика
- `/analytics` - Детальная аналитика
- `/link [wallet]` - Привязать кошелёк

## 🎯 Реферальная система:
```
Пользователь → /ref → Получает ссылку
    ↓
Друг кликает → s.html → Авторедирект в бот
    ↓
Бот находит реферера → Начисляет 100 TAMA мгновенно!
```

## 🚀 Деплой на сервер:
### Heroku:
```bash
heroku create solana-tamagotchi-bot
heroku config:set TELEGRAM_BOT_TOKEN=твой_токен
heroku config:set SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
heroku config:set SUPABASE_KEY=твой_ключ
git push heroku main
```

### VPS:
```bash
screen -S tamagotchi-bot
cd bot
python bot.py
# Ctrl+A, D для отключения
```

## ✅ Готово к релизу!
**Всё настроено и работает!** 🎉
