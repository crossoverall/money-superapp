import assert from 'node:assert/strict';
import test from 'node:test';

// Load engine under test
import '../js/engines/gdrive-sync.js';

test('Phase 146: Google Drive Cloud Sync & Intelligent Conflict Resolution Suite', async (t) => {
  const GDrive = globalThis.MoneyApp.GoogleDrive;

  await t.test('1. Core API Registration and Constants', () => {
    assert.ok(GDrive, 'MoneyApp.GoogleDrive must be defined on global namespace');
    assert.equal(typeof GDrive.createSnapshot, 'function');
    assert.equal(typeof GDrive.compareSnapshots, 'function');
    assert.equal(typeof GDrive.mergeSnapshots, 'function');
    assert.equal(typeof GDrive.applySnapshot, 'function');
    assert.equal(typeof GDrive.formatSyncTimestamp, 'function');

    assert.ok(Array.isArray(GDrive.ALLOWED_PREFIXES));
    assert.ok(GDrive.ALLOWED_PREFIXES.includes('moneySuperapp.'));
    assert.ok(GDrive.ALLOWED_PREFIXES.includes('remainingMoneyCalculator.'));
    assert.ok(GDrive.ALLOWED_PREFIXES.includes('rebalanceCalculator.'));

    assert.equal(GDrive.isAllowedKey('moneySuperapp.financialGoals.v1'), true);
    assert.equal(GDrive.isAllowedKey('rebalanceCalculator.state.v1'), true);
    assert.equal(GDrive.isAllowedKey('remainingMoneyCalculator.state.v1'), true);
    assert.equal(GDrive.isAllowedKey('unauthorizedApp.token'), false);
    assert.equal(GDrive.isAllowedKey('someRandomKey'), false);
  });

  await t.test('2. createSnapshot extraction and canonical structure', () => {
    const mockStorage = {
      'moneySuperapp.theme': 'dark',
      'moneySuperapp.financialGoals.v1': JSON.stringify({ goals: [{ id: 'g1', name: 'Car' }] }),
      'remainingMoneyCalculator.state.v1': JSON.stringify({ income: 50000 }),
      forbiddenKey: 'should-not-be-included',
    };

    const snapshot = GDrive.createSnapshot(mockStorage, { activeProfile: 'pro-investor' });
    assert.equal(snapshot.version, '1.1.0');
    assert.equal(snapshot.appName, 'Money Superapp');
    assert.ok(snapshot.exportedAt);
    assert.equal(snapshot.activeProfile, 'pro-investor');

    assert.equal(snapshot.data['moneySuperapp.theme'], 'dark');
    assert.equal(snapshot.data['remainingMoneyCalculator.state.v1'], JSON.stringify({ income: 50000 }));
    assert.equal(snapshot.data.forbiddenKey, undefined);
  });

  await t.test('3. compareSnapshots differential detection', () => {
    const baseSnapshot = {
      exportedAt: '2026-10-29T10:00:00.000Z',
      data: {
        'moneySuperapp.theme': 'dark',
        'remainingMoneyCalculator.state.v1': '{"income":50000}',
      },
    };

    // Identical
    const identicalReport = GDrive.compareSnapshots(baseSnapshot, { ...baseSnapshot });
    assert.equal(identicalReport.isIdentical, true);
    assert.equal(identicalReport.status, 'synced');
    assert.equal(identicalReport.modifiedKeys.length, 0);

    // Local ahead (newer local timestamp and additional key)
    const localAheadSnapshot = {
      exportedAt: '2026-10-29T11:00:00.000Z',
      data: {
        'moneySuperapp.theme': 'dark',
        'remainingMoneyCalculator.state.v1': '{"income":50000}',
        'moneySuperapp.taxBase': '{"taxableIncome":600000}',
      },
    };
    const localAheadReport = GDrive.compareSnapshots(localAheadSnapshot, baseSnapshot);
    assert.equal(localAheadReport.isIdentical, false);
    assert.equal(localAheadReport.status, 'local_ahead');
    assert.deepEqual(localAheadReport.localOnlyKeys, ['moneySuperapp.taxBase']);

    // Cloud ahead (newer cloud timestamp and additional key)
    const cloudAheadSnapshot = {
      exportedAt: '2026-10-29T12:00:00.000Z',
      data: {
        'moneySuperapp.theme': 'dark',
        'remainingMoneyCalculator.state.v1': '{"income":50000}',
        'rebalanceCalculator.state.v1': '{"assets":[]}',
      },
    };
    const cloudAheadReport = GDrive.compareSnapshots(baseSnapshot, cloudAheadSnapshot);
    assert.equal(cloudAheadReport.isIdentical, false);
    assert.equal(cloudAheadReport.status, 'cloud_ahead');
    assert.deepEqual(cloudAheadReport.remoteOnlyKeys, ['rebalanceCalculator.state.v1']);

    // Conflict (divergent modifications on both sides)
    const divergentLocal = {
      exportedAt: '2026-10-29T12:05:00.000Z',
      data: {
        'moneySuperapp.theme': 'dark',
        'remainingMoneyCalculator.state.v1': '{"income":55000}',
      },
    };
    const divergentCloud = {
      exportedAt: '2026-10-29T12:06:00.000Z',
      data: {
        'moneySuperapp.theme': 'light',
        'remainingMoneyCalculator.state.v1': '{"income":60000}',
      },
    };
    const conflictReport = GDrive.compareSnapshots(divergentLocal, divergentCloud);
    assert.equal(conflictReport.isIdentical, false);
    assert.equal(conflictReport.status, 'conflict');
    assert.ok(conflictReport.modifiedKeys.includes('moneySuperapp.theme'));
    assert.ok(conflictReport.modifiedKeys.includes('remainingMoneyCalculator.state.v1'));
  });

  await t.test('4. mergeSnapshots strategies (cloud, local, smart-merge)', () => {
    const localSnapshot = {
      exportedAt: '2026-10-29T10:00:00.000Z',
      data: {
        'moneySuperapp.theme': 'dark',
        'moneySuperapp.monthsSlips': JSON.stringify([{ id: 'slip-1', month: '2026-01', amount: 45000 }]),
        'remainingMoneyCalculator.state.v1': '{"income":50000}',
      },
    };

    const cloudSnapshot = {
      exportedAt: '2026-10-29T11:00:00.000Z',
      data: {
        'moneySuperapp.theme': 'light',
        'moneySuperapp.monthsSlips': JSON.stringify([
          { id: 'slip-1', month: '2026-01', amount: 45000 },
          { id: 'slip-2', month: '2026-02', amount: 48000 },
        ]),
        'rebalanceCalculator.state.v1': '{"cash":100000}',
      },
    };

    // Strategy 1: 'cloud'
    const cloudMerge = GDrive.mergeSnapshots(localSnapshot, cloudSnapshot, 'cloud');
    assert.equal(cloudMerge.strategy, 'cloud');
    assert.equal(cloudMerge.data['moneySuperapp.theme'], 'light');
    assert.equal(cloudMerge.data['rebalanceCalculator.state.v1'], '{"cash":100000}');
    assert.equal(cloudMerge.data['remainingMoneyCalculator.state.v1'], undefined);

    // Strategy 2: 'local'
    const localMerge = GDrive.mergeSnapshots(localSnapshot, cloudSnapshot, 'local');
    assert.equal(localMerge.strategy, 'local');
    assert.equal(localMerge.data['moneySuperapp.theme'], 'dark');
    assert.equal(localMerge.data['remainingMoneyCalculator.state.v1'], '{"income":50000}');
    assert.equal(localMerge.data['rebalanceCalculator.state.v1'], undefined);

    // Strategy 3: 'merge' (Intelligent union)
    const smartMerge = GDrive.mergeSnapshots(localSnapshot, cloudSnapshot, 'merge');
    assert.equal(smartMerge.strategy, 'merge');
    // Non-conflicting keys are preserved from both sides
    assert.equal(smartMerge.data['remainingMoneyCalculator.state.v1'], '{"income":50000}');
    assert.equal(smartMerge.data['rebalanceCalculator.state.v1'], '{"cash":100000}');

    // Array slips are deduplicated by id
    const slips = JSON.parse(smartMerge.data['moneySuperapp.monthsSlips']);
    assert.equal(slips.length, 2);
    assert.equal(slips[0].id, 'slip-1');
    assert.equal(slips[1].id, 'slip-2');

    // Conflicting scalar picks the newer snapshot (cloud in this case)
    assert.equal(smartMerge.data['moneySuperapp.theme'], 'light');
  });

  await t.test('5. applySnapshot storage mutation and filtering', () => {
    const storageMap = {};
    const mockStorage = {
      setItem: (k, v) => {
        storageMap[k] = v;
      },
    };

    const dataset = {
      'moneySuperapp.theme': 'dark',
      'remainingMoneyCalculator.state.v1': '{"income":50000}',
      'evilKey.injected': 'dangerous_value',
    };

    const count = GDrive.applySnapshot(dataset, mockStorage);
    assert.equal(count, 2);
    assert.equal(storageMap['moneySuperapp.theme'], 'dark');
    assert.equal(storageMap['remainingMoneyCalculator.state.v1'], '{"income":50000}');
    assert.equal(storageMap['evilKey.injected'], undefined);
  });

  await t.test('6. formatSyncTimestamp bilingual presentation', () => {
    const testDate = new Date('2026-10-29T10:00:00.000Z');
    const thStr = GDrive.formatSyncTimestamp(testDate, 'th');
    const enStr = GDrive.formatSyncTimestamp(testDate, 'en');

    assert.ok(typeof thStr === 'string' && thStr.length > 0);
    assert.ok(typeof enStr === 'string' && enStr.length > 0);
    assert.equal(GDrive.formatSyncTimestamp(null, 'th'), 'ไม่เคย');
    assert.equal(GDrive.formatSyncTimestamp(null, 'en'), 'Never');
  });
});
