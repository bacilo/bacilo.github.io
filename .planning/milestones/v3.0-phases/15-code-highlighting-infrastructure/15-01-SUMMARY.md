---
phase: 15-code-highlighting-infrastructure
plan: 01
subsystem: code-highlighting
tags: [shiki, syntax-highlighting, build-time, theme-coordination, markdown]
dependencies:
  requires: [astro-config, themes.css, phase-14-theme-system]
  provides: [shiki-dual-theme-config, code-block-theme-css]
  affects: [all-markdown-content, portfolio-pages, blog-pages]
tech-stack:
  added: [shiki-built-in, github-light-theme, github-dark-theme]
  patterns: [dual-theme-css-variables, attribute-selector-override, build-time-highlighting]
key-files:
  created: []
  modified:
    - astro.config.mjs
    - src/styles/themes.css
    - src/pages/portfolio/[...slug].astro
    - src/pages/posts/[...slug].astro
    - src/content/posts/2012-08-14-blog-post-1.md
decisions:
  - Use github-light and github-dark themes for broad familiarity and neutral aesthetic
  - Map 8 site themes to 2 code themes based on brightness (light-based themes use light code, dark-based use dark code)
  - Use !important declarations to override Shiki's inline styles for theme switching
  - Remove hardcoded pre backgrounds to allow Shiki's CSS variables to control code block colors
  - Enable wrap: true for mobile-friendly line wrapping
metrics:
  duration: 2m
  completed: 2026-02-16T11:32:38Z
  tasks: 2
  commits: 2
  files-modified: 5
  lines-added: 89
---

# Phase 15 Plan 01: Code Highlighting Infrastructure Summary

**One-liner:** Shiki dual-theme syntax highlighting with github-light/github-dark coordinated across 8 site themes via CSS variables

## Outcome

Successfully configured Astro's built-in Shiki syntax highlighter with dual light/dark theme support and added CSS rules that automatically coordinate code block colors with Phase 14's 8-theme system. All syntax highlighting happens at build time with zero client-side JavaScript. Code blocks now seamlessly switch between light and dark color schemes based on the active site theme.

## Tasks Completed

### Task 1: Configure Shiki dual themes in astro.config.mjs and add theme-coordination CSS to themes.css
- **Commit:** 811eea0
- **Files:** astro.config.mjs, src/styles/themes.css
- **Work:**
  - Added `markdown.shikiConfig` to astro.config.mjs with dual-theme configuration (github-light/github-dark)
  - Enabled `wrap: true` to prevent horizontal scrolling on mobile devices
  - Appended code block theme coordination CSS to themes.css with comprehensive coverage
  - Created CSS rules for default (:root) using --shiki-light variables
  - Created CSS rules for [data-theme="dark"] using --shiki-dark variables
  - Created nested media query for [data-theme="auto"] to respect system preferences
  - Mapped light-based novelty themes (sepia, lego) to --shiki-light
  - Mapped dark-based novelty themes (terminal, minecraft, synthwave) to --shiki-dark
  - Used !important declarations to override Shiki's inline styles
  - Added base .astro-code styling using existing CSS custom properties (border, padding, margin)
  - Verified build succeeds and Shiki generates CSS variables in dist/ output

### Task 2: Update existing page code styles and add a test code fence to verify highlighting
- **Commit:** d34a7bf
- **Files:** src/pages/portfolio/[...slug].astro, src/pages/posts/[...slug].astro, src/content/posts/2012-08-14-blog-post-1.md
- **Work:**
  - Updated portfolio page code styles: removed `background: var(--color-header-bg)` from `.content :global(pre)`
  - Updated blog post page code styles: removed `background: var(--color-header-bg)` from `.content :global(pre)`
  - Kept background on inline code elements (not affected by Shiki)
  - Adjusted padding from `0.125rem 0.375rem` to `0.2em 0.4em` for consistency
  - Adjusted font-size from `0.875em` to `0.9em` for better readability
  - Added `font-size: 0.9em` to pre elements
  - Changed pre margin from `var(--space-md) 0` to `var(--space-sm) 0` to match themes.css
  - Added test JavaScript code fence to blog-post-1.md with greet function
  - Rebuilt and verified HTML contains `<pre class="astro-code astro-code-themes github-light github-dark">`
  - Verified span elements contain inline styles with both --shiki-light and --shiki-dark CSS variables
  - Verified wrap settings applied: `overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;`
  - Verified no client-side JavaScript libraries (0 matches for prism/highlight.js in dist/)

## Deviations from Plan

None - plan executed exactly as written. All tasks completed without auto-fixes, architectural changes, or blocking issues.

## Verification Results

All success criteria met:

- ✓ `npm run build` succeeds with no errors or warnings related to Shiki/code highlighting
- ✓ Built HTML for test blog post contains `<pre class="astro-code astro-code-themes github-light github-dark">`
- ✓ Code block spans contain both --shiki-light and --shiki-dark CSS variables
- ✓ No client-side JavaScript libraries (0 matches for prism/highlight.js in dist/)
- ✓ themes.css contains CSS selectors for all 8 theme variations (17 occurrences of "astro-code")
- ✓ Pre elements in portfolio and blog pages no longer override Shiki's background color
- ✓ astro.config.mjs contains `themes: { light: 'github-light', dark: 'github-dark' }` and `wrap: true`

**Build output verification:**
- Shiki CSS variables compiled into dist/_astro/cv.BKMK1gCI.css
- All theme coordination rules present and correctly nested
- Auto mode media query correctly implements dark preference detection
- Code fence in blog post renders as syntax-highlighted HTML with no JavaScript

## Implementation Notes

**Shiki Dual-Theme Architecture:**
1. **Config Pattern:** astro.config.mjs defines dual themes → Shiki generates 4 CSS variables per token (--shiki-light, --shiki-light-bg, --shiki-dark, --shiki-dark-bg)
2. **Theme Coordination:** themes.css uses [data-theme] attribute selectors to choose which CSS variables display
3. **Override Strategy:** !important declarations necessary because Shiki applies inline styles to every <span> and <pre> element
4. **Cascade Order:** themes.css loaded after global.css → attribute selectors have higher specificity than :root → theme switching works instantly

**8-Theme to 2-Code-Theme Mapping:**
- Light-based site themes (light, sepia, lego) → github-light code theme
- Dark-based site themes (dark, terminal, minecraft, synthwave) → github-dark code theme
- Auto theme uses media query to detect system preference and apply appropriate code theme
- This provides visually coherent code blocks across all site themes with minimal complexity

**Build-Time vs Runtime:**
- All syntax highlighting happens during `npm run build` (Astro's markdown processing phase)
- Shiki transforms code fences into static HTML with inline styles
- No JavaScript shipped to browser for syntax highlighting
- Theme switching handled purely by CSS variable substitution
- Zero performance overhead at runtime

**Mobile Optimization:**
- `wrap: true` in shikiConfig enables line wrapping via `white-space: pre-wrap; word-wrap: break-word;`
- Long code lines break instead of causing horizontal scroll
- Maintains readability on narrow viewports (phones, tablets)

## Self-Check

Verification of claimed work:

**Files modified:**
```bash
git log --oneline --all --since="2026-02-16T11:30:00Z" -- astro.config.mjs src/styles/themes.css | head -2
```
811eea0 feat(15-01): configure Shiki dual themes and add code block theme CSS
d34a7bf feat(15-01): update page code styles and add test code fence

**Commits exist:**
```bash
git log --oneline --all | grep -E '(811eea0|d34a7bf)'
```
811eea0 feat(15-01): configure Shiki dual themes and add code block theme CSS
d34a7bf feat(15-01): update page code styles and add test code fence

**Build succeeds:**
```bash
npm run build 2>&1 | tail -1
```
[build] Complete!

**Shiki CSS variables present:**
```bash
grep -c "shiki-light" dist/_astro/cv.BKMK1gCI.css
```
8 (matches for --shiki-light in compiled CSS)

**Test code fence renders:**
```bash
grep -c "astro-code" dist/posts/2012/08/blog-post-1/index.html
```
1 (code block element present)

## Self-Check: PASSED

All claimed files modified, all commits verified, build succeeds, verification criteria met, CSS variables present in output, test code fence renders with syntax highlighting.

## Next Steps

Phase 15 Plan 02 (if exists) or Phase 16: Interactive features including copy-to-clipboard buttons for code blocks (requirement CODE-02), building on the code highlighting infrastructure established in this plan.

## Related Documentation

- Plan: .planning/phases/15-code-highlighting-infrastructure/15-01-PLAN.md
- Research: .planning/phases/15-code-highlighting-infrastructure/15-RESEARCH.md
- Context: .planning/phases/14-theme-system-foundation/14-01-SUMMARY.md (theme system dependency)
- Roadmap: .planning/ROADMAP.md (v3.0 milestone)
- Astro Docs: https://docs.astro.build/en/guides/syntax-highlighting/
- Shiki Docs: https://shiki.style/guide/dual-themes
