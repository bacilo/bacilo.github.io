# Codebase Structure

**Analysis Date:** 2026-02-11

## Directory Layout

```
bacilo.github.io/
├── _config.yml                    # Main Jekyll configuration
├── _config.dev.yml                # Development overrides (local testing)
├── _data/                         # Structured data files (YAML/JSON)
│   ├── navigation.yml             # Main menu links configuration
│   ├── ui-text.yml                # UI string translations
│   ├── authors.yml                # Author metadata
│   └── comments/                  # Staticman comment storage (if enabled)
├── _includes/                     # Reusable Liquid template fragments
│   ├── head/                      # Head section components
│   ├── footer/                    # Footer section components
│   ├── analytics-providers/       # Analytics integration templates
│   ├── comments-providers/        # Comments system integration templates
│   ├── author-profile.html        # Sidebar author bio component
│   ├── masthead.html              # Top navigation bar
│   ├── sidebar.html               # Right sidebar layout
│   ├── archive-single.html        # List item template for collections
│   ├── archive-single-cv.html     # CV-style list item
│   ├── page__hero.html            # Hero banner component
│   ├── page__taxonomy.html        # Tags/categories display
│   ├── social-share.html          # Social sharing buttons
│   ├── pagination.html            # Post pagination
│   └── [other components]         # Comments, breadcrumbs, galleries, etc.
├── _layouts/                      # HTML template layouts
│   ├── compress.html              # Wraps all pages, minifies HTML
│   ├── default.html               # Base layout (head, nav, footer structure)
│   ├── single.html                # Individual page/post/publication layout
│   ├── talk.html                  # Talk-specific layout
│   ├── splash.html                # Hero page layout
│   ├── archive.html               # Archive page layout
│   └── archive-taxonomy.html      # Taxonomy archive (tags/categories)
├── _pages/                        # Static pages (non-blog, non-collection)
│   ├── about.md                   # Home page (/ permalink)
│   ├── publications.md            # Publications collection page
│   ├── talks.html                 # Talks archive page
│   ├── teaching.html              # Teaching archive page
│   ├── portfolio.html             # Portfolio archive page
│   ├── cv.md                      # Curriculum vitae page
│   ├── 404.md                     # 404 error page
│   ├── category-archive.html      # Category taxonomy page
│   ├── tag-archive.html           # Tag taxonomy page
│   ├── year-archive.html          # Post chronological archive
│   └── [other pages]              # Static pages for documentation
├── _posts/                        # Blog posts (timestamped content)
│   ├── 2012-08-14-blog-post-1.md
│   ├── 2013-08-14-blog-post-2.md
│   └── [more posts]
├── _publications/                 # Academic publication collection
│   ├── 2008-01-01-License-to-chill-*.md
│   ├── 2010-01-01-Mind-the-body-*.md
│   └── [more publications]
├── _talks/                        # Talk/presentation collection
│   ├── 2012-03-01-talk-1.md
│   └── [more talks]
├── _teaching/                     # Teaching materials collection
├── _portfolio/                    # Portfolio projects collection
├── _drafts/                       # Unpublished posts (not compiled)
├── _sass/                         # SCSS source stylesheets
│   ├── _variables.scss            # Color, font, spacing variables
│   ├── _mixins.scss               # Reusable SCSS mixins
│   ├── _base.scss                 # Base element styles
│   ├── _page.scss                 # Page/article content styles
│   ├── _archive.scss              # Archive/collection list styles
│   ├── _navigation.scss           # Navigation/masthead styles
│   ├── _sidebar.scss              # Sidebar styles
│   ├── _footer.scss               # Footer styles
│   ├── _buttons.scss              # Button styles
│   ├── _forms.scss                # Form element styles
│   ├── _animations.scss           # CSS animation definitions
│   ├── _utilities.scss            # Utility classes
│   ├── _syntax.scss               # Code syntax highlighting
│   ├── _tables.scss               # Table styles
│   ├── _notices.scss              # Alert/notice box styles
│   ├── _print.scss                # Print stylesheet
│   ├── _reset.scss                # CSS reset
│   └── vendor/                    # Third-party SCSS libraries
│       ├── breakpoint/            # Breakpoint responsive mixin library
│       └── magnific-popup/        # Magnific Popup lightbox styles
├── assets/                        # Compiled static assets
│   ├── css/                       # Compiled CSS from _sass/
│   │   └── main.css               # All stylesheets compiled and concatenated
│   ├── js/                        # JavaScript files
│   │   ├── vendor/                # Third-party libraries
│   │   │   └── jquery/
│   │   ├── plugins/               # jQuery plugins
│   │   ├── _main.js               # Main application JS
│   │   └── main.min.js            # Minified JS bundle
│   └── fonts/                     # Web fonts (FontAwesome, etc.)
├── images/                        # Image assets (logos, avatars, featured images)
│   ├── profile.png                # Author profile picture
│   └── [other images]
├── files/                         # Downloadable files (PDFs, documents, etc.)
├── talkmap/                       # Talk mapping visualization tool
│   ├── talkmap.ipynb              # Jupyter notebook for map generation
│   ├── talkmap.py                 # Python script for location mapping
│   └── leaflet_dist/              # Leaflet.js map library
├── markdown_generator/            # Python tooling for bulk markdown generation
│   ├── [scripts for generating content]
├── package.json                   # NPM package config for JS build tools
├── Gemfile                        # Ruby gem dependencies (Jekyll plugins)
├── README.md                      # Repository documentation
├── CHANGELOG.md                   # Version history
├── LICENSE                        # MIT license
└── .gitignore                     # Git ignore rules

```

## Directory Purposes

**_config.yml:**
- Purpose: Master configuration file for Jekyll
- Contains: Site title, author info, URL settings, collection definitions, plugin configuration, markdown processor settings, defaults for all pages/posts/collections
- Key settings: `title`, `url`, `baseurl`, `collections`, `defaults`, `plugins`, `exclude`, `include`

**_data/:**
- Purpose: Store configuration and metadata in reusable data structures
- Contains: Navigation menus, UI text strings, author information, comments
- Access pattern: In Liquid templates via `site.data.filename` (e.g., `site.data.navigation.main`)

**_includes/:**
- Purpose: Reusable template components included by layouts
- Contains: Logical fragments (header, footer, navigation), component templates (author-profile, social-share), provider integrations (analytics, comments)
- Naming: Files use `.html` extension, subdirectories group related components

**_layouts/:**
- Purpose: Define page HTML structure
- Contains: Complete HTML templates that wrap content
- Inheritance: Layouts reference parent layouts via `layout:` frontmatter (compress → default → single)
- Usage: Pages/posts specify layout in YAML front matter

**_pages/:**
- Purpose: Static pages not tied to dates
- Contains: About page, archive/list pages, documentation, static pages
- Key: Files use `permalink:` frontmatter to define URL paths
- Difference from _posts: No date requirement, designed for stable pages

**_posts/:**
- Purpose: Time-stamped blog content
- Naming convention: YYYY-MM-DD-slug-title.md
- Behavior: Automatically dated, ordered chronologically, included in blog feeds
- Permalink: Generated as `/posts/YYYY/MM/slug/` unless overridden

**_publications/, _talks/, _teaching/, _portfolio/:**
- Purpose: Typed content collections (not time-ordered)
- Behavior: Defined in _config.yml `collections:` with `output: true`
- Permalink: Uses collection name in URL (e.g., `/publication/slug`)
- Display: Archive pages in _pages/ aggregate and list items

**_sass/:**
- Purpose: Source SCSS stylesheets (compiled to CSS at build time)
- Structure: Modular files for different components, vendor directory for third-party
- Compilation: All files compiled into single `assets/css/main.css` during build
- Variables: Centralized in `_variables.scss` for theming

**assets/:**
- Purpose: Compiled/built assets delivered to browser
- Structure: Subdirectories for CSS, JS, fonts
- JS: Source files (plugins/) and vendor/ compiled to minified main.min.js
- CSS: Auto-compiled from _sass/
- Build process: NPM scripts in package.json handle uglification

**images/, files/, talkmap/:**
- Purpose: Static asset hosting
- Images: Used in markdown or layouts via `![alt]({{ site.url }}/images/file.png)`
- Files: Linked from content for downloads (PDFs, datasets)
- Talkmap: Interactive map tool for visualizing talk locations

**markdown_generator/:**
- Purpose: Development tool for bulk content generation
- Usage: Scripts to convert CSV/structured data into markdown files
- Example: Could bulk-generate publication markdown from bibliography database

## Key File Locations

**Entry Points:**
- `_pages/about.md`: Home page (permalink: /)
- `_pages/publications.md`: Publications archive
- `_pages/talks.html`: Talks archive (commented out in nav)
- `_pages/teaching.html`: Teaching archive
- `_layouts/default.html`: Root layout template - defines basic HTML structure

**Configuration:**
- `_config.yml`: Primary configuration (title, URL, collections, defaults, plugins)
- `_config.dev.yml`: Development config overrides
- `package.json`: JavaScript build scripts
- `Gemfile`: Ruby dependencies (Jekyll plugins)
- `.gitignore`: Files excluded from version control

**Core Logic:**
- `_layouts/`: All page rendering logic in Liquid templates
- `_includes/`: Reusable fragments for navigation, sidebar, pagination, etc.
- `_data/`: Dynamic content (navigation menu, UI text)

**Styling:**
- `_sass/_variables.scss`: Theme colors, fonts, spacing constants
- `_sass/_base.scss`: Element defaults
- `_sass/_page.scss`: Page/article specific styles
- `_sass/_navigation.scss`: Navigation styling
- `assets/css/main.css`: Compiled final CSS (auto-generated)

**Testing:**
- No automated test files present

## Naming Conventions

**Files:**
- Markdown content: `YYYY-MM-DD-slug-title.md` (for posts), `title.md` (for pages)
- Layouts: `name.html` (kebab-case for multi-word)
- Includes: `name.html` or `name` (no extension in includes)
- Styles: `_name.scss` (underscore prefix for partials)
- Scripts: `_name.js` or `name.min.js` (minified = .min.js)

**Directories:**
- Collection directories: Plural with underscore prefix (`_posts`, `_publications`)
- Config/template directories: Underscore prefix (`_data`, `_includes`, `_layouts`)
- Built/compiled directories: No underscore (`assets`, `images`, `files`)
- Nested includes: Group-name as directory (`_includes/head/`, `_includes/footer/`)

**URLs/Permalinks:**
- Home: `/` (via about.md)
- Posts: `/posts/YYYY/MM/slug/` (auto-generated)
- Publications: `/publication/YYYY-MM-DD-slug/` (via collection permalink)
- Pages: `/page-slug/` (via permalink frontmatter)

## Where to Add New Code

**New Feature:**
- Primary code: Implement in appropriate collection (`_publications/`, `_talks/`, etc.) or layout (`_layouts/`)
- Styles: Add SCSS to `_sass/` (new file if substantial, or to existing component file)
- JavaScript: Add to `assets/js/` and uglify via `npm run build:js`

**New Page (Static):**
- Implementation: `_pages/new-page.md` with frontmatter including layout and permalink
- Navigation: Add link to `_data/navigation.yml` to surface in masthead

**New Reusable Component:**
- Implementation: `_includes/component-name.html`
- Usage: Include in layouts via `{% include component-name.html %}`
- If requires parameters: Pass via Liquid vars like `{% include component-name.html var1=value1 %}`

**New Collection Type:**
- Definition: Add to `_config.yml` under `collections:` section
- Directory: Create `_collectionname/` folder
- Archive page: Create `_pages/collectionname-archive.html` to list items
- Layout: Create `_layouts/collectionname.html` if different from default single.html
- Navigation: Add to `_data/navigation.yml` for discoverability

**Utilities/Shared Styles:**
- Shared styles: `_sass/_utilities.scss`
- Shared mixins: `_sass/_mixins.scss`
- Theme colors/vars: `_sass/_variables.scss`

**Build Scripts:**
- NPM scripts: Add to `package.json` scripts section
- Requires: `node-version` or `.nvmrc` to specify Node version

## Special Directories

**node_modules/:**
- Purpose: NPM package dependencies
- Generated: Yes (from npm install)
- Committed: No (excluded via .gitignore)
- Rebuild: Run `npm install` after git clone

**_site/ (generated at build time):**
- Purpose: Output directory containing final static HTML
- Generated: Yes (by Jekyll)
- Committed: No (excluded via .gitignore)
- Regenerate: Run `jekyll build`

**.jekyll-cache/ (generated at build time):**
- Purpose: Jekyll build cache
- Generated: Yes (by Jekyll)
- Committed: No (excluded via .gitignore)

**.git/:**
- Purpose: Version control repository
- Contains: Commit history, branches, remotes
- Committed: Yes

---

*Structure analysis: 2026-02-11*
