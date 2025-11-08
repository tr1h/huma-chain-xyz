# 🔄 Keep-Alive Setup for Render Free Tier

## Проблема

Render Free tier останавливает неактивные сервисы после 15 минут без запросов. Это приводит к "холодному старту" (30-60 секунд).

---

## Решение

**Keep-Alive Ping** - автоматический пинг каждые 5 минут для предотвращения остановки.

---

## Что Реализовано

### 1. Bot Keep-Alive (`bot/bot.py`)

```python
def keep_alive_ping():
    """Ping bot and API every 5 minutes to prevent sleep"""
    while True:
        time.sleep(300)  # 5 minutes
        
        # Ping bot health endpoint
        bot_url = f"https://{WEBHOOK_HOST}/"
        requests.get(bot_url, timeout=10)
        
        # Ping API health endpoint
        requests.get(f"{TAMA_API_BASE}/test", timeout=10)
```

**Запускается автоматически на Render:**
- Проверяет переменную `RENDER`
- Стартует в фоновом потоке (daemon thread)
- Пингует бот и API каждые 5 минут

---

### 2. API Health Endpoint

```php
// api/tama_supabase.php
if ($path === '/test' && $method === 'GET') {
    echo json_encode([
        'success' => true,
        'message' => 'PHP is working',
        'timestamp' => time()
    ]);
    exit();
}
```

---

## Проверка Работы

### 1. Проверь логи Render Bot

Должны быть сообщения каждые 5 минут:
```
🔄 Keep-Alive started (5 min interval)
✅ Keep-Alive: Bot pinged successfully
✅ Keep-Alive: API pinged successfully
```

### 2. Проверь Health Endpoint

**Bot Health:**
```bash
curl https://huma-chain-xyz-bot.onrender.com/
```

**Ответ:**
```json
{
  "status": "ok",
  "bot": "running",
  "timestamp": "2025-11-08T12:34:56"
}
```

**API Health:**
```bash
curl https://huma-chain-xyz.onrender.com/api/tama/test
```

**Ответ:**
```json
{
  "success": true,
  "message": "PHP is working",
  "timestamp": 1762634886
}
```

---

## Преимущества

✅ **Нет холодных стартов** - бот и API всегда готовы
✅ **Мгновенные ответы** - пользователи не ждут 30 секунд
✅ **Стабильная работа** - webhook не пропускает сообщения
✅ **Бесплатно** - работает на Free tier Render

---

## Недостатки

⚠️ **750 часов в месяц** - Render Free tier лимит
⚠️ **Ping трафик** - небольшое увеличение использования

**Примерный расход:**
- 1 ping каждые 5 минут = 12 в час
- 12 × 24 = 288 пингов в день
- 288 × 30 = 8,640 пингов в месяц
- **Очень мало трафика** (~1-2 KB на ping)

---

## Альтернативы

### 1. UptimeRobot (внешний сервис)
```
✅ Бесплатный external ping service
✅ Проверяет 50 сайтов каждые 5 минут
❌ Нужна регистрация
```

### 2. Upgrade на Starter ($7/month)
```
✅ Не засыпает вообще
✅ Больше CPU и RAM
✅ Приоритетная поддержка
```

### 3. Cron Job (GitHub Actions)
```yaml
# .github/workflows/keep-alive.yml
name: Keep Alive
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl https://huma-chain-xyz-bot.onrender.com/
      - run: curl https://huma-chain-xyz.onrender.com/api/tama/test
```

---

## Что Обновлено

### Все Railway URLs заменены на Render:

**До:**
```
https://huma-chain-xyz-production.up.railway.app/api/tama
```

**После:**
```
https://huma-chain-xyz.onrender.com/api/tama
```

**Файлы обновлены:**
- `bot/bot.py`
- `js/admin-env.js`
- `test-mint-flow.md`
- `transactions-admin.html`
- `tamagotchi-game.html`

---

## Мониторинг

### Render Dashboard
```
1. Открой Render Dashboard
2. Перейди в "huma-chain-xyz-bot"
3. Кликни "Logs"
4. Ищи: "Keep-Alive: Bot pinged successfully"
```

### Если Keep-Alive не работает

**Проверь переменную RENDER:**
```python
# В Render Dashboard → Environment
RENDER=true
```

**Проверь RENDER_EXTERNAL_HOSTNAME:**
```python
# Render автоматически устанавливает
RENDER_EXTERNAL_HOSTNAME=huma-chain-xyz-bot.onrender.com
```

---

## Итого

✅ **Bot:** Пингует сам себя и API каждые 5 минут
✅ **API:** Health endpoint отвечает на пинги
✅ **Render:** Не засыпает благодаря Keep-Alive
✅ **Бесплатно:** Работает на Free tier

**Все работает автоматически! Ничего настраивать не нужно.**

