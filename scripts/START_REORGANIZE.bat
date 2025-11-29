@echo off
chcp 65001
cls
echo ═══════════════════════════════════════════════════════════
echo  🧹 РЕОРГАНИЗАЦИЯ ПРОЕКТА - РУЧНОЙ ЗАПУСК
echo ═══════════════════════════════════════════════════════════
echo.
echo  Этот скрипт наведёт порядок в проекте!
echo.
echo  ЧТО БУДЕТ СДЕЛАНО:
echo  ✓ Созданы папки: .private, scripts, admin, test, .archive
echo  ✓ Секретные файлы → .private (keypairs, passwords)
echo  ✓ Скрипты → scripts (все .bat)
echo  ✓ Админки → admin (admin-*.html)
echo  ✓ Тесты → test (test-*.html)
echo  ✓ Старые файлы → .archive
echo.
echo  ═══════════════════════════════════════════════════════════
echo.
pause

cd /d "%~dp0"

echo.
echo [1/9] Создание папок...
if not exist ".private" mkdir ".private"
if not exist "scripts" mkdir "scripts"
if not exist "admin" mkdir "admin"
if not exist "test" mkdir "test"
if not exist ".archive" mkdir ".archive"
echo ✓ Папки созданы

echo.
echo [2/9] Перемещение СЕКРЕТНЫХ файлов в .private...
for %%f in (*-keypair.json) do move "%%f" ".private\" >nul 2>&1
for %%f in (*-private-key.txt) do move "%%f" ".private\" >nul 2>&1
if exist "secret_phrase.txt" move "secret_phrase.txt" ".private\" >nul 2>&1
if exist "ADMIN_PASSWORDS.txt" move "ADMIN_PASSWORDS.txt" ".private\" >nul 2>&1
if exist "wallet-admin.html" move "wallet-admin.html" ".private\" >nul 2>&1
if exist "wallet-admin-password.js" move "wallet-admin-password.js" ".private\" >nul 2>&1
if exist "admin-password.js" move "admin-password.js" ".private\" >nul 2>&1
if exist "setup-env.js" move "setup-env.js" ".private\" >nul 2>&1
echo ✓ Секретные файлы перемещены

echo.
echo [3/9] Перемещение СКРИПТОВ в scripts...
for %%f in (PUSH*.bat CHECK*.bat DEPLOY*.bat CREATE*.bat BACKUP*.bat FORCE*.bat) do (
    if exist "%%f" move "%%f" "scripts\" >nul 2>&1
)
if exist "deploy.ps1" move "deploy.ps1" "scripts\" >nul 2>&1
if exist "push-all-now.bat" move "push-all-now.bat" "scripts\" >nul 2>&1
if exist "deploy-updates.bat" move "deploy-updates.bat" "scripts\" >nul 2>&1
if exist "deploy-whitepaper.bat" move "deploy-whitepaper.bat" "scripts\" >nul 2>&1
echo ✓ Скрипты перемещены

echo.
echo [4/9] Перемещение АДМИНОК в admin...
for %%f in (admin-*.html) do move "%%f" "admin\" >nul 2>&1
if exist "super-admin.html" move "super-admin.html" "admin\" >nul 2>&1
if exist "economy-admin.html" move "economy-admin.html" "admin\" >nul 2>&1
if exist "blog-admin.html" move "blog-admin.html" "admin\" >nul 2>&1
if exist "transactions-admin.html" move "transactions-admin.html" "admin\" >nul 2>&1
if exist "treasury-monitor.html" move "treasury-monitor.html" "admin\" >nul 2>&1
echo ✓ Админки перемещены

echo.
echo [5/9] Перемещение ТЕСТОВ в test...
for %%f in (test-*.html check-*.html) do move "%%f" "test\" >nul 2>&1
if exist "simple-dashboard.html" move "simple-dashboard.html" "test\" >nul 2>&1
if exist "transactions-demo.html" move "transactions-demo.html" "test\" >nul 2>&1
if exist "check-user.html" move "check-user.html" "test\" >nul 2>&1
echo ✓ Тесты перемещены

echo.
echo [6/9] Архивация СТАРЫХ документов...
for %%f in (X_*.md TWITTER_*.md DISCORD_*.md YOUTUBE_*.md SORA*.md TELEGRAM_AUTO*.md COLOSSEUM*.md RESPONSE_*.md WHEN_*.md TWEET*.md MONAD*.md WEEK*.md) do (
    if exist "%%f" move "%%f" ".archive\" >nul 2>&1
)
echo ✓ Старые документы заархивированы

echo.
echo [7/9] Архивация СТАРЫХ HTML файлов...
for %%f in (nft-mint-5tiers-variant*.html) do move "%%f" ".archive\" >nul 2>&1
if exist "s.html" move "s.html" ".archive\" >nul 2>&1
if exist "indie-fun-poster.html" move "indie-fun-poster.html" ".archive\" >nul 2>&1
echo ✓ Старые HTML заархивированы

echo.
echo [8/9] Обновление .gitignore...
echo. >> .gitignore
echo # Private folder with secrets (NEVER COMMIT!) >> .gitignore
echo .private/ >> .gitignore
echo .private/** >> .gitignore
echo **/.private/ >> .gitignore
echo. >> .gitignore
echo # Archive folder >> .gitignore
echo .archive/ >> .gitignore
echo. >> .gitignore
echo # Test folder >> .gitignore
echo test/ >> .gitignore
echo ✓ .gitignore обновлён

echo.
echo [9/9] Проверка результатов...
echo.
echo ═══════════════════════════════════════════════════════════
echo  ✓ РЕОРГАНИЗАЦИЯ ЗАВЕРШЕНА!
echo ═══════════════════════════════════════════════════════════
echo.
echo  📁 Структура проекта:
echo.
echo  .private\    🔒 Секретные файлы (НЕ в Git!)
dir /b ".private" 2>nul
echo.
echo  scripts\     📜 Скрипты
echo  admin\       👤 Админки
echo  test\        🧪 Тесты
echo  .archive\    📦 Старые файлы
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo  ⚠️  ВАЖНО: Теперь запусти scripts\CHECK_GIT_STATUS.bat
echo      чтобы убедиться, что секреты НЕ в Git!
echo.
pause

