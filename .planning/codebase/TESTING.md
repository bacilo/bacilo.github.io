# Testing Patterns

**Analysis Date:** 2026-02-11

## Test Framework

**Status:** No automated testing framework present

**No test infrastructure found:**
- No Jest, Mocha, Vitest, or other JavaScript test runners
- No Python unittest, pytest, or other test frameworks
- No test configuration files (jest.config.js, vitest.config.ts, etc.)
- No test files (*.test.js, *.spec.js, etc.)

**Assertion Library:**
- Not applicable - no testing framework in use

**Run Commands:**
Not defined - testing not configured in `package.json` or as separate npm scripts

## Test File Organization

**Current Status:**
- No dedicated test files or test directories exist
- No test/spec directories (`tests/`, `__tests__/`, `spec/`)
- Code is organized for single execution rather than testability

## Development Workflow

**Build Process:**
```bash
npm run build:js     # Minify JavaScript with uglify-js
npm run watch:js    # Watch JavaScript files for changes
npm run uglify      # Manual uglify execution
```

**Jekyll Development:**
```bash
bundle exec jekyll serve      # Local development server
jekyll serve with config:     _config.dev.yml
```

These commands are defined in `package.json` and used via npm scripts, but no test commands exist.

## Code Characteristics Affecting Testability

**JavaScript Code:**
- Uses jQuery for DOM manipulation (tightly coupled to DOM)
- No dependency injection
- Global scope pollution (`var $nav`, `var $btn`, `var breaks = []`)
- Event handlers attached via jQuery (`.on()`, `.resize()`, `.ready()`)
- Self-executing code in `$(document).ready()` blocks

Example from `assets/js/_main.js`:
```javascript
$(document).ready(function(){
   // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;

  bumpIt();
  // ... more DOM-dependent code
});
```

**Python Code:**
- Scripts designed for notebook execution (Jupyter) and command-line execution
- Direct file I/O without abstraction
- Depends on data files (TSV) existing at relative paths
- Global state in loop iterations (e.g., `location_dict`)
- No function-based structure for testability

Example from `markdown_generator/talks.py`:
```python
for row, item in talks.iterrows():
    md_filename = str(item.date) + "-" + item.url_slug + ".md"
    # ... builds md string over ~30 lines
    with open("../_talks/" + md_filename, 'w') as f:
        f.write(md)
```

## Areas That Could Benefit From Testing

**Data Generation Scripts:**
- `markdown_generator/publications.py` - Generates publication markdown files
- `markdown_generator/talks.py` - Generates talk markdown files
- `markdown_generator/pubsFromBib.py` - Converts BibTeX to markdown
- `talkmap.py` - Geolocation and map generation

These scripts currently have no validation that:
- Input TSV data is properly formatted
- HTML entity escaping handles all edge cases
- Generated markdown is valid YAML front matter
- File paths are created correctly

**JavaScript Interactivity:**
- Sticky footer recalculation (`bumpIt()`)
- Sticky sidebar toggle logic (`stickySideBar()`)
- Navigation menu dropdown (`greedy-navigation.js`)
- Image gallery initialization (`magnificPopup`)

These could benefit from unit tests for:
- Window resize event handling
- DOM state changes
- CSS class application/removal
- Selector correctness

## Testing Recommendations for Future Implementation

**JavaScript Testing:**
1. Extract DOM-manipulation functions into testable units
2. Use Jest or Vitest with jsdom for DOM testing
3. Test event handlers separately from DOM setup

**Python Testing:**
1. Create pytest-based test suite
2. Use temporary directories for file I/O testing
3. Mock data generation (CSV/TSV parsing)
4. Test YAML front matter generation
5. Add fixtures for test data (sample TSV files)

**No Coverage Metrics:**
- Code coverage not tracked
- No coverage requirements defined
- No coverage reporting tools configured

## Current Validation Approach

The only validation present is defensive checks within code:

**Python:**
```python
# Type checking in talks.py
if type(text) is str:
    return "".join(html_escape_table.get(c,c) for c in text)
else:
    return "False"

# Length checks before processing
if len(str(item.excerpt)) > 5:
    md += "\nexcerpt: '" + html_escape(item.excerpt) + "'"
```

**JavaScript:**
- jQuery's built-in safety (silent failures for missing selectors)
- No explicit validation before DOM operations

## Manual Testing

Based on code structure, manual testing approach:

1. **Build Testing:** `npm run build:js` creates minified output
2. **Server Testing:** `bundle exec jekyll serve` for visual inspection
3. **Data Generation:** Run Python scripts manually and inspect generated markdown files
4. **Browser Testing:** Manual testing in browser for interactive features

## Critical Gaps

1. **No validation of generated markdown** - Outputs could have invalid YAML
2. **No verification of input data** - Malformed TSV files would cause silent failures
3. **No tests for geolocation service** - `talkmap.py` calls external API without retry/error handling
4. **No edge case testing** - Special characters, unicode in titles/excerpts not validated
5. **No regression testing** - Layout changes not validated automatically

---

*Testing analysis: 2026-02-11*
