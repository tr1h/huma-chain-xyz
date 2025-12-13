# 🌍 Global Jackpot Setup

## 📊 Database Setup (Supabase)

### Create `wheel_jackpot` table:

```sql
-- Create wheel_jackpot table
CREATE TABLE wheel_jackpot (
    id INT PRIMARY KEY DEFAULT 1,
    amount DECIMAL(20, 2) DEFAULT 5000,
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial jackpot (or update if exists)
INSERT INTO wheel_jackpot (id, amount, updated_at)
VALUES (1, 5000, NOW())
ON CONFLICT (id)
DO UPDATE SET updated_at = NOW();

-- Enable RLS (Row Level Security)
ALTER TABLE wheel_jackpot ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to READ
CREATE POLICY "Allow public read access"
ON wheel_jackpot FOR SELECT
TO public
USING (true);

-- Policy: Allow API to UPDATE
CREATE POLICY "Allow service role to update"
ON wheel_jackpot FOR UPDATE
TO service_role
USING (true);
```

## 🔧 How It Works

### 1. **Single Global Jackpot**

- Only ONE row in database (id=1)
- All players see same jackpot
- Updates in real-time

### 2. **Jackpot Growth**

- Every bet adds 5% to jackpot
- Example: 1000 TAMA bet → +50 TAMA to jackpot

### 3. **Jackpot Win**

- Player hits 10x multiplier
- Wins entire jackpot pool
- Jackpot resets to 5000 TAMA

### 4. **Real-Time Updates**

- Frontend polls every 5 seconds
- Shows live jackpot amount
- Synced across all players

## 📡 API Endpoints

### GET `/api/jackpot.php`

```json
{
  "success": true,
  "jackpot": 12345.5,
  "last_updated": "2025-12-12 10:30:00"
}
```

### POST `/api/jackpot.php`

**Add to jackpot (after bet):**

```json
{
  "action": "add",
  "amount": 50
}
```

**Reset jackpot (after win):**

```json
{
  "action": "reset"
}
```

**Admin set jackpot:**

```json
{
  "action": "set",
  "amount": 10000
}
```

## 🎮 Game Flow

1. Player bets 1000 TAMA
2. API adds 50 TAMA (5%) to global jackpot
3. Wheel spins
4. If 10x win:
   - Player gets jackpot
   - API resets jackpot to 5000
   - All players see reset
5. Jackpot display updates every 5 seconds

## 🔒 Security

- RLS enabled on table
- Service role required for updates
- Single row constraint prevents multiple jackpots
- Atomic updates (no race conditions)

## 🚀 Deployment

1. Run SQL in Supabase SQL Editor
2. Upload `api/jackpot.php` to server
3. Update `wheel.html` to use global jackpot
4. Test with multiple browsers/devices
