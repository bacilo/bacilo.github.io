# Stack Research: Immersive Minecraft Theme

**Domain:** Immersive Minecraft CSS theme for Astro static site
**Researched:** 2026-02-18
**Confidence:** HIGH

## Existing Stack (DO NOT re-research)

- Astro 5.x, TypeScript, CSS custom properties, Fontsource, component-scoped [data-theme] overrides
- Shiki dual-theme syntax highlighting, GitHub Pages deployment
- LEGO immersive theme pattern: Fontsource fonts, CSS pseudo-elements, multi-layer box-shadows

## Recommended Stack Additions

### Pixel Fonts via Fontsource

| Font | npm Package | Weight | Purpose | Why |
|------|------------|--------|---------|-----|
| Silkscreen | @fontsource/silkscreen | 400, 700 | H1 titles, UI labels | Classic pixel font, designed for screen legibility. Clean at 16px+. Perfect for Minecraft "title screen" feel. |
| Press Start 2P | @fontsource/press-start-2p | 400 | H2-H3 headings, nav labels | Iconic retro gaming font. Chunky, square letterforms match Minecraft's blocky aesthetic. |
| Pixelify Sans | @fontsource/pixelify-sans | 400-700 | Body text | Pixel-style font designed for body readability. Smoother than pure pixel fonts at small sizes. Variable weight support. |

**Total payload:** ~60KB WOFF2 (3 fonts, Latin subset). Comparable to LEGO fonts (170KB for 3).

**Critical CSS requirement:** `font-smooth: never; -webkit-font-smoothing: none;` on pixel fonts to prevent browser anti-aliasing that blurs pixel edges. Use `image-rendering: pixelated` on any scaled pixel art.

### SVG Assets (Custom-Created)

No npm packages needed. Hand-crafted SVGs kept small (<3KB each).

| Asset | Type | Purpose | Size Est. |
|-------|------|---------|-----------|
| dirt-block.svg | Texture pattern | Backgrounds, card borders | ~1KB |
| grass-top.svg | Texture pattern | Header/footer accent | ~1.5KB |
| stone-block.svg | Texture pattern | UI panel backgrounds | ~1KB |
| oak-planks.svg | Texture pattern | Sidebar, card variants | ~1KB |
| cobblestone.svg | Texture pattern | Code block backgrounds | ~1.5KB |
| creeper-face.svg | Icon/motif | Recurring design element | ~0.5KB |
| sword.svg | Icon | Decorative accent | ~0.5KB |
| pickaxe.svg | Icon | Decorative accent | ~0.5KB |
| heart.svg | Icon | Health bar UI element | ~0.3KB |
| xp-orb.svg | Icon | XP bar accent | ~0.3KB |
| hotbar-slot.svg | UI element | Navigation slot border | ~0.4KB |
| inventory-slot.svg | UI element | Card container | ~0.4KB |
| tooltip-bg.svg | UI element | Hover tooltip frame | ~0.6KB |
| zombie.svg | Silhouette | Decorative | ~0.8KB |
| enderman.svg | Silhouette | Decorative | ~0.7KB |
| chicken.svg | Silhouette | Decorative | ~0.6KB |

**Total SVG payload:** ~11KB (all assets). Well under performance budget.

### CSS Techniques for Pixel Art

| Technique | Purpose | Browser Support |
|-----------|---------|-----------------|
| `image-rendering: pixelated` | Crisp pixel scaling on SVGs/backgrounds | Universal 2026 |
| `-webkit-font-smoothing: none` | Disable anti-aliasing on pixel fonts | WebKit/Blink |
| `box-shadow` pixel art | Multi-shadow technique for small pixel icons | Universal |
| SVG `<pattern>` elements | Tileable block textures | Universal |
| CSS `background-size` with `image-rendering` | Scaled pixel textures | Universal |
| `border-image` with SVG | Block-style borders from texture SVGs | Universal |

## Installation

```bash
# Pixel fonts via Fontsource (same pattern as LEGO)
npm install @fontsource/silkscreen @fontsource/press-start-2p @fontsource/pixelify-sans
```

SVG assets: Created manually in `public/images/minecraft/` (no package needed).

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Minecraft.css framework | Abandoned (2019), Tailwind-based, doesn't match our architecture | Custom [data-theme="minecraft"] scoped CSS |
| Raster texture images (.png) | Heavy payload, poor scaling, requires exact resolution matching | SVG patterns with `image-rendering: pixelated` |
| Minecraft font files from game | Copyrighted (Mojang/Microsoft). Not redistributable. | Open-source pixel fonts (Silkscreen, Press Start 2P) |
| Canvas/WebGL for textures | Overkill, breaks static CSS-only pattern, JavaScript dependency | CSS gradients and SVG patterns |
| astro-minecraft-theme (npm) | Tailwind-based, different architecture, abandoned | Custom implementation matching our existing pattern |

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Silkscreen (Fontsource) | Minecraft Ten font (Google Fonts) | If Google Fonts adds official Minecraft-style font |
| SVG `<pattern>` for textures | CSS `repeating-conic-gradient` pixel grid | For very simple 2-color patterns only |
| border-image for block borders | Multi-layer box-shadow | When border-image creates visual artifacts at certain sizes |
| Self-hosted SVG assets | CDN-hosted assets | Never — we need full control over pixel-perfect rendering |

## Performance Budget

| Item | Size | FCP Impact |
|------|------|------------|
| 3 pixel fonts (WOFF2) | ~60KB | +30-50ms |
| 16 SVG assets | ~11KB | +5-10ms |
| Theme CSS file | ~8KB | +2-5ms |
| **Total theme overhead** | **~79KB** | **+37-65ms** |

Comparable to LEGO theme (170KB fonts + 15KB SVGs = 185KB). Minecraft theme is actually lighter.

## Sources

- [Fontsource: Silkscreen](https://fontsource.org/fonts/silkscreen) — pixel font, SIL OFL
- [Fontsource: Press Start 2P](https://fontsource.org/fonts/press-start-2p) — pixel font, SIL OFL
- [Fontsource: Pixelify Sans](https://fontsource.org/fonts/pixelify-sans) — pixel body font, SIL OFL
- [MDN: image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering) — pixelated rendering
- [MDN: border-image](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image) — SVG border technique
- [Kirupa: Preserving Pixel Art Look](https://www.kirupa.com/hodgepodge/preserving_pixel_art_aesthetics.htm) — pixel art CSS guide
- [Minecraft Wiki: Block Textures](https://minecraft.wiki/w/Block#Textures) — reference for authentic colors/patterns

---
*Stack research for: Immersive Minecraft CSS Theme*
*Researched: 2026-02-18*
