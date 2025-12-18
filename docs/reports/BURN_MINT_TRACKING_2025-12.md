# 🔥 TAMA Burn/Mint Tracking Report

**Period:** Декабрь 2025  
**Generated:** 18 декабря 2025  
**Author:** @Analytics  
**Focus:** Token Supply & Deflationary Mechanics

---

## 🎯 EXECUTIVE SUMMARY

### Health Score: [?]/100

**Overall Status:** 🟢 DEFLATIONARY / 🟡 BALANCED / 🔴 INFLATIONARY

```
Burn/Mint Ratio:     [?]
Net Supply Change:   [?] TAMA ([+/-][?]%)
Monthly Burn Rate:   [?] TAMA/month
Monthly Mint Rate:   [?] TAMA/month
```

**Key Takeaway:** [1-2 предложения о deflationary health]

---

## 🔥 BURN MECHANISMS

### 1. NFT Mint Burn (40%)

**Mechanism:**
```
When player mints Bronze NFT for 5,000 TAMA:
→ 40% (2,000 TAMA) = BURNED 🔥
→ 30% (1,500 TAMA) = Treasury
→ 30% (1,500 TAMA) = P2E Pool
```

**SQL Query:**
```sql
-- NFT mint burns
SELECT 
  DATE(minted_at) as date,
  COUNT(*) as bronze_nfts_minted,
  COUNT(*) * 2000 as tama_burned,  -- 40% of 5000
  COUNT(*) * 1500 as treasury_received,
  COUNT(*) * 1500 as p2e_pool_received
FROM user_nfts
WHERE tier_name = 'Bronze'
  AND payment_type = 'TAMA'
  AND minted_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(minted_at)
ORDER BY date DESC;
```

#### 📊 Stats (Last 30 Days):

| Date | Bronze NFTs | TAMA Burned | Treasury | P2E Pool |
|------|-------------|-------------|----------|----------|
| [date] | [?] | [?] | [?] | [?] |
| [date] | [?] | [?] | [?] | [?] |
| [date] | [?] | [?] | [?] | [?] |

**Totals:**
```
Bronze NFTs Minted:    [?]
Total TAMA Burned:     [?] (40%)
Total to Treasury:     [?] (30%)
Total to P2E Pool:     [?] (30%)
```

**Burn Rate:** [?] TAMA/day from NFT mints

---

### 2. Withdrawal Fee (5%)

**Mechanism:**
```
When player withdraws TAMA from game:
→ 5% = BURNED 🔥
→ 95% = Sent to wallet

Example: Withdraw 10,000 TAMA
→ 500 TAMA burned
→ 9,500 TAMA received
```

**SQL Query:**
```sql
-- Withdrawal burns
SELECT 
  DATE(created_at) as date,
  COUNT(*) as withdrawal_count,
  SUM(amount) as total_withdrawn,
  SUM(amount) * 0.05 as tama_burned,
  SUM(amount) * 0.95 as tama_transferred
FROM transactions
WHERE type = 'withdrawal'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### 📊 Stats (Last 30 Days):

| Date | Withdrawals | Amount | Burned (5%) | Transferred |
|------|-------------|--------|-------------|-------------|
| [date] | [?] | [?] | [?] | [?] |
| [date] | [?] | [?] | [?] | [?] |
| [date] | [?] | [?] | [?] | [?] |

**Totals:**
```
Total Withdrawals:     [?]
Total Amount:          [?] TAMA
Total Burned (5%):     [?] TAMA
Total Transferred:     [?] TAMA
```

**Burn Rate:** [?] TAMA/day from withdrawals

---

### 3. Jackpot Pool Contribution (5%)

**Mechanism:**
```
When player plays slots:
→ 5% of bet = Added to jackpot pool
→ When someone wins jackpot:
  → Winner gets pool
  → Pool resets to 0
  → New accumulation begins
```

**SQL Query:**
```sql
-- Jackpot pool tracking
SELECT 
  DATE(created_at) as date,
  COUNT(*) as slot_plays,
  SUM(amount) as total_wagered,
  SUM(amount) * 0.05 as jackpot_pool_contribution
FROM transactions
WHERE type = 'slot_bet'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Jackpot wins
SELECT 
  created_at as win_date,
  user_id,
  amount as jackpot_amount
FROM transactions
WHERE type = 'jackpot_win'
  AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

#### 📊 Stats (Last 30 Days):

**Contributions:**

| Date | Slot Plays | Total Wagered | Pool Contribution (5%) |
|------|------------|---------------|------------------------|
| [date] | [?] | [?] | [?] |
| [date] | [?] | [?] | [?] |
| [date] | [?] | [?] | [?] |

**Jackpot Wins:**

| Date | Winner | Amount |
|------|--------|--------|
| [date] | [user] | [?] TAMA |
| [date] | [user] | [?] TAMA |

**Summary:**
```
Pool Contributions:    [?] TAMA
Jackpot Wins Paid:     [?] TAMA
Current Pool Balance:  [?] TAMA
Net Pool Growth:       [?] TAMA
```

**Note:** Pool contributions are NOT burned - they accumulate and get paid out to winners!

---

### 📊 TOTAL BURN SUMMARY

| Burn Source | Amount (30d) | % of Total | Daily Avg |
|-------------|--------------|------------|-----------|
| **NFT Mints (40%)** | [?] TAMA | [?]% | [?] TAMA/day |
| **Withdrawals (5%)** | [?] TAMA | [?]% | [?] TAMA/day |
| **Other** | [?] TAMA | [?]% | [?] TAMA/day |
| **TOTAL BURNED** | **[?] TAMA** | **100%** | **[?] TAMA/day** |

---

## 💰 MINT MECHANISMS

### 1. Game Rewards

**Sources:**
- Pet care rewards
- Mini-game wins
- Achievement bonuses
- Level-up rewards

**SQL Query:**
```sql
-- Reward minting
SELECT 
  DATE(created_at) as date,
  type,
  COUNT(*) as reward_count,
  SUM(amount) as tama_minted,
  AVG(amount) as avg_reward,
  COUNT(DISTINCT user_id) as unique_recipients
FROM transactions
WHERE type IN ('reward', 'game_reward', 'care_reward', 'achievement')
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), type
ORDER BY date DESC, type;
```

#### 📊 Stats (Last 30 Days):

| Date | Type | Count | TAMA Minted | Avg Reward | Recipients |
|------|------|-------|-------------|------------|------------|
| [date] | Game Reward | [?] | [?] | [?] | [?] |
| [date] | Care Reward | [?] | [?] | [?] | [?] |
| [date] | Achievement | [?] | [?] | [?] | [?] |

**Totals:**
```
Total Rewards:         [?]
Total TAMA Minted:     [?]
Avg Reward:            [?] TAMA
Unique Recipients:     [?]
```

**Mint Rate:** [?] TAMA/day from rewards

---

### 2. Daily Rewards (NFT Holders)

**Mechanism:**
```
NFT holders receive daily TAMA based on tier:
- Diamond:   [?] TAMA/day
- Platinum:  [?] TAMA/day
- Gold:      [?] TAMA/day
- Silver:    [?] TAMA/day
- Bronze:    [?] TAMA/day
```

**SQL Query:**
```sql
-- Daily NFT rewards
SELECT 
  DATE(created_at) as date,
  COUNT(*) as reward_count,
  SUM(amount) as tama_minted,
  COUNT(DISTINCT user_id) as nft_holders_active
FROM transactions
WHERE type = 'daily_nft_reward'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### 📊 Stats (Last 30 Days):

| Date | Rewards | TAMA Minted | Active Holders |
|------|---------|-------------|----------------|
| [date] | [?] | [?] | [?] |
| [date] | [?] | [?] | [?] |
| [date] | [?] | [?] | [?] |

**Totals:**
```
Total Daily Rewards:   [?]
Total TAMA Minted:     [?]
Avg/Holder/Day:        [?] TAMA
Active NFT Holders:    [?]
```

**Mint Rate:** [?] TAMA/day from daily rewards

---

### 3. Referral Rewards

**Mechanism:**
```
When referred player reaches milestone:
→ Referrer gets bonus TAMA
→ Referee gets welcome bonus
```

**SQL Query:**
```sql
-- Referral minting
SELECT 
  DATE(created_at) as date,
  type,
  COUNT(*) as referral_count,
  SUM(amount) as tama_minted,
  COUNT(DISTINCT user_id) as unique_users
FROM transactions
WHERE type IN ('referral_reward', 'referral_bonus')
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), type
ORDER BY date DESC;
```

#### 📊 Stats (Last 30 Days):

| Date | Type | Count | TAMA Minted | Recipients |
|------|------|-------|-------------|------------|
| [date] | Referrer Reward | [?] | [?] | [?] |
| [date] | Referee Bonus | [?] | [?] | [?] |

**Totals:**
```
Referral Rewards:      [?]
Total TAMA Minted:     [?]
Unique Users:          [?]
```

**Mint Rate:** [?] TAMA/day from referrals

---

### 4. Quest & Event Rewards

**Mechanism:**
```
Special quests and events mint TAMA:
- Daily quests
- Weekly challenges
- Special events
- Seasonal bonuses
```

**SQL Query:**
```sql
-- Quest/Event rewards
SELECT 
  DATE(created_at) as date,
  type,
  COUNT(*) as reward_count,
  SUM(amount) as tama_minted
FROM transactions
WHERE type IN ('quest_reward', 'event_reward', 'challenge_reward')
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), type
ORDER BY date DESC;
```

#### 📊 Stats (Last 30 Days):

| Date | Type | Count | TAMA Minted |
|------|------|-------|-------------|
| [date] | Quest | [?] | [?] |
| [date] | Event | [?] | [?] |
| [date] | Challenge | [?] | [?] |

**Totals:**
```
Total Rewards:         [?]
Total TAMA Minted:     [?]
```

**Mint Rate:** [?] TAMA/day from quests/events

---

### 📊 TOTAL MINT SUMMARY

| Mint Source | Amount (30d) | % of Total | Daily Avg |
|-------------|--------------|------------|-----------|
| **Game Rewards** | [?] TAMA | [?]% | [?] TAMA/day |
| **Daily NFT Rewards** | [?] TAMA | [?]% | [?] TAMA/day |
| **Referrals** | [?] TAMA | [?]% | [?] TAMA/day |
| **Quests/Events** | [?] TAMA | [?]% | [?] TAMA/day |
| **TOTAL MINTED** | **[?] TAMA** | **100%** | **[?] TAMA/day** |

---

## ⚖️ BURN VS MINT ANALYSIS

### Daily Comparison (Last 30 Days):

**SQL Query:**
```sql
-- Daily burn vs mint
SELECT 
  DATE(created_at) as date,
  SUM(CASE 
    WHEN type IN ('burn', 'nft_burn', 'withdrawal_fee') 
    THEN amount 
    ELSE 0 
  END) as burned,
  SUM(CASE 
    WHEN type IN ('mint', 'reward', 'daily_nft_reward', 'referral_reward', 'quest_reward') 
    THEN amount 
    ELSE 0 
  END) as minted,
  SUM(CASE 
    WHEN type IN ('burn', 'nft_burn', 'withdrawal_fee') 
    THEN amount 
    ELSE 0 
  END) - SUM(CASE 
    WHEN type IN ('mint', 'reward', 'daily_nft_reward', 'referral_reward', 'quest_reward') 
    THEN amount 
    ELSE 0 
  END) as net_burn,
  CASE 
    WHEN SUM(CASE WHEN type IN ('mint', 'reward', 'daily_nft_reward', 'referral_reward', 'quest_reward') THEN amount ELSE 0 END) > 0
    THEN ROUND(
      SUM(CASE WHEN type IN ('burn', 'nft_burn', 'withdrawal_fee') THEN amount ELSE 0 END) / 
      NULLIF(SUM(CASE WHEN type IN ('mint', 'reward', 'daily_nft_reward', 'referral_reward', 'quest_reward') THEN amount ELSE 0 END), 0),
      2
    )
    ELSE NULL
  END as burn_mint_ratio
FROM transactions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 📊 Daily Breakdown:

| Date | Burned | Minted | Net | Ratio | Status |
|------|--------|--------|-----|-------|--------|
| [date] | [?] | [?] | [?] | [?] | [🟢/🟡/🔴] |
| [date] | [?] | [?] | [?] | [?] | [🟢/🟡/🔴] |
| [date] | [?] | [?] | [?] | [?] | [🟢/🟡/🔴] |

**Status Legend:**
- 🟢 HEALTHY: Ratio > 0.8 (burning more than minting)
- 🟡 WARNING: Ratio 0.5-0.8 (close to balanced)
- 🔴 CRITICAL: Ratio < 0.5 (minting way more than burning)

### 30-Day Summary:

```
Total Burned:          [?] TAMA
Total Minted:          [?] TAMA
Net Burn:              [?] TAMA
Burn/Mint Ratio:       [?]

Avg Daily Burn:        [?] TAMA/day
Avg Daily Mint:        [?] TAMA/day
Avg Net Daily:         [?] TAMA/day
```

**Trend:** Supply is [increasing/decreasing/stable]

---

## 📈 SUPPLY DYNAMICS

### Current Supply Status:

```sql
-- Current supply calculation
WITH supply_stats AS (
  SELECT 
    SUM(tama_balance) as circulating_supply,
    (SELECT SUM(amount) FROM transactions WHERE type IN ('burn', 'nft_burn')) as total_burned,
    1000000000 as theoretical_max  -- 1 billion TAMA max
  FROM users
)
SELECT 
  circulating_supply,
  total_burned,
  theoretical_max,
  circulating_supply + total_burned as effective_supply,
  ROUND(total_burned * 100.0 / (circulating_supply + total_burned), 2) as burn_percentage,
  theoretical_max - (circulating_supply + total_burned) as never_minted
FROM supply_stats;
```

### 💰 Supply Breakdown:

```
Theoretical Max Supply:     1,000,000,000 TAMA
Total Minted (ever):        [?] TAMA
Total Burned (ever):        [?] TAMA
Circulating Supply:         [?] TAMA
Burn Percentage:            [?]%
Never Minted:               [?] TAMA
```

### Supply Distribution:

```sql
-- Where is the supply?
SELECT 
  'Player Wallets' as location,
  SUM(tama_balance) as amount,
  ROUND(SUM(tama_balance) * 100.0 / (SELECT SUM(tama_balance) FROM users), 1) as percentage
FROM users
UNION ALL
SELECT 
  'Treasury' as location,
  [TREASURY_BALANCE] as amount,
  [PERCENTAGE] as percentage
UNION ALL
SELECT 
  'P2E Pool' as location,
  [P2E_POOL_BALANCE] as amount,
  [PERCENTAGE] as percentage
UNION ALL
SELECT 
  'Jackpot Pool' as location,
  [JACKPOT_BALANCE] as amount,
  [PERCENTAGE] as percentage;
```

| Location | Amount | Percentage |
|----------|--------|------------|
| Player Wallets | [?] TAMA | [?]% |
| Treasury | [?] TAMA | [?]% |
| P2E Pool | [?] TAMA | [?]% |
| Jackpot Pool | [?] TAMA | [?]% |
| **Total Circulating** | **[?] TAMA** | **100%** |

---

## 🎯 DEFLATION HEALTH SCORE

### Scoring Criteria:

| Metric | Weight | Score | Max |
|--------|--------|-------|-----|
| **Burn/Mint Ratio** | 40% | [?] | 40 |
| **Net Burn Trend** | 30% | [?] | 30 |
| **Burn Source Diversity** | 15% | [?] | 15 |
| **Supply Concentration** | 15% | [?] | 15 |
| **TOTAL SCORE** | - | **[?]** | **100** |

### Scoring Guide:

**Burn/Mint Ratio (40 points):**
- 40pts: Ratio > 1.2 (strong deflation)
- 30pts: Ratio 0.9-1.2 (mild deflation)
- 20pts: Ratio 0.7-0.9 (balanced)
- 10pts: Ratio 0.5-0.7 (mild inflation)
- 0pts: Ratio < 0.5 (concerning inflation)

**Net Burn Trend (30 points):**
- 30pts: Consistent net burn for 30+ days
- 20pts: Net burn 20-29 days
- 10pts: Net burn 10-19 days
- 0pts: Net mint or inconsistent

**Burn Source Diversity (15 points):**
- 15pts: 3+ burn sources active
- 10pts: 2 burn sources
- 5pts: 1 burn source
- 0pts: No active burns

**Supply Concentration (15 points):**
- 15pts: Top 10 hold <40%
- 10pts: Top 10 hold 40-60%
- 5pts: Top 10 hold 60-80%
- 0pts: Top 10 hold >80%

### Overall Health: [?]/100

**Grade:** [A/B/C/D/F]
- A (90-100): Excellent deflationary health
- B (80-89): Good, sustainable
- C (70-79): Fair, needs monitoring
- D (60-69): Poor, action required
- F (<60): Critical, immediate intervention

---

## 🚨 ALERTS & RECOMMENDATIONS

### 🔴 Critical Issues:

[IF burn/mint < 0.5:]
**ALERT: Excessive Minting!**
- Burn/Mint Ratio: [?] (target: >0.8)
- Net minting: [?] TAMA/day
- **Action Required:** Reduce mint rates or increase burn mechanisms

[IF burn sources < 2:]
**ALERT: Burn Source Concentration!**
- Only [?] burn mechanism(s) active
- **Action Required:** Activate additional burn utilities

### 🟡 Warnings:

[IF ratio 0.5-0.8:]
**WARNING: Approaching Inflation**
- Current ratio: [?]
- Monitor closely, prepare adjustments

### 🟢 Positive Indicators:

[IF ratio > 1.0:]
**EXCELLENT: Strong Deflation**
- Ratio: [?]
- Supply decreasing healthily
- Continue current mechanisms

---

## 💡 OPTIMIZATION RECOMMENDATIONS

### To Increase Burns:

1. **NFT Mint Incentives**
   - Current: [?] Bronze NFTs/month
   - Target: [?] Bronze NFTs/month
   - Action: Increase NFT value perception

2. **Withdrawal Volume**
   - Current: [?] TAMA withdrawn/month
   - Action: Healthy sign, don't discourage

3. **New Burn Mechanisms**
   - [ ] Marketplace listing fees (1% TAMA burn)
   - [ ] Pet breeding costs (500 TAMA burn)
   - [ ] Skin purchases (TAMA burn option)
   - [ ] Tournament entry fees

### To Control Mints:

1. **Reward Optimization**
   - Current daily mint: [?] TAMA
   - Review reward amounts
   - Implement diminishing returns

2. **NFT Daily Rewards**
   - Ensure rewards < value generated
   - Maintain sustainable APY

---

## 📅 MONITORING SCHEDULE

**Daily:**
- [ ] Check burn/mint ratio
- [ ] Alert if ratio < 0.8
- [ ] Monitor supply change

**Weekly:**
- [ ] Update this report
- [ ] Review burn sources
- [ ] Analyze trends

**Monthly:**
- [ ] Comprehensive review
- [ ] Adjust mechanisms if needed
- [ ] Report to team

---

*Report Generated: 2025-12-18*  
*Next Update: 2025-12-25*  
*Owner: @Analytics*  
*Critical Alerts: @Economy*
