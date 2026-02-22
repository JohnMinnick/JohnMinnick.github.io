/**
 * main.js — Shared site logic
 * Handles navigation, mobile menu, smooth scrolling,
 * and other cross-page interactions.
 */

/**
 * Initialize the mobile navigation toggle.
 * Handles hamburger menu open/close and click-outside-to-close.
 */
function initNavigation() {
    const toggle = document.querySelector('.nav__toggle');
    const links = document.querySelector('.nav__links');

    // Bail if nav elements don't exist on this page
    if (!toggle || !links) return;

    // Toggle mobile menu on hamburger click
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    links.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
            toggle.classList.remove('active');
            links.classList.remove('active');
        }
    });
}

/**
 * Highlight the current page's nav link based on the URL.
 * Adds the 'nav__link--active' class to the matching link.
 */
function highlightActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Check if this link matches the current page
        // Handle both root ("/") and "/index.html"
        const isHome = (currentPath === '/' || currentPath.endsWith('/index.html'));
        const linkIsHome = (href === '/' || href === 'index.html' || href === './index.html');

        if (isHome && linkIsHome) {
            link.classList.add('nav__link--active');
        } else if (!linkIsHome && currentPath.includes(href.replace('./', '').replace('../', ''))) {
            link.classList.add('nav__link--active');
        }
    });
}

/**
 * Add a subtle background change to the nav on scroll.
 * Makes the nav more opaque when the user has scrolled down.
 */
function initScrollEffects() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(11, 11, 26, 0.95)';
        } else {
            nav.style.background = 'rgba(11, 11, 26, 0.85)';
        }
    });
}

/**
 * Simple fade-in animation for elements as they scroll into view.
 * Add the class 'fade-in' to any element you want to animate.
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to save resources
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with the fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/* ---- Initialize everything on DOM ready ---- */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    highlightActiveNavLink();
    initScrollEffects();
    initScrollAnimations();
});
