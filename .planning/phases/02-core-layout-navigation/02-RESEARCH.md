# Phase 2: Core Layout & Navigation - Research

**Researched:** 2026-02-12
**Domain:** Astro 5 layout architecture, responsive navigation, CSS styling patterns
**Confidence:** HIGH

## Summary

Astro 5 provides built-in layout composition patterns through reusable `.astro` components with `<slot />` elements for content injection. The framework's automatic CSS scoping, native View Transitions API support, and file-based routing make it well-suited for building clean, performant academic websites.

For navigation, the standard approach combines a reusable Navigation component with responsive CSS patterns (mobile-first with media queries or container queries). Astro's scoped styling prevents CSS conflicts, while the optional View Transitions API enables SPA-like navigation without JavaScript overhead. Academic sites benefit from simple, semantic HTML with system font stacks for performance and accessibility-first navigation patterns.

**Primary recommendation:** Build a composable layout system with BaseLayout (site shell + navigation) nested with specific layouts (BlogPost, Publication, etc.). Use native CSS with custom properties for theming, implement mobile-first responsive navigation with progressive enhancement, and preserve Jekyll permalink structure through Astro's file-based routing and dynamic routes.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Static site framework | Built-in layout composition, automatic CSS scoping, zero-JS by default |
| Native CSS | - | Styling | Astro's scoped styles eliminate need for CSS-in-JS or preprocessors |
| View Transitions API | Native | SPA navigation | Browser-native, zero JavaScript, smooth page transitions |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS 4 | 4.x | Utility-first CSS | For rapid prototyping or complex designs (via @tailwindcss/vite plugin in Astro >=5.2.0) |
| astro-navbar | Latest | Responsive nav component | Optional - provides headless navigation with mobile toggle and dropdown support |
| CSS Container Queries | Native | Component-level responsive design | Alternative to media queries for truly modular components (supported in all major browsers 2026) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native CSS | Tailwind CSS 4 | Tailwind adds build complexity but provides utility classes; best for teams familiar with utility-first CSS |
| Custom navigation | astro-navbar package | Package reduces implementation time but adds dependency; simple academic sites often don't need it |
| Media queries | Container queries | Container queries better for reusable components but may require mental model shift from viewport-based thinking |

**Installation:**
```bash
# Core (already installed in Phase 1)
npm install astro@^5.0.0 @astrojs/mdx@^4.0.0

# Optional: Tailwind 4 support (Astro >=5.2.0)
npm install @tailwindcss/vite

# Optional: Responsive navigation component
npm install astro-navbar
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── layouts/              # Reusable layout templates
│   ├── BaseLayout.astro      # Site shell (html, head, nav, footer)
│   ├── PageLayout.astro      # For standard pages (About, CV)
│   ├── PostLayout.astro      # Blog posts with metadata
│   └── PublicationLayout.astro # Publications with citation
├── components/           # Reusable UI components
│   ├── Header.astro          # Site header with logo
│   ├── Navigation.astro      # Main navigation links
│   ├── Footer.astro          # Site footer
│   └── SkipLink.astro        # Accessibility skip navigation
├── pages/               # File-based routes
│   ├── index.astro          # Homepage
│   ├── about.astro          # About page
│   ├── publications/        # Dynamic routes
│   │   └── [slug].astro     # Individual publication pages
│   └── posts/
│       └── [slug].astro     # Individual blog posts
└── styles/
    └── global.css           # Global styles, CSS custom properties
```

### Pattern 1: Nested Layout Composition

**What:** Compose layouts by importing smaller layouts inside larger ones, using `<slot />` for content injection.

**When to use:** Always. Prevents duplication of site shell (html, head, nav, footer) across specialized layouts.

**Example:**
```astro
---
// src/layouts/BaseLayout.astro
import Header from '../components/Header.astro';
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title?: string;
  description?: string;
}

const { title = 'Pedro Figueira', description = 'Academic researcher' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="stylesheet" href="/styles/global.css" />
  </head>
  <body>
    <Header />
    <Navigation />
    <main id="main-content">
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style>
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
  }

  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
</style>
```

```astro
---
// src/layouts/PublicationLayout.astro
import BaseLayout from './BaseLayout.astro';

const { frontmatter } = Astro.props;
---

<BaseLayout title={frontmatter.title}>
  <article>
    <h1>{frontmatter.title}</h1>
    <p class="meta">{frontmatter.venue} | {frontmatter.date}</p>
    <slot />
  </article>
</BaseLayout>

<style>
  article {
    /* Scoped to this layout only */
  }
  .meta {
    color: var(--text-muted);
  }
</style>
```

### Pattern 2: Reusable Navigation Component

**What:** Extract navigation links into a separate component that can be imported into layouts.

**When to use:** Always. Enables single source of truth for navigation structure.

**Example:**
```astro
---
// src/components/Navigation.astro
// Source: https://docs.astro.build/en/tutorial/3-components/1/

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/publications/', label: 'Publications' },
  { href: '/posts/', label: 'Blog' },
  { href: '/cv/', label: 'CV' },
];

const currentPath = Astro.url.pathname;
---

<nav aria-label="Main navigation">
  <ul>
    {navItems.map(item => (
      <li>
        <a
          href={item.href}
          aria-current={currentPath === item.href ? 'page' : undefined}
        >
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</nav>

<style>
  nav ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 2rem;
  }

  nav a {
    text-decoration: none;
    color: var(--link-color);
  }

  nav a[aria-current="page"] {
    font-weight: bold;
    border-bottom: 2px solid currentColor;
  }

  /* Mobile-first responsive */
  @media (max-width: 768px) {
    nav ul {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
```

### Pattern 3: Responsive Navigation with Mobile Toggle

**What:** Progressive enhancement pattern - desktop navigation visible by default, JavaScript adds mobile menu toggle.

**When to use:** When navigation has 5+ items or requires nested dropdowns.

**Example:**
```astro
---
// src/components/ResponsiveNav.astro
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/publications/', label: 'Publications' },
  { href: '/posts/', label: 'Blog' },
];
---

<nav class="nav" aria-label="Main navigation">
  <button class="menu-toggle" aria-expanded="false" aria-controls="menu">
    <span class="sr-only">Toggle menu</span>
    <span class="hamburger"></span>
  </button>

  <ul id="menu" class="menu">
    {navItems.map(item => (
      <li><a href={item.href}>{item.label}</a></li>
    ))}
  </ul>
</nav>

<style>
  .menu-toggle {
    display: none; /* Hidden on desktop */
  }

  .menu {
    display: flex;
    gap: 2rem;
    list-style: none;
    padding: 0;
  }

  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
      /* Hamburger icon styles */
    }

    .menu {
      display: none; /* Hidden by default on mobile */
    }

    .menu.is-open {
      display: flex;
      flex-direction: column;
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
</style>

<script>
  // Progressive enhancement - only runs if JavaScript enabled
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');

  toggle?.addEventListener('click', () => {
    const isOpen = menu?.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
</script>
```

### Pattern 4: CSS Custom Properties for Theming

**What:** Define design tokens as CSS custom properties in a global stylesheet for consistent theming.

**When to use:** Always. Provides single source of truth for colors, spacing, typography.

**Example:**
```css
/* src/styles/global.css */
/* Source: https://www.kevindench.design/posts/using-css-custom-properties-in-astro/ */

:root {
  /* Colors - Academic palette */
  --color-bg: #ffffff;
  --color-text: #333333;
  --color-text-muted: #666666;
  --color-link: #0066cc;
  --color-link-hover: #004499;
  --color-border: #e0e0e0;

  /* Typography */
  --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;

  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;

  /* Layout */
  --max-width: 800px;
  --header-height: 4rem;
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #e0e0e0;
    --color-text-muted: #a0a0a0;
    --color-link: #6699ff;
  }
}

body {
  font-family: var(--font-system);
  color: var(--color-text);
  background: var(--color-bg);
}
```

### Pattern 5: Preserving Jekyll Permalinks with Dynamic Routes

**What:** Use Astro's dynamic routing with `getStaticPaths()` to generate pages at custom URLs matching Jekyll structure.

**When to use:** When migrating from Jekyll and need to preserve existing URLs (NAV-04 requirement).

**Example:**
```astro
---
// src/pages/publication/[...slug].astro
// Generates URLs like /publication/2008-01-01-License-to-chill
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const publications = await getCollection('publications');

  return publications.map(pub => {
    // Extract permalink from frontmatter (e.g., "/publication/2008-01-01-License-to-chill")
    const permalink = pub.data.permalink || `/publication/${pub.slug}`;
    // Remove leading /publication/ to get slug for [...slug] param
    const slug = permalink.replace(/^\/publication\//, '');

    return {
      params: { slug }, // Matches [...slug] in filename
      props: { publication: pub },
    };
  });
}

const { publication } = Astro.props;
const { Content } = await publication.render();
---

<PublicationLayout frontmatter={publication.data}>
  <Content />
</PublicationLayout>
```

### Pattern 6: View Transitions for SPA Navigation

**What:** Enable zero-JavaScript smooth page transitions using browser-native View Transitions API.

**When to use:** Optional enhancement for polish. Adds SPA-like feel without JavaScript framework.

**Example:**
```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
---

<html>
  <head>
    <ClientRouter fallback="swap" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Anti-Patterns to Avoid

- **Putting navigation HTML directly in BaseLayout:** Extract to Navigation component for reusability and testing
- **Using global styles for component-specific CSS:** Leverage Astro's automatic scoping to prevent style conflicts
- **Forgetting mobile viewport meta tag:** Always include `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
- **Not using semantic HTML:** Use `<nav>`, `<main>`, `<article>`, `<header>`, `<footer>` for accessibility and SEO
- **Moving style tags to head in layouts:** Astro's scoped styles must stay in component body, not head (will lose scoping)
- **Hardcoding navigation links:** Use data structure or site config to make navigation maintainable

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mobile menu toggle | Custom JavaScript state management | Native `<details>` element or astro-navbar | Browser-native `<details>` provides toggle without JS; astro-navbar provides accessible patterns |
| Skip navigation | Custom focus management | Standard skip link pattern | WCAG-tested pattern, screen reader compatible, minimal code |
| Responsive images | Manual srcset generation | Astro's built-in Image component (Phase 3) | Automatic srcset, sizes, optimization, proper lazy loading |
| Dark mode toggle | Custom localStorage + JS | `prefers-color-scheme` media query | Browser/OS preference, no FOUC, respects user choice |
| Active link highlighting | JavaScript pathname checking | `Astro.url.pathname` + `aria-current` | Server-rendered, accessible, no hydration needed |

**Key insight:** Astro's server-first architecture means many patterns that require JavaScript in React/Vue can be solved with zero client-side JS using Astro's built-in props and native HTML/CSS features.

## Common Pitfalls

### Pitfall 1: Style Tag Placement in Layouts
**What goes wrong:** Developers move `<style>` tags to `<head>` in layout components, losing Astro's automatic scoping.

**Why it happens:** Coming from other frameworks where styles must be in head, or misunderstanding Astro's compilation model.

**How to avoid:** Always place `<style>` tags in the component body (after the HTML template). Astro extracts and scopes them during compilation.

**Warning signs:** Styles bleeding between components, unexpected style precedence issues, `data-astro-cid-*` attributes missing from elements.

**Source:** [Astro Layouts Tutorial - CloudCannon](https://cloudcannon.com/tutorials/astro-beginners-tutorial-series/astro-layouts/)

### Pitfall 2: Forgetting Mobile Viewport Meta Tag
**What goes wrong:** Site doesn't scale properly on mobile devices, appears zoomed out, small text.

**Why it happens:** Copying minimal HTML boilerplate without mobile considerations.

**How to avoid:** Include `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` in head of BaseLayout.

**Warning signs:** Mobile browser treats site as desktop, requires pinch-to-zoom to read text.

### Pitfall 3: Not Handling View Transitions Script Lifecycle
**What goes wrong:** Scripts that manipulate DOM run once but don't re-execute after View Transitions navigation.

**Why it happens:** View Transitions preserve page state; bundled scripts execute only once, inline scripts may not re-run.

**How to avoid:** Listen to `astro:page-load` lifecycle event for scripts that need to run on every navigation. Use `data-astro-rerun` attribute to force inline script re-execution.

**Warning signs:** Interactive features work on initial page load but break after navigation, console errors about missing elements.

**Source:** [View Transitions - Astro Docs](https://docs.astro.build/en/guides/view-transitions/)

### Pitfall 4: Accessibility - Missing Skip Link
**What goes wrong:** Keyboard and screen reader users must tab through entire navigation before reaching main content.

**Why it happens:** Visual design doesn't show skip link, developers forget it's required for accessibility.

**How to avoid:** Add skip link as first element in body: `<a href="#main-content" class="skip-link">Skip to main content</a>`. Use CSS to visually hide until focused.

**Warning signs:** Screen reader users complain about excessive navigation, WCAG 2.4.1 compliance fails.

**Source:** [WebAIM: Skip Navigation Links](https://webaim.org/techniques/skipnav/)

### Pitfall 5: Inconsistent URL Trailing Slashes
**What goes wrong:** Links work in dev but break in production, or redirect loops occur.

**Why it happens:** Astro's file-based routing generates URLs with trailing slashes (e.g., `/about/`), but developers write links without them (`/about`).

**How to avoid:** Be consistent - either always include trailing slashes in links to match Astro's output, or configure `build.format` in astro.config.mjs to control output format.

**Warning signs:** Navigation works locally but causes redirects in production, URLs inconsistent between pages.

### Pitfall 6: Breaking Scoped Styles with Global Selectors
**What goes wrong:** Developers add `:global()` wrappers unnecessarily, defeating Astro's scoping benefits.

**Why it happens:** Coming from CSS Modules or styled-components where global escape hatches are common.

**How to avoid:** Use scoped styles by default. Only use `<style is:global>` or `:global()` for truly global styles (body, CSS custom properties, third-party library overrides).

**Warning signs:** Style conflicts between components, difficulty tracking which component owns which styles.

### Pitfall 7: Not Preserving Permalink Structure from Jekyll
**What goes wrong:** Migrated site breaks existing links, SEO rankings drop, bookmarks 404.

**Why it happens:** Astro's file-based routing doesn't automatically match Jekyll's permalink patterns.

**How to avoid:** Use dynamic routes with `getStaticPaths()` to read permalink from frontmatter and generate matching URLs. Keep Jekyll's `permalink` field in migrated content.

**Warning signs:** Google Search Console shows 404 errors, users report broken links, old publications can't be found.

## Code Examples

Verified patterns from official sources:

### Accessible Skip Link (WCAG 2.4.1 Compliant)
```astro
---
// src/components/SkipLink.astro
// Source: https://webaim.org/techniques/skipnav/
---

<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-bg);
    color: var(--color-link);
    padding: 0.5rem 1rem;
    text-decoration: none;
    z-index: 100;
  }

  .skip-link:focus {
    top: 0;
  }
</style>
```

### Mobile-First Navigation with System Font Stack
```astro
---
// src/components/Navigation.astro
// Combines patterns from official Astro docs + modern CSS best practices
---

<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about/">About</a></li>
    <li><a href="/publications/">Publications</a></li>
    <li><a href="/posts/">Blog</a></li>
  </ul>
</nav>

<style>
  nav {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 2rem;
  }

  a {
    color: var(--color-link);
    text-decoration: none;
    padding: 0.5rem;
  }

  a:hover {
    text-decoration: underline;
  }

  /* Mobile-first: stack vertically on small screens */
  @media (max-width: 768px) {
    ul {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
```

### BaseLayout with SEO and Accessibility
```astro
---
// src/layouts/BaseLayout.astro
// Source: https://docs.astro.build/en/basics/layouts/
import SkipLink from '../components/SkipLink.astro';
import Navigation from '../components/Navigation.astro';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = 'Pedro Figueira - Academic Researcher',
  description = 'Research on HCI, nomadic work, and digital technologies'
} = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <SkipLink />
    <header>
      <h1 class="site-title">Pedro Figueira</h1>
      <Navigation />
    </header>
    <main id="main-content">
      <slot />
    </main>
    <footer>
      <p>&copy; {new Date().getFullYear()} Pedro Figueira</p>
    </footer>
  </body>
</html>

<style>
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
  }

  header {
    border-bottom: 1px solid #e0e0e0;
    padding: 1rem;
  }

  .site-title {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  footer {
    border-top: 1px solid #e0e0e0;
    padding: 2rem 1rem;
    text-align: center;
    color: #666;
  }
</style>
```

### Container Query for Responsive Component
```astro
---
// src/components/PublicationCard.astro
// Source: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries
export interface Props {
  title: string;
  venue: string;
  year: string;
}

const { title, venue, year } = Astro.props;
---

<article class="publication-card">
  <h3>{title}</h3>
  <p class="meta">{venue} | {year}</p>
</article>

<style>
  .publication-card {
    container-type: inline-size;
    border: 1px solid var(--color-border);
    padding: 1rem;
    border-radius: 4px;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }

  .meta {
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }

  /* Component responds to its container width, not viewport */
  @container (min-width: 400px) {
    .publication-card {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
    }

    h3 {
      font-size: 1.125rem;
    }
  }
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS Modules + bundler config | Astro's automatic scoped styles | Astro 1.0 (2022) | Zero configuration, scoped by default, no class name hashing needed |
| JavaScript-based navigation state | View Transitions API | Chrome 126 (June 2024), all major browsers 2025 | Zero-JS smooth transitions, native browser support |
| Viewport media queries only | Container queries for components | All major browsers 2023 | Component-level responsiveness, truly reusable components |
| Tailwind 3 via @astrojs/tailwind | Tailwind 4 via @tailwindcss/vite | Tailwind 4.0 + Astro 5.2 (2025) | CSS-first config, improved performance, native cascade layers |
| Manual responsive image markup | Astro Image component with automatic srcset | Astro 3.0 (2023) | Automatic optimization, proper lazy loading, responsive by default |
| Sass/Less for variables | CSS custom properties | Widely supported 2020+ | Native browser support, no build step, dynamic runtime updates |

**Deprecated/outdated:**
- **`<style global>`**: Use `<style is:global>` (new syntax since Astro 2.0)
- **Hamburger icon libraries**: Native `<details>` element provides toggle without JavaScript
- **Web fonts for body text**: System font stacks now standard for performance (WOFF2 only for brand/display fonts)
- **Client-side routing libraries**: View Transitions API provides native solution
- **@astrojs/tailwind for Tailwind 4**: Use @tailwindcss/vite plugin instead (Astro >=5.2.0)

## Open Questions

1. **Specific Jekyll permalink patterns in this project**
   - What we know: Publications use `/publication/[date-slug]` format, seen in frontmatter
   - What's unclear: Are there other permalink patterns for talks, posts, or pages that need preservation?
   - Recommendation: Audit all content collections for `permalink` field variations in Phase 2 planning

2. **User preference for navigation style**
   - What we know: Academic aesthetic desired (NAV-03 requirement), 5 main sections identified
   - What's unclear: User preference for horizontal desktop nav vs. sidebar, dark mode support priority
   - Recommendation: Implement simple horizontal navigation first, can iterate on style in later phases

3. **Mobile breakpoint strategy**
   - What we know: Mobile support required (NAV-02), modern CSS supports both media and container queries
   - What's unclear: Should navigation toggle at specific breakpoint or use container queries for all responsive behavior
   - Recommendation: Use 768px breakpoint for navigation toggle (standard mobile threshold), consider container queries for publication/post cards

## Sources

### Primary (HIGH confidence)
- [Layouts - Astro Docs](https://docs.astro.build/en/basics/layouts/) - Layout composition patterns
- [Styles and CSS - Astro Docs](https://docs.astro.build/en/guides/styling/) - Scoped styles, CSS features
- [Routing - Astro Docs](https://docs.astro.build/en/guides/routing/) - File-based routing, dynamic routes
- [View Transitions - Astro Docs](https://docs.astro.build/en/guides/view-transitions/) - View Transitions API integration
- [Navigation Component Tutorial - Astro Docs](https://docs.astro.build/en/tutorial/3-components/1/) - Official navigation example
- [WebAIM: Skip Navigation Links](https://webaim.org/techniques/skipnav/) - WCAG skip link patterns
- [CSS Container Queries - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) - Container query specification

### Secondary (MEDIUM confidence)
- [Astro-Navbar GitHub](https://github.com/surjithctly/astro-navbar) - Headless navigation component library
- [Astro Academia Theme](https://astro.build/themes/details/astro-academia/) - Academic website template patterns
- [Using CSS Custom Properties in Astro - Kevin Dench](https://www.kevindench.design/posts/using-css-custom-properties-in-astro/) - Theming patterns
- [Creating Jekyll-style URLs in Astro - Human Who Codes](https://humanwhocodes.com/blog/2023/03/astro-jekyll-blog-post-url/) - Permalink migration pattern
- [System Font Stack - CSS-Tricks](https://css-tricks.com/snippets/css/system-font-stack/) - Performance-optimized fonts
- [WCAG 2.4.1: Bypass Blocks - W3C](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-skip.html) - Skip navigation requirements
- [Container queries in 2026 - LogRocket](https://blog.logrocket.com/container-queries-2026/) - Container query patterns and browser support
- [What's New in Astro - January 2026](https://astro.build/blog/whats-new-january-2026/) - Astro 5 recent updates

### Tertiary (LOW confidence - requires validation)
- Academic design aesthetics preferences vary; research shows trends but user-specific styling needs validation
- Specific breakpoint values (768px) are convention but project may need different thresholds based on content
- Dark mode implementation priority unclear without user input

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Astro docs verified, View Transitions API verified across sources, browser support confirmed
- Architecture: HIGH - All patterns sourced from official Astro documentation and verified through multiple authoritative sources
- Pitfalls: MEDIUM-HIGH - Common patterns documented in official sources and community, some derived from multiple web search results

**Research date:** 2026-02-12
**Valid until:** ~2026-03-14 (30 days - Astro is stable, CSS features mature)

**Notes:**
- Astro 5.x is current stable version (verified in package.json)
- View Transitions API fully supported across major browsers as of 2026
- Container queries supported in all major browsers (confirmed by multiple sources)
- Jekyll permalink structure preservation pattern verified through existing content inspection
