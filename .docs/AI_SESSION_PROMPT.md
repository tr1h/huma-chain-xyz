# 🤖 ПРОМПТ ДЛЯ НОВОЙ СЕССИИ AI-АССИСТЕНТА

> **Используй этот промпт при начале новой сессии работы над проектом Solana Tamagotchi**

---

## 📋 ОПИСАНИЕ ПРОЕКТА

**Solana Tamagotchi** — это Play-to-Earn игра в Telegram с интеграцией блокчейна Solana. Игроки ухаживают за виртуальными питомцами (Gotchi), зарабатывают токены TAMA и могут выводить их в реальные кошельки Solana.

### Ключевые особенности:
- 🎮 **Игра в Telegram** — через бота `@GotchiGameBot` или веб-интерфейс
- 💰 **TAMA Token** — SPL токен на Solana Devnet (1 миллиард токенов, mint: `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`)
- 🖼️ **NFT система** — 3-тирная система (Bronze/Silver/Gold) с Metaplex
- 🎯 **Play-to-Earn** — клики, квесты, рефералы, достижения
- 🔥 **On-Chain** — реальные транзакции Solana для вывода и NFT минта
- ⚙️ **Admin Panels** — централизованное управление экономикой игры
- 🛡️ **Security** — серверная валидация, RLS, защита от читерства

---

## 🏗️ АРХИТЕКТУРА

```
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (GitHub Pages)                        │
│  https://solanatamagotchi.com/                              │
│  • tamagotchi-game.html (игра)                              │
│  • mint.html (NFT минт)                                     │
│  • my-nfts.html (мои NFT)                                   │
│  • treasury-monitor.html (мониторинг кошельков)             │
│  • super-admin.html (админка)                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│           BACKEND (3 компонента)                            │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Python Bot   │  │  Node.js API │  │   PHP API    │     │
│  │ (Render.com) │  │  (Render.com)│  │  (Render.com)│     │
│  │ bot.py       │  │ server-      │  │ tama_        │     │
│  │              │  │ onchain.js   │  │ supabase.php │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             ▼
                    ┌─────────────────┐
                    │   Supabase      │
                    │   PostgreSQL    │
                    │   (Database)    │
                    └─────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Solana Devnet  │
                    │  (Blockchain)   │
                    └─────────────────┘
```

---

## 🛠️ ТЕХНИЧЕСКИЙ СТЕК

### Frontend:
- **HTML/CSS/JavaScript** (vanilla, без фреймворков)
- **Solana Web3.js** — взаимодействие с блокчейном
- **Chart.js** — графики и статистика
- **Phantom Wallet** — подключение кошельков
- **GitHub Pages** — хостинг (https://solanatamagotchi.com)

### Backend:
- **Python 3.10+** — Telegram бот (`bot/bot.py`)
- **Node.js 18+** — On-chain операции (`api/server-onchain.js`)
- **PHP 8.2** — REST API (`api/tama_supabase.php`)
- **Supabase** — PostgreSQL база данных (REST API)
- **Render.com** — хостинг всех сервисов

### Blockchain:
- **Solana Devnet** — блокчейн
- **SPL Token** — стандарт токенов
- **Metaplex** — стандарт NFT
- **@solana/web3.js** — JavaScript SDK
- **@solana/spl-token** — работа с токенами

---

## 📁 КЛЮЧЕВЫЕ ФАЙЛЫ

### Frontend (корень проекта):
- `tamagotchi-game.html` — основная игра (403KB)
- `mint.html` — страница минта NFT
- `my-nfts.html` — просмотр NFT пользователя
- `treasury-monitor.html` — мониторинг кошельков проекта (админка)
- `super-admin.html` — супер-админ панель
- `admin-tokenomics.html` — токеномика админка

### Backend:
- `bot/bot.py` — Telegram бот (основная логика)
- `bot/auto_posting.py` — автоматический постинг в Telegram канал
- `bot/twitter_posting.py` — автоматический постинг в Twitter
- `api/server-onchain.js` — Node.js API для on-chain операций
- `api/tama-withdrawal.js` — вывод TAMA из P2E Pool
- `api/tama-transfer.js` — перевод TAMA между кошельками
- `api/mint-nft-onchain.js` — минт NFT на блокчейне
- `api/tama_supabase.php` — PHP REST API

### Конфигурация:
- `render.yaml` — конфигурация Render.com
- `package.json` — зависимости Node.js
- `bot/requirements.txt` — зависимости Python
- `*.keypair.json` — ключи кошельков (НЕ в Git!)

---

## 💰 ТОКЕНОМИКА

### TAMA Token:
- **Mint Address:** `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`
- **Total Supply:** 1,000,000,000 TAMA
- **Decimals:** 9
- **Network:** Solana Devnet

### Распределение:
- **P2E Pool:** 400M (40%) — награды игрокам
- **Team:** 200M (20%) — команда (vesting 4 года)
- **Marketing:** 150M (15%) — маркетинг
- **Liquidity:** 100M (10%) — ликвидность DEX
- **Community:** 100M (10%) — сообщество
- **Reserve:** 50M (5%) — резерв

### Проектные кошельки:
- **Treasury Main V2:** `6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM`
- **P2E Pool:** `HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw`
- **Liquidity Pool:** `5kHACukYuErqSzURPTtexS7CXdqv9eJ9eNvydDz3o36z`
- **Team Wallet:** `AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR`
- **Marketing:** `2eryce7DH7mqDCPegTb696FjXReA5qmx9xfCKH5UneeF`
- **Community:** `9X1DYKzHiYP4V2UuVNGbU42DQkd8ST1nPwbJDuFQY3T`
- **Reserve:** `8cDHbeHcuspjGKXofYzApCCBrAVenSHPy2UAPU1iCEj6`
- **Treasury Liquidity V2:** `CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1`
- **Treasury Team V2:** `Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8`

---

## 🗄️ БАЗА ДАННЫХ (Supabase)

### Основные таблицы:
- `leaderboard` — игроки, балансы, уровни, питомцы
- `user_nfts` — NFT пользователей (mint_address, rarity, cost)
- `transactions` — все транзакции (type, amount, metadata)
- `referrals` — реферальная система
- `daily_rewards` — ежедневные награды

### Важные поля:
- `transactions.metadata` — JSON с распределением средств, подписями транзакций
- `transactions.type` — тип транзакции (nft_mint, withdrawal, burn, etc.)
- `user_nfts.minted_at` — дата минта (НЕ `created_at`!)

---

## 🔄 НЕДАВНИЕ ИЗМЕНЕНИЯ (Ноябрь 2025)

### ✅ Реализовано:
1. **Вывод TAMA из P2E Pool** — через Node.js API (`api/tama-withdrawal.js`)
   - 5% комиссия при выводе
   - Реальные on-chain транзакции
   - Обновление балансов в Supabase

2. **Автопостинг в Telegram** — `bot/auto_posting.py`
   - Ежедневные посты (GM, статистика, токеномика, NFT showcase)
   - Приветствие новых участников группы

3. **Автопостинг в Twitter** — `bot/twitter_posting.py`
   - Интеграция с Typefully.com для тредов
   - Ежедневные твиты

4. **Treasury Monitor** — `treasury-monitor.html`
   - Мониторинг балансов всех кошельков
   - Фильтрация транзакций по кошелькам
   - Графики и статистика (Chart.js)
   - Модальное окно с деталями по каждому кошельку

5. **NFT для кошельков без Telegram** — `my-nfts.html`
   - Поиск NFT по `wallet_address` в транзакциях
   - Отображение NFT, купленных за SOL

### 🔧 Исправлено:
- Исправлена ошибка "Solana CLI not found" — заменено на Node.js библиотеки
- Исправлена фильтрация транзакций в `treasury-monitor.html`
- Исправлены фильтры по дате и типу транзакций
- Улучшена логика определения проектных транзакций

---

## ⚠️ ИЗВЕСТНЫЕ ПРОБЛЕМЫ И ОСОБЕННОСТИ

1. **Render.com Free Tier** — сервисы могут "засыпать" после 15 минут бездействия
   - Решение: Keep-Alive пинги каждые 5 минут (уже реализовано)

2. **CORS** — все API должны иметь правильные CORS заголовки
   - Решение: настроено в `server-onchain.js` и PHP API

3. **Solana Devnet** — иногда нестабилен, транзакции могут задерживаться
   - Решение: retry логика и таймауты

4. **Фильтрация транзакций** — NFT mint транзакции содержат распределение в `metadata.distribution`
   - Важно: проверять и `user_id`, и `type`, и `metadata`

5. **Keypairs** — хранятся в JSON файлах (НЕ в Git!)
   - Загружаются из переменных окружения на Render.com

---

## 🚀 ДЕПЛОЙ

### GitHub Pages (Frontend):
- Автоматический деплой при push в `main`
- URL: https://solanatamagotchi.com

### Render.com (Backend):
- **Bot:** https://huma-chain-xyz-bot.onrender.com
- **Node.js API:** https://solanatamagotchi-onchain.onrender.com
- **PHP API:** https://api.solanatamagotchi.com

### Переменные окружения (Render.com):
- `TELEGRAM_BOT_TOKEN` — токен бота
- `SUPABASE_URL` — URL Supabase
- `SUPABASE_KEY` — ключ Supabase
- `TAMA_MINT_ADDRESS` — адрес токена
- `SOLANA_RPC_URL` — RPC Solana
- `SOLANA_PAYER_KEYPAIR` — JSON keypair плательщика
- `SOLANA_P2E_POOL_KEYPAIR` — JSON keypair P2E Pool

---

## 📝 РАБОЧИЙ ПРОЦЕСС

### Git:
- Репозиторий: `https://github.com/tr1h/huma-chain-xyz.git`
- Основная ветка: `main`
- Все изменения коммитятся и пушатся в `main`
- Render.com автоматически деплоит при push

### Локальная разработка:
```bash
# Клонировать репозиторий
git clone https://github.com/tr1h/huma-chain-xyz.git
cd huma-chain-xyz

# Установить зависимости
cd bot && pip install -r requirements.txt
cd ../api && npm install

# Запустить локально (если нужно)
cd bot && python bot.py
```

### Тестирование:
- Frontend: открыть HTML файлы локально или через GitHub Pages
- Backend: использовать Postman или curl для тестирования API
- Blockchain: все операции на Solana Devnet

---

## 🎯 ТЕКУЩИЕ ЗАДАЧИ И ПРИОРИТЕТЫ

### Высокий приоритет:
1. ✅ Исправлена фильтрация транзакций в `treasury-monitor.html`
2. ✅ Реализованы графики и статистика по кошелькам
3. ✅ Добавлен автопостинг в Telegram и Twitter

### Средний приоритет:
- Улучшение UI/UX админ-панелей
- Оптимизация запросов к Supabase
- Добавление кэширования для балансов

### Низкий приоритет:
- Миграция на Mainnet (когда будет готово)
- Добавление новых функций игры
- Расширение NFT системы

---

## 🔍 ПОЛЕЗНЫЕ КОМАНДЫ И ССЫЛКИ

### Проверка статуса:
- **GitHub:** https://github.com/tr1h/huma-chain-xyz
- **Supabase Dashboard:** https://supabase.com/dashboard/project/zfrazyupameidxpjihrh/
- **Render Dashboard:** https://dashboard.render.com/
- **Solana Explorer:** https://explorer.solana.com/?cluster=devnet
- **Solscan:** https://solscan.io/?cluster=devnet

### API Endpoints:
- `GET /api/tama/balance?telegram_id=XXX` — баланс пользователя
- `POST /api/tama-withdrawal` — вывод TAMA (Node.js)
- `POST /api/mint-nft` — минт NFT (Node.js)
- `GET /api/tama/transactions/list` — список транзакций

### Полезные файлы для изучения:
- `.docs/FULL_PROJECT_PROMPT.md` — полное описание проекта
- `.docs/SYSTEM_ARCHITECTURE.md` — архитектура системы
- `README.md` — основная документация
- `CONTENT_PLAN.md` — план контента для соцсетей

---

## 💡 ВАЖНЫЕ ЗАМЕЧАНИЯ ДЛЯ AI-АССИСТЕНТА

1. **Всегда проверяй структуру данных** — особенно `metadata` в транзакциях (может быть JSON string или object)

2. **Используй правильные адреса** — все адреса кошельков определены в начале файлов

3. **Проверяй CORS** — при работе с API убедись, что CORS настроен правильно

4. **Solana транзакции** — всегда проверяй балансы перед операциями, используй retry логику

5. **Supabase** — используй REST API, не прямые SQL подключения

6. **Фильтрация транзакций** — NFT mint транзакции могут иметь `user_id` пользователя, но содержать распределение в `metadata.distribution`

7. **Keypairs** — никогда не коммить keypair файлы в Git, используй переменные окружения

8. **Тестирование** — всегда тестируй изменения локально перед коммитом

---

## 📞 КОНТАКТЫ И РЕСУРСЫ

- **Telegram Bot:** [@GotchiGameBot](https://t.me/GotchiGameBot)
- **Telegram Channel:** [@gotchigamechat](https://t.me/gotchigamechat)
- **Website:** https://solanatamagotchi.com
- **GitHub:** https://github.com/tr1h/huma-chain-xyz

---

**Последнее обновление:** 14 ноября 2025  
**Версия промпта:** 1.0

---

## 🎯 КАК ИСПОЛЬЗОВАТЬ ЭТОТ ПРОМПТ

Скопируй весь этот текст и вставь в новую сессию AI-ассистента (например, в Cursor или другой AI-инструмент). Это даст AI полное понимание проекта, его архитектуры, текущего состояния и контекста для продолжения работы.

**Пример начала новой сессии:**
```
Привет! Я работаю над проектом Solana Tamagotchi. 
[Вставь весь текст из этого файла]

Сейчас мне нужно [опиши задачу]...
```




