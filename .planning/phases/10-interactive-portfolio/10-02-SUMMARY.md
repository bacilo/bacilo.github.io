---
phase: 10-interactive-portfolio
plan: 02
subsystem: portfolio-embeds
tags: [portfolio, embeds, iframes, lazy-loading, security]

dependency_graph:
  requires:
    - "10-01-SUMMARY.md (GitHubCard component and portfolio schema with playgroundUrl)"
    - "09-01-SUMMARY.md (Portfolio schema with demoUrl field)"
  provides:
    - "DemoEmbed component for responsive live demo iframes"
    - "PlaygroundEmbed component with platform detection"
    - "Portfolio page with conditional embed rendering"
  affects:
    - "src/pages/portfolio/index.astro (embed integration)"
    - "Sample portfolio content (demonstration URLs)"

tech_stack:
  added:
    - "Responsive iframe wrappers with lazy loading"
    - "Platform-specific URL transformation (CodePen, StackBlitz, JSFiddle)"
    - "Security sandbox attributes for iframe isolation"
  patterns:
    - "Conditional component rendering based on content fields"
    - "Aspect ratio CSS properties for responsive embeds"
    - "Mobile-first breakpoints for embed sizing"

key_files:
  created:
    - path: "src/components/portfolio/DemoEmbed.astro"
      purpose: "Responsive iframe wrapper for live demo embeds"
      exports: ["DemoEmbed component"]
    - path: "src/components/portfolio/PlaygroundEmbed.astro"
      purpose: "Code playground embed with platform detection"
      exports: ["PlaygroundEmbed component"]
  modified:
    - path: "src/pages/portfolio/index.astro"
      changes: "Added embed component imports and conditional rendering"
    - path: "src/content/portfolio/portfolio-1.md"
      changes: "Added playgroundUrl field with CodePen example"
    - path: "src/content/portfolio/portfolio-2.md"
      changes: "Added demoUrl field with demo site example"
    - path: "src/layouts/BaseLayout.astro"
      changes: "Fixed CSS import from static link to Astro import, corrected author name"
    - path: "src/config/site.ts"
      changes: "Corrected site title from Figueira to Ferreira"

decisions:
  - decision: "Import global.css using Astro import instead of static link tag"
    rationale: "CSS in src/ directory must be imported, not linked as static file"
    impact: "Fixed critical 404 error that broke all site styling"
  - decision: "Use sandbox='allow-scripts' only for DemoEmbed"
    rationale: "Minimal permissions for security; demos only need script execution"
    impact: "Prevents embedded content from accessing parent window or cookies"
  - decision: "Use sandbox='allow-scripts allow-forms allow-popups' for PlaygroundEmbed"
    rationale: "Code playgrounds need form submission and popup functionality"
    impact: "Enables interactive playground features while maintaining security"
  - decision: "Platform-specific URL transformation in PlaygroundEmbed"
    rationale: "CodePen, StackBlitz, JSFiddle require different embed URL formats"
    impact: "Automatic conversion from regular URLs to embed-optimized URLs"
  - decision: "Different aspect ratios for mobile (1/1 for demos, 4/3 for playgrounds)"
    rationale: "Better usability on small screens with adjusted proportions"
    impact: "Improved mobile viewing experience for embedded content"
  - decision: "Increased gap between GitHubCard and embeds to var(--space-md)"
    rationale: "Better visual separation between card and embedded content"
    impact: "Clearer visual hierarchy in portfolio items"

metrics:
  duration_minutes: 9
  completed_date: "2026-02-12"
  tasks_completed: 3
  files_created: 2
  files_modified: 5
  commits: 3
  deviations: 2
---

# Phase 10 Plan 02: Interactive Portfolio Embeds Summary

**One-liner:** Live demo and code playground embed support with responsive iframes, lazy loading, and security sandboxing

## Objective

Add live demo and code playground embed support to portfolio, fulfilling PORT-04 and PORT-05 requirements with lazy loading, responsive sizing, and appropriate security restrictions.

## What Was Built

### 1. DemoEmbed Component
- Responsive iframe wrapper for live demo embeds
- Lazy loading attribute for performance
- Security sandbox with `allow-scripts` only
- Configurable aspect ratio (default 16:9, mobile 1:1)
- CSS custom properties for theming consistency

### 2. PlaygroundEmbed Component
- Platform detection for CodePen, StackBlitz, JSFiddle
- Automatic URL transformation to embed format
- Lazy loading for performance
- Security sandbox with `allow-scripts allow-forms allow-popups`
- Responsive aspect ratios (16:9 desktop, 4:3 mobile)

### 3. Portfolio Integration
- Conditional rendering of embeds based on content fields
- DemoEmbed rendered when `demoUrl` exists
- PlaygroundEmbed rendered when `playgroundUrl` exists
- Improved spacing between GitHubCard and embeds
- Sample content updated with example URLs

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Critical CSS loading failure**
- **Found during:** Task 3 human verification
- **Issue:** global.css referenced as static file `/styles/global.css` causing 404 error and complete loss of styling
- **Root cause:** BaseLayout used `<link rel="stylesheet" href="/styles/global.css" />` but file is in `src/styles/` not `public/styles/`
- **Fix:** Changed to Astro import `import '../styles/global.css'` in BaseLayout frontmatter
- **Impact:** Resolved critical bug that made entire site unstyled and unusable
- **Files modified:** src/layouts/BaseLayout.astro
- **Commit:** d24e63f

**2. [Rule 1 - Bug] Incorrect author name**
- **Found during:** Task 3 human verification
- **Issue:** Site title and header displayed "Pedro Figueira" instead of correct name "Pedro Ferreira"
- **Root cause:** SITE.title in config/site.ts had wrong name, BaseLayout had hardcoded incorrect default
- **Fix:** Corrected SITE.title to "Pedro Ferreira", updated BaseLayout to use SITE config instead of hardcoded values
- **Impact:** Fixed author name throughout site for accuracy
- **Files modified:** src/config/site.ts, src/layouts/BaseLayout.astro
- **Commit:** d24e63f (same commit as CSS fix)

### Notes on Expected Behavior

**GitHub API 404 errors:** Console shows 404s for placeholder repos `bacilo/example-project-1` and `bacilo/example-project-2`. This is expected - these are placeholder URLs that don't exist. GitHubCard component displays graceful fallback (just the repo link button) when API fails.

## Verification Results

### Build Status
- Build completed successfully with all embeds integrated
- No TypeScript errors
- All 36 static routes generated correctly

### Functional Verification
All verification criteria met:
- ✓ GitHub cards display with skeleton loading animation
- ✓ CodePen embed displays on Portfolio item 1 (interactive playground)
- ✓ Demo iframe displays on Portfolio item 2 (Astro.build site)
- ✓ Embeds have `loading="lazy"` attribute
- ✓ Embeds have appropriate `sandbox` security attributes
- ✓ Responsive aspect ratios work on mobile (<768px)
- ✓ CSS now loads correctly (after fix)
- ✓ Author name displays correctly as "Pedro Ferreira" (after fix)
- ✓ No console errors (except expected 404s for placeholder repos)

### Mobile Responsiveness
- GitHub cards stack in single column at <768px width
- Demo embeds use 1:1 aspect ratio on mobile
- Playground embeds use 4:3 aspect ratio on mobile
- No horizontal scrolling on mobile devices
- All content remains readable and accessible

## Technical Implementation

### Security Model
**DemoEmbed:** Minimal sandbox (`allow-scripts`) prevents embedded content from:
- Accessing parent window APIs
- Reading/writing cookies
- Submitting forms to external domains
- Opening popups

**PlaygroundEmbed:** Extended sandbox (`allow-scripts allow-forms allow-popups`) enables:
- Interactive code execution
- Form submission for playground features
- Popup windows for results
- Still prevents same-origin access

### Platform Detection
PlaygroundEmbed transforms URLs automatically:
- **CodePen:** `/pen/` → `/embed/` + `?default-tab=result`
- **StackBlitz:** Appends `?embed=1&hideExplorer=1&view=preview`
- **JSFiddle:** Appends `/embedded/result,js,html,css/`

### Performance Optimization
- Lazy loading prevents iframe content from loading until scrolled into view
- Reduces initial page load time
- Minimizes bandwidth usage for off-screen embeds
- Native browser feature (no JavaScript required)

## Impact on Project

### Requirements Fulfilled
- **PORT-04:** Portfolio supports live demo embeds ✓
- **PORT-05:** Portfolio supports code playground embeds ✓
- Security best practices for iframe sandboxing ✓
- Responsive design for mobile users ✓
- Performance optimization with lazy loading ✓

### Integration Points
- Extends portfolio schema fields added in Phase 9 (demoUrl) and Plan 10-01 (playgroundUrl)
- Integrates with GitHubCard component from Plan 10-01
- Uses design tokens from Phase 2 for consistent theming
- Follows responsive breakpoint pattern (768px) established in Phase 2

### User-Facing Changes
1. Portfolio items can now display live demos in responsive iframes
2. Code playground embeds (CodePen, StackBlitz, JSFiddle) automatically formatted
3. Embeds lazy load for better performance
4. Mobile users see properly sized embeds (adjusted aspect ratios)
5. All site styling now works correctly (CSS fix)
6. Correct author name displayed throughout site

## Commits

| Hash    | Type | Description                                        |
|---------|------|----------------------------------------------------|
| 7d776af | feat | Create DemoEmbed and PlaygroundEmbed components    |
| ae573f5 | feat | Integrate embeds into portfolio page               |
| d24e63f | fix  | Fix critical CSS loading and correct author name   |

## Next Steps

Phase 10 Plan 02 complete. This completes Phase 10 (Interactive Portfolio).

**Portfolio Feature Set Complete:**
- Static portfolio listing with content collections ✓ (09-01)
- GitHub API integration with live data ✓ (10-01)
- Live demo and playground embeds ✓ (10-02)

**Remaining Work:**
- User should replace placeholder GitHub URLs with real project repos
- User should replace example CodePen/demo URLs with actual project demos
- User may want to add a "Teaching" section (mentioned in verification feedback, not in current roadmap)

## Self-Check: PASSED

### File Existence Verification
```
✓ FOUND: src/components/portfolio/DemoEmbed.astro
✓ FOUND: src/components/portfolio/PlaygroundEmbed.astro
✓ FOUND: src/pages/portfolio/index.astro (modified)
✓ FOUND: src/content/portfolio/portfolio-1.md (modified)
✓ FOUND: src/content/portfolio/portfolio-2.md (modified)
✓ FOUND: src/layouts/BaseLayout.astro (modified - CSS fix)
✓ FOUND: src/config/site.ts (modified - name fix)
```

### Commit Verification
```
✓ FOUND: 7d776af (feat: DemoEmbed and PlaygroundEmbed components)
✓ FOUND: ae573f5 (feat: integrate embeds into portfolio page)
✓ FOUND: d24e63f (fix: CSS loading and author name)
```

### Build Verification
```
✓ Build completes successfully
✓ All 36 static routes generated
✓ No TypeScript errors
✓ No build warnings (except expected duplicate id warnings)
```
