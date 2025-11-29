@echo off
echo ============================================
echo PUSHING MAINNET-READY LEGAL IMPLEMENTATION
echo ============================================
echo.
echo This will deploy:
echo   1. Legal documents (terms, privacy, disclaimer)
echo   2. Footer updates on all pages
echo   3. Telegram bot welcome message update
echo   4. Modal consent window for first-time users
echo   5. Legal checkbox for mint/withdrawal forms
echo.
pause
echo.

echo [1/7] Checking status...
git status
echo.

echo [2/7] Adding legal documents...
git add terms.html privacy.html disclaimer.html
if %errorlevel% neq 0 (
    echo ❌ Failed to add legal documents
    pause
    exit /b 1
)
echo ✅ Added legal documents
echo.

echo [3/7] Adding JavaScript components...
git add js/legal-consent.js js/legal-checkbox.js
if %errorlevel% neq 0 (
    echo ❌ Failed to add JS files
    pause
    exit /b 1
)
echo ✅ Added JS components
echo.

echo [4/7] Adding updated pages...
git add index.html whitepaper.html mint.html profile.html tamagotchi-game.html referral.html
if %errorlevel% neq 0 (
    echo ❌ Failed to add updated pages
    pause
    exit /b 1
)
echo ✅ Added updated pages
echo.

echo [5/7] Adding bot updates...
git add bot/bot.py
if %errorlevel% neq 0 (
    echo ❌ Failed to add bot updates
    pause
    exit /b 1
)
echo ✅ Added bot updates
echo.

echo [6/7] Creating commit...
git commit -m "Mainnet-ready: Full legal implementation - Terms, Privacy, Disclaimer, Consent Modal, Checkbox"
if %errorlevel% neq 0 (
    echo ❌ Failed to commit
    pause
    exit /b 1
)
echo ✅ Committed
echo.

echo [7/7] Pushing to GitHub...
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
echo What was deployed:
echo.
echo LEGAL DOCUMENTS:
echo   • https://solanatamagotchi.com/terms
echo   • https://solanatamagotchi.com/privacy
echo   • https://solanatamagotchi.com/disclaimer
echo.
echo FOOTER UPDATED:
echo   • index.html
echo   • whitepaper.html
echo   • mint.html
echo   • profile.html
echo   • tamagotchi-game.html
echo   • referral.html
echo.
echo NEW FEATURES:
echo   • Modal consent window on first visit
echo   • Legal checkbox for mint/withdraw
echo   • Telegram bot welcome message updated
echo.
echo NEXT STEPS:
echo   1. Wait 3-5 minutes for GitHub Pages
echo   2. Test: Open tamagotchi-game.html in incognito (modal should appear)
echo   3. Test: Try minting NFT (checkbox should appear)
echo   4. Add checkbox to withdrawal function (see LEGAL_IMPLEMENTATION_GUIDE.md)
echo.
echo 🚀 READY FOR MAINNET!
echo.
pause

