# 🚀 Deploy Bot to Render (Webhook Mode)

## ✅ Преимущества Render

- 💰 **Бесплатно** (Free tier для Web Services)
- ⚡ **Webhook mode** работает отлично
- 📈 **Масштабируемость** (до 1000+ пользователей)
- 🔄 **Автоматические деплои** (git push → deploy)
- ✅ **Работает 24/7** без засыпания

---

## 📋 Инструкция по деплою

### Шаг 1: Открой Render Dashboard

1. Войди на https://render.com
2. Войди через GitHub

---

### Шаг 2: Создай новый Web Service

**Вариант A: Через Blueprint (автоматически)**

1. **New** → **Blueprint**
2. **Connect GitHub repo:** `tr1h/huma-chain-xyz`
3. Render найдет `render.yaml` и создаст **2 сервиса:**
   - ✅ `huma-chain-xyz-api` (уже есть)
   - 🆕 `huma-chain-xyz-bot` (новый!)

4. **Добавь секретные переменные:**
   - `TELEGRAM_BOT_TOKEN` (твой токен от @BotFather)
   - `SUPABASE_KEY` (anon key)

5. **Apply** → Render задеплоит оба сервиса!

---

**Вариант B: Вручную (если Blueprint не сработал)**

1. **New** → **Web Service**
2. **Repository:** `tr1h/huma-chain-xyz`
3. **Name:** `huma-chain-xyz-bot`
4. **Region:** Oregon (или ближайший)
5. **Branch:** `main`
6. **Root Directory:** `bot` ⚠️ **ВАЖНО!**
7. **Build Command:** `pip install -r bot/requirements.txt`
8. **Start Command:** `python bot.py`
9. **Plan:** Free

10. **Environment Variables** (добавь все):
```
TELEGRAM_BOT_TOKEN = твой_токен_от_BotFather
BOT_USERNAME = GotchiGameBot
GAME_URL = https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html?v=20251108
MINT_URL = https://tr1h.github.io/huma-chain-xyz/
CHANNEL_USERNAME = @GotchiGame
MENU_BUTTON_TEXT = 🎮 Gotchi Game
GROUP_ID = -1002938566588
ADMIN_IDS = 7401131043
EXEMPT_GROUP_IDS = -1002938566588
TAMA_API_BASE = https://huma-chain-xyz.onrender.com/api/tama
SUPABASE_URL = https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY = твой_supabase_anon_key
RENDER = true
```

11. **Create Web Service**

---

### Шаг 3: Проверь деплой

**Render Dashboard** → твой сервис `huma-chain-xyz-bot` → **Logs**

**Ожидается:**
```
✅ Supabase connected (attempt 1)
✅ Bot started!
🔗 Setting webhook to: https://huma-chain-xyz-bot.onrender.com/8445221254:AAE...
✅ Webhook set successfully!
🚀 Starting webhook server on port 10000...
📡 Bot is ready to receive updates!
```

---

### Шаг 4: Получи публичный URL

**Render Dashboard** → твой сервис → **Settings**

Найди **Service URL**: `https://huma-chain-xyz-bot.onrender.com`

---

### Шаг 5: Проверь health endpoint

Открой в браузере:
```
https://huma-chain-xyz-bot.onrender.com/
```

Должно вернуть:
```json
{
  "status": "ok",
  "bot": "running"
}
```

---

### Шаг 6: Тестируй бота!

1. Открой бота в Telegram
2. Напиши `/start`
3. Бот должен ответить **мгновенно**! ⚡

---

## 🔧 Troubleshooting

### Бот не отвечает

1. **Проверь логи:**
   ```
   Render Dashboard → твой сервис → Logs
   ```

2. **Проверь webhook:**
   ```bash
   curl https://api.telegram.org/bot<ТВОЙ_TOKEN>/getWebhookInfo
   ```
   
   Должно быть:
   ```json
   {
     "url": "https://huma-chain-xyz-bot.onrender.com/8445221254:AAE...",
     "has_custom_certificate": false,
     "pending_update_count": 0
   }
   ```

3. **Сброс webhook (если нужно):**
   ```bash
   curl https://api.telegram.org/bot<ТВОЙ_TOKEN>/deleteWebhook
   ```
   
   Затем перезапусти бота на Render.

---

### "No WEBHOOK_HOST found"

Render автоматически задает `RENDER_EXTERNAL_HOSTNAME`. Если не работает:
- Проверь что сервис типа **Web Service** (не Worker!)
- Проверь что переменная `RENDER=true` установлена

---

### Port already in use

Render автоматически задает переменную `PORT`. Не меняй её!

---

## 📊 Мониторинг

**Проверка статуса:**
```
https://huma-chain-xyz-bot.onrender.com/
```

**Проверка webhook Telegram:**
```
https://api.telegram.org/bot<TOKEN>/getWebhookInfo
```

---

## 🎯 Production Ready!

Теперь твой бот:
- ✅ Работает 24/7 на Render Free tier
- ✅ Мгновенно отвечает пользователям
- ✅ Масштабируется до 1000+ пользователей
- ✅ Без исходящих запросов (только входящие от Telegram)
- ✅ **БЕСПЛАТНО навсегда!**

**Готов к запуску! 🚀**

