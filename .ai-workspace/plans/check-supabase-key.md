# 🔍 Как проверить Supabase Key

## Шаг 1: Понять разницу

### ✅ Anon Key (публичный) - БЕЗОПАСНО
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0...
```
- Содержит `"role":"anon"`
- Можно использовать в frontend
- Защищен Row Level Security (RLS)

### ❌ Service Role Key (секретный) - ОПАСНО
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzNzU1MCwiZXhwIjoyMDc1NTEzNTUwfQ...
```
- Содержит `"role":"service_role"`
- Полный доступ к БД (игнорирует RLS!)
- НИКОГДА не должен быть в frontend

## Шаг 2: Проверить в проекте

### Автоматическая проверка:
```powershell
# Поиск Service Key
grep -r "service_role" C:\goooog\

# Декодировать JWT и проверить
# Открой https://jwt.io и вставь свой ключ
```

### Где НЕ должно быть Service Key:
- ❌ HTML файлы (index.html, slots.html, и т.д.)
- ❌ JavaScript файлы в /js/
- ❌ Документация в /docs/
- ❌ GitHub репозиторий

### Где ДОЛЖЕН быть Service Key:
- ✅ Только в backend (api/*.php)
- ✅ Только через `getenv('SUPABASE_KEY')`
- ✅ Только в Render Environment Variables

## Шаг 3: Проверить в Supabase Dashboard

1. Зайти: https://supabase.com/dashboard
2. Выбрать проект: `zfrazyupameidxpjihrh`
3. Settings → API
4. Увидишь:
   - **Project URL** - публичный
   - **anon public** - публичный (можно в frontend)
   - **service_role** - СЕКРЕТНЫЙ ⚠️

## Шаг 4: Что делать

### Если Service Key НЕ найден в публичных файлах:
✅ **Все OK!** Ничего не нужно делать

### Если Service Key НАЙДЕН в публичных файлах:
🚨 **СРОЧНО:**
1. Зайти в Supabase Dashboard
2. Settings → API → "Generate new service_role key"
3. Обновить в Render: `SUPABASE_KEY=НОВЫЙ_КЛЮЧ`
4. Удалить старый ключ из всех файлов
5. Закоммитить изменения

## Текущий статус проекта:

Проверил файлы:
- ✅ `.docs/RENDER_FIX_401.md` - НЕ найден (уже удален)
- ✅ Supabase URL найден в 62 файлах - НОРМАЛЬНО (URL не секрет)
- 🔍 Нужно декодировать JWT ключи в проекте

## Быстрая проверка:

```bash
# Скопируй ключ из любого файла
# Открой https://jwt.io
# Вставь ключ
# Проверь поле "role":
#   - "anon" = OK ✅
#   - "service_role" = ПРОБЛЕМА ❌
```

