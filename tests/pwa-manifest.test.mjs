import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

const ROOT_DIR = process.cwd();

describe('Phase 110: Web App Manifest & Lighthouse PWA 100 Audit Suite', () => {
  const manifestPath = path.join(ROOT_DIR, 'manifest.json');
  const swPath = path.join(ROOT_DIR, 'sw.js');
  const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
  const appShellPath = path.join(ROOT_DIR, 'js/app-shell.js');

  let manifest = null;

  it('verifies manifest.json exists, is valid JSON, and contains core W3C identity fields', () => {
    assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist in root directory');
    const content = fs.readFileSync(manifestPath, 'utf8');
    assert.doesNotThrow(() => {
      manifest = JSON.parse(content);
    }, 'manifest.json must parse without syntax error');

    assert.equal(manifest.id, 'money-superapp', 'Manifest must define unique app identity id');
    assert.equal(manifest.name, 'Money Superapp', 'Manifest name must match brand');
    assert.equal(manifest.short_name, 'MoneyApp', 'Manifest short_name must be concise');
    assert.equal(manifest.lang, 'th-TH', 'Manifest default lang must be th-TH');
    assert.equal(manifest.dir, 'ltr', 'Manifest text direction must be ltr');
    assert.equal(manifest.start_url, './index.html', 'start_url must point to ./index.html');
    assert.equal(manifest.scope, './', 'scope must be root ./');
    assert.equal(manifest.display, 'standalone', 'display must be standalone for PWA window mode');
    assert.equal(manifest.orientation, 'any', 'orientation must be any');
    assert.equal(manifest.background_color, '#0f172a', 'background_color must match slate-900 theme');
    assert.equal(manifest.theme_color, '#0d9488', 'theme_color must match teal-600 core brand');
    assert.ok(
      Array.isArray(manifest.categories) && manifest.categories.includes('finance'),
      'categories must include finance',
    );
  });

  it('verifies manifest icons configuration and disk presence', () => {
    assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'manifest.icons must be a non-empty array');
    for (const icon of manifest.icons) {
      assert.ok(icon.src, 'Icon must define src path');
      assert.ok(icon.sizes, 'Icon must define sizes');
      assert.ok(icon.type, 'Icon must define MIME type');
      const iconPath = path.join(ROOT_DIR, icon.src);
      assert.ok(fs.existsSync(iconPath), `Icon asset on disk must exist: ${icon.src}`);
    }
  });

  it('verifies manifest shortcuts structure, target hash routes, and icon existence', () => {
    assert.ok(Array.isArray(manifest.shortcuts), 'manifest.shortcuts must be an array');
    assert.ok(manifest.shortcuts.length >= 4, 'Must provide at least 4 app shortcuts');

    const expectedRoutes = [
      './index.html#dashboard',
      './index.html#remaining-money',
      './index.html#rebalance',
      './index.html#tax-calculator-base',
    ];

    const shortcutUrls = manifest.shortcuts.map((s) => s.url);
    for (const expectedUrl of expectedRoutes) {
      assert.ok(shortcutUrls.includes(expectedUrl), `Shortcut for ${expectedUrl} must be defined in manifest`);
    }

    for (const shortcut of manifest.shortcuts) {
      assert.ok(shortcut.name && shortcut.name.trim().length > 0, 'Shortcut must have non-empty name');
      assert.ok(shortcut.short_name && shortcut.short_name.trim().length > 0, 'Shortcut must have short_name');
      assert.ok(shortcut.url?.startsWith('./index.html#'), 'Shortcut URL must target an index.html hash route');
      assert.ok(Array.isArray(shortcut.icons) && shortcut.icons.length > 0, 'Shortcut must specify icon array');

      for (const icon of shortcut.icons) {
        const iconPath = path.join(ROOT_DIR, icon.src);
        assert.ok(fs.existsSync(iconPath), `Shortcut icon file must exist: ${icon.src}`);
      }
    }
  });

  it('verifies manifest rich screenshot descriptors (wide and narrow form factors)', () => {
    assert.ok(Array.isArray(manifest.screenshots), 'manifest.screenshots must be an array');
    assert.ok(manifest.screenshots.length >= 2, 'Must specify at least 2 screenshots');

    const wide = manifest.screenshots.find((s) => s.form_factor === 'wide');
    const narrow = manifest.screenshots.find((s) => s.form_factor === 'narrow');

    assert.ok(wide, 'Manifest must provide a wide form_factor screenshot for desktop install preview');
    assert.equal(wide.sizes, '1280x720', 'Wide screenshot must have 1280x720 desktop dimensions');
    assert.equal(wide.type, 'image/svg+xml', 'Wide screenshot must have image/svg+xml MIME type');
    assert.ok(wide.label && wide.label.length > 0, 'Wide screenshot must provide descriptive accessibility label');

    assert.ok(narrow, 'Manifest must provide a narrow form_factor screenshot for mobile install preview');
    assert.equal(narrow.sizes, '390x844', 'Narrow screenshot must have 390x844 mobile dimensions');
    assert.equal(narrow.type, 'image/svg+xml', 'Narrow screenshot must have image/svg+xml MIME type');
    assert.ok(
      narrow.label && narrow.label.length > 0,
      'Narrow screenshot must provide descriptive accessibility label',
    );

    // Check files on disk
    for (const shot of [wide, narrow]) {
      const shotPath = path.join(ROOT_DIR, shot.src);
      assert.ok(fs.existsSync(shotPath), `Screenshot file must exist: ${shot.src}`);
      const svgContent = fs.readFileSync(shotPath, 'utf8');
      assert.ok(svgContent.includes('<svg'), `Screenshot must be a valid SVG vector: ${shot.src}`);
      assert.ok(svgContent.includes('viewBox='), `Screenshot SVG must include viewBox: ${shot.src}`);
    }
  });

  it('verifies Service Worker ASSETS_TO_CACHE precaches manifest and preview screenshots', () => {
    assert.ok(fs.existsSync(swPath), 'sw.js must exist');
    const swContent = fs.readFileSync(swPath, 'utf8');

    assert.ok(swContent.includes("'./manifest.json'"), 'sw.js must cache manifest.json');
    assert.ok(swContent.includes("'./icon.svg'"), 'sw.js must cache icon.svg');
    assert.ok(swContent.includes("'./screenshots/desktop.svg'"), 'sw.js must cache desktop screenshot');
    assert.ok(swContent.includes("'./screenshots/mobile.svg'"), 'sw.js must cache mobile screenshot');

    // Extract all items from ASSETS_TO_CACHE array in sw.js and verify disk existence
    const match = swContent.match(/const\s+ASSETS_TO_CACHE\s*=\s*\[([\s\S]*?)\];/);
    assert.ok(match, 'ASSETS_TO_CACHE must be defined in sw.js');

    const assetEntries = match[1]
      .split('\n')
      .map((line) => line.trim().replace(/^['"]|['"],?$/g, ''))
      .filter((line) => line.length > 0 && !line.startsWith('//'));

    assert.ok(assetEntries.length >= 35, 'ASSETS_TO_CACHE must cover application assets');
    for (const entry of assetEntries) {
      if (entry === './') {
        assert.ok(fs.existsSync(path.join(ROOT_DIR, 'index.html')), 'Root cache entry ./ maps to index.html');
      } else {
        const cleanPath = entry.replace(/^\.\//, '');
        const fullPath = path.join(ROOT_DIR, cleanPath);
        assert.ok(fs.existsSync(fullPath), `Asset specified in ASSETS_TO_CACHE must exist on disk: ${entry}`);
      }
    }
  });

  it('verifies App Shell index.html contains PWA install button and offline status badge', () => {
    assert.ok(fs.existsSync(indexHtmlPath), 'index.html must exist');
    const html = fs.readFileSync(indexHtmlPath, 'utf8');

    // Install button in topbar
    assert.ok(html.includes('id="btn-pwa-install"'), 'index.html must define #btn-pwa-install');
    assert.ok(html.includes('id="lbl-pwa-install"'), 'index.html must define #lbl-pwa-install');
    assert.ok(html.includes('onclick="installPwa()"'), 'install button must trigger installPwa()');
    assert.ok(html.includes('class="btn-pwa-install"'), 'install button must have .btn-pwa-install class');

    // Offline badge in privacy footer
    assert.ok(html.includes('id="pwaOfflineBadge"'), 'index.html must define #pwaOfflineBadge');
    assert.ok(html.includes('id="pwaStatusDot"'), 'index.html must define #pwaStatusDot');
    assert.ok(html.includes('id="lbl-pwa-offline-badge"'), 'index.html must define #lbl-pwa-offline-badge');
  });

  it('verifies js/app-shell.js integrates PWA install prompt lifecycle and network status updates', () => {
    assert.ok(fs.existsSync(appShellPath), 'js/app-shell.js must exist');
    const shellContent = fs.readFileSync(appShellPath, 'utf8');

    assert.ok(shellContent.includes('beforeinstallprompt'), 'app-shell.js must listen for beforeinstallprompt');
    assert.ok(shellContent.includes('appinstalled'), 'app-shell.js must listen for appinstalled');
    assert.ok(shellContent.includes('function installPwa'), 'app-shell.js must define installPwa()');
    assert.ok(shellContent.includes('function updateNetworkStatus'), 'app-shell.js must define updateNetworkStatus()');
    assert.ok(shellContent.includes("window.addEventListener('online'"), 'app-shell.js must listen for online event');
    assert.ok(shellContent.includes("window.addEventListener('offline'"), 'app-shell.js must listen for offline event');

    // Verify bilingual dictionary keys for PWA controls
    for (const key of ['pwaInstallBtn', 'pwaInstallTitle', 'pwaOfflineReady', 'pwaOfflineMode']) {
      assert.ok(shellContent.includes(`${key}:`), `app-shell.js translations must define ${key}`);
    }
  });
});
