@echo off
echo ============================================
echo PUSHING PDF TEXT COLOR FIX
echo ============================================
echo.

echo [1/4] Checking status...
git status
echo.

echo [2/4] Adding whitepaper.html...
git add whitepaper.html
if %errorlevel% neq 0 (
    echo ❌ Failed to add file
    pause
    exit /b 1
)
echo ✅ Added
echo.

echo [3/4] Creating commit...
git commit -m "Fix: PDF - highlight-box text color (black for print, visible in PDF)"
if %errorlevel% neq 0 (
    echo ❌ Failed to commit
    pause
    exit /b 1
)
echo ✅ Committed
echo.

echo [4/4] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push
    pause
    exit /b 1
)
echo.

echo ============================================
echo ✅ DONE! Changes pushed!
echo ============================================
echo.
echo What was fixed:
echo   1. Added color: black !important to .highlight-box for PDF
echo   2. Added color: black !important to p, ul, li, strong, em inside .highlight-box
echo   3. Text now visible in PDF (was invisible/too light)
echo.
echo Fixed sections:
echo   - "Key Innovation: Zero Wallet Barrier"
echo   - "Two-Layer System: Instant UX + True Ownership"
echo.
echo Wait 3-5 minutes, then test PDF download!
echo.
pause

