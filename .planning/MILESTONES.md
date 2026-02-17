# Milestones

## v1.0 Personal Website Rebuild (Shipped: 2026-02-12)

**Phases completed:** 9 phases, 15 plans, 11 tasks

**Key accomplishments:**
- Migrated Jekyll site to Astro 5.x with content collections (15 publications, 4 talks, 5 posts)
- Deployed to GitHub Pages with automated CI/CD pipeline
- Responsive layout with navigation, author sidebar, and dark mode support
- Preserved all Jekyll URL structure for SEO and academic citations
- Blog with tag filtering, RSS feed with full content, and prose typography
- Interactive portfolio with GitHub API integration, live demo embeds, and code playgrounds

---


## v2.0 Content Management (Shipped: 2026-02-13)

**Phases completed:** 3 phases, 6 plans, 10 tasks

**Key accomplishments:**
- Deployed Sveltia CMS at /admin with GitHub PAT authentication (no backend server required)
- Validated all 26 content files across 4 collections against Zod schemas
- Configured all content types (blog, publications, talks, portfolio) with full CRUD via CMS
- Created unified build validation script for one-command content verification
- Built task-oriented CMS user guide with PAT setup, field requirements, and troubleshooting
- Validated CMS production readiness across Chrome, Firefox, and Safari

---


## v3.0 Portfolio Enhancements & Themes (Shipped: 2026-02-17)

**Phases completed:** 4 phases, 6 plans, ~30 tasks
**Git range:** feat(14-01) → feat(17-02)
**Files modified:** 16 (+779/-43 lines)

**Key accomplishments:**
- CSS theme infrastructure with 8 color palettes and FOUC-prevention via inline blocking script
- Shiki dual-theme syntax highlighting coordinated across 8 site themes via CSS variables
- Interactive theme switcher dropdown with localStorage persistence
- Copy-to-clipboard buttons with visual feedback for all code blocks
- Configurable GitHub stats (stars, downloads, both, none) with CMS editability
- CodePen/StackBlitz widget embed fields using existing PlaygroundEmbed component

---

