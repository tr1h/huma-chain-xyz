@echo off
chcp 65001 >nul
echo ============================================
echo CHECKING PUSH STATUS
echo ============================================
echo.

cd /d C:\goooog

echo [1/3] Local commits (last 5):
echo ============================================
git log --oneline -5
echo.

echo [2/3] Checking if local is ahead of remote:
echo ============================================
git status
echo.

echo [3/3] Checking remote status:
echo ============================================
git fetch origin
git log origin/main..HEAD --oneline
echo.

echo ============================================
if %errorlevel%==0 (
    echo ✅ Local and remote are in sync!
) else (
    echo ⚠️ Local is ahead - need to push!
)
echo ============================================
echo.
pause

