---
phase: 24-decorative-assets-animations
plan: 02
subsystem: ui
tags: [css, pseudo-elements, svg, pixel-art, minecraft, decorative, xp-bar, health-hearts]

# Dependency graph
requires:
  - phase: 24-01-pixel-art-svg-assets
    provides: 7 pixel-art SVGs (zombie/enderman/chicken silhouettes, sword/pickaxe tools, heart-full/heart-empty icons)
  - phase: 23-component-transforms
    provides: footer::before and footer::after pseudo-elements free for use, INT-03 prefers-reduced-motion guard established
provides:
  - All Phase 24 decorative CSS rules wired into minecraft.css
  - DECOR-01: footer::before creeper face (48px, opacity 0.6)
  - DECOR-02: .post-list/.talk-list/.publication-list ::before mob silhouettes
  - DECOR-03: hr as repeating sword divider + main h2::before pickaxe icon
  - DECOR-04: main h2::after XP bar (4px, #7fcc19, glow shadow)
  - DECOR-05: footer::after 5-heart health row (90px repeat-x)
  - --mc-xp-green custom property in theme variables
  - Corrected REQUIREMENTS.md (INT-03 Phase 23, all DECOR complete)
affects: [25-validation-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS pseudo-element decoration (::before/::after) with SVG background-image
    - repeat-x tiling pattern for horizontal icon rows (sword HR, heart-full footer)
    - Scoped main h2 selectors to avoid sidebar h2 side effects
    - Static decorative elements with opacity only — no transitions outside reduced-motion guard

key-files:
  created: []
  modified:
    - src/styles/themes/minecraft.css
    - .planning/REQUIREMENTS.md

key-decisions:
  - "footer::before used for DECOR-01 (creeper face), footer::after used for DECOR-05 (hearts) — both were free per Phase 23 audit"
  - "main h2 selector (not global h2) scopes pickaxe/XP bar to content area only, preserving sidebar author name h2"
  - "Heart row uses repeat-x with fixed 90px width (5 x 18px spacing) for exactly 5 hearts without JS"
  - "All decorative elements static — zero new transitions/animations added; INT-03 compliance maintained"
  - "INT-03 traceability fixed: was incorrectly mapped to Phase 24, corrected to Phase 23 (implemented in 23-02)"

patterns-established:
  - "Pseudo-element SVG decoration: content empty-string + display:block + background SVG + image-rendering:pixelated + opacity"
  - "Repeat-x icon row: fixed width = N * icon-size, background-size = icon-size, repeat-x fills exactly N icons"
  - "XP bar pattern: h2 padding-bottom:4px + h2::after display:block height:4px background:--mc-xp-green + box-shadow glow"

requirements-completed: [DECOR-01, DECOR-02, DECOR-03, DECOR-04, DECOR-05, INT-03]

# Metrics
duration: 2min
completed: 2026-02-18
---

# Phase 24 Plan 02: CSS Decorative Wiring Summary

**Six CSS decorative sections wired via pseudo-elements: creeper footer accent, three mob silhouette list headers, sword HR dividers, pickaxe h2 icons, XP bar under headings, and 5-heart health row in footer**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-18T09:17:51Z
- **Completed:** 2026-02-18T09:19:23Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Wired all 7 Phase 24-01 SVG assets into minecraft.css via pseudo-elements (footer::before, list::before, hr, h2::before, h2::after, footer::after)
- Added `--mc-xp-green: #7fcc19` custom property and XP bar underneath main h2 headings with green glow
- INT-03 audit passed: all transition declarations inside prefers-reduced-motion guard; zero new animations added
- Fixed REQUIREMENTS.md: INT-03 traceability corrected from Phase 24 to Phase 23; all DECOR-01 through DECOR-05 marked Complete

## Task Commits

Each task was committed atomically:

1. **Task 1: Add decorative CSS rules to minecraft.css** - `3458a9a` (feat)
2. **Task 2: Fix REQUIREMENTS.md traceability and verify INT-03 audit** - `a4d1c26` (fix)

**Plan metadata:** (see final commit below)

## Files Created/Modified
- `src/styles/themes/minecraft.css` - Added --mc-xp-green variable + six DECOR sections (99 lines added)
- `.planning/REQUIREMENTS.md` - INT-03 corrected to Phase 23; DECOR-01 through DECOR-05 set to Complete

## Decisions Made
- `footer::before` for DECOR-01 creeper face (48x48, centered, opacity 0.6) — Phase 23 confirmed this pseudo-element was free
- `footer::after` for DECOR-05 hearts (90px width, repeat-x, 16px size = 5.6 hearts tiles; overflow clips to clean row)
- Scoped all pickaxe/XP bar rules to `main h2` not global `h2` — avoids affecting sidebar author name heading
- Mob silhouette rationale: chicken=posts (casual), zombie=talks (live encounters), enderman=publications (academic/mysterious)
- All decorative elements static (opacity only) — no transitions/keyframes; INT-03 compliance preserved by design

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. INT-03 audit passed cleanly: transition declarations at lines 385 and 390 of minecraft.css are inside the `@media (prefers-reduced-motion: no-preference)` block (line 379). Zero transition declarations outside the guard.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All DECOR-01 through DECOR-05 requirements complete
- Phase 25 validation/QA can now verify all decorative elements render correctly
- No blockers; minecraft.css is the sole modified file and all rules are properly scoped

---
*Phase: 24-decorative-assets-animations*
*Completed: 2026-02-18*
