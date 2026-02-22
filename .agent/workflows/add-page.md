---
description: Scaffold a new page with proper layout, SEO, nav integration, and styles
---

# /add-page — Create a New Page

Run this when adding a new page to the site (e.g. projects, about, playground).

## Steps

1. **Confirm page details with user:**
   - Page name and URL slug (e.g. "projects" → `pages/projects.html`)
   - Page purpose (one-liner)
   - Any specific sections or features needed

2. **Create the HTML file:**
   - Create `pages/<slug>.html` using the shared page template structure:
     - Proper `<!DOCTYPE html>`, charset, viewport meta
     - Unique `<title>` and `<meta name="description">`
     - Open Graph meta tags
     - Link to shared CSS: `../css/reset.css`, `../css/variables.css`, `../css/global.css`
     - Link to page-specific CSS: `../css/pages/<slug>.css`
     - Semantic HTML5 structure: `<header>`, `<main>`, `<footer>`
     - Include shared nav (copy from index.html or use JS include)
     - Link to shared JS: `../js/main.js`
     - Link to page-specific JS: `../js/pages/<slug>.js` (if needed)
   - Comment each major section

3. **Create page-specific CSS:**
   - Create `css/pages/<slug>.css`
   - Use CSS custom properties from `variables.css` — no hardcoded values
   - Add section comments

4. **Create page-specific JS (if needed):**
   - Create `js/pages/<slug>.js`
   - Add JSDoc comments for all functions

5. **Update navigation:**
   - Add the new page link to the nav in `index.html` and ALL other pages
   - Ensure the nav highlights the current page (active state)

6. **Update docs:**
   - Add the new page to the page status table in `docs/site_context.md`
   - Mark it as "In Progress" or "Scaffold"

7. **Test:**
   - Open in browser and verify layout, nav, and responsive behavior
   - Check that all CSS/JS imports resolve correctly
