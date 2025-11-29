@echo off
chcp 65001 >nul
cls
echo ═══════════════════════════════════════════════
echo  🚀 QUICK PUSH TO GITHUB
echo ═══════════════════════════════════════════════
echo.

cd /d "C:\goooog"

REM Check if there are changes
git status --short > temp_status.txt
set /p status=<temp_status.txt
del temp_status.txt

if "%status%"=="" (
    echo ✅ Working tree clean - nothing to push!
    echo.
    pause
    exit /b 0
)

echo Changes detected. Pushing to GitHub...
echo.

REM Get commit message
set /p "commit_msg=Enter commit message (or press Enter for 'Update files'): "
if "%commit_msg%"=="" set "commit_msg=Update files"

echo.
echo [1/3] Adding files...
git add -A
echo ✅ Done
echo.

echo [2/3] Creating commit...
git commit -m "%commit_msg%"
echo ✅ Done
echo.

echo [3/3] Pushing to GitHub...
git push origin main
echo.

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ═══════════════════════════════════════════════
    echo  ✅ SUCCESSFULLY PUSHED!
    echo ═══════════════════════════════════════════════
    echo.
    echo  Check: https://github.com/tr1h/huma-chain-xyz
    echo.
) else (
    echo.
    echo ═══════════════════════════════════════════════
    echo  ❌ PUSH FAILED!
    echo ═══════════════════════════════════════════════
    echo.
)

pause


