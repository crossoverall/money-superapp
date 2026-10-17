import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');

function createEnvironment() {
  const mockWindow = {
    addEventListener: () => {},
    document: {
      documentElement: { lang: '', dataset: {} },
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
    },
  };

  const fn = new Function('window', 'document', 'localStorage', `${sharedCode}; return window.MoneyApp;`);
  const MoneyApp = fn(mockWindow, mockWindow.document, mockWindow.localStorage);
  return { MoneyApp };
}

describe('MoneyApp.calculateTargetDateGlidepath (Target Date Glidepath Allocation Engine)', () => {
  const { MoneyApp } = createEnvironment();
  const calculateTargetDateGlidepath = MoneyApp.calculateTargetDateGlidepath;

  it('allocates maximum growth assets (Core ~80%) for young accumulator with 25+ years to retirement', () => {
    const res = calculateTargetDateGlidepath({
      currentAge: 25,
      targetRetirementAge: 60,
      currentYear: 2026,
      riskTolerance: 'moderate',
    });

    assert.equal(res.yearsToRetire, 35);
    assert.equal(res.phaseKey, 'early_accumulation');
    assert.equal(res.split.core, 80);
    assert.equal(res.split.ballast, 15);
    assert.equal(res.split.satellite, 5);
    assert.equal(res.split.core + res.split.ballast + res.split.satellite, 100);
    assert.ok(res.adviceTh.includes('มากกว่า 20 ปี'));
  });

  it('shifts to defensive capital preservation (Ballast ~70%) at or in retirement', () => {
    const res = calculateTargetDateGlidepath({
      currentAge: 60,
      targetRetirementAge: 60,
      currentYear: 2026,
      riskTolerance: 'moderate',
    });

    assert.equal(res.yearsToRetire, 0);
    assert.equal(res.phaseKey, 'distribution');
    assert.equal(res.split.core, 25);
    assert.equal(res.split.ballast, 70);
    assert.equal(res.split.satellite, 5);
    assert.equal(res.split.core + res.split.ballast + res.split.satellite, 100);
    assert.ok(res.adviceTh.includes('เข้าสู่วัยเกษียณแล้ว'));
  });

  it('smoothly interpolates allocation during mid-career transition (15 years to retire)', () => {
    const res = calculateTargetDateGlidepath({
      currentAge: 45,
      targetRetirementAge: 60,
      currentYear: 2026,
      riskTolerance: 'moderate',
    });

    assert.equal(res.yearsToRetire, 15);
    assert.equal(res.phaseKey, 'mid_transition');
    assert.equal(res.split.core, 58);
    assert.equal(res.split.ballast, 37);
    assert.equal(res.split.satellite, 5);
    assert.equal(res.split.core + res.split.ballast + res.split.satellite, 100);
  });

  it('respects risk tolerance profiles (aggressive vs conservative)', () => {
    const agg = calculateTargetDateGlidepath({
      currentAge: 30,
      targetRetirementAge: 60,
      currentYear: 2026,
      riskTolerance: 'aggressive',
    });
    assert.equal(agg.split.core, 85);
    assert.equal(agg.split.ballast, 5);
    assert.equal(agg.split.satellite, 10);
    assert.equal(agg.split.core + agg.split.ballast + agg.split.satellite, 100);

    const con = calculateTargetDateGlidepath({
      currentAge: 30,
      targetRetirementAge: 60,
      currentYear: 2026,
      riskTolerance: 'conservative',
    });
    assert.equal(con.split.core, 70);
    assert.equal(con.split.ballast, 25);
    assert.equal(con.split.satellite, 5);
    assert.equal(con.split.core + con.split.ballast + con.split.satellite, 100);
  });

  it('derives retirement horizon from targetYear cohort correctly', () => {
    const res = calculateTargetDateGlidepath({
      currentAge: 35,
      targetYear: 2040,
      currentYear: 2026,
      riskTolerance: 'moderate',
    });

    assert.equal(res.yearsToRetire, 14);
    assert.equal(res.targetRetirementAge, 49);
    assert.equal(res.phaseKey, 'mid_transition');
    assert.equal(res.split.core + res.split.ballast + res.split.satellite, 100);
  });

  it('gracefully handles empty, missing, or extreme inputs without throwing', () => {
    const emptyRes = calculateTargetDateGlidepath();
    assert.equal(emptyRes.split.core + emptyRes.split.ballast + emptyRes.split.satellite, 100);
    assert.equal(Number.isNaN(emptyRes.split.core), false);
    assert.equal(Number.isNaN(emptyRes.split.ballast), false);
    assert.equal(Number.isNaN(emptyRes.split.satellite), false);

    const pastRetirement = calculateTargetDateGlidepath({
      currentAge: 70,
      targetRetirementAge: 60,
      currentYear: 2026,
    });
    assert.equal(pastRetirement.yearsToRetire, -10);
    assert.equal(pastRetirement.phaseKey, 'distribution');
    assert.equal(pastRetirement.split.core, 25);
    assert.equal(pastRetirement.split.ballast, 70);
  });
});
