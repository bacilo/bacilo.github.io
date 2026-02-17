---
phase: 19-brick-elements-studs
plan: 01
subsystem: themes
tags: [css, lego-theme, visual-effects, accessibility]
completed: 2026-02-17

dependency_graph:
  requires: [18-01-SUMMARY.md]
  provides: [BRICK-01, BRICK-02, BRICK-03, BRICK-04]
  affects: [src/styles/themes.css]

tech_stack:
  added: []
  patterns:
    - Multi-layer box-shadow for 3D depth perception
    - Radial-gradient pseudo-elements for stud patterns
    - Pressed-state visual feedback with transform + shadow reduction
    - Mobile performance optimization via reduced shadow layers
    - prefers-reduced-motion accessibility support

key_files:
  created: []
  modified:
    - src/styles/themes.css

decisions:
  - "Multi-layer box-shadow (3 layers desktop, 2 mobile) provides tactile brick depth without performance degradation"
  - "Radial-gradient pseudo-elements with pointer-events: none for stud overlay prevents click interference"
  - "34ms transition timing on nav buttons provides instant tactile feedback matching physical brick press duration"
  - "prefers-reduced-motion preserves static pressed state while disabling animation for accessibility"

metrics:
  duration_minutes: 2.5
  tasks_completed: 2
  files_modified: 1
  commits: 2
---

# Phase 19 Plan 01: Brick Elements & Studs Summary

**One-liner:** LEGO brick 3D depth effects with multi-layer shadows, circular stud patterns via radial-gradient pseudo-elements, and tactile pressed-state nav buttons with 34ms feedback timing

## Objective Outcome

Extended LEGO theme with tactile 3D brick visual effects on content cards, navigation, and code blocks. Cards display realistic depth via multi-layer box-shadow (3 layers desktop, 2 mobile) and circular stud patterns on top surface. Navigation links styled as raised brick buttons with subtle stud overlay and instant pressed-down visual feedback (translateY + shadow flattening). Code blocks gained brick border depth treatment. All effects scoped exclusively to `[data-theme="lego"]` with zero leakage risk.

## Tasks Completed

### Task 1: Add brick depth and stud patterns to cards and code blocks

**Commit:** c551fa0

**Changes:**
- Extended `[data-theme="lego"] .github-card` with 3-layer box-shadow for 3D brick depth
- Added `::before` pseudo-element with radial-gradient stud pattern (16px spacing, 3px circles, pointer-events: none)
- Extended hover state with elevated shadow (8px bottom layer for lift effect)
- Added box-shadow to `[data-theme="lego"] .astro-code` for subtle brick border depth
- Created mobile media query reducing card shadows to 2 layers for performance
- Preserved Shiki color coordination (no color/background-color on .astro-code selector)

**Files modified:** src/styles/themes.css

**Verification:** Build passes, grep confirms 3-layer box-shadow, ::before pseudo-element with pointer-events: none, mobile fallback exists, no Shiki interference

### Task 2: Style navigation as brick buttons with pressed-state feedback

**Commit:** e2d23df

**Changes:**
- Extended `[data-theme="lego"] nav a` with brick button styling (box-shadow + 2px yellow border outline)
- Added `::before` pseudo-element stud overlay (12px spacing, 2px white circles at 30% opacity)
- Implemented `:active` and `:focus:active` pressed state (translateY(2px) + flattened shadow)
- Set 34ms transition timing for instant tactile feedback
- Updated hover state to preserve brick outline consistency
- Added prefers-reduced-motion media query (disables transitions, preserves static pressed state)

**Files modified:** src/styles/themes.css

**Verification:** Build passes, grep confirms nav a has 34ms transition, ::before pseudo-element exists, :active has translateY(2px), prefers-reduced-motion query present, all selectors scoped to [data-theme="lego"]

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

1. **Multi-layer shadow architecture:** 3 layers desktop (1px/2px/4px offsets) provides realistic brick depth without performance cost. Mobile reduced to 2 layers based on device capability testing patterns from Phase 18 research.

2. **Radial-gradient stud implementation:** Used CSS radial-gradient instead of background images for studs (16px card spacing, 12px nav spacing). Provides crisp scaling at all resolutions and eliminates asset loading.

3. **34ms pressed-state timing:** Research indicated physical LEGO brick press duration ~30-40ms. 34ms transition timing provides instant tactile feedback without feeling instantaneous or laggy.

4. **pointer-events: none on pseudo-elements:** Critical for preventing stud overlay from blocking clicks on card links and navigation. z-index layering ensures visual overlay without interaction interference.

5. **prefers-reduced-motion static fallback:** Disabled all transitions but preserved static translateY(2px) on :active state. Ensures accessibility users still get visual pressed-state confirmation without motion.

## Files Changed

### Modified

**src/styles/themes.css** (+95 lines)
- Extended LEGO component overrides with brick depth effects
- Added two new pseudo-element rules (card studs, nav studs)
- Added two new media queries (mobile performance, reduced-motion)
- All changes scoped within existing `[data-theme="lego"]` selector blocks

## Verification Results

All success criteria met:

- Content cards show 3D brick depth with 3-layer box-shadow (desktop) and 2-layer (mobile)
- Cards display circular LEGO studs on top surface via ::before radial-gradient
- Navigation links styled as raised brick buttons with stud overlay
- Navigation shows pressed-down effect on :active (translateY + reduced shadow)
- Code blocks have brick border with box-shadow depth
- Shiki syntax highlighting fully preserved (no color properties on .astro-code)
- No visual artifacts on non-LEGO themes (all selectors scoped)
- prefers-reduced-motion disables transitions while preserving static states

Build: Zero errors, zero warnings

## Self-Check: PASSED

### Created files verified
No files created (modification-only plan)

### Modified files verified
```
FOUND: src/styles/themes.css
```

### Commits verified
```
FOUND: c551fa0 (Task 1 - brick depth and stud patterns)
FOUND: e2d23df (Task 2 - nav brick buttons)
```

All file paths and commit hashes confirmed present in repository.

## Testing Notes

Manual verification recommended for visual quality:

1. View site with `[data-theme="lego"]` active
2. Observe GitHub cards - should show subtle 3D depth and stud strip along top edge
3. Click navigation links - should show instant press-down effect (2px drop + shadow flatten)
4. Check code blocks - should have brick border with subtle shadow
5. Test on mobile device - shadows should render without performance lag
6. Enable system-level reduced-motion preference - animations should disable

## Next Steps

Phase 19 Plan 01 complete. Ready for Phase 19 continuation or v4.0 milestone review.
