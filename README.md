# MC6 Website v5.0.0 🚀

Website corporativo da MC6 - Especialistas em Wi-Fi corporativo e infraestrutura de redes em Blumenau e região.

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
