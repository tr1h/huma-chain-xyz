# Vercel Deployment Guide

## 🚀 Мягкий переезд на Vercel

Vercel развернется **параллельно** с Railway. Railway продолжит работать как backup.

---

## Шаг 1: Подключить GitHub к Vercel

1. Открой [vercel.com](https://vercel.com)
2. Sign up / Log in
3. New Project → Import Git Repository
4. Выбери репозиторий `huma-chain-xyz`

---

## Шаг 2: Настроить Environment Variables

В Vercel Dashboard → Settings → Environment Variables добавь:

```
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_RPC_URL=https://api.devnet.solana.com
```

---

## Шаг 3: Deploy

1. Нажми **Deploy**
2. Дождись завершения (2-3 минуты)
3. Получи Vercel URL: `https://huma-chain-xyz.vercel.app`

---

## Шаг 4: Протестировать API

### Тест 1: Баланс
```
https://huma-chain-xyz.vercel.app/api/tama/balance?telegram_id=202140267
```

### Тест 2: Транзакции
```
https://huma-chain-xyz.vercel.app/api/tama/transactions/list?limit=10
```

### Тест 3: NFT mint (без on-chain)
```
https://tr1h.github.io/huma-chain-xyz/nft-mint.html?user_id=202140267
```
Открой DevTools → Console, замени в коде:
```javascript
const TAMA_API_BASE = 'https://huma-chain-xyz.vercel.app/api/tama';
```

---

## ⚠️ Важно: On-Chain Distribution

**Vercel не поддерживает Solana CLI** (serverless ограничение).

### Решение: Гибридный подход

1. **Основной API → Vercel** (быстро и стабильно)
   - `/balance`
   - `/leaderboard/*`
   - `/transactions/*`
   - `/nft/mint` (без on-chain)

2. **On-chain distribution → Railway** (специализированный)
   - `/nft/mint-bronze-onchain`

### Как это работает:

В `nft-mint.html` будет два API base:
```javascript
const TAMA_API_BASE = 'https://huma-chain-xyz.vercel.app/api/tama'; // Основной API
const ONCHAIN_API_BASE = 'https://huma-chain-xyz-production.up.railway.app/api/tama'; // On-chain
```

---

## Преимущества

✅ **Vercel:**
- Автоматическое масштабирование
- Edge Network (быстрее)
- Стабильность
- Бесплатный план

✅ **Railway (backup):**
- On-chain distribution
- Solana CLI support
- Backup API

---

## После успешного теста

1. Обновить `nft-mint.html` с новым API URL
2. Обновить bot с новым API URL
3. Railway оставить как backup

---

## Rollback (если что-то не так)

Просто вернуть старый API URL в коде:
```javascript
const TAMA_API_BASE = 'https://huma-chain-xyz-production.up.railway.app/api/tama';
```

Railway продолжит работать.

