# Technology Stack

**Analysis Date:** 2026-02-11

## Languages

**Primary:**
- HTML (Liquid template language) - Generated page markup via Jekyll
- YAML - Configuration files and data files
- SCSS/SASS - Styling and CSS generation
- JavaScript - Client-side interactivity
- Markdown - Content authoring for posts, pages, and collections

## Runtime

**Environment:**
- Ruby (via GitHub Pages/Jekyll) - Static site generation

**Package Manager:**
- Bundler - Ruby dependency management
- npm - JavaScript build tool management

**Lockfile:**
- `Gemfile` present - No Gemfile.lock (intentionally excluded per README to avoid security vulnerabilities)
- `package.json` present - Standard npm dependencies for build scripts

## Frameworks

**Core:**
- Jekyll 3.x (via github-pages gem) - Static site generator for GitHub Pages
- Minimal Mistakes Theme 4.x - Jekyll theme providing layout and styling infrastructure

**Testing:**
- Not detected

**Build/Dev:**
- npm-run-all ^1.7.0 - Parallel/sequential task runner
- onchange ^2.2.0 - Watch mode for file changes
- uglify-js ^2.6.1 - JavaScript minification

## Key Dependencies

**Critical:**
- github-pages - Bundles all required Jekyll plugins and version management for GitHub Pages compatibility
- jekyll-feed - RSS feed generation
- jekyll-sitemap - XML sitemap generation
- jekyll-gist - GitHub Gist embedding
- jekyll-paginate - Post pagination
- jekyll-redirect-from - URL redirect support
- jemoji - GitHub emoji support

**Client-side (Vendor):**
- jQuery 1.12.4 (`assets/js/vendor/jquery/`) - DOM manipulation and AJAX
- jquery.fitvids.js - Responsive video embedding
- jquery.magnific-popup.js - Lightbox/popup functionality for images
- jquery.smooth-scroll.min.js - Smooth scrolling navigation
- jquery.greedy-navigation.js - Mobile-responsive navigation
- stickyfill.min.js - Sticky element polyfill

**Icon Fonts:**
- Font Awesome (v5.x based on fa-solid-900, fa-brands-400, fa-regular-400) - Icon library
- Academicons - Academic/research-related icons

## Configuration

**Environment:**
- Development override: `_config.dev.yml` provides local development settings
  - Overrides: base URL to localhost:4000, disables Google Analytics, enables Disqus dev shortname
  - SCSS style: expanded for development

**Build:**
- `_config.yml` - Main Jekyll configuration (312 lines)
  - Markdown processor: kramdown with GFM input
  - HTML compressor: jekyll-compress-html
  - Collections: teaching, publications, portfolio, talks
  - Sass output: compressed CSS
- `package.json` - npm build scripts for JavaScript bundling
  - Uglify task combines jQuery and plugins into `assets/js/main.min.js`
  - Watch mode monitors changes in `assets/js/`

## Platform Requirements

**Development:**
- Ruby with bundler for local Jekyll execution
- Node.js with npm for JavaScript build tasks
- No Docker or containerization required

**Production:**
- GitHub Pages (automatic deployment on git push)
- No custom runtime or infrastructure needed
- Static hosting via GitHub's CDN

---

*Stack analysis: 2026-02-11*
