# VESTING SETUP SCRIPT - Standardniy variant (4 goda, cliff 6 mes)
# Dlya Windows PowerShell

Write-Host "VESTING SETUP - Standardniy variant" -ForegroundColor Cyan
Write-Host "Srok: 4 goda, Cliff: 6 mesyatsev" -ForegroundColor Yellow
Write-Host ""

# Proverka Node.js
Write-Host "Proverka Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "Node.js ustanovlen: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js ne ustanovlen! Ustanovi Node.js: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Informaciya o Streamflow
Write-Host "Streamflow Vesting..." -ForegroundColor Cyan
Write-Host "Streamflow CLI nedostupen v npm" -ForegroundColor Yellow
Write-Host "Ispolzuy web-interfeys: https://streamflow.finance" -ForegroundColor Green
Write-Host "ili SDK: npm install @streamflow/stream" -ForegroundColor Green
Write-Host ""

# Parametry vesting
$cluster = "devnet"
$token = "Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY"
$amount = 200000000
$recipient = "AQr5BM4FUKumKwdcNMWM1FPVx6qLWssp55HqH4SkWXVR"
$keypair = "C:\goooog\team-wallet-keypair.json"

# Vychislenie vremeni
$startTime = [int][double]::Parse((Get-Date -UFormat %s))
$endTime = $startTime + 126144000
$cliffTime = $startTime + 15552000

Write-Host ""
Write-Host "Parametry vesting:" -ForegroundColor Cyan
Write-Host "  Cluster: $cluster" -ForegroundColor White
Write-Host "  Token: $token" -ForegroundColor White
Write-Host "  Amount: $amount TAMA (200M)" -ForegroundColor White
Write-Host "  Recipient: $recipient" -ForegroundColor White
$startDate = (Get-Date "1970-01-01 00:00:00").AddSeconds($startTime)
$endDate = (Get-Date "1970-01-01 00:00:00").AddSeconds($endTime)
$cliffDate = (Get-Date "1970-01-01 00:00:00").AddSeconds($cliffTime)
Write-Host "  Start time: $($startDate.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
Write-Host "  End time: $($endDate.ToString('yyyy-MM-dd HH:mm:ss')) (+4 goda)" -ForegroundColor White
Write-Host "  Cliff time: $($cliffDate.ToString('yyyy-MM-dd HH:mm:ss')) (+6 mesyatsev)" -ForegroundColor White
Write-Host "  Cancelable: false" -ForegroundColor White
Write-Host ""

# Podtverzhdenie
$confirm = Read-Host "Prodolzhit sozdanie vesting stream? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Otkazano polzovatelem" -ForegroundColor Red
    exit 0
}

# Proverka keypair
if (-not (Test-Path $keypair)) {
    Write-Host "Keypair fayl ne nayden: $keypair" -ForegroundColor Red
    Write-Host "Sozday keypair ili ukazhi pravilnyy put!" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Sozdanie vesting stream cherez web-interfeys..." -ForegroundColor Cyan
Write-Host ""

# Otkryt web-interfeys Streamflow
$streamflowUrl = "https://streamflow.finance"
Write-Host "Parametry dlya vvoda v Streamflow:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Cluster: $cluster" -ForegroundColor White
Write-Host "  Token Address: $token" -ForegroundColor White
Write-Host "  Amount: $amount TAMA (200,000,000)" -ForegroundColor White
Write-Host "  Recipient: $recipient" -ForegroundColor White
Write-Host "  Start Time: $($startDate.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
Write-Host "  End Time: $($endDate.ToString('yyyy-MM-dd HH:mm:ss')) (+4 goda)" -ForegroundColor White
Write-Host "  Cliff Time: $($cliffDate.ToString('yyyy-MM-dd HH:mm:ss')) (+6 mesyatsev)" -ForegroundColor White
Write-Host "  Cancelable: false" -ForegroundColor White
Write-Host ""

# Popytka otkryt brauzer
try {
    Start-Process $streamflowUrl
    Write-Host "Otkryt web-interfeys Streamflow v brauzere" -ForegroundColor Green
} catch {
    Write-Host "Ne udalos otkryt brauzer avtomaticheski" -ForegroundColor Yellow
    Write-Host "Otkroy vruchnuyu: $streamflowUrl" -ForegroundColor White
}

Write-Host ""
Write-Host "Instruktsii:" -ForegroundColor Cyan
Write-Host "  1. Podklyuchi koshelyok v Streamflow" -ForegroundColor White
Write-Host "  2. Vyberi 'Create Stream'" -ForegroundColor White
Write-Host "  3. Vvedi parametry vyshe" -ForegroundColor White
Write-Host "  4. Podtverdi transaktsiyu" -ForegroundColor White
Write-Host ""
Write-Host "Alternativa: Ispolzuy SDK" -ForegroundColor Cyan
Write-Host "  npm install @streamflow/stream" -ForegroundColor White
Write-Host "  Sm. dokumentatsiyu: https://docs.streamflow.finance" -ForegroundColor White
Write-Host ""
