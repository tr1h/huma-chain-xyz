@echo off
chcp 65001
cls
echo ═══════════════════════════════════════════════════════════
echo  🔍 ПРОВЕРКА GIT БЕЗОПАСНОСТИ
echo ═══════════════════════════════════════════════════════════
echo.
echo  Проверяем, что секретные файлы НЕ попали в Git...
echo.
pause

cd /d "C:\goooog"

echo.
echo [1/3] Проверка секретных файлов в Git...
echo.
git ls-files | findstr /i "keypair secret ADMIN_PASSWORDS wallet-admin"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ❌ ОПАСНО! Найдены секретные файлы в Git!
    echo.
    echo Нужно удалить их из Git:
    echo   git rm --cached имя_файла
    echo   git commit -m "Remove sensitive files"
    echo.
) else (
    echo.
    echo ✓ Отлично! Секретные файлы НЕ в Git!
    echo.
)

echo.
echo [2/3] Проверка .gitignore...
echo.
findstr /i ".private" .gitignore >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ .private/ добавлено в .gitignore
) else (
    echo ❌ .private/ НЕ в .gitignore!
)

echo.
echo [3/3] Git статус...
echo.
git status --short
echo.

echo ═══════════════════════════════════════════════════════════
echo  ✓ ПРОВЕРКА ЗАВЕРШЕНА
echo ═══════════════════════════════════════════════════════════
echo.
echo  Всё хорошо? Тогда можно коммитить!
echo.
pause

