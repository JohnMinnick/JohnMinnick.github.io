/**
 * home.js — Landing Page Scripts
 * Interactive particle background for the hero section.
 * Particles float, connect with lines when near each other,
 * and react to mouse movement.
 */

/**
 * Initialize the hero particle canvas.
 * Creates floating particles that form constellation-like
 * connections and respond to mouse hover.
 */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // ---- Configuration ----
    const CONFIG = {
        particleCount: 60,        // Number of particles
        particleSize: 2,          // Base radius in px
        connectionDistance: 150,   // Max distance for line connections
        mouseRadius: 200,         // Mouse influence radius
        speed: 0.3,               // Base particle speed
        colors: [
            'rgba(0, 229, 255, 0.6)',   // Cyan
            'rgba(124, 77, 255, 0.6)',  // Purple
            'rgba(255, 45, 123, 0.4)',  // Pink (less frequent)
        ]
    };

    // ---- State ----
    let particles = [];
    let mouse = { x: -1000, y: -1000 }; // Start off-screen
    let animationId = null;

    /**
     * Resize the canvas to match its container.
     */
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    /**
     * Create a single particle with random position, velocity, and color.
     * @returns {Object} Particle object
     */
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * CONFIG.speed,
            vy: (Math.random() - 0.5) * CONFIG.speed,
            radius: CONFIG.particleSize + Math.random() * 1.5,
            color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
            // Store original alpha for mouse interaction effects
            alpha: 0.4 + Math.random() * 0.4
        };
    }

    /**
     * Initialize all particles.
     */
    function initParticles() {
        particles = [];
        // Scale particle count with canvas area (fewer on mobile)
        const scaledCount = Math.floor(CONFIG.particleCount * (canvas.width / 1200));
        const count = Math.max(20, Math.min(scaledCount, CONFIG.particleCount));
        for (let i = 0; i < count; i++) {
            particles.push(createParticle());
        }
    }

    /**
     * Update particle positions and handle edge wrapping.
     */
    function updateParticles() {
        particles.forEach(p => {
            // Move particle
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges (seamless looping)
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Mouse repulsion — gently push particles away from cursor
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.mouseRadius) {
                const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                p.x += dx * force * 0.02;
                p.y += dy * force * 0.02;
            }
        });
    }

    /**
     * Draw particles and connection lines.
     */
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connection lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.connectionDistance) {
                    // Fade line opacity based on distance
                    const opacity = (1 - dist / CONFIG.connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
    }

    /**
     * Main animation loop.
     */
    function animate() {
        updateParticles();
        drawParticles();
        animationId = requestAnimationFrame(animate);
    }

    // ---- Event Listeners ----

    // Track mouse position over the canvas
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Reset mouse when it leaves the canvas
    canvas.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // Pause animation when tab is not visible (save resources)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        // Draw a single static frame instead of animating
        resizeCanvas();
        initParticles();
        drawParticles();
        return;
    }

    // ---- Start ----
    resizeCanvas();
    initParticles();
    animate();
}

/* ---- Initialize on DOM ready ---- */
document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
});
