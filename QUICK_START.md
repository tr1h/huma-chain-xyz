# 🚀 QUICK START GUIDE - Solana Tamagotchi v1.9.1

## 📁 Финальная структура проекта

```
C:\goooog\
├── solana-tamagotchi\           ← ВСЯ КОДОВАЯ БАЗА ЗДЕСЬ
│   ├── bot\                     ← Telegram Bot (@GotchiGameBot)
│   ├── api\                     ← Backend API (PHP)
│   ├── js\                      ← Frontend JavaScript
│   ├── css\                     ← Стили
│   ├── nft-assets\              ← NFT метаданные и изображения
│   ├── index.html               ← Landing page
│   ├── mint.html                ← NFT Mint page
│   ├── tamagotchi-game.html     ← Основная игра
│   └── package.json
│
├── *-keypair.json               ← Solana ключи (НЕ в репо!)
├── tokenomics.json              ← Распределение токенов
├── tama-token-info.json         ← Info о TAMA токене
├── TOKENOMICS.md                ← Полная токеномика
├── WITHDRAWAL_SYSTEM.md         ← Mock withdrawal документация
└── README.md                    ← Главный README
```

## ⚙️ Environment Variables

### Обязательные для бота:
```powershell
$env:TELEGRAM_BOT_TOKEN="8445221254:AAHxX7NCDv3K14LTnAQkM69Lg4QCckFh-E8"
$env:BOT_USERNAME="GotchiGameBot"
$env:SUPABASE_URL="https://zfrazyupameidxpjihrh.supabase.co"
$env:SUPABASE_KEY="eyJhbGc...7wU"
```

### Для блокчейна (опционально):
```powershell
$env:SOLANA_RPC_URL="https://api.devnet.solana.com"
$env:SOLANA_PAYER_KEYPAIR_PATH="C:\goooog\payer-keypair.json"
$env:SOLANA_MINT_KEYPAIR_PATH="C:\goooog\tama-mint-keypair.json"
```

## 🤖 Запуск бота

```powershell
# 1. Установи переменные (см. выше)

# 2. Перейди в папку бота
cd C:\goooog\solana-tamagotchi\bot

# 3. Запусти бота
python bot.py
```

**Проверка:**
- Напиши `/start` в @GotchiGameBot
- Команды: `/help`, `/withdraw`, `/stats`, `/ref`

## 🌐 GitHub Pages

**Проверь:**
- Игра: https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html
- Mint: https://tr1h.github.io/huma-chain-xyz/mint
- Landing: https://tr1h.github.io/huma-chain-xyz/

## 💰 TAMA Token Info

```
Name:        Solana Tamagotchi
Symbol:      TAMA
Supply:      1,000,000,000 (1 Billion)
Decimals:    9
Network:     Solana Devnet
Mint:        Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
```

## 🎮 Основной функционал

### ✅ Работает:
- [x] Telegram бот @GotchiGameBot
- [x] Click-to-Earn игра
- [x] Реферальная программа (L1/L2)
- [x] Лидерборд
- [x] Квесты, бейджи, ранги
- [x] Mock withdrawal система
- [x] NFT mint (с TAMA + SOL)
- [x] Supabase база данных

### 📊 База данных (Supabase):
- `leaderboard` - игроки, балансы, уровни
- `referrals` - реферальные связи
- `nft_mints` - записи NFT
- `tama_transactions` - история транзакций

## 🎯 Демо для хакатона

### Сценарий:
1. **Покажи бота:** @GotchiGameBot → `/start`
2. **Игра:** Кликаешь питомца → зарабатываешь TAMA
3. **Withdrawal:** `/withdraw` → вводишь сумму → demo TX
4. **NFT:** https://tr1h.github.io/huma-chain-xyz/mint
5. **Leaderboard:** `/leaderboard` в боте

## 🔧 Решение проблем

### Бот не запускается:
```powershell
# Проверь ENV:
echo $env:TELEGRAM_BOT_TOKEN
echo $env:SUPABASE_URL

# Если пустые - установи заново
```

### GitHub Pages не обновляется:
- Подожди 2-3 минуты после push
- Очисть кэш браузера (Ctrl+F5)
- Проверь Actions в GitHub

### База не подключается:
- Проверь SUPABASE_URL и KEY
- Убедись, что RLS правильно настроен
- Проверь, что anon key используется

## 📝 Git Workflow

```powershell
# Внести изменения
git add .
git commit -m "Update: описание"

# Запушить в main (для GitHub Pages)
git push origin main

# Или в dev branch
git push origin v1.9.1-nft-integration
```

## 🎉 Всё готово!

**Проект чистый, организованный и готов к хакатону!**

- ✅ Код на GitHub
- ✅ Бот работает
- ✅ GitHub Pages актуален
- ✅ Документация полная
- ✅ Demo-ready

**Version:** 1.9.1  
**Last Updated:** October 31, 2025

