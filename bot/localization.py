"""
Localization system for Solana Tamagotchi Bot
Система локализации для бота (EN/RU)
"""

import re
from typing import Dict, Any

class Localization:
    def __init__(self):
        """Initialize localization with translations"""
        self.translations = {
            # COMMANDS
            'start': {
                'en': """🎮 **Welcome to Solana Tamagotchi!**

Remember your childhood? Now with earnings! 🐾

**Your Features:**
• 5 Unique Pets (Cat, Dog, Bunny, Fox, Panda)
• 5 Evolution Stages (Egg → Baby → Teen → Adult → Legend)
• Play-to-Earn with $TAMA tokens
• Mint exclusive NFTs (Bronze to Diamond)
• Mini-games & Daily rewards

**Quick Start:**
1️⃣ Tap button below to start playing
2️⃣ Choose your first pet
3️⃣ Feed, play, and watch it grow!
4️⃣ Earn TAMA tokens while having fun

🎁 Early adopters get bonus rewards!

**Commands:**
/help - View all commands
/stats - Check your stats
/mint - Mint your NFT
/leaderboard - Top players

Let's play! 👇""",
                'ru': """🎮 **Добро пожаловать в Solana Tamagotchi!**

Помнишь детство? Теперь с заработком! 🐾

**Что тебя ждёт:**
• 5 уникальных питомцев (Кот, Пёс, Зайчик, Лис, Панда)
• 5 стадий эволюции (Яйцо → Малыш → Подросток → Взрослый → Легенда)
• Зарабатывай токены $TAMA играя
• Минти эксклюзивные NFT (Бронза до Алмаза)
• Мини-игры и ежедневные награды

**Быстрый старт:**
1️⃣ Нажми кнопку ниже чтобы начать играть
2️⃣ Выбери своего первого питомца
3️⃣ Корми, играй и смотри как он растёт!
4️⃣ Зарабатывай TAMA токены получая удовольствие

🎁 Ранние игроки получают бонусы!

**Команды:**
/help - Все команды
/stats - Твоя статистика
/mint - Минт NFT
/leaderboard - Топ игроков

Поехали! 👇"""
            },

            'welcome_no_referral': {
                'en': """🎉 **Welcome to Solana Tamagotchi!**

The ultimate Play-to-Earn NFT pet game on Solana! 🐾

🎮 **Game Features:**
• 🐾 Adopt and raise unique NFT pets
• 🎰 Play Lucky Slots & Lucky Wheel
• 💰 Earn TAMA tokens
• 🏆 Compete on global leaderboards
• 🎁 Complete daily quests
• 🤝 Invite friends, earn 1,000 TAMA per referral!

🚀 **Ready to start?**
Tap "🎮 Play Now" to begin your adventure!

💎 **Pro Tip:** Share your referral link to earn bonus TAMA!""",
                
                'ru': """🎉 **Добро пожаловать в Solana Tamagotchi!**

Лучшая Play-to-Earn NFT игра с питомцами на Solana! 🐾

🎮 **Возможности игры:**
• 🐾 Усыновляй и расти уникальных NFT питомцев
• 🎰 Играй в Lucky Slots и Lucky Wheel
• 💰 Зарабатывай токены TAMA
• 🏆 Соревнуйся в мировых рейтингах
• 🎁 Выполняй ежедневные квесты
• 🤝 Приглашай друзей, получай 1,000 TAMA за каждого!

🚀 **Готов начать?**
Нажми "🎮 Играть" чтобы начать своё приключение!

💎 **Совет:** Делись своей реферальной ссылкой, чтобы заработать бонусные TAMA!""",

                'zh': """🎉 **欢迎来到 Solana Tamagotchi！**

Solana 上终极的 Play-to-Earn NFT 宠物游戏！ 🐾

🎮 **游戏功能：**
• 🐾 领养和培育独特的 NFT 宠物
• 🎰 玩幸运老虎机和幸运轮盘
• 💰 赚取 TAMA 代币
• 🏆 在全球排行榜上竞争
• 🎁 完成每日任务
• 🤝 邀请朋友，每位推荐可获得 1,000 TAMA！

🚀 **准备好开始了吗？**
点击"🎮 开始游戏"开始你的冒险！

💎 **专业提示：** 分享你的推荐链接以赚取额外的 TAMA！"""
            },

            'help': {
                'en': """📚 **Solana Tamagotchi Commands**

**Game Commands:**
/start - Start playing
/stats - View your statistics
/profile - Your profile & achievements
/leaderboard - Top 10 players
/daily - Claim daily reward

**NFT Commands:**
/mint - Mint your NFT (boost earnings!)
/nfts - View your NFT collection
/tiers - NFT tier information

**Social Commands:**
/invite - Get your referral link
/community - Join our community

**Info Commands:**
/help - This message
/about - About the project
/tokenomics - TAMA token info

**Need help?** Join @gotchigamechat""",
                'ru': """📚 **Команды Solana Tamagotchi**

**Игровые команды:**
/start - Начать играть
/stats - Твоя статистика
/profile - Профиль и достижения
/leaderboard - Топ 10 игроков
/daily - Забрать ежедневную награду

**NFT команды:**
/mint - Минт NFT (увеличь заработок!)
/nfts - Твоя NFT коллекция
/tiers - Информация о тирах

**Социальные команды:**
/invite - Реферальная ссылка
/community - Наше сообщество

**Инфо команды:**
/help - Это сообщение
/about - О проекте
/tokenomics - Инфо о токене TAMA

**Нужна помощь?** Присоединяйся @gotchigamechat"""
            },

            'stats': {
                'header_en': "📊 **Your Statistics**\n\n",
                'header_ru': "📊 **Твоя статистика**\n\n",
                'level_en': "🎯 Level: {level}",
                'level_ru': "🎯 Уровень: {level}",
                'xp_en': "⭐ XP: {xp}/{next_xp}",
                'xp_ru': "⭐ Опыт: {xp}/{next_xp}",
                'tama_en': "💰 TAMA Balance: {tama}",
                'tama_ru': "💰 Баланс TAMA: {tama}",
                'rank_en': "🏆 Rank: #{rank}",
                'rank_ru': "🏆 Рейтинг: #{rank}",
                'pet_en': "🐾 Current Pet: {pet}",
                'pet_ru': "🐾 Текущий питомец: {pet}",
                'stage_en': "📈 Evolution Stage: {stage}",
                'stage_ru': "📈 Стадия эволюции: {stage}",
                'nft_en': "💎 NFTs Owned: {nft_count}",
                'nft_ru': "💎 Твои NFT: {nft_count}",
                'multiplier_en': "⚡ Earning Multiplier: {multiplier}x",
                'multiplier_ru': "⚡ Множитель заработка: {multiplier}x",
                'referrals_en': "👥 Referrals: {referrals}",
                'referrals_ru': "👥 Рефералы: {referrals}",
            },

            'mint': {
                'en': """💎 **Mint Your Solana Tamagotchi NFT**

NFT = Boosted earnings + Exclusive benefits!

**5 Tiers Available:**

🥉 **Bronze** - 10 SOL
   • 2x earnings multiplier
   • Entry tier, great start!

🥈 **Silver** - 25 SOL
   • 3x earnings multiplier
   • More rewards per action

🥇 **Gold** - 50 SOL
   • 5x earnings multiplier
   • Premium earnings

💠 **Platinum** - 100 SOL
   • 7x earnings multiplier
   • Elite tier benefits

💎 **Diamond** - 250 SOL
   • 10x earnings multiplier
   • MAXIMUM earnings!

**Mint Now:** https://solanatamagotchi.com/mint.html

*All NFTs have unique art + permanent earning boost!*""",
                'ru': """💎 **Минт Solana Tamagotchi NFT**

NFT = Увеличенный заработок + Эксклюзивные бонусы!

**5 Тиров Доступны:**

🥉 **Бронза** - 10 SOL
   • Множитель заработка 2x
   • Начальный тир, отличный старт!

🥈 **Серебро** - 25 SOL
   • Множитель заработка 3x
   • Больше наград за действия

🥇 **Золото** - 50 SOL
   • Множитель заработка 5x
   • Премиум заработок

💠 **Платина** - 100 SOL
   • Множитель заработка 7x
   • Элитный тир

💎 **Алмаз** - 250 SOL
   • Множитель заработка 10x
   • МАКСИМАЛЬНЫЙ заработок!

**Минтить здесь:** https://solanatamagotchi.com/mint.html

*Все NFT уникальны + постоянный буст заработка!*"""
            },

            'leaderboard': {
                'header_en': "🏆 **Top 10 Players**\n\n",
                'header_ru': "🏆 **Топ 10 Игроков**\n\n",
                'no_data_en': "No players yet. Be the first!",
                'no_data_ru': "Пока нет игроков. Стань первым!",
            },

            'daily': {
                'claimed_en': "🎁 Daily reward claimed: +{amount} TAMA!\n\nCome back tomorrow for more!",
                'claimed_ru': "🎁 Ежедневная награда получена: +{amount} TAMA!\n\nВозвращайся завтра за новой!",
                'already_claimed_en': "⏰ You already claimed your daily reward!\n\nCome back in {hours}h {minutes}m",
                'already_claimed_ru': "⏰ Ты уже забрал награду сегодня!\n\nВозвращайся через {hours}ч {minutes}м",
            },

            'about': {
                'en': """🎮 **About Solana Tamagotchi**

Childhood memories meet Web3 gaming! 🐾

**What is it?**
Play-to-Earn Tamagotchi game on Solana blockchain. Feed your pet, play mini-games, earn TAMA tokens!

**Key Features:**
• 5 unique pet types with 10 evolution stages
• Real earnings with $TAMA token (1:1 ratio at launch)
• NFT system with 5 tiers (Bronze to Diamond)
• Mini-games, daily rewards, achievements
• Referral system & leaderboards
• Fast & cheap on Solana ⚡

**Tokenomics:**
• Total Supply: 1,000,000,000 TAMA
• Network: Solana Devnet → Mainnet Q1 2026
• Deflationary (weekly burns)

**Links:**
🌐 Website: https://solanatamagotchi.com
🎮 Play: t.me/gotchigame_bot
💬 Community: t.me/gotchigamechat
📊 Treasury: solanatamagotchi.com/treasury-monitor.html

Join us! 🚀""",
                'ru': """🎮 **О Solana Tamagotchi**

Детские воспоминания встречают Web3 гейминг! 🐾

**Что это?**
Play-to-Earn Tamagotchi игра на блокчейне Solana. Корми питомца, играй в мини-игры, зарабатывай TAMA токены!

**Ключевые фичи:**
• 5 уникальных типов питомцев с 10 стадиями эволюции
• Реальный заработок с токеном $TAMA (1:1 при запуске)
• NFT система с 5 тирами (Бронза до Алмаза)
• Мини-игры, ежедневные награды, достижения
• Реферальная система и лидерборды
• Быстро и дешево на Solana ⚡

**Токеномика:**
• Общая эмиссия: 1,000,000,000 TAMA
• Сеть: Solana Devnet → Mainnet Q1 2026
• Дефляционная модель (еженедельные сжигания)

**Ссылки:**
🌐 Сайт: https://solanatamagotchi.com
🎮 Играть: t.me/gotchigame_bot
💬 Сообщество: t.me/gotchigamechat
📊 Казначейство: solanatamagotchi.com/treasury-monitor.html

Присоединяйся! 🚀"""
            },

            'tokenomics': {
                'en': """💰 **TAMA Token Economics**

**Basic Info:**
• Token: TAMA (Tamagotchi Token)
• Network: Solana
• Total Supply: 1,000,000,000 TAMA
• Decimals: 9
• Contract: `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`

**Distribution:**
• 40% - Play-to-Earn Pool
• 20% - Treasury
• 15% - Liquidity
• 10% - Team (vested)
• 10% - NFT Rewards
• 5% - Marketing

**Burn Mechanism:**
• Weekly burns from NFT sales
• Deflationary model
• Track burns: solanatamagotchi.com/treasury-monitor.html

**Launch:**
• Devnet: ✅ Active
• Mainnet: Q1 2026
• Conversion: 1:1 (game TAMA → DEX TAMA)

🔥 Every burn = less supply = more value!

View live stats: https://solanatamagotchi.com/treasury-monitor.html""",
                'ru': """💰 **Токеномика TAMA**

**Основная инфо:**
• Токен: TAMA (Tamagotchi Token)
• Сеть: Solana
• Общая эмиссия: 1,000,000,000 TAMA
• Decimals: 9
• Контракт: `Fuqw8Zg17XhHGXfghLYD1fqjxJa1PnmG2MmoqG5pcmLY`

**Распределение:**
• 40% - Play-to-Earn Пул
• 20% - Казначейство
• 15% - Ликвидность
• 10% - Команда (vested)
• 10% - NFT Награды
• 5% - Маркетинг

**Механизм сжигания:**
• Еженедельные сжигания с продаж NFT
• Дефляционная модель
• Смотри сжигания: solanatamagotchi.com/treasury-monitor.html

**Запуск:**
• Devnet: ✅ Активен
• Mainnet: Q1 2026
• Конвертация: 1:1 (игровой TAMA → DEX TAMA)

🔥 Каждое сжигание = меньше эмиссия = больше ценность!

Смотри живую статистику: https://solanatamagotchi.com/treasury-monitor.html"""
            },

            'invite': {
                'en': """👥 **Invite Friends & Earn!**

Your referral link:
`https://t.me/gotchigame_bot?start={user_id}`

**Rewards:**
• You get: 10% of your friend's earnings
• Friend gets: 5% bonus on signup
• Both earn more TAMA!

**How it works:**
1. Share your link with friends
2. They sign up & start playing
3. You both earn bonus TAMA!

Current referrals: {referral_count}
Total earned from referrals: {referral_earnings} TAMA

Share now! 🚀""",
                'ru': """👥 **Приглашай друзей и зарабатывай!**

Твоя реферальная ссылка:
`https://t.me/gotchigame_bot?start={user_id}`

**Награды:**
• Ты получаешь: 10% от заработка друга
• Друг получает: 5% бонус при регистрации
• Оба зарабатываете больше TAMA!

**Как работает:**
1. Поделись ссылкой с друзьями
2. Они регистрируются и начинают играть
3. Вы оба получаете бонусы TAMA!

Текущих рефералов: {referral_count}
Заработано с рефералов: {referral_earnings} TAMA

Поделись сейчас! 🚀"""
            },

            'profile': {
                'en': """👤 **Your Profile**

🎯 Level: {level}
⭐ XP: {xp}/{next_xp}
💰 TAMA Balance: {tama}
🏆 Rank: #{rank}
🐾 Current Pet: {pet}
📈 Evolution Stage: {stage}
💎 NFTs Owned: {nft_count}
⚡ Earning Multiplier: {multiplier}x
👥 Referrals: {referrals}
🔥 Daily Streak: {streak} days

Keep playing to level up! 🚀""",
                'ru': """👤 **Твой профиль**

🎯 Уровень: {level}
⭐ Опыт: {xp}/{next_xp}
💰 Баланс TAMA: {tama}
🏆 Рейтинг: #{rank}
🐾 Текущий питомец: {pet}
📈 Стадия эволюции: {stage}
💎 Твои NFT: {nft_count}
⚡ Множитель заработка: {multiplier}x
👥 Рефералы: {referrals}
🔥 Серия дней: {streak} дн.

Продолжай играть чтобы повысить уровень! 🚀"""
            },

            'nfts': {
                'header_en': "🖼️ **Your NFT Collection**\n\n",
                'header_ru': "🖼️ **Твоя NFT коллекция**\n\n",
                'no_nfts_en': "🎨 No NFTs found\n\n💰 Mint your first NFT with /mint!",
                'no_nfts_ru': "🎨 NFT не найдены\n\n💰 Минти свой первый NFT командой /mint!",
                'total_en': "\n📊 **Total:** {count} NFTs\n⚡ **Combined Multiplier:** {multiplier}x",
                'total_ru': "\n📊 **Всего:** {count} NFT\n⚡ **Суммарный множитель:** {multiplier}x",
            },

            'badges': {
                'header_en': "🏆 **Your Badges**\n\n",
                'header_ru': "🏆 **Твои значки**\n\n",
                'no_badges_en': "No badges yet. Play and invite friends!",
                'no_badges_ru': "Пока нет значков. Играй и приглашай друзей!",
                'total_en': "\n🎖️ **Total Badges:** {count}",
                'total_ru': "\n🎖️ **Всего значков:** {count}",
            },

            'rank': {
                'header_en': "👑 **Your Rank**\n\n",
                'header_ru': "👑 **Твой ранг**\n\n",
                'current_en': "🎖️ Current Rank: {rank_name}\n💎 Rank Bonus: {bonus} TAMA",
                'current_ru': "🎖️ Текущий ранг: {rank_name}\n💎 Бонус ранга: {bonus} TAMA",
                'next_en': "\n📈 Next Rank: {next_rank_name}\n👥 Need {needed} more referrals",
                'next_ru': "\n📈 Следующий ранг: {next_rank_name}\n👥 Нужно ещё {needed} рефералов",
                'max_en': "\n🌟 You reached the maximum rank!",
                'max_ru': "\n🌟 Ты достиг максимального ранга!",
            },

            'quests': {
                'header_en': "📋 **Referral Quests**\n\n",
                'header_ru': "📋 **Реферальные квесты**\n\n",
                'completed_en': "✅ Completed\n",
                'completed_ru': "✅ Выполнено\n",
                'in_progress_en': "🔄 In Progress\n",
                'in_progress_ru': "🔄 В процессе\n",
                'footer_en': "\n💡 Invite friends to complete more quests!",
                'footer_ru': "\n💡 Приглашай друзей чтобы выполнить больше квестов!",
            },

            'tiers': {
                'en': """💎 **NFT Tiers & Benefits**

🥉 **Bronze** - 10 SOL
   • 2x earnings multiplier
   • Basic NFT artwork
   • Entry tier benefits

🥈 **Silver** - 25 SOL
   • 3x earnings multiplier
   • Enhanced artwork
   • Silver tier perks

🥇 **Gold** - 50 SOL
   • 5x earnings multiplier
   • Premium artwork
   • Gold tier rewards

💠 **Platinum** - 100 SOL
   • 7x earnings multiplier
   • Exclusive artwork
   • Elite tier access

💎 **Diamond** - 250 SOL
   • 10x earnings multiplier
   • Ultra-rare artwork
   • MAXIMUM benefits!

**Mint here:** https://solanatamagotchi.com/mint.html

*All NFTs boost your earnings forever!*""",
                'ru': """💎 **NFT Тиры и Преимущества**

🥉 **Бронза** - 10 SOL
   • Множитель заработка 2x
   • Базовый арт NFT
   • Начальный тир

🥈 **Серебро** - 25 SOL
   • Множитель заработка 3x
   • Улучшенный арт
   • Серебряные привилегии

🥇 **Золото** - 50 SOL
   • Множитель заработка 5x
   • Премиум арт
   • Золотые награды

💠 **Платина** - 100 SOL
   • Множитель заработка 7x
   • Эксклюзивный арт
   • Элитный доступ

💎 **Алмаз** - 250 SOL
   • Множитель заработка 10x
   • Ультра-редкий арт
   • МАКСИМАЛЬНЫЕ преимущества!

**Минтить здесь:** https://solanatamagotchi.com/mint.html

*Все NFT увеличивают заработок навсегда!*"""
            },

            'community': {
                'en': """👥 **Join Our Community!**

💬 **Chat:** @gotchigamechat
📢 **Channel:** @gotchigame
🐦 **Twitter:** https://x.com/gotchigame
🌐 **Website:** https://solanatamagotchi.com

**Partnership inquiries:** gotchigame@proton.me

Join us and stay updated! 🚀""",
                'ru': """👥 **Присоединяйся к сообществу!**

💬 **Чат:** @gotchigamechat
📢 **Канал:** @gotchigame
🐦 **Twitter:** https://x.com/gotchigame
🌐 **Сайт:** https://solanatamagotchi.com

**Вопросы партнерства:** gotchigame@proton.me

Присоединяйся и будь в курсе! 🚀"""
            },

            'withdraw': {
                'en': """💸 **Withdraw TAMA**

🚀 **Mainnet Launch:** Q1 2026

**What you need to know:**
• All in-game TAMA converts 1:1 to mainnet token
• Your balance will be automatically migrated
• No action needed from you!

**Current Status:**
• Devnet: ✅ Active (testing phase)
• Mainnet: 🔄 Coming Q1 2026

Your TAMA is safe! Keep earning! 💰

📊 **Track balances:** https://solanatamagotchi.com/treasury-monitor.html""",
                'ru': """💸 **Вывод TAMA**

🚀 **Запуск Mainnet:** Q1 2026

**Что нужно знать:**
• Весь игровой TAMA конвертируется 1:1 в mainnet токен
• Твой баланс будет автоматически перенесён
• От тебя ничего не требуется!

**Текущий статус:**
• Devnet: ✅ Активен (тестовая фаза)
• Mainnet: 🔄 Запуск Q1 2026

Твои TAMA в безопасности! Продолжай зарабатывать! 💰

📊 **Отслеживай балансы:** https://solanatamagotchi.com/treasury-monitor.html"""
            },

            # BUTTONS
            'button_play': {
                'en': '🎮 Play Game',
                'ru': '🎮 Играть'
            },
            'button_mint': {
                'en': '💎 Mint NFT',
                'ru': '💎 Минт NFT'
            },
            'button_stats': {
                'en': '📊 My Stats',
                'ru': '📊 Моя статистика'
            },
            'button_help': {
                'en': '❓ Help',
                'ru': '❓ Помощь'
            },
            'button_community': {
                'en': '💬 Community',
                'ru': '💬 Сообщество'
            },

            # LANGUAGE SELECTION
            'choose_language': {
                'en': '🌍 **Choose Your Language / Выбери язык**\n\nSelect your preferred language for bot messages:',
                'ru': '🌍 **Choose Your Language / Выбери язык**\n\nВыбери предпочитаемый язык для сообщений бота:'
            },
            'language_changed': {
                'en': '✅ Language changed to English!',
                'ru': '✅ Язык изменён на русский!'
            },
            'language_command_info': {
                'en': '💡 You can change language anytime using /language command',
                'ru': '💡 Ты можешь изменить язык в любое время командой /language'
            },
            
            # ERROR MESSAGES
            'error_generic': {
                'en': '❌ Something went wrong. Please try again.',
                'ru': '❌ Что-то пошло не так. Попробуй ещё раз.'
            },
            'error_no_data': {
                'en': '⚠️ No data found. Start playing first!',
                'ru': '⚠️ Данных нет. Начни играть сначала!'
            },
            'error_api': {
                'en': '❌ API error. Please try again later.',
                'ru': '❌ Ошибка API. Попробуй позже.'
            },
            
            # SUCCESS MESSAGES
            'success_generic': {
                'en': '✅ Success!',
                'ru': '✅ Готово!'
            },
        }

    def detect_language(self, text: str = None, user_id: int = None, user_lang: str = None) -> str:
        """
        Detect user language
        Priority: 1) User preference (DB), 2) Telegram lang_code, 3) Message text, 4) Default EN
        
        Args:
            text: Message text to analyze
            user_id: User ID (for DB lookup - future)
            user_lang: User's saved language preference from DB
        """
        # 1. User preference from DB (highest priority)
        if user_lang:
            return user_lang
        
        # 2. Detect from message text
        if text:
            cyrillic_pattern = re.compile('[а-яА-ЯёЁ]')
            if cyrillic_pattern.search(text):
                return 'ru'
        
        # 3. Default
        return 'en'

    def t(self, key: str, lang: str = 'en', **kwargs) -> str:
        """
        Translate a key

        Args:
            key: Translation key (e.g., 'start', 'button_play')
            lang: Language code ('en' or 'ru')
            **kwargs: Format variables

        Returns:
            Translated string
        """
        if key not in self.translations:
            return f"[MISSING: {key}]"

        translation = self.translations[key]

        # Handle simple string translations
        if isinstance(translation, dict) and lang in translation:
            text = translation[lang]
        elif isinstance(translation, dict) and f'{key}_{lang}' in translation:
            text = translation[f'{key}_{lang}']
        else:
            text = translation.get('en', f"[MISSING: {key}_{lang}]")

        # Format with variables
        try:
            return text.format(**kwargs)
        except KeyError:
            return text

    def get_button_text(self, button_key: str, lang: str = 'en') -> str:
        """Get translated button text"""
        return self.t(button_key, lang)


# Global instance
i18n = Localization()


# Helper functions
def detect_language(text: str = None, user_id: int = None) -> str:
    """Detect user language"""
    return i18n.detect_language(text, user_id)


def t(key: str, lang: str = 'en', **kwargs) -> str:
    """Translate a key"""
    return i18n.t(key, lang, **kwargs)


# Testing
if __name__ == '__main__':
    print("🧪 Testing localization...\n")

    # Test English
    print("=== ENGLISH ===")
    print(t('start', 'en'))
    print()

    # Test Russian
    print("=== RUSSIAN ===")
    print(t('start', 'ru'))
    print()

    # Test language detection
    print("=== DETECTION ===")
    print(f"'Hello' -> {detect_language('Hello')}")
    print(f"'Привет' -> {detect_language('Привет')}")
    print(f"'How are you?' -> {detect_language('How are you?')}")
    print(f"'Как дела?' -> {detect_language('Как дела?')}")

