/**
 * particles.js — Particle Physics Sandbox
 *
 * Click/drag to emit particles that respond to gravity.
 * Controls: gravity strength, particle size, trail opacity.
 * Rainbow mode cycles hue continuously.
 */

/* ============================================================
   Setup
   ============================================================ */
const canvas = document.getElementById('sandbox');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

/* Control references */
const gravSlider = document.getElementById('gravity');
const sizeSlider = document.getElementById('size');
const trailSlider = document.getElementById('trail');
const rainbowBtn = document.getElementById('rainbow-btn');
const clearBtn = document.getElementById('clear-btn');
const countEl = document.getElementById('count');

/* ============================================================
   State
   ============================================================ */
let particles = [];
let isMouseDown = false;
let mouseX = W / 2, mouseY = H / 2;
let rainbowMode = false;
let hue = 0;          // For rainbow cycling
const MAX_PARTICLES = 2000;

/* ============================================================
   Particle Class
   ============================================================ */

/**
 * Creates a new particle at (x, y) with randomized velocity.
 * @param {number} x - Spawn X position
 * @param {number} y - Spawn Y position
 */
function createParticle(x, y) {
    if (particles.length >= MAX_PARTICLES) return;

    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    const size = parseInt(sizeSlider.value, 10);

    let color;
    if (rainbowMode) {
        color = `hsl(${hue % 360}, 100%, 60%)`;
        hue += 2;
    } else {
        // Random from neon palette
        const colors = ['#00fff7', '#ff00aa', '#7c3aed', '#ffe066', '#ff6b35', '#0af'];
        color = colors[Math.floor(Math.random() * colors.length)];
    }

    particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color,
        life: 1.0  // Fades from 1 -> 0
    });
}

/* ============================================================
   Physics Update
   ============================================================ */
function update() {
    const gravity = parseInt(gravSlider.value, 10) / 500; // 0 .. 0.2

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply gravity
        p.vy += gravity;

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Fade over time
        p.life -= 0.003;

        // Bounce off walls with damping
        if (p.x < p.size) { p.x = p.size; p.vx *= -0.7; }
        if (p.x > W - p.size) { p.x = W - p.size; p.vx *= -0.7; }
        if (p.y > H - p.size) { p.y = H - p.size; p.vy *= -0.7; }
        if (p.y < p.size) { p.y = p.size; p.vy *= -0.7; }

        // Remove dead particles
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

/* ============================================================
   Rendering
   ============================================================ */
function render() {
    // Trail effect — semi-transparent background overlay
    const trailAlpha = (100 - parseInt(trailSlider.value, 10)) / 100;
    ctx.fillStyle = `rgba(15, 18, 37, ${trailAlpha})`;
    ctx.fillRect(0, 0, W, H);

    // Draw particles
    for (const p of particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Update particle count display
    countEl.textContent = particles.length + ' particles';
}

/* ============================================================
   Main Loop
   ============================================================ */
function loop() {
    // Emit particles while mouse is held
    if (isMouseDown) {
        for (let i = 0; i < 3; i++) {
            createParticle(mouseX, mouseY);
        }
    }

    update();
    render();
    requestAnimationFrame(loop);
}

/* ============================================================
   Input Handlers
   ============================================================ */

/** Mouse events */
canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    updateMousePos(e);
});
canvas.addEventListener('mousemove', (e) => { if (isMouseDown) updateMousePos(e); });
canvas.addEventListener('mouseup', () => { isMouseDown = false; });
canvas.addEventListener('mouseleave', () => { isMouseDown = false; });

/** Touch events */
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMouseDown = true;
    updateTouchPos(e);
}, { passive: false });
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    updateTouchPos(e);
}, { passive: false });
canvas.addEventListener('touchend', () => { isMouseDown = false; });

/** Calculate mouse position relative to canvas */
function updateMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (W / rect.width);
    mouseY = (e.clientY - rect.top) * (H / rect.height);
}

/** Calculate touch position relative to canvas */
function updateTouchPos(e) {
    if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.touches[0].clientX - rect.left) * (W / rect.width);
        mouseY = (e.touches[0].clientY - rect.top) * (H / rect.height);
    }
}

/** Rainbow mode toggle */
rainbowBtn.addEventListener('click', () => {
    rainbowMode = !rainbowMode;
    rainbowBtn.classList.toggle('active', rainbowMode);
});

/** Clear all particles */
clearBtn.addEventListener('click', () => {
    particles = [];
    ctx.fillStyle = '#0f1225';
    ctx.fillRect(0, 0, W, H);
});

/* Start the loop */
requestAnimationFrame(loop);
