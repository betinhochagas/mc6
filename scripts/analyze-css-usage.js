#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('🔍 Analisando CSS não utilizado...');

// Ler o HTML
const htmlPath = path.join(process.cwd(), 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Ler o CSS minificado
const cssPath = path.join(process.cwd(), 'dist/style.min.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Criar DOM virtual para análise
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// Extrair todas as classes e IDs do HTML
const usedClasses = new Set();
const usedIds = new Set();

// Coletar classes
document.querySelectorAll('[class]').forEach(el => {
    const classes = el.className.split(' ').filter(c => c.trim());
    classes.forEach(cls => usedClasses.add(cls.trim()));
});

// Coletar IDs
document.querySelectorAll('[id]').forEach(el => {
    if (el.id.trim()) {
        usedIds.add(el.id.trim());
    }
});

// Analisar CSS para encontrar seletores
const cssRules = extractCSSRules(cssContent);
const unusedRules = [];
const usedRules = [];

cssRules.forEach(rule => {
    if (isRuleUsed(rule, usedClasses, usedIds, document)) {
        usedRules.push(rule);
    } else {
        unusedRules.push(rule);
    }
});

// Relatório
console.log('\n📊 Análise de CSS:');
console.log(`✅ Classes encontradas no HTML: ${usedClasses.size}`);
console.log(`🔢 IDs encontrados no HTML: ${usedIds.size}`);
console.log(`📏 Regras CSS totais: ${cssRules.length}`);
console.log(`✅ Regras utilizadas: ${usedRules.length}`);
console.log(`❌ Regras potencialmente não utilizadas: ${unusedRules.length}`);

const unusedPercentage = ((unusedRules.length / cssRules.length) * 100).toFixed(1);
console.log(`📈 Porcentagem de CSS não utilizado: ${unusedPercentage}%`);

// Salvar relatório detalhado
const report = {
    summary: {
        totalRules: cssRules.length,
        usedRules: usedRules.length,
        unusedRules: unusedRules.length,
        unusedPercentage: parseFloat(unusedPercentage),
        usedClasses: Array.from(usedClasses).sort(),
        usedIds: Array.from(usedIds).sort()
    },
    unusedRules: unusedRules.slice(0, 50), // Limitar para evitar arquivo muito grande
    recommendations: generateRecommendations(unusedPercentage, unusedRules.length)
};

fs.writeFileSync('reports/css-analysis.json', JSON.stringify(report, null, 2));
console.log('\n💾 Relatório detalhado salvo em: reports/css-analysis.json');

// Função para extrair regras CSS (simplificada)
function extractCSSRules(css) {
    // Remove comentários
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    
    const rules = [];
    const ruleMatches = css.match(/[^{}]+{[^{}]*}/g) || [];
    
    ruleMatches.forEach(match => {
        const [selector, ...declarations] = match.split('{');
        const cleanSelector = selector.trim();
        const cleanDeclarations = declarations.join('{').replace('}', '').trim();
        
        if (cleanSelector && cleanDeclarations) {
            rules.push({
                selector: cleanSelector,
                declarations: cleanDeclarations,
                originalRule: match.trim()
            });
        }
    });
    
    return rules;
}

// Função para verificar se uma regra é usada (simplificada)
function isRuleUsed(rule, usedClasses, usedIds, document) {
    const selector = rule.selector.toLowerCase();
    
    // Regras sempre mantidas (elementos base, pseudo-classes, media queries, etc)
    if (selector.includes('@media') || 
        selector.includes(':hover') || 
        selector.includes(':focus') || 
        selector.includes(':active') ||
        selector.includes(':before') ||
        selector.includes(':after') ||
        selector.match(/^(html|body|a|p|h[1-6]|div|span|img|ul|li|form|input|button)$/)) {
        return true;
    }
    
    // Verificar classes
    for (const className of usedClasses) {
        if (selector.includes(`.${className}`)) {
            return true;
        }
    }
    
    // Verificar IDs
    for (const id of usedIds) {
        if (selector.includes(`#${id}`)) {
            return true;
        }
    }
    
    // Verificar se o seletor existe no DOM (para elementos dinâmicos)
    try {
        if (document.querySelector(selector)) {
            return true;
        }
    } catch (e) {
        // Seletor inválido para querySelector, mas pode ser válido CSS
        return true;
    }
    
    return false;
}

// Função para gerar recomendações
function generateRecommendations(unusedPercentage, unusedCount) {
    const recommendations = [];
    
    if (unusedPercentage > 30) {
        recommendations.push('Alto nível de CSS não utilizado. Considere uma limpeza manual.');
    } else if (unusedPercentage > 15) {
        recommendations.push('Nível moderado de CSS não utilizado. Revisão recomendada.');
    } else {
        recommendations.push('Nível baixo de CSS não utilizado. Bom trabalho!');
    }
    
    if (unusedCount > 100) {
        recommendations.push('Considere usar ferramentas como PurgeCSS para limpeza automática.');
    }
    
    recommendations.push('Verifique se as regras "não utilizadas" são realmente desnecessárias antes de removê-las.');
    recommendations.push('Algumas regras podem ser usadas por JavaScript ou em estados específicos.');
    
    return recommendations;
}
