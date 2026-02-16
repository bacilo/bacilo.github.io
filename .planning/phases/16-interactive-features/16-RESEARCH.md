# Phase 16: Interactive Features - Research

**Researched:** 2026-02-16
**Domain:** Client-side interactivity (theme switcher UI, copy-to-clipboard buttons)
**Confidence:** HIGH

## Summary

Phase 16 implements two interactive features that complete the theme system and code highlighting infrastructure from Phases 14-15:

1. **Theme switcher UI component** - Dropdown/select interface allowing users to manually choose any of 8 themes, with localStorage persistence and zero-FOUC inline script coordination
2. **Copy-to-clipboard buttons** - One-click code snippet copying using the Clipboard API with visual feedback and accessibility support

Both features use vanilla JavaScript/TypeScript with Astro's client-side script patterns. No new npm dependencies required. Implementation builds directly on existing infrastructure:
- Theme switcher integrates with Phase 14's CSS theme system (`data-theme` attribute + localStorage detection script)
- Copy buttons integrate with Phase 15's Shiki code blocks (`.astro-code` elements)

**Key architectural insight:** These features represent the **interactive layer** completing the foundation laid in Phases 14-15. Phase 14 provided the CSS theme definitions and FOUC-prevention infrastructure; Phase 16 adds the user control interface. Phase 15 provided static syntax highlighting; Phase 16 adds the copy functionality.

**Primary recommendation:** Implement both features as small, focused Astro components using `<script>` tags for client-side interactivity. Follow existing patterns from `src/scripts/github-api.ts` for localStorage usage and error handling.

## Standard Stack

### Core (Already Installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^5.0.0 | Component framework with built-in client script support | Already installed. Provides `<script>` tags with automatic bundling and `is:inline` directive for critical scripts |
| TypeScript | ^5.7.0 | Type safety for event handlers and DOM manipulation | Already installed. Enables type-safe theme values and clipboard API usage |

### Browser APIs (No Installation)

| API | Browser Support | Purpose | Why Standard |
|-----|----------------|---------|--------------|
| Clipboard API (`navigator.clipboard.writeText()`) | Baseline widely available since March 2020 | Copy code to clipboard | Modern standard, replaces deprecated `document.execCommand('copy')`. Requires HTTPS and user gesture. |
| localStorage | Universal support | Theme preference persistence | Existing pattern in project (see `src/scripts/github-api.ts` for cache). Simple, synchronous, sufficient for small data. |
| CSS Custom Properties | Universal support | Theme color variables | Already used in Phase 14. Single `data-theme` attribute change updates all colors via cascade. |

### No New Dependencies Needed

The project already has all necessary tools:
- Astro for component structure and script bundling
- TypeScript for type safety
- Browser APIs for interactivity
- Existing theme infrastructure from Phase 14
- Existing code block structure from Phase 15

**Installation:**
```bash
# No installation required - use existing stack
```

## Architecture Patterns

### Recommended Project Structure

Additions to existing structure:
```
src/
  components/
    ThemeSwitcher.astro    # NEW: Theme selection dropdown component
  scripts/
    copy-code.ts           # NEW: Copy button initialization and clipboard logic
  styles/
    themes.css             # EXISTING: Already has theme definitions from Phase 14
  layouts/
    BaseLayout.astro       # MODIFY: Add ThemeSwitcher component to header/footer
```

### Pattern 1: Astro Component with Client-Side Script

**What:** Astro component with inline `<script>` tag for client-side interactivity

**When to use:** Need to add event listeners or manipulate DOM after page load

**Example - Theme Switcher Component:**
```astro
---
// src/components/ThemeSwitcher.astro
// No runtime props needed - purely client-side logic
const themes = [
  { value: 'auto', label: 'Auto (System)' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'minecraft', label: 'Minecraft' },
  { value: 'lego', label: 'Lego' },
  { value: 'synthwave', label: 'Synthwave' },
];
---

<div class="theme-switcher">
  <label for="theme-select" class="visually-hidden">Select theme</label>
  <select id="theme-select" class="theme-select">
    {themes.map(theme => (
      <option value={theme.value}>{theme.label}</option>
    ))}
  </select>
</div>

<style>
  .theme-switcher {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .theme-select {
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-header-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  .theme-select:hover {
    border-color: var(--color-link);
  }

  .theme-select:focus {
    outline: 2px solid var(--color-link);
    outline-offset: 2px;
  }
</style>

<script>
  type Theme = 'auto' | 'light' | 'dark' | 'sepia' | 'terminal' | 'minecraft' | 'lego' | 'synthwave';
  const STORAGE_KEY = 'site-theme';

  function getStoredTheme(): Theme {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored as Theme) || 'auto';
    } catch {
      return 'auto';
    }
  }

  function applyTheme(theme: Theme): void {
    if (theme === 'auto' || theme === 'light') {
      // Remove attribute to use :root defaults or media query
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  function saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      console.warn('[Theme] Could not save preference:', err);
    }
  }

  // Initialize on load
  const select = document.getElementById('theme-select') as HTMLSelectElement;
  if (select) {
    const currentTheme = getStoredTheme();
    select.value = currentTheme;

    select.addEventListener('change', (e) => {
      const newTheme = (e.target as HTMLSelectElement).value as Theme;
      applyTheme(newTheme);
      saveTheme(newTheme);
    });
  }
</script>
```

**Key points:**
- Script runs after HTML is parsed (bundled by Astro, not inline)
- Type safety with TypeScript
- Error handling for localStorage (private browsing)
- Coordinates with existing inline script in BaseLayout.astro

**Source:** [Astro Scripts and Event Handling Docs](https://docs.astro.build/en/guides/client-side-scripts/)

---

### Pattern 2: Event Delegation for Multiple Elements

**What:** Use `querySelectorAll` with `forEach` to attach listeners to multiple instances

**When to use:** Same component appears multiple times on page (e.g., many code blocks with copy buttons)

**Example - Copy Button Initialization:**
```typescript
// src/scripts/copy-code.ts

interface CopyButtonOptions {
  successDuration?: number;
  successText?: string;
  errorText?: string;
}

export function initCopyButtons(options: CopyButtonOptions = {}): void {
  const {
    successDuration = 2000,
    successText = 'Copied!',
    errorText = 'Failed to copy'
  } = options;

  document.querySelectorAll<HTMLButtonElement>('.copy-button').forEach(button => {
    button.addEventListener('click', async () => {
      const code = button.getAttribute('data-code');
      if (!code) return;

      const originalText = button.textContent;
      const originalAriaLabel = button.getAttribute('aria-label');

      try {
        await navigator.clipboard.writeText(code);
        button.textContent = successText;
        button.setAttribute('aria-label', successText);
        button.classList.add('copy-success');
      } catch (err) {
        console.error('[Copy] Failed:', err);
        button.textContent = errorText;
        button.classList.add('copy-error');
      }

      // Reset after delay
      setTimeout(() => {
        button.textContent = originalText;
        if (originalAriaLabel) {
          button.setAttribute('aria-label', originalAriaLabel);
        }
        button.classList.remove('copy-success', 'copy-error');
      }, successDuration);
    });
  });
}
```

**Usage in component:**
```astro
---
// Component that renders code with copy button
const { code, lang = 'text' } = Astro.props;
---

<div class="code-wrapper">
  <button
    class="copy-button"
    data-code={code}
    aria-label="Copy code to clipboard"
  >
    Copy
  </button>
  <pre class="astro-code"><code>{code}</code></pre>
</div>

<script>
  import { initCopyButtons } from '../scripts/copy-code';
  initCopyButtons();
</script>
```

**Key points:**
- Script runs once per page, finds all buttons
- Each button gets its own listener
- Astro bundles and minifies automatically
- Uses async/await for clipboard API

**Source:** [How to Work With Event Listeners in Astro](https://webtips.dev/event-listeners-in-astro)

---

### Pattern 3: Coordinating with Existing Inline Script

**What:** Client-side script coordinating with blocking inline script from Phase 14

**When to use:** Need to sync user interaction (dropdown) with FOUC-prevention script

**Coordination flow:**
```
Page load
  ↓
BaseLayout inline script runs (BEFORE paint)
  - Reads localStorage 'site-theme'
  - Sets data-theme attribute immediately
  ↓
Page renders with correct theme (no FOUC)
  ↓
ThemeSwitcher script runs (AFTER DOMContentLoaded)
  - Reads localStorage 'site-theme'
  - Sets dropdown to match
  - Adds event listener for changes
  ↓
User changes dropdown
  - Event listener fires
  - Sets data-theme attribute
  - Saves to localStorage
  - CSS cascade applies new theme instantly
```

**Implementation:**
```astro
---
// src/layouts/BaseLayout.astro (existing from Phase 14)
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <!-- EXISTING: Phase 14 inline script - runs immediately, before paint -->
    <script is:inline>
      (function() {
        try {
          var t = localStorage.getItem('site-theme');
          if (t && t !== 'auto' && t !== 'light') {
            document.documentElement.setAttribute('data-theme', t);
          } else if (t === 'auto') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.setAttribute('data-theme', 'auto');
            }
          }
        } catch (e) {}
      })();
    </script>

    <!-- rest of head -->
  </head>
  <body>
    <header>
      <!-- NEW: Add theme switcher to header -->
      <ThemeSwitcher />
    </header>
    <!-- rest of layout -->
  </body>
</html>
```

**Key points:**
- Inline script (Phase 14) handles initial load
- ThemeSwitcher script (Phase 16) handles user interaction
- Both read/write same localStorage key ('site-theme')
- Both apply theme same way (data-theme attribute)
- No conflicts because inline runs first, component runs after

---

### Pattern 4: Adding Copy Buttons to Existing Code Blocks

**What:** Inject copy button into Shiki-generated code blocks from Phase 15

**When to use:** Shiki generates `.astro-code` elements at build time; add buttons at runtime

**Example - Astro Component Wrapper:**
```astro
---
// src/components/CodeBlock.astro (wrapper for Shiki output)
interface Props {
  code: string;
  lang?: string;
  title?: string;
}

const { code, lang = 'text', title } = Astro.props;
// Note: Actual syntax highlighting done by Shiki at build time via markdown config
---

<div class="code-block">
  {title && <div class="code-title">{title}</div>}
  <button
    class="copy-button"
    data-code={code}
    aria-label="Copy code to clipboard"
    type="button"
  >
    <svg class="copy-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 2V1h6v1h2v10H3V2h2zm1 1H4v8h8V3H6zm3 0H7v6h2V3z"/>
    </svg>
    <span class="copy-text">Copy</span>
  </button>
  <slot />
</div>

<style>
  .code-block {
    position: relative;
    margin: var(--space-sm) 0;
  }

  .code-title {
    background: var(--color-header-bg);
    border: 1px solid var(--color-border);
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .copy-button {
    position: absolute;
    top: var(--space-xs);
    right: var(--space-xs);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-header-bg);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .copy-button:hover {
    background: var(--color-link);
    color: #fff;
    border-color: var(--color-link);
  }

  .copy-button:focus {
    outline: 2px solid var(--color-link);
    outline-offset: 2px;
  }

  .copy-button.copy-success {
    background: #28a745;
    color: #fff;
    border-color: #28a745;
  }

  .copy-button.copy-error {
    background: #dc3545;
    color: #fff;
    border-color: #dc3545;
  }

  .copy-icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
</style>

<script>
  import { initCopyButtons } from '../scripts/copy-code';
  initCopyButtons();
</script>
```

**Alternative - Add buttons to existing code blocks:**
```typescript
// If you can't wrap code blocks, inject buttons after page load
function addCopyButtonsToCodeBlocks(): void {
  document.querySelectorAll<HTMLElement>('.astro-code').forEach(codeBlock => {
    // Skip if button already exists
    if (codeBlock.parentElement?.querySelector('.copy-button')) return;

    const code = codeBlock.textContent || '';
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.setAttribute('data-code', code);
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.textContent = 'Copy';

    // Insert button as sibling or child depending on layout
    codeBlock.parentElement?.insertBefore(button, codeBlock);
  });

  initCopyButtons();
}
```

**Source:** Derived from [Astro Client-Side Scripts Documentation](https://docs.astro.build/en/guides/client-side-scripts/)

---

### Anti-Patterns to Avoid

#### Anti-Pattern 1: Using is:inline for Non-Critical Scripts

**Bad:**
```astro
<script is:inline>
  // Copy button logic - NOT critical for initial render
  document.querySelectorAll('.copy-button').forEach(/* ... */);
</script>
```

**Why bad:**
- `is:inline` bypasses Astro's bundling and optimization
- Increases page weight (script repeated on every page)
- Only needed for FOUC-prevention (already done in Phase 14)

**Good:**
```astro
<script>
  // Regular script - bundled, minified, loaded once
  import { initCopyButtons } from '../scripts/copy-code';
  initCopyButtons();
</script>
```

**Source:** [Astro Scripts and Event Handling](https://docs.astro.build/en/guides/client-side-scripts/)

---

#### Anti-Pattern 2: Overwriting localStorage Without Checking

**Bad:**
```typescript
// Sets default every page load, overwriting user's choice
localStorage.setItem('site-theme', 'auto');
```

**Why bad:** Theme preference lost on every navigation

**Good:**
```typescript
// Only set default if no preference exists
if (!localStorage.getItem('site-theme')) {
  localStorage.setItem('site-theme', 'auto');
}
```

**Source:** [Theme Color Preferences with localStorage - CodyHouse](https://codyhouse.co/blog/post/store-theme-color-preferences-with-localstorage)

---

#### Anti-Pattern 3: Using document.execCommand('copy')

**Bad:**
```typescript
// Deprecated API, unreliable
const input = document.createElement('input');
input.value = code;
document.body.appendChild(input);
input.select();
document.execCommand('copy');
document.body.removeChild(input);
```

**Why bad:**
- Deprecated API
- Requires DOM manipulation (creating temp input)
- Synchronous (blocks main thread)
- No promise-based error handling

**Good:**
```typescript
// Modern Clipboard API
try {
  await navigator.clipboard.writeText(code);
} catch (err) {
  console.error('Copy failed:', err);
}
```

**Source:** [MDN Clipboard.writeText()](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)

---

#### Anti-Pattern 4: Missing Accessibility Attributes

**Bad:**
```html
<button class="copy-button" data-code={code}>
  <svg><!-- icon --></svg>
</button>
```

**Why bad:**
- Screen readers announce "button" with no context
- Icon-only button has no accessible name

**Good:**
```html
<button
  class="copy-button"
  data-code={code}
  aria-label="Copy code to clipboard"
  type="button"
>
  <svg aria-hidden="true"><!-- icon --></svg>
  <span class="visually-hidden">Copy code to clipboard</span>
</button>
```

**Source:** [ARIA: button role - MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Clipboard fallback for old browsers | Custom execCommand wrapper with feature detection | Modern Clipboard API only (drop IE11 support) | Site already requires modern browser features (CSS Grid, custom properties). Clipboard API baseline widely available since 2020. |
| Theme state management library | Redux/Zustand/Jotai for theme state | Single localStorage key + CSS cascade | Overkill for one piece of state. CSS custom properties handle reactivity automatically. |
| Copy button framework component | React/Svelte component for copy button | Vanilla TS with querySelectorAll | Astro is already the framework. Avoid framework island for simple button. |
| LocalStorage wrapper/abstraction | Custom localStorage class with caching, validation | Direct localStorage with try-catch | Simple use case (two keys: 'site-theme', existing cache). Abstraction adds complexity. |

**Key insight:** This phase needs minimal JavaScript. The infrastructure (CSS themes, Shiki code blocks) is already built. Just add thin interactivity layer.

---

## Common Pitfalls

### Pitfall 1: Copy Button Not Working on HTTPS

**What goes wrong:** Copy button silently fails with no error message. Console shows: "NotAllowedError: Write permission denied"

**Why it happens:** Clipboard API requires:
1. HTTPS (or localhost for development)
2. User gesture (click event)
3. Focus on current tab

Testing on HTTP (not localhost) causes failure.

**How to avoid:**
- Develop on `localhost` (works without HTTPS)
- Deploy to HTTPS (GitHub Pages provides this)
- Add error handling and user-visible feedback:
  ```typescript
  try {
    await navigator.clipboard.writeText(code);
    showSuccess();
  } catch (err) {
    console.error('[Copy] Failed:', err);
    showError('Copy failed. Please copy manually.');
  }
  ```

**Warning signs:**
- Copy works locally but not in production
- Console shows NotAllowedError or DOMException
- Clipboard API unavailable (`navigator.clipboard` is undefined)

**Detection checklist:**
- [ ] Test on localhost (should work)
- [ ] Test on deployed HTTPS site (should work)
- [ ] Test on HTTP site (should show error message, not silent failure)
- [ ] Test with tab in background (may fail, should handle gracefully)

**Source:** [MDN Clipboard.writeText() - Security Requirements](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)

---

### Pitfall 2: Theme Flash on Navigation (View Transitions)

**What goes wrong:** User navigates between pages, sees flash of wrong theme before correct theme applies.

**Why it happens:** When using Astro View Transitions, the inline script in Phase 14 runs ONCE on first load, but not on subsequent navigations. Theme state lost.

**How to avoid:**
If using View Transitions (not in current project, but future consideration):
```astro
<script>
  // Re-apply theme on view transition navigation
  document.addEventListener('astro:page-load', () => {
    const theme = localStorage.getItem('site-theme');
    if (theme && theme !== 'auto' && theme !== 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  });
</script>
```

**Warning signs:**
- Theme correct on initial load
- Theme wrong after clicking links (if using View Transitions)
- Inline script only logs once in console

**Current project:** Not an issue (no View Transitions enabled). Document for future reference.

**Source:** Astro View Transitions documentation patterns

---

### Pitfall 3: Private Browsing Mode Breaking Theme Persistence

**What goes wrong:** Theme switcher appears broken. User selects theme, refreshes page, theme resets to default.

**Why it happens:** Private/incognito mode blocks localStorage writes or clears on session end. `localStorage.setItem()` throws `SecurityError` or silently fails.

**How to avoid:**
```typescript
function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem('site-theme', theme);
  } catch (err) {
    console.warn('[Theme] Could not save preference:', err);
    // Optional: Show message to user
    // "Theme preference cannot be saved in private browsing mode"
  }
}
```

**Warning signs:**
- Theme works for some users, not others
- Console shows SecurityError or QuotaExceededError
- Theme resets every page load for affected users

**Detection:**
- Test in Chrome Incognito
- Test in Firefox Private Window
- Test in Safari Private Browsing

**Acceptable behavior:** Theme works during session but resets on browser close. This is expected private browsing behavior. Don't try to work around it (e.g., with cookies) - respect user's privacy intent.

**Source:** [JavaScript localStorage Best Practices 2026](https://copyprogramming.com/howto/javascript-how-ot-keep-local-storage-on-refresh)

---

### Pitfall 4: Copy Button Z-Index Conflicts

**What goes wrong:** Copy button renders behind code block or other elements, not clickable.

**Why it happens:** Shiki code blocks use `position: relative` or stacking context. Absolutely positioned button may render in wrong layer.

**How to avoid:**
```css
.code-block {
  position: relative; /* Create stacking context */
  z-index: 1;
}

.copy-button {
  position: absolute;
  top: var(--space-xs);
  right: var(--space-xs);
  z-index: 10; /* Above code content */
}
```

**Warning signs:**
- Button visible but not clickable
- Button appears behind code text
- Hover state doesn't trigger

**Prevention checklist:**
- [ ] Test clicking button in all themes
- [ ] Test with long code blocks (scrolling)
- [ ] Test with inline code vs block code
- [ ] Verify button doesn't overlap line numbers (if added later)

---

## Code Examples

Verified patterns from official sources and existing project patterns:

### Example 1: Complete Theme Switcher Component

See Pattern 1 above for full implementation.

**Key features:**
- Accessible label (visually hidden)
- Theme value type safety
- localStorage error handling
- Coordinates with Phase 14 inline script

**Integration:**
```astro
---
// src/layouts/BaseLayout.astro
import ThemeSwitcher from '../components/ThemeSwitcher.astro';
---
<header>
  <div class="header-content">
    <a href="/">{siteData.site.title}</a>
    <ThemeSwitcher />
  </div>
</header>
```

---

### Example 2: Copy Button with Accessibility

```html
<button
  class="copy-button"
  data-code={code}
  aria-label="Copy code to clipboard"
  type="button"
>
  <!-- SVG icon with aria-hidden -->
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path fill="currentColor" d="M5 2V1h6v1h2v10H3V2h2z"/>
  </svg>
  <!-- Text for screen readers and visual users -->
  <span>Copy</span>
</button>
```

**Why this structure:**
- `aria-label` provides context for screen readers
- `aria-hidden="true"` on icon prevents double-announcement
- Visible text "Copy" provides context without icon
- `type="button"` prevents form submission if in form context

**Source:** [ARIA6: Using aria-label - W3C](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA6)

---

### Example 3: Clipboard API with Error Handling

```typescript
async function copyToClipboard(text: string, button: HTMLButtonElement): Promise<void> {
  const originalText = button.textContent;
  const originalLabel = button.getAttribute('aria-label');

  try {
    // Modern Clipboard API - requires HTTPS and user gesture
    await navigator.clipboard.writeText(text);

    // Success feedback
    button.textContent = 'Copied!';
    button.setAttribute('aria-label', 'Code copied to clipboard');
    button.classList.add('copy-success');

    // Reset after 2 seconds
    setTimeout(() => {
      button.textContent = originalText;
      button.setAttribute('aria-label', originalLabel || 'Copy code to clipboard');
      button.classList.remove('copy-success');
    }, 2000);

  } catch (err) {
    console.error('[Copy] Failed:', err);

    // Error feedback
    button.textContent = 'Failed';
    button.classList.add('copy-error');

    // Reset after 2 seconds
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copy-error');
    }, 2000);
  }
}
```

**Error scenarios handled:**
- NotAllowedError: Permission denied (not HTTPS, no user gesture)
- SecurityError: Private browsing mode
- Network/browser issues

**Source:** [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

---

### Example 4: Theme Switcher Integration with Phase 14

```astro
---
// src/layouts/BaseLayout.astro
import ThemeSwitcher from '../components/ThemeSwitcher.astro';
// ... existing imports
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <!-- PHASE 14: Inline script runs BEFORE page renders -->
    <script is:inline>
      (function() {
        try {
          var t = localStorage.getItem('site-theme');
          if (t && t !== 'auto' && t !== 'light') {
            document.documentElement.setAttribute('data-theme', t);
          } else if (t === 'auto') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.setAttribute('data-theme', 'auto');
            }
          }
        } catch (e) {}
      })();
    </script>

    <!-- rest of head -->
  </head>
  <body>
    <header class="site-header">
      <div class="header-content">
        <a href="/" class="site-title">{siteData.site.title}</a>
        <!-- PHASE 16: Theme switcher component -->
        <ThemeSwitcher />
      </div>
    </header>
    <!-- rest of layout -->
  </body>
</html>
```

**Coordination:**
1. **First page load:** Inline script reads localStorage → sets data-theme → ThemeSwitcher script reads same value → syncs dropdown
2. **User changes theme:** Dropdown event listener → updates data-theme → saves to localStorage
3. **Next page load:** Inline script reads updated value → applies theme before paint

**No conflicts because:**
- Both use same storage key ('site-theme')
- Both apply theme same way (data-theme attribute)
- Inline runs synchronously (immediate)
- Component runs after DOMContentLoaded (deferred)

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `document.execCommand('copy')` | Clipboard API `navigator.clipboard.writeText()` | Deprecated 2020, baseline widely available March 2020 | Async, promise-based, no DOM manipulation |
| Class-based theming (`.dark-mode`, `.light-mode`) | Data attribute theming (`[data-theme="dark"]`) | Current best practice | Single attribute change vs manipulating classes on every element |
| Cookie-based theme persistence | localStorage for theme preference | LocalStorage became standard ~2015 | Client-side only, no server round-trip, larger quota |
| jQuery for event delegation | Native `querySelectorAll` + `forEach` | jQuery not needed since ES6 (2015) | Zero dependencies, better performance |

**Deprecated/outdated:**
- `document.execCommand('copy')` - Use Clipboard API
- Theme color meta tag for manual switching - Use CSS custom properties with data attributes
- Inline onclick attributes - Use addEventListener for separation of concerns

---

## Open Questions

1. **Theme switcher placement:**
   - What we know: Should be accessible from all pages
   - What's unclear: Header vs footer vs floating widget
   - Recommendation: Start with header (next to site title). Can move based on user feedback.

2. **Copy button icon vs text:**
   - What we know: Icon-only needs aria-label, text is more obvious
   - What's unclear: User preference for this audience (academic site)
   - Recommendation: Use both (icon + "Copy" text) for clarity

3. **Theme count:**
   - What we know: Requirements specify 8 themes
   - What's unclear: Are all 8 needed for MVP?
   - Recommendation: Implement all 8 (already defined in Phase 14), but test most with auto/light/dark first

4. **Copy button for inline code vs code blocks:**
   - What we know: Phase 15 focused on code blocks (`.astro-code`)
   - What's unclear: Should inline `<code>` also have copy buttons?
   - Recommendation: Code blocks only. Inline code is typically short (no need to copy).

---

## Sources

### Primary (HIGH confidence)

- Existing codebase:
  - `/Users/pedf/workspace/bacilo.github.io/src/layouts/BaseLayout.astro` - Phase 14 inline script pattern
  - `/Users/pedf/workspace/bacilo.github.io/src/styles/themes.css` - 8 theme definitions from Phase 14
  - `/Users/pedf/workspace/bacilo.github.io/astro.config.mjs` - Shiki configuration from Phase 15
  - `/Users/pedf/workspace/bacilo.github.io/src/scripts/github-api.ts` - localStorage pattern for caching

- Official documentation:
  - [Astro Scripts and Event Handling](https://docs.astro.build/en/guides/client-side-scripts/)
  - [MDN Clipboard.writeText()](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)
  - [MDN Clipboard API Overview](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
  - [MDN ARIA button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role)

### Secondary (MEDIUM confidence)

- Community patterns verified with official docs:
  - [How to Work With Event Listeners in Astro - Webtips](https://webtips.dev/event-listeners-in-astro)
  - [Theme Color Preferences with localStorage - CodyHouse](https://codyhouse.co/blog/post/store-theme-color-preferences-with-localstorage)
  - [The Best Light/Dark Mode Theme Toggle in JavaScript](https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/)
  - [W3C ARIA6: Using aria-label](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA6)

### Tertiary (Informational)

- Supporting research:
  - [Astro Tutorial: Build a Blog - Theme Switcher](https://docs.astro.build/en/tutorial/6-islands/2/)
  - [JavaScript localStorage Best Practices 2026](https://copyprogramming.com/howto/javascript-how-ot-keep-local-storage-on-refresh)
  - Various accessibility guides for ARIA labels on icon buttons

---

## Metadata

**Confidence breakdown:**
- Theme switcher implementation: HIGH - Builds directly on Phase 14 foundation, uses existing localStorage pattern from github-api.ts
- Copy button implementation: HIGH - Clipboard API well-documented, baseline widely available, tested pattern
- Astro script patterns: HIGH - Official documentation + existing project examples
- Accessibility: HIGH - W3C ARIA standards + MDN documentation
- Integration with Phases 14-15: HIGH - Direct observation of existing code

**Research date:** 2026-02-16
**Valid until:** 60 days (stable APIs, standard patterns)

**Dependencies verified:**
- Phase 14 completion: Required (theme CSS definitions, inline script pattern)
- Phase 15 completion: Required for copy buttons (Shiki code blocks, .astro-code elements)
- No external dependencies beyond existing stack

**Ready for planning:** Yes. Clear patterns, no unknowns, builds on existing infrastructure.
