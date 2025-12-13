# 🔒 Security Guide - Solana Tamagotchi

## ⚠️ CRITICAL: Immediate Actions Required

### 1. Regenerate Compromised Keys

The following keys were exposed in git history and MUST be regenerated:

```bash
# 1. Generate new Solana keypair
solana-keygen new -o new-payer-keypair.json

# 2. Rotate Supabase keys in dashboard:
#    https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

# 3. Generate new admin password hash:
node -e "console.log(require('crypto').createHash('sha256').update('YOUR_NEW_PASSWORD').digest('hex'))"
```

### 2. Environment Variables Setup

**NEVER store secrets in code!** Use environment variables:

#### For Render/Railway/Vercel:
Set these in your hosting dashboard:
- `SOLANA_PAYER_KEYPAIR` - Base58 encoded private key
- `SUPABASE_KEY` - Anon key (client-safe)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-only!)
- `TELEGRAM_BOT_TOKEN` - Bot token
- `ADMIN_PASSWORD_HASH` - SHA-256 hash of admin password

#### For Local Development:
1. Copy `.env.example` to `.env`
2. Fill in your values
3. NEVER commit `.env` to git

## 🛡️ Security Checklist

### Files that should NEVER be committed:
- [ ] `.env` - Environment variables
- [ ] `admin-password.js` - Admin credentials
- [ ] `*-keypair.json` - Solana keypairs
- [ ] `.private/` - Private files directory

### Supabase Row Level Security (RLS):
- [ ] Enable RLS on all tables
- [ ] Create policies for read/write access
- [ ] Never expose service_role key to client

### API Security:
- [ ] Validate all inputs
- [ ] Use rate limiting
- [ ] Validate Telegram WebApp auth in production
- [ ] Set proper CORS origins (not `*`)

## 📁 File Structure

```
/js/config.js          - Centralized frontend config (loads from env)
/.env                  - Local secrets (gitignored)
/.env.example          - Template without secrets (committed)
/admin-password.js     - Admin hash only (gitignored)
/.gitignore            - Updated with all sensitive patterns
```

## 🔑 Generating Secure Credentials

### Admin Password Hash:
```bash
# Using Node.js
node -e "console.log(require('crypto').createHash('sha256').update('MySecurePassword123!').digest('hex'))"

# Using OpenSSL
echo -n "MySecurePassword123!" | openssl dgst -sha256
```

### Solana Keypair:
```bash
# Generate new keypair
solana-keygen new -o keypair.json

# Get public key
solana-keygen pubkey keypair.json

# Convert to base58 for env variable
node -e "console.log(require('bs58').encode(require('./keypair.json')))"
```

## 🚨 If Keys Are Compromised

1. **Immediately** rotate all affected keys
2. Check for unauthorized transactions
3. Review access logs
4. Update all deployed environments
5. Consider git history cleanup with `git filter-branch` or BFG Repo-Cleaner

## 📞 Security Contacts

If you discover a security vulnerability, please report it to:
- Email: security@solanatamagotchi.com
- Telegram: @GotchiGameBot (admin)

---
Last updated: 2024-12-13
