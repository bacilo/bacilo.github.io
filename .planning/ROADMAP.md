# Roadmap: Personal Website

## Milestones

- ✅ **v1.0 Personal Website Rebuild** — Phases 1-10 (shipped 2026-02-12)
- ✅ **v2.0 Content Management** — Phases 11-13 (shipped 2026-02-13)
- ✅ **v3.0 Portfolio Enhancements & Themes** — Phases 14-17 (shipped 2026-02-17)
- 🚧 **v4.0 Immersive LEGO Theme** — Phases 18-21 (in progress)

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

<details>
<summary>✅ v3.0 Portfolio Enhancements & Themes (Phases 14-17) — SHIPPED 2026-02-17</summary>

- [x] Phase 14: Theme System Foundation (1/1 plan) — completed 2026-02-16
- [x] Phase 15: Code Highlighting Infrastructure (1/1 plan) — completed 2026-02-16
- [x] Phase 16: Interactive Features (2/2 plans) — completed 2026-02-16
- [x] Phase 17: Portfolio Enhancements (2/2 plans) — completed 2026-02-17

**Full details:** `.planning/milestones/v3.0-ROADMAP.md`

</details>

### 🚧 v4.0 Immersive LEGO Theme (In Progress)

**Milestone Goal:** Transform the LEGO theme from a color-palette swap into a fully immersive visual experience with brick-shaped elements, studs, playful fonts, and snap/bounce interactions — plus fix mobile sidebar visibility.

- [x] **Phase 18: CSS Foundation & Visual Transform** - Establish theme architecture, baseplate background, color palette, mobile sidebar fix (completed 2026-02-17)
- [x] **Phase 19: Brick Elements & Studs** - Brick-shaped cards, circular studs, navigation styling, code block treatment (completed 2026-02-17)
- [x] **Phase 20: Typography & Animations** - 3-tier font system, snap/bounce interactions, accessibility support (completed 2026-02-17)
- [ ] **Phase 21: Integration Validation** - Performance audit, cross-browser testing, WCAG compliance

## Phase Details

### Phase 18: CSS Foundation & Visual Transform
**Goal**: LEGO theme infrastructure established with baseplate environment and scoped styling system
**Depends on**: Phase 17 (v3.0 theme system)
**Requirements**: VIS-01, VIS-02, VIS-03, RESP-01
**Success Criteria** (what must be TRUE):
  1. LEGO theme applies classic primary color palette (red, blue, yellow, green) across all page elements
  2. Page background displays LEGO baseplate grid pattern when LEGO theme is active
  3. All major page elements (nav, cards, sidebar, footer, code blocks) visually respond to LEGO theme
  4. Author sidebar is hidden on mobile (≤768px) for all pages except Home
  5. No style leakage occurs when switching between LEGO and other 7 themes
**Plans**: 1 plan
Plans:
- [ ] 18-01-PLAN.md — LEGO color palette, baseplate grid, component styling, mobile sidebar fix

### Phase 19: Brick Elements & Studs
**Goal**: Content cards and navigation transform into brick-shaped elements with LEGO studs
**Depends on**: Phase 18
**Requirements**: BRICK-01, BRICK-02, BRICK-03, BRICK-04
**Success Criteria** (what must be TRUE):
  1. Content cards display brick-shaped appearance with multi-layer box-shadow depth effect
  2. Cards display circular LEGO studs on top surface created via CSS pseudo-elements
  3. Navigation items styled as brick buttons with stud overlay and pressed-state visual feedback
  4. Code blocks display brick border treatment while preserving Shiki syntax highlighting colors
  5. Pseudo-element stud patterns maintain 60fps scroll performance on mobile devices
**Plans**: 1 plan
Plans:
- [ ] 19-01-PLAN.md -- Brick depth, stud patterns, nav brick buttons, code block border treatment

### Phase 20: Typography & Animations
**Goal**: LEGO-themed typography hierarchy and playful interactions complete the immersive experience
**Depends on**: Phase 19
**Requirements**: TYPE-01, TYPE-02, TYPE-03, ANIM-01, ANIM-02
**Success Criteria** (what must be TRUE):
  1. H1 titles use bold logo-style font (Fredoka) for LEGO title appearance
  2. H2-H3 headers use brick-built style font (Slackey) for section structure
  3. Body text uses playful rounded font (Baloo 2) while maintaining readability
  4. Cards and buttons display snap/bounce hover animation with spring physics easing
  5. Hover animations respect prefers-reduced-motion with graceful fallback to instant transitions
  6. Custom fonts load without FOUT/FOIT during theme switching
**Plans**: 1 plan
Plans:
- [ ] 20-01-PLAN.md — Install LEGO fonts (Fredoka, Slackey, Baloo 2), add typography hierarchy, hover animations, and reduced-motion support

### Phase 21: Integration Validation
**Goal**: LEGO theme validated for performance, accessibility, and cross-browser compatibility
**Depends on**: Phase 20
**Requirements**: All v4.0 requirements (validation across all features)
**Success Criteria** (what must be TRUE):
  1. Lighthouse performance score remains ≥90 with LEGO theme active
  2. LEGO theme passes WCAG 2.1 Level AA compliance (contrast, reduced-motion, screen reader)
  3. All LEGO features work correctly in Chrome, Firefox, and Safari latest versions
  4. Theme switching between LEGO and all other 7 themes works without visual glitches
  5. Mobile experience (iPhone SE viewport) displays all LEGO features without layout breaks
**Plans**: TBD

## Progress

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
| 14. Theme System Foundation | v3.0 | 1/1 | Complete | 2026-02-16 |
| 15. Code Highlighting Infrastructure | v3.0 | 1/1 | Complete | 2026-02-16 |
| 16. Interactive Features | v3.0 | 2/2 | Complete | 2026-02-16 |
| 17. Portfolio Enhancements | v3.0 | 2/2 | Complete | 2026-02-17 |
| 18. CSS Foundation & Visual Transform | v4.0 | Complete    | 2026-02-17 | - |
| 19. Brick Elements & Studs | v4.0 | Complete    | 2026-02-17 | - |
| 20. Typography & Animations | v4.0 | Complete    | 2026-02-17 | - |
| 21. Integration Validation | v4.0 | 0/? | Not started | - |

---
*Roadmap created: 2026-02-16*
*Last updated: 2026-02-17 after v4.0 milestone start*
