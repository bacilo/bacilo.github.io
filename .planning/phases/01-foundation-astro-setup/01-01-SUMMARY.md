---
phase: 01-foundation-astro-setup
plan: 01
subsystem: build-infrastructure
tags: [astro, github-pages, content-collections, deployment]
dependency_graph:
  requires: []
  provides:
    - astro-build-system
    - github-actions-deployment
    - content-collection-schemas
  affects:
    - all-future-phases
tech_stack:
  added:
    - astro: "^5.0.0"
    - "@astrojs/mdx": "^4.0.0"
    - "@astrojs/sitemap": "^3.7.0"
  patterns:
    - content-collections-with-zod
    - github-pages-deployment
    - static-site-generation
key_files:
  created:
    - package.json
    - astro.config.mjs
    - tsconfig.json
    - src/content.config.ts
    - src/layouts/BaseLayout.astro
    - src/pages/index.astro
    - .github/workflows/deploy.yml
    - public/.nojekyll
    - public/CNAME
  modified: []
decisions:
  - decision: "Use @astrojs/sitemap ^3.7.0 instead of ^4.0.0"
    rationale: "Version 4.0.0 doesn't exist yet; 3.7.0 is latest stable"
    alternatives: ["Wait for v4", "Use different sitemap solution"]
    impact: "No functional impact; will upgrade when v4 releases"
metrics:
  duration_minutes: 9
  tasks_completed: 3
  files_created: 13
  files_modified: 4
  commits: 3
  completed: 2026-02-12T07:53:09Z
---

# Phase 01 Plan 01: Initialize Astro Project Summary

**One-liner:** Astro 5.x project with GitHub Pages deployment, content collection schemas for publications/talks/posts/portfolio, and custom domain configuration.

## Objective Achievement

Successfully initialized Astro project foundation, replacing Jekyll setup while preserving custom domain and preparing for content migration.

**Result:** Working Astro project that builds locally and is configured for automatic GitHub Pages deployment on push to master branch.

## Tasks Completed

### Task 1: Initialize Astro project with configuration
**Status:** Complete
**Commit:** f71fa66

Updated existing Astro project files:
- Corrected package.json name to `bacilo-github-io`
- Fixed package versions (sitemap ^3.7.0 instead of non-existent ^4.0.0)
- Updated default title from "Pedro Paf" to "Pedro Figueira"
- Verified all core files present: astro.config.mjs, tsconfig.json, BaseLayout, index page
- Confirmed public/.nojekyll and public/CNAME exist with correct content

**Files:** package.json, package-lock.json, src/layouts/BaseLayout.astro, src/pages/index.astro

### Task 2: Create GitHub Actions deployment workflow
**Status:** Complete
**Commit:** d74c3df

Created deployment workflow following official Astro GitHub Pages pattern:
- Trigger on push to master branch (matches repo default branch)
- Use withastro/action@v5 for auto-detection and building
- Proper permissions for GitHub Pages deployment
- Deploy job with environment URL output
- Manual workflow_dispatch trigger for testing

**Files:** .github/workflows/deploy.yml

### Task 3: Create content collection schema foundations
**Status:** Complete
**Commit:** 21028e3

Defined content collection schemas matching Jekyll frontmatter:
- Publications: title, collection, permalink, date, venue, citation, paperurl (optional), excerpt (optional)
- Talks: title, collection, type, permalink, venue, date, location
- Posts: title, date, tags (optional), permalink (optional)
- Portfolio: title, excerpt (optional), collection (optional)
- Used glob() loaders (Astro 5.x pattern)
- Created empty collection directories with .gitkeep files

**Files:** src/content.config.ts, src/content/*/gitkeep (4 directories)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed non-existent package version**
- **Found during:** Task 1 verification
- **Issue:** Plan specified @astrojs/sitemap ^4.0.0, but version 4.0.0 doesn't exist (npm install failed)
- **Fix:** Used ^3.7.0 (latest stable version available)
- **Files modified:** package.json
- **Commit:** f71fa66
- **Impact:** No functional impact; sitemap integration works identically

**2. [Rule 1 - Bug] Updated inconsistent naming**
- **Found during:** Task 1 file review
- **Issue:** Default title used "Pedro Paf" instead of full name "Pedro Figueira"
- **Fix:** Updated BaseLayout.astro and index.astro to use correct name
- **Files modified:** src/layouts/BaseLayout.astro, src/pages/index.astro
- **Commit:** f71fa66
- **Impact:** Consistent branding across site

**3. [Pre-existing Setup] Most files already existed**
- **Found during:** Task 1 execution
- **Issue:** Package.json, astro.config.mjs, tsconfig.json, layouts, pages, and public files already created
- **Action:** Verified correctness and updated only what needed fixing
- **Impact:** Faster execution; most setup was already done

## Verification Results

All success criteria met:

1. **Build Success:** `npm run build` completes without errors
2. **Dist Output:** Contains index.html, .nojekyll, CNAME (pedropaf.com), sitemap-index.xml, sitemap-0.xml
3. **GitHub Actions:** Workflow file exists with correct master branch trigger
4. **Content Collections:** All four collections (publications, talks, posts, portfolio) defined with appropriate schemas
5. **Domain Configuration:** CNAME file correctly placed in public/ and copied to dist/

**Build Output:**
```
[build] 1 page(s) built in 722ms
[build] Complete!
```

**Expected warnings:** Empty collection warnings are normal and expected (content migration happens in Plan 02).

## Next Steps

This plan provides the foundation for:
- **Plan 02:** Migrate Jekyll content to Astro content collections
- **Plan 03:** Implement dynamic routes for URL preservation
- **Plan 04:** Deploy to GitHub Pages and verify custom domain

**Blockers Removed:**
- Build system functional ✓
- Deployment pipeline configured ✓
- Content schemas ready for migration ✓

## Self-Check: PASSED

**Created files verified:**
```bash
FOUND: /Users/pedf/workspace/bacilo.github.io/package.json
FOUND: /Users/pedf/workspace/bacilo.github.io/astro.config.mjs
FOUND: /Users/pedf/workspace/bacilo.github.io/tsconfig.json
FOUND: /Users/pedf/workspace/bacilo.github.io/src/content.config.ts
FOUND: /Users/pedf/workspace/bacilo.github.io/src/layouts/BaseLayout.astro
FOUND: /Users/pedf/workspace/bacilo.github.io/src/pages/index.astro
FOUND: /Users/pedf/workspace/bacilo.github.io/.github/workflows/deploy.yml
FOUND: /Users/pedf/workspace/bacilo.github.io/public/.nojekyll
FOUND: /Users/pedf/workspace/bacilo.github.io/public/CNAME
FOUND: /Users/pedf/workspace/bacilo.github.io/src/content/publications/.gitkeep
FOUND: /Users/pedf/workspace/bacilo.github.io/src/content/talks/.gitkeep
FOUND: /Users/pedf/workspace/bacilo.github.io/src/content/posts/.gitkeep
FOUND: /Users/pedf/workspace/bacilo.github.io/src/content/portfolio/.gitkeep
```

**Commits verified:**
```bash
FOUND: f71fa66 (Task 1: Initialize Astro project configuration)
FOUND: d74c3df (Task 2: Create GitHub Actions deployment workflow)
FOUND: 21028e3 (Task 3: Create content collection schemas)
```

All artifacts present and committed successfully.
