# External Integrations

**Analysis Date:** 2026-02-11

## APIs & External Services

**Comments System:**
- Disqus - Third-party comment hosting
  - Configuration: `_includes/comments-providers/disqus.html`
  - Config key: `site.comments.disqus.shortname` (in `_config.yml`)
  - Status: Configured but requires shortname to activate
  - Dev override: `_config.dev.yml` sets dev shortname `mmistakes-dev`

**Comment Moderation:**
- Staticman - Server-side comment submission handler
  - Configuration: `_includes/comments-providers/staticman.html`
  - Config key: `site.staticman.branch`, `site.repository`
  - Sends form submissions via AJAX to Staticman endpoint
  - Requires GitHub repository write access for comment commits
  - Email field hashing: md5 transform
  - Moderation: Enabled (comments reviewed before publishing)

**Analytics:**
- Google Universal Analytics (legacy)
  - Configuration: `_includes/analytics-providers/google-universal.html`
  - Config key: `site.analytics.google.tracking_id`
  - Loads tracking from `//www.google-analytics.com/analytics.js`
  - Status: Configured but requires tracking ID to activate
  - Dev override: `_config.dev.yml` disables analytics in development

**Alternative Comment Providers (Configured but Inactive):**
- Disqus - Email notification
- Discourse - Comment server embedding
- Facebook Comments Plugin
- Google Plus Comments (deprecated)

**Alternative Analytics Providers (Configured but Inactive):**
- Google Analytics (GA4)
- Custom analytics provider

## Data Storage

**Databases:**
- None - Static site generation with no runtime database

**File Storage:**
- Local filesystem only
  - Comments metadata: `_data/comments/{slug}/` (YAML format via Staticman)
  - Site assets: `assets/` directory
  - Images: `images/` directory
  - Documents: `files/` directory (user-uploadable PDFs, zip files, etc.)
  - Navigation/UI text: `_data/navigation.yml`, `_data/ui-text.yml`
  - Author profiles: `_data/authors.yml`

**Build Artifacts:**
- Generated during build: `_site/` directory (Jekyll output, not tracked in git)

**Caching:**
- None - Static HTML files served directly by GitHub Pages CDN

## Authentication & Identity

**Auth Provider:**
- None required for reading
- GitHub login required for commenting via Staticman (uses GitHub OAuth for moderation)

**Social Profile Linking:**
- Configured in `_config.yml` author section:
  - PubMed, Google Scholar, ResearchGate, GitHub, Twitter, LinkedIn, ORCID, etc.
  - Links are display-only (no API integration)

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Jekyll build logs in local development only
- Browser console logs for client-side errors
- Staticman form submission errors logged via browser (AJAX error handling in `_includes/comments-providers/staticman.html`)

## CI/CD & Deployment

**Hosting:**
- GitHub Pages (pedropaf.com, custom domain via CNAME)
- Automatic builds on git push to master branch
- Repository: `bacilo.github.io`

**CI Pipeline:**
- None detected - GitHub Pages handles Jekyll build automatically
- No GitHub Actions or external CI/CD system configured

## Environment Configuration

**Required Environment Variables:**
- None for production build (GitHub Pages auto-builds)

**Optional Configuration Values:**
- `site.analytics.google.tracking_id` - Google Analytics tracking ID
- `site.comments.disqus.shortname` - Disqus forum shortname
- `site.comments.provider` - Enable comment system (currently disabled)
- `site.staticman.branch` - Branch for Staticman comment commits (set to "gh-pages")
- `site.staticman.allowedFields` - Comment form fields: name, email, url, message
- `site.staticman.requiredFields` - Required: name, email, message

**Secrets Location:**
- No secrets file detected
- Config values in plain text in `_config.yml` (safe: contains no API keys or tokens)
- Development overrides in `_config.dev.yml` (not committed production secrets)

## Webhooks & Callbacks

**Incoming:**
- GitHub Pages webhook - Triggers Jekyll build on git push
- Staticman webhook endpoint - Configured via form action in `_includes/comments-providers/staticman.html`
  - Form submits to Staticman API endpoint for comment processing
  - Returns moderation status via AJAX response

**Outgoing:**
- None detected

## Feed & SEO Integration

**Feed Generation:**
- Atom feed at `/feed.xml` via jekyll-feed plugin
- XML sitemap at `/sitemap.xml` via jekyll-sitemap plugin
- Configured in `_config.yml`:
  - `atom_feed.path` - blank (uses default feed.xml)

**Social Metadata:**
- Open Graph / Twitter Card support via `_includes/seo.html`
- Google site verification fields in `_config.yml` (not configured)
- SEO-related includes: `seo.html`, structured data support

---

*Integration audit: 2026-02-11*
