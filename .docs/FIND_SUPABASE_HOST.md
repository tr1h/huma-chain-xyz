# 🔍 Как найти правильный хост Supabase

## 📋 Где искать Connection String:

### **В Supabase Dashboard:**

1. **Settings** → **Database**
2. Найди вкладку **"Connection string"** или **"Connection info"**
3. Скопируй хост из строки подключения

**Примеры форматов:**

#### **Connection Pooling (рекомендуется):**
```
postgresql://postgres:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```
**Хост:** `aws-0-us-east-1.pooler.supabase.com`  
**Порт:** `6543`

#### **Direct Connection:**
```
postgresql://postgres:[PASSWORD]@db.zfrazyupameidxpjihrh.supabase.co:5432/postgres
```
**Хост:** `db.zfrazyupameidxpjihrh.supabase.co`  
**Порт:** `5432`

---

## 🔧 Стандартные форматы Supabase:

### **Connection Pooling:**
- `aws-0-[region].pooler.supabase.com:6543`
- Где `[region]` - регион проекта (us-east-1, eu-west-1, и т.д.)

### **Direct Connection:**
- `db.[project-ref].supabase.co:5432`
- Где `[project-ref]` - ID проекта (zfrazyupameidxpjihrh)

---

## ⚠️ Если хост не разрешается:

### **Возможные причины:**

1. **Неправильный формат хоста**
   - Проверь connection string в Dashboard

2. **Регион не совпадает**
   - Узнай регион проекта в Dashboard

3. **Connection pooling не включен**
   - Включи в Settings → Database → Connection pooling

4. **Firewall блокирует**
   - Проверь настройки сети

---

## ✅ Быстрое решение:

Если не можешь найти connection string, попробуй:

1. **Connection Pooling (порт 6543):**
   ```
   aws-0-us-east-1.pooler.supabase.com
   aws-0-eu-west-1.pooler.supabase.com
   aws-0-ap-southeast-1.pooler.supabase.com
   ```

2. **Direct (порт 5432):**
   ```
   db.zfrazyupameidxpjihrh.supabase.co
   ```

3. **Проверь в Dashboard:**
   - Settings → Database
   - Найди секцию "Connection string" или "Connection info"
   - Скопируй хост оттуда

---

## 💡 Альтернатива:

Если прямого подключения не работает, используй **Supabase REST API** через:
- `SUPABASE_URL` (уже настроен)
- `SUPABASE_KEY` (уже настроен)

Это не требует прямого подключения к PostgreSQL!

