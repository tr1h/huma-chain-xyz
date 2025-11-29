@echo off
echo ============================================
echo PUSHING PHP API FIX FOR LIVE STATS
echo ============================================
echo.

cd /d C:\goooog

echo [1/4] Checking status...
git status

echo.
echo [2/4] Adding whitepaper.html...
git add whitepaper.html

echo.
echo [3/4] Committing fix...
git commit -m "Fix: Use PHP API for live stats (solve CORS and 401)"

echo.
echo [4/4] Pushing to GitHub...
git push origin main

echo.
echo ============================================
echo DONE! PHP API integration complete!
echo ============================================
echo.
echo Now using: https://tama-supabase.onrender.com
echo This solves CORS and authentication issues!
echo.
echo Wait 2-3 minutes, then check:
echo https://solanatamagotchi.com/whitepaper.html
echo.
pause

