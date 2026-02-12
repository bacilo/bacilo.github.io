# Phase 7: Blog Foundation - Research

**Researched:** 2026-02-12
**Domain:** Astro 5 blog implementation, markdown rendering, Content Layer API
**Confidence:** HIGH

## Summary

Phase 7 implements the blog foundation for an Astro 5.x site where the core infrastructure already exists. Blog posts are already migrated (5 posts in `src/content/posts/`), the content collection schema is configured with the Content Layer API's `glob()` loader, and dynamic routes preserve Jekyll's `/YYYY/MM/title/` URL structure (implemented in Phase 02-02).

The technical work for this phase focuses on enhancing the existing blog post display pages and archive. Current implementation uses Astro 5's `render()` function for markdown rendering (not the deprecated `entry.render()`), displays tags from frontmatter, filters future-dated posts for draft support, and sorts chronologically (newest first).

Key architectural patterns are already established: BaseLayout with semantic HTML (`<article>`, `<header>`, `<section>`), scoped CSS with custom properties for theming, and Content Layer API for type-safe content queries. The research confirms these patterns align with 2026 best practices for static blog implementations.

**Primary recommendation:** Enhance the existing implementation with improved markdown styling (prose typography), semantic HTML refinements for accessibility and SEO (proper article structure, microdata/JSON-LD), and optional tag filtering. Do not rebuild what's working - the URL structure, content schema, and basic rendering are production-ready.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Static site framework | Content Layer API with 5x faster builds, native markdown/MDX support, zero-JS by default |
| Content Layer API | Astro 5.0+ | Content loading and validation | Modern replacement for legacy collections API, supports glob loader for markdown files |
| render() function | Astro 5.0+ | Markdown to HTML rendering | Returns `<Content />` component and metadata; replaces deprecated `entry.render()` |
| Zod | ^3.x | Schema validation | Built-in Astro integration for type-safe frontmatter validation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/typography | 4.x+ | Prose styling for markdown | Optional - provides pre-built styles for markdown content, alternative to custom CSS |
| date-fns | Latest | Date formatting/manipulation | Optional - if complex date operations needed beyond native Date API |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom prose CSS | @tailwindcss/typography | Tailwind plugin requires Tailwind dependency but provides battle-tested markdown styles |
| Native Date API | date-fns library | date-fns adds 11KB but simplifies timezone handling; native API sufficient for simple formatting |
| Manual tag pages | Dynamic tag archive routes | Tag filtering adds complexity; defer unless user explicitly requests tag-based navigation |

**Installation:**
```bash
# Core already installed (Astro 5.x in package.json)
# Already configured: glob loader, Content Layer API, render()

# Optional: Tailwind Typography (requires Tailwind CSS)
npm install @tailwindcss/typography

# Optional: Advanced date handling
npm install date-fns
```

## Architecture Patterns

### Pattern 1: Content Layer API with Glob Loader (ALREADY IMPLEMENTED)

**What:** Load blog posts from filesystem using `glob()` loader with Zod schema validation.

**When to use:** Always for markdown-based blogs. Already implemented in this project.

**Example:**
```typescript
// src/content.config.ts (ALREADY EXISTS)
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    permalink: z.string().optional(),
  })
});
```

**Status:** ✅ Already implemented. Schema supports required fields (title, date) and optional fields (tags, permalink).

### Pattern 2: Astro 5 render() Function (ALREADY IMPLEMENTED)

**What:** Use `render()` function imported from `'astro:content'` instead of deprecated `entry.render()`.

**When to use:** Always in Astro 5.x for rendering markdown/MDX entries.

**Example:**
```astro
---
// src/pages/posts/[...slug].astro (ALREADY EXISTS)
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: /* generated from permalink */ },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post); // ✅ Correct Astro 5 pattern
---

<BaseLayout title={post.data.title}>
  <article>
    <Content />
  </article>
</BaseLayout>
```

**Status:** ✅ Already implemented correctly. Uses `render()` not `entry.render()`.

### Pattern 3: Semantic HTML for Blog Posts

**What:** Use semantic HTML5 elements (`<article>`, `<header>`, `<time>`, `<section>`) for accessibility and SEO.

**When to use:** Always. Critical for screen readers, search engines, and reader modes.

**Example:**
```astro
<article class="post">
  <header>
    <h1>{post.data.title}</h1>
    <p class="meta">
      <time datetime={post.data.date.toISOString()}>
        {post.data.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </time>
    </p>
    {post.data.tags && (
      <div class="tags" role="list" aria-label="Post tags">
        {post.data.tags.map(tag => (
          <span class="tag" role="listitem">{tag}</span>
        ))}
      </div>
    )}
  </header>

  <section class="content">
    <Content />
  </section>
</article>
```

**Status:** ✅ Already partially implemented. Current code uses `<article>`, `<header>`, `<time datetime>`, and `<section>`. Minor enhancement: add ARIA roles to tags for better accessibility.

### Pattern 4: Filtering Future-Dated Posts (ALREADY IMPLEMENTED)

**What:** Filter out posts with dates in the future to support draft workflows.

**When to use:** Always for production blog archives. Allows authors to schedule posts.

**Example:**
```astro
---
// src/pages/posts/index.astro (ALREADY EXISTS)
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
const now = new Date();
const publishedPosts = posts
  .filter(post => post.data.date <= now)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
```

**Status:** ✅ Already implemented. Archive page filters `post.data.date <= now` and sorts newest first.

### Pattern 5: Permalink Generation with Fallback (ALREADY IMPLEMENTED)

**What:** Read permalink from frontmatter, fall back to generated URL from date + filename if missing.

**When to use:** Always when migrating from Jekyll or supporting custom URLs.

**Example:**
```typescript
// Generate permalink if not in frontmatter
const permalink = post.data.permalink || (() => {
  const date = post.data.date;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const postName = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  return `/posts/${year}/${month}/${postName}/`;
})();
```

**Status:** ✅ Already implemented in both dynamic route (`[...slug].astro`) and archive page (`index.astro`).

### Pattern 6: Prose Typography for Markdown Content

**What:** Apply consistent, readable typography styles to rendered markdown content.

**When to use:** Always. Markdown HTML needs spacing, font sizing, and visual hierarchy.

**Option A: Custom CSS (lightweight):**
```css
.content {
  line-height: 1.7;
}

.content :global(h1),
.content :global(h2),
.content :global(h3) {
  margin-top: var(--space-md);
  margin-bottom: var(--space-sm);
  line-height: 1.3;
}

.content :global(h2) {
  font-size: 1.5rem;
}

.content :global(h3) {
  font-size: 1.25rem;
}

.content :global(p) {
  margin-bottom: var(--space-sm);
}

.content :global(ul),
.content :global(ol) {
  margin-bottom: var(--space-sm);
  padding-left: 1.5rem;
}

.content :global(li) {
  margin-bottom: 0.25rem;
}

.content :global(blockquote) {
  border-left: 4px solid var(--color-border);
  padding-left: var(--space-sm);
  margin: var(--space-md) 0;
  color: var(--color-text-muted);
  font-style: italic;
}

.content :global(code) {
  font-family: var(--font-mono);
  background: var(--color-header-bg);
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-size: 0.875em;
}

.content :global(pre) {
  background: var(--color-header-bg);
  padding: var(--space-sm);
  border-radius: 4px;
  overflow-x: auto;
  margin: var(--space-md) 0;
}

.content :global(pre code) {
  background: none;
  padding: 0;
}

.content :global(img) {
  max-width: 100%;
  height: auto;
  margin: var(--space-md) 0;
  border-radius: 4px;
}
```

**Option B: Tailwind Typography plugin:**
```astro
<article class="prose prose-slate lg:prose-lg">
  <Content />
</article>
```

**Status:** ⚠️ Partially implemented. Current code has basic heading styles. Recommendation: Expand custom CSS for comprehensive prose styling (blockquotes, lists, code blocks, images) rather than adding Tailwind dependency.

### Pattern 7: Tag Display (ALREADY IMPLEMENTED)

**What:** Display tags as visual badges from frontmatter array.

**When to use:** Always if content has tags. Provides visual categorization.

**Example (already implemented):**
```astro
{tags.length > 0 && (
  <div class="tags">
    {tags.map(tag => (
      <span class="tag">{tag}</span>
    ))}
  </div>
)}
```

```css
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
}
```

**Status:** ✅ Already implemented. Both individual post pages and archive display tags.

### Anti-Patterns to Avoid

- **Using `entry.render()`:** Deprecated in Astro 5. Always import `render` from `'astro:content'`
- **Not filtering future posts:** Breaks draft workflows - always filter by `date <= now` in public archives
- **Forgetting `datetime` attribute on `<time>`:** Required for accessibility and SEO - include ISO 8601 format
- **Inline styles for markdown content:** Use `:global()` selectors to style rendered markdown within scoped components
- **Hardcoding blog post URLs:** Always use permalink fallback pattern for flexibility
- **Not using semantic HTML:** Screen readers rely on `<article>`, `<header>`, `<time>` for context
- **Missing alt text on images:** If users add images to markdown, ensure accessibility guidelines in docs

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown typography | Custom CSS for every element | Tailwind Typography plugin OR comprehensive prose CSS template | Typography has edge cases (nested lists, blockquote formatting, code blocks, tables) tested by thousands |
| Date formatting | Custom parsing logic | Native `Date.toLocaleDateString()` with options | Handles locales, timezones automatically; battle-tested browser API |
| Relative dates ("2 days ago") | Custom calculation logic | date-fns `formatDistance()` | Handles pluralization, locales, edge cases (leap years, DST) |
| Tag filtering/archive pages | Custom state management | Astro's `getStaticPaths()` for dynamic tag routes | Static generation at build time, no client-side JavaScript needed |
| RSS feed generation | Manual XML templating | @astrojs/rss package | Handles proper XML escaping, validates against RSS spec, includes iTunes podcast tags |
| Reading time estimation | Word counting logic | Simple formula (words / 200 WPM) OR remark-reading-time plugin | Formula sufficient; plugin handles markdown parsing edge cases |

**Key insight:** Astro's Content Layer API + `render()` function handles the complex parts (markdown parsing, content validation, static generation). The remaining work is presentation layer (CSS, HTML structure, metadata) where established patterns should be reused rather than rebuilt.

## Common Pitfalls

### Pitfall 1: Date Timezone Inconsistencies
**What goes wrong:** Posts appear/disappear based on server timezone. YAML date `2024-01-15` might parse as UTC midnight (previous day in US timezones).

**Why it happens:** YAML date parsing is timezone-sensitive. Jekyll may have handled this differently than JavaScript's `Date.parse()`.

**How to avoid:**
- Use ISO 8601 format with explicit time: `date: 2024-01-15T00:00:00-00:00`
- OR: Use `z.coerce.date()` in schema (already done) + accept that dates without time default to UTC
- For comparisons, use consistent timezone (UTC) or normalize to start-of-day local time

**Warning signs:** Posts appearing/disappearing between dev and production, inconsistent filtering of future posts, dates off by one day.

**Source:** [Scheduling Posts with AstroJS](https://jonathanyeong.com/writing/changelog-scheduling-posts-with-astrojs/), [Format Blog Post Dates in Astro](https://petermorgan.dev/blog/format-blog-post-dates-astro/)

### Pitfall 2: Broken Markdown Styling in Dark Mode
**What goes wrong:** Code blocks, blockquotes, or inline code become unreadable in dark mode due to hardcoded colors.

**Why it happens:** Markdown styling uses fixed colors instead of CSS custom properties that adapt to `prefers-color-scheme`.

**How to avoid:** Always use CSS custom properties (`var(--color-*)`) for markdown content styling. Test in both light and dark modes.

**Warning signs:** User complaints about readability, inspector shows fixed `#fff` or `#000` colors in styles, elements disappear in dark mode.

### Pitfall 3: Missing `permalink` Migration from Jekyll
**What goes wrong:** After migration, some blog posts 404 because Jekyll permalink field wasn't preserved in frontmatter.

**Why it happens:** Automated migration scripts sometimes drop or rename frontmatter fields.

**How to avoid:** Audit all migrated posts for `permalink` field. Current implementation has fallback, but explicit permalinks ensure exact URL match.

**Warning signs:** 404s on previously working URLs, Google Search Console errors, broken backlinks.

**Status:** ⚠️ Current project has 5 blog posts, 4 with explicit permalinks, 1 future-dated post with placeholder permalink. Fallback generation handles missing permalinks but won't match non-standard Jekyll formats.

### Pitfall 4: Neglecting Semantic HTML for SEO
**What goes wrong:** Search engines don't recognize blog post structure, rich snippets don't appear, accessibility suffers.

**Why it happens:** Using generic `<div>` tags instead of `<article>`, `<time>`, `<header>`.

**How to avoid:** Always wrap blog posts in `<article>`, use `<time datetime>` for dates, `<header>` for metadata section. Consider JSON-LD structured data for rich snippets.

**Warning signs:** Google doesn't show publish dates in search results, screen readers announce post incorrectly, "reader mode" doesn't work.

**Source:** [HTML: A good basis for accessibility - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML), [Mastering Semantic HTML to Elevate Web Accessibility](https://www.accessibilitychecker.org/blog/semantic-html/)

**Status:** ✅ Current implementation uses semantic HTML. Minor enhancement: add JSON-LD structured data (BlogPosting schema.org).

### Pitfall 5: Incomplete Prose Typography
**What goes wrong:** Some markdown elements (blockquotes, code blocks, tables, images) render with poor spacing or readability.

**Why it happens:** Only styling headings and paragraphs, forgetting markdown generates diverse HTML.

**How to avoid:** Use comprehensive prose CSS (see Pattern 6) or battle-tested solution like Tailwind Typography. Test with actual blog content containing all markdown features.

**Warning signs:** Inconsistent spacing, inline code blends into text, blockquotes look like paragraphs, code blocks overflow on mobile.

**Status:** ⚠️ Current implementation has basic heading styles. Needs expansion for blockquotes, lists, code blocks, images.

### Pitfall 6: Not Handling Empty Tag Arrays
**What goes wrong:** Template error when `tags` is `undefined` or empty array but code assumes it exists.

**Why it happens:** Zod schema makes tags optional (`.optional()`), but template doesn't guard against missing data.

**How to avoid:** Always check `tags && tags.length > 0` or use nullish coalescing: `const tags = post.data.tags || []`.

**Warning signs:** Build errors on posts without tags, TypeScript errors about undefined array.

**Status:** ✅ Current implementation handles this correctly: `const tags = post.data.tags || []` and conditional rendering `{tags.length > 0 && ...}`.

### Pitfall 7: Content Layer API Glob Pattern Mistakes
**What goes wrong:** Posts don't load, build fails, or only some posts appear in collection.

**Why it happens:** Incorrect glob pattern (e.g., `*.md` instead of `**/*.md`), wrong base path, or pattern doesn't match file locations.

**How to avoid:** Use `**/*.md` to match all markdown files recursively, verify base path is correct relative to project root, test with `npm run build` and check output.

**Warning signs:** Missing posts in archive, `getCollection('posts')` returns empty array, build doesn't show expected pages.

**Source:** [Content Layer API - Astro Docs](https://docs.astro.build/en/reference/content-loader-reference/), [Astro Content Collections Guide](https://inhaq.com/blog/getting-started-with-astro-content-collections/)

**Status:** ✅ Current implementation uses correct pattern: `glob({ pattern: "**/*.md", base: "./src/content/posts" })`.

## Code Examples

### Enhanced Prose Typography (Comprehensive CSS)

```astro
---
// src/pages/posts/[...slug].astro
const { post } = Astro.props;
const { Content } = await render(post);
---

<BaseLayout title={post.data.title}>
  <article class="post">
    <header>
      <h1>{post.data.title}</h1>
      <time datetime={post.data.date.toISOString()}>
        {post.data.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </time>
    </header>

    <div class="prose">
      <Content />
    </div>
  </article>
</BaseLayout>

<style>
  .prose {
    line-height: 1.7;
    color: var(--color-text);
  }

  /* Headings */
  .prose :global(h1),
  .prose :global(h2),
  .prose :global(h3),
  .prose :global(h4) {
    margin-top: var(--space-md);
    margin-bottom: var(--space-sm);
    line-height: 1.3;
    font-weight: 600;
  }

  .prose :global(h2) { font-size: 1.5rem; }
  .prose :global(h3) { font-size: 1.25rem; }
  .prose :global(h4) { font-size: 1.125rem; }

  /* Paragraphs and text */
  .prose :global(p) {
    margin-bottom: var(--space-sm);
  }

  .prose :global(strong) {
    font-weight: 600;
  }

  .prose :global(em) {
    font-style: italic;
  }

  /* Lists */
  .prose :global(ul),
  .prose :global(ol) {
    margin-bottom: var(--space-sm);
    padding-left: 1.5rem;
  }

  .prose :global(li) {
    margin-bottom: 0.25rem;
  }

  .prose :global(li > p) {
    margin-bottom: 0.5rem;
  }

  /* Blockquotes */
  .prose :global(blockquote) {
    border-left: 4px solid var(--color-link);
    padding-left: var(--space-sm);
    margin: var(--space-md) 0;
    color: var(--color-text-muted);
    font-style: italic;
  }

  .prose :global(blockquote p) {
    margin-bottom: 0.5rem;
  }

  /* Code */
  .prose :global(code) {
    font-family: var(--font-mono);
    background: var(--color-header-bg);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-size: 0.875em;
  }

  .prose :global(pre) {
    background: var(--color-header-bg);
    padding: var(--space-sm);
    border-radius: 4px;
    overflow-x: auto;
    margin: var(--space-md) 0;
    border: 1px solid var(--color-border);
  }

  .prose :global(pre code) {
    background: none;
    padding: 0;
    border-radius: 0;
  }

  /* Links */
  .prose :global(a) {
    color: var(--color-link);
    text-decoration: underline;
  }

  .prose :global(a:hover) {
    color: var(--color-link-hover);
  }

  /* Images */
  .prose :global(img) {
    max-width: 100%;
    height: auto;
    margin: var(--space-md) 0;
    border-radius: 4px;
  }

  /* Horizontal rules */
  .prose :global(hr) {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--space-lg) 0;
  }

  /* Tables */
  .prose :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: var(--space-md) 0;
  }

  .prose :global(th),
  .prose :global(td) {
    border: 1px solid var(--color-border);
    padding: 0.5rem;
    text-align: left;
  }

  .prose :global(th) {
    background: var(--color-header-bg);
    font-weight: 600;
  }
</style>
```

### JSON-LD Structured Data for Blog Posts

```astro
---
// Add to blog post page head
import BaseLayout from '../../layouts/BaseLayout.astro';

const { post } = Astro.props;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.data.title,
  "datePublished": post.data.date.toISOString(),
  "dateModified": post.data.date.toISOString(), // Add modifiedDate field to schema if tracking edits
  "author": {
    "@type": "Person",
    "name": "Pedro Figueira",
    "url": "https://pedropaf.com"
  },
  "publisher": {
    "@type": "Person",
    "name": "Pedro Figueira"
  },
  "description": post.data.excerpt || "Blog post by Pedro Figueira",
  "keywords": post.data.tags?.join(", ") || "",
  "url": `https://pedropaf.com/posts/${/* permalink */}/`
};
---

<BaseLayout title={post.data.title}>
  <Fragment slot="head">
    <script type="application/ld+json" set:html={JSON.stringify(structuredData)} />
  </Fragment>

  <article>
    <!-- content -->
  </article>
</BaseLayout>
```

**Source:** [Adding structured data to blog posts using Astro](https://frodeflaten.com/posts/adding-structured-data-to-blog-posts-using-astro/), [Add JSON-LD Structured Data in Astro](https://johndalesandro.com/blog/astro-add-json-ld-structured-data-to-your-website-for-rich-search-results/)

### Archive Page with Reading Time Estimate

```astro
---
// src/pages/posts/index.astro (optional enhancement)
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
const now = new Date();
const publishedPosts = posts
  .filter(post => post.data.date <= now)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

// Simple reading time calculation (approx 200 words/min)
function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}
---

<BaseLayout title="Blog - Pedro Figueira">
  <h1>Blog</h1>

  <ul class="post-list">
    {publishedPosts.map(async (post) => {
      const { remarkPluginFrontmatter } = await render(post);
      const readingTime = estimateReadingTime(post.body);

      return (
        <li class="post-item">
          <a href={/* permalink */}>
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
            <span class="reading-time">{readingTime} min read</span>
          </p>
        </li>
      );
    })}
  </ul>
</BaseLayout>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `entry.render()` | `render(entry)` from `'astro:content'` | Astro 5.0 (2025) | Content Layer API pattern - import render separately, not as entry method |
| Legacy content collections (`type: 'content'`) | Content Layer API with loaders (`glob()`, `file()`) | Astro 5.0 (2025) | 5x faster markdown builds, 2x faster MDX, loader-based architecture |
| Manual frontmatter parsing | Zod schema validation with `z.coerce.date()` | Astro 2.0 (2023), improved in 5.0 | Type safety, automatic date coercion, development-time validation |
| Client-side tag filtering | Static generation with `getStaticPaths()` | Astro 1.0+ | Zero JavaScript, SEO-friendly, instant page loads |
| Custom markdown processors | Built-in markdown/MDX support with remark/rehype | Standard in Astro | No configuration needed for basic markdown, plugins available for extensions |
| Manual RSS feed XML | @astrojs/rss package | Astro 1.0+ | Proper XML escaping, RSS spec validation, podcast tags support |

**Deprecated/outdated:**
- **`entry.render()`**: Use `render(entry)` imported from `'astro:content'` (Astro 5.0+)
- **Legacy `type: 'content'` in collections**: Use Content Layer API loaders (Astro 5.0+)
- **`src/content/config.ts`**: Moved to `src/content.config.ts` (root of src/, not in content/) - Astro 5.0
- **`Astro.glob()`**: Removed in Astro 6 (beta) - use Content Layer API loaders instead

## Open Questions

1. **JSON-LD structured data priority**
   - What we know: Schema.org BlogPosting type improves SEO, enables rich snippets in search results
   - What's unclear: User priority for advanced SEO features vs. simple implementation
   - Recommendation: Implement basic semantic HTML first (already done), add JSON-LD as optional enhancement if SEO is priority

2. **Tag filtering/archive pages**
   - What we know: Tags exist in frontmatter and display on posts, no tag filtering currently implemented
   - What's unclear: User need for tag-based navigation vs. simple chronological archive
   - Recommendation: Defer tag archive pages unless explicitly requested - chronological archive sufficient for 5 posts

3. **Reading time estimation**
   - What we know: Simple word count formula (words / 200 WPM) sufficient for basic estimation
   - What's unclear: User interest in displaying reading time on posts/archive
   - Recommendation: Optional enhancement - easy to implement but not critical for MVP blog functionality

4. **RSS feed**
   - What we know: @astrojs/rss package exists for feed generation, common blog feature
   - What's unclear: Whether RSS feed is in scope for Phase 7 or future phase
   - Recommendation: Check requirements - if BLOG-04 or similar exists, include RSS; otherwise defer

## Sources

### Primary (HIGH confidence)
- [Content Collections - Astro Docs](https://docs.astro.build/en/guides/content-collections/) - Official Content Layer API documentation
- [Content Collections API Reference - Astro Docs](https://docs.astro.build/en/reference/modules/astro-content/) - render() function, getCollection() usage
- [Content Loader API Reference - Astro Docs](https://docs.astro.build/en/reference/content-loader-reference/) - glob() loader specification
- [Markdown in Astro - Astro Docs](https://docs.astro.build/en/guides/markdown-content/) - Markdown/MDX rendering
- [Build a blog tutorial - Astro Docs](https://docs.astro.build/en/tutorial/5-astro-api/2/) - Generate tag pages pattern
- [HTML: A good basis for accessibility - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML) - Semantic HTML best practices
- [Astro Content Collections: Complete 2026 Guide](https://inhaq.com/blog/getting-started-with-astro-content-collections.html) - Content Layer API patterns

### Secondary (MEDIUM confidence)
- [Astro 5: The Content Layer Upgrade - Oscar Gallego Ruiz](https://www.oscargallegoruiz.com/en/blog/astro-5-migration-guide) - Migration guide, render() vs entry.render()
- [Adding structured data to blog posts using Astro - Frode Flaten](https://frodeflaten.com/posts/adding-structured-data-to-blog-posts-using-astro/) - JSON-LD BlogPosting implementation
- [Add JSON-LD Structured Data in Astro - John DaleSandro](https://johndalesandro.com/blog/astro-add-json-ld-structured-data-to-your-website-for-rich-search-results/) - Schema.org structured data patterns
- [Format Blog Post Dates in Astro - Peter Morgan](https://petermorgan.dev/blog/format-blog-post-dates-astro/) - Date formatting best practices
- [Scheduling Posts with AstroJS - Jonathan Yeong](https://jonathanyeong.com/writing/changelog-scheduling-posts-with-astrojs/) - Future post filtering, timezone handling
- [Style rendered Markdown with Tailwind Typography - Astro Docs](https://docs.astro.build/en/recipes/tailwind-rendered-markdown/) - Typography plugin usage
- [Mastering Semantic HTML to Elevate Web Accessibility](https://www.accessibilitychecker.org/blog/semantic-html/) - Semantic HTML benefits
- [Semantic HTML: Boost Accessibility & SEO](https://www.saffronedge.com/blog/semantic-html/) - SEO and accessibility impact

### Tertiary (LOW confidence - project-specific)
- Tag archive page patterns vary by user preference - some prefer filtering, others prefer simple chronological view
- RSS feed implementation priority unclear without explicit requirement
- Reading time estimation value depends on content length and user expectations

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified through project inspection, official Astro 5 docs, multiple authoritative sources
- Architecture: HIGH - Patterns confirmed as implemented, verified through code inspection and official documentation
- Pitfalls: MEDIUM-HIGH - Common issues documented across multiple sources, some derived from community experiences

**Research date:** 2026-02-12
**Valid until:** ~2026-03-14 (30 days - Astro 5 stable, blog patterns mature)

**Notes:**
- Most blog infrastructure already implemented in Phases 1-2
- Current implementation follows Astro 5 best practices (render(), glob loader, semantic HTML)
- Phase 7 work is enhancement-focused: prose typography, structured data, polish
- No breaking changes needed - current code is production-ready for basic blog functionality
- Future enhancements (tag archives, RSS, reading time) are optional based on user requirements
