// JAVASCRIPT OTIMIZADO - main-optimized.js

// 1. Module pattern para evitar poluição global
const MC6App = (() => {
    'use strict';

    // Cache DOM elements
    const elements = {
        preloader: document.getElementById('preloader'),
        header: document.querySelector('.header'),
        mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
        mobileMenu: document.querySelector('.mobile-menu'),
        contactForm: document.getElementById('orcamento')
    };

    // 2. Intersection Observer otimizado
    const createObserver = (callback, options = {}) => {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        return new IntersectionObserver(callback, { ...defaultOptions, ...options });
    };

    // 3. Throttle function para scroll events
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // 4. Lazy loading de funcionalidades
    const loadFeature = async (featureName) => {
        const features = {
            animations: () => import('./modules/animations.js'),
            forms: () => import('./modules/forms.js'),
            gallery: () => import('./modules/gallery.js')
        };
        
        if (features[featureName]) {
            const module = await features[featureName]();
            return module.default;
        }
    };

    // 5. Performance optimized initialization
    const init = () => {
        // Critical functionality only
        handlePreloader();
        handleMobileMenu();
        handleScrollEffects();
        
        // Lazy load non-critical features
        setTimeout(() => {
            loadFeature('animations');
            loadFeature('forms');
        }, 1000);
    };

    const handlePreloader = () => {
        if (!elements.preloader) return;
        
        window.addEventListener('load', () => {
            elements.preloader.style.opacity = '0';
            setTimeout(() => {
                elements.preloader.style.display = 'none';
            }, 500);
        });
    };

    const handleScrollEffects = throttle(() => {
        if (!elements.header) return;
        
        const scrollY = window.scrollY;
        elements.header.classList.toggle('scrolled', scrollY > 100);
    }, 16); // ~60fps

    const handleMobileMenu = () => {
        if (!elements.mobileMenuBtn || !elements.mobileMenu) return;
        
        elements.mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            elements.mobileMenu.classList.toggle('active');
        }, { passive: false });
    };

    // Public API
    return {
        init,
        loadFeature
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', MC6App.init);
} else {
    MC6App.init();
}
