# Requirements: Personal Website CMS

**Defined:** 2026-02-13
**Core Value:** A professional online presence that showcases work and is easy to maintain with monthly content updates

## v2.0 Requirements

Requirements for CMS integration milestone. Each maps to roadmap phases.

### CMS Infrastructure

- [ ] **CMS-01**: User can access admin interface at /admin route
- [ ] **CMS-02**: User can authenticate with GitHub Personal Access Token
- [ ] **CMS-03**: User's auth persists across browser sessions

### Content Editing — Blog

- [ ] **BLOG-01**: User can create new blog posts via CMS
- [ ] **BLOG-02**: User can edit existing blog posts via CMS
- [ ] **BLOG-03**: User can delete blog posts via CMS
- [ ] **BLOG-04**: User can use rich text markdown editor for post body

### Content Editing — Publications

- [ ] **PUB-01**: User can create new publications via CMS
- [ ] **PUB-02**: User can edit existing publications via CMS
- [ ] **PUB-03**: User can delete publications via CMS

### Content Editing — Talks

- [ ] **TALK-01**: User can create new talks via CMS
- [ ] **TALK-02**: User can edit existing talks via CMS
- [ ] **TALK-03**: User can delete talks via CMS

### Content Editing — Portfolio

- [ ] **PORT-01**: User can create new portfolio items via CMS
- [ ] **PORT-02**: User can edit existing portfolio items via CMS
- [ ] **PORT-03**: User can delete portfolio items via CMS

### Media Management

- [ ] **MEDIA-01**: User can upload images through CMS interface
- [ ] **MEDIA-02**: User can browse uploaded images in media library
- [ ] **MEDIA-03**: User can insert images into content from media library

### Content Normalization

- [ ] **NORM-01**: All existing blog posts have consistent frontmatter structure
- [ ] **NORM-02**: All existing publications have consistent frontmatter structure
- [ ] **NORM-03**: All existing talks have consistent frontmatter structure
- [ ] **NORM-04**: All existing portfolio items have consistent frontmatter structure

## Future Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced CMS Features

- **CMS-04**: Custom preview templates matching site styling
- **CMS-05**: Editorial workflow (draft/publish via PRs)
- **CMS-06**: Custom widgets for DOI/citation fields
- **CMS-07**: Relation widgets for cross-referencing content

### Site Enhancements (from v1.0 candidates)

- **PORT-06**: Data visualization embeds
- **PORT-07**: Portfolio filtering/sorting
- **CONT-01**: Dark mode toggle
- **CONT-02**: Search functionality
- **TEACH-01**: Teaching section

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Multi-user roles/permissions | Single user only, unnecessary complexity |
| OAuth proxy infrastructure | PAT auth eliminates need, simpler for single user |
| Real-time collaboration | Single author, not needed |
| Netlify Identity | Deprecated as of 2026 |
| Comments system | Complexity not worth it for monthly updates |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CMS-01 | Phase 11 | Pending |
| CMS-02 | Phase 11 | Pending |
| CMS-03 | Phase 11 | Pending |
| BLOG-01 | Phase 11 | Pending |
| BLOG-02 | Phase 11 | Pending |
| BLOG-03 | Phase 11 | Pending |
| BLOG-04 | Phase 11 | Pending |
| NORM-01 | Phase 11 | Pending |
| PUB-01 | Phase 12 | Pending |
| PUB-02 | Phase 12 | Pending |
| PUB-03 | Phase 12 | Pending |
| TALK-01 | Phase 12 | Pending |
| TALK-02 | Phase 12 | Pending |
| TALK-03 | Phase 12 | Pending |
| PORT-01 | Phase 12 | Pending |
| PORT-02 | Phase 12 | Pending |
| PORT-03 | Phase 12 | Pending |
| MEDIA-01 | Phase 12 | Pending |
| MEDIA-02 | Phase 12 | Pending |
| MEDIA-03 | Phase 12 | Pending |
| NORM-02 | Phase 12 | Pending |
| NORM-03 | Phase 12 | Pending |
| NORM-04 | Phase 12 | Pending |

**Coverage:**
- v2.0 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-13*
*Last updated: 2026-02-13 after roadmap creation*
