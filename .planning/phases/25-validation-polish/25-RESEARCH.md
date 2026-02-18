# Phase 25: Validation & Polish - Research

**Researched:** 2026-02-18
**Domain:** CSS theme isolation validation, responsive layout testing, Lighthouse performance measurement
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| QUAL-01 | Zero theme style leakage — switching FROM Minecraft to any other theme produces clean result | CSS scoping analysis shows all 80 `[data-theme="minecraft"]` selectors correctly scoped; leakage risk vectors identified; static CSS grep + manual browser DevTools computed-styles inspection is the verification method |
| QUAL-02 | Mobile responsive across all themed elements at 320px+ viewport | `@media (max-width: 480px)` block already present in minecraft.css for nav; five element types need 320px viewport check; Chrome DevTools device mode at 320px width is the test method |
| QUAL-03 | Lighthouse performance score within 10 points of non-themed baseline | LEGO baseline exists at score 89/100 (lighthouse-lego.json); font payload adds ~35KB; Lighthouse 13.0.3 available via `npx lighthouse`; headless Chrome run pattern documented |
</phase_requirements>

---

## Summary

Phase 25 is a validation-only phase — no new code is written from scratch. The Minecraft theme CSS (605 lines, fully scoped to `[data-theme="minecraft"]`) was completed in Phases 22-24. This phase runs three explicit checks: (1) CSS leakage audit to confirm that switching away from the Minecraft theme leaves zero Minecraft styles active, (2) a 320px viewport sweep across all themed element types, and (3) a Lighthouse performance run with the Minecraft theme active compared to the known non-themed baseline.

The primary risk this phase must address is that `lighthouse-lego.json` (score 89/100) is the only existing baseline and was run with the LEGO theme active — not the no-theme baseline. The success criterion requires comparison to "no theme active" (i.e., the light/default theme), which is not the same as the LEGO run. A fresh no-theme baseline must be captured first before the Minecraft-themed run. Both runs must use identical conditions (same dev server, same page URL, same Chrome flags).

The leakage check is primarily a static analysis problem: grep minecraft.css for any selectors not scoped under `[data-theme="minecraft"]`, and also check themes.css for any minecraft-related rules that lack scoping. The existing architecture makes leakage structurally unlikely because all 80 Minecraft selectors confirmed use `[data-theme="minecraft"]` prefix — but the CSS custom properties (`--mc-*` variables) are inherited down the DOM tree, so the critical question is whether `--mc-*` variables are accessible outside the minecraft theme scope. They are not, because they are defined only inside `[data-theme="minecraft"] { }` which is removed when the attribute changes.

**Primary recommendation:** Run three independent verification tasks — (A) a static CSS leakage grep, (B) a Chrome DevTools 320px viewport check across five page types, and (C) a paired Lighthouse run (no-theme vs minecraft-theme) using `npx lighthouse` with `--output json`.

---

## Standard Stack

### Core

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| `npx lighthouse` | 13.0.3 (already available in this repo) | Measure Lighthouse performance score against local dev server | Available via npx without install; same version used for existing LEGO baseline |
| Chrome DevTools Device Mode | Built-in (Chrome) | 320px viewport simulation for QUAL-02 | WCAG 1.4.10 Reflow standard test method; official Chrome docs confirm "Mobile S - 320px" as a preset |
| Grep / text search | Built-in (shell) | Static CSS scoping audit for QUAL-01 | No dependency; deterministic; catches unscoped selectors before browser test |

### Supporting

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `astro dev` | Astro 5.x | Local dev server on port 4321 | Required for Lighthouse run; lighthouse runs against live server, not static files |
| `python3` (already available) | System | Parse Lighthouse JSON output and compare scores | Scripted score extraction; same pattern used for existing lighthouse-lego.json |
| Browser computed styles panel | DevTools | Verify that no `--mc-*` custom properties resolve after theme switch | Secondary check if static grep finds no issues |

### No New Dependencies Needed

This phase requires zero new npm packages. All validation is done with:
- Shell grep (static analysis)
- `npx lighthouse` (already cached from LEGO baseline run)
- A web browser (Chrome) for manual 320px viewport inspection
- `python3` for JSON score parsing (already used for lighthouse-lego.json analysis)

**Installation:** None required.

---

## Architecture Patterns

### Pattern 1: Paired Lighthouse Run (No-Theme vs Minecraft-Theme)

**What:** Run Lighthouse twice against the same URL with same flags, once with no `data-theme` attribute (light/default) and once with `data-theme="minecraft"` active. Compare performance scores.

**When to use:** QUAL-03 verification — the "10 points within baseline" check.

**Critical prerequisite:** The existing `lighthouse-lego.json` (score 89) is NOT the baseline for QUAL-03. It was captured with the LEGO theme active. A new no-theme run must be captured first.

**How the minecraft theme is activated for Lighthouse:**
The theme is stored in `localStorage` and applied before first paint via an inline script in `<head>`. Lighthouse's headless Chrome does not execute localStorage. Therefore, the theme must be applied via the URL approach or by patching the inline script. The cleanest approach: temporarily hardcode `data-theme="minecraft"` in `BaseLayout.astro` for the Minecraft-themed run, then revert.

Alternatively, inject via `--extra-headers` or use Lighthouse's `--chrome-flags` to run a custom Chrome startup script — but these are complex. The simplest reliable method: edit `BaseLayout.astro` inline script for the measurement run.

**Example command pattern:**
```bash
# Start dev server in background
npx astro dev &
sleep 5  # wait for server

# Run 1: No-theme baseline (default light theme, no data-theme attribute)
npx lighthouse http://localhost:4321/ \
  --output=json \
  --output-path=./lighthouse-baseline-notheme.json \
  --only-categories=performance \
  --chrome-flags="--headless --no-sandbox" \
  --quiet

# [Then temporarily set data-theme="minecraft" hardcoded in BaseLayout.astro]

# Run 2: Minecraft theme active
npx lighthouse http://localhost:4321/ \
  --output=json \
  --output-path=./lighthouse-minecraft.json \
  --only-categories=performance \
  --chrome-flags="--headless --no-sandbox" \
  --quiet

# Extract and compare scores
python3 -c "
import json
b = json.load(open('lighthouse-baseline-notheme.json'))
m = json.load(open('lighthouse-minecraft.json'))
baseline = round(b['categories']['performance']['score'] * 100)
minecraft = round(m['categories']['performance']['score'] * 100)
diff = baseline - minecraft
print(f'Baseline: {baseline}/100')
print(f'Minecraft: {minecraft}/100')
print(f'Difference: {diff} points')
print(f'QUAL-03: {\"PASS\" if diff <= 10 else \"FAIL\"}')
"
```

**Lighthouse 13 system requirement:** Node.js 22.19 or higher. This system is on Node v25.2.1 — compatible.

### Pattern 2: Static CSS Leakage Audit

**What:** A grep-based scan of all CSS files to verify every Minecraft-specific rule uses `[data-theme="minecraft"]` scoping.

**When to use:** QUAL-01 — first step before browser check, deterministic.

**Leakage vectors to check:**
1. `src/styles/themes/minecraft.css` — any selector not starting with `[data-theme="minecraft"]`
2. `src/styles/themes.css` — the Shiki code block rules for minecraft (lines 869-872) — currently scoped correctly as `[data-theme="minecraft"] .astro-code`
3. CSS custom properties (`--mc-*`) — these are defined inside `[data-theme="minecraft"] { }` so they are auto-removed when the attribute changes; no leakage possible via custom props

**Example grep commands:**
```bash
# Find any unscoped rules in minecraft.css (should return 0 results)
grep -n "^[a-zA-Z\.\#\*]" src/styles/themes/minecraft.css

# Confirm all minecraft-specific rules in themes.css are scoped
grep -n "minecraft" src/styles/themes.css
# Expected: only lines 869-872 (shiki override, correctly scoped)

# Verify --mc-* vars are only inside [data-theme="minecraft"] blocks
grep -n "\-\-mc-" src/styles/themes/minecraft.css | head -20
# Expected: all inside [data-theme="minecraft"] { } block (lines 17-49)
```

**Current state (from codebase inspection):**
- 80 Minecraft selectors all use `[data-theme="minecraft"]` prefix (verified: `grep -c "^[[:space:]]*\[data-theme" minecraft.css` returns 80)
- No top-level selectors found in minecraft.css (verified: `grep -n "^[a-zA-Z\.]" minecraft.css` returns only comment lines)
- themes.css minecraft references are only the Shiki code block overrides (lines 869-872), correctly scoped
- CSS custom properties defined only inside `[data-theme="minecraft"] { }` block (lines 17-49)

**Remaining leakage risk:** None found statically. Browser-level verification should check that after switching FROM minecraft to another theme, computed `background-image` on `body` reverts to the default (no SVG texture), and `font-family` on `body` reverts to `var(--font-system)`.

### Pattern 3: 320px Viewport Responsive Check

**What:** Open the site in Chrome DevTools device mode at 320px width with Minecraft theme active, navigate through key pages, confirm no horizontal overflow or content truncation.

**When to use:** QUAL-02 verification.

**Elements that need 320px verification:**
1. **Nav hotbar** — 6 items (`Home`, `Publications`, `Talks`, `Blog`, `Portfolio`, `CV`); the `@media (max-width: 480px)` block enables `overflow-x: auto` and `flex-wrap: nowrap` with `font-size: 11px` and `padding: 5px 6px`. This should allow all slots to scroll horizontally at 320px.
2. **Card grid** (portfolio, github cards) — `auto-fill, minmax(280px, 1fr)` grid means at 320px only 1 column renders (280px < 320px content area). Cards as inventory slots: `border: 2px solid #000; box-shadow: inset...` must not overflow.
3. **Author sidebar** — hidden at 320px for all pages except home (`@media (max-width: 768px) .author-sidebar { display: none }` except `.page-home .author-sidebar`). On home, sidebar width = 250px within 320px total — could be tight. Check sidebar renders without overflow.
4. **Code blocks** (`.astro-code`) — `Press Start 2P` at `0.7em` in a 320px container; CSS has `overflow-x: auto` which should allow horizontal scroll. Verify no layout break.
5. **Footer** — `footer::before` (creeper face, 48x48 centered), `footer::after` (hearts row, 90px width) — both need to fit in 320px. At 90px, the hearts row is well within 320px. Center alignment should work.

**How to set viewport to 320px in Chrome:**
1. Open DevTools (F12 or Cmd+Option+I)
2. Click device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Enter `320` in the width field manually (or select "Mobile S" preset if available)
4. Set zoom to 100% (not scaled)

**What to look for:**
- Horizontal scrollbar on `body` = overflow failure
- Text clipped/truncated without scroll = layout failure
- Elements overlapping other elements = z-index/positioning failure
- Press Start 2P headings at `h2` within content — 14px minimum set in CSS, should be readable at 320px

### Anti-Patterns to Avoid

- **Running Lighthouse with cached assets only:** Always run against a fresh `astro dev` server. The build output can differ from dev in asset loading order.
- **Comparing to the LEGO baseline:** `lighthouse-lego.json` (score 89) is a LEGO-themed run, not a no-theme baseline. Do not use it as the QUAL-03 reference — it will give a misleading delta.
- **Testing only the homepage:** The Minecraft theme applies globally. Test at minimum: homepage (`/`), a page with code blocks (`/posts/*` or `/cv/`), and a page with `.portfolio-card` elements.
- **Running Lighthouse with the browser open:** Lighthouse captures its own headless Chrome instance. Running with `--headless` avoids interference from open browser tabs.
- **Checking leakage visually only:** Visual inspection can miss subtle inherited properties. Always run the grep audit first to confirm structural correctness.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Performance score comparison | Custom performance timing script | `npx lighthouse --output json` + python3 score extraction | Lighthouse aggregates 5 metrics with correct weights; hand-rolled timing won't match the standardized score |
| CSS leakage detection | Browser automation (Playwright/Puppeteer) | Static grep audit | Zero setup, deterministic, no browser dependency; this is a CSS architecture audit not a runtime test |
| 320px viewport simulation | Resize browser window manually | Chrome DevTools device mode | Device mode sets exact CSS pixel width independently of OS DPI and window chrome |
| Lighthouse theme injection | Custom HTTP server with theme param | Temporarily hardcode `data-theme` in BaseLayout.astro | Lighthouse headless doesn't execute localStorage; BaseLayout edit is the simplest reliable method for a one-off measurement run |

**Key insight:** Phase 25 is a measurement and reporting phase, not a development phase. All validation uses existing standard tools against the completed codebase. The work is systematic checking, not building.

---

## Common Pitfalls

### Pitfall 1: Wrong Baseline for QUAL-03

**What goes wrong:** Developer compares Minecraft Lighthouse score against `lighthouse-lego.json` (89/100) instead of a fresh no-theme baseline. This produces incorrect delta and may mask a real performance regression.

**Why it happens:** `lighthouse-lego.json` exists in the repo root and looks like a baseline. But it was captured with the LEGO theme active (the LEGO run from Phase 22 validation), which loads LEGO-specific fonts (Fredoka 700, Slackey, Baloo 2 — total ~170KB WOFF2) and SVG assets.

**How to avoid:** Always capture a new no-theme run first in the same session, using identical Lighthouse flags and the same local server instance.

**Warning signs:** If the no-theme run score is significantly different from 89, it means the LEGO baseline was not a valid no-theme reference.

### Pitfall 2: Lighthouse localStorage Theme Not Active

**What goes wrong:** Running Lighthouse headless against the site with Minecraft theme stored in localStorage — the headless Chrome instance starts with empty localStorage, so the site loads without any theme (default light). The run measures the no-theme state, not the Minecraft theme.

**Why it happens:** The site's theme is applied via `localStorage.getItem('site-theme')` in an inline script in `<head>`. Headless Chrome spawned by Lighthouse starts fresh with no localStorage.

**How to avoid:** Before the Minecraft-themed Lighthouse run, temporarily hardcode `document.documentElement.setAttribute('data-theme', 'minecraft')` in the inline script in `BaseLayout.astro`, or set `data-theme="minecraft"` directly on the `<html>` element in the template. Revert after the run.

**Warning signs:** Lighthouse screenshots in the JSON output show light theme colors (white background) instead of Minecraft green/dirt — confirms localStorage approach failed.

### Pitfall 3: 320px Test on Home Page Misses Sidebar Layout

**What goes wrong:** Testing only the home page at 320px. The home page shows the sidebar (`.page-home .author-sidebar { display: block }` at narrow viewport), but other pages hide it. Home page at 320px with sidebar visible is the hardest layout case.

**Why it happens:** The sidebar is 250px wide and appears inline with content on home at all widths, including narrow. At 320px, the sidebar and main content would need to stack vertically (sidebar stacks above main) because the flex layout only applies at `min-width: 768px`.

**How to avoid:** Test the home page at 320px specifically, and also test at least one page without the sidebar (e.g., `/cv/`) to check unconstrained main content width.

**Warning signs:** Sidebar bleeds outside 320px boundary, or horizontal scrollbar appears on body.

### Pitfall 4: Press Start 2P Font Causing Overflow at 320px

**What goes wrong:** `h2` and `h3` headings using Press Start 2P overflow the 320px container, creating horizontal scroll on the main content.

**Why it happens:** Press Start 2P is a monospace bitmap font with fixed-width characters. Long heading text cannot wrap like a proportional font. A long h2 like "Recent Publications" at even 12px will require significant horizontal space.

**How to avoid:** The existing CSS sets `[data-theme="minecraft"] h3 { font-size: 14px; }` as the minimum. Check that long h2 headings do not overflow at 320px. If they do, the fix is `word-break: break-word` or `overflow-wrap: break-word` on headings within the minecraft scope.

**Warning signs:** Any heading text that would require more than ~250px at 14px (roughly 15 characters of Press Start 2P at 14px).

### Pitfall 5: CSS Custom Properties Appearing as "Leakage"

**What goes wrong:** After switching FROM minecraft to another theme, DevTools shows `--mc-*` variables still defined on elements — appearing to be leakage, but it's not.

**Why it happens:** `--mc-*` variables are defined in `[data-theme="minecraft"]` on the `:root`. When `data-theme` changes, the `[data-theme="minecraft"]` rule no longer applies to `:root`, so the variables become undefined. However, if DevTools cached view isn't refreshed, old values may show.

**How to avoid:** After switching themes, refresh the DevTools computed styles view. Check `document.documentElement.style.getPropertyValue('--mc-bg-grass')` in the console — it should return empty string after switching away from minecraft.

**Warning signs:** This is a false positive pattern. Actual leakage would be `font-family: 'Press Start 2P'` on `h2` after switching away — not `--mc-*` variable presence.

---

## Code Examples

Verified patterns from official sources and codebase inspection:

### Lighthouse CLI Pattern (Verified: `npx lighthouse --help` output, Lighthouse 13.0.3)

```bash
# Start dev server (Astro 5.x default port: 4321)
npx astro dev &
DEV_PID=$!
sleep 8  # allow Astro to compile and serve

# No-theme baseline run (default light theme, no data-theme attribute on html)
# Assumes BaseLayout.astro inline script has NOT been modified
npx lighthouse http://localhost:4321/ \
  --output=json \
  --output-path=./lighthouse-notheme.json \
  --only-categories=performance \
  --chrome-flags="--headless --no-sandbox" \
  --quiet

# ---- MANUALLY set data-theme="minecraft" in BaseLayout.astro ----
# In src/layouts/BaseLayout.astro, change the inline script to always set:
#   document.documentElement.setAttribute('data-theme', 'minecraft');
# (temporary, revert after measurement)

# Minecraft theme run
npx lighthouse http://localhost:4321/ \
  --output=json \
  --output-path=./lighthouse-minecraft.json \
  --only-categories=performance \
  --chrome-flags="--headless --no-sandbox" \
  --quiet

# ---- REVERT BaseLayout.astro to original inline script ----

kill $DEV_PID

# Score comparison
python3 -c "
import json
b = json.load(open('lighthouse-notheme.json'))
m = json.load(open('lighthouse-minecraft.json'))
baseline = round(b['categories']['performance']['score'] * 100)
mc = round(m['categories']['performance']['score'] * 100)
diff = baseline - mc
print(f'No-theme baseline: {baseline}/100')
print(f'Minecraft theme:   {mc}/100')
print(f'Delta: {diff} points')
print(f'QUAL-03 result: {\"PASS (within 10pts)\" if abs(diff) <= 10 else \"FAIL (exceeds 10pts)\"}')
"
```

### Static CSS Leakage Audit (Verified: grep against actual minecraft.css)

```bash
# Test 1: No unscoped rules in minecraft.css
echo "=== Unscoped CSS rules in minecraft.css ==="
UNSCOPED=$(grep -n "^[a-zA-Z\.\#\*]" src/styles/themes/minecraft.css)
if [ -z "$UNSCOPED" ]; then
  echo "PASS: All rules scoped (no unscoped selectors)"
else
  echo "FAIL: Found unscoped rules:"
  echo "$UNSCOPED"
fi

# Test 2: All minecraft references in themes.css are scoped
echo ""
echo "=== Minecraft references in themes.css ==="
grep -n "minecraft" src/styles/themes.css

# Test 3: --mc-* custom properties defined only inside minecraft scope
echo ""
echo "=== --mc-* property definition locations ==="
grep -n "\-\-mc-" src/styles/themes/minecraft.css | head -20
# All should be inside lines 17-49 ([data-theme="minecraft"] { } block)

# Test 4: After switching theme in browser console — verify cleanup
# (Manual browser test — paste into DevTools console after switching away)
# document.documentElement.setAttribute('data-theme', 'light');
# console.log('bg-image:', getComputedStyle(document.body).backgroundImage);
# Expected: no url('/images/minecraft/...') — should be 'none' or empty
```

### 320px Viewport Test Checklist

```
# DevTools device mode setup:
# 1. Open Chrome → Navigate to http://localhost:4321/
# 2. Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
# 3. Set width = 320, height = any
# 4. Activate Minecraft theme via theme switcher dropdown

# Elements to verify at 320px:
[ ] Nav hotbar: 6 slots visible with horizontal scroll, no vertical overflow
[ ] Body background: grass.svg texture repeating, no horizontal scroll on body
[ ] Home sidebar: stacks above main content, 250px sidebar fits in 320px
[ ] Main content: text readable, h1 (Silkscreen) not overflowing
[ ] h2 headings (Press Start 2P): wrap or fit within 320px content area
[ ] Code blocks: overflow-x scroll active, no layout break
[ ] Footer: creeper face (48x48) and hearts (90px) centered within 320px
[ ] Portfolio cards: 1-column grid (minmax 280px), full width within content area
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Manual visual inspection for theme leakage | Static CSS grep + browser computed styles check | Deterministic; grep finds structural issues before visual check |
| Lighthouse DevTools panel | `npx lighthouse --output json` CLI | Scriptable, comparable, JSON output for score extraction |
| Running Lighthouse against built dist/ | Running against `astro dev` (port 4321) | Dev server matches build output for CSS; avoids CDN/cache variables in local testing |

**Deprecated/outdated in this context:**
- Lighthouse `--headless=new` flag (Lighthouse 13 docs show `--headless` without `=new` suffix is sufficient for modern Chrome)
- `lighthouse-lego.json` as QUAL-03 baseline: valid for LEGO theme comparison but NOT for the "no-theme" baseline required by QUAL-03

---

## Performance Expectation Analysis

Based on the LEGO baseline (score 89) and the Minecraft theme's asset profile:

**Font payload comparison:**
- LEGO theme loads: Fredoka 700, Slackey, Baloo 2 400+600 (~170KB WOFF2 estimated from prior research)
- Minecraft theme loads: Silkscreen 400+700 (20KB), Press Start 2P (16KB), Pixelify Sans (8KB) = **~44KB latin** — substantially less than LEGO
- No-theme baseline loads: No custom fonts (system font stack) = 0KB

**SVG asset payload:**
- Minecraft: 13 SVGs = 13.2KB total (all served as background-image, loaded lazily by browser when CSS rule applies)
- LEGO: ~16 SVGs estimated similar size
- No-theme: 0KB

**LCP issue in LEGO baseline:**
- LCP score was 0.56 (LCP = 2.2s) because the author photo (`img.author-photo`) is the LCP element and lacks `fetchpriority="high"`
- This issue exists regardless of theme — it will affect both the no-theme baseline and the Minecraft run equally
- QUAL-03 allows 10-point delta; the LCP issue is pre-existing and symmetrical, so it will not create an asymmetric score difference

**Realistic score prediction for Minecraft vs no-theme:**
- The no-theme baseline will likely score 89-96/100 (no font loading, same LCP issue)
- Minecraft theme will likely score 82-92/100 (pixel fonts add ~44KB, small LCP impact from font block)
- Delta is likely 5-10 points — borderline
- If delta exceeds 10 points, the fix is `font-display: swap` (already set in Fontsource) plus `<link rel="preload">` for the most critical font file (Pixelify Sans, used for body text)

**Risk:** The 44KB of pixel fonts could push delta beyond 10 points if Lighthouse penalizes font loading more than expected. The planner should include a contingency task to add `<link rel="preload">` for Pixelify Sans if the delta fails.

---

## Open Questions

1. **Whether Lighthouse score will pass QUAL-03 without changes**
   - What we know: Pixel fonts are 44KB Latin (with `font-display: swap`); LEGO baseline was 89/100; LCP issue is pre-existing
   - What's unclear: No-theme baseline score; whether 44KB font load pushes delta past 10 points
   - Recommendation: Run the measurement first before attempting any fixes; do not optimize preemptively

2. **Whether the home page sidebar at 320px causes layout overflow**
   - What we know: Sidebar is 250px wide; content wrapper uses flexbox at 768px+; below 768px flexbox doesn't apply
   - What's unclear: Whether the sidebar stacks above (block flow) or creates a 250+main width constraint at 320px
   - Recommendation: Test the home page at 320px in Chrome DevTools first; if sidebar overflows, add `max-width: 100%` inside the minecraft scope for `.author-sidebar`

3. **Whether Press Start 2P h2 headings overflow at 320px**
   - What we know: `font-size: 14px` minimum set for h3; h2 inherits from theme defaults (likely larger)
   - What's unclear: Actual computed width of longest h2 on real pages at 14-16px Press Start 2P
   - Recommendation: Test in browser; if overflow detected, add `word-break: break-word` scoped to `[data-theme="minecraft"] h2`

---

## Sources

### Primary (HIGH confidence)

- Codebase: `src/styles/themes/minecraft.css` — 605 lines, all 80 selectors verified as `[data-theme="minecraft"]` scoped
- Codebase: `lighthouse-lego.json` — Lighthouse 13.0.3, score 89/100, LEGO theme, captured 2026-02-17
- Codebase: `src/layouts/BaseLayout.astro` — theme application mechanism via localStorage inline script
- Codebase: `src/components/ThemeSwitcher.astro` — `applyTheme()` function sets `data-theme` attribute
- Official: `npx lighthouse --help` — CLI flags verified: `--output json`, `--only-categories performance`, `--chrome-flags`, `--output-path`
- Official: Lighthouse 13 docs — confirms Node 22.19+ requirement; Node v25.2.1 on this system is compatible
- Codebase: font files measured — 35.3KB latin subset total for all three pixel font families

### Secondary (MEDIUM confidence)

- WebFetch: [GitHub lighthouse README](https://github.com/GoogleChrome/lighthouse/blob/main/readme.md) — CLI usage pattern confirmed; `npm install -g lighthouse` vs `npx lighthouse` both valid
- WebFetch: [Lighthouse 13 release notes](https://developer.chrome.com/blog/lighthouse-13-0) — "no changes to performance scoring in this version"; Node 22.19+ requirement
- WebSearch: Chrome DevTools device mode documentation — 320px "Mobile S" preset confirmed; `Ctrl+Shift+M` toggle confirmed

### Tertiary (LOW confidence — requires validation)

- Claim: Minecraft theme Lighthouse score will be within 10 points of no-theme baseline — based on font payload analysis (35KB vs LEGO 170KB); not yet measured
- Claim: Horizontal scroll in nav at 320px will work via `overflow-x: auto` — structurally correct per CSS but not visually confirmed in browser

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools exist on the system, versions verified, commands tested
- Architecture patterns: HIGH — derived from actual codebase inspection, not assumptions
- Leakage risk assessment: HIGH — static analysis of all 80 selectors confirmed scope
- Performance prediction: MEDIUM — based on file size analysis; actual score unknown until measured
- 320px layout: MEDIUM — CSS structure looks correct but requires visual browser confirmation

**Research date:** 2026-02-18
**Valid until:** 2026-03-18 (30 days — CSS and Lighthouse CLI are stable)
