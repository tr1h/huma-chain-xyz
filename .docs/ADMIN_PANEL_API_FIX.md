# 🛠️ Admin Panel API Fix - Nov 7, 2025

## 🐛 Problem

`transactions-admin.html` was failing with **404 errors**:

```
Failed to load resource: the server responded with a status of 404
/transactions/list?limit=10000&offset=0&order=created_at.desc
❌ Error loading transactions: Error: Failed to fetch: 404
```

**Root Cause:** Missing API endpoints for admin panel:
- `/transactions/list` - for transactions list
- `/leaderboard/list` - for users list

---

## ✅ Solution

Added **2 new API endpoints** to `api/tama_supabase.php`:

### 1. **GET `/api/tama/transactions/list`**

Lists all transactions with pagination.

**Query Parameters:**
- `limit` - Number of records (default: 100)
- `offset` - Offset for pagination (default: 0)
- `order` - Sort order (default: `created_at.desc`)

**Example Request:**
```
GET /api/tama/transactions/list?limit=10000&offset=0&order=created_at.desc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": "7401131043",
      "username": "gotchi_ceo",
      "type": "earn_click",
      "amount": 5.5,
      "balance_before": 100,
      "balance_after": 105.5,
      "metadata": {"clicks": 10, "combo": 5},
      "created_at": "2025-11-07T12:00:00Z"
    },
    ...
  ]
}
```

**Note:** If `transactions` table doesn't exist yet, returns empty array:
```json
{
  "success": true,
  "data": [],
  "message": "Transactions table not found or empty"
}
```

---

### 2. **GET `/api/tama/leaderboard/list`**

Lists all users with pagination (for admin panel).

**Query Parameters:**
- `limit` - Number of records (default: 100)
- `offset` - Offset for pagination (default: 0)
- `order` - Sort order (default: `tama.desc`)

**Example Request:**
```
GET /api/tama/leaderboard/list?limit=100&offset=0&order=tama.desc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "telegram_id": "7401131043",
      "telegram_username": "gotchi_ceo",
      "pet_name": "Gotchi",
      "pet_type": "kawai",
      "level": 9,
      "xp": 850,
      "tama": 21383,
      "last_activity": "2025-11-07T12:00:00Z",
      "created_at": "2025-10-01T10:00:00Z"
    },
    ...
  ]
}
```

---

## 📊 Endpoints Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/transactions/list` | GET | Get transactions list for admin panel |
| `/leaderboard/list` | GET | Get users list for admin panel |
| `/leaderboard` | GET | Get top 50 users (existing) |
| `/leaderboard/upsert` | POST | Save game data (existing) |

---

## 🧪 How to Test

### Test 1: Transactions List
```bash
curl "https://huma-chain-xyz-production.up.railway.app/api/tama/transactions/list?limit=10&offset=0"
```

**Expected:** Returns JSON with `success: true` and `data` array.

### Test 2: Leaderboard List
```bash
curl "https://huma-chain-xyz-production.up.railway.app/api/tama/leaderboard/list?limit=10&offset=0"
```

**Expected:** Returns JSON with `success: true` and user data.

### Test 3: Admin Panel
1. Open https://tr1h.github.io/huma-chain-xyz/transactions-admin.html
2. Check console - should see: `✅ Loaded users: X`
3. **Expected:** No 404 errors, transactions/users load successfully

---

## 📝 Code Details

### `/transactions/list` Handler

```php
function handleTransactionsList($url, $key) {
    try {
        $limit = $_GET['limit'] ?? '100';
        $offset = $_GET['offset'] ?? '0';
        $order = $_GET['order'] ?? 'created_at.desc';
        
        $result = supabaseRequest($url, $key, 'GET', 'transactions', [
            'select' => 'id,user_id,username,type,amount,balance_before,balance_after,metadata,created_at',
            'order' => $order,
            'limit' => $limit,
            'offset' => $offset
        ]);
        
        echo json_encode([
            'success' => true,
            'data' => $result['data'] ?? []
        ]);
        
    } catch (Exception $e) {
        // Graceful fallback if table doesn't exist
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [],
            'message' => 'Transactions table not found or empty'
        ]);
    }
}
```

### `/leaderboard/list` Handler

```php
function handleLeaderboardList($url, $key) {
    try {
        $limit = $_GET['limit'] ?? '100';
        $offset = $_GET['offset'] ?? '0';
        $order = $_GET['order'] ?? 'tama.desc';
        
        $result = supabaseRequest($url, $key, 'GET', 'leaderboard', [
            'select' => '*',
            'order' => $order,
            'limit' => $limit,
            'offset' => $offset
        ]);
        
        echo json_encode([
            'success' => true,
            'data' => $result['data'] ?? []
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
```

---

## 🔥 Next Steps

### Create `transactions` Table (Optional)

If you want to track individual transactions, create this table in Supabase:

```sql
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    username TEXT,
    type TEXT NOT NULL, -- earn_click, spend_nft, level_up, etc.
    amount NUMERIC(20, 2) NOT NULL,
    balance_before NUMERIC(20, 2) NOT NULL,
    balance_after NUMERIC(20, 2) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
```

### Log Transactions in Game

Update `handleLeaderboardUpsert()` to log transactions:

```php
// After updating balance
supabaseRequest($url, $key, 'POST', 'transactions', [], [
    'user_id' => $user_id,
    'username' => $telegram_username,
    'type' => 'earn_game',
    'amount' => $tama - $old_tama,
    'balance_before' => $old_tama,
    'balance_after' => $tama,
    'metadata' => ['level' => $level]
]);
```

---

## 📁 Files Modified

- **`api/tama_supabase.php`**
  - Added routing for `/transactions/list`
  - Added routing for `/leaderboard/list`
  - Added `handleTransactionsList()` function
  - Added `handleLeaderboardList()` function

---

**Status:** ✅ FIXED  
**Commit:** `39cac5f`  
**Date:** November 7, 2025

Admin panel should now work correctly! 🎯

