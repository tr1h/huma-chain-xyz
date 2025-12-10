# Repository Reorganization Script
# Moves files to new organized structure

Write-Host "🚀 Starting repository reorganization..." -ForegroundColor Green

# Function to move file if it exists
function Move-IfExists {
    param($Source, $Destination)
    if (Test-Path $Source) {
        Write-Host "Moving $Source → $Destination" -ForegroundColor Cyan
        Move-Item -Path $Source -Destination $Destination -Force
    }
}

# === DOCUMENTATION FILES ===

# → docs/guides/
Write-Host "`n📚 Moving guides..." -ForegroundColor Yellow
Move-IfExists "QUICK_START_DEV.md" "docs\guides\"
Move-IfExists "SETUP_GAME_ALERTS.md" "docs\guides\"
Move-IfExists "DEV_MODE_SETUP.md" "docs\guides\"
Move-IfExists "SECURITY_SETUP.md" "docs\guides\"
Move-IfExists "GAME_INTEGRATION_GUIDE.md" "docs\guides\"
Move-IfExists "STORAGE_EXPLAINED.md" "docs\guides\"
Move-IfExists "CREATE_GITHUB_TOKEN_GUIDE.md" "docs\guides\"
Move-IfExists "CURSOR_EXTENSIONS_GUIDE.md" "docs\guides\"
Move-IfExists "SETUP_GIT_FOR_AI.md" "docs\guides\"
Move-IfExists "TELEGRAM_WALLET_LINKING_EXPLAINED.md" "docs\guides\"
Move-IfExists "ACCOUNT_LINKING_PLAN.md" "docs\guides\"
Move-IfExists "LEGAL_CONSIDERATIONS.md" "docs\guides\"
Move-IfExists "QUICK_SCREENSHOTS_GUIDE.md" "docs\guides\"

# → docs/reports/
Write-Host "`n📊 Moving reports..." -ForegroundColor Yellow
Move-IfExists "ANALYTICS_REPORT.md" "docs\reports\"
Move-IfExists "TRANSACTION_AUDIT_REPORT.md" "docs\reports\"
Move-IfExists "TREASURY_MONITOR_REPORT.md" "docs\reports\"
Move-IfExists "BALANCE_SYNC.md" "docs\reports\"
Move-IfExists "SLOTS_PROBABILITY_ANALYSIS.md" "docs\reports\"
Move-IfExists "FINAL_ONCHAIN_REPORT.md" "docs\reports\"
Move-IfExists "SESSION_COMPLETE_SUMMARY.md" "docs\reports\"

# → docs/admin/
Write-Host "`n🔐 Moving admin docs..." -ForegroundColor Yellow
Move-IfExists "ADMIN_FINAL_SUMMARY.md" "docs\admin\"
Move-IfExists "ADMIN_PANELS_ANALYSIS.md" "docs\admin\"
Move-IfExists "ADMIN_PASSWORD_INFO.md" "docs\admin\"
Move-IfExists "ADMIN_UPGRADE_GUIDE.md" "docs\admin\"
Move-IfExists "admin-tokenomics-notes.md" "docs\admin\"

# → docs/colosseum/
Write-Host "`n🏆 Moving Colosseum materials..." -ForegroundColor Yellow
Move-IfExists "COLOSSEUM_HACKATHON_SUBMISSION.md" "docs\colosseum\"
Move-IfExists "COLOSSEUM_PRESENTATION.md" "docs\colosseum\"
Move-IfExists "COLOSSEUM_2DAY_PLAN.md" "docs\colosseum\"
Move-IfExists "COLOSSEUM_FORM_TEXTS.txt" "docs\colosseum\"
Move-IfExists "COLOSSEUM_VIDEO_SCRIPT.md" "docs\colosseum\"

# → docs/video/
Write-Host "`n🎬 Moving video scripts..." -ForegroundColor Yellow
Move-IfExists "VIDEO_RECORDING_SCENARIO.md" "docs\video\"
Move-IfExists "VIDEO_SCRIPT_ENGLISH_VOICEOVER.txt" "docs\video\"
Move-IfExists "VIDEO_SCRIPT_RUSSIAN_VOICEOVER.txt" "docs\video\"
Move-IfExists "VIDEO_SCRIPT_SIMPLE.txt" "docs\video\"
Move-IfExists "VIDEO_SCRIPTS_FULL_BOTH.txt" "docs\video\"
Move-IfExists "FINAL_VIDEO_METRICS.txt" "docs\video\"

# → docs/sora2/
Write-Host "`n🎨 Moving AI prompts..." -ForegroundColor Yellow
Move-IfExists "SORA2_PROMPT.md" "docs\sora2\"
Move-IfExists "SORA2_PROMPTS.md" "docs\sora2\"
Move-IfExists "SORA2_SLOTS_ONLY.md" "docs\sora2\"
Move-IfExists "MIDJOURNEY_PROMPT_SHORT.md" "docs\sora2\"

# → docs/features/
Write-Host "`n⚙️ Moving feature docs..." -ForegroundColor Yellow
Move-IfExists "JACKPOT_MECHANICS_EXPLAINED.md" "docs\features\"
Move-IfExists "JACKPOT_ALERTS_SETUP.md" "docs\features\"
Move-IfExists "JACKPOT_TROUBLESHOOTING.md" "docs\features\"
Move-IfExists "MULTIPLAYER_SLOTS_IDEAS.md" "docs\features\"
Move-IfExists "MARKETPLACE_IMPROVEMENT_PLAN.md" "docs\features\"
Move-IfExists "WHEEL_IMPROVEMENTS.md" "docs\features\"
Move-IfExists "SLOTS_ALERTS_FIX.md" "docs\features\"
Move-IfExists "SLOTS_JACKPOT_IMPLEMENTATION.md" "docs\features\"
Move-IfExists "SLOTS_SETUP.md" "docs\features\"
Move-IfExists "SLOTS_UPDATE_V2.md" "docs\features\"
Move-IfExists "SKIN_CONCEPTS.md" "docs\features\"
Move-IfExists "SKINS_VECTOR_GRAPHICS_GUIDE.md" "docs\features\"
Move-IfExists "ONCHAIN_INTEGRATION_IMPROVEMENTS.md" "docs\features\"
Move-IfExists "QUICK_FIX_BALANCE.md" "docs\features\"
Move-IfExists "TWITTER_POSTS_READY.md" "docs\features\"
Move-IfExists "X_POST.md" "docs\features\"
Move-IfExists "NEW_CHAT_PROMPT.md" "docs\features\"

# === ADMIN PANELS ===
Write-Host "`n🔧 Moving admin panels..." -ForegroundColor Yellow
Move-IfExists "admin-dashboard.html" "admin\"
Move-IfExists "admin-auth.html" "admin\"
Move-IfExists "admin-nft-tiers.html" "admin\"
Move-IfExists "admin-referrals.html" "admin\"
Move-IfExists "admin-skins-manager.html" "admin\"
Move-IfExists "admin-table.html" "admin\"
Move-IfExists "admin-tokenomics.html" "admin\"
Move-IfExists "blog-admin.html" "admin\"

# === ARCHIVED FILES ===

# → archived/old-html/
Write-Host "`n📦 Archiving old HTML..." -ForegroundColor Yellow
Move-IfExists "super-admin-backup-OLD.html" "archived\old-html\"
Move-IfExists "super-admin-enhanced-sections.html" "archived\old-html\"
Move-IfExists "super-admin-improved.html" "archived\old-html\"
Move-IfExists "treasury-monitor-backup-OLD.html" "archived\old-html\"
Move-IfExists "profile-old-backup.html" "archived\old-html\"
Move-IfExists "profile-enhanced.html" "archived\old-html\"
Move-IfExists "skins-improved-xmas.html" "archived\old-html\"
Move-IfExists "skins-visual-demo.html" "archived\old-html\"
Move-IfExists "skin-preview.html" "archived\old-html\"
Move-IfExists "daily-rewards.html" "archived\old-html\"
Move-IfExists "test-api.html" "archived\old-html\"
Move-IfExists "api-demo.html" "archived\old-html\"
Move-IfExists "s.html" "archived\old-html\"
Move-IfExists "colosseum-presentation.html" "archived\old-html\"
Move-IfExists "nft-mint.html" "archived\old-html\"

# → archived/old-scripts/
Write-Host "`n📜 Archiving old scripts..." -ForegroundColor Yellow
Move-IfExists "MOVE_DOCS_TO_FOLDERS.bat" "archived\old-scripts\"
Move-IfExists "CHECK_GIT_CONFIG.bat" "archived\old-scripts\"
Move-IfExists "FINISH_CLEANUP.bat" "archived\old-scripts\"
Move-IfExists "Finish-Cleanup.ps1" "archived\old-scripts\"
Move-IfExists "Get-GitInfo.ps1" "archived\old-scripts\"
Move-IfExists "install-extra-extensions.ps1" "archived\old-scripts\"
Move-IfExists "INSTALL_EXTENSIONS.ps1" "archived\old-scripts\"

# → archived/old-docs/
Write-Host "`n📄 Archiving old docs..." -ForegroundColor Yellow
Move-IfExists "GIT_COMMANDS_TO_COPY.txt" "archived\old-docs\"
Move-IfExists "GENPLAN_ANDREEVSKOE.md" "archived\old-docs\"
Move-IfExists "START_HERE.md" "archived\old-docs\"

# === SQL FILES ===
Write-Host "`n💾 Moving SQL files..." -ForegroundColor Yellow
if (-not (Test-Path "sql")) {
    New-Item -ItemType Directory -Path "sql" -Force | Out-Null
}
Move-IfExists "ADD_USER_BALANCE.sql" "sql\"
Move-IfExists "FIX_BALANCE_SYNC.sql" "sql\"

Write-Host "`n✅ Reorganization complete!" -ForegroundColor Green
Write-Host "📁 New structure created in:" -ForegroundColor Cyan
Write-Host "   - docs/ (documentation)" -ForegroundColor White
Write-Host "   - admin/ (admin panels)" -ForegroundColor White
Write-Host "   - archived/ (old files)" -ForegroundColor White
Write-Host "   - sql/ (database scripts)" -ForegroundColor White
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "   1. Review moved files" -ForegroundColor White
Write-Host "   2. Run: git add ." -ForegroundColor White
Write-Host "   3. Run: git commit -m Reorganize-repository-structure" -ForegroundColor White
Write-Host "   4. Run: git push" -ForegroundColor White

