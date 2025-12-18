# 💰 Revenue Analytics Report

**Period:** Декабрь 2025  
**Generated:** 18 декабря 2025  
**Author:** @Analytics  
**Focus:** Monetization & Revenue Optimization

---

## 💵 EXECUTIVE SUMMARY

### Revenue Snapshot:

```
Total Revenue (Lifetime):  $[?]
This Month:                $[?]
Last Month:                $[?]
Growth:                    +[?]% MoM

ARPU (All Users):          $[?]
ARPPU (Paying Users):      $[?]
Conversion Rate:           [?]%
```

**Key Takeaway:** [1-2 предложения о revenue performance]

---

## 📊 REVENUE BREAKDOWN

### SQL Query:

```sql
-- Revenue calculation from NFT sales
WITH nft_revenue AS (
  SELECT 
    tier_name,
    payment_type,
    COUNT(*) as quantity_sold,
    SUM(CASE WHEN payment_type = 'SOL' THEN price ELSE 0 END) as sol_revenue,
    SUM(CASE WHEN payment_type = 'TAMA' THEN price ELSE 0 END) as tama_revenue,
    AVG(CASE WHEN payment_type = 'SOL' THEN price ELSE NULL END) as avg_price_sol,
    MIN(minted_at) as first_sale,
    MAX(minted_at) as last_sale
  FROM user_nfts
  WHERE is_active = true
  GROUP BY tier_name, payment_type
)
SELECT 
  *,
  sol_revenue * 200 as usd_equiv  -- Assuming SOL = $200
FROM nft_revenue
ORDER BY sol_revenue DESC;
```

### 💎 Revenue by Tier:

| Tier | Payment | Qty | Total SOL | USD Equiv | Avg Price | % of Revenue |
|------|---------|-----|-----------|-----------|-----------|--------------|
| Diamond | SOL | [?] | [?] | $[?] | [?] SOL | [?]% |
| Platinum | SOL | [?] | [?] | $[?] | [?] SOL | [?]% |
| Gold | SOL | [?] | [?] | $[?] | [?] SOL | [?]% |
| Silver | SOL | [?] | [?] | $[?] | [?] SOL | [?]% |
| Bronze_SOL | SOL | [?] | [?] | $[?] | [?] SOL | [?]% |
| Bronze | TAMA | [?] | - | $[?] | 5K TAMA | [?]% |

**Total Revenue:** [?] SOL ≈ **$[?]**

### Revenue Concentration:

```
Top Tier (Diamond):      [?]% of revenue
Top 3 Tiers:             [?]% of revenue
Bronze (Entry):          [?]% of revenue
```

---

## 📈 REVENUE TRENDS

### SQL Query:

```sql
-- Daily revenue over time
SELECT 
  DATE(minted_at) as date,
  COUNT(*) as nfts_sold,
  SUM(CASE WHEN payment_type = 'SOL' THEN price ELSE 0 END) as sol_revenue,
  SUM(CASE WHEN payment_type = 'SOL' THEN price ELSE 0 END) * 200 as usd_revenue
FROM user_nfts
WHERE minted_at >= NOW() - INTERVAL '30 days'
  AND is_active = true
GROUP BY DATE(minted_at)
ORDER BY date;
```

### 💹 Daily Revenue (Last 30 Days):

| Date | NFTs Sold | SOL Revenue | USD Revenue |
|------|-----------|-------------|-------------|
| [date] | [?] | [?] | $[?] |
| [date] | [?] | [?] | $[?] |
| [date] | [?] | [?] | $[?] |
| ... | ... | ... | ... |

**7-Day Moving Average:** $[?]/day  
**Best Day:** [date] - $[?]  
**Worst Day:** [date] - $[?]

### Weekly Comparison:

| Week | NFTs Sold | Revenue | Avg/NFT | Growth |
|------|-----------|---------|---------|--------|
| This Week | [?] | $[?] | $[?] | - |
| Last Week | [?] | $[?] | $[?] | +[?]% |
| 2 Weeks Ago | [?] | $[?] | $[?] | +[?]% |
| 3 Weeks Ago | [?] | $[?] | $[?] | +[?]% |

---

## 👥 USER MONETIZATION

### SQL Query:

```sql
-- User segmentation by spending
WITH user_spending AS (
  SELECT 
    u.user_id,
    u.username,
    u.created_at as joined_at,
    COUNT(n.id) as nfts_owned,
    SUM(CASE WHEN n.payment_type = 'SOL' THEN n.price ELSE 0 END) as total_spent_sol,
    MAX(CASE 
      WHEN n.tier_name = 'Diamond' THEN 5
      WHEN n.tier_name = 'Platinum' THEN 4
      WHEN n.tier_name = 'Gold' THEN 3
      WHEN n.tier_name = 'Silver' THEN 2
      ELSE 1
    END) as highest_tier
  FROM users u
  LEFT JOIN user_nfts n ON u.user_id = n.user_id AND n.is_active = true
  GROUP BY u.user_id, u.username, u.created_at
)
SELECT 
  CASE 
    WHEN total_spent_sol = 0 THEN 'Non-Payer'
    WHEN total_spent_sol < 1 THEN 'Minnow (<1 SOL)'
    WHEN total_spent_sol BETWEEN 1 AND 5 THEN 'Dolphin (1-5 SOL)'
    WHEN total_spent_sol BETWEEN 5 AND 20 THEN 'Whale (5-20 SOL)'
    ELSE 'Mega Whale (20+ SOL)'
  END as spender_segment,
  COUNT(*) as user_count,
  ROUND(AVG(total_spent_sol), 2) as avg_spent,
  SUM(total_spent_sol) as total_revenue_sol,
  ROUND(AVG(nfts_owned), 1) as avg_nfts
FROM user_spending
GROUP BY spender_segment
ORDER BY 
  CASE spender_segment
    WHEN 'Mega Whale (20+ SOL)' THEN 1
    WHEN 'Whale (5-20 SOL)' THEN 2
    WHEN 'Dolphin (1-5 SOL)' THEN 3
    WHEN 'Minnow (<1 SOL)' THEN 4
    ELSE 5
  END;
```

### 🐋 User Segments:

| Segment | Users | % of Total | Avg Spent | Total Revenue | % of Revenue |
|---------|-------|------------|-----------|---------------|--------------|
| Mega Whales (20+ SOL) | [?] | [?]% | [?] SOL | [?] SOL | [?]% |
| Whales (5-20 SOL) | [?] | [?]% | [?] SOL | [?] SOL | [?]% |
| Dolphins (1-5 SOL) | [?] | [?]% | [?] SOL | [?] SOL | [?]% |
| Minnows (<1 SOL) | [?] | [?]% | [?] SOL | [?] SOL | [?]% |
| Non-Payers | [?] | [?]% | 0 | 0 | 0% |

**Revenue Concentration:**
- Top 1% users generate: [?]% of revenue
- Top 10% users generate: [?]% of revenue
- Top 50% paying users: [?]% of revenue

### Top Spenders:

| Rank | Username | NFTs Owned | Total Spent | Highest Tier | Joined |
|------|----------|------------|-------------|--------------|--------|
| 1 | [user] | [?] | [?] SOL | Diamond | [date] |
| 2 | [user] | [?] | [?] SOL | [tier] | [date] |
| 3 | [user] | [?] | [?] SOL | [tier] | [date] |
| 4 | [user] | [?] | [?] SOL | [tier] | [date] |
| 5 | [user] | [?] | [?] SOL | [tier] | [date] |
| 6 | [user] | [?] | [?] SOL | [tier] | [date] |
| 7 | [user] | [?] | [?] SOL | [tier] | [date] |
| 8 | [user] | [?] | [?] SOL | [tier] | [date] |
| 9 | [user] | [?] | [?] SOL | [tier] | [date] |
| 10 | [user] | [?] | [?] SOL | [tier] | [date] |

---

## 💳 CONVERSION ANALYSIS

### SQL Query:

```sql
-- Conversion funnel
WITH user_stats AS (
  SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN nft_count > 0 THEN 1 END) as paying_users,
    COUNT(CASE WHEN nft_count > 0 THEN 1 END) * 100.0 / COUNT(*) as conversion_rate
  FROM (
    SELECT 
      u.user_id,
      COUNT(n.id) as nft_count
    FROM users u
    LEFT JOIN user_nfts n ON u.user_id = n.user_id AND n.is_active = true
    GROUP BY u.user_id
  ) user_nfts
)
SELECT * FROM user_stats;

-- Time to first purchase
SELECT 
  ROUND(AVG(DATE_PART('day', first_purchase - joined_at)), 1) as avg_days_to_purchase,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY DATE_PART('day', first_purchase - joined_at)) as median_days
FROM (
  SELECT 
    u.user_id,
    u.created_at as joined_at,
    MIN(n.minted_at) as first_purchase
  FROM users u
  INNER JOIN user_nfts n ON u.user_id = n.user_id AND n.is_active = true
  GROUP BY u.user_id, u.created_at
) purchases;
```

### 📊 Conversion Metrics:

**Overall Conversion:**
```
Total Users:        [?]
Paying Users:       [?]
Conversion Rate:    [?]%
```

**Industry Benchmarks:**
- Mobile Games: 2-5%
- Web3 Games: 10-20%
- Premium Games: 30-50%

**Our Performance:** [Above/Below/On-par with Web3]

**Time to First Purchase:**
```
Average:   [?] days
Median:    [?] days
Fastest:   [?] days
Slowest:   [?] days
```

### Conversion by Cohort:

```sql
-- Conversion rate by cohort age
WITH cohort_conversion AS (
  SELECT 
    DATE(u.created_at) as cohort_date,
    COUNT(DISTINCT u.user_id) as total_users,
    COUNT(DISTINCT n.user_id) as converted_users,
    COUNT(DISTINCT n.user_id) * 100.0 / COUNT(DISTINCT u.user_id) as conversion_rate,
    ROUND(AVG(DATE_PART('day', n.minted_at - u.created_at)), 1) as avg_days_to_convert
  FROM users u
  LEFT JOIN (
    SELECT user_id, MIN(minted_at) as minted_at
    FROM user_nfts 
    WHERE is_active = true 
    GROUP BY user_id
  ) n ON u.user_id = n.user_id
  WHERE u.created_at >= NOW() - INTERVAL '60 days'
  GROUP BY DATE(u.created_at)
  HAVING COUNT(DISTINCT u.user_id) >= 5
)
SELECT * FROM cohort_conversion
ORDER BY cohort_date DESC
LIMIT 30;
```

| Cohort Date | Users | Converted | Conversion % | Avg Days to Convert |
|-------------|-------|-----------|--------------|---------------------|
| [date] | [?] | [?] | [?]% | [?] |
| [date] | [?] | [?] | [?]% | [?] |
| [date] | [?] | [?] | [?]% | [?] |

**Trend:** Conversion rate is [improving/declining/stable]

---

## 💡 TIER PERFORMANCE

### SQL Query:

```sql
-- Tier popularity and revenue
SELECT 
  tier_name,
  COUNT(*) as units_sold,
  ROUND(AVG(price), 2) as avg_price,
  SUM(price) as total_revenue_sol,
  SUM(price) * 200 as total_revenue_usd,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as pct_of_sales,
  ROUND(SUM(price) * 100.0 / SUM(SUM(price)) OVER (), 1) as pct_of_revenue,
  ROUND(SUM(price) / COUNT(*), 2) as revenue_per_unit
FROM user_nfts
WHERE payment_type = 'SOL'
  AND is_active = true
GROUP BY tier_name
ORDER BY total_revenue_sol DESC;
```

### 🎨 Tier Analysis:

| Tier | Units | Avg Price | Total Revenue | % of Sales | % of Revenue | Rev/Unit |
|------|-------|-----------|---------------|------------|--------------|----------|
| Diamond | [?] | [?] SOL | $[?] | [?]% | [?]% | $[?] |
| Platinum | [?] | [?] SOL | $[?] | [?]% | [?]% | $[?] |
| Gold | [?] | [?] SOL | $[?] | [?]% | [?]% | $[?] |
| Silver | [?] | [?] SOL | $[?] | [?]% | [?]% | $[?] |
| Bronze_SOL | [?] | [?] SOL | $[?] | [?]% | [?]% | $[?] |

**Best Seller (Units):** [tier]  
**Revenue Leader:** [tier]  
**Best Value (Rev/Unit):** [tier]

### Price Elasticity:

**Observations:**
- [Tier] sells well despite high price → inelastic demand
- [Tier] low sales at low price → needs value boost
- [Tier] sweet spot → optimize price point

---

## 📊 ARPU & LTV ANALYSIS

### SQL Query:

```sql
-- ARPU and ARPPU calculations
WITH revenue_metrics AS (
  SELECT 
    COUNT(DISTINCT u.user_id) as total_users,
    COUNT(DISTINCT n.user_id) as paying_users,
    SUM(CASE WHEN n.payment_type = 'SOL' THEN n.price ELSE 0 END) as total_revenue_sol,
    SUM(CASE WHEN n.payment_type = 'SOL' THEN n.price ELSE 0 END) * 200 as total_revenue_usd
  FROM users u
  LEFT JOIN user_nfts n ON u.user_id = n.user_id AND n.is_active = true
)
SELECT 
  total_users,
  paying_users,
  total_revenue_usd,
  ROUND(total_revenue_usd / total_users, 2) as arpu,
  ROUND(total_revenue_usd / NULLIF(paying_users, 0), 2) as arppu,
  ROUND(paying_users * 100.0 / total_users, 1) as conversion_rate
FROM revenue_metrics;

-- LTV estimation (30-day cohort)
WITH cohort_30d AS (
  SELECT 
    u.user_id,
    DATE_PART('day', NOW() - u.created_at) as days_active,
    COALESCE(SUM(CASE WHEN n.payment_type = 'SOL' THEN n.price ELSE 0 END), 0) * 200 as revenue_generated
  FROM users u
  LEFT JOIN user_nfts n ON u.user_id = n.user_id AND n.is_active = true
  WHERE u.created_at >= NOW() - INTERVAL '30 days'
    AND u.created_at < NOW() - INTERVAL '30 days' + INTERVAL '1 day'
  GROUP BY u.user_id, u.created_at
)
SELECT 
  COUNT(*) as cohort_size,
  ROUND(AVG(revenue_generated), 2) as avg_ltv_30d,
  ROUND(AVG(revenue_generated) * 365 / 30, 2) as projected_ltv_1yr,
  ROUND(AVG(revenue_generated) / AVG(days_active), 2) as daily_revenue_rate
FROM cohort_30d;
```

### 💰 Key Metrics:

**ARPU (Average Revenue Per User):**
```
All Users:              $[?]
Active Users (30d):     $[?]
New Users (This month): $[?]
```

**ARPPU (Average Revenue Per Paying User):**
```
All Paying Users:       $[?]
Recent Payers (30d):    $[?]
```

**LTV (Lifetime Value) Estimates:**
```
30-Day Cohort LTV:      $[?]
Projected 1-Year LTV:   $[?]
Daily Revenue/User:     $[?]
```

**Conversion Rate:** [?]%

### Benchmarking:

| Metric | Our Value | Industry Avg | Top 25% | Status |
|--------|-----------|--------------|---------|--------|
| ARPU | $[?] | $5-15 | $20+ | [🟢/🟡/🔴] |
| ARPPU | $[?] | $50-100 | $150+ | [🟢/🟡/🔴] |
| Conversion | [?]% | 10-20% | 25%+ | [🟢/🟡/🔴] |
| LTV | $[?] | $20-50 | $100+ | [🟢/🟡/🔴] |

---

## 📈 REVENUE OPTIMIZATION OPPORTUNITIES

### 1. **Pricing Strategy**

**Current Issues:**
- [Issue 1 - e.g., "Diamond tier underpriced for value"]
- [Issue 2 - e.g., "Silver tier too expensive vs Bronze"]

**Recommendations:**
- [ ] A/B test [tier] price: [current] → [new] SOL
- [ ] Add limited-time discounts for [tier]
- [ ] Create bundle offers (e.g., "2 NFTs for 10% off")

**Projected Impact:** +$[?] monthly revenue

---

### 2. **Conversion Optimization**

**Current Conversion:** [?]%  
**Target:** [?]%  
**Gap:** [?] users

**Actions:**
- [ ] Improve first NFT experience (tutorial)
- [ ] Show value proposition clearly (ROI calculator)
- [ ] Add social proof (testimonials, sales counter)
- [ ] Create urgency (limited supply countdown)

**Projected Impact:** +[?] conversions/month = +$[?]

---

### 3. **Upsell Opportunities**

**Current:**
- [?]% of users own 1 NFT
- [?]% of users own 2+ NFTs

**Upsell Strategies:**
- [ ] Offer 2nd NFT discount (10% off)
- [ ] Create tier upgrade path (Silver → Gold + bonus)
- [ ] Bundle deals for collectors
- [ ] Loyalty rewards for multiple purchases

**Projected Impact:** +[?]% multi-NFT owners = +$[?]

---

### 4. **New Revenue Streams**

**Ideas:**
1. **Marketplace Fees**
   - 2-5% fee on P2P NFT sales
   - Estimated volume: [?] trades/month
   - Projected revenue: $[?]/month

2. **Premium Features**
   - Exclusive skins for $1-5
   - VIP subscription: $10/month
   - Estimated conversion: [?]%
   - Projected revenue: $[?]/month

3. **Sponsored Content**
   - Partner integrations
   - Branded events
   - Projected revenue: $[?]/month

**Total New Revenue Potential:** $[?]/month

---

### 5. **Retention → Revenue**

**Problem:** Lost revenue from churned players

**Stats:**
- [?] churned players spent avg $[?]
- If retained, lifetime value = $[?]
- Lost potential revenue: $[?]

**Win-back Campaign:**
- [ ] Target churned whales ([?] users)
- [ ] Offer: "Come back + get [benefit]"
- [ ] Expected return rate: [?]%
- [ ] Recovered revenue: $[?]

---

## 🎯 REVENUE GOALS

### This Month Targets:

| Metric | Current | Target | Gap | Actions |
|--------|---------|--------|-----|---------|
| Revenue | $[?] | $[?] | $[?] | [action] |
| ARPU | $[?] | $[?] | $[?] | [action] |
| Conversion | [?]% | [?]% | [?]% | [action] |
| Paying Users | [?] | [?] | [?] | [action] |

### 90-Day Projections:

**Conservative:**
- Revenue: $[?] → $[?] (+[?]%)
- Paying users: [?] → [?] (+[?]%)

**Optimistic (with optimizations):**
- Revenue: $[?] → $[?] (+[?]%)
- Paying users: [?] → [?] (+[?]%)

**What's needed for optimistic:**
1. [Condition 1]
2. [Condition 2]
3. [Condition 3]

---

## 📋 ACTION ITEMS

### @Developer:
- [ ] Implement revenue tracking dashboard
- [ ] Add A/B testing framework for pricing
- [ ] Build marketplace fee system

### @Economy:
- [ ] Review tier pricing vs value
- [ ] Model new revenue stream economics
- [ ] Set dynamic pricing rules

### @Marketing:
- [ ] Launch conversion optimization campaign
- [ ] Create upsell messaging
- [ ] Design win-back campaign for churned whales

### @UI-UX:
- [ ] Improve NFT purchase flow (reduce friction)
- [ ] Add social proof elements
- [ ] Create bundle offer UI

---

*Report Generated: 2025-12-18*  
*Next Update: 2026-01-18*  
*Owner: @Analytics*  
*Stakeholders: @Economy, @Developer, @Marketing*
