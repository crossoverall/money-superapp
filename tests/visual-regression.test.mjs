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

  async setViewport({ width, height, deviceScaleFactor = 1, mobile = false }) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor,
      mobile,
    });
    await new Promise((r) => setTimeout(r, 200));
  }

  async waitFor(predicateFnString, timeoutMs = 8000, intervalMs = 120) {
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

describe('Phase 117: Automated Visual Regression & Layout Invariant Suite', () => {
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
        const safePath = path.resolve(ROOT_DIR, reqPath);
        if (safePath.startsWith(ROOT_DIR) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
          const ext = path.extname(safePath);
          res.writeHead(200, {
            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*',
          });
          fs.createReadStream(safePath).pipe(res);
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
    const cdpPort = 9400 + Math.floor(Math.random() * 500);
    userDataDir = path.join('/tmp', `chrome-visual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
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

  describe('Suite 1: Mobile App Shell Layout Invariants (375x667 and 320x568)', () => {
    it('validates mobile layout invariants at 375x667 (zero overflow, topbar bounds, docked bottom nav)', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.setViewport({ width: 375, height: 667, mobile: true, deviceScaleFactor: 1 });
      await cdp.navigate(`http://127.0.0.1:${serverPort}/index.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      const layout = await cdp.evaluate(`(() => {
        const topbarSelectors = {
          '#btn-lang-toggle': '#btn-lang-toggle, .lang-toggle',
          '#btn-theme-toggle': '#btn-theme-toggle, .theme-toggle',
          '#btn-cmd-palette': '#btn-cmd-palette',
          '#btn-help-modal': '#btn-help-modal',
          '#btn-settings-modal': '#btn-settings-modal',
        };
        const topbarRects = {};
        for (const [key, sel] of Object.entries(topbarSelectors)) {
          const el = document.querySelector(sel);
          if (el) {
            const r = el.getBoundingClientRect();
            topbarRects[key] = {
              left: Math.round(r.left),
              right: Math.round(r.right),
              width: Math.round(r.width),
              height: Math.round(r.height),
            };
          } else {
            topbarRects[key] = null;
          }
        }

        const bottomNav = document.querySelector('#bottom-nav, #bottomNav, .bottom-nav');
        const bStyle = bottomNav ? window.getComputedStyle(bottomNav) : null;

        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          topbarRects,
          bottomNav: bottomNav ? {
            offsetHeight: bottomNav.offsetHeight,
            display: bStyle.display,
            visibility: bStyle.visibility,
          } : null,
        };
      })()`);

      assert.ok(
        layout.scrollWidth <= layout.innerWidth,
        `Expected document scrollWidth (${layout.scrollWidth}) <= innerWidth (${layout.innerWidth}) at 375x667`,
      );

      for (const [key, rect] of Object.entries(layout.topbarRects)) {
        assert.ok(rect, `Topbar action element ${key} must exist in DOM`);
        assert.ok(rect.left >= 0, `Topbar action element ${key} left (${rect.left}) must be >= 0`);
        assert.ok(
          rect.right <= layout.innerWidth,
          `Topbar action element ${key} right (${rect.right}) must be <= window.innerWidth (${layout.innerWidth})`,
        );
      }

      assert.ok(layout.bottomNav, 'Bottom nav must exist');
      assert.ok(
        layout.bottomNav.offsetHeight > 0,
        `Bottom nav offsetHeight (${layout.bottomNav.offsetHeight}) must be > 0`,
      );
      assert.notEqual(layout.bottomNav.display, 'none', 'Bottom nav display must not be none on mobile');
    });

    it('validates ultra-narrow mobile layout invariants at 320x568 (zero horizontal overflow, actions within bounds)', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.setViewport({ width: 320, height: 568, mobile: true, deviceScaleFactor: 1 });
      await cdp.navigate(`http://127.0.0.1:${serverPort}/index.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      const layout = await cdp.evaluate(`(() => {
        const topbarSelectors = {
          '#btn-lang-toggle': '#btn-lang-toggle, .lang-toggle',
          '#btn-theme-toggle': '#btn-theme-toggle, .theme-toggle',
          '#btn-cmd-palette': '#btn-cmd-palette',
          '#btn-help-modal': '#btn-help-modal',
          '#btn-settings-modal': '#btn-settings-modal',
        };
        const topbarRects = {};
        for (const [key, sel] of Object.entries(topbarSelectors)) {
          const el = document.querySelector(sel);
          if (el) {
            const r = el.getBoundingClientRect();
            topbarRects[key] = {
              left: Math.round(r.left),
              right: Math.round(r.right),
              width: Math.round(r.width),
              height: Math.round(r.height),
            };
          } else {
            topbarRects[key] = null;
          }
        }

        const bottomNav = document.querySelector('#bottom-nav, #bottomNav, .bottom-nav');
        const bStyle = bottomNav ? window.getComputedStyle(bottomNav) : null;

        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          topbarRects,
          bottomNav: bottomNav ? {
            offsetHeight: bottomNav.offsetHeight,
            display: bStyle.display,
            visibility: bStyle.visibility,
          } : null,
        };
      })()`);

      assert.ok(
        layout.scrollWidth <= layout.innerWidth,
        `Expected document scrollWidth (${layout.scrollWidth}) <= innerWidth (${layout.innerWidth}) at 320x568`,
      );

      for (const [key, rect] of Object.entries(layout.topbarRects)) {
        assert.ok(rect, `Topbar action element ${key} must exist in DOM at 320x568`);
        assert.ok(rect.left >= 0, `Topbar action element ${key} left (${rect.left}) must be >= 0 at 320x568`);
        assert.ok(
          rect.right <= layout.innerWidth,
          `Topbar action element ${key} right (${rect.right}) must be <= window.innerWidth (${layout.innerWidth}) at 320x568`,
        );
      }

      assert.ok(layout.bottomNav, 'Bottom nav must exist at 320x568');
      assert.ok(
        layout.bottomNav.offsetHeight > 0,
        `Bottom nav offsetHeight (${layout.bottomNav.offsetHeight}) must be > 0 at 320x568`,
      );
      assert.notEqual(layout.bottomNav.display, 'none', 'Bottom nav display must not be none at 320x568');
    });
  });

  describe('Suite 2: Tablet & Desktop Viewport Responsive Invariants', () => {
    it('validates tablet viewport at 768x1024 (bottom nav docked, topbar compact, zero overflow)', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.setViewport({ width: 768, height: 1024, mobile: true, deviceScaleFactor: 1 });
      await cdp.navigate(`http://127.0.0.1:${serverPort}/index.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      const state = await cdp.evaluate(`(() => {
        const bottomNav = document.querySelector('#bottom-nav, #bottomNav, .bottom-nav');
        const bStyle = bottomNav ? window.getComputedStyle(bottomNav) : null;
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          bottomNav: bottomNav ? {
            offsetHeight: bottomNav.offsetHeight,
            display: bStyle.display,
          } : null,
        };
      })()`);

      assert.ok(state.scrollWidth <= state.innerWidth, 'No horizontal overflow on tablet 768x1024');
      assert.ok(state.bottomNav && state.bottomNav.offsetHeight > 0, 'Bottom nav must be visible on 768px tablet');
      assert.notEqual(state.bottomNav.display, 'none', 'Bottom nav display !== none on 768px tablet');
    });

    it('validates desktop viewports at 1024x768 and 1280x800 (hidden bottom nav, visible nav tabs, filling iframe)', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      for (const { width, height } of [
        { width: 1024, height: 768 },
        { width: 1280, height: 800 },
      ]) {
        await cdp.setViewport({ width, height, mobile: false, deviceScaleFactor: 1 });
        await cdp.navigate(`http://127.0.0.1:${serverPort}/index.html`);
        await cdp.waitFor(() => document.readyState === 'complete');

        const desktopState = await cdp.evaluate(`(() => {
          const bottomNav = document.querySelector('#bottom-nav, #bottomNav, .bottom-nav');
          const bStyle = bottomNav ? window.getComputedStyle(bottomNav) : null;
          const navTabs = document.querySelector('#nav-tabs, .top-nav');
          const tStyle = navTabs ? window.getComputedStyle(navTabs) : null;
          const iframe = document.getElementById('app');

          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            bottomNavDisplay: bStyle ? bStyle.display : null,
            navTabsVisible: Boolean(navTabs && navTabs.offsetHeight > 0 && tStyle && tStyle.display !== 'none'),
            iframeWidth: iframe ? iframe.offsetWidth : 0,
            iframeHeight: iframe ? iframe.offsetHeight : 0,
          };
        })()`);

        assert.ok(
          desktopState.scrollWidth <= desktopState.innerWidth,
          `No horizontal overflow on desktop ${width}x${height}`,
        );
        assert.equal(desktopState.bottomNavDisplay, 'none', `Bottom nav must be hidden on desktop ${width}x${height}`);
        assert.equal(desktopState.navTabsVisible, true, `Top nav tabs must be visible on desktop ${width}x${height}`);
        assert.ok(
          desktopState.iframeWidth >= width - 50,
          `Iframe width (${desktopState.iframeWidth}) must fill container for ${width}px`,
        );
        assert.ok(
          desktopState.iframeHeight >= 300,
          `Iframe height (${desktopState.iframeHeight}) must fill available viewport height`,
        );
      }
    });
  });

  describe('Suite 3: Child Tool Pages & Side Margin Parity on Mobile', () => {
    it('verifies tax-calculator.html (PVD tax) side margin parity and zero horizontal blowout on mobile 375x667', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.setViewport({ width: 375, height: 667, mobile: true, deviceScaleFactor: 1 });
      await cdp.navigate(`http://127.0.0.1:${serverPort}/tax-calculator.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      const metrics = await cdp.evaluate(`(() => {
        const bodyRect = document.body.getBoundingClientRect();
        const card = document.querySelector('.card');
        const cardRect = card ? card.getBoundingClientRect() : null;
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          bodyWidth: bodyRect.width,
          cardWidth: cardRect ? cardRect.width : 0,
          cardLeft: cardRect ? cardRect.left : 0,
          cardRight: cardRect ? cardRect.right : 0,
        };
      })()`);

      assert.ok(
        metrics.scrollWidth <= metrics.innerWidth,
        `tax-calculator.html scrollWidth (${metrics.scrollWidth}) <= innerWidth (${metrics.innerWidth})`,
      );
      assert.ok(metrics.cardWidth > 0, 'Card container must exist and have non-zero width');
      assert.ok(
        metrics.cardWidth <= metrics.innerWidth,
        `Card width (${metrics.cardWidth}) must be <= window.innerWidth (${metrics.innerWidth})`,
      );
      assert.ok(metrics.cardLeft >= 0, `Card left margin (${metrics.cardLeft}) must be within viewport`);
      assert.ok(
        metrics.cardRight <= metrics.innerWidth,
        `Card right edge (${metrics.cardRight}) must be within viewport`,
      );
    });

    it('verifies dashboard.html side margin parity and zero horizontal blowout on mobile 375x667', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.setViewport({ width: 375, height: 667, mobile: true, deviceScaleFactor: 1 });
      await cdp.navigate(`http://127.0.0.1:${serverPort}/dashboard.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      const metrics = await cdp.evaluate(`(() => {
        const bodyRect = document.body.getBoundingClientRect();
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          bodyWidth: bodyRect.width,
          bodyLeft: bodyRect.left,
          bodyRight: bodyRect.right,
        };
      })()`);

      assert.ok(
        metrics.scrollWidth <= metrics.innerWidth,
        `dashboard.html scrollWidth (${metrics.scrollWidth}) <= innerWidth (${metrics.innerWidth})`,
      );
      assert.ok(
        metrics.bodyWidth <= metrics.innerWidth,
        `dashboard.html bodyWidth (${metrics.bodyWidth}) <= innerWidth (${metrics.innerWidth})`,
      );
      assert.ok(metrics.bodyLeft >= 0, 'dashboard.html body left edge must be >= 0');
      assert.ok(metrics.bodyRight <= metrics.innerWidth, 'dashboard.html body right edge must be <= innerWidth');
    });

    it('verifies all child tool pages (tax, dashboard, rebalance, remaining-money, debt) retain zero blowout on mobile 375x667', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      const childPages = [
        'tax-calculator.html',
        'dashboard.html',
        'rebalance.html',
        'remaining-money.html',
        'debt-calculator.html',
      ];

      for (const page of childPages) {
        await cdp.setViewport({ width: 375, height: 667, mobile: true, deviceScaleFactor: 1 });
        await cdp.navigate(`http://127.0.0.1:${serverPort}/${page}`);
        await cdp.waitFor(() => document.readyState === 'complete');

        const metrics = await cdp.evaluate(`(() => {
          const bodyRect = document.body.getBoundingClientRect();
          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            bodyWidth: bodyRect.width,
            bodyLeft: bodyRect.left,
            bodyRight: bodyRect.right,
          };
        })()`);

        assert.ok(
          metrics.scrollWidth <= metrics.innerWidth,
          `${page} scrollWidth (${metrics.scrollWidth}) <= innerWidth (${metrics.innerWidth}) on mobile 375x667`,
        );
        assert.ok(
          metrics.bodyWidth <= metrics.innerWidth,
          `${page} bodyWidth (${metrics.bodyWidth}) <= innerWidth (${metrics.innerWidth}) on mobile 375x667`,
        );
      }
    });

    it('verifies all child tool pages expand beyond 520px up to 896px without blowout on desktop 1024x768', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      const childPages = [
        'tax-calculator.html',
        'dashboard.html',
        'rebalance.html',
        'remaining-money.html',
        'debt-calculator.html',
      ];

      for (const page of childPages) {
        await cdp.setViewport({ width: 1024, height: 768, mobile: false, deviceScaleFactor: 1 });
        await cdp.navigate(`http://127.0.0.1:${serverPort}/${page}`);
        await cdp.waitFor(() => document.readyState === 'complete');

        const metrics = await cdp.evaluate(`(() => {
          const bodyRect = document.body.getBoundingClientRect();
          const card = document.querySelector('.card, .panel');
          const cardRect = card ? card.getBoundingClientRect() : null;
          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            bodyWidth: Math.round(bodyRect.width),
            bodyLeft: Math.round(bodyRect.left),
            bodyRight: Math.round(bodyRect.right),
            cardWidth: cardRect ? Math.round(cardRect.width) : null,
          };
        })()`);

        assert.ok(
          metrics.scrollWidth <= metrics.innerWidth,
          `${page} scrollWidth (${metrics.scrollWidth}) <= innerWidth (${metrics.innerWidth}) on desktop 1024x768`,
        );
        assert.ok(
          metrics.bodyWidth > 520,
          `${page} bodyWidth (${metrics.bodyWidth}) must expand beyond 520px on desktop 1024x768`,
        );
        assert.ok(
          metrics.bodyWidth <= 896,
          `${page} bodyWidth (${metrics.bodyWidth}) must be <= 896px on desktop 1024x768`,
        );
        if (metrics.cardWidth !== null) {
          assert.ok(
            metrics.cardWidth > 520,
            `${page} card/panel (${metrics.cardWidth}) must expand beyond 520px on desktop 1024x768`,
          );
        }
      }
    });
  });

  describe('Suite 4: SVG Visualizations Geometry & Bounding Rects', () => {
    it('verifies trends SVG chart and donut asset arcs render with non-zero geometry at 1024x768', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.setViewport({ width: 1024, height: 768, mobile: false, deviceScaleFactor: 1 });
      await cdp.navigate(`http://127.0.0.1:${serverPort}/dashboard.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      const viz = await cdp.evaluate(`(() => {
        const svg = document.getElementById('svgChart');
        const svgRect = svg ? svg.getBoundingClientRect() : null;

        const donutCash = document.querySelector('#donutCash, #donutSegCash');
        const donutInvest = document.querySelector('#donutInvest, #donutSegInvest');

        const cashDash = donutCash ? (donutCash.getAttribute('stroke-dasharray') || window.getComputedStyle(donutCash).strokeDasharray) : null;
        const investDash = donutInvest ? (donutInvest.getAttribute('stroke-dasharray') || window.getComputedStyle(donutInvest).strokeDasharray) : null;

        const r = svg ? svg.getBoundingClientRect() : null;
        return {
          hasSvg: Boolean(svg),
          svgWidth: r ? r.width : (svg ? svg.clientWidth : 0),
          svgHeight: r ? r.height : (svg ? svg.clientHeight : 0),
          hasDonutCash: Boolean(donutCash),
          hasDonutInvest: Boolean(donutInvest),
          cashDash,
          investDash,
        };
      })()`);

      assert.equal(viz.hasSvg, true, '#svgChart must exist in dashboard.html');
      assert.ok(viz.svgWidth > 0, `#svgChart width (${viz.svgWidth}) must be > 0`);
      assert.ok(viz.svgHeight > 0, `#svgChart height (${viz.svgHeight}) must be > 0`);

      assert.equal(viz.hasDonutCash, true, 'Cash donut element (#donutCash/#donutSegCash) must exist');
      assert.equal(viz.hasDonutInvest, true, 'Investment donut element (#donutInvest/#donutSegInvest) must exist');

      assert.ok(
        viz.cashDash && viz.cashDash.length > 0 && viz.cashDash !== 'none',
        `Cash donut must have valid stroke-dasharray, got: ${viz.cashDash}`,
      );
      assert.ok(
        viz.investDash && viz.investDash.length > 0 && viz.investDash !== 'none',
        `Invest donut must have valid stroke-dasharray, got: ${viz.investDash}`,
      );
    });
  });

  describe('Suite 5: Headless Screenshot Capture Capability', () => {
    it('captures a valid headless PNG screenshot via Chrome DevTools Protocol', async (t) => {
      if (!isChromeAvailable) {
        t.skip('Chrome/Chromium binary not available on this platform');
        return;
      }

      await cdp.setViewport({ width: 375, height: 667, mobile: true, deviceScaleFactor: 1 });
      await cdp.navigate(`http://127.0.0.1:${serverPort}/index.html`);
      await cdp.waitFor(() => document.readyState === 'complete');

      const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      assert.ok(screenshot && typeof screenshot.data === 'string', 'CDP screenshot must return base64 string data');
      assert.ok(
        screenshot.data.startsWith('iVBORw0KGgo') || Buffer.from(screenshot.data, 'base64').length > 1000,
        'Screenshot data must be a valid PNG base64 stream',
      );
      const buffer = Buffer.from(screenshot.data, 'base64');
      assert.ok(buffer.length > 1000, `Screenshot buffer length (${buffer.length}) must be > 1000 bytes`);
      // Verify PNG magic signature: 0x89 0x50 0x4E 0x47
      assert.equal(buffer[0], 0x89);
      assert.equal(buffer[1], 0x50); // P
      assert.equal(buffer[2], 0x4e); // N
      assert.equal(buffer[3], 0x47); // G
    });
  });
});
