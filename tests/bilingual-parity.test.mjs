import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

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

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

// Thai Unicode block: U+0E01 - U+0E59
const THAI_UNICODE_REGEX = /[\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59]/;

describe('Bilingual Parity & Localization Regression Suite', () => {
  describe('Static Translation Symmetry & DOM Target Invariants', () => {
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
  });

  describe('Headless Chrome Live DOM Parity Invariant (EN Mode)', () => {
    let server = null;
    let serverPort = 0;
    let chromeProcess = null;
    let cdpWs = null;
    let msgId = 1;
    let isChromeAvailable = false;

    // Helper to send CDP command
    const sendCdp = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        if (!cdpWs) return reject(new Error('CDP WebSocket not connected'));
        const curId = msgId++;
        const onMsg = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.id === curId) {
              cdpWs.removeEventListener('message', onMsg);
              if (data.error) reject(new Error(JSON.stringify(data.error)));
              else resolve(data.result);
            }
          } catch (e) {
            reject(e);
          }
        };
        cdpWs.addEventListener('message', onMsg);
        cdpWs.send(JSON.stringify({ id: curId, method, params }));
      });
    };

    before(async () => {
      // 1. Verify chrome binary
      try {
        const checkProc = spawn('which', ['google-chrome']);
        await new Promise((res, rej) => {
          checkProc.on('exit', (code) => (code === 0 ? res() : rej(new Error('not found'))));
        });
        isChromeAvailable = true;
      } catch (_e) {
        isChromeAvailable = false;
        return;
      }

      // 2. Start local static server
      await new Promise((resolve) => {
        server = http.createServer((req, res) => {
          const reqPath = req.url.split('?')[0].replace(/^\//, '') || 'index.html';
          const filePath = path.join(ROOT_DIR, reqPath);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath);
            res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
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

      // 3. Launch headless Chrome on an isolated remote debugging port
      const cdpPort = 9200 + Math.floor(Math.random() * 500);
      const userDataDir = path.join('/tmp', `chrome-parity-${Date.now()}`);
      chromeProcess = spawn('google-chrome', [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        `--remote-debugging-port=${cdpPort}`,
        `--user-data-dir=${userDataDir}`,
        'about:blank',
      ]);

      // 4. Wait for Chrome CDP port to become ready
      let wsUrl = null;
      for (let i = 0; i < 30; i++) {
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
      cdpWs = new WebSocket(wsUrl);
      await new Promise((resolve, reject) => {
        cdpWs.addEventListener('open', resolve);
        cdpWs.addEventListener('error', reject);
      });

      // Pre-seed localStorage moneySuperapp.lang = 'en'
      await sendCdp('Page.navigate', { url: `http://127.0.0.1:${serverPort}/index.html` });
      await new Promise((r) => setTimeout(r, 600));
      await sendCdp('Runtime.evaluate', {
        expression: `localStorage.setItem('moneySuperapp.lang', 'en');`,
      });
    });

    after(async () => {
      if (cdpWs) {
        try {
          cdpWs.close();
        } catch (_e) {}
      }
      if (chromeProcess) {
        try {
          chromeProcess.kill('SIGKILL');
        } catch (_e) {}
      }
      if (server) {
        await new Promise((resolve) => server.close(resolve));
      }
    });

    for (const page of CORE_HTML_PAGES) {
      it(`verifies ${page} renders 0 untranslated Thai elements in English mode`, async (t) => {
        if (!isChromeAvailable) {
          t.skip('google-chrome is not available on this platform');
          return;
        }

        // Navigate to the target page
        await sendCdp('Page.navigate', { url: `http://127.0.0.1:${serverPort}/${page}` });
        await new Promise((r) => setTimeout(r, 700));

        // Ensure language is set to 'en'
        await sendCdp('Runtime.evaluate', {
          expression: `
            if (localStorage.getItem('moneySuperapp.lang') !== 'en') {
              localStorage.setItem('moneySuperapp.lang', 'en');
              location.reload();
            }
          `,
        });
        await new Promise((r) => setTimeout(r, 500));

        // Expand all foldable cards if universal toolbar exists
        await sendCdp('Runtime.evaluate', {
          expression: `
            const exp = document.querySelector('[data-action="expand-all"]');
            if (exp) exp.click();
          `,
        });
        await new Promise((r) => setTimeout(r, 300));

        // Audit live DOM for any untranslated Thai text nodes or attributes
        const evalResult = await sendCdp('Runtime.evaluate', {
          returnByValue: true,
          expression: `
            (() => {
              const thaiRegex = /[\\u0E01-\\u0E3A\\u0E40-\\u0E4E\\u0E50-\\u0E59]/;
              const found = [];

              // 1. Text nodes in visible body
              const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
              let node;
              while ((node = walker.nextNode())) {
                const text = (node.nodeValue || '').trim();
                if (text && thaiRegex.test(text)) {
                  const el = node.parentElement;
                  if (el && !el.closest('script') && !el.closest('style')) {
                    found.push({
                      type: 'text',
                      id: el.id || '',
                      tag: el.tagName,
                      snippet: text.slice(0, 60),
                    });
                  }
                }
              }

              // 2. Form input placeholders
              document.querySelectorAll('input, select, textarea').forEach((el) => {
                if (el.placeholder && thaiRegex.test(el.placeholder)) {
                  found.push({
                    type: 'placeholder',
                    id: el.id || '',
                    tag: el.tagName,
                    snippet: el.placeholder.slice(0, 60),
                  });
                }
              });

              return found;
            })()
          `,
        });

        const violations = evalResult?.result?.value || [];
        assert.deepEqual(
          violations,
          [],
          `Found ${violations.length} untranslated Thai elements in ${page} (EN mode): ` +
            JSON.stringify(violations, null, 2),
        );
      });
    }
  });
});
