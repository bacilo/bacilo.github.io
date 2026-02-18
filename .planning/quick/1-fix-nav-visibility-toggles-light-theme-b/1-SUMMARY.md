---
phase: quick
plan: 1
subsystem: ui
tags: [navigation, theming, cms, netlify-cms, site.json]

requires:
  - phase: quick-0
    provides: plan file and context

provides:
  - Nav items toggleable per-item via site.json visible flag and CMS boolean widget
  - Light theme explicitly sets data-theme='light', immune to OS dark preference
  - CMS Stats Display shows exactly 4 options, no duplicate empty (None) entry

affects: [navigation, theming, cms-config]

tech-stack:
  added: []
  patterns:
    - "Data-driven nav: Navigation.astro reads from site.json, filters on visible !== false"
    - "Explicit theme attributes: light theme uses setAttribute not removeAttribute so OS dark media query cannot bleed through"

key-files:
  created: []
  modified:
    - src/data/site.json
    - src/components/Navigation.astro
    - public/admin/config.yml
    - src/styles/global.css
    - src/styles/themes.css
    - src/components/ThemeSwitcher.astro
    - src/layouts/BaseLayout.astro

key-decisions:
  - "Remove @media (prefers-color-scheme: dark) :root block from global.css — auto theme in themes.css already handles it; bare :root should always be light"
  - "Light theme uses setAttribute('data-theme','light') not removeAttribute — explicit attribute wins over OS preference via CSS specificity"
  - "Nav array placed in site.site (not top-level) to keep it alongside title/description in CMS site object widget"

patterns-established:
  - "Explicit data-theme attribute for every named theme, including light — removeAttribute only used when auto+light OS"
  - "Nav data lives in site.json nav array; Navigation.astro filters on item.visible !== false"

requirements-completed: []

duration: 7min
completed: 2026-02-18
---

# Quick Task 1: Nav Visibility Toggles + Light Theme Fix Summary

**Nav items toggleable per-item from site.json/CMS; light theme immune to OS dark preference via explicit [data-theme="light"] CSS rule and setAttribute; CMS Stats Display deduplicated with required:true.**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-02-18T11:17:00Z
- **Completed:** 2026-02-18T11:18:10Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Navigation.astro now reads nav items from `site.json` and filters on `visible !== false`, letting the user toggle items from the CMS without touching code
- Light theme explicitly sets `data-theme="light"` on `<html>` (both on selection and on reload via anti-flash script), so the OS dark mode `@media` query never bleeds into the selected light palette
- CMS Stats Display field changed to `required: true`, eliminating the browser-generated empty "(None)" option from appearing alongside the explicit "none" choice

## Task Commits

1. **Task 1: Nav visibility toggles — site.json + Navigation.astro + CMS config** - `19c9df2` (feat)
2. **Task 2: Fix light theme on dark OS — add [data-theme="light"] CSS + update JS** - `f5785f5` (fix)
3. **Task 3: Fix CMS Stats Display duplicate None option** - `8fc4b97` (fix)

## Files Created/Modified

- `src/data/site.json` - Added `site.nav` array with href/label/visible per item
- `src/components/Navigation.astro` - Import from site.json, filter on visible !== false
- `public/admin/config.yml` - Added Navigation Items list widget; statsDisplay required:true
- `src/styles/global.css` - Removed `@media (prefers-color-scheme: dark) :root` block
- `src/styles/themes.css` - Added `[data-theme="light"]` rule; added light selector to Shiki code blocks
- `src/components/ThemeSwitcher.astro` - `applyTheme('light')` now calls `setAttribute` not `removeAttribute`
- `src/layouts/BaseLayout.astro` - Anti-flash script sets `data-theme="light"` explicitly on reload

## Decisions Made

- **Remove dark media query from global.css:** The `@media (prefers-color-scheme: dark) { :root { ... } }` block was the root cause of light theme breaking on dark OS. The auto theme in themes.css already covers dark-OS preference via `[data-theme="auto"]`. Removing from global.css means bare `:root` is always light, and explicit `[data-theme="light"]` reinforces it.
- **setAttribute not removeAttribute for light theme:** Using `removeAttribute` left `<html>` with no `data-theme`, exposing bare `:root` to OS dark media query. `setAttribute('data-theme', 'light')` gives a specific selector that beats the (now-removed) OS media query.
- **Nav in site.site not top-level:** CMS site widget groups title/description/nav together logically; all can be edited from one form.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three bugs fixed and verified by build passing
- User can now toggle nav items from CMS Settings > Site > Navigation Items
- Light theme selection reliable regardless of OS preference
- CMS Stats Display clean 4-option select

## Self-Check: PASSED

- src/data/site.json: FOUND
- src/components/Navigation.astro: FOUND
- src/styles/themes.css: FOUND
- .planning/quick/1-fix-nav-visibility-toggles-light-theme-b/1-SUMMARY.md: FOUND
- commit 19c9df2 (Task 1): FOUND
- commit f5785f5 (Task 2): FOUND
- commit 8fc4b97 (Task 3): FOUND

---
*Phase: quick*
*Completed: 2026-02-18*
