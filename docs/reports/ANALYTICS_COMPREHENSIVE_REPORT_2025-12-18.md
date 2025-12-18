# 📊 Solana Tamagotchi - Comprehensive Analytics Report

**Дата:** 18 декабря 2025  
**Период:** 4-18 декабря (14 дней)  
**Составил:** @Analytics  
**Статус:** 🔥 АКТУАЛЬНЫЙ

---

## 🎯 EXECUTIVE SUMMARY

### Ключевые Метрики за 2 недели:

```
📈 Рост игроков: [ОБНОВИТЬ]
💰 TAMA в обороте: [ОБНОВИТЬ]
🎨 NFT продано: [ОБНОВИТЬ]
💵 Выручка: [ОБНОВИТЬ]
```

### Изменения за период:

| Метрика | 4 дек | 18 дек | Изменение |
|---------|-------|--------|-----------|
| **Игроки** | 63 | [?] | +[?] (+[?]%) |
| **TAMA Total** | 976,839 | [?] | +[?] |
| **NFT Sold** | 95 | [?] | +[?] |
| **Revenue** | $24K | [?] | +$[?] |

---

## 📊 ЧАСТЬ 1: ИГРОКИ

### SQL для получения данных:

```sql
-- Текущая статистика игроков
SELECT 
  COUNT(*) as total_users,
  AVG(level) as avg_level,
  MAX(level) as max_level,
  MIN(created_at) as first_user,
  MAX(created_at) as last_user,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '14 days') as new_users_14d,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_users_7d,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') as new_users_1d
FROM users;
```

### 📈 Статистика:

**Всего игроков:** [ВСТАВИТЬ ДАННЫЕ]
- Средний уровень: [?]
- Максимальный уровень: [?]
- Новых за 14 дней: [?]
- Новых за 7 дней: [?]
- Новых за 1 день: [?]

**Темп роста:**
- Daily Average: [?] игроков/день
- Weekly Average: [?] игроков/неделю

### Распределение по уровням:

```sql
-- Распределение игроков по уровням
SELECT 
  CASE 
    WHEN level BETWEEN 1 AND 5 THEN '1-5'
    WHEN level BETWEEN 6 AND 10 THEN '6-10'
    WHEN level BETWEEN 11 AND 15 THEN '11-15'
    WHEN level BETWEEN 16 AND 20 THEN '16-20'
    WHEN level > 20 THEN '20+'
  END as level_bracket,
  COUNT(*) as player_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM users
GROUP BY level_bracket
ORDER BY MIN(level);
```

| Уровень | Игроков | Процент |
|---------|---------|---------|
| 1-5 | [?] | [?]% |
| 6-10 | [?] | [?]% |
| 11-15 | [?] | [?]% |
| 16-20 | [?] | [?]% |
| 20+ | [?] | [?]% |

---

## 💰 ЧАСТЬ 2: ЭКОНОМИКА TAMA

### SQL для получения данных:

```sql
-- TAMA статистика
SELECT 
  SUM(tama_balance) as total_tama_in_wallets,
  AVG(tama_balance) as avg_tama_per_player,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY tama_balance) as median_tama,
  MAX(tama_balance) as max_tama,
  MIN(tama_balance) as min_tama,
  STDDEV(tama_balance) as stddev_tama
FROM users
WHERE tama_balance > 0;

-- Концентрация TAMA
WITH ranked_users AS (
  SELECT 
    username,
    tama_balance,
    RANK() OVER (ORDER BY tama_balance DESC) as rank,
    SUM(tama_balance) OVER () as total_tama
  FROM users
)
SELECT 
  'Top 5' as segment,
  SUM(tama_balance) as tama_amount,
  ROUND(SUM(tama_balance) * 100.0 / MAX(total_tama), 1) as percentage
FROM ranked_users
WHERE rank <= 5
UNION ALL
SELECT 
  'Top 10' as segment,
  SUM(tama_balance) as tama_amount,
  ROUND(SUM(tama_balance) * 100.0 / MAX(total_tama), 1) as percentage
FROM ranked_users
WHERE rank <= 10;
```

### 💎 TAMA Metrics:

**Total Supply:** [?] TAMA
- В кошельках игроков: [?] TAMA
- Средний баланс: [?] TAMA
- Медианный баланс: [?] TAMA
- Максимальный: [?] TAMA

**Концентрация:**
- Top 5 держат: [?]% ([?] TAMA)
- Top 10 держат: [?]% ([?] TAMA)
- Top 50 держат: [?]% ([?] TAMA)

**Сравнение с предыдущим периодом:**
- 4 дек: 976,839 TAMA
- 18 дек: [?] TAMA
- Изменение: +[?] TAMA (+[?]%)

---

## 🏆 ЧАСТЬ 3: ТОП ИГРОКИ

### SQL:

```sql
-- Топ-20 игроков
SELECT 
  username,
  level,
  tama_balance,
  created_at,
  DATE_PART('day', NOW() - created_at) as days_playing,
  ROUND(tama_balance / NULLIF(DATE_PART('day', NOW() - created_at), 0), 0) as tama_per_day
FROM users
ORDER BY tama_balance DESC
LIMIT 20;
```

### 👑 Top 10:

| # | Username | Level | TAMA | Доля | Дней игры | TAMA/день |
|---|----------|-------|------|------|-----------|-----------|
| 1 | [?] | [?] | [?] | [?]% | [?] | [?] |
| 2 | [?] | [?] | [?] | [?]% | [?] | [?] |
| 3 | [?] | [?] | [?] | [?]% | [?] | [?] |
| 4 | [?] | [?] | [?] | [?]% | [?] | [?] |
| 5 | [?] | [?] | [?] | [?]% | [?] | [?] |
| 6 | [?] | [?] | [?] | [?]% | [?] | [?] |
| 7 | [?] | [?] | [?] | [?]% | [?] | [?] |
| 8 | [?] | [?] | [?] | [?]% | [?] | [?] |
| 9 | [?] | [?] | [?] | [?]% | [?] | [?] |
| 10 | [?] | [?] | [?] | [?]% | [?] | [?] |

**Изменения в Top 10:**
- Новые входы: [кто?]
- Выбыли: [кто?]
- Biggest gainer: [кто? +сколько?]

---

## 🎨 ЧАСТЬ 4: NFT ПРОДАЖИ

### SQL:

```sql
-- NFT продажи по тирам
SELECT 
  tier_name,
  payment_type,
  COUNT(*) as total_sold,
  COUNT(*) FILTER (WHERE minted_at >= NOW() - INTERVAL '14 days') as sold_14d,
  COUNT(*) FILTER (WHERE minted_at >= NOW() - INTERVAL '7 days') as sold_7d,
  MIN(minted_at) as first_mint,
  MAX(minted_at) as last_mint,
  ROUND(AVG(CASE WHEN payment_type = 'SOL' THEN price ELSE NULL END), 2) as avg_price_sol,
  ROUND(AVG(CASE WHEN payment_type = 'TAMA' THEN price ELSE NULL END), 0) as avg_price_tama
FROM user_nfts
WHERE is_active = true
GROUP BY tier_name, payment_type
ORDER BY 
  CASE tier_name
    WHEN 'Diamond' THEN 1
    WHEN 'Platinum' THEN 2
    WHEN 'Gold' THEN 3
    WHEN 'Silver' THEN 4
    WHEN 'Bronze_SOL' THEN 5
    WHEN 'Bronze' THEN 6
  END;
```

### 💎 NFT Statistics:

| Tier | Payment | Total | За 14д | За 7д | Средняя цена |
|------|---------|-------|--------|-------|--------------|
| Diamond | SOL | [?] | [?] | [?] | [?] SOL |
| Platinum | SOL | [?] | [?] | [?] | [?] SOL |
| Gold | SOL | [?] | [?] | [?] | [?] SOL |
| Silver | SOL | [?] | [?] | [?] | [?] SOL |
| Bronze_SOL | SOL | [?] | [?] | [?] | [?] SOL |
| Bronze | TAMA | [?] | [?] | [?] | [?] TAMA |

**Total NFTs:** [?]
- Продано за 14 дней: [?]
- Продано за 7 дней: [?]
- Продано сегодня: [?]

**Conversion Rate:**
- NFT/Player ratio: [?]% ([?] NFT / [?] players)
- Players with NFT: [?] из [?] ([?]%)

---

## 💵 ЧАСТЬ 5: REVENUE ANALYSIS

### SQL:

```sql
-- Revenue расчёт
SELECT 
  tier_name,
  payment_type,
  COUNT(*) as quantity,
  CASE payment_type
    WHEN 'SOL' THEN SUM(price)
    ELSE NULL
  END as total_sol,
  CASE payment_type
    WHEN 'TAMA' THEN SUM(price)
    ELSE NULL
  END as total_tama
FROM user_nfts
WHERE is_active = true
  AND payment_type IN ('SOL', 'TAMA')
GROUP BY tier_name, payment_type
ORDER BY tier_name;
```

### 💰 Revenue Breakdown:

#### SOL Revenue:

| Tier | Quantity | Price/Unit | Total SOL | USD (@ $200/SOL) |
|------|----------|------------|-----------|------------------|
| Diamond | [?] | 50 SOL | [?] SOL | $[?] |
| Platinum | [?] | 10-30 SOL | [?] SOL | $[?] |
| Gold | [?] | 3-10 SOL | [?] SOL | $[?] |
| Silver | [?] | 1-3 SOL | [?] SOL | $[?] |
| Bronze_SOL | [?] | 0.15 SOL | [?] SOL | $[?] |
| **TOTAL** | **[?]** | - | **[?] SOL** | **$[?]** |

#### TAMA Revenue:

| Tier | Quantity | Total TAMA | USD Equiv |
|------|----------|------------|-----------|
| Bronze | [?] | [?] | $[?] |

### 📈 Revenue Metrics:

**ARPU (Average Revenue Per User):**
- Total revenue / Total users = $[?]

**ARPPU (Average Revenue Per Paying User):**
- Total revenue / Paying users = $[?]

**Conversion Rate:**
- Paying users / Total users = [?]%

**Сравнение:**
- Previous period: $24K
- Current period: $[?]
- Growth: +$[?] (+[?]%)

---

## 🔥 ЧАСТЬ 6: BURN/MINT ANALYSIS

### SQL:

```sql
-- Burn/Mint за последние 30 дней
SELECT 
  DATE(created_at) as date,
  SUM(CASE 
    WHEN type IN ('burn', 'nft_burn') 
    THEN amount 
    ELSE 0 
  END) as burned,
  SUM(CASE 
    WHEN type IN ('mint', 'reward', 'referral', 'quest_reward', 'daily_reward') 
    THEN amount 
    ELSE 0 
  END) as minted,
  SUM(CASE 
    WHEN type IN ('burn', 'nft_burn') 
    THEN amount 
    ELSE 0 
  END) - SUM(CASE 
    WHEN type IN ('mint', 'reward', 'referral', 'quest_reward', 'daily_reward') 
    THEN amount 
    ELSE 0 
  END) as net_burn
FROM transactions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Burn sources
SELECT 
  type,
  COUNT(*) as tx_count,
  SUM(amount) as total_amount,
  ROUND(AVG(amount), 0) as avg_amount
FROM transactions
WHERE type LIKE '%burn%'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY type
ORDER BY total_amount DESC;
```

### 🔥 Burn/Mint Statistics:

**Last 30 Days:**

| Метрика | Amount | Avg/Day |
|---------|--------|---------|
| **Total Burned** | [?] TAMA | [?] TAMA/day |
| **Total Minted** | [?] TAMA | [?] TAMA/day |
| **Net Burn** | [?] TAMA | [?] TAMA/day |
| **Burn/Mint Ratio** | [?] | - |

**Burn Sources:**

| Source | Transactions | Total TAMA | Avg TAMA/tx |
|--------|--------------|------------|-------------|
| NFT Mint (40%) | [?] | [?] | [?] |
| Withdrawal Fee (5%) | [?] | [?] | [?] |
| Other | [?] | [?] | [?] |

**Mint Sources:**

| Source | Transactions | Total TAMA | Avg TAMA/tx |
|--------|--------------|------------|-------------|
| Rewards | [?] | [?] | [?] |
| Quests | [?] | [?] | [?] |
| Referrals | [?] | [?] | [?] |
| Daily Rewards | [?] | [?] | [?] |

**Health Score:**
- ✅ HEALTHY: Burn/Mint > 0.8
- ⚠️ WARNING: Burn/Mint 0.5-0.8
- 🔴 CRITICAL: Burn/Mint < 0.5

**Current:** [?] - [STATUS]

---

## 📊 ЧАСТЬ 7: PLAYER RETENTION

### SQL:

```sql
-- Cohort Retention Analysis
WITH cohorts AS (
  SELECT 
    user_id,
    DATE(created_at) as cohort_date
  FROM users
  WHERE created_at >= NOW() - INTERVAL '30 days'
),
activity AS (
  SELECT 
    user_id,
    DATE(created_at) as activity_date
  FROM transactions
  WHERE created_at >= NOW() - INTERVAL '30 days'
)
SELECT 
  c.cohort_date,
  COUNT(DISTINCT c.user_id) as cohort_size,
  COUNT(DISTINCT CASE 
    WHEN a.activity_date = c.cohort_date + 1 
    THEN c.user_id 
  END) * 100.0 / COUNT(DISTINCT c.user_id) as day1_retention,
  COUNT(DISTINCT CASE 
    WHEN a.activity_date BETWEEN c.cohort_date + 6 AND c.cohort_date + 8
    THEN c.user_id 
  END) * 100.0 / COUNT(DISTINCT c.user_id) as day7_retention,
  COUNT(DISTINCT CASE 
    WHEN a.activity_date >= c.cohort_date + 29
    THEN c.user_id 
  END) * 100.0 / COUNT(DISTINCT c.user_id) as day30_retention
FROM cohorts c
LEFT JOIN activity a ON c.user_id = a.user_id
GROUP BY c.cohort_date
ORDER BY c.cohort_date DESC
LIMIT 30;
```

### 📈 Retention Metrics:

**Overall Retention Rates:**

| Cohort Date | Size | Day 1 | Day 7 | Day 30 |
|-------------|------|-------|-------|--------|
| [date] | [?] | [?]% | [?]% | [?]% |
| [date] | [?] | [?]% | [?]% | [?]% |
| [date] | [?] | [?]% | [?]% | [?]% |

**Industry Benchmarks:**
- Day 1: 40-50% (Good), 25-40% (Average), <25% (Poor)
- Day 7: 20-30% (Good), 10-20% (Average), <10% (Poor)
- Day 30: 10-15% (Good), 5-10% (Average), <5% (Poor)

**Our Performance:** [GOOD/AVERAGE/POOR]

---

## 🎯 ЧАСТЬ 8: PLAYER BEHAVIOR

### SQL:

```sql
-- Active Users
SELECT 
  'Last 1 day' as period,
  COUNT(DISTINCT user_id) as active_users
FROM transactions
WHERE created_at >= NOW() - INTERVAL '1 day'
UNION ALL
SELECT 
  'Last 7 days' as period,
  COUNT(DISTINCT user_id) as active_users
FROM transactions
WHERE created_at >= NOW() - INTERVAL '7 days'
UNION ALL
SELECT 
  'Last 30 days' as period,
  COUNT(DISTINCT user_id) as active_users
FROM transactions
WHERE created_at >= NOW() - INTERVAL '30 days';

-- Activity Types
SELECT 
  type,
  COUNT(*) as transaction_count,
  COUNT(DISTINCT user_id) as unique_users,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM transactions
WHERE created_at >= NOW() - INTERVAL '14 days'
GROUP BY type
ORDER BY transaction_count DESC;
```

### 👥 Activity Metrics:

**Active Users:**

| Period | Users | % of Total |
|--------|-------|------------|
| DAU (1 day) | [?] | [?]% |
| WAU (7 days) | [?] | [?]% |
| MAU (30 days) | [?] | [?]% |

**Engagement:**
- DAU/MAU ratio: [?]% (stickiness)
- Avg transactions/user: [?]
- Avg sessions/day: [?]

**Top Activities (Last 14 days):**

| Activity Type | Transactions | Unique Users | % of Total |
|---------------|--------------|--------------|------------|
| [type] | [?] | [?] | [?]% |
| [type] | [?] | [?] | [?]% |
| [type] | [?] | [?] | [?]% |

---

## 🎮 ЧАСТЬ 9: GAME FEATURES USAGE

### SQL:

```sql
-- Mini-games статистика (если есть отдельная таблица)
-- Иначе используем transactions с type

SELECT 
  CASE 
    WHEN type LIKE '%slot%' THEN 'Slots'
    WHEN type LIKE '%wheel%' THEN 'Wheel'
    WHEN type LIKE '%shooter%' THEN 'Shooter'
    WHEN type LIKE '%breed%' THEN 'Breeding'
    ELSE 'Other'
  END as game_feature,
  COUNT(*) as usage_count,
  COUNT(DISTINCT user_id) as unique_players,
  SUM(amount) as total_tama_used
FROM transactions
WHERE created_at >= NOW() - INTERVAL '14 days'
GROUP BY game_feature
ORDER BY usage_count DESC;
```

### 🎰 Feature Usage:

| Feature | Usage Count | Unique Players | TAMA Volume |
|---------|-------------|----------------|-------------|
| Slots | [?] | [?] | [?] TAMA |
| Wheel | [?] | [?] | [?] TAMA |
| Shooter | [?] | [?] | [?] TAMA |
| Breeding | [?] | [?] | [?] TAMA |
| Marketplace | [?] | [?] | [?] TAMA |

**Most Popular Feature:** [?]  
**Least Used Feature:** [?]  
**Needs Improvement:** [?]

---

## 📊 ЧАСТЬ 10: KEY INSIGHTS & RECOMMENDATIONS

### ✅ Strengths:

1. **[Strength 1]** - [описание]
2. **[Strength 2]** - [описание]
3. **[Strength 3]** - [описание]

### ⚠️ Areas for Improvement:

1. **[Issue 1]** - [описание и рекомендация]
2. **[Issue 2]** - [описание и рекомендация]
3. **[Issue 3]** - [описание и рекомендация]

### 💡 Actionable Recommendations:

#### High Priority:
1. 🔴 **[Recommendation 1]**
   - Impact: High
   - Effort: [Low/Medium/High]
   - Expected result: [описание]

2. 🔴 **[Recommendation 2]**
   - Impact: High
   - Effort: [Low/Medium/High]
   - Expected result: [описание]

#### Medium Priority:
3. 🟡 **[Recommendation 3]**
   - Impact: Medium
   - Effort: [Low/Medium/High]
   - Expected result: [описание]

#### Low Priority:
4. 🟢 **[Recommendation 4]**
   - Impact: Low
   - Effort: [Low/Medium/High]
   - Expected result: [описание]

---

## 📈 ЧАСТЬ 11: GROWTH PROJECTIONS

### Прогнозы на следующие 30 дней:

**Консервативный сценарий:**
- Players: [текущее] → [прогноз] (+[?]%)
- TAMA burned: [прогноз] TAMA
- NFT sales: [прогноз] NFT
- Revenue: $[прогноз]

**Оптимистичный сценарий:**
- Players: [текущее] → [прогноз] (+[?]%)
- TAMA burned: [прогноз] TAMA
- NFT sales: [прогноз] NFT
- Revenue: $[прогноз]

**Что нужно для оптимистичного сценария:**
1. [Условие 1]
2. [Условие 2]
3. [Условие 3]

---

## 🎯 ACTION ITEMS

### Для @Developer:
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

### Для @Economy:
- [ ] Monitor burn/mint ratio weekly
- [ ] Alert if ratio < 0.8
- [ ] [Task 3]

### Для @Marketing:
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

### Для @UI-UX:
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

---

## 📅 NEXT REPORT

**Дата:** 25 декабря 2025  
**Тип:** Weekly Economy Health Report  
**Focuses:** Post-mainnet metrics, holiday season impact

---

**Составлено:** @Analytics  
**Дата:** 18 декабря 2025  
**Версия:** v2.0 - Comprehensive  
**Статус:** 🔥 READY FOR DATA

---

## 📝 ИНСТРУКЦИЯ ПО ЗАПОЛНЕНИЮ:

1. **Получить доступ к Supabase:**
   - Открыть: https://supabase.com/dashboard
   - Выбрать проект: zfrazyupameidxpjihrh

2. **Запустить SQL запросы:**
   - SQL Editor → New Query
   - Скопировать каждый SQL блок из этого отчёта
   - Выполнить и экспортировать результаты

3. **Заполнить данные:**
   - Заменить все [?] на актуальные значения
   - Заполнить таблицы
   - Добавить insights

4. **Review:**
   - Проверить все расчёты
   - Добавить recommendations
   - Финализировать action items

5. **Publish:**
   - Убрать метку [ВСТАВИТЬ ДАННЫЕ]
   - Изменить статус на "COMPLETE"
   - Поделиться с командой
