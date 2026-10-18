import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

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
  });
});
