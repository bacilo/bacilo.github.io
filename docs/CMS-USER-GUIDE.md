# CMS User Guide

This guide covers everything you need to create, edit, and manage content on your site using Sveltia CMS. The CMS provides a user-friendly interface for editing blog posts, publications, talks, and portfolio items without touching code.

---

## Quick Start (First-Time Setup)

### Step 1: Create GitHub Personal Access Token

You'll need a fine-grained Personal Access Token (PAT) to authenticate with the CMS.

1. **Sign in to GitHub** and navigate to Settings
   - Click your profile photo (top-right corner)
   - Select "Settings" from the dropdown menu

2. **Access Developer Settings**
   - Scroll to the bottom of the left sidebar
   - Click "Developer settings"
   - Click "Personal access tokens" → "Fine-grained tokens"

3. **Generate New Token**
   - Click "Generate new token"
   - **Token name:** "CMS Access - bacilo.github.io"
   - **Expiration:** 90 days (recommended for security)
   - **Description:** "Sveltia CMS access for content editing"

4. **Set Repository Access**
   - **Resource owner:** [Your GitHub username]
   - **Repository access:** "Only select repositories"
   - Select: `bacilo/bacilo.github.io`

5. **Configure Permissions**

   Required permissions:
   - **Contents:** Read and write (allows creating/editing content files)
   - **Metadata:** Read-only (repository metadata access)

   All other permissions: Leave unchecked

6. **Generate and Save Token**
   - Click "Generate token"
   - **IMPORTANT:** Copy the token immediately - you won't see it again!
   - Store securely in a password manager

### Step 2: Log In to CMS

1. Navigate to: **https://bacilo.github.io/admin/**
   - For local testing: **http://localhost:4321/admin/index.html** (note: `/admin/` returns 404 on dev server)

2. The CMS will prompt for authentication

3. Paste your Personal Access Token into the authentication field

4. Click "Login"

5. You should see the CMS dashboard with collections in the sidebar: Blog Posts, Publications, Talks, Portfolio

### Security Notes

- **Token expiration:** Tokens should expire for security. Set a calendar reminder to rotate your token before expiration (90 days recommended).
- **Minimal permissions:** This token has ONLY Contents (write) + Metadata (read) access - no organization access, no other repositories.
- **Treat like a password:** Never commit to git, never share, store in a password manager.
- **Revoke if compromised:** Settings → Developer settings → Personal access tokens → Find your token → Revoke

---

## Creating Content

### Blog Posts

**How to create a new blog post:**

1. Click "Blog Posts" in the left sidebar
2. Click "New Blog Posts" button
3. Fill in the fields:
   - **Title** (required): Post title (e.g., "My First Blog Post")
   - **Date** (required): Publication date in YYYY-MM-DD format (e.g., 2026-02-13)
   - **Tags** (optional): Comma-separated list (e.g., "research, design, HCI")
   - **Permalink** (optional): Custom URL path (leave blank to auto-generate from title)
   - **Body** (required): Write your post content in Markdown
4. Click "Save"

**File naming:** Posts are saved as `src/content/posts/YYYY-MM-DD-slug.md` (e.g., `2026-02-13-my-first-blog-post.md`)

**Date format:** Must be YYYY-MM-DD. Examples: 2026-02-13, 2025-12-25. Do not use MM/DD/YYYY or DD-MM-YYYY formats.

### Publications

**How to add a new publication:**

1. Click "Publications" in the left sidebar
2. Click "New Publications" button
3. Fill in the fields:
   - **Title** (required): Publication title
   - **Permalink** (required): URL path (e.g., "/publication/paper-2026")
   - **Date** (required): Publication date in YYYY-MM-DD format
   - **Venue** (required): Conference/journal name (e.g., "CHI 2026")
   - **Citation** (required): Full citation text (multi-line supported)
   - **Paper URL** (optional): Link to PDF or DOI (must be full URL starting with https://)
   - **Excerpt** (optional): Short description (multi-line supported)
   - **Collection** (auto-set): Automatically set to "publications" (hidden field)
   - **Body** (required): Extended description or abstract in Markdown
4. Click "Save"

**File naming:** Publications are saved as `src/content/publications/YYYY-MM-DD-slug.md`

**Citation field:** Use the text widget for multi-line citations. Format example:
```
Author Name. (2026). Paper Title. In Proceedings of CHI 2026
Conference on Human Factors in Computing Systems (CHI '26).
Association for Computing Machinery, New York, NY, USA, 1-12.
```

### Talks

**How to add a new talk:**

1. Click "Talks" in the left sidebar
2. Click "New Talks" button
3. Fill in the fields:
   - **Title** (required): Talk title
   - **Type** (required): Talk format (e.g., "Talk", "Keynote", "Workshop", "Panel")
   - **Permalink** (required): URL path (e.g., "/talks/chi-2026-keynote")
   - **Venue** (required): Event name (e.g., "CHI 2026")
   - **Date** (required): Talk date in YYYY-MM-DD format
   - **Location** (required): City and country (e.g., "San Jose, USA")
   - **Collection** (auto-set): Automatically set to "talks" (hidden field)
   - **Body** (required): Talk description or abstract in Markdown
4. Click "Save"

**File naming:** Talks are saved as `src/content/talks/YYYY-MM-DD-slug.md`

**Type examples:** Use clear, descriptive types like "Talk", "Keynote", "Workshop", "Tutorial", "Panel Discussion"

### Portfolio

**How to add a portfolio item:**

1. Click "Portfolio" in the left sidebar
2. Click "New Portfolio" button
3. Fill in the fields:
   - **Title** (required): Project name
   - **Excerpt** (optional): Short project description (multi-line supported)
   - **Repository URL** (optional): GitHub repo link (must be valid URL: https://...)
   - **Demo URL** (optional): Live demo link (must be valid URL: https://...)
   - **Description** (optional): Extended description (multi-line supported)
   - **Playground URL** (optional): Interactive demo link (must be valid URL: https://...)
   - **Collection** (auto-set): Automatically set to "portfolio" (hidden field)
   - **Body** (required): Full project description in Markdown
4. Click "Save"

**File naming:** Portfolio items are saved as `src/content/portfolio/slug.md` (no date prefix)

**URL fields:** All URL fields require valid URLs starting with `https://` (or `http://`). Examples:
- Valid: `https://github.com/username/repo`
- Invalid: `github.com/username/repo` (missing protocol)

---

## Editing and Deleting Content

### Editing Existing Content

1. Click the collection in the left sidebar (e.g., "Blog Posts")
2. Click on the item you want to edit from the content list
3. Modify any fields
4. Click "Save"
5. The CMS automatically creates a Git commit with your changes

**Note:** Each save creates a new commit. Changes are immediately pushed to your repository.

### Deleting Content

1. Click the collection in the left sidebar
2. Click on the item you want to delete
3. Click the "Delete" button (usually in the top toolbar or settings)
4. Confirm deletion
5. The file is removed from the repository and a commit is created

**Warning:** Deletion is permanent. The file is removed from the `src/content/` directory. You can recover from Git history if needed.

---

## Media Library

### Uploading Images

1. Click "Media" in the left sidebar
2. Click "Upload" button
3. Select image file(s) from your computer
4. Images are uploaded to `public/images/uploads/`
5. Images appear in the media library grid

**File location:** Uploaded images are stored at `public/images/uploads/[filename]` in your repository

**Supported formats:** JPG, PNG, GIF, WebP (standard web image formats)

### Inserting Images into Content

1. Open any content item for editing (blog post, publication, etc.)
2. In the Body field (markdown editor), insert image using markdown syntax:
   ```markdown
   ![Alt text description](/images/uploads/your-image.jpg)
   ```
3. The path is always `/images/uploads/[filename]` (URL path, not file system path)
4. Save the content

**Example:**
```markdown
Here is my screenshot:

![Screenshot of my project interface](/images/uploads/project-screenshot.png)

The image shows...
```

**Important:** Use `/images/uploads/` as the path prefix (not `public/images/uploads/`). This is the URL path that will work on your deployed site.

---

## Validating Your Changes

After creating or editing content via the CMS, you should validate that everything builds correctly.

### Run Build Validation Script

The repository includes a validation script that checks both frontmatter schemas and Astro build:

```bash
bash scripts/validate-cms-content.sh
```

**What it does:**
1. Runs frontmatter audit (gray-matter + Zod validation)
2. Runs Astro build (full site build verification)
3. Reports pass/fail for each step

**If validation passes:** You'll see:
```
✅ All validations PASSED
Content is valid and safe to deploy
```

**If validation fails:** You'll see error messages indicating which file and which field has an issue. Common errors:

- **"date: Expected date, received string"** → Date format is wrong. Use YYYY-MM-DD format.
- **"title: Required"** → Missing required field. Add the field in the CMS.
- **"repoUrl: Invalid url"** → URL field is not a valid URL. Ensure it starts with `https://`

### Manual Build Verification

You can also run the Astro build directly:

```bash
npm run build
```

This validates all content against Zod schemas defined in `src/content.config.ts`. If content violates schema constraints, you'll see detailed error messages with file names and field issues.

---

## Troubleshooting

### Authentication Issues

**Problem:** "Authentication failed" when trying to log in

**Solutions:**
- Verify your token has **Contents (Read and write)** permission
- Verify **Repository access** is set to `bacilo/bacilo.github.io`
- Check if token has expired (GitHub Settings → Developer settings → Personal access tokens)
- Try generating a new token with the correct permissions

---

**Problem:** "Session expired" when returning to CMS

**Solutions:**
- Browser cleared localStorage (common in private/incognito mode)
- Token was revoked on GitHub - check token status
- Re-authenticate with the same PAT (it's reusable until expiration)
- Avoid using private/incognito mode if you want session persistence

---

### Build Failures After CMS Edits

**Problem:** Content looks good in CMS preview but build fails with schema errors

**Solutions:**
- Run `bash scripts/validate-cms-content.sh` to see specific validation errors
- Check field formats:
  - **Date fields:** Must be YYYY-MM-DD format
  - **URL fields:** Must start with `https://` (or `http://`)
  - **Required fields:** Cannot be empty
- Compare your content to existing files in `src/content/[collection]/` for format examples
- Fix the content in the CMS and save again

---

**Problem:** Build logs show "InvalidContentEntryFrontmatterError"

**Solutions:**
- This means frontmatter doesn't match the Zod schema in `src/content.config.ts`
- Common causes:
  - Missing required fields (title, date, etc.)
  - Wrong data types (string instead of date)
  - Invalid URL format in URL fields
- Edit the content via CMS, ensure all required fields are filled correctly, and save

---

### Image Not Showing

**Problem:** Uploaded image doesn't render on the site

**Solutions:**
- Verify image was uploaded to `public/images/uploads/` directory
- Check markdown image path: must be `/images/uploads/[filename]` (not `public/images/uploads/`)
- Verify image filename matches exactly (case-sensitive)
- Run `npm run build` to verify build includes the image
- Check `dist/images/uploads/` exists after build with your image file

---

### CMS Access Issues

**Problem:** `/admin/` returns 404 on local dev server

**Solution:**
- Local dev server requires full path: `http://localhost:4321/admin/index.html`
- Production site works with: `https://bacilo.github.io/admin/`
- This is expected behavior - dev server doesn't resolve directory indexes the same way as production

---

**Problem:** CMS loads but collections are empty

**Solutions:**
- You may not be authenticated - check if login prompt appears
- If logged in, verify your PAT has **Contents** read permission (not just write)
- Check browser console for errors (F12 → Console tab)
- Try clearing browser cache and reloading

---

## Schema Reference

The CMS field configurations mirror Zod schemas defined in `src/content.config.ts`. Changes to content schemas require updating both files.

| Collection | Schema File | CMS Config | Required Fields |
|------------|-------------|------------|-----------------|
| Blog Posts | `src/content.config.ts` → `posts` | `public/admin/config.yml` → `posts` | title, date, body |
| Publications | `src/content.config.ts` → `publications` | `public/admin/config.yml` → `publications` | title, collection, permalink, date, venue, citation, body |
| Talks | `src/content.config.ts` → `talks` | `public/admin/config.yml` → `talks` | title, collection, type, permalink, venue, date, location, body |
| Portfolio | `src/content.config.ts` → `portfolio` | `public/admin/config.yml` → `portfolio` | title, body |

### Schema Synchronization

**Important:** If you modify content schemas in `src/content.config.ts`, you must also update field definitions in `public/admin/config.yml` to keep them in sync.

Both files contain comments linking them:
- `content.config.ts`: Schema defines validation rules
- `config.yml`: Comment indicates "Schema mirrors src/content.config.ts -- update both when changing fields"

**Why synchronization matters:** The CMS form fields are defined by `config.yml`, but build validation uses Zod schemas from `content.config.ts`. Mismatches cause build failures even though CMS allows saving the content.

---

## Additional Resources

- **Markdown Guide:** https://www.markdownguide.org/basic-syntax/
- **Sveltia CMS Documentation:** https://sveltiacms.app/en/docs/
- **GitHub Personal Access Tokens:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

---

**Last Updated:** 2026-02-13
**CMS Version:** Sveltia CMS (beta)
**Astro Version:** 5.0+
