@echo off
chcp 65001 >nul
echo ============================================
echo FORCE PUSHING PDF FIX
echo ============================================
echo.

cd /d C:\goooog

echo [1/5] Current status:
git status
echo.

echo [2/5] Checking if whitepaper.html is modified:
git diff --name-only
echo.

echo [3/5] Adding whitepaper.html (force):
git add whitepaper.html
echo ✅ Added
echo.

echo [4/5] Creating commit (if needed):
git commit -m "Fix: Improve PDF export - better print styles, architecture diagram formatting" || echo "Already committed"
echo.

echo [5/5] PUSHING TO GITHUB:
git push origin main
echo.

echo ============================================
echo CHECKING RESULT:
echo ============================================
git log --oneline -3
echo.

echo ============================================
if %errorlevel%==0 (
    echo ✅ SUCCESS! Push completed!
) else (
    echo ⚠️ Check error above
)
echo ============================================
echo.
pause

