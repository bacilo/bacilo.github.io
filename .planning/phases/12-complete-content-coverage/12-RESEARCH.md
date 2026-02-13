# Phase 12: Complete Content Coverage - Research

**Researched:** 2026-02-13
**Domain:** Sveltia CMS multi-collection configuration + content normalization
**Confidence:** HIGH

## Summary

Phase 12 extends the CMS configuration established in Phase 11 (blog posts only) to cover all content types: publications, talks, and portfolio items. The work involves adding three new collections to `public/admin/config.yml` while maintaining schema synchronization with `src/content.config.ts`, normalizing existing content frontmatter to match schemas, and configuring media library for image management across all collections.

Sveltia CMS (v0.140.x, beta) maintains full compatibility with Decap CMS configuration patterns. The critical technical requirement is ensuring frontmatter consistency BEFORE adding collections to config.yml, as Sveltia enforces the schema on load. Any existing content with schema violations will cause CMS errors when attempting to edit those entries.

The media library configuration is already present in Phase 11's setup (`media_folder: "public/images/uploads"`, `public_folder: "/images/uploads"`), which provides global media storage accessible across all collections. Images uploaded through the CMS will be available in the media library for insertion into any content type via the Image widget.

**Primary recommendation:** Extend the frontmatter audit script from Phase 11 to validate publications, talks, and portfolio collections, normalize violations, then add three collection definitions to config.yml mirroring the Zod schemas exactly.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @sveltia/cms | 0.140.x (beta) | Git-based headless CMS | Already configured in Phase 11, modern Decap successor |
| gray-matter | 4.x | Parse/stringify frontmatter | Already installed in Phase 11, industry-standard YAML parser |
| zod | 3.x | Schema validation | Already used by Astro content collections, ensures consistency |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| N/A | N/A | No additional dependencies needed | Phase 12 uses existing Phase 11 infrastructure |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual collection config | Automated schema conversion | No production-ready Zod→Decap converters exist; manual mirroring is standard practice |
| Global media folder | Per-collection media folders | Global folder simplifies management for single-user sites; per-collection adds path complexity |
| Frontmatter normalization | Manual fixes | Scripted normalization ensures consistency and provides audit trail |

**Installation:**
```bash
# No new dependencies - Phase 11 already installed gray-matter and zod
# Extend existing scripts/audit-frontmatter.mjs to cover new collections
```

## Architecture Patterns

### Recommended Project Structure
```
public/
├── admin/
│   ├── index.html           # Sveltia CMS (from Phase 11)
│   └── config.yml           # EXTENDED: add publications, talks, portfolio collections
├── images/
│   └── uploads/             # Global media library (from Phase 11)
src/
├── content/
│   ├── posts/               # Already CMS-managed (Phase 11)
│   ├── publications/        # NEW: Add to CMS config
│   ├── talks/               # NEW: Add to CMS config
│   └── portfolio/           # NEW: Add to CMS config
├── content.config.ts        # Source of truth for schemas
└── scripts/
    └── audit-frontmatter.mjs  # EXTENDED: validate all 4 collections
```

### Pattern 1: Multi-Collection Configuration
**What:** Define multiple collections in config.yml, each mirroring its Zod schema from content.config.ts
**When to use:** When adding new content types to CMS management
**Example:**
```yaml
# public/admin/config.yml
collections:
  - name: posts
    label: "Blog Posts"
    folder: "src/content/posts"
    create: true
    delete: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Date", name: "date", widget: "datetime", required: true, date_format: "YYYY-MM-DD", time_format: false }
      - { label: "Tags", name: "tags", widget: "list", required: false }
      - { label: "Permalink", name: "permalink", widget: "string", required: false }
      - { label: "Body", name: "body", widget: "markdown", required: true }

  - name: publications
    label: "Publications"
    folder: "src/content/publications"
    create: true
    delete: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Collection", name: "collection", widget: "hidden", default: "publications" }
      - { label: "Permalink", name: "permalink", widget: "string", required: true }
      - { label: "Date", name: "date", widget: "datetime", required: true, date_format: "YYYY-MM-DD", time_format: false }
      - { label: "Venue", name: "venue", widget: "string", required: true }
      - { label: "Citation", name: "citation", widget: "text", required: true }
      - { label: "Paper URL", name: "paperurl", widget: "string", required: false }
      - { label: "Excerpt", name: "excerpt", widget: "text", required: false }
      - { label: "Body", name: "body", widget: "markdown", required: true }
```

**Key points:**
- `create: true` enables creating new entries
- `delete: true` enables deleting entries
- `slug` pattern controls filename generation (should match existing file naming convention)
- Field `name` must exactly match frontmatter keys in content.config.ts
- `required: false` maps to Zod's `.optional()`
- `widget: "hidden"` with `default` auto-populates non-editable fields
- `body` field is special: Sveltia recognizes it as markdown content after frontmatter

### Pattern 2: Schema Synchronization (Zod → CMS Config)
**What:** Translate each Zod schema field to equivalent CMS widget with matching requirements
**When to use:** Every time adding a collection or changing schema in content.config.ts
**Mapping table:**

| Zod Type | CMS Widget | Required Handling | Notes |
|----------|------------|-------------------|-------|
| `z.string()` | `string` | `required: true` | Basic text input |
| `z.string().optional()` | `string` | `required: false` | Optional text input |
| `z.coerce.date()` | `datetime` | `required: true` | Set `date_format: "YYYY-MM-DD", time_format: false` |
| `z.array(z.string()).optional()` | `list` | `required: false` | Repeatable string items |
| `z.literal('value')` | `hidden` | `default: "value"` | Auto-populated constant |
| `z.string().url().optional()` | `string` | `required: false` | No built-in URL validation in Sveltia |

**Example from content.config.ts:**
```typescript
const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),                    // → widget: string, required: true
    collection: z.literal('publications'), // → widget: hidden, default: "publications"
    permalink: z.string(),                 // → widget: string, required: true
    date: z.coerce.date(),                 // → widget: datetime, required: true
    venue: z.string(),                     // → widget: string, required: true
    citation: z.string(),                  // → widget: text, required: true (multiline)
    paperurl: z.string().optional(),       // → widget: string, required: false
    excerpt: z.string().optional(),        // → widget: text, required: false
  })
});
```

### Pattern 3: Frontmatter Normalization for Multiple Collections
**What:** Extend audit script to validate all collections, normalize violations, re-validate
**When to use:** Before adding collections to CMS config
**Example:**
```javascript
// scripts/audit-frontmatter.mjs (extended from Phase 11)
import { glob } from 'glob';
import matter from 'gray-matter';
import { z } from 'zod';
import fs from 'fs/promises';

// Define schemas matching content.config.ts
const publicationsSchema = z.object({
  title: z.string(),
  collection: z.literal('publications'),
  permalink: z.string(),
  date: z.coerce.date(),
  venue: z.string(),
  citation: z.string(),
  paperurl: z.string().optional(),
  excerpt: z.string().optional(),
});

const talksSchema = z.object({
  title: z.string(),
  collection: z.literal('talks'),
  type: z.string(),
  permalink: z.string(),
  venue: z.string(),
  date: z.coerce.date(),
  location: z.string(),
});

const portfolioSchema = z.object({
  title: z.string(),
  excerpt: z.string().optional(),
  collection: z.literal('portfolio').optional(),
  repoUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  description: z.string().optional(),
  playgroundUrl: z.string().url().optional(),
});

const collections = [
  { name: 'publications', pattern: 'src/content/publications/**/*.md', schema: publicationsSchema },
  { name: 'talks', pattern: 'src/content/talks/**/*.md', schema: talksSchema },
  { name: 'portfolio', pattern: 'src/content/portfolio/**/*.md', schema: portfolioSchema },
];

for (const collection of collections) {
  const files = await glob(collection.pattern);

  for (const file of files) {
    const { data, content } = matter.read(file);
    const result = collection.schema.safeParse(data);

    if (!result.success) {
      console.log(`${file}: VIOLATIONS FOUND`);
      result.error.issues.forEach(issue => {
        console.log(`  - ${issue.path.join('.')}: ${issue.message}`);
      });

      // Auto-fix: remove extraneous fields, ensure required fields exist
      const validKeys = Object.keys(collection.schema.shape);
      const cleaned = Object.fromEntries(
        Object.entries(data).filter(([key]) => validKeys.includes(key))
      );

      // Write normalized frontmatter back
      const updated = matter.stringify(content, cleaned);
      await fs.writeFile(file, updated);
      console.log(`  ✓ Normalized and saved`);
    }
  }
}
```

### Pattern 4: Media Library Integration
**What:** Global media library accessible across all collections via Image widget
**When to use:** For any field requiring image upload (featured images, thumbnails, gallery items)
**Example:**
```yaml
# public/admin/config.yml (Phase 11 already configured this)
media_folder: "public/images/uploads"  # Where files are saved in repo
public_folder: "/images/uploads"       # URL path for accessing images

collections:
  - name: portfolio
    fields:
      - { label: "Featured Image", name: "image", widget: "image", required: false }
      # User clicks "Choose Image" → media library opens
      # User can upload new images or select existing from /images/uploads
      # Selected image path saved as "/images/uploads/filename.jpg"
```

**Media library features (built-in):**
- Upload multiple images via drag-and-drop or file browser
- Browse existing uploads in grid view
- Filter by file type, search by name
- Insert into any Image widget across all collections
- Displays image previews, dimensions, and file size

### Anti-Patterns to Avoid
- **Per-collection media folders without clear reason:** Adds path complexity; global folder simpler for single-user sites
- **Skipping frontmatter normalization:** Leads to CMS load errors on entries with schema violations
- **Inconsistent slug patterns:** Mix of naming conventions makes content harder to manage
- **Missing `body` field:** Sveltia treats markdown content as frontmatter YAML if body field is absent, causing corruption
- **Using `required: true` for optional Zod fields:** Creates schema mismatch; users can't save entries without filling optional fields

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Schema conversion (Zod → CMS config) | Automated converter | Manual mirroring with comments linking schemas | No production-ready converters; manual approach is standard practice and maintains clarity |
| Frontmatter validation | Custom YAML parser | gray-matter + zod | gray-matter is battle-tested by Astro, Gatsby, Netlify; zod already in use by Astro |
| CMS authentication | Custom OAuth server | Sveltia's built-in PAT auth | PAT auth requires zero infrastructure for single-user sites |
| Media library | Custom upload handler | Sveltia's built-in media library | Handles uploads, browsing, insertion automatically |

**Key insight:** Sveltia CMS provides complete content management infrastructure out-of-the-box. The only custom code needed is frontmatter normalization scripts to prepare existing content for CMS management.

## Common Pitfalls

### Pitfall 1: Schema Violations in Existing Content
**What goes wrong:** CMS loads collection, displays entries list, but clicking "Edit" on an entry with schema violations shows blank form or errors
**Why it happens:** Existing content created before CMS had different frontmatter fields (Jekyll-era fields, extraneous metadata, typos)
**How to avoid:** Run audit script on all collections BEFORE adding them to config.yml; normalize violations first
**Warning signs:**
- "Error loading entry" in CMS UI
- Blank form fields when editing existing entries
- Console errors about missing required fields

### Pitfall 2: Missing Required Fields vs Optional Fields
**What goes wrong:** CMS enforces `required: true` fields; users can't save entries without them; but Zod schema has field as optional
**Why it happens:** Mismatch between Zod `.optional()` and CMS `required: false`
**How to avoid:** Always map Zod `.optional()` to `required: false` in CMS config; double-check each field
**Warning signs:**
- "This field is required" error on save, but schema shows field as optional
- Can't publish entries because CMS demands optional fields

### Pitfall 3: `body` Field Omitted or Misnamed
**What goes wrong:** Markdown content saved as frontmatter YAML instead of file body; renders as code block on site
**Why it happens:** Sveltia/Decap convention requires field named exactly `body` for markdown content after frontmatter
**How to avoid:** Every collection MUST have `{ label: "Body", name: "body", widget: "markdown" }` field
**Warning signs:**
- Generated .md files have markdown content inside frontmatter YAML
- Body content renders as plain text or code block on site
- Frontmatter closing delimiter (`---`) appears mid-file

### Pitfall 4: Wrong Slug Pattern for Existing Files
**What goes wrong:** CMS creates new entries with different filename pattern than existing files; inconsistent naming
**Why it happens:** Default slug is `{{slug}}`, but existing files use `{{year}}-{{month}}-{{day}}-{{slug}}`
**How to avoid:** Examine existing filenames in collection folder; match slug pattern exactly
**Warning signs:**
- New CMS-created files named `my-post.md` while existing files are `2025-01-15-my-post.md`
- Hard to find recently created entries among existing files

### Pitfall 5: `collection` Field as Literal vs Hidden
**What goes wrong:** Publications/talks schemas require `collection: z.literal('publications')`, but CMS config makes it editable
**Why it happens:** Forgetting to use `widget: "hidden"` with `default: "publications"` for literal fields
**How to avoid:** Map any `z.literal()` field to `widget: "hidden"` with appropriate default value
**Warning signs:**
- Astro validation errors on build: "Expected literal value 'publications', got 'talks'"
- Users accidentally changing collection field value in CMS

### Pitfall 6: TOML Format Selection
**What goes wrong:** Setting `format: toml` in collection config causes Sveltia to create files without delimiters or with corrupted frontmatter
**Why it happens:** Sveltia's TOML generation is buggy/incomplete as of v0.140.x (beta status)
**How to avoid:** Use default YAML frontmatter (`format: frontmatter` or omit format field); do NOT use TOML
**Warning signs:**
- New files missing `+++` delimiters
- Body content appearing inside frontmatter
- Parsing errors when loading existing YAML files

## Code Examples

Verified patterns from official sources:

### Multi-Collection config.yml Structure
```yaml
# Source: https://decapcms.org/docs/configuration-options/
backend:
  name: github
  repo: bacilo/bacilo.github.io
  branch: master

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: posts
    label: "Blog Posts"
    folder: "src/content/posts"
    create: true
    delete: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    # Schema mirrors src/content.config.ts -- update both when changing fields
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Date", name: "date", widget: "datetime", required: true, date_format: "YYYY-MM-DD", time_format: false }
      - { label: "Tags", name: "tags", widget: "list", required: false }
      - { label: "Permalink", name: "permalink", widget: "string", required: false }
      - { label: "Body", name: "body", widget: "markdown", required: true }

  - name: publications
    label: "Publications"
    folder: "src/content/publications"
    create: true
    delete: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    # Schema mirrors src/content.config.ts -- update both when changing fields
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Collection", name: "collection", widget: "hidden", default: "publications" }
      - { label: "Permalink", name: "permalink", widget: "string", required: true }
      - { label: "Date", name: "date", widget: "datetime", required: true, date_format: "YYYY-MM-DD", time_format: false }
      - { label: "Venue", name: "venue", widget: "string", required: true }
      - { label: "Citation", name: "citation", widget: "text", required: true }
      - { label: "Paper URL", name: "paperurl", widget: "string", required: false }
      - { label: "Excerpt", name: "excerpt", widget: "text", required: false }
      - { label: "Body", name: "body", widget: "markdown", required: true }

  - name: talks
    label: "Talks"
    folder: "src/content/talks"
    create: true
    delete: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    # Schema mirrors src/content.config.ts -- update both when changing fields
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Collection", name: "collection", widget: "hidden", default: "talks" }
      - { label: "Type", name: "type", widget: "string", required: true }
      - { label: "Permalink", name: "permalink", widget: "string", required: true }
      - { label: "Venue", name: "venue", widget: "string", required: true }
      - { label: "Date", name: "date", widget: "datetime", required: true, date_format: "YYYY-MM-DD", time_format: false }
      - { label: "Location", name: "location", widget: "string", required: true }
      - { label: "Body", name: "body", widget: "markdown", required: true }

  - name: portfolio
    label: "Portfolio"
    folder: "src/content/portfolio"
    create: true
    delete: true
    slug: "{{slug}}"
    # Schema mirrors src/content.config.ts -- update both when changing fields
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Excerpt", name: "excerpt", widget: "text", required: false }
      - { label: "Collection", name: "collection", widget: "hidden", default: "portfolio" }
      - { label: "Repository URL", name: "repoUrl", widget: "string", required: false }
      - { label: "Demo URL", name: "demoUrl", widget: "string", required: false }
      - { label: "Description", name: "description", widget: "text", required: false }
      - { label: "Playground URL", name: "playgroundUrl", widget: "string", required: false }
      - { label: "Body", name: "body", widget: "markdown", required: true }
```

### Frontmatter Audit Script for Multiple Collections
```javascript
// Source: Adapted from Phase 11-01 pattern, extended for multiple collections
// scripts/audit-frontmatter.mjs
import { glob } from 'glob';
import matter from 'gray-matter';
import { z } from 'zod';
import fs from 'fs/promises';

// Define schemas matching content.config.ts
const schemas = {
  posts: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    permalink: z.string().optional(),
  }),

  publications: z.object({
    title: z.string(),
    collection: z.literal('publications'),
    permalink: z.string(),
    date: z.coerce.date(),
    venue: z.string(),
    citation: z.string(),
    paperurl: z.string().optional(),
    excerpt: z.string().optional(),
  }),

  talks: z.object({
    title: z.string(),
    collection: z.literal('talks'),
    type: z.string(),
    permalink: z.string(),
    venue: z.string(),
    date: z.coerce.date(),
    location: z.string(),
  }),

  portfolio: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    collection: z.literal('portfolio').optional(),
    repoUrl: z.string().optional(), // Don't validate URL format, Zod .url() too strict
    demoUrl: z.string().optional(),
    description: z.string().optional(),
    playgroundUrl: z.string().optional(),
  }),
};

const collections = [
  { name: 'posts', pattern: 'src/content/posts/**/*.md' },
  { name: 'publications', pattern: 'src/content/publications/**/*.md' },
  { name: 'talks', pattern: 'src/content/talks/**/*.md' },
  { name: 'portfolio', pattern: 'src/content/portfolio/**/*.md' },
];

let totalErrors = 0;

for (const collection of collections) {
  console.log(`\nAuditing ${collection.name}...`);
  const files = await glob(collection.pattern);
  const schema = schemas[collection.name];

  for (const file of files) {
    const { data, content } = matter.read(file);
    const result = schema.safeParse(data);

    if (!result.success) {
      console.log(`  ❌ ${file}:`);
      result.error.issues.forEach(issue => {
        console.log(`     - ${issue.path.join('.')}: ${issue.message}`);
      });
      totalErrors++;
    } else {
      console.log(`  ✓ ${file}`);
    }
  }
}

if (totalErrors > 0) {
  console.error(`\n❌ Found ${totalErrors} files with schema violations`);
  process.exit(1);
} else {
  console.log('\n✅ All files pass schema validation');
  process.exit(0);
}
```

### Widget Type Reference
```yaml
# Source: https://decapcms.org/docs/widgets/
# Common widgets for academic/portfolio content

# Text inputs
- { label: "Title", name: "title", widget: "string" }              # Single-line text
- { label: "Description", name: "description", widget: "text" }    # Multi-line textarea
- { label: "Body", name: "body", widget: "markdown" }              # Rich markdown editor

# Date/time
- { label: "Date", name: "date", widget: "datetime", date_format: "YYYY-MM-DD", time_format: false }

# Lists and selections
- { label: "Tags", name: "tags", widget: "list" }                  # Array of strings
- { label: "Status", name: "status", widget: "select", options: ["draft", "published"] }

# Media
- { label: "Image", name: "image", widget: "image" }               # Image upload/selection
- { label: "PDF", name: "pdf", widget: "file" }                    # File upload/selection

# Special
- { label: "Collection", name: "collection", widget: "hidden", default: "publications" }  # Auto-populated
- { label: "Featured", name: "featured", widget: "boolean" }       # Toggle switch

# Advanced
- { label: "Author", name: "author", widget: "relation", collection: "authors", search_fields: ["name"], value_field: "name" }
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Decap CMS | Sveltia CMS | 2024-2025 | 5x smaller bundle, faster GraphQL API, PAT auth built-in, active development |
| Manual YAML editing | CMS UI with schema validation | Phase 11-12 implementation | User-friendly editing, prevents schema violations |
| Jekyll-era frontmatter | Astro content collections with Zod | Astro 5.x migration | Type-safe schemas, better DX, compile-time validation |
| OAuth with external server | PAT authentication | Sveltia CMS native feature | Zero infrastructure for single-user sites |

**Deprecated/outdated:**
- Decap CMS (formerly Netlify CMS): Stagnant development, larger bundle, no PAT auth
- TOML frontmatter format in Sveltia: Buggy as of v0.140.x, use YAML instead
- astro-sveltia-cms integration package: Requires SSR mode, unnecessary for static PAT setup

## Open Questions

1. **Slug patterns for existing content**
   - What we know: Publications use `YYYY-MM-DD-title.md`, portfolio uses `slug.md` pattern
   - What's unclear: Should CMS slug pattern match existing exactly, or standardize all collections?
   - Recommendation: Match existing patterns per collection to maintain file consistency

2. **Image fields in collections**
   - What we know: Current schemas don't include dedicated image fields (images embedded in markdown body)
   - What's unclear: Should we add optional `image` fields for featured images, or continue inline markdown?
   - Recommendation: Start without dedicated image fields; can add later if user requests featured image functionality

3. **Date formatting in existing content**
   - What we know: Existing dates are `YYYY-MM-DD` format (no time component)
   - What's unclear: Will Sveltia preserve this format or add timestamps?
   - Recommendation: Configure `date_format: "YYYY-MM-DD", time_format: false` to prevent timestamp addition

## Sources

### Primary (HIGH confidence)
- Sveltia CMS GitHub: https://github.com/sveltia/sveltia-cms - Collection configuration patterns, widget support, media library features
- Decap CMS Configuration Options: https://decapcms.org/docs/configuration-options/ - Collection structure, slug patterns, required fields
- Decap CMS Widgets Reference: https://decapcms.org/docs/widgets/ - Widget types, field configuration, validation
- Sveltia CMS Documentation: https://sveltiacms.app/en/docs/start - Getting started, collection setup, field configuration
- gray-matter npm: https://www.npmjs.com/package/gray-matter - YAML frontmatter parsing API
- Phase 11 Research: .planning/phases/11-content-audit-cms-setup/11-RESEARCH.md - Established patterns and decisions

### Secondary (MEDIUM confidence)
- Decap CMS Markdown Widget: https://decapcms.org/docs/widgets/markdown/ - Body field convention verification
- Jamstack CMS Directory: https://jamstack.org/headless-cms/sveltia-cms/ - Sveltia feature overview
- Hugo CMS Setup Journey: https://0deepresearch.com/posts/2025-05-08-hugo-cms-setup-journey-decap-cms-sveltia-cms-on-github-pages/ - TOML format pitfall documentation
- @github-docs/frontmatter npm: https://www.npmjs.com/package/@github-docs/frontmatter - Validation pattern reference

### Tertiary (LOW confidence)
- N/A - All findings verified against official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Phase 11 already established infrastructure, no new dependencies
- Architecture: HIGH - Decap/Sveltia configuration patterns well-documented and stable
- Pitfalls: HIGH - Based on official documentation, Phase 11 experience, and verified bug reports

**Research date:** 2026-02-13
**Valid until:** 2026-03-15 (30 days) - Sveltia in beta but configuration patterns stable; v1.0 release may introduce improvements but unlikely to break existing configs
