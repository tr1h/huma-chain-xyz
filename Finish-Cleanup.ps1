# Завершение реорганизации проекта
Write-Host "══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🧹 ЗАВЕРШЕНИЕ РЕОРГАНИЗАЦИИ - ДОКУМЕНТЫ" -ForegroundColor Cyan
Write-Host "══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\goooog"

# Убедимся что папки существуют
New-Item -ItemType Directory -Path ".docs" -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -ItemType Directory -Path ".archive" -Force -ErrorAction SilentlyContinue | Out-Null

Write-Host "[1/2] Перемещение АКТУАЛЬНЫХ документов в .docs..." -ForegroundColor Yellow

$docsFiles = @(
    "SECURITY*.md",
    "SOLANA_GRANT*.md",
    "HONEST_PROJECT*.md",
    "MAINNET*.md",
    "LEGAL*.md",
    "PROJECT*.md",
    "BACKUP*.md",
    "COMPLETE_BACKUP*.md",
    "TODAY_ACHIEVEMENTS*.md",
    "DEPLOY_INSTRUCTIONS.md",
    "CLEAN_URLS*.md",
    "ALL_FIXES*.md",
    "*_FIX_SUMMARY*.md",
    "*_FIXES_SUMMARY*.md",
    "FIX_*.md",
    "GITHUB_PAGES*.md",
    "NFT_*.md",
    "REFERRAL*.md",
    "SCREENSHOTS*.md",
    "SEC_*.md",
    "WHITEPAPER_*.md",
    "FINAL_WHITEPAPER*.md",
    "CONTENT_PLAN.md",
    "NEXT_STEPS*.md",
    "CURRENT_TASKS*.md",
    "BALANCING*.md",
    "MINI_GAMES*.md",
    "CREATIVE_MINI*.md",
    "NEW_MINI*.md",
    "IMAGE_*.md",
    "COINGECKO*.md",
    "REORGANIZE*.md"
)

$movedCount = 0
foreach ($pattern in $docsFiles) {
    Get-ChildItem -Path "." -Filter $pattern -File -ErrorAction SilentlyContinue | ForEach-Object {
        try {
            Move-Item -Path $_.FullName -Destination ".docs\" -Force -ErrorAction Stop
            $movedCount++
        } catch {
            # Ignore errors
        }
    }
}

Write-Host "✓ Перемещено $movedCount файлов в .docs\" -ForegroundColor Green

Write-Host ""
Write-Host "[2/2] Перемещение СТАРЫХ документов в .archive..." -ForegroundColor Yellow

$archiveFiles = @(
    "TELEGRAM_*.md",
    "SOLANA_HACKATHON*.md",
    "HONEST_CHANCES*.md",
    "HONEST_ASSESSMENT*.md",
    "DEPLOY_WHITEPAPER*.md"
)

$archivedCount = 0
foreach ($pattern in $archiveFiles) {
    Get-ChildItem -Path "." -Filter $pattern -File -ErrorAction SilentlyContinue | ForEach-Object {
        try {
            Move-Item -Path $_.FullName -Destination ".archive\" -Force -ErrorAction Stop
            $archivedCount++
        } catch {
            # Ignore errors
        }
    }
}

Write-Host "✓ Перемещено $archivedCount файлов в .archive\" -ForegroundColor Green

Write-Host ""
Write-Host "══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " ✓ РЕОРГАНИЗАЦИЯ ЗАВЕРШЕНА!" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Подсчет файлов
$rootMd = (Get-ChildItem -Path "." -Filter "*.md" -File | Measure-Object).Count
$docsMd = (Get-ChildItem -Path ".docs" -Filter "*.md" -File -ErrorAction SilentlyContinue | Measure-Object).Count
$archiveMd = (Get-ChildItem -Path ".archive" -Filter "*.md" -File -ErrorAction SilentlyContinue | Measure-Object).Count
$adminHtml = (Get-ChildItem -Path "admin" -Filter "*.html" -File -ErrorAction SilentlyContinue | Measure-Object).Count
$scriptsBat = (Get-ChildItem -Path "scripts" -Filter "*.bat" -File -ErrorAction SilentlyContinue | Measure-Object).Count

Write-Host " 📁 Файлов .md в КОРНЕ: $rootMd" -ForegroundColor $(if ($rootMd -lt 5) {"Green"} else {"Yellow"})
Write-Host " 📚 Файлов .md в .docs\: $docsMd" -ForegroundColor Cyan
Write-Host " 📦 Файлов .md в .archive\: $archiveMd" -ForegroundColor Cyan
Write-Host " 👤 Файлов .html в admin\: $adminHtml" -ForegroundColor Cyan
Write-Host " 📜 Файлов .bat в scripts\: $scriptsBat" -ForegroundColor Cyan
Write-Host ""
Write-Host "══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Read-Host "Нажми Enter для закрытия"

