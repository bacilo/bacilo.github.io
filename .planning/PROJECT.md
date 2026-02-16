# Personal Website Rebuild

## What This Is

A personal academic website built with Astro showcasing publications, talks, blog posts, and an interactive portfolio. Deployed to GitHub Pages at bacilo.github.io with responsive design, dark mode support, and a web-based CMS for effortless content management.

## Core Value

A professional online presence that showcases work and is easy to maintain with monthly content updates.

## Shipped

### v2.0 Content Management (2026-02-13)

**Tech stack:** Sveltia CMS (via CDN), static deployment in public/admin/
**New files:** public/admin/index.html, public/admin/config.yml, scripts/audit-frontmatter.mjs, scripts/validate-cms-content.sh, docs/CMS-USER-GUIDE.md, docs/CMS-TEST-CHECKLIST.md

**Features delivered:**
- Sveltia CMS at /admin with GitHub PAT authentication (no backend server)
- Full CRUD for all 4 content types: blog posts, publications, talks, portfolio items
- Rich text markdown editor for content body
- Media library for image uploads and insertion
- Automated content validation (frontmatter audit + Astro build)
- Task-oriented user guide with PAT setup, field requirements, and troubleshooting
- Cross-browser validated (Chrome, Firefox, Safari)

### v1.0 Personal Website Rebuild (2026-02-12)

**Tech stack:** Astro 5.x, TypeScript, GitHub Pages, CSS custom properties
**Lines of code:** ~2,400 (TypeScript/Astro)
**Content:** 15 publications, 4 talks, 5 blog posts, 2 portfolio items

**Features delivered:**
- Publications and Talks listings with preserved Jekyll URLs
- Blog with tag filtering, RSS feed, prose typography
- CV page with print-friendly styles
- Interactive portfolio with GitHub API cards, demo embeds, playground embeds
- Author sidebar with social/academic links
- Responsive design with automatic dark mode

## Requirements

### Validated

- ✓ **v1.0 INFR-01-04**: Astro site with GitHub Pages deployment, markdown authoring, content migration — v1.0
- ✓ **v1.0 NAV-01-04**: Navigation, responsive design, academic aesthetic, URL preservation — v1.0
- ✓ **v1.0 AUTH-01-04**: Author sidebar with photo, bio, social links, about page — v1.0
- ✓ **v1.0 ACAD-01-05**: Publications, talks, CV with metadata and links — v1.0
- ✓ **v1.0 BLOG-01-06**: Blog posts, tags, archive, tag filtering, RSS feed — v1.0
- ✓ **v1.0 PORT-01-05**: Portfolio cards, GitHub API integration, demo/playground embeds — v1.0
- ✓ **v2.0 CMS-01-03**: CMS admin interface with PAT auth and session persistence — v2.0
- ✓ **v2.0 BLOG-01-04**: Blog CRUD and rich text editing via CMS — v2.0
- ✓ **v2.0 PUB-01-03**: Publications CRUD via CMS — v2.0
- ✓ **v2.0 TALK-01-03**: Talks CRUD via CMS — v2.0
- ✓ **v2.0 PORT-01-03**: Portfolio CRUD via CMS — v2.0
- ✓ **v2.0 MEDIA-01-03**: Image uploads, media library, image insertion — v2.0
- ✓ **v2.0 NORM-01-04**: Frontmatter normalization for all 4 collections — v2.0

### Active

## Current Milestone: v3.0 Teaching, Portfolio Enhancements & Themes

**Goal:** Add teaching section, enhance portfolio cards with code embeds and configurable stats/downloads, and build a multi-theme system with 6-8 diverse switchable themes.

**Target features:**
- Teaching section with course listings (title, institution, semester, description), extensible for materials
- Portfolio code embeds: syntax-highlighted snippets and inline runnable widgets per card
- Portfolio configurable stats: per-card choice of stars, release downloads, both, or neither
- Theme system: 6-8 CSS variable themes (default, dark, minimal, academic, retro terminal, Minecraft/pixel, Lego/bold, synthwave) with switcher in footer/sidebar, preference persisted in localStorage

### Future (v4.0 candidates)

- [ ] CMS-04: Custom preview templates matching site styling
- [ ] CMS-05: Editorial workflow (draft/publish via PRs)
- [ ] CMS-06: Custom widgets for DOI/citation fields
- [ ] CMS-07: Relation widgets for cross-referencing content
- [ ] PORT-06: Data visualization embeds
- [ ] PORT-07: Portfolio filtering/sorting
- [ ] CONT-02: Search functionality

### Out of Scope

- Comments system — complexity not worth it for monthly updates
- Custom domain setup — bacilo.github.io works fine
- Auto-import from Google Scholar — academics need curation control
- Multi-user roles/permissions — single user only
- OAuth proxy infrastructure — PAT auth is simpler for single user
- Netlify Identity — deprecated as of 2026

## Constraints

- **Hosting**: GitHub Pages (static only)
- **Framework**: Astro
- **Content**: Markdown with YAML frontmatter
- **CMS**: Sveltia CMS (static deployment, no SSR)
- **Auth**: GitHub Personal Access Token (single user)
- **Updates**: Monthly content additions

## Context

Shipped v2.0 with Sveltia CMS integration. Total codebase ~2,400 LOC TypeScript/Astro + CMS config.
Tech stack: Astro 5.x, TypeScript, Sveltia CMS, GitHub Pages, CSS custom properties.
26 content files across 4 collections, all validated against Zod schemas.
Known tech debt: manual schema sync between content.config.ts and config.yml.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Jekyll | Better DX, interactive embed support, modern tooling | ✓ Good |
| Client-side GitHub API | Always-current data, 1-hour cache reduces rate limits | ✓ Good |
| CSS custom properties | Dark mode via prefers-color-scheme, no JS needed | ✓ Good |
| Preserve Jekyll URLs | SEO and academic citations maintained | ✓ Good |
| System font stack | No web font loading, instant rendering | ✓ Good |
| Lazy-load embeds | Performance optimization for portfolio page | ✓ Good |
| Sveltia CMS over Decap CMS | Modern successor, better UX, PAT auth built-in | ✓ Good |
| PAT auth over OAuth | Simplest for single user, no backend server needed | ✓ Good |
| Static CMS hosting | No SSR adapter, files in public/admin/ | ✓ Good |
| Schema sync via comments | Links config.yml to content.config.ts for maintenance | ✓ Good |
| gray-matter for validation | Industry-standard, CI-ready with exit codes | ✓ Good |
| Widget "text" for multi-line | Prevents truncation of citations/descriptions | ✓ Good |

---
*Last updated: 2026-02-16 after v3.0 milestone start*
