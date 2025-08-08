#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📊 Analisando resultados do Lighthouse...\n');

const reportPath = path.join(process.cwd(), 'reports/lighthouse-performance.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

// Extrair métricas principais
const metrics = {
    'Performance Score': {
        value: Math.round(report.categories?.performance?.score * 100) || 'N/A',
        unit: '/100',
        description: 'Pontuação geral de performance'
    },
    'First Contentful Paint': {
        value: report.audits['first-contentful-paint']?.displayValue || 'N/A',
        score: report.audits['first-contentful-paint']?.score || 0,
        description: 'Tempo para primeiro conteúdo aparecer'
    },
    'Largest Contentful Paint': {
        value: report.audits['largest-contentful-paint']?.displayValue || 'N/A',
        score: report.audits['largest-contentful-paint']?.score || 0,
        description: 'Tempo para maior elemento aparecer'
    },
    'Speed Index': {
        value: report.audits['speed-index']?.displayValue || 'N/A',
        score: report.audits['speed-index']?.score || 0,
        description: 'Velocidade de carregamento visual'
    },
    'Time to Interactive': {
        value: report.audits['interactive']?.displayValue || 'N/A',
        score: report.audits['interactive']?.score || 0,
        description: 'Tempo até a página ficar interativa'
    },
    'Total Blocking Time': {
        value: report.audits['total-blocking-time']?.displayValue || 'N/A',
        score: report.audits['total-blocking-time']?.score || 0,
        description: 'Tempo que a main thread ficou bloqueada'
    },
    'Cumulative Layout Shift': {
        value: report.audits['cumulative-layout-shift']?.displayValue || 'N/A',
        score: report.audits['cumulative-layout-shift']?.score || 0,
        description: 'Instabilidade de layout durante carregamento'
    }
};

// Mostrar métricas
console.log('🎯 MÉTRICAS PRINCIPAIS DE PERFORMANCE:');
console.log('=====================================\n');

Object.entries(metrics).forEach(([name, data]) => {
    const emoji = getScoreEmoji(data.score);
    const scoreText = data.score !== undefined ? ` ${emoji} (${Math.round(data.score * 100)}%)` : '';
    console.log(`${name}: ${data.value}${data.unit || ''}${scoreText}`);
    console.log(`   └─ ${data.description}\n`);
});

// Oportunidades de melhoria
console.log('🚀 PRINCIPAIS OPORTUNIDADES DE MELHORIA:');
console.log('=======================================\n');

const opportunities = report.audits;
const improvementAudits = [
    'render-blocking-resources',
    'unused-css-rules',
    'unused-javascript',
    'unminified-css',
    'unminified-javascript',
    'efficient-animated-content',
    'offscreen-images',
    'next-gen-formats',
    'properly-size-images'
];

improvementAudits.forEach(auditId => {
    const audit = opportunities[auditId];
    if (audit && audit.score !== null && audit.score < 1) {
        console.log(`❌ ${audit.title}`);
        if (audit.displayValue) {
            console.log(`   💾 Economia potencial: ${audit.displayValue}`);
        }
        if (audit.description) {
            console.log(`   📝 ${audit.description.replace(/\[.*?\]\(.*?\)/g, '').substring(0, 100)}...`);
        }
        console.log();
    }
});

// Auditorias já passando
console.log('✅ AUDITORIAS JÁ PASSANDO:');
console.log('=========================\n');

const passingAudits = Object.entries(opportunities)
    .filter(([_, audit]) => audit.score === 1)
    .slice(0, 5);

passingAudits.forEach(([auditId, audit]) => {
    console.log(`✅ ${audit.title}`);
});

console.log(`\n... e mais ${Object.values(opportunities).filter(a => a.score === 1).length - 5} auditorias passando.`);

// Resumo da evolução
console.log('\n📈 COMPARAÇÃO COM BASELINE:');
console.log('==========================\n');

const currentScore = Math.round(report.categories?.performance?.score * 100) || 0;
const baselineScore = 78; // Score inicial estimado

console.log(`Baseline: ${baselineScore}/100`);
console.log(`Atual: ${currentScore}/100`);
console.log(`Melhoria: ${currentScore - baselineScore} pontos ${currentScore > baselineScore ? '📈' : '📉'}`);

// Salvar resumo
const summary = {
    timestamp: new Date().toISOString(),
    performanceScore: currentScore,
    metrics: Object.fromEntries(
        Object.entries(metrics).map(([key, value]) => [
            key.replace(/\s+/g, '_').toLowerCase(),
            { value: value.value, score: value.score }
        ])
    ),
    improvements: improvementAudits
        .map(id => opportunities[id])
        .filter(audit => audit && audit.score < 1)
        .map(audit => ({
            title: audit.title,
            potential_savings: audit.displayValue,
            score: audit.score
        }))
};

fs.writeFileSync('reports/performance-summary.json', JSON.stringify(summary, null, 2));
console.log('\n💾 Resumo salvo em: reports/performance-summary.json');

function getScoreEmoji(score) {
    if (score >= 0.9) return '🟢';
    if (score >= 0.5) return '🟡';
    return '🔴';
}
