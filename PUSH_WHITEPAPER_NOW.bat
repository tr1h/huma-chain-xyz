@echo off
echo ============================================
echo PUSHING WHITEPAPER UPGRADES TO GITHUB
echo ============================================
echo.

cd /d C:\goooog

echo Adding whitepaper.html...
git add whitepaper.html

echo.
echo Committing changes...
git commit -m "UPGRADE: Interactive whitepaper - Share buttons, Live stats, Visual infographics, SEO, PDF-ready"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ============================================
echo DONE! Check GitHub in 2-3 minutes!
echo ============================================
echo.
pause

