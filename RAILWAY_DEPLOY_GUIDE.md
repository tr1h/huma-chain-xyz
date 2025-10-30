# 🚂 TAMA API - Railway Deployment Guide

## 🎯 **Быстрый старт (5 минут)**

### **Шаг 1: Регистрация на Railway** ⚡
1. Перейди на [railway.app](https://railway.app/)
2. Нажми **"Start a New Project"**
3. Войди через GitHub

### **Шаг 2: Создание проекта** 📦
1. Нажми **"Deploy from GitHub repo"**
2. Выбери репозиторий: `huma-chain-xyz`
3. Railway автоматически обнаружит Node.js проект
4. Нажми **"Deploy Now"**

### **Шаг 3: Настройка переменных окружения** 🔐
1. Открой свой проект в Railway
2. Перейди на вкладку **"Variables"**
3. Добавь следующие переменные:

```bash
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
```

### **Шаг 4: Настройка сборки** ⚙️
1. Перейди на вкладку **"Settings"**
2. В разделе **"Build"** установи:
   - **Root Directory**: оставь пустым (файл `railway.json` всё настроит)
   - Или установи вручную:
     - **Build Command**: `cd api && npm install`
     - **Start Command**: `cd api && node tama_supabase_api.js`

### **Шаг 5: Получение публичного URL** 🌐
1. Перейди на вкладку **"Settings"**
2. Найди раздел **"Networking"**
3. Нажми **"Generate Domain"**
4. Railway создаст URL типа: `https://your-app-name.up.railway.app`
5. **Скопируй этот URL!** Он понадобится дальше

### **Шаг 6: Проверка деплоя** ✅
Railway начнёт автоматический деплой. Подожди 2-3 минуты.

Проверь, что API работает:
```bash
curl https://your-app-name.up.railway.app/api/tama/test
```

Должен вернуться:
```json
{
  "success": true,
  "message": "Supabase API connection successful",
  "status": 200
}
```

---

## 📝 **Что делать после деплоя:**

### **1. Обновить URL в игре** 🎮

Открой файл `docs/tamagotchi-game.html` и найди строку:
```javascript
const TAMA_API_BASE = window.localStorage.getItem('TAMA_API_BASE') || window.TAMA_API_BASE || 'https://tr1h.github.io/huma-chain-xyz/api/tama';
```

Замени на:
```javascript
const TAMA_API_BASE = window.localStorage.getItem('TAMA_API_BASE') || window.TAMA_API_BASE || 'https://your-app-name.up.railway.app/api/tama';
```

### **2. Обновить URL в админках** 👨‍💼

Открой файл `docs/js/admin-env.js` и найди:
```javascript
TAMA_API_BASE: 'http://127.0.0.1:8002/api/tama',
```

Замени на:
```javascript
TAMA_API_BASE: 'https://your-app-name.up.railway.app/api/tama',
```

### **3. Закоммитить и запушить изменения** 📤

```bash
git add docs/tamagotchi-game.html docs/js/admin-env.js
git commit -m "feat: Update API URL to Railway deployment"
git push origin main
```

### **4. Перезапустить бота** 🤖

Бот будет работать с новым API автоматически (он использует `TAMA_API_BASE`).

Но если хочешь, можешь установить переменную окружения:
```bash
# В .env файле бота или в ENV переменных системы:
TAMA_API_BASE=https://your-app-name.up.railway.app/api/tama
```

---

## 🧪 **Тестирование API**

### **Тест 1: Проверка подключения**
```bash
curl https://your-app-name.up.railway.app/api/tama/test
```

### **Тест 2: Получение лидерборда**
```bash
curl https://your-app-name.up.railway.app/api/tama/leaderboard/list
```

### **Тест 3: Логирование транзакции**
```bash
curl -X POST https://your-app-name.up.railway.app/api/tama/transactions/log \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test123",
    "user_type": "telegram",
    "transaction_type": "earn_click",
    "amount": 10
  }'
```

### **Тест 4: Upsert в лидерборд**
```bash
curl -X POST https://your-app-name.up.railway.app/api/tama/leaderboard/upsert \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": "test123",
    "level": 5,
    "xp": 1000,
    "tama": 500,
    "user_type": "telegram"
  }'
```

---

## 📊 **Мониторинг**

### **Просмотр логов:**
1. В Railway Dashboard перейди на вкладку **"Deployments"**
2. Выбери последний деплой
3. Нажми **"View Logs"**

### **Метрики:**
Railway показывает:
- ✅ CPU usage
- ✅ Memory usage
- ✅ Network traffic
- ✅ Response time

---

## 💰 **Бесплатный тариф Railway**

Railway даёт бесплатно:
- ✅ 500 часов выполнения в месяц
- ✅ 1 GB RAM
- ✅ 1 GB диска
- ✅ Неограниченные деплои

**Этого хватит для твоего проекта!** 🎉

---

## 🔧 **Устранение проблем**

### **Проблема 1: API не отвечает**
- Проверь логи в Railway
- Убедись, что переменные окружения установлены
- Проверь, что домен сгенерирован

### **Проблема 2: CORS ошибки**
API уже настроен с `cors()`, но если проблемы:
```javascript
app.use(cors({
  origin: '*', // Для тестирования
  // origin: 'https://tr1h.github.io', // Для production
}));
```

### **Проблема 3: Деплой зависает**
- Убедись, что `package.json` корректный
- Проверь, что установлены все зависимости
- Попробуй ручной перезапуск: **Settings** → **Redeploy**

---

## 🚀 **Готово!**

Теперь твой API работает в облаке 24/7! ☁️

### **Следующие шаги:**
1. ✅ Обнови URL в игре и админках
2. ✅ Протестируй все эндпоинты
3. ✅ Запусти бота
4. ✅ Протестируй игру в Telegram
5. 🎉 **Готово к хакатону!**

---

**Если возникнут проблемы - пиши, помогу!** 💪

