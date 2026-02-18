---
phase: quick-2
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/styles/themes.css
autonomous: true
requirements: [QUICK-2]

must_haves:
  truths:
    - "Lego theme nav items do not overlap on mobile screens (320px-768px)"
    - "Lego brick aesthetic (studs, borders, box-shadows) is preserved on mobile"
    - "Nav remains usable and tappable on small screens (44px minimum touch target)"
  artifacts:
    - path: "src/styles/themes.css"
      provides: "Lego mobile nav responsive rules"
      contains: "data-theme=\"lego\"] nav"
  key_links:
    - from: "src/styles/themes.css"
      to: "src/components/Navigation.astro"
      via: "CSS class selectors (.nav-list, nav a)"
      pattern: "data-theme.*lego.*nav"
---

<objective>
Fix Lego theme mobile nav items overlapping on small screens.

Purpose: The Lego theme's nav links are styled as 3D bricks with padding, borders, box-shadows, and stud pseudo-elements (::before). On mobile (<=768px), Navigation.astro's base CSS stacks them vertically with only 0.5rem gap, causing the decorated brick elements to overlap. The Minecraft theme solved this same problem by keeping items horizontal with wrapping.

Output: Updated themes.css with Lego-specific mobile responsive rules that prevent overlap while preserving the brick aesthetic.
</objective>

<execution_context>
@.planning/quick/2-fix-lego-theme-mobile-nav-items-overlapp/2-PLAN.md
</execution_context>

<context>
@src/styles/themes.css (lines 134-226 — Lego nav styles, lines 798-811 — Lego mobile section)
@src/styles/themes/minecraft.css (lines 216-238 — Minecraft mobile nav fix for reference)
@src/components/Navigation.astro (lines 56-62 — base mobile vertical stacking)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Lego mobile nav responsive overrides to themes.css</name>
  <files>src/styles/themes.css</files>
  <action>
Add mobile responsive rules for Lego nav inside the existing "LEGO mobile performance optimizations" section (around line 799). The fix should:

1. At `@media (max-width: 768px)` — override the base vertical stacking to horizontal wrap layout (same approach as Minecraft theme):
   - `:root[data-theme="lego"] nav:not(.author-links) .nav-list` — set `flex-direction: row; flex-wrap: wrap; gap: 6px;`
   - This keeps nav items side-by-side, wrapping to next row when needed

2. At `@media (max-width: 480px)` — compact the brick links for very small screens:
   - `:root[data-theme="lego"] nav:not(.author-links) a` — reduce padding to `10px var(--space-xs) var(--space-xs)` (keep 10px top for stud clearance), reduce font-size to `0.85em`
   - `:root[data-theme="lego"] nav:not(.author-links) a::before` — reduce stud height to `8px` and top offset to `-3px` so studs stay proportional

Place the new rules INSIDE the existing `@media (max-width: 768px)` block at line 799 (which already has Lego github-card mobile rules), and add a new `@media (max-width: 480px)` block right after it.

Do NOT remove or modify any existing Lego styles. Only ADD new rules within media queries.
  </action>
  <verify>
Run `npm run build` to confirm no CSS errors. Then visually verify with dev server (`npm run dev`) at the Lego theme — resize browser to 768px and 375px widths and confirm:
- Nav items display side-by-side (horizontal) with wrapping, not stacked vertically
- No overlapping between nav brick elements
- Studs (::before pseudo-elements) render properly without clipping into adjacent items
- Touch targets remain large enough for mobile use
  </verify>
  <done>Lego nav items display in a horizontal wrapping layout on mobile (<=768px), with compacted sizing at <=480px, and no overlap at any width down to 320px. Brick aesthetic (studs, borders, shadows) preserved.</done>
</task>

</tasks>

<verification>
1. `npm run build` succeeds without errors
2. Dev server at 768px width: Lego nav items are horizontal, wrapped, no overlap
3. Dev server at 375px width: Lego nav items are compact, still no overlap
4. Dev server at 320px width: All 6 nav items visible and tappable, no horizontal scrollbar
5. Desktop (>768px): Lego nav unchanged from current appearance
</verification>

<success_criteria>
- Lego theme nav items never overlap on any screen width from 320px to 768px
- Brick aesthetic (studs, 3D borders, box-shadows) preserved at all sizes
- No regressions to desktop Lego nav or other themes
</success_criteria>

<output>
After completion, create `.planning/quick/2-fix-lego-theme-mobile-nav-items-overlapp/2-SUMMARY.md`
</output>
