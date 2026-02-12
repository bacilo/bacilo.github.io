# Roadmap: Personal Website Rebuild

## Overview

This roadmap transforms bacilo.github.io from Jekyll to Astro through 10 phases, delivering a modern academic website with publications, talks, blog, and interactive portfolio. The approach prioritizes content migration and feature parity first, then enhances the portfolio with interactivity. Each phase delivers verifiable user-facing capabilities that build toward a professional online presence that's easy to maintain with monthly content updates.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Astro Setup** - Astro project scaffolding and deployment pipeline
- [x] **Phase 2: Core Layout & Navigation** - Base layout, navigation, and responsive design
- [x] **Phase 3: Author Profile** - Author sidebar and about page
- [x] **Phase 4: Publications** - Publications listing with metadata and links
- [x] **Phase 5: Talks** - Talks listing with metadata and links
- [x] **Phase 6: CV Page** - Academic CV page
- [x] **Phase 7: Blog Foundation** - Blog posts with tags and chronological browsing
- [ ] **Phase 8: Blog Enhancement** - Tag/category filtering and RSS feed
- [ ] **Phase 9: Static Portfolio** - Portfolio page with static project cards
- [ ] **Phase 10: Interactive Portfolio** - GitHub API integration and live embeds

## Phase Details

### Phase 1: Foundation & Astro Setup
**Goal**: Astro project is configured and deploys successfully to GitHub Pages
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04
**Success Criteria** (what must be TRUE):
  1. Astro project builds without errors locally
  2. Site deploys to GitHub Pages at bacilo.github.io
  3. User can create new markdown files with frontmatter
  4. Existing Jekyll content files are migrated to Astro structure
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Initialize Astro project with configuration and deployment workflow
- [x] 01-02-PLAN.md — Migrate Jekyll content to Astro content collections
- [x] 01-03-PLAN.md — Commit, deploy, and verify GitHub Pages deployment

### Phase 2: Core Layout & Navigation
**Goal**: Site has functional layout with navigation and responsive design
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04
**Success Criteria** (what must be TRUE):
  1. User can navigate between all site sections from any page
  2. Site works on mobile and desktop screen sizes
  3. Design maintains clean academic aesthetic
  4. URLs match Jekyll permalink structure (no broken links from old site)
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Create global styles, layout shell, and navigation components
- [x] 02-02-PLAN.md — Implement dynamic routes preserving Jekyll URL structure
- [x] 02-03-PLAN.md — Create content listing pages and verify navigation flow

### Phase 3: Author Profile
**Goal**: Users can view author information and identity throughout the site
**Depends on**: Phase 2
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. Author sidebar displays on all pages with photo, name, and bio
  2. Sidebar includes working links to Twitter, LinkedIn, and GitHub
  3. Sidebar includes working links to Google Scholar and ORCID
  4. About/home page displays author introduction and background
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — Create author sidebar component with config, social links, and layout integration
- [x] 03-02-PLAN.md — Update homepage with author introduction content

### Phase 4: Publications
**Goal**: Users can discover and access academic publications
**Depends on**: Phase 3
**Requirements**: ACAD-01, ACAD-02
**Success Criteria** (what must be TRUE):
  1. User can view publications listing sorted by date
  2. Each publication shows title, venue, publication date, and citation
  3. Each publication has working link to PDF or external paper
  4. Publications use preserved URLs from Jekyll site
**Plans**: 0 plans (satisfied by Phase 2 implementation)

Plans:
- [x] (No additional plans needed - publications listing and individual pages created in Phase 2)

### Phase 5: Talks
**Goal**: Users can discover and access presentation materials
**Depends on**: Phase 3
**Requirements**: ACAD-03, ACAD-04
**Success Criteria** (what must be TRUE):
  1. User can view talks listing sorted by date
  2. Each talk shows date, venue, and location
  3. Each talk has working link to slides or recording
  4. Talks use preserved URLs from Jekyll site
**Plans**: 0 plans (satisfied by Phase 2 implementation)

Plans:
- [x] (No additional plans needed - talks listing and individual pages created in Phase 2)

Note: Slide/recording links depend on content having slideurl field. Add to frontmatter when available.

### Phase 6: CV Page
**Goal**: Users can view comprehensive academic CV
**Depends on**: Phase 3
**Requirements**: ACAD-05
**Success Criteria** (what must be TRUE):
  1. User can navigate to CV page from main navigation
  2. CV displays academic history in readable format
  3. CV uses preserved URL from Jekyll site
**Plans**: 1 plan

Plans:
- [x] 06-01-PLAN.md — Create CV page with academic sections and print-friendly styles

### Phase 7: Blog Foundation
**Goal**: Users can read and browse blog posts
**Depends on**: Phase 3
**Requirements**: BLOG-01, BLOG-02, BLOG-03
**Success Criteria** (what must be TRUE):
  1. User can view individual blog posts with full content
  2. Each blog post displays tags
  3. User can browse all posts chronologically in archive
  4. Blog posts use preserved URLs from Jekyll site
**Plans**: 1 plan

Plans:
- [x] 07-01-PLAN.md — Complete prose typography and verify blog functionality

### Phase 8: Blog Enhancement
**Goal**: Users can discover blog content through filtering and subscription
**Depends on**: Phase 7
**Requirements**: BLOG-04, BLOG-05, BLOG-06
**Success Criteria** (what must be TRUE):
  1. User can filter blog posts by clicking a tag
  2. User can filter blog posts by category
  3. User can subscribe to blog via RSS feed
  4. RSS feed includes recent posts with full content
**Plans**: 2 plans

Plans:
- [ ] 08-01-PLAN.md — Implement tag filtering with dynamic tag pages and clickable tags
- [ ] 08-02-PLAN.md — Create RSS feed with full content and auto-discovery

### Phase 9: Static Portfolio
**Goal**: Users can view project portfolio with basic information
**Depends on**: Phase 3
**Requirements**: PORT-01, PORT-02
**Success Criteria** (what must be TRUE):
  1. User can navigate to portfolio page from main navigation
  2. Portfolio displays project cards with title, description, and links
  3. Each project card has working links to repo and/or live demo
  4. Portfolio is responsive on mobile and desktop
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 10: Interactive Portfolio
**Goal**: Portfolio showcases projects with rich, interactive features
**Depends on**: Phase 9
**Requirements**: PORT-03, PORT-04, PORT-05
**Success Criteria** (what must be TRUE):
  1. GitHub repo cards display stars, language, and description fetched from API
  2. Portfolio includes live demo embeds loaded in iframes
  3. Portfolio includes code playground embeds for interactive examples
  4. Interactive elements lazy load and work on mobile
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Astro Setup | 3/3 | Complete | 2026-02-12 |
| 2. Core Layout & Navigation | 3/3 | Complete | 2026-02-12 |
| 3. Author Profile | 2/2 | Complete | 2026-02-12 |
| 4. Publications | 0/0 | Complete (Phase 2) | 2026-02-12 |
| 5. Talks | 0/0 | Complete (Phase 2) | 2026-02-12 |
| 6. CV Page | 1/1 | Complete | 2026-02-12 |
| 7. Blog Foundation | 1/1 | Complete | 2026-02-12 |
| 8. Blog Enhancement | 0/2 | Planned | - |
| 9. Static Portfolio | 0/? | Not started | - |
| 10. Interactive Portfolio | 0/? | Not started | - |
