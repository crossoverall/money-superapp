import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { createContext, Script } from 'node:vm';

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

const CORE_JS_SCRIPTS = [
  'js/shared.js',
  'js/engines/thai-pit.js',
  'js/engines/thai-tax-calendar.js',
  'js/engines/insurance.js',
  'js/engines/gold.js',
  'js/engines/foreign-tax.js',
  'js/engines/inheritance-tax.js',
  'js/engines/retirement-buckets.js',
  'js/engines/property-tax.js',
  'js/engines/bank-parser.js',
  'js/engines/glidepath.js',
  'js/engines/refinance.js',
  'js/engines/stress-test.js',
  'js/engines/storage-db.js',
  'js/engines/vault-crypto.js',
  'js/engines/p2p-sync.js',
  'js/engines/bridge.js',
  'js/engines/monte-carlo.js',
  'js/engines/dashboard-viz.js',
  'js/workers/simulation-worker.js',
  'js/app-shell.js',
  'js/dashboard.js',
  'js/remaining-money.js',
  'js/rebalance.js',
  'js/debt-calculator.js',
  'js/tax-calculator-base.js',
  'js/tax-calculator.js',
  'js/months-slips.js',
];

const CORE_STYLESHEETS = ['css/tailwind-lite.css', 'css/theme.css'];

describe('Automated Headless Smoke & Integration Test Suite', () => {
  describe('Document & Core HTML Page Architecture', () => {
    for (const page of CORE_HTML_PAGES) {
      it(`verifies ${page} exists, has valid DOCTYPE, UTF-8 charset, and mobile viewport`, () => {
        const filePath = path.join(ROOT_DIR, page);
        assert.ok(fs.existsSync(filePath), `HTML file ${page} must exist on disk`);

        const content = fs.readFileSync(filePath, 'utf8');
        assert.ok(content.length > 500, `${page} must not be empty (size: ${content.length} bytes)`);

        assert.match(content, /<!doctype\s+html>/i, `${page} must start with standard <!DOCTYPE html>`);
        assert.match(content, /<meta\s+charset=["']?utf-8["']?/i, `${page} must specify UTF-8 charset meta tag`);
        assert.match(content, /<meta\s+name=["']viewport["']/i, `${page} must include mobile viewport meta tag`);
        assert.match(content, /<title>[\s\S]*?<\/title>/i, `${page} must include a valid <title> tag`);
      });
    }

    it('verifies all 8 core HTML pages declare synchronous head theme initialization script', () => {
      for (const page of CORE_HTML_PAGES) {
        const filePath = path.join(ROOT_DIR, page);
        const content = fs.readFileSync(filePath, 'utf8');
        assert.ok(
          content.includes("localStorage.getItem('moneySuperapp.theme')"),
          `${page} must include early head theme initialization script`,
        );
      }
    });

    it('verifies tax-calculator-base.html uses responsive max-w-4xl container layout', () => {
      const taxContent = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      assert.ok(
        taxContent.includes('id="screenCalculatorCard"') && taxContent.includes('max-w-4xl'),
        'tax-calculator-base.html #screenCalculatorCard must use max-w-4xl for comfortable multi-column layout',
      );
      assert.ok(
        !taxContent.includes('max-w-md'),
        'tax-calculator-base.html must not be constrained by narrow max-w-md',
      );
    });

    it('verifies remaining-money.html declares mobile responsive entry-row and min-width constraints', () => {
      const remContent = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      assert.ok(
        remContent.includes('@media (max-width: 480px)'),
        'remaining-money.html must define mobile media query for <= 480px screens',
      );
      assert.ok(
        remContent.includes('.entry-row .name-input') && remContent.includes('min-width: 0'),
        'remaining-money.html must define min-width: 0 on .name-input to prevent flex overflow',
      );
      assert.ok(
        remContent.includes('.pvd-label') && remContent.includes('min-width: 0'),
        'remaining-money.html must define min-width: 0 on .pvd-label to prevent flex overflow',
      );
      assert.ok(
        remContent.includes('.entry-controls'),
        'remaining-money.html must define .entry-controls for anchored right-side inputs and units',
      );
      const remJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'remaining-money.js'), 'utf8');
      assert.ok(
        remJs.includes('entry-controls'),
        'js/remaining-money.js must wrap right-side inputs and buttons in .entry-controls',
      );
    });

    it('verifies dashboard.html declares responsive menu wrapping for h1, .panel-title, and #lbl-dossier-panel-title', () => {
      const dashContent = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(
        dashContent.includes('@media (max-width: 640px)'),
        'dashboard.html must define mobile media query for <= 640px screens',
      );
      assert.ok(
        dashContent.includes('.panel-title') && dashContent.includes('flex-wrap: wrap'),
        'dashboard.html must define flex-wrap: wrap on .panel-title',
      );
      assert.ok(
        dashContent.includes('h1') && dashContent.includes('flex-wrap: wrap'),
        'dashboard.html must define flex-wrap: wrap on h1',
      );
      assert.ok(
        dashContent.includes('#lbl-dossier-panel-title') && dashContent.includes('flex-direction: column'),
        'dashboard.html must define flex-direction: column for #lbl-dossier-panel-title under mobile query',
      );
      assert.ok(
        dashContent.includes('#lbl-dossier-panel-title') && dashContent.includes('flex: 1 1 auto'),
        'dashboard.html must define flex: 1 1 auto for dossier action buttons under mobile query',
      );
    });

    it('verifies tax-calculator.html aligns container margins with remaining-money standard', () => {
      const taxContent = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator.html'), 'utf8');
      assert.ok(
        taxContent.includes('padding: 26px 16px 70px') &&
          taxContent.includes('max-width: 896px') &&
          taxContent.includes('margin-inline: auto'),
        'tax-calculator.html body must align with 896px max-width, margin-inline: auto, and 16px horizontal padding standard',
      );
      assert.ok(
        taxContent.includes('padding: 20px 16px 24px'),
        'tax-calculator.html .card must use 20px 16px 24px padding',
      );
      assert.ok(
        taxContent.includes('@media (max-width: 480px)') && taxContent.includes('padding: 16px 12px 70px'),
        'tax-calculator.html must define mobile <= 480px responsive body padding',
      );
      assert.ok(
        !taxContent.includes('padding: 28px 32px 32px'),
        'tax-calculator.html must not contain legacy 32px card padding',
      );
      assert.ok(
        !taxContent.includes('justify-content: center;\n      padding: 24px;'),
        'tax-calculator.html must not contain legacy 24px body padding with vertical flex centering',
      );
    });

    it('verifies rebalance, remaining-money, debt-calculator, and dashboard align with 896px container width standard', () => {
      const files = ['rebalance.html', 'remaining-money.html', 'debt-calculator.html', 'dashboard.html'];
      for (const file of files) {
        const fileContent = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
        assert.ok(
          fileContent.includes('max-width: 896px') && fileContent.includes('margin-inline: auto'),
          `${file} body must align with 896px max-width and margin-inline: auto`,
        );
      }
    });

    it('verifies index.html declares mobile responsive topbar constraints and element hiding', () => {
      const indexContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(
        indexContent.includes('@media (max-width: 768px)'),
        'index.html must define mobile media query for <= 768px screens',
      );
      assert.ok(
        indexContent.includes('.cmd-k-badge') && indexContent.includes('display: none !important'),
        'index.html must hide .cmd-k-badge on mobile viewports',
      );
      assert.ok(
        indexContent.includes('#lbl-pwa-install') && indexContent.includes('display: none !important'),
        'index.html must hide #lbl-pwa-install on mobile viewports',
      );
      assert.ok(
        indexContent.includes('@media (max-width: 480px)'),
        'index.html must define smartphone media query for <= 480px screens',
      );
      assert.ok(
        indexContent.includes('.brand-title') && indexContent.includes('display: none !important'),
        'index.html must hide .brand-title on <= 480px screens to preserve header width',
      );
      assert.ok(
        indexContent.includes('@media (max-width: 380px)'),
        'index.html must define ultra-compact mobile media query for <= 380px screens',
      );
    });
  });

  describe('Script & Stylesheet Dependency Integrity', () => {
    it('verifies all referenced script files in all HTML pages exist on disk', () => {
      for (const page of CORE_HTML_PAGES) {
        const filePath = path.join(ROOT_DIR, page);
        const content = fs.readFileSync(filePath, 'utf8');

        const scriptSrcRegex = /<script\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi;
        let match = scriptSrcRegex.exec(content);
        const scriptsFound = [];

        while (match !== null) {
          const src = match[1];
          scriptsFound.push(src);
          match = scriptSrcRegex.exec(content);
        }

        assert.ok(scriptsFound.length > 0, `${page} should reference at least one script`);

        for (const src of scriptsFound) {
          if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
            continue; // Remote scripts checked in ADR-001 suite
          }
          const cleanSrc = src.replace(/^\.\//, '');
          const targetPath = path.join(ROOT_DIR, cleanSrc);
          assert.ok(fs.existsSync(targetPath), `Script target "${src}" in ${page} does not exist on disk`);
          const stat = fs.statSync(targetPath);
          assert.ok(stat.size > 0, `Script target "${src}" in ${page} is empty`);
        }
      }
    });

    it('verifies all referenced stylesheet links in all HTML pages exist on disk', () => {
      for (const page of CORE_HTML_PAGES) {
        const filePath = path.join(ROOT_DIR, page);
        const content = fs.readFileSync(filePath, 'utf8');

        const linkRegex = /<link\b[^>]*?\bhref=["']([^"']+\.css)["'][^>]*>/gi;
        let match = linkRegex.exec(content);
        const linksFound = [];

        while (match !== null) {
          linksFound.push(match[1]);
          match = linkRegex.exec(content);
        }

        for (const href of linksFound) {
          const cleanHref = href.replace(/^\.\//, '');
          const targetPath = path.join(ROOT_DIR, cleanHref);
          assert.ok(fs.existsSync(targetPath), `CSS link "${href}" in ${page} does not exist on disk`);
          const stat = fs.statSync(targetPath);
          assert.ok(stat.size > 0, `CSS link "${href}" in ${page} is empty`);
        }
      }
    });

    it('verifies tailwind-lite.css declares essential grid and responsive column utilities', () => {
      const tailwindPath = path.join(ROOT_DIR, 'css', 'tailwind-lite.css');
      assert.ok(fs.existsSync(tailwindPath), 'tailwind-lite.css must exist');
      const content = fs.readFileSync(tailwindPath, 'utf8');
      assert.ok(content.includes('.grid-cols-1'), 'missing .grid-cols-1');
      assert.ok(content.includes('.col-span-12'), 'missing .col-span-12');
      assert.ok(content.includes('.md\\:col-span-12'), 'missing .md:col-span-12');
      assert.ok(content.includes('.md\\:grid-cols-12'), 'missing .md:grid-cols-12');
    });

    it('verifies shared.js and app-shell.js declare cross-frame theme synchronization', () => {
      const sharedPath = path.join(ROOT_DIR, 'js', 'shared.js');
      const shellPath = path.join(ROOT_DIR, 'js', 'app-shell.js');
      const sharedCode = fs.readFileSync(sharedPath, 'utf8');
      const shellCode = fs.readFileSync(shellPath, 'utf8');

      assert.ok(shellCode.includes("type: 'THEME_CHANGE'"), 'app-shell.js must dispatch THEME_CHANGE postMessage');
      assert.ok(shellCode.includes("type: 'LANG_CHANGE'"), 'app-shell.js must dispatch LANG_CHANGE postMessage');
      assert.ok(sharedCode.includes("type === 'THEME_CHANGE'"), 'shared.js must listen for THEME_CHANGE message');
      assert.ok(sharedCode.includes("type === 'LANG_CHANGE'"), 'shared.js must listen for LANG_CHANGE message');
    });
  });

  describe('Service Worker (sw.js) Cache Manifest Consistency', () => {
    const swPath = path.join(ROOT_DIR, 'sw.js');
    assert.ok(fs.existsSync(swPath), 'sw.js must exist on disk');
    const swContent = fs.readFileSync(swPath, 'utf8');

    it('validates cache name and version formatting', () => {
      assert.match(swContent, /const\s+CACHE_NAME\s*=\s*['"]money-superapp-v\d+\.\d+\.\d+['"];/);
    });

    it('validates all ASSETS_TO_CACHE entries exist on the filesystem', () => {
      const arrayMatch = swContent.match(/const\s+ASSETS_TO_CACHE\s*=\s*\[([\s\S]*?)\];/);
      assert.ok(arrayMatch, 'ASSETS_TO_CACHE array must be defined in sw.js');

      const rawItems = arrayMatch[1]
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith("'") || line.startsWith('"'))
        .map((line) => line.replace(/^['"]/, '').replace(/['"],?$/, ''));

      assert.ok(rawItems.length >= 20, `ASSETS_TO_CACHE should contain at least 20 items, got ${rawItems.length}`);

      for (const item of rawItems) {
        if (item === './' || item === '/') continue;
        const cleanPath = item.replace(/^\.\//, '');
        const target = path.join(ROOT_DIR, cleanPath);
        assert.ok(fs.existsSync(target), `Asset in ASSETS_TO_CACHE "${item}" does not exist on disk`);
      }

      for (const page of CORE_HTML_PAGES) {
        const hasPage = rawItems.includes(`./${page}`) || rawItems.includes(page);
        assert.ok(hasPage, `Core HTML page ${page} must be present in sw.js ASSETS_TO_CACHE`);
      }

      for (const script of CORE_JS_SCRIPTS) {
        const hasScript = rawItems.includes(`./${script}`) || rawItems.includes(script);
        assert.ok(hasScript, `Core JS script ${script} must be present in sw.js ASSETS_TO_CACHE`);
      }

      for (const css of CORE_STYLESHEETS) {
        const hasCss = rawItems.includes(`./${css}`) || rawItems.includes(css);
        assert.ok(hasCss, `Core stylesheet ${css} must be present in sw.js ASSETS_TO_CACHE`);
      }
    });
  });

  describe('ADR-001 Zero-Telemetry & 100% Offline-First Invariant', () => {
    const FORBIDDEN_DOMAINS = [
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com',
      'unpkg.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdn.tailwindcss.com',
      'google-analytics.com',
      'googletagmanager.com',
      'facebook.net',
      'segment.io',
      'mixpanel.com',
      'clarity.ms',
    ];

    it('proves no external remote scripts or CDN links exist in any standalone tool page', () => {
      for (const page of CORE_HTML_PAGES) {
        const filePath = path.join(ROOT_DIR, page);
        const content = fs.readFileSync(filePath, 'utf8');

        for (const domain of FORBIDDEN_DOMAINS) {
          assert.ok(
            !content.includes(domain),
            `Violation of ADR-001: ${page} contains external CDN/telemetry domain "${domain}"`,
          );
        }

        const scriptSrcMatches = content.match(/<script\b[^>]*?\bsrc=["'](https?:\/\/|\/\/)[^"']+["']/gi) || [];
        if (page === 'index.html') {
          // index.html may only reference the optional Google Identity client for appData backup
          assert.ok(
            scriptSrcMatches.every((tag) => tag.includes('accounts.google.com/gsi/client')),
            `Unexpected remote scripts in shell: ${JSON.stringify(scriptSrcMatches)}`,
          );
        } else {
          assert.equal(
            scriptSrcMatches.length,
            0,
            `Violation of ADR-001: Sub-page ${page} imports remote external script(s): ${JSON.stringify(scriptSrcMatches)}`,
          );
        }
      }
    });

    it('proves no JS application file contains external telemetry trackers or remote API calls', () => {
      for (const script of CORE_JS_SCRIPTS) {
        const filePath = path.join(ROOT_DIR, script);
        const content = fs.readFileSync(filePath, 'utf8');

        for (const domain of FORBIDDEN_DOMAINS) {
          assert.ok(
            !content.includes(domain),
            `Violation of ADR-001: ${script} contains external telemetry domain "${domain}"`,
          );
        }
      }
    });
  });

  describe('Semantic Accessibility & Controls Smoke Checks', () => {
    it('verifies index.html navigation elements have semantic ARIA attributes', () => {
      const indexPath = path.join(ROOT_DIR, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf8');

      assert.ok(content.includes('role="tab"'), 'index.html tab buttons must declare role="tab"');
      assert.ok(content.includes('aria-selected'), 'index.html tab buttons must declare aria-selected');
    });

    it('verifies all interactive modal dialogs define aria-modal or role="dialog"', () => {
      const indexPath = path.join(ROOT_DIR, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf8');
      assert.ok(
        content.includes('role="dialog"') || content.includes('aria-modal="true"'),
        'Modal elements in index.html must have dialog role or aria-modal',
      );
    });

    it('verifies rebalance.html and months-slips.html declare semantic ARIA landmark regions', () => {
      const rebalContent = fs.readFileSync(path.join(ROOT_DIR, 'rebalance.html'), 'utf8');
      const slipsContent = fs.readFileSync(path.join(ROOT_DIR, 'months-slips.html'), 'utf8');

      assert.ok(rebalContent.includes('role="region"'), 'rebalance.html must define role="region"');
      assert.ok(rebalContent.includes('aria-label'), 'rebalance.html must define aria-label');
      assert.ok(rebalContent.includes('role="dialog"'), 'rebalance.html modal must define role="dialog"');

      assert.ok(slipsContent.includes('role="region"'), 'months-slips.html must define role="region"');
      assert.ok(slipsContent.includes('role="status"'), 'months-slips.html must define role="status"');
      assert.ok(slipsContent.includes('aria-labelledby'), 'months-slips.html must define aria-labelledby');
    });

    it('verifies theme.css ink tokens conform to WCAG contrast standards', () => {
      const themeCss = fs.readFileSync(path.join(ROOT_DIR, 'css/theme.css'), 'utf8');
      assert.ok(themeCss.includes('--ink-faint: #5E7169;'), 'Light theme --ink-faint must be #5E7169 (WCAG AA)');
      assert.ok(themeCss.includes('--ink-faint: #7F968B;'), 'Dark theme --ink-faint must be #7F968B (WCAG AA)');
    });

    it('verifies theme.css declares semantic token aliases for cross-tool theme harmonization', () => {
      const themeCss = fs.readFileSync(path.join(ROOT_DIR, 'css/theme.css'), 'utf8');
      assert.ok(themeCss.includes('--surface: var(--panel-2);'), 'theme.css must declare --surface alias');
      assert.ok(themeCss.includes('--surface-2: var(--bg);'), 'theme.css must declare --surface-2 alias');
      assert.ok(themeCss.includes('--card-bg: var(--panel);'), 'theme.css must declare --card-bg alias');
      assert.ok(themeCss.includes('--accent: var(--core);'), 'theme.css must declare --accent alias');
      assert.ok(themeCss.includes('--label: var(--ink-dim);'), 'theme.css must declare --label alias');
    });

    it('verifies sub-pages do not contain unharmonized rogue theme classes (slate/indigo/blue focus rings)', () => {
      const taxContent = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      const slipsContent = fs.readFileSync(path.join(ROOT_DIR, 'months-slips.html'), 'utf8');

      assert.ok(!taxContent.includes('dark:bg-slate-'), 'tax-calculator-base.html must not contain dark:bg-slate-*');
      assert.ok(!slipsContent.includes('dark:bg-slate-'), 'months-slips.html must not contain dark:bg-slate-*');
      assert.ok(
        !taxContent.includes('focus:ring-blue-500'),
        'tax-calculator-base.html must not contain focus:ring-blue-500',
      );
      assert.ok(
        !slipsContent.includes('focus:ring-blue-500'),
        'months-slips.html must not contain focus:ring-blue-500',
      );
      assert.ok(
        slipsContent.includes('.bg-emerald-50 { background-color: var(--ok-dim) !important; }'),
        'months-slips.html must map .bg-emerald-50 to var(--ok-dim)',
      );
      assert.ok(
        slipsContent.includes('.text-emerald-800 { color: var(--ok) !important; }'),
        'months-slips.html must map .text-emerald-800 to var(--ok)',
      );
    });

    it('verifies dashboard.html declares Life Insurance Adequacy panel with semantic ARIA region and inputs', () => {
      const dashContent = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(
        dashContent.includes('id="panelInsuranceAdequacy"'),
        'dashboard.html must define #panelInsuranceAdequacy',
      );
      assert.ok(
        dashContent.includes('aria-label="Life Insurance Adequacy &amp; Family Protection Gap"'),
        'dashboard.html must define semantic aria-label on insurance adequacy panel',
      );
      assert.ok(dashContent.includes('id="inpInsDebt"'), 'dashboard.html must define #inpInsDebt');
      assert.ok(dashContent.includes('id="inpInsExpenses"'), 'dashboard.html must define #inpInsExpenses');
      assert.ok(dashContent.includes('id="inpInsSupportYears"'), 'dashboard.html must define #inpInsSupportYears');
      assert.ok(dashContent.includes('id="inpInsLiquid"'), 'dashboard.html must define #inpInsLiquid');
      assert.ok(dashContent.includes('id="inpInsExisting"'), 'dashboard.html must define #inpInsExisting');
      assert.ok(dashContent.includes('id="bar-ins-adequacy"'), 'dashboard.html must define #bar-ins-adequacy');
    });

    it('verifies dashboard.html declares Retirement 3-Bucket Cash Flow panel with semantic ARIA region and inputs', () => {
      const dashContent = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(
        dashContent.includes('id="panelRetirementThreeBuckets"'),
        'dashboard.html must define #panelRetirementThreeBuckets',
      );
      assert.ok(
        dashContent.includes('aria-label="Retirement 3-Bucket Cash Flow &amp; SSO Drawdown Simulator"'),
        'dashboard.html must define semantic aria-label on 3-bucket panel',
      );
      assert.ok(dashContent.includes('id="inpBucketExpense"'), 'dashboard.html must define #inpBucketExpense');
      assert.ok(dashContent.includes('id="inpBucketSsoPension"'), 'dashboard.html must define #inpBucketSsoPension');
      assert.ok(dashContent.includes('id="inpBucketElderly"'), 'dashboard.html must define #inpBucketElderly');
      assert.ok(dashContent.includes('id="inpBucketTotalAssets"'), 'dashboard.html must define #inpBucketTotalAssets');
      assert.ok(dashContent.includes('id="bar-bucket-1"'), 'dashboard.html must define #bar-bucket-1');
      assert.ok(dashContent.includes('id="bar-bucket-2"'), 'dashboard.html must define #bar-bucket-2');
      assert.ok(dashContent.includes('id="bar-bucket-3"'), 'dashboard.html must define #bar-bucket-3');
    });

    it('verifies dashboard.html declares Child Education & Higher Learning Sinking Fund panel with controls', () => {
      const dashContent = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(
        dashContent.includes('id="panelChildEducationPlanner"'),
        'dashboard.html must define #panelChildEducationPlanner',
      );
      assert.ok(
        dashContent.includes('aria-label="Child Education &amp; Higher Learning Sinking Fund Planner"'),
        'dashboard.html must define semantic aria-label on child education panel',
      );
      assert.ok(dashContent.includes('id="inpEduChildAge"'), 'dashboard.html must define #inpEduChildAge');
      assert.ok(dashContent.includes('id="inpEduTargetAge"'), 'dashboard.html must define #inpEduTargetAge');
      assert.ok(dashContent.includes('id="selEduTrack"'), 'dashboard.html must define #selEduTrack');
      assert.ok(
        dashContent.includes('id="inpEduExistingSavings"'),
        'dashboard.html must define #inpEduExistingSavings',
      );
      assert.ok(dashContent.includes('id="val-edu-future-total"'), 'dashboard.html must define #val-edu-future-total');
      assert.ok(dashContent.includes('id="val-edu-shortfall"'), 'dashboard.html must define #val-edu-shortfall');
      assert.ok(dashContent.includes('id="val-edu-monthly-dca"'), 'dashboard.html must define #val-edu-monthly-dca');
      assert.ok(dashContent.includes('id="btnBridgeEduToBudget"'), 'dashboard.html must define #btnBridgeEduToBudget');
    });

    it('verifies tax-calculator-base.html declares Dividend Tax Credit panel with inputs and controls', () => {
      const taxContent = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      assert.ok(
        taxContent.includes('id="dividendTaxCreditCard"'),
        'tax-calculator-base.html must define #dividendTaxCreditCard',
      );
      assert.ok(
        taxContent.includes('id="inpDividendAmount"'),
        'tax-calculator-base.html must define #inpDividendAmount',
      );
      assert.ok(taxContent.includes('id="selCitRate"'), 'tax-calculator-base.html must define #selCitRate');
      assert.ok(
        taxContent.includes('id="chkApplyDividendToTax"'),
        'tax-calculator-base.html must define #chkApplyDividendToTax',
      );
      assert.ok(
        taxContent.includes('id="divCreditVerdictBox"'),
        'tax-calculator-base.html must define #divCreditVerdictBox',
      );
    });

    it('verifies tax-calculator-base.html declares ภ.ง.ด. 90/91 e-Filing Worksheet with copy buttons', () => {
      const taxContent = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      assert.ok(
        taxContent.includes('id="panelEFilingWorksheet"'),
        'tax-calculator-base.html must define #panelEFilingWorksheet',
      );
      assert.ok(
        taxContent.includes('id="btnCopyAllEFiling"'),
        'tax-calculator-base.html must define #btnCopyAllEFiling',
      );
      assert.ok(taxContent.includes('id="valEf401"'), 'tax-calculator-base.html must define #valEf401');
      assert.ok(taxContent.includes('id="valEfGroupA"'), 'tax-calculator-base.html must define #valEfGroupA');
      assert.ok(taxContent.includes('id="valEfNetBalance"'), 'tax-calculator-base.html must define #valEfNetBalance');

      // Phase 74: 500k Ceiling Warning Bridge & Pre-Flight Checklist
      assert.ok(
        taxContent.includes('id="boxRetirementPool500k"'),
        'tax-calculator-base.html must define #boxRetirementPool500k',
      );
      assert.ok(taxContent.includes('id="barPoolProgress"'), 'tax-calculator-base.html must define #barPoolProgress');
      assert.ok(
        taxContent.includes('id="valPoolCombinedText"'),
        'tax-calculator-base.html must define #valPoolCombinedText',
      );
      assert.ok(
        taxContent.includes('id="alertPoolExcessCallout"'),
        'tax-calculator-base.html must define #alertPoolExcessCallout',
      );
      assert.ok(
        taxContent.includes('id="panelEFilingPreFlightChecklist"'),
        'tax-calculator-base.html must define #panelEFilingPreFlightChecklist',
      );
      assert.ok(
        taxContent.includes('id="badgeEfPreflightStatus"'),
        'tax-calculator-base.html must define #badgeEfPreflightStatus',
      );
      assert.ok(taxContent.includes('id="chk-ef-50tawi"'), 'tax-calculator-base.html must define #chk-ef-50tawi');
      assert.ok(taxContent.includes('id="chk-ef-pool500k"'), 'tax-calculator-base.html must define #chk-ef-pool500k');
      assert.ok(taxContent.includes('id="chk-ef-thaiesg"'), 'tax-calculator-base.html must define #chk-ef-thaiesg');
      assert.ok(taxContent.includes('id="chk-ef-consent"'), 'tax-calculator-base.html must define #chk-ef-consent');
      assert.ok(taxContent.includes('id="chk-ef-promptpay"'), 'tax-calculator-base.html must define #chk-ef-promptpay');
      assert.ok(
        taxContent.includes('id="btnCheckAllPreflight"'),
        'tax-calculator-base.html must define #btnCheckAllPreflight',
      );
      assert.ok(
        taxContent.includes('id="btnResetPreflight"'),
        'tax-calculator-base.html must define #btnResetPreflight',
      );
    });

    it('verifies tax-calculator.html declares Land & Building Tax card with controls', () => {
      const taxContent = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator.html'), 'utf8');
      assert.ok(
        taxContent.includes('id="land-building-tax-card"'),
        'tax-calculator.html must define #land-building-tax-card',
      );
      assert.ok(taxContent.includes('id="selLandCategory"'), 'tax-calculator.html must define #selLandCategory');
      assert.ok(
        taxContent.includes('id="txtLandAppraisalValue"'),
        'tax-calculator.html must define #txtLandAppraisalValue',
      );
      assert.ok(taxContent.includes('id="valLandTotalTax"'), 'tax-calculator.html must define #valLandTotalTax');
      assert.ok(taxContent.includes('id="boxLandInstallment"'), 'tax-calculator.html must define #boxLandInstallment');
    });

    it('verifies dashboard.html declares Executive Financial Dossier panel with privacy and print controls', () => {
      const dashContent = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(
        dashContent.includes('id="panelExecutiveDossier"'),
        'dashboard.html must define #panelExecutiveDossier',
      );
      assert.ok(
        dashContent.includes('role="region" aria-label="Executive Financial Dossier"'),
        'dashboard.html must define semantic aria-label on dossier panel',
      );
      assert.ok(dashContent.includes('id="btnTogglePrivacyMask"'), 'dashboard.html must define #btnTogglePrivacyMask');
      assert.ok(dashContent.includes('id="btnPrintDossier"'), 'dashboard.html must define #btnPrintDossier');
      assert.ok(dashContent.includes('id="dossier-networth-val"'), 'dashboard.html must define #dossier-networth-val');
    });

    it('verifies dashboard.html declares Phase 71 Next Best Move Advisor action cards & region', () => {
      const dashContent = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(
        dashContent.includes('id="healthNextBestMovesSection"'),
        'dashboard.html must define #healthNextBestMovesSection',
      );
      assert.ok(
        dashContent.includes('id="healthActionCardsContainer"'),
        'dashboard.html must define #healthActionCardsContainer',
      );
      assert.ok(
        dashContent.includes('role="region" aria-label="Next Best Action Recommendations"'),
        'dashboard.html must define semantic aria-label on action cards container',
      );
      assert.ok(dashContent.includes('id="lbl-next-moves-title"'), 'dashboard.html must define #lbl-next-moves-title');
      assert.ok(
        dashContent.includes('id="lbl-next-moves-subtitle"'),
        'dashboard.html must define #lbl-next-moves-subtitle',
      );
    });

    it('verifies dashboard.html declares Phase 72 Gold & Physical Asset donut segment and breakdown row', () => {
      const dashContent = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(dashContent.includes('id="donutSegGold"'), 'dashboard.html must define #donutSegGold');
      assert.ok(dashContent.includes('id="row-comp-gold"'), 'dashboard.html must define #row-comp-gold');
      assert.ok(dashContent.includes('id="lbl-comp-gold"'), 'dashboard.html must define #lbl-comp-gold');
      assert.ok(dashContent.includes('id="val-comp-gold"'), 'dashboard.html must define #val-comp-gold');
      assert.ok(dashContent.includes('id="pct-comp-gold"'), 'dashboard.html must define #pct-comp-gold');
    });

    it('verifies remaining-money.html declares Income Shock & Emergency Stress-Tester card with controls', () => {
      const remainingContent = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      assert.ok(
        remainingContent.includes('id="panelEmergencyStressTester"'),
        'remaining-money.html must define #panelEmergencyStressTester',
      );
      assert.ok(
        remainingContent.includes('id="chkShowShockTester"'),
        'remaining-money.html must define #chkShowShockTester',
      );
      assert.ok(
        remainingContent.includes('id="selShockScenario"'),
        'remaining-money.html must define #selShockScenario',
      );
      assert.ok(
        remainingContent.includes('id="txtShockSeverance"'),
        'remaining-money.html must define #txtShockSeverance',
      );
      assert.ok(
        remainingContent.includes('id="valShockBarebonesMonths"'),
        'remaining-money.html must define #valShockBarebonesMonths',
      );
      assert.ok(
        remainingContent.includes('id="valShockSsoMonths"'),
        'remaining-money.html must define #valShockSsoMonths',
      );
      assert.ok(
        remainingContent.includes('id="valShockStandardMonths"'),
        'remaining-money.html must define #valShockStandardMonths',
      );
      assert.ok(remainingContent.includes('id="listShockLadder"'), 'remaining-money.html must define #listShockLadder');
    });

    it('verifies MoneyApp exports detectAndParseThaiBankStatement', () => {
      const sharedContent = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(
        sharedContent.includes('detectAndParseThaiBankStatement: detectAndParseThaiBankStatement'),
        'MoneyApp must export detectAndParseThaiBankStatement',
      );
    });

    it('verifies index.html declares Phase 69 Encrypted Offline QR Code P2P Sync modals and controls', () => {
      const indexContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(indexContent.includes('id="btn-open-qr-export"'), 'index.html must define #btn-open-qr-export');
      assert.ok(indexContent.includes('id="btn-open-qr-import"'), 'index.html must define #btn-open-qr-import');
      assert.ok(indexContent.includes('id="qrExportModal"'), 'index.html must define #qrExportModal');
      assert.ok(indexContent.includes('id="qrImportModal"'), 'index.html must define #qrImportModal');
      assert.ok(indexContent.includes('id="qrExportSvgContainer"'), 'index.html must define #qrExportSvgContainer');
      assert.ok(indexContent.includes('id="qrScanVideo"'), 'index.html must define #qrScanVideo');
      assert.ok(indexContent.includes('id="qrManualChunkInput"'), 'index.html must define #qrManualChunkInput');
      assert.ok(indexContent.includes('id="btn-process-qr-chunk"'), 'index.html must define #btn-process-qr-chunk');

      const sharedContent = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(sharedContent.includes('generateQrSvg: renderQrSvg'), 'MoneyApp must export generateQrSvg');
      assert.ok(sharedContent.includes('chunkPayload: chunkPayload'), 'MoneyApp must export chunkPayload');
      assert.ok(sharedContent.includes('assembleChunks: assembleChunks'), 'MoneyApp must export assembleChunks');
    });

    it('verifies index.html declares Phase 70 Biometric & PIN App Lock settings and fullscreen overlay', () => {
      const indexContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(indexContent.includes('id="chkAppLockEnabled"'), 'index.html must define #chkAppLockEnabled');
      assert.ok(indexContent.includes('id="appLockConfigPanel"'), 'index.html must define #appLockConfigPanel');
      assert.ok(indexContent.includes('id="selAutoLockTimeout"'), 'index.html must define #selAutoLockTimeout');
      assert.ok(indexContent.includes('id="btnChangePin"'), 'index.html must define #btnChangePin');
      assert.ok(indexContent.includes('id="btnLockNow"'), 'index.html must define #btnLockNow');
      assert.ok(indexContent.includes('id="appLockOverlay"'), 'index.html must define #appLockOverlay');
      assert.ok(indexContent.includes('id="pinDotsContainer"'), 'index.html must define #pinDotsContainer');
      assert.ok(indexContent.includes('id="btnBiometricUnlock"'), 'index.html must define #btnBiometricUnlock');

      const sharedContent = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(sharedContent.includes('generateSalt: generateSalt'), 'MoneyApp must export generateSalt');
      assert.ok(sharedContent.includes('hashPin: hashPin'), 'MoneyApp must export hashPin');
      assert.ok(sharedContent.includes('verifyPin: verifyPin'), 'MoneyApp must export verifyPin');
      assert.ok(
        sharedContent.includes('formatAppLockTimeout: formatAppLockTimeout'),
        'MoneyApp must export formatAppLockTimeout',
      );
    });

    it('verifies index.html and app-shell.js declare Phase 73 PWA Update Toast and controls', () => {
      const indexContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(indexContent.includes('id="pwaUpdateToast"'), 'index.html must define #pwaUpdateToast');
      assert.ok(indexContent.includes('id="lbl-pwa-update-text"'), 'index.html must define #lbl-pwa-update-text');
      assert.ok(indexContent.includes('id="btnPwaUpdateNow"'), 'index.html must define #btnPwaUpdateNow');
      assert.ok(indexContent.includes('id="lbl-pwa-update-btn"'), 'index.html must define #lbl-pwa-update-btn');
      assert.ok(indexContent.includes('id="btnPwaDismissUpdate"'), 'index.html must define #btnPwaDismissUpdate');
      assert.ok(indexContent.includes('class="pwa-update-toast"'), 'index.html must define .pwa-update-toast');

      const appShellContent = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');
      assert.ok(appShellContent.includes('showPwaUpdateToast'), 'app-shell.js must define showPwaUpdateToast');
      assert.ok(appShellContent.includes('dismissPwaUpdateToast'), 'app-shell.js must define dismissPwaUpdateToast');
      assert.ok(appShellContent.includes('applyPwaUpdate'), 'app-shell.js must define applyPwaUpdate');
      assert.ok(appShellContent.includes('reg.waiting'), 'app-shell.js must check reg.waiting');
      assert.ok(appShellContent.includes('SKIP_WAITING'), 'app-shell.js must post SKIP_WAITING');

      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(swContent.includes('SKIP_WAITING'), 'sw.js must handle SKIP_WAITING message');
      assert.ok(swContent.includes('self.skipWaiting()'), 'sw.js must call self.skipWaiting()');
    });

    it('verifies debt-calculator.html and remaining-money.html declare Phase 75 Velocity Comparator and Bridges', () => {
      const debtHtml = fs.readFileSync(path.join(ROOT_DIR, 'debt-calculator.html'), 'utf8');
      assert.ok(debtHtml.includes('id="boxVelocityComparator"'), 'debt-calculator must define #boxVelocityComparator');
      assert.ok(debtHtml.includes('id="badgeVelocityAdvisor"'), 'debt-calculator must define #badgeVelocityAdvisor');
      assert.ok(debtHtml.includes('id="barVelBaseline"'), 'debt-calculator must define #barVelBaseline');
      assert.ok(debtHtml.includes('id="barVelSnowball"'), 'debt-calculator must define #barVelSnowball');
      assert.ok(debtHtml.includes('id="barVelAvalanche"'), 'debt-calculator must define #barVelAvalanche');
      assert.ok(debtHtml.includes('id="calloutVelocityAdvice"'), 'debt-calculator must define #calloutVelocityAdvice');
      assert.ok(debtHtml.includes('id="cmp-av-firstwin"'), 'debt-calculator must define #cmp-av-firstwin');
      assert.ok(debtHtml.includes('id="cmp-sn-firstwin"'), 'debt-calculator must define #cmp-sn-firstwin');

      const remainingHtml = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      assert.ok(remainingHtml.includes('id="bridgeToDebtBtn"'), 'remaining-money.html must define #bridgeToDebtBtn');
      assert.ok(remainingHtml.includes('id="lblBridgeDebtBtn"'), 'remaining-money.html must define #lblBridgeDebtBtn');
      assert.ok(remainingHtml.includes('class="debt-bridge-btn"'), 'remaining-money.html must define .debt-bridge-btn');

      const debtJs = fs.readFileSync(path.join(ROOT_DIR, 'js/debt-calculator.js'), 'utf8');
      assert.ok(debtJs.includes('checkInboundBridge'), 'debt-calculator.js must define checkInboundBridge');
      assert.ok(debtJs.includes('pendingDebtExtra'), 'debt-calculator.js must check pendingDebtExtra');

      const remainingJs = fs.readFileSync(path.join(ROOT_DIR, 'js/remaining-money.js'), 'utf8');
      assert.ok(remainingJs.includes('sendToDebtPayoff'), 'remaining-money.js must define sendToDebtPayoff');
      assert.ok(remainingJs.includes('pendingDebtExtra'), 'remaining-money.js must set pendingDebtExtra');
    });

    it('verifies tax-calculator-base, remaining-money, and debt-calculator declare Phase 76 Bridges and Alerts', () => {
      const taxHtml = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      assert.ok(taxHtml.includes('id="taxPayableBridgeGroup"'), 'tax-base must define #taxPayableBridgeGroup');
      assert.ok(taxHtml.includes('id="taxRefundBridgeGroup"'), 'tax-base must define #taxRefundBridgeGroup');
      assert.ok(
        taxHtml.includes('id="btnBridgeTaxAccrualMonthly"'),
        'tax-base must define #btnBridgeTaxAccrualMonthly',
      );
      assert.ok(
        taxHtml.includes('id="btnBridgeTaxAccrualInstallments"'),
        'tax-base must define #btnBridgeTaxAccrualInstallments',
      );
      assert.ok(taxHtml.includes('id="btnBridgeTaxRefundToDebt"'), 'tax-base must define #btnBridgeTaxRefundToDebt');
      assert.ok(
        taxHtml.includes('id="btnBridgeTaxRefundToRebalance"'),
        'tax-base must define #btnBridgeTaxRefundToRebalance',
      );

      const remHtml = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      assert.ok(remHtml.includes('id="taxAccrualAlert"'), 'remaining-money must define #taxAccrualAlert');
      assert.ok(remHtml.includes('id="taxAccrualAlertText"'), 'remaining-money must define #taxAccrualAlertText');

      const debtHtml = fs.readFileSync(path.join(ROOT_DIR, 'debt-calculator.html'), 'utf8');
      assert.ok(debtHtml.includes('id="windfallBridgeAlert"'), 'debt-calculator must define #windfallBridgeAlert');
      assert.ok(
        debtHtml.includes('id="windfallBridgeAlertText"'),
        'debt-calculator must define #windfallBridgeAlertText',
      );

      const taxJs = fs.readFileSync(path.join(ROOT_DIR, 'js/tax-calculator-base.js'), 'utf8');
      assert.ok(taxJs.includes('sendTaxPayableToBudget'), 'tax-base js must define sendTaxPayableToBudget');
      assert.ok(taxJs.includes('sendTaxRefundToDebt'), 'tax-base js must define sendTaxRefundToDebt');
      assert.ok(taxJs.includes('sendTaxRefundToRebalance'), 'tax-base js must define sendTaxRefundToRebalance');

      const remJs = fs.readFileSync(path.join(ROOT_DIR, 'js/remaining-money.js'), 'utf8');
      assert.ok(remJs.includes('checkPendingTaxAccrual'), 'remaining-money js must define checkPendingTaxAccrual');
      assert.ok(remJs.includes('pendingTaxAccrual'), 'remaining-money js must check pendingTaxAccrual');

      const debtJs = fs.readFileSync(path.join(ROOT_DIR, 'js/debt-calculator.js'), 'utf8');
      assert.ok(debtJs.includes('pendingDebtWindfall'), 'debt-calculator js must check pendingDebtWindfall');

      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(
        sharedJs.includes('calculateTaxAccrualAndRefundPlan'),
        'shared.js must export calculateTaxAccrualAndRefundPlan',
      );
    });

    it('verifies debt-calculator, remaining-money, and rebalance declare Phase 77 Refinance Bridges and Alerts', () => {
      const debtHtml = fs.readFileSync(path.join(ROOT_DIR, 'debt-calculator.html'), 'utf8');
      assert.ok(
        debtHtml.includes('id="refinanceBridgeActionsContainer"'),
        'debt-calculator must define #refinanceBridgeActionsContainer',
      );
      assert.ok(
        debtHtml.includes('id="btnBridgeRefinanceToBudget"'),
        'debt-calculator must define #btnBridgeRefinanceToBudget',
      );
      assert.ok(
        debtHtml.includes('id="btnBridgeRefinanceToRebalance"'),
        'debt-calculator must define #btnBridgeRefinanceToRebalance',
      );
      assert.ok(
        debtHtml.includes('id="btnBridgeRefinanceExpenseToBudget"'),
        'debt-calculator must define #btnBridgeRefinanceExpenseToBudget',
      );

      const remHtml = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      assert.ok(remHtml.includes('id="refinanceSavingsAlert"'), 'remaining-money must define #refinanceSavingsAlert');
      assert.ok(
        remHtml.includes('id="refinanceSavingsAlertText"'),
        'remaining-money must define #refinanceSavingsAlertText',
      );

      const debtJs = fs.readFileSync(path.join(ROOT_DIR, 'js/debt-calculator.js'), 'utf8');
      assert.ok(
        debtJs.includes('sendRefinanceSavingsToBudget'),
        'debt-calculator js must define sendRefinanceSavingsToBudget',
      );
      assert.ok(
        debtJs.includes('sendRefinanceSavingsToRebalance'),
        'debt-calculator js must define sendRefinanceSavingsToRebalance',
      );
      assert.ok(
        debtJs.includes('sendRefinanceExpenseToBudget'),
        'debt-calculator js must define sendRefinanceExpenseToBudget',
      );

      const remJs = fs.readFileSync(path.join(ROOT_DIR, 'js/remaining-money.js'), 'utf8');
      assert.ok(
        remJs.includes('checkPendingRefinanceSavings'),
        'remaining-money js must define checkPendingRefinanceSavings',
      );
      assert.ok(remJs.includes('pendingRefinanceSavings'), 'remaining-money js must check pendingRefinanceSavings');

      const rebalanceJs = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      assert.ok(rebalanceJs.includes('pendingRebalanceSource'), 'rebalance js must handle pendingRebalanceSource');

      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(sharedJs.includes('calculateDebtConsolidation'), 'shared.js must export calculateDebtConsolidation');
    });

    it('verifies tax-calculator-base and months-slips declare Phase 78 layout parity and defaultCollapsed', () => {
      const taxHtml = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      assert.ok(taxHtml.includes('id="dividendTaxCreditCardBody"'), 'tax-base must declare #dividendTaxCreditCardBody');
      assert.ok(taxHtml.includes('id="panelTaxScenarioBody"'), 'tax-base must declare #panelTaxScenarioBody');
      assert.ok(taxHtml.includes('id="panelTaxCalendarBody"'), 'tax-base must declare #panelTaxCalendarBody');

      const slipsHtml = fs.readFileSync(path.join(ROOT_DIR, 'months-slips.html'), 'utf8');
      assert.ok(slipsHtml.includes('id="panelJobCompare"'), 'months-slips must declare #panelJobCompare');
      assert.ok(slipsHtml.includes('id="panelJobCompareBody"'), 'months-slips must declare #panelJobCompareBody');
      assert.ok(slipsHtml.includes('id="comparePanel"'), 'months-slips must declare #comparePanel');

      const taxJs = fs.readFileSync(path.join(ROOT_DIR, 'js/tax-calculator-base.js'), 'utf8');
      assert.ok(
        taxJs.includes("defaultCollapsed: ['dividendTaxCreditCard', 'panelTaxScenario', 'panelTaxCalendar']"),
        'tax-base js must define defaultCollapsed for auxiliary cards',
      );

      const slipsJs = fs.readFileSync(path.join(ROOT_DIR, 'js/months-slips.js'), 'utf8');
      assert.ok(
        slipsJs.includes("defaultCollapsed: ['panelJobCompare']"),
        'months-slips js must define defaultCollapsed for panelJobCompare',
      );
    });

    it('verifies tax-calculator-base and shared.js declare Phase 79 Bracket Step-Down Analyzer and Bridges', () => {
      const taxHtml = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      assert.ok(taxHtml.includes('id="boxTaxBracketStepDown"'), 'tax-base must declare #boxTaxBracketStepDown');
      assert.ok(taxHtml.includes('id="valMetricStepDownNeed"'), 'tax-base must declare #valMetricStepDownNeed');
      assert.ok(taxHtml.includes('id="valMetricStepDownSaved"'), 'tax-base must declare #valMetricStepDownSaved');
      assert.ok(taxHtml.includes('id="valMetricStepDownRoi"'), 'tax-base must declare #valMetricStepDownRoi');
      assert.ok(taxHtml.includes('id="valMetricToTaxFree"'), 'tax-base must declare #valMetricToTaxFree');
      assert.ok(taxHtml.includes('id="barStepDownProgress"'), 'tax-base must declare #barStepDownProgress');
      assert.ok(taxHtml.includes('id="btnCopyStepDownTarget"'), 'tax-base must declare #btnCopyStepDownTarget');
      assert.ok(
        taxHtml.includes('id="btnBridgeStepDownToRebalance"'),
        'tax-base must declare #btnBridgeStepDownToRebalance',
      );

      const taxJs = fs.readFileSync(path.join(ROOT_DIR, 'js/tax-calculator-base.js'), 'utf8');
      assert.ok(taxJs.includes('renderTaxBracketStepDown'), 'tax-base js must define renderTaxBracketStepDown');
      assert.ok(taxJs.includes('copyStepDownTarget'), 'tax-base js must define copyStepDownTarget');
      assert.ok(taxJs.includes('sendStepDownToRebalance'), 'tax-base js must define sendStepDownToRebalance');

      const rebalanceJs = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      assert.ok(rebalanceJs.includes("'tax_stepdown'"), 'rebalance js must handle tax_stepdown source');

      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(
        sharedJs.includes('calculateTaxBracketStepDown: calculateTaxBracketStepDown'),
        'shared.js must export calculateTaxBracketStepDown',
      );
    });

    it('verifies manifest, sw, app-shell, dashboard, and remaining-money declare Phase 80 Web Share Target and Native Share', () => {
      const manifestJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'manifest.json'), 'utf8'));
      assert.ok(manifestJson.share_target, 'manifest.json must define share_target');
      assert.equal(manifestJson.share_target.method, 'POST');
      assert.equal(manifestJson.share_target.enctype, 'multipart/form-data');
      assert.ok(Array.isArray(manifestJson.share_target.params.files), 'share_target must declare file params');

      const swJs = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(swJs.includes('money-superapp-shared-payload'), 'sw.js must preserve shared-payload cache');
      assert.ok(swJs.includes("url.pathname.endsWith('/index.html')"), 'sw.js must intercept POST to index.html');
      assert.ok(swJs.includes('shared-target-payload'), 'sw.js must store shared-target-payload');

      const dashHtml = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(dashHtml.includes('id="btnShareDossier"'), 'dashboard.html must define #btnShareDossier');
      assert.ok(
        dashHtml.includes('shareDossierExecutiveSummary()'),
        'dashboard.html must bind shareDossierExecutiveSummary',
      );

      const dashJs = fs.readFileSync(path.join(ROOT_DIR, 'js/dashboard.js'), 'utf8');
      assert.ok(
        dashJs.includes('shareDossierExecutiveSummary'),
        'dashboard.js must define shareDossierExecutiveSummary',
      );
      assert.ok(dashJs.includes('btnShareDossier'), 'dashboard.js must localize btnShareDossier');

      const appShellJs = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');
      assert.ok(appShellJs.includes('checkIncomingShareTarget'), 'app-shell.js must define checkIncomingShareTarget');
      assert.ok(appShellJs.includes('shareOrDownloadFile'), 'app-shell.js must define shareOrDownloadFile');

      const remJs = fs.readFileSync(path.join(ROOT_DIR, 'js/remaining-money.js'), 'utf8');
      assert.ok(
        remJs.includes('checkPendingBankStatement'),
        'remaining-money.js must define checkPendingBankStatement',
      );
      assert.ok(
        remJs.includes('moneySuperapp.pendingBankStatement'),
        'remaining-money.js must listen for pendingBankStatement',
      );

      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(
        sharedJs.includes('formatExecutiveDossierSummaryText'),
        'shared.js must export formatExecutiveDossierSummaryText',
      );
      assert.ok(sharedJs.includes('validateShareTargetPayload'), 'shared.js must export validateShareTargetPayload');
    });

    it('verifies Phase 110 Web App Manifest, shortcuts, screenshots, and PWA App Shell install controls', () => {
      const manifestJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'manifest.json'), 'utf8'));
      assert.equal(manifestJson.id, 'money-superapp', 'manifest must declare id');
      assert.equal(manifestJson.lang, 'th-TH', 'manifest must declare lang');
      assert.equal(manifestJson.dir, 'ltr', 'manifest must declare dir');
      assert.equal(manifestJson.orientation, 'any', 'manifest must declare orientation');
      assert.ok(
        Array.isArray(manifestJson.shortcuts) && manifestJson.shortcuts.length >= 4,
        'manifest must declare shortcuts',
      );
      assert.ok(
        Array.isArray(manifestJson.screenshots) && manifestJson.screenshots.length >= 2,
        'manifest must declare screenshots',
      );

      const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(indexHtml.includes('id="btn-pwa-install"'), 'index.html must include #btn-pwa-install');
      assert.ok(indexHtml.includes('id="pwaOfflineBadge"'), 'index.html must include #pwaOfflineBadge');
      assert.ok(indexHtml.includes('id="pwaStatusDot"'), 'index.html must include #pwaStatusDot');
      assert.ok(indexHtml.includes('id="lbl-pwa-offline-badge"'), 'index.html must include #lbl-pwa-offline-badge');

      const appShellJs = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');
      assert.ok(appShellJs.includes('beforeinstallprompt'), 'app-shell.js must listen for beforeinstallprompt');
      assert.ok(appShellJs.includes('appinstalled'), 'app-shell.js must listen for appinstalled');
      assert.ok(appShellJs.includes('function installPwa'), 'app-shell.js must define installPwa');
      assert.ok(appShellJs.includes('function updateNetworkStatus'), 'app-shell.js must define updateNetworkStatus');
    });

    it('verifies dashboard, remaining-money, and shared.js declare Phase 81 Insurance Gap Budget Bridge', () => {
      const dashHtml = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(dashHtml.includes('id="box-ins-premium-bridge"'), 'dashboard.html must define #box-ins-premium-bridge');
      assert.ok(dashHtml.includes('id="val-ins-bridge-gap"'), 'dashboard.html must define #val-ins-bridge-gap');
      assert.ok(dashHtml.includes('id="val-ins-bridge-monthly"'), 'dashboard.html must define #val-ins-bridge-monthly');
      assert.ok(dashHtml.includes('id="val-ins-bridge-annual"'), 'dashboard.html must define #val-ins-bridge-annual');
      assert.ok(
        dashHtml.includes('id="btnBridgeInsuranceToBudget"'),
        'dashboard.html must define #btnBridgeInsuranceToBudget',
      );

      const dashJs = fs.readFileSync(path.join(ROOT_DIR, 'js/dashboard.js'), 'utf8');
      assert.ok(
        dashJs.includes('bridgeInsurancePremiumToBudget'),
        'dashboard.js must define bridgeInsurancePremiumToBudget',
      );
      assert.ok(
        dashJs.includes('moneySuperapp.pendingInsurancePremium'),
        'dashboard.js must persist pendingInsurancePremium',
      );

      const remHtml = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      assert.ok(
        remHtml.includes('id="insurancePremiumBridgeAlert"'),
        'remaining-money.html must define #insurancePremiumBridgeAlert',
      );
      assert.ok(
        remHtml.includes('id="insurancePremiumBridgeAlertText"'),
        'remaining-money.html must define #insurancePremiumBridgeAlertText',
      );

      const remJs = fs.readFileSync(path.join(ROOT_DIR, 'js/remaining-money.js'), 'utf8');
      assert.ok(
        remJs.includes('checkPendingInsurancePremium'),
        'remaining-money.js must define checkPendingInsurancePremium',
      );
      assert.ok(
        remJs.includes('moneySuperapp.pendingInsurancePremium'),
        'remaining-money.js must listen for pendingInsurancePremium',
      );

      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(
        sharedJs.includes('calculateTermLifePremiumEstimate: calculateTermLifePremiumEstimate'),
        'shared.js must export calculateTermLifePremiumEstimate',
      );
    });

    it('verifies all 7 core tool pages and theme.css declare Phase 82 Universal Card Toolbar and Controls', () => {
      const TOOL_PAGES = [
        'dashboard.html',
        'rebalance.html',
        'tax-calculator-base.html',
        'months-slips.html',
        'remaining-money.html',
        'debt-calculator.html',
        'tax-calculator.html',
      ];

      for (const page of TOOL_PAGES) {
        const content = fs.readFileSync(path.join(ROOT_DIR, page), 'utf8');
        assert.ok(
          content.includes('id="cardLayoutToolbar"') || content.includes('class="card-layout-toolbar'),
          `${page} must define #cardLayoutToolbar container`,
        );
      }

      const themeCss = fs.readFileSync(path.join(ROOT_DIR, 'css/theme.css'), 'utf8');
      assert.ok(themeCss.includes('.card-layout-toolbar'), 'theme.css must define .card-layout-toolbar');
      assert.ok(themeCss.includes('.btn-card-toolbar'), 'theme.css must define .btn-card-toolbar');

      const twCss = fs.readFileSync(path.join(ROOT_DIR, 'css/tailwind-lite.css'), 'utf8');
      assert.ok(twCss.includes('.sm\\:grid-cols-2'), 'tailwind-lite.css must define .sm:grid-cols-2');

      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(sharedJs.includes('collapseAll: collapseAll'), 'shared.js must export collapseAll');
      assert.ok(sharedJs.includes('expandAll: expandAll'), 'shared.js must export expandAll');
      assert.ok(sharedJs.includes('toggleAll: toggleAll'), 'shared.js must export toggleAll');
    });

    it('verifies rebalance and remaining-money declare Phase 83 Glidepath DCA to Budget Bridge and Alerts', () => {
      const rebHtml = fs.readFileSync(path.join(ROOT_DIR, 'rebalance.html'), 'utf8');
      assert.ok(rebHtml.includes('id="btnBridgeDcaToBudget"'), 'rebalance.html must define #btnBridgeDcaToBudget');
      assert.ok(
        rebHtml.includes('id="btnBridgeGlidepathToBudget"'),
        'rebalance.html must define #btnBridgeGlidepathToBudget',
      );

      const rebJs = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      assert.ok(rebJs.includes('bridgeDcaToBudget'), 'rebalance.js must define bridgeDcaToBudget');
      assert.ok(rebJs.includes('moneySuperapp.pendingDcaBudget'), 'rebalance.js must persist pendingDcaBudget');

      const remHtml = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      assert.ok(
        remHtml.includes('id="dcaBudgetBridgeAlert"'),
        'remaining-money.html must define #dcaBudgetBridgeAlert',
      );
      assert.ok(
        remHtml.includes('id="dcaBudgetBridgeAlertText"'),
        'remaining-money.html must define #dcaBudgetBridgeAlertText',
      );

      const remJs = fs.readFileSync(path.join(ROOT_DIR, 'js/remaining-money.js'), 'utf8');
      assert.ok(remJs.includes('checkPendingDcaBudget'), 'remaining-money.js must define checkPendingDcaBudget');
      assert.ok(
        remJs.includes('moneySuperapp.pendingDcaBudget'),
        'remaining-money.js must listen for pendingDcaBudget',
      );
    });

    it('verifies scripts/dev.mjs, .githooks/pre-commit, and package.json declare Phase 87 Dev Server and Hooks', () => {
      const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
      assert.equal(pkgJson.scripts.dev, 'node scripts/dev.mjs', 'package.json must declare dev script');
      assert.ok(pkgJson.scripts.prepare.includes('core.hooksPath'), 'package.json must declare prepare hook script');

      const devScriptPath = path.join(ROOT_DIR, 'scripts/dev.mjs');
      assert.ok(fs.existsSync(devScriptPath), 'scripts/dev.mjs must exist');
      const devContent = fs.readFileSync(devScriptPath, 'utf8');
      assert.ok(devContent.includes('/__live_reload_stream'), 'scripts/dev.mjs must implement SSE live reload stream');

      const hookPath = path.join(ROOT_DIR, '.githooks/pre-commit');
      assert.ok(fs.existsSync(hookPath), '.githooks/pre-commit must exist');
      const hookContent = fs.readFileSync(hookPath, 'utf8');
      assert.ok(hookContent.includes('npm run lint'), 'pre-commit hook must run npm run lint');
      assert.ok(hookContent.includes('npm test'), 'pre-commit hook must run npm test');
    });

    it('verifies .github/workflows/ci.yml declares Phase 91 CI Quality Gate across Node matrix', () => {
      const ciPath = path.join(ROOT_DIR, '.github/workflows/ci.yml');
      assert.ok(fs.existsSync(ciPath), '.github/workflows/ci.yml must exist');
      const ciContent = fs.readFileSync(ciPath, 'utf8');
      assert.ok(ciContent.includes('npm run lint'), 'CI workflow must execute npm run lint');
      assert.ok(ciContent.includes('npm test'), 'CI workflow must execute npm test');
      assert.ok(ciContent.includes('node-version: [20, 22]'), 'CI workflow must test Node.js 20 and 22 LTS matrix');
      assert.ok(ciContent.includes('actions/checkout@v4'), 'CI workflow must use actions/checkout@v4');
      assert.ok(ciContent.includes('actions/setup-node@v4'), 'CI workflow must use actions/setup-node@v4');
    });

    it('verifies js/engines/bridge.js and MoneyApp.Bridge declare Phase 92 Unified Bridge Protocol', () => {
      const bridgePath = path.join(ROOT_DIR, 'js/engines/bridge.js');
      assert.ok(fs.existsSync(bridgePath), 'js/engines/bridge.js must exist on disk');
      const bridgeContent = fs.readFileSync(bridgePath, 'utf8');
      assert.ok(bridgeContent.includes('MoneyApp.Bridge = Bridge'), 'bridge.js must export MoneyApp.Bridge');
      assert.ok(bridgeContent.includes('LEGACY_ACTION_MAP'), 'bridge.js must define LEGACY_ACTION_MAP');
      assert.ok(bridgeContent.includes('BroadcastChannel'), 'bridge.js must support BroadcastChannel sync');
    });

    it('verifies all 8 core HTML pages declare Phase 93 Content-Security-Policy meta tags and tests/security.test.mjs exists', () => {
      const secTestPath = path.join(ROOT_DIR, 'tests/security.test.mjs');
      assert.ok(fs.existsSync(secTestPath), 'tests/security.test.mjs must exist on disk');

      for (const page of CORE_HTML_PAGES) {
        const pageHtml = fs.readFileSync(path.join(ROOT_DIR, page), 'utf8');
        assert.ok(
          pageHtml.includes('http-equiv="Content-Security-Policy"'),
          `${page} must declare Content-Security-Policy meta tag`,
        );
      }
    });

    it('verifies js/shared.js exports Phase 94 safeHTML and rawHTML tagged template utilities', () => {
      const sharedContent = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(sharedContent.includes('safeHTML: safeHTML'), 'shared.js must export safeHTML');
      assert.ok(sharedContent.includes('rawHTML: rawHTML'), 'shared.js must export rawHTML');
    });
  });

  describe('Bilingual Localization Structural Symmetry', () => {
    const LOCALIZED_MODULES = ['js/app-shell.js', 'js/dashboard.js', 'js/debt-calculator.js'];

    for (const file of LOCALIZED_MODULES) {
      it(`proves 100% key symmetry between Thai and English in ${file}`, () => {
        const filePath = path.join(ROOT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');

        const match = content.match(/const\s+translations\s*=\s*(\{[\s\S]*?\n\};)/);
        assert.ok(match, `${file} must define a translations object`);

        const fn = new Function(`return ${match[1]}`);
        const t = fn();

        assert.ok(t.th, `${file} translations must contain "th" object`);
        assert.ok(t.en, `${file} translations must contain "en" object`);

        const thKeys = Object.keys(t.th);
        const enKeys = Object.keys(t.en);

        const missingInEn = thKeys.filter((k) => !enKeys.includes(k));
        const missingInTh = enKeys.filter((k) => !thKeys.includes(k));

        assert.deepEqual(
          missingInEn,
          [],
          `In ${file}, keys defined in 'th' but missing in 'en': ${missingInEn.join(', ')}`,
        );
        assert.deepEqual(
          missingInTh,
          [],
          `In ${file}, keys defined in 'en' but missing in 'th': ${missingInTh.join(', ')}`,
        );
      });
    }

    it('verifies tax-calculator.js EN dictionary covers all Social Security simulator elements', () => {
      const filePath = path.join(ROOT_DIR, 'js/tax-calculator.js');
      const content = fs.readFileSync(filePath, 'utf8');

      const ssoKeys = [
        'lbl-sso-title',
        'lbl-sso-subtitle',
        'lbl-sso-sec',
        'opt-sso-33',
        'opt-sso-39',
        'opt-sso-40',
        'lbl-sso-wage',
        'lbl-sso-years',
        'lbl-sso-res-pension',
        'lbl-sso-res-lump',
      ];

      for (const key of ssoKeys) {
        assert.ok(content.includes(`'${key}':`), `tax-calculator.js EN must define translation for ${key}`);
      }
    });

    it('verifies rebalance.html contains Thai Gold Bar & Jewelry DCA calculator panel and controls', () => {
      const rebalHtml = fs.readFileSync(path.join(ROOT_DIR, 'rebalance.html'), 'utf8');
      assert.ok(rebalHtml.includes('id="panelThaiGold"'), 'rebalance.html must contain #panelThaiGold');
      assert.ok(rebalHtml.includes('id="btnToggleThaiGold"'), 'rebalance.html must contain #btnToggleThaiGold');
      assert.ok(rebalHtml.includes('id="goldPanelBody"'), 'rebalance.html must contain #goldPanelBody');
      assert.ok(rebalHtml.includes('id="selGoldType"'), 'rebalance.html must contain #selGoldType');
      assert.ok(rebalHtml.includes('id="selGoldUnit"'), 'rebalance.html must contain #selGoldUnit');
      assert.ok(rebalHtml.includes('id="inpGoldWeight"'), 'rebalance.html must contain #inpGoldWeight');
      assert.ok(rebalHtml.includes('id="inpGoldCost"'), 'rebalance.html must contain #inpGoldCost');
      assert.ok(rebalHtml.includes('id="inpGoldFee"'), 'rebalance.html must contain #inpGoldFee');
      assert.ok(rebalHtml.includes('id="inpGoldMarketPrice"'), 'rebalance.html must contain #inpGoldMarketPrice');
      assert.ok(rebalHtml.includes('id="goldLotsContainer"'), 'rebalance.html must contain #goldLotsContainer');
      assert.ok(rebalHtml.includes('id="boxGoldTaxExemption"'), 'rebalance.html must contain #boxGoldTaxExemption');

      // Verify layout order: bucketsContainer -> howto -> targetDateGlidepath -> thaiGold -> foreignTaxAdvisor (sub-tools at bottom)
      const idxBuckets = rebalHtml.indexOf('id="bucketsContainer"');
      const idxHowto = rebalHtml.indexOf('id="howto"');
      const idxGlidepath = rebalHtml.indexOf('id="panelTargetDateGlidepath"');
      const idxGold = rebalHtml.indexOf('id="panelThaiGold"');
      const idxForeign = rebalHtml.indexOf('id="panelForeignTaxAdvisor"');
      assert.ok(idxBuckets !== -1 && idxGlidepath !== -1 && idxGold !== -1 && idxForeign !== -1 && idxHowto !== -1);
      assert.ok(idxBuckets < idxHowto, '#bucketsContainer must precede #howto');
      assert.ok(idxHowto < idxGlidepath, '#howto must precede bottom auxiliary panels');
      assert.ok(idxGlidepath < idxGold, '#panelTargetDateGlidepath must precede #panelThaiGold');
      assert.ok(idxGold < idxForeign, '#panelThaiGold must precede #panelForeignTaxAdvisor');

      const rebalJs = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      assert.ok(rebalJs.includes('initGoldCalculator'), 'js/rebalance.js must define initGoldCalculator');
      assert.ok(rebalJs.includes('toggleThaiGoldCalculator'), 'js/rebalance.js must define toggleThaiGoldCalculator');
      assert.ok(rebalJs.includes('updateGoldCalculator'), 'js/rebalance.js must define updateGoldCalculator');
      assert.ok(rebalJs.includes('exportGoldToPortfolio'), 'js/rebalance.js must define exportGoldToPortfolio');
      assert.ok(rebalJs.includes('lblGoldTitle'), 'js/rebalance.js EN must contain lblGoldTitle');
    });

    it('verifies rebalance.html contains Foreign Investment & Crypto Repatriation Tax Advisor panel and controls', () => {
      const rebalHtml = fs.readFileSync(path.join(ROOT_DIR, 'rebalance.html'), 'utf8');
      assert.ok(
        rebalHtml.includes('id="panelForeignTaxAdvisor"'),
        'rebalance.html must contain #panelForeignTaxAdvisor',
      );
      assert.ok(rebalHtml.includes('id="inpRemittanceAmount"'), 'rebalance.html must contain #inpRemittanceAmount');
      assert.ok(rebalHtml.includes('id="inpPre2024Amount"'), 'rebalance.html must contain #inpPre2024Amount');
      assert.ok(rebalHtml.includes('id="inpPrincipalAmount"'), 'rebalance.html must contain #inpPrincipalAmount');
      assert.ok(rebalHtml.includes('id="inpDaysInThailand"'), 'rebalance.html must contain #inpDaysInThailand');
      assert.ok(rebalHtml.includes('id="inpForeignTaxPaid"'), 'rebalance.html must contain #inpForeignTaxPaid');
      assert.ok(rebalHtml.includes('id="inpOtherDomesticNet"'), 'rebalance.html must contain #inpOtherDomesticNet');
      assert.ok(rebalHtml.includes('id="valForeignNetTax"'), 'rebalance.html must contain #valForeignNetTax');
      assert.ok(rebalHtml.includes('id="boxForeignTaxAdvice"'), 'rebalance.html must contain #boxForeignTaxAdvice');

      const rebalJs = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      assert.ok(rebalJs.includes('initForeignTaxAdvisor'), 'js/rebalance.js must define initForeignTaxAdvisor');
      assert.ok(rebalJs.includes('toggleForeignTaxAdvisor'), 'js/rebalance.js must define toggleForeignTaxAdvisor');
      assert.ok(rebalJs.includes('updateForeignTaxUI'), 'js/rebalance.js must define updateForeignTaxUI');
      assert.ok(rebalJs.includes('lblForeignTaxTitle'), 'js/rebalance.js EN must contain lblForeignTaxTitle');
    });

    it('verifies tax-calculator.html contains Thai Inheritance & Annual Gift Tax card and controls', () => {
      const taxHtml = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator.html'), 'utf8');
      assert.ok(
        taxHtml.includes('id="inheritance-tax-card"'),
        'tax-calculator.html must contain #inheritance-tax-card',
      );
      assert.ok(taxHtml.includes('id="txtEstateValue"'), 'tax-calculator.html must contain #txtEstateValue');
      assert.ok(taxHtml.includes('id="selHeirRel"'), 'tax-calculator.html must contain #selHeirRel');
      assert.ok(taxHtml.includes('id="txtHeirCount"'), 'tax-calculator.html must contain #txtHeirCount');
      assert.ok(taxHtml.includes('id="selGiftType"'), 'tax-calculator.html must contain #selGiftType');
      assert.ok(taxHtml.includes('id="txtAnnualGiftValue"'), 'tax-calculator.html must contain #txtAnnualGiftValue');
      assert.ok(taxHtml.includes('id="txtStrategyYears"'), 'tax-calculator.html must contain #txtStrategyYears');
      assert.ok(
        taxHtml.includes('id="boxInheritanceGuidance"'),
        'tax-calculator.html must contain #boxInheritanceGuidance',
      );

      const taxJs = fs.readFileSync(path.join(ROOT_DIR, 'js/tax-calculator.js'), 'utf8');
      assert.ok(
        taxJs.includes('toggleInheritanceTaxCard'),
        'js/tax-calculator.js must define toggleInheritanceTaxCard',
      );
      assert.ok(taxJs.includes('updateInheritanceTaxUI'), 'js/tax-calculator.js must define updateInheritanceTaxUI');
      assert.ok(taxJs.includes('initInheritanceTaxCard'), 'js/tax-calculator.js must define initInheritanceTaxCard');
      assert.ok(
        taxJs.includes('calculateThaiInheritanceAndGiftTax'),
        'js/tax-calculator.js must call calculateThaiInheritanceAndGiftTax',
      );
      assert.ok(taxJs.includes('lbl-inher-title'), 'js/tax-calculator.js EN must define lbl-inher-title');
    });

    it('verifies rebalance.html contains Target Date Retirement Glidepath Calculator panel and controls', () => {
      const rebalHtml = fs.readFileSync(path.join(ROOT_DIR, 'rebalance.html'), 'utf8');
      assert.ok(
        rebalHtml.includes('id="panelTargetDateGlidepath"'),
        'rebalance.html must contain #panelTargetDateGlidepath',
      );
      assert.ok(rebalHtml.includes('id="inpGlideCurrentAge"'), 'rebalance.html must contain #inpGlideCurrentAge');
      assert.ok(rebalHtml.includes('id="inpGlideRetireAge"'), 'rebalance.html must contain #inpGlideRetireAge');
      assert.ok(rebalHtml.includes('id="selGlideRisk"'), 'rebalance.html must contain #selGlideRisk');
      assert.ok(rebalHtml.includes('id="glidepathBar"'), 'rebalance.html must contain #glidepathBar');
      assert.ok(rebalHtml.includes('id="valGlideHorizonYears"'), 'rebalance.html must contain #valGlideHorizonYears');
      assert.ok(rebalHtml.includes('id="valGlideCore"'), 'rebalance.html must contain #valGlideCore');
      assert.ok(rebalHtml.includes('id="valGlideBallast"'), 'rebalance.html must contain #valGlideBallast');
      assert.ok(rebalHtml.includes('id="valGlideSat"'), 'rebalance.html must contain #valGlideSat');
      assert.ok(rebalHtml.includes('id="boxGlidepathAdvice"'), 'rebalance.html must contain #boxGlidepathAdvice');

      const rebalJs = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      assert.ok(rebalJs.includes('initTargetDateGlidepath'), 'js/rebalance.js must define initTargetDateGlidepath');
      assert.ok(rebalJs.includes('toggleTargetDateGlidepath'), 'js/rebalance.js must define toggleTargetDateGlidepath');
      assert.ok(rebalJs.includes('updateGlidepathUI'), 'js/rebalance.js must define updateGlidepathUI');
      assert.ok(
        rebalJs.includes('applyGlidepathSplitToPortfolio'),
        'js/rebalance.js must define applyGlidepathSplitToPortfolio',
      );
      assert.ok(rebalJs.includes('lblGlidepathTitle'), 'js/rebalance.js EN must define lblGlidepathTitle');
    });

    it('verifies rebalance.html places auxiliary sub-tools below #howto and defaults them to collapsed', () => {
      const rebalHtml = fs.readFileSync(path.join(ROOT_DIR, 'rebalance.html'), 'utf8');
      const idxBuckets = rebalHtml.indexOf('id="panelBuckets"');
      const idxHowto = rebalHtml.indexOf('id="howto"');
      const idxGlidepath = rebalHtml.indexOf('id="panelTargetDateGlidepath"');
      const idxGold = rebalHtml.indexOf('id="panelThaiGold"');
      const idxForeignTax = rebalHtml.indexOf('id="panelForeignTaxAdvisor"');

      assert.ok(idxBuckets !== -1 && idxHowto !== -1, 'Buckets and howto must exist');
      assert.ok(idxGlidepath !== -1 && idxGold !== -1 && idxForeignTax !== -1, 'All 3 auxiliary sub-tools must exist');
      assert.ok(idxBuckets < idxHowto, '#panelBuckets must appear before #howto');
      assert.ok(idxHowto < idxGlidepath, '#howto must appear before #panelTargetDateGlidepath');
      assert.ok(idxGlidepath < idxGold, '#panelTargetDateGlidepath must appear before #panelThaiGold');
      assert.ok(idxGold < idxForeignTax, '#panelThaiGold must appear before #panelForeignTaxAdvisor');

      const rebalJs = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      assert.ok(
        rebalJs.includes("defaultCollapsed: ['panelTargetDateGlidepath', 'panelThaiGold', 'panelForeignTaxAdvisor']"),
        'rebalance.js must configure all 3 auxiliary sub-tools as defaultCollapsed',
      );

      // Verify all 3 auxiliary cards possess box container classes and styles
      assert.ok(
        rebalHtml.includes('class="panel card reorder-card" id="panelTargetDateGlidepath"'),
        '#panelTargetDateGlidepath must declare panel card reorder-card box container',
      );
      assert.ok(
        rebalHtml.includes('class="panel card reorder-card" id="panelThaiGold"'),
        '#panelThaiGold must declare panel card reorder-card box container',
      );
      assert.ok(
        rebalHtml.includes('class="panel card reorder-card" id="panelForeignTaxAdvisor"'),
        '#panelForeignTaxAdvisor must declare panel card reorder-card box container',
      );
      assert.ok(
        rebalHtml.includes('.panel, .card:not(#panelBuckets)'),
        'rebalance.html must define standard box container styling for .panel and .card',
      );
    });

    it('verifies Phase 95 Cashflow Visualization Engine modularization and clean delegation', () => {
      const vizPath = path.join(ROOT_DIR, 'js/engines/cashflow-viz.js');
      assert.ok(fs.existsSync(vizPath), 'js/engines/cashflow-viz.js must exist');
      const vizContent = fs.readFileSync(vizPath, 'utf8');
      assert.ok(
        vizContent.includes('MoneyApp.CashflowViz = CashflowViz'),
        'cashflow-viz.js must export MoneyApp.CashflowViz',
      );
      assert.ok(!vizContent.includes('eval('), 'cashflow-viz.js must never invoke eval()');
      assert.ok(!vizContent.includes('document.write'), 'cashflow-viz.js must never invoke document.write()');

      // Verify all 8 core HTML files register cashflow-viz.js
      const htmlFiles = [
        'dashboard.html',
        'debt-calculator.html',
        'index.html',
        'months-slips.html',
        'rebalance.html',
        'remaining-money.html',
        'tax-calculator-base.html',
        'tax-calculator.html',
      ];
      for (const file of htmlFiles) {
        const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
        assert.ok(
          content.includes('src="js/engines/cashflow-viz.js"'),
          `${file} must include js/engines/cashflow-viz.js`,
        );
      }

      // Verify service worker registers cashflow-viz.js
      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(swContent.includes("'./js/engines/cashflow-viz.js'"), 'sw.js must cache js/engines/cashflow-viz.js');

      // Verify js/remaining-money.js delegates visualization calls
      const rmContent = fs.readFileSync(path.join(ROOT_DIR, 'js/remaining-money.js'), 'utf8');
      assert.ok(
        rmContent.includes('CashflowViz') && rmContent.includes('renderCashflowWaterfall'),
        'remaining-money.js must delegate renderCashflowWaterfall to MoneyApp.CashflowViz',
      );
      assert.ok(
        rmContent.includes('CashflowViz') && rmContent.includes('renderCashflowSankey'),
        'remaining-money.js must delegate renderCashflowSankey to MoneyApp.CashflowViz',
      );
      assert.ok(
        rmContent.includes('MoneyApp?.CashflowViz?.calculateBudgetRule503020'),
        'remaining-money.js must delegate calculateBudgetRule503020 to MoneyApp.CashflowViz',
      );
    });

    it('verifies Phase 96 Budget Data Importer & Parser Engine modularization and clean delegation', () => {
      const impPath = path.join(ROOT_DIR, 'js/engines/budget-import.js');
      assert.ok(fs.existsSync(impPath), 'js/engines/budget-import.js must exist');
      const impContent = fs.readFileSync(impPath, 'utf8');
      assert.ok(
        impContent.includes('MoneyApp.BudgetImport = BudgetImport'),
        'budget-import.js must export MoneyApp.BudgetImport',
      );
      assert.ok(!impContent.includes('eval('), 'budget-import.js must never invoke eval()');
      assert.ok(!impContent.includes('document.write'), 'budget-import.js must never invoke document.write()');

      // Verify all 8 core HTML files register budget-import.js
      const htmlFiles = [
        'dashboard.html',
        'debt-calculator.html',
        'index.html',
        'months-slips.html',
        'rebalance.html',
        'remaining-money.html',
        'tax-calculator-base.html',
        'tax-calculator.html',
      ];
      for (const file of htmlFiles) {
        const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
        assert.ok(
          content.includes('src="js/engines/budget-import.js"'),
          `${file} must include js/engines/budget-import.js`,
        );
      }

      // Verify service worker registers budget-import.js
      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(swContent.includes("'./js/engines/budget-import.js'"), 'sw.js must cache js/engines/budget-import.js');

      // Verify js/remaining-money.js delegates CSV/JSON parsing calls
      const rmContent = fs.readFileSync(path.join(ROOT_DIR, 'js/remaining-money.js'), 'utf8');
      assert.ok(
        rmContent.includes('BudgetImport?.parseCSVRows'),
        'remaining-money.js must delegate parseCSVRows to MoneyApp.BudgetImport',
      );
      assert.ok(
        rmContent.includes('BudgetImport?.detectColumns'),
        'remaining-money.js must delegate detectColumns to MoneyApp.BudgetImport',
      );
      assert.ok(
        rmContent.includes('importer?.parseImportJSON'),
        'remaining-money.js must delegate parseImportJSON to MoneyApp.BudgetImport',
      );
      assert.ok(
        rmContent.includes('importer?.parseImportCSV'),
        'remaining-money.js must delegate parseImportCSV to MoneyApp.BudgetImport',
      );
    });

    it('verifies Phase 97 Financial Health & Advisor Engine modularization and clean delegation', () => {
      const fhPath = path.join(ROOT_DIR, 'js/engines/financial-health.js');
      assert.ok(fs.existsSync(fhPath), 'js/engines/financial-health.js must exist');
      const fhContent = fs.readFileSync(fhPath, 'utf8');
      assert.ok(
        fhContent.includes('MoneyApp.FinancialHealth = FinancialHealth'),
        'financial-health.js must export MoneyApp.FinancialHealth',
      );
      assert.ok(!fhContent.includes('eval('), 'financial-health.js must never invoke eval()');
      assert.ok(!fhContent.includes('document.write'), 'financial-health.js must never invoke document.write()');

      // Verify all 8 core HTML files register financial-health.js
      const htmlFiles = [
        'dashboard.html',
        'debt-calculator.html',
        'index.html',
        'months-slips.html',
        'rebalance.html',
        'remaining-money.html',
        'tax-calculator-base.html',
        'tax-calculator.html',
      ];
      for (const file of htmlFiles) {
        const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
        assert.ok(
          content.includes('src="js/engines/financial-health.js"'),
          `${file} must include js/engines/financial-health.js`,
        );
      }

      // Verify service worker registers financial-health.js
      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(
        swContent.includes("'./js/engines/financial-health.js'"),
        'sw.js must cache js/engines/financial-health.js',
      );

      // Verify js/dashboard.js delegates health scoring, next moves, radar, and net worth composition
      const dashContent = fs.readFileSync(path.join(ROOT_DIR, 'js/dashboard.js'), 'utf8');
      assert.ok(
        dashContent.includes('FinancialHealth?.calculateFinancialHealthScore'),
        'dashboard.js must delegate calculateFinancialHealthScore to MoneyApp.FinancialHealth',
      );
      assert.ok(
        dashContent.includes('FinancialHealth?.generateNextBestMoves'),
        'dashboard.js must delegate generateNextBestMoves to MoneyApp.FinancialHealth',
      );
      assert.ok(
        dashContent.includes('FinancialHealth?.renderRadarChartSVG'),
        'dashboard.js must delegate renderRadarChartSVG to MoneyApp.FinancialHealth',
      );
      assert.ok(
        dashContent.includes('FinancialHealth?.calculateNetWorthComposition'),
        'dashboard.js must delegate calculateNetWorthComposition to MoneyApp.FinancialHealth',
      );
    });

    it('verifies Phase 98 Portfolio Auxiliary Sub-tools Engine modularization and clean delegation', () => {
      const subPath = path.join(ROOT_DIR, 'js/engines/rebalance-subtools.js');
      assert.ok(fs.existsSync(subPath), 'js/engines/rebalance-subtools.js must exist');
      const subContent = fs.readFileSync(subPath, 'utf8');
      assert.ok(
        subContent.includes('MoneyApp.RebalanceSubtools = RebalanceSubtools'),
        'rebalance-subtools.js must export MoneyApp.RebalanceSubtools',
      );
      assert.ok(!subContent.includes('eval('), 'rebalance-subtools.js must never invoke eval()');
      assert.ok(!subContent.includes('document.write'), 'rebalance-subtools.js must never invoke document.write()');

      // Verify all 8 core HTML files register rebalance-subtools.js
      const htmlFiles = [
        'dashboard.html',
        'debt-calculator.html',
        'index.html',
        'months-slips.html',
        'rebalance.html',
        'remaining-money.html',
        'tax-calculator-base.html',
        'tax-calculator.html',
      ];
      for (const file of htmlFiles) {
        const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
        assert.ok(
          content.includes('src="js/engines/rebalance-subtools.js"'),
          `${file} must include js/engines/rebalance-subtools.js`,
        );
      }

      // Verify service worker registers rebalance-subtools.js
      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(
        swContent.includes("'./js/engines/rebalance-subtools.js'"),
        'sw.js must cache js/engines/rebalance-subtools.js',
      );

      // Verify js/rebalance.js delegates auxiliary sub-tools cleanly
      const rebalContent = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      assert.ok(rebalContent.includes('RebalanceSubtools'), 'rebalance.js must reference MoneyApp.RebalanceSubtools');
      assert.ok(rebalContent.includes('toggleThaiGoldCalculator'), 'rebalance.js must expose toggleThaiGoldCalculator');
      assert.ok(rebalContent.includes('toggleForeignTaxAdvisor'), 'rebalance.js must expose toggleForeignTaxAdvisor');
      assert.ok(
        rebalContent.includes('toggleTargetDateGlidepath'),
        'rebalance.js must expose toggleTargetDateGlidepath',
      );
    });

    it('verifies Phase 99 E-Filing Worksheet & Tax Dossier Engine modularization and clean delegation', () => {
      const wsPath = path.join(ROOT_DIR, 'js/engines/tax-worksheet.js');
      assert.ok(fs.existsSync(wsPath), 'js/engines/tax-worksheet.js must exist');
      const wsContent = fs.readFileSync(wsPath, 'utf8');
      assert.ok(
        wsContent.includes('MoneyApp.TaxWorksheet = TaxWorksheet'),
        'tax-worksheet.js must export MoneyApp.TaxWorksheet',
      );
      assert.ok(!wsContent.includes('eval('), 'tax-worksheet.js must never invoke eval()');
      assert.ok(!wsContent.includes('document.write'), 'tax-worksheet.js must never invoke document.write()');

      // Verify all 8 core HTML files register tax-worksheet.js
      const htmlFiles = [
        'dashboard.html',
        'debt-calculator.html',
        'index.html',
        'months-slips.html',
        'rebalance.html',
        'remaining-money.html',
        'tax-calculator-base.html',
        'tax-calculator.html',
      ];
      for (const file of htmlFiles) {
        const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
        assert.ok(
          content.includes('src="js/engines/tax-worksheet.js"'),
          `${file} must include js/engines/tax-worksheet.js`,
        );
      }

      // Verify service worker registers tax-worksheet.js
      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(swContent.includes("'./js/engines/tax-worksheet.js'"), 'sw.js must cache js/engines/tax-worksheet.js');

      // Verify js/tax-calculator-base.js delegates worksheet and dossier cleanly
      const taxContent = fs.readFileSync(path.join(ROOT_DIR, 'js/tax-calculator-base.js'), 'utf8');
      assert.ok(taxContent.includes('TaxWorksheet'), 'tax-calculator-base.js must reference MoneyApp.TaxWorksheet');
      assert.ok(
        taxContent.includes('window.copyEFilingField = copyEFilingField;'),
        'tax-calculator-base.js must expose window.copyEFilingField',
      );
      assert.ok(
        taxContent.includes('window.copyAllEFilingSummary = copyAllEFilingSummary;'),
        'tax-calculator-base.js must expose window.copyAllEFilingSummary',
      );
      assert.ok(
        taxContent.includes('window.updateDividendTaxCreditUI = updateDividendTaxCreditUI;'),
        'tax-calculator-base.js must expose window.updateDividendTaxCreditUI',
      );
    });

    it('verifies Phase 100 Centralized Internationalization Core Engine & Declarative data-i18n', () => {
      const i18nPath = path.join(ROOT_DIR, 'js/engines/i18n-core.js');
      assert.ok(fs.existsSync(i18nPath), 'js/engines/i18n-core.js must exist');
      const i18nContent = fs.readFileSync(i18nPath, 'utf8');
      assert.ok(i18nContent.includes('MoneyApp.I18n = I18n'), 'i18n-core.js must export MoneyApp.I18n');
      assert.ok(!i18nContent.includes('eval('), 'i18n-core.js must never invoke eval()');
      assert.ok(!i18nContent.includes('document.write'), 'i18n-core.js must never invoke document.write()');

      // Verify all 8 core HTML files register i18n-core.js
      const htmlFiles = [
        'dashboard.html',
        'debt-calculator.html',
        'index.html',
        'months-slips.html',
        'rebalance.html',
        'remaining-money.html',
        'tax-calculator-base.html',
        'tax-calculator.html',
      ];
      for (const file of htmlFiles) {
        const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
        assert.ok(content.includes('src="js/engines/i18n-core.js"'), `${file} must include js/engines/i18n-core.js`);
      }

      // Verify service worker registers i18n-core.js
      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(swContent.includes("'./js/engines/i18n-core.js'"), 'sw.js must cache js/engines/i18n-core.js');

      // Verify js/app-shell.js and js/shared.js integrate I18n
      const shellContent = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');
      assert.ok(shellContent.includes('MoneyApp.I18n.register'), 'app-shell.js must register with MoneyApp.I18n');
      assert.ok(shellContent.includes('applyLocalization'), 'app-shell.js must invoke applyLocalization');

      const sharedContent = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(sharedContent.includes('MoneyApp?.I18n'), 'shared.js must coordinate with MoneyApp.I18n');
    });

    it('verifies Phase 101 Centralized Domain Dictionaries (js/i18n/th.js & js/i18n/en.js) and Cache Consistency', () => {
      const thPath = path.join(ROOT_DIR, 'js/i18n/th.js');
      const enPath = path.join(ROOT_DIR, 'js/i18n/en.js');
      assert.ok(fs.existsSync(thPath), 'js/i18n/th.js must exist');
      assert.ok(fs.existsSync(enPath), 'js/i18n/en.js must exist');

      const thContent = fs.readFileSync(thPath, 'utf8');
      const enContent = fs.readFileSync(enPath, 'utf8');

      assert.ok(thContent.includes('MoneyApp.i18n.th = th'), 'th.js must export MoneyApp.i18n.th');
      assert.ok(enContent.includes('MoneyApp.i18n.en = en'), 'en.js must export MoneyApp.i18n.en');

      assert.ok(!thContent.includes('eval('), 'th.js must never invoke eval()');
      assert.ok(!enContent.includes('eval('), 'en.js must never invoke eval()');
      assert.ok(!thContent.includes('document.write'), 'th.js must never invoke document.write()');
      assert.ok(!enContent.includes('document.write'), 'en.js must never invoke document.write()');

      // Verify all 8 core HTML files register both dictionaries
      const htmlFiles = [
        'dashboard.html',
        'debt-calculator.html',
        'index.html',
        'months-slips.html',
        'rebalance.html',
        'remaining-money.html',
        'tax-calculator-base.html',
        'tax-calculator.html',
      ];
      for (const file of htmlFiles) {
        const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');
        assert.ok(content.includes('src="js/i18n/th.js"'), `${file} must include js/i18n/th.js`);
        assert.ok(content.includes('src="js/i18n/en.js"'), `${file} must include js/i18n/en.js`);
      }

      // Verify service worker registers both dictionaries
      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(swContent.includes("'./js/i18n/th.js'"), 'sw.js must cache js/i18n/th.js');
      assert.ok(swContent.includes("'./js/i18n/en.js'"), 'sw.js must cache js/i18n/en.js');
    });

    it('verifies Phase 102 Declarative data-i18n Localization Migration for Dashboard and Debt Tools', () => {
      const dashHtml = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      const debtHtml = fs.readFileSync(path.join(ROOT_DIR, 'debt-calculator.html'), 'utf8');
      const dashJs = fs.readFileSync(path.join(ROOT_DIR, 'js/dashboard.js'), 'utf8');
      const debtJs = fs.readFileSync(path.join(ROOT_DIR, 'js/debt-calculator.js'), 'utf8');

      assert.ok(dashHtml.includes('data-i18n="eyebrow"'), 'dashboard.html must contain data-i18n="eyebrow"');
      assert.ok(dashHtml.includes('data-i18n="title"'), 'dashboard.html must contain data-i18n="title"');
      assert.ok(dashHtml.includes('data-i18n="subtitle"'), 'dashboard.html must contain data-i18n="subtitle"');
      assert.ok(dashHtml.includes('data-i18n="kpiNetworth"'), 'dashboard.html must contain data-i18n="kpiNetworth"');

      assert.ok(debtHtml.includes('data-i18n="title"'), 'debt-calculator.html must contain data-i18n="title"');
      assert.ok(debtHtml.includes('data-i18n="subtitle"'), 'debt-calculator.html must contain data-i18n="subtitle"');
      assert.ok(
        debtHtml.includes('data-i18n="kpiTotalDebt"'),
        'debt-calculator.html must contain data-i18n="kpiTotalDebt"',
      );
      assert.ok(
        debtHtml.includes('data-i18n="strategyTitle"'),
        'debt-calculator.html must contain data-i18n="strategyTitle"',
      );

      assert.ok(dashJs.includes('window.MoneyApp.I18n.register'), 'dashboard.js must register with MoneyApp.I18n');
      assert.ok(
        dashJs.includes('window.MoneyApp.I18n.applyLocalization'),
        'dashboard.js must call MoneyApp.I18n.applyLocalization',
      );
      assert.ok(
        debtJs.includes('window.MoneyApp.I18n.register'),
        'debt-calculator.js must register with MoneyApp.I18n',
      );
      assert.ok(
        debtJs.includes('window.MoneyApp.I18n.applyLocalization'),
        'debt-calculator.js must call MoneyApp.I18n.applyLocalization',
      );
    });

    it('verifies Phase 103 Declarative data-i18n Localization Migration for Remaining Money and Rebalance Tools', () => {
      const remHtml = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      const rebHtml = fs.readFileSync(path.join(ROOT_DIR, 'rebalance.html'), 'utf8');
      const remJs = fs.readFileSync(path.join(ROOT_DIR, 'js/remaining-money.js'), 'utf8');
      const rebJs = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');

      assert.ok(remHtml.includes('data-i18n="eyebrow"'), 'remaining-money.html must contain data-i18n="eyebrow"');
      assert.ok(remHtml.includes('data-i18n="pageTitle"'), 'remaining-money.html must contain data-i18n="pageTitle"');
      assert.ok(
        remHtml.includes('data-i18n="scIncomeLabel"'),
        'remaining-money.html must contain data-i18n="scIncomeLabel"',
      );
      assert.ok(
        remHtml.includes('data-i18n="shockTesterTitle"'),
        'remaining-money.html must contain data-i18n="shockTesterTitle"',
      );

      assert.ok(rebHtml.includes('data-i18n="eyebrow"'), 'rebalance.html must contain data-i18n="eyebrow"');
      assert.ok(rebHtml.includes('data-i18n="pageTitle"'), 'rebalance.html must contain data-i18n="pageTitle"');
      assert.ok(
        rebHtml.includes('data-i18n="lblBudgetHeading"'),
        'rebalance.html must contain data-i18n="lblBudgetHeading"',
      );
      assert.ok(
        rebHtml.includes('data-i18n="lblGlidepathTitle"'),
        'rebalance.html must contain data-i18n="lblGlidepathTitle"',
      );
      assert.ok(rebHtml.includes('data-i18n="lblGoldTitle"'), 'rebalance.html must contain data-i18n="lblGoldTitle"');
      assert.ok(
        rebHtml.includes('data-i18n="lblForeignTaxTitle"'),
        'rebalance.html must contain data-i18n="lblForeignTaxTitle"',
      );

      assert.ok(remJs.includes('window.MoneyApp.I18n.register'), 'remaining-money.js must register with MoneyApp.I18n');
      assert.ok(
        remJs.includes('window.MoneyApp.I18n.applyLocalization'),
        'remaining-money.js must call MoneyApp.I18n.applyLocalization',
      );
      assert.ok(rebJs.includes('window.MoneyApp.I18n.register'), 'rebalance.js must register with MoneyApp.I18n');
      assert.ok(
        rebJs.includes('window.MoneyApp.I18n.applyLocalization'),
        'rebalance.js must call MoneyApp.I18n.applyLocalization',
      );
    });

    it('verifies Phase 104 Declarative data-i18n Localization Migration for Tax and Payslip Tools', () => {
      const taxHtml = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator.html'), 'utf8');
      const taxBaseHtml = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      const slipsHtml = fs.readFileSync(path.join(ROOT_DIR, 'months-slips.html'), 'utf8');

      const taxJs = fs.readFileSync(path.join(ROOT_DIR, 'js/tax-calculator.js'), 'utf8');
      const taxBaseJs = fs.readFileSync(path.join(ROOT_DIR, 'js/tax-calculator-base.js'), 'utf8');
      const slipsJs = fs.readFileSync(path.join(ROOT_DIR, 'js/months-slips.js'), 'utf8');

      assert.ok(taxHtml.includes('data-i18n="lbl-h1"'), 'tax-calculator.html must contain data-i18n="lbl-h1"');
      assert.ok(
        taxHtml.includes('data-i18n="lbl-severance"'),
        'tax-calculator.html must contain data-i18n="lbl-severance"',
      );
      assert.ok(
        taxHtml.includes('data-i18n="lbl-pvdSection"'),
        'tax-calculator.html must contain data-i18n="lbl-pvdSection"',
      );
      assert.ok(
        taxHtml.includes('data-i18n="lbl-sso-title"'),
        'tax-calculator.html must contain data-i18n="lbl-sso-title"',
      );

      assert.ok(
        taxBaseHtml.includes('data-i18n="lbl-title"'),
        'tax-calculator-base.html must contain data-i18n="lbl-title"',
      );
      assert.ok(
        taxBaseHtml.includes('data-i18n="lbl-tab-monthly"'),
        'tax-calculator-base.html must contain data-i18n="lbl-tab-monthly"',
      );
      assert.ok(
        taxBaseHtml.includes('data-i18n="lbl-tab-yearly"'),
        'tax-calculator-base.html must contain data-i18n="lbl-tab-yearly"',
      );
      assert.ok(
        taxBaseHtml.includes('data-i18n="lbl-panel-deductions"'),
        'tax-calculator-base.html must contain data-i18n="lbl-panel-deductions"',
      );
      assert.ok(
        taxBaseHtml.includes('data-i18n="txt-withheld-label"'),
        'tax-calculator-base.html must contain data-i18n="txt-withheld-label"',
      );
      assert.ok(
        taxBaseHtml.includes('data-i18n="lbl-panel-efiling"'),
        'tax-calculator-base.html must contain data-i18n="lbl-panel-efiling"',
      );
      assert.ok(
        taxBaseHtml.includes('data-i18n="lbl-panel-calendar"'),
        'tax-calculator-base.html must contain data-i18n="lbl-panel-calendar"',
      );

      assert.ok(slipsHtml.includes('data-i18n="lbl-setup"'), 'months-slips.html must contain data-i18n="lbl-setup"');
      assert.ok(
        slipsHtml.includes('data-i18n="lbl-earnings"'),
        'months-slips.html must contain data-i18n="lbl-earnings"',
      );
      assert.ok(
        slipsHtml.includes('data-i18n="lbl-deductions"'),
        'months-slips.html must contain data-i18n="lbl-deductions"',
      );
      assert.ok(slipsHtml.includes('data-i18n="lbl-annual"'), 'months-slips.html must contain data-i18n="lbl-annual"');
      assert.ok(
        slipsHtml.includes('data-i18n="lblCompareTitle"'),
        'months-slips.html must contain data-i18n="lblCompareTitle"',
      );
      assert.ok(
        slipsHtml.includes('data-i18n="lbl-reconcile-title"'),
        'months-slips.html must contain data-i18n="lbl-reconcile-title"',
      );

      assert.ok(taxJs.includes('window.MoneyApp.I18n.register'), 'tax-calculator.js must register with MoneyApp.I18n');
      assert.ok(
        taxJs.includes('window.MoneyApp.I18n.applyLocalization'),
        'tax-calculator.js must call MoneyApp.I18n.applyLocalization',
      );

      assert.ok(
        taxBaseJs.includes('MoneyApp.I18n.register'),
        'tax-calculator-base.js must register with MoneyApp.I18n',
      );
      assert.ok(
        taxBaseJs.includes('MoneyApp.I18n.applyLocalization'),
        'tax-calculator-base.js must call MoneyApp.I18n.applyLocalization',
      );

      assert.ok(slipsJs.includes('MoneyApp.I18n.register'), 'months-slips.js must register with MoneyApp.I18n');
      assert.ok(
        slipsJs.includes('MoneyApp.I18n.applyLocalization'),
        'months-slips.js must call MoneyApp.I18n.applyLocalization',
      );
    });

    it('verifies Phase 105 Universal Declarative i18n & Exhaustive Coverage Suite', () => {
      const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      const rebJs = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      const taxBaseJs = fs.readFileSync(path.join(ROOT_DIR, 'js/tax-calculator-base.js'), 'utf8');
      const coverageTestPath = path.join(ROOT_DIR, 'tests/i18n-coverage.test.mjs');

      assert.ok(fs.existsSync(coverageTestPath), 'tests/i18n-coverage.test.mjs must exist');
      assert.ok(fs.statSync(coverageTestPath).size > 1000, 'tests/i18n-coverage.test.mjs must not be empty');

      // Verify index.html declarative data-i18n modal coverage
      assert.ok(indexHtml.includes('data-i18n="modalTitle"'), 'index.html must contain data-i18n="modalTitle"');
      assert.ok(
        indexHtml.includes('data-i18n="modalPrivacyTitle"'),
        'index.html must contain data-i18n="modalPrivacyTitle"',
      );
      assert.ok(indexHtml.includes('data-i18n="gdriveTitle"'), 'index.html must contain data-i18n="gdriveTitle"');
      assert.ok(indexHtml.includes('data-i18n="exportTitle"'), 'index.html must contain data-i18n="exportTitle"');
      assert.ok(indexHtml.includes('data-i18n="importTitle"'), 'index.html must contain data-i18n="importTitle"');
      assert.ok(indexHtml.includes('data-i18n="qrSyncTitle"'), 'index.html must contain data-i18n="qrSyncTitle"');
      assert.ok(indexHtml.includes('data-i18n="appLockTitle"'), 'index.html must contain data-i18n="appLockTitle"');
      assert.ok(
        indexHtml.includes('data-i18n="storageHealthTitle"'),
        'index.html must contain data-i18n="storageHealthTitle"',
      );
      assert.ok(indexHtml.includes('data-i18n="resetTitle"'), 'index.html must contain data-i18n="resetTitle"');
      assert.ok(
        indexHtml.includes('data-i18n="onboardingTitle"'),
        'index.html must contain data-i18n="onboardingTitle"',
      );
      assert.ok(
        indexHtml.includes('data-i18n="qrExportModalTitle"'),
        'index.html must contain data-i18n="qrExportModalTitle"',
      );
      assert.ok(
        indexHtml.includes('data-i18n="qrImportModalTitle"'),
        'index.html must contain data-i18n="qrImportModalTitle"',
      );
      assert.ok(
        indexHtml.includes('data-i18n="lockScreenTitle"'),
        'index.html must contain data-i18n="lockScreenTitle"',
      );
      assert.ok(indexHtml.includes('data-i18n="pwaUpdateText"'), 'index.html must contain data-i18n="pwaUpdateText"');

      // Verify audited keys in rebalance.js and tax-calculator-base.js
      assert.ok(rebJs.includes('lblCopyPortfolio:'), 'rebalance.js must define lblCopyPortfolio');
      assert.ok(rebJs.includes('resetBtn:'), 'rebalance.js must define resetBtn');
      assert.ok(taxBaseJs.includes('lblPool500kTitle:'), 'tax-calculator-base.js must define lblPool500kTitle');
    });

    it('verifies Phase 106 JSDoc Type Annotations & Type Contracts for Core Engines (Batch 1)', () => {
      const jsconfigPath = path.join(ROOT_DIR, 'jsconfig.json');
      assert.ok(fs.existsSync(jsconfigPath), 'jsconfig.json must exist in project root');
      const jsconfig = JSON.parse(fs.readFileSync(jsconfigPath, 'utf8'));
      assert.strictEqual(jsconfig.compilerOptions?.checkJs, true, 'jsconfig.json must enable checkJs');
      assert.ok(jsconfig.include?.includes('js/engines/**/*'), 'jsconfig.json include list must cover js/engines/**/*');

      const typeContractsTestPath = path.join(ROOT_DIR, 'tests/type-contracts.test.mjs');
      assert.ok(fs.existsSync(typeContractsTestPath), 'tests/type-contracts.test.mjs must exist');

      // Verify Batch 1 engines declare JSDoc typedef contracts
      const batch1Engines = [
        {
          file: 'js/engines/thai-pit.js',
          types: ['ThaiPITBracketStepDownResult', 'ThaiRetirementPoolResult', 'ThaiEFilingWorksheetResult'],
        },
        { file: 'js/engines/thai-tax-calendar.js', types: ['ThaiTaxDeadlinesResult', 'ThaiTaxDeadlineEvent'] },
        { file: 'js/engines/insurance.js', types: ['InsuranceAdequacyResult', 'TermLifePremiumResult'] },
        { file: 'js/engines/gold.js', types: ['ThaiGoldMetricsResult', 'ThaiGoldParams'] },
        { file: 'js/engines/foreign-tax.js', types: ['ForeignRepatriationResult', 'ForeignRepatriationParams'] },
        {
          file: 'js/engines/inheritance-tax.js',
          types: ['ThaiInheritanceAndGiftTaxResult', 'ThaiInheritanceAndGiftTaxParams'],
        },
        { file: 'js/engines/glidepath.js', types: ['TargetDateGlidepathResult', 'TargetDateGlidepathParams'] },
      ];

      for (const item of batch1Engines) {
        const filePath = path.join(ROOT_DIR, item.file);
        assert.ok(fs.existsSync(filePath), `${item.file} must exist`);
        const content = fs.readFileSync(filePath, 'utf8');
        for (const typeName of item.types) {
          assert.ok(
            content.includes(`@typedef {Object} ${typeName}`),
            `${item.file} must declare @typedef {Object} ${typeName}`,
          );
        }
      }
    });

    it('verifies Phase 107 JSDoc Type Annotations & Type Contracts for Core Engines (Batch 2)', () => {
      const typeContractsBatch2Path = path.join(ROOT_DIR, 'tests/type-contracts-batch2.test.mjs');
      assert.ok(fs.existsSync(typeContractsBatch2Path), 'tests/type-contracts-batch2.test.mjs must exist');

      // Verify Batch 2 engines declare JSDoc typedef contracts
      const batch2Engines = [
        {
          file: 'js/engines/retirement-buckets.js',
          types: ['RetirementThreeBucketsResult', 'RetirementThreeBucketsParams'],
        },
        {
          file: 'js/engines/property-tax.js',
          types: ['ThaiPropertyTaxResult', 'ThaiPropertyTaxParams'],
        },
        {
          file: 'js/engines/bank-parser.js',
          types: ['ThaiBankStatementParsedResult', 'ThaiBankSummary'],
        },
        {
          file: 'js/engines/refinance.js',
          types: [
            'DebtPayoffSimulationResult',
            'DebtVelocityComparisonResult',
            'TaxAccrualPlanResult',
            'DebtConsolidationResult',
          ],
        },
        {
          file: 'js/engines/stress-test.js',
          types: ['IncomeShockStressTestResult', 'ChildEducationFundResult'],
        },
        {
          file: 'js/engines/vault-crypto.js',
          types: ['VaultEnvelope'],
        },
        {
          file: 'js/engines/p2p-sync.js',
          types: ['QrSvgOptions', 'P2PPayloadChunk', 'P2PAssemblyResult'],
        },
        {
          file: 'js/engines/bridge.js',
          types: ['BridgeEnvelope', 'BridgePeekResult'],
        },
      ];

      for (const item of batch2Engines) {
        const filePath = path.join(ROOT_DIR, item.file);
        assert.ok(fs.existsSync(filePath), `${item.file} must exist`);
        const content = fs.readFileSync(filePath, 'utf8');
        for (const typeName of item.types) {
          assert.ok(
            content.includes(`@typedef {Object} ${typeName}`),
            `${item.file} must declare @typedef {Object} ${typeName}`,
          );
        }
      }
    });

    it('verifies Phase 108 JSDoc Type Annotations & Type Contracts for Core Engines (Batch 3 & Complete Engine Suite)', () => {
      const contractTestPath = path.join(ROOT_DIR, 'tests/type-contracts-batch3.test.mjs');
      assert.ok(fs.existsSync(contractTestPath), 'tests/type-contracts-batch3.test.mjs must exist');

      const batch3Engines = [
        {
          file: 'js/engines/budget-import.js',
          types: ['BudgetImportCandidate', 'BudgetDetectedColumns'],
        },
        {
          file: 'js/engines/cashflow-viz.js',
          types: ['BudgetRule503020Result', 'EmergencyRunwayResult', 'SankeyFlowResult'],
        },
        {
          file: 'js/engines/financial-health.js',
          types: [
            'FinancialHealthScoreResult',
            'NextBestMoveItem',
            'RadarCoordinatesResult',
            'NetWorthCompositionResult',
          ],
        },
        {
          file: 'js/engines/i18n-core.js',
          types: ['I18nDictionary', 'I18nInterpolationParams'],
        },
        {
          file: 'js/engines/rebalance-subtools.js',
          types: ['ThaiGoldSubtoolState', 'ForeignTaxSubtoolState', 'GlidepathSubtoolState'],
        },
        {
          file: 'js/engines/tax-worksheet.js',
          types: ['TaxWorksheetReportContext', 'TaxWorksheetDividendContext', 'TaxWorksheetEFilingContext'],
        },
      ];

      for (const item of batch3Engines) {
        const filePath = path.join(ROOT_DIR, item.file);
        assert.ok(fs.existsSync(filePath), `${item.file} must exist`);
        const content = fs.readFileSync(filePath, 'utf8');
        for (const typeName of item.types) {
          assert.ok(content.includes(typeName), `${item.file} must declare type ${typeName}`);
        }
      }

      // Verify all 21 modularized engines in js/engines/ exist
      const allEngines = [
        'thai-pit.js',
        'thai-tax-calendar.js',
        'insurance.js',
        'gold.js',
        'foreign-tax.js',
        'inheritance-tax.js',
        'glidepath.js',
        'retirement-buckets.js',
        'property-tax.js',
        'bank-parser.js',
        'refinance.js',
        'stress-test.js',
        'vault-crypto.js',
        'p2p-sync.js',
        'bridge.js',
        'budget-import.js',
        'cashflow-viz.js',
        'financial-health.js',
        'i18n-core.js',
        'rebalance-subtools.js',
        'tax-worksheet.js',
      ];
      assert.strictEqual(allEngines.length, 21, 'Must track all 21 modularized core engines');
      for (const eng of allEngines) {
        assert.ok(fs.existsSync(path.join(ROOT_DIR, 'js/engines', eng)), `js/engines/${eng} must exist`);
      }
    });

    it('verifies Phase 109 Performance Optimizations (Resource Hints, Content-Visibility, Speculative Prefetch)', () => {
      const perfTestPath = path.join(ROOT_DIR, 'tests/performance.test.mjs');
      assert.ok(fs.existsSync(perfTestPath), 'tests/performance.test.mjs must exist');

      const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(indexHtml.includes('<link rel="preload" href="css/theme.css" as="style">'));
      assert.ok(indexHtml.includes('<link rel="prefetch" href="dashboard.html">'));
      assert.ok(indexHtml.includes('<link rel="prefetch" href="remaining-money.html">'));

      const themeCss = fs.readFileSync(path.join(ROOT_DIR, 'css/theme.css'), 'utf8');
      assert.ok(themeCss.includes('.content-visibility-auto'));
      assert.ok(themeCss.includes('content-visibility: auto;'));

      const appShellJs = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');
      assert.ok(appShellJs.includes('prefetchTabUrl'));
    });

    it('verifies Phase 112 Advanced Service Worker Cache Lifecycle & Storage Quota Management', () => {
      const swQuotaTestPath = path.join(ROOT_DIR, 'tests/sw-cache-quota.test.mjs');
      assert.ok(fs.existsSync(swQuotaTestPath), 'tests/sw-cache-quota.test.mjs must exist');

      // Verify Service Worker message contracts and activate resilience
      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(swContent.includes('GET_CACHE_STATUS'), 'sw.js must handle GET_CACHE_STATUS');
      assert.ok(swContent.includes('PURGE_STALE_CACHES'), 'sw.js must handle PURGE_STALE_CACHES');
      assert.ok(swContent.includes('REFRESH_CACHE'), 'sw.js must handle REFRESH_CACHE');
      assert.ok(swContent.includes('caches.delete(key).catch('), 'sw.js activate cleanup must handle errors');

      // Verify App Shell UI elements
      const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(indexHtml.includes('id="lbl-cache-quota-title"'), 'index.html must have #lbl-cache-quota-title');
      assert.ok(indexHtml.includes('id="btn-refresh-cache"'), 'index.html must have #btn-refresh-cache');
      assert.ok(indexHtml.includes('id="btn-purge-stale"'), 'index.html must have #btn-purge-stale');
      assert.ok(indexHtml.includes('id="cache-version-badge"'), 'index.html must have #cache-version-badge');
      assert.ok(indexHtml.includes('id="cache-quota-bar"'), 'index.html must have #cache-quota-bar');
      assert.ok(indexHtml.includes('id="lbl-cache-quota-readout"'), 'index.html must have #lbl-cache-quota-readout');

      // Verify App Shell controller exports
      const appShellJs = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');
      assert.ok(appShellJs.includes('formatStorageBytes'), 'app-shell.js must define formatStorageBytes');
      assert.ok(appShellJs.includes('updateStorageQuotaDisplay'), 'app-shell.js must define updateStorageQuotaDisplay');
      assert.ok(appShellJs.includes('refreshAppCache'), 'app-shell.js must define refreshAppCache');
      assert.ok(appShellJs.includes('purgeStaleCaches'), 'app-shell.js must define purgeStaleCaches');
      assert.ok(
        appShellJs.includes('window.MoneyApp.updateStorageQuotaDisplay'),
        'app-shell.js must export updateStorageQuotaDisplay to MoneyApp',
      );
    });

    it('verifies Phase 113 End-to-End Multi-Journey Browser Flow Test Suite presence and contracts', () => {
      const e2eTestPath = path.join(ROOT_DIR, 'tests/e2e-browser-journeys.test.mjs');
      assert.ok(fs.existsSync(e2eTestPath), 'tests/e2e-browser-journeys.test.mjs must exist');

      const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
      assert.ok(pkgJson.scripts['test:e2e'], 'package.json must declare test:e2e script');
      assert.strictEqual(
        pkgJson.scripts['test:e2e'],
        'node --test tests/e2e-browser-journeys.test.mjs',
        'test:e2e script must target tests/e2e-browser-journeys.test.mjs',
      );

      const e2eContent = fs.readFileSync(e2eTestPath, 'utf8');
      const requiredJourneys = [
        'Journey 1: Tab Navigation & Iframe URL Hash Sync',
        'Journey 2: Theme and Language Reload Persistence',
        'Journey 3: Cross-Tool Bridge Protocol End-to-End Hand-off',
        'Journey 4: JSON Backup Export, Master Reset & Restore Round-Trip',
        'Journey 5: Settings Modal Storage Diagnostics & Cache Controls',
      ];

      for (const journey of requiredJourneys) {
        assert.ok(e2eContent.includes(journey), `tests/e2e-browser-journeys.test.mjs must declare ${journey}`);
      }

      assert.ok(e2eContent.includes('resolveChromeBinary'), 'Must declare headless Chrome binary discovery');
      assert.ok(e2eContent.includes('CdpClient'), 'Must declare native CDP WebSocket client');
    });

    it('verifies Phase 116 Dashboard Visualizations Modularization and clean delegation', () => {
      const vizPath = path.join(ROOT_DIR, 'js/engines/dashboard-viz.js');
      assert.ok(fs.existsSync(vizPath), 'js/engines/dashboard-viz.js must exist on disk');
      const vizContent = fs.readFileSync(vizPath, 'utf8');
      assert.ok(
        vizContent.includes('MoneyApp.DashboardViz = DashboardViz'),
        'dashboard-viz.js must export MoneyApp.DashboardViz',
      );
      assert.ok(!vizContent.includes('eval('), 'dashboard-viz.js must never invoke eval()');
      assert.ok(!vizContent.includes('document.write'), 'dashboard-viz.js must never invoke document.write()');

      // Verify dashboard.html registers dashboard-viz.js before dashboard.js
      const dashHtml = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(dashHtml.includes('src="js/engines/dashboard-viz.js"'), 'dashboard.html must include dashboard-viz.js');
      const vizIdx = dashHtml.indexOf('src="js/engines/dashboard-viz.js"');
      const dashIdx = dashHtml.indexOf('src="js/dashboard.js"');
      assert.ok(vizIdx > -1 && dashIdx > vizIdx, 'dashboard-viz.js must be loaded before dashboard.js');

      // Verify service worker registers dashboard-viz.js
      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(swContent.includes("'./js/engines/dashboard-viz.js'"), 'sw.js must cache js/engines/dashboard-viz.js');

      // Verify dashboard.js delegates chart rendering cleanly
      const dashContent = fs.readFileSync(path.join(ROOT_DIR, 'js/dashboard.js'), 'utf8');
      assert.ok(dashContent.includes('DashboardViz'), 'js/dashboard.js must reference MoneyApp.DashboardViz');
    });

    it('verifies Phase 117 Automated Visual Regression & Layout Invariant Suite presence and contracts', () => {
      const visualTestPath = path.join(ROOT_DIR, 'tests/visual-regression.test.mjs');
      assert.ok(fs.existsSync(visualTestPath), 'tests/visual-regression.test.mjs must exist');

      const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
      assert.ok(pkgJson.scripts['test:visual'], 'package.json must declare test:visual script');
      assert.strictEqual(
        pkgJson.scripts['test:visual'],
        'node --test tests/visual-regression.test.mjs',
        'test:visual script must target tests/visual-regression.test.mjs',
      );

      const visualContent = fs.readFileSync(visualTestPath, 'utf8');
      const requiredSuites = [
        'Suite 1: Mobile App Shell Layout Invariants (375x667 and 320x568)',
        'Suite 2: Tablet & Desktop Viewport Responsive Invariants',
        'Suite 3: Child Tool Pages & Side Margin Parity on Mobile',
        'Suite 4: SVG Visualizations Geometry & Bounding Rects',
        'Suite 5: Headless Screenshot Capture Capability',
      ];

      for (const suite of requiredSuites) {
        assert.ok(visualContent.includes(suite), `tests/visual-regression.test.mjs must declare ${suite}`);
      }

      assert.ok(visualContent.includes('resolveChromeBinary'), 'Must declare headless Chrome binary discovery');
      assert.ok(visualContent.includes('CdpClient'), 'Must declare native CDP WebSocket client');
      assert.ok(visualContent.includes('Emulation.setDeviceMetricsOverride'), 'Must declare CDP viewport emulation');
      assert.ok(visualContent.includes('Page.captureScreenshot'), 'Must declare headless screenshot capture');
    });

    it('verifies Phase 118 Lighthouse CI Quality Gate & Automated PWA Performance Checks', () => {
      const lighthousercPath = path.join(ROOT_DIR, '.lighthouserc.json');
      assert.ok(fs.existsSync(lighthousercPath), '.lighthouserc.json must exist');

      const config = JSON.parse(fs.readFileSync(lighthousercPath, 'utf8'));
      assert.ok(config.ci, 'Lighthouse CI config must declare ci block');
      assert.strictEqual(
        config.ci.collect?.staticDistDir,
        './',
        'Lighthouse CI staticDistDir must audit root static directory directly',
      );
      assert.strictEqual(config.ci.collect?.isSinglePageApplication, false, 'isSinglePageApplication must be false');
      assert.strictEqual(config.ci.collect?.numberOfRuns, 1, 'numberOfRuns must be 1');

      const assertions = config.ci.assert?.assertions;
      assert.ok(assertions, 'assertions block must be defined');
      assert.ok(assertions['categories:pwa'], 'PWA category assertion must exist');
      assert.ok(assertions['categories:accessibility'], 'Accessibility category assertion must exist');
      assert.ok(assertions['categories:best-practices'], 'Best practices category assertion must exist');
      assert.ok(assertions['categories:performance'], 'Performance category assertion must exist');

      // Verify CI workflow integrates Lighthouse CI
      const ciWorkflowPath = path.join(ROOT_DIR, '.github/workflows/ci.yml');
      assert.ok(fs.existsSync(ciWorkflowPath), '.github/workflows/ci.yml must exist');
      const ciWorkflow = fs.readFileSync(ciWorkflowPath, 'utf8');
      assert.ok(
        ciWorkflow.includes('treosh/lighthouse-ci-action@v12'),
        'ci.yml must declare treosh/lighthouse-ci-action@v12 action',
      );
      assert.ok(
        ciWorkflow.includes("configPath: './.lighthouserc.json'"),
        'ci.yml must link to .lighthouserc.json configuration file',
      );

      // Verify PWA performance invariants
      const manifestPath = path.join(ROOT_DIR, 'manifest.json');
      assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      assert.strictEqual(manifest.display, 'standalone', 'PWA display must be standalone');
      assert.ok(manifest.theme_color, 'manifest must specify theme_color');
      assert.ok(manifest.background_color, 'manifest must specify background_color');
    });

    it('verifies Phase 120 Google Drive Expense Tracking Export (CSV/PDF) contracts and controls', () => {
      const remHtml = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      const remJs = fs.readFileSync(path.join(ROOT_DIR, 'js/remaining-money.js'), 'utf8');

      // 1. Verify UI controls and modal in remaining-money.html
      assert.ok(remHtml.includes('id="btnSaveToDrive"'), 'remaining-money.html must define #btnSaveToDrive');
      assert.ok(remHtml.includes('id="lblSaveToDrive"'), 'remaining-money.html must define #lblSaveToDrive');
      assert.ok(remHtml.includes('id="driveExportModal"'), 'remaining-money.html must define #driveExportModal');
      assert.ok(remHtml.includes('id="driveModalTitle"'), 'remaining-money.html must define #driveModalTitle');
      assert.ok(remHtml.includes('id="driveModalSub"'), 'remaining-money.html must define #driveModalSub');
      assert.ok(remHtml.includes('id="driveFormatCsv"'), 'remaining-money.html must define #driveFormatCsv');
      assert.ok(remHtml.includes('id="driveFormatPdf"'), 'remaining-money.html must define #driveFormatPdf');
      assert.ok(remHtml.includes('id="btnDriveShareOrSave"'), 'remaining-money.html must define #btnDriveShareOrSave');
      assert.ok(remHtml.includes('id="btnOpenDrive"'), 'remaining-money.html must define #btnOpenDrive');
      assert.ok(remHtml.includes('id="btnOpenSheets"'), 'remaining-money.html must define #btnOpenSheets');
      assert.ok(remHtml.includes('data-i18n="driveGuide"'), 'remaining-money.html must declare driveGuide');

      // 2. Verify controller functions and window exports in js/remaining-money.js
      assert.ok(remJs.includes('function openDriveModal()'), 'remaining-money.js must define openDriveModal');
      assert.ok(remJs.includes('function closeDriveModal()'), 'remaining-money.js must define closeDriveModal');
      assert.ok(
        remJs.includes('async function saveToGoogleDrive()'),
        'remaining-money.js must define saveToGoogleDrive',
      );
      assert.ok(
        remJs.includes('function generateExpenseLedgerCSV()'),
        'remaining-money.js must define generateExpenseLedgerCSV',
      );

      assert.ok(
        remJs.includes('window.openDriveModal = openDriveModal'),
        'remaining-money.js must export openDriveModal',
      );
      assert.ok(
        remJs.includes('window.closeDriveModal = closeDriveModal'),
        'remaining-money.js must export closeDriveModal',
      );
      assert.ok(
        remJs.includes('window.saveToGoogleDrive = saveToGoogleDrive'),
        'remaining-money.js must export saveToGoogleDrive',
      );
      assert.ok(
        remJs.includes('window.generateExpenseLedgerCSV = generateExpenseLedgerCSV'),
        'remaining-money.js must export generateExpenseLedgerCSV',
      );

      // 3. Verify ledger CSV structure & BOM
      assert.ok(
        remJs.includes('Date,Type,Category,Item,Amount (THB),Note,Month'),
        'generateExpenseLedgerCSV must define standard ledger columns',
      );
      assert.ok(
        remJs.includes('remaining_expense_ledger_'),
        'saveToGoogleDrive must generate remaining_expense_ledger_ filename',
      );

      // 4. Test generateExpenseLedgerCSV execution and CSV format contracts
      const sandbox = {
        console,
        Math,
        Date,
        LANG: 'th',
        pvdPercent: 5,
        state: {
          incomes: [{ name: 'Salary', value: 50000 }],
          expenses: [{ name: 'Rent', value: 15000 }],
          savings: [{ name: 'Emergency Fund', value: 5000 }],
          showEmergencyRunway: true,
          currentEmergencyReserve: 90000,
        },
        csvSafe: (v) => String(v ?? ''),
        isSalaryRow: (_item, idx) => idx === 0,
        getDisplayName: (name) => name,
        getAutoType: () => null,
      };
      const vmContext = createContext(sandbox);
      const csvGenMatch = remJs.match(/function generateExpenseLedgerCSV\(\) \{[\s\S]*?\n\}/);
      assert.ok(csvGenMatch, 'Must match generateExpenseLedgerCSV implementation');
      new Script(`${csvGenMatch[0]}\nresult = generateExpenseLedgerCSV();`).runInContext(vmContext);
      const generatedCsv = sandbox.result;

      assert.ok(
        generatedCsv.startsWith('\uFEFF'),
        'CSV must prepend \\uFEFF BOM for Excel/Google Sheets compatibility',
      );
      assert.ok(
        generatedCsv.includes('Date,Type,Category,Item,Amount (THB),Note,Month'),
        'CSV must include header row',
      );
      assert.ok(generatedCsv.includes('Salary,50000'), 'CSV must include Income rows');
      assert.ok(generatedCsv.includes('Rent,15000'), 'CSV must include Expense rows');
      assert.ok(generatedCsv.includes('Emergency Fund,5000'), 'CSV must include Savings rows');
      assert.ok(generatedCsv.includes('50000'), 'CSV summary must include Total Income');
      assert.ok(generatedCsv.includes('15000'), 'CSV summary must include Total Expenses');
      assert.ok(generatedCsv.includes('5000'), 'CSV summary must include Total Savings');
      assert.ok(generatedCsv.includes('30000'), 'CSV summary must include 30000 net remaining');
    });

    it('verifies Phase 124 Universal Cloud Export (Dashboard & Tax Dossier to Google Drive) contracts and controls', () => {
      const dashHtml = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      const dashJs = fs.readFileSync(path.join(ROOT_DIR, 'js/dashboard.js'), 'utf8');
      const taxHtml = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      const taxJs = fs.readFileSync(path.join(ROOT_DIR, 'js/tax-calculator-base.js'), 'utf8');

      // 1. Verify UI controls and modal in dashboard.html
      assert.ok(dashHtml.includes('id="btnSaveToDrive"'), 'dashboard.html must define #btnSaveToDrive');
      assert.ok(dashHtml.includes('id="driveExportModal"'), 'dashboard.html must define #driveExportModal');
      assert.ok(dashHtml.includes('id="driveModalTitle"'), 'dashboard.html must define #driveModalTitle');
      assert.ok(dashHtml.includes('id="driveModalSub"'), 'dashboard.html must define #driveModalSub');
      assert.ok(dashHtml.includes('id="driveFormatCsv"'), 'dashboard.html must define #driveFormatCsv');
      assert.ok(dashHtml.includes('id="driveFormatPdf"'), 'dashboard.html must define #driveFormatPdf');
      assert.ok(dashHtml.includes('id="btnDriveShareOrSave"'), 'dashboard.html must define #btnDriveShareOrSave');
      assert.ok(dashHtml.includes('id="btnOpenDrive"'), 'dashboard.html must define #btnOpenDrive');
      assert.ok(dashHtml.includes('id="btnOpenSheets"'), 'dashboard.html must define #btnOpenSheets');
      assert.ok(dashHtml.includes('data-i18n="driveGuide"'), 'dashboard.html must declare driveGuide');

      // 2. Verify functions and exports in js/dashboard.js
      assert.ok(dashJs.includes('function openDriveModal()'), 'dashboard.js must define openDriveModal');
      assert.ok(dashJs.includes('function closeDriveModal()'), 'dashboard.js must define closeDriveModal');
      assert.ok(dashJs.includes('async function saveToGoogleDrive()'), 'dashboard.js must define saveToGoogleDrive');
      assert.ok(
        dashJs.includes('function generateDashboardDossierCSV()'),
        'dashboard.js must define generateDashboardDossierCSV',
      );
      assert.ok(
        dashJs.includes('window.generateDashboardDossierCSV = generateDashboardDossierCSV'),
        'dashboard.js must export generateDashboardDossierCSV',
      );
      assert.ok(dashJs.includes('window.openDriveModal = openDriveModal'), 'dashboard.js must export openDriveModal');
      assert.ok(
        dashJs.includes('window.closeDriveModal = closeDriveModal'),
        'dashboard.js must export closeDriveModal',
      );
      assert.ok(
        dashJs.includes('window.saveToGoogleDrive = saveToGoogleDrive'),
        'dashboard.js must export saveToGoogleDrive',
      );
      assert.ok(
        dashJs.includes('financial_dossier_'),
        'dashboard.js saveToGoogleDrive must generate financial_dossier_ filename',
      );

      // 3. Test generateDashboardDossierCSV execution in VM context
      const dashSandbox = {
        console,
        Math,
        Date,
        LANG: 'th',
        gatherFinancialProfile: () => ({
          netWorth: 1250000,
          emergencyReserve: 300000,
          portfolioVal: 950000,
          goldVal: 0,
          totalDebt: 0,
          savingsRate: 25.5,
          runwayMonths: 6.2,
          grossAssets: 1250000,
          monthlyExpense: 35000,
          topMarginalRate: 10,
          estimatedTax: 15000,
          debtFreeText: '=HYPERLINK("http://evil.com")',
        }),
        calculateFinancialHealthScore: () => ({ compositeScore: 82, tier: 'strong' }),
        getFinancialGoals: () => ({ netWorthTarget: 2000000 }),
      };
      const dashVmContext = createContext(dashSandbox);
      const dashCsvMatch = dashJs.match(/function generateDashboardDossierCSV\(\) \{[\s\S]*?\n\}/);
      assert.ok(dashCsvMatch, 'Must match generateDashboardDossierCSV implementation');
      new Script(`${dashCsvMatch[0]}\nresult = generateDashboardDossierCSV();`).runInContext(dashVmContext);
      const generatedDashCsv = dashSandbox.result;

      assert.ok(
        generatedDashCsv.startsWith('\uFEFF'),
        'Dashboard CSV must prepend \\uFEFF BOM for Excel/Google Sheets compatibility',
      );
      assert.ok(
        generatedDashCsv.includes('Date,Category,Metric,Value,Unit,Note'),
        'Dashboard CSV must define standard dossier columns',
      );
      assert.ok(generatedDashCsv.includes('1250000'), 'Dashboard CSV must include Net Worth amount');
      assert.ok(generatedDashCsv.includes('300000'), 'Dashboard CSV must include Cash reserve amount');
      assert.ok(generatedDashCsv.includes('950000'), 'Dashboard CSV must include Investments amount');
      assert.ok(generatedDashCsv.includes('25.5'), 'Dashboard CSV must include Savings Rate');
      assert.ok(generatedDashCsv.includes('6.2'), 'Dashboard CSV must include Runway months');
      assert.ok(
        generatedDashCsv.includes('"\'=HYPERLINK(""http://evil.com"")"'),
        'Dashboard CSV must sanitize formula strings with leading single quote',
      );

      // 4. Verify UI controls and modal in tax-calculator-base.html
      assert.ok(taxHtml.includes('id="btnSaveToDrive"'), 'tax-calculator-base.html must define #btnSaveToDrive');
      assert.ok(taxHtml.includes('id="driveExportModal"'), 'tax-calculator-base.html must define #driveExportModal');
      assert.ok(taxHtml.includes('id="driveModalTitle"'), 'tax-calculator-base.html must define #driveModalTitle');
      assert.ok(taxHtml.includes('id="driveModalSub"'), 'tax-calculator-base.html must define #driveModalSub');
      assert.ok(taxHtml.includes('id="driveFormatCsv"'), 'tax-calculator-base.html must define #driveFormatCsv');
      assert.ok(taxHtml.includes('id="driveFormatPdf"'), 'tax-calculator-base.html must define #driveFormatPdf');
      assert.ok(
        taxHtml.includes('id="btnDriveShareOrSave"'),
        'tax-calculator-base.html must define #btnDriveShareOrSave',
      );
      assert.ok(taxHtml.includes('id="btnOpenDrive"'), 'tax-calculator-base.html must define #btnOpenDrive');
      assert.ok(taxHtml.includes('id="btnOpenSheets"'), 'tax-calculator-base.html must define #btnOpenSheets');
      assert.ok(taxHtml.includes('data-i18n="driveGuide"'), 'tax-calculator-base.html must declare driveGuide');

      // 5. Verify functions and exports in js/tax-calculator-base.js
      assert.ok(taxJs.includes('function openDriveModal()'), 'tax-calculator-base.js must define openDriveModal');
      assert.ok(taxJs.includes('function closeDriveModal()'), 'tax-calculator-base.js must define closeDriveModal');
      assert.ok(
        taxJs.includes('async function saveToGoogleDrive()'),
        'tax-calculator-base.js must define saveToGoogleDrive',
      );
      assert.ok(
        taxJs.includes('function generateTaxDossierCSV()'),
        'tax-calculator-base.js must define generateTaxDossierCSV',
      );
      assert.ok(
        taxJs.includes('window.generateTaxDossierCSV = generateTaxDossierCSV'),
        'tax-calculator-base.js must export generateTaxDossierCSV',
      );
      assert.ok(
        taxJs.includes('window.openDriveModal = openDriveModal'),
        'tax-calculator-base.js must export openDriveModal',
      );
      assert.ok(
        taxJs.includes('window.closeDriveModal = closeDriveModal'),
        'tax-calculator-base.js must export closeDriveModal',
      );
      assert.ok(
        taxJs.includes('window.saveToGoogleDrive = saveToGoogleDrive'),
        'tax-calculator-base.js must export saveToGoogleDrive',
      );
      assert.ok(
        taxJs.includes('tax_dossier_'),
        'tax-calculator-base.js saveToGoogleDrive must generate tax_dossier_ filename',
      );

      // 6. Test generateTaxDossierCSV execution in VM context
      const taxSandbox = {
        console,
        Math,
        Date,
        LANG: 'th',
        calculateTax: () => {},
        lastTaxCalculationData: {
          totalIncome: 1200000,
          expenseDeduction: 100000,
          personalDeduction: 60000,
          pvdDeduction: 120000,
          ssoDeduction: 9000,
          effectiveFund: 100000,
          effectiveThaiEsg: 50000,
          effectiveInsurance: 25000,
          effectiveMortgage: 40000,
          effectiveEasyReceipt: 0,
          otherDeduct: 0,
          totalDeductions: 504000,
          netIncome: 596000,
          tax: 41900,
        },
      };
      const taxVmContext = createContext(taxSandbox);
      const taxCsvMatch = taxJs.match(/function generateTaxDossierCSV\(\) \{[\s\S]*?\n\}/);
      assert.ok(taxCsvMatch, 'Must match generateTaxDossierCSV implementation');
      new Script(`${taxCsvMatch[0]}\nresult = generateTaxDossierCSV();`).runInContext(taxVmContext);
      const generatedTaxCsv = taxSandbox.result;

      assert.ok(
        generatedTaxCsv.startsWith('\uFEFF'),
        'Tax CSV must prepend \\uFEFF BOM for Excel/Google Sheets compatibility',
      );
      assert.ok(
        generatedTaxCsv.includes('Section,Category,Item,Amount,MaxCap,Note'),
        'Tax CSV must define standard dossier columns',
      );
      assert.ok(generatedTaxCsv.includes('1200000'), 'Tax CSV must include Gross Income');
      assert.ok(generatedTaxCsv.includes('100000'), 'Tax CSV must include Expense deduction');
      assert.ok(generatedTaxCsv.includes('60000'), 'Tax CSV must include Personal allowance');
      assert.ok(generatedTaxCsv.includes('9000'), 'Tax CSV must include SSO deduction');
      assert.ok(generatedTaxCsv.includes('120000'), 'Tax CSV must include PVD deduction');
      assert.ok(generatedTaxCsv.includes('50000'), 'Tax CSV must include ThaiESG deduction');
      assert.ok(generatedTaxCsv.includes('25000'), 'Tax CSV must include Insurance deduction');
      assert.ok(generatedTaxCsv.includes('40000'), 'Tax CSV must include Mortgage deduction');
      assert.ok(generatedTaxCsv.includes('596000'), 'Tax CSV must include Taxable Net Income');
      assert.ok(generatedTaxCsv.includes('41900'), 'Tax CSV must include Tax Payable');

      // 7. Verify CWE-1236 Formula Injection Sanitization across both CSV engines
      const csvSafeRegex = /function csvSafe\(val\) \{[\s\S]*?return str;\s*\}/;
      const dashCsvSafeMatch = dashJs.match(csvSafeRegex);
      assert.ok(dashCsvSafeMatch, 'Dashboard must define csvSafe');
      const testVm = createContext({ result: null });
      new Script(`${dashCsvSafeMatch[0]}\nresult = csvSafe('=HYPERLINK("http://evil.com")');`).runInContext(testVm);
      assert.equal(testVm.result, '"\'=HYPERLINK(""http://evil.com"")"');

      new Script(`${dashCsvSafeMatch[0]}\nresult = csvSafe('@SUM');`).runInContext(testVm);
      assert.equal(testVm.result, "'@SUM");

      const taxCsvSafeMatch = taxJs.match(csvSafeRegex);
      assert.ok(taxCsvSafeMatch, 'Tax dossier must define csvSafe');
      new Script(`${taxCsvSafeMatch[0]}\nresult = csvSafe('=HYPERLINK("http://evil.com")');`).runInContext(testVm);
      assert.equal(testVm.result, '"\'=HYPERLINK(""http://evil.com"")"');

      new Script(`${taxCsvSafeMatch[0]}\nresult = csvSafe('@SUM');`).runInContext(testVm);
      assert.equal(testVm.result, "'@SUM");
    });

    it('verifies Phase 125 Universal Cloud Export (Debt Payoff & Rebalance Orders to Google Drive) contracts and controls', () => {
      const debtHtml = fs.readFileSync(path.join(ROOT_DIR, 'debt-calculator.html'), 'utf8');
      const debtJs = fs.readFileSync(path.join(ROOT_DIR, 'js/debt-calculator.js'), 'utf8');
      const rebHtml = fs.readFileSync(path.join(ROOT_DIR, 'rebalance.html'), 'utf8');
      const rebJs = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');

      // 1. Verify UI controls and modal in debt-calculator.html
      assert.ok(debtHtml.includes('id="btnSaveToDrive"'), 'debt-calculator.html must define #btnSaveToDrive');
      assert.ok(debtHtml.includes('id="driveExportModal"'), 'debt-calculator.html must define #driveExportModal');
      assert.ok(debtHtml.includes('id="driveModalTitle"'), 'debt-calculator.html must define #driveModalTitle');
      assert.ok(debtHtml.includes('id="driveModalSub"'), 'debt-calculator.html must define #driveModalSub');
      assert.ok(debtHtml.includes('id="driveFormatCsv"'), 'debt-calculator.html must define #driveFormatCsv');
      assert.ok(debtHtml.includes('id="driveFormatPdf"'), 'debt-calculator.html must define #driveFormatPdf');
      assert.ok(debtHtml.includes('id="btnDriveShareOrSave"'), 'debt-calculator.html must define #btnDriveShareOrSave');
      assert.ok(debtHtml.includes('id="btnOpenDrive"'), 'debt-calculator.html must define #btnOpenDrive');
      assert.ok(debtHtml.includes('id="btnOpenSheets"'), 'debt-calculator.html must define #btnOpenSheets');
      assert.ok(debtHtml.includes('data-i18n="driveGuide"'), 'debt-calculator.html must declare driveGuide');

      // 2. Verify functions and exports in js/debt-calculator.js
      assert.ok(debtJs.includes('function openDriveModal()'), 'debt-calculator.js must define openDriveModal');
      assert.ok(debtJs.includes('function closeDriveModal()'), 'debt-calculator.js must define closeDriveModal');
      assert.ok(
        debtJs.includes('async function saveToGoogleDrive()'),
        'debt-calculator.js must define saveToGoogleDrive',
      );
      assert.ok(
        debtJs.includes('function generateDebtAmortizationCSV()'),
        'debt-calculator.js must define generateDebtAmortizationCSV',
      );
      assert.ok(
        debtJs.includes('window.generateDebtAmortizationCSV = generateDebtAmortizationCSV'),
        'debt-calculator.js must export generateDebtAmortizationCSV',
      );
      assert.ok(
        debtJs.includes('window.openDriveModal = openDriveModal'),
        'debt-calculator.js must export openDriveModal',
      );
      assert.ok(
        debtJs.includes('window.closeDriveModal = closeDriveModal'),
        'debt-calculator.js must export closeDriveModal',
      );
      assert.ok(
        debtJs.includes('window.saveToGoogleDrive = saveToGoogleDrive'),
        'debt-calculator.js must export saveToGoogleDrive',
      );
      assert.ok(
        debtJs.includes('debt_amortization_'),
        'debt-calculator.js saveToGoogleDrive must generate debt_amortization_ filename',
      );

      // 3. Test generateDebtAmortizationCSV execution in VM context
      const debtSandbox = {
        console,
        Math,
        Date,
        LANG: 'th',
        state: {
          strategy: 'avalanche',
          extraPayment: 5000,
          debts: [
            { id: 1, name: 'Credit Card', balance: 50000, rate: 16, minPayment: 2500 },
            { id: 2, name: '=HYPERLINK("http://evil.com")', balance: 100000, rate: 18, minPayment: 3000 },
          ],
        },
        simulate: (_debts, _extra, _strategy) => ({
          months: 24,
          totalInterest: 14500,
          payoffOrder: [
            { name: '=HYPERLINK("http://evil.com")', month: 12 },
            { name: 'Credit Card', month: 24 },
          ],
        }),
      };
      const debtVmContext = createContext(debtSandbox);
      const debtCsvMatch = debtJs.match(/function generateDebtAmortizationCSV\(\) \{[\s\S]*?\n\}/);
      assert.ok(debtCsvMatch, 'Must match generateDebtAmortizationCSV implementation');
      new Script(`${debtCsvMatch[0]}\nresult = generateDebtAmortizationCSV();`).runInContext(debtVmContext);
      const generatedDebtCsv = debtSandbox.result;

      assert.ok(
        generatedDebtCsv.startsWith('\uFEFF'),
        'Debt CSV must prepend \\uFEFF BOM for Excel/Google Sheets compatibility',
      );
      assert.ok(
        generatedDebtCsv.includes(
          'Date,DebtName,Balance,InterestRate,MonthlyPayment,Strategy,PayoffMonths,TotalInterest',
        ),
        'Debt CSV must define standard amortization columns',
      );
      assert.ok(
        generatedDebtCsv.includes('Credit Card,50000,16,2500,Avalanche,24,14500'),
        'Debt CSV must include first debt',
      );
      assert.ok(
        generatedDebtCsv.includes('"\'=HYPERLINK(""http://evil.com"")"'),
        'Debt CSV must escape formula injection with leading single quote',
      );

      // 4. Verify UI controls and modal in rebalance.html
      assert.ok(rebHtml.includes('id="btnSaveToDrive"'), 'rebalance.html must define #btnSaveToDrive');
      assert.ok(rebHtml.includes('id="driveExportModal"'), 'rebalance.html must define #driveExportModal');
      assert.ok(rebHtml.includes('id="driveModalTitle"'), 'rebalance.html must define #driveModalTitle');
      assert.ok(rebHtml.includes('id="driveModalSub"'), 'rebalance.html must define #driveModalSub');
      assert.ok(rebHtml.includes('id="driveFormatCsv"'), 'rebalance.html must define #driveFormatCsv');
      assert.ok(rebHtml.includes('id="driveFormatPdf"'), 'rebalance.html must define #driveFormatPdf');
      assert.ok(rebHtml.includes('id="btnDriveShareOrSave"'), 'rebalance.html must define #btnDriveShareOrSave');
      assert.ok(rebHtml.includes('id="btnOpenDrive"'), 'rebalance.html must define #btnOpenDrive');
      assert.ok(rebHtml.includes('id="btnOpenSheets"'), 'rebalance.html must define #btnOpenSheets');
      assert.ok(rebHtml.includes('data-i18n="driveGuide"'), 'rebalance.html must declare driveGuide');

      // 5. Verify functions and exports in js/rebalance.js
      assert.ok(rebJs.includes('function openDriveModal()'), 'rebalance.js must define openDriveModal');
      assert.ok(rebJs.includes('function closeDriveModal()'), 'rebalance.js must define closeDriveModal');
      assert.ok(rebJs.includes('async function saveToGoogleDrive()'), 'rebalance.js must define saveToGoogleDrive');
      assert.ok(
        rebJs.includes('function generateRebalanceOrdersCSV()'),
        'rebalance.js must define generateRebalanceOrdersCSV',
      );
      assert.ok(
        rebJs.includes('window.generateRebalanceOrdersCSV = generateRebalanceOrdersCSV'),
        'rebalance.js must export generateRebalanceOrdersCSV',
      );
      assert.ok(rebJs.includes('window.openDriveModal = openDriveModal'), 'rebalance.js must export openDriveModal');
      assert.ok(rebJs.includes('window.closeDriveModal = closeDriveModal'), 'rebalance.js must export closeDriveModal');
      assert.ok(
        rebJs.includes('window.saveToGoogleDrive = saveToGoogleDrive'),
        'rebalance.js must export saveToGoogleDrive',
      );
      assert.ok(
        rebJs.includes('rebalance_orders_'),
        'rebalance.js saveToGoogleDrive must generate rebalance_orders_ filename',
      );

      // 6. Test generateRebalanceOrdersCSV execution in VM context
      const rebSandbox = {
        console,
        Math,
        Date,
        LANG: 'th',
        state: {
          totalBudget: 100000,
          buckets: [
            {
              label: 'Core',
              weight: 60,
              assets: [
                { name: 'Global Equities', value: 60000, weight: 100 },
                { name: '=HYPERLINK("http://evil.com")', value: 40000, weight: 0 },
              ],
            },
          ],
        },
        allocateBuckets: (_b) => [60000],
        allocate: (_assets, _budget) => [60000, 0],
      };
      const rebVmContext = createContext(rebSandbox);
      const rebCsvMatch = rebJs.match(/function generateRebalanceOrdersCSV\(\) \{[\s\S]*?\n\}/);
      assert.ok(rebCsvMatch, 'Must match generateRebalanceOrdersCSV implementation');
      new Script(`${rebCsvMatch[0]}\nresult = generateRebalanceOrdersCSV();`).runInContext(rebVmContext);
      const generatedRebCsv = rebSandbox.result;

      assert.ok(
        generatedRebCsv.startsWith('\uFEFF'),
        'Rebalance CSV must prepend \\uFEFF BOM for Excel/Google Sheets compatibility',
      );
      assert.ok(
        generatedRebCsv.includes(
          'Date,AssetClass,CurrentAmount,CurrentWeightPct,TargetWeightPct,TargetAmount,Action,OrderAmount',
        ),
        'Rebalance CSV must define standard order columns',
      );
      assert.ok(
        generatedRebCsv.includes('Global Equities,60000,60,60,120000,BUY,60000'),
        'Rebalance CSV must include buy order',
      );
      assert.ok(
        generatedRebCsv.includes('"\'=HYPERLINK(""http://evil.com"")"'),
        'Rebalance CSV must sanitize formula strings with leading single quote',
      );

      // 7. Verify CWE-1236 Formula Injection Sanitization across debt and rebalance CSV engines
      const csvSafeRegex = /function csvSafe\(val\) \{[\s\S]*?return str;\s*\}/;
      const debtCsvSafeMatch = debtJs.match(csvSafeRegex);
      assert.ok(debtCsvSafeMatch, 'Debt calculator must define csvSafe');
      const testVm = createContext({ result: null });
      new Script(`${debtCsvSafeMatch[0]}\nresult = csvSafe('=HYPERLINK("http://evil.com")');`).runInContext(testVm);
      assert.equal(testVm.result, '"\'=HYPERLINK(""http://evil.com"")"');

      new Script(`${debtCsvSafeMatch[0]}\nresult = csvSafe('@SUM');`).runInContext(testVm);
      assert.equal(testVm.result, "'@SUM");

      const rebCsvSafeMatch = rebJs.match(csvSafeRegex);
      assert.ok(rebCsvSafeMatch, 'Rebalance tool must define csvSafe');
      new Script(`${rebCsvSafeMatch[0]}\nresult = csvSafe('=HYPERLINK("http://evil.com")');`).runInContext(testVm);
      assert.equal(testVm.result, '"\'=HYPERLINK(""http://evil.com"")"');

      new Script(`${rebCsvSafeMatch[0]}\nresult = csvSafe('@SUM');`).runInContext(testVm);
      assert.equal(testVm.result, "'@SUM");
    });
  });

  describe('Phase 126: Interactive Debt Payoff Visual SVG Comparison Timeline Contracts', () => {
    const debtHtmlPath = path.join(ROOT_DIR, 'debt-calculator.html');
    const debtJsPath = path.join(ROOT_DIR, 'js', 'debt-calculator.js');
    const thPath = path.join(ROOT_DIR, 'js', 'i18n', 'th.js');
    const enPath = path.join(ROOT_DIR, 'js', 'i18n', 'en.js');

    const debtHtml = fs.readFileSync(debtHtmlPath, 'utf8');
    const debtJs = fs.readFileSync(debtJsPath, 'utf8');
    const thJs = fs.readFileSync(thPath, 'utf8');
    const enJs = fs.readFileSync(enPath, 'utf8');

    it('verifies HTML markup defines mode buttons, chart wrapper, and tooltip', () => {
      assert.ok(debtHtml.includes('id="debtChartModeGroup"'), 'debt-calculator.html must define #debtChartModeGroup');
      assert.ok(debtHtml.includes('id="btnChartModeDual"'), 'debt-calculator.html must define #btnChartModeDual');
      assert.ok(
        debtHtml.includes('id="btnChartModeAvalanche"'),
        'debt-calculator.html must define #btnChartModeAvalanche',
      );
      assert.ok(
        debtHtml.includes('id="btnChartModeSnowball"'),
        'debt-calculator.html must define #btnChartModeSnowball',
      );
      assert.ok(debtHtml.includes('id="debtChartWrapper"'), 'debt-calculator.html must define #debtChartWrapper');
      assert.ok(debtHtml.includes('id="debtChartTooltip"'), 'debt-calculator.html must define #debtChartTooltip');
      assert.ok(debtHtml.includes('id="svgDebtChart"'), 'debt-calculator.html must define #svgDebtChart');
      assert.ok(debtHtml.includes('id="legItemAvalanche"'), 'debt-calculator.html must define #legItemAvalanche');
      assert.ok(debtHtml.includes('id="legItemSnowball"'), 'debt-calculator.html must define #legItemSnowball');
    });

    it('verifies js/debt-calculator.js implements crosshair, hover dots, and interactive controls', () => {
      assert.ok(debtJs.includes("chartMode: 'dual'"), 'debt-calculator.js defaultState must declare chartMode: dual');
      assert.ok(debtJs.includes('function setDebtChartMode('), 'debt-calculator.js must define setDebtChartMode');
      assert.ok(
        debtJs.includes('window.setDebtChartMode = setDebtChartMode'),
        'debt-calculator.js must export setDebtChartMode',
      );
      assert.ok(
        debtJs.includes('function setupDebtChartInteractions('),
        'debt-calculator.js must define setupDebtChartInteractions',
      );
      assert.ok(
        debtJs.includes('window.setupDebtChartInteractions = setupDebtChartInteractions'),
        'debt-calculator.js must export setupDebtChartInteractions',
      );
      assert.ok(
        debtJs.includes('window.renderDebtChart = renderPayoffChart'),
        'debt-calculator.js must export renderDebtChart',
      );
      assert.ok(debtJs.includes('id="svgChartCrosshair"'), 'debt-calculator.js must render #svgChartCrosshair');
      assert.ok(debtJs.includes('id="dotHoverAvalanche"'), 'debt-calculator.js must render #dotHoverAvalanche');
      assert.ok(debtJs.includes('id="dotHoverSnowball"'), 'debt-calculator.js must render #dotHoverSnowball');
      assert.ok(
        debtJs.includes('window._debtChartContext ='),
        'debt-calculator.js must populate window._debtChartContext',
      );
    });

    it('verifies i18n dictionaries include Phase 126 chart mode and tooltip keys', () => {
      const keys = [
        'chartModeDual',
        'chartModeAvalanche',
        'chartModeSnowball',
        'chartTooltipBalance',
        'chartTooltipSaved',
      ];
      for (const k of keys) {
        assert.ok(thJs.includes(`${k}:`), `th.js must define ${k}`);
        assert.ok(enJs.includes(`${k}:`), `en.js must define ${k}`);
        assert.ok(debtJs.includes(`${k}:`), `debt-calculator.js must define ${k}`);
      }
    });

    it('validates setDebtChartMode switching and fallback in sandbox VM', () => {
      const classes = {
        btnChartModeDual: new Set(['active']),
        btnChartModeAvalanche: new Set(),
        btnChartModeSnowball: new Set(),
      };
      const mockElement = (id) => ({
        classList: {
          toggle: (cls, condition) => {
            if (condition) classes[id]?.add(cls);
            else classes[id]?.delete(cls);
          },
        },
      });

      let payoffComputed = false;
      const sandbox = {
        console,
        state: { chartMode: 'dual' },
        saveState: () => {},
        computePayoff: () => {
          payoffComputed = true;
        },
        document: {
          getElementById: (id) => mockElement(id),
        },
        window: {},
      };
      const vm = createContext(sandbox);
      const setModeMatch = debtJs.match(/function setDebtChartMode\([\s\S]*?\n\}/);
      assert.ok(setModeMatch, 'setDebtChartMode must be present');

      new Script(`${setModeMatch[0]}\nsetDebtChartMode('avalanche');`).runInContext(vm);
      assert.equal(sandbox.state.chartMode, 'avalanche');
      assert.equal(classes.btnChartModeAvalanche.has('active'), true);
      assert.equal(classes.btnChartModeDual.has('active'), false);
      assert.equal(payoffComputed, true);

      new Script(`setDebtChartMode('unsupported');`).runInContext(vm);
      assert.equal(sandbox.state.chartMode, 'dual');
      assert.equal(classes.btnChartModeDual.has('active'), true);
      assert.equal(classes.btnChartModeAvalanche.has('active'), false);
    });

    it('verifies security sanitization and context cleanup in renderPayoffChart', () => {
      assert.ok(
        debtJs.includes('escapeHtml(po.name)'),
        'debt-calculator.js must escape debt name in milestone markers to prevent stored XSS',
      );
      assert.ok(
        debtJs.includes('window._debtChartContext = null;'),
        'debt-calculator.js must reset window._debtChartContext on zero debt balance',
      );
    });
  });

  describe('Phase 128: Mobile Pull-to-Refresh Gesture & Web App Badging API Contracts', () => {
    it('verifies index.html declares #pullToRefreshBar and #pullToRefreshText indicator markup', () => {
      const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(indexHtml.includes('id="pullToRefreshBar"'), 'index.html must define #pullToRefreshBar');
      assert.ok(indexHtml.includes('id="pullToRefreshText"'), 'index.html must define #pullToRefreshText');
      assert.ok(indexHtml.includes('.pwa-status-dot.has-badge'), 'index.html must style .pwa-status-dot.has-badge');
    });

    it('verifies js/app-shell.js defines and exports initPullToRefresh, computeBadgeCount, updateAppBadge, and clearAppBadge', () => {
      const appShellJs = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');
      assert.ok(appShellJs.includes('function initPullToRefresh'), 'app-shell.js must define initPullToRefresh');
      assert.ok(appShellJs.includes('function computeBadgeCount'), 'app-shell.js must define computeBadgeCount');
      assert.ok(appShellJs.includes('function updateAppBadge'), 'app-shell.js must define updateAppBadge');
      assert.ok(appShellJs.includes('function clearAppBadge'), 'app-shell.js must define clearAppBadge');

      assert.ok(
        appShellJs.includes('MoneyApp.initPullToRefresh = initPullToRefresh'),
        'app-shell.js must export initPullToRefresh to MoneyApp',
      );
      assert.ok(
        appShellJs.includes('MoneyApp.computeBadgeCount = computeBadgeCount'),
        'app-shell.js must export computeBadgeCount to MoneyApp',
      );
      assert.ok(
        appShellJs.includes('MoneyApp.updateAppBadge = updateAppBadge'),
        'app-shell.js must export updateAppBadge to MoneyApp',
      );
      assert.ok(
        appShellJs.includes('MoneyApp.clearAppBadge = clearAppBadge'),
        'app-shell.js must export clearAppBadge to MoneyApp',
      );

      // Verify message event handlers
      assert.ok(
        appShellJs.includes("e.data.action === 'updateBadge'"),
        'app-shell.js message listener must handle updateBadge',
      );
      assert.ok(
        appShellJs.includes("e.data.action === 'clearBadge'"),
        'app-shell.js message listener must handle clearBadge',
      );
    });

    it('verifies js/shared.js exposes requestAppBadgeUpdate and requestAppBadgeClear bridge dispatchers', () => {
      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(sharedJs.includes('function requestAppBadgeUpdate'), 'shared.js must define requestAppBadgeUpdate');
      assert.ok(sharedJs.includes('function requestAppBadgeClear'), 'shared.js must define requestAppBadgeClear');
      assert.ok(
        sharedJs.includes('requestAppBadgeUpdate: requestAppBadgeUpdate'),
        'shared.js must export requestAppBadgeUpdate on MoneyApp',
      );
      assert.ok(
        sharedJs.includes('requestAppBadgeClear: requestAppBadgeClear'),
        'shared.js must export requestAppBadgeClear on MoneyApp',
      );
    });

    it('verifies document.title badge fallback, count sanitization, and clearing logic in app shell sandbox', () => {
      const appShellJs = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');

      // Extract badging functions
      const computeMatch = appShellJs.match(/function computeBadgeCount\(\)\s*\{[\s\S]*?\n\}/);
      const updateMatch = appShellJs.match(/function updateAppBadge\(count\)\s*\{[\s\S]*?\n\}/);
      const clearMatch = appShellJs.match(/function clearAppBadge\(\)\s*\{[\s\S]*?\n\}/);
      const applyTitleMatch = appShellJs.match(/function applyDocumentTitleWithBadge\(baseTitle\)\s*\{[\s\S]*?\n\}/);

      assert.ok(computeMatch, 'computeBadgeCount must be extractable');
      assert.ok(updateMatch, 'updateAppBadge must be extractable');
      assert.ok(clearMatch, 'clearAppBadge must be extractable');
      assert.ok(applyTitleMatch, 'applyDocumentTitleWithBadge must be extractable');

      const statusDotClasses = new Set();
      let badgeSetCount = null;
      let badgeCleared = false;

      const mockDoc = {
        title: 'Money Superapp — แดชบอร์ด',
        getElementById: (id) => {
          if (id === 'pwaStatusDot') {
            return {
              classList: {
                toggle: (cls, condition) => {
                  if (condition) statusDotClasses.add(cls);
                  else statusDotClasses.delete(cls);
                },
                remove: (cls) => statusDotClasses.delete(cls),
              },
            };
          }
          return null;
        },
      };

      const mockNav = {
        setAppBadge: async (val) => {
          badgeSetCount = val;
        },
        clearAppBadge: async () => {
          badgeCleared = true;
        },
      };

      const sandbox = {
        console,
        document: mockDoc,
        navigator: mockNav,
        Number,
        Date,
        Math,
        currentAppBadgeCount: 0,
        localStorage: {
          getItem: () => null,
        },
      };

      const vm = createContext(sandbox);
      const code = `
        ${applyTitleMatch[0]}
        ${computeMatch[0]}
        ${updateMatch[0]}
        ${clearMatch[0]}
      `;
      new Script(code).runInContext(vm);

      // Test 1: updateAppBadge with positive count
      const activeCount = new Script('updateAppBadge(3);').runInContext(vm);
      assert.equal(activeCount, 3);
      assert.equal(sandbox.document.title, '(3) Money Superapp — แดชบอร์ด');
      assert.equal(statusDotClasses.has('has-badge'), true);
      assert.equal(badgeSetCount, 3);

      // Test 2: count sanitization with float / string
      new Script("updateAppBadge('5.8');").runInContext(vm);
      assert.equal(sandbox.document.title, '(5) Money Superapp — แดชบอร์ด');
      assert.equal(badgeSetCount, 5);

      // Test 3: count 0 clears title and dot
      new Script('updateAppBadge(0);').runInContext(vm);
      assert.equal(sandbox.document.title, 'Money Superapp — แดชบอร์ด');
      assert.equal(statusDotClasses.has('has-badge'), false);

      // Test 4: clearAppBadge clears title and calls clearAppBadge
      new Script('updateAppBadge(2);').runInContext(vm);
      assert.equal(sandbox.document.title, '(2) Money Superapp — แดชบอร์ด');
      new Script('clearAppBadge();').runInContext(vm);
      assert.equal(sandbox.document.title, 'Money Superapp — แดชบอร์ด');
      assert.equal(statusDotClasses.has('has-badge'), false);
      assert.equal(badgeCleared, true);
    });
  });

  describe('Phase 129: IndexedDB Tiered Storage Engine Contracts', () => {
    it('verifies js/engines/storage-db.js exists and exports createStorageDB factory and MoneyApp.Storage', () => {
      const storageDbPath = path.join(ROOT_DIR, 'js/engines/storage-db.js');
      assert.ok(fs.existsSync(storageDbPath), 'js/engines/storage-db.js must exist on disk');

      const storageDbContent = fs.readFileSync(storageDbPath, 'utf8');
      assert.ok(storageDbContent.length > 500, 'storage-db.js must not be empty');
      assert.ok(
        storageDbContent.includes('function createStorageDB'),
        'storage-db.js must define createStorageDB factory function',
      );
      assert.ok(
        storageDbContent.includes('MoneyApp.Storage = storageDbInstance;') ||
          storageDbContent.includes('MoneyApp.Storage = defaultStorage;') ||
          storageDbContent.includes('MoneyApp.Storage ='),
        'storage-db.js must export MoneyApp.Storage',
      );
      assert.ok(
        storageDbContent.includes('MoneyApp.StorageDB = createStorageDB;') ||
          storageDbContent.includes('MoneyApp.StorageDB = defaultStorage;'),
        'storage-db.js must export MoneyApp.StorageDB',
      );
      assert.ok(
        storageDbContent.includes('migrateFromLocalStorage'),
        'storage-db.js must provide migrateFromLocalStorage helper',
      );
      assert.ok(storageDbContent.includes('exportAll'), 'storage-db.js must provide exportAll bulk helper');
      assert.ok(storageDbContent.includes('importAll'), 'storage-db.js must provide importAll bulk helper');
      assert.ok(storageDbContent.includes('estimate'), 'storage-db.js must provide estimate quota helper');
    });

    it('verifies index.html loads js/engines/storage-db.js before vault-crypto.js', () => {
      const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(
        indexHtml.includes('<script src="js/engines/storage-db.js"></script>'),
        'index.html must include script tag for js/engines/storage-db.js',
      );
      const storageIdx = indexHtml.indexOf('<script src="js/engines/storage-db.js"></script>');
      const vaultIdx = indexHtml.indexOf('<script src="js/engines/vault-crypto.js"></script>');
      assert.ok(storageIdx !== -1, 'storage-db.js script must be present in index.html');
      assert.ok(vaultIdx !== -1, 'vault-crypto.js script must be present in index.html');
      assert.ok(storageIdx < vaultIdx, 'storage-db.js must be loaded before vault-crypto.js');
    });

    it('verifies sw.js precaches ./js/engines/storage-db.js', () => {
      const swJs = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(
        swJs.includes("'./js/engines/storage-db.js'") || swJs.includes('"./js/engines/storage-db.js"'),
        'sw.js ASSETS_TO_CACHE must include ./js/engines/storage-db.js',
      );
    });

    it('verifies js/shared.js integrates MoneyApp.Storage and MoneyApp.StorageDB fallback bounds', () => {
      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(
        sharedJs.includes('Storage: Storage') || sharedJs.includes('Storage:'),
        'js/shared.js must expose Storage on MoneyApp',
      );
      assert.ok(
        sharedJs.includes('StorageDB: Storage') || sharedJs.includes('StorageDB:'),
        'js/shared.js must expose StorageDB on MoneyApp',
      );
    });
  });

  describe('Phase 130: Sequence of Returns Risk (SRR) & Dynamic SWR Retirement Simulator Contracts', () => {
    it('verifies js/engines/monte-carlo.js defines and exports findSafeWithdrawalRate and compareWithdrawalStrategies', () => {
      const monteCarloPath = path.join(ROOT_DIR, 'js/engines/monte-carlo.js');
      assert.ok(fs.existsSync(monteCarloPath), 'js/engines/monte-carlo.js must exist on disk');

      const content = fs.readFileSync(monteCarloPath, 'utf8');
      assert.ok(
        content.includes('function findSafeWithdrawalRate'),
        'monte-carlo.js must define findSafeWithdrawalRate',
      );
      assert.ok(
        content.includes('function compareWithdrawalStrategies'),
        'monte-carlo.js must define compareWithdrawalStrategies',
      );
      assert.ok(
        content.includes('MoneyApp.findSafeWithdrawalRate = findSafeWithdrawalRate;'),
        'monte-carlo.js must export findSafeWithdrawalRate to MoneyApp',
      );
      assert.ok(
        content.includes('MoneyApp.compareWithdrawalStrategies = compareWithdrawalStrategies;'),
        'monte-carlo.js must export compareWithdrawalStrategies to MoneyApp',
      );
      assert.ok(
        content.includes('findSafeWithdrawalRate,') && content.includes('compareWithdrawalStrategies,'),
        'monte-carlo.js module.exports must include findSafeWithdrawalRate and compareWithdrawalStrategies',
      );
    });

    it('verifies findSafeWithdrawalRate returns valid SWR schema within realistic bound', () => {
      const monteCarloJs = fs.readFileSync(path.join(ROOT_DIR, 'js/engines/monte-carlo.js'), 'utf8');
      const sandbox = { console, Math, Number, Array };
      const vm = createContext(sandbox);
      new Script(monteCarloJs).runInContext(vm);

      const findSwr = sandbox.MoneyApp?.findSafeWithdrawalRate || sandbox.findSafeWithdrawalRate;
      assert.equal(typeof findSwr, 'function', 'findSafeWithdrawalRate must be callable');

      const swrResult = findSwr(
        {
          initialPortfolio: 10000000,
          years: 30,
          meanReturn: 0.07,
          volatility: 0.1,
          inflation: 0.025,
          trials: 100,
          seed: 42,
        },
        90,
      );

      assert.ok(typeof swrResult.safeWithdrawalRate === 'number');
      assert.ok(typeof swrResult.annualWithdrawal === 'number');
      assert.ok(typeof swrResult.survivalProbability === 'number');
      assert.ok(typeof swrResult.iterations === 'number');
      assert.ok(swrResult.safeWithdrawalRate >= 3.0 && swrResult.safeWithdrawalRate <= 5.0);
      assert.ok(swrResult.annualWithdrawal > 0);
      assert.ok(swrResult.survivalProbability >= 90);
    });

    it('verifies compareWithdrawalStrategies executes all 3 dynamic strategies under identical seed', () => {
      const monteCarloJs = fs.readFileSync(path.join(ROOT_DIR, 'js/engines/monte-carlo.js'), 'utf8');
      const sandbox = { console, Math, Number, Array };
      const vm = createContext(sandbox);
      new Script(monteCarloJs).runInContext(vm);

      const compareFn = sandbox.MoneyApp?.compareWithdrawalStrategies || sandbox.compareWithdrawalStrategies;
      assert.equal(typeof compareFn, 'function', 'compareWithdrawalStrategies must be callable');

      const comp = compareFn({
        initialPortfolio: 10000000,
        annualWithdrawal: 400000,
        years: 25,
        meanReturn: 0.07,
        volatility: 0.12,
        inflation: 0.025,
        sequenceShock: 'early-bear',
        trials: 100,
        seed: 777,
      });

      assert.ok(comp.constant, 'constant strategy result must be present');
      assert.ok(comp.guytonKlinger, 'guytonKlinger strategy result must be present');
      assert.ok(comp.variableSpending, 'variableSpending strategy result must be present');
      assert.ok(comp.srrComparison, 'srrComparison must be present');
      assert.equal(comp.srrComparison.shockApplied, true);
      assert.ok(['constant', 'guyton-klinger', 'variable-spending'].includes(comp.srrComparison.bestSurvivalStrategy));
    });
  });

  describe('Phase 131: Accessible Screen-Reader Live Regions (MoneyApp.announce) & WCAG Contracts', () => {
    it('verifies MoneyApp.announce contract is exported and callable', () => {
      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      const sandbox = { console };
      const vm = createContext(sandbox);
      new Script(sharedJs).runInContext(vm);

      assert.equal(typeof sandbox.MoneyApp?.announce, 'function');
      assert.equal(typeof sandbox.announce, 'function');
      assert.equal(sandbox.MoneyApp.announce('Test Announcement', 'polite'), 'Test Announcement');
    });

    it('verifies theme.css provides :focus-visible ring and .sr-only utility', () => {
      const css = fs.readFileSync(path.join(ROOT_DIR, 'css/theme.css'), 'utf8');
      assert.ok(css.includes(':focus-visible'), 'css/theme.css must declare :focus-visible');
      assert.ok(css.includes('.sr-only'), 'css/theme.css must declare .sr-only');
      assert.ok(css.includes('position: absolute'), '.sr-only must position absolute');
      assert.ok(css.includes('clip: rect(0, 0, 0, 0)'), '.sr-only must have clip rect');
    });

    it('verifies key KPI cards in tax and remaining calculators feature aria-live and role="status"', () => {
      const taxHtml = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      assert.ok(taxHtml.includes('id="taxRefundCard"') && taxHtml.includes('aria-live="polite"'));
      assert.ok(taxHtml.includes('id="cardNetPayable"') && taxHtml.includes('aria-live="polite"'));

      const remHtml = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      assert.ok(remHtml.includes('id="kpiRemaining"') && remHtml.includes('aria-live="polite"'));
      assert.ok(remHtml.includes('id="kpiEmergency"') && remHtml.includes('aria-live="polite"'));
    });
  });

  describe('Phase 141: Native Zero-Dependency Code Coverage Reporting Contracts', () => {
    it('verifies package.json declares valid test:coverage script with native Node test coverage', () => {
      const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
      assert.ok(pkgJson.scripts['test:coverage'], 'package.json must declare test:coverage script');
      assert.strictEqual(
        pkgJson.scripts['test:coverage'],
        'node --test --experimental-test-coverage tests/**/*.test.mjs',
        'test:coverage script must invoke node --test with native --experimental-test-coverage',
      );
    });
  });

  describe('Phase 142: Unified GitHub Actions CI Pipeline Contracts', () => {
    it('verifies .github/workflows/ci.yml includes npm run test:budget and npm run test:coverage', () => {
      const ciPath = path.join(ROOT_DIR, '.github/workflows/ci.yml');
      assert.ok(fs.existsSync(ciPath), '.github/workflows/ci.yml must exist');
      const ciContent = fs.readFileSync(ciPath, 'utf8');
      assert.ok(ciContent.includes('npm run test:budget'), 'CI workflow must execute npm run test:budget');
      assert.ok(ciContent.includes('npm run test:coverage'), 'CI workflow must execute npm run test:coverage');
    });
  });

  describe('Phase 143: First-Time Onboarding Wizard & Archetype Contracts', () => {
    it('verifies index.html declares #onboardingArchetypes container and 3 selectable archetype buttons with accessibility attributes', () => {
      const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(indexHtml.includes('id="onboardingArchetypes"'), 'index.html must define #onboardingArchetypes');
      assert.ok(indexHtml.includes('role="tablist"'), '#onboardingArchetypes must have role="tablist"');
      assert.ok(indexHtml.includes('id="btn-archetype-salaried"'), 'index.html must define #btn-archetype-salaried');
      assert.ok(indexHtml.includes('id="btn-archetype-freelance"'), 'index.html must define #btn-archetype-freelance');
      assert.ok(indexHtml.includes('id="btn-archetype-investor"'), 'index.html must define #btn-archetype-investor');

      assert.ok(
        indexHtml.includes('id="btn-archetype-salaried" role="tab" aria-selected="true"'),
        '#btn-archetype-salaried must have role="tab" and aria-selected="true" by default',
      );
      assert.ok(
        indexHtml.includes('id="btn-archetype-freelance" role="tab" aria-selected="false"'),
        '#btn-archetype-freelance must have role="tab" and aria-selected="false" by default',
      );
      assert.ok(
        indexHtml.includes('id="btn-archetype-investor" role="tab" aria-selected="false"'),
        '#btn-archetype-investor must have role="tab" and aria-selected="false" by default',
      );

      assert.ok(indexHtml.includes('data-i18n="archetypeSelectorTitle"'), 'Selector title must define data-i18n');
      assert.ok(indexHtml.includes('data-i18n="archetypeSalariedTitle"'), 'Salaried title must define data-i18n');
      assert.ok(indexHtml.includes('data-i18n="archetypeSalariedDesc"'), 'Salaried desc must define data-i18n');
      assert.ok(indexHtml.includes('data-i18n="archetypeFreelanceTitle"'), 'Freelance title must define data-i18n');
      assert.ok(indexHtml.includes('data-i18n="archetypeFreelanceDesc"'), 'Freelance desc must define data-i18n');
      assert.ok(indexHtml.includes('data-i18n="archetypeInvestorTitle"'), 'Investor title must define data-i18n');
      assert.ok(indexHtml.includes('data-i18n="archetypeInvestorDesc"'), 'Investor desc must define data-i18n');

      assert.ok(indexHtml.includes('id="onboarding-step-1"'), 'Must define #onboarding-step-1');
      assert.ok(indexHtml.includes('id="onboarding-step-2"'), 'Must define #onboarding-step-2');
      assert.ok(indexHtml.includes('id="onboarding-step-3"'), 'Must define #onboarding-step-3');
    });

    it('verifies js/app-shell.js defines complete bilingual archetype dictionary keys and start-CTA formatter', () => {
      const appShellJs = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');
      const match = appShellJs.match(/const\s+translations\s*=\s*(\{[\s\S]*?\n\};)/);
      assert.ok(match, 'app-shell.js must define translations object');

      const fn = new Function(`return ${match[1]}`);
      const t = fn();

      const requiredKeys = [
        'archetypeSelectorTitle',
        'archetypeSalariedTitle',
        'archetypeSalariedDesc',
        'archetypeFreelanceTitle',
        'archetypeFreelanceDesc',
        'archetypeInvestorTitle',
        'archetypeInvestorDesc',
        'btnStartWithArchetype',
      ];

      for (const k of requiredKeys) {
        assert.ok(t.th[k], `translations.th must define ${k}`);
        assert.ok(t.en[k], `translations.en must define ${k}`);
      }

      assert.strictEqual(typeof t.th.btnStartWithArchetype, 'function');
      assert.strictEqual(typeof t.en.btnStartWithArchetype, 'function');

      assert.strictEqual(t.th.btnStartWithArchetype('พนักงานประจำ'), '🚀 เริ่มต้นด้วยเส้นทางพนักงานประจำ');
      assert.strictEqual(t.en.btnStartWithArchetype('Salaried Employee'), '🚀 Start with Salaried Employee');
    });

    it('verifies selectOnboardingArchetype, startOnboardingWithArchetype, and closeOnboardingModal exports & behavior', () => {
      const appShellJs = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');

      assert.ok(appShellJs.includes('function selectOnboardingArchetype'), 'Must define selectOnboardingArchetype');
      assert.ok(
        appShellJs.includes('function startOnboardingWithArchetype'),
        'Must define startOnboardingWithArchetype',
      );
      assert.ok(appShellJs.includes('function closeOnboardingModal'), 'Must define closeOnboardingModal');
      assert.ok(
        appShellJs.includes("localStorage.setItem('moneySuperapp.onboardingComplete', 'true')"),
        'closeOnboardingModal must set moneySuperapp.onboardingComplete',
      );
      assert.ok(
        appShellJs.includes('MoneyApp.selectOnboardingArchetype = selectOnboardingArchetype'),
        'Must export selectOnboardingArchetype to MoneyApp',
      );
      assert.ok(appShellJs.includes('CANONICAL_STORAGE_SCHEMAS'), 'CANONICAL_STORAGE_SCHEMAS must be declared');
      assert.ok(
        appShellJs.includes("'moneySuperapp.onboardingComplete':"),
        'CANONICAL_STORAGE_SCHEMAS must register moneySuperapp.onboardingComplete',
      );
    });

    it('validates state transitions, tab targeting, and announcement execution across all 3 archetypes', () => {
      const appShellJs = fs.readFileSync(path.join(ROOT_DIR, 'js/app-shell.js'), 'utf8');

      const sandboxFn = new Function(
        'mockDoc',
        'mockStorage',
        'mockMoneyApp',
        `
        const document = mockDoc;
        const localStorage = mockStorage;
        const window = { MoneyApp: mockMoneyApp };
        const MoneyApp = mockMoneyApp;
        let currentLang = 'th';

        ${appShellJs.match(/const translations = \{[\s\S]*?\n\};/)[0]}
        ${appShellJs.match(/let currentOnboardingArchetype = 'salaried';[\s\S]*?function closeOnboardingModal\(\) \{[\s\S]*?\n\}/)[0]}

        return {
          selectOnboardingArchetype,
          closeOnboardingModal,
          getArchetype: () => currentOnboardingArchetype,
          getTargetTab: () => currentOnboardingTargetTab,
          setLang: (l) => { currentLang = l; }
        };
        `,
      );

      const elements = {
        'btn-archetype-salaried': {
          style: {},
          setAttribute(k, v) {
            this[k] = v;
          },
        },
        'lbl-archetype-salaried-title': { style: {} },
        'btn-archetype-freelance': {
          style: {},
          setAttribute(k, v) {
            this[k] = v;
          },
        },
        'lbl-archetype-freelance-title': { style: {} },
        'btn-archetype-investor': {
          style: {},
          setAttribute(k, v) {
            this[k] = v;
          },
        },
        'lbl-archetype-investor-title': { style: {} },
        'onboarding-step-1': { style: {} },
        'onboarding-step-2': { style: {} },
        'onboarding-step-3': { style: {} },
        'onboarding-step-4': { style: {} },
        'onboarding-step-5': { style: {} },
        'lbl-btn-get-started': { textContent: '' },
        onboardingModal: { style: { display: 'flex' } },
      };

      const mockDoc = {
        getElementById: (id) => elements[id] || null,
      };
      const mockStorage = {
        store: {},
        setItem(k, v) {
          this.store[k] = String(v);
        },
        getItem(k) {
          return this.store[k] || null;
        },
      };
      const announcements = [];
      const mockMoneyApp = {
        announce: (msg) => announcements.push(msg),
      };

      const runtime = sandboxFn(mockDoc, mockStorage, mockMoneyApp);

      // 1. Salaried Selection
      runtime.selectOnboardingArchetype('salaried');
      assert.strictEqual(runtime.getArchetype(), 'salaried');
      assert.strictEqual(runtime.getTargetTab(), 'months-slips');
      assert.strictEqual(elements['btn-archetype-salaried']['aria-selected'], 'true');
      assert.strictEqual(elements['btn-archetype-freelance']['aria-selected'], 'false');
      assert.strictEqual(elements['onboarding-step-1'].style.borderColor, '#2F8B76');
      assert.strictEqual(elements['lbl-btn-get-started'].textContent, '🚀 เริ่มต้นด้วยเส้นทางพนักงานประจำ');
      assert.strictEqual(announcements[announcements.length - 1], 'เลือกแนวทางการเงิน: พนักงานประจำ');

      // 2. Freelance Selection
      runtime.selectOnboardingArchetype('freelance');
      assert.strictEqual(runtime.getArchetype(), 'freelance');
      assert.strictEqual(runtime.getTargetTab(), 'remaining-money');
      assert.strictEqual(elements['btn-archetype-freelance']['aria-selected'], 'true');
      assert.strictEqual(elements['btn-archetype-salaried']['aria-selected'], 'false');
      assert.strictEqual(elements['onboarding-step-2'].style.borderColor, '#2F8B76');
      assert.strictEqual(elements['lbl-btn-get-started'].textContent, '🚀 เริ่มต้นด้วยเส้นทางฟรีแลนซ์ / ธุรกิจ');
      assert.strictEqual(announcements[announcements.length - 1], 'เลือกแนวทางการเงิน: ฟรีแลนซ์ / ธุรกิจ');

      // 3. Investor Selection (in English mode)
      runtime.setLang('en');
      runtime.selectOnboardingArchetype('investor');
      assert.strictEqual(runtime.getArchetype(), 'investor');
      assert.strictEqual(runtime.getTargetTab(), 'rebalance');
      assert.strictEqual(elements['btn-archetype-investor']['aria-selected'], 'true');
      assert.strictEqual(elements['btn-archetype-freelance']['aria-selected'], 'false');
      assert.strictEqual(elements['onboarding-step-3'].style.borderColor, '#2F8B76');
      assert.strictEqual(elements['lbl-btn-get-started'].textContent, '🚀 Start with Investor / Debt-Free');
      assert.strictEqual(announcements[announcements.length - 1], 'Selected focus: Investor / Debt-Free');

      // 4. Modal close stores both keys
      runtime.closeOnboardingModal();
      assert.strictEqual(mockStorage.getItem('moneySuperapp.hasSeenOnboarding'), 'true');
      assert.strictEqual(mockStorage.getItem('moneySuperapp.onboardingComplete'), 'true');
    });
  });
});
