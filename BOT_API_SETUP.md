# 🤖 Bot API Setup

## ⚠️ Проблема:
Бот пытается обратиться к `http://localhost:8002`, но на продакшене это не работает!

## ✅ Решение:

### Вариант 1: Локальная разработка
- API должен работать на том же сервере что и бот
- Используй `http://localhost:8002` или `http://127.0.0.1:8002`

### Вариант 2: Продакшен (PythonAnywhere / Heroku)
1. **Запусти API сервер на том же сервере**
2. **Измени `TAMA_API_BASE` в `bot.py`:**

```python
# Для PythonAnywhere
TAMA_API_BASE = "http://yourusername.pythonanywhere.com/api/tama"

# Или для Heroku
TAMA_API_BASE = "https://your-app.herokuapp.com/api/tama"
```

### Вариант 3: Временное отключение (fallback)
Если API недоступен, бот использует значения по умолчанию:
- Common: 1,000 TAMA
- Rare: 5,000 TAMA
- Epic: 10,000 TAMA
- Legendary: 50,000 TAMA

## 🚀 Быстрый фикс:

В `solana-tamagotchi/bot/bot.py` строка 53, замени:
```python
TAMA_API_BASE = "http://localhost:8002/api/tama"
```

На свой URL продакшена!

## ✅ Теперь бот будет работать даже если API недоступен!




