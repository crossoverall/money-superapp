import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createContext, Script } from 'node:vm';

function loadP2PSyncEngine() {
  const code = readFileSync(resolve('js/engines/p2p-sync.js'), 'utf8');
  const sandbox = {
    console,
    Math,
    String,
    Array,
    Object,
    Number,
    setTimeout,
    clearTimeout,
    document: {
      createElement: () => ({ getContext: () => null }),
    },
    window: {},
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);
  return {
    engine: sandbox.MoneyApp,
    sandbox,
  };
}

test('P2PSync engine exports BarcodeDetector scanner helpers and audio chime', () => {
  const { engine } = loadP2PSyncEngine();
  assert.ok(engine, 'MoneyApp should be defined');
  assert.equal(typeof engine.isBarcodeDetectorSupported, 'function');
  assert.equal(typeof engine.createBarcodeDetector, 'function');
  assert.equal(typeof engine.scanQrFromSource, 'function');
  assert.equal(typeof engine.playScanFeedbackChime, 'function');
  assert.equal(typeof engine.chunkPayload, 'function');
  assert.equal(typeof engine.assembleChunks, 'function');
});

test('isBarcodeDetectorSupported correctly reflects window.BarcodeDetector existence', () => {
  const { engine, sandbox } = loadP2PSyncEngine();

  // Initially undefined in VM
  assert.equal(engine.isBarcodeDetectorSupported(), false);
  assert.equal(engine.createBarcodeDetector(), null);

  // When BarcodeDetector is provided
  sandbox.window.BarcodeDetector = class MockBarcodeDetector {
    constructor(opts) {
      this.formats = opts?.formats || [];
    }
    async detect() {
      return [];
    }
  };

  assert.equal(engine.isBarcodeDetectorSupported(), true);
  const detector = engine.createBarcodeDetector(['qr_code']);
  assert.ok(detector);
  assert.deepEqual(detector.formats, ['qr_code']);
});

test('scanQrFromSource detects barcodes on visual source and normalizes result', async () => {
  const { engine } = loadP2PSyncEngine();

  const mockDetector = {
    detect: async (source) => {
      if (source === 'empty') return [];
      return [
        {
          rawValue: JSON.stringify({ c: 1, t: 2, d: 'hello', id: 's1' }),
          format: 'qr_code',
          boundingBox: { x: 10, y: 10, width: 100, height: 100 },
        },
      ];
    },
  };

  // Valid source
  const results = await engine.scanQrFromSource(mockDetector, 'some_video_or_canvas');
  assert.equal(results.length, 1);
  assert.equal(results[0].format, 'qr_code');
  assert.ok(results[0].rawValue.includes('"d":"hello"'));
  assert.equal(results[0].boundingBox.width, 100);

  // Empty source
  const emptyRes = await engine.scanQrFromSource(mockDetector, 'empty');
  assert.deepEqual(Array.from(emptyRes), []);

  // Null source / detector errors gracefully
  const nullRes = await engine.scanQrFromSource(null, 'some_source');
  assert.deepEqual(Array.from(nullRes), []);
});

test('playScanFeedbackChime gracefully handles browser and headless environments', () => {
  const { engine, sandbox } = loadP2PSyncEngine();

  // Headless / non-audio environment
  const headlessRes = engine.playScanFeedbackChime();
  assert.equal(headlessRes, false);

  // Browser environment with Web Audio API mock
  let oscFrequency = 0;
  let started = false;
  let stopped = false;

  sandbox.window.AudioContext = class MockAudioContext {
    constructor() {
      this.currentTime = 0;
      this.destination = {};
    }
    createOscillator() {
      return {
        type: '',
        frequency: {
          setValueAtTime: (freq) => {
            oscFrequency = freq;
          },
        },
        connect: () => {},
        start: () => {
          started = true;
        },
        stop: () => {
          stopped = true;
        },
      };
    }
    createGain() {
      return {
        gain: {
          setValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
        },
        connect: () => {},
      };
    }
    close() {}
  };

  const audioRes = engine.playScanFeedbackChime({ frequency: 880, duration: 0.1 });
  assert.equal(audioRes, true);
  assert.equal(oscFrequency, 880);
  assert.equal(started, true);
  assert.equal(stopped, true);
});

test('End-to-end QR slice transmission and assembly pipeline', async () => {
  const { engine } = loadP2PSyncEngine();

  const secretPayload = JSON.stringify({
    timestamp: 1729000000000,
    vault: 'ENCRYPTED_FINANCIAL_PORTFOLIO_DATA_XYZ_ABC_123',
    checksum: 'a9f24e1',
  });

  // 1. Chunk payload into small QR frames
  const chunks = engine.chunkPayload(secretPayload, 25, 'sync_sess_1');
  assert.ok(chunks.length >= 3, 'Payload should split into multiple frames');
  assert.equal(chunks[0].t, chunks.length);

  // 2. Simulate camera scanning loop detecting each chunk sequentially
  const mockDetector = {
    detect: async (frameIndex) => [
      {
        rawValue: JSON.stringify(chunks[frameIndex]),
        format: 'qr_code',
      },
    ],
  };

  const scannedChunks = [];
  for (let i = 0; i < chunks.length; i++) {
    const detected = await engine.scanQrFromSource(mockDetector, i);
    assert.equal(detected.length, 1);
    const parsed = JSON.parse(detected[0].rawValue);
    scannedChunks.push(parsed);
  }

  // 3. Assemble scanned chunks into reconstructed payload
  const assembly = engine.assembleChunks(scannedChunks);
  assert.equal(assembly.complete, true);
  assert.equal(assembly.received, chunks.length);
  assert.deepEqual(Array.from(assembly.missing), []);
  assert.equal(assembly.payload, secretPayload);

  // 4. Missing chunk detection
  const incompleteAssembly = engine.assembleChunks([scannedChunks[0]]);
  assert.equal(incompleteAssembly.complete, false);
  assert.equal(incompleteAssembly.received, 1);
  assert.ok(incompleteAssembly.missing.includes(2));
});
