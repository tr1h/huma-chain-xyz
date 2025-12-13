/**
 * 🌍 Internationalization (i18n) System for Solana Tamagotchi
 * Supports 13 languages with beautiful language selector
 * 
 * Usage:
 *   t('key') - Get translation for current language
 *   setLanguage('ru') - Change language
 *   getCurrentLanguage() - Get current language code
 */

// Supported languages with flags and native names
const SUPPORTED_LANGUAGES = {
    en: { flag: '🇬🇧', name: 'English', native: 'English' },
    ru: { flag: '🇷🇺', name: 'Russian', native: 'Русский' },
    zh: { flag: '🇨🇳', name: 'Chinese', native: '中文' },
    es: { flag: '🇪🇸', name: 'Spanish', native: 'Español' },
    pt: { flag: '🇧🇷', name: 'Portuguese', native: 'Português' },
    ja: { flag: '🇯🇵', name: 'Japanese', native: '日本語' },
    fr: { flag: '🇫🇷', name: 'French', native: 'Français' },
    hi: { flag: '🇮🇳', name: 'Hindi', native: 'हिन्दी' },
    ko: { flag: '🇰🇷', name: 'Korean', native: '한국어' },
    tr: { flag: '🇹🇷', name: 'Turkish', native: 'Türkçe' },
    de: { flag: '🇩🇪', name: 'German', native: 'Deutsch' },
    ar: { flag: '🇸🇦', name: 'Arabic', native: 'العربية' },
    vi: { flag: '🇻🇳', name: 'Vietnamese', native: 'Tiếng Việt' }
};

// All translations
const TRANSLATIONS = {
    // ========== HEADER ==========
    'level': {
        en: 'Level', ru: 'Уровень', zh: '等级', es: 'Nivel', pt: 'Nível',
        ja: 'レベル', fr: 'Niveau', hi: 'स्तर', ko: '레벨', tr: 'Seviye',
        de: 'Level', ar: 'المستوى', vi: 'Cấp độ'
    },
    'player': {
        en: 'Player', ru: 'Игрок', zh: '玩家', es: 'Jugador', pt: 'Jogador',
        ja: 'プレイヤー', fr: 'Joueur', hi: 'खिलाड़ी', ko: '플레이어', tr: 'Oyuncu',
        de: 'Spieler', ar: 'لاعب', vi: 'Người chơi'
    },

    // ========== STATS ==========
    'health': {
        en: 'Health', ru: 'Здоровье', zh: '生命', es: 'Salud', pt: 'Saúde',
        ja: '体力', fr: 'Santé', hi: 'स्वास्थ्य', ko: '체력', tr: 'Sağlık',
        de: 'Gesundheit', ar: 'الصحة', vi: 'Sức khỏe'
    },
    'food': {
        en: 'Food', ru: 'Еда', zh: '食物', es: 'Comida', pt: 'Comida',
        ja: '食べ物', fr: 'Nourriture', hi: 'भोजन', ko: '음식', tr: 'Yiyecek',
        de: 'Essen', ar: 'طعام', vi: 'Thức ăn'
    },
    'happiness': {
        en: 'Happiness', ru: 'Счастье', zh: '快乐', es: 'Felicidad', pt: 'Felicidade',
        ja: '幸福', fr: 'Bonheur', hi: 'खुशी', ko: '행복', tr: 'Mutluluk',
        de: 'Glück', ar: 'السعادة', vi: 'Hạnh phúc'
    },
    'energy': {
        en: 'Energy', ru: 'Энергия', zh: '能量', es: 'Energía', pt: 'Energia',
        ja: 'エネルギー', fr: 'Énergie', hi: 'ऊर्जा', ko: '에너지', tr: 'Enerji',
        de: 'Energie', ar: 'طاقة', vi: 'Năng lượng'
    },

    // ========== ACTION BUTTONS ==========
    'feed': {
        en: 'Feed', ru: 'Кормить', zh: '喂食', es: 'Alimentar', pt: 'Alimentar',
        ja: '餌をあげる', fr: 'Nourrir', hi: 'खिलाना', ko: '먹이주기', tr: 'Besle',
        de: 'Füttern', ar: 'أطعم', vi: 'Cho ăn'
    },
    'play': {
        en: 'Play', ru: 'Играть', zh: '玩耍', es: 'Jugar', pt: 'Brincar',
        ja: '遊ぶ', fr: 'Jouer', hi: 'खेलना', ko: '놀기', tr: 'Oyna',
        de: 'Spielen', ar: 'العب', vi: 'Chơi'
    },
    'heal': {
        en: 'Heal', ru: 'Лечить', zh: '治疗', es: 'Curar', pt: 'Curar',
        ja: '回復', fr: 'Soigner', hi: 'ठीक करना', ko: '치료', tr: 'İyileştir',
        de: 'Heilen', ar: 'علاج', vi: 'Chữa trị'
    },
    'sleep': {
        en: 'Sleep', ru: 'Спать', zh: '睡觉', es: 'Dormir', pt: 'Dormir',
        ja: '寝る', fr: 'Dormir', hi: 'सोना', ko: '자기', tr: 'Uyku',
        de: 'Schlafen', ar: 'نوم', vi: 'Ngủ'
    },

    // ========== MESSAGES ==========
    'click_to_earn': {
        en: 'Click on your pet to earn TAMA! 🐾',
        ru: 'Кликай на питомца чтобы заработать TAMA! 🐾',
        zh: '点击宠物赚取 TAMA! 🐾',
        es: '¡Haz clic en tu mascota para ganar TAMA! 🐾',
        pt: 'Clique no seu pet para ganhar TAMA! 🐾',
        ja: 'ペットをクリックしてTAMAを稼ごう! 🐾',
        fr: 'Clique sur ton animal pour gagner des TAMA ! 🐾',
        hi: 'TAMA कमाने के लिए अपने पेट पर क्लिक करें! 🐾',
        ko: '펫을 클릭하여 TAMA를 획득하세요! 🐾',
        tr: 'TAMA kazanmak için evcil hayvanına tıkla! 🐾',
        de: 'Klicke auf dein Haustier um TAMA zu verdienen! 🐾',
        ar: 'انقر على حيوانك الأليف لكسب TAMA! 🐾',
        vi: 'Nhấn vào thú cưng để kiếm TAMA! 🐾'
    },
    'pet_hungry': {
        en: 'Your pet is hungry! 🍔',
        ru: 'Твой питомец голоден! 🍔',
        zh: '你的宠物饿了! 🍔',
        es: '¡Tu mascota tiene hambre! 🍔',
        pt: 'Seu pet está com fome! 🍔',
        ja: 'ペットがお腹を空かせています! 🍔',
        fr: 'Ton animal a faim ! 🍔',
        hi: 'आपका पेट भूखा है! 🍔',
        ko: '펫이 배고파요! 🍔',
        tr: 'Evcil hayvanın aç! 🍔',
        de: 'Dein Haustier ist hungrig! 🍔',
        ar: 'حيوانك الأليف جائع! 🍔',
        vi: 'Thú cưng của bạn đói! 🍔'
    },
    'pet_sick': {
        en: 'Your pet is sick! 💊',
        ru: 'Твой питомец болен! 💊',
        zh: '你的宠物生病了! 💊',
        es: '¡Tu mascota está enferma! 💊',
        pt: 'Seu pet está doente! 💊',
        ja: 'ペットが病気です! 💊',
        fr: 'Ton animal est malade ! 💊',
        hi: 'आपका पेट बीमार है! 💊',
        ko: '펫이 아파요! 💊',
        tr: 'Evcil hayvanın hasta! 💊',
        de: 'Dein Haustier ist krank! 💊',
        ar: 'حيوانك الأليف مريض! 💊',
        vi: 'Thú cưng của bạn bị ốm! 💊'
    },
    'level_up': {
        en: 'Level Up! 🎉',
        ru: 'Новый уровень! 🎉',
        zh: '升级了! 🎉',
        es: '¡Subiste de nivel! 🎉',
        pt: 'Subiu de nível! 🎉',
        ja: 'レベルアップ! 🎉',
        fr: 'Niveau supérieur ! 🎉',
        hi: 'लेवल अप! 🎉',
        ko: '레벨 업! 🎉',
        tr: 'Seviye atladın! 🎉',
        de: 'Level Up! 🎉',
        ar: 'ارتقيت مستوى! 🎉',
        vi: 'Lên cấp! 🎉'
    },
    'not_enough_tama': {
        en: 'Not enough TAMA! 💰',
        ru: 'Недостаточно TAMA! 💰',
        zh: 'TAMA不足! 💰',
        es: '¡No tienes suficiente TAMA! 💰',
        pt: 'TAMA insuficiente! 💰',
        ja: 'TAMAが足りません! 💰',
        fr: 'Pas assez de TAMA ! 💰',
        hi: 'पर्याप्त TAMA नहीं! 💰',
        ko: 'TAMA가 부족해요! 💰',
        tr: 'Yeterli TAMA yok! 💰',
        de: 'Nicht genug TAMA! 💰',
        ar: 'لا يوجد TAMA كافي! 💰',
        vi: 'Không đủ TAMA! 💰'
    },

    // ========== QUESTS ==========
    'quests': {
        en: 'Quests', ru: 'Квесты', zh: '任务', es: 'Misiones', pt: 'Missões',
        ja: 'クエスト', fr: 'Quêtes', hi: 'क्वेस्ट', ko: '퀘스트', tr: 'Görevler',
        de: 'Aufgaben', ar: 'المهام', vi: 'Nhiệm vụ'
    },
    'daily_quests': {
        en: 'Daily Quests', ru: 'Дневные квесты', zh: '每日任务', es: 'Misiones diarias', pt: 'Missões diárias',
        ja: 'デイリークエスト', fr: 'Quêtes quotidiennes', hi: 'दैनिक क्वेस्ट', ko: '일일 퀘스트', tr: 'Günlük görevler',
        de: 'Tägliche Aufgaben', ar: 'المهام اليومية', vi: 'Nhiệm vụ hàng ngày'
    },
    'daily_clicks': {
        en: 'Daily Clicks', ru: 'Дневные клики', zh: '每日点击', es: 'Clics diarios', pt: 'Cliques diários',
        ja: 'デイリークリック', fr: 'Clics quotidiens', hi: 'दैनिक क्लिक', ko: '일일 클릭', tr: 'Günlük tıklama',
        de: 'Tägliche Klicks', ar: 'النقرات اليومية', vi: 'Nhấp hàng ngày'
    },
    'click_master': {
        en: 'Click Master', ru: 'Мастер кликов', zh: '点击大师', es: 'Maestro del clic', pt: 'Mestre dos cliques',
        ja: 'クリックマスター', fr: 'Maître du clic', hi: 'क्लिक मास्टर', ko: '클릭 마스터', tr: 'Tıklama Ustası',
        de: 'Klick-Meister', ar: 'سيد النقر', vi: 'Bậc thầy click'
    },
    'click_50_times': {
        en: 'Click your pet 50 times', ru: 'Кликни на питомца 50 раз', zh: '点击宠物50次', es: 'Haz clic 50 veces', pt: 'Clique 50 vezes',
        ja: 'ペットを50回クリック', fr: 'Clique 50 fois', hi: '50 बार क्लिक करें', ko: '50번 클릭하기', tr: '50 kez tıkla',
        de: '50 mal klicken', ar: 'انقر 50 مرة', vi: 'Nhấp 50 lần'
    },
    'reach_level_5': {
        en: 'Reach level 5', ru: 'Достигни 5 уровня', zh: '达到5级', es: 'Alcanza nivel 5', pt: 'Alcance nível 5',
        ja: 'レベル5に到達', fr: 'Atteins niveau 5', hi: 'लेवल 5 पाएं', ko: '레벨 5 달성', tr: 'Seviye 5 ulaş',
        de: 'Level 5 erreichen', ar: 'وصول المستوى 5', vi: 'Đạt cấp 5'
    },

    // ========== MINI GAMES ==========
    'mini_games': {
        en: 'Mini Games', ru: 'Мини-игры', zh: '小游戏', es: 'Minijuegos', pt: 'Mini jogos',
        ja: 'ミニゲーム', fr: 'Mini-jeux', hi: 'मिनी गेम्स', ko: '미니게임', tr: 'Mini Oyunlar',
        de: 'Minispiele', ar: 'ألعاب صغيرة', vi: 'Trò chơi nhỏ'
    },
    'slots': {
        en: 'Lucky Slots', ru: 'Слоты', zh: '老虎机', es: 'Tragamonedas', pt: 'Caça-níqueis',
        ja: 'スロット', fr: 'Machines à sous', hi: 'स्लॉट्स', ko: '슬롯', tr: 'Slot',
        de: 'Spielautomat', ar: 'سلوتس', vi: 'Máy đánh bạc'
    },
    'wheel': {
        en: 'Lucky Wheel', ru: 'Колесо удачи', zh: '幸运转盘', es: 'Ruleta de la suerte', pt: 'Roda da sorte',
        ja: 'ラッキーホイール', fr: 'Roue de la chance', hi: 'लकी व्हील', ko: '행운의 휠', tr: 'Şans Çarkı',
        de: 'Glücksrad', ar: 'عجلة الحظ', vi: 'Vòng quay may mắn'
    },
    'spin': {
        en: 'SPIN!', ru: 'КРУТИТЬ!', zh: '旋转!', es: '¡GIRAR!', pt: 'GIRAR!',
        ja: '回す!', fr: 'TOURNER!', hi: 'घुमाएं!', ko: '돌리기!', tr: 'ÇEVİR!',
        de: 'DREHEN!', ar: 'دوّر!', vi: 'QUAY!'
    },
    'bet': {
        en: 'Bet', ru: 'Ставка', zh: '下注', es: 'Apuesta', pt: 'Aposta',
        ja: 'ベット', fr: 'Mise', hi: 'दांव', ko: '베팅', tr: 'Bahis',
        de: 'Einsatz', ar: 'رهان', vi: 'Cược'
    },
    'win': {
        en: 'Win', ru: 'Выигрыш', zh: '赢', es: 'Ganar', pt: 'Ganhar',
        ja: '勝ち', fr: 'Gagner', hi: 'जीत', ko: '승리', tr: 'Kazan',
        de: 'Gewinn', ar: 'فوز', vi: 'Thắng'
    },
    'jackpot': {
        en: 'JACKPOT!', ru: 'ДЖЕКПОТ!', zh: '大奖!', es: '¡JACKPOT!', pt: 'JACKPOT!',
        ja: 'ジャックポット!', fr: 'JACKPOT!', hi: 'जैकपॉट!', ko: '잭팟!', tr: 'JACKPOT!',
        de: 'JACKPOT!', ar: 'الجائزة الكبرى!', vi: 'JACKPOT!'
    },
    'total_won': {
        en: 'Total Won', ru: 'Всего выиграно', zh: '总赢', es: 'Total ganado', pt: 'Total ganho',
        ja: '合計獲得', fr: 'Total gagné', hi: 'कुल जीत', ko: '총 획득', tr: 'Toplam Kazanç',
        de: 'Gesamt gewonnen', ar: 'إجمالي الفوز', vi: 'Tổng thắng'
    },

    // ========== NAVIGATION ==========
    'home': {
        en: 'Home', ru: 'Главная', zh: '首页', es: 'Inicio', pt: 'Início',
        ja: 'ホーム', fr: 'Accueil', hi: 'होम', ko: '홈', tr: 'Ana Sayfa',
        de: 'Start', ar: 'الرئيسية', vi: 'Trang chủ'
    },
    'games': {
        en: 'Games', ru: 'Игры', zh: '游戏', es: 'Juegos', pt: 'Jogos',
        ja: 'ゲーム', fr: 'Jeux', hi: 'गेम्स', ko: '게임', tr: 'Oyunlar',
        de: 'Spiele', ar: 'ألعاب', vi: 'Trò chơi'
    },
    'shop': {
        en: 'Shop', ru: 'Магазин', zh: '商店', es: 'Tienda', pt: 'Loja',
        ja: 'ショップ', fr: 'Boutique', hi: 'दुकान', ko: '상점', tr: 'Mağaza',
        de: 'Shop', ar: 'متجر', vi: 'Cửa hàng'
    },
    'nfts': {
        en: 'NFT', ru: 'NFT', zh: 'NFT', es: 'NFT', pt: 'NFT',
        ja: 'NFT', fr: 'NFT', hi: 'NFT', ko: 'NFT', tr: 'NFT',
        de: 'NFT', ar: 'NFT', vi: 'NFT'
    },
    'profile': {
        en: 'Profile', ru: 'Профиль', zh: '个人资料', es: 'Perfil', pt: 'Perfil',
        ja: 'プロフィール', fr: 'Profil', hi: 'प्रोफाइल', ko: '프로필', tr: 'Profil',
        de: 'Profil', ar: 'الملف الشخصي', vi: 'Hồ sơ'
    },
    'top': {
        en: 'Top', ru: 'Топ', zh: '排行', es: 'Top', pt: 'Top',
        ja: 'ランキング', fr: 'Top', hi: 'टॉप', ko: '순위', tr: 'Sıralama',
        de: 'Top', ar: 'الأفضل', vi: 'Xếp hạng'
    },
    'cash': {
        en: 'Cash', ru: 'Вывод', zh: '提现', es: 'Cobrar', pt: 'Sacar',
        ja: '出金', fr: 'Retrait', hi: 'निकासी', ko: '출금', tr: 'Çekim',
        de: 'Auszahlen', ar: 'سحب', vi: 'Rút tiền'
    },
    'more': {
        en: 'More', ru: 'Ещё', zh: '更多', es: 'Más', pt: 'Mais',
        ja: 'その他', fr: 'Plus', hi: 'और', ko: '더보기', tr: 'Daha',
        de: 'Mehr', ar: 'المزيد', vi: 'Thêm'
    },
    'help': {
        en: 'Help', ru: 'Помощь', zh: '帮助', es: 'Ayuda', pt: 'Ajuda',
        ja: 'ヘルプ', fr: 'Aide', hi: 'सहायता', ko: '도움말', tr: 'Yardım',
        de: 'Hilfe', ar: 'مساعدة', vi: 'Trợ giúp'
    },
    'my_link': {
        en: 'My Link', ru: 'Моя ссылка', zh: '我的链接', es: 'Mi enlace', pt: 'Meu link',
        ja: 'リンク', fr: 'Mon lien', hi: 'मेरा लिंक', ko: '내 링크', tr: 'Bağlantım',
        de: 'Mein Link', ar: 'رابطي', vi: 'Liên kết'
    },
    'experience': {
        en: 'Experience', ru: 'Опыт', zh: '经验', es: 'Experiencia', pt: 'Experiência',
        ja: '経験値', fr: 'Expérience', hi: 'अनुभव', ko: '경험치', tr: 'Deneyim',
        de: 'Erfahrung', ar: 'الخبرة', vi: 'Kinh nghiệm'
    },

    // ========== LANGUAGE SELECTOR ==========
    'language': {
        en: 'Language', ru: 'Язык', zh: '语言', es: 'Idioma', pt: 'Idioma',
        ja: '言語', fr: 'Langue', hi: 'भाषा', ko: '언어', tr: 'Dil',
        de: 'Sprache', ar: 'اللغة', vi: 'Ngôn ngữ'
    },
    'select_language': {
        en: 'Select Language', ru: 'Выберите язык', zh: '选择语言', es: 'Seleccionar idioma', pt: 'Selecionar idioma',
        ja: '言語を選択', fr: 'Choisir la langue', hi: 'भाषा चुनें', ko: '언어 선택', tr: 'Dil Seçin',
        de: 'Sprache wählen', ar: 'اختر اللغة', vi: 'Chọn ngôn ngữ'
    },

    // ========== MISC ==========
    'loading': {
        en: 'Loading...', ru: 'Загрузка...', zh: '加载中...', es: 'Cargando...', pt: 'Carregando...',
        ja: '読み込み中...', fr: 'Chargement...', hi: 'लोड हो रहा है...', ko: '로딩 중...', tr: 'Yükleniyor...',
        de: 'Laden...', ar: 'جاري التحميل...', vi: 'Đang tải...'
    },
    'save': {
        en: 'Save', ru: 'Сохранить', zh: '保存', es: 'Guardar', pt: 'Salvar',
        ja: '保存', fr: 'Enregistrer', hi: 'सहेजें', ko: '저장', tr: 'Kaydet',
        de: 'Speichern', ar: 'حفظ', vi: 'Lưu'
    },
    'close': {
        en: 'Close', ru: 'Закрыть', zh: '关闭', es: 'Cerrar', pt: 'Fechar',
        ja: '閉じる', fr: 'Fermer', hi: 'बंद करें', ko: '닫기', tr: 'Kapat',
        de: 'Schließen', ar: 'إغلاق', vi: 'Đóng'
    },
    'confirm': {
        en: 'Confirm', ru: 'Подтвердить', zh: '确认', es: 'Confirmar', pt: 'Confirmar',
        ja: '確認', fr: 'Confirmer', hi: 'पुष्टि करें', ko: '확인', tr: 'Onayla',
        de: 'Bestätigen', ar: 'تأكيد', vi: 'Xác nhận'
    },
    'cancel': {
        en: 'Cancel', ru: 'Отмена', zh: '取消', es: 'Cancelar', pt: 'Cancelar',
        ja: 'キャンセル', fr: 'Annuler', hi: 'रद्द करें', ko: '취소', tr: 'İptal',
        de: 'Abbrechen', ar: 'إلغاء', vi: 'Hủy'
    },
    'back': {
        en: 'Back', ru: 'Назад', zh: '返回', es: 'Atrás', pt: 'Voltar',
        ja: '戻る', fr: 'Retour', hi: 'वापस', ko: '뒤로', tr: 'Geri',
        de: 'Zurück', ar: 'رجوع', vi: 'Quay lại'
    },
    'share': {
        en: 'Share', ru: 'Поделиться', zh: '分享', es: 'Compartir', pt: 'Compartilhar',
        ja: 'シェア', fr: 'Partager', hi: 'शेयर करें', ko: '공유', tr: 'Paylaş',
        de: 'Teilen', ar: 'مشاركة', vi: 'Chia sẻ'
    },
    'invite_friends': {
        en: 'Invite Friends', ru: 'Пригласить друзей', zh: '邀请朋友', es: 'Invitar amigos', pt: 'Convidar amigos',
        ja: '友達を招待', fr: 'Inviter des amis', hi: 'दोस्तों को आमंत्रित करें', ko: '친구 초대', tr: 'Arkadaşları Davet Et',
        de: 'Freunde einladen', ar: 'دعوة الأصدقاء', vi: 'Mời bạn bè'
    },

    // ========== GAME NAMES ==========
    'lucky_slots': {
        en: 'Lucky Slots', ru: 'Счастливые слоты', zh: '幸运老虎机', es: 'Tragamonedas', pt: 'Caça-níqueis',
        ja: 'ラッキースロット', fr: 'Machines à sous', hi: 'लकी स्लॉट्स', ko: '럭키 슬롯', tr: 'Şanslı Slot',
        de: 'Glücksslots', ar: 'سلوتس محظوظة', vi: 'Máy xèng may mắn'
    },
    'lucky_slots_desc': {
        en: '🎰 Bet: 100-2000 TAMA | Win Jackpot Pool!', ru: '🎰 Ставка: 100-2000 TAMA | Выиграй джекпот!', 
        zh: '🎰 投注: 100-2000 TAMA | 赢取奖池!', es: '🎰 Apuesta: 100-2000 TAMA | ¡Gana el Jackpot!',
        pt: '🎰 Aposta: 100-2000 TAMA | Ganhe o Jackpot!', ja: '🎰 ベット: 100-2000 TAMA | ジャックポットを獲得!',
        fr: '🎰 Mise: 100-2000 TAMA | Gagnez le Jackpot!', hi: '🎰 दांव: 100-2000 TAMA | जैकपॉट जीतें!',
        ko: '🎰 베팅: 100-2000 TAMA | 잭팟 획득!', tr: '🎰 Bahis: 100-2000 TAMA | Jackpot Kazan!',
        de: '🎰 Einsatz: 100-2000 TAMA | Gewinne den Jackpot!', ar: '🎰 رهان: 100-2000 | اربح الجائزة الكبرى!',
        vi: '🎰 Cược: 100-2000 TAMA | Trúng Jackpot!'
    },
    'lucky_wheel': {
        en: 'Lucky Wheel', ru: 'Колесо удачи', zh: '幸运转盘', es: 'Rueda de la Suerte', pt: 'Roda da Sorte',
        ja: 'ラッキーホイール', fr: 'Roue de la Fortune', hi: 'लकी व्हील', ko: '행운의 바퀴', tr: 'Şans Çarkı',
        de: 'Glücksrad', ar: 'عجلة الحظ', vi: 'Vòng quay may mắn'
    },
    'lucky_wheel_desc': {
        en: 'Bet: 500-1000 TAMA | Win: up to 10x!', ru: 'Ставка: 500-1000 TAMA | Выигрыш: до 10x!',
        zh: '投注: 500-1000 TAMA | 赢: 最高10倍!', es: 'Apuesta: 500-1000 TAMA | Gana: hasta 10x!',
        pt: 'Aposta: 500-1000 TAMA | Ganhe: até 10x!', ja: 'ベット: 500-1000 TAMA | 勝利: 最大10倍!',
        fr: 'Mise: 500-1000 TAMA | Gain: jusqu\'à 10x!', hi: 'दांव: 500-1000 TAMA | जीत: 10x तक!',
        ko: '베팅: 500-1000 TAMA | 승리: 최대 10배!', tr: 'Bahis: 500-1000 TAMA | Kazanç: 10x\'e kadar!',
        de: 'Einsatz: 500-1000 TAMA | Gewinn: bis zu 10x!', ar: 'رهان: 500-1000 | ربح: حتى 10x!',
        vi: 'Cược: 500-1000 TAMA | Thắng: lên đến 10x!'
    },
    'super_tama_bros': {
        en: 'SUPER TAMA BROS', ru: 'СУПЕР ТАМА БРОС', zh: '超级塔马兄弟', es: 'SUPER TAMA BROS', pt: 'SUPER TAMA BROS',
        ja: 'スーパータマブラザーズ', fr: 'SUPER TAMA BROS', hi: 'सुपर तमा ब्रदर्स', ko: '슈퍼 타마 브로스', tr: 'SÜPER TAMA BROS',
        de: 'SUPER TAMA BROS', ar: 'سوبر تاما بروس', vi: 'SUPER TAMA BROS'
    },
    'super_tama_bros_desc': {
        en: '100 TAMA | 3 Levels | Win: up to 1000+ TAMA!', ru: '100 TAMA | 3 уровня | Выигрыш: до 1000+ TAMA!',
        zh: '100 TAMA | 3关 | 赢: 最高1000+ TAMA!', es: '100 TAMA | 3 Niveles | Gana: hasta 1000+ TAMA!',
        pt: '100 TAMA | 3 Níveis | Ganhe: até 1000+ TAMA!', ja: '100 TAMA | 3レベル | 勝利: 1000+ TAMAまで!',
        fr: '100 TAMA | 3 Niveaux | Gain: jusqu\'à 1000+ TAMA!', hi: '100 TAMA | 3 लेवल | जीत: 1000+ TAMA तक!',
        ko: '100 TAMA | 3레벨 | 승리: 1000+ TAMA까지!', tr: '100 TAMA | 3 Seviye | Kazanç: 1000+ TAMA\'ya kadar!',
        de: '100 TAMA | 3 Level | Gewinn: bis zu 1000+ TAMA!', ar: '100 TAMA | 3 مستويات | ربح: حتى 1000+!',
        vi: '100 TAMA | 3 Cấp | Thắng: lên đến 1000+ TAMA!'
    },
    'color_match': {
        en: 'TAMA COLOR MATCH', ru: 'ТАМА ЦВЕТА', zh: '塔马颜色配对', es: 'COLORES TAMA', pt: 'CORES TAMA',
        ja: 'タマカラーマッチ', fr: 'COULEURS TAMA', hi: 'तमा कलर मैच', ko: '타마 컬러 매치', tr: 'TAMA RENK EŞLEŞTİRME',
        de: 'TAMA FARBSPIEL', ar: 'تاما الألوان', vi: 'TAMA GHÉP MÀU'
    },
    'color_match_desc': {
        en: '50-300 TAMA | Memory Game | Win: up to 5x!', ru: '50-300 TAMA | Игра на память | Выигрыш: до 5x!',
        zh: '50-300 TAMA | 记忆游戏 | 赢: 最高5倍!', es: '50-300 TAMA | Juego de Memoria | Gana: hasta 5x!',
        pt: '50-300 TAMA | Jogo de Memória | Ganhe: até 5x!', ja: '50-300 TAMA | メモリーゲーム | 勝利: 最大5倍!',
        fr: '50-300 TAMA | Jeu de Mémoire | Gain: jusqu\'à 5x!', hi: '50-300 TAMA | मेमोरी गेम | जीत: 5x तक!',
        ko: '50-300 TAMA | 메모리 게임 | 승리: 최대 5배!', tr: '50-300 TAMA | Hafıza Oyunu | Kazanç: 5x\'e kadar!',
        de: '50-300 TAMA | Gedächtnisspiel | Gewinn: bis zu 5x!', ar: '50-300 TAMA | لعبة الذاكرة | ربح: حتى 5x!',
        vi: '50-300 TAMA | Trò chơi trí nhớ | Thắng: lên đến 5x!'
    },
    'tama_shooter': {
        en: 'TAMA SHOOTER', ru: 'ТАМА СТРЕЛЯЛКА', zh: '塔马射击', es: 'TAMA SHOOTER', pt: 'TAMA SHOOTER',
        ja: 'タマシューター', fr: 'TAMA SHOOTER', hi: 'तमा शूटर', ko: '타마 슈터', tr: 'TAMA SHOOTER',
        de: 'TAMA SHOOTER', ar: 'تاما شوتر', vi: 'TAMA BẮN SÚNG'
    },
    'tama_shooter_desc': {
        en: '100-500 TAMA | 10 Waves | Win: up to 3x!', ru: '100-500 TAMA | 10 волн | Выигрыш: до 3x!',
        zh: '100-500 TAMA | 10波 | 赢: 最高3倍!', es: '100-500 TAMA | 10 Oleadas | Gana: hasta 3x!',
        pt: '100-500 TAMA | 10 Ondas | Ganhe: até 3x!', ja: '100-500 TAMA | 10ウェーブ | 勝利: 最大3倍!',
        fr: '100-500 TAMA | 10 Vagues | Gain: jusqu\'à 3x!', hi: '100-500 TAMA | 10 वेव | जीत: 3x तक!',
        ko: '100-500 TAMA | 10웨이브 | 승리: 최대 3배!', tr: '100-500 TAMA | 10 Dalga | Kazanç: 3x\'e kadar!',
        de: '100-500 TAMA | 10 Wellen | Gewinn: bis zu 3x!', ar: '100-500 TAMA | 10 موجات | ربح: حتى 3x!',
        vi: '100-500 TAMA | 10 Wave | Thắng: lên đến 3x!'
    },
    'dice_roll': {
        en: 'Dice Roll', ru: 'Кости', zh: '骰子', es: 'Dados', pt: 'Dados',
        ja: 'サイコロ', fr: 'Dés', hi: 'पासा', ko: '주사위', tr: 'Zar',
        de: 'Würfel', ar: 'نرد', vi: 'Xúc xắc'
    },
    'pet_battle': {
        en: 'PET BATTLE ARENA', ru: 'АРЕНА ПИТОМЦЕВ', zh: '宠物竞技场', es: 'ARENA DE MASCOTAS', pt: 'ARENA DE PETS',
        ja: 'ペットバトルアリーナ', fr: 'ARÈNE DE COMBAT', hi: 'पेट बैटल एरीना', ko: '펫 배틀 아레나', tr: 'EVCIL HAYVAN ARENASI',
        de: 'PET KAMPFARENA', ar: 'ساحة قتال الحيوانات', vi: 'ĐẤU TRƯỜNG THÚ CƯNG'
    },
    'choose_pet_battle': {
        en: 'Choose your NFT pet and battle!', ru: 'Выбери своего NFT питомца и сражайся!', zh: '选择你的NFT宠物战斗!',
        es: '¡Elige tu mascota NFT y batalla!', pt: 'Escolha seu pet NFT e batalhe!', ja: 'NFTペットを選んでバトル!',
        fr: 'Choisissez votre pet NFT et combattez!', hi: 'अपना NFT पेट चुनें और लड़ें!', ko: 'NFT 펫을 선택하고 싸우세요!',
        tr: 'NFT evcil hayvanınızı seçin ve savaşın!', de: 'Wähle dein NFT-Haustier und kämpfe!',
        ar: 'اختر حيوانك NFT وقاتل!', vi: 'Chọn thú cưng NFT và chiến đấu!'
    },
    'tama_tower': {
        en: 'TAMA TOWER', ru: 'ТАМА БАШНЯ', zh: '塔马塔', es: 'TORRE TAMA', pt: 'TORRE TAMA',
        ja: 'タマタワー', fr: 'TOUR TAMA', hi: 'तमा टावर', ko: '타마 타워', tr: 'TAMA KULESİ',
        de: 'TAMA TURM', ar: 'برج تاما', vi: 'THÁP TAMA'
    },
    'tower_desc': {
        en: 'Build a tower! Higher = more reward! But it can fall anytime!', ru: 'Строй башню! Выше = больше награда! Но может упасть!',
        zh: '建塔! 越高=越多奖励! 但可能随时倒塌!', es: '¡Construye una torre! Más alto = más recompensa! ¡Pero puede caer!',
        pt: 'Construa uma torre! Mais alto = mais recompensa! Mas pode cair!', ja: 'タワーを建てよう! 高い = 報酬UP! でも倒れるかも!',
        fr: 'Construisez une tour! Plus haut = plus de récompense! Mais elle peut tomber!', hi: 'टावर बनाओ! ऊंचा = ज्यादा इनाम! लेकिन गिर सकता है!',
        ko: '타워를 쌓으세요! 높을수록 = 더 많은 보상! 하지만 무너질 수 있어요!', tr: 'Bir kule inşa et! Yüksek = daha fazla ödül! Ama düşebilir!',
        de: 'Bau einen Turm! Höher = mehr Belohnung! Aber er kann fallen!', ar: 'ابن برجاً! أعلى = مكافأة أكبر! لكنه قد يسقط!',
        vi: 'Xây tháp! Cao hơn = nhiều phần thưởng hơn! Nhưng có thể đổ!'
    },
    'precision_click': {
        en: 'PRECISION CLICK', ru: 'ТОЧНЫЙ КЛИК', zh: '精准点击', es: 'CLIC PRECISO', pt: 'CLIQUE PRECISO',
        ja: 'プレシジョンクリック', fr: 'CLIC PRÉCIS', hi: 'प्रिसिशन क्लिक', ko: '정밀 클릭', tr: 'HASSAS TIKLA',
        de: 'PRÄZISIONSKLICK', ar: 'نقرة دقيقة', vi: 'NHẤP CHÍNH XÁC'
    },
    'precision_desc': {
        en: 'Click exactly when the target is in the center!', ru: 'Кликни точно когда цель в центре!', zh: '当目标在中心时精确点击!',
        es: '¡Haz clic exactamente cuando el objetivo esté en el centro!', pt: 'Clique exatamente quando o alvo estiver no centro!',
        ja: 'ターゲットが中央にあるときにクリック!', fr: 'Cliquez exactement quand la cible est au centre!',
        hi: 'जब टारगेट बीच में हो तब क्लिक करें!', ko: '타겟이 중앙에 있을 때 정확히 클릭하세요!',
        tr: 'Hedef tam ortadayken tıklayın!', de: 'Klicke genau wenn das Ziel in der Mitte ist!',
        ar: 'انقر بالضبط عندما يكون الهدف في المنتصف!', vi: 'Nhấp chính xác khi mục tiêu ở giữa!'
    },
    'roulette': {
        en: 'ROULETTE', ru: 'РУЛЕТКА', zh: '轮盘', es: 'RULETA', pt: 'ROLETA',
        ja: 'ルーレット', fr: 'ROULETTE', hi: 'रूलेट', ko: '룰렛', tr: 'RULET',
        de: 'ROULETTE', ar: 'روليت', vi: 'VÒNG QUAY'
    },
    'roulette_desc': {
        en: 'Place your bets! Classic casino game!', ru: 'Делай ставки! Классическая казино игра!', zh: '下注! 经典赌场游戏!',
        es: '¡Haz tus apuestas! ¡Juego de casino clásico!', pt: 'Faça suas apostas! Jogo de cassino clássico!',
        ja: 'ベットしよう! クラシックカジノゲーム!', fr: 'Placez vos paris! Jeu de casino classique!',
        hi: 'अपने दांव लगाओ! क्लासिक कैसीनो गेम!', ko: '베팅하세요! 클래식 카지노 게임!',
        tr: 'Bahislerinizi koyun! Klasik kumarhane oyunu!', de: 'Platzieren Sie Ihre Wetten! Klassisches Casinospiel!',
        ar: 'ضع رهاناتك! لعبة كازينو كلاسيكية!', vi: 'Đặt cược! Trò chơi casino cổ điển!'
    },
    'card_game': {
        en: 'CARD GAME', ru: 'КАРТЫ', zh: '纸牌', es: 'CARTAS', pt: 'CARTAS',
        ja: 'カードゲーム', fr: 'JEU DE CARTES', hi: 'कार्ड गेम', ko: '카드 게임', tr: 'KART OYUNU',
        de: 'KARTENSPIEL', ar: 'لعبة الورق', vi: 'BÀI'
    },
    'card_game_desc': {
        en: 'Play Blackjack! Beat the dealer!', ru: 'Играй в блэкджек! Обыграй дилера!', zh: '玩21点! 击败庄家!',
        es: '¡Juega al Blackjack! ¡Gana al crupier!', pt: 'Jogue Blackjack! Vença o dealer!',
        ja: 'ブラックジャックをプレイ! ディーラーに勝て!', fr: 'Jouez au Blackjack! Battez le croupier!',
        hi: 'ब्लैकजैक खेलो! डीलर को हराओ!', ko: '블랙잭 플레이! 딜러를 이겨라!',
        tr: 'Blackjack oyna! Krupiyeyi yen!', de: 'Spiele Blackjack! Schlage den Dealer!',
        ar: 'العب بلاك جاك! اهزم الموزع!', vi: 'Chơi Blackjack! Đánh bại nhà cái!'
    },

    // ========== GAME BUTTONS ==========
    'start': {
        en: 'START!', ru: 'СТАРТ!', zh: '开始!', es: '¡INICIO!', pt: 'INICIAR!',
        ja: 'スタート!', fr: 'DÉMARRER!', hi: 'शुरू!', ko: '시작!', tr: 'BAŞLA!',
        de: 'START!', ar: 'ابدأ!', vi: 'BẮT ĐẦU!'
    },
    'roll': {
        en: 'ROLL!', ru: 'БРОСИТЬ!', zh: '掷!', es: '¡TIRAR!', pt: 'ROLAR!',
        ja: 'ロール!', fr: 'LANCER!', hi: 'रोल!', ko: '굴려!', tr: 'AT!',
        de: 'WÜRFELN!', ar: 'ارمِ!', vi: 'LĂN!'
    },
    'start_battle': {
        en: 'START BATTLE!', ru: 'НАЧАТЬ БОЙ!', zh: '开始战斗!', es: '¡INICIAR BATALLA!', pt: 'INICIAR BATALHA!',
        ja: 'バトル開始!', fr: 'COMMENCER LE COMBAT!', hi: 'युद्ध शुरू!', ko: '전투 시작!', tr: 'SAVAŞI BAŞLAT!',
        de: 'KAMPF STARTEN!', ar: 'ابدأ المعركة!', vi: 'BẮT ĐẦU CHIẾN ĐẤU!'
    },
    'add_block': {
        en: 'ADD BLOCK', ru: 'ДОБАВИТЬ БЛОК', zh: '添加方块', es: 'AÑADIR BLOQUE', pt: 'ADICIONAR BLOCO',
        ja: 'ブロック追加', fr: 'AJOUTER UN BLOC', hi: 'ब्लॉक जोड़ें', ko: '블록 추가', tr: 'BLOK EKLE',
        de: 'BLOCK HINZUFÜGEN', ar: 'إضافة كتلة', vi: 'THÊM KHỐI'
    },
    'cash_out': {
        en: 'CASH OUT', ru: 'ЗАБРАТЬ', zh: '提现', es: 'RETIRAR', pt: 'SACAR',
        ja: 'キャッシュアウト', fr: 'ENCAISSER', hi: 'कैश आउट', ko: '캐시아웃', tr: 'PARA ÇEK',
        de: 'AUSZAHLEN', ar: 'سحب النقود', vi: 'RÚT TIỀN'
    },
    'start_building': {
        en: 'START BUILDING!', ru: 'НАЧАТЬ СТРОИТЬ!', zh: '开始建造!', es: '¡EMPEZAR A CONSTRUIR!', pt: 'COMEÇAR A CONSTRUIR!',
        ja: '建設開始!', fr: 'COMMENCER À CONSTRUIRE!', hi: 'बिल्डिंग शुरू!', ko: '건설 시작!', tr: 'İNŞAATA BAŞLA!',
        de: 'MIT DEM BAU BEGINNEN!', ar: 'ابدأ البناء!', vi: 'BẮT ĐẦU XÂY!'
    },
    'deal_cards': {
        en: 'DEAL CARDS!', ru: 'РАЗДАТЬ КАРТЫ!', zh: '发牌!', es: '¡REPARTIR CARTAS!', pt: 'DISTRIBUIR CARTAS!',
        ja: 'カード配布!', fr: 'DISTRIBUER LES CARTES!', hi: 'कार्ड बांटो!', ko: '카드 돌려!', tr: 'KART DAĞIT!',
        de: 'KARTEN GEBEN!', ar: 'وزع الورق!', vi: 'CHIA BÀI!'
    },
    'hit': {
        en: 'HIT', ru: 'ЕЩЁ', zh: '要牌', es: 'PEDIR', pt: 'PEDIR',
        ja: 'ヒット', fr: 'TIRER', hi: 'हिट', ko: '히트', tr: 'ÇEK',
        de: 'KARTE', ar: 'اسحب', vi: 'BỐC'
    },
    'stand': {
        en: 'STAND', ru: 'СТОП', zh: '停牌', es: 'PLANTARSE', pt: 'PARAR',
        ja: 'スタンド', fr: 'RESTER', hi: 'स्टैंड', ko: '스탠드', tr: 'KAL',
        de: 'HALTEN', ar: 'توقف', vi: 'DỪNG'
    },
    'perfect': {
        en: 'Perfect', ru: 'Идеально', zh: '完美', es: 'Perfecto', pt: 'Perfeito',
        ja: 'パーフェクト', fr: 'Parfait', hi: 'परफेक्ट', ko: '퍼펙트', tr: 'Mükemmel',
        de: 'Perfekt', ar: 'مثالي', vi: 'Hoàn hảo'
    },
    'wins': {
        en: 'Wins', ru: 'Победы', zh: '胜利', es: 'Victorias', pt: 'Vitórias',
        ja: '勝利', fr: 'Victoires', hi: 'जीत', ko: '승리', tr: 'Kazanılan',
        de: 'Siege', ar: 'انتصارات', vi: 'Thắng'
    },
    'losses': {
        en: 'Losses', ru: 'Поражения', zh: '失败', es: 'Derrotas', pt: 'Derrotas',
        ja: '敗北', fr: 'Défaites', hi: 'हार', ko: '패배', tr: 'Kaybedilen',
        de: 'Niederlagen', ar: 'خسائر', vi: 'Thua'
    },

    // ========== MODALS ==========
    'top_players': {
        en: 'Top Players', ru: 'Топ игроков', zh: '顶级玩家', es: 'Mejores Jugadores', pt: 'Melhores Jogadores',
        ja: 'トッププレイヤー', fr: 'Meilleurs Joueurs', hi: 'टॉप प्लेयर्स', ko: '최고 플레이어', tr: 'En İyi Oyuncular',
        de: 'Top Spieler', ar: 'أفضل اللاعبين', vi: 'Người chơi hàng đầu'
    },
    'change_name': {
        en: 'Change Your Name', ru: 'Изменить имя', zh: '更改名字', es: 'Cambiar Nombre', pt: 'Alterar Nome',
        ja: '名前を変更', fr: 'Changer de Nom', hi: 'नाम बदलें', ko: '이름 변경', tr: 'Adını Değiştir',
        de: 'Namen ändern', ar: 'غير اسمك', vi: 'Đổi tên'
    },
    'choose_display_name': {
        en: 'Choose your display name:', ru: 'Выберите отображаемое имя:', zh: '选择您的显示名称:', es: 'Elige tu nombre:',
        pt: 'Escolha seu nome de exibição:', ja: '表示名を選択:', fr: 'Choisissez votre nom:', hi: 'अपना नाम चुनें:',
        ko: '표시 이름을 선택하세요:', tr: 'Görünen adınızı seçin:', de: 'Wählen Sie Ihren Anzeigenamen:',
        ar: 'اختر اسم العرض الخاص بك:', vi: 'Chọn tên hiển thị của bạn:'
    },
    'enter_name': {
        en: 'Enter your name', ru: 'Введите имя', zh: '输入名字', es: 'Ingresa tu nombre', pt: 'Digite seu nome',
        ja: '名前を入力', fr: 'Entrez votre nom', hi: 'अपना नाम दर्ज करें', ko: '이름을 입력하세요', tr: 'Adınızı girin',
        de: 'Namen eingeben', ar: 'أدخل اسمك', vi: 'Nhập tên của bạn'
    },
    'help_guide': {
        en: 'Help & Guide', ru: 'Помощь и гайд', zh: '帮助和指南', es: 'Ayuda y Guía', pt: 'Ajuda e Guia',
        ja: 'ヘルプ＆ガイド', fr: 'Aide & Guide', hi: 'सहायता और गाइड', ko: '도움말 및 가이드', tr: 'Yardım ve Rehber',
        de: 'Hilfe & Anleitung', ar: 'المساعدة والدليل', vi: 'Trợ giúp & Hướng dẫn'
    },
    'quick_start': {
        en: 'Quick Start', ru: 'Быстрый старт', zh: '快速开始', es: 'Inicio Rápido', pt: 'Início Rápido',
        ja: 'クイックスタート', fr: 'Démarrage Rapide', hi: 'क्विक स्टार्ट', ko: '빠른 시작', tr: 'Hızlı Başlangıç',
        de: 'Schnellstart', ar: 'بداية سريعة', vi: 'Bắt đầu nhanh'
    },
    'how_to_earn': {
        en: 'How to Earn', ru: 'Как заработать', zh: '如何赚取', es: 'Cómo Ganar', pt: 'Como Ganhar',
        ja: '稼ぎ方', fr: 'Comment Gagner', hi: 'कैसे कमाएं', ko: '수익 방법', tr: 'Nasıl Kazanılır',
        de: 'Wie man verdient', ar: 'كيف تكسب', vi: 'Cách kiếm tiền'
    },
    'shop_guide': {
        en: 'Shop Guide', ru: 'Гайд по магазину', zh: '商店指南', es: 'Guía de Tienda', pt: 'Guia da Loja',
        ja: 'ショップガイド', fr: 'Guide Boutique', hi: 'शॉप गाइड', ko: '상점 가이드', tr: 'Mağaza Rehberi',
        de: 'Shop-Anleitung', ar: 'دليل المتجر', vi: 'Hướng dẫn cửa hàng'
    },
    'faq': {
        en: 'FAQ', ru: 'ЧаВо', zh: '常见问题', es: 'Preguntas', pt: 'Perguntas', ja: 'よくある質問',
        fr: 'FAQ', hi: 'अक्सर पूछे जाने वाले प्रश्न', ko: '자주 묻는 질문', tr: 'SSS',
        de: 'FAQ', ar: 'الأسئلة الشائعة', vi: 'Câu hỏi thường gặp'
    },
    'level': {
        en: 'Level', ru: 'Уровень', zh: '等级', es: 'Nivel', pt: 'Nível',
        ja: 'レベル', fr: 'Niveau', hi: 'लेवल', ko: '레벨', tr: 'Seviye',
        de: 'Level', ar: 'المستوى', vi: 'Cấp'
    },
    'rank': {
        en: 'Rank', ru: 'Ранг', zh: '排名', es: 'Rango', pt: 'Ranking',
        ja: 'ランク', fr: 'Rang', hi: 'रैंक', ko: '순위', tr: 'Sıralama',
        de: 'Rang', ar: 'الترتيب', vi: 'Hạng'
    }
};

// Current language (default: English)
let currentLanguage = 'en';

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {object} params - Optional parameters for interpolation
 * @returns {string} Translated string
 */
function t(key, params = {}) {
    const translation = TRANSLATIONS[key];
    if (!translation) {
        console.warn(`[i18n] Missing translation key: ${key}`);
        return key;
    }
    
    let text = translation[currentLanguage] || translation['en'] || key;
    
    // Simple parameter interpolation: {param} -> value
    Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
    });
    
    return text;
}

/**
 * Set current language
 * @param {string} langCode - Language code (e.g., 'en', 'ru', 'zh')
 */
function setLanguage(langCode) {
    if (SUPPORTED_LANGUAGES[langCode]) {
        currentLanguage = langCode;
        localStorage.setItem('gameLanguage', langCode);
        
        // Update all elements with data-i18n attribute
        updatePageTranslations();
        
        // Dispatch event for custom handlers
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }));
        
        console.log(`[i18n] Language changed to: ${langCode} (${SUPPORTED_LANGUAGES[langCode].native})`);
    } else {
        console.warn(`[i18n] Unsupported language: ${langCode}`);
    }
}

/**
 * Get current language code
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Update all page translations
 */
function updatePageTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    // Update elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Update elements with data-i18n-title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });
}

/**
 * Initialize i18n system
 */
function initI18n() {
    // Try to get language from various sources
    let lang = 'en';
    
    // 1. Check localStorage
    const savedLang = localStorage.getItem('gameLanguage');
    if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
        lang = savedLang;
    }
    // 2. Check Telegram WebApp
    else if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
        const tgLang = window.Telegram.WebApp.initDataUnsafe.user.language_code;
        if (SUPPORTED_LANGUAGES[tgLang]) {
            lang = tgLang;
        }
    }
    // 3. Check browser language
    else {
        const browserLang = navigator.language?.split('-')[0];
        if (SUPPORTED_LANGUAGES[browserLang]) {
            lang = browserLang;
        }
    }
    
    currentLanguage = lang;
    console.log(`[i18n] Initialized with language: ${lang}`);
    
    // Update page on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updatePageTranslations);
    } else {
        updatePageTranslations();
    }
}

/**
 * Create and show language selector modal
 */
function showLanguageSelector() {
    // Remove existing modal if any
    const existingModal = document.getElementById('language-selector-modal');
    if (existingModal) existingModal.remove();
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'language-selector-modal';
    modal.innerHTML = `
        <div class="lang-modal-overlay" onclick="hideLanguageSelector()"></div>
        <div class="lang-modal-content">
            <div class="lang-modal-header">
                <span class="lang-modal-title">🌍 ${t('select_language')}</span>
                <button class="lang-modal-close" onclick="hideLanguageSelector()">✕</button>
            </div>
            <div class="lang-modal-grid">
                ${Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => `
                    <button class="lang-btn ${code === currentLanguage ? 'active' : ''}" 
                            onclick="selectLanguage('${code}')">
                        <span class="lang-flag">${lang.flag}</span>
                        <span class="lang-name">${lang.native}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('lang-selector-styles')) {
        const styles = document.createElement('style');
        styles.id = 'lang-selector-styles';
        styles.textContent = `
            #language-selector-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.2s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .lang-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            }
            
            .lang-modal-content {
                position: relative;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 20px;
                max-width: 400px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(138, 43, 226, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: slideUp 0.3s ease;
            }
            
            .lang-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .lang-modal-title {
                font-size: 20px;
                font-weight: bold;
                color: #fff;
            }
            
            .lang-modal-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #fff;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.2s;
            }
            
            .lang-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            
            .lang-modal-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
            
            .lang-btn {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 15px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid transparent;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
                color: #fff;
            }
            
            .lang-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(138, 43, 226, 0.5);
                transform: translateY(-2px);
            }
            
            .lang-btn.active {
                background: linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.3));
                border-color: #8a2be2;
                box-shadow: 0 0 20px rgba(138, 43, 226, 0.3);
            }
            
            .lang-flag {
                font-size: 24px;
            }
            
            .lang-name {
                font-size: 14px;
                font-weight: 500;
            }
            
            /* Mobile adjustments */
            @media (max-width: 400px) {
                .lang-modal-grid {
                    grid-template-columns: 1fr;
                }
                .lang-modal-content {
                    padding: 15px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
}

/**
 * Hide language selector modal
 */
function hideLanguageSelector() {
    const modal = document.getElementById('language-selector-modal');
    if (modal) {
        modal.style.animation = 'fadeIn 0.2s ease reverse';
        setTimeout(() => modal.remove(), 200);
    }
}

/**
 * Select language and close modal
 */
function selectLanguage(langCode) {
    setLanguage(langCode);
    hideLanguageSelector();
    
    // Show confirmation toast
    showToast(`${SUPPORTED_LANGUAGES[langCode].flag} ${SUPPORTED_LANGUAGES[langCode].native}`);
}

/**
 * Show toast notification
 */
function showToast(message, duration = 2000) {
    const existingToast = document.querySelector('.i18n-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'i18n-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #8a2be2, #4b0082);
        color: white;
        padding: 12px 24px;
        border-radius: 30px;
        font-weight: bold;
        z-index: 10001;
        animation: toastIn 0.3s ease;
        box-shadow: 0 5px 20px rgba(138, 43, 226, 0.4);
    `;
    
    if (!document.getElementById('toast-animation-style')) {
        const style = document.createElement('style');
        style.id = 'toast-animation-style';
        style.textContent = `
            @keyframes toastIn {
                from { transform: translateX(-50%) translateY(20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Create language button for header/UI
 * @returns {HTMLElement} Language button element
 */
function createLanguageButton() {
    const btn = document.createElement('button');
    btn.className = 'lang-switch-btn';
    btn.innerHTML = `${SUPPORTED_LANGUAGES[currentLanguage].flag}`;
    btn.title = t('language');
    btn.onclick = showLanguageSelector;
    
    // Add button styles if not exists
    if (!document.getElementById('lang-btn-styles')) {
        const style = document.createElement('style');
        style.id = 'lang-btn-styles';
        style.textContent = `
            .lang-switch-btn {
                background: linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.3));
                border: 2px solid rgba(138, 43, 226, 0.5);
                border-radius: 12px;
                padding: 8px 12px;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(138, 43, 226, 0.2);
            }
            .lang-switch-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(138, 43, 226, 0.4);
                border-color: #8a2be2;
            }
            .lang-switch-btn:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update flag when language changes
    window.addEventListener('languageChanged', (e) => {
        btn.innerHTML = `${SUPPORTED_LANGUAGES[e.detail.language].flag}`;
    });
    
    return btn;
}

// Initialize on load
initI18n();

// Export for use in other scripts
window.i18n = {
    t,
    setLanguage,
    getCurrentLanguage,
    showLanguageSelector,
    hideLanguageSelector,
    createLanguageButton,
    SUPPORTED_LANGUAGES,
    TRANSLATIONS
};
