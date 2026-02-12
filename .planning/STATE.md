# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-11)

**Core value:** A professional online presence that showcases work and is easy to maintain with monthly content updates
**Current focus:** Phase 7 - Blog Foundation

## Current Position

Phase: 7 of 10 (Blog Foundation)
Plan: 1 of 1 in current phase
Status: Complete
Last activity: 2026-02-12 — Completed plan 07-01 (Blog Foundation)

Progress: [███████░░░] 70%

## Performance Metrics

**Velocity:**
- Total plans completed: 10
- Average duration: 8.1 minutes
- Total execution time: 1.38 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 3 | 19m | 6.3m |
| 02 | 3 | 51m | 17.0m |
| 03 | 2 | 3m | 1.5m |
| 06 | 1 | 2m | 2.0m |
| 07 | 1 | 1m | 1.0m |

**Recent Trend:**
- Last 5 plans: 03-02 (1m), 03-01 (2m), 06-01 (2m), 07-01 (1m)
- Trend: Fast execution for content-focused plans

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Astro over Jekyll: Simpler config, better interactive embed support, modern DX
- Keep bacilo.github.io: No registrar changes needed, existing URL works
- Migrate all content: User wants to preserve publication/talk history
- Portfolio embeds as enhancement: Core portfolio works with GitHub cards, interactivity layered on
- Use @astrojs/sitemap ^3.7.0: Version 4.0.0 doesn't exist yet; 3.7.0 is latest stable (01-01)
- [Phase 01-02]: Convert portfolio-2.html to portfolio-2.md for Astro content collection compatibility
- [Phase 01-03]: Replace withastro/action with manual build steps to avoid duplicate artifact upload error in GitHub Actions
- [Phase 02-01]: System font stack over web fonts for performance
- [Phase 02-01]: CSS custom properties for theming with automatic dark mode
- [Phase 02-01]: Data-driven navigation array for maintainability
- [Phase 02-01]: 768px breakpoint for mobile/desktop responsive split
- [Phase 02-02]: Use Content Layer API render() instead of entry.render() for Astro 5.x
- [Phase 02-02]: Preserve exact Jekyll URL structure for SEO and academic citations
- [Phase 02-03]: Sort all listings by date, newest first for academic convention
- [Phase 02-03]: Filter future-dated posts from blog archive for draft support
- [Phase 02-03]: Generate permalink fallback for posts to handle missing frontmatter
- [Phase 02-03]: CV placeholder now, full content deferred to later phase
- [Phase 03-02]: External links use target='_blank' rel='noopener noreferrer' for security
- [Phase 03-01]: Centralized author config in src/config/site.ts for reusability
- [Phase 03-01]: Regular img tag for public folder assets instead of Astro Image component
- [Phase 03-01]: Mobile-first responsive design with 768px breakpoint for sidebar layout
- [Phase 06-01]: Publications and Talks sections link to dedicated pages rather than embedding content
- [Phase 06-01]: Print styles hide sidebar and show link URLs for PDF export functionality
- [Phase 06-01]: CV uses placeholder content for user to replace with actual academic history
- [Phase 07-01]: Custom CSS over Tailwind Typography plugin to avoid adding Tailwind dependency
- [Phase 07-01]: Use :global() selectors for rendered markdown content within scoped styles
- [Phase 07-01]: All typography uses CSS custom properties for dark mode compatibility

### Pending Todos

None yet.

### Blockers/Concerns

**Phase 1 Considerations:**
- ~~URL preservation critical: Publications have been cited, must preserve or redirect Jekyll permalinks~~ → DEFERRED TO PHASE 2
- ~~Schema validation needed: Audit Jekyll frontmatter before defining Content Collection schemas~~ ✓ RESOLVED (01-01)
- ~~GitHub Pages configuration: User site requires no base path, .nojekyll file mandatory~~ ✓ RESOLVED (01-01)
- ~~Deployment pipeline working~~ ✓ RESOLVED (01-03)

**Phase 1 Complete:**
- Astro 5.x initialized with content collections
- All Jekyll content migrated (15 publications, 4 talks, 5 posts, 2 portfolio items, 33 static assets)
- GitHub Actions deployment pipeline functional
- Site live at bacilo.github.io and pedropaf.com
- Foundation ready for Phase 2 (content rendering and URL preservation)

**Phase 2 Complete:**
- Plan 02-01: Core layout system with responsive navigation, accessibility features, and design tokens
- BaseLayout component provides consistent site shell
- Navigation component with active state detection
- Global CSS with custom properties and dark mode support
- Plan 02-02: Dynamic routes for all content types (publications, talks, posts)
- Jekyll URL structure preserved (15 publications, 4 talks, 5 posts)
- SEO and academic citation integrity maintained
- Year/month directory structure for posts
- Plan 02-03: Content listing pages for publications, talks, and blog
- Publications listing with 15 sorted entries
- Talks listing with 4 sorted entries
- Blog archive with 4 posts (future post filtered)
- CV placeholder page
- Complete navigation flow from header through listings to individual pages

**Phase 3 Complete:**
- Plan 03-02: Homepage content with author introduction
- Homepage displays professional affiliation and research focus
- External link to Technologies in Practice group
- Plan 03-01: Author sidebar implementation
- AuthorSidebar component with profile photo, bio, social/academic links
- Sidebar integrated into BaseLayout with responsive wrapper
- Centralized author configuration in src/config/site.ts

**Phase 6 Complete:**
- Plan 06-01: CV page implementation
- Complete CV page with Education, Work Experience, Skills, Publications, Talks, Teaching, Service sections
- Print-friendly styles for PDF export
- Links to Publications and Talks pages
- Academic CV structure with placeholder content

**Phase 7 Complete:**
- Plan 07-01: Blog foundation with comprehensive prose typography
- Enhanced blog post page with complete typography CSS
- All markdown elements styled (headings, paragraphs, lists, blockquotes, code, links, images, tables, horizontal rules)
- Dark mode compatible using CSS custom properties
- Blog posts render correctly with proper styling

## Session Continuity

Last session: 2026-02-12 — Phase 07 completion
Stopped at: Completed 07-01-PLAN.md
Resume file: None
Next: Remaining phases (04, 05, 08, 09, 10)
