# Research Summary: v5.0 Immersive Minecraft Theme

**Researched:** 2026-02-18
**Confidence:** HIGH

## Executive Summary

The v5.0 milestone transforms the existing Minecraft theme from a color-palette swap into a fully immersive experience: pixel typography, SVG block textures, hotbar navigation, inventory-style cards, Creeper motif, stone buttons, game tooltips, and mob/tool decorative assets. The proven LEGO immersive pattern (28 files, [data-theme] scoping, Fontsource fonts, SVG assets) applies directly — Minecraft follows the same architecture with pixel-art-specific adaptations.

**Key difference from LEGO:** Minecraft's aesthetic is pixel-grid-based (sharp edges, integer sizes, no anti-aliasing) vs LEGO's rounded/playful style. This requires careful font rendering control and SVG tiling precision.

## Key Findings

### Stack Additions

- **Pixel fonts (Fontsource):** Silkscreen (titles), Press Start 2P (headings), Pixelify Sans (body). ~60KB total WOFF2. Lighter than LEGO's 170KB font payload.
- **SVG assets:** 16+ hand-crafted SVGs in `public/images/minecraft/` — textures (dirt, stone, grass, wood, cobblestone, bedrock), UI elements (hotbar slot, inventory slot, tooltip border, heart), icons (creeper face, sword, pickaxe, xp orb), mob silhouettes (zombie, enderman, chicken). ~11KB total.
- **CSS techniques:** `image-rendering: pixelated`, `-webkit-font-smoothing: none`, `border-image` with SVGs, Minecraft-style 3D bevel borders (inset box-shadow).
- **No new npm dependencies** beyond 3 Fontsource font packages.

### Feature Table Stakes

- Minecraft color palette (dirt brown, grass green, stone gray, sky blue)
- Full-page consistency across all components
- Pixel-art crisp rendering (no blurry edges)
- WCAG AA contrast compliance
- Mobile responsiveness

### Feature Differentiators

- Hotbar-style navigation with slot borders and selected-item highlight
- Inventory/crafting-style content cards with slot shadows
- Minecraft tooltip hovers (dark bg, purple border, pixel font)
- Block texture SVG backgrounds per section (dirt, stone, grass, wood)
- Stone button styling with 3D bevel and press state
- Creeper face motif as recurring design element
- Code blocks styled as command block output
- Mob silhouettes and tool icons as decorative SVGs
- XP bar accents and health bar hearts
- Bedrock-textured footer

### Watch Out For

1. **Pixel font anti-aliasing** — Browsers blur pixel fonts by default. Must use `-webkit-font-smoothing: none` and integer font sizes.
2. **SVG texture tiling seams** — Sub-pixel gaps between tiles at non-100% zoom. Use 0.5px overlap and `image-rendering: pixelated`.
3. **Dark palette contrast failures** — Minecraft colors are atmosphere-first, not readability-first. Must adjust for WCAG AA 4.5:1.
4. **Hotbar overflow on mobile** — 6+ nav items in fixed-width slots don't fit narrow screens. Need responsive fallback.
5. **Theme leakage** — Strict `[data-theme="minecraft"]` scoping required on every rule. Test bidirectional switching.

## Implications for Roadmap

Suggested 4-phase build order following LEGO precedent:

1. **Visual Foundation** — Color palette, SVG assets, pixel fonts, background textures, contrast-safe mapping
2. **Component Transforms** — Hotbar nav, inventory cards, stone buttons, tooltips, sidebar, footer, code blocks
3. **Decorative Assets & Animations** — Mob silhouettes, tool icons, Creeper motif, XP/heart accents, hover animations, reduced-motion
4. **Validation & Polish** — WCAG contrast audit, cross-browser, mobile responsive, Lighthouse, theme switching

**Starting phase number:** 22 (continuing from v4.0's phase 21)

---
*Research completed: 2026-02-18*
*Ready for roadmap: yes*
