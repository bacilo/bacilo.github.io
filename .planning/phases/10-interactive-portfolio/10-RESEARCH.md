# Phase 10: Interactive Portfolio - Research

**Researched:** 2026-02-12
**Domain:** GitHub API integration, iframe embeds, code playground embeds
**Confidence:** HIGH

## Summary

Phase 10 enhances the existing static portfolio with three interactive features: (1) GitHub API integration to fetch and display repo metadata (stars, language, description), (2) live demo embeds via iframes, and (3) code playground embeds for interactive examples. The technical implementation requires client-side fetching with proper error handling, lazy loading for performance, responsive iframe patterns, and security considerations via CSP and iframe sandbox attributes.

**Current state:** Phase 9 established the portfolio structure with `/portfolio/` page, CSS Grid layout, and portfolio items with `repoUrl` and `demoUrl` fields. Phase 10 layers interactivity on this foundation.

**Primary recommendation:** Use client-side GitHub API fetching with error boundaries, implement native iframe `loading="lazy"` with CSS `aspect-ratio` for responsive embeds, support CodePen and StackBlitz as primary playground platforms, and handle edge cases (API rate limits, network failures, loading states) explicitly.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GitHub REST API | v3 | Fetch repository metadata | Official GitHub API, universally supported, 60 req/hour unauthenticated |
| Native Fetch API | ES2015+ | HTTP requests | Built into browsers, no dependencies, works with Astro SSG |
| Intersection Observer API | ES2017+ | Lazy load detection | Native browser API, excellent support, replaces scroll listeners |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CodePen oEmbed | Current | Embed code playgrounds | Best for quick UI demos, widespread recognition |
| StackBlitz Embed | Current | Embed full dev environments | Best for framework examples (React, Angular), full IDE |
| JSFiddle Embed | Current | Embed code snippets | Alternative to CodePen, similar features |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Client-side fetch | Build-time fetch with cache | Build-time = faster page load but stale data; client-side = always fresh but API limits |
| Native lazy loading | Intersection Observer polyfill | Native `loading="lazy"` simpler but less control; IO API = full control, extra code |
| CodePen | CodeSandbox | CodeSandbox better for full apps; CodePen better for focused demos |

**Installation:**
```bash
# No npm packages needed - all native browser APIs
# Optional: TypeScript types for GitHub API
npm install --save-dev @octokit/types
```

## Architecture Patterns

### Recommended Component Structure
```
src/
├── components/
│   ├── portfolio/
│   │   ├── GitHubCard.astro        # Fetches and displays repo data
│   │   ├── DemoEmbed.astro         # Iframe wrapper with lazy loading
│   │   ├── PlaygroundEmbed.astro   # Code playground iframe
│   │   └── SkeletonCard.astro      # Loading placeholder
├── scripts/
│   └── github-api.ts               # GitHub API fetch logic
└── pages/
    └── portfolio/
        └── index.astro             # Updated with interactive cards
```

### Pattern 1: Client-Side GitHub API Fetch with Error Handling
**What:** Fetch GitHub repo data on page load, handle rate limits and network errors gracefully
**When to use:** For dynamic data that changes frequently (stars, language stats)

**Example:**
```typescript
// src/scripts/github-api.ts
// Based on: GitHub REST API docs and rate limit best practices

interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

async function fetchRepoData(owner: string, repo: string): Promise<GitHubRepo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    // AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    clearTimeout(timeoutId);

    // Handle rate limiting
    if (response.status === 403 || response.status === 429) {
      const resetTime = response.headers.get('x-ratelimit-reset');
      console.warn('GitHub API rate limit exceeded', { resetTime });
      return null;
    }

    if (!response.ok) {
      console.error('GitHub API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('GitHub API request timed out');
    } else {
      console.error('Network error fetching GitHub data:', error);
    }
    return null;
  }
}

export { fetchRepoData };
```

### Pattern 2: Responsive Iframe with Lazy Loading
**What:** Embed iframes that load only when visible, maintain aspect ratio on all screens
**When to use:** For live demos, code playgrounds, external content

**Example:**
```astro
---
// src/components/portfolio/DemoEmbed.astro
// Source: MDN iframe docs + CSS aspect-ratio spec

interface Props {
  src: string;
  title: string;
  aspectRatio?: string; // e.g., "16/9"
}

const { src, title, aspectRatio = "16/9" } = Astro.props;
---

<div class="demo-embed-container">
  <iframe
    src={src}
    title={title}
    loading="lazy"
    sandbox="allow-scripts allow-same-origin"
    class="demo-iframe"
  ></iframe>
</div>

<style define:vars={{ aspectRatio }}>
  .demo-embed-container {
    width: 100%;
    aspect-ratio: var(--aspectRatio);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .demo-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  /* Mobile: adjust aspect ratio for better viewing */
  @media (max-width: 768px) {
    .demo-embed-container {
      aspect-ratio: 1 / 1;
    }
  }
</style>
```

### Pattern 3: Code Playground Embed with Platform Detection
**What:** Support multiple playground platforms (CodePen, StackBlitz, JSFiddle) with consistent UI
**When to use:** For interactive code examples in portfolio items

**Example:**
```astro
---
// src/components/portfolio/PlaygroundEmbed.astro
// Source: CodePen, StackBlitz, JSFiddle embed docs

interface Props {
  url: string;
  title: string;
}

const { url, title } = Astro.props;

// Detect platform from URL
const isCodePen = url.includes('codepen.io');
const isStackBlitz = url.includes('stackblitz.com');
const isJSFiddle = url.includes('jsfiddle.net');

// Transform URL to embed format
let embedUrl = url;
if (isCodePen && !url.includes('/embed/')) {
  // Transform https://codepen.io/user/pen/abc123
  // to https://codepen.io/user/embed/abc123
  embedUrl = url.replace('/pen/', '/embed/');
}
if (isStackBlitz && !url.includes('?embed=1')) {
  embedUrl = `${url}?embed=1&hideExplorer=1&view=preview`;
}
if (isJSFiddle && !url.includes('/embedded/')) {
  embedUrl = `${url}/embedded/result,js,html,css/`;
}
---

<div class="playground-embed">
  <iframe
    src={embedUrl}
    title={title}
    loading="lazy"
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    class="playground-iframe"
  ></iframe>
</div>

<style>
  .playground-embed {
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    background: var(--color-header-bg);
  }

  .playground-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  @media (max-width: 768px) {
    .playground-embed {
      aspect-ratio: 4 / 3;
    }
  }
</style>
```

### Pattern 4: Skeleton Loading for GitHub Cards
**What:** Show placeholder UI while fetching GitHub data
**When to use:** Always, to improve perceived performance

**Example:**
```astro
---
// src/components/portfolio/SkeletonCard.astro
// Source: Skeleton loading best practices from NN/G
---

<div class="skeleton-card" aria-busy="true" aria-live="polite">
  <div class="skeleton-title"></div>
  <div class="skeleton-description"></div>
  <div class="skeleton-stats">
    <div class="skeleton-stat"></div>
    <div class="skeleton-stat"></div>
  </div>
</div>

<style>
  .skeleton-card {
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: var(--space-md);
    background: var(--color-header-bg);
  }

  .skeleton-title,
  .skeleton-description,
  .skeleton-stat {
    background: linear-gradient(
      90deg,
      var(--color-border) 0%,
      var(--color-bg) 50%,
      var(--color-border) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }

  .skeleton-title {
    height: 1.5rem;
    width: 60%;
    margin-bottom: var(--space-sm);
  }

  .skeleton-description {
    height: 3rem;
    width: 100%;
    margin-bottom: var(--space-sm);
  }

  .skeleton-stats {
    display: flex;
    gap: var(--space-sm);
  }

  .skeleton-stat {
    height: 1.25rem;
    width: 4rem;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
```

### Anti-Patterns to Avoid

- **Don't retry 403 errors**: 403 means forbidden - retrying won't help. Only retry 429 (rate limit) and network failures
- **Don't use `allow-scripts` + `allow-same-origin` together**: This allows embedded content to remove sandbox restrictions entirely - security risk
- **Don't fetch GitHub data at build time for static sites**: Data becomes stale immediately. Either fetch client-side or accept staleness with scheduled rebuilds
- **Don't use padding-bottom hack for aspect ratio**: Modern CSS `aspect-ratio` property is simpler and more maintainable (2026 browser support is universal)
- **Don't block rendering on GitHub API**: Always show portfolio structure immediately, lazy load API data asynchronously

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GitHub API client | Custom fetch wrapper with auth, pagination, caching | Native fetch + error handling OR @octokit/rest | Edge cases: rate limit headers, pagination links, auth token refresh, CORS handling already solved |
| Lazy loading detection | Scroll event listeners with debouncing | Intersection Observer API | Scroll events = performance killer, complex debounce logic; IO API = efficient, simpler, native |
| Retry logic with backoff | Custom setTimeout recursion | Promise-based retry with exponential backoff pattern | Edge cases: max retries, jitter to prevent thundering herd, cancellation |
| Iframe responsive sizing | JavaScript resize listeners | CSS `aspect-ratio` property | JS approach = brittle, performance overhead; CSS = declarative, performant, SSR-compatible |
| Code playground embeds | Custom code editor (Monaco, CodeMirror) | CodePen/StackBlitz/JSFiddle embeds | Building a code editor = massive scope (syntax highlighting, execution, security sandboxing, package management) |

**Key insight:** GitHub API integration and iframe embeds have subtle edge cases (rate limiting, security, performance) that are easy to get wrong. Use proven patterns and native APIs rather than custom solutions.

## Common Pitfalls

### Pitfall 1: Hitting GitHub API Rate Limits
**What goes wrong:** Unauthenticated requests limited to 60/hour per IP. On a portfolio page with 5 repos, each visitor consumes 5 requests. With 12+ visitors per hour, API stops working.

**Why it happens:** GitHub enforces strict rate limits on unauthenticated requests to prevent abuse. Single-page applications can quickly exhaust limits.

**How to avoid:**
1. **Cache API responses client-side**: Use `localStorage` with timestamp, cache for 1 hour
2. **Check rate limit headers**: Read `x-ratelimit-remaining` and `x-ratelimit-reset` from response headers
3. **Graceful degradation**: Show repo URL as fallback when API unavailable
4. **Consider build-time fetching**: For static sites updated infrequently, fetch at build time and accept stale data

**Warning signs:**
- Console errors: 403 or 429 status codes
- Empty GitHub cards after some page views
- Response headers show `x-ratelimit-remaining: 0`

### Pitfall 2: Iframe Security Vulnerabilities
**What goes wrong:** Embedded content executes malicious JavaScript, accesses parent page DOM, or navigates top-level window without user consent.

**Why it happens:** Iframes without `sandbox` attribute have full capabilities. Combining `allow-scripts` and `allow-same-origin` allows embedded code to remove sandbox entirely.

**How to avoid:**
1. **Always use sandbox attribute**: Start restrictive, add permissions as needed
2. **Never combine `allow-scripts` + `allow-same-origin`**: This defeats sandbox security
3. **Set CSP frame-src directive**: Whitelist allowed iframe sources
4. **For untrusted content**: Use minimal permissions: `sandbox="allow-scripts"` only

**Warning signs:**
- Embedded content can access `window.parent`
- Top-level navigation changes unexpectedly
- Console security warnings about sandbox

### Pitfall 3: Poor Mobile UX for Embeds
**What goes wrong:** Iframes are too small on mobile, aspect ratios look stretched, interactive elements are too small to tap.

**Why it happens:** Desktop-optimized 16:9 aspect ratios waste vertical space on narrow mobile screens. Fixed pixel heights don't adapt.

**How to avoid:**
1. **Use CSS `aspect-ratio` with media queries**: Change ratio on mobile (e.g., 16:9 desktop → 4:3 or 1:1 mobile)
2. **Test tap targets**: Ensure buttons/links in embeds are 44×44px minimum
3. **Consider hiding embeds on mobile**: Provide "View Demo" link instead for complex embeds
4. **Lazy load aggressively**: Mobile users on slow networks - every byte counts

**Warning signs:**
- Horizontal scrolling on mobile
- Tiny, untappable controls in embeds
- Excessive vertical whitespace around embeds

### Pitfall 4: Blocking Page Render on API Calls
**What goes wrong:** Portfolio page shows blank or incomplete content while waiting for GitHub API responses.

**Why it happens:** Synchronous or poorly structured async code blocks rendering until all data fetches complete.

**How to avoid:**
1. **Render skeleton UI immediately**: Show loading placeholders, populate data asynchronously
2. **Use client-side hydration**: Astro renders static HTML, JavaScript enhances with API data
3. **Set reasonable timeouts**: 5 seconds max, then show fallback
4. **Progressive enhancement**: Portfolio works without JavaScript, API data enhances experience

**Warning signs:**
- Long First Contentful Paint (FCP) times
- Users see blank cards for several seconds
- Page content appears all at once after delay

### Pitfall 5: CORS and Network Error Handling
**What goes wrong:** GitHub API calls fail due to CORS issues, network timeouts, or browser extensions blocking requests. Users see empty portfolio cards with no error message.

**Why it happens:** Fetch requests can fail for many reasons beyond your control. Without explicit error handling, failures are silent.

**How to avoid:**
1. **Wrap fetch in try/catch**: Handle network errors explicitly
2. **Use AbortController for timeouts**: Set 5-second timeout, abort request if exceeded
3. **Check response.ok**: HTTP errors (404, 500) don't throw in fetch
4. **Show user-friendly error messages**: "Unable to load repo data" with fallback to repo URL
5. **Log errors for debugging**: Console.warn rate limit info, console.error for unexpected failures

**Warning signs:**
- Console shows uncaught promise rejections
- Network tab shows failed requests with no error handling
- Users report empty cards with no explanation

## Code Examples

Verified patterns from official sources:

### GitHub API Fetch with Rate Limit Handling
```typescript
// Source: GitHub REST API docs - Rate Limits
// https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api

async function fetchRepoWithRateLimit(owner: string, repo: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    // Check rate limit headers
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');

    if (response.status === 403 || response.status === 429) {
      const resetDate = reset ? new Date(parseInt(reset) * 1000) : null;
      console.warn(`Rate limit exceeded. Resets at ${resetDate?.toLocaleTimeString()}`);
      return null;
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Failed to fetch repo data:', error);
    return null;
  }
}
```

### Responsive Iframe with Modern CSS
```html
<!-- Source: MDN - iframe element docs + CSS aspect-ratio property -->
<!-- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe -->
<!-- https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio -->

<style>
  .embed-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    overflow: hidden;
  }

  .embed-container iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  @media (max-width: 768px) {
    .embed-container {
      aspect-ratio: 4 / 3;
    }
  }
</style>

<div class="embed-container">
  <iframe
    src="https://example.com/demo"
    title="Live Demo"
    loading="lazy"
    sandbox="allow-scripts allow-same-origin"
  ></iframe>
</div>
```

### CodePen Embed URL
```html
<!-- Source: CodePen embedding documentation -->
<!-- Transform: https://codepen.io/username/pen/ABC123 -->
<!-- To: https://codepen.io/username/embed/ABC123?default-tab=result -->

<iframe
  src="https://codepen.io/username/embed/ABC123?default-tab=result&theme=dark"
  title="CodePen Example"
  loading="lazy"
  sandbox="allow-scripts allow-same-origin allow-forms"
  style="width: 100%; aspect-ratio: 16/9; border: none;"
></iframe>
```

### StackBlitz Embed URL
```html
<!-- Source: StackBlitz embedding guide -->
<!-- https://developer.stackblitz.com/guides/integration/embedding -->

<iframe
  src="https://stackblitz.com/edit/angular?embed=1&hideExplorer=1&view=preview&theme=dark"
  title="StackBlitz Demo"
  loading="lazy"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  style="width: 100%; aspect-ratio: 16/9; border: none;"
></iframe>
```

### JSFiddle Embed URL
```html
<!-- Source: JSFiddle embedding documentation -->
<!-- https://docs.jsfiddle.net/embedding-fiddles -->
<!-- Transform: https://jsfiddle.net/user/abc123/ -->
<!-- To: https://jsfiddle.net/user/abc123/embedded/result,js,html,css/ -->

<iframe
  src="https://jsfiddle.net/user/abc123/embedded/result,js,html,css/"
  title="JSFiddle Example"
  loading="lazy"
  sandbox="allow-scripts allow-same-origin"
  style="width: 100%; aspect-ratio: 16/9; border: none;"
></iframe>
```

### Client-Side Data Fetching in Astro
```astro
---
// src/components/portfolio/GitHubCard.astro
// Source: Astro data fetching docs + GitHub API
interface Props {
  repoUrl: string;
  title: string;
}

const { repoUrl, title } = Astro.props;

// Parse owner/repo from URL
const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
const [, owner, repo] = match || [];
---

<div class="github-card" data-owner={owner} data-repo={repo}>
  <div class="skeleton">
    <div class="skeleton-title"></div>
    <div class="skeleton-desc"></div>
  </div>
  <div class="content" style="display: none;">
    <h3 class="repo-name">{title}</h3>
    <p class="repo-desc"></p>
    <div class="repo-stats">
      <span class="stars">⭐ <span class="star-count">0</span></span>
      <span class="language"></span>
    </div>
    <a href={repoUrl} class="repo-link">View on GitHub</a>
  </div>
</div>

<script>
  // This runs client-side after page load
  import { fetchRepoData } from '../scripts/github-api';

  document.addEventListener('DOMContentLoaded', async () => {
    const cards = document.querySelectorAll('.github-card');

    for (const card of cards) {
      const owner = card.getAttribute('data-owner');
      const repo = card.getAttribute('data-repo');

      if (!owner || !repo) continue;

      const data = await fetchRepoData(owner, repo);

      // Hide skeleton, show content
      const skeleton = card.querySelector('.skeleton');
      const content = card.querySelector('.content');

      if (data) {
        // Populate with API data
        content.querySelector('.repo-desc').textContent = data.description || 'No description';
        content.querySelector('.star-count').textContent = data.stargazers_count.toLocaleString();
        content.querySelector('.language').textContent = data.language || 'Unknown';
      } else {
        // Fallback: show basic card
        content.querySelector('.repo-desc').textContent = 'Unable to load repo data';
      }

      skeleton.style.display = 'none';
      content.style.display = 'block';
    }
  });
</script>

<style>
  /* Skeleton and card styles omitted for brevity */
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Padding-bottom hack for aspect ratio | CSS `aspect-ratio` property | 2021 (widely supported 2023+) | Simpler, more maintainable responsive iframe code |
| Scroll event listeners for lazy loading | Intersection Observer API | 2017 (IE11 polyfill needed until 2022) | Better performance, cleaner code, native browser support |
| Inline script/style with CSP unsafe-inline | Hash-based CSP with Astro auto-generation | 2024 (Astro 5.9+) | Improved security without manual hash management |
| Build-time GitHub data fetching | Client-side fetch with caching | Ongoing trend | Always fresh data vs. stale but faster initial load - choose based on needs |
| CodeSandbox/Repl.it for embeds | CodePen/StackBlitz dominance | 2023-2026 | CodePen = quick demos, StackBlitz = framework-heavy projects |
| fetch() timeout with Promise.race() | AbortController with signal | 2018+ (universal support 2021) | More idiomatic, better cancellation semantics |

**Deprecated/outdated:**
- **jQuery lazy loading plugins**: Native `loading="lazy"` and Intersection Observer API replaced jQuery-dependent solutions
- **JSONP for GitHub API**: CORS is fully supported, JSONP is deprecated and insecure
- **IE11 polyfills for Intersection Observer**: IE11 end-of-life (June 2022) means polyfills no longer needed for modern sites
- **Inline event handlers (onclick, etc.)**: CSP best practices require script tags or event listeners, not inline handlers

## Open Questions

1. **Should we cache GitHub API responses in localStorage?**
   - What we know: Client-side caching reduces API calls, improves performance, stays within rate limits
   - What's unclear: Cache invalidation strategy - 1 hour? 24 hours? Manual clear?
   - Recommendation: Start with 1-hour cache TTL, log cache hits/misses to tune based on actual usage

2. **Do we need authenticated GitHub API requests?**
   - What we know: Authenticated requests get 5,000 req/hour vs. 60 unauthenticated
   - What's unclear: Security implications of exposing personal access token in client-side code (even with fine-grained permissions)
   - Recommendation: Start unauthenticated with caching. If rate limits are hit frequently, consider serverless function proxy with authenticated requests

3. **Should we provide iframe fallbacks for browsers with JavaScript disabled?**
   - What we know: Astro SSG renders static HTML, JavaScript enhances; iframes work without JS
   - What's unclear: User impact - how many visitors have JS disabled? Is extra markup worth it?
   - Recommendation: Yes for iframe embeds (they work without JS), no for GitHub cards (show static repo URL link as fallback)

4. **Do we need a Content Security Policy for iframe sources?**
   - What we know: CSP `frame-src` directive whitelists allowed iframe domains, improves security
   - What's unclear: Astro static site deployment on GitHub Pages - can we set custom headers via `_headers` file?
   - Recommendation: Research Astro 5.11+ experimental CSP support; if not available, use meta tag CSP (limited but better than nothing)

5. **Should we support additional playground platforms (CodeSandbox, Glitch)?**
   - What we know: CodePen/StackBlitz/JSFiddle cover most use cases
   - What's unclear: User preference - do portfolio visitors expect CodeSandbox embeds?
   - Recommendation: Start with CodePen + StackBlitz. Add others only if user explicitly wants to embed from those platforms

## Sources

### Primary (HIGH confidence)
- [GitHub REST API - Repositories](https://docs.github.com/en/rest/repos/repos) - Endpoint structure, response fields
- [GitHub REST API - Rate Limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) - 60 req/hour unauthenticated, rate limit headers
- [MDN - iframe element](https://developer.mozilla.org/en/docs/Web/HTML/Element/iframe) - loading, sandbox, security attributes
- [MDN - CSS aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) - Responsive sizing pattern
- [MDN - Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - Lazy loading detection
- [StackBlitz Embedding Guide](https://developer.stackblitz.com/guides/integration/embedding) - URL parameters, customization
- [JSFiddle Embedding Documentation](https://docs.jsfiddle.net/embedding-fiddles) - Embed format, tab options

### Secondary (MEDIUM confidence)
- [Astro Data Fetching Docs](https://docs.astro.build/en/guides/data-fetching/) - SSR vs. client-side patterns (verified with official Astro docs)
- [GitHub CORS Support](https://docs.github.com/en/rest/using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests) - CORS headers, JSONP deprecation (official GitHub docs)
- [Astro CSP Support](https://docs.astro.build/en/reference/experimental-flags/csp/) - Experimental CSP feature (official docs, marked experimental)
- [iframe lazy loading article](https://web.dev/articles/iframe-lazy-loading) - Browser support, performance benefits (verified with Can I Use)
- [CSS aspect-ratio guide](https://benmarshall.me/responsive-iframes/) - Modern responsive iframe pattern (verified with MDN)

### Tertiary (LOW confidence - needs validation)
- [CodePen oEmbed](https://iframely.com/domains/codepen) - Third-party embed generator docs
- [SitePoint code playgrounds comparison](https://www.sitepoint.com/code-playgrounds/) - Platform comparison
- [Complete Guide to API Rate Limits](https://www.ayrshare.com/complete-guide-to-handling-rate-limits-prevent-429-errors/) - Retry logic patterns

## Metadata

**Confidence breakdown:**
- GitHub API integration: HIGH - Official GitHub docs, clear rate limits, CORS support documented
- Iframe embeds: HIGH - MDN docs, native browser APIs, CSS aspect-ratio widely supported in 2026
- Code playgrounds: MEDIUM - Platform-specific docs verified, but embed URL formats may change
- Security (CSP, sandbox): MEDIUM - Best practices well-documented, but Astro static site CSP implementation needs verification
- Mobile UX patterns: HIGH - Aspect ratio media queries, lazy loading, responsive design are standard

**Research date:** 2026-02-12
**Valid until:** ~2026-04-12 (60 days for stable APIs, 30 days for playground embed formats)

**Key assumptions:**
1. Portfolio items will have GitHub repo URLs - if not, GitHub card feature is not applicable
2. Users want live, current GitHub stats (stars, language) - if stale data is acceptable, build-time fetching is simpler
3. Playground embeds are optional enhancements - portfolio works without them
4. Site is deployed as static site (GitHub Pages, Netlify, Vercel) - SSR changes architecture significantly
5. Target audience has modern browsers (2023+) - IE11 compatibility not required
