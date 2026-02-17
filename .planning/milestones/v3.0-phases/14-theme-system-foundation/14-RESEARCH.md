# Phase 14: Theme System Foundation - Research

**Researched:** 2026-02-16
**Domain:** CSS theming system with dark mode detection and FOUC prevention
**Confidence:** HIGH

## Summary

This phase implements a multi-theme CSS system for an Astro static site, supporting 8 distinct themes including auto-detection of system preferences. The core challenge is preventing Flash of Unstyled Content (FOUC) while maintaining compatibility with the existing CSS custom properties system.

The existing codebase already uses CSS custom properties for styling and has automatic dark mode via `@media (prefers-color-scheme: dark)`. This phase extends that foundation to support manual theme selection with 8 themes (auto, light, dark, sepia, retro terminal, Minecraft/pixel, Lego/bold, synthwave) while ensuring zero visual flash on page load.

**Primary recommendation:** Use `[data-theme]` attribute selectors on `<html>` with inline blocking script in `<head>` to prevent FOUC. Extend existing CSS custom properties pattern rather than replacing it.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS Custom Properties | Native CSS | Theme variable definitions | Already in use, 100% browser support, zero runtime cost, perfect for static sites |
| localStorage API | Native Web API | Theme preference persistence | Same pattern as existing GitHub API cache, no dependencies |
| Inline blocking script | Native JS | FOUC prevention | Industry standard for theme flash prevention, runs before first paint |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `matchMedia` API | Native Web API | Detect system color scheme preference | For auto mode to respect `prefers-color-scheme` |
| `data-*` attributes | HTML5 Standard | Theme state management | Clean separation of concerns, single source of truth |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Custom Properties | Tailwind CSS theme classes | Requires rebuild to change themes, adds 50KB+ to bundle, overkill for 8 themes |
| Inline blocking script | React useEffect theme detection | Causes FOUC (runs after hydration), requires framework dependency |
| localStorage | Cookies | More complex (parsing, size limits), no advantage for client-only storage |
| `data-theme` attribute | CSS classes (`.theme-dark`) | Same functionality but less semantic, harder to query |

**Installation:**

No npm packages required. Uses native Web APIs and CSS features.

## Architecture Patterns

### Recommended Project Structure

```
src/
├── styles/
│   ├── global.css          # EXISTING: Base styles, spacing, typography
│   ├── themes.css          # NEW: Theme-specific color overrides
│   └── theme-config.css    # NEW: Theme metadata for UI (optional)
├── scripts/
│   └── theme.ts            # NEW: Theme switcher logic
├── components/
│   └── ThemeSwitcher.astro # NEW: Theme selector UI component
└── layouts/
    └── BaseLayout.astro    # MODIFIED: Add inline script and ThemeSwitcher
```

### Pattern 1: Data Attribute Theme System

**What:** Set theme by applying `data-theme` attribute to `<html>` element, override CSS custom properties via attribute selectors

**When to use:** When you need runtime theme switching without page reload

**Example:**

```html
<!-- HTML structure -->
<html lang="en" data-theme="dark">
  <!-- Theme applies to entire page -->
</html>
```

```css
/* CSS - themes.css */
/* Base/light theme (default) */
:root {
  --color-bg: #ffffff;
  --color-text: #333333;
  --color-link: #0066cc;
}

/* Dark theme override */
[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #e0e0e0;
  --color-link: #6699ff;
}

/* Sepia theme override */
[data-theme="sepia"] {
  --color-bg: #f4ecd8;
  --color-text: #5c4a2e;
  --color-link: #8b4513;
}

/* Auto mode respects system preference */
@media (prefers-color-scheme: dark) {
  [data-theme="auto"] {
    --color-bg: #1a1a1a;
    --color-text: #e0e0e0;
    --color-link: #6699ff;
  }
}
```

**Why this works:**
- Single attribute change updates entire site instantly
- CSS custom properties cascade to all components automatically
- No class juggling on individual elements
- Media queries work for auto mode

### Pattern 2: Inline Blocking Script for FOUC Prevention

**What:** Execute theme detection and application synchronously in `<head>` before any rendering

**When to use:** Always, for any theme system with user preferences

**Example:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <!-- CRITICAL: Inline script runs before any rendering -->
    <script is:inline>
      (function() {
        try {
          // Read from localStorage
          const savedTheme = localStorage.getItem('site-theme');

          // Apply immediately if not auto/light
          if (savedTheme && savedTheme !== 'auto' && savedTheme !== 'light') {
            document.documentElement.setAttribute('data-theme', savedTheme);
          }

          // For auto mode, check system preference
          if (savedTheme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
              document.documentElement.setAttribute('data-theme', 'auto');
            }
          }
        } catch (e) {
          // Fail silently - localStorage may be disabled
        }
      })();
    </script>

    <!-- Styles load after theme is set -->
    <link rel="stylesheet" href="/styles/global.css" />
  </head>
  <body>
    <!-- Content renders with correct theme already applied -->
  </body>
</html>
```

**Source:** Based on industry standard pattern documented in [Fixing Dark Mode Flickering (FOUC) in React and Next.js](https://notanumber.in/blog/fixing-react-dark-mode-flickering) and [What the FOUC? Dark mode with Astro transitions and Tailwind](https://www.simonporter.co.uk/posts/what-the-fouc-astro-transitions-and-tailwind/)

**Why this works:**
- `is:inline` Astro directive ensures code is not bundled/deferred
- Executes synchronously before browser paints anything
- Wrapped in IIFE to avoid global scope pollution
- Try/catch handles localStorage disabled in private browsing

### Pattern 3: Theme Switcher Component

**What:** UI component that reads current theme, allows user to change theme, persists to localStorage

**When to use:** In header/footer where theme selection is accessible on all pages

**Example:**

```astro
---
// ThemeSwitcher.astro
const themes = [
  { value: 'auto', label: 'Auto', icon: '🔄' },
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'sepia', label: 'Sepia', icon: '📜' },
  { value: 'terminal', label: 'Terminal', icon: '💻' },
  { value: 'minecraft', label: 'Minecraft', icon: '🟩' },
  { value: 'lego', label: 'Lego', icon: '🧱' },
  { value: 'synthwave', label: 'Synthwave', icon: '🌆' },
];
---

<div class="theme-switcher">
  <label for="theme-select" class="sr-only">Select theme</label>
  <select id="theme-select" class="theme-select">
    {themes.map(theme => (
      <option value={theme.value}>
        {theme.icon} {theme.label}
      </option>
    ))}
  </select>
</div>

<script>
  const STORAGE_KEY = 'site-theme';
  const select = document.getElementById('theme-select') as HTMLSelectElement;

  // Initialize: Read current theme
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY) || 'auto';
    if (select) {
      select.value = savedTheme;
    }
  }

  // Apply theme to DOM
  function applyTheme(theme: string) {
    if (theme === 'auto' || theme === 'light') {
      // Remove attribute to use :root defaults and @media query
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  // Handle theme change
  function handleThemeChange(event: Event) {
    const theme = (event.target as HTMLSelectElement).value;

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Could not save theme preference');
    }

    // Apply immediately
    applyTheme(theme);
  }

  // Set up on page load
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    select?.addEventListener('change', handleThemeChange);
  });
</script>

<style>
  .theme-switcher {
    display: inline-block;
  }

  .theme-select {
    padding: 0.5rem 0.75rem;
    background: var(--color-header-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  .theme-select:hover {
    border-color: var(--color-link);
  }

  .theme-select:focus {
    outline: 2px solid var(--color-link);
    outline-offset: 2px;
  }
</style>
```

**Source:** Pattern adapted from [How to Add a Dark Theme in Astro with Tailwind](https://tarasov.dev/blog/how-to-add-dark-theme-in-astro/) and [astro-color-scheme](https://github.com/surjithctly/astro-color-scheme)

### Pattern 4: Extending Existing CSS Custom Properties

**What:** Add new theme overrides without breaking existing `:root` definitions

**When to use:** When site already uses CSS custom properties (like this project)

**Example:**

```css
/* EXISTING: global.css - DO NOT MODIFY */
:root {
  /* Colors - Clean academic palette */
  --color-bg: #ffffff;
  --color-text: #333333;
  --color-text-muted: #666666;
  --color-link: #0066cc;
  --color-link-hover: #004499;
  --color-border: #e0e0e0;
  --color-header-bg: #f8f9fa;

  /* Typography, spacing, layout - unchanged */
  --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  /* ... */
}

/* EXISTING: Automatic dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #e0e0e0;
    --color-text-muted: #a0a0a0;
    --color-link: #6699ff;
    --color-link-hover: #99bbff;
    --color-border: #404040;
    --color-header-bg: #252525;
  }
}
```

```css
/* NEW: themes.css - Import AFTER global.css */

/* Auto mode: Respects media query (no attribute or data-theme="auto") */
/* Already handled by existing @media query in global.css */

/* Dark theme: Explicit dark (overrides light mode system preference) */
[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #e0e0e0;
  --color-text-muted: #a0a0a0;
  --color-link: #6699ff;
  --color-link-hover: #99bbff;
  --color-border: #404040;
  --color-header-bg: #252525;
}

/* Sepia theme: Warm tones for long reading */
[data-theme="sepia"] {
  --color-bg: #f4ecd8;
  --color-text: #5c4a2e;
  --color-text-muted: #8b7355;
  --color-link: #8b4513;
  --color-link-hover: #654321;
  --color-border: #d4c4a8;
  --color-header-bg: #eae0cc;
}

/* Retro Terminal theme: Green phosphor CRT */
[data-theme="terminal"] {
  --color-bg: #0a0a0a;
  --color-text: #33ff66;
  --color-text-muted: #22cc44;
  --color-link: #00ff00;
  --color-link-hover: #66ff66;
  --color-border: #1a3a1a;
  --color-header-bg: #111111;
}

/* Minecraft/Pixel theme: Blocky, bright colors */
[data-theme="minecraft"] {
  --color-bg: #3c8527;
  --color-text: #f5f5dc;
  --color-text-muted: #d4d4a8;
  --color-link: #a5d152;
  --color-link-hover: #c0e070;
  --color-border: #7b5734;
  --color-header-bg: #2d6a1f;
}

/* Lego theme: Bold primary colors */
[data-theme="lego"] {
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-text-muted: #555555;
  --color-link: #d11013;
  --color-link-hover: #a00d10;
  --color-border: #f6ec35;
  --color-header-bg: #f6ec35;
}

/* Synthwave theme: Cyberpunk neon */
[data-theme="synthwave"] {
  --color-bg: #0f0a1f;
  --color-text: #ffd319;
  --color-text-muted: #ff901f;
  --color-link: #ff2975;
  --color-link-hover: #f222ff;
  --color-border: #8c1eff;
  --color-header-bg: #1a0f2e;
}
```

**Integration in BaseLayout.astro:**

```astro
---
import '../styles/global.css';
import '../styles/themes.css'; // NEW: Add after global.css
---
```

**Why this works:**
- Preserves existing `:root` as default/light theme
- Existing `@media (prefers-color-scheme: dark)` works for auto mode
- New themes only override color variables, not spacing/typography
- Higher specificity ([data-theme]) wins over :root
- All existing components automatically support new themes (they use custom properties)

### Anti-Patterns to Avoid

- **Anti-pattern: Loading theme script with defer/async**
  - Causes FOUC because script runs after rendering starts
  - Always use inline synchronous script in `<head>`

- **Anti-pattern: Toggling classes on body/components**
  - Requires DOM traversal to update every element
  - Slow performance, complex code
  - Use single `data-theme` attribute instead

- **Anti-pattern: Separate CSS files per theme**
  - Requires page reload to switch themes
  - Multiple HTTP requests
  - Use single CSS file with attribute selectors

- **Anti-pattern: Checking localStorage in component scripts**
  - Runs after page renders, causes FOUC
  - Theme detection must happen in blocking inline script

- **Anti-pattern: Removing existing @media query**
  - Breaks auto mode
  - Keep media query for auto theme, add data-theme for manual overrides

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme storage | Custom storage API with compression | localStorage directly | localStorage quota (5-10MB) is sufficient for theme string. Over-engineering adds complexity. |
| Theme detection | Complex browser/OS detection | `window.matchMedia('(prefers-color-scheme: dark)')` | Native API, always accurate, handles system changes |
| Color contrast validation | Custom contrast checker | Browser DevTools or existing contrast tools | Not needed at runtime. Validate during design phase. |
| Theme animation | Custom CSS transitions | CSS transition on custom properties | Native browser optimization, smooth theme changes |

**Key insight:** Theme switching is a solved problem with native Web APIs. No libraries needed for this use case.

## Common Pitfalls

### Pitfall 1: Theme Media Query Conflict

**What goes wrong:** Existing `@media (prefers-color-scheme: dark)` overrides manual theme selection. User selects light theme, but system dark mode preference forces dark colors.

**Why it happens:** CSS specificity. Media query in existing global.css applies to `:root`, but new themes use `[data-theme]`. Both have same specificity, source order matters.

**How to avoid:**
1. Keep media query for auto mode only
2. Manual theme selection removes `data-theme` attribute for light
3. Manual dark theme adds `data-theme="dark"` which overrides media query
4. Test: Enable system dark mode → select light theme → verify light colors show

**Warning signs:**
- Theme switcher appears to do nothing
- Theme reverts on page reload
- Different theme shows on different pages

**Source:** Documented in [Fixing Dark Mode Flickering](https://notanumber.in/blog/fixing-react-dark-mode-flickering) - specificity section

### Pitfall 2: FOUC (Flash of Unstyled Content)

**What goes wrong:** Page loads with default theme, flashes, then switches to saved theme. Jarring visual experience.

**Why it happens:** Theme detection runs after page renders. Any async/defer script, or script at end of `<body>`, or script in component causes this.

**How to avoid:**
1. Inline script in `<head>` with `is:inline` directive
2. Read localStorage synchronously
3. Apply theme before any `<link rel="stylesheet">`
4. Never use `DOMContentLoaded` for initial theme application

**Warning signs:**
- Visible flash when loading pages
- Theme "pops in" after brief delay
- DevTools Performance shows layout shift

**Source:** [What the FOUC? Dark mode with Astro transitions and Tailwind](https://www.simonporter.co.uk/posts/what-the-fouc-astro-transitions-and-tailwind/)

### Pitfall 3: localStorage Unavailable in Private Browsing

**What goes wrong:** `localStorage.getItem()` throws error in private browsing mode. Theme switcher breaks completely.

**Why it happens:** Private browsing disables localStorage. Code assumes it's always available.

**How to avoid:**
```javascript
try {
  const theme = localStorage.getItem('site-theme');
  // ... use theme
} catch (e) {
  // Fall back to auto mode
  const theme = 'auto';
}
```

**Warning signs:**
- Console errors: "localStorage is not defined"
- Theme switcher non-functional in incognito mode
- User reports of broken theme selection

### Pitfall 4: Missing Theme in Switcher After Auto

**What goes wrong:** User selects auto mode. Page reload doesn't show "Auto" selected in dropdown.

**Why it happens:** Auto mode removes `data-theme` attribute (to let media query work). Theme switcher reads attribute, finds nothing, defaults to first option.

**How to avoid:**
- Always read from localStorage, not from DOM attribute
- Initialize dropdown value from `localStorage.getItem('site-theme')`
- Don't rely on current DOM state to determine selected theme

**Warning signs:**
- Dropdown shows wrong selection after reload
- Auto mode not indicated in UI

### Pitfall 5: Theme Not Applied to Dynamic Content

**What goes wrong:** Main page uses themed colors, but modal/popup/dynamic content ignores theme.

**Why it happens:** New DOM elements inserted after page load don't inherit custom properties if they're not in cascade.

**How to avoid:**
- Always use `var(--color-*)` in component styles, never hardcoded colors
- Ensure all components are children of `<html>` (custom properties cascade)
- Never use inline styles with hardcoded colors

**Warning signs:**
- Modal backgrounds are white in dark theme
- Popup text is black on dark background
- Dynamic content has different colors than page

## Code Examples

Verified patterns from research and codebase analysis:

### Inline Theme Detection Script

```html
<!-- Place in <head> before any stylesheets -->
<script is:inline>
  (function() {
    const STORAGE_KEY = 'site-theme';

    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);

      // Apply theme if it's not auto or light (default)
      if (savedTheme && savedTheme !== 'auto' && savedTheme !== 'light') {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else if (savedTheme === 'auto') {
        // For auto mode, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          // Set data-theme so media query within [data-theme="auto"] works
          document.documentElement.setAttribute('data-theme', 'auto');
        }
      }
    } catch (e) {
      // localStorage disabled - fail silently, use defaults
    }
  })();
</script>
```

**Source:** Pattern from [astro-color-scheme](https://github.com/surjithctly/astro-color-scheme) adapted for multiple themes

### Theme Switcher Event Handler

```typescript
// src/scripts/theme.ts
export type Theme = 'auto' | 'light' | 'dark' | 'sepia' | 'terminal' | 'minecraft' | 'lego' | 'synthwave';

const STORAGE_KEY = 'site-theme';
const DEFAULT_THEME: Theme = 'auto';

export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Theme) || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme: Theme): void {
  if (theme === 'auto' || theme === 'light') {
    // Remove attribute: use :root defaults and @media query
    document.documentElement.removeAttribute('data-theme');
  } else {
    // Set specific theme
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (err) {
    console.warn('[Theme] Could not save preference:', err);
  }
}

export function initThemeSwitcher(): void {
  const select = document.getElementById('theme-select') as HTMLSelectElement;
  if (!select) return;

  // Set initial value
  const currentTheme = getStoredTheme();
  select.value = currentTheme;

  // Handle changes
  select.addEventListener('change', (e) => {
    const theme = (e.target as HTMLSelectElement).value as Theme;
    applyTheme(theme);
    saveTheme(theme);
  });
}
```

### Complete BaseLayout Integration

```astro
---
// src/layouts/BaseLayout.astro
import SkipLink from '../components/SkipLink.astro';
import Navigation from '../components/Navigation.astro';
import ThemeSwitcher from '../components/ThemeSwitcher.astro';
import Footer from '../components/Footer.astro';
import AuthorSidebar from '../components/AuthorSidebar.astro';
import siteData from '../data/site.json';
import '../styles/global.css';
import '../styles/themes.css'; // NEW

interface Props {
  title?: string;
  description?: string;
  showSidebar?: boolean;
}

const {
  title = siteData.site.title,
  description = siteData.site.description,
  showSidebar = true
} = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />

    <!-- CRITICAL: Theme detection before any rendering -->
    <script is:inline>
      (function() {
        try {
          const savedTheme = localStorage.getItem('site-theme');
          if (savedTheme && savedTheme !== 'auto' && savedTheme !== 'light') {
            document.documentElement.setAttribute('data-theme', savedTheme);
          } else if (savedTheme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
              document.documentElement.setAttribute('data-theme', 'auto');
            }
          }
        } catch (e) {}
      })();
    </script>

    <link rel="icon" type="image/png" href="/images/favicon.ico" />
    <link
      rel="alternate"
      type="application/rss+xml"
      title={`${siteData.site.title} - Blog`}
      href={new URL('rss.xml', Astro.site)}
    />
    <title>{title}</title>
  </head>
  <body>
    <SkipLink />
    <header class="site-header">
      <div class="header-content">
        <a href="/" class="site-title">{siteData.site.title}</a>
        <ThemeSwitcher /> <!-- NEW: Theme selector UI -->
      </div>
    </header>
    <Navigation />
    <div class="content-wrapper">
      {showSidebar && <AuthorSidebar />}
      <main id="main-content">
        <slot />
      </main>
    </div>
    <Footer />
  </body>
</html>

<script>
  import { initThemeSwitcher } from '../scripts/theme';

  // Initialize theme switcher after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
  });
</script>

<style>
  /* Existing styles unchanged */
  .site-header {
    background: var(--color-header-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .header-content {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: var(--space-sm);
    display: flex; /* NEW: Flexbox for title + switcher */
    justify-content: space-between; /* NEW */
    align-items: center; /* NEW */
  }

  .site-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text);
    text-decoration: none;
  }

  .site-title:hover {
    color: var(--color-link);
  }

  /* ... rest of existing styles ... */
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JavaScript theme libraries (theme-ui, styled-components) | Native CSS custom properties with data attributes | 2020-2021 | Eliminates dependencies, improves performance, works with any framework |
| Class-based theming (`.dark`, `.light`) | Attribute-based theming (`[data-theme]`) | 2021-2022 | More semantic, easier to query, cleaner CSS selectors |
| Flash prevention with hidden content | Inline blocking scripts | Ongoing | Better UX, no content hiding, faster perceived load time |
| Cookies for theme storage | localStorage | 2018-2019 | Simpler API, no server round-trip, more storage space |
| JavaScript-driven theme application | CSS-driven with JS for persistence only | 2020-2022 | Better separation of concerns, works without JS for initial render |

**Deprecated/outdated:**
- **next-themes (React-specific):** Not applicable to Astro static sites
- **prefers-color-scheme as only method:** Users want manual control, not just system detection
- **Multiple CSS file loading:** Single file with attribute selectors is now standard

**Source:** Timeline based on web development trends documented in [CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/) and [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## Theme Specifications

### 8 Required Themes

Based on requirements and web research, here are the specific color palettes for each theme:

#### 1. Auto Theme
- **Behavior:** Respects system `prefers-color-scheme` preference
- **Implementation:** No `data-theme` attribute OR `data-theme="auto"` with media query
- **Colors:** Uses `:root` default (light) or `@media (prefers-color-scheme: dark)` override

#### 2. Light Theme
- **Purpose:** High contrast reading in bright environments
- **Colors:** (Already defined in global.css :root)
  - Background: `#ffffff`
  - Text: `#333333`
  - Link: `#0066cc`
  - Border: `#e0e0e0`

#### 3. Dark Theme
- **Purpose:** Low-light environments, reduces eye strain
- **Colors:** (Already defined in global.css @media)
  - Background: `#1a1a1a`
  - Text: `#e0e0e0`
  - Link: `#6699ff`
  - Border: `#404040`

#### 4. Sepia Theme
- **Purpose:** Warm tones for long reading sessions, reduced blue light
- **Colors:**
  - Background: `#f4ecd8` (beige)
  - Text: `#5c4a2e` (dark brown)
  - Text muted: `#8b7355` (medium brown)
  - Link: `#8b4513` (saddle brown)
  - Link hover: `#654321` (dark brown)
  - Border: `#d4c4a8` (tan)
  - Header: `#eae0cc` (light beige)

#### 5. Retro Terminal Theme
- **Purpose:** Nostalgia, developer aesthetic, green phosphor CRT monitor
- **Colors:**
  - Background: `#0a0a0a` (near black)
  - Text: `#33ff66` (phosphor green)
  - Text muted: `#22cc44` (darker green)
  - Link: `#00ff00` (bright green)
  - Link hover: `#66ff66` (light green)
  - Border: `#1a3a1a` (dark green)
  - Header: `#111111` (very dark gray)
- **Additional styling:** Consider adding `font-family: var(--font-mono)` and subtle text-shadow for glow effect
- **Source:** Colors based on [Old Timey Terminal Styling](https://css-tricks.com/old-timey-terminal-styling/) and phosphor CRT research

#### 6. Minecraft/Pixel Theme
- **Purpose:** Fun, playful, gaming aesthetic with blocky colors
- **Colors:**
  - Background: `#3c8527` (grass green)
  - Text: `#f5f5dc` (beige/cream)
  - Text muted: `#d4d4a8` (tan)
  - Link: `#a5d152` (lime green)
  - Link hover: `#c0e070` (lighter lime)
  - Border: `#7b5734` (dirt brown)
  - Header: `#2d6a1f` (darker green)
- **Additional styling:** Consider using `font-family: 'Press Start 2P', monospace` (requires loading Google Font)
- **Source:** Colors from [Minecraft.css framework](https://www.cssscript.com/minecraft-web-design-framework/) and Minecraft color palettes

#### 7. Lego/Bold Theme
- **Purpose:** Bright, primary colors, high energy, bold aesthetic
- **Colors:**
  - Background: `#ffffff` (white)
  - Text: `#000000` (black)
  - Text muted: `#555555` (dark gray)
  - Link: `#d11013` (LEGO red)
  - Link hover: `#a00d10` (darker red)
  - Border: `#f6ec35` (LEGO yellow)
  - Header: `#f6ec35` (LEGO yellow)
- **Additional styling:** Bold, high contrast, consider thicker borders
- **Source:** Colors from [LEGO Brand Colors](https://brandpalettes.com/lego-color-codes/)

#### 8. Synthwave Theme
- **Purpose:** Cyberpunk/retro-futuristic aesthetic with neon colors
- **Colors:**
  - Background: `#0f0a1f` (deep purple-black)
  - Text: `#ffd319` (neon yellow)
  - Text muted: `#ff901f` (neon orange)
  - Link: `#ff2975` (hot pink)
  - Link hover: `#f222ff` (magenta)
  - Border: `#8c1eff` (purple)
  - Header: `#1a0f2e` (dark purple)
- **Additional styling:** Consider subtle neon glow effects with box-shadow
- **Source:** Colors from [Synthwave Sunset palette](https://www.color-hex.com/color-palette/57266) and [Cyberpunk color research](https://colormagic.app/palette/explore/cyberpunk)

### Accessibility Considerations

All themes must pass WCAG 2.1 AA contrast requirements:
- **Normal text:** 4.5:1 contrast ratio minimum
- **Large text (18pt+):** 3:1 contrast ratio minimum
- **Links:** Must be distinguishable from body text

**Testing required for:**
- Sepia theme (lower contrast by nature)
- Minecraft theme (green background with light text)
- Synthwave theme (neon colors on dark background)

**Tools for validation:**
- Chrome DevTools Lighthouse accessibility audit
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- axe DevTools browser extension

## Open Questions

1. **Should theme switcher be dropdown or button group?**
   - What we know: Dropdown scales better for 8 options, button group better for 2-3
   - What's unclear: User preference for this site's aesthetic
   - Recommendation: Start with dropdown (more compact), can add button group later if needed

2. **Should special themes (terminal, minecraft, lego, synthwave) include font changes?**
   - What we know: Terminal and Minecraft benefit from monospace/pixel fonts
   - What's unclear: Whether font loading impacts performance significantly
   - Recommendation: Start with color-only themes, add fonts in Phase 2 if requested

3. **Should theme persist across devices?**
   - What we know: localStorage is device-specific
   - What's unclear: Whether users expect theme to sync
   - Recommendation: Document that theme is device-specific, consider cloud sync in future

4. **Should Astro View Transitions preserve theme?**
   - What we know: This site doesn't currently use Astro View Transitions
   - What's unclear: Whether they'll be added in future phases
   - Recommendation: If View Transitions added, ensure inline script runs on every navigation

## Sources

### Primary (HIGH confidence)

**Codebase Analysis:**
- `/Users/pedf/workspace/bacilo.github.io/src/styles/global.css` - Existing CSS custom properties system
- `/Users/pedf/workspace/bacilo.github.io/src/layouts/BaseLayout.astro` - Current layout structure
- `/Users/pedf/workspace/bacilo.github.io/astro.config.mjs` - Static site configuration

**Official Documentation:**
- [Using CSS custom properties (variables) - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Custom Properties Guide | CSS-Tricks](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Astro Documentation - Build a blog tutorial](https://docs.astro.build/en/tutorial/6-islands/2/)

### Secondary (MEDIUM-HIGH confidence)

**Theme Implementation Patterns:**
- [How to Add a Dark Theme in Astro with Tailwind](https://tarasov.dev/blog/how-to-add-dark-theme-in-astro/)
- [astro-themes: Easy dark mode for Astro websites](https://github.com/alex-grover/astro-themes)
- [astro-color-scheme: Headless dark mode theme toggle](https://github.com/surjithctly/astro-color-scheme)
- [How to handle dark mode | Astro Tips](https://astro-tips.dev/recipes/dark-mode/)

**FOUC Prevention:**
- [Fixing Dark Mode Flickering (FOUC) in React and Next.js](https://notanumber.in/blog/fixing-react-dark-mode-flickering)
- [What the FOUC? Dark mode with Astro transitions and Tailwind](https://www.simonporter.co.uk/posts/what-the-fouc-astro-transitions-and-tailwind/)
- [Preventing Flash of Unstyled Content in Next.js](https://kulembetov.medium.com/preventing-flash-of-unstyled-content-fouc-in-next-js-applications-61b9a878f0f7)

**Theme Color Palettes:**
- [Old Timey Terminal Styling | CSS-Tricks](https://css-tricks.com/old-timey-terminal-styling/) - Terminal theme
- [Minecraft.css Framework](https://www.cssscript.com/minecraft-web-design-framework/) - Minecraft/pixel theme
- [LEGO Brand Colors](https://brandpalettes.com/lego-color-codes/) - Lego theme
- [Cyberpunk Color Palettes](https://colormagic.app/palette/explore/cyberpunk) - Synthwave theme
- [Synthwave Sunset Palette](https://www.color-hex.com/color-palette/57266) - Synthwave theme

**CSS Best Practices:**
- [CSS Custom Properties and Theming | CSS-Tricks](https://css-tricks.com/css-custom-properties-theming/)
- [How to create better themes with CSS variables - LogRocket](https://blog.logrocket.com/create-better-themes-with-css-variables/)
- [A Strategy Guide To CSS Custom Properties — Smashing Magazine](https://www.smashingmagazine.com/2018/05/css-custom-properties-strategy-guide/)

### Tertiary (LOW confidence - needs validation)

- Font recommendations for themed experiences (requires testing with real content)
- Exact contrast ratios for all theme combinations (requires manual testing)
- Performance impact of 8 themes in single CSS file (requires benchmarking)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native APIs, existing patterns in codebase
- Architecture patterns: HIGH - Verified through multiple sources, existing implementation
- Theme colors: MEDIUM-HIGH - Based on research but requires contrast validation
- FOUC prevention: HIGH - Well-documented pattern, proven technique
- Integration approach: HIGH - Extends existing CSS custom properties system

**Research date:** 2026-02-16
**Valid until:** 60 days (stable CSS features, no major API changes expected)

**Key validation points for planner:**
1. Test all 8 themes for WCAG AA contrast compliance
2. Verify inline script prevents FOUC in all browsers
3. Confirm auto mode respects system preference changes
4. Ensure existing components work with all themes without modification
5. Test localStorage failure handling in private browsing mode

**Implementation complexity:** LOW to MEDIUM
- Core theme system: LOW (extend existing patterns)
- FOUC prevention: MEDIUM (requires careful inline script placement)
- Theme UI component: LOW (standard Astro component)
- Color palette definition: LOW (CSS custom property overrides)

**Estimated implementation time:** 6-8 hours
- CSS theme definitions: 2 hours
- Inline script + FOUC prevention: 2 hours
- ThemeSwitcher component: 2 hours
- Testing all themes + accessibility: 2-4 hours
