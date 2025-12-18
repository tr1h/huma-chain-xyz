# 🧹 ПЛАН НАВЕДЕНИЯ ПОРЯДКА В РЕПОЗИТОРИИ

## 📊 ТЕКУЩАЯ СИТУАЦИЯ:

### ✅ **Основной репозиторий:**
```
https://github.com/tr1h/huma-chain-xyz
```
**Статус:** Активный, используется для GitHub Pages

### ❌ **Старый репозиторий:**
```
https://github.com/tr1h/solana-tamagotchi
```
**Статус:** Можно удалить (или сделать архивным)

---

## 🚨 **ПРОБЛЕМЫ:**

### 1. **В корне репозитория КУЧА .md файлов:**
```
Всего файлов в корне: ~70 файлов
Из них .md файлов: ~35 файлов
```

**Примеры лишних файлов в корне:**
- TOKENOMICS_FINAL.md
- PROJECT_STRUCTURE.md
- PRODUCTION_LAUNCH_PLAN.md
- HACKATHON_FINAL_CHECKLIST.md
- TOKEN_DISTRIBUTION_GUIDE.md
- REFERRAL_CHECK_REPORT.md
- ... еще ~30 файлов

**Проблема:**
- Захламляет GitHub репозиторий
- Сложно найти нужный файл
- Выглядит непрофессионально

### 2. **Лишние prompt файлы:**
```
- sora2_*.md файлы (видео промпты)
- boomer_cinema_prompt.md
```
**Не относятся к проекту!**

### 3. **Лишние HTML файлы:**
```
- index-old.html (старая версия)
- landing.html (дубликат index.html?)
- admin-table-local.html (локальная версия)
```

---

## ✅ **РЕШЕНИЕ:**

### **Структура ПОСЛЕ очистки:**

```
C:\goooog\ (GitHub: tr1h/huma-chain-xyz)
│
├── 🌐 FRONTEND (GitHub Pages публикует)
│   ├── index.html                ← Главная страница
│   ├── tamagotchi-game.html      ← Игра
│   ├── mint.html                 ← NFT Mint
│   ├── referral.html             ← Реферальная система
│   ├── s.html                    ← Короткая ссылка
│   ├── admin-tokenomics.html     ← Админка токеномики
│   ├── super-admin.html          ← Супер-админка
│   ├── economy-admin.html        ← Экономика админка
│   ├── transactions-admin.html   ← Транзакции админка
│   └── simple-dashboard.html     ← Простая статистика
│
├── 🛠️ BACKEND
│   ├── api/
│   │   └── tama_supabase.php
│   ├── bot/
│   │   ├── bot.py
│   │   ├── start_bot.ps1
│   │   └── start_bot_visible.ps1
│   └── sql/
│       └── update_burn_stats_function.sql
│
├── 🔧 CONFIG
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore                ← Обновим!
│   ├── tokenomics.json
│   ├── tama-token-info.json
│   └── *-keypair.json
│
├── 🛠️ TOOLS
│   └── tools/
│       └── tama_token_stats.js
│
├── 📚 DOCUMENTATION (ТОЛЬКО В КОРНЕ!)
│   └── README.md                 ← Только один README!
│
└── 📁 .docs/ (ПАПКА ДЛЯ ВСЕХ .md ФАЙЛОВ!)
    ├── TOKENOMICS_FINAL.md
    ├── PROJECT_STRUCTURE.md
    ├── PRODUCTION_LAUNCH_PLAN.md
    ├── HACKATHON_FINAL_CHECKLIST.md
    ├── TOKEN_DISTRIBUTION_GUIDE.md
    ├── REFERRAL_CHECK_REPORT.md
    ├── HOW_IT_WORKS.md
    ├── SYSTEM_ARCHITECTURE.md
    ├── TAMA_TOKEN_COMPLETE_GUIDE.md
    ├── VESTING_SETUP.md
    ├── WITHDRAWAL_SYSTEM.md
    ├── PHP_API_SETUP.md
    ├── LAUNCH_INSTRUCTIONS.md
    ├── READY_TO_LAUNCH.md
    ├── READY_TO_DEMO.md
    ├── QUICK_START.md
    ├── QUICK_STATUS.md
    ├── QUICK_ANSWERS.md
    ├── STATUS_REPORT.md
    ├── START_BOT_INSTRUCTIONS.md
    ├── TEST_WITHDRAWAL.md
    ├── REAL_WITHDRAWAL_SETUP.md
    ├── SMART_CONTRACT_VS_CLI.md
    ├── VIRTUAL_VS_REAL_TOKENS.md
    ├── WHY_BURN_VIRTUAL.md
    ├── FULL_ARCHITECTURE.md
    ├── colosseum_*.md
    ├── github_*.md
    └── [... все остальные .md файлы]
```

---

## 🔧 **ДЕЙСТВИЯ:**

### **Шаг 1: Создать папку `.docs/`**
```bash
mkdir .docs
```

### **Шаг 2: Переместить все .md файлы (кроме README.md)**
```bash
# Список файлов для перемещения:
TOKENOMICS_FINAL.md
PROJECT_STRUCTURE.md
PRODUCTION_LAUNCH_PLAN.md
HACKATHON_FINAL_CHECKLIST.md
TOKEN_DISTRIBUTION_GUIDE.md
REFERRAL_CHECK_REPORT.md
HOW_IT_WORKS.md
SYSTEM_ARCHITECTURE.md
TAMA_TOKEN_COMPLETE_GUIDE.md
TOKENOMICS_IMPLEMENTATION.md
TOKENOMICS.md
VESTING_SETUP.md
WITHDRAWAL_SYSTEM.md
PHP_API_SETUP.md
LAUNCH_INSTRUCTIONS.md
READY_TO_LAUNCH.md
READY_TO_DEMO.md
QUICK_START.md
QUICK_STATUS.md
QUICK_ANSWERS.md
STATUS_REPORT.md
START_BOT_INSTRUCTIONS.md
TEST_WITHDRAWAL.md
REAL_WITHDRAWAL_SETUP.md
SMART_CONTRACT_VS_CLI.md
VIRTUAL_VS_REAL_TOKENS.md
WHY_BURN_VIRTUAL.md
FULL_ARCHITECTURE.md
colosseum_*.md
github_*.md
```

### **Шаг 3: Удалить лишние файлы**
```bash
# Удалить prompt файлы:
sora2_*.md
boomer_cinema_prompt.md

# Удалить старые HTML:
index-old.html
admin-table-local.html (если не нужен)
```

### **Шаг 4: Обновить .gitignore**
```gitignore
# Documentation files (не публикуются на GitHub Pages, но в репо)
.docs/

# Старые файлы
*.bak
*-old.html
```

### **Шаг 5: Создать README в .docs/**
```markdown
# 📚 ДОКУМЕНТАЦИЯ

Все документационные файлы проекта находятся здесь.

## Основные документы:
- README.md (в корне проекта)
- TOKENOMICS_FINAL.md
- PROJECT_STRUCTURE.md
- ... и т.д.
```

---

## ✅ **РЕЗУЛЬТАТ:**

### **ДО очистки:**
```
Корень репозитория: ~70 файлов
.md файлы: ~35 файлов
```

### **ПОСЛЕ очистки:**
```
Корень репозитория: ~25 файлов
.md файлы в корне: 1 (README.md)
.md файлы в .docs/: ~35 файлов
```

---

## 📋 **ЧЕКЛИСТ:**

- [ ] Создать папку `.docs/`
- [ ] Переместить все .md файлы (кроме README.md) в `.docs/`
- [ ] Удалить sora2_*.md и boomer_cinema_prompt.md
- [ ] Удалить index-old.html
- [ ] Обновить .gitignore
- [ ] Создать .docs/README.md
- [ ] Закоммитить изменения
- [ ] Запушить на GitHub
- [ ] Проверить GitHub Pages (должны работать без изменений)

---

## 🎯 **О РЕПОЗИТОРИЯХ:**

### **Основной репозиторий:**
```
https://github.com/tr1h/huma-chain-xyz
```
**Использовать:** ✅ ДА
**Действие:** Навести порядок (см. выше)

### **Старый репозиторий:**
```
https://github.com/tr1h/solana-tamagotchi
```
**Использовать:** ❌ НЕТ
**Действие:** Удалить или сделать архивным (Settings → Archive this repository)

---

## 💡 **ПОЧЕМУ ЭТО ВАЖНО:**

✅ **Профессионализм** - чистый репозиторий выглядит серьезнее
✅ **Навигация** - легче найти нужный файл
✅ **GitHub Pages** - быстрее загружается (меньше файлов в корне)
✅ **Hackathon** - судьи видят организованный проект

---

## 🚀 **ГОТОВО!**

Хочешь, чтобы я выполнил эти действия автоматически?

