# 🖥️ Настройка проекта на новом компьютере

## 📋 Быстрая инструкция

### Шаг 1: Клонировать репозиторий

```bash
git clone https://github.com/tr1h/huma-chain-xyz.git
cd huma-chain-xyz
```

### Шаг 2: Установить необходимые инструменты

**Windows:**
```powershell
# Node.js (если еще не установлен)
# Скачай с https://nodejs.org/ и установи

# Python 3.10+ (если еще не установлен)
# Скачай с https://www.python.org/ и установи
# ⚠️ ВАЖНО: При установке выбери "Add Python to PATH"
```

**Проверка:**
```powershell
node --version  # Должно показать v18.x или выше
npm --version   # Должно показать версию npm
python --version # Должно показать Python 3.10+
```

### Шаг 3: Установить зависимости

```powershell
# Node.js зависимости
npm install

# Python зависимости (для бота)
cd bot
pip install -r requirements.txt
cd ..
```

### Шаг 4: Настроить .env файл

**Создай файл `.env` в корне проекта:**

```env
# ============================================
# 🔒 SECURITY - НЕ КОММИТЬ В GIT!
# ============================================

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
BOT_USERNAME=gotchigamebot

# Supabase
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Supabase Database (для прямого подключения)
SUPABASE_DB_HOST=db.zfrazyupameidxpjihrh.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your_database_password_here

# Solana
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PAYER_KEYPAIR=your_base58_encoded_keypair_here

# TAMA Token
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY

# Treasury Wallets
TREASURY_MAIN=your_main_treasury_wallet
TREASURY_LIQUIDITY=your_liquidity_wallet
TREASURY_TEAM=your_team_wallet

# Server Ports (опционально)
PORT=3001
PHP_PORT=8002
```

**⚠️ ВАЖНО:** Получи все токены и ключи со старого компьютера или из:
- Supabase Dashboard → Settings → API
- Telegram Bot Token → @BotFather
- Solana Keypair → Создай новый или экспортируй со старого

### Шаг 5: Проверить Git конфигурацию

```powershell
# Установить имя и email (если еще не установлено)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Проверить текущий remote
git remote -v
# Должен показать: origin → https://github.com/tr1h/huma-chain-xyz.git
```

---

## 🚀 Запуск проекта

### Вариант 1: Локальный запуск всех компонентов

**Frontend (HTML):**
```powershell
# Просто открой в браузере
start index.html
```

**PHP API (локально):**
```powershell
cd api
php -S localhost:8002 router.php
# API будет доступен на http://localhost:8002/api/
```

**Node.js OnChain API:**
```powershell
npm run start:onchain
# Сервер запустится на http://localhost:3001
```

**Telegram Bot:**
```powershell
cd bot
python bot.py
```

### Вариант 2: Использовать готовый скрипт

```powershell
# Если есть start-local-server.ps1
.\start-local-server.ps1
```

---

## 📦 Что проверить после установки

### ✅ Проверка Node.js зависимостей:
```powershell
npm list --depth=0
# Должны быть установлены:
# - @solana/web3.js
# - @metaplex-foundation/js
# - express
# - cors
```

### ✅ Проверка Python зависимостей:
```powershell
cd bot
pip list
# Должны быть установлены:
# - pyTelegramBotAPI
# - python-dotenv
# - requests
# - psycopg2 (или psycopg2-binary)
```

### ✅ Проверка подключения к Supabase:
```powershell
# Открой в браузере
# http://localhost:8002/api/tama/test
# Должен вернуть: {"success": true, "message": "Database connection successful"}
```

---

## 🔄 Синхронизация с GitHub

### Получить последние изменения:
```powershell
git pull origin main
```

### Отправить изменения:
```powershell
git add .
git commit -m "Описание изменений"
git push origin main
```

---

## 🔧 Решение проблем

### Проблема: "npm install" не работает
```powershell
# Очисти кеш
npm cache clean --force
# Переустанови зависимости
rm -rf node_modules package-lock.json
npm install
```

### Проблема: Python не найден
```powershell
# Добавь Python в PATH
# Или используй полный путь:
C:\Python3xx\python.exe bot\bot.py
```

### Проблема: "psycopg2" не устанавливается
```powershell
# Установи pre-compiled версию
pip install psycopg2-binary
```

### Проблема: Git не настроен
```powershell
# Настрой Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 📝 Дополнительные файлы

Если нужны дополнительные настройки, проверь:
- `docs/guides/QUICK_START_DEV.md` - Детальная инструкция по разработке
- `docs/guides/DEV_MODE_SETUP.md` - Настройка dev режима
- `.docs/ENV_SETUP_GUIDE.md` - Подробная настройка .env

---

## ✅ Чеклист готовности

- [ ] Git установлен и настроен
- [ ] Node.js установлен (v18+)
- [ ] Python установлен (3.10+)
- [ ] Репозиторий склонирован
- [ ] `npm install` выполнен успешно
- [ ] `pip install -r bot/requirements.txt` выполнен успешно
- [ ] `.env` файл создан и заполнен
- [ ] API тест проходит (`/api/tama/test`)
- [ ] Бот запускается без ошибок

---

**Готово! 🎉 Проект настроен на новом компьютере!**

