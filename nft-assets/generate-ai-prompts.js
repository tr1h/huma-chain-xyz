/**
 * Генератор промптов для AI (Leonardo.ai, Midjourney, DALL-E)
 * Создает промпты для всех комбинаций NFT
 */

const TIERS = ['Bronze', 'Silver', 'Gold'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
const PET_TYPES = ['Cat', 'Dog', 'Dragon', 'Fox', 'Bear', 'Rabbit', 'Panda', 'Tiger', 'Lion', 'Wolf'];

// Стили для каждого tier
const TIER_STYLES = {
    Bronze: {
        colors: 'bronze/copper color scheme',
        detail: 'simple design',
        style: 'retro 8-bit game style',
        aesthetic: '8-bit aesthetic',
        background: 'white background'
    },
    Silver: {
        colors: 'silver/metallic color scheme',
        detail: 'medium detail',
        style: 'retro 16-bit game style',
        aesthetic: '16-bit aesthetic',
        background: 'gradient background'
    },
    Gold: {
        colors: 'gold/luxury color scheme',
        detail: 'high detail',
        style: 'premium pixel art style',
        aesthetic: 'modern pixel art',
        background: 'luxury background with effects'
    }
};

// Эффекты для каждой редкости
const RARITY_EFFECTS = {
    Common: 'simple, basic colors, no special effects',
    Uncommon: 'slight glow, better colors, subtle shine',
    Rare: 'glowing effects, special details, magical aura',
    Epic: 'particle effects, unique design, strong glow, sparkles',
    Legendary: 'maximum effects, legendary aura, unique pose, particle effects, glowing halo, epic status'
};

/**
 * Генерирует промпт для AI
 */
function generatePrompt(tier, rarity, petType) {
    const tierStyle = TIER_STYLES[tier];
    const rarityEffect = RARITY_EFFECTS[rarity];
    
    return `A cute pixel art Tamagotchi pet, ${petType.toLowerCase()}, ${tierStyle.colors}, ${tierStyle.detail}, ${tierStyle.style}, ${tierStyle.aesthetic}, ${rarity.toLowerCase()} rarity with ${rarityEffect}, ${tierStyle.background}, 1000x1000px, clean illustration, front view, happy expression, game character, NFT art style`;
}

/**
 * Генерирует упрощенный промпт (без pet type)
 */
function generateSimplePrompt(tier, rarity) {
    const tierStyle = TIER_STYLES[tier];
    const rarityEffect = RARITY_EFFECTS[rarity];
    
    return `A cute pixel art Tamagotchi pet, ${tierStyle.colors}, ${tierStyle.detail}, ${tierStyle.style}, ${tierStyle.aesthetic}, ${rarity.toLowerCase()} rarity with ${rarityEffect}, ${tierStyle.background}, 1000x1000px, clean illustration, front view, happy expression, game character, NFT art style`;
}

/**
 * Генерирует все промпты
 */
function generateAllPrompts(simple = false) {
    const prompts = [];
    
    if (simple) {
        // Упрощенная версия: 3 tiers × 5 rarities = 15 промптов
        console.log('═══════════════════════════════════════════════════════');
        console.log('📝 SIMPLE VERSION: 15 Prompts (3 tiers × 5 rarities)');
        console.log('═══════════════════════════════════════════════════════\n');
        
        for (const tier of TIERS) {
            for (const rarity of RARITIES) {
                const prompt = generateSimplePrompt(tier, rarity);
                const filename = `${tier.toLowerCase()}-${rarity.toLowerCase()}.png`;
                
                prompts.push({
                    tier,
                    rarity,
                    filename,
                    prompt
                });
                
                console.log(`📄 ${filename}`);
                console.log(`   ${prompt}\n`);
            }
        }
    } else {
        // Полная версия: 3 tiers × 5 rarities × 10 pets = 150 промптов
        console.log('═══════════════════════════════════════════════════════');
        console.log('📝 FULL VERSION: 150 Prompts (3 tiers × 5 rarities × 10 pets)');
        console.log('═══════════════════════════════════════════════════════\n');
        
        for (const tier of TIERS) {
            for (const rarity of RARITIES) {
                for (const petType of PET_TYPES) {
                    const prompt = generatePrompt(tier, rarity, petType);
                    const filename = `${tier.toLowerCase()}-${petType.toLowerCase()}-${rarity.toLowerCase()}.png`;
                    
                    prompts.push({
                        tier,
                        rarity,
                        petType,
                        filename,
                        prompt
                    });
                }
            }
        }
        
        // Группируем по tier для удобства
        for (const tier of TIERS) {
            console.log(`\n🎨 ${tier} Tier:\n`);
            const tierPrompts = prompts.filter(p => p.tier === tier);
            for (const p of tierPrompts) {
                console.log(`📄 ${p.filename}`);
                console.log(`   ${p.prompt}\n`);
            }
        }
    }
    
    return prompts;
}

/**
 * Сохраняет промпты в JSON файл
 */
function savePromptsToJSON(prompts, filename = 'ai-prompts.json') {
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, filename);
    fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2));
    console.log(`\n✅ Prompts saved to: ${outputPath}`);
}

/**
 * Создает CSV файл для Leonardo.ai
 */
function savePromptsToCSV(prompts, filename = 'ai-prompts.csv') {
    const fs = require('fs');
    const path = require('path');
    
    let csv = 'Filename,Prompt\n';
    for (const p of prompts) {
        csv += `"${p.filename}","${p.prompt.replace(/"/g, '""')}"\n`;
    }
    
    const outputPath = path.join(__dirname, filename);
    fs.writeFileSync(outputPath, csv);
    console.log(`✅ CSV saved to: ${outputPath}`);
}

// Main
if (require.main === module) {
    const args = process.argv.slice(2);
    const simple = args.includes('--simple') || args.includes('-s');
    
    console.log('\n🎨 NFT Image Generation Prompts Generator\n');
    
    const prompts = generateAllPrompts(simple);
    
    console.log(`\n📊 Total prompts: ${prompts.length}`);
    
    // Сохраняем в JSON
    savePromptsToJSON(prompts, simple ? 'ai-prompts-simple.json' : 'ai-prompts-full.json');
    
    // Сохраняем в CSV (для Leonardo.ai)
    savePromptsToCSV(prompts, simple ? 'ai-prompts-simple.csv' : 'ai-prompts-full.csv');
    
    console.log('\n💡 Next steps:');
    console.log('1. Open Leonardo.ai or Midjourney');
    console.log('2. Use the prompts from the CSV file');
    console.log('3. Generate all images');
    console.log('4. Download as PNG (1000x1000px)');
    console.log('5. Name files according to the CSV');
    console.log('6. Run: node upload-to-ipfs.js\n');
}

module.exports = {
    generatePrompt,
    generateSimplePrompt,
    generateAllPrompts,
    TIERS,
    RARITIES,
    PET_TYPES
};






