# 📈 Player Retention Analysis Report

**Period:** Декабрь 2025  
**Generated:** 18 декабря 2025  
**Author:** @Analytics  
**Focus:** Cohort Analysis & Churn Prevention

---

## 🎯 EXECUTIVE SUMMARY

### Key Metrics:

| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| **Day 1 Retention** | [?]% | 40%+ | [🟢/🟡/🔴] |
| **Day 7 Retention** | [?]% | 20%+ | [🟢/🟡/🔴] |
| **Day 30 Retention** | [?]% | 10%+ | [🟢/🟡/🔴] |
| **Average Lifetime** | [?] days | - | - |
| **Churn Rate** | [?]% | <70% | [🟢/🟡/🔴] |

**Overall Grade:** [A/B/C/D/F]

---

## 📊 COHORT ANALYSIS

### SQL Query:

```sql
-- Cohort Retention Table
WITH cohorts AS (
  SELECT 
    user_id,
    DATE(created_at) as cohort_date,
    created_at
  FROM users
  WHERE created_at >= NOW() - INTERVAL '60 days'
),
user_activity AS (
  SELECT 
    user_id,
    DATE(created_at) as activity_date
  FROM transactions
  WHERE created_at >= NOW() - INTERVAL '60 days'
  GROUP BY user_id, DATE(created_at)
)
SELECT 
  c.cohort_date,
  COUNT(DISTINCT c.user_id) as cohort_size,
  
  -- Day 1
  COUNT(DISTINCT CASE 
    WHEN ua.activity_date = c.cohort_date + INTERVAL '1 day'
    THEN c.user_id 
  END) as day1_retained,
  ROUND(COUNT(DISTINCT CASE 
    WHEN ua.activity_date = c.cohort_date + INTERVAL '1 day'
    THEN c.user_id 
  END) * 100.0 / NULLIF(COUNT(DISTINCT c.user_id), 0), 1) as day1_pct,
  
  -- Day 3
  COUNT(DISTINCT CASE 
    WHEN ua.activity_date BETWEEN c.cohort_date + INTERVAL '2 days' 
    AND c.cohort_date + INTERVAL '4 days'
    THEN c.user_id 
  END) as day3_retained,
  ROUND(COUNT(DISTINCT CASE 
    WHEN ua.activity_date BETWEEN c.cohort_date + INTERVAL '2 days' 
    AND c.cohort_date + INTERVAL '4 days'
    THEN c.user_id 
  END) * 100.0 / NULLIF(COUNT(DISTINCT c.user_id), 0), 1) as day3_pct,
  
  -- Day 7
  COUNT(DISTINCT CASE 
    WHEN ua.activity_date BETWEEN c.cohort_date + INTERVAL '6 days' 
    AND c.cohort_date + INTERVAL '8 days'
    THEN c.user_id 
  END) as day7_retained,
  ROUND(COUNT(DISTINCT CASE 
    WHEN ua.activity_date BETWEEN c.cohort_date + INTERVAL '6 days' 
    AND c.cohort_date + INTERVAL '8 days'
    THEN c.user_id 
  END) * 100.0 / NULLIF(COUNT(DISTINCT c.user_id), 0), 1) as day7_pct,
  
  -- Day 14
  COUNT(DISTINCT CASE 
    WHEN ua.activity_date BETWEEN c.cohort_date + INTERVAL '13 days' 
    AND c.cohort_date + INTERVAL '15 days'
    THEN c.user_id 
  END) as day14_retained,
  ROUND(COUNT(DISTINCT CASE 
    WHEN ua.activity_date BETWEEN c.cohort_date + INTERVAL '13 days' 
    AND c.cohort_date + INTERVAL '15 days'
    THEN c.user_id 
  END) * 100.0 / NULLIF(COUNT(DISTINCT c.user_id), 0), 1) as day14_pct,
  
  -- Day 30
  COUNT(DISTINCT CASE 
    WHEN ua.activity_date BETWEEN c.cohort_date + INTERVAL '29 days' 
    AND c.cohort_date + INTERVAL '31 days'
    THEN c.user_id 
  END) as day30_retained,
  ROUND(COUNT(DISTINCT CASE 
    WHEN ua.activity_date BETWEEN c.cohort_date + INTERVAL '29 days' 
    AND c.cohort_date + INTERVAL '31 days'
    THEN c.user_id 
  END) * 100.0 / NULLIF(COUNT(DISTINCT c.user_id), 0), 1) as day30_pct

FROM cohorts c
LEFT JOIN user_activity ua ON c.user_id = ua.user_id
GROUP BY c.cohort_date
HAVING COUNT(DISTINCT c.user_id) >= 5  -- Minimum cohort size
ORDER BY c.cohort_date DESC
LIMIT 30;
```

### 📅 Retention Table:

| Cohort Date | Size | Day 1 | Day 3 | Day 7 | Day 14 | Day 30 |
|-------------|------|-------|-------|-------|--------|--------|
| [date] | [?] | [?]% | [?]% | [?]% | [?]% | [?]% |
| [date] | [?] | [?]% | [?]% | [?]% | [?]% | [?]% |
| [date] | [?] | [?]% | [?]% | [?]% | [?]% | [?]% |
| [date] | [?] | [?]% | [?]% | [?]% | [?]% | [?]% |
| [date] | [?] | [?]% | [?]% | [?]% | [?]% | [?]% |

**Average Retention:**
- Day 1: [?]%
- Day 7: [?]%
- Day 30: [?]%

---

## 📉 CHURN ANALYSIS

### SQL Query:

```sql
-- Churned Users (no activity in 7+ days)
WITH last_activity AS (
  SELECT 
    u.user_id,
    u.username,
    u.created_at as joined_at,
    u.level,
    u.tama_balance,
    MAX(t.created_at) as last_seen,
    DATE_PART('day', NOW() - MAX(t.created_at)) as days_inactive,
    COUNT(DISTINCT DATE(t.created_at)) as days_active_total
  FROM users u
  LEFT JOIN transactions t ON u.user_id = t.user_id
  GROUP BY u.user_id, u.username, u.created_at, u.level, u.tama_balance
)
SELECT 
  CASE 
    WHEN days_inactive < 7 THEN 'Active'
    WHEN days_inactive BETWEEN 7 AND 14 THEN 'At Risk'
    WHEN days_inactive BETWEEN 15 AND 30 THEN 'Churning'
    WHEN days_inactive > 30 THEN 'Churned'
  END as status,
  COUNT(*) as user_count,
  ROUND(AVG(level), 1) as avg_level,
  ROUND(AVG(tama_balance), 0) as avg_tama,
  ROUND(AVG(days_active_total), 1) as avg_days_played
FROM last_activity
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'Active' THEN 1
    WHEN 'At Risk' THEN 2
    WHEN 'Churning' THEN 3
    WHEN 'Churned' THEN 4
  END;
```

### 🚨 Churn Status:

| Status | Users | % | Avg Level | Avg TAMA | Avg Days Played |
|--------|-------|---|-----------|----------|-----------------|
| 🟢 Active (0-6d) | [?] | [?]% | [?] | [?] | [?] |
| 🟡 At Risk (7-14d) | [?] | [?]% | [?] | [?] | [?] |
| 🟠 Churning (15-30d) | [?] | [?]% | [?] | [?] | [?] |
| 🔴 Churned (30d+) | [?] | [?]% | [?] | [?] | [?] |

**Churn Rate:** [?]% (Churned / Total Users)

### At-Risk Players (Action Needed):

| Username | Last Seen | Days Inactive | Level | TAMA | NFTs |
|----------|-----------|---------------|-------|------|------|
| [user] | [date] | [?]d | [?] | [?] | [?] |
| [user] | [date] | [?]d | [?] | [?] | [?] |
| [user] | [date] | [?]d | [?] | [?] | [?] |

**Win-back Priority:** Players with NFTs and high TAMA

---

## 🎮 ENGAGEMENT PATTERNS

### SQL Query:

```sql
-- Activity Frequency by Cohort Age
WITH user_cohorts AS (
  SELECT 
    user_id,
    DATE(created_at) as join_date,
    DATE_PART('day', NOW() - created_at) as days_since_join
  FROM users
),
activity_counts AS (
  SELECT 
    uc.user_id,
    uc.days_since_join,
    COUNT(DISTINCT DATE(t.created_at)) as days_active,
    COUNT(*) as total_transactions
  FROM user_cohorts uc
  LEFT JOIN transactions t ON uc.user_id = t.user_id
  GROUP BY uc.user_id, uc.days_since_join
)
SELECT 
  CASE 
    WHEN days_since_join BETWEEN 0 AND 7 THEN 'Week 1'
    WHEN days_since_join BETWEEN 8 AND 14 THEN 'Week 2'
    WHEN days_since_join BETWEEN 15 AND 30 THEN 'Week 3-4'
    WHEN days_since_join BETWEEN 31 AND 60 THEN 'Month 2'
    ELSE 'Month 3+'
  END as cohort_age,
  COUNT(DISTINCT user_id) as users,
  ROUND(AVG(days_active), 1) as avg_days_active,
  ROUND(AVG(total_transactions), 0) as avg_transactions,
  ROUND(AVG(days_active) / AVG(days_since_join) * 100, 1) as engagement_rate
FROM activity_counts
WHERE days_since_join > 0
GROUP BY cohort_age
ORDER BY MIN(days_since_join);
```

### 📊 Engagement by Age:

| Cohort Age | Users | Avg Days Active | Avg Transactions | Engagement Rate |
|------------|-------|-----------------|------------------|-----------------|
| Week 1 | [?] | [?] | [?] | [?]% |
| Week 2 | [?] | [?] | [?] | [?]% |
| Week 3-4 | [?] | [?] | [?] | [?]% |
| Month 2 | [?] | [?] | [?] | [?]% |
| Month 3+ | [?] | [?] | [?] | [?]% |

**Pattern:** [Описание - engagement растёт/падает со временем?]

---

## 💎 RETENTION BY SEGMENT

### SQL Query:

```sql
-- Retention by NFT ownership
WITH user_segments AS (
  SELECT 
    u.user_id,
    u.created_at as joined_at,
    CASE 
      WHEN COUNT(n.id) = 0 THEN 'No NFT'
      WHEN COUNT(n.id) = 1 THEN '1 NFT'
      WHEN COUNT(n.id) BETWEEN 2 AND 3 THEN '2-3 NFTs'
      ELSE '4+ NFTs'
    END as nft_segment,
    MAX(CASE 
      WHEN n.tier_name IN ('Diamond', 'Platinum', 'Gold') 
      THEN 'Premium' 
      ELSE 'Regular' 
    END) as tier_level
  FROM users u
  LEFT JOIN user_nfts n ON u.user_id = n.user_id AND n.is_active = true
  WHERE u.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY u.user_id, u.created_at
),
segment_activity AS (
  SELECT 
    us.nft_segment,
    us.tier_level,
    COUNT(DISTINCT us.user_id) as total_users,
    COUNT(DISTINCT CASE 
      WHEN EXISTS (
        SELECT 1 FROM transactions t 
        WHERE t.user_id = us.user_id 
        AND t.created_at >= NOW() - INTERVAL '7 days'
      ) 
      THEN us.user_id 
    END) as active_7d
  FROM user_segments us
  GROUP BY us.nft_segment, us.tier_level
)
SELECT 
  nft_segment,
  tier_level,
  total_users,
  active_7d,
  ROUND(active_7d * 100.0 / total_users, 1) as retention_7d
FROM segment_activity
ORDER BY retention_7d DESC;
```

### 🎨 Retention by NFT Ownership:

| Segment | Tier | Total Users | Active (7d) | Retention |
|---------|------|-------------|-------------|-----------|
| 4+ NFTs | Premium | [?] | [?] | [?]% |
| 4+ NFTs | Regular | [?] | [?] | [?]% |
| 2-3 NFTs | Premium | [?] | [?] | [?]% |
| 2-3 NFTs | Regular | [?] | [?] | [?]% |
| 1 NFT | - | [?] | [?] | [?]% |
| No NFT | - | [?] | [?] | [?]% |

**Key Finding:** NFT ownership correlates with [higher/lower] retention

---

## 🎯 CRITICAL DROP-OFF POINTS

### Day 1 Drop-off Analysis:

**Users who joined but never returned:**

```sql
-- Day 1 Churners
SELECT 
  COUNT(*) as day1_churners,
  ROUND(AVG(CASE 
    WHEN EXISTS (
      SELECT 1 FROM transactions t 
      WHERE t.user_id = u.user_id
    ) 
    THEN 1 ELSE 0 
  END) * 100, 1) as pct_with_any_activity
FROM users u
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND created_at < NOW() - INTERVAL '1 day'
  AND NOT EXISTS (
    SELECT 1 FROM transactions t 
    WHERE t.user_id = u.user_id 
    AND DATE(t.created_at) > DATE(u.created_at)
  );
```

**Day 1 Churners:** [?] users ([?]% of new users)

**Common Patterns:**
1. [Pattern 1 - e.g., "Joined but never fed pet"]
2. [Pattern 2 - e.g., "Played once, earned 0 TAMA"]
3. [Pattern 3]

### Day 7 Drop-off Analysis:

**Users who were active Day 1-3 but churned by Day 7:**

```sql
-- Week 1 Churners
WITH week1_active AS (
  SELECT DISTINCT u.user_id
  FROM users u
  INNER JOIN transactions t ON u.user_id = t.user_id
  WHERE u.created_at >= NOW() - INTERVAL '30 days'
    AND u.created_at < NOW() - INTERVAL '7 days'
    AND DATE(t.created_at) BETWEEN DATE(u.created_at) 
    AND DATE(u.created_at) + INTERVAL '3 days'
)
SELECT 
  COUNT(*) as week1_churners,
  COUNT(*) * 100.0 / (SELECT COUNT(*) FROM week1_active) as churn_rate
FROM week1_active w
WHERE NOT EXISTS (
  SELECT 1 FROM transactions t 
  WHERE t.user_id = w.user_id 
  AND t.created_at >= NOW() - INTERVAL '7 days'
);
```

**Week 1 Churners:** [?] users ([?]% churn rate)

**Common Patterns:**
1. [Pattern 1]
2. [Pattern 2]
3. [Pattern 3]

---

## 💡 RETENTION DRIVERS (What Makes Players Stay)

### Feature Usage vs Retention:

```sql
-- Correlation between features and retention
WITH user_features AS (
  SELECT 
    u.user_id,
    MAX(CASE WHEN t.type LIKE '%slot%' THEN 1 ELSE 0 END) as used_slots,
    MAX(CASE WHEN t.type LIKE '%wheel%' THEN 1 ELSE 0 END) as used_wheel,
    MAX(CASE WHEN t.type LIKE '%breed%' THEN 1 ELSE 0 END) as used_breeding,
    COUNT(DISTINCT CASE WHEN n.id IS NOT NULL THEN 1 END) as has_nft,
    MAX(CASE WHEN r.referrer_id IS NOT NULL THEN 1 ELSE 0 END) as referred_someone
  FROM users u
  LEFT JOIN transactions t ON u.user_id = t.user_id
  LEFT JOIN user_nfts n ON u.user_id = n.user_id AND n.is_active = true
  LEFT JOIN referrals r ON u.user_id = r.referrer_id
  WHERE u.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY u.user_id
),
retention_check AS (
  SELECT 
    uf.*,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM transactions t 
        WHERE t.user_id = uf.user_id 
        AND t.created_at >= NOW() - INTERVAL '7 days'
      ) 
      THEN 1 ELSE 0 
    END as retained_7d
  FROM user_features uf
)
SELECT 
  'Played Slots' as feature,
  SUM(used_slots) as users_with_feature,
  ROUND(AVG(CASE WHEN used_slots = 1 THEN retained_7d END) * 100, 1) as retention_with,
  ROUND(AVG(CASE WHEN used_slots = 0 THEN retained_7d END) * 100, 1) as retention_without,
  ROUND(
    (AVG(CASE WHEN used_slots = 1 THEN retained_7d END) - 
     AVG(CASE WHEN used_slots = 0 THEN retained_7d END)) * 100, 
    1
  ) as lift
FROM retention_check
UNION ALL
SELECT 
  'Owns NFT' as feature,
  SUM(CASE WHEN has_nft > 0 THEN 1 ELSE 0 END),
  ROUND(AVG(CASE WHEN has_nft > 0 THEN retained_7d END) * 100, 1),
  ROUND(AVG(CASE WHEN has_nft = 0 THEN retained_7d END) * 100, 1),
  ROUND(
    (AVG(CASE WHEN has_nft > 0 THEN retained_7d END) - 
     AVG(CASE WHEN has_nft = 0 THEN retained_7d END)) * 100, 
    1
  )
FROM retention_check;
-- [Continue for other features]
```

### 📈 Feature Impact on Retention:

| Feature | Users Using | Retention With | Retention Without | Lift |
|---------|-------------|----------------|-------------------|------|
| Played Slots | [?] | [?]% | [?]% | +[?]% |
| Played Wheel | [?] | [?]% | [?]% | +[?]% |
| Owns NFT | [?] | [?]% | [?]% | +[?]% |
| Used Breeding | [?] | [?]% | [?]% | +[?]% |
| Referred Friend | [?] | [?]% | [?]% | +[?]% |

**Top Retention Driver:** [feature with highest lift]

---

## 🚀 ACTIONABLE RECOMMENDATIONS

### 🔴 High Priority (Implement ASAP):

1. **Onboarding Improvements**
   - Current Day 1 retention: [?]%
   - Target: 40%+
   - Actions:
     - [ ] Add interactive tutorial
     - [ ] Give meaningful first reward
     - [ ] Show clear progression path

2. **Day 7 Retention Boost**
   - Current Day 7 retention: [?]%
   - Target: 20%+
   - Actions:
     - [ ] Implement daily login rewards
     - [ ] Add week 1 quest chain
     - [ ] Send re-engagement notifications

3. **Win-back Campaign for At-Risk Users**
   - Target: [?] users inactive 7-14 days
   - Actions:
     - [ ] Telegram message with bonus offer
     - [ ] Limited-time TAMA bonus
     - [ ] New feature announcement

### 🟡 Medium Priority (Next 2 Weeks):

4. **Feature Discovery**
   - Problem: Low feature usage = lower retention
   - Actions:
     - [ ] Add feature hints/tooltips
     - [ ] Create mini-game discovery quest
     - [ ] Highlight unused features in UI

5. **Social Features**
   - Problem: Single-player gets boring
   - Actions:
     - [ ] Add friend list
     - [ ] Enable pet battles
     - [ ] Create leaderboards with rewards

### 🟢 Low Priority (Long-term):

6. **Retention Analytics Dashboard**
   - Create real-time cohort tracking
   - Automated retention alerts
   - A/B testing framework

---

## 📊 BENCHMARKING

### Industry Standards (Mobile Games):

| Metric | Industry Avg | Top 25% | Our Performance | Gap |
|--------|-------------|---------|-----------------|-----|
| Day 1 | 35-45% | 50%+ | [?]% | [?]% |
| Day 7 | 15-25% | 30%+ | [?]% | [?]% |
| Day 30 | 8-12% | 15%+ | [?]% | [?]% |

**Analysis:** [We are above/below industry standard]

---

## 📅 MONITORING PLAN

### Daily Checks:
- [ ] Day 1 retention of yesterday's cohort
- [ ] Number of at-risk users (7-14d inactive)
- [ ] Churn rate trending

### Weekly Reviews:
- [ ] Update this retention report
- [ ] Analyze new cohort performance
- [ ] Review win-back campaign results

### Monthly Deep Dives:
- [ ] Full cohort analysis
- [ ] Feature impact study
- [ ] Retention driver analysis

---

## 🎯 SUCCESS METRICS

**Target for Next 30 Days:**

```
Day 1 Retention:  [current]% → [target]%
Day 7 Retention:  [current]% → [target]%
Day 30 Retention: [current]% → [target]%
Churn Rate:       [current]% → <50%
```

**If we achieve these targets:**
- Projected MAU: [calculate]
- Projected revenue: $[calculate]
- Player LTV: $[calculate]

---

*Report Generated: 2025-12-18*  
*Next Update: 2026-01-18*  
*Owner: @Analytics*  
*Stakeholders: @Developer, @UI-UX, @Marketing, @Content*
