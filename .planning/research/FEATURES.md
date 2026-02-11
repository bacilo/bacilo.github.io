# Feature Landscape: Personal Academic Website

**Domain:** Personal academic/researcher portfolio website
**Researched:** 2026-02-11
**Confidence:** MEDIUM (based on domain knowledge and existing site analysis; web research unavailable)

## Research Note

Web search tools were unavailable during this research phase. Findings are based on:
1. Analysis of existing Jekyll site structure and content
2. Domain knowledge of academic website patterns (as of January 2025)
3. Requirements specified in PROJECT.md

Recommendations should be validated against current (2026) academic website examples before implementation.

---

## Table Stakes

Features users expect from a personal academic website. Missing any of these makes the site feel incomplete or unprofessional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Publications listing** | Core credential for academics; visitors expect to see research output | Medium | Needs metadata (title, venue, date, authors, citation), sorting by date, links to paper/Google Scholar |
| **Author profile/bio** | Establishes identity and credentials; first thing visitors look for | Low | Photo, affiliation, research interests, contact info |
| **Navigation structure** | Users need to find content; standard academic site pattern | Low | Home, Publications, About/CV, Blog/News |
| **Responsive design** | 50%+ traffic is mobile; non-responsive sites feel dated | Medium | Mobile-first or adaptive layout |
| **Contact information** | Visitors need way to reach researcher | Low | Email (minimum), institutional profile link |
| **Professional aesthetic** | Academic credibility requires clean, readable design | Medium | Typography, whitespace, no visual clutter |
| **Fast load times** | Slow sites damage credibility; users leave | Low-Medium | Static generation helps; watch image sizes |
| **Accessible HTML** | Academic institutions expect basic accessibility | Low-Medium | Semantic HTML, alt text, keyboard navigation |
| **Link to institutional profile** | Establishes legitimacy; visitors verify affiliation | Low | Link to university/lab page |
| **Social/academic profiles** | Expected linking: Google Scholar, ORCID, GitHub, LinkedIn | Low | Icon links in sidebar/footer |

### Critical: Publication Metadata

Academic publications require specific structured data:
- Full author list (order matters)
- Venue/journal name
- Year/date
- Citation string or BibTeX
- Links: Paper PDF, Google Scholar, DOI
- Publication type (conference, journal, workshop, poster, etc.)

**Complexity driver:** Citation formatting is table stakes but surprisingly complex. Many academics hand-maintain citation strings to match field conventions (ACM, IEEE, APA, etc.).

---

## Differentiators

Features that set sites apart. Not expected by default, but add significant value or memorability.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Interactive portfolio embeds** | Showcases technical work in action; lets visitors try demos | High | Requires iframe embeds, code playgrounds, data viz; bandwidth-heavy |
| **Curated blog/writing** | Demonstrates thought leadership; builds audience beyond papers | Low-Medium | Needs regular content; quality over quantity |
| **Project showcase with live demos** | Shows applied work, not just papers; appeals to industry/collaborators | Medium-High | GitHub cards (medium), live demos (high), requires hosting strategy |
| **Talk recordings/slides** | Extends reach of presentations; useful for students/interested readers | Low-Medium | Embedding YouTube/Vimeo is easy; hosting own videos is harder |
| **Research themes/groupings** | Helps visitors understand research trajectory; narrative over list | Medium | Requires manual curation; tags/categories help but need maintenance |
| **Teaching materials** | Attracts students; demonstrates pedagogy for hiring | Low-Medium | Syllabi, lecture notes, course pages |
| **Visual timeline** | Makes career progression/research evolution visually clear | Medium | Design-heavy; risk of feeling gimmicky |
| **Search functionality** | Large publication lists benefit from filtering | Medium | Client-side search for static sites; adds complexity |
| **RSS feed for blog** | Supports academic blogging community; easy subscription | Low | Astro has built-in RSS support |
| **Multi-language content** | Accessibility for non-English speakers; institutional requirement in some regions | High | Content duplication; maintenance burden |
| **Download CV button** | Convenience for visitors; common in hiring contexts | Low | PDF generation or static PDF link |

### Standout: Interactive Portfolio

The project requirements specifically call out interactive portfolio features:
- **GitHub repo cards with stats** (Medium complexity) — Uses GitHub API or static generation to show stars/forks/activity
- **Live demo embeds** (Medium-High complexity) — iframes of deployed projects
- **Code playground embeds** (High complexity) — CodeSandbox, StackBlitz, or custom
- **Data visualization embeds** (Medium-High complexity) — Observable, D3, custom charts

**Value:** Most academic sites have static project lists. Interactive demos demonstrate technical depth and invite exploration. Particularly differentiating for HCI/interaction design researchers.

**Risk:** Embeds can break; third-party dependencies; mobile performance issues.

---

## Anti-Features

Features to explicitly NOT build. Either add complexity without value or conflict with the site's purpose.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Comments system** | Maintenance burden; spam; academic discourse happens via email/citations | Provide clear email contact; link to Twitter/Mastodon for discussion |
| **Custom CMS/admin panel** | Over-engineering for monthly updates; Markdown+Git is simpler | Use markdown files + Git workflow (already familiar from Jekyll) |
| **User accounts/login** | No use case for personal academic site; adds security surface | Keep everything public static content |
| **Real-time features** | No need for live chat, notifications, etc.; academic content is evergreen | Static generation is sufficient |
| **Social media feed embeds** | Performance cost; privacy concerns; breaks when APIs change | Link to profiles; don't embed timelines |
| **Auto-updating publication lists** | Scraping Google Scholar/ORCID is brittle; academics want curation control | Manual updates ensure accuracy and selected publications |
| **Complex filtering UI** | Over-engineering for small content sets (dozens of papers, not thousands) | Simple chronological list; maybe year-based grouping |
| **Video backgrounds/animations** | Distracts from content; accessibility issues; feels unprofessional | Clean static design; subtle transitions at most |
| **Newsletter/mailing list** | Maintenance burden; low engagement in academic context | RSS feed for blog; Twitter/Mastodon for announcements |
| **Analytics dashboard** | Can add later if needed; GDPR/privacy concerns; slows initial launch | Simple plausible.io or GitHub Pages built-in stats later |
| **Dark mode toggle** | Nice-to-have but not differentiating; doubles CSS maintenance | Focus on one excellent light theme; revisit later |

### Critical Anti-Feature: Auto-Publication Import

Many researchers are tempted to auto-import from Google Scholar, ORCID, or BibTeX files. **Avoid this.**

**Why:**
- Metadata quality varies wildly (misspellings, wrong venues, duplicates)
- Academics want to curate what's visible (e.g., hide workshop papers, feature journal articles)
- Citation formatting needs manual touch for field conventions
- Build-time API calls are fragile

**Instead:** Manual markdown files with frontmatter (current Jekyll approach works). One-time migration script is fine; continuous sync is not.

---

## Feature Dependencies

```
Publications Page → Citation Metadata (must have structured data)
Publications Page → Google Scholar Links (common pattern)

Blog → RSS Feed (if building a blog audience)
Blog → Tags/Categories (for >10 posts)

Portfolio → GitHub Cards (baseline)
Portfolio → Live Demos (optional enhancement, depends on GitHub Cards UI)

Author Sidebar → Social Links (partial dependency)
Author Sidebar → Profile Photo (required for credibility)

Responsive Design → Navigation Component (mobile menu pattern)

Search → Large Content Set (not worth it for <50 publications)
```

**Phase Implication:** Build Publications and Author Profile first. Portfolio enhancements can layer on later.

---

## Complexity Factors

### High Complexity Features
- **Interactive embeds** (code playgrounds, live demos) — Third-party integrations, fallback handling, mobile optimization
- **Search functionality** — Client-side indexing, UI, maintaining search quality
- **Citation formatting** — Field-specific conventions, proper escaping, BibTeX parsing

### Medium Complexity Features
- **Responsive design** — CSS grid/flexbox, mobile navigation, image optimization
- **Publication metadata** — Structured data, consistent schema, migration from Jekyll
- **GitHub repo cards** — API integration or build-time generation, rate limits, caching

### Low Complexity Features
- **Static pages** (About, CV) — Markdown to HTML
- **Author sidebar** — Component with hardcoded data
- **Navigation** — Link list with active state
- **Social links** — Icon SVGs + URLs

---

## MVP Recommendation

### Phase 1: Core Academic Site (Table Stakes)
Prioritize these features to reach functional parity with existing Jekyll site:

1. **Author profile sidebar** — Bio, photo, affiliation, social links
2. **Publications page** — Migrate existing publications with full metadata
3. **About/Home page** — Landing page with research interests
4. **Talks page** — Migrate existing talks with dates/venues
5. **CV page** — Static markdown page
6. **Responsive layout** — Mobile-friendly design
7. **Navigation** — Links to all sections

**Rationale:** These features make the site professionally viable. Missing any would be a regression from current Jekyll site.

### Phase 2: Content & Engagement (Differentiators)
After core site is live, add differentiating features:

1. **Blog section** — Migrate existing posts + RSS feed
2. **Portfolio page with GitHub cards** — Showcase projects with stats
3. **Download CV button** — PDF link for convenience

**Rationale:** These features add value but aren't blocking launch. Blog posts can migrate gradually.

### Phase 3: Interactive Enhancements (Advanced Differentiators)
Long-term enhancements for technical showcase:

1. **Live demo embeds** — Portfolio projects with interactive previews
2. **Code playground embeds** — Runnable code examples
3. **Data visualization embeds** — Interactive charts/demos

**Rationale:** High complexity, high impact. Requires research on embed strategies, performance optimization, fallback handling. Not critical for initial launch.

---

## Defer: Features Not Worth Building Now

| Feature | Why Defer | Reconsider When |
|---------|-----------|-----------------|
| **Search functionality** | Content set is small (<50 publications); browse is sufficient | Publication count >100 or user feedback requests it |
| **Teaching section** | Marked out-of-scope in requirements | Career focus shifts to teaching |
| **Comments system** | Maintenance burden; marked out-of-scope | Building active blog community (>1000 monthly readers) |
| **Dark mode** | Doubles CSS complexity; nice-to-have | Core site is stable and user feedback requests it |
| **Custom domain** | Requirements specify keeping bacilo.github.io | Branding needs change |
| **Analytics** | Can add later; privacy considerations | Want to measure traffic after 6 months |
| **Multi-language** | No requirement; high maintenance | Institutional requirement or international audience |

---

## Migration-Specific Features

Since this is a Jekyll → Astro rebuild, consider these migration features:

| Feature | Purpose | Complexity | Notes |
|---------|---------|------------|-------|
| **Frontmatter compatibility** | Preserve existing metadata schema | Low | Astro supports YAML frontmatter natively |
| **Collection support** | Map Jekyll collections to Astro | Medium | Use `src/content/` with schemas |
| **Redirect handling** | Maintain URL structure from Jekyll | Low-Medium | Astro can generate same URLs; add redirects if needed |
| **Asset migration** | Move images/PDFs to Astro public folder | Low | Simple file copy |
| **Markdown compatibility** | Ensure existing markdown renders correctly | Low | Astro uses same markdown parser ecosystem |

**Critical for launch:** URL structure must match or redirect. Publications have been cited with current URLs.

---

## Feature Validation Checklist

Before building any feature, ask:

- [ ] **Table stakes?** Would visitors expect this on an academic site?
- [ ] **Differentiating?** Does this make the site memorable or more useful?
- [ ] **Complexity vs value?** Is the effort worth the benefit?
- [ ] **Maintenance burden?** Will this require ongoing updates?
- [ ] **Migration impact?** Does this affect content migration strategy?
- [ ] **Mobile experience?** Does this work well on small screens?
- [ ] **Performance cost?** Does this slow page loads?

---

## Sources & Confidence

**Sources:**
- Existing Jekyll site structure analysis (HIGH confidence for current features)
- Project requirements in .planning/PROJECT.md (HIGH confidence for goals)
- Domain knowledge of academic websites (MEDIUM confidence; training data as of Jan 2025)
- HCI/academic community patterns (MEDIUM confidence; field-specific knowledge)

**Validation needed:**
- Current (2026) academic website examples — were unavailable during research
- Astro-specific implementation patterns — should verify with Astro docs
- GitHub Pages constraints with Astro — needs technical validation
- Performance characteristics of interactive embeds — needs testing

**Recommendation:** Before finalizing roadmap, validate the following with web research:
1. Are there new academic website patterns in 2026 that should influence design?
2. What are current best practices for Astro + GitHub Pages deployment?
3. What embed strategies work well for portfolio demos in 2026?

---

## Summary for Roadmap

**Table stakes (must have):** Publications, talks, author profile, responsive design, professional aesthetic

**Differentiators (high value):** Interactive portfolio embeds, curated blog, GitHub cards, live demos

**Anti-features (don't build):** Comments, auto-publication import, complex filtering, CMS, dark mode (defer)

**Phase structure recommendation:**
1. Core academic site (parity with Jekyll)
2. Content & simple portfolio (GitHub cards)
3. Interactive enhancements (live demos, playgrounds)

**Complexity hotspots:** Citation formatting, responsive design, interactive embeds

**Migration focus:** Preserve URL structure, validate frontmatter compatibility, migrate collections to Astro content layer
