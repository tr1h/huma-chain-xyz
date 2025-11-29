# Test Git Connection with new token
Set-Location "C:\goooog"

Write-Host "Testing Git connection with new token..." -ForegroundColor Cyan
Write-Host ""

# Test remote
Write-Host "[1] Remote URL:" -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "[2] Git Status:" -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "[3] Testing fetch:" -ForegroundColor Yellow
git fetch --dry-run

Write-Host ""
Write-Host "[4] Last commit:" -ForegroundColor Yellow
git log -1 --oneline

Write-Host ""
Write-Host "✅ Connection test complete!" -ForegroundColor Green


