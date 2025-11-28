@echo off
echo ============================================
echo CHECKING AND PUSHING LOGO CHANGES
echo ============================================
echo.

cd /d C:\goooog

echo [1/4] Git Status:
git status

echo.
echo [2/4] Adding whitepaper.html...
git add whitepaper.html

echo.
echo [3/4] Committing changes...
git commit -m "Add logo to whitepaper header"

echo.
echo [4/4] Pushing to GitHub...
git push origin main

echo.
echo ============================================
echo DONE! Check output above for confirmation!
echo ============================================
echo.
echo Open this URL to verify:
echo https://github.com/tr1h/huma-chain-xyz/commits/main
echo.
pause

