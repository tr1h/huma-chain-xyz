/**
 * SORA Prompts для генерации NFT изображений
 * SORA генерирует видео, но можно использовать первый кадр как изображение
 * Или генерировать очень короткое видео (1-2 секунды) с минимальной анимацией
 */

const TIERS = ['Bronze', 'Silver', 'Gold'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

// Стили для каждого tier
const TIER_STYLES = {
    Bronze: {
        colors: 'bronze/copper color scheme',
        detail: 'simple design',
        style: 'retro 8-bit game style',
        aesthetic: '8-bit pixel art aesthetic',
        background: 'white background'
    },
    Silver: {
        colors: 'silver/metallic color scheme',
        detail: 'medium detail',
        style: 'retro 16-bit game style',
        aesthetic: '16-bit pixel art aesthetic',
        background: 'gradient background with subtle animation'
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
    Common: 'simple, basic colors, no special effects, static pose',
    Uncommon: 'slight glow, better colors, subtle shine, minimal breathing animation',
    Rare: 'glowing effects, special details, magical aura, gentle pulsing glow',
    Epic: 'particle effects, unique design, strong glow, sparkles, animated particles',
    Legendary: 'maximum effects, legendary aura, unique pose, particle effects, glowing halo, epic status, dramatic lighting'
};

/**
 * Генерирует SORA промпт для NFT изображения
 * SORA генерирует видео, поэтому добавляем минимальную анимацию
 */
function generateSoraPrompt(tier, rarity) {
    const tierStyle = TIER_STYLES[tier];
    const rarityEffect = RARITY_EFFECTS[rarity];
    
    // Для статичных изображений используем очень короткое видео (1-2 секунды)
    // с минимальной анимацией (только эффекты редкости)
    return `A cute pixel art Tamagotchi pet, ${tierStyle.colors}, ${tierStyle.detail}, ${tierStyle.style}, ${tierStyle.aesthetic}, ${rarity.toLowerCase()} rarity with ${rarityEffect}, ${tierStyle.background}, 1000x1000px, clean illustration, front view, happy expression, game character, NFT art style. ${rarity === 'Common' ? 'Completely static, no animation, perfect for extracting first frame as image.' : 'Very subtle animation: only ' + (rarity === 'Uncommon' ? 'gentle breathing' : rarity === 'Rare' ? 'glowing pulse' : rarity === 'Epic' ? 'particle effects' : 'legendary aura effects') + ', perfect for extracting first frame as high-quality static image.'} Duration: 1-2 seconds, first frame is the main image.`;
}

/**
 * Генерирует все SORA промпты
 */
function generateAllSoraPrompts() {
    const prompts = [];
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎬 SORA Prompts для NFT изображений (15 промптов)');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('💡 ВАЖНО: SORA генерирует видео, но можно использовать первый кадр как изображение!');
    console.log('💡 Для статичных изображений используйте очень короткое видео (1-2 секунды)\n');
    
    for (const tier of TIERS) {
        for (const rarity of RARITIES) {
            const prompt = generateSoraPrompt(tier, rarity);
            const filename = `${tier.toLowerCase()}-${rarity.toLowerCase()}.png`;
            
            prompts.push({
                tier,
                rarity,
                filename,
                prompt,
                duration: '1-2 seconds',
                note: rarity === 'Common' ? 'Static - use first frame' : 'Subtle animation - use first frame'
            });
            
            console.log(`📄 ${filename}`);
            console.log(`   ${prompt}\n`);
        }
    }
    
    return prompts;
}

/**
 * Сохраняет промпты в JSON
 */
function savePromptsToJSON(prompts, filename = 'sora-image-prompts.json') {
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, filename);
    fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2));
    console.log(`✅ Prompts saved to: ${outputPath}`);
}

/**
 * Создает CSV файл для SORA
 */
function savePromptsToCSV(prompts, filename = 'sora-image-prompts.csv') {
    const fs = require('fs');
    const path = require('path');
    
    let csv = 'Filename,Prompt,Duration,Note\n';
    for (const p of prompts) {
        csv += `"${p.filename}","${p.prompt.replace(/"/g, '""')}","${p.duration}","${p.note}"\n`;
    }
    
    const outputPath = path.join(__dirname, filename);
    fs.writeFileSync(outputPath, csv);
    console.log(`✅ CSV saved to: ${outputPath}`);
}

/**
 * Создает Markdown файл с инструкциями
 */
function saveInstructionsToMarkdown(prompts, filename = 'SORA_IMAGE_INSTRUCTIONS.md') {
    const fs = require('fs');
    const path = require('path');
    
    let md = `# 🎬 SORA Prompts для NFT изображений\n\n`;
    md += `## 📋 Инструкция по использованию:\n\n`;
    md += `1. **SORA генерирует видео**, но можно использовать **первый кадр как изображение**\n`;
    md += `2. Используйте **очень короткое видео (1-2 секунды)** с минимальной анимацией\n`;
    md += `3. После генерации **извлеките первый кадр** из видео\n`;
    md += `4. Сохраните как PNG (1000x1000px)\n\n`;
    md += `## 🎯 Параметры для SORA:\n\n`;
    md += `- **Duration:** 1-2 seconds\n`;
    md += `- **Aspect Ratio:** 1:1 (square)\n`;
    md += `- **Resolution:** 1000x1000px (или выше)\n`;
    md += `- **Style:** Pixel art, static first frame\n\n`;
    md += `## 📝 Промпты:\n\n`;
    
    for (const p of prompts) {
        md += `### ${p.tier} - ${p.rarity}\n\n`;
        md += `**Filename:** \`${p.filename}\`\n\n`;
        md += `**Prompt:**\n\`\`\`\n${p.prompt}\n\`\`\`\n\n`;
        md += `**Note:** ${p.note}\n\n`;
        md += `---\n\n`;
    }
    
    const outputPath = path.join(__dirname, filename);
    fs.writeFileSync(outputPath, md);
    console.log(`✅ Instructions saved to: ${outputPath}`);
}

// Main
if (require.main === module) {
    console.log('\n🎬 SORA NFT Image Prompts Generator\n');
    
    const prompts = generateAllSoraPrompts();
    
    console.log(`\n📊 Total prompts: ${prompts.length}`);
    
    // Сохраняем в разных форматах
    savePromptsToJSON(prompts, 'sora-image-prompts.json');
    savePromptsToCSV(prompts, 'sora-image-prompts.csv');
    saveInstructionsToMarkdown(prompts, 'SORA_IMAGE_INSTRUCTIONS.md');
    
    console.log('\n💡 Next steps:');
    console.log('1. Open SORA (если есть доступ)');
    console.log('2. Use the prompts from CSV file');
    console.log('3. Set duration to 1-2 seconds');
    console.log('4. Set aspect ratio to 1:1 (square)');
    console.log('5. Generate videos');
    console.log('6. Extract first frame from each video');
    console.log('7. Save as PNG (1000x1000px)');
    console.log('8. Name files according to CSV\n');
    
    console.log('⚠️  ВАЖНО:');
    console.log('- SORA генерирует видео, но первый кадр можно использовать как изображение');
    console.log('- Для статичных NFT используйте минимальную анимацию');
    console.log('- Common rarity: полностью статичное (первый кадр = финальное изображение)');
    console.log('- Legendary rarity: легкая анимация эффектов (первый кадр = основное изображение)\n');
}

module.exports = {
    generateSoraPrompt,
    generateAllSoraPrompts,
    TIERS,
    RARITIES
};






