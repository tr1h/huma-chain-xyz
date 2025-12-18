# 🚀 Render Deployment Guide

## Мягкий переезд на Render

Render развернется **параллельно** с Railway. Railway продолжит работать как backup.

---

## Преимущества Render

✅ **Поддерживает PHP** — через Dockerfile
✅ **Solana CLI работает** — on-chain distribution
✅ **Бесплатный план** — 750 часов/месяц
✅ **Стабильнее Railway** — нет падений
✅ **Автоматические деплои** — из GitHub

---

## Шаг 1: Создать аккаунт Render

1. Открой [render.com](https://render.com)
2. Sign up / Log in через GitHub
3. Подключи GitHub аккаунт

---

## Шаг 2: Создать новый Web Service

1. Dashboard → **New +** → **Web Service**
2. Выбери репозиторий: `tr1h/huma-chain-xyz`
3. Нажми **Connect**

---

## Шаг 3: Настроить Web Service

### Основные настройки:
```
Name: huma-chain-xyz-api
Region: Oregon (US West)
Branch: main
Root Directory: . (оставь пустым)
```

### Build настройки:
```
Environment: Docker
Dockerfile Path: ./Dockerfile
Docker Command: (оставь пустым, используется CMD из Dockerfile)
```

### Plan:
```
Instance Type: Free
```

---

## Шаг 4: Добавить Environment Variables

Нажми **Add Environment Variable** и добавь:

### 1. SUPABASE_URL
```
SUPABASE_URL
https://zfrazyupameidxpjihrh.supabase.co
```

### 2. SUPABASE_KEY
```
SUPABASE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU
```

### 3. TAMA_MINT_ADDRESS
```
TAMA_MINT_ADDRESS
Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
```

### 4. SOLANA_RPC_URL
```
SOLANA_RPC_URL
https://api.devnet.solana.com
```

### 5. SOLANA_PAYER_KEYPAIR (скопируй содержимое файла)
```
SOLANA_PAYER_KEYPAIR
[12,34,56,78,...] (JSON array с приватным ключом)
```

### 6. SOLANA_P2E_POOL_KEYPAIR (скопируй содержимое файла)
```
SOLANA_P2E_POOL_KEYPAIR
[98,76,54,32,...] (JSON array с приватным ключом)
```

---

## Шаг 5: Deploy

1. Нажми **Create Web Service**
2. Дождись завершения деплоя (5-10 минут первый раз)
3. Render автоматически назначит URL: `https://huma-chain-xyz-api.onrender.com`

---

## Шаг 6: Протестировать API

### Тест 1: Health Check
```
https://huma-chain-xyz-api.onrender.com/api/test.php
```
Должен вернуть: `{"success":true,"message":"PHP is working","server":"Apache"}`

### Тест 2: Баланс
```
https://huma-chain-xyz-api.onrender.com/api/tama/balance?telegram_id=202140267
```

### Тест 3: Транзакции
```
https://huma-chain-xyz-api.onrender.com/api/tama/transactions/list?limit=10
```

### Тест 4: On-Chain Distribution
Попробуй mint Bronze NFT через:
```
https://tr1h.github.io/huma-chain-xyz/nft-mint.html?user_id=202140267
```

---

## Шаг 7: Обновить фронтенд (когда все работает)

### В nft-mint.html
Замени:
```javascript
const TAMA_API_BASE = 'https://huma-chain-xyz-production.up.railway.app/api/tama';
```
На:
```javascript
const TAMA_API_BASE = 'https://huma-chain-xyz-api.onrender.com/api/tama';
```

### В tamagotchi-game.html
Замени:
```javascript
const TAMA_API_BASE = 'https://huma-chain-xyz-production.up.railway.app/api/tama';
```
На:
```javascript
const TAMA_API_BASE = 'https://huma-chain-xyz-api.onrender.com/api/tama';
```

### В transactions-admin.html
Замени в `js/admin-env.js`:
```javascript
const TAMA_API_BASE = 'https://huma-chain-xyz-api.onrender.com/api/tama';
```

### В bot/bot.py
Замени:
```python
MINT_URL = "https://huma-chain-xyz-api.onrender.com/"
```

---

## ⚠️ Важно: Free Plan особенности

**Render Free Plan:**
- Засыпает после 15 минут неактивности
- Первый запрос после сна занимает ~30 секунд (cold start)
- 750 часов/месяц (достаточно для одного сервиса)

**Решение для cold start:**
- Использовать cron job для keep-alive (ping каждые 10 минут)
- Или перейти на Starter Plan ($7/месяц) — без cold start

---

## Keep-Alive (опционально)

Для предотвращения cold start, можно использовать:

### UptimeRobot (бесплатно)
1. Открой [uptimerobot.com](https://uptimerobot.com)
2. Создай Monitor:
   - URL: `https://huma-chain-xyz-api.onrender.com/api/test.php`
   - Interval: 10 minutes

---

## Rollback (если что-то не так)

Просто вернуть старый API URL в коде:
```javascript
const TAMA_API_BASE = 'https://huma-chain-xyz-production.up.railway.app/api/tama';
```

Railway продолжит работать.

---

## Что дальше?

1. **Разверни на Render** (следуй инструкции выше)
2. **Протестируй API** на Render URL
3. **Если все работает** — обнови фронтенд и бот
4. **Railway останется** как backup

---

## Мониторинг

Render Dashboard → Service → Logs
- Смотри логи в реальном времени
- Проверяй ошибки
- Мониторь производительность

