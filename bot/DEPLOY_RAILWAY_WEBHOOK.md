# 🚀 Deploy Bot to Railway (Webhook Mode)

## ✅ Преимущества Webhook Mode

- ⚡ **Мгновенные ответы** (0 задержки)
- 💰 **Бесплатно на Railway** (Web Service, не Worker!)
- 📉 **Нет лишних запросов** (только когда пользователь пишет)
- 📈 **Масштабируемость** (до 1000+ пользователей)
- ✅ **Работает 24/7** без засыпания

---

## 📋 Инструкция по деплою

### Шаг 1: Перейди на Railway

1. Открой https://railway.app
2. Войди через GitHub

---

### Шаг 2: Создай новый проект

1. **New Project** → **Deploy from GitHub repo**
2. Выбери репозиторий: `tr1h/huma-chain-xyz`
3. **Add variables** (пока НЕ деплой!)

---

### Шаг 3: Настрой Root Directory

⚠️ **ВАЖНО:** Railway должен смотреть в директорию `bot/`

1. После создания проекта → **Settings** (⚙️)
2. Найди секцию **Source**
3. **Root Directory** → введи `bot`
4. **Save Changes**

---

### Шаг 4: Добавь Environment Variables

**Settings** → **Variables** tab

Добавь следующие переменные:

```bash
# Обязательные
TELEGRAM_BOT_TOKEN=твой_токен_от_BotFather
SUPABASE_KEY=твой_supabase_anon_key

# Уже заданные (проверь что они есть)
BOT_USERNAME=GotchiGameBot
GAME_URL=https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html?v=20251108
MINT_URL=https://tr1h.github.io/huma-chain-xyz/
CHANNEL_USERNAME=@GotchiGame
MENU_BUTTON_TEXT=🎮 Gotchi Game
GROUP_ID=-1002938566588
ADMIN_IDS=7401131043
EXEMPT_GROUP_IDS=-1002938566588
TAMA_API_BASE=https://huma-chain-xyz.onrender.com/api/tama
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
```

---

### Шаг 5: Деплой!

После добавления всех переменных:
- Railway автоматически задеплоит
- Подожди 2-3 минуты

---

### Шаг 6: Проверь логи

**Deployments** → последний деплой → **View Logs**

**Ожидается:**
```
✅ Supabase connected (attempt 1)
✅ Set global menu button to: ...
🔗 Setting webhook to: https://твой-бот.up.railway.app/YOUR_BOT_TOKEN
✅ Webhook set successfully!
🚀 Starting webhook server on port 8080...
📡 Bot is ready to receive updates!
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8080
 * Running on http://10.0.0.1:8080
```

---

### Шаг 7: Получи публичный URL

Railway автоматически создаст URL:

1. **Settings** → найди секцию **Networking**
2. Скопируй **Public Domain**: `твой-бот.up.railway.app`

---

### Шаг 8: Проверь webhook

Открой в браузере:
```
https://твой-бот.up.railway.app/
```

Должно вернуть:
```json
{
  "status": "ok",
  "bot": "running"
}
```

---

### Шаг 9: Тестируй бота!

1. Открой бота в Telegram
2. Напиши `/start`
3. Бот должен ответить **мгновенно** (без задержек!)

---

## 🔧 Troubleshooting

### Бот не отвечает

1. **Проверь логи:**
   ```
   Railway → твой сервис → Logs
   ```

2. **Проверь webhook:**
   ```bash
   curl https://api.telegram.org/bot<ТВОЙ_TOKEN>/getWebhookInfo
   ```
   
   Должно быть:
   ```json
   {
     "url": "https://твой-бот.up.railway.app/YOUR_BOT_TOKEN",
     "has_custom_certificate": false,
     "pending_update_count": 0
   }
   ```

3. **Сброс webhook (если нужно):**
   ```bash
   curl https://api.telegram.org/bot<ТВОЙ_TOKEN>/deleteWebhook
   ```
   
   Затем перезапусти бота на Railway.

---

### "No WEBHOOK_HOST found"

Добавь в Variables:
```
RAILWAY_PUBLIC_DOMAIN=твой-бот.up.railway.app
```

---

### Port already in use

Railway автоматически задаст переменную `PORT`. Не меняй её!

---

## 📊 Мониторинг

**Проверка статуса:**
```
https://твой-бот.up.railway.app/
```

**Проверка webhook Telegram:**
```
https://api.telegram.org/bot<TOKEN>/getWebhookInfo
```

---

## 🎯 Production Ready!

Теперь твой бот:
- ✅ Работает 24/7 на Railway Free tier
- ✅ Мгновенно отвечает пользователям
- ✅ Масштабируется до 1000+ пользователей
- ✅ Без исходящих запросов (только входящие от Telegram)

**Готов к запуску! 🚀**

