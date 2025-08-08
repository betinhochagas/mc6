// MC6 - Core Web Vitals Optimization
// Melhorias específicas para LCP, FID e CLS

class WebVitalsOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeLCP();
    this.optimizeFID();
    this.optimizeCLS();
    this.setupWebVitalsTracking();
  }

  // Largest Contentful Paint Optimization
  optimizeLCP() {
    // 1. Preload critical images
    this.preloadCriticalImages();
    
    // 2. Optimize image loading
    this.setupLazyLoading();
    
    // 3. Remove render-blocking resources
    this.deferNonCriticalCSS();
  }

  preloadCriticalImages() {
    const heroImage = document.querySelector('.hero img, .hero-section img');
    if (heroImage) {
      const src = heroImage.src || heroImage.dataset.src;
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'image';
      preload.href = src;
      document.head.appendChild(preload);
    }
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });

      images.forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  deferNonCriticalCSS() {
    const nonCriticalStyles = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    nonCriticalStyles.forEach(link => {
      if (link.media !== 'print') {
        link.media = 'print';
        link.onload = function() {
          this.media = 'all';
        };
      }
    });
  }

  // First Input Delay Optimization
  optimizeFID() {
    // 1. Use passive event listeners
    this.addPassiveEventListeners();
    
    // 2. Break up long tasks
    this.breakUpLongTasks();
    
    // 3. Defer non-essential JavaScript
    this.deferNonEssentialJS();
  }

  addPassiveEventListeners() {
    const events = ['scroll', 'touchstart', 'touchmove', 'wheel'];
    events.forEach(event => {
      document.addEventListener(event, this.handleEvent.bind(this), { passive: true });
    });
  }

  handleEvent(e) {
    // Handle events without preventing default
    switch(e.type) {
      case 'scroll':
        this.handleScroll(e);
        break;
      case 'touchstart':
      case 'touchmove':
        this.handleTouch(e);
        break;
    }
  }

  handleScroll(e) {
    // Throttled scroll handling
    if (!this.scrollTimer) {
      this.scrollTimer = setTimeout(() => {
        // Scroll logic here
        this.updateScrollPosition();
        this.scrollTimer = null;
      }, 16); // ~60fps
    }
  }

  handleTouch(e) {
    // Touch handling logic
  }

  breakUpLongTasks() {
    // Use scheduler API or setTimeout to yield to browser
    const yieldToMain = () => {
      return new Promise(resolve => {
        setTimeout(resolve, 0);
      });
    };

    // Example: Break up heavy initialization
    const heavyTasks = [
      () => this.initializeAnalytics(),
      () => this.initializeAnimations(),
      () => this.initializeThirdPartyScripts()
    ];

    const runTasks = async () => {
      for (const task of heavyTasks) {
        await task();
        await yieldToMain();
      }
    };

    requestIdleCallback ? requestIdleCallback(runTasks) : setTimeout(runTasks, 0);
  }

  deferNonEssentialJS() {
    // Defer analytics and other non-critical scripts
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.src = script.src;
      newScript.defer = true;
      document.head.appendChild(newScript);
      script.remove();
    });
  }

  // Cumulative Layout Shift Optimization
  optimizeCLS() {
    // 1. Set explicit dimensions for images
    this.setImageDimensions();
    
    // 2. Reserve space for ads/dynamic content
    this.reserveSpaceForDynamicContent();
    
    // 3. Avoid inserting content above existing content
    this.optimizeContentInsertion();
  }

  setImageDimensions() {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      // Use aspect-ratio CSS for modern browsers
      if (CSS.supports('aspect-ratio', '16/9')) {
        img.style.aspectRatio = '16/9';
        img.style.width = '100%';
        img.style.height = 'auto';
      } else {
        // Fallback: Use intrinsic ratio boxes
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.paddingBottom = '56.25%'; // 16:9 aspect ratio
        wrapper.style.height = '0';
        wrapper.style.overflow = 'hidden';
        
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      }
    });
  }

  reserveSpaceForDynamicContent() {
    // Add placeholders for dynamic content
    const dynamicSections = document.querySelectorAll('[data-dynamic]');
    dynamicSections.forEach(section => {
      const minHeight = section.dataset.minHeight || '200px';
      section.style.minHeight = minHeight;
    });
  }

  optimizeContentInsertion() {
    // Override common DOM insertion methods to append by default
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
      // Only allow insertBefore for specific cases
      if (this.dataset.allowInsertBefore) {
        return originalInsertBefore.call(this, newNode, referenceNode);
      }
      // Default to appendChild to avoid layout shift
      return this.appendChild(newNode);
    };
  }

  updateScrollPosition() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Update parallax elements if any
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(element => {
      element.style.transform = `translateY(${rate}px)`;
    });
  }

  initializeAnalytics() {
    // Deferred analytics initialization
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  initializeAnimations() {
    // Initialize non-critical animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      element.classList.add('animate-ready');
    });
  }

  initializeThirdPartyScripts() {
    // Initialize third-party scripts that are not critical
    this.loadWhatsAppWidget();
    this.loadSocialWidgets();
  }

  loadWhatsAppWidget() {
    // Load WhatsApp widget with intersection observer
    const whatsappTrigger = document.querySelector('[data-whatsapp]');
    if (whatsappTrigger) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.initWhatsAppWidget();
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(whatsappTrigger);
    }
  }

  initWhatsAppWidget() {
    // WhatsApp widget initialization logic
  }

  loadSocialWidgets() {
    // Load social media widgets on demand
  }

  setupWebVitalsTracking() {
    // Import and use web-vitals library if available
    if (typeof webVitals !== 'undefined') {
      webVitals.getCLS(this.sendToAnalytics);
      webVitals.getFID(this.sendToAnalytics);
      webVitals.getFCP(this.sendToAnalytics);
      webVitals.getLCP(this.sendToAnalytics);
      webVitals.getTTFB(this.sendToAnalytics);
    } else {
      // Manual web vitals tracking
      this.trackWebVitalsManually();
    }
  }

  sendToAnalytics(metric) {
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
        custom_parameters: {
          metric_value: metric.value,
          metric_delta: metric.delta,
          metric_rating: metric.rating || 'unknown'
        }
      });
    }
  }

  trackWebVitalsManually() {
    // Manual LCP tracking
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.sendToAnalytics({
        name: 'LCP',
        value: lastEntry.startTime,
        id: 'manual-lcp',
        rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor'
      });
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });

    // Manual FID tracking
    const firstInputObserver = new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0];
      if (firstInput) {
        const fid = firstInput.processingStart - firstInput.startTime;
        
        this.sendToAnalytics({
          name: 'FID',
          value: fid,
          id: 'manual-fid',
          rating: fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor'
        });
      }
    });

    firstInputObserver.observe({ type: 'first-input', buffered: true });
  }
}

// Critical CSS Inliner Helper
class CriticalCSSHelper {
  static inline() {
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      .hero-section {
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      }
      
      .hero-title {
        font-size: clamp(2rem, 5vw, 4rem);
        font-weight: 700;
        color: white;
        text-align: center;
        margin-bottom: 1rem;
      }
      
      .hero-subtitle {
        font-size: clamp(1.125rem, 2.5vw, 1.5rem);
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        margin-bottom: 2rem;
      }
      
      .btn-primary {
        display: inline-block;
        padding: 1rem 2rem;
        background: var(--color-accent);
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        transition: transform 0.2s ease;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
      }
      
      /* Skeleton loading for images */
      img[data-src] {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      img.loaded {
        animation: none;
        background: none;
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.appendChild(style);
  }
}

// Initialize optimization
document.addEventListener('DOMContentLoaded', () => {
  // Inline critical CSS first
  CriticalCSSHelper.inline();
  
  // Initialize Web Vitals optimization
  new WebVitalsOptimizer();
});

// Preload critical resources
document.addEventListener('DOMContentLoaded', () => {
  // Preload critical fonts
  const fontPreloads = [
    '/assets/fonts/inter-var.woff2',
    '/assets/fonts/inter-bold.woff2'
  ];
  
  fontPreloads.forEach(font => {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'font';
    preload.type = 'font/woff2';
    preload.href = font;
    preload.crossOrigin = 'anonymous';
    document.head.appendChild(preload);
  });
});

export { WebVitalsOptimizer, CriticalCSSHelper };
