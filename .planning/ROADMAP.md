# Roadmap: Personal Website

## Milestones

- ✅ **v1.0 Personal Website Rebuild** — Phases 1-10 (shipped 2026-02-12)
- ✅ **v2.0 Content Management** — Phases 11-13 (shipped 2026-02-13)
- ✅ **v3.0 Portfolio Enhancements & Themes** — Phases 14-17 (shipped 2026-02-17)
- ✅ **v4.0 Immersive LEGO Theme** — Phases 18-21 (shipped 2026-02-18)
- 🚧 **v5.0 Immersive Minecraft Theme** — Phases 22-25 (in progress)

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

<details>
<summary>✅ v4.0 Immersive LEGO Theme (Phases 18-21) — SHIPPED 2026-02-18</summary>

- [x] Phase 18: CSS Foundation & Visual Transform (1/1 plan) — completed 2026-02-17
- [x] Phase 19: Brick Elements & Studs (1/1 plan) — completed 2026-02-17
- [x] Phase 20: Typography & Animations (1/1 plan) — completed 2026-02-17
- [x] Phase 21: Integration Validation (2/2 plans) — completed 2026-02-18

**Full details:** `.planning/milestones/v4.0-ROADMAP.md`

</details>

### v5.0 Immersive Minecraft Theme (In Progress)

**Milestone Goal:** Transform the Minecraft theme from a color palette swap into a fully immersive experience with pixel typography, game-UI navigation, inventory-style cards, SVG block textures, authentic decorative assets, and WCAG AA compliance throughout.

- [x] **Phase 22: Visual Foundation** — Color palette, SVG block textures, pixel fonts, contrast-safe mapping (completed 2026-02-18)
- [x] **Phase 23: Component Transforms** — Hotbar nav, inventory cards, stone buttons, tooltips, sidebar, footer, code blocks, theme switcher (completed 2026-02-18)
- [x] **Phase 24: Decorative Assets & Animations** — Mob silhouettes, tool icons, Creeper motif, XP/heart accents, hover animations (completed 2026-02-18)
- [x] **Phase 25: Validation & Polish** — WCAG contrast audit, cross-browser, mobile responsive, Lighthouse, theme switching (completed 2026-02-18)

## Phase Details

### Phase 22: Visual Foundation
**Goal**: The Minecraft theme has a complete visual base — color palette, crisp SVG block textures, pixel font stack, and verified contrast ratios — that every subsequent component can build on
**Depends on**: Phase 21 (v4.0 shipped; [data-theme="minecraft"] CSS scope established)
**Requirements**: VIS-01, VIS-02, VIS-03, VIS-04, TYPE-01, TYPE-02, TYPE-03, TYPE-04
**Success Criteria** (what must be TRUE):
  1. Activating the Minecraft theme applies the full color palette (dirt brown, grass green, stone gray, sky blue, Creeper green) site-wide with no legacy colors showing
  2. Page sections display distinct SVG block textures (dirt, stone, grass, wood, cobblestone, bedrock) that tile without seams and stay pixel-crisp at any browser zoom level
  3. H1 headings render in Silkscreen, H2-H3 in Press Start 2P, and body text in Pixelify Sans — all with disabled anti-aliasing and no font fallback visible
  4. Heading text on textured backgrounds shows a 2px 2px dark text-shadow that enhances readability without obscuring characters
  5. Every text/background combination in the Minecraft theme passes WCAG AA contrast (4.5:1 minimum) as verified by automated audit
**Plans:** 2/2 plans complete
Plans:
- [ ] 22-01-PLAN.md — SVG block textures, color palette, section texture mapping
- [ ] 22-02-PLAN.md — Pixel typography hierarchy, text-shadow, WCAG contrast verification

### Phase 23: Component Transforms
**Goal**: Every interactive page component — navigation, content cards, buttons, tooltips, sidebar, footer, code blocks, and the theme switcher — is restyled to match authentic Minecraft game UI conventions
**Depends on**: Phase 22
**Requirements**: NAV-01, NAV-02, NAV-03, CARD-01, CARD-02, CARD-03, INT-01, INT-02, INT-03, COMP-01, COMP-02, COMP-03, COMP-04
**Success Criteria** (what must be TRUE):
  1. The navigation bar looks and behaves like a Minecraft hotbar: slot borders, 3D bevel, active item highlighted with selector bracket/glow, and usable without horizontal scroll on 320px+ viewports
  2. Content cards present as inventory slots with dark backgrounds and bevel borders; hovering a card reveals a Minecraft-style tooltip (dark background, purple border, pixel font)
  3. All buttons and links display as stone buttons with raised 3D bevel; pressing one visibly inverts the bevel to simulate a press-in effect
  4. Code blocks render as command block output (orange accent, dark background, pixel mono font) with Shiki syntax highlighting intact
  5. Author sidebar, bedrock-textured footer, and theme switcher dropdown are all transformed to match Minecraft UI aesthetics
**Plans:** 3/3 plans complete
Plans:
- [ ] 23-01-PLAN.md — Hotbar navigation with slot borders, active highlight, mobile responsive
- [ ] 23-02-PLAN.md — Inventory slot cards, stone buttons, pressed bevel, reduced-motion guard
- [ ] 23-03-PLAN.md — Command block code, footer enhancement, sidebar Creeper accent, theme switcher

### Phase 24: Decorative Assets & Animations
**Goal**: The Minecraft theme is populated with authentic decorative SVG assets — Creeper motif, mob silhouettes, tool icons, XP bar accents, and health hearts — and hover animations respect the user's motion preferences
**Depends on**: Phase 23
**Requirements**: DECOR-01, DECOR-02, DECOR-03, DECOR-04, DECOR-05, INT-03
**Success Criteria** (what must be TRUE):
  1. A Creeper face SVG appears as a recognizable recurring accent in both the sidebar and footer
  2. Zombie, enderman, and chicken mob silhouette SVGs appear as decorative accents in appropriate page sections
  3. Sword and pickaxe tool icon SVGs serve as section dividers or accents, reinforcing the Minecraft aesthetic
  4. An XP bar element in XP green (#7fcc19) appears beneath section headings, and health bar heart SVGs appear as decorative elements
  5. All hover animations (buttons, cards, interactive elements) play smoothly under normal settings and instantly snap to their end state when `prefers-reduced-motion: reduce` is set
**Plans:** 2/2 plans complete
Plans:
- [ ] 24-01-PLAN.md — SVG asset creation (mob silhouettes, tool icons, health hearts)
- [ ] 24-02-PLAN.md — CSS decoration wiring, XP bar, footer accents, INT-03 audit

### Phase 25: Validation & Polish
**Goal**: The completed Minecraft theme is verified clean — no style leakage to other themes, fully responsive at 320px+, and within 10 Lighthouse points of the non-themed baseline
**Depends on**: Phase 24
**Requirements**: QUAL-01, QUAL-02, QUAL-03
**Success Criteria** (what must be TRUE):
  1. Switching FROM the Minecraft theme to any other theme (light, dark, sepia, retro terminal, LEGO, synthwave, auto) produces a visually clean result with zero Minecraft styles visible
  2. Every themed element renders without overlapping or truncation on a 320px-wide viewport
  3. Lighthouse performance score with the Minecraft theme active is within 10 points of the score with no theme active
**Plans:** 2/2 plans complete
Plans:
- [ ] 25-01-PLAN.md — CSS leakage audit and defensive 320px responsive fixes
- [ ] 25-02-PLAN.md — Lighthouse performance comparison and visual verification checkpoint

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
| 18. CSS Foundation & Visual Transform | v4.0 | 1/1 | Complete | 2026-02-17 |
| 19. Brick Elements & Studs | v4.0 | 1/1 | Complete | 2026-02-17 |
| 20. Typography & Animations | v4.0 | 1/1 | Complete | 2026-02-17 |
| 21. Integration Validation | v4.0 | 2/2 | Complete | 2026-02-18 |
| 22. Visual Foundation | v5.0 | 2/2 | Complete | 2026-02-18 |
| 23. Component Transforms | v5.0 | 3/3 | Complete | 2026-02-18 |
| 24. Decorative Assets & Animations | v5.0 | 2/2 | Complete | 2026-02-18 |
| 25. Validation & Polish | 2/2 | Complete   | 2026-02-18 | - |

---
*Roadmap created: 2026-02-16*
*Last updated: 2026-02-18 after Phase 25 planning*
