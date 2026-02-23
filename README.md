# JohnMinnick.github.io

Personal portfolio site for **John R. Minnick** — PhD student at UC Santa Cruz
building neural interfaces, computer vision pipelines, and spiking neural networks.

🔗 **Live:** [johnminnick.github.io](https://johnminnick.github.io)

---

## Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — no frameworks, no build tools
- **Google Fonts** — Space Grotesk (headings) + Inter (body)
- **Canvas API** — games, particle effects, pixel art pet system
- **GitHub Pages** — deployed from `main` branch

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero with interactive particle canvas, about preview, featured projects |
| **Projects** | Filterable project cards with tech tags and links |
| **Playground** | 4 canvas-based games and interactive toys |
| **About** | Bio, education, skills, highlights, and social links |
| **404** | Custom error page with glitch animation and fun facts |

## Playground Games

- 🐍 **Snake** — neon gradient body, speed progression, localStorage high score
- 🧱 **Breakout** — angle-based paddle physics, 3 lives, multi-level
- ✨ **Particle Sandbox** — gravity, trails, rainbow mode, up to 2000 particles
- 🧬 **Game of Life** — 100×100 toroidal grid, Gosper glider gun, adjustable speed

## Easter Eggs

- **Terminal** — press `` ` `` (backtick) on any page for a CRT-style terminal
  with a virtual filesystem, `neofetch`, and game launcher
- **Browsing Buddy** — pixel art companion that follows your cursor

## Local Development

```bash
# Serve locally
python -m http.server 8080

# Open in browser
open http://localhost:8080
```

No build step — what's in the repo IS the site.

## Structure

```
├── index.html              # Landing page
├── 404.html                # Custom 404
├── pages/                  # Projects, Playground, About
├── css/                    # Design system + per-page styles
├── js/                     # Shared logic + per-page scripts
├── games/                  # Self-contained game directories
├── assets/                 # Images, icons, fonts
└── docs/                   # Project docs (not served)
```

## License

© 2026 John R. Minnick. All rights reserved.