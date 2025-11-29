@echo off
echo ========================================
echo   DEPLOYING WEBSITE UPDATES
echo ========================================
echo.

cd /d C:\goooog

echo [1/3] Adding changes...
git add index.html
echo.

echo [2/3] Committing...
git commit -m "Add Whitepaper and Profile links to footer"
echo.

echo [3/3] Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Changes will be live in 2-3 minutes at:
echo https://solanatamagotchi.com/
echo.
pause

