// ✅ CLEAN PRODUCTION-READY SCRIPT
// Mobile Navigation
export const initNavigation = () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 100);
        }
    });
};
export const initHeroBackgroundSlider = () => {
    const slides = document.querySelectorAll('.hero-bg img');
    if (!slides.length) return;

    let current = 0;

    slides[current].classList.add('active');

    setInterval(() => {
        const next = (current + 1) % slides.length;

        slides[current].classList.remove('active');
        slides[next].classList.add('active');

        current = next;
    }, 7000);
};
document.addEventListener('mousemove', (e) => {
    const activeSlide = document.querySelector('.hero-bg img.active');
    if (!activeSlide) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    activeSlide.style.transform = `scale(1.2) translate(${x}px, ${y}px)`;
});
export const initParticles = () => {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    if (window.innerWidth < 768) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,0.6)";

        particles.forEach(p => {
            p.y -= p.speed;
            if (p.y < 0) p.y = canvas.height;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
};

export const initCounters = () => {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const value = Math.floor(progress * target);

            counter.textContent = value.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => observer.observe(counter));
};


export const initTiltEffect = () => {
    const cards = document.querySelectorAll('.stat-card');
    if (!cards.length) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = ((y / rect.height) - 0.5) * 6;
            const rotateY = ((x / rect.width) - 0.5) * -6;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    });
};
export const initSectionTransitions = () => {
    const sections = document.querySelectorAll('.section-transition');
    if (!sections.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
};
export const initMagneticButtons = () => {
    const buttons = document.querySelectorAll('.cta-glow');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0,0)`;
        });
    });
};
export const initThemeToggle = () => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');

        const isDark = document.body.classList.contains('dark');
        toggle.textContent = isDark ? "☀️" : "🌙";

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        toggle.textContent = "☀️";
    }
};


export const initAboutTabs = () => {
    const aboutBtns = document.querySelectorAll('.about-btn');
    const aboutTabs = document.querySelectorAll('.about-tab');
    
    if (aboutBtns.length === 0) return;
    
    const handleTabClick = (e) => {
        // Prevent double-firing on touch devices
        if (e.type === 'touchstart') e.preventDefault();
        
        const btn = e.currentTarget;
        const targetId = btn.dataset.target;
        const targetTab = document.getElementById(targetId);
        
        if (!targetTab) return;
        
        // Remove all active states
        aboutBtns.forEach(b => b.classList.remove('active'));
        aboutTabs.forEach(tab => tab.classList.remove('active'));
        
        // Activate new tab
        btn.classList.add('active');
        targetTab.classList.add('active');
        
        // Scroll to top of content on mobile
        if (window.innerWidth <= 768) {
            targetTab.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };
    
    // Touch + Click + Keyboard
    aboutBtns.forEach(btn => {
        btn.addEventListener('click', handleTabClick);
        btn.addEventListener('touchstart', handleTabClick, { passive: false });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabClick(e);
            }
        });
    });
};



// Journey Button + Swipe (Enhanced)
export const initJourney = () => {
    const journeyBtn = document.getElementById('journeyBtn');
    const journeyDetails = document.getElementById('journeyDetails');
    const journeySwipeContainer = document.getElementById('journeySwipeContainer');
    
    if (!journeyBtn || !journeyDetails) return;
    
    // Toggle function
    const toggleJourney = () => {
        journeyBtn.classList.toggle('active');
        journeyDetails.classList.toggle('active');
    };
    
    // Click handler
    journeyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleJourney();
    });
    
    // Swipe gestures
    if (journeySwipeContainer) {
        let startY = 0, currentY = 0, isSwiping = false;
        
        const handleSwipe = () => {
            if (!isSwiping) return;
            const deltaY = startY - currentY;
            const threshold = 50;
            
            if (Math.abs(deltaY) > threshold) {
                toggleJourney();
            }
            
            isSwiping = false;
            startY = currentY = 0;
        };
        
        journeySwipeContainer.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isSwiping = true;
        });
        
        journeySwipeContainer.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            currentY = e.touches[0].clientY;
        });
        
        journeySwipeContainer.addEventListener('touchend', handleSwipe);
    }
};

// Hero Stats Carousel
export const initHeroStats = () => {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length === 0) return;
    
    let currentStatIndex = 0;
    
    statCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            statCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentStatIndex = index;
        });
    });
    
    // Auto-rotate
    setInterval(() => {
        statCards.forEach(c => c.classList.remove('active'));
        currentStatIndex = (currentStatIndex + 1) % statCards.length;
        statCards[currentStatIndex].classList.add('active');
    }, 3000);
};

// Smooth Scrolling
export const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

