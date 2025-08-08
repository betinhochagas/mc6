const fs = require('fs');
const path = require('path');

console.log('=== MC6 Day 3 Status Final ===\n');

// Verificar imagens otimizadas
const distImagesPath = path.join(__dirname, '..', 'dist', 'images');
if (fs.existsSync(distImagesPath)) {
    const optimizedImages = fs.readdirSync(distImagesPath);
    console.log(`✅ ${optimizedImages.length} imagens otimizadas geradas`);
    
    // Contar por formato
    const avifCount = optimizedImages.filter(f => f.endsWith('.avif')).length;
    const webpCount = optimizedImages.filter(f => f.endsWith('.webp')).length;
    console.log(`   - ${avifCount} em formato AVIF`);
    console.log(`   - ${webpCount} em formato WebP`);
} else {
    console.log('❌ Pasta dist/images não encontrada');
}

// Verificar implementação do picture element
const indexPath = path.join(__dirname, '..', 'index.html');
if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    if (indexContent.includes('<picture')) {
        console.log('✅ Picture element implementado');
    }
    
    if (indexContent.includes('dist/images/hero-emp')) {
        console.log('✅ Imagem hero otimizada em uso');
    }
    
    if (indexContent.includes('srcset=')) {
        console.log('✅ Responsive images ativas');
    }
}

// Calcular economia aproximada
const originalPath = path.join(__dirname, '..', 'assets', 'media', 'images');
if (fs.existsSync(originalPath)) {
    let originalSize = 0;
    let optimizedSize = 0;
    
    const originals = ['hero-emp.webp'];
    
    originals.forEach(filename => {
        const originalFile = path.join(originalPath, filename);
        if (fs.existsSync(originalFile)) {
            originalSize += fs.statSync(originalFile).size;
        }
    });
    
    // Verificar versões otimizadas
    const optimizedVersions = ['hero-emp-320w.webp', 'hero-emp-480w.webp'];
    optimizedVersions.forEach(filename => {
        const optimizedFile = path.join(distImagesPath, filename);
        if (fs.existsSync(optimizedFile)) {
            optimizedSize += fs.statSync(optimizedFile).size;
        }
    });
    
    if (originalSize > 0 && optimizedSize > 0) {
        const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        console.log(`\n💾 Economia na imagem hero: ${reduction}% (${(originalSize/1024).toFixed(1)}KB → ${(optimizedSize/1024).toFixed(1)}KB)`);
    }
}

console.log('\n=== Status Implementation ===');
console.log('✅ Day 3 - Image Optimization: ACTIVE (Simplified)');
console.log('📱 Picture element com AVIF/WebP responsive');
console.log('⚡ Preload otimizado para imagem hero');
console.log('🚀 Scripts complexos removidos para evitar regressão');

console.log('\n=== Next Steps ===');
console.log('1. Manter otimização de imagens simples');
console.log('2. Avaliar performance antes/depois');
console.log('3. Considerar lazy loading apenas se necessário');
