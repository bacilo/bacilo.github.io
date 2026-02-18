---
phase: 24-decorative-assets-animations
plan: 01
subsystem: ui
tags: [svg, pixel-art, minecraft, assets, decorative]

# Dependency graph
requires:
  - phase: 23-component-transforms
    provides: creeper-face.svg pattern (viewBox 0 0 16 16, shape-rendering crispEdges, rect-only pixel art)
provides:
  - 7 new pixel-art SVG files in public/images/minecraft/ui/
  - Zombie, Enderman, Chicken mob silhouettes (#c8c8c8 on transparent)
  - Sword and Pickaxe tool icons (stone gray blade, brown handle)
  - Heart-full (red with highlights) and Heart-empty (flat gray) health icons
affects: [24-02-wiring]

# Tech tracking
tech-stack:
  added: []
  patterns: [16x16 pixel-art SVG with rect-only elements, shape-rendering crispEdges, transparent background, light fill for dark backgrounds]

key-files:
  created:
    - public/images/minecraft/ui/zombie-silhouette.svg
    - public/images/minecraft/ui/enderman-silhouette.svg
    - public/images/minecraft/ui/chicken-silhouette.svg
    - public/images/minecraft/ui/sword.svg
    - public/images/minecraft/ui/pickaxe.svg
    - public/images/minecraft/ui/heart-full.svg
    - public/images/minecraft/ui/heart-empty.svg
  modified: []

key-decisions:
  - "Mob silhouettes use fill=#c8c8c8 (--mc-text-muted) not dark fill — placed on dark backgrounds (#1a1a1a) so light gray provides 10.4:1 contrast"
  - "Sword oriented horizontally (blade pointing right) so it tiles cleanly with repeat-x for HR replacement in Plan 24-02"
  - "Pickaxe uses diagonal handle (2x2 rect stepping) to suggest tool angle in 16x16 pixel grid"
  - "Heart-full uses three-tone coloring: dark border (#550000), red fill (#ff0000), pink highlights (#ff6666) for depth"
  - "Heart-empty uses flat gray (#555555) with no highlights to clearly communicate empty/depleted state"

patterns-established:
  - "Pixel art SVG pattern: viewBox='0 0 16 16', width='16', height='16', shape-rendering='crispEdges', rect elements only, no background rect (transparent)"
  - "Mob silhouettes: #c8c8c8 fill (--mc-text-muted) for visibility on dark (#1a1a1a) backgrounds"
  - "Tool icons: #c6c6c6 for stone materials, #866043 for wooden/brown handles, #55a715 for green accents"

requirements-completed: [DECOR-02, DECOR-03, DECOR-05]

# Metrics
duration: 1min
completed: 2026-02-18
---

# Phase 24 Plan 01: Decorative Asset SVGs Summary

**Seven 16x16 pixel-art SVGs created: zombie/enderman/chicken mob silhouettes (#c8c8c8), sword/pickaxe tool icons (stone gray + brown), and full/empty health hearts (red/gray)**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-18T09:14:34Z
- **Completed:** 2026-02-18T09:15:36Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Three mob silhouette SVGs (zombie, enderman, chicken) with light gray fill for dark background visibility
- Two tool icon SVGs (sword horizontal for HR tiling, pickaxe with diagonal handle) using authentic Minecraft material colors
- Two health heart SVGs (full red with highlights, empty flat gray) matching Minecraft HUD aesthetic
- All 7 files follow established creeper-face.svg pattern: 16x16 viewBox, crispEdges, rect-only elements, transparent background

## Task Commits

Each task was committed atomically:

1. **Task 1: Create mob silhouette SVGs (zombie, enderman, chicken)** - `35ec266` (feat)
2. **Task 2: Create tool icon and health heart SVGs** - `bbac4eb` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified
- `public/images/minecraft/ui/zombie-silhouette.svg` - Classic zombie walking pose, arms extended, #c8c8c8 fill
- `public/images/minecraft/ui/enderman-silhouette.svg` - Tall thin silhouette with 2x2 head and 1px-wide limbs
- `public/images/minecraft/ui/chicken-silhouette.svg` - Round body with small beak and feet
- `public/images/minecraft/ui/sword.svg` - Horizontal blade (#c6c6c6), brown guard+handle (#866043), green pommel (#55a715)
- `public/images/minecraft/ui/pickaxe.svg` - Stone gray pick head (#c6c6c6), diagonal brown handle (#866043)
- `public/images/minecraft/ui/heart-full.svg` - Red heart (#ff0000) with pink highlights (#ff6666) and dark border (#550000)
- `public/images/minecraft/ui/heart-empty.svg` - Same heart shape in flat gray (#555555)

## Decisions Made
- Mob silhouettes use #c8c8c8 (light gray) not dark fill — placed on dark backgrounds, dark fill would be invisible
- Sword oriented horizontally so it tiles cleanly with CSS background repeat-x for HR divider replacement
- Heart-full uses three-tone approach (dark border, red body, pink highlights) matching Minecraft HUD style
- Heart-empty uses flat gray with no highlights to clearly communicate depleted state

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 7 SVG assets ready for Plan 24-02 to wire into page via CSS pseudo-elements
- No blockers

---
*Phase: 24-decorative-assets-animations*
*Completed: 2026-02-18*
