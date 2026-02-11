# Domain Pitfalls

**Domain:** Personal Academic Website with Astro
**Researched:** 2026-02-11
**Confidence:** HIGH (based on Astro ecosystem knowledge + Jekyll migration experience)

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Breaking Publication URLs During Migration

**What goes wrong:** Publications have been cited in papers/CVs with current Jekyll URLs. Changing URL structure breaks these citations and incoming links.

**Why it happens:**
- Jekyll uses permalink customization in frontmatter
- Astro's default routing is different (filename-based)
- Easy to assume "URLs will just work"

**Consequences:**
- Broken links in published papers
- Lost Google Scholar indexing
- Professional credibility hit
- 404s from CVs/resumes pointing to old URLs

**Prevention:**
1. **Map Jekyll URL structure before migration**
   - Document current permalink patterns from _config.yml
   - Check each publication's frontmatter for custom permalinks
   - Example: Jekyll `permalink: /publication/2020-paper-title` must map to Astro route

2. **Configure Astro to match or redirect**
   - Option A: Structure Astro content/pages to generate identical URLs
   - Option B: Add redirects in astro.config.mjs or _redirects file
   - Test every publication URL before going live

3. **Validate with link checker**
   - Run broken-link-checker on dist/ folder before deployment
   - Test critical URLs from Google Scholar/citations

**Detection:**
- Warning signs: "This will be easier if we just change the URL structure"
- Red flag: Not documenting current URLs before starting migration

**Migration-specific code:**
```typescript
// src/content/config.ts - Preserve Jekyll permalinks
const publications = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    permalink: z.string().optional(), // Keep Jekyll permalink for reference
    // ... other fields
  }),
});
```

```astro
---
// src/pages/publications/[slug].astro
// Option: Use Jekyll permalink if it exists
export async function getStaticPaths() {
  const pubs = await getCollection('publications');
  return pubs.map(pub => {
    // Extract slug from Jekyll permalink if it exists
    const slug = pub.data.permalink
      ? pub.data.permalink.split('/').pop()
      : pub.slug;
    return {
      params: { slug },
      props: { pub },
    };
  });
}
---
```

### Pitfall 2: GitHub Pages Base Path Misconfiguration

**What goes wrong:** Site deploys but all assets 404. CSS doesn't load. Links are broken. Site looks completely broken.

**Why it happens:**
- GitHub Pages serves user sites at `username.github.io/` (no base path)
- But project sites at `username.github.io/repo-name/` (with base path)
- Astro needs `base` config set correctly for asset paths
- Easy to test locally (where base isn't needed) and miss the issue

**Consequences:**
- Site looks broken on GitHub Pages but works locally
- All CSS/JS/images 404
- Internal links point to wrong URLs
- Wastes hours debugging "why does this work locally?"

**Prevention:**
1. **Understand your GitHub Pages type**
   - User site: `bacilo.github.io` → No base path needed
   - Project site: `bacilo.github.io/repo-name` → Base path = `/repo-name/`

2. **Configure Astro correctly**
   ```typescript
   // astro.config.mjs
   export default defineConfig({
     site: 'https://bacilo.github.io', // or pedropaf.com
     base: '/', // No subpath for user site
     // If this were a project site:
     // base: '/repo-name/',
   });
   ```

3. **Test build output locally**
   ```bash
   npm run build
   npx http-server dist/ -p 8080
   # Visit http://localhost:8080 and verify assets load
   ```

4. **Add .nojekyll file**
   ```bash
   # Tell GitHub Pages not to process with Jekyll
   touch public/.nojekyll
   ```

**Detection:**
- Warning sign: "Works locally, broken on GitHub Pages"
- Symptom: View source shows paths like `href="/assets/style.css"` but should be `/base/assets/style.css` (if base path needed)

### Pitfall 3: Content Collections Schema Mismatch with Jekyll Frontmatter

**What goes wrong:** Build fails with cryptic Zod validation errors. Existing Jekyll content won't build in Astro.

**Why it happens:**
- Jekyll is permissive with frontmatter (missing fields = undefined)
- Astro Content Collections enforce schemas strictly
- Jekyll uses inconsistent frontmatter across old content
- Example: Some publications have `date`, others `published`, others missing dates

**Consequences:**
- Migration blocked until all content fixed
- Can't identify which files are broken (Zod errors are cryptic)
- Temptation to make everything `.optional()` defeats type safety purpose
- Wastes hours fixing inconsistent metadata

**Prevention:**
1. **Audit Jekyll content before defining schemas**
   ```bash
   # Find all unique frontmatter keys in publications
   grep -h "^[a-z]" _publications/*.md | sort | uniq
   ```

2. **Make strategic fields optional**
   ```typescript
   // src/content/config.ts
   const publications = defineCollection({
     schema: z.object({
       title: z.string(), // Required - every publication has this
       date: z.date(), // Required - critical for sorting
       venue: z.string(), // Required - table stakes
       authors: z.string().optional(), // Optional - some old posts missing
       paperurl: z.string().url().optional(), // Optional - not all have PDFs
       citation: z.string().optional(), // Optional - can be generated
     }),
   });
   ```

3. **Add transformation/coercion**
   ```typescript
   // Handle Jekyll's flexible date formats
   const publications = defineCollection({
     schema: z.object({
       date: z.coerce.date(), // Converts strings to dates
       // ...
     }),
   });
   ```

4. **Validate incrementally**
   ```bash
   # Test with one file first
   mv _publications/* /tmp/
   cp /tmp/2020-sample-paper.md src/content/publications/
   npm run build # Check if schema works
   ```

**Detection:**
- Warning sign: "Let's make everything optional"
- Red flag: Build fails on first attempt, no idea which files are broken

### Pitfall 4: Over-Engineering Portfolio Interactivity Too Early

**What goes wrong:** Spend weeks building complex interactive embeds before core site is launched. Project stalls, never goes live.

**Why it happens:**
- Interactive portfolio is the "fun" part
- Core migration is "boring" but critical
- Perfectionism: "It needs fancy demos before launch"
- Underestimate complexity of embeds (iframes, CORS, sandboxing, mobile)

**Consequences:**
- Core site (publications, talks, blog) not live for months
- Interactive features take 5x longer than estimated
- User frustrated, loses momentum
- Perfect is enemy of done

**Prevention:**
1. **Launch in phases**
   - Phase 1: Publications, talks, about page (parity with Jekyll) → SHIP
   - Phase 2: Basic portfolio with static cards → SHIP
   - Phase 3: Interactive GitHub cards → SHIP
   - Phase 4: Complex embeds/playgrounds → SHIP

2. **Static placeholder for portfolio**
   ```astro
   <!-- Phase 1: Simple portfolio card -->
   <div class="portfolio-card">
     <h3>{project.title}</h3>
     <p>{project.description}</p>
     <a href={project.githubUrl}>View on GitHub →</a>
     <!-- No GitHub API, no embeds, just links -->
   </div>
   ```

3. **Progressive enhancement mindset**
   - Baseline: Portfolio works with just titles and links
   - Enhancement 1: Add GitHub stars/forks (build-time API call)
   - Enhancement 2: Add live demo iframe (lazy load)
   - Enhancement 3: Add code playground embed

**Detection:**
- Warning sign: "I can't launch until the portfolio embeds are perfect"
- Red flag: Week 3 and core site still not built

## Moderate Pitfalls

### Pitfall 5: Not Using Tailwind Typography Plugin

**What goes wrong:** Academic content (long-form papers, blog posts) looks cramped and hard to read. Manually writing CSS for typography is tedious.

**Why it happens:**
- Tailwind utility classes are great for layouts
- But long-form markdown content needs prose styles
- Easy to forget Typography plugin exists
- Default markdown rendering is unstyled

**Prevention:**
```bash
npm install @tailwindcss/typography
```

```typescript
// tailwind.config.mjs
export default {
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

```astro
<article class="prose prose-lg max-w-none">
  <Content />
</article>
```

### Pitfall 6: Forgetting .nojekyll File

**What goes wrong:** GitHub Pages tries to process Astro dist/ folder with Jekyll. Files starting with `_` are ignored. Site breaks in weird ways.

**Why it happens:**
- GitHub Pages defaults to Jekyll processing
- Astro generates files that look like Jekyll internals
- Not obvious this is needed

**Prevention:**
```bash
# Add to public/ folder, will copy to dist/
touch public/.nojekyll
```

Or in GitHub Actions:
```yaml
- name: Add .nojekyll
  run: touch dist/.nojekyll
```

### Pitfall 7: Hardcoding Dates in Frontmatter as Strings

**What goes wrong:** Content Collections expect Date objects. String dates work sometimes but break sorting/filtering.

**Why it happens:**
- Jekyll accepts date strings liberally
- YAML `date: 2020-01-15` is a string in YAML spec
- Zod can coerce but better to be explicit

**Prevention:**
```typescript
// Use z.coerce.date() to handle both strings and dates
const publications = defineCollection({
  schema: z.object({
    date: z.coerce.date(), // Converts "2020-01-15" → Date object
  }),
});
```

### Pitfall 8: Missing alt Text on Images

**What goes wrong:** Academic sites need accessibility. Screen readers can't describe images without alt text. Institutional compliance fail.

**Why it happens:**
- Easy to forget when migrating image-heavy content
- Jekyll doesn't enforce this
- Astro doesn't either (but should)

**Prevention:**
- Audit images during migration
- Add alt text to every `<img>` or Image component
- Use meaningful descriptions, not "image1.png"

```astro
---
import { Image } from 'astro:assets';
import profilePhoto from '@assets/profile.png';
---
<Image src={profilePhoto} alt="Pedro Ferreira profile photo" />
```

### Pitfall 9: Not Testing Mobile Layout

**What goes wrong:** Site looks great on desktop, broken on mobile. Academic audiences often browse on phones.

**Why it happens:**
- Development happens on desktop
- Easy to forget responsive testing
- Tailwind helps but doesn't make it automatic

**Prevention:**
- Test with browser dev tools (responsive mode)
- Check navigation works on mobile (hamburger menu?)
- Check sidebar stacks on mobile
- Check portfolio embeds don't overflow

### Pitfall 10: GitHub API Rate Limiting (If Client-Side)

**What goes wrong:** GitHub cards make API calls. Users hit rate limits. Cards stop loading.

**Why it happens:**
- GitHub API has rate limits (60 req/hour unauthenticated)
- Client-side requests use visitor's IP
- Multiple GitHub cards = multiple API calls

**Prevention:**
- **Fetch at build time, not client-side**
  ```typescript
  // Good: Build-time fetch
  // src/utils/github.ts
  export async function getRepoData(repo: string) {
    const token = import.meta.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }
  ```

  ```astro
  ---
  // src/components/GitHubCard.astro
  import { getRepoData } from '@utils/github';
  const data = await getRepoData(props.repo); // Build time
  ---
  <div class="github-card">
    <p>⭐ {data.stargazers_count}</p>
  </div>
  ```

- Use GitHub Actions secret for GITHUB_TOKEN (higher rate limit)
- Cache results in HTML (no runtime API calls)

## Minor Pitfalls

### Pitfall 11: Inconsistent Component Naming

**What goes wrong:** Confusion between `PublicationCard.astro` and `Publication-Card.astro` and `publicationCard.astro`.

**Prevention:** Pick a convention and stick to it. Recommend: PascalCase for components (`PublicationCard.astro`).

### Pitfall 12: Not Setting Up TypeScript Path Aliases

**What goes wrong:** Deep relative imports: `import Layout from '../../../layouts/BaseLayout.astro'`

**Prevention:**
```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@assets/*": ["src/assets/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### Pitfall 13: Committing dist/ Folder

**What goes wrong:** Git tracks build artifacts. Merge conflicts on every build.

**Prevention:**
```bash
# .gitignore
dist/
node_modules/
```

### Pitfall 14: Not Documenting Frontmatter Schema

**What goes wrong:** Months later, forgot what fields are required. Add publication with wrong format, build breaks.

**Prevention:** Comment schemas or keep documentation
```typescript
// src/content/config.ts
const publications = defineCollection({
  schema: z.object({
    title: z.string(), // Required: Paper title
    authors: z.string(), // Required: Full author list
    venue: z.string(), // Required: Conference/journal name
    date: z.date(), // Required: Publication date (for sorting)
    paperurl: z.string().url().optional(), // Optional: Link to PDF
    citation: z.string().optional(), // Optional: Formatted citation
  }),
});
```

### Pitfall 15: Overusing React Islands

**What goes wrong:** Every component is `client:load`. Page ships 500KB of JS for a static academic site.

**Prevention:** Default to static Astro components. Only use islands for actual interactivity.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Initial setup | Wrong base path config | Verify GitHub Pages type (user vs project site) |
| Content migration | URL structure changes | Document current URLs, test redirects |
| Content Collections | Schema too strict or too loose | Audit existing frontmatter first, use z.coerce.date() |
| Styling | Unstyled markdown content | Install @tailwindcss/typography early |
| Portfolio | Over-engineering too early | Ship static portfolio first, enhance later |
| Deployment | Missing .nojekyll file | Add to public/ folder |
| GitHub API | Client-side rate limits | Fetch at build time with GitHub token |
| Mobile | Broken responsive layout | Test mobile layout regularly |
| Accessibility | Missing alt text | Audit during migration |

## Preventive Checklist

**Before starting:**
- [ ] Document current Jekyll URL structure
- [ ] Audit frontmatter inconsistencies across content
- [ ] Verify GitHub Pages type (user vs project site)
- [ ] Set expectations: Core site first, enhancements later

**During migration:**
- [ ] Test with one content item per collection first
- [ ] Use z.coerce.date() for date fields
- [ ] Add .nojekyll to public/ folder
- [ ] Set up TypeScript path aliases early
- [ ] Test build output with local server (not just dev mode)

**Before launch:**
- [ ] Validate all publication URLs (broken link checker)
- [ ] Test on mobile (navigation, layout, embeds)
- [ ] Check alt text on all images
- [ ] Verify GitHub Pages base path config
- [ ] Test with `npm run build && npx http-server dist/`

**Post-launch:**
- [ ] Monitor for 404s (Google Search Console)
- [ ] Verify Google Scholar still indexes publications
- [ ] Test all external links from old CVs/papers

## Common Error Messages and Solutions

### "Failed to load module" in browser console
**Cause:** Wrong base path in astro.config.mjs
**Solution:** Check if site is user or project site, set base accordingly

### "Cannot read property 'data' of undefined"
**Cause:** Content Collections query returned nothing (wrong collection name or empty folder)
**Solution:** Check collection name matches folder name in src/content/

### "Expected date, received string"
**Cause:** Zod schema expects Date but frontmatter has string
**Solution:** Use `z.coerce.date()` instead of `z.date()`

### "404 Not Found" for /publications/slug on GitHub Pages
**Cause:** GitHub Pages trying to use Jekyll routing
**Solution:** Add .nojekyll file to dist/ (put in public/ folder)

### "Module not found: Can't resolve '@components/...'"
**Cause:** TypeScript path alias not configured
**Solution:** Add paths to tsconfig.json

## Sources

**Pitfalls identified from:**
- Astro migration documentation (common issues)
- Jekyll to Astro migration experiences (training data)
- GitHub Pages deployment gotchas
- Content Collections validation issues
- Island architecture anti-patterns

**Confidence:** HIGH for migration and deployment pitfalls (well-documented), MEDIUM for portfolio-specific pitfalls (context-dependent).

---

## Summary for Roadmap

**Critical blockers to avoid:**
1. Breaking publication URLs (damages citations)
2. GitHub Pages base path misconfiguration (site looks broken)
3. Schema mismatch with Jekyll frontmatter (migration blocked)
4. Over-engineering portfolio (project never launches)

**Moderate issues to watch:**
- Missing .nojekyll file
- GitHub API rate limiting
- Typography styling
- Mobile layout

**Phase recommendations:**
- Phase 1: Focus on URL preservation, schema validation
- Phase 2: Test deployment early and often
- Phase 3: Portfolio starts static, enhance progressively

**Quality gates:**
- Before starting: Document Jekyll URLs
- Before deploying: Validate all links
- Before interactive features: Core site must be live
