# Personal Website Rebuild

## What This Is

A personal academic website rebuilt with Astro to showcase publications, talks, blog posts, and portfolio projects. Replaces the current Jekyll/Minimal Mistakes site with modern tooling while maintaining the clean academic aesthetic. Deployed to GitHub Pages at bacilo.github.io.

## Core Value

A professional online presence that showcases work and is easy to maintain with monthly content updates.

## Requirements

### Validated

<!-- Existing capabilities from current Jekyll site -->

- ✓ Publications listing with metadata (title, venue, date, links) — existing
- ✓ Talks listing with metadata — existing
- ✓ Blog posts with tags and chronological archive — existing
- ✓ Author profile sidebar with bio, photo, social links — existing
- ✓ About/home page — existing
- ✓ CV page — existing
- ✓ Responsive design (mobile/desktop) — existing
- ✓ GitHub Pages deployment — existing

### Active

<!-- New requirements for this rebuild -->

- [ ] Astro-based static site generator
- [ ] Clean academic design (similar aesthetic to current)
- [ ] Publications page with migrated content
- [ ] Talks page with migrated content
- [ ] Blog with migrated posts
- [ ] Portfolio page with project cards
- [ ] Portfolio: GitHub repo cards with stats
- [ ] Portfolio: Live demo embeds (iframe-based)
- [ ] Portfolio: Code playground embeds
- [ ] Portfolio: Data visualization embeds
- [ ] Author sidebar profile component
- [ ] Navigation with all sections
- [ ] Content migration from Jekyll markdown
- [ ] Easy content authoring (markdown + frontmatter)

### Out of Scope

- Teaching section — not needed for current goals
- Comments system — complexity not worth it for monthly updates
- Search functionality — site is small enough to browse
- Custom domain setup — sticking with bacilo.github.io
- Analytics — can add later if needed
- Dark mode — nice to have but not essential

## Context

**Current state:** Jekyll site using Minimal Mistakes theme. Content exists in markdown files with YAML frontmatter. Collections for publications, talks, portfolio, teaching.

**Content to migrate:**
- `_publications/` — academic papers with citations
- `_talks/` — presentations with dates and venues
- `_posts/` — blog posts
- `images/` — profile photo and assets
- `files/` — PDFs and downloadable content

**Technical context:** User updates content monthly. Interactive portfolio embeds are nice-to-have, not critical path. GitHub Pages handles deployment automatically on push.

## Constraints

- **Hosting**: GitHub Pages — must work with static hosting, no server-side logic
- **Framework**: Astro — user preference for modern tooling
- **Aesthetic**: Similar to current — clean academic, not a dramatic redesign
- **Content format**: Markdown with frontmatter — familiar workflow from Jekyll

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Jekyll | Simpler config, better interactive embed support, modern DX | — Pending |
| Keep bacilo.github.io | No registrar changes needed, existing URL works | — Pending |
| Migrate all content | User wants to preserve publication/talk history | — Pending |
| Portfolio embeds as enhancement | Core portfolio works with GitHub cards, interactivity layered on | — Pending |

---
*Last updated: 2026-02-11 after initialization*
