---
phase: 17-portfolio-enhancements
plan: 01
subsystem: portfolio-stats
tags: [portfolio, github-api, cms, stats-display]
dependency_graph:
  requires: [github-api-caching, sveltia-cms, portfolio-schema]
  provides: [configurable-stats-display, release-download-stats, stats-cms-editing]
  affects: [portfolio-cards, github-api-module]
tech_stack:
  added: [github-releases-api]
  patterns: [conditional-rendering, enum-props, api-caching]
key_files:
  created: []
  modified:
    - src/content.config.ts
    - public/admin/config.yml
    - src/scripts/github-api.ts
    - src/components/portfolio/GitHubCard.astro
    - src/pages/portfolio/index.astro
decisions:
  - "Default statsDisplay to 'stars' for backward compatibility with existing portfolio items"
  - "Use conditional rendering in Astro template for clean HTML output when stats are hidden"
  - "Follow fetchRepoData pattern exactly for fetchReleaseStats consistency"
  - "Sum all asset download_count values for total release downloads metric"
  - "Skip all API calls when statsDisplay is 'none' for performance"
metrics:
  duration: 3
  completed: 2026-02-17T07:17:48Z
  tasks: 3
  commits: 3
  files_modified: 5
---

# Phase 17 Plan 01: Configurable GitHub Stats Display Summary

**One-liner:** Portfolio cards now support configurable GitHub stats (stars, release downloads, both, or none) with CMS editability and backward-compatible defaults.

## Objective Achieved

Added configurable GitHub stats display to portfolio cards. Each portfolio item can show stars, release downloads, both, or none, controlled via frontmatter `statsDisplay` field and editable in the CMS. Fulfills STAT-01 (configurable stats display), STAT-02 (release download counts), and STAT-03 (CMS editability).

## Tasks Completed

### Task 1: Extend portfolio schema and CMS config with stats fields
**Commit:** `67e240d`
**Files:** `src/content.config.ts`, `public/admin/config.yml`

Added `statsDisplay` enum field (stars/downloads/both/none) with 'stars' default and `npmPackage` string field to portfolio schema. Added matching CMS select widget for Stats Display with 4 options and string field for npm Package Name. Maintains backward compatibility with default 'stars' value.

**Key changes:**
- Portfolio schema accepts `statsDisplay: z.enum(['stars', 'downloads', 'both', 'none']).optional().default('stars')`
- Portfolio schema accepts `npmPackage: optionalStr` for future npm stats
- CMS config has Stats Display select widget with hint text
- CMS config has npm Package Name string field

### Task 2: Add fetchReleaseStats to GitHub API module
**Commit:** `c8859c4`
**Files:** `src/scripts/github-api.ts`

Added `GitHubRelease` interface and `fetchReleaseStats` function to GitHub API module following the exact same pattern as `fetchRepoData` for consistency. Includes caching, rate limiting handling, timeout logic, and 404 handling for repos without releases.

**Key changes:**
- Exported `GitHubRelease` interface with tag_name, name, and assets array
- Private `CachedReleaseData` interface for release caching
- `fetchReleaseStats` function with same CACHE_DURATION (1 hour)
- API URL: `https://api.github.com/repos/${owner}/${repo}/releases/latest`
- 404 handling returns null with console.log (not error) for repos without releases
- Same error handling pattern for rate limiting (403/429) and timeouts

### Task 3: Update GitHubCard and portfolio index for configurable stats
**Commit:** `b16a334`
**Files:** `src/components/portfolio/GitHubCard.astro`, `src/pages/portfolio/index.astro`

Updated GitHubCard component to conditionally render stats based on `statsDisplay` prop. Added download stats fetching from GitHub Releases API with formatted counts. Updated portfolio index to pass `statsDisplay` from frontmatter to GitHubCard.

**Key changes:**
- Added `statsDisplay` prop to GitHubCard Props interface with default 'stars'
- Added `data-stats-display` attribute to card element for script access
- Conditional rendering: stats section only shown when `statsDisplay !== 'none'`
- Stars span shown when `statsDisplay === 'stars'` or `'both'`
- Downloads span shown when `statsDisplay === 'downloads'` or `'both'`
- Script imports `fetchReleaseStats` alongside `fetchRepoData`
- Downloads calculated as `releases.assets.reduce((sum, asset) => sum + asset.download_count, 0)`
- Download count formatted with `.toLocaleString()`
- Skip all API calls when `statsDisplay === 'none'` for performance
- CSS styling for `.downloads` span matching existing `.stars` style
- Portfolio index passes `statsDisplay={project.data.statsDisplay}` to GitHubCard

## Verification Results

All verification criteria passed:

- ✅ `npx astro build` completes without errors
- ✅ Portfolio cards render on /portfolio/ page
- ✅ Cards with default statsDisplay ('stars') show stars count
- ✅ GitHubCard data-stats-display attribute reflects configured value (verified in dist/portfolio/index.html)
- ✅ `fetchReleaseStats` function exists in github-api.ts with proper export
- ✅ CMS config has Stats Display select widget with 4 options (stars/downloads/both/none)

## Success Criteria

All success criteria met:

- ✅ Portfolio cards display stars count by default (backward compatible)
- ✅ Cards configured with `statsDisplay: 'downloads'` show release download count
- ✅ Cards configured with `statsDisplay: 'both'` show both stars and downloads
- ✅ Cards configured with `statsDisplay: 'none'` show no stats section
- ✅ CMS allows selecting stats display option per portfolio item
- ✅ Site builds without errors

## Deviations from Plan

None - plan executed exactly as written.

## Technical Notes

**API Caching Strategy:**
Release stats use the same 1-hour cache duration as repo stats. Cache keys follow pattern `github-release-${owner}-${repo}` for consistency. localStorage handles both cache read/write with graceful fallback on errors.

**Conditional Rendering Pattern:**
Astro's conditional rendering (`{condition && <element />}`) produces clean HTML output. When `statsDisplay === 'none'`, the `.repo-stats` div is completely omitted from the DOM, not just hidden with CSS.

**Performance Optimization:**
When `statsDisplay === 'none'`, the script returns early without making any API calls. This reduces unnecessary GitHub API requests for portfolio items that don't display stats.

**Download Count Logic:**
The `fetchReleaseStats` function fetches the latest release only. Download counts are summed across all assets in that release. Repos without releases return null, displaying "0" downloads gracefully.

## Impact Summary

**Schema Extension:**
- Portfolio content type now supports stats configuration
- Backward compatible: existing items default to 'stars' display
- Future-ready: npmPackage field reserved for npm download stats

**GitHub API Module:**
- Consistent API pattern between repo and release data fetching
- Same caching, timeout, and error handling strategies
- Graceful degradation on API failures

**Portfolio Cards:**
- Flexible stats display per card
- Clean HTML output with conditional rendering
- Performance optimized for 'none' case
- CMS-editable without code changes

## Self-Check

Verifying created/modified files exist and commits are valid.

**Files check:**
- ✅ src/content.config.ts
- ✅ public/admin/config.yml
- ✅ src/scripts/github-api.ts
- ✅ src/components/portfolio/GitHubCard.astro
- ✅ src/pages/portfolio/index.astro

**Commits check:**
- ✅ 67e240d (Task 1: schema and CMS config)
- ✅ c8859c4 (Task 2: fetchReleaseStats function)
- ✅ b16a334 (Task 3: GitHubCard updates)

**Self-Check: PASSED**
