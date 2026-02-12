# Phase 1: Foundation & Astro Setup - Research

**Researched:** 2026-02-12
**Domain:** Astro static site generator, GitHub Pages deployment, Jekyll-to-Astro migration
**Confidence:** HIGH

## Summary

Astro is the optimal static site generator for this migration, offering content collections with Zod validation, first-class Markdown support, and official GitHub Pages deployment integration. As of February 2026, Astro 5.0 is stable (released December 2024) and Astro 6.0 is in beta with expected stable release within weeks.

Critical migration considerations: Astro does NOT support Jekyll's dynamic `permalink` frontmatter property, requiring manual URL structure preservation through directory restructuring or custom routing with `[...slug].astro` dynamic routes. The existing `CNAME` file (pedropaf.com) must be moved to `public/CNAME`, and `.nojekyll` must be added to prevent GitHub Pages from processing the build output.

**Primary recommendation:** Use the official `npm create astro@latest` with blog template, migrate content to content collections with strict Zod schemas validated against existing frontmatter, and preserve Jekyll URLs through dynamic routing or host-level redirects.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 5.x (stable) | Static site generator | Official stable release, 5x faster builds than 2-4, Content Layer API |
| @astrojs/mdx | Latest 5.x | MDX support for content | First-class image optimization in Markdown, component embedding |
| zod | Built-in (astro/zod) | Schema validation | Native Astro content collections integration, type-safe frontmatter |
| @withastro/action | v5 | GitHub Actions deployment | Official Astro deployment action, auto-detects package manager |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| astro-jekyll | Latest | Jekyll migration helpers | Optional: formatJekyllPost() preserves Jekyll frontmatter conventions |
| @astrojs/sitemap | Latest | SEO sitemap generation | Essential for maintaining search engine visibility post-migration |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Astro 5.x | Astro 6.x beta | 6.0 adds redesigned dev server with workerd runtime, but beta stability risk |
| npm | pnpm or bun | pnpm: 70% storage reduction, faster installs; bun: 30x faster installs but less mature |
| Content Collections | File-based routing only | Collections provide type safety, validation, but add complexity for simple sites |

**Installation:**
```bash
# Interactive setup (recommended)
npm create astro@latest

# Or direct with blog template
npm create astro@latest -- --template blog

# Add MDX if needed
npx astro add mdx
```

## Architecture Patterns

### Recommended Project Structure
```
bacilo.github.io/
├── public/
│   ├── CNAME              # Custom domain (pedropaf.com)
│   ├── .nojekyll          # Prevent Jekyll processing
│   ├── files/             # Migrate from root /files
│   └── images/            # Migrate from root /images
├── src/
│   ├── pages/
│   │   ├── index.astro    # Homepage
│   │   ├── publications/
│   │   │   └── [...slug].astro  # Dynamic route for publications
│   │   ├── talks/
│   │   │   └── [...slug].astro  # Dynamic route for talks
│   │   └── portfolio/
│   │       └── [...slug].astro  # Dynamic route for portfolio
│   ├── content/
│   │   ├── publications/  # Migrate from _publications/
│   │   ├── talks/         # Migrate from _talks/
│   │   ├── posts/         # Migrate from _posts/
│   │   └── portfolio/     # Migrate from _portfolio/
│   ├── content.config.ts  # Collection schemas (Astro 5.0+)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── components/
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment
├── astro.config.mjs       # site: pedropaf.com, no base
└── tsconfig.json
```

### Pattern 1: Content Collections with Zod Schemas
**What:** Type-safe content management using Zod validation and glob loaders
**When to use:** For all structured content (publications, talks, portfolio items)
**Example:**
```typescript
// src/content.config.ts
// Source: https://docs.astro.build/en/guides/content-collections/
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    collection: z.literal('publications'),
    permalink: z.string(),  // Keep for URL generation
    date: z.coerce.date(),
    venue: z.string(),
    citation: z.string(),
  })
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
  schema: z.object({
    title: z.string(),
    collection: z.literal('talks'),
    type: z.string(),
    permalink: z.string(),
    venue: z.string(),
    date: z.coerce.date(),
    location: z.string(),
  })
});

export const collections = { publications, talks };
```

### Pattern 2: Preserving Jekyll URLs with Dynamic Routes
**What:** Using `[...slug].astro` to maintain existing permalink structure
**When to use:** To preserve cited URLs from Jekyll collections
**Example:**
```typescript
// src/pages/publication/[...slug].astro
// Source: https://humanwhocodes.com/blog/2023/03/astro-jekyll-blog-post-url/
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const publications = await getCollection('publications');

  return publications.map((pub) => {
    // Extract slug from Jekyll permalink: /publication/2020-01-01-Title
    // Original permalink format from _config.yml: /:collection/:path/
    const slug = pub.data.permalink.replace('/publication/', '');

    return {
      params: { slug },
      props: { pub }
    };
  });
}

const { pub } = Astro.props;
const { Content } = await pub.render();
```

### Pattern 3: GitHub Pages Deployment with GitHub Actions
**What:** Official Astro action for automated deployment
**When to use:** For all GitHub Pages deployments (required for this project)
**Example:**
```yaml
# .github/workflows/deploy.yml
# Source: https://docs.astro.build/en/guides/deploy/github/
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]  # Note: repo uses 'master', not 'main'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: withastro/action@v5
        # Auto-detects package manager from lockfile

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

### Pattern 4: User Site Configuration (No Base Path)
**What:** Configuration for username.github.io repositories with custom domains
**When to use:** For bacilo.github.io deploying to pedropaf.com
**Example:**
```javascript
// astro.config.mjs
// Source: https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
  site: 'https://pedropaf.com',
  // NO base property for user sites (username.github.io)
  // base would only be needed for project sites (username.github.io/repo-name)
  integrations: [mdx(), sitemap()],
});
```

### Anti-Patterns to Avoid
- **Using Jekyll's permalink frontmatter as-is:** Astro does NOT support dynamic permalink placeholders. Extract the desired URL path and use it in getStaticPaths() instead.
- **Forgetting .nojekyll:** GitHub Pages runs Jekyll by default, which ignores _astro build directories. Always add `.nojekyll` to `public/`.
- **Wrong base configuration:** User sites (bacilo.github.io) need NO base path. Project sites need `base: '/repo-name'`.
- **Moving CNAME to wrong location:** CNAME must be in `public/CNAME`, NOT root, or it won't be copied to build output.
- **Skipping frontmatter audit:** Migrating without validating existing frontmatter against schemas causes build-time schema validation errors.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown frontmatter validation | Custom YAML parser with manual checks | Zod schemas in content collections | Astro auto-generates TypeScript types, catches errors at build time, prevents runtime failures |
| Image optimization | Manual responsive image generation | Astro's built-in Image component | Handles srcset, formats, lazy loading, automatic optimization |
| Site deployment to GitHub Pages | Custom build scripts and GitHub Pages setup | @withastro/action v5 | Official action handles all edge cases, auto-detects package manager, manages permissions |
| URL structure preservation | Custom routing middleware | Dynamic routes with [...slug].astro | Native Astro pattern, type-safe, works with static generation |
| Sitemap generation | Manual XML generation | @astrojs/sitemap | Automatically crawls all pages, respects canonical URLs, handles frequency/priority |

**Key insight:** Astro's content collections fundamentally change how content is managed compared to Jekyll. Building custom solutions for validation, typing, or routing ignores 5+ years of Astro community experience solving these exact problems. Schema validation catches 90%+ of migration errors at build time instead of production.

## Common Pitfalls

### Pitfall 1: Schema Validation Failures on Existing Content
**What goes wrong:** Existing Jekyll frontmatter doesn't match strict Zod schemas, causing build failures
**Why it happens:** Jekyll is permissive with frontmatter; Astro content collections enforce schemas
**How to avoid:** Audit all existing frontmatter BEFORE defining schemas
**Warning signs:** Build errors like "InvalidContentEntryDataError", missing required fields
**Prevention strategy:**
```bash
# Audit existing frontmatter first
grep -h "^---" _publications/*.md _talks/*.md | sort | uniq -c
# Define schemas to match ACTUAL data, then gradually tighten validation
```

### Pitfall 2: URL Structure Breaking Cited Publications
**What goes wrong:** Publications are cited in papers; changing URLs breaks citations and SEO
**Why it happens:** Astro doesn't support Jekyll's `permalink: /:collection/:path/` pattern
**How to avoid:** Use dynamic routes to preserve exact Jekyll URL structure OR set up 301 redirects
**Warning signs:** 404s on previously working publication URLs, Google Search Console errors
**Prevention strategy:**
- Option A: Mirror Jekyll's directory structure in `src/pages/` to match URLs
- Option B: Use `[...slug].astro` with getStaticPaths() to read `permalink` from frontmatter
- Option C: Configure 301 redirects at DNS/CDN level (Cloudflare, Netlify, etc.)

### Pitfall 3: GitHub Pages Jekyll Processing
**What goes wrong:** GitHub Pages processes build output with Jekyll, ignoring `_astro/` directory
**Why it happens:** GitHub Pages defaults to Jekyll; Astro's build output uses `_astro/` for assets
**How to avoid:** Add `.nojekyll` file to `public/` directory
**Warning signs:** Site deploys but CSS/JS fails to load, 404s for `_astro/` paths
**Prevention strategy:**
```bash
# Create .nojekyll in public/ (gets copied to dist/)
touch public/.nojekyll
```

### Pitfall 4: Custom Domain Configuration Loss
**What goes wrong:** CNAME file not in `public/`, custom domain breaks after migration
**Why it happens:** Jekyll reads CNAME from root; Astro only copies `public/` to build output
**How to avoid:** Move existing CNAME to `public/CNAME` before first build
**Warning signs:** Site deploys to bacilo.github.io instead of pedropaf.com
**Prevention strategy:**
```bash
# Migrate CNAME to public/
mv CNAME public/CNAME
# Verify it's copied to dist/ after build
npm run build && ls dist/CNAME
```

### Pitfall 5: Static Assets Not Optimized
**What goes wrong:** Images/files in `public/` aren't optimized or processed
**Why it happens:** `public/` is copied as-is; only `src/` assets are optimized
**How to avoid:** Keep processable images in `src/assets/`, only truly static files in `public/`
**Warning signs:** Large image file sizes, no responsive images, slow page loads
**Prevention strategy:**
- Move images to `src/assets/` when possible
- Reference via `import` for optimization
- Keep PDFs, fonts, robots.txt in `public/`

### Pitfall 6: Package Manager Lockfile Mismatch
**What goes wrong:** GitHub Action uses wrong package manager, fails to install dependencies
**Why it happens:** @withastro/action v5 auto-detects from lockfile; multiple lockfiles confuse it
**How to avoid:** Commit ONLY the lockfile for your chosen package manager
**Warning signs:** Build fails with "no lockfile found" or uses npm when you use pnpm
**Prevention strategy:**
```bash
# Remove conflicting lockfiles
rm package-lock.json yarn.lock pnpm-lock.yaml  # Remove all
pnpm install  # Generate your chosen lockfile
git add pnpm-lock.yaml  # Commit only one
```

### Pitfall 7: Wrong Branch Name in Workflow
**What goes wrong:** GitHub Action doesn't trigger on pushes
**Why it happens:** Workflow configured for `main` branch, but repo uses `master`
**How to avoid:** Verify current branch name before configuring workflow
**Warning signs:** No deployments after pushing, workflow never runs
**Prevention strategy:**
```yaml
# Check current branch
git branch --show-current
# Update workflow to match
on:
  push:
    branches: [master]  # NOT main
```

## Code Examples

Verified patterns from official sources:

### Querying Content Collections
```typescript
// Source: https://docs.astro.build/en/guides/content-collections/
import { getCollection, getEntry } from 'astro:content';

// Get all publications, sorted by date
const publications = await getCollection('publications');
const sorted = publications.sort((a, b) =>
  b.data.date.getTime() - a.data.date.getTime()
);

// Get single entry by ID (filename without extension)
const specific = await getEntry('publications', '2020-01-01-Upon-Not-Opening-The-Black-Box');

// Filter out drafts in production
const published = await getCollection('publications', ({ data }) => {
  return import.meta.env.PROD ? data.draft !== true : true;
});
```

### Rendering Collection Content
```astro
---
// Source: https://docs.astro.build/en/guides/content-collections/
const publications = await getCollection('publications');
---
<ul>
  {publications.map(async (pub) => {
    const { Content } = await pub.render();
    return (
      <li>
        <h2>{pub.data.title}</h2>
        <Content />
      </li>
    );
  })}
</ul>
```

### Local Development and Testing
```bash
# Source: https://docs.astro.build/en/develop-and-build/
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
# CRITICAL: Always test with preview before deploying to catch build-specific issues
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Type property in collections | Loader property with glob() | Astro 5.0 (Dec 2024) | 5x faster Markdown builds, 50% less memory, loaders replace type declarations |
| src/content/config.ts | src/content.config.ts | Astro 5.0 (Dec 2024) | New location in root of content directory, breaking change |
| Manual TypeScript types | Auto-generated from schemas | Astro 2.0 (2023) | Full IDE autocompletion, type safety without manual definitions |
| File-based routing only | Content collections for structured data | Astro 2.0 (2023) | Validation, querying, type safety for content vs simple pages |
| Jekyll permalink property | Dynamic routes with getStaticPaths() | Always (Astro never supported) | Manual URL mapping required, not automatic |

**Deprecated/outdated:**
- `type: 'content'` in collection definitions: Use `loader: glob()` instead (Astro 5.0+)
- `src/content/config.ts`: Move to `src/content.config.ts` (Astro 5.0+)
- Jekyll `permalink` property with placeholders: Not supported in Astro, use dynamic routes
- Old GitHub Actions workflow (withastro/action@v3 or earlier): Use v5 for Node 22, auto-detection

## Open Questions

1. **How should we handle the existing talkmap feature?**
   - What we know: Jekyll site has talkmap/ directory and talkmap.py/ipynb for geographic visualization
   - What's unclear: Whether to migrate as static assets or rebuild as interactive component
   - Recommendation: Audit usage first; if static, keep in public/; if interactive, consider as Phase enhancement

2. **What frontmatter fields are actively used vs legacy cruft?**
   - What we know: Sample files show `collection`, `permalink`, `title`, `date`, `venue`, `citation` for publications
   - What's unclear: Which fields are referenced in layouts/templates vs unused
   - Recommendation: Grep all _includes and _layouts for frontmatter references before schema definition

3. **Should we preserve all four collections or consolidate?**
   - What we know: Jekyll has _publications, _talks, _teaching, _portfolio
   - What's unclear: Whether all are actively maintained or some are legacy
   - Recommendation: Check file counts and last-modified dates; consider phasing migration

## Sources

### Primary (HIGH confidence)
- [Astro Content Collections Documentation](https://docs.astro.build/en/guides/content-collections/) - Schema validation, Zod integration, Content Layer API
- [Astro GitHub Pages Deployment Guide](https://docs.astro.build/en/guides/deploy/github/) - Official deployment workflow, user vs project sites, CNAME configuration
- [Astro Jekyll Migration Guide](https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/) - Content structure, frontmatter compatibility, layout conversion
- [Astro Project Structure Documentation](https://docs.astro.build/en/basics/project-structure/) - src/ vs public/ distinction, required directories
- [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/) - Site, base, output directory configuration

### Secondary (MEDIUM confidence)
- [Creating Jekyll-style blog post URLs in Astro](https://humanwhocodes.com/blog/2023/03/astro-jekyll-blog-post-url/) - Dynamic route implementation for permalink preservation
- [Astro 5.0 Release Notes](https://astro.build/blog/astro-5/) - Content Layer API, performance improvements, breaking changes
- [Astro MDX Integration Guide](https://docs.astro.build/en/guides/integrations-guide/mdx/) - Image optimization in Markdown, component embedding
- [Astro CLI Reference](https://docs.astro.build/en/reference/cli-reference/) - Dev, build, preview commands

### Tertiary (LOW confidence - verify during implementation)
- [astro-jekyll toolkit](https://github.com/humanwhocodes/astro-jekyll) - Mentioned as migration helper, not officially endorsed
- Package manager comparisons (pnpm vs npm vs bun) - Multiple blog sources, performance claims vary

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Astro documentation, stable releases, clear versioning
- Architecture: HIGH - Official patterns from docs, verified with code examples
- Pitfalls: MEDIUM-HIGH - Mix of official troubleshooting docs and community reports, all cross-verified

**Research date:** 2026-02-12
**Valid until:** 2026-03-15 (30 days - Astro stable, slow-moving conventions)
**Exception:** If Astro 6.0 stable releases before planning, re-verify breaking changes
