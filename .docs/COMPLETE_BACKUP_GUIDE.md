# 💾 ПОЛНЫЙ ГАЙД ПО БЕКАПУ ПРОЕКТА

**Date:** November 29, 2025  
**Purpose:** Сохранить ВСЁ (код, БД, документы, ключи)

---

## 📋 ЧТО НУЖНО СОХРАНИТЬ

### 1. ✅ КОД И ФАЙЛЫ (ГОТОВО!)

**Локация:** `D:\backup_solana_tamagotchi_2025_11_29`

**Что сохранено:**
- Все HTML файлы
- Все JavaScript файлы
- Все API файлы (включая security fixes!)
- Все документы (.md)
- Все скрипты (.bat)
- CSS, изображения, конфигурация

**Размер:** 54,964 файлов

**Способ восстановления:**
```bash
# Просто скопируй папку обратно
xcopy "D:\backup_solana_tamagotchi_2025_11_29" "C:\goooog" /E /I /H /Y
```

---

### 2. ⏳ БАЗА ДАННЫХ (ДЕЛАЕМ СЕЙЧАС!)

**Что нужно сохранить:**

#### **Таблицы:**
- `leaderboard` - 40+ игроков, балансы TAMA
- `transactions` - 1,000+ транзакций
- `user_nfts` - 50+ NFT владения
- `nft_designs` - 1,000+ дизайнов NFT
- `nft_bonding_state` - текущие цены NFT

#### **Функции:**
- `withdraw_tama_atomic()` - уже сохранено в `supabase/withdraw_tama_atomic.sql`

#### **Способы бекапа:**

##### СПОСОБ 1: Через Supabase Dashboard (РЕКОМЕНДУЮ!) ✅

```
1. Открой: https://supabase.com/dashboard/project/zfrazyupameidxpjihrh
2. Database → Backups
3. Create backup → Назови: "backup_2025_11_29_security_fixes"
4. Download → Сохрани .sql файл
5. Перемести на D:\
```

**Время:** 5 минут  
**Результат:** Полный SQL dump базы

##### СПОСОБ 2: Автоматический экспорт PHP (СДЕЛАЛ ДЛЯ ТЕБЯ!) ✅

**Запусти:**
```bash
BACKUP_DATABASE.bat
```

**Что делает:**
1. Экспортирует все таблицы в JSON
2. Создаёт папку `backup_db_YYYY_MM_DD_HH_MM_SS`
3. Сохраняет на диск D: (если есть)

**Результат:**
```
backup_db_2025_11_29_XX_XX_XX/
├── leaderboard.json        (все игроки)
├── transactions.json       (все транзакции)
├── user_nfts.json         (все NFT)
├── nft_designs.json       (все дизайны)
├── nft_bonding_state.json (цены)
└── database_schema.sql    (схема)
```

**Способ восстановления:**
```bash
# Import каждой таблицы через Supabase SQL Editor
# Или используй Table Editor → Import CSV
```

---

### 3. ⏳ СЕКРЕТНЫЕ КЛЮЧИ (КРИТИЧНО!)

**Что НЕ сохранено в бекапе (по безопасности):**

#### ❌ НЕ в Git / НЕ в бекапе:
- `.env` файл (API ключи, secrets)
- Solana keypairs (приватные ключи кошельков)
- Supabase service role key
- Bot token

#### ✅ ГДЕ ОНИ СЕЙЧАС:

**1. Supabase Keys:**
- Dashboard: https://supabase.com/dashboard/project/zfrazyupameidxpjihrh/settings/api
- Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Service role key: (в настройках)

**2. Solana Keypairs:**
- Render.com environment variables
- Локально (если есть): `C:\goooog\.keys\` (проверь!)

**3. Telegram Bot Token:**
- BotFather: https://t.me/BotFather
- Команда: `/mybots` → @GotchiGameBot → API Token

**4. Environment Variables (Render.com):**
- Dashboard: https://dashboard.render.com
- Настройки сервиса → Environment

#### ✅ КАК СОХРАНИТЬ КЛЮЧИ БЕЗОПАСНО:

**Создай файл `SECRETS_BACKUP.txt` (ЛОКАЛЬНО, не на GitHub!):**

```txt
💾 BACKUP СЕКРЕТНЫХ КЛЮЧЕЙ
Date: 2025-11-29

⚠️ НИКОГДА НЕ ЗАГРУЖАЙ ЭТОТ ФАЙЛ НА GITHUB!

===========================================
SUPABASE
===========================================
Project URL: https://zfrazyupameidxpjihrh.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU
Service Role Key: [СКОПИРУЙ ИЗ DASHBOARD]

===========================================
TELEGRAM BOT
===========================================
Bot Username: @GotchiGameBot
Bot Token: [СКОПИРУЙ ИЗ BOTFATHER]

===========================================
SOLANA WALLETS
===========================================
TAMA Token Mint: Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
Treasury Main: 6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM
Treasury Liquidity: CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1
Treasury Team: Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8
P2E Pool: HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw

Keypairs (private keys):
[СКОПИРУЙ ИЗ RENDER.COM ENVIRONMENT VARIABLES]

===========================================
RENDER.COM
===========================================
API Service: https://api.solanatamagotchi.com
Onchain Service: https://solanatamagotchi-onchain.onrender.com

Environment Variables: [ЭКСПОРТИРУЙ ИЗ DASHBOARD]

===========================================
```

**Сохрани этот файл:**
- ✅ На флешку
- ✅ В зашифрованный архив (ZIP с паролем)
- ✅ В менеджер паролей (1Password, Bitwarden)
- ❌ НЕ на GitHub!
- ❌ НЕ в облако без шифрования!

---

### 4. ⏳ RENDER.COM ENVIRONMENT VARIABLES

**Экспортируй настройки:**

1. **Открой:** https://dashboard.render.com
2. **Твой API сервис** → Settings → Environment
3. **Скопируй все переменные:**
   - SUPABASE_URL
   - SUPABASE_KEY
   - TREASURY_MAIN
   - TREASURY_LIQUIDITY
   - TREASURY_TEAM
   - SOLANA_RPC_URL
   - TAMA_MINT_ADDRESS
   - И другие...

4. **Сохрани в текстовый файл** (локально!)

---

## 💾 ПОЛНЫЙ БЕКАП ЧЕКЛИСТ

### ✅ ФАЙЛЫ (ГОТОВО!)
- [x] Код (HTML, JS, PHP)
- [x] Документация (.md)
- [x] Скрипты (.bat)
- [x] Изображения (logo.png)
- [x] Конфигурация (_config.yml, .htaccess)

**Локация:** `D:\backup_solana_tamagotchi_2025_11_29`

---

### ⏳ БАЗА ДАННЫХ (ДЕЛАЕМ!)

**Вариант 1: Supabase Dashboard** (5 мин)
```
Database → Backups → Create → Download
```

**Вариант 2: Автоматический скрипт**
```bash
BACKUP_DATABASE.bat
```

---

### ⏳ СЕКРЕТНЫЕ КЛЮЧИ (ВАЖНО!)

- [ ] Supabase keys (скопируй из dashboard)
- [ ] Telegram bot token (из BotFather)
- [ ] Solana keypairs (из Render.com env)
- [ ] Render.com env variables (экспортируй)

**Сохрани в:** Зашифрованный файл на флешку! 🔐

---

### ✅ GIT (УЖЕ ЕСТЬ!)

- [x] GitHub repository
- [x] All commits pushed
- [x] Security fixes included

**Backup:** `https://github.com/tr1h/huma-chain-xyz` ✅

---

## 🎯 РЕКОМЕНДАЦИИ

### МИНИМАЛЬНЫЙ БЕКАП (уже есть!):
1. ✅ Файлы на диск D:
2. ✅ GitHub repository
3. ⏳ Supabase backup (сделай через dashboard)

**Этого достаточно для восстановления проекта!** ✅

### ПОЛНЫЙ БЕКАП (для безопасности):
1. ✅ Файлы на диск D:
2. ✅ GitHub repository
3. ⏳ Supabase backup (.sql)
4. ⏳ Секретные ключи (зашифрованный файл)
5. ⏳ Render.com env variables
6. ⏳ ZIP архив всего на облако

**Время: ~30 минут**  
**Безопасность: Максимальная!** 🔐

---

## 🚀 ЧТО ДЕЛАТЬ СЕЙЧАС?

**ВЫБЕРИ:**

**A) Создать бекап БД через Supabase Dashboard** (5 мин) ⭐ РЕКОМЕНДУЮ
```
1. Открой Supabase
2. Database → Backups
3. Create → Download
4. Готово!
```

**B) Запустить автоматический скрипт** (2 мин)
```bash
BACKUP_DATABASE.bat
```

**C) Сохранить секретные ключи** (10 мин)
```
Создать SECRETS_BACKUP.txt с ключами
Зашифровать в ZIP с паролем
Сохранить на флешку
```

**D) Всё сразу!** (30 мин - максимальная безопасность)

**E) Отдохнуть!** 😴
```
У тебя уже есть:
✅ Файлы на D:\
✅ GitHub backup
Остальное можно завтра!
```

---

**ЧТО ВЫБИРАЕШЬ?** 🎯

Могу помочь с любым вариантом! 💪
