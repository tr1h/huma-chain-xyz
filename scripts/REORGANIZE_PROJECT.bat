@echo off
chcp 65001 >nul
echo ============================================
echo 🧹 РЕОРГАНИЗАЦИЯ ПРОЕКТА
echo ============================================
echo.
echo Это создаст профессиональную структуру папок!
echo.
echo ВНИМАНИЕ: Секретные файлы будут перемещены!
echo.
pause

cd C:\goooog

echo.
echo [1/10] Создание папок...
mkdir ".private" 2>nul
mkdir "scripts" 2>nul
mkdir "admin" 2>nul
mkdir "test" 2>nul
mkdir ".archive" 2>nul
echo ✅ Папки созданы

echo.
echo [2/10] Перемещение СЕКРЕТНЫХ ФАЙЛОВ...
move *-keypair.json .private\ 2>nul
move *-private-key.txt .private\ 2>nul
move secret_phrase.txt .private\ 2>nul
move ADMIN_PASSWORDS.txt .private\ 2>nul
move wallet-admin.html .private\ 2>nul
move wallet-admin-password.js .private\ 2>nul
move admin-password.js .private\ 2>nul
move setup-env.js .private\ 2>nul
echo ✅ Секретные файлы перемещены в .private\

echo.
echo [3/10] Перемещение СКРИПТОВ...
move *.bat scripts\ 2>nul
move deploy.ps1 scripts\ 2>nul
echo ✅ Скрипты перемещены в scripts\

echo.
echo [4/10] Перемещение ADMIN панелей...
move admin-*.html admin\ 2>nul
move super-admin.html admin\ 2>nul
move wallet-admin.html admin\ 2>nul
move economy-admin.html admin\ 2>nul
move blog-admin.html admin\ 2>nul
move transactions-admin.html admin\ 2>nul
move treasury-monitor.html admin\ 2>nul
echo ✅ Admin панели перемещены в admin\

echo.
echo [5/10] Перемещение TEST файлов...
move test-*.html test\ 2>nul
move check-*.html test\ 2>nul
move simple-dashboard.html test\ 2>nul
move transactions-demo.html test\ 2>nul
echo ✅ Test файлы перемещены в test\

echo.
echo [6/10] Перемещение СТАРЫХ документов...
move X_*.md .archive\ 2>nul
move TWITTER_*.md .archive\ 2>nul
move DISCORD_*.md .archive\ 2>nul
move YOUTUBE_*.md .archive\ 2>nul
move SORA*.md .archive\ 2>nul
move TELEGRAM_AUTO*.md .archive\ 2>nul
move COLOSSEUM*.md .archive\ 2>nul
move RESPONSE_*.md .archive\ 2>nul
move WHEN_LAUNCH*.md .archive\ 2>nul
move TWEET*.md .archive\ 2>nul
move MONAD*.md .archive\ 2>nul
echo ✅ Старые документы перемещены в .archive\

echo.
echo [7/10] Перемещение АКТУАЛЬНЫХ документов в .docs...
move *_SUMMARY.md .docs\ 2>nul
move *_GUIDE.md .docs\ 2>nul
move *_STATUS.md .docs\ 2>nul
move *_INSTRUCTIONS.md .docs\ 2>nul
move *_PLAN.md .docs\ 2>nul
move SECURITY*.md .docs\ 2>nul
move SOLANA_GRANT*.md .docs\ 2>nul
move HONEST*.md .docs\ 2>nul
move LEGAL*.md .docs\ 2>nul
move PROJECT*.md .docs\ 2>nul
move MAINNET*.md .docs\ 2>nul
move BACKUP*.md .docs\ 2>nul
move COMPLETE_BACKUP_GUIDE.md .docs\ 2>nul
move TODAY_ACHIEVEMENTS*.md .docs\ 2>nul
echo ✅ Документация перемещена в .docs\

echo.
echo [8/10] Перемещение СТАРЫХ вариантов...
move nft-mint-5tiers-variant*.html .archive\ 2>nul
move s.html .archive\ 2>nul
move indie-fun-poster.html .archive\ 2>nul
echo ✅ Старые варианты перемещены в .archive\

echo.
echo [9/10] Обновление .gitignore...
echo. >> .gitignore
echo # Private folder (НИКОГДА НЕ КОММИТИТЬ!) >> .gitignore
echo .private/ >> .gitignore
echo .private/** >> .gitignore
echo. >> .gitignore
echo # Archive folder (old files) >> .gitignore
echo .archive/ >> .gitignore
echo. >> .gitignore
echo # Test folder >> .gitignore
echo test/ >> .gitignore
echo ✅ .gitignore обновлён

echo.
echo [10/10] Проверка безопасности...
echo.
echo Секретные файлы в .private:
dir .private\ /b 2>nul
echo.

echo ============================================
echo ✅ РЕОРГАНИЗАЦИЯ ЗАВЕРШЕНА!
echo ============================================
echo.
echo СТРУКТУРА ПРОЕКТА:
echo.
echo C:\goooog\
echo   ├── .private\          🔒 СЕКРЕТНЫЕ ФАЙЛЫ (НЕ в Git!)
echo   ├── scripts\           📜 Все .bat скрипты
echo   ├── admin\             👤 Admin панели
echo   ├── test\              🧪 Test файлы
echo   ├── .archive\          📦 Старые файлы
echo   ├── .docs\             📚 Документация
echo   ├── api\               🔌 Backend API
echo   ├── bot\               🤖 Telegram bot
echo   ├── js\                💻 JavaScript
echo   ├── css\               🎨 Styles
echo   ├── *.html             🌐 Публичные страницы
echo   └── README.md          📖 Главный файл
echo.
echo ⚠️  ВАЖНО: Папка .private\ добавлена в .gitignore!
echo ✅ Все keypair.json теперь защищены!
echo.
pause

