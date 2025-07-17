// Menu Module
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navbar.classList.toggle('active');
        
        // Trocar ícone
        const icon = menuToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
}

// Fechar menu ao clicar em um link
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        if (icon.classList.contains('fa-times')) {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
});

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Ativar link do menu conforme a seção visível
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Inicializar scroll para ativar header
window.dispatchEvent(new Event('scroll'));

// Carrossel de serviços
const carousel = document.querySelector('.carousel-slides');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.querySelector('.carousel-arrow.prev');
const nextBtn = document.querySelector('.carousel-arrow.next');
const carouselContainer = document.querySelector('.carousel-container');

let currentIndex = 0;
const slideCount = slides.length;

// Função para atualizar altura do carrossel
function updateCarouselHeight() {
    if (window.innerWidth < 768) {
        carouselContainer.style.height = slides[currentIndex].offsetHeight + 'px';
    } else {
        carouselContainer.style.height = '150px';
    }
}

function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Atualizar dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
    
    // Atualizar altura
    updateCarouselHeight();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateCarousel();
}

// Adicionar eventos
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Adicionar eventos aos dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
    });
});

// Auto-rotacionar o carrossel
setInterval(nextSlide, 5000);

// Analytics e Conversão
document.querySelectorAll('.btn-primary, .whatsapp-float, .btn-accent').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('Evento de conversão: ', btn.textContent.trim());
    });
});

// Formulário de lead magnet
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    console.log('Lead capturado: ', email);
    alert('Obrigado! Seu guia será enviado para: ' + email);
});

// Atualizar altura do carrossel ao carregar e redimensionar
window.addEventListener('load', updateCarouselHeight);
window.addEventListener('resize', updateCarouselHeight);

// Fechar menu ao tocar fora dele
document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') && 
        !navbar.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        navbar.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        if (icon.classList.contains('fa-times')) {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    }
});