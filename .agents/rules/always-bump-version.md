---
name: Always Bump Version
description: Ensures the version is bumped after any fix or update
---
# Always Bump Version

## Rule
Whenever you make a fix, feature addition, or update to the codebase, you MUST execute the version bumping script before committing and pushing your changes.

## Instructions
1. After completing your code modifications, run the bump script: `node scripts/bump.mjs patch` (or provide the specific new version string).
2. Ensure the version is successfully updated across all files (`sw.js`, `index.html`, etc.).
3. Include the version bump in your git commit message.
