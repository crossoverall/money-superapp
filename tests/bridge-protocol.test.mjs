import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bridgeCode = readFileSync(resolve(__dirname, '../js/engines/bridge.js'), 'utf8');

function createEnvironment(currentPath = '/rebalance.html') {
  const store = {};
  const listeners = {};

  const mockStorage = {
    getItem: (k) => (Object.hasOwn(store, k) ? store[k] : null),
    setItem: (k, v) => {
      store[k] = String(v);
    },
    removeItem: (k) => {
      delete store[k];
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
    },
    key: (idx) => Object.keys(store)[idx] || null,
    get length() {
      return Object.keys(store).length;
    },
  };

  const mockWindow = {
    localStorage: mockStorage,
    location: {
      pathname: currentPath,
    },
    addEventListener: (event, handler) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(handler);
    },
    removeEventListener: (event, handler) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((h) => h !== handler);
      }
    },
  };

  const fn = new Function('window', 'location', 'localStorage', `${bridgeCode}; return window.MoneyApp.Bridge;`);
  const Bridge = fn(mockWindow, mockWindow.location, mockWindow.localStorage);

  return { Bridge, mockStorage, mockWindow, store, listeners };
}

describe('MoneyApp.Bridge - Cross-Tool Bridge Protocol Engine (Phase 92)', () => {
  it('correctly constructs a standardized version 1 envelope on send()', () => {
    const { Bridge, mockStorage } = createEnvironment('/remaining-money.html');
    const payload = { amount: 15000, strategy: 'dca' };
    const env = Bridge.send('rebalance', 'budget', payload);

    assert.equal(env.version, 1);
    assert.equal(env.source, 'remaining-money');
    assert.equal(env.target, 'rebalance');
    assert.equal(env.action, 'budget');
    assert.deepEqual(env.payload, payload);
    assert.ok(typeof env.timestamp === 'number');

    // Envelope stored under moneySuperapp.bridge.rebalance.budget
    const stored = JSON.parse(mockStorage.getItem('moneySuperapp.bridge.rebalance.budget'));
    assert.deepEqual(stored, env);

    // Legacy key mirrored
    assert.equal(mockStorage.getItem('moneySuperapp.pendingBudget'), String(payload));
  });

  it('peeks at pending bridge data without mutating storage', () => {
    const { Bridge } = createEnvironment('/rebalance.html');
    Bridge.send('rebalance', 'tax_accrual', { accrual: 4500 });

    const peeked = Bridge.peek('tax_accrual');
    assert.ok(peeked);
    assert.deepEqual(peeked.payload, { accrual: 4500 });
    assert.equal(peeked.envelope.version, 1);

    // Storage is still intact
    const peekedAgain = Bridge.peek('tax_accrual');
    assert.ok(peekedAgain);
  });

  it('consumes envelope once and purges storage keys on receive()', () => {
    const { Bridge, mockStorage } = createEnvironment('/rebalance.html');
    Bridge.send('rebalance', 'budget', 25000);

    let receivedPayload = null;
    let receivedEnv = null;

    const consumed = Bridge.receive('budget', (payload, env) => {
      receivedPayload = payload;
      receivedEnv = env;
    });

    assert.equal(consumed, true);
    assert.equal(receivedPayload, 25000);
    assert.equal(receivedEnv.target, 'rebalance');

    // Key has been purged
    assert.equal(mockStorage.getItem('moneySuperapp.bridge.rebalance.budget'), null);
    assert.equal(mockStorage.getItem('moneySuperapp.pendingBudget'), null);

    // Second call returns false (consume-once guarantee)
    let secondCall = false;
    const consumed2 = Bridge.receive('budget', () => {
      secondCall = true;
    });
    assert.equal(consumed2, false);
    assert.equal(secondCall, false);
  });

  it('transparently receives legacy keys when modern envelope is not present', () => {
    const { Bridge, mockStorage } = createEnvironment('/remaining-money.html');
    // Pre-populate raw legacy key as existing tools do
    const legacyData = { gross: 65000, tax: 4200, sso: 750 };
    mockStorage.setItem('moneySuperapp.pendingSlipImport', JSON.stringify(legacyData));

    let handled = null;
    let handledEnv = null;
    const consumed = Bridge.receive('import_slip', (payload, env) => {
      handled = payload;
      handledEnv = env;
    });

    assert.equal(consumed, true);
    assert.deepEqual(handled, legacyData);
    assert.equal(handledEnv.source, 'legacy');
    assert.equal(mockStorage.getItem('moneySuperapp.pendingSlipImport'), null);
  });

  it('clears active bridges and their legacy counterparts on clear()', () => {
    const { Bridge, mockStorage } = createEnvironment('/debt-calculator.html');
    Bridge.send('debt-calculator', 'debt_windfall', { amount: 30000 });

    assert.ok(mockStorage.getItem('moneySuperapp.bridge.debt-calculator.debt_windfall'));
    assert.ok(mockStorage.getItem('moneySuperapp.pendingDebtWindfall'));

    Bridge.clear('debt_windfall');

    assert.equal(mockStorage.getItem('moneySuperapp.bridge.debt-calculator.debt_windfall'), null);
    assert.equal(mockStorage.getItem('moneySuperapp.pendingDebtWindfall'), null);
  });

  it('lists and clears all pending bridges via listPending() and clearAll()', () => {
    const { Bridge } = createEnvironment('/remaining-money.html');
    Bridge.send('rebalance', 'budget', 12000);
    Bridge.send('debt-calculator', 'debt_extra', 5000);

    const pending = Bridge.listPending();
    assert.ok(pending.length >= 2, `Expected at least 2 pending bridges, got ${pending.length}`);

    Bridge.clearAll();
    assert.equal(Bridge.listPending().length, 0);
  });
});
