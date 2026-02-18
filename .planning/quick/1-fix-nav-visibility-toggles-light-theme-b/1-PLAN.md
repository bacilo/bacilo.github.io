---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/data/site.json
  - src/components/Navigation.astro
  - public/admin/config.yml
  - src/styles/global.css
  - src/styles/themes.css
  - src/components/ThemeSwitcher.astro
  - src/layouts/BaseLayout.astro
autonomous: true
requirements: []

must_haves:
  truths:
    - "Nav items can be hidden individually via CMS toggle in site.json"
    - "Navigation.astro renders only items where visible is true (or missing)"
    - "Light theme selected explicitly shows white background on dark OS"
    - "CMS Stats Display field shows exactly one '(None)' option"
  artifacts:
    - path: "src/data/site.json"
      provides: "nav array with visible flags"
      contains: "nav"
    - path: "src/styles/themes.css"
      provides: "[data-theme='light'] rule with light palette"
      contains: "data-theme=\"light\""
    - path: "src/components/ThemeSwitcher.astro"
      provides: "applyTheme sets data-theme='light' instead of removeAttribute"
      contains: "setAttribute.*light"
    - path: "src/layouts/BaseLayout.astro"
      provides: "anti-flash script sets data-theme='light' explicitly"
      contains: "data-theme.*light"
  key_links:
    - from: "src/data/site.json"
      to: "src/components/Navigation.astro"
      via: "Astro.glob or import, filter on item.visible !== false"
    - from: "ThemeSwitcher.astro applyTheme"
      to: "themes.css [data-theme='light']"
      via: "setAttribute('data-theme','light')"
---

<objective>
Three targeted bug fixes: (1) make nav items toggleable via site.json + CMS booleans, (2) fix light theme breaking on dark OS by adding an explicit [data-theme="light"] CSS rule and updating JS to setAttribute rather than removeAttribute, (3) remove the duplicate "(None)" option from the CMS Stats Display field by setting required: true.

Purpose: User can hide nav items (e.g. Publications, Talks) from the CMS without editing code; light theme reliably shows light colors regardless of OS preference; CMS Stats Display no longer shows a confusing empty option alongside the explicit "none" choice.
Output: Updated site.json, Navigation.astro, themes.css, ThemeSwitcher.astro, BaseLayout.astro anti-flash script, config.yml.
</objective>

<execution_context>
@/Users/pedf/.claude/get-shit-done/workflows/execute-plan.md
@/Users/pedf/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Nav visibility toggles — site.json + Navigation.astro + CMS config</name>
  <files>src/data/site.json, src/components/Navigation.astro, public/admin/config.yml</files>
  <action>
1. In `src/data/site.json`, add a `nav` array under `site`:

```json
"nav": [
  { "href": "/", "label": "Home", "visible": true },
  { "href": "/publications/", "label": "Publications", "visible": true },
  { "href": "/talks/", "label": "Talks", "visible": true },
  { "href": "/posts/", "label": "Blog", "visible": true },
  { "href": "/portfolio/", "label": "Portfolio", "visible": true },
  { "href": "/cv/", "label": "CV", "visible": true }
]
```

2. In `src/components/Navigation.astro`, replace the hardcoded `navItems` array with data from site.json. Import site data and filter on visible:

```astro
---
import siteData from '../data/site.json';
const navItems = siteData.site.nav.filter(item => item.visible !== false);
const currentPath = Astro.url.pathname;
---
```

3. In `public/admin/config.yml`, add a `nav` list field inside the `site` object fields block (after the existing `description` field). Each list item has `label`, `href` (hidden), and `visible` (boolean):

```yaml
- label: "Navigation Items"
  name: "nav"
  widget: "list"
  fields:
    - { label: "Label", name: "label", widget: "string" }
    - { label: "Path", name: "href", widget: "string" }
    - { label: "Visible", name: "visible", widget: "boolean", default: true }
```

This goes inside the `site` object widget's `fields` list, after the `description` entry.
  </action>
  <verify>Run `npm run build` — no TypeScript errors. Verify nav renders correctly: `grep -n "navItems" src/components/Navigation.astro` should show the filter line. `grep -n '"nav"' src/data/site.json` should show the array.</verify>
  <done>Navigation.astro reads nav items from site.json; setting `"visible": false` on any item removes it from rendered nav; CMS "Navigation Items" list lets user toggle visibility.</done>
</task>

<task type="auto">
  <name>Task 2: Fix light theme on dark OS — add [data-theme="light"] CSS + update JS</name>
  <files>src/styles/themes.css, src/styles/global.css, src/components/ThemeSwitcher.astro, src/layouts/BaseLayout.astro</files>
  <action>
**Root cause:** When OS is in dark mode, `@media (prefers-color-scheme: dark) { :root { ... } }` in global.css fires on the bare `:root` (no data-theme attribute), overriding light colors. Selecting "light" calls `removeAttribute('data-theme')`, leaving bare `:root` exposed to the dark media query.

**Fix in `src/styles/global.css`:** Remove the `@media (prefers-color-scheme: dark) { :root { ... } }` block entirely (lines 27-38). The auto theme in themes.css already handles system dark preference via `[data-theme="auto"]`. Bare `:root` should only ever mean "light" — the explicit `[data-theme="light"]` rule we add will reinforce this.

**Fix in `src/styles/themes.css`:** Add a `[data-theme="light"]` rule immediately after the `[data-theme="auto"]` block (around line 18), using the same light values from `:root` in global.css:

```css
/* Light Theme - Explicit light palette, immune to OS dark preference */
[data-theme="light"] {
  --color-bg: #ffffff;
  --color-text: #333333;
  --color-text-muted: #666666;
  --color-link: #0066cc;
  --color-link-hover: #004499;
  --color-border: #e0e0e0;
  --color-header-bg: #f8f9fa;
}
```

Also update the Shiki code block comment at the bottom of themes.css: update the comment "Default (light theme) - use light code colors" selector from `:root .astro-code` to also cover `[data-theme="light"] .astro-code`:

```css
/* Default (light theme) - use light code colors */
:root .astro-code,
[data-theme="light"] .astro-code,
:root .astro-code span,
[data-theme="light"] .astro-code span {
  color: var(--shiki-light) !important;
  background-color: var(--shiki-light-bg) !important;
}
```

**Fix in `src/components/ThemeSwitcher.astro`:** In the `applyTheme` function, change the `light` branch from `removeAttribute` to `setAttribute`:

```typescript
if (theme === 'light') {
  docEl.setAttribute('data-theme', 'light');
} else if (theme === 'auto') {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    docEl.setAttribute('data-theme', 'auto');
  } else {
    docEl.removeAttribute('data-theme');  // light is default for auto+light OS
  }
} else {
  docEl.setAttribute('data-theme', theme);
}
```

**Fix in `src/layouts/BaseLayout.astro`:** Update the inline anti-flash script to set `data-theme="light"` explicitly when stored theme is `'light'`:

```javascript
(function() {
  try {
    var t = localStorage.getItem('site-theme');
    if (t === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (t && t !== 'auto') {
      document.documentElement.setAttribute('data-theme', t);
    } else if (t === 'auto') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'auto');
      }
    }
  } catch (e) {}
})();
```
  </action>
  <verify>Run `npm run build` — no errors. Manually verify (or use browser devtools): with OS dark mode ON, selecting "Light" from theme switcher should show white (#ffffff) background, dark text (#333333). Attribute `data-theme="light"` should appear on `<html>`. Reload should preserve light theme.</verify>
  <done>[data-theme="light"] rule exists in themes.css with explicit light palette; ThemeSwitcher sets data-theme="light" not removeAttribute; anti-flash script handles light explicitly; OS dark mode no longer bleeds into explicit light theme selection.</done>
</task>

<task type="auto">
  <name>Task 3: Fix CMS Stats Display duplicate None option</name>
  <files>public/admin/config.yml</files>
  <action>
In `public/admin/config.yml`, find the `Stats Display` field (around lines 131-137). Change `required: false` to `required: true`. The explicit `"none"` option already covers the "no stats" case, so the CMS will no longer add an additional empty "(None)" option:

```yaml
- label: "Stats Display"
  name: "statsDisplay"
  widget: "select"
  options: ["stars", "downloads", "both", "none"]
  default: "stars"
  required: true
  hint: "Which GitHub stats to display on the portfolio card"
```
  </action>
  <verify>Open CMS at /admin/ and navigate to a portfolio item — Stats Display dropdown should show exactly four options: stars, downloads, both, none. No empty "(None)" entry at the top.</verify>
  <done>CMS Stats Display shows 4 explicit options only; no empty string value can be saved; existing portfolio items with default "stars" unaffected.</done>
</task>

</tasks>

<verification>
- `npm run build` completes without errors
- Navigation reads from site.json nav array; setting visible:false hides item
- Selecting Light theme on a dark-OS browser shows white background (#ffffff)
- CMS Stats Display has exactly 4 options, no blank entry
</verification>

<success_criteria>
- Nav items toggleable via `"visible": false` in site.json (and via CMS boolean)
- Light theme shows light colors on dark OS (data-theme="light" attribute present, [data-theme="light"] CSS rule defined)
- CMS Stats Display field has required:true, no duplicate None option
</success_criteria>

<output>
After completion, create `.planning/quick/1-fix-nav-visibility-toggles-light-theme-b/1-SUMMARY.md`
</output>
