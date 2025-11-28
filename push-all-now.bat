@echo off
echo ========================================
echo   PUSHING ALL CHANGES TO GITHUB
echo ========================================
echo.

cd /d C:\goooog

echo [1/3] Checking status...
git status
echo.

echo [2/3] Adding all changes...
git add .
echo.

echo [3/3] Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   DONE!
echo ========================================
echo.

pause

