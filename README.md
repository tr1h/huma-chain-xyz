# 🐾 Solana Tamagotchi - Ultimate Play-to-Earn NFT Pet Game

**GitHub**: https://github.com/tr1h/huma-chain-xyz

Полноценная блокчейн игра на Solana с NFT питомцами, Play-to-Earn механикой и Telegram ботом!

## 🎮 Возможности

### Игра
- 🐾 **10 типов питомцев** - Cat, Dog, Dragon, Fox, Bear, Rabbit, Panda, Lion, Unicorn, Wolf
- ⭐ **5 стадий эволюции** - от Egg до Legendary
- 💰 **Play-to-Earn** - зарабатывай TAMA токены играя
- 🏆 **Achievements система** - 15+ достижений
- 🎮 **Click-to-Earn** - кликай на питомца и получай XP
- 📊 **Leaderboard** - глобальная таблица лидеров

### NFT Система
- 🖼️ **100 уникальных NFT** - разные типы, редкость и черты
- 🎨 **Candy Machine** - минт через Metaplex
- 💎 **Редкость** - Common, Uncommon, Rare, Epic, Legendary

### Реферальная система
- 🔗 **2-уровневая** - 100 TAMA за Level 1, 50 TAMA за Level 2
- 📱 **QR коды** - для офлайн распространения
- 🎁 **Milestone бонусы** - до 100,000 TAMA за 100 рефералов
- ⚡ **Мгновенные награды** - TAMA начисляется сразу (БЕЗ кошелька!)
- 📊 **Аналитика** - детальная статистика кликов и конверсий

### Telegram Бот
- 🤖 **Полнофункциональный** - модерация, статистика, управление
- 📱 **Интеграция** - связь кошелька с Telegram
- 🛡️ **Anti-spam защита** - автоматическая модерация
- 👥 **Команды для групп** - /game, /leaderboard, /info

## 🚀 Быстрый старт

### 1. Настройка окружения
```bash
# Создайте .env файл из шаблона
copy ENV_TEMPLATE.txt .env

# Отредактируйте .env - добавьте токен бота
```

### 2. Настройка Supabase
```bash
# Зайдите в Supabase Dashboard
# SQL Editor → Выполните код из sql/supabase_setup.sql
```

### 3. Запуск бота
```bash
cd bot
pip install -r requirements.txt
python bot.py
```

### 4. Запуск сайта
```bash
# Откройте index.html в браузере
# Или деплойте на GitHub Pages / Vercel
```

## 📁 Структура проекта

```
solana-tamagotchi/
├── bot/                    # Telegram бот
│   ├── bot.py             # Основной код бота
│   ├── requirements.txt   # Python зависимости
│   └── README.md          # Документация бота
├── api/                   # Backend API
│   ├── config.php         # Конфигурация БД
│   ├── referrals.php      # API рефералов
│   └── track_click.php    # Отслеживание кликов
├── js/                    # Frontend JavaScript
│   ├── game.js            # Игровая логика
│   ├── wallet.js          # Phantom wallet
│   ├── referral-system.js # Реферальная система
│   └── telegram.js        # Telegram интеграция
├── css/                   # Стили
│   ├── main.css
│   ├── animations.css
│   └── mobile.css
├── nft-assets/            # NFT метаданные (100 штук)
│   ├── 0.json, 0.png
│   └── ...
├── docs/                  # Документация
│   ├── ADMIN_PANEL_SETUP.md
│   ├── REFERRAL_SYSTEM_SETUP.md
│   └── SETUP_API.md
├── sql/                   # SQL скрипты
│   └── supabase_setup.sql # Схема БД
├── .env                   # Конфигурация (НЕ коммитить!)
├── index.html             # Главная страница
├── mint.html              # Страница минта
├── FINAL_CHECKLIST.md     # Чеклист запуска
└── README.md             # Этот файл
```

## 🗄️ База данных (Supabase)

### Таблицы:
- **leaderboard** - игроки, питомцы, баланс TAMA
- **referrals** - активные рефералы
- **pending_referrals** - ожидающие рефералы
- **referral_clicks** - аналитика кликов
- **players** - игровая статистика

## 🤖 Telegram бот

### Команды для пользователей:
- `/start` - Начать работу с ботом
- `/ref` - Получить реферальную ссылку + QR код
- `/stats` - Ваша статистика
- `/analytics` - Детальная аналитика рефералов
- `/link [wallet]` - Привязать кошелёк

### Команды для админов:
- `/mute` - Замутить пользователя
- `/ban` - Забанить
- `/broadcast` - Отправить сообщение в канал

## 📊 Реферальная система

### Как работает:
1. Пользователь `/ref` в боте → Получает ссылку
2. Друг кликает → `s.html?ref=TAMA123` → Редирект в бот
3. Бот начисляет 100 TAMA мгновенно (БЕЗ кошелька!)
4. Когда новый юзер подключит кошелёк → Переносит в основную базу

### Награды:
- **Level 1**: 100 TAMA за прямого реферала
- **Level 2**: 50 TAMA за реферала реферала
- **Milestones**: 
  - 5 → 1,000 TAMA
  - 10 → 3,000 TAMA
  - 25 → 10,000 TAMA
  - 50 → 30,000 TAMA
  - 100 → 100,000 TAMA + Badge

## 🔧 Технологии

### Frontend:
- HTML5, CSS3, JavaScript (Vanilla)
- Solana Web3.js
- Metaplex Umi
- Phantom Wallet

### Backend:
- Python (Telegram bot)
- PHP (API)
- Supabase (PostgreSQL)

### Blockchain:
- Solana Devnet/Mainnet
- Metaplex Candy Machine
- SPL Token (TAMA)

## 📚 Документация

- [Финальный чеклист](FINAL_CHECKLIST.md) - Запуск бота
- [Настройка Supabase](SUPABASE_SETUP.md) - База данных
- [Быстрый старт](QUICK_START.md) - За 5 минут
- [Деплой бота](bot/DEPLOY.md) - Production деплой

## 🚀 Деплой

### Heroku (бот):
```bash
cd bot
heroku create solana-tamagotchi-bot
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_KEY=your_key
git push heroku main
```

### Vercel (сайт):
```bash
vercel --prod
```

### GitHub Pages (сайт):
```bash
# Settings → Pages → Deploy from branch: main
```

## 🔒 Безопасность

- ✅ Anti-spam защита в боте
- ✅ Self-referral защита
- ✅ Rate limiting на API
- ✅ Валидация wallet адресов
- ✅ RLS policies в Supabase

## 📝 License

MIT License

## 🤝 Контакты

- **Telegram**: @solana_tamagotchi_v3_bot
- **GitHub**: https://github.com/tr1h/huma-chain-xyz

---

**Made with ❤️ for Solana community!** 🚀
