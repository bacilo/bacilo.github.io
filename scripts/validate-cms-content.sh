#!/bin/bash
# Run after CMS edits to ensure content validates against Zod schemas and builds successfully
#
# This script combines two validation steps:
# 1. Frontmatter audit (gray-matter + Zod validation via audit-frontmatter.mjs)
# 2. Astro build (full schema validation + build verification)
#
# Exit codes:
#   0 - All validations passed
#   1 - Frontmatter audit failed OR Astro build failed

set -e

echo ""
echo "=========================================="
echo "CMS Content Validation"
echo "=========================================="
echo ""

# Step 1: Run frontmatter audit
echo "Step 1/2: Running frontmatter audit..."
echo "------------------------------------------"
if node scripts/audit-frontmatter.mjs; then
  echo ""
  echo "✅ Frontmatter audit PASSED"
else
  echo ""
  echo "❌ Frontmatter audit FAILED - fix violations before proceeding"
  exit 1
fi

echo ""

# Step 2: Run Astro build
echo "Step 2/2: Running Astro build..."
echo "------------------------------------------"
if npm run build > /dev/null 2>&1; then
  echo ""
  echo "✅ Astro build PASSED"
else
  echo ""
  echo "❌ Astro build FAILED - content violates Zod schemas"
  echo "Run 'npm run build' to see detailed error messages"
  exit 1
fi

echo ""
echo "=========================================="
echo "✅ All validations PASSED"
echo "=========================================="
echo "Content is valid and safe to deploy"
echo ""
