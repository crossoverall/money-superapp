import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createContext, Script } from 'node:vm';

function loadI18nDictionaries() {
  const coreCode = readFileSync(resolve('js/engines/i18n-core.js'), 'utf8');
  const thCode = readFileSync(resolve('js/i18n/th.js'), 'utf8');
  const enCode = readFileSync(resolve('js/i18n/en.js'), 'utf8');

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

  return {
    th: sandbox.MoneyApp?.i18n?.th,
    en: sandbox.MoneyApp?.i18n?.en,
    I18n: sandbox.MoneyApp?.I18n,
  };
}

test('Both th.js and en.js export cleanly to MoneyApp.i18n namespace', () => {
  const { th, en } = loadI18nDictionaries();
  assert.ok(th, 'MoneyApp.i18n.th must be defined');
  assert.ok(en, 'MoneyApp.i18n.en must be defined');
  assert.equal(typeof th, 'object');
  assert.equal(typeof en, 'object');
});

test('Proves 100% key symmetry between js/i18n/th.js and js/i18n/en.js (zero translation drift)', () => {
  const { th, en } = loadI18nDictionaries();

  const thKeys = Object.keys(th).sort();
  const enKeys = Object.keys(en).sort();

  const missingInEn = thKeys.filter((k) => !enKeys.includes(k));
  const missingInTh = enKeys.filter((k) => !thKeys.includes(k));

  assert.deepEqual(missingInEn, [], `Keys present in th.js but missing in en.js: ${missingInEn.join(', ')}`);
  assert.deepEqual(missingInTh, [], `Keys present in en.js but missing in th.js: ${missingInTh.join(', ')}`);
  assert.equal(thKeys.length, enKeys.length, 'Key counts must be identical');
  assert.ok(thKeys.length >= 60, 'Should contain extensive dictionary keys');
});

test('All translation values are valid non-empty strings without whitespace anomalies', () => {
  const { th, en } = loadI18nDictionaries();

  for (const [k, v] of Object.entries(th)) {
    assert.equal(typeof v, 'string', `th key "${k}" must have string value`);
    assert.ok(v.trim().length > 0, `th key "${k}" must not be empty`);
  }

  for (const [k, v] of Object.entries(en)) {
    assert.equal(typeof v, 'string', `en key "${k}" must have string value`);
    assert.ok(v.trim().length > 0, `en key "${k}" must not be empty`);
  }
});

test('Parameter placeholders {param} match identically between th.js and en.js', () => {
  const { th, en } = loadI18nDictionaries();
  const extractParams = (str) => {
    const matches = str.match(/\{([a-zA-Z0-9_-]+)\}/g) || [];
    return matches.sort();
  };

  for (const key of Object.keys(th)) {
    const thParams = extractParams(th[key]);
    const enParams = extractParams(en[key]);
    assert.deepEqual(
      thParams,
      enParams,
      `Parameter placeholders mismatch for key "${key}": th has ${JSON.stringify(thParams)}, en has ${JSON.stringify(enParams)}`,
    );
  }
});

test('Dictionaries automatically register with MoneyApp.I18n engine', () => {
  const { I18n } = loadI18nDictionaries();
  assert.ok(I18n, 'MoneyApp.I18n should be loaded');

  // Verify can resolve keys from both languages
  assert.equal(I18n.t('dashKpiNetworth', '', null, 'th'), 'ความมั่งคั่งสุทธิ (Net Worth)');
  assert.equal(I18n.t('dashKpiNetworth', '', null, 'en'), 'Net Worth');
  assert.equal(I18n.t('debtSnowballName', '', null, 'th'), 'กลยุทธ์ Snowball (หนี้น้อยหมดก่อน)');
  assert.equal(I18n.t('debtSnowballName', '', null, 'en'), 'Snowball Method (Lowest Balance First)');
});
