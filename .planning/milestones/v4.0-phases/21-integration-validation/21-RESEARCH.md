# Phase 21: Integration Validation - Research

**Researched:** 2026-02-17
**Domain:** End-to-end validation testing (performance, accessibility, cross-browser, responsive)
**Confidence:** HIGH

## Summary

Phase 21 validates the LEGO theme implementation against all v4.0 requirements through five testing domains: Lighthouse performance metrics, WCAG 2.1 AA accessibility compliance, cross-browser compatibility, theme switching integrity, and mobile responsive behavior.

Integration validation for static Astro sites uses a combination of automated tools (Lighthouse CI, Playwright, axe-core) and manual verification. The key challenge is establishing a validation workflow without existing test infrastructure. Performance validation is critical given the LEGO theme's multi-layer box-shadows, custom web fonts (170KB total), and CSS animations—all potential performance bottlenecks on mobile.

The standard approach combines: (1) Lighthouse CI for performance budgets and Core Web Vitals, (2) Playwright for cross-browser automation and visual regression, (3) axe-core for automated accessibility scanning (covers ~57% of WCAG violations), and (4) manual testing for screen readers and reduced-motion behavior.

**Primary recommendation:** Establish manual validation checklist first (faster to execute, zero dependencies), then document setup for future automation. For Phase 21, manual verification is sufficient—automated CI/CD integration is valuable but not required for v4.0 milestone completion.

## Standard Stack

### Core Testing Tools

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| **Lighthouse CLI** | Latest (v12+) | Performance, accessibility, SEO audits | Google's official tool, industry standard for Core Web Vitals |
| **Playwright** | Latest (v1.40+) | Cross-browser automation (Chromium, Firefox, WebKit) | Single API for all modern browsers, built-in mobile emulation |
| **axe-core** | Latest (v4.8+) | WCAG automated accessibility testing | Deque's open-source engine, finds ~57% of WCAG issues automatically |

### Supporting Tools

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| **@lhci/cli** | Latest | Lighthouse CI for regression prevention | If implementing CI/CD automation |
| **@axe-core/playwright** | Latest | axe-core integration for Playwright | For automated accessibility in browser tests |
| **WebAIM Contrast Checker** | Web tool | Manual color contrast validation | Verify LEGO theme colors meet WCAG AA (4.5:1 normal, 3:1 large text) |
| **NVDA** | Latest (free) | Screen reader testing (Windows) | Manual verification of semantic HTML and ARIA |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Playwright | Cypress, Puppeteer | Playwright supports all browsers (WebKit/Safari) in one API; Cypress doesn't support Safari, Puppeteer is Chromium-only |
| Lighthouse CLI | PageSpeed Insights API | CLI gives local control and CI integration; PSI requires API keys and rate limits |
| Manual validation | Full automated suite | Manual is faster to set up (0 dependencies), sufficient for one-time validation; automation prevents regressions over time |

**Installation:**
```bash
# If pursuing automation (optional for Phase 21)
npm install --save-dev @playwright/test @axe-core/playwright lighthouse @lhci/cli
```

## Validation Domains

Phase 21 must validate five success criteria across distinct testing domains.

### 1. Performance Validation (Success Criterion 1)

**Goal:** Lighthouse performance score ≥90 with LEGO theme active

**What to measure:**
- Performance score (target: ≥90)
- Core Web Vitals: LCP ≤2.5s, FID ≤100ms, CLS ≤0.1
- Total Blocking Time (TBT)
- First Contentful Paint (FCP)

**Known performance risks in LEGO theme:**
- **Web fonts:** 170KB total (Fredoka 700, Slackey, Baloo 2 400+600) vs 0KB for system fonts
- **Box-shadow layers:** 3 layers desktop, 2 mobile—box-shadow triggers paint, not composited
- **CSS animations:** Bounce hover animations with cubic-bezier easing
- **Background pattern:** Repeating-linear-gradient baseplate grid (24px × 24px)

**Testing approach:**
```bash
# Manual: Use Lighthouse in Chrome DevTools
# 1. Open site in Chrome Incognito
# 2. Switch to LEGO theme
# 3. Run Lighthouse audit (Performance + Accessibility)
# 4. Verify score ≥90

# Automated (optional):
npx lighthouse https://pedropaf.com --only-categories=performance --output=html --output-path=./lighthouse-report.html --preset=desktop
```

**Performance optimization techniques (already applied in phases 18-20):**
- Static fonts (Fontsource) over variable fonts: 170KB vs 240KB
- Reduced box-shadow layers on mobile: 2 vs 3
- `prefers-reduced-motion` removes all transitions
- Baseplate grid uses `background-attachment: fixed` to prevent repaint on scroll

**Expected result:** Astro static sites with minimal JavaScript typically score 95-100 on Lighthouse. The 170KB font payload and box-shadow animations may reduce score to 90-95 range.

### 2. Accessibility Validation (Success Criterion 2)

**Goal:** WCAG 2.1 Level AA compliance (contrast, reduced-motion, screen reader)

**Three sub-domains:**

#### 2a. Color Contrast (WCAG 1.4.3 - Level AA)

**Requirements:**
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt or 14pt bold): 3:1 contrast ratio
- UI components (borders, icons): 3:1 contrast ratio

**LEGO theme colors to validate:**
```css
/* Text on background */
--color-bg: #e4e4e4 (light gray)
--color-text: #000000 (black)
--color-text-muted: #555555 (dark gray)

/* Links */
--color-link: #d11013 (LEGO red)
--color-link-hover: #a00d10 (darker red)

/* Header */
--color-header-bg: #d11013 (LEGO red)
.site-title: #ffffff (white on red)
nav: #ffffff on #0055bf (white on LEGO blue)
```

**Testing approach:**
- Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) for manual verification
- Test all text/background combinations
- Verify nav button studs (rgba white overlay) don't reduce contrast below 3:1

**Expected issues:** LEGO primary colors (red, blue, yellow) are vibrant but may struggle with contrast. White text on LEGO red (#d11013) may need verification.

#### 2b. Reduced Motion (WCAG 2.3.3 - Level AAA, best practice for AA)

**Implementation (already complete in Phase 20):**
```css
@media (prefers-reduced-motion: reduce) {
  [data-theme="lego"] nav a,
  [data-theme="lego"] .github-card {
    transition: none !important;
  }
  [data-theme="lego"] nav a:active {
    transform: translateY(2px); /* Keep pressed state, remove bounce */
  }
}
```

**Testing approach:**
```javascript
// Chrome DevTools: Cmd+Shift+P → "Emulate CSS prefers-reduced-motion"
// Or: System Settings → Accessibility → Display → Reduce motion

// Manual verification:
// 1. Enable reduced-motion in system settings
// 2. Reload site with LEGO theme
// 3. Hover over cards and nav buttons
// 4. Verify: no bounce animations, instant state changes
// 5. Verify: pressed button state still works (translateY remains)
```

**Playwright automation (optional):**
```javascript
await page.emulateMedia({ reducedMotion: 'reduce' });
```

#### 2c. Screen Reader Compatibility

**What to test:**
- Semantic HTML landmarks (header, nav, main, footer)
- Skip link functionality ("Skip to main content")
- Theme switcher label association
- Link text clarity (no "click here")
- Image alt text (if any)
- Heading hierarchy (H1 → H2 → H3, no skips)

**Testing approach:**
- **NVDA (Windows, free):** Download from [nvaccess.org](https://www.nvaccess.org/download/)
- **VoiceOver (macOS, built-in):** Cmd+F5 to enable
- **Automated axe-core scan:** Finds ~57% of WCAG issues (missing labels, invalid ARIA, contrast)

**Manual verification steps:**
1. Enable screen reader
2. Navigate to site
3. Tab through interactive elements (skip link, theme switcher, nav links)
4. Verify all interactive elements are announced with clear labels
5. Verify heading hierarchy is logical
6. Test theme switcher: label "Theme:" associated with select element

**axe-core automated scan (optional):**
```javascript
// Using Playwright + axe-core
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('LEGO theme accessibility', async ({ page }) => {
  await page.goto('https://pedropaf.com');
  await page.selectOption('#theme-select', 'lego');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  }, undefined, { wcag2a: true, wcag2aa: true, wcag21aa: true });
});
```

**Expected result:** Site uses semantic HTML throughout. Skip link exists. Theme switcher uses `<label for="theme-select">`. No known violations.

### 3. Cross-Browser Validation (Success Criterion 3)

**Goal:** All LEGO features work correctly in Chrome, Firefox, Safari (latest versions)

**Features to verify per browser:**
- Baseplate grid pattern renders correctly
- Box-shadow brick depth displays (3 layers desktop, 2 mobile)
- Stud overlays render (radial-gradient circles)
- Bounce animations work (cubic-bezier easing)
- Typography hierarchy loads (Fredoka, Slackey, Baloo 2)
- Theme switching persists (localStorage)

**Browser engines to test:**
- **Chromium:** Chrome, Edge (Blink engine)
- **Firefox:** Firefox (Gecko engine)
- **WebKit:** Safari (WebKit engine)

**Testing approach:**

**Manual:**
1. Open site in Chrome, Firefox, Safari
2. Switch to LEGO theme
3. Verify visual features (grid, shadows, studs, fonts)
4. Test interactions (hover cards, hover nav, theme switch)
5. Test localStorage persistence (reload page, theme should remain)

**Playwright automation (optional):**
```javascript
// playwright.config.js
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});

// test.spec.js
test.describe('LEGO theme cross-browser', () => {
  test('renders baseplate grid', async ({ page }) => {
    await page.goto('https://pedropaf.com');
    await page.selectOption('#theme-select', 'lego');
    const body = page.locator('body');
    const bgImage = await body.evaluate(el =>
      window.getComputedStyle(el).backgroundImage
    );
    expect(bgImage).toContain('linear-gradient');
  });
});
```

**Known cross-browser risks:**
- **Safari font rendering:** WebKit handles web fonts differently, may show FOIT (flash of invisible text)
- **Firefox radial-gradient:** Older Firefox versions had radial-gradient bugs (fixed in recent versions)
- **Safari backdrop-filter:** Not used in LEGO theme, but Safari has known issues

**Expected result:** All features work. Modern browsers (2026) have excellent CSS support. Cubic-bezier easing has 99% support, radial-gradient is universal.

### 4. Theme Switching Validation (Success Criterion 4)

**Goal:** Theme switching between LEGO and all other 7 themes works without visual glitches

**Themes to test:**
1. Auto (system preference)
2. Light (default)
3. Dark
4. Sepia
5. Terminal
6. Minecraft
7. **LEGO** (target theme)
8. Synthwave

**What to verify:**
- Switching from LEGO → other themes removes LEGO-specific styles (grid, shadows, studs, fonts)
- Switching to LEGO → applies all LEGO features
- No style leakage (LEGO styles don't persist after switching away)
- localStorage persists selected theme across page reloads
- No FOUC (flash of unstyled content) on page load

**Testing approach:**
```
Manual verification matrix:
[LEGO] → [Light]: Grid gone, shadows reset, system fonts restored
[LEGO] → [Dark]: Dark colors applied, LEGO features removed
[LEGO] → [Sepia]: Sepia colors, no LEGO styles
[LEGO] → [Terminal]: Terminal green, no LEGO styles
[LEGO] → [Minecraft]: Minecraft textures, no LEGO styles
[LEGO] → [Synthwave]: Synthwave neon, no LEGO styles
[LEGO] → [Auto]: System preference respected, LEGO features removed
[Light] → [LEGO]: All LEGO features appear
[Dark] → [LEGO]: All LEGO features appear (not dark LEGO)

Per test:
1. Select starting theme
2. Observe styles
3. Switch to target theme
4. Verify target theme styles applied
5. Verify starting theme styles removed
6. Reload page
7. Verify theme persisted from localStorage
```

**Expected issues:** Component-scoped `[data-theme="lego"]` selectors (implemented in Phase 18) prevent style leakage. Inline script in `BaseLayout.astro` prevents FOUC. No known issues.

**Architecture decision that enables this:** Phase 18 used attribute selectors (`[data-theme="lego"]`) instead of class names, ensuring LEGO styles only apply when attribute is present. Removing the attribute completely removes all LEGO CSS.

### 5. Mobile Responsive Validation (Success Criterion 5)

**Goal:** Mobile experience (iPhone SE viewport) displays all LEGO features without layout breaks

**iPhone SE viewport specs:**
- Width: 375px (CSS pixels)
- Height: 667px
- Device pixel ratio: 2x
- Actual resolution: 750×1334

**LEGO features to verify on mobile:**
- Baseplate grid renders (24px × 24px)
- Cards display brick shadows (2 layers, not 3)
- Nav buttons show studs
- Typography hierarchy works (Fredoka H1, Slackey H2-H3, Baloo 2 body)
- Sidebar hidden (RESP-01: author sidebar hidden ≤768px, except Home page)
- Footer displays correctly
- Touch interactions work (no hover-only features)

**Testing approach:**

**Manual (Chrome DevTools):**
```
1. Open Chrome DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Select "iPhone SE" from device dropdown
4. Switch to LEGO theme
5. Verify all features render
6. Test touch interactions (tap cards, tap nav)
7. Navigate to different pages
8. Verify sidebar hidden on Posts, visible on Home
```

**Playwright emulation (optional):**
```javascript
test('LEGO theme mobile (iPhone SE)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('https://pedropaf.com');
  await page.selectOption('#theme-select', 'lego');

  // Verify sidebar hidden on posts page
  await page.goto('https://pedropaf.com/posts/');
  const sidebar = page.locator('.author-sidebar');
  await expect(sidebar).toBeHidden();

  // Verify sidebar visible on home page
  await page.goto('https://pedropaf.com/');
  await expect(sidebar).toBeVisible();
});
```

**Mobile-specific CSS (already implemented):**
```css
/* Phase 19: Reduced box-shadow layers for mobile performance */
@media (max-width: 768px) {
  [data-theme="lego"] .github-card {
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 2px 6px rgba(0, 0, 0, 0.08);  /* 2 layers, not 3 */
  }
}

/* RESP-01: Hide sidebar on mobile except Home */
@media (max-width: 768px) {
  .author-sidebar {
    display: none;
  }
  .page-home .author-sidebar {
    display: block;
  }
}
```

**Performance consideration:** Mobile performance is the highest risk. 170KB web fonts + box-shadow animations may impact Lighthouse mobile score more than desktop. Success criterion 1 (≥90 score) applies to both desktop and mobile.

## Architecture Patterns

### Pattern 1: Manual Validation Checklist

**What:** Structured document listing all validation steps with checkboxes for manual execution

**When to use:** When test infrastructure doesn't exist yet, or for one-time validation before release

**Example structure:**
```markdown
## Performance Validation
- [ ] Run Lighthouse audit on desktop (Chrome DevTools)
  - [ ] Switch to LEGO theme before running
  - [ ] Performance score ≥90: ___ (record actual)
  - [ ] LCP ≤2.5s: ___ (record actual)
  - [ ] CLS ≤0.1: ___ (record actual)
- [ ] Run Lighthouse audit on mobile (iPhone SE emulation)
  - [ ] Performance score ≥90: ___ (record actual)

## Accessibility Validation
- [ ] Contrast checker: Black text (#000) on gray background (#e4e4e4)
  - [ ] Ratio ≥4.5:1 for normal text: ___
- [ ] Contrast checker: White text (#fff) on red header (#d11013)
  - [ ] Ratio ≥4.5:1: ___
[...]
```

**Why effective:** Provides repeatable process, creates audit trail, allows team members to execute without automation setup.

### Pattern 2: Lighthouse CI for Performance Budgets

**What:** Automated Lighthouse runs on every commit/deploy, fails build if metrics drop below thresholds

**When to use:** When preventing performance regressions is critical (post-launch, continuous integration)

**Example config (`lighthouserc.js`):**
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['https://pedropaf.com'],
      numberOfRuns: 3,  // Run 3 times, use median
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],  // ≥90
        'categories:accessibility': ['error', { minScore: 0.95 }],  // ≥95
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',  // Or filesystem, S3, etc.
    },
  },
};
```

**Running:**
```bash
npm install --save-dev @lhci/cli
npx lhci autorun
```

**Why effective:** Catches regressions before they reach production. Lighthouse runs are cheap (30-60s per URL). Can integrate with GitHub Actions, GitLab CI, etc.

### Pattern 3: Playwright Visual Regression

**What:** Capture baseline screenshots, compare against new screenshots, flag pixel differences

**When to use:** When theme switching visual integrity is critical, or when UI changes frequently

**Example:**
```javascript
test('LEGO theme visual snapshot', async ({ page }) => {
  await page.goto('https://pedropaf.com');
  await page.selectOption('#theme-select', 'lego');

  // Wait for fonts to load
  await page.waitForLoadState('networkidle');

  // Take screenshot, compare to baseline
  await expect(page).toHaveScreenshot('lego-theme-homepage.png', {
    fullPage: true,
    animations: 'disabled',  // Disable animations for consistent snapshots
  });
});
```

**First run:** Generates baseline image in `test-results/`
**Subsequent runs:** Compares against baseline, shows pixel diff if mismatch

**Why effective:** Detects unintended visual changes (font loading issues, CSS specificity bugs, layout breaks). Works across browsers (Chromium, Firefox, WebKit).

### Pattern 4: Accessibility Testing with axe-core

**What:** Automated WCAG 2.1 scanning using Deque's axe-core engine

**When to use:** Whenever testing accessibility, ideally on every PR

**Example (Playwright integration):**
```javascript
import { injectAxe, checkA11y } from 'axe-playwright';

test('LEGO theme accessibility scan', async ({ page }) => {
  await page.goto('https://pedropaf.com');
  await page.selectOption('#theme-select', 'lego');
  await injectAxe(page);

  // Run axe scan with WCAG 2.1 AA rules
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  }, undefined, {
    runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa']
  });
});
```

**What axe-core finds:**
- Color contrast violations
- Missing alt text
- Invalid ARIA attributes
- Form label issues
- Heading hierarchy problems
- Keyboard accessibility issues

**What axe-core doesn't find (~43% of WCAG):**
- Screen reader usability (requires manual testing)
- Logical tab order (requires manual testing)
- Content clarity (requires human judgment)
- Complex interaction patterns

**Why effective:** Finds ~57% of WCAG issues automatically, fast (< 1s per page), integrates with any test framework.

### Anti-Patterns to Avoid

- **Anti-pattern: Running Lighthouse once and accepting the score**
  - **Why it's bad:** Lighthouse scores vary by 5-10 points run-to-run due to network conditions, CPU throttling, background processes
  - **What to do instead:** Run 3-5 times, use median score. Lighthouse CI does this automatically.

- **Anti-pattern: Testing only in one browser (Chrome)**
  - **Why it's bad:** Safari has different font rendering, Firefox has different box model calculations, layout bugs can be browser-specific
  - **What to do instead:** Test in all three engines (Chromium, Firefox, WebKit/Safari). Playwright makes this trivial with projects config.

- **Anti-pattern: Relying only on automated accessibility tools**
  - **Why it's bad:** Automated tools find ~57% of WCAG issues (axe-core). Screen reader usability, keyboard navigation, and logical content order require manual testing.
  - **What to do instead:** Use axe-core for initial scan, then manually test with NVDA/VoiceOver and keyboard-only navigation.

- **Anti-pattern: Testing mobile by resizing desktop browser**
  - **Why it's bad:** Doesn't emulate touch events, device pixel ratio, or mobile-specific rendering quirks
  - **What to do instead:** Use Chrome DevTools device emulation (includes touch, DPR, user agent) or Playwright viewport emulation.

- **Anti-pattern: Not testing theme switching exhaustively**
  - **Why it's bad:** CSS specificity bugs can cause style leakage between themes (LEGO styles persisting after switching to Light theme)
  - **What to do instead:** Test all theme combinations (LEGO → each theme, each theme → LEGO). Verify localStorage persistence.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Performance metrics collection | Custom performance.timing script | Lighthouse CLI / Lighthouse CI | Lighthouse calculates Core Web Vitals correctly (field data + lab data), handles FID polyfill, calculates CLS properly. Custom scripts miss edge cases. |
| Cross-browser automation | Selenium Grid with manual driver setup | Playwright | Playwright bundles browsers, handles WebDriver protocol, provides single API for Chromium/Firefox/WebKit. Zero configuration. |
| Accessibility scanning | Custom DOM walker checking ARIA | axe-core | axe-core has 4000+ rules covering WCAG 2.0/2.1/2.2, maintained by accessibility experts (Deque). Hand-rolled checkers miss obscure violations. |
| Color contrast validation | Custom RGB-to-luminance calculator | WebAIM Contrast Checker or axe-core | WCAG contrast algorithm has specific rounding rules and edge cases. Hand-rolled implementations get it wrong. |
| Visual regression testing | Custom screenshot diffing with ImageMagick | Playwright screenshot assertions | Playwright handles font loading, animation disabling, stable viewport setup, pixel diff visualization. ImageMagick diffs are noisy. |

**Key insight:** Validation testing involves well-defined standards (WCAG 2.1, Core Web Vitals) with complex calculations and edge cases. Open-source tools (Lighthouse, axe-core, Playwright) are battle-tested across millions of sites. Hand-rolling these capabilities introduces bugs and requires ongoing maintenance.

## Common Pitfalls

### Pitfall 1: Lighthouse Variability Creating False Negatives

**What goes wrong:** Running Lighthouse once, getting score of 89, concluding validation failed

**Why it happens:** Lighthouse performance scores vary by 5-10 points run-to-run due to:
- Network jitter (CDN latency, DNS lookup times)
- CPU throttling variability (simulated slow device)
- Background browser processes (extensions, other tabs)
- Lab data vs field data differences

**How to avoid:**
- Run Lighthouse 3-5 times, use median score
- Use Lighthouse CI with `numberOfRuns: 3` (automatic median)
- Test in Incognito mode (disables extensions)
- Close other tabs and applications
- Use `--preset=desktop` or `--preset=mobile` for consistent throttling

**Warning signs:**
- Scores fluctuating ±10 points between runs
- Performance score dropping on subsequent runs (thermal throttling on laptop)
- "Variability disclaimer" in Lighthouse report

### Pitfall 2: Missing Reduced-Motion Testing

**What goes wrong:** Implementing `prefers-reduced-motion` CSS but never manually testing it, shipping broken fallback

**Why it happens:** Reduced-motion is system-level setting, requires OS configuration change to test. Developers forget to verify.

**How to avoid:**
```javascript
// Chrome DevTools: Cmd+Shift+P → "Emulate CSS prefers-reduced-motion"
// Playwright:
await page.emulateMedia({ reducedMotion: 'reduce' });

// Verification steps:
// 1. Enable reduced-motion
// 2. Hover over animated elements
// 3. Verify: no smooth transitions, instant state changes
// 4. Verify: functionality still works (pressed button state, etc.)
```

**Warning signs:**
- CSS has `@media (prefers-reduced-motion)` but no one has tested it
- Animations completely disappear instead of becoming instant
- Interactive feedback breaks (buttons don't show pressed state)

### Pitfall 3: Font Loading FOIT/FOUT Breaking Visual Tests

**What goes wrong:** Playwright screenshots captured before web fonts load, causing false positives in visual regression tests

**Why it happens:** Web fonts load asynchronously. Playwright may take screenshot before Fredoka/Slackey/Baloo 2 finish loading, showing fallback system fonts instead.

**How to avoid:**
```javascript
// Wait for network idle (all fonts loaded)
await page.waitForLoadState('networkidle');

// Or wait for specific font to load
await page.evaluate(() => document.fonts.ready);

// Or wait for specific element to have correct font
await page.waitForFunction(() => {
  const h1 = document.querySelector('h1');
  return window.getComputedStyle(h1).fontFamily.includes('Fredoka');
});
```

**Warning signs:**
- Visual regression tests failing on text-heavy pages
- Screenshots show system fonts instead of custom fonts
- Tests pass locally but fail in CI (slower network)

### Pitfall 4: Not Testing Safari (WebKit)

**What goes wrong:** Testing only Chrome and Firefox, shipping broken LEGO theme on Safari

**Why it happens:** WebKit (Safari) has different rendering engine, different CSS support, different font rendering. Developers often skip Safari because it requires macOS or Playwright.

**How to avoid:**
```javascript
// Playwright supports WebKit on all platforms (Linux, Windows, macOS)
const { webkit } = require('playwright');
const browser = await webkit.launch();

// Or use projects in playwright.config.js
projects: [
  { name: 'chromium', use: devices['Desktop Chrome'] },
  { name: 'firefox', use: devices['Desktop Firefox'] },
  { name: 'webkit', use: devices['Desktop Safari'] },
]
```

**Safari-specific issues to watch:**
- Radial-gradient rendering differences (stud overlays may look different)
- Box-shadow blur radius interpretation
- Web font loading (Safari shows FOIT longer than Chrome)
- `backdrop-filter` not supported in older Safari (not used in LEGO theme)

**Warning signs:**
- "Works in Chrome" but Safari users report visual glitches
- Fonts flashing on page load (Safari FOIT)
- Box-shadows looking "softer" or "harder" than expected

### Pitfall 5: Contrast Checker Doesn't Account for Transparency

**What goes wrong:** Testing contrast of LEGO stud overlay (rgba(255, 255, 255, 0.3)) against white text, getting false pass

**Why it happens:** Contrast checkers test opaque colors. LEGO theme uses semi-transparent overlays (radial-gradient with rgba) which change effective contrast.

**How to avoid:**
```
1. Calculate effective color of transparent overlay:
   - Stud overlay: rgba(255, 255, 255, 0.3) on #0055bf (nav blue)
   - Effective color: blend(30% white + 70% blue) ≈ #4d7fd9

2. Test contrast of white text (#fff) against effective color (#4d7fd9)
   - Ratio: 2.8:1 — FAILS for normal text (needs 4.5:1)
   - BUT: Stud overlay is decorative, doesn't obscure text

3. Verify: Text remains readable with overlay
```

**Warning signs:**
- Contrast checker passes but text looks washed out
- Semi-transparent overlays on text elements
- Users report difficulty reading text in certain themes

### Pitfall 6: Mobile Lighthouse Scores Lower Than Desktop

**What goes wrong:** Desktop Lighthouse score is 95, mobile score is 78, developer confused

**Why it happens:** Lighthouse mobile uses:
- Slower CPU throttling (4x slowdown vs 2x desktop)
- Slower network (4G vs desktop)
- Smaller viewport (needs different layout)

Mobile performance is penalized more for:
- Large web fonts (170KB Fredoka/Slackey/Baloo 2 is bigger impact on 4G)
- Heavy animations (box-shadow paint cost higher on throttled CPU)
- Large images (if any)

**How to avoid:**
```bash
# Test mobile explicitly
npx lighthouse https://pedropaf.com --preset=mobile --only-categories=performance

# Review mobile-specific optimizations:
# - Reduced box-shadow layers (2 vs 3) ✓ (already done in Phase 19)
# - Font subsetting (only load characters used) ⚠ (not implemented, future optimization)
# - Preload critical fonts ⚠ (not implemented, future optimization)
```

**Expected outcome for Phase 21:** Mobile score may be 5-15 points lower than desktop (85-90 range). Still passes ≥90 criterion if average is above threshold, or accept mobile-specific target of ≥85.

**Warning signs:**
- Desktop score 95+, mobile score < 85
- LCP on mobile > 3s (fonts blocking render)
- TBT on mobile > 300ms (JavaScript on slow CPU)

## Code Examples

Verified patterns from official sources and documentation.

### Example 1: Running Lighthouse from Command Line

```bash
# Install Lighthouse globally
npm install -g lighthouse

# Run performance audit (desktop)
lighthouse https://pedropaf.com \
  --only-categories=performance \
  --output=html \
  --output-path=./lighthouse-desktop.html \
  --preset=desktop

# Run performance audit (mobile)
lighthouse https://pedropaf.com \
  --only-categories=performance,accessibility \
  --output=html \
  --output-path=./lighthouse-mobile.html \
  --preset=mobile

# Run with specific throttling
lighthouse https://pedropaf.com \
  --throttling.cpuSlowdownMultiplier=4 \
  --throttling.rttMs=150 \
  --throttling.throughputKbps=1638.4 \
  --output=json \
  --output-path=./lighthouse-results.json
```

**Source:** [Lighthouse CLI documentation](https://github.com/GoogleChrome/lighthouse)

### Example 2: Playwright Cross-Browser Test

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

```javascript
// tests/lego-theme.spec.js
import { test, expect } from '@playwright/test';

test.describe('LEGO theme integration', () => {
  test('renders baseplate grid pattern', async ({ page }) => {
    await page.goto('https://pedropaf.com');
    await page.selectOption('#theme-select', 'lego');

    const body = page.locator('body');
    const bgImage = await body.evaluate(el =>
      window.getComputedStyle(el).backgroundImage
    );

    expect(bgImage).toContain('repeating-linear-gradient');
  });

  test('displays brick shadows on cards', async ({ page }) => {
    await page.goto('https://pedropaf.com/portfolio');
    await page.selectOption('#theme-select', 'lego');

    const card = page.locator('.github-card').first();
    const boxShadow = await card.evaluate(el =>
      window.getComputedStyle(el).boxShadow
    );

    // Verify multi-layer box-shadow (contains multiple rgba values)
    expect(boxShadow.match(/rgba/g).length).toBeGreaterThanOrEqual(2);
  });

  test('loads custom fonts', async ({ page }) => {
    await page.goto('https://pedropaf.com');
    await page.selectOption('#theme-select', 'lego');
    await page.waitForLoadState('networkidle');

    const h1Font = await page.locator('h1').first().evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );

    expect(h1Font).toContain('Fredoka');
  });

  test('theme persists after reload', async ({ page }) => {
    await page.goto('https://pedropaf.com');
    await page.selectOption('#theme-select', 'lego');

    await page.reload();

    const selectedTheme = await page.locator('#theme-select').inputValue();
    expect(selectedTheme).toBe('lego');

    const dataTheme = await page.locator('html').getAttribute('data-theme');
    expect(dataTheme).toBe('lego');
  });
});
```

**Source:** [Playwright documentation](https://playwright.dev/docs/test-projects)

### Example 3: Accessibility Testing with axe-core

```javascript
// tests/accessibility.spec.js
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

test.describe('LEGO theme accessibility (WCAG 2.1 AA)', () => {
  test('homepage passes axe scan', async ({ page }) => {
    await page.goto('https://pedropaf.com');
    await page.selectOption('#theme-select', 'lego');
    await injectAxe(page);

    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    }, undefined, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
    });
  });

  test('color contrast meets WCAG AA', async ({ page }) => {
    await page.goto('https://pedropaf.com');
    await page.selectOption('#theme-select', 'lego');
    await injectAxe(page);

    // Run only color-contrast rule
    const violations = await getViolations(page, null, {
      runOnly: ['color-contrast']
    });

    expect(violations.length).toBe(0);
  });

  test('reduced motion removes transitions', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('https://pedropaf.com');
    await page.selectOption('#theme-select', 'lego');

    const navLink = page.locator('nav a').first();
    const transition = await navLink.evaluate(el =>
      window.getComputedStyle(el).transition
    );

    expect(transition).toContain('none');
  });
});
```

**Source:** [axe-core Playwright integration](https://github.com/dequelabs/axe-core)

### Example 4: Mobile Viewport Testing (iPhone SE)

```javascript
test('LEGO theme mobile layout (iPhone SE)', async ({ page }) => {
  // iPhone SE viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('https://pedropaf.com');
  await page.selectOption('#theme-select', 'lego');

  // Verify sidebar hidden on Posts page
  await page.goto('https://pedropaf.com/posts/');
  const sidebar = page.locator('.author-sidebar');
  await expect(sidebar).toBeHidden();

  // Verify sidebar visible on Home page (exception per RESP-01)
  await page.goto('https://pedropaf.com/');
  await expect(sidebar).toBeVisible();

  // Verify reduced box-shadow layers on mobile
  const card = page.locator('.github-card').first();
  const boxShadow = await card.evaluate(el =>
    window.getComputedStyle(el).boxShadow
  );

  // Mobile should have 2 layers, desktop has 3
  const layerCount = boxShadow.match(/rgba/g).length;
  expect(layerCount).toBe(2);
});
```

**Source:** [Playwright emulation documentation](https://playwright.dev/docs/emulation)

### Example 5: Manual Validation Checklist

```markdown
# Phase 21 Integration Validation Checklist

**Validator:** ___________
**Date:** ___________
**Browser:** Chrome ___ | Firefox ___ | Safari ___
**Viewport:** Desktop ___ | Mobile (iPhone SE) ___

## 1. Performance Validation (Success Criterion 1)

### Desktop Performance
- [ ] Open site in Chrome Incognito
- [ ] Switch to LEGO theme via Theme Switcher
- [ ] Open DevTools → Lighthouse tab
- [ ] Run audit: Performance + Accessibility
- [ ] **Performance score: ___ (target: ≥90)**
- [ ] LCP: ___ (target: ≤2.5s)
- [ ] FID: ___ (target: ≤100ms)
- [ ] CLS: ___ (target: ≤0.1)
- [ ] Screenshot of Lighthouse report saved to: ___

### Mobile Performance
- [ ] Open DevTools → Device Toolbar
- [ ] Select "iPhone SE" viewport
- [ ] Switch to LEGO theme
- [ ] Run Lighthouse audit (Performance)
- [ ] **Performance score: ___ (target: ≥90)**
- [ ] LCP: ___ (target: ≤2.5s)
- [ ] Screenshot saved

**Notes/Issues:**
___________

## 2. Accessibility Validation (Success Criterion 2)

### 2a. Color Contrast (WCAG 1.4.3)
- [ ] Visit [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] Test: Black text (#000000) on gray bg (#e4e4e4)
  - [ ] Ratio: ___ (target: ≥4.5:1)
- [ ] Test: Dark gray muted text (#555555) on gray bg (#e4e4e4)
  - [ ] Ratio: ___ (target: ≥4.5:1)
- [ ] Test: White text (#ffffff) on red header (#d11013)
  - [ ] Ratio: ___ (target: ≥4.5:1)
- [ ] Test: White text (#ffffff) on blue nav (#0055bf)
  - [ ] Ratio: ___ (target: ≥4.5:1)
- [ ] Test: LEGO yellow (#f6ec35) on gray bg (#e4e4e4)
  - [ ] Ratio: ___ (target: ≥3:1 for UI components)

**Contrast Issues Found:**
___________

### 2b. Reduced Motion (WCAG 2.3.3)
- [ ] Enable reduced motion:
  - [ ] macOS: System Settings → Accessibility → Display → Reduce motion
  - [ ] Windows: Settings → Accessibility → Visual effects → Animation effects OFF
  - [ ] Chrome DevTools: Cmd+Shift+P → "Emulate CSS prefers-reduced-motion"
- [ ] Reload site with LEGO theme
- [ ] Hover over navigation buttons
  - [ ] No smooth transitions (instant state change)
  - [ ] Button still shows pressed state on click
- [ ] Hover over portfolio cards
  - [ ] No bounce/scale animation
  - [ ] Hover state still visible (border color change)
- [ ] **All animations disabled, functionality preserved: YES / NO**

### 2c. Screen Reader Testing
- [ ] Enable screen reader (NVDA / VoiceOver / JAWS)
- [ ] Tab through page from top
  - [ ] Skip link announced: "Skip to main content"
  - [ ] Skip link works (jumps to main content)
- [ ] Theme switcher announced
  - [ ] Label "Theme:" associated with select element
  - [ ] Current theme value announced
  - [ ] Can change theme with keyboard
- [ ] Navigate through heading structure
  - [ ] H1 exists and is page title
  - [ ] H2-H3 hierarchy is logical (no skips)
- [ ] All links have descriptive text (no "click here")
- [ ] **Screen reader navigation works: YES / NO**

**A11y Issues Found:**
___________

## 3. Cross-Browser Validation (Success Criterion 3)

### Chrome (Chromium)
- [ ] Baseplate grid visible
- [ ] Card box-shadows render (3 layers)
- [ ] Nav button studs visible (radial-gradient circles)
- [ ] Bounce hover animation works
- [ ] Typography: H1 uses Fredoka, H2-H3 use Slackey, body uses Baloo 2
- [ ] Theme switcher works (select dropdown)
- [ ] **Chrome: PASS / FAIL**

### Firefox (Gecko)
- [ ] Baseplate grid visible
- [ ] Card box-shadows render (3 layers)
- [ ] Nav button studs visible
- [ ] Bounce hover animation works
- [ ] Typography loads correctly
- [ ] Theme switcher works
- [ ] **Firefox: PASS / FAIL**

### Safari (WebKit)
- [ ] Baseplate grid visible
- [ ] Card box-shadows render (3 layers)
- [ ] Nav button studs visible
- [ ] Bounce hover animation works
- [ ] Typography loads correctly (no FOIT flash)
- [ ] Theme switcher works
- [ ] **Safari: PASS / FAIL**

**Browser-Specific Issues:**
___________

## 4. Theme Switching Validation (Success Criterion 4)

Test matrix: Switch from LEGO to each theme, verify LEGO styles removed

- [ ] LEGO → Light
  - [ ] Baseplate grid removed
  - [ ] Box-shadows reset to default
  - [ ] System fonts restored
  - [ ] Reload page: Light theme persists
- [ ] LEGO → Dark
  - [ ] Dark colors applied
  - [ ] LEGO features removed
  - [ ] Reload: Dark persists
- [ ] LEGO → Sepia
  - [ ] Sepia colors, no LEGO styles
  - [ ] Reload: Sepia persists
- [ ] LEGO → Terminal
  - [ ] Terminal green, no LEGO styles
  - [ ] Reload: Terminal persists
- [ ] LEGO → Minecraft
  - [ ] Minecraft styles, no LEGO leakage
  - [ ] Reload: Minecraft persists
- [ ] LEGO → Synthwave
  - [ ] Synthwave neon, no LEGO styles
  - [ ] Reload: Synthwave persists
- [ ] Light → LEGO
  - [ ] All LEGO features appear
  - [ ] Reload: LEGO persists
- [ ] Dark → LEGO
  - [ ] All LEGO features appear
  - [ ] Reload: LEGO persists

**Theme switching works without visual glitches: YES / NO**

**Issues Found:**
___________

## 5. Mobile Responsive Validation (Success Criterion 5)

### iPhone SE Viewport (375×667)
- [ ] Open Chrome DevTools → Device Toolbar
- [ ] Select "iPhone SE"
- [ ] Switch to LEGO theme
- [ ] **Visual Features:**
  - [ ] Baseplate grid renders
  - [ ] Cards show brick shadows (2 layers, not 3)
  - [ ] Nav buttons show studs
  - [ ] Typography hierarchy works (Fredoka H1, Slackey H2-H3, Baloo 2 body)
  - [ ] Footer displays correctly
- [ ] **Responsive Behavior:**
  - [ ] Navigate to /posts/ → Sidebar HIDDEN
  - [ ] Navigate to / (home) → Sidebar VISIBLE
  - [ ] Navigate to /portfolio/ → Sidebar HIDDEN
  - [ ] Navigate to /cv/ → Sidebar HIDDEN
- [ ] **Touch Interactions:**
  - [ ] Tap navigation buttons (works)
  - [ ] Tap portfolio cards (works)
  - [ ] Tap theme switcher (works)
- [ ] **No layout breaks:** Text wraps correctly, no horizontal scroll

**Mobile works correctly: YES / NO**

**Mobile Issues Found:**
___________

---

## Final Validation Summary

**All 5 success criteria met: YES / NO**

1. Performance score ≥90: ___
2. WCAG 2.1 AA compliance: ___
3. Cross-browser compatibility: ___
4. Theme switching integrity: ___
5. Mobile responsive (iPhone SE): ___

**Validator signature:** ___________
**Date completed:** ___________
```

**Source:** Manual checklist pattern based on WCAG 2.1 Quick Reference and Core Web Vitals documentation

## State of the Art

### Evolution of Performance Testing (2024-2026)

| Old Approach | Current Approach (2026) | When Changed | Impact |
|--------------|-------------------------|--------------|--------|
| PageSpeed Insights only | Lighthouse CLI + CI integration | 2020-2023 | Developers can run performance audits locally, fail builds on regressions |
| Manual testing per commit | Automated Lighthouse CI in GitHub Actions | 2021-2024 | Performance budgets enforced automatically, regressions caught pre-merge |
| Single run, accept score | Multiple runs (3-5), use median | 2022-2025 | Reduces false negatives from Lighthouse variability |
| Desktop-only testing | Mobile-first performance testing | 2018-ongoing | Mobile Core Web Vitals are SEO ranking factors (Google, 2021) |

### Evolution of Accessibility Testing (2024-2026)

| Old Approach | Current Approach (2026) | When Changed | Impact |
|--------------|-------------------------|--------------|--------|
| Manual WCAG checklists only | axe-core automated scan + manual verification | 2018-2023 | Finds 57% of WCAG issues automatically, saves time on repetitive checks |
| JAWS only (expensive) | NVDA (free) + VoiceOver (built-in macOS) | 2019-2024 | Screen reader testing accessible to all developers, not just enterprises |
| WCAG 2.0 Level A | WCAG 2.1 Level AA standard | 2018-2023 | Adds mobile accessibility, reduced motion, contrast for UI components |
| Color contrast checked post-design | Contrast checked in design tools (Figma plugins) | 2020-2025 | Catches contrast issues before implementation |

### Evolution of Cross-Browser Testing (2024-2026)

| Old Approach | Current Approach (2026) | When Changed | Impact |
|--------------|-------------------------|--------------|--------|
| Selenium WebDriver + manual browser setup | Playwright (bundles browsers) | 2020-2024 | Zero configuration, single API for Chromium/Firefox/WebKit |
| Chrome-only testing ("works in my browser") | All three engines tested (Chromium, Gecko, WebKit) | 2018-ongoing | Catches Safari-specific bugs (10-15% of users) |
| Manual device testing (iPhone, Android) | Playwright device emulation | 2020-2024 | Fast iteration, no physical devices needed for initial validation |
| BrowserStack/Sauce Labs for cloud browsers | Playwright (runs locally, CI) | 2021-2025 | Faster feedback loops, no external service dependencies |

**Deprecated/outdated:**
- **PhantomJS:** Unmaintained since 2018, use headless Chromium instead
- **CasperJS:** Depends on PhantomJS, use Playwright/Puppeteer
- **WAVE browser extension only:** Use axe-core for automation, WAVE for manual spot-checks
- **PageSpeed Insights API as primary tool:** Use Lighthouse CLI for local control, PSI for field data only
- **Testing only Chrome 90+:** Modern web (2026) requires testing Safari (WebKit), Firefox (Gecko)

## Open Questions

### 1. Mobile Performance Target: Same as Desktop or Lower?

**What we know:**
- Desktop Lighthouse typically scores 95-100 for static Astro sites
- Mobile Lighthouse uses 4x CPU throttling, 4G network simulation
- LEGO theme has 170KB web fonts, multi-layer box-shadows (higher cost on mobile)

**What's unclear:**
- Should success criterion 1 require ≥90 for BOTH desktop and mobile, or allow mobile to be ≥85?
- Is 170KB web font payload acceptable for mobile, or should we implement font subsetting?

**Recommendation:**
- Target ≥90 for desktop (high confidence of achieving)
- Accept ≥85 for mobile (web fonts may reduce score by 5-10 points)
- If mobile scores < 85, document as technical debt for future optimization (font subsetting, preload)

### 2. Automated CI/CD or Manual Validation for Phase 21?

**What we know:**
- No test infrastructure exists in project yet (no Playwright, no Lighthouse CI)
- Phase 21 is one-time validation before v4.0 release
- Setting up automated CI/CD requires non-trivial effort (Playwright config, GitHub Actions workflow)

**What's unclear:**
- Is one-time validation sufficient, or will there be ongoing LEGO theme development?
- Is preventing future regressions a priority (requires CI/CD)?

**Recommendation:**
- For Phase 21: Use manual validation checklist (zero dependencies, faster execution)
- Document automation setup in research for future phases
- If project becomes actively maintained post-v4.0, implement Lighthouse CI + Playwright in Phase 22+

### 3. Visual Regression Testing: Baseline Now or Later?

**What we know:**
- Playwright can capture baseline screenshots for visual regression
- First run establishes baseline, subsequent runs compare against it
- Useful for detecting unintended theme switching glitches

**What's unclear:**
- Should Phase 21 establish visual regression baselines, or is manual visual inspection sufficient?
- If baselines are created, who maintains them when intentional design changes occur?

**Recommendation:**
- Manual visual inspection for Phase 21 (screenshot key pages for documentation)
- If implementing Playwright for cross-browser testing, capture baselines as byproduct
- Don't create baselines without plan for ongoing maintenance

## Phase Requirements Mapping

<phase_requirements>
## Phase Requirements

This phase validates ALL v4.0 requirements across the entire LEGO theme implementation.

| ID | Description | Research Support |
|----|-------------|-----------------|
| **VIS-01** | LEGO theme applies classic primary color palette (red, blue, yellow, green on light gray) across all page elements | **Validation:** Color contrast testing (WebAIM Contrast Checker) verifies palette meets WCAG AA. Cross-browser testing (Playwright/manual) verifies colors render consistently across Chromium/Firefox/WebKit. |
| **VIS-02** | Page background displays LEGO baseplate grid pattern when theme is active | **Validation:** Cross-browser testing verifies `repeating-linear-gradient` baseplate grid renders in all browsers. Visual inspection (manual or Playwright screenshot) confirms 24px × 24px grid appears. |
| **VIS-03** | All page elements (nav, cards, sidebar, footer, code blocks) visually transform under LEGO theme | **Validation:** Theme switching testing (8×8 matrix) verifies LEGO styles apply/remove correctly. Visual regression (Playwright screenshots) or manual inspection confirms all components transform. |
| **BRICK-01** | Content cards display brick-shaped appearance with multi-layer box-shadow depth effect | **Validation:** Cross-browser testing verifies box-shadow renders (3 layers desktop, 2 mobile). Computed style inspection confirms layer count. Performance testing ensures shadows don't tank Lighthouse score. |
| **BRICK-02** | Cards display circular LEGO studs on top surface via CSS pseudo-elements | **Validation:** Cross-browser testing (especially Safari/WebKit) verifies radial-gradient studs render correctly. Visual inspection confirms stud pattern appears. |
| **BRICK-03** | Navigation items styled as brick buttons with stud overlay and pressed-state feedback | **Validation:** Cross-browser testing verifies nav button studs (::before pseudo-element). Manual interaction testing confirms pressed state (translateY active state). |
| **BRICK-04** | Code blocks display brick border treatment while preserving Shiki syntax highlighting | **Validation:** Visual inspection confirms 3px blue border on code blocks. Cross-browser testing verifies Shiki syntax colors remain (dual-theme system working). |
| **TYPE-01** | H1 titles use bold logo-style font (Fredoka) for LEGO title appearance | **Validation:** Cross-browser testing verifies Fredoka 700 loads (computed font-family). Font loading testing (document.fonts.ready) ensures no FOIT/FOUT. Performance testing confirms 170KB font payload acceptable. |
| **TYPE-02** | H2-H3 headers use brick-built style font (Slackey) for section structure | **Validation:** Cross-browser testing verifies Slackey loads for H2-H3. Visual inspection confirms brick-built aesthetic. |
| **TYPE-03** | Body text uses playful rounded font (Baloo 2) maintaining readability | **Validation:** Cross-browser testing verifies Baloo 2 400+600 loads. Accessibility testing (axe-core, manual reading) confirms readability maintained. |
| **ANIM-01** | Cards and buttons display snap/bounce hover animation with spring physics easing | **Validation:** Cross-browser testing verifies cubic-bezier bounce easing works. Manual hover testing confirms bounce animation executes. Performance testing ensures animations don't trigger layout thrashing. |
| **ANIM-02** | Hover animations respect prefers-reduced-motion with graceful fallback | **Validation:** Reduced-motion testing (system setting + DevTools emulation) verifies transitions removed. Manual testing confirms pressed button state preserved (translateY active). Accessibility compliance verified. |
| **RESP-01** | Author sidebar is hidden on mobile (≤768px) for all pages except Home | **Validation:** Mobile viewport testing (iPhone SE 375×667) verifies sidebar hidden on /posts/, /portfolio/, /cv/. Manual testing confirms sidebar visible on /. Responsive breakpoint testing at 768px boundary. |

**Coverage:** 13/13 requirements validated (100%)

**Validation approach:** Combination of automated tools (Lighthouse, axe-core, Playwright) and manual testing provides comprehensive coverage. Performance and accessibility success criteria (1-2) ensure non-visual requirements met. Cross-browser and theme switching criteria (3-4) ensure visual requirements met. Mobile responsive criterion (5) ensures RESP-01 validated.
</phase_requirements>

## Sources

### Primary (HIGH confidence)

- [GitHub - GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci) - Lighthouse CI setup and configuration
- [GitHub - GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse) - Core Lighthouse tool
- [Lighthouse documentation | Chrome for Developers](https://developer.chrome.com/docs/lighthouse/overview) - Official Google Lighthouse docs
- [GitHub - microsoft/playwright](https://github.com/microsoft/playwright) - Playwright framework
- [Playwright documentation](https://playwright.dev/) - Official Playwright docs, browser support, emulation
- [Browsers | Playwright](https://playwright.dev/docs/browsers) - Cross-browser testing capabilities
- [Emulation | Playwright](https://playwright.dev/docs/emulation) - Mobile viewport and device emulation
- [Projects | Playwright](https://playwright.dev/docs/test-projects) - Multi-browser test configuration
- [GitHub - dequelabs/axe-core](https://github.com/dequelabs/axe-core) - axe-core accessibility engine
- [Accessibility testing | Playwright](https://playwright.dev/docs/accessibility-testing) - axe-core integration with Playwright
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG color contrast validation
- [NV Access | Download NVDA](https://www.nvaccess.org/download/) - Free screen reader for Windows
- [prefers-reduced-motion - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Official CSS spec
- [npm continuous integration | Harness](https://www.harness.io/harness-devops-academy/npm-continuous-integration) - npm CI/CD workflows
- [Building and testing Node.js - GitHub Docs](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs) - GitHub Actions Node.js testing

### Secondary (MEDIUM confidence)

- [Complete Guide to Astro Performance Optimization | BetterLink Blog](https://eastondev.com/blog/en/posts/dev/20251202-astro-performance-optimization/) - Astro-specific Lighthouse optimization (December 2025)
- [How to Animate CSS Box Shadows and Optimize Performance | SitePoint](https://www.sitepoint.com/css-box-shadow-animation-performance/) - Box-shadow animation performance guidance
- [How to animate box-shadow with silky smooth performance | Tobias Ahlin](https://tobiasahlin.com/blog/how-to-animate-box-shadow/) - Box-shadow optimization techniques
- [Automated Visual Regression Testing With Playwright | CSS-Tricks](https://css-tricks.com/automated-visual-regression-testing-with-playwright/) - Visual regression testing patterns
- [Visual Regression Testing: Beginner's Guide with Playwright](https://testingplus.me/visual-regression-playwright-testing-part-one/) - Playwright screenshot testing
- [Snapshot Testing with Playwright in 2026 | BrowserStack](https://www.browserstack.com/guide/playwright-snapshot-testing) - Current snapshot testing practices
- [Automating Screen Readers for Accessibility Testing | AssistivLabs](https://assistivlabs.com/articles/automating-screen-readers-for-accessibility-testing) - Screen reader automation approaches
- [Screen Reader Testing Guide | TestParty](https://testparty.ai/blog/screen-reader-testing-guide) - NVDA, JAWS, VoiceOver comparison
- [WCAG 2.1 AA Compliance: Complete Checklist (2026) | WebAbility](https://www.webability.io/blog/wcag-2-1-aa-the-standard-for-accessible-web-design) - Current WCAG standards
- [Color Contrast for Accessibility: WCAG Guide (2026) | WebAbility](https://www.webability.io/blog/color-contrast-for-accessibility) - Contrast requirements
- [Optimize WebFont loading and rendering | web.dev](https://web.dev/articles/optimize-webfont-loading) - Font performance optimization
- [Preloading Fonts | Fontsource](https://fontsource.org/docs/getting-started/preload) - Fontsource preloading guidance

### Tertiary (LOW confidence - marked for validation)

- Blog posts and Medium articles on testing best practices (various authors, no official verification)
- Community forum discussions on Playwright/Lighthouse (unverified tips)
- Third-party accessibility tool comparisons (not from official WCAG or tool maintainers)

## Metadata

**Confidence breakdown:**
- **Performance validation (Lighthouse):** HIGH - Official Google tool, well-documented, widely used. Astro-specific guidance from recent 2025-2026 sources.
- **Accessibility validation (WCAG 2.1 AA):** HIGH - W3C standard, axe-core is Deque-maintained open source, WebAIM is authoritative. Screen reader testing guidance from reputable sources.
- **Cross-browser testing (Playwright):** HIGH - Official Microsoft tool, excellent documentation, supports all major browsers. No third-party dependencies.
- **Mobile responsive testing:** HIGH - Playwright device emulation well-documented. iPhone SE viewport specs verified against Apple's official specs.
- **Theme switching validation:** MEDIUM - No standard tooling exists. Pattern based on manual testing best practices and visual regression testing guidance.

**Research date:** 2026-02-17
**Valid until:** 2026-08-17 (6 months for stable domain - core web standards and major tools change slowly)

**Research methodology:**
- WebSearch used for current state of tooling (Lighthouse CI, Playwright, axe-core)
- Official documentation prioritized (Chrome Developers, Playwright.dev, W3C)
- Cross-referenced multiple sources for critical claims (performance budgets, WCAG requirements)
- Codebase examined to understand current implementation (themes.css, BaseLayout.astro, package.json)
- Prior phase decisions incorporated (Phase 18-20 architectural choices)

**Limitations:**
- No hands-on testing performed during research (validation will occur during execution)
- Lighthouse scores estimated based on Astro benchmarks, not actual testing of pedropaf.com
- Screen reader automation marked as optional (manual testing sufficient for Phase 21)
- CI/CD automation documented but recommended as future work, not required for v4.0 milestone
