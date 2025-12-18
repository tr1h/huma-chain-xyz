# 🚀 SOLANA TAMAGOTCHI - КРАТКАЯ СПРАВКА

> **Быстрый промпт для AI-ассистентов:** Основная информация о проекте за 2 минуты

---

## 🎯 ЧТО ЭТО?

**Play-to-Earn Tamagotchi игра** в Telegram с реальными токенами на Solana.

- 🎮 Игра: `tamagotchi-game.html`
- 💰 Токен: TAMA (SPL Token, 1B supply)
- 🖼️ NFT: 5 тиров (Bronze → Diamond)
- ⚙️ Economy: Централизованное управление через `economy-admin.html`

---

## 🏗️ АРХИТЕКТУРА

```
Frontend (GitHub Pages) → API (Render.com) → Database (Supabase) → Blockchain (Solana)
```

**URLs:**
- Игра: `https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html`
- API: `https://huma-chain-xyz.onrender.com/api/tama`
- Bot: `@GotchiGameBot`

---

## 🪙 TAMA TOKEN

- **Mint:** `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`
- **Supply:** 1,000,000,000 TAMA
- **Network:** Solana Devnet
- **Distribution:** 40% P2E, 20% Team (vesting), 15% Marketing, 10% Liquidity, 10% Community, 5% Reserve

---

## 🖼️ NFT СИСТЕМА (5 ТИРОВ)

| Tier | Supply | Цена | Множитель |
|------|--------|------|-----------|
| Bronze | 4,500 | 5,000 TAMA / 0.15 SOL | 2.0x - 3.0x |
| Silver | 350 | 1.0 → 3.0 SOL | 2.5x - 3.5x |
| Gold | 130 | 3.0 → 10.0 SOL | 3.0x - 4.0x |
| Platinum | 18 | 10.0 → 30.0 SOL | 4.0x - 5.0x |
| Diamond | 2 | 50.0 → 100.0 SOL | 5.0x - 6.0x |

**Bonding Curve:** Цена растет с каждым минтом (кроме Bronze).

---

## ⚙️ ECONOMY ADMIN

**⚠️ КРИТИЧНО:** Все настройки экономики ТОЛЬКО через `economy-admin.html`!

**Настройки:**
- `BASE_CLICK_REWARD` — награда за клик
- `COMBO_WINDOW`, `COMBO_COOLDOWN` — комбо система
- `SPAM_PENALTY` — штраф за спам
- И другие...

**URL:** `https://tr1h.github.io/huma-chain-xyz/economy-admin.html`

---

## 📁 КЛЮЧЕВЫЕ ФАЙЛЫ

### Frontend:
- `tamagotchi-game.html` — основная игра
- `nft-mint-5tiers.html` — минт NFT
- `economy-admin.html` — управление экономикой
- `wallet-admin.html` — локальная админка (НЕ в Git!)

### Backend:
- `api/tama_supabase.php` — основной API
- `api/mint-nft-*.php` — минт NFT
- `bot/bot.py` — Telegram бот

### Database:
- `sql/create_nft_5tier_system.sql` — NFT система
- `sql/create_sol_distributions_table.sql` — логирование SOL

---

## ⚠️ ВАЖНО

1. **Keypair файлы** — НЕ коммитить в Git! (в `.gitignore`)
2. **Economy Admin** — ЕДИНСТВЕННЫЙ способ изменения экономики
3. **Bonding Curve** — цены растут автоматически
4. **UTF-8** — все файлы должны быть в UTF-8 без BOM

---

## 🐛 ЧАСТЫЕ ЗАДАЧИ

### Изменить экономику:
→ `economy-admin.html` (НЕ в коде!)

### Изменить цены NFT:
→ Таблица `nft_bonding_state` в Supabase

### Проверить баланс токенов:
→ `wallet-admin.html` (локально) или API `/tama/balance`

### Исправить крякозябры:
→ Проверить кодировку файла (должна быть UTF-8 без BOM)

---

## 📚 ПОЛНАЯ ДОКУМЕНТАЦИЯ

Смотри `.docs/FULL_PROJECT_PROMPT.md` для полного описания.

---

**Версия:** 2.0 | **Дата:** 2025-11-10

