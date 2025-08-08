// Script para compilar e unificar CSS
const fs = require('fs');
const path = require('path');

console.log('🎨 Compilando CSS...');

// Lista de arquivos CSS em ordem de prioridade
const cssFiles = [
    'assets/css/style.css',
    'assets/css/corporate-professional.css', 
    'assets/css/mobile.css',
    'assets/css/accessibility.css',
    'assets/css/ux-improvements.css'
];

let unifiedCSS = '/* MC6 - CSS Unificado e Otimizado */\n\n';

// Compilar CSS
cssFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`📄 Processando: ${file}`);
        const content = fs.readFileSync(file, 'utf8');
        unifiedCSS += `/* === ${file} === */\n`;
        unifiedCSS += content + '\n\n';
    } else {
        console.warn(`⚠️  Arquivo não encontrado: ${file}`);
    }
});

// Criar diretório temp se não existir
if (!fs.existsSync('temp')) {
    fs.mkdirSync('temp');
}

// Salvar CSS unificado
fs.writeFileSync('assets/css/unified.css', unifiedCSS);
console.log('✅ CSS unificado criado: assets/css/unified.css');

// Estatísticas
const stats = fs.statSync('assets/css/unified.css');
console.log(`📊 Tamanho: ${(stats.size / 1024).toFixed(1)}KB`);
