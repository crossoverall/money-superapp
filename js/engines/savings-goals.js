/**
 * Money Superapp - Goal-Based Savings Planner Engine
 * Phase 144 (v2.6.5) - Sinking fund contribution calculation, multi-strategy surplus distribution,
 * compound growth trajectory generation, and goal persistence.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  const STORAGE_KEY = 'moneySuperapp.savingsGoals.v1';

  const parseNum = (val) => {
    if (global.MoneyApp && typeof global.MoneyApp.parseNum === 'function') {
      const res = global.MoneyApp.parseNum(val);
      return typeof res === 'number' && Number.isFinite(res) && !Number.isNaN(res) ? res : 0;
    }
    if (typeof val === 'number') return Number.isNaN(val) || !Number.isFinite(val) ? 0 : val;
    const clean = String(val || '')
      .replace(/,/g, '')
      .trim();
    const n = Number.parseFloat(clean);
    return Number.isNaN(n) || !Number.isFinite(n) ? 0 : n;
  };

  /**
   * @typedef {Object} SavingsGoal
   * @property {string} id - Unique identifier for the savings goal
   * @property {string} name - Human-readable goal name
   * @property {number} targetAmount - Target financial amount (THB)
   * @property {number} currentAmount - Current accumulated savings balance (THB)
   * @property {number} remainingAmount - Deficit to reach targetAmount (THB)
   * @property {number} targetMonths - Desired timeline in months
   * @property {number} annualRatePct - Expected annual return or interest rate (%)
   * @property {number} priority - Allocation priority rank (1 = highest)
   * @property {string} category - Category tag (emergency, travel, house, car, retirement, education, investment, other)
   * @property {number} progressPct - Percentage of target achieved (0-100)
   * @property {boolean} isCompleted - True if target is reached or exceeded
   * @property {number} requiredMonthly - Monthly contribution required to reach target in targetMonths
   * @property {string} createdAt - ISO timestamp of goal creation
   * @property {string} updatedAt - ISO timestamp of goal update
   */

  /**
   * Computes the required monthly contribution to reach targetAmount within targetMonths,
   * taking into account currentAmount and compound interest (sinking fund ordinary annuity formula).
   * Fallback to 0% linear amortization if rate <= 0, and clamps to 0 if already funded.
   *
   * Formula:
   * FV_current = currentAmount * (1 + r)^n
   * If FV_current >= targetAmount => 0
   * Shortfall = targetAmount - FV_current
   * PMT = Shortfall * r / ((1 + r)^n - 1)
   *
   * @param {Object} params
   * @param {number|string} [params.targetAmount=0] - Target goal balance (THB)
   * @param {number|string} [params.currentAmount=0] - Current balance (THB)
   * @param {number|string} [params.targetMonths=1] - Target duration in months
   * @param {number|string} [params.annualRatePct=0] - Annual interest or return rate (%)
   * @returns {number} Monthly contribution required (THB)
   */
  function computeRequiredMonthlyContribution(params) {
    const opts = params || {};
    const targetAmount = Math.max(0, parseNum(opts.targetAmount));
    const currentAmount = Math.max(0, parseNum(opts.currentAmount));
    const targetMonths = Math.max(1, Math.round(parseNum(opts.targetMonths) || 1));
    const annualRatePct = Math.max(0, parseNum(opts.annualRatePct));

    // Target already funded
    if (currentAmount >= targetAmount || targetAmount <= 0) {
      return 0;
    }

    // 0% interest fallback: simple linear division
    if (annualRatePct <= 0) {
      const diff = targetAmount - currentAmount;
      return Math.round((diff / targetMonths) * 100) / 100;
    }

    const monthlyRate = annualRatePct / 100 / 12;
    const compoundFactor = (1 + monthlyRate) ** targetMonths;

    // Initial principal compounded over targetMonths
    const futureCurrent = currentAmount * compoundFactor;
    if (futureCurrent >= targetAmount) {
      return 0;
    }

    const shortfall = targetAmount - futureCurrent;
    const denom = compoundFactor - 1;

    if (denom <= 0 || !Number.isFinite(denom)) {
      return Math.round(((targetAmount - currentAmount) / targetMonths) * 100) / 100;
    }

    const pmt = (shortfall * monthlyRate) / denom;
    if (!Number.isFinite(pmt) || Number.isNaN(pmt) || pmt < 0) {
      return 0;
    }

    return Math.round(pmt * 100) / 100;
  }

  /**
   * Creates and validates a normalized savings goal model.
   *
   * @param {Partial<SavingsGoal>} [params]
   * @returns {SavingsGoal} Normalized savings goal
   */
  function createGoal(params) {
    const opts = params || {};
    const id =
      typeof opts.id === 'string' && opts.id.trim()
        ? opts.id.trim()
        : `goal_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

    const name = typeof opts.name === 'string' && opts.name.trim() ? opts.name.trim() : 'เป้าหมายการออม (New Goal)';

    const targetAmount = Math.max(0, parseNum(opts.targetAmount));
    const currentAmount = Math.max(0, parseNum(opts.currentAmount));
    const targetMonths = Math.max(1, Math.round(parseNum(opts.targetMonths) || 12));
    const annualRatePct = Math.max(0, parseNum(opts.annualRatePct));

    let priority = 1;
    if (typeof opts.priority === 'number') {
      priority = Math.max(1, Math.round(opts.priority));
    } else if (typeof opts.priority === 'string') {
      const parsedP = parseInt(opts.priority, 10);
      if (!Number.isNaN(parsedP) && parsedP >= 1) {
        priority = parsedP;
      } else if (opts.priority.toLowerCase() === 'high') {
        priority = 1;
      } else if (opts.priority.toLowerCase() === 'medium') {
        priority = 2;
      } else if (opts.priority.toLowerCase() === 'low') {
        priority = 3;
      }
    }

    const category =
      typeof opts.category === 'string' && opts.category.trim() ? opts.category.trim().toLowerCase() : 'other';

    const remainingAmount = Math.max(0, Math.round((targetAmount - currentAmount) * 100) / 100);
    const isCompleted = targetAmount > 0 && currentAmount >= targetAmount;

    let progressPct = 0;
    if (targetAmount > 0) {
      progressPct = Math.min(100, Math.round((currentAmount / targetAmount) * 1000) / 10);
    } else if (currentAmount > 0) {
      progressPct = 100;
    }

    const requiredMonthly = computeRequiredMonthlyContribution({
      targetAmount: targetAmount,
      currentAmount: currentAmount,
      targetMonths: targetMonths,
      annualRatePct: annualRatePct,
    });

    const nowIso = new Date().toISOString();
    const createdAt = typeof opts.createdAt === 'string' && opts.createdAt ? opts.createdAt : nowIso;
    const updatedAt = typeof opts.updatedAt === 'string' && opts.updatedAt ? opts.updatedAt : nowIso;

    return {
      id: id,
      name: name,
      targetAmount: targetAmount,
      currentAmount: currentAmount,
      remainingAmount: remainingAmount,
      targetMonths: targetMonths,
      annualRatePct: annualRatePct,
      priority: priority,
      category: category,
      progressPct: progressPct,
      isCompleted: isCompleted,
      requiredMonthly: requiredMonthly,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  }

  /**
   * Allocates monthly surplus across multiple savings goals based on the selected strategy.
   * Ensures capital conservation (sum(allocated) <= monthlySurplus).
   *
   * Supported strategies:
   * - 'priority': Waterfall distribution based on priority rank (1 = highest).
   *               Fulfills required monthly contributions in priority order;
   *               excess surplus cascades to highest priority uncompleted goals.
   * - 'proportional': Distributes surplus proportionally to each goal's required monthly contribution
   *                   (or remaining amount), capped at remaining debt.
   * - 'balanced': Evenly splits surplus across active uncompleted goals.
   *
   * @param {Array<Partial<SavingsGoal>>} goals - List of goals
   * @param {number|string} monthlySurplus - Total surplus available for allocation (THB)
   * @param {'priority'|'proportional'|'balanced'} [strategy='priority'] - Allocation strategy
   * @returns {Array<Object>} Allocation results per goal with capital conservation metadata
   */
  function allocateMonthlySurplus(goals, monthlySurplus, strategy) {
    const strat = (strategy || 'priority').toLowerCase();
    const surplus = Math.max(0, parseNum(monthlySurplus));

    if (!Array.isArray(goals) || goals.length === 0) {
      const emptyRes = [];
      emptyRes.strategy = strat;
      emptyRes.monthlySurplus = surplus;
      emptyRes.totalAllocated = 0;
      emptyRes.unallocated = surplus;
      emptyRes.allocations = emptyRes;
      emptyRes.byGoalId = {};
      return emptyRes;
    }

    // Hydrate goals to ensure consistent fields
    const hydratedGoals = goals.map((g) => createGoal(g));
    const allocationsMap = {};
    let remainingSurplus = surplus;

    for (let i = 0; i < hydratedGoals.length; i++) {
      allocationsMap[hydratedGoals[i].id] = 0;
    }

    const activeGoals = hydratedGoals.filter((g) => g.remainingAmount > 0 && !g.isCompleted);

    if (activeGoals.length > 0 && remainingSurplus > 0) {
      if (strat === 'balanced') {
        // Equal split among active goals with redistribution of leftovers
        let unallocatedPool = remainingSurplus;
        let eligible = activeGoals.slice();

        while (eligible.length > 0 && unallocatedPool > 0.001) {
          const equalShare = unallocatedPool / eligible.length;
          const nextEligible = [];
          let allocatedInPass = 0;

          for (let b = 0; b < eligible.length; b++) {
            const g = eligible[b];
            const currentAlloc = allocationsMap[g.id];
            const maxAdditional = Math.max(0, g.remainingAmount - currentAlloc);
            const allocToAdd = Math.min(equalShare, maxAdditional);

            allocationsMap[g.id] += allocToAdd;
            allocatedInPass += allocToAdd;

            if (allocationsMap[g.id] < g.remainingAmount - 0.001) {
              nextEligible.push(g);
            }
          }

          unallocatedPool -= allocatedInPass;
          if (allocatedInPass <= 0.0001 || nextEligible.length === eligible.length) {
            break;
          }
          eligible = nextEligible;
        }
      } else if (strat === 'proportional') {
        // Proportional to requiredMonthly (or remainingAmount if total required == 0)
        let unallocatedPoolProp = remainingSurplus;
        let eligibleProp = activeGoals.slice();

        while (eligibleProp.length > 0 && unallocatedPoolProp > 0.001) {
          let totalWeight = eligibleProp.reduce((sum, g) => {
            const w = g.requiredMonthly > 0 ? g.requiredMonthly : g.remainingAmount;
            return sum + w;
          }, 0);

          if (totalWeight <= 0) {
            totalWeight = eligibleProp.length;
          }

          const nextEligibleProp = [];
          let allocatedInPassProp = 0;

          for (let p = 0; p < eligibleProp.length; p++) {
            const gp = eligibleProp[p];
            let weight = gp.requiredMonthly > 0 ? gp.requiredMonthly : gp.remainingAmount;
            if (weight <= 0) weight = 1;

            const propShare = (unallocatedPoolProp * weight) / totalWeight;
            const curAlloc = allocationsMap[gp.id];
            const maxCanAdd = Math.max(0, gp.remainingAmount - curAlloc);
            const actualAdd = Math.min(propShare, maxCanAdd);

            allocationsMap[gp.id] += actualAdd;
            allocatedInPassProp += actualAdd;

            if (allocationsMap[gp.id] < gp.remainingAmount - 0.001) {
              nextEligibleProp.push(gp);
            }
          }

          unallocatedPoolProp -= allocatedInPassProp;
          if (allocatedInPassProp <= 0.0001 || nextEligibleProp.length === eligibleProp.length) {
            break;
          }
          eligibleProp = nextEligibleProp;
        }
      } else {
        // Strategy: 'priority' (waterfall)
        // Sort active goals by priority ascending (1 is highest priority)
        const sortedGoals = activeGoals.slice().sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          return a.targetMonths - b.targetMonths;
        });

        // Stage 1: Allocate up to required monthly contribution in priority order
        for (let s1 = 0; s1 < sortedGoals.length; s1++) {
          if (remainingSurplus <= 0.001) break;
          const sg1 = sortedGoals[s1];
          const need = Math.min(sg1.requiredMonthly, sg1.remainingAmount);
          if (need > 0) {
            const grant = Math.min(need, remainingSurplus);
            allocationsMap[sg1.id] += grant;
            remainingSurplus -= grant;
          }
        }

        // Stage 2: Cascade excess surplus into top-priority goals up to remainingAmount
        for (let s2 = 0; s2 < sortedGoals.length; s2++) {
          if (remainingSurplus <= 0.001) break;
          const sg2 = sortedGoals[s2];
          const curAllocated = allocationsMap[sg2.id];
          const maxMore = Math.max(0, sg2.remainingAmount - curAllocated);
          if (maxMore > 0) {
            const extra = Math.min(maxMore, remainingSurplus);
            allocationsMap[sg2.id] += extra;
            remainingSurplus -= extra;
          }
        }
      }
    }

    // Build normalized result entries
    const results = [];
    let totalAllocated = 0;

    for (let k = 0; k < hydratedGoals.length; k++) {
      const goal = hydratedGoals[k];
      const rawAlloc = allocationsMap[goal.id] || 0;
      const allocated = Math.round(rawAlloc * 100) / 100;
      totalAllocated += allocated;

      const newCurrentAmount = Math.round((goal.currentAmount + allocated) * 100) / 100;
      let newProgressPct = 0;
      if (goal.targetAmount > 0) {
        newProgressPct = Math.min(100, Math.round((newCurrentAmount / goal.targetAmount) * 1000) / 10);
      } else if (newCurrentAmount > 0) {
        newProgressPct = 100;
      }

      results.push({
        id: goal.id,
        goalId: goal.id,
        name: goal.name,
        allocated: allocated,
        requiredMonthly: goal.requiredMonthly,
        remainingAmount: goal.remainingAmount,
        currentAmount: goal.currentAmount,
        newCurrentAmount: newCurrentAmount,
        targetAmount: goal.targetAmount,
        progressPct: newProgressPct,
        isCompleted: goal.targetAmount > 0 && newCurrentAmount >= goal.targetAmount,
      });
    }

    // Strictly enforce capital conservation against floating-point rounding
    if (totalAllocated > surplus) {
      let overage = Math.round((totalAllocated - surplus) * 100) / 100;
      for (let adj = results.length - 1; adj >= 0 && overage > 0; adj--) {
        if (results[adj].allocated >= overage) {
          results[adj].allocated = Math.round((results[adj].allocated - overage) * 100) / 100;
          results[adj].newCurrentAmount = Math.round((results[adj].currentAmount + results[adj].allocated) * 100) / 100;
          overage = 0;
        } else {
          overage -= results[adj].allocated;
          results[adj].allocated = 0;
          results[adj].newCurrentAmount = results[adj].currentAmount;
        }
      }
    }

    totalAllocated = Math.round(results.reduce((sum, item) => sum + item.allocated, 0) * 100) / 100;
    const unallocated = Math.max(0, Math.round((surplus - totalAllocated) * 100) / 100);

    const byGoalId = {};
    for (let m = 0; m < results.length; m++) {
      byGoalId[results[m].id] = results[m].allocated;
    }

    // Attach metadata properties directly to results array
    results.strategy = strat;
    results.monthlySurplus = surplus;
    results.totalAllocated = totalAllocated;
    results.unallocated = unallocated;
    results.allocations = results;
    results.byGoalId = byGoalId;

    return results;
  }

  /**
   * Generates month-by-month compound savings trajectory schedule.
   * Month 0 represents the baseline initial state.
   *
   * @param {Partial<SavingsGoal>} goal - Savings goal parameters
   * @param {number|string} [monthlyContribution] - Monthly contribution amount (defaults to goal's requiredMonthly)
   * @param {number|string} [months] - Horizon duration in months (defaults to goal's targetMonths)
   * @returns {Array<{ month: number, principal: number, interestEarned: number, totalBalance: number, progressPct: number }>}
   */
  function generateGoalTrajectory(goal, monthlyContribution, months) {
    const g = createGoal(goal || {});
    let contribution = 0;
    if (monthlyContribution !== undefined && monthlyContribution !== null) {
      contribution = Math.max(0, parseNum(monthlyContribution));
    } else {
      contribution = g.requiredMonthly;
    }
    if (!Number.isFinite(contribution)) contribution = 0;

    let horizon =
      months !== undefined && months !== null
        ? Math.max(1, Math.min(600, Math.round(parseNum(months) || 1)))
        : Math.max(1, Math.min(600, g.targetMonths));
    if (!Number.isFinite(horizon)) horizon = 12;

    let monthlyRate = g.annualRatePct > 0 ? g.annualRatePct / 100 / 12 : 0;
    if (!Number.isFinite(monthlyRate)) monthlyRate = 0;

    const trajectory = [];
    let currentBalance = g.currentAmount;
    let cumulativePrincipal = g.currentAmount;
    let cumulativeInterest = 0;

    let initialProgressPct = 0;
    if (g.targetAmount > 0) {
      initialProgressPct = Math.min(100, Math.round((currentBalance / g.targetAmount) * 1000) / 10);
    } else if (currentBalance > 0) {
      initialProgressPct = 100;
    }

    trajectory.push({
      month: 0,
      principal: Number.isFinite(cumulativePrincipal) ? Math.round(cumulativePrincipal * 100) / 100 : 0,
      interestEarned: 0,
      totalBalance: Number.isFinite(currentBalance) ? Math.round(currentBalance * 100) / 100 : 0,
      progressPct: Number.isFinite(initialProgressPct) ? initialProgressPct : 0,
    });

    for (let m = 1; m <= horizon; m++) {
      let monthInterest = currentBalance * monthlyRate;
      if (!Number.isFinite(monthInterest)) monthInterest = 0;
      currentBalance += monthInterest + contribution;
      cumulativeInterest += monthInterest;
      cumulativePrincipal += contribution;

      if (!Number.isFinite(currentBalance)) currentBalance = 0;
      if (!Number.isFinite(cumulativePrincipal)) cumulativePrincipal = 0;
      if (!Number.isFinite(cumulativeInterest)) cumulativeInterest = 0;

      let progressPct = 0;
      if (g.targetAmount > 0) {
        progressPct = Math.min(100, Math.round((currentBalance / g.targetAmount) * 1000) / 10);
      } else if (currentBalance > 0) {
        progressPct = 100;
      }

      trajectory.push({
        month: m,
        principal: Math.round(cumulativePrincipal * 100) / 100,
        interestEarned: Math.round(cumulativeInterest * 100) / 100,
        totalBalance: Math.round(currentBalance * 100) / 100,
        progressPct: Number.isFinite(progressPct) ? progressPct : 0,
      });
    }

    return trajectory;
  }

  /**
   * Default starter goals for Thai personal finance context
   */
  const DEFAULT_GOALS = [
    {
      id: 'goal-emergency-fund',
      name: 'เงินสำรองฉุกเฉิน (Emergency Fund)',
      targetAmount: 100000,
      currentAmount: 25000,
      targetMonths: 12,
      annualRatePct: 1.5,
      priority: 1,
      category: 'emergency',
    },
    {
      id: 'goal-vacation',
      name: 'ท่องเที่ยวประจำปี (Vacation)',
      targetAmount: 30000,
      currentAmount: 5000,
      targetMonths: 6,
      annualRatePct: 1.5,
      priority: 2,
      category: 'travel',
    },
    {
      id: 'goal-downpayment',
      name: 'เงินดาวน์บ้าน/คอนโด (Down Payment)',
      targetAmount: 300000,
      currentAmount: 60000,
      targetMonths: 24,
      annualRatePct: 2.5,
      priority: 3,
      category: 'house',
    },
  ];

  /**
   * Resolves active storage engine with localStorage fallback
   */
  function resolveStorage(storage) {
    if (storage && typeof storage.getItem === 'function') {
      return storage;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
    return {
      getItem: () => null,
      setItem: () => {},
    };
  }

  /**
   * Loads and normalizes savings goals from persistent storage.
   *
   * @param {Object} [storage] - Storage provider (defaults to localStorage)
   * @param {Array<Partial<SavingsGoal>>} [defaultGoals] - Fallback goals if none stored
   * @returns {Array<SavingsGoal>} Hydrated goals array
   */
  function loadGoals(storage, defaultGoals) {
    const store = resolveStorage(storage);
    try {
      const raw = store.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((g) => createGoal(g));
        }
      }
    } catch (_err) {
      // Storage corrupted or unavailable; use default fallback
    }

    const fallback = Array.isArray(defaultGoals) && defaultGoals.length > 0 ? defaultGoals : DEFAULT_GOALS;
    return fallback.map((g) => createGoal(g));
  }

  /**
   * Serializes and writes savings goals to persistent storage.
   *
   * @param {Object} [storage] - Storage provider (defaults to localStorage)
   * @param {Array<Partial<SavingsGoal>>} goals - Goals array to persist
   * @returns {boolean} True if successfully saved, false otherwise
   */
  function saveGoals(storage, goals) {
    const store = resolveStorage(storage);
    if (!Array.isArray(goals)) {
      return false;
    }

    try {
      const serialized = JSON.stringify(goals);
      store.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (_err) {
      return false;
    }
  }

  const SavingsGoals = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_GOALS: DEFAULT_GOALS,
    createGoal: createGoal,
    computeRequiredMonthlyContribution: computeRequiredMonthlyContribution,
    allocateMonthlySurplus: allocateMonthlySurplus,
    generateGoalTrajectory: generateGoalTrajectory,
    loadGoals: loadGoals,
    saveGoals: saveGoals,
  };

  // Attach to MoneyApp and global scope
  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.SavingsGoals = SavingsGoals;

  if (typeof global !== 'undefined') {
    if (typeof global.SavingsGoals === 'undefined') {
      global.SavingsGoals = SavingsGoals;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SavingsGoals;
  }
})(typeof window !== 'undefined' ? window : globalThis);
