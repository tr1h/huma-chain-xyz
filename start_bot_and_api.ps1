# Start Bot and API Server together

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Bot + API Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables for Bot
$env:TELEGRAM_BOT_TOKEN = "8445221254:AAE3F6Bha29dS-zzWOmJhz26K9u6lfBUu1g"
$env:BOT_USERNAME = "GotchiGameBot"
$env:TAMA_MINT_ADDRESS = "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY"
$env:SOLANA_RPC_URL = "https://api.devnet.solana.com"
$env:SOLANA_PAYER_KEYPAIR_PATH = "C:\goooog\payer-keypair.json"
$env:SOLANA_MINT_KEYPAIR_PATH = "C:\goooog\payer-keypair.json"

# Supabase credentials
$env:SUPABASE_URL = "https://zfrazyupameidxpjihrh.supabase.co"
$env:SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU"

# Set API base URL
$env:TAMA_API_BASE = "http://localhost:8002/api/tama"

# Set environment variables for API
$env:SUPABASE_DB_HOST = "db.zfrazyupameidxpjihrh.supabase.co"
$env:SUPABASE_DB_PORT = "5432"
$env:SUPABASE_DB_NAME = "postgres"
$env:SUPABASE_DB_USER = "postgres"
$env:SUPABASE_DB_PASSWORD = "YOUR_SUPABASE_DB_PASSWORD"  # ⚠️ НУЖНО УКАЗАТЬ!

Write-Host "Environment variables set" -ForegroundColor Green
Write-Host ""

# Check if PHP is installed
$phpCheck = php -v 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  WARNING: PHP not found!" -ForegroundColor Yellow
    Write-Host "API server will not start. Bot will work without API." -ForegroundColor Yellow
    Write-Host ""
    $startAPI = $false
} else {
    Write-Host "✅ PHP found:" -ForegroundColor Green
    php -v | Select-Object -First 1
    Write-Host ""
    $startAPI = $true
}

# Check if Python is installed
$pythonCheck = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: Python not found!" -ForegroundColor Red
    Write-Host "Bot cannot start without Python!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Python found:" -ForegroundColor Green
python --version
Write-Host ""

# Start API Server in background (if PHP available)
if ($startAPI) {
    Write-Host "🚀 Starting API Server on http://localhost:8002..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "api\start_api.ps1" -WindowStyle Normal
    Start-Sleep -Seconds 3
    Write-Host "✅ API Server started" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⚠️  API Server skipped (PHP not found)" -ForegroundColor Yellow
    Write-Host ""
}

# Start Bot
Write-Host "🤖 Starting Telegram Bot..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "bot\start_bot_visible.ps1" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Both services started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Status:" -ForegroundColor Yellow
if ($startAPI) {
    Write-Host "  ✅ API Server: http://localhost:8002" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  API Server: Not started (PHP not found)" -ForegroundColor Yellow
}
Write-Host "  ✅ Telegram Bot: @GotchiGameBot" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tip: Check the PowerShell windows for logs" -ForegroundColor Cyan

