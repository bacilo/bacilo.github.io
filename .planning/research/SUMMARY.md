# Project Research Summary

**Project:** Academic Website v3.0 Enhancements
**Domain:** Astro 5.x static site with academic portfolio features
**Researched:** 2026-02-16
**Confidence:** MEDIUM-HIGH

## Executive Summary

This milestone adds four feature enhancements to an existing Astro 5.x academic website: (1) Teaching section with content collections, (2) Portfolio code embeds with syntax highlighting, (3) Configurable GitHub stats (stars/downloads), and (4) Multi-theme CSS system (6-8 themes). Research reveals that all features can be implemented as architectural **additions** rather than **modifications**, preserving existing functionality while extending capabilities.

The recommended approach leverages existing patterns already proven in the codebase: content collections (5 collections already working), component composition (portfolio cards demonstrate pattern), CSS custom properties (dark mode via media query exists), and client-side API fetching with localStorage cache (GitHub API pattern established). No new npm packages required. The most significant finding is that Astro 5.x includes Shiki syntax highlighting built-in, eliminating the need for runtime JavaScript libraries.

Key risks center on three integration points: (1) Theme system must not conflict with existing `prefers-color-scheme` media query, (2) GitHub API rate limits require careful cache management when adding Releases API, and (3) Content collection schema changes must maintain backward compatibility with 26 existing content files. All risks have clear mitigation strategies based on established patterns.

## Key Findings

### Recommended Stack

**Zero new dependencies required.** All features leverage built-in Astro capabilities and existing patterns:

**Core technologies:**
- **Shiki (built-in)**: Syntax highlighting — Already included in Astro 5.x, VSCode-quality highlighting, runs at build time (zero client JS)
- **CSS Custom Properties**: Theme system — Site already uses custom properties for dark mode, extend with `[data-theme]` attribute selectors
- **GitHub REST API v3**: Release download stats — Extend existing `github-api.ts` pattern with `/repos/{owner}/{repo}/releases/latest` endpoint
- **Astro Content Collections**: Teaching section — Follow existing pattern from publications/talks/posts collections

**What NOT to add:**
- Prism/highlight.js (Shiki is superior, build-time)
- react-syntax-highlighter (introduces React for minimal benefit)
- styled-components/theme-ui (CSS custom properties sufficient)
- Octokit packages (native fetch matches existing pattern)

### Expected Features

**Must have (table stakes):**
- Teaching content collection with CMS integration
- Syntax-highlighted code blocks in portfolio
- Configurable stats display per portfolio item (stars/downloads/both/none)
- Basic theme switcher (light/dark/auto)

**Should have (differentiators):**
- 6-8 curated themes (Nord, Dracula, Solarized, Sepia, etc.)
- Copy button for code blocks
- Theme persistence via localStorage
- Release download counts from GitHub API

**Defer (v2+):**
- Runnable code widgets (interactive playgrounds)
- Authenticated GitHub API (for higher rate limits)
- Custom theme creator UI
- Code diff view

### Architecture Approach

All features integrate as extensions of existing architectural patterns. The content layer gains a teaching collection (6th collection alongside existing 5). The component layer adds CodeEmbed and ThemeSwitcher components following the proven portfolio card composition pattern. The style layer extends CSS custom properties from 2 themes (light/dark via media query) to 8 themes (attribute-based). The script layer extends github-api.ts from repo stats to include release stats using the same cache pattern.

**Major components:**
1. **Teaching Collection** — Content collection + pages following publications/talks pattern
2. **CodeEmbed Component** — Shiki-highlighted code with copy button (build-time highlighting, minimal runtime JS)
3. **Theme System** — CSS custom properties with `[data-theme]` selectors, localStorage persistence
4. **Stats Configuration** — Portfolio schema extension with conditional rendering in GitHubCard

### Critical Pitfalls

1. **Theme system conflicting with prefers-color-scheme** — Existing media query at `src/styles/global.css:28` will override manual theme selection. Must use attribute selectors with higher specificity and provide fallback to media query only when theme is "auto". Test checklist required for all theme × system preference combinations.

2. **GitHub API rate limit exhaustion** — Adding Releases API doubles requests per portfolio card (repo + releases). With 10+ portfolio items, site hits 60 req/hour unauthenticated limit after 3 visitors. Increase cache from 1 hour to 24 hours immediately. Consider build-time pre-fetching for production.

3. **Content collection schema breaking existing files** — Adding required fields to schemas causes build failures across all 26 content files. All new fields MUST be optional initially (`z.optional()`). CMS config and schema must stay synchronized (update both in same commit).

4. **Code embed hydration breaking static build** — Adding interactive playgrounds naively introduces 500KB+ bundle size and hydration errors. Use build-time Shiki for syntax highlighting (zero client JS). Defer runnable widgets to v2 or use iframe embeds to external playgrounds.

5. **Theme CSS and Shiki theme mismatch** — User switches to light theme, code blocks stay dark (Shiki theme set at build time). Use Shiki dual-theme config with `themes: { light, dark }` and coordinate with site theme system.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation (Theme Infrastructure + Teaching Schema)
**Rationale:** CSS theme infrastructure must exist before theme switcher UI. Teaching schema must exist before pages that query it. Both are independent (no shared files), can be done in parallel.

**Delivers:**
- `src/styles/themes.css` with 6-8 theme definitions using `[data-theme]` selectors
- Teaching collection schema in `content.config.ts` + CMS config
- 1-2 sample teaching entries for validation

**Addresses:** Base requirements for themes and teaching section

**Avoids:** Pitfall #1 (theme media query conflict) by establishing correct architecture before implementation. Pitfall #4 (schema breaking content) by using optional fields initially.

**Research flag:** SKIP — Patterns well-established in codebase

**Estimated time:** 3-4 hours

---

### Phase 2: UI Components (Theme Switcher + Teaching Pages)
**Rationale:** Both require Phase 1 infrastructure (themes.css, teaching schema). No dependencies between them, can parallelize.

**Delivers:**
- ThemeSwitcher.astro component + theme-switcher.ts script
- `pages/teaching/index.astro` and `pages/teaching/[...slug].astro`
- Teaching link in navigation
- Inline script in BaseLayout to prevent FOUC

**Uses:** CSS custom properties from Phase 1, teaching collection from Phase 1

**Implements:** Theme persistence (localStorage), teaching content rendering

**Addresses:** Theme switcher UI, teaching section visibility

**Avoids:** Pitfall #11 (FOUC) by inlining theme script in `<head>`

**Research flag:** SKIP — Component patterns proven in existing portfolio components

**Estimated time:** 5-7 hours

---

### Phase 3: Portfolio Enhancements (Configurable Stats + Code Highlighting)
**Rationale:** Both extend existing portfolio functionality. Stats config independent of code highlighting, can parallelize. Code highlighting depends on Phase 1 themes for coordination.

**Delivers:**
- Portfolio schema extensions (statsDisplay, npmPackage fields)
- GitHubCard.astro modifications for conditional rendering
- fetchReleaseStats() function in github-api.ts
- Shiki configuration in astro.config.mjs
- CodeEmbed.astro component (if advanced features needed)

**Uses:** Theme system from Phase 1 (for code theme coordination), existing GitHub API pattern

**Implements:** Configurable portfolio stats, syntax highlighting

**Addresses:** GitHub Releases API integration, code display with syntax highlighting

**Avoids:** Pitfall #2 (hydration breaking static) by using build-time Shiki. Pitfall #3 (rate limits) by increasing cache to 24 hours and using existing cache pattern. Pitfall #5 (theme mismatch) by using dual-theme Shiki config.

**Research flag:** REVIEW GITHUB API — Verify current Releases API response format and best practices for cache duration (24hr vs build-time). Estimated 30min validation against official docs.

**Estimated time:** 5-8 hours

---

### Phase 4: Integration & Testing
**Rationale:** All features complete, verify they work together correctly.

**Delivers:**
- Integration testing across all features
- Theme switching verified with code blocks
- CMS workflow tested for teaching + portfolio
- GitHub/npm API fetching tested with cache
- Accessibility audit (keyboard nav, screen readers)
- Documentation updates

**Addresses:** Quality assurance, documentation

**Avoids:** Pitfall #13 (theme + code coordination issues) by testing all combinations. Pitfall #14 (CMS drift) by verifying CMS config matches schemas.

**Research flag:** SKIP — Standard testing procedures

**Estimated time:** 2-3 hours

---

### Phase Ordering Rationale

**Dependency-driven:**
- Themes CSS → Theme switcher (Phase 1 → 2)
- Teaching schema → Teaching pages (Phase 1 → 2)
- Theme system → Code highlighting theme coordination (Phase 1 → 3)

**Parallelization opportunities:**
- Phase 1: Themes CSS + Teaching schema (different files, no conflicts)
- Phase 2: Theme switcher + Teaching pages (different concerns)
- Phase 3: Stats config + Code highlighting (different portfolio aspects)

**Risk mitigation:**
- Phase 1 establishes correct architecture patterns before building on them
- Phase 2 adds user-facing features independently
- Phase 3 extends existing portfolio without breaking it
- Phase 4 catches integration issues before production

**Build order prevents:**
- Theme FOUC (Phase 1 architecture decision)
- Schema breakage (Phase 1 optional fields)
- Rate limit issues (Phase 3 cache strategy)
- Hydration errors (Phase 3 build-time highlighting)

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 3 (GitHub API):** 30min validation — Verify GitHub Releases API response format, confirm best practices for cache duration (24hr vs build-time pre-fetching), check current rate limit recommendations for academic sites

**Phases with standard patterns (skip research):**
- **Phase 1 (Foundation):** CSS custom properties well-established, content collection pattern proven in codebase
- **Phase 2 (UI Components):** Component composition demonstrated in existing portfolio cards, theme persistence follows existing API cache pattern
- **Phase 4 (Testing):** Standard QA procedures

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies, all features use existing patterns. Shiki built-in to Astro verified in training data. |
| Features | HIGH | Requirements clear, well-scoped. Teaching section mirrors existing collections. Code embeds and themes are standard web features. |
| Architecture | HIGH | Five existing content collections prove pattern. Portfolio components demonstrate composition. CSS custom properties in active use. |
| Pitfalls | MEDIUM-HIGH | Critical pitfalls identified from codebase analysis (media query conflict, API rate limits, schema validation). Some pitfalls (Shiki theme coordination) inferred from patterns, need testing validation. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

**Gap 1: Shiki dual-theme configuration syntax**
- **Issue:** Training data indicates `themes: { light, dark }` config exists, but exact API may have changed in Astro 5.x
- **Impact:** Code highlighting theme coordination (Pitfall #5)
- **Resolution:** Phase 3 planning — validate against official Astro docs, fallback to single theme if dual-theme unsupported
- **Mitigation:** Start with single theme ("github-dark"), add dual-theme only if needed

**Gap 2: GitHub Releases API download count aggregation**
- **Issue:** Unclear if API returns total downloads or per-asset breakdown
- **Impact:** Stats display logic complexity
- **Resolution:** Phase 3 planning — test with real API response, implement sum-across-assets if needed
- **Mitigation:** Use existing GitHub API pattern, add error handling for unexpected response shape

**Gap 3: Teaching collection field requirements**
- **Issue:** Optimal fields for academic teaching section not fully defined
- **Impact:** Schema completeness
- **Resolution:** Phase 1 planning — start with minimal fields (title, date, course, institution), expand based on user feedback
- **Mitigation:** All fields optional initially, easy to extend schema later

**Gap 4: Theme count and naming**
- **Issue:** Which 6-8 themes provide best coverage for academic audience?
- **Impact:** User preference satisfaction
- **Resolution:** Phase 1 implementation — start with 6 themes (light, dark, auto, sepia, nord, solarized-light), add 2 more based on testing feedback
- **Mitigation:** Theme system designed for easy addition of new themes (just CSS)

**Gap 5: localStorage quota management**
- **Issue:** Aggressive caching may hit 5-10MB localStorage limit
- **Impact:** Cache writes fail silently, rate limiting resumes
- **Resolution:** Phase 3 implementation — implement quota error handling, clear oldest entries on quota exceeded
- **Mitigation:** Monitor cache size in development, add LRU eviction if needed

## Sources

### Primary (HIGH confidence)

**Codebase Analysis (Direct Verification):**
- `/Users/pedf/workspace/bacilo.github.io/src/content.config.ts` — 5 existing content collections prove pattern for teaching section
- `/Users/pedf/workspace/bacilo.github.io/src/styles/global.css` — CSS custom properties system, media query at line 28 identifies Pitfall #1
- `/Users/pedf/workspace/bacilo.github.io/src/scripts/github-api.ts` — Client-side API fetching with localStorage cache (1hr TTL at line 14), pattern for Releases API
- `/Users/pedf/workspace/bacilo.github.io/public/admin/config.yml` — CMS schema sync pattern, comments linking to content.config.ts
- `/Users/pedf/workspace/bacilo.github.io/src/pages/portfolio/index.astro` — Component composition pattern for portfolio cards
- `/Users/pedf/workspace/bacilo.github.io/astro.config.mjs` — Static output mode (line 9), integration configuration

### Secondary (MEDIUM-HIGH confidence)

**Training Data (January 2025 cutoff):**
- Astro 5.x built-in Shiki support — Verified in Astro release notes, continued from v2.x implementation
- GitHub REST API v3 `/repos/{owner}/{repo}/releases/latest` endpoint — Stable API, documented rate limits (60/hr unauthenticated)
- CSS custom properties browser support — Universal support in modern browsers, standard theming pattern
- localStorage API — Standard browser API, 5-10MB quota per domain
- `[data-theme]` attribute pattern — Industry-standard approach used by GitHub, MDN, and major sites

### Tertiary (MEDIUM confidence, needs verification)

**Training Data (Requires Validation):**
- Shiki dual-theme configuration in Astro — `themes: { light, dark }` syntax inferred from Shiki docs, exact Astro integration needs verification
- GitHub Releases API response shape — Assumed to include `assets[]` with `download_count`, should verify with API call during Phase 3
- npm downloads API — Public endpoint `api.npmjs.org/downloads/point/last-month/{package}`, assumed unchanged
- Shiki `codeToHtml` API for custom components — API may have changed, verify if building custom CodeEmbed component

### Recommended Verification

Before Phase 3 implementation:
1. Astro syntax highlighting config: https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting
2. GitHub Releases API: https://docs.github.com/en/rest/releases/releases#get-the-latest-release
3. Shiki themes: https://shiki.style/themes
4. GitHub API rate limits: https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api

---

*Research completed: 2026-02-16*
*Ready for roadmap: YES*
*Total estimated time: 15-22 hours across 4 phases*
*Critical dependencies: Phase 1 → Phase 2, Phase 1 → Phase 3*
