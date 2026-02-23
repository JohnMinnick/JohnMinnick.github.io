/**
 * terminal.js — Hidden Terminal Easter Egg
 *
 * Press backtick (`) to open a retro CRT terminal overlay.
 * Supports commands: help, ls, cat, cd, whoami, clear, exit,
 * and secret easter eggs.
 *
 * Loaded on all pages via the global script includes.
 */

(function () {
    'use strict';

    /* ============================================================
       File System (virtual)
       ============================================================ */
    const FS = {
        '/': {
            type: 'dir',
            children: ['about.txt', 'projects/', 'skills.txt', 'links.txt', 'games/', 'secrets/']
        },
        '/about.txt': {
            type: 'file',
            content: [
                "Hey! I'm John Minnick.",
                "",
                "PhD student at UC Santa Cruz, working in the Braingeneers",
                "Group at the Genomics Institute. I build neural interface",
                "tools, computer vision pipelines, and spiking neural networks.",
                "",
                "When I'm not debugging CUDA kernels, you'll find me",
                "making games, writing shaders, or petting a dog."
            ]
        },
        '/skills.txt': {
            type: 'file',
            content: [
                "Languages:  Python, C++, JavaScript, MATLAB, SQL",
                "ML/DL:      PyTorch, TensorFlow, scikit-learn",
                "Neuro:      Neuropixels, calcium imaging, BCI",
                "Vision:     OpenCV, YOLO, custom CNN pipelines",
                "Web:        HTML/CSS/JS, Three.js, Canvas API",
                "Tools:      Git, Docker, Linux, Slurm, AWS"
            ]
        },
        '/links.txt': {
            type: 'file',
            content: [
                "GitHub:    https://github.com/JohnMinnick",
                "LinkedIn:  https://www.linkedin.com/in/john-minnick/",
                "Email:     jrminnic@ucsc.edu"
            ]
        },
        '/projects/': {
            type: 'dir',
            children: ['spike-prophecy.txt', 'organoid-cv.txt', 'neuropixels.txt']
        },
        '/projects/spike-prophecy.txt': {
            type: 'file',
            content: [
                "SpikeProphecy",
                "─────────────",
                "Real-time neural spike forecasting system.",
                "Uses LSTM teacher → SNN student distillation",
                "for sub-millisecond BCI predictions.",
                "Stack: PyTorch, snnTorch, Neuropixels"
            ]
        },
        '/projects/organoid-cv.txt': {
            type: 'file',
            content: [
                "Organoid Computer Vision Pipeline",
                "──────────────────────────────────",
                "Automated analysis of brain organoid activity",
                "from calcium imaging video. Custom U-Net for",
                "cell segmentation + temporal signal extraction.",
                "Stack: Python, OpenCV, PyTorch, napari"
            ]
        },
        '/projects/neuropixels.txt': {
            type: 'file',
            content: [
                "Neuropixels Data Pipeline",
                "─────────────────────────",
                "High-throughput processing for Neuropixels probes.",
                "384-channel parallel spike sorting, LFP analysis,",
                "and cross-session alignment.",
                "Stack: Python, SpikeInterface, DANDI"
            ]
        },
        '/games/': {
            type: 'dir',
            children: ['snake', 'breakout', 'particles', 'life']
        },
        '/secrets/': {
            type: 'dir',
            children: ['matrix.txt', 'ascii-art.txt']
        },
        '/secrets/matrix.txt': {
            type: 'file',
            content: [
                "Wake up, Neo...",
                "",
                "The Matrix has you.",
                "",
                "Follow the white rabbit.",
                "",
                "Knock, knock."
            ]
        },
        '/secrets/ascii-art.txt': {
            type: 'file',
            content: [
                "    ╔══════════════════════╗",
                "    ║   You found a secret ║",
                "    ║                      ║",
                "    ║    ⭐ Achievement    ║",
                "    ║     Unlocked! ⭐     ║",
                "    ║                      ║",
                "    ╚══════════════════════╝"
            ]
        }
    };

    /* ============================================================
       State
       ============================================================ */
    let cwd = '/';
    let overlay = null;
    let bodyEl = null;
    let inputEl = null;
    let history = [];
    let historyIndex = -1;

    /* ============================================================
       Terminal DOM Construction
       ============================================================ */

    /** Build and inject the terminal overlay into the page */
    function buildTerminal() {
        overlay = document.createElement('div');
        overlay.className = 'terminal-overlay';

        overlay.innerHTML = `
      <div class="terminal">
        <div class="terminal__titlebar">
          <div class="terminal__dot terminal__dot--red"></div>
          <div class="terminal__dot terminal__dot--yellow"></div>
          <div class="terminal__dot terminal__dot--green"></div>
          <span class="terminal__name">jm@portfolio ~ $</span>
        </div>
        <div class="terminal__body" id="terminal-body"></div>
        <div class="terminal__input-line">
          <span class="terminal__prompt">~/$ </span>
          <input type="text" class="terminal__input" id="terminal-input"
                 placeholder="type 'help' for commands"
                 autocomplete="off" spellcheck="false">
        </div>
      </div>
    `;

        document.body.appendChild(overlay);
        bodyEl = document.getElementById('terminal-body');
        inputEl = document.getElementById('terminal-input');

        // Print welcome message
        printLines([
            '╔══════════════════════════════════════════╗',
            '║         Welcome to JM Terminal v1.0      ║',
            '║    Press ` (backtick) to toggle. Enjoy!  ║',
            '╚══════════════════════════════════════════╝',
            '',
            "Type 'help' to see available commands.",
            ''
        ], 'system');

        // Input handling
        inputEl.addEventListener('keydown', handleInput);

        // Close on click outside terminal
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeTerminal();
        });

        // Add subtle hint to the page
        const hint = document.createElement('div');
        hint.className = 'terminal-hint';
        hint.textContent = 'press ` for terminal';
        document.body.appendChild(hint);
    }

    /* ============================================================
       Open / Close
       ============================================================ */
    function openTerminal() {
        if (!overlay) buildTerminal();
        overlay.classList.add('active');
        inputEl.focus();
    }

    function closeTerminal() {
        if (overlay) overlay.classList.remove('active');
    }

    function isOpen() {
        return overlay && overlay.classList.contains('active');
    }

    /* ============================================================
       Output Helpers
       ============================================================ */

    /** Print a single line to the terminal body */
    function printLine(text, className) {
        const line = document.createElement('div');
        line.className = 'terminal__line' + (className ? ' terminal__line--' + className : '');
        line.textContent = text;
        bodyEl.appendChild(line);
        bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    /** Print multiple lines */
    function printLines(lines, className) {
        lines.forEach(l => printLine(l, className));
    }

    /** Print the command echo (shows what user typed) */
    function printCommand(cmd) {
        printLine('~/$ ' + cmd, 'success');
    }

    /* ============================================================
       Command Processing
       ============================================================ */

    /** Resolve a path relative to cwd */
    function resolvePath(input) {
        if (!input) return cwd;
        if (input.startsWith('/')) return input;
        // Handle ..
        if (input === '..') {
            const parts = cwd.split('/').filter(Boolean);
            parts.pop();
            return '/' + parts.join('/') + (parts.length ? '/' : '');
        }
        // Append to cwd
        let path = cwd + (cwd.endsWith('/') ? '' : '/') + input;
        // Normalize
        path = path.replace(/\/+/g, '/');
        return path;
    }

    /** Execute a command string */
    function executeCommand(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;

        // Add to history
        history.push(trimmed);
        historyIndex = history.length;

        // Echo the command
        printCommand(trimmed);

        // Parse command and args
        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (cmd) {
            case 'help':
                printLines([
                    'Available commands:',
                    '',
                    '  help          Show this help message',
                    '  ls [dir]      List directory contents',
                    '  cat <file>    Display file contents',
                    '  cd <dir>      Change directory',
                    '  pwd           Print working directory',
                    '  whoami        Who are you?',
                    '  clear         Clear the terminal',
                    '  date          Show current date/time',
                    '  echo <text>   Print text',
                    '  neofetch      System info',
                    '  games         List available games',
                    '  play <game>   Launch a game',
                    '  exit          Close the terminal',
                    ''
                ], 'highlight');
                break;

            case 'ls':
                cmdLs(args[0]);
                break;

            case 'cat':
                cmdCat(args[0]);
                break;

            case 'cd':
                cmdCd(args[0]);
                break;

            case 'pwd':
                printLine(cwd);
                break;

            case 'whoami':
                printLine('john-minnick (visitor mode)', 'accent');
                break;

            case 'clear':
                bodyEl.innerHTML = '';
                break;

            case 'date':
                printLine(new Date().toString());
                break;

            case 'echo':
                printLine(args.join(' '));
                break;

            case 'neofetch':
                cmdNeofetch();
                break;

            case 'games':
                printLines([
                    'Available games:',
                    '  snake       — Classic Snake',
                    '  breakout    — Brick Breaker',
                    '  particles   — Particle Sandbox',
                    '  life        — Conway\'s Game of Life',
                    '',
                    "Use 'play <name>' to launch."
                ], 'highlight');
                break;

            case 'play':
                cmdPlay(args[0]);
                break;

            case 'sudo':
                printLine('Nice try 😏', 'error');
                break;

            case 'rm':
                printLine("I'm not letting you do that.", 'error');
                break;

            case 'exit':
            case 'quit':
            case 'q':
                closeTerminal();
                break;

            default:
                printLine(`command not found: ${cmd}`, 'error');
                printLine("Type 'help' for available commands.", 'system');
        }

        printLine(''); // Blank line after output
    }

    /** ls command */
    function cmdLs(dir) {
        const path = resolvePath(dir);
        const node = FS[path] || FS[path.replace(/\/$/, '') + '/'];
        if (!node || node.type !== 'dir') {
            printLine(`ls: cannot access '${dir || path}': Not a directory`, 'error');
            return;
        }
        node.children.forEach(c => {
            const isDir = c.endsWith('/') || c.endsWith('');
            printLine('  ' + c, FS[path + c] && FS[path + c].type === 'dir' ? 'accent' : '');
        });
    }

    /** cat command */
    function cmdCat(file) {
        if (!file) {
            printLine('cat: missing file argument', 'error');
            return;
        }
        let path = resolvePath(file);
        const node = FS[path];
        if (!node) {
            printLine(`cat: ${file}: No such file`, 'error');
            return;
        }
        if (node.type === 'dir') {
            printLine(`cat: ${file}: Is a directory`, 'error');
            return;
        }
        printLines(node.content);
    }

    /** cd command */
    function cmdCd(dir) {
        if (!dir || dir === '~' || dir === '/') {
            cwd = '/';
            return;
        }
        let path = resolvePath(dir);
        if (!path.endsWith('/')) path += '/';
        if (FS[path] && FS[path].type === 'dir') {
            cwd = path;
        } else {
            printLine(`cd: ${dir}: No such directory`, 'error');
        }
    }

    /** neofetch command */
    function cmdNeofetch() {
        printLines([
            '        ╭─────────╮',
            '        │  JM  ⚡  │      john-minnick@portfolio',
            '        ╰─────────╯      ────────────────────────',
            '     ╭──────────────╮    OS:      GitHub Pages',
            '     │   ██  JM  ██ │    Host:    johnminnick.github.io',
            '     │   ██████████ │    Kernel:  Vanilla JS (ES6+)',
            '     │   ██  ══  ██ │    Shell:   JM Terminal v1.0',
            '     │   ██████████ │    Theme:   Dark Neon',
            '     ╰──────────────╯    Font:    Space Grotesk + Inter',
            '                         Games:   4 built-in',
            '                         Pet:     Pixel art companion',
        ], 'accent');
    }

    /** play command */
    function cmdPlay(game) {
        const paths = {
            'snake': '/games/snake/',
            'breakout': '/games/breakout/',
            'particles': '/games/particles/',
            'life': '/games/life/',
        };
        if (!game) {
            printLine("play: specify a game name. Try 'games' to see options.", 'error');
            return;
        }
        const g = game.toLowerCase();
        if (paths[g]) {
            printLine(`Launching ${g}...`, 'success');
            setTimeout(() => {
                // Determine base path (works from any page)
                const isSubpage = window.location.pathname.includes('/pages/');
                const prefix = isSubpage ? '../' : '';
                window.location.href = prefix + paths[g];
            }, 500);
        } else {
            printLine(`play: unknown game '${game}'`, 'error');
        }
    }

    /* ============================================================
       Input Handling
       ============================================================ */
    function handleInput(e) {
        if (e.key === 'Enter') {
            executeCommand(inputEl.value);
            inputEl.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputEl.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                inputEl.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                inputEl.value = '';
            }
        } else if (e.key === 'Escape') {
            closeTerminal();
        }
    }

    /* ============================================================
       Global Keyboard Listener
       ============================================================ */
    document.addEventListener('keydown', (e) => {
        // Backtick toggles terminal (ignore if typing in an input)
        if (e.key === '`' && !e.ctrlKey && !e.metaKey) {
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') {
                // Only toggle if the active input IS the terminal input
                if (document.activeElement !== inputEl) return;
            }
            e.preventDefault();
            if (isOpen()) {
                closeTerminal();
            } else {
                openTerminal();
            }
        }
    });

})();
