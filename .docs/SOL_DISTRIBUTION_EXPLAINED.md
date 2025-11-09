# 💎 SOL Distribution System

## Overview

When users mint Silver or Gold NFTs with SOL, the payment is automatically distributed across 3 treasury wallets with **dynamic percentage-based allocation**. This ensures flexible pricing while maintaining consistent distribution ratios.

---

## Distribution Breakdown

### Percentages (Fixed)
```
Total SOL Payment = 100%
├─ 50% → Treasury Main
├─ 30% → Treasury Liquidity
└─ 20% → Treasury Team
```

### Wallet Addresses
```javascript
TREASURY_MAIN       = '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM'
TREASURY_LIQUIDITY  = 'CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1'
TREASURY_TEAM       = 'Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8'
```

---

## How It Works

### 1. User Initiates Mint
User selects Silver (0.1 SOL) or Gold (0.2 SOL) tier and confirms payment.

### 2. Confirmation Dialog
```
Mint Silver NFT for 0.1 SOL?

You will receive a random rarity with 2.5-3.5x earning boost!

💰 SOL Distribution:
• 50% → Treasury Main (0.0500 SOL)
• 30% → Treasury Liquidity (0.0300 SOL)
• 20% → Treasury Team (0.0200 SOL)
```

### 3. Single Transaction with 3 Transfers
```javascript
const transaction = new Transaction()
    .add(
        // Transfer 1: 50% to Treasury Main
        SystemProgram.transfer({
            fromPubkey: userWallet,
            toPubkey: TREASURY_MAIN,
            lamports: Math.floor(solPrice * 1e9 * 0.50)
        })
    )
    .add(
        // Transfer 2: 30% to Treasury Liquidity
        SystemProgram.transfer({
            fromPubkey: userWallet,
            toPubkey: TREASURY_LIQUIDITY,
            lamports: Math.floor(solPrice * 1e9 * 0.30)
        })
    )
    .add(
        // Transfer 3: 20% to Treasury Team
        SystemProgram.transfer({
            fromPubkey: userWallet,
            toPubkey: TREASURY_TEAM,
            lamports: Math.floor(solPrice * 1e9 * 0.20)
        })
    );
```

### 4. Transaction Logging
Four transactions are logged in Supabase:
- **User's mint transaction** (total SOL paid)
- **Treasury Main income** (50% received)
- **Treasury Liquidity income** (30% received)
- **Treasury Team income** (20% received)

---

## Examples

### Silver NFT (0.1 SOL)
```
User pays:     0.1000 SOL
├─ Main:       0.0500 SOL (50%)
├─ Liquidity:  0.0300 SOL (30%)
└─ Team:       0.0200 SOL (20%)
```

### Gold NFT (0.2 SOL)
```
User pays:     0.2000 SOL
├─ Main:       0.1000 SOL (50%)
├─ Liquidity:  0.0600 SOL (30%)
└─ Team:       0.0400 SOL (20%)
```

### Custom Price (0.15 SOL)
```
User pays:     0.1500 SOL
├─ Main:       0.0750 SOL (50%)
├─ Liquidity:  0.0450 SOL (30%)
└─ Team:       0.0300 SOL (20%)
```

**The system automatically calculates distribution based on any price!**

---

## Key Features

### ✅ Dynamic Pricing
- Percentages are fixed (50/30/20)
- Actual amounts scale with price
- Supports any SOL amount

### ✅ Single Transaction
- All 3 transfers happen atomically
- User signs once
- Lower network fees

### ✅ Full Transparency
- Distribution shown before payment
- All transactions logged in database
- Blockchain verification via Solscan

### ✅ Accurate Accounting
```javascript
// Each transaction includes metadata:
{
    source: 'nft_mint_sol',
    percentage: '50%', // or '30%', '20%'
    nft_id: 'NFT_...',
    user: '7401131043',
    tier: 'Silver',
    transaction_signature: 'abcd1234...'
}
```

---

## Comparison: TAMA vs SOL Distribution

| Aspect | TAMA (Bronze) | SOL (Silver/Gold) |
|--------|---------------|-------------------|
| **Method** | API endpoint + backend | Frontend transaction |
| **Transfers** | 3 separate (sequential) | 3 in 1 (atomic) |
| **Distribution** | 40% Burn, 30% Treasury, 30% P2E | 50% Main, 30% Liquidity, 20% Team |
| **Blockchain** | TAMA SPL Token | SOL Native |
| **Gas Fees** | Paid by backend | Paid by user |
| **Speed** | ~3 seconds | ~1 second |

---

## Code Location

### Frontend Implementation
File: `nft-mint.html`
Lines: 710-879

Key functions:
- `mintNFTWithSOL()` - Handles SOL payment flow
- Distribution calculation (lines 716-720)
- Transaction creation (lines 729-753)
- Database logging (lines 801-879)

### User-Facing Documentation
File: `index.html`
Lines: 562-571

---

## Testing

### Console Commands
```javascript
// Check distribution calculation
const solPrice = 0.1;
const distribution = {
    main: Math.floor(solPrice * 1e9 * 0.50),
    liquidity: Math.floor(solPrice * 1e9 * 0.30),
    team: Math.floor(solPrice * 1e9 * 0.20)
};
console.log('Distribution:', distribution);

// Expected output:
// Distribution: {
//   main: 50000000,       // 0.0500 SOL
//   liquidity: 30000000,  // 0.0300 SOL
//   team: 20000000        // 0.0200 SOL
// }
```

### Manual Test
1. Go to: https://tr1h.github.io/huma-chain-xyz/nft-mint.html
2. Connect Phantom wallet
3. Select Silver tier
4. Click "Mint with SOL"
5. Confirm transaction
6. Check Solscan for 3 transfers in single transaction

---

## Benefits

### For the Project
- **Treasury Main (50%)**: Funds operations, marketing, development
- **Treasury Liquidity (30%)**: Provides DEX liquidity for TAMA token
- **Treasury Team (20%)**: Fair compensation for team efforts

### For Users
- **Transparency**: Clear breakdown before payment
- **Efficiency**: Single transaction, lower fees
- **Trust**: Verifiable on blockchain
- **Flexibility**: Works with any price

---

## Future Improvements

### Potential Enhancements
1. **Dynamic Percentages**: Admin panel to adjust ratios
2. **Multi-Tier Wallets**: Different splits for Bronze/Silver/Gold
3. **Wallet Balance Display**: Show current treasury balances
4. **Distribution History**: Chart showing historical splits

### Considerations
- Maintain transparency
- Keep user experience simple
- Ensure accurate accounting
- Support price changes

---

## Summary

The SOL distribution system implements a **50/30/20 split** with:
- ✅ Dynamic percentage-based calculation
- ✅ Atomic transaction (3 transfers in 1)
- ✅ Full transparency and logging
- ✅ Flexible pricing support

All SOL payments are automatically distributed to support:
1. **Operations** (Treasury Main - 50%)
2. **Liquidity** (Treasury Liquidity - 30%)
3. **Team** (Treasury Team - 20%)

This ensures sustainable growth and fair value distribution! 🚀

