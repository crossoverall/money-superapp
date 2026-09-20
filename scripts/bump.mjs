#!/usr/bin/env node
/**
 * Money Superapp - Automated Semantic Version Bumper
 * Usage:
 *   node scripts/bump.mjs [patch|minor|major]
 *   node scripts/bump.mjs 1.2.0
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv[2] || 'patch';

const indexPath = resolve(ROOT, 'index.html');
let indexHtml = readFileSync(indexPath, 'utf8');
const match = indexHtml.match(/<meta name="version" content="([^"]+)">/);
if (!match) {
  console.error('Error: Could not find <meta name="version" content="..."> in index.html');
  process.exit(1);
}

const currentVersion = match[1];
let newVersion = '';

if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(arg)) {
  newVersion = arg;
} else {
  const parts = currentVersion.split('.').map(Number);
  let [major, minor, patch] = parts;

  if (arg === 'major') {
    major++;
    minor = 0;
    patch = 0;
  } else if (arg === 'minor') {
    minor++;
    patch = 0;
  } else {
    patch++;
  }
  newVersion = `${major}.${minor}.${patch}`;
}

console.log(`Bumping version: v${currentVersion} -> v${newVersion} (${arg})`);

// 1. Update index.html
indexHtml = indexHtml.replace(/<meta name="version" content="[^"]+">/, `<meta name="version" content="${newVersion}">`);
indexHtml = indexHtml.replace(/<span class="version-badge">v[^<]+<\/span>/, `<span class="version-badge">v${newVersion}</span>`);
indexHtml = indexHtml.replace(/Money Superapp v[0-9.]+/g, `Money Superapp v${newVersion}`);
writeFileSync(indexPath, indexHtml);
console.log(`  ✓ Updated index.html`);

// 2. Update sw.js CACHE_NAME
const swPath = resolve(ROOT, 'sw.js');
let swJs = readFileSync(swPath, 'utf8');
swJs = swJs.replace(/const CACHE_NAME = 'money-superapp-v[^']+';/, `const CACHE_NAME = 'money-superapp-v${newVersion}';`);
writeFileSync(swPath, swJs);
console.log(`  ✓ Updated sw.js (CACHE_NAME = money-superapp-v${newVersion})`);

// 3. Update all 7 calculator & dashboard tools footers
const toolFiles = [
  'dashboard.html',
  'rebalance.html',
  'months-slips.html',
  'tax-calculator-base.html',
  'tax-calculator.html',
  'remaining-money.html',
  'debt-calculator.html'
];

for (const file of toolFiles) {
  const p = resolve(ROOT, file);
  let content = readFileSync(p, 'utf8');
  content = content.replace(/<meta name="version" content="[^"]+">/, `<meta name="version" content="${newVersion}">`);
  content = content.replace(/Money Superapp v[0-9.]+/g, `Money Superapp v${newVersion}`);
  content = content.replace(/v[0-9]+\.[0-9]+(\.[0-9]+)?/g, `v${newVersion}`);
  writeFileSync(p, content);
  console.log(`  ✓ Updated ${file}`);
}

// 4. Update README.md
const readmePath = resolve(ROOT, 'README.md');
let readme = readFileSync(readmePath, 'utf8');
readme = readme.replace(/# Money Superapp \(v[0-9.]+\)/, `# Money Superapp (v${newVersion})`);
writeFileSync(readmePath, readme);
console.log(`  ✓ Updated README.md`);

console.log(`\n🎉 Done! Successfully bumped Money Superapp to v${newVersion}`);
