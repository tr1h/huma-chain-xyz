# 🚨 Railway Deployment Issues - Fix Guide

## 🐛 Проблемы обнаружены:

1. **Trial Plan закончился** - "0 days or $5.00 left"
2. **Deployment постоянно крашится** - "Deployment crashed" повторяется
3. **Нет переменных окружения** - "0 variables" в production

---

## ✅ Решение 1: Добавить переменные окружения

### Шаги:

1. **Открой Railway Dashboard:**
   - https://railway.app/dashboard
   - Выбери проект `huma-chain-xyz`

2. **Перейди в Settings → Shared Variables**

3. **Добавь переменные для production:**

   ```
   VARIABLE_NAME: SUPABASE_URL
   VALUE: https://zfrazyupameidxpjihrh.supabase.co
   ```

   ```
   VARIABLE_NAME: SUPABASE_KEY
   VALUE: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU
   ```

   ```
   VARIABLE_NAME: TAMA_MINT_ADDRESS
   VALUE: Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
   ```

   ```
   VARIABLE_NAME: SOLANA_RPC_URL
   VALUE: https://api.devnet.solana.com
   ```

   ```
   VARIABLE_NAME: SOLANA_PAYER_KEYPAIR_PATH
   VALUE: /app/payer-keypair.json
   ```

---

## ✅ Решение 2: Исправить крашинг deployment

### Причины краша:

1. **Отсутствуют переменные окружения** - PHP код не может найти Supabase URL/Key
2. **Неправильный start command** - Railway не знает, как запустить PHP
3. **Отсутствуют файлы** - `payer-keypair.json` не найден

### Исправление:

#### Вариант A: Создай `railway.json` в корне проекта:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "php -S 0.0.0.0:$PORT -t . api/tama_supabase.php",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Вариант B: Настрой Start Command в Railway:

1. Открой проект в Railway
2. Выбери сервис
3. Settings → Deploy → Start Command
4. Вставь:
   ```
   php -S 0.0.0.0:$PORT -t . api/tama_supabase.php
   ```

---

## ✅ Решение 3: Обновить план (если нужно)

### Если trial закончился:

1. **Upgrade to Hobby Plan:**
   - Нажми "Upgrade to Hobby" в Settings
   - Это стоит $5/месяц
   - Даёт больше ресурсов и стабильности

2. **Или используй другой хостинг:**
   - **Render.com** - бесплатный tier
   - **Fly.io** - бесплатный tier
   - **Heroku** - платный, но стабильный

---

## ✅ Решение 4: Проверить логи

### Как посмотреть логи:

1. Открой Railway Dashboard
2. Выбери проект → Service
3. Перейди в **Deployments** → выбери последний deployment
4. Открой **Logs**

### Что искать:

- ❌ `Fatal error: Uncaught Error`
- ❌ `Call to undefined function`
- ❌ `Failed to connect to Supabase`
- ❌ `Environment variable not found`

---

## 🔧 Быстрый фикс (если нужно срочно):

### 1. Добавь переменные окружения (ОБЯЗАТЕЛЬНО!)

В Railway Dashboard → Settings → Shared Variables → production:

```
SUPABASE_URL = https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU
```

### 2. Проверь Start Command

Должно быть:
```
php -S 0.0.0.0:$PORT -t . api/tama_supabase.php
```

### 3. Перезапусти deployment

В Railway Dashboard → Service → нажми "Redeploy"

---

## 📊 Проверочный список:

- [ ] Добавлены переменные окружения в Railway
- [ ] Start Command настроен правильно
- [ ] railway.json создан (опционально)
- [ ] Deployment перезапущен
- [ ] Логи проверены на ошибки
- [ ] План обновлён (если trial закончился)

---

## 🎯 Ожидаемый результат:

После исправлений:
- ✅ Deployment не крашится
- ✅ API отвечает на запросы
- ✅ CORS работает
- ✅ Admin panel загружает данные

---

**Status:** 🚨 CRITICAL - Requires Immediate Action  
**Priority:** HIGH  
**Date:** November 7, 2025

