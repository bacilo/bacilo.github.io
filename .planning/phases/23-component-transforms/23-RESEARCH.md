# Phase 23: Component Transforms - Research

**Researched:** 2026-02-18
**Domain:** CSS Minecraft UI component styling — hotbar navigation, inventory cards, stone buttons, tooltips, code blocks, sidebar, footer, theme switcher
**Confidence:** HIGH

## Summary

Phase 23 transforms every interactive page component into a Minecraft game-UI equivalent by adding scoped `[data-theme="minecraft"]` CSS rules to `src/styles/themes/minecraft.css`. The foundation from Phase 22 is fully verified and ready: color palette, SVG textures, pixel fonts, and contrast ratios are all in place. Phase 23 does NOT create new files or install new packages — it only adds CSS rules to the existing `minecraft.css` file, following the exact LEGO pattern established in `themes.css`.

The primary technical challenge is the Minecraft 3D bevel effect. Minecraft's UI uses a characteristic sunken-slot (inventory) or raised-button (stone button) look achieved through layered `inset` box-shadows — light on top-left, dark on bottom-right for raised; inverted for pressed. This pure CSS technique requires no JavaScript and no new SVG files for the component transforms themselves. One new SVG is needed: the Creeper face for the author sidebar (COMP-03), which must be hand-crafted as an 8x8 pixel-grid SVG to match the existing texture style.

The biggest planning risk is scope: 13 requirement IDs across 5 thematic groups. Each group maps cleanly to a separate plan file. The LEGO theme in `themes.css` (Phase 19-21) provides direct CSS-by-class reference for every component that needs transforming — the planner can read LEGO selectors and translate them to Minecraft equivalents.

**Primary recommendation:** Split into 5 plan files (nav/hotbar, cards/tooltips, buttons/interactive, code blocks/footer/sidebar/theme-switcher, and a Creeper SVG task). All CSS goes into `src/styles/themes/minecraft.css`. Zero new npm packages. One new SVG: `public/images/minecraft/ui/creeper-face.svg`.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Navigation bar styled as Minecraft hotbar with slot borders and 3D bevel effect | CSS `inset` box-shadow with Minecraft gray palette on `.nav-list` and nav `a` elements; hotbar uses `#c6c6c6` outer container, `#8b8b8b` slot background; bevel uses light top-left (`#fff`) and dark bottom-right (`#555`) inset shadows |
| NAV-02 | Active nav item displays highlighted slot with selector bracket/glow | `a.active` and `a[aria-current="page"]` get lighter slot background and distinct border; CSS `::before`/`::after` pseudo-elements can simulate selector brackets without HTML changes |
| NAV-03 | Hotbar navigation remains usable on mobile (320px+) with responsive fallback | Existing nav stacks to vertical on `max-width: 768px`; at 320px wide, 6 nav items need either horizontal scroll (allowed) or compact styling; font-size reduction of slot labels ensures text fits; existing Astro Navigation.astro responsive CSS applies, Minecraft scoped styles must not break it |
| CARD-01 | Content cards styled as inventory slots with dark background and bevel borders | `.portfolio-card`, `.github-card`, `.publication-item`, `.post-item`, `.talk-item` all get Minecraft inventory slot appearance: dark `#2d2d2d` bg, `#000` border, inset bevel shadows (`#8b8b8b` top-left, `#373737` bottom-right) |
| CARD-02 | Card hover displays Minecraft-style tooltip with dark background and purple border | Pure CSS tooltip using `::before`/`::after` with `position: absolute` on `:hover`; requires `position: relative` on card container; tooltip: `background: #100010`, `border: 2px solid #2d0a2d`, `outline: 1px solid #28002e`, Silkscreen font; `data-tooltip` attribute pattern OR `::after` on card title |
| CARD-03 | Cards render responsively (1 col mobile, 2 col tablet, 3 col desktop) | Existing `.portfolio-grid` uses `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` — already responsive; Minecraft scoped styles must not override `display: grid` or `grid-template-columns`; only apply background/border/shadow changes |
| INT-01 | Buttons and links styled as Minecraft stone buttons with raised 3D bevel | `.repo-link`, `.link-button`, `.download-link`, `.paper-link a`, `.tag` get stone button treatment: `background: var(--mc-bg-stone)`, outer border `#000`, inset box-shadow `2px 2px 0 #c6c6c6` (highlight) and `-2px -2px 0 #555` (shadow), `border-radius: 0` (pixel-art corners) |
| INT-02 | Button press state inverts bevel shadow (pressed-in effect) | `:active` state swaps inset shadows: `inset 2px 2px 0 #555` and `inset -2px -2px 0 #c6c6c6`; no `transform` needed (pure shadow inversion); `transition: box-shadow 50ms` for snap feel |
| INT-03 | Hover animations respect `prefers-reduced-motion` with instant fallback | All `transition` properties wrapped in `@media (prefers-reduced-motion: no-preference)` block; the `:active` bevel inversion is instant (50ms) so it qualifies as "instant" — still wrap for correctness; LEGO theme already demonstrates this pattern in `themes.css` |
| COMP-01 | Code blocks styled as command block output (orange accent, dark bg, pixel mono font) with Shiki syntax highlighting preserved | `.astro-code` in `[data-theme="minecraft"]` already gets `color: var(--shiki-dark)` and `background-color: var(--shiki-dark-bg)` from `themes.css` (lines 869-872); Phase 23 adds orange left border (`border-left: 4px solid #ff6a00` — command block orange), `border-radius: 0`, pixel mono font for wrapper |
| COMP-02 | Footer styled with bedrock texture pattern | `footer` already gets bedrock SVG texture and `--mc-bg-darkest` background from Phase 22; Phase 23 adds component decoration: border-top with stone pattern, footer text in Pixelify Sans, footer link color using `--mc-sky-blue`, ensures bedrock texture is visible over dark bg |
| COMP-03 | Author sidebar styled as inventory panel with Creeper face accent | `.author-sidebar` already gets wood texture from Phase 22; Phase 23 adds Creeper face SVG decoration (new `public/images/minecraft/ui/creeper-face.svg`), inventory panel bevel borders, author-photo gets square crop (pixel-art avatar style — `border-radius: 0`), social link bullet points as pixel decorations |
| COMP-04 | Theme switcher dropdown styled to match Minecraft UI | `.theme-select` gets stone button treatment matching INT-01 buttons; `font-family: 'Pixelify Sans'`; `border-radius: 0`; dark dropdown background; label text in Minecraft style |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS `inset` box-shadow | Native | Minecraft 3D bevel effect for slots and buttons | Pure CSS, no new dependencies; box-shadow supports multiple comma-separated values including inset; verified in all modern browsers (MDN) |
| CSS `::before`/`::after` pseudo-elements | Native | Tooltip overlay, selector brackets, decorative accents | No HTML changes needed in Astro components; same technique LEGO uses for studs and brick bullets |
| `[data-theme="minecraft"]` scoped selectors | Pattern | Zero-leakage component overrides | Established in Phase 22; all new rules extend `src/styles/themes/minecraft.css` |
| SVG `<rect>` pixel-grid (16x16 viewBox) | Native | Creeper face accent for sidebar (COMP-03) | Matches existing texture approach; no new file type or toolchain |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@media (prefers-reduced-motion: no-preference)` | Native CSS | Wrap all transitions/animations (INT-03) | Required for WCAG 2.1 SC 2.3.3; existing LEGO pattern in `themes.css` shows exact implementation |
| CSS `position: relative` on card containers | Native | Enable absolute-positioned tooltips (CARD-02) | Required for pseudo-element tooltips; must not conflict with existing flex/grid layout |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure CSS `::after` tooltips | JavaScript Tippy.js or Floating UI | JS dependency adds complexity; pure CSS is sufficient for static text tooltips; no interactivity needed beyond hover show/hide |
| Shadow-only bevel | PNG/SVG border images | `border-image` is complex; box-shadow approach is simpler, more flexible, already established in LEGO nav bricks |
| Custom Creeper SVG (hand-drawn) | Third-party SVG (CC0) | Third-party SVG may not match 16x16 pixel grid style; hand-crafted guarantees stylistic consistency with existing textures |

**Installation:**

No new npm packages required for Phase 23.

## Architecture Patterns

### Recommended File Structure

```
src/styles/themes/
└── minecraft.css          # EXTENDED: All Phase 23 rules appended here
public/images/minecraft/
└── ui/                    # NEW directory
    └── creeper-face.svg   # NEW: 16x16 pixel-grid Creeper face SVG
```

All CSS rules go into `src/styles/themes/minecraft.css`. No changes to Astro component files. No new npm packages.

### Pattern 1: Minecraft Inventory Slot / Hotbar Bevel

**What:** The characteristic Minecraft UI uses layered inset box-shadows to simulate the bevel around inventory slots and the hotbar container. Light top-left gives the "raised" appearance; dark bottom-right gives the "shadow" side.

**When to use:** NAV-01 (hotbar container + slot items), CARD-01 (inventory slot cards), COMP-03 (sidebar panel).

**Verified CSS pattern (from prior architecture research + MDN box-shadow):**

```css
/* Minecraft hotbar outer container */
[data-theme="minecraft"] .nav-list {
  background: #c6c6c6;
  border: 2px solid #000000;
  box-shadow:
    inset 2px 2px 0 #ffffff,    /* top-left highlight */
    inset -2px -2px 0 #555555;  /* bottom-right shadow */
  padding: 4px;
  gap: 2px;
  display: flex;
  list-style: none;
  margin: 0;
}

/* Individual hotbar slot */
[data-theme="minecraft"] nav:not(.author-links) .nav-list a {
  background: var(--mc-bg-stone);    /* #6b6b6b */
  border: 1px solid #373737;
  box-shadow:
    inset 1px 1px 0 #9a9a9a,   /* inner top-left highlight */
    inset -1px -1px 0 #1a1a1a; /* inner bottom-right shadow */
  color: var(--mc-text-light);
  text-shadow: 2px 2px 0 #1a1a1a;
  font-family: 'Pixelify Sans', monospace;
  padding: 6px 12px;
  border-radius: 0;
  text-decoration: none;
  display: block;
}

/* Active / current page slot */
[data-theme="minecraft"] nav:not(.author-links) .nav-list a.active,
[data-theme="minecraft"] nav:not(.author-links) .nav-list a[aria-current="page"] {
  background: #c6c6c6;
  color: #ffffff;
  border-color: #ffffff;
  box-shadow:
    inset 1px 1px 0 #ffffff,
    inset -1px -1px 0 #555555,
    0 0 6px 1px rgba(255, 255, 255, 0.4); /* subtle glow */
}
```

**Mobile fallback (NAV-03 — 320px+):**

```css
/* Mobile: compact slots, allow horizontal scroll */
@media (max-width: 480px) {
  [data-theme="minecraft"] nav:not(.author-links) .nav-list a {
    padding: 6px 8px;
    font-size: 12px;
  }
}
```

### Pattern 2: Stone Button Raised/Pressed States

**What:** Interactive elements styled as Minecraft stone buttons. Raised state uses light inset on top-left, dark on bottom-right. Pressed state inverts this.

**When to use:** INT-01 (`.repo-link`, `.link-button`, `.download-link`, `.paper-link a`, `.tag`), COMP-04 (`.theme-select`).

```css
/* Raised stone button (normal state) */
[data-theme="minecraft"] .repo-link,
[data-theme="minecraft"] .link-button,
[data-theme="minecraft"] .download-link,
[data-theme="minecraft"] .paper-link a,
[data-theme="minecraft"] .tag {
  background: var(--mc-bg-stone);  /* #6b6b6b */
  border: 2px solid #000000;
  box-shadow:
    inset 2px 2px 0 #c6c6c6,    /* top-left highlight (raised look) */
    inset -2px -2px 0 #373737;  /* bottom-right shadow */
  color: var(--mc-text-light);
  text-shadow: 1px 1px 0 #1a1a1a;
  font-family: 'Pixelify Sans', monospace;
  border-radius: 0;              /* pixel-art: no rounded corners */
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  /* Transition ONLY when motion is preferred */
}

/* Pressed state — bevel inverts (INT-02) */
[data-theme="minecraft"] .repo-link:active,
[data-theme="minecraft"] .link-button:active,
[data-theme="minecraft"] .download-link:active,
[data-theme="minecraft"] .paper-link a:active,
[data-theme="minecraft"] .tag:active {
  box-shadow:
    inset 2px 2px 0 #373737,   /* inverted: now dark on top-left */
    inset -2px -2px 0 #c6c6c6; /* inverted: light on bottom-right */
}

/* Hover animation — only when reduced motion not preferred (INT-03) */
@media (prefers-reduced-motion: no-preference) {
  [data-theme="minecraft"] .repo-link,
  [data-theme="minecraft"] .link-button,
  [data-theme="minecraft"] .download-link,
  [data-theme="minecraft"] .paper-link a,
  [data-theme="minecraft"] .tag {
    transition: box-shadow 80ms ease, background-color 80ms ease;
  }
}
```

### Pattern 3: Minecraft Tooltip (Pure CSS)

**What:** Hover over a card reveals a Minecraft-style tooltip. Uses `::after` pseudo-element on the card's title link with absolute positioning. Tooltip has dark background, purple border, and pixel font.

**When to use:** CARD-02 (card hover tooltip). Applied to `.github-card`, `.portfolio-card`, `.publication-item`, `.post-item`, `.talk-item`.

**Implementation approach:** Add `data-tooltip` attribute (containing the description or title text) to the card wrapper element. The pseudo-element reads it with `content: attr(data-tooltip)`. However, since Astro components don't allow dynamic `data-tooltip` attributes without modification, the practical fallback is to use a CSS `::after` tooltip on `:hover` of the card container showing a generic Minecraft-style highlight (background color change + border glow) as the "tooltip" effect, rather than text content.

**Recommended approach — visual tooltip cue without text duplication:**

```css
/* Inventory slot hover effect — simulates Minecraft item highlight */
[data-theme="minecraft"] .github-card:hover,
[data-theme="minecraft"] .portfolio-card:hover,
[data-theme="minecraft"] .publication-item:hover,
[data-theme="minecraft"] .post-item:hover,
[data-theme="minecraft"] .talk-item:hover {
  box-shadow:
    inset 2px 2px 0 #9a9a9a,
    inset -2px -2px 0 #1a1a1a,
    0 0 8px 2px rgba(98, 78, 255, 0.35); /* Minecraft hover: purple-tinted glow */
  border-color: #624eff;
}

/* Tooltip positioning — requires position: relative on card */
[data-theme="minecraft"] .github-card,
[data-theme="minecraft"] .portfolio-card {
  position: relative;
}

/* Tooltip: shown on card hover via ::after — Minecraft UI style */
[data-theme="minecraft"] .github-card[data-tooltip]:hover::after,
[data-theme="minecraft"] .portfolio-card[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  background: #100010;
  border: 2px solid #2d0a2d;
  outline: 1px solid #28002e;
  color: #ffffff;
  font-family: 'Silkscreen', monospace;
  font-size: 12px;
  line-height: 1.4;
  padding: 4px 8px;
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
  max-width: 280px;
  white-space: normal;
}
```

**Important planning note:** The `data-tooltip` attribute requires adding it to the card element in the Astro component. If modifying Astro components is out of scope (components are `.astro` files, not CSS), the planner should define whether this attribute addition is in scope. If not, the hover glow effect alone satisfies "hovering a card reveals a Minecraft-style tooltip" visually (the card itself changes appearance). The research recommends adding the `data-tooltip` attribute in the Astro component for the card's description text — this is a single-line addition per component.

### Pattern 4: Code Block Command Block Style (COMP-01)

**What:** Code blocks (.astro-code) get a command-block orange accent, dark background, pixel mono font for the container. Shiki's inline syntax colors are preserved via the existing `--shiki-dark` variables.

**Critical context:** `themes.css` already handles the Shiki color override for Minecraft at lines 869-872:
```css
[data-theme="minecraft"] .astro-code,
[data-theme="minecraft"] .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

Phase 23 only adds the orange border and container decoration to `minecraft.css` — it does NOT duplicate or conflict with the `themes.css` Shiki override:

```css
/* Command block output styling — Phase 23 addition to minecraft.css */
[data-theme="minecraft"] .astro-code {
  border: 2px solid #373737;           /* outer dark border */
  border-left: 4px solid #ff6a00;      /* orange accent = command block */
  border-radius: 0;                    /* pixel-art corners */
  padding: var(--space-sm);
  margin: var(--space-sm) 0;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  font-size: 0.7em;                    /* Press Start 2P is wide, needs reduction */
  box-shadow:
    inset 2px 2px 0 rgba(255, 106, 0, 0.1), /* subtle orange inner glow */
    0 2px 4px rgba(0, 0, 0, 0.4);
  overflow-x: auto;
}
```

**Warning:** `font-size: 0.7em` on `.astro-code` for Press Start 2P is necessary because Press Start 2P is a wide bitmap font — at 1em it overflows code blocks. Verify in browser; adjust to `0.65em` if needed. The Shiki color spans still render correctly at reduced font sizes.

### Pattern 5: Creeper Face SVG (COMP-03 sidebar accent)

**What:** A 16x16 pixel-grid SVG replicating the Minecraft Creeper face. Used as a decorative accent in the `.author-sidebar`. Same construction method as existing textures.

**Creeper face pixel map** (8x8 effective face, centered in 16x16):

The Creeper face is symmetric, with:
- Base body color: `#55a715` (Creeper green, `--mc-creeper-green`)
- Eyes: two 2x2 dark squares (`#1a1a1a`)
- Mouth: irregular 4x4 dark pattern forming a grim expression

```svg
<!-- public/images/minecraft/ui/creeper-face.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <!-- Background: creeper green -->
  <rect width="16" height="16" fill="#55a715"/>
  <!-- Left eye: 2x2 dark squares at (3,4) -->
  <rect x="3" y="4" width="2" height="2" fill="#1a1a1a"/>
  <!-- Right eye: 2x2 dark squares at (11,4) -->
  <rect x="11" y="4" width="2" height="2" fill="#1a1a1a"/>
  <!-- Mouth: grim expression pattern -->
  <rect x="5" y="8" width="6" height="1" fill="#1a1a1a"/>
  <rect x="5" y="9" width="2" height="2" fill="#1a1a1a"/>
  <rect x="9" y="9" width="2" height="2" fill="#1a1a1a"/>
  <rect x="6" y="11" width="4" height="1" fill="#1a1a1a"/>
</svg>
```

**Usage in minecraft.css:**

```css
/* Author sidebar: Creeper face accent decoration (COMP-03) */
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

### Pattern 6: Footer Bedrock Enhancement (COMP-02)

**What:** Footer already has bedrock texture from Phase 22. Phase 23 adds styling for text and links inside the bedrock footer.

```css
/* Footer text and link color corrections on bedrock background */
[data-theme="minecraft"] footer {
  color: var(--mc-text-light);
  border-top: 4px solid #373737;
  padding-top: calc(var(--space-md) + 4px);
}

[data-theme="minecraft"] footer a {
  color: var(--mc-sky-blue);
  text-shadow: 1px 1px 0 #1a1a1a;
}

[data-theme="minecraft"] footer a:hover {
  color: #87ceeb;
  text-decoration: none;
}
```

**Note:** Footer bedrock texture was applied in Phase 22. Phase 23 only adds the text/link color rules and border accent. Do not re-declare the background texture (causes specificity duplication).

### Pattern 7: Theme Switcher Minecraft Style (COMP-04)

```css
/* Theme switcher label and dropdown */
[data-theme="minecraft"] .theme-switcher label {
  color: var(--mc-text-muted);
  font-family: 'Pixelify Sans', monospace;
}

[data-theme="minecraft"] .theme-select {
  background: var(--mc-bg-stone);
  color: var(--mc-text-light);
  border: 2px solid #000000;
  border-radius: 0;
  box-shadow:
    inset 2px 2px 0 #9a9a9a,
    inset -2px -2px 0 #373737;
  font-family: 'Pixelify Sans', monospace;
  padding: 4px 8px;
  cursor: pointer;
}

[data-theme="minecraft"] .theme-select:hover {
  border-color: var(--mc-sky-blue);
}

[data-theme="minecraft"] .theme-select:focus {
  outline: 2px solid var(--mc-sky-blue);
  outline-offset: 2px;
}
```

### Anti-Patterns to Avoid

- **Modifying `.astro-code` Shiki colors in `minecraft.css`**: The `themes.css` already applies `--shiki-dark` colors with `!important`. Adding conflicting rules in `minecraft.css` causes specificity battles. Only add structural properties (border, padding, font) to `.astro-code` in `minecraft.css`.
- **Setting `border-radius` without `!important` on button elements**: The base `.repo-link` and `.link-button` have `border-radius: 4px` from their component `<style>` blocks. Astro scopes component `<style>` with attribute selectors, which have higher specificity than `[data-theme]`. Use `border-radius: 0 !important` or adjust specificity by adding the component class: `[data-theme="minecraft"] .repo-link`.
- **Breaking responsive grid with `width` on cards**: CARD-03 requires 1/2/3 col responsive behavior. The existing `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` handles this. Never set `width` or `max-width` on individual cards in Minecraft CSS.
- **Re-declaring Phase 22 background textures**: `footer`, `.author-sidebar`, `nav`, and `body` already have their textures from Phase 22. Phase 23 only adds visual decoration on top (borders, text colors, pseudo-elements). Do not duplicate `background-image` declarations.
- **Using `position: fixed` for tooltips**: Tooltips must be `position: absolute` relative to the card, not `fixed`. Fixed tooltips are not clipped to the card context and may appear in wrong positions during scroll.
- **Press Start 2P in code blocks without font-size reduction**: Press Start 2P at 1em makes code blocks very wide. Always reduce to 0.65-0.7em. Test horizontally at 320px viewport.
- **`transform: translateY` for button press without reduced-motion guard**: Even 1-2px transforms can cause nausea for motion-sensitive users. The pure shadow inversion (INT-02) approach avoids this entirely — no `transform` needed for the press effect.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 3D bevel effect | Canvas rendering, custom SVG borders | CSS `inset` box-shadow with multiple values | MDN-verified, pure CSS, scales with any size, no image assets needed |
| Hover tooltips | JS tooltip library (Floating UI, Tippy.js) | CSS `::after` pseudo-elements with `position: absolute` | No JS dependency; static text tooltips work perfectly with pure CSS; sufficient for card descriptions |
| Minecraft UI color values | Sampling screenshots | The palette from Phase 22 + the bevel values documented here (verified against Minecraft Wiki color analysis) | Colors pre-verified for WCAG AA compliance |
| Mobile-responsive slot sizing | JavaScript resize observer | CSS `@media` queries + existing responsive layout | Existing nav already stacks on mobile; only padding/font-size adjustments needed |

**Key insight:** Phase 23 is purely CSS — zero new npm packages, zero JavaScript, zero Astro component logic changes (except optionally adding `data-tooltip` attributes for CARD-02). Every visual transformation is a CSS rule in `minecraft.css`.

## Common Pitfalls

### Pitfall 1: Astro Component Style Specificity Wins Over Theme Styles

**What goes wrong:** Astro scopes `<style>` blocks in `.astro` files by adding a unique `data-astro-cid-*` attribute selector. This gives component styles higher specificity than `[data-theme="minecraft"]` attribute selector alone.

**Why it happens:** Astro style scoping: `.repo-link[data-astro-cid-xxx]` (0,2,0 specificity) beats `[data-theme="minecraft"] .repo-link` (0,2,0 specificity, but applied after). In practice, since both are attribute + class = (0,2,0), the component style wins due to source order (component CSS loads in `<style>` inside the component, which appears later in the cascade than imported CSS files).

**How to avoid:** When overriding properties that are set in Astro component scoped styles, either:
  (a) Use more specific selectors: `[data-theme="minecraft"] .github-card .repo-link` adds a class, increasing specificity to (0,3,0).
  (b) Use `!important` sparingly for properties that genuinely need to override: `border-radius: 0 !important`.
  (c) Verify in browser DevTools that the Minecraft rule is "winning" — if the rule is struck-through, increase specificity.

**Warning signs:** `border-radius` remains rounded on buttons, or background color doesn't change. Open DevTools, inspect the element, and check if the Minecraft rule is overridden.

### Pitfall 2: Tooltip Overflow / Z-Index Stacking

**What goes wrong:** `::after` tooltips disappear behind sibling elements or overflow outside the viewport at the card's edges.

**Why it happens:** CSS tooltips use `position: absolute` relative to the nearest `position: relative` ancestor. If cards are inside a grid, the grid items have `overflow: hidden` or the tooltip is clipped.

**How to avoid:** Set `overflow: visible` on card containers (`.portfolio-grid`, `.portfolio-item`) when Minecraft theme is active. Set `z-index: 100` on the tooltip `::after`. Position tooltips above the card (`bottom: calc(100% + 4px)`) so they don't clip against the card edge below.

**Warning signs:** Tooltip appears cut off or invisible. Check `overflow` on parent containers in DevTools.

### Pitfall 3: Mobile Nav Overflow on 320px

**What goes wrong:** The hotbar styling adds borders and padding to each nav slot, making the total width exceed 320px viewport width, causing horizontal scroll or layout overflow.

**Why it happens:** Minecraft hotbar slots have a minimum width driven by text label length. "Publications" is 12 characters in Pixelify Sans — at 12px font-size, that's ~75px per slot. 6 slots × ~75px + gaps + borders exceeds 320px.

**How to avoid:** Add a compact media query for 480px and below: reduce slot font-size to 11-12px, reduce padding to 4px 6px. Alternatively, allow horizontal scroll on the hotbar for very small viewports (this is a valid fallback — the requirement says "usable on 320px+", not "no scroll"). Add `overflow-x: auto` to the nav container and `white-space: nowrap` to links for a scrollable hotbar.

**Warning signs:** Chrome DevTools device emulation at Galaxy Fold (280px) or iPhone SE (375px) shows the nav wrapping or overflowing.

### Pitfall 4: Press Start 2P in Code Blocks Is Too Wide

**What goes wrong:** Code blocks overflow their containers horizontally on all viewport sizes when using Press Start 2P at `1em`.

**Why it happens:** Press Start 2P is a bitmap font with very wide character spacing — each character is ~8px wide at 8px size, meaning code with more than ~40 characters per line will overflow at 320px.

**How to avoid:** Use `font-size: 0.7em` or smaller on `.astro-code`. Better yet, use Pixelify Sans mono fallback or keep the existing `--font-mono` stack as fallback: `font-family: 'Press Start 2P', 'Courier New', monospace`. Add `overflow-x: auto` on `.astro-code` (likely already present from base styles — verify).

**Warning signs:** Code blocks have horizontal scrollbar even for short lines. In DevTools, the `.astro-code` computed width exceeds the `main` container width.

### Pitfall 5: Reduced Motion Guard Missed for Hover Transitions

**What goes wrong:** Button hover transitions and card hover glow effects still animate for users with `prefers-reduced-motion: reduce`.

**Why it happens:** `transition` properties are applied unconditionally, outside a `@media (prefers-reduced-motion: no-preference)` block.

**How to avoid:** Wrap ALL `transition` declarations in `@media (prefers-reduced-motion: no-preference) { ... }`. The bevel inversion on `:active` (INT-02) needs no transition at all — instant visual feedback is correct behavior and accessible. Only hover state changes (glow, background-color shift) need transitions.

**Warning signs:** In macOS System Preferences → Accessibility → Reduce Motion (enabled), hover effects still animate.

### Pitfall 6: Tooltip Pseudo-Element Conflicts with `::after` on `.github-card`

**What goes wrong:** The LEGO theme in `themes.css` already uses `::after` on `.author-sidebar` for the minifig decoration. If the Minecraft theme also sets `::after` on `.author-sidebar`, only one can win (pseudo-elements can't stack with the same selector).

**Why it happens:** Each element can only have one `::before` and one `::after`. Multiple CSS rules targeting the same pseudo-element result in the last rule winning.

**How to avoid:** For the Creeper face sidebar decoration (COMP-03), use `::after` consistently. Since LEGO's `::after` on `.author-sidebar` is scoped with `:root[data-theme="lego"]`, there is no conflict — when Minecraft theme is active, only the Minecraft `::after` applies. Verify this by switching between LEGO and Minecraft themes in the browser.

**Warning signs:** Creeper face doesn't appear in sidebar in Minecraft theme, OR the LEGO minifig appears in Minecraft theme.

## Code Examples

Verified patterns from codebase analysis and CSS standards:

### Complete Hotbar Navigation Block

```css
/* Source: Architecture research + LEGO nav pattern from themes.css */

/* Hotbar outer container */
[data-theme="minecraft"] nav:not(.author-links) {
  background: #1a1a1a;
  border-bottom: 2px solid #000000;
  padding: 4px 0;
}

/* Hotbar slot list */
[data-theme="minecraft"] nav:not(.author-links) .nav-list {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 4px 8px;
  gap: 3px;
  display: flex;
}

/* Individual slot */
[data-theme="minecraft"] nav:not(.author-links) .nav-list a {
  background: var(--mc-bg-stone);
  border: 2px solid #000000;
  box-shadow:
    inset 2px 2px 0 #9a9a9a,
    inset -2px -2px 0 #373737;
  color: var(--mc-text-light);
  text-shadow: 2px 2px 0 #1a1a1a;
  font-family: 'Pixelify Sans', monospace;
  padding: 6px 10px;
  border-radius: 0;
  text-decoration: none;
  display: block;
  border-bottom: none; /* Remove default active underline */
}

/* Active slot highlight */
[data-theme="minecraft"] nav:not(.author-links) .nav-list a.active,
[data-theme="minecraft"] nav:not(.author-links) .nav-list a[aria-current="page"] {
  background: var(--mc-stone-gray);
  color: #ffffff;
  box-shadow:
    inset 2px 2px 0 #e0e0e0,
    inset -2px -2px 0 #555555,
    0 0 6px 1px rgba(255, 255, 255, 0.25);
  border-color: #c6c6c6;
}

/* Mobile: compact slots */
@media (max-width: 480px) {
  [data-theme="minecraft"] nav:not(.author-links) .nav-list {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding: 4px;
    gap: 2px;
  }
  [data-theme="minecraft"] nav:not(.author-links) .nav-list a {
    padding: 5px 6px;
    font-size: 11px;
    white-space: nowrap;
    flex-shrink: 0;
  }
}
```

### Inventory Slot Card Block

```css
/* Source: Architecture Pattern 3, verified against LEGO card patterns in themes.css */

[data-theme="minecraft"] .github-card,
[data-theme="minecraft"] .portfolio-card {
  background: var(--mc-bg-dark);        /* #1a1a1a */
  border: 2px solid #000000;
  border-radius: 0;
  box-shadow:
    inset 2px 2px 0 #555555,
    inset -2px -2px 0 #000000;
  position: relative;
}

[data-theme="minecraft"] .github-card:hover,
[data-theme="minecraft"] .portfolio-card:hover,
[data-theme="minecraft"] .github-card:focus-within,
[data-theme="minecraft"] .portfolio-card:focus-within {
  border-color: #624eff;
  box-shadow:
    inset 2px 2px 0 #555555,
    inset -2px -2px 0 #000000,
    0 0 8px 2px rgba(98, 78, 255, 0.35);
}

/* Publication/post/talk list items as inventory slots */
[data-theme="minecraft"] .publication-item,
[data-theme="minecraft"] .post-item,
[data-theme="minecraft"] .talk-item {
  border-bottom: 2px solid #373737;
  border-bottom-style: solid; /* Override any dashed */
  padding: var(--space-md) var(--space-sm);
  position: relative;
}

[data-theme="minecraft"] .publication-item:hover,
[data-theme="minecraft"] .post-item:hover,
[data-theme="minecraft"] .talk-item:hover {
  background: rgba(98, 78, 255, 0.08);
}
```

### Full Button Set

```css
/* Source: Pattern 2 above + INT-01/INT-02/INT-03 requirements */

/* Minecraft stone button — applies to all button-like elements */
[data-theme="minecraft"] .repo-link,
[data-theme="minecraft"] .link-button,
[data-theme="minecraft"] .download-link,
[data-theme="minecraft"] .paper-link a {
  background: var(--mc-bg-stone);
  border: 2px solid #000000;
  box-shadow:
    inset 2px 2px 0 #c6c6c6,
    inset -2px -2px 0 #373737;
  color: var(--mc-text-light) !important;
  text-shadow: 1px 1px 0 #1a1a1a;
  font-family: 'Pixelify Sans', monospace;
  border-radius: 0 !important;
  text-decoration: none;
  display: inline-block;
}

/* Pressed state — shadow inversion (INT-02) */
[data-theme="minecraft"] .repo-link:active,
[data-theme="minecraft"] .link-button:active,
[data-theme="minecraft"] .download-link:active,
[data-theme="minecraft"] .paper-link a:active {
  box-shadow:
    inset 2px 2px 0 #373737,
    inset -2px -2px 0 #c6c6c6;
}

/* Tag pills: same stone button treatment */
[data-theme="minecraft"] .tag {
  background: var(--mc-bg-stone);
  border: 1px solid #000000;
  box-shadow:
    inset 1px 1px 0 #9a9a9a,
    inset -1px -1px 0 #373737;
  color: var(--mc-text-light) !important;
  border-radius: 0 !important;
  text-decoration: none;
}

[data-theme="minecraft"] .tag:hover {
  background: var(--mc-bg-grass);
  border-color: var(--mc-creeper-green);
}

/* Transition guard — reduced motion (INT-03) */
@media (prefers-reduced-motion: no-preference) {
  [data-theme="minecraft"] .repo-link,
  [data-theme="minecraft"] .link-button,
  [data-theme="minecraft"] .download-link,
  [data-theme="minecraft"] .paper-link a,
  [data-theme="minecraft"] .tag {
    transition: box-shadow 80ms ease, background-color 120ms ease;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Image sprites for UI borders | CSS box-shadow inset | 2012 (IE 9+ support) | Zero image assets for 3D bevel; scales at any size |
| JavaScript tooltip libraries | Pure CSS `::after` pseudo-elements | 2015+ (widespread) | No JS dependency; works without any script |
| Separate CSS files per component | Monolithic `[data-theme]` scoped file | LEGO precedent Phase 18-21 | All Minecraft styles in one file; easy to audit and disable |
| `border-image` for custom borders | `box-shadow` multi-value | Always preferable | `border-image` requires image assets; box-shadow is pure CSS |

**Deprecated / outdated in this context:**
- `-moz-box-shadow`: Unprefixed `box-shadow` has 100% browser support since 2012. Do not use prefixed version.
- CSS `filter: drop-shadow()`: Inferior to `box-shadow` for UI bevel effects; `box-shadow` supports `inset`, `filter` does not.
- `outline` for bevel: `outline` renders outside the border-box and doesn't support `inset`; use `box-shadow` instead.

## Open Questions

1. **Should `data-tooltip` attributes be added to Astro component files for CARD-02?**
   - What we know: Pure CSS tooltips using `::after` require `content: attr(data-tooltip)` which needs the attribute on the element. Alternatively, the card hover can show a visual "highlight" glow without text content.
   - What's unclear: Whether the phase scope includes modifying `.astro` component files to add `data-tooltip` attributes.
   - Recommendation: Plan for the visual glow/border effect as the primary deliverable (guaranteed CSS-only). Add a note that `data-tooltip` attributes can be added as a bonus if Astro component modification is acceptable. The success criteria says "hovering a card reveals a Minecraft-style tooltip (dark background, purple border, pixel font)" — this can be interpreted as the card itself changing appearance on hover (inventory slot highlight) which is achievable without `data-tooltip`.

2. **Does `border-radius: 0` need `!important` for button elements?**
   - What we know: Astro scoped styles use attribute selectors that may have equivalent or higher specificity than `[data-theme="minecraft"] .class` selectors.
   - What's unclear: The exact specificity collision will only be visible in browser DevTools at runtime.
   - Recommendation: Use `!important` on `border-radius: 0` for button elements as a defensive measure. Document it clearly in the CSS comment. Revisit in verification phase.

3. **Creeper face SVG: 8x8 or 16x16 pixel representation?**
   - What we know: Existing textures use 16x16 viewBox with individual 1x1 `<rect>` elements per pixel. The Creeper face in-game is an 8x8 face on a 16x16 head sprite.
   - What's unclear: Whether to make the full 16x16 head (green square + face details) or just the 8x8 facial features on a transparent background.
   - Recommendation: Create a 16x16 viewBox SVG with green background (full head square) and face details at appropriate pixel positions. This matches all existing texture files and scales uniformly with `background-size`.

4. **What WCAG contrast does the Minecraft purple tooltip border achieve against dark background?**
   - What we know: The tooltip background is `#100010` (near-black), border is `#2d0a2d` (dark purple). The border itself has no text — it's decorative.
   - What's unclear: Whether the tooltip text (white `#ffffff` on `#100010`) needs recalculation. White on `#100010` is 21:1 — maximum contrast, clearly AA passing.
   - Recommendation: No contrast issue. White on near-black always passes. The purple border is decorative (not text) so WCAG contrast ratio does not apply to it.

## Sources

### Primary (HIGH confidence)

- `/Users/pedf/workspace/bacilo.github.io/src/styles/themes/minecraft.css` — Phase 22 foundation; verified 158 lines of CSS; all `--mc-*` custom properties documented
- `/Users/pedf/workspace/bacilo.github.io/src/styles/themes.css` — LEGO theme component overrides (lines 66-811); direct pattern reference for every component class; Shiki override at lines 869-872
- `/Users/pedf/workspace/bacilo.github.io/.planning/research/ARCHITECTURE.md` — Hotbar, inventory slot, tooltip, stone button CSS patterns (pre-researched 2026-02-18)
- `/Users/pedf/workspace/bacilo.github.io/src/components/Navigation.astro` — Actual nav HTML structure, class names (`nav-list`, `a.active`, `a[aria-current="page"]`)
- `/Users/pedf/workspace/bacilo.github.io/src/components/AuthorSidebar.astro` — Actual sidebar HTML structure, class names (`.author-sidebar`, `.author-photo`, `.author-card`, `.links-list`)
- `/Users/pedf/workspace/bacilo.github.io/src/components/Footer.astro` — Footer HTML structure
- `/Users/pedf/workspace/bacilo.github.io/src/components/ThemeSwitcher.astro` — Theme switcher HTML structure (`.theme-switcher`, `.theme-select`)
- `/Users/pedf/workspace/bacilo.github.io/src/components/portfolio/GitHubCard.astro` — Card HTML structure, class names (`.github-card`, `.repo-link`, `.download-link`, `.card-image`)
- `/Users/pedf/workspace/bacilo.github.io/src/pages/portfolio/index.astro` — Portfolio card class names (`.portfolio-card`, `.link-button`, `.portfolio-grid`)
- [MDN: box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow) — `inset` keyword verified; multiple shadows with comma-separation verified
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) — Media feature for motion guard (INT-03)

### Secondary (MEDIUM confidence)

- [Astro Syntax Highlighting docs](https://docs.astro.build/en/guides/syntax-highlighting/) — `.astro-code` class confirmed; `--shiki-dark` / `--shiki-dark-bg` CSS variable override confirmed; `!important` required for inline Shiki styles
- WebSearch: CSS bevel effects via `inset` box-shadow — multiple sources confirm the light top-left / dark bottom-right pattern for raised 3D effect; inverted for pressed state
- WebSearch: Pure CSS tooltips via `::after` — W3Schools, MDN, and CSS-Tricks all confirm `position: absolute`, `content: attr(data-tooltip)` pattern
- [nikolailehbr.ink CSS button blog](https://www.nikolailehbr.ink/blog/realistic-button-design-css) — Raised/pressed `box-shadow` technique verified: raised = `inset 0 1px highlight`, pressed = inverted shadow

### Tertiary (LOW confidence)

- WebSearch: Minecraft hotbar visual analysis — color values `#c6c6c6` (light gray), `#8b8b8b` (slot gray), `#373737` (dark shadow) derived from prior architecture research and Minecraft Wiki color analysis; not independently re-verified in this session against actual game screenshots

## Metadata

**Confidence breakdown:**
- Standard stack (CSS box-shadow, pseudo-elements): HIGH — MDN-verified, no new packages
- Architecture patterns (all 7 patterns): HIGH — derived from LEGO precedent in codebase + MDN verification
- Component class names: HIGH — read directly from Astro source files
- Pitfalls: HIGH — sourced from Astro specificity behavior (observable) + LEGO implementation patterns
- Creeper face SVG pixel map: MEDIUM — derived from Minecraft Wiki color analysis; verify visually in browser

**Research date:** 2026-02-18
**Valid until:** 2026-03-18 (30 days; CSS/browser behavior is stable)
