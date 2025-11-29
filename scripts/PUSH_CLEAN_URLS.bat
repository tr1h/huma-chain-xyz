@echo off
chcp 65001 >nul
echo ============================================
echo DEPLOYING CLEAN URLs (NO .HTML)
echo ============================================
echo.

cd /d C:\goooog

echo [1/5] Checking status...
git status --short
echo.

echo [2/5] Adding all changes...
git add -A
echo ✅ All files staged
echo.

echo [3/5] Creating commit...
git commit -m "Remove .html from all URLs - Clean URLs everywhere (22 links fixed)"
echo.

echo [4/5] Pushing to GitHub...
git push origin main
echo.

echo [5/5] Summary of changes:
echo ============================================
echo Files updated:
echo   ✅ index.html (6 links)
echo   ✅ whitepaper.html (7 links)
echo   ✅ mint.html (4 links)
echo   ✅ profile.html (1 link)
echo   ✅ tamagotchi-game.html (3 links)
echo   ✅ referral.html (1 link)
echo   ✅ _config.yml (improved)
echo.
echo Total: 22 links fixed!
echo.

echo ============================================
echo ✅ DEPLOYED! Wait 5-10 minutes for Jekyll
echo ============================================
echo.
echo Test clean URLs:
echo   https://solanatamagotchi.com/whitepaper
echo   https://solanatamagotchi.com/mint
echo   https://solanatamagotchi.com/tamagotchi-game
echo.
echo Legacy URLs still work (redirect):
echo   https://solanatamagotchi.com/whitepaper.html
echo   https://solanatamagotchi.com/mint.html
echo.
pause

