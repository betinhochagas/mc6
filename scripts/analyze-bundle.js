// Script para analisar performance do bundle
const fs = require('fs');
const path = require('path');

console.log('📊 Analisando Bundle Size...\n');

// Função para calcular tamanho em KB
const getSize = (filePath) => {
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return (stats.size / 1024).toFixed(1);
    }
    return 0;
};

// Análise de arquivos
const analysis = {
    html: {
        original: getSize('index.html'),
        minified: getSize('dist/index.html')
    },
    css: {
        original: getSize('assets/css/style.css'),
        unified: getSize('assets/css/unified.css'),
        minified: getSize('dist/style.min.css'),
        critical: getSize('assets/css/critical.css')
    },
    js: {
        original: getSize('assets/js/main.js'),
        optimized: getSize('assets/js/main-optimized.js'),
        minified: getSize('dist/main.min.js')
    }
};

// Relatório
console.log('📄 HTML:');
console.log(`   Original: ${analysis.html.original}KB`);
if (analysis.html.minified > 0) {
    const reduction = ((1 - analysis.html.minified / analysis.html.original) * 100).toFixed(1);
    console.log(`   Minificado: ${analysis.html.minified}KB (-${reduction}%)`);
}

console.log('\n🎨 CSS:');
console.log(`   Original (style.css): ${analysis.css.original}KB`);
if (analysis.css.unified > 0) {
    console.log(`   Unificado: ${analysis.css.unified}KB`);
}
if (analysis.css.minified > 0) {
    const reduction = ((1 - analysis.css.minified / analysis.css.original) * 100).toFixed(1);
    console.log(`   Minificado: ${analysis.css.minified}KB (-${reduction}%)`);
}
console.log(`   Critical CSS: ${analysis.css.critical}KB`);

console.log('\n⚡ JavaScript:');
console.log(`   Original (main.js): ${analysis.js.original}KB`);
console.log(`   Otimizado: ${analysis.js.optimized}KB`);
if (analysis.js.minified > 0) {
    const reduction = ((1 - analysis.js.minified / analysis.js.original) * 100).toFixed(1);
    console.log(`   Minificado: ${analysis.js.minified}KB (-${reduction}%)`);
}

// Bundle total
const originalTotal = parseFloat(analysis.html.original) + parseFloat(analysis.css.original) + parseFloat(analysis.js.original);
const optimizedTotal = parseFloat(analysis.html.minified || analysis.html.original) + 
                      parseFloat(analysis.css.minified || analysis.css.original) + 
                      parseFloat(analysis.js.minified || analysis.js.original);

console.log('\n📦 Bundle Total:');
console.log(`   Original: ${originalTotal.toFixed(1)}KB`);
if (analysis.html.minified > 0) {
    const totalReduction = ((1 - optimizedTotal / originalTotal) * 100).toFixed(1);
    console.log(`   Otimizado: ${optimizedTotal.toFixed(1)}KB (-${totalReduction}%)`);
}

// Performance budgets
console.log('\n🎯 Performance Budgets:');
const budgets = {
    html: 30,
    css: 15,
    js: 10,
    total: 50
};

const checkBudget = (actual, budget, name) => {
    const status = actual <= budget ? '✅' : '❌';
    console.log(`   ${name}: ${actual}KB / ${budget}KB ${status}`);
};

checkBudget(parseFloat(analysis.html.minified || analysis.html.original), budgets.html, 'HTML');
checkBudget(parseFloat(analysis.css.minified || analysis.css.original), budgets.css, 'CSS ');
checkBudget(parseFloat(analysis.js.minified || analysis.js.original), budgets.js, 'JS  ');
checkBudget(optimizedTotal, budgets.total, 'Total');

// Salvar relatório
const report = {
    timestamp: new Date().toISOString(),
    analysis,
    totals: {
        original: originalTotal,
        optimized: optimizedTotal,
        reduction: ((1 - optimizedTotal / originalTotal) * 100).toFixed(1) + '%'
    }
};

if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports');
}

fs.writeFileSync('reports/bundle-analysis.json', JSON.stringify(report, null, 2));
console.log('\n💾 Relatório salvo em: reports/bundle-analysis.json');
