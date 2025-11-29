@echo off
echo ============================================
echo PUSHING LEGAL DOCUMENTS
echo ============================================
echo.
echo Documents created:
echo   1. terms.html - Terms of Service
echo   2. privacy.html - Privacy Policy
echo   3. disclaimer.html - Risk Warning
echo.
echo Footer updated on:
echo   - index.html
echo   - whitepaper.html
echo.
echo [1/5] Checking status...
git status
echo.

echo [2/5] Adding new files...
git add terms.html privacy.html disclaimer.html
if %errorlevel% neq 0 (
    echo ❌ Failed to add new files
    pause
    exit /b 1
)
echo ✅ Added new files
echo.

echo [3/5] Adding updated files...
git add index.html whitepaper.html
if %errorlevel% neq 0 (
    echo ❌ Failed to add updated files
    pause
    exit /b 1
)
echo ✅ Added updated files
echo.

echo [4/5] Creating commit...
git commit -m "Add legal documents: Terms of Service, Privacy Policy, Risk Warning + footer links"
if %errorlevel% neq 0 (
    echo ❌ Failed to commit
    pause
    exit /b 1
)
echo ✅ Committed
echo.

echo [5/5] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push
    pause
    exit /b 1
)
echo.

echo ============================================
echo ✅ DONE! All legal documents pushed!
echo ============================================
echo.
echo URLs:
echo   https://solanatamagotchi.com/terms
echo   https://solanatamagotchi.com/privacy
echo   https://solanatamagotchi.com/disclaimer
echo.
echo Wait 3-5 minutes for GitHub Pages to update!
echo.
pause

