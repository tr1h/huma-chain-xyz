// 🎨 КОНФИГУРАЦИЯ СКИНОВ ДЛЯ SOLANA TAMAGOTCHI
// Здесь можно легко управлять всеми скинами: включать/выключать, менять цены, добавлять новые

const SKINS_CONFIG = {
    // ========== БЕСПЛАТНЫЙ (ПО УМОЛЧАНИЮ) ==========
    'kawai': {
        id: 'kawai',
        name: '🌸 Kawai Blob',
        nameRu: '🌸 Кавайный Шарик',
        price: 0,
        rarity: 'default',
        enabled: true,
        bonusEn: 'Your first pet!',
        bonusRu: 'Твой первый питомец!',
        rarityLabel: 'FREE',
        rarityLabelRu: 'БЕСПЛАТНО',
        svgId: 'kawai-pet',
        description: 'Cute pink blob with heart antenna',
        descriptionRu: 'Милый розовый шарик с сердечком'
    },

    // ========== COMMON СКИНЫ (1,000 TAMA) ==========
    'retro': {
        id: 'retro',
        name: '🕹️ Retro Robot',
        nameRu: '🕹️ Ретро Робот',
        price: 1000,
        rarity: 'common',
        enabled: true,
        bonusEn: '8-bit style!',
        bonusRu: 'Ретро 8-бит стиль!',
        rarityLabel: 'COMMON',
        rarityLabelRu: 'ОБЫЧНЫЙ',
        svgId: 'retro-pet',
        description: 'Green square robot with antenna',
        descriptionRu: 'Зеленый квадратный робот'
    },

    'cyber': {
        id: 'cyber',
        name: '🤖 Cyber Dog',
        nameRu: '🤖 Кибер Пёс',
        price: 1000,
        rarity: 'common',
        enabled: true,
        bonusEn: 'Cyber style!',
        bonusRu: 'Кибер-стиль!',
        rarityLabel: 'COMMON',
        rarityLabelRu: 'ОБЫЧНЫЙ',
        svgId: 'cyber-pet',
        description: 'Blue cyber dog with ears',
        descriptionRu: 'Синий кибер-пёс с ушками'
    },

    'panda': {
        id: 'panda',
        name: '🐼 Chill Panda',
        nameRu: '🐼 Панда Чилл',
        price: 1000,
        rarity: 'common',
        enabled: true,
        bonusEn: 'Relaxed vibes!',
        bonusRu: 'Расслабленный стиль!',
        rarityLabel: 'COMMON',
        rarityLabelRu: 'ОБЫЧНЫЙ',
        svgId: 'panda-pet',
        description: 'Black and white panda with bamboo',
        descriptionRu: 'Панда с бамбуком'
    },

    // ========== RARE СКИНЫ (5,000 TAMA) ==========
    'ghost': {
        id: 'ghost',
        name: '👻 Ghost Pet',
        nameRu: '👻 Призрак',
        price: 5000,
        rarity: 'rare',
        enabled: true,
        bonusEn: 'Ghostly abilities!',
        bonusRu: 'Призрачные способности!',
        rarityLabel: 'RARE',
        rarityLabelRu: 'РЕДКИЙ',
        svgId: 'ghost-pet',
        description: 'Floating ghost with wavy tail',
        descriptionRu: 'Летающий призрак'
    },

    'alien': {
        id: 'alien',
        name: '👽 Alien Pet',
        nameRu: '👽 Инопланетянин',
        price: 5000,
        rarity: 'rare',
        enabled: true,
        bonusEn: 'Cosmic bonus!',
        bonusRu: 'Космический бонус!',
        rarityLabel: 'RARE',
        rarityLabelRu: 'РЕДКИЙ',
        svgId: 'alien-pet',
        description: 'Green alien with antennae',
        descriptionRu: 'Зеленый инопланетянин'
    },

    'ice-fox': {
        id: 'ice-fox',
        name: '❄️ Ice Fox',
        nameRu: '❄️ Ледяная Лиса',
        price: 5000,
        rarity: 'rare',
        enabled: true,
        bonusEn: '+10% Food efficiency',
        bonusRu: '+10% эффективность еды',
        rarityLabel: 'RARE',
        rarityLabelRu: 'РЕДКИЙ',
        svgId: 'ice-fox-pet',
        description: 'White fox with snowflakes',
        descriptionRu: 'Белая лиса со снежинками'
    },

    'love': {
        id: 'love',
        name: '💕 Love Pet',
        nameRu: '💕 Влюбленный',
        price: 5000,
        rarity: 'rare',
        enabled: true,
        bonusEn: '+15% Happy gain!',
        bonusRu: '+15% счастье!',
        rarityLabel: 'RARE',
        rarityLabelRu: 'РЕДКИЙ',
        svgId: 'love-pet',
        description: 'Heart-shaped pet with love',
        descriptionRu: 'Питомец в форме сердца'
    },

    'gingerbread': {
        id: 'gingerbread',
        name: '🍪 Gingerbread Pet',
        nameRu: '🍪 Пряничный',
        price: 6000,
        rarity: 'rare',
        enabled: true,
        bonusEn: '+20% Food efficiency',
        bonusRu: '+20% эффективность еды',
        rarityLabel: 'RARE',
        rarityLabelRu: 'РЕДКИЙ',
        svgId: 'gingerbread-pet',
        description: 'Gingerbread cookie with icing',
        descriptionRu: 'Пряник с глазурью'
    },

    // ========== EPIC СКИНЫ (15,000 TAMA) ==========
    'fire-cat': {
        id: 'fire-cat',
        name: '🔥 Fire Cat',
        nameRu: '🔥 Огненный Кот',
        price: 15000,
        rarity: 'epic',
        enabled: true,
        bonusEn: '+15% TAMA from games',
        bonusRu: '+15% TAMA от игр',
        rarityLabel: 'EPIC',
        rarityLabelRu: 'ЭПИЧЕСКИЙ',
        svgId: 'fire-cat-pet',
        description: 'Fiery cat with flames',
        descriptionRu: 'Огненный кот с пламенем'
    },

    'gold-dragon': {
        id: 'gold-dragon',
        name: '🐉 Gold Dragon',
        nameRu: '🐉 Золотой Дракон',
        price: 15000,
        rarity: 'epic',
        enabled: true,
        bonusEn: '+20% TAMA + +15% XP',
        bonusRu: '+20% TAMA + +15% опыт',
        rarityLabel: 'EPIC',
        rarityLabelRu: 'ЭПИЧЕСКИЙ',
        svgId: 'gold-dragon-pet',
        description: 'Golden dragon with sparkles',
        descriptionRu: 'Золотой дракон'
    },

    'rainbow-unicorn': {
        id: 'rainbow-unicorn',
        name: '🦄 Rainbow Unicorn',
        nameRu: '🦄 Радужный Единорог',
        price: 15000,
        rarity: 'epic',
        enabled: true,
        bonusEn: '+25% all rewards!',
        bonusRu: '+25% всех наград!',
        rarityLabel: 'EPIC',
        rarityLabelRu: 'ЭПИЧЕСКИЙ',
        svgId: 'rainbow-unicorn-pet',
        description: 'Rainbow unicorn with horn',
        descriptionRu: 'Радужный единорог'
    },

    'ninja-cat': {
        id: 'ninja-cat',
        name: '🥷 Ninja Cat',
        nameRu: '🥷 Ниндзя Кот',
        price: 15000,
        rarity: 'epic',
        enabled: true,
        bonusEn: '+20% speed + invisibility!',
        bonusRu: '+20% скорость + невидимость!',
        rarityLabel: 'EPIC',
        rarityLabelRu: 'ЭПИЧЕСКИЙ',
        svgId: 'ninja-cat-pet',
        description: 'Ninja cat with mask',
        descriptionRu: 'Кот-ниндзя'
    },

    'lightning': {
        id: 'lightning',
        name: '⚡ Lightning Pet',
        nameRu: '⚡ Электрический',
        price: 15000,
        rarity: 'epic',
        enabled: true,
        bonusEn: '+30% click speed!',
        bonusRu: '+30% скорость кликов!',
        rarityLabel: 'EPIC',
        rarityLabelRu: 'ЭПИЧЕСКИЙ',
        svgId: 'lightning-pet',
        description: 'Electric pet with lightning',
        descriptionRu: 'Электрический питомец'
    },

    'elf': {
        id: 'elf',
        name: '🧝 Elf Pet',
        nameRu: '🧝 Эльф',
        price: 12000,
        rarity: 'epic',
        enabled: true,
        bonusEn: '+25% crafting speed',
        bonusRu: '+25% скорость крафта',
        rarityLabel: 'EPIC',
        rarityLabelRu: 'ЭПИЧЕСКИЙ',
        svgId: 'elf-pet',
        description: 'Christmas elf with hat',
        descriptionRu: 'Рождественский эльф'
    },

    // ========== LEGENDARY СКИНЫ (50,000+ TAMA) ==========
    'angel': {
        id: 'angel',
        name: '👼 Angel Pet',
        nameRu: '👼 Ангел',
        price: 50000,
        rarity: 'legendary',
        enabled: true,
        bonusEn: '+50% TAMA + healing!',
        bonusRu: '+50% TAMA + лечение!',
        rarityLabel: 'LEGENDARY',
        rarityLabelRu: 'ЛЕГЕНДАРНЫЙ',
        svgId: 'angel-pet',
        description: 'Divine angel with wings',
        descriptionRu: 'Божественный ангел'
    },

    'demon': {
        id: 'demon',
        name: '😈 Demon Pet',
        nameRu: '😈 Демон',
        price: 50000,
        rarity: 'legendary',
        enabled: true,
        bonusEn: '+75% TAMA at night!',
        bonusRu: '+75% TAMA ночью!',
        rarityLabel: 'LEGENDARY',
        rarityLabelRu: 'ЛЕГЕНДАРНЫЙ',
        svgId: 'demon-pet',
        description: 'Evil demon with horns',
        descriptionRu: 'Злой демон с рогами'
    },

    'cosmic': {
        id: 'cosmic',
        name: '🌌 Cosmic Pet',
        nameRu: '🌌 Космический',
        price: 50000,
        rarity: 'legendary',
        enabled: true,
        bonusEn: '+100% TAMA + cosmic bonuses!',
        bonusRu: '+100% TAMA + космические бонусы!',
        rarityLabel: 'LEGENDARY',
        rarityLabelRu: 'ЛЕГЕНДАРНЫЙ',
        svgId: 'cosmic-pet',
        description: 'Galaxy pet with stars',
        descriptionRu: 'Галактический питомец'
    },

    'platinum-dragon': {
        id: 'platinum-dragon',
        name: '🐉 Platinum Dragon',
        nameRu: '🐉 Платиновый Дракон',
        price: 60000,
        rarity: 'legendary',
        enabled: true,
        bonusEn: '+100% TAMA + flies + fire breath!',
        bonusRu: '+100% TAMA + полет + огненное дыхание!',
        rarityLabel: 'LEGENDARY',
        rarityLabelRu: 'ЛЕГЕНДАРНЫЙ',
        svgId: 'platinum-dragon-pet',
        description: 'Platinum dragon with wings',
        descriptionRu: 'Платиновый дракон'
    },

    'divine-angel': {
        id: 'divine-angel',
        name: '👼 Divine Angel',
        nameRu: '👼 Божественный Ангел',
        price: 80000,
        rarity: 'legendary',
        enabled: true,
        bonusEn: '+80% TAMA + auto-heal + blessing!',
        bonusRu: '+80% TAMA + автолечение + благословение!',
        rarityLabel: 'LEGENDARY',
        rarityLabelRu: 'ЛЕГЕНДАРНЫЙ',
        svgId: 'divine-angel-pet',
        description: 'Divine angel with halo',
        descriptionRu: 'Божественный ангел с нимбом'
    },

    // ========== НОВОГОДНИЕ (LIMITED TIME) ==========
    'santa': {
        id: 'santa',
        name: '🎅 Santa Pet',
        nameRu: '🎅 Санта',
        price: 10000,
        rarity: 'xmas',
        enabled: true,
        bonusEn: '+50% TAMA Dec 24-31',
        bonusRu: '+50% TAMA 24-31 декабря',
        rarityLabel: 'XMAS LIMITED',
        rarityLabelRu: 'НОВОГОДНИЙ',
        svgId: 'santa-pet',
        description: 'Santa Claus with gifts',
        descriptionRu: 'Санта Клаус с подарками',
        limitedTime: {
            startMonth: 12,
            startDay: 1,
            endMonth: 12,
            endDay: 31
        }
    },

    'snowman': {
        id: 'snowman',
        name: '⛄ Snowman Pet',
        nameRu: '⛄ Снеговик',
        price: 8000,
        rarity: 'xmas',
        enabled: true,
        bonusEn: 'Immune to cold!',
        bonusRu: 'Неуязвим к холоду!',
        rarityLabel: 'XMAS LIMITED',
        rarityLabelRu: 'НОВОГОДНИЙ',
        svgId: 'snowman-pet',
        description: 'Snowman with top hat',
        descriptionRu: 'Снеговик в шляпе',
        limitedTime: {
            startMonth: 12,
            startDay: 1,
            endMonth: 1,
            endDay: 15
        }
    },

    'reindeer': {
        id: 'reindeer',
        name: '🦌 Reindeer Pet',
        nameRu: '🦌 Олень',
        price: 12000,
        rarity: 'xmas',
        enabled: true,
        bonusEn: '+30% speed + glows!',
        bonusRu: '+30% скорость + светится!',
        rarityLabel: 'XMAS LIMITED',
        rarityLabelRu: 'НОВОГОДНИЙ',
        svgId: 'reindeer-pet',
        description: 'Rudolph with red nose',
        descriptionRu: 'Рудольф с красным носом',
        limitedTime: {
            startMonth: 12,
            startDay: 1,
            endMonth: 12,
            endDay: 31
        }
    },

    'tree': {
        id: 'tree',
        name: '🎄 Christmas Tree',
        nameRu: '🎄 Ёлка',
        price: 15000,
        rarity: 'xmas',
        enabled: true,
        bonusEn: '+40% TAMA + hourly gifts!',
        bonusRu: '+40% TAMA + подарки каждый час!',
        rarityLabel: 'XMAS LIMITED',
        rarityLabelRu: 'НОВОГОДНИЙ',
        svgId: 'tree-pet',
        description: 'Christmas tree with ornaments',
        descriptionRu: 'Новогодняя ёлка',
        limitedTime: {
            startMonth: 12,
            startDay: 1,
            endMonth: 1,
            endDay: 7
        }
    }
};

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

// Получить все включенные скины
function getEnabledSkins() {
    return Object.values(SKINS_CONFIG).filter(skin => skin.enabled);
}

// Получить скины по редкости
function getSkinsByRarity(rarity) {
    return Object.values(SKINS_CONFIG).filter(skin =>
        skin.enabled && skin.rarity === rarity
    );
}

// Проверить доступность лимитированного скина
function isSkinAvailable(skinId) {
    const skin = SKINS_CONFIG[skinId];
    if (!skin || !skin.enabled) return false;

    if (skin.limitedTime) {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();

        const { startMonth, startDay, endMonth, endDay } = skin.limitedTime;

        // Простая проверка диапазона
        if (startMonth === endMonth) {
            // В пределах одного месяца
            return currentMonth === startMonth &&
                   currentDay >= startDay &&
                   currentDay <= endDay;
        } else {
            // Переход через месяцы
            return (currentMonth === startMonth && currentDay >= startDay) ||
                   (currentMonth === endMonth && currentDay <= endDay);
        }
    }

    return true;
}

// Получить скин по ID
function getSkin(skinId) {
    return SKINS_CONFIG[skinId];
}

// Получить цену скина
function getSkinPrice(skinId) {
    const skin = SKINS_CONFIG[skinId];
    return skin ? skin.price : 0;
}

// Изменить цену скина (для админа)
function setSkinPrice(skinId, newPrice) {
    if (SKINS_CONFIG[skinId]) {
        SKINS_CONFIG[skinId].price = newPrice;
        return true;
    }
    return false;
}

// Включить/выключить скин (для админа)
function toggleSkin(skinId, enabled) {
    if (SKINS_CONFIG[skinId]) {
        SKINS_CONFIG[skinId].enabled = enabled;
        return true;
    }
    return false;
}

// Получить статистику скинов
function getSkinsStats() {
    const skins = Object.values(SKINS_CONFIG);
    return {
        total: skins.length,
        enabled: skins.filter(s => s.enabled).length,
        disabled: skins.filter(s => !s.enabled).length,
        byRarity: {
            default: skins.filter(s => s.rarity === 'default').length,
            common: skins.filter(s => s.rarity === 'common').length,
            rare: skins.filter(s => s.rarity === 'rare').length,
            epic: skins.filter(s => s.rarity === 'epic').length,
            legendary: skins.filter(s => s.rarity === 'legendary').length,
            xmas: skins.filter(s => s.rarity === 'xmas').length
        }
    };
}

// Экспорт для использования в Node.js (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SKINS_CONFIG,
        getEnabledSkins,
        getSkinsByRarity,
        isSkinAvailable,
        getSkin,
        getSkinPrice,
        setSkinPrice,
        toggleSkin,
        getSkinsStats
    };
}



