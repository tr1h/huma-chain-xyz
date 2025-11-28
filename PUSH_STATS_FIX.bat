@echo off
echo ============================================
echo PUSHING LIVE STATS FIX
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
git commit -m "Fix: Live stats loading - add proper headers and fallback values"

echo.
echo [4/4] Pushing to GitHub...
git push origin main

echo.
echo ============================================
echo DONE! Changes pushed!
echo ============================================
echo.
echo Wait 2-3 minutes, then check:
echo https://solanatamagotchi.com/whitepaper.html
echo.
echo Press F12 in browser to see console logs:
echo - "Live stats loaded" = SUCCESS
echo - "Error loading stats" = Using fallback
echo.
pause

