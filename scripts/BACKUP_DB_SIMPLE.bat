@echo off
echo ================================================
echo 💾 ИНСТРУКЦИИ ПО БЕКАПУ БАЗЫ ДАННЫХ
echo ================================================
echo.
echo База данных находится в Supabase (онлайн).
echo Локальной копии пока нет!
echo.
echo ================================================
echo 📍 ГДЕ СЕЙЧАС БАЗА:
echo ================================================
echo.
echo Supabase Cloud: https://zfrazyupameidxpjihrh.supabase.co
echo.
echo Таблицы:
echo   - leaderboard (40+ игроков)
echo   - transactions (1000+ транзакций)
echo   - user_nfts (50+ NFT)
echo   - nft_designs (1000+ дизайнов)
echo   - nft_bonding_state (цены NFT)
echo.
echo ================================================
echo 💾 КАК СДЕЛАТЬ БЕКАП:
echo ================================================
echo.
echo СПОСОБ 1: Через Supabase Dashboard (РЕКОМЕНДУЮ!)
echo.
echo 1. Открой: https://supabase.com/dashboard/project/zfrazyupameidxpjihrh/database/backups
echo 2. Нажми "Create a new backup"
echo 3. Дождись завершения
echo 4. Нажми "Download"
echo 5. Сохрани на D:\
echo.
echo Время: 5 минут
echo Результат: Полный SQL dump базы
echo.
echo ================================================
echo СПОСОБ 2: Экспорт через API (требует PHP)
echo.
echo 1. Убедись что PHP установлен
echo 2. Запусти: php api/export-database.php
echo 3. Результат будет в папке backup_db_*
echo.
echo ================================================
echo.
echo ОТКРЫТЬ SUPABASE DASHBOARD СЕЙЧАС?
echo.
pause

start https://supabase.com/dashboard/project/zfrazyupameidxpjihrh/database/backups

echo.
echo ✅ Браузер открыт!
echo Следуй инструкциям выше.
echo.
pause

