# 🚀 TAMA API - Deployment Guide

## 📦 Деплой на Railway.app

### Шаг 1: Подготовка
1. Зарегистрируйся на [Railway.app](https://railway.app/)
2. Подключи свой GitHub аккаунт

### Шаг 2: Создание проекта
1. Нажми **"New Project"**
2. Выбери **"Deploy from GitHub repo"**
3. Выбери репозиторий `huma-chain-xyz`
4. Railway автоматически определит Node.js проект

### Шаг 3: Настройка переменных окружения
В разделе **Variables** добавь:

```
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
```

### Шаг 4: Настройка Root Directory
1. Перейди в **Settings**
2. В разделе **Build** установи:
   - **Root Directory**: `api`
   - **Start Command**: `node tama_supabase_api.js`

### Шаг 5: Деплой
Railway автоматически задеплоит проект. Получишь URL типа:
```
https://your-app.up.railway.app
```

### Шаг 6: Проверка
Протестируй API:
```bash
curl https://your-app.up.railway.app/api/tama/test
```

---

## 🔧 Альтернатива: Render.com

### Шаг 1: Регистрация
Зарегистрируйся на [Render.com](https://render.com/)

### Шаг 2: Новый Web Service
1. Нажми **"New +"** → **"Web Service"**
2. Подключи GitHub репозиторий

### Шаг 3: Настройки
- **Name**: `tama-api`
- **Root Directory**: `api`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node tama_supabase_api.js`

### Шаг 4: Environment Variables
Добавь те же переменные, что и для Railway

### Шаг 5: Deploy
Render задеплоит автоматически

---

## 📱 После деплоя

### Обновить URL в игре:
Замени в `docs/tamagotchi-game.html`:
```javascript
const TAMA_API_BASE = 'https://your-app.up.railway.app/api/tama';
```

### Обновить в админках:
Замени в `docs/js/admin-env.js`:
```javascript
TAMA_API_BASE: 'https://your-app.up.railway.app/api/tama'
```

---

## 🧪 Тестирование

```bash
# Проверка подключения
curl https://your-app.up.railway.app/api/tama/test

# Получение лидерборда
curl https://your-app.up.railway.app/api/tama/leaderboard/list

# Логирование транзакции
curl -X POST https://your-app.up.railway.app/api/tama/transactions/log \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test123",
    "user_type": "telegram",
    "transaction_type": "earn_click",
    "amount": 10
  }'
```

---

## 💡 Советы

1. **Railway** - проще, бесплатный tier хороший
2. **Render** - стабильнее, но холодный старт
3. Оба варианта бесплатные для начала
4. Для production рекомендую Railway

---

## 🔒 Безопасность

⚠️ **ВАЖНО:** После деплоя обязательно:
1. Настрой CORS только для своего домена
2. Добавь rate limiting
3. Настрой мониторинг

---

**Готово! API в облаке!** ☁️

