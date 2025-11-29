# 🤖 AI AUTO-PUSH POLICY

**Date:** November 29, 2025  
**Status:** ✅ ACTIVE  
**Policy:** AI Assistant will ALWAYS push changes to GitHub automatically

---

## 📋 ПРАВИЛО:

**ВСЕГДА ПУШИТЬ В GITHUB ПОСЛЕ ИЗМЕНЕНИЙ!**

---

## ✅ КОГДА ПУШИТЬ:

### **ОБЯЗАТЕЛЬНО ПУШИТЬ:**

1. ✅ После создания новых файлов
2. ✅ После редактирования существующих файлов
3. ✅ После реорганизации структуры
4. ✅ После исправления багов
5. ✅ После добавления документации
6. ✅ После обновления скриптов
7. ✅ После любых изменений в проекте

### **НЕ ПУШИТЬ:**

1. ❌ Секретные файлы (они в .gitignore)
2. ❌ Временные файлы (*.tmp, *.log)
3. ❌ node_modules/
4. ❌ .private/ (секреты)

---

## 🚀 КОМАНДЫ ДЛЯ PUSH:

### **СТАНДАРТНЫЙ PUSH:**

```bash
cd C:\goooog
git add -A
git commit -m "Описание изменений"
git push origin main
```

### **БЫСТРЫЙ PUSH (если только новые файлы):**

```bash
cd C:\goooog
git add .
git commit -m "Add new files"
git push origin main
```

### **PUSH С ПОДРОБНЫМ СООБЩЕНИЕМ:**

```bash
cd C:\goooog
git add -A
git commit -m "Основное сообщение" -m "- Деталь 1" -m "- Деталь 2"
git push origin main
```

---

## 📝 ФОРМАТ COMMIT MESSAGES:

### **Эмодзи для типов изменений:**

- 🆕 `🆕 Add` - Новые файлы
- 🔧 `🔧 Fix` - Исправления
- ♻️ `♻️ Refactor` - Рефакторинг
- 📚 `📚 Docs` - Документация
- 🚀 `🚀 Deploy` - Деплой
- 🎨 `🎨 Style` - Стили
- ⚡ `⚡ Performance` - Оптимизация
- 🐛 `🐛 Bugfix` - Багфиксы
- ✨ `✨ Feature` - Новые функции
- 🔐 `🔐 Security` - Безопасность

### **Примеры:**

```
🆕 Add automatic push scripts
🔧 Fix Git token configuration
♻️ Reorganize project structure
📚 Add documentation for scripts
🚀 Deploy security fixes
```

---

## 🔍 ПРОВЕРКА ПЕРЕД PUSH:

### **ВСЕГДА ПРОВЕРЯТЬ:**

1. ✅ `git status` - что изменилось
2. ✅ Нет ли секретных файлов в staging
3. ✅ Commit message понятный
4. ✅ Все нужные файлы добавлены

### **ПРОВЕРКА СЕКРЕТОВ:**

```bash
git status | findstr /i "keypair secret ADMIN_PASSWORDS wallet-admin .private"
```

**Если что-то найдено - НЕ КОММИТИТЬ!**

---

## 📊 СТАТУС GIT:

```
✅ User: tr1h
✅ Email: travkevich@gmail.com
✅ Repo: github.com/tr1h/huma-chain-xyz
✅ Branch: main
✅ Token: Configured (ghp_3qb...RgRK)
✅ Remote: origin (https://github.com/tr1h/huma-chain-xyz.git)
```

---

## ⚠️ ВАЖНО:

### **НЕ ПУБЛИКОВАТЬ:**

- ❌ Токены
- ❌ Пароли
- ❌ Приватные ключи
- ❌ Секретные фразы
- ❌ API ключи

### **ВСЕГДА В .GITIGNORE:**

- ✅ `.private/`
- ✅ `*-keypair.json`
- ✅ `secret_phrase.txt`
- ✅ `ADMIN_PASSWORDS.txt`
- ✅ `.env`
- ✅ `*.log`

---

## 🎯 РАБОЧИЙ ПРОЦЕСС:

### **ПОСЛЕ ЛЮБЫХ ИЗМЕНЕНИЙ:**

1. ✅ Проверить `git status`
2. ✅ Добавить файлы `git add -A`
3. ✅ Создать commit с понятным сообщением
4. ✅ Push в GitHub `git push origin main`
5. ✅ Подтвердить успешный push

### **ЕСЛИ PUSH НЕ УДАЛСЯ:**

1. Проверить интернет
2. Проверить Git credentials
3. Проверить права на репозиторий
4. Попробовать снова

---

## 📝 ПРИМЕРЫ COMMIT MESSAGES:

### **Хорошие:**

```
🆕 Add automatic push scripts for easier deployment
🔧 Fix Git token configuration for AI assistant
♻️ Reorganize project: move scripts to scripts/ folder
📚 Add documentation for all scripts in scripts/README_SCRIPTS.md
🚀 Deploy security fixes to mainnet-ready structure
```

### **Плохие (не использовать):**

```
❌ update
❌ fix
❌ changes
❌ test
```

---

## ✅ ЧЕКЛИСТ ПЕРЕД КАЖДЫМ PUSH:

- [ ] Проверил `git status`
- [ ] Нет секретных файлов в staging
- [ ] Commit message понятный и информативный
- [ ] Все нужные файлы добавлены
- [ ] Готов к push

---

## 🚀 АВТОМАТИЗАЦИЯ:

**Скрипты для быстрого push:**

- `scripts/QUICK_PUSH.bat` - интерактивный push
- `scripts/auto-push.ps1` - PowerShell автоматический push

**Но AI должен делать это сам!** 🤖

---

## 📌 НАПОМИНАНИЕ:

**ВСЕГДА ПОСЛЕ ИЗМЕНЕНИЙ:**
```
git add -A
git commit -m "Описание"
git push origin main
```

**БЕЗ ИСКЛЮЧЕНИЙ!** ✅

---

**ПОЛИТИКА АКТИВНА С 29 НОЯБРЯ 2025** 🎯


