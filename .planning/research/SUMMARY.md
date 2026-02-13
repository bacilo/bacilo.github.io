# Project Research Summary

**Project:** Decap CMS Integration for Academic Website
**Domain:** Git-based headless CMS for static Astro site
**Researched:** 2026-02-13
**Confidence:** HIGH

## Executive Summary

Decap CMS can be integrated with the existing Astro academic website as a client-side admin interface for managing blog posts, publications, talks, and portfolio items. The research reveals a critical architectural decision: for a single-user site on GitHub Pages, the simplest and most maintainable approach is to use **Sveltia CMS (modern Decap successor) with Personal Access Token (PAT) authentication**, avoiding the complexity of OAuth proxy servers entirely.

The conflicting recommendations in research stem from different use cases. OAuth proxy patterns (Cloudflare Worker, Netlify Identity) are designed for multi-user scenarios where non-technical editors need web-based login. For a single-user academic site where the owner is the sole editor, PAT authentication eliminates server dependencies, reduces failure points, and works perfectly with static GitHub Pages hosting. Sveltia CMS provides a superior user experience to Decap CMS while maintaining 100% config compatibility.

Key risks include schema synchronization between Astro content collections and CMS configuration, legacy content frontmatter inconsistencies, and image upload path bugs with dynamic folders. These are all preventable through proper configuration and content normalization before CMS setup. The integration requires zero changes to the existing Astro site structure - CMS files are added to public/admin/ as static assets.

## Key Findings

### Recommended Stack

For a single-user GitHub Pages site, the optimal stack avoids all OAuth complexity by using built-in PAT authentication.

**Core technologies:**
- **Sveltia CMS 0.140.3**: Modern successor to Decap CMS with better UX, performance, and active development. 100% compatible with Decap CMS config but with PAT auth built-in for single users. No npm dependencies required - loaded via CDN.
- **Personal Access Token (PAT)**: Simplest GitHub authentication for single-user scenarios. No server component required, works with static GitHub Pages, built into Sveltia CMS. User generates token once, stores in browser localStorage.
- **Static file serving**: CMS admin interface served from public/admin/ as static HTML/JS files. No Astro SSR required, no adapters needed.

**Rejected alternatives:**
- Decap CMS with OAuth proxy (Cloudflare Worker): Unnecessary complexity for single user. Adds external dependency, deployment overhead, and additional failure points. Only appropriate for multi-user teams.
- Netlify Identity: Deprecated as of 2026, only works on Netlify hosting (not GitHub Pages).
- astro-decap-cms integrations: Require SSR mode, incompatible with static GitHub Pages hosting.

**Version requirements:**
- Sveltia CMS: Latest via CDN (currently 0.140.3)
- Astro: Remains at current version, no changes needed
- No additional npm packages required

### Expected Features

**Must have (table stakes):**
- Rich text markdown editor for blog posts and content body fields
- Edit capabilities for all four content types (posts, publications, talks, portfolio)
- Image upload with media library for content images
- Field validation to prevent missing required fields (title, date, etc.)
- GitHub authentication to prevent unauthorized edits

**Should have (competitive):**
- Collection configuration matching all existing frontmatter schemas exactly
- Media folder organized in public/images/uploads/ with static paths (avoiding dynamic path bugs)
- Preview pane showing content before publish (basic preview built into Sveltia)
- Support for optional fields without validation errors on empty values

**Defer (v2+):**
- Editorial workflow (draft/publish via PRs) - unnecessary complexity for single user, creates branch management overhead
- Custom preview templates matching site styling - high effort, default preview sufficient initially
- Custom widgets for specialized fields (DOI, citations) - manual editing acceptable initially
- Relation widgets for cross-referencing content - can add later if needed

**Critical anti-features (do NOT build):**
- Multi-user roles/permissions - single user only, adds unnecessary complexity
- Real-time collaboration - single author, not needed
- OAuth proxy infrastructure - PAT auth eliminates this entirely

### Architecture Approach

Decap/Sveltia CMS integrates as a client-side React SPA that commits directly to the GitHub repository via the GitHub API. The architecture consists of three independent layers: (1) static CMS admin interface in public/admin/, (2) existing Astro static site (unchanged), and (3) GitHub repository as content source of truth. With PAT authentication, no OAuth server component is required.

**Major components:**
1. **CMS Admin Interface** (public/admin/) - Static HTML + config.yml served by GitHub Pages, accessed at /admin route. User authenticates with GitHub PAT once, CMS uses token to make GitHub API calls.
2. **Content Collections** (src/content/) - Zero changes required. CMS commits markdown files to existing folders, Astro build process handles them identically to manual edits.
3. **GitHub Actions Build Pipeline** - Unchanged. CMS commits trigger existing deploy.yml workflow, Astro builds site, deploys to GitHub Pages.

**Critical architectural decisions:**
- Keep Astro fully static (output: 'static') - no SSR adapter needed
- Serve CMS as static files from public/admin/ - no build step for CMS itself
- Use PAT authentication - eliminates need for external OAuth server
- Configure media_folder with static paths - avoids dynamic path bugs
- Map CMS collections 1:1 to existing src/content/ folders - no content migration needed

**Data flow:**
1. User navigates to pedropaf.com/admin
2. Sveltia CMS loads (static React app)
3. User authenticates with GitHub PAT (stored in localStorage)
4. CMS fetches content from GitHub API using token
5. User edits content in CMS interface
6. CMS commits directly to master branch via GitHub API
7. GitHub Actions detects push, runs build, deploys to Pages (2-5 min to live)

### Critical Pitfalls

1. **Schema divergence between Astro and CMS** - Astro content collections use Zod schemas, CMS uses config.yml field definitions. These can silently drift apart, causing content created in CMS to fail Astro builds with cryptic Zod errors. Prevention: Establish schema sync workflow, update both configs together, add to PR checklist. Make Astro schema source of truth, manually translate to config.yml.

2. **Legacy content frontmatter inconsistencies** - Existing content has varied frontmatter (inconsistent fields, different date formats, missing fields). When CMS loads these files, it crashes, shows blank fields, or refuses to save edits. Prevention: Audit existing content structure BEFORE CMS setup, normalize all dates to ISO 8601, add missing required fields, standardize array formats. Make all CMS fields optional initially, selectively make required after normalization.

3. **Image upload path bugs with dynamic folders** - On first submission, images upload to wrong location when using templated paths like `{{slug}}/image.jpg`. Re-uploading fixes it but creates orphaned files. Prevention: Use static media_folder path without variables: `public/images/uploads` (not dynamic). Test image upload in new entry before rolling out to verify correct location.

4. **Required/optional field validation bugs** - Decap/Sveltia has known bugs where optional fields with validation patterns reject empty values, and required fields in optional objects are enforced even when parent is empty. Prevention: Remove validation patterns from optional fields, avoid nested required fields in optional objects, always check for both undefined and empty string in templates.

5. **Markdown widget rich text mode corruption** - Rich text mode corrupts content by splitting single-line frontmatter strings across multiple lines, adding unexpected backslashes, breaking lists. Prevention: Force raw markdown mode only with `modes: ['raw']` config, or educate editors to use raw mode exclusively.

## Implications for Roadmap

Based on research, the integration requires minimal changes to existing codebase and follows a clear dependency order. The single-user PAT approach eliminates an entire phase of OAuth infrastructure setup.

### Suggested Phase Structure (3 Phases)

### Phase 1: Content Audit & CMS Setup
**Rationale:** Must normalize legacy content before CMS can load it reliably. CMS configuration depends on understanding existing content structure.

**Delivers:**
- Audit of existing frontmatter schemas across all content types
- Normalized content (consistent date formats, no missing required fields)
- public/admin/index.html with Sveltia CMS loaded via CDN
- public/admin/config.yml with GitHub backend and PAT auth configured
- Initial collection for blog posts only (test before expanding)

**Addresses features:**
- GitHub authentication (PAT method)
- Rich text editor setup
- Field validation configuration

**Avoids pitfalls:**
- Legacy content mismatch (Pitfall 2) - audit catches issues early
- Schema divergence (Pitfall 1) - establish sync process from start
- Image path bugs (Pitfall 3) - configure static media folder correctly

**Research needs:** MINIMAL - well-documented pattern, standard configuration

### Phase 2: Complete Content Coverage
**Rationale:** After proving CMS works with blog posts, expand to remaining content types. Each collection requires careful frontmatter mapping.

**Delivers:**
- Publications collection with venue, paperurl, citation fields
- Talks collection with event, location, type fields
- Portfolio collection with image, URL fields
- Media library configuration (public/images/uploads/)
- Image upload testing across all collections

**Uses stack elements:**
- Sveltia CMS collection configuration
- GitHub API for commits across all content types
- Existing Astro content collection schemas as source of truth

**Implements architecture:**
- Complete CMS-to-content-collections mapping
- Media folder integration with existing image assets

**Avoids pitfalls:**
- Required/optional validation bugs (Pitfall 4) - careful field config
- Markdown corruption (Pitfall 5) - raw mode enforcement

**Research needs:** MINIMAL - repeats Phase 1 pattern for additional collections

### Phase 3: Documentation & Testing
**Rationale:** CMS is functional after Phase 2, but needs validation and editor documentation to be production-ready.

**Delivers:**
- End-to-end testing: create content in each collection, verify build passes
- Cross-browser testing (Safari, Firefox, Chrome)
- Schema alignment verification (CMS content builds without Zod errors)
- Editor documentation (how to use PAT auth, field requirements, markdown mode)
- Backup/recovery validation (verify Git history contains all CMS commits)

**Addresses:**
- All pitfalls validated in real usage
- Editor UX documented
- Recovery strategies tested

**Research needs:** NONE - testing and documentation phase

### Phase Ordering Rationale

- **PAT eliminates OAuth phase entirely:** Traditional multi-user setup requires Phase 1 for OAuth infrastructure (Cloudflare Worker deployment, GitHub OAuth app setup, testing auth flow). Single-user PAT approach skips this, starting directly with CMS configuration.
- **Content audit first prevents rework:** Attempting CMS setup with inconsistent legacy content causes immediate failures. Normalizing content upfront means CMS "just works" on first try.
- **Incremental collection rollout reduces risk:** Starting with blog posts only (Phase 1) allows testing and refinement before expanding. Issues caught early don't affect other collections.
- **Testing as separate phase ensures production-readiness:** Functional CMS != production-ready CMS. Dedicated testing phase catches cross-browser issues, schema drift, and edge cases.

### Research Flags

**Phases with standard patterns (skip /gsd:research-phase):**
- **Phase 1:** Well-documented Sveltia setup, extensive examples in official docs and community
- **Phase 2:** Repetitive collection configuration following established pattern
- **Phase 3:** Testing and documentation, no research needed

**No phases need deeper research.** All patterns are well-established with official documentation and high-confidence community examples.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | PAT authentication officially supported by Sveltia CMS, verified in GitHub releases and documentation. GitHub Pages static hosting confirmed compatible. |
| Features | HIGH | All required features are table stakes for Git-based CMS, confirmed in official Decap/Sveltia feature docs. Anti-features validated through pitfall research. |
| Architecture | HIGH | Architecture verified through official Astro + Decap guides, Sveltia documentation, and multiple working community examples. Static file pattern proven on GitHub Pages. |
| Pitfalls | MEDIUM to HIGH | Critical pitfalls documented in GitHub issues with confirmed reproduction. Schema divergence and legacy content issues validated through multiple sources. Image upload bug officially tracked. |

**Overall confidence:** HIGH

The single-user PAT approach is well-documented and battle-tested. It's explicitly recommended by Sveltia CMS documentation for single-user scenarios and eliminates the most complex part of traditional Decap setups (OAuth proxies). The main risks are operational (schema sync, content normalization) rather than technical unknowns.

### Gaps to Address

**OAuth vs. PAT decision documentation:**
- Research showed conflicting patterns because sources assume different use cases (multi-user vs. single-user)
- For this specific project (single academic user, GitHub Pages hosting), PAT is unambiguously superior
- If future requirement emerges for multiple editors, migration path exists: deploy OAuth proxy, switch backend config, same content structure

**Testing with actual legacy content:**
- Research identified potential frontmatter inconsistencies but cannot predict exact issues without auditing actual files
- Phase 1 must include comprehensive audit script or manual review of existing posts/publications/talks
- Consider writing migration script to batch-normalize content if issues are widespread

**Astro content collection schema validation:**
- Research assumes Astro content collections use Zod schemas, but actual project may have different validation approach
- Phase 1 should verify how existing content validation works and document sync process accordingly
- If no Astro schema exists, CMS config.yml becomes the de facto schema definition

**Image optimization strategy:**
- CMS uploads to public/images/uploads/ which bypasses Astro's image optimization
- Research notes this tradeoff but doesn't provide solution for optimized images
- May need separate image processing step or external image host (Cloudinary) for production
- Defer optimization to post-CMS milestone if file sizes acceptable

## Authentication Recommendation: PAT, Not OAuth

### Reconciling Conflicting Research

**STACK.md recommendation:** Personal Access Token (PAT) with Sveltia CMS - simplest for single user, no server needed

**ARCHITECTURE.md recommendation:** OAuth proxy (Cloudflare Worker) with Decap CMS - standard pattern for multi-user scenarios

**Why the conflict:** Research sources show both patterns because they serve different use cases. Multi-user teams (the common case in tutorials and guides) require OAuth for better UX and security. Single-user scenarios (like academic sites) have a simpler path.

**Resolution for this project:** Use PAT authentication with Sveltia CMS.

**Rationale:**
1. **Single user requirement:** Site has one editor (the owner). OAuth's complexity is designed for teams with multiple non-technical editors.
2. **GitHub Pages constraint:** OAuth proxy requires separate deployment (Cloudflare Worker, Vercel Function). This adds hosting dependency, deployment overhead, and potential failure point.
3. **Security equivalence:** PAT provides same GitHub API access as OAuth token. Both require HTTPS, both stored in browser localStorage, both can be revoked.
4. **Maintenance burden:** OAuth approach requires managing GitHub OAuth app credentials, monitoring proxy uptime, debugging CORS issues. PAT requires generating one token.
5. **Sveltia advantage:** Built-in PAT support with polished UX. User clicks "Use Personal Access Token," pastes token, done. Decap CMS can use PAT too, but Sveltia optimizes for this workflow.

**When to use OAuth instead:**
- Multiple editors need access
- Non-technical users who can't generate GitHub tokens
- Team workflow where token management is centralized
- Already deploying serverless functions for other purposes

**Migration path if needs change:** If future requirement emerges for multiple users, the migration is straightforward: deploy OAuth proxy, update base_url in config.yml, existing content and config structure unchanged. The decision is reversible.

## Sources

### Primary Sources (HIGH confidence)
- [Sveltia CMS Official Repository](https://github.com/sveltia/sveltia-cms) - Version verification, PAT authentication documentation, feature comparison with Decap
- [Sveltia CMS PAT Authentication Discussion](https://github.com/sveltia/sveltia-cms/discussions/218) - Single-user PAT workflow, official recommendation
- [Decap CMS Official Documentation](https://decapcms.org/docs/intro/) - Architecture patterns, configuration options, collection schemas
- [Decap CMS GitHub Backend Docs](https://decapcms.org/docs/github-backend/) - Backend configuration, authentication methods
- [Astro + Decap CMS Official Guide](https://docs.astro.build/en/guides/cms/decap-cms/) - Integration patterns, content collection mapping
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/) - Schema definition, validation approach

### Secondary Sources (MEDIUM confidence)
- [Decap CMS Issue #4218: Image upload path bug](https://github.com/decaporg/decap-cms/issues/4218) - First-submission image location issue
- [Decap CMS Issue #315: Optional field validation](https://github.com/decaporg/decap-cms/issues/315) - Required/optional field bugs
- [Decap CMS Issue #6444: Markdown widget corruption](https://github.com/decaporg/decap-cms/issues/6444) - Rich text mode frontmatter splitting
- [Hugo CMS Setup Journey on GitHub Pages](https://0deepresearch.com/posts/2025-05-08-hugo-cms-setup-journey-decap-cms-sveltia-cms-on-github-pages/) - Real-world static site PAT setup, single-user pattern validation
- [Netlify Identity Deprecation Discussion](https://github.com/decaporg/decap-cms/discussions/7419) - Confirms Netlify Identity deprecated 2026

### Tertiary Sources (flagged for validation)
- Community blog posts on Decap CMS setup - Various implementation patterns, need validation against official docs
- Third-party integration packages (astro-decap-cms, etc.) - Confirmed SSR requirement, incompatible with GitHub Pages

---
*Research completed: 2026-02-13*
*Ready for roadmap: Yes*
*Recommended approach: Sveltia CMS with PAT authentication (3-phase roadmap)*
