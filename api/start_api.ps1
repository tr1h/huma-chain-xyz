# Start PHP API Server for TAMA Token

Write-Host "Starting PHP API Server..." -ForegroundColor Green

# Set environment variables for Supabase REST API
$env:SUPABASE_URL = "https://zfrazyupameidxpjihrh.supabase.co"
$env:SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU"

# TAMA Token config
$env:TAMA_MINT_ADDRESS = "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY"

Write-Host "Environment variables set:" -ForegroundColor Yellow
Write-Host "  SUPABASE_URL: $env:SUPABASE_URL"
Write-Host "  TAMA_MINT_ADDRESS: $env:TAMA_MINT_ADDRESS"
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
Write-Host "Starting PHP built-in server on http://localhost:8002" -ForegroundColor Green
Write-Host "API will be available at: http://localhost:8002/api/tama" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start PHP server with router
& $phpPath -S localhost:8002 router.php

