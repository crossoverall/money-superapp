import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

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

function getAllJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Automated Security Smoke & Content Security Policy (CSP) Suite (Phase 93)', () => {
  describe('Content Security Policy (CSP) Meta Tag Integrity', () => {
    for (const page of CORE_HTML_PAGES) {
      it(`verifies ${page} declares a valid Content-Security-Policy meta tag`, () => {
        const filePath = path.join(ROOT_DIR, page);
        const html = fs.readFileSync(filePath, 'utf8');

        const cspMatch = html.match(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*content="([^"]+)"/i);
        assert.ok(cspMatch, `${page} is missing Content-Security-Policy meta tag`);

        const policy = cspMatch[1];
        assert.ok(policy.includes("default-src 'self'"), `${page} CSP must include "default-src 'self'"`);
        assert.ok(policy.includes("object-src 'none'"), `${page} CSP must include "object-src 'none'"`);
        assert.ok(policy.includes("base-uri 'self'"), `${page} CSP must include "base-uri 'self'"`);

        if (page === 'index.html') {
          // index.html may allow optional Google Identity client for user-consented GDrive vault backup
          assert.ok(
            policy.includes('https://accounts.google.com'),
            'index.html CSP must allow Google accounts for optional drive backup',
          );
        } else {
          // All standalone sub-tools must strictly isolate network connections to self
          assert.ok(policy.includes("connect-src 'self'"), `${page} CSP must restrict connect-src strictly to 'self'`);
          assert.ok(
            policy.includes("frame-src 'none'"),
            `${page} CSP must restrict frame-src to 'none' to prevent clickjacking`,
          );
          assert.ok(
            !policy.includes('https://'),
            `${page} CSP must contain zero remote HTTPS sources for total offline isolation`,
          );
        }
      });
    }
  });

  describe('Prohibition of Dangerous Execution Primitives in Production Code', () => {
    const jsFiles = getAllJsFiles(path.join(ROOT_DIR, 'js'));

    it('proves zero occurrences of eval() across all production JS files', () => {
      for (const file of jsFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const relativePath = path.relative(ROOT_DIR, file);
        assert.ok(
          !/\beval\s*\(/.test(content),
          `Security violation: ${relativePath} contains forbidden eval() execution`,
        );
      }
    });

    it('proves zero occurrences of document.write() across all production JS files', () => {
      for (const file of jsFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const relativePath = path.relative(ROOT_DIR, file);
        assert.ok(
          !/document\.write\s*\(/.test(content),
          `Security violation: ${relativePath} contains forbidden document.write() execution`,
        );
      }
    });

    it('proves zero occurrences of new Function() across all production JS files', () => {
      for (const file of jsFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const relativePath = path.relative(ROOT_DIR, file);
        assert.ok(
          !/new\s+Function\s*\(/.test(content),
          `Security violation: ${relativePath} contains forbidden dynamic new Function() constructor`,
        );
      }
    });
  });

  describe('Zero-Telemetry & Offline Isolation Invariants', () => {
    const jsFiles = getAllJsFiles(path.join(ROOT_DIR, 'js'));
    const BANNED_TRACKER_DOMAINS = [
      'google-analytics.com',
      'googletagmanager.com',
      'segment.io',
      'mixpanel.com',
      'sentry.io',
      'hotjar.com',
      'amplitude.com',
      'facebook.net',
      'doubleclick.net',
    ];

    it('proves zero telemetry or tracking domains exist across all JS files', () => {
      for (const file of jsFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const relativePath = path.relative(ROOT_DIR, file);
        for (const domain of BANNED_TRACKER_DOMAINS) {
          assert.ok(
            !content.includes(domain),
            `Security violation: ${relativePath} references banned telemetry domain "${domain}"`,
          );
        }
      }
    });

    it('proves all standalone sub-pages reference zero external script tags', () => {
      for (const page of CORE_HTML_PAGES) {
        if (page === 'index.html') continue;
        const filePath = path.join(ROOT_DIR, page);
        const html = fs.readFileSync(filePath, 'utf8');
        const remoteScripts = html.match(/<script\b[^>]*?\bsrc=["'](https?:\/\/|\/\/)[^"']+["']/gi) || [];
        assert.deepEqual(
          remoteScripts,
          [],
          `Security violation: ${page} contains external script tag(s): ${JSON.stringify(remoteScripts)}`,
        );
      }
    });
  });

  describe('HTML Escaping & XSS Sanitization Contracts', () => {
    const sharedCode = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
    const mockWindow = {
      addEventListener: () => {},
      removeEventListener: () => {},
      document: {
        documentElement: { lang: '', dataset: {} },
      },
      localStorage: {
        getItem: () => null,
        setItem: () => {},
      },
    };
    const fn = new Function(
      'window',
      'document',
      'localStorage',
      'globalThis',
      `${sharedCode}; return window.MoneyApp;`,
    );
    const MoneyApp = fn(mockWindow, mockWindow.document, mockWindow.localStorage, mockWindow);

    it('verifies escapeHtml neutralizes all standard XSS characters', () => {
      assert.equal(
        MoneyApp.escapeHtml('<script>alert("XSS")</script>'),
        '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;',
      );
      assert.equal(MoneyApp.escapeHtml("foo 'bar' & baz"), 'foo &#39;bar&#39; &amp; baz');
    });

    it('safely handles non-string, null, and empty inputs without throwing', () => {
      assert.equal(MoneyApp.escapeHtml(null), '');
      assert.equal(MoneyApp.escapeHtml(undefined), '');
      assert.equal(MoneyApp.escapeHtml(12345), '12345');
      assert.equal(MoneyApp.escapeHtml(0), '0');
    });
  });
});
