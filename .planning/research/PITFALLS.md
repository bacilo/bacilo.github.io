# Domain Pitfalls: Adding Advanced Features to Astro Academic Website

**Domain:** Academic website enhancement (multi-theme, code embeds, GitHub Releases API, teaching collection)
**Researched:** 2026-02-16
**Overall Confidence:** MEDIUM (based on training data + codebase analysis; external verification unavailable)

## Note on Research Methodology

External verification tools (WebSearch, WebFetch) were unavailable. This research is based on:
1. Analysis of existing codebase (`/Users/pedf/workspace/bacilo.github.io`)
2. Training data knowledge (current through January 2025)
3. Domain patterns for Astro 5.x, CSS theming, and GitHub APIs

**Recommendation:** Validate HIGH and CRITICAL findings against official docs during implementation.

---

## Critical Pitfalls

These mistakes cause rewrites, data loss, or major integration failures.

### Pitfall 1: Theme System Overriding prefers-color-scheme

**What goes wrong:**
Adding a manual theme switcher (light/dark/academic/etc.) that conflicts with existing `@media (prefers-color-scheme: dark)` rules. Users click theme switcher, nothing happens. Or worse: theme flickers between system preference and manual selection.

**Why it happens:**
Current implementation at `/Users/pedf/workspace/bacilo.github.io/src/styles/global.css` line 28 uses media query to override CSS custom properties:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    /* ... */
  }
}
```

Adding a class-based theme system (`.theme-dark`, `.theme-light`) creates specificity conflicts. Media query continues to win, overriding user's manual theme choice.

**Consequences:**
- Theme switcher appears broken
- User confusion and complaints
- Half-working state where some properties respect manual theme, others respect system preference
- Accessibility issues (users who need high contrast can't override)

**Prevention:**
1. **Phase 1 decision:** Choose ONE of these architectures:
   - **Option A (Recommended):** Class-based themes with data attribute, remove media query
     ```css
     [data-theme="dark"] { /* dark colors */ }
     [data-theme="light"] { /* light colors */ }
     [data-theme="academic"] { /* academic colors */ }
     /* Fallback to system preference if no theme set */
     @media (prefers-color-scheme: dark) {
       :root:not([data-theme]) { /* dark colors */ }
     }
     ```
   - **Option B:** Keep media query, add override flag
     ```css
     :root:not(.manual-theme) { /* existing vars */ }
     @media (prefers-color-scheme: dark) {
       :root:not(.manual-theme) { /* dark override */ }
     }
     .theme-dark { /* manual dark */ }
     ```

2. **Test checklist:**
   - [ ] Theme switcher works when system is in dark mode
   - [ ] Theme switcher works when system is in light mode
   - [ ] Theme persists on page reload
   - [ ] Theme persists across navigation
   - [ ] System preference changes don't override manual selection

**Detection:**
- User reports "theme switcher doesn't work"
- Browser DevTools shows computed CSS variables don't match selected theme
- Media query visible in DevTools with higher specificity

**Phase to address:** Phase 1 (Foundation) - must be decided before implementing any themes

---

### Pitfall 2: Code Embed Hydration Breaking Static Site

**What goes wrong:**
Adding "runnable widget" code embeds (interactive playgrounds) requires client-side JavaScript. Naively implementing this breaks Astro's static output model, bloating bundle size or causing hydration errors.

**Why it happens:**
Current site uses `output: 'static'` (line 9 of `/Users/pedf/workspace/bacilo.github.io/astro.config.mjs`). Adding interactive embeds often requires:
- Large JS libraries (CodeMirror, Monaco, Shiki runtime)
- Framework hydration (React/Svelte/Vue)
- Runtime code execution (eval, Function constructor)

Common mistake: importing a 500KB editor library into every portfolio page that might have code.

**Consequences:**
- **Bundle bloat:** Initial page load increases from ~50KB to 500KB+
- **Hydration errors:** "Expected server HTML to contain X" errors
- **Build failures:** SSR attempting to access `window`, `document` during static generation
- **Performance regression:** Time to Interactive increases 2-5x
- **GitHub Pages deployment:** Exceeds recommended bundle size limits

**Prevention:**

1. **Syntax highlighting (non-interactive):**
   - Use build-time highlighter (Shiki, Prism) via Astro's built-in support
   - Zero client-side JS needed
   - Add to `astro.config.mjs`:
     ```js
     markdown: {
       syntaxHighlight: 'shiki',
       shikiConfig: { theme: 'github-dark' }
     }
     ```

2. **Runnable widgets (interactive):**
   - Use `client:idle` or `client:visible` directive to defer hydration
   - Lazy-load editor libraries only when needed:
     ```astro
     <CodePlayground client:visible code={code} />
     ```
   - Consider iframe embeds to external playgrounds (CodeSandbox, StackBlitz) instead of shipping full editor
   - If using iframe: Add loading="lazy" attribute

3. **Hybrid approach:**
   - Static syntax-highlighted code by default
   - "Run in playground" button that opens modal/iframe on-demand
   - Avoids loading heavy JS unless user clicks

4. **Build-time checks:**
   - Monitor bundle size: `npm run build` and check dist/ size
   - Set budget: Individual page bundles should stay under 100KB
   - Use `astro check` to catch SSR errors before deployment

**Detection:**
- Build warnings: "Large bundle detected"
- Console errors: "window is not defined" during build
- Slow page loads in production
- GitHub Pages deployment warnings about file size

**Phase to address:** Phase 2 (Code Embeds) - architecture decision required before implementation

---

### Pitfall 3: GitHub Releases API Rate Limit Death Spiral

**What goes wrong:**
Adding GitHub Releases API calls alongside existing repo API calls exhausts the 60 requests/hour unauthenticated rate limit. Site becomes unusable for visitors, showing "Unable to load stats" errors everywhere.

**Why it happens:**
Current implementation (`/Users/pedf/workspace/bacilo.github.io/src/scripts/github-api.ts`) fetches repo data client-side for each portfolio card. Adding Releases API doubles the API calls:

- **Current:** 3 portfolio cards × 1 API call = 3 requests
- **With Releases:** 3 portfolio cards × 2 API calls (repo + releases) = 6 requests

Unauthenticated GitHub API limit: **60 requests per IP per hour**

With 10+ portfolio items, a single visitor uses 20+ requests. 3 visitors = rate limited. Cached data expires in 1 hour, cycle repeats.

**Consequences:**
- **User-facing errors:** "Unable to load stats" on portfolio cards
- **Degraded experience:** Site visitors in same network (office, university) share IP, exhaust limit faster
- **Cache thrashing:** 1-hour cache too short for 60/hour limit
- **No fallback:** Existing code shows error state, no graceful degradation

**Prevention:**

1. **Immediate (Phase 3):**
   - Increase cache duration from 1 hour to 24 hours (line 14 of `github-api.ts`)
     ```ts
     const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
     ```
   - Reduces repeat visitors hitting API

2. **Medium-term (Phase 3):**
   - Batch API calls: Fetch all repos + releases in single GraphQL query (1 request instead of 2N)
   - GitHub GraphQL API: Still 60/hour limit, but more efficient
   - Example GraphQL query fetches repo + latest release in one call

3. **Long-term (Phase 3):**
   - **Build-time pre-fetching:** Move GitHub API calls to build process
     ```js
     // scripts/fetch-github-data.js
     // Run during build, save to static JSON
     // No client-side API calls
     ```
   - Pros: Zero rate limit issues for visitors, faster page loads
   - Cons: Data stale until next deployment (acceptable for academic site)

4. **Fallback strategy:**
   - Show static values from frontmatter when API fails
   - Add `stats` field to portfolio schema:
     ```ts
     stats: z.object({
       stars: z.number(),
       downloads: z.number(),
     }).optional()
     ```
   - CMS editors manually update when needed

**Detection:**
- HTTP 403 responses in browser console
- "x-ratelimit-remaining: 0" in response headers
- Error logs: "Rate limited for owner/repo"
- User reports of missing stats

**Phase to address:** Phase 3 (GitHub API Enhancement) - MUST address before adding Releases API

---

### Pitfall 4: Content Collection Schema Breaking Existing Content

**What goes wrong:**
Adding new required fields or changing validation rules in `src/content.config.ts` causes build failures. All 26 existing content files must be updated simultaneously, or build breaks with validation errors.

**Why it happens:**
Astro content collections use Zod schemas for validation at build time. Current schema (`/Users/pedf/workspace/bacilo.github.io/src/content.config.ts`) has 5 collections with strict validation.

Common mistakes when adding teaching collection:
1. Copy-pasting schema from similar collection (talks/publications) without adjusting required fields
2. Adding required fields to existing collections without updating all content files
3. Changing field types (string → enum, optional → required)

**Consequences:**
- **Build failures:** `npm run build` fails with "Expected X, received Y" errors
- **Broken CMS:** Sveltia CMS config out of sync, shows wrong fields
- **Data loss risk:** CMS saves data that fails schema validation
- **Blocked deployment:** Can't deploy to GitHub Pages until all files fixed
- **Validation cascade:** Fixing one file reveals errors in others

**Prevention:**

1. **Schema evolution checklist:**
   - [ ] New fields MUST be optional initially (use `z.optional()`)
   - [ ] Add `z.preprocess()` for empty string handling (see lines 5-6 of `content.config.ts`)
   - [ ] Test schema change with `npm run build` before touching content files
   - [ ] Update CMS config (`public/admin/config.yml`) in same commit as schema change
   - [ ] Add inline comments linking schema to CMS config:
     ```ts
     // Schema mirrors public/admin/config.yml -- update both when changing fields
     ```

2. **Teaching collection checklist:**
   - [ ] Start with minimal required fields (title, date only)
   - [ ] Add optional fields for future expansion
   - [ ] Use consistent field naming with other collections
   - [ ] Include `collection: z.literal('teaching')` for type safety

3. **CMS sync strategy:**
   - Keep CMS config comment (already exists at lines 72, 86, 104, 121)
   - Use same field order in both files
   - Test in Sveltia CMS UI after changes

4. **Migration safety:**
   - Never change existing field types in one step
   - Add new field → migrate data → remove old field (3 commits)
   - Use Git to verify no unintended changes: `git diff src/content/`

**Detection:**
- Build errors: "ZodError: Invalid type at..."
- CMS errors: "Field X not found in schema"
- Content files with missing fields
- Type errors in `.astro` files referencing collection entries

**Phase to address:** Phase 4 (Teaching Section) - critical during schema design

---

## Moderate Pitfalls

These cause bugs, rework, or user experience issues but are fixable without major rewrites.

### Pitfall 5: Theme-Specific Syntax Highlighting Mismatch

**What goes wrong:**
Syntax highlighting theme (e.g., GitHub Dark) hard-coded in config, looks terrible in light themes. Code blocks with dark background appear on dark background site theme = unreadable.

**Why it happens:**
Astro's syntax highlighting config is build-time only. Can't dynamically switch Shiki theme based on user's selected site theme.

**Prevention:**
- Use dual themes in Shiki config:
  ```js
  shikiConfig: {
    themes: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
  ```
- Generates CSS with `@media (prefers-color-scheme: dark)` for code blocks
- Must coordinate with site theme system (see Pitfall 1)
- Alternative: Use theme-neutral syntax highlighting (min-light, min-dark)

**Phase to address:** Phase 2 (Code Embeds) - during syntax highlighting setup

---

### Pitfall 6: Portfolio Stats Configuration Combinatorial Explosion

**What goes wrong:**
Supporting "stars/downloads/both/neither" per portfolio card creates 4 states × 3 sources (repo API, releases API, static) = 12 code paths. Logic becomes unmaintainable.

**Why it happens:**
Each portfolio item might want different stats displayed. Initial implementation uses nested conditionals:
```astro
{showStars && repoData && <Stars count={repoData.stars} />}
{showDownloads && releaseData && <Downloads count={releaseData.downloads} />}
```

Adding error states, loading states, fallbacks = complexity explosion.

**Prevention:**
1. **Simplified model:** Single `statsDisplay` field with enum:
   ```ts
   statsDisplay: z.enum(['none', 'github', 'npm', 'both']).default('github')
   ```
2. **Component abstraction:**
   ```astro
   <StatsDisplay type={statsDisplay} repo={repo} package={package} />
   ```
3. **State machine pattern:** Loading → Success → Error (not nested ifs)

**Phase to address:** Phase 3 (GitHub API Enhancement) - architecture design

---

### Pitfall 7: Teaching Collection Slug Collisions

**What goes wrong:**
Adding teaching collection with auto-generated slugs (course codes like "CS101") collides with existing routes (`/pages/`, `/posts/`).

**Why it happens:**
Astro generates routes from content collection file structure. If teaching content uses slugs like "about" or "home", collides with pages collection.

**Prevention:**
- Namespace teaching routes: `/teaching/[slug]` not `/[slug]`
- Use course code prefix in filenames: `2024-spring-cs101.md`
- Add slug validation in schema:
  ```ts
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
  ```

**Phase to address:** Phase 4 (Teaching Section) - routing setup

---

### Pitfall 8: Client-Side localStorage Quota Exceeded

**What goes wrong:**
Aggressive GitHub API caching fills localStorage (5-10MB limit per domain). New cache writes fail silently, API rate limiting resumes.

**Why it happens:**
Current implementation (lines 75-78 of `github-api.ts`) caches each repo individually. Adding releases data doubles storage. With images/descriptions, cache grows fast:

- 10 repos × 2KB each = 20KB (current)
- 10 repos × 4KB (with releases) = 40KB
- User browses 100+ portfolio sites = 4MB+ cached

**Prevention:**
1. **Implement LRU cache:** Keep only 50 most recent entries
2. **Compress data:** Store only needed fields, not full API response
3. **Handle quota errors:**
   ```ts
   try {
     localStorage.setItem(key, value);
   } catch (err) {
     if (err.name === 'QuotaExceededError') {
       // Clear old entries, retry
       clearOldestCacheEntries();
     }
   }
   ```
4. **Monitor cache size:** Log total usage in dev tools

**Phase to address:** Phase 3 (GitHub API Enhancement) - cache strategy

---

## Minor Pitfalls

### Pitfall 9: Runnable Widget Security (eval/new Function)

**What goes wrong:**
Implementing runnable code widgets with `eval()` or `new Function()` violates Content Security Policy, creates XSS risk.

**Prevention:**
- Use sandboxed iframe for code execution
- Or: Use Web Workers for isolated execution
- Or: Use external playground iframe (CodeSandbox, StackBlitz)
- Never: `eval(userCode)` or `new Function(userCode)()`

**Phase to address:** Phase 2 (Code Embeds) - if implementing runnable widgets

---

### Pitfall 10: MDX vs Markdown for Code Embeds

**What goes wrong:**
Mixing `.md` and `.mdx` files in content collections causes inconsistent code block rendering. Some files get interactive widgets, others don't.

**Prevention:**
- Decide: All `.md` with Astro components, or all `.mdx` for consistency
- Document in schema comments which collections support MDX
- Use file extension validation if needed

**Phase to address:** Phase 2 (Code Embeds) - content strategy

---

### Pitfall 11: Theme Switcher FOUC (Flash of Unstyled Content)

**What goes wrong:**
Theme loads from localStorage after page renders, causing flash from default theme to selected theme.

**Prevention:**
- Inline theme script in `<head>` before styles:
  ```html
  <script>
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  </script>
  ```
- Prevents flash by setting theme before first paint

**Phase to address:** Phase 1 (Foundation) - theme switcher implementation

---

### Pitfall 12: GitHub API Response Shape Changes

**What goes wrong:**
GitHub changes API response format, code expecting `stargazers_count` gets `undefined`.

**Prevention:**
- Add runtime validation with Zod for API responses
- Provide fallback values for missing fields
- Log warnings when shape doesn't match expected

**Phase to address:** Phase 3 (GitHub API Enhancement) - error handling

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation | Priority |
|-------------|---------------|------------|----------|
| **Phase 1: Theme System** | Media query override conflict (Pitfall 1) | Architecture decision before coding | CRITICAL |
| **Phase 1: Theme System** | FOUC on load (Pitfall 11) | Inline script in head | MEDIUM |
| **Phase 2: Code Embeds** | Hydration breaking static build (Pitfall 2) | Use build-time syntax highlighting, defer interactive | CRITICAL |
| **Phase 2: Code Embeds** | Theme mismatch for code blocks (Pitfall 5) | Dual-theme Shiki config | MEDIUM |
| **Phase 2: Code Embeds** | eval() security issue (Pitfall 9) | Use iframe or external playground | MEDIUM |
| **Phase 3: GitHub API** | Rate limit death spiral (Pitfall 3) | Increase cache, consider build-time fetching | CRITICAL |
| **Phase 3: GitHub API** | localStorage quota exceeded (Pitfall 8) | LRU cache with size limits | MEDIUM |
| **Phase 3: GitHub API** | Stats display complexity (Pitfall 6) | Simplified enum model | MEDIUM |
| **Phase 4: Teaching Section** | Schema breaking existing content (Pitfall 4) | Optional fields, CMS sync checklist | CRITICAL |
| **Phase 4: Teaching Section** | Slug collisions (Pitfall 7) | Namespaced routes, validation | MEDIUM |

---

## Integration Pitfalls (Multi-Feature)

### Pitfall 13: Theme System + Code Embeds Coordination

**What goes wrong:**
Site theme switcher changes CSS variables, but code block themes remain static (built at compile time). User switches to light theme, code blocks stay dark.

**Consequences:**
- Inconsistent visual experience
- Accessibility issues (insufficient contrast)
- User confusion

**Prevention:**
1. **During Phase 1:** Document theme CSS variable names used
2. **During Phase 2:** Configure Shiki to generate CSS using same variable names:
   ```js
   shikiConfig: {
     cssVariablePrefix: '--shiki-'
   }
   ```
3. **Map site themes to code themes:** Light theme → GitHub Light, Dark theme → GitHub Dark
4. **Test matrix:** Each site theme × code block rendering = 6-8 combinations

**Phase to address:** Phase 2 (Code Embeds) - must reference Phase 1 decisions

---

### Pitfall 14: CMS Config + Schema Drift

**What goes wrong:**
Developer updates `src/content.config.ts` schema during Phase 4 (teaching section), forgets to update `public/admin/config.yml`. CMS shows wrong fields, content editors confused.

**Consequences:**
- CMS editors see outdated fields
- New content fails validation at build time
- Data entered in CMS but not saved to files
- Requires manual file editing to fix

**Prevention:**
1. **Establish update protocol:**
   - Step 1: Update schema in `src/content.config.ts`
   - Step 2: Update CMS config in `public/admin/config.yml`
   - Step 3: Test in CMS UI (`npm run dev`, visit `/admin/`)
   - Step 4: Commit both files together with message: "Schema: [description]"

2. **Use schema comments as reminder:**
   ```ts
   // Schema mirrors public/admin/config.yml -- update both when changing fields
   ```

3. **Automated validation (future):**
   - Write script to compare schema and CMS config
   - Run in pre-commit hook or CI

4. **Phase 4 specific:**
   - When adding teaching collection, create schema AND CMS config in same commit
   - Use existing collections as template (compare lines 80-96 publications with schema lines 8-20)

**Phase to address:** All phases touching content collections (Phase 4 primary)

---

### Pitfall 15: GitHub API + Build-Time vs Runtime Data

**What goes wrong:**
Portfolio pages built statically at deploy time, but GitHub stats fetched client-side at runtime. Causes:
- SSR/SSG mismatch warnings
- Hydration errors if components expect data at build time
- Inconsistent data between page meta tags (built) and displayed content (runtime)

**Consequences:**
- SEO issues: Meta tags show "0 stars" but page shows "150 stars"
- Social sharing previews incorrect
- Accessibility: Screen readers read stale static content

**Prevention:**

**Option A: All Runtime (Current Architecture)**
- Keep GitHub fetching client-side
- Don't include stats in SSG phase
- Set meta tags to exclude stats: `<meta property="og:description" content={description}>`
- Pros: Simple, always fresh data
- Cons: Rate limits, slower load, no SEO for stats

**Option B: All Build-Time (Recommended for Phase 3)**
- Fetch GitHub data during build in `src/pages/portfolio/index.astro`:
  ```js
  const portfolioItems = await Promise.all(
    projects.map(async (project) => {
      const stats = await fetchRepoDataServer(project.repoUrl);
      return { ...project, stats };
    })
  );
  ```
- Pass to component as props, no client-side fetch
- Pros: Fast, SEO-friendly, no rate limits for users
- Cons: Stale until next deploy (acceptable for academic portfolio)

**Option C: Hybrid**
- Build-time for initial render, client-side for updates
- More complex, avoid unless needed

**Decision point:** Phase 3 - choose architecture before implementing Releases API

**Phase to address:** Phase 3 (GitHub API Enhancement) - architecture decision

---

## Research Gaps & Open Questions

Due to unavailability of external verification tools, the following should be validated during implementation:

1. **Astro 5.x content collections:** Confirm current behavior of schema validation errors with existing content (training data based on Astro 4.x patterns)

2. **GitHub API v3 vs v4 (GraphQL):** Verify best practices for batching repo + releases queries in 2026

3. **Shiki vs Prism:** Confirm current recommendations for Astro 5.x syntax highlighting performance

4. **Sveltia CMS:** Validate schema sync requirements (training data based on Netlify/Decap CMS patterns)

5. **CSS custom properties browser support:** Verify current best practices for theming with custom properties (assumed stable based on 2024 data)

**Recommendation:** Phase leads should verify these areas with official documentation before implementation.

---

## Success Metrics

Pitfalls successfully avoided when:

- [ ] Theme switcher works in all scenarios (Pitfall 1 test checklist passed)
- [ ] Build completes with all syntax highlighting under 100KB per page (Pitfall 2)
- [ ] No GitHub API rate limit errors in production logs (Pitfall 3)
- [ ] All existing content validates after teaching collection added (Pitfall 4)
- [ ] Code blocks readable in all 6-8 theme combinations (Pitfall 5, 13)
- [ ] CMS config stays in sync with schema throughout project (Pitfall 14)
- [ ] localStorage cache handles quota gracefully (Pitfall 8)

---

## Confidence Assessment by Pitfall

| Pitfall | Confidence | Reason |
|---------|------------|--------|
| 1: Theme media query conflict | HIGH | Observable in current codebase, standard CSS specificity issue |
| 2: Code embed hydration | HIGH | Documented Astro static build limitation |
| 3: GitHub rate limiting | HIGH | GitHub API docs stable, visible in current implementation |
| 4: Schema breaking content | HIGH | Observable in current Zod schemas and content files |
| 5: Syntax highlight theme mismatch | MEDIUM | Based on Shiki patterns, requires verification with latest docs |
| 6: Stats configuration complexity | MEDIUM | Software engineering pattern, not domain-specific |
| 7: Teaching slug collisions | MEDIUM | Astro routing observable, teaching specifics assumed |
| 8: localStorage quota | MEDIUM | Browser API standard, implementation pattern assumed |
| 9: Runnable widget security | HIGH | Security fundamentals, CSP standards |
| 10: MDX vs Markdown | MEDIUM | Astro content collection behavior, requires verification |
| 11: Theme FOUC | HIGH | Standard web performance issue, well-documented pattern |
| 12: API shape changes | MEDIUM | General API best practice, not GitHub-specific |
| 13: Theme + Code coordination | MEDIUM | Integration pattern inferred, requires testing |
| 14: CMS config drift | HIGH | Observable in current CMS config structure |
| 15: Build-time vs runtime | HIGH | Astro architecture observable in current code |

**Overall Assessment:**
- CRITICAL pitfalls (1, 2, 3, 4, 15): HIGH confidence based on codebase analysis
- MODERATE pitfalls (5, 6, 8, 13, 14): MEDIUM-HIGH confidence, recommend validation
- MINOR pitfalls (7, 9, 10, 11, 12): MEDIUM confidence, standard patterns

---

## Sources

**Codebase Analysis:**
- `/Users/pedf/workspace/bacilo.github.io/src/styles/global.css` (theme system)
- `/Users/pedf/workspace/bacilo.github.io/src/content.config.ts` (content collections)
- `/Users/pedf/workspace/bacilo.github.io/src/scripts/github-api.ts` (API patterns)
- `/Users/pedf/workspace/bacilo.github.io/public/admin/config.yml` (CMS sync)
- `/Users/pedf/workspace/bacilo.github.io/astro.config.mjs` (static build config)

**Training Data Knowledge:**
- Astro 4.x-5.x content collections behavior
- GitHub API v3 rate limiting (stable since 2020)
- CSS custom properties browser support
- Shiki/Prism syntax highlighting patterns
- Web performance best practices (FOUC, hydration)

**Recommendations for Verification:**
- Astro docs: https://docs.astro.build/en/guides/content-collections/
- GitHub API docs: https://docs.github.com/en/rest/releases
- Shiki docs: https://shiki.style/
- CSS custom properties: MDN Web Docs
