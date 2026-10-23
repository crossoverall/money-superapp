import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { createContext, Script } from 'node:vm';

const ROOT_DIR = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

function loadThaiPitEngine() {
  const code = fs.readFileSync(path.join(ROOT_DIR, 'js/engines/thai-pit.js'), 'utf8');
  const sandbox = {
    console,
    Math,
    Number,
    parseFloat: Number.parseFloat,
    parseInt: Number.parseInt,
    Boolean,
    window: {},
    globalThis: {},
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const ctx = createContext(sandbox);
  new Script(code).runInContext(ctx);
  return sandbox.MoneyApp;
}

describe('Phase 135: Easy E-Receipt & Tax Invoice Deduction Tracker (Pillar 2.3)', () => {
  describe('1. Statutory Engine Rules & Sub-Cap Math Invariants', () => {
    const MoneyApp = loadThaiPitEngine();

    it('handles pure VAT-registered electronic tax invoices up to 50,000 THB ceiling', () => {
      const res = MoneyApp.evaluateEasyEReceiptDeduction({ vatAmount: 50000, nonVatAmount: 0 });
      assert.equal(res.effectiveVat, 50000);
      assert.equal(res.effectiveNonVat, 0);
      assert.equal(res.totalEffective, 50000);
      assert.equal(res.remainingRoom, 0);
      assert.equal(res.utilizationPct, 100);
      assert.equal(res.isCapped, false);
      assert.equal(res.excessAmount, 0);
    });

    it('strictly enforces the 20,000 THB sub-cap for Non-VAT electronic receipts (books/OTOP)', () => {
      // User spent 35,000 in non-VAT books/OTOP
      const res = MoneyApp.evaluateEasyEReceiptDeduction({ vatAmount: 0, nonVatAmount: 35000 });
      assert.equal(res.effectiveNonVat, 20000, 'Non-VAT receipt must be capped at 20,000 THB');
      assert.equal(res.effectiveVat, 0);
      assert.equal(res.totalEffective, 20000);
      assert.equal(res.remainingRoom, 30000);
      assert.equal(res.utilizationPct, 40);
      assert.equal(res.isCapped, true);
      assert.equal(res.excessAmount, 15000);
    });

    it('calculates optimal combination of VAT and Non-VAT purchases within 50,000 THB combined cap', () => {
      // 40,000 VAT + 25,000 Non-VAT (Total 65,000)
      const res = MoneyApp.evaluateEasyEReceiptDeduction({ vatAmount: 40000, nonVatAmount: 25000 });
      assert.equal(res.effectiveNonVat, 20000, 'Non-VAT capped at 20,000');
      assert.equal(res.effectiveVat, 30000, 'Remaining room for VAT is 50k - 20k = 30,000');
      assert.equal(res.totalEffective, 50000);
      assert.equal(res.remainingRoom, 0);
      assert.equal(res.utilizationPct, 100);
      assert.equal(res.isCapped, true);
      assert.equal(res.excessAmount, 15000);
    });

    it('gracefully handles single number or string input for backward compatibility', () => {
      const resNum = MoneyApp.evaluateEasyEReceiptDeduction(30000);
      assert.equal(resNum.totalEffective, 30000);
      assert.equal(resNum.remainingRoom, 20000);
      assert.equal(resNum.utilizationPct, 60);

      const resStr = MoneyApp.evaluateEasyEReceiptDeduction('45000');
      assert.equal(resStr.totalEffective, 45000);
      assert.equal(resStr.remainingRoom, 5000);
      assert.equal(resStr.utilizationPct, 90);
    });

    it('safeguards against negative, null, and NaN inputs', () => {
      const resNeg = MoneyApp.evaluateEasyEReceiptDeduction(-5000);
      assert.equal(resNeg.totalEffective, 0);
      assert.equal(resNeg.remainingRoom, 50000);
      assert.equal(resNeg.utilizationPct, 0);

      const resNull = MoneyApp.evaluateEasyEReceiptDeduction(null);
      assert.equal(resNull.totalEffective, 0);

      const resNaN = MoneyApp.evaluateEasyEReceiptDeduction({ vatAmount: 'invalid', nonVatAmount: undefined });
      assert.equal(resNaN.totalEffective, 0);
      assert.equal(resNaN.remainingRoom, 50000);
    });

    it('integrates cleanly into calculateThaiEFilingWorksheet Group E deductions', () => {
      const baseSheet = MoneyApp.calculateThaiEFilingWorksheet({
        income401: 600000,
        sso: 9000,
      });

      const receiptSheet = MoneyApp.calculateThaiEFilingWorksheet({
        income401: 600000,
        sso: 9000,
        easyReceipt: { vatAmount: 30000, nonVatAmount: 20000 },
      });

      assert.equal(receiptSheet.deductions.groupE, 50000, 'Group E must reflect 50,000 THB Easy E-Receipt');
      assert.equal(
        receiptSheet.netTaxableIncome,
        baseSheet.netTaxableIncome - 50000,
        'Net taxable income must be reduced by exact deductible amount',
      );
      assert.ok(receiptSheet.easyReceipt, 'Worksheet result must attach easyReceipt evaluation');
      assert.equal(receiptSheet.easyReceipt.totalEffective, 50000);
    });
  });

  describe('2. Headless Chrome UI & Meter Invariants', () => {
    let server;
    let serverPort;
    let chromeProcess;
    let cdpWs;
    let messageId = 0;
    const pendingRequests = new Map();

    function sendCdp(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = ++messageId;
        pendingRequests.set(id, { resolve, reject });
        cdpWs.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluateScript(expression) {
      const result = await sendCdp('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (result.exceptionDetails) {
        throw new Error(
          `CDP Eval Error: ${result.exceptionDetails.text || result.exceptionDetails.exception?.description}`,
        );
      }
      return result.result?.value;
    }

    before(async () => {
      const chromeAvailable = await new Promise((res) => {
        const check = spawn('google-chrome', ['--version']);
        check.on('error', () => res(false));
        check.on('close', (code) => res(code === 0));
      });
      if (!chromeAvailable) return;

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

      const cdpPort = 9500 + Math.floor(Math.random() * 400);
      const userDataDir = path.join('/tmp', `chrome-easyreceipt-${Date.now()}`);
      chromeProcess = spawn('google-chrome', [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        `--remote-debugging-port=${cdpPort}`,
        `--user-data-dir=${userDataDir}`,
        'about:blank',
      ]);

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

      cdpWs.addEventListener('message', (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.id && pendingRequests.has(msg.id)) {
            const { resolve, reject } = pendingRequests.get(msg.id);
            pendingRequests.delete(msg.id);
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
          }
        } catch (_e) {}
      });

      await new Promise((resolve, reject) => {
        cdpWs.addEventListener('open', resolve);
        cdpWs.addEventListener('error', reject);
      });

      await sendCdp('Page.navigate', { url: `http://127.0.0.1:${serverPort}/tax-calculator-base.html` });
      await new Promise((r) => setTimeout(r, 800));
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
        await new Promise((res) => server.close(res));
      }
    });

    it('renders visual quota meter and updates bar width when Easy E-Receipt is entered', async () => {
      if (!cdpWs) return;

      const meterTest = await evaluateScript(`
        (() => {
          const input = document.getElementById('easyReceiptDeduct');
          if (!input) return { error: 'easyReceiptDeduct missing' };

          // Set 25,000 THB (50% utilization)
          input.value = '25000';
          handleEasyReceiptMainInput();

          const meterWrap = document.getElementById('easyreceipt-meter-wrap');
          const bar = document.getElementById('bar-easyreceipt-meter');
          const utilText = document.getElementById('val-easyreceipt-utilization');
          const remText = document.getElementById('txt-easyreceipt-rem');

          return {
            success: true,
            isDisplayed: meterWrap.style.display !== 'none',
            barWidth: bar ? bar.style.width : null,
            utilText: utilText ? utilText.textContent : null,
            remText: remText ? remText.textContent : null
          };
        })()
      `);

      assert.ok(meterTest.success);
      assert.ok(meterTest.isDisplayed, 'Meter wrap must be visible when value > 0');
      assert.equal(meterTest.barWidth, '50%', 'Bar width should be 50% for 25,000 / 50,000');
      assert.ok(meterTest.utilText.includes('50%'), 'Utilization readout must display 50%');
    });

    it('synchronizes sub-inputs for VAT vs Non-VAT stores into main deduction input', async () => {
      if (!cdpWs) return;

      const subInputTest = await evaluateScript(`
        (() => {
          const vatInput = document.getElementById('easyReceiptVat');
          const nonVatInput = document.getElementById('easyReceiptNonVat');
          const mainInput = document.getElementById('easyReceiptDeduct');

          vatInput.value = '20000';
          nonVatInput.value = '15000';
          handleEasyReceiptSubInput();

          const bar = document.getElementById('bar-easyreceipt-meter');
          const utilText = document.getElementById('val-easyreceipt-utilization');

          return {
            success: true,
            mainVal: mainInput.value,
            barWidth: bar ? bar.style.width : null,
            utilText: utilText ? utilText.textContent : null
          };
        })()
      `);

      assert.ok(subInputTest.success);
      assert.equal(subInputTest.mainVal, '35000', 'Main input must sum VAT + Non-VAT (20,000 + 15,000 = 35,000)');
      assert.equal(subInputTest.barWidth, '70%', 'Bar width should be 70% for 35,000 / 50,000');
    });
  });
});
