# Automatic Git Push Script
# Usage: .\auto-push.ps1 "commit message"

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "Update files"
)

Set-Location "C:\goooog"

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🚀 AUTOMATIC GIT PUSH" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check status
Write-Host "[1/4] Checking status..." -ForegroundColor Yellow
$status = git status --short
if (-not $status) {
    Write-Host "✅ Working tree clean - nothing to push!" -ForegroundColor Green
    exit 0
}
Write-Host $status
Write-Host ""

# Add files
Write-Host "[2/4] Adding files..." -ForegroundColor Yellow
git add -A
Write-Host "✅ Files added" -ForegroundColor Green
Write-Host ""

# Commit
Write-Host "[3/4] Creating commit..." -ForegroundColor Yellow
git commit -m $Message
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit created: $Message" -ForegroundColor Green
} else {
    Write-Host "❌ Commit failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Push
Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════" -ForegroundColor Green
    Write-Host " ✅ SUCCESSFULLY PUSHED TO GITHUB!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "Check: https://github.com/tr1h/huma-chain-xyz" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════" -ForegroundColor Red
    Write-Host " ❌ PUSH FAILED!" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════" -ForegroundColor Red
    exit 1
}


