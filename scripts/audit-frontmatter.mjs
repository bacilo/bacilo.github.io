#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

// Mirror the Zod schema from src/content.config.ts for posts collection
const postsSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  permalink: z.string().optional(),
});

async function auditFrontmatter() {
  const postsDir = 'src/content/posts';
  let hasErrors = false;
  let filesChecked = 0;
  let filesValid = 0;

  try {
    const files = await readdir(postsDir);
    const markdownFiles = files.filter(f => f.endsWith('.md'));

    console.log(`\nAuditing ${markdownFiles.length} blog post(s)...\n`);

    for (const file of markdownFiles) {
      filesChecked++;
      const filePath = join(postsDir, file);
      const content = await readFile(filePath, 'utf-8');
      const { data: frontmatter } = matter(content);

      console.log(`Checking: ${file}`);

      // Validate against schema
      const result = postsSchema.safeParse(frontmatter);

      if (!result.success) {
        hasErrors = true;
        console.log(`  ❌ FAIL: Schema validation errors`);
        result.error.errors.forEach(err => {
          console.log(`     - ${err.path.join('.')}: ${err.message}`);
        });
      } else {
        // Check for extraneous fields
        const allowedFields = ['title', 'date', 'tags', 'permalink'];
        const extraFields = Object.keys(frontmatter).filter(
          key => !allowedFields.includes(key)
        );

        if (extraFields.length > 0) {
          hasErrors = true;
          console.log(`  ❌ FAIL: Extraneous fields found: ${extraFields.join(', ')}`);
        } else {
          filesValid++;
          console.log(`  ✅ PASS`);
        }
      }
      console.log('');
    }

    console.log('─'.repeat(50));
    console.log(`Summary: ${filesValid}/${filesChecked} files valid`);

    if (hasErrors) {
      console.log('\n❌ Frontmatter audit FAILED - violations found\n');
      process.exit(1);
    } else {
      console.log('\n✅ Frontmatter audit PASSED - all files valid\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error during audit:', error.message);
    process.exit(1);
  }
}

auditFrontmatter();
