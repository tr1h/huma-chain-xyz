# 🏆 Unified Leaderboard System

## Overview

The **Unified Leaderboard** combines players from both Telegram (`leaderboard` table) and Website (`wallet_users` table) into a single ranking system.

Previously, players were split:
- 🤖 **Telegram users** → `leaderboard` table only
- 💻 **Wallet users** → `wallet_users` table only

Now, **all players compete together** in one leaderboard.

---

## Features

✅ **Single Ranking** - All players (Telegram + Wallet) in one list  
✅ **No Duplicates** - Linked accounts counted once (uses wallet data as primary)  
✅ **Account Type Badges** - Shows 📱 (Telegram), 💻 (Wallet), or 🔗 (Linked)  
✅ **Top 100** - Fetch top 100 players across both platforms  
✅ **User Rank** - Get any user's rank by Telegram ID, Wallet Address, or User ID  
✅ **Total Players** - Get total unique player count  

---

## Database Functions

### 1. `get_unified_leaderboard(limit, offset)`

Returns unified leaderboard with all players.

**Parameters:**
- `p_limit` (INTEGER) - Number of results (default: 100, max: 500)
- `p_offset` (INTEGER) - Offset for pagination (default: 0)

**Returns:**
```sql
rank BIGINT,
user_id TEXT,
username TEXT,
tama_balance NUMERIC,
level INTEGER,
clicks INTEGER,
account_type TEXT, -- 'telegram', 'wallet', or 'linked'
wallet_address TEXT,
telegram_id TEXT,
created_at TIMESTAMP
```

**Example:**
```sql
-- Get top 100 players
SELECT * FROM get_unified_leaderboard(100, 0);

-- Get next 100 (pagination)
SELECT * FROM get_unified_leaderboard(100, 100);
```

---

### 2. `get_user_rank_unified(telegram_id, wallet_address, user_id)`

Get specific user's rank in unified leaderboard.

**Parameters:**
- `p_telegram_id` (BIGINT) - Telegram user ID (optional)
- `p_wallet_address` (TEXT) - Solana wallet address (optional)
- `p_user_id` (TEXT) - User ID (e.g., `wallet_D8iLr9CS2sJc`) (optional)

**At least one parameter required.**

**Returns:**
```sql
rank BIGINT,
user_id TEXT,
username TEXT,
tama_balance NUMERIC,
level INTEGER,
total_players BIGINT
```

**Examples:**
```sql
-- Get rank by Telegram ID
SELECT * FROM get_user_rank_unified(p_telegram_id := 123456789);

-- Get rank by wallet address
SELECT * FROM get_user_rank_unified(
    p_wallet_address := 'D8iLr9CS2sJcRcKU1smUv2yGYnTKpbEgonCAdwoJaUFy'
);

-- Get rank by user_id
SELECT * FROM get_user_rank_unified(p_user_id := 'wallet_D8iLr9CS2sJc');
```

---

### 3. `get_total_players_unified()`

Returns total count of unique players.

**Returns:** `BIGINT`

**Example:**
```sql
SELECT get_total_players_unified();
-- Returns: 1250
```

---

## API Endpoints

### Base URL
```
https://api.solanatamagotchi.com/api/unified-leaderboard.php
```

### 1. Get Leaderboard

**Endpoint:** `GET ?action=leaderboard`

**Parameters:**
- `limit` (optional, default: 100) - Number of results
- `offset` (optional, default: 0) - Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "user_id": "wallet_D8iLr9CS2sJc",
      "username": "Player",
      "tama_balance": 150000,
      "level": 15,
      "clicks": 5000,
      "account_type": "wallet",
      "wallet_address": "D8iLr9CS2sJcRcKU1smUv2yGYnTKpbEgonCAdwoJaUFy",
      "telegram_id": null,
      "created_at": "2025-11-29T12:00:00Z"
    },
    ...
  ],
  "count": 100,
  "limit": 100,
  "offset": 0
}
```

**Example:**
```bash
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=leaderboard&limit=50"
```

---

### 2. Get User Rank

**Endpoint:** `GET ?action=rank`

**Parameters (at least one required):**
- `telegram_id` - Telegram user ID
- `wallet_address` - Solana wallet address
- `user_id` - User ID

**Response:**
```json
{
  "success": true,
  "found": true,
  "data": {
    "rank": 42,
    "user_id": "wallet_D8iLr9CS2sJc",
    "username": "Player",
    "tama_balance": 50000,
    "level": 10,
    "total_players": 1250
  }
}
```

**Examples:**
```bash
# By Telegram ID
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=rank&telegram_id=123456789"

# By Wallet Address
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=rank&wallet_address=D8iLr9CS..."

# By User ID
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=rank&user_id=wallet_D8iLr9CS2sJc"
```

---

### 3. Get Total Players

**Endpoint:** `GET ?action=total`

**Response:**
```json
{
  "success": true,
  "total_players": 1250
}
```

**Example:**
```bash
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=total"
```

---

## Frontend Integration

### Load Leaderboard

```javascript
async function loadUnifiedLeaderboard() {
    const response = await fetch(
        'https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=leaderboard&limit=100'
    );
    
    const result = await response.json();
    
    if (result.success) {
        console.log('Top 100 players:', result.data);
        renderLeaderboard(result.data);
    }
}
```

### Get User Rank

```javascript
async function getUserRank(walletAddress) {
    const response = await fetch(
        `https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=rank&wallet_address=${walletAddress}`
    );
    
    const result = await response.json();
    
    if (result.success && result.found) {
        console.log('Your rank:', result.data.rank);
        console.log('Total players:', result.data.total_players);
    }
}
```

---

## Account Type Badges

The leaderboard shows account type:

- 📱 **Telegram** - User plays only via Telegram bot
- 💻 **Wallet** - User plays only via website (wallet connection)
- 🔗 **Linked** - User has linked Telegram + Wallet accounts

---

## Setup

### 1. Run SQL Script

```bash
# In Supabase SQL Editor
Run: sql/create-unified-leaderboard.sql
```

### 2. Deploy API

The API is automatically deployed via GitHub Pages → Render.com webhook.

### 3. Update Frontend

The `tamagotchi-game.html` already uses unified leaderboard (updated in this commit).

---

## How It Works

### Deduplication Logic

1. **Telegram users WITHOUT linked wallet** → Show once
2. **Wallet users** → Show once (even if linked to Telegram)
3. **Telegram users WITH linked wallet** → Only show if wallet data doesn't exist

This ensures:
- ✅ Linked accounts counted once
- ✅ Wallet data is primary source for linked accounts
- ✅ No duplicates in ranking

### Example:

**User Journey:**
1. Player starts in Telegram → Creates `leaderboard` entry
2. Player earns 1000 TAMA in Telegram
3. Player connects wallet via website → Creates `wallet_users` entry
4. Player links accounts → `leaderboard.linked_wallet` set
5. **Result:** Player appears ONCE in leaderboard with wallet data

---

## Testing

### Test Queries

```sql
-- Check combined data
SELECT * FROM get_unified_leaderboard(10, 0);

-- Check specific user
SELECT * FROM get_user_rank_unified(p_wallet_address := 'YOUR_WALLET');

-- Check total
SELECT get_total_players_unified();
```

### Test API

```bash
# Get top 10
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=leaderboard&limit=10"

# Get your rank
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=rank&wallet_address=YOUR_WALLET"

# Get total
curl "https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=total"
```

---

## Files

- `sql/create-unified-leaderboard.sql` - Database functions
- `api/unified-leaderboard.php` - REST API
- `tamagotchi-game.html` - Frontend integration
- `.docs/UNIFIED_LEADERBOARD.md` - This documentation

---

## Related

- [Telegram-Wallet Linking](.docs/TELEGRAM_WALLET_LINKING.md)
- [Wallet Users Table](.docs/SUPABASE_SETUP.md)
- [API Documentation](.docs/WALLET_CONNECTION_FIX.md)

---

**Status:** ✅ **Deployed and Active**

All players now compete in single unified leaderboard! 🎉

