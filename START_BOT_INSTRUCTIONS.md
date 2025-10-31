# 🤖 КАК ЗАПУСКАТЬ БОТА

## 🚨 ВАЖНО: Environment Variables!

Бот НУЖДАЕТСЯ в environment variables для работы withdrawal!

---

## ✅ ПРАВИЛЬНЫЙ СПОСОБ ЗАПУСКА:

### Вариант 1: PowerShell скрипт (рекомендуется)

**1. Отредактируй `solana-tamagotchi/bot/start_bot.ps1`:**

Найди строки и укажи свои Supabase credentials:
```powershell
$env:SUPABASE_URL = "YOUR_SUPABASE_URL"  # ← ЗАМЕНИ!
$env:SUPABASE_KEY = "YOUR_SUPABASE_KEY"  # ← ЗАМЕНИ!
```

**2. Запусти:**
```powershell
cd C:\goooog\solana-tamagotchi\bot
.\start_bot.ps1
```

---

### Вариант 2: Вручную (каждый раз)

```powershell
# Установи переменные
$env:TELEGRAM_BOT_TOKEN="8445221254:AAHxX7NCDv3K14LTnAQkM69Lg4QCckFh-E8"
$env:BOT_USERNAME="GotchiGameBot"
$env:TAMA_MINT_ADDRESS="Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY"
$env:SOLANA_RPC_URL="https://api.devnet.solana.com"
$env:SOLANA_PAYER_KEYPAIR_PATH="C:\goooog\payer-keypair.json"
$env:SOLANA_MINT_KEYPAIR_PATH="C:\goooog\payer-keypair.json"
$env:SUPABASE_URL="your_url_here"
$env:SUPABASE_KEY="your_key_here"

# Запусти бота
cd C:\goooog\solana-tamagotchi\bot
python bot.py
```

---

### Вариант 3: .env файл (самый удобный)

**1. Создай файл `.env` в `solana-tamagotchi/bot/`:**

```env
TELEGRAM_BOT_TOKEN=8445221254:AAHxX7NCDv3K14LTnAQkM69Lg4QCckFh-E8
BOT_USERNAME=GotchiGameBot
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PAYER_KEYPAIR_PATH=C:\goooog\payer-keypair.json
SOLANA_MINT_KEYPAIR_PATH=C:\goooog\payer-keypair.json
SUPABASE_URL=your_url_here
SUPABASE_KEY=your_key_here
```

**2. Установи python-dotenv:**
```powershell
pip install python-dotenv
```

**3. Запусти:**
```powershell
cd C:\goooog\solana-tamagotchi\bot
python bot.py
```

Бот автоматически загрузит .env файл!

---

## 🔍 КАК УЗНАТЬ СВОИ SUPABASE CREDENTIALS?

### 1. Зайди на Supabase Dashboard:
https://app.supabase.com/

### 2. Выбери свой проект

### 3. Settings → API

Найди:
- **Project URL** → это `SUPABASE_URL`
- **anon/public key** → это `SUPABASE_KEY`

---

## ✅ ПРОВЕРКА ЧТО ВСЁ РАБОТАЕТ:

После запуска бота, в консоли должно быть:
```
Menu button set successfully
Bot started!
Starting polling...
```

Без ошибок про "TAMA_MINT_ADDRESS" или "Invalid URL"!

---

## 🧪 ТЕСТ WITHDRAWAL:

В Telegram отправь @GotchiGameBot:

```
/wallet
[отправь свой Devnet адрес]

/withdraw
[нажми кнопку]
10000
```

Должно показать:
```
⏳ Processing withdrawal...
```

Через ~30 секунд:
```
✅ WITHDRAWAL SUCCESSFUL!
[transaction signature]
```

---

## 🐛 ЕСЛИ ОШИБКИ:

### Error: "Invalid value for '<TOKEN_MINT_ADDRESS>'"
**Причина:** `TAMA_MINT_ADDRESS` не установлена или пустая

**Решение:** Убедись что переменная установлена ПЕРЕД запуском:
```powershell
echo $env:TAMA_MINT_ADDRESS
# Должно показать: Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
```

### Error: "Invalid URL" (Supabase)
**Причина:** `SUPABASE_URL` не установлена

**Решение:** Укажи правильный URL из Supabase Dashboard

### Error: "insufficient funds"
**Причина:** У payer-keypair недостаточно SOL

**Решение:**
```powershell
solana airdrop 1 8s88JVHG8Cb6HGKi25rjnMA19MuW723M6pJRDW3maDVi --url https://api.devnet.solana.com
```

---

## 💡 ДЛЯ PRODUCTION (24/7):

Задеплой на Heroku:

```bash
heroku create gotchi-game-bot

# Установи все переменные через Heroku dashboard или CLI:
heroku config:set TELEGRAM_BOT_TOKEN=...
heroku config:set TAMA_MINT_ADDRESS=...
heroku config:set SUPABASE_URL=...
# и т.д.

git push heroku main
```

И бот будет работать всегда! 🚀

---

## 📋 CHECKLIST:

- [ ] Установлены все environment variables
- [ ] payer-keypair.json имеет SOL (>0.1)
- [ ] Supabase credentials правильные
- [ ] Бот запущен без ошибок
- [ ] `/wallet` работает
- [ ] `/withdraw` работает
- [ ] Транзакция подтверждена на Solscan

---

**ГОТОВО!** Теперь withdrawal работает по-настоящему! 🎉

