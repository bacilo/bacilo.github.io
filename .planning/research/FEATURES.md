# Feature Landscape: Decap CMS Integration

**Domain:** Git-based headless CMS for static sites
**Researched:** 2026-02-13
**Confidence:** MEDIUM

## Overview

This document focuses exclusively on CMS-specific features being added to an existing Astro academic website. The site already has blog posts, publications, talks, portfolio, and author pages. The milestone adds Decap CMS with Netlify Identity to enable web-based content editing instead of manual markdown editing.

## Table Stakes

Features users expect from any content management system. Missing = CMS feels incomplete.

| Feature | Why Expected | Complexity | Notes | Dependencies |
|---------|--------------|------------|-------|--------------|
| **Rich text editor for blog posts** | Core value proposition - avoid editing raw markdown | Medium | Decap's markdown widget provides WYSIWYG + raw modes | Must map to existing `body` field in posts |
| **Image upload capability** | Cannot ask user to manually place images in repo | Medium | Media library with drag-and-drop; requires `media_folder` config | Must integrate with existing `/images` or `/assets` structure |
| **Edit all content types** | CMS should handle posts, publications, talks | Medium | Requires collection config for each content type | Must map to existing frontmatter schemas in `_posts/`, `_publications/`, `_talks/` |
| **Authentication/access control** | Prevent unauthorized edits | Low | Netlify Identity provides this out-of-box | Netlify deployment required |
| **Save without publishing** | Avoid accidental live changes | Low | Editorial workflow (draft → publish) via Git PR | Requires `publish_mode: editorial_workflow` config |
| **Preview before publishing** | See how content looks before going live | Medium | Real-time preview pane in editor | May need custom preview templates to match site styling |
| **Field validation** | Prevent broken content (missing titles, dates) | Low | Built-in `required` field option | Apply to critical fields like title, date, permalink |

## Differentiators

Features that set this CMS implementation apart. Not expected, but add significant value.

| Feature | Value Proposition | Complexity | Notes | Dependencies |
|---------|-------------------|------------|-------|--------------|
| **Custom preview templates** | Preview shows actual site styling, not generic markdown | High | Requires React components + CSS matching site theme | Must replicate Astro component styling in React |
| **Relation widgets** | Link talks to publications, posts to related content | Medium | Built-in `relation` widget for cross-referencing | Requires understanding existing content relationships |
| **Git-based workflow** | Full version history, rollback capability | Low (built-in) | Every edit = Git commit; editorial workflow = PR | Inherent to Decap architecture |
| **Bulk image management** | Media library shows all uploaded images for reuse | Low | Built-in media library UI | Automatic with proper `media_folder` config |
| **Custom widgets for metadata** | Specialized inputs for DOI, venue, citation formats | High | Custom widget development for publication-specific fields | Requires JavaScript/React widget creation |
| **Tag management UI** | Add/edit tags without typing, prevent duplicates | Medium | List widget with predefined options or autocomplete | Must sync with existing tag system |

## Anti-Features

Features to explicitly NOT build. Would add complexity without value for single-user academic site.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Multi-user roles/permissions** | Single user only; permission system adds unnecessary complexity | Use basic Netlify Identity authentication (invited user only) |
| **Complex approval workflows** | No editorial team; review/approval states unused | Use simple draft/publish via editorial workflow, or even skip workflow for immediate publish |
| **Visual page builder** | Academic site has fixed layouts; content fills templates | Use markdown editor + field widgets for structured data |
| **AI content generation** | Academic content requires accuracy, citations; AI inappropriate | Keep traditional manual authoring |
| **Real-time collaborative editing** | Single author; no collaboration needed | Standard single-user editing experience |
| **Scheduled publishing** | Academic posts don't need time-based publishing | Manual publish when ready |
| **Multilingual content management** | Site is English-only | Skip i18n configuration |

## Feature Dependencies

### Content Structure Dependencies

Decap CMS must map to existing Astro content structure:

```
Posts (_posts/*.md):
  - title (string) → required
  - date (datetime) → required
  - permalink (string) → required for routing
  - tags (list) → array of strings
  - body (markdown) → main content

Publications (_publications/*.md):
  - title (string) → required
  - collection (string) → must be "publications"
  - permalink (string) → required
  - date (date) → required
  - venue (string) → required
  - paperurl (string) → optional
  - citation (text) → required
  - body (markdown) → optional description

Talks (_talks/*.md):
  - title (string) → required
  - collection (string) → must be "talks"
  - type (string) → "Talk" or "Tutorial"
  - permalink (string) → required
  - venue (string) → required
  - date (date) → required
  - location (string) → optional
  - body (markdown) → talk description
```

### Technical Dependencies

- **Netlify Identity Widget**: Must load on both `/admin/index.html` and site homepage for auth flow
- **Git Gateway**: Connects Netlify Identity to GitHub API for commits
- **Editorial Workflow**: Requires Git backend that supports PRs (GitHub supported)
- **Media Library**: Requires `media_folder` pointing to valid asset directory
- **Field Widgets**: All fields must use appropriate Decap widgets (string, text, datetime, list, markdown, etc.)

### Critical Constraints

1. **Frontmatter compatibility**: Decap must preserve existing frontmatter structure; Astro pages depend on exact field names
2. **Permalink generation**: Must maintain existing URL patterns (`/posts/YYYY/MM/slug/`, `/publication/slug`, `/talks/slug`)
3. **Tag consistency**: Tag values must remain lowercase and URL-safe (existing site uses this for tag pages)
4. **Collection field**: Publications and talks require `collection` field in frontmatter (Astro uses this for filtering)

## MVP Recommendation

### Phase 1: Core Editing (Must-Have)

Prioritize:
1. **Authentication setup** - Netlify Identity + Git Gateway
2. **Blog post editing** - Rich text editor for posts with title, date, tags, body
3. **Image uploads** - Media library configuration
4. **Field validation** - Required fields to prevent broken content

**Rationale**: Enables basic web-based editing; user can immediately stop editing markdown files directly.

### Phase 2: Complete Content Coverage (Should-Have)

5. **Publications collection** - Fields for venue, paperurl, citation
6. **Talks collection** - Fields for type, venue, location
7. **Editorial workflow** - Draft/publish via Git PRs

**Rationale**: Full CMS coverage of all content types; workflow prevents accidental publishes.

### Phase 3: Enhanced Experience (Nice-to-Have)

8. **Custom preview templates** - Match site styling in preview pane
9. **Tag management UI** - Autocomplete or dropdown for existing tags
10. **Relation widgets** - Link related content

**Rationale**: Quality-of-life improvements; not blocking for core use case.

## Defer to Future

- **Custom widgets for citations** - High effort; manual editing acceptable initially
- **Bulk operations** - Single user won't need mass edits
- **Advanced media management** - Basic upload/select sufficient
- **Custom validation logic** - Built-in `required` and `pattern` sufficient

## Complexity Assessment

| Feature Category | Complexity | Estimated Effort |
|-----------------|------------|------------------|
| Basic CMS setup (auth, config, one collection) | Low | 2-4 hours |
| All three collections configured | Medium | 4-6 hours |
| Image uploads + media library | Medium | 2-3 hours |
| Editorial workflow | Low | 1 hour |
| Custom preview templates | High | 6-8 hours |
| Custom widgets | High | 4-8 hours per widget |

**Total MVP (Phase 1-2):** 9-14 hours
**Full implementation (Phase 1-3):** 17-29 hours

## Known Pitfalls

Based on research, watch out for:

1. **Netlify Identity deprecation**: Netlify is deprecating Identity in favor of Auth0. For new projects, consider Auth0 setup instead. (Source: GitHub discussions on Decap repo)

2. **Media folder must exist**: Image upload fails if `media_folder` directory doesn't exist in repo. Create directory first.

3. **Body field naming**: Field for markdown content MUST be named `body` or Decap won't save it correctly as file body vs frontmatter.

4. **Collection field retention**: Ensure `collection: publications` and `collection: talks` fields are hidden but present; Astro depends on these.

5. **Frontmatter field preservation**: Decap only saves fields defined in config. Unknown fields get stripped. Must define ALL existing frontmatter fields or data loss occurs.

6. **Permalink format validation**: Must validate permalink format matches Astro routing expectations or pages become unreachable.

## Integration with Existing Features

### Existing Features (No CMS Changes Needed)
- RSS feed generation (reads from content files)
- Tag pages (reads from content files)
- GitHub API portfolio cards (separate data source)
- Author sidebar (static data)
- About page (static page)

### Features Requiring CMS Integration
- Blog posts (primary CMS focus)
- Publications listing (CMS collection needed)
- Talks listing (CMS collection needed)

### No Impact on Existing Functionality
The CMS adds a write interface but doesn't change how content is read/rendered. All existing Astro pages, components, and routing remain unchanged. Decap commits to Git → Astro rebuilds → site updates (same as manual editing).

## Sources

### Official Documentation
- [Decap CMS Overview](https://decapcms.org/docs/intro/)
- [Decap CMS Editor Features](https://decapcms.org/features/editor/)
- [Decap CMS Widgets](https://decapcms.org/docs/widgets/)
- [Decap CMS Editorial Workflows](https://decapcms.org/docs/editorial-workflows/)
- [Decap CMS Configuration Options](https://decapcms.org/docs/configuration-options/)
- [Decap CMS Collection Configuration](https://decapcms.org/docs/configure-decap-cms/)
- [Decap CMS Folder Collections](https://decapcms.org/docs/collection-folder/)
- [Decap CMS Custom Previews](https://decapcms.org/docs/customization/)
- [Astro + Decap CMS Guide](https://docs.astro.build/en/guides/cms/decap-cms/)
- [Netlify Identity Documentation](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/)
- [Decap CMS Git Gateway](https://decapcms.org/docs/git-gateway-backend/)

### Community Resources
- [Building a Blog CMS with Decap CMS](https://dasroot.net/posts/2026/01/building-blog-cms-decap-netlify-cms/)
- [Customizing Decap CMS Preview CSS](https://www.lucasyamamoto.com/customizing-the-css-of-your-preview-of-decap-cms)
- [How To Customize Live-Previews With DecapCMS](https://biralo.studio/2024/11/25/how-to-customize-live-previews-with-decapcms)
- [DecapCMS Review and Features - Bejamas](https://bejamas.com/hub/headless-cms/decapcms)

### CMS Best Practices
- [Content Editor UX: Why CMS Usability Is Tough](https://evolvingweb.com/blog/content-editor-ux-why-cms-usability-tough)
- [What Makes A Great Content Editor Experience?](https://www.dotcms.com/blog/what-makes-a-great-content-editor-experience)
- [Headless CMS Editing Experience Guide](https://www.netlify.com/guide-to-composable-architecture/content-editing/headless-editing-experiences/)

### Known Issues & Discussions
- [Netlify Identity deprecation discussion](https://github.com/decaporg/decap-cms/discussions/7419)
- [Media folder upload issues](https://github.com/netlify/netlify-cms/issues/2264)
- [Frontmatter field retention](https://github.com/decaporg/decap-cms/issues/1338)
- [Better rich text editor discussion](https://github.com/decaporg/decap-cms/discussions/6905)
