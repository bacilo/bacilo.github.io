---
phase: 03-author-profile
plan: 01
subsystem: author-identity
tags: [component, layout, responsive-design, accessibility]
dependency_graph:
  requires:
    - BaseLayout component (02-01)
    - Global CSS design tokens (02-01)
    - Jekyll author data (_config.yml)
  provides:
    - AuthorSidebar component
    - Centralized author configuration
    - Site-wide author identity display
  affects:
    - All pages using BaseLayout
    - Future components importing AUTHOR config
tech_stack:
  added:
    - src/config/site.ts (TypeScript configuration)
    - src/components/AuthorSidebar.astro (Astro component)
  patterns:
    - TypeScript interfaces for type safety
    - CSS custom properties for theming
    - Conditional rendering for optional fields
    - Responsive flexbox layout
    - External link security (rel="noopener noreferrer")
key_files:
  created:
    - src/config/site.ts
    - src/components/AuthorSidebar.astro
  modified:
    - src/layouts/BaseLayout.astro
    - src/styles/global.css
decisions:
  - "Use centralized config file instead of inline data for maintainability"
  - "Conditional rendering for optional social links (LinkedIn empty in original)"
  - "Mobile-first responsive design: stacked on mobile, sidebar on desktop at 768px"
  - "Regular img tag instead of Astro Image component for public folder assets"
  - "showSidebar prop defaults to true for site-wide author identity"
metrics:
  duration_minutes: 2
  tasks_completed: 3
  files_created: 2
  files_modified: 2
  commits: 3
  completed_date: 2026-02-12
---

# Phase 03 Plan 01: Author Sidebar Component Summary

Author profile sidebar with photo, bio, and social/academic links integrated into all pages via BaseLayout.

## What Was Built

Created a comprehensive author identity system with three integrated components:

1. **Site Configuration** (`src/config/site.ts`)
   - TypeScript interfaces for SITE and AUTHOR data structures
   - Extracted author information from Jekyll `_config.yml`
   - Centralized configuration for reuse across components
   - Type-safe social and academic profile fields

2. **AuthorSidebar Component** (`src/components/AuthorSidebar.astro`)
   - Profile photo with explicit dimensions (200x200px) for CLS prevention
   - Author name, bio, and location display
   - Social links section: Twitter, GitHub, LinkedIn (conditional)
   - Academic links section: Google Scholar, ORCID
   - Semantic HTML with proper ARIA labels
   - External link security attributes (target="_blank" rel="noopener noreferrer")
   - Responsive design: full width on mobile, 250px fixed on desktop
   - Focus states for keyboard navigation

3. **Layout Integration** (`src/layouts/BaseLayout.astro`)
   - Imported AuthorSidebar component
   - Added showSidebar prop (default: true) for flexibility
   - Created content-wrapper div for sidebar + main layout
   - Mobile: stacked layout (sidebar above content)
   - Desktop (≥768px): flexbox with sidebar on left, content on right
   - Updated CSS custom property: --sidebar-width: 250px

## Success Criteria Met

- [x] Author sidebar component exists and renders on all pages
- [x] Profile photo displays without layout shift (explicit dimensions)
- [x] Social links (Twitter, GitHub) are present and functional
- [x] Academic links (Google Scholar, ORCID) are present and functional
- [x] Responsive layout: sidebar desktop, stacked mobile
- [x] Dark mode inherits existing color scheme automatically

## Deviations from Plan

None - plan executed exactly as written.

All tasks completed without issues:
- Site configuration created with proper TypeScript types
- AuthorSidebar component implemented with all required features
- BaseLayout integration successful with responsive wrapper
- All verification steps passed

## Technical Decisions

### Configuration Architecture
Chose centralized `src/config/site.ts` over component-level constants to:
- Enable reuse across multiple components
- Provide single source of truth for author data
- Support type safety with TypeScript interfaces
- Simplify future updates to author information

### Image Handling
Used standard `<img>` tag instead of Astro's `<Image>` component because:
- Profile image is in public folder, not src/assets
- Image optimization not critical for single profile photo
- Explicit width/height attributes prevent layout shift
- Simpler implementation for static assets

### Responsive Breakpoint
Selected 768px breakpoint to align with:
- Existing design system decision from Phase 02-01
- Common tablet/desktop split in web development
- Consistency with Navigation component breakpoint

### Conditional Rendering
LinkedIn field left undefined (not empty string) in config:
- Matches Jekyll's empty field behavior
- Cleaner TypeScript optional chaining
- Avoids rendering empty href attributes
- Future-proof for adding LinkedIn later

## Implementation Quality

### Accessibility
- Semantic HTML with `<aside>`, `<nav>`, `<h2>`, `<h3>`
- ARIA labels on navigation regions
- Focus states on all interactive elements
- Alt text on profile photo includes context

### Performance
- Profile photo loaded eagerly (above the fold)
- Explicit dimensions prevent cumulative layout shift
- System fonts via inherited design tokens
- No external dependencies or API calls

### Maintainability
- TypeScript interfaces enforce data structure
- CSS custom properties for themeable values
- Conditional rendering handles missing fields gracefully
- Component-scoped styles prevent conflicts

### Security
- All external links use `rel="noopener noreferrer"`
- Prevents reverse tabnabbing attacks
- No inline event handlers or dynamic script injection

## Testing Results

### Build Verification
```bash
npm run build
# ✓ Completed in 1.17s
# 29 pages built successfully
# No TypeScript errors
# No build warnings
```

### Visual Verification
- Sidebar appears on homepage with photo, name, bio, location
- Social links render: Twitter (https://twitter.com/pedro2_0), GitHub (https://github.com/bacilo)
- Academic links render: Google Scholar, ORCID
- Sidebar appears on all content pages (publications, talks, posts, CV)

### Responsive Verification
- Mobile (<768px): Sidebar stacks above main content, full width
- Desktop (≥768px): Sidebar on left (250px), content on right, flexbox gap
- Dark mode: All colors inherit from design tokens automatically

## Files Changed

### Created
- **src/config/site.ts** (46 lines)
  - SITE config: title, description, url
  - AUTHOR config: name, bio, avatar, location, social, academic
  - TypeScript interfaces for type safety

- **src/components/AuthorSidebar.astro** (189 lines)
  - Profile card with photo, name, bio, location
  - Social links nav with conditional rendering
  - Academic links nav with external link security
  - Responsive scoped styles

### Modified
- **src/layouts/BaseLayout.astro**
  - Added AuthorSidebar import and showSidebar prop
  - Wrapped main content in content-wrapper div
  - Updated layout styles for flexbox sidebar + content
  - Removed max-width from main (now on wrapper)

- **src/styles/global.css**
  - Added --sidebar-width: 250px custom property

## Commits

| Hash | Message |
|------|---------|
| 8cf633e | feat(03-01): create site configuration with author data |
| 9de6980 | feat(03-01): create AuthorSidebar component |
| d4f8e11 | feat(03-01): integrate sidebar into BaseLayout with responsive wrapper |

## Impact Assessment

### User-Facing
- **Author identity**: Site now displays consistent author information on all pages
- **Professional presence**: Social and academic links provide credibility and discoverability
- **Mobile experience**: Author info accessible without horizontal scrolling
- **Navigation**: Quick access to author's external profiles from any page

### Developer-Facing
- **Configuration**: Centralized author data simplifies future updates
- **Reusability**: AUTHOR constant can be imported by other components
- **Flexibility**: showSidebar prop allows hiding sidebar on specific pages
- **Type safety**: TypeScript interfaces prevent configuration errors

### Technical Debt
None introduced. Implementation follows established patterns:
- Uses existing design tokens from Phase 02-01
- Matches responsive breakpoint conventions
- Integrates cleanly with BaseLayout architecture
- No new dependencies or technical compromises

## Next Steps

Ready for Phase 03 Plan 02: Homepage hero section and content features.

The author sidebar provides the identity foundation that will complement:
- Homepage welcome message and recent content
- Bio expansion with research interests
- Featured publications and talks
- Contact information and CTAs

## Self-Check: PASSED

Verified all claims before proceeding:

**Files exist:**
```bash
[ -f "src/config/site.ts" ] && echo "FOUND: src/config/site.ts"
# FOUND: src/config/site.ts

[ -f "src/components/AuthorSidebar.astro" ] && echo "FOUND: src/components/AuthorSidebar.astro"
# FOUND: src/components/AuthorSidebar.astro
```

**Commits exist:**
```bash
git log --oneline --all | grep -q "8cf633e" && echo "FOUND: 8cf633e"
# FOUND: 8cf633e

git log --oneline --all | grep -q "9de6980" && echo "FOUND: 9de6980"
# FOUND: 9de6980

git log --oneline --all | grep -q "d4f8e11" && echo "FOUND: d4f8e11"
# FOUND: d4f8e11
```

**Build verification:**
```bash
npm run build
# [build] 29 page(s) built in 1.17s
# [build] Complete!
```

**Content verification:**
```bash
grep "twitter.com/pedro2_0" dist/index.html
# twitter.com/pedro2_0

grep "github.com/bacilo" dist/index.html
# github.com/bacilo
```

All verification checks passed. Plan 03-01 complete.
