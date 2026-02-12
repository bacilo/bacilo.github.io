---
phase: 10-interactive-portfolio
plan: 01
subsystem: portfolio
tags: [github-api, interactive, client-side]
one_liner: "Live GitHub repo cards with stars, language, description via API with skeleton loading and 1-hour caching"

dependency_graph:
  requires:
    - "09-01-PLAN.md (static portfolio foundation)"
  provides:
    - "GitHub API integration pattern"
    - "Client-side data fetching with caching"
    - "Skeleton loading component pattern"
  affects:
    - "src/pages/portfolio/index.astro (now renders GitHubCard for GitHub repos)"
    - "Future interactive features (playground embeds in 10-02)"

tech_stack:
  added:
    - "GitHub REST API v3"
    - "localStorage for API response caching"
    - "AbortController for fetch timeout"
  patterns:
    - "Client-side hydration with Astro <script> tags"
    - "Progressive enhancement (works without JS)"
    - "Graceful degradation on API failure"
    - "Shimmer animation for loading states"

key_files:
  created:
    - path: "src/scripts/github-api.ts"
      purpose: "GitHub API client with timeout, rate limit handling, caching"
      exports: ["fetchRepoData"]
    - path: "src/components/portfolio/SkeletonCard.astro"
      purpose: "Animated loading placeholder for GitHub cards"
      pattern: "CSS shimmer animation"
    - path: "src/components/portfolio/GitHubCard.astro"
      purpose: "Dynamic GitHub repo card with API data"
      features: ["client-side fetch", "skeleton loading", "error fallback"]
  modified:
    - path: "src/pages/portfolio/index.astro"
      changes: ["conditional GitHubCard rendering", "portfolio-item styles"]
    - path: "src/content.config.ts"
      changes: ["added playgroundUrl field to portfolio schema"]

decisions:
  - choice: "1-hour localStorage cache for GitHub API responses"
    rationale: "Reduces API rate limit hits, improves load time for repeat visits"
    alternatives: ["No caching (rate limit risk)", "Session storage (shorter cache)"]
  - choice: "5-second fetch timeout with AbortController"
    rationale: "Prevents hanging requests, shows skeleton → content quickly"
  - choice: "Graceful fallback shows 'Unable to load stats' instead of error message"
    rationale: "User-friendly, maintains card structure, still shows repo link"
  - choice: "Client-side rendering for GitHub data instead of build-time fetch"
    rationale: "Always shows current stars/language, no rebuild needed for updates"

metrics:
  duration: "2 minutes"
  completed: "2026-02-12"
  tasks_completed: 3
  files_created: 3
  files_modified: 2
  commits: 3
---

# Phase 10 Plan 01: GitHub API Integration Summary

Live GitHub repo cards with stars, language, description via API with skeleton loading and 1-hour caching

## Overview

Enhanced portfolio cards to display live GitHub repository metadata (stars, language, description) fetched client-side from GitHub API. Implemented skeleton loading animation during fetch and graceful error handling for API failures. Added 1-hour localStorage caching to minimize rate limit impact.

## What Was Built

### Core Components

**1. GitHub API Client (`src/scripts/github-api.ts`)**
- `fetchRepoData(owner, repo)` function with TypeScript interfaces
- 5-second timeout using AbortController
- Rate limit detection with x-ratelimit-reset header logging
- 1-hour localStorage caching per repository
- Returns null on errors for graceful degradation

**2. SkeletonCard Component (`src/components/portfolio/SkeletonCard.astro`)**
- Animated loading placeholder with CSS shimmer effect
- Uses CSS custom properties for dark mode compatibility
- ARIA attributes for accessibility (aria-busy, aria-live)
- Skeleton elements: title (60% width), description (full width), stats (2 elements)

**3. GitHubCard Component (`src/components/portfolio/GitHubCard.astro`)**
- Parses owner/repo from GitHub URL using regex
- Server-renders skeleton, client-side script hydrates with API data
- Displays: repo name, description, stars (formatted with toLocaleString), language
- Falls back to "Unable to load stats" if API fails
- Maintains existing portfolio card styling (border, hover states, dark mode)

### Integration

**Portfolio Page Updates (`src/pages/portfolio/index.astro`)**
- Conditional rendering: GitHubCard for github.com URLs, static card for others
- Added portfolio-item wrapper styles for GitHubCard layout
- Added demo-link styles matching existing link-button design
- Grid layout works seamlessly with both card types

**Schema Extension (`src/content.config.ts`)**
- Added `playgroundUrl` optional field to portfolio schema (for Plan 02)

## Tasks Completed

| Task | Name                                       | Commit  | Files                                     |
| ---- | ------------------------------------------ | ------- | ----------------------------------------- |
| 1    | Create GitHub API fetch utility            | b9b705c | src/scripts/github-api.ts                 |
| 2    | Create SkeletonCard and GitHubCard         | ab3ef45 | src/components/portfolio/*.astro (2 files)|
| 3    | Update portfolio page to use GitHubCard    | 80ed552 | src/pages/portfolio/index.astro, src/content.config.ts |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

All verification criteria passed:

- ✅ `npm run build` completes successfully
- ✅ TypeScript interfaces defined for GitHubRepo
- ✅ SkeletonCard and GitHubCard components exist in src/components/portfolio/
- ✅ Portfolio page conditionally renders GitHubCard for GitHub repos
- ✅ Grid layout compatible with both card types
- ✅ Dark mode CSS custom properties maintained

## Technical Implementation

### Client-Side Architecture

**Hydration Flow:**
1. Server renders GitHubCard with skeleton visible, content hidden
2. Client script on DOMContentLoaded queries all `.github-card` elements
3. For each card: extract data-owner/data-repo, call fetchRepoData
4. On success: populate description, stars, language
5. On failure: show "Unable to load stats" fallback
6. Transition: hide skeleton, show content

**Caching Strategy:**
- Cache key: `github-repo-${owner}-${repo}`
- Cache format: `{ data: GitHubRepo, timestamp: number }`
- Check age before fetch, return if < 1 hour old
- Update cache after successful fetch
- Graceful cache failures (log warning, proceed to fetch)

**Error Handling:**
- Timeout: 5 seconds via AbortController
- Rate limiting (403/429): Log warning with reset time, return null
- Other errors: Log to console, return null
- Client fallback: Show "Unable to load stats" instead of stats row

### Styling Approach

**Consistency:**
- GitHubCard matches existing portfolio-card styles exactly
- Same border, border-radius, padding, background, hover states
- Uses CSS custom properties for dark mode: --color-border, --color-bg, --color-header-bg

**Shimmer Animation:**
```css
background: linear-gradient(90deg, var(--color-border) 25%, var(--color-header-bg) 50%, var(--color-border) 75%);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;
```

## Success Criteria Met

- ✅ GitHub cards display stars fetched from GitHub API
- ✅ GitHub cards display primary language from API
- ✅ Skeleton loading animation appears during fetch
- ✅ Graceful fallback when API unavailable (shows repo link, hides stats)
- ✅ localStorage caches API responses for 1 hour
- ✅ Dark mode compatibility maintained

## Impact

**User Experience:**
- Portfolio cards now show live, current repository stats
- Smooth loading experience with skeleton animation
- No broken state if API fails - card still functional
- Faster repeat visits due to caching

**Developer Experience:**
- Reusable GitHub API client for future features
- Pattern established for client-side data fetching in Astro
- Skeleton component reusable for other loading states

**Next Steps:**
- Plan 10-02 will add interactive playground embeds using playgroundUrl field
- Consider adding GitHub API token support for higher rate limits
- Monitor API cache effectiveness in production

## Self-Check: PASSED

**Created files verified:**
```
FOUND: src/scripts/github-api.ts
FOUND: src/components/portfolio/SkeletonCard.astro
FOUND: src/components/portfolio/GitHubCard.astro
```

**Modified files verified:**
```
FOUND: src/pages/portfolio/index.astro (GitHubCard import present)
FOUND: src/content.config.ts (playgroundUrl field added)
```

**Commits verified:**
```
FOUND: b9b705c feat(10-01): add GitHub API fetch utility with caching
FOUND: ab3ef45 feat(10-01): add GitHubCard and SkeletonCard components
FOUND: 80ed552 feat(10-01): integrate GitHubCard into portfolio page
```

All artifacts exist, all commits present, plan complete.

