# Phase 9: Static Portfolio - Research

**Researched:** 2026-02-12
**Domain:** Astro content collections, CSS Grid card layouts, accessibility patterns
**Confidence:** HIGH

## Summary

Phase 9 implements a static portfolio page displaying project cards using Astro's content collections and CSS Grid. The existing codebase already has two portfolio items migrated from Jekyll and a portfolio collection defined in `src/content.config.ts`. The implementation follows established patterns from publications, talks, and blog pages.

The portfolio collection schema needs extension to support repo URLs and live demo links. The page layout uses CSS Grid with `repeat(auto-fill, minmax())` for responsive cards that maintain consistent sizing. Accessibility requires careful link structure to avoid redundancy while maintaining clear interaction affordances.

**Primary recommendation:** Extend the portfolio schema to include `repoUrl` and `demoUrl` fields, create a card-based grid layout using native CSS Grid (no framework needed), and use the "heading link only" accessibility pattern with distinct visual affordance for multiple links per card.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.0+ | Static site framework | Already project standard, Content Layer API for collections |
| Zod | (via astro/zod) | Schema validation | Built into Astro 5.0, used for all existing collections |
| CSS Grid | Native | Responsive layout | Browser-native, 98%+ support, no dependencies needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | 5.7+ | Type safety | Already configured, provides intellisense for collections |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Grid | Astro Starlight CardGrid | Starlight components add dependency, native CSS Grid sufficient |
| CSS Grid | Flexbox | Grid better for 2D card layouts, Flexbox better for 1D lists |
| Native CSS | TailwindCSS | Project uses CSS custom properties pattern, no utility framework |

**Installation:**
No additional packages needed. All requirements already in `package.json`.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── content/
│   └── portfolio/           # Existing portfolio markdown files
├── pages/
│   └── portfolio/
│       ├── index.astro      # Portfolio listing page (new)
│       └── [slug].astro     # Individual project pages (optional for Phase 10)
└── styles/
    └── global.css           # Existing CSS custom properties
```

### Pattern 1: Content Collection with Schema Extension
**What:** Extend existing portfolio collection schema to include URL fields
**When to use:** Portfolio items need structured metadata beyond title/description
**Example:**
```typescript
// Source: Project's src/content.config.ts + Astro docs
const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    collection: z.literal('portfolio').optional(),
  })
});
```

### Pattern 2: getCollection with Explicit Sorting
**What:** Query collections with manual sort because default order is non-deterministic
**When to use:** Always when displaying collections in a specific order
**Example:**
```typescript
// Source: Astro docs + GitHub issue #9725
const portfolio = await getCollection('portfolio');
// Sort order is platform-dependent, must sort explicitly
const sortedPortfolio = portfolio.sort((a, b) =>
  a.data.title.localeCompare(b.data.title)
);
```

### Pattern 3: Responsive CSS Grid with auto-fill
**What:** CSS Grid creates responsive columns without media queries
**When to use:** Card layouts that should maintain consistent sizing
**Example:**
```css
/* Source: CSS-Tricks auto-fill/auto-fit article */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
}
```

### Pattern 4: Accessible Card with Multiple Links
**What:** Heading link pattern with distinct link affordances
**When to use:** Cards with multiple actions (repo link, demo link)
**Example:**
```astro
<!-- Source: Berkeley DAP + Inclusive Components -->
<article class="portfolio-card">
  <h2><a href={project.repoUrl}>{project.title}</a></h2>
  <p>{project.description}</p>
  <div class="card-links">
    {project.repoUrl && (
      <a href={project.repoUrl} class="link-button">View Repo</a>
    )}
    {project.demoUrl && (
      <a href={project.demoUrl} class="link-button">Live Demo</a>
    )}
  </div>
</article>
```

### Pattern 5: List Markup for Card Grid
**What:** Wrap card grid in `<ul>` with cards as `<li>` elements
**When to use:** Always for card collections to provide screen reader navigation
**Example:**
```astro
<!-- Source: Inclusive Components - Cards -->
<ul class="portfolio-grid">
  {sortedPortfolio.map(project => (
    <li class="portfolio-card">
      <!-- card content -->
    </li>
  ))}
</ul>
```

### Anti-Patterns to Avoid
- **Wrapping entire card in `<a>` tag:** Creates verbose screen reader announcements and prevents multiple links per card
- **Using auto-fit with single card:** Single card expands to full width, distorting images badly
- **Redundant links (image + title to same URL):** Poor keyboard/SR experience, users tab twice for same action
- **Relying on default collection sort order:** Non-deterministic, differs between dev/build
- **External links without warning:** Confuses users when links open in new tabs unexpectedly

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Schema validation | Custom validation functions | Zod via Astro collections | Type safety, editor intellisense, runtime validation |
| Responsive grid | Manual media queries for breakpoints | CSS Grid auto-fill | Single declaration, adapts to any viewport, no breakpoints |
| Collection queries | Manual file reading/parsing | Astro getCollection() | Built-in, type-safe, cached, handles frontmatter |
| Dark mode | JavaScript toggle | CSS `prefers-color-scheme` | Already implemented, respects system preference, no JS |

**Key insight:** Astro 5.0's Content Layer API handles 90% of static portfolio needs out-of-the-box. Custom solutions add complexity without benefit for this phase's scope.

## Common Pitfalls

### Pitfall 1: Using auto-fit Instead of auto-fill
**What goes wrong:** With few portfolio items, cards stretch to full container width, distorting images
**Why it happens:** auto-fit collapses empty columns and redistributes space to existing items
**How to avoid:** Use `auto-fill` which maintains consistent column widths even with empty space
**Warning signs:** Single portfolio item spans entire viewport width on desktop

### Pitfall 2: Forgetting to Sort Collections
**What goes wrong:** Portfolio items display in random order that differs between dev and production
**Why it happens:** Astro's collection order is platform-dependent and non-deterministic
**How to avoid:** Always call `.sort()` explicitly after `getCollection()`
**Warning signs:** Order changes between `npm run dev` and `npm run build`

### Pitfall 3: Redundant Links to Same Destination
**What goes wrong:** Image and title both link to same URL, poor keyboard/screen reader experience
**Why it happens:** Copying patterns from clickable card examples without considering multiple links
**How to avoid:** For portfolio with repo + demo links, only make heading clickable, use separate link buttons for actions
**Warning signs:** Tab navigation visits same card twice, screen readers announce duplicate links

### Pitfall 4: Missing Link Purpose for External Links
**What goes wrong:** External links (GitHub, live demos) open in new tabs without warning users
**Why it happens:** Using `target="_blank"` without accessibility considerations
**How to avoid:** Best practice is NOT opening in new tabs. If necessary, add "(opens in new tab)" via sr-only text or aria-describedby
**Warning signs:** WCAG audit flags "Link opens in new tab without warning"

### Pitfall 5: Card Hover State Without Focus State
**What goes wrong:** Keyboard users can't see which card has focus
**Why it happens:** Only styling `:hover` pseudo-class, ignoring `:focus-within`
**How to avoid:** Use `:focus-within` to match hover styles for keyboard navigation
**Warning signs:** Hover works but tabbing shows no visual feedback

### Pitfall 6: Inconsistent minmax() Minimum Too Small
**What goes wrong:** Cards become too narrow on mobile, breaking layout
**Why it happens:** Setting minmax first value below actual content minimum width
**How to avoid:** Test minmax minimum (280px recommended) at mobile viewport, ensure content doesn't overflow
**Warning signs:** Horizontal scroll on mobile, text wrapping awkwardly

## Code Examples

Verified patterns from official sources and existing project code:

### Portfolio Index Page Structure
```astro
---
// Source: Project's existing pages/posts/index.astro pattern
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const portfolio = await getCollection('portfolio');
// CRITICAL: Sort explicitly, order is non-deterministic
const sortedPortfolio = portfolio.sort((a, b) =>
  a.data.title.localeCompare(b.data.title)
);
---

<BaseLayout title="Portfolio - Pedro Figueira">
  <h1>Portfolio</h1>
  <p class="intro">Projects and implementations</p>

  <ul class="portfolio-grid">
    {sortedPortfolio.map(project => (
      <li class="portfolio-card">
        <h2><a href={project.data.repoUrl}>{project.data.title}</a></h2>
        <p class="description">{project.data.description || project.data.excerpt}</p>

        <div class="card-links">
          {project.data.repoUrl && (
            <a href={project.data.repoUrl} class="link-button">
              View Repo
            </a>
          )}
          {project.data.demoUrl && (
            <a href={project.data.demoUrl} class="link-button">
              Live Demo
            </a>
          )}
        </div>
      </li>
    ))}
  </ul>

  {sortedPortfolio.length === 0 && (
    <p class="empty">No portfolio items yet.</p>
  )}
</BaseLayout>
```

### Responsive CSS Grid Layout
```css
/* Source: CSS-Tricks + project's existing patterns */
.portfolio-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
}

.portfolio-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: var(--space-md);
  background: var(--color-header-bg);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.portfolio-card:hover,
.portfolio-card:focus-within {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-link);
}

.portfolio-card h2 {
  font-size: 1.25rem;
  margin: 0 0 var(--space-xs) 0;
}

.portfolio-card h2 a {
  text-decoration: none;
  color: var(--color-text);
}

.portfolio-card h2 a:hover {
  color: var(--color-link);
  text-decoration: underline;
}

.description {
  color: var(--color-text-muted);
  margin-bottom: var(--space-sm);
  flex-grow: 1; /* Push links to bottom */
}

.card-links {
  display: flex;
  gap: var(--space-xs);
  margin-top: auto; /* Keep at bottom of card */
}

.link-button {
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-link);
  color: var(--color-bg);
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.link-button:hover {
  background: var(--color-link-hover);
  transform: translateY(-2px);
}

/* Mobile: Single column below 768px if needed */
@media (max-width: 768px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
}
```

### Extended Portfolio Schema
```typescript
// Source: Project's src/content.config.ts + Astro docs
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    collection: z.literal('portfolio').optional(),
  })
});

export const collections = { publications, talks, posts, portfolio };
```

### Portfolio Markdown Frontmatter
```yaml
---
title: "Example Project"
description: "A brief description of what this project does"
repoUrl: "https://github.com/username/repo"
demoUrl: "https://example.com/demo"
---

Detailed project information goes here (optional for Phase 9).
```

### Navigation Update
```typescript
// Source: Project's src/components/Navigation.astro
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/publications/', label: 'Publications' },
  { href: '/talks/', label: 'Talks' },
  { href: '/posts/', label: 'Blog' },
  { href: '/portfolio/', label: 'Portfolio' }, // Add this
  { href: '/cv/', label: 'CV' },
];
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Astro v2 content collections (src/content/config.ts) | Astro v5 Content Layer API (src/content.config.ts) | Astro 5.0 (2024) | 5x faster builds, 50% less memory, can load from remote APIs |
| Manual media queries for responsive cards | CSS Grid auto-fill/auto-fit with minmax | Established 2017, widespread 2020+ | Single declaration replaces 3-5 media queries |
| JavaScript-based card clickable area | CSS ::after pseudo-element or :focus-within | Modern CSS (2018+) | No JavaScript needed, better performance |
| Wrapping entire card in anchor tag | Heading link with separate action links | WCAG 2.1 (2018) | Better accessibility, supports multiple links |

**Deprecated/outdated:**
- Astro v2 `src/content/config.ts` location: Moved to `src/content.config.ts` in v5.0
- CSS Grid with `-ms-` prefixes: Grid support is universal (98%+), prefixes unnecessary
- Opening external links in new tabs by default: WCAG and usability best practice is to NOT open in new tabs unless critical workflow reason

## Open Questions

1. **Should portfolio items have individual detail pages?**
   - What we know: Phase 10 adds GitHub API integration and embeds
   - What's unclear: Whether detail pages needed now or wait for Phase 10
   - Recommendation: Skip individual pages in Phase 9. Current requirement "view portfolio page with project cards" doesn't require detail pages. Phase 10 can add if needed for embeds.

2. **Should external links open in new tabs?**
   - What we know: Accessibility best practice is NOT to open in new tabs
   - What's unclear: User expectation for GitHub/demo links
   - Recommendation: Default to same-tab navigation (accessibility standard). If user feedback indicates new-tab preference, add `target="_blank" rel="noopener noreferrer"` with sr-only "(opens in new tab)" warning.

3. **Should cards show project images?**
   - What we know: Existing portfolio items reference placeholder images in excerpt field
   - What's unclear: Whether images are priority for Phase 9 static cards
   - Recommendation: Phase 9 focuses on "basic information" (title, description, links). Add image support if existing portfolio items already have real images, otherwise defer to Phase 10 enhancement.

4. **What sort order for portfolio items?**
   - What we know: Must sort explicitly, order is non-deterministic
   - What's unclear: Alphabetical by title? Chronological? Manual order field?
   - Recommendation: Alphabetical by title for Phase 9 (simplest). Add optional `order` field or `date` field in Phase 10 if manual ordering needed.

## Sources

### Primary (HIGH confidence)
- [Astro Content Collections official docs](https://docs.astro.build/en/guides/content-collections/) - Collection API, schema definition, querying
- [Astro Content Collections API Reference](https://docs.astro.build/en/reference/modules/astro-content/) - getCollection(), render(), type definitions
- [CSS-Tricks: auto-fill vs auto-fit](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/) - Detailed explanation with examples
- [Inclusive Components: Cards](https://inclusive-components.design/cards/) - Accessibility patterns for card components
- [UC Berkeley DAP: Accessible Card Patterns](https://dap.berkeley.edu/web-a11y-basics/accessible-card-ui-component-patterns) - Three accessible card patterns with requirements
- Project's existing codebase (`src/content.config.ts`, `src/pages/publications/index.astro`, `src/styles/global.css`) - Established patterns

### Secondary (MEDIUM confidence)
- [CSS Grid Complete Guide 2026](https://devtoolbox.dedyn.io/blog/css-grid-complete-guide) - Modern grid techniques and browser support
- [Responsive Portfolio Page: Flexbox + Grid](https://ndlab.blog/posts/responsive-portfolio-page-project-flexbox-grid-modern-css) - Combining layout techniques
- [DigitalA11Y: External Links In or Out](https://www.digitala11y.com/external-links-in-or-out/) - Accessibility guidance on new tab behavior
- [GitHub Issue #9725](https://github.com/withastro/astro/issues/9725) - Confirms non-deterministic collection sort order
- [Astro Starlight Card components](https://starlight.astro.build/components/cards/) - Alternative component approach (not needed for this project)

### Tertiary (LOW confidence, for exploration only)
- Various Astro portfolio templates on GitHub - General inspiration, not authoritative for this specific implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies already in project, Astro 5.0 API verified from official docs
- Architecture: HIGH - Patterns verified from project's existing pages and official Astro/accessibility sources
- Pitfalls: HIGH - Sourced from official GitHub issues, CSS-Tricks authoritative articles, and WCAG guidelines

**Research date:** 2026-02-12
**Valid until:** ~2026-03-12 (30 days - stable domain, Astro 5.x unlikely to change core collection API)
