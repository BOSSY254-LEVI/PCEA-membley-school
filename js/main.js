// main.js

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
    initJourney,
    initHeroStats,
    initSmoothScroll
} from './ui-handlers.js';

document.addEventListener('DOMContentLoaded', () => {
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
    initJourney();
    initSmoothScroll();
});
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.2
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});
const footer = document.querySelector('.premium-footer');

const footerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            footer.classList.add('reveal');
        }
    });
}, {
    threshold: 0.2
});

footerObserver.observe(footer);
const sections = document.querySelectorAll("section, footer");
const navLinks = document.querySelectorAll("nav a");

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
