/**
 * snake.js — Classic Snake Game
 *
 * Grid-based snake game rendered on HTML Canvas.
 * Features: score tracking, high score (localStorage), speed
 * increase every 5 food items, mobile touch controls, neon styling.
 */

/* ============================================================
   Constants
   ============================================================ */
const GRID_SIZE = 20;        // Number of cells per axis
const CELL_SIZE = 20;        // Pixels per cell (400 / 20)
const INITIAL_SPEED = 150;   // ms per tick (lower = faster)
const SPEED_STEP = 10;       // ms reduction per speed level
const FOOD_PER_LEVEL = 5;    // food eaten before speed increases

/* ============================================================
   Colors — neon palette matching the site
   ============================================================ */
const COLORS = {
    bg: '#0f1225',
    grid: 'rgba(0, 255, 247, 0.03)',
    snakeHead: '#00fff7',
    snakeBody: '#0af',
    snakeTail: '#7c3aed',
    food: '#ff00aa',
    foodGlow: 'rgba(255, 0, 170, 0.3)',
};

/* ============================================================
   DOM References
   ============================================================ */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const titleEl = document.getElementById('overlay-title');
const textEl = document.getElementById('overlay-text');
const playBtn = document.getElementById('play-btn');
const scoreEl = document.getElementById('score');
const hiScoreEl = document.getElementById('high-score');
const speedEl = document.getElementById('speed-display');

/* ============================================================
   Game State
   ============================================================ */
let snake = [];          // Array of {x, y} segments (head first)
let food = { x: 0, y: 0 };
let direction = { x: 1, y: 0 };   // Current movement direction
let nextDirection = { x: 1, y: 0 }; // Buffered next direction
let score = 0;
let highScore = parseInt(localStorage.getItem('snake-high-score') || '0', 10);
let speed = INITIAL_SPEED;
let speedLevel = 1;
let gameLoop = null;
let isRunning = false;

// Display saved high score on load
hiScoreEl.textContent = highScore;

/* ============================================================
   Game Logic
   ============================================================ */

/**
 * Initializes a new game — resets snake, score, speed, places food.
 */
function startGame() {
    // Reset state
    const mid = Math.floor(GRID_SIZE / 2);
    snake = [
        { x: mid, y: mid },
        { x: mid - 1, y: mid },
        { x: mid - 2, y: mid }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    speed = INITIAL_SPEED;
    speedLevel = 1;

    scoreEl.textContent = '0';
    speedEl.textContent = '1';

    placeFood();
    overlay.classList.add('hidden');
    isRunning = true;

    // Start the game loop
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(tick, speed);
}

/**
 * One game tick — move snake, check collisions, eat food, render.
 */
function tick() {
    // Apply buffered direction
    direction = { ...nextDirection };

    // Calculate new head position
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return gameOver();
    }

    // Check self collision
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return gameOver();
        }
    }

    // Add new head
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;

        // Speed increase every FOOD_PER_LEVEL items
        if (score % FOOD_PER_LEVEL === 0 && speed > 50) {
            speed -= SPEED_STEP;
            speedLevel++;
            speedEl.textContent = speedLevel;
            clearInterval(gameLoop);
            gameLoop = setInterval(tick, speed);
        }

        placeFood();
    } else {
        // Remove tail (no growth)
        snake.pop();
    }

    render();
}

/**
 * Handles game over — stops loop, updates high score, shows overlay.
 */
function gameOver() {
    isRunning = false;
    clearInterval(gameLoop);

    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snake-high-score', highScore.toString());
        hiScoreEl.textContent = highScore;
    }

    // Show game over overlay
    titleEl.textContent = '💀 Game Over';
    textEl.textContent = `Score: ${score} · Best: ${highScore}`;
    playBtn.textContent = 'Play Again';
    overlay.classList.remove('hidden');
}

/**
 * Places food on a random empty cell.
 */
function placeFood() {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y));
    food = pos;
}

/* ============================================================
   Rendering
   ============================================================ */

/**
 * Renders the full game frame: background grid, food, snake.
 */
function render() {
    // Clear canvas
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle grid lines
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        const pos = i * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(canvas.width, pos);
        ctx.stroke();
    }

    // Draw food with glow
    ctx.shadowColor = COLORS.foodGlow;
    ctx.shadowBlur = 12;
    ctx.fillStyle = COLORS.food;
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2.5, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((seg, i) => {
        // Gradient from head -> tail
        const t = i / Math.max(snake.length - 1, 1);
        ctx.fillStyle = lerpColor(COLORS.snakeHead, COLORS.snakeTail, t);

        // Rounded rect for each segment
        const pad = 1;
        const x = seg.x * CELL_SIZE + pad;
        const y = seg.y * CELL_SIZE + pad;
        const s = CELL_SIZE - pad * 2;
        ctx.beginPath();
        ctx.roundRect(x, y, s, s, 4);
        ctx.fill();

        // Glow on head
        if (i === 0) {
            ctx.shadowColor = COLORS.snakeHead;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    });
}

/**
 * Linearly interpolates between two hex colors.
 * @param {string} a - Start color (#rrggbb or named)
 * @param {string} b - End color
 * @param {number} t - Interpolation factor (0–1)
 * @returns {string} Interpolated color as rgb()
 */
function lerpColor(a, b, t) {
    const parse = (hex) => {
        const c = hex.replace('#', '');
        return [
            parseInt(c.substring(0, 2), 16),
            parseInt(c.substring(2, 4), 16),
            parseInt(c.substring(4, 6), 16)
        ];
    };
    const ca = parse(a), cb = parse(b);
    const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
    const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
    const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
    return `rgb(${r},${g},${bl})`;
}

/* ============================================================
   Input Handling
   ============================================================ */

/** Keyboard controls */
document.addEventListener('keydown', (e) => {
    if (!isRunning) return;

    switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown': case 's': case 'S':
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft': case 'a': case 'A':
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight': case 'd': case 'D':
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            break;
    }

    // Prevent page scrolling with arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});

/** Mobile d-pad controls */
document.querySelectorAll('.ctrl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isRunning) return;
        const dir = btn.dataset.dir;
        switch (dir) {
            case 'up': if (direction.y !== 1) nextDirection = { x: 0, y: -1 }; break;
            case 'down': if (direction.y !== -1) nextDirection = { x: 0, y: 1 }; break;
            case 'left': if (direction.x !== 1) nextDirection = { x: -1, y: 0 }; break;
            case 'right': if (direction.x !== -1) nextDirection = { x: 1, y: 0 }; break;
        }
    });
});

/** Play / restart button */
playBtn.addEventListener('click', startGame);

/** Spacebar to start/restart */
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && !isRunning) {
        e.preventDefault();
        startGame();
    }
});

/* Render initial empty state */
render();
