---
phase: 23-component-transforms
plan: 03
subsystem: ui
tags: [css, minecraft, code-blocks, footer, sidebar, theme-switcher, svg, pseudo-element, shiki, pixelated]

# Dependency graph
requires:
  - phase: 23-02
    provides: Stone button bevel pattern, inventory slot card styling, reduced-motion guard, minecraft.css file structure, scoping convention
  - phase: 23-01
    provides: Hotbar navigation, [data-theme="minecraft"] scoping convention, minecraft.css file
  - phase: 22-visual-foundation
    provides: Bedrock/wood texture background-image declarations for footer/sidebar (must not re-declare), color palette (--mc-sky-blue, --mc-text-light, --mc-bg-stone, --mc-text-muted)
provides:
  - Command block code styling for .astro-code: orange left accent (#ff6a00), pixel mono font, structural only (Shiki colors preserved) (COMP-01)
  - Footer text color (--mc-text-light), border-top stone separator, sky-blue link color on bedrock texture (COMP-02)
  - Author sidebar inventory panel with bevel border, square-cropped photo, and Creeper face SVG ::after decoration (COMP-03)
  - Theme switcher stone-gray dropdown with pixel font (Pixelify Sans) and sharp corners (COMP-04)
  - public/images/minecraft/ui/creeper-face.svg: 16x16 pixel-grid Creeper face SVG
affects:
  - 23-04 (if any remaining elements — this plan completes the Phase 23 component transforms)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Command block accent: border-left: 4px solid #ff6a00 on .astro-code (structural only, no color/background-color)"
    - "SVG decoration via ::after: background url() center/contain no-repeat, image-rendering: pixelated, opacity 0.85"
    - "Do NOT re-declare background-image for elements with textures from Phase 22 (footer, .author-sidebar)"
    - "Sidebar bevel: inset 2px 2px 0 rgba(255,255,255,0.1), inset -2px -2px 0 rgba(0,0,0,0.3) on wood texture"

key-files:
  created:
    - public/images/minecraft/ui/creeper-face.svg
  modified:
    - src/styles/themes/minecraft.css

key-decisions:
  - "[23-03] .astro-code gets structural-only CSS (border, font, shadow) — no color/background-color — Shiki handles syntax highlighting colors via themes.css !important"
  - "[23-03] Footer CSS scoped to [data-theme='minecraft'] footer without background-image redeclaration — bedrock texture already set in Phase 22"
  - "[23-03] Creeper face SVG uses shape-rendering='crispEdges' attribute plus CSS image-rendering: pixelated for pixel-perfect rendering at any scale"
  - "[23-03] .author-sidebar::after used for Creeper face decoration (no HTML changes needed — pure CSS, zero layout impact)"

patterns-established:
  - "SVG pixel-art decoration via ::after: content:'', width/height set, background url() center/contain, image-rendering:pixelated"
  - "Shiki preservation: never set color or background-color on .astro-code in theme CSS — structural borders/font only"

requirements-completed: [COMP-01, COMP-02, COMP-03, COMP-04]

# Metrics
duration: 2min
completed: 2026-02-18
---

# Phase 23 Plan 03: Remaining Interactive Elements Summary

**Command block code styling, Creeper face SVG, footer text/links, sidebar inventory panel bevel, and stone-gray theme switcher completing the full Minecraft UI conversion in minecraft.css**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-18T07:58:09Z
- **Completed:** 2026-02-18T07:59:27Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Code blocks (.astro-code) display as command block output with orange left accent (#ff6a00), dark outer border, Press Start 2P pixel mono font, and subtle orange inner glow — Shiki syntax highlighting colors preserved (structural CSS only) (COMP-01)
- Footer gets dark stone border-top (4px solid #373737), light text color (--mc-text-light), and sky-blue link color (--mc-sky-blue) on the existing bedrock texture from Phase 22 (COMP-02)
- Author sidebar styled as inventory panel with bevel border/box-shadow, square-cropped photo (border-radius:0), and Creeper face SVG displayed via ::after pseudo-element (64px, pixelated rendering, 0.85 opacity) (COMP-03)
- Theme switcher label uses Pixelify Sans and muted color; .theme-select dropdown is stone-gray with bevel box-shadow, no border-radius, sky-blue hover/focus border (COMP-04)
- Created public/images/minecraft/ui/creeper-face.svg: 16x16 pixel-grid SVG with green background, dark eyes and mouth in classic Creeper grim expression, shape-rendering="crispEdges"

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Creeper face SVG and add code block, footer, sidebar, theme switcher CSS to minecraft.css** - `5214c08` (feat)

## Files Created/Modified
- `public/images/minecraft/ui/creeper-face.svg` - 16x16 pixel-grid Creeper face SVG for sidebar decoration
- `src/styles/themes/minecraft.css` - Added 133 lines: Command Block Code, Footer Enhancement, Author Sidebar Inventory Panel, Theme Switcher sections

## Decisions Made
- `.astro-code` receives structural-only CSS (border, border-left, border-radius, padding, margin, font-family, font-size, box-shadow, overflow-x) — no `color` or `background-color` — because Shiki applies syntax highlighting colors via `themes.css` with `!important` that would be clobbered
- No `background-image` redeclaration on `footer` or `.author-sidebar` — bedrock and wood textures already set in Phase 22 `[data-theme="minecraft"] footer` and `.author-sidebar` rules
- Creeper face SVG uses `shape-rendering="crispEdges"` SVG attribute to prevent browser anti-aliasing at the source, plus CSS `image-rendering: pixelated` for scaled rendering — same dual-protection pattern as Phase 22 textures
- `.author-sidebar::after` chosen for Creeper decoration to avoid any HTML component changes (pure CSS, zero layout impact)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 23 (Component Transforms) is now complete — all three plans executed: hotbar navigation (23-01), inventory slot cards and stone buttons (23-02), and remaining interactive elements (23-03)
- The full Minecraft UI conversion covers: color palette, textures, typography, navigation, cards, tooltips, buttons, code blocks, footer, sidebar, and theme switcher
- Ready for Phase 24 (validation / accessibility audit) or Phase 25 (content/polish)

## Self-Check: PASSED

- public/images/minecraft/ui/creeper-face.svg: FOUND
- src/styles/themes/minecraft.css: FOUND (updated)
- 23-03-SUMMARY.md: FOUND
- commit 5214c08: FOUND

---
*Phase: 23-component-transforms*
*Completed: 2026-02-18*
