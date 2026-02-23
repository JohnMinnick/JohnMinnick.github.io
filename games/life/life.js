/**
 * life.js — Conway's Game of Life
 *
 * Cellular automaton on a toroidal grid. Click cells to toggle,
 * use controls to play/pause/step. Includes preset patterns.
 */

/* ============================================================
   Constants
   ============================================================ */
const COLS = 100;
const ROWS = 100;
const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');
const CELL_W = canvas.width / COLS;
const CELL_H = canvas.height / ROWS;

/* ============================================================
   DOM
   ============================================================ */
const playBtn = document.getElementById('play-btn');
const stepBtn = document.getElementById('step-btn');
const clearBtn = document.getElementById('clear-btn');
const randomBtn = document.getElementById('random-btn');
const gliderBtn = document.getElementById('glider-btn');
const speedSlider = document.getElementById('speed');
const genEl = document.getElementById('gen');

/* ============================================================
   State
   ============================================================ */
let grid = createEmptyGrid();
let running = false;
let generation = 0;
let loopId = null;

/** Create a COLS×ROWS grid of zeros */
function createEmptyGrid() {
    return Array.from({ length: ROWS }, () => new Uint8Array(COLS));
}

/* ============================================================
   Simulation
   ============================================================ */

/** Count live neighbors (toroidal wrapping) */
function countNeighbors(g, r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = (r + dr + ROWS) % ROWS;
            const nc = (c + dc + COLS) % COLS;
            count += g[nr][nc];
        }
    }
    return count;
}

/** Compute next generation */
function step() {
    const next = createEmptyGrid();
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const n = countNeighbors(grid, r, c);
            if (grid[r][c]) {
                // Alive: survives with 2 or 3 neighbors
                next[r][c] = (n === 2 || n === 3) ? 1 : 0;
            } else {
                // Dead: born with exactly 3 neighbors
                next[r][c] = (n === 3) ? 1 : 0;
            }
        }
    }
    grid = next;
    generation++;
    genEl.textContent = 'Gen: ' + generation;
}

/* ============================================================
   Rendering
   ============================================================ */
function render() {
    ctx.fillStyle = '#0f1225';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw live cells with a subtle glow
    ctx.fillStyle = '#00fff7';
    ctx.shadowColor = '#00fff7';
    ctx.shadowBlur = 2;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c]) {
                ctx.fillRect(c * CELL_W, r * CELL_H, CELL_W - 0.5, CELL_H - 0.5);
            }
        }
    }
    ctx.shadowBlur = 0;
}

/* ============================================================
   Game Loop
   ============================================================ */
function gameLoop() {
    if (!running) return;
    step();
    render();
    const fps = parseInt(speedSlider.value, 10);
    loopId = setTimeout(gameLoop, 1000 / fps);
}

function togglePlay() {
    running = !running;
    playBtn.textContent = running ? '⏸ Pause' : '▶ Play';
    playBtn.classList.toggle('active', running);
    if (running) gameLoop();
}

/* ============================================================
   Presets
   ============================================================ */

/** Fill grid with ~25% random cells */
function randomize() {
    grid = createEmptyGrid();
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            grid[r][c] = Math.random() < 0.25 ? 1 : 0;
        }
    }
    generation = 0;
    genEl.textContent = 'Gen: 0';
    render();
}

/** Place a Gosper glider gun near top-left */
function placeGliderGun() {
    grid = createEmptyGrid();
    generation = 0;
    genEl.textContent = 'Gen: 0';

    // Gosper glider gun coordinates (offset by 2,2)
    const gun = [
        [5, 1], [5, 2], [6, 1], [6, 2],
        [5, 11], [6, 11], [7, 11], [4, 12], [8, 12], [3, 13], [9, 13], [3, 14], [9, 14],
        [6, 15], [4, 16], [8, 16], [5, 17], [6, 17], [7, 17], [6, 18],
        [3, 21], [4, 21], [5, 21], [3, 22], [4, 22], [5, 22], [2, 23], [6, 23],
        [1, 25], [2, 25], [6, 25], [7, 25],
        [3, 35], [4, 35], [3, 36], [4, 36]
    ];

    gun.forEach(([r, c]) => {
        if (r < ROWS && c < COLS) grid[r][c] = 1;
    });
    render();
}

/* ============================================================
   Input
   ============================================================ */

/** Toggle cells by clicking/dragging */
let isDrawing = false;
let drawValue = 1;

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const { r, c } = getCellPos(e);
    drawValue = grid[r][c] ? 0 : 1;
    grid[r][c] = drawValue;
    render();
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const { r, c } = getCellPos(e);
    grid[r][c] = drawValue;
    render();
});

canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('mouseleave', () => { isDrawing = false; });

/** Touch support */
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    const { r, c } = getTouchCellPos(e);
    drawValue = grid[r][c] ? 0 : 1;
    grid[r][c] = drawValue;
    render();
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const { r, c } = getTouchCellPos(e);
    grid[r][c] = drawValue;
    render();
}, { passive: false });

canvas.addEventListener('touchend', () => { isDrawing = false; });

/** Get cell row/col from mouse event */
function getCellPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    return {
        c: Math.min(COLS - 1, Math.max(0, Math.floor(x / CELL_W))),
        r: Math.min(ROWS - 1, Math.max(0, Math.floor(y / CELL_H)))
    };
}

/** Get cell row/col from touch event */
function getTouchCellPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height);
    return {
        c: Math.min(COLS - 1, Math.max(0, Math.floor(x / CELL_W))),
        r: Math.min(ROWS - 1, Math.max(0, Math.floor(y / CELL_H)))
    };
}

/* ============================================================
   Button Events
   ============================================================ */
playBtn.addEventListener('click', togglePlay);

stepBtn.addEventListener('click', () => {
    if (!running) { step(); render(); }
});

clearBtn.addEventListener('click', () => {
    running = false;
    playBtn.textContent = '▶ Play';
    playBtn.classList.remove('active');
    grid = createEmptyGrid();
    generation = 0;
    genEl.textContent = 'Gen: 0';
    render();
});

randomBtn.addEventListener('click', randomize);
gliderBtn.addEventListener('click', placeGliderGun);

/* Initial render */
render();
