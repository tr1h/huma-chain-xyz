# Подменю для перевода

## Не переведены:
1. ✅ my_nfts - Мои NFT  
2. ✅ withdraw_tama - Вывод TAMA
3. ✅ mint_nft - Минт NFT
4. ✅ leaderboard - Лидерборд
5. ✅ view_rank - Мой ранг
6. ✅ view_quests - Квесты
7. ❌ view_badges - Значки (ошибка при замене)

## План:
Добавить `lang = get_user_language(call.from_user.id) or 'en'` в начало каждого handler'а и локализованные тексты.

