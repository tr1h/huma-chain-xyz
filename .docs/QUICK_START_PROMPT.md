# 🚀 Quick Start Prompt для нового чата

Скопируй и вставь это в новый чат с AI:

---

**Контекст проекта:**

Я работаю над Solana Tamagotchi Bot - Telegram мини-приложение + Python бот на Render.com с NFT системой.

**Ключевая информация:**
- Frontend: GitHub Pages (https://tr1h.github.io/huma-chain-xyz/)
- Backend API: PHP на Render.com (https://huma-chain-xyz.onrender.com)
- Bot: Python на Render.com (python-telegram-bot)
- База данных: Supabase PostgreSQL (только REST API, без прямых SQL подключений)
- Репо: https://github.com/tr1h/huma-chain-xyz

**NFT Система (5 тиров):**
- Bronze: 5000 TAMA или 0.15 SOL (фиксированная цена) → 2.0x-3.0x boost
- Silver: 1.0-3.0 SOL (bonding curve) → 2.5x-3.5x boost
- Gold: 3.0-10.0 SOL → 3.0x-4.0x boost
- Platinum: 10.0-30.0 SOL → 4.0x-5.0x boost
- Diamond: 50.0-100.0 SOL → 5.0x-6.0x boost

**Важные таблицы в Supabase:**
- `leaderboard` - игроки (telegram_id BIGINT, tama INTEGER, wallet_address TEXT)
- `user_nfts` - NFT владение (telegram_id BIGINT, tier_name TEXT, rarity TEXT, earning_multiplier NUMERIC)
- `nft_designs` - дизайны NFT (tier_name TEXT, is_minted BOOLEAN)
- `nft_bonding_state` - bonding curve состояние
- `tama_transactions` - все транзакции TAMA

**RPC функция (важно!):**
- `insert_user_nft(p_telegram_id TEXT, ...)` - принимает telegram_id как TEXT, кастует в BIGINT
- Используется для обхода PostgREST type mismatch issues

**Недавние исправления:**
- ✅ Исправлен telegram_id type mismatch через RPC функцию
- ✅ Bronze NFT минт работает (TAMA и SOL)
- ✅ Silver/Gold/Platinum/Diamond минт обновлен по аналогии с Bronze
- ✅ Убрана обязательная регистрация игрока в API (бот создает позже)
- ✅ Используется `leaderboard` вместо устаревшей таблицы `players`

**Текущая задача:** [опиши свою задачу здесь]

**Для детального описания проекта прочитай:** `.docs/CURRENT_PROJECT_STATE.md` в репозитории.

---

**Важные особенности:**
1. telegram_id в базе - BIGINT, но отправляй как STRING в RPC функцию
2. Используй `tier_name=eq.Bronze&is_minted=eq.false` для поиска NFT дизайнов
3. Игрок может не существовать в leaderboard при минте за SOL - это ок
4. После минта отметь дизайн как `is_minted=true`
5. PowerShell на Windows не поддерживает `&&` - используй отдельные git команды

