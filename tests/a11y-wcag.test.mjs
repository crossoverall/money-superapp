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

describe('Phase 131: Accessible Screen-Reader Live Regions & WCAG 2.1 Accessibility Suite', () => {
  describe('1. HTML Standard Accessibility Landmarks & Metadata', () => {
    for (const page of CORE_HTML_PAGES) {
      it(`verifies ${page} declares lang attribute, title tag, and mobile viewport meta tag`, () => {
        const filePath = path.join(ROOT_DIR, page);
        assert.ok(fs.existsSync(filePath), `${page} must exist on disk`);

        const content = fs.readFileSync(filePath, 'utf8');
        assert.match(
          content,
          /<html\s+[^>]*\blang=["'][a-z]{2}(-[A-Z]{2})?["']/i,
          `${page} must specify lang attribute`,
        );
        assert.match(content, /<title>[^<]+<\/title>/i, `${page} must include non-empty <title> tag`);
        assert.match(content, /<meta\s+[^>]*\bname=["']viewport["']/i, `${page} must include mobile viewport meta tag`);
      });
    }
  });

  describe('2. Design System Focus Rings & Screen Reader Utilities (css/theme.css)', () => {
    const themeCssPath = path.join(ROOT_DIR, 'css', 'theme.css');
    assert.ok(fs.existsSync(themeCssPath), 'css/theme.css must exist');
    const themeContent = fs.readFileSync(themeCssPath, 'utf8');

    it('declares WCAG 2.1 compliant :focus-visible outline styling for interactive controls', () => {
      assert.ok(themeContent.includes(':focus-visible'), 'css/theme.css must declare :focus-visible');
      assert.ok(
        themeContent.includes('outline: 2px solid var(--core, #2F8B76)') ||
          themeContent.includes('outline: 2px solid var(--core'),
        'css/theme.css must declare 2px focus ring outline',
      );
      assert.ok(themeContent.includes('outline-offset: 2px'), 'css/theme.css must declare 2px outline-offset');
      assert.ok(themeContent.includes('button:focus-visible'), 'button:focus-visible must be explicitly targeted');
      assert.ok(themeContent.includes('input:focus-visible'), 'input:focus-visible must be explicitly targeted');
    });

    it('declares standard .sr-only utility class with clip rect and 1px dimensions', () => {
      assert.ok(themeContent.includes('.sr-only'), 'css/theme.css must declare .sr-only class');
      assert.ok(themeContent.includes('width: 1px'), '.sr-only must specify 1px width');
      assert.ok(themeContent.includes('height: 1px'), '.sr-only must specify 1px height');
      assert.ok(themeContent.includes('clip: rect(0, 0, 0, 0)'), '.sr-only must specify clip rect');
    });
  });

  describe('3. Dynamic Screen-Reader Live Region Announcer (MoneyApp.announce)', () => {
    it('verifies js/shared.js implements and exports announce function', () => {
      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'shared.js'), 'utf8');
      assert.ok(sharedJs.includes('function announce('), 'js/shared.js must define announce function');
      assert.ok(sharedJs.includes('announce: announce'), 'js/shared.js must expose announce on MoneyApp');
      assert.ok(sharedJs.includes('global.announce = announce'), 'js/shared.js must expose global.announce');
    });

    it('creates #a11y-announcer live region with polite priority and updates text content in DOM', () => {
      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'shared.js'), 'utf8');

      // Mock DOM Sandbox
      const createdElements = [];
      const mockAnnouncer = {
        id: '',
        className: '',
        attributes: new Map(),
        textContent: '',
        setAttribute(k, v) {
          this.attributes.set(k, v);
        },
        getAttribute(k) {
          return this.attributes.get(k) || null;
        },
      };

      const mockDoc = {
        body: {
          appendChild(el) {
            createdElements.push(el);
          },
        },
        getElementById(id) {
          if (id === 'a11y-announcer') {
            return mockAnnouncer.id === 'a11y-announcer' ? mockAnnouncer : null;
          }
          return null;
        },
        createElement(tag) {
          if (tag === 'div') {
            return mockAnnouncer;
          }
          return {};
        },
      };

      const sandbox = {
        console,
        document: mockDoc,
        setTimeout,
        clearTimeout,
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      sandbox.window = sandbox;
      sandbox.global = sandbox;

      const vm = createContext(sandbox);
      new Script(sharedJs).runInContext(vm);

      const announceFn = sandbox.MoneyApp?.announce;
      assert.equal(typeof announceFn, 'function', 'MoneyApp.announce must be a function');

      // 1. Initial polite announcement
      const el = announceFn('คำนวณภาษีเสร็จสมบูรณ์', 'polite');
      assert.equal(el.id, 'a11y-announcer');
      assert.equal(el.className, 'sr-only');
      assert.equal(el.getAttribute('aria-live'), 'polite');
      assert.equal(el.getAttribute('aria-atomic'), 'true');
      assert.equal(el.textContent, 'คำนวณภาษีเสร็จสมบูรณ์');
      assert.equal(createdElements.length, 1);

      // 2. Subsequent assertive announcement updates existing element
      const elAssertive = announceFn('เกิดข้อผิดพลาดในการโหลด', 'assertive');
      assert.equal(elAssertive.getAttribute('aria-live'), 'assertive');
      assert.equal(elAssertive.textContent, 'เกิดข้อผิดพลาดในการโหลด');
      assert.equal(createdElements.length, 1, 'Must reuse existing announcer element rather than duplicating');
    });

    it('returns announcement text gracefully in non-DOM environments', () => {
      const sharedJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'shared.js'), 'utf8');
      const sandbox = { console };
      const vm = createContext(sandbox);
      new Script(sharedJs).runInContext(vm);

      const announceFn = sandbox.MoneyApp?.announce;
      const res = announceFn('Headless announcement');
      assert.equal(res, 'Headless announcement');
    });
  });

  describe('4. Dynamic KPI Live Regions in Calculation Tools', () => {
    it('verifies tax-calculator-base.html declares aria-live="polite" and role="status" on tax summary cards', () => {
      const taxContent = fs.readFileSync(path.join(ROOT_DIR, 'tax-calculator-base.html'), 'utf8');
      assert.ok(taxContent.includes('id="taxRefundCard"'), 'tax-calculator-base.html must contain #taxRefundCard');
      assert.ok(taxContent.includes('id="cardNetPayable"'), 'tax-calculator-base.html must contain #cardNetPayable');

      // Check aria-live and role
      assert.match(
        taxContent,
        /<div[^>]*id=["']taxRefundCard["'][^>]*aria-live=["']polite["'][^>]*role=["']status["']|<div[^>]*id=["']taxRefundCard["'][^>]*role=["']status["'][^>]*aria-live=["']polite["']/,
        '#taxRefundCard must have aria-live="polite" and role="status"',
      );
      assert.match(
        taxContent,
        /<div[^>]*id=["']cardNetPayable["'][^>]*aria-live=["']polite["'][^>]*role=["']status["']|<div[^>]*id=["']cardNetPayable["'][^>]*role=["']status["'][^>]*aria-live=["']polite["']/,
        '#cardNetPayable must have aria-live="polite" and role="status"',
      );
    });

    it('verifies remaining-money.html declares aria-live="polite" and role="status" on KPI remaining and emergency cards', () => {
      const remContent = fs.readFileSync(path.join(ROOT_DIR, 'remaining-money.html'), 'utf8');
      assert.ok(remContent.includes('id="kpiRemaining"'), 'remaining-money.html must contain #kpiRemaining');
      assert.ok(remContent.includes('id="kpiEmergency"'), 'remaining-money.html must contain #kpiEmergency');

      assert.match(
        remContent,
        /<div[^>]*id=["']kpiRemaining["'][^>]*aria-live=["']polite["'][^>]*role=["']status["']|<div[^>]*id=["']kpiRemaining["'][^>]*role=["']status["'][^>]*aria-live=["']polite["']/,
        '#kpiRemaining must have aria-live="polite" and role="status"',
      );
      assert.match(
        remContent,
        /<div[^>]*id=["']kpiEmergency["'][^>]*aria-live=["']polite["'][^>]*role=["']status["']|<div[^>]*id=["']kpiEmergency["'][^>]*role=["']status["'][^>]*aria-live=["']polite["']/,
        '#kpiEmergency must have aria-live="polite" and role="status"',
      );
    });
  });
});
