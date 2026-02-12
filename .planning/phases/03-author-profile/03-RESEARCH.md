# Phase 3: Author Profile - Research

**Researched:** 2026-02-12
**Domain:** Astro component architecture, responsive sidebar patterns, academic profile presentation
**Confidence:** HIGH

## Summary

Phase 3 implements an author profile sidebar that displays consistently across all site pages. The core challenge is creating a reusable Astro component that adapts responsively—sidebar on desktop (768px+), stacked on mobile—while maintaining accessibility and clean data separation.

The solution leverages Astro's component architecture with TypeScript props, scoped CSS with custom properties, and a centralized configuration file for author data. The existing BaseLayout provides the integration point. Images will use Astro's Image component with public folder assets (profile photo exists at `/public/images/profile.png`).

Academic profile requirements include both social links (Twitter, LinkedIn, GitHub) and academic identifiers (Google Scholar, ORCID). Best practice: display ORCID as full URL, link all profiles for discoverability, ensure consistent naming across platforms.

**Primary recommendation:** Create an `AuthorSidebar.astro` component integrated into BaseLayout, with author data in `src/config/site.ts`, using mobile-first responsive CSS at 768px breakpoint.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^5.0.0 | Static site framework | Already in use, zero-JS by default |
| TypeScript | ^5.7.0 | Type safety | Already in use, enforces props interface |
| CSS Custom Properties | Native | Theming/responsive | Already in use, no build step |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Astro Image | Built-in | Image optimization | Profile photos, prevents CLS |
| CSS Media Queries | Native | Responsive behavior | Sidebar/mobile layout switch |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Separate config file | Hardcoded data | Config file enables reuse, easier updates |
| Astro Image component | Plain `<img>` | Image component prevents CLS even for public images |
| Scoped component CSS | Global CSS | Scoped prevents leakage, better encapsulation |

**Installation:**
```bash
# No additional dependencies needed
# All required tools already in package.json
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── AuthorSidebar.astro    # Sidebar component with props
├── config/
│   └── site.ts                # Centralized site/author config
├── layouts/
│   └── BaseLayout.astro       # Integration point for sidebar
└── styles/
    └── global.css             # Shared CSS custom properties
```

### Pattern 1: Component with TypeScript Props
**What:** Define component interface for type-safe props, destructure from Astro.props
**When to use:** All reusable components accepting data
**Example:**
```typescript
// Source: https://docs.astro.build/en/basics/astro-components/
---
interface Props {
  name: string;
  bio: string;
  avatar: string;
  showLinks?: boolean;
}

const { name, bio, avatar, showLinks = true } = Astro.props;
---
```

### Pattern 2: Centralized Site Configuration
**What:** Export constants from `src/config/site.ts`, import where needed
**When to use:** Site-wide data like author info, social links, metadata
**Example:**
```typescript
// Source: https://thevalleyofcode.com/astro-access-configuration/
// src/config/site.ts
export const SITE = {
  title: 'Pedro Figueira',
  description: 'Academic researcher - HCI, nomadic work, and digital technologies',
  url: 'https://pedropaf.com'
};

export const AUTHOR = {
  name: 'Pedro Ferreira',
  bio: 'Academic interested in leisure and the representation of users',
  avatar: '/images/profile.png',
  location: 'Location',
  social: {
    twitter: 'pedro2_0',
    github: 'bacilo',
    linkedin: ''
  },
  academic: {
    googleScholar: 'http://yourfullgooglescholarurl.com',
    orcid: 'http://orcid.org/yourorcidurl'
  }
};

// Usage in component:
import { AUTHOR } from '../config/site';
```

### Pattern 3: Mobile-First Responsive Layout
**What:** Base styles for mobile, layer desktop enhancements with min-width media queries
**When to use:** All responsive components, especially sidebars
**Example:**
```css
/* Source: https://www.browserstack.com/guide/responsive-design-breakpoints */
/* Mobile-first: base styles = mobile */
.author-profile {
  width: 100%;
  margin-bottom: var(--space-md);
}

/* Desktop: sidebar at 768px+ */
@media (min-width: 768px) {
  .content-wrapper {
    display: flex;
    gap: var(--space-md);
  }

  .author-profile {
    width: 250px;
    flex-shrink: 0;
  }

  .main-content {
    flex: 1;
  }
}
```

### Pattern 4: Image Component for CLS Prevention
**What:** Use Astro Image component even for public folder images
**When to use:** All images, especially profile photos above the fold
**Example:**
```astro
---
// Source: https://docs.astro.build/en/guides/images/
import { Image } from 'astro:assets';
---
<Image
  src="/images/profile.png"
  alt="Pedro Ferreira"
  width={200}
  height={200}
  loading="eager"
/>
```

### Pattern 5: Scoped Component Styles
**What:** Default `<style>` tags in Astro components are automatically scoped
**When to use:** Component-specific styles, prevents cascade conflicts
**Example:**
```astro
---
// Source: https://docs.astro.build/en/guides/styling/
// Component script
---
<div class="sidebar">
  <!-- content -->
</div>

<style>
  /* Automatically scoped to this component */
  .sidebar {
    padding: var(--space-md);
    border: 1px solid var(--color-border);
  }
</style>
```

### Anti-Patterns to Avoid
- **Layout-level framework wrapping:** Don't wrap entire BaseLayout in client-side framework—use granular components
- **Absolute positioning for sidebar:** Brittle, breaks when width changes, bad for accessibility
- **Scattered width values:** Centralize sidebar width in CSS custom properties
- **Ignoring CLS:** Always specify width/height for images, even if unoptimized
- **Global styles by default:** Use scoped styles unless specifically need cascade

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom image processing | Astro Image component | Handles formats, sizes, CLS prevention automatically |
| Responsive breakpoints | Custom resize listeners | CSS media queries | Native, performant, no JavaScript needed |
| Dark mode theming | JavaScript toggle | CSS `prefers-color-scheme` | Already implemented, respects OS preference |
| Component type safety | PropTypes validation | TypeScript interface | Build-time errors, better DX, Astro built-in |
| CSS scoping | Manual BEM naming | Astro scoped styles | Automatic, prevents conflicts, zero config |

**Key insight:** Astro provides zero-JavaScript solutions for common patterns. Reaching for client-side libraries undermines the framework's static-first philosophy and increases bundle size unnecessarily.

## Common Pitfalls

### Pitfall 1: Public Folder Images Without Dimensions
**What goes wrong:** Using Image component with public folder images but omitting width/height causes build errors
**Why it happens:** Astro cannot analyze public folder files—dimensions must be explicit
**How to avoid:** Always specify width and height props for public folder images
**Warning signs:** Build errors mentioning missing dimensions on Image component

### Pitfall 2: Inconsistent ORCID/Google Scholar URLs
**What goes wrong:** Linking to partial profiles, outdated URLs, or inconsistent name formats across platforms
**Why it happens:** Not following platform-specific URL standards or updating all profiles consistently
**How to avoid:** Use full ORCID URL format (http://orcid.org/0000-0001-2345-6789), verify all links work, use same name across platforms
**Warning signs:** 404 errors on academic links, profile search returning no results

### Pitfall 3: Sidebar Width Coupling
**What goes wrong:** Sidebar width hardcoded in multiple places, changes require updating scattered values
**Why it happens:** Not using CSS custom properties for shared values
**How to avoid:** Define `--sidebar-width: 250px` in :root, reference throughout
**Warning signs:** Need to update multiple files to change sidebar width

### Pitfall 4: Desktop-First Media Queries
**What goes wrong:** Mobile styles override desktop with max-width queries, larger initial payload
**Why it happens:** Habit from older responsive patterns
**How to avoid:** Start with mobile base styles, layer desktop with min-width: 768px
**Warning signs:** Mobile users download desktop CSS they never use

### Pitfall 5: Missing Keyboard Navigation
**What goes wrong:** Social/academic links not keyboard accessible, no visible focus indicators
**Why it happens:** Only testing with mouse, not considering accessibility requirements
**How to avoid:** Test with Tab key, ensure focus indicators visible, maintain logical tab order
**Warning signs:** Links not reachable via keyboard, no visual focus state

### Pitfall 6: Inconsistent Sidebar Position
**What goes wrong:** Sidebar switches from left to right across pages, confusing navigation
**Why it happens:** Different page templates with varying layouts
**How to avoid:** Integrate sidebar in BaseLayout for consistency, use same position site-wide
**Warning signs:** User feedback about navigation confusion, WCAG 2.2 violations

## Code Examples

Verified patterns from official sources:

### Component Integration in BaseLayout
```astro
---
// Source: https://docs.astro.build/en/basics/layouts/
import SkipLink from '../components/SkipLink.astro';
import Navigation from '../components/Navigation.astro';
import AuthorSidebar from '../components/AuthorSidebar.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title?: string;
  description?: string;
  showSidebar?: boolean;
}

const {
  title = 'Pedro Figueira',
  description = 'Academic researcher - HCI, nomadic work, and digital technologies',
  showSidebar = true
} = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- head content -->
  </head>
  <body>
    <SkipLink />
    <header class="site-header">
      <!-- header content -->
    </header>
    <Navigation />
    <div class="content-wrapper">
      {showSidebar && <AuthorSidebar />}
      <main id="main-content">
        <slot />
      </main>
    </div>
    <Footer />
  </body>
</html>

<style>
  @media (min-width: 768px) {
    .content-wrapper {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: var(--space-md) var(--space-sm);
      display: flex;
      gap: var(--space-md);
    }
  }
</style>
```

### AuthorSidebar Component Structure
```astro
---
// Source: Component patterns from Astro docs
import { Image } from 'astro:assets';
import { AUTHOR } from '../config/site';

interface Props {
  compact?: boolean;
}

const { compact = false } = Astro.props;
---

<aside class="author-sidebar" class:list={{ compact }}>
  <div class="author-card">
    <Image
      src={AUTHOR.avatar}
      alt={AUTHOR.name}
      width={200}
      height={200}
      loading="eager"
      class="author-photo"
    />
    <h2 class="author-name">{AUTHOR.name}</h2>
    <p class="author-bio">{AUTHOR.bio}</p>
  </div>

  <nav aria-label="Author social links">
    <h3 class="sr-only">Social Media</h3>
    <ul class="social-links">
      {AUTHOR.social.twitter && (
        <li>
          <a href={`https://twitter.com/${AUTHOR.social.twitter}`} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </li>
      )}
      {AUTHOR.social.github && (
        <li>
          <a href={`https://github.com/${AUTHOR.social.github}`} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
      )}
      {AUTHOR.social.linkedin && (
        <li>
          <a href={`https://linkedin.com/in/${AUTHOR.social.linkedin}`} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
      )}
    </ul>
  </nav>

  <nav aria-label="Academic profile links">
    <h3 class="sr-only">Academic Profiles</h3>
    <ul class="academic-links">
      {AUTHOR.academic.googleScholar && (
        <li>
          <a href={AUTHOR.academic.googleScholar} target="_blank" rel="noopener noreferrer">
            Google Scholar
          </a>
        </li>
      )}
      {AUTHOR.academic.orcid && (
        <li>
          <a href={AUTHOR.academic.orcid} target="_blank" rel="noopener noreferrer">
            ORCID
          </a>
        </li>
      )}
    </ul>
  </nav>
</aside>

<style>
  /* Mobile-first: full width, stacked */
  .author-sidebar {
    width: 100%;
    margin-bottom: var(--space-md);
    padding: var(--space-md);
    background: var(--color-header-bg);
    border: 1px solid var(--color-border);
    border-radius: 4px;
  }

  .author-card {
    text-align: center;
  }

  .author-photo {
    border-radius: 50%;
    width: 150px;
    height: 150px;
    object-fit: cover;
  }

  .author-name {
    margin: var(--space-sm) 0 var(--space-xs) 0;
    font-size: 1.25rem;
  }

  .author-bio {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: var(--space-md);
  }

  .social-links,
  .academic-links {
    list-style: none;
    padding: 0;
    margin: var(--space-sm) 0;
  }

  .social-links li,
  .academic-links li {
    margin: var(--space-xs) 0;
  }

  /* Desktop: fixed sidebar width */
  @media (min-width: 768px) {
    .author-sidebar {
      width: 250px;
      flex-shrink: 0;
      margin-bottom: 0;
    }

    .author-photo {
      width: 200px;
      height: 200px;
    }
  }

  /* Compact variant for specific pages */
  .compact .author-photo {
    width: 100px;
    height: 100px;
  }

  .compact .author-name {
    font-size: 1.1rem;
  }
</style>
```

### Site Configuration File
```typescript
// Source: https://thevalleyofcode.com/astro-access-configuration/
// src/config/site.ts

export const SITE = {
  title: 'Pedro Figueira',
  description: 'Academic researcher - HCI, nomadic work, and digital technologies',
  url: 'https://pedropaf.com',
};

export const AUTHOR = {
  name: 'Pedro Ferreira',
  bio: 'Academic interested in leisure and the representation of users',
  avatar: '/images/profile.png',
  location: 'Location',
  email: '',
  social: {
    twitter: 'pedro2_0',
    github: 'bacilo',
    linkedin: '',
  },
  academic: {
    googleScholar: 'http://yourfullgooglescholarurl.com',
    orcid: 'http://orcid.org/yourorcidurl',
    researchGate: '',
  },
};
```

### CSS Custom Properties for Sidebar
```css
/* Source: Existing src/styles/global.css */
:root {
  /* Existing properties... */

  /* Sidebar-specific properties */
  --sidebar-width: 250px;
  --sidebar-width-mobile: 100%;
  --author-photo-size: 200px;
  --author-photo-size-mobile: 150px;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode already configured */
    /* Sidebar inherits existing color properties */
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@astrojs/image` package | Built-in `astro:assets` | Astro 3.0 (2023) | No separate package needed, Image component built-in |
| `src/content/config.ts` | `src/content.config.ts` | Astro 5.0 (2024) | Config file moved to root of src/ |
| Max-width media queries | Min-width mobile-first | Industry standard shift (~2015) | Better mobile performance, smaller initial payload |
| Jekyll `_config.yml` author data | Astro TypeScript config | Framework migration | Type safety, better DX, no YAML parsing |
| Global CSS files | Scoped component styles | Astro core feature | Prevents style leakage, better encapsulation |

**Deprecated/outdated:**
- `@astrojs/image` integration: Now built-in as `astro:assets`
- `_config.yml` for site data: Use TypeScript config files for type safety
- Desktop-first responsive: Mobile-first is now standard practice

## Open Questions

1. **Should sidebar be hideable on certain pages?**
   - What we know: BaseLayout props can control component rendering
   - What's unclear: Whether user wants sidebar on ALL pages or selectively
   - Recommendation: Implement showSidebar prop with default true, easy to override per-page

2. **Bio length and truncation strategy?**
   - What we know: Current bio is short (~60 chars)
   - What's unclear: Future expansion plans, whether truncation needed
   - Recommendation: Start with full bio display, add truncation if needed later

3. **Social icon graphics vs text links?**
   - What we know: Text links are more accessible, no image assets needed
   - What's unclear: User's design preference
   - Recommendation: Start with text links, easier to implement and maintain

4. **LinkedIn URL not populated in Jekyll config**
   - What we know: Field exists but is empty in _config.yml
   - What's unclear: Whether user has LinkedIn profile to link
   - Recommendation: Include field in config, conditionally render if populated

## Sources

### Primary (HIGH confidence)
- [Astro Components Documentation](https://docs.astro.build/en/basics/astro-components/) - Component props, TypeScript interfaces
- [Astro Layouts Documentation](https://docs.astro.build/en/basics/layouts/) - Layout composition, data flow
- [Astro Images Guide](https://docs.astro.build/en/guides/images/) - Image component, public folder, CLS prevention
- [Astro Styling Guide](https://docs.astro.build/en/guides/styling/) - Scoped styles, CSS custom properties
- [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/) - Site config patterns

### Secondary (MEDIUM confidence)
- [WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/) - Accessibility standards
- [BrowserStack Responsive Breakpoints](https://www.browserstack.com/guide/responsive-design-breakpoints) - 768px standard, mobile-first approach
- [Building Academic Profiles](https://researchmate.net/building-a-strong-academic-profile/) - ORCID, Google Scholar best practices
- [How to Access Configuration in Astro](https://thevalleyofcode.com/astro-access-configuration/) - Config file patterns
- [W3Schools Responsive Sidebar](https://www.w3schools.com/howto/howto_css_sidebar_responsive.asp) - Basic responsive patterns
- [CSS Sidebar Layout Pitfalls](https://akashhamirwasia.com/blog/how-to-and-not-to-build-sidebar-layouts/) - Anti-patterns to avoid
- [Astro Islands Architecture](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide) - Component anti-patterns

### Tertiary (LOW confidence)
- Various WebSearch results on sidebar design patterns - General guidance, needs verification in implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already in project, official Astro documentation verified
- Architecture: HIGH - Patterns from official Astro docs, verified with WebFetch
- Pitfalls: MEDIUM-HIGH - Mix of official docs (high) and community sources (medium)
- Responsive patterns: HIGH - Industry standard 768px breakpoint, mobile-first well-documented
- Academic links: MEDIUM - Best practices from multiple sources, but specific implementations vary

**Research date:** 2026-02-12
**Valid until:** ~30 days (2026-03-14) - Astro stable, patterns unlikely to change rapidly
