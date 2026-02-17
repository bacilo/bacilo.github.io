# Pitfalls Research

**Domain:** Immersive CSS Themes (LEGO-style decorative effects) added to existing multi-theme system
**Researched:** 2026-02-17
**Confidence:** MEDIUM (Web research verified with multiple sources; some LOW confidence areas flagged)

## Critical Pitfalls

### Pitfall 1: Pseudo-Element Performance Explosion

**What goes wrong:**
Adding `::before` and `::after` pseudo-elements to every block element (for LEGO studs/brick effects) creates massive rendering overhead. With hundreds of elements on a page, each generating 2 additional pseudo-elements, the browser must paint 3x the original DOM. On mobile devices, this causes layout thrashing, jank during scroll, and battery drain.

**Why it happens:**
Developers see pseudo-elements as "lightweight" decorative additions and apply them broadly without performance testing. The visual impact (studs on all headers, cards, sections) seems impressive until tested on actual devices. Each pseudo-element with `box-shadow`, `border-radius`, and `position: absolute` triggers expensive paint operations.

**How to avoid:**
- **Limit scope ruthlessly:** Apply stud effects only to key visual elements (header, nav, major section dividers), not every `<p>`, `<div>`, or `<span>`.
- **Use `content-visibility: auto`** on sections with heavy pseudo-element decoration to skip rendering off-screen content ([web.dev: content-visibility](https://web.dev/articles/content-visibility)).
- **Budget pseudo-elements:** Set a maximum (e.g., "no more than 50 pseudo-elements per viewport") and test on low-end mobile (iPhone SE, Android Go).
- **Prefer CSS Grid/background patterns** for repeating visual effects instead of individual pseudo-elements.

**Warning signs:**
- Chrome DevTools Performance panel shows Paint >50ms per frame
- Lighthouse Performance score drops >10 points when LEGO theme active
- Scroll feels janky (not 60fps) on test devices
- Mobile battery drains noticeably faster during testing

**Phase to address:**
**Phase 1-2 (Foundation & Basic Stud Effects)** — Establish pseudo-element budget and test performance baseline before adding animations.

---

### Pitfall 2: Font Loading Cascade Failure (FOUT/FOIT on Theme Switch)

**What goes wrong:**
LEGO theme loads 3 custom web fonts (display font for headings, body font, monospace for code). When user switches from a system font theme (Terminal, default) to LEGO theme, fonts aren't preloaded. Result: Flash of Invisible Text (FOIT) makes headings disappear for 1-3 seconds, or Flash of Unstyled Text (FOUT) causes jarring layout shifts as fallback fonts (different metrics) get replaced.

**Why it happens:**
Web fonts only load when CSS rules referencing them apply to the DOM. Theme switching via `[data-theme="lego"]` triggers font requests *after* the theme change, not before. Developers test on cached browsers (fonts already downloaded) and miss the cold-load experience. Theme-specific fonts aren't included in `<link rel="preload">` because other themes don't use them.

**How to avoid:**
- **Conditional preloading with JavaScript:** When user hovers theme switcher button, preload LEGO fonts before switch:
  ```javascript
  document.querySelectorAll('[data-theme-option="lego"]').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = '/fonts/lego-display.woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      // Repeat for all LEGO fonts
    }, { once: true });
  });
  ```
- **Use `font-display: swap`** to prevent invisible text ([Chrome Developers: font-display](https://developer.chrome.com/docs/lighthouse/performance/font-display)).
- **Font metric matching:** Define fallback font stacks with similar metrics using `size-adjust`, `ascent-override`, `descent-override` to minimize layout shift ([DebugBear: Font Layout Shift](https://www.debugbear.com/blog/web-font-layout-shift)).
  ```css
  @font-face {
    font-family: 'LEGO Display Fallback';
    src: local('Arial');
    size-adjust: 110%; /* Adjust to match LEGO font metrics */
    ascent-override: 95%;
    descent-override: 25%;
  }
  ```
- **Only WOFF2 format** — fastest compression, universally supported in 2026 ([DebugBear: Font Performance](https://www.debugbear.com/blog/website-font-performance)).

**Warning signs:**
- Headings disappear briefly when switching to LEGO theme (FOIT)
- Text jumps/reflows after theme switch (FOUT with poor fallback matching)
- Cumulative Layout Shift (CLS) >0.1 in Chrome DevTools during theme switch
- User complaints about "text flashing" or "page jumping"

**Phase to address:**
**Phase 3 (Typography Integration)** — Implement font preloading, `font-display: swap`, and fallback metric matching before declaring font integration complete.

---

### Pitfall 3: Accessibility Failure — Decorative Pseudo-Content Read by Screen Readers

**What goes wrong:**
LEGO stud effects use `::before { content: "●●●"; }` or similar character-based decorations. Modern screen readers (NVDA, JAWS, VoiceOver) read CSS-generated content by default, so users hear "dot dot dot" or "circle circle circle" hundreds of times while navigating the page. Purely visual decoration becomes auditory noise pollution.

**Why it happens:**
Developers assume CSS `content` property is ignored by assistive technology (outdated assumption from pre-2020 era). Screen reader behavior evolved to expose pseudo-content because it sometimes contains meaningful information ([Accessible Web: Screen Readers and Pseudo-Elements](https://accessibleweb.com/question-answer/how-is-css-pseudo-content-treated-by-screen-readers/), [Tink: Accessibility Support for CSS Generated Content](https://tink.uk/accessibility-support-for-css-generated-content/)). Testing only happens with visual inspection, not with actual screen reader testing.

**How to avoid:**
- **Use empty `content` with visual-only styling:**
  ```css
  .brick-element::before {
    content: ""; /* No text content */
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--stud-color);
  }
  ```
- **If text content required, use alternative text syntax** (CSS4 proposal, limited support):
  ```css
  .brick-element::before {
    content: "●●●" / ""; /* Visual content / screen reader content (empty) */
  }
  ```
- **Add `aria-hidden="true"` to parent containers** with decorative pseudo-elements (if semantically appropriate):
  ```html
  <div class="lego-header" aria-hidden="true">
    <!-- Decorative wrapper -->
  </div>
  <h1>Actual heading</h1>
  ```
- **Test with actual screen readers:** NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android). Visual testing is insufficient ([F87: CSS Generated Content and WCAG Conformance](https://adrianroselli.com/2019/02/f87-css-generated-content-and-wcag-conformance.html)).

**Warning signs:**
- Screen reader announces "dot", "circle", or other decorative text repeatedly
- Users with assistive technology report "nonsense content"
- WCAG 1.3.1 (Info and Relationships) failure detected in accessibility audit
- Decorative content included in page's accessible text tree (check with Accessibility Inspector in browser DevTools)

**Phase to address:**
**Phase 1 (Foundation)** — Establish accessibility-safe pseudo-element patterns before building out stud effects.

---

### Pitfall 4: Theme Switching FOUC Due to Unscoped Immersive Styles

**What goes wrong:**
LEGO theme CSS includes aggressive immersive styles (brick borders, stud pseudo-elements, snap animations). When switching *away* from LEGO theme, these styles "leak" for 1-2 frames because CSS specificity conflicts or JavaScript timing issues cause theme cleanup to happen after new theme applies. Users see LEGO studs briefly appear on Terminal theme or brick borders flash on Synthwave theme.

**Why it happens:**
Immersive styles use high specificity selectors (`.brick-element::before`, `h1.lego-header`) that aren't strictly scoped to `[data-theme="lego"]`. Developers test switching *to* LEGO theme (works fine) but not *from* LEGO to other themes. CSS cascade order and JavaScript timing create edge cases where old styles persist for 1-2 render frames.

**How to avoid:**
- **Strict theme scoping:** All LEGO-specific styles MUST be prefixed with `[data-theme="lego"]`:
  ```css
  /* WRONG — applies globally */
  .brick-element::before { content: ""; }

  /* CORRECT — only applies when LEGO theme active */
  [data-theme="lego"] .brick-element::before { content: ""; }
  ```
- **Use CSS containment** to isolate theme styles:
  ```css
  [data-theme="lego"] {
    contain: style; /* Prevents style leakage */
  }
  ```
- **Remove LEGO-specific classes on theme switch** if using JavaScript to add classes:
  ```javascript
  function switchTheme(newTheme) {
    // Remove old theme classes
    document.body.classList.remove('lego-active', 'lego-animated');
    // Set new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    // Add new theme classes if needed
    if (newTheme === 'lego') {
      document.body.classList.add('lego-active');
    }
  }
  ```
- **Test bidirectional switching:** Test LEGO → every other theme, not just default → LEGO.

**Warning signs:**
- Flashes of LEGO decoration appear when switching to other themes
- Console warnings about duplicate CSS custom properties
- DevTools shows both old and new theme styles applying simultaneously
- Layout shifts during theme transitions (CLS spikes)

**Phase to address:**
**Phase 1-2 (Foundation & Theme Scoping)** — Establish strict scoping conventions before adding complex decorations.

---

### Pitfall 5: Mobile Touch Target Failure — Studs Too Small to Be Safe

**What goes wrong:**
LEGO studs (8x8px decorative circles) are placed near interactive elements (links, buttons). On mobile, touch targets must be ≥44x44px (iOS) or ≥48x48px (Android) for accessibility ([10 Mobile UX Design Trends 2026](https://webdesignerindia.medium.com/10-mobile-ux-design-trends-2026-231783d97d28)). Studs placed via `position: absolute` overlap or crowd touch targets, causing misclicks. Users tap studs instead of adjacent links.

**Why it happens:**
Desktop testing with mouse cursor (1px precision) doesn't reveal touch target issues. Developers design studs for visual appeal without considering finger size (10-15mm diameter). CSS positioning (`top`, `left` values) works on desktop but creates different overlaps on mobile due to viewport differences.

**How to avoid:**
- **Never position decorative elements within 12px of interactive elements:**
  ```css
  [data-theme="lego"] .brick-element::before {
    /* Ensure studs are >12px away from parent edges */
    top: 12px;
    left: 12px;
  }

  [data-theme="lego"] a,
  [data-theme="lego"] button {
    /* Ensure touch target padding */
    padding: 12px 16px; /* Minimum 44x44px total */
  }
  ```
- **Use `pointer-events: none`** on decorative pseudo-elements:
  ```css
  [data-theme="lego"] .brick-element::before {
    pointer-events: none; /* Prevent studs from intercepting clicks */
  }
  ```
- **Hide decorative elements on mobile** if spacing impossible:
  ```css
  @media (max-width: 768px) {
    [data-theme="lego"] .dense-section::before,
    [data-theme="lego"] .dense-section::after {
      display: none; /* Remove studs in tight layouts */
    }
  }
  ```
- **Test on actual devices:** Simulators don't replicate touch precision issues.

**Warning signs:**
- Users report difficulty tapping links/buttons on mobile in LEGO theme
- Lighthouse accessibility audit flags touch target sizing
- Heat maps show taps landing on decorative elements instead of interactive elements
- Buttons require multiple tap attempts

**Phase to address:**
**Phase 2 (Stud Effects) & Phase 7 (Responsive Refinement)** — Set touch-safe positioning rules before scaling up decoration density.

---

### Pitfall 6: Reduced-Motion Ignored — Animations Cause Vestibular Issues

**What goes wrong:**
LEGO theme includes snap/bounce CSS animations on theme switch, card interactions, and button clicks. Users with vestibular disorders (motion sensitivity) or those who've enabled `prefers-reduced-motion` system setting experience nausea, dizziness, or discomfort. Animations play anyway because `@media (prefers-reduced-motion: reduce)` override not implemented.

**Why it happens:**
Animations are added for visual polish without considering accessibility impact. Developers without motion sensitivity don't experience the issue personally. WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions) requires animations to be disableable ([prefers-reduced-motion: MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), [Design accessible animation](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)).

**How to avoid:**
- **Wrap all animations in motion query:**
  ```css
  /* Only animate if user hasn't requested reduced motion */
  @media (prefers-reduced-motion: no-preference) {
    [data-theme="lego"] .brick-snap {
      animation: snap 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  /* Fallback for reduced-motion users: instant state change */
  @media (prefers-reduced-motion: reduce) {
    [data-theme="lego"] .brick-snap {
      animation: none;
      /* Jump to final state immediately */
    }
  }
  ```
- **Disable theme-switch animations** for reduced-motion:
  ```javascript
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function switchTheme(newTheme) {
    if (prefersReducedMotion) {
      // Instant switch, no transition
      document.documentElement.setAttribute('data-theme', newTheme);
    } else {
      // Animated switch
      document.documentElement.classList.add('theme-transitioning');
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', newTheme);
        document.documentElement.classList.remove('theme-transitioning');
      }, 300);
    }
  }
  ```
- **Test with system setting enabled:** macOS (System Settings > Accessibility > Display > Reduce Motion), Windows (Settings > Ease of Access > Display > Show animations).

**Warning signs:**
- Animations play when system "Reduce Motion" setting enabled
- WCAG 2.3.3 failure in accessibility audit
- User feedback about motion sickness or discomfort
- No `prefers-reduced-motion` query found in CSS

**Phase to address:**
**Phase 4 (Snap Animations)** — Implement reduced-motion support *before* adding bounce/snap effects.

---

### Pitfall 7: Shiki Code Highlighting Theme Conflict

**What goes wrong:**
Existing site uses Shiki syntax highlighting with dual themes (light/dark via CSS variables `--shiki-light`, `--shiki-dark`). LEGO theme CSS overrides these variables or uses conflicting `!important` rules for `.astro-code` elements, breaking syntax highlighting. Code blocks either lose color entirely, display wrong theme colors, or show both themes simultaneously (unreadable mix).

**Why it happens:**
LEGO theme developers don't realize Shiki generates inline styles on `<span>` elements and uses CSS variables for theming. Adding `[data-theme="lego"] .astro-code { color: black !important; }` seems logical but nukes Shiki's token colors. Current codebase uses `!important` to override Shiki inline styles (see `themes.css:111-149`), creating specificity arms race.

**How to avoid:**
- **Respect existing Shiki variable structure:**
  ```css
  /* WRONG — destroys syntax highlighting */
  [data-theme="lego"] .astro-code,
  [data-theme="lego"] .astro-code span {
    color: black !important; /* Overrides all token colors */
  }

  /* CORRECT — uses Shiki's light theme for LEGO */
  [data-theme="lego"] .astro-code,
  [data-theme="lego"] .astro-code span {
    color: var(--shiki-light) !important;
    background-color: var(--shiki-light-bg) !important;
  }
  ```
- **Test code blocks specifically:** Ensure syntax highlighting still works with multiple languages (JavaScript, Python, CSS, etc.).
- **Don't override Shiki custom properties** — use theme selection (`--shiki-light` vs `--shiki-dark`), don't redefine them.
- **Consider LEGO-themed Shiki colors** (Phase 5) but as addition, not replacement:
  ```css
  /* Optional: LEGO-specific code theme */
  [data-theme="lego"] {
    --shiki-light-bg: #fffef7; /* Slightly cream background */
    /* Keep token colors intact */
  }
  ```

**Warning signs:**
- Code blocks lose syntax highlighting in LEGO theme
- Code displays solid black text with no color differentiation
- Background colors conflict (black code on dark background)
- Console errors about CSS custom property undefined

**Phase to address:**
**Phase 5 (Code Block Styling)** — Test and verify Shiki integration before customizing code block appearance.

---

### Pitfall 8: Box-Shadow Performance Cascade (Brick Borders + Studs)

**What goes wrong:**
LEGO theme uses `box-shadow` for brick depth effects AND pseudo-element studs. Combinations like `box-shadow: 0 4px 0 #000` (brick) + `border-radius: 50%` + nested `box-shadow` on `::before` studs create exponential paint time. Each shadow multiplies rendering cost, especially with blur radius >0 ([CSS paint times](https://web.dev/articles/css-paint-times), [How to animate box-shadow](https://tobiasahlin.com/blog/how-to-animate-box-shadow/)).

**Why it happens:**
Developers add effects incrementally: brick shadow looks good, stud shadows look good, combined looks great... but performance testing happens after visual design is locked. "Paint flashing" in DevTools not checked. Multiple shadows on same element (especially with blur) are expensive operations ([CSS Box Shadow Performance](https://www.sitepoint.com/css-box-shadow-animation-performance/)).

**How to avoid:**
- **Budget shadows:** Maximum 1-2 `box-shadow` declarations per element.
- **Use sharp shadows (0 blur)** for LEGO brick aesthetic — avoids expensive blur calculations:
  ```css
  /* Good: sharp shadow, no blur */
  [data-theme="lego"] .brick {
    box-shadow: 0 4px 0 #000; /* No blur radius */
  }

  /* Bad: blurred shadow, expensive */
  [data-theme="lego"] .brick {
    box-shadow: 0 4px 8px rgba(0,0,0,0.3); /* 8px blur = slow */
  }
  ```
- **Don't animate `box-shadow` directly** — animate `opacity` or `transform` instead:
  ```css
  /* WRONG — repaints every frame */
  @keyframes bad {
    from { box-shadow: 0 2px 0 #000; }
    to { box-shadow: 0 8px 0 #000; }
  }

  /* CORRECT — GPU-accelerated */
  @keyframes good {
    from { transform: translateY(0); }
    to { transform: translateY(-4px); }
  }
  .brick { box-shadow: 0 4px 0 #000; } /* Static shadow */
  ```
- **Use separate layers for shadows** — avoid combining `border-radius` + `box-shadow` on same element if possible.

**Warning signs:**
- Paint time >50ms in Chrome DevTools Performance timeline
- Scroll jank specifically in LEGO theme
- High "Paint" percentage in Performance monitor
- Mobile devices show visible lag when scrolling

**Phase to address:**
**Phase 2 (Brick Borders & Studs)** — Set shadow performance budget before adding animations.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip font preloading | Faster initial implementation | FOUT/FOIT on every theme switch, poor UX | **Never** — required for polished theme switching |
| Use `!important` everywhere | Overrides stubborn styles quickly | Specificity wars, unmaintainable CSS, future theme additions break | Only for Shiki override (existing pattern) |
| Apply studs to all elements | Maximum visual impact | Performance catastrophe on mobile, battery drain | **Never** — selective decoration required |
| Reuse existing theme switching code without LEGO-specific cleanup | Less code to write | FOUC, style leakage, broken theme transitions | Only in prototype/POC phase |
| Skip reduced-motion implementation | One less thing to test | WCAG violation, user discomfort/nausea | **Never** — accessibility requirement |
| Use character-based pseudo-content (`content: "●●●"`) | Quick visual decoration | Screen reader reads decorative content aloud | Only if paired with `/ ""` alternative text (limited support) |
| Add decorative elements without `pointer-events: none` | Simpler CSS | Touch target failures on mobile | Only if studs positioned >12px from interactive elements |

## Integration Gotchas

| Integration Point | Common Mistake | Correct Approach |
|-------------------|----------------|------------------|
| **Shiki syntax highlighting** | Overriding `--shiki-*` variables or using `color: black !important` on `.astro-code` | Use existing theme selection pattern: `[data-theme="lego"]` sets `color: var(--shiki-light) !important` |
| **Existing 7 themes** | LEGO styles leak into other themes due to unscoped selectors | Every LEGO style MUST be prefixed with `[data-theme="lego"]` |
| **localStorage theme persistence** | Not cleaning up LEGO-specific classes/attributes when switching away | Remove LEGO classes before setting new theme attribute |
| **CSS custom properties** | Defining LEGO-specific properties at `:root` level | Define under `[data-theme="lego"]` scope only |
| **View Transitions API** | LEGO theme animations conflict with Astro View Transitions | Coordinate with `astro:page-load` events, disable LEGO animations during page transitions |
| **Dark mode media query** | LEGO theme responds to `prefers-color-scheme` unintentionally | Explicitly set LEGO as light-based theme, don't inherit dark mode query |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **Too many pseudo-elements** | Scroll jank, long paint times (>50ms), layout thrashing | Budget: max 50 pseudo-elements per viewport, use `content-visibility: auto` | >100 pseudo-elements on page |
| **Blurred box-shadows** | High GPU memory, battery drain, janky animations | Use sharp shadows (0 blur radius) for LEGO aesthetic | >10 elements with blurred shadows |
| **Unscoped `will-change`** | Excessive memory consumption, browser layer explosion | Apply `will-change` only during active animation, remove after ([MDN: will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)) | `will-change` on >20 elements simultaneously |
| **Font re-downloading on theme switch** | 1-3 second FOIT/FOUT, layout shifts | Preload LEGO fonts on theme switcher hover, use `font-display: swap` | Every cold theme switch |
| **Layout shifts from fallback fonts** | CLS >0.1, text jumps during theme switch | Use `size-adjust`/`ascent-override` to match fallback font metrics | LEGO fonts have significantly different metrics than fallback |
| **Animating non-compositor properties** | Repaint on every frame, jank on mobile | Only animate `transform`, `opacity`, `filter` — avoid animating `box-shadow`, `width`, `color` directly | Animating layout-triggering properties |

## Accessibility Pitfalls

| Pitfall | User Impact | Better Approach | WCAG Criterion |
|---------|-------------|-----------------|----------------|
| **Decorative pseudo-content read aloud** | Screen reader users hear "dot dot dot" hundreds of times | Use empty `content: ""` with visual styling only, or `content: "●" / ""` alternative text syntax | 1.3.1 Info and Relationships |
| **No reduced-motion support** | Users with vestibular disorders experience nausea, dizziness | Wrap animations in `@media (prefers-reduced-motion: no-preference)` | 2.3.3 Animation from Interactions |
| **Decorative fonts for body text** | Low readability, comprehension difficulty | Use LEGO display font only for headings, keep body text in readable sans-serif | 1.4.8 Visual Presentation |
| **Small studs near touch targets** | Misclicks, frustration on mobile | `pointer-events: none` on decorative elements, maintain 44x44px touch targets | 2.5.5 Target Size |
| **Low contrast on LEGO yellow borders** | Text unreadable for low-vision users | Ensure 4.5:1 contrast ratio for normal text, 3:1 for large text ([WCAG 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)) | 1.4.3 Contrast (Minimum) |
| **Animations >3 flashes/second** | Photosensitive seizure risk | Keep animation frequency <3 Hz, disable rapid flashing in snap/bounce | 2.3.1 Three Flashes or Below Threshold |

## "Looks Done But Isn't" Checklist

Theme implementation appears complete but critical pieces missing:

- [ ] **Font loading:** Often missing preload strategy — verify fonts load before theme switch visible (test with throttled network, cache disabled)
- [ ] **Reduced motion:** Often missing `@media (prefers-reduced-motion)` overrides — verify animations disabled when system setting enabled
- [ ] **Screen reader testing:** Often missing actual AT testing — verify with NVDA/VoiceOver, not just visual inspection
- [ ] **Mobile touch targets:** Often missing real-device testing — verify on actual phone, not just browser DevTools simulator
- [ ] **Bidirectional theme switching:** Often missing "switch away from LEGO" testing — verify LEGO → every other theme, not just default → LEGO
- [ ] **Performance budget:** Often missing mobile device testing — verify Lighthouse score, paint times on iPhone SE / Android Go equivalent
- [ ] **Shiki integration:** Often missing multi-language code block testing — verify JavaScript, Python, CSS, HTML, Markdown syntax highlighting intact
- [ ] **Layout shift metrics:** Often missing CLS measurement — verify theme switch CLS <0.1 (check in Chrome DevTools)
- [ ] **Specificity conflicts:** Often missing other-theme regression testing — verify 7 existing themes unaffected by LEGO CSS additions
- [ ] **Font fallback metrics:** Often missing FOUT minimization — verify fallback fonts match LEGO font metrics with `size-adjust`

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **Pseudo-element performance issues** | LOW | 1. Add `content-visibility: auto` to sections. 2. Remove pseudo-elements from low-value elements. 3. Profile with DevTools, iterate. |
| **Font loading FOUT/FOIT** | LOW-MEDIUM | 1. Add preload on theme switcher hover. 2. Add `font-display: swap`. 3. Calculate fallback font metrics with font tools, apply `size-adjust`. |
| **Screen reader reading decorations** | LOW | 1. Change `content: "text"` to `content: ""`. 2. Move visual effects to background/border properties. 3. Test with screen reader. |
| **Theme switching FOUC** | MEDIUM | 1. Audit all selectors, add `[data-theme="lego"]` prefix. 2. Add JavaScript cleanup for LEGO classes on theme switch. 3. Add CSS `contain: style`. |
| **Mobile touch target failures** | MEDIUM | 1. Add `pointer-events: none` to decorative pseudo-elements. 2. Increase padding on interactive elements. 3. Hide decorative elements on mobile with media query. |
| **No reduced-motion support** | LOW | 1. Wrap animations in `@media (prefers-reduced-motion: no-preference)`. 2. Add instant fallback in `reduce` query. 3. Test with system setting. |
| **Shiki theme conflict** | LOW | 1. Remove custom color overrides on `.astro-code`. 2. Use `var(--shiki-light)` instead. 3. Test all syntax-highlighted code blocks. |
| **Box-shadow performance cascade** | MEDIUM-HIGH | 1. Remove blur radius from shadows. 2. Animate `transform`/`opacity` instead of `box-shadow`. 3. Reduce shadow count per element. May require visual redesign. |
| **Unscoped will-change** | MEDIUM | 1. Remove static `will-change` declarations. 2. Add/remove `will-change` dynamically during animations only. 3. Monitor layer count in DevTools. |
| **Decorative fonts in body text** | MEDIUM-HIGH | 1. Restrict LEGO display font to h1-h3 only. 2. Switch body text to system font stack. May reduce visual impact significantly. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification Method |
|---------|------------------|---------------------|
| Pseudo-element performance explosion | Phase 1-2 (Foundation & Studs) | Chrome DevTools Performance: Paint <50ms, Lighthouse score drop <10 points |
| Font loading FOUT/FOIT | Phase 3 (Typography) | Disable cache, throttle to Slow 3G, switch themes — no invisible text >500ms |
| Screen reader reading decorations | Phase 1 (Foundation) | Test with NVDA/VoiceOver — no decorative content announced |
| Theme switching FOUC | Phase 1-2 (Scoping) | Switch from LEGO to each of 7 themes — no style flashes |
| Mobile touch target failures | Phase 2 & 7 (Studs & Responsive) | Test on iPhone/Android — all links/buttons tappable first try |
| Reduced-motion ignored | Phase 4 (Animations) | Enable system "Reduce Motion" — all animations disabled |
| Shiki code highlighting conflict | Phase 5 (Code Blocks) | View code blocks in JS/Python/CSS — syntax colors intact |
| Box-shadow performance cascade | Phase 2 (Brick Borders) | Paint time <50ms with brick shadows + studs combined |
| Unscoped will-change | Phase 4 (Animations) | DevTools Layers panel — <20 compositor layers active |
| Decorative fonts readability | Phase 3 (Typography) | Accessibility audit — WCAG 1.4.8 pass, body text remains readable |
| CSS specificity conflicts | Phase 1 (Foundation) | Test all 8 themes — no unexpected style changes in non-LEGO themes |
| Layout shifts | Phase 3 & 8 (Fonts & Polish) | Chrome DevTools CLS metric <0.1 during theme switch |

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Phase 1: Foundation & Color Palette** | Leaking styles into other themes | Establish `[data-theme="lego"]` scoping convention, document in PR template |
| **Phase 2: Brick Borders & Stud Effects** | Performance collapse from too many pseudo-elements | Set pseudo-element budget (max 50/viewport), test on iPhone SE |
| **Phase 3: Typography Integration** | FOUT/FOIT destroying theme switch UX | Implement font preloading + `font-display: swap` + fallback metrics as package |
| **Phase 4: Snap & Bounce Animations** | Vestibular disorder triggers | Implement `prefers-reduced-motion` before adding first animation |
| **Phase 5: Code Block Styling** | Breaking Shiki syntax highlighting | Test code blocks BEFORE and AFTER LEGO styles, verify all languages |
| **Phase 6: Interactive States** | Touch target failures on mobile | Add `pointer-events: none` and test on real devices |
| **Phase 7: Responsive Refinement** | Small decorative elements unusable on mobile | Hide or simplify studs on <768px viewports |
| **Phase 8: Polish & Performance** | Shipping with performance regressions | Run Lighthouse audit before/after, require <10 point drop to ship |

## Confident vs. Uncertain Findings

**HIGH confidence (verified with official sources):**
- Font loading strategies (FOUT/FOIT, `font-display`, WOFF2 format)
- `prefers-reduced-motion` accessibility requirement
- Touch target sizing (44x44px minimum)
- Shiki CSS variable theming structure (exists in current codebase)
- Box-shadow performance characteristics
- Screen reader pseudo-element behavior (modern behavior confirmed)
- `content-visibility` performance benefits
- `will-change` memory pitfalls

**MEDIUM confidence (multiple web sources agree):**
- Pseudo-element performance impact (general guidance, no specific benchmarks)
- Font fallback metric matching with `size-adjust` (newer CSS feature, limited real-world data)
- CSS `contain: style` for theme isolation (newer feature, browser support assumed)
- Alternative text syntax for pseudo-content `content: "text" / "alt"` (CSS4 proposal, limited support)

**LOW confidence (needs validation):**
- Specific pseudo-element count thresholds (50/viewport is educated guess, needs testing)
- Theme switching timing edge cases (depends on implementation details)
- Astro View Transitions interaction (framework-specific, needs testing)

## Sources

**Performance:**
- [CSS paint times and page render weight](https://web.dev/articles/css-paint-times)
- [How to animate box-shadow with silky smooth performance](https://tobiasahlin.com/blog/how-to-animate-box-shadow/)
- [How to Animate CSS Box Shadows and Optimize Performance](https://www.sitepoint.com/css-box-shadow-animation-performance/)
- [content-visibility: the new CSS property that boosts your rendering performance](https://web.dev/articles/content-visibility)
- [Understanding the CSS will-change Property](https://www.machinet.net/tutorial-eng/understanding-the-css-will-change-property)
- [will-change - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)

**Font Loading:**
- [Optimizing Web Fonts: FOIT vs FOUT vs Font Display Strategies](https://talent500.com/blog/optimizing-fonts-foit-fout-font-display-strategies/)
- [Ensure text remains visible during webfont load | Chrome for Developers](https://developer.chrome.com/docs/lighthouse/performance/font-display)
- [The Ultimate Guide to Font Performance Optimization | DebugBear](https://www.debugbear.com/blog/website-font-performance)
- [Fixing Layout Shifts Caused by Web Fonts | DebugBear](https://www.debugbear.com/blog/web-font-layout-shift)

**Accessibility:**
- [prefers-reduced-motion - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [Design accessible animation and movement with code examples](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- [How is CSS pseudo content treated by screen readers?](https://accessibleweb.com/question-answer/how-is-css-pseudo-content-treated-by-screen-readers/)
- [Accessibility support for CSS generated content - Tink](https://tink.uk/accessibility-support-for-css-generated-content/)
- [F87: CSS Generated Content and WCAG Conformance](https://adrianroselli.com/2019/02/f87-css-generated-content-and-wcag-conformance.html)
- [How to Choose ADA-Compliant Fonts in 2026](https://accessibe.com/blog/knowledgebase/ada-compliant-fonts)
- [WebAIM: Typefaces and Fonts](https://webaim.org/techniques/fonts/)

**Theme Switching:**
- [Stop the Flash of Unstyled Content (FOUC) with CSS Tricks](https://javascript.plainenglish.io/stop-the-flash-of-unstyled-content-fouc-with-css-tricks-1e69608ede2f)
- [Fixing Dark Mode Flickering (FOUC) in React and Next.js](https://notanumber.in/blog/fixing-react-dark-mode-flickering)
- [Handling conflicts - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts)
- [Specificity - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

**Mobile/Responsive:**
- [10 Mobile UX Design Trends Every Business Must Follow in 2026](https://webdesignerindia.medium.com/10-mobile-ux-design-trends-2026-231783d97d28)

**Shiki Integration:**
- [Theme Colors Manipulation | Shiki](https://shiki.style/guide/theme-colors/)
- [Astro Shiki Syntax Highlighting with CSS Variables](https://christianpenrod.com/blog/astro-shiki-syntax-highlighting-with-css-variables)

---
*Pitfalls research for: Immersive LEGO CSS theme addition to multi-theme academic website*
*Researched: 2026-02-17*
*Focus: Integration pitfalls, performance, accessibility, theme isolation*
