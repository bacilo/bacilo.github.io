# Phase 17: Portfolio Enhancements - Research

**Researched:** 2026-02-17
**Domain:** Portfolio stats configuration, code embeds with syntax highlighting, widget iframes
**Confidence:** MEDIUM-HIGH

## Summary

Phase 17 enhances portfolio cards with three capabilities: (1) configurable GitHub stats display (stars/downloads via Releases API), (2) syntax-highlighted code examples, and (3) runnable widget iframes. The implementation extends existing patterns: GitHubCard component for stats, Shiki (already configured) for highlighting, and iframe embeds (similar to existing DemoEmbed/PlaygroundEmbed).

**Key finding:** Shiki is already configured in astro.config.mjs with dual-theme support (github-light/github-dark). GitHub Releases API follows the same pattern as the existing repo API. All requirements can be met by extending current architecture without new dependencies.

**Primary recommendation:** Extend GitHubCard component for configurable stats, use Astro's built-in Shiki for code blocks, and create CodePenEmbed/StackBlitzEmbed components following DemoEmbed pattern.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro 5.x | ^5.0.0 | Static site framework | Already in use, built-in Shiki support |
| Shiki | Built-in | Syntax highlighting | Bundled with Astro, VSCode-quality highlighting, build-time rendering |
| GitHub REST API v3 | N/A | Repository and release stats | Free, unauthenticated access, well-documented |
| npm Registry API | N/A | Package download stats | Public API, no authentication required |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | ^3.x | Schema validation | Extending portfolio schema for statsDisplay field |
| localStorage | Native | Client-side caching | Extending existing cache pattern for release stats |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GitHub REST API | GitHub GraphQL API | GraphQL more efficient (single query for repo+releases) but requires auth token for reasonable rate limits. REST works unauthenticated. |
| Shiki (build-time) | Prism.js (runtime) | Prism requires client-side JavaScript, increases bundle size. Shiki renders at build time with zero client JS. |
| iframe embeds | Sandpack runtime | Sandpack adds ~300KB bundle, requires React. iframes are simpler and already used in project. |

**Installation:**
```bash
# No new packages required
# All features use existing dependencies
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   └── portfolio/
│       ├── GitHubCard.astro       # MODIFY: Add statsDisplay prop, release API fetch
│       ├── CodePenEmbed.astro     # NEW: CodePen iframe embed
│       ├── StackBlitzEmbed.astro  # NEW: StackBlitz iframe embed
│       └── CodeEmbed.astro        # OPTIONAL: Custom code component with copy button
├── scripts/
│   └── github-api.ts              # MODIFY: Add fetchReleaseStats function
├── content/
│   └── portfolio/*.md             # MODIFY: Add statsDisplay, npmPackage fields
└── content.config.ts              # MODIFY: Extend portfolio schema
```

### Pattern 1: Configurable Stats Display

**What:** Portfolio cards show different GitHub stats (stars, downloads, both, or none) based on frontmatter configuration.

**When to use:** When different portfolio items need different stats emphasis.

**Example:**
```typescript
// src/content.config.ts
const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: z.object({
    title: z.string(),
    // ... existing fields
    statsDisplay: z.enum(['stars', 'downloads', 'both', 'none']).optional().default('stars'),
    npmPackage: optionalStr, // For npm download stats
  })
});
```

```astro
---
// src/components/portfolio/GitHubCard.astro
interface Props {
  repoUrl: string;
  title: string;
  description?: string;
  image?: string;
  slug?: string;
  statsDisplay?: 'stars' | 'downloads' | 'both' | 'none';  // NEW
  npmPackage?: string;  // NEW
}

const { statsDisplay = 'stars', npmPackage, ...rest } = Astro.props;
---

<div class="github-card"
     data-owner={owner}
     data-repo={repo}
     data-stats-display={statsDisplay}
     data-npm-package={npmPackage || ''}>
  <!-- skeleton wrapper -->
  <div class="content" style="display: none;">
    <!-- existing content -->
    <div class="repo-stats">
      {(statsDisplay === 'stars' || statsDisplay === 'both') && (
        <span class="stars">Stars: <span class="star-count">-</span></span>
      )}
      {(statsDisplay === 'downloads' || statsDisplay === 'both') && (
        <span class="downloads">Downloads: <span class="download-count">-</span></span>
      )}
      {statsDisplay !== 'none' && (
        <span class="language">Language: <span class="lang-value">-</span></span>
      )}
    </div>
  </div>
</div>

<script>
  import { fetchRepoData, fetchReleaseStats } from '../../scripts/github-api';

  document.addEventListener('DOMContentLoaded', async () => {
    const cards = document.querySelectorAll('.github-card');

    cards.forEach(async (card) => {
      const owner = card.getAttribute('data-owner');
      const repo = card.getAttribute('data-repo');
      const statsDisplay = card.getAttribute('data-stats-display') || 'stars';
      const npmPackage = card.getAttribute('data-npm-package');

      // ... skeleton/content elements

      try {
        // Fetch repo data if showing stars
        if (statsDisplay === 'stars' || statsDisplay === 'both') {
          const data = await fetchRepoData(owner, repo);
          if (data) {
            starsElement.textContent = data.stargazers_count.toLocaleString();
            langElement.textContent = data.language || 'N/A';
          }
        }

        // Fetch release downloads if showing downloads
        if (statsDisplay === 'downloads' || statsDisplay === 'both') {
          const releases = await fetchReleaseStats(owner, repo);
          if (releases) {
            const totalDownloads = releases.assets.reduce(
              (sum, asset) => sum + asset.download_count,
              0
            );
            downloadCountElement.textContent = totalDownloads.toLocaleString();
          }
        }
      } catch (err) {
        // ... error handling
      }

      // Show content, hide skeleton
      skeletonWrapper.style.display = 'none';
      content.style.display = 'flex';
    });
  });
</script>
```

**Source:** Based on existing GitHubCard pattern at `/src/components/portfolio/GitHubCard.astro`

### Pattern 2: GitHub Releases API Integration

**What:** Fetch release download counts from GitHub Releases API, following the same caching pattern as repo stats.

**When to use:** Portfolio items with downloadable releases (desktop apps, CLI tools, libraries).

**Example:**
```typescript
// src/scripts/github-api.ts

export interface GitHubRelease {
  tag_name: string;
  name: string | null;
  assets: Array<{
    name: string;
    download_count: number;
    size: number;
  }>;
}

interface CachedReleaseData {
  data: GitHubRelease;
  timestamp: number;
}

/**
 * Fetch latest GitHub release data with download counts
 * @param owner - GitHub username or organization
 * @param repo - Repository name
 * @returns GitHubRelease data or null if fetch fails
 */
export async function fetchReleaseStats(
  owner: string,
  repo: string
): Promise<GitHubRelease | null> {
  const cacheKey = `github-release-${owner}-${repo}`;

  // Check cache first (same pattern as fetchRepoData)
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const cachedData: CachedReleaseData = JSON.parse(cached);
      const age = Date.now() - cachedData.timestamp;
      if (age < CACHE_DURATION) {
        console.log(`[GitHub API] Using cached release data for ${owner}/${repo}`);
        return cachedData.data;
      }
    }
  } catch (err) {
    console.warn('[GitHub API] Release cache read error:', err);
  }

  // Fetch from API
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle rate limiting (same as fetchRepoData)
    if (response.status === 403 || response.status === 429) {
      const resetTime = response.headers.get('x-ratelimit-reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
      console.warn(
        `[GitHub API] Rate limited for ${owner}/${repo} releases.`,
        resetDate ? `Resets at ${resetDate.toLocaleTimeString()}` : ''
      );
      return null;
    }

    // Handle 404 (no releases)
    if (response.status === 404) {
      console.log(`[GitHub API] No releases found for ${owner}/${repo}`);
      return null;
    }

    if (!response.ok) {
      console.error(`[GitHub API] HTTP ${response.status} for ${owner}/${repo} releases`);
      return null;
    }

    const data: GitHubRelease = await response.json();

    // Update cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (err) {
      console.warn('[GitHub API] Release cache write error:', err);
    }

    return data;

  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        console.error(`[GitHub API] Timeout fetching ${owner}/${repo} releases`);
      } else {
        console.error(`[GitHub API] Error fetching ${owner}/${repo} releases:`, err.message);
      }
    }
    return null;
  }
}
```

**Source:** Pattern matches existing `fetchRepoData` function. GitHub Releases API endpoint documented at https://docs.github.com/en/rest/releases

**Confidence:** HIGH - Same architecture as existing code, well-documented API

### Pattern 3: Syntax-Highlighted Code Embeds

**What:** Display code snippets with syntax highlighting in portfolio detail pages.

**When to use:** Portfolio items that need to show code examples.

**Example:**
```markdown
<!-- src/content/portfolio/my-project.md -->
---
title: My Project
repoUrl: https://github.com/user/repo
---

Here's how to use it:

\`\`\`typescript
// Automatically highlighted by Shiki (configured in astro.config.mjs)
import { myFunction } from 'my-library';

const result = await myFunction({
  option1: 'value',
  option2: true
});
\`\`\`

The API is simple and type-safe.
```

**Astro config (already configured):**
```javascript
// astro.config.mjs (lines 10-18)
markdown: {
  shikiConfig: {
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    wrap: true,
  },
}
```

**Result:** Code blocks automatically get syntax highlighting at build time, with theme switching based on `prefers-color-scheme`.

**Optional enhancement: Copy button**
```astro
---
// src/components/portfolio/CodeEmbed.astro
interface Props {
  code: string;
  lang: string;
  title?: string;
}

const { code, lang, title } = Astro.props;
---

<div class="code-embed">
  {title && <div class="code-title">{title}</div>}
  <div class="code-container">
    <pre class="shiki"><code set:html={code} /></pre>
    <button class="copy-button" data-code={code}>Copy</button>
  </div>
</div>

<script>
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', async (e) => {
      const target = e.target as HTMLButtonElement;
      const code = target.dataset.code || '';

      try {
        await navigator.clipboard.writeText(code);
        target.textContent = 'Copied!';
        setTimeout(() => { target.textContent = 'Copy'; }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });
</script>

<style>
  .code-embed {
    position: relative;
    margin: var(--space-md) 0;
  }

  .code-title {
    background: var(--color-header-bg);
    padding: var(--space-xs) var(--space-sm);
    border: 1px solid var(--color-border);
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .code-container {
    position: relative;
  }

  .copy-button {
    position: absolute;
    top: var(--space-xs);
    right: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-header-bg);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .copy-button:hover {
    background: var(--color-link);
    color: var(--color-bg);
    border-color: var(--color-link);
  }
</style>
```

**Source:** Shiki configuration observed in `/astro.config.mjs`. Copy button pattern based on clipboard API standards.

**Confidence:** HIGH - Shiki already configured and working

### Pattern 4: Widget Iframe Embeds

**What:** Embed runnable code demos from CodePen, StackBlitz, JSFiddle, etc.

**When to use:** Portfolio items with interactive demos that benefit from runnable code.

**Example:**
```astro
---
// src/components/portfolio/CodePenEmbed.astro
interface Props {
  penId: string;
  title: string;
  height?: number;
  defaultTab?: 'html' | 'css' | 'js' | 'result';
  theme?: 'light' | 'dark';
}

const {
  penId,
  title,
  height = 500,
  defaultTab = 'result',
  theme = 'light'
} = Astro.props;

const embedUrl = `https://codepen.io/embed/${penId}?default-tab=${defaultTab}&theme-id=${theme}`;
---

<div class="codepen-embed">
  <iframe
    height={height}
    style="width: 100%;"
    scrolling="no"
    title={title}
    src={embedUrl}
    frameborder="no"
    loading="lazy"
    allowtransparency="true"
    allowfullscreen="true"
  >
    <a href={`https://codepen.io/pen/${penId}`} target="_blank" rel="noopener">
      View {title} on CodePen
    </a>
  </iframe>
</div>

<style>
  .codepen-embed {
    margin: var(--space-md) 0;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .codepen-embed iframe {
    display: block;
  }
</style>
```

```astro
---
// src/components/portfolio/StackBlitzEmbed.astro
interface Props {
  projectId: string;
  title: string;
  height?: number;
  view?: 'preview' | 'editor';
  file?: string;
}

const {
  projectId,
  title,
  height = 500,
  view = 'preview',
  file
} = Astro.props;

const params = new URLSearchParams({
  embed: '1',
  view: view,
  ...(file && { file })
});

const embedUrl = `https://stackblitz.com/edit/${projectId}?${params.toString()}`;
---

<div class="stackblitz-embed">
  <iframe
    height={height}
    style="width: 100%;"
    title={title}
    src={embedUrl}
    frameborder="0"
    loading="lazy"
    allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  >
  </iframe>
</div>

<style>
  .stackblitz-embed {
    margin: var(--space-md) 0;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .stackblitz-embed iframe {
    display: block;
  }
</style>
```

**Usage in portfolio markdown:**
```markdown
<!-- src/content/portfolio/my-widget.md -->
---
title: Interactive Widget Demo
repoUrl: https://github.com/user/widget
---

Try the interactive demo:

<CodePenEmbed
  penId="abc123"
  title="My Widget Demo"
  defaultTab="result"
/>

Or explore the code in StackBlitz:

<StackBlitzEmbed
  projectId="my-widget-demo"
  title="Widget Editor"
  view="editor"
  file="src/index.ts"
/>
```

**Source:** Pattern matches existing DemoEmbed and PlaygroundEmbed components. Embed URLs documented by CodePen and StackBlitz.

**Confidence:** HIGH - Same pattern already in use

### Anti-Patterns to Avoid

- **Don't fetch GitHub API server-side at build time (yet):** Current architecture is client-side. Changing to build-time requires environment variables and complicates deployment. Keep client-side for consistency.

- **Don't use runtime syntax highlighting:** Shiki runs at build time. Don't add Prism.js or highlight.js for runtime highlighting - increases bundle size unnecessarily.

- **Don't mix statsDisplay logic across components:** Keep all stats display logic in GitHubCard component, not in page templates.

- **Don't create separate components for each stat type:** Use conditional rendering within single component, not separate StarDisplay/DownloadDisplay components.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Syntax highlighting | Custom regex-based highlighter | Shiki (built-in) | Edge cases, language support, theme support |
| Code execution sandbox | eval() or new Function() | iframe embeds to CodePen/StackBlitz | Security (CSP violations, XSS), complexity |
| Download count aggregation | Scraping GitHub releases page | GitHub Releases API | Rate limits, reliability, official API |
| Markdown code block rendering | Custom parser | Astro's built-in markdown processing | Already handles code fences with Shiki |

**Key insight:** GitHub provides official APIs for all stats. Code execution is complex and security-sensitive - use established platforms.

## Common Pitfalls

### Pitfall 1: GitHub API Rate Limiting

**What goes wrong:** Adding Releases API doubles the API calls per portfolio card (repo + releases = 2 calls). With 10 portfolio items, that's 20 calls per page load. GitHub's unauthenticated limit is 60 calls/hour per IP. Multiple visitors from same network (office, university) can exhaust limit quickly.

**Why it happens:** Current implementation fetches client-side with 1-hour cache. Each new visitor or cache expiration triggers API calls.

**How to avoid:**
1. **Immediate:** Keep 1-hour cache, it helps significantly
2. **Medium-term:** Add check for statsDisplay - only fetch releases if `statsDisplay` includes 'downloads'
3. **Long-term (if rate limits become issue):** Move to build-time fetching with GitHub token in environment variables

**Warning signs:**
- HTTP 403 responses with `x-ratelimit-remaining: 0` header
- Console logs: "Rate limited for owner/repo"
- Stats showing "Unable to load stats" frequently

### Pitfall 2: Stats Display Configuration Complexity

**What goes wrong:** Supporting 4 states (stars/downloads/both/none) across multiple data sources (repo API, releases API, npm API) creates combinatorial complexity. Code becomes nested conditionals that are hard to maintain.

**Why it happens:** Each portfolio item might need different stats. Initial implementation tries to support every combination.

**How to avoid:**
1. Start simple: Support only 'stars' and 'both' initially
2. Use data attributes for configuration, not complex props
3. Keep conditional logic flat, not nested
4. Add download stats only to items that actually have releases

**Warning signs:**
- Deeply nested if statements in component scripts
- Difficulty adding new stat types
- Different portfolio items showing inconsistent stat layouts

### Pitfall 3: Code Embed Widget Security

**What goes wrong:** Implementing "runnable code" by executing user-provided code with `eval()` or `new Function()` creates XSS vulnerabilities and violates Content Security Policy.

**Why it happens:** Wanting to show executable code examples without using external platforms.

**How to avoid:**
1. **Never use eval() or new Function() with user content**
2. Use iframe embeds to CodePen/StackBlitz (sandboxed)
3. If building custom runner, use Web Workers with strict CSP
4. Prefer external platforms - they handle security, you focus on content

**Warning signs:**
- CSP errors in browser console
- Security audit failures
- Inability to execute code due to CSP

### Pitfall 4: Shiki Theme Mismatch with Site Theme

**What goes wrong:** Code blocks use fixed Shiki theme (e.g., github-dark) but site has multiple themes. User selects light theme, code blocks stay dark = poor contrast.

**Why it happens:** Shiki configuration is build-time, can't dynamically change based on user's theme selection.

**How to avoid:**
1. **Current config already handles this:** Uses dual themes (github-light/github-dark) that switch based on `prefers-color-scheme`
2. If adding manual theme switcher in future Phase 16, ensure it also sets `prefers-color-scheme` via JavaScript
3. Or: Use theme-neutral code highlighting (min-light/min-dark)

**Warning signs:**
- Code blocks unreadable in certain themes
- User complaints about contrast
- Code highlighting doesn't match site theme

## Code Examples

### Example 1: Extending Portfolio Schema

```typescript
// src/content.config.ts
const optionalUrl = z.preprocess(v => v === '' ? undefined : v, z.string().url().optional());
const optionalStr = z.preprocess(v => v === '' ? undefined : v, z.string().optional());

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: z.object({
    title: z.string(),
    excerpt: optionalStr,
    image: optionalStr,
    collection: z.literal('portfolio').optional(),
    repoUrl: optionalUrl,
    demoUrl: optionalUrl,
    description: optionalStr,
    playgroundUrl: optionalUrl,
    // NEW FIELDS for Phase 17
    statsDisplay: z.enum(['stars', 'downloads', 'both', 'none']).optional().default('stars'),
    npmPackage: optionalStr, // For future npm download stats
    codepenId: optionalStr, // For CodePen embeds
    stackblitzId: optionalStr, // For StackBlitz embeds
  })
});
```

**Source:** Extends existing schema at `/src/content.config.ts` lines 45-57

### Example 2: CMS Configuration Update

```yaml
# public/admin/config.yml
- name: portfolio
  label: "Portfolio"
  folder: "src/content/portfolio"
  create: true
  delete: true
  slug: "{{slug}}"
  # Schema mirrors src/content.config.ts -- update both when changing fields
  fields:
    - { label: "Title", name: "title", widget: "string", required: true }
    - { label: "Excerpt", name: "excerpt", widget: "text", required: false }
    - { label: "Image", name: "image", widget: "image", required: false }
    - { label: "Collection", name: "collection", widget: "hidden", default: "portfolio" }
    - { label: "Repository URL", name: "repoUrl", widget: "string", required: false }
    - { label: "Demo URL", name: "demoUrl", widget: "string", required: false }
    - { label: "Description", name: "description", widget: "text", required: false }
    - { label: "Playground URL", name: "playgroundUrl", widget: "string", required: false }
    # NEW FIELDS for Phase 17
    - label: "Stats Display"
      name: "statsDisplay"
      widget: "select"
      options: ["stars", "downloads", "both", "none"]
      default: "stars"
      required: false
      hint: "Which GitHub stats to display on the portfolio card"
    - label: "npm Package Name"
      name: "npmPackage"
      widget: "string"
      required: false
      hint: "For npm download stats (e.g., 'my-package')"
    - label: "CodePen ID"
      name: "codepenId"
      widget: "string"
      required: false
      hint: "CodePen pen ID for embedded demo (e.g., 'abc123')"
    - label: "StackBlitz Project ID"
      name: "stackblitzId"
      widget: "string"
      required: false
      hint: "StackBlitz project ID for embedded editor (e.g., 'my-project')"
    - { label: "Body", name: "body", widget: "markdown", required: true }
```

**Source:** Extends existing CMS config at `/public/admin/config.yml` lines 115-131

### Example 3: Portfolio Index Page Usage

```astro
---
// src/pages/portfolio/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import GitHubCard from '../../components/portfolio/GitHubCard.astro';
import DemoEmbed from '../../components/portfolio/DemoEmbed.astro';
import PlaygroundEmbed from '../../components/portfolio/PlaygroundEmbed.astro';
import CodePenEmbed from '../../components/portfolio/CodePenEmbed.astro'; // NEW
import StackBlitzEmbed from '../../components/portfolio/StackBlitzEmbed.astro'; // NEW

const portfolio = await getCollection('portfolio');
const sortedPortfolio = portfolio.sort((a, b) => a.data.title.localeCompare(b.data.title));
---

<BaseLayout title="Portfolio - Pedro Ferreira">
  <h1>Portfolio</h1>
  <p class="intro">Projects and experiments</p>

  <ul class="portfolio-grid">
    {sortedPortfolio.map(project => (
      project.data.repoUrl?.includes('github.com') ? (
        <li class="portfolio-item">
          <GitHubCard
            repoUrl={project.data.repoUrl}
            title={project.data.title}
            description={project.data.description || project.data.excerpt}
            image={project.data.image}
            slug={project.id}
            statsDisplay={project.data.statsDisplay}  // NEW
            npmPackage={project.data.npmPackage}  // NEW
          />
          {project.data.demoUrl && (
            <DemoEmbed
              src={project.data.demoUrl}
              title={`${project.data.title} Demo`}
            />
          )}
          {project.data.playgroundUrl && (
            <PlaygroundEmbed
              url={project.data.playgroundUrl}
              title={`${project.data.title} Playground`}
            />
          )}
          {/* NEW: CodePen embed */}
          {project.data.codepenId && (
            <CodePenEmbed
              penId={project.data.codepenId}
              title={`${project.data.title} Demo`}
              defaultTab="result"
            />
          )}
          {/* NEW: StackBlitz embed */}
          {project.data.stackblitzId && (
            <StackBlitzEmbed
              projectId={project.data.stackblitzId}
              title={`${project.data.title} Editor`}
              view="preview"
            />
          )}
        </li>
      ) : (
        <!-- non-GitHub portfolio item -->
      )
    ))}
  </ul>
</BaseLayout>
```

**Source:** Extends existing portfolio index at `/src/pages/portfolio/index.astro`

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Runtime syntax highlighting (Prism.js) | Build-time highlighting (Shiki) | Astro 2.0+ (2023) | Zero client JS for highlighting, faster page loads |
| Single theme code highlighting | Dual-theme with media query | Shiki 0.9+ (2022) | Automatic dark mode support |
| GitHub API v2 | GitHub REST API v3 | 2014 | Better rate limits, more reliable |
| Client-side markdown parsing | Server-side Astro markdown | Astro architecture | Smaller bundles, better SEO |

**Deprecated/outdated:**
- Prism.js for Astro sites: Shiki is now standard, built-in since Astro 2.0
- highlight.js: Same reason as Prism, Shiki is superior for static sites
- CodeSandbox embed API v1: v2 has better performance and features
- npm API download stats via scraping: Official API available since 2015

## Open Questions

1. **npm download stats implementation**
   - What we know: npm has public API at `https://api.npmjs.org/downloads/point/last-month/{package}`
   - What's unclear: Whether to implement now or defer (requirement STAT-02 mentions Releases API, not npm)
   - Recommendation: Implement GitHub Releases downloads first, add npm stats later if needed

2. **Widget embed default tab preference**
   - What we know: CodePen and StackBlitz support multiple views (code, preview, console)
   - What's unclear: What default makes sense for academic portfolio (showcase result vs. show code)
   - Recommendation: Default to 'result' for CodePen, 'preview' for StackBlitz; make configurable

3. **Code highlighting language detection**
   - What we know: Shiki supports 100+ languages, requires explicit language in code fence
   - What's unclear: Should portfolio detail pages support language auto-detection?
   - Recommendation: Require explicit language (```typescript, ```python, etc.) for clarity

4. **Releases API asset filtering**
   - What we know: Releases can have multiple assets (Windows .exe, Mac .dmg, Linux .AppImage)
   - What's unclear: Should we sum all downloads or filter by pattern?
   - Recommendation: Sum all downloads by default, add optional `assetPattern` field later if needed

## Sources

### Primary (HIGH confidence)

- **Existing codebase:**
  - `/src/components/portfolio/GitHubCard.astro` - Stats display pattern
  - `/src/scripts/github-api.ts` - API fetching and caching pattern
  - `/src/content.config.ts` - Schema definition pattern
  - `/public/admin/config.yml` - CMS configuration pattern
  - `/astro.config.mjs` - Shiki already configured with dual themes

- **Training data (verified against codebase):**
  - GitHub REST API v3 documentation (stable since 2014)
  - Shiki syntax highlighting (built into Astro 5.x)
  - CodePen embed API (documented at codepen.io/documentation/embedding)
  - StackBlitz embed API (documented at stackblitz.com/docs/platform/embedding)

### Secondary (MEDIUM confidence)

- **Training data (unable to verify externally):**
  - GitHub Releases API endpoint structure (assumed consistent with repos API)
  - npm Registry API for download stats (public API, no auth required)
  - Clipboard API for copy button (standard browser API)

### Tertiary (LOW confidence)

- None - all recommendations based on HIGH or MEDIUM sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies already in project or built-in
- Architecture patterns: HIGH - Extends existing patterns observed in codebase
- GitHub Releases API: MEDIUM-HIGH - API structure assumed from REST v3 patterns, needs verification
- Code highlighting: HIGH - Shiki already configured and working
- Widget embeds: HIGH - Pattern matches existing DemoEmbed/PlaygroundEmbed

**Research date:** 2026-02-17
**Valid until:** 30 days (stable dependencies, well-established APIs)

**Key files analyzed:**
- `/src/components/portfolio/GitHubCard.astro` (183 lines)
- `/src/scripts/github-api.ts` (96 lines)
- `/src/content.config.ts` (67 lines)
- `/src/pages/portfolio/index.astro` (171 lines)
- `/astro.config.mjs` (20 lines)
- `/public/admin/config.yml` (132 lines)

**Assumptions requiring verification:**
1. GitHub Releases API response format matches training data
2. npm Registry API still public and unauthenticated
3. CodePen/StackBlitz embed URLs haven't changed

**Recommended verification steps for planner:**
1. Test GitHub Releases API call in browser: `fetch('https://api.github.com/repos/bacilo/pomodoro-mac/releases/latest')`
2. Verify npm API: `fetch('https://api.npmjs.org/downloads/point/last-month/react')`
3. Confirm Shiki themes render correctly with existing config
4. Test iframe embeds with sample CodePen/StackBlitz URLs
