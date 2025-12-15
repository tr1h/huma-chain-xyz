/**
 * рџЊЌ Internationalization (i18n) System for Solana Tamagotchi
 * Supports 13 languages with beautiful language selector
 *
 * Usage:
 *   t('key') - Get translation for current language
 *   setLanguage('ru') - Change language
 *   getCurrentLanguage() - Get current language code
 */

// Supported languages with flags and native names
const SUPPORTED_LANGUAGES = {
    en: { flag: 'рџ‡¬рџ‡§', name: 'English', native: 'English' },
    ru: { flag: 'рџ‡·рџ‡є', name: 'Russian', native: 'Р СѓСЃСЃРєРёР№' },
    zh: { flag: 'рџ‡Ёрџ‡і', name: 'Chinese', native: 'дё­ж–‡' },
    es: { flag: 'рџ‡Єрџ‡ё', name: 'Spanish', native: 'EspaГ±ol' },
    pt: { flag: 'рџ‡§рџ‡·', name: 'Portuguese', native: 'PortuguГЄs' },
    ja: { flag: 'рџ‡Їрџ‡µ', name: 'Japanese', native: 'ж—Ґжњ¬иЄћ' },
    fr: { flag: 'рџ‡«рџ‡·', name: 'French', native: 'FranГ§ais' },
    hi: { flag: 'рџ‡®рџ‡і', name: 'Hindi', native: 'а¤№а¤їа¤ЁаҐЌа¤¦аҐЂ' },
    ko: { flag: 'рџ‡°рџ‡·', name: 'Korean', native: 'н•њкµ­м–ґ' },
    tr: { flag: 'рџ‡№рџ‡·', name: 'Turkish', native: 'TГјrkГ§e' },
    de: { flag: 'рџ‡©рџ‡Є', name: 'German', native: 'Deutsch' },
    ar: { flag: 'рџ‡ёрџ‡¦', name: 'Arabic', native: 'Ш§Щ„Ш№Ш±ШЁЩЉШ©' },
    vi: { flag: 'рџ‡»рџ‡і', name: 'Vietnamese', native: 'Tiбєїng Viб»‡t' }
};

// All translations
const TRANSLATIONS = {
    // ========== HEADER ==========
    'level': {
        en: 'Level', ru: 'РЈСЂРѕРІРµРЅСЊ', zh: 'з­‰зє§', es: 'Nivel', pt: 'NГ­vel',
        ja: 'гѓ¬гѓ™гѓ«', fr: 'Niveau', hi: 'а¤ёаҐЌа¤¤а¤°', ko: 'л €лІЁ', tr: 'Seviye',
        de: 'Level', ar: 'Ш§Щ„Щ…ШіШЄЩ€Щ‰', vi: 'CбєҐp Д‘б»™'
    },
    'player': {
        en: 'Player', ru: 'РРіСЂРѕРє', zh: 'зЋ©е®¶', es: 'Jugador', pt: 'Jogador',
        ja: 'гѓ—гѓ¬г‚¤гѓ¤гѓј', fr: 'Joueur', hi: 'а¤–а¤їа¤Іа¤ѕа¤Ўа¤јаҐЂ', ko: 'н”Њл €мќґм–ґ', tr: 'Oyuncu',
        de: 'Spieler', ar: 'Щ„Ш§Ш№ШЁ', vi: 'NgЖ°б»ќi chЖЎi'
    },

    // ========== STATS ==========
    'health': {
        en: 'Health', ru: 'Р—РґРѕСЂРѕРІСЊРµ', zh: 'з”џе‘Ѕ', es: 'Salud', pt: 'SaГєde',
        ja: 'дЅ“еЉ›', fr: 'SantГ©', hi: 'а¤ёаҐЌа¤µа¤ѕа¤ёаҐЌа¤ҐаҐЌа¤Ї', ko: 'мІґл Ґ', tr: 'SaДџlД±k',
        de: 'Gesundheit', ar: 'Ш§Щ„ШµШ­Ш©', vi: 'Sб»©c khб»Џe'
    },
    'food': {
        en: 'Food', ru: 'Р•РґР°', zh: 'йЈџз‰©', es: 'Comida', pt: 'Comida',
        ja: 'йЈџгЃ№з‰©', fr: 'Nourriture', hi: 'а¤­аҐ‹а¤ња¤Ё', ko: 'мќЊм‹ќ', tr: 'Yiyecek',
        de: 'Essen', ar: 'Ш·Ш№Ш§Щ…', vi: 'Thб»©c Дѓn'
    },
    'happiness': {
        en: 'Happiness', ru: 'РЎС‡Р°СЃС‚СЊРµ', zh: 'еї«д№ђ', es: 'Felicidad', pt: 'Felicidade',
        ja: 'е№ёз¦Џ', fr: 'Bonheur', hi: 'а¤–аҐЃа¤¶аҐЂ', ko: 'н–‰ліµ', tr: 'Mutluluk',
        de: 'GlГјck', ar: 'Ш§Щ„ШіШ№Ш§ШЇШ©', vi: 'HбєЎnh phГєc'
    },
    'energy': {
        en: 'Energy', ru: 'Р­РЅРµСЂРіРёСЏ', zh: 'иѓЅй‡Џ', es: 'EnergГ­a', pt: 'Energia',
        ja: 'г‚ЁгѓЌгѓ«г‚®гѓј', fr: 'Г‰nergie', hi: 'а¤Ља¤°аҐЌа¤ња¤ѕ', ko: 'м—ђл„€м§Ђ', tr: 'Enerji',
        de: 'Energie', ar: 'Ш·Ш§Щ‚Ш©', vi: 'NДѓng lЖ°б»Јng'
    },

    // ========== ACTION BUTTONS ==========
    'feed': {
        en: 'Feed', ru: 'РљРѕСЂРјРёС‚СЊ', zh: 'е–‚йЈџ', es: 'Alimentar', pt: 'Alimentar',
        ja: 'й¤Њг‚’гЃ‚гЃ’г‚‹', fr: 'Nourrir', hi: 'а¤–а¤їа¤Іа¤ѕа¤Ёа¤ѕ', ko: 'лЁ№мќґмЈјкё°', tr: 'Besle',
        de: 'FГјttern', ar: 'ШЈШ·Ш№Щ…', vi: 'Cho Дѓn'
    },
    'play': {
        en: 'Play', ru: 'РРіСЂР°С‚СЊ', zh: 'зЋ©иЂЌ', es: 'Jugar', pt: 'Brincar',
        ja: 'йЃЉгЃ¶', fr: 'Jouer', hi: 'а¤–аҐ‡а¤Іа¤Ёа¤ѕ', ko: 'л†Ђкё°', tr: 'Oyna',
        de: 'Spielen', ar: 'Ш§Щ„Ш№ШЁ', vi: 'ChЖЎi'
    },
    'heal': {
        en: 'Heal', ru: 'Р›РµС‡РёС‚СЊ', zh: 'жІ»з–—', es: 'Curar', pt: 'Curar',
        ja: 'е›ћеѕ©', fr: 'Soigner', hi: 'а¤ аҐЂа¤• а¤•а¤°а¤Ёа¤ѕ', ko: 'м№лЈЊ', tr: 'Д°yileЕџtir',
        de: 'Heilen', ar: 'Ш№Щ„Ш§Ш¬', vi: 'Chб»Їa trб»‹'
    },
    'sleep': {
        en: 'Sleep', ru: 'РЎРїР°С‚СЊ', zh: 'зќЎи§‰', es: 'Dormir', pt: 'Dormir',
        ja: 'еЇќг‚‹', fr: 'Dormir', hi: 'а¤ёаҐ‹а¤Ёа¤ѕ', ko: 'мћђкё°', tr: 'Uyku',
        de: 'Schlafen', ar: 'Щ†Щ€Щ…', vi: 'Ngб»§'
    },

    // ========== MESSAGES ==========
    'click_to_earn': {
        en: 'Click on your pet to earn TAMA! рџђѕ',
        ru: 'РљР»РёРєР°Р№ РЅР° РїРёС‚РѕРјС†Р° С‡С‚РѕР±С‹ Р·Р°СЂР°Р±РѕС‚Р°С‚СЊ TAMA! рџђѕ',
        zh: 'з‚№е‡»е® з‰©иµљеЏ– TAMA! рџђѕ',
        es: 'ВЎHaz clic en tu mascota para ganar TAMA! рџђѕ',
        pt: 'Clique no seu pet para ganhar TAMA! рџђѕ',
        ja: 'гѓљгѓѓгѓ€г‚’г‚ЇгѓЄгѓѓг‚ЇгЃ—гЃ¦TAMAг‚’зЁјгЃ”гЃ†! рџђѕ',
        fr: 'Clique sur ton animal pour gagner des TAMA ! рџђѕ',
        hi: 'TAMA а¤•а¤®а¤ѕа¤ЁаҐ‡ а¤•аҐ‡ а¤Іа¤їа¤Џ а¤…а¤Єа¤ЁаҐ‡ а¤ЄаҐ‡а¤џ а¤Єа¤° а¤•аҐЌа¤Іа¤їа¤• а¤•а¤°аҐ‡а¤‚! рџђѕ',
        ko: 'нЋ«мќ„ нЃґл¦­н•м—¬ TAMAлҐј нљЌл“ќн•м„ёмљ”! рџђѕ',
        tr: 'TAMA kazanmak iГ§in evcil hayvanД±na tД±kla! рџђѕ',
        de: 'Klicke auf dein Haustier um TAMA zu verdienen! рџђѕ',
        ar: 'Ш§Щ†Щ‚Ш± Ш№Щ„Щ‰ Ш­ЩЉЩ€Ш§Щ†Щѓ Ш§Щ„ШЈЩ„ЩЉЩЃ Щ„ЩѓШіШЁ TAMA! рџђѕ',
        vi: 'NhбєҐn vГ o thГє cЖ°ng Д‘б»ѓ kiбєїm TAMA! рџђѕ'
    },
    'pet_hungry': {
        en: 'Your pet is hungry! рџЌ”',
        ru: 'РўРІРѕР№ РїРёС‚РѕРјРµС† РіРѕР»РѕРґРµРЅ! рџЌ”',
        zh: 'дЅ зљ„е® з‰©йҐїдє†! рџЌ”',
        es: 'ВЎTu mascota tiene hambre! рџЌ”',
        pt: 'Seu pet estГЎ com fome! рџЌ”',
        ja: 'гѓљгѓѓгѓ€гЃЊгЃЉи…№г‚’з©єгЃ‹гЃ›гЃ¦гЃ„гЃѕгЃ™! рџЌ”',
        fr: 'Ton animal a faim ! рџЌ”',
        hi: 'а¤†а¤Єа¤•а¤ѕ а¤ЄаҐ‡а¤џ а¤­аҐ‚а¤–а¤ѕ а¤№аҐ€! рџЌ”',
        ko: 'нЋ«мќґ л°°кі нЊЊмљ”! рџЌ”',
        tr: 'Evcil hayvanД±n aГ§! рџЌ”',
        de: 'Dein Haustier ist hungrig! рџЌ”',
        ar: 'Ш­ЩЉЩ€Ш§Щ†Щѓ Ш§Щ„ШЈЩ„ЩЉЩЃ Ш¬Ш§Ш¦Ш№! рџЌ”',
        vi: 'ThГє cЖ°ng cб»§a bбєЎn Д‘Гіi! рџЌ”'
    },
    'pet_sick': {
        en: 'Your pet is sick! рџ’Љ',
        ru: 'РўРІРѕР№ РїРёС‚РѕРјРµС† Р±РѕР»РµРЅ! рџ’Љ',
        zh: 'дЅ зљ„е® з‰©з”џз—…дє†! рџ’Љ',
        es: 'ВЎTu mascota estГЎ enferma! рџ’Љ',
        pt: 'Seu pet estГЎ doente! рџ’Љ',
        ja: 'гѓљгѓѓгѓ€гЃЊз—…ж°—гЃ§гЃ™! рџ’Љ',
        fr: 'Ton animal est malade ! рџ’Љ',
        hi: 'а¤†а¤Єа¤•а¤ѕ а¤ЄаҐ‡а¤џ а¤¬аҐЂа¤®а¤ѕа¤° а¤№аҐ€! рџ’Љ',
        ko: 'нЋ«мќґ м•„нЊЊмљ”! рџ’Љ',
        tr: 'Evcil hayvanД±n hasta! рџ’Љ',
        de: 'Dein Haustier ist krank! рџ’Љ',
        ar: 'Ш­ЩЉЩ€Ш§Щ†Щѓ Ш§Щ„ШЈЩ„ЩЉЩЃ Щ…Ш±ЩЉШ¶! рџ’Љ',
        vi: 'ThГє cЖ°ng cб»§a bбєЎn bб»‹ б»‘m! рџ’Љ'
    },
    'level_up': {
        en: 'Level Up! рџЋ‰',
        ru: 'РќРѕРІС‹Р№ СѓСЂРѕРІРµРЅСЊ! рџЋ‰',
        zh: 'еЌ‡зє§дє†! рџЋ‰',
        es: 'ВЎSubiste de nivel! рџЋ‰',
        pt: 'Subiu de nГ­vel! рџЋ‰',
        ja: 'гѓ¬гѓ™гѓ«г‚ўгѓѓгѓ—! рџЋ‰',
        fr: 'Niveau supГ©rieur ! рџЋ‰',
        hi: 'а¤ІаҐ‡а¤µа¤І а¤…а¤Є! рџЋ‰',
        ko: 'л €лІЁ м—…! рџЋ‰',
        tr: 'Seviye atladД±n! рџЋ‰',
        de: 'Level Up! рџЋ‰',
        ar: 'Ш§Ш±ШЄЩ‚ЩЉШЄ Щ…ШіШЄЩ€Щ‰! рџЋ‰',
        vi: 'LГЄn cбєҐp! рџЋ‰'
    },
    'not_enough_tama': {
        en: 'Not enough TAMA! рџ’°',
        ru: 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ TAMA! рџ’°',
        zh: 'TAMAдёЌи¶і! рџ’°',
        es: 'ВЎNo tienes suficiente TAMA! рџ’°',
        pt: 'TAMA insuficiente! рџ’°',
        ja: 'TAMAгЃЊи¶іг‚ЉгЃѕгЃ›г‚“! рџ’°',
        fr: 'Pas assez de TAMA ! рџ’°',
        hi: 'а¤Єа¤°аҐЌа¤Їа¤ѕа¤ЄаҐЌа¤¤ TAMA а¤Ёа¤№аҐЂа¤‚! рџ’°',
        ko: 'TAMAк°Ђ л¶ЂмЎ±н•ґмљ”! рџ’°',
        tr: 'Yeterli TAMA yok! рџ’°',
        de: 'Nicht genug TAMA! рџ’°',
        ar: 'Щ„Ш§ ЩЉЩ€Ш¬ШЇ TAMA ЩѓШ§ЩЃЩЉ! рџ’°',
        vi: 'KhГґng Д‘б»§ TAMA! рџ’°'
    },

    // ========== QUESTS ==========
    'quests': {
        en: 'Quests', ru: 'РљРІРµСЃС‚С‹', zh: 'д»»еЉЎ', es: 'Misiones', pt: 'MissГµes',
        ja: 'г‚Їг‚Ёг‚№гѓ€', fr: 'QuГЄtes', hi: 'а¤•аҐЌа¤µаҐ‡а¤ёаҐЌа¤џ', ko: 'нЂмЉ¤нЉё', tr: 'GГ¶revler',
        de: 'Aufgaben', ar: 'Ш§Щ„Щ…Щ‡Ш§Щ…', vi: 'Nhiб»‡m vб»Ґ'
    },
    'daily_quests': {
        en: 'Daily Quests', ru: 'Р”РЅРµРІРЅС‹Рµ РєРІРµСЃС‚С‹', zh: 'жЇЏж—Ґд»»еЉЎ', es: 'Misiones diarias', pt: 'MissГµes diГЎrias',
        ja: 'гѓ‡г‚¤гѓЄгѓјг‚Їг‚Ёг‚№гѓ€', fr: 'QuГЄtes quotidiennes', hi: 'а¤¦аҐ€а¤Ёа¤їа¤• а¤•аҐЌа¤µаҐ‡а¤ёаҐЌа¤џ', ko: 'мќјмќј нЂмЉ¤нЉё', tr: 'GГјnlГјk gГ¶revler',
        de: 'TГ¤gliche Aufgaben', ar: 'Ш§Щ„Щ…Щ‡Ш§Щ… Ш§Щ„ЩЉЩ€Щ…ЩЉШ©', vi: 'Nhiб»‡m vб»Ґ hГ ng ngГ y'
    },
    'daily_clicks': {
        en: 'Daily Clicks', ru: 'Р”РЅРµРІРЅС‹Рµ РєР»РёРєРё', zh: 'жЇЏж—Ґз‚№е‡»', es: 'Clics diarios', pt: 'Cliques diГЎrios',
        ja: 'гѓ‡г‚¤гѓЄгѓјг‚ЇгѓЄгѓѓг‚Ї', fr: 'Clics quotidiens', hi: 'а¤¦аҐ€а¤Ёа¤їа¤• а¤•аҐЌа¤Іа¤їа¤•', ko: 'мќјмќј нЃґл¦­', tr: 'GГјnlГјk tД±klama',
        de: 'TГ¤gliche Klicks', ar: 'Ш§Щ„Щ†Щ‚Ш±Ш§ШЄ Ш§Щ„ЩЉЩ€Щ…ЩЉШ©', vi: 'NhбєҐp hГ ng ngГ y'
    },
    'click_master': {
        en: 'Click Master', ru: 'РњР°СЃС‚РµСЂ РєР»РёРєРѕРІ', zh: 'з‚№е‡»е¤§её€', es: 'Maestro del clic', pt: 'Mestre dos cliques',
        ja: 'г‚ЇгѓЄгѓѓг‚Їгѓћг‚№г‚їгѓј', fr: 'MaГ®tre du clic', hi: 'а¤•аҐЌа¤Іа¤їа¤• а¤®а¤ѕа¤ёаҐЌа¤џа¤°', ko: 'нЃґл¦­ л§€мЉ¤н„°', tr: 'TД±klama UstasД±',
        de: 'Klick-Meister', ar: 'ШіЩЉШЇ Ш§Щ„Щ†Щ‚Ш±', vi: 'Bбє­c thбє§y click'
    },
    'click_50_times': {
        en: 'Click your pet 50 times', ru: 'РљР»РёРєРЅРё РЅР° РїРёС‚РѕРјС†Р° 50 СЂР°Р·', zh: 'з‚№е‡»е® з‰©50ж¬Ў', es: 'Haz clic 50 veces', pt: 'Clique 50 vezes',
        ja: 'гѓљгѓѓгѓ€г‚’50е›ћг‚ЇгѓЄгѓѓг‚Ї', fr: 'Clique 50 fois', hi: '50 а¤¬а¤ѕа¤° а¤•аҐЌа¤Іа¤їа¤• а¤•а¤°аҐ‡а¤‚', ko: '50лІ€ нЃґл¦­н•кё°', tr: '50 kez tД±kla',
        de: '50 mal klicken', ar: 'Ш§Щ†Щ‚Ш± 50 Щ…Ш±Ш©', vi: 'NhбєҐp 50 lбє§n'
    },
    'reach_level_5': {
        en: 'Reach level 5', ru: 'Р”РѕСЃС‚РёРіРЅРё 5 СѓСЂРѕРІРЅСЏ', zh: 'иѕѕе€°5зє§', es: 'Alcanza nivel 5', pt: 'Alcance nГ­vel 5',
        ja: 'гѓ¬гѓ™гѓ«5гЃ«е€°йЃ”', fr: 'Atteins niveau 5', hi: 'а¤ІаҐ‡а¤µа¤І 5 а¤Єа¤ѕа¤Џа¤‚', ko: 'л €лІЁ 5 л‹¬м„±', tr: 'Seviye 5 ulaЕџ',
        de: 'Level 5 erreichen', ar: 'Щ€ШµЩ€Щ„ Ш§Щ„Щ…ШіШЄЩ€Щ‰ 5', vi: 'ДђбєЎt cбєҐp 5'
    },

    // ========== MINI GAMES ==========
    'mini_games': {
        en: 'Mini Games', ru: 'РњРёРЅРё-РёРіСЂС‹', zh: 'е°Џжёёж€Џ', es: 'Minijuegos', pt: 'Mini jogos',
        ja: 'гѓџгѓ‹г‚Ігѓјгѓ ', fr: 'Mini-jeux', hi: 'а¤®а¤їа¤ЁаҐЂ а¤—аҐ‡а¤®аҐЌа¤ё', ko: 'лЇёл‹€кІЊмћ„', tr: 'Mini Oyunlar',
        de: 'Minispiele', ar: 'ШЈЩ„Ш№Ш§ШЁ ШµШєЩЉШ±Ш©', vi: 'TrГІ chЖЎi nhб»Џ'
    },
    'slots': {
        en: 'Lucky Slots', ru: 'РЎР»РѕС‚С‹', zh: 'иЂЃи™Ћжњє', es: 'Tragamonedas', pt: 'CaГ§a-nГ­queis',
        ja: 'г‚№гѓ­гѓѓгѓ€', fr: 'Machines Г  sous', hi: 'а¤ёаҐЌа¤ІаҐ‰а¤џаҐЌа¤ё', ko: 'мЉ¬лЎЇ', tr: 'Slot',
        de: 'Spielautomat', ar: 'ШіЩ„Щ€ШЄШі', vi: 'MГЎy Д‘ГЎnh bбєЎc'
    },
    'wheel': {
        en: 'Lucky Wheel', ru: 'РљРѕР»РµСЃРѕ СѓРґР°С‡Рё', zh: 'е№ёиїђиЅ¬з›', es: 'Ruleta de la suerte', pt: 'Roda da sorte',
        ja: 'гѓ©гѓѓг‚­гѓјгѓ›г‚¤гѓјгѓ«', fr: 'Roue de la chance', hi: 'а¤Іа¤•аҐЂ а¤µаҐЌа¤№аҐЂа¤І', ko: 'н–‰мљґмќ нњ ', tr: 'Ећans Г‡arkД±',
        de: 'GlГјcksrad', ar: 'Ш№Ш¬Щ„Ш© Ш§Щ„Ш­Шё', vi: 'VГІng quay may mбєЇn'
    },
    'spin': {
        en: 'SPIN!', ru: 'РљР РЈРўРРўР¬!', zh: 'ж—‹иЅ¬!', es: 'ВЎGIRAR!', pt: 'GIRAR!',
        ja: 'е›ћгЃ™!', fr: 'TOURNER!', hi: 'а¤аҐЃа¤®а¤ѕа¤Џа¤‚!', ko: 'лЏЊл¦¬кё°!', tr: 'Г‡EVД°R!',
        de: 'DREHEN!', ar: 'ШЇЩ€Щ‘Ш±!', vi: 'QUAY!'
    },
    'bet': {
        en: 'Bet', ru: 'РЎС‚Р°РІРєР°', zh: 'дё‹жіЁ', es: 'Apuesta', pt: 'Aposta',
        ja: 'гѓ™гѓѓгѓ€', fr: 'Mise', hi: 'а¤¦а¤ѕа¤‚а¤µ', ko: 'лІ нЊ…', tr: 'Bahis',
        de: 'Einsatz', ar: 'Ш±Щ‡Ш§Щ†', vi: 'CЖ°б»Јc'
    },
    'win': {
        en: 'Win', ru: 'Р’С‹РёРіСЂС‹С€', zh: 'иµў', es: 'Ganar', pt: 'Ganhar',
        ja: 'е‹ќгЃЎ', fr: 'Gagner', hi: 'а¤њаҐЂа¤¤', ko: 'мЉ№л¦¬', tr: 'Kazan',
        de: 'Gewinn', ar: 'ЩЃЩ€ШІ', vi: 'ThбєЇng'
    },
    'jackpot': {
        en: 'JACKPOT!', ru: 'Р”Р–Р•РљРџРћРў!', zh: 'е¤§еҐ–!', es: 'ВЎJACKPOT!', pt: 'JACKPOT!',
        ja: 'г‚ёгѓЈгѓѓг‚Їгѓќгѓѓгѓ€!', fr: 'JACKPOT!', hi: 'а¤њаҐ€а¤•а¤ЄаҐ‰а¤џ!', ko: 'мћ­нЊџ!', tr: 'JACKPOT!',
        de: 'JACKPOT!', ar: 'Ш§Щ„Ш¬Ш§Ш¦ШІШ© Ш§Щ„ЩѓШЁШ±Щ‰!', vi: 'JACKPOT!'
    },
    'total_won': {
        en: 'Total Won', ru: 'Р’СЃРµРіРѕ РІС‹РёРіСЂР°РЅРѕ', zh: 'жЂ»иµў', es: 'Total ganado', pt: 'Total ganho',
        ja: 'еђ€иЁ€зЌІеѕ—', fr: 'Total gagnГ©', hi: 'а¤•аҐЃа¤І а¤њаҐЂа¤¤', ko: 'мґќ нљЌл“ќ', tr: 'Toplam KazanГ§',
        de: 'Gesamt gewonnen', ar: 'ШҐШ¬Щ…Ш§Щ„ЩЉ Ш§Щ„ЩЃЩ€ШІ', vi: 'Tб»•ng thбєЇng'
    },

    // ========== NAVIGATION ==========
    'home': {
        en: 'Home', ru: 'Р“Р»Р°РІРЅР°СЏ', zh: 'й¦–йЎµ', es: 'Inicio', pt: 'InГ­cio',
        ja: 'гѓ›гѓјгѓ ', fr: 'Accueil', hi: 'а¤№аҐ‹а¤®', ko: 'н™€', tr: 'Ana Sayfa',
        de: 'Start', ar: 'Ш§Щ„Ш±Ш¦ЩЉШіЩЉШ©', vi: 'Trang chб»§'
    },
    'games': {
        en: 'Games', ru: 'РРіСЂС‹', zh: 'жёёж€Џ', es: 'Juegos', pt: 'Jogos',
        ja: 'г‚Ігѓјгѓ ', fr: 'Jeux', hi: 'а¤—аҐ‡а¤®аҐЌа¤ё', ko: 'кІЊмћ„', tr: 'Oyunlar',
        de: 'Spiele', ar: 'ШЈЩ„Ш№Ш§ШЁ', vi: 'TrГІ chЖЎi'
    },
    'shop': {
        en: 'Shop', ru: 'РњР°РіР°Р·РёРЅ', zh: 'е•†еє—', es: 'Tienda', pt: 'Loja',
        ja: 'г‚·гѓ§гѓѓгѓ—', fr: 'Boutique', hi: 'а¤¦аҐЃа¤•а¤ѕа¤Ё', ko: 'мѓЃм ђ', tr: 'MaДџaza',
        de: 'Shop', ar: 'Щ…ШЄШ¬Ш±', vi: 'Cб»­a hГ ng'
    },
    'nfts': {
        en: 'NFT', ru: 'NFT', zh: 'NFT', es: 'NFT', pt: 'NFT',
        ja: 'NFT', fr: 'NFT', hi: 'NFT', ko: 'NFT', tr: 'NFT',
        de: 'NFT', ar: 'NFT', vi: 'NFT'
    },
    'profile': {
        en: 'Profile', ru: 'РџСЂРѕС„РёР»СЊ', zh: 'дёЄдєєиµ„ж–™', es: 'Perfil', pt: 'Perfil',
        ja: 'гѓ—гѓ­гѓ•г‚Јгѓјгѓ«', fr: 'Profil', hi: 'а¤ЄаҐЌа¤°аҐ‹а¤«а¤ѕа¤‡а¤І', ko: 'н”„лЎњн•„', tr: 'Profil',
        de: 'Profil', ar: 'Ш§Щ„Щ…Щ„ЩЃ Ш§Щ„ШґШ®ШµЩЉ', vi: 'Hб»“ sЖЎ'
    },
    'top': {
        en: 'Top', ru: 'РўРѕРї', zh: 'жЋ’иЎЊ', es: 'Top', pt: 'Top',
        ja: 'гѓ©гѓіг‚­гѓіг‚°', fr: 'Top', hi: 'а¤џаҐ‰а¤Є', ko: 'м€њмњ„', tr: 'SД±ralama',
        de: 'Top', ar: 'Ш§Щ„ШЈЩЃШ¶Щ„', vi: 'Xбєїp hбєЎng'
    },
    'cash': {
        en: 'Cash', ru: 'Р’С‹РІРѕРґ', zh: 'жЏђзЋ°', es: 'Cobrar', pt: 'Sacar',
        ja: 'е‡єй‡‘', fr: 'Retrait', hi: 'а¤Ёа¤їа¤•а¤ѕа¤ёаҐЂ', ko: 'м¶њкё€', tr: 'Г‡ekim',
        de: 'Auszahlen', ar: 'ШіШ­ШЁ', vi: 'RГєt tiб»Ѓn'
    },
    'more': {
        en: 'More', ru: 'Р•С‰С‘', zh: 'ж›ґе¤љ', es: 'MГЎs', pt: 'Mais',
        ja: 'гЃќгЃ®д»–', fr: 'Plus', hi: 'а¤”а¤°', ko: 'лЌ”ліґкё°', tr: 'Daha',
        de: 'Mehr', ar: 'Ш§Щ„Щ…ШІЩЉШЇ', vi: 'ThГЄm'
    },
    'help': {
        en: 'Help', ru: 'РџРѕРјРѕС‰СЊ', zh: 'её®еЉ©', es: 'Ayuda', pt: 'Ajuda',
        ja: 'гѓгѓ«гѓ—', fr: 'Aide', hi: 'а¤ёа¤№а¤ѕа¤Їа¤¤а¤ѕ', ko: 'лЏ„м›Ђл§ђ', tr: 'YardД±m',
        de: 'Hilfe', ar: 'Щ…ШіШ§Ш№ШЇШ©', vi: 'Trб»Ј giГєp'
    },
    'my_link': {
        en: 'My Link', ru: 'РњРѕСЏ СЃСЃС‹Р»РєР°', zh: 'ж€‘зљ„й“ѕжЋҐ', es: 'Mi enlace', pt: 'Meu link',
        ja: 'гѓЄгѓіг‚Ї', fr: 'Mon lien', hi: 'а¤®аҐ‡а¤°а¤ѕ а¤Іа¤їа¤‚а¤•', ko: 'л‚ґ л§ЃнЃ¬', tr: 'BaДџlantД±m',
        de: 'Mein Link', ar: 'Ш±Ш§ШЁШ·ЩЉ', vi: 'LiГЄn kбєїt'
    },
    'experience': {
        en: 'Experience', ru: 'РћРїС‹С‚', zh: 'з»ЏйЄЊ', es: 'Experiencia', pt: 'ExperiГЄncia',
        ja: 'зµЊйЁ“еЂ¤', fr: 'ExpГ©rience', hi: 'а¤…а¤ЁаҐЃа¤­а¤µ', ko: 'кІЅн—м№', tr: 'Deneyim',
        de: 'Erfahrung', ar: 'Ш§Щ„Ш®ШЁШ±Ш©', vi: 'Kinh nghiб»‡m'
    },

    // ========== LANGUAGE SELECTOR ==========
    'language': {
        en: 'Language', ru: 'РЇР·С‹Рє', zh: 'иЇ­иЁЂ', es: 'Idioma', pt: 'Idioma',
        ja: 'иЁЂиЄћ', fr: 'Langue', hi: 'а¤­а¤ѕа¤·а¤ѕ', ko: 'м–ём–ґ', tr: 'Dil',
        de: 'Sprache', ar: 'Ш§Щ„Щ„ШєШ©', vi: 'NgГґn ngб»Ї'
    },
    'select_language': {
        en: 'Select Language', ru: 'Р’С‹Р±РµСЂРёС‚Рµ СЏР·С‹Рє', zh: 'йЂ‰ж‹©иЇ­иЁЂ', es: 'Seleccionar idioma', pt: 'Selecionar idioma',
        ja: 'иЁЂиЄћг‚’йЃёжЉћ', fr: 'Choisir la langue', hi: 'а¤­а¤ѕа¤·а¤ѕ а¤љаҐЃа¤ЁаҐ‡а¤‚', ko: 'м–ём–ґ м„ нѓќ', tr: 'Dil SeГ§in',
        de: 'Sprache wГ¤hlen', ar: 'Ш§Ш®ШЄШ± Ш§Щ„Щ„ШєШ©', vi: 'Chб»Ќn ngГґn ngб»Ї'
    },

    // ========== MISC ==========
    'loading': {
        en: 'Loading...', ru: 'Р—Р°РіСЂСѓР·РєР°...', zh: 'еЉ иЅЅдё­...', es: 'Cargando...', pt: 'Carregando...',
        ja: 'иЄ­гЃїиѕјгЃїдё­...', fr: 'Chargement...', hi: 'а¤ІаҐ‹а¤Ў а¤№аҐ‹ а¤°а¤№а¤ѕ а¤№аҐ€...', ko: 'лЎњл”© м¤‘...', tr: 'YГјkleniyor...',
        de: 'Laden...', ar: 'Ш¬Ш§Ш±ЩЉ Ш§Щ„ШЄШ­Щ…ЩЉЩ„...', vi: 'Дђang tбєЈi...'
    },
    'save': {
        en: 'Save', ru: 'РЎРѕС…СЂР°РЅРёС‚СЊ', zh: 'дїќе­', es: 'Guardar', pt: 'Salvar',
        ja: 'дїќе­', fr: 'Enregistrer', hi: 'а¤ёа¤№аҐ‡а¤њаҐ‡а¤‚', ko: 'м ЂмћҐ', tr: 'Kaydet',
        de: 'Speichern', ar: 'Ш­ЩЃШё', vi: 'LЖ°u'
    },
    'close': {
        en: 'Close', ru: 'Р—Р°РєСЂС‹С‚СЊ', zh: 'е…ій—­', es: 'Cerrar', pt: 'Fechar',
        ja: 'й–‰гЃг‚‹', fr: 'Fermer', hi: 'а¤¬а¤‚а¤¦ а¤•а¤°аҐ‡а¤‚', ko: 'л‹«кё°', tr: 'Kapat',
        de: 'SchlieГџen', ar: 'ШҐШєЩ„Ш§Щ‚', vi: 'ДђГіng'
    },
    'confirm': {
        en: 'Confirm', ru: 'РџРѕРґС‚РІРµСЂРґРёС‚СЊ', zh: 'зЎ®и®¤', es: 'Confirmar', pt: 'Confirmar',
        ja: 'зўєиЄЌ', fr: 'Confirmer', hi: 'а¤ЄаҐЃа¤·аҐЌа¤џа¤ї а¤•а¤°аҐ‡а¤‚', ko: 'н™•мќё', tr: 'Onayla',
        de: 'BestГ¤tigen', ar: 'ШЄШЈЩѓЩЉШЇ', vi: 'XГЎc nhбє­n'
    },
    'cancel': {
        en: 'Cancel', ru: 'РћС‚РјРµРЅР°', zh: 'еЏ–ж¶€', es: 'Cancelar', pt: 'Cancelar',
        ja: 'г‚­гѓЈгѓіг‚»гѓ«', fr: 'Annuler', hi: 'а¤°а¤¦аҐЌа¤¦ а¤•а¤°аҐ‡а¤‚', ko: 'м·Ём†Њ', tr: 'Д°ptal',
        de: 'Abbrechen', ar: 'ШҐЩ„ШєШ§ШЎ', vi: 'Hб»§y'
    },
    'back': {
        en: 'Back', ru: 'РќР°Р·Р°Рґ', zh: 'иї”е›ћ', es: 'AtrГЎs', pt: 'Voltar',
        ja: 'ж€»г‚‹', fr: 'Retour', hi: 'а¤µа¤ѕа¤Єа¤ё', ko: 'л’¤лЎњ', tr: 'Geri',
        de: 'ZurГјck', ar: 'Ш±Ш¬Щ€Ш№', vi: 'Quay lбєЎi'
    },
    'share': {
        en: 'Share', ru: 'РџРѕРґРµР»РёС‚СЊСЃСЏ', zh: 'е€†дє«', es: 'Compartir', pt: 'Compartilhar',
        ja: 'г‚·г‚§г‚ў', fr: 'Partager', hi: 'а¤¶аҐ‡а¤Їа¤° а¤•а¤°аҐ‡а¤‚', ko: 'кіµмњ ', tr: 'PaylaЕџ',
        de: 'Teilen', ar: 'Щ…ШґШ§Ш±ЩѓШ©', vi: 'Chia sбє»'
    },
    'invite_friends': {
        en: 'Invite Friends', ru: 'РџСЂРёРіР»Р°СЃРёС‚СЊ РґСЂСѓР·РµР№', zh: 'й‚ЂиЇ·жњ‹еЏ‹', es: 'Invitar amigos', pt: 'Convidar amigos',
        ja: 'еЏ‹йЃ”г‚’ж‹›еѕ…', fr: 'Inviter des amis', hi: 'а¤¦аҐ‹а¤ёаҐЌа¤¤аҐ‹а¤‚ а¤•аҐ‹ а¤†а¤®а¤‚а¤¤аҐЌа¤°а¤їа¤¤ а¤•а¤°аҐ‡а¤‚', ko: 'м№њкµ¬ мґ€лЊЂ', tr: 'ArkadaЕџlarД± Davet Et',
        de: 'Freunde einladen', ar: 'ШЇШ№Щ€Ш© Ш§Щ„ШЈШµШЇЩ‚Ш§ШЎ', vi: 'Mб»ќi bбєЎn bГЁ'
    },

    // ========== GAME NAMES ==========
    'lucky_slots': {
        en: 'Lucky Slots', ru: 'РЎС‡Р°СЃС‚Р»РёРІС‹Рµ СЃР»РѕС‚С‹', zh: 'е№ёиїђиЂЃи™Ћжњє', es: 'Tragamonedas', pt: 'CaГ§a-nГ­queis',
        ja: 'гѓ©гѓѓг‚­гѓјг‚№гѓ­гѓѓгѓ€', fr: 'Machines Г  sous', hi: 'а¤Іа¤•аҐЂ а¤ёаҐЌа¤ІаҐ‰а¤џаҐЌа¤ё', ko: 'лџ­н‚¤ мЉ¬лЎЇ', tr: 'ЕћanslД± Slot',
        de: 'GlГјcksslots', ar: 'ШіЩ„Щ€ШЄШі Щ…Ш­ШёЩ€ШёШ©', vi: 'MГЎy xГЁng may mбєЇn'
    },
    'lucky_slots_desc': {
        en: 'рџЋ° Bet: 100-2000 TAMA | Win Jackpot Pool!', ru: 'рџЋ° РЎС‚Р°РІРєР°: 100-2000 TAMA | Р’С‹РёРіСЂР°Р№ РґР¶РµРєРїРѕС‚!',
        zh: 'рџЋ° жЉ•жіЁ: 100-2000 TAMA | иµўеЏ–еҐ–ж± !', es: 'рџЋ° Apuesta: 100-2000 TAMA | ВЎGana el Jackpot!',
        pt: 'рџЋ° Aposta: 100-2000 TAMA | Ganhe o Jackpot!', ja: 'рџЋ° гѓ™гѓѓгѓ€: 100-2000 TAMA | г‚ёгѓЈгѓѓг‚Їгѓќгѓѓгѓ€г‚’зЌІеѕ—!',
        fr: 'рџЋ° Mise: 100-2000 TAMA | Gagnez le Jackpot!', hi: 'рџЋ° а¤¦а¤ѕа¤‚а¤µ: 100-2000 TAMA | а¤њаҐ€а¤•а¤ЄаҐ‰а¤џ а¤њаҐЂа¤¤аҐ‡а¤‚!',
        ko: 'рџЋ° лІ нЊ…: 100-2000 TAMA | мћ­нЊџ нљЌл“ќ!', tr: 'рџЋ° Bahis: 100-2000 TAMA | Jackpot Kazan!',
        de: 'рџЋ° Einsatz: 100-2000 TAMA | Gewinne den Jackpot!', ar: 'рџЋ° Ш±Щ‡Ш§Щ†: 100-2000 | Ш§Ш±ШЁШ­ Ш§Щ„Ш¬Ш§Ш¦ШІШ© Ш§Щ„ЩѓШЁШ±Щ‰!',
        vi: 'рџЋ° CЖ°б»Јc: 100-2000 TAMA | TrГєng Jackpot!'
    },
    'lucky_wheel': {
        en: 'Lucky Wheel', ru: 'РљРѕР»РµСЃРѕ СѓРґР°С‡Рё', zh: 'е№ёиїђиЅ¬з›', es: 'Rueda de la Suerte', pt: 'Roda da Sorte',
        ja: 'гѓ©гѓѓг‚­гѓјгѓ›г‚¤гѓјгѓ«', fr: 'Roue de la Fortune', hi: 'а¤Іа¤•аҐЂ а¤µаҐЌа¤№аҐЂа¤І', ko: 'н–‰мљґмќ л°”нЂґ', tr: 'Ећans Г‡arkД±',
        de: 'GlГјcksrad', ar: 'Ш№Ш¬Щ„Ш© Ш§Щ„Ш­Шё', vi: 'VГІng quay may mбєЇn'
    },
    'lucky_wheel_desc': {
        en: 'Bet: 500-1000 TAMA | Win: up to 10x!', ru: 'РЎС‚Р°РІРєР°: 500-1000 TAMA | Р’С‹РёРіСЂС‹С€: РґРѕ 10x!',
        zh: 'жЉ•жіЁ: 500-1000 TAMA | иµў: жњЂй«10еЂЌ!', es: 'Apuesta: 500-1000 TAMA | Gana: hasta 10x!',
        pt: 'Aposta: 500-1000 TAMA | Ganhe: atГ© 10x!', ja: 'гѓ™гѓѓгѓ€: 500-1000 TAMA | е‹ќе€©: жњЂе¤§10еЂЌ!',
        fr: 'Mise: 500-1000 TAMA | Gain: jusqu\'Г  10x!', hi: 'а¤¦а¤ѕа¤‚а¤µ: 500-1000 TAMA | а¤њаҐЂа¤¤: 10x а¤¤а¤•!',
        ko: 'лІ нЊ…: 500-1000 TAMA | мЉ№л¦¬: мµњлЊЂ 10л°°!', tr: 'Bahis: 500-1000 TAMA | KazanГ§: 10x\'e kadar!',
        de: 'Einsatz: 500-1000 TAMA | Gewinn: bis zu 10x!', ar: 'Ш±Щ‡Ш§Щ†: 500-1000 | Ш±ШЁШ­: Ш­ШЄЩ‰ 10x!',
        vi: 'CЖ°б»Јc: 500-1000 TAMA | ThбєЇng: lГЄn Д‘бєїn 10x!'
    },
    'super_tama_bros': {
        en: 'SUPER TAMA BROS', ru: 'РЎРЈРџР•Р  РўРђРњРђ Р‘Р РћРЎ', zh: 'и¶…зє§еЎ”й©¬е…„ејџ', es: 'SUPER TAMA BROS', pt: 'SUPER TAMA BROS',
        ja: 'г‚№гѓјгѓ‘гѓјг‚їгѓћгѓ–гѓ©г‚¶гѓјг‚є', fr: 'SUPER TAMA BROS', hi: 'а¤ёаҐЃа¤Єа¤° а¤¤а¤®а¤ѕ а¤¬аҐЌа¤°а¤¦а¤°аҐЌа¤ё', ko: 'мЉ€нЌј нѓЂл§€ лёЊлЎњмЉ¤', tr: 'SГњPER TAMA BROS',
        de: 'SUPER TAMA BROS', ar: 'ШіЩ€ШЁШ± ШЄШ§Щ…Ш§ ШЁШ±Щ€Ші', vi: 'SUPER TAMA BROS'
    },
    'super_tama_bros_desc': {
        en: '100 TAMA | 3 Levels | Win: up to 1000+ TAMA!', ru: '100 TAMA | 3 СѓСЂРѕРІРЅСЏ | Р’С‹РёРіСЂС‹С€: РґРѕ 1000+ TAMA!',
        zh: '100 TAMA | 3е…і | иµў: жњЂй«1000+ TAMA!', es: '100 TAMA | 3 Niveles | Gana: hasta 1000+ TAMA!',
        pt: '100 TAMA | 3 NГ­veis | Ganhe: atГ© 1000+ TAMA!', ja: '100 TAMA | 3гѓ¬гѓ™гѓ« | е‹ќе€©: 1000+ TAMAгЃѕгЃ§!',
        fr: '100 TAMA | 3 Niveaux | Gain: jusqu\'Г  1000+ TAMA!', hi: '100 TAMA | 3 а¤ІаҐ‡а¤µа¤І | а¤њаҐЂа¤¤: 1000+ TAMA а¤¤а¤•!',
        ko: '100 TAMA | 3л €лІЁ | мЉ№л¦¬: 1000+ TAMAк№Њм§Ђ!', tr: '100 TAMA | 3 Seviye | KazanГ§: 1000+ TAMA\'ya kadar!',
        de: '100 TAMA | 3 Level | Gewinn: bis zu 1000+ TAMA!', ar: '100 TAMA | 3 Щ…ШіШЄЩ€ЩЉШ§ШЄ | Ш±ШЁШ­: Ш­ШЄЩ‰ 1000+!',
        vi: '100 TAMA | 3 CбєҐp | ThбєЇng: lГЄn Д‘бєїn 1000+ TAMA!'
    },
    'color_match': {
        en: 'TAMA COLOR MATCH', ru: 'РўРђРњРђ Р¦Р’Р•РўРђ', zh: 'еЎ”й©¬йўњи‰Ій…ЌеЇ№', es: 'COLORES TAMA', pt: 'CORES TAMA',
        ja: 'г‚їгѓћг‚«гѓ©гѓјгѓћгѓѓгѓЃ', fr: 'COULEURS TAMA', hi: 'а¤¤а¤®а¤ѕ а¤•а¤Іа¤° а¤®аҐ€а¤љ', ko: 'нѓЂл§€ м»¬лџ¬ л§¤м№', tr: 'TAMA RENK EЕћLEЕћTД°RME',
        de: 'TAMA FARBSPIEL', ar: 'ШЄШ§Щ…Ш§ Ш§Щ„ШЈЩ„Щ€Ш§Щ†', vi: 'TAMA GHГ‰P MГЂU'
    },
    'color_match_desc': {
        en: '50-300 TAMA | Memory Game | Win: up to 5x!', ru: '50-300 TAMA | РРіСЂР° РЅР° РїР°РјСЏС‚СЊ | Р’С‹РёРіСЂС‹С€: РґРѕ 5x!',
        zh: '50-300 TAMA | и®°еї†жёёж€Џ | иµў: жњЂй«5еЂЌ!', es: '50-300 TAMA | Juego de Memoria | Gana: hasta 5x!',
        pt: '50-300 TAMA | Jogo de MemГіria | Ganhe: atГ© 5x!', ja: '50-300 TAMA | гѓЎгѓўгѓЄгѓјг‚Ігѓјгѓ  | е‹ќе€©: жњЂе¤§5еЂЌ!',
        fr: '50-300 TAMA | Jeu de MГ©moire | Gain: jusqu\'Г  5x!', hi: '50-300 TAMA | а¤®аҐ‡а¤®аҐ‹а¤°аҐЂ а¤—аҐ‡а¤® | а¤њаҐЂа¤¤: 5x а¤¤а¤•!',
        ko: '50-300 TAMA | л©”лЄЁл¦¬ кІЊмћ„ | мЉ№л¦¬: мµњлЊЂ 5л°°!', tr: '50-300 TAMA | HafД±za Oyunu | KazanГ§: 5x\'e kadar!',
        de: '50-300 TAMA | GedГ¤chtnisspiel | Gewinn: bis zu 5x!', ar: '50-300 TAMA | Щ„Ш№ШЁШ© Ш§Щ„Ш°Ш§ЩѓШ±Ш© | Ш±ШЁШ­: Ш­ШЄЩ‰ 5x!',
        vi: '50-300 TAMA | TrГІ chЖЎi trГ­ nhб»› | ThбєЇng: lГЄn Д‘бєїn 5x!'
    },
    'tama_shooter': {
        en: 'TAMA SHOOTER', ru: 'РўРђРњРђ РЎРўР Р•Р›РЇР›РљРђ', zh: 'еЎ”й©¬е°„е‡»', es: 'TAMA SHOOTER', pt: 'TAMA SHOOTER',
        ja: 'г‚їгѓћг‚·гѓҐгѓјг‚їгѓј', fr: 'TAMA SHOOTER', hi: 'а¤¤а¤®а¤ѕ а¤¶аҐ‚а¤џа¤°', ko: 'нѓЂл§€ мЉ€н„°', tr: 'TAMA SHOOTER',
        de: 'TAMA SHOOTER', ar: 'ШЄШ§Щ…Ш§ ШґЩ€ШЄШ±', vi: 'TAMA Bбє®N SГљNG'
    },
    'tama_shooter_desc': {
        en: '100-500 TAMA | 10 Waves | Win: up to 3x!', ru: '100-500 TAMA | 10 РІРѕР»РЅ | Р’С‹РёРіСЂС‹С€: РґРѕ 3x!',
        zh: '100-500 TAMA | 10жіў | иµў: жњЂй«3еЂЌ!', es: '100-500 TAMA | 10 Oleadas | Gana: hasta 3x!',
        pt: '100-500 TAMA | 10 Ondas | Ganhe: atГ© 3x!', ja: '100-500 TAMA | 10г‚¦г‚§гѓјгѓ– | е‹ќе€©: жњЂе¤§3еЂЌ!',
        fr: '100-500 TAMA | 10 Vagues | Gain: jusqu\'Г  3x!', hi: '100-500 TAMA | 10 а¤µаҐ‡а¤µ | а¤њаҐЂа¤¤: 3x а¤¤а¤•!',
        ko: '100-500 TAMA | 10м›ЁмќґлёЊ | мЉ№л¦¬: мµњлЊЂ 3л°°!', tr: '100-500 TAMA | 10 Dalga | KazanГ§: 3x\'e kadar!',
        de: '100-500 TAMA | 10 Wellen | Gewinn: bis zu 3x!', ar: '100-500 TAMA | 10 Щ…Щ€Ш¬Ш§ШЄ | Ш±ШЁШ­: Ш­ШЄЩ‰ 3x!',
        vi: '100-500 TAMA | 10 Wave | ThбєЇng: lГЄn Д‘бєїn 3x!'
    },
    'dice_roll': {
        en: 'Dice Roll', ru: 'РљРѕСЃС‚Рё', zh: 'йЄ°е­ђ', es: 'Dados', pt: 'Dados',
        ja: 'г‚µг‚¤г‚ігѓ­', fr: 'DГ©s', hi: 'а¤Єа¤ѕа¤ёа¤ѕ', ko: 'мЈјм‚¬мњ„', tr: 'Zar',
        de: 'WГјrfel', ar: 'Щ†Ш±ШЇ', vi: 'XГєc xбєЇc'
    },
    'pet_battle': {
        en: 'PET BATTLE ARENA', ru: 'РђР Р•РќРђ РџРРўРћРњР¦Р•Р’', zh: 'е® з‰©з«ћжЉЂењє', es: 'ARENA DE MASCOTAS', pt: 'ARENA DE PETS',
        ja: 'гѓљгѓѓгѓ€гѓђгѓ€гѓ«г‚ўгѓЄгѓјгѓЉ', fr: 'ARГ€NE DE COMBAT', hi: 'а¤ЄаҐ‡а¤џ а¤¬аҐ€а¤џа¤І а¤Џа¤°аҐЂа¤Ёа¤ѕ', ko: 'нЋ« л°°н‹Ђ м•„л €л‚', tr: 'EVCIL HAYVAN ARENASI',
        de: 'PET KAMPFARENA', ar: 'ШіШ§Ш­Ш© Щ‚ШЄШ§Щ„ Ш§Щ„Ш­ЩЉЩ€Ш§Щ†Ш§ШЄ', vi: 'Дђбє¤U TRЖЇб»њNG THГљ CЖЇNG'
    },
    'choose_pet_battle': {
        en: 'Choose your NFT pet and battle!', ru: 'Р’С‹Р±РµСЂРё СЃРІРѕРµРіРѕ NFT РїРёС‚РѕРјС†Р° Рё СЃСЂР°Р¶Р°Р№СЃСЏ!', zh: 'йЂ‰ж‹©дЅ зљ„NFTе® з‰©ж€ж–—!',
        es: 'ВЎElige tu mascota NFT y batalla!', pt: 'Escolha seu pet NFT e batalhe!', ja: 'NFTгѓљгѓѓгѓ€г‚’йЃёг‚“гЃ§гѓђгѓ€гѓ«!',
        fr: 'Choisissez votre pet NFT et combattez!', hi: 'а¤…а¤Єа¤Ёа¤ѕ NFT а¤ЄаҐ‡а¤џ а¤љаҐЃа¤ЁаҐ‡а¤‚ а¤”а¤° а¤Іа¤Ўа¤јаҐ‡а¤‚!', ko: 'NFT нЋ«мќ„ м„ нѓќн•кі  м‹ёмљ°м„ёмљ”!',
        tr: 'NFT evcil hayvanД±nД±zД± seГ§in ve savaЕџД±n!', de: 'WГ¤hle dein NFT-Haustier und kГ¤mpfe!',
        ar: 'Ш§Ш®ШЄШ± Ш­ЩЉЩ€Ш§Щ†Щѓ NFT Щ€Щ‚Ш§ШЄЩ„!', vi: 'Chб»Ќn thГє cЖ°ng NFT vГ  chiбєїn Д‘бєҐu!'
    },
    'tama_tower': {
        en: 'TAMA TOWER', ru: 'РўРђРњРђ Р‘РђРЁРќРЇ', zh: 'еЎ”й©¬еЎ”', es: 'TORRE TAMA', pt: 'TORRE TAMA',
        ja: 'г‚їгѓћг‚їгѓЇгѓј', fr: 'TOUR TAMA', hi: 'а¤¤а¤®а¤ѕ а¤џа¤ѕа¤µа¤°', ko: 'нѓЂл§€ нѓЂм›Њ', tr: 'TAMA KULESД°',
        de: 'TAMA TURM', ar: 'ШЁШ±Ш¬ ШЄШ§Щ…Ш§', vi: 'THГЃP TAMA'
    },
    'tower_desc': {
        en: 'Build a tower! Higher = more reward! But it can fall anytime!', ru: 'РЎС‚СЂРѕР№ Р±Р°С€РЅСЋ! Р’С‹С€Рµ = Р±РѕР»СЊС€Рµ РЅР°РіСЂР°РґР°! РќРѕ РјРѕР¶РµС‚ СѓРїР°СЃС‚СЊ!',
        zh: 'е»єеЎ”! и¶Љй«=и¶Ље¤љеҐ–еЉ±! дЅ†еЏЇиѓЅйљЏж—¶еЂ’еЎЊ!', es: 'ВЎConstruye una torre! MГЎs alto = mГЎs recompensa! ВЎPero puede caer!',
        pt: 'Construa uma torre! Mais alto = mais recompensa! Mas pode cair!', ja: 'г‚їгѓЇгѓјг‚’е»єгЃ¦г‚€гЃ†! й«гЃ„ = е ±й…¬UP! гЃ§г‚‚еЂ’г‚Њг‚‹гЃ‹г‚‚!',
        fr: 'Construisez une tour! Plus haut = plus de rГ©compense! Mais elle peut tomber!', hi: 'а¤џа¤ѕа¤µа¤° а¤¬а¤Ёа¤ѕа¤“! а¤Ља¤‚а¤ља¤ѕ = а¤њаҐЌа¤Їа¤ѕа¤¦а¤ѕ а¤‡а¤Ёа¤ѕа¤®! а¤ІаҐ‡а¤•а¤їа¤Ё а¤—а¤їа¤° а¤ёа¤•а¤¤а¤ѕ а¤№аҐ€!',
        ko: 'нѓЂм›ЊлҐј мЊ“мњјм„ёмљ”! л†’мќ„м€лЎќ = лЌ” л§ЋмќЂ ліґмѓЃ! н•м§Ђл§Њ л¬ґл„€м§€ м€ мћ€м–ґмљ”!', tr: 'Bir kule inЕџa et! YГјksek = daha fazla Г¶dГјl! Ama dГјЕџebilir!',
        de: 'Bau einen Turm! HГ¶her = mehr Belohnung! Aber er kann fallen!', ar: 'Ш§ШЁЩ† ШЁШ±Ш¬Ш§Щ‹! ШЈШ№Щ„Щ‰ = Щ…ЩѓШ§ЩЃШЈШ© ШЈЩѓШЁШ±! Щ„ЩѓЩ†Щ‡ Щ‚ШЇ ЩЉШіЩ‚Ш·!',
        vi: 'XГўy thГЎp! Cao hЖЎn = nhiб»Ѓu phбє§n thЖ°б»џng hЖЎn! NhЖ°ng cГі thб»ѓ Д‘б»•!'
    },
    'precision_click': {
        en: 'PRECISION CLICK', ru: 'РўРћР§РќР«Р™ РљР›РРљ', zh: 'зІѕе‡†з‚№е‡»', es: 'CLIC PRECISO', pt: 'CLIQUE PRECISO',
        ja: 'гѓ—гѓ¬г‚·г‚ёгѓ§гѓіг‚ЇгѓЄгѓѓг‚Ї', fr: 'CLIC PRГ‰CIS', hi: 'а¤ЄаҐЌа¤°а¤їа¤ёа¤їа¤¶а¤Ё а¤•аҐЌа¤Іа¤їа¤•', ko: 'м •л°Ђ нЃґл¦­', tr: 'HASSAS TIKLA',
        de: 'PRГ„ZISIONSKLICK', ar: 'Щ†Щ‚Ш±Ш© ШЇЩ‚ЩЉЩ‚Ш©', vi: 'NHбє¤P CHГЌNH XГЃC'
    },
    'precision_desc': {
        en: 'Click exactly when the target is in the center!', ru: 'РљР»РёРєРЅРё С‚РѕС‡РЅРѕ РєРѕРіРґР° С†РµР»СЊ РІ С†РµРЅС‚СЂРµ!', zh: 'еЅ“з›®ж ‡ењЁдё­еїѓж—¶зІѕзЎ®з‚№е‡»!',
        es: 'ВЎHaz clic exactamente cuando el objetivo estГ© en el centro!', pt: 'Clique exatamente quando o alvo estiver no centro!',
        ja: 'г‚їгѓјг‚Ігѓѓгѓ€гЃЊдё­е¤®гЃ«гЃ‚г‚‹гЃЁгЃЌгЃ«г‚ЇгѓЄгѓѓг‚Ї!', fr: 'Cliquez exactement quand la cible est au centre!',
        hi: 'а¤ња¤¬ а¤џа¤ѕа¤°а¤—аҐ‡а¤џ а¤¬аҐЂа¤љ а¤®аҐ‡а¤‚ а¤№аҐ‹ а¤¤а¤¬ а¤•аҐЌа¤Іа¤їа¤• а¤•а¤°аҐ‡а¤‚!', ko: 'нѓЂкІџмќґ м¤‘м•™м—ђ мћ€мќ„ л•Њ м •н™•нћ€ нЃґл¦­н•м„ёмљ”!',
        tr: 'Hedef tam ortadayken tД±klayД±n!', de: 'Klicke genau wenn das Ziel in der Mitte ist!',
        ar: 'Ш§Щ†Щ‚Ш± ШЁШ§Щ„Ш¶ШЁШ· Ш№Щ†ШЇЩ…Ш§ ЩЉЩѓЩ€Щ† Ш§Щ„Щ‡ШЇЩЃ ЩЃЩЉ Ш§Щ„Щ…Щ†ШЄШµЩЃ!', vi: 'NhбєҐp chГ­nh xГЎc khi mб»Ґc tiГЄu б»џ giб»Їa!'
    },
    'roulette': {
        en: 'ROULETTE', ru: 'Р РЈР›Р•РўРљРђ', zh: 'иЅ®з›', es: 'RULETA', pt: 'ROLETA',
        ja: 'гѓ«гѓјгѓ¬гѓѓгѓ€', fr: 'ROULETTE', hi: 'а¤°аҐ‚а¤ІаҐ‡а¤џ', ko: 'лЈ°л ›', tr: 'RULET',
        de: 'ROULETTE', ar: 'Ш±Щ€Щ„ЩЉШЄ', vi: 'VГ’NG QUAY'
    },
    'roulette_desc': {
        en: 'Place your bets! Classic casino game!', ru: 'Р”РµР»Р°Р№ СЃС‚Р°РІРєРё! РљР»Р°СЃСЃРёС‡РµСЃРєР°СЏ РєР°Р·РёРЅРѕ РёРіСЂР°!', zh: 'дё‹жіЁ! з»Џе…ёиµЊењєжёёж€Џ!',
        es: 'ВЎHaz tus apuestas! ВЎJuego de casino clГЎsico!', pt: 'FaГ§a suas apostas! Jogo de cassino clГЎssico!',
        ja: 'гѓ™гѓѓгѓ€гЃ—г‚€гЃ†! г‚Їгѓ©г‚·гѓѓг‚Їг‚«г‚ёгѓЋг‚Ігѓјгѓ !', fr: 'Placez vos paris! Jeu de casino classique!',
        hi: 'а¤…а¤Єа¤ЁаҐ‡ а¤¦а¤ѕа¤‚а¤µ а¤Іа¤—а¤ѕа¤“! а¤•аҐЌа¤Іа¤ѕа¤ёа¤їа¤• а¤•аҐ€а¤ёаҐЂа¤ЁаҐ‹ а¤—аҐ‡а¤®!', ko: 'лІ нЊ…н•м„ёмљ”! нЃґлћм‹ќ м№ґм§Ђл…ё кІЊмћ„!',
        tr: 'Bahislerinizi koyun! Klasik kumarhane oyunu!', de: 'Platzieren Sie Ihre Wetten! Klassisches Casinospiel!',
        ar: 'Ш¶Ш№ Ш±Щ‡Ш§Щ†Ш§ШЄЩѓ! Щ„Ш№ШЁШ© ЩѓШ§ШІЩЉЩ†Щ€ ЩѓЩ„Ш§ШіЩЉЩѓЩЉШ©!', vi: 'Дђбє·t cЖ°б»Јc! TrГІ chЖЎi casino cб»• Д‘iб»ѓn!'
    },
    'card_game': {
        en: 'CARD GAME', ru: 'РљРђР РўР«', zh: 'зєёз‰Њ', es: 'CARTAS', pt: 'CARTAS',
        ja: 'г‚«гѓјгѓ‰г‚Ігѓјгѓ ', fr: 'JEU DE CARTES', hi: 'а¤•а¤ѕа¤°аҐЌа¤Ў а¤—аҐ‡а¤®', ko: 'м№ґл“њ кІЊмћ„', tr: 'KART OYUNU',
        de: 'KARTENSPIEL', ar: 'Щ„Ш№ШЁШ© Ш§Щ„Щ€Ш±Щ‚', vi: 'BГЂI'
    },
    'card_game_desc': {
        en: 'Play Blackjack! Beat the dealer!', ru: 'РРіСЂР°Р№ РІ Р±Р»СЌРєРґР¶РµРє! РћР±С‹РіСЂР°Р№ РґРёР»РµСЂР°!', zh: 'зЋ©21з‚№! е‡»иґҐеє„е®¶!',
        es: 'ВЎJuega al Blackjack! ВЎGana al crupier!', pt: 'Jogue Blackjack! VenГ§a o dealer!',
        ja: 'гѓ–гѓ©гѓѓг‚Їг‚ёгѓЈгѓѓг‚Їг‚’гѓ—гѓ¬г‚¤! гѓ‡г‚Јгѓјгѓ©гѓјгЃ«е‹ќгЃ¦!', fr: 'Jouez au Blackjack! Battez le croupier!',
        hi: 'а¤¬аҐЌа¤ІаҐ€а¤•а¤њаҐ€а¤• а¤–аҐ‡а¤ІаҐ‹! а¤ЎаҐЂа¤Іа¤° а¤•аҐ‹ а¤№а¤°а¤ѕа¤“!', ko: 'лё”лћ™мћ­ н”Њл €мќґ! л”њлџ¬лҐј мќґкІЁлќј!',
        tr: 'Blackjack oyna! Krupiyeyi yen!', de: 'Spiele Blackjack! Schlage den Dealer!',
        ar: 'Ш§Щ„Ш№ШЁ ШЁЩ„Ш§Щѓ Ш¬Ш§Щѓ! Ш§Щ‡ШІЩ… Ш§Щ„Щ…Щ€ШІШ№!', vi: 'ChЖЎi Blackjack! ДђГЎnh bбєЎi nhГ  cГЎi!'
    },

    // ========== GAME BUTTONS ==========
    'start': {
        en: 'START!', ru: 'РЎРўРђР Рў!', zh: 'ејЂе§‹!', es: 'ВЎINICIO!', pt: 'INICIAR!',
        ja: 'г‚№г‚їгѓјгѓ€!', fr: 'DГ‰MARRER!', hi: 'а¤¶аҐЃа¤°аҐ‚!', ko: 'м‹њмћ‘!', tr: 'BAЕћLA!',
        de: 'START!', ar: 'Ш§ШЁШЇШЈ!', vi: 'Bбє®T Дђбє¦U!'
    },
    'roll': {
        en: 'ROLL!', ru: 'Р‘Р РћРЎРРўР¬!', zh: 'жЋ·!', es: 'ВЎTIRAR!', pt: 'ROLAR!',
        ja: 'гѓ­гѓјгѓ«!', fr: 'LANCER!', hi: 'а¤°аҐ‹а¤І!', ko: 'кµґл ¤!', tr: 'AT!',
        de: 'WГњRFELN!', ar: 'Ш§Ш±Щ…Щђ!', vi: 'LД‚N!'
    },
    'start_battle': {
        en: 'START BATTLE!', ru: 'РќРђР§РђРўР¬ Р‘РћР™!', zh: 'ејЂе§‹ж€ж–—!', es: 'ВЎINICIAR BATALLA!', pt: 'INICIAR BATALHA!',
        ja: 'гѓђгѓ€гѓ«й–‹е§‹!', fr: 'COMMENCER LE COMBAT!', hi: 'а¤ЇаҐЃа¤¦аҐЌа¤§ а¤¶аҐЃа¤°аҐ‚!', ko: 'м „н€¬ м‹њмћ‘!', tr: 'SAVAЕћI BAЕћLAT!',
        de: 'KAMPF STARTEN!', ar: 'Ш§ШЁШЇШЈ Ш§Щ„Щ…Ш№Ш±ЩѓШ©!', vi: 'Bбє®T Дђбє¦U CHIбєѕN Дђбє¤U!'
    },
    'add_block': {
        en: 'ADD BLOCK', ru: 'Р”РћР‘РђР’РРўР¬ Р‘Р›РћРљ', zh: 'ж·»еЉ ж–№еќ—', es: 'AГ‘ADIR BLOQUE', pt: 'ADICIONAR BLOCO',
        ja: 'гѓ–гѓ­гѓѓг‚ЇиїЅеЉ ', fr: 'AJOUTER UN BLOC', hi: 'а¤¬аҐЌа¤ІаҐ‰а¤• а¤њаҐ‹а¤Ўа¤јаҐ‡а¤‚', ko: 'лё”лЎќ м¶”к°Ђ', tr: 'BLOK EKLE',
        de: 'BLOCK HINZUFГњGEN', ar: 'ШҐШ¶Ш§ЩЃШ© ЩѓШЄЩ„Ш©', vi: 'THГЉM KHб»ђI'
    },
    'cash_out': {
        en: 'CASH OUT', ru: 'Р—РђР‘Р РђРўР¬', zh: 'жЏђзЋ°', es: 'RETIRAR', pt: 'SACAR',
        ja: 'г‚­гѓЈгѓѓг‚·гѓҐг‚ўг‚¦гѓ€', fr: 'ENCAISSER', hi: 'а¤•аҐ€а¤¶ а¤†а¤‰а¤џ', ko: 'мєђм‹њм•„м›ѓ', tr: 'PARA Г‡EK',
        de: 'AUSZAHLEN', ar: 'ШіШ­ШЁ Ш§Щ„Щ†Щ‚Щ€ШЇ', vi: 'RГљT TIб»ЂN'
    },
    'start_building': {
        en: 'START BUILDING!', ru: 'РќРђР§РђРўР¬ РЎРўР РћРРўР¬!', zh: 'ејЂе§‹е»єйЂ !', es: 'ВЎEMPEZAR A CONSTRUIR!', pt: 'COMEГ‡AR A CONSTRUIR!',
        ja: 'е»єиЁ­й–‹е§‹!', fr: 'COMMENCER ГЂ CONSTRUIRE!', hi: 'а¤¬а¤їа¤ІаҐЌа¤Ўа¤їа¤‚а¤— а¤¶аҐЃа¤°аҐ‚!', ko: 'к±ґм„¤ м‹њмћ‘!', tr: 'Д°NЕћAATA BAЕћLA!',
        de: 'MIT DEM BAU BEGINNEN!', ar: 'Ш§ШЁШЇШЈ Ш§Щ„ШЁЩ†Ш§ШЎ!', vi: 'Bбє®T Дђбє¦U XГ‚Y!'
    },
    'deal_cards': {
        en: 'DEAL CARDS!', ru: 'Р РђР—Р”РђРўР¬ РљРђР РўР«!', zh: 'еЏ‘з‰Њ!', es: 'ВЎREPARTIR CARTAS!', pt: 'DISTRIBUIR CARTAS!',
        ja: 'г‚«гѓјгѓ‰й…Ќеёѓ!', fr: 'DISTRIBUER LES CARTES!', hi: 'а¤•а¤ѕа¤°аҐЌа¤Ў а¤¬а¤ѕа¤‚а¤џаҐ‹!', ko: 'м№ґл“њ лЏЊл ¤!', tr: 'KART DAДћIT!',
        de: 'KARTEN GEBEN!', ar: 'Щ€ШІШ№ Ш§Щ„Щ€Ш±Щ‚!', vi: 'CHIA BГЂI!'
    },
    'hit': {
        en: 'HIT', ru: 'Р•Р©РЃ', zh: 'и¦Ѓз‰Њ', es: 'PEDIR', pt: 'PEDIR',
        ja: 'гѓ’гѓѓгѓ€', fr: 'TIRER', hi: 'а¤№а¤їа¤џ', ko: 'нћ€нЉё', tr: 'Г‡EK',
        de: 'KARTE', ar: 'Ш§ШіШ­ШЁ', vi: 'Bб»ђC'
    },
    'stand': {
        en: 'STAND', ru: 'РЎРўРћРџ', zh: 'еЃњз‰Њ', es: 'PLANTARSE', pt: 'PARAR',
        ja: 'г‚№г‚їгѓігѓ‰', fr: 'RESTER', hi: 'а¤ёаҐЌа¤џаҐ€а¤‚а¤Ў', ko: 'мЉ¤нѓ л“њ', tr: 'KAL',
        de: 'HALTEN', ar: 'ШЄЩ€Щ‚ЩЃ', vi: 'Dб»ЄNG'
    },
    'perfect': {
        en: 'Perfect', ru: 'РРґРµР°Р»СЊРЅРѕ', zh: 'е®ЊзѕЋ', es: 'Perfecto', pt: 'Perfeito',
        ja: 'гѓ‘гѓјгѓ•г‚§г‚Їгѓ€', fr: 'Parfait', hi: 'а¤Єа¤°а¤«аҐ‡а¤•аҐЌа¤џ', ko: 'нЌјнЋ™нЉё', tr: 'MГјkemmel',
        de: 'Perfekt', ar: 'Щ…Ш«Ш§Щ„ЩЉ', vi: 'HoГ n hбєЈo'
    },
    'wins': {
        en: 'Wins', ru: 'РџРѕР±РµРґС‹', zh: 'иѓње€©', es: 'Victorias', pt: 'VitГіrias',
        ja: 'е‹ќе€©', fr: 'Victoires', hi: 'а¤њаҐЂа¤¤', ko: 'мЉ№л¦¬', tr: 'KazanД±lan',
        de: 'Siege', ar: 'Ш§Щ†ШЄШµШ§Ш±Ш§ШЄ', vi: 'ThбєЇng'
    },
    'losses': {
        en: 'Losses', ru: 'РџРѕСЂР°Р¶РµРЅРёСЏ', zh: 'е¤±иґҐ', es: 'Derrotas', pt: 'Derrotas',
        ja: 'ж•—еЊ—', fr: 'DГ©faites', hi: 'а¤№а¤ѕа¤°', ko: 'нЊЁл°°', tr: 'Kaybedilen',
        de: 'Niederlagen', ar: 'Ш®ШіШ§Ш¦Ш±', vi: 'Thua'
    },
    'game_over': {
        en: 'GAME OVER', ru: 'РР“Р Рђ РћРљРћРќР§Р•РќРђ', zh: 'жёёж€Џз»“жќџ', es: 'JUEGO TERMINADO', pt: 'FIM DE JOGO',
        ja: 'г‚Ігѓјгѓ г‚Єгѓјгѓђгѓј', fr: 'JEU TERMINГ‰', hi: 'а¤—аҐ‡а¤® а¤“а¤µа¤°', ko: 'кІЊмћ„ м¤лІ„', tr: 'OYUN BД°TTД°',
        de: 'SPIEL VORBEI', ar: 'Ш§Щ†ШЄЩ‡ШЄ Ш§Щ„Щ„Ш№ШЁШ©', vi: 'KбєѕT THГљC'
    },
    'play_again': {
        en: 'рџ”„ PLAY AGAIN', ru: 'рџ”„ РР“Р РђРўР¬ РЎРќРћР’Рђ', zh: 'рџ”„ е†ЌзЋ©дёЂж¬Ў', es: 'рџ”„ JUGAR DE NUEVO', pt: 'рџ”„ JOGAR NOVAMENTE',
        ja: 'рџ”„ г‚‚гЃ†дёЂеє¦гѓ—гѓ¬г‚¤', fr: 'рџ”„ REJOUER', hi: 'рџ”„ а¤«а¤їа¤° а¤ёаҐ‡ а¤–аҐ‡а¤ІаҐ‡а¤‚', ko: 'рџ”„ л‹¤м‹њ н”Њл €мќґ', tr: 'рџ”„ TEKRAR OYNA',
        de: 'рџ”„ NOCHMAL SPIELEN', ar: 'рџ”„ Ш§Щ„Ш№ШЁ Щ…Ш±Ш© ШЈШ®Ш±Щ‰', vi: 'рџ”„ CHЖ I Lбє I'
    },
    'select_bet': {
        en: 'Select Bet:', ru: 'Р’С‹Р±РµСЂРёС‚Рµ СЃС‚Р°РІРєСѓ:', zh: 'йЂ‰ж‹©жЉ•жіЁ:', es: 'Selecciona apuesta:', pt: 'Selecione aposta:',
        ja: 'гѓ™гѓѓгѓ€г‚’йЃёжЉћ:', fr: 'Choisissez la mise:', hi: 'а¤¦а¤ѕа¤‚а¤µ а¤љаҐЃа¤ЁаҐ‡а¤‚:', ko: 'лІ нЊ… м„ нѓќ:', tr: 'Bahis seГ§in:',
        de: 'Einsatz wГ¤hlen:', ar: 'Ш§Ш®ШЄШ± Ш§Щ„Ш±Щ‡Ш§Щ†:', vi: 'Chб»Ќn cЖ°б»Јc:'
    },
    'choose_bet': {
        en: 'Choose your bet:', ru: 'Р’С‹Р±РµСЂРёС‚Рµ СЃС‚Р°РІРєСѓ:', zh: 'йЂ‰ж‹©ж‚Ёзљ„жЉ•жіЁ:', es: 'Elige tu apuesta:', pt: 'Escolha sua aposta:',
        ja: 'гѓ™гѓѓгѓ€г‚’йЃёжЉћ:', fr: 'Choisissez votre mise:', hi: 'а¤…а¤Єа¤Ёа¤ѕ а¤¦а¤ѕа¤‚а¤µ а¤љаҐЃа¤ЁаҐ‡а¤‚:', ko: 'лІ нЊ…мќ„ м„ нѓќн•м„ёмљ”:', tr: 'Bahsinizi seГ§in:',
        de: 'WГ¤hlen Sie Ihren Einsatz:', ar: 'Ш§Ш®ШЄШ± Ш±Щ‡Ш§Щ†Щѓ:', vi: 'Chб»Ќn cЖ°б»Јc cб»§a bбєЎn:'
    },
    'enter_amount': {
        en: 'Or enter custom amount:', ru: 'РР»Рё РІРІРµРґРёС‚Рµ СЃСѓРјРјСѓ:', zh: 'ж€–иѕ“е…Ґи‡Єе®љд№‰й‡‘йўќ:', es: 'O ingresa cantidad:', pt: 'Ou digite o valor:',
        ja: 'гЃѕгЃџгЃЇй‡‘йЎЌг‚’е…ҐеЉ›:', fr: 'Ou entrez un montant:', hi: 'а¤Їа¤ѕ а¤°а¤ѕа¤¶а¤ї а¤¦а¤°аҐЌа¤њ а¤•а¤°аҐ‡а¤‚:', ko: 'лђлЉ” кё€м•Ў мћ…л Ґ:', tr: 'Veya miktar girin:',
        de: 'Oder Betrag eingeben:', ar: 'ШЈЩ€ ШЈШЇШ®Щ„ Ш§Щ„Щ…ШЁЩ„Шє:', vi: 'Hoбє·c nhбє­p sб»‘ tiб»Ѓn:'
    },
    'enter_amount_placeholder': {
        en: 'Enter amount...', ru: 'Р’РІРµРґРёС‚Рµ СЃСѓРјРјСѓ...', zh: 'иѕ“е…Ґй‡‘йўќ...', es: 'Ingresa cantidad...', pt: 'Digite o valor...',
        ja: 'й‡‘йЎЌг‚’е…ҐеЉ›...', fr: 'Entrez le montant...', hi: 'а¤°а¤ѕа¤¶а¤ї а¤¦а¤°аҐЌа¤њ а¤•а¤°аҐ‡а¤‚...', ko: 'кё€м•Ў мћ…л Ґ...', tr: 'Miktar girin...',
        de: 'Betrag eingeben...', ar: 'ШЈШЇШ®Щ„ Ш§Щ„Щ…ШЁЩ„Шє...', vi: 'Nhбє­p sб»‘ tiб»Ѓn...'
    },
    'max_bet_hint': {
        en: 'Max: 50% of balance', ru: 'РњР°РєСЃ: 50% РѕС‚ Р±Р°Р»Р°РЅСЃР°', zh: 'жњЂе¤§: дЅ™йўќзљ„50%', es: 'MГЎx: 50% del saldo', pt: 'MГЎx: 50% do saldo',
        ja: 'жњЂе¤§: ж®‹й«гЃ®50%', fr: 'Max: 50% du solde', hi: 'а¤…а¤§а¤їа¤•а¤¤а¤®: а¤¶аҐ‡а¤· а¤•а¤ѕ 50%', ko: 'мµњлЊЂ: мћ”м•Ўмќ 50%', tr: 'Maks: Bakiyenin %50\'si',
        de: 'Max: 50% des Guthabens', ar: 'Ш§Щ„Ш­ШЇ Ш§Щ„ШЈЩ‚ШµЩ‰: 50% Щ…Щ† Ш§Щ„Ш±ШµЩЉШЇ', vi: 'Tб»‘i Д‘a: 50% sб»‘ dЖ°'
    },
    'score': {
        en: 'Score', ru: 'РЎС‡РµС‚', zh: 'е€†ж•°', es: 'PuntuaciГіn', pt: 'PontuaГ§ГЈo',
        ja: 'г‚№г‚іг‚ў', fr: 'Score', hi: 'а¤ёаҐЌа¤•аҐ‹а¤°', ko: 'м ђм€', tr: 'Skor',
        de: 'Punkte', ar: 'Ш§Щ„Щ†Щ‚Ш§Ш·', vi: 'Дђiб»ѓm'
    },
    'level': {
        en: 'Level', ru: 'РЈСЂРѕРІРµРЅСЊ', zh: 'з­‰зє§', es: 'Nivel', pt: 'NГ­vel',
        ja: 'гѓ¬гѓ™гѓ«', fr: 'Niveau', hi: 'а¤ёаҐЌа¤¤а¤°', ko: 'л €лІЁ', tr: 'Seviye',
        de: 'Level', ar: 'Ш§Щ„Щ…ШіШЄЩ€Щ‰', vi: 'CбєҐp Д‘б»™'
    },
    'wave': {
        en: 'Wave', ru: 'Р’РѕР»РЅР°', zh: 'жіў', es: 'Oleada', pt: 'Onda',
        ja: 'г‚¦г‚§гѓјгѓ–', fr: 'Vague', hi: 'а¤µаҐ‡а¤µ', ko: 'м›ЁмќґлёЊ', tr: 'Dalga',
        de: 'Welle', ar: 'Щ…Щ€Ш¬Ш©', vi: 'Wave'
    },
    'lives': {
        en: 'Lives', ru: 'Р–РёР·РЅРё', zh: 'з”џе‘Ѕ', es: 'Vidas', pt: 'Vidas',
        ja: 'гѓ©г‚¤гѓ•', fr: 'Vies', hi: 'а¤њаҐЂа¤µа¤Ё', ko: 'мѓќлЄ…', tr: 'Canlar',
        de: 'Leben', ar: 'Ш­ЩЉШ§Ш©', vi: 'MбєЎng'
    },
    'enemies': {
        en: 'Enemies', ru: 'Р’СЂР°РіРё', zh: 'ж•Њдєє', es: 'Enemigos', pt: 'Inimigos',
        ja: 'ж•µ', fr: 'Ennemis', hi: 'а¤¦аҐЃа¤¶аҐЌа¤®а¤Ё', ko: 'м Ѓ', tr: 'DГјЕџmanlar',
        de: 'Feinde', ar: 'ШЈШ№ШЇШ§ШЎ', vi: 'Kбє» thГ№'
    },
    'start_game': {
        en: 'рџљЂ START GAME', ru: 'рџљЂ РќРђР§РђРўР¬ РР“Р РЈ', zh: 'рџљЂ ејЂе§‹жёёж€Џ', es: 'рџљЂ INICIAR JUEGO', pt: 'рџљЂ INICIAR JOGO',
        ja: 'рџљЂ г‚Ігѓјгѓ й–‹е§‹', fr: 'рџљЂ COMMENCER', hi: 'рџљЂ а¤—аҐ‡а¤® а¤¶аҐЃа¤°аҐ‚ а¤•а¤°аҐ‡а¤‚', ko: 'рџљЂ кІЊмћ„ м‹њмћ‘', tr: 'рџљЂ OYUNA BAЕћLA',
        de: 'рџљЂ SPIEL STARTEN', ar: 'рџљЂ Ш§ШЁШЇШЈ Ш§Щ„Щ„Ш№ШЁШ©', vi: 'рџљЂ Bбє®T Дђбє¦U'
    },
    'win_up_to': {
        en: 'Win up to', ru: 'Р’С‹РёРіСЂР°Р№ РґРѕ', zh: 'иµўеЏ–жњЂй«', es: 'Gana hasta', pt: 'Ganhe atГ©',
        ja: 'жњЂе¤§е‹ќе€©', fr: 'Gagnez jusqu\'Г ', hi: 'а¤¤а¤• а¤њаҐЂа¤¤аҐ‡а¤‚', ko: 'мµњлЊЂ нљЌл“ќ', tr: 'KazanГ§',
        de: 'Gewinne bis zu', ar: 'Ш§Ш±ШЁШ­ Ш­ШЄЩ‰', vi: 'ThбєЇng lГЄn Д‘бєїn'
    },
    'spin_and_win': {
        en: 'Spin and win up to 10x!', ru: 'РљСЂСѓС‚Рё Рё РІС‹РёРіСЂС‹РІР°Р№ РґРѕ 10x!', zh: 'ж—‹иЅ¬е№¶иµўеЏ–жњЂй«10еЂЌ!', es: 'ВЎGira y gana hasta 10x!', pt: 'Gire e ganhe atГ© 10x!',
        ja: 'е›ћгЃ—гЃ¦жњЂе¤§10еЂЌг‚’зЌІеѕ—!', fr: 'Tournez et gagnez jusqu\'Г  10x!', hi: 'а¤аҐЃа¤®а¤ѕа¤Џа¤‚ а¤”а¤° 10x а¤¤а¤• а¤њаҐЂа¤¤аҐ‡а¤‚!', ko: 'лЏЊл ¤м„њ мµњлЊЂ 10л°° нљЌл“ќ!', tr: 'Г‡evir ve 10x\'e kadar kazan!',
        de: 'Drehen und bis zu 10x gewinnen!', ar: 'ШЈШЇШ± Щ€Ш§Ш±ШЁШ­ Ш­ШЄЩ‰ 10x!', vi: 'Quay vГ  thбєЇng lГЄn Д‘бєїn 10x!'
    },
    'progressive_jackpot': {
        en: 'рџЋ° PROGRESSIVE JACKPOT рџЋ°', ru: 'рџЋ° РџР РћР“Р Р•РЎРЎРР’РќР«Р™ Р”Р–Р•РљРџРћРў рџЋ°', zh: 'рџЋ° зґЇз§Їе¤§еҐ– рџЋ°', es: 'рџЋ° JACKPOT PROGRESIVO рџЋ°', pt: 'рџЋ° JACKPOT PROGRESSIVO рџЋ°',
        ja: 'рџЋ° гѓ—гѓ­г‚°гѓ¬гѓѓг‚·гѓ–г‚ёгѓЈгѓѓг‚Їгѓќгѓѓгѓ€ рџЋ°', fr: 'рџЋ° JACKPOT PROGRESSIF рџЋ°', hi: 'рџЋ° а¤ЄаҐЌа¤°аҐ‹а¤—аҐЌа¤°аҐ‡а¤ёа¤їа¤µ а¤њаҐ€а¤•а¤ЄаҐ‰а¤џ рџЋ°', ko: 'рџЋ° н”„лЎњк·ёл €м‹њлёЊ мћ­нЊџ рџЋ°', tr: 'рџЋ° PROGRESIF JACKPOT рџЋ°',
        de: 'рџЋ° PROGRESSIVER JACKPOT рџЋ°', ar: 'рџЋ° Ш§Щ„Ш¬Ш§Ш¦ШІШ© Ш§Щ„ЩѓШЁШ±Щ‰ Ш§Щ„ШЄШ±Ш§ЩѓЩ…ЩЉШ© рџЋ°', vi: 'рџЋ° JACKPOT TГЌCH LЕЁY рџЋ°'
    },
    'jackpot_grows': {
        en: '5% of each bet grows the pool!', ru: '5% РѕС‚ РєР°Р¶РґРѕР№ СЃС‚Р°РІРєРё СѓРІРµР»РёС‡РёРІР°РµС‚ РґР¶РµРєРїРѕС‚!', zh: 'жЇЏж¬ЎжЉ•жіЁзљ„5%еўћеЉ еҐ–ж± !', es: 'ВЎ5% de cada apuesta aumenta el bote!', pt: '5% de cada aposta aumenta o prГЄmio!',
        ja: 'еђ„гѓ™гѓѓгѓ€гЃ®5%гЃЊгѓ—гѓјгѓ«г‚’еў—г‚„гЃ—гЃѕгЃ™!', fr: '5% de chaque mise augmente le jackpot!', hi: 'а¤ЄаҐЌа¤°а¤¤аҐЌа¤ЇаҐ‡а¤• а¤¦а¤ѕа¤‚а¤µ а¤•а¤ѕ 5% а¤ЄаҐ‚а¤І а¤¬а¤ўа¤ја¤ѕа¤¤а¤ѕ а¤№аҐ€!', ko: 'к°Ѓ лІ нЊ…мќ 5%к°Ђ мћ­нЊџмќ„ м¦ќк°Ђм‹њн‚µл‹€л‹¤!', tr: 'Her bahsin %5\'i havuzu bГјyГјtГјr!',
        de: '5% jeder Wette erhГ¶ht den Jackpot!', ar: '5% Щ…Щ† ЩѓЩ„ Ш±Щ‡Ш§Щ† ЩЉШІЩЉШЇ Ш§Щ„Ш¬Ш§Ш¦ШІШ©!', vi: '5% mб»—i cЖ°б»Јc tДѓng jackpot!'
    },
    'connect_wallet': {
        en: 'рџ”— Connect Wallet', ru: 'рџ”— РџРѕРґРєР»СЋС‡РёС‚СЊ РєРѕС€РµР»РµРє', zh: 'рџ”— иїћжЋҐй’±еЊ…', es: 'рџ”— Conectar Cartera', pt: 'рџ”— Conectar Carteira',
        ja: 'рџ”— г‚¦г‚©гѓ¬гѓѓгѓ€г‚’жЋҐз¶љ', fr: 'рџ”— Connecter le Portefeuille', hi: 'рџ”— а¤µаҐ‰а¤ІаҐ‡а¤џ а¤•а¤ЁаҐ‡а¤•аҐЌа¤џ а¤•а¤°аҐ‡а¤‚', ko: 'рџ”— м§Ђк°‘ м—°кІ°', tr: 'рџ”— CГјzdan BaДџla',
        de: 'рџ”— Wallet verbinden', ar: 'рџ”— Ш±ШЁШ· Ш§Щ„Щ…Ш­ЩЃШёШ©', vi: 'рџ”— Kбєїt nб»‘i vГ­'
    },
    'connected_wallet': {
        en: 'рџ”— Connected Wallet', ru: 'рџ”— РџРѕРґРєР»СЋС‡РµРЅРЅС‹Р№ РєРѕС€РµР»РµРє', zh: 'рџ”— е·ІиїћжЋҐй’±еЊ…', es: 'рџ”— Cartera Conectada', pt: 'рџ”— Carteira Conectada',
        ja: 'рџ”— жЋҐз¶љжё€гЃїг‚¦г‚©гѓ¬гѓѓгѓ€', fr: 'рџ”— Portefeuille ConnectГ©', hi: 'рџ”— а¤•а¤ЁаҐ‡а¤•аҐЌа¤џаҐ‡а¤Ў а¤µаҐ‰а¤ІаҐ‡а¤џ', ko: 'рџ”— м—°кІ°лђњ м§Ђк°‘', tr: 'рџ”— BaДџlД± CГјzdan',
        de: 'рџ”— Wallet verbunden', ar: 'рџ”— Щ…Ш­ЩЃШёШ© Щ…ШЄШµЩ„Ш©', vi: 'рџ”— VГ­ Д‘ГЈ kбєїt nб»‘i'
    },
    'disconnect': {
        en: 'Disconnect', ru: 'РћС‚РєР»СЋС‡РёС‚СЊ', zh: 'ж–­ејЂиїћжЋҐ', es: 'Desconectar', pt: 'Desconectar',
        ja: 'е€‡ж–­', fr: 'DГ©connecter', hi: 'а¤Ўа¤їа¤ёаҐЌа¤•а¤ЁаҐ‡а¤•аҐЌа¤џ', ko: 'м—°кІ° н•ґм њ', tr: 'BaДџlantД±yД± Kes',
        de: 'Trennen', ar: 'Щ‚Ш·Ш№ Ш§Щ„Ш§ШЄШµШ§Щ„', vi: 'NgбєЇt kбєїt nб»‘i'
    },

    // ========== MODALS ==========
    'top_players': {
        en: 'Top Players', ru: 'РўРѕРї РёРіСЂРѕРєРѕРІ', zh: 'йЎ¶зє§зЋ©е®¶', es: 'Mejores Jugadores', pt: 'Melhores Jogadores',
        ja: 'гѓ€гѓѓгѓ—гѓ—гѓ¬г‚¤гѓ¤гѓј', fr: 'Meilleurs Joueurs', hi: 'а¤џаҐ‰а¤Є а¤ЄаҐЌа¤ІаҐ‡а¤Їа¤°аҐЌа¤ё', ko: 'мµњкі  н”Њл €мќґм–ґ', tr: 'En Д°yi Oyuncular',
        de: 'Top Spieler', ar: 'ШЈЩЃШ¶Щ„ Ш§Щ„Щ„Ш§Ш№ШЁЩЉЩ†', vi: 'NgЖ°б»ќi chЖЎi hГ ng Д‘бє§u'
    },
    'change_name': {
        en: 'Change Your Name', ru: 'РР·РјРµРЅРёС‚СЊ РёРјСЏ', zh: 'ж›ґж”№еђЌе­—', es: 'Cambiar Nombre', pt: 'Alterar Nome',
        ja: 'еђЌе‰Ќг‚’е¤‰ж›ґ', fr: 'Changer de Nom', hi: 'а¤Ёа¤ѕа¤® а¤¬а¤¦а¤ІаҐ‡а¤‚', ko: 'мќґл¦„ ліЂкІЅ', tr: 'AdД±nД± DeДџiЕџtir',
        de: 'Namen Г¤ndern', ar: 'ШєЩЉШ± Ш§ШіЩ…Щѓ', vi: 'Дђб»•i tГЄn'
    },
    'choose_display_name': {
        en: 'Choose your display name:', ru: 'Р’С‹Р±РµСЂРёС‚Рµ РѕС‚РѕР±СЂР°Р¶Р°РµРјРѕРµ РёРјСЏ:', zh: 'йЂ‰ж‹©ж‚Ёзљ„жѕз¤єеђЌз§°:', es: 'Elige tu nombre:',
        pt: 'Escolha seu nome de exibiГ§ГЈo:', ja: 'иЎЁз¤єеђЌг‚’йЃёжЉћ:', fr: 'Choisissez votre nom:', hi: 'а¤…а¤Єа¤Ёа¤ѕ а¤Ёа¤ѕа¤® а¤љаҐЃа¤ЁаҐ‡а¤‚:',
        ko: 'н‘њм‹њ мќґл¦„мќ„ м„ нѓќн•м„ёмљ”:', tr: 'GГ¶rГјnen adД±nД±zД± seГ§in:', de: 'WГ¤hlen Sie Ihren Anzeigenamen:',
        ar: 'Ш§Ш®ШЄШ± Ш§ШіЩ… Ш§Щ„Ш№Ш±Ш¶ Ш§Щ„Ш®Ш§Шµ ШЁЩѓ:', vi: 'Chб»Ќn tГЄn hiб»ѓn thб»‹ cб»§a bбєЎn:'
    },
    'enter_name': {
        en: 'Enter your name', ru: 'Р’РІРµРґРёС‚Рµ РёРјСЏ', zh: 'иѕ“е…ҐеђЌе­—', es: 'Ingresa tu nombre', pt: 'Digite seu nome',
        ja: 'еђЌе‰Ќг‚’е…ҐеЉ›', fr: 'Entrez votre nom', hi: 'а¤…а¤Єа¤Ёа¤ѕ а¤Ёа¤ѕа¤® а¤¦а¤°аҐЌа¤њ а¤•а¤°аҐ‡а¤‚', ko: 'мќґл¦„мќ„ мћ…л Ґн•м„ёмљ”', tr: 'AdД±nД±zД± girin',
        de: 'Namen eingeben', ar: 'ШЈШЇШ®Щ„ Ш§ШіЩ…Щѓ', vi: 'Nhбє­p tГЄn cб»§a bбєЎn'
    },
    'help_guide': {
        en: 'Help & Guide', ru: 'РџРѕРјРѕС‰СЊ Рё РіР°Р№Рґ', zh: 'её®еЉ©е’ЊжЊ‡еЌ—', es: 'Ayuda y GuГ­a', pt: 'Ajuda e Guia',
        ja: 'гѓгѓ«гѓ—пј†г‚¬г‚¤гѓ‰', fr: 'Aide & Guide', hi: 'а¤ёа¤№а¤ѕа¤Їа¤¤а¤ѕ а¤”а¤° а¤—а¤ѕа¤‡а¤Ў', ko: 'лЏ„м›Ђл§ђ л°Џ к°Ђмќґл“њ', tr: 'YardД±m ve Rehber',
        de: 'Hilfe & Anleitung', ar: 'Ш§Щ„Щ…ШіШ§Ш№ШЇШ© Щ€Ш§Щ„ШЇЩ„ЩЉЩ„', vi: 'Trб»Ј giГєp & HЖ°б»›ng dбє«n'
    },
    'quick_start': {
        en: 'Quick Start', ru: 'Р‘С‹СЃС‚СЂС‹Р№ СЃС‚Р°СЂС‚', zh: 'еї«йЂџејЂе§‹', es: 'Inicio RГЎpido', pt: 'InГ­cio RГЎpido',
        ja: 'г‚Їг‚¤гѓѓг‚Їг‚№г‚їгѓјгѓ€', fr: 'DГ©marrage Rapide', hi: 'а¤•аҐЌа¤µа¤їа¤• а¤ёаҐЌа¤џа¤ѕа¤°аҐЌа¤џ', ko: 'л№ лҐё м‹њмћ‘', tr: 'HД±zlД± BaЕџlangД±Г§',
        de: 'Schnellstart', ar: 'ШЁШЇШ§ЩЉШ© ШіШ±ЩЉШ№Ш©', vi: 'BбєЇt Д‘бє§u nhanh'
    },
    'how_to_earn': {
        en: 'How to Earn', ru: 'РљР°Рє Р·Р°СЂР°Р±РѕС‚Р°С‚СЊ', zh: 'е¦‚дЅ•иµљеЏ–', es: 'CГіmo Ganar', pt: 'Como Ganhar',
        ja: 'зЁјгЃЋж–№', fr: 'Comment Gagner', hi: 'а¤•аҐ€а¤ёаҐ‡ а¤•а¤®а¤ѕа¤Џа¤‚', ko: 'м€мќµ л°©лІ•', tr: 'NasД±l KazanД±lД±r',
        de: 'Wie man verdient', ar: 'ЩѓЩЉЩЃ ШЄЩѓШіШЁ', vi: 'CГЎch kiбєїm tiб»Ѓn'
    },
    'shop_guide': {
        en: 'Shop Guide', ru: 'Р“Р°Р№Рґ РїРѕ РјР°РіР°Р·РёРЅСѓ', zh: 'е•†еє—жЊ‡еЌ—', es: 'GuГ­a de Tienda', pt: 'Guia da Loja',
        ja: 'г‚·гѓ§гѓѓгѓ—г‚¬г‚¤гѓ‰', fr: 'Guide Boutique', hi: 'а¤¶аҐ‰а¤Є а¤—а¤ѕа¤‡а¤Ў', ko: 'мѓЃм ђ к°Ђмќґл“њ', tr: 'MaДџaza Rehberi',
        de: 'Shop-Anleitung', ar: 'ШЇЩ„ЩЉЩ„ Ш§Щ„Щ…ШЄШ¬Ш±', vi: 'HЖ°б»›ng dбє«n cб»­a hГ ng'
    },
    'faq': {
        en: 'FAQ', ru: 'Р§Р°Р’Рѕ', zh: 'еёёи§Ѓй—®йў', es: 'Preguntas', pt: 'Perguntas', ja: 'г‚€гЃЏгЃ‚г‚‹иіЄе•Џ',
        fr: 'FAQ', hi: 'а¤…а¤•аҐЌа¤ёа¤° а¤ЄаҐ‚а¤›аҐ‡ а¤ња¤ѕа¤ЁаҐ‡ а¤µа¤ѕа¤ІаҐ‡ а¤ЄаҐЌа¤°а¤¶аҐЌа¤Ё', ko: 'мћђмЈј л¬»лЉ” м§€л¬ё', tr: 'SSS',
        de: 'FAQ', ar: 'Ш§Щ„ШЈШіШ¦Щ„Ш© Ш§Щ„ШґШ§Ш¦Ш№Ш©', vi: 'CГўu hб»Џi thЖ°б»ќng gбє·p'
    },
    'level': {
        en: 'Level', ru: 'РЈСЂРѕРІРµРЅСЊ', zh: 'з­‰зє§', es: 'Nivel', pt: 'NГ­vel',
        ja: 'гѓ¬гѓ™гѓ«', fr: 'Niveau', hi: 'а¤ІаҐ‡а¤µа¤І', ko: 'л €лІЁ', tr: 'Seviye',
        de: 'Level', ar: 'Ш§Щ„Щ…ШіШЄЩ€Щ‰', vi: 'CбєҐp'
    },
    'rank': {
        en: 'Rank', ru: 'Р Р°РЅРі', zh: 'жЋ’еђЌ', es: 'Rango', pt: 'Ranking',
        ja: 'гѓ©гѓіг‚Ї', fr: 'Rang', hi: 'а¤°аҐ€а¤‚а¤•', ko: 'м€њмњ„', tr: 'SД±ralama',
        de: 'Rang', ar: 'Ш§Щ„ШЄШ±ШЄЩЉШЁ', vi: 'HбєЎng'
    },

    // ========== WITHDRAW MODAL ==========
    'withdraw_tama': {
        en: 'Withdraw TAMA', ru: 'Р’С‹РІРѕРґ TAMA', zh: 'жЏђеЏ–TAMA', es: 'Retirar TAMA', pt: 'Sacar TAMA',
        ja: 'TAMAе‡єй‡‘', fr: 'Retirer TAMA', hi: 'TAMA а¤Ёа¤їа¤•а¤ѕа¤ІаҐ‡а¤‚', ko: 'TAMA м¶њкё€', tr: 'TAMA Г‡ek',
        de: 'TAMA abheben', ar: 'ШіШ­ШЁ TAMA', vi: 'RГєt TAMA'
    },
    'your_balance': {
        en: 'Your Balance', ru: 'Р’Р°С€ Р±Р°Р»Р°РЅСЃ', zh: 'ж‚Ёзљ„дЅ™йўќ', es: 'Tu Saldo', pt: 'Seu Saldo',
        ja: 'ж®‹й«', fr: 'Votre Solde', hi: 'а¤†а¤Єа¤•а¤ѕ а¤¬аҐ€а¤ІаҐ‡а¤‚а¤ё', ko: 'мћ”м•Ў', tr: 'Bakiyeniz',
        de: 'Ihr Guthaben', ar: 'Ш±ШµЩЉШЇЩѓ', vi: 'Sб»‘ dЖ° cб»§a bбєЎn'
    },
    'wallet_address': {
        en: 'Wallet Address', ru: 'РђРґСЂРµСЃ РєРѕС€РµР»СЊРєР°', zh: 'й’±еЊ…ењ°еќЂ', es: 'DirecciГіn de Cartera', pt: 'EndereГ§o da Carteira',
        ja: 'г‚¦г‚©гѓ¬гѓѓгѓ€г‚ўгѓ‰гѓ¬г‚№', fr: 'Adresse du Portefeuille', hi: 'а¤µаҐ‰а¤ІаҐ‡а¤џ а¤Џа¤ЎаҐЌа¤°аҐ‡а¤ё', ko: 'м§Ђк°‘ мЈјм†Њ', tr: 'CГјzdan Adresi',
        de: 'Wallet-Adresse', ar: 'Ш№Щ†Щ€Ш§Щ† Ш§Щ„Щ…Ш­ЩЃШёШ©', vi: 'Дђб»‹a chб»‰ vГ­'
    },
    'saved_wallets': {
        en: 'Saved Wallets', ru: 'РЎРѕС…СЂР°РЅРµРЅРЅС‹Рµ РєРѕС€РµР»СЊРєРё', zh: 'е·Ідїќе­зљ„й’±еЊ…', es: 'Carteras Guardadas', pt: 'Carteiras Salvas',
        ja: 'дїќе­жё€гЃїг‚¦г‚©гѓ¬гѓѓгѓ€', fr: 'Portefeuilles EnregistrГ©s', hi: 'а¤ёа¤№аҐ‡а¤њаҐ‡ а¤—а¤Џ а¤µаҐ‰а¤ІаҐ‡а¤џ', ko: 'м ЂмћҐлђњ м§Ђк°‘', tr: 'KayД±tlД± CГјzdanlar',
        de: 'Gespeicherte Wallets', ar: 'Ш§Щ„Щ…Ш­Ш§ЩЃШё Ш§Щ„Щ…Ш­ЩЃЩ€ШёШ©', vi: 'VГ­ Д‘ГЈ lЖ°u'
    },
    'use_selected': {
        en: 'Use Selected', ru: 'РСЃРїРѕР»СЊР·РѕРІР°С‚СЊ', zh: 'дЅїз”ЁйЂ‰дё­', es: 'Usar Seleccionado', pt: 'Usar Selecionado',
        ja: 'йЃёжЉћг‚’дЅїз”Ё', fr: 'Utiliser SГ©lectionnГ©', hi: 'а¤ља¤Їа¤Ёа¤їа¤¤ а¤•а¤ѕ а¤‰а¤Єа¤ЇаҐ‹а¤— а¤•а¤°аҐ‡а¤‚', ko: 'м„ нѓќ м‚¬мљ©', tr: 'SeГ§ileni Kullan',
        de: 'AusgewГ¤hlte verwenden', ar: 'Ш§ШіШЄШ®ШЇШ§Щ… Ш§Щ„Щ…Ш­ШЇШЇ', vi: 'Sб»­ dб»Ґng Д‘ГЈ chб»Ќn'
    },
    'delete': {
        en: 'Delete', ru: 'РЈРґР°Р»РёС‚СЊ', zh: 'е€ й™¤', es: 'Eliminar', pt: 'Excluir',
        ja: 'е‰Љй™¤', fr: 'Supprimer', hi: 'а¤№а¤џа¤ѕа¤Џа¤‚', ko: 'м‚­м њ', tr: 'Sil',
        de: 'LГ¶schen', ar: 'Ш­Ш°ЩЃ', vi: 'XГіa'
    },
    'connect_phantom': {
        en: 'Connect Phantom Wallet', ru: 'РџРѕРґРєР»СЋС‡РёС‚СЊ Phantom', zh: 'иїћжЋҐPhantomй’±еЊ…', es: 'Conectar Phantom', pt: 'Conectar Phantom',
        ja: 'Phantomг‚’жЋҐз¶љ', fr: 'Connecter Phantom', hi: 'Phantom а¤•а¤ЁаҐ‡а¤•аҐЌа¤џ а¤•а¤°аҐ‡а¤‚', ko: 'Phantom м—°кІ°', tr: 'Phantom BaДџla',
        de: 'Phantom verbinden', ar: 'Ш±ШЁШ· Phantom', vi: 'Kбєїt nб»‘i Phantom'
    },
    'connected': {
        en: 'Connected', ru: 'РџРѕРґРєР»СЋС‡РµРЅРѕ', zh: 'е·ІиїћжЋҐ', es: 'Conectado', pt: 'Conectado',
        ja: 'жЋҐз¶љжё€гЃї', fr: 'ConnectГ©', hi: 'а¤•а¤ЁаҐ‡а¤•аҐЌа¤џаҐ‡а¤Ў', ko: 'м—°кІ°лђЁ', tr: 'BaДџlД±',
        de: 'Verbunden', ar: 'Щ…ШЄШµЩ„', vi: 'ДђГЈ kбєїt nб»‘i'
    },
    'disconnect': {
        en: 'Disconnect', ru: 'РћС‚РєР»СЋС‡РёС‚СЊ', zh: 'ж–­ејЂиїћжЋҐ', es: 'Desconectar', pt: 'Desconectar',
        ja: 'е€‡ж–­', fr: 'DГ©connecter', hi: 'а¤Ўа¤їа¤ёаҐЌа¤•а¤ЁаҐ‡а¤•аҐЌа¤џ', ko: 'м—°кІ° н•ґм њ', tr: 'BaДџlantД±yД± Kes',
        de: 'Trennen', ar: 'Щ‚Ш·Ш№ Ш§Щ„Ш§ШЄШµШ§Щ„', vi: 'NgбєЇt kбєїt nб»‘i'
    },
    'or_enter_manually': {
        en: 'Or enter wallet address manually:', ru: 'РР»Рё РІРІРµРґРёС‚Рµ Р°РґСЂРµСЃ РІСЂСѓС‡РЅСѓСЋ:', zh: 'ж€–ж‰‹еЉЁиѕ“е…Ґй’±еЊ…ењ°еќЂ:',
        es: 'O ingresa la direcciГіn manualmente:', pt: 'Ou digite o endereГ§o manualmente:', ja: 'гЃѕгЃџгЃЇж‰‹е‹•гЃ§е…ҐеЉ›:',
        fr: 'Ou entrez l\'adresse manuellement:', hi: 'а¤Їа¤ѕ а¤®аҐ€а¤ЁаҐЌа¤ЇаҐЃа¤…а¤І а¤°аҐ‚а¤Є а¤ёаҐ‡ а¤¦а¤°аҐЌа¤њ а¤•а¤°аҐ‡а¤‚:', ko: 'лђлЉ” м€лЏ™мњјлЎњ мћ…л Ґ:',
        tr: 'Veya manuel olarak girin:', de: 'Oder manuell eingeben:', ar: 'ШЈЩ€ ШЈШЇШ®Щ„ Ш§Щ„Ш№Щ†Щ€Ш§Щ† ЩЉШЇЩ€ЩЉШ§Щ‹:', vi: 'Hoбє·c nhбє­p thб»§ cГґng:'
    },
    'withdrawal_amount': {
        en: 'Withdrawal Amount', ru: 'РЎСѓРјРјР° РІС‹РІРѕРґР°', zh: 'жЏђзЋ°й‡‘йўќ', es: 'Monto de Retiro', pt: 'Valor do Saque',
        ja: 'е‡єй‡‘йЎЌ', fr: 'Montant du Retrait', hi: 'а¤Ёа¤їа¤•а¤ѕа¤ёаҐЂ а¤°а¤ѕа¤¶а¤ї', ko: 'м¶њкё€ кё€м•Ў', tr: 'Г‡ekim MiktarД±',
        de: 'Auszahlungsbetrag', ar: 'Щ…ШЁЩ„Шє Ш§Щ„ШіШ­ШЁ', vi: 'Sб»‘ tiб»Ѓn rГєt'
    },
    'amount': {
        en: 'Amount', ru: 'РЎСѓРјРјР°', zh: 'й‡‘йўќ', es: 'Monto', pt: 'Valor',
        ja: 'й‡‘йЎЌ', fr: 'Montant', hi: 'а¤°а¤ѕа¤¶а¤ї', ko: 'кё€м•Ў', tr: 'Miktar',
        de: 'Betrag', ar: 'Ш§Щ„Щ…ШЁЩ„Шє', vi: 'Sб»‘ tiб»Ѓn'
    },
    'fee': {
        en: 'Fee', ru: 'РљРѕРјРёСЃСЃРёСЏ', zh: 'ж‰‹з»­иґ№', es: 'ComisiГіn', pt: 'Taxa',
        ja: 'ж‰‹ж•°ж–™', fr: 'Frais', hi: 'а¤¶аҐЃа¤ІаҐЌа¤•', ko: 'м€м€лЈЊ', tr: 'Гњcret',
        de: 'GebГјhr', ar: 'Ш±ШіЩ€Щ…', vi: 'PhГ­'
    },
    'you_will_receive': {
        en: 'You will receive', ru: 'Р’С‹ РїРѕР»СѓС‡РёС‚Рµ', zh: 'ж‚Ёе°†ж”¶е€°', es: 'RecibirГЎs', pt: 'VocГЄ receberГЎ',
        ja: 'еЏ—еЏ–йЎЌ', fr: 'Vous recevrez', hi: 'а¤†а¤Єа¤•аҐ‹ а¤®а¤їа¤ІаҐ‡а¤—а¤ѕ', ko: 'л°›мќ„ кё€м•Ў', tr: 'AlacaДџД±nД±z',
        de: 'Sie erhalten', ar: 'ШіШЄШ­ШµЩ„ Ш№Щ„Щ‰', vi: 'BбєЎn sбєЅ nhбє­n'
    },
    'confirm_withdrawal': {
        en: 'Confirm Withdrawal', ru: 'РџРѕРґС‚РІРµСЂРґРёС‚СЊ РІС‹РІРѕРґ', zh: 'зЎ®и®¤жЏђзЋ°', es: 'Confirmar Retiro', pt: 'Confirmar Saque',
        ja: 'е‡єй‡‘г‚’зўєиЄЌ', fr: 'Confirmer le Retrait', hi: 'а¤Ёа¤їа¤•а¤ѕа¤ёаҐЂ а¤•аҐЂ а¤ЄаҐЃа¤·аҐЌа¤џа¤ї а¤•а¤°аҐ‡а¤‚', ko: 'м¶њкё€ н™•мќё', tr: 'Г‡ekimi Onayla',
        de: 'Auszahlung bestГ¤tigen', ar: 'ШЄШЈЩѓЩЉШЇ Ш§Щ„ШіШ­ШЁ', vi: 'XГЎc nhбє­n rГєt tiб»Ѓn'
    },
    'open_in_browser': {
        en: 'Open in Browser', ru: 'РћС‚РєСЂС‹С‚СЊ РІ Р±СЂР°СѓР·РµСЂРµ', zh: 'ењЁжµЏи§€е™Ёдё­ж‰“ејЂ', es: 'Abrir en Navegador', pt: 'Abrir no Navegador',
        ja: 'гѓ–гѓ©г‚¦г‚¶гЃ§й–‹гЃЏ', fr: 'Ouvrir dans le Navigateur', hi: 'а¤¬аҐЌа¤°а¤ѕа¤‰а¤ња¤ја¤° а¤®аҐ‡а¤‚ а¤–аҐ‹а¤ІаҐ‡а¤‚', ko: 'лёЊлќјмљ°м Ђм—ђм„њ м—ґкё°', tr: 'TarayД±cД±da AГ§',
        de: 'Im Browser Г¶ffnen', ar: 'ЩЃШЄШ­ ЩЃЩЉ Ш§Щ„Щ…ШЄШµЩЃШ­', vi: 'Mб»џ trong trГ¬nh duyб»‡t'
    },
    'processing_withdrawal': {
        en: 'Processing withdrawal...', ru: 'РћР±СЂР°Р±РѕС‚РєР° РІС‹РІРѕРґР°...', zh: 'ж­ЈењЁе¤„зђ†жЏђзЋ°...', es: 'Procesando retiro...', pt: 'Processando saque...',
        ja: 'е‡єй‡‘е‡¦зђ†дё­...', fr: 'Traitement du retrait...', hi: 'а¤Ёа¤їа¤•а¤ѕа¤ёаҐЂ а¤ЄаҐЌа¤°аҐ‹а¤ёаҐ‡а¤ё а¤№аҐ‹ а¤°а¤№аҐЂ а¤№аҐ€...', ko: 'м¶њкё€ мІл¦¬ м¤‘...', tr: 'Г‡ekim iЕџleniyor...',
        de: 'Auszahlung wird verarbeitet...', ar: 'Ш¬Ш§Ш±ЩЉ Щ…Ш№Ш§Щ„Ш¬Ш© Ш§Щ„ШіШ­ШЁ...', vi: 'Дђang xб»­ lГЅ rГєt tiб»Ѓn...'
    },
    'validating_request': {
        en: 'Validating request...', ru: 'РџСЂРѕРІРµСЂРєР° Р·Р°РїСЂРѕСЃР°...', zh: 'йЄЊиЇЃиЇ·ж±‚дё­...', es: 'Validando solicitud...', pt: 'Validando solicitaГ§ГЈo...',
        ja: 'гѓЄг‚Їг‚Ёг‚№гѓ€ж¤њиЁјдё­...', fr: 'Validation de la demande...', hi: 'а¤…а¤ЁаҐЃа¤°аҐ‹а¤§ а¤ёа¤¤аҐЌа¤Їа¤ѕа¤Єа¤їа¤¤ а¤№аҐ‹ а¤°а¤№а¤ѕ а¤№аҐ€...', ko: 'мљ”мІ­ кІЂм¦ќ м¤‘...', tr: 'Д°stek doДџrulanД±yor...',
        de: 'Anfrage wird validiert...', ar: 'Ш¬Ш§Ш±ЩЉ Ш§Щ„ШЄШ­Щ‚Щ‚ Щ…Щ† Ш§Щ„Ш·Щ„ШЁ...', vi: 'Дђang xГЎc thб»±c yГЄu cбє§u...'
    },
    'processing_transaction': {
        en: 'Processing transaction...', ru: 'РћР±СЂР°Р±РѕС‚РєР° С‚СЂР°РЅР·Р°РєС†РёРё...', zh: 'е¤„зђ†дє¤ж“дё­...', es: 'Procesando transacciГіn...', pt: 'Processando transaГ§ГЈo...',
        ja: 'гѓ€гѓ©гѓіг‚¶г‚Їг‚·гѓ§гѓіе‡¦зђ†дё­...', fr: 'Traitement de la transaction...', hi: 'а¤ІаҐ‡а¤Ёа¤¦аҐ‡а¤Ё а¤ЄаҐЌа¤°аҐ‹а¤ёаҐ‡а¤ё а¤№аҐ‹ а¤°а¤№а¤ѕ а¤№аҐ€...', ko: 'нЉёлћњмћ­м… мІл¦¬ м¤‘...', tr: 'Д°Еџlem yapД±lД±yor...',
        de: 'Transaktion wird verarbeitet...', ar: 'Ш¬Ш§Ш±ЩЉ Щ…Ш№Ш§Щ„Ш¬Ш© Ш§Щ„Щ…Ш№Ш§Щ…Щ„Ш©...', vi: 'Дђang xб»­ lГЅ giao dб»‹ch...'
    },
    'confirming_blockchain': {
        en: 'Confirming on blockchain...', ru: 'РџРѕРґС‚РІРµСЂР¶РґРµРЅРёРµ РІ Р±Р»РѕРєС‡РµР№РЅРµ...', zh: 'ењЁеЊєеќ—й“ѕдёЉзЎ®и®¤...', es: 'Confirmando en blockchain...', pt: 'Confirmando na blockchain...',
        ja: 'гѓ–гѓ­гѓѓг‚ЇгѓЃг‚§гѓјгѓігЃ§зўєиЄЌдё­...', fr: 'Confirmation sur la blockchain...', hi: 'а¤¬аҐЌа¤ІаҐ‰а¤•а¤љаҐ‡а¤Ё а¤Єа¤° а¤ЄаҐЃа¤·аҐЌа¤џа¤ї а¤№аҐ‹ а¤°а¤№аҐЂ а¤№аҐ€...', ko: 'лё”лЎќмІґмќём—ђм„њ н™•мќё м¤‘...', tr: 'Blockchain\'de onaylanД±yor...',
        de: 'BestГ¤tigung auf Blockchain...', ar: 'Ш¬Ш§Ш±ЩЉ Ш§Щ„ШЄШЈЩѓЩЉШЇ Ш№Щ„Щ‰ Ш§Щ„ШЁЩ„Щ€ЩѓШЄШґЩЉЩ†...', vi: 'Дђang xГЎc nhбє­n trГЄn blockchain...'
    },
    'withdrawal_history': {
        en: 'Withdrawal History', ru: 'РСЃС‚РѕСЂРёСЏ РІС‹РІРѕРґРѕРІ', zh: 'жЏђзЋ°еЋ†еЏІ', es: 'Historial de Retiros', pt: 'HistГіrico de Saques',
        ja: 'е‡єй‡‘е±Ґж­ґ', fr: 'Historique des Retraits', hi: 'а¤Ёа¤їа¤•а¤ѕа¤ёаҐЂ а¤‡а¤¤а¤їа¤№а¤ѕа¤ё', ko: 'м¶њкё€ л‚ґм—­', tr: 'Г‡ekim GeГ§miЕџi',
        de: 'Auszahlungsverlauf', ar: 'ШіШ¬Щ„ Ш§Щ„ШіШ­Щ€ШЁШ§ШЄ', vi: 'Lб»‹ch sб»­ rГєt tiб»Ѓn'
    },

    // ========== NFT MODAL ==========
    'nft_collection': {
        en: 'NFT Collection', ru: 'РљРѕР»Р»РµРєС†РёСЏ NFT', zh: 'NFTж”¶и—Џ', es: 'ColecciГіn NFT', pt: 'ColeГ§ГЈo NFT',
        ja: 'NFTг‚ігѓ¬г‚Їг‚·гѓ§гѓі', fr: 'Collection NFT', hi: 'NFT а¤ёа¤‚а¤—аҐЌа¤°а¤№', ko: 'NFT м»¬л ‰м…', tr: 'NFT Koleksiyonu',
        de: 'NFT-Sammlung', ar: 'Щ…Ш¬Щ…Щ€Ш№Ш© NFT', vi: 'Bб»™ sЖ°u tбє­p NFT'
    },
    'my_nft_collection': {
        en: 'My NFT Collection', ru: 'РњРѕСЏ РєРѕР»Р»РµРєС†РёСЏ NFT', zh: 'ж€‘зљ„NFTж”¶и—Џ', es: 'Mi ColecciГіn NFT', pt: 'Minha ColeГ§ГЈo NFT',
        ja: 'гѓћг‚¤NFTг‚ігѓ¬г‚Їг‚·гѓ§гѓі', fr: 'Ma Collection NFT', hi: 'а¤®аҐ‡а¤°а¤ѕ NFT а¤ёа¤‚а¤—аҐЌа¤°а¤№', ko: 'л‚ґ NFT м»¬л ‰м…', tr: 'NFT Koleksiyonum',
        de: 'Meine NFT-Sammlung', ar: 'Щ…Ш¬Щ…Щ€Ш№ШЄЩЉ NFT', vi: 'Bб»™ sЖ°u tбє­p NFT cб»§a tГґi'
    },
    'mint_new_nft': {
        en: 'Mint New NFT Pet', ru: 'РЎРѕР·РґР°С‚СЊ РЅРѕРІРѕРіРѕ NFT РїРёС‚РѕРјС†Р°', zh: 'й“ёйЂ ж–°NFTе® з‰©', es: 'Crear Nueva Mascota NFT', pt: 'Criar Novo Pet NFT',
        ja: 'ж–°гЃ—гЃ„NFTгѓљгѓѓгѓ€г‚’дЅњж€ђ', fr: 'CrГ©er un Nouveau Pet NFT', hi: 'а¤Ёа¤Їа¤ѕ NFT а¤ЄаҐ‡а¤џ а¤¬а¤Ёа¤ѕа¤Џа¤‚', ko: 'мѓ€ NFT нЋ« л°њн–‰', tr: 'Yeni NFT Pet OluЕџtur',
        de: 'Neues NFT-Haustier erstellen', ar: 'ШҐЩ†ШґШ§ШЎ Ш­ЩЉЩ€Ш§Щ† NFT Ш¬ШЇЩЉШЇ', vi: 'TбєЎo thГє cЖ°ng NFT mб»›i'
    },
    'mint_with_tama': {
        en: 'Mint with TAMA', ru: 'РЎРѕР·РґР°С‚СЊ Р·Р° TAMA', zh: 'з”ЁTAMAй“ёйЂ ', es: 'Crear con TAMA', pt: 'Criar com TAMA',
        ja: 'TAMAгЃ§дЅњж€ђ', fr: 'CrГ©er avec TAMA', hi: 'TAMA а¤ёаҐ‡ а¤¬а¤Ёа¤ѕа¤Џа¤‚', ko: 'TAMAлЎњ л°њн–‰', tr: 'TAMA ile OluЕџtur',
        de: 'Mit TAMA erstellen', ar: 'ШҐЩ†ШґШ§ШЎ ШЁЩЂ TAMA', vi: 'TбєЎo bбє±ng TAMA'
    },
    'mint_with_sol': {
        en: 'Mint with SOL', ru: 'РЎРѕР·РґР°С‚СЊ Р·Р° SOL', zh: 'з”ЁSOLй“ёйЂ ', es: 'Crear con SOL', pt: 'Criar com SOL',
        ja: 'SOLгЃ§дЅњж€ђ', fr: 'CrГ©er avec SOL', hi: 'SOL а¤ёаҐ‡ а¤¬а¤Ёа¤ѕа¤Џа¤‚', ko: 'SOLлЎњ л°њн–‰', tr: 'SOL ile OluЕџtur',
        de: 'Mit SOL erstellen', ar: 'ШҐЩ†ШґШ§ШЎ ШЁЩЂ SOL', vi: 'TбєЎo bбє±ng SOL'
    },
    'connect_wallet': {
        en: 'Connect Wallet', ru: 'РџРѕРґРєР»СЋС‡РёС‚СЊ РєРѕС€РµР»РµРє', zh: 'иїћжЋҐй’±еЊ…', es: 'Conectar Cartera', pt: 'Conectar Carteira',
        ja: 'г‚¦г‚©гѓ¬гѓѓгѓ€г‚’жЋҐз¶љ', fr: 'Connecter le Portefeuille', hi: 'а¤µаҐ‰а¤ІаҐ‡а¤џ а¤•а¤ЁаҐ‡а¤•аҐЌа¤џ а¤•а¤°аҐ‡а¤‚', ko: 'м§Ђк°‘ м—°кІ°', tr: 'CГјzdan BaДџla',
        de: 'Wallet verbinden', ar: 'Ш±ШЁШ· Ш§Щ„Щ…Ш­ЩЃШёШ©', vi: 'Kбєїt nб»‘i vГ­'
    },
    'wallet_connected': {
        en: 'Wallet Connected', ru: 'РљРѕС€РµР»РµРє РїРѕРґРєР»СЋС‡РµРЅ', zh: 'й’±еЊ…е·ІиїћжЋҐ', es: 'Cartera Conectada', pt: 'Carteira Conectada',
        ja: 'г‚¦г‚©гѓ¬гѓѓгѓ€жЋҐз¶љжё€гЃї', fr: 'Portefeuille ConnectГ©', hi: 'а¤µаҐ‰а¤ІаҐ‡а¤џ а¤•а¤ЁаҐ‡а¤•аҐЌа¤џаҐ‡а¤Ў', ko: 'м§Ђк°‘ м—°кІ°лђЁ', tr: 'CГјzdan BaДџlandД±',
        de: 'Wallet verbunden', ar: 'ШЄЩ… Ш±ШЁШ· Ш§Щ„Щ…Ш­ЩЃШёШ©', vi: 'ДђГЈ kбєїt nб»‘i vГ­'
    },
    'disconnect_wallet': {
        en: 'Disconnect Wallet', ru: 'РћС‚РєР»СЋС‡РёС‚СЊ РєРѕС€РµР»РµРє', zh: 'ж–­ејЂй’±еЊ…', es: 'Desconectar Cartera', pt: 'Desconectar Carteira',
        ja: 'г‚¦г‚©гѓ¬гѓѓгѓ€г‚’е€‡ж–­', fr: 'DГ©connecter le Portefeuille', hi: 'а¤µаҐ‰а¤ІаҐ‡а¤џ а¤Ўа¤їа¤ёаҐЌа¤•а¤ЁаҐ‡а¤•аҐЌа¤џ а¤•а¤°аҐ‡а¤‚', ko: 'м§Ђк°‘ м—°кІ° н•ґм њ', tr: 'CГјzdan BaДџlantД±sД±nД± Kes',
        de: 'Wallet trennen', ar: 'Щ‚Ш·Ш№ Ш±ШЁШ· Ш§Щ„Щ…Ш­ЩЃШёШ©', vi: 'NgбєЇt kбєїt nб»‘i vГ­'
    },
    'connect_wallet_title': {
        en: 'Connect Wallet', ru: 'РџРѕРґРєР»СЋС‡РёС‚СЊ РєРѕС€РµР»РµРє', zh: 'иїћжЋҐй’±еЊ…', es: 'Conectar Cartera', pt: 'Conectar Carteira',
        ja: 'г‚¦г‚©гѓ¬гѓѓгѓ€г‚’жЋҐз¶љ', fr: 'Connecter le Portefeuille', hi: 'а¤µаҐ‰а¤ІаҐ‡а¤џ а¤•а¤ЁаҐ‡а¤•аҐЌа¤џ а¤•а¤°аҐ‡а¤‚', ko: 'м§Ђк°‘ м—°кІ°', tr: 'CГјzdan BaДџla',
        de: 'Wallet verbinden', ar: 'Ш±ШЁШ· Ш§Щ„Щ…Ш­ЩЃШёШ©', vi: 'Kбєїt nб»‘i vГ­'
    },
    'connect_wallet_desc': {
        en: 'Connect your Phantom or Solflare wallet to start playing and save your progress',
        ru: 'РџРѕРґРєР»СЋС‡РёС‚Рµ РєРѕС€РµР»РµРє Phantom РёР»Рё Solflare С‡С‚РѕР±С‹ РЅР°С‡Р°С‚СЊ РёРіСЂР°С‚СЊ Рё СЃРѕС…СЂР°РЅСЏС‚СЊ РїСЂРѕРіСЂРµСЃСЃ',
        zh: 'иїћжЋҐж‚Ёзљ„Phantomж€–Solflareй’±еЊ…д»ҐејЂе§‹жёёж€Џе№¶дїќе­иї›еє¦',
        es: 'Conecta tu cartera Phantom o Solflare para comenzar a jugar y guardar tu progreso',
        pt: 'Conecte sua carteira Phantom ou Solflare para comeГ§ar a jogar e salvar seu progresso',
        ja: 'PhantomгЃѕгЃџгЃЇSolflareг‚¦г‚©гѓ¬гѓѓгѓ€г‚’жЋҐз¶љгЃ—гЃ¦г‚Ігѓјгѓ г‚’й–‹е§‹гЃ—гЂЃйЂІиЎЊзЉ¶жіЃг‚’дїќе­гЃ—гЃѕгЃ™',
        fr: 'Connectez votre portefeuille Phantom ou Solflare pour commencer Г  jouer et sauvegarder votre progression',
        hi: 'а¤–аҐ‡а¤Іа¤Ёа¤ѕ а¤¶аҐЃа¤°аҐ‚ а¤•а¤°а¤ЁаҐ‡ а¤”а¤° а¤…а¤Єа¤ЁаҐЂ а¤ЄаҐЌа¤°а¤—а¤¤а¤ї а¤ёа¤№аҐ‡а¤ња¤ЁаҐ‡ а¤•аҐ‡ а¤Іа¤їа¤Џ а¤…а¤Єа¤Ёа¤ѕ Phantom а¤Їа¤ѕ Solflare а¤µаҐ‰а¤ІаҐ‡а¤џ а¤•а¤ЁаҐ‡а¤•аҐЌа¤џ а¤•а¤°аҐ‡а¤‚',
        ko: 'Phantom лђлЉ” Solflare м§Ђк°‘мќ„ м—°кІ°н•м—¬ кІЊмћ„мќ„ м‹њмћ‘н•кі  м§„н–‰ мѓЃн™©мќ„ м ЂмћҐн•м„ёмљ”',
        tr: 'Oynamaya baЕџlamak ve ilerlemenizi kaydetmek iГ§in Phantom veya Solflare cГјzdanД±nД±zД± baДџlayД±n',
        de: 'Verbinden Sie Ihre Phantom- oder Solflare-Wallet, um zu spielen und Ihren Fortschritt zu speichern',
        ar: 'Щ‚Щ… ШЁШ±ШЁШ· Щ…Ш­ЩЃШёШ© Phantom ШЈЩ€ Solflare Щ„Щ„ШЁШЇШЎ ЩЃЩЉ Ш§Щ„Щ„Ш№ШЁ Щ€Ш­ЩЃШё ШЄЩ‚ШЇЩ…Щѓ',
        vi: 'Kбєїt nб»‘i vГ­ Phantom hoбє·c Solflare cб»§a bбєЎn Д‘б»ѓ bбєЇt Д‘бє§u chЖЎi vГ  lЖ°u tiбєїn trГ¬nh'
    },
    'game_data_saved': {
        en: 'Your game data will be securely saved on the blockchain',
        ru: 'Р’Р°С€Рё РёРіСЂРѕРІС‹Рµ РґР°РЅРЅС‹Рµ Р±СѓРґСѓС‚ Р±РµР·РѕРїР°СЃРЅРѕ СЃРѕС…СЂР°РЅРµРЅС‹ РІ Р±Р»РѕРєС‡РµР№РЅРµ',
        zh: 'ж‚Ёзљ„жёёж€Џж•°жЌ®е°†е®‰е…Ёењ°дїќе­ењЁеЊєеќ—й“ѕдёЉ',
        es: 'Tus datos del juego se guardarГЎn de forma segura en la blockchain',
        pt: 'Seus dados do jogo serГЈo salvos com seguranГ§a na blockchain',
        ja: 'г‚Ігѓјгѓ гѓ‡гѓјг‚їгЃЇгѓ–гѓ­гѓѓг‚ЇгѓЃг‚§гѓјгѓігЃ«е®‰е…ЁгЃ«дїќе­гЃ•г‚ЊгЃѕгЃ™',
        fr: 'Vos donnГ©es de jeu seront sauvegardГ©es en toute sГ©curitГ© sur la blockchain',
        hi: 'а¤†а¤Єа¤•а¤ѕ а¤—аҐ‡а¤® а¤ЎаҐ‡а¤џа¤ѕ а¤¬аҐЌа¤ІаҐ‰а¤•а¤љаҐ‡а¤Ё а¤Єа¤° а¤ёаҐЃа¤°а¤•аҐЌа¤·а¤їа¤¤ а¤°аҐ‚а¤Є а¤ёаҐ‡ а¤ёа¤№аҐ‡а¤ња¤ѕ а¤ња¤ѕа¤Џа¤—а¤ѕ',
        ko: 'кІЊмћ„ лЌ°мќґн„°к°Ђ лё”лЎќмІґмќём—ђ м•€м „н•кІЊ м ЂмћҐлђ©л‹€л‹¤',
        tr: 'Oyun verileriniz blockchain\'de gГјvenli bir Еџekilde kaydedilecek',
        de: 'Ihre Spieldaten werden sicher auf der Blockchain gespeichert',
        ar: 'ШіЩЉШЄЩ… Ш­ЩЃШё ШЁЩЉШ§Щ†Ш§ШЄ Ш§Щ„Щ„Ш№ШЁШ© Ш§Щ„Ш®Ш§ШµШ© ШЁЩѓ ШЁШЈЩ…Ш§Щ† Ш№Щ„Щ‰ Ш§Щ„ШЁЩ„Щ€Щѓ ШЄШґЩЉЩ†',
        vi: 'Dб»Ї liб»‡u trГІ chЖЎi cб»§a bбєЎn sбєЅ Д‘Ж°б»Јc lЖ°u an toГ n trГЄn blockchain'
    },
    'download_phantom': {
        en: 'Don\'t have a wallet? Download Phantom',
        ru: 'РќРµС‚ РєРѕС€РµР»СЊРєР°? РЎРєР°С‡Р°Р№С‚Рµ Phantom',
        zh: 'жІЎжњ‰й’±еЊ…пјџдё‹иЅЅPhantom',
        es: 'ВїNo tienes cartera? Descarga Phantom',
        pt: 'NГЈo tem carteira? Baixe o Phantom',
        ja: 'г‚¦г‚©гѓ¬гѓѓгѓ€г‚’гЃЉжЊЃгЃЎгЃ§гЃЄгЃ„гЃ§гЃ™гЃ‹пјџPhantomг‚’гѓЂг‚¦гѓігѓ­гѓјгѓ‰',
        fr: 'Vous n\'avez pas de portefeuille ? TГ©lГ©chargez Phantom',
        hi: 'а¤µаҐ‰а¤ІаҐ‡а¤џ а¤Ёа¤№аҐЂа¤‚ а¤№аҐ€? Phantom а¤Ўа¤ѕа¤‰а¤Ёа¤ІаҐ‹а¤Ў а¤•а¤°аҐ‡а¤‚',
        ko: 'м§Ђк°‘мќґ м—†мњјм‹ к°Ђмљ”? Phantom л‹¤мљґлЎњл“њ',
        tr: 'CГјzdanД±nД±z yok mu? Phantom\'Д± indirin',
        de: 'Keine Wallet? Phantom herunterladen',
        ar: 'Щ„ЩЉШі Щ„ШЇЩЉЩѓ Щ…Ш­ЩЃШёШ©Шџ Щ‚Щ… ШЁШЄЩ†ШІЩЉЩ„ Phantom',
        vi: 'ChЖ°a cГі vГ­? TбєЈi xuб»‘ng Phantom'
    },
    'connect_phantom_nft': {
        en: 'Connect Phantom to mint on-chain NFTs',
        ru: 'РџРѕРґРєР»СЋС‡РёС‚Рµ Phantom РґР»СЏ СЃРѕР·РґР°РЅРёСЏ NFT РІ Р±Р»РѕРєС‡РµР№РЅРµ',
        zh: 'иїћжЋҐPhantomд»Ґй“ёйЂ й“ѕдёЉNFT',
        es: 'Conecta Phantom para crear NFTs en cadena',
        pt: 'Conecte o Phantom para criar NFTs na cadeia',
        ja: 'гѓЃг‚§гѓјгѓідёЉNFTг‚’дЅњж€ђгЃ™г‚‹гЃ«гЃЇPhantomг‚’жЋҐз¶љ',
        fr: 'Connectez Phantom pour crГ©er des NFT sur la chaГ®ne',
        hi: 'а¤љаҐ‡а¤Ё а¤Єа¤° NFT а¤¬а¤Ёа¤ѕа¤ЁаҐ‡ а¤•аҐ‡ а¤Іа¤їа¤Џ Phantom а¤•а¤ЁаҐ‡а¤•аҐЌа¤џ а¤•а¤°аҐ‡а¤‚',
        ko: 'мІґмќёмѓЃ NFTлҐј л°њн–‰н•л ¤л©ґ Phantom м—°кІ°',
        tr: 'Zincir Гјzerinde NFT oluЕџturmak iГ§in Phantom\'Д± baДџlayД±n',
        de: 'Phantom verbinden, um On-Chain-NFTs zu erstellen',
        ar: 'Щ‚Щ… ШЁШ±ШЁШ· Phantom Щ„ШҐЩ†ШґШ§ШЎ NFTs Ш№Щ„Щ‰ Ш§Щ„ШіЩ„ШіЩ„Ш©',
        vi: 'Kбєїt nб»‘i Phantom Д‘б»ѓ tбєЎo NFT trГЄn chuб»—i'
    },
    'select_saved_wallet': {
        en: 'Saved Wallets:',
        ru: 'РЎРѕС…СЂР°РЅРµРЅРЅС‹Рµ РєРѕС€РµР»СЊРєРё:',
        zh: 'е·Ідїќе­зљ„й’±еЊ…:',
        es: 'Carteras Guardadas:',
        pt: 'Carteiras Salvas:',
        ja: 'дїќе­гЃ•г‚ЊгЃџг‚¦г‚©гѓ¬гѓѓгѓ€:',
        fr: 'Portefeuilles EnregistrГ©s:',
        hi: 'а¤ёа¤№аҐ‡а¤њаҐ‡ а¤—а¤Џ а¤µаҐ‰а¤ІаҐ‡а¤џ:',
        ko: 'м ЂмћҐлђњ м§Ђк°‘:',
        tr: 'KayД±tlД± CГјzdanlar:',
        de: 'Gespeicherte Wallets:',
        ar: 'Ш§Щ„Щ…Ш­Ш§ЩЃШё Ш§Щ„Щ…Ш­ЩЃЩ€ШёШ©:',
        vi: 'VГ­ Д‘ГЈ lЖ°u:'
    },
    'open_browser_tip': {
        en: 'You can also open in browser for full Phantom support',
        ru: 'Р’С‹ С‚Р°РєР¶Рµ РјРѕР¶РµС‚Рµ РѕС‚РєСЂС‹С‚СЊ РІ Р±СЂР°СѓР·РµСЂРµ РґР»СЏ РїРѕР»РЅРѕР№ РїРѕРґРґРµСЂР¶РєРё Phantom',
        zh: 'ж‚Ёд№џеЏЇд»ҐењЁжµЏи§€е™Ёдё­ж‰“ејЂд»ҐиЋ·еѕ—е®Њж•ґзљ„Phantomж”ЇжЊЃ',
        es: 'TambiГ©n puedes abrir en el navegador para soporte completo de Phantom',
        pt: 'VocГЄ tambГ©m pode abrir no navegador para suporte completo do Phantom',
        ja: 'е®Ње…ЁгЃЄPhantomг‚µгѓќгѓјгѓ€гЃ®гЃџг‚ЃгЃ«гѓ–гѓ©г‚¦г‚¶гЃ§й–‹гЃЏгЃ“гЃЁг‚‚гЃ§гЃЌгЃѕгЃ™',
        fr: 'Vous pouvez Г©galement ouvrir dans le navigateur pour un support Phantom complet',
        hi: 'а¤ЄаҐ‚а¤°аҐЌа¤Ј Phantom а¤ёа¤®а¤°аҐЌа¤Ґа¤Ё а¤•аҐ‡ а¤Іа¤їа¤Џ а¤†а¤Є а¤¬аҐЌа¤°а¤ѕа¤‰а¤ња¤ја¤° а¤®аҐ‡а¤‚ а¤­аҐЂ а¤–аҐ‹а¤І а¤ёа¤•а¤¤аҐ‡ а¤№аҐ€а¤‚',
        ko: 'м „мІґ Phantom м§Ђм›ђмќ„ мњ„н•ґ лёЊлќјмљ°м Ђм—ђм„њ м—ґ м€лЏ„ мћ€мЉµл‹€л‹¤',
        tr: 'Tam Phantom desteДџi iГ§in tarayД±cД±da da aГ§abilirsiniz',
        de: 'Sie kГ¶nnen auch im Browser Г¶ffnen fГјr vollstГ¤ndige Phantom-UnterstГјtzung',
        ar: 'ЩЉЩ…ЩѓЩ†Щѓ ШЈЩЉШ¶Щ‹Ш§ ЩЃШЄШ­Щ‡ ЩЃЩЉ Ш§Щ„Щ…ШЄШµЩЃШ­ Щ„Щ„Ш­ШµЩ€Щ„ Ш№Щ„Щ‰ ШЇШ№Щ… Phantom Ш§Щ„ЩѓШ§Щ…Щ„',
        vi: 'BбєЎn cЕ©ng cГі thб»ѓ mб»џ trong trГ¬nh duyб»‡t Д‘б»ѓ cГі hб»— trб»Ј Phantom Д‘бє§y Д‘б»§'
    },
    'enter_wallet_address': {
        en: 'Enter wallet address...',
        ru: 'Р’РІРµРґРёС‚Рµ Р°РґСЂРµСЃ РєРѕС€РµР»СЊРєР°...',
        zh: 'иѕ“е…Ґй’±еЊ…ењ°еќЂ...',
        es: 'Ingresa la direcciГіn de la cartera...',
        pt: 'Digite o endereГ§o da carteira...',
        ja: 'г‚¦г‚©гѓ¬гѓѓгѓ€г‚ўгѓ‰гѓ¬г‚№г‚’е…ҐеЉ›...',
        fr: 'Entrez l\'adresse du portefeuille...',
        hi: 'а¤µаҐ‰а¤ІаҐ‡а¤џ а¤Єа¤¤а¤ѕ а¤¦а¤°аҐЌа¤њ а¤•а¤°аҐ‡а¤‚...',
        ko: 'м§Ђк°‘ мЈјм†Њ мћ…л Ґ...',
        tr: 'CГјzdan adresini girin...',
        de: 'Wallet-Adresse eingeben...',
        ar: 'ШЈШЇШ®Щ„ Ш№Щ†Щ€Ш§Щ† Ш§Щ„Щ…Ш­ЩЃШёШ©...',
        vi: 'Nhбє­p Д‘б»‹a chб»‰ vГ­...'
    },

    // ========== MINT PAGE ==========
    'mint_your_nft_pet': {
        en: 'рџЋЁ MINT YOUR NFT PET',
        ru: 'рџЋЁ РЎРћР—Р”РђРўР¬ NFT РџРРўРћРњР¦Рђ',
        zh: 'рџЋЁ й“ёйЂ ж‚Ёзљ„NFTе® з‰©',
        es: 'рџЋЁ CREAR TU MASCOTA NFT',
        pt: 'рџЋЁ CRIAR SEU PET NFT',
        ja: 'рџЋЁ NFTгѓљгѓѓгѓ€г‚’дЅњж€ђ',
        fr: 'рџЋЁ CRГ‰ER VOTRE PET NFT',
        hi: 'рџЋЁ а¤…а¤Єа¤Ёа¤ѕ NFT а¤ЄаҐ‡а¤џ а¤¬а¤Ёа¤ѕа¤Џа¤‚',
        ko: 'рџЋЁ NFT нЋ« л°њн–‰',
        tr: 'рџЋЁ NFT PET OLUЕћTUR',
        de: 'рџЋЁ NFT-HAUSTIER ERSTELLEN',
        ar: 'рџЋЁ ШҐЩ†ШґШ§ШЎ Ш­ЩЉЩ€Ш§Щ† NFT',
        vi: 'рџЋЁ Tбє O THГљ CЖЇNG NFT'
    },
    'mint_subtitle': {
        en: '5 TIERS | BONDING CURVE | FIXED BOOSTS',
        ru: '5 РЈР РћР’РќР•Р™ | РљР РР’РђРЇ РЎР’РЇР—Р | Р¤РРљРЎРР РћР’РђРќРќР«Р• Р‘РЈРЎРўР«',
        zh: '5дёЄз­‰зє§ | з»‘е®љж›Ізєї | е›єе®љеЉ ж€ђ',
        es: '5 NIVELES | CURVA DE VINCULACIГ“N | BOOSTS FIJOS',
        pt: '5 NГЌVEIS | CURVA DE VINCULAГ‡ГѓO | BOOSTS FIXOS',
        ja: '5гѓ†г‚Јг‚ў | гѓњгѓігѓ‡г‚Јгѓіг‚°г‚«гѓјгѓ– | е›єе®љгѓ–гѓјг‚№гѓ€',
        fr: '5 NIVEAUX | COURBE DE LIEN | BOOSTS FIXES',
        hi: '5 а¤ёаҐЌа¤¤а¤° | а¤¬аҐ‰а¤ЁаҐЌа¤Ўа¤їа¤‚а¤— а¤•а¤°аҐЌа¤µ | а¤«а¤їа¤•аҐЌа¤ёаҐЌа¤Ў а¤¬аҐ‚а¤ёаҐЌа¤џ',
        ko: '5л‹Ёкі„ | ліёл”© м»¤лёЊ | кі м • л¶ЂмЉ¤нЉё',
        tr: '5 SEVД°YE | BAДћLAMA EДћRД°SД° | SABД°T BOOSTLAR',
        de: '5 STUFEN | BINDUNGSKURVE | FESTE BOOSTS',
        ar: '5 Щ…ШіШЄЩ€ЩЉШ§ШЄ | Щ…Щ†Ш­Щ†Щ‰ Ш§Щ„Ш±ШЁШ· | Щ…Ш№ШІШІШ§ШЄ Ш«Ш§ШЁШЄШ©',
        vi: '5 Cбє¤P | ДђЖЇб»њNG CONG LIГЉN KбєѕT | TД‚NG CЖЇб»њNG Cб»ђ Дђб»ЉNH'
    },
    'get_test_sol': {
        en: 'рџљ° Get Test SOL',
        ru: 'рџљ° РџРѕР»СѓС‡РёС‚СЊ С‚РµСЃС‚РѕРІС‹Р№ SOL',
        zh: 'рџљ° иЋ·еЏ–жµ‹иЇ•SOL',
        es: 'рџљ° Obtener SOL de Prueba',
        pt: 'рџљ° Obter SOL de Teste',
        ja: 'рџљ° гѓ†г‚№гѓ€SOLг‚’еЏ–еѕ—',
        fr: 'рџљ° Obtenir du SOL de Test',
        hi: 'рџљ° а¤џаҐ‡а¤ёаҐЌа¤џ SOL а¤ЄаҐЌа¤°а¤ѕа¤ЄаҐЌа¤¤ а¤•а¤°аҐ‡а¤‚',
        ko: 'рџљ° н…ЊмЉ¤нЉё SOL л°›кё°',
        tr: 'рџљ° Test SOL Al',
        de: 'рџљ° Test-SOL erhalten',
        ar: 'рџљ° Ш§Ш­ШµЩ„ Ш№Щ„Щ‰ SOL Щ„Щ„Ш§Ш®ШЄШЁШ§Ш±',
        vi: 'рџљ° Nhбє­n SOL thб»­ nghiб»‡m'
    },
    'my_nfts': {
        en: 'рџ–јпёЏ MY NFTs',
        ru: 'рџ–јпёЏ РњРћР NFT',
        zh: 'рџ–јпёЏ ж€‘зљ„NFT',
        es: 'рџ–јпёЏ MIS NFTs',
        pt: 'рџ–јпёЏ MEUS NFTs',
        ja: 'рџ–јпёЏ з§ЃгЃ®NFT',
        fr: 'рџ–јпёЏ MES NFTs',
        hi: 'рџ–јпёЏ а¤®аҐ‡а¤°аҐ‡ NFT',
        ko: 'рџ–јпёЏ л‚ґ NFT',
        tr: 'рџ–јпёЏ NFT\'LERД°M',
        de: 'рџ–јпёЏ MEINE NFTs',
        ar: 'рџ–јпёЏ NFT Ш§Щ„Ш®Ш§ШµШ© ШЁЩЉ',
        vi: 'рџ–јпёЏ NFT Cб»¦A TГ”I'
    },
    'why_mint_nft': {
        en: 'рџ’Ћ WHY MINT NFT?',
        ru: 'рџ’Ћ Р—РђР§Р•Рњ РЎРћР—Р”РђР’РђРўР¬ NFT?',
        zh: 'рџ’Ћ дёєд»Ђд№€и¦Ѓй“ёйЂ NFT?',
        es: 'рџ’Ћ ВїPOR QUГ‰ CREAR NFT?',
        pt: 'рџ’Ћ POR QUE CRIAR NFT?',
        ja: 'рџ’Ћ гЃЄгЃњNFTг‚’дЅњж€ђгЃ™г‚‹гЃ®гЃ‹?',
        fr: 'рџ’Ћ POURQUOI CRГ‰ER UN NFT?',
        hi: 'рџ’Ћ NFT а¤•аҐЌа¤ЇаҐ‹а¤‚ а¤¬а¤Ёа¤ѕа¤Џа¤‚?',
        ko: 'рџ’Ћ NFTлҐј м™њ л°њн–‰н•л‚мљ”?',
        tr: 'рџ’Ћ NFT NEDEN OLUЕћTURULUR?',
        de: 'рџ’Ћ WARUM NFT ERSTELLEN?',
        ar: 'рџ’Ћ Щ„Щ…Ш§Ш°Ш§ ШҐЩ†ШґШ§ШЎ NFT?',
        vi: 'рџ’Ћ Tбє I SAO Tбє O NFT?'
    },
    'passive_income': {
        en: 'PASSIVE INCOME',
        ru: 'РџРђРЎРЎРР’РќР«Р™ Р”РћРҐРћР”',
        zh: 'иў«еЉЁж”¶е…Ґ',
        es: 'INGRESO PASIVO',
        pt: 'RENDA PASSIVA',
        ja: 'гѓ‘гѓѓг‚·гѓ–г‚¤гѓіг‚«гѓ ',
        fr: 'REVENU PASSIF',
        hi: 'а¤Ёа¤їа¤·аҐЌа¤•аҐЌа¤°а¤їа¤Ї а¤†а¤Ї',
        ko: 'м€лЏ™ м†Њл“ќ',
        tr: 'PASД°F GELД°R',
        de: 'PASSIVES EINKOMMEN',
        ar: 'ШЇШ®Щ„ ШіЩ„ШЁЩЉ',
        vi: 'THU NHбє¬P THб»¤ Дђб»NG'
    },
    'earning_boost': {
        en: 'EARNING BOOST',
        ru: 'РЈР’Р•Р›РР§Р•РќРР• Р—РђР РђР‘РћРўРљРђ',
        zh: 'ж”¶з›ЉеЉ ж€ђ',
        es: 'AUMENTO DE GANANCIAS',
        pt: 'AUMENTO DE GANHOS',
        ja: 'еЏЋз›Љгѓ–гѓјг‚№гѓ€',
        fr: 'AUGMENTATION DES GAINS',
        hi: 'а¤•а¤®а¤ѕа¤€ а¤¬аҐ‚а¤ёаҐЌа¤џ',
        ko: 'м€мќµ л¶ЂмЉ¤нЉё',
        tr: 'KAZANГ‡ ARTIЕћI',
        de: 'VERDIENST-BOOST',
        ar: 'ШІЩЉШ§ШЇШ© Ш§Щ„ШЈШ±ШЁШ§Ш­',
        vi: 'TД‚NG THU NHбє¬P'
    },
    'price_growth': {
        en: 'PRICE GROWTH',
        ru: 'Р РћРЎРў Р¦Р•РќР«',
        zh: 'д»·ж јдёЉж¶Ё',
        es: 'CRECIMIENTO DE PRECIO',
        pt: 'CRESCIMENTO DE PREГ‡O',
        ja: 'дѕЎж јдёЉж‡',
        fr: 'CROISSANCE DU PRIX',
        hi: 'а¤®аҐ‚а¤ІаҐЌа¤Ї а¤µаҐѓа¤¦аҐЌа¤§а¤ї',
        ko: 'к°ЂкІ© мѓЃмЉ№',
        tr: 'FД°YAT ARTIЕћI',
        de: 'PREISWACHSTUM',
        ar: 'Щ†Щ…Щ€ Ш§Щ„ШіШ№Ш±',
        vi: 'TД‚NG GIГЃ'
    },
    'real_on_chain': {
        en: 'REAL ON-CHAIN',
        ru: 'РќРђРЎРўРћРЇР©РР™ Р’ Р‘Р›РћРљР§Р•Р™РќР•',
        zh: 'зњџе®ћй“ѕдёЉ',
        es: 'REAL EN CADENA',
        pt: 'REAL NA CADEIA',
        ja: 'гѓЄг‚ўгѓ«г‚ЄгѓігѓЃг‚§гѓјгѓі',
        fr: 'RГ‰EL SUR LA CHAГЋNE',
        hi: 'а¤µа¤ѕа¤ёаҐЌа¤¤а¤µа¤їа¤• а¤‘а¤Ё-а¤љаҐ‡а¤Ё',
        ko: 'м‹¤м њ мЁмІґмќё',
        tr: 'GERГ‡EK ZД°NCД°R ГњZERД°',
        de: 'ECHT ON-CHAIN',
        ar: 'Ш­Щ‚ЩЉЩ‚ЩЉ Ш№Щ„Щ‰ Ш§Щ„ШіЩ„ШіЩ„Ш©',
        vi: 'THб»°C TRГЉN CHUб»–I'
    },
    'loading': {
        en: 'Loading...',
        ru: 'Р—Р°РіСЂСѓР·РєР°...',
        zh: 'еЉ иЅЅдё­...',
        es: 'Cargando...',
        pt: 'Carregando...',
        ja: 'иЄ­гЃїиѕјгЃїдё­...',
        fr: 'Chargement...',
        hi: 'а¤ІаҐ‹а¤Ў а¤№аҐ‹ а¤°а¤№а¤ѕ а¤№аҐ€...',
        ko: 'лЎњл”© м¤‘...',
        tr: 'YГјkleniyor...',
        de: 'LГ¤dt...',
        ar: 'Ш¬Ш§Ш±ЩЉ Ш§Щ„ШЄШ­Щ…ЩЉЩ„...',
        vi: 'Дђang tбєЈi...'
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

        // [cleaned]`);
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

    // 1. вњ… РџР РРћР РРўР•Рў #1: URL РїР°СЂР°РјРµС‚СЂ (СЃР°РјС‹Р№ РІС‹СЃРѕРєРёР№ РїСЂРёРѕСЂРёС‚РµС‚)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && SUPPORTED_LANGUAGES[urlLang]) {
        lang = urlLang;
        // РЎРѕС…СЂР°РЅРёС‚СЊ РІ localStorage РґР»СЏ Р±СѓРґСѓС‰РёС… РІРёР·РёС‚РѕРІ
        localStorage.setItem('gameLanguage', urlLang);
        // [cleaned]
    }
    // 2. Check localStorage
    else {
        const savedLang = localStorage.getItem('gameLanguage');
        if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
            lang = savedLang;
        }
        // 3. Check Telegram WebApp (only if no saved language)
        else if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
            const tgLang = window.Telegram.WebApp.initDataUnsafe.user.language_code;
            if (SUPPORTED_LANGUAGES[tgLang]) {
                lang = tgLang;
            }
        }
        // 4. Browser language - DISABLED: Always default to English
        // (Removed automatic browser language detection to keep English as default)
    }

    currentLanguage = lang;
    // [cleaned]

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
                <span class="lang-modal-title">рџЊЌ ${t('select_language')}</span>
                <button class="lang-modal-close" onclick="hideLanguageSelector()">вњ•</button>
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

