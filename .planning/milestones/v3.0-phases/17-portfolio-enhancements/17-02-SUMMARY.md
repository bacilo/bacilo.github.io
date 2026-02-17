---
phase: 17-portfolio-enhancements
plan: 02
subsystem: portfolio
tags: [portfolio, cms, embeds, codepen, stackblitz]
requires: [phase-17-plan-01]
provides: [widget-embed-fields, codepen-embeds, stackblitz-embeds]
affects: [content-schema, cms-config, portfolio-display]
tech-stack:
  added: []
  patterns: [conditional-rendering, id-based-embeds, component-reuse]
key-files:
  created: []
  modified:
    - src/content.config.ts
    - public/admin/config.yml
    - src/pages/portfolio/index.astro
decisions:
  - summary: "Reuse existing PlaygroundEmbed component for embed rendering"
    rationale: "PlaygroundEmbed already handles CodePen/StackBlitz URL transformation and responsive iframe styling - no new component needed"
    alternatives: ["Create dedicated CodePenEmbed and StackBlitzEmbed components"]
  - summary: "Construct full URLs from IDs in template, not in component"
    rationale: "Keeps PlaygroundEmbed agnostic to how URLs are constructed - maintains separation of concerns"
    alternatives: ["Pass IDs directly and detect platform in component"]
metrics:
  duration: 105
  tasks_completed: 2
  files_modified: 3
  commits: 2
  completed_at: "2026-02-17T07:22:15Z"
---

# Phase 17 Plan 02: Widget Embed Fields Summary

**One-liner:** Added codepenId and stackblitzId fields to portfolio schema for direct widget embedding using existing PlaygroundEmbed component.

## What Was Built

Extended portfolio schema and CMS config to support CodePen and StackBlitz embeds via simple ID fields. Portfolio items can now display runnable code demos directly on portfolio cards by configuring embed IDs in the CMS.

## Tasks Completed

### Task 1: Add embed fields to schema and CMS config
- **Commit:** c156e86
- **Files:** src/content.config.ts, public/admin/config.yml
- **Changes:**
  - Added `codepenId: optionalStr` to portfolio schema
  - Added `stackblitzId: optionalStr` to portfolio schema
  - Added "CodePen ID" field to portfolio CMS collection
  - Added "StackBlitz Project ID" field to portfolio CMS collection
  - Both CMS fields include helpful hints for content authors
- **Verification:** Build succeeded, fields validated in both files

### Task 2: Render widget embeds on portfolio index page
- **Commit:** 534da77
- **Files:** src/pages/portfolio/index.astro
- **Changes:**
  - Added conditional CodePen embed rendering for items with `codepenId`
  - Added conditional StackBlitz embed rendering for items with `stackblitzId`
  - Constructs full embed URLs from IDs: `https://codepen.io/pen/{id}` and `https://stackblitz.com/edit/{id}`
  - Reuses existing PlaygroundEmbed component for URL transformation and styling
  - Items without embed IDs render unchanged (no regression)
- **Verification:** Build succeeded, no embeds rendered for current items (as expected - none have IDs configured)

## Technical Approach

**Component Reuse Pattern:**
Rather than creating new embed components, this implementation leverages the existing `PlaygroundEmbed.astro` component which already:
- Transforms CodePen `/pen/` URLs to `/embed/` with `?default-tab=result`
- Adds StackBlitz `?embed=1&hideExplorer=1&view=preview` params
- Provides responsive iframe styling (16:9 aspect ratio, 4:3 on mobile)
- Uses lazy loading and sandbox attributes for security

The template constructs full URLs from IDs and passes them to PlaygroundEmbed, maintaining clean separation between URL construction logic and embed rendering logic.

**Schema Extension:**
Both new fields use `optionalStr` (preprocesses empty strings to undefined) matching the pattern established in Phase 17 Plan 01 for CMS compatibility.

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

All success criteria met:
- Portfolio schema accepts codepenId and stackblitzId (verified: 2 fields found)
- CMS config has CodePen ID and StackBlitz Project ID fields (verified: 2 labels found)
- Portfolio index conditionally renders PlaygroundEmbed for items with embed IDs (verified: 4 conditional checks)
- Existing portfolio items render unchanged (verified: 0 embeds in dist/portfolio/index.html)
- Site builds without errors (verified: build completed successfully)

## Integration Points

**Upstream Dependencies:**
- Phase 17 Plan 01 established the pattern for optional portfolio fields
- Existing PlaygroundEmbed component provides embed rendering infrastructure

**Downstream Effects:**
- Content authors can now configure widget embeds per portfolio item via CMS
- Portfolio cards will display embedded CodePen/StackBlitz demos when IDs are configured
- Fulfills CODE-03 requirement (runnable widget iframes in portfolio cards)

## Self-Check: PASSED

**Created files:** None (all modifications)

**Modified files exist:**
- src/content.config.ts: EXISTS
- public/admin/config.yml: EXISTS
- src/pages/portfolio/index.astro: EXISTS

**Commits exist:**
- c156e86: EXISTS
- 534da77: EXISTS

**Schema fields:**
- codepenId in content.config.ts: VERIFIED
- stackblitzId in content.config.ts: VERIFIED

**CMS fields:**
- CodePen ID in config.yml: VERIFIED
- StackBlitz Project ID in config.yml: VERIFIED

**Render logic:**
- project.data.codepenId conditional: VERIFIED (2 occurrences)
- project.data.stackblitzId conditional: VERIFIED (2 occurrences)

All verification points passed.
