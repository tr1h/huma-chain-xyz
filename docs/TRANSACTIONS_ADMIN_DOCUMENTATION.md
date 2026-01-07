# Transactions Admin Panel - Documentation

## Overview

The **Transactions Admin Panel** (`transactions-admin.html`) provides real-time monitoring and management of all project transactions including TAMA tokens, SOL distributions, NFT mints, and withdrawals.

**Access URL:** https://solanatamagotchi.com/transactions-admin.html
**Authentication:** Requires admin password (stored in `admin-password.js`)

## Features

### 📊 Live Statistics Dashboard

The panel displays the following statistics in real-time:

| Stat | Description | Data Source |
|------|-------------|--------------|
| **Total Transactions** | Total number of all transactions | All sources combined |
| **Total Earned** | Total TAMA earned by users | Transactions table |
| **Total Spent** | Total TAMA spent by users | Transactions table |
| **NFT Mints** | Number of NFTs minted | user_nfts table |
| **Net Flow** | Total earned - Total spent | Calculated |
| **Active Users** | Unique users with transactions | All sources |
| **Total Withdrawn** | Total TAMA withdrawn | withdrawals table |
| **SOL Revenue** | Total SOL from NFT sales | sol_distributions table |

### 🔍 Filtering Options

- **User ID/Username**: Filter by specific user
- **Type**: Filter by transaction type
  - Earn (spins, quests, referrals, achievements)
  - Spend (NFT mints, bets)
  - NFT Mint (TAMA or SOL)
  - Withdrawal (user withdrawals)
  - SOL Distribution (main, liquidity, team)
  - Level Up
  - Quest Complete
  - Referral Bonus
- **Date Range**: Filter by date (from/to)

### 📥 Export to CSV

Download all transaction data in CSV format with columns:
- Date
- User ID
- Username
- Type
- Amount
- Balance Before
- Balance After
- Metadata

## Data Sources

### 1. Main Transactions (API)
**Endpoint:** `${TAMA_API_BASE}/transactions/list`

Transaction types:
- `earn_spin`, `earn_quest`, `earn_referral`, `earn_achievement`
- `spend_bet`, `spend_nft`
- `burn_*` (burn transactions)
- `level_up`
- `quest_complete`

### 2. NFT Mints (Supabase)
**Table:** `user_nfts`
**Limit:** 5,000 records

Transaction types:
- `nft_mint_tama` (Bronze tier, paid in TAMA)
- `nft_mint_sol` (Silver+, paid in SOL)

Metadata includes:
- tier_name (Bronze, Silver, Gold, Platinum, Diamond)
- rarity (Common, Uncommon, Rare, Epic, Legendary)
- earning_multiplier (2.0x, 2.3x, 2.7x, 3.5x, 5.0x)
- nft_mint_address
- payment_type (TAMA/SOL)
- price_sol
- price_usd

### 3. Withdrawals (Supabase)
**Table:** `withdrawals`
**Limit:** 5,000 records

Transaction type:
- `withdrawal`

Metadata includes:
- wallet_address
- tx_signature
- status (pending/completed/failed)
- completed_at

### 4. SOL Distributions (Supabase)
**Table:** `sol_distributions`
**Limit:** 10,000 records

Transaction types:
- `sol_distribution_main` (50% of SOL NFT revenue)
- `sol_distribution_liquidity` (30% of SOL NFT revenue)
- `sol_distribution_team` (20% of SOL NFT revenue)

Metadata includes:
- transaction_signature
- from_wallet
- to_wallet
- percentage
- nft_tier
- status
- execution_signature

## Transaction Types & Colors

| Type | Badge Color | Amount Color |
|------|-------------|--------------|
| Earn (spin, quest, etc.) | Green (#10b981) | Green (+) |
| Spend (bet, NFT) | Red (#ef4444) | Red (-) |
| Burn | Orange (#ff6b35) | Orange (🔥) |
| Treasury Income | Purple (#8b5cf6) | - |
| P2E Pool Refund | Blue (#3b82f6) | - |
| Level Up | Yellow (#f59e0b) | - |
| Quest | Purple (#8b5cf6) | - |
| Referral | Cyan (#06b6d4) | - |
| NFT Mint (TAMA) | Pink (#ec4899) | Red (-) |
| NFT Mint (SOL) | Yellow (#f59e0b) | - |
| Withdrawal | Red (#ef4444) | Red (-) |
| SOL Main | Blue (#3b82f6) | - |
| SOL Liquidity | Cyan (#06b6d4) | - |
| SOL Team | Purple (#8b5cf6) | - |

## Pagination

- **Page Size:** 100 transactions per page
- **Navigation:** Previous/Next buttons
- **Live Updates:** Auto-checks for new transactions every 5 seconds (only on page 1)

## User Detail Modal

Click on any transaction row to view detailed user information:

- User ID
- Username
- Pet Name
- Level
- Current Balance (live from leaderboard)
- Total Earned
- Total Spent
- Total Transactions
- Last Activity
- Last 10 Transactions

## Live Updates

The panel automatically checks for new transactions every 5 seconds when on page 1.
- New transactions trigger automatic reload
- Auto-update pauses when tab is hidden to save resources
- Last update time displayed at bottom

## API Endpoints Used

### TAMA API
- `GET /api/tama/transactions/list` - Main transactions
- `GET /api/tama/leaderboard/list` - User data

### Supabase REST API
- `GET /rest/v1/user_nfts` - NFT mints
- `GET /rest/v1/withdrawals` - Withdrawal requests
- `GET /rest/v1/sol_distributions` - SOL revenue distributions

## Configuration

All configuration loaded from `js/config.js`:

```javascript
const SUPABASE_URL = 'https://zfrazyupameidxpjihrh.supabase.co';
const TAMA_API_BASE = 'https://api.solanatamagotchi.com/api/tama';
```

## Authentication

1. Password hash stored in meta tag:
   ```html
   <meta name="admin-password-hash" content="...">
   ```

2. Alternative: Use `admin-password.js` (not committed to git)

3. Session timeout: 30 minutes (stored in sessionStorage)

4. Failed attempts lockout: 5 attempts → 30 seconds lock

## Troubleshooting

### No transactions showing
1. Check browser console for errors
2. Verify Supabase URL and API endpoints are accessible
3. Check network tab for failed requests
4. Verify authentication (login required)

### Statistics not updating
1. Auto-update only works on page 1
2. Refresh page to reload all data
3. Check console for JavaScript errors

### Export to CSV not working
1. Check browser's popup blocker
2. Ensure you have permission to download files

## Security Notes

- All data fetched using anon key (public, RLS protected)
- Admin operations require authentication
- Password never transmitted (SHA-256 hash only)
- All operations logged in console for debugging

## Future Enhancements

- [ ] Real-time websocket updates
- [ ] Advanced filtering (date ranges, multiple types)
- [ ] Transaction replay/rollback
- [ ] Bulk operations (approve/deny withdrawals)
- [ ] Charts and visualizations
- [ ] Transaction search by signature
- [ ] Export to PDF
- [ ] Transaction notes/comments

## File Structure

```
transactions-admin.html          # Main admin panel file
├── CSS Styles (inline)
├── HTML Structure
│   ├── Login Screen
│   ├── Main Content
│   │   ├── Statistics Cards
│   │   ├── Filters
│   │   ├── Transactions Table
│   │   └── Pagination
│   └── User Detail Modal
└── JavaScript (inline)
    ├── Data Loading (API + Supabase)
    ├── Statistics Calculation
    ├── Rendering
    ├── Filtering
    ├── Pagination
    └── Auto-update
```

## Version History

- **v1.0** (2025-12-19): Initial release with basic TAMA transactions
- **v1.1** (2026-01-07): Added NFT mints, withdrawals, SOL distributions
- **v1.2** (2026-01-07): Fixed CSS bugs, increased data limits, improved filtering

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase dashboard connectivity
3. Check API status
4. Review project documentation at `/docs/`
