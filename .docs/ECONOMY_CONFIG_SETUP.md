# 🎮 Economy Config System - Complete Setup Guide

## Overview

The Economy Config System allows real-time adjustment of game economy parameters through an admin panel. Settings are stored in Supabase and automatically applied to all players.

---

## 📋 Components

1. **Database Table**: `economy_config` (Supabase PostgreSQL)
2. **API Endpoints**: `/api/tama/economy/apply`, `/api/tama/economy/active`
3. **Admin Panel**: `economy-admin.html`
4. **Game Integration**: `tamagotchi-game.html`

---

## 🚀 Setup Steps

### Step 1: Create Database Table

Run the SQL script in Supabase SQL Editor:

```bash
# Execute the SQL file
cat create_economy_config_table.sql
```

Or manually run in Supabase Dashboard:

```sql
CREATE TABLE IF NOT EXISTS economy_config (
    id SERIAL PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL UNIQUE,
    base_click_reward DECIMAL(10, 2) DEFAULT 1.0,
    min_reward DECIMAL(10, 2) DEFAULT 0.5,
    max_combo_bonus INTEGER DEFAULT 10,
    combo_window INTEGER DEFAULT 2500,
    combo_cooldown INTEGER DEFAULT 800,
    combo_bonus_divider INTEGER DEFAULT 5,
    spam_penalty DECIMAL(5, 2) DEFAULT 0.5,
    hp_per_click DECIMAL(10, 2) DEFAULT 0.1,
    food_per_click DECIMAL(10, 2) DEFAULT 0.05,
    happy_per_click DECIMAL(10, 2) DEFAULT 0.05,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default presets
INSERT INTO economy_config (config_name, base_click_reward, min_reward, max_combo_bonus, combo_window, combo_cooldown, combo_bonus_divider, spam_penalty, hp_per_click, food_per_click, happy_per_click, is_active)
VALUES 
    ('balanced', 1.0, 0.5, 10, 2500, 800, 5, 0.5, 0.1, 0.05, 0.05, TRUE),
    ('generous', 2.0, 1.0, 20, 3000, 500, 3, 0.7, 0.05, 0.03, 0.03, FALSE),
    ('strict', 0.5, 0.3, 5, 2000, 1000, 10, 0.3, 0.2, 0.1, 0.1, FALSE);
```

### Step 2: Verify API Endpoints

Test endpoints using curl or Postman:

```bash
# Test GET /economy/active
curl https://huma-chain-xyz.onrender.com/api/tama/economy/active

# Expected response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "config_name": "balanced",
      "base_click_reward": 1.0,
      "min_reward": 0.5,
      "max_combo_bonus": 10,
      "combo_window": 2500,
      "combo_cooldown": 800,
      "combo_bonus_divider": 5,
      "spam_penalty": 0.5,
      "hp_per_click": 0.1,
      "food_per_click": 0.05,
      "happy_per_click": 0.05,
      "is_active": true,
      "created_at": "2025-11-09T...",
      "updated_at": "2025-11-09T..."
    }
  ]
}
```

```bash
# Test POST /economy/apply
curl -X POST https://huma-chain-xyz.onrender.com/api/tama/economy/apply \
  -H "Content-Type: application/json" \
  -d '{
    "config_name": "custom",
    "settings": {
      "BASE_CLICK_REWARD": 1.5,
      "MIN_REWARD": 0.7,
      "MAX_COMBO_BONUS": 15,
      "COMBO_WINDOW": 3000,
      "COMBO_COOLDOWN": 700,
      "COMBO_BONUS_DIVIDER": 4,
      "SPAM_PENALTY": 0.6,
      "HP_PER_CLICK": 0.08,
      "FOOD_PER_CLICK": 0.04,
      "HAPPY_PER_CLICK": 0.04
    }
  }'

# Expected response:
{
  "success": true,
  "message": "Economy config applied successfully",
  "config_name": "custom",
  "action": "created"
}
```

### Step 3: Test Admin Panel

1. Open `https://tr1h.github.io/huma-chain-xyz/economy-admin.html`
2. Adjust sliders (Base Click Reward, Combo Window, etc.)
3. Click "✅ Apply Settings"
4. Verify success message: "✅ Settings saved to database and applied!"

### Step 4: Verify Game Integration

1. Open `https://tr1h.github.io/huma-chain-xyz/tamagotchi-game.html`
2. Open browser console (F12)
3. Look for: `✅ Loaded economy config from API: balanced { BASE_CLICK_REWARD: 1.0, ... }`
4. Click on your pet and observe TAMA rewards
5. Go back to Admin Panel, change settings to "Generous"
6. Reload game and verify new settings are applied

---

## 🎯 How It Works

```
┌────────────────────┐
│  Economy Admin     │
│  Panel             │
│  (economy-admin.   │
│   html)            │
└─────────┬──────────┘
          │ POST /economy/apply
          ▼
┌────────────────────┐
│  API               │
│  (tama_supabase.   │
│   php)             │
└─────────┬──────────┘
          │ UPDATE economy_config
          ▼
┌────────────────────┐
│  Supabase          │
│  PostgreSQL        │
│  (economy_config)  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Game              │
│  (tamagotchi-game. │ ← GET /economy/active (on load)
│   html)            │ ← BroadcastChannel (real-time)
└────────────────────┘
```

### Data Flow:

1. **Admin Panel** → Sends settings to `/economy/apply`
2. **API** → Saves to Supabase and deactivates other configs
3. **Supabase** → Stores active config
4. **Game** → Loads config on startup from `/economy/active`
5. **Game** → Also listens to BroadcastChannel for real-time updates from Admin Panel

---

## 📊 Config Parameters

| Parameter | Description | Default (Balanced) | Range |
|-----------|-------------|-------------------|-------|
| `BASE_CLICK_REWARD` | TAMA earned per click | 1.0 | 0.1 - 10.0 |
| `MIN_REWARD` | Minimum TAMA per click (spam penalty) | 0.5 | 0.1 - 5.0 |
| `MAX_COMBO_BONUS` | Max additional TAMA from combo | 10 | 1 - 100 |
| `COMBO_WINDOW` | Time window for combo (ms) | 2500 | 1000 - 5000 |
| `COMBO_COOLDOWN` | Min time between clicks (ms) | 800 | 100 - 2000 |
| `COMBO_BONUS_DIVIDER` | Combo bonus divisor | 5 | 1 - 20 |
| `SPAM_PENALTY` | Reward multiplier for spam clicking | 0.5 (50%) | 0.1 - 1.0 |
| `HP_PER_CLICK` | HP lost per click | 0.1 | 0.01 - 1.0 |
| `FOOD_PER_CLICK` | Food lost per click | 0.05 | 0.01 - 1.0 |
| `HAPPY_PER_CLICK` | Happy lost per click | 0.05 | 0.01 - 1.0 |

---

## 🎨 Presets

### 1. Balanced (Default)
- Moderate rewards and penalties
- Good for sustainable growth
- **Use case**: Mainnet launch, production

### 2. Generous
- Higher rewards, lower penalties
- Fast player growth
- **Use case**: Marketing campaigns, onboarding events

### 3. Strict
- Lower rewards, higher penalties
- Slower progression
- **Use case**: Token scarcity, economy balancing

### 4. Custom
- Fully customizable
- Create your own balance
- **Use case**: A/B testing, special events

---

## 🧪 Testing Checklist

- [ ] Create `economy_config` table in Supabase
- [ ] Insert default presets (balanced, generous, strict)
- [ ] Test `/economy/active` endpoint returns active config
- [ ] Test `/economy/apply` endpoint saves new config
- [ ] Verify only one config is `is_active: true` at a time
- [ ] Open Admin Panel and load current settings
- [ ] Change settings and apply
- [ ] Verify game loads new settings on startup
- [ ] Test BroadcastChannel updates (open game in 2 tabs, change settings in Admin Panel)
- [ ] Verify spam penalty works (click too fast)
- [ ] Verify combo bonus works (click in rhythm)
- [ ] Check transaction logging still works correctly

---

## 🐛 Troubleshooting

### Problem: Admin Panel shows "❌ Error saving to database"

**Solution**:
1. Check API endpoint is accessible: `curl https://huma-chain-xyz.onrender.com/api/tama/economy/active`
2. Verify Supabase table exists and has RLS policies
3. Check browser console for CORS errors

### Problem: Game shows "⚠️ No active economy config found in database"

**Solution**:
1. Run SQL to activate default preset:
```sql
UPDATE economy_config SET is_active = TRUE WHERE config_name = 'balanced';
```
2. Verify in Supabase Dashboard: Table Editor → economy_config → Check `is_active` column

### Problem: Settings not applying in game

**Solution**:
1. Clear localStorage: `localStorage.removeItem('economyConfig')`
2. Reload game and check console logs
3. Verify API endpoint returns correct data

### Problem: Multiple configs are active

**Solution**:
```sql
-- Deactivate all configs first
UPDATE economy_config SET is_active = FALSE;

-- Activate only one
UPDATE economy_config SET is_active = TRUE WHERE config_name = 'balanced';
```

---

## 🚨 Important Notes

1. **Only one config can be active** at a time
2. **Changes apply immediately** to new game sessions
3. **Existing game sessions** need to reload to see changes
4. **Transaction logging** is independent of economy config
5. **Backup your config** before making major changes (use Export Config button)

---

## 📝 API Documentation

### GET /api/tama/economy/active

Returns the currently active economy configuration.

**Request**: None

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "config_name": "balanced",
      "base_click_reward": 1.0,
      "min_reward": 0.5,
      "max_combo_bonus": 10,
      "combo_window": 2500,
      "combo_cooldown": 800,
      "combo_bonus_divider": 5,
      "spam_penalty": 0.5,
      "hp_per_click": 0.1,
      "food_per_click": 0.05,
      "happy_per_click": 0.05,
      "is_active": true,
      "created_at": "2025-11-09T12:00:00Z",
      "updated_at": "2025-11-09T12:00:00Z"
    }
  ]
}
```

### POST /api/tama/economy/apply

Applies a new economy configuration. Deactivates all other configs.

**Request**:
```json
{
  "config_name": "custom",
  "settings": {
    "BASE_CLICK_REWARD": 1.5,
    "MIN_REWARD": 0.7,
    "MAX_COMBO_BONUS": 15,
    "COMBO_WINDOW": 3000,
    "COMBO_COOLDOWN": 700,
    "COMBO_BONUS_DIVIDER": 4,
    "SPAM_PENALTY": 0.6,
    "HP_PER_CLICK": 0.08,
    "FOOD_PER_CLICK": 0.04,
    "HAPPY_PER_CLICK": 0.04
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Economy config applied successfully",
  "config_name": "custom",
  "action": "created"
}
```

---

## 🎯 Next Steps

1. **Deploy API changes** to Render.com
2. **Run SQL script** in Supabase
3. **Test Admin Panel** and verify changes
4. **Monitor transaction logs** to ensure click tracking works correctly
5. **Gather feedback** from players and adjust economy as needed

---

## 🔗 Related Files

- `create_economy_config_table.sql` - Database schema
- `api/tama_supabase.php` - API endpoints
- `economy-admin.html` - Admin panel UI
- `tamagotchi-game.html` - Game integration
- `.docs/ECONOMY_CONFIG_SETUP.md` - This document

---

**Last Updated**: November 9, 2025
**Status**: ✅ Ready for Production

