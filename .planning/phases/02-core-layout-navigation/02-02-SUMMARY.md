---
phase: 02-core-layout-navigation
plan: 02
subsystem: content-rendering
tags: [routing, permalinks, seo, content-collections]
dependencies:
  requires:
    - "01-02: Content collections and frontmatter schemas"
  provides:
    - "Dynamic routes for publications at Jekyll-compatible URLs"
    - "Dynamic routes for talks at Jekyll-compatible URLs"
    - "Dynamic routes for posts at Jekyll-compatible URLs"
  affects:
    - "SEO and academic citations (preserves existing URLs)"
tech_stack:
  added:
    - "Astro Content Layer API render() method"
    - "[...slug] rest parameter routing"
  patterns:
    - "URL slug extraction from frontmatter permalinks"
    - "Year/month directory structure for posts"
key_files:
  created:
    - src/pages/publication/[...slug].astro
    - src/pages/talks/[...slug].astro
    - src/pages/posts/[...slug].astro
  modified: []
decisions:
  - summary: "Use Content Layer API render() instead of entry.render()"
    rationale: "Astro 5.x requires importing render from astro:content module"
    alternatives: "None - breaking change in Astro 5.x"
    impact: "Required for markdown rendering in dynamic routes"
metrics:
  duration_minutes: 2.65
  tasks_completed: 3
  files_created: 3
  commits: 3
  completed_at: "2026-02-12T09:05:44Z"
---

# Phase 02 Plan 02: Dynamic Content Routes Summary

Dynamic routes preserve Jekyll URL structure for all content types, ensuring no broken links from the old site.

## Overview

Implemented dynamic routing for three content types (publications, talks, posts) using Astro's `[...slug]` rest parameter syntax. Each route extracts the URL slug from frontmatter permalinks and generates static pages at Jekyll-compatible URLs. Critical for SEO and academic citations where publications have been cited with their URLs.

## Tasks Completed

### Task 1: Create dynamic route for publications
**Commit:** ea83f46
**Files:** src/pages/publication/[...slug].astro

Implemented dynamic route that:
- Reads permalink from frontmatter (e.g., "/publication/2008-01-01-License-to-chill...")
- Extracts slug by removing "/publication/" prefix
- Renders publication with title, venue, date, paper link, content, and citation
- Generates 15 publication pages at Jekyll-compatible URLs

**Key implementation detail:** Used Astro 5.x Content Layer API `render()` method instead of calling `.render()` on the entry object (breaking change from Astro 4.x).

### Task 2: Create dynamic route for talks
**Commit:** c46aac9
**Files:** src/pages/talks/[...slug].astro

Implemented dynamic route that:
- Reads permalink from frontmatter (e.g., "/talks/2012-03-01-talk-1")
- Extracts slug by removing "/talks/" prefix
- Renders talk with title, type, venue, location, date, and content
- Generates 4 talk pages at Jekyll-compatible URLs

### Task 3: Create dynamic route for posts
**Commit:** e418a5f
**Files:** src/pages/posts/[...slug].astro

Implemented dynamic route that:
- Reads permalink from frontmatter (e.g., "/posts/2012/08/blog-post-1/")
- Extracts slug preserving year/month directory structure
- Fallback generates slug from date + filename if permalink missing
- Renders post with title, date, tags, and content
- Generates 5 post pages at Jekyll-compatible URLs with year/month structure

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Astro 5.x Content Layer API usage**
- **Found during:** Task 1 build
- **Issue:** `publication.render is not a function` error - plan used Astro 4.x syntax
- **Fix:** Changed from `await publication.render()` to `import { render } from 'astro:content'; await render(publication)`
- **Files modified:** All three dynamic route files
- **Commit:** ea83f46 (included in Task 1 commit)
- **Rationale:** Astro 5.x with Content Layer API has different render method signature than Astro 4.x Collections API

## Verification Results

Build successful with correct URL structure:
- 15 publication URLs generated (e.g., `/publication/2008-01-01-License-to-chill.../index.html`)
- 4 talk URLs generated (e.g., `/talks/2012-03-01-talk-1/index.html`)
- 5 post URLs generated (e.g., `/posts/2012/08/blog-post-1/index.html`)
- Year/month directory structure preserved for posts
- All URLs match Jekyll permalink format exactly

Sample verified URLs:
- `/publication/2008-01-01-License-to-chill-how-to-empower-users-to-cope-with-stress/index.html` ✓
- `/talks/2012-03-01-talk-1/index.html` ✓
- `/posts/2012/08/blog-post-1/index.html` ✓

## Success Criteria Met

- ✓ All 15 publication URLs work (matching Jekyll permalinks)
- ✓ All 4 talk URLs work (matching Jekyll permalinks)
- ✓ All 5 post URLs work (matching Jekyll permalinks including year/month structure)
- ✓ Content renders correctly with title, metadata, and body
- ✓ BaseLayout wraps all pages consistently
- ✓ `npm run build` generates correct directory structure (25 pages total)

## Key Decisions

1. **Use Content Layer API render() method**
   - Required for Astro 5.x compatibility
   - Different import pattern than Astro 4.x
   - Applied consistently across all three content types

2. **Preserve exact Jekyll URL structure**
   - Publications: `/publication/{slug}/`
   - Talks: `/talks/{slug}/`
   - Posts: `/posts/{year}/{month}/{slug}/`
   - Critical for maintaining SEO and academic citation integrity

3. **Fallback slug generation for posts**
   - If permalink missing, generate from date + filename
   - Provides resilience for content migration edge cases
   - Maintains year/month structure regardless of permalink presence

## Impact

Successfully implemented URL preservation layer that:
- Maintains all existing academic citations (critical for publications)
- Preserves search engine rankings (all URLs unchanged)
- Enables seamless migration from Jekyll (no redirects needed)
- Provides foundation for content listing pages (next plan)

## Next Steps

Phase 02 Plan 03 will build:
- Content listing pages (/publications, /talks, /posts)
- Chronological sorting and display
- Integration with navigation menu

## Self-Check: PASSED

Verified all created files exist:
```
FOUND: src/pages/publication/[...slug].astro
FOUND: src/pages/talks/[...slug].astro
FOUND: src/pages/posts/[...slug].astro
```

Verified all commits exist:
```
FOUND: ea83f46 (Task 1: publications)
FOUND: c46aac9 (Task 2: talks)
FOUND: e418a5f (Task 3: posts)
```

Verified generated URLs exist:
```
FOUND: dist/publication/2008-01-01-License-to-chill-how-to-empower-users-to-cope-with-stress/index.html
FOUND: dist/talks/2012-03-01-talk-1/index.html
FOUND: dist/posts/2012/08/blog-post-1/index.html
```
