# 🚀 Настройка Supabase для Solana Tamagotchi

## 📋 Шаг 1: Получение ключей Supabase

1. Зайдите в ваш проект: https://supabase.com/dashboard/project/zfrazyupameidxpjihrh
2. Перейдите в **Settings** → **API**
3. Скопируйте:
   - **Project URL**: `https://zfrazyupameidxpjihrh.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📋 Шаг 2: Создание таблиц

1. В Supabase Dashboard перейдите в **SQL Editor**
2. Скопируйте и выполните код из файла `supabase_setup.sql`
3. Проверьте что все таблицы созданы в **Table Editor**

## 📋 Шаг 3: Настройка .env файла

Создайте файл `.env` в корне проекта:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=ваш_токен_от_botfather

# Supabase Configuration
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=ваш_anon_public_ключ

# Game URLs
GAME_URL=https://tr1h.github.io/solana-tamagotchi/
MINT_URL=https://tr1h.github.io/solana-tamagotchi/

# Admin Configuration
ADMIN_IDS=ваш_telegram_id
```

## 📋 Шаг 4: Тестирование

### Запуск бота:
```bash
cd bot
pip install -r requirements.txt
python bot.py
```

### Проверка в Telegram:
1. Найдите бота: `@solana_tamagotchi_v3_bot`
2. Отправьте `/start`
3. Отправьте `/ref` - должна появиться реферальная ссылка
4. Нажмите "📱 Get QR Code" - должен сгенерироваться QR код

## 📋 Шаг 5: Проверка базы данных

В Supabase Dashboard → **Table Editor** проверьте:

### Таблица `leaderboard`:
- Должна содержать данные игроков
- Поля: `wallet_address`, `telegram_id`, `tama`, `referral_code`

### Таблица `referrals`:
- Активные рефералы
- Поля: `referrer_telegram_id`, `referred_telegram_id`, `signup_reward`

### Таблица `pending_referrals`:
- Ожидающие рефералы
- Поля: `referrer_telegram_id`, `referred_telegram_id`, `status`

### Таблица `referral_clicks`:
- Аналитика кликов
- Поля: `referral_code`, `clicked_at`, `ip_address`

## 🔧 Troubleshooting

### Бот не отвечает:
- Проверьте `TELEGRAM_BOT_TOKEN` в .env
- Убедитесь что бот запущен: `python bot.py`

### Ошибки Supabase:
- Проверьте `SUPABASE_URL` и `SUPABASE_KEY`
- Убедитесь что таблицы созданы
- Проверьте RLS policies в **Authentication** → **Policies**

### Referrals не работают:
- Проверьте что таблица `referrals` создана
- Убедитесь что поля `telegram_id` есть в `leaderboard`

## 📊 Аналитика

### Просмотр статистики:
1. В Supabase Dashboard → **SQL Editor**
2. Выполните запрос:
```sql
SELECT * FROM referral_analytics;
```

### Просмотр кликов:
```sql
SELECT * FROM click_analytics;
```

## 🚀 Деплой

### Heroku (для аналитики API):
```bash
# Создайте Procfile в папке api:
echo "web: python supabase_analytics.py" > Procfile

# Деплой:
heroku create solana-tamagotchi-analytics
heroku config:set SUPABASE_URL=ваш_url
heroku config:set SUPABASE_KEY=ваш_ключ
git push heroku main
```

### VPS:
```bash
# Установите зависимости:
pip install flask flask-cors supabase

# Запустите API:
cd api
python supabase_analytics.py
```

## ✅ Готово!

Теперь у вас:
- ✅ Единая база данных Supabase
- ✅ Telegram бот с реферальной системой
- ✅ QR коды для рефералов
- ✅ Аналитика кликов
- ✅ 2-уровневая система вознаграждений
- ✅ Milestone бонусы

**Можно релизить! 🎉**
