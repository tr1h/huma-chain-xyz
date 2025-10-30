# 🚀 Пошаговая инструкция по деплою API на Railway

## ✅ Подготовка завершена!

Я уже подготовил все файлы:
- ✅ `api/package.json` - зависимости Node.js
- ✅ `api/tama_supabase_api.js` - обновлён для использования ENV переменных
- ✅ `railway.json` и `railway.toml` - конфигурация Railway
- ✅ `RAILWAY_DEPLOY_GUIDE.md` - подробная инструкция на английском
- ✅ Всё закоммичено и запушено на GitHub

---

## 🎯 Твои действия (займёт 5-7 минут):

### **ШАГ 1: Регистрация на Railway** (2 минуты)

1. Открой: https://railway.app/
2. Нажми **"Login"** → **"Login with GitHub"**
3. Авторизуй Railway для доступа к твоим репозиториям

---

### **ШАГ 2: Создание проекта** (1 минута)

1. На главной странице Railway нажми: **"New Project"**
2. Выбери: **"Deploy from GitHub repo"**
3. Найди и выбери репозиторий: **`huma-chain-xyz`**
4. Railway автоматически определит Node.js проект
5. Нажми: **"Add variables"** (пока не деплой!)

---

### **ШАГ 3: Добавление переменных окружения** (2 минуты) 🔐

В открывшемся окне добавь **3 переменные**:

**Переменная 1:**
```
Name: SUPABASE_URL
Value: https://zfrazyupameidxpjihrh.supabase.co
```

**Переменная 2:**
```
Name: SUPABASE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU
```

**Переменная 3:**
```
Name: TAMA_MINT_ADDRESS
Value: Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
```

После добавления всех переменных нажми: **"Deploy"**

---

### **ШАГ 4: Ожидание деплоя** (2-3 минуты) ⏳

Railway начнёт автоматический деплой:
1. Установка зависимостей (npm install)
2. Запуск сервера (node tama_supabase_api.js)
3. Проверка здоровья приложения

Следи за логами в реальном времени. Ищи строку:
```
🚀 TAMA API Server running on http://localhost:XXXX
```

Когда увидишь **"Deployment successful"** ✅ - переходи к следующему шагу!

---

### **ШАГ 5: Получение публичного URL** (1 минута) 🌐

1. В Railway Dashboard открой свой проект
2. Перейди на вкладку: **"Settings"**
3. Найди раздел: **"Networking"** или **"Domains"**
4. Нажми: **"Generate Domain"**
5. Railway создаст URL типа: 
   ```
   https://huma-chain-xyz-production.up.railway.app
   ```
6. **СКОПИРУЙ ЭТОТ URL!** 📋

---

### **ШАГ 6: Проверка работы API** (1 минута) ✅

Открой браузер или терминал и проверь:

**В браузере:**
```
https://твой-url.up.railway.app/api/tama/test
```

**В терминале:**
```bash
curl https://твой-url.up.railway.app/api/tama/test
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "message": "Supabase API connection successful",
  "status": 200
}
```

Если видишь такой ответ - **всё отлично!** 🎉

---

## 🎮 Теперь обнови игру и админки:

### **1. Обнови URL в игре:**

Я могу это сделать за тебя! Просто **скопируй свой Railway URL** и напиши мне:
```
Обнови API URL на: https://твой-url.up.railway.app
```

Или сделай сам:

**Файл:** `docs/tamagotchi-game.html`

**Найди строку ~8106:**
```javascript
const TAMA_API_BASE = window.localStorage.getItem('TAMA_API_BASE') || window.TAMA_API_BASE || 'https://tr1h.github.io/huma-chain-xyz/api/tama';
```

**Замени на:**
```javascript
const TAMA_API_BASE = window.localStorage.getItem('TAMA_API_BASE') || window.TAMA_API_BASE || 'https://твой-url.up.railway.app/api/tama';
```

---

### **2. Обнови URL в админках:**

**Файл:** `docs/js/admin-env.js`

**Найди строку ~13:**
```javascript
TAMA_API_BASE: 'http://127.0.0.1:8002/api/tama',
```

**Замени на:**
```javascript
TAMA_API_BASE: 'https://твой-url.up.railway.app/api/tama',
```

---

### **3. Закоммить и запушить:**

```bash
git add docs/tamagotchi-game.html docs/js/admin-env.js
git commit -m "feat: Update API URL to Railway production"
git push origin main
```

---

## 🧪 Финальное тестирование:

### **Тест 1: Игра в Telegram**
1. Открой бота: `@GotchiGameBot`
2. Нажми кнопку: "🎮 Gotchi Game"
3. Кликни на питомца несколько раз
4. Открой консоль браузера (F12)
5. Должно быть: `✅ Saved via API: {level: X, tama: Y}`

### **Тест 2: Админка транзакций**
1. Открой: `https://tr1h.github.io/huma-chain-xyz/transactions-admin.html`
2. Должны загрузиться транзакции из Railway API

### **Тест 3: Админка экономики**
1. Открой: `https://tr1h.github.io/huma-chain-xyz/economy-admin.html`
2. Измени настройки и нажми "Apply Settings"
3. Должно сохраниться через Railway API

---

## 💰 Бесплатный лимит Railway:

Railway даёт **БЕСПЛАТНО**:
- ✅ $5 кредитов каждый месяц
- ✅ ~500 часов работы (достаточно для 24/7)
- ✅ 1 GB RAM
- ✅ 1 GB диска
- ✅ Неограниченные деплои

**Этого хватит для твоего проекта и хакатона!** 🎉

---

## 🔥 Преимущества Railway vs локальный API:

| Параметр | Локальный API | Railway API |
|----------|---------------|-------------|
| Доступность | ❌ Только когда ПК включен | ✅ 24/7 онлайн |
| Скорость | ✅ Быстро | ✅ Быстро |
| Для других пользователей | ❌ Не работает | ✅ Работает для всех |
| SSL/HTTPS | ❌ Нет | ✅ Автоматически |
| Мониторинг | ❌ Нет | ✅ Логи + метрики |
| Масштабирование | ❌ Нет | ✅ Автоматически |

---

## 🎯 Итого:

**Что у тебя теперь есть:**
1. ✅ API в облаке (работает 24/7)
2. ✅ Публичный URL для всех пользователей
3. ✅ Автоматические деплои при git push
4. ✅ Мониторинг и логи
5. ✅ SSL сертификат (HTTPS)
6. ✅ Готово к хакатону!

---

## 🆘 Если что-то пошло не так:

### **Проблема: Деплой завис**
**Решение:** В Railway нажми "View Logs", найди ошибку, напиши мне - помогу!

### **Проблема: API не отвечает**
**Решение:** 
1. Проверь, что все 3 переменные окружения добавлены
2. Проверь логи в Railway
3. Попробуй "Redeploy" в Settings

### **Проблема: CORS ошибка**
**Решение:** Это норма! API уже настроен с `cors()`. Если проблемы - напиши мне.

---

## 📞 Поддержка:

Если возникнут **ЛЮБЫЕ** проблемы:
1. Скопируй ошибку из логов Railway
2. Напиши мне
3. Я помогу за 5 минут! 💪

---

**Поехали деплоить! 🚀**

*Скопируй свой Railway URL после деплоя и отправь мне - я обновлю конфиги за тебя!*

