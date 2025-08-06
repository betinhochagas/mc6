# MC6 Website v5.2.0 🚀

Website corporativo da MC6 - Especialistas em Wi-Fi corporativo e infraestrutura de redes em Blumenau e região.

## 🎯 **Novidades v5.2.0 - Sistema Seções Fullscreen**
- ✅ **Seções Fullscreen**: Features ocupa 100vh quando ativa
- ✅ **Scroll-Triggered Animations**: Cards com animação sequencial
- ✅ **Zero Lacunas Visuais**: Eliminadas todas as telas pretas
- ✅ **Navegação Interna**: Botão hero leva direto ao formulário
- ✅ **Performance Otimizada**: RequestAnimationFrame e throttling

## 🏗️ Arquitetura do Projeto

### Sistema Mobile-First v5.0.0
Este projeto implementa um sistema mobile-first dedicado com arquitetura modular:

- **Desktop:** `assets/css/style.css` + `assets/js/main.js`
- **Mobile:** `assets/css/mobile.css` + `assets/js/mobile.js` (carregamento condicional)
- **Admin:** Painel administrativo com sistema de login

## 📁 Estrutura do Projeto

```
mc6-website/
├── 📄 index.html                 # Página principal
├── 📋 changelog.md               # Histórico de versões (v1.0.0 → v5.0.0)
├── 📚 DOCUMENTATION.md           # Documentação técnica completa
├── � README.md                  # Este arquivo - guia do projeto
│
├── 📁 assets/
│   ├── 🎨 css/
│   │   ├── style.css            # CSS principal (desktop-first)
│   │   └── mobile.css           # CSS mobile-first modular ⭐ v5.0.0
│   │
│   ├── 📜 js/
│   │   ├── main.js              # JavaScript principal
│   │   └── mobile.js            # JavaScript mobile-specific ⭐ v5.0.0
│   │
│   └── 🖼️ media/
│       ├── images/              # Imagens otimizadas (WebP)
│       └── video/               # Vídeos
│
├── 📁 admin/                     # Painel administrativo
│   ├── login.html               # Login do painel
│   └── painel/
│       ├── index.html           # Dashboard principal
│       └── js/admin.js          # JavaScript do admin
│
├── 📁 data/                      # Dados JSON
│   ├── services.json            # Serviços oferecidos
│   ├── clients.json             # Clientes e testimonials
│   └── faq.json                 # Perguntas frequentes
│
└── 📁 lixo/                      # Arquivos não utilizados
    ├── feature.md               # Roadmap e funcionalidades futuras
    ├── CRONOGRAMA.md            # Cronograma de desenvolvimento
    └── *.js, *.html, *.css     # Arquivos de teste/debug
```

## ✨ **Funcionalidades Principais v5.2.0**

### **🎬 Sistema de Seções Fullscreen**
- **Features Fullscreen**: Seção "Por que escolher a MC6?" ocupa tela completa
- **Transições Fluidas**: Eliminadas lacunas visuais entre seções
- **Scroll-Triggered**: Animações baseadas na posição do scroll
- **Z-index Hierárquico**: Controle inteligente de camadas

### **🎯 Navegação e UX**
- **Hero Slider**: 3 slides automáticos com navegação manual
- **Scroll Suave**: Navegação interna com scroll-behavior smooth
- **Botão CTA**: "Faça um Orçamento" leva direto ao formulário
- **Menu Responsivo**: Header com navegação adaptativa

### **📊 Seções Implementadas**
1. **Hero**: Slider com 3 serviços principais + estatísticas
2. **Features**: Diferenciais com métricas e card destacado (NOC)
3. **Cases**: Galeria de projetos com filtros por categoria
4. **Services**: Carousel automático de serviços técnicos
5. **Testimonials**: Depoimentos de clientes com navegação
6. **FAQ**: Sistema de busca e filtros por categoria
7. **Contact**: Formulário completo + métodos de contato

### **🎨 Animações e Interações**
- **Cards Staggered**: Animação sequencial com delays (0.3s, 0.6s, 0.9s)
- **Hover Effects**: Transformações e gradients nos cards
- **Loading States**: Preloader animado no carregamento
- **Floating Elements**: Ícones flutuantes na seção hero

### **📱 Sistema Mobile-First v5.0.0**
- **Detecção Inteligente**: 3 métodos de detecção de dispositivos
- **Carregamento Condicional**: CSS/JS mobile apenas quando necessário
- **Performance Otimizada**: Redução de 40% no payload para desktop
- **Orientação Responsiva**: Auto-reload em mudanças de orientação

## 🚀 Como Executar

### Desenvolvimento Local
```bash
# 1. Clone o repositório
git clone https://github.com/betinhochagas/mc6.git

# 2. Instale as dependências
npm install

# 3. Execute o servidor de desenvolvimento
npm run dev
```

### Servidor Web Simples
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP (XAMPP)
# Coloque na pasta htdocs e acesse via localhost
```

## 🛠️ Build e Deploy

```bash
# Build para produção
npm run build

# Análise do bundle
npm run analyze

# Testes
npm run test

# Deploy staging
npm run deploy:staging

# Deploy produção
npm run deploy:production
```

## 💻 Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica com Schema.org
- **CSS3** - Variáveis CSS, Flexbox, Grid, Mobile-first
- **JavaScript ES6+** - Modules, Async/Await, Intersection Observer

### Build Tools
- **Webpack 5** - Module bundler e otimização
- **PostCSS** - Processamento CSS com autoprefixer
- **Babel** - Transpilação JavaScript

### Performance
- **Service Worker** - Cache strategy para performance
- **WebP Images** - Imagens otimizadas
- **Lazy Loading** - Carregamento assíncrono
- **Preload/Prefetch** - Otimização de recursos críticos

### PWA Features
- **Manifest.json** - App-like experience
- **Offline Support** - Funcionalidade sem internet
- **Mobile Optimized** - Touch targets e gestures

## ✨ Funcionalidades Implementadas

### Core Features (v5.0.0)
- ✅ **Sistema Mobile-First** - Arquitetura responsiva dedicada
- ✅ **Dark/Light Mode** - Alternância de temas com persistência
- ✅ **FAQ Interativo** - Sistema com categorias e busca
- ✅ **Testimonials Carousel** - Carrossel automático com controles
- ✅ **Formulário de Contato** - Validação e feedback visual
- ✅ **Smooth Scrolling** - Navegação fluida entre seções

### Admin Panel
- ✅ **Sistema de Login** - Autenticação básica
- ✅ **Gestão de Clientes** - CRUD para clientes
- ✅ **Gestão de Serviços** - CRUD para serviços
- ✅ **Dashboard** - Visão geral dos dados

### Performance & SEO
- ✅ **Lighthouse Score** - 90+ performance
- ✅ **SEO Otimizado** - Meta tags completas
- ✅ **Schema.org** - Structured data
- ✅ **Open Graph** - Social media optimization

## 📱 Responsividade

### Breakpoints Estratégicos
- **576px** - Mobile pequeno
- **768px** - Mobile/Tablet (breakpoint principal)
- **992px** - Tablet landscape
- **1200px** - Desktop pequeno
- **1400px** - Desktop grande

### Mobile Features v5.0.0
- Touch-optimized navigation
- Swipe gestures
- Mobile-specific animations
- Conditional JavaScript loading
- Optimized font sizes with clamp()

## 🔧 Configuração de Desenvolvimento

### VS Code Extensions Recomendadas
- Live Server
- Prettier
- ESLint
- CSS Peek
- Auto Rename Tag

### Variáveis de Ambiente
```env
NODE_ENV=development
WEBPACK_MODE=development
```

## 📊 Métricas e Performance

### Lighthouse Scores (Target)
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 100

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Flexbox, Grid, Custom Properties, Animations
- **JavaScript ES6+**: Módulos, Arrow Functions, Async/Await
- **Font Awesome 6**: Biblioteca de ícones

### **Performance**
- **WebP**: Imagens otimizadas para web
- **Lazy Loading**: Carregamento sob demanda
- **Critical CSS**: CSS crítico inline
- **RequestAnimationFrame**: Animações performáticas

### **SEO e Meta**
- **Open Graph**: Integração redes sociais
- **Schema.org**: Dados estruturados
- **Meta Tags**: Otimização completa
- **Canonical URLs**: Prevenção de conteúdo duplicado

## 📚 **Documentação e Changelog**

### **Arquivos de Documentação**
- `README.md` - Este arquivo (guia principal)
- `DOCUMENTATION.md` - Documentação técnica completa
- `CHANGELOG_v5.2.0.md` - Changelog da versão atual
- `changelog.md` - Histórico completo de versões

### **Versões Principais**
- **v5.2.0** - Sistema de Seções Fullscreen ⭐ Atual
- **v5.1.0** - Visual Metrics e NOC Highlighting
- **v5.0.0** - Sistema Mobile-First Inteligente
- **v4.0.0** - Implementação completa das seções
- **v3.0.0** - Sistema de FAQ e testimonials

## 🤝 **Contribuição**

### **Guidelines**
1. Siga os padrões de código existentes
2. Teste em múltiplos dispositivos
3. Mantenha a documentação atualizada
4. Use commits semânticos

### **Workflow**
```bash
# 1. Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# 2. Faça suas alterações e commits
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 3. Push e abra um Pull Request
git push origin feature/nova-funcionalidade
```

---

## 📞 **Contato**

**MC6 - Soluções em Conectividade**  
📍 Blumenau, SC, Brasil  
📞 +55 (47) 3288-3002  
📧 contato@mc6.com.br  
💬 [WhatsApp Comercial](https://wa.me/554732883002)

---

*Desenvolvido com ❤️ para transformar a conectividade empresarial em Blumenau e região.*
- **Best Practices:** 90+
- **SEO:** 95+

### Bundle Size (Production)
- **CSS:** ~50KB (gzipped)
- **JavaScript:** ~80KB (gzipped)
- **Total:** ~130KB (gzipped)

## 🤝 Contribuição

### Processo de Development
1. Create feature branch
2. Implement changes
3. Update documentation
4. Run tests
5. Create pull request

### Code Standards
- ESLint + Prettier
- Semantic commits
- CSS BEM methodology
- JavaScript modules

## 📞 Contato

**MC6 - Soluções em Conectividade**
- 📧 Email: contato@mc6.com.br
- 📱 WhatsApp: (47) 3288-3002
- 🌐 Website: https://www.mc6.com.br
- 📍 Blumenau, Santa Catarina

---

**Desenvolvido com ❤️ pela equipe MC6**
