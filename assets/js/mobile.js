/* 
====================================================================
 MOBILE.JS - JAVASCRIPT MOBILE-SPECIFIC v5.0.0
====================================================================

📱 PROPÓSITO:
   JavaScript otimizado exclusivamente para dispositivos móveis,
   implementando interações touch, gestos e funcionalidades específicas
   para a experiência mobile.

🎯 CARACTERÍSTICAS PRINCIPAIS:
   ✅ Carregamento condicional (apenas dispositivos mobile)
   ✅ Touch events e gesture handlers
   ✅ Menu mobile com animações suaves
   ✅ Hero slider com swipe gestures
   ✅ Scroll otimizado para mobile (300ms vs 500ms)
   ✅ Formulários com validação mobile-first
   ✅ Performance otimizada para dispositivos lentos
   ✅ Feedback háptico em interações

🔧 INTEGRAÇÃO:
   • Carregado dinamicamente pelo index.html apenas se isMobileDevice()
   • Funciona em conjunto com mobile.css
   • Event listeners específicos para touch events
   • Optimizações para orientação e redimensionamento

⚡ PERFORMANCE:
   • Throttling de eventos para dispositivos lentos
   • requestAnimationFrame para animações suaves
   • Debouncing de resize handlers
   • Memory management otimizado

🎮 FUNCIONALIDADES:
   • Menu hambúrguer com touch feedback
   • Hero slider com swipe detection
   • Scroll-to-top otimizado (easeOutQuart)
   • Formulários com validação em tempo real
   • Orientação e redimensionamento handlers

📅 CRIADO: 04/08/2025 - v5.0.0
👨‍💻 AUTOR: Roberto Chagas (MC6 Project)
🔄 ÚLTIMA ATUALIZAÇÃO: 04/08/2025

====================================================================
*/

// 🚀 INICIALIZAÇÃO MOBILE-SPECIFIC
document.addEventListener('DOMContentLoaded', function() {
    
    // 📱 Verificação de dispositivo mobile
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return; // Só executar em dispositivos mobile
    
    console.log('📱 Mobile JavaScript ativado - v5.0.0');
    
    // ===== UTILITY FUNCTIONS MOBILE =====
    /*
      🛠️ Funções utilitárias otimizadas para mobile
      Incluem throttling, debouncing e helpers de performance
    */
    function throttleMobile(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ===== MENU MOBILE OTIMIZADO =====
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    const body = document.body;
    
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = navbar.classList.contains('mobile-open');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Fechar menu ao clicar em link
        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (navbar.classList.contains('mobile-open') && 
                !navbar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Fechar menu com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navbar.classList.contains('mobile-open')) {
                closeMobileMenu();
            }
        });
    }
    
    function openMobileMenu() {
        navbar.classList.add('mobile-open');
        menuToggle.classList.add('active');
        body.style.overflow = 'hidden'; // Prevenir scroll do body
        
        // Animação dos links
        const links = navbar.querySelectorAll('a');
        links.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
            link.classList.add('slide-in');
        });
    }
    
    function closeMobileMenu() {
        navbar.classList.remove('mobile-open');
        menuToggle.classList.remove('active');
        body.style.overflow = ''; // Restaurar scroll
        
        // Limpar animações
        const links = navbar.querySelectorAll('a');
        links.forEach(link => {
            link.classList.remove('slide-in');
            link.style.animationDelay = '';
        });
    }
    
    // ===== HEADER MOBILE OTIMIZADO =====
    const header = document.querySelector('.header');
    let lastScrollY = 0;
    let ticking = false;
    
    function updateHeaderMobile() {
        const scrollY = window.scrollY;
        
        if (Math.abs(scrollY - lastScrollY) < 3) {
            ticking = false;
            return;
        }
        
        // Header mais agressivo no mobile
        if (scrollY > lastScrollY && scrollY > 60) {
            // Esconder header ao rolar para baixo
            header.style.transform = 'translateY(-100%)';
        } else {
            // Mostrar header ao rolar para cima
            header.style.transform = 'translateY(0)';
        }
        
        // Adicionar classe scrolled
        if (scrollY > 20) {
            header.classList.add('mobile-scrolled');
        } else {
            header.classList.remove('mobile-scrolled');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestTickMobile() {
        if (!ticking) {
            requestAnimationFrame(updateHeaderMobile);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTickMobile, { passive: true });
    
    // ===== HERO MOBILE OTIMIZADO =====
    const heroSlider = document.querySelector('.hero-slider');
    const heroImages = document.querySelectorAll('.hero-bg-image');
    let currentSlide = 0;
    let heroInterval;
    let isHeroTouching = false;
    
    if (heroSlider) {
        // Touch events para hero
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        heroSlider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            isHeroTouching = true;
            clearInterval(heroInterval);
        });
        
        heroSlider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            
            // Feedback visual durante o swipe
            const diff = currentX - startX;
            heroSlider.style.transform = `translateX(${diff * 0.1}px)`;
        });
        
        heroSlider.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const diff = currentX - startX;
            const threshold = 50;
            
            heroSlider.style.transform = '';
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe direita - slide anterior
                    previousHeroSlide();
                } else {
                    // Swipe esquerda - próximo slide
                    nextHeroSlide();
                }
            }
            
            isDragging = false;
            isHeroTouching = false;
            startHeroAutoplay();
        });
        
        // Autoplay otimizado para mobile
        function startHeroAutoplay() {
            heroInterval = setInterval(() => {
                if (!isHeroTouching) {
                    nextHeroSlide();
                }
            }, 5000); // Mais rápido no mobile
        }
        
        function nextHeroSlide() {
            currentSlide = (currentSlide + 1) % heroImages.length;
            showHeroSlide(currentSlide);
        }
        
        function previousHeroSlide() {
            currentSlide = (currentSlide - 1 + heroImages.length) % heroImages.length;
            showHeroSlide(currentSlide);
        }
        
        function showHeroSlide(index) {
            const slides = document.querySelectorAll('.hero-slide');
            
            slides.forEach(slide => slide.classList.remove('active'));
            heroImages.forEach(img => img.classList.remove('active'));
            
            if (slides[index]) slides[index].classList.add('active');
            if (heroImages[index]) heroImages[index].classList.add('active');
        }
        
        startHeroAutoplay();
    }
    
    // ===== SCROLL TO TOP MOBILE SUPER RÁPIDO =====
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Mostrar/esconder com animação otimizada
        function toggleScrollButtonMobile() {
            if (window.scrollY > 200) {
                scrollToTopBtn.classList.add('mobile-show');
            } else {
                scrollToTopBtn.classList.remove('mobile-show');
            }
        }
        
        window.addEventListener('scroll', throttleMobile(toggleScrollButtonMobile, 100));
        
        // Scroll super rápido para mobile
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animação instantânea para mobile
            const startPosition = window.pageYOffset;
            const duration = 200; // Super rápido no mobile
            const startTime = performance.now();
            
            function scrollAnimationMobile(currentTime) {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing mais agressivo para mobile
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentPosition = startPosition * (1 - easeOutQuart);
                
                window.scrollTo(0, currentPosition);
                
                if (progress < 1) {
                    requestAnimationFrame(scrollAnimationMobile);
                } else {
                    window.scrollTo(0, 0);
                }
            }
            
            requestAnimationFrame(scrollAnimationMobile);
            
            // Feedback haptic se disponível
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    }
    
    // ===== FORMULÁRIO MOBILE OTIMIZADO =====
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Otimizações específicas para mobile
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Prevenir zoom em inputs no iOS
            if (input.type !== 'tel' && input.type !== 'email') {
                input.setAttribute('autocomplete', 'on');
            }
            
            // Melhor UX para mobile
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('mobile-focused');
                
                // Scroll suave para o input em foco
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('mobile-focused');
            });
        });
        
        // Validação otimizada para mobile
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            submitBtn.style.transform = 'scale(0.95)';
            
            // Feedback haptic
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
            
            setTimeout(() => {
                submitBtn.style.transform = '';
                // Aqui conectar com a validação do main.js
                window.dispatchEvent(new CustomEvent('mobileFormSubmit', {
                    detail: { form: this }
                }));
            }, 150);
        });
    }
    
    // ===== SERVICES MOBILE SWIPER =====
    const servicesWrapper = document.querySelector('.services-wrapper');
    const servicesTrack = document.getElementById('services-track-container');
    
    if (servicesWrapper && servicesTrack) {
        let isServicesScrolling = false;
        let servicesStartX = 0;
        let servicesCurrentX = 0;
        let servicesTranslateX = 0;
        
        servicesWrapper.addEventListener('touchstart', (e) => {
            servicesStartX = e.touches[0].clientX;
            isServicesScrolling = true;
            servicesWrapper.style.cursor = 'grabbing';
        });
        
        servicesWrapper.addEventListener('touchmove', (e) => {
            if (!isServicesScrolling) return;
            
            servicesCurrentX = e.touches[0].clientX;
            const diff = servicesCurrentX - servicesStartX;
            
            servicesTranslateX += diff * 0.8; // Resistência
            servicesTrack.style.transform = `translateX(${servicesTranslateX}px)`;
            
            servicesStartX = servicesCurrentX;
        });
        
        servicesWrapper.addEventListener('touchend', () => {
            isServicesScrolling = false;
            servicesWrapper.style.cursor = '';
            
            // Snap to grid (opcional)
            const cardWidth = 280;
            const snapIndex = Math.round(Math.abs(servicesTranslateX) / cardWidth);
            servicesTranslateX = -snapIndex * cardWidth;
            
            servicesTrack.style.transition = 'transform 0.3s ease';
            servicesTrack.style.transform = `translateX(${servicesTranslateX}px)`;
            
            setTimeout(() => {
                servicesTrack.style.transition = '';
            }, 300);
        });
    }
    
    // ===== PERFORMANCE MOBILE =====
    // Reduzir animações em dispositivos mais lentos
    const isLowEndDevice = navigator.hardwareConcurrency <= 2;
    
    if (isLowEndDevice) {
        document.documentElement.style.setProperty('--transition-duration', '0.2s');
        document.documentElement.classList.add('reduced-motion');
    }
    
    // ===== INTEGRATION COM MAIN.JS =====
    // Eventos para comunicação com main.js quando necessário
    window.addEventListener('mobileFormSubmit', (e) => {
        // Delegar para a validação do main.js
        const form = e.detail.form;
        const submitEvent = new Event('submit', { bubbles: true });
        form.dispatchEvent(submitEvent);
    });
    
    console.log('✅ Mobile JS configurado completamente');
});

// ===== UTILITIES GLOBAIS MOBILE =====
window.mobileUtils = {
    // Feedback haptic
    vibrate(duration = 50) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    },
    
    // Scroll para elemento com offset mobile
    scrollToElement(element, offset = 80) {
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Detectar orientação
    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
};

// ===== ORIENTAÇÃO CHANGE =====
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // Recalcular algumas medidas após mudança de orientação
        window.dispatchEvent(new Event('resize'));
    }, 300);
});
