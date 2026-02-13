#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

// Mirror the Zod schemas from src/content.config.ts for all collections

const postsSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  permalink: z.string().optional(),
});

const publicationsSchema = z.object({
  title: z.string(),
  collection: z.literal('publications'),
  permalink: z.string(),
  date: z.coerce.date(),
  venue: z.string(),
  citation: z.string(),
  paperurl: z.string().optional(),
  excerpt: z.string().optional(),
});

const talksSchema = z.object({
  title: z.string(),
  collection: z.literal('talks'),
  type: z.string(),
  permalink: z.string(),
  venue: z.string(),
  date: z.coerce.date(),
  location: z.string(),
});

const portfolioSchema = z.object({
  title: z.string(),
  excerpt: z.string().optional(),
  collection: z.literal('portfolio').optional(),
  repoUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  description: z.string().optional(),
  playgroundUrl: z.string().url().optional(),
});

// Define collections to audit
const collections = [
  {
    name: 'posts',
    directory: 'src/content/posts',
    schema: postsSchema,
    allowedFields: ['title', 'date', 'tags', 'permalink'],
  },
  {
    name: 'publications',
    directory: 'src/content/publications',
    schema: publicationsSchema,
    allowedFields: ['title', 'collection', 'permalink', 'date', 'venue', 'citation', 'paperurl', 'excerpt'],
  },
  {
    name: 'talks',
    directory: 'src/content/talks',
    schema: talksSchema,
    allowedFields: ['title', 'collection', 'type', 'permalink', 'venue', 'date', 'location'],
  },
  {
    name: 'portfolio',
    directory: 'src/content/portfolio',
    schema: portfolioSchema,
    allowedFields: ['title', 'excerpt', 'collection', 'repoUrl', 'demoUrl', 'description', 'playgroundUrl'],
  },
];

async function auditCollection(collection) {
  const { name, directory, schema, allowedFields } = collection;
  let hasErrors = false;
  let filesChecked = 0;
  let filesValid = 0;

  try {
    const files = await readdir(directory);
    const markdownFiles = files.filter(f => f.endsWith('.md'));

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Auditing ${name} collection (${markdownFiles.length} file(s))...`);
    console.log('='.repeat(60));

    for (const file of markdownFiles) {
      filesChecked++;
      const filePath = join(directory, file);
      const content = await readFile(filePath, 'utf-8');
      const { data: frontmatter } = matter(content);

      console.log(`\nChecking: ${file}`);

      // Validate against schema
      const result = schema.safeParse(frontmatter);

      if (!result.success) {
        hasErrors = true;
        console.log(`  ❌ FAIL: Schema validation errors`);
        result.error.errors.forEach(err => {
          console.log(`     - ${err.path.join('.')}: ${err.message}`);
        });
      } else {
        // Check for extraneous fields
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
    }

    console.log(`\n${name} summary: ${filesValid}/${filesChecked} files valid`);

    return { hasErrors, filesChecked, filesValid };
  } catch (error) {
    console.error(`Error auditing ${name} collection:`, error.message);
    return { hasErrors: true, filesChecked: 0, filesValid: 0 };
  }
}

async function auditAllCollections() {
  console.log('\n📋 Frontmatter Audit - All Collections\n');

  let totalFiles = 0;
  let totalValid = 0;
  let anyErrors = false;

  for (const collection of collections) {
    const result = await auditCollection(collection);
    totalFiles += result.filesChecked;
    totalValid += result.filesValid;
    if (result.hasErrors) {
      anyErrors = true;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('OVERALL SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files checked: ${totalFiles}`);
  console.log(`Total files valid: ${totalValid}`);
  console.log(`Collections: ${collections.map(c => `${c.name} (${c.directory.split('/').pop()})`).join(', ')}`);

  if (anyErrors) {
    console.log('\n❌ Frontmatter audit FAILED - violations found\n');
    process.exit(1);
  } else {
    console.log('\n✅ Frontmatter audit PASSED - all files valid\n');
    process.exit(0);
  }
}

auditAllCollections();
