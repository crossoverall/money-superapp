import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import zlib from 'node:zlib';

const ROOT_DIR = process.cwd();

const CORE_HTML_PAGES = [
  'index.html',
  'dashboard.html',
  'rebalance.html',
  'months-slips.html',
  'tax-calculator-base.html',
  'tax-calculator.html',
  'remaining-money.html',
  'debt-calculator.html',
];

// Strict production budgets for 100% offline-first PWA performance
const MAX_RAW_PAYLOAD_BYTES = 950 * 1024; // 950 KB uncompressed ceiling across all scripts + styles per tool
const MAX_GZIP_PAYLOAD_BYTES = 220 * 1024; // 220 KB gzipped wire transfer budget per tool
const MAX_HTML_PAGE_BYTES = 150 * 1024; // 150 KB uncompressed ceiling per HTML file

describe('Pillar 6.2: Automated Asset Size & Zero-Dependency Budget Gate (Phase 134)', () => {
  describe('1. ADR-001 Zero-Dependency Contract Invariants', () => {
    it('verifies package.json declares strictly zero runtime dependencies', () => {
      const pkgPath = path.join(ROOT_DIR, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

      assert.ok(
        !pkg.dependencies || Object.keys(pkg.dependencies).length === 0,
        'package.json must not declare any runtime dependencies (ADR-001 compliance)',
      );

      // Verify devDependencies are strictly tooling (e.g. Biome)
      if (pkg.devDependencies) {
        for (const dep of Object.keys(pkg.devDependencies)) {
          assert.match(
            dep,
            /^(@biomejs\/biome)$/,
            `Unexpected devDependency: "${dep}". Only approved lint/format tooling permitted.`,
          );
        }
      }
    });

    it('verifies all 8 HTML tools contain zero external stylesheet or script CDNs', () => {
      for (const page of CORE_HTML_PAGES) {
        const filePath = path.join(ROOT_DIR, page);
        const html = fs.readFileSync(filePath, 'utf8');

        // Check for external scripts (excluding user-consented Google Identity in index.html)
        const scriptMatches = Array.from(html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi));
        for (const match of scriptMatches) {
          const src = match[1];
          if (page === 'index.html' && src.includes('accounts.google.com')) {
            continue; // Optional Google Drive vault client
          }
          assert.ok(
            !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//'),
            `${page} references external script CDN: "${src}". Must be local/self-contained.`,
          );
        }

        // Check for external stylesheets
        const linkMatches = Array.from(html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi));
        for (const match of linkMatches) {
          const href = match[1];
          assert.ok(
            !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//'),
            `${page} references external stylesheet CDN: "${href}". Must be local/self-contained.`,
          );
        }
      }
    });
  });

  describe('2. Per-Tool Asset Size & Execution Budget Invariants', () => {
    for (const page of CORE_HTML_PAGES) {
      it(`verifies ${page} raw file size is within ${MAX_HTML_PAGE_BYTES / 1024}KB ceiling`, () => {
        const filePath = path.join(ROOT_DIR, page);
        const stats = fs.statSync(filePath);
        assert.ok(
          stats.size <= MAX_HTML_PAGE_BYTES,
          `${page} size (${(stats.size / 1024).toFixed(1)}KB) exceeds ${MAX_HTML_PAGE_BYTES / 1024}KB ceiling`,
        );
      });

      it(`verifies combined payload for ${page} stays under ${MAX_RAW_PAYLOAD_BYTES / 1024}KB uncompressed and ${MAX_GZIP_PAYLOAD_BYTES / 1024}KB gzipped`, () => {
        const filePath = path.join(ROOT_DIR, page);
        const html = fs.readFileSync(filePath, 'utf8');
        let totalRawBytes = fs.statSync(filePath).size;
        let totalGzipBytes = zlib.gzipSync(fs.readFileSync(filePath)).length;

        // Sum local linked scripts
        const scriptMatches = Array.from(html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi));
        for (const match of scriptMatches) {
          const relPath = match[1].replace(/^\.\//, '');
          if (!relPath.startsWith('http')) {
            const assetPath = path.join(ROOT_DIR, relPath);
            if (fs.existsSync(assetPath)) {
              totalRawBytes += fs.statSync(assetPath).size;
              totalGzipBytes += zlib.gzipSync(fs.readFileSync(assetPath)).length;
            }
          }
        }

        // Sum local linked stylesheets
        const linkMatches = Array.from(html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi));
        for (const match of linkMatches) {
          const relPath = match[1].replace(/^\.\//, '');
          if (!relPath.startsWith('http')) {
            const assetPath = path.join(ROOT_DIR, relPath);
            if (fs.existsSync(assetPath)) {
              totalRawBytes += fs.statSync(assetPath).size;
              totalGzipBytes += zlib.gzipSync(fs.readFileSync(assetPath)).length;
            }
          }
        }

        assert.ok(
          totalRawBytes <= MAX_RAW_PAYLOAD_BYTES,
          `${page} combined uncompressed payload (${(totalRawBytes / 1024).toFixed(1)}KB) exceeds ${MAX_RAW_PAYLOAD_BYTES / 1024}KB budget`,
        );

        assert.ok(
          totalGzipBytes <= MAX_GZIP_PAYLOAD_BYTES,
          `${page} combined gzip payload (${(totalGzipBytes / 1024).toFixed(1)}KB) exceeds ${MAX_GZIP_PAYLOAD_BYTES / 1024}KB transfer budget`,
        );
      });
    }
  });

  describe('3. Service Worker Cache Coverage & Version Freshness Invariant', () => {
    it('verifies sw.js CACHE_NAME matches package.json version', () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
      const swCode = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');

      const cacheMatch = swCode.match(/CACHE_NAME\s*=\s*['"]money-superapp-(v[0-9.]+)['"]/);
      assert.ok(cacheMatch, 'sw.js must define CACHE_NAME with semantic version format');
      assert.equal(
        cacheMatch[1],
        `v${pkg.version}`,
        `sw.js CACHE_NAME version (${cacheMatch[1]}) must match package.json (v${pkg.version})`,
      );
    });

    it('verifies all files in sw.js ASSETS_TO_CACHE physically exist on disk', () => {
      const swCode = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      const assetsMatch = swCode.match(/const\s+ASSETS_TO_CACHE\s*=\s*\[([\s\S]*?)\];/);
      assert.ok(assetsMatch, 'sw.js must declare ASSETS_TO_CACHE array');

      const fn = new Function(`return [${assetsMatch[1]}]`);
      const assets = fn();

      for (const asset of assets) {
        const cleanPath = asset.replace(/^\.\//, '');
        const fullPath = path.join(ROOT_DIR, cleanPath);
        assert.ok(fs.existsSync(fullPath), `Cached asset in sw.js must exist on disk: ${asset}`);
      }
    });
  });
});
