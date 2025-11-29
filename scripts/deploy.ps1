Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOYING WHITEPAPER TO GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location C:\goooog

Write-Host "[1/4] Adding whitepaper.html..." -ForegroundColor Yellow
$addOutput = git add whitepaper.html 2>&1
Write-Host $addOutput

Write-Host ""
Write-Host "[2/4] Checking status..." -ForegroundColor Yellow
$statusOutput = git status --short 2>&1
Write-Host $statusOutput

Write-Host ""
Write-Host "[3/4] Committing..." -ForegroundColor Yellow
$commitOutput = git commit -m "Deploy whitepaper - Professional enterprise version" 2>&1
Write-Host $commitOutput

Write-Host ""
Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Yellow
$pushOutput = git push origin main 2>&1
Write-Host $pushOutput

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Check GitHub in 30 seconds:" -ForegroundColor White
Write-Host "https://github.com/tr1h/huma-chain-xyz" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check website in 2-5 minutes:" -ForegroundColor White
Write-Host "https://solanatamagotchi.com/whitepaper.html" -ForegroundColor Cyan
Write-Host ""

