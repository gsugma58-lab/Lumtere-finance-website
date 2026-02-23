/**
 * Lumtere Finance - Main JavaScript
 * Core functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // MOBILE MENU FUNCTIONALITY
    // ==========================================================================
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileMenu.contains(event.target) && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    function toggleMobileMenu() {
        navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
        document.body.classList.toggle('menu-open');
    }
    
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        const icon = mobileMenu.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        document.body.classList.remove('menu-open');
    }
    
    // ==========================================================================
    // HOME PAGE - ROTATING BACKGROUND AND TEXT
    // ==========================================================================
    const bgSlides = document.querySelectorAll('.bg-slide');
    const textSlides = document.querySelectorAll('.text-slide');
    
    if (bgSlides.length > 0 && textSlides.length > 0) {
        let currentSlide = 0;
        
        bgSlides.forEach((slide, index) => {
            if (index === 0) slide.classList.add('active');
            else slide.classList.remove('active');
        });
        
        function changeSlide() {
            bgSlides.forEach(slide => slide.classList.remove('active'));
            textSlides.forEach(slide => slide.classList.remove('active'));
            currentSlide = (currentSlide + 1) % bgSlides.length;
            bgSlides[currentSlide].classList.add('active');
            textSlides[currentSlide].classList.add('active');
        }
        
        setInterval(changeSlide, 5000);
    }
    
    // ==========================================================================
    // VIDEO FALLBACK
    // ==========================================================================
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('error', function() {
            console.log('Video failed to load, showing fallback');
            this.style.display = 'none';
            const fallbackImg = document.createElement('img');
            fallbackImg.src = 'assets/images/fallback-image.jpg';
            fallbackImg.alt = 'Lumtere Finance';
            fallbackImg.className = 'main-semi-circle-image';
            this.parentNode.appendChild(fallbackImg);
        });
    }
    
    // ==========================================================================
    // FAQ ACCORDION
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // ==========================================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // ==========================================================================
    // OFFERS PAGE - FILTER FUNCTIONALITY
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const offerCards = document.querySelectorAll('.offer-card');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.dataset.filter;
                offerCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // ==========================================================================
    // TERMS PAGE - ACTIVE NAVIGATION HIGHLIGHT
    // ==========================================================================
    const sections = document.querySelectorAll('.terms-section-block');
    const navLinks_term = document.querySelectorAll('.terms-nav-link');
    
    if (sections.length > 0 && navLinks_term.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            navLinks_term.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
});