@echo off
echo ============================================
echo PUSHING LIVE STATS API FIX
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
git commit -m "Fix: Live stats API - use leaderboard field and total_tama, better error handling"
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
echo   1. API response format - now checks result.leaderboard first
echo   2. Field name - uses total_tama instead of tama
echo   3. Better error handling and logging
echo.
echo Wait 3-5 minutes, then test:
echo   1. Open browser console (F12)
echo   2. Reload whitepaper page
echo   3. Check console logs for API response
echo.
pause
