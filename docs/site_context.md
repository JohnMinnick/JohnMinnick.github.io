# Site Context — JohnMinnick.github.io

> Cold-start handoff document for agent continuity.
> Updated by the `/doc-sync` workflow.

**Last Updated:** 2026-02-22
**Status:** ✅ Live — all pages built, tested, and deployed

---

## Page Status

| Page | File | Status |
| --- | --- | --- |
| Home / Landing | `index.html` | ✅ Complete — hero particles, about, featured projects |
| Projects | `pages/projects.html` | ✅ Complete — 6 project cards with filters |
| Playground | `pages/playground.html` | ✅ Complete — 4 game cards linked |
| About | `pages/about.html` | ✅ Complete — bio, education, skills, highlights |
| 404 | `404.html` | ✅ Complete — glitch animation, fun facts |

---

## Design System

- **Variables:** `css/variables.css` — full token set (colors, fonts, spacing, breakpoints)
- **Palette:** Dark neon — near-black bg, cyan/purple/pink accents
- **Typography:** Space Grotesk (headings) + Inter (body) via Google Fonts
- **Spacing:** 4px base scale as custom properties

---

## Games / Interactive Toys

| Game | Directory | Status |
| --- | --- | --- |
| Snake | `games/snake/` | ✅ |
| Breakout | `games/breakout/` | ✅ |
| Particle Sandbox | `games/particles/` | ✅ |
| Game of Life | `games/life/` | ✅ |

---

## Polish Features

- ✅ SVG Favicon (`assets/icons/favicon.svg`) — JRM gradient
- ✅ Page transitions — fade in/out via `global.css` + `main.js`
- ✅ Terminal easter egg — backtick-activated CRT overlay (`js/terminal.js`)
- ✅ Custom 404 page
- ✅ Pixel art browsing buddy (`js/pet.js`)
- ✅ Branding: **John R. Minnick / JRM** across all pages

---

## Known Issues / TODOs

- See `docs/rainy-day.md` for backlog items
- Open Graph images not yet generated (text meta tags are in place)

---

## Next Tasks

- Responsive testing on real mobile devices
- Lighthouse audit for performance/accessibility scores
- Add new projects as they're completed
