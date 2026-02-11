# Architecture Patterns

**Domain:** Personal Academic Website with Astro
**Researched:** 2026-02-11
**Confidence:** HIGH (Astro patterns well-established as of Jan 2025)

## Recommended Architecture

```
Personal Academic Website (Astro Static Site)

┌─────────────────────────────────────────────────────────┐
│                    Public Assets                        │
│  /public/images/, /public/files/ (PDFs, profile photo) │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Content Layer                         │
│  src/content/                                           │
│    ├── publications/ (markdown + frontmatter)           │
│    ├── talks/ (markdown + frontmatter)                  │
│    ├── blog/ (markdown + frontmatter)                   │
│    └── portfolio/ (markdown + frontmatter)              │
│                                                          │
│  config.ts (Zod schemas for type safety)                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Pages Layer                           │
│  src/pages/                                             │
│    ├── index.astro (home/about)                         │
│    ├── publications/ (collection listing + details)     │
│    ├── talks/ (collection listing + details)            │
│    ├── blog/ (collection listing + details)             │
│    ├── portfolio/ (collection listing + details)        │
│    └── cv.astro (static page)                           │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 Components Layer                        │
│  src/components/                                        │
│    ├── layouts/                                         │
│    │   ├── BaseLayout.astro (HTML shell)               │
│    │   └── ContentLayout.astro (with sidebar)          │
│    ├── AuthorSidebar.astro (static profile)            │
│    ├── Navigation.astro (site nav)                      │
│    ├── PublicationCard.astro (list item)               │
│    ├── TalkCard.astro (list item)                       │
│    ├── BlogCard.astro (list item)                       │
│    └── portfolio/                                       │
│        ├── PortfolioCard.astro (static)                │
│        ├── GitHubCard.tsx (React island, interactive)  │
│        ├── DemoEmbed.astro (iframe wrapper)            │
│        └── DataViz.tsx (React island, Chart.js)        │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Build Output                           │
│  dist/ (static HTML + minimal JS for islands)          │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  GitHub Pages                           │
│  Serves dist/ as static site                            │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Island Architecture**: Academic content (publications, talks, blog) is pure static HTML. Interactive components (GitHub cards, charts) are React "islands" that hydrate client-side only where needed.

2. **Content Collections**: Use Astro's Content Collections API for type-safe frontmatter. Prevents build errors from invalid metadata.

3. **No Database**: All content is markdown files in git. Perfect for infrequent updates and version control.

4. **Static-First**: Everything builds to static HTML at deploy time. GitHub API calls happen at build time (GitHub cards), not client-side.

5. **Component Composition**: Layouts wrap pages, pages query content, components render data. Clear separation of concerns.

## Component Boundaries

| Component | Responsibility | Communicates With | Data Flow |
|-----------|---------------|-------------------|-----------|
| BaseLayout | HTML shell, head tags, global styles | All pages | Receives: page metadata. Provides: consistent structure |
| ContentLayout | Page layout with author sidebar | Content pages | Extends BaseLayout. Receives: page content |
| AuthorSidebar | Static profile info | ContentLayout | Hardcoded author data from config |
| Navigation | Site navigation links | BaseLayout | Hardcoded routes, active state from page |
| PublicationCard | Single publication display | Publications pages | Receives: publication data from collection |
| TalkCard | Single talk display | Talks pages | Receives: talk data from collection |
| BlogCard | Single blog post preview | Blog listing | Receives: blog post data from collection |
| PortfolioCard | Static project card | Portfolio listing | Receives: portfolio data from collection |
| GitHubCard (island) | Live GitHub repo stats | Portfolio pages | Fetches GitHub API at build time, displays stats |
| DemoEmbed | Iframe embed wrapper | Portfolio detail pages | Receives: demo URL, renders iframe with lazy load |
| DataViz (island) | Interactive chart | Portfolio detail pages | Receives: chart config, renders with Chart.js |

### Component Communication Patterns

**Content → Page → Component (Data Down)**
```typescript
// src/pages/publications/index.astro
import { getCollection } from 'astro:content';
import PublicationCard from '@components/PublicationCard.astro';

const publications = await getCollection('publications');
// Sort by date descending
const sorted = publications.sort((a, b) =>
  b.data.date.valueOf() - a.data.date.valueOf()
);

// Pass each publication to component
{sorted.map(pub => <PublicationCard publication={pub} />)}
```

**Layout Hierarchy (Composition)**
```
BaseLayout (HTML shell, styles, navigation)
  └── ContentLayout (sidebar + main content area)
        └── Page Content (markdown or component tree)
```

**Islands (Selective Hydration)**
```astro
<!-- Static content, no JS -->
<PortfolioCard title="Project" description="..." />

<!-- Interactive island, hydrates on load -->
<GitHubCard client:load repo="username/repo" />

<!-- Interactive island, hydrates when visible -->
<DataViz client:visible chartData={data} />
```

## Data Flow

### Build-Time Flow (Static Content)

```
1. Content Authoring
   └── Author writes markdown in src/content/publications/paper.md
   └── Frontmatter provides metadata (title, date, venue, etc.)

2. Schema Validation
   └── astro build reads src/content/config.ts
   └── Zod schema validates frontmatter
   └── Type errors fail build (prevents bad metadata)

3. Collection Query
   └── Page uses getCollection('publications')
   └── Returns typed array of publication entries
   └── Each entry has .data (frontmatter) and .render() (content)

4. Component Rendering
   └── Page passes data to PublicationCard component
   └── Component renders static HTML
   └── No JavaScript in final output

5. Static HTML Output
   └── dist/publications/index.html generated
   └── Pure HTML + CSS, no client-side JS
```

### Build-Time Flow (Interactive Components)

```
1. Component Definition
   └── GitHubCard.tsx defined as React component
   └── Accepts repo prop

2. Build-Time Data Fetch (Optional)
   └── Can fetch GitHub API during build
   └── Cache results in component props
   └── Reduces client-side API calls

3. Island Hydration Directive
   └── <GitHubCard client:load repo="..." />
   └── Astro generates static HTML preview
   └── Bundles minimal React + component code

4. Client-Side Hydration
   └── User loads page
   └── Static HTML renders immediately
   └── React island hydrates on load/visible/idle
   └── Component becomes interactive
```

## Patterns to Follow

### Pattern 1: Content Collections for Structured Data

**What:** Use Astro Content Collections for all structured content (publications, talks, blog, portfolio).

**When:** Any content with consistent frontmatter schema.

**Why:**
- Type safety prevents metadata errors
- Auto-generated TypeScript types
- Content validation at build time
- Better DX with autocomplete

**Example:**
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    date: z.date(),
    paperurl: z.string().url().optional(),
    citation: z.string().optional(),
  }),
});

export const collections = { publications };
```

```astro
---
// src/pages/publications/index.astro
import { getCollection } from 'astro:content';
const pubs = await getCollection('publications');
// pubs is fully typed!
---
```

### Pattern 2: Static-First, Islands for Interactivity

**What:** Default to static Astro components. Use React islands only for interactive features.

**When:**
- Static: Publications, talks, blog content, about page
- Islands: GitHub cards, charts, embed players, expandable sections

**Why:**
- Faster page loads (less JS)
- Better SEO (static HTML)
- Simpler debugging
- Academic content doesn't need interactivity

**Example:**
```astro
---
// src/components/portfolio/PortfolioDetail.astro
import GitHubCard from './GitHubCard.tsx';
---
<article>
  <h1>{title}</h1>

  <!-- Static description, no JS -->
  <p>{description}</p>

  <!-- Interactive island, hydrates on visibility -->
  <GitHubCard client:visible repo={githubRepo} />
</article>
```

### Pattern 3: Layout Composition

**What:** Compose layouts in layers: BaseLayout → ContentLayout → Page.

**When:** Consistent structure across pages, shared sidebar/navigation.

**Why:**
- DRY (don't repeat HTML shell)
- Consistent metadata (SEO tags)
- Easy to update global structure

**Example:**
```astro
---
// src/layouts/BaseLayout.astro
const { title, description } = Astro.props;
---
<!DOCTYPE html>
<html>
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
</head>
<body>
  <Navigation />
  <slot />
</body>
</html>
```

```astro
---
// src/layouts/ContentLayout.astro
import BaseLayout from './BaseLayout.astro';
import AuthorSidebar from '@components/AuthorSidebar.astro';
---
<BaseLayout {...Astro.props}>
  <div class="layout-grid">
    <AuthorSidebar />
    <main>
      <slot />
    </main>
  </div>
</BaseLayout>
```

```astro
---
// src/pages/publications/index.astro
import ContentLayout from '@layouts/ContentLayout.astro';
---
<ContentLayout title="Publications">
  <!-- Page content here -->
</ContentLayout>
```

### Pattern 4: Collection-Based Routing

**What:** Generate pages dynamically from Content Collections.

**When:** Detail pages for publications, talks, blog posts, portfolio.

**Why:**
- No manual page creation per content item
- Automatic URL generation
- Type-safe content access

**Example:**
```astro
---
// src/pages/publications/[...slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const pubs = await getCollection('publications');
  return pubs.map(pub => ({
    params: { slug: pub.slug },
    props: { pub },
  }));
}

const { pub } = Astro.props;
const { Content } = await pub.render();
---
<ContentLayout title={pub.data.title}>
  <h1>{pub.data.title}</h1>
  <p>{pub.data.authors} — {pub.data.venue}</p>
  <Content />
</ContentLayout>
```

### Pattern 5: Build-Time GitHub API Calls

**What:** Fetch GitHub repo data during build, not client-side.

**When:** GitHub cards showing repo stats.

**Why:**
- No client-side API key needed
- Faster page loads (data is already rendered)
- No GitHub API rate limits for users
- GitHub Actions has higher rate limits

**Example:**
```typescript
// src/utils/github.ts
export async function getRepoData(repo: string) {
  const token = import.meta.env.GITHUB_TOKEN; // From GitHub Actions
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: { Authorization: `token ${token}` },
  });
  return res.json();
}
```

```astro
---
// src/components/portfolio/GitHubCard.astro
import { getRepoData } from '@utils/github';
const { repo } = Astro.props;
const data = await getRepoData(repo); // Fetched at build time
---
<div class="github-card">
  <h3>{data.name}</h3>
  <p>{data.description}</p>
  <span>⭐ {data.stargazers_count}</span>
  <span>🍴 {data.forks_count}</span>
</div>
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client-Side Data Fetching for Static Content

**What:** Fetching publications/talks from an API on page load.

**Why bad:**
- Slower page loads (spinner, then content)
- SEO problems (content not in HTML)
- Unnecessary complexity (data is static)

**Instead:** Use Content Collections. Content is embedded in HTML at build time.

### Anti-Pattern 2: React/Vue for Everything

**What:** Using React components for static content like publication lists.

**Why bad:**
- Unnecessary JS bundle
- Slower page loads
- More complex debugging
- No SEO benefit

**Instead:** Use Astro components for static content. Only use React/Vue for truly interactive features.

### Anti-Pattern 3: Shared State Between Islands

**What:** Using a global store to sync state between GitHubCard islands.

**Why bad:**
- Islands are isolated by design
- Shared state defeats the purpose (sends all JS)
- Harder to debug

**Instead:** Keep islands independent. If they need to share state, rethink if they should be separate islands.

### Anti-Pattern 4: Over-Normalizing Content

**What:** Splitting content into multiple collections unnecessarily (authors, venues, publications with references).

**Why bad:**
- Complexity explosion for small content set
- Harder to query and render
- Manual updates don't benefit from normalization

**Instead:** Accept some duplication in frontmatter. Author name in every publication is fine for 10-50 papers.

### Anti-Pattern 5: Client-Side Markdown Parsing

**What:** Sending markdown to client and parsing it with JavaScript.

**Why bad:**
- Huge JS bundle (markdown parser)
- Slower page loads
- Astro already does this at build time

**Instead:** Use `<Content />` component from `entry.render()`. Markdown becomes HTML at build time.

## Scalability Considerations

| Concern | At 10 Publications | At 100 Publications | At 1000+ Publications |
|---------|-------------------|-------------------|---------------------|
| **Build time** | <1s | 1-5s | 10-30s (still acceptable for static site) |
| **Page load** | Instant (static HTML) | Instant | Instant (pagination may be needed) |
| **Content management** | Manual markdown files | Manual files (slightly tedious) | Consider CMS or scripts |
| **Search** | Not needed | Client-side search with Pagefind | Client-side or external search |
| **Navigation** | Flat list | Group by year | Pagination or infinite scroll |

**Current scope (10-20 publications, 5-10 talks, 5 blog posts):** No scalability concerns. Simple listing pages are sufficient.

**Future considerations:**
- If publication count >50, add year-based grouping or pagination
- If blog post count >20, add tag-based filtering
- Client-side search (Pagefind) is viable up to ~1000 pages

## GitHub Pages Deployment Architecture

```
GitHub Repository (bacilo.github.io)
  ↓
GitHub Actions Workflow (.github/workflows/deploy.yml)
  ↓
├── Checkout code
├── Install Node.js + dependencies
├── Run astro build
│   └── Generates dist/ folder
├── Add .nojekyll file (tells GitHub Pages to serve as-is)
└── Deploy dist/ to gh-pages branch or GitHub Pages
  ↓
GitHub Pages (pedropaf.com or bacilo.github.io)
  └── Serves dist/ as static files
```

**Key configuration:**
```typescript
// astro.config.mjs
export default defineConfig({
  site: 'https://pedropaf.com', // or https://bacilo.github.io
  base: '/', // User site, no subpath
  output: 'static', // Static site generation
});
```

**GitHub Actions:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## File Structure

```
bacilo.github.io/
├── src/
│   ├── content/
│   │   ├── config.ts          # Collection schemas
│   │   ├── publications/       # Publication markdown files
│   │   ├── talks/              # Talk markdown files
│   │   ├── blog/               # Blog post markdown files
│   │   └── portfolio/          # Portfolio markdown files
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ContentLayout.astro
│   ├── components/
│   │   ├── Navigation.astro
│   │   ├── AuthorSidebar.astro
│   │   ├── PublicationCard.astro
│   │   ├── TalkCard.astro
│   │   ├── BlogCard.astro
│   │   └── portfolio/
│   │       ├── PortfolioCard.astro
│   │       ├── GitHubCard.tsx
│   │       └── DataViz.tsx
│   ├── pages/
│   │   ├── index.astro         # Home/About
│   │   ├── cv.astro            # CV page
│   │   ├── publications/
│   │   │   ├── index.astro     # Publications listing
│   │   │   └── [...slug].astro # Individual publication
│   │   ├── talks/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   └── portfolio/
│   │       ├── index.astro
│   │       └── [...slug].astro
│   ├── utils/
│   │   └── github.ts           # GitHub API helper
│   └── styles/
│       └── global.css          # Global styles (Tailwind)
├── public/
│   ├── images/                 # Profile photo, assets
│   └── files/                  # PDF files
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Migration Architecture

### Jekyll → Astro Mapping

| Jekyll | Astro |
|--------|-------|
| `_config.yml` | `astro.config.mjs` |
| `_layouts/` | `src/layouts/` |
| `_includes/` | `src/components/` |
| `_publications/` | `src/content/publications/` |
| `_talks/` | `src/content/talks/` |
| `_posts/` | `src/content/blog/` |
| `_portfolio/` | `src/content/portfolio/` |
| `images/` | `public/images/` |
| `files/` | `public/files/` |
| `_site/` (build output) | `dist/` |

### Content Migration Strategy

1. **Copy markdown files** from Jekyll collections to Astro content folders
2. **Validate frontmatter** with Zod schemas (some field renaming may be needed)
3. **Update image paths** if necessary (usually just copy to `public/`)
4. **Update internal links** to match new route structure
5. **Run build** and check for type errors

## Sources

**Architecture patterns based on:**
- Astro official documentation (training data as of Jan 2025)
- Astro Islands architecture (official pattern)
- Static site generator best practices
- Personal website architecture patterns

**Confidence:** HIGH — These are standard Astro patterns, well-documented and widely used.

**Verification needed:**
- Current Astro 5.x API (assume minimal changes from 4.x)
- GitHub Pages deployment best practices for Astro in 2026
- Performance characteristics of build-time GitHub API calls

---

## Summary for Roadmap

**Key architectural decisions:**
1. Island architecture (static by default, interactive where needed)
2. Content Collections for type safety
3. No database (git-based content)
4. Build-time GitHub API calls
5. Layout composition (BaseLayout → ContentLayout → Page)

**Component boundaries:** Clear separation between layouts, pages, components. Data flows down from Content Collections → Pages → Components.

**Patterns to follow:** Content Collections, static-first, layout composition, collection-based routing, build-time data fetching.

**Anti-patterns to avoid:** Client-side data fetching for static content, React for everything, shared state between islands, over-normalization.

**Scalability:** Current scope (10-20 publications) has no concerns. Simple listing pages are sufficient.
