@echo off
chcp 65001
cls
echo ═══════════════════════════════════════════════════════════
echo  🧹 ЗАВЕРШЕНИЕ РЕОРГАНИЗАЦИИ - ДОКУМЕНТЫ
echo ═══════════════════════════════════════════════════════════
echo.
echo  Переместим документы в нужные папки!
echo.
pause

cd /d "C:\goooog"

echo.
echo [1/3] Перемещение АКТУАЛЬНЫХ документов в .docs...

REM Security документы
for %%f in (SECURITY*.md) do move "%%f" ".docs\" >nul 2>&1

REM Grant и важные статусы
for %%f in (SOLANA_GRANT*.md HONEST_PROJECT*.md MAINNET*.md) do move "%%f" ".docs\" >nul 2>&1

REM Legal документы
for %%f in (LEGAL*.md) do move "%%f" ".docs\" >nul 2>&1

REM Project документы
for %%f in (PROJECT*.md) do move "%%f" ".docs\" >nul 2>&1

REM Backup документы
for %%f in (BACKUP*.md COMPLETE_BACKUP*.md) do move "%%f" ".docs\" >nul 2>&1

REM Achievements
for %%f in (TODAY_ACHIEVEMENTS*.md) do move "%%f" ".docs\" >nul 2>&1

REM Deployment
for %%f in (DEPLOY_INSTRUCTIONS.md CLEAN_URLS*.md) do move "%%f" ".docs\" >nul 2>&1

REM Fixes summaries
for %%f in (ALL_FIXES*.md *_FIX_SUMMARY*.md *_FIXES_SUMMARY*.md FIX_*.md) do move "%%f" ".docs\" >nul 2>&1

REM GitHub Pages
for %%f in (GITHUB_PAGES*.md) do move "%%f" ".docs\" >nul 2>&1

REM NFT system
for %%f in (NFT_*.md) do move "%%f" ".docs\" >nul 2>&1

REM Referral
for %%f in (REFERRAL*.md) do move "%%f" ".docs\" >nul 2>&1

REM Screenshots
for %%f in (SCREENSHOTS*.md) do move "%%f" ".docs\" >nul 2>&1

REM SEC compliance
for %%f in (SEC_*.md) do move "%%f" ".docs\" >nul 2>&1

REM Whitepaper related
for %%f in (WHITEPAPER_*.md FINAL_WHITEPAPER*.md) do move "%%f" ".docs\" >nul 2>&1

REM Content and recommendations
for %%f in (CONTENT_PLAN.md NEXT_STEPS*.md CURRENT_TASKS*.md) do move "%%f" ".docs\" >nul 2>&1

REM Balancing
for %%f in (BALANCING*.md) do move "%%f" ".docs\" >nul 2>&1

REM Mini games
for %%f in (MINI_GAMES*.md CREATIVE_MINI*.md NEW_MINI*.md) do move "%%f" ".docs\" >nul 2>&1

REM Images
for %%f in (IMAGE_*.md) do move "%%f" ".docs\" >nul 2>&1

REM CoinGecko
for %%f in (COINGECKO*.md) do move "%%f" ".docs\" >nul 2>&1

REM Reorganize docs
for %%f in (REORGANIZE*.md) do move "%%f" ".docs\" >nul 2>&1

echo ✓ Актуальные документы перемещены в .docs\

echo.
echo [2/3] Перемещение СТАРЫХ документов в .archive...

REM Telegram posts
for %%f in (TELEGRAM_*.md) do move "%%f" ".archive\" >nul 2>&1

REM Solana hackathon
for %%f in (SOLANA_HACKATHON*.md HONEST_CHANCES*.md HONEST_ASSESSMENT*.md) do move "%%f" ".archive\" >nul 2>&1

REM Deploy specific
for %%f in (DEPLOY_WHITEPAPER*.md) do move "%%f" ".archive\" >nul 2>&1

echo ✓ Старые документы перемещены в .archive\

echo.
echo [3/3] Проверка результатов...
echo.
echo ═══════════════════════════════════════════════════════════
echo  ✓ РЕОРГАНИЗАЦИЯ ЗАВЕРШЕНА!
echo ═══════════════════════════════════════════════════════════
echo.
echo  📁 Файлов в корне СЕЙЧАС:
dir /b *.md 2>nul | find /c /v ""
echo.
echo  📚 Файлов в .docs:
dir /b ".docs\*.md" 2>nul | find /c /v ""
echo.
echo  📦 Файлов в .archive:
dir /b ".archive\*.md" 2>nul | find /c /v ""
echo.
echo  👤 Файлов в admin:
dir /b "admin\*.html" 2>nul | find /c /v ""
echo.
echo  📜 Файлов в scripts:
dir /b "scripts\*.bat" 2>nul | find /c /v ""
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause

