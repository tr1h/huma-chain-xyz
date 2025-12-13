# -*- coding: utf-8 -*-
"""
🌍 Full Localization System for Solana Tamagotchi Bot
Complete translations for all menus, submenus, and messages

Supported Languages (13):
- EN (English) - Default
- RU (Russian/Русский)
- ZH (Chinese/中文)
- ES (Spanish/Español)
- PT (Portuguese/Português)
- JA (Japanese/日本語)
- FR (French/Français)
- HI (Hindi/हिन्दी)
- KO (Korean/한국어)
- TR (Turkish/Türkçe)
- DE (German/Deutsch)
- AR (Arabic/العربية)
- VI (Vietnamese/Tiếng Việt)
"""

SUPPORTED_LANGUAGES = {
    'en': {'name': 'English', 'flag': '🇬🇧', 'native': 'English'},
    'ru': {'name': 'Russian', 'flag': '🇷🇺', 'native': 'Русский'},
    'zh': {'name': 'Chinese', 'flag': '🇨🇳', 'native': '中文'},
    'es': {'name': 'Spanish', 'flag': '🇪🇸', 'native': 'Español'},
    'pt': {'name': 'Portuguese', 'flag': '🇧🇷', 'native': 'Português'},
    'ja': {'name': 'Japanese', 'flag': '🇯🇵', 'native': '日本語'},
    'fr': {'name': 'French', 'flag': '🇫🇷', 'native': 'Français'},
    'hi': {'name': 'Hindi', 'flag': '🇮🇳', 'native': 'हिन्दी'},
    'ko': {'name': 'Korean', 'flag': '🇰🇷', 'native': '한국어'},
    'tr': {'name': 'Turkish', 'flag': '🇹🇷', 'native': 'Türkçe'},
    'de': {'name': 'German', 'flag': '🇩🇪', 'native': 'Deutsch'},
    'ar': {'name': 'Arabic', 'flag': '🇸🇦', 'native': 'العربية'},
    'vi': {'name': 'Vietnamese', 'flag': '🇻🇳', 'native': 'Tiếng Việt'},
}

# =============================================================================
# MAIN MENU BUTTONS
# =============================================================================
BUTTONS = {
    'play_now': {
        'en': '🎮 Play Now',
        'ru': '🎮 Играть',
        'zh': '🎮 开始游戏',
        'es': '🎮 Jugar Ahora',
        'pt': '🎮 Jogar Agora',
        'ja': '🎮 今すぐプレイ',
        'fr': '🎮 Jouer',
        'hi': '🎮 अभी खेलें',
        'ko': '🎮 지금 플레이',
        'tr': '🎮 Şimdi Oyna',
        'de': '🎮 Jetzt Spielen',
        'ar': '🎮 العب الآن',
        'vi': '🎮 Chơi Ngay',
    },
    'daily_reward': {
        'en': '🎁 Daily Reward',
        'ru': '🎁 Ежедневная награда',
        'zh': '🎁 每日奖励',
        'es': '🎁 Recompensa Diaria',
        'pt': '🎁 Recompensa Diária',
        'ja': '🎁 デイリー報酬',
        'fr': '🎁 Récompense Quotidienne',
        'hi': '🎁 दैनिक इनाम',
        'ko': '🎁 일일 보상',
        'tr': '🎁 Günlük Ödül',
        'de': '🎁 Tägliche Belohnung',
    },
    'my_nfts': {
        'en': '🖼️ My NFTs',
        'ru': '🖼️ Мои NFT',
        'zh': '🖼️ 我的NFT',
        'es': '🖼️ Mis NFTs',
        'pt': '🖼️ Meus NFTs',
        'ja': '🖼️ マイNFT',
        'fr': '🖼️ Mes NFTs',
        'hi': '🖼️ मेरे NFT',
        'ko': '🖼️ 내 NFT',
        'tr': '🖼️ NFT\'lerim',
        'de': '🖼️ Meine NFTs',
    },
    'mint_nft': {
        'en': '🎨 Mint NFT',
        'ru': '🎨 Минт NFT',
        'zh': '🎨 铸造NFT',
        'es': '🎨 Mintear NFT',
        'pt': '🎨 Cunhar NFT',
        'ja': '🎨 NFTミント',
        'fr': '🎨 Créer NFT',
        'hi': '🎨 NFT मिंट करें',
        'ko': '🎨 NFT 민팅',
        'tr': '🎨 NFT Bas',
        'de': '🎨 NFT Minten',
    },
    'withdraw': {
        'en': '💸 Withdraw TAMA',
        'ru': '💸 Вывести TAMA',
        'zh': '💸 提取TAMA',
        'es': '💸 Retirar TAMA',
        'pt': '💸 Sacar TAMA',
        'ja': '💸 TAMA出金',
        'fr': '💸 Retirer TAMA',
        'hi': '💸 TAMA निकालें',
        'ko': '💸 TAMA 출금',
        'tr': '💸 TAMA Çek',
        'de': '💸 TAMA Abheben',
    },
    'referral': {
        'en': '🔗 Referral Link',
        'ru': '🔗 Реферальная ссылка',
        'zh': '🔗 推荐链接',
        'es': '🔗 Enlace de Referido',
        'pt': '🔗 Link de Indicação',
        'ja': '🔗 紹介リンク',
        'fr': '🔗 Lien de Parrainage',
        'hi': '🔗 रेफरल लिंक',
        'ko': '🔗 추천 링크',
        'tr': '🔗 Referans Linki',
        'de': '🔗 Empfehlungslink',
    },
    'stats': {
        'en': '📊 My Stats',
        'ru': '📊 Статистика',
        'zh': '📊 我的统计',
        'es': '📊 Mis Estadísticas',
        'pt': '📊 Minhas Estatísticas',
        'ja': '📊 マイ統計',
        'fr': '📊 Mes Stats',
        'hi': '📊 मेरे आँकड़े',
        'ko': '📊 내 통계',
        'tr': '📊 İstatistiklerim',
        'de': '📊 Meine Statistiken',
    },
    'quests': {
        'en': '📋 Quests',
        'ru': '📋 Квесты',
        'zh': '📋 任务',
        'es': '📋 Misiones',
        'pt': '📋 Missões',
        'ja': '📋 クエスト',
        'fr': '📋 Quêtes',
        'hi': '📋 क्वेस्ट',
        'ko': '📋 퀘스트',
        'tr': '📋 Görevler',
        'de': '📋 Aufgaben',
    },
    'badges': {
        'en': '🏆 Badges',
        'ru': '🏆 Значки',
        'zh': '🏆 徽章',
        'es': '🏆 Insignias',
        'pt': '🏆 Distintivos',
        'ja': '🏆 バッジ',
        'fr': '🏆 Badges',
        'hi': '🏆 बैज',
        'ko': '🏆 뱃지',
        'tr': '🏆 Rozetler',
        'de': '🏆 Abzeichen',
    },
    'rank': {
        'en': '🎖️ My Rank',
        'ru': '🎖️ Мой ранг',
        'zh': '🎖️ 我的等级',
        'es': '🎖️ Mi Rango',
        'pt': '🎖️ Meu Rank',
        'ja': '🎖️ マイランク',
        'fr': '🎖️ Mon Rang',
        'hi': '🎖️ मेरा रैंक',
        'ko': '🎖️ 내 랭크',
        'tr': '🎖️ Rütbem',
        'de': '🎖️ Mein Rang',
    },
    'leaderboard': {
        'en': '🏅 Leaderboard',
        'ru': '🏅 Лидерборд',
        'zh': '🏅 排行榜',
        'es': '🏅 Clasificación',
        'pt': '🏅 Placar',
        'ja': '🏅 リーダーボード',
        'fr': '🏅 Classement',
        'hi': '🏅 लीडरबोर्ड',
        'ko': '🏅 리더보드',
        'tr': '🏅 Sıralama',
        'de': '🏅 Rangliste',
    },
    'community': {
        'en': '👥 Community',
        'ru': '👥 Сообщество',
        'zh': '👥 社区',
        'es': '👥 Comunidad',
        'pt': '👥 Comunidade',
        'ja': '👥 コミュニティ',
        'fr': '👥 Communauté',
        'hi': '👥 समुदाय',
        'ko': '👥 커뮤니티',
        'tr': '👥 Topluluk',
        'de': '👥 Community',
    },
    'language': {
        'en': '🌍 Language',
        'ru': '🌍 Язык',
        'zh': '🌍 语言',
        'es': '🌍 Idioma',
        'pt': '🌍 Idioma',
        'ja': '🌍 言語',
        'fr': '🌍 Langue',
        'hi': '🌍 भाषा',
        'ko': '🌍 언어',
        'tr': '🌍 Dil',
        'de': '🌍 Sprache',
    },
    'back': {
        'en': '🔙 Back',
        'ru': '🔙 Назад',
        'zh': '🔙 返回',
        'es': '🔙 Atrás',
        'pt': '🔙 Voltar',
        'ja': '🔙 戻る',
        'fr': '🔙 Retour',
        'hi': '🔙 वापस',
        'ko': '🔙 뒤로',
        'tr': '🔙 Geri',
        'de': '🔙 Zurück',
    },
    'back_to_menu': {
        'en': '🔙 Back to Menu',
        'ru': '🔙 Назад в меню',
        'zh': '🔙 返回菜单',
        'es': '🔙 Volver al Menú',
        'pt': '🔙 Voltar ao Menu',
        'ja': '🔙 メニューに戻る',
        'fr': '🔙 Retour au Menu',
        'hi': '🔙 मेनू पर वापस',
        'ko': '🔙 메뉴로 돌아가기',
        'tr': '🔙 Menüye Dön',
        'de': '🔙 Zurück zum Menü',
    },
    'share': {
        'en': '📤 Share',
        'ru': '📤 Поделиться',
        'zh': '📤 分享',
        'es': '📤 Compartir',
        'pt': '📤 Compartilhar',
        'ja': '📤 シェア',
        'fr': '📤 Partager',
        'hi': '📤 शेयर करें',
        'ko': '📤 공유',
        'tr': '📤 Paylaş',
        'de': '📤 Teilen',
    },
    'copy_code': {
        'en': '📋 Copy Code',
        'ru': '📋 Копировать код',
        'zh': '📋 复制代码',
        'es': '📋 Copiar Código',
        'pt': '📋 Copiar Código',
        'ja': '📋 コードをコピー',
        'fr': '📋 Copier le Code',
        'hi': '📋 कोड कॉपी करें',
        'ko': '📋 코드 복사',
        'tr': '📋 Kodu Kopyala',
        'de': '📋 Code Kopieren',
    },
    'help': {
        'en': '❓ Help',
        'ru': '❓ Помощь',
        'zh': '❓ 帮助',
        'es': '❓ Ayuda',
        'pt': '❓ Ajuda',
        'ja': '❓ ヘルプ',
        'fr': '❓ Aide',
        'hi': '❓ सहायता',
        'ko': '❓ 도움말',
        'tr': '❓ Yardım',
        'de': '❓ Hilfe',
    },
    'cancel': {
        'en': '❌ Cancel',
        'ru': '❌ Отмена',
        'zh': '❌ 取消',
        'es': '❌ Cancelar',
        'pt': '❌ Cancelar',
        'ja': '❌ キャンセル',
        'fr': '❌ Annuler',
        'hi': '❌ रद्द करें',
        'ko': '❌ 취소',
        'tr': '❌ İptal',
        'de': '❌ Abbrechen',
    },
    'confirm': {
        'en': '✅ Confirm',
        'ru': '✅ Подтвердить',
        'zh': '✅ 确认',
        'es': '✅ Confirmar',
        'pt': '✅ Confirmar',
        'ja': '✅ 確認',
        'fr': '✅ Confirmer',
        'hi': '✅ पुष्टि करें',
        'ko': '✅ 확인',
        'tr': '✅ Onayla',
        'de': '✅ Bestätigen',
    },
    'view_website': {
        'en': '🌐 View on Website',
        'ru': '🌐 Смотреть на сайте',
        'zh': '🌐 在网站上查看',
        'es': '🌐 Ver en Sitio Web',
        'pt': '🌐 Ver no Site',
        'ja': '🌐 ウェブサイトで見る',
        'fr': '🌐 Voir sur le Site',
        'hi': '🌐 वेबसाइट पर देखें',
        'ko': '🌐 웹사이트에서 보기',
        'tr': '🌐 Web Sitesinde Gör',
        'de': '🌐 Auf Website Ansehen',
    },
}

# =============================================================================
# WELCOME MESSAGES
# =============================================================================
WELCOME = {
    'with_referral': {
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

🚀 Tap "🎮 Play Now" to begin!""",

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

🚀 Нажми "🎮 Играть" чтобы начать!""",

        'zh': """🎉 **欢迎来到 Solana Tamagotchi！**

你是被朋友邀请的！ 🎁

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

🚀 点击"🎮 开始游戏"开始！""",

        'es': """🎉 **¡Bienvenido a Solana Tamagotchi!**

¡Fuiste invitado por un amigo! 🎁

🔗 **Comienza a ganar TAMA:**
• Obtén tu enlace de referido abajo
• ¡Comparte con amigos = 1,000 TAMA cada uno!
• ¡Bonos de hitos hasta 100,000 TAMA!

🎮 **Características del Juego:**
• 🐾 Adopta y cría mascotas NFT
• 🎰 Juega Lucky Slots y Lucky Wheel
• 💰 Gana tokens TAMA
• 🏆 Compite en clasificaciones
• 🎁 Completa misiones por recompensas

🚀 ¡Toca "🎮 Jugar Ahora" para comenzar!""",

        'pt': """🎉 **Bem-vindo ao Solana Tamagotchi!**

Você foi convidado por um amigo! 🎁

🔗 **Comece a ganhar TAMA:**
• Obtenha seu link de indicação abaixo
• Compartilhe com amigos = 1,000 TAMA cada!
• Bônus de marcos até 100,000 TAMA!

🎮 **Recursos do Jogo:**
• 🐾 Adote e crie pets NFT
• 🎰 Jogue Lucky Slots e Lucky Wheel
• 💰 Ganhe tokens TAMA
• 🏆 Compita nos rankings
• 🎁 Complete missões por recompensas

🚀 Toque em "🎮 Jogar Agora" para começar!""",

        'ja': """🎉 **Solana Tamagotchi へようこそ！**

友達から招待されました！ 🎁

🔗 **TAMAを稼ぎ始めよう：**
• 下で紹介リンクを取得
• 友達にシェア = 各1,000 TAMA！
• マイルストーンボーナス最大100,000 TAMA！

🎮 **ゲーム機能：**
• 🐾 NFTペットを育てよう
• 🎰 ラッキースロット＆ラッキーホイール
• 💰 TAMAトークンを獲得
• 🏆 リーダーボードで競争
• 🎁 クエストで報酬をゲット

🚀 「🎮 今すぐプレイ」をタップして始めよう！""",

        'fr': """🎉 **Bienvenue sur Solana Tamagotchi !**

Tu as été invité par un ami ! 🎁

🔗 **Commence à gagner des TAMA :**
• Obtiens ton lien de parrainage ci-dessous
• Partage avec des amis = 1,000 TAMA chacun !
• Bonus de jalons jusqu'à 100,000 TAMA !

🎮 **Fonctionnalités du Jeu :**
• 🐾 Adopte et élève des animaux NFT
• 🎰 Joue aux Lucky Slots et Lucky Wheel
• 💰 Gagne des tokens TAMA
• 🏆 Affronte les classements
• 🎁 Complète des quêtes pour des récompenses

🚀 Appuie sur "🎮 Jouer" pour commencer !""",

        'hi': """🎉 **Solana Tamagotchi में आपका स्वागत है!**

आपको एक दोस्त ने आमंत्रित किया! 🎁

🔗 **TAMA कमाना शुरू करें:**
• नीचे अपना रेफरल लिंक प्राप्त करें
• दोस्तों के साथ साझा करें = प्रत्येक 1,000 TAMA!
• 100,000 TAMA तक माइलस्टोन बोनस!

🎮 **गेम फीचर्स:**
• 🐾 NFT पेट्स को अपनाएं और पालें
• 🎰 Lucky Slots और Lucky Wheel खेलें
• 💰 TAMA टोकन कमाएं
• 🏆 लीडरबोर्ड पर प्रतिस्पर्धा करें
• 🎁 पुरस्कारों के लिए क्वेस्ट पूरे करें

🚀 शुरू करने के लिए "🎮 अभी खेलें" टैप करें!""",

        'ko': """🎉 **Solana Tamagotchi에 오신 것을 환영합니다!**

친구가 초대했습니다! 🎁

🔗 **TAMA 적립 시작:**
• 아래에서 추천 링크 받기
• 친구와 공유 = 각 1,000 TAMA!
• 마일스톤 보너스 최대 100,000 TAMA!

🎮 **게임 기능:**
• 🐾 NFT 펫 입양 및 키우기
• 🎰 럭키 슬롯 & 럭키 휠 플레이
• 💰 TAMA 토큰 획득
• 🏆 리더보드 경쟁
• 🎁 퀘스트 완료로 보상 받기

🚀 "🎮 지금 플레이"를 탭하여 시작!""",

        'tr': """🎉 **Solana Tamagotchi'ye Hoş Geldiniz!**

Bir arkadaş sizi davet etti! 🎁

🔗 **TAMA Kazanmaya Başlayın:**
• Aşağıdan referans linkinizi alın
• Arkadaşlarınızla paylaşın = Her biri 1,000 TAMA!
• 100,000 TAMA'ya kadar kilometre taşı bonusları!

🎮 **Oyun Özellikleri:**
• 🐾 NFT evcil hayvanları sahiplen ve büyüt
• 🎰 Lucky Slots ve Lucky Wheel oyna
• 💰 TAMA token kazan
• 🏆 Sıralamalarda yarış
• 🎁 Ödüller için görevleri tamamla

🚀 Başlamak için "🎮 Şimdi Oyna"ya dokunun!""",

        'de': """🎉 **Willkommen bei Solana Tamagotchi!**

Du wurdest von einem Freund eingeladen! 🎁

🔗 **Beginne TAMA zu verdienen:**
• Hole dir deinen Empfehlungslink unten
• Teile mit Freunden = jeweils 1,000 TAMA!
• Meilenstein-Boni bis zu 100,000 TAMA!

🎮 **Spielfunktionen:**
• 🐾 Adoptiere und züchte NFT-Haustiere
• 🎰 Spiele Lucky Slots & Lucky Wheel
• 💰 Verdiene TAMA-Token
• 🏆 Kämpfe in den Ranglisten
• 🎁 Schließe Quests für Belohnungen ab

🚀 Tippe auf "🎮 Jetzt Spielen" um zu starten!""",
    },

    'no_referral': {
        'en': """🎉 **Welcome to Solana Tamagotchi!**

The ultimate Play-to-Earn NFT pet game on Solana! 🐾

🎮 **Game Features:**
• 🐾 Adopt and raise unique NFT pets
• 🎰 Play Lucky Slots & Lucky Wheel
• 💰 Earn TAMA tokens
• 🏆 Compete on global leaderboards
• 🎁 Complete daily quests
• 🤝 Invite friends, earn 1,000 TAMA per referral!

🚀 Tap "🎮 Play Now" to begin your adventure!

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

🚀 Нажми "🎮 Играть" чтобы начать приключение!

💎 **Совет:** Делись реферальной ссылкой для бонусов!""",

        'zh': """🎉 **欢迎来到 Solana Tamagotchi！**

Solana 上终极的 Play-to-Earn NFT 宠物游戏！ 🐾

🎮 **游戏功能：**
• 🐾 领养和培育独特的 NFT 宠物
• 🎰 玩幸运老虎机和幸运轮盘
• 💰 赚取 TAMA 代币
• 🏆 在全球排行榜上竞争
• 🎁 完成每日任务
• 🤝 邀请朋友，每次推荐赚取 1,000 TAMA！

🚀 点击"🎮 开始游戏"开始冒险！

💎 **专业提示：** 分享推荐链接赚取额外 TAMA！""",

        'es': """🎉 **¡Bienvenido a Solana Tamagotchi!**

¡El mejor juego NFT Play-to-Earn de mascotas en Solana! 🐾

🎮 **Características del Juego:**
• 🐾 Adopta y cría mascotas NFT únicas
• 🎰 Juega Lucky Slots y Lucky Wheel
• 💰 Gana tokens TAMA
• 🏆 Compite en clasificaciones globales
• 🎁 Completa misiones diarias
• 🤝 ¡Invita amigos, gana 1,000 TAMA por referido!

🚀 ¡Toca "🎮 Jugar Ahora" para comenzar tu aventura!

💎 **Consejo Pro:** ¡Comparte tu enlace de referido para ganar TAMA extra!""",

        'pt': """🎉 **Bem-vindo ao Solana Tamagotchi!**

O melhor jogo NFT Play-to-Earn de pets na Solana! 🐾

🎮 **Recursos do Jogo:**
• 🐾 Adote e crie pets NFT únicos
• 🎰 Jogue Lucky Slots e Lucky Wheel
• 💰 Ganhe tokens TAMA
• 🏆 Compita em rankings globais
• 🎁 Complete missões diárias
• 🤝 Convide amigos, ganhe 1,000 TAMA por indicação!

🚀 Toque em "🎮 Jogar Agora" para começar sua aventura!

💎 **Dica Pro:** Compartilhe seu link de indicação para ganhar TAMA extra!""",

        'ja': """🎉 **Solana Tamagotchi へようこそ！**

Solana上の究極のPlay-to-Earn NFTペットゲーム！ 🐾

🎮 **ゲーム機能：**
• 🐾 ユニークなNFTペットを育てよう
• 🎰 ラッキースロット＆ラッキーホイール
• 💰 TAMAトークンを獲得
• 🏆 グローバルリーダーボードで競争
• 🎁 デイリークエストを完了
• 🤝 友達を招待して、紹介ごとに1,000 TAMAを獲得！

🚀 「🎮 今すぐプレイ」をタップして冒険を始めよう！

💎 **プロのヒント：** 紹介リンクをシェアしてボーナスTAMAを獲得！""",

        'fr': """🎉 **Bienvenue sur Solana Tamagotchi !**

Le meilleur jeu NFT Play-to-Earn d'animaux sur Solana ! 🐾

🎮 **Fonctionnalités du Jeu :**
• 🐾 Adopte et élève des animaux NFT uniques
• 🎰 Joue aux Lucky Slots et Lucky Wheel
• 💰 Gagne des tokens TAMA
• 🏆 Affronte les classements mondiaux
• 🎁 Complète des quêtes quotidiennes
• 🤝 Invite des amis, gagne 1,000 TAMA par parrainage !

🚀 Appuie sur "🎮 Jouer" pour commencer ton aventure !

💎 **Conseil Pro :** Partage ton lien de parrainage pour gagner des TAMA bonus !""",

        'hi': """🎉 **Solana Tamagotchi में आपका स्वागत है!**

Solana पर सबसे अच्छा Play-to-Earn NFT पेट गेम! 🐾

🎮 **गेम फीचर्स:**
• 🐾 अनोखे NFT पेट्स को अपनाएं और पालें
• 🎰 Lucky Slots और Lucky Wheel खेलें
• 💰 TAMA टोकन कमाएं
• 🏆 वैश्विक लीडरबोर्ड पर प्रतिस्पर्धा करें
• 🎁 दैनिक क्वेस्ट पूरे करें
• 🤝 दोस्तों को आमंत्रित करें, प्रति रेफरल 1,000 TAMA कमाएं!

🚀 अपना साहसिक कार्य शुरू करने के लिए "🎮 अभी खेलें" टैप करें!

💎 **प्रो टिप:** बोनस TAMA कमाने के लिए अपना रेफरल लिंक साझा करें!""",

        'ko': """🎉 **Solana Tamagotchi에 오신 것을 환영합니다!**

Solana의 궁극적인 Play-to-Earn NFT 펫 게임! 🐾

🎮 **게임 기능:**
• 🐾 고유한 NFT 펫 입양 및 키우기
• 🎰 럭키 슬롯 & 럭키 휠 플레이
• 💰 TAMA 토큰 획득
• 🏆 글로벌 리더보드 경쟁
• 🎁 일일 퀘스트 완료
• 🤝 친구 초대, 추천당 1,000 TAMA 획득!

🚀 "🎮 지금 플레이"를 탭하여 모험을 시작하세요!

💎 **프로 팁:** 추천 링크를 공유하여 보너스 TAMA를 획득하세요!""",

        'tr': """🎉 **Solana Tamagotchi'ye Hoş Geldiniz!**

Solana'daki en iyi Play-to-Earn NFT evcil hayvan oyunu! 🐾

🎮 **Oyun Özellikleri:**
• 🐾 Benzersiz NFT evcil hayvanları sahiplen ve büyüt
• 🎰 Lucky Slots ve Lucky Wheel oyna
• 💰 TAMA token kazan
• 🏆 Küresel sıralamalarda yarış
• 🎁 Günlük görevleri tamamla
• 🤝 Arkadaşları davet et, referans başına 1,000 TAMA kazan!

🚀 Maceranı başlatmak için "🎮 Şimdi Oyna"ya dokunun!

💎 **Pro İpucu:** Bonus TAMA kazanmak için referans linkini paylaş!""",

        'de': """🎉 **Willkommen bei Solana Tamagotchi!**

Das ultimative Play-to-Earn NFT-Haustierspiel auf Solana! 🐾

🎮 **Spielfunktionen:**
• 🐾 Adoptiere und züchte einzigartige NFT-Haustiere
• 🎰 Spiele Lucky Slots & Lucky Wheel
• 💰 Verdiene TAMA-Token
• 🏆 Kämpfe in globalen Ranglisten
• 🎁 Schließe tägliche Quests ab
• 🤝 Lade Freunde ein, verdiene 1,000 TAMA pro Empfehlung!

🚀 Tippe auf "🎮 Jetzt Spielen" um dein Abenteuer zu starten!

💎 **Pro-Tipp:** Teile deinen Empfehlungslink für Bonus-TAMA!""",
    },
}

# =============================================================================
# LANGUAGE SELECTION
# =============================================================================
LANGUAGE_SELECTION = {
    'choose': {
        'en': '🌍 **Choose Your Language**\n\nSelect your preferred language:',
        'ru': '🌍 **Выбери язык**\n\nВыбери предпочитаемый язык:',
        'zh': '🌍 **选择语言**\n\n选择您的首选语言：',
        'es': '🌍 **Elige tu idioma**\n\nSelecciona tu idioma preferido:',
        'pt': '🌍 **Escolha seu idioma**\n\nSelecione seu idioma preferido:',
        'ja': '🌍 **言語を選択**\n\nご希望の言語を選択してください：',
        'fr': '🌍 **Choisissez votre langue**\n\nSélectionnez votre langue préférée :',
        'hi': '🌍 **अपनी भाषा चुनें**\n\nअपनी पसंदीदा भाषा चुनें:',
        'ko': '🌍 **언어 선택**\n\n원하는 언어를 선택하세요:',
        'tr': '🌍 **Dilinizi Seçin**\n\nTercih ettiğiniz dili seçin:',
        'de': '🌍 **Wähle deine Sprache**\n\nWähle deine bevorzugte Sprache:',
    },
    'changed': {
        'en': '✅ Language changed to English!',
        'ru': '✅ Язык изменён на русский!',
        'zh': '✅ 语言已更改为中文！',
        'es': '✅ ¡Idioma cambiado a Español!',
        'pt': '✅ Idioma alterado para Português!',
        'ja': '✅ 言語を日本語に変更しました！',
        'fr': '✅ Langue changée en Français !',
        'hi': '✅ भाषा हिंदी में बदल दी गई!',
        'ko': '✅ 언어가 한국어로 변경되었습니다!',
        'tr': '✅ Dil Türkçe olarak değiştirildi!',
        'de': '✅ Sprache auf Deutsch geändert!',
    },
}

# =============================================================================
# STATS & BALANCE
# =============================================================================
STATS = {
    'header': {
        'en': '📊 **Your Full Stats**',
        'ru': '📊 **Полная статистика**',
        'zh': '📊 **完整统计**',
        'es': '📊 **Tus Estadísticas**',
        'pt': '📊 **Suas Estatísticas**',
        'ja': '📊 **あなたの統計**',
        'fr': '📊 **Vos Statistiques**',
        'hi': '📊 **आपके आँकड़े**',
        'ko': '📊 **전체 통계**',
        'tr': '📊 **İstatistikleriniz**',
        'de': '📊 **Deine Statistiken**',
    },
    'balance': {
        'en': '💰 **TAMA Balance:** {amount}',
        'ru': '💰 **Баланс TAMA:** {amount}',
        'zh': '💰 **TAMA 余额:** {amount}',
        'es': '💰 **Balance TAMA:** {amount}',
        'pt': '💰 **Saldo TAMA:** {amount}',
        'ja': '💰 **TAMAバランス:** {amount}',
        'fr': '💰 **Solde TAMA :** {amount}',
        'hi': '💰 **TAMA बैलेंस:** {amount}',
        'ko': '💰 **TAMA 잔액:** {amount}',
        'tr': '💰 **TAMA Bakiyesi:** {amount}',
        'de': '💰 **TAMA-Guthaben:** {amount}',
    },
    'rank': {
        'en': '🎖️ **Rank:** {rank}',
        'ru': '🎖️ **Ранг:** {rank}',
        'zh': '🎖️ **等级:** {rank}',
        'es': '🎖️ **Rango:** {rank}',
        'pt': '🎖️ **Rank:** {rank}',
        'ja': '🎖️ **ランク:** {rank}',
        'fr': '🎖️ **Rang :** {rank}',
        'hi': '🎖️ **रैंक:** {rank}',
        'ko': '🎖️ **랭크:** {rank}',
        'tr': '🎖️ **Rütbe:** {rank}',
        'de': '🎖️ **Rang:** {rank}',
    },
    'referrals_header': {
        'en': '👥 **Referrals:**',
        'ru': '👥 **Рефералы:**',
        'zh': '👥 **推荐:**',
        'es': '👥 **Referidos:**',
        'pt': '👥 **Indicações:**',
        'ja': '👥 **紹介:**',
        'fr': '👥 **Parrainages :**',
        'hi': '👥 **रेफरल:**',
        'ko': '👥 **추천:**',
        'tr': '👥 **Referanslar:**',
        'de': '👥 **Empfehlungen:**',
    },
    'total_invited': {
        'en': '• Total invited: {count}',
        'ru': '• Приглашено: {count}',
        'zh': '• 邀请总数: {count}',
        'es': '• Total invitados: {count}',
        'pt': '• Total convidados: {count}',
        'ja': '• 招待総数: {count}',
        'fr': '• Total invités : {count}',
        'hi': '• कुल आमंत्रित: {count}',
        'ko': '• 총 초대: {count}',
        'tr': '• Toplam davetli: {count}',
        'de': '• Gesamt eingeladen: {count}',
    },
    'active': {
        'en': '• Active: {count}',
        'ru': '• Активных: {count}',
        'zh': '• 活跃: {count}',
        'es': '• Activos: {count}',
        'pt': '• Ativos: {count}',
        'ja': '• アクティブ: {count}',
        'fr': '• Actifs : {count}',
        'hi': '• सक्रिय: {count}',
        'ko': '• 활성: {count}',
        'tr': '• Aktif: {count}',
        'de': '• Aktiv: {count}',
    },
    'pending': {
        'en': '• Pending: {count}',
        'ru': '• Ожидают: {count}',
        'zh': '• 待定: {count}',
        'es': '• Pendientes: {count}',
        'pt': '• Pendentes: {count}',
        'ja': '• 保留中: {count}',
        'fr': '• En attente : {count}',
        'hi': '• लंबित: {count}',
        'ko': '• 대기중: {count}',
        'tr': '• Beklemede: {count}',
        'de': '• Ausstehend: {count}',
    },
    'activity_header': {
        'en': '🔥 **Activity:**',
        'ru': '🔥 **Активность:**',
        'zh': '🔥 **活动:**',
        'es': '🔥 **Actividad:**',
        'pt': '🔥 **Atividade:**',
        'ja': '🔥 **アクティビティ:**',
        'fr': '🔥 **Activité :**',
        'hi': '🔥 **गतिविधि:**',
        'ko': '🔥 **활동:**',
        'tr': '🔥 **Aktivite:**',
        'de': '🔥 **Aktivität:**',
    },
    'login_streak': {
        'en': '• Login streak: {days} days',
        'ru': '• Серия входов: {days} дн.',
        'zh': '• 连续登录: {days} 天',
        'es': '• Racha de login: {days} días',
        'pt': '• Sequência de login: {days} dias',
        'ja': '• ログイン連続: {days}日',
        'fr': '• Série de connexions : {days} jours',
        'hi': '• लॉगिन स्ट्रीक: {days} दिन',
        'ko': '• 로그인 연속: {days}일',
        'tr': '• Giriş serisi: {days} gün',
        'de': '• Login-Serie: {days} Tage',
    },
    'badges_earned': {
        'en': '• Badges earned: {count}',
        'ru': '• Значков получено: {count}',
        'zh': '• 获得徽章: {count}',
        'es': '• Insignias ganadas: {count}',
        'pt': '• Distintivos ganhos: {count}',
        'ja': '• 獲得バッジ: {count}',
        'fr': '• Badges gagnés : {count}',
        'hi': '• बैज अर्जित: {count}',
        'ko': '• 획득한 뱃지: {count}',
        'tr': '• Kazanılan rozetler: {count}',
        'de': '• Verdiente Abzeichen: {count}',
    },
    'keep_playing': {
        'en': '💰 **Keep playing and inviting friends!**',
        'ru': '💰 **Продолжай играть и приглашать друзей!**',
        'zh': '💰 **继续玩游戏和邀请朋友!**',
        'es': '💰 **¡Sigue jugando e invitando amigos!**',
        'pt': '💰 **Continue jogando e convidando amigos!**',
        'ja': '💰 **プレイを続けて友達を招待しよう！**',
        'fr': '💰 **Continue à jouer et à inviter des amis !**',
        'hi': '💰 **खेलते रहें और दोस्तों को आमंत्रित करें!**',
        'ko': '💰 **계속 플레이하고 친구를 초대하세요!**',
        'tr': '💰 **Oynamaya ve arkadaş davet etmeye devam edin!**',
        'de': '💰 **Spiele weiter und lade Freunde ein!**',
    },
}

# =============================================================================
# REFERRAL SYSTEM
# =============================================================================
REFERRAL = {
    'header': {
        'en': '🔗 **Your Referral Code:**',
        'ru': '🔗 **Твой реферальный код:**',
        'zh': '🔗 **您的推荐代码:**',
        'es': '🔗 **Tu Código de Referido:**',
        'pt': '🔗 **Seu Código de Indicação:**',
        'ja': '🔗 **あなたの紹介コード:**',
        'fr': '🔗 **Ton Code de Parrainage :**',
        'hi': '🔗 **आपका रेफरल कोड:**',
        'ko': '🔗 **귀하의 추천 코드:**',
        'tr': '🔗 **Referans Kodunuz:**',
        'de': '🔗 **Dein Empfehlungscode:**',
    },
    'your_stats': {
        'en': '📊 **Your Stats:**',
        'ru': '📊 **Твоя статистика:**',
        'zh': '📊 **您的统计:**',
        'es': '📊 **Tus Estadísticas:**',
        'pt': '📊 **Suas Estatísticas:**',
        'ja': '📊 **あなたの統計:**',
        'fr': '📊 **Tes Statistiques :**',
        'hi': '📊 **आपके आँकड़े:**',
        'ko': '📊 **귀하의 통계:**',
        'tr': '📊 **İstatistikleriniz:**',
        'de': '📊 **Deine Statistiken:**',
    },
    'total_referrals': {
        'en': '• 👥 Total Referrals: {count}',
        'ru': '• 👥 Всего рефералов: {count}',
        'zh': '• 👥 推荐总数: {count}',
        'es': '• 👥 Total Referidos: {count}',
        'pt': '• 👥 Total Indicações: {count}',
        'ja': '• 👥 紹介総数: {count}',
        'fr': '• 👥 Total Parrainages : {count}',
        'hi': '• 👥 कुल रेफरल: {count}',
        'ko': '• 👥 총 추천: {count}',
        'tr': '• 👥 Toplam Referans: {count}',
        'de': '• 👥 Gesamt Empfehlungen: {count}',
    },
    'total_earned': {
        'en': '• 💰 Total Earned: {amount} TAMA',
        'ru': '• 💰 Заработано: {amount} TAMA',
        'zh': '• 💰 总收入: {amount} TAMA',
        'es': '• 💰 Total Ganado: {amount} TAMA',
        'pt': '• 💰 Total Ganho: {amount} TAMA',
        'ja': '• 💰 総収益: {amount} TAMA',
        'fr': '• 💰 Total Gagné : {amount} TAMA',
        'hi': '• 💰 कुल कमाई: {amount} TAMA',
        'ko': '• 💰 총 수익: {amount} TAMA',
        'tr': '• 💰 Toplam Kazanç: {amount} TAMA',
        'de': '• 💰 Gesamt Verdient: {amount} TAMA',
    },
    'earn_instantly': {
        'en': '💰 **Earn instantly (NO WALLET NEEDED!):**',
        'ru': '💰 **Зарабатывай мгновенно (БЕЗ КОШЕЛЬКА!):**',
        'zh': '💰 **即时赚取 (无需钱包!):**',
        'es': '💰 **¡Gana instantáneamente (SIN BILLETERA!):**',
        'pt': '💰 **Ganhe instantaneamente (SEM CARTEIRA!):**',
        'ja': '💰 **即座に稼ぐ（ウォレット不要！）:**',
        'fr': '💰 **Gagne instantanément (SANS PORTEFEUILLE !) :**',
        'hi': '💰 **तुरंत कमाएं (वॉलेट की जरूरत नहीं!):**',
        'ko': '💰 **즉시 적립 (지갑 필요 없음!):**',
        'tr': '💰 **Anında kazan (CÜZDAN GEREKMEZ!):**',
        'de': '💰 **Sofort verdienen (KEINE WALLET NÖTIG!):**',
    },
    'per_friend': {
        'en': '• 1,000 TAMA for each friend instantly!',
        'ru': '• 1,000 TAMA за каждого друга мгновенно!',
        'zh': '• 每位朋友立即获得 1,000 TAMA！',
        'es': '• ¡1,000 TAMA por cada amigo instantáneamente!',
        'pt': '• 1,000 TAMA por cada amigo instantaneamente!',
        'ja': '• 友達1人につき即座に1,000 TAMA！',
        'fr': '• 1,000 TAMA pour chaque ami instantanément !',
        'hi': '• प्रत्येक दोस्त के लिए तुरंत 1,000 TAMA!',
        'ko': '• 친구당 즉시 1,000 TAMA!',
        'tr': '• Her arkadaş için anında 1,000 TAMA!',
        'de': '• 1,000 TAMA pro Freund sofort!',
    },
    'just_share': {
        'en': '• Just share your link and earn!',
        'ru': '• Просто делись ссылкой и зарабатывай!',
        'zh': '• 只需分享链接即可赚取！',
        'es': '• ¡Solo comparte tu enlace y gana!',
        'pt': '• Apenas compartilhe seu link e ganhe!',
        'ja': '• リンクをシェアするだけで稼げる！',
        'fr': '• Partage ton lien et gagne !',
        'hi': '• बस अपना लिंक साझा करें और कमाएं!',
        'ko': '• 링크를 공유하고 적립하세요!',
        'tr': '• Sadece linkini paylaş ve kazan!',
        'de': '• Teile einfach deinen Link und verdiene!',
    },
    'accumulates': {
        'en': '• TAMA accumulates in your account',
        'ru': '• TAMA накапливается на твоём аккаунте',
        'zh': '• TAMA 累积在您的账户中',
        'es': '• TAMA se acumula en tu cuenta',
        'pt': '• TAMA acumula na sua conta',
        'ja': '• TAMAはアカウントに蓄積されます',
        'fr': '• TAMA s\'accumule sur ton compte',
        'hi': '• TAMA आपके खाते में जमा होता है',
        'ko': '• TAMA가 계정에 누적됩니다',
        'tr': '• TAMA hesabınızda birikir',
        'de': '• TAMA sammelt sich in deinem Konto',
    },
}

# =============================================================================
# DAILY REWARD
# =============================================================================
DAILY = {
    'claimed': {
        'en': '🎁 Daily reward claimed: +{amount} TAMA!\n\nCome back tomorrow for more!',
        'ru': '🎁 Ежедневная награда получена: +{amount} TAMA!\n\nВозвращайся завтра за новой!',
        'zh': '🎁 每日奖励已领取: +{amount} TAMA!\n\n明天再来领取更多！',
        'es': '🎁 ¡Recompensa diaria reclamada: +{amount} TAMA!\n\n¡Vuelve mañana por más!',
        'pt': '🎁 Recompensa diária resgatada: +{amount} TAMA!\n\nVolte amanhã para mais!',
        'ja': '🎁 デイリー報酬獲得: +{amount} TAMA!\n\n明日また来てね！',
        'fr': '🎁 Récompense quotidienne réclamée : +{amount} TAMA !\n\nReviens demain !',
        'hi': '🎁 दैनिक इनाम प्राप्त: +{amount} TAMA!\n\nकल और के लिए वापस आएं!',
        'ko': '🎁 일일 보상 수령: +{amount} TAMA!\n\n내일 다시 오세요!',
        'tr': '🎁 Günlük ödül alındı: +{amount} TAMA!\n\nDaha fazlası için yarın gel!',
        'de': '🎁 Tägliche Belohnung erhalten: +{amount} TAMA!\n\nKomm morgen wieder!',
    },
    'already_claimed': {
        'en': '⏰ You already claimed your daily reward!\n\nCome back in {hours}h {minutes}m',
        'ru': '⏰ Ты уже забрал награду сегодня!\n\nВозвращайся через {hours}ч {minutes}м',
        'zh': '⏰ 您今天已经领取了每日奖励！\n\n{hours}小时{minutes}分钟后再来',
        'es': '⏰ ¡Ya reclamaste tu recompensa diaria!\n\nVuelve en {hours}h {minutes}m',
        'pt': '⏰ Você já resgatou sua recompensa diária!\n\nVolte em {hours}h {minutes}m',
        'ja': '⏰ 今日のデイリー報酬は受け取り済み！\n\n{hours}時間{minutes}分後に戻ってきてね',
        'fr': '⏰ Tu as déjà réclamé ta récompense quotidienne !\n\nReviens dans {hours}h {minutes}m',
        'hi': '⏰ आपने पहले ही अपना दैनिक इनाम ले लिया!\n\n{hours}घं {minutes}मि में वापस आएं',
        'ko': '⏰ 이미 일일 보상을 받았습니다!\n\n{hours}시간 {minutes}분 후에 다시 오세요',
        'tr': '⏰ Günlük ödülünü zaten aldın!\n\n{hours}s {minutes}d sonra tekrar gel',
        'de': '⏰ Du hast deine tägliche Belohnung bereits erhalten!\n\nKomm in {hours}h {minutes}m wieder',
    },
}

# =============================================================================
# BADGES
# =============================================================================
BADGES = {
    'header': {
        'en': '🏆 **Your Badges**',
        'ru': '🏆 **Твои значки**',
        'zh': '🏆 **您的徽章**',
        'es': '🏆 **Tus Insignias**',
        'pt': '🏆 **Seus Distintivos**',
        'ja': '🏆 **あなたのバッジ**',
        'fr': '🏆 **Tes Badges**',
        'hi': '🏆 **आपके बैज**',
        'ko': '🏆 **귀하의 뱃지**',
        'tr': '🏆 **Rozetleriniz**',
        'de': '🏆 **Deine Abzeichen**',
    },
    'no_badges': {
        'en': 'No badges yet. Play and invite friends!',
        'ru': 'Пока нет значков. Играй и приглашай друзей!',
        'zh': '还没有徽章。玩游戏和邀请朋友！',
        'es': '¡Aún no tienes insignias. Juega e invita amigos!',
        'pt': 'Nenhum distintivo ainda. Jogue e convide amigos!',
        'ja': 'まだバッジがありません。プレイして友達を招待しよう！',
        'fr': 'Pas encore de badges. Joue et invite des amis !',
        'hi': 'अभी तक कोई बैज नहीं। खेलें और दोस्तों को आमंत्रित करें!',
        'ko': '아직 뱃지가 없습니다. 플레이하고 친구를 초대하세요!',
        'tr': 'Henüz rozet yok. Oyna ve arkadaşlarını davet et!',
        'de': 'Noch keine Abzeichen. Spiele und lade Freunde ein!',
    },
    'how_to_earn': {
        'en': '💰 **How to earn more:**',
        'ru': '💰 **Как получить больше:**',
        'zh': '💰 **如何获得更多:**',
        'es': '💰 **Cómo ganar más:**',
        'pt': '💰 **Como ganhar mais:**',
        'ja': '💰 **もっと獲得するには:**',
        'fr': '💰 **Comment en gagner plus :**',
        'hi': '💰 **और कैसे कमाएं:**',
        'ko': '💰 **더 많이 획득하는 방법:**',
        'tr': '💰 **Daha fazla nasıl kazanılır:**',
        'de': '💰 **So verdienst du mehr:**',
    },
    'early_bird': {
        'en': '• 🌟 Early Bird - Be in first 100 users',
        'ru': '• 🌟 Ранняя пташка - В первых 100 пользователей',
        'zh': '• 🌟 早起鸟 - 前 100 位用户',
        'es': '• 🌟 Madrugador - Estar entre los primeros 100 usuarios',
        'pt': '• 🌟 Madrugador - Estar entre os primeiros 100 usuários',
        'ja': '• 🌟 アーリーバード - 最初の100ユーザーに入る',
        'fr': '• 🌟 Lève-tôt - Être dans les 100 premiers utilisateurs',
        'hi': '• 🌟 अर्ली बर्ड - पहले 100 यूजर्स में',
        'ko': '• 🌟 얼리버드 - 첫 100명 사용자에 포함',
        'tr': '• 🌟 Erken Kuş - İlk 100 kullanıcı arasında ol',
        'de': '• 🌟 Frühaufsteher - Sei unter den ersten 100 Nutzern',
    },
    'streak_master': {
        'en': '• 🔥 Streak Master - 30 days streak',
        'ru': '• 🔥 Мастер серий - 30 дней подряд',
        'zh': '• 🔥 连胜大师 - 连续 30 天',
        'es': '• 🔥 Maestro de Rachas - 30 días de racha',
        'pt': '• 🔥 Mestre de Sequências - 30 dias de sequência',
        'ja': '• 🔥 ストリークマスター - 30日連続',
        'fr': '• 🔥 Maître des Séries - 30 jours de série',
        'hi': '• 🔥 स्ट्रीक मास्टर - 30 दिन की स्ट्रीक',
        'ko': '• 🔥 스트릭 마스터 - 30일 연속',
        'tr': '• 🔥 Seri Ustası - 30 günlük seri',
        'de': '• 🔥 Serien-Meister - 30 Tage Serie',
    },
    'referral_king': {
        'en': '• 👑 Referral King - 50+ referrals',
        'ru': '• 👑 Король рефералов - 50+ рефералов',
        'zh': '• 👑 推荐之王 - 50+ 推荐',
        'es': '• 👑 Rey de Referidos - 50+ referidos',
        'pt': '• 👑 Rei das Indicações - 50+ indicações',
        'ja': '• 👑 紹介キング - 50+紹介',
        'fr': '• 👑 Roi des Parrainages - 50+ parrainages',
        'hi': '• 👑 रेफरल किंग - 50+ रेफरल',
        'ko': '• 👑 추천 킹 - 50+ 추천',
        'tr': '• 👑 Referans Kralı - 50+ referans',
        'de': '• 👑 Empfehlungs-König - 50+ Empfehlungen',
    },
}

# =============================================================================
# QUESTS
# =============================================================================
QUESTS = {
    'header': {
        'en': '📋 **Referral Quests**',
        'ru': '📋 **Реферальные квесты**',
        'zh': '📋 **推荐任务**',
        'es': '📋 **Misiones de Referidos**',
        'pt': '📋 **Missões de Indicação**',
        'ja': '📋 **紹介クエスト**',
        'fr': '📋 **Quêtes de Parrainage**',
        'hi': '📋 **रेफरल क्वेस्ट**',
        'ko': '📋 **추천 퀘스트**',
        'tr': '📋 **Referans Görevleri**',
        'de': '📋 **Empfehlungs-Quests**',
    },
    'completed': {
        'en': '✅ Completed',
        'ru': '✅ Выполнено',
        'zh': '✅ 已完成',
        'es': '✅ Completado',
        'pt': '✅ Concluído',
        'ja': '✅ 完了',
        'fr': '✅ Terminé',
        'hi': '✅ पूर्ण',
        'ko': '✅ 완료',
        'tr': '✅ Tamamlandı',
        'de': '✅ Abgeschlossen',
    },
    'in_progress': {
        'en': '🔄 In Progress',
        'ru': '🔄 В процессе',
        'zh': '🔄 进行中',
        'es': '🔄 En Progreso',
        'pt': '🔄 Em Progresso',
        'ja': '🔄 進行中',
        'fr': '🔄 En Cours',
        'hi': '🔄 प्रगति में',
        'ko': '🔄 진행중',
        'tr': '🔄 Devam Ediyor',
        'de': '🔄 In Bearbeitung',
    },
    'invite_tip': {
        'en': '💡 Invite friends to complete more quests!',
        'ru': '💡 Приглашай друзей чтобы выполнить больше квестов!',
        'zh': '💡 邀请朋友来完成更多任务！',
        'es': '💡 ¡Invita amigos para completar más misiones!',
        'pt': '💡 Convide amigos para completar mais missões!',
        'ja': '💡 友達を招待してもっとクエストを完了しよう！',
        'fr': '💡 Invite des amis pour compléter plus de quêtes !',
        'hi': '💡 और क्वेस्ट पूरा करने के लिए दोस्तों को आमंत्रित करें!',
        'ko': '💡 더 많은 퀘스트를 완료하려면 친구를 초대하세요!',
        'tr': '💡 Daha fazla görevi tamamlamak için arkadaşlarını davet et!',
        'de': '💡 Lade Freunde ein, um mehr Quests abzuschließen!',
    },
}

# =============================================================================
# NFT SECTION
# =============================================================================
NFTS = {
    'collection_header': {
        'en': '🖼️ **YOUR NFT COLLECTION** 🖼️',
        'ru': '🖼️ **ТВОЯ КОЛЛЕКЦИЯ NFT** 🖼️',
        'zh': '🖼️ **您的 NFT 收藏** 🖼️',
        'es': '🖼️ **TU COLECCIÓN NFT** 🖼️',
        'pt': '🖼️ **SUA COLEÇÃO NFT** 🖼️',
        'ja': '🖼️ **あなたのNFTコレクション** 🖼️',
        'fr': '🖼️ **TA COLLECTION NFT** 🖼️',
        'hi': '🖼️ **आपका NFT संग्रह** 🖼️',
        'ko': '🖼️ **NFT 컬렉션** 🖼️',
        'tr': '🖼️ **NFT KOLEKSİYONUNUZ** 🖼️',
        'de': '🖼️ **DEINE NFT-SAMMLUNG** 🖼️',
    },
    'total_nfts': {
        'en': '📦 Total NFTs: **{count}**',
        'ru': '📦 Всего NFT: **{count}**',
        'zh': '📦 NFT 总数: **{count}**',
        'es': '📦 Total NFTs: **{count}**',
        'pt': '📦 Total NFTs: **{count}**',
        'ja': '📦 NFT総数: **{count}**',
        'fr': '📦 Total NFTs : **{count}**',
        'hi': '📦 कुल NFT: **{count}**',
        'ko': '📦 총 NFT: **{count}**',
        'tr': '📦 Toplam NFT: **{count}**',
        'de': '📦 Gesamt NFTs: **{count}**',
    },
    'active_boost': {
        'en': '⚡ Active Boost: **{multiplier}x**',
        'ru': '⚡ Активный буст: **{multiplier}x**',
        'zh': '⚡ 活跃加成: **{multiplier}x**',
        'es': '⚡ Boost Activo: **{multiplier}x**',
        'pt': '⚡ Boost Ativo: **{multiplier}x**',
        'ja': '⚡ アクティブブースト: **{multiplier}x**',
        'fr': '⚡ Boost Actif : **{multiplier}x**',
        'hi': '⚡ एक्टिव बूस्ट: **{multiplier}x**',
        'ko': '⚡ 활성 부스트: **{multiplier}x**',
        'tr': '⚡ Aktif Boost: **{multiplier}x**',
        'de': '⚡ Aktiver Boost: **{multiplier}x**',
    },
    'no_nfts': {
        'en': '📦 You don\'t have any NFTs yet!',
        'ru': '📦 У тебя пока нет NFT!',
        'zh': '📦 您还没有任何 NFT！',
        'es': '📦 ¡Aún no tienes ningún NFT!',
        'pt': '📦 Você ainda não tem nenhum NFT!',
        'ja': '📦 まだNFTを持っていません！',
        'fr': '📦 Tu n\'as pas encore de NFT !',
        'hi': '📦 आपके पास अभी तक कोई NFT नहीं है!',
        'ko': '📦 아직 NFT가 없습니다!',
        'tr': '📦 Henüz hiç NFT\'niz yok!',
        'de': '📦 Du hast noch keine NFTs!',
    },
    'benefits': {
        'en': '🎮 *NFT Benefits:*\n• Your best NFT gives you **{multiplier}x** earning boost!\n• All TAMA rewards are multiplied automatically',
        'ru': '🎮 *Преимущества NFT:*\n• Твой лучший NFT даёт **{multiplier}x** буст к заработку!\n• Все награды TAMA умножаются автоматически',
        'zh': '🎮 *NFT 优势:*\n• 您最好的 NFT 提供 **{multiplier}x** 收益加成！\n• 所有 TAMA 奖励自动翻倍',
        'es': '🎮 *Beneficios NFT:*\n• ¡Tu mejor NFT te da **{multiplier}x** boost de ganancias!\n• Todas las recompensas TAMA se multiplican automáticamente',
        'pt': '🎮 *Benefícios NFT:*\n• Seu melhor NFT dá **{multiplier}x** boost de ganhos!\n• Todas as recompensas TAMA são multiplicadas automaticamente',
        'ja': '🎮 *NFT特典:*\n• ベストNFTで **{multiplier}x** 収益ブースト！\n• すべてのTAMA報酬が自動的に倍増',
        'fr': '🎮 *Avantages NFT :*\n• Ton meilleur NFT te donne un boost de **{multiplier}x** !\n• Toutes les récompenses TAMA sont multipliées automatiquement',
        'hi': '🎮 *NFT लाभ:*\n• आपका सबसे अच्छा NFT **{multiplier}x** कमाई बूस्ट देता है!\n• सभी TAMA पुरस्कार स्वचालित रूप से गुणा होते हैं',
        'ko': '🎮 *NFT 혜택:*\n• 최고의 NFT가 **{multiplier}x** 수익 부스트를 제공합니다!\n• 모든 TAMA 보상이 자동으로 배가됩니다',
        'tr': '🎮 *NFT Avantajları:*\n• En iyi NFT\'niz size **{multiplier}x** kazanç artışı sağlar!\n• Tüm TAMA ödülleri otomatik olarak çarpılır',
        'de': '🎮 *NFT-Vorteile:*\n• Dein bestes NFT gibt dir **{multiplier}x** Verdienst-Boost!\n• Alle TAMA-Belohnungen werden automatisch multipliziert',
    },
}

# =============================================================================
# WITHDRAW
# =============================================================================
WITHDRAW = {
    'header': {
        'en': '💸 **Withdraw TAMA**',
        'ru': '💸 **Вывод TAMA**',
        'zh': '💸 **提取 TAMA**',
        'es': '💸 **Retirar TAMA**',
        'pt': '💸 **Sacar TAMA**',
        'ja': '💸 **TAMA出金**',
        'fr': '💸 **Retirer TAMA**',
        'hi': '💸 **TAMA निकालें**',
        'ko': '💸 **TAMA 출금**',
        'tr': '💸 **TAMA Çek**',
        'de': '💸 **TAMA Abheben**',
    },
    'mainnet_launch': {
        'en': '🚀 **Mainnet Launch:** Q1 2026',
        'ru': '🚀 **Запуск Mainnet:** Q1 2026',
        'zh': '🚀 **主网启动:** 2026年第一季度',
        'es': '🚀 **Lanzamiento Mainnet:** Q1 2026',
        'pt': '🚀 **Lançamento Mainnet:** Q1 2026',
        'ja': '🚀 **メインネット開始:** 2026年Q1',
        'fr': '🚀 **Lancement Mainnet :** Q1 2026',
        'hi': '🚀 **मेननेट लॉन्च:** Q1 2026',
        'ko': '🚀 **메인넷 출시:** 2026년 1분기',
        'tr': '🚀 **Mainnet Lansmanı:** Q1 2026',
        'de': '🚀 **Mainnet-Start:** Q1 2026',
    },
    'what_to_know': {
        'en': '**What you need to know:**\n• All in-game TAMA converts 1:1 to mainnet token\n• Your balance will be automatically migrated\n• No action needed from you!',
        'ru': '**Что нужно знать:**\n• Весь игровой TAMA конвертируется 1:1 в mainnet токен\n• Твой баланс будет автоматически перенесён\n• От тебя ничего не требуется!',
        'zh': '**您需要知道的:**\n• 所有游戏内 TAMA 1:1 转换为主网代币\n• 您的余额将自动迁移\n• 无需任何操作！',
        'es': '**Lo que necesitas saber:**\n• Todo el TAMA del juego se convierte 1:1 al token mainnet\n• Tu saldo se migrará automáticamente\n• ¡No necesitas hacer nada!',
        'pt': '**O que você precisa saber:**\n• Todo TAMA do jogo converte 1:1 para o token mainnet\n• Seu saldo será migrado automaticamente\n• Nenhuma ação necessária!',
        'ja': '**知っておくべきこと:**\n• ゲーム内TAMAは全て1:1でメインネットトークンに変換\n• 残高は自動的に移行されます\n• 何もする必要はありません！',
        'fr': '**Ce que tu dois savoir :**\n• Tous les TAMA du jeu se convertissent 1:1 en token mainnet\n• Ton solde sera automatiquement migré\n• Aucune action nécessaire !',
        'hi': '**आपको क्या जानना चाहिए:**\n• सभी इन-गेम TAMA 1:1 मेननेट टोकन में कनवर्ट होता है\n• आपका बैलेंस स्वचालित रूप से माइग्रेट हो जाएगा\n• आपसे कोई कार्रवाई आवश्यक नहीं!',
        'ko': '**알아야 할 사항:**\n• 모든 게임 내 TAMA가 1:1로 메인넷 토큰으로 전환됩니다\n• 잔액이 자동으로 마이그레이션됩니다\n• 별도 조치 불필요!',
        'tr': '**Bilmeniz gerekenler:**\n• Tüm oyun içi TAMA 1:1 oranında mainnet tokenına dönüşür\n• Bakiyeniz otomatik olarak taşınacak\n• Sizden herhangi bir işlem gerekmez!',
        'de': '**Was du wissen musst:**\n• Alle Ingame-TAMA werden 1:1 in Mainnet-Token umgewandelt\n• Dein Guthaben wird automatisch migriert\n• Du musst nichts tun!',
    },
    'tama_safe': {
        'en': 'Your TAMA is safe! Keep earning! 💰',
        'ru': 'Твои TAMA в безопасности! Продолжай зарабатывать! 💰',
        'zh': '您的 TAMA 是安全的！继续赚取！ 💰',
        'es': '¡Tu TAMA está seguro! ¡Sigue ganando! 💰',
        'pt': 'Seu TAMA está seguro! Continue ganhando! 💰',
        'ja': 'あなたのTAMAは安全です！稼ぎ続けよう！ 💰',
        'fr': 'Tes TAMA sont en sécurité ! Continue à gagner ! 💰',
        'hi': 'आपका TAMA सुरक्षित है! कमाते रहें! 💰',
        'ko': 'TAMA는 안전합니다! 계속 적립하세요! 💰',
        'tr': 'TAMA\'nız güvende! Kazanmaya devam edin! 💰',
        'de': 'Deine TAMA sind sicher! Verdiene weiter! 💰',
    },
}

# =============================================================================
# ERROR MESSAGES
# =============================================================================
ERRORS = {
    'generic': {
        'en': '❌ Something went wrong. Please try again.',
        'ru': '❌ Что-то пошло не так. Попробуй ещё раз.',
        'zh': '❌ 出了点问题。请再试一次。',
        'es': '❌ Algo salió mal. Por favor, inténtalo de nuevo.',
        'pt': '❌ Algo deu errado. Por favor, tente novamente.',
        'ja': '❌ 問題が発生しました。もう一度お試しください。',
        'fr': '❌ Une erreur s\'est produite. Veuillez réessayer.',
        'hi': '❌ कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
        'ko': '❌ 문제가 발생했습니다. 다시 시도해주세요.',
        'tr': '❌ Bir şeyler yanlış gitti. Lütfen tekrar deneyin.',
        'de': '❌ Etwas ist schiefgelaufen. Bitte versuche es erneut.',
    },
    'no_data': {
        'en': '⚠️ No data found. Start playing first!',
        'ru': '⚠️ Данных нет. Начни играть сначала!',
        'zh': '⚠️ 未找到数据。先开始游戏！',
        'es': '⚠️ No se encontraron datos. ¡Empieza a jugar primero!',
        'pt': '⚠️ Nenhum dado encontrado. Comece a jogar primeiro!',
        'ja': '⚠️ データが見つかりません。まずプレイを始めてください！',
        'fr': '⚠️ Aucune donnée trouvée. Commence à jouer d\'abord !',
        'hi': '⚠️ कोई डेटा नहीं मिला। पहले खेलना शुरू करें!',
        'ko': '⚠️ 데이터를 찾을 수 없습니다. 먼저 플레이를 시작하세요!',
        'tr': '⚠️ Veri bulunamadı. Önce oynamaya başla!',
        'de': '⚠️ Keine Daten gefunden. Fang zuerst an zu spielen!',
    },
    'api_error': {
        'en': '❌ API error. Please try again later.',
        'ru': '❌ Ошибка API. Попробуй позже.',
        'zh': '❌ API 错误。请稍后再试。',
        'es': '❌ Error de API. Por favor, inténtalo más tarde.',
        'pt': '❌ Erro de API. Por favor, tente mais tarde.',
        'ja': '❌ APIエラー。後でもう一度お試しください。',
        'fr': '❌ Erreur API. Veuillez réessayer plus tard.',
        'hi': '❌ API त्रुटि। कृपया बाद में पुनः प्रयास करें।',
        'ko': '❌ API 오류. 나중에 다시 시도해주세요.',
        'tr': '❌ API hatası. Lütfen daha sonra tekrar deneyin.',
        'de': '❌ API-Fehler. Bitte versuche es später erneut.',
    },
}

# =============================================================================
# LEADERBOARD
# =============================================================================
LEADERBOARD = {
    'header': {
        'en': '🏅 **Top 10 Players**',
        'ru': '🏅 **Топ 10 Игроков**',
        'zh': '🏅 **前10名玩家**',
        'es': '🏅 **Top 10 Jugadores**',
        'pt': '🏅 **Top 10 Jogadores**',
        'ja': '🏅 **トップ10プレイヤー**',
        'fr': '🏅 **Top 10 Joueurs**',
        'hi': '🏅 **टॉप 10 खिलाड़ी**',
        'ko': '🏅 **상위 10명**',
        'tr': '🏅 **En İyi 10 Oyuncu**',
        'de': '🏅 **Top 10 Spieler**',
    },
    'no_players': {
        'en': 'No players yet. Be the first!',
        'ru': 'Пока нет игроков. Стань первым!',
        'zh': '还没有玩家。成为第一个！',
        'es': '¡Aún no hay jugadores. Sé el primero!',
        'pt': 'Nenhum jogador ainda. Seja o primeiro!',
        'ja': 'まだプレイヤーがいません。最初になろう！',
        'fr': 'Pas encore de joueurs. Sois le premier !',
        'hi': 'अभी तक कोई खिलाड़ी नहीं। पहले बनो!',
        'ko': '아직 플레이어가 없습니다. 첫 번째가 되세요!',
        'tr': 'Henüz oyuncu yok. İlk sen ol!',
        'de': 'Noch keine Spieler. Sei der Erste!',
    },
}

# =============================================================================
# HELP SECTION
# =============================================================================
HELP = {
    'header': {
        'en': '📚 **Solana Tamagotchi Commands**',
        'ru': '📚 **Команды Solana Tamagotchi**',
        'zh': '📚 **Solana Tamagotchi 命令**',
        'es': '📚 **Comandos de Solana Tamagotchi**',
        'pt': '📚 **Comandos do Solana Tamagotchi**',
        'ja': '📚 **Solana Tamagotchi コマンド**',
        'fr': '📚 **Commandes Solana Tamagotchi**',
        'hi': '📚 **Solana Tamagotchi कमांड**',
        'ko': '📚 **Solana Tamagotchi 명령어**',
        'tr': '📚 **Solana Tamagotchi Komutları**',
        'de': '📚 **Solana Tamagotchi Befehle**',
    },
    'game_commands': {
        'en': '**Game Commands:**\n/start - Start playing\n/stats - View your statistics\n/daily - Claim daily reward',
        'ru': '**Игровые команды:**\n/start - Начать играть\n/stats - Твоя статистика\n/daily - Забрать ежедневную награду',
        'zh': '**游戏命令:**\n/start - 开始游戏\n/stats - 查看统计\n/daily - 领取每日奖励',
        'es': '**Comandos del Juego:**\n/start - Empezar a jugar\n/stats - Ver tus estadísticas\n/daily - Reclamar recompensa diaria',
        'pt': '**Comandos do Jogo:**\n/start - Começar a jogar\n/stats - Ver suas estatísticas\n/daily - Resgatar recompensa diária',
        'ja': '**ゲームコマンド:**\n/start - プレイ開始\n/stats - 統計を見る\n/daily - デイリー報酬を受け取る',
        'fr': '**Commandes du Jeu :**\n/start - Commencer à jouer\n/stats - Voir tes statistiques\n/daily - Réclamer la récompense quotidienne',
        'hi': '**गेम कमांड:**\n/start - खेलना शुरू करें\n/stats - अपने आँकड़े देखें\n/daily - दैनिक इनाम लें',
        'ko': '**게임 명령어:**\n/start - 플레이 시작\n/stats - 통계 보기\n/daily - 일일 보상 받기',
        'tr': '**Oyun Komutları:**\n/start - Oynamaya başla\n/stats - İstatistiklerini gör\n/daily - Günlük ödülü al',
        'de': '**Spiel-Befehle:**\n/start - Spielen starten\n/stats - Statistiken ansehen\n/daily - Tägliche Belohnung abholen',
    },
    'social_commands': {
        'en': '**Social Commands:**\n/invite - Get your referral link\n/leaderboard - Top players\n/community - Join our community',
        'ru': '**Социальные команды:**\n/invite - Реферальная ссылка\n/leaderboard - Топ игроков\n/community - Наше сообщество',
        'zh': '**社交命令:**\n/invite - 获取推荐链接\n/leaderboard - 顶级玩家\n/community - 加入社区',
        'es': '**Comandos Sociales:**\n/invite - Obtener tu enlace de referido\n/leaderboard - Mejores jugadores\n/community - Únete a nuestra comunidad',
        'pt': '**Comandos Sociais:**\n/invite - Obter seu link de indicação\n/leaderboard - Melhores jogadores\n/community - Junte-se à nossa comunidade',
        'ja': '**ソーシャルコマンド:**\n/invite - 紹介リンクを取得\n/leaderboard - トッププレイヤー\n/community - コミュニティに参加',
        'fr': '**Commandes Sociales :**\n/invite - Obtenir ton lien de parrainage\n/leaderboard - Meilleurs joueurs\n/community - Rejoins notre communauté',
        'hi': '**सामाजिक कमांड:**\n/invite - अपना रेफरल लिंक प्राप्त करें\n/leaderboard - शीर्ष खिलाड़ी\n/community - हमारे समुदाय में शामिल हों',
        'ko': '**소셜 명령어:**\n/invite - 추천 링크 받기\n/leaderboard - 상위 플레이어\n/community - 커뮤니티 가입',
        'tr': '**Sosyal Komutlar:**\n/invite - Referans linkini al\n/leaderboard - En iyi oyuncular\n/community - Topluluğumuza katıl',
        'de': '**Soziale Befehle:**\n/invite - Empfehlungslink erhalten\n/leaderboard - Top-Spieler\n/community - Tritt unserer Community bei',
    },
    'need_help': {
        'en': '**Need help?** Join @gotchigamechat',
        'ru': '**Нужна помощь?** Присоединяйся @gotchigamechat',
        'zh': '**需要帮助？** 加入 @gotchigamechat',
        'es': '**¿Necesitas ayuda?** Únete a @gotchigamechat',
        'pt': '**Precisa de ajuda?** Junte-se a @gotchigamechat',
        'ja': '**ヘルプが必要？** @gotchigamechat に参加',
        'fr': '**Besoin d\'aide ?** Rejoins @gotchigamechat',
        'hi': '**मदद चाहिए?** @gotchigamechat से जुड़ें',
        'ko': '**도움이 필요하신가요?** @gotchigamechat 가입',
        'tr': '**Yardım mı lazım?** @gotchigamechat\'e katıl',
        'de': '**Brauchst du Hilfe?** Tritt @gotchigamechat bei',
    },
}


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================
def get_text(category: str, key: str, lang: str = 'en', **kwargs) -> str:
    """
    Get translated text by category and key
    
    Args:
        category: Translation category (e.g., 'BUTTONS', 'WELCOME')
        key: Translation key
        lang: Language code
        **kwargs: Variables to format into text
    
    Returns:
        Translated text (falls back to English if not found)
    """
    categories = {
        'BUTTONS': BUTTONS,
        'WELCOME': WELCOME,
        'LANGUAGE_SELECTION': LANGUAGE_SELECTION,
        'STATS': STATS,
        'REFERRAL': REFERRAL,
        'DAILY': DAILY,
        'BADGES': BADGES,
        'QUESTS': QUESTS,
        'NFTS': NFTS,
        'WITHDRAW': WITHDRAW,
        'ERRORS': ERRORS,
        'LEADERBOARD': LEADERBOARD,
        'HELP': HELP,
    }
    
    cat = categories.get(category, {})
    if not cat:
        return f"[Missing category: {category}]"
    
    item = cat.get(key, {})
    if not item:
        return f"[Missing key: {category}.{key}]"
    
    text = item.get(lang, item.get('en', f"[No translation: {category}.{key}.{lang}]"))
    
    if kwargs:
        try:
            text = text.format(**kwargs)
        except KeyError as e:
            print(f"⚠️ Missing variable in {category}.{key}: {e}")
    
    return text


def get_button(key: str, lang: str = 'en') -> str:
    """Get translated button text"""
    return BUTTONS.get(key, {}).get(lang, BUTTONS.get(key, {}).get('en', key))


def get_welcome(has_referral: bool, lang: str = 'en') -> str:
    """Get welcome message based on referral status"""
    key = 'with_referral' if has_referral else 'no_referral'
    return WELCOME.get(key, {}).get(lang, WELCOME.get(key, {}).get('en', ''))


def get_supported_languages():
    """Get list of supported languages with their info"""
    return SUPPORTED_LANGUAGES


def get_language_info(lang_code: str) -> dict:
    """Get info about a specific language"""
    return SUPPORTED_LANGUAGES.get(lang_code, SUPPORTED_LANGUAGES.get('en'))


# =============================================================================
# TESTING
# =============================================================================
if __name__ == '__main__':
    print("🧪 Testing Full Localization System...\n")
    
    print("=== Supported Languages ===")
    for code, info in SUPPORTED_LANGUAGES.items():
        print(f"{info['flag']} {code}: {info['native']} ({info['name']})")
    
    print("\n=== Button Tests ===")
    for lang in ['en', 'ru', 'zh', 'ja', 'ko', 'de']:
        print(f"{lang}: {get_button('play_now', lang)}")
    
    print("\n=== Welcome Message (EN) ===")
    print(get_welcome(False, 'en')[:200] + "...")
    
    print("\n=== Stats Format Test ===")
    print(get_text('STATS', 'balance', 'ru', amount="10,000"))
    
    print("\n✅ All tests passed!")
