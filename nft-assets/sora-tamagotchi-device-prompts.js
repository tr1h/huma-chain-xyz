/**
 * SORA Prompts для NFT изображений в стиле КЛАССИЧЕСКИХ TAMAGOTCHI УСТРОЙСТВ
 * Стиль: Ретро устройства с экраном, кнопками, корпусом
 * Это УНИКАЛЬНАЯ ФИШКА проекта!
 */

const TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

// Стили для каждого tier (цвета корпуса устройства)
const TIER_DEVICE_STYLES = {
    Bronze: {
        bodyColor: 'orange-brown, copper, bronze',
        screenColor: 'light green pixelated screen',
        buttonsColor: 'darker orange-brown round buttons',
        style: 'retro 8-bit Tamagotchi device',
        finish: 'matte finish, simple design'
    },
    Silver: {
        bodyColor: 'silver, metallic gray, chrome',
        screenColor: 'light blue pixelated screen',
        buttonsColor: 'dark silver round buttons',
        style: 'retro 16-bit Tamagotchi device',
        finish: 'shiny metallic finish, medium detail'
    },
    Gold: {
        bodyColor: 'gold, luxury yellow-gold, premium',
        screenColor: 'bright green pixelated screen',
        buttonsColor: 'dark gold round buttons',
        style: 'premium Tamagotchi device',
        finish: 'glossy gold finish, high detail, luxury'
    },
    Platinum: {
        bodyColor: 'platinum, silver-white, metallic platinum, premium',
        screenColor: 'bright cyan pixelated screen',
        buttonsColor: 'dark platinum round buttons',
        style: 'ultra-premium Tamagotchi device',
        finish: 'glossy platinum finish, maximum detail, ultra-luxury'
    },
    Diamond: {
        bodyColor: 'diamond, crystal clear, prismatic, rainbow reflections, ultra-premium',
        screenColor: 'rainbow holographic pixelated screen',
        buttonsColor: 'diamond-cut crystal buttons',
        style: 'legendary Tamagotchi device',
        finish: 'crystal clear finish, prismatic effects, rainbow reflections, maximum luxury'
    }
};

// Эффекты для каждой редкости (на экране и корпусе)
const RARITY_EFFECTS = {
    Common: {
        screen: 'simple pixelated pet face, basic colors, no special effects',
        body: 'plain device, no decorations',
        animation: 'completely static device'
    },
    Uncommon: {
        screen: 'happy pixelated pet face, better colors, slight glow on screen',
        body: 'small star decoration above keychain loop',
        animation: 'very subtle screen glow pulse'
    },
    Rare: {
        screen: 'happy pixelated pet face, glowing screen, magical aura around pet',
        body: 'decorative elements, subtle shine on body',
        animation: 'gentle glowing pulse on screen and buttons'
    },
    Epic: {
        screen: 'happy pixelated pet face, bright glowing screen, particle effects around pet',
        body: 'decorative patterns, sparkles on body, premium look',
        animation: 'animated particles on screen, glowing effects'
    },
    Legendary: {
        screen: 'happy pixelated pet face, maximum glow, legendary aura, particle effects',
        body: 'luxury decorations, golden accents, premium finish, special design',
        animation: 'dramatic lighting, legendary aura effects, animated particles'
    }
};

/**
 * Генерирует SORA промпт для Tamagotchi устройства
 */
function generateTamagotchiDevicePrompt(tier, rarity) {
    const deviceStyle = TIER_DEVICE_STYLES[tier];
    const rarityEffect = RARITY_EFFECTS[rarity];
    
    return `A cute retro pixel art Tamagotchi virtual pet device, egg-shaped body in ${deviceStyle.bodyColor} colors, ${deviceStyle.finish}. The device has a ${deviceStyle.screenColor} displaying ${rarityEffect.screen}. Below the screen are ${deviceStyle.buttonsColor}. ${rarityEffect.body}. The device has a small keychain loop at the top. ${deviceStyle.style}, ${rarity.toLowerCase()} rarity with ${rarityEffect.animation}. White background, 1000x1000px, clean illustration, front view, isometric perspective, game device aesthetic, NFT art style. ${rarity === 'Common' ? 'Completely static device, no animation, perfect for extracting first frame as image.' : 'Very subtle animation: only ' + (rarity === 'Uncommon' ? 'gentle screen glow' : rarity === 'Rare' ? 'glowing pulse on screen' : rarity === 'Epic' ? 'particle effects on screen' : 'legendary aura effects') + ', perfect for extracting first frame as high-quality static image.'} Duration: 1-2 seconds, first frame is the main image.`;
}

/**
 * Генерирует все промпты для Tamagotchi устройств
 */
function generateAllTamagotchiPrompts() {
    const prompts = [];
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎮 SORA Prompts для TAMAGOTCHI УСТРОЙСТВ (15 промптов)');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('💡 УНИКАЛЬНАЯ ФИШКА: Классические Tamagotchi устройства!');
    console.log('💡 Стиль: Ретро устройства с экраном, кнопками, корпусом\n');
    
    for (const tier of TIERS) {
        for (const rarity of RARITIES) {
            const prompt = generateTamagotchiDevicePrompt(tier, rarity);
            const filename = `${tier.toLowerCase()}-${rarity.toLowerCase()}.png`;
            
            prompts.push({
                tier,
                rarity,
                filename,
                prompt,
                duration: '1-2 seconds',
                note: rarity === 'Common' ? 'Static device - use first frame' : 'Subtle animation - use first frame',
                style: 'Tamagotchi device with screen and buttons'
            });
            
            console.log(`📄 ${filename}`);
            console.log(`   ${prompt}\n`);
        }
    }
    
    return prompts;
}

/**
 * Сохраняет промпты
 */
function savePrompts(prompts) {
    const fs = require('fs');
    const path = require('path');
    
    // JSON
    const jsonPath = path.join(__dirname, 'sora-tamagotchi-device-prompts.json');
    fs.writeFileSync(jsonPath, JSON.stringify(prompts, null, 2));
    console.log(`✅ JSON saved to: ${jsonPath}`);
    
    // CSV
    let csv = 'Filename,Prompt,Duration,Note,Style\n';
    for (const p of prompts) {
        csv += `"${p.filename}","${p.prompt.replace(/"/g, '""')}","${p.duration}","${p.note}","${p.style}"\n`;
    }
    const csvPath = path.join(__dirname, 'sora-tamagotchi-device-prompts.csv');
    fs.writeFileSync(csvPath, csv);
    console.log(`✅ CSV saved to: ${csvPath}`);
    
    // Markdown
    let md = `# 🎮 SORA Prompts для Tamagotchi Устройств\n\n`;
    md += `## 🎯 УНИКАЛЬНАЯ ФИШКА ПРОЕКТА!\n\n`;
    md += `Это **классические Tamagotchi устройства** в ретро стиле:\n`;
    md += `- 🎮 Яйцевидный корпус с экраном\n`;
    md += `- 🔘 Кнопки управления\n`;
    md += `- 🔗 Кольцо для брелока\n`;
    md += `- 📺 Пиксельный экран с питомцем\n\n`;
    md += `**Это выделит ваш проект среди других NFT!**\n\n`;
    md += `## 📋 Инструкция:\n\n`;
    md += `1. SORA генерирует видео (1-2 секунды)\n`;
    md += `2. Извлеките первый кадр как изображение\n`;
    md += `3. Сохраните как PNG (1000x1000px)\n\n`;
    md += `## 🎨 Параметры:\n\n`;
    md += `- **Duration:** 1-2 seconds\n`;
    md += `- **Aspect Ratio:** 1:1 (square)\n`;
    md += `- **Resolution:** 1000x1000px\n`;
    md += `- **Style:** Retro Tamagotchi device\n\n`;
    md += `## 📝 Промпты:\n\n`;
    
    for (const p of prompts) {
        md += `### ${p.tier} - ${p.rarity}\n\n`;
        md += `**Filename:** \`${p.filename}\`\n\n`;
        md += `**Prompt:**\n\`\`\`\n${p.prompt}\n\`\`\`\n\n`;
        md += `**Note:** ${p.note}\n\n`;
        md += `---\n\n`;
    }
    
    const mdPath = path.join(__dirname, 'SORA_TAMAGOTCHI_DEVICE_INSTRUCTIONS.md');
    fs.writeFileSync(mdPath, md);
    console.log(`✅ Markdown saved to: ${mdPath}`);
}

// Main
if (require.main === module) {
    console.log('\n🎮 SORA Tamagotchi Device Prompts Generator\n');
    
    const prompts = generateAllTamagotchiPrompts();
    
    console.log(`\n📊 Total prompts: ${prompts.length}`);
    
    savePrompts(prompts);
    
    console.log('\n💡 Next steps:');
    console.log('1. Open SORA');
    console.log('2. Use prompts from CSV file');
    console.log('3. Set duration: 1-2 seconds');
    console.log('4. Set aspect ratio: 1:1 (square)');
    console.log('5. Generate videos');
    console.log('6. Extract first frame from each video');
    console.log('7. Save as PNG (1000x1000px)\n');
    
    console.log('🎯 УНИКАЛЬНОСТЬ:');
    console.log('✅ Классические Tamagotchi устройства');
    console.log('✅ Ретро стиль с экраном и кнопками');
    console.log('✅ Выделит проект среди других NFT');
    console.log('✅ Ностальгия + современный NFT\n');
}

module.exports = {
    generateTamagotchiDevicePrompt,
    generateAllTamagotchiPrompts,
    TIERS,
    RARITIES
};

