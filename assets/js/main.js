document.addEventListener('DOMContentLoaded', function() {
    
    // ===== UTILITY FUNCTIONS =====
    // Função throttle para otimização de performance
    function throttle(func, wait) {
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
    
    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    const loadingProgress = document.querySelector('.loading-progress');
    
    const totalLoadTime = 2500; // Tempo total em ms
    let progressInterval;
    
    // Anima a barra de progresso sincronizada com o tempo total
    if (loadingProgress) {
        let progress = 0;
        const incrementTime = 50; // Atualiza a cada 50ms
        const totalSteps = totalLoadTime / incrementTime; // Total de passos
        const incrementPerStep = 200 / totalSteps; // Incremento por passo para chegar em 100%
        
        progressInterval = setInterval(() => {
            progress += incrementPerStep;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
            }
            
            loadingProgress.style.width = progress + '%';
        }, incrementTime);
    }
    
    // Simula tempo de carregamento e esconde o preloader
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Garante que chegue em 100% mesmo se não chegou ainda
            if (loadingProgress && progressInterval) {
                clearInterval(progressInterval);
                loadingProgress.style.width = '100%';
            }
            
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Remove do DOM após a animação
                setTimeout(() => {
                    if (preloader && preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 600);
            }, 500); // Pequeno delay para mostrar 100%
        }, totalLoadTime);
    });
    
    // ===== LÓGICA DO MENU MOBILE =====
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });
        
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (navbar.classList.contains('active') && !navbar.contains(e.target) && !e.target.closest('.menu-toggle')) {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
            }
        });
    }

    // ===== SMART HEADER SCROLL EFFECT =====
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.hero');
    let ticking = false;
    let lastScrollY = 0;
    let heroOpacity = 1;

    function updateScroll() {
        const scrollY = window.scrollY;
        
        // Só executar se scroll mudou significativamente
        if (Math.abs(scrollY - lastScrollY) < 3) {
            ticking = false;
            return;
        }
        
        // Smart Header Hide/Show Logic - Versão Simplificada
        if (scrollY > lastScrollY && scrollY > 80) {
            // Scrolling down - hide header
            header.classList.add('header-hidden');
            header.classList.remove('header-visible');
        } else if (scrollY < lastScrollY || scrollY <= 80) {
            // Scrolling up or near top - show header
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        }
        
        lastScrollY = scrollY;
        
        // Header scrolled effect
        if (scrollY > 50) {
            if (!header.classList.contains('scrolled')) {
                header.classList.add('scrolled');
            }
        } else {
            if (header.classList.contains('scrolled')) {
                header.classList.remove('scrolled');
            }
        }
        
        // Parallax removido para evitar tremido
        // Mantém apenas opacity fade out simples
        if (heroSection && scrollY < window.innerHeight) {
            const opacity = Math.max(0.3, 1 - (scrollY / (window.innerHeight * 0.8)));
            const roundedOpacity = Math.round(opacity * 100) / 100;
            
            if (Math.abs(heroOpacity - roundedOpacity) > 0.1) {
                heroSection.style.opacity = roundedOpacity;
                heroOpacity = roundedOpacity;
            }
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }

    if(header) {
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // ===== ATIVAR LINK DO MENU CONFORME SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a');
    let scrollTicking = false;
    let lastActiveSection = '';

    function updateActiveLink() {
        let current = '';
        const scrollPos = pageYOffset + 200; // Offset para melhor detecção
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Só atualizar se a seção ativa mudou
        if (current !== lastActiveSection) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (current && link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
            lastActiveSection = current;
        }
        
        scrollTicking = false;
    }

    function requestScrollTick() {
        if (!scrollTicking) {
            requestAnimationFrame(updateActiveLink);
            scrollTicking = true;
        }
    }

    // Usar throttling mais agressivo para melhor performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        requestScrollTick();
        
        // Backup timeout para garantir execução
        scrollTimeout = setTimeout(() => {
            if (!scrollTicking) {
                requestScrollTick();
            }
        }, 100);
    }, { passive: true });

    // ===== SISTEMA DE CONTROLE DE SEÇÕES FULLSCREEN =====
    const featuresSection = document.querySelector('.features');
    const heroSectionEl = document.querySelector('.hero');
    const servicesSection = document.querySelector('.services');
    const casesSection = document.querySelector('.cases');
    let featuresRevealed = false;
    let currentSection = 'hero'; // hero, features, cases, services (ordem do HTML)
    let isScrolling = false;
    
    function updateSectionVisibility() {
        if (!featuresSection || !heroSectionEl || !servicesSection || !casesSection) return;
        
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const heroHeight = heroSectionEl.offsetHeight;
        const featuresTop = featuresSection.offsetTop;
        const featuresHeight = featuresSection.offsetHeight;
        const casesTop = casesSection.offsetTop;
        const casesHeight = casesSection.offsetHeight;
        const servicesTop = servicesSection.offsetTop;
        const servicesHeight = servicesSection.offsetHeight;
        
        // Debug log
        console.log('Scroll Position:', {
            scrollY,
            heroHeight,
            featuresTop,
            casesTop,
            servicesTop,
            currentSection,
            featuresRevealed
        });
        
        // Determina qual seção deve estar visível (ordem correta: Hero → Features → Cases → Services)
        // Usa offsets menores para transições mais suaves
        if (scrollY < heroHeight * 0.7) {
            // Usuário está na seção hero
            if (currentSection !== 'hero') {
                currentSection = 'hero';
                console.log('Switching to HERO section');
                heroSectionEl.classList.remove('section-hidden');
                heroSectionEl.classList.add('section-visible');
                featuresSection.classList.add('section-hidden');
                featuresSection.classList.remove('section-visible');
                casesSection.classList.add('section-hidden');
                casesSection.classList.remove('section-visible');
                servicesSection.classList.add('section-hidden');
                servicesSection.classList.remove('section-visible');
            }
        } else if (scrollY >= heroHeight * 0.7 && 
                   scrollY < featuresTop + featuresHeight * 0.8) {
            // Usuário está na seção features
            if (currentSection !== 'features') {
                currentSection = 'features';
                console.log('Switching to FEATURES section');
                heroSectionEl.classList.add('section-hidden');
                heroSectionEl.classList.remove('section-visible');
                featuresSection.classList.remove('section-hidden');
                featuresSection.classList.add('section-visible');
                casesSection.classList.add('section-hidden');
                casesSection.classList.remove('section-visible');
                servicesSection.classList.add('section-hidden');
                servicesSection.classList.remove('section-visible');
                
                // Revela a seção features
                if (!featuresRevealed) {
                    console.log('Revealing features section');
                    featuresSection.classList.add('reveal-section');
                    featuresRevealed = true;
                }
            }
        } else if (scrollY >= featuresTop + featuresHeight * 0.8 && 
                   scrollY < casesTop + casesHeight * 0.8) {
            // Usuário está na seção cases
            if (currentSection !== 'cases') {
                currentSection = 'cases';
                console.log('Switching to CASES section');
                heroSectionEl.classList.add('section-hidden');
                heroSectionEl.classList.remove('section-visible');
                featuresSection.classList.add('section-hidden');
                featuresSection.classList.remove('section-visible');
                casesSection.classList.remove('section-hidden');
                casesSection.classList.add('section-visible');
                servicesSection.classList.add('section-hidden');
                servicesSection.classList.remove('section-visible');
            }
        } else {
            // Usuário está na seção services - qualquer scroll além dos cases
            if (currentSection !== 'services') {
                currentSection = 'services';
                console.log('Switching to SERVICES section');
                heroSectionEl.classList.add('section-hidden');
                heroSectionEl.classList.remove('section-visible');
                featuresSection.classList.add('section-hidden');
                featuresSection.classList.remove('section-visible');
                casesSection.classList.add('section-hidden');
                casesSection.classList.remove('section-visible');
                servicesSection.classList.remove('section-hidden');
                servicesSection.classList.add('section-visible');
            }
        }
    }

    function scrollHandler() {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                updateSectionVisibility();
                isScrolling = false;
            });
        }
    }

    // Inicializa o sistema se os elementos existirem
    if (featuresSection && heroSectionEl && servicesSection && casesSection) {
        console.log('Initializing fullscreen section system (Hero → Features → Cases → Services)');
        
        // Define estado inicial - hero visível, outras ocultas
        heroSectionEl.classList.add('section-visible');
        featuresSection.classList.add('section-hidden');
        casesSection.classList.add('section-hidden');
        servicesSection.classList.add('section-hidden');
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        // Verifica estado inicial
        updateSectionVisibility();
    }

    // ===== HERO SLIDER INTERATIVO =====
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroImages = document.querySelectorAll('.hero-bg-image');
    const heroPrevBtn = document.querySelector('.hero-nav-arrow.prev');
    const heroNextBtn = document.querySelector('.hero-nav-arrow.next');
    let currentHeroIndex = 0;

    function showHeroSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroImages.forEach(image => image.classList.remove('active'));

        heroSlides[index].classList.add('active');
        heroImages[index].classList.add('active');
        currentHeroIndex = index;
    }

    if (heroSlides.length > 0) {
        heroNextBtn.addEventListener('click', () => {
            let nextIndex = (currentHeroIndex + 1) % heroSlides.length;
            showHeroSlide(nextIndex);
        });

        heroPrevBtn.addEventListener('click', () => {
            let prevIndex = (currentHeroIndex - 1 + heroSlides.length) % heroSlides.length;
            showHeroSlide(prevIndex);
        });
        
        let heroInterval = setInterval(() => {
            let nextIndex = (currentHeroIndex + 1) % heroSlides.length;
            showHeroSlide(nextIndex);
        }, 7000);
    }

    // ===== SERVICES AUTO CAROUSEL =====
    let servicesPosition = 0;
    let servicesData = [];
    let servicesAutoplayInterval;

    function setupServicesAutoCarousel(services) {
        servicesData = services;
        servicesPosition = 0;
        
        // Configurar posição inicial (para começar no meio dos serviços triplicados)
        const track = document.getElementById('services-track-container');
        if (track) {
            const cardWidth = 350; // 320px card + 30px gap
            const initialOffset = -(cardWidth * services.length); // Posicionar no segundo conjunto
            track.style.transform = `translateX(${initialOffset}px)`;
            servicesPosition = initialOffset;
        }
        
        // Iniciar animação contínua
        startServicesAutoplay();
        
        // Pausar/retomar com hover
        const servicesWrapper = document.querySelector('.services-wrapper');
        if (servicesWrapper) {
            servicesWrapper.addEventListener('mouseenter', stopServicesAutoplay);
            servicesWrapper.addEventListener('mouseleave', startServicesAutoplay);
        }
    }
    
    function moveServicesCarousel() {
        const track = document.getElementById('services-track-container');
        if (!track || !servicesData.length) return;
        
        // Mover continuamente para a esquerda
        servicesPosition -= 0.5; // Velocidade de movimento (pixels por frame)
        
        // Calcular ponto de reset (quando o primeiro conjunto sai de vista)
        const cardWidth = 350; // 320px card + 30px gap
        const resetPoint = -(cardWidth * servicesData.length * 2); // Quando chegar no terceiro conjunto
        
        // Reset para posição inicial quando necessário
        if (servicesPosition <= resetPoint) {
            servicesPosition = -(cardWidth * servicesData.length);
        }
        
        track.style.transform = `translateX(${servicesPosition}px)`;
    }
    
    function startServicesAutoplay() {
        stopServicesAutoplay();
        servicesAutoplayInterval = setInterval(() => {
            moveServicesCarousel();
        }, 16); // ~60fps para movimento suave
    }
    
    function stopServicesAutoplay() {
        if (servicesAutoplayInterval) {
            clearInterval(servicesAutoplayInterval);
            servicesAutoplayInterval = null;
        }
    }

    // ===== CARREGAMENTO DINÂMICO DE DADOS =====
    function loadDynamicData() {
        console.log("🔄 Iniciando carregamento de dados...");
        
        // Carregar dados diretamente
        const servicesPromise = fetch('data/services.json').then(response => response.json());
        const clientsPromise = fetch('data/clients.json').then(response => response.json());
        
        Promise.all([servicesPromise, clientsPromise])
            .then(([services, clients]) => {
                console.log("✅ Dados carregados:", { services: services.length, clients: clients.length });
                
                // Renderizar Serviços em Carrossel
                const servicesTrackContainer = document.getElementById('services-track-container');
                console.log("🎯 Container encontrado:", !!servicesTrackContainer);
                
                if(servicesTrackContainer && services && services.length > 0) {
                    servicesTrackContainer.innerHTML = '';
                    
                    // Triplicar serviços para loop infinito suave
                    const tripleServices = [...services, ...services, ...services];
                    
                    tripleServices.forEach((service, index) => {
                        const serviceCard = document.createElement('div');
                        serviceCard.className = 'service-card animate-on-scroll';
                        
                        serviceCard.innerHTML = `
                            <div class="service-image">
                                <img src="${service.image}" alt="${service.title}" loading="lazy">
                                <div class="service-icon">
                                    <i class="${service.icon}"></i>
                                </div>
                            </div>
                            <div class="service-content">
                                <h3>${service.title}</h3>
                                <p>${service.description}</p>
                            </div>
                        `;
                        
                        servicesTrackContainer.appendChild(serviceCard);
                    });
                    
                    // Configurar carrossel automático com loop infinito
                    setupServicesAutoCarousel(services);
                }
                
                // Renderizar Carousel de Depoimentos
                const testimonialsContainer = document.getElementById('testimonials-container');
                
                if(testimonialsContainer && clients && clients.length > 0) {
                    // Filtrar testimonials
                    const testimonials = clients.filter(client => client.testimonial && client.clientName);
                    
                    if (testimonials.length > 0) {
                        testimonialsContainer.innerHTML = '';
                        
                        testimonials.forEach((client, index) => {
                            const card = document.createElement('div');
                            card.className = 'testimonial-card';
                            
                            const initials = client.clientName
                                .split(' ')
                                .map(name => name.charAt(0))
                                .join('')
                                .toUpperCase();
                            
                            const stars = Array(client.rating || 5)
                                .fill('<i class="fas fa-star star"></i>')
                                .join('');
                            
                            card.innerHTML = `
                                <div class="quote-icon">
                                    <i class="fas fa-quote-left"></i>
                                </div>
                                <div class="star-rating">${stars}</div>
                                <div class="testimonial-text">"${client.testimonial}"</div>
                                <div class="client-info">
                                    <div class="client-avatar">${initials}</div>
                                    <div class="client-details">
                                        <h4>${client.clientName}</h4>
                                        <p>${client.clientRole}</p>
                                    </div>
                                </div>
                                <div class="company-info">
                                    <img src="${client.image}" alt="${client.alt}" class="company-logo">
                                    <div class="company-details">
                                        <h5>${client.name}</h5>
                                        <span>${client.description}</span>
                                    </div>
                                </div>
                                <div class="project-badge">${client.project}</div>
                            `;
                            
                            testimonialsContainer.appendChild(card);
                        });
                        
                        // Configurar navegação do carousel
                        setupTestimonialsNavigation(testimonials);
                    }
                }
                
                // Salvar dados no localStorage
                localStorage.setItem('mc6_services', JSON.stringify(services));
                localStorage.setItem('mc6_clients', JSON.stringify(clients));
            })
            .catch(error => {
                console.error("❌ ERRO ao carregar dados dinâmicos:", error);
            })
            .finally(() => {
                // Remover skeleton loading
                setTimeout(() => {
                    const servicesContainer = document.getElementById('services-track-container');
                    if (servicesContainer) {
                        skeletonManager.hideLoadingState(servicesContainer);
                    }
                    const testimonialsContainer = document.getElementById('testimonials-container');
                    if (testimonialsContainer) {
                        skeletonManager.hideLoadingState(testimonialsContainer);
                    }
                }, 300);
                
                // Iniciar animações
                setupScrollAnimations();
            });
    }

    // ===== LÓGICA DE ANIMAÇÃO DE SCROLL =====
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Animar contadores nas estatísticas
                    if (entry.target.querySelector('.stat-card .number')) {
                        animateCounter(entry.target.querySelector('.stat-card .number'));
                    }
                    
                    // Animar contadores nos cases
                    if (entry.target.querySelector('.stat-number')) {
                        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
                    }
                    
                    observer.unobserve(entry.target); // Opcional: animar apenas uma vez
                }
            });
        }, {
            threshold: 0.1 // A animação começa quando 10% do elemento está visível
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // ===== CONTADOR ANIMADO =====
    function animateCounter(element) {
        const text = element.textContent;
        const hasPercent = text.includes('%');
        const hasPlus = text.includes('+');
        const number = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        if (isNaN(number)) return;
        
        let current = 0;
        const increment = number / 60; // 60 frames para a animação
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            let displayNumber = Math.floor(current);
            if (number % 1 !== 0) displayNumber = current.toFixed(1); // Para decimais
            
            element.textContent = displayNumber + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');
        }, 16); // ~60fps
    }

    // ===== FORMULÁRIO DE CONTATO =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Limpar mensagens de erro anteriores
            clearErrors();
            
            // Validar formulário
            const isValid = validateForm();
            
            if (isValid) {
                // Micro-animação de sucesso na validação
                const submitBtn = document.querySelector('.submit-btn');
                submitBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    submitBtn.style.transform = '';
                    submitForm();
                }, 150);
            } else {
                // Toast de erro de validação
                showToast('warning', 'Formulário incompleto', 'Por favor, preencha todos os campos obrigatórios.');
                
                // Micro-animação de erro
                contactForm.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    contactForm.style.animation = '';
                }, 500);
            }
        });
        
        // Validação em tempo real
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    }
    
    function validateForm() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');
        const privacy = document.getElementById('privacy');
        
        let isValid = true;
        
        if (!name.value.trim()) {
            showError('name', 'Nome é obrigatório');
            isValid = false;
        }
        
        if (!email.value.trim()) {
            showError('email', 'E-mail é obrigatório');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError('email', 'E-mail inválido');
            isValid = false;
        }
        
        if (!phone.value.trim()) {
            showError('phone', 'Telefone é obrigatório');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            showError('message', 'Descrição do projeto é obrigatória');
            isValid = false;
        }
        
        if (!privacy.checked) {
            showError('privacy', 'É necessário concordar com o tratamento dos dados');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const fieldName = field.getAttribute('name');
        clearFieldError(fieldName);
        
        switch(fieldName) {
            case 'name':
                if (!field.value.trim()) {
                    showError('name', 'Nome é obrigatório');
                    return false;
                }
                break;
                
            case 'email':
                if (!field.value.trim()) {
                    showError('email', 'E-mail é obrigatório');
                    return false;
                } else if (!isValidEmail(field.value)) {
                    showError('email', 'E-mail inválido');
                    return false;
                }
                break;
                
            case 'phone':
                if (!field.value.trim()) {
                    showError('phone', 'Telefone é obrigatório');
                    return false;
                }
                break;
                
            case 'message':
                if (!field.value.trim()) {
                    showError('message', 'Descrição do projeto é obrigatória');
                    return false;
                }
                break;
                
            case 'privacy':
                if (!field.checked) {
                    showError('privacy', 'É necessário concordar com o tratamento dos dados');
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    function showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + '-error');
        
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    function clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + '-error');
        
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('.error');
        
        errorElements.forEach(el => el.classList.remove('show'));
        inputElements.forEach(el => el.classList.remove('error'));
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function submitForm() {
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Desabilitar todos os inputs durante envio
        const formInputs = contactForm.querySelectorAll('input, textarea, select, button');
        formInputs.forEach(input => input.disabled = true);
        
        // Mostrar loading
        submitBtn.classList.add('loading');
        btnLoading.classList.remove('hidden');
        
        // Toast de início de envio
        showToast('info', 'Enviando...', 'Processando sua solicitação, aguarde...');
        
        // Coletar dados do formulário
        const formData = {
            name: document.getElementById('name').value,
            company: document.getElementById('company').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };
        
        // Simular envio (em produção, fazer requisição para servidor)
        setTimeout(() => {
            // Restaurar estado do formulário
            formInputs.forEach(input => input.disabled = false);
            submitBtn.classList.remove('loading');
            btnLoading.classList.add('hidden');
            
            // Verificar se houve "erro" simulado (10% de chance para demonstração)
            const hasError = Math.random() < 0.1;
            
            if (hasError) {
                // Simular erro
                showToast('error', 'Erro no envio', 'Houve um problema ao enviar sua mensagem. Tente novamente.');
                return;
            }
            
            // Sucesso
            // Criar mensagem WhatsApp
            const whatsappMessage = createWhatsAppMessage(formData);
            const whatsappUrl = `https://wa.me/554732883002?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Toast de sucesso
            showToast('success', 'Mensagem enviada!', 'Redirecionando para o WhatsApp...');
            
            // Resetar formulário
            contactForm.reset();
            
            // Abrir WhatsApp após delay
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 1500);
            
        }, 2500); // Aumentado para 2.5s para melhor demonstração
    }
    
    function createWhatsAppMessage(data) {
        let message = `*Solicitação de Orçamento - MC6*\n\n`;
        message += `*Nome:* ${data.name}\n`;
        if (data.company) message += `*Empresa:* ${data.company}\n`;
        message += `*E-mail:* ${data.email}\n`;
        message += `*Telefone:* ${data.phone}\n`;
        if (data.service) message += `*Serviço:* ${data.service}\n`;
        message += `*Detalhes do Projeto:*\n${data.message}\n\n`;
        message += `_Mensagem enviada através do site MC6_`;
        
        return message;
    }
    
    // ===== SISTEMA DE TOAST NOTIFICATIONS =====
    function showToast(type = 'info', title = '', message = '', duration = 5000) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        // Criar toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Definir ícones por tipo
        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-times',
            warning: 'fas fa-exclamation',
            info: 'fas fa-info'
        };
        
        toast.innerHTML = `
            <div class="toast-header">
                <div class="toast-icon">
                    <i class="${icons[type] || icons.info}"></i>
                </div>
                <div class="toast-title">${title}</div>
                <button class="toast-close" onclick="closeToast(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="toast-message">${message}</div>
            <div class="toast-progress"></div>
        `;
        
        // Adicionar ao container
        toastContainer.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Auto remover
        setTimeout(() => {
            closeToast(toast.querySelector('.toast-close'));
        }, duration);
        
        return toast;
    }
    
    // Função global para fechar toast
    window.closeToast = function(closeBtn) {
        const toast = closeBtn.closest('.toast');
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }
    };
    
    function showSuccessMessage() {
        // Manter compatibilidade - agora usa toast
        showToast('success', 'Mensagem enviada!', 'Você será redirecionado para o WhatsApp para finalizar o contato.');
    }

    // ===== SCROLL TO TOP BUTTON =====
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Mostrar/esconder botão baseado no scroll
        function toggleScrollButton() {
            if (window.scrollY > 300) {
                if (!scrollToTopBtn.classList.contains('show')) {
                    scrollToTopBtn.classList.add('show');
                }
            } else {
                if (scrollToTopBtn.classList.contains('show')) {
                    scrollToTopBtn.classList.remove('show');
                }
            }
        }
        
        // Event listener para scroll
        window.addEventListener('scroll', throttle(toggleScrollButton, 100));
        
        // Event listener para clique
        scrollToTopBtn.addEventListener('click', function() {
            // Desativa scroll-behavior CSS temporariamente para controle total
            const htmlElement = document.documentElement;
            const originalScrollBehavior = htmlElement.style.scrollBehavior;
            htmlElement.style.scrollBehavior = 'auto';
            
            // Detecta se é mobile para ajustar velocidade
            const isMobile = window.innerWidth <= 768;
            const scrollDuration = isMobile ? 300 : 500; // Mais rápido no mobile
            
            // Animação suave otimizada
            const startPosition = window.pageYOffset;
            const startTime = performance.now();
            
            function scrollAnimation(currentTime) {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / scrollDuration, 1);
                
                // Easing function para transição suave
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const currentPosition = startPosition * (1 - easeOutCubic);
                
                window.scrollTo(0, currentPosition);
                
                if (progress < 1) {
                    requestAnimationFrame(scrollAnimation);
                } else {
                    // Garante que chegue exatamente no topo
                    window.scrollTo(0, 0);
                    // Restaura scroll-behavior original
                    htmlElement.style.scrollBehavior = originalScrollBehavior;
                }
            }
            
            requestAnimationFrame(scrollAnimation);
            
            // Toast opcional (mais discreto)
            showToast('info', 'Topo da página', 'Você foi redirecionado para o início.', 2000);
        });
    }

    // ===== FILTROS DE CASES =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseCards = document.querySelectorAll('.case-card');
    
    if (filterButtons.length > 0 && caseCards.length > 0) {
        // Adicionar contador de resultados
        const casesGrid = document.querySelector('.cases-grid');
        if (casesGrid) {
            const casesCount = document.createElement('div');
            casesCount.className = 'cases-count';
            casesGrid.parentNode.insertBefore(casesCount, casesGrid);
            updateCasesCount();
        }
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Atualizar botão ativo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filtrar cases com animação
                filterCases(filter);
                
                // Toast feedback
                const filterNames = {
                    'all': 'Todos os cases',
                    'wifi': 'Cases de Wi-Fi',
                    'evento': 'Cases de Eventos',
                    'residencial': 'Cases Residenciais',
                    'corporativo': 'Cases Corporativos'
                };
                
                showToast('info', 'Filtro aplicado', `Exibindo: ${filterNames[filter]}`, 2000);
            });
        });
        
        function filterCases(filter) {
            let visibleCount = 0;
            
            caseCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow) {
                    // Mostrar com delay escalonado
                    setTimeout(() => {
                        card.classList.remove('hidden', 'filtered-out');
                        card.style.animationDelay = `${index * 0.1}s`;
                    }, index * 100);
                    visibleCount++;
                } else {
                    // Esconder imediatamente
                    card.classList.add('hidden');
                    setTimeout(() => {
                        card.classList.add('filtered-out');
                    }, 300);
                }
            });
            
            // Atualizar contador
            setTimeout(() => {
                updateCasesCount(visibleCount);
            }, 300);
        }
        
        function updateCasesCount(count = null) {
            const casesCount = document.querySelector('.cases-count');
            if (casesCount) {
                const totalCases = count !== null ? count : caseCards.length;
                const filterName = document.querySelector('.filter-btn.active')?.textContent.trim() || 'Todos';
                
                casesCount.innerHTML = `
                    <i class="fas fa-filter"></i>
                    Exibindo <strong>${totalCases}</strong> ${totalCases === 1 ? 'case' : 'cases'} 
                    ${filterName !== 'Todos' ? `em <strong>${filterName}</strong>` : ''}
                `;
                
                casesCount.classList.add('show');
            }
        }
    }

    // ===== FAQ INTERATIVO =====
    window.faqManager = {
        faqs: [],
        currentFilter: 'all',
        currentSearch: '',
        itemsPerPage: 5,
        currentPage: 1,
        
        async init() {
            try {
                const response = await fetch('./data/faq.json');
                this.faqs = (await response.json()).faqs;
                this.setupEventListeners();
                this.render();
                this.toggleClearButton(); // Garantir que o botão X comece escondido
                console.log('FAQ carregado:', this.faqs.length, 'perguntas');
            } catch (error) {
                console.error('Erro ao carregar FAQ:', error);
                this.showError();
            }
        },
        
        setupEventListeners() {
            // Busca
            const searchInput = document.getElementById('faq-search');
            const clearBtn = document.getElementById('clear-search');
            
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.currentSearch = e.target.value.toLowerCase();
                    this.search();
                    this.toggleClearButton();
                });
                
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.search();
                    }
                });
            }
            
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    this.currentSearch = '';
                    this.search();
                    this.toggleClearButton();
                    searchInput.focus();
                });
            }
            
            // Filtros
            const filterBtns = document.querySelectorAll('.faq-filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.getAttribute('data-filter');
                    this.setFilter(filter);
                });
            });
        },
        
        setFilter(filter) {
            this.currentFilter = filter;
            this.currentPage = 1; // Reset para primeira página
            
            // Atualizar botões ativos
            document.querySelectorAll('.faq-filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
            
            this.render();
            
            // Toast feedback
            const filterNames = {
                'all': 'Todas as categorias',
                'tecnico': 'Questões Técnicas',
                'comercial': 'Informações Comerciais',
                'suporte': 'Suporte e Manutenção'
            };
            
            showToast('info', 'Filtro aplicado', filterNames[filter], 2000);
        },
        
        search() {
            this.currentPage = 1; // Reset para primeira página
            this.render();
        },
        
        toggleClearButton() {
            const clearBtn = document.getElementById('clear-search');
            if (clearBtn) {
                if (this.currentSearch.length > 0) {
                    clearBtn.classList.remove('hidden');
                } else {
                    clearBtn.classList.add('hidden');
                }
            }
        },
        
        getFilteredFaqs() {
            let filtered = this.faqs;
            
            // Filtrar por categoria
            if (this.currentFilter !== 'all') {
                filtered = filtered.filter(faq => faq.category === this.currentFilter);
            }
            
            // Filtrar por busca
            if (this.currentSearch) {
                filtered = filtered.filter(faq => {
                    const searchIn = `${faq.question} ${faq.answer} ${faq.keywords}`.toLowerCase();
                    return searchIn.includes(this.currentSearch);
                });
            }
            
            return filtered;
        },
        
        getPaginatedFaqs() {
            const filtered = this.getFilteredFaqs();
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            
            return {
                faqs: filtered.slice(startIndex, endIndex),
                totalItems: filtered.length,
                totalPages: Math.ceil(filtered.length / this.itemsPerPage),
                hasMore: endIndex < filtered.length
            };
        },
        
        loadMore() {
            if (this.getPaginatedFaqs().hasMore) {
                this.currentPage++;
                this.render();
            }
        },
        
        render() {
            const questionsColumn = document.getElementById('faq-questions-column');
            const countElement = document.getElementById('faq-visible-count');
            const emptyState = document.getElementById('faq-empty');
            
            if (!questionsColumn) return;
            
            const paginatedData = this.getPaginatedFaqs();
            const { faqs: currentFaqs, totalItems, totalPages, hasMore } = paginatedData;
            
            // Atualizar contador
            if (countElement) {
                const showingCount = this.currentPage * this.itemsPerPage;
                const actualShowing = Math.min(showingCount, totalItems);
                countElement.textContent = `${actualShowing} de ${totalItems}`;
            }
            
            // Mostrar/esconder estado vazio
            if (totalItems === 0) {
                questionsColumn.innerHTML = '';
                emptyState?.classList.remove('hidden');
                this.renderPagination(0, 0, false);
                return;
            } else {
                emptyState?.classList.add('hidden');
            }
            
            // Se é primeira página, limpar container, senão append
            if (this.currentPage === 1) {
                questionsColumn.innerHTML = '';
                this.clearAnswer(); // Limpar resposta quando muda filtro/busca
            }
            
            // Renderizar FAQs da página atual
            const faqsHTML = currentFaqs.map((faq, index) => `
                <div class="faq-item" data-id="${faq.id}" style="animation-delay: ${index * 0.1}s" onclick="window.faqManager.showAnswer(${faq.id})">
                    <div class="faq-question">
                        <h3>${faq.question}</h3>
                        <div class="faq-toggle">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
            `).join('');
            
            questionsColumn.insertAdjacentHTML('beforeend', faqsHTML);
            
            // Renderizar controles de paginação
            this.renderPagination(totalItems, totalPages, hasMore);
        },
        
        showAnswer(faqId) {
            const faq = this.faqs.find(f => f.id === faqId);
            if (!faq) return;
            
            const currentItem = document.querySelector(`[data-id="${faqId}"]`);
            const isCurrentlyActive = currentItem?.classList.contains('active');
            
            // Se clicar na pergunta já ativa, fechar e mostrar placeholder
            if (isCurrentlyActive) {
                this.clearAnswer();
                return;
            }
            
            // Atualizar visual dos itens ativos
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            currentItem?.classList.add('active');
            
            // Mostrar resposta na coluna da direita
            const answerColumn = document.getElementById('faq-answer-column');
            if (answerColumn) {
                answerColumn.innerHTML = `
                    <div class="faq-answer-header">
                        <h3>${faq.question}</h3>
                    </div>
                    <div class="faq-answer-content-area">
                        ${faq.answer}
                    </div>
                `;
            }
        },
        
        clearAnswer() {
            // Limpar seleção ativa
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Restaurar placeholder
            const answerColumn = document.getElementById('faq-answer-column');
            if (answerColumn) {
                answerColumn.innerHTML = `
                    <div class="faq-answer-placeholder" id="faq-answer-placeholder">
                        <div class="placeholder-icon">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <h3>Selecione uma pergunta</h3>
                        <p>Clique em qualquer pergunta à esquerda para ver sua resposta detalhada aqui.</p>
                    </div>
                `;
            }
        },
        
        renderPagination(totalItems, totalPages, hasMore) {
            let paginationContainer = document.getElementById('faq-pagination');
            
            // Criar container se não existir
            if (!paginationContainer) {
                paginationContainer = document.createElement('div');
                paginationContainer.id = 'faq-pagination';
                paginationContainer.className = 'faq-pagination';
                document.getElementById('faq-container').parentNode.appendChild(paginationContainer);
            }
            
            // Limpar conteúdo
            paginationContainer.innerHTML = '';
            
            if (totalItems === 0) return;
            
            // Mostrar informações de paginação
            const paginationInfo = document.createElement('div');
            paginationInfo.className = 'pagination-info';
            
            if (hasMore) {
                paginationInfo.innerHTML = `
                    <div class="pagination-text">
                        <i class="fas fa-info-circle"></i>
                        Mostrando ${this.currentPage * this.itemsPerPage} de ${totalItems} perguntas
                    </div>
                    <button class="btn btn-outline load-more-btn" onclick="window.faqManager.loadMore()">
                        <i class="fas fa-plus"></i>
                        Carregar Mais ${this.itemsPerPage} Perguntas
                    </button>
                `;
            } else if (totalItems > this.itemsPerPage) {
                paginationInfo.innerHTML = `
                    <div class="pagination-text pagination-complete">
                        <i class="fas fa-check-circle"></i>
                        Todas as ${totalItems} perguntas foram exibidas
                    </div>
                `;
            }
            
            paginationContainer.appendChild(paginationInfo);
        },
        
        getCategoryName(category) {
            const names = {
                'tecnico': 'Técnico',
                'comercial': 'Comercial',
                'suporte': 'Suporte'
            };
            return names[category] || category;
        },
        
        showError() {
            const container = document.getElementById('faq-container');
            if (container) {
                container.innerHTML = `
                    <div class="faq-empty">
                        <div class="empty-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3>Erro ao carregar perguntas</h3>
                        <p>Não foi possível carregar as perguntas frequentes. Tente novamente.</p>
                        <button class="btn btn-primary" onclick="window.faqManager.init()">
                            <i class="fas fa-refresh"></i>
                            Tentar Novamente
                        </button>
                    </div>
                `;
            }
        }
    };
    
    // Inicializar FAQ se a seção existir
    if (document.getElementById('faq')) {
        faqManager.init();
    }

    // ===== SKELETON LOADING SYSTEM =====
    const skeletonManager = {
        init() {
            // Não aplicar skeleton automático no init
            // Será controlado pelo loadDynamicData
        },
        
        setupServiceCardsLoading() {
            const serviceCards = document.querySelectorAll('.service-card');
            
            // Adicionar loading state inicial
            serviceCards.forEach((card, index) => {
                card.classList.add('loading');
                
                // Remover loading com delay escalonado
                setTimeout(() => {
                    card.classList.remove('loading');
                    card.classList.add('fade-in');
                }, 1000 + (index * 150));
            });
        },
        
        setupFAQLoading() {
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach((item, index) => {
                item.classList.add('loading');
                
                setTimeout(() => {
                    item.classList.remove('loading');
                    item.classList.add('slide-up');
                }, 1400 + (index * 100));
            });
        },
        
        setupCasesLoading() {
            const caseCards = document.querySelectorAll('.case-card, .client-card');
            
            caseCards.forEach((card, index) => {
                card.classList.add('loading');
                
                setTimeout(() => {
                    card.classList.remove('loading');
                    card.classList.add('fade-in');
                }, 800 + (index * 80));
            });
        },
        
        setupFormLoading() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                form.classList.add('form-loading');
                
                setTimeout(() => {
                    form.classList.remove('form-loading');
                    form.classList.add('fade-in');
                }, 1200);
            });
        },
        
        // Método para simular loading em elementos específicos
        simulateLoading(selector, duration = 1500) {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach((element, index) => {
                element.classList.add('loading');
                
                setTimeout(() => {
                    element.classList.remove('loading');
                    element.classList.add('fade-in');
                }, duration + (index * 100));
            });
        },
        
        // Loading state para elementos dinâmicos
        showLoadingState(element) {
            if (element) {
                element.classList.add('loading');
            }
        },
        
        hideLoadingState(element) {
            if (element) {
                element.classList.remove('loading');
                element.classList.add('fade-in');
            }
        }
    };
    
    // Skeleton loading será ativado apenas quando necessário
    // skeletonManager.init(); // Removido para controle manual

    // ===== MICRO-ANIMATIONS SYSTEM =====
    const microAnimationsManager = {
        init() {
            this.setupButtonAnimations();
            this.setupCardAnimations();
            this.setupIconAnimations();
            this.setupLinkAnimations();
            this.setupFormAnimations();
        },
        
        setupButtonAnimations() {
            // Adicionar classes de animação a botões
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(btn => {
                if (!btn.classList.contains('pulse-hover')) {
                    btn.classList.add('pulse-hover');
                }
            });
            
            // Botão CTA principal com respiração
            const ctaButton = document.querySelector('.btn-secondary');
            if (ctaButton) {
                ctaButton.classList.add('breathe');
            }
        },
        
        setupCardAnimations() {
            // Service cards com shimmer
            const serviceCards = document.querySelectorAll('.service-card');
            serviceCards.forEach(card => {
                card.parentElement.classList.add('shimmer-hover');
            });
            
            // Case cards com bounce
            const caseCards = document.querySelectorAll('.case-card, .client-card');
            caseCards.forEach(card => {
                card.classList.add('bounce-hover');
            });
            
            // Feature cards com efeitos especiais
            const featureCards = document.querySelectorAll('.feature-card, .differential-card');
            featureCards.forEach(card => {
                card.classList.add('shimmer-hover', 'pulse-hover');
            });
        },
        
        setupIconAnimations() {
            // Ícones de serviços com rotação
            const serviceIcons = document.querySelectorAll('.service-icon i');
            serviceIcons.forEach(icon => {
                icon.classList.add('rotate-hover');
            });
            
            // Ícones do formulário com balanço
            const formIcons = document.querySelectorAll('.form-group i, .input-icon i');
            formIcons.forEach(icon => {
                icon.classList.add('swing-hover');
            });
            
            // Ícones sociais com bounce
            const socialIcons = document.querySelectorAll('.social-links i, .footer-social i');
            socialIcons.forEach(icon => {
                icon.classList.add('bounce-hover');
            });
            
            // Setas e navegação com pulse
            const navIcons = document.querySelectorAll('.nav-arrow, .hero-nav-arrow');
            navIcons.forEach(icon => {
                icon.classList.add('pulse-hover');
            });
        },
        
        setupLinkAnimations() {
            // Links de navegação já têm CSS, mas vamos garantir comportamento
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                // Animação já está no CSS
            });
            
            // Links do footer com underline
            const footerLinks = document.querySelectorAll('.footer-links a');
            footerLinks.forEach(link => {
                if (!link.classList.contains('btn')) {
                    link.style.position = 'relative';
                }
            });
        },
        
        setupFormAnimations() {
            // Inputs com melhor feedback visual
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.style.transform = 'scale(1.02)';
                });
                
                input.addEventListener('blur', () => {
                    input.style.transform = 'scale(1)';
                });
            });
            
            // Botões de form com feedback especial
            const formButtons = document.querySelectorAll('form .btn');
            formButtons.forEach(btn => {
                btn.classList.add('pulse-hover');
            });
        },
        
        // Método para adicionar animação a elemento específico
        addAnimation(element, animationType) {
            if (element) {
                element.classList.add(animationType);
            }
        },
        
        // Trigger animação de sucesso
        triggerSuccess(element) {
            element.classList.add('bounce-hover');
            setTimeout(() => {
                element.style.animation = 'subtleBounce 0.6s ease';
            }, 100);
            
            setTimeout(() => {
                element.style.animation = '';
            }, 700);
        },
        
        // Trigger animação de erro
        triggerError(element) {
            element.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    };
    
    // Inicializar micro-animations
    microAnimationsManager.init();

    // ===== ICON ANIMATIONS SYSTEM =====
    const iconAnimationsManager = {
        init() {
            // REATIVADO: Versão segura das animações de ícones
            this.setupSafeServiceIcons();
            this.setupSafeNavigationIcons();
            // MANTIDO DESATIVADO: setupFormIcons - pode interferir com formulário
            // MANTIDO DESATIVADO: setupSocialIcons - pode interferir com links
            this.setupMobileMenu();
            // MANTIDO DESATIVADO: setupStatusIcons - pode interferir com status
            // MANTIDO DESATIVADO: setupContactIcons - pode interferir com contato
        },

        setupSafeServiceIcons() {
            // Aplicar apenas em ícones de serviços que não são links críticos
            const serviceIcons = document.querySelectorAll('.service-card .service-icon i:not(.fab):not(.critical-icon)');
            serviceIcons.forEach(icon => {
                // Aplicar animação mais sutil
                icon.style.transition = 'transform 0.3s ease';
                
                const card = icon.closest('.service-card');
                if (card) {
                    card.addEventListener('mouseenter', () => {
                        icon.style.transform = 'scale(1.1) rotate(5deg)';
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        icon.style.transform = 'scale(1) rotate(0deg)';
                    });
                }
            });
        },

        setupSafeNavigationIcons() {
            // Aplicar apenas em setas de navegação, não em ícones de links
            const arrowIcons = document.querySelectorAll('.hero-nav-arrow i, .nav-arrow i');
            arrowIcons.forEach(arrow => {
                arrow.style.transition = 'transform 0.2s ease';
                
                arrow.parentElement.addEventListener('mouseenter', () => {
                    arrow.style.transform = 'scale(1.2)';
                });
                
                arrow.parentElement.addEventListener('mouseleave', () => {
                    arrow.style.transform = 'scale(1)';
                });
            });
        },
        
        setupServiceIcons() {
            // Ícones de serviços com rotação especial
            const serviceIcons = document.querySelectorAll('.service-icon, .service-card .service-icon, .service-image i');
            serviceIcons.forEach(icon => {
                icon.classList.add('service-icon');
                
                // Comportamento especial no hover
                const card = icon.closest('.service-card, .service-link');
                if (card) {
                    card.addEventListener('mouseenter', () => {
                        icon.style.animation = 'serviceIconSpin 0.8s ease';
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        setTimeout(() => {
                            icon.style.animation = '';
                        }, 800);
                    });
                }
            });
            
            // Adicionar animação CSS se não existir
            if (!document.querySelector('#service-icon-styles')) {
                const style = document.createElement('style');
                style.id = 'service-icon-styles';
                style.textContent = `
                    @keyframes serviceIconSpin {
                        0% { transform: scale(1) rotate(0deg); }
                        50% { transform: scale(1.2) rotate(180deg); }
                        100% { transform: scale(1) rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        },
        
        setupNavigationIcons() {
            // Setas de navegação com pulse
            const arrowIcons = document.querySelectorAll('.hero-nav-arrow, .nav-arrow, .arrow-icon');
            arrowIcons.forEach(arrow => {
                arrow.classList.add('arrow-icon');
            });
            
            // Ícones de navegação
            const navIcons = document.querySelectorAll('.nav-link i, .menu-item i');
            navIcons.forEach(icon => {
                icon.classList.add('nav-icon');
            });
        },
        
        setupFormIcons() {
            // Ícones do formulário
            const formIcons = document.querySelectorAll('.form-group i, .input-group i');
            formIcons.forEach(icon => {
                icon.classList.add('form-icon');
            });
            
            // Adicionar comportamento especial para ícones de input
            const inputGroups = document.querySelectorAll('.form-group, .input-group');
            inputGroups.forEach(group => {
                const input = group.querySelector('input, textarea, select');
                const icon = group.querySelector('i');
                
                if (input && icon) {
                    input.addEventListener('focus', () => {
                        icon.style.color = 'var(--primary-color)';
                        icon.style.transform = 'scale(1.2) rotate(10deg)';
                    });
                    
                    input.addEventListener('blur', () => {
                        icon.style.color = '';
                        icon.style.transform = '';
                    });
                }
            });
        },
        
        setupSocialIcons() {
            // Ícones sociais com bounce e glow
            const socialIcons = document.querySelectorAll('.social-links i, .footer-social i, .social-icon');
            socialIcons.forEach(icon => {
                icon.classList.add('social-icon');
                
                // Adicionar efeito de onda no clique
                icon.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.createRippleEffect(icon, e);
                });
            });
        },
        
        setupMobileMenu() {
            // Menu mobile com morphing
            const mobileToggle = document.querySelector('.mobile-menu-toggle, .menu-toggle');
            if (mobileToggle) {
                mobileToggle.classList.add('mobile-menu-toggle');
                
                // Criar estrutura de barras se não existir
                if (!mobileToggle.querySelector('.bar')) {
                    mobileToggle.innerHTML = `
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    `;
                }
                
                mobileToggle.addEventListener('click', () => {
                    mobileToggle.classList.toggle('active');
                });
            }
        },
        
        setupStatusIcons() {
            // Ícones de status (online, disponível, etc.)
            const statusIcons = document.querySelectorAll('.status-icon, .online-status, .available-icon');
            statusIcons.forEach(icon => {
                icon.classList.add('status-icon');
            });
            
            // Adicionar ícone de status online se existir
            const onlineButtons = document.querySelectorAll('[class*="online"], [class*="disponivel"], [class*="whatsapp"]');
            onlineButtons.forEach(btn => {
                const icon = btn.querySelector('i');
                if (icon && (icon.classList.contains('fa-phone') || icon.classList.contains('fa-whatsapp'))) {
                    icon.classList.add('status-icon');
                }
            });
        },
        
        setupContactIcons() {
            // Ícones de contato com ring effect
            const contactIcons = document.querySelectorAll('.contact-info i, .contact-item i, .phone-icon, .email-icon, .whatsapp-icon');
            contactIcons.forEach(icon => {
                icon.classList.add('contact-icon');
            });
        },
        
        // Efeito de ondas ao clicar
        createRippleEffect(element, event) {
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, var(--accent-color), transparent);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1000;
            `;
            
            // Adicionar keyframe se não existir
            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            element.style.position = 'relative';
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        },
        
        // Trigger animação de loading
        showLoadingIcon(element) {
            const icon = element.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-spinner loading-icon';
            }
        },
        
        // Trigger animação de sucesso
        showSuccessIcon(element) {
            const icon = element.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-check success-icon';
            }
        },
        
        // Trigger animação de erro
        showErrorIcon(element) {
            const icon = element.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-exclamation-triangle error-icon';
            }
        },
        
        // Adicionar ícone especial a elemento
        addSpecialIcon(element, iconClass, animationClass) {
            const icon = element.querySelector('i');
            if (icon) {
                icon.classList.add(animationClass);
            }
        }
    };
    
    // Inicializar icon animations
    iconAnimationsManager.init();

    // ===== SISTEMA DE TOAST/NOTIFICAÇÕES =====
    function showToast(type, title, message, duration = 3000) {
        // Remover toast existente se houver
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Criar toast com micro-animations
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type} bounce-hover`;
        toast.innerHTML = `
            <div class="toast-icon pulse-hover">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} swing-hover"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close bounce-hover" onclick="this.parentElement.remove()">
                <i class="fas fa-times rotate-hover"></i>
            </button>
        `;
        
        // Adicionar estilos dinâmicos se não existirem
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast-notification {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: var(--surface-color);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    z-index: 9999;
                    max-width: 400px;
                    animation: toastSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    backdrop-filter: blur(10px);
                    transform: translateZ(0);
                }
                
                .toast-success { border-left: 4px solid #10b981; }
                .toast-error { border-left: 4px solid #ef4444; }
                .toast-info { border-left: 4px solid #3b82f6; }
                
                .toast-icon {
                    color: var(--accent-color);
                    font-size: 20px;
                    animation: iconBounce 0.6s ease;
                }
                
                @keyframes iconBounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
                
                @keyframes toastSlideIn {
                    0% {
                        transform: translateX(100%) scale(0.8);
                        opacity: 0;
                    }
                    50% {
                        transform: translateX(-10px) scale(1.05);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                }
                
                .toast-content {
                    flex: 1;
                }
                
                .toast-title {
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 4px;
                }
                
                .toast-message {
                    color: var(--text-secondary);
                    font-size: 14px;
                }
                
                .toast-close {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    animation: fadeInDelay 0.8s ease;
                }
                
                @keyframes fadeInDelay {
                    0%, 50% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }
                
                .toast-close:hover {
                    background: var(--hover-color);
                    color: var(--text-primary);
                    transform: scale(1.1);
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    0% {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(100%) scale(0.8);
                        opacity: 0;
                    }
                }
                
                .toast-exit {
                    animation: slideOutRight 0.3s ease-in forwards !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Adicionar ao DOM
        document.body.appendChild(toast);
        
        // Auto remover com animação melhorada
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.classList.add('toast-exit');
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }
    }

    // ===== GRADIENT BACKGROUNDS MANAGER =====

    const gradientManager = {
        init() {
            this.setupHeroGradient();
            this.setupCardGradients();
            this.setupButtonGradients();
            this.setupSectionGradients();
            this.setupParticles();
            this.setupIntersectionObserver();
        },

        setupHeroGradient() {
            // REMOVIDO: Hero deve manter sua imagem de fundo original
            // const hero = document.querySelector('.hero');
            // if (hero) {
            //     hero.classList.add('hero-animated-bg');
            // }
        },

        setupCardGradients() {
            // REATIVADO: Versão segura para cards sem ícones críticos
            const allCards = document.querySelectorAll('.service-card, .case-item');
            allCards.forEach(card => {
                // Verificar se não tem ícones críticos
                const hasIcons = card.querySelector('.fab, .fas, .method-icon, .contact-icon, .social-links, .contact-method');
                if (!hasIcons) {
                    card.classList.add('gradient-hover-card');
                }
            });
        },

        setupButtonGradients() {
            // Aplicar gradientes apenas em botões CTA específicos
            const buttons = document.querySelectorAll('.hero-btn, .cta-button');
            buttons.forEach(button => {
                // Verificar se não é um botão com ícone crítico
                if (!button.querySelector('.fab, .fas')) {
                    button.classList.add('gradient-button');
                }
            });
        },

        setupSectionGradients() {
            const sections = document.querySelectorAll('.section');
            sections.forEach((section, index) => {
                if (index % 2 === 1) { // Seções alternadas
                    section.classList.add('section-gradient-bg');
                }
            });
        },

        setupParticles() {
            // DESATIVADO: Partículas removidas para não interferir com hero original
            // const hero = document.querySelector('.hero');
            // if (hero) {
            //     this.createParticles(hero);
            // }
        },

        createParticles(container) {
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'gradient-particles';
            
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'gradient-particle';
                
                // Posição inicial aleatória
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                
                particlesContainer.appendChild(particle);
            }
            
            container.style.position = 'relative';
            container.appendChild(particlesContainer);
        },

        setupIntersectionObserver() {
            const gradientElements = document.querySelectorAll('.gradient-border, .gradient-text');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                    } else {
                        entry.target.style.animationPlayState = 'paused';
                    }
                });
            }, { threshold: 0.1 });

            gradientElements.forEach(element => {
                observer.observe(element);
            });
        },

        // Método para adicionar gradient loading a elementos
        addLoadingGradient(element) {
            element.classList.add('gradient-loading');
            
            setTimeout(() => {
                element.classList.remove('gradient-loading');
            }, 2000);
        },

        // Método para criar progress bar com gradient
        createGradientProgress(container, duration = 3000) {
            const progressBar = document.createElement('div');
            progressBar.className = 'gradient-progress';
            
            const progressFill = document.createElement('div');
            progressFill.className = 'gradient-progress-bar';
            progressFill.style.width = '0%';
            
            progressBar.appendChild(progressFill);
            container.appendChild(progressBar);
            
            // Animar progresso
            setTimeout(() => {
                progressFill.style.transition = `width ${duration}ms ease-out`;
                progressFill.style.width = '100%';
            }, 100);
            
            // Remover após completar
            setTimeout(() => {
                progressBar.remove();
            }, duration + 500);
        },

        // Método para aplicar overlay de gradient em imagens
        applyImageOverlay(images) {
            images.forEach(img => {
                if (img.parentElement) {
                    img.parentElement.classList.add('image-gradient-overlay');
                }
            });
        },

        // Método para criar texto com gradient animado
        createGradientText(element) {
            element.classList.add('gradient-text');
        },

        // Método para aplicar border gradient
        applyGradientBorder(elements) {
            elements.forEach(element => {
                element.classList.add('gradient-border');
            });
        }
    };

    // Inicializar gradient manager
    gradientManager.init();

    // Aplicar gradientes em elementos específicos quando necessário
    setTimeout(() => {
        // DESATIVADO: Gradient text causando problemas de visibilidade
        // const mainTitles = document.querySelectorAll('.section-title h2:not(.no-gradient)');
        // mainTitles.forEach(title => gradientManager.createGradientText(title));

        // DESATIVADO: Overlay em imagens - pode causar problemas
        // const caseImages = document.querySelectorAll('.case-item img');
        // gradientManager.applyImageOverlay(caseImages);

        // DESATIVADO: Border gradient - pode causar problemas
        // const specialCards = document.querySelectorAll('.service-card:nth-child(2n)');
        // gradientManager.applyGradientBorder(specialCards);
    }, 1000);

    // ===== TESTIMONIALS CAROUSEL FUNCTIONS =====
    let currentTestimonial = 0;
    let testimonialInterval;
    let testimonialsData = [];

    function renderTestimonialsCarousel(clients) {
        console.log('📊 Dados recebidos:', clients);
        
        const container = document.getElementById('testimonials-container');
        console.log('📦 Container:', container);
        
        if (!container) {
            return;
        }

        if (!clients || !clients.length) {
            return;
        }

        testimonialsData = clients.filter(client => client.testimonial && client.clientName);
        console.log('✅ Dados filtrados:', testimonialsData);
        console.log('📈 Quantidade de testimonials:', testimonialsData.length);
        
        if (testimonialsData.length === 0) {
            container.innerHTML = '<p style="color: white; text-align: center; padding: 20px;">Nenhum depoimento encontrado</p>';
            return;
        }
        
        container.innerHTML = '';

        testimonialsData.forEach((client, index) => {
            const testimonialCard = document.createElement('div');
            testimonialCard.className = 'testimonial-card';
            
            // Generate initials for avatar
            const initials = client.clientName
                .split(' ')
                .map(name => name.charAt(0))
                .join('')
                .toUpperCase();

            // Generate stars
            const stars = Array(client.rating)
                .fill('<i class="fas fa-star star"></i>')
                .join('');

            testimonialCard.innerHTML = `
                <div class="quote-icon">
                    <i class="fas fa-quote-left"></i>
                </div>
                
                <div class="star-rating">
                    ${stars}
                </div>
                
                <div class="testimonial-text">
                    "${client.testimonial}"
                </div>
                
                <div class="client-info">
                    <div class="client-avatar">
                        ${initials}
                    </div>
                    <div class="client-details">
                        <h4>${client.clientName}</h4>
                        <p>${client.clientRole}</p>
                    </div>
                </div>
                
                <div class="company-info">
                    <img src="${client.image}" alt="${client.alt}" class="company-logo">
                    <div class="company-details">
                        <h5>${client.name}</h5>
                        <span>${client.description}</span>
                    </div>
                </div>
                
                <div class="project-badge">
                    ${client.project}
                </div>
            `;
            
            container.appendChild(testimonialCard);
        });

        // Create dots
        createTestimonialDots();
        
        // Start autoplay
        startTestimonialAutoplay();

        testimonialsData.forEach((client, index) => {
            const testimonialCard = document.createElement('div');
            testimonialCard.className = 'testimonial-card';
            
            // Generate initials for avatar
            const initials = client.clientName
                .split(' ')
                .map(name => name.charAt(0))
                .join('')
                .toUpperCase();

            // Generate stars
            const stars = Array(client.rating)
                .fill('<i class="fas fa-star star"></i>')
                .join('');

            testimonialCard.innerHTML = `
                <div class="quote-icon">
                    <i class="fas fa-quote-left"></i>
                </div>
                
                <div class="star-rating">
                    ${stars}
                </div>
                
                <div class="testimonial-text">
                    "${client.testimonial}"
                </div>
                
                <div class="client-info">
                    <div class="client-avatar">
                        ${initials}
                    </div>
                    <div class="client-details">
                        <h4>${client.clientName}</h4>
                        <p>${client.clientRole}</p>
                    </div>
                </div>
                
                <div class="company-info">
                    <img src="${client.image}" alt="${client.alt}" class="company-logo">
                    <div class="company-details">
                        <h5>${client.name}</h5>
                        <span>${client.description}</span>
                    </div>
                </div>
                
                <div class="project-badge">
                    ${client.project}
                </div>
            `;
            
            container.appendChild(testimonialCard);
        });

        // Create dots
        createTestimonialDots();
        
        // Start autoplay
        startTestimonialAutoplay();
    }

    function setupTestimonialsNavigation(testimonials) {
        // Configurar variáveis globais
        testimonialsData = testimonials;
        currentTestimonial = 0;
        
        const prevBtn = document.getElementById('testimonial-prev');
        const nextBtn = document.getElementById('testimonial-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopTestimonialAutoplay();
                goToTestimonial(currentTestimonial - 1);
                startTestimonialAutoplay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopTestimonialAutoplay();
                goToTestimonial(currentTestimonial + 1);
                startTestimonialAutoplay();
            });
        }
        
        // Configurar dots e autoplay
        createTestimonialDots();
        startTestimonialAutoplay();
    }

    function createTestimonialDots() {
        const dotsContainer = document.getElementById('testimonials-dots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        
        testimonialsData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                stopTestimonialAutoplay();
                goToTestimonial(index);
                startTestimonialAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function goToTestimonial(index) {
        const container = document.getElementById('testimonials-container');
        const dots = document.querySelectorAll('.testimonial-dot');
        const prevBtn = document.getElementById('testimonial-prev');
        const nextBtn = document.getElementById('testimonial-next');
        
        if (!container || !testimonialsData.length) return;

        // Wrap around
        if (index < 0) index = testimonialsData.length - 1;
        if (index >= testimonialsData.length) index = 0;
        
        currentTestimonial = index;
        
        // Move container
        container.style.transform = `translateX(-${index * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update navigation buttons
        if (prevBtn) prevBtn.disabled = false; // Always enabled with wrap-around
        if (nextBtn) nextBtn.disabled = false; // Always enabled with wrap-around
    }

    function startTestimonialAutoplay() {
        stopTestimonialAutoplay();
        const progressBar = document.getElementById('testimonials-progress-bar');
        
        let progress = 0;
        const duration = 5000; // 5 seconds
        const interval = 50; // Update every 50ms
        const increment = (interval / duration) * 100;
        
        testimonialInterval = setInterval(() => {
            progress += increment;
            
            if (progressBar) {
                progressBar.style.width = `${Math.min(progress, 100)}%`;
            }
            
            if (progress >= 100) {
                progress = 0;
                goToTestimonial(currentTestimonial + 1);
            }
        }, interval);
    }

    function stopTestimonialAutoplay() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
            testimonialInterval = null;
        }
        
        const progressBar = document.getElementById('testimonials-progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }

    // Pause autoplay on hover
    document.addEventListener('DOMContentLoaded', () => {
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopTestimonialAutoplay);
            carousel.addEventListener('mouseleave', startTestimonialAutoplay);
        }
    });

    // ===== CASES GALLERY SYSTEM =====
    function setupCasesGallery() {
        const caseCards = document.querySelectorAll('.case-card[data-gallery]');
        
        caseCards.forEach(card => {
            const galleryData = JSON.parse(card.dataset.gallery || '[]');
            const overlay = card.querySelector('.case-gallery-overlay');
            const thumbnailsContainer = card.querySelector('.gallery-thumbnails');
            
            if (!overlay || !thumbnailsContainer || galleryData.length === 0) return;
            
            // Criar thumbnails
            galleryData.forEach((image, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'gallery-thumb';
                thumb.style.backgroundImage = `url(${image})`;
                thumb.title = `Imagem ${index + 1} de ${galleryData.length}`;
                
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showFullImage(image, galleryData, index);
                });
                
                thumbnailsContainer.appendChild(thumb);
            });
        });
    }

    function showFullImage(imageUrl, galleryData, currentIndex) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="gallery-modal-content">
                <button class="gallery-close">&times;</button>
                <div class="gallery-navigation">
                    <button class="gallery-prev" ${currentIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <img src="${imageUrl}" alt="Imagem da galeria" class="gallery-main-image">
                    <button class="gallery-next" ${currentIndex === galleryData.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="gallery-counter">${currentIndex + 1} / ${galleryData.length}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Setup navigation
        let current = currentIndex;
        const mainImage = modal.querySelector('.gallery-main-image');
        const counter = modal.querySelector('.gallery-counter');
        const prevBtn = modal.querySelector('.gallery-prev');
        const nextBtn = modal.querySelector('.gallery-next');
        
        function updateImage() {
            mainImage.src = galleryData[current];
            counter.textContent = `${current + 1} / ${galleryData.length}`;
            prevBtn.disabled = current === 0;
            nextBtn.disabled = current === galleryData.length - 1;
        }
        
        prevBtn.addEventListener('click', () => {
            if (current > 0) {
                current--;
                updateImage();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (current < galleryData.length - 1) {
                current++;
                updateImage();
            }
        });
        
        // Close modal
        function closeModal() {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
        
        modal.querySelector('.gallery-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Keyboard navigation
        function handleKeydown(e) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft' && current > 0) {
                current--;
                updateImage();
            }
            if (e.key === 'ArrowRight' && current < galleryData.length - 1) {
                current++;
                updateImage();
            }
        }
        
        document.addEventListener('keydown', handleKeydown);
        modal.addEventListener('remove', () => {
            document.removeEventListener('keydown', handleKeydown);
        });
        
        // Animate in
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // Initialize gallery system
    setTimeout(() => {
        setupCasesGallery();
    }, 1000);
    
    // Carregar dados dinâmicos após DOM estar pronto
    loadDynamicData();
});