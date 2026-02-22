---
description: Add a project card, blog entry, or game to the site
---

# /add-content — Add Content to the Site

Run this when adding a new project, game, or content piece to the site.

## For a Project Card

1. **Gather project info from user:**
   - Project name
   - One-line description
   - Technologies used
   - Link to live demo (if available)
   - Link to source code (if public)
   - Screenshot or hero image
   - Longer description (2-3 sentences)

2. **Add the project card:**
   - Add a new card element to `pages/projects.html`
   - Follow the existing card HTML pattern
   - Add any project-specific images to `assets/images/`
   - Optimize images (< 200KB, WebP preferred)

3. **Test:** Open projects page and verify the card renders correctly,
   links work, and responsive layout isn't broken.

---

## For a Mini-Game / Interactive Toy

1. **Gather game info from user:**
   - Game name and concept
   - Controls (keyboard, mouse, touch?)
   - Any external libraries needed

2. **Create the game directory:**
   - Create `games/<game-name>/index.html`
   - Create `games/<game-name>/style.css`
   - Create `games/<game-name>/game.js`
   - Each game is self-contained — all assets inside the game folder

3. **Wire it up:**
   - Add a card/link on the playground page pointing to the game
   - Include a "← Back to site" link in the game's HTML

4. **Test:** Play through the game, verify controls, check mobile.

---

## After Adding Any Content

- Update `docs/site_context.md` with the new content
- Verify navigation and cross-links still work
- Suggest running `/deploy` if the user wants it live
