# 🚀 Deploy Bot to Fly.io

## Prerequisites

1. **Install Fly CLI:**
   - Windows: `powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"`
   - Mac/Linux: `curl -L https://fly.io/install.sh | sh`

2. **Sign up / Login:**
   ```bash
   fly auth signup  # or fly auth login
   ```

---

## Deploy Steps

### 1. Navigate to bot directory
```bash
cd bot
```

### 2. Launch the app (first time)
```bash
fly launch --no-deploy
```

**Choose:**
- App name: `huma-chain-xyz-bot` (or your preference)
- Region: Amsterdam (ams) or closest to you
- PostgreSQL: **No** (we use Supabase)
- Redis: **No**

### 3. Set secret environment variables
```bash
fly secrets set TELEGRAM_BOT_TOKEN="your_token_from_BotFather"
fly secrets set SUPABASE_KEY="your_supabase_anon_key"
```

### 4. Deploy!
```bash
fly deploy
```

### 5. Check logs
```bash
fly logs
```

Expected output:
```
✅ Supabase connected (attempt 1)
✅ Set global menu button to: ...
✅ Bot started!
```

---

## Manage Bot

**View status:**
```bash
fly status
```

**View logs (live):**
```bash
fly logs -f
```

**Restart bot:**
```bash
fly apps restart huma-chain-xyz-bot
```

**Stop bot:**
```bash
fly scale count 0
```

**Start bot:**
```bash
fly scale count 1
```

**SSH into container:**
```bash
fly ssh console
```

---

## Update Bot

After code changes:

```bash
cd bot
git pull  # or make changes locally
fly deploy
```

---

## Free Tier Limits

- ✅ 3 shared-cpu-1x VMs (256MB RAM each)
- ✅ 3GB persistent storage
- ✅ 160GB outbound transfer/month
- ✅ Unlimited inbound transfer

**Perfect for Telegram bots!** 🎉

