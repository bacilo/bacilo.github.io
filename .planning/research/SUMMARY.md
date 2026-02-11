# Research Summary: Personal Academic Website Rebuild with Astro

**Domain:** Personal academic website with publications, talks, blog, and portfolio
**Researched:** 2026-02-11
**Overall confidence:** MEDIUM (based on training data through Jan 2025; external verification tools unavailable)

## Executive Summary

This research informs the rebuild of bacilo.github.io from Jekyll (Minimal Mistakes theme) to Astro. The project migrates existing academic content (publications, talks, blog posts) while adding an enhanced portfolio section with interactive embeds. The site will continue deploying to GitHub Pages at pedropaf.com/bacilo.github.io.

**Core finding:** Astro is well-suited for this migration. Its island architecture allows static academic content (publications, talks) to remain pure HTML while enabling selective interactivity in the portfolio section. Content Collections provide type-safe migration from Jekyll collections with minimal friction.

**Critical success factors:**
1. **URL preservation** — Publications have been cited; breaking URLs damages professional credibility
2. **Phased deployment** — Ship core site first, enhance portfolio progressively (avoid perfectionism trap)
3. **Schema validation** — Audit Jekyll frontmatter before defining Content Collection schemas
4. **GitHub Pages configuration** — User site requires no base path; .nojekyll file mandatory

**Recommended approach:** Three-phase roadmap prioritizing feature parity, then enhancement. Phase 1 achieves Jekyll parity (publications, talks, blog, about), Phase 2 adds static portfolio, Phase 3 layers interactivity. This prevents the common pitfall of over-engineering portfolio features before launching core site.

## Key Findings

**Stack:** Astro 5.x + Content Collections + Tailwind CSS + Typography Plugin + React islands for portfolio interactivity. GitHub API calls at build time (not client-side) using GitHub Actions token. MDX for embeddable components in markdown.

**Architecture:** Island architecture with clear component boundaries. Content Collections (src/content/) map directly to Jekyll collections (_publications/, _talks/, _posts/, _portfolio/). Static-first with selective hydration via client:load/visible/idle directives. Build-time GitHub API fetching prevents rate limiting.

**Critical pitfall:** Breaking publication URLs during migration. Jekyll permalinks must be preserved or redirected. Publications have been cited in papers/CVs — URL changes damage professional credibility and Google Scholar indexing.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Core Migration (CRITICAL PATH)
**Rationale:** Achieve feature parity with current Jekyll site. Zero regression in core academic content.

**Addresses:**
- Content Collections setup for publications, talks, blog (FEATURES.md: table stakes)
- URL structure preservation (PITFALLS.md: critical pitfall #1)
- Base layout with author sidebar (ARCHITECTURE.md: component composition pattern)
- Tailwind + Typography plugin (STACK.md: academic aesthetic requirement)
- GitHub Pages deployment (STACK.md + ARCHITECTURE.md: deployment patterns)

**Avoids:**
- Portfolio over-engineering before core site launches (PITFALLS.md: critical pitfall #4)
- Schema mismatch breaking migration (PITFALLS.md: critical pitfall #3)

**Why this order:** Core academic content is the site's purpose. Publications, talks, and blog must work before adding portfolio enhancements. Early deployment validates GitHub Pages configuration and URL preservation.

**Estimated complexity:** Medium. Content migration is straightforward but schema validation and URL mapping require careful attention.

### Phase 2: Static Portfolio & Content Polish
**Rationale:** Add portfolio section with static cards first. Prove baseline works before adding interactivity.

**Addresses:**
- Portfolio content collection (FEATURES.md: differentiator)
- Static project cards with links (ARCHITECTURE.md: static-first pattern)
- Mobile responsive testing (PITFALLS.md: moderate pitfall #9)
- RSS feed for blog (FEATURES.md: table stakes for academic sites)

**Avoids:**
- GitHub API complexity blocking portfolio launch (PITFALLS.md: moderate pitfall #10)
- Island hydration overkill (PITFALLS.md: critical pitfall #3 from existing doc)

**Why this order:** Static portfolio proves the section works before investing in interactive features. RSS feed is table stakes but non-blocking.

**Estimated complexity:** Low-Medium. Static portfolio cards are simple components. RSS integration well-documented.

### Phase 3: Interactive Portfolio Enhancements
**Rationale:** Progressive enhancement. Core site is live; now add differentiating features.

**Addresses:**
- GitHub repo cards with build-time API calls (FEATURES.md: priority differentiator)
- Live demo embeds with lazy loading (FEATURES.md: differentiator)
- Code playground embeds (FEATURES.md: lower priority differentiator)
- Data visualization islands (FEATURES.md: conditional on datasets)

**Avoids:**
- Client-side GitHub API calls (PITFALLS.md: moderate pitfall #10)
- Overusing React islands (PITFALLS.md: minor pitfall #15)

**Why this order:** Interactive features are enhancements, not blockers. Site is already live and functional. Can be deployed incrementally.

**Estimated complexity:** High. Interactive embeds require React integration, island hydration configuration, GitHub API build-time fetching, and mobile optimization.

## Phase Ordering Rationale

**Why Foundation → Static Portfolio → Interactive:**

1. **Risk mitigation:** Core site must work before enhancements. If Phase 3 takes longer than expected, site is still live and functional.

2. **Dependency management:** Interactive portfolio depends on static portfolio working. Static portfolio depends on Content Collections. Content Collections depend on schema validation.

3. **User value delivery:** Publications and talks are the primary content. Portfolio is enhancement. Ship core value first.

4. **Technical validation:** Early GitHub Pages deployment validates URL structure, base path configuration, and .nojekyll setup before investing in complex features.

5. **Momentum preservation:** Launching Phase 1 provides psychological win and validates approach. Prevents stalling on "perfect" portfolio features.

**Parallel work opportunities:**
- Content migration can happen during Phase 1 alongside component development
- Styling (Tailwind config) can be refined across all phases
- Interactive portfolio components can be prototyped during Phase 2

**Critical path:** Foundation (Phase 1) blocks everything. Static portfolio (Phase 2) blocks interactive features (Phase 3). Blog and RSS can be deferred if needed.

## Research Flags for Phases

**Phase 1 likely needs deeper research:**
- Current Astro 5.x Content Collections API (verify no breaking changes since Jan 2025)
- GitHub Pages deployment workflow with Astro (current best practices)
- Exact Jekyll permalink patterns in existing site (requires manual audit)
- Frontmatter inconsistencies across collections (requires scripting)

**Phase 2 unlikely to need research:**
- Standard Astro patterns well-documented
- RSS integration has official @astrojs/rss package
- Static portfolio is straightforward component work

**Phase 3 likely needs phase-specific research:**
- Current state of astro-embed package (verify existence, alternatives)
- GitHub API rate limits and build-time fetching strategies
- Chart.js version compatibility with React 18
- Code playground embed options (CodeSandbox, StackBlitz APIs)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack (Astro core) | HIGH | Well-established patterns, stable API |
| Stack (versions) | MEDIUM-LOW | Based on Jan 2025 training data, need npm verification |
| Features (table stakes) | HIGH | Direct observation of current Jekyll site |
| Features (differentiators) | MEDIUM | Based on typical academic site patterns |
| Architecture | HIGH | Standard Astro patterns, well-documented |
| Pitfalls (migration) | HIGH | Common Jekyll → Astro issues documented |
| Pitfalls (portfolio) | MEDIUM | Context-dependent, need phase-specific validation |

**Confidence limitation:** External research tools (WebSearch, Context7, WebFetch) were unavailable. All findings based on:
1. Analysis of existing Jekyll site structure (HIGH confidence source)
2. PROJECT.md requirements (HIGH confidence source)
3. Training data knowledge of Astro ecosystem (MEDIUM confidence — stale as of Jan 2025)
4. General static site generator patterns (MEDIUM-HIGH confidence)

**Verification recommended before Phase 1:**
- npm view astro version (confirm current stable)
- npm view @astrojs/react version
- npm view @tailwindcss/typography version
- Check Astro docs for any Content Collections API changes since Jan 2025
- Verify astro-embed package status (may have been renamed/deprecated)

## Gaps to Address

### Areas where research was inconclusive:

1. **Package versions:** All version numbers in STACK.md are based on Jan 2025 training data. Must verify with npm registry before installation.

2. **astro-embed existence:** Referenced for portfolio embeds but package existence unverified. May need alternative approach (manual iframe wrappers + lazy loading).

3. **Data visualization requirements:** PROJECT.md mentions data visualizations but provides no specific examples or datasets. Defer until user clarifies requirements.

4. **CV page format:** Current Jekyll site has CV page but unclear if it's markdown content or PDF embed. Needs clarification before migration.

5. **Exact URL structure:** Jekyll permalink patterns need manual audit before migration. Cannot be determined from remote research.

6. **Mobile navigation pattern:** Current site uses Minimal Mistakes theme navigation. Need to determine if hamburger menu, dropdown, or other pattern best fits Astro implementation.

### Topics needing phase-specific research later:

**Phase 1 (Foundation):**
- Audit all Jekyll permalinks (manual task, can't be researched externally)
- Test Astro build output on actual GitHub Pages (empirical validation required)
- Determine exact frontmatter schema from existing content (scripting task)

**Phase 3 (Interactive Portfolio):**
- Research current code playground embed options (CodeSandbox, StackBlitz, Replit APIs)
- Investigate Chart.js alternatives if React integration proves problematic
- Determine optimal lazy loading strategy for multiple iframes
- Research CORS handling for live demo embeds

## Verification Checklist

Before finalizing roadmap, verify:

**Stack verification:**
- [ ] Current Astro stable version (likely 5.x but confirm)
- [ ] @astrojs/react current version and Astro compatibility
- [ ] Tailwind CSS and Typography plugin versions
- [ ] Octokit REST API current version
- [ ] Chart.js + react-chartjs-2 compatibility
- [ ] astro-embed package status (exists? renamed? alternatives?)

**Architecture verification:**
- [ ] Content Collections API unchanged since Jan 2025
- [ ] Island hydration directives (client:load, client:visible) still current
- [ ] GitHub Pages deployment best practices with Astro (official docs)

**Migration verification:**
- [ ] Current Jekyll site URL structure (manual audit)
- [ ] Frontmatter consistency across collections (scripting)
- [ ] Asset file locations (images/, files/)
- [ ] Custom Jekyll includes used (if any)

**GitHub Pages verification:**
- [ ] Confirm user site (bacilo.github.io) vs project site
- [ ] Verify custom domain (pedropaf.com) DNS configuration
- [ ] Test .nojekyll requirement still current

## Success Metrics

**Research completeness:**
- [x] Technology stack recommended with rationale
- [x] Feature landscape mapped (table stakes, differentiators, anti-features)
- [x] Architecture patterns documented
- [x] Domain pitfalls catalogued
- [x] Source hierarchy followed (site analysis → PROJECT.md → training data)
- [x] All findings have confidence levels
- [x] Output files created in .planning/research/
- [x] Roadmap implications documented
- [x] Verification needs flagged

**Quality indicators:**
- Comprehensive: Covered all domains (stack, features, architecture, pitfalls)
- Opinionated: Clear recommendations, not "options are X, Y, Z"
- Verified where possible: Used existing site as HIGH confidence source
- Honest about gaps: Flagged version numbers and unverified packages
- Actionable: Clear implications for roadmap phase structure

**Gaps acknowledged:**
- Package versions need npm verification
- astro-embed existence unverified
- Data visualization requirements unclear
- Some Phase 3 topics need deeper research

## Sources

**HIGH confidence sources:**
- Existing Jekyll site structure (`_config.yml`, collections, content)
- `.planning/PROJECT.md` (requirements, constraints, decisions)
- Current site file structure (verified via file system access)

**MEDIUM confidence sources:**
- Astro documentation patterns (training data through Jan 2025)
- Astro ecosystem best practices (training data)
- Jekyll to Astro migration patterns (training data + general SSG knowledge)
- Academic website requirements (domain knowledge)

**LOW confidence sources (verification needed):**
- Specific package versions (npm registry needed)
- astro-embed package (may not exist)
- Current Astro API state as of Feb 2026 (training data ends Jan 2025)

**Unavailable sources (would improve confidence):**
- Context7 library documentation
- Official Astro docs (current version)
- WebSearch for 2026 best practices
- Community discussions (GitHub issues, Discord)

**Recommendation:** Before implementing Phase 1, verify current package versions and Astro API state with official documentation.

---

## Summary for Orchestrator

**Research status:** COMPLETE

**Key deliverables:**
- STACK.md: Technology stack with versions and rationale
- FEATURES.md: Feature landscape (table stakes, differentiators, anti-features)
- ARCHITECTURE.md: System architecture and component boundaries
- PITFALLS.md: Domain pitfalls (critical, moderate, minor)
- SUMMARY.md: Executive summary with roadmap implications

**Recommended phase structure:**
1. Foundation & Core Migration (critical path)
2. Static Portfolio & Content Polish
3. Interactive Portfolio Enhancements

**Critical findings for roadmap:**
- URL preservation is critical (publications have been cited)
- Phased deployment prevents over-engineering
- Schema validation must happen early
- GitHub Pages config must be correct from start
- Interactive portfolio is enhancement, not blocker

**Verification needed before roadmap finalization:**
- npm registry for current package versions
- Astro official docs for API changes since Jan 2025
- Manual audit of Jekyll permalink patterns

**Overall assessment:** Astro is appropriate technology choice. Migration is feasible. Three-phase approach recommended. Core site can launch quickly; portfolio enhancements can follow progressively.
