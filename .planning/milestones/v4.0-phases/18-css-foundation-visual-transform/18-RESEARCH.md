# Phase 18: CSS Foundation & Visual Transform - Research

**Researched:** 2026-02-17
**Domain:** CSS theming, responsive design, background patterns
**Confidence:** HIGH

## Summary

Phase 18 establishes the infrastructure for the immersive LEGO theme experience by extending the existing v3.0 theme system (Phase 14) with LEGO-specific visual transformations. The phase builds on a proven foundation: CSS custom properties with `[data-theme]` attribute selectors, already supporting 8 themes including a basic LEGO color palette.

The core technical challenges are:
1. **Background pattern generation** - Creating a LEGO baseplate grid using CSS gradients (no images)
2. **Theme-scoped styling** - Extending the existing theme system with LEGO-specific selectors without affecting other 7 themes
3. **Responsive sidebar behavior** - Implementing conditional mobile visibility based on page context

The existing codebase already solves the hardest problems: FOUC prevention (inline script in `<head>`), theme persistence (localStorage), and specificity management (`[data-theme]` beats `:root`). Phase 18 adds visual richness within this proven architecture.

**Primary recommendation:** Use CSS custom properties for all LEGO-specific values, scope all visual changes to `[data-theme="lego"]` selectors, and implement the baseplate pattern with repeating gradients. The mobile sidebar fix requires a CSS-only solution using media queries since the requirement is viewport-based, not page-based (except Home page exception).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VIS-01 | LEGO theme applies classic primary color palette (red, blue, yellow, green on light gray) across all page elements | CSS custom properties pattern already proven in Phase 14; extend `[data-theme="lego"]` selector with additional color variables for LEGO primaries |
| VIS-02 | Page background displays LEGO baseplate grid pattern when theme is active | CSS `repeating-linear-gradient()` and `radial-gradient()` create grid patterns without images; LEGO studs are 0.8cm apart in real life, translates to CSS pixels with appropriate scaling |
| VIS-03 | All page elements (nav, cards, sidebar, footer, code blocks) visually transform under LEGO theme | Component-level selectors like `[data-theme="lego"] .github-card` provide scoped styling; existing components already use CSS custom properties for colors |
| RESP-01 | Author sidebar is hidden on mobile (≤768px) for all pages except Home | Standard media query pattern `@media (max-width: 768px)` with `:not()` selector for Home page exception; mobile-first approach already established in codebase |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS Custom Properties | Native | Theme color/value management | Native browser support (98%+), inheritance model, runtime updates, proven in Phase 14 |
| CSS Gradients | Native | Background patterns (baseplate grid) | No images = zero HTTP requests, scalable, animatable, excellent browser support |
| Media Queries | Native | Responsive breakpoints | Industry standard for responsive design, 768px is conventional mobile/tablet boundary |
| Attribute Selectors | Native | Theme scoping (`[data-theme="lego"]`) | Specificity equivalent to class selectors, beats `:root` for theme overrides |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS `clamp()` | Native | Fluid typography scaling | Optional for responsive font sizes; not required for Phase 18 but useful for future phases |
| CSS `@scope` | Native (2026) | Component isolation | Optional; current attribute selector pattern is sufficient for theme scoping |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS gradients | SVG patterns | SVG requires additional HTTP request or inline bloat; gradients are lighter and scalable |
| `[data-theme]` selectors | CSS classes (`.theme-lego`) | Current pattern is already established; changing would break existing themes |
| Media queries for sidebar | JavaScript viewport detection | CSS-only is faster, no layout shift, no JS execution cost |

**Installation:**
No external dependencies required. All features use native CSS.

## Architecture Patterns

### Recommended File Structure

Current structure (already in place):
```
src/styles/
├── global.css          # Base styles, :root variables, resets
├── themes.css          # [data-theme] selectors for 8 themes
└── (future) lego/      # Phase 18+ LEGO-specific enhancements
    ├── colors.css      # Extended LEGO color palette (red, blue, yellow, green variants)
    ├── patterns.css    # Baseplate grid, background textures
    └── components.css  # LEGO-scoped component overrides
```

**Alternative (simpler for Phase 18):** Keep everything in `themes.css` under `[data-theme="lego"]` selectors until the LEGO theme grows complex enough to warrant separation. This follows the existing pattern where all 8 themes are in one file.

### Pattern 1: Theme-Scoped Custom Property Override

**What:** Override CSS custom properties within `[data-theme="lego"]` to change theme-wide colors/values

**When to use:** For any value that should change across multiple components when LEGO theme is active

**Example:**
```css
/* Source: Existing codebase (Phase 14 implementation) */
/* In themes.css */
[data-theme="lego"] {
  /* Existing Phase 14 values */
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-link: #d11013;

  /* Phase 18 additions - LEGO primary colors */
  --color-lego-red: #d11013;
  --color-lego-blue: #0055bf;
  --color-lego-yellow: #f6ec35;
  --color-lego-green: #00852b;
  --color-lego-gray: #e4e4e4;
}
```

### Pattern 2: Repeating Gradient Background Pattern

**What:** Create tiled background patterns using `repeating-linear-gradient()` and `radial-gradient()`

**When to use:** For LEGO baseplate grid without loading external images

**Example:**
```css
/* Source: CSS-Tricks, FreeCodeCamp tutorials */
[data-theme="lego"] body {
  /* Grid lines (horizontal + vertical) */
  background-image:
    repeating-linear-gradient(
      to right,
      transparent 0px,
      transparent calc(8px - 1px),
      #ccc 8px  /* 1px line */
    ),
    repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent calc(8px - 1px),
      #ccc 8px
    );
  background-size: 8px 8px;
}

/* Alternative: Dot pattern for studs */
[data-theme="lego"] body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at center, #999 2px, transparent 2px);
  background-size: 8px 8px;
  pointer-events: none;
  z-index: -1;
}
```

**Note:** Real LEGO studs are 0.8cm apart. For web display, 8px provides good visual balance at typical viewport sizes. Can be adjusted with CSS custom property for responsiveness.

### Pattern 3: Component-Scoped Theme Styling

**What:** Override component styles only when LEGO theme is active

**When to use:** When a component needs visual changes beyond color palette (shadows, borders, shapes)

**Example:**
```css
/* Source: Existing codebase component patterns */
/* Default styling (all themes) */
.github-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-header-bg);
}

/* LEGO theme override */
[data-theme="lego"] .github-card {
  border-width: 3px;  /* Thicker borders for brick appearance */
  border-color: var(--color-lego-yellow);
  /* Phase 19 will add box-shadow for depth, studs for top surface */
}
```

### Pattern 4: Responsive Sidebar with Page Exception

**What:** Hide sidebar on mobile (<768px) except on Home page

**When to use:** For RESP-01 requirement

**Example:**
```css
/* Mobile-first: sidebar visible by default */
.author-sidebar {
  display: block;
}

/* Hide on mobile */
@media (max-width: 768px) {
  .author-sidebar {
    display: none;
  }
}

/* Exception: Show on Home page even on mobile */
@media (max-width: 768px) {
  body.page-home .author-sidebar {
    display: block;
  }
}
```

**Implementation note:** Requires adding `page-home` class to `<body>` on Home page. Alternative: use `:has()` selector with page-specific element if broader browser support not needed.

### Anti-Patterns to Avoid

- **Hardcoded colors in component files:** Always use CSS custom properties so theme switching works. Don't write `background: #f6ec35` in a component; write `background: var(--color-lego-yellow)`.
- **Overly specific selectors:** Don't write `[data-theme="lego"] body main .github-card .repo-name` when `[data-theme="lego"] .repo-name` suffices. High specificity makes overrides harder.
- **JavaScript-based visibility toggling for sidebar:** The requirement is viewport-based (≤768px), not device-detection based. Use CSS media queries, not `window.innerWidth` checks.
- **Background images for patterns:** SVG/PNG patterns require HTTP requests and aren't scalable. CSS gradients are lighter and resolution-independent.
- **Theme-specific code outside `[data-theme]` selectors:** All LEGO-specific styles MUST be scoped to `[data-theme="lego"]` to prevent style leakage to other 7 themes.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme switching infrastructure | Custom theme manager, cookie/localStorage handling, FOUC prevention | Existing Phase 14 implementation (ThemeSwitcher.astro + inline script) | Already proven to work across 8 themes, handles edge cases (private browsing, system preference changes, persistence) |
| CSS reset/normalization | Custom reset rules | Keep existing reset in global.css | Modern browsers have smaller discrepancies; existing reset is sufficient |
| Baseplate pattern generation | SVG files, canvas rendering, image sprites | CSS gradients (`repeating-linear-gradient`, `radial-gradient`) | Zero HTTP requests, scalable, animatable, excellent performance |
| Responsive breakpoints | JavaScript resize listeners, matchMedia in React components | Standard CSS media queries | Declarative, performant, no layout shift, works without JS |
| Color palette management | Sass/Less color functions, JavaScript theme generators | CSS custom properties | Runtime updates, inheritance, browser DevTools inspection, no build step needed |

**Key insight:** The existing v3.0 theme system (Phase 14) already solves the hardest cross-cutting concerns. Phase 18 is pure additive work—no refactoring, no new infrastructure, just CSS additions.

## Common Pitfalls

### Pitfall 1: Baseplate Pattern Z-Index Conflicts

**What goes wrong:** Background pattern appears over content, or content scrolls separately from pattern

**Why it happens:** Improper use of `position: fixed` or pseudo-elements without correct stacking context

**How to avoid:**
- Apply background pattern directly to `body` element using `background-image` property
- If using pseudo-element (e.g., `body::before`), set `position: fixed`, `z-index: -1`, and `pointer-events: none`
- Test scrolling behavior to ensure pattern stays fixed while content scrolls

**Warning signs:** Pattern shifts on scroll, click events don't reach underlying content, pattern appears above text

### Pitfall 2: Style Leakage Between Themes

**What goes wrong:** LEGO-specific styles apply when other themes are active (e.g., baseplate pattern shows on Terminal theme)

**Why it happens:** Selectors aren't properly scoped to `[data-theme="lego"]`, or pseudo-elements inherit from global scope

**How to avoid:**
- **Every LEGO-specific selector MUST start with `[data-theme="lego"]`**
- Test switching between all 8 themes to verify no visual artifacts
- Use browser DevTools to inspect computed styles and check for unexpected inheritance

**Warning signs:** Visual changes persist after switching themes, DevTools shows LEGO-specific rules applying to other themes

### Pitfall 3: Mobile Sidebar Exception Not Working

**What goes wrong:** Sidebar hidden on all mobile pages including Home, or visible on all mobile pages

**Why it happens:** Media query specificity issues, missing page identifier class, cascade order problems

**How to avoid:**
- Add page-specific class to `<body>` element (e.g., `page-home`) in BaseLayout.astro
- Use proper specificity: `@media (max-width: 768px) { body.page-home .author-sidebar { display: block; } }`
- Place exception rule AFTER the general hide rule to ensure proper cascade
- Test on actual mobile viewport (DevTools responsive mode + real device)

**Warning signs:** Sidebar behavior doesn't match requirements, DevTools shows conflicting `display` values, no page-specific class on `<body>`

### Pitfall 4: Gradient Pattern Performance on Mobile

**What goes wrong:** Scrolling feels janky, battery drains quickly, browser fans spin up

**Why it happens:** Complex gradient patterns force expensive compositing, especially with multiple layered gradients

**How to avoid:**
- Limit gradient complexity (max 2-3 layered gradients for baseplate pattern)
- Use `will-change: transform` sparingly and only when needed
- Test on low-end mobile devices (iPhone SE, older Android)
- Consider `@media (prefers-reduced-motion: reduce)` to simplify pattern for users who prefer minimal animation

**Warning signs:** Frame drops in Chrome DevTools Performance tab, high paint/composite times, mobile devices feel sluggish

### Pitfall 5: Color Contrast Failures with LEGO Palette

**What goes wrong:** Text unreadable on LEGO backgrounds, especially yellow header with white text

**Why it happens:** LEGO primary colors are vibrant but don't always meet WCAG contrast ratios

**How to avoid:**
- Test all color combinations with WebAIM Contrast Checker or axe DevTools
- Adjust text colors for LEGO theme: use black text on yellow headers, white text on darker LEGO colors
- Target WCAG 2.1 Level AA: 4.5:1 for normal text, 3:1 for large text
- Document any intentional deviations (e.g., decorative elements)

**Warning signs:** Browser DevTools flags low contrast, text hard to read, accessibility audits fail

### Pitfall 6: Breakpoint Inconsistency

**What goes wrong:** Sidebar hide/show threshold doesn't match other responsive behavior in the app

**Why it happens:** Different breakpoints used in different components, not centralized

**How to avoid:**
- Check existing codebase for breakpoint usage (AuthorSidebar.astro uses 768px)
- Document standard breakpoints in global.css as CSS custom properties or comments
- Use consistent breakpoint values: 768px (mobile/tablet), 1024px (tablet/desktop)

**Warning signs:** Layout shifts at different screen sizes for different components, sidebar behavior differs from nav behavior

## Code Examples

Verified patterns from existing codebase and official sources:

### Example 1: Extending LEGO Theme Palette

```css
/* Source: Existing themes.css pattern */
/* Current Phase 14 implementation */
[data-theme="lego"] {
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-text-muted: #555555;
  --color-link: #d11013;
  --color-link-hover: #a00d10;
  --color-border: #f6ec35;
  --color-header-bg: #f6ec35;
}

/* Phase 18 additions - expanded palette for VIS-01 */
[data-theme="lego"] {
  /* Keep existing properties above */

  /* Primary LEGO colors (VIS-01) */
  --color-lego-red: #d11013;      /* Classic LEGO red */
  --color-lego-blue: #0055bf;     /* Classic LEGO blue */
  --color-lego-yellow: #f6ec35;   /* Classic LEGO yellow */
  --color-lego-green: #00852b;    /* Classic LEGO green */
  --color-lego-gray: #e4e4e4;     /* Light gray baseplate color */

  /* Semantic assignments */
  --color-primary: var(--color-lego-red);
  --color-secondary: var(--color-lego-blue);
  --color-accent: var(--color-lego-yellow);
}
```

### Example 2: LEGO Baseplate Grid Pattern (VIS-02)

```css
/* Source: CSS-Tricks repeating-linear-gradient tutorial
 * https://css-tricks.com/radial-gradient-recipes/
 */
[data-theme="lego"] body {
  /* Light gray baseplate background */
  background-color: var(--color-lego-gray);

  /* Grid lines - 8px spacing (inspired by 0.8cm real LEGO spacing) */
  background-image:
    /* Vertical lines */
    repeating-linear-gradient(
      to right,
      transparent,
      transparent 7px,
      #cccccc 7px,
      #cccccc 8px
    ),
    /* Horizontal lines */
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 7px,
      #cccccc 7px,
      #cccccc 8px
    );
  background-size: 8px 8px;
  background-attachment: fixed; /* Pattern stays fixed during scroll */
}
```

### Example 3: Component-Scoped LEGO Styling (VIS-03)

```css
/* Source: Existing GitHubCard.astro component pattern */

/* Navigation items - Phase 19 will add studs */
[data-theme="lego"] nav a {
  border-color: var(--color-lego-yellow);
  font-weight: 600;
}

[data-theme="lego"] nav a.active {
  background-color: var(--color-lego-red);
  color: white;
  border-color: var(--color-lego-red);
}

/* Cards - prepare for brick transformation in Phase 19 */
[data-theme="lego"] .github-card {
  border: 3px solid var(--color-border);
  background: var(--color-bg);
  /* Phase 19 will add box-shadow depth effect and stud pseudo-elements */
}

/* Code blocks - maintain Shiki colors, add LEGO border */
[data-theme="lego"] .astro-code {
  border: 3px solid var(--color-lego-blue);
  border-radius: 2px; /* Bricks have minimal rounding */
}

/* Footer */
[data-theme="lego"] footer {
  border-top: 3px solid var(--color-lego-yellow);
  background: var(--color-lego-gray);
}
```

### Example 4: Responsive Sidebar with Home Exception (RESP-01)

```css
/* Source: Existing AuthorSidebar.astro responsive pattern */

/* Base: sidebar visible on all screen sizes */
.author-sidebar {
  background: var(--color-header-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: var(--space-md);
  width: 100%;
}

/* Desktop: fixed width sidebar in flexbox layout */
@media (min-width: 768px) {
  .author-sidebar {
    width: 250px;
    flex-shrink: 0;
  }
}

/* Mobile: hide sidebar by default */
@media (max-width: 768px) {
  .author-sidebar {
    display: none;
  }

  /* Exception: show on Home page */
  body.page-home .author-sidebar {
    display: block;
  }
}
```

**Implementation requirement:** Add `class:list={[{ 'page-home': Astro.url.pathname === '/' }]}` to `<body>` in BaseLayout.astro.

### Example 5: FOUC Prevention (Already Implemented)

```html
<!-- Source: Existing BaseLayout.astro inline script (Phase 14) -->
<!-- This pattern is already working - Phase 18 doesn't change it -->
<head>
  <script is:inline>
    (function() {
      try {
        var t = localStorage.getItem('site-theme');
        if (t && t !== 'auto' && t !== 'light') {
          document.documentElement.setAttribute('data-theme', t);
        } else if (t === 'auto') {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'auto');
          }
        }
      } catch (e) {}
    })();
  </script>
</head>
```

**Why it works:** Runs before CSS loads, synchronously sets `data-theme` attribute, prevents flash of default theme.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Sass variables for theming | CSS custom properties (native) | ~2019-2020 | Runtime theme switching without rebuild, DevTools inspection, inheritance model |
| `@media (min-width: X)` | `@media (width >= X)` range syntax | CSS Media Queries Level 4 (2021), production-ready 2024 | More readable, clearer intent, supported in all modern browsers |
| Image-based background patterns | CSS gradients (repeating-linear, radial) | Gradients mature ~2014-2016 | Zero HTTP requests, scalable, animatable, no CORS issues |
| Separate light/dark stylesheets | Single CSS file with media queries + custom properties | ~2018 progressive enhancement | Less duplication, easier maintenance, faster switching |
| JavaScript-based theme switching | CSS-only with inline script for FOUC prevention | ~2020 | No layout shift, works without full JS, faster initial render |

**Deprecated/outdated:**
- **Sass/Less color functions for theming:** CSS `color-mix()` now native (2024), but CSS custom properties are simpler and more widely supported
- **`-webkit-` prefixes for gradients:** No longer needed as of 2023 (Safari 16+, Chrome 26+)
- **`@import` for theme files:** Use build-time bundling (Astro/Vite) for better performance

## Open Questions

1. **Should the baseplate pattern be subtle or prominent?**
   - What we know: Real LEGO baseplates have subtle grid lines; studs are more prominent
   - What's unclear: User preference for immersive vs. distracting backgrounds
   - Recommendation: Start subtle (1px grid lines, light gray). Phase 20 can add user controls or prefers-reduced-motion variants

2. **Should LEGO theme have multiple color variants (red baseplate, blue baseplate, etc.)?**
   - What we know: Requirements specify classic primary colors (red, blue, yellow, green)
   - What's unclear: Whether these should all appear simultaneously or as variants
   - Recommendation: Phase 18 uses all colors for different elements (red for links, yellow for borders, blue for accents). Variants are out of scope for v4.0 (see REQUIREMENTS.md)

3. **Should sidebar visibility be page-specific or route-based?**
   - What we know: Requirement says "all pages except Home"
   - What's unclear: How to detect "Home" (pathname, component name, prop)
   - Recommendation: Use pathname check (`Astro.url.pathname === '/'`) with `page-home` class on `<body>`. Simple, reliable, testable.

4. **Should baseplate pattern respond to viewport size (smaller grid on mobile)?**
   - What we know: Fixed 8px grid might feel too busy on small screens
   - What's unclear: Whether responsive grid spacing adds value or complexity
   - Recommendation: Start with fixed 8px grid. If mobile testing reveals issues, add media query to increase spacing to 12px or 16px on small viewports

## Sources

### Primary (HIGH confidence)

**Existing Codebase Analysis:**
- `/Users/pedf/workspace/bacilo.github.io/src/styles/themes.css` - Phase 14 theme system implementation (8 themes, `[data-theme]` pattern, custom properties)
- `/Users/pedf/workspace/bacilo.github.io/src/layouts/BaseLayout.astro` - FOUC prevention script, theme switcher integration
- `/Users/pedf/workspace/bacilo.github.io/src/components/ThemeSwitcher.astro` - localStorage persistence, theme application logic
- `/Users/pedf/workspace/bacilo.github.io/src/components/AuthorSidebar.astro` - Existing responsive pattern (768px breakpoint)
- `/Users/pedf/workspace/bacilo.github.io/src/components/portfolio/GitHubCard.astro` - Component theming pattern
- `/Users/pedf/workspace/bacilo.github.io/.planning/REQUIREMENTS.md` - Phase 18 success criteria (VIS-01, VIS-02, VIS-03, RESP-01)

**Official Documentation:**
- [Using CSS custom properties (variables) - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [repeating-linear-gradient() - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/repeating-linear-gradient)
- [radial-gradient() - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient)
- [Specificity - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity)
- [Attribute selectors - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Attribute_selectors)
- [prefers-color-scheme - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme)

### Secondary (MEDIUM confidence)

**Verified Web Sources:**
- [A Strategy Guide To CSS Custom Properties - Smashing Magazine](https://www.smashingmagazine.com/2018/05/css-custom-properties-strategy-guide/)
- [CSS Custom Properties Beyond the :root - Matthias Ott](https://matthiasott.com/notes/custom-properties-beyond-the-root)
- [Repeating Linear Gradient CSS - CSS Gradient](https://cssgradient.io/blog/repeating-linear-gradient-css/)
- [Learn CSS radial-gradient by Building Background Patterns - FreeCodeCamp](https://www.freecodecamp.org/news/css-radial-gradient/)
- [CSS { In Real Life } | CSS Halftone Patterns](https://css-irl.info/css-halftone-patterns/)
- [Dark Mode - The prefers-color-scheme Website Tutorial](https://www.ditdot.hr/en/dark-mode-website-tutorial)
- [Responsive Web Design Best Practices in 2026](https://www.blushush.co.uk/blogs/responsive-web-design-best-practices-in-2026)
- [Breakpoint: Responsive Design Breakpoints in 2025 - BrowserStack](https://www.browserstack.com/guide/responsive-design-breakpoints)

**LEGO Technical Reference:**
- [Track Planning for LEGO® Trains, Part 2: Track Geometry and Tips & Tricks - Monty's Trains](http://montystrains.net/workshop-blog/2018/2/22/track-planning-for-lego-trains-part-2-track-geometry-and-tips-tricks) - 0.8cm stud spacing specification

### Tertiary (LOW confidence)

None required. All findings verified with official docs or existing codebase.

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - All features are native CSS with excellent browser support; existing codebase proves viability
- Architecture: **HIGH** - Phase 14 implementation provides proven pattern; Phase 18 is pure extension work
- Pitfalls: **HIGH** - Common issues (z-index, style leakage, contrast) are well-documented; mobile testing standard practice

**Research date:** 2026-02-17
**Valid until:** 60 days (stable CSS features, minimal churn expected)

**Browser support notes:**
- CSS custom properties: 98%+ (IE11 is dead as of 2022)
- Repeating gradients: 99%+ (all modern browsers)
- Range syntax media queries: 95%+ (Chrome 104+, Firefox 63+, Safari 16.4+) - optional enhancement
- `@scope`: 93%+ (Chrome 118+, Edge 118+, Safari 17.4+) - not needed for Phase 18

**Key technical decisions inherited from Phase 14:**
1. Theme switching via `[data-theme]` attribute on `<html>` element
2. CSS custom properties for all theme-dependent values
3. Inline `<script is:inline>` for FOUC prevention
4. localStorage key: `'site-theme'`
5. 8 total themes: auto, light, dark, sepia, terminal, minecraft, lego, synthwave
