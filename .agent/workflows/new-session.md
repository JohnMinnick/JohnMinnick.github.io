---
description: Cold-start a new conversation with project context loaded efficiently
---

# /new-session — Conversation Handoff

Run this at the start of a new conversation to load project context
efficiently without re-reading everything.

## Steps

// turbo-all

1. **Load project context:**
   - Read `docs/site_context.md` (current state, page status, next tasks)
   - Read `.agent/rules/project_rules_always_on.md` (invariants)

2. **Quick visual check (optional, if relevant to the task):**
   - Open `index.html` in the browser to see current state of the site
   - Note any obvious issues or unfinished sections

3. **Summarize to user:**
   - Current state of the site (what pages exist and their status)
   - What's next based on site_context.md
   - Ask the user what they'd like to work on

## Notes
- Do NOT re-read all HTML/CSS/JS files unless the task specifically
  requires modifying them.
- Do NOT read model-decides rules unless there's a judgment call to make.
- The always-on rules are already loaded via the MEMORY system, so reading
  them is a quick sanity check, not strictly required every time.
