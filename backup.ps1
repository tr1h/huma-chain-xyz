# ============================================
# Полный бекап проекта Huma Chain XYZ
# ============================================

# Цвета для вывода
$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Reset = "`e[0m"

Write-Host "Starting backup..." -ForegroundColor Green

# 1. Создать папку для бекапа с датой
$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$backupDir = "C:\backup\huma-chain-xyz_$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Write-Host "Created folder: $backupDir" -ForegroundColor Yellow

# 2. Скопировать весь код проекта
Write-Host "Copying project code..." -ForegroundColor Yellow
$sourceDir = "C:\goooog"
$destDir = "$backupDir\code"

# Исключаем ненужные папки и файлы
$excludeDirs = @(
    "node_modules",
    "__pycache__",
    ".git",
    ".venv",
    "venv",
    ".env",
    "*.log",
    "*.pyc",
    "*.pyo",
    ".DS_Store",
    "Thumbs.db"
)

# Создать папку назначения
New-Item -ItemType Directory -Path $destDir -Force | Out-Null

# Копировать файлы с исключениями (используем robocopy для надежности)
robocopy $sourceDir $destDir /E /XD node_modules __pycache__ .git .venv venv /XF *.log *.pyc *.pyo .DS_Store Thumbs.db .env /NFL /NDL /NJH /NJS

Write-Host "Code copied successfully" -ForegroundColor Green

# 3. Сохранить информацию о проекте
Write-Host "Creating info file..." -ForegroundColor Yellow

# Создать файл с информацией построчно
$infoFile = "$backupDir\BACKUP_INFO.txt"
$dateStr = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

$lines = @(
    "============================================",
    "BACKUP PROJECT HUMA CHAIN XYZ",
    "Date: $dateStr",
    "============================================",
    "",
    "CODE PROJECT:",
    "Local folder: C:\goooog",
    "Copied to: $destDir",
    "",
    "DATABASE (Supabase):",
    "URL: https://zfrazyupameidxpjihrh.supabase.co",
    "Type: PostgreSQL",
    "How to backup:",
    "  1. Open https://supabase.com/dashboard",
    "  2. Select project: zfrazyupameidxpjihrh",
    "  3. Settings -> Database -> Backups",
    "  4. Create backup or download SQL dump",
    "",
    "ENVIRONMENT VARIABLES (IMPORTANT!):",
    "Save manually to env_backup.txt:",
    "  TELEGRAM_BOT_TOKEN",
    "  SUPABASE_KEY",
    "  SOLANA_PAYER_KEYPAIR",
    "  SOLANA_P2E_POOL_KEYPAIR",
    "  TAMA_MINT_ADDRESS",
    "  SOLANA_RPC_URL",
    "  SUPABASE_URL",
    "",
    "These variables are on:",
    "  Render Dashboard -> Environment Variables",
    "  Railway Dashboard -> Environment Variables (if used)",
    "",
    "KEYPAIRS (if exists locally):",
    "  payer-keypair.json",
    "  p2e-pool-keypair.json",
    "",
    "WARNING: DO NOT commit env_backup.txt to Git!",
    "",
    "DEPLOYMENT:",
    "  API: https://huma-chain-xyz.onrender.com",
    "  Bot: https://huma-chain-xyz-bot.onrender.com",
    "  GitHub: https://github.com/tr1h/huma-chain-xyz",
    "",
    "============================================"
)

$lines | Out-File -FilePath $infoFile -Encoding UTF8

Write-Host "Info file created" -ForegroundColor Green

# 4. Попытаться скопировать keypairs (если есть)
Write-Host "Checking keypairs..." -ForegroundColor Yellow

$keypairsDir = "$backupDir\keypairs"
New-Item -ItemType Directory -Path $keypairsDir -Force | Out-Null

$keypairFiles = @(
    "C:\goooog\payer-keypair.json",
    "C:\goooog\p2e-pool-keypair.json"
)

foreach ($file in $keypairFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination $keypairsDir -Force
        Write-Host "Copied: $(Split-Path $file -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "Not found: $(Split-Path $file -Leaf)" -ForegroundColor Yellow
    }
}

# 5. Создать архив (опционально)
Write-Host "Creating ZIP archive..." -ForegroundColor Yellow
$zipFile = "C:\backup\huma-chain-xyz_$timestamp.zip"

# Использовать Compress-Archive
Compress-Archive -Path $backupDir -DestinationPath $zipFile -Force

Write-Host "ZIP archive created: $zipFile" -ForegroundColor Green

# 6. Итоговая информация
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "BACKUP COMPLETED!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backup folder: $backupDir"
Write-Host "ZIP archive: $zipFile"
Write-Host ""
Write-Host "REMEMBER:" -ForegroundColor Yellow
Write-Host "1. Backup database via Supabase Dashboard"
Write-Host "2. Save Environment Variables to env_backup.txt"
Write-Host ""
Write-Host "Done!" -ForegroundColor Green

