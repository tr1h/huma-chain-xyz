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
    'daily_clicks': {
        en: 'Daily Clicks', ru: 'Дневные клики', zh: '每日点击', es: 'Clics diarios', pt: 'Cliques diários',
        ja: 'デイリークリック', fr: 'Clics quotidiens', hi: 'दैनिक क्लिक', ko: '일일 클릭', tr: 'Günlük tıklama',
        de: 'Tägliche Klicks', ar: 'النقرات اليومية', vi: 'Nhấp hàng ngày'
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
        en: 'NFTs', ru: 'NFT', zh: 'NFT', es: 'NFTs', pt: 'NFTs',
        ja: 'NFT', fr: 'NFTs', hi: 'NFT', ko: 'NFT', tr: 'NFT',
        de: 'NFTs', ar: 'NFT', vi: 'NFT'
    },
    'profile': {
        en: 'Profile', ru: 'Профиль', zh: '个人资料', es: 'Perfil', pt: 'Perfil',
        ja: 'プロフィール', fr: 'Profil', hi: 'प्रोफाइल', ko: '프로필', tr: 'Profil',
        de: 'Profil', ar: 'الملف الشخصي', vi: 'Hồ sơ'
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
