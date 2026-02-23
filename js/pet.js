/**
 * pet.js — Browsing Pet System
 *
 * Shows a "Choose Your Browsing Buddy" modal on first visit.
 * The selected pet follows the cursor across all pages with a
 * trotting animation. Choice persists in localStorage.
 *
 * Included on every page via <script src="js/pet.js"></script>.
 */

/* ============================================================
   Pet Definitions
   Each pet has an emoji sprite, a name, and a fun description.
   ============================================================ */
const PETS = [
    { id: 'cat', sprite: '🐱', name: 'Cat', desc: 'Aloof but loyal' },
    { id: 'dog', sprite: '🐶', name: 'Dog', desc: 'Best friend vibes' },
    { id: 'duck', sprite: '🦆', name: 'Duck', desc: 'Chaotic energy' },
    { id: 'fox', sprite: '🦊', name: 'Fox', desc: 'Sly and curious' },
    { id: 'penguin', sprite: '🐧', name: 'Penguin', desc: 'Chill companion' },
    { id: 'dragon', sprite: '🐉', name: 'Dragon', desc: 'Mythical vibes' },
];

/** localStorage key for persisting the chosen pet */
const PET_STORAGE_KEY = 'browsing-pet-id';

/* ============================================================
   State
   ============================================================ */
let activePet = null;       // Currently selected pet object
let petElement = null;      // DOM element for the on-screen pet
let petX = 0, petY = 0;     // Current pet position
let targetX = 0, targetY = 0; // Mouse / target position
let isMoving = false;        // Whether the pet is currently trotting
let idleTimeout = null;      // Timer to switch to idle state
let animFrameId = null;      // requestAnimationFrame ID

/* ============================================================
   Initialization
   Runs on DOMContentLoaded. Checks localStorage for a saved
   pet, otherwise shows the selection modal.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const savedPetId = localStorage.getItem(PET_STORAGE_KEY);

    if (savedPetId) {
        // Returning visitor — spawn their saved pet immediately
        const pet = PETS.find(p => p.id === savedPetId);
        if (pet) {
            spawnPet(pet);
            createChangePetButton();
            return;
        }
    }

    // First visit — show selection modal
    showSelectionModal();
});

/* ============================================================
   Selection Modal
   ============================================================ */

/**
 * Creates and displays the pet selection modal overlay.
 */
function showSelectionModal() {
    let selectedId = null;

    // --- Overlay ---
    const overlay = document.createElement('div');
    overlay.className = 'pet-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Choose your browsing buddy');

    // --- Modal Card ---
    const modal = document.createElement('div');
    modal.className = 'pet-modal';

    // Title
    const title = document.createElement('h2');
    title.className = 'pet-modal__title';
    title.textContent = '✨ Choose Your Browsing Buddy';
    modal.appendChild(title);

    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.className = 'pet-modal__subtitle';
    subtitle.textContent = 'Pick a companion — they\'ll follow you around the site!';
    modal.appendChild(subtitle);

    // --- Pet Grid ---
    const grid = document.createElement('div');
    grid.className = 'pet-grid';

    PETS.forEach(pet => {
        const btn = document.createElement('button');
        btn.className = 'pet-choice';
        btn.setAttribute('aria-label', `Select ${pet.name}`);
        btn.dataset.petId = pet.id;

        // Emoji sprite
        const sprite = document.createElement('span');
        sprite.className = 'pet-choice__sprite';
        sprite.textContent = pet.sprite;
        btn.appendChild(sprite);

        // Pet name
        const name = document.createElement('span');
        name.className = 'pet-choice__name';
        name.textContent = pet.name;
        btn.appendChild(name);

        // Click handler — select this pet
        btn.addEventListener('click', () => {
            // Deselect all, then select this one
            grid.querySelectorAll('.pet-choice').forEach(b => {
                b.classList.remove('pet-choice--selected');
            });
            btn.classList.add('pet-choice--selected');
            selectedId = pet.id;

            // Enable the confirm button
            confirmBtn.classList.add('pet-modal__confirm--active');
        });

        grid.appendChild(btn);
    });

    modal.appendChild(grid);

    // --- Confirm Button ---
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'pet-modal__confirm';
    confirmBtn.textContent = 'Let\'s Go! 🚀';

    confirmBtn.addEventListener('click', () => {
        if (!selectedId) return;

        // Save choice
        localStorage.setItem(PET_STORAGE_KEY, selectedId);

        // Close modal with animation
        overlay.classList.add('pet-modal-overlay--closing');

        setTimeout(() => {
            overlay.remove();

            // Spawn the pet
            const pet = PETS.find(p => p.id === selectedId);
            if (pet) {
                spawnPet(pet);
                createChangePetButton();
            }
        }, 400); // Match fadeOut animation duration
    });

    modal.appendChild(confirmBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

/* ============================================================
   Pet Spawning & Cursor Following
   ============================================================ */

/**
 * Spawns the chosen pet on screen and begins cursor tracking.
 * @param {Object} pet - Pet object from the PETS array.
 */
function spawnPet(pet) {
    activePet = pet;

    // Create pet element
    petElement = document.createElement('div');
    petElement.className = 'browsing-pet browsing-pet--idle';
    petElement.textContent = pet.sprite;
    petElement.setAttribute('aria-hidden', 'true');
    document.body.appendChild(petElement);

    // Start at bottom-left of viewport
    petX = 60;
    petY = window.innerHeight - 60;
    targetX = petX;
    targetY = petY;
    updatePetPosition();

    // Track mouse movement
    document.addEventListener('mousemove', onMouseMove);

    // Track touch movement (mobile)
    document.addEventListener('touchmove', onTouchMove, { passive: true });

    // Start the animation loop
    startAnimationLoop();
}

/**
 * Mouse move handler — updates target position.
 * @param {MouseEvent} e
 */
function onMouseMove(e) {
    // Offset the target so the pet sits below-right of the cursor
    targetX = e.clientX + 15;
    targetY = e.clientY + 15;
}

/**
 * Touch move handler — updates target position for mobile.
 * @param {TouchEvent} e
 */
function onTouchMove(e) {
    if (e.touches.length > 0) {
        targetX = e.touches[0].clientX + 15;
        targetY = e.touches[0].clientY + 15;
    }
}

/**
 * Animation loop — smoothly interpolates pet position toward
 * the cursor using lerp (linear interpolation). Also manages
 * the trotting vs. idle animation state.
 */
function startAnimationLoop() {
    /** Interpolation speed (0–1). Lower = smoother/slower following. */
    const LERP_SPEED = 0.08;

    /** Distance threshold for considering the pet "arrived" */
    const ARRIVAL_THRESHOLD = 2;

    /**
     * Single frame update.
     */
    function tick() {
        // Lerp toward target
        petX += (targetX - petX) * LERP_SPEED;
        petY += (targetY - petY) * LERP_SPEED;

        // Clamp to viewport
        petX = Math.max(0, Math.min(window.innerWidth - 30, petX));
        petY = Math.max(0, Math.min(window.innerHeight - 30, petY));

        updatePetPosition();

        // Check distance to target
        const dx = targetX - petX;
        const dy = targetY - petY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > ARRIVAL_THRESHOLD) {
            // Pet is moving — show trot animation
            if (!isMoving) {
                isMoving = true;
                petElement.classList.remove('browsing-pet--idle');
                petElement.classList.add('browsing-pet--moving');
                clearTimeout(idleTimeout);
            }

            // Flip horizontally based on movement direction
            if (dx < -5) {
                petElement.style.transform = 'scaleX(-1)';
            } else if (dx > 5) {
                petElement.style.transform = 'scaleX(1)';
            }
        } else {
            // Pet has arrived — switch to idle after a brief pause
            if (isMoving) {
                isMoving = false;
                clearTimeout(idleTimeout);
                idleTimeout = setTimeout(() => {
                    petElement.classList.remove('browsing-pet--moving');
                    petElement.classList.add('browsing-pet--idle');
                    petElement.style.transform = '';
                }, 200);
            }
        }

        animFrameId = requestAnimationFrame(tick);
    }

    animFrameId = requestAnimationFrame(tick);
}

/**
 * Updates the pet element's CSS position.
 */
function updatePetPosition() {
    if (petElement) {
        petElement.style.left = `${petX}px`;
        petElement.style.top = `${petY}px`;
    }
}

/* ============================================================
   Change Pet Button
   Small button in the bottom-left corner to re-open the modal.
   ============================================================ */

/**
 * Creates a small paw button that lets the user change their pet.
 */
function createChangePetButton() {
    const btn = document.createElement('button');
    btn.className = 'pet-change-btn';
    btn.textContent = '🐾';
    btn.title = 'Change your browsing buddy';
    btn.setAttribute('aria-label', 'Change browsing pet');

    btn.addEventListener('click', () => {
        // Remove current pet
        if (petElement) {
            petElement.remove();
            petElement = null;
        }
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
        }
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('touchmove', onTouchMove);
        clearTimeout(idleTimeout);
        isMoving = false;

        // Remove change button itself
        btn.remove();

        // Clear storage and show modal again
        localStorage.removeItem(PET_STORAGE_KEY);
        showSelectionModal();
    });

    document.body.appendChild(btn);
}

/* ============================================================
   Respect Reduced Motion
   If the user prefers reduced motion, disable pet animations
   but still allow the companion to exist statically.
   ============================================================ */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Override the lerp speed to be instant
    // (The CSS already disables keyframe animations)
}
