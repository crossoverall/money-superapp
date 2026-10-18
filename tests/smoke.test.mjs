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

    it('verifies MoneyApp exports detectAndParseThaiBankStatement', () => {
      const sharedContent = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');
      assert.ok(
        sharedContent.includes('detectAndParseThaiBankStatement: detectAndParseThaiBankStatement'),
        'MoneyApp must export detectAndParseThaiBankStatement',
      );
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

      // Verify layout order: bucketsContainer -> targetDateGlidepath -> thaiGold -> foreignTaxAdvisor -> howto
      const idxBuckets = rebalHtml.indexOf('id="bucketsContainer"');
      const idxGlidepath = rebalHtml.indexOf('id="panelTargetDateGlidepath"');
      const idxGold = rebalHtml.indexOf('id="panelThaiGold"');
      const idxForeign = rebalHtml.indexOf('id="panelForeignTaxAdvisor"');
      const idxHowto = rebalHtml.indexOf('id="howto"');
      assert.ok(idxBuckets !== -1 && idxGlidepath !== -1 && idxGold !== -1 && idxForeign !== -1 && idxHowto !== -1);
      assert.ok(idxBuckets < idxGlidepath, '#bucketsContainer must precede auxiliary panels');
      assert.ok(idxGlidepath < idxGold, '#panelTargetDateGlidepath must precede #panelThaiGold');
      assert.ok(idxGold < idxForeign, '#panelThaiGold must precede #panelForeignTaxAdvisor');
      assert.ok(idxForeign < idxHowto, '#panelForeignTaxAdvisor must precede #howto');

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
  });
});
