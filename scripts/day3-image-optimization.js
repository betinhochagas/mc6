#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🖼️  DAY 3 - IMAGE OPTIMIZATION INICIADO');
console.log('=====================================\n');

// Configurações de otimização
const config = {
    sourceDir: 'assets/media/images',
    outputDir: 'dist/images',
    formats: ['webp', 'avif', 'jpg'],
    qualities: {
        webp: 85,
        avif: 75,
        jpg: 80
    },
    sizes: [320, 480, 768, 1024, 1280, 1920] // Responsive breakpoints
};

// Verificar se Sharp está instalado
function checkDependencies() {
    try {
        require('sharp');
        console.log('✅ Sharp detectado para processamento de imagens\n');
        return true;
    } catch (error) {
        console.log('⚠️ Sharp não encontrado. Instalando...\n');
        try {
            execSync('npm install sharp --save-dev', { stdio: 'inherit' });
            console.log('✅ Sharp instalado com sucesso!\n');
            return true;
        } catch (installError) {
            console.error('❌ Erro ao instalar Sharp:', installError.message);
            return false;
        }
    }
}

// Análise de imagens existentes
function analyzeCurrentImages() {
    console.log('🔍 Analisando imagens atuais...\n');
    
    const imageStats = [];
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    function scanDirectory(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                scanDirectory(fullPath);
            } else {
                const ext = path.extname(entry.name).toLowerCase();
                if (supportedExtensions.includes(ext)) {
                    const stats = fs.statSync(fullPath);
                    const relativePath = path.relative(config.sourceDir, fullPath);
                    
                    imageStats.push({
                        path: relativePath,
                        fullPath: fullPath,
                        size: stats.size,
                        sizeKB: Math.round(stats.size / 1024),
                        extension: ext,
                        name: path.basename(entry.name, ext)
                    });
                }
            }
        }
    }
    
    if (fs.existsSync(config.sourceDir)) {
        scanDirectory(config.sourceDir);
    }
    
    // Ordenar por tamanho (maiores primeiro)
    imageStats.sort((a, b) => b.size - a.size);
    
    console.log('📊 INVENTÁRIO DE IMAGENS:');
    console.log('========================');
    
    let totalSize = 0;
    imageStats.forEach((img, index) => {
        console.log(`${index + 1}. ${img.path} - ${img.sizeKB}KB`);
        totalSize += img.size;
    });
    
    console.log(`\n📦 Total: ${imageStats.length} imagens (${Math.round(totalSize / 1024)}KB)`);
    console.log(`🎯 Maior arquivo: ${imageStats[0]?.path} (${imageStats[0]?.sizeKB}KB)\n`);
    
    return imageStats;
}

// Otimização de imagens com Sharp
async function optimizeImages(imageStats) {
    if (!checkDependencies()) return;
    
    const sharp = require('sharp');
    
    console.log('🚀 Iniciando otimização de imagens...\n');
    
    // Criar diretório de saída
    if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir, { recursive: true });
    }
    
    const optimizationResults = [];
    
    for (const img of imageStats) {
        console.log(`🔧 Processando: ${img.path}`);
        
        try {
            const inputBuffer = fs.readFileSync(img.fullPath);
            const sharpInstance = sharp(inputBuffer);
            const metadata = await sharpInstance.metadata();
            
            console.log(`   📏 Dimensões originais: ${metadata.width}x${metadata.height}`);
            
            const results = {
                original: img,
                optimized: [],
                totalSavings: 0
            };
            
            // Gerar versões responsive
            for (const targetWidth of config.sizes) {
                if (targetWidth < metadata.width) {
                    // WebP
                    const webpPath = path.join(config.outputDir, `${img.name}-${targetWidth}w.webp`);
                    await sharpInstance
                        .clone()
                        .resize(targetWidth, null, { withoutEnlargement: true })
                        .webp({ quality: config.qualities.webp })
                        .toFile(webpPath);
                    
                    const webpStats = fs.statSync(webpPath);
                    results.optimized.push({
                        format: 'webp',
                        width: targetWidth,
                        path: webpPath,
                        size: webpStats.size
                    });
                    
                    // AVIF (formato mais moderno)
                    const avifPath = path.join(config.outputDir, `${img.name}-${targetWidth}w.avif`);
                    try {
                        await sharpInstance
                            .clone()
                            .resize(targetWidth, null, { withoutEnlargement: true })
                            .avif({ quality: config.qualities.avif })
                            .toFile(avifPath);
                        
                        const avifStats = fs.statSync(avifPath);
                        results.optimized.push({
                            format: 'avif',
                            width: targetWidth,
                            path: avifPath,
                            size: avifStats.size
                        });
                    } catch (avifError) {
                        console.log(`   ⚠️ AVIF não suportado, pulando...`);
                    }
                }
            }
            
            // Versão original otimizada
            const originalOptimized = path.join(config.outputDir, `${img.name}-original.${img.extension.substring(1)}`);
            if (img.extension === '.jpg' || img.extension === '.jpeg') {
                await sharpInstance
                    .jpeg({ quality: config.qualities.jpg, progressive: true })
                    .toFile(originalOptimized);
            } else if (img.extension === '.png') {
                await sharpInstance
                    .png({ compressionLevel: 9, adaptiveFiltering: true })
                    .toFile(originalOptimized);
            }
            
            const optimizedStats = fs.statSync(originalOptimized);
            const savings = img.size - optimizedStats.size;
            const savingsPercent = ((savings / img.size) * 100).toFixed(1);
            
            results.totalSavings = savings;
            
            console.log(`   ✅ Otimizado: ${Math.round(optimizedStats.size / 1024)}KB (${savingsPercent}% menor)`);
            console.log(`   📱 Versões responsive: ${results.optimized.length}\n`);
            
            optimizationResults.push(results);
            
        } catch (error) {
            console.error(`   ❌ Erro ao processar ${img.path}:`, error.message);
        }
    }
    
    return optimizationResults;
}

// Gerar Picture elements responsivos
function generatePictureElements(optimizationResults) {
    console.log('🖼️  Gerando elementos <picture> otimizados...\n');
    
    const pictureElements = [];
    
    optimizationResults.forEach(result => {
        const img = result.original;
        const breakpoints = result.optimized
            .filter(opt => opt.format === 'webp')
            .sort((a, b) => b.width - a.width);
        
        const avifBreakpoints = result.optimized
            .filter(opt => opt.format === 'avif')
            .sort((a, b) => b.width - a.width);
        
        let pictureHTML = `<!-- ${img.name} - Responsive Picture Element -->\n<picture class="responsive-image">\n`;
        
        // AVIF sources (melhor compressão)
        if (avifBreakpoints.length > 0) {
            avifBreakpoints.forEach(bp => {
                const relativePath = path.relative(process.cwd(), bp.path).replace(/\\/g, '/');
                pictureHTML += `  <source media="(min-width: ${bp.width}px)" srcset="${relativePath}" type="image/avif">\n`;
            });
        }
        
        // WebP sources  
        breakpoints.forEach(bp => {
            const relativePath = path.relative(process.cwd(), bp.path).replace(/\\/g, '/');
            pictureHTML += `  <source media="(min-width: ${bp.width}px)" srcset="${relativePath}" type="image/webp">\n`;
        });
        
        // Fallback
        pictureHTML += `  <img src="${img.path}" alt="" loading="lazy" class="img-responsive">\n`;
        pictureHTML += `</picture>\n`;
        
        pictureElements.push({
            name: img.name,
            html: pictureHTML,
            originalSize: img.sizeKB,
            optimizedCount: result.optimized.length
        });
    });
    
    // Salvar elementos para referência
    const pictureGuide = {
        timestamp: new Date().toISOString(),
        totalImages: pictureElements.length,
        examples: pictureElements.map(pe => ({
            name: pe.name,
            html: pe.html,
            stats: {
                originalSizeKB: pe.originalSize,
                responsiveVersions: pe.optimizedCount
            }
        }))
    };
    
    fs.writeFileSync('reports/picture-elements.json', JSON.stringify(pictureGuide, null, 2));
    console.log('💾 Guia de elementos <picture> salvo em: reports/picture-elements.json\n');
    
    return pictureElements;
}

// Executar otimização completa
async function runImageOptimization() {
    try {
        console.log('🎬 Iniciando Day 3 - Image Optimization\n');
        
        // 1. Analisar imagens atuais
        const imageStats = analyzeCurrentImages();
        
        if (imageStats.length === 0) {
            console.log('⚠️ Nenhuma imagem encontrada para otimizar.');
            return;
        }
        
        // 2. Otimizar imagens
        const optimizationResults = await optimizeImages(imageStats);
        
        // 3. Gerar elementos picture responsivos
        const pictureElements = generatePictureElements(optimizationResults);
        
        // 4. Relatório final
        const totalOriginalSize = imageStats.reduce((sum, img) => sum + img.size, 0);
        const totalSavings = optimizationResults.reduce((sum, result) => sum + result.totalSavings, 0);
        const savingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
        
        console.log('🏆 RESULTADO DA OTIMIZAÇÃO:');
        console.log('===========================');
        console.log(`📦 Imagens processadas: ${imageStats.length}`);
        console.log(`📱 Versões responsive criadas: ${optimizationResults.reduce((sum, r) => sum + r.optimized.length, 0)}`);
        console.log(`💾 Tamanho original: ${Math.round(totalOriginalSize / 1024)}KB`);
        console.log(`✨ Economia total: ${Math.round(totalSavings / 1024)}KB (${savingsPercent}%)`);
        console.log(`🖼️  Elementos <picture>: ${pictureElements.length} gerados\n`);
        
        // Salvar relatório
        const report = {
            timestamp: new Date().toISOString(),
            phase: 'Day 3 - Image Optimization',
            summary: {
                imagesProcessed: imageStats.length,
                responsiveVersions: optimizationResults.reduce((sum, r) => sum + r.optimized.length, 0),
                originalSizeKB: Math.round(totalOriginalSize / 1024),
                totalSavingsKB: Math.round(totalSavings / 1024),
                savingsPercent: parseFloat(savingsPercent),
                pictureElementsGenerated: pictureElements.length
            },
            details: optimizationResults.map(result => ({
                original: result.original.path,
                originalSizeKB: result.original.sizeKB,
                optimizedVersions: result.optimized.length,
                savingsKB: Math.round(result.totalSavings / 1024)
            }))
        };
        
        fs.writeFileSync('reports/day3-image-optimization.json', JSON.stringify(report, null, 2));
        console.log('💾 Relatório completo salvo em: reports/day3-image-optimization.json');
        
        return report;
        
    } catch (error) {
        console.error('❌ Erro durante otimização de imagens:', error.message);
        throw error;
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    runImageOptimization().catch(console.error);
}

module.exports = { runImageOptimization, config };
