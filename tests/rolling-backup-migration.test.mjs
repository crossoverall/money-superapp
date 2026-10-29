import assert from 'node:assert/strict';
import test from 'node:test';

// Load engine under test
import '../js/engines/storage-db.js';

test('Phase 147: Automated Periodic Rolling Backup Scheduler & Schema Migration Suite', async (t) => {
  const RollingBackup = globalThis.MoneyApp.RollingBackup;
  const SchemaMigration = globalThis.MoneyApp.SchemaMigration;

  await t.test('1. Core API Registration and Constants', () => {
    assert.ok(RollingBackup, 'MoneyApp.RollingBackup must be defined');
    assert.equal(typeof RollingBackup.listSnapshots, 'function');
    assert.equal(typeof RollingBackup.createSnapshot, 'function');
    assert.equal(typeof RollingBackup.restoreSnapshot, 'function');
    assert.equal(typeof RollingBackup.deleteSnapshot, 'function');
    assert.equal(typeof RollingBackup.checkAndTriggerAutoBackup, 'function');
    assert.equal(RollingBackup.MAX_SNAPSHOTS, 5);

    assert.ok(SchemaMigration, 'MoneyApp.SchemaMigration must be defined');
    assert.equal(typeof SchemaMigration.getStoredVersion, 'function');
    assert.equal(typeof SchemaMigration.migrate, 'function');
    assert.equal(SchemaMigration.CURRENT_VERSION, 3);
  });

  await t.test('2. RollingBackup: createSnapshot and 5-snapshot ring buffer pruning', () => {
    const mockStorage = {
      'moneySuperapp.theme': 'dark',
      'remainingMoneyCalculator.state.v1': '{"income":60000}',
      'rebalanceCalculator.state.v1': '{"assets":[]}',
      'forbidden.key': 'evil',
    };

    // Create 6 snapshots sequentially
    for (let i = 1; i <= 6; i++) {
      RollingBackup.createSnapshot(mockStorage, `Snapshot ${i}`);
    }

    const snapshots = RollingBackup.listSnapshots(mockStorage);
    assert.equal(snapshots.length, 5, 'Ring buffer must prune to maximum 5 snapshots');
    assert.equal(snapshots[0].label, 'Snapshot 6', 'Latest snapshot must be at index 0');
    assert.equal(snapshots[4].label, 'Snapshot 2', 'Oldest preserved snapshot must be Snapshot 2');

    // Data filtering check
    assert.equal(snapshots[0].data['forbidden.key'], undefined, 'Disallowed keys must not be in snapshot');
    assert.equal(snapshots[0].data['moneySuperapp.theme'], 'dark');
  });

  await t.test('3. RollingBackup: restoreSnapshot and deleteSnapshot', () => {
    const mockStorage = {
      'moneySuperapp.theme': 'dark',
      'remainingMoneyCalculator.state.v1': '{"income":60000}',
    };

    const snap = RollingBackup.createSnapshot(mockStorage, 'Baseline');
    assert.ok(snap);

    // Modify local storage
    mockStorage['moneySuperapp.theme'] = 'light';
    mockStorage['remainingMoneyCalculator.state.v1'] = '{"income":100000}';

    // Restore snapshot
    const restored = RollingBackup.restoreSnapshot(snap.id, mockStorage);
    assert.equal(restored, true);
    assert.equal(mockStorage['moneySuperapp.theme'], 'dark');
    assert.equal(mockStorage['remainingMoneyCalculator.state.v1'], '{"income":60000}');

    // Delete snapshot
    const deleted = RollingBackup.deleteSnapshot(snap.id, mockStorage);
    assert.equal(deleted, true);
    const remaining = RollingBackup.listSnapshots(mockStorage);
    assert.equal(
      remaining.some((s) => s.id === snap.id),
      false,
    );
  });

  await t.test('4. RollingBackup: checkAndTriggerAutoBackup interval gate', () => {
    const mockStorage = {
      'moneySuperapp.theme': 'dark',
    };

    // First run triggers auto-backup
    const snap1 = RollingBackup.checkAndTriggerAutoBackup(mockStorage, 24 * 3600 * 1000);
    assert.ok(snap1);

    // Immediate second run within 24h should return null
    const snap2 = RollingBackup.checkAndTriggerAutoBackup(mockStorage, 24 * 3600 * 1000);
    assert.equal(snap2, null, 'Must not duplicate backup within interval');
  });

  await t.test('5. SchemaMigration: getStoredVersion and forward migrations', () => {
    const mockStorage = {
      'moneySuperapp.financialGoals.v1': JSON.stringify({
        goals: [{ id: 'g1', name: 'Emergency Fund', targetAmount: 100000 }],
      }),
    };

    assert.equal(SchemaMigration.getStoredVersion(mockStorage), 1);

    const report = SchemaMigration.migrate(mockStorage, 3);
    assert.equal(report.fromVersion, 1);
    assert.equal(report.toVersion, 3);
    assert.ok(report.appliedMigrations.includes('v1_to_v2_active_profile'));
    assert.ok(report.appliedMigrations.includes('v2_to_v3_savings_goals_sinking_fund'));

    assert.equal(mockStorage['moneySuperapp.activeProfile'], 'default');
    assert.equal(mockStorage['moneySuperapp.schemaVersion'], '3');

    // Goals were upgraded with sinking fund properties
    const upgradedGoals = JSON.parse(mockStorage['moneySuperapp.financialGoals.v1']);
    assert.equal(upgradedGoals.goals[0].sinkingFundEnabled, true);
    assert.equal(upgradedGoals.goals[0].expectedReturnAnnual, 0.015);
  });
});
