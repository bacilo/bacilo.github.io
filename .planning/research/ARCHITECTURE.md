# Architecture Research: Immersive Minecraft Theme

**Domain:** Immersive Minecraft CSS theme integration
**Researched:** 2026-02-18
**Confidence:** HIGH

## Existing Architecture (from LEGO immersive)

The LEGO theme established the immersive pattern:
- **Theme CSS file** (`src/styles/themes/lego.css`): Colors, variables, component overrides
- **Component-scoped** `[data-theme="lego"]` selectors: Zero leakage to other themes
- **Fontsource fonts** imported in layout: Fredoka, Slackey, Baloo 2
- **SVG assets** in `public/images/lego/`: 11 files, ~15KB total
- **CSS pseudo-elements** for decorative studs
- **28 files modified** total

## Minecraft Theme Integration

### New Files

| File | Purpose | Size Est. |
|------|---------|-----------|
| `src/styles/themes/minecraft.css` | All Minecraft theme styles | ~12KB |
| `public/images/minecraft/*.svg` | 16+ SVG assets | ~11KB total |
| Font imports in layout | Silkscreen, Press Start 2P, Pixelify Sans | Fontsource packages |

### Modified Files (Component Overrides)

Following the LEGO pattern, these components get `[data-theme="minecraft"]` scoped styles:

| File | Modification | Approach |
|------|-------------|----------|
| `src/components/Navigation.astro` | Hotbar styling with slot borders | Scoped `<style>` block with [data-theme] |
| `src/components/AuthorSidebar.astro` | Inventory panel, Creeper face | Scoped `<style>` block |
| `src/components/Footer.astro` | Bedrock texture footer | Scoped `<style>` block |
| `src/components/ThemeSwitcher.astro` | Minecraft-style dropdown | Scoped `<style>` block |
| `src/layouts/BaseLayout.astro` | Font imports, body background | Import Fontsource + theme CSS |
| `src/pages/*.astro` (various) | Page-level backgrounds, section textures | Scoped styles per page |
| Portfolio components | Inventory card styling | Scoped `<style>` blocks |

### SVG Asset Organization

```
public/images/minecraft/
├── textures/           # Tileable block patterns
│   ├── dirt.svg
│   ├── grass-top.svg
│   ├── stone.svg
│   ├── cobblestone.svg
│   ├── oak-planks.svg
│   └── bedrock.svg
├── ui/                 # Game UI elements
│   ├── hotbar-slot.svg
│   ├── inventory-slot.svg
│   ├── tooltip-border.svg
│   └── heart.svg
├── icons/              # Decorative icons
│   ├── creeper-face.svg
│   ├── sword.svg
│   ├── pickaxe.svg
│   └── xp-orb.svg
└── mobs/               # Mob silhouettes
    ├── zombie.svg
    ├── enderman.svg
    └── chicken.svg
```

**Referencing strategy:** CSS `background-image: url('/images/minecraft/textures/dirt.svg')` with `image-rendering: pixelated`. All SVGs use pixel-grid viewBox (16x16) scaled up via CSS.

## Architectural Patterns

### Pattern 1: Pixel-Art SVG Textures

**What:** Create tileable SVG patterns that look like Minecraft block textures at any scale.

**Approach:** SVGs use a 16x16 viewBox (matching Minecraft's texture resolution). Each "pixel" is a `<rect>` element. CSS scales them up with `image-rendering: pixelated` to maintain crisp edges.

```svg
<!-- dirt.svg — 16x16 pixel grid -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <rect width="16" height="16" fill="#866043"/>
  <rect x="2" y="3" width="1" height="1" fill="#6b4c33"/>
  <rect x="7" y="1" width="1" height="1" fill="#6b4c33"/>
  <!-- ... more variation pixels ... -->
</svg>
```

```css
[data-theme="minecraft"] .dirt-bg {
  background-image: url('/images/minecraft/textures/dirt.svg');
  background-size: 64px 64px; /* Scale 16px SVG to 64px */
  background-repeat: repeat;
  image-rendering: pixelated;
}
```

**Why SVG over PNG:** Scales perfectly at any resolution, smaller file size, can be color-themed via CSS variables if needed, no retina display issues.

### Pattern 2: Hotbar Navigation

**What:** Navigation bar styled as Minecraft hotbar — 9 slots with raised borders, selected item highlighted.

**Approach:** Each nav link becomes a "slot" with:
- Dark background (#8b8b8b outer, #c6c6c6 inner)
- 3D border effect (light top/left, dark bottom/right) — classic Minecraft UI bevel
- Selected item: lighter background + hotbar selector bracket

```css
[data-theme="minecraft"] .nav-list {
  background: #c6c6c6;
  border: 2px solid #000;
  box-shadow:
    inset 2px 2px 0 #fff,      /* top-left highlight */
    inset -2px -2px 0 #555;    /* bottom-right shadow */
  padding: 4px;
  gap: 2px;
}

[data-theme="minecraft"] .nav-list a {
  background: #8b8b8b;
  border: 1px solid #373737;
  padding: 6px 12px;
  color: #fff;
  text-shadow: 2px 2px 0 #3f3f3f; /* Minecraft text shadow */
}

[data-theme="minecraft"] .nav-list a.active {
  background: #c6c6c6;
  border-color: #fff;
  box-shadow: inset 0 0 0 1px #fff;
}
```

### Pattern 3: Inventory Card Styling

**What:** Content cards styled as Minecraft inventory slots.

**Approach:** Cards get the classic inventory slot appearance:
- Outer border: dark (#373737)
- Inner bevel: light top-left (#8b8b8b), dark bottom-right (#000)
- Background: dark gray (#2d2d2d) or section-appropriate texture

```css
[data-theme="minecraft"] .card {
  background: #2d2d2d;
  border: 2px solid #000;
  box-shadow:
    inset 2px 2px 0 #8b8b8b,
    inset -2px -2px 0 #373737;
  padding: 8px;
}
```

### Pattern 4: Minecraft Tooltip

**What:** Hover tooltips matching Minecraft's in-game tooltip style.

**Approach:** Dark background with purple/magenta gradient border, pixel font text.

```css
[data-theme="minecraft"] [data-tooltip]:hover::after {
  content: attr(data-tooltip);
  background: #100010;
  border: 2px solid #2d0a2d;
  outline: 2px solid #28002e;
  color: #fff;
  font-family: 'Silkscreen', monospace;
  font-size: 12px;
  padding: 4px 8px;
  position: absolute;
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
}
```

### Pattern 5: Stone Button Styling

**What:** Interactive elements styled as Minecraft stone buttons.

**Approach:** Raised 3D look using Minecraft's characteristic bevel borders. Pressed state inverts the bevel.

```css
[data-theme="minecraft"] .btn,
[data-theme="minecraft"] a.btn-link {
  background: #8b8b8b;
  border: 2px solid #000;
  box-shadow:
    inset 2px 2px 0 #c6c6c6,
    inset -2px -2px 0 #555;
  color: #e0e0e0;
  text-shadow: 2px 2px 0 #3f3f3f;
  font-family: 'Silkscreen', monospace;
  padding: 6px 16px;
  cursor: pointer;
}

[data-theme="minecraft"] .btn:active {
  box-shadow:
    inset -2px -2px 0 #c6c6c6,
    inset 2px 2px 0 #555;
  padding: 8px 14px 4px 18px; /* Shift text on press */
}
```

## Build Order

Based on dependencies:

1. **Color palette + CSS variables** — Foundation for everything
2. **SVG asset creation** — Textures and icons needed by subsequent phases
3. **Pixel font integration** — Typography affects all text elements
4. **Background textures** — Body, sections, page backgrounds
5. **Component transforms** — Nav (hotbar), cards (inventory), sidebar, footer
6. **Interactive elements** — Buttons, tooltips, hover effects, animations
7. **Validation** — Contrast, mobile, cross-browser, performance

**Dependency chain:**
- Fonts → Nav labels, Tooltips, Buttons
- SVG textures → Backgrounds, Borders, Footer
- Color palette → Everything
- Component structure → Hotbar depends on nav, Inventory depends on cards

## Data Flow: Theme Activation

```
User selects "Minecraft" theme
    ↓
localStorage.setItem('site-theme', 'minecraft')
    ↓
document.documentElement.setAttribute('data-theme', 'minecraft')
    ↓
[data-theme="minecraft"] selectors activate
    ↓
├── Pixel fonts apply (Silkscreen, Press Start 2P, Pixelify Sans)
├── Color palette overrides (browns, grays, greens)
├── SVG textures load as backgrounds
├── Component overrides render (hotbar, inventory, tooltips)
└── Animations enable (reduced-motion respected)
```

## Scaling: Future Immersive Themes

The Minecraft theme follows the exact LEGO pattern. Future themes (Synthwave, Retro Terminal) follow identically:
- `src/styles/themes/{theme}.css`
- `public/images/{theme}/`
- `[data-theme="{theme}"]` scoped overrides
- Fontsource fonts per theme

---
*Architecture research for: Immersive Minecraft CSS Theme*
*Researched: 2026-02-18*
