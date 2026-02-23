/**
 * pet.js — Browsing Pet System (Canvas Pixel Art Edition)
 *
 * Shows a "Choose Your Browsing Buddy" modal on first visit.
 * Pets are drawn as pixel art on a small canvas element that
 * follows the cursor with smooth lerp interpolation.
 */

const PET_STORAGE_KEY = 'browsing-pet-id';

/* ============================================================
   Pet Pixel Art Definitions
   Each pet has frames defined as arrays of [x, y, color] pixels.
   Canvas is 16x16 scaled up 3x = 48x48 display size.
   ============================================================ */
const SCALE = 3;
const SPRITE_SIZE = 16;

/**
 * Builds pixel art frames for each pet.
 * Returns object mapping pet id -> array of frame data.
 * Each frame is an array of {x, y, color} objects.
 */
function buildPetFrames() {
    // Color palettes per pet
    const C = {
        cat: { body: '#f4a460', dark: '#cd853f', eye: '#2e8b57', nose: '#ff6b81', ear: '#cd853f' },
        dog: { body: '#c4a882', dark: '#a08060', eye: '#4a3728', nose: '#333', ear: '#a08060' },
        duck: { body: '#ffe066', dark: '#f0c040', eye: '#222', beak: '#ff8c00', feet: '#ff8c00' },
        fox: { body: '#e8601c', dark: '#c04010', eye: '#222', nose: '#222', tip: '#fff' },
        penguin: { body: '#222', belly: '#fff', eye: '#fff', beak: '#ff8c00', feet: '#ff8c00' },
        dragon: { body: '#6b5b95', dark: '#4a3f6b', eye: '#ff4444', wing: '#8b7bb5', fire: '#ff6b35' }
    };

    /** Helper: fill a rect of pixels */
    function rect(px, x, y, w, h, color) {
        for (let dy = 0; dy < h; dy++)
            for (let dx = 0; dx < w; dx++)
                px.push({ x: x + dx, y: y + dy, c: color });
    }

    /** Helper: set single pixel */
    function dot(px, x, y, color) { px.push({ x, y, c: color }); }

    // --- CAT (2 frames) ---
    function catFrame(legOffset) {
        const p = [], c = C.cat;
        // Ears
        dot(p, 4, 2, c.ear); dot(p, 5, 1, c.ear); dot(p, 9, 1, c.ear); dot(p, 10, 2, c.ear);
        // Head
        rect(p, 4, 3, 7, 5, c.body);
        // Eyes
        dot(p, 6, 5, c.eye); dot(p, 9, 5, c.eye);
        // Nose
        dot(p, 7, 6, c.nose); dot(p, 8, 6, c.nose);
        // Body
        rect(p, 3, 8, 9, 4, c.body);
        rect(p, 4, 8, 7, 4, c.dark);
        rect(p, 3, 8, 9, 3, c.body);
        // Tail
        dot(p, 12, 7, c.body); dot(p, 13, 6, c.body); dot(p, 14, 5, c.body);
        // Legs (animated)
        rect(p, 4, 12, 2, 2 + legOffset, c.dark);
        rect(p, 9, 12, 2, 2 + (1 - legOffset), c.dark);
        return p;
    }

    // --- DOG (2 frames) ---
    function dogFrame(legOffset) {
        const p = [], c = C.dog;
        // Ears (floppy)
        rect(p, 3, 3, 2, 3, c.ear); rect(p, 10, 3, 2, 3, c.ear);
        // Head
        rect(p, 4, 2, 7, 5, c.body);
        // Eyes
        dot(p, 6, 4, c.eye); dot(p, 9, 4, c.eye);
        // Nose/snout
        rect(p, 6, 5, 3, 2, c.dark); dot(p, 7, 5, c.nose);
        // Body
        rect(p, 3, 7, 9, 5, c.body);
        // Tail (wagging offset)
        dot(p, 12, 6 + legOffset, c.dark); dot(p, 13, 5 + legOffset, c.dark);
        // Legs
        rect(p, 4, 12, 2, 2 + legOffset, c.dark);
        rect(p, 9, 12, 2, 2 + (1 - legOffset), c.dark);
        return p;
    }

    // --- DUCK (2 frames) ---
    function duckFrame(legOffset) {
        const p = [], c = C.duck;
        // Head
        rect(p, 5, 2, 5, 4, c.body);
        // Eye
        dot(p, 8, 3, c.eye);
        // Beak
        rect(p, 10, 4, 3, 2, c.beak);
        // Body
        rect(p, 3, 6, 8, 5, c.body);
        rect(p, 4, 6, 6, 5, c.dark);
        rect(p, 3, 6, 8, 4, c.body);
        // Wing
        rect(p, 4, 7, 4, 3, c.dark);
        // Feet
        rect(p, 5, 11, 2, 1 + legOffset, c.feet);
        rect(p, 8, 11, 2, 1 + (1 - legOffset), c.feet);
        return p;
    }

    // --- FOX (2 frames) ---
    function foxFrame(legOffset) {
        const p = [], c = C.fox;
        // Ears
        dot(p, 4, 1, c.body); dot(p, 5, 0, c.body);
        dot(p, 9, 0, c.body); dot(p, 10, 1, c.body);
        // Head
        rect(p, 4, 2, 7, 5, c.body);
        // White muzzle
        rect(p, 6, 5, 3, 2, c.tip);
        // Eyes & nose
        dot(p, 6, 4, c.eye); dot(p, 9, 4, c.eye);
        dot(p, 7, 5, c.nose);
        // Body
        rect(p, 3, 7, 9, 5, c.body);
        rect(p, 5, 9, 5, 3, c.dark);
        // Tail (bushy)
        dot(p, 12, 8, c.body); dot(p, 13, 7, c.body);
        dot(p, 14, 6, c.body); dot(p, 14, 7, c.tip);
        // Legs
        rect(p, 4, 12, 2, 2 + legOffset, c.dark);
        rect(p, 9, 12, 2, 2 + (1 - legOffset), c.dark);
        return p;
    }

    // --- PENGUIN (2 frames) ---
    function penguinFrame(legOffset) {
        const p = [], c = C.penguin;
        // Head
        rect(p, 5, 1, 5, 4, c.body);
        // Eyes
        dot(p, 6, 3, c.eye); dot(p, 8, 3, c.eye);
        // Beak
        dot(p, 7, 4, c.beak);
        // Body
        rect(p, 4, 5, 7, 6, c.body);
        // Belly
        rect(p, 5, 6, 5, 4, c.belly);
        // Wings/flippers
        dot(p, 3, 6, c.body); dot(p, 3, 7, c.body);
        dot(p, 11, 6, c.body); dot(p, 11, 7, c.body);
        // Feet
        rect(p, 5, 11, 2, 1 + legOffset, c.feet);
        rect(p, 8, 11, 2, 1 + (1 - legOffset), c.feet);
        return p;
    }

    // --- DRAGON (2 frames) ---
    function dragonFrame(legOffset) {
        const p = [], c = C.dragon;
        // Horns
        dot(p, 5, 0, c.dark); dot(p, 9, 0, c.dark);
        // Head
        rect(p, 4, 1, 7, 5, c.body);
        // Eyes
        dot(p, 6, 3, c.eye); dot(p, 9, 3, c.eye);
        // Nostrils — little fire puff on frame 1
        dot(p, 10, 4, c.fire);
        // Body
        rect(p, 3, 6, 9, 5, c.body);
        // Spine ridge
        dot(p, 7, 6, c.dark); dot(p, 8, 6, c.dark);
        // Wing
        rect(p, 11, 4, 2, 4, c.wing); dot(p, 13, 3 + legOffset, c.wing);
        // Tail
        dot(p, 2, 9, c.body); dot(p, 1, 10, c.body); dot(p, 0, 10, c.dark);
        // Legs
        rect(p, 4, 11, 2, 2 + legOffset, c.dark);
        rect(p, 9, 11, 2, 2 + (1 - legOffset), c.dark);
        return p;
    }

    return {
        cat: [catFrame(0), catFrame(1)],
        dog: [dogFrame(0), dogFrame(1)],
        duck: [duckFrame(0), duckFrame(1)],
        fox: [foxFrame(0), foxFrame(1)],
        penguin: [penguinFrame(0), penguinFrame(1)],
        dragon: [dragonFrame(0), dragonFrame(1)]
    };
}

/* ============================================================
   Pet Definitions (metadata for the selection modal)
   ============================================================ */
const PETS = [
    { id: 'cat', name: 'Cat', desc: 'Aloof but loyal' },
    { id: 'dog', name: 'Dog', desc: 'Best friend vibes' },
    { id: 'duck', name: 'Duck', desc: 'Chaotic energy' },
    { id: 'fox', name: 'Fox', desc: 'Sly and curious' },
    { id: 'penguin', name: 'Penguin', desc: 'Chill companion' },
    { id: 'dragon', name: 'Dragon', desc: 'Mythical vibes' },
];

/* ============================================================
   State
   ============================================================ */
let activePet = null;
let petCanvas = null;
let petCtx = null;
let petFrames = null;
let allFrames = null;
let petX = 0, petY = 0;
let targetX = 0, targetY = 0;
let isMoving = false;
let idleTimeout = null;
let animFrameId = null;
let frameIndex = 0;
let frameTick = 0;

/* ============================================================
   Initialization
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    allFrames = buildPetFrames();
    const savedPetId = localStorage.getItem(PET_STORAGE_KEY);

    if (savedPetId && allFrames[savedPetId]) {
        spawnPet(savedPetId);
        createChangePetButton();
    } else {
        showSelectionModal();
    }
});

/* ============================================================
   Render a pet frame onto a canvas for the modal preview
   ============================================================ */
function renderPreviewCanvas(petId) {
    const PREVIEW_SCALE = 4;
    const canvas = document.createElement('canvas');
    canvas.width = SPRITE_SIZE * PREVIEW_SCALE;
    canvas.height = SPRITE_SIZE * PREVIEW_SCALE;
    canvas.style.width = (SPRITE_SIZE * PREVIEW_SCALE) + 'px';
    canvas.style.height = (SPRITE_SIZE * PREVIEW_SCALE) + 'px';
    canvas.style.imageRendering = 'pixelated';
    const ctx = canvas.getContext('2d');
    const frame = allFrames[petId][0];
    frame.forEach(px => {
        ctx.fillStyle = px.c;
        ctx.fillRect(px.x * PREVIEW_SCALE, px.y * PREVIEW_SCALE, PREVIEW_SCALE, PREVIEW_SCALE);
    });
    return canvas;
}

/* ============================================================
   Selection Modal
   ============================================================ */
function showSelectionModal() {
    let selectedId = null;

    const overlay = document.createElement('div');
    overlay.className = 'pet-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Choose your browsing buddy');

    const modal = document.createElement('div');
    modal.className = 'pet-modal';

    const title = document.createElement('h2');
    title.className = 'pet-modal__title';
    title.textContent = '✨ Choose Your Browsing Buddy';
    modal.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'pet-modal__subtitle';
    subtitle.textContent = "Pick a companion — they'll follow you around the site!";
    modal.appendChild(subtitle);

    const grid = document.createElement('div');
    grid.className = 'pet-grid';

    PETS.forEach(pet => {
        const btn = document.createElement('button');
        btn.className = 'pet-choice';
        btn.setAttribute('aria-label', 'Select ' + pet.name);
        btn.dataset.petId = pet.id;

        // Pixel art preview canvas instead of emoji
        const previewCanvas = renderPreviewCanvas(pet.id);
        previewCanvas.className = 'pet-choice__sprite';
        btn.appendChild(previewCanvas);

        const name = document.createElement('span');
        name.className = 'pet-choice__name';
        name.textContent = pet.name;
        btn.appendChild(name);

        btn.addEventListener('click', () => {
            grid.querySelectorAll('.pet-choice').forEach(b => b.classList.remove('pet-choice--selected'));
            btn.classList.add('pet-choice--selected');
            selectedId = pet.id;
            confirmBtn.classList.add('pet-modal__confirm--active');
        });

        grid.appendChild(btn);
    });
    modal.appendChild(grid);

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'pet-modal__confirm';
    confirmBtn.textContent = "Let's Go! 🚀";
    confirmBtn.addEventListener('click', () => {
        if (!selectedId) return;
        localStorage.setItem(PET_STORAGE_KEY, selectedId);
        overlay.classList.add('pet-modal-overlay--closing');
        setTimeout(() => {
            overlay.remove();
            spawnPet(selectedId);
            createChangePetButton();
        }, 400);
    });
    modal.appendChild(confirmBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

/* ============================================================
   Pet Spawning & Cursor Following
   ============================================================ */
function spawnPet(petId) {
    activePet = petId;
    petFrames = allFrames[petId];
    frameIndex = 0;
    frameTick = 0;

    // Create the pet canvas element
    petCanvas = document.createElement('canvas');
    petCanvas.width = SPRITE_SIZE * SCALE;
    petCanvas.height = SPRITE_SIZE * SCALE;
    petCanvas.className = 'browsing-pet';
    petCanvas.style.imageRendering = 'pixelated';
    petCanvas.setAttribute('aria-hidden', 'true');
    petCtx = petCanvas.getContext('2d');
    document.body.appendChild(petCanvas);

    // Start position
    petX = 60;
    petY = window.innerHeight - 60;
    targetX = petX;
    targetY = petY;

    drawFrame(0);
    updatePetPosition();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    startAnimationLoop();
}

/** Draw a specific frame onto the pet canvas */
function drawFrame(idx) {
    petCtx.clearRect(0, 0, petCanvas.width, petCanvas.height);
    const frame = petFrames[idx];
    frame.forEach(px => {
        petCtx.fillStyle = px.c;
        petCtx.fillRect(px.x * SCALE, px.y * SCALE, SCALE, SCALE);
    });
}

function onMouseMove(e) {
    targetX = e.clientX + 20;
    targetY = e.clientY + 20;
}

function onTouchMove(e) {
    if (e.touches.length > 0) {
        targetX = e.touches[0].clientX + 20;
        targetY = e.touches[0].clientY + 20;
    }
}

function startAnimationLoop() {
    const LERP_SPEED = 0.08;
    const ARRIVAL_THRESHOLD = 2;
    const FRAME_INTERVAL = 12; // ticks between frame swaps

    function tick() {
        petX += (targetX - petX) * LERP_SPEED;
        petY += (targetY - petY) * LERP_SPEED;
        petX = Math.max(0, Math.min(window.innerWidth - 48, petX));
        petY = Math.max(0, Math.min(window.innerHeight - 48, petY));
        updatePetPosition();

        const dx = targetX - petX;
        const dy = targetY - petY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > ARRIVAL_THRESHOLD) {
            if (!isMoving) { isMoving = true; clearTimeout(idleTimeout); }
            // Flip based on direction
            petCanvas.style.transform = dx < -5 ? 'scaleX(-1)' : 'scaleX(1)';
            // Animate walk cycle
            frameTick++;
            if (frameTick >= FRAME_INTERVAL) {
                frameTick = 0;
                frameIndex = (frameIndex + 1) % petFrames.length;
                drawFrame(frameIndex);
            }
        } else {
            if (isMoving) {
                isMoving = false;
                clearTimeout(idleTimeout);
                idleTimeout = setTimeout(() => {
                    petCanvas.style.transform = '';
                    drawFrame(0);
                }, 300);
            }
        }
        animFrameId = requestAnimationFrame(tick);
    }
    animFrameId = requestAnimationFrame(tick);
}

function updatePetPosition() {
    if (petCanvas) {
        petCanvas.style.left = petX + 'px';
        petCanvas.style.top = petY + 'px';
    }
}

/* ============================================================
   Change Pet Button
   ============================================================ */
function createChangePetButton() {
    const btn = document.createElement('button');
    btn.className = 'pet-change-btn';
    btn.textContent = '🐾';
    btn.title = 'Change your browsing buddy';
    btn.setAttribute('aria-label', 'Change browsing pet');

    btn.addEventListener('click', () => {
        if (petCanvas) { petCanvas.remove(); petCanvas = null; }
        if (animFrameId) cancelAnimationFrame(animFrameId);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('touchmove', onTouchMove);
        clearTimeout(idleTimeout);
        isMoving = false;
        btn.remove();
        localStorage.removeItem(PET_STORAGE_KEY);
        showSelectionModal();
    });
    document.body.appendChild(btn);
}
