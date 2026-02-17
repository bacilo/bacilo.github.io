# Phase 19: Brick Elements & Studs - Research

**Researched:** 2026-02-17
**Domain:** CSS pseudo-elements, box-shadow depth effects, background patterns, performance optimization
**Confidence:** HIGH

## Summary

Phase 19 transforms LEGO-themed page elements into realistic brick-shaped components by layering CSS box-shadow for depth, CSS pseudo-elements for circular studs, and pressed-state feedback for navigation buttons. This phase builds directly on Phase 18's LEGO color foundation (`[data-theme="lego"]` selectors already in place) and must preserve Shiki's syntax highlighting while adding brick borders to code blocks.

The core technical challenges are:
1. **Multi-layer box-shadow for 3D depth** - Creating realistic brick depth without performance degradation on mobile scroll
2. **CSS pseudo-element stud patterns** - Using `::before` and `::after` with radial-gradient backgrounds to create circular LEGO studs without images
3. **Navigation pressed-state feedback** - Implementing 3D "pressed" effect using `transform: translateY()` and reduced box-shadow on `:active`
4. **Performance on mobile devices** - Maintaining 60fps scroll performance with multiple box-shadows and pseudo-elements

Material Design's elevation system (2dp-8dp cards with layered shadows) provides the architectural blueprint for realistic depth effects. The 3D pressed button pattern (translateY + reduced shadow on :active) is industry-standard for tactile feedback. Critical insight: **animating box-shadow directly kills performance**—instead, pre-render shadow states on pseudo-elements and animate opacity, or use `transform` and `opacity` exclusively for 60fps on mobile.

**Primary recommendation:** Use 2-3 layered box-shadows for brick depth (more layers = exponential performance cost), create studs with `::before` pseudo-element + `radial-gradient` background pattern, implement pressed state with `transform: translateY(2px)` + reduced shadow on `:active`, and rigorously test scroll performance on low-end mobile devices. All styles scoped to `[data-theme="lego"]` to prevent leakage.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BRICK-01 | Content cards display brick-shaped appearance with multi-layer box-shadow depth effect | Layered box-shadow pattern creates Material Design elevation (2-3 shadows at varying offsets/blur); proven performant if layers kept minimal (3 max); existing `.github-card` component already has hover shadow, extend with LEGO-scoped multi-layer |
| BRICK-02 | Cards display circular LEGO studs on top surface via CSS pseudo-elements | `::before` pseudo-element with `radial-gradient(circle at center, color radius, transparent radius)` creates dot pattern; `background-size: 8px 8px` with `background-repeat: round` tiles studs; real LEGO studs are 8mm apart, translates to CSS pixels; position pseudo-element at top of card |
| BRICK-03 | Navigation items styled as brick buttons with stud overlay and pressed-state feedback | Pressed state: `transform: translateY(2px)` on `:active` + reduce box-shadow offset from 4px to 0px; transition ~34ms for snappy feel; studs via same `::before` radial-gradient pattern as cards; existing Navigation.astro has hover states, extend with LEGO-scoped brick treatment |
| BRICK-04 | Code blocks display brick border treatment while preserving Shiki syntax highlighting | Shiki generates inline styles with CSS variables (`--shiki-light`, `--shiki-dark`); Phase 18 already coordinates colors via `[data-theme="lego"] .astro-code` selector; add thicker border (3px solid) and minimal box-shadow for depth; Shiki colors preserved via existing `!important` rules in themes.css |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS box-shadow | Native | Multi-layer depth effects for brick appearance | Native browser support 99%+, Material Design elevation pattern proven, 2-3 layers maintain 60fps on mobile |
| CSS pseudo-elements (::before, ::after) | Native | Stud pattern overlay without DOM bloat | Two pseudo-elements per element = clean markup, positioned independently, accept full CSS styling including backgrounds |
| CSS radial-gradient() | Native | Circular stud shapes without images | Zero HTTP requests, scalable, `background-repeat: round` prevents clipping, excellent performance (GPU-accelerated) |
| CSS transform | Native | Pressed-state button feedback (translateY) | Hardware-accelerated (GPU), 60fps guaranteed, doesn't trigger reflow/repaint like top/margin changes |
| CSS :active pseudo-class | Native | Pressed-state triggering | Instant response to user interaction, works on touch and click, accessibility-friendly |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS background-repeat: round | Native | Prevent stud clipping at edges | When tiling radial-gradient patterns; ensures studs never cut off at card boundaries |
| CSS pointer-events: none | Native | Prevent pseudo-element interaction blocking | When stud pseudo-elements overlay interactive content; allows clicks to pass through to underlying links/buttons |
| @media (prefers-reduced-motion: reduce) | Native | Disable animations for accessibility | Fallback for users with motion sensitivity; remove transitions, keep static pressed state |
| CSS will-change | Native (use sparingly) | Hint browser for animation optimization | **Only** when profiling shows paint issues; overuse creates more problems than it solves |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Multi-layer box-shadow | filter: drop-shadow() | drop-shadow is GPU-accelerated but doesn't stack well for multi-layer depth; box-shadow compositing is more predictable |
| Pseudo-element studs | Background image (SVG/PNG) | Images require HTTP requests, don't scale cleanly, harder to theme; radial-gradient is lighter and CSS-themeable |
| transform: translateY() | top/margin changes | Top/margin trigger reflow (expensive), transform is GPU-accelerated and maintains 60fps |
| Static box-shadow | Animated box-shadow on hover | Animating box-shadow kills performance (repaint every frame); static shadows or opacity-animated pseudo-elements perform better |

**Installation:**
No external dependencies required. All features use native CSS.

## Architecture Patterns

### Recommended Selector Structure

Maintain Phase 18 pattern: all LEGO-specific styles in `themes.css` under `[data-theme="lego"]` prefix.

```
src/styles/
└── themes.css          # Phase 18 LEGO foundation + Phase 19 brick extensions
    ├── [data-theme="lego"] { color variables }              # Already in place
    ├── [data-theme="lego"] body { baseplate grid }          # Already in place
    ├── [data-theme="lego"] .github-card { brick depth }     # Phase 19: add box-shadow layers
    ├── [data-theme="lego"] .github-card::before { studs }   # Phase 19: stud pattern
    ├── [data-theme="lego"] nav a { brick button }           # Phase 19: button treatment
    └── [data-theme="lego"] .astro-code { brick border }     # Phase 19: extend existing rule
```

**Alternative (future):** If LEGO theme grows to 500+ lines, extract to `src/styles/lego/bricks.css`, but keep everything together for now (easier to audit for style leakage).

### Pattern 1: Multi-Layer Box-Shadow for Brick Depth

**What:** Stack 2-3 box-shadows with increasing blur radius and decreasing opacity to simulate realistic depth

**When to use:** For cards, buttons, and brick-shaped elements in LEGO theme

**Example:**
```css
/* Source: Material Design elevation guidelines, Tobias Ahlin layered shadows */
[data-theme="lego"] .github-card {
  /* Layer 1: Sharp shadow close to element (contact shadow) */
  /* Layer 2: Soft shadow with larger blur (ambient shadow) */
  /* Layer 3: Very soft shadow for depth (optional) */
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),   /* Close, sharp */
    0 2px 6px rgba(0, 0, 0, 0.08),   /* Mid-range blur */
    0 4px 12px rgba(0, 0, 0, 0.05);  /* Far, very soft */

  /* Stronger shadow on hover for lift effect */
  transition: box-shadow 0.2s ease;
}

[data-theme="lego"] .github-card:hover {
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(0, 0, 0, 0.08);
}
```

**Performance note:** 3 layers is the practical maximum for 60fps on mobile. More layers = exponential paint cost. Test on iPhone SE (low-end target).

### Pattern 2: Pseudo-Element Stud Pattern with Radial Gradient

**What:** Use `::before` pseudo-element with repeating radial-gradient to create tiled circular studs

**When to use:** For top surface of cards, navigation buttons, and brick-shaped elements

**Example:**
```css
/* Source: CSS { In Real Life } | CSS Halftone Patterns */
[data-theme="lego"] .github-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 24px;  /* Stud strip along top edge */

  /* Circular stud pattern - LEGO studs are 8mm apart in real life */
  background-image: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.08) 3px,  /* Stud circle - subtle shadow color */
    transparent 3px
  );
  background-size: 16px 16px;  /* 2x spacing for professional look */
  background-repeat: round;     /* Prevents clipping at edges */

  pointer-events: none;  /* Allow clicks to pass through to card content */
  border-radius: 8px 8px 0 0;  /* Match card's top corners */
}
```

**Alternative:** For full-surface studs, set `height: 100%` and adjust opacity to `0.03` for subtle texture.

**Real LEGO dimensions:** 8mm stud spacing = ~30px at 96 DPI, but 16-24px looks better on web (not physically accurate, but visually balanced).

### Pattern 3: Pressed-State 3D Button Effect

**What:** Combine `transform: translateY()` and reduced box-shadow on `:active` to simulate button being pressed down

**When to use:** For navigation links, action buttons, and interactive brick elements

**Example:**
```css
/* Source: Josh W. Comeau "Building a Magical 3D Button" */
[data-theme="lego"] nav a {
  /* Base state: raised brick button */
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.15),
    0 0 0 3px var(--color-lego-yellow);  /* Outline for brick edge */

  /* Fast transition for snappy feel */
  transition: transform 34ms ease-out, box-shadow 34ms ease-out;
}

[data-theme="lego"] nav a:active {
  /* Pressed state: move down 2px, flatten shadow */
  transform: translateY(2px);
  box-shadow:
    0 0 2px rgba(0, 0, 0, 0.1),
    0 0 0 3px var(--color-lego-yellow);
}
```

**Timing note:** 34ms = ~2 frames at 60fps. Feels instant to users. Longer transitions (120ms+) feel sluggish.

**Accessibility:** Pressed state must work for keyboard users (`:focus:active`) and respect `prefers-reduced-motion: reduce` (remove transitions, keep static transform).

### Pattern 4: Brick Border Treatment for Code Blocks (Preserving Shiki)

**What:** Add LEGO-themed border styling to `.astro-code` without interfering with Shiki's inline color styles

**When to use:** For code blocks in LEGO theme only

**Example:**
```css
/* Source: Existing Phase 18 implementation pattern */
/* Phase 18 already has: [data-theme="lego"] .astro-code { border: 3px solid var(--color-lego-blue); } */

/* Phase 19 extension: add brick depth */
[data-theme="lego"] .astro-code {
  border: 3px solid var(--color-lego-blue);
  border-radius: 2px;  /* Minimal rounding for brick feel */

  /* Light box-shadow for brick depth (single layer to avoid performance issues with many code blocks) */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  /* Shiki colors preserved via existing !important rules in themes.css lines 217-258 */
  /* Do NOT override color or background-color here */
}
```

**Why this works:** Shiki generates inline `style="color: var(--shiki-light)"` on every `<span>`. Phase 18's `!important` rules in themes.css ensure correct theme coordination. Border and box-shadow don't conflict with text colors.

### Anti-Patterns to Avoid

- **5+ layered box-shadows:** Each layer multiplies paint cost. Stick to 2-3 max for cards, 1-2 for buttons. More layers = scroll jank on mobile.
- **Animating box-shadow on hover/active:** Repaints every frame, destroys performance. Use static shadows or animate opacity of pseudo-element with pre-rendered shadow.
- **Studs everywhere:** Full-surface stud patterns create visual noise. Limit to top strip (24px height) or very subtle full-surface (0.03 opacity).
- **Forgetting pointer-events: none on pseudo-elements:** Stud overlays will block clicks on card links/buttons. Always set `pointer-events: none` on decorative pseudo-elements.
- **Hardcoded stud colors:** Use `rgba(0, 0, 0, 0.08)` for studs so they adapt to card background. Don't use fixed hex colors like `#cccccc`.
- **Overly complex radial-gradient:** Keep stud pattern simple (single radial-gradient, hard stop). Multiple overlapping gradients kill performance.
- **Breaking Shiki with !important overrides:** Never add `color: ... !important` or `background: ... !important` to `.astro-code` selectors. Shiki's inline styles must win for syntax colors.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Circular dot patterns | Canvas rendering, SVG sprites, multiple DOM elements | CSS radial-gradient with background-repeat | Zero HTTP requests, scalable, GPU-accelerated, tiny CSS footprint vs image/canvas overhead |
| 3D depth effects | WebGL, CSS 3D transforms (rotateX/rotateY), JavaScript shadow libraries | Multi-layer box-shadow (Material Design pattern) | Industry-proven pattern, excellent browser support, no JavaScript, predictable rendering across devices |
| Pressed button animation | JavaScript click handlers, CSS animations with keyframes | CSS :active pseudo-class + transform + transition | Native browser optimization, works without JavaScript, accessible by default, instant response |
| Performance optimization for shadows | JavaScript scroll listeners to disable shadows, Intersection Observer to lazy-load effects | Static shadows limited to 2-3 layers, stick to transform/opacity for animations | Browser compositor handles transform/opacity off main thread; JS-based solutions add overhead instead of removing it |

**Key insight:** CSS pseudo-elements + gradients + transforms are **specifically optimized** by browser rendering engines. Custom solutions (canvas, JS animation, multiple DOM elements) bypass these optimizations and hurt performance.

## Common Pitfalls

### Pitfall 1: Box-Shadow Performance Degradation on Mobile Scroll

**What goes wrong:** Page scroll feels janky, frame rate drops below 30fps, mobile devices overheat

**Why it happens:** Each box-shadow layer requires compositing. With 5+ layers on 10+ cards, scroll events trigger expensive repaints. Mobile GPUs can't keep up.

**How to avoid:**
- Limit to 2-3 box-shadow layers maximum per element
- Use simpler shadows for non-interactive elements (code blocks: 1 layer only)
- Test on low-end device (iPhone SE, older Android) with Chrome DevTools Performance tab
- If jank persists, consider removing shadows entirely at `@media (max-width: 768px)` for mobile

**Warning signs:** DevTools Performance tab shows paint times >16ms, "Recalculate Style" warnings, CPU usage spikes during scroll

### Pitfall 2: Pseudo-Element Stud Overlay Blocks Clicks

**What goes wrong:** Card links/buttons don't respond to clicks, hover states don't trigger

**Why it happens:** Pseudo-element (`::before`) with full width/height sits on top of interactive content, capturing pointer events

**How to avoid:**
- Always set `pointer-events: none` on decorative pseudo-elements
- Test click targets: card title links, "View on GitHub" buttons, download links
- Verify hover states still work (title links change color on hover)

**Warning signs:** Links require multiple clicks, hover states don't trigger, DevTools shows pseudo-element receiving events instead of underlying elements

### Pitfall 3: Stud Pattern Clips at Card Edges

**What goes wrong:** Studs cut off at card right/bottom edges, creating visual asymmetry

**Why it happens:** `background-repeat: repeat` tiles studs without considering container size, causing partial studs at boundaries

**How to avoid:**
- Use `background-repeat: round` instead of `repeat` (scales pattern to fit without clipping)
- Alternatively, add padding to pseudo-element to create safe margin
- Test cards of varying widths (responsive breakpoints, different content lengths)

**Warning signs:** Half-circle studs at edges, uneven spacing, visual imbalance at card boundaries

### Pitfall 4: Pressed State Doesn't Work for Keyboard Users

**What goes wrong:** Mouse clicks show pressed effect, but keyboard navigation (Tab + Enter) doesn't

**Why it happens:** `:active` pseudo-class only used, but keyboard activation needs `:focus:active` for Enter key presses

**How to avoid:**
- Use selector combo: `nav a:active, nav a:focus:active { transform: translateY(2px); }`
- Test keyboard navigation: Tab to link, press Enter, verify pressed visual feedback
- Ensure `:focus` has visible indicator (outline or border) for accessibility

**Warning signs:** Keyboard users don't see pressed state, accessibility audit flags missing focus states, keyboard-only testing shows no feedback

### Pitfall 5: Shiki Syntax Highlighting Colors Break

**What goes wrong:** Code blocks display all text in same color, syntax highlighting disappears

**Why it happens:** New LEGO-scoped rule adds `color: ... !important`, overriding Shiki's inline color styles

**How to avoid:**
- **Never** add `color` or `background-color` properties to `[data-theme="lego"] .astro-code` or `.astro-code span` selectors
- Stick to border, box-shadow, border-radius, padding (non-color properties)
- Phase 18's existing `!important` rules (themes.css lines 217-258) handle color coordination
- Test with actual code blocks containing multiple languages (JavaScript, Python, CSS)

**Warning signs:** All code same color, DevTools shows local rule overriding Shiki's `--shiki-light` variable, syntax highlighting broken on LEGO theme but works on other themes

### Pitfall 6: Style Leakage to Non-LEGO Themes

**What goes wrong:** Brick shadows/studs appear on Dark theme, Terminal theme, etc.

**Why it happens:** Selector not properly scoped with `[data-theme="lego"]` prefix, or pseudo-element inherits from global scope

**How to avoid:**
- **Every** brick-related selector MUST start with `[data-theme="lego"]`
- Test theme switching: switch from LEGO to Dark to Sepia to Terminal, verify no brick effects persist
- Use DevTools to inspect computed styles on other themes
- Grep for pseudo-elements without theme prefix: `grep -n "::before" src/styles/themes.css | grep -v "data-theme"`

**Warning signs:** Studs visible on non-LEGO themes, box-shadow patterns appear when theme switched, DevTools shows LEGO rules applying globally

### Pitfall 7: Transition Duration Too Long (Sluggish Buttons)

**What goes wrong:** Pressed button effect feels slow and unresponsive, users click multiple times

**Why it happens:** Transition set to 200ms+ (standard hover timing), but pressed state needs instant feedback

**How to avoid:**
- Use 34ms transition for pressed state (3ms for ultra-responsive, 100ms for gentle)
- Separate transition timings: `transition: transform 34ms, box-shadow 34ms;`
- Test on touch devices where lag is more noticeable
- Reference: real buttons snap down in ~2 frames at 60fps = 33ms

**Warning signs:** Button feels mushy, users report "not sure if I clicked it", multiple rapid clicks common

## Code Examples

Verified patterns from research and official sources:

### Example 1: Card Brick Depth with Multi-Layer Box-Shadow

```css
/* Source: Material Design elevation system, existing GitHubCard.astro pattern */
[data-theme="lego"] .github-card {
  /* Extend existing Phase 18 styling */
  border: 3px solid var(--color-lego-yellow);
  border-radius: 4px;
  background: #ffffff;

  /* Multi-layer depth for brick appearance (BRICK-01) */
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),   /* Contact shadow */
    0 2px 6px rgba(0, 0, 0, 0.08),   /* Mid-range */
    0 4px 12px rgba(0, 0, 0, 0.05);  /* Ambient shadow */

  /* Smooth transition for hover lift */
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

[data-theme="lego"] .github-card:hover,
[data-theme="lego"] .github-card:focus-within {
  border-color: var(--color-lego-red);

  /* Elevated hover state */
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(0, 0, 0, 0.08);
}
```

### Example 2: Card Stud Pattern via Pseudo-Element

```css
/* Source: CSS halftone patterns, radial-gradient tutorials */
[data-theme="lego"] .github-card {
  position: relative;  /* Required for absolute pseudo-element positioning */
}

[data-theme="lego"] .github-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 24px;  /* Stud strip along top edge */

  /* Circular LEGO studs (BRICK-02) */
  background-image: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.08) 3px,  /* Stud circle - subtle for professional look */
    transparent 3px
  );
  background-size: 16px 16px;  /* Spacing between studs */
  background-repeat: round;     /* Prevent clipping at edges */

  pointer-events: none;  /* Critical: allow clicks through to card content */
  border-radius: 4px 4px 0 0;  /* Match card's top corners */
  z-index: 1;  /* Above card background, below card content */
}
```

**Variation for full-surface studs:**
```css
[data-theme="lego"] .github-card::before {
  height: 100%;
  background-image: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.03) 2px,  /* Much more subtle for background texture */
    transparent 2px
  );
  background-size: 20px 20px;  /* Larger spacing for subtlety */
  border-radius: 4px;
}
```

### Example 3: Navigation Brick Button with Pressed State

```css
/* Source: Josh W. Comeau 3D button tutorial, existing Navigation.astro pattern */
[data-theme="lego"] nav a {
  /* Already styled in Phase 18: color, font-weight, etc. */

  /* Add brick button treatment (BRICK-03) */
  position: relative;  /* For pseudo-element studs */
  padding: var(--space-xs) var(--space-sm);  /* Add padding for button feel */

  /* Brick depth */
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.15),
    0 0 0 2px var(--color-lego-yellow);  /* Outline for brick edge */

  /* Snappy transition for pressed state */
  transition: transform 34ms ease-out, box-shadow 34ms ease-out;
}

/* Stud overlay for brick buttons */
[data-theme="lego"] nav a::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;  /* Don't extend to full width */
  height: 8px;

  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.3) 2px,  /* Light studs on colored background */
    transparent 2px
  );
  background-size: 12px 12px;
  background-repeat: round;
  pointer-events: none;
}

/* Pressed state - works for mouse and keyboard (BRICK-03) */
[data-theme="lego"] nav a:active,
[data-theme="lego"] nav a:focus:active {
  transform: translateY(2px);
  box-shadow:
    0 0 2px rgba(0, 0, 0, 0.1),  /* Flattened shadow */
    0 0 0 2px var(--color-lego-yellow);
}
```

### Example 4: Code Block Brick Border (Preserving Shiki)

```css
/* Source: Existing Phase 18 pattern, Astro Shiki documentation */
/* Phase 18 already has basic border, Phase 19 adds depth */
[data-theme="lego"] .astro-code {
  border: 3px solid var(--color-lego-blue);
  border-radius: 2px;  /* Minimal rounding for brick aesthetic */

  /* Single-layer shadow for subtle depth (BRICK-04) */
  /* Keep it light - code blocks shouldn't dominate visually */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  /* DO NOT add color or background-color properties here */
  /* Shiki's inline styles must win for syntax highlighting */
  /* Coordination handled by existing themes.css lines 217-258 */
}
```

**Shiki coordination (already in place from Phase 18):**
```css
/* This exists in themes.css already - DO NOT MODIFY */
[data-theme="lego"] .astro-code,
[data-theme="lego"] .astro-code span {
  color: var(--shiki-light) !important;
  background-color: var(--shiki-light-bg) !important;
}
```

### Example 5: Mobile Performance Optimization

```css
/* Source: prefers-reduced-motion MDN docs, mobile performance best practices */

/* Reduced motion fallback - disable transitions but keep visual states */
@media (prefers-reduced-motion: reduce) {
  [data-theme="lego"] nav a,
  [data-theme="lego"] .github-card {
    transition: none !important;
  }

  /* Keep pressed state, just remove animation */
  [data-theme="lego"] nav a:active {
    transform: translateY(2px);
  }
}

/* Optional: simplify shadows on mobile for better performance */
@media (max-width: 768px) {
  [data-theme="lego"] .github-card {
    /* Reduce to 2 layers on mobile */
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 2px 6px rgba(0, 0, 0, 0.08);
  }

  [data-theme="lego"] .github-card:hover {
    /* Reduce to 2 layers on mobile */
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.12);
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single box-shadow for depth | Layered box-shadow (Material Design) | ~2014 Material Design v1 | More realistic depth perception, industry standard for elevation |
| Image-based studs/dots | CSS radial-gradient patterns | ~2016 when gradients became performant | Zero HTTP requests, scalable, themeable with CSS variables |
| Animating box-shadow on hover | Static shadows OR pseudo-element opacity animation | ~2019 performance focus | 60fps hover animations, reduced paint overhead |
| top/left for button press | transform: translateY() | ~2017 when GPU acceleration mainstream | Hardware-accelerated, no reflow, smooth 60fps |
| JavaScript click handlers for visual feedback | CSS :active pseudo-class | ~2015 modern CSS | Instant native response, works without JS, accessible by default |

**Deprecated/outdated:**
- **Animating box-shadow directly:** Still technically works but kills performance. Use pseudo-element with pre-rendered shadow and animate opacity instead.
- **background-attachment: fixed for patterns:** Broken on mobile browsers. Use `position: fixed` pseudo-element or accept pattern scrolling with content.
- **Multiple ::before(n) pseudo-elements:** CSS4 spec never finalized. Stick to single `::before` and `::after` per element.

## Open Questions

1. **Should studs be on top strip only or full surface?**
   - What we know: Top strip (24px height) is cleaner, full surface creates texture
   - What's unclear: User preference for subtlety vs. immersion
   - Recommendation: Start with top strip for cards (24px), full surface for nav buttons (subtle at 0.03 opacity). Phase 20 can add user preference toggle.

2. **How many box-shadow layers balance realism vs. performance?**
   - What we know: 3 layers = Material Design standard, 5+ layers = mobile jank
   - What's unclear: Whether 2 layers sufficient for brick depth perception
   - Recommendation: Test with 2 layers first (performance safe), add 3rd if depth feels insufficient. Rigorously test scroll performance on iPhone SE.

3. **Should pressed state reduce shadow to 0 or maintain minimal shadow?**
   - What we know: 0 shadow = fully pressed, minimal shadow = slight elevation
   - What's unclear: Which feels more brick-like
   - Recommendation: Reduce to near-zero (`0 0 2px rgba(0,0,0,0.1)`) to maintain subtle outline while feeling pressed.

4. **Should code blocks have studs or just brick border?**
   - What we know: Studs on code blocks could feel gimmicky, brick border is safer
   - What's unclear: Whether subtle studs enhance or distract from code readability
   - Recommendation: Brick border only for BRICK-04. Code readability is paramount. Studs reserved for cards/navigation.

## Sources

### Primary (HIGH confidence)

**Existing Codebase Analysis:**
- `/Users/pedf/workspace/bacilo.github.io/src/styles/themes.css` - Phase 18 LEGO foundation (colors, baseplate, component overrides)
- `/Users/pedf/workspace/bacilo.github.io/src/components/portfolio/GitHubCard.astro` - Card component structure, existing hover shadow
- `/Users/pedf/workspace/bacilo.github.io/src/components/Navigation.astro` - Navigation links, existing active state
- `/Users/pedf/workspace/bacilo.github.io/astro.config.mjs` - Shiki configuration (github-light/dark themes)
- `/Users/pedf/workspace/bacilo.github.io/.planning/REQUIREMENTS.md` - Phase 19 requirements (BRICK-01 through BRICK-04)

**Official Documentation:**
- [box-shadow - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow) - Box-shadow syntax, multiple shadows
- [::before - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::before) - Pseudo-element positioning, content generation
- [radial-gradient() - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient) - Circular gradient syntax
- [transform - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform) - translateY() for pressed state
- [Syntax Highlighting | Astro Docs](https://docs.astro.build/en/guides/syntax-highlighting/) - Shiki integration, theme coordination

### Secondary (MEDIUM confidence)

**Verified Web Research:**
- [Smoother & sharper shadows with layered box-shadows | Tobias Ahlin](https://tobiasahlin.com/blog/layered-smooth-box-shadows/) - Multi-layer shadow pattern, blur/offset ratios
- [Designing Beautiful Shadows in CSS • Josh W. Comeau](https://www.joshwcomeau.com/css/designing-shadows/) - Shadow design principles, elevation guidelines
- [Building a Magical 3D Button with HTML and CSS • Josh W. Comeau](https://www.joshwcomeau.com/animation/3d-button/) - Pressed state pattern, translateY + shadow reduction
- [How to animate box-shadow with silky smooth performance | Tobias Ahlin](https://tobiasahlin.com/blog/how-to-animate-box-shadow/) - Performance optimization, pseudo-element technique
- [CSS { In Real Life } | CSS Halftone Patterns](https://css-irl.info/css-halftone-patterns/) - Radial-gradient dot patterns
- [Cards – Material Design 3](https://m3.material.io/components/cards/guidelines) - Elevation system, 2dp-8dp cards
- [Elevation & shadows - Material Design](https://m1.material.io/material-design/elevation-shadows.html) - Multi-layer shadow specifications
- [CSS box-shadow Can Slow Down Scrolling | Airbnb Engineering](https://medium.com/airbnb-engineering/css-box-shadow-can-slow-down-scrolling-d8ea47ec6867) - Performance pitfalls, mobile optimization

**LEGO Technical Reference:**
- [LEGO Specifications | Orionrobots](https://orionrobots.co.uk/Lego+Specifications) - 8mm stud spacing, brick dimensions
- [Stud Dimensions Guide | Brick Owl](https://www.brickowl.com/help/stud-dimensions) - Stud diameter (4.8mm), height (1.6mm)

### Tertiary (LOW confidence)

None required. All findings verified with official documentation or technical specifications.

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - All features are native CSS with 99%+ browser support; patterns proven in production (Material Design, Josh Comeau tutorials)
- Architecture: **HIGH** - Phase 18 provides proven foundation; Phase 19 extends existing selectors with validated patterns
- Pitfalls: **HIGH** - Performance issues well-documented (Airbnb blog, Tobias Ahlin), common mistakes verified through official docs and community resources

**Research date:** 2026-02-17
**Valid until:** 60 days (stable CSS features, established patterns)

**Browser support notes:**
- box-shadow (multi-layer): 99%+ (all modern browsers, IE9+)
- Pseudo-elements (::before, ::after): 99%+ (all modern browsers)
- radial-gradient: 99%+ (all modern browsers, unprefixed since 2014)
- transform: translateY(): 99%+ (all modern browsers, hardware-accelerated)
- :active pseudo-class: 100% (universal support)
- prefers-reduced-motion: 97%+ (all modern browsers, graceful fallback)

**Performance targets:**
- Desktop: 60fps scroll with 10+ cards, 3-layer shadows
- Mobile (iPhone SE): 60fps scroll with 10+ cards, 2-layer shadows
- Code blocks: Single-layer shadows only (many blocks per page)

**Key technical decisions for Phase 19:**
1. Maximum 3 box-shadow layers for cards, 2 for buttons, 1 for code blocks
2. Studs via `::before` pseudo-element with radial-gradient background
3. Pressed state: `transform: translateY(2px)` + reduced shadow on `:active`
4. All styles scoped to `[data-theme="lego"]` in themes.css
5. Shiki coordination via existing Phase 18 `!important` rules (no changes needed)
6. Performance fallback: reduce shadow layers on mobile via media query if testing shows jank
