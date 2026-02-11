# Codebase Concerns

**Analysis Date:** 2026-02-11

## Tech Debt

**Non-standard Data Format for Publications & Talks:**
- Issue: Custom TSV format instead of industry-standard BibTeX or JSON
- Files: `markdown_generator/publications.py`, `markdown_generator/talks.py`, `markdown_generator/pubsFromBib.py`
- Impact: Difficult to integrate with other academic tools, citation managers, or databases. Makes it hard to scale publication management. Limited interoperability with academic metadata systems.
- Fix approach: Migrate to BibTeX format as primary storage and update Python scripts to parse BibTeX instead of custom TSV. Create a conversion script to migrate existing `publications.tsv` to BibTeX format.

**Deprecated Analytics Platform:**
- Issue: Google Universal Analytics is deprecated and no longer functioning (Google shut down Universal Analytics on July 1, 2023)
- Files: `_config.yml` (line 76), `_includes/analytics-providers/google-universal.html`
- Impact: Analytics collection not working; no tracking of site visitors. Not compliant with current Google Analytics standards.
- Fix approach: Update `_config.yml` to use Google Analytics 4 (GA4) instead. Replace `google-universal` provider with GA4 implementation.

**Incomplete Configuration Values:**
- Issue: Multiple placeholder/template values remain unfilled in `_config.yml`
- Files: `_config.yml` (lines 13, 86, 89, 106)
- Impact:
  - Site description shows "personal description" instead of actual bio
  - Author location shows "Location" placeholder
  - Google Scholar URL points to placeholder: "http://yourfullgooglescholarurl.com"
  - ORCID URL points to placeholder: "http://orcid.org/yourorcidurl"
- Fix approach: Replace all placeholder values with actual profile information. Add validation in build process to warn about unfilled fields.

**Deprecated jQuery and Older JavaScript Libraries:**
- Issue: jQuery 1.12.4 is old (released 2016) and no longer maintained. Bundled with aged dependencies.
- Files: `assets/js/vendor/jquery/jquery-1.12.4.min.js`, `package.json` (shows node-based build scripts)
- Impact: Security vulnerabilities, performance issues, incompatibility with modern JavaScript standards
- Fix approach: Evaluate need for jQuery (modern CSS can replace most use cases). If needed, upgrade to jQuery 3.x. Consider replacing with vanilla JavaScript or modern framework.

**Outdated NPM Dependencies:**
- Issue: Dev dependencies in `package.json` are very old (2015-2016 era): uglify-js 2.6.1, onchange 2.2.0, npm-run-all 1.7.0
- Files: `package.json` (lines 23-27)
- Impact: Security vulnerabilities, missing modern build optimizations, potential compatibility issues with newer Node.js versions
- Fix approach: Update all dependencies to latest stable versions. Migrate build tooling to modern alternatives like esbuild or Webpack 5+.

**Deprecated Gemfile Dependency Warning:**
- Issue: README explicitly warns about security vulnerabilities in Gemfile and recommends deleting Gemfile.lock
- Files: `README.md` (line 5), `Gemfile`
- Impact: Developers may have stale or vulnerable Ruby gems if they don't follow the warning. Build reproducibility is compromised.
- Fix approach: Lock gems to specific safe versions in Gemfile. Run `bundle audit` regularly. Document Ruby version requirement.

**Commented-Out Code and Features:**
- Issue: Multiple commented-out features in `_config.yml` with no explanation of when/why they're disabled
- Files: `_config.yml` (lines 22, 256-257, 294-302)
- Impact: Dead code, unclear feature status (e.g., talkmap_link is false, pagination commented out, jekyll-archives disabled)
- Fix approach: Document why features are disabled. Create GitHub issues for features to re-enable or remove completely.

## Known Bugs

**Talks.py Missing Date Assignment:**
- Bug: `date` field is not assigned to markdown in talks.py when location exists
- Files: `markdown_generator/talks.py` (line 87)
- Symptoms: Generated talk markdown files missing date in YAML front matter in some cases
- Trigger: When a talk has both venue and location fields, the date field logic is skipped
- Workaround: Manually add `date:` field to generated talk markdown files

**Nominatim Deprecation in talkmap.py:**
- Bug: `Nominatim()` initializer is deprecated and will fail in current geopy versions
- Files: `talkmap.py` (line 21)
- Symptoms: "User-Agent required" error when running talkmap.py. Geocoding fails entirely.
- Trigger: Running `python talkmap.py` to generate talk location maps
- Workaround: Manually edit talkmap.py to add User-Agent: `Nominatim(user_agent="my-app")`

## Security Considerations

**No HTTPS Enforcement in config:**
- Risk: While site URL is configured with https, there's no explicit enforcement or security headers configured
- Files: `_config.yml` (line 14)
- Current mitigation: GitHub Pages enforces HTTPS by default
- Recommendations: Add security headers via custom `_headers` file (GitHub Pages supports this). Test with HSTS preload if required.

**jQuery XSS Vulnerability:**
- Risk: Old jQuery 1.12.4 may have known XSS vulnerabilities if used with untrusted content
- Files: `assets/js/vendor/jquery/jquery-1.12.4.min.js`, any templates using it
- Current mitigation: Most content is trusted (self-generated academic content)
- Recommendations: Upgrade jQuery or remove if not essential. Audit all dynamic content generation.

**No Input Validation in Markdown Generators:**
- Risk: Python scripts accept arbitrary TSV/CSV input without validation
- Files: `markdown_generator/publications.py`, `markdown_generator/talks.py`
- Current mitigation: Only author has write access to source files
- Recommendations: Add schema validation for TSV input. Escape HTML/special chars more robustly.

## Performance Bottlenecks

**Large Font Files Not Optimized:**
- Problem: Multiple large SVG font files included inline
- Files: `assets/fonts/academicons.svg`, `assets/fonts/fa-*.svg` (each several MB minified)
- Cause: Icon fonts loaded for every page even if not all icons used. SVG fonts included instead of WOFF2.
- Improvement path: Convert to WOFF2 format, implement font subsetting, or use CSS-based icon library instead.

**Unminified Python/JavaScript in Assets:**
- Problem: Minification step in package.json requires manual npm run invocation
- Files: `assets/js/main.min.js`, build scripts in `package.json`
- Cause: Build pipeline is not automated in Jekyll. No pre-commit hook to ensure minified files are updated.
- Improvement path: Integrate minification into Jekyll build process via plugins or pre-build step.

**No Image Optimization:**
- Problem: Images directory likely contains unoptimized images
- Files: `/images/` directory (contains multiple PNG/JPG files)
- Cause: No image optimization in build pipeline
- Improvement path: Add image optimization tool (imagemin) to build process. Create responsive image sizes.

## Fragile Areas

**Markdown Generator Scripts - brittle string parsing:**
- Files: `markdown_generator/publications.py`, `markdown_generator/talks.py`
- Why fragile: Uses string concatenation and manual field length checks (`len(str(item.field)) > 3`) instead of proper YAML generation. HTML escaping is inconsistent.
- Safe modification: Use proper YAML library (PyYAML) instead of string concatenation. Add unit tests for edge cases (special characters, unicode, quotes).
- Test coverage: No test files exist for markdown generators

**Leaflet Talkmap Integration:**
- Files: `talkmap.py`, `talkmap/`, `talkmap.ipynb`
- Why fragile: Direct dependency on external geolocation service (Nominatim) with no error handling. Hard-coded paths and no configuration. Requires specific getorg version.
- Safe modification: Add try-catch around geocoding calls. Cache results to avoid repeated API calls. Add logging.
- Test coverage: No test files, no CI/CD validation

**Jekyll Configuration - many interdependencies:**
- Files: `_config.yml`, multiple layout files in `_layouts/`, includes in `_includes/`
- Why fragile: Changes to `_config.yml` cascading to multiple templates with no validation. Collection settings affect URL structure.
- Safe modification: Add Jekyll build validation. Create test pages for each collection type. Document configuration schema.
- Test coverage: No automated testing of Jekyll build output

## Scaling Limits

**Single Markdown Files for Publications/Talks:**
- Current capacity: Currently ~30-40 publications and talks total
- Limit: Linear performance degradation as files grow. Markdown generators load entire TSV into memory. No pagination or filtering optimization.
- Scaling path: Implement pagination in Jekyll. Consider database backend for large publication lists. Add search/filter functionality.

**Talkmap API Calls:**
- Current capacity: Nominatim rate limit is 1 request/second
- Limit: Script will time out with >100 talks due to geolocation API throttling
- Scaling path: Implement result caching. Use batch geocoding API. Consider alternative providers with higher limits.

## Dependencies at Risk

**github-pages Gem (primary dependency):**
- Risk: Pinned to rolling release (`gem "github-pages"` without version). Can break if GitHub Pages updates incompatibly.
- Impact: Jekyll build may fail unexpectedly when GitHub Pages updates dependencies
- Migration plan: Pin to specific GitHub Pages release version. Test locally with `bundle exec jekyll serve` before deployment.

**Geopy/Nominatim (for talkmap):**
- Risk: Nominatim API is community-maintained and can change. User-Agent requirements not documented in this repo.
- Impact: talkmap.py breaks when geopy version updates or Nominatim API changes
- Migration plan: Use geopy with explicit version pin. Document Nominatim API requirements. Add integration tests.

**Leaflet Marker Cluster (JavaScript):**
- Risk: Bundled version embedded in repo. No package manager integration. Library updates require manual file replacement.
- Impact: Security updates and bug fixes not automatically applied
- Migration plan: Use npm/CDN for Leaflet plugins instead of bundled files. Implement automated dependency updates.

## Missing Critical Features

**No Testing Infrastructure:**
- Problem: No test framework, no CI/CD pipeline, no automated quality checks
- Blocks: Can't confidently refactor or upgrade dependencies. No validation that site builds correctly.

**No Search/Navigation for Publications:**
- Problem: All publications listed on single page without search or filtering
- Blocks: Site doesn't scale well for researchers with many publications (>100)

**No Analytics Post Google Universal Analytics:**
- Problem: Analytics disabled with no replacement configured
- Blocks: Can't track site performance or user engagement metrics

## Test Coverage Gaps

**No Tests for Markdown Generators:**
- What's not tested: publications.py, talks.py, pubsFromBib.py - no unit tests, no integration tests
- Files: `markdown_generator/publications.py`, `markdown_generator/talks.py`, `markdown_generator/pubsFromBib.py`
- Risk: String parsing logic can fail silently with unexpected input (unicode, special chars, missing fields). YAML generation can be malformed.
- Priority: High - these scripts generate critical site content

**No Tests for Jekyll Configuration:**
- What's not tested: _config.yml validity, layout rendering, collection permalinks
- Files: `_config.yml`, `_layouts/`, `_includes/`
- Risk: Configuration errors can break entire site build or create broken links
- Priority: High - configuration affects all pages

**No Tests for Talkmap Generation:**
- What's not tested: talkmap.py geocoding, map HTML generation, Leaflet integration
- Files: `talkmap.py`, `talkmap.ipynb`
- Risk: Geocoding API failures, missing locations, broken map rendering
- Priority: Medium - feature is non-critical but when broken, completely non-functional

**No Tests for Build Pipeline:**
- What's not tested: CSS compilation from SASS, JavaScript minification, asset optimization
- Files: Build configuration, SASS files in `_sass/`, JavaScript in `assets/js/`
- Risk: Build failures silently produce incorrect assets
- Priority: Medium - GitHub Pages does some validation but local issues won't be caught

---

*Concerns audit: 2026-02-11*
