# Phase 11: Content Audit & CMS Setup - Research

**Researched:** 2026-02-13
**Domain:** Git-based CMS (Sveltia CMS) + Astro content collections integration
**Confidence:** HIGH

## Summary

Sveltia CMS is a modern, lightweight rewrite of Decap CMS (formerly Netlify CMS) currently in beta (v0.140.3 as of Feb 2026), with version 1.0 expected Q1 2026. It's framework-agnostic and can be served as static files from `public/admin/` in Astro projects, requiring only `index.html` and `config.yml`. The CMS natively supports Personal Access Token authentication without requiring OAuth server infrastructure, making it ideal for single-user static sites deployed to GitHub Pages.

For Astro 5.x projects with content collections, the integration requires mapping Zod schemas in `src/content.config.ts` to CMS collection definitions in `public/admin/config.yml`. The primary technical challenge is ensuring frontmatter consistency across existing content before CMS activation, as Sveltia enforces the schema defined in `config.yml`.

**Primary recommendation:** Audit existing content for schema violations using gray-matter and Zod validation scripts BEFORE creating CMS config, then serve Sveltia as static files with PAT authentication (simplest path for single-user GitHub Pages deployment).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @sveltia/cms | 0.140.x (beta) | Git-based headless CMS | Modern Decap successor, 5x smaller (300KB vs 1.5MB), uses GitHub GraphQL for faster loading |
| gray-matter | 4.x | Parse/stringify frontmatter | Battle-tested by Astro, Gatsby, Netlify, TinaCMS - de facto standard for YAML frontmatter |
| zod | 3.x | Schema validation | Already in use by Astro content collections, ensures consistency |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| remark-lint-frontmatter-schema | Latest | Validate frontmatter against JSON schema | For automated CI checks of content schema compliance |
| @github-docs/frontmatter | Latest | Frontmatter validation with key ordering | If enforcing specific field ordering across content |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Sveltia CMS (static) | astro-sveltia-cms integration | Integration requires SSR mode (`output: "server"`), adds OAuth complexity, unnecessary for single-user PAT setup |
| Sveltia CMS | Decap CMS | Decap is stagnant (low activity, bug backlog), 5x larger, slower GraphQL API usage, lacks PAT auth |
| Sveltia CMS | TinaCMS | More opinionated, tighter framework coupling, steeper learning curve for non-Next.js |
| PAT auth | OAuth with Cloudflare Workers | OAuth requires external service deployment, only beneficial for multi-user scenarios |

**Installation:**
```bash
# No npm install needed - Sveltia CMS served via CDN in public/admin/index.html
# For content audit scripts:
npm install --save-dev gray-matter zod
```

## Architecture Patterns

### Recommended Project Structure
```
public/
├── admin/                # CMS static files
│   ├── index.html       # Sveltia CMS loader (CDN script tag)
│   └── config.yml       # CMS configuration (mirrors content.config.ts schemas)
src/
├── content/             # Markdown content (managed by CMS)
│   ├── posts/           # Blog posts collection
│   ├── publications/    # Publications collection
│   ├── talks/           # Talks collection
│   └── portfolio/       # Portfolio collection
├── content.config.ts    # Astro content collections (Zod schemas)
└── scripts/             # Content audit/migration scripts
    ├── audit-frontmatter.js    # Validate existing content against schemas
    └── normalize-frontmatter.js # Fix schema violations
```

### Pattern 1: Static CMS Serving (No SSR Required)
**What:** Serve Sveltia CMS as static HTML/JS files via CDN, bypassing Astro SSR
**When to use:** Single-user sites with PAT auth deployed to static hosts (GitHub Pages, Cloudflare Pages)
**Example:**
```html
<!-- public/admin/index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Content Manager</title>
</head>
<body>
  <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
</body>
</html>
```

### Pattern 2: Schema Mirroring (Astro Zod → CMS YAML)
**What:** Manually translate Zod schemas to CMS config collections
**When to use:** Every time Astro content schema changes
**Example:**
```typescript
// src/content.config.ts (source of truth)
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    permalink: z.string().optional(),
  })
});
```

```yaml
# public/admin/config.yml (mirror of above)
collections:
  - name: posts
    label: Blog Posts
    folder: src/content/posts
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: Title, name: title, widget: string, required: true }
      - { label: Date, name: date, widget: datetime, required: true }
      - { label: Tags, name: tags, widget: list, required: false }
      - { label: Permalink, name: permalink, widget: string, required: false }
      - { label: Body, name: body, widget: markdown, required: true }
```

### Pattern 3: Content Audit Pre-Migration
**What:** Validate all existing markdown files against Zod schemas before CMS activation
**When to use:** Before creating CMS config, to identify frontmatter inconsistencies
**Example:**
```javascript
// src/scripts/audit-frontmatter.js
import { glob } from 'glob';
import matter from 'gray-matter';
import { postsSchema } from '../content.config.ts';

const files = await glob('src/content/posts/**/*.md');
const errors = [];

for (const file of files) {
  const { data } = matter.read(file);
  const result = postsSchema.safeParse(data);
  if (!result.success) {
    errors.push({ file, issues: result.error.issues });
  }
}

if (errors.length > 0) {
  console.error('Schema violations found:', errors);
  process.exit(1);
}
```

### Pattern 4: Media Folder Configuration
**What:** Configure separate media and public folders for proper image path handling
**When to use:** Always, to avoid image path bugs on first CMS submission
**Example:**
```yaml
# public/admin/config.yml
media_folder: "public/images/uploads"  # Where files are saved in repo
public_folder: "/images/uploads"       # Path used in markdown image references

collections:
  - name: posts
    folder: src/content/posts
    # Override for collection-specific media if needed
    # media_folder: "public/images/posts"
    # public_folder: "/images/posts"
```

### Anti-Patterns to Avoid
- **Using astro-sveltia-cms integration for single-user sites:** Requires SSR mode and OAuth setup; unnecessary complexity for PAT auth
- **Skipping content audit before CMS setup:** Existing schema violations will cause CMS save failures
- **Inconsistent field naming between Astro and CMS:** `collection: 'posts'` in frontmatter vs `name: posts` in config.yml must align
- **Setting media_folder without public_folder:** Will cause incorrect image paths in markdown on first save

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontmatter parsing | Custom YAML parser with regex | gray-matter | Handles edge cases (TOML, JSON, custom delimiters), used by Astro/Gatsby/Netlify |
| Schema validation | Manual field checking loops | Zod (already in Astro) | Type-safe, composable, generates TypeScript types, same library as content collections |
| CMS authentication | Custom GitHub OAuth flow | Sveltia PAT auth | Built-in, no server required, simple token input UI |
| Markdown editing | Textarea with toolbar | Sveltia markdown widget | WYSIWYG-lite editor with preview, image insertion, formatting shortcuts |
| Content schema enforcement | Pre-commit hooks | Astro build-time validation | Fails builds on schema violations, catches issues before deployment |

**Key insight:** Git-based CMS tooling is mature and battle-tested. The ecosystem has solved authentication, parsing, and validation problems - custom solutions reintroduce solved problems like frontmatter delimiter edge cases, date format handling, and YAML/JSON/TOML polymorphism.

## Common Pitfalls

### Pitfall 1: Schema Drift Between Astro and CMS
**What goes wrong:** Astro content.config.ts updated with new required field, but CMS config.yml not updated. Users save content via CMS, builds fail due to missing field.
**Why it happens:** Two separate schema definitions (Zod in TypeScript, YAML config) with no automated sync
**How to avoid:**
- Document schema update workflow: "Every content.config.ts change requires config.yml mirror update"
- Add comment in both files linking to the other
- Consider CI check that compares field names in both files
**Warning signs:** Build failures after CMS edits, "missing required field" errors in Astro build logs

### Pitfall 2: Inconsistent Legacy Frontmatter
**What goes wrong:** Existing content uses inconsistent field names (e.g., `permalink` vs `url`, optional `collection` field presence varies). CMS loads content with errors or missing fields.
**Why it happens:** Content migrated from Jekyll or other systems with different conventions
**How to avoid:**
- Run audit script BEFORE CMS config creation
- Normalize all frontmatter to match current Zod schemas
- Use `z.coerce.date()` for date fields (handles various date formats)
- Make `collection` field `.optional()` if not consistently present
**Warning signs:** CMS shows "Failed to load entry" errors, missing fields in CMS edit view

### Pitfall 3: Wrong Image Upload Paths
**What goes wrong:** First CMS image upload saves to incorrect location or generates wrong markdown path, breaking on-site image display
**Why it happens:** `media_folder` vs `public_folder` confusion - media_folder is repo path, public_folder is site URL path
**How to avoid:**
- Set `media_folder: "public/images/uploads"` (physical save location)
- Set `public_folder: "/images/uploads"` (markdown image path)
- Test image upload BEFORE content creation workflow
**Warning signs:** CMS saves images to `src/` instead of `public/`, markdown shows `![](public/images/x.jpg)` instead of `![](/images/x.jpg)`

### Pitfall 4: PAT Expiration Surprise
**What goes wrong:** User edits content, saves fail with authentication error. PAT expired (default 90 days).
**Why it happens:** GitHub auto-expires PATs, no reminder system in Sveltia CMS
**How to avoid:**
- Document PAT lifespan when creating (set custom expiration or note 90-day default)
- Calendar reminder 1 week before expiration
- Test: try CMS save after long periods of inactivity
**Warning signs:** "Authentication failed" errors in CMS after previously working

### Pitfall 5: Body Field Naming
**What goes wrong:** CMS saves entire post content to frontmatter instead of separating body content
**Why it happens:** Field named something other than `body` - CMS requires exact name `body` to recognize post-frontmatter content
**How to avoid:**
- Always use `{ label: "Body", name: "body", widget: "markdown" }` in config.yml
- This is a Decap/Sveltia convention, not configurable
**Warning signs:** Markdown content appears inside frontmatter YAML block instead of after `---` delimiter

### Pitfall 6: SSR Mode Confusion
**What goes wrong:** User installs `astro-sveltia-cms` integration, Astro requires SSR adapter, deployment breaks (GitHub Pages only supports static)
**Why it happens:** Integration auto-mounts OAuth routes requiring SSR mode, but PAT auth doesn't need SSR
**How to avoid:**
- Use static CDN approach (index.html + CDN script tag) for single-user PAT setups
- Reserve `astro-sveltia-cms` integration for multi-user OAuth scenarios with SSR-compatible hosts
**Warning signs:** Astro build requires adapter, "output: server requires an adapter" error

## Code Examples

Verified patterns from official sources:

### Minimal CMS Setup (Static Files)
```html
<!-- public/admin/index.html -->
<!-- Source: https://sveltiacms.app/en/docs/start -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Content Manager</title>
</head>
<body>
  <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
</body>
</html>
```

### Basic Config with GitHub Backend + PAT
```yaml
# public/admin/config.yml
# Source: https://sveltiacms.app/en/docs/start
backend:
  name: github
  repo: bacilo/bacilo.github.io  # owner/repo format
  branch: master

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: posts
    label: Blog Posts
    folder: src/content/posts
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Date, name: date, widget: datetime }
      - { label: Tags, name: tags, widget: list, required: false }
      - { label: Permalink, name: permalink, widget: string, required: false }
      - { label: Body, name: body, widget: markdown }
```

### Content Audit Script
```javascript
// scripts/audit-frontmatter.js
// Source: Synthesized from https://www.npmjs.com/package/gray-matter and Zod docs
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

// Mirror your Astro content.config.ts schemas here
const postsSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  permalink: z.string().optional(),
});

const contentDir = 'src/content/posts';
const files = readdirSync(contentDir).filter(f => f.endsWith('.md'));
const errors = [];

for (const filename of files) {
  const filepath = join(contentDir, filename);
  const fileContent = readFileSync(filepath, 'utf-8');
  const { data } = matter(fileContent);

  const result = postsSchema.safeParse(data);
  if (!result.success) {
    errors.push({
      file: filename,
      issues: result.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    });
  }
}

if (errors.length > 0) {
  console.error('Schema violations found:');
  console.error(JSON.stringify(errors, null, 2));
  process.exit(1);
} else {
  console.log(`✓ All ${files.length} files valid`);
}
```

### Normalization Script (Remove Inconsistent Fields)
```javascript
// scripts/normalize-frontmatter.js
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const contentDir = 'src/content/posts';
const files = readdirSync(contentDir).filter(f => f.endsWith('.md'));

for (const filename of files) {
  const filepath = join(contentDir, filename);
  const fileContent = readFileSync(filepath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Remove fields not in current schema
  const allowedFields = ['title', 'date', 'tags', 'permalink'];
  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );

  // Reconstruct file with cleaned frontmatter
  const newContent = matter.stringify(content, cleanedData);
  writeFileSync(filepath, newContent);
  console.log(`✓ Normalized ${filename}`);
}
```

### GitHub PAT Creation
```bash
# Source: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
# Navigate to: GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens
# Create new token with:
# - Repository access: Only select repositories (bacilo.github.io)
# - Permissions:
#   - Contents: Read and write
#   - Metadata: Read-only (auto-selected)
# - Expiration: Custom (set reminder 1 week before)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Decap CMS (Netlify CMS) | Sveltia CMS | March 2023 (Sveltia launched) | 5x smaller bundle (300KB vs 1.5MB), GraphQL API for faster loads, built-in PAT auth |
| OAuth only authentication | PAT authentication | Sveltia CMS v0.x (2024) | No OAuth server required for single-user sites |
| React-based CMS UI | Svelte-based CMS UI | Sveltia from inception | Faster rendering, smaller runtime, better mobile performance |
| Manual Git workflow editing | Browser-based File System Access API | Sveltia CMS local dev mode | Edit local files directly in browser without commits/deploys |
| Astro v4 `type: 'content'` | Astro v5 Content Layer API with loaders | Astro 5.0 (2024) | 5x faster builds, 50% less memory, load from any source (not just local files) |

**Deprecated/outdated:**
- **Netlify CMS:** Rebranded to Decap CMS in Feb 2023, low maintenance activity, use Sveltia instead
- **Astro content collections `type: 'content'` syntax:** Replaced with `loader: glob()` in Astro 5.x
- **Classic GitHub PATs:** Fine-grained PATs with repository-specific scopes preferred (better security)
- **OAuth requirement for Git CMS:** PAT auth is simpler for single-user scenarios, OAuth only needed for multi-user

## Open Questions

1. **Sveltia CMS 1.0 feature completeness**
   - What we know: v1.0 expected Q1 2026, custom widgets deferred to 1.x/2.x (mid-2026)
   - What's unclear: Whether 1.0 will have feature parity with Decap CMS for common use cases
   - Recommendation: Proceed with current beta (v0.140.x) for standard markdown editing - stable enough for production, custom widgets not required for this phase

2. **GitHub PKCE support timeline**
   - What we know: GitHub plans client-side PKCE for SPAs, would eliminate OAuth backend need
   - What's unclear: No public timeline for GitHub PKCE launch
   - Recommendation: Use PAT auth now (simplest), migrate to PKCE when available if multi-user needs emerge

3. **Automated schema sync tooling**
   - What we know: No existing tool auto-generates CMS config.yml from Astro Zod schemas
   - What's unclear: Whether this would be valuable enough to build custom tooling
   - Recommendation: Manual mirroring sufficient for 4 collections, document workflow in PLAN.md

4. **Image optimization workflow**
   - What we know: Sveltia saves raw uploaded images, Astro Image component can optimize on build
   - What's unclear: Whether to use Astro Image with CMS-uploaded assets or pre-optimize uploads
   - Recommendation: Defer optimization to Phase 12 (responsive images), use raw uploads for Phase 11

## Sources

### Primary (HIGH confidence)
- [Sveltia CMS GitHub Repository](https://github.com/sveltia/sveltia-cms) - Latest release v0.140.3, architecture, local dev features
- [Sveltia CMS Official Documentation - Getting Started](https://sveltiacms.app/en/docs/start) - Installation, config.yml structure, field types
- [Sveltia CMS Official Documentation - Netlify/Decap Migration](https://sveltiacms.app/en/docs/successor-to-netlify-cms) - Compatibility notes, config format
- [Astro Content Collections Documentation](https://docs.astro.build/en/guides/content-collections/) - Astro 5.0 Content Layer API, Zod schemas
- [GitHub Personal Access Tokens Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) - Fine-grained vs classic PATs, scopes
- [Decap CMS Configuration Options](https://decapcms.org/docs/configuration-options/) - Backend config, media_folder vs public_folder, field types
- [gray-matter npm package](https://www.npmjs.com/package/gray-matter) - Frontmatter parsing API

### Secondary (MEDIUM confidence)
- [astro-sveltia-cms Integration](https://github.com/majesticostudio/astro-sveltia-cms) - SSR integration approach (not recommended for this phase)
- [Sveltia vs Decap comparison blog](https://dubasipavankumar.com/blog/sveltia-cms-migration-decap-replacement/) - Performance benchmarks, feature comparison
- [Hugo CMS Setup Journey blog](https://0deepresearch.com/posts/2025-05-08-hugo-cms-setup-journey-decap-cms-sveltia-cms-on-github-pages/) - GitHub Pages deployment patterns, authentication challenges
- [Hygraph: Best CMSs for Astro](https://hygraph.com/blog/astro-cms) - CMS architecture patterns for Astro SSG
- [remark-lint-frontmatter-schema](https://github.com/JulianCataldo/remark-lint-frontmatter-schema) - Automated frontmatter validation tool

### Tertiary (LOW confidence - marked for validation)
- WebSearch findings on Sveltia CMS features (verified against official docs where possible)
- Community discussions on GitHub (issue #327 re: image paths, discussion #190 re: media_folder per collection)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Sveltia CMS documented, gray-matter battle-tested, Zod already in project
- Architecture: HIGH - Static CMS serving well-documented, schema mirroring pattern standard for Git CMS
- Pitfalls: MEDIUM-HIGH - Schema drift and image paths verified in docs/issues, PAT expiration from GitHub docs, others synthesized from similar CMS integrations
- Code examples: HIGH - Verified against official Sveltia and Astro documentation

**Research date:** 2026-02-13
**Valid until:** 2026-03-15 (30 days - stable domain, but Sveltia approaching 1.0 release may bring changes)
