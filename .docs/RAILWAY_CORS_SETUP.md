# 🔧 Railway CORS Setup Guide

## 🐛 Проблема

CORS ошибка при запросах с GitHub Pages:
```
Access to fetch at 'https://huma-chain-xyz-production.up.railway.app/api/tama/...' 
from origin 'https://tr1h.github.io' has been blocked by CORS policy
```

---

## ✅ Решение 1: PHP Headers (УЖЕ СДЕЛАНО)

В `api/tama_supabase.php` добавлены правильные CORS заголовки:

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
```

---

## ✅ Решение 2: Railway Environment Variables

Если проблема остаётся, проверь настройки Railway:

### 1. Открой Railway Dashboard
https://railway.app/dashboard

### 2. Выбери проект `huma-chain-xyz-production`

### 3. Перейди в **Settings** → **Environment Variables**

### 4. Добавь (если нужно):
```
CORS_ALLOWED_ORIGINS=https://tr1h.github.io,http://localhost
```

---

## ✅ Решение 3: Railway.json Configuration

Создай файл `railway.json` в корне проекта:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "php -S 0.0.0.0:$PORT api/tama_supabase.php",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## ✅ Решение 4: .htaccess (если используешь Apache)

Создай файл `api/.htaccess`:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    Header set Access-Control-Allow-Credentials "true"
    Header set Access-Control-Max-Age "86400"
</IfModule>

# Handle OPTIONS requests
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>
```

---

## ✅ Решение 5: Nginx Configuration (если используешь Nginx)

Если Railway использует Nginx, добавь в конфигурацию:

```nginx
location /api {
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    add_header 'Access-Control-Max-Age' '86400' always;
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

---

## 🧪 Как проверить CORS:

### 1. Проверь заголовки через curl:

```bash
curl -I -X OPTIONS \
  -H "Origin: https://tr1h.github.io" \
  -H "Access-Control-Request-Method: GET" \
  https://huma-chain-xyz-production.up.railway.app/api/tama/transactions/list
```

**Ожидаемые заголовки:**
```
Access-Control-Allow-Origin: https://tr1h.github.io
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 2. Проверь в браузере:

1. Открой https://tr1h.github.io/huma-chain-xyz/transactions-admin.html
2. Открой DevTools → Network
3. Найди запрос к `/api/tama/transactions/list`
4. Проверь **Response Headers** - должны быть CORS заголовки

---

## 🔥 Если ничего не помогает:

### Вариант 1: Используй CORS Proxy (временно)

В `transactions-admin.html` можно использовать CORS proxy:

```javascript
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = `${CORS_PROXY}${TAMA_API_BASE}/transactions/list`;
```

**⚠️ НЕ рекомендуется для продакшена!**

### Вариант 2: Используй Supabase напрямую (временно)

Если API не работает, можно временно использовать прямой Supabase:

```javascript
const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=*`, {
    headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
});
```

---

## 📝 Проверочный список:

- [x] PHP заголовки добавлены
- [ ] Railway environment variables проверены
- [ ] Railway.json создан (если нужно)
- [ ] .htaccess создан (если Apache)
- [ ] Nginx конфигурация (если Nginx)
- [ ] CORS заголовки проверены через curl
- [ ] CORS заголовки проверены в браузере

---

## 🎯 Рекомендация:

**Начни с проверки Railway Dashboard** - возможно, там есть настройки CORS на уровне платформы, которые перезаписывают PHP заголовки.

Если проблема остаётся после всех проверок, **свяжись с Railway Support** - они могут помочь настроить CORS на уровне платформы.

---

**Status:** ✅ PHP Headers Updated  
**Date:** November 7, 2025  
**Next Step:** Check Railway Dashboard Settings

