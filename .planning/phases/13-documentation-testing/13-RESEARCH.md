# Phase 13: Documentation & Testing - Research

**Researched:** 2026-02-13
**Domain:** CMS Production Readiness & User Documentation
**Confidence:** MEDIUM-HIGH

## Summary

Phase 13 finalizes the CMS implementation through comprehensive testing and user documentation. This phase differs from typical feature development—it's about validating the entire system end-to-end and creating documentation that enables the user to work confidently with the CMS.

The research reveals two distinct workstreams: (1) **Production Readiness Testing** validating the CMS works correctly across browsers, commits properly to Git, and integrates seamlessly with Astro's build pipeline, and (2) **User Documentation** providing clear guidance on authentication setup, field requirements, and markdown editing workflows.

**Primary recommendation:** Use structured manual testing checklists for browser compatibility and workflow validation, complemented by automated Astro build validation. Create task-oriented user documentation focusing on three scenarios: first-time setup (PAT authentication), daily editing workflows, and troubleshooting common issues.

## Standard Stack

### Core Testing Tools (Existing)

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| npm scripts | - | Manual test orchestration | Simple, no dependencies, sufficient for manual testing |
| Astro build | 5.0+ | Schema validation & build verification | Already integrated, provides Zod validation via content.config.ts |
| gray-matter | 4.0.3 | Frontmatter validation (existing audit script) | Already used in scripts/audit-frontmatter.mjs for pre-build validation |
| Browser DevTools | Native | Cross-browser testing & debugging | Built into Chrome/Firefox/Safari, no installation needed |

### Documentation Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| Markdown | User documentation | Standard format, renders on GitHub, easy to maintain |
| Screenshots | Visual guides | Authentication flows, CMS UI navigation |
| Mermaid diagrams | Workflow visualization | Optional - for complex multi-step processes |

### Testing Tools NOT Needed

| Tool | Why Not Needed |
|------|----------------|
| Playwright/Cypress | Overkill for single-user CMS with 6 manual test scenarios |
| Jest/Vitest | No custom JavaScript to unit test - CMS is static config |
| Lighthouse CI | Performance already validated in Phase 10, CMS adds no custom code |

**Installation:**
```bash
# No new dependencies required - all testing uses existing tools
npm run build  # Validates schemas via Astro's Zod integration
node scripts/audit-frontmatter.mjs  # Pre-build frontmatter validation
```

## Architecture Patterns

### Testing Pattern: Manual Checklist + Automated Validation

**Structure:**
```
.planning/phases/13-documentation-testing/
├── 13-RESEARCH.md                  # This file
├── 13-01-PLAN.md                   # Testing checklist + documentation tasks
├── TEST-CHECKLIST.md               # Reusable manual testing checklist
└── CMS-USER-GUIDE.md               # User-facing documentation
```

**Pattern 1: Browser Compatibility Testing (Manual)**

Cross-browser testing for web applications in 2026 requires validating: layout consistency, form submission, JavaScript functionality, responsive design, and navigation across Chrome, Firefox, and Safari.

**What:** Test CMS UI and workflows in 3 major browsers
**When to use:** Once, before declaring production-ready
**Checklist format:**
```markdown
## Browser: [Chrome/Firefox/Safari]

- [ ] CMS loads at /admin without console errors
- [ ] GitHub PAT authentication succeeds
- [ ] Create new content in all 4 collections
- [ ] Edit existing content (verify fields populate)
- [ ] Delete test content
- [ ] Upload image to media library
- [ ] Insert image into markdown body
- [ ] Logout/login (verify session persistence)
```

**Pattern 2: End-to-End Workflow Validation**

Per Sveltia CMS documentation: "Use the Local Workflow to test Sveltia CMS on your local machine before deploying it to production. You can update the configuration file, add contents and assets, see if the output is as expected, and troubleshoot any issues that arise."

**What:** Full content lifecycle test for each collection type
**When to use:** Once per collection to validate entire workflow
**Steps:**
1. Create new content via CMS
2. Verify file created in correct `src/content/[collection]/` directory
3. Run `npm run build` - ensure no Zod schema errors
4. Check `dist/` output - verify content renders on site
5. Verify Git commit has proper attribution
6. Edit content via CMS, verify changes persist
7. Delete test content, verify file removed

**Pattern 3: Schema Validation (Automated)**

Astro's content collections use Zod to validate frontmatter. InvalidContentEntryFrontmatterError indicates content entry frontmatter does not match schema. Make sure all required fields are present and all fields are of the correct type.

**What:** Automated check that CMS-created content passes Astro Zod validation
**When to use:** After each content creation/edit operation
**Command:**
```bash
npm run build  # Astro validates all content against schemas in content.config.ts
```

**Pattern 4: User Documentation Structure**

Research shows intentional conversations across roles—designers, developers, strategists, and editors—should prioritize editorial usability. Onboarding is the backbone of any successful SaaS product, shaping first impressions.

**Structure:**
```markdown
# CMS User Guide

## Quick Start (First-Time Setup)
1. Create GitHub Personal Access Token
2. Access CMS at /admin
3. Authenticate with PAT

## Daily Workflows
- Creating blog posts
- Adding publications
- Managing talks
- Updating portfolio

## Field Reference
- Required vs optional fields per collection
- Date format requirements
- Markdown body editing

## Troubleshooting
- Authentication issues
- Build failures from invalid frontmatter
- Browser compatibility
```

### Anti-Patterns to Avoid

- **Over-engineering tests:** Don't create Playwright/Cypress tests for a single-user CMS with static config. Manual testing is faster and sufficient.
- **Testing CMS internals:** Don't test Sveltia CMS functionality (markdown editor, media library UI). Test your config and integration only.
- **Documentation as afterthought:** Don't wait until testing is complete to write docs. Create docs as you test, capturing real issues encountered.
- **Generic documentation:** Don't copy-paste Sveltia docs. Write task-oriented guides specific to this site's 4 collections and field requirements.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Automated browser testing | Playwright test suite | Manual checklist | 6 test scenarios, single user, static config - automation overhead > value |
| Screenshot capture automation | Puppeteer screenshot scripts | Manual screenshots | One-time documentation task, not CI/CD workflow |
| Custom validation scripts | New Zod validators | Existing audit-frontmatter.mjs + Astro build | Already validates all 4 collections, integrated with npm scripts |
| Interactive documentation | Custom docs site | Markdown file in repo | User is single editor, GitHub rendering sufficient |

**Key insight:** Phase 13 is validation and documentation, not feature development. Prefer simple, manual approaches over automated infrastructure that requires maintenance.

## Common Pitfalls

### Pitfall 1: Testing in Only One Browser

**What goes wrong:** CMS works in Chrome during development but fails in Safari with session storage or CSS rendering issues
**Why it happens:** Browser engines differ (Chromium vs WebKit vs Gecko), localStorage/sessionStorage APIs vary
**How to avoid:** Test all 5 success criteria in Chrome, Firefox, AND Safari before marking phase complete
**Warning signs:** Console errors in Safari DevTools that don't appear in Chrome

### Pitfall 2: Not Validating Git Commit Attribution

**What goes wrong:** CMS commits appear with wrong author name/email or lack proper attribution
**Why it happens:** Git config may override CMS commit author, or CMS doesn't set Git author correctly with PAT auth
**How to avoid:** After first CMS commit, run `git log --format=fuller` and verify author matches expected identity
**Warning signs:** `git log` shows "github-actions[bot]" or wrong username as commit author

### Pitfall 3: Skipping Build Validation After CMS Edits

**What goes wrong:** Content created via CMS renders correctly in preview but breaks production build with Zod schema errors
**Why it happens:** CMS form validation may not perfectly match Astro Zod schema constraints (e.g., URL format, date parsing)
**How to avoid:** Run `npm run build` after EVERY content creation/edit during testing phase, not just dev server
**Warning signs:** Astro build logs show "InvalidContentEntryFrontmatterError" or "InvalidContentEntryDataError"

Per Astro documentation: "Astro check silently exits and doesn't report type errors when there are collection schema validation errors" - you MUST run `npm run build` to catch these.

### Pitfall 4: Documenting Features, Not Tasks

**What goes wrong:** User documentation lists CMS fields and widgets but doesn't explain how to accomplish actual content creation goals
**Why it happens:** Developer mindset - documenting the system rather than user workflows
**How to avoid:** Structure docs around tasks: "How to add a new publication", "How to upload images", "How to fix date format errors"
**Warning signs:** Documentation has sections named after CMS features (Collections, Widgets, Backend) rather than user actions

### Pitfall 5: Not Testing Media Library Integration

**What goes wrong:** Media library upload succeeds but images don't render on site due to path mismatches between `media_folder` and `public_folder`
**Why it happens:** CMS config has `media_folder: "public/images/uploads"` (repo path) and `public_folder: "/images/uploads"` (URL path) - easy to reverse
**How to avoid:** Upload test image, insert into content, build site, verify image renders at correct URL in dist/
**Warning signs:** Image markdown `![alt](/images/uploads/test.jpg)` in source but 404 in built site

### Pitfall 6: Session Persistence Not Tested

**What goes wrong:** User logs in successfully but gets logged out on browser close/refresh
**Why it happens:** Sveltia CMS uses localStorage for PAT, but some browser privacy settings clear on exit
**How to avoid:** Test sequence: login → close browser completely → reopen /admin → verify still logged in
**Warning signs:** User has to re-enter PAT every browser session

## Code Examples

### Example 1: Manual Test Checklist Format

Structured checklist combining browser compatibility and workflow validation:

```markdown
# CMS Production Readiness Test Checklist

**Test Date:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** Local dev server (npm run dev)

## Browser: Chrome [Version]

### Authentication (Success Criteria #2)
- [ ] Navigate to http://localhost:4321/admin/
- [ ] CMS loads without console errors
- [ ] GitHub PAT authentication prompt appears
- [ ] Enter PAT, click login
- [ ] Authentication succeeds, collections visible in sidebar
- [ ] Close browser completely
- [ ] Reopen /admin
- [ ] Still logged in (session persisted)

### Content Creation (Success Criteria #1, #3)
- [ ] Create new blog post, verify file in src/content/posts/
- [ ] Run `npm run build` - no Zod errors
- [ ] Create new publication, verify file in src/content/publications/
- [ ] Run `npm run build` - no Zod errors
- [ ] Create new talk, verify file in src/content/talks/
- [ ] Run `npm run build` - no Zod errors
- [ ] Create new portfolio item, verify file in src/content/portfolio/
- [ ] Run `npm run build` - no Zod errors

### Media Library (Success Criteria #1)
- [ ] Upload image via media library
- [ ] Image appears in public/images/uploads/
- [ ] Insert image into blog post body via markdown editor
- [ ] Build site, verify image renders at /images/uploads/[filename]

### Git Attribution (Success Criteria #5)
- [ ] After CMS commits, run: `git log --format=fuller --max-count=3`
- [ ] Verify commit author matches expected GitHub identity
- [ ] Verify commit message includes content description

### Edit/Delete Workflow (Success Criteria #1)
- [ ] Edit existing blog post, modify title
- [ ] Save, verify file updated in src/content/posts/
- [ ] Delete test content created during testing
- [ ] Verify files removed from filesystem

## Browser: Firefox [Version]
[Repeat all sections above]

## Browser: Safari [Version]
[Repeat all sections above]

## Build Validation (Success Criteria #3)
- [ ] Run `npm run build` with ALL content (including CMS-created)
- [ ] Build succeeds with no Zod schema errors
- [ ] Inspect dist/ output, verify all collections render

## Notes
[Document any issues, workarounds, or observations]
```

### Example 2: GitHub Personal Access Token Setup Guide

Step-by-step PAT creation for user documentation:

```markdown
# Setting Up GitHub Authentication for CMS

## Create Fine-Grained Personal Access Token

1. **Sign in to GitHub** and navigate to Settings
   - Click your profile photo (top-right)
   - Select "Settings" from dropdown

2. **Access Developer Settings**
   - Scroll to bottom of left sidebar
   - Click "Developer settings"
   - Click "Personal access tokens" → "Fine-grained tokens"

3. **Generate New Token**
   - Click "Generate new token"
   - **Token name:** "CMS Access - bacilo.github.io"
   - **Expiration:** 90 days (recommended for security)
   - **Description:** "Sveltia CMS access for content editing"

4. **Set Repository Access**
   - **Resource owner:** [Your GitHub username]
   - **Repository access:** "Only select repositories"
   - Select: `bacilo/bacilo.github.io`

5. **Configure Permissions**
   Required permissions:
   - **Contents:** Read and write (allows creating/editing content files)
   - **Metadata:** Read-only (repository metadata access)

   All other permissions: Leave unchecked

6. **Generate and Save Token**
   - Click "Generate token"
   - **IMPORTANT:** Copy token immediately - you won't see it again!
   - Store securely (password manager recommended)

## Authenticate to CMS

1. Navigate to: `http://localhost:4321/admin/` (local) or `https://bacilo.github.io/admin/` (production)
2. CMS will prompt for authentication
3. Paste your Personal Access Token
4. Click "Login"

## Security Best Practices

- **Expiration:** Tokens should expire. GitHub recommends 1-366 days. Set calendar reminder to rotate.
- **Minimal permissions:** This token has ONLY Contents (write) + Metadata (read) - no org access, no other repos.
- **Treat like password:** Never commit to git, never share, store in password manager.
- **Revoke if compromised:** Settings → Developer settings → Personal access tokens → Revoke

## Troubleshooting

**"Authentication failed"**
- Verify token has Contents (write) permission
- Verify repository matches: bacilo/bacilo.github.io
- Token may have expired - check expiration date

**"Session expired" on return visit**
- Browser cleared localStorage (privacy mode)
- Token revoked on GitHub - check token status
- Re-authenticate with same token (it's reusable until expiration)
```

### Example 3: Build Validation Workflow

Automated schema validation using existing tools:

```bash
#!/bin/bash
# validate-cms-content.sh - Run after CMS edits to ensure build safety

echo "Running frontmatter audit (gray-matter + Zod validation)..."
node scripts/audit-frontmatter.mjs
if [ $? -ne 0 ]; then
  echo "❌ Frontmatter audit FAILED - fix violations before building"
  exit 1
fi

echo "Running Astro build (full schema validation)..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Astro build FAILED - content violates Zod schemas"
  exit 1
fi

echo "✅ All content validates successfully - safe to deploy"
```

Usage in testing workflow:
```bash
# After creating content via CMS:
npm run dev  # Preview looks good
bash validate-cms-content.sh  # Automated validation
git log --oneline --max-count=5  # Verify CMS commits
```

## State of the Art

### Testing Approaches Evolution

| Old Approach (2024) | Current Approach (2026) | When Changed | Impact |
|---------------------|-------------------------|--------------|--------|
| Playwright for all web testing | Manual checklists for simple UIs + Playwright for complex SPAs | 2025 | Reduced over-engineering for static CMS configs |
| Generic CMS documentation | Task-oriented user guides | Ongoing | Better user onboarding, fewer support issues |
| Post-deployment testing | Pre-deployment validation checklists | 2025 (DevOps shift-left) | Catch issues before production |
| Siloed testing (QA team only) | Collaborative testing (dev + user) | 2026 | Better test coverage, real-world scenarios |

### Sveltia CMS Status (2026)

**Current:** Beta status, version 1.0 expected early 2026
**Implication:** Some features still missing, documentation evolving
**Mitigation:** Test core workflows extensively, document workarounds for any issues

**Deprecated/outdated:**
- **Netlify CMS:** Sveltia CMS is the successor (modern UX, better performance)
- **OAuth for single-user CMS:** PAT authentication simpler, no server required
- **CSS imports for Sveltia:** Modern version has no CSS dependencies (older docs incorrectly mention stylesheet links)

## Documentation Best Practices (2026)

Per research on CMS user documentation:

**Onboarding structure:**
1. **Quick Start:** First-time setup (PAT creation, initial login)
2. **Core Workflows:** Daily tasks (create post, add publication, upload image)
3. **Field Reference:** Per-collection requirements (what's required, format rules)
4. **Troubleshooting:** Common issues (auth failures, build errors, browser issues)

**Content creator focus:**
- "The care put into code and frontend design is often not proportional to the care taken in setting up the CMS for editors" - prioritize editor experience
- Spending time with an editor to test different content structures reveals initial logic isn't suitable
- Documentation should enable self-service editing without developer intervention

## Open Questions

### 1. **Browser Version Matrix**

**What we know:** Must test Chrome, Firefox, Safari (success criteria #2)
**What's unclear:** Specific version requirements - do we support Safari 1 version back? Only evergreen browsers?
**Recommendation:** Test current stable versions only (evergreen assumption for 2026). Document tested versions in VERIFICATION.md.

### 2. **PAT Expiration Handling**

**What we know:** GitHub recommends 1-366 day token expiration for security
**What's unclear:** What happens to CMS session when PAT expires? Graceful error or silent failure?
**Recommendation:** Test PAT expiration scenario (create 1-day token, wait, try to use CMS). Document behavior in troubleshooting guide.

### 3. **Multi-User Editing (Future)**

**What we know:** "Sveltia CMS does not officially support multi-user scenarios yet" (risk of merge conflicts)
**What's unclear:** Is concurrent editing detected? Merge conflict resolution workflow?
**Recommendation:** Document as single-user system. If multi-user needed in future, re-evaluate CMS choice or add locking mechanism.

### 4. **Media Library Capacity**

**What we know:** `media_folder: "public/images/uploads"` configured
**What's unclear:** Performance implications of 100+ images in media library (UI slowness, upload limits)
**Recommendation:** Test with 10-20 images (realistic for academic site). Document any performance observations.

## Sources

### Primary (HIGH confidence)

Official Documentation:
- [Sveltia CMS Getting Started](https://sveltiacms.app/en/docs/start) - Testing recommendations, local workflow, authentication setup
- [GitHub Personal Access Tokens Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) - Fine-grained token creation, permissions, security best practices
- [Astro Content Collections Errors](https://docs.astro.build/en/reference/errors/markdown-content-schema-validation-error/) - Schema validation error reference

Project Files:
- `public/admin/config.yml` - CMS configuration with 4 collections (posts, publications, talks, portfolio)
- `src/content.config.ts` - Zod schemas for all collections
- `scripts/audit-frontmatter.mjs` - Existing validation script (gray-matter + Zod)
- `.planning/phases/11-content-audit-cms-setup/11-VERIFICATION.md` - Phase 11 manual test procedures
- `.planning/phases/12-complete-content-coverage/12-VERIFICATION.md` - Phase 12 validation patterns

### Secondary (MEDIUM confidence)

Cross-Browser Testing:
- [Cross Browser Testing Checklist for 2025](https://www.accelq.com/blog/cross-browser-testing-checklist/) - Layout, functionality, performance testing areas
- [Cross-Browser Testing Steps](https://www.frugaltesting.com/blog/cross-browser-testing-checklist-steps-to-ensure-compatibility-across-all-browsers) - Manual testing approach and validation items
- [Web Application Testing Guide](https://www.softwaretestinghelp.com/web-application-testing/) - Comprehensive testing methodology

Documentation Best Practices:
- [Best Practices for Onboarding Content Managers to Strapi](https://strapi.io/blog/best-practices-for-onboarding-content-managers-to-strapi) - User onboarding structure and editorial usability
- [Content Editor UX: Why CMS Usability Is Tough](https://evolvingweb.com/blog/content-editor-ux-why-cms-usability-tough) - Editor-focused documentation principles

Automation Tools (reference only):
- [Playwright Documentation](https://playwright.dev/) - E2E testing framework (NOT RECOMMENDED for this phase - manual testing sufficient)
- [Playwright Best Practices 2026](https://www.browserstack.com/guide/playwright-best-practices) - Testing patterns (informational context)

Production Readiness:
- [Production Readiness Checklist 2026](https://vettedoutsource.com/blog/production-readiness-checklist/) - CI/CD pipeline, deployment validation
- [Git-Based CMS Overview](https://statichunt.com/blog/git-based-headless-cms) - Git-based CMS patterns and workflows

### Tertiary (LOW confidence - general industry knowledge)

- [Markdown Guide](https://www.markdownguide.org/getting-started/) - Markdown editor user documentation patterns
- [End-to-End Testing Best Practices 2026](https://research.aimultiple.com/end-to-end-testing-best-practices/) - Testing methodology (general guidance, not CMS-specific)

## Metadata

**Confidence breakdown:**
- Testing approach (manual checklist + automated validation): HIGH - Based on project structure (single user, static config, existing audit script) and industry best practices for appropriate test automation
- Browser compatibility requirements: MEDIUM - Success criteria specify browsers but not version matrix; current stable browser assumption standard for 2026
- Documentation structure: HIGH - Based on established user onboarding patterns and CMS-specific editorial usability research
- Git commit attribution validation: MEDIUM - Critical requirement (#5) but testing process needs validation (not documented in prior phases)
- Media library testing: MEDIUM - Config verified in Phase 12 but end-to-end image upload/render workflow not yet tested

**Research date:** 2026-02-13
**Valid until:** 2026-03-13 (30 days - CMS and testing practices relatively stable, Sveltia v1.0 release expected early 2026 may affect some details)
