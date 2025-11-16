# Start PHP API Server for TAMA Token
# ============================================
# 🔒 SECURITY: Load credentials from .env file
# ============================================
# NEVER commit API keys to Git!
# Create a .env file in the project root with:
#   SUPABASE_URL=https://...
#   SUPABASE_KEY=eyJhbGci...
#   TAMA_MINT_ADDRESS=Fuqw8...
#   SOLANA_PAYER_KEYPAIR_PATH=C:\goooog\payer-keypair.json

Write-Host "Starting PHP API Server..." -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "  🔒 SECURITY NOTICE" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "Environment variables should be set in .env file or system environment!" -ForegroundColor Yellow
Write-Host ""

# Check if .env file exists
$envFile = Join-Path $PSScriptRoot "..\..env"
if (Test-Path $envFile) {
    Write-Host "✅ Loading environment variables from .env file..." -ForegroundColor Green
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)\s*=\s*(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
            Write-Host "  Loaded: $name" -ForegroundColor Cyan
        }
    }
    Write-Host ""
} else {
    Write-Host "⚠️  WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "  Create .env file in project root with required variables" -ForegroundColor Yellow
    Write-Host "  Example:" -ForegroundColor Gray
    Write-Host "    SUPABASE_URL=https://..." -ForegroundColor Gray
    Write-Host "    SUPABASE_KEY=eyJhbGci..." -ForegroundColor Gray
    Write-Host "    TAMA_MINT_ADDRESS=Fuqw8..." -ForegroundColor Gray
    Write-Host ""
}

# Validate critical environment variables
$requiredVars = @(
    "SUPABASE_URL",
    "SUPABASE_KEY",
    "TAMA_MINT_ADDRESS",
    "SOLANA_PAYER_KEYPAIR_PATH",
    "SOLANA_P2E_POOL_KEYPAIR_PATH"
)

$missing = @()
foreach ($var in $requiredVars) {
    if (-not (Test-Path "env:$var")) {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host "❌ ERROR: Missing required environment variables:" -ForegroundColor Red
    foreach ($var in $missing) {
        Write-Host "  - $var" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please set these in your .env file or system environment." -ForegroundColor Yellow
    exit 1
}

# Set default values for optional variables
if (-not (Test-Path "env:SOLANA_RPC_URL")) {
    $env:SOLANA_RPC_URL = "https://api.devnet.solana.com"
}

Write-Host "Environment variables set:" -ForegroundColor Yellow
Write-Host "  SUPABASE_URL: $env:SUPABASE_URL"
Write-Host "  TAMA_MINT_ADDRESS: $env:TAMA_MINT_ADDRESS"
Write-Host "  SOLANA_RPC_URL: $env:SOLANA_RPC_URL"
Write-Host "  SOLANA_PAYER_KEYPAIR_PATH: $env:SOLANA_PAYER_KEYPAIR_PATH"
Write-Host "  SOLANA_MINT_KEYPAIR_PATH: $env:SOLANA_MINT_KEYPAIR_PATH"
Write-Host "  SOLANA_P2E_POOL_KEYPAIR_PATH: $env:SOLANA_P2E_POOL_KEYPAIR_PATH"
Write-Host ""
Write-Host "Withdrawals will use P2E Pool (HPQf1MG8e41MoMayD8iqFmadqZ2NteScx4dQuwc1fCQw)" -ForegroundColor Cyan
Write-Host ""

# Navigate to API directory
Set-Location $PSScriptRoot

# Check if PHP is installed (try full path first, then PATH)
$phpPath = "C:\xampp\php\php.exe"
if (-not (Test-Path $phpPath)) {
    $phpPath = "php"
}

$phpVersion = & $phpPath -v 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: PHP is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install PHP or add it to PATH" -ForegroundColor Yellow
    exit 1
}

Write-Host "PHP Version:" -ForegroundColor Cyan
& $phpPath -v | Select-Object -First 1

Write-Host ""
# Определить host для сервера
# Для локальной разработки: localhost
# Для доступа извне (если нужно): 0.0.0.0
$apiHost = $env:API_HOST
if (-not $apiHost) {
    $apiHost = "localhost"  # По умолчанию localhost для безопасности
}

Write-Host "Starting PHP built-in server on http://${apiHost}:8002" -ForegroundColor Green
Write-Host "API will be available at: http://${apiHost}:8002/api/tama" -ForegroundColor Cyan
if ($apiHost -eq "localhost") {
    Write-Host "Note: localhost means API is only accessible from this machine" -ForegroundColor Yellow
    Write-Host "      To allow external access, set API_HOST=0.0.0.0" -ForegroundColor Yellow
}
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start PHP server with router
& $phpPath -S ${apiHost}:8002 router.php

