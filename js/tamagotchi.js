    <script>
        // вљ пёЏ IMMEDIATE DEBUG LOG - This should appear FIRST
        // [cleaned]
        // [cleaned].toISOString());

        // ========== SKINS CONFIGURATION (INLINE) ==========
        const SKINS_CONFIG = {
            'kawai': {
                id: 'kawai',
                name: 'рџЊё Kawai Blob',
                nameRu: 'рџЊё РљР°РІР°Р№РЅС‹Р№',
                price: 0,
                rarity: 'default',
                enabled: true,
                bonusEn: 'Your first pet!',
                bonusRu: 'РўРІРѕР№ РїРµСЂРІС‹Р№ РїРёС‚РѕРјРµС†!',
                rarityLabel: 'FREE',
                rarityLabelRu: 'Р‘Р•РЎРџР›РђРўРќРћ'
            },
            'retro': {
                id: 'retro',
                name: 'рџ•№пёЏ Retro Robot',
                nameRu: 'рџ•№пёЏ Р РµС‚СЂРѕ Р РѕР±РѕС‚',
                price: 1000,
                rarity: 'common',
                enabled: true,
                bonusEn: 'Retro 8-bit style',
                bonusRu: '8-bit СЃС‚РёР»СЊ!',
                rarityLabel: 'COMMON',
                rarityLabelRu: 'РћР‘Р«Р§РќР«Р™'
            },
            'neko': {
                id: 'neko',
                name: 'рџђ± Neko Cat',
                nameRu: 'рџђ± РќРµРєРѕ РљРѕС‚',
                price: 5000,
                rarity: 'rare',
                enabled: true,
                bonusEn: '+10% TAMA from games',
                bonusRu: '+10% TAMA РѕС‚ РёРіСЂ',
                rarityLabel: 'RARE',
                rarityLabelRu: 'Р Р•Р”РљРР™'
            },
            'cyber': {
                id: 'cyber',
                name: 'рџ¤– Cyber Pet',
                nameRu: 'рџ¤– РљРёР±РµСЂ РџРёС‚РѕРјРµС†',
                price: 15000,
                rarity: 'epic',
                enabled: true,
                bonusEn: '+20% TAMA from games',
                bonusRu: '+20% TAMA РѕС‚ РёРіСЂ',
                rarityLabel: 'EPIC',
                rarityLabelRu: 'Р­РџРР§Р•РЎРљРР™'
            },
            'premium': {
                id: 'premium',
                name: 'в­ђ Premium Pet',
                nameRu: 'в­ђ РџСЂРµРјРёСѓРј РџРёС‚РѕРјРµС†',
                price: 25000,
                rarity: 'legendary',
                enabled: true,
                bonusEn: '+30% TAMA from games',
                bonusRu: '+30% TAMA РѕС‚ РёРіСЂ',
                rarityLabel: 'LEGENDARY',
                rarityLabelRu: 'Р›Р•Р“Р•РќР”РђР РќР«Р™'
            },
            'alien': {
                id: 'alien',
                name: 'рџ‘Ѕ Alien',
                nameRu: 'рџ‘Ѕ РРЅРѕРїР»Р°РЅРµС‚СЏРЅРёРЅ',
                price: 50000,
                rarity: 'legendary',
                enabled: true,
                bonusEn: '+50% TAMA from games',
                bonusRu: '+50% TAMA РѕС‚ РёРіСЂ',
                rarityLabel: 'LEGENDARY',
                rarityLabelRu: 'Р›Р•Р“Р•РќР”РђР РќР«Р™'
            },
            'kitsune': {
                id: 'kitsune',
                name: 'рџ¦Љ Kitsune Fox',
                nameRu: 'рџ¦Љ Р›РёСЃР° РљРёС‚СЃСѓРЅРµ',
                price: 100000,
                rarity: 'mythic',
                enabled: true,
                bonusEn: '+100% TAMA from games',
                bonusRu: '+100% TAMA РѕС‚ РёРіСЂ',
                rarityLabel: 'MYTHIC',
                rarityLabelRu: 'РњРР¤РР§Р•РЎРљРР™'
            },
            'santa': {
                id: 'santa',
                name: 'рџЋ… Santa Pet',
                nameRu: 'рџЋ… РЎР°РЅС‚Р°',
                price: 10000,
                rarity: 'xmas',
                enabled: true,
                bonusEn: '+50% TAMA Dec 24-31',
                bonusRu: '+50% TAMA 24-31 РґРµРєР°Р±СЂСЏ',
                rarityLabel: 'XMAS LIMITED',
                rarityLabelRu: 'РќРћР’РћР“РћР”РќРР™',
                limitedTime: { startMonth: 12, startDay: 1, endMonth: 12, endDay: 31 }
            },
            'snowman': {
                id: 'snowman',
                name: 'в›„ Snowman Pet',
                nameRu: 'в›„ РЎРЅРµРіРѕРІРёРє',
                price: 8000,
                rarity: 'xmas',
                enabled: true,
                bonusEn: 'Immune to cold!',
                bonusRu: 'РќРµСѓСЏР·РІРёРј Рє С…РѕР»РѕРґСѓ!',
                rarityLabel: 'XMAS LIMITED',
                rarityLabelRu: 'РќРћР’РћР“РћР”РќРР™',
                limitedTime: { startMonth: 12, startDay: 1, endMonth: 1, endDay: 15 }
            },
            'reindeer': {
                id: 'reindeer',
                name: 'рџ¦Њ Reindeer Pet',
                nameRu: 'рџ¦Њ РћР»РµРЅСЊ Р СѓРґРѕР»СЊС„',
                price: 12000,
                rarity: 'xmas',
                enabled: true,
                bonusEn: '+30% speed + glows!',
                bonusRu: '+30% СЃРєРѕСЂРѕСЃС‚СЊ + СЃРІРµС‚РёС‚СЃСЏ!',
                rarityLabel: 'XMAS LIMITED',
                rarityLabelRu: 'РќРћР’РћР“РћР”РќРР™',
                limitedTime: { startMonth: 12, startDay: 1, endMonth: 12, endDay: 31 }
            },
            'tree': {
                id: 'tree',
                name: 'рџЋ„ Christmas Tree',
                nameRu: 'рџЋ„ РЃР»РєР°',
                price: 15000,
                rarity: 'xmas',
                enabled: true,
                bonusEn: '+40% TAMA + hourly gifts!',
                bonusRu: '+40% TAMA + РїРѕРґР°СЂРєРё РєР°Р¶РґС‹Р№ С‡Р°СЃ!',
                rarityLabel: 'XMAS LIMITED',
                rarityLabelRu: 'РќРћР’РћР“РћР”РќРР™',
                limitedTime: { startMonth: 12, startDay: 1, endMonth: 1, endDay: 7 }
            }
        };

        // Helper functions
        function getEnabledSkins() {
            return Object.values(SKINS_CONFIG).filter(skin => skin.enabled);
        }

        function getSkin(skinId) {
            return SKINS_CONFIG[skinId];
        }

        function getSkinPrice(skinId) {
            const skin = SKINS_CONFIG[skinId];
            return skin ? skin.price : 0;
        }

        function isSkinAvailable(skinId) {
            const skin = SKINS_CONFIG[skinId];
            if (!skin || !skin.enabled) return false;

            if (skin.limitedTime) {
                const now = new Date();
                const currentMonth = now.getMonth() + 1;
                const currentDay = now.getDate();
                const { startMonth, startDay, endMonth, endDay } = skin.limitedTime;

                if (startMonth === endMonth) {
                    return currentMonth === startMonth && currentDay >= startDay && currentDay <= endDay;
                } else {
                    return (currentMonth === startMonth && currentDay >= startDay) ||
                           (currentMonth === endMonth && currentDay <= endDay);
                }
            }
            return true;
        }

        // [cleaned].length);

        // рџ”’ Utility function to escape HTML and prevent XSS
        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = String(text);
            return div.innerHTML;
        }

        // рџђѕ CRITICAL: Initialize pet display IMMEDIATELY (before DOMContentLoaded)
        // This ensures pet is visible from the start, even if initPetSelector() runs later
        (function() {
            try {
                const savedPet = localStorage.getItem('tamagotchi-pet') || 'kawai';
                if (document.body && !document.body.getAttribute('data-pet')) {
                    document.body.setAttribute('data-pet', savedPet);
                    // [cleaned]
                } else if (!document.body) {
                    // If body not ready, set it when DOM is ready
                    document.addEventListener('DOMContentLoaded', function() {
                        const savedPet = localStorage.getItem('tamagotchi-pet') || 'kawai';
                        if (!document.body.getAttribute('data-pet')) {
                            document.body.setAttribute('data-pet', savedPet);
                            // [cleaned] - data-pet set to:', savedPet);
                        }
                    });
                }
            } catch (e) {
                console.warn('вљ пёЏ Early pet initialization failed:', e);
            }
        })();

        // Pet Types with unique characteristics
        const PET_TYPES = {
            cat: {
                name: 'Cat',
                emoji: 'рџђ±',
                color: '#FFB3D9',
                clickPower: 1.2,
                description: '+20% click power',
                price: 0
            },
            dog: {
                name: 'Dog',
                emoji: 'рџђ¶',
                color: '#C4A77D',
                hpBonus: 20,
                description: '+20 max HP',
                price: 1000
            },
            bunny: {
                name: 'Bunny',
                emoji: 'рџђ°',
                color: '#FFE5CC',
                happyBonus: 20,
                description: '+20 max Happy',
                price: 1500
            },
            fox: {
                name: 'Fox',
                emoji: 'рџ¦Љ',
                color: '#FF8C42',
                xpBonus: 1.5,
                description: '+50% XP gain',
                price: 2000
            },
            panda: {
                name: 'Panda',
                emoji: 'рџђј',
                color: '#B8D8BE',
                foodBonus: 30,
                description: '+30 max Food',
                price: 2500
            }
        };

        // Game State
        const gameState = {
            level: 1,
            xp: 0,
            xpToLevel: 100,
            tama: 0,
            hp: 100,
            maxHp: 100,
            food: 100,
            maxFood: 100,
            happy: 100,
            maxHappy: 100,
            clickPower: 1,
            lastUpdate: Date.now(),
            petType: 'cat', // Starting pet type
            selectedPet: 'cat',
            ownedPets: ['cat'], // Pets player owns
            totalClicks: 0,
            // NEW: Combo system
            combo: 0,
            lastClickTime: 0,
            maxCombo: 0,
            // NEW: Quests
            questClicks: 0,
            questClicksCompleted: false,
            questLevelCompleted: false,
            // NEW: Achievements
            achievements: [],
            // NEW: Shop items
            hasAutoFeeder: false,
            boosterActive: false,
            boosterEndTime: 0,
            // NEW: Evolution
            evolutionStage: 0, // 0-4 stages
            // NEW: Daily Pool / Halving System вЏ°
            dailyEarned: 0,              // TAMA earned today
            lastResetDate: null,          // Last date when daily limit reset
            personalDailyLimit: 999999999     // Personal daily earning limit (removed - unlimited)
        };

        // Auto-save variables
        let lastSaveTime = 0;
        const SAVE_COOLDOWN = 3000; // 3 seconds minimum between saves (reduced for faster saves)
        const CRITICAL_SAVE_COOLDOWN = 1000; // 1 second for critical changes (tama, clicks)
        let lastSavedState = null; // Track last saved state to avoid unnecessary saves
        let pendingCriticalSave = false; // Flag for critical changes that need immediate save

        // вЏ° HALVING SYSTEM - Daily Pool Calculation
        const LAUNCH_DATE = new Date('2025-11-01T00:00:00Z'); // Project launch date (UTC)
        const HALVING_PERIODS = [
            { days: 180, pool: 400000000, name: 'Year 1 H1' },  // 400M / 180 days = 2,222,222 per day
            { days: 180, pool: 200000000, name: 'Year 1 H2' },  // 200M / 180 days = 1,111,111 per day
            { days: 180, pool: 100000000, name: 'Year 2 H1' },  // 100M / 180 days = 555,555 per day
            { days: 180, pool: 50000000,  name: 'Year 2 H2' },  // 50M / 180 days = 277,777 per day
            { days: 180, pool: 25000000,  name: 'Year 3 H1' },  // 25M / 180 days = 138,888 per day
            { days: 180, pool: 12500000,  name: 'Year 3 H2' }   // 12.5M / 180 days = 69,444 per day
        ];

        // Calculate current Daily Pool based on date and halving
        function getCurrentDailyPool() {
            const now = new Date();
            const daysSinceLaunch = Math.floor((now - LAUNCH_DATE) / (1000 * 60 * 60 * 24));

            let daysAccumulated = 0;
            for (let period of HALVING_PERIODS) {
                if (daysSinceLaunch < daysAccumulated + period.days) {
                    // We're in this period
                    const dailyPool = Math.floor(period.pool / period.days);
                    const dayInPeriod = daysSinceLaunch - daysAccumulated;
                    return {
                        dailyPool: dailyPool,
                        periodName: period.name,
                        dayInPeriod: dayInPeriod,
                        daysLeftInPeriod: period.days - dayInPeriod
                    };
                }
                daysAccumulated += period.days;
            }

            // After all periods end
            return {
                dailyPool: 0,
                periodName: 'Mining Ended',
                dayInPeriod: 0,
                daysLeftInPeriod: 0
            };
        }

        // Check if daily limit should reset (new day in UTC)
        function checkDailyReset() {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC

            if (gameState.lastResetDate !== today) {
                // [cleaned]
                gameState.dailyEarned = 0;
                gameState.lastResetDate = today;

                // Update personal daily limit based on current halving period
                const poolInfo = getCurrentDailyPool();
                gameState.personalDailyLimit = poolInfo.dailyPool; // Use full daily pool (no personal cap)

                // [cleaned]
                // [cleaned]

                // Update UI
                updateDailyEarnedUI();
            }
        }

        // Update Daily Earned UI
        function updateDailyEarnedUI() {
            const dailyEarnedDisplay = document.getElementById('daily-earned-display');
            if (dailyEarnedDisplay) {
                const percentage = (gameState.dailyEarned / gameState.personalDailyLimit) * 100;
                dailyEarnedDisplay.textContent = `${formatNumber(gameState.dailyEarned)} / ${formatNumber(gameState.personalDailyLimit)}`;

                const progressBar = document.getElementById('daily-earned-progress');
                if (progressBar) {
                    progressBar.style.width = Math.min(percentage, 100) + '%';
                    // Change color based on percentage
                    if (percentage >= 100) {
                        progressBar.style.background = '#EF4444'; // Red - limit reached
                    } else if (percentage >= 80) {
                        progressBar.style.background = '#F59E0B'; // Orange - warning
                    } else {
                        progressBar.style.background = '#10B981'; // Green - good
                    }
                }
            }
        }

        // Degradation system вљ–пёЏ
        let lastDegradationTime = Date.now();
        const DEGRADATION_INTERVAL = 30000; // 30 seconds
        const DEGRADATION_RATES = {
            hp: 1,      // 1% per 30 sec
            food: 2,    // 2% per 30 sec
            happy: 1.5  // 1.5% per 30 sec
        };

        // Fatigue system вљЎ
        let clicksInWindow = 0;
        let lastClickWindowReset = Date.now();
        const CLICK_WINDOW = 60000; // 1 minute
        const MAX_CLICKS_PER_WINDOW = 50;
        let clickEfficiency = 1.0; // 1.0 = normal, 0.5 = fatigued
        let isProcessingClick = false; // Prevent double-click processing
        let lastClickProcessTime = 0;
        const MIN_CLICK_INTERVAL = 100; // Minimum 100ms between clicks

        // Pet evolution stages (based on level)
        const EVOLUTION_STAGES = [
            { minLevel: 1, name: 'Egg', prefix: 'рџҐљ', sizeMultiplier: 0.7 },
            { minLevel: 5, name: 'Baby', prefix: 'рџ‘¶', sizeMultiplier: 0.85 },
            { minLevel: 15, name: 'Teen', prefix: 'рџЊџ', sizeMultiplier: 1.0 },
            { minLevel: 30, name: 'Adult', prefix: 'в­ђ', sizeMultiplier: 1.15 },
            { minLevel: 50, name: 'Legend', prefix: 'рџ‘‘', sizeMultiplier: 1.3 }
        ];

        function getEvolutionStage(level) {
            for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
                if (level >= EVOLUTION_STAGES[i].minLevel) {
                    return EVOLUTION_STAGES[i];
                }
            }
            return EVOLUTION_STAGES[0];
        }

        // DOM Elements - will be initialized after DOM loads
        let petSprite, petArea, levelDisplay, tamaDisplay, rankDisplay, messageDiv, feedBtn, playBtn, healBtn;

        // Early logging to verify script is loading
        // [cleaned]
        // [cleaned].toISOString());

        // Save button removed - using auto-save instead

        // Update UI
        // Format number with spaces as thousand separators
        function formatNumber(num) {
            return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }

        function updateUI() {
            try {
                // Check if elements exist
                if (!levelDisplay || !tamaDisplay) {
                    console.warn('updateUI: Critical elements not found');
                    return;
                }

            // Header
            levelDisplay.textContent = `Lvl ${gameState.level}`;
            tamaDisplay.textContent = formatNumber(gameState.tama);

            // Stats
            updateStat('hp', gameState.hp, gameState.maxHp);
            updateStat('food', gameState.food, gameState.maxFood);
            updateStat('happy', gameState.happy, gameState.maxHappy);
            updateStat('xp', gameState.xp, gameState.xpToLevel);

            // Pet evolution
            updatePetEvolution();

            // NEW: Update pet status and mood
            updatePetStatus();

            // вљ–пёЏ Apply degradation
            degradeStats();

            // рџ’° Update progressive prices
            updateActionPrices();

            // Button states (updated with progressive prices)
            const feedCost = getProgressivePrice(50);
            const playCost = getProgressivePrice(30);
            const healCost = getProgressivePrice(100);

                if (feedBtn) feedBtn.disabled = gameState.tama < feedCost;
                if (playBtn) playBtn.disabled = gameState.tama < playCost;
                if (healBtn) healBtn.disabled = gameState.tama < healCost;
            } catch (error) {
                console.error('Error in updateUI:', error);
            }

            // вњ… Update player name display (in case customUsername changed)
            if (typeof updatePlayerNameDisplay === 'function') {
                updatePlayerNameDisplay();
            }
        }

        // NEW: Update pet status and mood indicators
        function updatePetStatus() {
            const petStatus = document.getElementById('pet-status');
            const petMood = document.getElementById('pet-mood');

            // Determine overall pet condition
            let status = '';
            let statusClass = '';
            let mood = 'рџЉ';

            if (gameState.hp <= 0) {
                status = 'рџ’Ђ FAINTED';
                statusClass = 'critical';
                mood = 'рџ’Ђ';
            } else if (gameState.hp < 10) {
                status = 'рџљЁ DYING';
                statusClass = 'critical';
                mood = 'рџµ';
            } else if (gameState.hp < 20) {
                status = 'вљ пёЏ CRITICAL';
                statusClass = 'critical';
                mood = 'рџ°';
            } else if (gameState.food <= 0) {
                status = 'рџЌЅпёЏ STARVING';
                statusClass = 'critical';
                mood = 'рџµ';
            } else if (gameState.food < 10) {
                status = 'вљ пёЏ VERY HUNGRY';
                statusClass = 'warning';
                mood = 'рџ«';
            } else if (gameState.food < 20) {
                status = 'рџЌЅпёЏ HUNGRY';
                statusClass = 'warning';
                mood = 'рџ‹';
            } else if (gameState.happy <= 0) {
                status = 'рџў DEPRESSED';
                statusClass = 'warning';
                mood = 'рџў';
            } else if (gameState.happy < 20) {
                status = 'рџў VERY SAD';
                statusClass = 'warning';
                mood = 'рџў';
            } else if (gameState.happy < 30) {
                status = 'рџў SAD';
                statusClass = 'warning';
                mood = 'рџ”';
            } else if (gameState.hp > 80 && gameState.food > 80 && gameState.happy > 80) {
                status = 'вњЁ PERFECT';
                statusClass = 'good';
                mood = 'рџЌ';
            } else if (gameState.hp > 60 && gameState.food > 60 && gameState.happy > 60) {
                status = 'рџЉ HAPPY';
                statusClass = 'good';
                mood = 'рџЉ';
            } else if (gameState.totalClicks > 100) {
                status = 'рџІ SURPRISED';
                statusClass = 'good';
                mood = 'рџІ';
            } else if (gameState.combo > 10) {
                status = 'рџЎ ANGRY';
                statusClass = 'warning';
                mood = 'рџЎ';
            } else if (gameState.level > 5) {
                status = 'рџҐ° LOVING';
                statusClass = 'good';
                mood = 'рџҐ°';
            } else {
                status = 'рџђ OK';
                statusClass = 'good';
                mood = 'рџђ';
            }

            // Update status display
            if (statusClass === 'critical' || statusClass === 'warning') {
                petStatus.textContent = status;
                petStatus.className = `pet-status ${statusClass}`;
                petStatus.style.display = 'block';
            } else {
                petStatus.style.display = 'none';
            }

            // Update mood
            petMood.textContent = mood;

            // Update vector pet emotions
            updateVectorPetEmotion(mood);
        }

        function updateVectorPetEmotion(mood) {
            const vectorPet = document.getElementById('vector-pet');
            if (!vectorPet) return;

            // Remove previous emotion classes
            vectorPet.classList.remove('happy', 'sad', 'sleepy', 'excited', 'angry', 'surprised', 'love');

            // Update mouth shape based on mood (BLOB coordinates)
            const mouthPath = vectorPet.querySelector('#mouth-path');
            if (mouthPath) {
                switch(mood) {
                    case 'рџЉ':
                    case 'рџЌ':
                    case 'рџҐ°':
                        // Happy smile (ANIME BLOB open mouth!)
                        mouthPath.setAttribute('d', 'M 90 122 Q 100 130 110 122');
                        vectorPet.classList.add('happy');
                        break;
                    case 'рџў':
                    case 'рџ”':
                    case 'рџ°':
                        // Sad frown
                        mouthPath.setAttribute('d', 'M 90 125 Q 100 120 110 125');
                        vectorPet.classList.add('sad');
                        break;
                    case 'рџ‹':
                        // Excited (very open mouth)
                        mouthPath.setAttribute('d', 'M 88 120 Q 100 135 112 120');
                        vectorPet.classList.add('excited');
                        break;
                    case 'рџ’Ђ':
                    case 'рџµ':
                        // Dead (small line)
                        mouthPath.setAttribute('d', 'M 95 125 L 105 125');
                        vectorPet.classList.add('sleepy');
                        break;
                    case 'рџ ':
                    case 'рџЎ':
                        // Angry (straight line)
                        mouthPath.setAttribute('d', 'M 88 125 L 112 125');
                        vectorPet.classList.add('angry');
                        break;
                    case 'рџІ':
                    case 'рџ®':
                        // Surprised (round open mouth)
                        mouthPath.setAttribute('d', 'M 97 123 Q 100 128 103 123');
                        vectorPet.classList.add('surprised');
                        break;
                    case 'рџ':
                        // Love (kissing)
                        mouthPath.setAttribute('d', 'M 95 123 Q 100 128 105 123');
                        vectorPet.classList.add('love');
                        break;
                    default:
                        // Neutral (default happy open mouth for ANIME BLOB!)
                        mouthPath.setAttribute('d', 'M 90 122 Q 100 130 110 122');
                        break;
                }
            }
        }

        function updateStat(stat, current, max) {
            const percentage = Math.max(0, Math.min(100, (current / max) * 100));
            const bar = document.getElementById(`${stat}-bar`);
            const text = document.getElementById(`${stat}-text`);

            bar.style.width = percentage + '%';
            bar.querySelector('.stat-value').textContent = Math.round(percentage) + '%';
            text.textContent = `${Math.round(current)}/${max}`;

            // Warning colors
            if (percentage < 20) {
                text.classList.add('status-critical');
                text.classList.remove('status-warning');
            } else if (percentage < 40) {
                text.classList.add('status-warning');
                text.classList.remove('status-critical');
            } else {
                text.classList.remove('status-warning', 'status-critical');
            }
        }

        function updatePetEvolution() {
            const currentStage = getEvolutionStage(gameState.level);
            if (currentStage && gameState.petType !== currentStage.emoji) {
                gameState.petType = currentStage.emoji;
                updateVectorPetAppearance(currentStage);
                showMessage(`рџЋ‰ Your pet evolved into ${currentStage.name}!`);
            }
        }

        // вљ–пёЏ DEGRADATION SYSTEM - Pets need care!
        function degradeStats() {
            const now = Date.now();
            const timeSinceLastDeg = now - lastDegradationTime;

            if (timeSinceLastDeg >= DEGRADATION_INTERVAL) {
                // Calculate degradation
                gameState.hp = Math.max(0, gameState.hp - (gameState.maxHp * DEGRADATION_RATES.hp / 100));
                gameState.food = Math.max(0, gameState.food - (gameState.maxFood * DEGRADATION_RATES.food / 100));
                gameState.happy = Math.max(0, gameState.happy - (gameState.maxHappy * DEGRADATION_RATES.happy / 100));

                // Critical warnings
                if (gameState.food < 20) {
                    showMessage('вљ пёЏ Your pet is very hungry!');
                    // Low food accelerates HP loss
                    gameState.hp = Math.max(0, gameState.hp - (gameState.maxHp * 0.5 / 100));
                }

                if (gameState.happy < 20) {
                    showMessage('рџў Your pet is very sad!');
                }

                if (gameState.hp < 20) {
                    showMessage('рџљЁ Your pet is critically ill!');
                    // Low HP reduces click efficiency
                    clickEfficiency = Math.min(clickEfficiency, 0.5);
                }

                lastDegradationTime = now;
                updateUI();
                // вљ пёЏ Save via triggerAutoSave (which prioritizes Supabase)
                triggerAutoSave();
            }
        }

        function updateVectorPetAppearance(stage) {
            const vectorPet = document.getElementById('vector-pet');

            // Update colors based on stage
            switch(stage.name) {
                case 'Egg':
                    // Keep default pink
                    break;
                case 'Baby':
                    // Light blue
                    updatePetColors(vectorPet, '#87CEEB', '#4682B4');
                    break;
                case 'Child':
                    // Yellow
                    updatePetColors(vectorPet, '#FFD700', '#FFA500');
                    break;
                case 'Adult':
                    // Green
                    updatePetColors(vectorPet, '#98FB98', '#32CD32');
                    break;
                case 'Elite':
                    // Purple
                    updatePetColors(vectorPet, '#DDA0DD', '#9370DB');
                    break;
                case 'Legendary':
                    // Gold with sparkles
                    updatePetColors(vectorPet, '#FFD700', '#FF8C00');
                    addSparkleEffect(vectorPet);
                    break;
            }
        }

        function updatePetColors(pet, primaryColor, secondaryColor) {
            // Update body and head colors
            const circles = pet.querySelectorAll('circle');
            circles.forEach(circle => {
                if (circle.getAttribute('fill') === '#FFB6C1') {
                    circle.setAttribute('fill', primaryColor);
                }
                if (circle.getAttribute('stroke') === '#FF91A4') {
                    circle.setAttribute('stroke', secondaryColor);
                }
            });

            // Update ear colors
            const ellipses = pet.querySelectorAll('ellipse');
            ellipses.forEach(ellipse => {
                if (ellipse.getAttribute('fill') === '#FFB6C1') {
                    ellipse.setAttribute('fill', primaryColor);
                }
                if (ellipse.getAttribute('stroke') === '#FF91A4') {
                    ellipse.setAttribute('stroke', secondaryColor);
                }
                if (ellipse.getAttribute('fill') === '#FF91A4') {
                    ellipse.setAttribute('fill', secondaryColor);
                }
            });

            // Update tail and paws
            const paths = pet.querySelectorAll('path');
            paths.forEach(path => {
                if (path.getAttribute('stroke') === '#FFB6C1') {
                    path.setAttribute('stroke', primaryColor);
                }
            });
        }

        function addSparkleEffect(pet) {
            // Add sparkle elements
            for (let i = 0; i < 5; i++) {
                const sparkle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                sparkle.setAttribute('cx', Math.random() * 120);
                sparkle.setAttribute('cy', Math.random() * 120);
                sparkle.setAttribute('r', '2');
                sparkle.setAttribute('fill', '#FFD700');
                sparkle.setAttribute('opacity', '0.8');
                sparkle.style.animation = `sparkle ${2 + Math.random() * 2}s infinite`;
                pet.appendChild(sparkle);
            }

            // Add sparkle animation
            if (!document.getElementById('sparkle-animation')) {
                const style = document.createElement('style');
                style.id = 'sparkle-animation';
                style.textContent = `
                    @keyframes sparkle {
                        0%, 100% { opacity: 0; transform: scale(0); }
                        50% { opacity: 1; transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // Throttle particle creation to prevent lag
        let lastParticleTime = 0;
        const PARTICLE_COOLDOWN = 100; // ms between particle bursts

        function createParticleBurst(x, y, combo) {
            const now = Date.now();
            if (now - lastParticleTime < PARTICLE_COOLDOWN) {
                return; // Skip if too soon
            }
            lastParticleTime = now;
            const particleTypes = [
                { class: 'blob-purple', emoji: 'рџџЈ', size: 20 },
                { class: 'blob-glow', emoji: '', size: 12 },
                { class: 'blob-star', emoji: 'вњЁ', size: 18 },
                { class: 'blob-purple', emoji: 'рџ’њ', size: 22 },
                { class: 'blob-glow', emoji: '', size: 10 },
                { class: 'blob-star', emoji: 'в­ђ', size: 16 }
            ];
            const particleCount = Math.min(5 + Math.floor(combo / 2), 12); // Max 12 particles (optimized)

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                const particleType = particleTypes[i % particleTypes.length];
                particle.className = `particle ${particleType.class}`;

                // Random angle and distance for organic spread
                const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
                const distance = 40 + Math.random() * 100;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance - 30; // Slightly upward bias

                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.setProperty('--dx', dx + 'px');
                particle.style.setProperty('--dy', dy + 'px');

                if (particleType.emoji) {
                    particle.innerHTML = particleType.emoji;
                    particle.style.fontSize = particleType.size + 'px';
                }

                // Add random delay for staggered effect
                particle.style.animationDelay = (Math.random() * 0.2) + 's';

                document.body.appendChild(particle);

                // Remove after animation (shorter for performance)
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1300);
            }

            // Extra sparkles disabled for performance
        }

        function createParticles(type, count) {
            const petArea = document.getElementById('pet-area');
            const petRect = petArea.getBoundingClientRect();
            const centerX = petRect.left + petRect.width / 2;
            const centerY = petRect.top + petRect.height / 2;

            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = `particle ${type}`;

                // Random position around pet
                const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
                const distance = 30 + Math.random() * 20;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;

                particle.style.left = x + 'px';
                particle.style.top = y + 'px';

                // Set particle content
                switch(type) {
                    case 'heart':
                        particle.innerHTML = 'рџ’–';
                        break;
                    case 'sparkle':
                        particle.innerHTML = 'вњЁ';
                        break;
                    case 'star':
                        particle.innerHTML = 'в­ђ';
                        break;
                }

                particle.style.fontSize = (12 + Math.random() * 8) + 'px';

                document.body.appendChild(particle);

                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }
        }

        // Pet Click - REMOVED: This was trying to add listener before DOM is ready
        // Handler is now properly initialized in DOMContentLoaded (line ~11790)
        // if (petArea) {
        //     petArea.addEventListener('click', (e) => {
        //         if (e.target.closest('.pet-emoji')) {
        //             clickPet(e);
        //         }
        //     });
        // }

        function clickPet(e) {
            // рџ›ЎпёЏ PREVENT DOUBLE-CLICK: Block if already processing or too soon
            const now = Date.now();
            if (isProcessingClick) {
                console.warn('вљ пёЏ Click already processing, ignoring duplicate');
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                return;
            }

            // Check minimum interval between clicks
            if (now - lastClickProcessTime < MIN_CLICK_INTERVAL) {
                console.warn('вљ пёЏ Click too soon, ignoring (spam protection)');
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                return;
            }

            // Set processing flag
            isProcessingClick = true;
            lastClickProcessTime = now;

            // Prevent event bubbling
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            // вњ… CHECK AUTHENTICATION: Require Telegram or Wallet to play
            if (!window.TELEGRAM_USER_ID && !window.WALLET_ADDRESS) {
                console.warn('вљ пёЏ Authentication required to play');
                isProcessingClick = false; // Reset flag
                // Show wallet connection modal for non-Telegram users
                if (window.WalletAuth && !window.Telegram?.WebApp?.initDataUnsafe?.user) {
                    const modal = document.getElementById('wallet-connect-modal');
                    if (modal) {
                        modal.style.display = 'flex';
                        showMessage('рџ”ђ Please connect your wallet to play!', 'error');
                    }
                } else {
                    showMessage('рџ”ђ Please open the game in Telegram or connect your wallet!', 'error');
                }
                setTimeout(() => { isProcessingClick = false; }, 10);
                return; // Block clicking
            }

            // вљЎ RESET CLICK EFFICIENCY TO 1.0 AT START OF EACH CLICK
            // This prevents accumulation of penalties from previous clicks
            let localClickEfficiency = 1.0;

            // вљЎ FATIGUE SYSTEM - Track clicks per minute
            if (now - lastClickWindowReset >= CLICK_WINDOW) {
                clicksInWindow = 0;
                lastClickWindowReset = now;
                clickEfficiency = 1.0; // Reset global efficiency
            }

            clicksInWindow++;

            // Apply fatigue after max clicks
            if (clicksInWindow > MAX_CLICKS_PER_WINDOW) {
                localClickEfficiency = 0.5; // 50% efficiency when fatigued
                clickEfficiency = 0.5; // Update global for UI
                if (clicksInWindow === MAX_CLICKS_PER_WINDOW + 1) {
                    showMessage('рџґ Your pet is tired! Efficiency reduced to 50%. Rest for 60 seconds.');
                }
            }

            // NEW: Check if pet is too weak to interact
            if (gameState.hp <= 0) {
                setTimeout(() => { isProcessingClick = false; }, 10);
                showMessage('рџ’Ђ Your pet is unconscious! Heal it first!');
                return;
            }

            if (gameState.food <= 0) {
                setTimeout(() => { isProcessingClick = false; }, 10);
                showMessage('рџЌЅпёЏ Your pet is starving! Feed it first!');
                return;
            }

            if (gameState.happy <= 0) {
                setTimeout(() => { isProcessingClick = false; }, 10);
                showMessage('рџў Your pet is too depressed! Play with it first!');
                return;
            }

            // NEW: Pet condition affects click efficiency
            if (gameState.hp < 30) localClickEfficiency *= 0.5; // 50% efficiency
            if (gameState.food < 30) localClickEfficiency *= 0.7; // 70% efficiency
            if (gameState.happy < 30) localClickEfficiency *= 0.8; // 80% efficiency

            // вљЎ ENERGY COST - Every click consumes resources!
            gameState.hp = Math.max(0, gameState.hp - 0.5);    // -0.5 HP per click
            gameState.food = Math.max(0, gameState.food - 0.3); // -0.3 Food per click
            gameState.happy = Math.max(0, gameState.happy - 0.2); // -0.2 Happy per click

            // Extra penalty if stats are low (pet gets tired faster)
            if (gameState.hp < 50) {
                gameState.happy = Math.max(0, gameState.happy - 0.5);
            }
            if (gameState.food < 50) {
                gameState.happy = Math.max(0, gameState.happy - 0.3);
            }

            // BALANCED Combo system - Load from admin panel or use defaults
            const economyConfig = JSON.parse(localStorage.getItem('economyConfig') || '{}');
            const COMBO_WINDOW = economyConfig.COMBO_WINDOW || 2500; // 2.5 seconds for combo window
            const COMBO_COOLDOWN = economyConfig.COMBO_COOLDOWN || 800; // 0.8 second cooldown between clicks
            const COMBO_DECAY_TIME = 5000; // 5 seconds for combo decay

            // Check if enough time passed since last click
            const SPAM_PENALTY = economyConfig.SPAM_PENALTY || 0.5;
            if (now - gameState.lastClickTime < COMBO_COOLDOWN) {
                // Too fast clicking - no combo, reduced rewards
                gameState.combo = 1;
                localClickEfficiency *= SPAM_PENALTY; // Penalty for spam clicking (from admin panel)
            } else if (now - gameState.lastClickTime < COMBO_WINDOW) {
                // Within combo window - increase combo
                gameState.combo++;
                if (gameState.combo > gameState.maxCombo) {
                    gameState.maxCombo = gameState.combo;
                }
            } else if (now - gameState.lastClickTime < COMBO_DECAY_TIME) {
                // Combo decay - reduce combo gradually
                const decayFactor = 1 - ((now - gameState.lastClickTime - COMBO_WINDOW) / (COMBO_DECAY_TIME - COMBO_WINDOW));
                gameState.combo = Math.max(1, Math.floor(gameState.combo * decayFactor));
            } else {
                // Too much time passed - reset combo
                gameState.combo = 1;
            }
            gameState.lastClickTime = now;

            // Update combo display - Show at 5+ combo (more balanced)
            const comboCounter = document.getElementById('combo-counter');
            const comboValue = document.getElementById('combo-value');
            if (gameState.combo >= 5) {
                comboCounter.classList.add('active');
                comboValue.textContent = gameState.combo;
            } else {
                comboCounter.classList.remove('active');
            }

            // Calculate earned TAMA with booster and efficiency
            let clickPower = gameState.clickPower;
            if (gameState.boosterActive && now < gameState.boosterEndTime) {
                clickPower *= 2;
            }

            // Apply efficiency penalty (use local variable)
            clickPower *= localClickEfficiency;

            // BALANCED Combo bonus - Load from admin panel or use defaults
            const BASE_CLICK_REWARD = economyConfig.BASE_CLICK_REWARD || 10.0; // Base reward per click (default: 10)
            const COMBO_BONUS_DIVIDER = economyConfig.COMBO_BONUS_DIVIDER || 5; // Bonus every 5 clicks
            const MAX_COMBO_BONUS = economyConfig.MAX_COMBO_BONUS || 10; // Cap combo bonus at 10 TAMA
            const MIN_REWARD = economyConfig.MIN_REWARD || 0.5; // Minimum reward

            // Log economy config values (only on first click or when combo resets)
            if (gameState.combo === 1 || gameState.combo === 0) {
                // [cleaned]
            }

            const comboBonus = Math.floor(gameState.combo / COMBO_BONUS_DIVIDER);
            const cappedComboBonus = Math.min(comboBonus, MAX_COMBO_BONUS);

            // Calculate base reward
            const baseReward = (clickPower * BASE_CLICK_REWARD) + cappedComboBonus;
            let earnedTama = Math.max(MIN_REWARD, baseReward);

            // Safety check: ensure earnedTama is never 0 or negative
            if (earnedTama <= 0 || isNaN(earnedTama) || !isFinite(earnedTama)) {
                console.error('вљ пёЏ Invalid earnedTama calculated:', earnedTama, {
                    clickPower,
                    BASE_CLICK_REWARD,
                    cappedComboBonus,
                    baseReward,
                    localClickEfficiency
                });
                earnedTama = MIN_REWARD; // Fallback to minimum reward
            }

            // Log detailed calculation (only on first click or when combo resets)
            if (gameState.combo === 1 || gameState.combo === 0) {
                // [cleaned],
                    BASE_CLICK_REWARD,
                    comboBonus,
                    cappedComboBonus,
                    baseReward: baseReward.toFixed(2),
                    MIN_REWARD,
                    earnedTamaBeforeNFT: earnedTama.toFixed(2)
                });
            }

            // рџЋЁ NFT BOOST: Apply sum of all active NFT multipliers
            // Formula: earnedTama *= (1 + userNFTBoost)
            // Example: 20x total multiplier в†’ userNFTBoost = 19.0 в†’ earnedTama *= 20.0
            if (window.userNFTBoost && window.userNFTBoost > 0) {
                const earnedTamaBeforeBoost = earnedTama;
                const multiplier = (1 + window.userNFTBoost); // Convert boost back to multiplier for display
                earnedTama *= multiplier;
                if (gameState.combo === 1 || gameState.combo === 0) {
                    // [cleaned]} TAMA Г— ${multiplier.toFixed(2)} = ${earnedTama.toFixed(2)} TAMA`);
                }
            }

            const earnedXP = Math.max(1, 3 + Math.floor(cappedComboBonus / 2));

            // вЏ° HALVING LIMIT CHECK - Check daily reset first
            checkDailyReset();

            // Check if daily limit reached
            const availableToday = gameState.personalDailyLimit - gameState.dailyEarned;
            if (availableToday <= 0) {
                // Daily limit reached!
                setTimeout(() => { isProcessingClick = false; }, 10);
                showMessage('вЏ° Daily limit reached! Come back tomorrow!', 'error');
                // [cleaned]

                // Show special modal
                const poolInfo = getCurrentDailyPool();
                alert(`вЏ° Daily Earning Limit Reached!\n\n` +
                      `You've earned ${formatNumber(gameState.dailyEarned)} TAMA today!\n` +
                      `Daily limit: ${formatNumber(gameState.personalDailyLimit)} TAMA\n\n` +
                      `Current period: ${poolInfo.periodName}\n` +
                      `Days left in period: ${poolInfo.daysLeftInPeriod}\n\n` +
                      `Come back tomorrow to earn more! рџЋ®`);
                return;
            }

            // Cap earned TAMA to available today
            if (earnedTama > availableToday) {
                // [cleaned]} в†’ ${availableToday.toFixed(2)} TAMA (daily limit)`);
                earnedTama = availableToday;
            }

            // Log transaction BEFORE updating balance
            const balanceBefore = gameState.tama;
            // [cleaned],
                earnedTama: earnedTama.toFixed(2),
                willAdd: earnedTama.toFixed(2)
            });
            gameState.tama += earnedTama;
            gameState.dailyEarned += earnedTama; // Track daily earned
            const balanceAfter = gameState.tama;
            // [cleaned],
                difference: (balanceAfter - balanceBefore).toFixed(2)
            });
            gameState.xp += earnedXP;
            gameState.totalClicks++;
            gameState.questClicks++;

            // Update daily earned UI
            updateDailyEarnedUI();

            // Check for level up based on XP (original system)
            checkLevelUp();

            // Log transaction to Supabase immediately
            const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
            if (userId) {
                logTransaction('earn_click', earnedTama, balanceBefore, balanceAfter, {
                    combo: gameState.combo,
                    xp_gained: earnedXP,
                    click_power: gameState.clickPower,
                    efficiency: localClickEfficiency,
                    is_combo: gameState.combo >= 5
                });
            }

            // Play click sound (disabled - too annoying)
            // playSound('click');

            // Visual feedback - Vector pet animation
            const vectorPet = document.getElementById('vector-pet');
            const petSprite = document.getElementById('pet-sprite');
            if (vectorPet) {
                vectorPet.classList.add('clicked');
                setTimeout(() => vectorPet.classList.remove('clicked'), 600);

                // Enhanced bounce animation
                if (petSprite) {
                    petSprite.classList.add('bounce');
                    setTimeout(() => petSprite.classList.remove('bounce'), 600);
                }

                // Create particle burst effect
                createParticleBurst(e.clientX, e.clientY, gameState.combo);

                // Reduced particle effects - more balanced
                if (gameState.combo >= 15) {
                    createParticles('sparkle', 2);
                } else if (gameState.combo >= 10) {
                    createParticles('star', 1);
                }
            } else {
                // Fallback for emoji pet
                petSprite.classList.add('bounce');
                setTimeout(() => petSprite.classList.remove('bounce'), 500);
            }

            // Show +TAMA effect with combo and efficiency
            let displayText = `+${earnedTama.toFixed(1)} TAMA`;
            if (gameState.combo >= 5) {
                displayText = `+${earnedTama.toFixed(1)} рџ”Ґx${gameState.combo}`;
            }
            if (clickEfficiency < 1.0) {
                displayText += ` (${Math.round(clickEfficiency * 100)}%)`;
            }
            showClickEffect(e.clientX, e.clientY, displayText);

            // NEW: Random happy boost only if pet is healthy
            if (Math.random() < 0.3 && gameState.hp > 50 && gameState.food > 50) {
                gameState.happy = Math.min(gameState.maxHappy, gameState.happy + 2);
            }

            // Check achievements
            checkAchievements();

            // Check quests
            checkQuests();

            // Check level up
            checkLevelUp();

            updateUI();

            // Trigger auto-save after significant action (force critical for tama/clicks)
            triggerAutoSave(true); // Force critical save for tama and clicks

            // Reset processing flag after all operations complete
            // Use setTimeout to ensure flag resets even if there's an error
            setTimeout(() => {
                isProcessingClick = false;
            }, 50); // Small delay to ensure all operations complete
        }

        function showClickEffect(x, y, text) {
            const effect = document.createElement('div');
            effect.className = 'click-effect';
            effect.textContent = text;
            effect.style.left = x + 'px';
            effect.style.top = y + 'px';
            document.body.appendChild(effect);

            setTimeout(() => effect.remove(), 1000);
        }

        function checkLevelUp() {
            if (gameState.xp >= gameState.xpToLevel) {
                gameState.level++;
                gameState.xp = 0;
                gameState.xpToLevel = Math.floor(gameState.xpToLevel * 1.5);
                // вљ пёЏ REMOVED: gameState.clickPower = gameState.level;
                // clickPower should remain 1.0 - economy is controlled via Admin Panel only!

                // Level up bonuses - increase maximums and give partial restoration
                gameState.maxHp += 10;
                gameState.hp = Math.min(gameState.maxHp, gameState.hp + 20); // +20 HP, but not more than maximum
                gameState.maxFood += 5;
                gameState.food = Math.min(gameState.maxFood, gameState.food + 15); // +15 Food, but not more than maximum
                gameState.maxHappy += 5;
                gameState.happy = Math.min(gameState.maxHappy, gameState.happy + 15); // +15 Happy, but not more than maximum

                // Log level up transaction
                const levelBonus = gameState.level * 100;
                const balanceBefore = gameState.tama;
                gameState.tama += levelBonus;
                const balanceAfter = gameState.tama;

                showMessage(`рџЋЉ LEVEL UP! You are now Level ${gameState.level}! Earned ${levelBonus} TAMA!`);

                // вњ… FIX: Log level up transaction with correct function
                if (window.TELEGRAM_USER_ID) {
                    logTransaction('level_up', levelBonus, balanceBefore, balanceAfter, {
                        new_level: gameState.level,
                        bonus_amount: levelBonus,
                        max_hp: gameState.maxHp,
                        max_food: gameState.maxFood,
                        max_happy: gameState.maxHappy
                    });
                }

                // Play level up sound
                playSound('levelup');

                // Send level up to bot
                sendDataToBot('level_up', { level: gameState.level });

                // вњ… Check quests after level up (for "Level Up!" quest)
                checkQuests();

                // вњ… Update action prices after level up (prices scale with level)
                updateActionPrices();
            }
        }

        // рџ’° PROGRESSIVE PRICING - Prices scale with level
        function getProgressivePrice(basePrice) {
            // Every 5 levels = +20% price
            const levelMultiplier = 1 + (Math.floor(gameState.level / 5) * 0.2);
            return Math.floor(basePrice * levelMultiplier);
        }

        function updateActionPrices() {
            const feedCost = getProgressivePrice(50);
            const playCost = getProgressivePrice(30);
            const healCost = getProgressivePrice(100);

            feedBtn.innerHTML = `рџЌ”<br>Feed<br><small>-${feedCost} TAMA</small>`;
            playBtn.innerHTML = `рџЋ®<br>Play<br><small>-${playCost} TAMA</small>`;
            healBtn.innerHTML = `рџ’Љ<br>Heal<br><small>-${healCost} TAMA</small>`;
        }

        // Actions
        if (feedBtn) {
        feedBtn.addEventListener('click', () => {
            const cost = getProgressivePrice(50);
            if (gameState.tama >= cost) {
                const balanceBefore = gameState.tama;
                gameState.tama -= cost;
                const balanceAfter = gameState.tama;
                gameState.food = Math.min(gameState.maxFood, gameState.food + 30);
                gameState.xp += 10;
                showMessage('рџЌ” Yummy! Food +30');
                checkLevelUp();
                updateUI();

                // Log transaction immediately
                const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
                if (userId) {
                    logTransaction('spend_feed', cost, balanceBefore, balanceAfter, {
                        food_gained: 30,
                        xp_gained: 10
                    });
                }

                triggerAutoSave(); // Auto-save after feeding
            } else {
                showMessage('вќЊ Not enough TAMA!');
            }
        });
        }

        if (playBtn) {
        playBtn.addEventListener('click', () => {
            const cost = getProgressivePrice(30);
            if (gameState.tama >= cost) {
                const balanceBefore = gameState.tama;
                gameState.tama -= cost;
                const balanceAfter = gameState.tama;
                gameState.happy = Math.min(gameState.maxHappy, gameState.happy + 40);
                gameState.food = Math.max(0, gameState.food - 10);
                gameState.xp += 15;
                showMessage('рџЋ® So fun! Happy +40, Food -10');
                checkLevelUp();
                updateUI();

                // Log transaction immediately
                const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
                if (userId) {
                    logTransaction('spend_play', cost, balanceBefore, balanceAfter, {
                        happy_gained: 40,
                        food_lost: 10,
                        xp_gained: 15
                    });
                }

                triggerAutoSave(); // Auto-save after playing
            } else {
                showMessage('вќЊ Not enough TAMA!');
            }
        });
        }

        if (healBtn) {
        healBtn.addEventListener('click', () => {
            const cost = getProgressivePrice(100);
            if (gameState.tama >= cost) {
                const balanceBefore = gameState.tama;
                gameState.tama -= cost;
                const balanceAfter = gameState.tama;
                gameState.hp = Math.min(gameState.maxHp, gameState.hp + 50);
                gameState.xp += 20;
                clickEfficiency = 1.0; // Restore click efficiency
                showMessage('рџ’Љ Feeling better! HP +50');
                checkLevelUp();
                updateUI();

                // Log transaction immediately
                const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
                if (userId) {
                    logTransaction('spend_heal', cost, balanceBefore, balanceAfter, {
                        hp_gained: 50,
                        xp_gained: 20,
                        efficiency_restored: true
                    });
                }

                triggerAutoSave(); // Auto-save after healing
            } else {
                showMessage('вќЊ Not enough TAMA!');
            }
        });
        }

        // Manual save removed - using enhanced auto-save system

        // Old sendDataToBot function removed - using enhanced version below

        function showMessage(msg) {
            if (messageDiv) {
            messageDiv.textContent = msg;
            messageDiv.classList.remove('message');
            void messageDiv.offsetWidth; // Trigger reflow
            messageDiv.classList.add('message');
            }
        }

        // Passive stat decay - IMPROVED LOGIC
        setInterval(() => {
            const now = Date.now();
            const timePassed = (now - gameState.lastUpdate) / 1000; // seconds
            gameState.lastUpdate = now;

            // Decay stats slowly with realistic rates
            if (timePassed > 0) {
                // Food decays faster when pet is active (clicking)
                const activityMultiplier = gameState.totalClicks > 0 ? 1.5 : 1.0;
                gameState.food = Math.max(0, gameState.food - timePassed * 0.08 * activityMultiplier);

                // Happy decays slower, but faster when hungry/sick
                let happyDecayRate = 0.03;
                if (gameState.food < 30) happyDecayRate *= 2; // Hungry = sad
                if (gameState.hp < 30) happyDecayRate *= 1.5; // Sick = sad
                gameState.happy = Math.max(0, gameState.happy - timePassed * happyDecayRate);

                // HP damage from starvation
                if (gameState.food <= 0) {
                    gameState.hp = Math.max(0, gameState.hp - timePassed * 0.3); // Starving = fast HP loss
                } else if (gameState.food < 20) {
                    gameState.hp = Math.max(0, gameState.hp - timePassed * 0.15); // Hungry = slow HP loss
                }

                // HP damage from depression (extreme sadness)
                if (gameState.happy <= 0) {
                    gameState.hp = Math.max(0, gameState.hp - timePassed * 0.1); // Depression = HP loss
                }

                updateUI();

                // NEW: Progressive warning system
                if (gameState.hp <= 0) {
                    showMessage('рџ’Ђ Your pet has fainted! Emergency healing needed!');
                } else if (gameState.hp < 10) {
                    showMessage('рџљЁ CRITICAL! Your pet is dying! Heal immediately!');
                } else if (gameState.hp < 20) {
                    showMessage('вљ пёЏ DANGER! Your pet needs healing!');
                } else if (gameState.food <= 0) {
                    showMessage('рџЌЅпёЏ Your pet is starving! Feed it now!');
                } else if (gameState.food < 10) {
                    showMessage('вљ пёЏ Your pet is very hungry! Feed it!');
                } else if (gameState.food < 20) {
                    showMessage('рџЌЅпёЏ Your pet is hungry! Feed it!');
                } else if (gameState.happy <= 0) {
                    showMessage('рџў Your pet is severely depressed! Play with it!');
                } else if (gameState.happy < 20) {
                    showMessage('рџў Your pet is very sad. Play with it!');
                } else if (gameState.happy < 30) {
                    showMessage('рџў Your pet is sad. Play with it!');
                }
            }
        }, 5000); // Check every 5 seconds

        // Optimized auto-save every 30 seconds (reduced frequency to prevent API lag)
        setInterval(() => {
            triggerAutoSave();
        }, 30000);

        // Achievements system
        function checkAchievements() {
            const achievements = [
                { id: 'first_click', name: 'First Steps', desc: 'Click your pet for the first time', check: () => gameState.totalClicks === 1 },
                { id: 'clicker_10', name: 'Clicker', desc: 'Click 10 times', check: () => gameState.totalClicks === 10 },
                { id: 'clicker_100', name: 'Dedicated', desc: 'Click 100 times', check: () => gameState.totalClicks === 100 },
                { id: 'clicker_1000', name: 'Legend', desc: 'Click 1,000 times', check: () => gameState.totalClicks === 1000 },
                { id: 'combo_10', name: 'Combo Master', desc: 'Reach 10x combo', check: () => gameState.combo === 10 },
                { id: 'rich_1000', name: 'Getting Rich', desc: 'Earn 1,000 TAMA', check: () => gameState.tama >= 1000 },
                { id: 'rich_10000', name: 'Wealthy', desc: 'Earn 10,000 TAMA', check: () => gameState.tama >= 10000 },
            ];

            achievements.forEach(ach => {
                if (!gameState.achievements.includes(ach.id) && ach.check()) {
                    gameState.achievements.push(ach.id);
                    showAchievement(ach.name, ach.desc);

                    // Log achievement reward
                    const balanceBefore = gameState.tama;
                    gameState.tama += 100; // Bonus TAMA for achievement
                    const balanceAfter = gameState.tama;

                    const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
                    if (userId) {
                        logTransaction('achievement_bonus', 100, balanceBefore, balanceAfter, {
                            achievement_id: ach.id,
                            achievement_name: ach.name
                        });
                    }

                    triggerAutoSave(); // Auto-save after achievement
                }
            });
        }

        function showAchievement(title, desc) {
            const popup = document.getElementById('achievement-popup');
            const text = document.getElementById('achievement-text');
            text.textContent = desc;
            popup.classList.add('show');

            // Play achievement sound
            playSound('achievement');

            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000);
        }

        // Quests system
        function checkQuests() {
            // Quest 1: Click 50 times
            if (!gameState.questClicksCompleted && gameState.questClicks >= 50) {
                gameState.questClicksCompleted = true;

                const balanceBefore = gameState.tama;
                gameState.tama += 500;
                const balanceAfter = gameState.tama;

                const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
                if (userId) {
                    logTransaction('quest_complete', 500, balanceBefore, balanceAfter, {
                        quest_id: 'click_master',
                        quest_name: 'Click Master',
                        clicks_required: 50
                    });
                }

                showMessage('рџЋЇ Quest Complete! Click Master +500 TAMA');
                document.getElementById('quest-clicks').style.opacity = '0.5';
                document.getElementById('quest-clicks').style.border = '2px solid #10b981';
                triggerAutoSave(); // Auto-save after quest completion
            }

            // Quest 2: Reach level 5
            if (!gameState.questLevelCompleted && gameState.level >= 5) {
                gameState.questLevelCompleted = true;

                const balanceBefore = gameState.tama;
                gameState.tama += 1000;
                const balanceAfter = gameState.tama;

                const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
                if (userId) {
                    logTransaction('quest_complete', 1000, balanceBefore, balanceAfter, {
                        quest_id: 'level_up',
                        quest_name: 'Level Up!',
                        level_required: 5
                    });
                }

                showMessage('рџЋЇ Quest Complete! Level Up! +1,000 TAMA');
                document.getElementById('quest-level').style.opacity = '0.5';
                document.getElementById('quest-level').style.border = '2px solid #10b981';
                triggerAutoSave(); // Auto-save after quest completion
            }

            // Update quest progress
            document.getElementById('quest-clicks-progress').textContent =
                `${Math.min(gameState.questClicks, 50)}/50`;
            document.getElementById('quest-level-progress').textContent =
                `${gameState.level}/5`;
        }

        // Shop system
        // [cleaned]
        const shopBtn = document.getElementById('shop-btn');
        const closeShop = document.getElementById('close-shop');
        const shopModal = document.getElementById('shop-modal');

        // [cleaned]

        if (shopBtn && shopModal) {
            shopBtn.addEventListener('click', () => {
                // [cleaned]
                shopModal.classList.add('active');
                shopBtn.style.display = 'none'; // Hide button when shop opens
                // Load items by default
                document.getElementById('shop-items').style.display = 'block';
                document.getElementById('shop-skins').style.display = 'none';
            });
            // [cleaned]
        } else {
            console.error('вќЊ Shop button or modal not found!', { shopBtn, shopModal });
        }

        if (closeShop && shopModal) {
            closeShop.addEventListener('click', () => {
                shopModal.classList.remove('active');
                if (shopBtn) shopBtn.style.display = 'flex'; // Show button again
            });
        }

        // Close shop on background click
        if (shopModal) {
            shopModal.addEventListener('click', (e) => {
            if (e.target.id === 'shop-modal') {
                    shopModal.classList.remove('active');
                    if (shopBtn) shopBtn.style.display = 'flex'; // Show button again
            }
        });
        }

        function buyItem(itemType, price) {
            // Check if player has enough TAMA
            if (gameState.tama < price) {
                showMessage('вќЊ Not enough TAMA!');
                return;
            }

            // Check if item is already owned (for permanent items)
            if (itemType === 'auto_feed' && gameState.hasAutoFeeder) {
                showMessage('вќЊ You already own Auto-Feeder!');
                return;
            }

            // Check if booster is already active
            if (itemType === 'booster' && gameState.boosterActive && Date.now() < gameState.boosterEndTime) {
                showMessage('вќЊ Booster is already active!');
                return;
            }

            // Log transaction BEFORE updating balance
            const balanceBefore = gameState.tama;
            gameState.tama -= price;
            const balanceAfter = gameState.tama;

            // вњ… FIX: Log shop purchase transaction with NEGATIVE amount
            if (window.TELEGRAM_USER_ID) {
                logTransaction('spend_shop', -price, balanceBefore, balanceAfter, {
                    item_type: itemType,
                    item_name: itemType === 'energy' ? 'Energy Drink' :
                               itemType === 'auto_feed' ? 'Auto-Feeder' :
                               itemType === 'booster' ? '2x TAMA Booster' : itemType
                });
            }

            // Apply item effect
            let itemEffect = '';
            switch(itemType) {
                case 'energy':
                    gameState.food = Math.min(gameState.maxFood, gameState.food + 50);
                    gameState.happy = Math.min(gameState.maxHappy, gameState.happy + 50);
                    itemEffect = 'Energy Drink consumed! +50 Food & Happy';
                    showMessage('вљЎ ' + itemEffect);
                    break;

                case 'potion':
                    gameState.hp = gameState.maxHp;
                    itemEffect = 'Super Potion used! HP fully restored!';
                    showMessage('рџ’Љ ' + itemEffect);
                    break;

                case 'booster':
                    gameState.boosterActive = true;
                    gameState.boosterEndTime = Date.now() + (60 * 60 * 1000); // 1 hour
                    itemEffect = 'Click Booster activated! 2x clicks for 1 hour!';
                    showMessage('рџ”Ґ ' + itemEffect);
                    break;

                case 'auto_feed':
                    gameState.hasAutoFeeder = true;
                    itemEffect = 'Auto-Feeder purchased! Your pet will auto-feed when hungry!';
                    showMessage('рџ’Ћ ' + itemEffect);
                    break;

                case 'skin':
                    const skins = ['рџђ¶', 'рџђ±', 'рџђ­', 'рџђ№', 'рџђ°', 'рџ¦Љ', 'рџђ»', 'рџђј', 'рџђЁ', 'рџђЇ', 'рџ¦Ѓ', 'рџђ®', 'рџђ·', 'рџђё', 'рџђµ', 'рџ¦„', 'рџђІ', 'рџ¦–'];
                    const randomSkin = skins[Math.floor(Math.random() * skins.length)];
                    const petSprite = document.getElementById('pet-sprite');
                    if (petSprite) {
                    petSprite.textContent = randomSkin;
                    }
                    gameState.petType = randomSkin;
                    itemEffect = `New pet skin! You got ${randomSkin}!`;
                    showMessage('рџЋЁ ' + itemEffect);
                    break;

                default:
                    showMessage('вќЊ Unknown item!');
                    gameState.tama = balanceBefore; // Refund if unknown item
                    return;
            }

            // Log shop transaction with item effect
            if (window.TELEGRAM_USER_ID && typeof TransactionLogger !== 'undefined') {
                TransactionLogger.logSpend(
                    window.TELEGRAM_USER_ID,
                    window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'user',
                    'shop_' + itemType,
                    price,
                    balanceBefore,
                    balanceAfter,
                    {
                        item_type: itemType,
                        shop_item: true,
                        effect: itemEffect
                    }
                );
            }

            updateUI();
            document.getElementById('shop-modal').classList.remove('active');

            // вњ… CRITICAL: Force immediate save to prevent balance rollback
            triggerAutoSave(true); // Force critical save

            // Also save directly via API to ensure balance is persisted
            if (window.TELEGRAM_USER_ID && typeof TAMA_API_BASE !== 'undefined') {
                fetch(`${TAMA_API_BASE}/leaderboard/upsert`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: window.TELEGRAM_USER_ID,
                        tama: balanceAfter,
                        level: gameState.level,
                        xp: gameState.xp
                    })
                }).catch(err => console.warn('вљ пёЏ Failed to save balance after shop purchase:', err));
            }
        }

        // ==================== SKINS SYSTEM ====================

        // Initialize user's owned skins
        if (!gameState.ownedSkins) {
            gameState.ownedSkins = ['kawai']; // Default free skin
        }
        if (!gameState.equippedSkin) {
            gameState.equippedSkin = 'kawai';
        }

        // Switch shop tabs
        function switchShopTab(tab) {
            // Update tab buttons
            document.querySelectorAll('.shop-tab').forEach((btn, index) => {
                btn.classList.remove('active');
                // Add active class to the correct button
                if ((tab === 'items' && index === 0) ||
                    (tab === 'skins' && index === 1) ||
                    (tab === 'owned' && index === 2)) {
                    btn.classList.add('active');
                }
            });

            // Hide all sections
            document.getElementById('shop-items').style.display = 'none';
            document.getElementById('shop-skins').style.display = 'none';
            document.getElementById('shop-owned').style.display = 'none';

            // Show selected section
            if (tab === 'items') {
                document.getElementById('shop-items').style.display = 'block';
            } else if (tab === 'skins') {
                document.getElementById('shop-skins').style.display = 'block';
                loadSkinsShop();
            } else if (tab === 'owned') {
                document.getElementById('shop-owned').style.display = 'block';
                loadOwnedSkinsShop();
            }
        }

        // Filter skins in shop
        let currentSkinFilter = 'all';
        function filterShopSkins(rarity) {
            currentSkinFilter = rarity;
            document.querySelectorAll('.skin-filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            loadSkinsShop();
        }

        // Load skins in shop
        function loadSkinsShop() {
            const skinsGrid = document.getElementById('skins-grid');
            skinsGrid.innerHTML = '';

            const skins = getEnabledSkins();

            skins.forEach(skin => {
                // Apply filter
                if (currentSkinFilter !== 'all' && skin.rarity !== currentSkinFilter) {
                    return;
                }

                // Check if available (for limited time skins)
                if (!isSkinAvailable(skin.id)) {
                    return;
                }

                const isOwned = gameState.ownedSkins.includes(skin.id);
                const isEquipped = gameState.equippedSkin === skin.id;

                const skinCard = document.createElement('div');
                skinCard.className = `skin-card-shop ${isOwned ? 'owned' : ''} ${isEquipped ? 'equipped' : ''}`;

                let buttonText = 'Buy';
                let buttonClass = 'skin-buy-btn';

                if (isEquipped) {
                    buttonText = 'вњ“ Equipped';
                    buttonClass += ' equipped';
                } else if (isOwned) {
                    buttonText = 'Equip';
                    buttonClass += ' owned';
                }

                // Emoji for preview (temporary until we add SVGs)
                const emojiMap = {
                    'kawai': 'рџЊё',
                    'retro': 'рџ•№пёЏ',
                    'neko': 'рџђ±',
                    'cyber': 'рџ¤–',
                    'premium': 'в­ђ',
                    'alien': 'рџ‘Ѕ',
                    'kitsune': 'рџ¦Љ',
                    'santa': 'рџЋ…',
                    'snowman': 'в›„',
                    'reindeer': 'рџ¦Њ',
                    'tree': 'рџЋ„',
                    'panda': 'рџђј',
                    'ghost': 'рџ‘»',
                    'ice-fox': 'вќ„пёЏ',
                    'love': 'рџ’•',
                    'gingerbread': 'рџЌЄ',
                    'fire-cat': 'рџ”Ґ',
                    'gold-dragon': 'рџђ‰',
                    'rainbow-unicorn': 'рџ¦„',
                    'ninja-cat': 'рџҐ·',
                    'lightning': 'вљЎ',
                    'elf': 'рџ§ќ',
                    'angel': 'рџ‘ј',
                    'demon': 'рџ€',
                    'cosmic': 'рџЊЊ',
                    'platinum-dragon': 'рџђ‰',
                    'divine-angel': 'рџ‘ј',
                    'santa': 'рџЋ…',
                    'snowman': 'в›„',
                    'reindeer': 'рџ¦Њ',
                    'tree': 'рџЋ„'
                };

                skinCard.innerHTML = `
                    ${skin.rarity === 'legendary' ? '<div class="premium-badge">PREMIUM</div>' : ''}
                    ${skin.limitedTime ? '<div class="limited-badge-shop">LIMITED</div>' : ''}

                    <div class="skin-preview-mini">
                        ${emojiMap[skin.id] || 'рџЋЁ'}
                    </div>

                    <div class="skin-name-shop">${skin.name}</div>

                    <div class="skin-rarity-badge rarity-${skin.rarity}">
                        ${skin.rarityLabel}
                    </div>

                    ${skin.price > 0 ? `<div class="skin-price-shop">${skin.price.toLocaleString()} TAMA</div>` : '<div class="skin-price-shop">FREE</div>'}

                    <div class="skin-bonus-shop">
                        ${skin.bonusEn || skin.bonusRu}
                    </div>

                    <button
                        class="${buttonClass}"
                        onclick="handleSkinPurchase('${skin.id}')"
                        ${isEquipped ? 'disabled' : ''}
                    >
                        ${buttonText}
                    </button>
                `;

                skinsGrid.appendChild(skinCard);
            });
        }

        // Handle skin purchase/equip
        function handleSkinPurchase(skinId) {
            const skin = getSkin(skinId);
            if (!skin) return;

            const isOwned = gameState.ownedSkins.includes(skinId);

            if (isOwned) {
                // Equip skin
                equipSkin(skinId);
            } else {
                // Buy skin
                buySkin(skinId);
            }
        }

        // Buy skin
        function buySkin(skinId) {
            const skin = getSkin(skinId);
            if (!skin) return;

            // Check if can afford
            if (gameState.tama < skin.price) {
                showMessage('вќЊ Not enough TAMA!');
                return;
            }

            // Check if available
            if (!isSkinAvailable(skinId)) {
                showMessage('вќЊ This skin is not available right now!');
                return;
            }

            // Deduct TAMA
            const balanceBefore = gameState.tama;
            gameState.tama -= skin.price;
            const balanceAfter = gameState.tama;

            // Add to owned skins
            if (!gameState.ownedSkins.includes(skinId)) {
                gameState.ownedSkins.push(skinId);
            }

            // Auto-equip
            equipSkin(skinId);

            // вњ… FIX: Log transaction with correct parameter order and NEGATIVE amount
            if (typeof logTransaction === 'function' && window.TELEGRAM_USER_ID) {
                logTransaction(
                    'spend_skin',      // type
                    -skin.price,       // amount (NEGATIVE for spending!)
                    balanceBefore,     // balance_before
                    balanceAfter,      // balance_after
                    {                  // metadata
                        skin_id: skinId,
                        skin_name: skin.name,
                        rarity: skin.rarity
                    }
                );
            }

            showMessage(`вњ… Purchased ${skin.name}!`);
            updateUI();
            loadSkinsShop();

            // вњ… CRITICAL: Force immediate save to prevent balance rollback
            triggerAutoSave(true); // Force critical save

            // Also save directly via API to ensure balance is persisted
            if (window.TELEGRAM_USER_ID && typeof TAMA_API_BASE !== 'undefined') {
                fetch(`${TAMA_API_BASE}/leaderboard/upsert`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: window.TELEGRAM_USER_ID,
                        tama: balanceAfter,
                        level: gameState.level,
                        xp: gameState.xp
                    })
                }).catch(err => console.warn('вљ пёЏ Failed to save balance after skin purchase:', err));
            }

            // Success animation
            const card = event.target.closest('.skin-card-shop');
            if (card) {
                card.classList.add('purchase-success');
                setTimeout(() => card.classList.remove('purchase-success'), 500);
            }
        }

        // Equip skin
        function equipSkin(skinId) {
            if (!gameState.ownedSkins.includes(skinId)) {
                showMessage('вќЊ You don\'t own this skin!');
                return;
            }

            gameState.equippedSkin = skinId;

            // Apply skin (switch pet visual)
            switchPet(skinId);

            showMessage(`вњ… Equipped ${getSkin(skinId).name}!`);
            loadSkinsShop();
            loadOwnedSkinsShop(); // Update owned skins tab
            triggerAutoSave();
        }

        // Load owned skins (My Skins tab)
        function loadOwnedSkinsShop() {
            const ownedGrid = document.getElementById('owned-skins-grid');
            const ownedCount = document.getElementById('owned-count');

            if (!ownedGrid) return;

            ownedGrid.innerHTML = '';

            const ownedSkins = gameState.ownedSkins || [];
            ownedCount.textContent = ownedSkins.length;

            if (ownedSkins.length === 0) {
                ownedGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #718096;">
                        <div style="font-size: 80px; margin-bottom: 20px;">рџў</div>
                        <p style="font-size: 20px; margin-bottom: 10px;">You don't have any skins yet</p>
                        <p style="font-size: 14px;">Buy them in the "Buy Skins" tab</p>
                    </div>
                `;
                return;
            }

            // Show owned skins
            ownedSkins.forEach(skinId => {
                const skin = getSkin(skinId);
                if (!skin) return;

                const isEquipped = gameState.equippedSkin === skinId;

                const emojiMap = {
                    'kawai': 'рџЊё', 'retro': 'рџ•№пёЏ', 'neko': 'рџђ±', 'cyber': 'рџ¤–',
                    'premium': 'в­ђ', 'alien': 'рџ‘Ѕ', 'kitsune': 'рџ¦Љ',
                    'santa': 'рџЋ…', 'snowman': 'в›„', 'reindeer': 'рџ¦Њ', 'tree': 'рџЋ„'
                };

                const skinCard = document.createElement('div');
                skinCard.className = `skin-card-shop owned ${isEquipped ? 'equipped' : ''}`;
                skinCard.style.cursor = 'pointer';

                skinCard.innerHTML = `
                    <div class="rarity-badge rarity-${skin.rarity}">${skin.rarityLabel || skin.rarity.toUpperCase()}</div>
                    <div class="skin-preview" style="font-size: 80px; margin: 20px 0;">${emojiMap[skin.id] || 'рџЋЁ'}</div>
                    <div class="skin-name">${skin.name}</div>
                    <div class="skin-price" style="color: #22c55e;">вњ“ Owned</div>
                    <div class="skin-bonus">${skin.bonusEn || skin.bonusRu}</div>
                    ${isEquipped ?
                        '<button class="skin-buy-btn equipped">вњ“ Equipped</button>' :
                        '<button class="skin-buy-btn owned" onclick="equipSkin(\'' + skin.id + '\')">Equip</button>'}
                    ${isEquipped ? '<div class="owned-badge">EQUIPPED</div>' : ''}
                `;

                if (!isEquipped) {
                    skinCard.onclick = () => equipSkin(skinId);
                }

                ownedGrid.appendChild(skinCard);
            });
        }

        // ==================== PET SELECTION SYSTEM ====================

        function openPetSelector() {
            const petSelector = document.getElementById('pet-selector');
            const petList = document.getElementById('pet-list');

            petList.innerHTML = '';

            Object.keys(PET_TYPES).forEach(petKey => {
                const pet = PET_TYPES[petKey];
                const isOwned = gameState.ownedPets.includes(petKey);
                const isSelected = gameState.selectedPet === petKey;

                const petCard = document.createElement('div');
                petCard.style.cssText = `
                    background: ${isSelected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(74, 85, 104, 0.3)'};
                    border: 2px solid ${isSelected ? '#10b981' : '#4a5568'};
                    border-radius: 10px;
                    padding: 15px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                `;

                petCard.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 5px;">${pet.emoji}</div>
                    <div style="font-weight: bold; margin-bottom: 3px;">${pet.name}</div>
                    <div style="font-size: 11px; opacity: 0.8; margin-bottom: 5px;">${pet.description}</div>
                    <div style="font-size: 12px; color: #fbbf24;">${isOwned ? (isSelected ? 'вњ“ Selected' : 'Select') : `${pet.price} TAMA`}</div>
                `;

                petCard.addEventListener('click', () => selectPet(petKey, isOwned));
                petList.appendChild(petCard);
            });

            petSelector.style.display = 'block';
        }

        function selectPet(petKey, isOwned) {
            const pet = PET_TYPES[petKey];

            if (!isOwned) {
                // Buy pet
                if (gameState.tama < pet.price) {
                    showMessage(`вќЊ Not enough TAMA! Need ${pet.price} TAMA`);
                    return;
                }

                gameState.tama -= pet.price;
                gameState.ownedPets.push(petKey);
                showMessage(`рџЋ‰ You bought ${pet.name}!`);
            }

            // Select pet
            gameState.selectedPet = petKey;
            gameState.petType = petKey;

            // Apply pet bonuses
            applyPetBonuses();

            updateUI();
            triggerAutoSave();
            openPetSelector(); // Refresh selector
            showMessage(`вњ… ${pet.name} selected! ${pet.description}`);

            playSound('select');
        }

        function applyPetBonuses() {
            const pet = PET_TYPES[gameState.selectedPet];

            // Reset to base values
            gameState.maxHp = 100;
            gameState.maxFood = 100;
            gameState.maxHappy = 100;
            gameState.clickPower = 1;

            // Apply bonuses
            if (pet.hpBonus) gameState.maxHp += pet.hpBonus;
            if (pet.foodBonus) gameState.maxFood += pet.foodBonus;
            if (pet.happyBonus) gameState.maxHappy += pet.happyBonus;
            if (pet.clickPower) gameState.clickPower *= pet.clickPower;

            // Cap current values to max
            gameState.hp = Math.min(gameState.hp, gameState.maxHp);
            gameState.food = Math.min(gameState.food, gameState.maxFood);
            gameState.happy = Math.min(gameState.happy, gameState.maxHappy);
        }

        // ==================== SOUND SYSTEM ====================

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let soundEnabled = true;

        // Sound system disabled - all sounds removed per user request
        function playSound(type) {
            // Sounds disabled
            return;
        }

        // Auto-feeder logic
        let lastAutoFeed = 0; // Track last auto-feed time
        setInterval(() => {
            if (gameState.hasAutoFeeder && gameState.food < 30) {
                const now = Date.now();
                // Cooldown: only auto-feed once per minute
                if (now - lastAutoFeed > 60000) {
                gameState.food = Math.min(gameState.maxFood, gameState.food + 20);
                showMessage('рџ’Ћ Auto-Feeder activated! +20 Food');
                    lastAutoFeed = now;
                updateUI();
                }
            }
        }, 10000); // Check every 10 seconds

        // рџЋЃ REFERRAL SYSTEM: Check for referral code on page load
        async function checkReferralCode() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const refCode = urlParams.get('ref');

                if (refCode && refCode.startsWith('TAMA')) {
                    // [cleaned]

                    // Get current user info
                    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
                    if (!telegramUser?.id) {
                        // [cleaned]
                        return;
                    }

                    const currentUserId = String(telegramUser.id);

                    // Find referrer by referral code
                    const referrerResponse = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?referral_code=eq.${refCode}&select=telegram_id,telegram_username`, {
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        }
                    });

                    const referrerData = await referrerResponse.json();

                    if (referrerData && referrerData.length > 0) {
                        const referrerId = referrerData[0].telegram_id;
                        const referrerUsername = referrerData[0].telegram_username;

                        // Check if this is not self-referral
                        if (referrerId !== currentUserId) {
                            // [cleaned]

                            // Check if referral already exists
                            const existingRefResponse = await fetch(`${SUPABASE_URL}/rest/v1/referrals?referrer_telegram_id=eq.${referrerId}&referred_telegram_id=eq.${currentUserId}`, {
                                headers: {
                                    'apikey': SUPABASE_ANON_KEY,
                                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                                }
                            });

                            const existingRefs = await existingRefResponse.json();

                            if (existingRefs && existingRefs.length > 0) {
                                // [cleaned]
                                // [cleaned]
                            } else {
                                // [cleaned]
                                // [cleaned]');
                            }

                            // Always award TAMA to referrer (even if referral was created by bot)
                            try {
                                // [cleaned]

                                // Get current TAMA balance
                                const currentBalanceResponse = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${referrerId}&select=tama`, {
                                    headers: {
                                        'apikey': SUPABASE_ANON_KEY,
                                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                                    }
                                });

                                const currentBalanceData = await currentBalanceResponse.json();
                                const currentTama = currentBalanceData && currentBalanceData.length > 0 ? (currentBalanceData[0].tama || 0) : 0;
                                const newTama = currentTama + 1000;

                                // рџ›ЎпёЏ SECURITY: Use API instead of direct Supabase access to prevent cheating
                                const updateResponse = await fetch(`${TAMA_API_BASE}/leaderboard/upsert`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        user_id: referrerId,
                                        tama: newTama,
                                        level: referrerData.level || 1,
                                        xp: referrerData.xp || 0,
                                        pet_name: referrerData.pet_name || 'Gotchi',
                                        pet_type: referrerData.pet_type || 'kawai',
                                        skip_transaction_log: true // We'll log referral bonus separately
                                    })
                                });

                                if (updateResponse.ok) {
                                    // [cleaned]
                                    showNotification("рџЋ‰ Referral successful! Your referrer earned 1,000 TAMA!");
                                } else {
                                    // [cleaned]
                                }
                            } catch (error) {
                                // [cleaned]
                            }
                        } else {
                            // [cleaned]
                        }
                    } else {
                        // [cleaned]
                    }
                }
            } catch (error) {
                console.error('вќЊ Error processing referral code:', error);
            }
        }

        // Initialize game
        async function initGame() {
            // Declare cloudLoaded outside try-catch so it's accessible in catch block
            let cloudLoaded = false;
            let userId = null;

            try {
                // вњ… РЈРњРќРћР• РћРџР Р•Р”Р•Р›Р•РќРР•: РџСЂРѕРІРµСЂСЏРµРј РїР°СЂР°РјРµС‚СЂ URL РґР»СЏ РїСЂРёРЅСѓРґРёС‚РµР»СЊРЅРѕРіРѕ РІС‹Р±РѕСЂР° РјРµС‚РѕРґР°
                const urlParams = new URLSearchParams(window.location.search);
                const forceAuth = urlParams.get('auth'); // 'telegram', 'wallet', РёР»Рё null

                // вњ… РџР РРћР РРўР•Рў 1: Wallet Р°РІС‚РѕСЂРёР·Р°С†РёСЏ (РµСЃР»Рё РїСЂРёРЅСѓРґРёС‚РµР»СЊРЅРѕ РёР»Рё Telegram РЅРµРґРѕСЃС‚СѓРїРµРЅ/РЅРµ Р°РІС‚РѕСЂРёР·РѕРІР°РЅ)
                // РџСЂРѕРІРµСЂСЏРµРј РЅРµ С‚РѕР»СЊРєРѕ РЅР°Р»РёС‡РёРµ Telegram WebApp, РЅРѕ Рё РЅР°Р»РёС‡РёРµ user ID
                const hasTelegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user?.id ||
                                       (window.Telegram?.WebApp?.initData && window.Telegram.WebApp.initData.includes('user='));

                if ((forceAuth === 'wallet' || (forceAuth !== 'telegram' && !hasTelegramUser)) && window.WalletAuth) {
                    // [cleaned]
                    const walletInit = await window.WalletAuth.init();

                    if (walletInit.success && walletInit.walletAddress) {
                        // [cleaned]
                        window.WALLET_ADDRESS = walletInit.walletAddress;
                        window.WALLET_USER_ID = walletInit.userData?.user_id || 'wallet_' + walletInit.walletAddress.substring(0, 12);

                        // вљЎ PARALLEL LOADING: Load referral and game state simultaneously
                        const [referralResult, walletData] = await Promise.allSettled([
                            // Referral processing (non-blocking)
                            window.ReferralSystem ? window.ReferralSystem.processReferralBonus(walletInit.walletAddress) : Promise.resolve(),
                            // Game state loading (critical)
                            window.WalletSave && typeof window.WalletSave.load === 'function' ? window.WalletSave.load() : Promise.resolve(null)
                        ]);

                        // Process game state
                        if (walletData.status === 'fulfilled' && walletData.value && walletData.value.exists) {
                            const data = walletData.value;
                            gameState.tama = data.tama || gameState.tama;
                            gameState.level = data.level || gameState.level;
                            gameState.xp = data.xp || gameState.xp;
                            gameState.totalClicks = data.clicks || gameState.totalClicks;
                            if (data.pet_name) gameState.petName = data.pet_name;
                            if (data.pet_type) gameState.petType = data.pet_type;
                            // вњ… Load quest completion status
                            if (data.questClicksCompleted !== undefined) gameState.questClicksCompleted = data.questClicksCompleted;
                            if (data.questLevelCompleted !== undefined) gameState.questLevelCompleted = data.questLevelCompleted;
                            cloudLoaded = true;
                            // [cleaned]
                        } else {
                            // [cleaned]
                        }

                        // рџЋ“ Start onboarding for new users
                        if (window.OnboardingTutorial && !cloudLoaded) {
                            setTimeout(() => {
                                window.OnboardingTutorial.start();
                            }, 1000);
                        }
                    } else if (walletInit.needsConnection) {
                        // Show wallet connection modal
                        // [cleaned]
                        const modal = document.getElementById('wallet-connect-modal');
                        if (modal) {
                            modal.style.display = 'flex';
                        }
                    }
                }

                // вњ… РџР РРћР РРўР•Рў 2: Telegram Р°РІС‚РѕСЂРёР·Р°С†РёСЏ (РµСЃР»Рё РґРѕСЃС‚СѓРїРЅР° Рё РЅРµ РїСЂРёРЅСѓРґРёС‚РµР»СЊРЅРѕ wallet)
                if (!cloudLoaded && (forceAuth === 'telegram' || (!forceAuth && hasTelegramUser))) {
                    // Debug: Log Telegram WebApp state
                    // [cleaned] + '...',
                        initDataUnsafe: window.Telegram?.WebApp?.initDataUnsafe,
                        user: window.Telegram?.WebApp?.initDataUnsafe?.user
                    });

                    if (window.Telegram && window.Telegram.WebApp) {
                    // Method 1: Try initDataUnsafe.user
                    const user = window.Telegram.WebApp.initDataUnsafe?.user;
                    if (user && user.id) {
                        // вљ пёЏ CRITICAL: Always convert to string for consistency
                        userId = String(user.id);
                        // [cleaned]
                    } else {
                        // Method 2: Try parsing initData manually
                        const initData = window.Telegram.WebApp.initData;
                        if (initData) {
                            // [cleaned]
                            try {
                                const params = new URLSearchParams(initData);
                                const userParam = params.get('user');
                                if (userParam) {
                                    const parsedUser = JSON.parse(decodeURIComponent(userParam));
                                    // вљ пёЏ CRITICAL: Always convert to string for consistency
                                    userId = String(parsedUser.id || '');
                                    // [cleaned]
                                }
                            } catch (e) {
                                console.error('вќЊ Failed to parse initData:', e);
                            }
                        }
                    }

                    if (userId) {
                        // вљ пёЏ CRITICAL: Always store as string for consistency
                        const userIdStr = String(userId);
                        // [cleaned]
                        // [cleaned]

                        cloudLoaded = await loadFromSupabase(userIdStr);

                        // Store userId globally for leaderboard (always as string)
                        window.TELEGRAM_USER_ID = userIdStr;

                        // вљЎ Load rank immediately (no delay needed)
                        if (rankDisplay && (!rankDisplay.textContent || rankDisplay.textContent === '#---')) {
                            loadLeaderboard().catch(() => {
                                // [cleaned]
                            });
                        }
                    } else {
                        console.warn('вљ пёЏ Could not get user ID from Telegram WebApp');
                        console.warn('   Offering wallet connection as alternative');
                        // Telegram WebApp РµСЃС‚СЊ, РЅРѕ user ID РЅРµ РїРѕР»СѓС‡РµРЅ - РїСЂРµРґР»Р°РіР°РµРј wallet
                        if (!window.WALLET_ADDRESS && window.WalletAuth) {
                            const modal = document.getElementById('wallet-connect-modal');
                            if (modal && modal.style.display !== 'flex') {
                                modal.style.display = 'flex';
                                // [cleaned]');
                            }
                        }
                    }
                    }
                } else {
                    // Telegram WebApp РЅРµРґРѕСЃС‚СѓРїРµРЅ - РїСЂРµРґР»Р°РіР°РµРј wallet
                    if (!window.WALLET_ADDRESS && window.WalletAuth) {
                        console.warn('вљ пёЏ Telegram WebApp not available - offering wallet connection');
                        const modal = document.getElementById('wallet-connect-modal');
                        if (modal && modal.style.display !== 'flex') {
                            modal.style.display = 'flex';
                            // [cleaned]');
                        }
                    } else if (window.WALLET_ADDRESS) {
                        // [cleaned]');
                    } else {
                        console.warn('вљ пёЏ No authentication method available - game will work with localStorage only');
                    }
                }

                // Fallback to localStorage ONLY if cloud load failed
                if (!cloudLoaded) {
                    // [cleaned]');
                    const localLoaded = loadFromLocalStorage();
                    if (localLoaded) {
                        // [cleaned]
                        // вњ… Update player name display after loading from localStorage
                        if (typeof updatePlayerNameDisplay === 'function') {
                            setTimeout(() => updatePlayerNameDisplay(), 100);
                        }
                    } else {
                        // [cleaned]
                        // [cleaned]
                        // Initialize with default values
                        if (typeof updateUI === 'function') {
                            updateUI();
                        }
                    }
                } else {
                    // [cleaned] - localStorage ignored');
                    // Don't load from localStorage if Supabase data is available
                }

                // Always update UI after initialization
                if (typeof updateUI === 'function') {
                updateUI();
                    // [cleaned]
                } else {
                    console.error('вќЊ updateUI function not found!');
                }

                // вљЎ PARALLEL: Update UI elements and load leaderboard simultaneously
                const uiUpdates = [
                    // Update player name (immediate, no delay needed)
                    typeof updatePlayerNameDisplay === 'function' ? updatePlayerNameDisplay() : Promise.resolve(),
                    // Update quest progress
                    checkQuests(),
                    // Load leaderboard (non-blocking)
                    loadLeaderboard().catch(() => {
                        // [cleaned]
                    })
                ];

                // Don't await - let them run in parallel
                Promise.allSettled(uiUpdates);

                if (cloudLoaded) {
                    showMessage('вЃпёЏ Cloud progress loaded!');
                } else {
                    showMessage('рџ‘‹ Welcome! Click your pet to earn TAMA!');
                }

                // Check for first time player
                setTimeout(() => {
                    if (gameState.totalClicks === 0) {
                        showMessage('рџ’Ў TIP: Click rapidly for COMBO bonuses! рџ”Ґ');
                    }
                }, 5000);
            } catch (error) {
                console.error('Init game error:', error);
                // вљ пёЏ IMPORTANT: Only load from localStorage if Supabase failed
                // If cloudLoaded was successful, don't overwrite with localStorage!
                if (!cloudLoaded) {
                    // [cleaned]
                    loadFromLocalStorage();
                } else {
                    // [cleaned]
                }
                updateUI();
            }
        }

        // Load game data from Supabase
        async function loadFromSupabase(userId) {
            try {
                // вљ пёЏ CRITICAL: Ensure userId is always a string for consistent querying
                const userIdStr = String(userId);
                // [cleaned]');

                const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${userIdStr}&select=*`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                if (!response.ok) {
                    console.error('вќЊ Supabase response not OK:', response.status, response.statusText);
                    throw new Error(`Failed to fetch from Supabase: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                // [cleaned]
                // [cleaned] for user', userIdStr);

                if (data && data.length > 0) {
                    // вљ пёЏ If multiple records, use the most recent one (by last_activity or id)
                    const userData = data.length > 1
                        ? data.sort((a, b) => (b.last_activity || b.id || 0) - (a.last_activity || a.id || 0))[0]
                        : data[0];

                    // [cleaned]

                    // вљ пёЏ CRITICAL: Verify telegram_id matches (in case of type mismatch)
                    const dbTelegramId = String(userData.telegram_id || '');
                    if (dbTelegramId !== userIdStr) {
                        console.error('вќЊ TELEGRAM ID MISMATCH!', {
                            requested: userIdStr,
                            found: dbTelegramId,
                            error: 'This should never happen!'
                        });
                    }

                    // Load TAMA and Level from Supabase (PRIMARY SOURCE OF TRUTH!)
                    gameState.tama = Number(userData.tama) || 0;
                    gameState.level = Number(userData.level) || 1; // Use actual level from DB, not calculated!
                    gameState.xpToLevel = gameState.level * 100;

                    // вњ… Load custom username from Supabase (if user changed it)
                    if (userData.telegram_username) {
                        gameState.customUsername = userData.telegram_username;
                        // [cleaned]
                    }

                    // Try to parse pet_data if exists
                    if (userData.pet_data) {
                        try {
                            // pet_data might already be an object or a JSON string
                            let petData;
                            if (typeof userData.pet_data === 'string') {
                                petData = JSON.parse(userData.pet_data);
                            } else if (typeof userData.pet_data === 'object') {
                                petData = userData.pet_data;
                            } else {
                                throw new Error('pet_data is neither string nor object');
                            }
                            gameState.hp = petData.hp || 100;
                            gameState.food = petData.food || 100;
                            gameState.happy = petData.happy || 100;
                            gameState.totalClicks = petData.totalClicks || 0;
                            gameState.achievements = petData.achievements || [];

                            // вњ… FIX: Load quest flags to prevent duplicate rewards
                            gameState.questClicks = petData.questClicks || 0;
                            gameState.questClicksCompleted = petData.questClicksCompleted || false;
                            gameState.questLevelCompleted = petData.questLevelCompleted || false;

                            // Also load XP if available
                            if (petData.xp !== undefined) {
                                gameState.xp = petData.xp;
                            }
                        } catch (e) {
                            // [cleaned]
                        }
                    }

                    // [cleaned]:', userData);
                    // [cleaned]

                    // вљ пёЏ IMPORTANT: Save to localStorage as backup, but Supabase is source of truth
                    // This ensures localStorage is synced with Supabase, not the other way around
                    saveToLocalStorage();

                    // вњ… Update player name display after loading from Supabase
                    // Use setTimeout to ensure function is defined and DOM is ready
                    setTimeout(() => {
                        if (typeof updatePlayerNameDisplay === 'function') {
                            updatePlayerNameDisplay();
                        }
                    }, 300);

                    return true;
                }
            } catch (error) {
                console.error('Error loading from Supabase:', error);
            }
            return false;
        }

        // Save game when page is about to close
        window.addEventListener('beforeunload', () => {
            // вљ пёЏ IMPORTANT: Wallet/Telegram is PRIMARY, localStorage is backup
            if (window.WALLET_ADDRESS && window.WalletSave) {
                // Try to save via wallet API first
                window.WalletSave.save(gameState).catch(err => {
                    console.error('Wallet save on unload failed:', err);
                });
            } else if (window.TELEGRAM_USER_ID) {
                // Try to save to Supabase (primary)
                saveDirectToSupabase(window.TELEGRAM_USER_ID).then(() => {
                    // Save to localStorage as backup
                    saveToLocalStorage();
                }).catch(() => {
                    // Fallback to localStorage if Supabase fails
                    saveToLocalStorage();
                });
            } else {
                saveToLocalStorage();
            }
        });

        // Save game when page becomes hidden (mobile)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // вљ пёЏ IMPORTANT: Supabase is PRIMARY, localStorage is backup
                const userId = window.TELEGRAM_USER_ID;
                if (userId) {
                    // Try to save to Supabase first (primary)
                    saveDirectToSupabase(userId).then(() => {
                        // Save to localStorage as backup
                        saveToLocalStorage();
                    }).catch(() => {
                        // Fallback to localStorage if Supabase fails
                        saveToLocalStorage();
                    });
                } else {
                    saveToLocalStorage();
                }
            }
        });

        // Send data to Telegram Bot
        function sendDataToBot(action, data) {
            if (window.Telegram && window.Telegram.WebApp) {
                try {
                    const messageData = {
                        action: action,
                        data: data,
                        timestamp: Date.now()
                    };

                    // Show auto-save indicator
                    showAutoSaveIndicator();

                    // Send to Telegram WebApp
                    window.Telegram.WebApp.sendData(JSON.stringify(messageData));

                    // [cleaned]
                } catch (error) {
                    console.error('Error sending data to bot:', error);
                    showAutoSaveIndicator('error');
                }
            } else {
                // [cleaned]
                showAutoSaveIndicator('saved');
            }
        }

        // Auto-save indicator (simplified - only show errors)
        function showAutoSaveIndicator(status = 'saving') {
            // Only show errors, not every save
            if (status === 'error') {
                const indicator = document.getElementById('auto-save-indicator');
                const statusElement = indicator.querySelector('.save-status');

                indicator.className = `auto-save-indicator show error`;
                statusElement.textContent = 'вќЊ Save failed';

                setTimeout(() => {
                    indicator.classList.remove('show');
                }, 3000);
            }
            // For 'saving' and 'saved' - do nothing (silent save)
        }

        // Enhanced auto-save system with local backup

        // Log transaction directly to Supabase
        async function logTransaction(type, amount, balanceBefore, balanceAfter, metadata = {}) {
            if (!window.TELEGRAM_USER_ID) return;

            try {
                const username = window.Telegram?.WebApp?.initDataUnsafe?.user?.username || window.TELEGRAM_USER_ID;

                const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        user_id: window.TELEGRAM_USER_ID,
                        username: username,
                        type: type,
                        amount: amount,
                        balance_before: balanceBefore,
                        balance_after: balanceAfter,
                        metadata: metadata
                    })
                });

                if (response.ok) {
                    // [cleaned]
                } else {
                    console.warn(`вљ пёЏ Failed to log transaction: ${type}`, await response.text());
                }
            } catch (error) {
                console.warn('вљ пёЏ Error logging transaction:', error);
            }
        }

        // Save game data via our API
        async function saveDirectToSupabase(userId) {
            try {
                // вљ пёЏ CRITICAL: Ensure userId is always a string for consistency
                const userIdStr = String(userId);
                // [cleaned]');
                // [cleaned]

                // Prepare pet_data JSON
                const pet_data = {
                    hp: gameState.hp,
                    food: gameState.food,
                    happy: gameState.happy,
                    totalClicks: gameState.totalClicks,
                    maxCombo: gameState.maxCombo,
                    xp: gameState.xp,
                    achievements: gameState.achievements,
                    selectedPet: gameState.selectedPet,
                    ownedPets: gameState.ownedPets,
                    petType: gameState.petType,
                    hasAutoFeeder: gameState.hasAutoFeeder,
                    // вњ… FIX: Save quest flags to prevent duplicate rewards
                    questClicks: gameState.questClicks,
                    questClicksCompleted: gameState.questClicksCompleted,
                    questLevelCompleted: gameState.questLevelCompleted
                };

                // Get username from Telegram (default) or use custom username if set
                const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
                const defaultUsername = telegramUser?.username || telegramUser?.first_name || `User${userIdStr}`;

                // вљ пёЏ IMPORTANT: Use custom username if set, otherwise use Telegram username
                // This prevents overwriting custom names on auto-save
                const username = gameState.customUsername || defaultUsername;
                // [cleaned]');

                // Save via our API (proper way!)
                // Use skip_transaction_log: true to avoid duplicate logging
                // (we log transactions immediately when actions happen)
                const apiUrl = `${TAMA_API_BASE}/leaderboard/upsert`;
                const requestBody = {
                    user_id: userIdStr,  // вљ пёЏ Always use string
                        user_type: 'telegram',
                        telegram_username: username,  // вњ… Use custom or default username
                        tama: gameState.tama,
                        level: gameState.level,
                        xp: gameState.xp,
                        pet_data: pet_data,
                        pet_name: gameState.petType || 'Gotchi',
                        pet_type: gameState.petType || 'kawai',
                        skip_transaction_log: false  // вљ пёЏ CRITICAL: Set to false to enable balance protection!
                };

                // [cleaned]

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    const result = await response.json();
                    // [cleaned]
                    return true;
                } else {
                    const error = await response.text();
                    console.error('вќЊ API save failed:', response.status, error);
                    return false;
                }
            } catch (error) {
                console.error('вќЊ Error saving via API:', error);
                return false;
            }
        }

        // Check if game state has changed since last save
        function hasStateChanged() {
            const currentState = {
                tama: gameState.tama,
                level: gameState.level,
                xp: gameState.xp,
                hp: gameState.hp,
                food: gameState.food,
                happy: gameState.happy,
                totalClicks: gameState.totalClicks,
                maxCombo: gameState.maxCombo,
                achievements: JSON.stringify(gameState.achievements.sort())
            };

            if (!lastSavedState) {
                return true; // First save, always save
            }

            // Compare critical fields
            return (
                currentState.tama !== lastSavedState.tama ||
                currentState.level !== lastSavedState.level ||
                currentState.xp !== lastSavedState.xp ||
                currentState.totalClicks !== lastSavedState.totalClicks ||
                currentState.maxCombo !== lastSavedState.maxCombo ||
                currentState.achievements !== lastSavedState.achievements ||
                Math.abs(currentState.hp - lastSavedState.hp) > 1 || // HP changes gradually
                Math.abs(currentState.food - lastSavedState.food) > 1 || // Food changes gradually
                Math.abs(currentState.happy - lastSavedState.happy) > 1 // Happy changes gradually
            );
        }

        // Check if changes are critical (tama, clicks) - need faster save
        function hasCriticalChanges() {
            if (!lastSavedState) return false;

            return (
                gameState.tama !== lastSavedState.tama ||
                gameState.totalClicks !== lastSavedState.totalClicks ||
                gameState.level !== lastSavedState.level
            );
        }

        function triggerAutoSave(forceCritical = false) {
            const now = Date.now();

            // Check if state has changed (optimization to reduce unnecessary API calls)
            if (!hasStateChanged()) {
                if (!forceCritical) {
                    // [cleaned]
                    return; // No changes, skip save
                }
            }

            // Determine cooldown based on change type
            const isCriticalChange = forceCritical || hasCriticalChanges();
            const cooldown = isCriticalChange ? CRITICAL_SAVE_COOLDOWN : SAVE_COOLDOWN;

            // Check cooldown
            if (now - lastSaveTime < cooldown) {
                if (isCriticalChange) {
                    pendingCriticalSave = true; // Mark for save after cooldown
                    // Schedule save after cooldown expires
                    setTimeout(() => {
                        if (pendingCriticalSave && hasStateChanged()) {
                            pendingCriticalSave = false;
                            triggerAutoSave(true);
                        }
                    }, cooldown - (now - lastSaveTime));
                }
                return; // Still in cooldown
            }

            // Clear pending flag
            pendingCriticalSave = false;

            // вњ… РџР РРћР РРўР•Рў 1: Wallet (РґР»СЏ СЃС‚СЂР°РЅ Р±РµР· Telegram)
            if (window.WALLET_ADDRESS && window.WalletSave) {
                // [cleaned]

                // рџ“Љ Track wallet activity for DappRadar
                if (window.DappRadarTracker) {
                    window.DappRadarTracker.trackWalletActivity(window.WALLET_ADDRESS);
                }

                window.WalletSave.save(gameState).then(success => {
                    if (success) {
                        // [cleaned]');
                        lastSaveTime = Date.now(); // Update save time
                        // Update last saved state
                        lastSavedState = {
                            tama: gameState.tama,
                            level: gameState.level,
                            xp: gameState.xp,
                            hp: gameState.hp,
                            food: gameState.food,
                            happy: gameState.happy,
                            totalClicks: gameState.totalClicks,
                            maxCombo: gameState.maxCombo,
                            achievements: JSON.stringify(gameState.achievements.sort())
                        };
                        saveToLocalStorage(); // Backup
                    } else {
                        console.warn('вљ пёЏ Wallet save failed, using localStorage');
                        saveToLocalStorage();
                    }
                }).catch(error => {
                    console.error('вќЊ Wallet save error:', error);
                    saveToLocalStorage();
                });
            }
            // вњ… РџР РРћР РРўР•Рў 2: Telegram (РґР»СЏ РѕСЃС‚Р°Р»СЊРЅС‹С… РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№)
            else if (window.TELEGRAM_USER_ID) {
                // вљ пёЏ IMPORTANT: Supabase is PRIMARY, localStorage is backup
                // Save to Supabase FIRST (primary source of truth)
                saveDirectToSupabase(window.TELEGRAM_USER_ID).then(success => {
                    if (success) {
                        // [cleaned]');
                        // Update last saved state
                        lastSavedState = {
                            tama: gameState.tama,
                            level: gameState.level,
                            xp: gameState.xp,
                            hp: gameState.hp,
                            food: gameState.food,
                            happy: gameState.happy,
                            totalClicks: gameState.totalClicks,
                            maxCombo: gameState.maxCombo,
                            achievements: JSON.stringify(gameState.achievements.sort())
                        };
                        // Only save to localStorage AFTER successful Supabase save (as backup)
                        saveToLocalStorage();
                    } else {
                        console.warn('вљ пёЏ Auto-save to Supabase failed, saving to localStorage as backup');
                        saveToLocalStorage();
                    }
                }).catch(error => {
                    console.error('вќЊ Auto-save error:', error);
                    // Fallback to localStorage if Supabase fails
                    saveToLocalStorage();
                });
            }
            // вњ… РџР РРћР РРўР•Рў 3: LocalStorage (fallback)
            else {
                console.warn('вљ пёЏ No user ID or wallet, saving only to localStorage', {
                    hasWalletAddress: !!window.WALLET_ADDRESS,
                    hasWalletSave: !!window.WalletSave,
                    hasTelegramId: !!window.TELEGRAM_USER_ID,
                    hasWalletUserId: !!window.WALLET_USER_ID
                });
                saveToLocalStorage();
            }

                lastSaveTime = now;
        }

        // Local storage functions
        function saveToLocalStorage() {
            try {
                const saveData = {
                    level: gameState.level,
                    xp: gameState.xp,
                    xpToLevel: gameState.xpToLevel,
                    tama: gameState.tama,
                    hp: gameState.hp,
                    maxHp: gameState.maxHp,
                    food: gameState.food,
                    maxFood: gameState.maxFood,
                    happy: gameState.happy,
                    maxHappy: gameState.maxHappy,
                    clickPower: gameState.clickPower,
                    petType: gameState.petType,
                    totalClicks: gameState.totalClicks,
                    combo: gameState.combo,
                    maxCombo: gameState.maxCombo,
                    questClicks: gameState.questClicks,
                    questClicksCompleted: gameState.questClicksCompleted,
                    questLevelCompleted: gameState.questLevelCompleted,
                    achievements: gameState.achievements,
                    hasAutoFeeder: gameState.hasAutoFeeder,
                    boosterActive: gameState.boosterActive,
                    boosterEndTime: gameState.boosterEndTime,
                    customUsername: gameState.customUsername,  // вњ… Save custom username
                    lastSave: Date.now()
                };
                // рџ”‘ Use user-specific key to prevent data conflicts between accounts
                const userId = window.TELEGRAM_USER_ID || window.WALLET_ADDRESS || 'default';
                const storageKey = `tamagotchi_save_${userId}`;
                localStorage.setItem(storageKey, JSON.stringify(saveData));
                // [cleaned]
            } catch (error) {
                console.error('Failed to save to localStorage:', error);
            }
        }

        function loadFromLocalStorage() {
            try {
                // рџ”‘ Use user-specific key to load correct user's data
                const userId = window.TELEGRAM_USER_ID || window.WALLET_ADDRESS || 'default';
                const storageKey = `tamagotchi_save_${userId}`;
                // [cleaned]
                const saveData = localStorage.getItem(storageKey);
                if (saveData) {
                    const data = JSON.parse(saveData);

                    // Only load if save is recent (within 7 days)
                    if (data.lastSave && (Date.now() - data.lastSave) < 7 * 24 * 60 * 60 * 1000) {
                        gameState.level = data.level || 1;
                        gameState.xp = data.xp || 0;
                        gameState.xpToLevel = data.xpToLevel || 100;
                        gameState.tama = data.tama || 0;
                        gameState.hp = data.hp || 100;
                        gameState.maxHp = data.maxHp || 100;
                        gameState.food = data.food || 100;
                        gameState.maxFood = data.maxFood || 100;
                        gameState.happy = data.happy || 100;
                        gameState.maxHappy = data.maxHappy || 100;
                        // вљ пёЏ FIX: clickPower should always be 1.0 (economy controlled via Admin Panel)
                        // Reset if it was incorrectly set to level value
                        gameState.clickPower = (data.clickPower && data.clickPower <= 2.0) ? data.clickPower : 1;
                        if (data.clickPower && data.clickPower > 2.0) {
                            console.warn(`вљ пёЏ Fixed clickPower: was ${data.clickPower}, reset to 1.0`);
                        }
                        gameState.petType = data.petType || 'рџђѕ';
                        gameState.totalClicks = data.totalClicks || 0;
                        gameState.combo = data.combo || 0;
                        gameState.maxCombo = data.maxCombo || 0;
                        gameState.questClicks = data.questClicks || 0;
                        gameState.questClicksCompleted = data.questClicksCompleted || false;
                        gameState.questLevelCompleted = data.questLevelCompleted || false;
                        gameState.achievements = data.achievements || [];
                        gameState.hasAutoFeeder = data.hasAutoFeeder || false;
                        gameState.boosterActive = data.boosterActive || false;
                        gameState.boosterEndTime = data.boosterEndTime || 0;

                        // вњ… Load custom username if saved
                        if (data.customUsername) {
                            gameState.customUsername = data.customUsername;
                            // [cleaned]
                        }

                        // [cleaned]
                        return true;
                    }
                }
            } catch (error) {
                console.error('Failed to load from localStorage:', error);
            }
            return false;
        }

        // ==================== LEADERBOARD SYSTEM ====================

        // Leaderboard DOM elements
        // ==================== MINI GAMES SYSTEM ====================

        const minigamesBtn = document.getElementById('minigames-btn');
        const minigamesModal = document.getElementById('minigames-modal');
        const closeMinigames = document.getElementById('close-minigames');
        const gameSelection = document.getElementById('game-selection');

        // [cleaned]

        // Open mini games
        if (minigamesBtn && minigamesModal) {
            minigamesBtn.addEventListener('click', () => {
                // [cleaned]
                minigamesModal.classList.add('show');
                showGameSelection();
            });
        } else {
            console.error('Mini games elements not found!');
        }

        // Close mini games
        if (closeMinigames && minigamesModal) {
            closeMinigames.addEventListener('click', () => {
                minigamesModal.classList.remove('show');
            });
        }

        // Close on background click
        if (minigamesModal) {
            minigamesModal.addEventListener('click', (e) => {
                if (e.target.id === 'minigames-modal') {
                    minigamesModal.classList.remove('show');
                }
            });
        }

        // Show game selection
        function showGameSelection() {
            document.querySelectorAll('.game-arena').forEach(arena => arena.classList.remove('active'));
            gameSelection.style.display = 'grid';
        }

        // Select game
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameName = card.dataset.game;

                // For luckyslots - open slots.html
                if (gameName === 'luckyslots') {
                    const userId = window.TELEGRAM_USER_ID || '';
                    window.open(`/slots.html?user_id=${userId}`, '_blank');
                    return;
                }

                // For wheel - open wheel.html
                if (gameName === 'wheel') {
                    const userId = window.TELEGRAM_USER_ID || '';
                    window.open(`/wheel.html?user_id=${userId}`, '_blank');
                    return;
                }

                // For platformer - open super-tama-bros.html
                if (gameName === 'platformer') {
                    const userId = window.TELEGRAM_USER_ID || '';
                    window.open(`/super-tama-bros.html?user_id=${userId}`, '_blank');
                    return;
                }

                // For colormatch - open tama-color-match.html
                if (gameName === 'colormatch') {
                    const userId = window.TELEGRAM_USER_ID || '';
                    window.open(`/tama-color-match.html?user_id=${userId}`, '_blank');
                    return;
                }

                // For shooter - open tama-shooter.html
                if (gameName === 'shooter') {
                    const userId = window.TELEGRAM_USER_ID || '';
                    window.open(`/tama-shooter.html?user_id=${userId}`, '_blank');
                    return;
                }

                gameSelection.style.display = 'none';
                document.getElementById(`${gameName}-arena`).classList.add('active');
            });
        });

        // Back to games
        function backToGames() {
            showGameSelection();
        }

        // рџЋЇ MEMORY MATCH GAME
        let memoryCards = [];
        let flippedCards = [];
        let matchedPairs = 0;

        function startMemoryGame() {
            if (gameState.tama < 50) {
                showMessage('вќЊ Not enough TAMA! Need 50 TAMA');
                return;
            }

            gameState.tama -= 50;
            updateUI();

            const emojis = ['рџђ±', 'рџђ¶', 'рџђ°', 'рџ¦Љ', 'рџђј', 'рџђё', 'рџ¦Ѓ', 'рџђЇ'];
            const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

            const board = document.getElementById('memory-board');
            board.innerHTML = '';
            memoryCards = [];
            flippedCards = [];
            matchedPairs = 0;

            cards.forEach((emoji, index) => {
                const card = document.createElement('div');
                card.style.cssText = 'background: #4a5568; border-radius: 8px; padding: 20px; font-size: 32px; text-align: center; cursor: pointer; transition: all 0.3s;';
                card.dataset.emoji = emoji;
                card.dataset.index = index;
                card.innerHTML = 'вќ“';
                card.addEventListener('click', () => flipCard(card, emoji, index));
                board.appendChild(card);
                memoryCards.push(card);
            });
        }

        function flipCard(card, emoji, index) {
            if (flippedCards.length === 2 || card.dataset.matched) return;

            card.innerHTML = emoji;
            card.style.background = '#10b981';
            flippedCards.push({ card, emoji, index });

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 500);
            }
        }

        function checkMatch() {
            const [first, second] = flippedCards;

            if (first.emoji === second.emoji) {
                first.card.dataset.matched = 'true';
                second.card.dataset.matched = 'true';
                matchedPairs++;

                if (matchedPairs === 8) {
                    const reward = 500;
                    gameState.tama += reward;
                    updateUI();
                    showMessage(`рџЋ‰ YOU WIN! +${reward} TAMA!`);
                    triggerAutoSave();
                }
            } else {
                first.card.innerHTML = 'вќ“';
                first.card.style.background = '#4a5568';
                second.card.innerHTML = 'вќ“';
                second.card.style.background = '#4a5568';
            }

            flippedCards = [];
        }

        // рџЋІ DICE GAME
        function rollDice() {
            if (gameState.tama < 30) {
                showMessage('вќЊ Not enough TAMA! Need 30 TAMA');
                return;
            }

            gameState.tama -= 30;
            updateUI();

            const diceDisplay = document.getElementById('dice-display');
            const diceResult = document.getElementById('dice-result');

            let rolls = 0;
            const interval = setInterval(() => {
                const dice = Math.floor(Math.random() * 6) + 1;
                diceDisplay.textContent = ['вљЂ', 'вљЃ', 'вљ‚', 'вљѓ', 'вљ„', 'вљ…'][dice - 1];
                rolls++;

                if (rolls === 10) {
                    clearInterval(interval);
                    const finalDice = Math.floor(Math.random() * 6) + 1;
                    diceDisplay.textContent = ['вљЂ', 'вљЃ', 'вљ‚', 'вљѓ', 'вљ„', 'вљ…'][finalDice - 1];

                    const reward = finalDice * 50;
                    gameState.tama += reward;
                    updateUI();
                    diceResult.textContent = `You rolled ${finalDice}! Won ${reward} TAMA! рџЋ‰`;
                    triggerAutoSave();
                }
            }, 100);
        }

        // ===========================================
        // рџ”Љ SOUND EFFECTS
        // ===========================================
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioCtx;

        // Withdrawal success sound
        let withdrawalSuccessSound = null;

        function playWithdrawalSuccessSound() {
            try {
                if (!withdrawalSuccessSound) {
                    withdrawalSuccessSound = new Audio('Soundroll-Twinkle-cute-upward-flourish.mp3');
                    withdrawalSuccessSound.volume = 0.5; // 50% volume
                    withdrawalSuccessSound.preload = 'auto';
                }

                // Reset to beginning and play
                withdrawalSuccessSound.currentTime = 0;
                withdrawalSuccessSound.play().catch(error => {
                    console.warn('Could not play withdrawal success sound:', error);
                    // Some browsers require user interaction first
                });
            } catch (error) {
                console.warn('Error playing withdrawal success sound:', error);
            }
        }

        // Initialize audio context on first user interaction
        function initAudio() {
            if (!audioCtx) {
                audioCtx = new AudioContext();
            }
        }

        const sounds = {
            // Spinning sound - fast beeps (during spin)
            spin: () => {
                if (!audioCtx) return;
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.frequency.value = 800;
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.08);
            },

            // Reel stop sound - mechanical click
            reelStop: () => {
                if (!audioCtx) return;
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.frequency.value = 150;
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.05);
            },

            // Win sound - rising cheerful tone
            win: () => {
                if (!audioCtx) return;
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.3);
            },

            // BIG WIN sound - multiple rising tones
            bigWin: () => {
                if (!audioCtx) return;
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const oscillator = audioCtx.createOscillator();
                        const gainNode = audioCtx.createGain();
                        oscillator.connect(gainNode);
                        gainNode.connect(audioCtx.destination);
                        oscillator.frequency.setValueAtTime(500 + (i * 150), audioCtx.currentTime);
                        oscillator.frequency.exponentialRampToValueAtTime(800 + (i * 200), audioCtx.currentTime + 0.2);
                        oscillator.type = 'sine';
                        gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                        oscillator.start(audioCtx.currentTime);
                        oscillator.stop(audioCtx.currentTime + 0.2);
                    }, i * 100);
                }
            },

            // JACKPOT sound - cascade of tones (like slot machine jackpot!)
            jackpot: () => {
                if (!audioCtx) return;
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => {
                        const oscillator = audioCtx.createOscillator();
                        const gainNode = audioCtx.createGain();
                        oscillator.connect(gainNode);
                        gainNode.connect(audioCtx.destination);
                        oscillator.frequency.value = 600 + (i * 150);
                        oscillator.type = 'sine';
                        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                        oscillator.start(audioCtx.currentTime);
                        oscillator.stop(audioCtx.currentTime + 0.15);
                    }, i * 80);
                }
            },

            // Loss sound - descending sad tone
            loss: () => {
                if (!audioCtx) return;
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);
                oscillator.type = 'sawtooth';
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.3);
            },

            // Wheel spinning sound - continuous whirr
            wheelSpin: () => {
                if (!audioCtx) return;
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
                oscillator.type = 'sawtooth';
                gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.5);
            }
        };

        // рџЋ° SLOT MACHINE
        function spinSlots() {
            if (gameState.tama < 100) {
                showMessage('вќЊ Not enough TAMA! Need 100 TAMA');
                return;
            }

            gameState.tama -= 100;

            // Log transaction for spending TAMA on slots
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'spend_slots', -100, 'Spent 100 TAMA to play Slot Machine', gameState);
            }

            updateUI();

            const slotsDisplay = document.getElementById('slots-display');
            const slotsResult = document.getElementById('slots-result');
            const symbols = ['рџЌ’', 'рџЌ‹', 'рџЌЉ', 'рџЌ‡', 'рџ’Ћ', 'в­ђ', '7пёЏвѓЈ'];

            let spins = 0;
            const interval = setInterval(() => {
                slotsDisplay.innerHTML = symbols.map(() =>
                    `<div>${symbols[Math.floor(Math.random() * symbols.length)]}</div>`
                ).join('');
                spins++;

                if (spins === 15) {
                    clearInterval(interval);
                    const result = [
                        symbols[Math.floor(Math.random() * symbols.length)],
                        symbols[Math.floor(Math.random() * symbols.length)],
                        symbols[Math.floor(Math.random() * symbols.length)]
                    ];
                    slotsDisplay.innerHTML = result.map(s => `<div>${s}</div>`).join('');

                    let reward = 0;
                    if (result[0] === result[1] && result[1] === result[2]) {
                        reward = result[0] === '7пёЏвѓЈ' ? 1000 : result[0] === 'рџ’Ћ' ? 500 : 200;
                        slotsResult.textContent = `рџЋ‰ JACKPOT! +${reward} TAMA!`;
                    } else if (result[0] === result[1] || result[1] === result[2]) {
                        reward = 50;
                        slotsResult.textContent = `Nice! +${reward} TAMA!`;
                    } else {
                        slotsResult.textContent = `Try again! рџ”`;
                    }

                    gameState.tama += reward;

                    // Log transaction for winning TAMA from slots
                    if (typeof logTransaction === 'function' && reward > 0) {
                        logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_slots', reward, `Won ${reward} TAMA from Slot Machine`, gameState);
                    }

                    updateUI();
                    triggerAutoSave();
                }
            }, 100);
        }

        // OLD SLOT MACHINE ABOVE - KEEPING FOR COMPATIBILITY
        // NEW GAMES BELOW рџЋ°рџЋЎрџЋІ

        // рџЋ° SLOT MACHINE 2.0 - IMPROVED WITH RTP CONTROL
        let slotsState = {
            betAmount: 100,
            spinning: false,
            wins: 0,
            losses: 0,
            totalWon: 0,
            isFullscreen: false
        };

        // Symbol weights (lower weight = rarer = higher payout)
        const slotSymbols = [
            { symbol: 'рџЌ’', weight: 30, payout: 2 },
            { symbol: 'рџЌ‹', weight: 25, payout: 2 },
            { symbol: 'рџЌЉ', weight: 25, payout: 2 },
            { symbol: 'рџЌ‡', weight: 20, payout: 3 },
            { symbol: 'в­ђ', weight: 15, payout: 4 },
            { symbol: 'рџ””', weight: 10, payout: 5 },
            { symbol: 'рџ’°', weight: 8, payout: 6 },
            { symbol: 'рџ’Ћ', weight: 5, payout: 8 },
            { symbol: '7пёЏвѓЈ', weight: 2, payout: 10 }
        ];

        // Weighted random selection
        function getWeightedSymbol() {
            const totalWeight = slotSymbols.reduce((sum, s) => sum + s.weight, 0);
            let random = Math.random() * totalWeight;
            for (const sym of slotSymbols) {
                if (random < sym.weight) return sym;
                random -= sym.weight;
            }
            return slotSymbols[0];
        }

        // Update slots balance display
        function updateSlotsBalance() {
            document.getElementById('slots-balance-display').textContent = `${gameState.tama.toLocaleString()} TAMA`;
            document.getElementById('slots-wins').textContent = slotsState.wins;
            document.getElementById('slots-losses').textContent = slotsState.losses;
            document.getElementById('slots-total-won').textContent = slotsState.totalWon.toLocaleString();
        }

        // Fullscreen toggle
        document.getElementById('slots-fullscreen-btn')?.addEventListener('click', () => {
            const arena = document.getElementById('slots-arena');
            if (!slotsState.isFullscreen) {
                if (arena.requestFullscreen) arena.requestFullscreen();
                else if (arena.webkitRequestFullscreen) arena.webkitRequestFullscreen();
                else if (arena.msRequestFullscreen) arena.msRequestFullscreen();
                slotsState.isFullscreen = true;
                document.getElementById('slots-fullscreen-btn').textContent = 'вњ•';
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
                slotsState.isFullscreen = false;
                document.getElementById('slots-fullscreen-btn').textContent = 'в›¶';
            }
        });

        // Bet selection
        document.querySelectorAll('.slots-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                slotsState.betAmount = parseInt(btn.dataset.bet);
                document.querySelectorAll('.slots-bet-btn').forEach(b => b.style.opacity = '0.7');
                btn.style.opacity = '1';
            });
        });

        // SPIN LOGIC
        document.getElementById('slots-spin-btn')?.addEventListener('click', () => {
            initAudio(); // Initialize audio on first click

            if (slotsState.spinning || gameState.tama < slotsState.betAmount) {
                showMessage(`вќЊ Not enough TAMA! Need ${slotsState.betAmount} TAMA`);
                return;
            }

            slotsState.spinning = true;
            gameState.tama -= slotsState.betAmount;
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'spend_slots', -slotsState.betAmount, `Spent ${slotsState.betAmount} TAMA to play Slot Machine 2.0`, gameState);
            }
            updateUI();
            updateSlotsBalance();

            const reels = document.querySelectorAll('.slot-reel');
            const slotsResult = document.getElementById('slots-result');
            slotsResult.textContent = 'рџЋ° Spinning...';

            let spins = 0;
            const interval = setInterval(() => {
                // Play spin sound every 3rd spin
                if (spins % 3 === 0) sounds.spin();
                // Animation - random symbols while spinning
                reels.forEach(reel => {
                    reel.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)].symbol;
                    reel.style.transform = 'scale(1.2)';
                    setTimeout(() => reel.style.transform = 'scale(1)', 50);
                });

                if (++spins === 20) {
                    clearInterval(interval);
                    sounds.reelStop(); // Stop sound

                    // Generate result with weighted probability
                    const result = Array.from({length: 5}, () => getWeightedSymbol());
                    reels.forEach((reel, i) => {
                        reel.textContent = result[i].symbol;
                        reel.style.transform = 'scale(1)';
                    });

                    // Calculate winnings
                    let reward = 0, message = '';
                    const symbols = result.map(r => r.symbol);

                    // Count occurrences of each symbol
                    const counts = {};
                    symbols.forEach(s => counts[s] = (counts[s] || 0) + 1);
                    const maxCount = Math.max(...Object.values(counts));
                    const winningSymbol = Object.keys(counts).find(s => counts[s] === maxCount);
                    const symbolData = slotSymbols.find(s => s.symbol === winningSymbol);

                    if (maxCount === 5) {
                        // ALL 5 MATCH - MEGA JACKPOT!
                        reward = slotsState.betAmount * symbolData.payout * 2;
                        message = `рџЋ°рџЋ°рџЋ° MEGA JACKPOT! +${reward} TAMA! рџЋ°рџЋ°рџЋ°`;
                        slotsResult.style.color = '#fbbf24';
                        sounds.jackpot(); // рџ”Љ JACKPOT SOUND!
                    } else if (maxCount === 4) {
                        // 4 MATCH - BIG WIN
                        reward = Math.floor(slotsState.betAmount * symbolData.payout * 1.5);
                        message = `в­ђ BIG WIN! +${reward} TAMA!`;
                        slotsResult.style.color = '#10b981';
                        sounds.bigWin(); // рџ”Љ BIG WIN SOUND!
                    } else if (maxCount === 3) {
                        // 3 MATCH - NICE WIN
                        reward = Math.floor(slotsState.betAmount * symbolData.payout);
                        message = `вњЁ Nice! +${reward} TAMA!`;
                        slotsResult.style.color = '#3b82f6';
                        sounds.win(); // рџ”Љ WIN SOUND!
                    } else {
                        // NO WIN
                        message = `рџ” Try again!`;
                        slotsResult.style.color = '#ef4444';
                        sounds.loss(); // рџ”Љ LOSS SOUND
                    }

                    // Update game state
                    if (reward > 0) {
                        gameState.tama += reward;
                        slotsState.wins++;
                        slotsState.totalWon += (reward - slotsState.betAmount);
                        if (typeof logTransaction === 'function') {
                            logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_slots', reward, `Won ${reward} TAMA from Slot Machine 2.0`, gameState);
                    }
                        // Win animation
                        reels.forEach(reel => {
                            reel.style.animation = 'pulse 0.5s ease-in-out 3';
                        });
                    } else {
                        slotsState.losses++;
                    }

                    slotsResult.textContent = message;
                    updateUI();
                    updateSlotsBalance();
                    triggerAutoSave();
                    slotsState.spinning = false;
                }
            }, 80);
        });

        // Initialize slots balance on load
        setTimeout(() => updateSlotsBalance(), 100);

        // рџЋЎ LUCKY WHEEL - IMPROVED
        let wheelState = {
            betAmount: 100,
            spinning: false,
            canvas: null,
            ctx: null,
            rotation: 0,
            wins: 0,
            losses: 0,
            totalWon: 0,
            isFullscreen: false
        };

        // Update wheel balance display
        function updateWheelBalance() {
            document.getElementById('wheel-balance-display').textContent = `${gameState.tama.toLocaleString()} TAMA`;
            document.getElementById('wheel-wins').textContent = wheelState.wins;
            document.getElementById('wheel-losses').textContent = wheelState.losses;
            document.getElementById('wheel-total-won').textContent = wheelState.totalWon.toLocaleString();
        }

        // Fullscreen toggle
        document.getElementById('wheel-fullscreen-btn')?.addEventListener('click', () => {
            const arena = document.getElementById('wheel-arena');
            if (!wheelState.isFullscreen) {
                if (arena.requestFullscreen) arena.requestFullscreen();
                else if (arena.webkitRequestFullscreen) arena.webkitRequestFullscreen();
                else if (arena.msRequestFullscreen) arena.msRequestFullscreen();
                wheelState.isFullscreen = true;
                document.getElementById('wheel-fullscreen-btn').textContent = 'вњ•';
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
                wheelState.isFullscreen = false;
                document.getElementById('wheel-fullscreen-btn').textContent = 'в›¶';
            }
        });

        function initWheel() {
            wheelState.canvas = document.getElementById('wheel-canvas');
            if (!wheelState.canvas) return;
            wheelState.ctx = wheelState.canvas.getContext('2d');
            // IMPROVED SEGMENTS - NO LOSE! More fair RTP
            const segments = [
                { multiplier: 10, color: '#ef4444', text: '10x' },    // Jackpot (rare)
                { multiplier: 0.5, color: '#6b7280', text: '0.5x' },  // Half back
                { multiplier: 2, color: '#10b981', text: '2x' },      // Double
                { multiplier: 0.3, color: '#4b5563', text: '0.3x' },  // 30% back (instead of LOSE)
                { multiplier: 3, color: '#3b82f6', text: '3x' },      // Triple
                { multiplier: 0.5, color: '#6b7280', text: '0.5x' },  // Half back
                { multiplier: 5, color: '#8b5cf6', text: '5x' },      // 5x win
                { multiplier: 1, color: '#059669', text: '1x' }       // Break even (instead of LOSE)
            ];
            wheelState.segments = segments;
            const drawWheel = () => {
                const ctx = wheelState.ctx, centerX = 300, centerY = 300, radius = 280;
                ctx.clearRect(0, 0, 300, 300);
                segments.forEach((segment, i) => {
                    const angle = (Math.PI * 2 / segments.length);
                    const startAngle = angle * i + wheelState.rotation;
                    const endAngle = angle * (i + 1) + wheelState.rotation;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                    ctx.closePath();
                    ctx.fillStyle = segment.color;
                    ctx.fill();
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(startAngle + angle / 2);
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 40px Arial';
                    ctx.fillText(segment.text, radius * 0.7, 5);
                    ctx.restore();
                });
            };
            wheelState.drawWheel = drawWheel;
            drawWheel();
        }
        document.querySelectorAll('.wheel-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                wheelState.betAmount = parseInt(btn.dataset.bet);
                document.querySelectorAll('.wheel-bet-btn').forEach(b => b.style.opacity = '0.7');
                btn.style.opacity = '1';
            });
        });
        document.getElementById('wheel-spin-btn')?.addEventListener('click', () => {
            initAudio(); // Initialize audio on first click

            if (wheelState.spinning || gameState.tama < wheelState.betAmount) {
                showMessage(`вќЊ Not enough TAMA! Need ${wheelState.betAmount} TAMA`);
                return;
            }
            wheelState.spinning = true;
            gameState.tama -= wheelState.betAmount;
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'spend_wheel', -wheelState.betAmount, `Spent ${wheelState.betAmount} TAMA to play Lucky Wheel`, gameState);
            }
            updateUI();
            updateWheelBalance();

            const wheelResult = document.getElementById('wheel-result');
            wheelResult.textContent = 'рџЋЎ Spinning...';
            wheelResult.style.color = '#fff';

            const targetRotation = Math.PI * 2 * (5 + Math.random() * 5);
            const startTime = Date.now();
            const duration = 3000;

            // Play wheel spinning sound continuously
            let wheelSpinInterval = setInterval(() => sounds.wheelSpin(), 200);

            function animateWheel() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                wheelState.rotation = targetRotation * easeOut;
                wheelState.drawWheel();

                if (progress < 1) {
                    requestAnimationFrame(animateWheel);
                } else {
                    clearInterval(wheelSpinInterval); // Stop spinning sound
                    sounds.reelStop(); // Stop sound
                    // вњ… FIX: РџСЂР°РІРёР»СЊРЅС‹Р№ СЂР°СЃС‡РµС‚ СЃРµРіРјРµРЅС‚Р° РїРѕРґ СѓРєР°Р·Р°С‚РµР»РµРј
                    // РЈРєР°Р·Р°С‚РµР»СЊ РЅР°РІРµСЂС…Сѓ (0В°), СЃРµРіРјРµРЅС‚С‹ РёРґСѓС‚ РїРѕ С‡Р°СЃРѕРІРѕР№ СЃС‚СЂРµР»РєРµ
                    // РќРѕСЂРјР°Р»РёР·СѓРµРј rotation Рє [0, 2ПЂ]
                    const normalizedRotation = ((wheelState.rotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
                    // РЈРіРѕР» РѕРґРЅРѕРіРѕ СЃРµРіРјРµРЅС‚Р°
                    const segmentAngle = (Math.PI * 2) / wheelState.segments.length;
                    // РЈРєР°Р·Р°С‚РµР»СЊ РЅР°РІРµСЂС…Сѓ, РЅСѓР¶РЅРѕ РЅР°Р№С‚Рё СЃРµРіРјРµРЅС‚ РїРѕРґ РЅРёРј
                    // РРЅРІРµСЂС‚РёСЂСѓРµРј (С‚.Рє. РєРѕР»РµСЃРѕ РІСЂР°С‰Р°РµС‚СЃСЏ РїСЂРѕС‚РёРІ С‡Р°СЃРѕРІРѕР№, Р° СЃРµРіРјРµРЅС‚С‹ РїРѕ С‡Р°СЃРѕРІРѕР№)
                    // Р”РѕР±Р°РІР»СЏРµРј segmentAngle/2 С‡С‚РѕР±С‹ СѓРєР°Р·Р°С‚РµР»СЊ Р±С‹Р» РІ С†РµРЅС‚СЂРµ СЃРµРіРјРµРЅС‚Р°
                    const segmentIndex = Math.floor((Math.PI * 2 - normalizedRotation + segmentAngle / 2) / segmentAngle) % wheelState.segments.length;
                    const multiplier = wheelState.segments[segmentIndex].multiplier;
                    const reward = Math.floor(wheelState.betAmount * multiplier);

                        gameState.tama += reward;

                    // Update statistics
                    const netProfit = reward - wheelState.betAmount;
                    if (netProfit > 0) {
                        wheelState.wins++;
                        wheelState.totalWon += netProfit;
                    } else if (netProfit < 0) {
                        wheelState.losses++;
                    }

                    // Result message with colors AND SOUNDS
                    if (multiplier >= 5) {
                        wheelResult.textContent = `рџЋ° MEGA WIN! ${multiplier}x = +${reward} TAMA!`;
                        wheelResult.style.color = '#fbbf24';
                        sounds.jackpot(); // рџ”Љ JACKPOT!
                    } else if (multiplier >= 3) {
                        wheelResult.textContent = `в­ђ BIG WIN! ${multiplier}x = +${reward} TAMA!`;
                        wheelResult.style.color = '#10b981';
                        sounds.bigWin(); // рџ”Љ BIG WIN!
                    } else if (multiplier >= 2) {
                        wheelResult.textContent = `вњЁ Nice! ${multiplier}x = +${reward} TAMA!`;
                        wheelResult.style.color = '#3b82f6';
                        sounds.win(); // рџ”Љ WIN!
                    } else if (multiplier === 1) {
                        wheelResult.textContent = `рџђ Break Even! ${multiplier}x = ${reward} TAMA`;
                        wheelResult.style.color = '#6b7280';
                        sounds.reelStop(); // рџ”Љ Neutral sound
                    } else {
                        wheelResult.textContent = `рџ” ${multiplier}x = ${reward} TAMA (lost ${wheelState.betAmount - reward})`;
                        wheelResult.style.color = '#ef4444';
                        sounds.loss(); // рџ”Љ LOSS
                    }

                    if (reward > wheelState.betAmount && typeof logTransaction === 'function') {
                        logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_wheel', reward, `Won ${reward} TAMA from Lucky Wheel (${multiplier}x)`, gameState);
                    }

                    updateUI();
                    updateWheelBalance();
                    triggerAutoSave();
                    wheelState.spinning = false;
                }
            }
            animateWheel();
        });
        setTimeout(() => {
            if (document.getElementById('wheel-canvas')) {
                const canvas = document.getElementById('wheel-canvas');
                canvas.width = 600;
                canvas.height = 600;
                initWheel();
            }
        }, 1000);

        // рџЋІ DICE ROLL - REMOVED (not interesting)

        // рџђѕ CATCH THE PET - IMPROVED VERSION
        let catchPetState = {
            active: false,
            petX: 50,
            petY: 50,
            petSpeed: 2,
            caught: 0,
            score: 0,
            speed: 1.0,
            gameTime: 30,
            timer: null,
            petInterval: null,
            obstacles: []
        };

        document.getElementById('catchpet-start-btn')?.addEventListener('click', () => {
            if (catchPetState.active) return;

            catchPetState.active = true;
            catchPetState.caught = 0;
            catchPetState.score = 0;
            catchPetState.speed = 1.0;
            catchPetState.gameTime = 30;
            catchPetState.petX = Math.random() * 80 + 10;
            catchPetState.petY = Math.random() * 60 + 20;
            catchPetState.petSpeed = 2;

            const gameArea = document.getElementById('catchpet-game-area');
            const pet = document.getElementById('catchpet-pet');
            const status = document.getElementById('catchpet-status');

            status.textContent = 'рџЋ® Game Started! Catch the pet!';
            status.style.color = '#10b981';

            // Start timer
            catchPetState.timer = setInterval(() => {
                catchPetState.gameTime--;
                if (catchPetState.gameTime <= 0) {
                    endCatchPetGame();
                }
            }, 1000);

            // Move pet randomly
            catchPetState.petInterval = setInterval(() => {
                if (!catchPetState.active) return;

                // Random movement
                catchPetState.petX += (Math.random() - 0.5) * catchPetState.petSpeed * 2;
                catchPetState.petY += (Math.random() - 0.5) * catchPetState.petSpeed * 2;

                // Keep pet in bounds
                catchPetState.petX = Math.max(5, Math.min(95, catchPetState.petX));
                catchPetState.petY = Math.max(10, Math.min(80, catchPetState.petY));

                // Update pet position
                pet.style.left = catchPetState.petX + '%';
                pet.style.top = catchPetState.petY + '%';

                // Increase speed over time
                catchPetState.petSpeed = Math.min(5, 2 + catchPetState.caught * 0.2);
                catchPetState.speed = catchPetState.petSpeed;

                // Update speed display
                document.querySelector('#catchpet-arena .game-arena > div > div:nth-child(3) > div:first-child').textContent = catchPetState.speed.toFixed(1) + 'x';
            }, 100);

            // Click to catch
            gameArea.addEventListener('click', catchPetClick);
        });

        function catchPetClick(e) {
            if (!catchPetState.active) return;

            const gameArea = document.getElementById('catchpet-game-area');
            const rect = gameArea.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * 100;
            const clickY = ((e.clientY - rect.top) / rect.height) * 100;

            const distance = Math.sqrt(
                Math.pow(clickX - catchPetState.petX, 2) +
                Math.pow(clickY - catchPetState.petY, 2)
            );

            if (distance < 10) {
                // Caught!
                catchPetState.caught++;
                catchPetState.score += Math.floor(50 * catchPetState.speed);

                // Update displays
                document.querySelector('#catchpet-arena .game-arena > div > div:nth-child(1) > div:first-child').textContent = catchPetState.caught;
                document.querySelector('#catchpet-arena .game-arena > div > div:nth-child(2) > div:first-child').textContent = catchPetState.score;

                // Move pet to new random position
                catchPetState.petX = Math.random() * 80 + 10;
                catchPetState.petY = Math.random() * 60 + 20;
                document.getElementById('catchpet-pet').style.left = catchPetState.petX + '%';
                document.getElementById('catchpet-pet').style.top = catchPetState.petY + '%';

                // Visual feedback
                const status = document.getElementById('catchpet-status');
                status.textContent = `рџЋ‰ Caught! +${Math.floor(50 * catchPetState.speed)} points!`;
                status.style.color = '#10b981';

                setTimeout(() => {
                    if (catchPetState.active) {
                        status.textContent = `вЏ° Time: ${catchPetState.gameTime}s | Caught: ${catchPetState.caught}`;
                        status.style.color = '#fff';
                    }
                }, 1000);
            } else {
                // Missed
                const status = document.getElementById('catchpet-status');
                status.textContent = 'рџ” Missed! Try again!';
                status.style.color = '#ef4444';
                setTimeout(() => {
                    if (catchPetState.active) {
                        status.textContent = `вЏ° Time: ${catchPetState.gameTime}s | Caught: ${catchPetState.caught}`;
                        status.style.color = '#fff';
                    }
                }, 500);
            }
        }

        function endCatchPetGame() {
            catchPetState.active = false;
            clearInterval(catchPetState.timer);
            clearInterval(catchPetState.petInterval);

            const gameArea = document.getElementById('catchpet-game-area');
            gameArea.removeEventListener('click', catchPetClick);

            // Calculate reward
            const baseReward = catchPetState.caught * 10;
            const speedBonus = Math.floor(catchPetState.speed * 5);
            const totalReward = Math.min(200, baseReward + speedBonus);

            if (totalReward > 0) {
                gameState.tama += totalReward;
                if (typeof logTransaction === 'function') {
                    logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_catchpet', totalReward, `Won ${totalReward} TAMA from Catch the Pet (${catchPetState.caught} caught)`, gameState);
                }
            }

            const status = document.getElementById('catchpet-status');
            status.textContent = `рџЋ® Game Over! Caught: ${catchPetState.caught} | Score: ${catchPetState.score} | Reward: +${totalReward} TAMA!`;
            status.style.color = '#fbbf24';

            updateUI();
            triggerAutoSave();

            // Reset button
            document.getElementById('catchpet-start-btn').textContent = 'рџђѕ START CATCHING!';
        }

        // вљ”пёЏ PET BATTLE ARENA
        let petBattleState = {
            betAmount: 100,
            active: false,
            playerPet: null,
            enemyPet: null,
            wins: 0,
            losses: 0,
            totalWon: 0
        };

        // Load user NFTs for battle
        async function loadBattleNFTs() {
            const userId = window.TELEGRAM_USER_ID;
            if (!userId) return [];

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts?telegram_id=eq.${userId}&select=id,tier_name,rarity,earning_multiplier,nft_mint_address,is_active&limit=50`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });
                if (response.ok) {
                    const nfts = await response.json();
                    return nfts.filter(n => {
                        const isOnChain = n.nft_mint_address && n.nft_mint_address.length > 30 && !n.nft_mint_address.includes('_');
                        return isOnChain ? true : (n.is_active !== false);
                    });
                }
            } catch (e) {
                console.error('Failed to load NFTs for battle:', e);
            }
            return [];
        }

        // Initialize battle bet buttons
        document.querySelectorAll('.battle-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                petBattleState.betAmount = parseInt(btn.dataset.bet);
                document.querySelectorAll('.battle-bet-btn').forEach(b => b.style.opacity = '0.7');
                btn.style.opacity = '1';
            });
        });

        document.getElementById('battle-start-btn')?.addEventListener('click', async () => {
            if (petBattleState.active || gameState.tama < petBattleState.betAmount) {
                showMessage(`вќЊ Not enough TAMA! Need ${petBattleState.betAmount} TAMA`);
                return;
            }

            // Load NFTs
            const nfts = await loadBattleNFTs();
            if (nfts.length === 0) {
                showMessage('вќЊ You need at least one active NFT to battle!');
                return;
            }

            // Select random player NFT
            petBattleState.playerPet = nfts[Math.floor(Math.random() * nfts.length)];

            // Create enemy pet (random stats)
            const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
            const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
            petBattleState.enemyPet = {
                tier_name: tiers[Math.floor(Math.random() * tiers.length)],
                rarity: rarities[Math.floor(Math.random() * rarities.length)],
                earning_multiplier: 1 + Math.random() * 5
            };

            petBattleState.active = true;
            gameState.tama -= petBattleState.betAmount;
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'spend_battle', -petBattleState.betAmount, `Spent ${petBattleState.betAmount} TAMA to battle`, gameState);
            }
            updateUI();
            updateBattleBalance();

            // Display pets
            const playerPetDiv = document.getElementById('player-pet');
            const enemyPetDiv = document.getElementById('enemy-pet');
            const playerStats = document.getElementById('player-pet-stats');
            const enemyStats = document.getElementById('enemy-pet-stats');
            const battleLog = document.getElementById('battle-log');

            playerPetDiv.querySelector('div:first-child').textContent = getPetEmoji(petBattleState.playerPet.tier_name);
            playerStats.textContent = `${petBattleState.playerPet.tier_name} ${petBattleState.playerPet.rarity} (${petBattleState.playerPet.earning_multiplier}x)`;

            enemyPetDiv.querySelector('div:first-child').textContent = getPetEmoji(petBattleState.enemyPet.tier_name);
            enemyStats.textContent = `${petBattleState.enemyPet.tier_name} ${petBattleState.enemyPet.rarity} (${petBattleState.enemyPet.earning_multiplier.toFixed(1)}x)`;

            battleLog.innerHTML = '<div style="color: #3b82f6;">вљ”пёЏ Battle Started!</div>';

            // Simulate battle
            setTimeout(() => {
                const playerPower = petBattleState.playerPet.earning_multiplier + (petBattleState.playerPet.rarity === 'Legendary' ? 2 : petBattleState.playerPet.rarity === 'Epic' ? 1 : 0);
                const enemyPower = petBattleState.enemyPet.earning_multiplier + (petBattleState.enemyPet.rarity === 'Legendary' ? 2 : petBattleState.enemyPet.rarity === 'Epic' ? 1 : 0);

                const playerRoll = playerPower + Math.random() * 3;
                const enemyRoll = enemyPower + Math.random() * 3;

                battleLog.innerHTML += `<div style="color: #fff; margin-top: 5px;">Player attacks: ${playerRoll.toFixed(1)} power</div>`;
                battleLog.innerHTML += `<div style="color: #fff; margin-top: 5px;">Enemy attacks: ${enemyRoll.toFixed(1)} power</div>`;

                setTimeout(() => {
                    const won = playerRoll > enemyRoll;
                    const resultDiv = document.getElementById('battle-result');

                    if (won) {
                        const reward = Math.floor(petBattleState.betAmount * 2);
                        gameState.tama += reward;
                        petBattleState.wins++;
                        petBattleState.totalWon += (reward - petBattleState.betAmount);
                        resultDiv.textContent = `рџЏ† VICTORY! +${reward} TAMA!`;
                        resultDiv.style.color = '#10b981';
                        battleLog.innerHTML += `<div style="color: #10b981; margin-top: 5px; font-weight: bold;">рџЏ† VICTORY! You won ${reward} TAMA!</div>`;

                        if (typeof logTransaction === 'function') {
                            logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_battle', reward, `Won ${reward} TAMA from Pet Battle`, gameState);
                        }
                    } else {
                        petBattleState.losses++;
                        resultDiv.textContent = `рџ’Ђ DEFEAT! Lost ${petBattleState.betAmount} TAMA`;
                        resultDiv.style.color = '#ef4444';
                        battleLog.innerHTML += `<div style="color: #ef4444; margin-top: 5px; font-weight: bold;">рџ’Ђ DEFEAT! You lost ${petBattleState.betAmount} TAMA</div>`;
                    }

                    updateUI();
                    updateBattleBalance();
                    triggerAutoSave();
                    petBattleState.active = false;
                }, 1000);
            }, 500);
        });

        function updateBattleBalance() {
            document.getElementById('battle-balance-display').textContent = `${gameState.tama.toLocaleString()} TAMA`;
            document.getElementById('battle-wins').textContent = petBattleState.wins;
            document.getElementById('battle-losses').textContent = petBattleState.losses;
            document.getElementById('battle-total-won').textContent = petBattleState.totalWon.toLocaleString();
        }

        function getPetEmoji(tier) {
            const emojis = {
                'Bronze': 'рџҐ‰',
                'Silver': 'рџҐ€',
                'Gold': 'рџҐ‡',
                'Platinum': 'рџ’Ћ',
                'Diamond': 'рџ’ '
            };
            return emojis[tier] || 'рџђѕ';
        }

        setTimeout(() => updateBattleBalance(), 100);

        // рџЏ—пёЏ TAMA TOWER
        let towerState = {
            betAmount: 50,
            blocks: 0,
            active: false,
            highest: 0,
            totalWon: 0,
            fallChance: 0.05
        };

        document.querySelectorAll('.tower-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                towerState.betAmount = parseInt(btn.dataset.bet);
                document.querySelectorAll('.tower-bet-btn').forEach(b => b.style.opacity = '0.7');
                btn.style.opacity = '1';
            });
        });

        document.getElementById('tower-start-btn')?.addEventListener('click', () => {
            if (towerState.active || gameState.tama < towerState.betAmount) {
                showMessage(`вќЊ Not enough TAMA! Need ${towerState.betAmount} TAMA`);
                return;
            }

            towerState.active = true;
            towerState.blocks = 0;
            towerState.fallChance = 0.05;
            gameState.tama -= towerState.betAmount;
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'spend_tower', -towerState.betAmount, `Spent ${towerState.betAmount} TAMA to build tower`, gameState);
            }
            updateUI();
            updateTowerBalance();

            document.getElementById('tower-start-btn').style.display = 'none';
            document.getElementById('tower-add-btn').style.display = 'inline-block';
            document.getElementById('tower-cashout-btn').style.display = 'inline-block';

            const resultDiv = document.getElementById('tower-result');
            resultDiv.textContent = 'рџЏ—пёЏ Start building! Click ADD BLOCK or CASH OUT!';
            resultDiv.style.color = '#fff';

            renderTower();
        });

        document.getElementById('tower-add-btn')?.addEventListener('click', () => {
            if (!towerState.active) return;

            // Check if tower falls
            if (Math.random() < towerState.fallChance) {
                // Tower falls!
                endTowerGame(true);
                return;
            }

            towerState.blocks++;
            towerState.fallChance = Math.min(0.5, 0.05 + towerState.blocks * 0.02);

            if (towerState.blocks > towerState.highest) {
                towerState.highest = towerState.blocks;
            }

            renderTower();

            const resultDiv = document.getElementById('tower-result');
            resultDiv.textContent = `рџЏ—пёЏ Tower: ${towerState.blocks} blocks | Fall chance: ${(towerState.fallChance * 100).toFixed(1)}%`;
            resultDiv.style.color = '#fff';
        });

        document.getElementById('tower-cashout-btn')?.addEventListener('click', () => {
            if (!towerState.active) return;
            endTowerGame(false);
        });

        function renderTower() {
            const towerBlocks = document.getElementById('tower-blocks');
            towerBlocks.innerHTML = '';

            for (let i = 0; i < towerState.blocks; i++) {
                const block = document.createElement('div');
                block.style.cssText = 'width: 60px; height: 30px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border: 2px solid #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);';
                towerBlocks.appendChild(block);
            }
        }

        function endTowerGame(fell) {
            towerState.active = false;

            let reward = 0;
            if (fell) {
                const resultDiv = document.getElementById('tower-result');
                resultDiv.textContent = `рџ’Ґ TOWER FELL! Lost ${towerState.betAmount} TAMA!`;
                resultDiv.style.color = '#ef4444';
            } else {
                // Calculate reward based on height
                let multiplier = 1;
                if (towerState.blocks >= 20) multiplier = 20;
                else if (towerState.blocks >= 15) multiplier = 10;
                else if (towerState.blocks >= 10) multiplier = 5;
                else if (towerState.blocks >= 5) multiplier = 2;

                reward = Math.floor(towerState.betAmount * multiplier);
                gameState.tama += reward;
                towerState.totalWon += (reward - towerState.betAmount);

                const resultDiv = document.getElementById('tower-result');
                resultDiv.textContent = `рџ’° CASHED OUT! Tower: ${towerState.blocks} blocks | Reward: +${reward} TAMA (${multiplier}x)!`;
                resultDiv.style.color = '#10b981';

                if (typeof logTransaction === 'function') {
                    logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_tower', reward, `Won ${reward} TAMA from TAMA Tower (${towerState.blocks} blocks)`, gameState);
                }
            }

            document.getElementById('tower-start-btn').style.display = 'inline-block';
            document.getElementById('tower-add-btn').style.display = 'none';
            document.getElementById('tower-cashout-btn').style.display = 'none';

            updateUI();
            updateTowerBalance();
            triggerAutoSave();

            setTimeout(() => {
                towerState.blocks = 0;
                renderTower();
            }, 2000);
        }

        function updateTowerBalance() {
            document.getElementById('tower-balance-display').textContent = `${gameState.tama.toLocaleString()} TAMA`;
            document.getElementById('tower-highest').textContent = towerState.highest;
            document.getElementById('tower-total-won').textContent = towerState.totalWon.toLocaleString();
        }

        setTimeout(() => updateTowerBalance(), 100);

        // рџЋЇ PRECISION CLICK
        let precisionState = {
            betAmount: 50,
            active: false,
            targetX: 50,
            targetY: 50,
            targetSpeed: 2,
            directionX: 1,
            directionY: 1,
            perfect: 0,
            totalWon: 0
        };

        document.querySelectorAll('.precision-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                precisionState.betAmount = parseInt(btn.dataset.bet);
                document.querySelectorAll('.precision-bet-btn').forEach(b => b.style.opacity = '0.7');
                btn.style.opacity = '1';
            });
        });

        document.getElementById('precision-start-btn')?.addEventListener('click', () => {
            if (precisionState.active || gameState.tama < precisionState.betAmount) {
                showMessage(`вќЊ Not enough TAMA! Need ${precisionState.betAmount} TAMA`);
                return;
            }

            precisionState.active = true;
            precisionState.targetX = 50;
            precisionState.targetY = 50;
            precisionState.targetSpeed = 2;
            precisionState.directionX = Math.random() > 0.5 ? 1 : -1;
            precisionState.directionY = Math.random() > 0.5 ? 1 : -1;

            gameState.tama -= precisionState.betAmount;
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'spend_precision', -precisionState.betAmount, `Spent ${precisionState.betAmount} TAMA to play Precision Click`, gameState);
            }
            updateUI();
            updatePrecisionBalance();

            document.getElementById('precision-start-btn').style.display = 'none';

            const resultDiv = document.getElementById('precision-result');
            resultDiv.textContent = 'рџЋЇ Click when target is in the center!';
            resultDiv.style.color = '#fff';

            startPrecisionGame();
        });

        function startPrecisionGame() {
            const target = document.getElementById('precision-target');
            const gameArea = document.getElementById('precision-game-area');

            const moveInterval = setInterval(() => {
                if (!precisionState.active) {
                    clearInterval(moveInterval);
                    return;
                }

                precisionState.targetX += precisionState.directionX * precisionState.targetSpeed;
                precisionState.targetY += precisionState.directionY * precisionState.targetSpeed;

                // Bounce off walls
                if (precisionState.targetX <= 5 || precisionState.targetX >= 95) {
                    precisionState.directionX *= -1;
                    precisionState.targetX = Math.max(5, Math.min(95, precisionState.targetX));
                }
                if (precisionState.targetY <= 5 || precisionState.targetY >= 95) {
                    precisionState.directionY *= -1;
                    precisionState.targetY = Math.max(5, Math.min(95, precisionState.targetY));
                }

                target.style.left = precisionState.targetX + '%';
                target.style.top = precisionState.targetY + '%';

                // Increase speed over time
                precisionState.targetSpeed = Math.min(5, 2 + Date.now() % 10000 / 2000);
            }, 50);

            gameArea.addEventListener('click', precisionClickHandler);
        }

        function precisionClickHandler(e) {
            if (!precisionState.active) return;

            const gameArea = document.getElementById('precision-game-area');
            const rect = gameArea.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * 100;
            const clickY = ((e.clientY - rect.top) / rect.height) * 100;

            const distance = Math.sqrt(
                Math.pow(clickX - 50, 2) + Math.pow(clickY - 50, 2)
            );

            let reward = 0;
            let message = '';
            const resultDiv = document.getElementById('precision-result');

            if (distance < 5) {
                // Perfect!
                reward = Math.floor(precisionState.betAmount * 10);
                precisionState.perfect++;
                message = `рџЋЇ PERFECT! +${reward} TAMA!`;
                resultDiv.style.color = '#10b981';
            } else if (distance < 10) {
                // Very close
                reward = Math.floor(precisionState.betAmount * 5);
                message = `в­ђ Very Close! +${reward} TAMA!`;
                resultDiv.style.color = '#3b82f6';
            } else if (distance < 20) {
                // Close
                reward = Math.floor(precisionState.betAmount * 2);
                message = `вњЁ Close! +${reward} TAMA!`;
                resultDiv.style.color = '#8b5cf6';
            } else {
                // Missed
                message = `рџ” Missed! Lost ${precisionState.betAmount} TAMA`;
                resultDiv.style.color = '#ef4444';
            }

            if (reward > 0) {
                gameState.tama += reward;
                precisionState.totalWon += (reward - precisionState.betAmount);
                if (typeof logTransaction === 'function') {
                    logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_precision', reward, `Won ${reward} TAMA from Precision Click`, gameState);
                }
            }

            resultDiv.textContent = message;
            precisionState.active = false;

            // gameArea already declared at line 8917, just use it
            gameArea.removeEventListener('click', precisionClickHandler);

            updateUI();
            updatePrecisionBalance();
            triggerAutoSave();

            document.getElementById('precision-start-btn').style.display = 'inline-block';

            setTimeout(() => {
                precisionState.targetX = 50;
                precisionState.targetY = 50;
                document.getElementById('precision-target').style.left = '50%';
                document.getElementById('precision-target').style.top = '50%';
            }, 1000);
        }

        function updatePrecisionBalance() {
            document.getElementById('precision-balance-display').textContent = `${gameState.tama.toLocaleString()} TAMA`;
            document.getElementById('precision-perfect').textContent = precisionState.perfect;
            document.getElementById('precision-total-won').textContent = precisionState.totalWon.toLocaleString();
        }

        setTimeout(() => updatePrecisionBalance(), 100);

        // рџЋІ ROULETTE
        let rouletteState = {
            betAmount: 50,
            betType: null,
            spinning: false,
            wins: 0,
            losses: 0,
            totalWon: 0
        };

        const rouletteNumbers = [];
        for (let i = 0; i <= 36; i++) {
            if (i === 0) rouletteNumbers.push({ num: 0, color: 'green' });
            else if (i % 2 === 0) rouletteNumbers.push({ num: i, color: 'black' });
            else rouletteNumbers.push({ num: i, color: 'red' });
        }

        document.querySelectorAll('.roulette-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                rouletteState.betAmount = parseInt(btn.dataset.bet);
                document.querySelectorAll('.roulette-bet-btn').forEach(b => b.style.opacity = '0.7');
                btn.style.opacity = '1';
            });
        });

        document.querySelectorAll('.roulette-bet-type').forEach(btn => {
            btn.addEventListener('click', () => {
                if (rouletteState.spinning) return;
                rouletteState.betType = btn.dataset.type;
                document.querySelectorAll('.roulette-bet-type').forEach(b => b.style.border = '2px solid rgba(255,255,255,0.3)');
                btn.style.border = '3px solid #fbbf24';
            });
        });

        document.getElementById('roulette-spin-btn')?.addEventListener('click', () => {
            if (rouletteState.spinning || !rouletteState.betType || gameState.tama < rouletteState.betAmount) {
                if (!rouletteState.betType) showMessage('вќЊ Please select a bet type!');
                else showMessage(`вќЊ Not enough TAMA! Need ${rouletteState.betAmount} TAMA`);
                return;
            }

            rouletteState.spinning = true;
            gameState.tama -= rouletteState.betAmount;
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'spend_roulette', -rouletteState.betAmount, `Spent ${rouletteState.betAmount} TAMA on ${rouletteState.betType}`, gameState);
            }
            updateUI();
            updateRouletteBalance();

            const wheel = document.getElementById('roulette-wheel');
            const resultDiv = document.getElementById('roulette-result');
            resultDiv.textContent = 'рџЋІ Spinning...';
            resultDiv.style.color = '#fff';

            // Spin animation
            const spins = 5 + Math.random() * 3;
            wheel.style.transform = `rotate(${spins * 360}deg)`;

            setTimeout(() => {
                const winningNumber = rouletteNumbers[Math.floor(Math.random() * rouletteNumbers.length)];
                let won = false;
                let multiplier = 1;

                if (rouletteState.betType === 'red' && winningNumber.color === 'red') {
                    won = true;
                    multiplier = 2;
                } else if (rouletteState.betType === 'black' && winningNumber.color === 'black') {
                    won = true;
                    multiplier = 2;
                } else if (rouletteState.betType === 'green' && winningNumber.color === 'green') {
                    won = true;
                    multiplier = 36;
                } else if (rouletteState.betType === 'even' && winningNumber.num > 0 && winningNumber.num % 2 === 0) {
                    won = true;
                    multiplier = 2;
                } else if (rouletteState.betType === 'odd' && winningNumber.num > 0 && winningNumber.num % 2 === 1) {
                    won = true;
                    multiplier = 2;
                }

                let reward = 0;
                if (won) {
                    reward = Math.floor(rouletteState.betAmount * multiplier);
                    gameState.tama += reward;
                    rouletteState.wins++;
                    rouletteState.totalWon += (reward - rouletteState.betAmount);
                    resultDiv.textContent = `рџЋ‰ WIN! Number: ${winningNumber.num} (${winningNumber.color}) | +${reward} TAMA!`;
                    resultDiv.style.color = '#10b981';

                    if (typeof logTransaction === 'function') {
                        logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_roulette', reward, `Won ${reward} TAMA from Roulette (${rouletteState.betType})`, gameState);
                    }
                } else {
                    rouletteState.losses++;
                    resultDiv.textContent = `рџ” LOSE! Number: ${winningNumber.num} (${winningNumber.color}) | Lost ${rouletteState.betAmount} TAMA`;
                    resultDiv.style.color = '#ef4444';
                }

                updateUI();
                updateRouletteBalance();
                triggerAutoSave();
                rouletteState.spinning = false;
                rouletteState.betType = null;
                document.querySelectorAll('.roulette-bet-type').forEach(b => b.style.border = '2px solid rgba(255,255,255,0.3)');
            }, 3000);
        });

        function updateRouletteBalance() {
            document.getElementById('roulette-balance-display').textContent = `${gameState.tama.toLocaleString()} TAMA`;
            document.getElementById('roulette-wins').textContent = rouletteState.wins;
            document.getElementById('roulette-losses').textContent = rouletteState.losses;
            document.getElementById('roulette-total-won').textContent = rouletteState.totalWon.toLocaleString();
        }

        setTimeout(() => updateRouletteBalance(), 100);

        // рџѓЏ CARD GAME (Durak/Blackjack style)
        let cardsState = {
            betAmount: 100,
            active: false,
            playerCards: [],
            dealerCards: [],
            playerScore: 0,
            dealerScore: 0,
            wins: 0,
            losses: 0,
            totalWon: 0
        };

        const cardSuits = ['в™ ', 'в™Ґ', 'в™¦', 'в™Ј'];
        const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

        function createDeck() {
            const deck = [];
            for (const suit of cardSuits) {
                for (const value of cardValues) {
                    deck.push({ suit, value });
                }
            }
            // Shuffle
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
            return deck;
        }

        function getCardValue(card) {
            if (card.value === 'A') return 11;
            if (['J', 'Q', 'K'].includes(card.value)) return 10;
            return parseInt(card.value);
        }

        function calculateScore(cards) {
            let score = 0;
            let aces = 0;
            for (const card of cards) {
                if (card.value === 'A') aces++;
                score += getCardValue(card);
            }
            while (score > 21 && aces > 0) {
                score -= 10;
                aces--;
            }
            return score;
        }

        document.querySelectorAll('.cards-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                cardsState.betAmount = parseInt(btn.dataset.bet);
                document.querySelectorAll('.cards-bet-btn').forEach(b => b.style.opacity = '0.7');
                btn.style.opacity = '1';
            });
        });

        document.getElementById('cards-start-btn')?.addEventListener('click', () => {
            if (cardsState.active || gameState.tama < cardsState.betAmount) {
                showMessage(`вќЊ Not enough TAMA! Need ${cardsState.betAmount} TAMA`);
                return;
            }

            cardsState.active = true;
            cardsState.playerCards = [];
            cardsState.dealerCards = [];

            gameState.tama -= cardsState.betAmount;
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'spend_cards', -cardsState.betAmount, `Spent ${cardsState.betAmount} TAMA to play Card Game`, gameState);
            }
            updateUI();
            updateCardsBalance();

            const deck = createDeck();
            cardsState.playerCards = [deck.pop(), deck.pop()];
            cardsState.dealerCards = [deck.pop(), deck.pop()];

            cardsState.playerScore = calculateScore(cardsState.playerCards);
            cardsState.dealerScore = calculateScore(cardsState.dealerCards);

            renderCards();

            document.getElementById('cards-start-btn').style.display = 'none';
            document.getElementById('cards-hit-btn').style.display = 'inline-block';
            document.getElementById('cards-stand-btn').style.display = 'inline-block';

            const resultDiv = document.getElementById('cards-result');
            resultDiv.textContent = `Your score: ${cardsState.playerScore} | Dealer: ${cardsState.dealerCards[0].value}${cardsState.dealerCards[0].suit} ?`;
            resultDiv.style.color = '#fff';
        });

        document.getElementById('cards-hit-btn')?.addEventListener('click', () => {
            if (!cardsState.active) return;

            const deck = createDeck();
            // Remove already dealt cards
            const allCards = [...cardsState.playerCards, ...cardsState.dealerCards];
            const newDeck = deck.filter(card => !allCards.some(c => c.suit === card.suit && c.value === card.value));

            if (newDeck.length > 0) {
                cardsState.playerCards.push(newDeck[Math.floor(Math.random() * newDeck.length)]);
                cardsState.playerScore = calculateScore(cardsState.playerCards);
                renderCards();

                const resultDiv = document.getElementById('cards-result');
                resultDiv.textContent = `Your score: ${cardsState.playerScore}`;

                if (cardsState.playerScore > 21) {
                    endCardGame(false);
                }
            }
        });

        document.getElementById('cards-stand-btn')?.addEventListener('click', () => {
            if (!cardsState.active) return;

            // Dealer draws until 17+
            const deck = createDeck();
            const allCards = [...cardsState.playerCards, ...cardsState.dealerCards];
            const newDeck = deck.filter(card => !allCards.some(c => c.suit === card.suit && c.value === card.value));

            while (cardsState.dealerScore < 17 && newDeck.length > 0) {
                cardsState.dealerCards.push(newDeck[Math.floor(Math.random() * newDeck.length)]);
                cardsState.dealerScore = calculateScore(cardsState.dealerCards);
            }

            endCardGame(cardsState.playerScore <= 21 && (cardsState.dealerScore > 21 || cardsState.playerScore > cardsState.dealerScore));
        });

        function renderCards() {
            const playerCardsDiv = document.getElementById('player-cards');
            const dealerCardsDiv = document.getElementById('dealer-cards');

            playerCardsDiv.innerHTML = '';
            dealerCardsDiv.innerHTML = '';

            cardsState.playerCards.forEach(card => {
                const cardDiv = document.createElement('div');
                const isRed = card.suit === 'в™Ґ' || card.suit === 'в™¦';
                cardDiv.style.cssText = `width: 60px; height: 90px; background: #fff; border-radius: 8px; padding: 5px; display: flex; flex-direction: column; justify-content: space-between; font-weight: bold; color: ${isRed ? '#ef4444' : '#000'}; border: 2px solid #000;`;
                cardDiv.innerHTML = `<div style="font-size: 18px;">${card.value}</div><div style="font-size: 24px; text-align: center;">${card.suit}</div><div style="font-size: 18px; transform: rotate(180deg);">${card.value}</div>`;
                playerCardsDiv.appendChild(cardDiv);
            });

            cardsState.dealerCards.forEach((card, index) => {
                const cardDiv = document.createElement('div');
                if (index === 0 || !cardsState.active) {
                    const isRed = card.suit === 'в™Ґ' || card.suit === 'в™¦';
                    cardDiv.style.cssText = `width: 60px; height: 90px; background: #fff; border-radius: 8px; padding: 5px; display: flex; flex-direction: column; justify-content: space-between; font-weight: bold; color: ${isRed ? '#ef4444' : '#000'}; border: 2px solid #000;`;
                    cardDiv.innerHTML = `<div style="font-size: 18px;">${card.value}</div><div style="font-size: 24px; text-align: center;">${card.suit}</div><div style="font-size: 18px; transform: rotate(180deg);">${card.value}</div>`;
                } else {
                    cardDiv.style.cssText = `width: 60px; height: 90px; background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 8px; border: 2px solid #000;`;
                    cardDiv.innerHTML = '<div style="color: #fff; text-align: center; margin-top: 30px;">?</div>';
                }
                dealerCardsDiv.appendChild(cardDiv);
            });
        }

        function endCardGame(won) {
            cardsState.active = false;

            renderCards(); // Show all dealer cards

            let reward = 0;
            const resultDiv = document.getElementById('cards-result');

            if (won) {
                reward = Math.floor(cardsState.betAmount * 2);
                gameState.tama += reward;
                cardsState.wins++;
                cardsState.totalWon += (reward - cardsState.betAmount);
                resultDiv.textContent = `рџЏ† WIN! Your: ${cardsState.playerScore} | Dealer: ${cardsState.dealerScore} | +${reward} TAMA!`;
                resultDiv.style.color = '#10b981';

                if (typeof logTransaction === 'function') {
                    logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_cards', reward, `Won ${reward} TAMA from Card Game`, gameState);
                }
            } else {
                cardsState.losses++;
                resultDiv.textContent = `рџ’Ђ LOSE! Your: ${cardsState.playerScore} | Dealer: ${cardsState.dealerScore} | Lost ${cardsState.betAmount} TAMA`;
                resultDiv.style.color = '#ef4444';
            }

            document.getElementById('cards-start-btn').style.display = 'inline-block';
            document.getElementById('cards-hit-btn').style.display = 'none';
            document.getElementById('cards-stand-btn').style.display = 'none';

            updateUI();
            updateCardsBalance();
            triggerAutoSave();
        }

        function updateCardsBalance() {
            document.getElementById('cards-balance-display').textContent = `${gameState.tama.toLocaleString()} TAMA`;
            document.getElementById('cards-wins').textContent = cardsState.wins;
            document.getElementById('cards-losses').textContent = cardsState.losses;
            document.getElementById('cards-total-won').textContent = cardsState.totalWon.toLocaleString();
        }

        setTimeout(() => updateCardsBalance(), 100);

        // рџЌ„ TAMA JUMP PLATFORMER GAME - REAL MARIO STYLE
        const platformerGame = {
            canvas: null,
            ctx: null,
            player: null,
            platforms: [],
            coins: [],
            enemies: [],
            questionBlocks: [],
            bricks: [],
            pipes: [],
            powerups: [],
            particles: [],
            score: 0,
            coinsCollected: 0,
            lives: 3,
            gameTime: 90,
            gameActive: false,
            keys: {},
            animFrame: null,
            timer: null,
            camera: { x: 0 },
            levelWidth: 3000,
            animationFrame: 0,

            init() {
                // Use fullscreen canvas immediately (small canvas removed)
                this.canvas = document.getElementById('platformer-canvas-fullscreen');
                if (!this.canvas) {
                    console.warn('Platformer canvas not found, will initialize on game start');
                return;
            }
                this.ctx = this.canvas.getContext('2d');

                // Mobile touch controls setup
                this.setupMobileControls();

                // Keyboard controls
                window.addEventListener('keydown', (e) => {
                    if (this.gameActive) {
                        this.keys[e.key] = true;
                        if (e.key === ' ' || e.key === 'ArrowUp') {
                            e.preventDefault();
                            this.player.jump();
                        }
                    }
                });

                window.addEventListener('keyup', (e) => {
                    this.keys[e.key] = false;
                });
            },

            setupMobileControls() {
                // Old buttons removed, use only fullscreen version
                // [cleaned]
            },

            requestFullscreen() {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            },

            start() {
                this.gameActive = true;
                this.score = 0;
                this.coinsCollected = 0;
                this.lives = 3;
                this.gameTime = 60;

                // Show mobile controls on touch devices (for both modes!)
                const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                const mobileControls = platformerFullscreenMode ?
                    document.getElementById('mobile-controls-fullscreen') :
                    document.getElementById('mobile-controls');
                if (mobileControls && isTouchDevice) {
                    mobileControls.style.display = 'block';
                }

                // Request fullscreen on mobile for better experience
                if (isTouchDevice && window.innerWidth < 768) {
                    setTimeout(() => {
                        this.requestFullscreen();
                    }, 100);
                }

                // Initialize player (INCREASED FOR VISIBILITY!)
                this.player = {
                    x: 50,
                    y: 360,
                    width: 40,  // Was 24, now 40!
                    height: 40, // Was 24, now 40!
                    vx: 0,
                    vy: 0,
                    jumping: false,
                    onGround: false,
                    jump() {
                        if (this.onGround) {
                            this.vy = -12; // Increased jump for bigger player
                            this.jumping = true;
                            this.onGround = false;
                        }
                    }
                };

                // Generate level
                this.generateLevel();

                // Clear result (only for fullscreen)
                const resultElement = platformerFullscreenMode ?
                    document.getElementById('platformer-result-fs') : null;
                if (resultElement) {
                    resultElement.innerHTML = '';
                }

                // Start timer
                this.timer = setInterval(() => {
                    if (this.gameActive) {
                        this.gameTime--;

                        if (this.gameTime <= 0) {
                            this.endGame();
                        }
                    }
                }, 1000);

                // Start game loop
                this.gameLoop();
            },

            generateLevel() {
                this.platforms = [];
                this.coins = [];
                this.enemies = [];
                this.questionBlocks = [];
                this.bricks = [];
                this.pipes = [];
                this.powerups = [];
                this.particles = [];

                // Ground - long ground like in Mario (lower due to bigger canvas)
                for (let i = 0; i < this.levelWidth / 30; i++) {
                    this.platforms.push({
                        x: i * 30,
                        y: 450,
                        width: 30,
                        height: 50,
                        type: 'ground'
                    });
                }

                // Question blocks (? blocks with coins) - LOWER, so you can jump to them
                const questionPositions = [
                    { x: 150, y: 350 },
                    { x: 180, y: 350 },
                    { x: 210, y: 350 },
                    { x: 400, y: 330 },
                    { x: 600, y: 350 },
                    { x: 800, y: 330 },
                    { x: 1000, y: 350 },
                    { x: 1200, y: 330 },
                    { x: 1400, y: 350 },
                    { x: 1600, y: 330 },
                    { x: 1800, y: 350 },
                    { x: 2000, y: 330 },
                    { x: 2200, y: 350 },
                    { x: 2400, y: 330 },
                ];

                questionPositions.forEach(pos => {
                    this.questionBlocks.push({
                        x: pos.x,
                        y: pos.y,
                        width: 24,
                        height: 24,
                        hit: false,
                        coins: Math.floor(Math.random() * 3) + 1
                    });
                });

                // Brick blocks (breakable blocks) - LOWER and smaller
                const brickPatterns = [
                    { x: 300, y: 370, count: 3 },
                    { x: 500, y: 350, count: 2 },
                    { x: 700, y: 370, count: 3 },
                    { x: 900, y: 350, count: 4 },
                    { x: 1100, y: 370, count: 2 },
                    { x: 1300, y: 350, count: 3 },
                    { x: 1500, y: 370, count: 2 },
                    { x: 1700, y: 350, count: 3 },
                    { x: 1900, y: 370, count: 2 },
                    { x: 2100, y: 350, count: 2 },
                ];

                brickPatterns.forEach(pattern => {
                    for (let i = 0; i < pattern.count; i++) {
                        this.bricks.push({
                            x: pattern.x + i * 24,
                            y: pattern.y,
                            width: 24,
                            height: 24,
                            broken: false
                        });
                    }
                });

                // Pipes (pipes like in Mario)
                const pipePositions = [
                    { x: 450, height: 40 },
                    { x: 750, height: 50 },
                    { x: 1050, height: 40 },
                    { x: 1350, height: 60 },
                    { x: 1650, height: 40 },
                    { x: 1950, height: 50 },
                    { x: 2250, height: 40 },
                ];

                pipePositions.forEach(pipe => {
                    this.pipes.push({
                        x: pipe.x,
                        y: 450 - pipe.height,
                        width: 40,
                        height: pipe.height,
                        type: 'pipe'
                    });
                });

                // Floating platforms (floating platforms) - at different heights
                const platformData = [
                    { x: 550, y: 380, width: 60 },
                    { x: 650, y: 350, width: 50 },
                    { x: 750, y: 320, width: 45 },
                    { x: 850, y: 360, width: 60 },
                    { x: 1150, y: 370, width: 55 },
                    { x: 1250, y: 340, width: 50 },
                    { x: 1450, y: 360, width: 60 },
                    { x: 1750, y: 350, width: 50 },
                    { x: 2050, y: 370, width: 60 },
                    { x: 2350, y: 360, width: 55 },
                ];

                platformData.forEach(plat => {
                    this.platforms.push({
                        x: plat.x,
                        y: plat.y,
                        width: plat.width,
                        height: 12,
                        type: 'platform'
                    });
                });

                // Enemies (mushroom enemies)
                for (let i = 0; i < 15; i++) {
                    this.enemies.push({
                        x: 300 + i * 200,
                        y: 426,
                        width: 24,
                        height: 24,
                        vx: 1.5,
                        direction: 1,
                        type: 'goomba',
                        dead: false
                    });
                }

                // Finish flag (flag at the end)
                this.finishFlag = {
                    x: this.levelWidth - 100,
                    y: 330,
                    width: 10,
                    height: 120,
                    reached: false
                };
            },

            gameLoop() {
                if (!this.gameActive) return;

                this.animationFrame++;

                // Clear canvas
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // Sky gradient
                const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                gradient.addColorStop(0, '#5C94FC');
                gradient.addColorStop(1, '#87CEEB');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Update camera to follow player
                this.updateCamera();

                // Save context and apply camera offset
                this.ctx.save();
                this.ctx.translate(-this.camera.x, 0);

                // Update player physics
                this.updatePlayer();

                // Update enemies
                this.updateEnemies();

                // Update particles
                this.updateParticles();

                // Check collisions
                this.checkCollisions();

                // Draw everything
                this.draw();

                // Restore context
                this.ctx.restore();

                // Draw UI on top (not affected by camera)
                this.drawUI();

                // Continue loop
                this.animFrame = requestAnimationFrame(() => this.gameLoop());
            },

            updateCamera() {
                // Camera follows player (Mario style)
                const targetX = this.player.x - this.canvas.width / 3;
                this.camera.x = Math.max(0, Math.min(targetX, this.levelWidth - this.canvas.width));
            },

            updateParticles() {
                this.particles = this.particles.filter(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.3; // gravity
                    p.life--;
                    return p.life > 0;
                });
            },

            drawUI() {
                // Game info panel at top (fixed position, not affected by camera)
                const panelHeight = 60; // INCREASED panel height!

                // Semi-transparent background
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                this.ctx.fillRect(0, 0, this.canvas.width, panelHeight);

                // Stats text - HUGE TEXT!
                this.ctx.fillStyle = '#FFF';
                this.ctx.strokeStyle = '#000';
                this.ctx.lineWidth = 4;
                this.ctx.font = 'bold 28px "Courier New"'; // Was 18px, now 28px!

                // Coins
                this.ctx.strokeText(`рџ’° ${this.coinsCollected}`, 20, 40);
                this.ctx.fillText(`рџ’° ${this.coinsCollected}`, 20, 40);

                // Lives
                this.ctx.strokeText(`вќ¤пёЏ ${this.lives}`, 160, 40);
                this.ctx.fillText(`вќ¤пёЏ ${this.lives}`, 160, 40);

                // Time
                this.ctx.strokeText(`вЏ±пёЏ ${this.gameTime}s`, 300, 40);
                this.ctx.fillText(`вЏ±пёЏ ${this.gameTime}s`, 300, 40);

                // Score
                this.ctx.strokeText(`в… ${this.score}`, 480, 40);
                this.ctx.fillText(`в… ${this.score}`, 480, 40);

                // Progress bar (how far in level) - BIGGER!
                const progress = (this.player.x / this.levelWidth) * 100;
                const barWidth = 300; // Fixed width
                const barX = this.canvas.width - barWidth - 30;
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.fillRect(barX, 20, barWidth, 25);
                this.ctx.fillStyle = '#10B981';
                this.ctx.fillRect(barX, 20, (barWidth * progress) / 100, 25);
                this.ctx.strokeStyle = '#FFF';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(barX, 20, barWidth, 25);
            },

            updatePlayer() {
                // Horizontal movement
                if (this.keys['ArrowLeft'] || this.keys['a']) {
                    this.player.vx = -3;
                } else if (this.keys['ArrowRight'] || this.keys['d']) {
                    this.player.vx = 3;
                    } else {
                    this.player.vx *= 0.8;
                }

                // Apply gravity
                this.player.vy += 0.4;

                // Apply velocity
                this.player.x += this.player.vx;
                this.player.y += this.player.vy;

                // Limit falling speed
                if (this.player.vy > 10) this.player.vy = 10;

                // Keep player in bounds horizontally - NOT canvas.width, but levelWidth!
                if (this.player.x < 0) this.player.x = 0;
                if (this.player.x > this.levelWidth - this.player.width) {
                    this.player.x = this.levelWidth - this.player.width;
                }

                // Check if fell off
                if (this.player.y > this.canvas.height) {
                    this.loseLife();
                }
            },

            updateEnemies() {
                this.enemies.forEach(enemy => {
                    enemy.x += enemy.vx * enemy.direction;

                    // Bounce off edges
                    if (enemy.x < 0 || enemy.x > this.canvas.width - enemy.width) {
                        enemy.direction *= -1;
                    }
                });
            },

            checkCollisions() {
                // Reset ground detection
                this.player.onGround = false;

                // Platform collision (ground and floating) - ONLY from top, NO sides!
                [...this.platforms, ...this.pipes].forEach(platform => {
                    // Landing on top - with big margin to NOT block from sides
                    if (this.player.x + 8 < platform.x + platform.width &&
                        this.player.x + this.player.width - 8 > platform.x &&
                        this.player.y + this.player.height >= platform.y &&
                        this.player.y + this.player.height <= platform.y + 12 &&
                        this.player.vy >= 0) {

                        this.player.y = platform.y - this.player.height;
                        this.player.vy = 0;
                        this.player.onGround = true;
                        this.player.jumping = false;
                    }
                });

                // Question block collision from below
                this.questionBlocks.forEach(block => {
                    // Hit from below (with BIG margin - do NOT block from sides!)
                    if (!block.hit &&
                        this.player.x + 8 < block.x + block.width &&
                        this.player.x + this.player.width - 8 > block.x &&
                        this.player.y <= block.y + block.height &&
                        this.player.y + 8 >= block.y &&
                        this.player.vy < 0) {

                        block.hit = true;
                        this.coinsCollected += block.coins;
                        this.score += block.coins * 10;

                        // Spawn coin particles
                        for (let i = 0; i < block.coins; i++) {
                            this.particles.push({
                                x: block.x + 12,
                                y: block.y,
                                vx: (Math.random() - 0.5) * 4,
                                vy: -4,
                                life: 30,
                                type: 'coin'
                            });
                        }

                        this.player.vy = 1; // Bounce back down
                    }

                    // Stand on question block (with BIG margin - do NOT block from sides!)
                    if (this.player.x + 8 < block.x + block.width &&
                        this.player.x + this.player.width - 8 > block.x &&
                        this.player.y + this.player.height >= block.y &&
                        this.player.y + this.player.height <= block.y + 12 &&
                        this.player.vy >= 0) {

                        this.player.y = block.y - this.player.height;
                        this.player.vy = 0;
                        this.player.onGround = true;
                        this.player.jumping = false;
                    }
                });

                // Brick collision
                this.bricks.forEach(brick => {
                    if (!brick.broken) {
                        // Hit from below (with BIG margin - do NOT block from sides!)
                        if (this.player.x + 8 < brick.x + brick.width &&
                            this.player.x + this.player.width - 8 > brick.x &&
                            this.player.y <= brick.y + brick.height &&
                            this.player.y + 8 >= brick.y &&
                            this.player.vy < 0) {

                            brick.broken = true;
                            this.score += 5;

                            // Spawn brick particles
                            for (let i = 0; i < 4; i++) {
                                this.particles.push({
                                    x: brick.x + 12,
                                    y: brick.y + 12,
                                    vx: (Math.random() - 0.5) * 5,
                                    vy: -3 - Math.random() * 3,
                                    life: 40,
                                    type: 'brick'
                                });
                            }

                            this.player.vy = 1;
                        }

                        // Stand on brick (with BIG margin - do NOT block from sides!)
                        if (this.player.x + 8 < brick.x + brick.width &&
                            this.player.x + this.player.width - 8 > brick.x &&
                            this.player.y + this.player.height >= brick.y &&
                            this.player.y + this.player.height <= brick.y + 12 &&
                            this.player.vy >= 0) {

                            this.player.y = brick.y - this.player.height;
                            this.player.vy = 0;
                            this.player.onGround = true;
                            this.player.jumping = false;
                        }
                    }
                });

                // Enemy collision - enemies are NOT physical obstacles, only damage!
                this.enemies.forEach(enemy => {
                    if (!enemy.dead && !enemy.justHit &&
                        this.player.x < enemy.x + enemy.width - 5 &&
                        this.player.x + this.player.width > enemy.x + 5 &&
                        this.player.y < enemy.y + enemy.height &&
                        this.player.y + this.player.height > enemy.y) {

                        // Jump on enemy from TOP (kill it) - РїСЂС‹Р¶РѕРє СЃРІРµСЂС…Сѓ
                        if (this.player.vy > 0 && this.player.y + this.player.height - 15 < enemy.y + 8) {
                            enemy.dead = true;
                            this.player.vy = -8; // РћС‚СЃРєРѕРє РїРѕСЃР»Рµ СѓР±РёР№СЃС‚РІР°
                            this.score += 20;

                            setTimeout(() => {
                                const index = this.enemies.indexOf(enemy);
                                if (index > -1) this.enemies.splice(index, 1);
                            }, 500);
                        }
                        // РљР°СЃР°РЅРёРµ СЃР±РѕРєСѓ/СЃРЅРёР·Сѓ - СѓСЂРѕРЅ (РЅРѕ РџР РћРҐРћР”РРњ СЃРєРІРѕР·СЊ!)
                        else {
                            enemy.justHit = true; // Cooldown С‡С‚РѕР±С‹ РЅРµ СѓРјРµСЂРµС‚СЊ 100 СЂР°Р· РїРѕРґСЂСЏРґ
                            this.loseLife();
                            setTimeout(() => {
                                enemy.justHit = false;
                            }, 1000);
                        }
                    }
                });

                // Finish flag
                if (this.finishFlag && !this.finishFlag.reached &&
                    this.player.x + this.player.width > this.finishFlag.x) {
                    this.finishFlag.reached = true;
                    this.winGame();
                }
            },

            winGame() {
                this.gameActive = false;
                clearInterval(this.timer);
                cancelAnimationFrame(this.animFrame);

                // Huge bonus for finishing!
                const timeBonus = this.gameTime * 5;
                const totalReward = this.coinsCollected * 10 + timeBonus + 200;

                gameState.tama += totalReward;
            updateUI();

                if (typeof TransactionLogger !== 'undefined') {
                    const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
                    if (userId && typeof TransactionLogger !== 'undefined') {
                        TransactionLogger.logEarn(
                            userId,
                            window.Telegram?.WebApp?.initDataUnsafe?.user?.username || window.WALLET_ADDRESS?.substring(0, 8) || 'user',
                            'platformer_complete',
                            totalReward,
                            gameState.tama - totalReward,
                            gameState.tama,
                            { coins: this.coinsCollected, timeBonus, finished: true }
                        );
                    }
                }

                const mobileControls = document.getElementById('mobile-controls');
                if (mobileControls) mobileControls.style.display = 'none';

                const mobileControlsFs = document.getElementById('mobile-controls-fullscreen');
                if (mobileControlsFs) mobileControlsFs.style.display = 'none';

                const resultElement = platformerFullscreenMode ?
                    document.getElementById('platformer-result-fs') :
                    document.getElementById('platformer-result');

                if (resultElement) {
                    resultElement.innerHTML =
                        `<strong>рџЏ† LEVEL COMPLETE!</strong><br>` +
                        `Coins: ${this.coinsCollected} (+${this.coinsCollected * 10} TAMA)<br>` +
                        `Time Bonus: ${timeBonus} TAMA<br>` +
                        `Finish Bonus: +200 TAMA<br>` +
                        `<strong>Total: +${totalReward} TAMA!</strong><br>` +
                        `Net: +${totalReward - 100} TAMA рџЋ‰`;
                }

                triggerAutoSave();
            },

            loseLife() {
                this.lives--;

                if (this.lives <= 0) {
                    this.endGame();
                } else {
                    // Reset player position
                    this.player.x = 50;
                    this.player.y = 380;
                    this.player.vx = 0;
                    this.player.vy = 0;
                }
            },

            draw() {
                // Draw ground blocks (Mario style)
                this.platforms.forEach(platform => {
                    if (platform.type === 'ground') {
                        this.ctx.fillStyle = '#C84C09';
                        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                        // Grid pattern
                        this.ctx.strokeStyle = '#8B3A0E';
                        this.ctx.lineWidth = 1;
                        this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
                    } else {
                        // Floating platform - green like Mario
                        this.ctx.fillStyle = '#10B981';
                        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                        this.ctx.strokeStyle = '#059669';
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
                    }
                });

                // Draw pipes (green Mario pipes)
                this.pipes.forEach(pipe => {
                    // Pipe body
                    this.ctx.fillStyle = '#10B981';
                    this.ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
                    // Pipe rim (top)
                    this.ctx.fillStyle = '#059669';
                    this.ctx.fillRect(pipe.x - 4, pipe.y, pipe.width + 8, 8);
                    // Pipe outline
                    this.ctx.strokeStyle = '#047857';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(pipe.x, pipe.y, pipe.width, pipe.height);
                    this.ctx.strokeRect(pipe.x - 4, pipe.y, pipe.width + 8, 8);
                });

                // Draw question blocks (animated)
                this.questionBlocks.forEach(block => {
                    if (!block.hit) {
                        const bounce = Math.sin(this.animationFrame * 0.1) * 2;
                        // Yellow block with question mark
                        this.ctx.fillStyle = '#F59E0B';
                        this.ctx.fillRect(block.x, block.y + bounce, block.width, block.height);
                        // Border
                        this.ctx.strokeStyle = '#D97706';
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeRect(block.x, block.y + bounce, block.width, block.height);
                        // Question mark
                        this.ctx.fillStyle = '#FFF';
                        this.ctx.font = 'bold 18px Arial';
                        this.ctx.fillText('?', block.x + 7, block.y + bounce + 18);
                    } else {
                        // Used block (brown)
                        this.ctx.fillStyle = '#8B4513';
                        this.ctx.fillRect(block.x, block.y, block.width, block.height);
                        this.ctx.strokeStyle = '#654321';
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeRect(block.x, block.y, block.width, block.height);
                    }
                });

                // Draw bricks
                this.bricks.forEach(brick => {
                    if (!brick.broken) {
                        this.ctx.fillStyle = '#DC2626';
                        this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                        // Brick pattern
                        this.ctx.strokeStyle = '#991B1B';
                        this.ctx.lineWidth = 1;
                        this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
                        this.ctx.beginPath();
                        this.ctx.moveTo(brick.x + 12, brick.y);
                        this.ctx.lineTo(brick.x + 12, brick.y + brick.height);
                        this.ctx.stroke();
                    }
                });

                // Draw particles
                this.particles.forEach(p => {
                    if (p.type === 'coin') {
                        this.ctx.fillStyle = '#FFD700';
                        this.ctx.font = 'bold 12px Arial';
                        this.ctx.fillText('$', p.x, p.y);
                    } else if (p.type === 'brick') {
                        this.ctx.fillStyle = '#DC2626';
                        this.ctx.fillRect(p.x, p.y, 4, 4);
                    }
                });

                // Draw enemies (Goomba style)
                this.enemies.forEach(enemy => {
                    if (!enemy.dead) {
                        // Brown mushroom enemy
                        this.ctx.fillStyle = '#8B4513';
                        this.ctx.beginPath();
                        this.ctx.arc(enemy.x + 12, enemy.y + 10, 12, Math.PI, 0);
                        this.ctx.fill();
                        // Body
                        this.ctx.fillStyle = '#A0522D';
                        this.ctx.fillRect(enemy.x + 4, enemy.y + 10, 16, 14);
                        // Eyes
                        this.ctx.fillStyle = '#FFF';
                        this.ctx.fillRect(enemy.x + 6, enemy.y + 6, 5, 5);
                        this.ctx.fillRect(enemy.x + 13, enemy.y + 6, 5, 5);
                        this.ctx.fillStyle = '#000';
                        this.ctx.fillRect(enemy.x + 8, enemy.y + 8, 2, 2);
                        this.ctx.fillRect(enemy.x + 15, enemy.y + 8, 2, 2);
                        // Angry eyebrows
                        this.ctx.strokeStyle = '#000';
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.ctx.moveTo(enemy.x + 6, enemy.y + 5);
                        this.ctx.lineTo(enemy.x + 11, enemy.y + 7);
                        this.ctx.moveTo(enemy.x + 13, enemy.y + 7);
                        this.ctx.lineTo(enemy.x + 18, enemy.y + 5);
                        this.ctx.stroke();
            } else {
                        // Squashed enemy
                        this.ctx.fillStyle = '#8B4513';
                        this.ctx.fillRect(enemy.x, enemy.y + 18, enemy.width, 6);
                    }
                });

                // Draw finish flag
                if (this.finishFlag) {
                    // Flag pole
                    this.ctx.fillStyle = '#4B5563';
                    this.ctx.fillRect(this.finishFlag.x, this.finishFlag.y, this.finishFlag.width, this.finishFlag.height);
                    // Flag
                    this.ctx.fillStyle = this.finishFlag.reached ? '#10B981' : '#EF4444';
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.finishFlag.x + 10, this.finishFlag.y);
                    this.ctx.lineTo(this.finishFlag.x + 50, this.finishFlag.y + 15);
                    this.ctx.lineTo(this.finishFlag.x + 10, this.finishFlag.y + 30);
                    this.ctx.fill();
                }

                // Draw player (Р‘РћР›Р¬РЁРћР™ Mario-style!)
                const playerColor = '#FF0000'; // Red like Mario
                const overallsColor = '#0000FF'; // Blue overalls
                const scale = 1.67; // 40/24 = 1.67

                // Body (overalls) - СѓРІРµР»РёС‡РµРЅРѕ!
                this.ctx.fillStyle = overallsColor;
                this.ctx.fillRect(this.player.x + 10, this.player.y + 16, 20, 22);

                // Head - СѓРІРµР»РёС‡РµРЅР°!
                this.ctx.fillStyle = '#FFDBAC';
                this.ctx.fillRect(this.player.x + 10, this.player.y + 6, 20, 16);

                // Hat - СѓРІРµР»РёС‡РµРЅР°!
                this.ctx.fillStyle = playerColor;
                this.ctx.fillRect(this.player.x + 6, this.player.y, 28, 10);

                // Eyes - СѓРІРµР»РёС‡РµРЅС‹!
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(this.player.x + 13, this.player.y + 12, 4, 4);
                this.ctx.fillRect(this.player.x + 23, this.player.y + 12, 4, 4);

                // Mustache - СѓРІРµР»РёС‡РµРЅС‹!
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(this.player.x + 13, this.player.y + 18, 14, 3);

                // Shoes - СѓРІРµР»РёС‡РµРЅС‹!
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(this.player.x + 6, this.player.y + 36, 10, 4);
                this.ctx.fillRect(this.player.x + 24, this.player.y + 36, 10, 4);
            },

            endGame() {
                this.gameActive = false;
                clearInterval(this.timer);
                cancelAnimationFrame(this.animFrame);

                // Hide mobile controls
                const mobileControls = document.getElementById('mobile-controls');
                if (mobileControls) {
                    mobileControls.style.display = 'none';
                }

                const mobileControlsFs = document.getElementById('mobile-controls-fullscreen');
                if (mobileControlsFs) {
                    mobileControlsFs.style.display = 'none';
                }

                // Calculate reward
                let reward = 0;
                let message = '';

                if (this.coinsCollected >= 40) {
                    reward = 500;
                    message = 'рџЏ† AMAZING! +500 TAMA!';
                } else if (this.coinsCollected >= 30) {
                    reward = 300;
                    message = 'рџЋ‰ GREAT! +300 TAMA!';
                } else if (this.coinsCollected >= 20) {
                    reward = 150;
                    message = 'рџ‘Ќ GOOD! +150 TAMA!';
                } else if (this.coinsCollected >= 10) {
                    reward = 50;
                    message = 'рџЉ Not bad! +50 TAMA';
            } else {
                    message = 'рџў Try again! 0 TAMA';
                }

                gameState.tama += reward;
            updateUI();

                if (typeof TransactionLogger !== 'undefined' && reward > 0) {
                    TransactionLogger.logEarn(
                        window.TELEGRAM_USER_ID,
                        window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'user',
                        'platformer_win',
                        reward,
                        gameState.tama - reward,
                        gameState.tama,
                        { coins: this.coinsCollected, score: this.score }
                    );
                }

                const resultElement = platformerFullscreenMode ?
                    document.getElementById('platformer-result-fs') :
                    document.getElementById('platformer-result');

                if (resultElement) {
                    resultElement.innerHTML =
                        `<strong>${message}</strong><br>` +
                        `Coins: ${this.coinsCollected} | Score: ${this.score}<br>` +
                        `Net: ${reward - 100 >= 0 ? '+' : ''}${reward - 100} TAMA`;
                }

            triggerAutoSave();
        }
        };

        // Initialize platformer when page loads
        platformerGame.init();

        // Fullscreen Platformer Functions
        let platformerFullscreenMode = false;

        function openPlatformerFullscreen() {
            const modal = document.getElementById('platformer-fullscreen-modal');
            if (modal) {
                modal.style.display = 'block';
                platformerFullscreenMode = true;

                // Switch game to fullscreen canvas
                platformerGame.canvas = document.getElementById('platformer-canvas-fullscreen');
                platformerGame.ctx = platformerGame.canvas.getContext('2d');

                // Setup fullscreen mobile controls
                setupFullscreenMobileControls();

                // Re-attach start button
                const startBtn = document.getElementById('platformer-start-btn-fs');
                if (startBtn) {
                    startBtn.replaceWith(startBtn.cloneNode(true));
                    const newStartBtn = document.getElementById('platformer-start-btn-fs');
                    if (newStartBtn) {
                        newStartBtn.addEventListener('click', () => {
                        if (gameState.tama < 100) {
                            showMessage('вќЊ Not enough TAMA! Need 100 TAMA');
                            return;
                        }

                        gameState.tama -= 100;
                        updateUI();
                        if (typeof TransactionLogger !== 'undefined') {
                            TransactionLogger.logSpend(
                                window.TELEGRAM_USER_ID,
                                window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'user',
                                'platformer_bet',
                                100,
                                gameState.tama + 100,
                                gameState.tama,
                                { game: 'platformer_fullscreen' }
                            );
                        }

                        platformerGame.start();
                    });
                    }
                }
            }
        }

        function closePlatformerFullscreen() {
            const modal = document.getElementById('platformer-fullscreen-modal');
            if (modal) {
                modal.style.display = 'none';
                platformerFullscreenMode = false;

                // Stop game if running
                if (platformerGame.gameActive) {
                    platformerGame.gameActive = false;
                    clearInterval(platformerGame.timer);
                    cancelAnimationFrame(platformerGame.animFrame);
                }

                // РќРµС‚ "normal canvas", РѕСЃС‚Р°РµРјСЃСЏ РЅР° fullscreen
                platformerFullscreenMode = false;
            }
        }

        function setupFullscreenMobileControls() {
            const btnLeft = document.getElementById('btn-left-fs');
            const btnRight = document.getElementById('btn-right-fs');
            const btnJump = document.getElementById('btn-jump-fs');
            const mobileControls = document.getElementById('mobile-controls-fullscreen');

            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            if (!btnLeft || !btnRight || !btnJump) return;

            if (isTouchDevice && mobileControls) {
                mobileControls.style.display = 'block';
            }

            // Left
            btnLeft.addEventListener('touchstart', (e) => {
                e.preventDefault();
                platformerGame.keys['ArrowLeft'] = true;
                btnLeft.style.background = 'rgba(0,0,0,0.9)';
            });
            btnLeft.addEventListener('touchend', (e) => {
                e.preventDefault();
                platformerGame.keys['ArrowLeft'] = false;
                btnLeft.style.background = 'rgba(0,0,0,0.6)';
            });

            // Right
            btnRight.addEventListener('touchstart', (e) => {
                e.preventDefault();
                platformerGame.keys['ArrowRight'] = true;
                btnRight.style.background = 'rgba(0,0,0,0.9)';
            });
            btnRight.addEventListener('touchend', (e) => {
                e.preventDefault();
                platformerGame.keys['ArrowRight'] = false;
                btnRight.style.background = 'rgba(0,0,0,0.6)';
            });

            // Jump
            btnJump.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (platformerGame.gameActive && platformerGame.player) {
                    platformerGame.player.jump();
                }
                btnJump.style.background = 'rgba(255,69,0,1)';
            });
            btnJump.addEventListener('touchend', (e) => {
                e.preventDefault();
                btnJump.style.background = 'rgba(255,69,0,0.8)';
            });
        }

        // рџЏѓ PET RACE
        function startRace() {
            if (gameState.tama < 75) {
                showMessage('вќЊ Not enough TAMA! Need 75 TAMA');
                return;
            }

            gameState.tama -= 75;
            updateUI();

            const racer1 = document.getElementById('racer-1');
            const racer2 = document.getElementById('racer-2');
            const racer3 = document.getElementById('racer-3');
            const raceResult = document.getElementById('race-result');

            raceResult.textContent = 'Racing...';

            const speeds = [
                Math.random() * 3 + 2,
                Math.random() * 3 + 2,
                Math.random() * 3 + 2
            ];

            let positions = [0, 0, 0];
            const racers = [racer1, racer2, racer3];

            const interval = setInterval(() => {
                positions = positions.map((pos, i) => pos + speeds[i]);

                racers.forEach((racer, i) => {
                    racer.style.marginLeft = positions[i] + 'px';
                });

                if (Math.max(...positions) >= 300) {
                    clearInterval(interval);
                    const winner = positions.indexOf(Math.max(...positions));

                    if (winner === 0) {
                        const reward = 750;
                        gameState.tama += reward;
                        raceResult.textContent = `рџЋ‰ YOUR PET WON! +${reward} TAMA!`;
                    } else {
                        raceResult.textContent = `рџ” You lost! Better luck next time!`;
                    }

                    updateUI();
                    triggerAutoSave();

                    setTimeout(() => {
                        positions = [0, 0, 0];
                        racers.forEach(racer => racer.style.marginLeft = '0px');
                    }, 2000);
                }
            }, 50);
        }

        // вљ”пёЏ BATTLE ARENA - PVP SYSTEM
        // Note: SUPABASE_URL and SUPABASE_ANON_KEY are already declared earlier in the script

        let battleState = {
            active: false,
            battleId: null,
            betAmount: 0,
            isPlayer1: false,
            currentRound: 1,
            player1Score: 0,
            player2Score: 0,
            player1Move: null,
            player2Move: null,
            matchmakingInterval: null,
            matchmakingTime: 0,
            roundTimer: null,
            roundTimeLeft: 10,
            vsBot: false,
            botDifficulty: 0.7 // 70% smart AI
        };

        // Initialize battle buttons
        document.querySelectorAll('.bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const bet = parseInt(btn.dataset.bet);
                startMatchmaking(bet);
            });
        });

        // Initialize battle actions
        document.querySelectorAll('.battle-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                submitBattleMove(action);
            });
        });

        function startMatchmaking(betAmount) {
            if (gameState.tama < betAmount) {
                showMessage(`вќЊ Not enough TAMA! Need ${betAmount} TAMA`);
                return;
            }

            battleState.betAmount = betAmount;

            // Deduct bet
            gameState.tama -= betAmount;
            updateUI();

            // Log transaction
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'spend_battle_bet', -betAmount, `Placed ${betAmount} TAMA bet for PVP Battle`, gameState);
            }

            // Show matchmaking screen
            document.getElementById('battle-lobby').style.display = 'none';
            document.getElementById('battle-matchmaking').style.display = 'block';

            battleState.matchmakingTime = 0;

            // Try to find opponent or start with bot after 10 seconds
            battleState.matchmakingInterval = setInterval(async () => {
                battleState.matchmakingTime++;
                document.getElementById('matchmaking-timer').textContent = `${battleState.matchmakingTime}s`;

                // After 5 seconds, start with bot
                if (battleState.matchmakingTime >= 5) {
                    clearInterval(battleState.matchmakingInterval);
                    startBattleWithBot();
                } else {
                    // Try to find real opponent (for future implementation)
                    // const opponent = await findOpponent(betAmount);
                    // if (opponent) {
                    //     startBattle(opponent);
                    // }
                }
            }, 1000);
        }

        function cancelMatchmaking() {
            clearInterval(battleState.matchmakingInterval);

            // Refund bet
            gameState.tama += battleState.betAmount;
            updateUI();

            // Log refund transaction
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'refund_battle_bet', battleState.betAmount, `Refunded ${battleState.betAmount} TAMA (cancelled matchmaking)`, gameState);
            }

            // Back to lobby
            document.getElementById('battle-matchmaking').style.display = 'none';
            document.getElementById('battle-lobby').style.display = 'block';

            battleState.betAmount = 0;
        }

        function startBattleWithBot() {
            battleState.active = true;
            battleState.vsBot = true;
            battleState.currentRound = 1;
            battleState.player1Score = 0;
            battleState.player2Score = 0;

            // Show battle screen
            document.getElementById('battle-matchmaking').style.display = 'none';
            document.getElementById('battle-fight').style.display = 'block';

            // Set player names
            document.getElementById('battle-player1-name').textContent = window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'You';
            document.getElementById('battle-player2-name').textContent = getRandomBotName();

            // Start first round
            startBattleRound();
        }

        function getRandomBotName() {
            const botNames = ['CryptoBot', 'TamaKing', 'PetMaster', 'BlockChain', 'SolanaWarrior', 'DiamondHands', 'MoonPet', 'RocketBot'];
            return botNames[Math.floor(Math.random() * botNames.length)];
        }

        function startBattleRound() {
            battleState.player1Move = null;
            battleState.player2Move = null;
            battleState.roundTimeLeft = 10;

            // Update round display
            document.getElementById('battle-round').textContent = `${battleState.currentRound}/5`;
            document.getElementById('battle-player1-score').textContent = battleState.player1Score;
            document.getElementById('battle-player2-score').textContent = battleState.player2Score;
            document.getElementById('battle-round-result').textContent = 'Choose your move!';

            // Enable action buttons
            document.querySelectorAll('.battle-action').forEach(btn => btn.disabled = false);

            // Start round timer
            battleState.roundTimer = setInterval(() => {
                battleState.roundTimeLeft--;
                document.getElementById('battle-timer').textContent = `${battleState.roundTimeLeft}s`;

                if (battleState.roundTimeLeft <= 0) {
                    // Time's up! Random move for player if not chosen
                    if (!battleState.player1Move) {
                        const moves = ['fast', 'strong', 'block'];
                        battleState.player1Move = moves[Math.floor(Math.random() * moves.length)];
                    }
                    resolveBattleRound();
                }
            }, 1000);
        }

        function submitBattleMove(move) {
            if (battleState.player1Move) return; // Already submitted

            battleState.player1Move = move;

            // Disable action buttons
            document.querySelectorAll('.battle-action').forEach(btn => btn.disabled = true);

            // Show waiting message
            document.getElementById('battle-round-result').textContent = 'Waiting for opponent...';

            // Bot makes move (with small delay for realism)
            setTimeout(() => {
                battleState.player2Move = getBotMove();
                resolveBattleRound();
            }, Math.random() * 1000 + 500);
        }

        function getBotMove() {
            const moves = ['fast', 'strong', 'block'];

            // Smart AI: 70% chance to counter player's last move
            if (Math.random() < battleState.botDifficulty && battleState.player1Move) {
                const counters = {
                    'fast': 'block',
                    'strong': 'fast',
                    'block': 'strong'
                };
                return counters[battleState.player1Move];
            }

            // Otherwise random
            return moves[Math.floor(Math.random() * moves.length)];
        }

        function resolveBattleRound() {
            clearInterval(battleState.roundTimer);

            const p1 = battleState.player1Move;
            const p2 = battleState.player2Move;

            let result = '';

            // Determine winner
            if (p1 === p2) {
                result = 'рџ¤ќ TIE!';
            } else if (
                (p1 === 'fast' && p2 === 'strong') ||
                (p1 === 'strong' && p2 === 'block') ||
                (p1 === 'block' && p2 === 'fast')
            ) {
                battleState.player1Score++;
                result = 'вњ… YOU WIN THIS ROUND!';
            } else {
                battleState.player2Score++;
                result = 'вќЊ OPPONENT WINS THIS ROUND!';
            }

            // Show result with moves
            const moveEmojis = { fast: 'вљЎ', strong: 'рџ’Є', block: 'рџ›ЎпёЏ' };
            document.getElementById('battle-round-result').textContent =
                `${moveEmojis[p1]} vs ${moveEmojis[p2]} - ${result}`;

            // Update scores
            document.getElementById('battle-player1-score').textContent = battleState.player1Score;
            document.getElementById('battle-player2-score').textContent = battleState.player2Score;

            // Check if battle is over
            if (battleState.currentRound >= 5 || battleState.player1Score >= 3 || battleState.player2Score >= 3) {
                setTimeout(() => endBattle(), 2000);
            } else {
                // Next round
                battleState.currentRound++;
                setTimeout(() => startBattleRound(), 2000);
            }
        }

        function endBattle() {
            battleState.active = false;

            const won = battleState.player1Score > battleState.player2Score;
            const prize = won ? Math.floor(battleState.betAmount * 1.8) : 0;

            // Show result screen
            document.getElementById('battle-fight').style.display = 'none';
            document.getElementById('battle-result').style.display = 'block';

            if (won) {
                document.getElementById('battle-result-title').textContent = 'рџЏ† VICTORY!';
                document.getElementById('battle-result-icon').textContent = 'рџЏ†';
                document.getElementById('battle-result-text').textContent = `You won ${prize} TAMA!`;

                gameState.tama += prize;

                // Log win transaction
                if (typeof logTransaction === 'function') {
                    logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_battle_win', prize, `Won ${prize} TAMA from PVP Battle`, gameState);
                }
            } else {
                document.getElementById('battle-result-title').textContent = 'рџ’Ђ DEFEAT!';
                document.getElementById('battle-result-icon').textContent = 'рџ’Ђ';
                document.getElementById('battle-result-text').textContent = `You lost ${battleState.betAmount} TAMA...`;

                // Log loss transaction (already deducted at start, just for logging)
                if (typeof logTransaction === 'function') {
                    logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'lose_battle', 0, `Lost ${battleState.betAmount} TAMA bet in PVP Battle`, gameState);
                }
            }

            document.getElementById('battle-final-score').textContent =
                `${battleState.player1Score}-${battleState.player2Score}`;

            updateUI();
            triggerAutoSave();
        }

        // рџЏЃ PET RACING SYSTEM
        let racingState = {
            active: false,
            betAmount: 0,
            position: 1,
            lap: 1,
            maxLaps: 5,
            speed: 0,
            maxSpeed: 100,
            acceleration: 2,
            deceleration: 1,
            nitro: 3,
            maxNitro: 3,
            gameTimer: null,
            raceStartTime: 0,
            lapTimes: [],
            aiCars: [
                { id: 'ai-car-1', position: 2, speed: 0, x: 30 },
                { id: 'ai-car-2', position: 3, speed: 0, x: 70 },
                { id: 'ai-car-3', position: 4, speed: 0, x: 50 }
            ],
            obstacles: [],
            playerX: 50,
            trackWidth: 100
        };

        // Initialize racing bet buttons
        document.querySelectorAll('.racing-bet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const bet = parseInt(btn.dataset.bet);
                startRacingGame(bet);
            });
        });

        function startRacingGame(betAmount) {
            if (gameState.tama < betAmount) {
                showMessage(`вќЊ Not enough TAMA! Need ${betAmount} TAMA`);
                return;
            }

            racingState.betAmount = betAmount;

            // Deduct bet
            gameState.tama -= betAmount;
            updateUI();

            // Log transaction
            if (typeof logTransaction === 'function') {
                logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'spend_racing_bet', -betAmount, `Placed ${betAmount} TAMA bet for Pet Racing`, gameState);
            }

            // Show racing game
            document.getElementById('racing-lobby').style.display = 'none';
            document.getElementById('racing-game').style.display = 'block';

            // Initialize race
            initRace();
        }

        function initRace() {
            racingState.active = true;
            racingState.position = 1;
            racingState.lap = 1;
            racingState.speed = 0;
            racingState.nitro = 3;
            racingState.playerX = 50;
            racingState.lapTimes = [];
            racingState.raceStartTime = Date.now();

            // Reset AI cars
            racingState.aiCars.forEach((car, index) => {
                car.position = index + 2;
                car.speed = 0;
                car.x = [30, 70, 50][index];
                document.getElementById(car.id).style.left = car.x + '%';
                document.getElementById(car.id).style.bottom = (60 + index * 40) + 'px';
            });

            // Reset player car
            document.getElementById('player-car').style.left = '50%';
            document.getElementById('player-car').style.bottom = '20px';

            // Initialize controls
            initRacingControls();

            // Start race timer
            racingState.gameTimer = setInterval(updateRace, 50); // 20 FPS

            updateRaceUI();
        }

        function initRacingControls() {
            const gasBtn = document.getElementById('racing-gas');
            const brakeBtn = document.getElementById('racing-brake');
            const nitroBtn = document.getElementById('racing-nitro');

            gasBtn.addEventListener('click', () => accelerate());
            brakeBtn.addEventListener('click', () => brake());
            nitroBtn.addEventListener('click', () => useNitro());

            // Touch controls for mobile
            gasBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                accelerate();
            });

            brakeBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                brake();
            });

            nitroBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                useNitro();
            });
        }

        function accelerate() {
            if (!racingState.active) return;

            racingState.speed = Math.min(racingState.maxSpeed, racingState.speed + racingState.acceleration);

            // Move player car forward
            const playerCar = document.getElementById('player-car');
            const currentBottom = parseInt(playerCar.style.bottom) || 20;
            playerCar.style.bottom = Math.min(280, currentBottom + racingState.speed * 0.3) + 'px';

            // Check for lap completion
            if (currentBottom >= 280) {
                completeLap();
            }
        }

        function brake() {
            if (!racingState.active) return;

            racingState.speed = Math.max(0, racingState.speed - racingState.deceleration * 2);
        }

        function useNitro() {
            if (!racingState.active || racingState.nitro <= 0) return;

            racingState.nitro--;
            racingState.speed = Math.min(racingState.maxSpeed, racingState.speed + 20);

            // Visual effect
            const playerCar = document.getElementById('player-car');
            playerCar.style.filter = 'brightness(1.5) drop-shadow(0 0 10px #8b5cf6)';
            setTimeout(() => {
                playerCar.style.filter = '';
            }, 500);
        }

        function completeLap() {
            racingState.lap++;
            const lapTime = Date.now() - racingState.raceStartTime;
            racingState.lapTimes.push(lapTime);
            racingState.raceStartTime = Date.now();

            // Reset car position
            document.getElementById('player-car').style.bottom = '20px';

            if (racingState.lap > racingState.maxLaps) {
                endRace();
            } else {
                updateRaceUI();
                document.getElementById('racing-status').textContent = `Lap ${racingState.lap} completed! Keep racing!`;
            }
        }

        function updateRace() {
            if (!racingState.active) return;

            // Update AI cars
            racingState.aiCars.forEach(car => {
                // AI logic - random acceleration
                if (Math.random() < 0.3) {
                    car.speed = Math.min(80, car.speed + 1);
                } else if (Math.random() < 0.1) {
                    car.speed = Math.max(0, car.speed - 1);
                }

                // Move AI car
                const aiElement = document.getElementById(car.id);
                const currentBottom = parseInt(aiElement.style.bottom) || 60;
                aiElement.style.bottom = Math.min(280, currentBottom + car.speed * 0.2) + 'px';

                // Reset AI car position if it completes lap
                if (currentBottom >= 280) {
                    aiElement.style.bottom = (60 + racingState.aiCars.indexOf(car) * 40) + 'px';
                }
            });

            // Natural deceleration
            racingState.speed = Math.max(0, racingState.speed - 0.5);

            // Update UI
            updateRaceUI();
        }

        function updateRaceUI() {
            document.getElementById('racing-position').textContent = getPositionText(racingState.position);
            document.getElementById('racing-lap').textContent = `${racingState.lap}/${racingState.maxLaps}`;
            document.getElementById('racing-speed').textContent = `${Math.round(racingState.speed)} km/h`;

            // Update nitro button
            const nitroBtn = document.getElementById('racing-nitro');
            nitroBtn.textContent = `рџ’Ё\nNITRO\n(${racingState.nitro})`;
            nitroBtn.disabled = racingState.nitro <= 0;
        }

        function getPositionText(position) {
            switch(position) {
                case 1: return '1st';
                case 2: return '2nd';
                case 3: return '3rd';
                case 4: return '4th';
                default: return position + 'th';
            }
        }

        function endRace() {
            racingState.active = false;
            clearInterval(racingState.gameTimer);

            // Calculate final position (simplified - player usually wins)
            const finalPosition = Math.random() < 0.7 ? 1 : Math.floor(Math.random() * 3) + 1;
            const won = finalPosition <= 3;

            // Calculate reward
            let reward = 0;
            if (finalPosition === 1) reward = Math.floor(racingState.betAmount * 3);
            else if (finalPosition === 2) reward = Math.floor(racingState.betAmount * 2);
            else if (finalPosition === 3) reward = Math.floor(racingState.betAmount * 1.5);

            // Show result screen
            document.getElementById('racing-game').style.display = 'none';
            document.getElementById('racing-result').style.display = 'block';

            if (won) {
                document.getElementById('racing-result-title').textContent = 'рџЏ† VICTORY!';
                document.getElementById('racing-result-icon').textContent = 'рџЏ†';
                document.getElementById('racing-result-text').textContent = `You won ${reward} TAMA!`;

                gameState.tama += reward;

                // Log win transaction
                if (typeof logTransaction === 'function') {
                    logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'earn_racing_win', reward, `Won ${reward} TAMA from Pet Racing (${getPositionText(finalPosition)} place)`, gameState);
                }
            } else {
                document.getElementById('racing-result-title').textContent = 'рџ’Ђ DEFEAT!';
                document.getElementById('racing-result-icon').textContent = 'рџ’Ђ';
                document.getElementById('racing-result-text').textContent = `You lost ${racingState.betAmount} TAMA...`;

                // Log loss transaction
                if (typeof logTransaction === 'function') {
                    logTransaction(window.TELEGRAM_USER_ID || 'unknown', 'lose_racing', 0, `Lost ${racingState.betAmount} TAMA bet in Pet Racing (${getPositionText(finalPosition)} place)`, gameState);
                }
            }

            document.getElementById('racing-final-position').textContent = getPositionText(finalPosition);
            document.getElementById('racing-best-lap').textContent = racingState.lapTimes.length > 0 ?
                (Math.min(...racingState.lapTimes) / 1000).toFixed(1) + 's' : 'N/A';

            updateUI();
            triggerAutoSave();
        }

        // рџЋЇ DARTS GAME
        function throwDart() {
            if (gameState.tama < 60) {
                showMessage('вќЊ Not enough TAMA! Need 60 TAMA');
                return;
            }

            gameState.tama -= 60;
            updateUI();

            const dartsResult = document.getElementById('darts-result');

            // Random hit zone
            const distance = Math.random() * 100;
            let reward = 0;
            let zone = '';

            if (distance < 10) {
                reward = 600;
                zone = 'BULLSEYE';
            } else if (distance < 30) {
                reward = 300;
                zone = 'BLUE ZONE';
            } else if (distance < 50) {
                reward = 150;
                zone = 'GREEN ZONE';
            } else if (distance < 70) {
                reward = 75;
                zone = 'YELLOW ZONE';
            } else {
                reward = 30;
                zone = 'RED ZONE';
            }

            gameState.tama += reward;
            updateUI();
            dartsResult.textContent = `рџЋЇ Hit ${zone}! +${reward} TAMA!`;
            triggerAutoSave();
        }

        const leaderboardBtn = document.getElementById('leaderboard-btn');
        const leaderboardModal = document.getElementById('leaderboard-modal');
        const closeLeaderboard = document.getElementById('close-leaderboard');
        const leaderboardList = document.getElementById('leaderboard-list');

        // Help Modal Elements
        const helpBtn = document.getElementById('help-btn');
        const helpModal = document.getElementById('help-modal');
        const closeHelp = document.getElementById('close-help');

        // More Menu Button
        const moreBtn = document.getElementById('more-btn');
        const moreMenu = document.getElementById('more-menu');
        const moreHelpBtn = document.getElementById('more-help-btn');
        const moreReferralBtn = document.getElementById('more-referral-btn');
        const moreProfileBtn = document.getElementById('more-profile-btn');

        // Toggle More Menu
        if (moreBtn && moreMenu) {
            moreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                moreMenu.classList.toggle('show');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!moreMenu.contains(e.target) && e.target !== moreBtn) {
                    moreMenu.classList.remove('show');
                }
            });
        }

        // More Menu Items
        if (moreHelpBtn && helpModal) {
            moreHelpBtn.addEventListener('click', () => {
                helpModal.classList.add('show');
                moreMenu.classList.remove('show');
            });
        }

        if (moreReferralBtn) {
            moreReferralBtn.addEventListener('click', async () => {
                // [cleaned]
                const referralModal = document.getElementById('referral-modal');
                if (referralModal) {
                    // Generate referral code and link BEFORE opening modal
                    const code = await generateReferralCode();
                    const link = await generateReferralLink();

                    // [cleaned]

                    // Display code
                    const codeDisplay = document.getElementById('referral-code-display');
                    if (codeDisplay) {
                        if (window.WALLET_ADDRESS && !window.Telegram?.WebApp?.initDataUnsafe?.user) {
                            // For wallet users, show shortened address
                            codeDisplay.textContent = window.WALLET_ADDRESS.substring(0, 12) + '...';
                            // [cleaned] + '...');
                        } else {
                            codeDisplay.textContent = code;
                            // [cleaned]
                        }
                    }

                    // Display link
                    const referralLinkDisplay = document.getElementById('referral-link-display');
                    if (referralLinkDisplay) {
                        referralLinkDisplay.value = link;
                    }

                    // Update referral progress bar
                    await updateReferralProgress();

                    // Now open modal
                    referralModal.classList.add('show');
                }
                moreMenu.classList.remove('show');
            });
        }

        // Profile Button (from More Menu)
        if (moreProfileBtn) {
            moreProfileBtn.addEventListener('click', () => {
                // Use full wallet address for wallet users, or telegram ID for telegram users
                const userId = window.TELEGRAM_USER_ID || window.WALLET_ADDRESS || window.WALLET_USER_ID;
                if (userId) {
                    window.location.href = `profile.html?user_id=${userId}`;
                } else {
                    showMessage('рџ”ђ Please connect your wallet or open in Telegram to view profile!', 'error');
                }
                moreMenu.classList.remove('show');
            });
        }
        const helpTabs = document.querySelectorAll('.help-tab');
        const helpTabContents = document.querySelectorAll('.help-tab-content');

        // [cleaned]

        // Open leaderboard
        if (leaderboardBtn && leaderboardModal) {
            leaderboardBtn.addEventListener('click', () => {
                // [cleaned]
                leaderboardModal.classList.add('show');
                loadLeaderboard();
            });
        } else {
            console.error('Leaderboard elements not found!');
        }

        // Open Profile (from dropdown) - REMOVED, using moreProfileBtn instead

        // Close leaderboard
        if (closeLeaderboard && leaderboardModal) {
            closeLeaderboard.addEventListener('click', () => {
                leaderboardModal.classList.remove('show');
            });
        }

        // Close on background click
        if (leaderboardModal) {
            leaderboardModal.addEventListener('click', (e) => {
                if (e.target.id === 'leaderboard-modal') {
                    leaderboardModal.classList.remove('show');
                }
            });
        }

        // Edit Name Modal Elements
        const editNameBtn = document.getElementById('edit-name-btn');
        const editNameModal = document.getElementById('edit-name-modal');
        const closeEditName = document.getElementById('close-edit-name');
        const newNameInput = document.getElementById('new-name-input');
        const saveNameBtn = document.getElementById('save-name-btn');
        const cancelNameBtn = document.getElementById('cancel-name-btn');
        const nameChangeStatus = document.getElementById('name-change-status');
        const playerNameDisplay = document.getElementById('player-name-display');

        // Open edit name modal
        if (editNameBtn && editNameModal) {
            editNameBtn.addEventListener('click', () => {
                const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
                const currentName = telegramUser?.username || telegramUser?.first_name || 'Player';
                newNameInput.value = currentName;
                nameChangeStatus.textContent = '';
                editNameModal.classList.add('show');
                newNameInput.focus();
            });
        }

        // Close edit name modal
        if (closeEditName && editNameModal) {
            closeEditName.addEventListener('click', () => {
                editNameModal.classList.remove('show');
            });
        }

        if (cancelNameBtn && editNameModal) {
            cancelNameBtn.addEventListener('click', () => {
                editNameModal.classList.remove('show');
            });
        }

        // Close on background click
        if (editNameModal) {
            editNameModal.addEventListener('click', (e) => {
                if (e.target.id === 'edit-name-modal') {
                    editNameModal.classList.remove('show');
                }
            });
        }

        // Save new name
        if (saveNameBtn && newNameInput) {
            saveNameBtn.addEventListener('click', async () => {
                const newName = newNameInput.value.trim();

                if (!newName || newName.length < 2) {
                    nameChangeStatus.textContent = 'вќЊ Name must be at least 2 characters';
                    nameChangeStatus.style.color = '#ff4444';
                    return;
                }

                if (newName.length > 20) {
                    nameChangeStatus.textContent = 'вќЊ Name is too long (max 20 characters)';
                    nameChangeStatus.style.color = '#ff4444';
                    return;
                }

                const userId = window.TELEGRAM_USER_ID;
                if (!userId) {
                    nameChangeStatus.textContent = 'вќЊ User ID not found';
                    nameChangeStatus.style.color = '#ff4444';
                    return;
                }

                // Show loading
                nameChangeStatus.textContent = 'вЏі Saving...';
                nameChangeStatus.style.color = '#fbbf24';
                saveNameBtn.disabled = true;

                try {
                    // Save to Supabase via API
                    const response = await fetch(`${TAMA_API_BASE}/leaderboard/upsert`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: userId,
                            user_type: 'telegram',
                            telegram_username: newName,
                            tama: gameState.tama,
                            level: gameState.level,
                            xp: gameState.xp,
                            pet_data: {
                                hp: gameState.hp,
                                food: gameState.food,
                                happy: gameState.happy,
                                totalClicks: gameState.totalClicks,
                                maxCombo: gameState.maxCombo,
                                xp: gameState.xp,
                                achievements: gameState.achievements,
                                selectedPet: gameState.selectedPet,
                                ownedPets: gameState.ownedPets,
                                petType: gameState.petType,
                                hasAutoFeeder: gameState.hasAutoFeeder
                            },
                            pet_name: gameState.petType || 'Gotchi',
                            pet_type: gameState.petType || 'kawai',
                            skip_transaction_log: true
                        })
                    });

                    if (response.ok) {
                        // вњ… Update custom username in game state
                        gameState.customUsername = newName;
                        // [cleaned]

                        nameChangeStatus.textContent = 'вњ… Name changed successfully!';
                        nameChangeStatus.style.color = '#00ff88';

                        // Update display
                        if (playerNameDisplay) {
                            playerNameDisplay.textContent = newName;
                        }

                        // Close modal after 1.5 seconds
                        setTimeout(() => {
                            editNameModal.classList.remove('show');
                            saveNameBtn.disabled = false;
                        }, 1500);
                    } else {
                        const error = await response.text();
                        console.error('вќЊ Name change failed:', error);
                        nameChangeStatus.textContent = 'вќЊ Failed to save name';
                        nameChangeStatus.style.color = '#ff4444';
                        saveNameBtn.disabled = false;
                    }
                } catch (error) {
                    console.error('вќЊ Name change error:', error);
                    nameChangeStatus.textContent = 'вќЊ Network error';
                    nameChangeStatus.style.color = '#ff4444';
                    saveNameBtn.disabled = false;
                }
            });

            // Allow Enter key to save
            newNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveNameBtn.click();
                }
            });
        }

        // Update player name display on init
        function updatePlayerNameDisplay() {
            if (playerNameDisplay) {
                // вњ… Use custom username if set, otherwise use Telegram username
                const displayName = gameState.customUsername ||
                    window.Telegram?.WebApp?.initDataUnsafe?.user?.username ||
                    window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name ||
                    'Player';
                playerNameDisplay.textContent = displayName;
                // [cleaned]');
            }
        }

        // Call on init
        // вљЎ Update player name immediately (no delay needed)
        updatePlayerNameDisplay();

        // Help Modal Event Listeners
        if (helpBtn && helpModal) {
            helpBtn.addEventListener('click', () => {
                helpModal.classList.add('show');
            });
        }

        if (closeHelp && helpModal) {
            closeHelp.addEventListener('click', () => {
                helpModal.classList.remove('show');
            });
        }

        // Close help on background click
        if (helpModal) {
            helpModal.addEventListener('click', (e) => {
                if (e.target.id === 'help-modal') {
                    helpModal.classList.remove('show');
                }
            });
        }

        // Help Tab Switching
        helpTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');

                // Remove active class from all tabs and contents
                helpTabs.forEach(t => t.classList.remove('active'));
                helpTabContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Show corresponding content
                const targetContent = document.getElementById(targetTab + '-content');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });

        // Referral Modal Elements and Event Listeners
        const referralBtn = document.getElementById('referral-btn');
        const referralModal = document.getElementById('referral-modal');
        const closeReferral = document.getElementById('close-referral');
        const referralLinkDisplay = document.getElementById('referral-link-display');
        const copyReferralLinkBtn = document.getElementById('copy-referral-link-btn');
        const shareReferralBtn = document.getElementById('share-referral-btn');

        // Generate referral code (SAME algorithm as bot.py!)
        async function generateReferralCode() {
            // [cleaned] called');

            // вњ… Try multiple sources for Telegram ID
            const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

            // [cleaned]

            let telegramId = null;

            if (telegramUser && telegramUser.id) {
                telegramId = String(telegramUser.id);
                // [cleaned]
            } else if (window.TELEGRAM_USER_ID) {
                // Fallback to global TELEGRAM_USER_ID from auth.js
                telegramId = String(window.TELEGRAM_USER_ID);
                // [cleaned]
            } else {
                console.error('вќЊ NO TELEGRAM ID FOUND! Both sources are null/undefined');
            }

            if (telegramId) {
                // [cleaned]

                // Use SHA256 for better distribution (same as bot.py)
                const encoder = new TextEncoder();
                const data = encoder.encode(telegramId);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = new Uint8Array(hashBuffer);

                // Take first 3 bytes and convert to base36 (same as bot.py)
                const hashVal = (hashArray[0] << 16) | (hashArray[1] << 8) | hashArray[2];
                const codeNum = hashVal % (36 ** 6);
                const base36Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                let codePart = '';
                let num = codeNum;
                for (let i = 0; i < 6; i++) {
                    codePart = base36Chars[num % 36] + codePart;
                    num = Math.floor(num / 36);
                }

                const code = 'TAMA' + codePart;
                // [cleaned]
                return code;
            }

            console.warn('вљ пёЏ No Telegram ID found, returning default code');
            return 'TAMA000000';
        }

        // Generate referral link (SAME algorithm as bot.py!)
        async function generateReferralLink() {
            // Check if using wallet (for non-Telegram users)
            if (window.WALLET_ADDRESS && !window.Telegram?.WebApp?.initDataUnsafe?.user) {
                return window.ReferralSystem?.getReferralLink(window.WALLET_ADDRESS) || '';
            }

            // Telegram referral link
            const code = await generateReferralCode();
            return `https://solanatamagotchi.com/s.html?ref=${code}`;
        }

        // Update referral progress bar
        async function updateReferralProgress() {
            try {
                const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
                if (!telegramUser?.id) return;

                // Get user's referral count (BOTH confirmed and pending!)
                const [referralsResponse, pendingResponse] = await Promise.all([
                    fetch(`${SUPABASE_URL}/rest/v1/referrals?referrer_telegram_id=eq.${telegramUser.id}&select=count`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                    }),
                    fetch(`${SUPABASE_URL}/rest/v1/pending_referrals?referrer_telegram_id=eq.${telegramUser.id}&status=eq.pending&select=count`, {
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        }
                    })
                ]);

                const referrals = await referralsResponse.json();
                const pending = await pendingResponse.json();

                // Total count = confirmed + pending
                const referralCount = (referrals.length || 0) + (pending.length || 0);

                // [cleaned]

                // РћРїСЂРµРґРµР»РёС‚СЊ С‚РµРєСѓС‰РёР№ milestone
                const milestones = [5, 10, 25, 50, 100];
                let currentMilestone = 5;
                let progress = 0;

                for (let i = 0; i < milestones.length; i++) {
                    if (referralCount >= milestones[i]) {
                        currentMilestone = milestones[i + 1] || 100;
                        progress = 100;
                    } else {
                        currentMilestone = milestones[i];
                        progress = (referralCount / milestones[i]) * 100;
                        break;
                    }
                }

                // РћР±РЅРѕРІРёС‚СЊ РїСЂРѕРіСЂРµСЃСЃ-Р±Р°СЂ
                const progressFill = document.getElementById('referral-progress-fill');
                const statusText = document.getElementById('referral-status');

                if (progressFill) {
                    progressFill.style.width = `${Math.min(progress, 100)}%`;
                }

                if (statusText) {
                    if (referralCount >= 100) {
                        statusText.textContent = `рџЋ‰ Maximum level reached! (${referralCount} referrals)`;
                    } else {
                        const nextMilestone = milestones.find(m => m > referralCount) || 100;
                        statusText.textContent = `${referralCount}/${nextMilestone} referrals until next bonus!`;
                    }
                }

                // Update milestone status
                const milestoneElements = document.querySelectorAll('.milestone');
                milestoneElements.forEach((element, index) => {
                    element.classList.remove('completed', 'current', 'upcoming');

                    if (referralCount >= milestones[index]) {
                        element.classList.add('completed');
                    } else if (referralCount < milestones[index] && (index === 0 || referralCount >= milestones[index - 1])) {
                        element.classList.add('current');
                    } else {
                        element.classList.add('upcoming');
                    }
                });

            } catch (error) {
                // [cleaned]
            }
        }

        // Open referral modal
        if (referralBtn && referralModal) {
            referralBtn.addEventListener('click', async () => {
                // [cleaned]
                const code = await generateReferralCode();
                const link = await generateReferralLink();

                // [cleaned]

                // Display code
                const codeDisplay = document.getElementById('referral-code-display');
                if (codeDisplay) {
                    if (window.WALLET_ADDRESS && !window.Telegram?.WebApp?.initDataUnsafe?.user) {
                        // For wallet users, show shortened address
                        codeDisplay.textContent = window.WALLET_ADDRESS.substring(0, 12) + '...';
                        // [cleaned] + '...');
                    } else {
                        codeDisplay.textContent = code;
                        // [cleaned]
                    }
                }

                // Display link
                if (referralLinkDisplay) {
                    referralLinkDisplay.value = link;
                }

                // Update referral progress bar
                await updateReferralProgress();

                referralModal.classList.add('show');
            });
        }

        // Close referral modal
        if (closeReferral && referralModal) {
            closeReferral.addEventListener('click', () => {
                referralModal.classList.remove('show');
            });
        }

        // Close referral on background click
        if (referralModal) {
            referralModal.addEventListener('click', (e) => {
                if (e.target.id === 'referral-modal') {
                    referralModal.classList.remove('show');
                }
            });
        }

        // Copy referral link (updated for wallet support)
        if (copyReferralLinkBtn && referralLinkDisplay) {
            copyReferralLinkBtn.addEventListener('click', async () => {
                // Use ReferralSystem if available (for wallet users)
                if (window.ReferralSystem && window.WALLET_ADDRESS && !window.Telegram?.WebApp?.initDataUnsafe?.user) {
                    window.ReferralSystem.copyReferralLink(window.WALLET_ADDRESS);
                } else {
                    // Fallback for Telegram users
                    try {
                        await navigator.clipboard.writeText(referralLinkDisplay.value);
                        copyReferralLinkBtn.textContent = 'вњ… Copied!';
                    setTimeout(() => {
                            copyReferralLinkBtn.textContent = 'рџ“‹ Copy Link';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy: ', err);
                        referralLinkDisplay.select();
                    document.execCommand('copy');
                        copyReferralLinkBtn.textContent = 'вњ… Copied!';
                    setTimeout(() => {
                            copyReferralLinkBtn.textContent = 'рџ“‹ Copy Link';
                    }, 2000);
                    }
                }
            });
        }

        // Share referral link (updated for wallet support)
        if (shareReferralBtn) {
            shareReferralBtn.addEventListener('click', async () => {
                // Use ReferralSystem if available (for wallet users with Web Share API)
                if (window.ReferralSystem && window.WALLET_ADDRESS && !window.Telegram?.WebApp?.initDataUnsafe?.user) {
                    window.ReferralSystem.shareReferralLink(window.WALLET_ADDRESS);
                    return;
                }

                const link = referralLinkDisplay?.value || '';

                // Share text with link for Telegram preview (text BEFORE link for better preview!)
                const shareText = `рџЋ® Join Solana Tamagotchi - Get 1,000 TAMA Bonus!

рџђѕ Play-to-earn game on Solana blockchain
рџ’° No wallet needed to start earning!

рџЋЃ Get 1,000 TAMA instantly when you join!
рџљЂ Start playing and earning now!

${link}`;

                // Use link as-is (no version parameter to match bot format)
                // Use text parameter with link included for better preview
                const encodedText = encodeURIComponent(shareText);
                const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodedText}`;

                // рџЋЃ INSTANT REWARD FOR SHARING!
                if (typeof gameState !== 'undefined') {
                    gameState.tama = (gameState.tama || 0) + 100;
                    // Update display if updateUI exists
                    if (typeof updateUI === 'function') {
                        updateUI();
                    } else if (typeof tamaDisplay !== 'undefined' && tamaDisplay) {
                        tamaDisplay.textContent = typeof formatNumber === 'function'
                            ? formatNumber(gameState.tama)
                            : gameState.tama.toLocaleString();
                    }
                    // Auto-save if function exists
                    if (typeof triggerAutoSave === 'function') {
                        triggerAutoSave();
                    }
                }
                if (typeof showNotification === 'function') {
                showNotification("рџЋ‰ +100 TAMA for sharing!");
                }

                // Send event to database
                const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
                try {
                    await fetch(`${SUPABASE_URL}/rest/v1/sharing_events`, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify({
                            telegram_id: telegramUser?.id,
                            platform: 'telegram',
                            timestamp: new Date().toISOString(),
                            reward_given: 100
                        })
                    });
                } catch (error) {
                    // [cleaned]
                }

                // Open Telegram share URL (works in Telegram WebApp)
                try {
                    window.open(telegramShareUrl, '_blank');
                        shareReferralBtn.textContent = 'вњ… Shared!';
                        setTimeout(() => {
                            shareReferralBtn.textContent = 'рџ“¤ Share Link';
                        }, 2000);
                    } catch (err) {
                    console.error('Failed to open share:', err);
                    // Fallback: copy to clipboard (text with link included)
                    try {
                        await navigator.clipboard.writeText(shareText);
                        shareReferralBtn.textContent = 'вњ… Copied!';
                        setTimeout(() => {
                            shareReferralBtn.textContent = 'рџ“¤ Share Link';
                        }, 2000);
                    } catch (clipErr) {
                        console.error('Failed to copy:', clipErr);
                    }
                }
            });
        }

        // Supabase Configuration - using centralized config
        const SUPABASE_URL = window.CONFIG?.SUPABASE_URL || 'https://zfrazyupameidxpjihrh.supabase.co';
        const SUPABASE_ANON_KEY = window.CONFIG?.SUPABASE_KEY || '';

        // API Configuration - using centralized config
        const TAMA_API_BASE = window.CONFIG?.API_BASE || 'https://api.solanatamagotchi.com/api/tama';

        // Treasury addresses for SOL distribution
        const TREASURY_MAIN = '6rY5inYo8JmDTj91UwMKLr1MyxyAAQGjLpJhSi6dNpFM';
        const TREASURY_LIQUIDITY = 'CeeKjLEVfY15fmiVnPrGzjneN5i3UsrRW4r4XHdavGk1';
        const TREASURY_TEAM = 'Amy5EJqZWp713SaT3nieXSSZjxptVXJA1LhtpTE7Ua8';

        // SOL/USD rate (can be fetched from API later)
        const SOL_USD_RATE = 164; // Approximate

        // Fetch user's rank even if not in top 50
        /**
         * Fetch user rank from UNIFIED leaderboard
         * Supports Telegram ID, Wallet Address, or User ID
         */
        async function fetchUserRankUnified(telegramId, walletAddress, userId) {
            try {
                let url = 'https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=rank';

                if (telegramId) {
                    url += `&telegram_id=${telegramId}`;
                } else if (walletAddress) {
                    url += `&wallet_address=${walletAddress}`;
                } else if (userId) {
                    url += `&user_id=${userId}`;
                } else {
                    console.warn('вљ пёЏ No user identifier provided');
                    return null;
                }

                // [cleaned]

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Failed to fetch rank: ${response.status}`);
                }

                const result = await response.json();
                // [cleaned]

                if (result.success && result.found && result.data) {
                    return result.data.rank;
                } else {
                    console.warn('вљ пёЏ User not found in unified leaderboard');
                    return null;
                }
            } catch (error) {
                console.error('вќЊ Error fetching unified rank:', error);
                return null;
            }
        }

        /**
         * Legacy function - fetch rank from Telegram-only leaderboard
         * Kept for backwards compatibility
         */
        async function fetchUserRank(telegramId) {
            try {
                // вљ пёЏ CRITICAL: Ensure telegramId is always a string
                const telegramIdStr = String(telegramId);
                // [cleaned]

                // Get user's TAMA balance first
                const userResponse = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${telegramIdStr}&select=tama`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                if (!userResponse.ok) {
                    throw new Error(`Failed to fetch user data: ${userResponse.status}`);
                }

                const userData = await userResponse.json();
                if (!userData || userData.length === 0) {
                    console.warn('вљ пёЏ User not found in database');
                    return null;
                }

                const userTama = userData[0].tama || 0;
                // [cleaned]

                // Count users with more TAMA (this is the rank)
                const rankResponse = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?select=count&tama=gt.${userTama}`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                if (!rankResponse.ok) {
                    // Fallback: get all users and count manually
                    // [cleaned]
                    const allUsersResponse = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?select=telegram_id,tama&order=tama.desc&limit=1000`, {
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        }
                    });

                    if (allUsersResponse.ok) {
                        const allUsers = await allUsersResponse.json();
                        const userIndex = allUsers.findIndex(p => String(p.telegram_id) === telegramIdStr);
                        if (userIndex !== -1) {
                            const rank = userIndex + 1;
                            // [cleaned]:', rank);
                            return rank;
                        }
                    }
                    return null;
                }

                // Parse count from response
                const countData = await rankResponse.json();
                const rank = (countData?.length || 0) + 1; // +1 because rank is 1-based
                // [cleaned]
                return rank;
            } catch (error) {
                console.error('вќЊ Error fetching user rank:', error);
                return null;
            }
        }

        // Load leaderboard from Supabase
        async function loadLeaderboard() {
            try {
                leaderboardList.innerHTML = '<div class="loading">вЏі Loading leaderboard...</div>';

                // Get current user's ID (Telegram or Wallet)
                let currentUserId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID || null;
                let currentTelegramId = window.TELEGRAM_USER_ID || null;
                let currentWalletAddress = window.WALLET_ADDRESS || null;

                // Fallback to trying initDataUnsafe again (only for Telegram)
                if (!currentTelegramId && window.Telegram && window.Telegram.WebApp) {
                    const user = window.Telegram.WebApp.initDataUnsafe?.user;
                    if (user && user.id) {
                        currentTelegramId = user.id.toString();
                        currentUserId = currentTelegramId;
                    }
                }

                // [cleaned]
                // [cleaned]

                // Fetch from Unified Leaderboard API
                const response = await fetch(`https://api.solanatamagotchi.com/api/unified-leaderboard.php?action=leaderboard&limit=100`);

                // [cleaned]

                if (!response.ok) {
                    throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                // [cleaned]

                if (!result.success || !result.data) {
                    throw new Error('Invalid leaderboard response');
                }

                const data = result.data;

                // Format leaderboard data
                const leaderboardData = data.map((player) => {
                    // Display name logic: username > wallet (shortened) > "Player"
                    let displayName = 'Player';

                    if (player.username && player.username !== 'Player') {
                        displayName = player.username;
                    } else if (player.wallet_address) {
                        // Shorten wallet address: D8iL...aUFy
                        displayName = player.wallet_address.substring(0, 4) + '...' + player.wallet_address.substring(player.wallet_address.length - 4);
                    }

                    // Add account type badge
                    let badge = '';
                    if (player.account_type === 'telegram') {
                        badge = 'рџ“±';
                    } else if (player.account_type === 'wallet') {
                        badge = 'рџ’»';
                    } else if (player.account_type === 'linked') {
                        badge = 'рџ”—';
                    }

                    return {
                        rank: player.rank,
                        name: displayName,
                        level: player.level || 1,
                        tama: player.tama_balance || 0,
                        telegram_id: player.telegram_id,
                        wallet_address: player.wallet_address,
                        user_id: player.user_id,
                        account_type: player.account_type,
                        badge: badge
                    };
                });

                // Update current user's rank in header
                if (currentUserId && rankDisplay) {
                    // [cleaned]

                    // Try to find user in leaderboard data
                    const currentUserData = leaderboardData.find(p => {
                        const matches = (
                            (currentTelegramId && p.telegram_id && String(p.telegram_id) === String(currentTelegramId)) ||
                            (currentWalletAddress && p.wallet_address && String(p.wallet_address) === String(currentWalletAddress)) ||
                            (currentUserId && p.user_id && String(p.user_id) === String(currentUserId))
                        );

                        if (matches) {
                            // [cleaned] === String(currentTelegramId)) ? 'telegram_id' :
                                          (currentWalletAddress && p.wallet_address && String(p.wallet_address) === String(currentWalletAddress)) ? 'wallet_address' : 'user_id'
                            });
                        }

                        return matches;
                    });

                    if (currentUserData) {
                        // [cleaned]
                        rankDisplay.textContent = `#${currentUserData.rank}`;
                        // [cleaned]
                    } else {
                        // User not in top 100, fetch their rank separately from unified API
                        // [cleaned]
                        fetchUserRankUnified(currentTelegramId, currentWalletAddress, currentUserId).then(rank => {
                            if (rank && rankDisplay) {
                                rankDisplay.textContent = `#${rank}`;
                                // [cleaned]
                            } else if (rankDisplay) {
                                rankDisplay.textContent = '#---';
                            }
                        }).catch(err => {
                            console.warn('вљ пёЏ Failed to fetch user rank:', err);
                            if (rankDisplay) {
                                rankDisplay.textContent = '#---';
                            }
                        });
                    }
                } else {
                    if (rankDisplay) {
                        rankDisplay.textContent = '#---';
                    }
                    if (!currentUserId) {
                        console.warn('вљ пёЏ No user ID available for rank display');
                    }
                }

                // Render leaderboard
                renderLeaderboard(leaderboardData, currentUserId);

            } catch (error) {
                console.error('Error loading unified leaderboard:', error);
                // [cleaned]

                // Fallback to old Telegram-only leaderboard
                try {
                    const fallbackResponse = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=tama.desc&limit=50`, {
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        }
                    });

                    if (fallbackResponse.ok) {
                        const data = await fallbackResponse.json();
                        const leaderboardData = data.map((player, index) => {
                            let displayName = 'Player';
                            if (player.telegram_username) {
                                displayName = player.telegram_username.replace('@', '');
                            }

                            return {
                                rank: index + 1,
                                name: displayName,
                                level: player.level || 1,
                                tama: player.tama || 0,
                                telegram_id: player.telegram_id,
                                badge: 'рџ“±' // Telegram badge
                            };
                        });

                        // [cleaned]');
                        renderLeaderboard(leaderboardData, currentUserId);

                        // Update rank if needed
                        if (currentUserId && rankDisplay) {
                            const userInList = leaderboardData.find(p => String(p.telegram_id) === String(currentTelegramId));
                            if (userInList) {
                                rankDisplay.textContent = `#${userInList.rank}`;
                            } else {
                                rankDisplay.textContent = '#---';
                            }
                        }
                        return;
                    }
                } catch (fallbackError) {
                    console.error('вќЊ Fallback also failed:', fallbackError);
                }

                // Last resort: show error message
                leaderboardList.innerHTML = `<div class="loading">вќЊ Error loading leaderboard<br><small>${error.message}</small><br><br>Please run SQL: sql/create-unified-leaderboard.sql in Supabase</div>`;
            }
        }

        function renderLeaderboard(data, currentUserId) {
            if (!data || data.length === 0) {
                leaderboardList.innerHTML = '<div class="loading">No players yet</div>';
                return;
            }

            let html = '';

            data.forEach((player) => {
                // Check if current user matches by any identifier
                const isCurrentUser =
                    player.telegram_id === currentUserId ||
                    player.wallet_address === window.WALLET_ADDRESS ||
                    player.user_id === currentUserId;

                const rankClass = player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : player.rank === 3 ? 'bronze' : '';
                const rankEmoji = player.rank === 1 ? 'рџҐ‡' : player.rank === 2 ? 'рџҐ€' : player.rank === 3 ? 'рџҐ‰' : `${player.rank}.`;

                // Add badge if exists
                const badge = player.badge ? ` ${player.badge}` : '';

                html += `
                    <div class="leaderboard-item ${isCurrentUser ? 'me' : ''}">
                        <div class="leaderboard-rank ${rankClass}">${rankEmoji}</div>
                        <div class="leaderboard-player">
                            <div class="leaderboard-name">${player.name}${badge}${isCurrentUser ? ' (You)' : ''}</div>
                            <div class="leaderboard-level">Level ${player.level}</div>
                        </div>
                        <div class="leaderboard-tama">${formatNumber(player.tama)} рџ’°</div>
                    </div>
                `;
            });

            leaderboardList.innerHTML = html;
        }

        // Load Economy Config from API
        async function loadEconomyConfig() {
            try {
                const response = await fetch(`${TAMA_API_BASE}/economy/active`);

                if (response.ok) {
                    const result = await response.json();

                    if (result.success && result.data && result.data.length > 0) {
                        const dbConfig = result.data[0];

                        // Convert database format to game format
                        const gameConfig = {
                            BASE_CLICK_REWARD: dbConfig.base_click_reward,
                            MIN_REWARD: dbConfig.min_reward,
                            MAX_COMBO_BONUS: dbConfig.max_combo_bonus,
                            COMBO_WINDOW: dbConfig.combo_window,
                            COMBO_COOLDOWN: dbConfig.combo_cooldown,
                            COMBO_BONUS_DIVIDER: dbConfig.combo_bonus_divider,
                            SPAM_PENALTY: dbConfig.spam_penalty,
                            HP_PER_CLICK: dbConfig.hp_per_click,
                            FOOD_PER_CLICK: dbConfig.food_per_click,
                            HAPPY_PER_CLICK: dbConfig.happy_per_click
                        };

                        // Save to localStorage
                        localStorage.setItem('economyConfig', JSON.stringify(gameConfig));
                        // [cleaned]

                        return gameConfig;
                    } else {
                        // [cleaned]
                        return null;
                    }
                } else {
                    console.warn('вљ пёЏ Failed to load economy config from API, using defaults');
                    return null;
                }
            } catch (error) {
                console.warn('вљ пёЏ Error loading economy config:', error.message);
                return null;
            }
        }

        // Initialize everything when DOM is ready
        // Listen for economy config updates from admin panel
        try {
            const economyChannel = new BroadcastChannel('economy-updates');
            economyChannel.onmessage = (event) => {
                if (event.data.type === 'config-update') {
                    localStorage.setItem('economyConfig', JSON.stringify(event.data.config));
                    // [cleaned]
                    showMessage('вљ™пёЏ Economy settings updated!');
                }
            };
        } catch (e) {
            // [cleaned]
        }

        // вљЎ Load economy config in parallel (non-blocking)
        // Don't await - let it load in background
        loadEconomyConfig().catch(err => {
            console.warn('Economy config load failed:', err);
        });

        // рџЋЁ Load NFT boost for user
        async function loadUserNFTBoost() {
            const userId = window.TELEGRAM_USER_ID || window.WALLET_USER_ID;
            if (!userId) {
                console.warn('вљ пёЏ No user ID (Telegram or Wallet), cannot load NFT boost.');
                window.userNFTBoost = 0;
                return;
            }
            try {
                // Fetch NFTs directly from Supabase (include nft_mint_address for on-chain check)
                const response = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts?telegram_id=eq.${userId}&select=earning_multiplier,is_active,nft_mint_address`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch NFTs');

                const data = await response.json();

                if (data && data.length > 0) {
                    // вњ… Р’РђР РРђРќРў 1: РЎРЈРњРњРђ Р’РЎР•РҐ РђРљРўРР’РќР«РҐ Р‘РЈРЎРўРћР’
                    // Sum all multipliers from active NFTs (not just max)
                    let totalMultiplier = 0;
                    let activeCount = 0;

                    data.forEach(nft => {
                        // Check if on-chain NFT
                        const isOnChain = nft.nft_mint_address && nft.nft_mint_address.length > 30 && !nft.nft_mint_address.includes('_');
                        // On-chain NFTs are ALWAYS active, off-chain NFTs use is_active flag
                        const isActive = isOnChain ? true : (nft.is_active !== false);

                        if (isActive) {
                            const multiplier = parseFloat(nft.earning_multiplier) || 0;
                            totalMultiplier += multiplier;
                            activeCount++;
                        }
                    });

                    // Apply CAP: РјР°РєСЃРёРјСѓРј 10x (Р±Р°Р»Р°РЅСЃРёСЂРѕРІРєР° - Р±С‹Р»Рѕ 100x)
                    const MAX_BOOST_CAP = 10.0;
                    const cappedMultiplier = Math.min(totalMultiplier, MAX_BOOST_CAP);

                    // Convert multiplier to boost percentage (e.g., 20.0x = 1900% boost = 19.0)
                    // Formula: earnedTama *= (1 + userNFTBoost), so 20x multiplier = 19.0 boost
                    window.userNFTBoost = cappedMultiplier > 0 ? (cappedMultiplier - 1.0) : 0;

                    const boostPercentage = (window.userNFTBoost * 100).toFixed(0);
                    const isCapped = totalMultiplier > MAX_BOOST_CAP;

                    // [cleaned] + 'x',
                        cappedMultiplier: cappedMultiplier.toFixed(1) + 'x',
                        boostPercentage: `+${boostPercentage}%`,
                        isCapped: isCapped
                    });

                    if (window.userNFTBoost > 0) {
                        const message = isCapped
                            ? `рџ–јпёЏ NFT Boost Active: ${cappedMultiplier.toFixed(1)}x (${activeCount} NFTs, CAP 100x reached!)`
                            : `рџ–јпёЏ NFT Boost Active: ${cappedMultiplier.toFixed(1)}x from ${activeCount} NFT${activeCount !== 1 ? 's' : ''}!`;
                        showMessage(message);
                    }
                } else {
                    window.userNFTBoost = 0;
                    // [cleaned]
                }
            } catch (e) {
                console.error('вќЊ Error loading user NFT boost:', e);
                window.userNFTBoost = 0;
            }
        }

        // [cleaned]

        document.addEventListener('DOMContentLoaded', async function() {
            try {
                // [cleaned]
                // [cleaned]
                // [cleaned]

                // Initialize wallet connection button
                const connectBtn = document.getElementById('connect-wallet-btn-modal');
                if (connectBtn) {
                    connectBtn.addEventListener('click', async () => {
                        if (window.WalletAuth && typeof window.WalletAuth.connect === 'function') {
                            const result = await window.WalletAuth.connect();
                            if (result.success) {
                                // Update modal UI to show connected state
                                updateWalletModalUI(result.walletAddress);
                                // Don't close modal immediately - let user see connected state
                            } else {
                                // Error already shown by wallet-auth-cn.js
                                console.error('вќЊ Wallet connection failed:', result.error);
                            }
                        } else {
                            alert('Wallet authentication not available. Please install Phantom or Solflare wallet.');
                        }
                    });
                }

                // Initialize wallet disconnect button
                const disconnectBtn = document.getElementById('disconnect-wallet-btn-modal');
                if (disconnectBtn) {
                    disconnectBtn.addEventListener('click', async () => {
                        if (window.WalletAuth && typeof window.WalletAuth.disconnect === 'function') {
                            const result = await window.WalletAuth.disconnect();
                            if (result.success) {
                                // [cleaned]
                                // Update modal UI to show not connected state
                                updateWalletModalUI(null);
                                // Close modal and reload to reset game state
                                const modal = document.getElementById('wallet-connect-modal');
                                if (modal) {
                                    modal.style.display = 'none';
                                }
                                location.reload();
                            } else {
                                console.error('вќЊ Wallet disconnection failed:', result.error);
                            }
                        }
                    });
                }

                // Close wallet modal button
                const closeWalletModalBtn = document.getElementById('close-wallet-modal');
                if (closeWalletModalBtn) {
                    closeWalletModalBtn.addEventListener('click', () => {
                        const modal = document.getElementById('wallet-connect-modal');
                        if (modal) {
                            modal.style.display = 'none';
                            // If wallet is connected, reload to initialize game
                            if (window.WALLET_ADDRESS) {
                                location.reload();
                            }
                        }
                    });
                }

                // Update wallet modal UI based on connection state
                function updateWalletModalUI(walletAddress) {
                    const connectedInfo = document.getElementById('wallet-connected-info');
                    const notConnectedInfo = document.getElementById('wallet-not-connected-info');
                    const walletAddressEl = document.getElementById('wallet-modal-address');

                    if (walletAddress) {
                        // Show connected state
                        if (connectedInfo) connectedInfo.style.display = 'block';
                        if (notConnectedInfo) notConnectedInfo.style.display = 'none';
                        if (walletAddressEl) {
                            walletAddressEl.textContent = walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 6);
                            }
                        } else {
                        // Show not connected state
                        if (connectedInfo) connectedInfo.style.display = 'none';
                        if (notConnectedInfo) notConnectedInfo.style.display = 'block';
                    }
                }

                // Check wallet status on modal open and update UI
                const walletModal = document.getElementById('wallet-connect-modal');
                if (walletModal) {
                    // Update UI when modal is shown
                    const observer = new MutationObserver(() => {
                        if (walletModal.style.display !== 'none') {
                            const walletAddress = window.WALLET_ADDRESS || (window.WalletAuth && window.WalletAuth.getState && window.WalletAuth.getState().walletAddress);
                            updateWalletModalUI(walletAddress);
                        }
                    });
                    observer.observe(walletModal, { attributes: true, attributeFilter: ['style'] });
                }

                // Check if critical elements exist
                const gameContainer = document.querySelector('.game-container');
                if (!gameContainer) {
                    throw new Error('Game container not found!');
                }
                // [cleaned]

            // рџ”§ РРќРР¦РРђР›РР—РђР¦РРЇ DOM Р­Р›Р•РњР•РќРўРћР’
                petSprite = document.getElementById('pet-sprite');
                petArea = document.getElementById('pet-area');
                levelDisplay = document.getElementById('level-display');
                tamaDisplay = document.getElementById('tama-display');
                rankDisplay = document.getElementById('rank-display');
                messageDiv = document.getElementById('message');
                feedBtn = document.getElementById('feed-btn');
                playBtn = document.getElementById('play-btn');
                healBtn = document.getElementById('heal-btn');

                // [cleaned]

                // Re-initialize event listeners if elements are now available
                if (petArea) {
                    // Remove old listener if exists
                    petArea.replaceWith(petArea.cloneNode(true));
                    petArea = document.getElementById('pet-area');
                    if (petArea) {
                        petArea.addEventListener('click', (e) => {
                            if (e.target.closest('.pet-emoji') || e.target.closest('#pet-sprite') || e.target.closest('#vector-pet')) {
                                e.preventDefault();
                                e.stopPropagation();
                                clickPet(e);
                            }
                        });
                        // [cleaned]
                    }
                }

                if (feedBtn) {
                    feedBtn.replaceWith(feedBtn.cloneNode(true));
                    feedBtn = document.getElementById('feed-btn');
                    if (feedBtn) {
                        feedBtn.addEventListener('click', () => {
                            const cost = getProgressivePrice(50);
                            if (gameState.tama >= cost) {
                                const balanceBefore = gameState.tama;
                                gameState.tama -= cost;
                                const balanceAfter = gameState.tama;
                                gameState.food = Math.min(gameState.maxFood, gameState.food + 30);
                                gameState.xp += 10;
                                showMessage('рџЌ” Yummy! Food +30');
                                checkLevelUp();
                                updateUI();

                                if (window.TELEGRAM_USER_ID) {
                                    logTransaction('spend_feed', cost, balanceBefore, balanceAfter, {
                                        food_gained: 30,
                                        xp_gained: 10
                                    });
                                }

                                triggerAutoSave();
                            } else {
                                showMessage('вќЊ Not enough TAMA!');
                            }
                        });
                    }
                }

                if (playBtn) {
                    playBtn.replaceWith(playBtn.cloneNode(true));
                    playBtn = document.getElementById('play-btn');
                    if (playBtn) {
                        playBtn.addEventListener('click', () => {
                            const cost = getProgressivePrice(30);
                            if (gameState.tama >= cost) {
                                const balanceBefore = gameState.tama;
                                gameState.tama -= cost;
                                const balanceAfter = gameState.tama;
                                gameState.happy = Math.min(gameState.maxHappy, gameState.happy + 40);
                                gameState.food = Math.max(0, gameState.food - 10);
                                gameState.xp += 15;
                                showMessage('рџЋ® So fun! Happy +40, Food -10');
                                checkLevelUp();
                                updateUI();

                                if (window.TELEGRAM_USER_ID) {
                                    logTransaction('spend_play', cost, balanceBefore, balanceAfter, {
                                        happy_gained: 40,
                                        food_lost: 10,
                                        xp_gained: 15
                                    });
                                }

                                triggerAutoSave();
                            } else {
                                showMessage('вќЊ Not enough TAMA!');
                            }
                        });
                    }
                }

                if (healBtn) {
                    healBtn.replaceWith(healBtn.cloneNode(true));
                    healBtn = document.getElementById('heal-btn');
                    if (healBtn) {
                        healBtn.addEventListener('click', () => {
                            const cost = getProgressivePrice(100);
                            if (gameState.tama >= cost) {
                                const balanceBefore = gameState.tama;
                                gameState.tama -= cost;
                                const balanceAfter = gameState.tama;
                                gameState.hp = Math.min(gameState.maxHp, gameState.hp + 50);
                                gameState.xp += 20;
                                clickEfficiency = 1.0;
                                showMessage('рџ’Љ Feeling better! HP +50');
                                checkLevelUp();
                                updateUI();

                                if (window.TELEGRAM_USER_ID) {
                                    logTransaction('spend_heal', cost, balanceBefore, balanceAfter, {
                                        hp_gained: 50,
                                        xp_gained: 20,
                                        efficiency_restored: true
                                    });
                                }

                                triggerAutoSave();
                            } else {
                                showMessage('вќЊ Not enough TAMA!');
                            }
                        });
                    }
                }

            // вљЎ Load NFT boost immediately (no delay needed)
            try {
                if (typeof loadUserNFTBoost === 'function') {
                    loadUserNFTBoost();
                }
            } catch (e) {
                console.warn('NFT boost load failed:', e);
            }

            // Wait for Telegram WebApp to initialize
            if (window.Telegram && window.Telegram.WebApp) {
                    try {
                window.Telegram.WebApp.ready();
                window.Telegram.WebApp.expand();
                        // [cleaned]

                // Give Telegram WebApp time to initialize
                await new Promise(resolve => setTimeout(resolve, 100));
                    } catch (e) {
                        console.error('Telegram WebApp init error:', e);
                    }
                } else {
                    console.warn('вљ пёЏ Telegram WebApp not available (browser mode)');
            }

            // Re-check elements after DOM is fully loaded
            const minigamesBtn = document.getElementById('minigames-btn');
            const minigamesModal = document.getElementById('minigames-modal');
            const leaderboardBtn = document.getElementById('leaderboard-btn');
            const leaderboardModal = document.getElementById('leaderboard-modal');

            // [cleaned]

            // Check for referral code first
                try {
            await checkReferralCode();
                } catch (e) {
                    console.warn('Referral check failed:', e);
                }

            // Initialize game
                // [cleaned]
            await initGame();
                // [cleaned]

            // Initialize theme system
                if (typeof initThemeSystem === 'function') {
            initThemeSystem();
                    // [cleaned]
                }

            // Initialize pet selector system
                if (typeof initPetSelector === 'function') {
            initPetSelector();
                    // [cleaned]
                }

            // Initialize NFT modal
                if (typeof initNFTModal === 'function') {
            initNFTModal();
                    // [cleaned]
                }

            // Initialize Withdraw modal
                if (typeof initWithdrawModal === 'function') {
                    initWithdrawModal();
                    // [cleaned]
                }

                // [cleaned]

            } catch (error) {
                console.error('вќЊ CRITICAL ERROR during initialization:', error);
                console.error('Error stack:', error.stack);

                // Show error message to user
                document.body.innerHTML = `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        padding: 20px;
                        text-align: center;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-family: 'Courier New', monospace;
                    ">
                        <h1 style="font-size: 48px; margin-bottom: 20px;">вљ пёЏ</h1>
                        <h2 style="margin-bottom: 20px;">Game Loading Error</h2>
                        <p style="max-width: 500px; margin-bottom: 20px; opacity: 0.9;">
                            Something went wrong while loading the game.
                            Please try refreshing the page or contact support.
                        </p>
                        <button onclick="location.reload()" style="
                            padding: 15px 30px;
                            font-size: 18px;
                            border: none;
                            border-radius: 10px;
                            background: white;
                            color: #667eea;
                            font-weight: bold;
                            cursor: pointer;
                            margin-bottom: 20px;
                        ">
                            рџ”„ Reload Page
                        </button>
                        <details style="max-width: 600px; text-align: left; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin-top: 20px;">
                            <summary style="cursor: pointer; font-weight: bold;">Technical Details</summary>
                            <pre style="overflow: auto; margin-top: 10px; font-size: 12px;">${error.message}\n\n${error.stack || 'No stack trace available'}</pre>
                        </details>
                    </div>
                `;
            }
        });

        // Theme System рџЋЁ
        function initThemeSystem() {
            // Load saved theme
            const savedTheme = localStorage.getItem('tamagotchi-theme') || 'kawai';
            switchTheme(savedTheme);

            // Add click listeners to theme buttons
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const theme = btn.dataset.theme;
                    switchTheme(theme);
                    localStorage.setItem('tamagotchi-theme', theme);
                });
            });
        }

        function switchTheme(theme) {
            // Update body data attribute
            document.body.setAttribute('data-theme', theme);

            // Update active button
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-theme="${theme}"]`).classList.add('active');

            // [cleaned]
        }

        // Pet Selector System рџђѕ
        function initPetSelector() {
            // Load saved pet
            const savedPet = localStorage.getItem('tamagotchi-pet') || 'kawai';

            // CRITICAL: Set data-pet immediately, even before switchPet
            // This ensures pet is visible from the start
            if (!document.body.getAttribute('data-pet')) {
                document.body.setAttribute('data-pet', savedPet);
                // [cleaned]
            }

            switchPet(savedPet);

            // Add click listeners to pet buttons (both old and new)
            document.querySelectorAll('.pet-btn, .pet-btn-top').forEach(btn => {
                btn.addEventListener('click', () => {
                    const pet = btn.dataset.pet;
                    switchPet(pet);
                    localStorage.setItem('tamagotchi-pet', pet);
                });
            });
        }

        function switchPet(pet) {
            // Update body data attribute
            document.body.setAttribute('data-pet', pet);

            // Auto-switch theme based on pet
            const petThemeMap = {
                'kawai': 'kawai',
                'retro': 'retro',
                'cyber': 'premium'
            };
            const theme = petThemeMap[pet] || 'kawai';
            document.body.setAttribute('data-theme', theme);

            // Update active button (both old and new)
            document.querySelectorAll('.pet-btn, .pet-btn-top').forEach(btn => {
                btn.classList.remove('active');
            });
            const activeBtn = document.querySelector(`[data-pet="${pet}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }

            // [cleaned]
        }

        // ==================== ACTION BUTTONS ====================

        // вљ пёЏ REMOVED: Old feedPet(), playWithPet(), healPet() functions
        // These used fixed prices (50, 30, 100) and conflicted with new progressive pricing handlers
        // New handlers (lines 4911-4991) use getProgressivePrice() which scales with level:
        // - Every 5 levels = +20% price
        // - Level 10: 50 * 1.4 = 70 TAMA (feed), 30 * 1.4 = 42 TAMA (play), 100 * 1.4 = 140 TAMA (heal)

        // вљ пёЏ REMOVED: Old duplicate handlers (feedPet, playWithPet, healPet)
        // New handlers with progressive pricing are already set up above (lines 4911-4991)
        // They use getProgressivePrice() which scales with level

        document.addEventListener('DOMContentLoaded', function() {

            // INITIALIZE MINI GAMES HANDLERS
            // [cleaned]

            // Game card click handlers
            document.querySelectorAll('.game-card').forEach(card => {
                card.addEventListener('click', () => {
                    const game = card.dataset.game;
                    // [cleaned]
                    selectGame(game);
                });
            });

            // Initialize Catch Pet Game
            initCatchPetGame();
        });

        // Game selection function
        function selectGame(game) {
            // Р”Р»СЏ luckyslots - РѕС‚РєСЂС‹РІР°РµРј slots.html
            if (game === 'luckyslots') {
                const userId = window.TELEGRAM_USER_ID || '';
                window.open(`/slots.html?user_id=${userId}`, '_blank');
                return;
            }

            // Р”Р»СЏ platformer - РѕС‚РєСЂС‹РІР°РµРј super-tama-bros.html
            if (game === 'platformer') {
                const userId = window.TELEGRAM_USER_ID || '';
                window.open(`/super-tama-bros.html?user_id=${userId}`, '_blank');
                return;
            }

            // Р”Р»СЏ colormatch - РѕС‚РєСЂС‹РІР°РµРј tama-color-match.html
            if (game === 'colormatch') {
                const userId = window.TELEGRAM_USER_ID || '';
                window.open(`/tama-color-match.html?user_id=${userId}`, '_blank');
                return;
            }

            // Р”Р»СЏ shooter - РѕС‚РєСЂС‹РІР°РµРј tama-shooter.html
            if (game === 'shooter') {
                const userId = window.TELEGRAM_USER_ID || '';
                window.open(`/tama-shooter.html?user_id=${userId}`, '_blank');
                return;
            }

            // Hide game selection
            document.getElementById('game-selection').style.display = 'none';

            // Hide all game arenas
            document.querySelectorAll('.game-arena').forEach(arena => {
                arena.style.display = 'none';
            });

            // Show selected game arena
            const arena = document.getElementById(`${game}-arena`);
            if (arena) {
                arena.style.display = 'block';
            }
        }

        // Back to games function
        function backToGames() {
            // Reset battle state if in battle
            if (battleState && battleState.active) {
                clearInterval(battleState.roundTimer);
                clearInterval(battleState.matchmakingInterval);
                battleState.active = false;
            }

            // Reset racing state if in race
            if (racingState && racingState.active) {
                clearInterval(racingState.gameTimer);
                racingState.active = false;
            }

            // Reset catch pet state if active
            if (window.catchPetState && window.catchPetState.active) {
                clearInterval(window.catchPetState.gameTimer);
                clearTimeout(window.catchPetState.moveTimer);
                window.catchPetState.active = false;
            }

            // Hide all game arenas
            document.querySelectorAll('.game-arena').forEach(arena => {
                arena.style.display = 'none';
            });

            // Hide all battle screens
            document.getElementById('battle-lobby').style.display = 'block';
            document.getElementById('battle-matchmaking').style.display = 'none';
            document.getElementById('battle-fight').style.display = 'none';
            document.getElementById('battle-result').style.display = 'none';

            // Hide all racing screens
            document.getElementById('racing-lobby').style.display = 'block';
            document.getElementById('racing-game').style.display = 'none';
            document.getElementById('racing-result').style.display = 'none';

            // Show game selection
            document.getElementById('game-selection').style.display = 'grid';
        }

        // ==================== CATCH THE PET! GAME ====================

        // Catch Pet Game State
        window.catchPetState = {
            active: false,
            score: 0,
            caught: 0,
            speed: 1.0,
            gameTimer: null,
            moveTimer: null,
            petPosition: { x: 50, y: 50 },
            petSpeed: 2,
            gameArea: null,
            pet: null,
            progressFill: null,
            status: null,
            startBtn: null
        };

        // Initialize Catch Pet Game
        function initCatchPetGame() {
            const arena = document.getElementById('catchpet-arena');
            if (!arena) return;

            window.catchPetState.gameArea = document.getElementById('catchpet-game-area');
            window.catchPetState.pet = document.getElementById('catchpet-pet');
            window.catchPetState.progressFill = document.getElementById('catchpet-progress-fill');
            window.catchPetState.status = document.getElementById('catchpet-status');
            window.catchPetState.startBtn = document.getElementById('catchpet-start-btn');

            // Start button click
            if (window.catchPetState.startBtn) {
                window.catchPetState.startBtn.addEventListener('click', startCatchPetGame);
            }

            // Game area click (to catch pet)
            if (window.catchPetState.gameArea) {
                window.catchPetState.gameArea.addEventListener('click', catchPet);
            }
        }

        // Start Catch Pet Game
        function startCatchPetGame() {
            if (window.catchPetState.active) return;

            window.catchPetState.active = true;
            window.catchPetState.score = 0;
            window.catchPetState.caught = 0;
            window.catchPetState.speed = 1.0;
            window.catchPetState.petSpeed = 2;

            // Update UI
            updateCatchPetUI();

            // Start game timer (30 seconds)
            window.catchPetState.gameTimer = setInterval(() => {
                endCatchPetGame();
            }, 30000);

            // Start pet movement
            movePet();

            // Update status
            if (window.catchPetState.status) {
                window.catchPetState.status.textContent = 'Click on the pet to catch it! рџЋЇ';
            }

            // Hide start button
            if (window.catchPetState.startBtn) {
                window.catchPetState.startBtn.style.display = 'none';
            }
        }

        // Move Pet Randomly
        function movePet() {
            if (!window.catchPetState.active || !window.catchPetState.pet || !window.catchPetState.gameArea) return;

            const gameArea = window.catchPetState.gameArea;
            const pet = window.catchPetState.pet;
            const areaRect = gameArea.getBoundingClientRect();

            // Random position within game area
            const maxX = areaRect.width - 48; // Pet size
            const maxY = areaRect.height - 48;

            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;

            pet.style.left = newX + 'px';
            pet.style.top = newY + 'px';

            // Store position for catching
            window.catchPetState.petPosition = { x: newX, y: newY };

            // Schedule next move
            const moveDelay = Math.max(500, 2000 - (window.catchPetState.speed * 200));
            window.catchPetState.moveTimer = setTimeout(movePet, moveDelay);
        }

        // Catch Pet
        function catchPet(event) {
            if (!window.catchPetState.active) return;

            const pet = window.catchPetState.pet;
            const petRect = pet.getBoundingClientRect();
            const gameArea = window.catchPetState.gameArea;
            const areaRect = gameArea.getBoundingClientRect();

            // Check if click is near pet
            const clickX = event.clientX - areaRect.left;
            const clickY = event.clientY - areaRect.top;

            const petX = petRect.left - areaRect.left;
            const petY = petRect.top - areaRect.top;

            const distance = Math.sqrt((clickX - petX) ** 2 + (clickY - petY) ** 2);

            if (distance < 60) { // Catch radius
                // Pet caught!
                window.catchPetState.caught++;
                window.catchPetState.score += Math.floor(10 * window.catchPetState.speed);

                // Increase speed
                window.catchPetState.speed += 0.1;
                window.catchPetState.petSpeed += 0.2;

                // Update UI
                updateCatchPetUI();

                // Show catch effect
                showCatchEffect(petX, petY);

                // Move pet to new position
                setTimeout(() => {
                    movePet();
                }, 200);

                // Update status
                if (window.catchPetState.status) {
                    window.catchPetState.status.textContent = `Great catch! +${Math.floor(10 * window.catchPetState.speed)} points! рџЋ‰`;
                }
            } else {
                // Miss
                if (window.catchPetState.status) {
                    window.catchPetState.status.textContent = 'Miss! Try again! рџЋЇ';
                }
            }
        }

        // Show Catch Effect
        function showCatchEffect(x, y) {
            const gameArea = window.catchPetState.gameArea;
            const effect = document.createElement('div');
            effect.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                font-size: 24px;
                color: #fbbf24;
                font-weight: bold;
                pointer-events: none;
                z-index: 10;
                animation: catchEffect 1s ease-out forwards;
            `;
            effect.textContent = '+10';
            gameArea.appendChild(effect);

            setTimeout(() => {
                effect.remove();
            }, 1000);
        }

        // Update Catch Pet UI
        function updateCatchPetUI() {
            const stats = document.querySelectorAll('#catchpet-arena .game-arena > div > div');
            if (stats.length >= 3) {
                stats[0].textContent = window.catchPetState.caught;
                stats[1].textContent = window.catchPetState.score;
                stats[2].textContent = window.catchPetState.speed.toFixed(1) + 'x';
            }

            // Update progress bar
            if (window.catchPetState.progressFill) {
                const progress = Math.min(100, (window.catchPetState.caught / 10) * 100);
                window.catchPetState.progressFill.style.width = progress + '%';
            }
        }

        // End Catch Pet Game
        function endCatchPetGame() {
            if (!window.catchPetState.active) return;

            window.catchPetState.active = false;

            // Clear timers
            if (window.catchPetState.gameTimer) {
                clearInterval(window.catchPetState.gameTimer);
            }
            if (window.catchPetState.moveTimer) {
                clearTimeout(window.catchPetState.moveTimer);
            }

            // Calculate reward
            const baseReward = Math.floor(window.catchPetState.score / 10);
            const bonusReward = window.catchPetState.caught >= 5 ? 50 : 0;
            const totalReward = baseReward + bonusReward;

            // Award TAMA
            if (totalReward > 0) {
                gameState.tama += totalReward;
                updateUI();

                // Log transaction
                if (window.TransactionLogger) {
                    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
                    if (telegramUser) {
                        window.TransactionLogger.logMiniGame(
                            telegramUser.id.toString(),
                            telegramUser.username || telegramUser.first_name,
                            'catch_pet',
                            totalReward,
                            gameState.tama - totalReward,
                            gameState.tama
                        );
                    }
                }
            }

            // Show results
            if (window.catchPetState.status) {
                window.catchPetState.status.innerHTML = `
                    рџЋ‰ Game Over!<br>
                    Caught: ${window.catchPetState.caught} pets<br>
                    Score: ${window.catchPetState.score} points<br>
                    Reward: ${totalReward} TAMA!<br>
                    <button onclick="startCatchPetGame()" style="margin-top: 10px; padding: 10px 20px; background: #06b6d4; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer;">Play Again!</button>
                `;
            }

            // Show start button
            if (window.catchPetState.startBtn) {
                window.catchPetState.startBtn.style.display = 'inline-block';
            }
        }

        // Add CSS for catch effect animation
        const catchEffectCSS = `
            @keyframes catchEffect {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
            }
        `;

        const catchEffectStyle = document.createElement('style');
        catchEffectStyle.textContent = catchEffectCSS;
        document.head.appendChild(catchEffectStyle);
        // NFT Modal & Wallet Integration рџ–јпёЏ
        let walletConnected = false;
        let walletAddress = null;
        let solanaConnection = null;

        // Store NFT data globally for detail view
        let nftCollectionData = {};

        function initNFTModal() {
            const nftBtn = document.getElementById('nft-btn');
            const nftModal = document.getElementById('nft-modal');
            const closeNft = document.getElementById('close-nft');
            const connectWalletBtn = document.getElementById('connect-wallet-btn');
            const mintNftBtn = document.getElementById('mint-nft-btn');
            const closeNftDetail = document.getElementById('close-nft-detail');
            const nftDetailModal = document.getElementById('nft-detail-modal');

            // Close detail modal handlers
            if (closeNftDetail) {
                closeNftDetail.addEventListener('click', () => {
                    nftDetailModal.classList.remove('show');
                });
            }

            if (nftDetailModal) {
                nftDetailModal.addEventListener('click', (e) => {
                    if (e.target.id === 'nft-detail-modal') {
                        nftDetailModal.classList.remove('show');
                    }
                });
            }

            if (nftBtn) {
                nftBtn.addEventListener('click', async () => {
                    // [cleaned]
                    try {
                        // Load NFT collection when opening modal
                        // [cleaned]
                        await loadNFTCollection();
                        // [cleaned]
                        nftModal.style.display = 'block';

                        // Check if in Telegram WebApp and show warning
                        const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
                        const walletConnectSection = document.getElementById('wallet-connect-section');
                        const phantomWarning = document.getElementById('phantom-warning');

                        if (isTelegramWebApp && walletConnectSection && phantomWarning) {
                            // Show wallet connect section with warning
                            walletConnectSection.style.display = 'block';
                            phantomWarning.style.display = 'block';
                        } else if (!isTelegramWebApp && walletConnectSection) {
                            // In browser, check if Phantom is available
                            if (!window.solana || !window.solana.isPhantom) {
                                walletConnectSection.style.display = 'block';
                            }
                        }
                    } catch (err) {
                        console.error('вќЊ Error opening NFT modal:', err);
                        showMessage('вќЊ Failed to load NFTs');
                    }
                });
            } else {
                console.warn('вљ пёЏ NFT button not found in DOM');
            }

            // Also load when modal is opened via other means
            const originalShowModal = () => {
                loadNFTCollection();
            };

            // Mint button - show options or navigate
            const mintOptions = document.getElementById('mint-options');
            const mintWithTamaBtn = document.getElementById('mint-with-tama-btn');
            const mintWithSolBtn = document.getElementById('mint-with-sol-btn');

            if (mintNftBtn) {
                mintNftBtn.addEventListener('click', async () => {
                    // If wallet connected, show options
                    if (walletConnected && walletAddress && mintOptions) {
                        mintOptions.style.display = 'flex';
                        mintNftBtn.style.display = 'none';
                    } else {
                        // No wallet - navigate to mint page
                        await navigateToMintPage();
                    }
                });
            }

            // Mint with TAMA - navigate to mint page
            if (mintWithTamaBtn) {
                mintWithTamaBtn.addEventListener('click', async () => {
                    await navigateToMintPage();
                });
            }

            // Mint with SOL - mint directly in game
            if (mintWithSolBtn) {
                mintWithSolBtn.addEventListener('click', async () => {
                    // Check if in Telegram WebApp
                    const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;

                    if (isTelegramWebApp) {
                        // In Telegram WebApp - redirect to mint page with deep link
                        const userId = window.TELEGRAM_USER_ID || 'guest';
                        const userIdStr = String(userId);
                        const tamaBalance = gameState.tama || 0;
                        const level = gameState.level || 1;
                        const xp = gameState.xp || 0;

                        // Build mint page URL
                        // рџ”ђ SECURITY: Don't pass tama in URL - it will be loaded from DB
                        const mintUrl = `https://solanatamagotchi.com/mint.html?user_id=${userIdStr}&level=${level}&xp=${xp}&mobile=true`;

                        // Try to open Phantom wallet first (mobile deep link)
                        // Phantom mobile deep link format: https://phantom.app/ul/v1/...
                        // Or use solana: protocol
                        const phantomDeepLink = `https://phantom.app/ul/v1/connect?app_url=${encodeURIComponent(mintUrl)}&redirect_link=${encodeURIComponent(mintUrl)}`;

                        // Try to open Phantom first, fallback to mint page
                        try {
                            // On mobile, try to open Phantom app
                            window.location.href = phantomDeepLink;

                            // Fallback: if Phantom doesn't open, open mint page after 1 second
                            setTimeout(() => {
                                if (window.Telegram.WebApp.openLink) {
                                    window.Telegram.WebApp.openLink(mintUrl);
                                } else {
                                    window.open(mintUrl, '_blank');
                                }
                            }, 1000);
                        } catch (err) {
                            // If deep link fails, just open mint page
                            if (window.Telegram.WebApp.openLink) {
                                window.Telegram.WebApp.openLink(mintUrl);
                            } else {
                                window.open(mintUrl, '_blank');
                            }
                        }
                        return;
                    }

                    if (!walletConnected || !walletAddress) {
                        showMessage('вќЊ Please connect wallet first!', 'error');
                        await connectPhantomWallet();
                        return;
                    }

                    // Show tier selection
                    showMintTierSelection();
                });
            }

            // Helper: Navigate to mint page
            async function navigateToMintPage() {
                const userId = window.TELEGRAM_USER_ID || 'guest';
                const userIdStr = String(userId);

                // Force save to Supabase before leaving
                try {
                    await saveDirectToSupabase(userIdStr);
                    // [cleaned]
                } catch (err) {
                    console.warn('вљ пёЏ Failed to save before navigation:', err);
                }

                // Get current balance (ensure it's up to date)
                const tamaBalance = gameState.tama || 0;
                const level = gameState.level || 1;
                const xp = gameState.xp || 0;

                // Save wallet connection state if exists
                if (window.solana && window.solana.isConnected) {
                    try {
                        const wallet = window.solana.publicKey;
                        if (wallet) {
                            localStorage.setItem('phantom_wallet_address', wallet.toString());
                            // [cleaned]);
                        }
                    } catch (err) {
                        console.warn('вљ пёЏ Failed to save wallet:', err);
                    }
                }

                // Build URL with all important data
                // рџ”ђ SECURITY: Don't pass tama in URL - it will be loaded from DB
                const nftUrl = `https://solanatamagotchi.com/mint.html?user_id=${userIdStr}&level=${level}&xp=${xp}`;

                if (window.Telegram && window.Telegram.WebApp) {
                    // In Telegram, open external link
                    window.Telegram.WebApp.openLink(nftUrl);
                } else {
                    // In browser, open in new tab
                    window.open(nftUrl, '_blank');
                }
            }

            // Show tier selection modal for SOL minting
            function showMintTierSelection() {
                const modal = document.createElement('div');
                modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;';
                modal.innerHTML = `
                    <div style="background: linear-gradient(135deg, rgba(29, 53, 87, 0.95), rgba(69, 123, 157, 0.9)); border: 2px solid #8AC926; border-radius: 20px; padding: 30px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;">
                        <h2 style="color: #FFD700; text-align: center; margin-bottom: 20px;">рџ’Ћ Mint NFT with SOL</h2>
                        <p style="text-align: center; color: rgba(255,255,255,0.8); margin-bottom: 20px;">Choose NFT tier:</p>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button class="share-btn" onclick="window.mintNFTWithSOL('Bronze')" style="background: rgba(205, 127, 50, 0.3); border: 2px solid #CD7F32;">рџҐ‰ Bronze - 0.15 SOL</button>
                            <button class="share-btn" onclick="window.mintNFTWithSOL('Silver')" style="background: rgba(192, 192, 192, 0.3); border: 2px solid #C0C0C0;">рџҐ€ Silver - ~1 SOL</button>
                            <button class="share-btn" onclick="window.mintNFTWithSOL('Gold')" style="background: rgba(255, 215, 0, 0.3); border: 2px solid #FFD700;">рџҐ‡ Gold - ~3 SOL</button>
                            <button class="share-btn" onclick="window.mintNFTWithSOL('Platinum')" style="background: rgba(229, 228, 226, 0.3); border: 2px solid #E5E4E2;">рџ’Ћ Platinum - ~10 SOL</button>
                            <button class="share-btn" onclick="window.mintNFTWithSOL('Diamond')" style="background: rgba(185, 242, 255, 0.3); border: 2px solid #B9F2FF;">рџ”· Diamond - ~50 SOL</button>
                        </div>
                        <button class="share-btn" onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="margin-top: 20px; width: 100%; background: rgba(239, 68, 68, 0.3); border: 2px solid #ef4444;">Cancel</button>
                    </div>
                `;
                document.body.appendChild(modal);
            }

            if (closeNft) {
                closeNft.addEventListener('click', () => {
                    nftModal.style.display = 'none';
                });
            }

            if (connectWalletBtn) {
                connectWalletBtn.addEventListener('click', connectPhantomWallet);
            }
        }

        async function connectPhantomWallet() {
            try {
                // вљ пёЏ Check if running in Telegram WebApp (Phantom doesn't work there)
                const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;

                if (isTelegramWebApp) {
                    // In Telegram WebApp, Phantom doesn't work - need to open in browser
                    const confirmed = confirm(
                        'вљ пёЏ Phantom Wallet РЅРµ СЂР°Р±РѕС‚Р°РµС‚ РІ Telegram WebApp!\n\n' +
                        'Р”Р»СЏ РїРѕРґРєР»СЋС‡РµРЅРёСЏ РєРѕС€РµР»СЊРєР° РЅСѓР¶РЅРѕ РѕС‚РєСЂС‹С‚СЊ РёРіСЂСѓ РІ Р±СЂР°СѓР·РµСЂРµ.\n\n' +
                        'РћС‚РєСЂС‹С‚СЊ РІ Р±СЂР°СѓР·РµСЂРµ СЃРµР№С‡Р°СЃ?'
                    );

                    if (confirmed) {
                        // Get current game URL
                        const gameUrl = window.location.href;
                        // Open in external browser
                        if (window.Telegram.WebApp.openLink) {
                            window.Telegram.WebApp.openLink(gameUrl);
                        } else {
                            window.open(gameUrl, '_blank');
                        }
                    }
                    return;
                }

                // Check if Phantom is installed
                if (!window.solana || !window.solana.isPhantom) {
                    alert('вќЊ Phantom wallet not found!\n\nPlease install Phantom wallet:\nhttps://phantom.app/\n\nAfter installing, refresh the page.');
                    window.open('https://phantom.app/', '_blank');
                    return;
                }

                // Try to connect
                const resp = await window.solana.connect();
                walletAddress = resp.publicKey.toString();
                walletConnected = true;

                // [cleaned]

                // рџ”— NEW: Auto-link wallet to Telegram account
                await linkWalletToTelegramAccount(walletAddress);

                // рџ”„ Sync account data (balance, NFTs, etc.)
                await syncAccountData();

                const walletConnectSection = document.getElementById('wallet-connect-section');
                const nftCollection = document.getElementById('nft-collection');
                const walletAddressDisplay = document.getElementById('wallet-address-display');

                if (walletConnectSection) walletConnectSection.style.display = 'none';
                if (nftCollection) nftCollection.style.display = 'block';
                if (walletAddressDisplay) walletAddressDisplay.textContent = walletAddress.slice(0, 8) + '...' + walletAddress.slice(-4);

                await loadWalletBalance();
                await loadNFTCollection();
            } catch (err) {
                console.error('вќЊ Wallet connection error:', err);

                // Better error messages
                let errorMsg = 'Failed to connect wallet';
                if (err.message.includes('User rejected')) {
                    errorMsg = 'вќЊ Connection cancelled by user';
                } else if (err.message.includes('not found') || err.message.includes('Phantom')) {
                    errorMsg = 'вќЊ Phantom wallet not found! Please install from phantom.app';
                } else {
                    errorMsg = 'вќЊ ' + err.message;
                }

                alert(errorMsg);
            }
        }

        // рџ”— Auto-link wallet to Telegram account and merge orphaned NFTs
        async function linkWalletToTelegramAccount(walletAddress) {
            const telegramId = window.TELEGRAM_USER_ID;
            if (!telegramId) {
                // [cleaned]
                return;
            }

            try {
                // [cleaned]

                // Step 1: Save wallet_address to leaderboard
                const leaderboardResponse = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${telegramId}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        wallet_address: walletAddress
                    })
                });

                if (leaderboardResponse.ok) {
                    // [cleaned]
                } else {
                    console.warn('вљ пёЏ Failed to save wallet_address to leaderboard:', await leaderboardResponse.text());
                }

                // Step 2: Find NFTs with this wallet_address but no telegram_id (orphaned NFTs)
                // Method 1: Check user_nfts table directly (if wallet_address column exists)
                let orphanedNftIds = [];

                try {
                    const nftsResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts?wallet_address=eq.${walletAddress}&telegram_id=is.null&select=id`, {
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        }
                    });

                    if (nftsResponse.ok) {
                        const nfts = await nftsResponse.json();
                        orphanedNftIds = nfts.map(nft => nft.id);
                        // [cleaned] in user_nfts table`);
                    }
                } catch (e) {
                    // [cleaned]
                }

                // Method 2: Also search transactions table for SOL mints with this wallet (backup method)
                const transactionsResponse = await fetch(`${SUPABASE_URL}/rest/v1/transactions?type=eq.nft_mint_sol&select=metadata`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                if (transactionsResponse.ok) {
                    const transactions = await transactionsResponse.json();
                    const transactionNftIds = [];

                    // Find NFT IDs from transactions with matching wallet_address
                    transactions.forEach(tx => {
                        let metadata = null;
                        if (tx.metadata && typeof tx.metadata === 'object') {
                            metadata = tx.metadata;
                        } else if (typeof tx.metadata === 'string') {
                            try {
                                metadata = JSON.parse(tx.metadata);
                            } catch (e) {
                                return;
                            }
                        }

                        if (metadata && metadata.wallet_address === walletAddress && metadata.nft_id) {
                            transactionNftIds.push(metadata.nft_id);
                        }
                    });

                    // Merge with existing IDs (avoid duplicates)
                    transactionNftIds.forEach(id => {
                        if (!orphanedNftIds.includes(id)) {
                            orphanedNftIds.push(id);
                        }
                    });

                    if (transactionNftIds.length > 0) {
                        // [cleaned] from transactions`);
                    }
                }

                if (orphanedNftIds.length === 0) {
                    // [cleaned]
                    return;
                }

                // [cleaned] to link:`, orphanedNftIds);

                // Step 3: Update orphaned NFTs with telegram_id
                for (const nftId of orphanedNftIds) {
                    const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts?id=eq.${nftId}`, {
                        method: 'PATCH',
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            telegram_id: telegramId
                        })
                    });

                    if (updateResponse.ok) {
                        // [cleaned]
                    } else {
                        console.warn(`вљ пёЏ Failed to link NFT #${nftId}:`, await updateResponse.text());
                    }
                }

                // Step 4: Show success notification
                if (orphanedNftIds.length > 0) {
                    showMessage(`рџЋ‰ Linked ${orphanedNftIds.length} NFT(s) to your Telegram account!`);
                    // [cleaned]`);
                }

            } catch (err) {
                console.error('вќЊ Error linking wallet to Telegram account:', err);
                // Don't show error to user - non-critical feature
            }
        }

        // ==============================================
        // ACCOUNT SYNCHRONIZATION
        // ==============================================
        async function syncAccountData() {
            const telegramId = window.TELEGRAM_USER_ID;
            const wallet = walletAddress;

            if (!telegramId || !wallet) {
                // [cleaned]
                return;
            }

            try {
                // [cleaned]

                // 1. Update wallet_address in leaderboard
                await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${telegramId}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ wallet_address: wallet })
                });

                // 2. Sync TAMA balance from database
                const balanceResponse = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${telegramId}&select=tama`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                if (balanceResponse.ok) {
                    const balanceData = await balanceResponse.json();
                    if (balanceData && balanceData.length > 0 && balanceData[0].tama !== undefined) {
                        const dbBalance = balanceData[0].tama || 0;
                        // Update gameState if database balance is higher (might have passive income)
                        if (dbBalance > gameState.tama) {
                            gameState.tama = dbBalance;
                            if (typeof updateUI === 'function') {
                                updateUI();
                            }
                            // [cleaned]
                        }
                    }
                }

                // 3. Link orphaned NFTs (already done in linkWalletToTelegramAccount)
                await linkWalletToTelegramAccount(wallet);

                // [cleaned]

            } catch (err) {
                console.error('вќЊ Error syncing account data:', err);
            }
        }

        // ==============================================
        // SOL DISTRIBUTION FUNCTION (for NFT minting)
        // ==============================================
        async function createAndSendDistributionTransaction(priceSOL) {
            try {
                const { Transaction, SystemProgram, PublicKey, Connection } = window.solanaWeb3;
                const connection = new Connection('https://api.devnet.solana.com');

                // Create transaction with 3 transfers
                const transaction = new Transaction();

                // Transfer 1: 50% to Treasury Main
                transaction.add(
                    SystemProgram.transfer({
                        fromPubkey: new PublicKey(walletAddress),
                        toPubkey: new PublicKey(TREASURY_MAIN),
                        lamports: Math.floor(priceSOL * 1e9 * 0.50)
                    })
                );

                // Transfer 2: 30% to Treasury Liquidity
                transaction.add(
                    SystemProgram.transfer({
                        fromPubkey: new PublicKey(walletAddress),
                        toPubkey: new PublicKey(TREASURY_LIQUIDITY),
                        lamports: Math.floor(priceSOL * 1e9 * 0.30)
                    })
                );

                // Transfer 3: 20% to Treasury Team
                transaction.add(
                    SystemProgram.transfer({
                        fromPubkey: new PublicKey(walletAddress),
                        toPubkey: new PublicKey(TREASURY_TEAM),
                        lamports: Math.floor(priceSOL * 1e9 * 0.20)
                    })
                );

                // Get recent blockhash and set fee payer
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                transaction.recentBlockhash = blockhash;
                transaction.lastValidBlockHeight = lastValidBlockHeight;
                transaction.feePayer = new PublicKey(walletAddress);

                // [cleaned]
                // [cleaned].toFixed(6)} SOL (50%)`);
                // [cleaned].toFixed(6)} SOL (30%)`);
                // [cleaned].toFixed(6)} SOL (20%)`);

                // Request signature from Phantom
                const signed = await window.solana.signAndSendTransaction(transaction);

                // Wait for confirmation
                await connection.confirmTransaction(signed, 'confirmed');

                // Extract signature from response
                const signature = typeof signed === 'string' ? signed : (signed.signature || signed);

                // [cleaned]
                return signature;

            } catch (err) {
                console.error('вќЊ Distribution transaction failed:', err);
                throw new Error('Failed to create distribution transaction: ' + err.message);
            }
        }

        // ==============================================
        // MINT NFT WITH SOL (in-game)
        // ==============================================
        window.mintNFTWithSOL = async function(tierName) {
            try {
                // [cleaned]

                if (!walletConnected || !walletAddress) {
                    showMessage('вќЊ Please connect wallet first!', 'error');
                    await connectPhantomWallet();
                    return;
                }

                // Get current price from database
                const priceResponse = await fetch(`${SUPABASE_URL}/rest/v1/nft_bonding_state?tier_name=eq.${tierName}&select=current_price`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                if (!priceResponse.ok) {
                    showMessage('вќЊ Failed to get NFT price. Please try again.', 'error');
                    return;
                }

                const priceData = await priceResponse.json();
                if (!priceData || priceData.length === 0) {
                    showMessage('вќЊ NFT tier not found. Please try again.', 'error');
                    return;
                }

                const price = parseFloat(priceData[0].current_price);
                const priceUSD = (price * SOL_USD_RATE).toFixed(2);

                const boostMap = {
                    'Bronze': 2.0,
                    'Silver': 2.3,
                    'Gold': 2.7,
                    'Platinum': 3.5,
                    'Diamond': 5.0
                };

                // Confirm mint
                const confirmed = confirm(
                    `Mint ${tierName} NFT for ${price} SOL ($${priceUSD})?\n\n` +
                    `You will get Г—${boostMap[tierName]} earning boost!\n\n` +
                    `Continue?`
                );

                if (!confirmed) {
                    return;
                }

                showMessage('вЏі Creating transaction...', 'info');

                // Create and send SOL distribution transaction
                let transactionSignature = null;
                try {
                    transactionSignature = await createAndSendDistributionTransaction(price);
                    // [cleaned]
                } catch (distError) {
                    console.error('вљ пёЏ Distribution transaction failed:', distError);
                    showMessage('вќЊ Transaction failed: ' + distError.message, 'error');
                    return;
                }

                // Call API for minting
                let apiUrl;
                let requestBody;

                if (tierName === 'Bronze') {
                    // Bronze uses different endpoint
                    apiUrl = 'https://api.solanatamagotchi.com/api/mint-nft-bronze-sol-rest.php';
                    requestBody = {
                        telegram_id: window.TELEGRAM_USER_ID || null,
                        wallet_address: walletAddress,
                        price_sol: price,
                        transaction_signature: transactionSignature
                    };
                } else {
                    // Silver/Gold/Platinum/Diamond
                    apiUrl = 'https://api.solanatamagotchi.com/api/mint-nft-sol-rest.php';
                    requestBody = {
                        telegram_id: window.TELEGRAM_USER_ID || null,
                        wallet_address: walletAddress,
                        tier_name: tierName,
                        price_sol: price,
                        transaction_signature: transactionSignature
                    };
                }

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API error: ${response.status} - ${errorText.substring(0, 100)}`);
                }

                const result = await response.json();

                if (result.success) {
                    showMessage(`вњ… ${tierName} NFT #${result.design_number || result.nft_id || 'N/A'} minted!`, 'success');
                    await loadNFTCollection(); // Reload collection
                    // Sync account data
                    await syncAccountData();
                } else {
                    showMessage('вќЊ Mint failed: ' + (result.error || 'Unknown error'), 'error');
                }

            } catch (err) {
                console.error(`вќЊ Mint ${tierName} failed:`, err);
                showMessage('вќЊ Mint error: ' + err.message, 'error');
            }
        };

        async function loadWalletBalance() {
            try {
                const connection = new window.solanaWeb3.Connection('https://api.devnet.solana.com');
                const publicKey = new window.solanaWeb3.PublicKey(walletAddress);
                const balance = await connection.getBalance(publicKey);
                const solBalance = (balance / 1000000000).toFixed(4);
                document.getElementById('wallet-balance-display').textContent = solBalance + ' SOL';
            } catch (err) {
                console.error('вќЊ Balance load error:', err);
            }
        }

        // Function to get IPFS image URL based on tier and rarity
        // IPFS URLs from Lighthouse Storage (uploaded 2025-11-21)
        function getNFTImageUrl(tier, rarity) {
            const tierLower = tier.toLowerCase();
            const rarityLower = rarity.toLowerCase();

            const ipfsUrls = {
                bronze: {
                    common: 'https://gateway.lighthouse.storage/ipfs/bafkreidvxzsnozwpgjqbydcncpumcgk3aqmr3evxhqjmf6ibzmrmuv565i',
                    uncommon: 'https://gateway.lighthouse.storage/ipfs/bafkreibnoiown4k6dyhxvv642ep6av6xwkgtqvusrhhn7l4janrgfjixbq',
                    rare: 'https://gateway.lighthouse.storage/ipfs/bafkreia7mldvzaw52wvz42od4xdj7asw2fqc7gba7zhdbpfg3d6z3byl5y',
                    epic: 'https://gateway.lighthouse.storage/ipfs/bafkreiefw2xgoo5w37jkpd6etgr6eurgu7z64tsb7e6bhbbqa5z3qidbbq'
                },
                silver: {
                    uncommon: 'https://gateway.lighthouse.storage/ipfs/bafkreibp7zxf6fqilehacookucnyhzbqkvaqqbuk3jel7irsa2dzzvnw2a',
                    rare: 'https://gateway.lighthouse.storage/ipfs/bafkreidnwtfwftmcsexgmf6p5qn5jorgwmtl4w2jegyyo7gnynvq2qe334',
                    epic: 'https://gateway.lighthouse.storage/ipfs/bafkreifkxigyyudtynmn4ffmt2gx7getqs3jfzy2nqdjrzaplpelf3tozq',
                    legendary: 'https://gateway.lighthouse.storage/ipfs/bafkreigywjdjw3vxopv4blicqioyx5fyqpwcvs22s2ea377rofvh2sslnm'
                },
                gold: {
                    common: 'https://gateway.lighthouse.storage/ipfs/bafkreicywzvyse3immuhakmd4dvv22gxsikmzhn4q7cjkmzjpp7253ftse',
                    uncommon: 'https://gateway.lighthouse.storage/ipfs/bafkreibp7zxf6fqilehacookucnyhzbqkvaqqbuk3jel7irsa2dzzvnw2a',
                    rare: 'https://gateway.lighthouse.storage/ipfs/bafkreidnwtfwftmcsexgmf6p5qn5jorgwmtl4w2jegyyo7gnynvq2qe334',
                    epic: 'https://gateway.lighthouse.storage/ipfs/bafkreifkxigyyudtynmn4ffmt2gx7getqs3jfzy2nqdjrzaplpelf3tozq'
                },
                platinum: {
                    rare: 'https://gateway.lighthouse.storage/ipfs/bafkreib72mfqqs5qa3g7asjy4jtoiorxpok3bniknisqznf572haifakcq',
                    epic: 'https://gateway.lighthouse.storage/ipfs/bafkreiell36dnbe5oomfigv6yxk65rkbj2eo62t6ihrprbyqbomjraobo4',
                    legendary: 'https://gateway.lighthouse.storage/ipfs/bafkreihrwin3ld34uner7rpwggke2pfnn5beb3eyrw7vrjmw6n5hen5hie'
                },
                diamond: {
                    rare: 'https://gateway.lighthouse.storage/ipfs/bafkreigflr4x4xczfyl7gavdmaos7uupi73xm2yainwl2tlfn3nabqpsly',
                    epic: 'https://gateway.lighthouse.storage/ipfs/bafkreib3la6mkyzjtethphozhsuccp6b4x63dilrz6rsb4tsjvqdxdl5pq',
                    legendary: 'https://gateway.lighthouse.storage/ipfs/bafkreidtqr62aeflchsghhdoo4m7tv33j7za5w3ttzqziwkl4u4cmgz7tq'
                }
            };

            return ipfsUrls[tierLower]?.[rarityLower] || null;
        }

        async function loadNFTCollection() {
            // [cleaned]
            try {
                const userId = window.TELEGRAM_USER_ID;
                // [cleaned]
                if (!userId) {
                    console.warn('вљ пёЏ No user ID for NFT loading');
                    const nftStats = document.getElementById('nft-stats');
                    if (nftStats) nftStats.textContent = 'Please login to view NFTs';
                    return;
                }

                // [cleaned]

                // Load NFTs from user_nfts table with nft_designs join
                // Try to get image_url from nft_designs table via foreign key
                const response = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts?telegram_id=eq.${userId}&order=id.desc&select=*,nft_designs(image_url,design_theme,design_variant)`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                if (!response.ok) {
                    // Fallback: try without join if foreign key doesn't work
                    console.warn('вљ пёЏ Join query failed, trying simple query...');
                    const simpleResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts?telegram_id=eq.${userId}&order=id.desc&select=*`, {
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        }
                    });

                    if (!simpleResponse.ok) {
                        const errorText = await simpleResponse.text();
                        console.error('вќЊ Supabase error response:', errorText);
                        throw new Error('Failed to load NFTs: ' + simpleResponse.statusText + ' - ' + errorText);
                    }

                    var nfts = await simpleResponse.json();
                } else {
                    var nfts = await response.json();
                }

                const nftGrid = document.getElementById('nft-grid');
                const nftStats = document.getElementById('nft-stats');

                // [cleaned]

                // If we have nft_design_id but no image_url, fetch images separately
                const nftsWithDesignIds = nfts.filter(n => n.nft_design_id && (!n.nft_designs || !n.nft_designs.image_url));
                if (nftsWithDesignIds.length > 0) {
                    // [cleaned]
                    const designIds = [...new Set(nftsWithDesignIds.map(n => n.nft_design_id))];

                    try {
                        const designsResponse = await fetch(`${SUPABASE_URL}/rest/v1/nft_designs?id=in.(${designIds.join(',')})&select=id,image_url,design_theme,design_variant`, {
                            headers: {
                                'apikey': SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                            }
                        });

                        if (designsResponse.ok) {
                            const designs = await designsResponse.json();
                            const designMap = {};
                            designs.forEach(d => {
                                designMap[d.id] = d;
                            });

                            // Attach design data to NFTs
                            nfts = nfts.map(nft => {
                                if (nft.nft_design_id && designMap[nft.nft_design_id]) {
                                    nft.nft_designs = designMap[nft.nft_design_id];
                                }
                                return nft;
                            });
                        }
                    } catch (e) {
                        console.warn('вљ пёЏ Failed to fetch design images:', e);
                    }
                }

                if (!nftGrid || !nftStats) {
                    console.error('вќЊ NFT elements not found in DOM');
                    return;
                }

                if (nfts && nfts.length > 0) {
                    // Store NFT data globally for detail view
                    nftCollectionData = {};
                    nfts.forEach(nft => {
                        nftCollectionData[nft.id] = nft;
                    });

                    // Calculate stats
                    const totalNFTs = nfts.length;
                    // On-chain NFTs are ALWAYS active, off-chain NFTs use is_active flag
                    const activeNFTsList = nfts.filter(n => {
                        const isOnChain = n.nft_mint_address && n.nft_mint_address.length > 30 && !n.nft_mint_address.includes('_');
                        return isOnChain ? true : (n.is_active !== false);
                    });
                    const activeNFTs = activeNFTsList.length;
                    // вњ… FIX: Sum only ACTIVE NFTs, not all NFTs
                    const totalBoost = activeNFTsList.reduce((sum, n) => sum + (parseFloat(n.earning_multiplier) || 0), 0);

                    nftStats.innerHTML = `
                        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 15px;">
                            <div><strong>Total:</strong> ${totalNFTs} NFT${totalNFTs !== 1 ? 's' : ''}</div>
                            <div><strong>Active:</strong> ${activeNFTs}</div>
                            <div><strong>Total Boost:</strong> ${totalBoost.toFixed(1)}x</div>
                        </div>
                    `;

                    // Render NFT cards
                    nftGrid.innerHTML = nfts.map(nft => {
                        const tier = nft.tier_name || 'Unknown';
                        const rarity = nft.rarity || 'Common';
                        const multiplier = parseFloat(nft.earning_multiplier) || 1;

                        // Check if on-chain NFT
                        const isOnChain = nft.nft_mint_address && nft.nft_mint_address.length > 30 && !nft.nft_mint_address.includes('_');

                        // CRITICAL: On-chain NFTs are ALWAYS active (they exist on blockchain forever)
                        // Only off-chain NFTs can be inactive (based on is_active flag in DB)
                        const isActive = isOnChain ? true : (nft.is_active !== false);

                        // Get image URL - priority: database > IPFS > emoji fallback
                        let imageUrl = null;

                        // 1. Try database image_url first
                        if (nft.nft_designs && nft.nft_designs.image_url) {
                            const dbUrl = nft.nft_designs.image_url;
                            // Check if it's a valid URL (not placeholder or empty)
                            if (dbUrl && !dbUrl.includes('placeholder') && !dbUrl.includes('via.placeholder')) {
                                imageUrl = dbUrl;
                            }
                        }

                        // 2. If no valid database URL, use IPFS URL based on tier+rarity
                        if (!imageUrl) {
                            imageUrl = getNFTImageUrl(tier, rarity);
                        }

                        // 3. Use emoji fallback if still no image
                        const tierEmoji = {
                            'Bronze': 'рџҐ‰',
                            'Silver': 'рџҐ€',
                            'Gold': 'рџҐ‡',
                            'Platinum': 'рџ’Ћ',
                            'Diamond': 'рџ’ '
                        };
                        // Properly encode SVG to avoid HTML injection issues
                        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" font-size="100" text-anchor="middle" dy=".3em">${tierEmoji[tier] || 'рџЋ®'}</text></svg>`;
                        const emojiUrl = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
                        if (!imageUrl) {
                            imageUrl = emojiUrl;
                        }

                        const tierColors = {
                            'Bronze': '#CD7F32',
                            'Silver': '#C0C0C0',
                            'Gold': '#FFD700',
                            'Platinum': '#E5E4E2',
                            'Diamond': '#B9F2FF'
                        };
                        const tierColor = tierColors[tier] || '#8AC926';
                        const onChainBadge = isOnChain ? ' рџ”—' : '';

                        // Store NFT data in data attribute for detail view
                        const nftData = encodeURIComponent(JSON.stringify({
                            id: nft.id,
                            tier: tier,
                            rarity: rarity,
                            multiplier: multiplier,
                            isActive: isActive,
                            imageUrl: imageUrl,
                            tierColor: tierColor,
                            isOnChain: isOnChain,
                            nft_mint_address: nft.nft_mint_address,
                            purchase_price_sol: nft.purchase_price_sol,
                            purchase_price_tama: nft.purchase_price_tama,
                            minted_at: nft.minted_at,
                            nft_design_id: nft.nft_design_id,
                            design_theme: nft.nft_designs?.design_theme,
                            design_variant: nft.nft_designs?.design_variant
                        }));

                        // Escape values to prevent HTML injection
                        const tierSafe = escapeHtml(tier);
                        const raritySafe = escapeHtml(rarity);

                        return `
                            <div class="nft-card" style="border-color: ${tierColor};" data-nft='${nftData}' onclick="showNFTDetail(${nft.id})">
                                <img src="${imageUrl}" alt="${tierSafe} NFT" onerror="this.onerror=null; this.src='${emojiUrl}';">
                                <div style="font-size: 18px; font-weight: bold; color: ${tierColor}; margin-bottom: 8px;">${tierSafe}${onChainBadge}</div>
                                <div style="font-size: 14px; color: #fff; margin-bottom: 8px; opacity: 0.9;">${raritySafe}</div>
                                <div style="font-size: 16px; color: #8AC926; margin-bottom: 8px; font-weight: bold;">вљЎ ${multiplier}x Boost</div>
                                ${isActive ? '<div style="font-size: 12px; color: #10b981; font-weight: bold;">вњ… Active</div>' : '<div style="font-size: 12px; color: #ef4444;">вќЊ Inactive</div>'}
                            </div>
                        `;
                    }).join('');
                } else {
                    if (nftStats) {
                        nftStats.innerHTML = `
                            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 15px;">
                                <div><strong>Total:</strong> 0 NFTs</div>
                                <div><strong>Active:</strong> 0</div>
                                <div><strong>Total Boost:</strong> 0.0x</div>
                            </div>
                        `;
                    }
                    nftGrid.innerHTML = `
                        <div style="grid-column: 1/-1; text-align: center; padding: 60px 40px; color: rgba(255,255,255,0.7);">
                            <div style="font-size: 80px; margin-bottom: 30px;">рџ–јпёЏ</div>
                            <p style="font-size: 24px; margin-bottom: 15px; color: #FFB703;">You don't have any NFTs yet!</p>
                            <p style="font-size: 18px; opacity: 0.8;">Mint your first NFT pet to start earning boosts!</p>
                        </div>
                    `;
                }
            } catch (err) {
                console.error('вќЊ NFT load error:', err);
                const nftStats = document.getElementById('nft-stats');
                const nftGrid = document.getElementById('nft-grid');
                if (nftStats) nftStats.textContent = 'Error loading NFTs: ' + err.message;
                if (nftGrid) nftGrid.innerHTML = '<p style="text-align: center; color: #ef4444;">Failed to load NFTs. Please try again.</p>';
            }
        }

        // рџЋЇ Р”Р•РўРђР›Р¬РќР«Р™ РџР РћРЎРњРћРўР  NFT
        async function showNFTDetail(nftId) {
            try {
                const nft = nftCollectionData[nftId];
                if (!nft) {
                    console.error('NFT not found:', nftId);
                    return;
                }

                const tier = nft.tier_name || 'Unknown';
                const rarity = nft.rarity || 'Common';
                const multiplier = parseFloat(nft.earning_multiplier) || 1;

                // Check if on-chain NFT
                const isOnChain = nft.nft_mint_address && nft.nft_mint_address.length > 30 && !nft.nft_mint_address.includes('_');

                // CRITICAL: On-chain NFTs are ALWAYS active (they exist on blockchain forever)
                // Only off-chain NFTs can be inactive (based on is_active flag in DB)
                const isActive = isOnChain ? true : (nft.is_active !== false);

                // Get image URL - priority: database > IPFS > emoji fallback
                let imageUrl = null;

                // 1. Try database image_url first
                if (nft.nft_designs && nft.nft_designs.image_url) {
                    const dbUrl = nft.nft_designs.image_url;
                    // Check if it's a valid URL (not placeholder or empty)
                    if (dbUrl && !dbUrl.includes('placeholder') && !dbUrl.includes('via.placeholder')) {
                        imageUrl = dbUrl;
                    }
                }

                // 2. If no valid database URL, use IPFS URL based on tier+rarity
                if (!imageUrl) {
                    imageUrl = getNFTImageUrl(tier, rarity);
                }

                // 3. Use emoji fallback if still no image
                const tierEmoji = {
                    'Bronze': 'рџҐ‰',
                    'Silver': 'рџҐ€',
                    'Gold': 'рџҐ‡',
                    'Platinum': 'рџ’Ћ',
                    'Diamond': 'рџ’ '
                };
                // Properly encode SVG to avoid HTML injection issues
                const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" font-size="100" text-anchor="middle" dy=".3em">${tierEmoji[tier] || 'рџЋ®'}</text></svg>`;
                const emojiUrl = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
                if (!imageUrl) {
                    imageUrl = emojiUrl;
                }

                const tierColors = {
                    'Bronze': '#CD7F32',
                    'Silver': '#C0C0C0',
                    'Gold': '#FFD700',
                    'Platinum': '#E5E4E2',
                    'Diamond': '#B9F2FF'
                };
                const tierColor = tierColors[tier] || '#8AC926';

                // Р—Р°РіСЂСѓР¶Р°РµРј РёРЅС„РѕСЂРјР°С†РёСЋ Рѕ С‚СЂР°РЅР·Р°РєС†РёРё РјРёРЅС‚Р°
                let mintTransaction = null;
                let mintReason = 'Unknown';
                try {
                    const userId = window.TELEGRAM_USER_ID;
                    if (userId) {
                        const txResponse = await fetch(`${SUPABASE_URL}/rest/v1/transactions?user_id=eq.${userId}&type=eq.nft_mint&metadata->>nft_id=eq.${nftId}&order=created_at.desc&limit=1`, {
                            headers: {
                                'apikey': SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                            }
                        });

                        if (txResponse.ok) {
                            const transactions = await txResponse.json();
                            if (transactions && transactions.length > 0) {
                                mintTransaction = transactions[0];
                                const metadata = typeof mintTransaction.metadata === 'string'
                                    ? JSON.parse(mintTransaction.metadata)
                                    : mintTransaction.metadata;

                                // РћРїСЂРµРґРµР»СЏРµРј РїСЂРёС‡РёРЅСѓ РјРёРЅС‚Р°
                                if (metadata.purchase_method === 'tama') {
                                    mintReason = `Purchased with ${metadata.cost_tama || nft.purchase_price_tama || 0} TAMA`;
                                } else if (metadata.purchase_method === 'sol') {
                                    mintReason = `Purchased with ${metadata.cost_sol || nft.purchase_price_sol || 0} SOL`;
                                } else if (metadata.reason) {
                                    mintReason = metadata.reason;
                                } else {
                                    mintReason = nft.purchase_price_tama
                                        ? `Purchased with ${nft.purchase_price_tama} TAMA`
                                        : nft.purchase_price_sol
                                            ? `Purchased with ${nft.purchase_price_sol} SOL`
                                            : 'Minted';
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.warn('Failed to load mint transaction:', e);
                }

                // Р¤РѕСЂРјР°С‚РёСЂСѓРµРј РґР°С‚Сѓ
                const mintDate = nft.minted_at
                    ? new Date(nft.minted_at).toLocaleString('ru-RU', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : 'Unknown';

                // isOnChain already declared above (line 12251), reuse it
                const explorerLink = isOnChain
                    ? `https://solscan.io/token/${nft.nft_mint_address}?cluster=devnet`
                    : null;

                // Escape values to prevent HTML injection
                const tierSafe = escapeHtml(tier);
                const raritySafe = escapeHtml(rarity);

                // Р¤РѕСЂРјРёСЂСѓРµРј HTML
                const detailHTML = `
                    <div class="nft-detail-header">
                        <div class="nft-detail-image">
                            <img src="${imageUrl}" alt="${tierSafe} NFT" onerror="this.onerror=null; this.src='${emojiUrl}';" style="border-color: ${tierColor};">
                        </div>
                        <div class="nft-detail-info">
                            <div class="nft-detail-title" style="color: ${tierColor};">
                                ${tierSafe} NFT ${isOnChain ? 'рџ”—' : ''}
                            </div>
                            <div style="margin-bottom: 15px;">
                                <span class="nft-detail-badge" style="background: ${tierColor}; color: #000;">
                                    ${raritySafe}
                                </span>
                                <span class="nft-detail-badge" style="background: ${isActive ? '#10b981' : '#ef4444'}; color: #fff;">
                                    ${isActive ? 'вњ… Active' : 'вќЊ Inactive'}
                                </span>
                                ${isOnChain ? '<span class="nft-detail-badge" style="background: #8b5cf6; color: #fff;">рџ”— On-Chain</span>' : ''}
                            </div>
                            <div class="nft-detail-stats">
                                <div class="nft-detail-stat">
                                    <div class="nft-detail-stat-label">вљЎ Earning Boost</div>
                                    <div style="font-size: 24px; font-weight: bold; color: #8AC926;">${multiplier}x</div>
                                </div>
                                <div class="nft-detail-stat">
                                    <div class="nft-detail-stat-label">рџ’° Purchase Price</div>
                                    <div style="font-size: 18px; font-weight: bold;">
                                        ${nft.purchase_price_tama ? `${nft.purchase_price_tama} TAMA` : ''}
                                        ${nft.purchase_price_sol ? `${nft.purchase_price_sol} SOL` : ''}
                                        ${!nft.purchase_price_tama && !nft.purchase_price_sol ? 'Free' : ''}
                                    </div>
                                </div>
                                <div class="nft-detail-stat">
                                    <div class="nft-detail-stat-label">рџ“… Minted Date</div>
                                    <div style="font-size: 14px;">${mintDate}</div>
                                </div>
                                ${explorerLink ? `
                                <div class="nft-detail-stat">
                                    <div class="nft-detail-stat-label">рџ”— Blockchain</div>
                                    <a href="${explorerLink}" target="_blank" style="color: #8AC926; text-decoration: none;">
                                        View on Solscan в†’
                                    </a>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; border: 1px solid rgba(138, 201, 38, 0.2);">
                        <h3 style="margin: 0 0 15px 0; color: #8AC926; font-size: 20px;">рџ“ќ Mint Information</h3>
                        <div style="line-height: 1.8;">
                            <div><strong>Reason:</strong> ${mintReason}</div>
                            ${mintTransaction && mintTransaction.metadata ? `
                                <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px; font-size: 12px; font-family: monospace;">
                                    <strong>Transaction ID:</strong> ${mintTransaction.id}<br>
                                    ${mintTransaction.metadata.transaction_signature ? `<strong>Signature:</strong> ${mintTransaction.metadata.transaction_signature.substring(0, 20)}...` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;

                const detailBody = document.getElementById('nft-detail-body');
                const detailModal = document.getElementById('nft-detail-modal');

                if (detailBody && detailModal) {
                    detailBody.innerHTML = detailHTML;
                    detailModal.classList.add('show');
                }
            } catch (err) {
                console.error('вќЊ Error showing NFT detail:', err);
                alert('Failed to load NFT details: ' + err.message);
            }
        }

        // рџ’ё WITHDRAW MODAL INITIALIZATION
        let withdrawWalletAddress = null;
        let withdrawPhantomConnected = false;
        let savedWallets = [];

        // Load saved wallets from localStorage
        function loadSavedWallets() {
            try {
                const saved = localStorage.getItem('saved_wallets');
                if (saved) {
                    savedWallets = JSON.parse(saved);
                } else {
                    savedWallets = [];
                }
                updateSavedWalletsUI();
            } catch (e) {
                console.error('Failed to load saved wallets:', e);
                savedWallets = [];
            }
        }

        // Save wallets to localStorage
        function saveWallets() {
            try {
                localStorage.setItem('saved_wallets', JSON.stringify(savedWallets));
            } catch (e) {
                console.error('Failed to save wallets:', e);
            }
        }

        // Update saved wallets dropdown
        function updateSavedWalletsUI() {
            const select = document.getElementById('saved-wallets-select');
            const section = document.getElementById('saved-wallets-section');

            if (!select || !section) return;

            if (savedWallets.length === 0) {
                section.style.display = 'none';
                return;
            }

            section.style.display = 'block';
            select.innerHTML = '<option value="">Select saved wallet...</option>';

            savedWallets.forEach((wallet, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${wallet.name || 'Wallet'} - ${wallet.address.substring(0, 8)}...${wallet.address.substring(wallet.address.length - 8)}`;
                select.appendChild(option);
            });
        }

        // Add wallet to saved list
        function addSavedWallet(address, name = null) {
            if (!address || address.length < 32) return false;

            // Check if already exists
            const exists = savedWallets.find(w => w.address === address);
            if (exists) {
                return false; // Already exists
            }

            savedWallets.push({
                address: address,
                name: name || `Wallet ${savedWallets.length + 1}`,
                addedAt: new Date().toISOString()
            });

            saveWallets();
            updateSavedWalletsUI();
            return true;
        }

        function initWithdrawModal() {
            const withdrawBtn = document.getElementById('withdraw-btn');
            const withdrawModal = document.getElementById('withdraw-modal');
            const closeWithdraw = document.getElementById('close-withdraw');
            const connectPhantomBtn = document.getElementById('connect-phantom-btn');
            const disconnectPhantomBtn = document.getElementById('disconnect-phantom');
            const walletInput = document.getElementById('withdraw-wallet-input');
            const amountInput = document.getElementById('withdraw-amount-input');
            const confirmBtn = document.getElementById('confirm-withdraw-btn');
            const openBrowserBtn = document.getElementById('open-browser-withdraw');
            const quickAmountBtns = document.querySelectorAll('.quick-amount-btn');

            // Load saved wallets
            loadSavedWallets();

            // Open modal
            if (withdrawBtn && withdrawModal) {
                withdrawBtn.addEventListener('click', async () => {
                    await loadWithdrawBalance();
                    await loadSavedWalletAddress(); // Р—Р°РіСЂСѓР¶Р°РµРј СЃРѕС…СЂР°РЅРµРЅРЅС‹Р№ Р°РґСЂРµСЃ
                    await loadWithdrawHistory();
                    loadSavedWallets(); // Р—Р°РіСЂСѓР¶Р°РµРј СЃРїРёСЃРѕРє СЃРѕС…СЂР°РЅРµРЅРЅС‹С… Р°РґСЂРµСЃРѕРІ
                    withdrawModal.style.display = 'block';
                });
            }

            // Refresh history button
            const refreshHistoryBtn = document.getElementById('refresh-history-btn');
            if (refreshHistoryBtn) {
                refreshHistoryBtn.addEventListener('click', async () => {
                    refreshHistoryBtn.disabled = true;
                    refreshHistoryBtn.textContent = 'рџ”„ Loading...';
                    await loadWithdrawHistory();
                    refreshHistoryBtn.disabled = false;
                    refreshHistoryBtn.innerHTML = 'рџ”„ Refresh';
                });
            }

            // Saved wallets handlers
            const savedWalletsSelect = document.getElementById('saved-wallets-select');
            const useSelectedWalletBtn = document.getElementById('use-selected-wallet-btn');
            const deleteWalletBtn = document.getElementById('delete-wallet-btn');
            const saveWalletBtn = document.getElementById('save-wallet-btn');
            const savePhantomWalletBtn = document.getElementById('save-phantom-wallet-btn');

            if (useSelectedWalletBtn && savedWalletsSelect) {
                useSelectedWalletBtn.addEventListener('click', () => {
                    const index = savedWalletsSelect.value;
                    if (index !== '' && savedWallets[index]) {
                        const wallet = savedWallets[index];
                        walletInput.value = wallet.address;
                        withdrawWalletAddress = wallet.address;
                        updateWithdrawSummary();
                    }
                });
            }

            if (deleteWalletBtn && savedWalletsSelect) {
                deleteWalletBtn.addEventListener('click', () => {
                    const index = savedWalletsSelect.value;
                    if (index !== '' && savedWallets[index]) {
                        if (confirm(`Delete wallet ${savedWallets[index].name}?`)) {
                            savedWallets.splice(index, 1);
                            saveWallets();
                            updateSavedWalletsUI();
                            if (walletInput.value === savedWallets[index]?.address) {
                                walletInput.value = '';
                                withdrawWalletAddress = null;
                            }
                        }
                    }
                });
            }

            if (saveWalletBtn && walletInput) {
                saveWalletBtn.addEventListener('click', () => {
                    const address = walletInput.value.trim();
                    if (address && address.length >= 32) {
                        const name = prompt('Enter wallet name (optional):', `Wallet ${savedWallets.length + 1}`);
                        if (addSavedWallet(address, name)) {
                            alert('вњ… Wallet saved!');
                        } else {
                            alert('вљ пёЏ Wallet already saved');
                        }
                    } else {
                        alert('вќЊ Invalid wallet address');
                    }
                });
            }

            if (savePhantomWalletBtn) {
                savePhantomWalletBtn.addEventListener('click', () => {
                    if (withdrawWalletAddress && withdrawPhantomConnected) {
                        const name = prompt('Enter wallet name (optional):', 'Phantom Wallet');
                        if (addSavedWallet(withdrawWalletAddress, name)) {
                            alert('вњ… Phantom wallet saved!');
                        } else {
                            alert('вљ пёЏ Wallet already saved');
                        }
                    }
                });
            }

            // Close modal
            if (closeWithdraw && withdrawModal) {
                closeWithdraw.addEventListener('click', () => {
                    withdrawModal.style.display = 'none';
                });
            }

            // Connect Phantom Wallet
            if (connectPhantomBtn) {
                connectPhantomBtn.addEventListener('click', async () => {
                    try {
                        if (!window.solana || !window.solana.isPhantom) {
                            alert('вљ пёЏ Phantom Wallet not found!\n\nPlease install Phantom wallet or enter address manually.');
                            document.getElementById('open-browser-withdraw').style.display = 'block';
                            return;
                        }

                        const resp = await window.solana.connect();
                        withdrawWalletAddress = resp.publicKey.toString();
                        withdrawPhantomConnected = true;

                        document.getElementById('phantom-connect-section').style.display = 'none';
                        document.getElementById('phantom-connected').style.display = 'block';
                        document.getElementById('phantom-address').textContent = withdrawWalletAddress;
                        walletInput.value = withdrawWalletAddress;
                        walletInput.disabled = true;

                        // РЎРѕС…СЂР°РЅРёС‚СЊ Р°РґСЂРµСЃ
                        localStorage.setItem('withdraw_wallet_address', withdrawWalletAddress);

                        updateWithdrawSummary();
                    } catch (err) {
                        console.error('Phantom connection error:', err);
                        if (err.code === 4001) {
                            alert('вќЊ Connection cancelled by user');
                        } else {
                            alert('вќЊ Failed to connect Phantom: ' + err.message);
                        }
                    }
                });
            }

            // Disconnect Phantom
            if (disconnectPhantomBtn) {
                disconnectPhantomBtn.addEventListener('click', () => {
                    withdrawWalletAddress = null;
                    withdrawPhantomConnected = false;
                    document.getElementById('phantom-connect-section').style.display = 'block';
                    document.getElementById('phantom-connected').style.display = 'none';
                    walletInput.value = '';
                    walletInput.disabled = false;
                    updateWithdrawSummary();
                });
            }

            // Wallet input change
            if (walletInput) {
                walletInput.addEventListener('input', () => {
                    if (!withdrawPhantomConnected) {
                        withdrawWalletAddress = walletInput.value.trim();
                        updateWithdrawSummary();
                    }
                });
            }

            // Amount input change
            if (amountInput) {
                amountInput.addEventListener('input', updateWithdrawSummary);
            }

            // Quick amount buttons
            quickAmountBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const amount = btn.dataset.amount;
                    if (amount === 'max') {
                        const balance = gameState.tama || 0;
                        amountInput.value = Math.floor(balance);
                    } else {
                        amountInput.value = amount;
                    }
                    updateWithdrawSummary();
                });
            });

            // Confirm withdrawal - show confirmation modal first
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    showWithdrawConfirmation();
                });
            }

            // Confirmation modal handlers
            const confirmModal = document.getElementById('withdraw-confirm-modal');
            const closeConfirmBtn = document.getElementById('close-confirm-withdraw');
            const cancelWithdrawBtn = document.getElementById('cancel-withdraw-btn');
            const finalConfirmBtn = document.getElementById('final-confirm-withdraw-btn');

            if (closeConfirmBtn && confirmModal) {
                closeConfirmBtn.addEventListener('click', () => {
                    confirmModal.style.display = 'none';
                });
            }

            if (cancelWithdrawBtn && confirmModal) {
                cancelWithdrawBtn.addEventListener('click', () => {
                    confirmModal.style.display = 'none';
                });
            }

            if (finalConfirmBtn) {
                finalConfirmBtn.addEventListener('click', async () => {
                    if (confirmModal) confirmModal.style.display = 'none';
                    await processWithdrawal();
                });
            }

            // Open in browser
            if (openBrowserBtn) {
                openBrowserBtn.addEventListener('click', () => {
                    const gameUrl = window.location.href;
                    window.open(gameUrl, '_blank');
                });
            }

            // Check if Phantom is available
            if (window.solana && window.solana.isPhantom) {
                connectPhantomBtn.style.display = 'block';
            } else {
                connectPhantomBtn.style.display = 'none';
                document.getElementById('open-browser-withdraw').style.display = 'block';
            }
        }

        async function loadWithdrawBalance() {
            const balanceEl = document.getElementById('withdraw-balance');
            if (balanceEl) {
                balanceEl.textContent = formatNumber(gameState.tama || 0) + ' TAMA';
            }
        }

        async function loadSavedWalletAddress() {
            try {
                const userId = window.TELEGRAM_USER_ID;
                if (!userId) return;

                // РџРѕРїСЂРѕР±РѕРІР°С‚СЊ Р·Р°РіСЂСѓР·РёС‚СЊ РёР· localStorage
                const savedAddress = localStorage.getItem('withdraw_wallet_address');
                if (savedAddress && savedAddress.length >= 32) {
                    const walletInput = document.getElementById('withdraw-wallet-input');
                    if (walletInput && !walletInput.value) {
                        walletInput.value = savedAddress;
                        withdrawWalletAddress = savedAddress;
                        updateWithdrawSummary();
                        return;
                    }
                }

                // Р—Р°РіСЂСѓР·РёС‚СЊ РёР· Р±Р°Р·С‹ РґР°РЅРЅС‹С… (leaderboard)
                const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${userId}&select=wallet_address`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0 && data[0].wallet_address) {
                        const savedWallet = data[0].wallet_address;
                        // РџСЂРѕРІРµСЂСЏРµРј, С‡С‚Рѕ СЌС‚Рѕ РЅРµ placeholder
                        if (savedWallet && savedWallet.length >= 32 && !savedWallet.startsWith('telegram_')) {
                            const walletInput = document.getElementById('withdraw-wallet-input');
                            if (walletInput) {
                                walletInput.value = savedWallet;
                                withdrawWalletAddress = savedWallet;
                                updateWithdrawSummary();
                                // РЎРѕС…СЂР°РЅРёС‚СЊ РІ localStorage
                                localStorage.setItem('withdraw_wallet_address', savedWallet);
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn('Failed to load saved wallet address:', err);
            }
        }

        async function loadWithdrawHistory() {
            try {
                const userId = window.TELEGRAM_USER_ID;
                if (!userId) {
                    console.warn('No user ID for withdrawal history');
                    return;
                }

                const historyDiv = document.getElementById('withdraw-history');
                if (!historyDiv) {
                    console.warn('Withdraw history div not found');
                    return;
                }

                // [cleaned]
                const apiBase = window.TAMA_API_BASE || 'https://api.solanatamagotchi.com/api/tama';

                historyDiv.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; color: rgba(255,255,255,0.6);">
                        <div class="spinner" style="border: 4px solid rgba(138, 201, 38, 0.3); border-top: 4px solid #8AC926; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
                        <div style="font-size: 16px;">Loading history...</div>
                    </div>
                `;

                const response = await fetch(`${apiBase}/withdrawal/history?telegram_id=${userId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // [cleaned]

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Withdrawal history error:', errorText);
                    let errorMsg = 'Failed to load history';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMsg = errorJson.error || errorMsg;
                    } catch (e) {
                        // Not JSON, use text
                    }
                    historyDiv.innerHTML = `<div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.6);">${errorMsg}</div>`;
                    return;
                }

                const result = await response.json();
                // [cleaned]

                // API РІРѕР·РІСЂР°С‰Р°РµС‚ { success: true, withdrawals: [...] }
                const withdrawals = result.withdrawals || result.data || [];

                if (!Array.isArray(withdrawals)) {
                    console.error('Invalid withdrawals format:', withdrawals);
                    historyDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.6);">Invalid response format</div>';
                    return;
                }

                if (withdrawals.length === 0) {
                    historyDiv.innerHTML = `
                        <div style="text-align: center; padding: 40px 20px; color: rgba(255,255,255,0.6);">
                            <div style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;">рџ“њ</div>
                            <div style="font-size: 18px; margin-bottom: 10px; color: rgba(255,255,255,0.8);">No withdrawals yet</div>
                            <div style="font-size: 14px; color: rgba(255,255,255,0.5);">Make your first withdrawal to see history here!</div>
                        </div>
                    `;
                    return;
                }

                historyDiv.innerHTML = withdrawals.map((w, index) => {
                    const date = new Date(w.created_at || w.completed_at);
                    const dateStr = date.toLocaleString('ru-RU', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    // API РІРѕР·РІСЂР°С‰Р°РµС‚ amount_sent (СѓР¶Рµ СЃ РІС‹С‡РµС‚РѕРј РєРѕРјРёСЃСЃРёРё) РёР»Рё amount - fee
                    const amount = w.amount_sent || w.net_amount || (Math.abs(w.amount || 0) - (w.fee || 0));
                    const fee = w.fee || Math.floor((w.amount || amount) * 0.05);
                    const totalAmount = amount + fee;
                    const status = w.status || 'completed';
                    const signature = w.signature || w.tx_signature || w.transaction_signature;
                    const wallet = w.wallet_address || w.destination_wallet || 'N/A';

                    const statusColor = status === 'completed' ? '#10b981' : status === 'pending' ? '#fbbf24' : '#ef4444';
                    const statusEmoji = status === 'completed' ? 'вњ…' : status === 'pending' ? 'вЏі' : 'вќЊ';

                    return `
                        <div style="padding: 20px; margin-bottom: 15px; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%); border-radius: 15px; border: 2px solid rgba(138, 201, 38, 0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                                <div>
                                    <div style="font-weight: bold; color: #8AC926; font-size: 24px; margin-bottom: 5px;">${formatNumber(amount)} TAMA</div>
                                    <div style="font-size: 14px; color: rgba(255,255,255,0.6);">
                                        Fee: ${formatNumber(fee)} TAMA (Total: ${formatNumber(totalAmount)} TAMA)
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 14px; color: ${statusColor}; font-weight: bold; margin-bottom: 5px;">
                                        ${statusEmoji} ${status.charAt(0).toUpperCase() + status.slice(1)}
                                    </div>
                                    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">
                                        #${withdrawals.length - index}
                                    </div>
                                </div>
                            </div>
                            <div style="padding: 12px; background: rgba(0,0,0,0.2); border-radius: 10px; margin-bottom: 10px;">
                                <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 5px;">рџ“… Date:</div>
                                <div style="font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 500;">${dateStr}</div>
                            </div>
                            ${wallet && wallet !== 'N/A' ? `
                                <div style="padding: 12px; background: rgba(0,0,0,0.2); border-radius: 10px; margin-bottom: 10px;">
                                    <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 5px;">рџ‘› Wallet:</div>
                                    <div style="font-size: 12px; font-family: monospace; color: #8AC926; word-break: break-all;">${wallet}</div>
                                </div>
                            ` : ''}
                            ${signature ? `
                                <div style="padding: 12px; background: rgba(138, 201, 38, 0.1); border-radius: 10px; border: 1px solid rgba(138, 201, 38, 0.3);">
                                    <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 5px;">рџ”— Transaction:</div>
                                    <a href="https://solscan.io/tx/${signature}?cluster=devnet" target="_blank"
                                       style="font-size: 12px; font-family: monospace; color: #8AC926; text-decoration: none; word-break: break-all; display: block; padding: 8px; background: rgba(138, 201, 38, 0.1); border-radius: 5px; transition: all 0.3s;"
                                       onmouseover="this.style.background='rgba(138, 201, 38, 0.2)'; this.style.transform='translateX(5px)';"
                                       onmouseout="this.style.background='rgba(138, 201, 38, 0.1)'; this.style.transform='translateX(0)';">
                                        ${signature.substring(0, 20)}...${signature.substring(signature.length - 8)}
                                        <span style="margin-left: 5px;">в†—</span>
                                    </a>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('');
            } catch (err) {
                console.error('Failed to load withdrawal history:', err);
                const historyDiv = document.getElementById('withdraw-history');
                if (historyDiv) {
                    historyDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.6);">Failed to load history</div>';
                }
            }
        }

        function updateWithdrawSummary() {
            const amount = parseInt(document.getElementById('withdraw-amount-input').value) || 0;
            const wallet = withdrawWalletAddress || document.getElementById('withdraw-wallet-input').value.trim();
            const summaryDiv = document.getElementById('withdraw-summary');
            const confirmBtn = document.getElementById('confirm-withdraw-btn');
            const balance = gameState.tama || 0;

            // РџСЂРѕРІРµСЂРєР° Р±Р°Р»Р°РЅСЃР°
            if (amount > balance) {
                summaryDiv.style.display = 'block';
                summaryDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                summaryDiv.style.border = '2px solid #ef4444';
                summaryDiv.innerHTML = `
                    <div style="color: #ef4444; font-weight: bold;">вќЊ Insufficient Balance!</div>
                    <div style="margin-top: 5px; font-size: 14px;">You have: ${formatNumber(balance)} TAMA</div>
                    <div style="font-size: 14px;">Requested: ${formatNumber(amount)} TAMA</div>
                `;
                confirmBtn.disabled = true;
                return;
            }

            if (amount >= 1000 && wallet && wallet.length >= 32) {
                const fee = Math.floor(amount * 0.05);
                const receive = amount - fee;

                document.getElementById('summary-amount').textContent = formatNumber(amount) + ' TAMA';
                document.getElementById('summary-fee').textContent = '-' + formatNumber(fee) + ' TAMA';
                document.getElementById('summary-receive').textContent = formatNumber(receive) + ' TAMA';

                summaryDiv.style.display = 'block';
                summaryDiv.style.background = 'rgba(255,255,255,0.05)';
                summaryDiv.style.border = '2px solid rgba(138, 201, 38, 0.2)';
                summaryDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>Amount:</span>
                        <span id="summary-amount" style="font-weight: bold;"></span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #ef4444;">
                        <span>Fee (5%):</span>
                        <span id="summary-fee" style="font-weight: bold;"></span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 18px; font-weight: bold; color: #8AC926;">
                        <span>You will receive:</span>
                        <span id="summary-receive"></span>
                    </div>
                `;

                // Update values
                document.getElementById('summary-amount').textContent = formatNumber(amount) + ' TAMA';
                document.getElementById('summary-fee').textContent = '-' + formatNumber(fee) + ' TAMA';
                document.getElementById('summary-receive').textContent = formatNumber(receive) + ' TAMA';

                confirmBtn.disabled = false;
            } else {
                summaryDiv.style.display = 'none';
                confirmBtn.disabled = true;
            }
        }

        function showWithdrawConfirmation() {
            const amount = parseInt(document.getElementById('withdraw-amount-input').value) || 0;
            const wallet = withdrawWalletAddress || document.getElementById('withdraw-wallet-input').value.trim();
            const balance = gameState.tama || 0;

            // Validation
            if (amount < 1000) {
                alert('вќЊ Minimum withdrawal is 1,000 TAMA');
                return;
            }

            if (!wallet || wallet.length < 32) {
                alert('вќЊ Invalid wallet address');
                return;
            }

            if (amount > balance) {
                alert(`вќЊ Insufficient balance! You have ${formatNumber(balance)} TAMA`);
                return;
            }

            // Calculate fees
            const fee = Math.floor(amount * 0.05);
            const receive = amount - fee;

            // Update confirmation modal
            document.getElementById('confirm-amount').textContent = formatNumber(amount);
            document.getElementById('confirm-fee').textContent = formatNumber(fee);
            document.getElementById('confirm-receive').textContent = formatNumber(receive);
            document.getElementById('confirm-wallet').textContent = wallet;

            // Show modal
            const confirmModal = document.getElementById('withdraw-confirm-modal');
            if (confirmModal) {
                confirmModal.style.display = 'block';
            }
        }

        async function processWithdrawal() {
            try {
                const amount = parseInt(document.getElementById('withdraw-amount-input').value);
                const wallet = withdrawWalletAddress || document.getElementById('withdraw-wallet-input').value.trim();
                const userId = window.TELEGRAM_USER_ID;

                if (!userId) {
                    alert('вќЊ User ID not found. Please login first.');
                    return;
                }

                if (amount < 1000) {
                    alert('вќЊ Minimum withdrawal is 1,000 TAMA');
                    return;
                }

                if (!wallet || wallet.length < 32) {
                    alert('вќЊ Invalid wallet address');
                    return;
                }

                if (amount > gameState.tama) {
                    alert(`вќЊ Insufficient balance! You have ${formatNumber(gameState.tama)} TAMA`);
                    return;
                }

                // Disable button and show progress
                const confirmBtn = document.getElementById('confirm-withdraw-btn');
                confirmBtn.disabled = true;
                confirmBtn.textContent = 'вЏі Processing...';

                // Hide status, show progress
                const statusDiv = document.getElementById('withdraw-status');
                const progressDiv = document.getElementById('withdraw-progress');
                const progressFill = document.getElementById('withdraw-progress-fill');
                const progressText = document.getElementById('withdraw-progress-text');

                statusDiv.style.display = 'none';
                progressDiv.style.display = 'block';
                progressFill.style.width = '0%';
                progressText.textContent = 'Validating request...';

                // Show step 1
                document.getElementById('step-1').style.display = 'block';
                document.getElementById('step-2').style.display = 'none';
                document.getElementById('step-3').style.display = 'none';
                progressFill.style.width = '20%';

                // Step 2: Processing transaction
                setTimeout(() => {
                    progressFill.style.width = '50%';
                    progressText.textContent = 'Processing transaction...';
                    document.getElementById('step-1').style.display = 'none';
                    document.getElementById('step-2').style.display = 'block';
                }, 500);

                // Call API
                const apiBase = window.TAMA_API_BASE || 'https://api.solanatamagotchi.com/api/tama';
                const response = await fetch(`${apiBase}/withdrawal/request`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        telegram_id: userId.toString(),
                        wallet_address: wallet,
                        amount: amount
                    })
                });

                // Step 3: Confirming on blockchain
                progressFill.style.width = '80%';
                progressText.textContent = 'Confirming on blockchain...';
                document.getElementById('step-2').style.display = 'none';
                document.getElementById('step-3').style.display = 'block';

                const result = await response.json();

                // Complete progress
                progressFill.style.width = '100%';

                if (result.success) {
                    // Success - hide progress, show status
                    setTimeout(() => {
                        progressDiv.style.display = 'none';
                        statusDiv.style.display = 'block';
                    }, 500);

                    const netAmount = result.data?.net_amount || (amount - Math.floor(amount * 0.05));
                    const signature = result.data?.signature;

                    statusDiv.style.background = 'rgba(16, 185, 129, 0.1)';
                    statusDiv.style.border = '2px solid #10b981';
                    statusDiv.style.color = '#10b981';
                    statusDiv.innerHTML = `
                        <div style="font-weight: bold; margin-bottom: 10px; font-size: 18px;">вњ… Withdrawal Successful!</div>
                        <div style="font-size: 16px; margin-bottom: 10px;">рџ’° Sent: <strong>${formatNumber(netAmount)} TAMA</strong></div>
                        <div style="font-size: 14px; margin-bottom: 10px; color: rgba(255,255,255,0.8);">
                            Fee: ${formatNumber(Math.floor(amount * 0.05))} TAMA (5%)
                        </div>
                        ${signature ? `
                            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                                <a href="https://solscan.io/tx/${signature}?cluster=devnet" target="_blank"
                                   style="color: #8AC926; text-decoration: none; font-weight: bold; display: inline-block; padding: 8px 15px; background: rgba(138, 201, 38, 0.2); border-radius: 5px;">
                                    рџ”— View on Solscan
                                </a>
                            </div>
                        ` : ''}
                    `;

                    // Show success message in game
                    showMessage(`вњ… Withdrawal successful! ${formatNumber(netAmount)} TAMA sent to wallet!`);

                    // рџЋµ Play success sound
                    playWithdrawalSuccessSound();

                    // РЎРѕС…СЂР°РЅРёС‚СЊ Р°РґСЂРµСЃ РєРѕС€РµР»СЊРєР° РґР»СЏ Р±СѓРґСѓС‰РёС… РІС‹РІРѕРґРѕРІ
                    if (wallet && wallet.length >= 32) {
                        localStorage.setItem('withdraw_wallet_address', wallet);
                        // РўР°РєР¶Рµ СЃРѕС…СЂР°РЅРёС‚СЊ РІ Р±Р°Р·Сѓ РґР°РЅРЅС‹С…
                        try {
                            const saveResponse = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?telegram_id=eq.${userId}`, {
                                method: 'PATCH',
                                headers: {
                                    'apikey': SUPABASE_ANON_KEY,
                                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                                    'Content-Type': 'application/json',
                                    'Prefer': 'return=minimal'
                                },
                                body: JSON.stringify({
                                    wallet_address: wallet
                                })
                            });
                            if (saveResponse.ok) {
                                // [cleaned]
                            }
                        } catch (e) {
                            console.warn('Failed to save wallet to database:', e);
                        }
                    }

                    // Update balance
                    gameState.tama -= amount;
                    updateUI();
                    await loadWithdrawBalance();
                    // Reload history after a short delay to ensure transaction is saved
                    setTimeout(async () => {
                        await loadWithdrawHistory();
                    }, 2000);

                    // Reset form after 5 seconds (РЅРѕ СЃРѕС…СЂР°РЅСЏРµРј Р°РґСЂРµСЃ)
                    setTimeout(() => {
                        document.getElementById('withdraw-amount-input').value = '';
                        // РќР• РѕС‡РёС‰Р°РµРј Р°РґСЂРµСЃ - РѕРЅ СЃРѕС…СЂР°РЅРµРЅ
                        withdrawPhantomConnected = false;
                        document.getElementById('phantom-connect-section').style.display = 'block';
                        document.getElementById('phantom-connected').style.display = 'none';
                        document.getElementById('withdraw-wallet-input').disabled = false;
                        statusDiv.style.display = 'none';
                        updateWithdrawSummary();
                    }, 5000);
                } else {
                    // Error - hide progress, show error
                    progressDiv.style.display = 'none';
                    statusDiv.style.display = 'block';
                    statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                    statusDiv.style.border = '2px solid #ef4444';
                    statusDiv.style.color = '#ef4444';
                    statusDiv.innerHTML = `вќЊ Error: ${result.error || 'Unknown error'}`;
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = 'рџ’ё Confirm Withdrawal';
                }
            } catch (err) {
                console.error('Withdrawal error:', err);
                const progressDiv = document.getElementById('withdraw-progress');
                const statusDiv = document.getElementById('withdraw-status');
                progressDiv.style.display = 'none';
                statusDiv.style.display = 'block';
                statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                statusDiv.style.border = '2px solid #ef4444';
                statusDiv.style.color = '#ef4444';
                statusDiv.innerHTML = `вќЊ Error: ${err.message}`;

                const confirmBtn = document.getElementById('confirm-withdraw-btn');
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'рџ’ё Confirm Withdrawal';
            }
        }

        function getNFTEmoji(petType) {
            const emojiMap = {
                'cat': 'рџђ±',
                'dog': 'рџђ¶',
                'dragon': 'рџђ‰',
                'fox': 'рџ¦Љ',
                'bear': 'рџђ»',
                'rabbit': 'рџђ°',
                'panda': 'рџђј',
                'lion': 'рџ¦Ѓ',
                'unicorn': 'рџ¦„',
                'wolf': 'рџђє'
            };
            return emojiMap[petType] || 'рџђѕ';
        }

        async function mintNewNFT() {
            try {
                const userId = window.TELEGRAM_USER_ID;
                if (!userId) {
                    alert('вќЊ User ID not found');
                    return;
                }

                if (!walletConnected) {
                    alert('вќЊ Connect wallet first!');
                    return;
                }

                if (gameState.tama < 1000) {
                    alert('вќЊ Need 1000 TAMA to mint! You have: ' + gameState.tama);
                    return;
                }

                // Deduct TAMA
                gameState.tama -= 1000;
                updateTamaDisplay();
                triggerAutoSave();

                // Random NFT attributes
                const petTypes = ['cat', 'dog', 'dragon', 'fox', 'bear', 'rabbit', 'panda', 'lion', 'unicorn', 'wolf'];
                const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
                const randomPet = petTypes[Math.floor(Math.random() * petTypes.length)];
                const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];

                // Save to Supabase
                const response = await fetch(`${SUPABASE_URL}/rest/v1/user_nfts`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        telegram_id: userId,
                        wallet_address: walletAddress,
                        pet_type: randomPet,
                        rarity: randomRarity,
                        mint_address: 'MOCK_' + Date.now(),
                        cost_tama: 1000,
                        cost_sol: 0
                    })
                });

                if (response.ok) {
                    alert(`рџЋ‰ NFT Minted! ${getNFTEmoji(randomPet)} ${randomPet.toUpperCase()} - ${randomRarity}`);
                    await loadNFTCollection();
                } else {
                    alert('вќЊ Mint failed. Try again.');
                    gameState.tama += 1000; // Refund
                    updateTamaDisplay();
                }
            } catch (err) {
                console.error('вќЊ Mint error:', err);
                alert('вќЊ Mint error: ' + err.message);
                gameState.tama += 1000; // Refund
                updateTamaDisplay();
            }
        }


