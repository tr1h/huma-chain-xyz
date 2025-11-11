# 🔐 Установка Telegram Bot Token

## ⚠️ ВАЖНО: Токен НЕ должен быть в коде!

**Получи токен от @BotFather:**
1. Открой @BotFather в Telegram
2. Отправь `/newbot` или выбери существующего бота
3. Скопируй токен (формат: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

---

## 🚀 Быстрый способ (PowerShell):

Открой PowerShell и выполни:

```powershell
$env:TELEGRAM_BOT_TOKEN = "YOUR_TOKEN_FROM_BOTFATHER"
cd C:\goooog\bot
.\start_bot.ps1
```

---

## ✅ Рекомендуемый способ (.env файл):

1. Создай файл `C:\goooog\bot\.env`:
```
TELEGRAM_BOT_TOKEN=YOUR_TOKEN_FROM_BOTFATHER
BOT_USERNAME=GotchiGameBot
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=твой_supabase_key
```

2. Запусти бота:
```powershell
cd C:\goooog\bot
.\start_bot.ps1
```

---

## ⚠️ ВАЖНО:

- ✅ Токен НЕ должен быть в коде
- ✅ Файл `.env` уже в `.gitignore`
- ✅ Не коммить токен в Git!

---

## 🔄 После установки:

Бот должен запуститься и показать:
```
Starting Gotchi Game Bot...
Environment variables set:
  BOT_USERNAME: GotchiGameBot
Bot started!
```

