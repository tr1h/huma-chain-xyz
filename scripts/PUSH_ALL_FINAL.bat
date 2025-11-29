@echo off
echo ============================================
echo FINAL DEPLOYMENT - MAINNET READY!
echo ============================================
echo.
echo This includes:
echo   1. Legal documents (terms, privacy, disclaimer)
echo   2. Updated README with legal info
echo   3. Neutral jurisdiction (international law)
echo   4. Modal consent window
echo   5. Legal checkboxes
echo   6. Footer on all pages
echo   7. Telegram bot updates
echo.
pause
echo.

echo [1/6] Checking status...
git status
echo.

echo [2/6] Adding all legal files...
git add terms.html privacy.html disclaimer.html
git add js/legal-consent.js js/legal-checkbox.js
if %errorlevel% neq 0 (
    echo ❌ Failed to add legal files
    pause
    exit /b 1
)
echo ✅ Added legal files
echo.

echo [3/6] Adding updated pages...
git add index.html whitepaper.html mint.html profile.html tamagotchi-game.html referral.html
if %errorlevel% neq 0 (
    echo ❌ Failed to add pages
    pause
    exit /b 1
)
echo ✅ Added updated pages
echo.

echo [4/6] Adding bot and README...
git add bot/bot.py README.md
if %errorlevel% neq 0 (
    echo ❌ Failed to add bot/README
    pause
    exit /b 1
)
echo ✅ Added bot and README
echo.

echo [5/6] Creating commit...
git commit -m "🚀 Mainnet-Ready: Full legal compliance + international jurisdiction"
if %errorlevel% neq 0 (
    echo ❌ Failed to commit
    pause
    exit /b 1
)
echo ✅ Committed
echo.

echo [6/6] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push
    pause
    exit /b 1
)
echo.

echo ============================================
echo ✅ DEPLOYMENT COMPLETE!
echo ============================================
echo.
echo 🌐 LIVE URLS:
echo   https://solanatamagotchi.com/terms
echo   https://solanatamagotchi.com/privacy
echo   https://solanatamagotchi.com/disclaimer
echo   https://solanatamagotchi.com/whitepaper
echo.
echo ✅ CHANGES:
echo   • Neutral jurisdiction (international law)
echo   • All legal documents deployed
echo   • README updated with legal info
echo   • Consent modal on game launch
echo   • Legal checkboxes on mint/withdraw
echo   • Footer on all 6 pages
echo   • Telegram bot links updated
echo.
echo 🎯 STATUS: MAINNET READY!
echo.
echo Next steps:
echo   1. Wait 3-5 minutes for GitHub Pages
echo   2. Test in incognito mode
echo   3. Ready for Mainnet launch!
echo.
pause

