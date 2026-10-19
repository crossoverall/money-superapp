/**
 * Money Superapp - Cross-Tool Bridge Protocol Engine
 * Standardizes inter-tool data handoffs with versioned envelopes, consume-once lifecycles,
 * BroadcastChannel real-time cross-tab messaging, and backward-compatible legacy key adapters.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  const PREFIX = 'moneySuperapp.bridge.';
  const CHANNEL_NAME = 'money-superapp-bridge';

  // Legacy key mappings for backward compatibility
  const LEGACY_ACTION_MAP = {
    import_slip: { target: 'remaining-money', key: 'moneySuperapp.pendingSlipImport', isJson: true },
    lump_sum: { target: 'remaining-money', key: 'moneySuperapp.pendingLumpSum', isJson: true },
    tax_accrual: { target: 'remaining-money', key: 'moneySuperapp.pendingTaxAccrual', isJson: true },
    debt_windfall: { target: 'debt-calculator', key: 'moneySuperapp.pendingDebtWindfall', isJson: true },
    budget: { target: 'rebalance', key: 'moneySuperapp.pendingBudget', isJson: false },
    debt_extra: { target: 'debt-calculator', key: 'moneySuperapp.pendingDebtExtra', isJson: false },
    refinance_savings: { target: 'remaining-money', key: 'moneySuperapp.pendingRefinanceSavings', isJson: true },
    bank_statement: { target: 'remaining-money', key: 'moneySuperapp.pendingBankStatement', isJson: false },
    insurance_premium: { target: 'remaining-money', key: 'moneySuperapp.pendingInsurancePremium', isJson: true },
    dca_budget: { target: 'remaining-money', key: 'moneySuperapp.pendingDcaBudget', isJson: true },
  };

  function getCurrentToolName() {
    if (typeof location === 'undefined' || !location.pathname) return 'unknown';
    const path = location.pathname.split('/').pop() || '';
    return path.replace(/\.html$/, '') || 'index';
  }

  function getStorage() {
    try {
      if (global?.localStorage) {
        return global.localStorage;
      }
    } catch (_e) {}
    return null;
  }

  let channel = null;
  function getBroadcastChannel() {
    if (channel) return channel;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(CHANNEL_NAME);
        if (typeof channel.unref === 'function') {
          channel.unref();
        }
      }
    } catch (_e) {}
    return channel;
  }

  function closeChannel() {
    if (channel) {
      try {
        channel.close();
      } catch (_e) {}
      channel = null;
    }
  }

  /**
   * @typedef {Object} BridgeEnvelope
   * @property {number} version - Protocol version (1 for current, 0 for legacy adapter)
   * @property {string} source - Originating tool name
   * @property {string} target - Destination tool name
   * @property {string} action - Action event identifier
   * @property {*} payload - Transferred data payload
   * @property {number} timestamp - Unix epoch timestamp (ms)
   */

  /**
   * @typedef {Object} BridgeSendOptions
   * @property {string} [source] - Override source tool name
   */

  /**
   * @typedef {Object} BridgePeekResult
   * @property {*} payload - Extracted data payload
   * @property {BridgeEnvelope} envelope - Envelope metadata
   */

  /**
   * @typedef {Object} BridgeTargetOptions
   * @property {string} [target] - Override target tool name
   */

  /**
   * Dispatches a bridge payload to a target tool.
   *
   * @param {string} targetTool - Destination tool ID (e.g. 'rebalance', 'remaining-money', 'debt-calculator')
   * @param {string} action - Action identifier (e.g. 'budget', 'tax_accrual', 'debt_windfall')
   * @param {*} payload - Structured payload data
   * @param {BridgeSendOptions} [options] - Sender options
   * @returns {BridgeEnvelope} Constructed envelope
   */
  function send(targetTool, action, payload, options) {
    if (!targetTool || !action) {
      throw new Error('Bridge.send requires targetTool and action');
    }
    const opts = options || {};
    const source = opts.source || getCurrentToolName();
    const storage = getStorage();

    const envelope = {
      version: 1,
      source: source,
      target: targetTool,
      action: action,
      payload: payload,
      timestamp: Date.now(),
    };

    const envelopeStr = JSON.stringify(envelope);
    const key = `${PREFIX}${targetTool}.${action}`;

    if (storage) {
      storage.setItem(key, envelopeStr);

      // Synchronize legacy key if mapped
      const legacy = LEGACY_ACTION_MAP[action];
      if (legacy && legacy.target === targetTool) {
        const legacyVal = legacy.isJson ? JSON.stringify(payload) : String(payload);
        storage.setItem(legacy.key, legacyVal);
      }
    }

    const bc = getBroadcastChannel();
    if (bc) {
      try {
        bc.postMessage(envelope);
      } catch (_e) {}
    }

    return envelope;
  }

  /**
   * Inspects pending bridge data without consuming it.
   *
   * @param {string} action - Action identifier (e.g. 'budget', 'tax_accrual')
   * @param {BridgeTargetOptions} [options] - Target options
   * @returns {BridgePeekResult|null} Pending payload and envelope, or null if empty
   */
  function peek(action, options) {
    const opts = options || {};
    const target = opts.target || getCurrentToolName();
    const storage = getStorage();
    if (!storage) return null;

    const key = `${PREFIX}${target}.${action}`;
    const raw = storage.getItem(key);
    if (raw) {
      try {
        const envelope = JSON.parse(raw);
        return { payload: envelope.payload, envelope: envelope };
      } catch (_e) {}
    }

    // Check legacy key
    const legacy = LEGACY_ACTION_MAP[action];
    if (legacy && (legacy.target === target || target === 'unknown')) {
      const legacyRaw = storage.getItem(legacy.key);
      if (legacyRaw !== null) {
        let val = legacyRaw;
        if (legacy.isJson) {
          try {
            val = JSON.parse(legacyRaw);
          } catch (_e) {}
        }
        return {
          payload: val,
          envelope: {
            version: 0,
            source: 'legacy',
            target: legacy.target,
            action: action,
            payload: val,
            timestamp: Date.now(),
          },
        };
      }
    }

    return null;
  }

  /**
   * Consumes pending bridge data for the current tool once.
   *
   * @param {string} action - Action identifier
   * @param {function(*, BridgeEnvelope): void} handler - Callback receiving (payload, envelope)
   * @param {BridgeTargetOptions} [options] - Target options
   * @returns {boolean} True if a message was consumed
   */
  function receive(action, handler, options) {
    if (typeof handler !== 'function') return false;
    const opts = options || {};
    const target = opts.target || getCurrentToolName();
    const storage = getStorage();
    if (!storage) return false;

    const key = `${PREFIX}${target}.${action}`;
    const raw = storage.getItem(key);
    let consumed = false;

    if (raw) {
      storage.removeItem(key);
      // Clean corresponding legacy key
      const legacy = LEGACY_ACTION_MAP[action];
      if (legacy && storage.getItem(legacy.key) !== null) {
        storage.removeItem(legacy.key);
      }
      try {
        const envelope = JSON.parse(raw);
        handler(envelope.payload, envelope);
        consumed = true;
      } catch (_e) {}
    } else {
      // Fallback check legacy key
      const leg = LEGACY_ACTION_MAP[action];
      if (leg && (leg.target === target || target === 'unknown')) {
        const legRaw = storage.getItem(leg.key);
        if (legRaw !== null) {
          storage.removeItem(leg.key);
          let legVal = legRaw;
          if (leg.isJson) {
            try {
              legVal = JSON.parse(legRaw);
            } catch (_e) {}
          }
          handler(legVal, {
            version: 0,
            source: 'legacy',
            target: leg.target,
            action: action,
            payload: legVal,
            timestamp: Date.now(),
          });
          consumed = true;
        }
      }
    }

    return consumed;
  }

  /**
   * Clears pending bridge data for an action.
   */
  function clear(action, options) {
    const opts = options || {};
    const target = opts.target || getCurrentToolName();
    const storage = getStorage();
    if (!storage) return;

    const key = `${PREFIX}${target}.${action}`;
    storage.removeItem(key);

    const legacy = LEGACY_ACTION_MAP[action];
    if (legacy && (legacy.target === target || target === 'unknown')) {
      storage.removeItem(legacy.key);
    }
  }

  /**
   * Subscribes to live cross-tab bridge events.
   */
  function listen(action, handler, options) {
    if (typeof handler !== 'function') return () => {};
    const opts = options || {};
    const target = opts.target || getCurrentToolName();

    const onStorage = (e) => {
      const key = `${PREFIX}${target}.${action}`;
      const legacy = LEGACY_ACTION_MAP[action];
      if (e.key === key || (legacy && e.key === legacy.key)) {
        receive(action, handler, opts);
      }
    };

    const onBroadcast = (e) => {
      if (e.data && e.data.action === action && e.data.target === target) {
        receive(action, handler, opts);
      }
    };

    if (global?.addEventListener) {
      global.addEventListener('storage', onStorage);
    }

    const bc = getBroadcastChannel();
    if (bc) {
      bc.addEventListener('message', onBroadcast);
    }

    return () => {
      if (global?.removeEventListener) {
        global.removeEventListener('storage', onStorage);
      }
      if (bc) {
        bc.removeEventListener('message', onBroadcast);
      }
    };
  }

  /**
   * Introspection helper: lists all pending bridges currently in storage.
   */
  function listPending() {
    const storage = getStorage();
    if (!storage) return [];
    const pending = [];

    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i);
      if (k?.startsWith(PREFIX)) {
        const raw = storage.getItem(k);
        try {
          const env = JSON.parse(raw);
          pending.push({ key: k, envelope: env });
        } catch (_e) {}
      } else if (k?.startsWith('moneySuperapp.pending')) {
        pending.push({ key: k, legacyValue: storage.getItem(k) });
      }
    }
    return pending;
  }

  /**
   * Clears all pending bridges in storage.
   */
  function clearAll() {
    const storage = getStorage();
    if (!storage) return;
    const keysToRemove = [];

    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i);
      if (k && (k.startsWith(PREFIX) || k.startsWith('moneySuperapp.pending'))) {
        keysToRemove.push(k);
      }
    }
    for (let i = 0; i < keysToRemove.length; i++) {
      storage.removeItem(keysToRemove[i]);
    }
  }

  const Bridge = {
    send: send,
    receive: receive,
    peek: peek,
    clear: clear,
    listen: listen,
    listPending: listPending,
    clearAll: clearAll,
    closeChannel: closeChannel,
    getCurrentToolName: getCurrentToolName,
    LEGACY_ACTION_MAP: LEGACY_ACTION_MAP,
  };

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.Bridge = Bridge;

  if (typeof global !== 'undefined') {
    if (typeof global.BridgeProtocol === 'undefined') {
      global.BridgeProtocol = Bridge;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
