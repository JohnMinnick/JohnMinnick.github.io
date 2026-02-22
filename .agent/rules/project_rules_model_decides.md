---
trigger: model_decision
description: Use these when relevant; skip when they add overhead without benefit.
---

# MODEL DECISION — Guidance (apply when it improves outcomes)

Use these when relevant; skip when they add overhead without benefit.

---

## A) Documentation formatting (ingestion-friendly)
- Use strict heading hierarchy: #, ##, ### only.
- Start each ## section with a 1–3 sentence micro-summary if it improves retrieval clarity.
- Prefer plain Markdown over complex formatting.

---

## B) Engineering hygiene (opportunistic)
- **Image optimization**: Before committing images, suggest resizing and
  compressing. WebP is preferred. Target < 200KB per asset.
- **Link checking**: After adding or modifying pages, verify all internal links
  and navigation items still work.
- **Lighthouse audit**: Suggest running Lighthouse (Chrome DevTools) periodically
  to catch performance, accessibility, and SEO regressions.
- **Process termination**: After stopping any local server or long-running
  command, verify the process is actually dead.

---

## C) Output discipline
- Prefer minimal diffs over full file rewrites.
- If a request is underspecified, propose a reasonable default and label it as
  an assumption.
- When adding new pages, always update navigation in all existing pages.

---

## D) Game / interactive toy guidelines (when building for games/)
- Each game lives in its own subdirectory: `games/<game-name>/`
- Each game should be self-contained: its own `index.html`, CSS, and JS
- Link back to the main site from each game
- Include a brief description and controls/instructions on the game page
- Keep game assets (sprites, sounds) inside the game subdirectory
- Games should work on mobile (touch controls) when feasible

---

## E) Continuity and context persistence (on-demand)
The file `docs/site_context.md` is the **cold-start handoff document**.
It must contain:
- Current project state (what pages exist, which are complete)
- Page status table (done, in-progress, planned)
- Known issues or TODOs
- Next planned tasks with enough detail to resume work

**When to update:** Use the `/doc-sync` workflow or update at the end of a
work session when the user requests it.

---

## F) Content authenticity
- Never fabricate project descriptions or accomplishments.
- If project details are unknown, ask the user rather than inventing.
- Use placeholder text clearly marked as `[TODO: ...]` rather than fake content.
- When describing skills or experience, use the user's own words when available.

---

## G) Design consistency checks (when building new pages/components)
- Verify new components use CSS custom properties from `variables.css`,
  not hardcoded values.
- Ensure consistent spacing, border-radius, and shadow usage across pages.
- Test dark mode appearance for every new component.
- Check that hover/focus states exist for all interactive elements.
