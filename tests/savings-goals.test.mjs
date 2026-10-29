import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { createContext, Script } from 'node:vm';

const ROOT_DIR = process.cwd();
const engineCode = fs.readFileSync(path.join(ROOT_DIR, 'js/engines/savings-goals.js'), 'utf8');

function loadEngineInSandbox(initialStorage = {}) {
  const store = { ...initialStorage };
  const mockStorage = {
    getItem: (key) => (Object.hasOwn(store, key) ? store[key] : null),
    setItem: (key, val) => {
      store[key] = String(val);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
    },
  };

  const sandbox = {
    window: {},
    globalThis: {},
    localStorage: mockStorage,
    MoneyApp: {},
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  const script = new Script(engineCode);
  const ctx = createContext(sandbox);
  script.runInContext(ctx);

  return {
    SavingsGoals: sandbox.MoneyApp.SavingsGoals,
    mockStorage,
    store,
  };
}

describe('MoneyApp.SavingsGoals Engine Unit Tests (Phase 144)', () => {
  const { SavingsGoals } = loadEngineInSandbox();

  describe('Contract and Storage Key Definition', () => {
    it('declares STORAGE_KEY as moneySuperapp.savingsGoals.v1', () => {
      assert.strictEqual(SavingsGoals.STORAGE_KEY, 'moneySuperapp.savingsGoals.v1');
    });

    it('exports all 6 domain calculation and persistence methods', () => {
      assert.strictEqual(typeof SavingsGoals.createGoal, 'function');
      assert.strictEqual(typeof SavingsGoals.computeRequiredMonthlyContribution, 'function');
      assert.strictEqual(typeof SavingsGoals.allocateMonthlySurplus, 'function');
      assert.strictEqual(typeof SavingsGoals.generateGoalTrajectory, 'function');
      assert.strictEqual(typeof SavingsGoals.loadGoals, 'function');
      assert.strictEqual(typeof SavingsGoals.saveGoals, 'function');
    });

    it('provides sensible default starter goals in DEFAULT_GOALS', () => {
      assert.ok(Array.isArray(SavingsGoals.DEFAULT_GOALS));
      assert.ok(SavingsGoals.DEFAULT_GOALS.length >= 3);
      assert.ok(SavingsGoals.DEFAULT_GOALS.some((g) => g.category === 'emergency'));
    });
  });

  describe('createGoal Model Normalization', () => {
    it('normalizes goal fields with sensible defaults on empty input', () => {
      const g = SavingsGoals.createGoal();
      assert.ok(typeof g.id === 'string' && g.id.startsWith('goal_'));
      assert.strictEqual(g.targetAmount, 0);
      assert.strictEqual(g.currentAmount, 0);
      assert.strictEqual(g.targetMonths, 12);
      assert.strictEqual(g.annualRatePct, 0);
      assert.strictEqual(g.priority, 1);
      assert.strictEqual(g.category, 'other');
      assert.strictEqual(g.progressPct, 0);
      assert.strictEqual(g.isCompleted, false);
      assert.strictEqual(g.requiredMonthly, 0);
    });

    it('handles numeric strings with commas and whitespace', () => {
      const g = SavingsGoals.createGoal({
        id: 'car-goal',
        name: '  ซื้อรถยนต์คันใหม่  ',
        targetAmount: ' 800,000 ',
        currentAmount: ' 200,000 ',
        targetMonths: '24',
        annualRatePct: '2.5',
      });
      assert.strictEqual(g.id, 'car-goal');
      assert.strictEqual(g.name, 'ซื้อรถยนต์คันใหม่');
      assert.strictEqual(g.targetAmount, 800000);
      assert.strictEqual(g.currentAmount, 200000);
      assert.strictEqual(g.remainingAmount, 600000);
      assert.strictEqual(g.targetMonths, 24);
      assert.strictEqual(g.annualRatePct, 2.5);
      assert.strictEqual(g.progressPct, 25);
      assert.strictEqual(g.isCompleted, false);
    });

    it('parses priority across numeric and descriptive string values', () => {
      assert.strictEqual(SavingsGoals.createGoal({ priority: '1' }).priority, 1);
      assert.strictEqual(SavingsGoals.createGoal({ priority: 'high' }).priority, 1);
      assert.strictEqual(SavingsGoals.createGoal({ priority: 'medium' }).priority, 2);
      assert.strictEqual(SavingsGoals.createGoal({ priority: 'low' }).priority, 3);
      assert.strictEqual(SavingsGoals.createGoal({ priority: 5 }).priority, 5);
      assert.strictEqual(SavingsGoals.createGoal({ priority: -2 }).priority, 1);
    });

    it('detects completed status when current balance reaches or exceeds target', () => {
      const g = SavingsGoals.createGoal({
        targetAmount: 50000,
        currentAmount: 55000,
        targetMonths: 6,
      });
      assert.strictEqual(g.isCompleted, true);
      assert.strictEqual(g.remainingAmount, 0);
      assert.strictEqual(g.progressPct, 100);
      assert.strictEqual(g.requiredMonthly, 0);
    });
  });

  describe('computeRequiredMonthlyContribution (Sinking Fund Calculations)', () => {
    it('calculates 0% linear amortization accurately', () => {
      // 120,000 target, 0 current, 12 months, 0% => 10,000/mo
      const pmt1 = SavingsGoals.computeRequiredMonthlyContribution({
        targetAmount: 120000,
        currentAmount: 0,
        targetMonths: 12,
        annualRatePct: 0,
      });
      assert.strictEqual(pmt1, 10000);

      // 120,000 target, 24,000 current, 12 months, 0% => 96,000 / 12 = 8,000/mo
      const pmt2 = SavingsGoals.computeRequiredMonthlyContribution({
        targetAmount: 120000,
        currentAmount: 24000,
        targetMonths: 12,
        annualRatePct: 0,
      });
      assert.strictEqual(pmt2, 8000);
    });

    it('calculates compound interest sinking fund ordinary annuity accurately', () => {
      // Formula: targetAmount = 120,000, current = 0, n = 12, rate = 12% annual (1% monthly)
      // compound factor = (1 + 0.01)^12 = 1.12682503
      // PMT = 120,000 * 0.01 / (1.12682503 - 1) = 9461.85 THB/mo
      const pmt = SavingsGoals.computeRequiredMonthlyContribution({
        targetAmount: 120000,
        currentAmount: 0,
        targetMonths: 12,
        annualRatePct: 12,
      });
      assert.strictEqual(pmt, 9461.85);

      // Verify future value check: 9461.85 * ((1.01^12 - 1) / 0.01) = 120000
      const factor = (1.01 ** 12 - 1) / 0.01;
      assert.ok(Math.abs(pmt * factor - 120000) < 1);
    });

    it('accurately discounts initial current amount compounding over time', () => {
      // target = 100,000, current = 20,000, n = 24, rate = 6% (0.5% monthly)
      // (1 + 0.005)^24 = 1.12715978
      // futureCurrent = 20,000 * 1.12715978 = 22,543.20
      // shortfall = 100,000 - 22,543.20 = 77,456.80
      // pmt = 77,456.80 * 0.005 / (1.12715978 - 1) = 3045.65 THB/mo
      const pmt = SavingsGoals.computeRequiredMonthlyContribution({
        targetAmount: 100000,
        currentAmount: 20000,
        targetMonths: 24,
        annualRatePct: 6,
      });
      assert.strictEqual(pmt, 3045.65);
    });

    it('returns 0 when current amount already meets or exceeds target', () => {
      assert.strictEqual(
        SavingsGoals.computeRequiredMonthlyContribution({
          targetAmount: 50000,
          currentAmount: 50000,
          targetMonths: 10,
          annualRatePct: 2,
        }),
        0,
      );
      assert.strictEqual(
        SavingsGoals.computeRequiredMonthlyContribution({
          targetAmount: 50000,
          currentAmount: 60000,
          targetMonths: 10,
          annualRatePct: 2,
        }),
        0,
      );
    });

    it('returns 0 when current amount compounding alone reaches target without contributions', () => {
      // 50,000 compounded at 20% over 60 months (5 years) -> 50000 * (1 + 0.20/12)^60 = 134,818 >= 100,000
      const pmt = SavingsGoals.computeRequiredMonthlyContribution({
        targetAmount: 100000,
        currentAmount: 50000,
        targetMonths: 60,
        annualRatePct: 20,
      });
      assert.strictEqual(pmt, 0);
    });

    it('gracefully handles zero or negative months by clamping to 1 month', () => {
      const pmt = SavingsGoals.computeRequiredMonthlyContribution({
        targetAmount: 10000,
        currentAmount: 2000,
        targetMonths: 0,
        annualRatePct: 0,
      });
      assert.strictEqual(pmt, 8000);
    });
  });

  describe('allocateMonthlySurplus (Strategies & Capital Conservation)', () => {
    const goals = [
      {
        id: 'g1',
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 8000, // Remaining: 2,000
        targetMonths: 5, // Required: 400
        priority: 1,
      },
      {
        id: 'g2',
        name: 'Vacation',
        targetAmount: 6000,
        currentAmount: 0, // Remaining: 6,000
        targetMonths: 12, // Required: 500
        priority: 2,
      },
      {
        id: 'g3',
        name: 'Gadget',
        targetAmount: 3000,
        currentAmount: 0, // Remaining: 3,000
        targetMonths: 10, // Required: 300
        priority: 3,
      },
    ];

    it('strictly conserves capital (sum of allocations <= surplus)', () => {
      const surpluses = [100, 500, 900, 1200, 2500, 10000, 50000];
      const strategies = ['priority', 'proportional', 'balanced'];

      for (const surplus of surpluses) {
        for (const strategy of strategies) {
          const res = SavingsGoals.allocateMonthlySurplus(goals, surplus, strategy);
          const allocatedSum = res.reduce((acc, item) => acc + item.allocated, 0);

          assert.ok(
            allocatedSum <= surplus + 0.001,
            `Allocated sum ${allocatedSum} must not exceed surplus ${surplus} for strategy ${strategy}`,
          );
          assert.strictEqual(res.totalAllocated, Math.round(allocatedSum * 100) / 100);
          assert.strictEqual(res.unallocated, Math.round((surplus - res.totalAllocated) * 100) / 100);

          // No goal receives more than its remaining amount
          for (const item of res) {
            assert.ok(
              item.allocated <= item.remainingAmount + 0.001,
              `Goal ${item.id} allocated ${item.allocated} exceeds remaining ${item.remainingAmount}`,
            );
          }
        }
      }
    });

    it('executes priority strategy: funds higher priority required monthly first, cascades excess', () => {
      // Total required = 400 (g1) + 500 (g2) + 300 (g3) = 1,200
      // Case A: Surplus 600 (< 1200)
      // g1 gets 400 (priority 1 satisfied). g2 gets 200 (priority 2 partially funded). g3 gets 0.
      const resA = SavingsGoals.allocateMonthlySurplus(goals, 600, 'priority');
      assert.strictEqual(resA.byGoalId.g1, 400);
      assert.strictEqual(resA.byGoalId.g2, 200);
      assert.strictEqual(resA.byGoalId.g3, 0);
      assert.strictEqual(resA.totalAllocated, 600);
      assert.strictEqual(resA.unallocated, 0);

      // Case B: Surplus 2,000 (> 1200 required)
      // Stage 1 satisfies: g1 = 400, g2 = 500, g3 = 300 (sum 1200, 800 excess left)
      // Stage 2 cascades excess into highest priority (g1 needs 2000 - 400 = 1600 more):
      // g1 receives the entire 800 excess => total 1,200
      const resB = SavingsGoals.allocateMonthlySurplus(goals, 2000, 'priority');
      assert.strictEqual(resB.byGoalId.g1, 1200);
      assert.strictEqual(resB.byGoalId.g2, 500);
      assert.strictEqual(resB.byGoalId.g3, 300);
      assert.strictEqual(resB.totalAllocated, 2000);
      assert.strictEqual(resB.unallocated, 0);
    });

    it('executes proportional strategy based on required monthly weights', () => {
      // Required: g1=400 (33.3%), g2=500 (41.67%), g3=300 (25%) -> sum 1200
      const res = SavingsGoals.allocateMonthlySurplus(goals, 600, 'proportional');
      assert.strictEqual(res.byGoalId.g1, 200);
      assert.strictEqual(res.byGoalId.g2, 250);
      assert.strictEqual(res.byGoalId.g3, 150);
      assert.strictEqual(res.totalAllocated, 600);
      assert.strictEqual(res.unallocated, 0);
    });

    it('executes balanced strategy: evenly splits surplus, redistributing if capped', () => {
      // Active goals: 3 goals. Surplus = 900 => 300 each
      const res = SavingsGoals.allocateMonthlySurplus(goals, 900, 'balanced');
      assert.strictEqual(res.byGoalId.g1, 300);
      assert.strictEqual(res.byGoalId.g2, 300);
      assert.strictEqual(res.byGoalId.g3, 300);
      assert.strictEqual(res.totalAllocated, 900);
      assert.strictEqual(res.unallocated, 0);
    });

    it('redistributes surplus when a goal hits its remaining cap in balanced mode', () => {
      const nearCapGoals = [
        { id: 'c1', name: 'Cap Goal', targetAmount: 1000, currentAmount: 900 }, // needs 100
        { id: 'c2', name: 'Open Goal', targetAmount: 5000, currentAmount: 0 }, // needs 5000
      ];
      // Surplus = 600. Equal split is 300. But c1 only needs 100.
      // Leftover 200 goes to c2 => c1 gets 100, c2 gets 500.
      const res = SavingsGoals.allocateMonthlySurplus(nearCapGoals, 600, 'balanced');
      assert.strictEqual(res.byGoalId.c1, 100);
      assert.strictEqual(res.byGoalId.c2, 500);
      assert.strictEqual(res.totalAllocated, 600);
      assert.strictEqual(res.unallocated, 0);
    });

    it('handles zero, negative, or empty surplus and empty goals array', () => {
      const res1 = SavingsGoals.allocateMonthlySurplus([], 1000, 'priority');
      assert.strictEqual(res1.totalAllocated, 0);
      assert.strictEqual(res1.unallocated, 1000);

      const res2 = SavingsGoals.allocateMonthlySurplus(goals, 0, 'priority');
      assert.strictEqual(res2.totalAllocated, 0);
      assert.strictEqual(res2.unallocated, 0);

      const res3 = SavingsGoals.allocateMonthlySurplus(goals, -500, 'priority');
      assert.strictEqual(res3.totalAllocated, 0);
      assert.strictEqual(res3.unallocated, 0);
    });

    it('returns unallocated surplus when all goals are 100% completed', () => {
      const completedGoals = [
        { id: 'done1', targetAmount: 1000, currentAmount: 1000 },
        { id: 'done2', targetAmount: 2000, currentAmount: 2500 },
      ];
      const res = SavingsGoals.allocateMonthlySurplus(completedGoals, 5000, 'priority');
      assert.strictEqual(res.totalAllocated, 0);
      assert.strictEqual(res.unallocated, 5000);
      assert.strictEqual(res.byGoalId.done1, 0);
      assert.strictEqual(res.byGoalId.done2, 0);
    });
  });

  describe('generateGoalTrajectory (Compound Schedule Projections)', () => {
    it('generates accurate trajectory array starting at month 0', () => {
      const goal = {
        targetAmount: 120000,
        currentAmount: 20000,
        targetMonths: 10,
        annualRatePct: 0,
      };

      const traj = SavingsGoals.generateGoalTrajectory(goal, 10000, 10);
      assert.strictEqual(traj.length, 11); // Month 0 to 10

      // Month 0 check
      assert.strictEqual(traj[0].month, 0);
      assert.strictEqual(traj[0].principal, 20000);
      assert.strictEqual(traj[0].interestEarned, 0);
      assert.strictEqual(traj[0].totalBalance, 20000);
      assert.strictEqual(traj[0].progressPct, 16.7);

      // Month 10 check (20,000 + 10 * 10,000 = 120,000)
      assert.strictEqual(traj[10].month, 10);
      assert.strictEqual(traj[10].principal, 120000);
      assert.strictEqual(traj[10].interestEarned, 0);
      assert.strictEqual(traj[10].totalBalance, 120000);
      assert.strictEqual(traj[10].progressPct, 100);
    });

    it('tracks compound interest growth across trajectory months', () => {
      const goal = {
        targetAmount: 50000,
        currentAmount: 10000,
        targetMonths: 12,
        annualRatePct: 12, // 1% per month
      };

      const traj = SavingsGoals.generateGoalTrajectory(goal, 1000, 12);
      assert.strictEqual(traj.length, 13);

      // Month 1: 10,000 * 1% = 100 interest + 1,000 deposit = 11,100 balance
      assert.strictEqual(traj[1].month, 1);
      assert.strictEqual(traj[1].principal, 11000);
      assert.strictEqual(traj[1].interestEarned, 100);
      assert.strictEqual(traj[1].totalBalance, 11100);

      // Verify invariant: totalBalance == principal + interestEarned
      for (const pt of traj) {
        assert.ok(
          Math.abs(pt.totalBalance - (pt.principal + pt.interestEarned)) <= 0.02,
          `Month ${pt.month} balance identity failed: ${pt.totalBalance} vs ${pt.principal} + ${pt.interestEarned}`,
        );
      }
    });

    it('defaults monthlyContribution to requiredMonthly when omitted', () => {
      const goal = {
        targetAmount: 10000,
        currentAmount: 0,
        targetMonths: 10,
        annualRatePct: 0,
      };
      // requiredMonthly = 1,000
      const traj = SavingsGoals.generateGoalTrajectory(goal);
      assert.strictEqual(traj.length, 11);
      assert.strictEqual(traj[10].totalBalance, 10000);
      assert.strictEqual(traj[10].progressPct, 100);
    });
  });

  describe('loadGoals and saveGoals Storage Persistence', () => {
    it('saves and reloads goals using mock storage engine', () => {
      const { SavingsGoals: sg, mockStorage } = loadEngineInSandbox();
      const testGoals = [
        {
          id: 'test-car',
          name: 'ซื้อรถยนต์',
          targetAmount: 500000,
          currentAmount: 100000,
          targetMonths: 24,
          annualRatePct: 2,
          priority: 1,
          category: 'car',
        },
      ];

      const saved = sg.saveGoals(mockStorage, testGoals);
      assert.strictEqual(saved, true);

      const raw = mockStorage.getItem('moneySuperapp.savingsGoals.v1');
      assert.ok(raw?.includes('test-car'));

      const loaded = sg.loadGoals(mockStorage);
      assert.strictEqual(loaded.length, 1);
      assert.strictEqual(loaded[0].id, 'test-car');
      assert.strictEqual(loaded[0].name, 'ซื้อรถยนต์');
      assert.strictEqual(loaded[0].targetAmount, 500000);
      assert.strictEqual(loaded[0].currentAmount, 100000);
    });

    it('returns provided default goals or system defaults when storage is empty', () => {
      const { SavingsGoals: sg, mockStorage } = loadEngineInSandbox();
      const customDefaults = [
        {
          id: 'custom-default',
          name: 'กองทุนฉุกเฉินส่วนตัว',
          targetAmount: 50000,
          currentAmount: 10000,
        },
      ];

      const loadedCustom = sg.loadGoals(mockStorage, customDefaults);
      assert.strictEqual(loadedCustom.length, 1);
      assert.strictEqual(loadedCustom[0].id, 'custom-default');

      // Empty storage with no custom fallback returns DEFAULT_GOALS
      const loadedSystem = sg.loadGoals(mockStorage);
      assert.ok(loadedSystem.length >= 3);
      assert.strictEqual(loadedSystem[0].id, 'goal-emergency-fund');
    });

    it('gracefully recovers when stored JSON is corrupted', () => {
      const { SavingsGoals: sg, mockStorage } = loadEngineInSandbox();
      mockStorage.setItem('moneySuperapp.savingsGoals.v1', '{ invalid json garbage');

      const loaded = sg.loadGoals(mockStorage);
      assert.ok(Array.isArray(loaded));
      assert.ok(loaded.length >= 3);
      assert.strictEqual(loaded[0].id, 'goal-emergency-fund');
    });

    it('rejects non-array input on saveGoals', () => {
      const { SavingsGoals: sg, mockStorage } = loadEngineInSandbox();
      assert.strictEqual(sg.saveGoals(mockStorage, null), false);
      assert.strictEqual(sg.saveGoals(mockStorage, 'not an array'), false);
      assert.strictEqual(sg.saveGoals(mockStorage, {}), false);
    });
  });

  describe('Zero NaN & Infinity Fuzzer Invariants', () => {
    it('guarantees zero NaN, Infinity, or negative amounts across 100 randomized inputs', () => {
      const weirdValues = [
        NaN,
        Infinity,
        -Infinity,
        null,
        undefined,
        '',
        '   ',
        'invalid',
        -5000,
        0,
        1e9,
        0.00001,
        '100,000,000',
        {},
        [],
      ];

      for (let i = 0; i < 100; i++) {
        const randVal = () => weirdValues[Math.floor(Math.random() * weirdValues.length)];

        const pmt = SavingsGoals.computeRequiredMonthlyContribution({
          targetAmount: randVal(),
          currentAmount: randVal(),
          targetMonths: randVal(),
          annualRatePct: randVal(),
        });

        assert.ok(!Number.isNaN(pmt), `pmt must not be NaN at iter ${i}`);
        assert.ok(Number.isFinite(pmt), `pmt must be finite at iter ${i}`);
        assert.ok(pmt >= 0, `pmt must be non-negative at iter ${i}`);

        const goal = SavingsGoals.createGoal({
          targetAmount: randVal(),
          currentAmount: randVal(),
          targetMonths: randVal(),
          annualRatePct: randVal(),
          priority: randVal(),
        });

        assert.ok(!Number.isNaN(goal.targetAmount), `targetAmount must not be NaN at iter ${i}`);
        assert.ok(!Number.isNaN(goal.currentAmount), `currentAmount must not be NaN at iter ${i}`);
        assert.ok(!Number.isNaN(goal.requiredMonthly), `requiredMonthly must not be NaN at iter ${i}`);
        assert.ok(!Number.isNaN(goal.progressPct), `progressPct must not be NaN at iter ${i}`);
        assert.ok(goal.targetAmount >= 0);
        assert.ok(goal.currentAmount >= 0);
        assert.ok(goal.requiredMonthly >= 0);
        assert.ok(goal.progressPct >= 0 && goal.progressPct <= 100);

        const surplus = typeof randVal() === 'number' && Number.isFinite(randVal()) ? randVal() : 1000;
        const alloc = SavingsGoals.allocateMonthlySurplus([goal], surplus, 'priority');
        assert.ok(!Number.isNaN(alloc.totalAllocated));
        assert.ok(!Number.isNaN(alloc.unallocated));
        assert.ok(Number.isFinite(alloc.totalAllocated));
        assert.ok(Number.isFinite(alloc.unallocated));
        assert.ok(alloc.totalAllocated >= 0);
        assert.ok(alloc.unallocated >= 0);

        const traj = SavingsGoals.generateGoalTrajectory(goal, randVal(), 5);
        for (const pt of traj) {
          assert.ok(Number.isFinite(pt.principal));
          assert.ok(Number.isFinite(pt.interestEarned));
          assert.ok(Number.isFinite(pt.totalBalance));
          assert.ok(Number.isFinite(pt.progressPct));
        }
      }
    });
  });
});
