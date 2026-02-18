# Phase 24: Decorative Assets & Animations - Research

**Researched:** 2026-02-18
**Domain:** CSS-only SVG decorative assets — mob silhouettes, tool icons, XP bar, health hearts, Creeper face placement — plus `prefers-reduced-motion` animation guard audit
**Confidence:** HIGH

## Summary

Phase 24 populates the Minecraft theme with six categories of decorative pixel-art SVGs and verifies that every hover animation in the theme respects `prefers-reduced-motion`. The infrastructure from Phases 22–23 is fully complete: all CSS selectors, custom properties, and the texture pipeline are verified. Phase 24 adds only new SVG files to `public/images/minecraft/ui/` and new CSS rules to `src/styles/themes/minecraft.css`. Zero new npm packages are needed.

The core technical task is designing authentic Minecraft pixel-art SVGs in the established 16x16 viewBox pattern. Five SVG families are needed: mob silhouettes (zombie, enderman, chicken), tool icons (sword, pickaxe), XP bar (a reusable CSS bar element, no SVG needed), health hearts (filled and empty), and the Creeper face in the footer (already exists in sidebar — DECOR-01 requires it in both sidebar AND footer). The XP bar is the only requirement that can be satisfied with pure CSS rather than an SVG file, using a green `#7fcc19` bar element beneath headings via `::after`.

INT-03 is already implemented in Phase 23 (confirmed by Phase 23 VERIFICATION.md). Phase 24's INT-03 obligation is a verification audit: confirm no `transition` declarations exist outside the `@media (prefers-reduced-motion: no-preference)` guard in the full `minecraft.css` file, and confirm the Phase 24 decorative SVG hover animations (if any are added) are also guarded. The REQUIREMENTS.md traceability table lists INT-03 as "Phase 24 | Complete" — this is a documentation error noted in the Phase 23 verification; no new code is needed for INT-03 beyond the audit.

**Primary recommendation:** Split into 3 plan files: (1) SVG asset creation (mob silhouettes + tool icons), (2) CSS decoration wiring (placing all SVGs into the page via CSS pseudo-elements, plus XP bar and health hearts), (3) Animation guard audit + REQUIREMENTS.md traceability fix. All CSS goes into `src/styles/themes/minecraft.css`. Zero Astro component changes needed.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DECOR-01 | Creeper face SVG appears as recurring design element (sidebar AND footer) | Creeper face SVG already exists at `public/images/minecraft/ui/creeper-face.svg` and is wired to `.author-sidebar::after` in Phase 23. DECOR-01 requires it ALSO in the footer. Footer uses `footer::before` (free — Phase 23 did not claim it) to add a second Creeper face instance. The footer `::after` is also free. Either pseudo-element can carry the Creeper in the footer. |
| DECOR-02 | Mob silhouette SVGs (zombie, enderman, chicken) used as decorative accents | Three new SVGs needed: `zombie-silhouette.svg`, `enderman-silhouette.svg`, `chicken-silhouette.svg`. Silhouettes are monochrome (all dark / `#1a1a1a`) pixel shapes on transparent backgrounds. Placed as `::before`/`::after` decorations on `.talk-item`, `.post-item`, or page section containers. CSS `background-image` + `image-rendering: pixelated` follows established texture pipeline. |
| DECOR-03 | Tool icon SVGs (sword, pickaxe) used as section dividers or accents | Two new SVGs needed: `sword.svg`, `pickaxe.svg`. Used as CSS-generated `<hr>` replacements or section break decorations. Pattern: `[data-theme="minecraft"] hr { background-image: url(...sword.svg); }` or `::after` pseudo-elements on section headings. Equivalent to LEGO's `hr` brick-row pattern in `themes.css` line 484. |
| DECOR-04 | XP bar accent displayed under section headings using XP green (#7fcc19) | No SVG needed — pure CSS. Pattern: `[data-theme="minecraft"] h2::after { content: ''; display: block; height: 4px; background: #7fcc19; }`. Applied globally to all `h2` elements (or scoped to `main h2`, `.cv-section h2`, etc.). Must not conflict with Phase 23's use of `h2` for Press Start 2P font (additive rule, not overriding). `::after` on `h2` is available — Phase 23 does not claim it. |
| DECOR-05 | Health bar heart SVGs displayed as decorative elements | Two new SVGs needed: `heart-full.svg` (red/pink filled heart) and `heart-empty.svg` (dark outline heart). Hearts are 16x16 pixel-art shapes. Placed as decorative row of hearts in the footer or sidebar. A row of hearts can be simulated with repeated `background-image` or inline repetition via CSS. |
| INT-03 | Hover animations respect `prefers-reduced-motion` with instant fallback | Already implemented in Phase 23 (23-02). Phase 24 obligation: (a) verify audit passes — no transitions outside the guard in `minecraft.css`; (b) any Phase 24 decorative element hover animations (if added) must also be inside the guard. (c) Fix the REQUIREMENTS.md traceability table data entry error (Phase 24 listed as owner when Phase 23 is the actual implementer). |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| SVG `<rect>` pixel-grid (16x16 viewBox) | Native | All new decorative SVG icons | Matches established texture pipeline; `shape-rendering="crispEdges"` + `image-rendering: pixelated` in CSS ensures crisp rendering at any size |
| CSS `::before`/`::after` pseudo-elements | Native | Placing SVGs without HTML changes | Zero Astro component modifications; fully established by Phase 23 (Creeper face in sidebar uses exactly this pattern) |
| CSS `background-image` with SVG URL | Native | Rendering SVG icons via CSS | Established pattern for all 6 texture SVGs and the Creeper face; `background-size: contain` and `no-repeat` control sizing |
| `@media (prefers-reduced-motion: no-preference)` | Native CSS | Animation guard for any decorative hover animations | WCAG 2.1 SC 2.3.3; exact pattern established in Phase 23 (23-02) |
| `image-rendering: pixelated` | Native CSS | Crisp pixel-art rendering for SVGs | Required for all pixel-art assets; established as project standard since Phase 22 |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `background-repeat: repeat-x` | Native | Repeating tool icon as section divider | Used for HR replacement pattern (sword/pickaxe as horizontal repeating divider, same as LEGO `brick-row.svg` at `themes.css:488`) |
| CSS custom property `--mc-xp-green: #7fcc19` | Project convention | XP bar color | Add to the `[data-theme="minecraft"]` palette block in `minecraft.css` for consistency with other `--mc-*` variables |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SVG mob silhouettes | PNG screenshots from game | PNG at 16px looks blurry at 4x scale; SVG `<rect>` grid renders crisp via `image-rendering: pixelated` |
| CSS bar for XP accent | SVG XP bar image | CSS-only is simpler, scales perfectly, no new file; pure green bar is authentic to Minecraft XP bar look |
| Repeating background for heart row | Multiple `<img>` elements in HTML | Requires Astro component changes; CSS `background-image` with repeated `url()` is cleaner and requires no HTML edits |

**Installation:**

No new npm packages required for Phase 24.

## Architecture Patterns

### Recommended File Structure

```
public/images/minecraft/ui/
├── creeper-face.svg        # EXISTS (Phase 23)
├── zombie-silhouette.svg   # NEW (DECOR-02)
├── enderman-silhouette.svg # NEW (DECOR-02)
├── chicken-silhouette.svg  # NEW (DECOR-02)
├── sword.svg               # NEW (DECOR-03)
├── pickaxe.svg             # NEW (DECOR-03)
├── heart-full.svg          # NEW (DECOR-05)
└── heart-empty.svg         # NEW (DECOR-05)

src/styles/themes/minecraft.css
└── [EXTENDED: Phase 24 CSS section appended at end of file]
```

No changes to any Astro component files. No new npm packages.

### Pattern 1: Creeper Face in Footer (DECOR-01)

**What:** The Creeper face SVG already exists and is placed in the sidebar via `::after`. The footer uses `::before` (unclaimed by Phase 23) to add a second Creeper face.

**When to use:** DECOR-01 ("sidebar AND footer").

**Phase 23 precedent (sidebar):**
```css
[data-theme="minecraft"] .author-sidebar::after {
  content: '';
  display: block;
  width: 64px;
  height: 64px;
  margin: var(--space-md) auto 0;
  background: url('/images/minecraft/ui/creeper-face.svg') center/contain no-repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  opacity: 0.85;
}
```

**Phase 24 addition (footer):**
```css
/* Creeper face recurring accent in footer (DECOR-01) */
[data-theme="minecraft"] footer::before {
  content: '';
  display: block;
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-sm);
  background: url('/images/minecraft/ui/creeper-face.svg') center/contain no-repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  opacity: 0.6;
}
```

**Critical check:** Phase 23 adds rules to `footer` (color, border-top, padding-top) but does NOT use `footer::before` or `footer::after`. Both pseudo-elements are free for Phase 24.

### Pattern 2: Mob Silhouette SVG Construction (DECOR-02)

**What:** Simple monochrome pixel-art silhouettes at 16x16. Silhouettes are dark (`#1a1a1a`) shapes on a transparent background (no fill on the root `<svg>`).

**Key construction rules:**
- `viewBox="0 0 16 16"` with `width="16" height="16"` (matches all existing SVGs)
- `shape-rendering="crispEdges"` on the `<svg>` element (matches Creeper face)
- No background rect — transparent background lets CSS `background-color` show through
- Fill color: `#1a1a1a` (darkest Minecraft dark, matches bevel shadow color)

**Zombie silhouette pixel map** (approximate 16x16, classic MC zombie proportions):
```
Head: 4x4 block, centered at x=6-9, y=0-3
Body: 4x6 block at x=6-9, y=4-9
Arms: 2x5 at x=4-5,y=4-8 and x=10-11,y=4-8
Legs: 2x6 at x=6-7,y=10-15 and x=8-9,y=10-15 (split to suggest walking)
```

**Enderman silhouette pixel map** (tall, thin — distinctive enderman shape):
```
Head: 2x2 at x=7-8, y=0-1 (small head)
Body: 2x8 at x=7-8, y=2-9 (very thin body)
Arms: 1x6 at x=5-5,y=2-7 and x=10-10,y=2-7 (long thin arms)
Legs: 1x6 at x=7-7,y=10-15 and x=8-8,y=10-15 (very thin legs)
```

**Chicken silhouette pixel map** (round body, small beak, stubby wings):
```
Body: 4x4 oval at x=5-10,y=7-11
Head: 3x3 at x=10-12,y=4-6
Beak: 1x1 at x=13,y=6
Wing: 2x2 at x=4-5,y=8-9
Feet: 1x2 at x=6-6,y=12-13 and x=9-9,y=12-13
```

**Example (zombie-silhouette.svg):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges">
  <!-- Head -->
  <rect x="6" y="0" width="4" height="4" fill="#1a1a1a"/>
  <!-- Body -->
  <rect x="6" y="4" width="4" height="6" fill="#1a1a1a"/>
  <!-- Left arm -->
  <rect x="4" y="4" width="2" height="5" fill="#1a1a1a"/>
  <!-- Right arm -->
  <rect x="10" y="4" width="2" height="5" fill="#1a1a1a"/>
  <!-- Left leg -->
  <rect x="6" y="10" width="2" height="6" fill="#1a1a1a"/>
  <!-- Right leg (offset 1px for walking look) -->
  <rect x="8" y="11" width="2" height="5" fill="#1a1a1a"/>
</svg>
```

**CSS placement for mob silhouettes (DECOR-02):**
```css
/* Mob silhouettes as decorative accents */
/* Zombie: accent on talk-list section (talks = "encounters") */
[data-theme="minecraft"] .talk-list::before {
  content: '';
  display: block;
  width: 32px;
  height: 32px;
  margin: 0 0 var(--space-sm) 0;
  background: url('/images/minecraft/ui/zombie-silhouette.svg') center/contain no-repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  opacity: 0.5;
}

/* Enderman: accent on publication-list section (mysterious/academic) */
[data-theme="minecraft"] .publication-list::before {
  content: '';
  display: block;
  width: 32px;
  height: 32px;
  margin: 0 0 var(--space-sm) 0;
  background: url('/images/minecraft/ui/enderman-silhouette.svg') center/contain no-repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  opacity: 0.5;
}

/* Chicken: accent on post-list section (blog = casual/farm) */
[data-theme="minecraft"] .post-list::before {
  content: '';
  display: block;
  width: 32px;
  height: 32px;
  margin: 0 0 var(--space-sm) 0;
  background: url('/images/minecraft/ui/chicken-silhouette.svg') center/contain no-repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  opacity: 0.5;
}
```

**Placement rationale:** `::before` on list container elements (`.talk-list`, `.publication-list`, `.post-list`) places the silhouette just before the first list item without HTML changes. These selectors are not used by Phase 23.

### Pattern 3: Tool Icon SVGs as Section Dividers (DECOR-03)

**What:** Sword and pickaxe pixel-art icons used to replace or augment `<hr>` elements, or as accents on section heading borders. LEGO uses `hr` replacement with a brick-row SVG (themes.css:484). Phase 24 follows the same pattern.

**Sword SVG construction (16x16):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges">
  <!-- Blade: diagonal line from top-right to bottom-left -->
  <rect x="10" y="0" width="2" height="2" fill="#c6c6c6"/>
  <rect x="8" y="2" width="2" height="2" fill="#c6c6c6"/>
  <rect x="6" y="4" width="2" height="2" fill="#c6c6c6"/>
  <rect x="4" y="6" width="2" height="2" fill="#c6c6c6"/>
  <!-- Guard (crossguard) -->
  <rect x="2" y="8" width="6" height="1" fill="#866043"/>
  <!-- Handle -->
  <rect x="2" y="9" width="2" height="4" fill="#866043"/>
  <!-- Pommel -->
  <rect x="1" y="13" width="3" height="2" fill="#55a715"/>
</svg>
```

**Pickaxe SVG construction (16x16):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges">
  <!-- Pick head: left point -->
  <rect x="0" y="3" width="2" height="2" fill="#c6c6c6"/>
  <!-- Pick head: main body -->
  <rect x="2" y="2" width="8" height="4" fill="#c6c6c6"/>
  <!-- Pick head: right curve -->
  <rect x="10" y="1" width="2" height="2" fill="#c6c6c6"/>
  <rect x="12" y="2" width="2" height="2" fill="#c6c6c6"/>
  <!-- Handle: diagonal -->
  <rect x="8" y="6" width="2" height="2" fill="#866043"/>
  <rect x="10" y="8" width="2" height="2" fill="#866043"/>
  <rect x="12" y="10" width="2" height="2" fill="#866043"/>
  <rect x="14" y="12" width="2" height="4" fill="#866043"/>
</svg>
```

**CSS usage as section divider / HR replacement (DECOR-03):**
```css
/* HR replacement: alternating sword and pickaxe as section dividers */
[data-theme="minecraft"] hr {
  border: none;
  height: 16px;
  background: url('/images/minecraft/ui/sword.svg') left center repeat-x;
  background-size: 16px 16px;
  margin: var(--space-md) 0;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  opacity: 0.7;
}

/* Section heading accent: pickaxe before h2 headings in main content */
[data-theme="minecraft"] main h2::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
  background: url('/images/minecraft/ui/pickaxe.svg') center/contain no-repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

**Important:** `h2::before` is also used by LEGO theme in `themes.css` (line 441 — brick decoration). Since both are scoped (`[data-theme="minecraft"]` vs `:root[data-theme="lego"]`), there is no conflict. Verify there are no unscoped `h2::before` rules in `themes.css` that could interfere.

### Pattern 4: XP Bar Under Section Headings (DECOR-04)

**What:** A green bar (`#7fcc19` — XP green) displayed beneath each `h2` heading, simulating the Minecraft XP bar. Implemented as `h2::after` — this pseudo-element is NOT used by Phase 23 on `h2`.

**XP green color:** `#7fcc19` (specified in requirements). Add to palette: `--mc-xp-green: #7fcc19`. Contrast check: `#7fcc19` on `#1a1a1a` (dark bg) = ~7.0:1 — passes WCAG AA. On grass bg `#2f5a1e` = ~3.9:1 — border-line, but the XP bar is decorative (not text), so WCAG contrast does not apply to it.

```css
/* Add to [data-theme="minecraft"] custom properties block */
--mc-xp-green: #7fcc19;

/* XP bar accent under h2 section headings (DECOR-04) */
[data-theme="minecraft"] h2 {
  padding-bottom: var(--space-xs);
  position: relative;
}

[data-theme="minecraft"] h2::after {
  content: '';
  display: block;
  height: 4px;
  background: var(--mc-xp-green);
  margin-top: 4px;
  box-shadow: 0 0 4px rgba(127, 204, 25, 0.4); /* subtle green glow */
  image-rendering: pixelated;
}
```

**Conflict check:** Phase 23 uses Press Start 2P font and `text-shadow` on `h2` — these are not overridden here. The `::after` on `h2` is a new additive rule. `position: relative` on `h2` is safe (won't break layout). No `::after` on `h2` exists elsewhere in `minecraft.css` (verified: grep for `h2::after` in `minecraft.css` returns 0 results).

### Pattern 5: Health Bar Hearts (DECOR-05)

**What:** Pixel-art heart SVGs (full and empty) used as decorative elements, shown as a "health bar" row (e.g., 5 full hearts = 10 HP). Placed in the footer or sidebar.

**Heart full SVG (16x16 — classic Minecraft pixel heart):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges">
  <!-- Heart shape using pixel grid -->
  <!-- Top bumps -->
  <rect x="1" y="3" width="4" height="4" fill="#ff0000"/>
  <rect x="7" y="2" width="1" height="1" fill="#ff0000"/>
  <rect x="11" y="3" width="4" height="4" fill="#ff0000"/>
  <!-- Middle row -->
  <rect x="0" y="5" width="16" height="4" fill="#ff0000"/>
  <!-- Lower center -->
  <rect x="1" y="9" width="14" height="3" fill="#ff0000"/>
  <rect x="2" y="12" width="12" height="2" fill="#ff0000"/>
  <rect x="3" y="14" width="10" height="1" fill="#ff0000"/>
  <rect x="5" y="15" width="6" height="1" fill="#ff0000"/>
  <!-- Highlight (top-left shine) -->
  <rect x="2" y="4" width="2" height="2" fill="#ff6666"/>
  <rect x="11" y="4" width="2" height="2" fill="#ff6666"/>
  <!-- Dark border effect -->
  <rect x="1" y="2" width="4" height="1" fill="#550000"/>
  <rect x="11" y="2" width="4" height="1" fill="#550000"/>
</svg>
```

**Heart empty SVG (16x16 — dark outline, gray fill):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges">
  <!-- Same shape, gray fill for empty heart -->
  <rect x="1" y="3" width="4" height="4" fill="#555555"/>
  <rect x="11" y="3" width="4" height="4" fill="#555555"/>
  <rect x="0" y="5" width="16" height="4" fill="#555555"/>
  <rect x="1" y="9" width="14" height="3" fill="#555555"/>
  <rect x="2" y="12" width="12" height="2" fill="#555555"/>
  <rect x="3" y="14" width="10" height="1" fill="#555555"/>
  <rect x="5" y="15" width="6" height="1" fill="#555555"/>
</svg>
```

**CSS placement — heart row in footer (DECOR-05):**
```css
/* Health bar hearts in footer: 5 full hearts = 10 HP decoration */
[data-theme="minecraft"] footer::after {
  content: '';
  display: block;
  height: 16px;
  margin-top: var(--space-sm);
  background:
    url('/images/minecraft/ui/heart-full.svg') 0 0 / 16px 16px no-repeat,
    url('/images/minecraft/ui/heart-full.svg') 18px 0 / 16px 16px no-repeat,
    url('/images/minecraft/ui/heart-full.svg') 36px 0 / 16px 16px no-repeat,
    url('/images/minecraft/ui/heart-full.svg') 54px 0 / 16px 16px no-repeat,
    url('/images/minecraft/ui/heart-full.svg') 72px 0 / 16px 16px no-repeat;
  background-color: transparent;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

**Alternative approach — repeat-x with fixed background-size:**
```css
[data-theme="minecraft"] footer::after {
  content: '';
  display: block;
  height: 16px;
  width: 90px; /* 5 hearts × 18px each */
  margin: var(--space-sm) auto 0;
  background: url('/images/minecraft/ui/heart-full.svg') left center repeat-x;
  background-size: 16px 16px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

**Important:** Phase 23 did NOT use `footer::before` or `footer::after`. Phase 24 uses `footer::before` for the Creeper face (DECOR-01) and `footer::after` for hearts (DECOR-05). Both are free.

### Pattern 6: Prefers-Reduced-Motion Audit (INT-03)

**What:** INT-03 is already implemented. Phase 24 obligation is a verification pass, not new code.

**Verification query:**
```bash
grep -n "transition" src/styles/themes/minecraft.css
# Expect: all transition lines are inside @media (prefers-reduced-motion: no-preference) block
```

**Current state (from Phase 23 verification):**
- Lines 382, 387 in `minecraft.css` are the only `transition:` declarations
- Both are inside the `@media (prefers-reduced-motion: no-preference)` guard at line 376
- No transitions exist outside the guard

**Phase 24 new decorative CSS:** If any decorative element hover animations are added in Phase 24 (e.g., a heart pulsing, a mob silhouette fading in), they MUST be inside the guard. The research recommendation is: **do not add hover animations to decorative elements in Phase 24**. Keep decorative SVGs static (opacity-only, no transitions). This avoids any new motion guard risk.

**REQUIREMENTS.md fix:** The traceability table incorrectly maps `INT-03 | Phase 24 | Complete`. This must be corrected to `INT-03 | Phase 23 | Complete` as documented by Phase 23 VERIFICATION.md.

### Anti-Patterns to Avoid

- **Using `footer::before` for both Creeper face AND hearts**: Each element has only one `::before` and one `::after`. Use `::before` for the Creeper face (DECOR-01) and `::after` for hearts (DECOR-05) — one pseudo-element each.
- **Adding `position: relative` to `h2` without checking Phase 23**: Phase 23 does NOT set `position: relative` on `h2`. It is safe to add. However, check that this does not cause layout shifts if Press Start 2P font at reduced size has unexpected inline-block behavior.
- **Using `h2::before` for tool icons without checking LEGO specificity**: LEGO uses `:root[data-theme="lego"] h2::before` (specificity 0,2,1) while Minecraft would use `[data-theme="minecraft"] h2::before` (specificity 0,2,1) — same specificity, but only one theme is active at a time, so no conflict. Verify in browser by switching themes.
- **Placing mob silhouettes on `::after` of elements that already have `::after`**: Phase 23 uses `::after` on `.author-sidebar` and on `.github-card`/`.portfolio-card` (tooltip). The mob silhouettes go on list container `::before` elements, which are free. Do not place them on `::after` of card elements.
- **Forgetting `image-rendering: crisp-edges` alongside `image-rendering: pixelated`**: The project standard since Phase 22 is to declare both for cross-browser support. `pixelated` is standard; `crisp-edges` is the older syntax. Always pair them.
- **Setting `display: block` on `h2::after` when h2 is `display: inline`**: If `h2` defaults to block, `::after` with `display: block` works fine. If there is any `display: inline-flex` or `display: flex` on `h2` from Phase 22/23, the `::after` behavior changes. Verify `h2` computed display in DevTools.
- **Animating decorative SVGs with `@keyframes`**: The requirements say "respect prefers-reduced-motion with instant fallback." Any `@keyframes` animation (unlike `transition`) requires an explicit `animation: none` for reduced-motion. Simpler to avoid `@keyframes` entirely for decorative elements — static opacity is sufficient.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pixel-art heart shape | Attempt complex CSS drawing | 16x16 SVG `<rect>` grid | Same pattern as all existing textures; SVG is simpler than CSS clip-path or pseudo-element stacking |
| Heart row of 5 | JavaScript loop | Multiple `background-image` CSS values OR `repeat-x` with fixed width | Pure CSS, zero JS, zero HTML changes |
| XP bar progress animation | JavaScript progress bar | Static CSS `::after` bar | DECOR-04 says "displayed" not "animated"; static bar fulfills the requirement without motion concerns |
| Section divider with sword | Complex `<hr>` override with JS | `background-image: url(sword.svg)` on `hr` | Same as LEGO `brick-row.svg` at `themes.css:488`; proven pattern |

**Key insight:** Phase 24 is SVG pixel-art design + CSS placement. The technical patterns are 100% established by Phases 22 and 23. The creative challenge is designing authentic Minecraft pixel-art in a 16x16 grid.

## Common Pitfalls

### Pitfall 1: Footer Pseudo-Element Conflicts Between DECOR-01 and DECOR-05

**What goes wrong:** Both the Creeper face (DECOR-01) and the health hearts (DECOR-05) are placed in the footer, but each element only has one `::before` and one `::after`.

**Why it happens:** Both requirements target the footer, but planning doesn't account for which pseudo-element each decoration claims.

**How to avoid:** DECOR-01 (Creeper face) uses `footer::before` — placed BEFORE the footer text content. DECOR-05 (hearts) uses `footer::after` — placed AFTER the footer text content. Verify Phase 23 did not claim either (confirmed: Phase 23 only sets color, border-top, and padding-top on `footer` — no pseudo-elements on footer in Phase 23).

**Warning signs:** Creeper face appears where hearts should be, or vice versa.

### Pitfall 2: h2::after XP Bar Breaks Existing Heading Layout

**What goes wrong:** Adding `position: relative` + `::after` to `h2` can shift adjacent content if `h2` is inside a flex container.

**Why it happens:** `position: relative` doesn't affect flow layout, but `::after { display: block }` adds height to the element. If `h2` has `margin-bottom: 0` or is in a tight layout, the XP bar adds 8px (4px bar + 4px margin-top) that may be unexpected.

**How to avoid:** Use `padding-bottom: 4px` on `h2` instead of adding margin to `::after`. This keeps the extra space within the `h2` element box.

**Warning signs:** Section headings appear to have extra space below them that breaks the design rhythm. Inspect in DevTools — the `::after` pseudo-element should be visible as a thin green bar.

### Pitfall 3: SVG Silhouettes Too Dark on Dark Background

**What goes wrong:** Mob silhouettes filled with `#1a1a1a` are invisible against the dark card backgrounds (`var(--mc-bg-dark)` = `#1a1a1a`).

**Why it happens:** The silhouette fill color matches the card background.

**How to avoid:** Silhouettes should be placed on the main content area (grass background `#2f5a1e`) or on the page body, not inside dark card elements. The list containers (`.post-list`, `.talk-list`, `.publication-list`) are in `main` which has `background-color: var(--mc-bg-dark)`. Use `opacity: 0.5` and a lighter fill color: use `var(--mc-stone-gray)` (`#8b8b8b`) or `var(--mc-text-muted)` (`#c8c8c8`) for silhouettes on dark backgrounds.

**Alternative:** Set silhouette fill to `var(--mc-text-muted)` (`#c8c8c8`) instead of `#1a1a1a`. This reads clearly on dark backgrounds while still looking like a silhouette. Contrast: `#c8c8c8` on `#1a1a1a` = 10.4:1.

**Warning signs:** Mob silhouette icons are invisible in the browser.

### Pitfall 4: Sword SVG Diagonal Looks Wrong at Small Sizes

**What goes wrong:** A 16x16 pixel-art diagonal (like a sword blade) looks like a staircase at 1x zoom, which is visually confusing at small scales.

**Why it happens:** Pixel diagonals in a 16x16 grid are inherently "stepped" — each 2x2 pixel step creates the diagonal. This is intentional for pixel art, but may look poor as an `<hr>` repeating divider if the repeat doesn't align cleanly.

**How to avoid:** For the `<hr>` repeating use case, a simpler horizontal sword design (blade horizontal, handle offset) reads better than a diagonal. Alternatively, use a vertical divider pattern (sword icon with handle at bottom, blade pointing up) and set `background-size: 16px 16px` with `repeat-x`. Test at actual browser scale before finalizing the design.

**Warning signs:** The `<hr>` divider looks like random gray blocks rather than a sword.

### Pitfall 5: Multiple `background-image` Heart Row Syntax

**What goes wrong:** Using multiple `background-image` values for the heart row requires careful comma-separated syntax. A single missing comma or misplaced `/` causes the entire rule to fail silently.

**Why it happens:** CSS multiple background syntax is complex: `background: url() x y / size repeat, url() ...`. The `/` separates position from size.

**How to avoid:** Use the `repeat-x` approach with a fixed `width` on the `::after` pseudo-element instead of multiple background layers. Set `width: 90px` (5 × 18px), `background-size: 16px 16px`, and `background-repeat: repeat-x`. This is simpler and less error-prone.

**Warning signs:** Hearts don't appear in the footer. Check browser DevTools — if the `background` rule has a strikethrough it means the syntax is invalid.

## Code Examples

Verified patterns from codebase analysis and established project conventions:

### XP Bar Under h2 (DECOR-04)

```css
/* Source: h2::after is unused by Phase 23; pattern follows LEGO cv-section h2::after at themes.css:559 */

/* Add to [data-theme="minecraft"] variable block: */
/* --mc-xp-green: #7fcc19; */

[data-theme="minecraft"] h2 {
  padding-bottom: 4px;
  position: relative;
}

[data-theme="minecraft"] h2::after {
  content: '';
  display: block;
  height: 4px;
  background: var(--mc-xp-green);
  box-shadow: 0 0 4px rgba(127, 204, 25, 0.35);
  image-rendering: pixelated;
}
```

### Mob Silhouette Placement (DECOR-02)

```css
/* Source: ::before on list containers is unused by Phase 23 */

[data-theme="minecraft"] .post-list::before,
[data-theme="minecraft"] .talk-list::before,
[data-theme="minecraft"] .publication-list::before {
  content: '';
  display: block;
  width: 32px;
  height: 32px;
  margin-bottom: var(--space-sm);
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  opacity: 0.6;
}

[data-theme="minecraft"] .post-list::before {
  background: url('/images/minecraft/ui/chicken-silhouette.svg') center/contain no-repeat;
}

[data-theme="minecraft"] .talk-list::before {
  background: url('/images/minecraft/ui/zombie-silhouette.svg') center/contain no-repeat;
}

[data-theme="minecraft"] .publication-list::before {
  background: url('/images/minecraft/ui/enderman-silhouette.svg') center/contain no-repeat;
}
```

### Tool Icon HR Divider (DECOR-03)

```css
/* Source: Pattern follows LEGO hr at themes.css:484-491 */

[data-theme="minecraft"] hr {
  border: none;
  height: 16px;
  background: url('/images/minecraft/ui/sword.svg') left center repeat-x;
  background-size: 16px 16px;
  margin: var(--space-md) 0;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  opacity: 0.7;
}
```

### Health Hearts Row in Footer (DECOR-05)

```css
/* Source: footer::after is unused by Phase 23 */

[data-theme="minecraft"] footer::after {
  content: '';
  display: block;
  width: 90px; /* 5 hearts × 18px each */
  height: 16px;
  margin: var(--space-sm) auto 0;
  background: url('/images/minecraft/ui/heart-full.svg') left center repeat-x;
  background-size: 16px 16px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

### Creeper Face in Footer (DECOR-01 extension)

```css
/* Source: footer::before is unused by Phase 23 */

[data-theme="minecraft"] footer::before {
  content: '';
  display: block;
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-sm);
  background: url('/images/minecraft/ui/creeper-face.svg') center/contain no-repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  opacity: 0.6;
}
```

### Reduced-Motion Audit Pattern (INT-03)

```bash
# Verification command — run after Phase 24 CSS is written:
grep -n "transition" src/styles/themes/minecraft.css
# Expected: all lines are inside @media (prefers-reduced-motion: no-preference) block
# Phase 23 result: lines 382, 387 are inside the guard at line 376
# Phase 24 expectation: no new transitions added (decorative SVGs are static)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| PNG sprites for game icons | SVG pixel-grid with `<rect>` elements | Project-wide since Phase 22 | Crisp at any zoom; no rasterization artifacts |
| JS-driven animations | CSS `transition` + `@media (prefers-reduced-motion)` | WCAG 2.1 SC 2.3.3 (2018) | Accessible by default; zero JS |
| Multiple `<img>` tags for icon rows | CSS `background-image` with `repeat-x` | CSS3 (2010+) | Zero HTML changes; pure CSS |

**Deprecated / outdated in this context:**
- `-webkit-image-rendering: optimize-contrast`: Replaced by `image-rendering: crisp-edges`. Do not use.
- `background-image: -webkit-linear-gradient()`: XP bar uses a solid `background: #7fcc19` — no gradient needed, no prefixes.

## Open Questions

1. **Mob silhouette fill color: `#1a1a1a` or `#c8c8c8`?**
   - What we know: The main content area has `background: var(--mc-bg-dark)` = `#1a1a1a`. Dark silhouettes on dark background are invisible.
   - What's unclear: Whether the silhouettes should be near the list containers (which are inside `main` with dark bg) or outside main in the body background area.
   - Recommendation: Use `#c8c8c8` (muted text color, `--mc-text-muted`) for silhouettes on dark backgrounds. Alternatively, place silhouettes before `h1` on each page (which is inside `main` with dark bg — use light fill). Decide in planning which exact selectors to use.

2. **Should h2::before (pickaxe) conflict with h2 in sidebar (`.links-heading`)?**
   - What we know: `.links-heading` is an `h3` element, not `h2`. The sidebar `h2` is the author name. `[data-theme="minecraft"] main h2::before` scoped to `main` avoids styling the sidebar `h2`.
   - Recommendation: Scope the pickaxe decoration to `main h2::before` rather than the global `h2::before` to avoid affecting the author name heading in the sidebar.

3. **Five hearts or ten hearts in the footer?**
   - What we know: Minecraft shows 10 hearts (20 HP) in a row. Five hearts fits in 90px; ten hearts fits in 180px. Footer is centered.
   - Recommendation: Use 5 hearts (90px width) for visual balance in the footer. Ten hearts makes the decoration feel oversized in a simple footer.

4. **Should the XP bar under h2 appear on ALL h2 headings, or only specific ones (`.cv-section h2`, `main h2`)?**
   - What we know: The requirement says "section headings." The sidebar has an `h2` (author name) that likely should NOT have an XP bar underneath it.
   - Recommendation: Scope to `[data-theme="minecraft"] main h2::after` rather than the global `[data-theme="minecraft"] h2::after`. This excludes the author name `h2` in the sidebar.

## Sources

### Primary (HIGH confidence)

- `/Users/pedf/workspace/bacilo.github.io/src/styles/themes/minecraft.css` — Full Phase 22+23 implementation, 507 lines; confirmed `footer::before`/`::after` unused; confirmed `h2::after` unused; confirmed `h2` has `position` unset (safe to add `relative`)
- `/Users/pedf/workspace/bacilo.github.io/.planning/phases/23-component-transforms/23-VERIFICATION.md` — Authoritative verification: INT-03 implemented in Phase 23 (23-02); `footer::before`, `footer::after`, `h2::after` all confirmed free
- `/Users/pedf/workspace/bacilo.github.io/public/images/minecraft/ui/creeper-face.svg` — Existing SVG: `viewBox="0 0 16 16"`, `shape-rendering="crispEdges"`, `<rect>` grid pattern — exact template for all new SVGs
- `/Users/pedf/workspace/bacilo.github.io/public/images/minecraft/textures/bedrock.svg` — Texture pipeline pattern: `<rect>` grid, no `shape-rendering` attribute on textures (only on ui/creeper-face)
- `/Users/pedf/workspace/bacilo.github.io/src/styles/themes.css` lines 440-490 — LEGO section decoration patterns (h1::before brick, hr brick-row, list bullet bricks); direct CSS template for equivalent Minecraft decorations
- `/Users/pedf/workspace/bacilo.github.io/src/pages/cv.astro` — Confirms `.cv-section` and `.cv-section h2` selectors; `h2` inside `.cv-section` is in scope for XP bar
- `/Users/pedf/workspace/bacilo.github.io/src/pages/posts/index.astro` — Confirms `.post-list` class and `.post-item` selectors
- `/Users/pedf/workspace/bacilo.github.io/src/pages/talks/index.astro` — Confirms `.talk-list` class and `.talk-item` selectors
- `/Users/pedf/workspace/bacilo.github.io/src/pages/publications/index.astro` — Confirms `.publication-list` class and `.publication-item` selectors
- `/Users/pedf/workspace/bacilo.github.io/src/components/Footer.astro` — Confirms `<footer>` element with no classes; `footer::before` and `footer::after` are free
- `/Users/pedf/workspace/bacilo.github.io/.planning/REQUIREMENTS.md` — DECOR-01 through DECOR-05 + INT-03 text; traceability error confirmed (INT-03 mapped to Phase 24, implemented in Phase 23)

### Secondary (MEDIUM confidence)

- Minecraft Wiki (general knowledge): XP bar color `#7fcc19` is the standard Minecraft experience orb/bar green; verified against requirements which specify this exact hex value
- CSS `background-image` multiple values spec — MDN verifies comma-separated multiple backgrounds; `repeat-x` with fixed `background-size` is simpler than multiple background layers for the heart row
- LEGO theme implementation in `themes.css` — The LEGO `hr` → brick-row pattern (lines 484-491) provides direct template proof that CSS-only `hr` replacement works in this project

### Tertiary (LOW confidence)

- Mob pixel-art proportions (zombie, enderman, chicken) — Approximate 16x16 designs based on general Minecraft visual knowledge; the actual in-game sprites use a 64x64 texture sheet. The 16x16 silhouettes here are artistic approximations. Must be visually verified in browser; adjust pixel counts as needed for recognizability.
- Heart pixel-art SVG design — Approximate based on Minecraft UI conventions; the exact heart shape at 16x16 may need visual refinement to look recognizable. Plan should include a browser visual verification step.

## Metadata

**Confidence breakdown:**
- Standard stack (SVG + CSS): HIGH — all patterns established by Phases 22-23; codebase-verified
- Architecture (which selectors/pseudo-elements are free): HIGH — direct grep verification of `minecraft.css`
- SVG pixel-art designs (zombie, enderman, chicken, sword, pickaxe, hearts): MEDIUM — designs are approximations; will need visual iteration
- Pitfalls: HIGH — sourced from observable code analysis + direct LEGO theme precedent

**Research date:** 2026-02-18
**Valid until:** 2026-03-18 (30 days; CSS/SVG patterns are stable)
