---
phase: 23-component-transforms
plan: 02
subsystem: ui
tags: [css, minecraft, cards, tooltips, buttons, box-shadow, pseudo-element, accessibility, reduced-motion]

# Dependency graph
requires:
  - phase: 23-01
    provides: Hotbar navigation bevel pattern (inset box-shadow light/dark), [data-theme="minecraft"] scoping convention, minecraft.css file structure
  - phase: 22-visual-foundation
    provides: minecraft.css color palette (--mc-bg-dark, --mc-bg-stone, --mc-bg-grass, --mc-text-light, --mc-creeper-green, --mc-stone-gray), CSS custom properties
provides:
  - Inventory slot card styling for .github-card and .portfolio-card (dark background, sunken bevel, zero border-radius)
  - Minecraft-style tooltip popup on card hover via ::after pseudo-element (dark #100010 bg, purple border, Pixelify Sans, opacity 0->1)
  - Purple enchantment glow on card hover (#624eff border, rgba box-shadow)
  - overflow:visible on .portfolio-grid and .portfolio-item to prevent tooltip clipping
  - List item inventory rows (.publication-item, .post-item, .talk-item) with purple hover highlight
  - Stone button styling for .repo-link, .link-button, .download-link, .paper-link a (raised 3D bevel)
  - Pressed state bevel inversion on :active for all stone buttons
  - Tag pill stone button styling (.tag) with green hover highlight
  - All hover/state transitions wrapped in prefers-reduced-motion: no-preference guard
affects:
  - 23-03 (interactive elements — same scoping pattern, same minecraft.css file)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inventory slot bevel: inset 2px 2px 0 #555555 (light top-left), inset -2px -2px 0 #000000 (dark bottom-right)"
    - "Tooltip via ::after pseudo-element: opacity:0 hidden state, opacity:1 on :hover, position:absolute bottom:calc(100%+4px)"
    - "Stone button raised bevel: inset 2px 2px 0 #c6c6c6 (light) / inset -2px -2px 0 #373737 (dark)"
    - "Pressed button: bevel inverted to inset 2px 2px 0 #373737 / inset -2px -2px 0 #c6c6c6"
    - "Reduced-motion guard: all transitions inside @media (prefers-reduced-motion: no-preference)"
    - "overflow:visible on grid containers prevents absolute-positioned ::after tooltip from being clipped"

key-files:
  created: []
  modified:
    - src/styles/themes/minecraft.css

key-decisions:
  - "[23-02] Tooltip uses static content:'View Details' — no attr(data-tooltip) because CSS attr() returns empty string for absent attributes"
  - "[23-02] overflow:visible on .portfolio-grid and .portfolio-item required to prevent tooltip ::after from being clipped by parent"
  - "[23-02] Transitions placed exclusively inside prefers-reduced-motion:no-preference — no transitions outside the guard (accessible by default)"
  - "[23-02] !important on color and border-radius for buttons overrides Astro scoped component styles"
  - "[23-02] Card hover transitions (border-color, box-shadow) also inside motion guard for CARD-01/CARD-02 states"

patterns-established:
  - "Tooltip pattern: ::after hidden (opacity:0, content:'') by default, overridden on :hover to content:'View Details' opacity:1 position:absolute"
  - "Reduced-motion: all transitions ONLY inside @media (prefers-reduced-motion: no-preference) — instant transitions everywhere else"

requirements-completed: [CARD-01, CARD-02, CARD-03, INT-01, INT-02, INT-03]

# Metrics
duration: 2min
completed: 2026-02-18
---

# Phase 23 Plan 02: Cards and Buttons Summary

**Inventory slot cards with ::after tooltip popup and purple glow, plus stone buttons with raised/pressed 3D bevel — all transitions wrapped in prefers-reduced-motion guard**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-18T07:53:59Z
- **Completed:** 2026-02-18T07:55:31Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Portfolio/GitHub cards (.github-card, .portfolio-card) rendered as dark inventory slots with sunken bevel box-shadow (CARD-01)
- Card hover reveals Minecraft-style tooltip popup above the card via ::after pseudo-element (dark #100010 background, purple #2d0a2d border, Pixelify Sans font, opacity 0->1, positioned via bottom: calc(100% + 4px)) plus purple enchantment glow (border-color #624eff) (CARD-02)
- overflow:visible on .portfolio-grid and .portfolio-item prevents absolute tooltip from being clipped; responsive 1/2/3 column grid layout preserved — no display/grid overrides on cards (CARD-03)
- List items (.publication-item, .post-item, .talk-item) styled as inventory rows with purple tinted hover highlight
- All interactive buttons (.repo-link, .link-button, .download-link, .paper-link a) styled as stone buttons with raised 3D bevel (inset 2px 2px 0 #c6c6c6 light / inset -2px -2px 0 #373737 dark) (INT-01)
- :active state inverts bevel shadow to simulate press-in effect (INT-02)
- All hover/active transitions exclusively inside @media (prefers-reduced-motion: no-preference) — instant state changes by default (INT-03)
- Tag pills (.tag) styled as smaller stone buttons with green hover highlight

## Task Commits

Each task was committed atomically:

1. **Task 1: Add inventory slot card styling and hover tooltip effect to minecraft.css** - `415d8be` (feat)
2. **Task 2: Add stone button styling with raised/pressed bevel and reduced-motion guard to minecraft.css** - `b631438` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `src/styles/themes/minecraft.css` - Added 154 lines: Inventory Slot Cards section (85 lines) and Stone Buttons section (69 lines)

## Decisions Made
- Tooltip uses static `content: "View Details"` instead of `attr(data-tooltip)` because CSS `attr()` returns an empty string for absent attributes (no card component sets `data-tooltip`), which would make the tooltip blank
- `overflow: visible` on `.portfolio-grid` and `.portfolio-item` is essential to prevent the absolutely-positioned `::after` tooltip from being clipped by parent grid container
- `!important` on `color` and `border-radius` for button selectors is needed to override Astro scoped component styles (`.repo-link`, `.link-button` etc. have component-level `border-radius: 4px`)
- Transitions for card hover (border-color, box-shadow) placed inside the same reduced-motion guard as button transitions for full INT-03 compliance

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Card and button CSS patterns are complete and stable; Phase 23 Plan 03 can build on the same scoping conventions
- Stone button bevel pattern (inset 2px 2px 0 #c6c6c6) is now established for any additional interactive elements in Plan 03
- The `overflow: visible` pattern on grid containers is documented for any future absolute-positioned tooltips

## Self-Check: PASSED

- src/styles/themes/minecraft.css: FOUND
- 23-02-SUMMARY.md: FOUND
- commit 415d8be: FOUND
- commit b631438: FOUND

---
*Phase: 23-component-transforms*
*Completed: 2026-02-18*
