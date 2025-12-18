# 🧪 Тестирование Всех Эндпоинтов

## Быстрая Проверка

### 1. Bot Health (Render)
```bash
curl https://huma-chain-xyz-bot.onrender.com/
```

**Ожидается:**
```json
{
  "status": "ok",
  "bot": "running",
  "timestamp": "2025-11-08T..."
}
```

---

### 2. API Health (Render)
```bash
curl https://huma-chain-xyz.onrender.com/api/tama/test
```

**Ожидается:**
```json
{
  "success": true,
  "message": "PHP is working"
}
```

---

### 3. TAMA Balance API
```bash
curl "https://huma-chain-xyz.onrender.com/api/tama/balance?telegram_id=202140267"
```

**Ожидается:**
```json
{
  "success": true,
  "telegram_id": "202140267",
  "database_tama": 5694,
  "blockchain_tama": 0,
  "total_tama": 5694,
  "pet_name": "Gotchi",
  "level": 13
}
```

---

### 4. Transactions API
```bash
curl "https://huma-chain-xyz.onrender.com/api/tama/transactions/list?limit=10"
```

**Ожидается:**
```json
{
  "success": true,
  "transactions": [...],
  "count": 100
}
```

---

### 5. Leaderboard API
```bash
curl "https://huma-chain-xyz.onrender.com/api/tama/leaderboard/list?limit=10"
```

**Ожидается:**
```json
{
  "success": true,
  "users": [...],
  "count": 24
}
```

---

## Веб Тестирование

### 1. Редирект /mint → /nft-mint.html

**URL:**
```
https://tr1h.github.io/huma-chain-xyz/mint
```

**Ожидается:**
- Автоматический редирект на `nft-mint.html`
- URL параметры сохраняются

---

### 2. NFT Mint Page

**URL:**
```
https://tr1h.github.io/huma-chain-xyz/nft-mint.html?user_id=202140267
```

**Ожидается:**
- TAMA баланс загружается
- Можно выбрать Bronze/Silver/Gold
- Кнопка "MINT" активна

**Проверь в Console (F12):**
```javascript
console.log('NFT Mint page loaded with real-time TAMA balance');
```

---

### 3. Transactions Admin

**URL:**
```
https://tr1h.github.io/huma-chain-xyz/transactions-admin.html
```

**Ожидается:**
- Транзакции загружаются
- Статистика обновляется
- Пагинация работает

**Проверь в Console (F12):**
```javascript
console.log('✅ Admin Environment loaded:', { supabase: '...', api: '...' });
```

**Не должно быть:**
```
❌ Error loading transactions: TypeError: Failed to fetch
❌ CORS policy: No 'Access-Control-Allow-Origin' header
```

---

### 4. Tamagotchi Game

**URL:**
```
https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html?v=20251108&tg_id=7401131043
```

**Ожидается:**
- Игра загружается
- Баланс отображается
- Клики по питомцу работают
- Баланс сохраняется

**Проверь в Console (F12):**
```javascript
console.log('✅ LOADED FROM SUPABASE (PRIMARY):', userData);
console.log('📊 Current state: TAMA=...', 'Level=...');
```

**Не должно быть:**
```
❌ Could not parse pet_data: SyntaxError
❌ Error saving via API: TypeError: Failed to fetch
❌ Access to fetch... blocked by CORS policy
```

---

### 5. Telegram Bot

**Telegram:**
```
@GotchiGameBot
```

**Команды:**
- `/start` - Приветствие
- `/balance` - Баланс TAMA
- `/play` - Открыть игру
- `/nft` - Мои NFT
- `/mint` - Минт NFT

**Ожидается:**
- Бот отвечает быстро (< 2 сек)
- Inline кнопки работают
- Web App открывается

---

## Полное Тестирование (Step-by-Step)

### Тест 1: Mint NFT (Bronze TAMA)

1. **Открой NFT Mint:**
   ```
   https://tr1h.github.io/huma-chain-xyz/nft-mint.html?user_id=202140267
   ```

2. **Открой DevTools (F12)**

3. **Проверь баланс:**
   ```javascript
   const userId = '202140267';
   const { data } = await supabase.from('leaderboard').select('tama').eq('telegram_id', userId).single();
   console.log('Before mint:', data.tama);
   ```

4. **Выбери Bronze → Pay with TAMA → Mint**

5. **Проверь Console:**
   ```
   ✅ SUCCESS!
   🎲 Rarity: ...
   💰 New balance: ...
   ```

6. **Проверь баланс после:**
   ```javascript
   const { data: after } = await supabase.from('leaderboard').select('tama').eq('telegram_id', userId).single();
   console.log('After mint:', after.tama);
   ```

7. **Проверь NFT создан:**
   ```javascript
   const { data: nfts } = await supabase.from('user_nfts').select('*').eq('telegram_id', userId).order('created_at', { ascending: false }).limit(1);
   console.log('Latest NFT:', nfts[0]);
   ```

**Ожидается:**
- Баланс уменьшился на 2500
- NFT создан с random rarity
- Транзакция залогирована

---

### Тест 2: Game Balance Save

1. **Открой игру:**
   ```
   https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html?v=20251108&tg_id=7401131043
   ```

2. **Открой DevTools (F12)**

3. **Проверь текущий баланс:**
   ```javascript
   console.log('Current TAMA:', gameState.tama);
   ```

4. **Кликни питомца 5 раз**

5. **Подожди 3 секунды (auto-save)**

6. **Проверь Console:**
   ```
   ✅ Saved via API successfully
   💾 TAMA: ...
   ```

7. **Обнови страницу (F5)**

8. **Проверь баланс снова:**
   ```javascript
   console.log('After reload:', gameState.tama);
   ```

**Ожидается:**
- Баланс увеличился на +15 (5 clicks × 3 TAMA)
- С NFT boost: +33 (15 × 2.2x)
- После reload баланс тот же

---

### Тест 3: Transactions Admin

1. **Открй admin:**
   ```
   https://tr1h.github.io/huma-chain-xyz/transactions-admin.html
   ```

2. **Подожди загрузки (5-10 сек)**

3. **Проверь:**
   - Total Transactions > 0
   - Total Earned > 0
   - Total Spent > 0
   - Таблица заполнена

4. **Фильтрация:**
   - Выбери "Type: Earn"
   - Проверь что показывает только earn транзакции

5. **Live Update:**
   - Открой игру в другой вкладке
   - Кликни питомца
   - Вернись в admin
   - Проверь что счетчик обновился (~5 секунд)

**Ожидается:**
- Транзакции загружаются
- Фильтры работают
- Live update работает каждые 5 секунд

---

## Проблемы и Решения

### CORS Error

**Ошибка:**
```
Access to fetch at 'https://huma-chain-xyz.onrender.com/api/tama/...' 
blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

**Решение:**
1. Проверь логи Render API
2. Убедись что `.htaccess` правильный
3. Проверь что `mod_headers` включен в Apache

---

### Failed to Fetch

**Ошибка:**
```
❌ Error loading transactions: TypeError: Failed to fetch
```

**Решение:**
1. Проверь что API запущен:
   ```bash
   curl https://huma-chain-xyz.onrender.com/api/tama/test
   ```

2. Если 502 Bad Gateway - API перезагружается (30-60 сек)

3. Если долго не загружается - включи Keep-Alive

---

### pet_data Parse Error

**Ошибка:**
```
Could not parse pet_data: SyntaxError: "[object Object]" is not valid JSON
```

**Решение:**
✅ Уже исправлено!
- Проверяет тип (string vs object)
- Парсит только если string

---

## Чеклист

### Frontend
- [ ] `/mint` редиректит на `/nft-mint.html`
- [ ] NFT mint page загружает TAMA баланс
- [ ] Transactions admin загружает транзакции
- [ ] Game сохраняет баланс
- [ ] pet_data парсится без ошибок

### Backend
- [ ] API health endpoint работает
- [ ] TAMA balance API отвечает
- [ ] Transactions API отвечает
- [ ] Leaderboard API отвечает
- [ ] CORS разрешен для GitHub Pages

### Bot
- [ ] Bot health endpoint работает
- [ ] Bot отвечает на команды
- [ ] Keep-Alive пингует каждые 5 минут
- [ ] Webhook получает обновления

---

## Логи для Дебага

### Render API Logs
```
1. Render Dashboard → huma-chain-xyz → Logs
2. Ищи ошибки:
   - "Fatal error"
   - "Warning"
   - "CORS"
   - "Failed to"
```

### Render Bot Logs
```
1. Render Dashboard → huma-chain-xyz-bot → Logs
2. Ищи:
   - "✅ Keep-Alive: Bot pinged successfully"
   - "✅ Keep-Alive: API pinged successfully"
   - "❌" (любые ошибки)
```

### Browser Console
```
F12 → Console Tab
Фильтр: Ошибки (красные)
```

---

## Итого

Если все тесты прошли успешно:

✅ **Frontend работает** - GitHub Pages
✅ **Backend работает** - Render API
✅ **Bot работает** - Render Web Service
✅ **Keep-Alive работает** - Не засыпает
✅ **CORS настроен** - Нет ошибок
✅ **Данные сохраняются** - Supabase

**Проект готов к использованию! 🚀**



