@echo off
chcp 65001 > git_check.log 2>&1
cd C:\goooog

echo ═══════════════════════════════════════════════ > git_status.txt
echo GIT CONFIGURATION CHECK >> git_status.txt
echo ═══════════════════════════════════════════════ >> git_status.txt
echo. >> git_status.txt

echo [1] Git User Name: >> git_status.txt
git config --global user.name >> git_status.txt 2>&1
echo. >> git_status.txt

echo [2] Git User Email: >> git_status.txt
git config --global user.email >> git_status.txt 2>&1
echo. >> git_status.txt

echo [3] Git Remote URL: >> git_status.txt
git remote -v >> git_status.txt 2>&1
echo. >> git_status.txt

echo [4] Git Status: >> git_status.txt
git status >> git_status.txt 2>&1
echo. >> git_status.txt

echo [5] Git Branch: >> git_status.txt
git branch >> git_status.txt 2>&1
echo. >> git_status.txt

echo [6] Last Commit: >> git_status.txt
git log -1 --oneline >> git_status.txt 2>&1
echo. >> git_status.txt

echo [7] Files NOT tracked (keypairs check): >> git_status.txt
git ls-files | findstr /i "keypair secret ADMIN_PASSWORDS wallet-admin" >> git_status.txt 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo GOOD! No sensitive files tracked! >> git_status.txt
)
echo. >> git_status.txt

echo ═══════════════════════════════════════════════ >> git_status.txt
echo DONE! Check git_status.txt >> git_status.txt
echo ═══════════════════════════════════════════════ >> git_status.txt

type git_status.txt
echo.
echo.
echo ✓ Результат сохранен в git_status.txt
echo.
pause

