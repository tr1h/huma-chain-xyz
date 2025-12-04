# 🔧 Фикс 401 ошибки на Render.com

## ❌ Проблема

```
Failed to save game state
"details":{"message":"Invalid API key"}
"http_code":401
```

## ✅ Решение

На Render.com НЕ УСТАНОВЛЕНЫ переменные окружения для Supabase!

### Шаг 1: Открыть Render.com

1. Перейди на [render.com](https://render.com)
2. Открой сервис **api.solanatamagotchi.com**

### Шаг 2: Добавить переменные

Перейди в **Environment** → **Add Environment Variable**

#### 1️⃣ SUPABASE_KEY (обязательно!)

```
Name: SUPABASE_KEY
Value: YOUR_SUPABASE_ANON_KEY_HERE
```
**⚠️ SECURITY:** Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your actual anon key from Supabase Dashboard → Settings → API → Project API keys → `anon` `public`

**Это anon key из Supabase** → Settings → API → Project API keys → `anon` `public`

#### 2️⃣ SUPABASE_SERVICE_ROLE_KEY (опционально, но рекомендуется!)

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE
```
**⚠️ SECURITY:** Replace `YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE` with your actual service_role key from Supabase Dashboard → Settings → API → Project API keys → `service_role` `secret`

**Это service_role key из Supabase** → Settings → API → Project API keys → `service_role` `secret`

⚠️ **ВАЖНО:** Service role key имеет полные права! НЕ показывай его никому!

### Шаг 3: Перезапустить сервис

После добавления переменных:
1. Нажми **Save Changes**
2. Сервис перезапустится автоматически (2-3 минуты)

### Шаг 4: Проверить

Открой консоль браузера на https://solanatamagotchi.com/tamagotchi-game.html

Должно работать:
```
✅ Game state loaded via wallet
✅ Game saved successfully
```

---

## 📋 Все переменные для Render.com

Убедись что установлены ВСЕ:

```env
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=eyJhbGci... (anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (service_role key)
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com
```

---

## 🔍 Как получить ключи из Supabase

1. Открой [supabase.com](https://supabase.com)
2. Выбери проект **zfrazyupameidxpjihrh**
3. Settings → API
4. Скопируй:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

---

## ✅ Теперь всё будет работать!

