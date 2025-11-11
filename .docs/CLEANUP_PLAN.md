# 🧹 ПЛАН ОЧИСТКИ РЕПОЗИТОРИЯ

**Цель:** Навести порядок в публичном GitHub репозитории

---

## 📋 ЧТО УДАЛИТЬ / СКРЫТЬ

### 1. ВРЕМЕННЫЕ ФАЙЛЫ (Удалить из Git)

```bash
# Удалить из репозитория:
NEXT_STEPS.md
DEBUG_SYNC_ISSUE.md
NFT_SYSTEM_SUMMARY.md
QUICK_TEST_NFT.md
test-mint-flow.md
TESTING_CHECKLIST.md
check_length.txt
check_user_8445221254.md
HACKATHON_300_CHARS.txt
```

### 2. BACKUP ФАЙЛЫ (Удалить из Git)

```bash
# Удалить из репозитория:
bot/bot.py.bak
nft-mint-OLD.html
backups/
```

### 3. СТАРЫЕ HTML (Удалить или переместить)

```bash
# Удалить (устаревшие):
s.html  # что это?
landing.html  # дубликат index.html?
telegram-game.html  # дубликат tamagotchi-game.html?
```

### 4. ADMIN ПАНЕЛИ (Проверить чувствительность)

```bash
# Оставить в репо (публичные):
✅ super-admin.html (нет паролей)
✅ admin-dashboard.html
✅ admin-table.html
✅ admin-tokenomics.html
✅ transactions-admin.html
✅ economy-admin.html

# УДАЛИТЬ из репо (чувствительные):
❌ wallet-admin.html (реальные адреса кошельков)
❌ wallet-admin-password.js (пароли!)
❌ admin-table-local.html (локальная версия)
```

### 5. DEPLOYMENT ФАЙЛЫ (Очистить)

```bash
# Удалить (не используются):
Dockerfile (оставить только в bot/)
Procfile (оставить только в bot/)
railway.json
vercel.json
nixpacks.toml
start.sh
```

### 6. ПРИВАТНЫЕ КЛЮЧИ (КРИТИЧНО!)

```bash
# УЖЕ в .gitignore, но нужно удалить из истории:
*-keypair.json (14 файлов)
team-wallet-private-key.txt
```

### 7. TEST ФАЙЛЫ (Переместить или удалить)

```bash
# Переместить в .docs/ или удалить:
test_nft_system.py
quick_check_nft.py
fix_nft_tables.sql
create_economy_config_table.sql
create_nft_tiers_table.sql
create_nft_tiers_table_FIXED.sql
```

### 8. NODE_MODULES (Должен быть в .gitignore)

```bash
# Проверить:
node_modules/  # Должен быть ТОЛЬКО в .gitignore, не в Git!
```

---

## 🗂️ НОВАЯ СТРУКТУРА

### Корень проекта (публичный)

```
C:\goooog\
├── .docs/              ✅ Вся документация
├── .github/            ✅ GitHub Actions
├── api/                ✅ PHP API
├── bot/                ✅ Telegram Bot
├── css/                ✅ Стили
├── js/                 ✅ JavaScript
├── sql/                ✅ SQL скрипты
├── tools/              ✅ Утилиты
├── assets/             ✅ Изображения, иконки
├── index.html          ✅ Главная страница
├── tamagotchi-game.html ✅ Игра
├── nft-mint-5tiers.html ✅ NFT Mint
├── my-nfts.html        ✅ Мои NFT
├── referral.html       ✅ Реферальная система
├── daily-rewards.html  ✅ Ежедневные награды
├── super-admin.html    ✅ Админ панель
├── admin-*.html        ✅ Другие админ панели
├── transactions-*.html ✅ Транзакции
├── package.json        ✅ Зависимости
├── README.md           ✅ Документация
├── .gitignore          ✅ Игнорируемые файлы
└── render.yaml         ✅ Деплой конфиг
```

### Приватная папка (НЕ в Git!)

```
C:\solana-private-keys\
├── payer-keypair.json
├── tama-mint-keypair.json
├── treasury-main-keypair.json
├── treasury-liquidity-keypair.json
├── treasury-team-keypair.json
├── p2e-pool-keypair.json
├── marketing-keypair.json
├── community-keypair.json
├── reserve-keypair.json
└── liquidity-pool-keypair.json
```

---

## ✅ ДЕЙСТВИЯ

### ШАГ 1: Обновить .gitignore (уже сделано ✅)

### ШАГ 2: Удалить временные файлы

```powershell
cd C:\goooog

# Временные документы
Remove-Item -Force NEXT_STEPS.md
Remove-Item -Force DEBUG_SYNC_ISSUE.md
Remove-Item -Force NFT_SYSTEM_SUMMARY.md
Remove-Item -Force QUICK_TEST_NFT.md
Remove-Item -Force test-mint-flow.md
Remove-Item -Force TESTING_CHECKLIST.md
Remove-Item -Force check_length.txt
Remove-Item -Force check_user_8445221254.md
Remove-Item -Force HACKATHON_300_CHARS.txt

# Backup файлы
Remove-Item -Force bot\bot.py.bak
Remove-Item -Force nft-mint-OLD.html

# Старые HTML
Remove-Item -Force s.html
Remove-Item -Force landing.html
Remove-Item -Force telegram-game.html

# Чувствительные админ панели
Remove-Item -Force wallet-admin.html
Remove-Item -Force wallet-admin-password.js
Remove-Item -Force admin-table-local.html

# Deployment файлы
Remove-Item -Force Dockerfile
Remove-Item -Force Procfile
Remove-Item -Force railway.json
Remove-Item -Force vercel.json
Remove-Item -Force nixpacks.toml
Remove-Item -Force start.sh

# Test файлы
Remove-Item -Force test_nft_system.py
Remove-Item -Force quick_check_nft.py
Remove-Item -Force fix_nft_tables.sql
Remove-Item -Force create_economy_config_table.sql
Remove-Item -Force create_nft_tiers_table.sql
Remove-Item -Force create_nft_tiers_table_FIXED.sql

# Scripts
Remove-Item -Force setup_vesting.ps1
Remove-Item -Force backup.ps1
Remove-Item -Force start_bot_and_api.ps1
Remove-Item -Force fix_emoji.py
Remove-Item -Force fix_all_emoji.py

# JSON/JS exports
Remove-Item -Force tokenomics.json
Remove-Item -Force export_keypair_for_phantom.js
Remove-Item -Force create_vesting_stream.js
Remove-Item -Force marketplace-integration.js
```

### ШАГ 3: Коммит изменений

```powershell
git add .
git commit -m "chore: clean up temporary and sensitive files"
```

### ШАГ 4: КРИТИЧНО - Очистить Git историю

**САМЫЙ ПРОСТОЙ СПОСОБ: Создать новый репозиторий**

```powershell
# 1. Создай backup (если ещё нет)
cd C:\
Compress-Archive -Path C:\goooog -DestinationPath C:\goooog-backup-before-cleanup-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').zip

# 2. Создай новый пустой репо на GitHub:
# https://github.com/new
# Имя: huma-chain-xyz-v2

# 3. Удали старый .git
cd C:\goooog
Remove-Item -Recurse -Force .git

# 4. Инициализируй заново
git init
git add .
git commit -m "feat: Initial clean commit - Solana Tamagotchi P2E Game"
git branch -M main
git remote add origin https://github.com/tr1h/huma-chain-xyz-v2.git
git push -u origin main

# 5. На GitHub:
# - Удали старый репо huma-chain-xyz (Settings → Delete repository)
# - Переименуй huma-chain-xyz-v2 → huma-chain-xyz (Settings → Rename)
```

---

## 📊 ЧТО ОСТАНЕТСЯ В РЕПО

### ✅ Публичные файлы:

```
✅ HTML страницы (без admin-table-local.html, wallet-admin.html)
✅ CSS стили
✅ JavaScript (без паролей)
✅ API (PHP, без ключей)
✅ Bot (Python, без токена)
✅ SQL скрипты
✅ Документация (.docs/)
✅ package.json
✅ README.md
✅ .gitignore
✅ render.yaml
```

### ❌ Приватные файлы (НЕ в Git):

```
❌ *-keypair.json (все 14 штук)
❌ *-private-key.txt
❌ .env файлы
❌ wallet-admin.html
❌ wallet-admin-password.js
❌ bot_monitoring.log
❌ backups/
❌ node_modules/
```

---

## 🎯 РЕЗУЛЬТАТ

После очистки:

1. ✅ Чистый Git репозиторий (без приватных ключей)
2. ✅ Организованная структура
3. ✅ Профессиональный вид для хакатона
4. ✅ Безопасность (нет чувствительных данных)
5. ✅ Легко клонировать и запускать

---

## ⚠️ ВАЖНО

**ДО ЗАПУСКА MAINNET:**
- ✅ Создай НОВЫЕ ключи в `C:\solana-private-keys\`
- ✅ НЕ коммить их в Git
- ✅ Используй переменные окружения
- ✅ Security Audit

---

**Готов начать очистку?** 🧹
