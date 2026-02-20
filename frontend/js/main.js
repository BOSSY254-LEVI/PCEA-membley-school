// main.js - FIXED (REMOVED CONFLICTING initJourney())
import {
    initNavigation,
    initHeroBackgroundSlider,
    initParticles,
    initCounters,
    initTiltEffect,
    initSectionTransitions,
    initMagneticButtons,
    initThemeToggle,
    initAboutTabs,
    // REMOVED: initJourney <- THIS WAS THE CONFLICT
    initHeroStats,
    initSmoothScroll,
    initGalleryFilters,
    initLightbox,
    initMobileHeaderScroll,
    initBackToTop,
    initLazyLoading,
    initVideoModal,
    initEditableAnnouncements,
    initFloatingSocialWidget
} from './ui-handlers.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI handlers (NO initJourney)
    initNavigation();
    initHeroBackgroundSlider();
    initParticles();
    initHeroStats();
    initCounters();
    initTiltEffect();
    initSectionTransitions();
    initMagneticButtons();
    initThemeToggle();
    initAboutTabs();
    initGalleryFilters();
    initLightbox();
    initMobileHeaderScroll();
    initBackToTop();
    initSmoothScroll();
    initLazyLoading();
    initVideoModal();
    initEditableAnnouncements();
    initFloatingSocialWidget();
    
    // OUR CUSTOM HANDLERS
    initMobileMenu();
    initJourneyToggle();  // NOW WORKS!
    initScrollAnimations();
});

// MOBILE HAMBURGER (unchanged)
function initMobileMenu() {
    const hamburger = document.getElementById('navToggle');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeMenu');
    
    function openMenu() {
        if (sideMenu && overlay) {
            sideMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeMenu() {
        if (sideMenu && overlay) {
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', openMenu);
        hamburger.addEventListener('touchstart', (e) => {
            e.preventDefault();
            openMenu();
        }, { passive: false });
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
    
    // Close menu when navigation link is clicked
    const navLinks = sideMenu?.querySelectorAll('a[href^="#"]');
    navLinks?.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu?.classList.contains('active')) {
            closeMenu();
        }
    });
}

// FIXED JOURNEY BUTTON - NO CONFLICTS
function initJourneyToggle() {
    const journeyBtn = document.getElementById('journeyBtn');
    const journeyDetails = document.getElementById('journeyDetails');
    
    if (!journeyBtn || !journeyDetails) {
        console.log('Journey elements not found');
        return;
    }
    
    console.log('Journey button ready!');
    
    // REMOVE ALL EXISTING LISTENERS FIRST
    journeyBtn.replaceWith(journeyBtn.cloneNode(true));
    const newBtn = document.querySelector('#journeyBtn');
    
    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Journey CLICKED!');
        
        journeyDetails.classList.toggle('active');
        newBtn.classList.toggle('active');
    });
}

// SIMPLE SEARCH FUNCTIONALITY
function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.menu-search input');
    
    if (!searchBtn || !searchInput) return;
    
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        
        if (query) {
            // Simple page search - scrolls to first match
            const found = searchPage(query);
            if (found) {
                alert(`Found "${query}"! Scrolled to first match.`);
            } else {
                alert(`No results found for "${query}"`);
            }
        }
    });
    
    // Enter key support
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// Simple page search function
function searchPage(query) {
    const text = document.body.innerText.toLowerCase();
    const index = text.indexOf(query.toLowerCase());
    
    if (index !== -1) {
        // Scroll to approximate location
        window.scrollTo({
            top: Math.max(0, index / 10),
            behavior: 'smooth'
        });
        return true;
    }
    return false;
}
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing inits ...
    initMobileMenu();
    initJourneyToggle();
    initSearch();  // ← ADD THIS LINE
    initScrollAnimations();
});


// Scroll animations (unchanged)
function initScrollAnimations() {
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.2 };
    
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        });
    }, appearOptions);
    
    faders.forEach(fader => appearOnScroll.observe(fader));
    
    const footer = document.querySelector('.premium-footer');
    const footerObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.add('reveal');
            }
        });
    }, { threshold: 0.2 });
    
    if (footer) footerObserver.observe(footer);
    
    const sections = document.querySelectorAll("section, footer");
    const navLinks = document.querySelectorAll('.nav-menu a, .menu-links a, nav a');
    
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });
}
// IMAGE SLIDESHOW FOR CHRISTIAN SECTION
function initChristianSlideshow() {
    const images = document.querySelectorAll('.slideshow-image');
    
    if (images.length === 0) return;
    
    let currentIndex = 0;
    
    function showNextImage() {
        // Hide current
        images[currentIndex].classList.remove('active');
        
        // Next image
        currentIndex = (currentIndex + 1) % images.length;
        
        // Show next
        images[currentIndex].classList.add('active');
    }
    
    // Start slideshow (3 sec per image)
    setInterval(showNextImage, 3000);
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...
    initChristianSlideshow();  // ADD THIS LINE
});

