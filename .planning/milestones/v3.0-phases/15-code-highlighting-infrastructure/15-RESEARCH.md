# Phase 15: Code Highlighting Infrastructure - Research

**Researched:** 2026-02-16
**Domain:** Syntax highlighting and code display for Astro static sites
**Confidence:** HIGH

## Summary

Phase 15 implements syntax-highlighted code snippets across the site using Astro's built-in Shiki integration. The research confirms that Astro 5.x includes Shiki as a zero-configuration syntax highlighter that runs at build time, producing static HTML with no client-side JavaScript overhead. The phase must coordinate with Phase 14's theme system to ensure code blocks automatically match the selected site theme.

**Key findings:**
- Shiki is built into Astro 5.x — no additional npm packages required
- Dual-theme support (light/dark) is stable and well-documented in Astro 5.x
- Code highlighting happens at build time, resulting in zero runtime JavaScript cost
- CSS variables enable seamless coordination with the 8-theme system from Phase 14
- Markdown code fences work automatically; custom `<Code />` component available for advanced use cases

**Primary recommendation:** Configure Shiki with dual themes in `astro.config.mjs` and use CSS to coordinate with Phase 14's `[data-theme]` attribute system. Start with markdown code fences for simplicity, add custom components only if copy buttons or advanced features are needed later.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Shiki | Built-in (via Astro 5.x) | Build-time syntax highlighting | Industry standard for static sites, same engine as VS Code, 100+ languages, zero client JS |
| Astro `<Code />` | Built-in | Programmatic code highlighting in .astro files | First-party Astro component for dynamic code rendering |

**Installation:**
```bash
# No installation needed - Shiki is built into Astro 5.x
# Already have: astro@^5.0.0, @astrojs/mdx@^4.0.0
```

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @shikijs/transformers | Optional | Line highlighting, diffs, annotations | If adding advanced code features (line numbers, highlights, diffs) |
| Clipboard API | Native Web API | Copy-to-clipboard functionality | If implementing copy buttons on code blocks |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Shiki (build-time) | Prism.js (runtime) | Prism requires client-side JavaScript (~5KB), slower, but more dynamic customization |
| Shiki (build-time) | Highlight.js (runtime) | Similar to Prism — client-side overhead, no advantage over Shiki for static sites |
| Built-in markdown fences | react-syntax-highlighter | Requires React framework, 100KB+ bundle size, unnecessary complexity |
| CSS variables theme | Separate CSS files per theme | Requires page reload to switch themes, worse UX, harder to maintain |

**Why Shiki is standard for Astro:**
- Built-in since Astro 2.x, stabilized in 5.x
- Used by major documentation sites (Astro Docs, VitePress, VuePress)
- TextMate grammar = VS Code quality highlighting
- Build-time processing = zero runtime cost
- 100+ languages supported out of the box

## Architecture Patterns

### Recommended Project Structure

No new folders needed. Code highlighting is configured globally and used throughout existing content:

```
src/
  content/
    portfolio/*.md        # Use code fences in markdown content
    posts/*.md            # Use code fences in blog posts
  components/
    portfolio/
      CodeBlock.astro     # Optional: custom component with copy button
  styles/
    global.css            # Import themes.css from Phase 14
    themes.css            # Theme-aware code block styles (coordinate with Shiki)
astro.config.mjs          # Configure Shiki dual themes here
```

### Pattern 1: Dual-Theme Configuration (RECOMMENDED)

**What:** Configure Shiki to generate CSS variables for both light and dark themes, coordinate with Phase 14's theme system

**When to use:** Always — Phase 15 depends on Phase 14 theme system

**Configuration:**
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pedropaf.com',
  integrations: [mdx(), sitemap()],
  output: 'static',
  markdown: {
    shikiConfig: {
      // Dual theme support - generates CSS variables
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true, // Wrap long lines instead of horizontal scroll
      // Optional: pre-load common languages
      langs: ['javascript', 'typescript', 'python', 'bash', 'json', 'markdown', 'astro'],
    }
  },
});
```

**CSS Coordination (add to themes.css from Phase 14):**
```css
/* Default light theme - use light code colors */
:root .astro-code,
:root .astro-code span {
  color: var(--shiki-light) !important;
  background-color: var(--shiki-light-bg) !important;
}

/* Dark theme - switch to dark code colors */
[data-theme="dark"] .astro-code,
[data-theme="dark"] .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}

/* Auto theme with system preference */
@media (prefers-color-scheme: dark) {
  [data-theme="auto"] .astro-code,
  [data-theme="auto"] .astro-code span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
  }
}

/* Other themes (sepia, terminal, etc.) use closest match */
/* For simplicity, light themes use light code, dark themes use dark code */
[data-theme="sepia"] .astro-code,
[data-theme="lego"] .astro-code {
  color: var(--shiki-light) !important;
  background-color: var(--shiki-light-bg) !important;
}

[data-theme="terminal"] .astro-code,
[data-theme="minecraft"] .astro-code,
[data-theme="synthwave"] .astro-code {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

**Source:** [Astro Docs - Syntax Highlighting](https://docs.astro.build/en/guides/syntax-highlighting/), [Dual Shiki Themes with Astro](https://amanhimself.dev/blog/dual-shiki-themes-with-astro/)

### Pattern 2: Markdown Code Fences (PRIMARY USE CASE)

**What:** Use standard markdown triple-backtick syntax for code blocks

**When to use:** For all code examples in portfolio cards, blog posts, documentation

**Example:**
```markdown
---
title: Pomodoro Menu Bar App for Mac
---

## Installation

Install dependencies:

```bash
npm install
```

Then start the development server:

```typescript
import { defineConfig } from 'astro/config';
export default defineConfig({ ... });
```
```

**How it works:**
1. Markdown processor encounters code fence during build
2. Shiki transforms code into syntax-highlighted HTML
3. Static HTML shipped to browser (no JavaScript needed)
4. CSS variables from dual-theme config handle theme switching

**Source:** [Astro Docs - Markdown Code Blocks](https://docs.astro.build/en/guides/syntax-highlighting/)

### Pattern 3: Programmatic `<Code />` Component (ADVANCED)

**What:** Use Astro's built-in `<Code />` component for dynamic code rendering

**When to use:** When code comes from props, APIs, or needs to be programmatically generated (not from markdown)

**Example:**
```astro
---
import { Code } from 'astro:components';

const exampleCode = `
function hello() {
  console.log('Hello, world!');
}
`;
---

<Code code={exampleCode} lang="js" />
```

**Props:**
- `code` (required): String containing the code to highlight
- `lang` (required): Language identifier (e.g., 'js', 'python', 'bash')
- `theme` (optional): Override default theme for this block
- `wrap` (optional): Boolean to wrap long lines
- `inline` (optional): Boolean to render inline code

**Note:** `<Code />` component does NOT inherit `markdown.shikiConfig` settings. You must pass theme/options explicitly.

**Source:** [Astro Docs - Code Component](https://docs.astro.build/en/guides/syntax-highlighting/)

### Pattern 4: Optional Copy Button Component

**What:** Extend code blocks with copy-to-clipboard functionality

**When to use:** Phase 16 (Interactive Features) — deferred from Phase 15 for scope management

**Example (for reference, not implemented in Phase 15):**
```astro
---
// components/portfolio/CodeBlock.astro
interface Props {
  code: string;
  lang: string;
  title?: string;
}

const { code, lang, title } = Astro.props;
---

<div class="code-block">
  {title && <div class="code-title">{title}</div>}
  <Code code={code} lang={lang} />
  <button class="copy-btn" data-code={code}>Copy</button>
</div>

<script>
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const code = (e.target as HTMLElement).dataset.code || '';
      await navigator.clipboard.writeText(code);
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
  });
</script>
```

**Note:** Copy button requires client-side JavaScript and is out of scope for Phase 15 (covered in Phase 16: Interactive Features per requirement CODE-02).

### Anti-Patterns to Avoid

- **Using Prism or Highlight.js:** Adds client-side JavaScript when Shiki provides build-time highlighting
- **Hardcoding theme in shikiConfig:** Use `themes: { light, dark }` instead of single `theme:` to enable theme switching
- **Creating separate highlighted versions for each theme:** CSS variables handle switching automatically
- **Importing Shiki directly in components:** Use Astro's built-in markdown/`<Code />` integration instead
- **Loading highlight libraries client-side:** Defeats the purpose of static site generation

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Syntax highlighting | Custom regex-based highlighter | Shiki (built-in) | TextMate grammars handle 100+ languages with edge cases (strings, comments, nesting) |
| Language detection | Auto-detect from code content | Explicit lang attribute in fence | Accurate detection requires ML or large grammar libraries |
| Theme coordination | JavaScript theme switcher for code | CSS variables + data-theme | CSS cascade handles switching instantly, no JavaScript needed |
| Copy-to-clipboard | Custom selection + document.execCommand | Clipboard API | execCommand deprecated, Clipboard API is modern standard |
| Line highlighting | Manual span wrapping | Shiki transformers | Transformers handle line numbers, highlights, diffs automatically |

**Key insight:** Syntax highlighting is deceptively complex. TextMate grammars encode thousands of rules for accurate tokenization. Shiki provides VS Code-quality highlighting for free at build time.

## Common Pitfalls

### Pitfall 1: Code Block Theme Not Matching Site Theme

**What goes wrong:** User switches site to dark theme, but code blocks remain light (or vice versa). Visual inconsistency and poor contrast.

**Why it happens:** Forgetting to add CSS to coordinate Shiki's dual-theme output with Phase 14's `[data-theme]` attribute system.

**How to avoid:**
1. Configure dual themes in `astro.config.mjs` (see Pattern 1)
2. Add CSS rules to `themes.css` that match `[data-theme]` selectors to Shiki variables
3. Test all 8 themes with code blocks to verify switching works
4. Use `!important` to override Shiki's default inline styles

**Warning signs:**
- Code blocks don't change when switching themes
- Light code on light background (unreadable)
- Dark code on dark background (unreadable)
- Browser DevTools shows Shiki inline styles overriding CSS

**Fix:**
```css
/* GOOD: Overrides inline styles with !important */
[data-theme="dark"] .astro-code,
[data-theme="dark"] .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

**Source:** [Pitfalls documented in Phase 14 research](/.planning/research/PITFALLS.md#pitfall-5-theme-specific-syntax-highlighting-mismatch)

### Pitfall 2: Forgetting Language Identifier in Code Fences

**What goes wrong:** Code blocks render as plain text without syntax highlighting

**Why it happens:** Missing language identifier after opening backticks:
```markdown
<!-- WRONG: No language specified -->
```
function hello() {}
```

<!-- CORRECT: Language specified -->
```javascript
function hello() {}
```
```

**How to avoid:**
- Always include language identifier: ` ```javascript `, ` ```python `, ` ```bash `
- Use common aliases: `js` → `javascript`, `ts` → `typescript`, `sh` → `bash`
- Check Shiki's supported languages: https://shiki.style/languages

**Warning signs:**
- Code appears in monospace font but no syntax colors
- Browser DevTools shows `<pre><code>` without `.astro-code` class

**Detection:** Visual inspection of rendered pages. No build error occurs (Shiki treats it as plain text).

### Pitfall 3: Long Lines Causing Horizontal Scroll

**What goes wrong:** Code blocks with long lines require horizontal scrolling on mobile, poor reading experience

**Why it happens:** Default Shiki behavior preserves line length. Common in URLs, long import paths, or minified code.

**How to avoid:**
```javascript
// astro.config.mjs
shikiConfig: {
  wrap: true, // Enable line wrapping
}
```

**Alternative:** Format code examples to fit narrower viewports (manually break long lines).

**Warning signs:**
- Horizontal scrollbar on mobile devices
- Code extends beyond viewport width
- User complaints about readability

### Pitfall 4: Using `<Code />` Component Without Explicit Theme

**What goes wrong:** Programmatic code blocks don't match site theme because `<Code />` doesn't inherit `markdown.shikiConfig`

**Why it happens:** The `<Code />` component requires explicit theme prop:
```astro
<!-- WRONG: No theme specified -->
<Code code={myCode} lang="js" />

<!-- CORRECT: Explicit theme -->
<Code code={myCode} lang="js" theme="github-dark" />

<!-- BETTER: Use dual theme object -->
<Code
  code={myCode}
  lang="js"
  theme={{
    light: 'github-light',
    dark: 'github-dark'
  }}
/>
```

**How to avoid:** Prefer markdown code fences for static content. Use `<Code />` only when necessary (dynamic content).

**Warning signs:**
- Programmatic code blocks have different theme than markdown code fences
- Theme switching works for markdown but not `<Code />` components

**Source:** [Astro Docs - Code Component Caveat](https://docs.astro.build/en/guides/syntax-highlighting/)

### Pitfall 5: Client-Side Highlighting Breaking Static Build

**What goes wrong:** Importing client-side highlighting libraries (Prism, Highlight.js) defeats static site benefits

**Why it happens:** Developer habits from client-rendered frameworks (React, Vue apps) don't apply to static site generators

**Consequences:**
- JavaScript bundle increases by 10-50KB
- Highlighting flashes on page load (FOUC)
- Slower time to interactive
- Accessibility issues (unrendered content in SSR)

**How to avoid:** Always use Shiki's build-time highlighting. Never import runtime highlighters.

**Detection:**
- Build output shows large JavaScript chunks
- Browser DevTools Network tab shows prism.js or highlight.js
- Flash of unstyled code on page load

## Code Examples

Verified patterns from official sources:

### Basic Markdown Code Fence

```markdown
---
title: My Portfolio Project
---

## Usage Example

Here's how to initialize the project:

```bash
npm install
npm run dev
```

And here's the configuration:

```typescript
// astro.config.mjs
export default defineConfig({
  integrations: [mdx()],
});
```
```

**Source:** Standard markdown syntax, processed by Astro + Shiki

### Astro Config with Dual Themes

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pedropaf.com',
  integrations: [mdx(), sitemap()],
  output: 'static',
  markdown: {
    shikiConfig: {
      // Dual theme configuration
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // Wrap long lines
      wrap: true,
      // Pre-load common languages (optional optimization)
      langs: ['javascript', 'typescript', 'python', 'bash', 'json'],
    }
  },
});
```

**Source:** [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/)

### Theme-Aware CSS

```css
/* themes.css - Add to Phase 14's theme system */

/* Default (light theme and [data-theme="light"]) */
:root .astro-code,
:root .astro-code span {
  color: var(--shiki-light) !important;
  background-color: var(--shiki-light-bg) !important;
}

/* Dark theme */
[data-theme="dark"] .astro-code,
[data-theme="dark"] .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}

/* Auto theme respects system preference */
@media (prefers-color-scheme: dark) {
  [data-theme="auto"] .astro-code,
  [data-theme="auto"] .astro-code span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
  }
}

/* Map other themes to appropriate code theme */
/* Light-based themes → light code */
[data-theme="sepia"] .astro-code,
[data-theme="lego"] .astro-code {
  color: var(--shiki-light) !important;
  background-color: var(--shiki-light-bg) !important;
}

/* Dark-based themes → dark code */
[data-theme="terminal"] .astro-code,
[data-theme="minecraft"] .astro-code,
[data-theme="synthwave"] .astro-code {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}

/* Optional: Add border for visual separation */
.astro-code {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: var(--space-sm);
  margin: var(--space-sm) 0;
  overflow-x: auto;
}
```

**Source:** Pattern adapted from [Dual Shiki Themes Guide](https://amanhimself.dev/blog/dual-shiki-themes-with-astro/)

### Using `<Code />` Component (Advanced)

```astro
---
// Example: Displaying code from frontmatter or API
import { Code } from 'astro:components';

const snippetCode = `
function calculateStars(repo) {
  return repo.stargazers_count.toLocaleString();
}
`;
---

<div class="code-example">
  <h3>Implementation Example</h3>
  <Code
    code={snippetCode}
    lang="javascript"
    theme={{
      light: 'github-light',
      dark: 'github-dark'
    }}
  />
</div>
```

**Note:** Most use cases should use markdown code fences. Use `<Code />` only when code content is dynamic.

**Source:** [Astro Built-in Components - Code](https://docs.astro.build/en/guides/syntax-highlighting/)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Prism.js (client-side) | Shiki (build-time) | Astro 2.0 (2023) | Zero runtime JavaScript, faster loads, VS Code quality |
| Single theme config | Dual/multi-theme with CSS vars | Astro 4.0 (2024), stabilized in 5.0 | Seamless light/dark switching without page reload |
| Manual language detection | Explicit lang in code fence | Always required | More reliable, no ambiguity |
| `experimentalThemes` | `themes` (stable) | Astro 4.12+ (2024) | Production-ready dual themes |
| Separate CSS per theme | CSS variables `--shiki-*` | Shiki v1.0 (2024) | Single CSS file, runtime switching |

**Deprecated/outdated:**
- **Prism.js with Astro:** Astro removed Prism integration in favor of Shiki (build-time is superior)
- **`experimentalThemes` property:** Renamed to `themes` in Astro 4.12+, stable in 5.0
- **Manual theme switching with JS:** CSS variables + data-theme handle automatically

**Current best practice (2026):**
- Use Shiki with dual themes configured in `astro.config.mjs`
- Coordinate with site theme via CSS `[data-theme]` selectors
- Use markdown code fences for content, `<Code />` for dynamic cases
- Wrap long lines with `wrap: true`
- Test theme coordination across all site themes

## Open Questions

1. **Specific theme selection for light/dark**
   - What we know: Shiki supports 100+ themes, dual-theme config works
   - What's unclear: Best theme pairing for academic site (github-light/dark vs. solarized vs. rose-pine)
   - Recommendation: Start with `github-light`/`github-dark` (familiar, neutral). Easy to change later. User preference configurable via frontmatter in future.

2. **Handling 8 site themes with 2 code themes**
   - What we know: Shiki dual-theme mode supports exactly 2 themes (light/dark)
   - What's unclear: How to map 8 site themes (light, dark, sepia, terminal, minecraft, lego, synthwave, auto) to 2 code themes
   - Recommendation: Map based on brightness. Light-based site themes use `--shiki-light`, dark-based use `--shiki-dark` (see Pattern 1 CSS example)

3. **Performance with many code blocks**
   - What we know: Shiki runs at build time, no runtime cost
   - What's unclear: Build time impact with 10+ portfolio items each with 3-5 code blocks
   - Recommendation: Monitor build times. Shiki is fast (~100-200ms per page), acceptable for 10-20 pages. Cache bust if issues arise.

4. **Language support for academic content**
   - What we know: Shiki supports 100+ languages out of box
   - What's unclear: Which languages to pre-configure in `langs` array for optimization
   - Recommendation: Start with common web dev languages: `['javascript', 'typescript', 'python', 'bash', 'json', 'markdown', 'astro']`. Add others as needed.

5. **Advanced features (line numbers, highlighting, diffs)**
   - What we know: Shiki transformers available for these features
   - What's unclear: Whether requirements CODE-01 and CODE-04 need these features or just basic highlighting
   - Recommendation: Basic highlighting for Phase 15. Advanced features (transformers) deferred to Phase 16 if needed.

## Sources

### Primary (HIGH confidence)

- [Astro Docs - Syntax Highlighting](https://docs.astro.build/en/guides/syntax-highlighting/) - Official Astro documentation on Shiki integration
- [Astro Configuration Reference - markdown.shikiConfig](https://docs.astro.build/en/reference/configuration-reference/) - Complete shikiConfig options
- [Shiki Documentation](https://shiki.style/guide/) - Official Shiki project documentation
- [Shiki Themes](https://shiki.style/themes) - All available themes
- [Shiki Dual Themes Guide](https://shiki.matsu.io/guide/dual-themes) - How dual-theme mode works

### Secondary (MEDIUM confidence)

- [Dual Shiki Themes with Astro](https://amanhimself.dev/blog/dual-shiki-themes-with-astro/) - Community guide on implementing dual themes
- [Multiple Code Themes for Astro](https://horo.services/journal/multiple-code-themes-astro/) - Alternative approaches to theme coordination
- [Astro Shiki Syntax Highlighting with CSS Variables](https://christianpenrod.com/blog/astro-shiki-syntax-highlighting-with-css-variables) - CSS variable patterns

### Tertiary (LOW confidence - for reference)

- [Shiki Transformers Package](https://shiki.style/packages/transformers) - Advanced features (out of scope for Phase 15)
- [Adding Diff Highlighting with Shiki](https://usagi.io/articles/2024-04-24-adding-diff-highlighting-to-markdown-using-shiki/) - Diff notation examples

### Project-Specific (HIGH confidence)

- `.planning/phases/14-theme-system-foundation/14-01-PLAN.md` - Phase 14 theme system implementation details
- `.planning/research/PITFALLS.md` - Documented pitfalls including Pitfall 5 (theme coordination)
- `src/styles/themes.css` - Existing theme CSS with 8 data-theme definitions
- `src/layouts/BaseLayout.astro` - Theme script implementation from Phase 14

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Shiki is built into Astro, well-documented, stable
- Architecture patterns: HIGH - Dual-theme pattern verified in official docs and community tutorials
- Pitfalls: HIGH - Theme coordination is critical dependency on Phase 14, well-understood
- Code examples: HIGH - All examples verified against official documentation

**Research date:** 2026-02-16
**Valid until:** 90 days (Astro 5.x and Shiki are stable, infrequent breaking changes expected)

**Dependencies:**
- Astro 5.0+ (confirmed: project uses astro@^5.0.0)
- @astrojs/mdx 4.0+ (confirmed: project uses @astrojs/mdx@^4.0.0)
- Phase 14 theme system (confirmed: themes.css and BaseLayout.astro with data-theme attributes)

**Phase 15 scope boundaries:**
- IN SCOPE: Shiki configuration, markdown code fences, dual-theme CSS coordination, basic syntax highlighting
- OUT OF SCOPE: Copy buttons (Phase 16 - CODE-02), runnable widgets (Phase 17 - CODE-03), line highlighting/diffs (Phase 16 if needed), custom syntax highlighting themes

**Critical success factors:**
1. Code blocks MUST match site theme automatically (test all 8 themes)
2. Zero client-side JavaScript for highlighting (build-time only)
3. Works in all portfolio markdown content (test with existing .md files)
4. No performance regression (build time increase < 500ms acceptable)

**Next steps for planner:**
1. Create tasks to modify `astro.config.mjs` with dual-theme shikiConfig
2. Create tasks to add theme-aware CSS to `themes.css`
3. Create tasks to test code blocks in portfolio content
4. Create tasks to verify theme switching works for code blocks
5. Defer copy buttons and advanced features to Phase 16
