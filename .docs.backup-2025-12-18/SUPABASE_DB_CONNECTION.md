# 🔧 Настройка подключения к Supabase Database

## 🐛 Проблема:

```
could not translate host name "db.zfrazyupameidxpjihrh.supabase.co" to address: Unknown host
```

**Причина:** Неправильный формат хоста для прямого подключения к PostgreSQL

---

## ✅ Решение:

### **Вариант 1: Получить правильный хост из Supabase Dashboard**

1. Зайди в **Supabase Dashboard**
2. **Settings** → **Database**
3. Найди **Connection string** или **Connection pooling**
4. Используй хост из connection string

**Формат обычно:**
- `aws-0-[region].pooler.supabase.com` (для connection pooling)
- Или `db.[project-ref].supabase.co` (прямое подключение)

### **Вариант 2: Использовать Connection Pooling (рекомендуется)**

В Supabase есть два типа подключений:
1. **Direct connection** - для транзакций
2. **Connection pooling** - для запросов (рекомендуется)

**Хост для pooling обычно:**
```
aws-0-[region].pooler.supabase.com
```

Где `[region]` - регион твоего проекта (например, `us-east-1`)

---

## 🔍 Как найти правильный хост:

### **В Supabase Dashboard:**

1. **Settings** → **Database**
2. Найди секцию **Connection string**
3. Скопируй хост из строки подключения

**Пример connection string:**
```
postgresql://postgres:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Хост здесь:** `aws-0-us-east-1.pooler.supabase.com`
**Порт:** `6543` (для pooling) или `5432` (для direct)

---

## 📝 Обновление настроек:

После получения правильного хоста, обнови:

1. **`api/start_api.ps1`:**
   ```powershell
   $env:SUPABASE_DB_HOST = "aws-0-[region].pooler.supabase.com"
   $env:SUPABASE_DB_PORT = "6543"  # или 5432 для direct
   ```

2. **`start_bot_and_api.ps1`:**
   ```powershell
   $env:SUPABASE_DB_HOST = "aws-0-[region].pooler.supabase.com"
   $env:SUPABASE_DB_PORT = "6543"
   ```

---

## ⚠️ Важно:

- **Connection pooling** (порт 6543) - для большинства запросов
- **Direct connection** (порт 5432) - для транзакций
- Убедись, что используешь правильный порт

---

## 🔗 Полезные ссылки:

- Supabase Dashboard: https://supabase.com/dashboard
- Документация: https://supabase.com/docs/guides/database/connecting-to-postgres

