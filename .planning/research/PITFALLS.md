# Pitfalls Research: Adding Decap CMS to Existing Astro Site

**Domain:** CMS Integration (Decap CMS + Astro + GitHub Pages + Netlify Identity)
**Researched:** 2026-02-13
**Confidence:** MEDIUM

**Context:** This research focuses on adding Decap CMS to an EXISTING Astro site with established content collections, using GitHub Pages for hosting and Netlify Identity for authentication. Pitfalls are specific to this integration pattern, not greenfield CMS setup.

---

## Critical Pitfalls

### Pitfall 1: GitHub Pages + Netlify Identity OAuth Mismatch

**What goes wrong:**
Netlify Identity requires a server-side OAuth endpoint, but GitHub Pages only serves static files. Attempting to use Netlify's Identity Widget with GitHub Pages results in "Unable to access identity settings" errors. Invitation links send users to incorrect subdomains, and the authentication flow breaks completely.

**Why it happens:**
Developers assume that because Netlify provides Identity as a service, it "just works" everywhere. The documentation often shows Netlify-hosted examples, obscuring the requirement for OAuth callback routes that GitHub Pages cannot provide.

**How to avoid:**
Deploy an external OAuth server BEFORE attempting authentication setup. Options:
- **Cloudflare Workers** (lightweight, free tier sufficient)
- **Vercel Serverless Functions** (if already using Vercel)
- **Astro API routes with adapter** (requires moving admin routes to SSR-enabled environment)

Configure `base_url` in Decap's config.yml to point to your OAuth server endpoint, NOT to your GitHub Pages URL.

**Warning signs:**
- Testing authentication shows redirect to `api.netlify.com` instead of your OAuth endpoint
- Browser console shows CORS errors during login
- Identity Widget loads but login button does nothing
- Error messages mention "Unable to access identity settings"

**Phase to address:**
**Phase 1: Authentication Infrastructure** - Must be completed BEFORE CMS configuration. Cannot be retrofitted easily.

**Sources:**
- [Decap CMS External OAuth Clients](https://decapcms.org/docs/external-oauth-clients/) — MEDIUM confidence
- [GitHub Issue #3164: Unable to access identity settings](https://github.com/netlify/netlify-cms/issues/3164) — HIGH confidence
- [Netlify Identity Documentation](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/) — HIGH confidence

---

### Pitfall 2: Image Upload Path on First Submission

**What goes wrong:**
When creating new content with an image field, the image uploads to the root `media_folder` on first submission instead of the field-level `media_folder` path. The frontmatter contains the correct path, but the actual file ends up in the wrong location. Re-uploading fixes it, but this creates confusion and orphaned files.

**Why it happens:**
Decap CMS evaluates templated media paths (like `media_folder: "{{media_folder}}/{{slug}}"`) only after the entry file exists. On first submission, the entry doesn't exist yet, so the CMS uses a temporary dummy path. The path re-evaluation happens before saving the frontmatter, but the file has already been uploaded to the wrong location.

**How to avoid:**
Strategy 1 (Recommended): Use static, non-templated media_folder paths:
```yaml
media_folder: "images/uploads"  # No dynamic variables
public_folder: "/images/uploads"
```

Strategy 2: Use collection-level media_folder with relative paths:
```yaml
collections:
  - name: "posts"
    folder: "_posts"
    media_folder: ""  # Same directory as entry
    public_folder: ""
```

Strategy 3: Document the workaround - editors must re-upload images after initial save.

**Warning signs:**
- Images appear in wrong folders after first submission
- Orphaned image files accumulate in root media folder
- Markdown image paths are correct but images 404 on site
- Re-uploading the same image fixes the problem

**Phase to address:**
**Phase 2: CMS Configuration** - Set media_folder strategy during initial config.yml creation. Changing later requires migrating existing images.

**Recovery cost:** MEDIUM — Requires manual file moves or script to relocate images to match frontmatter paths.

**Sources:**
- [Decap CMS Issue #4218: Image uploaded to wrong location on first submission](https://github.com/decaporg/decap-cms/issues/4218) — HIGH confidence
- [Decap CMS Issue #5444: Incorrect path stored in front matter with dynamic media_folder](https://github.com/decaporg/decap-cms/issues/5444) — HIGH confidence

---

### Pitfall 3: Astro Content Collections Schema vs. Decap CMS Schema Divergence

**What goes wrong:**
Astro content collections use Zod schemas for type validation. Decap CMS uses its own field schema in config.yml. These two schemas can silently drift apart: Astro requires a field that Decap marks optional, or vice versa. Content created through the CMS passes Decap validation but fails Astro's build with cryptic Zod errors.

**Why it happens:**
Two separate schema definitions for the same content, with no automatic sync. Developers update one without updating the other. Astro's schema is TypeScript/Zod (in `src/content/config.ts`), while Decap's is YAML (in `public/admin/config.yml`).

**How to avoid:**
Establish a "single source of truth" workflow:

**Option A:** Astro schema as source of truth
1. Define content schema in `src/content/config.ts` first
2. Manually translate to Decap config.yml
3. Add to PR checklist: "If content schema changes, update config.yml"

**Option B:** Automated validation (advanced)
1. Write a script that compares both schemas
2. Run as pre-commit hook or CI check
3. Block commits if schemas diverge

**Critical rules:**
- If Astro field is required → Decap field must have `required: true`
- If Decap field is optional → Astro field must be `.optional()` in Zod
- Default values must match exactly
- Date formats must align (Astro uses ISO 8601, ensure Decap widget uses same)

**Warning signs:**
- Build works locally but fails in CI after CMS content creation
- Zod validation errors mentioning missing required fields
- Content saves successfully in CMS but doesn't appear on site
- TypeScript errors when querying collections

**Phase to address:**
**Phase 2: CMS Configuration** - Establish schema sync process during initial setup.
**Phase 4: Testing** - Verify schema alignment with end-to-end tests.

**Sources:**
- [Astro Content Collections Documentation](https://docs.astro.build/en/guides/content-collections/) — HIGH confidence
- [How to Use Astro Content Collections](https://astrocourse.dev/blog/how-to-use-content-collections/) — MEDIUM confidence

---

### Pitfall 4: Legacy Content Schema Mismatch

**What goes wrong:**
Existing content files have varied frontmatter structure (inconsistent fields, different date formats, missing required fields). When Decap CMS loads these files, it either crashes, shows blank fields where data exists, or refuses to save edits. Legacy content that worked perfectly in Astro becomes uneditable through the CMS.

**Why it happens:**
Decap CMS expects uniform frontmatter matching its config.yml schema. Legacy content written manually or generated by scripts doesn't conform. For example:
- Old posts use `tags: ["tag1", "tag2"]`, new CMS expects `tags: tag1, tag2`
- Some publications have `paperurl`, others don't (but Decap requires it)
- Date formats vary: `2008-01-01` vs `2008-01-01T00:00:00Z`

**How to avoid:**
**Before adding CMS:**
1. Audit existing content structure:
```bash
# Find all unique frontmatter keys
find _posts _publications _talks -name "*.md" -exec grep -h "^[a-z].*:" {} \; | sort | uniq
```

2. Normalize legacy content to match planned CMS schema:
   - Convert all dates to consistent format
   - Add missing required fields with sensible defaults
   - Standardize array formats
   - Fix inconsistent field naming

3. Make ALL fields optional in initial CMS config, then selectively make them required after content audit.

**Warning signs:**
- CMS shows "Error loading entry" for existing posts
- Field values don't appear in CMS editor (data exists in file)
- Editing old content through CMS wipes out existing fields
- Save fails with validation errors on untouched legacy content

**Phase to address:**
**Phase 1: Content Audit & Normalization** - Complete BEFORE CMS configuration.
**Phase 2: CMS Configuration** - Design schema to match normalized content.

**Recovery cost:** HIGH — Requires manual review of each broken entry or complex migration script.

**Sources:**
- [Decap CMS Issue #658: Error loading existing content](https://github.com/decaporg/decap-cms/issues/658) — HIGH confidence
- [Decap CMS Issue #1813: Schema and data migrations](https://github.com/decaporg/decap-cms/issues/1813) — HIGH confidence

---

### Pitfall 5: Required vs. Optional Field Validation Bugs

**What goes wrong:**
Decap CMS has documented bugs around required/optional field validation:
1. Fields marked `required: false` with validation patterns reject empty values
2. Required fields inside optional objects are enforced even when parent object is empty
3. Optional fields that are left blank sometimes return `undefined`, sometimes empty string, causing inconsistent handling

**Why it happens:**
Known bugs in Decap CMS validation logic. The CMS attempts to validate empty optional fields instead of skipping validation when the field is blank.

**How to avoid:**
Workarounds until Decap fixes upstream:

**For optional fields with patterns:**
```yaml
# BAD - will reject empty values
- {label: "Phone", name: "phone", widget: "string", required: false, pattern: ['^\d{3}-\d{4}$', 'Format: 123-4567']}

# GOOD - remove pattern from optional fields
- {label: "Phone", name: "phone", widget: "string", required: false}
```

**For required fields in optional objects:**
- Avoid this pattern entirely
- Flatten structure or make parent object required

**For consistent empty handling:**
- Always check for both `undefined` and empty string in templates
- Use default values in Astro queries:
```typescript
const phone = entry.data.phone || 'N/A';
```

**Warning signs:**
- Validation errors on empty optional fields
- Can't save entries when optional fields are left blank
- Template rendering breaks when optional fields missing
- Inconsistent data types for same field across entries

**Phase to address:**
**Phase 2: CMS Configuration** - Design schema avoiding known bug patterns.
**Phase 3: Template Updates** - Add defensive checks for optional fields.

**Sources:**
- [Decap CMS Issue #315: Fields marked optional are still required](https://github.com/decaporg/decap-cms/issues/315) — HIGH confidence
- [Decap CMS Issue #1175: Don't validate optional field if empty](https://github.com/decaporg/decap-cms/issues/1175) — HIGH confidence
- [Decap CMS Issue #2790: Optional object and required field widgets](https://github.com/decaporg/decap-cms/issues/2790) — HIGH confidence

---

### Pitfall 6: Markdown Widget Rich Text Mode Corrupts Frontmatter

**What goes wrong:**
The markdown widget's "rich text" mode (WYSIWYG editor) corrupts content in several ways:
- Single-line strings in frontmatter split across multiple lines unexpectedly
- Headers followed by newlines render incorrectly (backslash treated as part of header)
- Lists don't work correctly
- Pasting HTML produces empty blocks
- Switching between "rich text" and "raw" modes alters formatting

**Why it happens:**
Rich text editor uses different markdown parsing/serialization than raw mode. The editor tries to be "helpful" by reformatting content, but this introduces inconsistencies. String widgets in frontmatter aren't designed for multi-line handling, so long titles wrap incorrectly.

**How to avoid:**
**Recommended:** Force raw markdown mode only:
```yaml
- label: "Body"
  name: "body"
  widget: "markdown"
  modes: ['raw']  # Disable rich text mode entirely
```

**Alternative:** Educate editors about mode limitations:
- Use raw mode for precise control
- Avoid rich text mode for content with complex formatting
- Never paste HTML directly into rich text mode

**For frontmatter strings:** Use text widget instead of markdown:
```yaml
- {label: "Title", name: "title", widget: "string"}  # Not markdown
```

**Warning signs:**
- Titles appearing on multiple lines in saved files
- Headers rendering with unexpected backslashes
- Lists appearing as plain text with asterisks
- Pasted content disappears after save
- Content looks different after switching modes

**Phase to address:**
**Phase 2: CMS Configuration** - Configure markdown widget modes during setup.
**Phase 5: Documentation** - Editor guidelines for markdown authoring.

**Sources:**
- [Decap CMS Issue #6444: String widget text splitting over 2 lines in error](https://github.com/decaporg/decap-cms/issues/6444) — HIGH confidence
- [Decap CMS Issue #7501: Newline not behaving correctly with Headers](https://github.com/decaporg/decap-cms/issues/7501) — HIGH confidence
- [Decap CMS Issue #3437: HTML pasting issues in markdown widget](https://github.com/decaporg/decap-cms/issues/3437) — HIGH confidence

---

### Pitfall 7: Editorial Workflow Branch Conflicts with Manual Commits

**What goes wrong:**
Editorial workflow creates branches like `cms/posts/my-new-post` and opens PRs. If developers make manual commits to these CMS-created branches, the CMS gets confused. Worse, if developers merge PRs manually (instead of clicking "Publish" in CMS), the CMS still shows entries as drafts. Content exists on site but CMS status is wrong.

**Why it happens:**
Decap CMS tracks editorial workflow state through PR metadata and branch names. Manual Git operations bypass this tracking. The CMS expects complete control over its branches and merge process.

**How to avoid:**
**Rule 1:** Never manually commit to `cms/*` branches
**Rule 2:** Never manually merge CMS-created PRs — always use CMS "Publish" button
**Rule 3:** If editorial workflow is enabled, establish clear ownership:
- Content editors use CMS exclusively
- Developers work on separate branches for code changes
- Never mix CMS content changes with code changes in same PR

**For teams mixing CMS and manual content:**
- Disable editorial workflow (`publish_mode: simple`)
- Accept that CMS commits directly to main branch
- Use conventional Git workflow for developer changes

**Warning signs:**
- CMS shows "Draft" status for content that's already published
- "Publish" button fails with merge conflict errors
- CMS-created PRs show additional commits from other authors
- Editorial workflow statuses out of sync with actual PR state

**Phase to address:**
**Phase 2: CMS Configuration** - Decide editorial workflow strategy (enable or disable).
**Phase 5: Documentation** - Team workflow guidelines.

**Recovery cost:** LOW to MEDIUM — Delete orphaned branches, manually update content status in CMS.

**Sources:**
- [Decap CMS Editorial Workflow Documentation](https://decapcms.org/docs/editorial-workflows/) — HIGH confidence
- [Decap CMS Issue #7457: Stuck on old commit / changes not shown](https://github.com/decaporg/decap-cms/issues/7457) — MEDIUM confidence

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using CDN script instead of npm package | Faster initial setup, no build step | No version control, cache issues, harder to customize | Never for production. Acceptable for rapid prototyping only. |
| Making all fields optional to avoid legacy content issues | CMS loads all content immediately | Content quality degrades, missing critical fields, type safety lost | Only during initial migration phase. Make fields required after normalization. |
| Disabling editorial workflow due to complexity | Simple commit flow, no branch management | No review process, mistakes go directly to production | Acceptable for single-editor sites. Never for teams. |
| Using static OAuth server from GitHub template | Quick authentication setup | Security vulnerabilities if not updated, dependency on unmaintained code | Only for personal sites. Never for client work. |
| Skipping Astro schema sync with CMS config | Faster iteration on CMS config | Silent build failures, content inconsistency | Never acceptable. Always sync schemas. |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Netlify Identity Widget | Adding widget globally across site | Set `disableIdentityWidgetInjection: true` and load only on /admin route to avoid performance impact |
| OAuth Callback URLs | Using GitHub Pages URL as base_url | Use external OAuth server URL as base_url (Cloudflare Worker, Vercel, etc.) |
| Media Folder Configuration | Using dynamic paths with slugs | Use static paths or test thoroughly with first-submission workaround documented |
| Date Formats | Mixing ISO 8601 with other formats | Standardize on ISO 8601 (`2024-01-01T00:00:00Z`) across Astro schema, Decap widget, and legacy content |
| Branch Configuration | Setting custom branch in config.yml with editorial workflow | Editorial workflow may not respect branch setting with Git Gateway ([Issue #2502](https://github.com/decaporg/decap-cms/issues/2502)) — verify behavior |
| Local Development | Running CMS locally with `local_backend: true` | Editorial workflow NOT supported in local backend — connect to real Git provider for testing workflows |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading Identity Widget globally | Slow page loads, extra network requests on every page | Inject widget only on /admin route using `disableIdentityWidgetInjection: true` | Immediately on all page loads |
| Large image uploads without optimization | CMS hangs during upload, Git repo bloats | Configure max file size, add image optimization pipeline, use external image host for large files | When image >5MB or repo >100MB |
| Collection with 100+ entries | CMS admin slow to load, list view laggy | Use pagination, split into multiple collections by year/category | At ~100-200 entries depending on frontmatter complexity |
| Deep nested object widgets | UI becomes unusable, saving times out | Flatten structure, use multiple collections instead of deep nesting | At 3-4 levels of nesting |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing OAuth client secret in frontend config | Anyone can authenticate as your app, modify content | Always keep secrets server-side in OAuth endpoint, never in config.yml |
| Allowing public GitHub account registration through Identity | Spam accounts, unauthorized content modification | Use invite-only registration, manually approve users in Netlify dashboard |
| Using HTTP instead of HTTPS for OAuth | Credentials intercepted, account takeover | Netlify Identity REQUIRES HTTPS — ensure custom domain has valid SSL |
| Storing sensitive data in CMS-managed content | Secrets committed to public repo | Never store API keys, passwords in CMS content — use environment variables |
| Not setting CORS properly on OAuth server | Authentication fails, or too permissive (allows any origin) | Restrict CORS to specific GitHub Pages domain |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No confirmation on publish | Content goes live immediately, mistakes published instantly | Enable editorial workflow for review step, or add "Are you sure?" docs |
| Unclear error messages on validation | "Validation failed" with no specifics — editor doesn't know what's wrong | Add `hint` to each field in config.yml explaining format requirements |
| CMS doesn't reflect live site structure | Editor creates content in `/posts/` but site shows it at `/blog/` | Match collection folder structure to site URL structure, document permalink patterns |
| Image preview shows wrong size | Image looks good in CMS but crops badly on site | Document expected image dimensions in field hints, add preview templates |
| No draft preview | Can't see content before publishing | Set up deploy previews linked to CMS branches (Netlify, Vercel) |

---

## "Looks Done But Isn't" Checklist

- [ ] **OAuth Setup:** Tested with REAL GitHub account, not just local development — verify login flow end-to-end
- [ ] **Media Uploads:** Uploaded test image in NEW entry, verified file location matches expectation — check for first-submission bug
- [ ] **Legacy Content:** Opened at least 5 existing posts in CMS editor, verified all fields load correctly — test before announcing to editors
- [ ] **Schema Alignment:** Built site with CMS-created content, no Zod validation errors — run full build as CI check
- [ ] **Editorial Workflow:** If enabled, tested full Draft → Review → Publish cycle, verified branch cleanup — don't assume it works
- [ ] **Cross-browser:** Tested CMS admin in Safari, Firefox, Chrome — not just development browser
- [ ] **Mobile Admin:** Attempted to use CMS on tablet/phone — many editors work on mobile
- [ ] **HTTPS on Custom Domain:** Identity auth tested on actual production domain, not localhost — HTTPS requirement only applies to production
- [ ] **Backup Strategy:** Verified GitHub commits contain all CMS changes, tested restoration from Git history — CMS is not a database
- [ ] **Date Handling:** Created content with dates in past, future, and present, verified site builds correctly handle all cases — timezone issues common

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| OAuth misconfigured, Identity broken | LOW | 1. Fix OAuth endpoints in config.yml 2. Clear browser cache 3. Test login again — no data loss |
| Images in wrong folders | MEDIUM | 1. Audit frontmatter paths vs. actual file locations 2. Write script to move files or update frontmatter 3. Re-commit corrected state |
| CMS schema breaks existing content | HIGH | 1. Revert config.yml to last working state 2. Audit content structure 3. Normalize content OR adjust schema to match content 4. Careful re-deployment |
| Editorial workflow branches out of sync | MEDIUM | 1. Close stale PRs in GitHub 2. Refresh CMS admin 3. Re-create drafts if needed — CMS will resync state |
| Decap config breaks Astro build | LOW | 1. CMS config doesn't affect build — issue is content 2. Find problematic content file 3. Fix frontmatter or remove file temporarily |
| Identity users locked out | MEDIUM | 1. Check Netlify Identity dashboard 2. Resend invites 3. Verify custom domain HTTPS 4. Check OAuth provider settings |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| OAuth Mismatch (Pitfall 1) | Phase 1: Auth Infrastructure | Successfully login to /admin from production URL |
| Image Upload Paths (Pitfall 2) | Phase 2: CMS Configuration | Create test post with image, verify file in correct folder |
| Schema Divergence (Pitfall 3) | Phase 2: CMS Configuration + Phase 4: Testing | CI build passes with CMS-created content |
| Legacy Content Mismatch (Pitfall 4) | Phase 1: Content Audit | Load 10 random existing posts in CMS without errors |
| Required/Optional Bugs (Pitfall 5) | Phase 2: CMS Configuration | Save entries with blank optional fields without validation errors |
| Markdown Corruption (Pitfall 6) | Phase 2: CMS Configuration | Content created in CMS renders identically to manual markdown |
| Editorial Workflow Conflicts (Pitfall 7) | Phase 2: CMS Configuration + Phase 5: Documentation | Complete draft→publish cycle, branch auto-deleted after merge |

---

## Astro-Specific Considerations

### SSR vs. SSG for Admin Route

**Issue:** Astro defaults to SSG (static site generation). Decap CMS admin dashboard is a React SPA that needs to be served as a static HTML page, but OAuth callback routes need server-side logic.

**Solution:**
- Keep admin dashboard static: `src/pages/admin.astro` → builds to `/admin/index.html`
- Use Astro adapter (Node, Vercel, Cloudflare) for OAuth routes: `src/pages/oauth/callback.ts`
- OR deploy OAuth routes separately (Cloudflare Worker, external service)

**Warning:** Don't enable adapter globally just for CMS unless you need SSR elsewhere. Maintain SSG for content pages.

---

### Content Collections Auto-Import

**Issue:** Astro's content collections use `src/content/`, but some legacy sites use `_posts/`, `_publications/` in root. Decap CMS writes to these folders, but Astro doesn't auto-import them.

**Solution:**
- Migrate content to `src/content/` BEFORE adding CMS
- Update Decap config.yml to write to `src/content/posts/`, etc.
- Adjust `.gitignore` if content is in `src/` (Astro content should be committed)

**Warning sign:** CMS saves successfully but new content doesn't appear in `getCollection()` queries.

---

### Astro Image Optimization

**Issue:** Astro's `<Image>` component requires images in `src/` or imported, but CMS uploads to `public/`. Images work but don't get optimized.

**Solution:**
- Configure CMS media_folder to `src/assets/uploads/` instead of `public/`
- Update public_folder to match
- Import images in collection schema or use glob imports

**Tradeoff:** Requires Astro build for every image upload. Consider external image host (Cloudinary, ImageKit) for high-volume image sites.

---

## Sources

### High Confidence Sources (Official Documentation & Direct Issues)
- [Astro Decap CMS Integration Guide](https://docs.astro.build/en/guides/cms/decap-cms/)
- [Decap CMS Configuration Options](https://decapcms.org/docs/configuration-options/)
- [Decap CMS External OAuth Clients](https://decapcms.org/docs/external-oauth-clients/)
- [Netlify Identity Documentation](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/)
- [Decap CMS Editorial Workflow](https://decapcms.org/docs/editorial-workflows/)
- [Astro Content Collections Documentation](https://docs.astro.build/en/guides/content-collections/)
- [Decap CMS Issue #4218: Image uploaded to wrong location](https://github.com/decaporg/decap-cms/issues/4218)
- [Decap CMS Issue #3164: Unable to access identity settings](https://github.com/netlify/netlify-cms/issues/3164)
- [Decap CMS Issue #315: Fields marked optional are still required](https://github.com/decaporg/decap-cms/issues/315)

### Medium Confidence Sources (Community Examples & Guides)
- [Simplifying Content Management on Astro with DecapCMS](https://nipunh.com/blog/modify-static-site-content-easily-from-your-browser/)
- [Just 3 Steps: Adding Netlify CMS to GitHub Pages](https://cnly.github.io/2018/04/14/just-3-steps-adding-netlify-cms-to-existing-github-pages-site-within-10-minutes.html)
- [How to Use Astro Content Collections](https://astrocourse.dev/blog/how-to-use-content-collections/)

### Low Confidence Sources (Unverified Community Reports)
- Various GitHub discussions and Stack Overflow threads referenced but not directly linked

---

*Pitfalls research for: Adding Decap CMS to Existing Astro Site (GitHub Pages + Netlify Identity)*
*Researched: 2026-02-13*
*Context: Subsequent milestone to existing v1.0 site with established content collections*
