import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

const ROOT_DIR = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

describe('Phase 133: Rebalance Quick-Apply Suggested Allocation & Budget Deduction', () => {
  describe('1. Static Code, Translations & Contract Invariants', () => {
    it('verifies btnApplySuggestion exists in both Thai and English dictionaries in js/rebalance.js', () => {
      const code = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      const match = code.match(/const\s+translations\s*=\s*(\{[\s\S]*?\n\};)/);
      assert.ok(match, 'js/rebalance.js must define translations object');
      const fn = new Function(`return ${match[1]}`);
      const t = fn();
      assert.ok(t.th.btnApplySuggestion, 'translations.th.btnApplySuggestion must exist');
      assert.ok(t.en.btnApplySuggestion, 'translations.en.btnApplySuggestion must exist');
    });

    it('verifies .btn-apply-suggestion CSS styling is present in rebalance.html', () => {
      const html = fs.readFileSync(path.join(ROOT_DIR, 'rebalance.html'), 'utf8');
      assert.ok(html.includes('.btn-apply-suggestion'), 'rebalance.html must define .btn-apply-suggestion styles');
      assert.ok(html.includes('.btn-apply-suggestion:hover'), 'rebalance.html must define hover state');
      assert.ok(html.includes('.btn-apply-suggestion:focus-visible'), 'rebalance.html must define focus-visible state');
      assert.ok(
        html.includes('.bucket-panel.ballast .btn-apply-suggestion'),
        'rebalance.html must define ballast theme variant',
      );
      assert.ok(
        html.includes('.bucket-panel.satellite .btn-apply-suggestion'),
        'rebalance.html must define satellite theme variant',
      );
    });

    it('verifies js/rebalance.js exports applySuggestedAllocation on window', () => {
      const code = fs.readFileSync(path.join(ROOT_DIR, 'js/rebalance.js'), 'utf8');
      assert.ok(
        code.includes('window.applySuggestedAllocation = applySuggestedAllocation'),
        'js/rebalance.js must export window.applySuggestedAllocation',
      );
    });
  });

  describe('2. Headless Chrome End-to-End Live Invariants', () => {
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
      // 1. Check Chrome availability
      const chromeAvailable = await new Promise((res) => {
        const check = spawn('google-chrome', ['--version']);
        check.on('error', () => res(false));
        check.on('close', (code) => res(code === 0));
      });
      if (!chromeAvailable) {
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

      // 3. Launch headless Chrome
      const cdpPort = 9400 + Math.floor(Math.random() * 500);
      const userDataDir = path.join('/tmp', `chrome-rebalance-${Date.now()}`);
      chromeProcess = spawn('google-chrome', [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        `--remote-debugging-port=${cdpPort}`,
        `--user-data-dir=${userDataDir}`,
        'about:blank',
      ]);

      // 4. Wait for Chrome CDP port
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

      await sendCdp('Page.navigate', { url: `http://127.0.0.1:${serverPort}/rebalance.html` });
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

    it('renders .btn-apply-suggestion for assets with suggested additions and updates holding value & budget on click', async () => {
      if (!cdpWs) return;

      // Set a test scenario with totalBudget = 10000
      const testResult = await evaluateScript(`
        (() => {
          // Reset state with known predictable values
          state.totalBudget = 10000;
          document.getElementById('totalBudget').value = '10000';
          
          // Ensure core bucket has assets with deficit
          const coreBucket = state.buckets.find(b => b.id === 'core');
          if (coreBucket && coreBucket.assets.length > 0) {
            coreBucket.assets[0].value = 5000;
            coreBucket.assets[0].weight = 50;
            if (coreBucket.assets.length > 1) {
              coreBucket.assets[1].value = 20000;
              coreBucket.assets[1].weight = 50;
            }
          }
          
          renderBuckets();
          compute();

          const buttonsBefore = document.querySelectorAll('.btn-apply-suggestion');
          if (buttonsBefore.length === 0) {
            return { error: 'No .btn-apply-suggestion buttons rendered' };
          }

          // Pick the first button with a suggested allocation
          const firstBtn = buttonsBefore[0];
          const bucketId = firstBtn.dataset.bucket;
          const assetIdx = parseInt(firstBtn.dataset.idx, 10);
          const amountToApply = parseFloat(firstBtn.dataset.amount);

          const bucket = state.buckets.find(b => b.id === bucketId);
          const initialAssetVal = bucket.assets[assetIdx].value;
          const initialBudget = state.totalBudget;

          // Click the button
          firstBtn.click();

          const updatedAssetVal = bucket.assets[assetIdx].value;
          const updatedBudget = state.totalBudget;
          const budgetInputValue = document.getElementById('totalBudget').value;

          return {
            success: true,
            initialAssetVal,
            updatedAssetVal,
            amountToApply,
            initialBudget,
            updatedBudget,
            budgetInputValue
          };
        })()
      `);

      assert.ok(testResult.success, `Execution failed: ${testResult.error}`);
      assert.equal(
        testResult.updatedAssetVal,
        testResult.initialAssetVal + testResult.amountToApply,
        'Asset holding value must increase by exact applied amount',
      );
      assert.equal(
        testResult.updatedBudget,
        testResult.initialBudget - testResult.amountToApply,
        'State budget must decrease by exact applied amount',
      );
      assert.equal(
        testResult.budgetInputValue,
        String(testResult.updatedBudget),
        '#totalBudget input field must match updated budget',
      );
    });

    it('proportionally updates units when asset tracks units and price', async () => {
      if (!cdpWs) return;

      const unitsResult = await evaluateScript(`
        (() => {
          // Setup asset with known units and price
          const satBucket = state.buckets.find(b => b.id === 'satellite');
          if (!satBucket) return { error: 'Satellite bucket not found' };

          satBucket.enabled = true;
          satBucket.assets = [{
            name: 'NVDA',
            ticker: 'NVDA',
            units: 10,
            lastPrice: 100,
            currency: 'THB',
            value: 1000,
            weight: 100,
            enabled: true
          }];
          state.totalBudget = 1500;
          document.getElementById('totalBudget').value = '1500';

          renderBuckets();
          compute();

          const btn = document.querySelector('#results-satellite .btn-apply-suggestion');
          if (!btn) return { error: 'No apply button in satellite' };

          const initialUnits = satBucket.assets[0].units;
          const initialVal = satBucket.assets[0].value;
          const applyAmount = parseFloat(btn.dataset.amount);

          // Click button
          btn.click();

          const finalUnits = satBucket.assets[0].units;
          const finalVal = satBucket.assets[0].value;
          const finalBudget = state.totalBudget;

          return {
            success: true,
            initialUnits,
            finalUnits,
            initialVal,
            finalVal,
            applyAmount,
            finalBudget
          };
        })()
      `);

      assert.ok(unitsResult.success, `Units test failed: ${unitsResult.error}`);
      assert.equal(unitsResult.finalVal, unitsResult.initialVal + unitsResult.applyAmount);
      // Added units = 1500 / 100 = 15. Initial was 10, final should be 25.
      assert.equal(unitsResult.finalUnits, unitsResult.initialUnits + unitsResult.applyAmount / 100);
      assert.equal(unitsResult.finalBudget, 0, 'Budget should be 0 after applying 1500 of 1500');
    });

    it('supports Undo, restoring both asset value and budget to previous state', async () => {
      if (!cdpWs) return;

      const undoResult = await evaluateScript(`
        (() => {
          const satBucket = state.buckets.find(b => b.id === 'satellite');
          satBucket.enabled = true;
          satBucket.assets = [{
            name: 'NVDA',
            ticker: 'NVDA',
            units: 10,
            lastPrice: 100,
            currency: 'THB',
            value: 5000,
            weight: 100,
            enabled: true
          }];
          state.totalBudget = 3000;
          document.getElementById('totalBudget').value = '3000';

          renderBuckets();
          compute();

          const beforeVal = satBucket.assets[0].value;
          const beforeBudget = state.totalBudget;

          // Apply suggestion
          const btn = document.querySelector('#results-satellite .btn-apply-suggestion');
          if (!btn) return { error: 'Satellite apply button missing' };
          const applyAmt = parseFloat(btn.dataset.amount);
          btn.click();

          const midVal = satBucket.assets[0].value;
          const midBudget = state.totalBudget;

          // Call undo
          undoRebalanceChange();

          const currentSat = state.buckets.find(b => b.id === 'satellite');
          const restoredVal = currentSat.assets[0].value;
          const restoredBudget = state.totalBudget;

          return {
            success: true,
            beforeVal,
            midVal,
            restoredVal,
            beforeBudget,
            midBudget,
            restoredBudget,
            applyAmt
          };
        })()
      `);

      assert.ok(undoResult.success, `Undo test failed: ${undoResult.error}`);
      assert.equal(undoResult.midVal, undoResult.beforeVal + undoResult.applyAmt);
      assert.equal(undoResult.midBudget, undoResult.beforeBudget - undoResult.applyAmt);
      assert.equal(undoResult.restoredVal, undoResult.beforeVal, 'Undo must restore exact asset holding value');
      assert.equal(undoResult.restoredBudget, undoResult.beforeBudget, 'Undo must restore exact budget');
    });

    it('verifies accessibility attributes aria-label and title on .btn-apply-suggestion', async () => {
      if (!cdpWs) return;

      const a11yResult = await evaluateScript(`
        (() => {
          state.totalBudget = 5000;
          renderBuckets();
          compute();

          const btns = Array.from(document.querySelectorAll('.btn-apply-suggestion'));
          if (btns.length === 0) return { error: 'No buttons found' };

          const checks = btns.map(b => ({
            hasAriaLabel: Boolean(b.getAttribute('aria-label') && b.getAttribute('aria-label').length > 5),
            hasTitle: Boolean(b.getAttribute('title') && b.getAttribute('title').length > 0),
            tagName: b.tagName.toLowerCase(),
            type: b.getAttribute('type')
          }));

          return {
            success: true,
            allValid: checks.every(c => c.hasAriaLabel && c.hasTitle && c.tagName === 'button' && c.type === 'button')
          };
        })()
      `);

      assert.ok(a11yResult.success, `A11y check failed: ${a11yResult.error}`);
      assert.ok(
        a11yResult.allValid,
        'All .btn-apply-suggestion buttons must have aria-label, title, and type="button"',
      );
    });

    it('safeguards against invalid inputs, clamping budget to 0 on over-application', async () => {
      if (!cdpWs) return;

      const edgeCases = await evaluateScript(`
        (() => {
          state.totalBudget = 500;
          const sat = state.buckets.find(b => b.id === 'satellite');
          sat.assets = [{
            name: 'BTC',
            ticker: 'BTC',
            units: 0.1,
            lastPrice: 60000,
            currency: 'USD',
            value: 200000,
            weight: 100,
            enabled: true
          }];
          renderBuckets();

          // 1. Invalid bucket / idx
          applySuggestedAllocation('nonexistent', 0, 1000);
          applySuggestedAllocation('satellite', 99, 1000);

          // 2. Negative and zero amounts
          const valBefore = sat.assets[0].value;
          applySuggestedAllocation('satellite', 0, -500);
          applySuggestedAllocation('satellite', 0, 0);
          applySuggestedAllocation('satellite', 0, NaN);
          const valAfterNoop = sat.assets[0].value;

          // 3. Over-application clamping
          applySuggestedAllocation('satellite', 0, 1500); // 1500 applied when budget was 500
          const finalBudget = state.totalBudget;
          const finalVal = sat.assets[0].value;

          return {
            success: true,
            valBefore,
            valAfterNoop,
            finalBudget,
            finalVal,
            units: sat.assets[0].units
          };
        })()
      `);

      assert.ok(edgeCases.success);
      assert.equal(
        edgeCases.valBefore,
        edgeCases.valAfterNoop,
        'Invalid and negative amounts must not modify asset value',
      );
      assert.equal(edgeCases.finalBudget, 0, 'Budget must be clamped to 0 and never become negative');
      assert.equal(edgeCases.finalVal, edgeCases.valBefore + 1500, 'Asset value must receive applied amount');
      assert.ok(edgeCases.units > 0.1, 'BTC units must be updated proportionally');
    });
  });
});
