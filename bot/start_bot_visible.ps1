# Start Gotchi Game Bot in VISIBLE window (to see console output)

Write-Host "Starting Gotchi Game Bot in VISIBLE mode..." -ForegroundColor Green

# Set environment variables
$env:TELEGRAM_BOT_TOKEN = "8445221254:AAHxX7NCDv3K14LTnAQkM69Lg4QCckFh-E8"
$env:BOT_USERNAME = "GotchiGameBot"
$env:TAMA_MINT_ADDRESS = "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY"
$env:SOLANA_RPC_URL = "https://api.devnet.solana.com"
$env:SOLANA_PAYER_KEYPAIR_PATH = "C:\goooog\payer-keypair.json"
$env:SOLANA_MINT_KEYPAIR_PATH = "C:\goooog\payer-keypair.json"

# Supabase credentials
$env:SUPABASE_URL = "https://zfrazyupameidxpjihrh.supabase.co"
$env:SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU"

Write-Host "Environment variables set:" -ForegroundColor Yellow
Write-Host "  BOT_USERNAME: $env:BOT_USERNAME"
Write-Host "  TAMA_MINT_ADDRESS: $env:TAMA_MINT_ADDRESS"
Write-Host "  SOLANA_RPC_URL: $env:SOLANA_RPC_URL"
Write-Host ""
Write-Host "Starting bot.py in VISIBLE window..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the bot" -ForegroundColor Yellow
Write-Host ""

# Navigate to bot directory
Set-Location $PSScriptRoot

# Start bot in VISIBLE window (not hidden)
python bot.py

