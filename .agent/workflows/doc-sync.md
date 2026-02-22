---
description: Batch update docs/site_context.md at end of work session
---

# /doc-sync — Batch Documentation Update

Run this at the end of a work session (or when explicitly requested) to
update the project state document in one pass.

## Steps

1. **Read current state:**
   - Read `docs/site_context.md`

2. **Gather changes since last update:**
   - Check git status / recent commits
   - Review what was done in this conversation

3. **Update `docs/site_context.md`:**
   - Update the "Last Updated" timestamp
   - Update the page status table (mark completions, add new pages)
   - Update the design system section if tokens or fonts changed
   - Add any new known issues or TODOs discovered during the session
   - Update "Next Tasks" section
   - Keep changes minimal — a few lines, not a full rewrite

4. **Report:** Summarize what was updated to the user.
