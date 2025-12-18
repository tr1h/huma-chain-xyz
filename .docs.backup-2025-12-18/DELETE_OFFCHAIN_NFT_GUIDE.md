# 🗑️ УДАЛЕНИЕ OFF-CHAIN NFT - Полное руководство

## 📊 Текущая ситуация

### Что такое "Off-Chain Only" NFT:
```
Off-Chain NFT = виртуальные NFT (записи в Supabase)
├─ ❌ НЕ существуют на Solana blockchain
├─ ❌ Не видны в Phantom Wallet
├─ ❌ Нельзя продать/передать
├─ ✅ Дают boost в игре (если код так настроен)
└─ ✅ Хранятся только в таблице user_nfts

On-Chain NFT = реальные токены на Solana
├─ ✅ Видны в Solana Explorer
├─ ✅ Видны в Phantom Wallet
├─ ✅ Можно продать на маркетплейсах
├─ ✅ Можно передать другим
└─ ✅ Защищены blockchain'ом
```

### Как определить Off-Chain NFT:
```sql
-- Off-Chain NFT имеют nft_mint_address вида:
-- "gold_sol_7401131043_1763161970_4866" (содержит подчеркивания '_')

-- On-Chain NFT имеют реальный Solana адрес:
-- "Fxa3mFX1uuC8LuGXD66BXxUAi4qzT7ApBKb9YaSieBWV" (base58, 32-44 символа)

SELECT 
    id,
    telegram_id,
    tier_name,
    rarity,
    nft_mint_address,
    CASE
        WHEN nft_mint_address IS NULL THEN 'No Address'
        WHEN LENGTH(nft_mint_address) < 30 THEN 'Off-Chain'
        WHEN nft_mint_address LIKE '%\_%' THEN 'Off-Chain'
        ELSE 'On-Chain'
    END as nft_type
FROM user_nfts
WHERE is_active = true
ORDER BY minted_at DESC;
```

---

## 🎯 ВАРИАНТЫ ДЕЙСТВИЙ

### ✅ ВАРИАНТ 1: УДАЛИТЬ ВСЕ OFF-CHAIN NFT (РЕКОМЕНДУЮ)

**Когда использовать:**
- ✅ Хочешь, чтобы все NFT были реальными
- ✅ Готовишься к маркетплейсам (Magic Eden, Tensor)
- ✅ Хочешь избежать путаницы у игроков

**Плюсы:**
- ✅ Все NFT теперь реальные
- ✅ Игроки доверяют проекту больше
- ✅ Простая логика ("1 NFT = 1 on-chain token")
- ✅ Готовность к маркетплейсам

**Минусы:**
- ❌ Игроки потеряют boost от этих NFT
- ❌ Нужно вернуть SOL/TAMA (если они платили)

**SQL для удаления:**
```sql
-- ВНИМАНИЕ! СНАЧАЛА СДЕЛАЙ BACKUP!

-- 1. Проверь, сколько будет удалено:
SELECT COUNT(*) as off_chain_nfts
FROM user_nfts
WHERE is_active = true
  AND (
    nft_mint_address IS NULL 
    OR LENGTH(nft_mint_address) < 30
    OR nft_mint_address LIKE '%\_%'
  );

-- 2. Посмотри, кто владельцы:
SELECT 
    telegram_id,
    COUNT(*) as nft_count,
    ARRAY_AGG(tier_name || ' ' || rarity) as nfts
FROM user_nfts
WHERE is_active = true
  AND (
    nft_mint_address IS NULL 
    OR LENGTH(nft_mint_address) < 30
    OR nft_mint_address LIKE '%\_%'
  )
GROUP BY telegram_id
ORDER BY nft_count DESC;

-- 3. Удали Off-Chain NFT (soft delete):
UPDATE user_nfts
SET 
    is_active = false,
    deactivated_at = NOW(),
    deactivation_reason = 'Off-Chain NFT removed - migrating to on-chain only'
WHERE is_active = true
  AND (
    nft_mint_address IS NULL 
    OR LENGTH(nft_mint_address) < 30
    OR nft_mint_address LIKE '%\_%'
  );

-- 4. Проверь результат:
SELECT 
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_nfts,
    COUNT(CASE WHEN is_active = false THEN 1 END) as deactivated_nfts
FROM user_nfts;
```

---

### ✅ ВАРИАНТ 2: ОСТАВИТЬ КАК "LEGACY" (НЕ РЕКОМЕНДУЮ)

**Когда использовать:**
- ⚠️ Не хочешь обидеть игроков
- ⚠️ Off-Chain NFT дают boost в игре

**Плюсы:**
- ✅ Игроки не теряют boost
- ✅ Не нужно возвращать деньги

**Минусы:**
- ❌ Путаница: "а это настоящее NFT?"
- ❌ Проблемы при интеграции с маркетплейсами
- ❌ Игроки не могут продать эти NFT

**Действия:**
```sql
-- Пометь Off-Chain NFT как "Legacy":
ALTER TABLE user_nfts ADD COLUMN IF NOT EXISTS nft_type TEXT DEFAULT 'on-chain';

UPDATE user_nfts
SET nft_type = 'legacy_offchain'
WHERE is_active = true
  AND (
    nft_mint_address IS NULL 
    OR LENGTH(nft_mint_address) < 30
    OR nft_mint_address LIKE '%\_%'
  );

-- Обнови my-nfts.html, чтобы показывать badge "Legacy"
```

---

### ✅ ВАРИАНТ 3: КОНВЕРТИРОВАТЬ В ON-CHAIN (ДОРОГО)

**Когда использовать:**
- 💰 Готов потратить SOL на минт
- 💰 Хочешь, чтобы игроки сохранили NFT

**Плюсы:**
- ✅ Все NFT становятся реальными
- ✅ Игроки не теряют ничего

**Минусы:**
- ❌ Дорого: ~0.02 SOL на каждый NFT (17 NFT × 0.02 = 0.34 SOL ≈ $55)
- ❌ Нужно реализовать batch minting
- ❌ Занимает время (2-3 часа на 17 NFT)

**Действия:**
```bash
# 1. Создай скрипт для batch minting:
node api/batch-mint-offchain-nfts.js

# 2. Скрипт пройдётся по всем Off-Chain NFT и заминтит их на blockchain
```

---

## 🚀 МОЯ РЕКОМЕНДАЦИЯ

### **УДАЛИТЬ ВСЕ OFF-CHAIN NFT** ✅

**Почему:**
1. 🎯 **Честность:** Игроки ожидают реальные NFT
2. 💎 **Ценность:** Off-chain NFT не имеют рыночной стоимости
3. 🚀 **Будущее:** Маркетплейсы поддерживают только on-chain
4. 🧹 **Чистота:** Избегаем путаницы

**План действий (5 шагов):**

```sql
-- ═══════════════════════════════════════════════════════════
-- ШАГИ ДЛЯ БЕЗОПАСНОГО УДАЛЕНИЯ OFF-CHAIN NFT
-- ═══════════════════════════════════════════════════════════

-- ШАГ 1: BACKUP (ОБЯЗАТЕЛЬНО!)
-- Перейди в Supabase: https://supabase.com/dashboard
-- Project → Database → Backups → Download latest backup

-- ШАГ 2: ПРОВЕРЬ, СКОЛЬКО УДАЛИТСЯ
SELECT 
    COUNT(*) as total_off_chain,
    COUNT(DISTINCT telegram_id) as affected_users
FROM user_nfts
WHERE is_active = true
  AND (
    nft_mint_address IS NULL 
    OR LENGTH(nft_mint_address) < 30
    OR nft_mint_address LIKE '%\_%'
  );

-- ШАГ 3: СПИСОК ПОСТРАДАВШИХ ИГРОКОВ (для уведомления)
SELECT 
    u.telegram_id,
    l.telegram_username,
    COUNT(*) as off_chain_nfts,
    STRING_AGG(u.tier_name || ' ' || u.rarity, ', ') as nfts_list
FROM user_nfts u
LEFT JOIN leaderboard l ON u.telegram_id = l.telegram_id
WHERE u.is_active = true
  AND (
    u.nft_mint_address IS NULL 
    OR LENGTH(u.nft_mint_address) < 30
    OR u.nft_mint_address LIKE '%\_%'
  )
GROUP BY u.telegram_id, l.telegram_username
ORDER BY off_chain_nfts DESC;

-- ШАГ 4: SOFT DELETE (можно откатить!)
UPDATE user_nfts
SET 
    is_active = false,
    deactivation_reason = 'Off-Chain NFT removed - project migrating to on-chain only. Real on-chain NFTs coming soon!'
WHERE is_active = true
  AND (
    nft_mint_address IS NULL 
    OR LENGTH(nft_mint_address) < 30
    OR nft_mint_address LIKE '%\_%'
  );

-- ШАГ 5: ПРОВЕРЬ РЕЗУЛЬТАТ
SELECT 
    CASE
        WHEN is_active THEN 'Active (On-Chain)'
        ELSE 'Deactivated (Was Off-Chain)'
    END as status,
    COUNT(*) as count
FROM user_nfts
GROUP BY is_active;

-- Ожидаемый результат:
-- Active (On-Chain): 2
-- Deactivated (Was Off-Chain): 17
```

---

## 🔄 ОТКАТ (если что-то пошло не так)

```sql
-- Вернуть все Off-Chain NFT обратно:
UPDATE user_nfts
SET 
    is_active = true,
    deactivation_reason = NULL
WHERE deactivation_reason = 'Off-Chain NFT removed - project migrating to on-chain only. Real on-chain NFTs coming soon!';
```

---

## 📢 УВЕДОМЛЕНИЕ ИГРОКОВ

### Сообщение в бот (после удаления):

```
🎮 ВАЖНОЕ ОБНОВЛЕНИЕ: Миграция на 100% On-Chain NFT

Привет, игрок!

Мы переходим на НАСТОЯЩИЕ on-chain NFT! 🚀

❌ Твои виртуальные NFT были удалены
✅ Теперь только РЕАЛЬНЫЕ NFT (видны в Phantom Wallet)
💎 Можешь купить новые NFT на: https://solanatamagotchi.com/mint.html

Почему мы это сделали:
• Все NFT теперь НАСТОЯЩИЕ (на Solana blockchain)
• Можно продавать на маркетплейсах
• Можно передавать другим игрокам
• Защита через blockchain

Спасибо за понимание! 🙏
```

---

## ❓ FAQ

**Q: Нужно ли возвращать деньги игрокам?**
A: Зависит от:
- Если Off-Chain NFT были бесплатными/тестовыми → не нужно
- Если игроки платили SOL/TAMA → морально правильно вернуть или дать discount на новые NFT

**Q: Что делать с nft_bonding_state (minted_count)?**
A: После удаления Off-Chain NFT, нужно пересчитать:
```sql
-- Пересчитать minted_count только для реальных on-chain NFT
UPDATE nft_bonding_state nbs
SET minted_count = (
    SELECT COUNT(*)
    FROM user_nfts u
    WHERE u.tier_name = nbs.tier_name
      AND u.is_active = true
      AND u.nft_mint_address IS NOT NULL
      AND LENGTH(u.nft_mint_address) > 30
      AND u.nft_mint_address NOT LIKE '%\_%'
);
```

**Q: Можно ли удалить навсегда (hard delete)?**
A: Не рекомендую! Лучше soft delete (is_active = false), чтобы:
- Была история транзакций
- Можно откатить, если что-то пошло не так
- Видно, сколько было Off-Chain NFT

**Q: Как обновить my-nfts.html после удаления?**
A: Ничего не нужно! Код уже фильтрует по `is_active = true`, поэтому деактивированные NFT не будут показываться.

---

## 🎯 ИТОГО

| Вариант | Плюсы | Минусы | Рекомендация |
|---------|-------|--------|--------------|
| **Удалить** | Честность, простота | Игроки теряют boost | ✅ **ДА** |
| **Legacy** | Игроки сохраняют boost | Путаница, нет продаж | ❌ НЕТ |
| **Конвертировать** | Все довольны | Дорого (~$55), долго | ⚠️ Если есть деньги |

---

## 📞 Поддержка

Если нужна помощь:
1. Сделай backup перед удалением!
2. Протестируй на 1-2 NFT сначала
3. Уведоми игроков заранее (за 1-2 дня)
4. Предложи discount на новые on-chain NFT

---

🎉 **Готов к удалению? Скажи, и я запущу SQL!**

