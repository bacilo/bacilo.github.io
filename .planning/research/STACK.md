# Technology Stack

**Project:** Personal Academic Website with Astro
**Researched:** 2026-02-11
**Overall Confidence:** MEDIUM (based on training data; external verification unavailable)

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Astro | ^5.0.0 | Static site generator | Island architecture for interactive embeds, content collections for publications/talks, excellent DX, zero JS by default |
| Node.js | 20.x LTS | Runtime | Current LTS as of Jan 2025, required for Astro tooling |
| TypeScript | ^5.6.0 | Type safety | Astro has built-in support, helps with complex content schemas |

**Rationale:** Astro 5.x is the current stable version (as of my training cutoff). Island architecture allows selective hydration for portfolio embeds while keeping the academic content static and fast. Content Collections provide type-safe frontmatter validation, crucial for migrating structured Jekyll collections (publications, talks).

**Confidence:** MEDIUM - Version numbers based on Jan 2025 training data. Verify current Astro stable version before installation.

### Content Management

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @astrojs/mdx | ^4.0.0 | MDX support | Enables component embeds in markdown for portfolio interactivity |
| remark-gfm | ^4.0.0 | GitHub Flavored Markdown | Matches Jekyll/kramdown GFM compatibility for content migration |
| rehype-slug | ^6.0.0 | Heading anchors | Auto-generate heading IDs for academic paper references |
| rehype-autolink-headings | ^7.0.0 | Heading links | Click-to-link headings (common in academic content) |

**Rationale:**
- MDX over pure Markdown allows embedding interactive components (GitHub cards, code playgrounds) within content files
- GFM support ensures Jekyll content migrates without reformatting
- Slug/autolink plugins maintain academic writing conventions (linkable sections)

**Confidence:** MEDIUM - Remark/rehype plugins are stable ecosystem choices but versions need verification.

### Portfolio Embeds

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @octokit/rest | ^21.0.0 | GitHub API | Fetch repo stats for GitHub cards (stars, forks, language) |
| astro-embed | ^0.7.0 | Embed helpers | Simplified CodePen, YouTube, Tweet embeds with privacy-friendly loading |
| chart.js | ^4.4.0 | Data visualization | Canvas-based charts for research data visualizations |
| react-chart.js-2 | ^5.2.0 | Chart.js React wrapper | For interactive charts as Astro islands |
| Shiki | Built-in | Syntax highlighting | Already integrated in Astro, same highlighter as VS Code |

**Rationale:**
- Octokit provides typed GitHub API access for live repo cards vs static embeds
- astro-embed handles iframe-based embeds (CodePen, etc.) with lazy loading
- Chart.js is industry standard for academic visualizations, lightweight canvas rendering
- Shiki is Astro's default highlighter, zero-config setup

**Alternatives Considered:**
- Recharts (heavier than Chart.js for simple academic charts)
- Prism.js (Shiki has better out-of-box Astro integration)
- Direct iframe embeds (astro-embed adds lazy loading + privacy features)

**Confidence:** MEDIUM-LOW - astro-embed version uncertain, verify package exists and version. Octokit and Chart.js versions based on 2024 state.

### UI Components (Optional Interactivity)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | ^18.3.0 | Interactive islands | For portfolio interactivity only (GitHub cards, chart interactions) |
| @astrojs/react | ^3.6.0 | React integration | Official Astro integration for selective hydration |
| clsx | ^2.1.0 | Conditional classes | Lightweight utility for dynamic styling |

**Rationale:**
- React only loads for interactive portfolio components via Astro islands
- Academic content (publications, talks, blog) remains static HTML with zero JS
- clsx simplifies conditional styling without full CSS-in-JS overhead

**Alternatives Considered:**
- Preact (smaller but React ecosystem better for chart libraries)
- Vanilla JS (more code for same result, less maintainable)

**Confidence:** MEDIUM - React integration is standard Astro pattern.

### Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | ^3.4.0 | Utility-first CSS | Rapid prototyping, excellent with Astro, maintains clean academic aesthetic |
| @astrojs/tailwind | ^5.1.0 | Tailwind integration | Official Astro integration |
| @tailwindcss/typography | ^0.5.0 | Prose styling | Beautiful defaults for long-form academic content |

**Rationale:**
- Tailwind prose plugin provides academic-quality typography out of box
- Utility classes avoid CSS bloat from unused Minimal Mistakes theme styles
- Easy to match current aesthetic with custom config
- Better mobile responsiveness than semantic CSS for this use case

**Alternatives Considered:**
- Vanilla CSS (harder to maintain clean academic aesthetic)
- Sass (Jekyll carryover, but Tailwind better DX for component-based Astro)
- CSS Modules (overkill for mostly-static academic site)

**Confidence:** HIGH - Tailwind + typography plugin is standard for academic/blog sites in Astro ecosystem.

### Deployment

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @astrojs/github-pages | Built-in adapter | GitHub Pages deployment | Official Astro GitHub Pages support, handles base path automatically |
| GitHub Actions | N/A | CI/CD | Auto-deploy on push to main, already set up for Jekyll site |

**Rationale:**
- Astro has native GitHub Pages support with `site` config
- Existing GitHub Actions workflow can be adapted (change Jekyll build to Astro build)
- No external services needed (Netlify/Vercel unnecessary for static site)

**Configuration:**
```typescript
// astro.config.mjs
export default defineConfig({
  site: 'https://pedropaf.com', // or bacilo.github.io
  base: '/', // No subpath needed for user site
})
```

**Confidence:** HIGH - This is standard Astro + GitHub Pages pattern.

### Development Tools

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @astrojs/check | ^0.9.0 | Type checking | Validates content schemas and TypeScript |
| prettier | ^3.3.0 | Code formatting | Astro has official Prettier plugin |
| prettier-plugin-astro | ^0.14.0 | Astro formatting | Official formatter for .astro files |

**Rationale:**
- Astro Check validates Content Collection schemas before build
- Prettier maintains code consistency across .astro, .ts, .md files

**Confidence:** MEDIUM - Versions approximate based on 2024 state.

## Content Collections Schema

For type-safe migration from Jekyll collections:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.string().optional(),
    venue: z.string(),
    date: z.date(),
    paperurl: z.string().url().optional(),
    citation: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

const talks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    venue: z.string(),
    location: z.string().optional(),
    talkurl: z.string().url().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    permalink: z.string().optional(), // For migration compatibility
  }),
});

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    githubRepo: z.string().optional(), // For GitHub cards
    demoUrl: z.string().url().optional(), // For live embeds
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { publications, talks, blog, portfolio };
```

**Confidence:** HIGH - Content Collections API is stable Astro 2.0+ feature.

## Installation Commands

```bash
# Initialize Astro project (do this in a separate directory first)
npm create astro@latest

# Core dependencies
npm install astro@latest

# Content processing
npm install @astrojs/mdx remark-gfm rehype-slug rehype-autolink-headings

# Styling
npm install @astrojs/tailwind tailwindcss @tailwindcss/typography

# Interactive components (for portfolio)
npm install @astrojs/react react react-dom

# Portfolio embeds
npm install @octokit/rest chart.js react-chartjs-2
# npm install astro-embed  # Verify this package exists

# Development tools
npm install -D @astrojs/check prettier prettier-plugin-astro typescript

# Utility
npm install clsx
```

**Note:** Install in phases. Start with core Astro + content + styling. Add React/embeds only when implementing portfolio section.

## Migration Strategy

### Phase 1: Core Setup
1. Install Astro with Tailwind + MDX
2. Set up Content Collections for publications, talks, blog, portfolio
3. Configure GitHub Pages deployment

### Phase 2: Content Migration
1. Copy `_publications/*.md` → `src/content/publications/`
2. Copy `_talks/*.md` → `src/content/talks/`
3. Copy `_posts/*.md` → `src/content/blog/`
4. Copy `images/` → `public/images/`
5. Copy `files/` → `public/files/`
6. Update frontmatter to match schemas (minimal changes needed)

### Phase 3: Static Pages
1. Build layout components (BaseLayout, AuthorSidebar)
2. Create index pages for publications, talks, blog
3. Implement author profile sidebar
4. Set up navigation

### Phase 4: Portfolio Interactivity (Enhancement)
1. Add React integration
2. Create GitHub card component with Octokit
3. Add embed helpers for CodePen/demos
4. Implement chart visualizations

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| Jekyll | Outdated Ruby tooling, harder interactive embeds |
| Gatsby | Over-engineered for academic site, GraphQL unnecessary |
| Next.js | SSR features wasted on static content, added complexity |
| WordPress | Too heavy, monthly updates don't need CMS |
| Vanilla HTML | Defeats purpose of modern tooling, hard to maintain |
| Vue/Svelte for islands | React has better chart/embed ecosystem |
| Sass | Tailwind provides better DX for this use case |
| Netlify CMS / Decap CMS | Monthly updates in markdown files, CMS is overkill |

## Migration Gotchas

### Jekyll to Astro Differences

| Jekyll | Astro Equivalent | Notes |
|--------|------------------|-------|
| `_config.yml` | `astro.config.mjs` | JS/TS config instead of YAML |
| Collections (`_publications/`) | Content Collections (`src/content/publications/`) | Type-safe schemas required |
| Liquid templates | Astro components | Component syntax similar to JSX |
| `{% include %}` | `<Component />` | Import and use components |
| `site.baseurl` | `import.meta.env.BASE_URL` | Environment-aware base path |
| `kramdown` (GFM) | `remark-gfm` | Add plugin for GFM support |
| Frontmatter dates | ISO 8601 strings or Date objects | Zod schema enforces format |

### Content Migration Checklist

- [ ] Update image paths: `/images/foo.png` → `/images/foo.png` (same, but verify `public/` structure)
- [ ] Update file links: `/files/paper.pdf` → `/files/paper.pdf` (same with `public/`)
- [ ] Convert Liquid syntax to Astro components (if any in content)
- [ ] Update internal links: Jekyll permalinks → Astro routes
- [ ] Validate frontmatter with `astro check` after schema setup

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Core Astro stack | HIGH | Standard pattern, well-documented |
| Content Collections | HIGH | Stable API since Astro 2.0 |
| Tailwind + Typography | HIGH | Common academic site pattern |
| GitHub Pages deployment | HIGH | Official Astro support |
| React islands | MEDIUM | Standard but version needs verification |
| Portfolio embed packages | MEDIUM-LOW | astro-embed existence unverified, may need alternatives |
| Package versions | MEDIUM-LOW | Based on Jan 2025 training, need npm registry verification |

## Verification Needed

**Before implementation, verify:**
1. Current Astro stable version (likely 5.x but confirm)
2. `astro-embed` package status (may have been renamed/deprecated)
3. `@astrojs/react` current version
4. Tailwind CSS and plugin versions
5. Octokit REST API v21 compatibility

**How to verify:**
```bash
npm view astro version
npm view @astrojs/react version
npm view astro-embed version  # Check if exists
npm view tailwindcss version
```

## Sources

**Limitation:** External tools (WebSearch, Context7, official docs) were unavailable during research. All recommendations based on training data (cutoff: January 2025).

**Recommended verification sources:**
- Astro official docs: https://docs.astro.build
- Astro integrations: https://astro.build/integrations
- Tailwind CSS docs: https://tailwindcss.com
- GitHub Octokit: https://github.com/octokit/rest.js
- Chart.js docs: https://www.chartjs.org

**Research methodology:** Analysis of project requirements (Jekyll migration, academic content, portfolio embeds, GitHub Pages) combined with training data knowledge of Astro ecosystem best practices as of January 2025. Confidence levels reflect inability to verify current package versions and ecosystem state.

---

**Next steps for roadmap creation:**
1. Verify package versions before roadmap milestone creation
2. Consider separating "Core Migration" from "Portfolio Enhancements" into distinct phases
3. Flag portfolio embed packages for deeper research during implementation phase
4. Plan content migration scripts for bulk frontmatter conversion
