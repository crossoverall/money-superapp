import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createContext, Script } from 'node:vm';

function loadI18n() {
  const code = readFileSync(resolve('js/engines/i18n-core.js'), 'utf8');
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
  new Script(code).runInContext(context);
  return sandbox.MoneyApp?.I18n;
}

test('I18n core engine exports cleanly to MoneyApp namespace', () => {
  const i18n = loadI18n();
  assert.ok(i18n, 'MoneyApp.I18n should be defined');
  assert.equal(typeof i18n.register, 'function');
  assert.equal(typeof i18n.getDictionary, 'function');
  assert.equal(typeof i18n.setLanguage, 'function');
  assert.equal(typeof i18n.getLanguage, 'function');
  assert.equal(typeof i18n.t, 'function');
  assert.equal(typeof i18n.applyLocalization, 'function');
});

test('I18n base dictionaries have 100% key symmetry between Thai and English', () => {
  const i18n = loadI18n();
  const th = i18n.getDictionary('th');
  const en = i18n.getDictionary('en');

  const thKeys = Object.keys(th).sort();
  const enKeys = Object.keys(en).sort();

  assert.deepEqual(thKeys, enKeys, 'Base dictionaries th and en must have identical keys (zero translation drift)');
});

test('t() resolves keys, supports language override and fallbacks', () => {
  const i18n = loadI18n();
  i18n.setLanguage('th');

  assert.equal(i18n.t('actionSave'), 'บันทึก');
  assert.equal(i18n.t('actionSave', null, null, 'en'), 'Save');

  i18n.setLanguage('en');
  assert.equal(i18n.t('actionSave'), 'Save');
  assert.equal(i18n.t('actionSave', null, null, 'th'), 'บันทึก');

  // Fallback to provided string
  assert.equal(i18n.t('unknownKey123', 'Default Fallback'), 'Default Fallback');
  // Fallback to key itself
  assert.equal(i18n.t('unknownKey123'), 'unknownKey123');
});

test('t() performs named parameter interpolation safely', () => {
  const i18n = loadI18n();
  i18n.register('th', {
    welcomeMessage: 'ยินดีต้อนรับ {name}! คุณมี {count} รายการ',
  });
  i18n.register('en', {
    welcomeMessage: 'Welcome {name}! You have {count} items',
  });

  const thRes = i18n.t('welcomeMessage', '', { name: 'Somchai', count: 5 }, 'th');
  assert.equal(thRes, 'ยินดีต้อนรับ Somchai! คุณมี 5 รายการ');

  const enRes = i18n.t('welcomeMessage', '', { name: 'John', count: 12 }, 'en');
  assert.equal(enRes, 'Welcome John! You have 12 items');
});

test('applyLocalization translates elements declaratively across all supported data attributes', () => {
  const code = readFileSync(resolve('js/engines/i18n-core.js'), 'utf8');

  class FakeElement {
    constructor(attrs = {}) {
      this.attrs = attrs;
      this.textContent = '';
      this.placeholder = '';
      this.title = '';
    }
    getAttribute(name) {
      return this.attrs[name] || null;
    }
    setAttribute(name, val) {
      this.attrs[name] = val;
    }
  }

  const textEl = new FakeElement({ 'data-i18n': 'actionSave' });
  const inputEl = new FakeElement({ 'data-i18n-placeholder': 'actionReset' });
  const btnEl = new FakeElement({ 'data-i18n-title': 'actionExport' });
  const ariaEl = new FakeElement({ 'data-i18n-aria-label': 'toolbarFoldAll' });

  const fakeDocument = {
    querySelectorAll(selector) {
      if (selector === '[data-i18n]') return [textEl];
      if (selector === '[data-i18n-placeholder]') return [inputEl];
      if (selector === '[data-i18n-title]') return [btnEl];
      if (selector === '[data-i18n-aria-label]') return [ariaEl];
      return [];
    },
  };

  const sandbox = {
    console,
    document: fakeDocument,
    Math,
    Number,
    String,
    window: {},
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);

  const i18n = sandbox.MoneyApp.I18n;

  // Apply Thai
  i18n.applyLocalization(fakeDocument, 'th');
  assert.equal(textEl.textContent, 'บันทึก');
  assert.equal(inputEl.placeholder, 'รีเซ็ตข้อมูล');
  assert.equal(btnEl.title, 'สำรองข้อมูล (JSON)');
  assert.equal(ariaEl.attrs['aria-label'], '▼ ย่อทั้งหมด');

  // Switch to English
  i18n.applyLocalization(fakeDocument, 'en');
  assert.equal(textEl.textContent, 'Save');
  assert.equal(inputEl.placeholder, 'Reset Data');
  assert.equal(btnEl.title, 'Backup (JSON)');
  assert.equal(ariaEl.attrs['aria-label'], '▼ Fold All');
});
