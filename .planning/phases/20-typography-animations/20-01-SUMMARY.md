---
phase: 20-typography-animations
plan: 01
subsystem: ui
tags: [fontsource, fredoka, slackey, baloo-2, css-animations, spring-physics, accessibility, prefers-reduced-motion]

# Dependency graph
requires:
  - phase: 19-brick-elements
    provides: LEGO theme with brick depth effects, navigation button pressed states, and baseplate grid
provides:
  - Three-tier typography hierarchy for LEGO theme (Fredoka H1, Slackey H2-H3, Baloo 2 body)
  - Spring/bounce hover animations for cards (scale 1.03) and nav buttons (lift -2px)
  - Reduced motion accessibility support (prefers-reduced-motion: reduce)
  - Self-hosted Google Fonts via Fontsource npm packages (eliminates CDN latency)
affects: [21-deployment, future LEGO theme enhancements]

# Tech tracking
tech-stack:
  added: [@fontsource/fredoka, @fontsource/slackey, @fontsource/baloo-2]
  patterns: [Fontsource self-hosted font integration in Astro, cubic-bezier bounce easing, prefers-reduced-motion accessibility pattern]

key-files:
  created: []
  modified: [package.json, src/layouts/BaseLayout.astro, src/styles/themes.css]

key-decisions:
  - "Used static fonts (Fredoka 700, Baloo 2 400+600) instead of variable fonts to minimize file size (170KB vs 240KB)"
  - "Applied cubic-bezier(0.34, 1.56, 0.64, 1) bounce easing instead of CSS linear() function for broader browser support (99% vs 75%)"
  - "Set card scale to 1.03 (not 1.05) to minimize layout shift while maintaining perceptible bounce effect"
  - "Merged typography font-family rules into existing [data-theme='lego'] body rule to avoid CSS rule duplication"
  - "Skipped font preloading to avoid complexity with Astro build path resolution (Fontsource font-display: swap provides FOUT prevention)"

patterns-established:
  - "Typography scoped to [data-theme='lego'] with var(--font-system) fallback ensures graceful degradation"
  - "Hover animations use 250-300ms duration with bounce easing per Material Design mobile UI guidelines"
  - "Reduced motion support uses transition: none !important to override existing transitions while preserving static hover states"

requirements-completed: [TYPE-01, TYPE-02, TYPE-03, ANIM-01, ANIM-02]

# Metrics
duration: 2.6min
completed: 2026-02-17
---

# Phase 20 Plan 01: Typography & Animations Summary

**LEGO theme with three-tier playful typography (Fredoka H1, Slackey H2-H3, Baloo 2 body) and spring-physics bounce hover animations (cards scale 1.03, nav buttons lift -2px) via self-hosted Fontsource fonts**

## Performance

- **Duration:** 2.6 min (154 seconds)
- **Started:** 2026-02-17T22:10:01Z
- **Completed:** 2026-02-17T22:12:35Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Installed Fontsource packages for Fredoka (700 bold), Slackey (regular), and Baloo 2 (400 regular + 600 semibold) - 170KB total font assets
- Implemented three-tier LEGO typography hierarchy: Fredoka for H1 titles, Slackey for H2-H3 headers, Baloo 2 for body text
- Added bounce hover animations using cubic-bezier(0.34, 1.56, 0.64, 1) spring easing: cards scale to 1.03, nav buttons lift -2px
- Verified reduced motion accessibility - existing prefers-reduced-motion block disables all new transitions with transition: none !important

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Fontsource packages and import fonts in BaseLayout** - `6b1fe07` (feat)
2. **Task 2: Add LEGO typography hierarchy, hover animations, and reduced-motion support** - `f4739cc` (feat)

## Files Created/Modified

- `package.json` - Added @fontsource/fredoka, @fontsource/slackey, @fontsource/baloo-2 dependencies
- `package-lock.json` - Fontsource package lockfile entries
- `src/layouts/BaseLayout.astro` - Imported font CSS files in frontmatter (Fredoka 700, Slackey, Baloo 2 400+600)
- `src/styles/themes.css` - Added LEGO typography rules (H1 Fredoka, H2-H3 Slackey, body Baloo 2) and updated card/nav transitions with bounce easing

## Decisions Made

**Static fonts over variable fonts:** Used static font files (Fredoka 700 only, Baloo 2 400+600 only) instead of variable fonts to reduce file size from 240KB to 170KB, since only specific weights are needed. Variable fonts would provide flexibility for future weight variations but add 70KB overhead currently unnecessary.

**cubic-bezier bounce over CSS linear():** Applied cubic-bezier(0.34, 1.56, 0.64, 1) easing for spring/bounce effect instead of CSS linear() function. Cubic-bezier provides 99% browser support vs. 75% for linear(), and delivers perceptually excellent bounce approximation. Linear() would enable true spring physics simulation but adds complexity (40+ comma-separated values) for marginal perceptual improvement.

**Card scale 1.03 not 1.05:** Reduced hover scale from typical 1.05 to 1.03 to minimize layout shift while maintaining perceptible bounce effect. Research showed 1.05 can cause adjacent content reflow on mobile; 1.03 provides sufficient visual feedback without disrupting layout.

**Merged body typography into existing rule:** Combined font-family properties for body text into existing [data-theme="lego"] body rule (which contains baseplate grid background) to avoid duplicate CSS selectors. Maintains cleaner CSS architecture.

**Skipped font preloading:** Did not add `<link rel="preload">` for fonts because (1) Fontsource includes font-display: swap by default for FOUT prevention, and (2) Astro build process may change font paths between dev and production, creating maintenance complexity. Swap strategy ensures text visibility without preload optimization overhead.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 20 complete. LEGO theme now has full immersive experience: baseplate grid (Phase 18), brick depth effects and studs (Phase 19), playful typography and bounce animations (Phase 20). Ready for Phase 21 (deployment) or additional v4.0 enhancements.

Typography system scoped to [data-theme="lego"] prevents style leakage to other 7 themes. Accessibility support via prefers-reduced-motion ensures compliance for users with motion sensitivity.

No blockers. Fonts self-hosted via Fontsource eliminate Google CDN dependency. Build succeeds with zero errors.

## Self-Check: PASSED

All files verified to exist:
- FOUND: package.json
- FOUND: src/layouts/BaseLayout.astro
- FOUND: src/styles/themes.css

All commits verified to exist:
- FOUND: 6b1fe07 (Task 1)
- FOUND: f4739cc (Task 2)

---
*Phase: 20-typography-animations*
*Completed: 2026-02-17*
