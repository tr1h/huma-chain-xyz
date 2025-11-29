@echo off
echo ============================================
echo CHECKING GIT STATUS
echo ============================================
echo.

echo Current branch and status:
git status
echo.

echo Last 5 commits:
git log --oneline -5
echo.

echo Files changed (not staged):
git diff --name-only
echo.

echo Files staged:
git diff --cached --name-only
echo.

pause

