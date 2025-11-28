@echo off
echo ========================================
echo   DEPLOYING WHITEPAPER TO GITHUB PAGES
echo ========================================
echo.

cd /d C:\goooog

echo [1/4] Checking git status...
git status
echo.

echo [2/4] Adding whitepaper.html...
git add whitepaper.html
echo.

echo [3/4] Committing changes...
git commit -m "Deploy whitepaper.html - Professional enterprise-grade version"
echo.

echo [4/4] Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Whitepaper will be live at:
echo https://solanatamagotchi.com/whitepaper.html
echo.
echo Please wait 2-5 minutes for GitHub Pages to update.
echo.
pause

