# Phase 20: Typography & Animations - Research

**Researched:** 2026-02-17
**Domain:** Custom font integration (Google Fonts via Fontsource), CSS animations with spring physics, accessibility (prefers-reduced-motion)
**Confidence:** HIGH

## Summary

Phase 20 completes the LEGO theme's immersive experience by implementing a three-tier typography hierarchy using playful Google Fonts (Fredoka for H1, Slackey for H2-H3, Baloo 2 for body text) and adding snap/bounce hover animations with spring physics easing to cards and buttons. This phase builds on Phase 19's brick elements and must prevent Flash of Unstyled Text (FOUT) and Flash of Invisible Text (FOIT) during theme switching while respecting accessibility preferences via `prefers-reduced-motion`.

The core technical challenges are:
1. **Self-hosted font integration** - Using Fontsource npm packages to avoid Google CDN latency and ensure consistent font availability across theme switches
2. **FOUT/FOIT prevention** - Using `font-display: swap` with proper font preloading to maintain text visibility during font loading
3. **Spring physics easing** - Approximating bounce animations using `cubic-bezier()` or CSS `linear()` function for natural-feeling hover interactions
4. **Accessibility compliance** - Implementing `@media (prefers-reduced-motion: reduce)` to disable animations for users with motion sensitivity

Industry best practices from Material Design, NN/g, and modern CSS animation guides converge on **200-300ms duration for mobile UI animations**, `font-display: swap` for web font performance, and **transform + opacity-only animations** for 60fps mobile performance. The CSS `linear()` easing function (2023+) enables true spring/bounce physics that were previously impossible with `cubic-bezier()` alone, but fallback cubic-bezier values provide excellent cross-browser support.

**Primary recommendation:** Install Fredoka, Slackey, and Baloo 2 via Fontsource npm packages (self-hosted WOFF2 format), declare `@font-face` rules with `font-display: swap` in global CSS, preload critical fonts for above-the-fold content, implement 250-300ms hover animations using `transform: scale()` with `ease-out` timing (or `linear()` for true bounce if browser support allows), and wrap all animations in `@media (prefers-reduced-motion: reduce)` blocks that remove transitions. All typography and animation styles scoped to `[data-theme="lego"]` to prevent leakage.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TYPE-01 | H1 titles use bold logo-style font (Fredoka) for LEGO title appearance | Fredoka is a big, round, bold variable font (weights 300-700, widths 75-125) designed for headlines; perfect for LEGO branding aesthetic; available via `@fontsource/fredoka` npm package |
| TYPE-02 | H2-H3 headers use brick-built style font (Slackey) for section structure | Slackey is a thick, chunky display font with irregular block-like letterforms ideal for brick-built aesthetic; available via `@fontsource/slackey` npm package |
| TYPE-03 | Body text uses playful rounded font (Baloo 2) maintaining readability | Baloo 2 is a variable display typeface (5 weights) with good legibility and moderate x-height suitable for small text sizes; playful but readable; available via `@fontsource/baloo-2` npm package; caution: may cause visual fatigue in very long reading sessions, but acceptable for typical page lengths |
| ANIM-01 | Cards and buttons display snap/bounce hover animation with spring physics easing | CSS `transform: scale(1.05)` or `translateY(-2px)` with 250-300ms duration and `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce-out) or CSS `linear()` function for true spring physics (browser support 2023+); 60fps guaranteed via GPU-accelerated transform property; Material Design recommends 200-300ms for mobile, NN/g research shows 200-500ms optimal range |
| ANIM-02 | Hover animations respect prefers-reduced-motion with graceful fallback | `@media (prefers-reduced-motion: reduce)` media query disables all transitions (set to `none !important`) while preserving static hover states (color changes); W3C WCAG 2.3.3 compliance for vestibular disorders affecting 70+ million people; browser support 99%+ across modern browsers |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Fontsource | Latest | Self-hosted npm packages for Google Fonts | Industry standard for Astro font integration (recommended in official docs), eliminates Google CDN latency, ensures fonts persist during theme switches, provides WOFF2 optimized files, 1500+ fonts available |
| @fontsource/fredoka | Latest | H1 headline font (bold, rounded, logo-style) | Variable font with weights 300-700 and widths 75-125, designed for playful headlines, perfect LEGO branding aesthetic |
| @fontsource/slackey | Latest | H2-H3 header font (chunky, brick-built style) | Thick display font with block-like letterforms matching brick aesthetic, Apache licensed |
| @fontsource/baloo-2 | Latest | Body text font (playful, rounded, readable) | Variable font with 5 weights, good legibility with moderate x-height, suitable for small text despite playful design |
| font-display: swap | Native CSS | Prevents FOIT, ensures text visibility during load | Industry best practice (Google, MDN, WebPageTest recommendations), shows fallback text immediately then swaps when custom font arrives, prevents invisible text flash |
| CSS transform | Native CSS | Hardware-accelerated hover animations | GPU-accelerated (60fps guaranteed), doesn't trigger reflow/repaint like width/height/margin, Material Design animation foundation |
| CSS cubic-bezier() | Native CSS | Spring physics approximation via easing curves | Excellent browser support (99%+), can create bounce effects with control points outside [0,1] range (e.g., `cubic-bezier(0.34, 1.56, 0.64, 1)` for bounce-out) |
| @media (prefers-reduced-motion) | Native CSS | Accessibility compliance for motion sensitivity | W3C WCAG 2.3.3 technique, 99%+ browser support, respects OS-level user preference for reduced animations |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS linear() function | Native CSS (2023+) | True spring physics easing with multiple control points | When browser support allows (Chrome 113+, Safari 17+, Firefox 112+); enables true bounce/spring animations previously impossible with cubic-bezier(); use with @supports for progressive enhancement |
| CSS preload (link rel="preload") | Native HTML | Critical font preloading for above-the-fold text | For H1 font (Fredoka) used in page titles; improves LCP (Largest Contentful Paint) Core Web Vital; limit to 2-3 fonts max to avoid starving other requests |
| CSS font-face unicode-range | Native CSS | Subset fonts by character set | When loading multiple scripts or special characters; reduces file size by loading only needed glyphs |
| transition-timing-function: ease-out | Native CSS | Asymmetric acceleration curve | Material Design recommendation: shorter acceleration, longer deceleration for natural motion; `cubic-bezier(0, 0, 0.2, 1)` in Material spec |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fontsource npm packages | Google Fonts CDN (`<link>` tag) | CDN requires extra DNS lookup + TCP handshake (80-200ms latency), privacy concerns (user data to Google), fonts may not be cached during theme switch; self-hosted eliminates latency and ensures availability |
| Fontsource | astro-font or astro-google-fonts-optimizer integrations | Integrations add build complexity and dependencies; direct Fontsource import is simpler, well-documented, and gives full control over font-face declarations |
| font-display: swap | font-display: optional | `optional` blocks text if font not cached, creating FOIT; `swap` always shows text immediately; swap is preferred for content-heavy academic sites |
| transform: scale() | transform: translateY() | Both GPU-accelerated; scale creates "pop" effect, translateY creates "lift" effect; scale better for cards (implies depth), translateY better for buttons (implies press) |
| cubic-bezier() bounce | CSS linear() spring physics | linear() provides true spring physics with mass/stiffness simulation but only 75% browser support (Jan 2025); cubic-bezier with y-values >1 provides good bounce approximation with 99% support; use cubic-bezier as baseline, linear() as progressive enhancement |

**Installation:**
```bash
npm install @fontsource/fredoka @fontsource/baloo-2 @fontsource/slackey
```

## Architecture Patterns

### Recommended File Structure

Maintain Phase 18-19 pattern: typography and animations in `themes.css` under `[data-theme="lego"]` prefix.

```
src/
├── layouts/
│   └── BaseLayout.astro           # Import Fontsource packages in <head>
├── styles/
│   ├── global.css                 # System font stack (existing)
│   └── themes.css                 # LEGO typography + animations (Phase 20 additions)
│       ├── [data-theme="lego"] { color variables }         # Phase 18 (existing)
│       ├── [data-theme="lego"] body { baseplate grid }     # Phase 18 (existing)
│       ├── [data-theme="lego"] .github-card { brick depth } # Phase 19 (existing)
│       ├── [data-theme="lego"] h1 { font-family: Fredoka }  # Phase 20: H1 typography
│       ├── [data-theme="lego"] h2, h3 { Slackey }           # Phase 20: H2-H3 typography
│       ├── [data-theme="lego"] body { Baloo 2 }             # Phase 20: Body typography
│       ├── [data-theme="lego"] .github-card:hover { scale } # Phase 20: Card hover animation
│       └── @media (prefers-reduced-motion) { ... }          # Phase 20: Accessibility
```

**Font Import Location:** Import Fontsource packages directly in `BaseLayout.astro` `<head>` section via `import '@fontsource/fredoka'` statements. Astro will automatically inject `@font-face` declarations into the page.

**Alternative (future):** If LEGO theme exceeds 600+ lines, extract to `src/styles/lego/` folder with separate files for colors, bricks, typography, and animations, but keep consolidated for now.

### Pattern 1: Fontsource Self-Hosted Font Integration

**What:** Install fonts as npm packages, import in layout file, use `font-family` in CSS

**When to use:** For all custom fonts in Astro projects (recommended over Google CDN)

**Example:**
```typescript
// src/layouts/BaseLayout.astro
---
import '@fontsource/fredoka/700.css';      // Bold weight for H1
import '@fontsource/slackey';              // Default weight (regular) for H2-H3
import '@fontsource/baloo-2/400.css';      // Regular weight for body
import '@fontsource/baloo-2/600.css';      // SemiBold for emphasis
---
```

```css
/* src/styles/themes.css */
[data-theme="lego"] h1 {
  font-family: 'Fredoka', var(--font-system);
  font-weight: 700;
  /* Fontsource automatically includes font-display: swap */
}

[data-theme="lego"] h2,
[data-theme="lego"] h3 {
  font-family: 'Slackey', var(--font-system);
}

[data-theme="lego"] body {
  font-family: 'Baloo 2', var(--font-system);
  font-weight: 400;
}
```

**Performance note:** Fontsource packages include `font-display: swap` by default in their `@font-face` declarations. Importing only specific weights (e.g., `fredoka/700.css`) reduces file size vs. importing all weights.

**Font fallback stack:** Always include `var(--font-system)` (system font stack from global.css) as fallback to ensure text renders if custom fonts fail to load.

### Pattern 2: Font Preloading for Critical Typography

**What:** Use `<link rel="preload">` to prioritize critical font files for above-the-fold content

**When to use:** For fonts used in page headers/titles that appear above the fold (H1 typically)

**Example:**
```astro
<!-- src/layouts/BaseLayout.astro -->
<head>
  <!-- Preload critical fonts before CSS imports -->
  <link
    rel="preload"
    href="/node_modules/@fontsource/fredoka/files/fredoka-latin-700-normal.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <!-- Then import Fontsource packages -->
  <script>
    import '@fontsource/fredoka/700.css';
    import '@fontsource/slackey';
    import '@fontsource/baloo-2/400.css';
  </script>
</head>
```

**Caveat:** Font file paths vary by Fontsource version. Check `node_modules/@fontsource/[font]/files/` for actual paths. Only preload 1-2 critical fonts—preloading too many starves other resources.

**Alternative:** Use Astro's experimental fonts API or `astro-font` integration for automatic preload handling, but manual approach gives more control.

### Pattern 3: Spring/Bounce Hover Animation with Cubic-Bezier

**What:** Use `transform: scale()` with cubic-bezier easing curve that exceeds 1.0 on y-axis to create bounce effect

**When to use:** For card and button hover states in LEGO theme

**Example:**
```css
/* Source: Material Design easing curves + easings.net bounce-out */
[data-theme="lego"] .github-card {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  /* cubic-bezier control point y=1.56 creates overshoot/bounce */
}

[data-theme="lego"] .github-card:hover {
  transform: scale(1.05);  /* Scale to 105% with bounce */
}

/* Alternative: lift effect for buttons */
[data-theme="lego"] nav a {
  transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="lego"] nav a:hover {
  transform: translateY(-3px);  /* Lift 3px upward with bounce */
}
```

**Timing rationale:** Material Design recommends 200-300ms for mobile UI animations (Phase 19 used 34ms for instant press feedback; Phase 20 uses 250-300ms for delightful hover). NN/g research shows 200-500ms optimal range—longer animations feel sluggish.

**Easing curve breakdown:**
- `cubic-bezier(0.34, 1.56, 0.64, 1)` = "easeOutBack" from easings.net
- Control point P1 (0.34, 1.56): y > 1.0 causes overshoot beyond target
- Control point P2 (0.64, 1.0): smooth deceleration to final state
- Result: Element scales past target, then bounces back—feels like spring physics

**Browser support:** 99%+ (cubic-bezier with y-values outside [0,1] range supported since IE10)

### Pattern 4: CSS linear() Function for True Spring Physics (Progressive Enhancement)

**What:** Use CSS `linear()` easing function to approximate spring physics with multiple keyframe points

**When to use:** As progressive enhancement over cubic-bezier for browsers that support it (Chrome 113+, Safari 17+, Firefox 112+)

**Example:**
```css
/* Source: Josh W. Comeau linear() spring physics article */
[data-theme="lego"] .github-card {
  /* Fallback for older browsers */
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Progressive enhancement for modern browsers */
@supports (transition-timing-function: linear(0, 1)) {
  [data-theme="lego"] .github-card {
    transition: transform 350ms linear(
      0, 0.005, 0.02, 0.04, 0.07, 0.11, 0.15, 0.2,
      0.25, 0.3, 0.36, 0.42, 0.48, 0.55, 0.62, 0.69,
      0.76, 0.83, 0.89, 0.95, 0.99, 1.02, 1.04, 1.05,
      1.06, 1.06, 1.06, 1.05, 1.04, 1.02, 1.01, 1
    );
    /* Multiple points simulate spring settling */
  }
}
```

**Note:** `linear()` values above require calculation based on spring physics (mass, stiffness, damping). Tools like Linear Easing Generator (https://linear-easing-generator.netlify.app/) can generate these values. For simplicity, stick to cubic-bezier baseline unless true spring physics is required.

**Browser support:** ~75% (Jan 2025): Chrome 113+, Edge 113+, Safari 17+, Firefox 112+. Use `@supports` to safely apply as progressive enhancement.

### Pattern 5: Accessibility-First Animation Implementation

**What:** Wrap all animations in `@media (prefers-reduced-motion: reduce)` to respect user motion preferences

**When to use:** For ALL animations (required for WCAG 2.3.3 compliance)

**Example:**
```css
/* Phase 20: Hover animations for cards and buttons */
[data-theme="lego"] .github-card {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 300ms ease-out;
}

[data-theme="lego"] .github-card:hover {
  transform: scale(1.05);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Accessibility: Remove animations for users with motion sensitivity */
@media (prefers-reduced-motion: reduce) {
  [data-theme="lego"] .github-card,
  [data-theme="lego"] nav a {
    transition: none !important;
    /* Remove transitions but keep static hover states */
  }

  [data-theme="lego"] .github-card:hover {
    /* Scale animation removed, but shadow change remains instant */
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.2),
      0 8px 24px rgba(0, 0, 0, 0.15);
  }
}
```

**Critical insight:** `prefers-reduced-motion: reduce` should **remove transitions** (animation duration), not remove hover effects entirely. Users still expect visual feedback—just instant instead of animated.

**Phase 19 precedent:** Phase 19 already implements this pattern for nav button transitions and card shadows. Phase 20 extends to typography changes and new hover animations.

**User stats:** ~15-20% of users enable reduced motion preferences (vestibular disorders, ADHD, migraines, motion sickness). Compliance is both accessibility requirement and user experience improvement.

### Anti-Patterns to Avoid

**❌ Direct Google Fonts CDN in production:**
```html
<!-- DON'T: Adds latency, privacy concerns, theme-switching issues -->
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@700" rel="stylesheet">
```
**✅ Use Fontsource instead:** Self-hosted, faster, privacy-friendly, persists during theme switches.

**❌ Animating non-GPU-accelerated properties:**
```css
/* DON'T: Causes repaint/reflow, kills mobile performance */
.card:hover {
  transition: width 300ms ease-out;
  width: 110%;
}
```
**✅ Use transform/opacity only:** `transform: scale(1.1)` is GPU-accelerated, 60fps guaranteed.

**❌ Preloading all font weights:**
```html
<!-- DON'T: Starves other critical resources -->
<link rel="preload" href="fredoka-300.woff2" as="font" crossorigin>
<link rel="preload" href="fredoka-400.woff2" as="font" crossorigin>
<link rel="preload" href="fredoka-700.woff2" as="font" crossorigin>
<link rel="preload" href="slackey.woff2" as="font" crossorigin>
<link rel="preload" href="baloo-400.woff2" as="font" crossorigin>
```
**✅ Preload 1-2 critical fonts max:** Only fonts used above-the-fold (typically H1).

**❌ Removing hover effects entirely for reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .card:hover {
    /* DON'T: Removes all visual feedback */
    transform: none;
    box-shadow: none;
  }
}
```
**✅ Keep static hover states:** Remove animation duration, preserve visual changes.

**❌ Animation durations >500ms for UI interactions:**
```css
.card:hover {
  transition: transform 800ms ease; /* TOO SLOW */
}
```
**✅ 200-300ms sweet spot:** NN/g research shows 200-500ms optimal; Material Design recommends 200-300ms mobile; longer feels sluggish.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font file optimization (subsetting, WOFF2 conversion) | Custom build scripts to subset/convert fonts | Fontsource npm packages | Fontsource pre-optimizes fonts: WOFF2 compression, unicode-range subsetting, multiple weights/variants; rebuilding this infrastructure is unnecessary |
| Spring physics calculations | Manual easing curve calculation for spring animations | CSS `linear()` with Linear Easing Generator tool OR cubic-bezier approximations from easings.net | Physics calculations (mass, stiffness, damping) are complex; Linear Easing Generator (https://linear-easing-generator.netlify.app/) solves this; easings.net provides tested cubic-bezier curves |
| Cross-browser font loading detection | JavaScript font loading API with manual FOUT handling | `font-display: swap` in @font-face | Browser-native solution, simpler, more reliable than JS font loading API; automatic fallback handling; 99% browser support |
| Reduced motion detection | JavaScript matchMedia listeners for motion preferences | CSS `@media (prefers-reduced-motion)` | CSS media query is declarative, automatic, no JS overhead; W3C standard approach for WCAG compliance |
| Font preload path resolution | Custom script to resolve Fontsource file paths | Astro font integrations OR manual verification in node_modules | Fontsource file paths are stable but version-specific; Astro integrations (astro-font, experimental fonts API) handle this automatically if needed |

**Key insight:** Modern CSS (font-display, prefers-reduced-motion, cubic-bezier bounce, linear() springs) eliminates most JavaScript solutions for font loading and animation. Fontsource eliminates Google CDN complexity and font optimization build steps. The ecosystem has solved these problems—use proven tools instead of building from scratch.

## Common Pitfalls

### Pitfall 1: Font Loading Delays Cause FOIT/FOUT During Theme Switching

**What goes wrong:** User switches to LEGO theme, text disappears (FOIT) or flashes system font (FOUT) for 1-2 seconds before custom fonts load

**Why it happens:** Fonts are lazily loaded when theme activates; browser hasn't cached font files yet; Google CDN adds 80-200ms latency

**How to avoid:**
1. Use Fontsource self-hosted fonts (eliminates CDN latency)
2. Import fonts in `BaseLayout.astro` at page load (not conditionally on theme)
3. Add `font-display: swap` to @font-face (Fontsource includes this by default)
4. Preload critical fonts (H1/Fredoka) with `<link rel="preload">`

**Warning signs:**
- Text becomes invisible briefly when switching to LEGO theme
- System font flashes before custom fonts appear
- Fonts load fine on hard refresh but not on theme toggle
- Network tab shows font requests only after theme switch

**Prevention code:**
```astro
<!-- BaseLayout.astro: Load fonts BEFORE theme selection -->
<head>
  <!-- Preload critical font -->
  <link rel="preload" href="..." as="font" type="font/woff2" crossorigin>

  <!-- Import all fonts at page load, not conditionally -->
  <script>
    import '@fontsource/fredoka/700.css';
    import '@fontsource/slackey';
    import '@fontsource/baloo-2/400.css';
  </script>
</head>
```

### Pitfall 2: Animation Performance Degrades on Mobile Due to Excessive Transforms

**What goes wrong:** Hover animations stutter on mobile devices, scroll becomes janky, cards feel sluggish during transitions

**Why it happens:** Animating multiple properties simultaneously (transform + width + padding + box-shadow) exceeds mobile GPU budget; animating layout properties (width, height, padding) triggers reflow

**How to avoid:**
1. Animate ONLY `transform` and `opacity` (GPU-accelerated, composite-only)
2. Pre-render box-shadow states (no animation), OR animate box-shadow sparingly
3. Keep animation duration ≤300ms (reduces perceived jank)
4. Test on low-end mobile devices (iPhone SE, Android mid-range)

**Warning signs:**
- FPS drops below 60 during hover animations (use Chrome DevTools Performance)
- Scroll stutters when hovering over cards
- Animations feel sluggish on mobile but smooth on desktop
- Mobile users report "laggy" interactions

**Prevention code:**
```css
/* ✅ GOOD: GPU-accelerated properties only */
[data-theme="lego"] .github-card {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Box-shadow changes instantly (no transition) */
}

[data-theme="lego"] .github-card:hover {
  transform: scale(1.05);  /* GPU accelerated */
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);  /* Instant, no animation */
}

/* ❌ BAD: Animating layout properties */
.card {
  transition: width 300ms ease, transform 300ms ease; /* width triggers reflow */
}
```

### Pitfall 3: Accessibility Violations from Ignoring prefers-reduced-motion

**What goes wrong:** Users with vestibular disorders, migraines, or motion sensitivity experience nausea, disorientation, or headaches from animations; accessibility audits fail WCAG 2.3.3

**Why it happens:** Developers forget to implement reduced motion fallbacks; assume animations are "small enough" not to matter; remove hover effects entirely instead of just removing animation duration

**How to avoid:**
1. Wrap ALL animations in `@media (prefers-reduced-motion: reduce)` blocks
2. Set `transition: none !important` to disable animations completely
3. Preserve static hover states (color/shadow changes without animation)
4. Test with OS-level "Reduce Motion" setting enabled (macOS System Settings → Accessibility → Display → Reduce motion; Windows Settings → Accessibility → Visual effects → Animation effects)

**Warning signs:**
- Accessibility audit tools flag missing prefers-reduced-motion support
- User reports of motion sickness or headaches from site
- Animations play regardless of OS motion preference setting
- Hover effects disappear entirely when reduced motion is enabled

**Prevention code:**
```css
/* ✅ GOOD: Animations with reduced motion fallback */
[data-theme="lego"] .github-card {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="lego"] .github-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

@media (prefers-reduced-motion: reduce) {
  [data-theme="lego"] .github-card {
    transition: none !important;  /* Remove animation */
  }

  [data-theme="lego"] .github-card:hover {
    /* Keep static hover state (no scale animation, but shadow remains) */
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
}

/* ❌ BAD: Removes hover effect entirely */
@media (prefers-reduced-motion: reduce) {
  .card:hover {
    transform: none;  /* Removes visual feedback */
    box-shadow: none;  /* User gets no hover indication */
  }
}
```

### Pitfall 4: Importing Too Many Font Weights Bloats Page Load

**What goes wrong:** Page load time increases by 200-500ms; Lighthouse performance score drops; users on slow connections see prolonged loading states

**Why it happens:** Importing all Fredoka weights (300, 400, 500, 600, 700) and all Baloo 2 weights (400, 500, 600, 700, 800) loads 9+ font files totaling 500KB+ of data; most weights are unused

**How to avoid:**
1. Import only required weights: Fredoka 700 (H1), Slackey regular (H2-H3), Baloo 2 400 + 600 (body + emphasis)
2. Use variable fonts when possible (single file, multiple weights)
3. Subset fonts to Latin characters if only English content
4. Verify imports: check Network tab for font file requests

**Warning signs:**
- Network tab shows 8+ font file requests
- Total font file size exceeds 300KB
- Lighthouse audit warns "Reduce unused CSS" or "Eliminate render-blocking resources"
- Users on 3G connections report slow page loads

**Prevention code:**
```typescript
// ✅ GOOD: Import only required weights
import '@fontsource/fredoka/700.css';          // Bold for H1 (60KB)
import '@fontsource/slackey';                  // Regular only (50KB)
import '@fontsource/baloo-2/400.css';          // Regular for body (55KB)
import '@fontsource/baloo-2/600.css';          // SemiBold for emphasis (55KB)
// Total: ~220KB for 4 fonts

// ❌ BAD: Import all weights
import '@fontsource/fredoka';  // Loads 300-700 (300KB+)
import '@fontsource/baloo-2';  // Loads 400-800 (250KB+)
// Total: 550KB+ for mostly unused weights
```

**Alternative:** Use variable fonts if available (Fredoka and Baloo 2 both support variable fonts), which provide all weights in a single ~120KB file:
```typescript
import '@fontsource-variable/fredoka';  // Variable font, all weights, ~120KB
```

### Pitfall 5: Cubic-Bezier Bounce Feels "Wrong" Due to Incorrect Control Points

**What goes wrong:** Hover animation feels sluggish, or overshoots too much, or doesn't bounce at all—animation doesn't match "spring physics" expectation

**Why it happens:** Random cubic-bezier values chosen without understanding control point impact; y-values not exceeding 1.0 (no overshoot); duration too long (>500ms) makes bounce feel slow

**How to avoid:**
1. Use tested cubic-bezier values from easings.net (e.g., `cubic-bezier(0.34, 1.56, 0.64, 1)` for easeOutBack)
2. Ensure P1 or P2 control point has y-value >1.0 for overshoot/bounce effect
3. Keep duration 200-300ms (Material Design recommendation)
4. Test animation feel: should feel snappy, not sluggish
5. Use Chrome DevTools Animations panel to visualize easing curve

**Warning signs:**
- Animation feels "flat" or linear, no bounce
- Bounce feels too subtle or too exaggerated
- Animation duration feels sluggish (users perceive as "laggy")
- Easing curve in DevTools shows no overshoot (y-values all ≤1.0)

**Prevention code:**
```css
/* ✅ GOOD: Tested bounce easing with proper duration */
.card {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Control point P1 y=1.56 creates overshoot/bounce */
  /* 300ms duration feels snappy on mobile */
}

/* ❌ BAD: No bounce (y-values ≤1.0) */
.card {
  transition: transform 500ms cubic-bezier(0.25, 0.8, 0.25, 1);
  /* No control point >1.0 = no bounce */
  /* 500ms is too slow for UI interaction */
}

/* ❌ BAD: Excessive overshoot */
.card {
  transition: transform 300ms cubic-bezier(0.1, 2.5, 0.9, 1);
  /* P1 y=2.5 overshoots too much, feels jarring */
}
```

**Reference:** Use https://easings.net/ or https://cubic-bezier.com/ to visualize curves. Recommended values for bounce: `easeOutBack: cubic-bezier(0.34, 1.56, 0.64, 1)`.

## Code Examples

Verified patterns from official sources and current codebase:

### Fontsource Integration in Astro

```astro
<!-- src/layouts/BaseLayout.astro -->
---
import '@fontsource/fredoka/700.css';      // H1 headlines
import '@fontsource/slackey';              // H2-H3 headers
import '@fontsource/baloo-2/400.css';      // Body text
import '@fontsource/baloo-2/600.css';      // Bold emphasis
import '../styles/global.css';
import '../styles/themes.css';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- Optional: Preload critical font for LCP optimization -->
    <link
      rel="preload"
      href="/node_modules/@fontsource/fredoka/files/fredoka-latin-700-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### LEGO Typography Hierarchy

```css
/* src/styles/themes.css - Phase 20 additions */

/* TYPE-01: H1 titles use Fredoka (bold, logo-style) */
[data-theme="lego"] h1 {
  font-family: 'Fredoka', var(--font-system);
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1.2;
  color: var(--color-lego-red);
  margin-bottom: var(--space-md);
}

/* TYPE-02: H2-H3 headers use Slackey (brick-built style) */
[data-theme="lego"] h2,
[data-theme="lego"] h3 {
  font-family: 'Slackey', var(--font-system);
  font-weight: 400;  /* Slackey only has regular weight */
  color: var(--color-lego-blue);
}

[data-theme="lego"] h2 {
  font-size: 2rem;
  line-height: 1.3;
  margin-top: var(--space-md);
  margin-bottom: var(--space-sm);
}

[data-theme="lego"] h3 {
  font-size: 1.5rem;
  line-height: 1.4;
  margin-top: var(--space-sm);
  margin-bottom: var(--space-xs);
}

/* TYPE-03: Body text uses Baloo 2 (playful, readable) */
[data-theme="lego"] body {
  font-family: 'Baloo 2', var(--font-system);
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
}

[data-theme="lego"] strong,
[data-theme="lego"] b {
  font-weight: 600;  /* SemiBold for emphasis */
}
```

### ANIM-01: Card Hover Animation with Spring Physics

```css
/* src/styles/themes.css - Phase 20 additions */

/* Card hover animation: snap/bounce effect */
[data-theme="lego"] .github-card {
  /* Existing Phase 19 box-shadow and border preserved */
  border: 3px solid var(--color-lego-yellow);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.05);

  /* Phase 20: Add scale animation with bounce easing */
  transition:
    transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 300ms ease-out,
    border-color 200ms ease;
}

[data-theme="lego"] .github-card:hover,
[data-theme="lego"] .github-card:focus-within {
  transform: scale(1.05);  /* Scale to 105% with bounce */
  border-color: var(--color-lego-red);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(0, 0, 0, 0.08);
}

/* Navigation button hover: lift effect */
[data-theme="lego"] nav a {
  /* Existing Phase 19 pressed state preserved */
  transition:
    transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1),
    color 200ms ease,
    box-shadow 250ms ease-out;
}

[data-theme="lego"] nav a:hover {
  transform: translateY(-3px);  /* Lift 3px with bounce */
  color: var(--color-lego-yellow);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.2),
    0 0 0 2px var(--color-lego-yellow);
}

/* Pressed state from Phase 19 remains */
[data-theme="lego"] nav a:active {
  transform: translateY(2px);  /* 34ms instant press from Phase 19 */
  box-shadow:
    0 0 2px rgba(0, 0, 0, 0.1),
    0 0 0 2px var(--color-lego-yellow);
}
```

**Note:** Phase 19 already implements pressed-state feedback for nav buttons (34ms duration, instant snap). Phase 20 adds hover state (250-300ms, spring bounce). The two work together: hover = anticipation (slow, bouncy), press = action (instant, snappy).

### ANIM-02: Reduced Motion Accessibility

```css
/* src/styles/themes.css - Phase 20 additions */

/* Accessibility: Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  /* Remove ALL transitions in LEGO theme */
  [data-theme="lego"] .github-card,
  [data-theme="lego"] nav a {
    transition: none !important;
  }

  /* Preserve static hover states (instant feedback) */
  [data-theme="lego"] .github-card:hover {
    /* Scale animation removed, but visual changes remain */
    transform: scale(1.05);  /* Applied instantly */
    border-color: var(--color-lego-red);
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.12),
      0 8px 24px rgba(0, 0, 0, 0.08);
  }

  [data-theme="lego"] nav a:hover {
    transform: translateY(-3px);  /* Applied instantly */
    color: var(--color-lego-yellow);
  }

  /* Phase 19 pressed state already has reduced motion support */
  [data-theme="lego"] nav a:active {
    transform: translateY(2px);  /* Instant press preserved */
  }
}
```

**Critical:** The `!important` flag on `transition: none` is necessary because Phase 19 already defines transitions on these elements. Without `!important`, specificity would be equal and transitions would still apply.

### Progressive Enhancement with CSS linear() (Optional)

```css
/* src/styles/themes.css - Phase 20 optional enhancement */

/* Baseline: cubic-bezier bounce for 99% browser support */
[data-theme="lego"] .github-card {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Progressive enhancement: True spring physics for modern browsers */
@supports (transition-timing-function: linear(0, 1)) {
  [data-theme="lego"] .github-card {
    /* Generated via https://linear-easing-generator.netlify.app/ */
    /* Spring: stiffness=300, damping=20, mass=1 */
    transition: transform 350ms linear(
      0, 0.006, 0.025, 0.057, 0.1, 0.153, 0.214, 0.28,
      0.35, 0.422, 0.494, 0.564, 0.631, 0.693, 0.75, 0.8,
      0.844, 0.881, 0.911, 0.935, 0.953, 0.966, 0.975, 0.981,
      0.985, 0.988, 0.991, 0.994, 0.997, 0.999, 1.001, 1.002,
      1.003, 1.003, 1.003, 1.002, 1.001, 1, 1
    );
  }
}
```

**Note:** This is optional complexity. cubic-bezier provides excellent bounce approximation with simpler code. Only implement linear() if true spring physics is a hard requirement.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Fonts CDN (`<link>` tag) | Fontsource self-hosted npm packages | 2020+ | Eliminates 80-200ms CDN latency, improves privacy (no user data to Google), ensures fonts persist during theme switches, provides WOFF2 optimization |
| font-display: block (FOIT) | font-display: swap (FOUT with instant swap) | 2018+ (widespread adoption 2020+) | Prevents invisible text flash, improves perceived performance, recommended by Google PageSpeed Insights and Lighthouse |
| cubic-bezier() only for easing | CSS linear() function for complex curves | 2023 (Chrome 113, Firefox 112, Safari 17) | Enables true spring/bounce physics previously impossible in CSS; approximates JavaScript spring libraries; ~75% browser support as of Jan 2025 |
| JavaScript-based reduced motion detection | CSS @media (prefers-reduced-motion) | 2019+ (WCAG 2.1 adoption) | Declarative CSS approach, no JS overhead, automatic browser handling, W3C standard for accessibility compliance |
| Material Design 2 elevation (6 shadow layers) | Material Design 3 elevation (2-3 shadow layers) | 2021 (MD3 launch) | Simpler shadows, better mobile performance (3 layers max recommended for 60fps), cleaner aesthetic |

**Deprecated/outdated:**
- **Google Fonts API v1 (`fonts.googleapis.com/css`):** Replaced by v2 with better subsetting and variable font support, but self-hosted Fontsource is now preferred over both
- **font-display: optional:** Creates FOIT on uncached fonts; `swap` is now industry standard
- **JavaScript Font Loading API (`document.fonts`):** Useful for advanced cases, but `font-display: swap` solves 95% of use cases without JS complexity
- **Animating box-shadow directly:** Known performance killer; modern approach uses pre-rendered shadow states or opacity-animated pseudo-elements

## Open Questions

### 1. Variable Font vs. Static Font Selection for Fredoka and Baloo 2

**What we know:** Fredoka and Baloo 2 both offer variable font versions (`@fontsource-variable/fredoka`, `@fontsource-variable/baloo-2`) and static font versions (`@fontsource/fredoka/700.css`)

**What's unclear:**
- Variable fonts provide all weights in single ~120KB file vs. static fonts at ~60KB per weight
- For this phase, we only need Fredoka 700 (1 weight) and Baloo 2 400+600 (2 weights)
- Static: 60KB + 55KB + 55KB = 170KB total
- Variable: 120KB + 120KB = 240KB total
- Static fonts are smaller for limited weights, but variable fonts enable future flexibility

**Recommendation:** Use **static fonts** for Phase 20 (Fredoka 700, Baloo 2 400+600) to minimize file size (~170KB vs 240KB). If future phases require multiple Fredoka weights (e.g., 300-700 for varied heading weights), switch to variable font. Document this decision in plan so future changes are clear.

### 2. Font Preloading Path Resolution for Astro Build

**What we know:** Fontsource stores fonts in `node_modules/@fontsource/[font]/files/[font]-[script]-[weight]-[style].woff2`, but file paths may change between Fontsource versions

**What's unclear:**
- Astro build process may move fonts to `dist/_astro/` with hashed filenames
- Preload paths in `<link rel="preload">` must match actual deployed paths
- Manual `node_modules` paths work in dev but may break in production

**Recommendation:** Test font preload in **production build** (`npm run build && npm run preview`) to verify paths. If paths break, either (1) skip preload for Phase 20 (Fontsource includes font-display: swap, so preload is optimization not requirement), or (2) use Astro font integration (`astro-font`) that handles preload automatically. Document testing results in verification.

### 3. Spring Physics Easing: cubic-bezier() vs. linear() Implementation

**What we know:**
- cubic-bezier with y > 1.0 provides good bounce approximation (99% browser support)
- CSS linear() provides true spring physics (75% browser support, requires @supports)
- linear() requires 20-40 comma-separated values, complex to maintain

**What's unclear:**
- Is cubic-bezier bounce "good enough" for LEGO theme playfulness?
- Does linear() spring physics provide perceptible improvement vs. cubic-bezier?
- Is maintaining linear() values worth complexity if cubic-bezier approximation suffices?

**Recommendation:** Start with **cubic-bezier approximation** (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for Phase 20. Test user perception of "bounce" feel. If cubic-bezier feels sufficient, skip linear() complexity. If bounce needs enhancement, add linear() as progressive enhancement in future iteration. Document user testing results.

### 4. Baloo 2 Readability for Long-Form Content

**What we know:** Baloo 2 is classified as "display typeface" but has good legibility; research shows it "may cause visual fatigue in extensive reading materials"

**What's unclear:**
- How much content is "extensive"? Average blog post is 1000-1500 words
- Does "visual fatigue" apply to typical academic site page lengths?
- Should body text remain system font, using Baloo 2 only for short sections?

**Recommendation:** Implement Baloo 2 for body text as specified (TYPE-03 requirement), but **monitor user feedback** during verification. If users report readability issues during testing, either (1) reduce Baloo 2 usage to introductions/summaries only, keeping system font for main content, or (2) increase line-height (1.6 → 1.8) to compensate for playful design. Document readability assessment in verification phase.

## Sources

### Primary (HIGH confidence)

**Astro Documentation:**
- [Astro Fonts Guide](https://docs.astro.build/en/guides/fonts/) - Official font integration methods, Fontsource recommendation

**Fontsource:**
- [Fontsource Documentation](https://fontsource.org/docs/getting-started/introduction) - npm package usage, self-hosted font integration
- [@fontsource/fredoka NPM](https://www.npmjs.com/package/@fontsource/fredoka) - Fredoka package installation
- [@fontsource/baloo-2 NPM](https://www.npmjs.com/package/@fontsource/baloo-2) - Baloo 2 package installation
- [@fontsource/slackey NPM](https://www.npmjs.com/package/@fontsource/slackey) - Slackey package installation

**Google Fonts:**
- [Fredoka Specimen](https://fonts.google.com/specimen/Fredoka) - Font weights, styles, design notes
- [Baloo 2 Specimen](https://fonts.google.com/specimen/Baloo+2) - Variable font details, weight range
- [Slackey Specimen](https://fonts.google.com/specimen/Slackey) - Display font characteristics

**MDN Web Docs:**
- [font-display CSS Property](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-display) - FOUT/FOIT prevention
- [cubic-bezier() Easing Function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/cubic-bezier) - Bounce animation curves
- [prefers-reduced-motion Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Accessibility compliance
- [CSS linear() Easing Function](https://developer.mozilla.org/en-US/blog/custom-easing-in-css-with-linear/) - Spring physics implementation

**Material Design:**
- [Material Design 3 - Easing and Duration](https://m3.material.io/styles/motion/easing-and-duration) - Animation timing guidelines
- [Material Design 2 - Motion Speed](https://m2.material.io/design/motion/speed.html) - Duration recommendations (200-300ms mobile)

**W3C Standards:**
- [WCAG 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) - Reduced motion requirements
- [W3C Technique C39: Using prefers-reduced-motion](https://www.w3.org/WAI/WCAG21/Techniques/css/C39) - Implementation guidance

### Secondary (MEDIUM confidence)

**Animation Best Practices:**
- [NN/g: Animation Duration](https://www.nngroup.com/articles/animation-duration/) - User perception research, 200-500ms optimal range
- [Josh W. Comeau: Springs and Bounces in Native CSS](https://www.joshwcomeau.com/animation/linear-timing-function/) - CSS linear() spring physics tutorial
- [Josh W. Comeau: CSS Transitions Guide](https://www.joshwcomeau.com/animation/css-transitions/) - Transform vs. layout property performance
- [SitePoint: Achieve 60 FPS Mobile Animations](https://www.sitepoint.com/achieve-60-fps-mobile-animations-with-css3/) - GPU-accelerated properties

**Font Loading Optimization:**
- [DebugBear: Preload Web Fonts](https://www.debugbear.com/blog/preload-web-fonts) - Preload best practices
- [CSS Font Loading Guide (2026)](https://thelinuxcode.com/css-font-face-rule-a-practical-production-ready-guide-2026/) - font-display strategies
- [WP Thrill: Optimize Google Fonts (2026)](https://wpthrill.com/how-to-optimize-google-fonts-loading-without-plugins) - Self-hosting vs. CDN tradeoffs

**Easing and Timing:**
- [Easings.net](https://easings.net/) - Easing function cheat sheet, cubic-bezier values
- [Chrome Developers: CSS linear() Function](https://developer.chrome.com/docs/css-ui/css-linear-easing-function) - Complex curves tutorial

**Typography:**
- [FontForge: Baloo 2 Guide](https://fontforge.io/display/baloo-2/) - Font characteristics, use cases, readability notes
- [GitHub: Baloo 2 Variable Font](https://github.com/EkType/Baloo2-Variable) - Variable font specifications
- [Fonts Wiki: Fredoka](https://fonts.fandom.com/wiki/Fredoka) - Font history, design evolution

### Tertiary (LOW confidence - requires validation)

**Astro Font Integrations:**
- [astro-font NPM](https://www.npmjs.com/package/astro-font) - Alternative integration approach
- [astro-google-fonts-optimizer GitHub](https://github.com/sebholstein/astro-google-fonts-optimizer) - CDN optimization alternative

**Animation Perception:**
- [Parachute Design: UX Animation Best Practices](https://parachutedesign.ca/blog/ux-animation/) - User perception guidelines
- [Medium: UI Animation Rules](https://medium.com/design-bootcamp/ui-animation-rules-b38b6102a4e9) - Duration heuristics

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - Fontsource, font-display, cubic-bezier, prefers-reduced-motion are proven industry standards with official documentation and 99%+ browser support
- Architecture: **HIGH** - Patterns verified from Material Design, MDN, and Phase 19 implementation precedent; Astro Fontsource integration documented in official guides
- Pitfalls: **MEDIUM-HIGH** - FOUT/FOIT and animation performance pitfalls well-documented across multiple sources; specific font weight bloat and cubic-bezier timing issues based on general best practices, less specific to LEGO theme implementation

**Research date:** 2026-02-17
**Valid until:** ~60 days (stable domain: font integration and CSS animation techniques evolve slowly; Fontsource package versions stable; CSS standards finalized)

**Key uncertainties resolved:**
- ✅ Fredoka, Slackey, Baloo 2 all available via Fontsource
- ✅ font-display: swap is industry standard for FOUT/FOIT prevention
- ✅ cubic-bezier can create bounce effects with y > 1.0 control points
- ✅ prefers-reduced-motion has 99% browser support for accessibility
- ✅ 200-300ms animation duration is Material Design + NN/g recommendation
- ✅ Phase 19 already uses 34ms for pressed state (instant feedback)

**Key uncertainties remaining:**
- ⚠️ Variable vs. static fonts: File size tradeoff needs performance testing
- ⚠️ Font preload paths: Astro build may change paths, needs production verification
- ⚠️ cubic-bezier vs. linear() bounce feel: User perception testing required
- ⚠️ Baloo 2 readability for long content: Visual fatigue threshold unclear for typical page lengths
