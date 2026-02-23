/**
 * breakout.js — Breakout / Brick Breaker Game
 *
 * Ball-and-paddle game with rows of colored bricks.
 * Features: 3 lives, level progression, increasing ball speed,
 * mouse/keyboard/touch paddle control, neon styling.
 */

/* ============================================================
   Constants
   ============================================================ */
const CANVAS_W = 480;
const CANVAS_H = 400;
const PADDLE_W = 80;
const PADDLE_H = 12;
const PADDLE_Y = CANVAS_H - 30;
const BALL_R = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_W = 52;
const BRICK_H = 18;
const BRICK_PAD = 4;
const BRICK_TOP = 50;
const BRICK_LEFT = (CANVAS_W - (BRICK_COLS * (BRICK_W + BRICK_PAD) - BRICK_PAD)) / 2;

/** Row colors — neon gradient palette */
const ROW_COLORS = ['#ff00aa', '#ff6b35', '#ffe066', '#00fff7', '#7c3aed'];

/* ============================================================
   DOM
   ============================================================ */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const titleEl = document.getElementById('overlay-title');
const textEl = document.getElementById('overlay-text');
const playBtn = document.getElementById('play-btn');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');

/* ============================================================
   State
   ============================================================ */
let paddleX = CANVAS_W / 2 - PADDLE_W / 2;
let ball = { x: 0, y: 0, dx: 0, dy: 0 };
let bricks = [];
let score = 0;
let lives = 3;
let level = 1;
let isRunning = false;
let rafId = null;

/* ============================================================
   Game Logic
   ============================================================ */

/** Initialize bricks for current level */
function initBricks() {
    bricks = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
        for (let c = 0; c < BRICK_COLS; c++) {
            bricks.push({
                x: BRICK_LEFT + c * (BRICK_W + BRICK_PAD),
                y: BRICK_TOP + r * (BRICK_H + BRICK_PAD),
                alive: true,
                color: ROW_COLORS[r % ROW_COLORS.length]
            });
        }
    }
}

/** Reset ball to center, moving upward */
function resetBall() {
    ball.x = CANVAS_W / 2;
    ball.y = PADDLE_Y - BALL_R - 2;
    const speed = 3 + level * 0.5;
    const angle = -Math.PI / 4 + Math.random() * (-Math.PI / 2);
    ball.dx = speed * Math.cos(angle);
    ball.dy = -Math.abs(speed * Math.sin(angle));
}

/** Start a new game */
function startGame() {
    score = 0; lives = 3; level = 1;
    scoreEl.textContent = '0';
    livesEl.textContent = '3';
    levelEl.textContent = '1';
    paddleX = CANVAS_W / 2 - PADDLE_W / 2;
    initBricks();
    resetBall();
    overlay.classList.add('hidden');
    isRunning = true;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(gameLoop);
}

/** Main game loop */
function gameLoop() {
    if (!isRunning) return;
    update();
    render();
    rafId = requestAnimationFrame(gameLoop);
}

/** Update game state per frame */
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions (left/right)
    if (ball.x - BALL_R <= 0 || ball.x + BALL_R >= CANVAS_W) {
        ball.dx = -ball.dx;
        ball.x = Math.max(BALL_R, Math.min(CANVAS_W - BALL_R, ball.x));
    }

    // Ceiling collision
    if (ball.y - BALL_R <= 0) {
        ball.dy = -ball.dy;
        ball.y = BALL_R;
    }

    // Floor — lose a life
    if (ball.y + BALL_R >= CANVAS_H) {
        lives--;
        livesEl.textContent = lives;
        if (lives <= 0) {
            return showGameOver();
        }
        resetBall();
    }

    // Paddle collision
    if (
        ball.dy > 0 &&
        ball.y + BALL_R >= PADDLE_Y &&
        ball.y + BALL_R <= PADDLE_Y + PADDLE_H &&
        ball.x >= paddleX &&
        ball.x <= paddleX + PADDLE_W
    ) {
        // Angle based on where ball hits paddle
        const hitPos = (ball.x - paddleX) / PADDLE_W; // 0..1
        const angle = -Math.PI / 6 - hitPos * (2 * Math.PI / 3); // -150° to -30°
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = speed * Math.cos(angle);
        ball.dy = speed * Math.sin(angle);
        ball.y = PADDLE_Y - BALL_R;
    }

    // Brick collisions
    let allDestroyed = true;
    for (const brick of bricks) {
        if (!brick.alive) continue;
        allDestroyed = false;

        if (
            ball.x + BALL_R > brick.x &&
            ball.x - BALL_R < brick.x + BRICK_W &&
            ball.y + BALL_R > brick.y &&
            ball.y - BALL_R < brick.y + BRICK_H
        ) {
            brick.alive = false;
            ball.dy = -ball.dy;
            score += 10 * level;
            scoreEl.textContent = score;
            break; // One brick per frame
        }
    }

    // Level complete — all bricks destroyed
    if (allDestroyed) {
        level++;
        levelEl.textContent = level;
        initBricks();
        resetBall();
    }
}

/** Show game over overlay */
function showGameOver() {
    isRunning = false;
    titleEl.textContent = '💀 Game Over';
    textEl.textContent = `Final Score: ${score}`;
    playBtn.textContent = 'Play Again';
    overlay.classList.remove('hidden');
}

/* ============================================================
   Rendering
   ============================================================ */
function render() {
    // Background
    ctx.fillStyle = '#0f1225';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Bricks
    for (const brick of bricks) {
        if (!brick.alive) continue;
        ctx.fillStyle = brick.color;
        ctx.shadowColor = brick.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y, BRICK_W, BRICK_H, 3);
        ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Paddle
    ctx.fillStyle = '#e6e8f0';
    ctx.shadowColor = '#00fff7';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(paddleX, PADDLE_Y, PADDLE_W, PADDLE_H, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = '#00fff7';
    ctx.shadowColor = '#00fff7';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

/* ============================================================
   Input
   ============================================================ */

/** Mouse control */
canvas.addEventListener('mousemove', (e) => {
    if (!isRunning) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    paddleX = (e.clientX - rect.left) * scaleX - PADDLE_W / 2;
    paddleX = Math.max(0, Math.min(CANVAS_W - PADDLE_W, paddleX));
});

/** Touch control */
canvas.addEventListener('touchmove', (e) => {
    if (!isRunning) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    paddleX = (e.touches[0].clientX - rect.left) * scaleX - PADDLE_W / 2;
    paddleX = Math.max(0, Math.min(CANVAS_W - PADDLE_W, paddleX));
}, { passive: false });

/** Keyboard control */
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
});
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// Keyboard paddle movement — runs in the game loop via a separate interval
setInterval(() => {
    if (!isRunning) return;
    const speed = 8;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        paddleX = Math.max(0, paddleX - speed);
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        paddleX = Math.min(CANVAS_W - PADDLE_W, paddleX + speed);
    }
}, 16);

/** Play button */
playBtn.addEventListener('click', startGame);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && !isRunning) { e.preventDefault(); startGame(); }
});

/** Initial render */
render();
