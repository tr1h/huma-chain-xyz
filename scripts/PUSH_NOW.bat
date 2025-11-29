@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════╗
echo ║   PUSHING TO GITHUB - PLEASE WAIT     ║
echo ╚════════════════════════════════════════╝
echo.

cd /d C:\goooog

echo [STEP 1/4] Checking git status...
git status
echo.

echo [STEP 2/4] Adding ALL files...
git add -A
echo.

echo [STEP 3/4] Creating commit...
git commit -m "SEC-compliance + Whitepaper button + lang EN fixes"
echo.

echo [STEP 4/4] Pushing to GitHub...
git push origin main
echo.

echo.
echo ╔════════════════════════════════════════╗
echo ║           PUSH COMPLETED!              ║
echo ╚════════════════════════════════════════╝
echo.
echo Check GitHub in 30 seconds:
echo https://github.com/tr1h/huma-chain-xyz/commits/main
echo.

pause

