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


## v4.0 Immersive LEGO Theme (Shipped: 2026-02-18)

**Phases completed:** 4 phases, 5 plans, 11 tasks
**Git range:** 24ff92e → f39174f (40 commits)
**Files modified:** 28 (+7,984/-122 lines)

**Key accomplishments:**
- Classic LEGO primary color palette (red/blue/yellow/green) with 24px baseplate grid environment across all page elements
- Brick-shaped cards with multi-layer box-shadow depth and circular stud patterns via CSS pseudo-elements
- Navigation styled as tactile brick buttons with 34ms pressed-state feedback and stud overlays
- Three-tier LEGO typography (Fredoka H1, Slackey H2-H3, Baloo 2 body) via self-hosted Fontsource fonts
- Spring-physics bounce hover animations with prefers-reduced-motion accessibility fallback
- Full validation: 13/13 requirements verified, WCAG AA contrast pass, Lighthouse 89/100, cross-browser confirmed

---


## v5.0 Immersive Minecraft Theme (Shipped: 2026-02-18)

**Phases completed:** 4 phases, 9 plans, 18 tasks
**Git range:** 9ab5bfd → a3f8272 (35 commits)
**Files modified:** 50 (+28,291/-96 lines)

**Key accomplishments:**
- Complete Minecraft visual foundation — color palette, 6 SVG block textures (dirt/stone/grass/wood/cobblestone/bedrock), pixel font stack (Silkscreen, Press Start 2P, Pixelify Sans) with WCAG AA contrast verification
- Hotbar navigation with slot borders and 3D bevel, inventory slot cards with Minecraft-style tooltips, stone buttons with pressed-state bevel inversion
- Command block code styling preserving Shiki syntax highlighting, bedrock-textured footer, Creeper face sidebar accent, themed switcher dropdown
- 7 pixel-art SVG decorative assets (zombie/enderman/chicken silhouettes, sword/pickaxe tools, health hearts) wired via CSS pseudo-elements
- XP bar accents under headings, repeating sword HR dividers, 5-heart footer health row — all decorative, no layout impact
- Zero CSS leakage verified (85 scoped selectors), 320px responsive with word-break fixes, Lighthouse within 4 points of no-theme baseline

---

