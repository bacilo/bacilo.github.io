# Architecture

**Analysis Date:** 2026-02-11

## Pattern Overview

**Overall:** Static site generator with theme-based layout system

**Key Characteristics:**
- Jekyll-based static site generation (GitHub Pages compatible)
- Minimal Mistakes theme framework providing pre-built components
- Content-driven architecture where content files define structure
- Liquid templating system for dynamic layout composition
- Asset pipeline for CSS (SCSS) and JavaScript compilation

## Layers

**Content Layer:**
- Purpose: Define site content and metadata
- Location: `_pages/`, `_posts/`, `_publications/`, `_talks/`, `_teaching/`, `_portfolio/`, `_drafts/`
- Contains: Markdown files with YAML front matter
- Depends on: Layout layer for rendering
- Used by: Layout system to populate page content

**Layout Layer:**
- Purpose: Define HTML structure and page composition
- Location: `_layouts/`
- Contains: Base layout templates (compress, default, single, splash, archive-taxonomy, talk)
- Depends on: Include layer for reusable components
- Used by: Content files via layout property in front matter

**Component/Include Layer:**
- Purpose: Provide reusable template fragments
- Location: `_includes/` (core components), `_includes/head/`, `_includes/footer/`, `_includes/analytics-providers/`, `_includes/comments-providers/`
- Contains: Liquid templates for navigation, sidebar, header, footer, author profile, pagination, social sharing
- Depends on: Data layer and theme configuration
- Used by: Layouts and other includes

**Data Layer:**
- Purpose: Store configuration and structured data
- Location: `_data/`
- Contains: `navigation.yml` (menu links), `ui-text.yml` (UI strings), `authors.yml` (author info), `comments/` (user comments if enabled)
- Depends on: None
- Used by: Includes and layouts for rendering dynamic content

**Styling Layer:**
- Purpose: CSS styling for all pages
- Location: `_sass/` (SCSS source), `assets/css/` (compiled CSS)
- Contains: Component styles (_archive.scss, _page.scss, _navigation.scss, _sidebar.scss), theme variables (_variables.scss)
- Depends on: None
- Used by: Default layout wraps pages in styled containers

**Script/Interaction Layer:**
- Purpose: JavaScript functionality and enhancements
- Location: `assets/js/` (compiled and vendor scripts)
- Contains: Vendor libraries (jQuery, magnific-popup, smooth-scroll), plugins (greedy-navigation, fitvids), main minified bundle
- Depends on: None
- Used by: Default layout in scripts.html include

**Static Assets:**
- Purpose: Images and file downloads
- Location: `images/` (site images), `files/` (downloadable files), `talkmap/` (mapping tool)
- Contains: PNG/JPG images, PDFs, CSV data
- Depends on: None
- Used by: Content files for embedding

**Generator/Build Layer:**
- Purpose: Convert source to static HTML
- Location: `markdown_generator/` (Python tooling for bulk content generation), `talkmap/` (Jupyter notebook for mapping)
- Contains: Python scripts for generating markdown files from metadata
- Depends on: Content files
- Used by: Manual invocation to bootstrap or regenerate content

## Data Flow

**Page Rendering Flow:**

1. User requests `https://pedropaf.com/`
2. Jekyll processes `_pages/about.md` with layout: default and author_profile: true
3. Layout system resolves: `about.md` → `default.html` → `compress.html`
4. During rendering:
   - `default.html` includes `head.html`, `masthead.html`, `scripts.html`
   - `masthead.html` includes navigation from `_data/navigation.yml`
   - If author_profile: true, `sidebar.html` includes `author-profile.html` with data from `_config.yml`
   - Page content (markdown converted to HTML) inserted in main content area
5. SCSS compiled to CSS and injected in `<head>`
6. JavaScript files loaded for interactivity
7. Static HTML file generated: `index.html`

**Collection Item Rendering (Publications/Talks):**

1. Jekyll processes files in `_publications/` with `collection: publications`
2. Layout resolved: publication markdown → `single.html` → `default.html`
3. Single layout renders metadata (citation, date, venue) from YAML front matter
4. Content includes link to external resource via `paperurl` or `link` frontmatter
5. Static HTML generated at permalink: `/publication/[year]-[slug]/`

**State Management:**

- State is entirely in source files (markdown, YAML)
- No runtime state or database
- Generation time applied from file dates via Jekyll's date filter
- User comments stored in `_data/comments/` if Staticman provider enabled (currently disabled in config)

## Key Abstractions

**Collection Concept:**
- Purpose: Organize similar content types into browsable groups
- Examples: Publications (`_publications/`), Talks (`_talks/`), Teaching (`_teaching/`), Portfolio (`_portfolio/`)
- Pattern: YAML front matter specifies `collection: [name]`, permalink pattern configured in `_config.yml`, archive pages in `_pages/` aggregate collection items

**Layout Inheritance:**
- Purpose: Reduce template duplication
- Examples: `default.html` (base), `single.html` extends default, `talk.html` extends default
- Pattern: `layout: parent-name` in YAML front matter creates chain

**Include Fragments:**
- Purpose: Modular reusable components
- Examples: `author-profile.html`, `social-share.html`, `page__taxonomy.html`
- Pattern: `{% include filename.html %}` in layouts/includes

**Front Matter Metadata:**
- Purpose: Content-level configuration
- Pattern: YAML block at top of markdown files controls layout, permalink, display options (author_profile, read_time, comments, share)

## Entry Points

**Home Page:**
- Location: `_pages/about.md` with `permalink: /`
- Triggers: User visits root domain
- Responsibilities: Displays author bio, uses author-profile sidebar, acts as landing page

**Publications Page:**
- Location: `_pages/publications.md` and `_pages/collection-archive.html`
- Triggers: User navigates to `/publications/`
- Responsibilities: Aggregates all publication items, uses archive-single.html for listing

**Talks Page:**
- Location: `_pages/talks.html`
- Triggers: User navigates to `/talks/`
- Responsibilities: Lists talk collection items (currently commented out in navigation)

**Individual Publication:**
- Location: Any file in `_publications/`
- Triggers: User visits `/publication/[year]-[slug]/`
- Responsibilities: Renders single publication with citation, venue, date, external link

**Blog/Posts:**
- Location: Files in `_posts/` following YYYY-MM-DD naming
- Triggers: User visits `/posts/[year]/[month]/[slug]/`
- Responsibilities: Renders timestamped blog post with tags, comments option, sharing

## Error Handling

**Strategy:** Silent fallback with Liquid conditionals

**Patterns:**
- Metadata checks: `{% if page.title %}...{% endif %}` prevents errors on missing frontmatter
- Collection checks: `{% if site.related_posts.size > 0 %}...{% endif %}` prevents empty related sections
- Provider checks: `{% if site.comments.provider and page.comments %}...{% endif %}` only loads comments if enabled
- Layout fallbacks: Missing layout specified in front matter falls back to default
- Asset handling: CSS/JS are static and pre-built; missing assets result in 404 responses handled by web server

## Cross-Cutting Concerns

**Logging:** No application logging - Jekyll compilation output to stdout only

**Validation:** Front matter validated by Jekyll at build time; invalid YAML fails build with error message

**Authentication:** None - purely static site with no server-side logic

**SEO:** Implemented through:
- Site map auto-generated by jekyll-sitemap plugin at `/sitemap.xml`
- Meta tags in `_includes/head.html` for Open Graph, Twitter cards
- Schema.org markup in single.html with `itemscope` and `itemprop`
- Permalink structure optimized for URL clarity

**Analytics:** Integrated via `_includes/analytics-providers/google-universal-analytics.html` if configured in `_config.yml`

**Comments System:** Staticman integration template provided in `_includes/comments-providers/` (disabled by default in config)

---

*Architecture analysis: 2026-02-11*
