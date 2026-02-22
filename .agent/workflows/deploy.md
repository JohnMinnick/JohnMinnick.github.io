---
description: Commit, push, and verify the site is live on GitHub Pages
---

# /deploy — Deploy to GitHub Pages

Run this when the user wants to push changes live.

## Steps

// turbo-all

1. **Pre-flight checks:**
   - Run `git status` to see what's changed
   - Open the site locally in the browser and do a quick visual check
   - Verify no broken links or missing assets

2. **Stage and commit:**
   - `git add .` (or specific files if the user prefers)
   - `git commit -m "<descriptive message in imperative mood>"`
   - Ask the user to confirm the commit message if it's a large change

3. **Push:**
   - `git push origin main`

4. **Verify deployment:**
   - Wait ~60 seconds for GitHub Pages to build
   - Open `https://johnminnick.github.io/` in the browser
   - Verify the changes are live and nothing is broken

5. **Report:** Summarize what was deployed to the user.

## Notes
- GitHub Pages deploys from the root of the `main` branch.
- Typical deploy time is 30–90 seconds after push.
- If the deploy fails, check the Actions tab on GitHub for error details.
