#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📊 COMPARAÇÃO: ANTES vs. DEPOIS (Day 2 CSS Optimization)\n');
console.log('===========================================================\n');

// Carregar relatórios
const day1Report = JSON.parse(fs.readFileSync('reports/lighthouse-performance.json', 'utf8'));
const day2Report = JSON.parse(fs.readFileSync('reports/lighthouse-day2.json', 'utf8'));

function extractMetrics(report) {
    return {
        performanceScore: Math.round((report.categories?.performance?.score || 0) * 100),
        fcp: parseFloat(report.audits['first-contentful-paint']?.numericValue || 0),
        lcp: parseFloat(report.audits['largest-contentful-paint']?.numericValue || 0),
        si: parseFloat(report.audits['speed-index']?.numericValue || 0),
        tti: parseFloat(report.audits['interactive']?.numericValue || 0),
        tbt: parseFloat(report.audits['total-blocking-time']?.numericValue || 0),
        cls: parseFloat(report.audits['cumulative-layout-shift']?.numericValue || 0)
    };
}

const day1Metrics = extractMetrics(day1Report);
const day2Metrics = extractMetrics(day2Report);

console.log('🎯 PERFORMANCE SCORE:');
console.log(`   Day 1: ${day1Metrics.performanceScore}/100`);
console.log(`   Day 2: ${day2Metrics.performanceScore}/100`);
console.log(`   Melhoria: ${day2Metrics.performanceScore - day1Metrics.performanceScore} pontos ${day2Metrics.performanceScore > day1Metrics.performanceScore ? '📈' : '📉'}\n`);

console.log('⏱️ CORE WEB VITALS:');
console.log('===================');

// FCP - First Contentful Paint
const fcpImprovement = ((day1Metrics.fcp - day2Metrics.fcp) / day1Metrics.fcp * 100).toFixed(1);
console.log(`📄 First Contentful Paint:`);
console.log(`   Day 1: ${(day1Metrics.fcp / 1000).toFixed(1)}s`);
console.log(`   Day 2: ${(day2Metrics.fcp / 1000).toFixed(1)}s`);
console.log(`   Melhoria: ${fcpImprovement}% ${fcpImprovement > 0 ? '📈' : '📉'}\n`);

// LCP - Largest Contentful Paint
const lcpImprovement = ((day1Metrics.lcp - day2Metrics.lcp) / day1Metrics.lcp * 100).toFixed(1);
console.log(`🖼️ Largest Contentful Paint:`);
console.log(`   Day 1: ${(day1Metrics.lcp / 1000).toFixed(1)}s`);
console.log(`   Day 2: ${(day2Metrics.lcp / 1000).toFixed(1)}s`);
console.log(`   Melhoria: ${lcpImprovement}% ${lcpImprovement > 0 ? '📈' : '📉'}\n`);

// SI - Speed Index
const siImprovement = ((day1Metrics.si - day2Metrics.si) / day1Metrics.si * 100).toFixed(1);
console.log(`⚡ Speed Index:`);
console.log(`   Day 1: ${(day1Metrics.si / 1000).toFixed(1)}s`);
console.log(`   Day 2: ${(day2Metrics.si / 1000).toFixed(1)}s`);
console.log(`   Melhoria: ${siImprovement}% ${siImprovement > 0 ? '📈' : '📉'}\n`);

// TTI - Time to Interactive
const ttiImprovement = ((day1Metrics.tti - day2Metrics.tti) / day1Metrics.tti * 100).toFixed(1);
console.log(`🎮 Time to Interactive:`);
console.log(`   Day 1: ${(day1Metrics.tti / 1000).toFixed(1)}s`);
console.log(`   Day 2: ${(day2Metrics.tti / 1000).toFixed(1)}s`);
console.log(`   Melhoria: ${ttiImprovement}% ${ttiImprovement > 0 ? '📈' : '📉'}\n`);

console.log('🔍 ANÁLISE DE OTIMIZAÇÕES IMPLEMENTADAS:');
console.log('======================================\n');

// Análise CSS
const day1CSS = day1Report.audits['unused-css-rules'];
const day2CSS = day2Report.audits['unused-css-rules'];

console.log('🎨 CSS OPTIMIZATION:');
if (day1CSS && day2CSS) {
    console.log(`   CSS não utilizado (Day 1): ${day1CSS.displayValue || 'N/A'}`);
    console.log(`   CSS não utilizado (Day 2): ${day2CSS.displayValue || 'N/A'}`);
}

// Análise de recursos bloqueantes
const day1Blocking = day1Report.audits['render-blocking-resources'];
const day2Blocking = day2Report.audits['render-blocking-resources'];

console.log(`\n🚫 RENDER BLOCKING RESOURCES:`);
if (day1Blocking && day2Blocking) {
    console.log(`   Economia potencial (Day 1): ${day1Blocking.displayValue || 'N/A'}`);
    console.log(`   Economia potencial (Day 2): ${day2Blocking.displayValue || 'N/A'}`);
}

console.log('\n📦 TAMANHOS DE ARQUIVO:');
console.log('=======================');

// Análise de bundle
const bundleReport = JSON.parse(fs.readFileSync('reports/bundle-analysis.json', 'utf8'));
console.log(`📄 HTML: ${bundleReport.analysis.html.original}KB`);
console.log(`🎨 CSS Original: ${bundleReport.analysis.css.original}KB`);
console.log(`🎨 CSS Unificado: ${bundleReport.analysis.css.unified}KB`);
console.log(`🎨 CSS Minificado: ${bundleReport.analysis.css.minified}KB`);

const purgeReport = JSON.parse(fs.readFileSync('reports/purge-css-report.json', 'utf8'));
console.log(`🧹 CSS Purificado: ${(purgeReport.purgedSize / 1024).toFixed(1)}KB`);
console.log(`📈 Economia CSS total: ${(purgeReport.reduction).toFixed(1)}%`);

console.log(`\n⚡ JavaScript Original: ${bundleReport.analysis.js.original}KB`);
console.log(`⚡ JavaScript Otimizado: ${bundleReport.analysis.js.optimized}KB`);

console.log('\n🏆 RESUMO DAS MELHORIAS DO DAY 2:');
console.log('=================================');
console.log('✅ CSS purificado com PurgeCSS (-11.9%)');
console.log('✅ Fontes carregadas assincronamente');
console.log('✅ Font Awesome carregado sem bloqueio');
console.log('✅ DNS prefetch implementado');

// Calcular melhoria total
const totalImprovement = day2Metrics.performanceScore - day1Metrics.performanceScore;
if (totalImprovement > 0) {
    console.log(`\n🎉 RESULTADO: +${totalImprovement} pontos de performance!`);
} else {
    console.log(`\n⚠️ RESULTADO: ${totalImprovement} pontos (pode ser devido a variações de rede)`);
}

// Salvar comparação
const comparison = {
    timestamp: new Date().toISOString(),
    day1: day1Metrics,
    day2: day2Metrics,
    improvements: {
        performanceScore: totalImprovement,
        fcp: parseFloat(fcpImprovement),
        lcp: parseFloat(lcpImprovement),
        si: parseFloat(siImprovement),
        tti: parseFloat(ttiImprovement)
    },
    optimizations: [
        'CSS purged with PurgeCSS',
        'Async font loading',
        'Non-blocking Font Awesome',
        'DNS prefetch added'
    ]
};

fs.writeFileSync('reports/day2-comparison.json', JSON.stringify(comparison, null, 2));
console.log('\n💾 Comparação salva em: reports/day2-comparison.json');
