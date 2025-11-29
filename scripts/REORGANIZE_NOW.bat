@echo off
cd C:\goooog

echo Creating folders...
md .private 2>nul
md scripts 2>nul
md admin 2>nul
md test 2>nul
md .archive 2>nul

echo.
echo Moving SECRET files to .private...
move *-keypair.json .private\ >nul 2>&1
move *-private-key.txt .private\ >nul 2>&1
move secret_phrase.txt .private\ >nul 2>&1
move ADMIN_PASSWORDS.txt .private\ >nul 2>&1
move wallet-admin.html .private\ >nul 2>&1
move wallet-admin-password.js .private\ >nul 2>&1
move admin-password.js .private\ >nul 2>&1
move setup-env.js .private\ >nul 2>&1

echo Moving SCRIPTS to scripts...
move *.bat scripts\ >nul 2>&1
move deploy.ps1 scripts\ >nul 2>&1

echo Moving ADMIN files to admin...
move admin-*.html admin\ >nul 2>&1
move super-admin.html admin\ >nul 2>&1
move economy-admin.html admin\ >nul 2>&1
move blog-admin.html admin\ >nul 2>&1
move transactions-admin.html admin\ >nul 2>&1
move treasury-monitor.html admin\ >nul 2>&1

echo Moving TEST files to test...
move test-*.html test\ >nul 2>&1
move check-*.html test\ >nul 2>&1
move simple-dashboard.html test\ >nul 2>&1
move transactions-demo.html test\ >nul 2>&1

echo Moving OLD files to .archive...
move X_*.md .archive\ >nul 2>&1
move TWITTER_*.md .archive\ >nul 2>&1
move DISCORD_*.md .archive\ >nul 2>&1
move YOUTUBE_*.md .archive\ >nul 2>&1
move SORA*.md .archive\ >nul 2>&1
move TELEGRAM_AUTO*.md .archive\ >nul 2>&1
move COLOSSEUM*.md .archive\ >nul 2>&1
move RESPONSE_*.md .archive\ >nul 2>&1
move WHEN_*.md .archive\ >nul 2>&1
move TWEET*.md .archive\ >nul 2>&1
move MONAD*.md .archive\ >nul 2>&1
move nft-mint-5tiers-variant*.html .archive\ >nul 2>&1
move s.html .archive\ >nul 2>&1
move indie-fun-poster.html .archive\ >nul 2>&1

echo.
echo DONE!
echo.
dir .private 2>nul
echo.
pause

