# Phase 8: Blog Enhancement - Research

**Researched:** 2026-02-12
**Domain:** Astro 5 blog filtering (tags/categories) and RSS feed generation
**Confidence:** HIGH

## Summary

Phase 8 adds content discovery features to the blog foundation built in Phase 7. The requirements focus on three core features: tag filtering (BLOG-04), category filtering (BLOG-05), and RSS feed generation (BLOG-06). The existing blog implementation provides a solid foundation—posts already have tags in frontmatter, the Content Layer API is configured, and the blog archive displays tags as non-interactive badges.

Research reveals that Astro's standard approach treats tags and categories identically as flat taxonomies using dynamic routes (`src/pages/tags/[tag].astro`). The current Jekyll migration has "category1", "category2", "category3" mixed into the `tags` array, suggesting the original implementation didn't distinguish between them. Best practices from broader blogging platforms recommend categories for broad hierarchical organization (8-10 max) and tags for specific cross-cutting topics, but **implementing true hierarchical categories in Astro requires custom logic**—not worth the complexity for a personal academic blog with 5 posts.

For RSS feeds, `@astrojs/rss` is the official package. The standard pattern creates a `.xml.js` endpoint in `src/pages/`, uses `getCollection()` to fetch posts, and maps them to RSS items with title, description, link, and pubDate. Full content inclusion (required by BLOG-06) needs markdown-it for parsing `post.body` to HTML and sanitize-html for security.

**Primary recommendation:** Implement tag filtering with clickable tags linking to `/tags/[tag]/` pages showing filtered posts. Treat "category1/2/3" as regular tags (no special category handling). Generate RSS feed at `/rss.xml` with full post content. This delivers all requirements with minimal complexity and aligns with Astro best practices.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Static site framework | Already in use, Content Layer API with dynamic routing for tag pages |
| @astrojs/rss | ^4.x | RSS feed generation | Official Astro integration, handles XML escaping, namespace management, RSS spec compliance |
| markdown-it | ^14.x | Markdown to HTML parsing | Industry standard, used in Astro docs examples, processes `post.body` for RSS content |
| sanitize-html | ^2.x | HTML sanitization | Security requirement for RSS feeds, prevents XSS, recommended by Astro docs |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| node-html-parser | ^6.x | DOM manipulation for HTML | Optional - only if fixing relative image paths in RSS feed (convert to absolute URLs) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Dynamic tag routes | Client-side filtering with JavaScript | Dynamic routes = zero JS, SEO-friendly, better UX; client-side = requires hydration, worse for SEO |
| markdown-it | rehype/remark pipeline | markdown-it is simpler for RSS use case; rehype/remark better for complex transformations but overkill here |
| Full content RSS | Excerpt-only RSS | Full content prevents scraping but better UX for readers; excerpt drives traffic but worse reader experience |
| Separate tags/categories | Single "tags" taxonomy | Categories add hierarchy complexity; single taxonomy simpler and sufficient for small blog |

**Installation:**
```bash
npm install @astrojs/rss markdown-it sanitize-html
```

## Architecture Patterns

### Pattern 1: Dynamic Tag Filtering Pages

**What:** Use Astro's dynamic routes to generate static pages for each unique tag, showing all posts with that tag.

**When to use:** Always for tag-based filtering in static Astro blogs. Zero JavaScript, SEO-friendly, instant page loads.

**Example:**
```astro
---
// src/pages/tags/[tag].astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');

  // Filter out future posts
  const now = new Date();
  const publishedPosts = posts.filter(post => post.data.date <= now);

  // Extract all unique tags
  const allTags = publishedPosts
    .flatMap(post => post.data.tags || [])
    .filter((tag, index, array) => array.indexOf(tag) === index); // Deduplicate

  // Generate a route for each tag
  return allTags.map(tag => {
    const filteredPosts = publishedPosts
      .filter(post => post.data.tags?.includes(tag))
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

    return {
      params: { tag },
      props: { posts: filteredPosts },
    };
  });
}

const { tag } = Astro.params;
const { posts } = Astro.props;
---

<BaseLayout title={`Posts tagged "${tag}"`}>
  <h1>Posts tagged "{tag}"</h1>
  <p class="count">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>

  <ul class="post-list">
    {posts.map(post => (
      <li class="post-item">
        <a href={post.data.permalink}>
          <h2>{post.data.title}</h2>
        </a>
        <time datetime={post.data.date.toISOString()}>
          {post.data.date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </li>
    ))}
  </ul>
</BaseLayout>
```

**Source:** [Build a blog tutorial: Generate tag pages - Astro Docs](https://docs.astro.build/en/tutorial/5-astro-api/2/)

### Pattern 2: Clickable Tags on Posts

**What:** Convert displayed tags from static badges to clickable links that navigate to tag filter pages.

**When to use:** Always when tag filtering is implemented. Core UX pattern for content discovery.

**Example:**
```astro
---
// In src/pages/posts/[...slug].astro or index.astro
const tags = post.data.tags || [];
---

{tags.length > 0 && (
  <div class="tags" role="list" aria-label="Post tags">
    {tags.map(tag => (
      <a href={`/tags/${tag}/`} class="tag" role="listitem">
        {tag}
      </a>
    ))}
  </div>
)}

<style>
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .tag {
    display: inline-block;
    background: var(--color-header-bg);
    color: var(--color-text-muted);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    text-decoration: none;
    transition: background 0.2s ease;
  }

  .tag:hover {
    background: var(--color-link);
    color: var(--color-bg);
  }
</style>
```

### Pattern 3: RSS Feed with Full Content

**What:** Generate an RSS 2.0 feed at `/rss.xml` with full post content rendered from markdown.

**When to use:** Always for blogs where readers subscribe via feed readers. Required by BLOG-06.

**Example:**
```javascript
// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection('posts');

  // Filter out future posts
  const now = new Date();
  const publishedPosts = posts
    .filter(post => post.data.date <= now)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Pedro Figueira - Blog',
    description: 'Thoughts on research, technology, and nomadic life',
    site: context.site,
    items: publishedPosts.map(post => {
      // Generate permalink
      const permalink = post.data.permalink || (() => {
        const date = post.data.date;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const postName = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
        return `/posts/${year}/${month}/${postName}/`;
      })();

      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.body.substring(0, 160) + '...', // First 160 chars as excerpt
        link: permalink,
        content: sanitizeHtml(parser.render(post.body), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        }),
      };
    }),
  });
}
```

**Source:** [Add an RSS feed - Astro Docs](https://docs.astro.build/en/recipes/rss/), [Adding RSS Feed Content - Billy Le](https://billyle.dev/posts/adding-rss-feed-content-and-fixing-markdown-image-paths-in-astro)

### Pattern 4: RSS Feed Auto-Discovery

**What:** Add `<link>` tag to site header for browsers and feed readers to auto-detect RSS feed.

**When to use:** Always when RSS feed exists. Enables "Subscribe" button in browsers.

**Example:**
```astro
---
// In BaseLayout.astro head section
---
<head>
  <!-- ... other head elements ... -->
  <link
    rel="alternate"
    type="application/rss+xml"
    title="Pedro Figueira - Blog"
    href={new URL('rss.xml', Astro.site)}
  />
</head>
```

**Source:** [Add an RSS feed - Astro Docs](https://docs.astro.build/en/recipes/rss/)

### Pattern 5: Tag Index Page (Optional)

**What:** Create a `/tags/` index page listing all tags with post counts.

**When to use:** Optional enhancement for tag discovery. Useful when blog grows beyond 10 tags.

**Example:**
```astro
---
// src/pages/tags/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = await getCollection('posts');
const now = new Date();
const publishedPosts = posts.filter(post => post.data.date <= now);

// Count posts per tag
const tagCounts = publishedPosts
  .flatMap(post => post.data.tags || [])
  .reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

const tags = Object.entries(tagCounts)
  .sort(([, a], [, b]) => b - a); // Sort by count descending
---

<BaseLayout title="All Tags">
  <h1>All Tags</h1>
  <ul class="tag-cloud">
    {tags.map(([tag, count]) => (
      <li>
        <a href={`/tags/${tag}/`}>
          {tag} <span class="count">({count})</span>
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

### Anti-Patterns to Avoid

- **Client-side tag filtering:** Requires JavaScript, worse for SEO, slower initial load—use static routes instead
- **Hardcoding tag list:** Tags should be auto-discovered from post frontmatter, not manually maintained
- **Not sanitizing RSS content:** Security vulnerability—always use sanitize-html before outputting user content
- **Missing site in astro.config:** RSS feed generation requires `site` configured for absolute URLs
- **Forgetting to filter future posts:** RSS feeds and tag pages should exclude future-dated posts like the main archive
- **Not using `content` field for full RSS content:** Putting full HTML in `description` violates RSS spec
- **Mixing hierarchical categories with flat tags:** Either commit to separate taxonomies or treat all as tags—half-measures confuse users

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RSS feed XML generation | Manual XML templating | @astrojs/rss package | Handles namespaces, escaping, spec compliance, podcast tags; manual XML risks malformed feeds |
| HTML sanitization | Regex-based tag stripping | sanitize-html package | Prevents XSS, handles nested tags, configurable allowlists, battle-tested security |
| Markdown to HTML | Custom parser | markdown-it or Astro's render() | Edge cases: nested lists, code blocks, HTML entities, escaping; markdown-it handles CommonMark spec |
| Tag deduplication | Manual loop with includes() | Set data structure | Set automatically deduplicates, handles case sensitivity, more performant |
| URL slug generation | String replace logic | Existing permalink pattern | Already handles date formatting, filename parsing, fallback logic—reuse it |

**Key insight:** Astro's dynamic routing (`getStaticPaths()`) is designed for this exact use case—generating static pages for each taxonomy term. Don't build client-side filtering when static generation gives better performance and SEO for free.

## Common Pitfalls

### Pitfall 1: Tag Case Sensitivity Causing Duplicate Pages

**What goes wrong:** "Cool Posts" and "cool posts" generate separate tag pages, fragmenting content.

**Why it happens:** JavaScript string comparison is case-sensitive by default. `tags.includes(tag)` treats "Cool" and "cool" as different.

**How to avoid:** Normalize tags to lowercase when generating routes and filtering posts. Store normalized version in route params.

**Warning signs:** Multiple tag pages for same semantic tag, low post counts per tag, user confusion about which tag to use.

**Implementation:**
```javascript
// In getStaticPaths()
const allTags = publishedPosts
  .flatMap(post => post.data.tags || [])
  .map(tag => tag.toLowerCase())
  .filter((tag, index, array) => array.indexOf(tag) === index);

// When filtering
const filteredPosts = publishedPosts.filter(post =>
  post.data.tags?.some(t => t.toLowerCase() === tag)
);
```

### Pitfall 2: Missing `site` Configuration Breaking RSS Feed

**What goes wrong:** RSS feed generation fails with error "Invalid options: site is required" or generates relative URLs.

**Why it happens:** @astrojs/rss requires `site` in `astro.config.mjs` to construct absolute URLs for feed items.

**How to avoid:** Always set `site: 'https://yourdomain.com'` in Astro config before implementing RSS.

**Warning signs:** Build errors mentioning site/URL, feed validation errors, relative URLs in RSS items.

**Status:** ✅ Current project has `site: 'https://pedropaf.com'` configured.

**Source:** [Add an RSS feed - Astro Docs](https://docs.astro.build/en/recipes/rss/)

### Pitfall 3: RSS Feed Not Filtering Future Posts

**What goes wrong:** Draft posts with future dates appear in RSS feed before publication.

**Why it happens:** Forgetting to apply the same `date <= now` filter used in blog archive.

**How to avoid:** Always filter posts in RSS generation just like blog archive. Extract filter logic to shared function if needed.

**Warning signs:** Future-dated posts appearing in feed readers, subscribers seeing drafts, premature publication.

### Pitfall 4: Relative Image Paths Breaking in RSS Readers

**What goes wrong:** Images in blog posts show broken in feed readers like Feedly because RSS contains relative paths (`./image.png`).

**Why it happens:** RSS items need absolute URLs. Relative paths work on website but not in external feed readers.

**How to avoid:**
- Simple: Don't use relative images in markdown, use absolute URLs
- Advanced: Use node-html-parser to find `<img>` tags and prepend `context.site`

**Warning signs:** Images missing in feed readers but working on site, feed validation warnings about relative URLs.

**Source:** [Adding RSS Feed Content and Fixing Markdown Image Paths - Billy Le](https://billyle.dev/posts/adding-rss-feed-content-and-fixing-markdown-image-paths-in-astro)

### Pitfall 5: Unsanitized HTML in RSS Content

**What goes wrong:** Malicious or broken HTML in markdown breaks feed readers or creates XSS vulnerabilities.

**Why it happens:** Rendering markdown to HTML without sanitization allows arbitrary HTML/JavaScript through.

**How to avoid:** Always pass markdown-rendered HTML through sanitize-html before setting `content` field.

**Warning signs:** Feed validation errors, RSS readers crashing on your feed, security audit findings.

### Pitfall 6: Tag Links Without URL Encoding

**What goes wrong:** Tags with spaces or special characters generate invalid URLs (`/tags/cool posts/` → 404).

**Why it happens:** Astro's dynamic routes expect URL-safe strings. Spaces and special chars need encoding.

**How to avoid:** Use `encodeURIComponent(tag)` when generating links, `decodeURIComponent()` when reading params.

**Implementation:**
```astro
{/* Creating links */}
<a href={`/tags/${encodeURIComponent(tag)}/`}>{tag}</a>

{/* In [tag].astro */}
const { tag } = Astro.params;
const decodedTag = decodeURIComponent(tag);
```

**Warning signs:** 404s for tags with spaces, URL encoding visible in page title, broken tag navigation.

### Pitfall 7: Not Reusing Permalink Generation Logic

**What goes wrong:** RSS feed generates different URLs than blog pages, causing broken links.

**Why it happens:** Duplicating permalink logic in RSS feed instead of reusing the same logic from blog pages.

**How to avoid:** Extract permalink generation to shared utility function or carefully replicate exact same logic.

**Warning signs:** RSS links 404, URLs in feed don't match actual blog post URLs, reader complaints about broken links.

## Code Examples

### Complete Tag Filtering Implementation

```astro
---
// src/pages/tags/[tag].astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  const now = new Date();
  const publishedPosts = posts.filter(post => post.data.date <= now);

  // Extract and normalize all unique tags
  const allTags = [...new Set(
    publishedPosts
      .flatMap(post => post.data.tags || [])
      .map(tag => tag.toLowerCase())
  )];

  return allTags.map(tag => {
    const filteredPosts = publishedPosts
      .filter(post =>
        post.data.tags?.some(t => t.toLowerCase() === tag)
      )
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

    return {
      params: { tag },
      props: { posts: filteredPosts, displayTag: filteredPosts[0]?.data.tags?.find(t => t.toLowerCase() === tag) || tag },
    };
  });
}

const { tag } = Astro.params;
const { posts, displayTag } = Astro.props;
---

<BaseLayout title={`Posts tagged "${displayTag}"`}>
  <nav class="breadcrumb">
    <a href="/posts/">Blog</a> / <a href="/tags/">Tags</a> / {displayTag}
  </nav>

  <h1>Posts tagged "{displayTag}"</h1>
  <p class="count">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>

  <ul class="post-list">
    {posts.map(post => {
      const permalink = post.data.permalink || (() => {
        const date = post.data.date;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const postName = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
        return `/posts/${year}/${month}/${postName}/`;
      })();

      return (
        <li class="post-item">
          <a href={permalink}>
            <h2>{post.data.title}</h2>
          </a>
          <p class="meta">
            <time datetime={post.data.date.toISOString()}>
              {post.data.date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </p>
        </li>
      );
    })}
  </ul>

  <p class="back-link">
    <a href="/tags/">← View all tags</a>
  </p>
</BaseLayout>

<style>
  .breadcrumb {
    color: var(--color-text-muted);
    font-size: 0.875rem;
    margin-bottom: var(--space-md);
  }

  .breadcrumb a {
    color: var(--color-link);
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .count {
    color: var(--color-text-muted);
    margin-bottom: var(--space-lg);
  }

  .post-list {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--space-lg) 0;
  }

  .post-item {
    padding: var(--space-md) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .post-item:last-child {
    border-bottom: none;
  }

  .post-item h2 {
    font-size: 1.125rem;
    margin: 0 0 var(--space-xs) 0;
  }

  .post-item a {
    text-decoration: none;
  }

  .post-item a:hover h2 {
    color: var(--color-link);
  }

  .meta {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  .back-link a {
    color: var(--color-link);
    text-decoration: none;
  }

  .back-link a:hover {
    text-decoration: underline;
  }
</style>
```

### Updated Tags Component (Clickable)

```astro
---
// Update existing tag display in posts/[...slug].astro and posts/index.astro
const tags = post.data.tags || [];
---

{tags.length > 0 && (
  <div class="tags" role="list" aria-label="Post tags">
    {tags.map(tag => (
      <a
        href={`/tags/${encodeURIComponent(tag.toLowerCase())}/`}
        class="tag"
        role="listitem"
      >
        {tag}
      </a>
    ))}
  </div>
)}

<style>
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .tag {
    display: inline-block;
    background: var(--color-header-bg);
    color: var(--color-text-muted);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .tag:hover {
    background: var(--color-link);
    color: var(--color-bg);
    transform: translateY(-1px);
  }
</style>
```

### Complete RSS Feed with Full Content

```javascript
// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection('posts');

  // Filter and sort published posts
  const now = new Date();
  const publishedPosts = posts
    .filter(post => post.data.date <= now)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Pedro Figueira - Blog',
    description: 'Thoughts on research, technology, and nomadic life',
    site: context.site,
    items: publishedPosts.map(post => {
      // Generate permalink (reuse same logic as blog pages)
      const permalink = post.data.permalink || (() => {
        const date = post.data.date;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const postName = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
        return `/posts/${year}/${month}/${postName}/`;
      })();

      // Extract first paragraph as description
      const firstParagraph = post.body
        .split('\n\n')
        .find(p => p.trim() && !p.startsWith('#'));
      const description = firstParagraph
        ? firstParagraph.substring(0, 160).trim() + '...'
        : post.data.title;

      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: description,
        link: permalink,
        content: sanitizeHtml(parser.render(post.body), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        }),
        categories: post.data.tags || [],
      };
    }),
  });
}
```

### RSS Auto-Discovery in BaseLayout

```astro
---
// src/layouts/BaseLayout.astro
const { title } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>

    {/* RSS feed auto-discovery */}
    <link
      rel="alternate"
      type="application/rss+xml"
      title="Pedro Figueira - Blog"
      href={new URL('rss.xml', Astro.site)}
    />

    {/* ... other head elements ... */}
  </head>
  <body>
    <slot />
  </body>
</html>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import.meta.glob()` for posts | Content Layer API with `getCollection()` | Astro 5.0 (2025) | Better TypeScript support, validation, faster builds |
| `entry.compiledContent()` | `markdown-it` for RSS | Astro 5.0 (2025) | Content Layer API entries don't expose compiledContent(); use parser instead |
| Client-side filtering | Static generation with `getStaticPaths()` | Astro 1.0+ (2022) | Zero JavaScript, better SEO, instant page loads |
| Manual RSS XML | @astrojs/rss package | Astro 1.0+ (2022) | Handles escaping, namespaces, spec compliance |
| Full-text RSS as default | Excerpt-preferred RSS | Ongoing best practice | Prevents scraping, drives traffic, though reader preference varies |

**Deprecated/outdated:**
- **`import.meta.glob()` for content queries**: Use Content Layer API's `getCollection()` (Astro 5.0+)
- **`.compiledContent()` method**: Not available in Content Layer API; use markdown-it or similar parser (Astro 5.0+)
- **Inline tag filter pages**: Use `getStaticPaths()` dynamic routing instead of hardcoded pages

## Open Questions

1. **Tags vs Categories Distinction**
   - What we know: Current posts have "category1/2/3" mixed into tags array. Requirements mention separate BLOG-04 (tags) and BLOG-05 (categories) but schema only has `tags` field.
   - What's unclear: Whether user wants true hierarchical categories or if "categories" in requirements just means "tag filtering."
   - Recommendation: **Treat all as flat tags** (current implementation) unless user explicitly requests separate category taxonomy. Adding category field to schema + separate routes adds complexity for minimal UX gain on a 5-post blog.

2. **Category Implementation Path**
   - What we know: True hierarchical categories (like WordPress) require custom logic—not Astro built-in
   - What's unclear: If BLOG-05 means "filter by category tags" or "implement hierarchical category system"
   - Recommendation: **Assume BLOG-05 = filtering by tags named "category1/2/3"**. If user wants hierarchy, that's a schema change + separate feature.

3. **RSS Feed Content Scope**
   - What we know: BLOG-06 says "RSS feed includes recent posts with full content"
   - What's unclear: Define "recent"—all published posts, or limited to last N posts?
   - Recommendation: **Include all published posts** (standard RSS behavior). If user wants limited feed, add `.slice(0, 20)` to publishedPosts.

4. **Tag Index Page Priority**
   - What we know: Tag pages are required (BLOG-04), tag index page is optional enhancement
   - What's unclear: User priority for tag discovery UX
   - Recommendation: **Include tag index page** (`/tags/`) in initial implementation—low effort, high UX value for navigation.

## Sources

### Primary (HIGH confidence)
- [Build a blog tutorial: Generate tag pages - Astro Docs](https://docs.astro.build/en/tutorial/5-astro-api/2/) - Official pattern for tag filtering with getStaticPaths
- [Add an RSS feed - Astro Docs](https://docs.astro.build/en/recipes/rss/) - Official RSS implementation guide
- [@astrojs/rss - npm](https://www.npmjs.com/package/@astrojs/rss) - Package documentation and API reference
- [Build a blog tutorial: Add an RSS feed - Astro Docs](https://docs.astro.build/en/tutorial/5-astro-api/4/) - RSS tutorial with examples

### Secondary (MEDIUM confidence)
- [Adding RSS Feed Content and Fixing Markdown Image Paths - Billy Le](https://billyle.dev/posts/adding-rss-feed-content-and-fixing-markdown-image-paths-in-astro) - Full content RSS with markdown-it and image handling
- [Creating individual tag pages in Astro via dynamic routes - rainsberger.ca](https://www.rainsberger.ca/blog/dynamic-routing-tag-pages-in-astro/) - Tag page implementation patterns
- [How to Add Filters to Your Astro Blog - Digital Expanse](https://digital-expanse.com/tutorials/astro-blog-filters/) - Filtering strategies
- [Astro Paging And Listing By Category - Steve Fenton](https://stevefenton.co.uk/blog/2022/10/astro-paging-and-listing-by-category/) - Category filtering example
- [Categories vs Tags - SEO Best Practices - WPBeginner](https://www.wpbeginner.com/beginners-guide/categories-vs-tags-seo-best-practices-which-one-is-better/) - Taxonomy best practices
- [Categories vs. Tags: What's the difference? - Learn WordPress](https://learn.wordpress.org/tutorial/categories-vs-tags-whats-the-difference/) - Taxonomy concepts
- [WordPress RSS Feeds: Summary vs. Full Text - Gretchen Louise](https://gretchenlouise.com/wordpress-rss-feeds-summary-full-custom/) - RSS content strategy
- [Why Having A Full Post RSS Feed Is A Good Idea - Kev Quirk](https://kevquirk.com/blog/why-having-a-full-post-rss-feed-is-a-good-idea/) - Full content RSS advocacy

### Tertiary (LOW confidence)
- General consensus from community blogs: treat tags as flat taxonomy in Astro, hierarchical categories require custom implementation
- RSS feed reader preference for full content varies by audience—academic/technical readers prefer full text, general blogs prefer excerpts

## Metadata

**Confidence breakdown:**
- Tag filtering with getStaticPaths: HIGH - Verified through official Astro docs, standard pattern, tested in community
- RSS feed generation: HIGH - Official @astrojs/rss package, documented in Astro recipes, verified examples
- Full content RSS with markdown-it: MEDIUM-HIGH - Community pattern documented across multiple sources, not in official docs but widely used
- Tags vs categories distinction: LOW - Current project has ambiguous implementation, requirements unclear on hierarchy need

**Research date:** 2026-02-12
**Valid until:** ~2026-03-14 (30 days - Astro 5 stable, RSS patterns mature)

**Notes:**
- Existing blog infrastructure (Phase 7) provides strong foundation—tags exist, schema configured, permalinks working
- No code refactoring needed—only additions (tag routes, RSS endpoint, clickable tag links)
- All three requirements (BLOG-04, BLOG-05, BLOG-06) can be satisfied with single "tags" taxonomy approach
- If user wants true hierarchical categories, that's a follow-up conversation—not assumed from requirements
