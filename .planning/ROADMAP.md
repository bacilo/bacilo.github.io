# Roadmap: Personal Website

## Milestones

- ✅ **v1.0 Personal Website Rebuild** — Phases 1-10 (shipped 2026-02-12)
- ✅ **v2.0 Content Management** — Phases 11-13 (shipped 2026-02-13)
- 🚧 **v3.0 Portfolio Enhancements & Themes** — Phases 14-17 (in progress)

## Overview

Milestone v3.0 enhances the existing academic website with three major feature sets: a multi-theme CSS system (8 switchable themes with localStorage persistence), portfolio code embeds (syntax-highlighted snippets with copy buttons and runnable widget iframes), and configurable GitHub stats (per-card control of stars/downloads display). All features build on existing patterns (CSS custom properties, GitHub API caching, component composition) with zero new npm dependencies.

## Phases

<details>
<summary>✅ v1.0 Personal Website Rebuild (Phases 1-10) — SHIPPED 2026-02-12</summary>

- [x] Phase 1: Foundation & Astro Setup (3/3 plans) — completed 2026-02-12
- [x] Phase 2: Core Layout & Navigation (3/3 plans) — completed 2026-02-12
- [x] Phase 3: Author Profile (2/2 plans) — completed 2026-02-12
- [x] Phase 4: Publications (0/0 plans, satisfied by Phase 2) — completed 2026-02-12
- [x] Phase 5: Talks (0/0 plans, satisfied by Phase 2) — completed 2026-02-12
- [x] Phase 6: CV Page (1/1 plan) — completed 2026-02-12
- [x] Phase 7: Blog Foundation (1/1 plan) — completed 2026-02-12
- [x] Phase 8: Blog Enhancement (2/2 plans) — completed 2026-02-12
- [x] Phase 9: Static Portfolio (1/1 plan) — completed 2026-02-12
- [x] Phase 10: Interactive Portfolio (2/2 plans) — completed 2026-02-12

**Full details:** `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>✅ v2.0 Content Management (Phases 11-13) — SHIPPED 2026-02-13</summary>

- [x] Phase 11: Content Audit & CMS Setup (2/2 plans) — completed 2026-02-13
- [x] Phase 12: Complete Content Coverage (2/2 plans) — completed 2026-02-13
- [x] Phase 13: Documentation & Testing (2/2 plans) — completed 2026-02-13

**Full details:** `.planning/milestones/v2.0-ROADMAP.md`

</details>

### 🚧 v3.0 Portfolio Enhancements & Themes (In Progress)

**Milestone Goal:** Add multi-theme CSS system with 8 switchable themes, portfolio code embeds with syntax highlighting, and configurable GitHub stats display.

- [x] **Phase 14: Theme System Foundation** - CSS themes infrastructure with 8 theme definitions and FOUC prevention (completed 2026-02-16)
- [x] **Phase 15: Code Highlighting Infrastructure** - Shiki configuration and code display components (completed 2026-02-16)
- [x] **Phase 16: Interactive Features** - Theme switcher UI and code copy buttons (completed 2026-02-16)
- [x] **Phase 17: Portfolio Enhancements** - Configurable stats and code embeds in portfolio cards (completed 2026-02-17)

## Phase Details

### Phase 14: Theme System Foundation
**Goal**: Site supports 8 CSS themes with automatic theme detection and no flash of unstyled content
**Depends on**: Nothing (first phase of v3.0)
**Requirements**: THEME-01, THEME-04, THEME-05
**Success Criteria** (what must be TRUE):
  1. User viewing site sees one of 8 themes applied consistently across all pages
  2. User with dark mode system preference sees dark theme by default (auto mode)
  3. User with light mode system preference sees light theme by default (auto mode)
  4. User never sees flash of wrong theme on page load
  5. All 8 themes render text readably with sufficient contrast
**Plans:** 1/1 plans complete

Plans:
- [ ] 14-01-PLAN.md — CSS theme definitions (8 themes) and FOUC-prevention inline script

### Phase 15: Code Highlighting Infrastructure
**Goal**: Site displays syntax-highlighted code snippets in portfolio with zero client-side JavaScript
**Depends on**: Phase 14 (theme coordination for code highlighting)
**Requirements**: CODE-01, CODE-04
**Success Criteria** (what must be TRUE):
  1. User viewing portfolio cards sees syntax-highlighted code snippets with proper colors
  2. Code highlighting theme coordinates with site theme (light code blocks in light theme, dark in dark theme)
  3. Code highlighting works in markdown code fences across entire site
  4. Code blocks render with no client-side JavaScript execution
**Plans:** 1/1 plans complete

Plans:
- [ ] 15-01-PLAN.md — Shiki dual-theme config, theme-coordination CSS, and page style updates

### Phase 16: Interactive Features
**Goal**: User can switch themes manually and copy code snippets with one click
**Depends on**: Phase 14 (theme system), Phase 15 (code blocks)
**Requirements**: THEME-02, THEME-03, CODE-02
**Success Criteria** (what must be TRUE):
  1. User can open theme switcher from any page
  2. User can select any of 8 themes and see change apply immediately
  3. User can reload browser and see previously selected theme still active
  4. User can click copy button on code block and paste snippet successfully
  5. User switching themes sees code highlighting update to match new theme
**Plans:** 2/2 plans complete

Plans:
- [ ] 16-01-PLAN.md — Theme switcher dropdown component with localStorage persistence
- [ ] 16-02-PLAN.md — Copy-to-clipboard buttons for code blocks

### Phase 17: Portfolio Enhancements
**Goal**: Portfolio cards display configurable GitHub stats and embedded code examples
**Depends on**: Phase 15 (code highlighting)
**Requirements**: STAT-01, STAT-02, STAT-03, CODE-03
**Success Criteria** (what must be TRUE):
  1. User viewing portfolio card sees GitHub stars count (when configured to show)
  2. User viewing portfolio card sees release download count (when configured to show)
  3. Portfolio card author can configure stats display per card (stars, downloads, both, or none) via CMS
  4. User viewing portfolio card with code embed sees syntax-highlighted snippet
  5. User viewing portfolio card with widget embed sees runnable code demo in iframe
**Plans:** 2/2 plans complete

Plans:
- [ ] 17-01-PLAN.md — Configurable GitHub stats (schema, CMS, Releases API, GitHubCard)
- [ ] 17-02-PLAN.md — Widget embed integration (CodePen/StackBlitz fields and rendering)

## Progress

**Execution Order:**
Phases execute in numeric order: 14 → 15 → 16 → 17

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Astro Setup | v1.0 | 3/3 | Complete | 2026-02-12 |
| 2. Core Layout & Navigation | v1.0 | 3/3 | Complete | 2026-02-12 |
| 3. Author Profile | v1.0 | 2/2 | Complete | 2026-02-12 |
| 4. Publications | v1.0 | 0/0 | Complete | 2026-02-12 |
| 5. Talks | v1.0 | 0/0 | Complete | 2026-02-12 |
| 6. CV Page | v1.0 | 1/1 | Complete | 2026-02-12 |
| 7. Blog Foundation | v1.0 | 1/1 | Complete | 2026-02-12 |
| 8. Blog Enhancement | v1.0 | 2/2 | Complete | 2026-02-12 |
| 9. Static Portfolio | v1.0 | 1/1 | Complete | 2026-02-12 |
| 10. Interactive Portfolio | v1.0 | 2/2 | Complete | 2026-02-12 |
| 11. Content Audit & CMS Setup | v2.0 | 2/2 | Complete | 2026-02-13 |
| 12. Complete Content Coverage | v2.0 | 2/2 | Complete | 2026-02-13 |
| 13. Documentation & Testing | v2.0 | 2/2 | Complete | 2026-02-13 |
| 14. Theme System Foundation | v3.0 | Complete    | 2026-02-16 | - |
| 15. Code Highlighting Infrastructure | v3.0 | Complete    | 2026-02-16 | - |
| 16. Interactive Features | v3.0 | Complete    | 2026-02-16 | - |
| 17. Portfolio Enhancements | v3.0 | Complete    | 2026-02-17 | - |

---
*Roadmap created: 2026-02-16*
*Last updated: 2026-02-16*
