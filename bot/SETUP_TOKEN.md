# 🔐 Установка Telegram Bot Token

## Твой новый токен:
```
8445221254:AAE3F6Bha29dS-zzWOmJhz26K9u6lfBUu1g
```

---

## 🚀 Быстрый способ (PowerShell):

Открой PowerShell и выполни:

```powershell
$env:TELEGRAM_BOT_TOKEN = "8445221254:AAE3F6Bha29dS-zzWOmJhz26K9u6lfBUu1g"
cd C:\goooog\bot
.\start_bot.ps1
```

---

## ✅ Рекомендуемый способ (.env файл):

1. Создай файл `C:\goooog\bot\.env`:
```
TELEGRAM_BOT_TOKEN=8445221254:AAE3F6Bha29dS-zzWOmJhz26K9u6lfBUu1g
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

