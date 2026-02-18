# Phase 22: Visual Foundation - Research

**Researched:** 2026-02-18
**Domain:** CSS pixel-art theming, SVG texture patterns, Fontsource pixel fonts, WCAG contrast
**Confidence:** HIGH

## Summary

Phase 22 establishes the visual foundation that every subsequent Minecraft theme phase depends on. Four domains must be addressed together because they interact: color palette (VIS-01), SVG block textures (VIS-02 + VIS-03), pixel typography (TYPE-01 through TYPE-04), and contrast verification (VIS-04). The palette must be chosen before textures can be colored correctly, fonts must be imported before contrast on textured backgrounds can be measured, and contrast work cannot be deferred to validation.

The codebase already has the scaffolding: a basic `[data-theme="minecraft"]` selector exists in `themes.css` with a placeholder palette, and the LEGO theme (Phases 18-21) established the exact pattern to follow — Fontsource fonts imported in `BaseLayout.astro`, SVG assets in `public/images/{theme}/`, all styles scoped under `[data-theme]`. Phase 22 replaces the placeholder Minecraft palette with a contrast-verified one, creates the 6 block texture SVGs, installs and wires the 3 pixel fonts, and applies the text-shadow and anti-aliasing rules.

The biggest risk in this phase is the conflict between Minecraft's authentic dark/mid-tone palette and WCAG AA requirements. Minecraft's original colors prioritize atmosphere; WCAG requires 4.5:1 contrast. Testing shows the current placeholder grass green (#3c8527) gives only 4.15:1 with the current cream text — just below AA. The fix is to darken semantic background colors (use deeper grass #2f5a1e) or use white (#ffffff) text rather than cream on mid-tone backgrounds. Contrast data is provided per color pair in this document.

**Primary recommendation:** Create `src/styles/themes/minecraft.css`, install 3 Fontsource pixel fonts, create 6 SVG texture files in `public/images/minecraft/textures/`, and wire them all via `[data-theme="minecraft"]` scoped rules. Keep all logic in one CSS file for Phase 22; subsequent phases extend it.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VIS-01 | Site displays Minecraft color palette (dirt brown, grass green, stone gray, sky blue, Creeper green) when Minecraft theme active | CSS custom properties under `[data-theme="minecraft"]` override the existing placeholder palette; 5 semantic Minecraft color variables defined and verified; verified contrast ratios documented per pair |
| VIS-02 | All SVG textures render with crisp pixel edges via `image-rendering: pixelated` at any zoom level | `image-rendering: pixelated` on background-image containers is the correct technique; SVG viewBox must be 16x16 (Minecraft native), scaled up via background-size; Firefox SVG blur issue mitigated by setting explicit width/height on SVG root element; crisp-edges added as cross-browser fallback |
| VIS-03 | Page sections display appropriate block texture SVG backgrounds (dirt, stone, grass, wood, cobblestone, bedrock) | 6 SVG texture files hand-crafted with 16x16 pixel grids; CSS class assignments map textures to page sections (body, header, footer, sidebar, main, cv-section); tile seamlessly via background-repeat: repeat; no seam gaps if SVG dimensions match background-size exactly |
| VIS-04 | WCAG AA contrast ratio (4.5:1) met for all text/background combinations in Minecraft theme | Contrast ratios pre-calculated for all text/background pairs in this phase; color palette adjusted (deeper grass, dark text on stone) to ensure AA compliance; automated checker script pattern from contrast-check.js can be adapted for Minecraft colors |
| TYPE-01 | H1 headings display in Silkscreen pixel font with disabled anti-aliasing | @fontsource/silkscreen v5.2.8 (weights: 400, 700); import 400.css and 700.css in BaseLayout.astro; apply via `[data-theme="minecraft"] h1 { font-family: 'Silkscreen'; -webkit-font-smoothing: none; -moz-osx-font-smoothing: unset; }` |
| TYPE-02 | H2-H3 headings display in Press Start 2P pixel font | @fontsource/press-start-2p v5.2.7 (weight: 400 only — bitmap font has single weight); import default CSS; apply to h2, h3 under [data-theme="minecraft"] scope |
| TYPE-03 | Body text displays in Pixelify Sans at 16px+ for readability | @fontsource/pixelify-sans v5.2.7 (weights: 400-700, variable font available); import 400.css; apply to body under [data-theme="minecraft"] scope at font-size: 16px minimum |
| TYPE-04 | Minecraft-style text shadow (2px 2px dark) applied to headings on textured backgrounds | `text-shadow: 2px 2px 0 #1a1a1a` on h1, h2, h3 under [data-theme="minecraft"]; dark shadow enhances readability of light text on mid-tone textured backgrounds without reducing WCAG technical contrast (shadow is decorative, not background) |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @fontsource/silkscreen | 5.2.8 | H1 pixel font (weights 400, 700) | SIL OFL license, self-hosted via Fontsource pattern already established in LEGO theme |
| @fontsource/press-start-2p | 5.2.7 | H2-H3 pixel font (weight 400 only) | Classic retro game font, single weight (bitmap design), SIL OFL license |
| @fontsource/pixelify-sans | 5.2.7 | Body pixel font (weights 400-700) | Designed for body readability at pixel aesthetic, SIL OFL license, variable font available |
| CSS Custom Properties | Native | Minecraft theme color palette | Follows exact LEGO pattern in themes.css — no new infrastructure needed |
| SVG `<rect>` pixel grids | Native | Block texture patterns | Hand-crafted SVGs ~1KB each; 16x16 viewBox matches Minecraft native texture resolution |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @fontsource-variable/pixelify-sans | 5.2.7 | Variable font weight for Pixelify Sans | Use if font-weight variations are needed in body text; otherwise static 400 is sufficient |
| contrast-check.js (existing) | N/A | WCAG contrast audit script | Adapt the existing LEGO contrast checker for Minecraft color pairs |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fontsource (self-hosted) | Google Fonts CDN | Google Fonts is blocked in some regions; self-hosted maintains our existing pattern and avoids external dependency |
| SVG pixel-grid textures | Raster PNG textures | PNGs are heavier, don't scale at non-standard zoom levels, require resolution-specific variants for Retina; SVGs scale perfectly |
| CSS variables palette | Hardcoded hex values | Variables allow runtime theme switching and future sub-palette variants (Nether, End); consistent with existing theme system |
| Separate minecraft.css file | Add to themes.css | LEGO content in themes.css has grown to 800 lines; Minecraft deserves its own file; import it in BaseLayout.astro like global.css |

**Installation:**

```bash
npm install @fontsource/silkscreen @fontsource/press-start-2p @fontsource/pixelify-sans
```

## Architecture Patterns

### Recommended File Structure

```
src/
├── styles/
│   ├── global.css                    # Untouched
│   ├── themes.css                    # Replace placeholder [data-theme="minecraft"] block
│   └── themes/
│       └── minecraft.css             # NEW: All Minecraft-scoped styles (Phase 22+)
├── layouts/
│   └── BaseLayout.astro              # MODIFIED: Add 3 Fontsource imports + minecraft.css import
public/
└── images/
    └── minecraft/
        └── textures/                 # NEW: 6 SVG block textures
            ├── dirt.svg
            ├── stone.svg
            ├── grass.svg
            ├── wood.svg
            ├── cobblestone.svg
            └── bedrock.svg
```

The `src/styles/themes/` directory does not yet exist — create it. Import `minecraft.css` in BaseLayout.astro alongside `themes.css`. The basic `[data-theme="minecraft"]` block in `themes.css` should be replaced or its palette variables overridden by the new file's more specific selectors.

### Pattern 1: Minecraft Color Palette via CSS Custom Properties

**What:** Override the existing placeholder Minecraft palette with a contrast-verified set of Minecraft colors, defined as named custom properties under `[data-theme="minecraft"]`.

**When to use:** All Phase 22 color decisions.

```css
/* src/styles/themes/minecraft.css */
/* Source: color values derived from Minecraft Wiki block textures + WCAG AA contrast verification */

[data-theme="minecraft"] {
  /* Primary Minecraft block colors */
  --mc-dirt-brown: #866043;        /* Dirt block dominant tone */
  --mc-grass-green: #5a8a2f;       /* Grass top (mid-bright) */
  --mc-stone-gray: #8b8b8b;        /* Stone block gray */
  --mc-sky-blue: #64b8d4;          /* Daytime sky blue */
  --mc-creeper-green: #55a715;     /* Creeper face green */

  /* Semantic background colors — adjusted for AA compliance */
  --mc-bg-grass: #2f5a1e;          /* Deep grass (body bg): 8.07:1 vs white */
  --mc-bg-stone: #6b6b6b;          /* Darker stone (panels): 5.33:1 vs white */
  --mc-bg-dark: #1a1a1a;           /* Dark panels/inventory: 17.40:1 vs white */
  --mc-bg-darkest: #0d0d0d;        /* Darkest bg: 6.41:1 vs creeper green */
  --mc-bg-dirt: #614228;           /* Darker dirt: 9.06:1 vs white */

  /* Text colors */
  --mc-text-light: #ffffff;        /* Primary text on dark/mid backgrounds */
  --mc-text-cream: #f5f5dc;        /* Secondary text (warm white) on dark backgrounds */
  --mc-text-muted: #c8c8c8;        /* Muted text on dark backgrounds */
  --mc-text-dark: #1a1a1a;         /* Dark text on light/stone gray backgrounds */

  /* Semantic theme variable overrides (used by existing components) */
  --color-bg: var(--mc-bg-grass);
  --color-text: var(--mc-text-light);
  --color-text-muted: var(--mc-text-muted);
  --color-link: var(--mc-sky-blue);
  --color-link-hover: #87ceeb;
  --color-border: var(--mc-dirt-brown);
  --color-header-bg: var(--mc-bg-dirt);
}
```

### Pattern 2: Pixel-Crisp SVG Block Texture

**What:** Hand-crafted 16x16 SVG pixel grids scaled up as CSS background-images, rendered without anti-aliasing via `image-rendering: pixelated`.

**When to use:** All 6 block texture backgrounds.

**Critical detail:** The SVG root element MUST have explicit `width="16" height="16"` attributes (not just `viewBox`). Without these, Firefox rasterizes at an unexpected size and then scales blurrily. Setting `image-rendering: pixelated` on the container element handles the scale-up step.

```svg
<!-- public/images/minecraft/textures/dirt.svg -->
<!-- Source: Minecraft block texture color analysis -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <!-- Base dirt brown -->
  <rect width="16" height="16" fill="#866043"/>
  <!-- Darker brown variation pixels -->
  <rect x="2" y="1" width="1" height="1" fill="#6b4c33"/>
  <rect x="7" y="2" width="1" height="1" fill="#6b4c33"/>
  <rect x="11" y="4" width="1" height="1" fill="#6b4c33"/>
  <rect x="4" y="6" width="1" height="1" fill="#6b4c33"/>
  <rect x="9" y="8" width="1" height="1" fill="#6b4c33"/>
  <rect x="1" y="10" width="1" height="1" fill="#6b4c33"/>
  <rect x="13" y="12" width="1" height="1" fill="#6b4c33"/>
  <!-- Lighter tan highlight pixels -->
  <rect x="5" y="3" width="1" height="1" fill="#9a7352"/>
  <rect x="12" y="7" width="1" height="1" fill="#9a7352"/>
  <rect x="3" y="13" width="1" height="1" fill="#9a7352"/>
  <rect x="8" y="15" width="1" height="1" fill="#9a7352"/>
</svg>
```

```css
/* CSS for pixelated rendering */
[data-theme="minecraft"] body {
  background-image: url('/images/minecraft/textures/dirt.svg');
  background-size: 64px 64px;  /* Scale 16px SVG 4x to 64px */
  background-repeat: repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges; /* Firefox fallback */
}
```

**Background size rule:** Always use `background-size` in integer multiples of the SVG's native size. For a 16px SVG: valid sizes are 16px, 32px, 48px, 64px, 80px. Never use percentages or fractional sizes.

### Pattern 3: Pixel Font Import and Anti-Aliasing Disable

**What:** Import Fontsource pixel fonts in BaseLayout.astro and apply them with disabled anti-aliasing inside `[data-theme="minecraft"]` scope only.

**When to use:** All typography in Minecraft theme.

**BaseLayout.astro additions:**

```javascript
// Add after existing LEGO font imports
import '@fontsource/silkscreen/400.css';
import '@fontsource/silkscreen/700.css';
import '@fontsource/press-start-2p';       // Weight 400 only (bitmap font)
import '@fontsource/pixelify-sans/400.css';
import '../styles/themes/minecraft.css';   // New Minecraft theme file
```

**CSS font rules:**

```css
/* src/styles/themes/minecraft.css */

/* Typography hierarchy — scoped to Minecraft theme only */
[data-theme="minecraft"] body {
  font-family: 'Pixelify Sans', monospace;
  font-size: 16px;   /* Minimum for Pixelify Sans readability */
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
}

[data-theme="minecraft"] h1 {
  font-family: 'Silkscreen', monospace;
  font-weight: 700;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  text-shadow: 2px 2px 0 #1a1a1a;  /* TYPE-04: Minecraft text shadow */
}

[data-theme="minecraft"] h2,
[data-theme="minecraft"] h3 {
  font-family: 'Press Start 2P', monospace;
  font-weight: 400;  /* Only weight available */
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  text-shadow: 2px 2px 0 #1a1a1a;  /* TYPE-04: Minecraft text shadow */
}
```

**Critical note on font-smoothing scope:** `-webkit-font-smoothing: none` is macOS-only (WebKit/Blink) and NOT a formal CSS standard. Apply it ONLY inside `[data-theme="minecraft"]` scope. Do not set it globally. The property has no effect on Windows Chrome or Firefox Windows — those platforms do not have sub-pixel antialiasing in the same way. The visual result is still pixel-crisp on those platforms due to font design, just without this property.

### Pattern 4: Section-Specific Block Texture Assignment

**What:** Map different block textures to different page sections to create the Minecraft world layer effect (grass on top, stone in middle, bedrock at bottom).

**When to use:** VIS-03 section texture assignment.

```css
/* Source: Minecraft world layer visual logic */

/* Page body: grass block (overworld surface) */
[data-theme="minecraft"] body {
  background-image: url('/images/minecraft/textures/grass.svg');
  background-size: 64px 64px;
  background-repeat: repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* Site header: dirt block (just below surface) */
[data-theme="minecraft"] .site-header {
  background-image: url('/images/minecraft/textures/dirt.svg');
  background-size: 64px 64px;
  background-repeat: repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* Navigation bar: stone block (underground) */
[data-theme="minecraft"] nav {
  background-image: url('/images/minecraft/textures/stone.svg');
  background-size: 64px 64px;
  background-repeat: repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* Author sidebar: wood planks (structure/building) */
[data-theme="minecraft"] .author-sidebar {
  background-image: url('/images/minecraft/textures/wood.svg');
  background-size: 64px 64px;
  background-repeat: repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* Main content: cobblestone (worked stone) */
[data-theme="minecraft"] main {
  background-image: url('/images/minecraft/textures/cobblestone.svg');
  background-size: 64px 64px;
  background-repeat: repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  /* Semi-transparent overlay to not overwhelm content readability */
  background-blend-mode: normal;
}

/* Footer: bedrock (bottom of world) */
[data-theme="minecraft"] footer {
  background-image: url('/images/minecraft/textures/bedrock.svg');
  background-size: 64px 64px;
  background-repeat: repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

**Readability concern:** Highly detailed textures behind body text can hurt readability. Mitigation options: (1) use `background-color` + `background-blend-mode: multiply` at reduced opacity; (2) add a semi-transparent overlay div behind text content; (3) use textures only on structural elements (header, footer, nav) and use solid background-color for main content area. Recommended: use solid `var(--mc-bg-grass)` for main content area and reserve textures for structural elements.

### Anti-Patterns to Avoid

- **Global font-smoothing:** Never set `-webkit-font-smoothing: none` outside `[data-theme="minecraft"]` scope — it will affect all themes.
- **Percentage background-size for textures:** `background-size: 100%` causes scaling artifacts; always use explicit pixel values.
- **viewBox without width/height on SVG:** Firefox renders blurrily without explicit intrinsic dimensions on the SVG root element.
- **Fractional pixel font sizes:** Pixel fonts at 15.5px or 1.1rem (resolves to 17.6px) look wrong. Use integer pixel values: 16px, 24px, 32px.
- **Unscoped CSS rules:** Every single Minecraft style must be inside `[data-theme="minecraft"]`. No exceptions. Test by switching to light theme after every batch of changes.
- **White text on medium stone gray (#8b8b8b):** Contrast ratio is only 3.41:1 — passes AA Large only. Use dark text (#1a1a1a, 5.11:1) on this background for body text, or use a darker stone gray (#6b6b6b, 5.33:1 with white).
- **Textures on main text content:** Tiled SVG textures under paragraphs of body text are distracting and reduce readability. Reserve textures for structural elements; use solid Minecraft colors behind text content.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Self-hosted pixel fonts | Custom @font-face declarations pointing to downloaded .woff2 files | Fontsource packages (`@fontsource/silkscreen`) | Fontsource handles @font-face, subsetting, WOFF2, caching headers, version management |
| Contrast ratio calculation | Custom luminance/ratio math | The existing `contrast-check.js` script (already in repo root) | Pattern already proven for LEGO; adapt color definitions, not the algorithm |
| CSS pixel-grid backgrounds | Canvas/WebGL rendering | SVG `<rect>` elements with `image-rendering: pixelated` | CSS-only maintains the no-JS theme pattern; SVG is ~1KB vs JS overhead |
| Minecraft-color palette research | Sampling screenshots | The documented color values in this file | Colors are pre-verified for WCAG AA compliance |

**Key insight:** This phase is CSS + SVG only — zero JavaScript, zero new runtime dependencies beyond Fontsource packages which are tree-shaken at build time into static CSS and WOFF2 files.

## Common Pitfalls

### Pitfall 1: SVG Texture Blur in Firefox

**What goes wrong:** Firefox rasterizes SVG background-images at the SVG's intrinsic size before applying `background-size`, then scales the rasterized bitmap — resulting in blur.

**Why it happens:** Firefox bug: when SVG width/height attributes are absent, Firefox assumes a 300x150 default canvas, then scales down to the specified background-size. The small raster gets scaled up and blurs.

**How to avoid:** Always set explicit `width` and `height` attributes on the SVG root element matching the viewBox dimensions:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
```

**Warning signs:** Textures look sharp in Chrome/Safari but fuzzy in Firefox.

### Pitfall 2: Pixel Font Anti-Aliasing Fails Silently on Windows

**What goes wrong:** `-webkit-font-smoothing: none` has no effect on Windows Chrome or Firefox. Fonts may still appear anti-aliased on Windows.

**Why it happens:** `-webkit-font-smoothing` is macOS-only. Windows fonts are rendered by DirectWrite which has its own smoothing system not controlled by this CSS property.

**How to avoid:** Choose fonts (Silkscreen, Press Start 2P) that are designed as bitmap fonts — their letterforms are inherently crisp at their designed sizes regardless of OS-level anti-aliasing. Test on Windows in addition to macOS.

**Warning signs:** Fonts look crisp in macOS Chrome but slightly fuzzy on Windows Chrome.

### Pitfall 3: Current Placeholder Palette Does Not Pass WCAG AA for Body Text

**What goes wrong:** The existing `[data-theme="minecraft"]` in `themes.css` sets `--color-bg: #3c8527` and `--color-text: #f5f5dc`. Contrast ratio is 4.15:1 — below 4.5:1 AA for normal text.

**Why it happens:** The placeholder palette was a quick approximation, not contrast-verified.

**How to avoid:** Replace the placeholder palette with the contrast-verified palette defined in Pattern 1 above. The new `--color-bg` uses `#2f5a1e` (deeper grass, 8.07:1 vs white).

**Warning signs:** Running `node contrast-check.js` (adapted for Minecraft) shows sub-4.5:1 ratios.

### Pitfall 4: Text-Shadow Does Not Improve WCAG Contrast Ratio

**What goes wrong:** Developer adds `text-shadow: 2px 2px 0 #000000` thinking it improves the contrast ratio for WCAG purposes.

**Why it happens:** It's an intuitive assumption — a dark shadow behind light text should help readability, so it should count for contrast.

**How to avoid:** WCAG contrast ratio is measured on the direct text color vs. direct background color, not including shadow or decorative effects. The shadow at offset (2px, 2px) does not sit behind the text letterforms. Choose color pairs that pass 4.5:1 independently, then add text-shadow as TYPE-04's decorative requirement on top.

**Warning signs:** Contrast checker tool shows fail even though text appears readable visually.

### Pitfall 5: Textures on Text Content Break Readability

**What goes wrong:** Tiled pixel-art textures under paragraphs of body text (publications list, blog posts) compete visually with text, causing eye fatigue.

**Why it happens:** Block textures are designed as world decoration, not as text backgrounds. Their visual complexity interferes with letter recognition.

**How to avoid:** Use solid Minecraft palette colors (`var(--mc-bg-grass)`) as the background-color on main content areas. Reserve textures for structural non-text elements: site-header, nav, footer. Use a solid-color card/panel over the textured body for text content.

**Warning signs:** Body text is hard to read even when contrast ratio is technically passing.

### Pitfall 6: Fontsource Font Files Load for Non-Minecraft Themes

**What goes wrong:** Silkscreen, Press Start 2P, and Pixelify Sans WOFF2 files load on every page, even when the user has never selected the Minecraft theme.

**Why it happens:** Fontsource CSS files declare `@font-face` unconditionally — the browser fetches WOFF2 files when it encounters the declaration, regardless of whether the font is actually used.

**How to avoid:** Astro's bundler will include these CSS imports in the built output on all pages. This is acceptable (~60KB WOFF2 total, lighter than LEGO at 170KB). The WOFF2 files are cached after first load. This matches the LEGO theme pattern. If performance becomes a concern, use dynamic import or a lazy-load strategy, but for Phase 22 the ~60KB overhead is within the stated performance budget.

**Warning signs:** Lighthouse FCP impact exceeds +65ms baseline.

## Code Examples

Verified patterns from testing and official sources:

### Complete Minecraft CSS Variable Block

```css
/* src/styles/themes/minecraft.css */
/* Replaces the placeholder [data-theme="minecraft"] block in themes.css */

[data-theme="minecraft"] {
  /* Minecraft block palette */
  --mc-dirt-brown: #866043;
  --mc-grass-green: #5a8a2f;
  --mc-stone-gray: #8b8b8b;
  --mc-sky-blue: #64b8d4;
  --mc-creeper-green: #55a715;

  /* Adjusted semantic backgrounds (WCAG AA verified) */
  --mc-bg-grass: #2f5a1e;    /* 8.07:1 vs white */
  --mc-bg-stone: #6b6b6b;    /* 5.33:1 vs white */
  --mc-bg-dark: #1a1a1a;     /* 17.40:1 vs white */
  --mc-bg-dirt: #614228;     /* 9.06:1 vs white */

  /* Text colors */
  --mc-text-light: #ffffff;
  --mc-text-cream: #f5f5dc;
  --mc-text-muted: #c8c8c8;
  --mc-text-dark: #1a1a1a;   /* 5.11:1 vs stone gray #8b8b8b */

  /* Semantic CSS variable overrides */
  --color-bg: var(--mc-bg-grass);
  --color-text: var(--mc-text-light);
  --color-text-muted: var(--mc-text-muted);
  --color-link: var(--mc-sky-blue);
  --color-link-hover: #87ceeb;
  --color-border: var(--mc-dirt-brown);
  --color-header-bg: var(--mc-bg-dirt);
}
```

### Dirt SVG Texture (Minimal Working Example)

```svg
<!-- public/images/minecraft/textures/dirt.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <rect width="16" height="16" fill="#866043"/>
  <rect x="2" y="1" width="2" height="1" fill="#6b4c33"/>
  <rect x="7" y="3" width="1" height="2" fill="#6b4c33"/>
  <rect x="11" y="1" width="1" height="1" fill="#9a7352"/>
  <rect x="4" y="5" width="2" height="1" fill="#6b4c33"/>
  <rect x="13" y="7" width="2" height="1" fill="#9a7352"/>
  <rect x="1" y="9" width="1" height="2" fill="#6b4c33"/>
  <rect x="8" y="11" width="2" height="1" fill="#9a7352"/>
  <rect x="3" y="13" width="1" height="1" fill="#6b4c33"/>
  <rect x="14" y="14" width="2" height="2" fill="#9a7352"/>
</svg>
```

### Grass Block SVG Texture

```svg
<!-- public/images/minecraft/textures/grass.svg -->
<!-- Top face of grass block: green top layer with dirt variation underneath -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <!-- Base grass green -->
  <rect width="16" height="16" fill="#5a8a2f"/>
  <!-- Darker green variation -->
  <rect x="2" y="2" width="2" height="1" fill="#4a7525"/>
  <rect x="9" y="1" width="1" height="2" fill="#4a7525"/>
  <rect x="5" y="7" width="2" height="1" fill="#4a7525"/>
  <rect x="12" y="9" width="1" height="1" fill="#4a7525"/>
  <!-- Lighter green highlight -->
  <rect x="6" y="4" width="1" height="1" fill="#6da33a"/>
  <rect x="1" y="12" width="2" height="1" fill="#6da33a"/>
  <rect x="11" y="14" width="2" height="1" fill="#6da33a"/>
</svg>
```

### Stone Block SVG Texture

```svg
<!-- public/images/minecraft/textures/stone.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <rect width="16" height="16" fill="#8b8b8b"/>
  <rect x="3" y="1" width="2" height="1" fill="#6b6b6b"/>
  <rect x="10" y="3" width="1" height="2" fill="#6b6b6b"/>
  <rect x="1" y="7" width="3" height="1" fill="#6b6b6b"/>
  <rect x="7" y="5" width="2" height="1" fill="#6b6b6b"/>
  <rect x="13" y="9" width="2" height="1" fill="#6b6b6b"/>
  <rect x="4" y="12" width="1" height="2" fill="#6b6b6b"/>
  <rect x="9" y="14" width="3" height="1" fill="#6b6b6b"/>
  <!-- Lighter highlights -->
  <rect x="6" y="2" width="1" height="1" fill="#a5a5a5"/>
  <rect x="14" y="6" width="1" height="1" fill="#a5a5a5"/>
  <rect x="2" y="11" width="1" height="1" fill="#a5a5a5"/>
</svg>
```

### Bedrock SVG Texture

```svg
<!-- public/images/minecraft/textures/bedrock.svg -->
<!-- Bedrock: dark base with gray geometric shapes -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <rect width="16" height="16" fill="#191919"/>
  <!-- Lighter gray patches -->
  <rect x="1" y="1" width="3" height="2" fill="#404040"/>
  <rect x="7" y="2" width="2" height="3" fill="#404040"/>
  <rect x="12" y="1" width="3" height="2" fill="#404040"/>
  <rect x="2" y="6" width="2" height="3" fill="#404040"/>
  <rect x="9" y="7" width="3" height="2" fill="#404040"/>
  <rect x="4" y="11" width="3" height="2" fill="#404040"/>
  <rect x="12" y="12" width="3" height="2" fill="#404040"/>
  <rect x="0" y="14" width="2" height="2" fill="#404040"/>
</svg>
```

### Adapted Contrast Check Script

```javascript
// Extend contrast-check.js for Minecraft palette
// Run: node contrast-check.js

const colors = {
  white: '#ffffff',
  cream: '#f5f5dc',
  muted: '#c8c8c8',
  dark: '#1a1a1a',
  grassBg: '#2f5a1e',
  stoneBg: '#6b6b6b',
  darkBg: '#1a1a1a',
  dirtBg: '#614228',
  skyBlue: '#64b8d4',
  creeperGreen: '#55a715',
};

// Critical pairs to verify (must all pass 4.5:1 for AA):
// white on grassBg = 8.07:1 PASS
// cream on grassBg = 7.29:1 PASS
// white on dirtBg = 9.06:1 PASS
// white on darkBg = 17.40:1 PASS
// dark on stoneBg = 5.11:1 PASS
// white on stoneBg = 5.33:1 PASS
// skyBlue on darkBg = 7.75:1 PASS
// creeperGreen on darkBg = 5.74:1 PASS
```

### Font Import in BaseLayout.astro

```javascript
// Add to BaseLayout.astro frontmatter imports
// Place after existing LEGO Fontsource imports
import '@fontsource/silkscreen/400.css';      // H1 normal weight
import '@fontsource/silkscreen/700.css';      // H1 bold weight
import '@fontsource/press-start-2p';          // H2-H3 (400 weight only)
import '@fontsource/pixelify-sans/400.css';   // Body text
import '../styles/themes/minecraft.css';      // Minecraft theme overrides
```

## WCAG Contrast Reference Table

Pre-calculated contrast ratios for the proposed Minecraft palette. All normal-text combinations must pass 4.5:1.

| Foreground | Background | Hex BG | Ratio | WCAG Result | Usage |
|------------|-----------|--------|-------|-------------|-------|
| White #fff | Grass bg | #2f5a1e | 8.07:1 | PASS AA | Body text on page bg |
| Cream #f5f5dc | Grass bg | #2f5a1e | 7.29:1 | PASS AA | Secondary text on page bg |
| White #fff | Dirt bg | #614228 | 9.06:1 | PASS AA | Header text on dirt texture |
| White #fff | Dark bg | #1a1a1a | 17.40:1 | PASS AA | Text on dark panels |
| Cream #f5f5dc | Dark bg | #1a1a1a | 15.73:1 | PASS AA | Secondary text on dark panels |
| White #fff | Stone bg | #6b6b6b | 5.33:1 | PASS AA | Text on nav/stone gray |
| Dark #1a1a1a | Stone gray | #8b8b8b | 5.11:1 | PASS AA | Dark text on lighter stone |
| Sky blue #64b8d4 | Dark bg | #1a1a1a | 7.75:1 | PASS AA | Link text on dark bg |
| Creeper green #55a715 | Dark bg | #1a1a1a | 5.74:1 | PASS AA | Accent/link text on dark |
| XP green #7fcc19 | Dark bg | #1a1a1a | 8.75:1 | PASS AA | XP accent on dark bg |

**Pairs that FAIL and must NOT be used for body text:**
- White on #8b8b8b (standard stone gray): 3.41:1 — AA Large only
- White on #3c8527 (original placeholder green): 4.59:1 — narrow pass only
- Muted #8b8b8b on grass bg: 2.37:1 — FAIL

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Raster PNG textures for pixel art | SVG with `image-rendering: pixelated` | ~2018 (broad browser support) | Scales perfectly at any zoom/DPI without file size penalty |
| Google Fonts CDN | Self-hosted via Fontsource | ~2020 | Privacy, no external dependency, same WOFF2 quality |
| `-webkit-font-smoothing: antialiased` everywhere | Scoped `none` for pixel fonts only | Always best practice | Prevents global side effects |
| `crisp-edges` for image rendering | `pixelated` (primary) + `crisp-edges` (fallback) | 2018 when `pixelated` became standard | `pixelated` = nearest-neighbor (correct); `crisp-edges` = browser-defined (varies) |

**Deprecated/outdated:**
- `font-smooth: never` — Non-standard property, use `-webkit-font-smoothing: none` + `-moz-osx-font-smoothing: unset`
- `background-size: auto auto` — Does not trigger nearest-neighbor; must specify explicit pixel values for crisp textures
- Minecraft copyrighted font files — Do not use. Use Silkscreen/Press Start 2P (open-source, SIL OFL).

## Open Questions

1. **Readability of textured main content area**
   - What we know: Tiled textures under body text reduce readability
   - What's unclear: Whether to use textures on `.content` / `main` at all, or solid Minecraft colors
   - Recommendation: Use solid `var(--mc-bg-grass)` for main content area; reserve textures for structural chrome. Planner should design this as a decision point.

2. **Replacing placeholder palette in themes.css vs. overriding it**
   - What we know: `themes.css` contains a basic `[data-theme="minecraft"]` block that needs replacing
   - What's unclear: Whether to delete the block from `themes.css` or override it in `minecraft.css`
   - Recommendation: Delete the placeholder block from `themes.css` and own the palette fully in `minecraft.css`. This avoids specificity conflicts and is cleaner. Document the deletion in the plan.

3. **Press Start 2P readability at small sizes**
   - What we know: Press Start 2P at 8px or 10px becomes unreadable
   - What's unclear: What minimum size to enforce for H3 headings in sidebar or compact views
   - Recommendation: Set minimum `font-size: 14px` on H3 when using Press Start 2P; accept that some compact layouts may need to use Pixelify Sans as fallback for very small heading text.

## Sources

### Primary (HIGH confidence)

- npm registry — `@fontsource/silkscreen` v5.2.8, `@fontsource/press-start-2p` v5.2.7, `@fontsource/pixelify-sans` v5.2.7 — package metadata verified via `npm info`
- `/Users/pedf/workspace/bacilo.github.io/contrast-check.js` — WCAG luminance algorithm; all contrast ratios in this document computed using this exact implementation
- `/Users/pedf/workspace/bacilo.github.io/src/styles/themes.css` — Confirmed existing `[data-theme="minecraft"]` placeholder palette; confirmed LEGO pattern (`:root[data-theme="lego"]` selectors, Fontsource imports)
- `/Users/pedf/workspace/bacilo.github.io/src/layouts/BaseLayout.astro` — Confirmed Fontsource import pattern and theme CSS import location
- [MDN: Crisp pixel art look](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look) — `image-rendering: pixelated` is the correct approach
- [MDN: image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering) — `pixelated` + `crisp-edges` fallback pattern
- `.planning/research/STACK.md`, `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md` — Prior Minecraft theme research (all HIGH confidence, researched 2026-02-18)

### Secondary (MEDIUM confidence)

- WebSearch: Fontsource Silkscreen "supports weights [400, 700]" — confirmed via npm metadata showing 57.1KB package (consistent with 2-weight set)
- WebSearch: Press Start 2P "weight 400 is the only available weight" — bitmap font design confirmed; 87.9KB package for single weight is expected for bitmap font WOFF2 coverage
- [Firefox bugzilla #600207](https://bugzilla.mozilla.org/show_bug.cgi?id=600207) — SVG-as-image tiling blur bug; mitigation is explicit width/height on SVG root

### Tertiary (LOW confidence)

- WebSearch: macOS-only scope of `-webkit-font-smoothing: none` — multiple sources agree, but not tested on production Windows Chrome in this research session

## Metadata

**Confidence breakdown:**
- Color palette with contrast ratios: HIGH — ratios computed using the existing codebase's WCAG formula
- Fontsource font packages: HIGH — verified via npm info
- SVG texture pattern approach: HIGH — matches LEGO pattern already in production + MDN verified
- Anti-aliasing CSS: MEDIUM — `-webkit-font-smoothing: none` behavior on Windows is not directly testable in research
- Pitfalls: HIGH — sourced from existing `.planning/research/PITFALLS.md` which was written from prior research

**Research date:** 2026-02-18
**Valid until:** 2026-03-18 (30 days; stable CSS/npm ecosystem)
