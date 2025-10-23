# ✅ ФИНАЛЬНЫЙ ЧЕКЛИСТ ПЕРЕД РЕЛИЗОМ

## 🎯 ОБЯЗАТЕЛЬНЫЕ ШАГИ:

### 1. Создать .env файл ⚠️
```bash
# В корне проекта создай файл .env
# Скопируй содержимое из ENV_TEMPLATE.txt
# Замени TELEGRAM_BOT_TOKEN на свой токен
```

### 2. Настроить Telegram бота 🤖
1. Напиши @BotFather
2. Команда: `/newbot`
3. Имя: `Solana Tamagotchi`
4. Username: `solana_tamagotchi_v3_bot` (или свой)
5. **СКОПИРУЙ ТОКЕН** и вставь в .env

### 3. Создать таблицы в Supabase 🗄️
1. Открой: https://supabase.com/dashboard/project/zfrazyupameidxpjihrh
2. Зайди в **SQL Editor**
3. Создай **New Query**
4. Скопируй весь код из `supabase_setup.sql`
5. Нажми **Run** (или F5)
6. Проверь в **Table Editor** что появились таблицы:
   - ✅ leaderboard
   - ✅ referrals
   - ✅ pending_referrals
   - ✅ referral_clicks
   - ✅ players

### 4. Установить зависимости 📦
```bash
cd bot
pip install -r requirements.txt
```

### 5. Запустить бота 🚀
```bash
python bot.py
```

Должно появиться: `Bot started!`

### 6. Тестирование 🧪
1. Найди бота в Telegram: `@solana_tamagotchi_v3_bot`
2. Отправь: `/start` → Приветствие
3. Отправь: `/ref` → Получи реферальную ссылку
4. Нажми: **📱 Get QR Code** → Должен сгенерироваться QR
5. Открой ссылку из `/ref` → Должен редиректить в бот

---

## 📊 ПРОВЕРКА БАЗЫ ДАННЫХ:

### В Supabase Dashboard:
1. Открой **Table Editor** → **leaderboard**
2. После `/ref` должна появиться запись с твоим `telegram_id`
3. Поле `referral_code` должно быть заполнено (например: `TAMA3F2A1C`)

---

## 🔧 TROUBLESHOOTING:

### Бот не отвечает:
- ✅ Проверь `TELEGRAM_BOT_TOKEN` в .env
- ✅ Убедись что `bot.py` запущен
- ✅ Посмотри ошибки в консоли

### Ошибка Supabase:
- ✅ Проверь `SUPABASE_URL` и `SUPABASE_KEY`
- ✅ Убедись что таблицы созданы
- ✅ Проверь статус проекта в Dashboard

### QR коды не работают:
```bash
pip install qrcode pillow
```

### Referrals не начисляются:
- ✅ Проверь таблицы `referrals` и `pending_referrals`
- ✅ Посмотри логи в консоли бота
- ✅ Проверь что `referral_code` генерируется

---

## 🎉 ГОТОВО К РЕЛИЗУ КОГДА:

- [x] ✅ .env файл создан и заполнен
- [x] ✅ Бот создан в @BotFather
- [x] ✅ Таблицы созданы в Supabase
- [x] ✅ Зависимости установлены
- [x] ✅ Бот запущен и отвечает
- [x] ✅ `/ref` работает
- [x] ✅ QR коды генерируются
- [x] ✅ Реферальные ссылки редиректят

---

## 🚀 ДЕПЛОЙ НА ПРОДАКШН:

### Heroku (рекомендую):
```bash
# В папке bot:
heroku create solana-tamagotchi-bot
heroku config:set TELEGRAM_BOT_TOKEN=твой_токен
heroku config:set SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
heroku config:set SUPABASE_KEY=твой_ключ
git push heroku main
```

### VPS:
```bash
# На сервере:
screen -S tamagotchi
cd bot
python bot.py
# Ctrl+A, D для отключения
```

---

## 📈 ПОСЛЕ РЕЛИЗА:

1. Поделись ботом в соцсетях
2. Отслеживай статистику в Supabase
3. Мониторь логи бота
4. Собери обратную связь

**УДАЧИ С РЕЛИЗОМ! 🎉🚀**
