@echo off
echo ============================================
echo PUSHING CUSTOM DOMAIN FIX
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
git commit -m "Fix: Use custom domain api.solanatamagotchi.com for live stats"

echo.
echo [4/4] Pushing to GitHub...
git push origin main

echo.
echo ============================================
echo DONE! Now using your CUSTOM DOMAIN!
echo ============================================
echo.
echo API URL: https://api.solanatamagotchi.com/api/tama/leaderboard
echo.
echo This is MUCH BETTER because:
echo  - Your own domain (professional!)
echo  - No Render.com URL visible
echo  - Proper branding
echo  - CORS configured
echo.
echo Wait 2-3 minutes, then check:
echo https://solanatamagotchi.com/whitepaper.html
echo.
pause

