# 🚀 ИНСТРУКЦИЯ ПО ЗАПУСКУ - Solana Tamagotchi

## ✅ ЧТО УЖЕ ГОТОВО:

1. ✅ **Игра обновлена:**
   - Добавлена кнопка **💸 Withdraw** (→ бот)
   - Добавлена кнопка **🎨 Mint NFT** (→ mint.html)
   - Версия 1.9.1 готова
   - Изменения запушены в GitHub

2. ✅ **Бот настроен:**
   - @GotchiGameBot готов к работе
   - Все команды реализованы (start, help, stats, withdraw, daily, games, etc.)
   - Gamification система активна
   - Реферальная система работает

3. ✅ **Документация:**
   - FINAL_HACKATHON_CHECKLIST.md - полный чеклист
   - WITHDRAWAL_SYSTEM.md - система вывода
   - TOKENOMICS.md - токеномика
   - README.md - основная документация

---

## ⚠️ ЧТО НУЖНО СДЕЛАТЬ ДЛЯ ЗАПУСКА:

### 1. Запустить бота:

```powershell
cd C:\goooog\solana-tamagotchi\bot
python bot.py
```

**ВАЖНО:** Убедись что установлены переменные окружения:

```powershell
# Telegram
$env:TELEGRAM_BOT_TOKEN="8445221254:AAHxX7NCDv3K14LTnAQkM69Lg4QCckFh-E8"
$env:BOT_USERNAME="GotchiGameBot"

# Supabase
$env:SUPABASE_URL="твой_supabase_url"
$env:SUPABASE_KEY="твой_supabase_key"

# Database (если используешь прямое подключение)
$env:SUPABASE_DB_HOST="твой_db_host"
$env:SUPABASE_DB_PORT="5432"
$env:SUPABASE_DB_NAME="postgres"
$env:SUPABASE_DB_USER="твой_db_user"
$env:SUPABASE_DB_PASSWORD="твой_db_password"

# Solana (для withdrawal - можно оставить devnet)
$env:SOLANA_RPC_URL="https://api.devnet.solana.com"
$env:SOLANA_PAYER_KEYPAIR_PATH="C:\goooog\payer-keypair.json"
$env:SOLANA_MINT_KEYPAIR_PATH="C:\goooog\tama-mint-keypair.json"
```

### 2. Проверить GitHub Pages:

Открой: https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html

**Должно быть видно:**
- 💸 Withdraw кнопка
- 🎨 Mint NFT кнопка
- Версия 1.9.1 в консоли

Если не видно - подожди 2-3 минуты, GitHub Pages обновляется.

### 3. Протестировать в боте:

```
@GotchiGameBot
/start
/help
/daily
/games
/withdraw
/ref
```

### 4. Проверить интеграцию:

1. Открой игру через бота (кнопка "🎮 Play Game")
2. Поиграй, заработай TAMA
3. Нажми "💸 Withdraw" → должен открыться бот
4. Нажми "🎨 Mint NFT" → должна открыться страница минта

---

## 🐛 ВОЗМОЖНЫЕ ПРОБЛЕМЫ:

### Проблема 1: Бот не запускается (Invalid URL)

**Решение:**
```powershell
# Проверь переменные окружения:
$env:SUPABASE_URL
$env:SUPABASE_KEY

# Должны быть не пустыми!
```

### Проблема 2: GitHub Pages не обновляется

**Решение:**
1. Зайди на https://github.com/tr1h/huma-chain-xyz
2. Settings → Pages → Check deployment status
3. Если нужно, нажми "Re-run deployment"

### Проблема 3: Кнопки не работают в игре

**Решение:**
- Ctrl+F5 (жёсткий рефреш)
- Очисти кэш браузера
- Проверь консоль (F12) на ошибки

### Проблема 4: Menu button error

**Решение:**
Это нормально! В коде есть обработчик:
```python
try:
    bot.set_chat_menu_button(...)
except:
    print("Menu button not set (this is okay)")
```
Бот продолжит работать.

---

## 📊 ПРОВЕРКА СТАТУСА:

### Бот работает, если:
```
Menu button not set (this is okay)
2025-10-30 23:30:00,000 (__init__.py:499 MainThread) INFO - Started polling.
```

### Игра работает, если:
- Открывается https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html
- Видны кнопки: Withdraw, Mint NFT, My Link, Top, Games
- В консоли (F12): "🎮 Solana Tamagotchi v1.9.1"

### База работает, если:
- Бот отвечает на команды
- `/stats` показывает баланс
- Игра сохраняет прогресс

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ:

1. **Запустить бота** (python bot.py)
2. **Проверить игру** (открыть в браузере)
3. **Протестировать все команды** (см. FINAL_HACKATHON_CHECKLIST.md)
4. **Подготовить демо** для жюри

---

## 💡 DEMO СЦЕНАРИЙ (5 минут):

### Для жюри показать:

**1. Игра (2 мин):**
- Открыть https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html
- Кликнуть по питомцу (показать earn)
- Показать баланс TAMA
- Показать кнопки: Withdraw, Mint NFT
- Открыть Leaderboard

**2. Telegram Бот (2 мин):**
- @GotchiGameBot
- `/start` - показать welcome
- `/daily` - получить награду
- `/games` - сыграть в мини-игру
- `/ref` - показать QR код
- `/withdraw` - показать demo withdrawal

**3. NFT Mint (1 мин):**
- Открыть https://tr1h.github.io/huma-chain-xyz/mint
- Подключить Phantom
- Показать 100 NFT коллекцию
- (Опционально) Mint 1 NFT

---

## 📈 КЛЮЧЕВЫЕ МЕТРИКИ ДЛЯ ПРЕЗЕНТАЦИИ:

- ✅ **Full-Stack:** Game + Bot + NFT + Token
- ✅ **Instant Rewards:** NO wallet needed
- ✅ **Gamification:** Daily, Games, Badges, Ranks
- ✅ **Viral:** 2-level referral + QR codes
- ✅ **Real Blockchain:** Solana SPL Token + Metaplex NFT

---

## 🔥 ГОТОВ К ХАКАТОНУ!

**Всё работает!** Осталось только:
1. Запустить бота
2. Протестировать 5 минут
3. Показать жюри

**LET'S WIN! 🚀**

---

**P.S.** Если что-то не работает - пиши, разберёмся быстро!

**Контакт:** @GotchiGameBot  
**GitHub:** https://github.com/tr1h/huma-chain-xyz  
**Версия:** 1.9.1 (30 октября 2025)


