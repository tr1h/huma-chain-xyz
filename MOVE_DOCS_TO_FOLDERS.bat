@echo off
cd C:\goooog

echo Перемещение документов в .docs...

move SECURITY*.md .docs\ 2>nul
move SOLANA_GRANT*.md .docs\ 2>nul
move HONEST_PROJECT*.md .docs\ 2>nul
move MAINNET*.md .docs\ 2>nul
move LEGAL*.md .docs\ 2>nul
move PROJECT*.md .docs\ 2>nul
move BACKUP*.md .docs\ 2>nul
move COMPLETE_BACKUP*.md .docs\ 2>nul
move TODAY_ACHIEVEMENTS*.md .docs\ 2>nul
move DEPLOY_INSTRUCTIONS.md .docs\ 2>nul
move CLEAN_URLS*.md .docs\ 2>nul
move ALL_FIXES*.md .docs\ 2>nul
move REFERRAL*_SUMMARY*.md .docs\ 2>nul
move FIX_*.md .docs\ 2>nul
move GITHUB_PAGES*.md .docs\ 2>nul
move NFT_*.md .docs\ 2>nul
move REFERRAL*.md .docs\ 2>nul
move SCREENSHOTS*.md .docs\ 2>nul
move SEC_*.md .docs\ 2>nul
move WHITEPAPER_*.md .docs\ 2>nul
move FINAL_WHITEPAPER*.md .docs\ 2>nul
move CONTENT_PLAN.md .docs\ 2>nul
move NEXT_STEPS*.md .docs\ 2>nul
move CURRENT_TASKS*.md .docs\ 2>nul
move BALANCING*.md .docs\ 2>nul
move MINI_GAMES*.md .docs\ 2>nul
move CREATIVE_MINI*.md .docs\ 2>nul
move NEW_MINI*.md .docs\ 2>nul
move IMAGE_*.md .docs\ 2>nul
move COINGECKO*.md .docs\ 2>nul
move REORGANIZE*.md .docs\ 2>nul

echo Перемещение старых документов в .archive...

move TELEGRAM_*.md .archive\ 2>nul
move SOLANA_HACKATHON*.md .archive\ 2>nul
move HONEST_CHANCES*.md .archive\ 2>nul
move HONEST_ASSESSMENT*.md .archive\ 2>nul
move DEPLOY_WHITEPAPER*.md .archive\ 2>nul

echo.
echo ✓ Готово!
echo.
echo Осталось .md файлов в корне:
dir /b *.md 2>nul
echo.
pause

