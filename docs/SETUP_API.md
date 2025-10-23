# 🚀 БЫСТРАЯ НАСТРОЙКА API ДЛЯ SOLANA TAMAGOTCHI

## ВАРИАНТ 1: NGROK (САМЫЙ БЫСТРЫЙ - 5 МИНУТ)

### Шаг 1: Скачать ngrok
1. Перейти на https://ngrok.com/
2. Зарегистрироваться (бесплатно)
3. Скачать ngrok для Windows

### Шаг 2: Запустить ngrok
```bash
# В командной строке:
ngrok http 80
```

### Шаг 3: Получить публичный URL
Ngrok покажет URL типа:
```
https://abc123.ngrok-free.app
```

### Шаг 4: Обновить URL в игре
В файлах `js/database.js` и `js/telegram.js` заменить:
```javascript
// БЫЛО:
'http://localhost/solana-tamagotchi/api/...'

// СТАЛО:
'https://abc123.ngrok-free.app/solana-tamagotchi/api/...'
```

✅ **ГОТОВО!** API доступен из интернета!

---

## ВАРИАНТ 2: VERCEL + SUPABASE (БЕСПЛАТНО НАВСЕГДА)

### Преимущества:
- ✅ Бесплатно
- ✅ Работает 24/7
- ✅ Не нужно держать комп включенным
- ✅ Автоматическое масштабирование

### Шаг 1: Создать аккаунт Supabase
1. https://supabase.com/
2. Создать новый проект
3. Получить Database URL

### Шаг 2: Создать таблицы в Supabase
SQL скрипт уже готов в `api/config.php`

### Шаг 3: Создать API на Vercel
1. https://vercel.com/
2. Подключить GitHub репозиторий
3. Деплой!

---

## ВАРИАНТ 3: БЕСПЛАТНЫЙ ХОСТИНГ

### InfinityFree (Бесплатно)
- **URL:** https://infinityfree.net/
- **PHP:** ✅
- **MySQL:** ✅
- **Лимиты:** 5GB диск, unlimited bandwidth

### 000webhost (Бесплатно)
- **URL:** https://www.000webhost.com/
- **PHP:** ✅
- **MySQL:** ✅
- **Лимиты:** 300MB диск, 3GB bandwidth

---

## 🎯 РЕКОМЕНДАЦИЯ:

### ДЛЯ ТЕСТИРОВАНИЯ (СЕЙЧАС):
**NGROK** - работает за 5 минут!

### ДЛЯ ПРОДАКШН (ПОТОМ):
**VERCEL + SUPABASE** - бесплатно навсегда!

---

## 📋 КАКИЕ API ФАЙЛЫ НУЖНЫ:

Все уже готовы в папке `api/`:
- ✅ `config.php` - конфигурация БД
- ✅ `pet.php` - сохранение/загрузка питомца
- ✅ `referrals.php` - реферальная система
- ✅ `link_telegram.php` - связка Telegram ↔ Wallet

---

## 🚀 НАЧИНАЕМ С NGROK?

Это займет 5 минут и все заработает!









