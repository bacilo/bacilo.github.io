# Requirements: Immersive LEGO Theme

**Defined:** 2026-02-17
**Core Value:** A professional online presence that showcases work and is easy to maintain with monthly content updates

## v1 Requirements

Requirements for v4.0 milestone. Each maps to roadmap phases.

### Visual Foundation

- [ ] **VIS-01**: LEGO theme applies classic primary color palette (red, blue, yellow, green on light gray) across all page elements
- [ ] **VIS-02**: Page background displays LEGO baseplate grid pattern when theme is active
- [ ] **VIS-03**: All page elements (nav, cards, sidebar, footer, code blocks) visually transform under LEGO theme

### Brick Elements

- [ ] **BRICK-01**: Content cards display brick-shaped appearance with multi-layer box-shadow depth effect
- [ ] **BRICK-02**: Cards display circular LEGO studs on top surface via CSS pseudo-elements
- [ ] **BRICK-03**: Navigation items styled as brick buttons with stud overlay and pressed-state feedback
- [ ] **BRICK-04**: Code blocks display brick border treatment while preserving Shiki syntax highlighting

### Typography

- [ ] **TYPE-01**: H1 titles use bold logo-style font (Fredoka) for LEGO title appearance
- [ ] **TYPE-02**: H2-H3 headers use brick-built style font (Slackey) for section structure
- [ ] **TYPE-03**: Body text uses playful rounded font (Baloo 2) maintaining readability

### Interactions

- [ ] **ANIM-01**: Cards and buttons display snap/bounce hover animation with spring physics easing
- [ ] **ANIM-02**: Hover animations respect prefers-reduced-motion with graceful fallback

### Responsive

- [ ] **RESP-01**: Author sidebar is hidden on mobile (≤768px) for all pages except Home

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Brick Elements

- **BRICK-05**: Sidebar styled as vertical brick panel with studs (desktop)
- **BRICK-06**: Footer displays brick transformation treatment
- **BRICK-07**: Advanced stud patterns with varied counts based on element size

### Interactions

- **ANIM-03**: Page load "building" animation for LEGO theme
- **ANIM-04**: LEGO instruction manual styling for ordered lists

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Animated studs (rotating, pulsing) | Visual noise, distracts from content, accessibility issues |
| Physical brick textures (photos) | Large image files, doesn't scale, cluttered on text-heavy pages |
| Sound effects (clicking, snapping) | Unexpected audio is jarring, accessibility nightmare |
| 3D perspective transforms on everything | Performance drain, text readability suffers, nauseating on scroll |
| LEGO minifig cursors | Breaks user expectation, accessibility violation |
| LEGO theme dark mode variant | Requires research into dark LEGO aesthetics; low demand |
| Brick color randomization | Fun but hurts readability/consistency |
| Other theme immersive transforms | LEGO is proof of concept; others (Minecraft, Synthwave) are future milestones |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| VIS-01 | Phase 18 | Pending |
| VIS-02 | Phase 18 | Pending |
| VIS-03 | Phase 18 | Pending |
| RESP-01 | Phase 18 | Pending |
| BRICK-01 | Phase 19 | Pending |
| BRICK-02 | Phase 19 | Pending |
| BRICK-03 | Phase 19 | Pending |
| BRICK-04 | Phase 19 | Pending |
| TYPE-01 | Phase 20 | Pending |
| TYPE-02 | Phase 20 | Pending |
| TYPE-03 | Phase 20 | Pending |
| ANIM-01 | Phase 20 | Pending |
| ANIM-02 | Phase 20 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13 (100% coverage)
- Unmapped: 0

**Phase coverage:**
- Phase 18: 4 requirements (VIS-01, VIS-02, VIS-03, RESP-01)
- Phase 19: 4 requirements (BRICK-01, BRICK-02, BRICK-03, BRICK-04)
- Phase 20: 5 requirements (TYPE-01, TYPE-02, TYPE-03, ANIM-01, ANIM-02)
- Phase 21: Validation across all 13 requirements

---
*Requirements defined: 2026-02-17*
*Last updated: 2026-02-17 after roadmap creation (100% coverage achieved)*
