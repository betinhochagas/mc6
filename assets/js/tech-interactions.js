// MC6 - Advanced Tech Interactions & Animations
// High-tech micro-interactions with corporate professionalism

class TechInteractionSystem {
  constructor() {
    this.init();
    this.setupAnimationObservers();
    this.createParticleSystem();
    this.initNeuralNetwork();
    this.setupTechCursors();
  }

  init() {
    this.addTechElements();
    this.setupHoverEffects();
    this.initCounterAnimations();
    this.setupScrollTriggers();
  }

  addTechElements() {
    // Add tech enhancement to existing elements
    const cards = document.querySelectorAll('.service-card, .client-card');
    cards.forEach(card => {
      card.classList.add('tech-card');
      this.addHolographicBorder(card);
      this.addTechIcon(card);
    });

    // Enhance buttons
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(btn => {
      if (!btn.classList.contains('tech-enhanced')) {
        btn.classList.add('neo-button', 'tech-enhanced');
        this.addButtonRipple(btn);
      }
    });

    // Add glass morphism to navigation
    const nav = document.querySelector('nav, .navigation');
    if (nav) {
      nav.classList.add('glass-navigation');
    }
  }

  addHolographicBorder(element) {
    const borderWrapper = document.createElement('div');
    borderWrapper.className = 'holographic-border';
    
    element.parentNode.insertBefore(borderWrapper, element);
    borderWrapper.appendChild(element);
    
    // Add interaction
    borderWrapper.addEventListener('mouseenter', () => {
      borderWrapper.style.animationDuration = '0.5s';
    });
    
    borderWrapper.addEventListener('mouseleave', () => {
      borderWrapper.style.animationDuration = '3s';
    });
  }

  addTechIcon(card) {
    const existingIcon = card.querySelector('.icon, .service-icon');
    if (existingIcon && !existingIcon.classList.contains('tech-card-icon')) {
      existingIcon.classList.add('tech-card-icon');
      
      // Add shimmer effect on hover
      card.addEventListener('mouseenter', () => {
        existingIcon.style.animationPlayState = 'running';
      });
    }
  }

  addButtonRipple(button) {
    button.addEventListener('click', (e) => {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(0, 102, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: techRipple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
      `;
      
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }

  setupHoverEffects() {
    // Advanced hover effects for tech cards
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
      let hoverTimeout;
      
      card.addEventListener('mouseenter', (e) => {
        clearTimeout(hoverTimeout);
        this.createHoverParticles(e.target);
        this.animateCardContent(e.target, 'enter');
      });
      
      card.addEventListener('mouseleave', (e) => {
        hoverTimeout = setTimeout(() => {
          this.animateCardContent(e.target, 'leave');
        }, 100);
      });
      
      // Add 3D tilt effect
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / 10;
        const deltaY = (e.clientY - centerY) / 10;
        
        card.style.transform = `
          perspective(1000px) 
          rotateY(${deltaX}deg) 
          rotateX(${-deltaY}deg) 
          translateZ(20px)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
      });
    });
  }

  createHoverParticles(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'hover-particle';
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: linear-gradient(45deg, #0066ff, #00d4ff);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${rect.left + Math.random() * rect.width}px;
        top: ${rect.top + Math.random() * rect.height}px;
        animation: particleExplode 1s ease-out forwards;
      `;
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
  }

  animateCardContent(card, direction) {
    const title = card.querySelector('h2, h3, .card-title');
    const content = card.querySelector('p, .card-content');
    const icon = card.querySelector('.tech-card-icon, .icon');
    
    if (direction === 'enter') {
      if (title) {
        title.style.transform = 'translateY(-5px)';
        title.style.color = '#0066ff';
      }
      if (content) {
        content.style.opacity = '0.8';
        content.style.transform = 'translateY(-3px)';
      }
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
      }
    } else {
      if (title) {
        title.style.transform = 'translateY(0)';
        title.style.color = '';
      }
      if (content) {
        content.style.opacity = '';
        content.style.transform = 'translateY(0)';
      }
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0)';
      }
    }
  }

  initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => {
      counter.classList.add('tech-counter');
      counterObserver.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }

  setupScrollTriggers() {
    const sections = document.querySelectorAll('section');
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('tech-animate-in');
          this.triggerSectionAnimation(entry.target);
        }
      });
    }, { threshold: 0.2 });

    sections.forEach(section => scrollObserver.observe(section));
  }

  triggerSectionAnimation(section) {
    const elements = section.querySelectorAll('.tech-card, .neo-button, .tech-display');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animation = `techSlideIn 0.6s ease-out forwards`;
        el.style.animationDelay = `${index * 0.1}s`;
      }, index * 100);
    });
  }

  createParticleSystem() {
    const heroSection = document.querySelector('.hero, .hero-section');
    if (!heroSection) return;

    heroSection.classList.add('hero-tech');
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-system';
    heroSection.appendChild(particleContainer);

    // Create floating particles
    setInterval(() => {
      if (document.querySelectorAll('.particle').length < 15) {
        this.createParticle(particleContainer);
      }
    }, 800);
  }

  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    
    container.appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, 5000);
  }

  initNeuralNetwork() {
    const heroSection = document.querySelector('.hero-tech');
    if (!heroSection) return;

    const networkContainer = document.createElement('div');
    networkContainer.className = 'neural-network';
    heroSection.appendChild(networkContainer);

    // Create nodes
    for (let i = 0; i < 8; i++) {
      const node = document.createElement('div');
      node.className = 'neural-node';
      node.style.top = Math.random() * 80 + 10 + '%';
      node.style.left = Math.random() * 80 + 10 + '%';
      node.style.animationDelay = Math.random() * 3 + 's';
      networkContainer.appendChild(node);
    }

    // Create connections
    this.createNeuralConnections(networkContainer);
  }

  createNeuralConnections(container) {
    const nodes = container.querySelectorAll('.neural-node');
    
    nodes.forEach((node, index) => {
      if (index < nodes.length - 1) {
        const nextNode = nodes[index + 1];
        const connection = document.createElement('div');
        connection.className = 'neural-connection';
        
        const rect1 = node.getBoundingClientRect();
        const rect2 = nextNode.getBoundingClientRect();
        
        const distance = Math.sqrt(
          Math.pow(rect2.left - rect1.left, 2) + 
          Math.pow(rect2.top - rect1.top, 2)
        );
        
        const angle = Math.atan2(
          rect2.top - rect1.top, 
          rect2.left - rect1.left
        ) * 180 / Math.PI;
        
        connection.style.width = distance + 'px';
        connection.style.left = rect1.left + 'px';
        connection.style.top = rect1.top + 'px';
        connection.style.transform = `rotate(${angle}deg)`;
        connection.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(connection);
      }
    });
  }

  setupTechCursors() {
    // Custom cursor effects for tech elements
    const techElements = document.querySelectorAll('.tech-card, .neo-button, .tech-display');
    
    techElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'none';
        this.createCustomCursor();
      });
      
      element.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
        this.removeCustomCursor();
      });
    });
  }

  createCustomCursor() {
    if (document.querySelector('.tech-cursor')) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'tech-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, #0066ff, #00d4ff);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      mix-blend-mode: difference;
      animation: techCursorPulse 1s ease-in-out infinite alternate;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', this.updateCursor);
  }

  updateCursor(e) {
    const cursor = document.querySelector('.tech-cursor');
    if (cursor) {
      cursor.style.left = e.clientX - 10 + 'px';
      cursor.style.top = e.clientY - 10 + 'px';
    }
  }

  removeCustomCursor() {
    const cursor = document.querySelector('.tech-cursor');
    if (cursor) {
      cursor.remove();
      document.removeEventListener('mousemove', this.updateCursor);
    }
  }

  setupAnimationObservers() {
    // Performance-aware animation observer
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      // Disable complex animations for accessibility
      document.documentElement.style.setProperty('--ease-tech', 'ease');
      document.documentElement.style.setProperty('--ease-elastic', 'ease');
      return;
    }

    // Add custom CSS animations
    this.injectTechAnimations();
  }

  injectTechAnimations() {
    const animations = `
      <style id="tech-animations">
        @keyframes techRipple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes particleExplode {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(3) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes techSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes techCursorPulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.5); }
        }
        
        .tech-animate-in * {
          animation-fill-mode: forwards;
        }
        
        /* Smooth transitions for all tech elements */
        .tech-card,
        .neo-button,
        .tech-display,
        .tech-input,
        .holographic-border {
          transition: all 0.3s var(--ease-tech);
        }
        
        /* Loading state animations */
        .tech-loading-pulse {
          animation: techPulse 1.5s ease-in-out infinite;
        }
        
        @keyframes techPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Glitch effect for special elements */
        .tech-glitch {
          position: relative;
        }
        
        .tech-glitch::before,
        .tech-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .tech-glitch::before {
          animation: techGlitch1 0.5s infinite linear alternate-reverse;
          color: #ff0000;
          z-index: -1;
        }
        
        .tech-glitch::after {
          animation: techGlitch2 0.5s infinite linear alternate-reverse;
          color: #00ffff;
          z-index: -2;
        }
        
        @keyframes techGlitch1 {
          0% { clip: rect(64px, 9999px, 66px, 0); }
          5% { clip: rect(30px, 9999px, 36px, 0); }
          10% { clip: rect(90px, 9999px, 96px, 0); }
          15% { clip: rect(10px, 9999px, 16px, 0); }
          20% { clip: rect(40px, 9999px, 46px, 0); }
          25% { clip: rect(80px, 9999px, 86px, 0); }
          30% { clip: rect(20px, 9999px, 26px, 0); }
          35% { clip: rect(60px, 9999px, 66px, 0); }
          40% { clip: rect(50px, 9999px, 56px, 0); }
          45% { clip: rect(70px, 9999px, 76px, 0); }
          50% { clip: rect(35px, 9999px, 41px, 0); }
        }
        
        @keyframes techGlitch2 {
          0% { clip: rect(65px, 9999px, 69px, 0); }
          5% { clip: rect(25px, 9999px, 32px, 0); }
          10% { clip: rect(85px, 9999px, 92px, 0); }
          15% { clip: rect(15px, 9999px, 22px, 0); }
          20% { clip: rect(45px, 9999px, 52px, 0); }
          25% { clip: rect(75px, 9999px, 82px, 0); }
          30% { clip: rect(15px, 9999px, 22px, 0); }
          35% { clip: rect(55px, 9999px, 62px, 0); }
          40% { clip: rect(45px, 9999px, 52px, 0); }
          45% { clip: rect(65px, 9999px, 72px, 0); }
          50% { clip: rect(25px, 9999px, 32px, 0); }
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', animations);
  }
}

// Enhanced Form System with Tech Aesthetics
class TechFormSystem {
  constructor() {
    this.init();
  }

  init() {
    this.enhanceForms();
    this.setupTechInputs();
    this.addFormAnimations();
  }

  enhanceForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.classList.add('tech-form');
      this.wrapFormWithGlass(form);
    });
  }

  wrapFormWithGlass(form) {
    const wrapper = document.createElement('div');
    wrapper.className = 'glass-card tech-form-wrapper';
    form.parentNode.insertBefore(wrapper, form);
    wrapper.appendChild(form);
  }

  setupTechInputs() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.classList.add('tech-input');
      this.addTechLabel(input);
      this.addFocusEffects(input);
    });
  }

  addTechLabel(input) {
    const existingLabel = document.querySelector(`label[for="${input.id}"]`);
    if (existingLabel) {
      existingLabel.classList.add('tech-input-label');
    }
  }

  addFocusEffects(input) {
    input.addEventListener('focus', () => {
      input.closest('.glass-card')?.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      input.closest('.glass-card')?.classList.remove('focused');
    });
  }

  addFormAnimations() {
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (button.form?.checkValidity()) {
          this.showSubmissionAnimation(button);
        }
      });
    });
  }

  showSubmissionAnimation(button) {
    button.classList.add('tech-loading');
    button.textContent = 'Processando...';
    
    // Simulate processing time
    setTimeout(() => {
      button.classList.remove('tech-loading');
      button.classList.add('tech-success');
      button.textContent = '✓ Enviado!';
      
      setTimeout(() => {
        button.classList.remove('tech-success');
        button.textContent = 'Enviar';
      }, 3000);
    }, 2000);
  }
}

// Initialize Tech System when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TechInteractionSystem();
  new TechFormSystem();
});

// Performance monitoring
if (typeof PerformanceObserver !== 'undefined') {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure' && entry.name.startsWith('tech-')) {
        console.log(`Tech Animation: ${entry.name} took ${entry.duration}ms`);
      }
    }
  });
  
  observer.observe({ entryTypes: ['measure'] });
}

export { TechInteractionSystem, TechFormSystem };
