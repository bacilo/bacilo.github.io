# Architecture Research: Decap CMS Integration with Astro

**Domain:** CMS Integration for Static Astro Site
**Researched:** 2026-02-13
**Confidence:** HIGH

## Executive Summary

Decap CMS integrates with Astro sites as a client-side Single Page Application (SPA) that commits directly to GitHub repositories. The architecture consists of three independent systems: (1) Decap CMS admin interface (static files), (2) OAuth authentication server (serverless functions), and (3) Astro static site (existing). The key architectural constraint for GitHub Pages hosting is that OAuth authentication requires an external serverless component (Cloudflare Workers, Vercel Functions, or similar), as GitHub's OAuth flow cannot be completed purely client-side.

**Critical Finding:** GitHub Pages can serve the static Decap CMS admin interface, but GitHub OAuth requires a separate serverless authentication proxy. The site remains fully static - Astro does NOT need SSR.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Layer (Browser)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │ Public Site  │      │ /admin Route │      │ OAuth Popup  │  │
│  │ (Astro)      │      │ (Decap CMS)  │      │ (External)   │  │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘  │
│         │                     │                     │           │
├─────────┴─────────────────────┴─────────────────────┴───────────┤
│                    Content & Auth Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              GitHub Repository (Source)                  │    │
│  │  - src/content/* (markdown files)                       │    │
│  │  - Stores all content, receives commits from CMS        │    │
│  └──────────────────────┬──────────────────────────────────┘    │
│                         │                                        │
│  ┌──────────────────────┴──────────────────────────────────┐    │
│  │         OAuth Serverless Proxy (External)                │    │
│  │  - Cloudflare Worker / Vercel Function                  │    │
│  │  - Handles GitHub OAuth handshake                       │    │
│  └──────────────────────┬──────────────────────────────────┘    │
│                         │                                        │
├─────────────────────────┴───────────────────────────────────────┤
│                    Build & Deploy Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │ GitHub       │      │ Astro Build  │      │ GitHub       │  │
│  │ Actions      │ ───> │ Process      │ ───> │ Pages        │  │
│  │ (Trigger)    │      │ (CI)         │      │ (Static)     │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| Decap CMS Admin Interface | React-based SPA for content editing, served as static files from `public/admin/` | `index.html` + `config.yml` loaded via CDN or npm |
| OAuth Serverless Proxy | Handles GitHub OAuth handshake (required by GitHub), returns JWT to CMS | Cloudflare Worker, Vercel Function, or AWS Lambda |
| Astro Static Site | Renders content from `src/content/` collections, serves admin files | Remains static (output: 'static'), no SSR required |
| GitHub Repository | Source of truth for all content, receives commits from CMS | Existing repo (bacilo.github.io) |
| GitHub Actions | CI/CD pipeline triggered by commits to master | Existing deploy.yml workflow |
| GitHub Pages | Static file hosting for both public site and admin interface | Existing hosting (pedropaf.com) |

## Integration Architecture

### Current State (Before CMS)

```
src/content/
├── posts/            # Blog posts (markdown)
├── publications/     # Academic publications (markdown)
├── talks/            # Talks (markdown)
└── portfolio/        # Portfolio items (markdown)

GitHub Actions (deploy.yml)
    ↓
Astro Build (npm run build)
    ↓
GitHub Pages (dist/)
```

### Future State (After CMS Integration)

```
public/admin/
├── index.html        # NEW: Decap CMS admin interface
└── config.yml        # NEW: CMS configuration

src/content/
├── posts/            # UNCHANGED: Managed via CMS
├── publications/     # UNCHANGED: Managed via CMS
├── talks/            # UNCHANGED: Managed via CMS
└── portfolio/        # UNCHANGED: Managed via CMS

External OAuth Server (Cloudflare Worker)
    ↓ (handles authentication)
Decap CMS Admin (/admin)
    ↓ (commits to GitHub)
GitHub Repository
    ↓ (triggers on push to master)
GitHub Actions (deploy.yml)
    ↓ (builds Astro site)
GitHub Pages (dist/)
```

**Key Architectural Insight:** Content collections require NO changes. Decap CMS commits markdown files to the existing `src/content/` directories, which Astro's build process already handles.

## Data Flow Diagrams

### Editorial Flow: Creating/Editing Content

```
1. Editor navigates to https://pedropaf.com/admin
      ↓
2. Decap CMS loads (static React app from public/admin/)
      ↓
3. User clicks "Login with GitHub"
      ↓
4. OAuth popup opens to Cloudflare Worker endpoint
      ↓
5. Worker redirects to GitHub OAuth authorization
      ↓
6. User authorizes app on GitHub
      ↓
7. GitHub redirects to Worker callback with auth code
      ↓
8. Worker exchanges code for access token
      ↓
9. Worker returns token to Decap CMS via postMessage
      ↓
10. Decap CMS stores token, fetches content from GitHub API
      ↓
11. User edits content in CMS interface
      ↓
12. User clicks "Publish"
      ↓
13. Decap CMS commits directly to GitHub via API (using token)
```

### Build & Deploy Flow: From Commit to Live Site

```
1. Decap CMS commits to src/content/posts/new-post.md
      ↓
2. GitHub detects push to master branch
      ↓
3. GitHub Actions deploy.yml workflow triggered
      ↓
4. Workflow checks out code
      ↓
5. Workflow runs: npm ci && npm run build
      ↓
6. Astro builds site (reads src/content/*, generates dist/)
      ↓
7. Workflow uploads dist/ artifact
      ↓
8. GitHub Pages deploys artifact
      ↓
9. https://pedropaf.com reflects new content
```

**Time to live:** Typically 2-5 minutes from CMS publish to visible on site.

### Authentication Flow: OAuth Handshake Detail

```
[Browser: pedropaf.com/admin]
      ↓ (1) Click "Login with GitHub"
      ↓
[Decap CMS opens popup]
      ↓ (2) Navigate to: https://oauth-proxy.workers.dev/auth
      ↓
[Cloudflare Worker]
      ↓ (3) 302 Redirect to: https://github.com/login/oauth/authorize
                              ?client_id=XXX
                              &redirect_uri=https://oauth-proxy.workers.dev/callback
      ↓
[GitHub OAuth Authorization Page]
      ↓ (4) User clicks "Authorize"
      ↓ (5) 302 Redirect to: https://oauth-proxy.workers.dev/callback?code=XXX
      ↓
[Cloudflare Worker]
      ↓ (6) POST to: https://github.com/login/oauth/access_token
                      with client_id, client_secret, code
      ↓ (7) GitHub returns: { access_token: "gho_XXX" }
      ↓ (8) Worker sends message to opener window:
                      window.opener.postMessage({
                        token: "gho_XXX",
                        provider: "github"
                      }, "https://pedropaf.com")
      ↓
[Decap CMS in pedropaf.com/admin]
      ↓ (9) Receives token, stores in memory/localStorage
      ↓ (10) Makes GitHub API calls with: Authorization: token gho_XXX
```

## Recommended Project Structure

```
bacilo.github.io/
├── public/
│   ├── admin/                    # NEW: Decap CMS files
│   │   ├── index.html           # NEW: CMS admin interface
│   │   └── config.yml           # NEW: Collections config
│   └── [existing static files]
├── src/
│   ├── content/                 # UNCHANGED: Content collections
│   │   ├── posts/              # UNCHANGED: Editable via CMS
│   │   ├── publications/       # UNCHANGED: Editable via CMS
│   │   ├── talks/              # UNCHANGED: Editable via CMS
│   │   └── portfolio/          # UNCHANGED: Editable via CMS
│   ├── layouts/                # UNCHANGED
│   ├── components/             # UNCHANGED
│   └── pages/                  # UNCHANGED
├── .github/
│   └── workflows/
│       └── deploy.yml          # UNCHANGED: Existing build process
├── astro.config.mjs            # UNCHANGED: Stays static
└── package.json                # OPTIONAL: Add decap-cms-app if using npm
```

### Structure Rationale

- **public/admin/:** Static files served by GitHub Pages, no build step needed for CMS
- **src/content/:** Zero changes required - Decap commits markdown here, Astro builds it
- **No SSR needed:** Astro remains `output: 'static'`, entire site pre-rendered
- **OAuth external:** Separate deployment (Cloudflare Worker) handles auth proxy

## Architectural Patterns

### Pattern 1: Git-Based CMS (Decap's Core Pattern)

**What:** Content management system that commits directly to Git repository instead of using a database.

**When to use:** Static sites where content is already stored as files in version control.

**Trade-offs:**
- PRO: Content versioned automatically, no database to manage, works with existing static site generators
- PRO: Content portable - not locked into a proprietary CMS database
- CON: No real-time collaboration (changes require commits)
- CON: Large media files problematic (Git LFS not supported with GitHub backend)
- CON: Editorial workflow creates pull requests (can clutter repo)

**Example:**
```yaml
# public/admin/config.yml
backend:
  name: github
  repo: bacilo/bacilo.github.io
  branch: master

collections:
  - name: "posts"
    label: "Blog Posts"
    folder: "src/content/posts"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Body", name: "body", widget: "markdown"}
```

### Pattern 2: OAuth Proxy for Static Sites

**What:** Serverless function that handles OAuth handshake, enabling client-side apps to authenticate with services requiring server-side OAuth flows.

**When to use:** When your static site needs GitHub authentication but can't run server-side code.

**Trade-offs:**
- PRO: Enables GitHub OAuth on static hosting (GitHub Pages, Netlify, etc.)
- PRO: Lightweight (single serverless function)
- PRO: Separate deployment from main site (can update independently)
- CON: Requires managing GitHub OAuth app credentials
- CON: Another deployment to maintain (though rarely changes)
- CON: Users must authorize the OAuth app (one-time friction)

**Example (Cloudflare Worker concept):**
```javascript
// Simplified - actual implementation more complex
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === '/auth') {
    // Redirect to GitHub OAuth
    return Response.redirect(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}`,
      302
    )
  }

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code')
    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code })
    })
    const { access_token } = await tokenResponse.json()

    // Return token to opener window
    return new Response(html`
      <script>
        window.opener.postMessage({ token: "${access_token}", provider: "github" }, "*")
        window.close()
      </script>
    `)
  }
}
```

### Pattern 3: Content Collections Schema Mapping

**What:** Decap CMS field configuration that mirrors Astro content collection schemas.

**When to use:** When integrating Decap with Astro content collections.

**Trade-offs:**
- PRO: CMS UI automatically validates content structure
- PRO: Prevents malformed frontmatter
- PRO: Type-safe content editing
- CON: Schema defined in two places (Astro schema + Decap config)
- CON: Changes require updating both configs

**Example:**
```yaml
# public/admin/config.yml - Decap schema
collections:
  - name: "publications"
    label: "Publications"
    folder: "src/content/publications"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Authors", name: "authors", widget: "list"}
      - {label: "Venue", name: "venue", widget: "string"}
      - {label: "Year", name: "year", widget: "number"}
      - {label: "PDF", name: "pdf", widget: "file"}
      - {label: "Abstract", name: "body", widget: "markdown"}
```

Mirrors this Astro schema (hypothetical):
```typescript
// src/content/config.ts
const publications = defineCollection({
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    pdf: z.string(),
  }),
})
```

## Anti-Patterns

### Anti-Pattern 1: Enabling SSR for CMS Integration

**What people do:** Add an Astro adapter (Node, Vercel, etc.) and enable `output: 'server'` or `output: 'hybrid'` to integrate Decap CMS.

**Why it's wrong:**
- Decap CMS admin interface is static HTML/JS - doesn't need SSR
- Breaks GitHub Pages hosting (requires static output)
- Adds unnecessary complexity and hosting requirements
- Some Astro-Decap integrations wrongly require SSR for OAuth routes

**Do this instead:**
- Keep Astro fully static (`output: 'static'`)
- Serve Decap admin from `public/admin/` (static files)
- Deploy OAuth proxy separately (Cloudflare Worker, not in Astro)
- GitHub Pages serves both public site AND admin interface as static files

### Anti-Pattern 2: Using Netlify Identity with GitHub Pages

**What people do:** Try to use Netlify Identity authentication while hosting on GitHub Pages.

**Why it's wrong:**
- Netlify Identity only works on Netlify-hosted sites
- Requires Netlify's backend services (not available on GitHub Pages)
- Git Gateway requires Netlify Identity (creates circular dependency)

**Do this instead:**
- Use GitHub backend directly (`backend: { name: github }` in config.yml)
- Deploy a separate OAuth proxy (Cloudflare Worker, Vercel Function)
- Configure Decap to use your OAuth proxy's base_url

### Anti-Pattern 3: Committing Media to src/content/

**What people do:** Configure media_folder to store uploads inside `src/content/` directories.

**Why it's wrong:**
- Bloats Git repository with binary files
- Slows down cloning, CI/CD builds
- GitHub has repository size limits
- Images should be in `public/` for Astro to serve them

**Do this instead:**
```yaml
# public/admin/config.yml
media_folder: "public/images/uploads"
public_folder: "/images/uploads"
```
- Media stored in `public/images/uploads/` (served as static files)
- Markdown references images via `/images/uploads/filename.jpg`
- Consider external media hosting (Cloudinary, etc.) for large sites

### Anti-Pattern 4: Modifying Content Collections Structure for CMS

**What people do:** Restructure existing content directories to match CMS expectations.

**Why it's wrong:**
- Breaks existing Astro pages that query content collections
- Requires migrating all content
- CMS should adapt to existing structure, not vice versa

**Do this instead:**
- Configure Decap collections to match existing `src/content/` folders
- Use `folder: "src/content/posts"` in config.yml
- Keep existing frontmatter fields, add new ones only if needed
- Test CMS with a single test post before rolling out widely

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GitHub API | OAuth + REST API | Decap uses GitHub API to read/write content files |
| OAuth Proxy | HTTP redirect flow | Handles GitHub OAuth handshake, returns token to CMS |
| GitHub Actions | Webhook trigger | Automatically triggered on commits from CMS |
| GitHub Pages | Static file serving | Serves both public site and /admin interface |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Decap CMS ↔ GitHub API | REST API (authenticated) | CMS reads/writes markdown files via API |
| OAuth Proxy ↔ GitHub OAuth | HTTP redirects + POST | Standard OAuth 2.0 flow |
| Admin Interface ↔ Public Site | None (independent) | /admin route is separate SPA, no shared state |
| Astro Build ↔ Content Collections | File system reads | Astro build process reads markdown files |

## Deployment Architecture

### Component Deployment Matrix

| Component | Hosting | Build Process | Update Trigger |
|-----------|---------|---------------|----------------|
| Public Site (Astro) | GitHub Pages | GitHub Actions (npm run build) | Git push to master |
| Admin Interface (Decap) | GitHub Pages (public/admin/) | None (static files) | Git push to master |
| OAuth Proxy | Cloudflare Workers | Wrangler CLI | Manual deploy or CI |
| Content (Markdown) | GitHub Repository | None (source files) | CMS commits or Git push |

### Critical Deployment Consideration

**The OAuth proxy is a separate deployment.** It does NOT live in the Astro project. This is a key architectural decision:

**Option A: Cloudflare Worker (Recommended)**
- Deploy: `wrangler deploy`
- Hosting: Cloudflare's edge network (free tier available)
- URL: `https://oauth-proxy.your-subdomain.workers.dev`
- Config in Decap: `base_url: https://oauth-proxy.your-subdomain.workers.dev`

**Option B: Vercel Serverless Function**
- Deploy: Separate Vercel project with /api routes
- Hosting: Vercel (free tier available)
- URL: `https://oauth-proxy.vercel.app/api`
- Config in Decap: `base_url: https://oauth-proxy.vercel.app/api`

**Option C: AWS Lambda + API Gateway**
- Deploy: SAM CLI or Serverless Framework
- Hosting: AWS (free tier available)
- URL: `https://xxx.execute-api.region.amazonaws.com/prod`
- More complex setup, only if already using AWS

## Authentication Architecture

### GitHub OAuth App Setup

Required in GitHub:
1. Create OAuth App at https://github.com/settings/developers
2. Set Authorization callback URL to OAuth proxy callback endpoint
3. Store Client ID (public) and Client Secret (secret)

### OAuth Proxy Configuration

The proxy needs:
- **Environment variables:**
  - `GITHUB_CLIENT_ID` (from OAuth app)
  - `GITHUB_CLIENT_SECRET` (from OAuth app - keep secure!)
  - `REDIRECT_ORIGIN` (your site URL, e.g., `https://pedropaf.com`)

### Security Considerations

| Concern | Mitigation |
|---------|------------|
| Client Secret Exposure | Stored in Worker environment variables, never in repo |
| Token Storage | Stored in browser localStorage (CMS handles this) |
| CORS Issues | OAuth proxy validates redirect origin |
| Man-in-the-Middle | All traffic over HTTPS (enforced by GitHub Pages & Cloudflare) |
| Token Expiry | GitHub tokens don't expire, but can be revoked by user |

## Build Order & Implementation Sequence

Based on architectural dependencies, implement in this order:

### Phase 1: OAuth Infrastructure (BLOCKING)
1. Create GitHub OAuth App (get Client ID/Secret)
2. Deploy OAuth proxy (Cloudflare Worker)
3. Test OAuth flow with sample page
**Blocker:** Cannot test Decap integration without working OAuth

### Phase 2: Decap CMS Basic Setup
1. Create `public/admin/index.html`
2. Create `public/admin/config.yml` with ONE collection (posts)
3. Configure backend + OAuth proxy base_url
4. Test login and view existing posts
**Blocker:** Requires Phase 1 complete

### Phase 3: Content Collections Mapping
1. Add remaining collections to config.yml (publications, talks, portfolio)
2. Map fields to match existing frontmatter schemas
3. Test creating/editing content in each collection
**Blocker:** Requires Phase 2 working

### Phase 4: Media Upload Configuration
1. Configure media_folder and public_folder
2. Test image uploads
3. Verify images render on public site
**Blocker:** None (can defer if not handling media initially)

### Phase 5: Editorial Workflow (OPTIONAL)
1. Enable `publish_mode: editorial_workflow` in config.yml
2. Test draft → review → publish flow
3. Verify pull requests created correctly
**Blocker:** None (optional feature)

## New vs. Modified Components

### New Components (To Be Created)

| File | Purpose | Estimated Lines |
|------|---------|-----------------|
| `public/admin/index.html` | Decap CMS admin interface entry point | ~30 |
| `public/admin/config.yml` | CMS configuration (collections, fields) | ~150-200 |
| OAuth Proxy (Cloudflare Worker) | GitHub OAuth handler | ~100-150 |

### Modified Components (None)

**Critical architectural finding:** NO existing Astro files need modification. The integration is additive:
- `astro.config.mjs` - UNCHANGED
- `src/content/*` - UNCHANGED (CMS writes here, but structure unchanged)
- `.github/workflows/deploy.yml` - UNCHANGED
- `package.json` - OPTIONAL (only if using npm package vs CDN)

### Unmodified Components (Remain As-Is)

- All Astro pages, layouts, components
- Content collection schemas (if defined)
- Build process and CI/CD
- GitHub Pages configuration
- Domain configuration

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| OAuth proxy downtime | Low | High (blocks CMS access) | Use reliable hosting (Cloudflare Workers 99.9%+ uptime) |
| GitHub API rate limits | Medium | Medium (CMS slow/fails) | Authenticate all requests (5000/hr vs 60/hr unauthenticated) |
| Media files bloating repo | High | Medium (slow builds) | Configure media in `public/`, consider external hosting |
| Accidental deletion via CMS | Medium | High (content loss) | Enable editorial workflow (creates PRs), Git history recovers deletions |
| Schema drift (Astro vs Decap) | Medium | Low (build errors) | Document schema in both places, test after changes |
| Client secret exposure | Low | High (security breach) | Store in Worker env vars, rotate if exposed |

## Alternatives Considered

### Alternative 1: Tina CMS
**Rejected because:** Requires Next.js or similar for backend, more complex setup, not as mature for Astro

### Alternative 2: Forestry/TinaCMS Cloud
**Rejected because:** Paid service, vendor lock-in, Decap is open-source and self-hosted

### Alternative 3: Contentlayer
**Rejected because:** Not a CMS (just a content SDK), still need editing interface

### Alternative 4: Sanity/Contentful
**Rejected because:** Requires migrating content out of Git, loses version control benefits, monthly costs

### Alternative 5: Build custom admin with Astro SSR
**Rejected because:** Breaks GitHub Pages compatibility, significant development time, security concerns

## Sources

### High Confidence (Official Documentation)
- [Decap CMS Official Documentation](https://decapcms.org/docs/intro/)
- [Decap CMS GitHub Backend](https://decapcms.org/docs/github-backend/)
- [Decap CMS Git Gateway](https://decapcms.org/docs/git-gateway-backend/)
- [Decap CMS Configuration Options](https://decapcms.org/docs/configuration-options/)
- [Decap CMS Editorial Workflows](https://decapcms.org/docs/editorial-workflows/)
- [Decap CMS Basic Steps](https://decapcms.org/docs/basic-steps/)
- [Decap CMS Installation](https://decapcms.org/docs/install-decap-cms/)
- [Decap CMS External OAuth Clients](https://decapcms.org/docs/external-oauth-clients/)
- [Astro CMS Guide: Decap CMS](https://docs.astro.build/en/guides/cms/decap-cms/)

### Medium Confidence (Community Resources)
- [advanced-astro/astro-decap-cms](https://github.com/advanced-astro/astro-decap-cms) - Integration package
- [dorukgezici/astro-decap-cms-oauth](https://github.com/dorukgezici/astro-decap-cms-oauth) - OAuth integration (requires SSR)
- [sterlingwes/decap-proxy](https://github.com/sterlingwes/decap-proxy) - Cloudflare Worker OAuth proxy
- [Cloudflare Workers OAuth Provider](https://github.com/cloudflare/workers-oauth-provider) - OAuth library
- [Building a Blog CMS with Decap CMS (2026)](https://dasroot.net/posts/2026/01/building-blog-cms-decap-netlify-cms/)
- [Decap CMS with Netlify: Git Gateway, Build Hooks Guide (2026)](https://dylanbochman.com/blog/2026-01-15-decap-cms-netlify-setup-guide/)

### Low Confidence (Flagged for Validation)
- None - all architectural findings verified through official documentation

---

*Architecture research for: Decap CMS Integration with Astro on GitHub Pages*
*Researched: 2026-02-13*
