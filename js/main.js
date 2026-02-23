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
 * Scroll-triggered fade-in animations with stagger support.
 * Add the class 'fade-in' to any element to animate it on scroll.
 * Sibling .fade-in elements auto-receive staggered delays (0.1s each).
 */
function initScrollAnimations() {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Auto-assign stagger delays to sibling .fade-in elements
    const processed = new Set();
    document.querySelectorAll('.fade-in').forEach(el => {
        // Find siblings with .fade-in under the same parent
        const parent = el.parentElement;
        if (!processed.has(parent)) {
            processed.add(parent);
            const siblings = parent.querySelectorAll(':scope > .fade-in');
            if (siblings.length > 1) {
                siblings.forEach((sib, i) => {
                    sib.style.setProperty('--delay', `${i * 0.1}s`);
                });
            }
        }
        observer.observe(el);
    });
}

/**
 * Smooth page transitions — fade out before navigating to a new page.
 * Intercepts clicks on internal links and plays a brief exit animation.
 */
function initPageTransitions() {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Skip external links, hash-only links, new-tab links, and mailto
        if (href.startsWith('http') || href.startsWith('#') ||
            href.startsWith('mailto:') || link.target === '_blank') return;

        e.preventDefault();
        document.body.classList.add('page-leaving');

        // Navigate after the exit animation completes
        setTimeout(() => {
            window.location.href = href;
        }, 250);
    });
}
/**
 * Dark/light theme toggle.
 * Persists user preference in localStorage, falls back to OS preference.
 * Expects a <button class="theme-toggle"> with id="theme-toggle" in the nav.
 */
function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const STORAGE_KEY = 'jrm-theme';
    const html = document.documentElement;

    /**
     * Apply the given theme and update the toggle icon.
     * @param {'dark'|'light'} theme
     */
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        // Sun icon in dark mode (click to go light), moon in light mode
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label',
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // Determine initial theme: saved > OS preference > default dark
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        setTheme(saved);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    // Toggle on click with spin animation
    btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';

        // Spin animation
        btn.classList.add('theme-toggle--spin');
        btn.addEventListener('animationend', () => {
            btn.classList.remove('theme-toggle--spin');
        }, { once: true });

        setTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
    });
}

/* ---- Initialize everything on DOM ready ---- */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    highlightActiveNavLink();
    initScrollEffects();
    initScrollAnimations();
    initPageTransitions();
    initThemeToggle();
});
