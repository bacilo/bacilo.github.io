# Personal Website Rebuild

## What This Is

A personal academic website built with Astro showcasing publications, talks, blog posts, and an interactive portfolio. Deployed to GitHub Pages at bacilo.github.io with responsive design and dark mode support.

## Core Value

A professional online presence that showcases work and is easy to maintain with monthly content updates.

## Current Milestone: v2.0 Content Management

**Goal:** Enable web-based content editing so updates feel effortless instead of requiring IDE workflow.

**Target features:**
- Decap CMS integration with `/admin` interface
- Editable collections: blog posts, publications, talks, portfolio items
- Editable settings: social links, about/bio
- Rich text editing for blog posts
- Image uploads via CMS
- GitHub OAuth via Netlify Identity

## Shipped (v1.0)

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

### Validated (v1.0)

- ✓ **INFR-01-04**: Astro site with GitHub Pages deployment, markdown authoring, content migration
- ✓ **NAV-01-04**: Navigation, responsive design, academic aesthetic, URL preservation
- ✓ **AUTH-01-04**: Author sidebar with photo, bio, social links, about page
- ✓ **ACAD-01-05**: Publications, talks, CV with metadata and links
- ✓ **BLOG-01-06**: Blog posts, tags, archive, tag filtering, RSS feed
- ✓ **PORT-01-05**: Portfolio cards, GitHub API integration, demo/playground embeds

### Active (v2.0)

- [ ] CMS-01: Decap CMS integration with /admin interface
- [ ] CMS-02: Blog posts editable via CMS
- [ ] CMS-03: Publications editable via CMS
- [ ] CMS-04: Talks editable via CMS
- [ ] CMS-05: Portfolio items editable via CMS
- [ ] CMS-06: Social links/about editable via CMS
- [ ] CMS-07: Image uploads through CMS
- [ ] CMS-08: GitHub OAuth via Netlify Identity

### Future (v3.0 candidates)

- [ ] PORT-06: Data visualization embeds
- [ ] PORT-07: Portfolio filtering/sorting
- [ ] CONT-01: Dark mode toggle (currently auto via prefers-color-scheme)
- [ ] CONT-02: Search functionality
- [ ] Teaching section

### Out of Scope

- Comments system — complexity not worth it for monthly updates
- Custom domain setup — bacilo.github.io works fine
- Auto-import from Google Scholar — academics need curation control

## Constraints

- **Hosting**: GitHub Pages (static only)
- **Framework**: Astro
- **Content**: Markdown with YAML frontmatter
- **Updates**: Monthly content additions

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Jekyll | Better DX, interactive embed support, modern tooling | ✓ Good |
| Client-side GitHub API | Always-current data, 1-hour cache reduces rate limits | ✓ Good |
| CSS custom properties | Dark mode via prefers-color-scheme, no JS needed | ✓ Good |
| Preserve Jekyll URLs | SEO and academic citations maintained | ✓ Good |
| System font stack | No web font loading, instant rendering | ✓ Good |
| Lazy-load embeds | Performance optimization for portfolio page | ✓ Good |
| Decap CMS | Open source, works with GitHub Pages, rich text editing | — Pending |
| Netlify Identity for auth | Free tier, easiest OAuth setup, no backend needed | — Pending |

---
*Last updated: 2026-02-12 after v2.0 milestone start*
