# Coding Conventions

**Analysis Date:** 2026-02-11

## Overview

This is a Jekyll-based academic portfolio site with a mix of JavaScript (jQuery-based), Python (data generation), and YAML configuration. The codebase follows conventions typical of theme-based Jekyll sites with minimal custom code standards.

## Naming Patterns

**Files:**
- JavaScript files: `kebab-case.js` (e.g., `_main.js`, `collapse.js`, `org-locations.js`)
- Python scripts: `snake_case.py` (e.g., `publications.py`, `talks.py`, `pubsFromBib.py`)
- Data files: `snake_case.tsv` (e.g., `publications.tsv`, `talks.tsv`)
- Jekyll includes: `dash-separated-names.html` (e.g., `head.html`, `nav-footer.html`)
- Generated markdown: `YYYY-MM-DD-url-slug.md` (e.g., `2019-05-15-some-talk.md`)

**Variables and Functions:**
- JavaScript: `camelCase` for variables (e.g., `addressPoints`, `stickySideBar`, `html_escape_table`)
- Python: `snake_case` for variables and functions (e.g., `html_escape_table`, `html_escape()`, `location_dict`)
- jQuery DOM selectors: Use CSS selectors (e.g., `$(".author__urls-wrapper button")`, `$("#main")`)

**CSS Classes:**
- BEM-inspired naming: `component__element--modifier` (e.g., `author__urls-wrapper`, `mfp-figure`, `mfp-zoom-in`)
- State classes: `is-visible`, `is-hidden`, `open` (e.g., `.hidden`, `.open`)

## Code Style

**No formal linter enforced:**
- No `.eslintrc`, `.prettierrc`, or other linting configuration files present
- No automated formatting standards in place

**JavaScript Style (observed patterns):**
- Uses jQuery for DOM manipulation
- Indentation: 2-4 spaces observed
- Semicolon usage: Inconsistent (present in some files, absent in others)
- Comments: Block comments with `/* */` and inline `//` comments
- Function declarations: Mix of function declarations and function expressions

Example from `assets/js/_main.js`:
```javascript
$(document).ready(function(){
   // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;
```

**Python Style (observed patterns):**
- PEP 8 partially followed (e.g., `# coding: utf-8` at top of files)
- Uses docstrings for module-level documentation
- Indentation: 4 spaces
- Type checking: `type()` function used for runtime type validation

Example from `markdown_generator/publications.py`:
```python
def html_escape(text):
    """Produce entities within text."""
    return "".join(html_escape_table.get(c,c) for c in text)
```

## Import Organization

**JavaScript:**
- External libraries loaded via `<script>` tags in HTML (jQuery, plugins)
- No module system or import statements
- Libraries included in load order: jQuery first, then plugins, then custom scripts

**Python:**
- Standard library imports first
- Third-party imports after (e.g., `pandas`, `os`, `glob`, `getorg`, `geopy`)
- No wildcard imports observed

Example from `markdown_generator/talks.py`:
```python
import pandas as pd
import os
```

## Error Handling

**JavaScript:**
- No explicit error handling observed
- Relies on jQuery's silent failure for missing elements
- No try-catch blocks found in custom code

**Python:**
- No explicit error handling in data generation scripts
- Scripts assume data format correctness
- File operations assume read/write success

## Logging

**Framework:** Not used - no logging framework present

**Patterns:**
- `print()` statements used for debug output (e.g., `print(location, "\n", location_dict[location])` in `talkmap.py`)
- Commented-out console logging in JavaScript: `// console.log(...)`

## Comments

**When to Comment:**
- Block comments for major sections: `/* ========== Section Name ========== */`
- Inline comments for non-obvious logic
- Commented-out debug code preserved in files

Example from `assets/js/_main.js`:
```javascript
/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */
```

**JSDoc/TSDoc:**
- Minimal JSDoc usage
- Python docstrings used for function documentation

Example from `markdown_generator/publications.py`:
```python
def html_escape(text):
    """Produce entities within text."""
```

## Function Design

**Size:**
- Functions are generally small (10-30 lines)
- Data generation scripts have longer bodies (50-100 line loops with string concatenation)

**Parameters:**
- JavaScript: Minimal parameters, relies on jQuery context binding
- Python: Simple parameter lists

**Return Values:**
- JavaScript: Mix of explicit returns and side effects (DOM manipulation)
- Python: Explicit returns for data transformation; side effects for file I/O

## Module Design

**JavaScript:**
- No module exports/imports
- Global scope for jQuery objects and functions
- Self-contained plugin files for external libraries

**Python:**
- Scripts designed to be run as standalone executables or Jupyter notebooks
- No class definitions; function-based utilities
- Modules treated as notebooks with executable code

**Barrel Files:**
Not applicable - no module bundling system in use

## Type System

**JavaScript:**
- No TypeScript or JSDoc type annotations
- Dynamic typing with runtime type checking absent

**Python:**
- No type hints (pre-Python 3.5 style)
- Runtime type checking in functions: `if type(text) is str:`

Example from `markdown_generator/talks.py`:
```python
def html_escape(text):
    if type(text) is str:
        return "".join(html_escape_table.get(c,c) for c in text)
    else:
        return "False"
```

## String Handling

**Python:**
- String concatenation with `+` operator
- Template strings for multi-line YAML generation
- HTML entity escaping table for special characters

**JavaScript:**
- jQuery string methods (`addClass`, `removeClass`, `toggleClass`)
- String concatenation for HTML generation

## Constants

**Python:**
- Lookup tables defined as module-level dicts: `html_escape_table`
- Magic numbers used without constants (e.g., length check `> 3` or `> 5`)

**JavaScript:**
- jQuery selectors as global variables: `var $nav`, `var $btn`
- State tracking with plain arrays: `var breaks = []`

---

*Convention analysis: 2026-02-11*
