# CMS Production Readiness Test Checklist

**Purpose:** Validate CMS functionality across browsers before production deployment. This checklist covers all 5 Phase 13 success criteria.

**Test Date:** _______________
**Tester:** _______________
**Environment:** Production (https://bacilo.github.io/admin/) OR Local (http://localhost:4321/admin/index.html)

**Note:** Local dev server requires `/admin/index.html` (not `/admin/`) to avoid 404. Production resolves `/admin/` correctly.

---

## Browser: Chrome [Version: _____]

### Authentication (SC #2, #5)

- [ ] Navigate to CMS URL (production: https://bacilo.github.io/admin/ | local: http://localhost:4321/admin/index.html)
- [ ] CMS loads without console errors (check DevTools Console)
- [ ] GitHub PAT authentication prompt appears
- [ ] Enter Personal Access Token, click Login
- [ ] Authentication succeeds, collections visible in sidebar (Blog Posts, Publications, Talks, Portfolio)
- [ ] Close browser completely (not just tab)
- [ ] Reopen CMS URL
- [ ] Verify session persists (still logged in, no re-authentication required)

### Content Creation - Blog Posts (SC #1, #3)

- [ ] Click "Blog Posts" in sidebar
- [ ] Click "New Blog Posts" button
- [ ] Fill required fields: Title, Date (YYYY-MM-DD format)
- [ ] Optional: Add tags (comma-separated)
- [ ] Write markdown content in Body field
- [ ] Click "Save"
- [ ] Verify file created in `src/content/posts/` directory (format: YYYY-MM-DD-slug.md)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Content Creation - Publications (SC #1, #3)

- [ ] Click "Publications" in sidebar
- [ ] Click "New Publications" button
- [ ] Fill required fields: Title, Permalink, Date, Venue, Citation
- [ ] Optional: Add Paper URL, Excerpt
- [ ] Write markdown content in Body field
- [ ] Verify Collection field auto-set to "publications"
- [ ] Click "Save"
- [ ] Verify file created in `src/content/publications/` directory (format: YYYY-MM-DD-slug.md)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Content Creation - Talks (SC #1, #3)

- [ ] Click "Talks" in sidebar
- [ ] Click "New Talks" button
- [ ] Fill required fields: Title, Type, Permalink, Venue, Date, Location
- [ ] Write markdown content in Body field
- [ ] Verify Collection field auto-set to "talks"
- [ ] Click "Save"
- [ ] Verify file created in `src/content/talks/` directory (format: YYYY-MM-DD-slug.md)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Content Creation - Portfolio (SC #1, #3)

- [ ] Click "Portfolio" in sidebar
- [ ] Click "New Portfolio" button
- [ ] Fill required field: Title
- [ ] Optional: Add Excerpt, Repository URL, Demo URL, Description, Playground URL
- [ ] Write markdown content in Body field
- [ ] Click "Save"
- [ ] Verify file created in `src/content/portfolio/` directory (format: slug.md, no date prefix)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Media Library (SC #1)

- [ ] Click "Media" in sidebar
- [ ] Click "Upload" button
- [ ] Select test image file (e.g., test-image.jpg)
- [ ] Verify upload succeeds
- [ ] Verify image appears in media library grid
- [ ] Verify image file exists in `public/images/uploads/` directory
- [ ] Open any blog post for editing
- [ ] Insert image into Body field using markdown: `![Alt text](/images/uploads/test-image.jpg)`
- [ ] Save post
- [ ] Run: `npm run build`
- [ ] Check dist/ output - verify image renders on page

### Git Attribution (SC #5)

- [ ] After CMS creates/edits content (triggers Git commit), run: `git log --format=fuller --max-count=3`
- [ ] Verify commit author matches expected GitHub identity
- [ ] Verify commit message describes the content change (e.g., "Create posts/2026-02-13-test-post.md")

### Edit/Delete Workflow (SC #1)

- [ ] Click "Blog Posts" in sidebar
- [ ] Select existing post created during testing
- [ ] Modify title field
- [ ] Click "Save"
- [ ] Verify file updated in `src/content/posts/` directory (check timestamp or git diff)
- [ ] Delete test post via CMS (click delete button)
- [ ] Verify file removed from `src/content/posts/` directory

---

## Browser: Firefox [Version: _____]

### Authentication (SC #2, #5)

- [ ] Navigate to CMS URL (production: https://bacilo.github.io/admin/ | local: http://localhost:4321/admin/index.html)
- [ ] CMS loads without console errors (check DevTools Console)
- [ ] GitHub PAT authentication prompt appears
- [ ] Enter Personal Access Token, click Login
- [ ] Authentication succeeds, collections visible in sidebar (Blog Posts, Publications, Talks, Portfolio)
- [ ] Close browser completely (not just tab)
- [ ] Reopen CMS URL
- [ ] Verify session persists (still logged in, no re-authentication required)

### Content Creation - Blog Posts (SC #1, #3)

- [ ] Click "Blog Posts" in sidebar
- [ ] Click "New Blog Posts" button
- [ ] Fill required fields: Title, Date (YYYY-MM-DD format)
- [ ] Optional: Add tags (comma-separated)
- [ ] Write markdown content in Body field
- [ ] Click "Save"
- [ ] Verify file created in `src/content/posts/` directory (format: YYYY-MM-DD-slug.md)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Content Creation - Publications (SC #1, #3)

- [ ] Click "Publications" in sidebar
- [ ] Click "New Publications" button
- [ ] Fill required fields: Title, Permalink, Date, Venue, Citation
- [ ] Optional: Add Paper URL, Excerpt
- [ ] Write markdown content in Body field
- [ ] Verify Collection field auto-set to "publications"
- [ ] Click "Save"
- [ ] Verify file created in `src/content/publications/` directory (format: YYYY-MM-DD-slug.md)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Content Creation - Talks (SC #1, #3)

- [ ] Click "Talks" in sidebar
- [ ] Click "New Talks" button
- [ ] Fill required fields: Title, Type, Permalink, Venue, Date, Location
- [ ] Write markdown content in Body field
- [ ] Verify Collection field auto-set to "talks"
- [ ] Click "Save"
- [ ] Verify file created in `src/content/talks/` directory (format: YYYY-MM-DD-slug.md)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Content Creation - Portfolio (SC #1, #3)

- [ ] Click "Portfolio" in sidebar
- [ ] Click "New Portfolio" button
- [ ] Fill required field: Title
- [ ] Optional: Add Excerpt, Repository URL, Demo URL, Description, Playground URL
- [ ] Write markdown content in Body field
- [ ] Click "Save"
- [ ] Verify file created in `src/content/portfolio/` directory (format: slug.md, no date prefix)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Media Library (SC #1)

- [ ] Click "Media" in sidebar
- [ ] Click "Upload" button
- [ ] Select test image file (e.g., test-image.jpg)
- [ ] Verify upload succeeds
- [ ] Verify image appears in media library grid
- [ ] Verify image file exists in `public/images/uploads/` directory
- [ ] Open any blog post for editing
- [ ] Insert image into Body field using markdown: `![Alt text](/images/uploads/test-image.jpg)`
- [ ] Save post
- [ ] Run: `npm run build`
- [ ] Check dist/ output - verify image renders on page

### Git Attribution (SC #5)

- [ ] After CMS creates/edits content (triggers Git commit), run: `git log --format=fuller --max-count=3`
- [ ] Verify commit author matches expected GitHub identity
- [ ] Verify commit message describes the content change (e.g., "Create posts/2026-02-13-test-post.md")

### Edit/Delete Workflow (SC #1)

- [ ] Click "Blog Posts" in sidebar
- [ ] Select existing post created during testing
- [ ] Modify title field
- [ ] Click "Save"
- [ ] Verify file updated in `src/content/posts/` directory (check timestamp or git diff)
- [ ] Delete test post via CMS (click delete button)
- [ ] Verify file removed from `src/content/posts/` directory

---

## Browser: Safari [Version: _____]

### Authentication (SC #2, #5)

- [ ] Navigate to CMS URL (production: https://bacilo.github.io/admin/ | local: http://localhost:4321/admin/index.html)
- [ ] CMS loads without console errors (check Web Inspector Console)
- [ ] GitHub PAT authentication prompt appears
- [ ] Enter Personal Access Token, click Login
- [ ] Authentication succeeds, collections visible in sidebar (Blog Posts, Publications, Talks, Portfolio)
- [ ] Close browser completely (not just tab)
- [ ] Reopen CMS URL
- [ ] Verify session persists (still logged in, no re-authentication required)

### Content Creation - Blog Posts (SC #1, #3)

- [ ] Click "Blog Posts" in sidebar
- [ ] Click "New Blog Posts" button
- [ ] Fill required fields: Title, Date (YYYY-MM-DD format)
- [ ] Optional: Add tags (comma-separated)
- [ ] Write markdown content in Body field
- [ ] Click "Save"
- [ ] Verify file created in `src/content/posts/` directory (format: YYYY-MM-DD-slug.md)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Content Creation - Publications (SC #1, #3)

- [ ] Click "Publications" in sidebar
- [ ] Click "New Publications" button
- [ ] Fill required fields: Title, Permalink, Date, Venue, Citation
- [ ] Optional: Add Paper URL, Excerpt
- [ ] Write markdown content in Body field
- [ ] Verify Collection field auto-set to "publications"
- [ ] Click "Save"
- [ ] Verify file created in `src/content/publications/` directory (format: YYYY-MM-DD-slug.md)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Content Creation - Talks (SC #1, #3)

- [ ] Click "Talks" in sidebar
- [ ] Click "New Talks" button
- [ ] Fill required fields: Title, Type, Permalink, Venue, Date, Location
- [ ] Write markdown content in Body field
- [ ] Verify Collection field auto-set to "talks"
- [ ] Click "Save"
- [ ] Verify file created in `src/content/talks/` directory (format: YYYY-MM-DD-slug.md)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Content Creation - Portfolio (SC #1, #3)

- [ ] Click "Portfolio" in sidebar
- [ ] Click "New Portfolio" button
- [ ] Fill required field: Title
- [ ] Optional: Add Excerpt, Repository URL, Demo URL, Description, Playground URL
- [ ] Write markdown content in Body field
- [ ] Click "Save"
- [ ] Verify file created in `src/content/portfolio/` directory (format: slug.md, no date prefix)
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify build passes (no Zod schema errors)

### Media Library (SC #1)

- [ ] Click "Media" in sidebar
- [ ] Click "Upload" button
- [ ] Select test image file (e.g., test-image.jpg)
- [ ] Verify upload succeeds
- [ ] Verify image appears in media library grid
- [ ] Verify image file exists in `public/images/uploads/` directory
- [ ] Open any blog post for editing
- [ ] Insert image into Body field using markdown: `![Alt text](/images/uploads/test-image.jpg)`
- [ ] Save post
- [ ] Run: `npm run build`
- [ ] Check dist/ output - verify image renders on page

### Git Attribution (SC #5)

- [ ] After CMS creates/edits content (triggers Git commit), run: `git log --format=fuller --max-count=3`
- [ ] Verify commit author matches expected GitHub identity
- [ ] Verify commit message describes the content change (e.g., "Create posts/2026-02-13-test-post.md")

### Edit/Delete Workflow (SC #1)

- [ ] Click "Blog Posts" in sidebar
- [ ] Select existing post created during testing
- [ ] Modify title field
- [ ] Click "Save"
- [ ] Verify file updated in `src/content/posts/` directory (check timestamp or git diff)
- [ ] Delete test post via CMS (click delete button)
- [ ] Verify file removed from `src/content/posts/` directory

---

## Overall Build Validation (SC #3)

- [ ] Ensure all test content from all collections is present
- [ ] Run: `bash scripts/validate-cms-content.sh`
- [ ] Verify both frontmatter audit and Astro build pass
- [ ] Inspect `dist/` output directory
- [ ] Verify all collections render correctly in built site

---

## Success Criteria Mapping

| SC # | Success Criteria | Validated By |
|------|-----------------|--------------|
| #1 | CMS allows creating, editing, and deleting content in all 4 collections (posts, publications, talks, portfolio) | Content Creation, Edit/Delete, Media Library sections |
| #2 | CMS loads in Chrome, Firefox, and Safari without console errors | Authentication sections (all browsers) |
| #3 | All CMS-created content validates against Zod schemas and builds successfully with `npm run build` | Content Creation sections + Overall Build Validation |
| #4 | *[Not included in test checklist - deployment/hosting validation]* | *N/A* |
| #5 | Git commits from CMS have proper author attribution matching GitHub identity | Git Attribution sections (all browsers) |

---

## Notes

**Document any issues, observations, or workarounds encountered during testing:**

-
-
-

**Browser-specific issues:**

- Chrome:
- Firefox:
- Safari:

**Build validation issues:**

-
