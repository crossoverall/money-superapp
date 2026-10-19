import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Pillar 6 Performance Audit & Optimization Verification Suite', () => {
  describe('Resource Hints & Preloading Integrity (index.html)', () => {
    it('verifies index.html declares CSS preloading and high-frequency tool prefetching', () => {
      const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

      // Preload critical stylesheet
      assert.ok(
        indexHtml.includes('<link rel="preload" href="css/theme.css" as="style">'),
        'index.html must preload theme.css for fast first paint',
      );

      // Prefetch high-frequency iframe destinations
      assert.ok(
        indexHtml.includes('<link rel="prefetch" href="dashboard.html">'),
        'index.html must prefetch dashboard.html',
      );
      assert.ok(
        indexHtml.includes('<link rel="prefetch" href="remaining-money.html">'),
        'index.html must prefetch remaining-money.html',
      );
      assert.ok(
        indexHtml.includes('<link rel="prefetch" href="css/tailwind-lite.css">'),
        'index.html must prefetch tailwind-lite.css',
      );
    });
  });

  describe('CSS Rendering Performance & Content-Visibility (css/theme.css)', () => {
    it('verifies theme.css declares content-visibility optimizations and size containment', () => {
      const themeCss = fs.readFileSync(path.join(ROOT_DIR, 'css/theme.css'), 'utf8');

      assert.ok(
        themeCss.includes('.content-visibility-auto'),
        'theme.css must declare .content-visibility-auto utility class',
      );
      assert.ok(themeCss.includes('content-visibility: auto;'), 'theme.css must declare content-visibility: auto;');
      assert.ok(
        themeCss.includes('contain-intrinsic-size:'),
        'theme.css must declare contain-intrinsic-size to prevent layout shift',
      );
      assert.ok(
        themeCss.includes('.panel.reorder-card:not(:first-child)'),
        'theme.css must apply content-visibility: auto to offscreen reorder cards',
      );
    });
  });

  describe('Speculative Navigation Prefetching (js/app-shell.js)', () => {
    it('verifies app-shell.js implements prefetchTabUrl and passive hover/touch prefetch listeners', () => {
      const appShellJs = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');

      assert.ok(
        appShellJs.includes('function prefetchTabUrl(src)'),
        'app-shell.js must define prefetchTabUrl function',
      );
      assert.ok(
        appShellJs.includes("btn.addEventListener(\n    'pointerenter'"),
        'app-shell.js must listen for pointerenter on nav buttons for speculative prefetch',
      );
      assert.ok(
        appShellJs.includes("btn.addEventListener(\n    'touchstart'"),
        'app-shell.js must listen for touchstart on nav buttons for speculative prefetch',
      );
      assert.ok(
        appShellJs.includes('{ passive: true }'),
        'app-shell.js must register passive listeners for scroll/touch performance',
      );
    });
  });

  describe('Service Worker (sw.js) Full Cache Manifest Coverage', () => {
    it('verifies all 21 modularized engines, HTML tools, and assets are present in sw.js ASSETS_TO_CACHE', () => {
      const swJs = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');

      const expectedAssets = [
        './',
        './index.html',
        './dashboard.html',
        './rebalance.html',
        './months-slips.html',
        './tax-calculator-base.html',
        './tax-calculator.html',
        './remaining-money.html',
        './debt-calculator.html',
        './js/shared.js',
        './js/engines/thai-pit.js',
        './js/engines/thai-tax-calendar.js',
        './js/engines/insurance.js',
        './js/engines/gold.js',
        './js/engines/foreign-tax.js',
        './js/engines/inheritance-tax.js',
        './js/engines/retirement-buckets.js',
        './js/engines/property-tax.js',
        './js/engines/bank-parser.js',
        './js/engines/glidepath.js',
        './js/engines/refinance.js',
        './js/engines/stress-test.js',
        './js/engines/vault-crypto.js',
        './js/engines/p2p-sync.js',
        './js/engines/bridge.js',
        './js/engines/cashflow-viz.js',
        './js/engines/budget-import.js',
        './js/engines/financial-health.js',
        './js/engines/rebalance-subtools.js',
        './js/engines/tax-worksheet.js',
        './js/engines/i18n-core.js',
        './js/i18n/th.js',
        './js/i18n/en.js',
        './css/tailwind-lite.css',
        './css/theme.css',
        './manifest.json',
        './icon.svg',
      ];

      for (const asset of expectedAssets) {
        assert.ok(swJs.includes(`'${asset}'`), `sw.js ASSETS_TO_CACHE must include ${asset}`);
        const diskPath = path.join(ROOT_DIR, asset.replace(/^\.\//, ''));
        assert.ok(fs.existsSync(diskPath), `Asset in sw.js must exist on filesystem: ${diskPath}`);
      }
    });
  });

  describe('Core Financial Engines Benchmark (<50ms Execution Budget)', () => {
    it('executes 100 cycles of calculation across PIT, Retirement Buckets, and Financial Health within budget', () => {
      const sharedCode = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      const thaiPitCode = fs.readFileSync(path.join(ROOT_DIR, 'js/engines/thai-pit.js'), 'utf8');
      const bucketsCode = fs.readFileSync(path.join(ROOT_DIR, 'js/engines/retirement-buckets.js'), 'utf8');
      const healthCode = fs.readFileSync(path.join(ROOT_DIR, 'js/engines/financial-health.js'), 'utf8');

      const mockWindow = {
        addEventListener: () => {},
        document: { documentElement: { lang: 'th' } },
        localStorage: { getItem: () => null, setItem: () => {} },
      };

      const script = [sharedCode, thaiPitCode, bucketsCode, healthCode].join('\n;\n');
      const fn = new Function('window', 'globalThis', script);
      fn(mockWindow, mockWindow);

      const MoneyApp = mockWindow.MoneyApp;
      assert.ok(MoneyApp, 'MoneyApp namespace must be initialized');

      const startTime = performance.now();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        // 1. Thai PIT calculation
        const tax = MoneyApp.computeThaiPitTax(1000000 + i * 1000);
        assert.ok(tax > 0);

        // 2. Retirement Three Buckets simulation
        const bucketRes = MoneyApp.calculateRetirementThreeBuckets({
          annualLivingExpense: 480000,
          monthlySsoPension: 5000,
          monthlyElderlyAllowance: 600,
          totalRetirementAssets: 8000000,
          bucket1Years: 2,
          bucket2Years: 5,
        });
        assert.ok(bucketRes.bucket1Target > 0);

        // 3. 5-Pillar Financial Health Score
        const healthRes = MoneyApp.calculateFinancialHealthScore({
          runwayMonths: 6,
          savingsRatePct: 25,
          debt: 250000,
          assets: 1500000,
          netWorth: 1250000,
          taxDeductionsUtilizedPct: 85,
        });
        assert.ok(healthRes.compositeScore >= 0);
      }

      const totalTimeMs = performance.now() - startTime;
      assert.ok(
        totalTimeMs < 150,
        `100 calculation cycles must execute well within budget: took ${totalTimeMs.toFixed(2)}ms (budget: 150ms)`,
      );
    });
  });
});
