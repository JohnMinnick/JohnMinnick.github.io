---
trigger: always_on
---

# ALWAYS ON — Project Invariants (Personal Website / GitHub Pages)

These rules are non-negotiable and apply to every task in this repo.

---

## 0) Stack constraints (non-negotiable)
- Languages: HTML5, CSS3, vanilla JavaScript (ES6+)
- No build tools, bundlers, or frameworks — everything runs natively in the browser
- No server-side code — this is a GitHub Pages static site
- External libraries allowed only when they add significant value (e.g. Three.js for 3D,
  GSAP for animation) — justify each dependency in a comment at the import
- Google Fonts are allowed and encouraged for typography

---

## 1) Repo structure
```
/                         # Root — GitHub Pages serves from here
├── index.html            # Landing / home page
├── pages/                # Additional pages (projects.html, playground.html, etc.)
├── css/
│   ├── variables.css     # Design tokens (colors, fonts, spacing, breakpoints)
│   ├── reset.css         # CSS reset / normalize
│   ├── global.css        # Shared layout, typography, dark-mode base
│   └── pages/            # Per-page styles (home.css, projects.css, etc.)
├── js/
│   ├── main.js           # Shared logic (nav, theme, smooth scroll)
│   └── pages/            # Per-page scripts (playground.js, etc.)
├── assets/
│   ├── images/           # Optimized images (WebP preferred, JPEG/PNG fallback)
│   ├── icons/            # SVG icons and favicons
│   └── fonts/            # Self-hosted fonts (if any)
├── games/                # Mini-games and interactive toys (self-contained per game)
├── docs/                 # Agent context and project docs (not served to visitors)
│   └── site_context.md   # Current project state for agent handoff
├── .agent/               # Agent rules and workflows
│   ├── rules/
│   └── workflows/
└── README.md             # Repo description
```

---

## 2) Naming conventions
- HTML files: kebab-case.html (e.g. `project-detail.html`)
- CSS files: kebab-case.css (e.g. `variables.css`, `home.css`)
- JS files: kebab-case.js (e.g. `main.js`, `playground.js`)
- Images: kebab-case with descriptive names (e.g. `spike-prophecy-hero.webp`)
- CSS classes: kebab-case (e.g. `.project-card`, `.nav-link--active`)
- JS functions: camelCase (e.g. `initNavigation()`, `loadProjectCards()`)
- CSS custom properties: `--color-primary`, `--font-heading`, `--space-md`

---

## 3) Design system (non-negotiable aesthetics)
- **Theme**: Dark mode base with vibrant accent colors — fun, not corporate
- **Color palette**: Defined in `css/variables.css` as CSS custom properties
  - Dark backgrounds (near-black, dark grays)
  - Vibrant accents (neon/electric tones — pick a cohesive palette)
  - High contrast text for readability
- **Typography**: Use Google Fonts — a fun display font for headings, a clean
  sans-serif for body text. Define in `css/variables.css`.
- **Spacing**: Use a consistent spacing scale (4px base) defined as custom properties
- **Responsiveness**: Mobile-first. All pages must look great on phones, tablets,
  and desktops. Use CSS Grid and Flexbox, not float-based layouts.
- **Animations**: Use CSS transitions/animations for UI. Keep them smooth (60fps).
  Respect `prefers-reduced-motion`.
- **Interactive elements**: Hover effects, micro-animations, and playful touches
  are encouraged — the site should feel alive.

---

## 4) SEO and accessibility
- Every page must have: unique `<title>`, `<meta name="description">`, proper
  heading hierarchy (single `<h1>`), and `<meta name="viewport">`.
- All images must have descriptive `alt` attributes.
- Use semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<section>`,
  `<article>`, `<footer>`).
- Interactive elements must be keyboard-accessible.
- Color contrast must meet WCAG AA minimum (4.5:1 for text).
- Include Open Graph meta tags for social sharing.

---

## 5) Asset management
- Optimize all images before committing (target < 200KB per image).
- Prefer WebP format with JPEG/PNG fallback via `<picture>` elements.
- SVG for icons and logos (inline when possible for styling).
- Lazy-load images below the fold with `loading="lazy"`.
- No images larger than 1920px wide (2x retina max).

---

## 6) Code quality
- All HTML, CSS, and JS files must be properly commented.
- HTML: Comment each major section (`<!-- Hero Section -->`, `<!-- Projects Grid -->`).
- CSS: Comment each section and non-obvious property choices.
- JS: JSDoc-style comments for functions, inline comments for complex logic.
- No inline styles — all styling lives in CSS files.
- No inline JS event handlers — use `addEventListener` in JS files.
- Keep files focused: one responsibility per file where practical.

---

## 7) Content rules
- Only showcase public, released projects (never private or unreleased work).
- All project descriptions should be honest — no exaggeration.
- Include links to live demos and source code where available.
- Keep bio/about content authentic and personality-forward.

---

## 8) Deployment (GitHub Pages)
- The site is deployed from the root of the `main` branch.
- Every push to `main` triggers a deploy — test locally before pushing.
- No build step required — what's in the repo IS the site.
- Use relative paths for all internal links and assets.
- Test with a local HTTP server (e.g. `python -m http.server`) before pushing.

---

## 9) Git discipline
- Commit messages: imperative mood, concise (e.g. "Add projects page layout")
- Don't commit broken pages — every commit should result in a working site.
- Use `.gitignore` for: OS files, editor configs, `node_modules/` (if any
  dev tooling is added), `.DS_Store`, `Thumbs.db`.

---

## 10) Sources of truth (precedence)
1. `docs/site_context.md` — current project state and next tasks
2. `.agent/rules/` — how to work in this repo
3. `.agent/workflows/` — how to perform common tasks
4. The live HTML/CSS/JS — implementation truth
