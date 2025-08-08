#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 MC6 - LIMPEZA DE ARQUIVOS NÃO UTILIZADOS');
console.log('===========================================\n');

// Arquivos essenciais que estão sendo usados
const filesInUse = [
    // HTML principal
    'index.html',
    
    // CSS em uso
    'dist/style.purged.css',
    'dist/style.purged.css.map',
    'assets/css/critical.css', // Inline no HTML
    
    // JavaScript em uso
    'assets/js/main-optimized.js',
    
    // PWA e Manifests
    'manifest-v3.json',
    'manifest.json',
    'browserconfig.xml',
    'sw-v3.js', // Service Worker
    'sw.js',
    
    // SEO e Search
    'robots.txt',
    'sitemap.xml',
    
    // Imagens otimizadas (pasta inteira)
    'dist/images/',
    'assets/media/images/', // Originais ainda necessários
    
    // Documentação essencial
    'README.md',
    'DAY3-FINAL-REPORT.md',
    
    // Scripts de build (manter para manutenção)
    'scripts/day3-image-optimization.js',
    'scripts/day3-final-test.js',
    'scripts/purge-css.js',
    'scripts/extract-critical.js'
];

// Arquivos que podem ser removidos
const filesToRemove = [
    // CSS não utilizados
    'assets/css/style.css', // Substituído por style.purged.css
    'assets/css/mobile.css', // Já incorporado no purged
    'assets/css/accessibility.css', // Já incorporado no purged
    'assets/css/corporate-professional.css', // Já incorporado no purged
    'assets/css/ux-improvements.css', // Já incorporado no purged
    'assets/css/unified.css', // Versão intermediária
    'assets/css/mobile-day3.css', // Não utilizado
    
    // JavaScript não utilizado
    'assets/js/main.js', // Versão não otimizada
    'assets/js/lazy-loading.js', // Comentado no HTML
    
    // CSS distribuído não utilizado
    'dist/style.min.css',
    'dist/style.min.css.map',
    'style.bundle.css', // Duplicado
    
    // Scripts de desenvolvimento não essenciais
    'scripts/analyze-bundle.js',
    'scripts/analyze-css-usage.js',
    'scripts/compile-css.js',
    'scripts/compare-performance.js',
    'scripts/day3-final-analysis.js',
    'scripts/day3-mobile-optimization.js',
    'scripts/lighthouse-summary.js',
    
    // Relatórios e documentação extra
    'ANALISE-ORTOGRAFICA.md',
    'build-optimization.md',
    'CORPORATE-IMPROVEMENTS.md',
    'FOOTER-FIX-REPORT.md',
    'github-pages-info.md',
    'html-optimizations.html',
    'package.json.example',
    'RELATORIO-MELHORIAS.md',
    'security-improvements.md',
    'CHECKLIST-DIARIO.md',
    'README-EXECUTIVO.md'
];

// Função para remover arquivo ou diretório
function removeFileOrDir(filePath) {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  ${filePath} - Não encontrado`);
        return;
    }
    
    try {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`🗂️  Diretório removido: ${filePath}`);
        } else {
            const sizeKB = (stats.size / 1024).toFixed(1);
            fs.unlinkSync(fullPath);
            console.log(`🗑️  Arquivo removido: ${filePath} (${sizeKB}KB)`);
        }
    } catch (error) {
        console.log(`❌ Erro ao remover ${filePath}: ${error.message}`);
    }
}

// Calcular espaço ocupado antes da limpeza
function calculateTotalSize(files) {
    let totalSize = 0;
    let fileCount = 0;
    
    files.forEach(filePath => {
        const fullPath = path.resolve(filePath);
        if (fs.existsSync(fullPath)) {
            try {
                const stats = fs.statSync(fullPath);
                if (stats.isFile()) {
                    totalSize += stats.size;
                    fileCount++;
                }
            } catch (error) {
                // Ignora erros
            }
        }
    });
    
    return { totalSize, fileCount };
}

// Análise pré-limpeza
console.log('📊 ANÁLISE PRÉ-LIMPEZA:');
console.log('========================');

const beforeCleanup = calculateTotalSize(filesToRemove);
console.log(`📁 ${beforeCleanup.fileCount} arquivos serão removidos`);
console.log(`💾 ${(beforeCleanup.totalSize / 1024).toFixed(1)}KB serão liberados\n`);

// Confirmar remoção
console.log('🎯 ARQUIVOS QUE SERÃO REMOVIDOS:');
console.log('================================');

filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`   ${file} (${sizeKB}KB)`);
    }
});

console.log('\n⚠️  ATENÇÃO: Esta operação NÃO pode ser desfeita!');
console.log('✅ Apenas arquivos não utilizados serão removidos.');
console.log('📋 Arquivos essenciais serão preservados.\n');

// Executar limpeza
console.log('🚀 INICIANDO LIMPEZA...\n');

let removedCount = 0;
let freedSpace = 0;

filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        freedSpace += stats.size;
        removeFileOrDir(file);
        removedCount++;
    }
});

console.log('\n' + '='.repeat(50));
console.log('🎉 LIMPEZA CONCLUÍDA!');
console.log('='.repeat(50));
console.log(`✅ ${removedCount} arquivos removidos`);
console.log(`💾 ${(freedSpace / 1024).toFixed(1)}KB de espaço liberado`);
console.log(`📁 Projeto mais limpo e organizado!\n`);

// Verificar arquivos essenciais preservados
console.log('🔒 ARQUIVOS ESSENCIAIS PRESERVADOS:');
console.log('===================================');

const essentialFiles = [
    'index.html',
    'dist/style.purged.css',
    'assets/js/main-optimized.js',
    'manifest-v3.json',
    'README.md',
    'DAY3-FINAL-REPORT.md'
];

essentialFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`✅ ${file} (${sizeKB}KB) - OK`);
    } else {
        console.log(`❌ ${file} - ARQUIVO CRÍTICO AUSENTE!`);
    }
});

console.log('\n🎯 PROJETO MC6 OTIMIZADO E LIMPO!');
console.log('📈 Performance melhorada pela remoção de arquivos desnecessários');
console.log('🚀 Pronto para produção!');
