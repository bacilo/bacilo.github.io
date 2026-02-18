# Personal Website Rebuild

## What This Is

A personal academic website built with Astro showcasing publications, talks, blog posts, and an interactive portfolio. Deployed to GitHub Pages at bacilo.github.io with 8 switchable CSS themes including immersive LEGO (brick shapes, studs, playful fonts) and Minecraft (pixel typography, hotbar nav, inventory cards, SVG block textures, decorative assets) experiences, syntax-highlighted code embeds, configurable GitHub stats, and a web-based CMS for effortless content management.

## Core Value

A professional online presence that showcases work and is easy to maintain with monthly content updates.

## Shipped

### v4.0 Immersive LEGO Theme (2026-02-18)

**Tech stack:** CSS custom properties (scoped theme overrides), Fontsource (self-hosted fonts), CSS pseudo-elements
**Files modified:** 28 (+7,984/-122 lines)

**Features delivered:**
- LEGO theme with classic primary color palette (red/blue/yellow/green) and 24px baseplate grid
- Brick-shaped cards with multi-layer box-shadow depth and circular stud patterns via CSS pseudo-elements
- Navigation styled as tactile brick buttons with 34ms pressed-state feedback and stud overlays
- Three-tier LEGO typography: Fredoka (H1), Slackey (H2-H3), Baloo 2 (body) via Fontsource
- Spring-physics bounce hover animations with prefers-reduced-motion accessibility fallback
- Mobile sidebar hidden on non-Home pages for better content visibility
- Full validation: 13/13 requirements, WCAG AA contrast, Lighthouse 89/100, cross-browser confirmed

### v3.0 Portfolio Enhancements & Themes (2026-02-17)

**Tech stack:** CSS custom properties (themes), Shiki (syntax highlighting), Clipboard API
**Files modified:** 16 (+779/-43 lines)

**Features delivered:**
- 8 switchable CSS themes (auto, light, dark, sepia, retro terminal, Minecraft, Lego, synthwave) with FOUC prevention
- Shiki dual-theme syntax highlighting coordinated across all 8 site themes
- Interactive theme switcher dropdown with localStorage persistence
- Copy-to-clipboard buttons with visual feedback for all code blocks
- Configurable GitHub stats per portfolio card (stars, downloads, both, none) via CMS
- CodePen/StackBlitz widget embed fields for portfolio items

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
- ✓ **v3.0 CODE-01-04**: Syntax-highlighted code embeds, copy buttons, widget iframes, site-wide Shiki — v3.0
- ✓ **v3.0 STAT-01-03**: Configurable stats display (stars/downloads), Releases API, CMS editability — v3.0
- ✓ **v3.0 THEME-01-05**: 8 CSS themes, switcher dropdown, localStorage persistence, FOUC prevention, auto mode — v3.0
- ✓ **v4.0 VIS-01-03**: LEGO color palette, baseplate grid, component visual transform — v4.0
- ✓ **v4.0 BRICK-01-04**: Brick depth, stud patterns, nav brick buttons, code block treatment — v4.0
- ✓ **v4.0 TYPE-01-03**: LEGO typography hierarchy (Fredoka, Slackey, Baloo 2) — v4.0
- ✓ **v4.0 ANIM-01-02**: Bounce hover animations with reduced-motion fallback — v4.0
- ✓ **v4.0 RESP-01**: Mobile sidebar hidden on non-Home pages — v4.0
- ✓ **v5.0 VIS-01-04**: Minecraft color palette, SVG block textures, pixel-crisp rendering, WCAG AA contrast — v5.0
- ✓ **v5.0 TYPE-01-04**: Pixel typography (Silkscreen, Press Start 2P, Pixelify Sans), text-shadow — v5.0
- ✓ **v5.0 NAV-01-03**: Hotbar navigation with slot borders, active highlight, mobile responsive — v5.0
- ✓ **v5.0 CARD-01-03**: Inventory slot cards with tooltips, responsive grid — v5.0
- ✓ **v5.0 INT-01-03**: Stone buttons with pressed bevel, reduced-motion guard — v5.0
- ✓ **v5.0 DECOR-01-05**: Creeper motif, mob silhouettes, tool icons, XP bar, health hearts — v5.0
- ✓ **v5.0 COMP-01-04**: Command block code, bedrock footer, Creeper sidebar, themed switcher — v5.0
- ✓ **v5.0 QUAL-01-03**: Zero CSS leakage, 320px responsive, Lighthouse within 4 points — v5.0

### Active

### Future (candidates)

- [ ] TEACH-01-04: Teaching section with course listings and CMS integration
- [ ] CMS-04: Custom preview templates matching site styling
- [ ] CMS-05: Editorial workflow (draft/publish via PRs)
- [ ] CMS-06: Custom widgets for DOI/citation fields
- [ ] CMS-07: Relation widgets for cross-referencing content
- [ ] CODE-05: Code diff view for before/after snippets
- [ ] STAT-04: Authenticated GitHub API for higher rate limits
- [ ] THEME-06: Custom theme creator UI
- [ ] THEME-07: Theme preview before switching
- [ ] PORT-06: Data visualization embeds
- [ ] PORT-07: Portfolio filtering/sorting
- [ ] CONT-02: Search functionality
- [ ] BRICK-05-07: Advanced LEGO brick elements (sidebar panel, footer, varied stud patterns)
- [ ] ANIM-03-04: LEGO building animation and instruction manual styling
- [x] IMMERSIVE-01: Minecraft theme immersive transform (→ v5.0, shipped)
- [ ] IMMERSIVE-02: Synthwave theme immersive transform

### Out of Scope

- Comments system — complexity not worth it for monthly updates
- Custom domain setup — bacilo.github.io works fine
- Auto-import from Google Scholar — academics need curation control
- Multi-user roles/permissions — single user only
- OAuth proxy infrastructure — PAT auth is simpler for single user
- Netlify Identity — deprecated as of 2026
- Animated studs / physical brick textures / sound effects — accessibility and performance concerns
- LEGO theme dark mode variant — requires research, low demand

## Constraints

- **Hosting**: GitHub Pages (static only)
- **Framework**: Astro
- **Content**: Markdown with YAML frontmatter
- **CMS**: Sveltia CMS (static deployment, no SSR)
- **Auth**: GitHub Personal Access Token (single user)
- **Updates**: Monthly content additions

## Context

Shipped v5.0 with immersive Minecraft theme. Total codebase ~4,900 LOC TypeScript/Astro/CSS.
Tech stack: Astro 5.x, TypeScript, Sveltia CMS, Shiki, Fontsource, GitHub Pages, CSS custom properties.
26 content files across 4 collections, all validated against Zod schemas.
Known tech debt: manual schema sync between content.config.ts and config.yml.
Two immersive themes shipped (LEGO + Minecraft) — pattern proven repeatable for Synthwave, Retro Terminal if desired.
650 lines of Minecraft CSS (minecraft.css), 14 SVG pixel-art assets, 85 scoped selectors with zero leakage.
Font payload (~230KB total Fontsource across LEGO + Minecraft fonts); Lighthouse 40-44/100 range (acceptable for theme-heavy pages).

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
| 8 CSS themes via custom properties | Zero dependencies, builds on existing pattern | ✓ Good |
| Inline FOUC-prevention script | Earliest execution, no layout shift | ✓ Good |
| Shiki dual-theme (github-light/dark) | Broad familiarity, maps cleanly to 8 site themes | ✓ Good |
| Reuse PlaygroundEmbed for widgets | No new components, consistent embed behavior | ✓ Good |
| Default statsDisplay to 'stars' | Backward compatible with existing portfolio items | ✓ Good |
| Copy buttons via opacity transition | Clean appearance, progressive enhancement | ✓ Good |
| 24px LEGO baseplate grid | 3x research suggestion for subtle, professional look | ✓ Good |
| Component-scoped [data-theme] overrides | Zero style leakage between themes | ✓ Good |
| Multi-layer box-shadow (3 desktop, 2 mobile) | Tactile brick depth without performance cost | ✓ Good |
| 34ms nav button transition | Matches physical LEGO brick press duration | ✓ Good |
| Static fonts over variable (170KB vs 240KB) | Only specific weights needed, smaller payload | ✓ Good |
| cubic-bezier bounce over CSS linear() | 99% browser support vs 75%, perceptually equivalent | ✓ Good |
| Accept Lighthouse 89/100 | All Core Web Vitals green, font payload justified | ✓ Good |
| Fontsource pixel fonts (Silkscreen, Press Start 2P, Pixelify Sans) | Same pattern as LEGO, ~60KB total, self-hosted | ✓ Good |
| SVG pixel-art textures/assets (14 files, ~11KB) | No npm deps, image-rendering: pixelated for crisp display | ✓ Good |
| CSS pseudo-elements for decorative assets | Zero HTML changes, pure CSS, no layout impact | ✓ Good |
| nav:not(.author-links) scoping | Prevents hotbar rules from affecting sidebar navigation | ✓ Good |
| Transitions inside prefers-reduced-motion only | Accessible by default, progressive enhancement | ✓ Good |
| Press Start 2P font-weight 400 only | Bitmap font — synthetic bold at 700 causes artifacts | ✓ Good |
| word-break on pixel-font headings | Bitmap fonts can't naturally break — prevents 320px overflow | ✓ Good |

---
*Last updated: 2026-02-18 after v5.0 milestone shipped*
