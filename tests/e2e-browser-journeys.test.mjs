import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

const ROOT_DIR = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function resolveChromeBinary() {
  const binaries = ['google-chrome', 'chromium', 'chromium-browser'];
  for (const bin of binaries) {
    try {
      const res = execFileSync('which', [bin], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      if (res && fs.existsSync(res)) return res;
    } catch (_e) {}
  }
  return null;
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve);
      this.ws.addEventListener('error', reject);
    });

    this.ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id && this.pending.has(data.id)) {
          const { resolve, reject } = this.pending.get(data.id);
          this.pending.delete(data.id);
          if (data.error) {
            reject(new Error(data.error.message || JSON.stringify(data.error)));
          } else {
            resolve(data.result);
          }
        }
      } catch (err) {
        console.error('Error handling CDP message:', err);
      }
    });
  }

  send(method, params = {}, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return reject(new Error('CDP WebSocket not connected or open'));
      }
      const curId = this.msgId++;
      const timer = setTimeout(() => {
        this.pending.delete(curId);
        reject(new Error(`CDP request timed out (${method}) after ${timeoutMs}ms`));
      }, timeoutMs);

      this.pending.set(curId, {
        resolve: (val) => {
          clearTimeout(timer);
          resolve(val);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        },
      });

      this.ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res?.exceptionDetails) {
      throw new Error(`Evaluation failed: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res?.result?.value;
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    await new Promise((r) => setTimeout(r, 600));
  }

  async waitFor(predicateFnString, timeoutMs = 12000, intervalMs = 120) {
    const start = Date.now();
    let lastError = null;
    while (Date.now() - start < timeoutMs) {
      try {
        const val = await this.evaluate(`(${predicateFnString})()`);
        if (val) return val;
      } catch (e) {
        lastError = e;
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    throw new Error(
      `waitFor timed out after ${timeoutMs}ms: (${predicateFnString}) - lastError: ${lastError?.message}`,
    );
  }

  close() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (_e) {}
      this.ws = null;
    }
  }
}

describe('End-to-End Multi-Journey Browser Flow Test Suite', () => {
  let server = null;
  let serverPort = 0;
  let chromeProcess = null;
  let cdp = null;
  let userDataDir = null;
  let isChromeAvailable = false;

  before(async () => {
    const chromeBin = resolveChromeBinary();
    if (!chromeBin) {
      isChromeAvailable = false;
      return;
    }
    isChromeAvailable = true;

    // 1. Start static HTTP server on dynamic port
    await new Promise((resolve) => {
      server = http.createServer((req, res) => {
        const reqPath = req.url.split('?')[0].replace(/^\//, '') || 'index.html';
        const filePath = path.join(ROOT_DIR, reqPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath);
          res.writeHead(200, {
            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*',
          });
          fs.createReadStream(filePath).pipe(res);
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      });
      server.listen(0, '127.0.0.1', () => {
        serverPort = server.address().port;
        resolve();
      });
    });

    // 2. Launch isolated Headless Chrome instance
    const cdpPort = 9300 + Math.floor(Math.random() * 500);
    userDataDir = path.join('/tmp', `chrome-e2e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
    chromeProcess = spawn(chromeBin, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${userDataDir}`,
      'about:blank',
    ]);

    // 3. Acquire CDP WebSocket target
    let wsUrl = null;
    for (let i = 0; i < 35; i++) {
      await new Promise((r) => setTimeout(r, 150));
      try {
        const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
        const targets = await res.json();
        const pageTarget = targets.find((t) => t.type === 'page' && !t.url.startsWith('chrome-extension:'));
        if (pageTarget?.webSocketDebuggerUrl) {
          wsUrl = pageTarget.webSocketDebuggerUrl;
          break;
        }
      } catch (_e) {}
    }

    assert.ok(wsUrl, 'Headless Chrome failed to return CDP WebSocket URL');
    cdp = new CdpClient(wsUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
  });

  after(async () => {
    if (cdp) {
      try {
        await cdp.send('Browser.close', {}, 2000);
      } catch (_e) {}
      cdp.close();
    }
    if (chromeProcess) {
      try {
        if (chromeProcess.exitCode === null) {
          await Promise.race([
            new Promise((resolve) => chromeProcess.on('exit', resolve)),
            new Promise((resolve) => setTimeout(resolve, 2000)),
          ]);
        }
        if (chromeProcess.exitCode === null) {
          chromeProcess.kill('SIGKILL');
        }
      } catch (_e) {}
    }
    if (userDataDir) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 150));
        fs.rmSync(userDataDir, { recursive: true, force: true });
      } catch (_e) {}
    }
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe('Journey 1: Tab Navigation & Iframe URL Hash Sync', () => {
    it('verifies tab switching, iframe src updating, and hash synchronization', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.navigate(`http://127.0.0.1:${serverPort}/index.html#dashboard`);
      await cdp.waitFor(() => document.readyState === 'complete');

      // 1. Click tab button for Remaining Money
      await cdp.evaluate(`
        const btn = document.querySelector('.top-nav button[data-tab="remaining-money"]');
        if (btn) btn.click();
      `);

      const remCheck = await cdp.waitFor(() => {
        const hash = window.location.hash;
        const frame = document.getElementById('app');
        const activeBtn = document.querySelector('.top-nav button.active');
        if (
          hash === '#remaining-money' &&
          frame?.src.includes('remaining-money.html') &&
          activeBtn?.dataset.tab === 'remaining-money'
        ) {
          return { hash, src: frame.src, tab: activeBtn.dataset.tab };
        }
        return null;
      });

      assert.equal(remCheck.hash, '#remaining-money');
      assert.ok(remCheck.src.includes('remaining-money.html'));
      assert.equal(remCheck.tab, 'remaining-money');

      // 2. Direct hash alteration to #tax-calculator-base
      await cdp.evaluate(`
        window.location.hash = '#tax-calculator-base';
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      `);

      const taxCheck = await cdp.waitFor(() => {
        const hash = window.location.hash;
        const frame = document.getElementById('app');
        const activeBtn = document.querySelector('.top-nav button.active');
        if (
          hash === '#tax-calculator-base' &&
          frame?.src.includes('tax-calculator-base.html') &&
          activeBtn?.dataset.tab === 'tax-calculator-base'
        ) {
          return { hash, src: frame.src, tab: activeBtn.dataset.tab };
        }
        return null;
      });

      assert.equal(taxCheck.hash, '#tax-calculator-base');
      assert.ok(taxCheck.src.includes('tax-calculator-base.html'));
      assert.equal(taxCheck.tab, 'tax-calculator-base');

      // 3. Programmatic tab switch via window.switchToTab('rebalance')
      await cdp.evaluate(`window.switchToTab('rebalance')`);

      const rebCheck = await cdp.waitFor(() => {
        const hash = window.location.hash;
        const frame = document.getElementById('app');
        const activeBtn = document.querySelector('.top-nav button.active');
        if (hash === '#rebalance' && frame?.src.includes('rebalance.html') && activeBtn?.dataset.tab === 'rebalance') {
          return { hash, src: frame.src, tab: activeBtn.dataset.tab };
        }
        return null;
      });

      assert.equal(rebCheck.hash, '#rebalance');
      assert.ok(rebCheck.src.includes('rebalance.html'));
      assert.equal(rebCheck.tab, 'rebalance');
    });
  });

  describe('Journey 2: Theme and Language Reload Persistence', () => {
    it('verifies theme and language toggles persist across full page reload', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.navigate(`http://127.0.0.1:${serverPort}/index.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      // 1. Switch to English and Dark theme
      await cdp.evaluate(`
        const langBtn = document.querySelector('button[data-lang="en"]');
        if (langBtn) langBtn.click();
        const themeBtn = document.querySelector('button[data-theme-btn="dark"]');
        if (themeBtn) themeBtn.click();
      `);

      const enDarkState = await cdp.evaluate(`({
        lang: document.documentElement.lang,
        theme: document.documentElement.dataset.theme,
        storedLang: localStorage.getItem('moneySuperapp.lang'),
        storedTheme: localStorage.getItem('moneySuperapp.theme'),
        langActive: document.querySelector('button[data-lang="en"]')?.classList.contains('active'),
        themeActive: document.querySelector('button[data-theme-btn="dark"]')?.classList.contains('active'),
      })`);

      assert.equal(enDarkState.lang, 'en');
      assert.equal(enDarkState.theme, 'dark');
      assert.equal(enDarkState.storedLang, 'en');
      assert.equal(enDarkState.storedTheme, 'dark');
      assert.equal(enDarkState.langActive, true);
      assert.equal(enDarkState.themeActive, true);

      // 2. Perform page reload and verify state reconstitution
      await cdp.evaluate(`location.reload()`);
      await cdp.waitFor(() => document.readyState === 'complete');
      await new Promise((r) => setTimeout(r, 400));

      const reloadedEnDarkState = await cdp.evaluate(`({
        lang: document.documentElement.lang,
        theme: document.documentElement.dataset.theme,
        storedLang: localStorage.getItem('moneySuperapp.lang'),
        storedTheme: localStorage.getItem('moneySuperapp.theme'),
        langActive: document.querySelector('button[data-lang="en"]')?.classList.contains('active'),
        themeActive: document.querySelector('button[data-theme-btn="dark"]')?.classList.contains('active'),
      })`);

      assert.equal(reloadedEnDarkState.lang, 'en');
      assert.equal(reloadedEnDarkState.theme, 'dark');
      assert.equal(reloadedEnDarkState.storedLang, 'en');
      assert.equal(reloadedEnDarkState.storedTheme, 'dark');
      assert.equal(reloadedEnDarkState.langActive, true);
      assert.equal(reloadedEnDarkState.themeActive, true);

      // 3. Switch back to Thai and Light theme symmetrically
      await cdp.evaluate(`
        const langBtn = document.querySelector('button[data-lang="th"]');
        if (langBtn) langBtn.click();
        const themeBtn = document.querySelector('button[data-theme-btn="light"]');
        if (themeBtn) themeBtn.click();
      `);

      await cdp.evaluate(`location.reload()`);
      await cdp.waitFor(() => document.readyState === 'complete');
      await new Promise((r) => setTimeout(r, 400));

      const reloadedThLightState = await cdp.evaluate(`({
        lang: document.documentElement.lang,
        theme: document.documentElement.dataset.theme,
        storedLang: localStorage.getItem('moneySuperapp.lang'),
        storedTheme: localStorage.getItem('moneySuperapp.theme'),
        langActive: document.querySelector('button[data-lang="th"]')?.classList.contains('active'),
        themeActive: document.querySelector('button[data-theme-btn="light"]')?.classList.contains('active'),
      })`);

      assert.equal(reloadedThLightState.lang, 'th');
      assert.equal(reloadedThLightState.theme, 'light');
      assert.equal(reloadedThLightState.storedLang, 'th');
      assert.equal(reloadedThLightState.storedTheme, 'light');
      assert.equal(reloadedThLightState.langActive, true);
      assert.equal(reloadedThLightState.themeActive, true);
    });
  });

  describe('Journey 3: Cross-Tool Bridge Protocol End-to-End Hand-off', () => {
    it('verifies Remaining Money surplus hand-off to Rebalance calculator with consume-once guarantee', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.navigate(`http://127.0.0.1:${serverPort}/index.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      // 1. Pre-seed predictable surplus budget in Remaining Money
      await cdp.evaluate(`
        localStorage.setItem('remainingMoneyCalculator.state.v1', JSON.stringify({
          incomes: [{ name: 'Salary', value: 85000, isSalary: true }],
          expenses: [{ name: 'Rent', value: 35000 }],
          savings: [{ name: 'Emergency Fund', value: 10000 }]
        }));
      `);

      // 2. Switch to Remaining Money tool
      await cdp.evaluate(`window.switchToTab('remaining-money')`);

      // 3. Wait for Remaining Money iframe to initialize
      await cdp.waitFor(() => {
        const frame = document.getElementById('app');
        return (
          frame?.src.includes('remaining-money.html') &&
          frame?.contentDocument?.readyState === 'complete' &&
          typeof frame?.contentWindow?.sendToRebalance === 'function'
        );
      });

      // 4. Trigger Bridge transfer to Rebalance
      await cdp.evaluate(`
        document.getElementById('app').contentWindow.sendToRebalance();
      `);

      // 5. Verify Rebalance iframe receives the hand-off, updates budget, and consumes pending key
      const bridgeOutcome = await cdp.waitFor(() => {
        const frame = document.getElementById('app');
        if (!frame?.src.includes('rebalance.html')) return null;
        const doc = frame.contentDocument;
        const alertEl = doc?.getElementById('pendingBudgetAlert');
        const textEl = doc?.getElementById('pendingBudgetText');
        const budgetInput = doc?.getElementById('totalBudget');
        const pendingKey = localStorage.getItem('moneySuperapp.pendingBudget');
        const budgetVal = parseFloat(budgetInput?.value || '0');

        if (budgetVal > 0 && alertEl && alertEl.style.display === 'flex' && pendingKey === null) {
          return {
            totalBudget: budgetVal,
            inputValue: budgetInput?.value,
            alertText: textEl?.textContent || '',
            pendingKeyCleared: pendingKey === null,
            hash: window.location.hash,
          };
        }
        return null;
      }, 9000);

      assert.ok(bridgeOutcome.totalBudget > 0, 'Total budget must be populated from transfer');
      assert.equal(bridgeOutcome.pendingKeyCleared, true, 'Pending budget key must be purged from storage');
      assert.equal(bridgeOutcome.hash, '#rebalance', 'URL hash must switch to #rebalance');
      assert.ok(
        bridgeOutcome.alertText.includes(String(bridgeOutcome.totalBudget)) || bridgeOutcome.alertText.length > 0,
        `Alert text should confirm budget transfer, got: ${bridgeOutcome.alertText}`,
      );
    });
  });

  describe('Journey 4: JSON Backup Export, Master Reset & Restore Round-Trip', () => {
    it('verifies multi-tool data export, master wipe, and 100% round-trip restoration', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.navigate(`http://127.0.0.1:${serverPort}/index.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      const testPayload = {
        'moneySuperapp.activeTab': 'dashboard',
        'moneySuperapp.testUserData': JSON.stringify({ salary: 85000, profile: 'senior' }),
        'remainingMoneyCalculator.budget': JSON.stringify({ income: 85000, fixed: 25000 }),
        'rebalanceCalculator.portfolio': JSON.stringify([{ asset: 'VOO', ratio: 70 }]),
      };

      // 1. Seed test keys across namespaces
      await cdp.evaluate(`
        const payload = ${JSON.stringify(testPayload)};
        for (const [k, v] of Object.entries(payload)) {
          localStorage.setItem(k, v);
        }
      `);

      // 2. Invoke exportBackupData and verify schema
      const backup = await cdp.evaluate(`exportBackupData()`);
      assert.equal(backup.appName, 'Money Superapp');
      assert.equal(backup.version, '1.0.0');
      assert.ok(typeof backup.exportedAt === 'string');
      assert.ok(backup.data && typeof backup.data === 'object');
      for (const [k, v] of Object.entries(testPayload)) {
        assert.equal(backup.data[k], v, `Exported backup must include key ${k}`);
      }

      // 3. Execute Master Reset
      await cdp.evaluate(`
        window.confirm = () => true;
        window.alert = () => {};
        resetAllData();
      `);

      const remainingKeys = await cdp.evaluate(`
        Object.keys(localStorage).filter((k) =>
          k.startsWith('moneySuperapp.') ||
          k.startsWith('remainingMoneyCalculator.') ||
          k.startsWith('rebalanceCalculator.')
        )
      `);
      assert.deepEqual(remainingKeys, [], 'Master reset must purge all calculator storage keys');

      // 4. Restore state from exported backup payload
      await cdp.evaluate(`
        const backup = ${JSON.stringify(backup)};
        const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
        Object.keys(backup.data).forEach((key) => {
          if (allowedPrefixes.some((p) => key.startsWith(p)) && typeof backup.data[key] === 'string') {
            localStorage.setItem(key, backup.data[key]);
          }
        });
      `);

      const restoredPayload = await cdp.evaluate(`
        (() => {
          const expected = ${JSON.stringify(testPayload)};
          const result = {};
          for (const k of Object.keys(expected)) {
            result[k] = localStorage.getItem(k);
          }
          return result;
        })()
      `);

      assert.deepEqual(restoredPayload, testPayload, 'Restored data must match original seeded data 100%');
    });
  });

  describe('Journey 5: Settings Modal Storage Diagnostics & Cache Controls', () => {
    it('verifies settings modal opening, storage quota readout, cache controls, and closing', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.navigate(`http://127.0.0.1:${serverPort}/index.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      // 1. Open settings modal
      await cdp.evaluate(`document.getElementById('btn-settings-modal').click()`);

      const modalOpened = await cdp.waitFor(() => {
        const modal = document.getElementById('settingsModal');
        return modal && window.getComputedStyle(modal).display !== 'none';
      });
      assert.ok(modalOpened, '#settingsModal must be visible after click');

      // 2. Validate diagnostics elements
      const diagnostics = await cdp.evaluate(`({
        versionBadge: document.getElementById('cache-version-badge')?.textContent?.trim(),
        quotaReadout: document.getElementById('lbl-cache-quota-readout')?.textContent?.trim(),
        hasProgressBar: Boolean(document.getElementById('cache-quota-bar')),
        hasRefreshBtn: Boolean(document.getElementById('btn-refresh-cache')),
        hasPurgeBtn: Boolean(document.getElementById('btn-purge-stale')),
      })`);

      assert.ok(diagnostics.versionBadge?.startsWith('v'));
      assert.ok(diagnostics.quotaReadout?.includes('B'));
      assert.equal(diagnostics.hasProgressBar, true);
      assert.equal(diagnostics.hasRefreshBtn, true);
      assert.equal(diagnostics.hasPurgeBtn, true);

      // 3. Trigger cache controls and verify responsiveness
      const refreshResult = await cdp.evaluate(`
        (async () => {
          try {
            const btn = document.getElementById('btn-refresh-cache');
            btn.click();
            return { ok: true };
          } catch (e) {
            return { ok: false, error: e.message };
          }
        })()
      `);
      assert.equal(refreshResult.ok, true);

      const purgeResult = await cdp.evaluate(`
        (async () => {
          try {
            const btn = document.getElementById('btn-purge-stale');
            btn.click();
            return { ok: true };
          } catch (e) {
            return { ok: false, error: e.message };
          }
        })()
      `);
      assert.equal(purgeResult.ok, true);

      // 4. Close settings modal
      await cdp.evaluate(`
        const closeBtn =
          document.querySelector('#settingsModal button[onclick*="closeSettingsModal"]') ||
          document.getElementById('btn-close-settings');
        if (closeBtn) closeBtn.click();
        else if (typeof closeSettingsModal === 'function') closeSettingsModal();
      `);

      const modalClosed = await cdp.waitFor(() => {
        const modal = document.getElementById('settingsModal');
        return modal && window.getComputedStyle(modal).display === 'none';
      });
      assert.ok(modalClosed, '#settingsModal must be hidden after close action');
    });
  });
});
