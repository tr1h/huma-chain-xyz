# -*- coding: utf-8 -*-
"""
🌍 Bot Translations
Centralized translation system for easy language management
"""

TRANSLATIONS = {
    'welcome': {
        'en': """🎉 **Welcome to Solana Tamagotchi!**

You were invited by a friend! 🎁

🔗 **Start earning TAMA:**
• Get your referral link below
• Share with friends = 1,000 TAMA each!
• Milestone bonuses up to 100,000 TAMA!

🎮 **Game Features:**
• 🐾 Adopt and raise NFT pets
• 🎰 Play Lucky Slots & Lucky Wheel
• 💰 Earn TAMA tokens
• 🏆 Compete on leaderboards
• 🎁 Complete quests for rewards

🚀 **Ready to start earning?**
Tap "🎮 Play Now" to begin your adventure!""",
        
        'ru': """🎉 **Добро пожаловать в Solana Tamagotchi!**

Тебя пригласил друг! 🎁

🔗 **Начни зарабатывать TAMA:**
• Получи свою реферальную ссылку ниже
• Делись с друзьями = 1,000 TAMA за каждого!
• Бонусы за вехи до 100,000 TAMA!

🎮 **Возможности игры:**
• 🐾 Усыновляй и расти NFT питомцев
• 🎰 Играй в Lucky Slots и Lucky Wheel
• 💰 Зарабатывай токены TAMA
• 🏆 Соревнуйся в таблицах лидеров
• 🎁 Выполняй квесты за награды

🚀 **Готов начать зарабатывать?**
Нажми "🎮 Играть" чтобы начать своё приключение!""",

        'zh': """🎉 **欢迎来到 Solana Tamagotchi！**

你被朋友邀请了！ 🎁

🔗 **开始赚取 TAMA：**
• 获取您的推荐链接
• 分享给朋友 = 每人 1,000 TAMA！
• 里程碑奖金高达 100,000 TAMA！

🎮 **游戏功能：**
• 🐾 领养和培育 NFT 宠物
• 🎰 玩幸运老虎机和幸运轮盘
• 💰 赚取 TAMA 代币
• 🏆 在排行榜上竞争
• 🎁 完成任务获得奖励

🚀 **准备好开始赚钱了吗？**
点击"🎮 开始游戏"开始你的冒险！"""
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
• 🤝 邀请朋友，每次推荐赚取 1,000 TAMA！

🚀 **准备好开始了吗？**
点击"🎮 开始游戏"开始你的冒险！

💎 **专业提示：** 分享您的推荐链接以赚取奖励 TAMA！"""
    },

    'play_button': {
        'en': '🎮 Play Now',
        'ru': '🎮 Играть',
        'zh': '🎮 开始游戏'
    },

    'balance_button': {
        'en': '💰 Balance',
        'ru': '💰 Баланс',
        'zh': '💰 余额'
    },

    'referral_button': {
        'en': '🎁 Invite Friends',
        'ru': '🎁 Пригласить друзей',
        'zh': '🎁 邀请朋友'
    },

    'stats_button': {
        'en': '📊 Stats',
        'ru': '📊 Статистика',
        'zh': '📊 统计'
    },

    'quests_button': {
        'en': '🎯 Quests',
        'ru': '🎯 Квесты',
        'zh': '🎯 任务'
    },

    'language_button': {
        'en': '🌍 Language',
        'ru': '🌍 Язык',
        'zh': '🌍 语言'
    },

    'help_button': {
        'en': '❓ Help',
        'ru': '❓ Помощь',
        'zh': '❓ 帮助'
    }
}

def get_text(key: str, lang: str = 'en', **kwargs) -> str:
    """
    Get translated text by key
    
    Args:
        key: Translation key
        lang: Language code ('en', 'ru', 'zh', etc.)
        **kwargs: Variables to format into text
    
    Returns:
        Translated text (falls back to English if translation not found)
    """
    if key not in TRANSLATIONS:
        return f"[Missing translation: {key}]"
    
    texts = TRANSLATIONS[key]
    text = texts.get(lang, texts.get('en', f"[No translation for {key}]"))
    
    # Format with variables if provided
    if kwargs:
        try:
            text = text.format(**kwargs)
        except KeyError as e:
            print(f"⚠️ Missing variable in translation {key}: {e}")
    
    return text

def get_supported_languages():
    """Get list of supported language codes"""
    # Check first translation key to see what languages are available
    first_key = list(TRANSLATIONS.keys())[0]
    return list(TRANSLATIONS[first_key].keys())

def add_language(lang_code: str, translations_dict: dict):
    """
    Add a new language to all translation keys
    
    Args:
        lang_code: Language code (e.g., 'es', 'fr', 'de')
        translations_dict: Dict mapping translation keys to translated text
    
    Example:
        add_language('es', {
            'welcome': '¡Bienvenido!',
            'play_button': '🎮 Jugar'
        })
    """
    for key, text in translations_dict.items():
        if key in TRANSLATIONS:
            TRANSLATIONS[key][lang_code] = text
        else:
            print(f"⚠️ Warning: Translation key '{key}' not found")

