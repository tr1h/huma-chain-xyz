# 🔒 Environment Variables Setup Guide

## ⚠️ SECURITY NOTICE

**NEVER commit .env files or API keys to Git!**

All sensitive credentials must be stored in environment variables.

---

## 📋 Required Environment Variables

### **Supabase Database**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here (for admin operations)
SUPABASE_DB_HOST=db.your-project.supabase.co
SUPABASE_DB_PASSWORD=your_db_password
```

### **Solana Blockchain**
```bash
SOLANA_NETWORK=devnet  # or mainnet-beta
SOLANA_RPC_URL=https://api.devnet.solana.com
TAMA_MINT_ADDRESS=your_tama_token_mint_address
```

### **Solana Keypairs (for local development)**
```bash
SOLANA_PAYER_KEYPAIR_PATH=C:\goooog\payer-keypair.json
SOLANA_MINT_KEYPAIR_PATH=C:\goooog\tama-mint-keypair.json
SOLANA_P2E_POOL_KEYPAIR_PATH=C:\goooog\p2e-pool-keypair.json
```

### **Solana Keypairs (for Render/Railway production)**
```bash
# Paste full JSON content as environment variable:
SOLANA_PAYER_KEYPAIR=[1,2,3,...,255]
SOLANA_P2E_POOL_KEYPAIR=[1,2,3,...,255]
```

### **Treasury Wallets**
```bash
TREASURY_MAIN=your_treasury_main_address
TREASURY_LIQUIDITY=your_liquidity_pool_address
TREASURY_TEAM=your_team_wallet_address
```

### **Telegram Bot**
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
```

### **Security Settings (Optional)**
```bash
RATE_LIMIT_PER_MINUTE=100
WITHDRAWAL_COOLDOWN=3600  # 1 hour in seconds
WITHDRAWAL_CAPTCHA_ENABLED=false
RECAPTCHA_SITE_KEY=your_recaptcha_site_key (if CAPTCHA enabled)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key (if CAPTCHA enabled)
```

---

## 🖥️ Local Development Setup

### **1. Create .env file**

Create a file named `.env` in your project root:

```bash
# Windows
copy .docs\ENV_SETUP_GUIDE.md .env
# Edit and fill in your values

# Linux/Mac
cp .docs/ENV_SETUP_GUIDE.md .env
# Edit and fill in your values
```

### **2. Example .env content**

```env
SUPABASE_URL=https://zfrazyupameidxpjihrh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
TAMA_MINT_ADDRESS=Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY
SOLANA_PAYER_KEYPAIR_PATH=C:\goooog\payer-keypair.json
SOLANA_P2E_POOL_KEYPAIR_PATH=C:\goooog\p2e-pool-keypair.json
```

### **3. Verify .gitignore**

Make sure `.env` is in `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
*.env
```

---

## ☁️ Production Deployment (Render/Railway)

### **Render.com**

1. Go to your service dashboard
2. Click **Environment** tab
3. Add each variable:
   - Click **Add Environment Variable**
   - Enter `Name` and `Value`
   - Click **Save Changes**

### **Railway.app**

1. Go to your project
2. Click **Variables** tab
3. Click **New Variable**
4. Enter `Key` and `Value`
5. Click **Add**

### **Important for Production:**

- Use `SUPABASE_SERVICE_ROLE_KEY` (not `SUPABASE_KEY`) for admin operations
- Store keypairs as JSON arrays, not file paths
- Set `SOLANA_RPC_URL` to a reliable RPC (QuickNode, Alchemy, etc.)

---

## 🔒 Security Best Practices

### ✅ DO:
- Store all secrets in environment variables
- Use different keys for dev/staging/production
- Rotate keys regularly (every 3-6 months)
- Use service role key for backend, anon key for frontend
- Enable RLS (Row Level Security) in Supabase

### ❌ DON'T:
- Commit .env files to Git
- Hardcode API keys in source code
- Share keys in Slack/Discord/Email
- Use production keys in local development
- Store private keys in public repositories

---

## 🆘 Troubleshooting

### **Error: "SUPABASE_KEY not set"**
```bash
# Check if env var is loaded:
echo $SUPABASE_KEY  # Linux/Mac
echo %SUPABASE_KEY%  # Windows CMD
echo $env:SUPABASE_KEY  # Windows PowerShell

# If empty, load .env file or set manually:
export SUPABASE_KEY=your_key_here  # Linux/Mac
$env:SUPABASE_KEY="your_key_here"  # PowerShell
```

### **Error: "Keypair not found"**
```bash
# Check file exists:
ls payer-keypair.json

# Check path in env var:
echo $SOLANA_PAYER_KEYPAIR_PATH

# For production (Render/Railway), use JSON content, not path:
SOLANA_PAYER_KEYPAIR=[1,2,3,...,255]
```

### **Error: "Database connection failed"**
```bash
# Verify Supabase credentials:
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your_key_here"

# Should return: {"message": "Welcome to PostgREST"}
```

---

## 📞 Need Help?

- Check [Supabase Docs](https://supabase.com/docs)
- Check [Solana Docs](https://docs.solana.com/)
- Check [Render Docs](https://render.com/docs)
- Check [Railway Docs](https://docs.railway.app/)

---

**Last Updated:** 2025-11-16

