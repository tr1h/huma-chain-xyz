# 🎯 ADMIN PANEL SETUP

## 📋 ШАГ 1: ПРОВЕРКА ТАБЛИЦ

### 1️⃣ Откройте Supabase SQL Editor:
https://supabase.com/dashboard/project/YOUR_PROJECT/sql

### 2️⃣ Выполните SQL скрипт:
Откройте файл `CHECK_ALL_TABLES.sql` и выполните его в SQL Editor.

Этот скрипт:
- ✅ Добавит `referral_code` в таблицу `leaderboard`
- ✅ Добавит `referrer_telegram_id` и `referred_telegram_id` в таблицу `referrals`
- ✅ Создаст таблицу `pending_referrals` (если не существует)
- ✅ Создаст все необходимые индексы
- ✅ Настроит политики доступа (RLS)

---

## 🎨 ШАГ 2: НАСТРОЙКА АДМИН-ПАНЕЛИ

### 1️⃣ Откройте файл `admin.html`

### 2️⃣ Замените строки 175-176:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

На ваши реальные данные из Supabase:
```javascript
const SUPABASE_URL = 'https://ваш-проект.supabase.co';
const SUPABASE_KEY = 'ваш-anon-key';
```

### 3️⃣ Найти ваши данные:
1. Откройте Supabase Dashboard
2. Перейдите в Settings → API
3. Скопируйте:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon/public key** (длинный ключ)

---

## 🚀 ШАГ 3: ДЕПЛОЙ АДМИН-ПАНЕЛИ

### Вариант 1: GitHub Pages (рекомендуется)
```bash
cd C:\goooog\solana-tamagotchi-public
git add admin.html
git commit -m "Add admin panel"
git push
```

Панель будет доступна по адресу:
`https://tr1h.github.io/solana-tamagotchi/admin.html`

### Вариант 2: Локально
Просто откройте файл `admin.html` в браузере.

---

## 📊 ВОЗМОЖНОСТИ АДМИН-ПАНЕЛИ

### 📈 Статистика:
- **Total Users** - общее количество пользователей
- **Total Referrals** - количество активных рефералов
- **Pending Referrals** - рефералы в ожидании (без кошелька)
- **TAMA Distributed** - общее количество распределенных токенов

### 📋 Таблицы:
1. **Leaderboard** - все пользователи с их балансами
2. **Active Referrals** - активные реферальные связи
3. **Pending Referrals** - ожидающие реферальные связи

### 🔄 Функции:
- Кнопка "Refresh Data" - обновить все данные
- Автоматическая загрузка при открытии страницы
- Адаптивный дизайн для мобильных устройств

---

## 🔒 БЕЗОПАСНОСТЬ

⚠️ **ВАЖНО:**
- Админ-панель использует **anon/public key** (не secret key)
- Это безопасно, так как Supabase RLS контролирует доступ
- Для продакшена рекомендуется:
  - Добавить аутентификацию
  - Ограничить доступ по IP
  - Использовать отдельный поддомен

---

## ✅ ГОТОВО!

Теперь у вас есть:
- ✅ Проверенные таблицы в Supabase
- ✅ Админ-панель для просмотра данных
- ✅ Автоматическое обновление статистики

**Проверьте работу:**
1. Откройте админ-панель
2. Нажмите "Refresh Data"
3. Все данные должны отобразиться!

---

## 🆘 TROUBLESHOOTING

### Проблема: "Configuration Required"
**Решение:** Замените SUPABASE_URL и SUPABASE_KEY на реальные значения

### Проблема: "Error loading data"
**Решение:** 
1. Проверьте правильность URL и KEY
2. Убедитесь что SQL скрипт выполнен
3. Проверьте RLS политики в Supabase

### Проблема: "No data"
**Решение:** Это нормально, если еще нет пользователей/рефералов

---

**🎉 ГОТОВО К ИСПОЛЬЗОВАНИЮ!**


