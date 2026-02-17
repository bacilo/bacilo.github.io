# Architecture Integration Patterns

**Project:** Academic Website Feature Extensions
**Domain:** Astro 5.x static site with content collections
**Researched:** 2026-02-16
**Overall confidence:** HIGH

## Executive Summary

This architecture document analyzes how four new feature sets integrate with the existing Astro 5.x academic website: (1) Teaching section with content collections, (2) Portfolio code embeds with syntax highlighting, (3) Configurable portfolio stats, and (4) Multi-theme CSS system. All features leverage existing architectural patterns (content collections, Astro components, CSS custom properties, client-side scripts) with minimal structural changes.

The existing architecture is well-suited for these extensions:
- **Content collections** already demonstrated with 5 collections (publications, talks, posts, portfolio, pages)
- **Component composition** pattern established in portfolio cards (GitHubCard, DemoEmbed, PlaygroundEmbed)
- **CSS custom properties** system in place with dark mode via media query
- **CMS sync pattern** documented with comments linking config.yml to content.config.ts

Key architectural insight: All new features can be implemented as **additions** rather than **modifications**, preserving existing functionality while extending capabilities.

## Recommended Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ASTRO 5.x STATIC SITE                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Content Layer (src/content/ + content.config.ts)     │   │
│  │  • Existing: blog, publications, talks, portfolio    │   │
│  │  • NEW: teaching collection                          │   │
│  │  • Glob loader pattern (Astro 5.x)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Page Layer (src/pages/)                              │   │
│  │  • Dynamic routes: [...slug].astro                   │   │
│  │  • Index pages: index.astro                          │   │
│  │  • NEW: teaching/index.astro, teaching/[slug].astro  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Component Layer (src/components/)                    │   │
│  │  • Layout: BaseLayout.astro                          │   │
│  │  • Portfolio: GitHubCard, DemoEmbed, PlaygroundEmbed │   │
│  │  • NEW: CodeEmbed (syntax highlighting)             │   │
│  │  • MODIFIED: GitHubCard (configurable stats)        │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Style Layer (src/styles/global.css)                  │   │
│  │  • CSS custom properties (:root)                     │   │
│  │  • Dark mode (@media prefers-color-scheme)          │   │
│  │  • NEW: [data-theme] attribute selectors            │   │
│  │  • NEW: Theme-specific custom property overrides    │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Script Layer (src/scripts/)                          │   │
│  │  • github-api.ts (client-side fetch + localStorage) │   │
│  │  • NEW: theme-switcher.ts (theme persistence)       │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ CMS Layer (public/admin/config.yml)                  │   │
│  │  • Mirrors content.config.ts schemas                 │   │
│  │  • NEW: teaching collection config                   │   │
│  │  • NEW: portfolio statsDisplay field                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With | Type |
|-----------|---------------|-------------------|------|
| **BaseLayout.astro** | Site structure, HTML shell, global styles | All pages via slot | EXISTING |
| **GitHubCard.astro** | Display GitHub repo with API data, configurable stats | github-api.ts script | MODIFIED |
| **CodeEmbed.astro** | Syntax-highlighted code blocks with copy button | Shiki (build-time), clipboard API (runtime) | NEW |
| **DemoEmbed.astro** | Iframe embeds for demos | None (standalone) | EXISTING |
| **PlaygroundEmbed.astro** | Iframe embeds for interactive playgrounds | None (standalone) | EXISTING |
| **ThemeSwitcher.astro** | Theme selection UI component | theme-switcher.ts script | NEW |
| **teaching/index.astro** | Teaching collection listing page | teaching content collection | NEW |
| **teaching/[slug].astro** | Individual teaching entry page | teaching content collection | NEW |

### Data Flow

#### 1. Teaching Section Data Flow
```
Content Author (CMS)
  ↓
teaching/*.md files created
  ↓
content.config.ts validates via Zod schema
  ↓
getCollection('teaching') in pages
  ↓
Rendered in teaching/index.astro and teaching/[slug].astro
  ↓
Static HTML output
```

#### 2. Code Embed Data Flow (Build-time)
```
Portfolio markdown content with code fences
  ↓
Astro processes markdown
  ↓
CodeEmbed component receives code prop
  ↓
Shiki transforms code at build time
  ↓
Syntax-highlighted HTML generated
  ↓
Client-side script adds copy button interactivity
  ↓
Static HTML + minimal JS for copy function
```

#### 3. Configurable Stats Data Flow (Runtime)
```
Portfolio content with statsDisplay field
  ↓
GitHubCard receives statsDisplay prop
  ↓
Client-side script checks statsDisplay value
  ↓
Conditional rendering of stats elements
  ↓
GitHub API fetch (existing pattern)
  ↓
Display stars, downloads, or both based on config
```

#### 4. Theme Switching Data Flow
```
User selects theme from ThemeSwitcher UI
  ↓
theme-switcher.ts script sets [data-theme] on <html>
  ↓
CSS custom properties recalculated via [data-theme] selectors
  ↓
Theme preference saved to localStorage
  ↓
On page load, theme restored from localStorage
```

## Integration Points

### 1. Teaching Section Integration

**What it integrates with:**
- Content collections system (content.config.ts)
- CMS configuration (public/admin/config.yml)
- Navigation component (add teaching link)
- BaseLayout (uses existing layout pattern)
- CV page (conditional display via site.json)

**Files to create:**
- `src/content.config.ts` — Add teaching collection definition (MODIFY)
- `src/content/teaching/*.md` — Teaching entries (CREATE)
- `src/pages/teaching/index.astro` — Teaching listing page (CREATE)
- `src/pages/teaching/[...slug].astro` — Individual teaching page (CREATE)
- `public/admin/config.yml` — Add teaching CMS config (MODIFY)

**Files to modify:**
- `src/components/Navigation.astro` — Add teaching link (MODIFY)

**Pattern to follow:**
Same pattern as publications and talks collections. Teaching collection should have:
```typescript
// content.config.ts
const teaching = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/teaching" }),
  schema: z.object({
    title: z.string(),
    collection: z.literal('teaching'),
    course: z.string(),
    institution: z.string(),
    semester: z.string(),
    year: z.number(),
    level: z.enum(['undergraduate', 'graduate', 'professional']),
    description: optionalStr,
    syllabus: optionalUrl,
    permalink: z.string(),
  })
});
```

**Confidence:** HIGH — Existing collections demonstrate exact pattern to follow.

---

### 2. Portfolio Code Embeds Integration

**What it integrates with:**
- Portfolio content collection (markdown body content)
- Component composition (similar to DemoEmbed/PlaygroundEmbed)
- Shiki syntax highlighter (Astro built-in, needs configuration)
- CSS custom properties (for theme-aware highlighting)

**Files to create:**
- `src/components/portfolio/CodeEmbed.astro` — Syntax-highlighted code component (CREATE)

**Files to modify:**
- `astro.config.mjs` — Configure Shiki (MODIFY)
- `src/pages/portfolio/[...slug].astro` — Use CodeEmbed in content (MODIFY)
- Portfolio markdown files — Add code fence syntax or CodeEmbed component (MODIFY)

**Implementation approaches:**

**Option A: Markdown code fences (recommended)**
```markdown
---
title: My Project
---

Here's how to use it:

```typescript
// Automatically highlighted by Shiki
const example = "code";
```
```

Astro 5.x has built-in Shiki support for markdown code fences. Configure in astro.config.mjs:

```javascript
// astro.config.mjs
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: true,
      langs: ['typescript', 'javascript', 'python', 'bash', 'json', 'markdown']
    }
  }
});
```

**Option B: Custom CodeEmbed component**
For more control (copy buttons, line highlighting, diffs):

```astro
---
// CodeEmbed.astro
import { codeToHtml } from 'shiki';

interface Props {
  code: string;
  lang: string;
  title?: string;
  showLineNumbers?: boolean;
}

const { code, lang, title, showLineNumbers = true } = Astro.props;

// Build-time syntax highlighting
const html = await codeToHtml(code, {
  lang,
  theme: 'github-light',
  themes: {
    light: 'github-light',
    dark: 'github-dark'
  }
});
---

<div class="code-embed">
  {title && <div class="code-title">{title}</div>}
  <div class="code-container">
    <Fragment set:html={html} />
    <button class="copy-button" data-code={code}>Copy</button>
  </div>
</div>

<script>
  // Copy to clipboard functionality
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', async (e) => {
      const code = e.target.dataset.code;
      await navigator.clipboard.writeText(code);
      button.textContent = 'Copied!';
      setTimeout(() => { button.textContent = 'Copy'; }, 2000);
    });
  });
</script>
```

**Recommendation:** Start with Option A (markdown code fences with Shiki config) for simplicity. Add Option B (custom component) later if advanced features needed.

**Confidence:** MEDIUM-HIGH
- Shiki integration: HIGH (Astro built-in, well-documented)
- Custom component pattern: HIGH (follows existing DemoEmbed pattern)
- Theme-aware highlighting: MEDIUM (requires CSS integration with theme system)

---

### 3. Configurable Portfolio Stats Integration

**What it integrates with:**
- Portfolio content collection schema (add statsDisplay field)
- GitHubCard.astro component (conditional rendering logic)
- github-api.ts script (may need npm package stats endpoint)
- CMS configuration (add statsDisplay field options)

**Files to modify:**
- `src/content.config.ts` — Add statsDisplay field to portfolio schema (MODIFY)
- `src/components/portfolio/GitHubCard.astro` — Conditional stats rendering (MODIFY)
- `src/scripts/github-api.ts` — Add npm download stats fetching (MODIFY)
- `public/admin/config.yml` — Add statsDisplay select widget (MODIFY)

**Schema changes:**

```typescript
// content.config.ts
const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: z.object({
    // ... existing fields
    statsDisplay: z.enum(['stars', 'downloads', 'both', 'none']).optional().default('stars'),
    npmPackage: optionalStr, // For download stats
  })
});
```

**Component logic changes:**

```astro
---
// GitHubCard.astro
interface Props {
  // ... existing props
  statsDisplay?: 'stars' | 'downloads' | 'both' | 'none';
  npmPackage?: string;
}

const { statsDisplay = 'stars', npmPackage, ...rest } = Astro.props;
---

<div class="github-card"
     data-owner={owner}
     data-repo={repo}
     data-stats-display={statsDisplay}
     data-npm-package={npmPackage}>
  <!-- ... skeleton -->
  <div class="content">
    <!-- ... title, description -->
    <div class="repo-stats">
      {(statsDisplay === 'stars' || statsDisplay === 'both') && (
        <span class="stars">Stars: <span class="star-count">-</span></span>
      )}
      {(statsDisplay === 'downloads' || statsDisplay === 'both') && npmPackage && (
        <span class="downloads">Downloads: <span class="download-count">-</span></span>
      )}
    </div>
  </div>
</div>

<script>
  import { fetchRepoData, fetchNpmDownloads } from '../../scripts/github-api';

  document.addEventListener('DOMContentLoaded', async () => {
    const cards = document.querySelectorAll('.github-card');

    cards.forEach(async (card) => {
      const statsDisplay = card.getAttribute('data-stats-display');
      const npmPackage = card.getAttribute('data-npm-package');

      // Existing GitHub API logic
      if (statsDisplay === 'stars' || statsDisplay === 'both') {
        const data = await fetchRepoData(owner, repo);
        // ... update stars
      }

      // NEW: npm downloads
      if ((statsDisplay === 'downloads' || statsDisplay === 'both') && npmPackage) {
        const downloads = await fetchNpmDownloads(npmPackage);
        // ... update downloads
      }
    });
  });
</script>
```

**API integration:**

```typescript
// github-api.ts - Add npm download stats
export async function fetchNpmDownloads(packageName: string): Promise<number | null> {
  const cacheKey = `npm-downloads-${packageName}`;

  // Check cache (same pattern as GitHub API)
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const cachedData = JSON.parse(cached);
      const age = Date.now() - cachedData.timestamp;
      if (age < CACHE_DURATION) {
        return cachedData.data;
      }
    }
  } catch (err) {
    console.warn('[npm API] Cache read error:', err);
  }

  // Fetch from npm API (last 30 days)
  const url = `https://api.npmjs.org/downloads/point/last-month/${packageName}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const downloads = data.downloads;

    // Update cache
    localStorage.setItem(cacheKey, JSON.stringify({
      data: downloads,
      timestamp: Date.now(),
    }));

    return downloads;
  } catch (err) {
    console.error(`[npm API] Error fetching ${packageName}:`, err);
    return null;
  }
}
```

**CMS configuration:**

```yaml
# public/admin/config.yml
- name: portfolio
  fields:
    # ... existing fields
    - label: "Stats Display"
      name: "statsDisplay"
      widget: "select"
      options: ["stars", "downloads", "both", "none"]
      default: "stars"
      required: false
    - label: "npm Package Name"
      name: "npmPackage"
      widget: "string"
      required: false
      hint: "For npm download stats (e.g., 'my-package')"
```

**Confidence:** HIGH — Follows existing GitHub API pattern exactly. npm API is public, unauthenticated, well-documented.

---

### 4. Multi-Theme CSS System Integration

**What it integrates with:**
- CSS custom properties system (existing :root variables)
- Dark mode media query (currently automatic)
- BaseLayout.astro (inject theme switcher and script)
- localStorage (theme persistence, same pattern as GitHub API cache)

**Files to create:**
- `src/components/ThemeSwitcher.astro` — Theme selection UI (CREATE)
- `src/scripts/theme-switcher.ts` — Theme logic and persistence (CREATE)
- `src/styles/themes.css` — Theme-specific custom property overrides (CREATE)

**Files to modify:**
- `src/layouts/BaseLayout.astro` — Include theme script and switcher (MODIFY)
- `src/styles/global.css` — Import themes.css (MODIFY)

**Architecture approach:**

**Current system (automatic dark mode):**
```css
/* global.css */
:root {
  --color-bg: #ffffff;
  --color-text: #333333;
  /* ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #e0e0e0;
    /* ... */
  }
}
```

**New system (6-8 selectable themes + auto):**

```css
/* themes.css */

/* Default light theme (unchanged) */
:root {
  --color-bg: #ffffff;
  --color-text: #333333;
  --color-text-muted: #666666;
  --color-link: #0066cc;
  --color-link-hover: #004499;
  --color-border: #e0e0e0;
  --color-header-bg: #f8f9fa;
}

/* Dark theme */
[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #e0e0e0;
  --color-text-muted: #a0a0a0;
  --color-link: #6699ff;
  --color-link-hover: #99bbff;
  --color-border: #404040;
  --color-header-bg: #252525;
}

/* Sepia/Academic theme */
[data-theme="sepia"] {
  --color-bg: #f4ecd8;
  --color-text: #5c4a2e;
  --color-text-muted: #8b7355;
  --color-link: #8b4513;
  --color-link-hover: #654321;
  --color-border: #d4c4a8;
  --color-header-bg: #eae0cc;
}

/* High contrast theme */
[data-theme="high-contrast"] {
  --color-bg: #000000;
  --color-text: #ffffff;
  --color-text-muted: #cccccc;
  --color-link: #ffff00;
  --color-link-hover: #ffff99;
  --color-border: #ffffff;
  --color-header-bg: #1a1a1a;
}

/* Ocean theme */
[data-theme="ocean"] {
  --color-bg: #0a1929;
  --color-text: #b2bac2;
  --color-text-muted: #8792a2;
  --color-link: #3399ff;
  --color-link-hover: #66b2ff;
  --color-border: #1e3a5f;
  --color-header-bg: #0f2235;
}

/* Forest theme */
[data-theme="forest"] {
  --color-bg: #1a2f23;
  --color-text: #d4e4da;
  --color-text-muted: #a8c5b3;
  --color-link: #66cc99;
  --color-link-hover: #99ddbb;
  --color-border: #2d4a38;
  --color-header-bg: #223529;
}

/* Solarized Light */
[data-theme="solarized-light"] {
  --color-bg: #fdf6e3;
  --color-text: #657b83;
  --color-text-muted: #93a1a1;
  --color-link: #268bd2;
  --color-link-hover: #2aa198;
  --color-border: #eee8d5;
  --color-header-bg: #f7f1df;
}

/* Solarized Dark */
[data-theme="solarized-dark"] {
  --color-bg: #002b36;
  --color-text: #839496;
  --color-text-muted: #586e75;
  --color-link: #268bd2;
  --color-link-hover: #2aa198;
  --color-border: #073642;
  --color-header-bg: #00212b;
}

/* Auto theme (respects prefers-color-scheme) */
[data-theme="auto"] {
  /* Uses :root default in light mode */
}

@media (prefers-color-scheme: dark) {
  [data-theme="auto"] {
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

**Theme switcher component:**

```astro
---
// ThemeSwitcher.astro
const themes = [
  { value: 'auto', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'high-contrast', label: 'High Contrast' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'forest', label: 'Forest' },
  { value: 'solarized-light', label: 'Solarized Light' },
  { value: 'solarized-dark', label: 'Solarized Dark' },
];
---

<div class="theme-switcher">
  <label for="theme-select" class="sr-only">Select theme</label>
  <select id="theme-select" class="theme-select">
    {themes.map(theme => (
      <option value={theme.value}>{theme.label}</option>
    ))}
  </select>
</div>

<style>
  .theme-switcher {
    position: relative;
  }

  .theme-select {
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-header-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
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

**Theme persistence script:**

```typescript
// theme-switcher.ts
type Theme = 'auto' | 'light' | 'dark' | 'sepia' | 'high-contrast' | 'ocean' | 'forest' | 'solarized-light' | 'solarized-dark';

const STORAGE_KEY = 'site-theme';
const DEFAULT_THEME: Theme = 'auto';

/**
 * Get the current theme from localStorage or default
 */
function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Theme) || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/**
 * Apply theme by setting data-theme attribute on <html>
 */
function applyTheme(theme: Theme): void {
  if (theme === 'auto') {
    // Remove attribute to use :root and @media query
    document.documentElement.removeAttribute('data-theme');
  } else if (theme === 'light') {
    // Explicitly set light theme (overrides dark mode media query)
    document.documentElement.removeAttribute('data-theme');
  } else {
    // Set specific theme
    document.documentElement.setAttribute('data-theme', theme);
  }
}

/**
 * Save theme preference to localStorage
 */
function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (err) {
    console.warn('[Theme] Could not save theme preference:', err);
  }
}

/**
 * Initialize theme system on page load
 */
export function initTheme(): void {
  // Apply stored theme immediately (before page render to prevent flash)
  const theme = getStoredTheme();
  applyTheme(theme);

  // Set select value to match stored theme
  const select = document.getElementById('theme-select') as HTMLSelectElement;
  if (select) {
    select.value = theme;

    // Listen for theme changes
    select.addEventListener('change', (e) => {
      const newTheme = (e.target as HTMLSelectElement).value as Theme;
      applyTheme(newTheme);
      saveTheme(newTheme);
    });
  }
}

// Run immediately (before DOMContentLoaded to prevent theme flash)
if (typeof window !== 'undefined') {
  const theme = getStoredTheme();
  applyTheme(theme);
}
```

**Integration in BaseLayout:**

```astro
---
// BaseLayout.astro
import ThemeSwitcher from '../components/ThemeSwitcher.astro';
// ... existing imports
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... existing head -->

    <!-- Inline critical theme script to prevent flash -->
    <script is:inline>
      (function() {
        try {
          const theme = localStorage.getItem('site-theme') || 'auto';
          if (theme !== 'auto' && theme !== 'light') {
            document.documentElement.setAttribute('data-theme', theme);
          }
        } catch (e) {}
      })();
    </script>
  </head>
  <body>
    <SkipLink />
    <header class="site-header">
      <div class="header-content">
        <a href="/" class="site-title">{siteData.site.title}</a>
        <ThemeSwitcher />
      </div>
    </header>
    <!-- ... rest of layout -->
  </body>
</html>

<script>
  import { initTheme } from '../scripts/theme-switcher';

  // Initialize theme system on page load
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
  });
</script>
```

**Key architectural decisions:**

1. **[data-theme] attribute on <html>** — Single source of truth for theme state
2. **CSS custom properties** — All theme changes via custom property overrides (no class swapping)
3. **localStorage persistence** — Same pattern as GitHub API cache
4. **Inline critical script** — Prevents flash of unstyled content (FOUC)
5. **Auto theme option** — Preserves existing dark mode behavior
6. **No build-time theme variants** — All themes in single CSS file (small overhead, simpler architecture)

**Confidence:** HIGH — Pattern is well-established, follows existing architecture (localStorage, custom properties), similar to existing dark mode implementation.

---

## Patterns to Follow

### Pattern 1: Content Collection Addition

**What:** Add a new content collection (teaching)

**When:** Need structured content with schema validation and CMS editing

**Example:**
```typescript
// 1. Define in content.config.ts
const teaching = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/teaching" }),
  schema: z.object({
    title: z.string(),
    // ... fields
  })
});

export const collections = {
  publications, talks, posts, portfolio, pages,
  teaching // Add to exports
};

// 2. Create pages following existing pattern
// src/pages/teaching/index.astro — listing
// src/pages/teaching/[...slug].astro — detail
```

### Pattern 2: Component Composition

**What:** Build complex features from small, focused components

**When:** Feature needs multiple concerns (data fetching, rendering, interactivity)

**Example:**
Portfolio card composition:
```astro
<GitHubCard /> <!-- Fetches API data, displays stats -->
<DemoEmbed />  <!-- Renders iframe embed -->
<CodeEmbed />  <!-- Syntax highlighting -->
```

Each component:
- Single responsibility
- Accepts props for configuration
- Scoped styles
- Self-contained scripts

### Pattern 3: Client-Side Data Fetching with Cache

**What:** Fetch external API data in browser with localStorage cache

**When:** Need dynamic data that can't be build-time (GitHub API, npm stats)

**Example:**
```typescript
// Existing pattern from github-api.ts
export async function fetchData(key: string, url: string): Promise<any> {
  const cacheKey = `cache-${key}`;

  // 1. Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  // 2. Fetch from API
  const response = await fetch(url);
  const data = await response.json();

  // 3. Update cache
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }));

  return data;
}
```

### Pattern 4: CSS Custom Properties for Theming

**What:** All colors and spacing via CSS variables, theme switching via attribute selectors

**When:** Need consistent styling and theme support

**Example:**
```css
/* Define variables */
:root {
  --color-bg: #ffffff;
}

/* Override with attribute selector */
[data-theme="dark"] {
  --color-bg: #1a1a1a;
}

/* Use in components */
.component {
  background: var(--color-bg);
}
```

**Advantages:**
- Single source of truth for values
- Automatic cascade to all components
- Runtime theme switching without class juggling
- Minimal JS (just set one attribute)

### Pattern 5: CMS/Schema Synchronization

**What:** Keep public/admin/config.yml in sync with content.config.ts

**When:** Content is editable via Decap CMS

**Example:**
```yaml
# config.yml has comments linking to schema
# Schema mirrors src/content.config.ts -- update both when changing fields
fields:
  - { label: "Title", name: "title", widget: "string", required: true }
```

```typescript
// content.config.ts
schema: z.object({
  title: z.string(),
})
```

**Process for adding fields:**
1. Add to Zod schema in content.config.ts
2. Add to CMS config.yml fields array
3. Update existing content files if field is required
4. Test in CMS (restart dev server to reload config)

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: SSR or Server Endpoints

**What:** Using Astro server endpoints or SSR for GitHub/npm stats

**Why bad:**
- Site is deployed to GitHub Pages (static only)
- Adding SSR would require different hosting (Netlify/Vercel)
- Increases complexity and cost
- Current client-side approach works fine with caching

**Instead:** Keep client-side fetching with localStorage cache (existing pattern)

### Anti-Pattern 2: Runtime Markdown Rendering

**What:** Using marked or markdown-it in browser to render code blocks

**Why bad:**
- Duplicates Astro's build-time markdown processing
- Increases bundle size significantly
- Slower rendering
- Loses Astro's optimizations

**Instead:** Use Astro's built-in markdown processing with Shiki at build time

### Anti-Pattern 3: Theme Class Swapping

**What:** Changing theme by toggling classes on every component

**Why bad:**
```javascript
// BAD: Requires touching every element
document.querySelectorAll('.card').forEach(el => {
  el.classList.remove('light-theme');
  el.classList.add('dark-theme');
});
```

**Instead:** Set single attribute, let CSS cascade:
```javascript
// GOOD: Single attribute change
document.documentElement.setAttribute('data-theme', 'dark');
```

### Anti-Pattern 4: Separate CSS Files Per Theme

**What:** Loading different CSS files for each theme

**Why bad:**
- Requires page reload to switch themes (bad UX)
- Increases build complexity
- Harder to maintain consistency
- More HTTP requests

**Instead:** Single CSS file with attribute selectors for theme overrides

### Anti-Pattern 5: Mixing Content Collection Types

**What:** Putting teaching content in pages or posts collection

**Why bad:**
- Loses type safety (different fields per content type)
- Harder to query specific content types
- CMS becomes confusing (all types in one folder)
- Breaks semantic organization

**Instead:** Create dedicated collection with its own schema

### Anti-Pattern 6: Hardcoding Theme Colors

**What:** Using color values directly in component styles

**Why bad:**
```astro
<style>
  /* BAD: Doesn't respect theme */
  .button {
    background: #0066cc;
  }
</style>
```

**Instead:** Always use custom properties:
```astro
<style>
  /* GOOD: Theme-aware */
  .button {
    background: var(--color-link);
  }
</style>
```

---

## Build Order and Dependencies

### Phase 1: Foundation (No Dependencies)

**Goal:** Establish base patterns without breaking existing functionality

1. **Theme System CSS** (2-3 hours)
   - Create src/styles/themes.css with theme variables
   - Import in global.css
   - Test that existing site still works (default theme)
   - No UI yet, just infrastructure

2. **Teaching Collection Schema** (1 hour)
   - Add teaching collection to content.config.ts
   - Add CMS configuration in config.yml
   - Create 1-2 sample teaching/*.md files
   - Verify schema validation works

**Why this order:** CSS theme infrastructure must exist before theme switcher. Teaching schema must exist before pages that query it.

### Phase 2: UI Components (Depends on Phase 1)

**Goal:** Add visible features that use Phase 1 infrastructure

3. **Theme Switcher UI** (2-3 hours)
   - Create ThemeSwitcher.astro component
   - Create theme-switcher.ts script
   - Add to BaseLayout.astro header
   - Test theme switching and persistence
   - **Depends on:** Theme CSS from step 1

4. **Teaching Pages** (3-4 hours)
   - Create pages/teaching/index.astro (listing)
   - Create pages/teaching/[...slug].astro (detail)
   - Add teaching link to Navigation.astro
   - Style teaching entry layout
   - **Depends on:** Teaching collection from step 2

### Phase 3: Portfolio Enhancements (Depends on Phase 1, 2)

**Goal:** Extend existing portfolio functionality

5. **Configurable Portfolio Stats** (3-4 hours)
   - Add statsDisplay and npmPackage fields to portfolio schema
   - Add fields to CMS config
   - Modify GitHubCard.astro for conditional rendering
   - Add fetchNpmDownloads to github-api.ts
   - Test with different stat configurations
   - **Depends on:** Nothing (can be parallel with 3-4)

6. **Code Syntax Highlighting** (2-4 hours)
   - **Option A (Simple):** Configure Shiki in astro.config.mjs for markdown code fences
   - **Option B (Advanced):** Create CodeEmbed.astro component with copy button
   - Update portfolio markdown files with code examples
   - Test syntax highlighting with multiple languages
   - Ensure themes work with code highlighting
   - **Depends on:** Theme CSS from step 1 (for theme-aware highlighting)

### Phase 4: Integration and Testing (Depends on All)

7. **Integration Testing** (2-3 hours)
   - Test all features together
   - Verify CMS editing workflow
   - Check theme switching doesn't break components
   - Test GitHub/npm API fetching with cache
   - Mobile responsiveness check
   - Accessibility audit (keyboard nav, screen readers)

8. **Documentation and Refinement** (1-2 hours)
   - Update README with new features
   - Document theme customization process
   - Add developer notes about maintaining schemas/CMS sync

### Total Estimated Time: 16-24 hours

### Dependency Graph

```
themes.css (1) ──┬──> ThemeSwitcher (3) ───┐
                 │                          │
teaching schema (2) ──> teaching pages (4) ─┼──> Integration (7)
                                             │
portfolio schema (5) ────────────────────────┤
                                             │
Shiki config (6) ────────────────────────────┘
```

### Parallel Work Opportunities

Can be done simultaneously:
- Theme CSS + Teaching schema (no conflicts)
- Theme switcher + Teaching pages (different files)
- Portfolio stats + Code highlighting (different concerns)

Cannot be parallelized:
- Theme CSS must complete before theme switcher
- Teaching schema must complete before teaching pages
- All features must complete before integration testing

---

## Scalability Considerations

### At Current Scale (< 100 portfolio items, < 50 teaching entries)

| Concern | Approach | Why |
|---------|----------|-----|
| API rate limits | Client-side fetch with 1-hour cache | GitHub: 60 req/hr unauthenticated, npm: no rate limit. Cache reduces requests significantly. |
| Build time | Static site generation | Fast builds with Astro 5.x. Content collections use glob loader (incremental). |
| Bundle size | Code splitting via Astro islands | Theme CSS ~2-3KB. Each script loads per-page. No runtime framework. |
| Browser storage | localStorage for cache + theme | Minimal usage (~1KB per repo cached, ~100 bytes theme pref). |

### At Medium Scale (100-500 portfolio items, 50-200 teaching entries)

| Concern | Approach | Why |
|---------|----------|-----|
| API rate limits | Add GitHub token to env for 5000 req/hr | Use in build-time data fetching instead of client-side. |
| Build time | Still acceptable (1-2 min) | Astro's incremental builds help. Consider caching API responses at build time. |
| Bundle size | Still minimal | No change in approach. Static site = no scaling issues. |
| Page load | Lazy load portfolio cards | Intersection Observer to fetch API data only when cards visible. |

### At Large Scale (500+ items, complex queries)

| Concern | Approach | Why |
|---------|----------|-----|
| API rate limits | Pre-fetch at build time, store in static JSON | Eliminate client-side API calls entirely. Trade-off: stats not real-time but build-time. |
| Build time | Pagination, virtual collections | Split large collections into pages. Use Astro's pagination. |
| Search/filtering | Add client-side search library (fuse.js) or pre-build search index | Static site search via client-side indexing. |

### Current Recommendation

**Keep existing client-side approach.** It scales well for academic portfolio use case (unlikely to hit rate limits with caching). If rate limits become an issue, easy migration path: move fetching to build time with GitHub token in env.

---

## New vs. Modified Components Summary

### New Files (To Create)

| File | Purpose | Lines Est. | Complexity |
|------|---------|-----------|------------|
| `src/content/teaching/*.md` | Teaching entry content | N/A | Low |
| `src/pages/teaching/index.astro` | Teaching listing page | ~80 | Low |
| `src/pages/teaching/[...slug].astro` | Teaching detail page | ~60 | Low |
| `src/components/ThemeSwitcher.astro` | Theme selection UI | ~40 | Low |
| `src/components/portfolio/CodeEmbed.astro` | Syntax-highlighted code (if Option B) | ~80 | Medium |
| `src/scripts/theme-switcher.ts` | Theme logic and persistence | ~60 | Low |
| `src/styles/themes.css` | Theme-specific CSS overrides | ~200 | Low |

**Total new files:** 7 (or 6 if using markdown code fences instead of CodeEmbed)

### Modified Files (To Update)

| File | Changes | Risk | Lines Changed |
|------|---------|------|---------------|
| `src/content.config.ts` | Add teaching collection, portfolio fields | Low | +15-20 |
| `public/admin/config.yml` | Add teaching + portfolio field configs | Low | +40-50 |
| `src/components/portfolio/GitHubCard.astro` | Conditional stats rendering | Low | +20-30 |
| `src/scripts/github-api.ts` | Add npm download fetching function | Low | +40-50 |
| `src/layouts/BaseLayout.astro` | Add theme switcher, inline script | Low | +15-20 |
| `src/components/Navigation.astro` | Add teaching link | Very Low | +1-2 |
| `src/styles/global.css` | Import themes.css | Very Low | +1 |
| `astro.config.mjs` | Configure Shiki (if using code fences) | Low | +10-15 |

**Total modified files:** 8

### Risk Assessment

**Low Risk Changes:**
- All additions follow existing patterns
- No breaking changes to existing components
- New collections don't affect existing ones
- Theme system is additive (doesn't remove dark mode)
- Portfolio stats are optional fields (backward compatible)

**Medium Risk Changes:**
- None identified

**Mitigation:**
- Test incrementally (one feature at a time)
- Keep git commits granular for easy rollback
- Test CMS editing after schema changes
- Verify theme switching doesn't break existing styles

---

## Confidence Assessment

| Area | Confidence | Sources | Notes |
|------|------------|---------|-------|
| Content Collections | HIGH | Existing codebase | 5 collections already implemented, pattern is clear |
| Component Architecture | HIGH | Existing codebase | Portfolio components demonstrate composition pattern |
| CSS Custom Properties | HIGH | Existing codebase + training data | Site already uses custom properties with dark mode |
| Client-Side Fetching | HIGH | Existing codebase | GitHub API pattern established and working |
| Theme Switching | HIGH | Training data + web standards | Standard [data-theme] pattern, well-established |
| Shiki Integration | MEDIUM-HIGH | Training data | Astro has built-in Shiki, but dual-theme config needs verification |
| npm API | MEDIUM-HIGH | Training data + public API docs | Public API, no auth needed, straightforward endpoint |
| Build-Time Code Highlighting | MEDIUM | Training data | Shiki API is stable but specific Astro integration steps need verification |

**Overall confidence: HIGH** — All features align with existing architectural patterns. No experimental approaches or major refactors required.

---

## Source Attribution

### HIGH Confidence (Direct Verification)

- **Astro content collections with glob loader:** Verified in `/Users/pedf/workspace/bacilo.github.io/src/content.config.ts` (lines 1-67)
- **Component composition pattern:** Verified in `/Users/pedf/workspace/bacilo.github.io/src/pages/portfolio/index.astro` (lines 19-40)
- **CSS custom properties system:** Verified in `/Users/pedf/workspace/bacilo.github.io/src/styles/global.css` (lines 1-38)
- **Client-side API fetching with cache:** Verified in `/Users/pedf/workspace/bacilo.github.io/src/scripts/github-api.ts` (lines 22-96)
- **CMS schema sync pattern:** Verified in `/Users/pedf/workspace/bacilo.github.io/public/admin/config.yml` (comments on lines 72, 86, 104, 121)
- **Existing dark mode implementation:** Verified in `/Users/pedf/workspace/bacilo.github.io/src/styles/global.css` (lines 27-38)

### MEDIUM-HIGH Confidence (Training Data + Standards)

- **Shiki syntax highlighting:** Based on Astro training data (January 2025 cutoff) - Astro has built-in Shiki support since v2.x, continued in v5.x
- **npm downloads API:** Public npm registry API endpoint (`https://api.npmjs.org/downloads/point/`) - no authentication required
- **CSS [data-theme] pattern:** Standard web practice, widely used in production sites
- **localStorage theme persistence:** Standard browser API, same pattern as existing cache implementation
- **Inline script for FOUC prevention:** Standard pattern for preventing theme flash

### MEDIUM Confidence (Training Data, Needs Verification)

- **Astro 5.x Shiki dual-theme config:** Training data suggests `themes: { light, dark }` config exists, but exact API for dual-theme should be verified in official docs
- **Shiki codeToHtml API for custom component:** Training data indicates this API exists, but implementation details should be verified if using custom component

### Areas Flagged for Verification

1. **Shiki dual-theme configuration syntax** — Exact config format for light/dark theme switching in Astro 5.x markdown config
2. **Shiki codeToHtml API** — If building custom CodeEmbed component, verify current Shiki API (may have changed since training data)

**Mitigation:** Start with simple markdown code fence approach (lower risk). Add custom component later if needed.

---

## Open Questions for Phase-Specific Research

These questions don't block initial implementation but may need deeper research:

1. **Teaching collection fields:** What fields do typical academic teaching sections include? (Can refine schema based on user needs)

2. **npm download time ranges:** API supports last-day, last-week, last-month. Which is most meaningful for portfolio stats?

3. **Theme naming and count:** Document suggests 6-8 themes. Which specific themes provide best coverage? (Color-blind accessible options?)

4. **Code highlighting language support:** Which languages should be pre-configured? (TypeScript, JavaScript, Python, Bash are obvious - what else?)

5. **Teaching section navigation:** Should teaching have its own top-level nav link, or be under "CV" section?

6. **Portfolio stats display defaults:** Should statsDisplay default to 'stars', 'both', or 'none'?

**Resolution strategy:** These are design/UX questions, not technical blockers. Can be decided during implementation or deferred to user preference.

---

## Next Steps for Implementer

1. **Review this architecture document** — Understand integration points and data flows

2. **Start with Phase 1 (Foundation):**
   - Create themes.css (use color examples provided)
   - Add teaching collection to content.config.ts

3. **Test incrementally:**
   - After each step, verify existing functionality still works
   - Check that builds succeed and CMS loads

4. **Follow existing patterns:**
   - Copy structure from publications/talks for teaching pages
   - Copy pattern from GitHubCard for fetching npm stats
   - Use same localStorage pattern for theme persistence

5. **Flag issues early:**
   - If Shiki config doesn't work as documented, simplify to basic code fences first
   - If theme switching has visual glitches, check CSS specificity conflicts
   - If CMS doesn't reflect schema changes, restart dev server and clear browser cache

**Success criteria:**
- [ ] All 4 features working independently
- [ ] Features work together (themes apply to code highlighting, etc.)
- [ ] CMS editing works for teaching and new portfolio fields
- [ ] No regressions to existing functionality
- [ ] Builds succeed for GitHub Pages deployment
