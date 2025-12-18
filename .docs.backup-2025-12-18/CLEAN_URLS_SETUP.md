# 🔗 Clean URLs Setup - Убрать .html из URL

## ✅ Что сделано:

### 1. **Добавлены правила в `.htaccess`** (для Apache сервера)

```apache
# Remove .html extension from URLs (301 redirect)
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}\.html -f
RewriteRule ^(.*)\.html$ /$1 [R=301,L]

# Add .html extension internally (for files without extension)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}\.html -f
RewriteRule ^(.*)$ $1.html [L]

# Redirect root index.html to clean URL
RewriteCond %{THE_REQUEST} /index\.html[\s?] [NC]
RewriteRule ^index\.html$ / [R=301,L]
```

**Как это работает:**
- Старые URL с `.html` автоматически редиректятся на чистые URL (301 redirect для SEO)
- Чистые URL (без `.html`) внутренне обрабатываются как файлы с `.html`
- Пользователь видит чистые URL в адресной строке

### 2. **Обновлены ссылки в коде:**

✅ **index.html** - все ссылки обновлены:
- `index.html` → `/` или `index`
- `mint.html` → `mint`
- `profile.html` → `profile`
- `tamagotchi-game.html` → `tamagotchi-game`
- `my-nfts.html` → `my-nfts`
- `treasury-monitor.html` → `treasury-monitor`

✅ **js/navigation.js** - обновлены URL в навигации:
- `telegram-game.html` → `tamagotchi-game`
- `nft-mint-5tiers.html` → `mint`
- `my-nfts.html` → `my-nfts`

---

## 📋 Что нужно проверить/обновить:

### ⚠️ Другие HTML файлы:
Нужно обновить ссылки в:
- `tamagotchi-game.html`
- `mint.html`
- `profile.html`
- `my-nfts.html`
- `treasury-monitor.html`
- И других страницах

### ⚠️ JavaScript файлы:
Проверить все `.js` файлы на наличие ссылок с `.html`:
- `js/auth.js`
- `js/profile-widget.js`
- И другие

### ⚠️ Telegram Bot:
Если бот отправляет ссылки на сайт, нужно обновить их тоже.

---

## 🎯 Результат:

### До:
```
https://solanatamagotchi.com/mint.html
https://solanatamagotchi.com/profile.html
https://solanatamagotchi.com/tamagotchi-game.html
```

### После:
```
https://solanatamagotchi.com/mint
https://solanatamagotchi.com/profile
https://solanatamagotchi.com/tamagotchi-game
```

---

## ⚠️ Важно:

### Если используется GitHub Pages:
GitHub Pages **НЕ поддерживает `.htaccess`**! 

**Альтернативные решения для GitHub Pages:**

1. **Использовать структуру папок:**
   ```
   /mint/index.html  →  /mint/
   /profile/index.html  →  /profile/
   ```

2. **Или просто обновить ссылки** (GitHub Pages автоматически обработает `/page` как `/page.html`)

3. **Использовать Jekyll** с `permalink: /:title/` в `_config.yml`

### Если используется Apache:
✅ Правила в `.htaccess` работают автоматически!

---

## 🔍 Проверка:

1. Откройте сайт и проверьте URL в адресной строке
2. Старые ссылки с `.html` должны автоматически редиректиться на чистые URL
3. Все внутренние ссылки должны работать без `.html`

---

## 📝 TODO:

- [ ] Обновить ссылки в `tamagotchi-game.html`
- [ ] Обновить ссылки в `mint.html`
- [ ] Обновить ссылки в `profile.html`
- [ ] Обновить ссылки в `my-nfts.html`
- [ ] Проверить все JS файлы
- [ ] Обновить ссылки в Telegram боте (если есть)
- [ ] Протестировать на реальном сервере


