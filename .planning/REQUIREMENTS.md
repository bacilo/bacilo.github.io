# Requirements: Personal Website v3.0

**Defined:** 2026-02-16
**Core Value:** A professional online presence that showcases work and is easy to maintain with monthly content updates

## v3.0 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Code Embeds

- [ ] **CODE-01**: Portfolio cards display syntax-highlighted code snippets with Shiki at build time
- [ ] **CODE-02**: Code snippets include a copy-to-clipboard button
- [ ] **CODE-03**: Portfolio cards can embed runnable widget iframes (CodePen, StackBlitz, etc.)
- [ ] **CODE-04**: Astro's built-in Shiki is configured site-wide for markdown code fences

### Portfolio Stats

- [ ] **STAT-01**: Each portfolio item can configure stats display (stars, downloads, both, or none) via frontmatter
- [ ] **STAT-02**: Portfolio cards fetch and display release download counts from GitHub Releases API
- [ ] **STAT-03**: Stats display configuration is editable via Sveltia CMS

### Theme System

- [ ] **THEME-01**: Site offers 8 switchable CSS themes: auto, light, dark, sepia, retro terminal, Minecraft/pixel, Lego/bold, synthwave
- [ ] **THEME-02**: User can switch themes via a dropdown in footer or sidebar
- [ ] **THEME-03**: Selected theme persists across page loads via localStorage
- [ ] **THEME-04**: Theme applies before first paint (no flash of unstyled content)
- [ ] **THEME-05**: Auto theme respects system prefers-color-scheme preference

## Future Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Teaching

- **TEACH-01**: Teaching section with course listings (title, institution, semester, description)
- **TEACH-02**: Teaching link in site navigation
- **TEACH-03**: Teaching collection in Sveltia CMS for web-based editing
- **TEACH-04**: Extensible for materials (syllabi, slides) in future

### Portfolio Enhancements

- **CODE-05**: Code diff view for before/after snippets
- **STAT-04**: Authenticated GitHub API for higher rate limits (5000 req/hr)

### Theme Enhancements

- **THEME-06**: Custom theme creator UI
- **THEME-07**: Theme preview before switching

## Out of Scope

| Feature | Reason |
|---------|--------|
| Runnable code execution (eval/Function) | Security risk (XSS/CSP), use iframe sandboxes instead |
| React/Svelte syntax highlighters | Shiki built into Astro, no framework needed |
| CSS-in-JS theme libraries | CSS custom properties sufficient, no framework needed |
| Octokit packages | Native fetch matches existing pattern, avoids 300KB dependency |
| Build-time GitHub pre-fetching | Client-side with cache works for current scale |
| Multi-user theme preferences | Single user site, localStorage sufficient |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CODE-01 | — | Pending |
| CODE-02 | — | Pending |
| CODE-03 | — | Pending |
| CODE-04 | — | Pending |
| STAT-01 | — | Pending |
| STAT-02 | — | Pending |
| STAT-03 | — | Pending |
| THEME-01 | — | Pending |
| THEME-02 | — | Pending |
| THEME-03 | — | Pending |
| THEME-04 | — | Pending |
| THEME-05 | — | Pending |

**Coverage:**
- v3.0 requirements: 12 total
- Mapped to phases: 0
- Unmapped: 12 ⚠️

---
*Requirements defined: 2026-02-16*
*Last updated: 2026-02-16 after initial definition*
