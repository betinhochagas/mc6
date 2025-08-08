# 📚 MC6 - DOCUMENTAÇÃO TÉCNICA COMPLETA

## 📋 Índice

- [🏢 Sobre o Projeto](#-sobre-o-projeto)
- [🚀 Funcionalidades](#-funcionalidades)  
- [🎨 Design System](#-design-system)
- [⚡ Performance](#-performance)
- [🛠️ Tecnologias](#️-tecnologias)
- [📁 Estrutura](#-estrutura)
- [🔧 Desenvolvimento](#-desenvolvimento)
- [📱 Responsividade](#-responsividade)
- [♿ Acessibilidade](#-acessibilidade)
- [🔍 SEO](#-seo)
- [📊 Analytics](#-analytics)

## 🏢 Sobre o Projeto

**MC6 Corporate Professional** é um site corporativo especializado em soluções de conectividade, Wi-Fi empresarial e infraestrutura de redes para empresas em Blumenau e Santa Catarina.

### Objetivos
- Apresentar serviços técnicos de forma profissional
- Converter visitantes B2B em leads qualificados
- Estabelecer credibilidade no mercado corporativo
- Otimizar performance e experiência do usuário

### Público-Alvo
- **Gestores de TI** em empresas de médio/grande porte
- **Organizadores de eventos** corporativos
- **Administradores** de condomínios e residências premium
- **Tomadores de decisão** em infraestrutura de TI

## 🚀 Funcionalidades

### Core Features
- ✅ **Landing Page Otimizada** - Conversão focada em B2B
- ✅ **Formulário Inteligente** - Captação de leads qualificados
- ✅ **Cases de Sucesso** - Credibilidade através de resultados
- ✅ **Calculadora de Orçamento** - Estimativa automática de projetos
- ✅ **Galeria de Projetos** - Portfolio visual interativo

### Recursos Técnicos
- ✅ **Progressive Web App (PWA)** - Instalável e offline-capable
- ✅ **Service Worker** - Cache inteligente e performance
- ✅ **Lazy Loading** - Carregamento otimizado de imagens
- ✅ **Critical CSS** - Above-the-fold optimization
- ✅ **Image Optimization** - AVIF/WebP com fallbacks

### Integrações
- ✅ **WhatsApp Business** - Contato direto otimizado
- ✅ **Google Analytics 4** - Tracking avançado
- ✅ **Schema.org** - Rich snippets para SEO
- ✅ **Font Awesome 6.4** - Iconografia profissional

## 🎨 Design System

### Paleta de Cores
```css
/* Cores Primárias */
--primary-blue: #0066cc;     /* Azul corporativo principal */
--primary-dark: #004a99;     /* Azul escuro para hover */
--primary-light: #e6f2ff;    /* Azul claro para backgrounds */

/* Cores Secundárias */
--gray-900: #1a1a1a;         /* Texto principal */
--gray-700: #333333;         /* Texto secundário */
--gray-500: #666666;         /* Texto auxiliar */
--gray-300: #cccccc;         /* Bordas */
--gray-100: #f8f9fa;         /* Backgrounds claros */

/* Cores de Estado */
--success: #10b981;          /* Verde para sucessos */
--warning: #f59e0b;          /* Amarelo para avisos */
--error: #ef4444;            /* Vermelho para erros */
--info: #3b82f6;             /* Azul para informações */
```

### Tipografia
```css
/* Fonte Principal */
font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;

/* Hierarquia */
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 1.875rem;   /* 30px */
--font-size-4xl: 2.25rem;    /* 36px */
--font-size-5xl: 3rem;       /* 48px */

/* Pesos */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Espaçamentos
```css
/* Sistema de Grid 8px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Componentes

#### Botões
```css
.btn-corporate {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.btn-corporate-primary {
  background: var(--primary-blue);
  color: white;
}

.btn-corporate-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}
```

#### Cards
```css
.corporate-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.corporate-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}
```

## ⚡ Performance

### Métricas Alvo (Lighthouse)
- **Performance**: 95+ /100
- **Accessibility**: 95+ /100  
- **Best Practices**: 95+ /100
- **SEO**: 95+ /100

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.0s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Otimizações Implementadas

#### CSS Optimization
- ✅ **Critical CSS Inline** (14KB above-the-fold)
- ✅ **CSS Purging** - Remoção de código não utilizado
- ✅ **Minificação** - Compressão automática
- ✅ **Lazy Loading** - CSS não crítico carregado async

#### JavaScript Optimization  
- ✅ **Code Splitting** - Carregamento modular
- ✅ **Minificação** - Compressão com Terser
- ✅ **Defer Loading** - Scripts não bloqueantes
- ✅ **Tree Shaking** - Remoção de código morto

#### Image Optimization
- ✅ **Format Conversion** - AVIF/WebP com fallbacks
- ✅ **Responsive Images** - Múltiplos breakpoints (320w-1920w)
- ✅ **Lazy Loading** - Intersection Observer
- ✅ **Preload Critical** - Imagem hero otimizada

#### Network Optimization
- ✅ **Resource Hints** - Preconnect, DNS-prefetch
- ✅ **Service Worker** - Cache inteligente
- ✅ **Compression** - Gzip/Brotli support
- ✅ **CDN Ready** - Assets otimizados para distribuição

### Bundle Analysis
```
Arquivo              Tamanho    Comprimido
index.html           46.3KB     12.1KB
style.purged.css     26.9KB     6.8KB  
main-optimized.js    3.2KB      1.4KB
Total Critical:      76.4KB     20.3KB
```

## 🛠️ Tecnologias

### Frontend Stack
- **HTML5** - Semantic markup, accessibility
- **CSS3** - Flexbox, Grid, Custom Properties
- **JavaScript ES6+** - Modern syntax, modules
- **PWA** - Service Worker, Web App Manifest

### Build Tools
- **PostCSS** - CSS processing e optimization  
- **PurgeCSS** - Unused CSS removal
- **Sharp** - Image optimization e conversion
- **Lighthouse** - Performance auditing

### Development Tools
- **Live Server** - Local development server
- **Git** - Version control
- **NPM Scripts** - Task automation
- **VSCode** - IDE com extensões específicas

### External Libraries
```json
"devDependencies": {
  "lighthouse": "^11.0.0",
  "live-server": "^1.2.2", 
  "postcss": "^8.4.31",
  "purgecss": "^7.0.2",
  "sharp": "^0.34.3"
}
```

### CDN Resources
- **Google Fonts** - Inter font family
- **Font Awesome 6.4** - Icon library
- **Preconnect optimization** - Faster loading

## 📁 Estrutura

```
mc6/
├── 📄 index.html                    # Página principal (46.3KB)
├── 📱 manifest-v3.json              # PWA manifest
├── ⚙️ sw-v3.js                      # Service Worker
├── 🔍 robots.txt                    # SEO crawler directives  
├── 🗺️ sitemap.xml                   # SEO sitemap
├── 🖼️ browserconfig.xml             # Windows tile config
├── 📖 README.md                     # Documentação principal
├── 📋 package.json                  # Dependencies e scripts
│
├── 📂 assets/                       # Recursos do projeto
│   ├── 📂 css/
│   │   └── 📄 critical.css          # CSS crítico (inline)
│   ├── 📂 js/
│   │   └── 📄 main-optimized.js     # JavaScript otimizado (3.2KB)
│   └── 📂 media/
│       └── 📂 images/               # Imagens originais
│           ├── 🖼️ logo.webp
│           ├── 🖼️ hero-emp.webp
│           ├── 🖼️ favicon.webp
│           └── 📂 client/           # Cases de clientes
│
├── 📂 dist/                         # Assets de produção
│   ├── 📄 style.purged.css          # CSS final otimizado (26.9KB)
│   ├── 📄 style.purged.css.map      # Source map
│   └── 📂 images/                   # 150 imagens otimizadas
│       ├── 🖼️ hero-emp-320w.avif    # Responsive AVIF
│       ├── 🖼️ hero-emp-320w.webp    # Responsive WebP
│       ├── 🖼️ hero-emp-480w.avif    # Mobile optimization
│       └── 🖼️ ... (96 variants)     # Multiple formats/sizes
│
└── 📂 scripts/                      # Build e maintenance
    ├── 📄 cleanup-project.js        # Limpeza de arquivos
    ├── 📄 day3-final-test.js        # Testes de performance
    ├── 📄 day3-image-optimization.js # Pipeline de imagens
    ├── 📄 extract-critical.js       # Critical CSS extraction
    └── 📄 purge-css.js               # CSS purging
```

### Responsabilidades dos Arquivos

#### Core Files
- `index.html` - Estrutura principal, meta tags, schema.org
- `manifest-v3.json` - PWA configuration, app shortcuts
- `sw-v3.js` - Service Worker com cache strategies

#### Assets Production
- `dist/style.purged.css` - CSS final (27KB → 7KB gzipped)
- `assets/js/main-optimized.js` - JavaScript minificado
- `dist/images/` - Imagens otimizadas (38% size reduction)

#### Development Scripts
- `scripts/purge-css.js` - Remove CSS não utilizado
- `scripts/extract-critical.js` - Gera critical CSS
- `scripts/day3-image-optimization.js` - Otimiza imagens

## 🔧 Desenvolvimento

### Setup Inicial
```bash
# Clone do repositório
git clone https://github.com/betinhochagas/mc6.git
cd mc6

# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev                 # Live server na porta 3000

# Otimização  
npm run css:purge          # Remove CSS não utilizado
npm run critical:extract   # Extrai Critical CSS
npm run images:optimize    # Otimiza todas as imagens

# Testes
npm run lighthouse         # Audit de performance
npm run test              # Testa funcionalidades

# Manutenção
npm run cleanup           # Remove arquivos desnecessários
```

### Workflow de Desenvolvimento
1. **Desenvolvimento local** - `npm run dev`
2. **Otimização CSS** - `npm run css:purge` 
3. **Critical CSS** - `npm run critical:extract`
4. **Otimização imagens** - `npm run images:optimize`
5. **Performance test** - `npm run lighthouse`
6. **Deploy** - Upload files to production

### Git Workflow
```bash
# Feature development
git checkout -b feature/nova-funcionalidade
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade

# Merge to main
git checkout main
git merge feature/nova-funcionalidade
git push origin main
```

## 📱 Responsividade

### Breakpoints System
```css
/* Mobile First Approach */
/* Extra Small - xs: 0px+ */
@media (min-width: 0) { /* Mobile padrão */ }

/* Small - sm: 576px+ */  
@media (min-width: 576px) { /* Mobile grande */ }

/* Medium - md: 768px+ */
@media (min-width: 768px) { /* Tablet */ }

/* Large - lg: 992px+ */
@media (min-width: 992px) { /* Desktop pequeno */ }

/* Extra Large - xl: 1200px+ */
@media (min-width: 1200px) { /* Desktop grande */ }

/* Extra Extra Large - xxl: 1400px+ */
@media (min-width: 1400px) { /* Desktop ultra-wide */ }
```

### Responsive Images
```html
<picture class="responsive-image">
  <!-- Desktop: AVIF format -->
  <source media="(min-width: 768px)" 
          srcset="dist/images/hero-emp-480w.avif" 
          type="image/avif">
  
  <!-- Desktop: WebP fallback -->
  <source media="(min-width: 768px)" 
          srcset="dist/images/hero-emp-480w.webp" 
          type="image/webp">
  
  <!-- Mobile: AVIF format -->
  <source srcset="dist/images/hero-emp-320w.avif" 
          type="image/avif">
  
  <!-- Mobile: WebP fallback -->
  <source srcset="dist/images/hero-emp-320w.webp" 
          type="image/webp">
  
  <!-- Universal fallback -->
  <img src="dist/images/hero-emp-320w.webp" 
       alt="Infraestrutura Wi-Fi Empresarial" 
       loading="eager">
</picture>
```

### Touch Optimization
```css
/* Touch targets 44px+ */
.btn-corporate {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

/* Touch-friendly spacing */
.nav-mobile a {
  padding: 16px 20px;
  min-height: 48px;
}

/* Hover states disabled on touch */
@media (hover: none) {
  .card:hover {
    transform: none;
  }
}
```

## ♿ Acessibilidade

### WCAG 2.1 Level AA Compliance

#### Semantic HTML
```html
<!-- Landmark roles -->
<header role="banner">
<nav role="navigation" aria-label="Menu principal">
<main role="main">
<section aria-labelledby="services-title">
<footer role="contentinfo">

<!-- Headings hierarchy -->
<h1>Título principal da página</h1>
  <h2>Seção de serviços</h2>
    <h3>Wi-Fi Corporativo</h3>
    <h3>Cabeamento Estruturado</h3>
```

#### Keyboard Navigation
```css
/* Focus indicators */
*:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -999px;
  left: 0;
  background: #0066cc;
  color: white;
  padding: 8px;
  z-index: 1000;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}
```

#### Screen Reader Support
```html
<!-- Alt texts descritivos -->
<img src="logo.webp" alt="MC6 - Soluções em conectividade corporativa">

<!-- ARIA labels -->
<button aria-label="Abrir menu principal" 
        aria-expanded="false" 
        aria-controls="menu-mobile">
  
<!-- ARIA live regions -->
<div aria-live="polite" id="form-status"></div>

<!-- Hidden content for screen readers -->
<span class="sr-only">Abrindo em nova aba</span>
```

#### Color Contrast
- **Normal text**: 4.5:1 minimum ratio
- **Large text**: 3:1 minimum ratio  
- **Interactive elements**: 3:1 minimum ratio

```css
/* High contrast combinations */
.text-primary { color: #1a1a1a; } /* 16.04:1 on white */
.text-secondary { color: #333333; } /* 12.63:1 on white */
.btn-primary { background: #0066cc; color: white; } /* 7.84:1 */
```

## 🔍 SEO

### Technical SEO

#### Meta Tags Optimization
```html
<!-- Primary meta tags -->
<title>MC6 | Wi-Fi Corporativo e Redes em Blumenau e SC</title>
<meta name="description" content="MC6 oferece soluções completas de Wi-Fi corporativo, infraestrutura de redes e cabeamento estruturado em Blumenau e SC. Equipamentos Ubiquiti/UniFi, suporte 24/7.">
<meta name="keywords" content="wi-fi corporativo, redes empresariais, cabeamento estruturado, ubiquiti, unifi, blumenau, santa catarina">

<!-- Open Graph / Facebook -->
<meta property="og:title" content="MC6 - Wi-Fi Corporativo e Redes em Blumenau e SC">
<meta property="og:description" content="Especialistas em redes de alta performance e segurança para empresas, eventos e indústrias.">
<meta property="og:image" content="assets/media/images/logo.webp">
<meta property="og:url" content="https://www.mc6.com.br">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="MC6 - Wi-Fi Corporativo e Redes">
<meta name="twitter:description" content="Especialistas em redes de alta performance para empresas, eventos e residências.">

<!-- Canonical URL -->
<link rel="canonical" href="https://www.mc6.com.br">
```

#### Structured Data (Schema.org)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "MC6",
  "description": "Especialistas em conectividade, Wi-Fi corporativo e infraestrutura de redes",
  "url": "https://www.mc6.com.br",
  "telephone": "+55-47-3288-3002",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Blumenau",
    "addressRegion": "SC", 
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-26.9194",
    "longitude": "-49.0661"
  },
  "serviceArea": "Santa Catarina, Brasil",
  "priceRange": "$$",
  "openingHours": "Mo-Fr 08:00-18:00",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Serviços de TI e Conectividade",
    "itemListElement": [...]
  }
}
```

#### Content Strategy

**Palavras-chave Primary**
- wi-fi corporativo blumenau
- redes empresariais santa catarina
- cabeamento estruturado sc
- infraestrutura ti blumenau

**Long-tail Keywords**
- instalação wi-fi empresarial blumenau
- cabeamento estruturado cat6 santa catarina
- suporte técnico redes corporativas
- projeto wifi eventos corporativos

**Content Clusters**
1. **Wi-Fi Corporativo** (pillar page)
   - Instalação wi-fi empresarial
   - Gestão de redes wireless
   - Segurança wifi corporativo
   
2. **Cabeamento Estruturado** (pillar page)
   - Certificação cabeamento cat6
   - Projeto fibra óptica
   - Infraestrutura de rede

3. **Suporte Técnico** (pillar page)
   - Monitoramento 24/7
   - Manutenção preventiva
   - Help desk especializado

## 📊 Analytics

### Google Analytics 4 Setup
```html
<!-- Global Site Tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID', {
    page_title: 'MC6 Corporate',
    page_location: window.location.href,
    custom_map: {
      'custom_parameter_1': 'lead_source'
    }
  });
</script>
```

### Custom Events Tracking
```javascript
// Form submission tracking
function trackFormSubmission(formType) {
  gtag('event', 'form_submit', {
    event_category: 'engagement',
    event_label: formType,
    value: 1
  });
}

// CTA clicks tracking  
function trackCTAClick(ctaType, ctaLocation) {
  gtag('event', 'cta_click', {
    event_category: 'conversion',
    event_label: `${ctaType}_${ctaLocation}`,
    value: 1
  });
}

// Phone click tracking
function trackPhoneClick() {
  gtag('event', 'phone_click', {
    event_category: 'lead_generation',
    event_label: 'header_phone',
    value: 1
  });
}

// WhatsApp click tracking
function trackWhatsAppClick() {
  gtag('event', 'whatsapp_click', {
    event_category: 'lead_generation', 
    event_label: 'floating_button',
    value: 1
  });
}
```

### Key Performance Indicators (KPIs)

#### Business Metrics
- **Lead Generation Rate** - Formulários enviados/visitantes
- **Phone Call Rate** - Cliques no telefone/visitantes  
- **WhatsApp Conversion** - Cliques WhatsApp/visitantes
- **Page Engagement** - Tempo na página, scroll depth

#### Technical Metrics
- **Core Web Vitals** - LCP, FID, CLS
- **Page Speed Score** - Lighthouse performance
- **Mobile Usability** - Mobile-friendly test
- **SEO Score** - Lighthouse SEO score

#### Conversion Funnel
1. **Awareness** - Organic search, direct traffic
2. **Interest** - Página visitada, tempo >30s
3. **Consideration** - Seção serviços visualizada
4. **Intent** - Formulário iniciado
5. **Action** - Formulário enviado/telefone clicado

### Conversion Optimization

#### A/B Testing Areas
- **Hero CTA Text** - "Solicitar Orçamento" vs "Falar com Especialista"
- **Form Length** - Campos essenciais vs formulário completo
- **Value Proposition** - Benefícios vs características técnicas
- **Social Proof** - Cases vs testimonials vs métricas

#### Heat Mapping
- **Hotjar Integration** - Análise de comportamento
- **Click Tracking** - Elementos mais clicados
- **Scroll Maps** - Pontos de abandono da página
- **Form Analytics** - Campos problemáticos

---

## 🎯 Conclusão

O **MC6 Corporate Professional** representa uma solução completa de website corporativo, combinando design profissional, performance otimizada e funcionalidades avançadas para o mercado B2B de infraestrutura de TI.

### Principais Diferenciais
- ✅ **Performance Superior** - 95+ Lighthouse Score
- ✅ **Design Corporativo** - Visual profissional e credível  
- ✅ **Otimização Avançada** - PWA, Service Worker, Image Optimization
- ✅ **SEO Completo** - Estrutura otimizada para buscadores
- ✅ **Acessibilidade WCAG** - Inclusivo e acessível
- ✅ **Analytics Integrado** - Tracking completo de conversões

### Próximos Desenvolvimentos
- **Dashboard Analytics** - Métricas em tempo real
- **Chat Integration** - Suporte técnico automatizado
- **Blog Técnico** - Content marketing SEO
- **Portal do Cliente** - Área restrita com relatórios

**Versão atual**: 3.0.0 - Clean Production Version
**Status**: ✅ Produção - Otimizado e operacional
