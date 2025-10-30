# 💰 TAMA WITHDRAWAL SYSTEM GUIDE

## 🎯 **Overview**

This guide explains how users can withdraw TAMA tokens from the game to their real Solana wallets.

---

## 📋 **System Components**

### **1. Backend API** (`api/withdrawal-api.js`)
- Handles withdrawal requests
- Validates wallet addresses and balances
- Sends TAMA tokens on Solana blockchain
- Logs transactions to `withdrawals` table

### **2. Telegram Bot** (`bot/bot.py`)
- "💰 Withdraw TAMA" button in main menu
- Interactive withdrawal flow
- Wallet address validation
- Amount confirmation
- Transaction history viewing

### **3. Database** (`withdrawals` table)
- Stores all withdrawal requests
- Tracks status (pending, completed, failed)
- Records transaction signatures
- Logs fees and amounts

---

## 🔄 **Withdrawal Flow**

### **Step 1: User clicks "💰 Withdraw TAMA"**
```
Bot → Shows balance and withdrawal info
      - Minimum: 1,000 TAMA
      - Fee: 5%
      - Example calculation
```

### **Step 2: User clicks "💳 Enter Wallet Address"**
```
Bot → Prompts for Solana wallet address
User → Sends wallet address (e.g., from Phantom)
Bot → Validates format (32-44 chars, base58)
```

### **Step 3: User enters amount**
```
Bot → Asks for withdrawal amount
User → Sends amount (e.g., 10000)
Bot → Validates:
      - Amount >= 1,000 TAMA
      - Amount <= User balance
      - Calculates fee (5%)
```

### **Step 4: Confirmation**
```
Bot → Shows summary:
      - From: Game balance
      - To: Wallet address (truncated)
      - Amount: 10,000 TAMA
      - Fee: -500 TAMA
      - You receive: 9,500 TAMA
      
User → Clicks "✅ Confirm" or "❌ Cancel"
```

### **Step 5: Processing**
```
Bot → Calls API: POST /api/tama/withdrawal/request
API → 1. Checks balance
      2. Deducts TAMA from game
      3. Sends TAMA to wallet (on-chain)
      4. Saves to withdrawals table
      5. Logs transaction
      
API → Returns:
      - Transaction signature
      - Explorer URL
      - New balance
```

### **Step 6: Success**
```
Bot → Shows success message:
      - ✅ Withdrawal Successful!
      - Sent: 9,500 TAMA
      - Fee: 500 TAMA
      - New balance: 52,374 TAMA
      - [View on Explorer] button
```

---

## 🔐 **Security Features**

### **1. Wallet Validation**
```javascript
// Regex validation for Solana addresses
if (!re.match(r'^[1-9A-HJ-NP-Za-km-z]{32,44}$', wallet_address)) {
    return error('Invalid wallet address');
}
```

### **2. Balance Checks**
```javascript
// Double-check balance before sending
const userBalance = await getUserGameBalance(telegram_id);
if (userBalance < amount) {
    return error('Insufficient balance');
}
```

### **3. Session Management**
```python
# Temporary storage for withdrawal flow
withdrawal_sessions = {
    'telegram_id': {
        'wallet_address': '...',
        'amount': 10000
    }
}
```

### **4. Transaction Logging**
```javascript
// Every withdrawal is logged
await saveWithdrawalRequest({
    telegram_id,
    wallet_address,
    amount_requested,
    amount_sent,
    fee,
    status,
    transaction_signature
});
```

---

## 💳 **Database Schema**

### **`withdrawals` Table**
```sql
CREATE TABLE withdrawals (
    id BIGSERIAL PRIMARY KEY,
    telegram_id TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    amount_requested INTEGER NOT NULL,
    amount_sent INTEGER NOT NULL,
    fee INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    transaction_signature TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);
```

---

## 📊 **API Endpoints**

### **POST /api/tama/withdrawal/request**
Request a TAMA withdrawal.

**Request Body:**
```json
{
  "telegram_id": "7401131043",
  "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "amount": 10000
}
```

**Response (Success):**
```json
{
  "success": true,
  "withdrawal": {
    "amount_requested": 10000,
    "amount_sent": 9500,
    "fee": 500,
    "new_balance": 52374,
    "transaction_signature": "5j7s...",
    "explorer_url": "https://explorer.solana.com/tx/5j7s...?cluster=devnet"
  }
}
```

**Response (Error):**
```json
{
  "error": "Insufficient balance",
  "current": 5000,
  "requested": 10000
}
```

---

### **GET /api/tama/withdrawal/history**
Get withdrawal history for a user.

**Query Parameters:**
- `telegram_id` (required)

**Response:**
```json
{
  "withdrawals": [
    {
      "id": 1,
      "telegram_id": "7401131043",
      "wallet_address": "7xKXtg2...",
      "amount_requested": 10000,
      "amount_sent": 9500,
      "fee": 500,
      "status": "completed",
      "transaction_signature": "5j7s...",
      "created_at": "2024-10-30T12:00:00Z"
    }
  ]
}
```

---

### **GET /api/tama/withdrawal/limits**
Get withdrawal limits and fees.

**Response:**
```json
{
  "min_withdrawal": 1000,
  "fee_percentage": 5,
  "network": "devnet",
  "token": "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY"
}
```

---

## 🛠️ **Setup Instructions**

### **1. Install Dependencies**
```bash
cd api
npm install @solana/web3.js @solana/spl-token
```

### **2. Create Supabase Table**
```bash
# Run SQL in Supabase SQL Editor
cat sql/create_withdrawals_table.sql
```

### **3. Configure P2E Pool Wallet**
```bash
# The P2E Pool wallet is the source of TAMA for withdrawals
# It's created by setup-tokenomics.js
node setup-tokenomics.js

# Copy p2e-pool-keypair.json to api/ directory
cp p2e-pool-keypair.json api/
```

### **4. Fund P2E Pool (Devnet)**
```bash
# Add SOL for transaction fees
solana airdrop 2 HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw --url devnet

# Mint TAMA tokens to P2E Pool (requires Mint Authority)
# See TOKENOMICS.md for token distribution
```

### **5. Update Bot**
```bash
# The bot is already updated with withdrawal functionality
# Just restart it
cd bot
python bot.py
```

### **6. Test Withdrawal**
```
1. Open Telegram bot
2. Click "💰 Withdraw TAMA"
3. Enter your Phantom wallet address
4. Enter amount (minimum 1,000 TAMA)
5. Confirm
6. Check your wallet!
```

---

## ⚠️ **Important Notes**

### **Network:**
- Currently on **Devnet**
- For Mainnet: Change `NETWORK = 'mainnet-beta'` in `withdrawal-api.js`

### **P2E Pool:**
- Must have sufficient TAMA balance
- Must have SOL for transaction fees
- Private key stored in `p2e-pool-keypair.json` (NEVER commit!)

### **Fees:**
- 5% withdrawal fee
- Helps sustain the economy
- Can be adjusted in `withdrawal-api.js`

### **Security:**
- All private keys in `.gitignore`
- API validates all inputs
- Transactions logged for audit
- RLS policies protect data

---

## 📈 **Future Enhancements**

### **Phase 2:**
- Batch withdrawals (reduce fees)
- Automatic withdrawal (if balance > X)
- Withdrawal scheduling
- Lower fees for VIP users

### **Phase 3:**
- Multi-token support (SOL, USDC)
- Cross-chain withdrawals
- Instant withdrawals (no fee)
- Withdrawal rewards program

---

## 🐛 **Troubleshooting**

### **Error: "Insufficient balance"**
- User doesn't have enough TAMA
- Check `leaderboard` table balance

### **Error: "Invalid wallet address"**
- Address format incorrect
- Must be 32-44 chars, base58

### **Error: "Failed to send TAMA"**
- P2E Pool has insufficient TAMA
- P2E Pool has insufficient SOL for fees
- Network issues (devnet down)

### **Withdrawal stuck on "pending"**
- Check API logs
- Check Solana network status
- Verify P2E Pool setup

---

## 📞 **Support**

For issues or questions:
- Check API logs: `api/logs/`
- Check bot logs: `bot/bot_monitoring.log`
- Review transactions: Supabase → `withdrawals` table
- Solana Explorer: https://explorer.solana.com/?cluster=devnet

---

**Last Updated:** October 30, 2024  
**Version:** 1.0  
**Status:** ✅ Fully Functional on Devnet

