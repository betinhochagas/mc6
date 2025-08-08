#!/usr/bin/env node

const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

console.log('🧹 Executando limpeza avançada de CSS...');

async function purgeCSS() {
    const purgeCSSResults = await new PurgeCSS().purge({
        content: [
            'index.html',
            'assets/js/**/*.js'
        ],
        css: ['dist/style.min.css'],
        safelist: [
            // Mantém classes essenciais que podem não aparecer no HTML estático
            /^skip-/, // Links de acessibilidade 
            /^sr-/, // Screen reader classes
            /^btn/, // Botões
            /^navbar/, // Navegação
            /^modal/, // Modals
            /^dropdown/, // Dropdowns
            /^carousel/, // Carousels
            /^fade/, // Animações
            /^show/, // Estados de show/hide
            /^active/, // Estados ativos
            /^disabled/, // Estados desabilitados
            /^loading/, // Estados de loading
            /^error/, // Estados de erro
            // Pseudo-classes importantes
            ':hover',
            ':focus',
            ':active',
            ':visited',
            ':before',
            ':after',
            // Media queries (PurgeCSS pode remover por engano)
            /@media/,
            // Classes que podem ser adicionadas via JavaScript
            'is-visible',
            'is-hidden',
            'is-loading',
            'is-active',
            'has-error'
        ],
        // Mantém todas as regras de at-rules como @media, @keyframes, etc
        blocklist: [],
        // Configurações avançadas
        defaultExtractor: content => {
            // Extrator customizado para pegar classes dinâmicas
            const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '');
            return contentWithoutStyleBlocks.match(/[\w-/:()]+/g) || [];
        },
        // Whitelisting de padrões
        whitelistPatterns: [
            /col-/, // Classes de grid/colunas
            /btn-/, // Variações de botões  
            /text-/, // Classes de texto
            /bg-/, // Classes de background
            /border-/, // Classes de border
            /p-/, // Padding classes
            /m-/, // Margin classes
            /w-/, // Width classes
            /h-/, // Height classes
            /d-/, // Display classes
            /flex-/, // Flexbox classes
            /justify-/, // Justify classes
            /align-/, // Align classes
            /position-/, // Position classes
            /shadow-/, // Shadow classes
            /rounded-/ // Border radius classes
        ]
    });
    
    if (purgeCSSResults.length > 0) {
        const purgedCSS = purgeCSSResults[0].css;
        const originalSize = fs.statSync('dist/style.min.css').size;
        
        // Salvar CSS purificado
        fs.writeFileSync('dist/style.purged.css', purgedCSS);
        
        const purgedSize = Buffer.byteLength(purgedCSS, 'utf8');
        const reduction = ((originalSize - purgedSize) / originalSize * 100).toFixed(1);
        
        console.log('✅ CSS purificado com sucesso!');
        console.log(`📊 Tamanho original: ${(originalSize / 1024).toFixed(1)}KB`);
        console.log(`📊 Tamanho purificado: ${(purgedSize / 1024).toFixed(1)}KB`);
        console.log(`📈 Redução: ${reduction}% (${((originalSize - purgedSize) / 1024).toFixed(1)}KB economizados)`);
        
        // Criar versão com source map para debugging
        const cssWithSourceMap = `${purgedCSS}\n/*# sourceMappingURL=style.purged.css.map */`;
        fs.writeFileSync('dist/style.purged.css', cssWithSourceMap);
        
        // Criar um source map simples
        const sourceMap = {
            version: 3,
            sources: ['style.min.css'],
            names: [],
            mappings: '',
            file: 'style.purged.css',
            sourcesContent: [fs.readFileSync('dist/style.min.css', 'utf8')]
        };
        
        fs.writeFileSync('dist/style.purged.css.map', JSON.stringify(sourceMap, null, 2));
        
        // Salvar relatório
        const report = {
            timestamp: new Date().toISOString(),
            originalSize: originalSize,
            purgedSize: purgedSize,
            reduction: parseFloat(reduction),
            savedBytes: originalSize - purgedSize,
            files: {
                original: 'dist/style.min.css',
                purged: 'dist/style.purged.css'
            }
        };
        
        fs.writeFileSync('reports/purge-css-report.json', JSON.stringify(report, null, 2));
        console.log('💾 Relatório salvo em: reports/purge-css-report.json');
        
        return true;
    } else {
        console.log('❌ Erro ao purificar CSS');
        return false;
    }
}

purgeCSS().catch(error => {
    console.error('❌ Erro durante purificação:', error.message);
    process.exit(1);
});
