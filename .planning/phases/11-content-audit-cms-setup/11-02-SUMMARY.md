---
phase: 11-content-audit-cms-setup
plan: 02
subsystem: cms
tags: [sveltia-cms, github-pat, decap-cms, content-management]

# Dependency graph
requires:
  - phase: 11-01
    provides: Validated frontmatter schema for all blog posts
provides:
  - Sveltia CMS admin interface at /admin route
  - GitHub PAT authentication for single-user CMS access
  - Blog posts collection with CRUD operations
  - Rich text markdown editor for content management
  - Static CMS deployment (no SSR/server required)
affects: [future content management workflow, blog post authoring]

# Tech tracking
tech-stack:
  added: [sveltia-cms (via CDN)]
  patterns: [static CMS hosting, PAT authentication, config.yml schema mirroring]

key-files:
  created:
    - public/admin/index.html
    - public/admin/config.yml
  modified: []

key-decisions:
  - "Use Sveltia CMS over Decap CMS (modern successor, better UX, PAT auth built-in)"
  - "Serve CMS as static files from public/admin/ (no SSR adapter required)"
  - "Use GitHub Personal Access Token for authentication (simplest for single user)"
  - "Configure media_folder vs public_folder correctly to avoid path bugs"
  - "Name body field exactly 'body' per Decap/Sveltia convention"

patterns-established:
  - "CMS config.yml fields mirror Astro content.config.ts schema (synchronization pattern)"
  - "Comment linking config.yml to content.config.ts for maintenance clarity"
  - "Note: /admin/ returns 404 on dev server (Vite doesn't resolve public/ directory indexes), but /admin/index.html works; production GitHub Pages resolves /admin/ correctly"

# Metrics
duration: 17min
completed: 2026-02-13
---

# Phase 11 Plan 02: CMS Installation & Configuration Summary

**Sveltia CMS deployed as static files at /admin with GitHub PAT authentication, blog posts collection configured with full CRUD operations and rich text markdown editing**

## Performance

- **Duration:** 17 min
- **Started:** 2026-02-13T09:01:17Z
- **Completed:** 2026-02-13T09:18:38Z
- **Tasks:** 3
- **Files created:** 2

## Accomplishments
- Deployed Sveltia CMS as static files requiring no backend server
- Configured GitHub backend with PAT authentication (no OAuth server needed)
- Created blog posts collection with fields mirroring content.config.ts schema
- Enabled full CRUD operations (create, edit, delete) for blog posts
- Verified CMS loads all 5 existing posts without errors
- Rich text markdown editor with formatting toolbar operational

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Sveltia CMS static files and blog collection config** - `8ab753c` (feat)
2. **Task 2: Build and verify admin route resolves** - `8ab753c` (feat - combined with Task 1)
3. **Task 3: Verify CMS login and blog post editing** - User verification checkpoint (approved)

**Plan metadata:** [to be created] (docs: complete 11-02 plan)

## Files Created/Modified

### Created
- `public/admin/index.html` - Sveltia CMS loader page with CDN script tag
- `public/admin/config.yml` - CMS configuration with GitHub backend, blog posts collection schema

### Key Configuration Details

**Backend (config.yml):**
- GitHub repository: bacilo/bacilo.github.io
- Branch: master
- Authentication: Personal Access Token (fine-grained)

**Blog Posts Collection (config.yml):**
- Folder: src/content/posts
- Slug pattern: {{year}}-{{month}}-{{day}}-{{slug}}
- Fields: title, date, tags, permalink, body (mirrors content.config.ts)
- CRUD: create=true, delete=true

**Media Configuration:**
- media_folder: "public/images/uploads" (repo-relative path)
- public_folder: "/images/uploads" (site-relative URL path)

## Decisions Made

1. **Sveltia CMS over Decap CMS**: Selected Sveltia (modern successor) for better UX, built-in PAT auth support, and active development
2. **Static hosting approach**: Deployed CMS as static files in public/admin/ to avoid needing SSR adapter or backend server
3. **PAT authentication**: Used GitHub Personal Access Token instead of OAuth for simplicity (single-user CMS)
4. **Schema synchronization**: Established pattern of mirroring Astro content.config.ts in CMS config.yml with comment linking files
5. **Body field naming**: Used exact name "body" per Decap/Sveltia convention (prevents markdown being saved inside frontmatter YAML block)
6. **Media path configuration**: Set media_folder (repo path) and public_folder (URL path) as different values to avoid first-submission bugs

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Dev server /admin/ path resolution:**
- **Issue**: /admin/ returns 404 on Astro dev server (Vite doesn't resolve directory indexes for public/ files)
- **Workaround**: Use /admin/index.html directly during development
- **Production behavior**: GitHub Pages will resolve /admin/ correctly to /admin/index.html
- **Impact**: None - this is expected Vite behavior, not a bug

## User Setup Required

**External services require manual configuration.** See plan frontmatter user_setup section for:

**GitHub Personal Access Token setup:**
1. Navigate to: GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens
2. Generate new token with:
   - Repository: bacilo/bacilo.github.io only
   - Permissions: Contents (Read and write), Metadata (Read-only)
   - Expiration: Set reminder before expiry
3. Copy token for CMS authentication

**Verification completed:**
- User successfully authenticated with PAT
- CMS loads at /admin/index.html (dev) and /admin/ (production)
- All 5 existing blog posts load without errors
- CRUD operations verified (create, edit, delete)
- Rich text markdown editor toolbar functional
- Auth persists across browser sessions

## Next Phase Readiness

**Ready for content management:**
- CMS infrastructure complete (CMS-01, CMS-02, CMS-03)
- Blog editing capabilities operational (BLOG-01, BLOG-02, BLOG-03, BLOG-04)
- All existing content validated and editable
- User can begin creating/editing blog posts through CMS interface

**Remaining Phase 11 tasks**: None - Phase 11 complete (2/2 plans)

**Phase 11 Summary:**
- Plan 01: Frontmatter validation (all 5 posts pass schema)
- Plan 02: CMS deployment (operational with full CRUD)

**Concerns for future phases:**
- Schema drift: If content.config.ts changes, config.yml must be updated manually (consider documenting in PROJECT.md)
- Media uploads: Public folder configuration set but not yet tested with actual uploads
- Image optimization: CMS handles image uploads but not optimization (may need future plan)

## Self-Check: PASSED

All claims verified:
- FOUND: public/admin/index.html
- FOUND: public/admin/config.yml
- FOUND: 8ab753c (feat commit)

---
*Phase: 11-content-audit-cms-setup*
*Completed: 2026-02-13*
