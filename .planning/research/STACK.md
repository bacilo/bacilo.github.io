# Stack Research

**Domain:** CMS Integration for Static Academic Website
**Researched:** 2026-02-13
**Confidence:** HIGH

## Recommended Stack

### Core CMS Technology

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Sveltia CMS | 0.140.3 | Git-based headless CMS | Modern successor to Decap CMS with better UX, performance, and active development. 100% compatible with Decap CMS config. Single-user PAT authentication works with static GitHub Pages. |
| Decap CMS | 3.10.0 | Git-based headless CMS (fallback) | Mature, still maintained (as of Jan 2026), works with Astro content collections. Use if Sveltia has compatibility issues. |

### Authentication (Single User - Recommended)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Personal Access Token (PAT) | N/A | GitHub authentication | Simplest approach for single-user scenarios. No server required, works with static GitHub Pages. Built into Sveltia CMS. |

### Authentication (Multi-User Alternative)

| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| Cloudflare Workers | N/A | OAuth proxy for GitHub | Only if you need multi-user support or non-technical editors. Requires Cloudflare account. Not needed for single-user setup. |
| sveltia-cms-auth | Latest | GitHub OAuth handler | Cloudflare Workers script for OAuth flow. Only needed for multi-user scenarios. |

### Configuration Files

| File | Purpose | Notes |
|------|---------|-------|
| public/admin/config.yml | CMS collection definitions | Maps to Astro content collections in src/content/ |
| public/admin/index.html | CMS admin interface | Loads Sveltia/Decap CMS SPA |

## Installation

### For Sveltia CMS (Recommended)

```bash
# No npm dependencies required for static GitHub Pages
# CMS is loaded via CDN in public/admin/index.html
```

**Setup files:**

1. Create `public/admin/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager</title>
</head>
<body>
  <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
</body>
</html>
```

2. Create `public/admin/config.yml` (see Configuration section)

### For Decap CMS (Fallback)

```bash
# Alternative: Install as npm package if you need deeper integration
npm install decap-cms-app
```

**Or use CDN in `public/admin/index.html`:**
```html
<script src="https://unpkg.com/decap-cms@^3.10.0/dist/decap-cms.js"></script>
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Sveltia CMS (PAT auth) | Decap CMS + Netlify Identity | Never - Netlify Identity is deprecated as of 2026 |
| Sveltia CMS (PAT auth) | Decap CMS + Git Gateway | Never - Git Gateway deprecated with Netlify Identity |
| Sveltia CMS (PAT auth) | astro-decap-cms-oauth integration | Never for GitHub Pages - requires SSR (output: "server"), incompatible with static sites |
| Sveltia CMS (PAT auth) | Pages CMS | If you prefer hosted service over self-managed CMS admin |
| Sveltia CMS | Decap CMS | Only if Sveltia compatibility issues arise |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| astro-decap-cms | Requires SSR mode, incompatible with static GitHub Pages | CDN-loaded Sveltia/Decap CMS |
| astro-decap-cms-oauth | Requires SSR mode, incompatible with static GitHub Pages | CDN-loaded Sveltia CMS with PAT auth |
| astro-sveltia-cms | Requires SSR mode, incompatible with static GitHub Pages | CDN-loaded Sveltia CMS with PAT auth |
| Netlify Identity | Deprecated as of 2026, no longer maintained | PAT authentication for single user |
| Git Gateway | Deprecated with Netlify Identity | GitHub backend with PAT |
| OAuth proxy solutions | Unnecessary complexity for single user | PAT authentication |
| decap-cms package | Legacy package name | decap-cms-app (if installing via npm) |

## Stack Patterns by Variant

**If single user (site owner only):**
- Use Sveltia CMS with Personal Access Token (PAT) authentication
- No server component required
- Works perfectly with static GitHub Pages
- Because: Simplest setup, no OAuth flow, no third-party services

**If multiple users (collaborators/editors):**
- Use Sveltia CMS with sveltia-cms-auth on Cloudflare Workers
- Requires Cloudflare Workers (free tier sufficient)
- Because: Enables OAuth flow for better UX with multiple users
- Note: Consider if GitHub Pages is still appropriate (may want to migrate to Netlify/Vercel)

**If complex multi-user needs:**
- Consider Pages CMS instead (hosted service)
- Supports email invitations, magic links
- Because: Better user management for non-technical editors

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Sveltia CMS 0.140.3 | Astro 5.x | Framework-agnostic, works via static files |
| Decap CMS 3.10.0 | Astro 5.x | Framework-agnostic, works via static files |
| Sveltia/Decap config.yml | Astro content collections | Collections in config.yml map to src/content/* folders |

## Configuration Details

### Example config.yml for Astro Content Collections

```yaml
backend:
  name: github
  repo: username/repo-name
  branch: master

media_folder: "public/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "src/content/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "string"}
      - {label: "Publish Date", name: "pubDate", widget: "datetime"}
      - {label: "Author", name: "author", widget: "string"}
      - {label: "Body", name: "body", widget: "markdown"}

  - name: "publications"
    label: "Publications"
    folder: "src/content/publications"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Authors", name: "authors", widget: "string"}
      - {label: "Year", name: "year", widget: "number"}
      - {label: "Venue", name: "venue", widget: "string"}
      - {label: "PDF URL", name: "pdf", widget: "string", required: false}
      - {label: "Body", name: "body", widget: "markdown"}

  - name: "talks"
    label: "Talks"
    folder: "src/content/talks"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Event", name: "event", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Location", name: "location", widget: "string"}
      - {label: "Slides URL", name: "slides", widget: "string", required: false}
      - {label: "Body", name: "body", widget: "markdown"}

  - name: "portfolio"
    label: "Portfolio"
    folder: "src/content/portfolio"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "string"}
      - {label: "Image", name: "image", widget: "image"}
      - {label: "URL", name: "url", widget: "string", required: false}
      - {label: "Body", name: "body", widget: "markdown"}

  - name: "pages"
    label: "Pages"
    files:
      - label: "About Page"
        name: "about"
        file: "src/content/pages/about.md"
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Body", name: "body", widget: "markdown"}
```

## Integration with Existing Stack

**Astro 5.x compatibility:** ✅ Excellent
- Sveltia/Decap CMS are framework-agnostic
- Load as static files in public/admin/
- Access via yoursite.com/admin

**Content Collections compatibility:** ✅ Excellent
- config.yml collections map 1:1 to src/content/ folders
- Frontmatter fields defined in config.yml
- CMS writes standard markdown files

**TypeScript compatibility:** ✅ Excellent
- CMS doesn't interfere with TypeScript
- Content schema still defined in Astro config

**GitHub Pages deployment:** ✅ Excellent (with PAT auth)
- No build changes required
- CMS is client-side SPA
- Commits directly to GitHub repo
- GitHub Actions still handles rebuild

**CSS custom properties:** ✅ No conflict
- CMS UI is isolated in /admin
- Site styles unaffected

## Authentication Setup (PAT Method)

1. Generate GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope
   - Save token securely

2. Access CMS:
   - Navigate to yoursite.com/admin
   - Click arrow next to "Sign In" button
   - Select "Use Personal Access Token"
   - Paste your token
   - Token stored in browser localStorage

3. Security considerations:
   - Token has full repo access (required for commits)
   - Only use on trusted devices
   - Rotate token periodically
   - Consider token expiration settings

## Sources

### High Confidence (Official Documentation)
- [Decap CMS & Astro Official Guide](https://docs.astro.build/en/guides/cms/decap-cms/) — Integration patterns, configuration examples
- [Decap CMS GitHub Releases](https://github.com/decaporg/decap-cms/releases) — Version 3.10.0 confirmed (Jan 8, 2026)
- [Sveltia CMS GitHub Repository](https://github.com/sveltia/sveltia-cms) — Version 0.140.3 confirmed (Feb 12, 2026)
- [Decap CMS GitHub Backend Documentation](https://decapcms.org/docs/github-backend/) — Backend configuration
- [Decap CMS Configuration Options](https://decapcms.org/docs/configuration-options/) — Collection schema definitions
- [Decap CMS Git Gateway Documentation](https://decapcms.org/docs/git-gateway-backend/) — Authentication options

### Medium Confidence (Community Projects & Discussions)
- [astro-decap-cms Integration](https://github.com/advanced-astro/astro-decap-cms) — SSR requirement confirmed
- [astro-decap-cms-oauth Integration](https://github.com/dorukgezici/astro-decap-cms-oauth) — SSR requirement confirmed
- [astro-sveltia-cms Integration](https://github.com/majesticostudio/astro-sveltia-cms) — SSR requirement confirmed
- [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) — Cloudflare Workers OAuth proxy
- [Netlify Identity Deprecation Discussion](https://github.com/decaporg/decap-cms/discussions/7419) — Deprecation confirmed
- [Sveltia CMS PAT Authentication](https://github.com/sveltia/sveltia-cms/discussions/218) — Single-user PAT method

### Medium Confidence (Third-Party Articles & Resources)
- [Hugo CMS Setup Journey on GitHub Pages](https://0deepresearch.com/posts/2025-05-08-hugo-cms-setup-journey-decap-cms-sveltia-cms-on-github-pages/) — Real-world static site setup
- [Pages CMS Overview](https://pagescms.org/) — Alternative CMS comparison
- [Decap CMS Alternatives in 2026](https://sitepins.com/blog/decapcms-alternatives) — Market landscape, Netlify maintenance status
- [GitHub Pages CMS Options](https://www.jekyllpad.com/blog/cms-for-github-pages) — Static hosting authentication patterns

---
*Stack research for: Decap CMS integration with Astro on GitHub Pages*
*Researched: 2026-02-13*
