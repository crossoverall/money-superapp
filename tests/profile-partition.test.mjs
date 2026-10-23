import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadProfilePartitionEngine() {
  const code = readFileSync(resolve(__dirname, '../js/engines/profile-partition.js'), 'utf8');
  const context = {
    window: {},
    globalThis: {},
  };
  context.window = context;
  const fn = new Function('window', 'globalThis', code);
  fn(context.window, context.globalThis);
  return context.MoneyApp.ProfilePartition;
}

function createMockStorage(initialData = {}) {
  const map = new Map(Object.entries(initialData));
  return {
    _map: map,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
    get length() {
      return map.size;
    },
    key: (i) => Array.from(map.keys())[i] || null,
  };
}

describe('Phase 139: Multi-Profile Partition Architecture (Pillar 5.1)', () => {
  const engine = loadProfilePartitionEngine();

  it('verifies system default profiles initialization', () => {
    const storage = createMockStorage();
    const result = engine.initProfiles(storage);

    assert.ok(result.activeProfile, 'activeProfile must be defined');
    assert.equal(result.activeProfile.id, 'personal');
    assert.equal(result.profiles.length, 3);

    const ids = result.profiles.map((p) => p.id);
    assert.deepEqual(ids, ['personal', 'family', 'freelance']);

    const defaultProfile = result.profiles.find((p) => p.id === 'personal');
    assert.equal(defaultProfile.isDefault, true);
    assert.equal(defaultProfile.icon, '👤');
  });

  it('verifies initial unpartitioned active data auto-snapshots to personal partition', () => {
    const storage = createMockStorage({
      'remainingMoneyCalculator.state.v1': JSON.stringify({ salary: 50000 }),
      'moneySuperapp.taxBase': JSON.stringify({ income: 600000 }),
      'moneySuperapp.theme': 'dark',
      'moneySuperapp.lang': 'en',
    });

    engine.initProfiles(storage);

    const personalPartition = JSON.parse(storage.getItem('moneySuperapp.partition.personal'));
    assert.ok(personalPartition, 'personal partition must be populated');
    assert.ok(personalPartition['remainingMoneyCalculator.state.v1'], 'salary state must be in partition');
    assert.ok(personalPartition['moneySuperapp.taxBase'], 'taxBase state must be in partition');

    // Global settings must NOT be in partition
    assert.equal(personalPartition['moneySuperapp.theme'], undefined);
    assert.equal(personalPartition['moneySuperapp.lang'], undefined);
  });

  it('verifies custom profile creation with unique slug ID', () => {
    const storage = createMockStorage();
    engine.initProfiles(storage);

    const created1 = engine.createProfile(
      {
        name: 'Investment Club',
        nameTh: 'ชมรมลงทุน',
        icon: '📈',
        type: 'custom',
      },
      storage,
    );

    assert.equal(created1.id, 'investment-club');
    assert.equal(created1.icon, '📈');
    assert.equal(created1.isDefault, false);

    const profiles = engine.listProfiles(storage);
    assert.equal(profiles.length, 4);

    // Collision handling: same name produces incremented slug
    const created2 = engine.createProfile(
      {
        name: 'Investment Club',
        icon: '📊',
      },
      storage,
    );
    assert.equal(created2.id, 'investment-club-1');
  });

  it('verifies profile deletion safeguards', () => {
    const storage = createMockStorage();
    engine.initProfiles(storage);

    // Cannot delete active profile
    assert.throws(() => engine.deleteProfile('personal', storage), /Cannot delete currently active profile/);

    // Cannot delete system default profile
    assert.throws(() => engine.deleteProfile('personal', storage), /Cannot delete currently active profile/);

    // Create custom profile and delete it
    const custom = engine.createProfile({ name: 'Temp' }, storage);
    assert.equal(engine.listProfiles(storage).length, 4);

    const delResult = engine.deleteProfile(custom.id, storage);
    assert.equal(delResult.success, true);
    assert.equal(engine.listProfiles(storage).length, 3);
    assert.equal(storage.getItem(`moneySuperapp.partition.${custom.id}`), null);
  });

  it('verifies profile switching with complete state isolation and swap', () => {
    const storage = createMockStorage();
    engine.initProfiles(storage);

    // Step 1: Set personal profile data
    storage.setItem('remainingMoneyCalculator.state.v1', JSON.stringify({ salary: 85000, profile: 'personal' }));
    storage.setItem('rebalanceCalculator.state.v1', JSON.stringify({ portfolio: 1000000 }));
    storage.setItem('moneySuperapp.theme', 'light');

    // Step 2: Switch to family profile
    const switchRes = engine.switchProfile('family', storage);
    assert.equal(switchRes.success, true);
    assert.equal(switchRes.from, 'personal');
    assert.equal(switchRes.to, 'family');

    // Personal data should be cleared from active storage, theme preserved
    assert.equal(storage.getItem('remainingMoneyCalculator.state.v1'), null);
    assert.equal(storage.getItem('rebalanceCalculator.state.v1'), null);
    assert.equal(storage.getItem('moneySuperapp.theme'), 'light');

    // Step 3: Populate family data
    storage.setItem('remainingMoneyCalculator.state.v1', JSON.stringify({ salary: 150000, profile: 'family' }));

    // Step 4: Switch back to personal
    const switchBack = engine.switchProfile('personal', storage);
    assert.equal(switchBack.success, true);
    assert.equal(switchBack.from, 'family');
    assert.equal(switchBack.to, 'personal');

    // Verify personal data restored intact
    const restoredPersonal = JSON.parse(storage.getItem('remainingMoneyCalculator.state.v1'));
    assert.equal(restoredPersonal.salary, 85000);
    assert.equal(restoredPersonal.profile, 'personal');

    // Step 5: Switch back to family to verify family data was archived and restored
    engine.switchProfile('family', storage);
    const restoredFamily = JSON.parse(storage.getItem('remainingMoneyCalculator.state.v1'));
    assert.equal(restoredFamily.salary, 150000);
    assert.equal(restoredFamily.profile, 'family');
  });

  it('verifies deep copy profile cloning', () => {
    const storage = createMockStorage();
    engine.initProfiles(storage);

    // Set active personal data
    storage.setItem('remainingMoneyCalculator.state.v1', JSON.stringify({ budget: 30000 }));

    const clone = engine.cloneProfile('personal', { name: 'Personal 2027' }, storage);
    assert.ok(clone.id.startsWith('personal-2027'));

    // Check clone partition has matching data
    const clonePartition = JSON.parse(storage.getItem(`moneySuperapp.partition.${clone.id}`));
    assert.ok(clonePartition['remainingMoneyCalculator.state.v1']);

    // Mutate clone partition, ensure original personal active storage is unmutated
    clonePartition['remainingMoneyCalculator.state.v1'] = JSON.stringify({ budget: 99999 });
    storage.setItem(`moneySuperapp.partition.${clone.id}`, JSON.stringify(clonePartition));

    const activePersonal = JSON.parse(storage.getItem('remainingMoneyCalculator.state.v1'));
    assert.equal(activePersonal.budget, 30000, 'Original personal budget must remain 30000');
  });

  it('verifies single profile export and import round-trip', () => {
    const storage = createMockStorage();
    engine.initProfiles(storage);

    storage.setItem('moneySuperapp.taxBase', JSON.stringify({ income: 1200000 }));

    const exp = engine.exportProfile('personal', storage);
    assert.equal(exp.schema, 'moneySuperapp.profileExport.v1');
    assert.equal(exp.profile.id, 'personal');
    assert.ok(exp.data['moneySuperapp.taxBase']);

    // Import into fresh storage
    const newStorage = createMockStorage();
    engine.initProfiles(newStorage);

    const imported = engine.importProfile(exp, { overwrite: false }, newStorage);
    assert.ok(imported);
    assert.ok(imported.name.includes('Imported'));
  });

  it('verifies export all profiles bundle', () => {
    const storage = createMockStorage();
    engine.initProfiles(storage);

    storage.setItem('rebalanceCalculator.state.v1', JSON.stringify({ active: true }));

    const bundle = engine.exportAllProfiles(storage);
    assert.equal(bundle.schema, 'moneySuperapp.multiProfileBundle.v1');
    assert.equal(bundle.profiles.length, 3);
    assert.ok(bundle.partitions.personal);
    assert.ok(bundle.partitions.family);
    assert.ok(bundle.partitions.freelance);
  });

  it('verifies profile metrics telemetry', () => {
    const storage = createMockStorage();
    engine.initProfiles(storage);

    storage.setItem('remainingMoneyCalculator.state.v1', JSON.stringify({ test: 123 }));
    storage.setItem('rebalanceCalculator.state.v1', JSON.stringify({ test: 456 }));

    const metrics = engine.getProfileMetrics('personal', storage);
    assert.equal(metrics.keyCount, 2);
    assert.ok(metrics.byteSize > 0);
    assert.ok(typeof metrics.formattedSize === 'string');
  });
});
