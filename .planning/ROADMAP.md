# Roadmap: Personal Website CMS

## Milestones

- ✅ **v1.0 Personal Website Rebuild** — Phases 1-10 (shipped 2026-02-12)
- 🚧 **v2.0 Content Management** — Phases 11-13 (in progress)

## Phases

<details>
<summary>✅ v1.0 Personal Website Rebuild (Phases 1-10) — SHIPPED 2026-02-12</summary>

- [x] Phase 1: Foundation & Astro Setup (3/3 plans) — completed 2026-02-12
- [x] Phase 2: Core Layout & Navigation (3/3 plans) — completed 2026-02-12
- [x] Phase 3: Author Profile (2/2 plans) — completed 2026-02-12
- [x] Phase 4: Publications (0/0 plans, satisfied by Phase 2) — completed 2026-02-12
- [x] Phase 5: Talks (0/0 plans, satisfied by Phase 2) — completed 2026-02-12
- [x] Phase 6: CV Page (1/1 plan) — completed 2026-02-12
- [x] Phase 7: Blog Foundation (1/1 plan) — completed 2026-02-12
- [x] Phase 8: Blog Enhancement (2/2 plans) — completed 2026-02-12
- [x] Phase 9: Static Portfolio (1/1 plan) — completed 2026-02-12
- [x] Phase 10: Interactive Portfolio (2/2 plans) — completed 2026-02-12

**Full details:** `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 🚧 v2.0 Content Management (In Progress)

**Milestone Goal:** Enable web-based content editing through Sveltia CMS so updates feel effortless instead of requiring IDE workflow.

#### Phase 11: Content Audit & CMS Setup
**Goal**: CMS admin interface functional with blog posts editable
**Depends on**: Phase 10
**Requirements**: CMS-01, CMS-02, CMS-03, BLOG-01, BLOG-02, BLOG-03, BLOG-04, NORM-01
**Success Criteria** (what must be TRUE):
  1. User can access admin interface at /admin route
  2. User can authenticate with GitHub Personal Access Token and stay logged in across sessions
  3. User can create, edit, and delete blog posts through CMS interface
  4. User can use rich text markdown editor for blog post body
  5. All existing blog posts load in CMS without errors or missing fields
**Plans:** 2 plans

Plans:
- [x] 11-01-PLAN.md — Content audit & frontmatter normalization (NORM-01)
- [x] 11-02-PLAN.md — CMS static setup & blog collection with PAT auth (CMS-01, CMS-02, CMS-03, BLOG-01-04)

#### Phase 12: Complete Content Coverage
**Goal**: All content types editable through CMS with media library
**Depends on**: Phase 11
**Requirements**: PUB-01, PUB-02, PUB-03, TALK-01, TALK-02, TALK-03, PORT-01, PORT-02, PORT-03, MEDIA-01, MEDIA-02, MEDIA-03, NORM-02, NORM-03, NORM-04
**Success Criteria** (what must be TRUE):
  1. User can create, edit, and delete publications through CMS interface
  2. User can create, edit, and delete talks through CMS interface
  3. User can create, edit, and delete portfolio items through CMS interface
  4. User can upload images through CMS and browse them in media library
  5. User can insert images from media library into any content type
  6. All existing publications, talks, and portfolio items load in CMS without errors
**Plans:** 2 plans

Plans:
- [x] 12-01-PLAN.md — Extend frontmatter audit to all collections and normalize violations (NORM-02, NORM-03, NORM-04)
- [x] 12-02-PLAN.md — Add publications, talks, portfolio collections to CMS config (PUB-01/02/03, TALK-01/02/03, PORT-01/02/03, MEDIA-01/02/03)

#### Phase 13: Documentation & Testing
**Goal**: CMS validated as production-ready with editor documentation
**Depends on**: Phase 12
**Requirements**: None (testing and documentation phase)
**Success Criteria** (what must be TRUE):
  1. User can complete full workflow (create content in each collection, verify on live site) without errors
  2. CMS works in Safari, Firefox, and Chrome without browser-specific issues
  3. Content created through CMS builds successfully without Zod schema errors
  4. User has documentation explaining PAT setup, field requirements, and markdown editing
  5. All CMS commits appear in Git history with proper attribution
**Plans:** 2 plans

Plans:
- [x] 13-01-PLAN.md — Build validation script, test checklist, and CMS user guide
- [x] 13-02-PLAN.md — User validates CMS production readiness (checkpoint)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → ... → 13

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Astro Setup | v1.0 | 3/3 | Complete | 2026-02-12 |
| 2. Core Layout & Navigation | v1.0 | 3/3 | Complete | 2026-02-12 |
| 3. Author Profile | v1.0 | 2/2 | Complete | 2026-02-12 |
| 4. Publications | v1.0 | 0/0 | Complete | 2026-02-12 |
| 5. Talks | v1.0 | 0/0 | Complete | 2026-02-12 |
| 6. CV Page | v1.0 | 1/1 | Complete | 2026-02-12 |
| 7. Blog Foundation | v1.0 | 1/1 | Complete | 2026-02-12 |
| 8. Blog Enhancement | v1.0 | 2/2 | Complete | 2026-02-12 |
| 9. Static Portfolio | v1.0 | 1/1 | Complete | 2026-02-12 |
| 10. Interactive Portfolio | v1.0 | 2/2 | Complete | 2026-02-12 |
| 11. Content Audit & CMS Setup | v2.0 | 2/2 | Complete | 2026-02-13 |
| 12. Complete Content Coverage | v2.0 | 2/2 | Complete | 2026-02-13 |
| 13. Documentation & Testing | v2.0 | 2/2 | Complete | 2026-02-13 |
