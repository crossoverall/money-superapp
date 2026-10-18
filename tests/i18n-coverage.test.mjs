import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { createContext, Script } from 'node:vm';

const ROOT_DIR = process.cwd();

const PAGE_MAPPINGS = [
  { html: 'index.html', js: 'js/app-shell.js' },
  { html: 'dashboard.html', js: 'js/dashboard.js' },
  { html: 'rebalance.html', js: 'js/rebalance.js' },
  { html: 'months-slips.html', js: 'js/months-slips.js' },
  { html: 'tax-calculator-base.html', js: 'js/tax-calculator-base.js' },
  { html: 'tax-calculator.html', js: 'js/tax-calculator.js' },
  { html: 'remaining-money.html', js: 'js/remaining-money.js' },
  { html: 'debt-calculator.html', js: 'js/debt-calculator.js' },
];

function loadCoreAndCentralDictionaries() {
  const coreCode = fs.readFileSync(path.join(ROOT_DIR, 'js/engines/i18n-core.js'), 'utf8');
  const thCode = fs.readFileSync(path.join(ROOT_DIR, 'js/i18n/th.js'), 'utf8');
  const enCode = fs.readFileSync(path.join(ROOT_DIR, 'js/i18n/en.js'), 'utf8');

  const sandbox = {
    console,
    Math,
    Number,
    String,
    window: {},
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);

  new Script(coreCode).runInContext(context);
  new Script(thCode).runInContext(context);
  new Script(enCode).runInContext(context);

  return { sandbox, context };
}

function extractTranslationsFromJs(jsFile) {
  const content = fs.readFileSync(path.join(ROOT_DIR, jsFile), 'utf8');
  const match = content.match(/const\s+translations\s*=\s*(\{[\s\S]*?\n\};)/);
  if (!match) {
    throw new Error(`Could not find translations in ${jsFile}`);
  }
  const fn = new Function(`return ${match[1]}`);
  return fn();
}

function extractDataI18nKeys(htmlFile) {
  const content = fs.readFileSync(path.join(ROOT_DIR, htmlFile), 'utf8');
  const regex = /data-i18n(?:-placeholder|-title|-aria-label)?=["']([^"']+)["']/g;
  const keys = new Set();
  let match = regex.exec(content);
  while (match !== null) {
    keys.add(match[1]);
    match = regex.exec(content);
  }
  return Array.from(keys);
}

describe('Exhaustive Translation Coverage & Declarative DOM Invariants (Phase 105)', () => {
  const { sandbox } = loadCoreAndCentralDictionaries();
  const I18n = sandbox.MoneyApp.I18n;
  const centralTh = sandbox.MoneyApp.i18n.th;
  const centralEn = sandbox.MoneyApp.i18n.en;

  for (const { html, js } of PAGE_MAPPINGS) {
    describe(`${html} + ${js}`, () => {
      const pageTranslations = extractTranslationsFromJs(js);
      const htmlKeys = extractDataI18nKeys(html);

      const mergedTh = { ...I18n.getDictionary('th'), ...centralTh, ...pageTranslations.th };
      const mergedEn = { ...I18n.getDictionary('en'), ...centralEn, ...pageTranslations.en };

      it(`proves every data-i18n key in ${html} (${htmlKeys.length} keys) exists in Thai dictionary`, () => {
        const missingInTh = htmlKeys.filter((k) => mergedTh[k] === undefined);
        assert.deepEqual(missingInTh, [], `Keys in ${html} missing from Thai translations: ${missingInTh.join(', ')}`);
      });

      it(`proves every data-i18n key in ${html} (${htmlKeys.length} keys) exists in English dictionary`, () => {
        const missingInEn = htmlKeys.filter((k) => mergedEn[k] === undefined);
        assert.deepEqual(
          missingInEn,
          [],
          `Keys in ${html} missing from English translations: ${missingInEn.join(', ')}`,
        );
      });

      it(`proves all referenced keys in ${html} resolve to non-empty valid strings in both languages`, () => {
        for (const k of htmlKeys) {
          const valTh = mergedTh[k];
          const valEn = mergedEn[k];

          assert.ok(
            typeof valTh === 'string' || typeof valTh === 'function',
            `Key "${k}" in ${html} must resolve to string or function in Thai`,
          );
          assert.ok(
            typeof valEn === 'string' || typeof valEn === 'function',
            `Key "${k}" in ${html} must resolve to string or function in English`,
          );

          if (typeof valTh === 'string') {
            assert.ok(valTh.trim().length > 0, `Key "${k}" in ${html} has empty string in Thai`);
          }
          if (typeof valEn === 'string') {
            assert.ok(valEn.trim().length > 0, `Key "${k}" in ${html} has empty string in English`);
          }
        }
      });

      it(`proves template variable placeholders {param} are consistent between TH and EN for ${html}`, () => {
        const extractParams = (str) => {
          if (typeof str !== 'string') return [];
          const matches = str.match(/\{([a-zA-Z0-9_-]+)\}/g) || [];
          return matches.sort();
        };

        for (const k of htmlKeys) {
          const valTh = mergedTh[k];
          const valEn = mergedEn[k];
          if (typeof valTh === 'string' && typeof valEn === 'string') {
            const thParams = extractParams(valTh);
            const enParams = extractParams(valEn);
            assert.deepEqual(
              thParams,
              enParams,
              `Template parameter mismatch for key "${k}" in ${html}: th has ${JSON.stringify(thParams)}, en has ${JSON.stringify(enParams)}`,
            );
          }
        }
      });
    });
  }
});
