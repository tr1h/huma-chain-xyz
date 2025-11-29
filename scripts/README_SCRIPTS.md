# 📜 SCRIPTS FOLDER - БЫСТРЫЙ СТАРТ

**Все скрипты проекта в одной папке!**

---

## 🚀 БЫСТРЫЙ PUSH В GITHUB

### **СПОСОБ 1: Автоматический (PowerShell)**

```powershell
.\scripts\auto-push.ps1 "Your commit message"
```

**Пример:**
```powershell
.\scripts\auto-push.ps1 "Fix bug in mint page"
```

**Что делает:**
- ✅ git add -A
- ✅ git commit -m "Your message"
- ✅ git push origin main

---

### **СПОСОБ 2: Интерактивный (Batch)**

**Двойной клик:**
```
scripts\QUICK_PUSH.bat
```

**Что делает:**
- Проверяет есть ли изменения
- Спрашивает commit message
- Пушит в GitHub

---

## 📦 BACKUP SCRIPTS

### **Бекап файлов:**
```
scripts\CREATE_BACKUP.bat
```
Создаёт полный бекап проекта на D:\

### **Бекап базы данных:**
```
scripts\BACKUP_DATABASE.bat
```
Экспортирует Supabase в JSON

---

## 🔍 ПРОВЕРКА СТАТУСА

### **Проверка Git:**
```
scripts\CHECK_STATUS.bat
```
Показывает:
- Git status
- Last commits
- Branch info

### **Проверка безопасности:**
```
scripts\CHECK_GIT_STATUS.bat
```
Проверяет что секреты НЕ в Git

---

## 🚀 DEPLOY SCRIPTS

### **Deploy всего:**
```
scripts\PUSH_ALL_FINAL.bat
```

### **Deploy specific:**
- `scripts\PUSH_WHITEPAPER_NOW.bat` - Только whitepaper
- `scripts\PUSH_SECURITY_FIXES.bat` - Security fixes
- `scripts\PUSH_LEGAL_DOCUMENTS.bat` - Legal docs

---

## 📋 ВСЕ СКРИПТЫ (СПИСОК)

### **Push Scripts:**
- `QUICK_PUSH.bat` ⭐ **РЕКОМЕНДУЮ**
- `auto-push.ps1` ⭐ **РЕКОМЕНДУЮ**
- `PUSH_NOW.bat`
- `PUSH_ALL_FINAL.bat`
- `PUSH_EVERYTHING_NOW.bat`
- `push-all-now.bat`

### **Backup Scripts:**
- `CREATE_BACKUP.bat`
- `BACKUP_DATABASE.bat`
- `BACKUP_DB_SIMPLE.bat`

### **Check Scripts:**
- `CHECK_STATUS.bat`
- `CHECK_GIT_STATUS.bat`
- `CHECK_PUSH_STATUS.bat`
- `CHECK_AND_PUSH_ALL.bat`

### **Deploy Scripts:**
- `DEPLOY_SECURITY_FIXES.bat`
- `deploy-updates.bat`
- `deploy-whitepaper.bat`
- `deploy.ps1`

### **Specific Push Scripts:**
- `PUSH_WHITEPAPER_NOW.bat`
- `PUSH_SECURITY_FIXES.bat`
- `PUSH_LEGAL_DOCUMENTS.bat`
- `PUSH_MAINNET_READY.bat`
- `PUSH_LOGO_NOW.bat`
- `PUSH_STATS_FIX.bat`
- `PUSH_PHP_API_FIX.bat`
- `PUSH_CLEAN_URLS.bat`
- `PUSH_ARCHITECTURE_FIX.bat`
- `PUSH_PDF_FIX_NOW.bat`
- `PUSH_PDF_TEXT_FIX.bat`
- `PUSH_CUSTOM_DOMAIN_FIX.bat`
- `PUSH_ALL_FIXES.bat`
- `PUSH_DATES_FIX.bat`
- `FORCE_PUSH_PDF_FIX.bat`

### **Reorganize Scripts:**
- `REORGANIZE_PROJECT.bat`
- `REORGANIZE_NOW.bat`
- `START_REORGANIZE.bat`

---

## ⚡ БЫСТРЫЙ СТАРТ

**Хочешь быстро запушить изменения?**

### **ВАРИАНТ 1: Двойной клик**
```
scripts\QUICK_PUSH.bat
```

### **ВАРИАНТ 2: PowerShell**
```powershell
.\scripts\auto-push.ps1 "Update something"
```

### **ВАРИАНТ 3: Ручная команда**
```bash
git add -A && git commit -m "Update" && git push origin main
```

---

## 📊 GIT НАСТРОЕН!

```
✅ User: tr1h
✅ Email: travkevich@gmail.com
✅ Repo: github.com/tr1h/huma-chain-xyz
✅ Token: настроен (ghp_3qb...RgRK)
```

**Всё готово для автоматического push!** 🚀

---

## 🔒 БЕЗОПАСНОСТЬ

**Токен настроен безопасно:**
- ✅ В Git remote URL (не виден в файлах)
- ✅ НЕ сохранен в проекте
- ✅ НЕ закоммичен в Git
- ✅ Работает только локально

---

**НУЖНА ПОМОЩЬ?**

Просто скажи AI: "Запуши это в GitHub" - и готово! 💪


