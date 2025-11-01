# Start Gotchi Game Bot with all required environment variables

Write-Host "Starting Gotchi Game Bot..." -ForegroundColor Green

# Set environment variables
$env:TELEGRAM_BOT_TOKEN = "8445221254:AAHxX7NCDv3K14LTnAQkM69Lg4QCckFh-E8"
$env:BOT_USERNAME = "GotchiGameBot"
$env:TAMA_MINT_ADDRESS = "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY"
$env:SOLANA_RPC_URL = "https://api.devnet.solana.com"
$env:SOLANA_PAYER_KEYPAIR_PATH = "C:\goooog\payer-keypair.json"
$env:SOLANA_MINT_KEYPAIR_PATH = "C:\goooog\payer-keypair.json"

# Supabase credentials (укажи свои!)
$env:SUPABASE_URL = "YOUR_SUPABASE_URL"
$env:SUPABASE_KEY = "YOUR_SUPABASE_KEY"

Write-Host "Environment variables set:" -ForegroundColor Yellow
Write-Host "  BOT_USERNAME: $env:BOT_USERNAME"
Write-Host "  TAMA_MINT_ADDRESS: $env:TAMA_MINT_ADDRESS"
Write-Host "  SOLANA_RPC_URL: $env:SOLANA_RPC_URL"
Write-Host ""

# Navigate to bot directory
Set-Location $PSScriptRoot

# Start bot
Write-Host "Starting bot.py..." -ForegroundColor Green
python bot.py

