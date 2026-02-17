# Stack Research - Milestone 2

**Domain:** Teaching Section + Portfolio Enhancements (Code Embeds, Stats Config, Multi-Theme)
**Researched:** 2026-02-16
**Confidence:** MEDIUM (training data based, web research tools unavailable)

## Executive Summary

This research focuses on stack additions for 4 new features:
1. Teaching section (content collection + pages)
2. Portfolio code embeds with syntax highlighting
3. Configurable GitHub stats (stars/downloads/both/neither via Releases API)
4. Multi-theme CSS system (6-8 themes)

**Key finding:** Minimal new dependencies required. Astro 5.x includes Shiki syntax highlighting, GitHub Releases API is available client-side, and themes use existing CSS custom properties pattern.

## New Stack Additions

### Syntax Highlighting

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Shiki | Built-in (via Astro) | Syntax highlighting for code blocks | Built into Astro 5.x, no installation needed. VSCode-quality highlighting, supports 100+ languages, multiple themes. Better than Prism for static sites (no client JS needed). |
| `@astrojs/mdx` | ^4.0.0 (existing) | Enhanced markdown with components | Already installed. Enables code block highlighting in MDX files. |

**Integration:** Zero-config for basic use. Astro automatically applies Shiki to markdown/MDX code blocks.

### Code Embed Features

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| None required | N/A | Copy button, line highlighting | Implement with vanilla TypeScript (already in project). Lightweight custom solution matches existing iframe embed pattern. |

**Rationale:** Site uses vanilla TypeScript patterns (see `src/scripts/github-api.ts`). Adding react-syntax-highlighter or similar would introduce React dependency for minimal benefit.

### GitHub Releases API Integration

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| None required | N/A | Fetch release download counts | Extend existing `src/scripts/github-api.ts` pattern. GitHub REST API v3 provides `/repos/{owner}/{repo}/releases/latest` endpoint with download counts. |

**API Endpoint:**
```
GET https://api.github.com/repos/{owner}/{repo}/releases/latest
Response includes: download_count per asset, total across assets
```

**Integration:** Add `fetchReleaseStats()` function alongside existing `fetchRepoData()`. Same caching pattern (localStorage, 1-hour TTL). Same error handling.

### Multi-Theme CSS System

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| CSS Custom Properties | N/A (native CSS) | Theme definitions | Already used for dark mode. Extend existing `:root` pattern with `[data-theme="name"]` selectors. |
| localStorage | N/A (native Web API) | Theme persistence | Match existing GitHub API caching pattern. Simple, no dependencies. |

**No libraries needed.** Avoid styled-components, theme-ui, CSS-in-JS solutions (introduce React/complexity).

## Installation

**No new npm packages required.**

All features use:
- Built-in Astro capabilities (Shiki)
- Native Web APIs (fetch, localStorage)
- Existing TypeScript patterns
- CSS custom properties (already in use)

## Recommended Architecture

### 1. Teaching Section

**Content Collection:**
```typescript
// src/content.config.ts additions
const teaching = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/teaching" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    duration: z.string().optional(), // e.g., "30 min read"
  })
});
```

**Pages:**
- `/src/pages/teaching/index.astro` - List view
- `/src/pages/teaching/[...slug].astro` - Article detail

**No new dependencies.** Follows existing publications/talks/posts pattern.

### 2. Code Embeds with Syntax Highlighting

**Shiki Configuration (astro.config.mjs):**
```typescript
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: 'github-dark', // or 'github-light', 'nord', 'dracula', etc.
      langs: ['javascript', 'typescript', 'python', 'bash', 'css', 'html'],
      wrap: true, // wrap long lines
    }
  },
  // ... existing config
});
```

**Custom Code Component:**
```astro
// src/components/CodeBlock.astro
---
interface Props {
  code: string;
  lang: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  filename?: string;
  runnable?: boolean; // for future widget integration
}
---
<div class="code-block">
  {filename && <div class="filename">{filename}</div>}
  <button class="copy-btn" data-code={code}>Copy</button>
  <!-- Shiki renders the highlighted HTML at build time -->
  <slot />
</div>

<script>
  // Copy functionality (vanilla TypeScript)
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const code = (e.target as HTMLElement).dataset.code;
      await navigator.clipboard.writeText(code || '');
      // ... feedback UI
    });
  });
</script>
```

**Rationale:** Shiki runs at build time (zero client JS for highlighting). Only copy button needs client-side code.

### 3. Configurable Portfolio Stats

**Schema Extension (src/content.config.ts):**
```typescript
const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: z.object({
    // ... existing fields
    statsDisplay: z.enum(['stars', 'downloads', 'both', 'none']).default('both'),
    releaseAssetPattern: z.string().optional(), // regex to match specific assets
  })
});
```

**API Extension (src/scripts/github-api.ts):**
```typescript
export interface GitHubRelease {
  tag_name: string;
  assets: Array<{
    name: string;
    download_count: number;
  }>;
}

export async function fetchReleaseStats(
  owner: string,
  repo: string
): Promise<GitHubRelease | null> {
  const cacheKey = `github-release-${owner}-${repo}`;

  // Same caching pattern as fetchRepoData()
  // Check localStorage, 1-hour TTL

  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github.v3+json' },
    signal: AbortSignal.timeout(5000),
  });

  // ... error handling, caching (match existing pattern)
}
```

**Component Update (src/components/portfolio/GitHubCard.astro):**
```astro
---
interface Props {
  // ... existing
  statsDisplay?: 'stars' | 'downloads' | 'both' | 'none';
}

const { statsDisplay = 'both' } = Astro.props;
---

<div class="repo-stats">
  {(statsDisplay === 'stars' || statsDisplay === 'both') && (
    <span class="stars">Stars: <span class="star-count">-</span></span>
  )}
  {(statsDisplay === 'downloads' || statsDisplay === 'both') && (
    <span class="downloads">Downloads: <span class="download-count">-</span></span>
  )}
</div>

<script>
  import { fetchRepoData, fetchReleaseStats } from '../../scripts/github-api';

  // Fetch both repo and release data
  const [repoData, releaseData] = await Promise.all([
    fetchRepoData(owner, repo),
    statsDisplay !== 'none' && statsDisplay !== 'stars'
      ? fetchReleaseStats(owner, repo)
      : null
  ]);

  // Calculate total downloads across assets
  if (releaseData) {
    const totalDownloads = releaseData.assets.reduce(
      (sum, asset) => sum + asset.download_count,
      0
    );
    downloadCountElement.textContent = totalDownloads.toLocaleString();
  }
</script>
```

**Rationale:** Extends existing GitHub API pattern. Same architecture as stars fetching.

### 4. Multi-Theme CSS System

**Theme Definitions (src/styles/themes.css):**
```css
/* Base light theme (existing) */
:root {
  --color-bg: #ffffff;
  --color-text: #333333;
  /* ... existing vars */
}

/* Dark theme (existing via media query, make explicit) */
[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #e0e0e0;
  /* ... existing dark vars */
}

/* Additional themes */
[data-theme="nord"] {
  --color-bg: #2e3440;
  --color-text: #eceff4;
  --color-link: #88c0d0;
  --color-link-hover: #81a1c1;
  --color-border: #4c566a;
  --color-header-bg: #3b4252;
}

[data-theme="solarized-light"] {
  --color-bg: #fdf6e3;
  --color-text: #657b83;
  --color-link: #268bd2;
  --color-link-hover: #2aa198;
  --color-border: #eee8d5;
  --color-header-bg: #eee8d5;
}

[data-theme="dracula"] {
  --color-bg: #282a36;
  --color-text: #f8f8f2;
  --color-link: #bd93f9;
  --color-link-hover: #ff79c6;
  --color-border: #44475a;
  --color-header-bg: #44475a;
}

[data-theme="github"] {
  --color-bg: #ffffff;
  --color-text: #24292f;
  --color-link: #0969da;
  --color-link-hover: #0550ae;
  --color-border: #d0d7de;
  --color-header-bg: #f6f8fa;
}

[data-theme="monokai"] {
  --color-bg: #272822;
  --color-text: #f8f8f2;
  --color-link: #66d9ef;
  --color-link-hover: #a6e22e;
  --color-border: #49483e;
  --color-header-bg: #3e3d32;
}

[data-theme="sepia"] {
  --color-bg: #f4ecd8;
  --color-text: #5c4a3a;
  --color-link: #8b6914;
  --color-link-hover: #6b4e0f;
  --color-border: #d9c9a8;
  --color-header-bg: #e8ddc5;
}
```

**Theme Switcher Component:**
```astro
// src/components/ThemeSwitcher.astro
<div class="theme-switcher">
  <label for="theme-select">Theme:</label>
  <select id="theme-select">
    <option value="auto">Auto (System)</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    <option value="nord">Nord</option>
    <option value="solarized-light">Solarized Light</option>
    <option value="dracula">Dracula</option>
    <option value="github">GitHub</option>
    <option value="monokai">Monokai</option>
    <option value="sepia">Sepia</option>
  </select>
</div>

<script>
  const STORAGE_KEY = 'site-theme';
  const select = document.getElementById('theme-select') as HTMLSelectElement;

  // Load saved theme
  const savedTheme = localStorage.getItem(STORAGE_KEY) || 'auto';
  select.value = savedTheme;
  applyTheme(savedTheme);

  // Listen for changes
  select.addEventListener('change', (e) => {
    const theme = (e.target as HTMLSelectElement).value;
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  });

  function applyTheme(theme: string) {
    if (theme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
      // Falls back to :root and @media (prefers-color-scheme: dark)
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  // Listen for system theme changes when in auto mode
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (savedTheme === 'auto') {
      applyTheme('auto');
    }
  });
</script>
```

**Integration Point:** Add `<ThemeSwitcher />` to `BaseLayout.astro` header or footer.

**Rationale:**
- Extends existing CSS custom properties pattern
- No CSS-in-JS libraries needed
- Lightweight (few hundred bytes of JS)
- Matches existing localStorage caching pattern
- Preserves existing `prefers-color-scheme` support

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Prism.js | Requires client-side JS for highlighting | Shiki (built-in, runs at build time) |
| highlight.js | Same as Prism - client-side overhead | Shiki |
| react-syntax-highlighter | Introduces React dependency | Shiki + vanilla TS for copy button |
| styled-components | Requires React, CSS-in-JS overhead | CSS custom properties |
| theme-ui | React dependency, unnecessary abstraction | CSS custom properties + data attributes |
| @theme-ui/presets | Same as theme-ui | Hand-crafted theme definitions |
| octokit/rest.js | 300KB+ package for simple API calls | Native fetch (existing pattern) |
| @octokit/core | Same - unnecessary dependency | Native fetch |
| GitHub GraphQL API | More complex, requires API token for higher rate limits | REST API (simpler, works unauthenticated) |

## Recommended 8 Themes

| Theme | Type | Best For | Color Philosophy |
|-------|------|----------|------------------|
| Auto (System) | Adaptive | Default user experience | Respects OS preference |
| Light | Light | High contrast reading | Clean academic palette |
| Dark | Dark | Low-light environments | High contrast for readability |
| Nord | Dark | Aesthetic balance | Cool arctic palette, low contrast |
| Solarized Light | Light | Reduced eye strain | Scientifically designed color values |
| Dracula | Dark | Developer preference | Vibrant, popular in dev tools |
| GitHub | Light | Familiarity | Matches GitHub interface |
| Sepia | Light | Long reading sessions | Warm tones, reduced blue light |

**Rationale for selection:**
- Mix of light (5) and dark (3) options
- Includes popular developer themes (Nord, Dracula, Monokai)
- Includes academic/reading themes (Solarized, Sepia)
- Includes familiar themes (GitHub)
- All themes maintain sufficient contrast for accessibility

## Integration with Existing Stack

| Existing Component | Integration Point | Changes Required |
|--------------------|-------------------|------------------|
| `@astrojs/mdx` | Syntax highlighting | Configure `markdown.shikiConfig` in `astro.config.mjs` |
| `src/scripts/github-api.ts` | Release stats fetching | Add `fetchReleaseStats()` function, extend interface |
| `src/styles/global.css` | Theme system | Split into `global.css` + `themes.css`, add `data-theme` selectors |
| `src/content.config.ts` | Teaching collection | Add new collection definition |
| `src/layouts/BaseLayout.astro` | Theme switcher | Import `themes.css`, add `<ThemeSwitcher />` component |
| `src/components/portfolio/GitHubCard.astro` | Stats display config | Add props, conditional rendering, release API calls |

**Breaking changes:** None. All additions are backwards compatible.

## Code Organization

```
src/
  content/
    teaching/           # NEW: Teaching articles
  components/
    CodeBlock.astro     # NEW: Enhanced code display with copy
    ThemeSwitcher.astro # NEW: Theme selector UI
    portfolio/
      GitHubCard.astro  # MODIFIED: Add stats configuration
  scripts/
    github-api.ts       # MODIFIED: Add fetchReleaseStats()
  styles/
    global.css          # EXISTING: Base styles
    themes.css          # NEW: Theme definitions
  pages/
    teaching/
      index.astro       # NEW: Teaching list page
      [...slug].astro   # NEW: Teaching article page
```

## Performance Considerations

| Feature | Build Impact | Runtime Impact | Mitigation |
|---------|-------------|----------------|------------|
| Shiki syntax highlighting | +100-200ms per page with code | Zero (static HTML) | Acceptable - runs once at build |
| 8 theme definitions | Negligible | +2-3KB CSS | Acceptable - small payload increase |
| GitHub Releases API | Zero | +1 additional fetch per portfolio card | Cached (1hr TTL), aborted after 5s timeout |
| Teaching content collection | +50-100ms per article | Zero | Standard Astro collection processing |

**Overall impact:** Minimal. Largest addition is themes CSS (~2-3KB). All JavaScript additions follow existing patterns (vanilla TS, no frameworks).

## Shiki Theme Coordination

**Important:** Shiki syntax highlighting theme should match site theme for cohesion.

**Strategy 1: Single Shiki theme (simpler)**
```typescript
// astro.config.mjs
shikiConfig: {
  theme: 'github-dark', // works for most dark themes
}
```
**Pro:** Simple, works well enough
**Con:** Code blocks won't perfectly match all 8 themes

**Strategy 2: Dynamic Shiki theme (complex)**
Use Shiki's dual-theme mode:
```typescript
shikiConfig: {
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  }
}
```
Then toggle with CSS `[data-theme-appearance="dark"]`.

**Recommendation:** Start with Strategy 1 (single theme). Add Strategy 2 only if users report mismatch complaints.

## GitHub API Rate Limits

**Unauthenticated API:**
- 60 requests/hour per IP
- Shared across all API calls (repo + releases)

**Impact on this project:**
- Assume 10 portfolio items
- Each loads: 1 repo call + 1 release call = 20 requests/page load
- Cache duration: 1 hour
- **Risk:** Rate limit hit if multiple users on same network or frequent rebuilds during development

**Mitigation:**
1. Existing 1-hour cache helps significantly
2. Consider increasing cache to 24 hours for release stats (changes infrequently)
3. Document: "Stats may be stale during heavy traffic"
4. Future: Add optional GitHub token via environment variable for 5000 req/hr

**No action required for MVP.** Monitor in production.

## Sveltia CMS Configuration Updates

**Teaching collection:**
```yaml
# public/admin/config.yml additions
collections:
  - name: "teaching"
    label: "Teaching"
    folder: "src/content/teaching"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Difficulty", name: "difficulty", widget: "select",
         options: ["beginner", "intermediate", "advanced"], required: false}
      - {label: "Duration", name: "duration", widget: "string", required: false}
      - {label: "Body", name: "body", widget: "markdown"}
```

**Portfolio stats configuration:**
```yaml
collections:
  - name: "portfolio"
    # ... existing fields
    fields:
      # ... existing
      - {label: "Stats Display", name: "statsDisplay", widget: "select",
         options: ["stars", "downloads", "both", "none"], default: "both"}
      - {label: "Release Asset Pattern", name: "releaseAssetPattern",
         widget: "string", required: false,
         hint: "Regex to match specific release assets (optional)"}
```

## Testing Checklist

- [ ] Verify Shiki highlights code blocks in teaching articles
- [ ] Test copy button works across browsers
- [ ] Confirm GitHub Releases API returns download counts
- [ ] Test stats display modes: stars, downloads, both, none
- [ ] Verify theme switcher persists selection
- [ ] Test all 8 themes render correctly
- [ ] Check theme applies on initial page load
- [ ] Verify 'auto' theme respects system preference
- [ ] Test GitHub API caching (1hr TTL)
- [ ] Confirm rate limit error handling
- [ ] Verify Sveltia CMS creates teaching articles correctly
- [ ] Test teaching collection schema validation
- [ ] Check responsive layout for theme switcher
- [ ] Verify no JavaScript errors in console

## Future Enhancements (Out of Scope)

- **Runnable code widgets:** Embed sandboxed JavaScript execution (e.g., via iframe to sandpack.codesandbox.io)
- **Authenticated GitHub API:** Add optional token for higher rate limits
- **Theme preview:** Show theme samples before switching
- **Custom theme creator:** UI for users to define custom themes
- **Code diff view:** Show before/after code snippets
- **Syntax highlighting for inline code:** Currently only for code blocks

## Version Requirements

| Dependency | Current | Required For Features | Notes |
|------------|---------|----------------------|-------|
| astro | ^5.0.0 | Shiki built-in | No update needed |
| @astrojs/mdx | ^4.0.0 | Code block highlighting | No update needed |
| TypeScript | ^5.7.0 | Type safety for new features | No update needed |

**No version updates required.** All features work with existing dependencies.

## Sources

### High Confidence
- Training data: Astro 5.x built-in Shiki support (verified in Astro docs as of late 2024)
- Training data: GitHub REST API v3 endpoints for repositories and releases
- Training data: CSS custom properties browser support (100% in modern browsers)

### Medium Confidence (Training Data, Web Research Unavailable)
- Shiki configuration options in `astro.config.mjs`
- GitHub Releases API response format (assumed based on REST API v3 patterns)
- Theme color combinations (based on popular theme repositories)

### Low Confidence / Assumptions
- Exact Shiki version bundled with Astro 5.0.0 (assume latest stable)
- GitHub API rate limit details (60/hr unauthenticated is longstanding, likely unchanged)

**Note:** Web research tools (WebSearch, WebFetch) were unavailable during research. Recommendations based on training data (knowledge cutoff: January 2025). Verify Shiki configuration syntax and GitHub API response format against current official documentation before implementation.

## Confidence Assessment

| Area | Level | Reasoning |
|------|-------|-----------|
| Syntax Highlighting (Shiki) | MEDIUM | Training data shows Astro 5.x includes Shiki, but configuration syntax should be verified |
| GitHub API Integration | HIGH | REST API is stable, pattern matches existing `github-api.ts` |
| Theme System | HIGH | CSS custom properties well-understood, pattern already in use |
| Teaching Collection | HIGH | Follows established Astro content collection pattern |
| Overall | MEDIUM | Unable to verify against current docs, but recommendations based on stable APIs and existing patterns |

---

**Recommendation:** Proceed with implementation. Verify Shiki config syntax in Astro 5.x docs first. All other recommendations are low-risk extensions of existing patterns.

*Stack research for: Teaching section, code embeds, configurable stats, multi-theme CSS*
*Researched: 2026-02-16*
*Researcher: GSD Project Research Agent*
